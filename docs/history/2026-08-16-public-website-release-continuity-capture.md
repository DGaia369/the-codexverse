# Public Website Release Continuity Capture

## Status

Founder Preview Approved — Pre-Production

Date:
August 16, 2026

Authority:
Diana Francis

## Public Release Candidate

Branch:
release/public-website-phase-1

Commit:
38da68a

The public website was deliberately extracted into a clean release branch based on `origin/main` rather than merging the mixed `feature/pathway-two-remember` development branch.

Unfinished Pathway Two™: ReMEMBER™, Declaration™, Agreement™, migrations, database work, Builder Brief, governance files, and design-specification work were excluded from this public release.

## Verified Release Architecture

Verified:

- `/` = approved public Home.
- `/threshold` = preserved original immersive Threshold experience.
- `/experience` = public.
- `/pathways` = public.
- `/pathway` = protected.
- `/recognition-archaeology` = public.
- `/library-of-yourself` = public conceptual page, architecturally separate from protected participant `/record`.
- `/our-promise` = public.
- `/about` = public.
- `/lexicon` exists as a structural public shell and is not a primary navigation item.
- legal/support routes exist as structural shells.

## Founder-Locked Navigation

Founder-locked:

- `the codeXverse™` upper-left brand link → `/`
- this serves as Home.
- no separate Home navigation item is required.

- Header `ENTER` → `/enter`
- Home `Enter the Threshold™` → `/enter`
- Header `Return` → `/begin`

`/begin` was verified as the existing authoritative participant continuation/resume gateway.

`/return` and `/return-complete` are not redefined; they are existing later-stage Pathway One™ flows and are not the public Return gateway.

## Return Architecture Verification

`/begin` is protected.

Unauthenticated access to `/begin` redirects to `/enter`.

Authenticated participant with an active loop is routed into the existing Pathway One™ continuation flow.

Authenticated participant with no active loop follows the existing arrival/start behavior.

Known future continuity consideration:
participants who previously completed Pathway One™ currently have no distinct completed-pathway return branch in `/begin`; because `/begin` searches only for active loops, a completed participant may begin a new Pathway One™ cycle.

This is recorded as a known future ecosystem-continuity issue, NOT a blocker for the current public website release and NOT something to redesign during this release.

## Founder Preview Verification

Desktop Founder Preview review passed.

Real-device mobile Founder Preview review passed on August 16, 2026.

Mobile review confirmed:

- public Home is readable and functional;
- navigation remains usable;
- Hero scales without clipping;
- the First Recognition remains readable;
- closing Enter the Threshold™ CTA is usable;
- public Experience content scales correctly;
- no launch-blocking mobile layout defect was observed.

Post-launch refinement candidates only:

- evaluate whether the fully exposed mobile navigation should later become more compact;
- observe whether the floating accessibility control ever materially obstructs participant-facing content.

These are NOT launch blockers and do not reopen Version 1 public-site architecture.

## Technical Verification

Verified release checks:

- TypeScript passed.
- targeted ESLint passed.
- production build passed.
- required routes passed local production smoke tests.
- `/pathway` protected behavior passed.
- `/pathways` public behavior passed.
- Return → `/begin` passed.
- ENTER → `/enter` passed.
- Home Enter the Threshold™ → `/enter` passed.
- the codeXverse™ → `/` passed.
- no hard-coded localhost destinations were present.
- the First Recognition remains without ™.
- approved typography remained intact.
- rejected Playfair/Montserrat/Lora public-font experiment was not reintroduced.
- white-band/mobile full-height correction remained present.
- temporary `.env.local` used for local verification was removed and was not committed.

## Brand Asset Lock

Founder-locked:

Website visible banner: NO.

Website social/share identity asset: YES.

The approved branded the codeXverse™ artwork is reserved for social sharing / Open Graph, launch communications, email/newsletter, and media/press use rather than visible placement as a Home-page banner.

## Version 1 Launch Discipline

The approved public website architecture is considered launch-ready.

No redesign is authorized before launch unless an issue materially breaks:

- participant entry;
- routing;
- authentication;
- security;
- data integrity;
- required accessibility/basic usability;
- or real-device mobile usability.

Cosmetic refinement and non-critical UX improvements belong to post-launch iteration.

## Remaining Launch Sequence

At time of capture, remaining sequence is:

1. Founder review of this continuity record.
2. Merge release/public-website-phase-1 into main.
3. Allow Vercel Production deployment from main.
4. Verify thecodexverse.com.
5. Run final production smoke test.
6. Return primary build attention to Pathway Two™: ReMEMBER™.

## Protected Development Continuity

The primary `feature/pathway-two-remember` working tree remains deliberately untouched and continues to contain unfinished Pathway Two™: ReMEMBER™ implementation and related work.

The Second Inheritance™ remains intentionally undefined.

After public launch, development attention returns to Pathway Two™: ReMEMBER™ without reopening the approved public website architecture merely for refinement.
