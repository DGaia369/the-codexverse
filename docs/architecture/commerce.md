# Commerce Architecture: Waitlist, Sales Gate, and Founding Access

**Status (current, 2026-09-28):** Implemented, Verified Local. `next build` passes, and the in-process harnesses pass: Sprint 2 62/62, disputes 23/23. Migrations 1, 2, and 3 are **Applied and Verified Live**. In the Stripe **sandbox**, these Founder proofs **PASSED**: payment → access, full refund → revocation, replay idempotency, post-refund block, and fresh entry (`docs/history/2026-09-26-stripe-test-mode-proof.md`). The live lost-dispute proof was **interrupted** on 2026-09-28 and is pending a clean re-run (`docs/history/2026-09-27-dispute-sandbox-proof.md`). Commerce copy and the V1 refund policy are **Founder-approved and implemented** (2026-09-28). Public sales are **CLOSED**. Committed to `feature/pathway-two-remember` on 2026-09-28. Not merged. Not deployed. *(History: this document was first written 2026-09-25, before Stripe was configured.)*
**Date:** September 25, 2026 (updated September 27 and 28, 2026)
**Authority:** Diana Francis
**Directive:** Launch Sprint 2 (ReMEMBER™ Waitlist + Stripe Acquisition → Entitlement → Authorized Entry)

## Authority chain

Stripe verifies payment. the codeXverse™ decides product identity, eligibility, entitlement, authorization, and entry. Stripe is never an authorization authority.

Four separate things, never collapsed:

| Concept | Where it lives | Grants access? |
|---|---|---|
| Waitlist | `waitlist_interests` | Never |
| Eligibility | `checkRememberEligibility()` (`utils/remember.ts`) | No, necessary only |
| Purchase | `acquisitions` | No; it produces an entitlement |
| Entitlement | `entitlements` via `hasEffectiveEntitlement()` | With eligibility, through `authorizeRememberAccess()` |

`authorizeRememberAccess()` is unchanged. It reads eligibility and `entitlements` only. It never reads `waitlist_interests` or `acquisitions`.

## Sales gate

`utils/salesGate.ts` reads the server-only environment variable `REMEMBER_SALES_STATE`. It is never `NEXT_PUBLIC_*`, and no browser can change it.

| Value | Public card at `/pathways#remember` | `/remember/purchase` and checkout |
|---|---|---|
| unset, `closed`, or any unknown value | US$97 Founding Access, Opening Soon, waitlist | Unavailable, redirect to `/pathways#remember` |
| `test` | Unchanged: closed to the public | Available by direct URL, **only with a Stripe test key** (`sk_test_...`) |
| `open` | Purchase CTA replaces the waitlist | Available |

Set `open` only after the Founder rules OPEN FOUNDING ACCESS, which requires every prerequisite in the canonical list in `docs/history/open-items.md` item 22, including Founder approval of the participant-facing commerce copy. The webhook ignores the gate: a payment Stripe has verified is always recorded.

`/pathways` is prerendered, so its gate state is fixed at build time. On Vercel, changing an environment variable needs a redeploy anyway. `/remember/purchase` renders per request (`connection()`); without that, Next would prerender a closed-gate redirect.

## Part A: waitlist

- **UI:** `components/public/RememberWaitlist.tsx`, on the Pathway Two™: ReMEMBER™ card only. Founder-approved V1 copy is reproduced exactly. It uses a native button and form (keyboard operable), focuses the email field on expand and the confirmation on success, and puts errors in `role="alert"`. A ref guard and a disabled button block repeat submission. The two error lines reuse existing `/enter` copy.
- **Route:** `POST /api/waitlist` with `{ email, placement }`. The browser names only a placement. `utils/waitlist.ts` maps it server-side to `interest = pathway-two-remember` and `source = public_pathways_remember_card`, so a client cannot write other values. Email is trimmed, lowercased, and validated server-side. Bodies over 2 KB are rejected. Errors are codes only (`invalid_email`, `invalid_request`, `unavailable`).
- **Idempotency:** `INSERT ... ON CONFLICT (email, interest) DO NOTHING`. A new email and a repeated one get the identical `{ ok: true }`, so the route never reveals prior presence. The original `consent_at` is kept.
- **Data:** see `docs/architecture/database.md`, `waitlist_interests`. RLS is on with no policies, so only the service role can access it.
- **Not built:** confirmation email (excluded this sprint), rate limiting (none exists to reuse, and no dependency was added), and a withdrawal flow (`status` allows `withdrawn`, but nothing sets it; a repeat submission does not reactivate a withdrawn row).

## Part B: Founding Access

### Offer

`utils/offers.ts`: `remember-founding-access`, product `pathway-two-remember`, `9700` minor units, `usd`. `products` deliberately carries no price and no offers table exists, so this is the narrowest V1 home. Checkout uses inline `price_data`, so **no Stripe Product or Price object is needed**. The browser never submits amount, currency, product, offer, or entitlement source.

### Flow

```
/pathways#remember (only when REMEMBER_SALES_STATE=open)
  → /remember/purchase
      gate closed        → /pathways#remember
      unauthenticated    → /enter?next=remember-checkout → back here
      ineligible         → getRedirectForIneligibility() (unchanged)
      already entitled   → /remember (never offered a second purchase)
      eligible, not entitled → form POST /api/remember/checkout
  → /api/remember/checkout   (re-runs the gate and authorization; same-origin only)
  → Stripe Checkout (test mode)
      cancel  → /pathways#remember
      success → /remember/confirm?session_id=...
  → Stripe → POST /api/stripe/webhook (signed) → acquisition → entitlement
  → /remember/confirm → /remember
```

### Checkout (`app/api/remember/checkout/route.ts`)

This route creates the Checkout Session server-side and ignores the request body. It sets `client_reference_id` to the authenticated user id, and metadata `user_id`, `product_key`, and `offer_key` on both the session and the PaymentIntent. It grants nothing.

### Webhook (`app/api/stripe/webhook/route.ts`)

- The signature is verified with `stripe.webhooks.constructEvent()` against the raw body (`request.text()`). A missing signature, wrong secret, or tampered body returns 400 and grants nothing.
- Processed events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `charge.refunded`. Every other event is acknowledged and ignored.
- A paid session is granted only if **all** of these hold: `offer_key` matches, `payment_status = paid`, `mode = payment`, `amount_total = 9700`, `currency = usd`, `product_key` matches, and `client_reference_id` is a UUID equal to `metadata.user_id`. A mismatch is logged and grants nothing, and returns 200 because a retry cannot change a signed payload.
- Database or configuration failure returns 500, so Stripe retries.
- The grant goes through `grantVerifiedAcquisitionEntitlement()` (`utils/entitlements.ts`), which calls the `record_verified_acquisition` SQL function. In one transaction it inserts the acquisition (`ON CONFLICT (provider_checkout_session_id) DO NOTHING`), locks it (`FOR UPDATE`), and inserts one `verified_acquisition` entitlement only if the acquisition has none and has not been refunded. Retries and concurrent duplicates therefore create nothing new. A replay of a recorded Checkout Session must match every purchase-defining fact (user, product, offer, PaymentIntent, livemode, amount, currency; null-safe), or the function fails loudly and changes nothing. The webhook then returns 500, and Stripe retries until it gives up. This was a pre-application correction, 2026-09-26.
- Eligibility is not re-checked at payment time. It was checked before checkout, and `/remember` checks it again at entry.

### Post-purchase entry (`/remember/confirm`)

Stripe's success URL lands here, never on `/remember`, because the webhook may finish after the browser returns. **This page grants nothing.**

- Authorized participants go to `/remember`.
- Unauthenticated participants go to `/enter?next=remember-confirm`.
- A not-yet-entitled participant sees "Your payment is complete." only if the Checkout Session in the URL belongs to them, carries this offer, and is paid according to Stripe. A bounded poll (10 × 3 s) of `GET /api/remember/access` then follows. That endpoint returns only `{ authorized }`, and a manual check remains afterwards.
- Anything else shows a neutral "We can’t confirm this payment yet." state with no internal detail.

### Refunds, disputes, and reversal

- **Full refund** (`charge.refunded` with `refunded = true`): `revoke_refunded_acquisition` marks the acquisition `refunded` and revokes **only the entitlement that acquisition produced**, using the existing revocation columns (reason `Stripe full refund`). Nothing is deleted. Other grants such as `admin_grant` are untouched, and the call is idempotent. A late replay of the original payment event cannot re-grant.
- **Partial refund:** access is kept, and nothing is recorded in V1.
- **Refund before the payment is recorded** (out-of-order events): if the PaymentIntent carries this offer, the webhook returns 500 so Stripe retries until the acquisition exists.
- **Lost dispute** (Founder ruling 2026-09-27; **Implemented, Verified Local; migration Applied and Verified Live 2026-09-27; first sandbox proof attempt interrupted 2026-09-28, clean re-run pending**): only `charge.dispute.closed` with `status = lost` revokes access. `revoke_disputed_acquisition` marks the acquisition `dispute_lost` (never `refunded`), records `dispute_lost_at` and `provider_dispute_id`, and revokes **only the entitlement that acquisition produced** with reason `Stripe dispute lost`. Nothing is deleted. Other grants are untouched. It is idempotent: a redelivered or second lost dispute, or a lost dispute after a full refund, changes nothing. A late payment replay cannot re-grant.
- **Every other dispute outcome changes nothing:** `charge.dispute.created`, `.updated`, `.funds_withdrawn`, and `.funds_reinstated` are ignored, and `charge.dispute.closed` with `won`, `warning_closed`, or any other status returns 200 with no change. Inquiries and warnings do not affect access. There is no suspension or reinstatement in Launch Sprint 2, and no broader dispute-management system.
- **Lost dispute before the payment is recorded:** the same guard as refunds. If the PaymentIntent carries this offer, the webhook returns 500 so Stripe retries.
- **Refund after a lost dispute:** `revoke_refunded_acquisition` acts only on a `verified` acquisition (migration 3, Founder-approved), so a `dispute_lost` row stays as it is. The first recorded terminal reversal outcome is kept.
- The refund policy page (`/access-refund-policy`) carries the Founder-approved V1 policy (2026-09-28). It describes exactly the behavior above.

### Environment and Stripe Dashboard setup (manual, not done)

| Variable | Value | Where |
|---|---|---|
| `STRIPE_SECRET_KEY` | test secret key `sk_test_...` | `.env.local`, later Vercel |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from the webhook endpoint or the Stripe CLI | `.env.local`, later Vercel |
| `REMEMBER_SALES_STATE` | `test` for Founder verification; unset means closed | `.env.local` only, for now |

- In the Stripe Dashboard, in **test mode**, the only requirement is a webhook destination, subscribed to the four events above. For local testing, the Stripe CLI can replace it: `stripe listen --forward-to localhost:3919/api/stripe/webhook --events checkout.session.completed,checkout.session.async_payment_succeeded,charge.refunded,charge.dispute.closed`. The CLI prints the `whsec_` secret to use.
- No Stripe Product or Price is needed.
- Migrations are gated (Founder ruling 2026-09-25). First, the Founder applies `20260925120000_create_waitlist_interests.sql`, verifies its schema, constraints, RLS, and zero policies, and passes the waitlist browser proof: duplicate behavior, and no auth user, entitlement, or ReMEMBER™ session created. **Only after that** does `20260925120100_create_acquisitions.sql` proceed to Founder review and application. Stripe test-mode verification needs both.

## Commerce copy (Founder-approved V1, 2026-09-28)

The whole commerce copy set was approved in the Launch Sprint 2 batch lock on 2026-09-28 (`docs/history/open-items.md` item 22, prerequisite 9) and is implemented. The waitlist copy was approved earlier and is unchanged.

| Where | Copy |
|---|---|
| Public card (`/pathways#remember`) | "US$97 Founding Access"; closed-state pill "Opening Soon"; open-state CTA `BEGIN FOUNDING ACCESS` (the pill is hidden when the gate is open) |
| `/remember/purchase` | "Pathway Two™: ReMEMBER™" / "US$97 Founding Access, paid once." / `continue to payment` |
| `/remember/purchase?status=unavailable` | "Payment couldn’t start, and nothing was charged. Try once more." (shown only when checkout fails before Stripe, so nothing was charged) |
| Stripe Checkout line item (`utils/offers.ts`) | "Pathway Two™: ReMEMBER™ Founding Access" |
| `/remember/confirm`, paid, waiting | "Your payment is complete." / "ReMEMBER™ is being opened for you. This usually takes a few seconds." |
| `/remember/confirm`, slow | "This is taking a little longer than usual. Check again in a moment." / `check again` |
| `/remember/confirm`, unconfirmed | "We can’t confirm this payment yet." / "If you’ve just paid, check again in a moment." / "If you paid and this doesn’t change, write to hello@thecodexverse.com and I’ll sort it out." / `check again` / `return to Pathway Two™: ReMEMBER™` |
| `/access-refund-policy` | V1 Access & Refund Policy (approved rulings: one-time payment; full refund within 14 days on request to hello@thecodexverse.com, no reason needed; a full refund or a finally lost dispute closes purchase-derived access; a partial refund does not; nothing participant-created is automatically deleted; non-waivable consumer rights preserved; first-person voice) |
| Waitlist errors (existing `/enter` copy) | "That does not look like a complete address." / "Something did not go through. Try once more." |

The Entry Threshold button `continue` (participant experience, not commerce) was approved for V1 in the same batch (item 26). The proposal these came from is `docs/history/2026-09-28-commerce-copy-and-refund-policy-proposal.md`, which is now a historical record.

## Known limits

- A participant who has paid but whose webhook is still pending could, by navigating back to `/remember/purchase` directly, start a second Checkout. The confirmation page never links there.
- A paid session that the webhook rejects (mismatch) is logged but not surfaced anywhere else. It would need manual reconciliation in the Stripe Dashboard.
- `acquisitions.user_id` is `ON DELETE RESTRICT`, kept for V1 by Founder ruling on 2026-09-25: an auth user who has paid cannot be deleted until a deletion and retention policy exists (open item 23).
- Founder rulings of 2026-09-25 (refunds, disputes as a pre-live blocker, copy not approved, sales closed) and 2026-09-27 (lost-dispute-only revocation) are recorded in `docs/history/open-items.md` item 22.
- V1 records only the one lost dispute that moved an acquisition to `dispute_lost`. It does not model several disputes against one payment.
- Local development writes to the live Supabase project, so sandbox proofs leave `livemode = false` rows in the production database. Founder ruling 2026-09-28: these rows are **preserved** as historical proof evidence (`docs/history/open-items.md` item 27). **Any production reporting, revenue view, or reconciliation must filter on `acquisitions.livemode`**, and sandbox rows are never live revenue. Entitlements carry no `livemode` column: a purchase-derived entitlement's mode is that of the acquisition linked to it (`acquisitions.entitlement_id`).
- Delivery depends on a running webhook destination. With the Stripe CLI, a stopped listener means events are simply not delivered: the CLI does not queue or retry them. In production, a Dashboard endpoint gets Stripe's automatic retries.

## Related

- `docs/architecture/database.md`: `waitlist_interests`, `acquisitions`
- `docs/architecture/routing.md`
- `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md`
- `docs/history/open-items.md`, item 22
- `docs/history/2026-09-27-dispute-lost-migration-proposed.md`
- `docs/history/2026-09-27-dispute-lost-migration-applied.md`
- `docs/history/2026-09-27-dispute-sandbox-proof.md`
- `docs/history/2026-09-28-commerce-copy-and-refund-policy-proposal.md` (the proposal approved in the 2026-09-28 batch lock)
