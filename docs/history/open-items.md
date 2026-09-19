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

    Recorded 2026-09-18.
