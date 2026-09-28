-- Migration: record a lost Stripe dispute truthfully + revoke_disputed_acquisition
-- (Launch Sprint 2, prerequisite 7: dispute / chargeback handling)
--
-- Status: Proposed. Written 2026-09-27. NOT yet applied to Supabase. NOT yet
-- verified. Released for Founder review and manual application through the
-- Supabase Dashboard SQL Editor, per the current convention
-- (docs/history/open-items.md item 18).
-- Authority: Diana Francis
--
-- Founder ruling, 2026-09-27 (docs/history/open-items.md item 22):
--   - Purchase-derived access is revoked ONLY when Stripe reports a
--     definitively lost dispute (charge.dispute.closed, status = lost).
--     Created, updated, under review, funds withdrawn, won, warning_closed,
--     and inquiries change nothing. There is no suspension or reinstatement.
--   - A lost dispute is NOT recorded as a refund. The acquisition moves to
--     status 'dispute_lost' with dispute_lost_at and provider_dispute_id.
--   - The entitlement revocation reason is exactly 'Stripe dispute lost'.
--   - provider_dispute_id records the lost dispute that moved the
--     acquisition into 'dispute_lost'. V1 does not model a history of
--     several disputes against one payment.
--   - Nothing is deleted.
--
-- Depends on 20260925120100_create_acquisitions.sql. Existing rows are
-- valid under the new check: 'verified' and 'refunded' rows carry no
-- dispute columns.

-- ---------------------------------------------------------------------------
-- acquisitions: dispute-lost outcome
-- ---------------------------------------------------------------------------

alter table acquisitions
  add column dispute_lost_at timestamptz null,
  add column provider_dispute_id text null;

-- One statement, so the table is never without an outcome check. Each
-- status carries only its own outcome facts:
--   verified     -> no refund, no dispute loss
--   refunded     -> refunded_at set, no dispute loss
--   dispute_lost -> dispute_lost_at and a non-blank provider_dispute_id
--                   set, no refund
alter table acquisitions
  drop constraint acquisitions_status_check,
  add constraint acquisitions_status_check
    check (status in ('verified', 'refunded', 'dispute_lost')),
  drop constraint acquisitions_refunded_at_matches_status_check,
  add constraint acquisitions_outcome_integrity_check
    check (
      (
        status = 'verified'
        and refunded_at is null
        and dispute_lost_at is null
        and provider_dispute_id is null
      )
      or (
        status = 'refunded'
        and refunded_at is not null
        and dispute_lost_at is null
        and provider_dispute_id is null
      )
      or (
        status = 'dispute_lost'
        and refunded_at is null
        and dispute_lost_at is not null
        and provider_dispute_id is not null
        and provider_dispute_id ~ '[^[:space:]]'
      )
    );

-- ---------------------------------------------------------------------------
-- revoke_refunded_acquisition (replaced: same signature, same grants)
-- ---------------------------------------------------------------------------
-- The only change: an acquisition that is not 'verified' is left exactly
-- as it is. Before this migration the only other status was 'refunded', so
-- behavior for existing rows is identical. Without this, a refund event
-- for a 'dispute_lost' acquisition would try to overwrite it as 'refunded'
-- and fail the outcome check on every Stripe retry.

create or replace function revoke_refunded_acquisition(
  p_payment_intent_id text,
  p_reason text
)
returns table (
  acquisition_id uuid,
  revoked_entitlement_id uuid,
  changed boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_acq acquisitions%rowtype;
begin
  select a.* into v_acq
  from acquisitions a
  where a.provider_payment_intent_id = p_payment_intent_id
  for update;

  if not found then
    return;
  end if;

  if v_acq.status <> 'verified' then
    return query select v_acq.id, v_acq.entitlement_id, false;
    return;
  end if;

  update acquisitions a
  set status = 'refunded', refunded_at = now(), updated_at = now()
  where a.id = v_acq.id;

  if v_acq.entitlement_id is not null then
    update entitlements e
    set status = 'revoked',
        revoked_at = now(),
        revocation_reason = p_reason,
        updated_at = now()
    where e.id = v_acq.entitlement_id
      and e.status = 'active';
  end if;

  return query select v_acq.id, v_acq.entitlement_id, true;
end;
$$;

-- ---------------------------------------------------------------------------
-- revoke_disputed_acquisition
-- ---------------------------------------------------------------------------
-- Called only by the Stripe webhook for a signature-verified
-- charge.dispute.closed event whose dispute status is 'lost'. Marks the
-- acquisition 'dispute_lost' and revokes ONLY the entitlement that this
-- acquisition produced, using the existing revocation columns. Other grants
-- for the same participant (for example an admin_grant) and other
-- acquisitions are untouched. Nothing is deleted.
--
-- Acts only on a 'verified' acquisition. A 'refunded' or already
-- 'dispute_lost' acquisition is left as it is (changed = false), so a
-- redelivered or second lost dispute changes nothing. A late replay of the
-- original payment cannot re-grant: record_verified_acquisition returns
-- early once entitlement_id is set or status is not 'verified'.
-- Returns zero rows when no acquisition carries this PaymentIntent.

create function revoke_disputed_acquisition(
  p_payment_intent_id text,
  p_dispute_id text,
  p_reason text
)
returns table (
  acquisition_id uuid,
  revoked_entitlement_id uuid,
  changed boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_acq acquisitions%rowtype;
begin
  if p_dispute_id is null or p_dispute_id !~ '[^[:space:]]' then
    raise exception 'A dispute id is required';
  end if;
  if p_reason is null or p_reason !~ '[^[:space:]]' then
    raise exception 'A revocation reason is required';
  end if;

  select a.* into v_acq
  from acquisitions a
  where a.provider_payment_intent_id = p_payment_intent_id
  for update;

  if not found then
    return;
  end if;

  if v_acq.status <> 'verified' then
    return query select v_acq.id, v_acq.entitlement_id, false;
    return;
  end if;

  update acquisitions a
  set status = 'dispute_lost',
      dispute_lost_at = now(),
      provider_dispute_id = p_dispute_id,
      updated_at = now()
  where a.id = v_acq.id;

  if v_acq.entitlement_id is not null then
    update entitlements e
    set status = 'revoked',
        revoked_at = now(),
        revocation_reason = p_reason,
        updated_at = now()
    where e.id = v_acq.entitlement_id
      and e.status = 'active';
  end if;

  return query select v_acq.id, v_acq.entitlement_id, true;
end;
$$;

-- Server-only, with the service-role key, like the other acquisition
-- functions. The revoke/grant pair for revoke_refunded_acquisition is
-- restated so the replaced function's privileges are explicit.
revoke all on function revoke_refunded_acquisition(text, text)
  from public, anon, authenticated;
revoke all on function revoke_disputed_acquisition(text, text, text)
  from public, anon, authenticated;
grant execute on function revoke_refunded_acquisition(text, text)
  to service_role;
grant execute on function revoke_disputed_acquisition(text, text, text)
  to service_role;
