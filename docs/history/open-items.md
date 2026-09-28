# Open Items Register

**Last reviewed:** July 25, 2026

1. **Stacy test status**  
   `Pending direct verification`

2. **First-screen alignment fix**  
   `Implemented or drafted, not verified`  
   Confirm in `app/page.tsx`.

3. **Email sequence**  
   `Verified Live`  
   Verified by Diana Francis. The former contradiction entry is resolved.

4. **Her Pathways / Her Evidence / Her Inheritances / Her Returning**  
   `Proposed`  
   Requires resonance review before release.

5. **Documentation review**  
   `First repository reading completed`  
   Claude Code successfully read Governance, Canon, Standards, Architecture, and History.

6. **Save my place / notify me when the next door opens**  
   `Unscoped feature`

7. **Clone DNA update**  
   `Pending`  
   The former email-status blocker is resolved.

8. **What this is not block**  
   `Written, not placed`

9. **Recognition Record™ deployment**  
   `Verified Local`  
   Not yet verified in production.

10. **Declaration™ PDF pagination**  
    `Verified Local`  
    Production behavior remains unverified until deployed and tested live.

11. **Empty architecture file**  
    `Requires ruling`  
    `docs/architecture/recognition-record.md` exists but is empty.

12. **Constitutional hierarchy conflict (README.md vs GOVERNANCE.md)**  
    `Ruled: GOVERNANCE.md authoritative for now`  
    `docs/README.md` proposes an alternate hierarchy adding Source above Canon and an Excavations layer. Diana Francis ruled GOVERNANCE.md stays authoritative. See `docs/history/2026-07-25-decision-log.md`. `docs/README.md` still contains the unreconciled alternate hierarchy text.

13. **`docs/canon/repository-principles.md` lacks Status and lock**  
    `Requires ruling`  
    Sits in `docs/canon/` with no `Status:` field and no lock date. Content duplicates `docs/README.md`'s opening line rather than stating constitutional content. Needs either a real status and canon-grade content, or removal from `docs/canon/`.

14. **Empty scaffolding in `docs/templates/`, `docs/excavations/`, `docs/source/`**  
    `Proposed, not yet populated`  
    All files in these three directories are 0 bytes. They correspond to layers named in `docs/README.md`'s unadopted hierarchy proposal (item 12). Populate or explicitly mark as placeholders.

15. **`docs/history/2026-07-25-first-constitutional-reading.md` is a 1-byte stub**  
    `In progress`  
    Currently open in Diana's editor. Left untouched; not yet a completed record.

16. **Decouple Supabase session refresh from route protection**
    `Status: RESOLVED (Phase 5A, 2026-09-14)`
    `Type: Authentication / session architecture`
    `Runtime impact: Source-verified fix; Set-Cookie refresh under an actual near-expiry token not directly observed (no such session state existed locally, and none was manufactured to force it).`

    Founder ruling: Option B, scoped. `proxy.ts` now carries a second, independent `REFRESH_ONLY` list (`/remember`, `/record`, `/record/evidence`) alongside the unchanged `PROTECTED` list. `REFRESH_ONLY` triggers Proxy's session-refresh branch but never Proxy's `/enter` redirect; each of those three pages keeps its own existing unauthenticated-participant redirect logic exactly as before. `PROTECTED`'s membership and meaning ("redirect unauthenticated requests to `/enter`") are unchanged. `/api/*` was not touched — Route Handlers already persist refreshed cookies correctly on their own.

    Verified locally: `/begin` (`PROTECTED`) still redirects to `/enter`; `/remember`, `/record`, `/record/evidence` (all `REFRESH_ONLY`) redirect to their own existing destinations, never to `/enter`; `/` and `/pathways` (neither list) make no Supabase call.

    See `docs/architecture/routing.md` ("Route Protection Mechanism"), `docs/architecture/session-management.md` ("Session Refresh Mechanism"), and `docs/history/2026-09-14-session-refresh-separation-applied.md` for the full record. Recorded 2026-09-10. Resolved 2026-09-14.

17. **Commerce + Access V1 entitlement schema and service (`products`, `entitlements`, `utils/entitlements.ts`)**
    `Status: Applied and Verified Live (Phase 3 + Phase 3A + Phase 4)`
    `Type: Database schema / Application service / Commerce + Access`

    **Phase 3** — Applied manually through the Supabase Dashboard SQL Editor, September 13, 2026, and independently verified against live PostgreSQL system catalogs the same day. See `docs/history/2026-09-13-commerce-access-entitlement-schema-applied.md`.

    `products` contains exactly one seeded row (`pathway-two-remember` / `Pathway Two™: ReMEMBER™` / `active`). No Founding Access product and no price data were seeded.

    **Phase 3A** — Additive integrity follow-up applied manually through the Supabase Dashboard SQL Editor, September 14, 2026, and independently verified the same day. Added `entitlements_expires_at_after_starts_at_check` and replaced `entitlements_revoked_at_matches_status_check` with the stronger `entitlements_revocation_integrity_check` (requires a non-whitespace `revocation_reason` whenever `status = 'revoked'`). Deliberately does not add an admin-grant provenance database constraint — see `docs/history/2026-09-14-commerce-access-entitlement-integrity-applied.md` for the full record and reasoning.

    **Phase 4** — `utils/entitlements.ts` implemented (`PATHWAY_TWO_PRODUCT_KEY`, `hasEffectiveEntitlement()`, `grantAdminEntitlement()`), September 14, 2026. One live `admin_grant` entitlement was created for the Founder account via `grantAdminEntitlement()` (no raw SQL), and `hasEffectiveEntitlement()` was verified to return `true` for it. A negative control confirmed an unknown product key surfaces a distinct error rather than a silent `false`. See `docs/history/2026-09-14-commerce-access-entitlement-service-applied.md` for the full application and verification record. `entitlements` now contains exactly one live row (the Founder's own admin grant).

    See `docs/architecture/database.md` ("Commerce + Access: `products` and `entitlements`", including the Phase 3A and Phase 4 subsections) for the current architecture description.

    Next state (approved implementation sequence):

    1. ~~Implement the entitlement service in `utils/entitlements.ts`.~~ Done, Phase 4.
    2. ~~Implement the minimal Founder/Admin grant service/path.~~ Done, Phase 4 (`grantAdminEntitlement()`).
    3. ~~Creation of an `admin_grant` entitlement must require a real grantor in application code.~~ Done, Phase 4 (enforced in `grantAdminEntitlement()`; the database intentionally does not enforce this — see Phase 3A).
    4. ~~Test an `admin_grant` end-to-end using the Founder's account.~~ Done, Phase 4.
    5. ~~Verify `hasEffectiveEntitlement()` returns true for that grant.~~ Done, Phase 4.
    6. Verify multiple-grant semantics with a dedicated non-production test (a revoked grant must not remove access if another effective entitlement for the same participant/product remains). Not yet independently re-tested with a second live grant; the implementation was inspected and confirmed structurally existence-based, not assuming a unique row. Remains open.
    7. Only after that proof, implement authorization composition (`authorizeRememberAccess` or equivalent).
    8. Route wiring for `/remember`, `/api/remember/screen`, `/api/remember/response`, and future protected Pathway Two™ surfaces follows only after the authorization composition is approved.
    9. Item 16, the proxy.ts/session-refresh issue, remains OPEN and must be resolved before protected Commerce + Access entry is considered production-ready.

    Recorded 2026-09-13. Updated 2026-09-14 (Phase 3A). Updated 2026-09-14 (Phase 4).

18. **Supabase migration workflow normalization**
    `Status: Deferred`
    `Type: Repository tooling / process debt`

    This repository's current convention: migrations are tracked as SQL files under `supabase/migrations/`, but production application has historically been manual through the Supabase Dashboard SQL Editor for every migration to date (`20260728`, `20260805`, `20260807`, `20260913`, `20260914040441`). No linked Supabase CLI project exists (no `supabase/config.toml`), and no repository-backed CLI migration history reflects any of those manual applications — the committed SQL files and their accompanying dated history records are the only tracked evidence of what was actually run.

    Future task: before a later production schema phase, deliberately evaluate and establish a linked, auditable Supabase migration-application/history workflow (or explicitly ratify the manual-application-plus-history-record convention as the intended permanent approach). Not solved now — no `config.toml` was created, no project was linked, no migration history was repaired, and no `db push` was run as part of recording this item.

    Recorded 2026-09-14.

    **2026-09-25:** `20260925120000_create_waitlist_interests.sql` was applied the same manual way, and recorded in `docs/history/2026-09-25-waitlist-migration-applied.md`. **2026-09-26:** so was `20260925120100_create_acquisitions.sql`, recorded in `docs/history/2026-09-26-acquisitions-migration-applied.md`. The workflow question itself remains deferred.

19. **S-03: Day 7 email routing — functional defect and stale Pathway Two™/Three™ references**
    `Status: Founder-ruled — old route superseded, not to be repaired in isolation; entitlement-gating authorized as next dependency`
    `Type: Email routing / Commerce + Access authorization / Pathway sequencing`

    Verified by bounded read-only audit (S-02/S-03), 2026-09-18.

    - The Day 7 email CTA (`utils/resend.ts`, `sendDaySevenEmail`) links to a hardcoded, static URL (`https://thecodexverse.com/door?from=day7&door=return_to_self&pathway=the_agreement`) with no `session_id` or other participant/session context ever supplied — `sendDaySevenEmail()`'s parameters and the cron sender's `scheduled_emails` query (`app/api/return/cron/send-scheduled-emails/route.ts`) carry no identifier that could be appended. Every Day 7 recipient's CTA link therefore lands on `app/door/page.tsx`'s "We could not open the door — this return is missing its pathway context" fallback. This is a functional defect, independent of the naming issue below.
    - The same CTA's `pathway=the_agreement` slug reflects the superseded pre-canon architecture in which the Agreement belonged to Pathway Two™. Current canon (`docs/canon/pathways.md`) places the Agreement at Pathway Three™, after ReMEMBER™. This route is superseded architecture, not a live target to be patched.
    - Consequently, Pathway One™ → Pathway Two™: ReMEMBER™ is **not implemented** via Day 7 or via any other route/email/component in the repository. No production surface currently links a participant from Day 7 to `/remember`.
    - `/remember` (`app/remember/page.tsx`) currently gates only on `checkRememberEligibility()` (Pathway One completion); it does not yet call `authorizeRememberAccess()` (`utils/authorization.ts`), which composes eligibility with `hasEffectiveEntitlement()` (`utils/entitlements.ts`, live since Phase 4 — see item 17). The ReMEMBER™ API routes (`app/api/remember/screen/route.ts`, `app/api/remember/response/route.ts`) authorize only by session ownership, not by entitlement.
    - Pathway Two™: ReMEMBER™ → Pathway Three™: the Agreement™ has no implemented handoff. `utils/remember.ts` defines only Movement One and Movement Two; full-pathway completion (`remember_sessions.status = 'completed'`) is reserved but never set by any current code path, and no CTA/route/email references `/tier-2` from within ReMEMBER™.

    **Founder ruling, 2026-09-18:**
    - The old Day 7 `/door?...pathway=the_agreement` route must **not** be repaired in isolation (e.g., merely adding `session_id` back) — it is superseded architecture.
    - Day 7 must ultimately hand toward Pathway Two™: ReMEMBER™, not the Agreement™. The exact destination route will be ruled as part of the commerce/access entry flow — **not invented ahead of that ruling.**
    - ReMEMBER™ → the Agreement™ remains intentionally deferred until ReMEMBER™ pathway-completion architecture is defined (not addressed by this item).
    - **Entitlement-gating is authorized as the next dependency**: wiring `authorizeRememberAccess()` into `/remember`'s page and its two API routes, and adding a `verified_acquisition`-source entitlement-granting function to `utils/entitlements.ts` (parallel to the existing `grantAdminEntitlement()`), may proceed without pre-deciding the checkout/webhook route or the final Day 7 destination. This directly continues item 17's already-approved sequence, step 7 ("implement authorization composition") and step 8 ("route wiring ... follows only after the authorization composition is approved").
    - The checkout/payment route, any Stripe webhook, and the Day 7 destination/link-construction fix all remain blocked pending a separate Founder ruling on the commerce/access entry flow.

    **2026-09-24 update (Launch Sprint 1):**
    - Entitlement-gating is implemented and Verified Local (in-process, partial). See `docs/history/2026-09-24-phase-5b-remember-authorization-wiring.md`. `/remember` and both ReMEMBER™ API routes now call `authorizeRememberAccess()` on every request. The `verified_acquisition` grant function named in the 2026-09-18 ruling was **not** built, because Sprint 1 excludes checkout.
    - Founder rulings in the Sprint 1 directive: Pathway One™ is closed. Day 0/3/7 remain part of Pathway One™. The Day 7 defect is an implementation repair inside closed Pathway One™, not a redesign. Day 7 moves forward and the Door remains the transition point. The CTA wording and final destination remain Founder-reserved.
    - Bounded read-only Day 7 inspection completed, plus two further findings. (a) `returns.door` and `returns.pathway` are written only by `/begin`'s initial row (`return_to_self` / `return_to_self`). The qualifying completed row written by `/api/return` never sets them. (b) A logged-out Day 7 recipient hits `/door` (in `PROTECTED`), is redirected to `/enter`, and after OTP verification lands on `/begin`. The Day 7 destination is lost. An exact repair plan was returned to the Founder, and nothing participant-facing was applied.
    - Status (morning): Awaiting Founder approval of the Day 7 repair plan.
    - **Same-day Founder rulings (Launch Sprint 1 Continuation):** Day 7 email → `/door?from=day7` → authenticated Day 7 Door branch → `/pathways#remember`. Logged-out recipients return to the Day 7 Door after authentication (Option B, bounded token `next=day7`). Copy approved: email CTA `SEE WHAT COMES NEXT`, Door text "What you recognized is still yours." / "When you're ready, you can see what comes next.", Door CTA `see what comes next`.
    - **Implemented and Verified Local.** See `docs/history/2026-09-24-day-7-routing-repair-applied.md`. The normal Return Complete → Door → Declaration™ flow is unchanged (the Door diff has no removed lines). The Founder browser check is pending. Not committed.
    - Remaining for Founder: the launch-state copy flag on `utils/resend.ts:304` ("the next door is waiting"). Unchanged pending a ruling.
    - Status (2026-09-24): **Repair implemented; Founder browser check and body-sentence ruling pending.**
    - **2026-09-25:** Founder browser proof PASSED. The Day 7 Door rendered the approved copy, and the CTA `see what comes next` landed on the Pathway Two™: ReMEMBER™ card at `/pathways#remember`. Founder ruling: the body sentence "If something in you is ready to go deeper, the next door is waiting." stays unchanged and is not a launch-state defect at this time. The Phase 5B authorization gate also passed its browser proof (see `docs/history/2026-09-24-phase-5b-remember-authorization-wiring.md`, Closure).
    - Status: **Day 7 repair and entitlement-gating Verified Local, including the Founder browser proof. Not committed. Not deployed.** These remain blocked pending a separate ruling, as before: the checkout/payment route, the Stripe webhook, and the `verified_acquisition` grant function.
    - **2026-09-25:** the Launch Sprint 2 directive authorized those three. They are built behind a closed sales gate. See item 22.

    Recorded 2026-09-18. Updated 2026-09-24, 2026-09-25.

20. **Entitlement and Test A state differ from the repository record**
    `Status: RESOLVED (Founder ruling 2026-09-25): provenance preserved, data left intact`
    `Type: Commerce + Access / data provenance`

    Found during Phase 5B verification, 2026-09-24. Nothing was changed. (1) There are two `admin_grant` rows for `pathway-two-remember`, but Phase 4 recorded exactly one (the Founder's). (2) Test A (`2emaildee+rememberA@gmail.com`), recorded on 2026-09-20 as auth-only at `/begin`, is now Pathway One™-eligible, effectively entitled, and holds an active ReMEMBER™ session created 2026-09-22 (Movement One, `m1_signal`, zero responses). No repository record describes either change. Ruling needed: confirm provenance and whether the second grant and Test A's state are intended. A follow-up read-only query to identify the grant holders was blocked by the Claude Code permission classifier and needs explicit Founder approval.

    **Resolution of the facts (Founder-approved read-only query, 2026-09-24):** Grant 1 is held by the Founder primary account, self-granted 2026-09-14 13:47 UTC. Grant 2 is held by Test A, granted by the Founder primary account on 2026-09-22 21:51 UTC. Both are `admin_grant`, `active`, with no expiry and not revoked. They are the only `entitlements` rows. Test A completed a Return, sealed its Declaration™, received the grant, and began ReMEMBER™ on 2026-09-22, in that order. Nothing was changed. See `docs/history/2026-09-24-phase-5b-remember-authorization-wiring.md` (Continuation). Remaining: the Founder confirms that grant 2 and Test A's progression were intentional test actions.

    **Founder ruling, 2026-09-25:** preserve the established provenance. Neither entitlement, nor Test A's state, is to be altered. The data is left intact. Nothing was changed.

    Recorded 2026-09-24. Updated 2026-09-24, 2026-09-25.

21. **Temporary not-entitled destination for `/remember` (`/pathway`) has no recorded ruling**
    `Status: RESOLVED (Founder ruling 2026-09-24)`
    `Type: Routing / Commerce + Access`

    `app/remember/page.tsx` sends an eligible but not-entitled participant to `/pathway` and cites "Founder Ruling 2, 2026-09-18". No such ruling text exists in `docs/`. `/pathway` is Pathway One™'s pathway view. Ruling needed: record the ruling, or name a different pre-checkout destination (the public `/pathways` card is a candidate).

    Recorded 2026-09-24.

    **Founder ruling, 2026-09-24:** `/pathway` was not Founder-approved. An eligible, not-entitled participant now goes to `/pathways#remember`, and a stable `id="remember"` anchor was added to the existing public Pathway Two™: ReMEMBER™ card as the durable public destination for the offer state. No offer copy was changed, and no checkout or waitlist was built. Verified Local with a real eligible, not-entitled identity.

    Resolved 2026-09-24.

22. **Launch Sprint 2: ReMEMBER™ waitlist and Founding Access (Stripe test mode, sales closed)**
    `Status (current, 2026-09-28, after the Founder batch lock): prerequisites 1–6 PASSED; 7 PARTIAL/OPEN (implemented, Migration 3 Applied and Verified Live, live lost-dispute sandbox proof interrupted; a clean post-reboot re-run is required); 8 PASSED; 9 PASSED; 10 NOT STARTED. Public sales CLOSED. Committed and pushed to feature/pathway-two-remember; not merged; not deployed. The chronological entries below are the history. Earlier status (superseded): Implemented, Verified Local; Migration 1 Applied and Verified + waitlist proof PASSED (2026-09-25); Migration 2 Applied and Verified (2026-09-26); database gate closed; Stripe test setup and commerce proof pending`
    `Type: Commerce + Access / public offer`

    First implementation pass, 2026-09-25. See `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md` and `docs/architecture/commerce.md`. Built: a reusable waitlist on the public ReMEMBER™ card; a server-only sales gate (`REMEMBER_SALES_STATE`, closed by default); Stripe Checkout for US$97 Founding Access; a signed webhook → `acquisitions` → `verified_acquisition` entitlement (idempotent); refund revocation of the purchase's own entitlement; and a post-purchase confirmation that grants nothing. Public sales remain **CLOSED**.

    Remaining before launch:
    1. Apply `20260925120000_create_waitlist_interests.sql` through the Supabase SQL Editor (item 18 convention), and record the application. (Superseded ordering, 2026-09-25: `20260925120100_create_acquisitions.sql` is HELD until Migration 1 is verified and the waitlist browser proof passes. See the Migration Gate 1 rulings and the continuity reconciliation below.)
    2. Add `STRIPE_SECRET_KEY` (test), `STRIPE_WEBHOOK_SECRET`, and `REMEMBER_SALES_STATE=test` to `.env.local`, and set up a test-mode webhook (Dashboard destination or `stripe listen`).
    3. Founder browser proofs: waitlist, and the full test-mode purchase through authorized `/remember`.
    4. Founder rulings: provisional purchase and confirmation copy and the open-state CTA; `acquisitions.user_id ON DELETE RESTRICT`; refund policy (partial refunds keep access in V1); dispute/chargeback handling (not built, and a lost dispute keeps access; *superseded 2026-09-27: ruled and built, see below*); whether a waitlist confirmation email or rate limiting is wanted before launch.
    5. Production: live keys and a live webhook in Vercel, deployment, then a production test. OPEN FOUNDING ACCESS follows only when every item in the canonical prerequisite list below is met.

    Recorded 2026-09-25.

    **Founder rulings, 2026-09-25 (Migration Gate 1):**
    - Architecture approved to continue to live verification. Public sales remain **CLOSED**. `REMEMBER_SALES_STATE` stays closed.
    - Migration 1 (`20260925120000_create_waitlist_interests.sql`) was surfaced for Founder application. Migration 2 (`20260925120100_create_acquisitions.sql`) is held until Migration 1 is applied and the waitlist live-browser proof passes.
    - `acquisitions.user_id ON DELETE RESTRICT` is kept for V1: a verified payment record must not disappear because an auth identity is deleted. Future policy: item 23.
    - Refund behavior approved for V1: a full refund revokes only that purchase's `verified_acquisition` entitlement; a partial refund does not revoke access; no history is deleted. Public refund-policy copy remains Founder-reserved and must be completed before live paid traffic.
    - No waitlist confirmation email for V1. No new rate-limiting dependency. Future hardening: item 24.
    - Disputes/chargebacks: a **required pre-live blocker**. A bounded design for revoking purchase-derived access after a verified lost dispute must be returned before OPEN FOUNDING ACCESS. It does not block waitlist or Stripe test-mode verification, and nothing speculative is implemented now.
    - Commerce copy (purchase page, Stripe line-item name, confirmation/waiting page, open-state CTA) is placeholder and not approved. Exact copy is to be returned for Founder review after technical test-mode proof. The waitlist copy remains approved.
    - OPEN FOUNDING ACCESS requires a later explicit ruling after: migrations verified, waitlist browser proof, Stripe test checkout proof, verified acquisition proof, entitlement proof, post-purchase authorization proof, dispute/chargeback handling closed, and refund policy copy approved. (Superseded by the canonical list below, which adds commerce copy approval.)

    **Founder rulings, 2026-09-25 (continuity reconciliation, documentation only):**
    - **Governing migration sequence.** First, the Founder applies Migration 1 (`20260925120000_create_waitlist_interests.sql`), then verifies schema, constraints, RLS, and policies, runs the waitlist browser proof, verifies duplicate behavior, and verifies that no auth user, entitlement, or ReMEMBER™ session is created. **Only after that passes** may Migration 2 (`20260925120100_create_acquisitions.sql`) proceed to Founder review and application.
    - **`/enter` token security proof recorded.** It passed all 11 cases. See `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md`.
    - **Canonical OPEN FOUNDING ACCESS prerequisites.** All of the following are required:
      1. both migrations verified
      2. waitlist browser proof passed
      3. Stripe test checkout proof passed
      4. verified acquisition proof passed
      5. entitlement proof passed
      6. post-purchase authorization proof passed
      7. dispute / chargeback handling closed
      8. public refund-policy copy approved
      9. participant-facing commerce copy approved (at minimum: purchase page copy, confirmation/waiting copy, Stripe line-item name, open-state CTA). It remains placeholder and unapproved until Founder review. The waitlist copy is already approved and is not reopened.
      10. explicit Founder ruling: OPEN FOUNDING ACCESS

    **Founder ruling, 2026-09-25 (Migration Gate 1 closed):** MIGRATION 1 + WAITLIST LIVE-BROWSER PROOF: **PASSED**. Migration 1 is applied and verified (7 columns, 4 constraints, RLS on, 0 policies, 0 initial rows). The browser proof passed: approved copy, confirmation, duplicate with no disclosure and no second row, keyboard, rapid repeat-click, final row count 1, and 0 auth users, entitlements, or ReMEMBER™ sessions for the submitted email. Record: `docs/history/2026-09-25-waitlist-migration-applied.md`. Prerequisite 2 (waitlist browser proof) is met; prerequisite 1 is half met (Migration 1 verified, Migration 2 pending). The Migration 2 hold is **released for Founder review only**. It is not applied.

    **2026-09-26, pre-application integrity correction (Founder review of Migration 2):** the replay guard now requires all purchase facts to match (null-safe). The harness passed 62 of 62. The earlier Migration 2 fingerprints are superseded: file `10f72a8e886653c91ecb20dbdb98eeed168779166bada8ed8777bddb13966a1f`, executable SQL `eb13f614c7c04d87c1bcda4a4f57f51384c3c4831386d4fb16d0f44e2aa2e28a`. Record: `docs/history/2026-09-25-launch-sprint-2-waitlist-and-founding-access.md` (final section). Migration 2 is still **NOT APPLIED**, awaiting final Founder review.

    **Founder ruling, 2026-09-26 (database gate closed):** MIGRATION 2: **APPLIED AND VERIFIED LIVE**. The corrected version (SHA-256 `10f72a8e…6a1f`) was applied through the SQL Editor: 16 columns, 12 constraints, RLS on, 0 policies, 0 rows; both functions have `anon` and `authenticated` execute false and `service_role` true. Record: `docs/history/2026-09-26-acquisitions-migration-applied.md`. Prerequisite 1 (both migrations verified) is now met, and so is prerequisite 2 (waitlist proof). Outstanding: Stripe test-mode setup, and the proofs for prerequisites 3 to 6; then prerequisites 7 to 10. Stripe remains unconfigured, no test payment has occurred, and public sales remain **CLOSED**.

    **Founder ruling, 2026-09-26 (Stripe test-mode proof, Option A):** Stripe sandbox payment → access: **PASSED** (test payment, signed webhook, acquisition, `verified_acquisition` entitlement, activation, eligibility, authorization, confirmation handoff). The test identity's pre-existing ReMEMBER™ session resumed at its terminal `m2_to_m3` exit screen. That is not a commerce defect, and the session is preserved as-is (item 25). The full sandbox refund then revoked only that purchase's entitlement, deleted nothing, left other grants untouched, and was idempotent under replay; replaying the payment did not re-grant. Record: `docs/history/2026-09-26-stripe-test-mode-proof.md`. Prerequisites 3 to 6 are now met. Outstanding: 7 to 10. Public sales remain **CLOSED**.

    **Founder ruling, 2026-09-27 (prerequisite 7, lost-dispute revocation):**
    - Purchase-derived access is revoked **only** when Stripe reports a definitively lost dispute (`charge.dispute.closed`, `status = lost`). Dispute created, funds withdrawn, updated, under review, won, `warning_closed`, and inquiries or warnings do not revoke. There is no temporary suspension or reinstatement in Launch Sprint 2, and no broader dispute-management system.
    - A migration is approved. A lost dispute is **not** recorded as a refund: the acquisition moves to `dispute_lost` with `dispute_lost_at` and `provider_dispute_id`. The entitlement revocation reason is exactly `Stripe dispute lost`. The acquisition and entitlement rows remain, and nothing is deleted.
    - `charge.dispute.closed` with `won` or `warning_closed` returns 200 and changes nothing.
    - V1 rule: `provider_dispute_id` records the lost dispute that moved the acquisition into `dispute_lost`. Several disputes against one payment are not modeled.
    - Proof identity: Founder-controlled `9110bc4a…`. Its historical ReMEMBER™ session, refunded acquisition, and revoked entitlement stay untouched. The proof creates a new acquisition and entitlement through the normal sandbox purchase path.

    **2026-09-27, implementation (NOT APPLIED):** `supabase/migrations/20260927120000_add_acquisition_dispute_lost.sql`, `revokeDisputedAcquisition()` in `utils/entitlements.ts`, and `charge.dispute.closed` handling in `app/api/stripe/webhook/route.ts`. It is Implemented, Verified Local: the dispute harness passed 23 of 23, the existing Sprint 2 harness still passed 62 of 62 with the migration applied, 4 of 4 mutants were caught, and `tsc` and ESLint are clean. Record: `docs/history/2026-09-27-dispute-lost-migration-proposed.md`. Prerequisite 7 stays **open** until the Founder applies and verifies the migration and the dispute sandbox proof passes (`docs/history/2026-09-27-dispute-sandbox-proof.md`). Public sales remain **CLOSED**.

    **Founder ruling, 2026-09-27 (Migration 3 SQL review):** MIGRATION 3 (`supabase/migrations/20260927120000_add_acquisition_dispute_lost.sql`, SHA-256 `a70cc2f38ac63ad3477bcf628eb99e206907a80d55f52aa5608b31d0c6334318`) is **APPROVED FOR MANUAL APPLICATION**. It is **not yet applied**.

    Approved scope decision: the replacement of `revoke_refunded_acquisition()` is approved. It keeps the same signature, return shape, security model, and grants, but now acts only while the acquisition status is `verified`.

    Reason: once `dispute_lost` is a valid terminal acquisition outcome, a later refund must not overwrite that truthful outcome as `refunded`. Therefore:
    - verified → refund = `refunded`
    - verified → lost dispute = `dispute_lost`
    - refunded → later lost dispute = no change
    - dispute_lost → later refund = no change

    This preserves the first recorded terminal reversal outcome. It also prevents the new outcome-integrity constraint from causing repeated webhook failures.

    **Founder ruling, 2026-09-27: MIGRATION 3 APPLIED AND VERIFIED LIVE.**
    - The Founder applied the approved file (SHA-256 `a70cc2f3…4318`) through the Supabase SQL Editor. Result: "Success. No rows returned."
    - Live verification: 18 columns, 12 constraints; `dispute_lost_at` and `provider_dispute_id` present; new outcome check present, old refund check removed; RLS on, 0 policies.
    - Rows: 2 acquisitions (1 `verified`, 1 `refunded`, 0 `dispute_lost`).
    - Execute rights on both revoke functions: `anon` and `authenticated` false, `service_role` true.
    - Record: `docs/history/2026-09-27-dispute-lost-migration-applied.md`.
    - **Prerequisite 7 remains OPEN** until the Stripe sandbox lost-dispute proof passes (`docs/history/2026-09-27-dispute-sandbox-proof.md`). Public sales remain **CLOSED**.

    **Founder ruling, 2026-09-28 (first lost-dispute sandbox attempt):** it is classified as an **interrupted test artifact**.
    - The Claude-owned listener was stopped for low memory, and the Founder then completed a 0259 purchase with no listener running. The Stripe objects exist: `cs_test_a10esl0t6sC4htUl…`, `pi_3UKV3kDNmIXFPq5z0Nl5RJUO`, and dispute `du_1UKV3lDNmIXFPq5zU0GL3j7O` (`needs_response`).
    - No acquisition or entitlement was written locally, and nothing else changed.
    - Recovery attempts were stopped because the listener kept dying under memory pressure.
    - There is no evidence of an application or database defect.
    - The dispute is left untouched. **Prerequisite 7 remains PARTIAL / OPEN** until a clean re-run after a machine reboot passes.
    - Record and re-run plan: `docs/history/2026-09-27-dispute-sandbox-proof.md`.

    **2026-09-28, final local validation:**
    - `tsc` clean.
    - `next build` succeeded (51 routes).
    - Dispute harness 23/23, Sprint 2 harness 62/62, 4/4 mutants caught.
    - ESLint: 12 errors and 4 warnings project-wide. All are pre-existing and outside Sprint 2's changes; the one in a Sprint 2-touched file, `app/enter/page.tsx`, exists identically at HEAD.

    **Founder batch lock, 2026-09-28 (prerequisites 8 and 9):**
    - The whole commerce copy set is approved and implemented. It is listed in `docs/architecture/commerce.md`, "Commerce copy". It came from `docs/history/2026-09-28-commerce-copy-and-refund-policy-proposal.md`, with these changes:
      - The support address is hello@thecodexverse.com.
      - "access does not expire" is removed. No perpetual-access promise is made.
      - No refund-arrival time is promised.
    - The V1 Access & Refund Policy is approved and implemented at `/access-refund-policy`:
      - first-person voice; one-time payment, not a subscription
      - full refund within 14 days of purchase, requested at hello@thecodexverse.com, with no explanation required
      - a full refund revokes the purchase-derived entitlement; a partial refund does not
      - a refund does not automatically delete participant-created records
      - a definitively lost dispute revokes purchase-derived access
      - participants are invited to write first
      - rights that cannot be waived under consumer law are preserved
    - **Prerequisite 8: PASSED. Prerequisite 9: PASSED.**
    - Prerequisite 7 remains PARTIAL / OPEN. Prerequisite 10 is NOT STARTED, and no OPEN FOUNDING ACCESS ruling has been issued. Public sales remain **CLOSED**.
    - Rulings recorded in the same batch: item 26 (the `continue` label) is closed for V1, and item 27 (sandbox rows) is resolved.

    Updated 2026-09-25, 2026-09-26, 2026-09-27, 2026-09-28.

23. **Participant deletion, anonymization, and financial-record retention policy**
    `Status: Future governance item (not solved in Launch Sprint 2)`
    `Type: Governance / data retention`

    `acquisitions.user_id` is `ON DELETE RESTRICT` (Founder ruling 2026-09-25), so an auth identity with a verified payment cannot be deleted until a policy exists. A future ruling is needed on participant deletion requests, anonymization of payment records, and how long financial records are retained.

    Recorded 2026-09-25.

24. **Waitlist rate limiting**
    `Status: Bounded future hardening item`
    `Type: Security / abuse prevention`

    `POST /api/waitlist` has server validation, a 2 KB body limit, email normalization, and idempotency, but no rate limiting: none exists in the repository to reuse, and the Founder ruled (2026-09-25) not to add a dependency in Launch Sprint 2. Revisit if abuse appears.

    Recorded 2026-09-25.

25. **Returning purchaser whose ReMEMBER™ session is already at the terminal screen**
    `Status: Open participant-experience question (not solved in Launch Sprint 2)`
    `Type: Participant experience`

    What should a returning purchaser see when their existing ReMEMBER™ session is already at the current terminal/exit screen (today `m2_to_m3`, which renders only "Return to the codeXverse")? Surfaced by the Stripe test-mode proof (`docs/history/2026-09-26-stripe-test-mode-proof.md`). This is a participant-experience ruling, separate from commerce verification. Nothing is changed until the Founder rules.

    Recorded 2026-09-26.

26. **ReMEMBER™ "continue" button label has no recorded Founder approval**
    `Status: CLOSED for V1 (Founder ruling 2026-09-28): the existing label "continue" is Founder-approved. No code or other Entry Threshold copy changed.`
    `Type: Participant-facing copy`

    The Entry Threshold screens render a button labelled "continue" (`app/remember/RememberExperience.tsx:637`, the `handleSimpleContinue` button). The Entry Threshold text itself (for example `entry_01`, "You found yourself.") is Founder-approved, locked copy in `docs/design-specifications/pathway-two-remember-v1.0.md`, Part Two. The button label appears nowhere in that spec, so Founder approval is not established. Surfaced by the fresh-entry proof (`docs/history/2026-09-26-stripe-test-mode-proof.md`). The label stays unchanged until reviewed.

    **Founder ruling, 2026-09-28:** the Entry Threshold button label `continue` is Founder-approved for V1. This closes the item for V1. No other Entry Threshold copy is altered, and Movement One™ is untouched.

    Recorded 2026-09-27. Closed 2026-09-28.

27. **Stripe sandbox test rows live in the production Supabase project**
    `Status: RESOLVED (Founder ruling 2026-09-28): sandbox rows preserved; production reporting must filter on livemode`
    `Type: Commerce + Access / data hygiene`

    Local development uses the live Supabase project (`docs/implementation/builder-brief.md`, Current environment; that document also calls it "the production Supabase project"). Every Launch Sprint 2 sandbox proof therefore wrote to the production database:
    - `e3601d38…`: refunded acquisition, with revoked entitlement `5958a85f…`
    - `1715c86a…`: verified acquisition, with **active** entitlement `afe5e2f6…`. This gives Founder-controlled `016f2839…` real access in production.
    - 1 waitlist row from the browser proof
    - the `016f2839…` ReMEMBER™ session at `entry_01`

    All acquisitions are `livemode = false`. Vercel's environment could not be inspected from the repository, so it is not verified that production uses this same project. The Founder must confirm that, then rule on whether to keep these rows as labelled test provenance, revoke the active test entitlement, or retain everything. Nothing is deleted without a ruling (`acquisitions.user_id ON DELETE RESTRICT`; item 23).

    Recorded 2026-09-28.

    **Founder ruling, 2026-09-28:**
    - The existing sandbox proof rows in the live Supabase project are **PRESERVED** as historical commerce proof evidence: the sandbox acquisitions, sandbox entitlements, the waitlist proof row, and the Founder-controlled test sessions. They are distinguishable by `livemode = false`.
    - Nothing is deleted.
    - Production reporting and reconciliation must distinguish `livemode = false` from live transactions, and sandbox records are never treated as live revenue (`docs/architecture/commerce.md`, Known limits).
    - Which Supabase project Vercel production uses still needs confirming when the live environment is set up. This is part of the production readiness checklist, not this item.

    Resolved 2026-09-28.
