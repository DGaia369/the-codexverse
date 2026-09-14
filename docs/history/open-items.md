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
    `Status: OPEN`
    `Type: Authentication / session architecture`
    `Runtime impact: UNVERIFIED`
    `Priority: Must be resolved before protected Commerce + Access entry is considered production-ready.`

    The current `proxy.ts` implementation couples Supabase session refresh to the internal `PROTECTED` route list.

    Authenticated Server Component routes including `/remember` and `/record` are currently outside that coverage.

    Before Commerce + Access authorization is wired to Pathway Two™: ReMEMBER™, review whether session refresh should:

    A. be extended by adding specific protected routes, or

    B. be separated from protected-route redirect logic so applicable dynamic requests receive session refresh independently from authorization routing.

    See `docs/architecture/routing.md` ("Route Protection Mechanism") and `docs/architecture/session-management.md` ("Session Refresh Mechanism") for the verified technical findings this item is based on. Recorded 2026-09-10.

17. **Commerce + Access V1 entitlement schema (`products`, `entitlements`)**
    `Status: Applied and Verified Live`
    `Type: Database schema / Commerce + Access`

    Applied manually through the Supabase Dashboard SQL Editor, September 13, 2026, and independently verified against live PostgreSQL system catalogs the same day. See `docs/history/2026-09-13-commerce-access-entitlement-schema-applied.md` for the full application and verification record, and `docs/architecture/database.md` ("Commerce + Access: `products` and `entitlements`") for the current architecture description.

    `products` contains exactly one seeded row (`pathway-two-remember` / `Pathway Two™: ReMEMBER™` / `active`). No Founding Access product and no price data were seeded. `entitlements` contains zero rows.

    Next state (approved implementation sequence):

    1. Implement the entitlement service in `utils/entitlements.ts`.
    2. Implement the minimal Founder/Admin grant path.
    3. Verify an `admin_grant` entitlement end-to-end using the Founder's account.
    4. Verify `hasEffectiveEntitlement()` recognizes at least one effective grant.
    5. Only after that proof, implement authorization composition (`authorizeRememberAccess` or equivalent).
    6. Route wiring for `/remember`, `/api/remember/screen`, and `/api/remember/response` follows after the authorization composition is approved.
    7. Item 16, the proxy.ts/session-refresh issue, remains OPEN and must be resolved before protected Commerce + Access entry is considered production-ready.

    Recorded 2026-09-13.
