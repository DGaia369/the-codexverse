# Email Flow

**Status:** Current implementation outline

## Platform

Resend with Supabase-backed participant data.

## Known sender

`no-reply@thecodexverse.com`

## Known functioning messages

- Day 3 follow-up
- Day 7 follow-up

## Day 7 transition (repaired 2026-09-24)

**Status:** Implemented, Verified Local (in-process; the Day 7 Door and its CTA to `/pathways#remember` also passed the Founder browser proof, 2026-09-25). Not committed. Not deployed.

Founder ruling, 2026-09-25: the existing body sentence "If something in you is ready to go deeper, the next door is waiting." stays unchanged. It is not a launch-state defect at this time.

Founder rulings, 2026-09-24 (Launch Sprint 1, Rulings 3 to 5):

- `sendDaySevenEmail()` (`utils/resend.ts`) links to `https://thecodexverse.com/door?from=day7` with the CTA `SEE WHAT COMES NEXT`. The link carries no participant identifier. The superseded `pathway=the_agreement` link and the `CONTINUE TO THE AGREEMENT` CTA were removed. The body is unchanged.
- `/door?from=day7` has its own branch in `app/door/page.tsx`. It resolves the participant server-side from the authenticated session and shows the Day 7 Door only if that participant has a completed Return. The CTA `see what comes next` goes to `/pathways#remember`. Without a completed Return, it shows the existing Door fallback. This branch writes nothing. The ordinary Door branch (Return Complete → Door → Declaration™) is unchanged. Links in Day 7 emails already sent also carry `from=day7`, so they reach the repaired branch.
- A logged-out recipient is redirected by `proxy.ts` to `/enter?next=day7`. After OTP verification, `/enter` sends them to `/door?from=day7` instead of `/begin`. Only the fixed token `day7` is recognized, and it maps to one hard-coded destination, so there is no general redirect parameter.
- Known limit: destination preservation covers the `/enter` OTP-code path. If a participant instead follows a link in the Supabase sign-in email (whose template is outside this repository), they arrive through the default site redirect and the Day 7 destination is not preserved.

## Related route

`/auth/callback`

## Related scheduled route

`/api/return/cron/send-scheduled-emails`

## Principles

- Email is part of the recognition sequence, not a conventional marketing funnel.
- The value of a message is released by the conditions under which it arrives.
- Timing, consent, and readiness must remain deliberate.
- Participant artifacts may be attached only after the correct record has been generated and associated with the participant.

## Pending documentation

- Exact subject lines
- Send conditions
- Retry behavior
- Duplicate-send prevention
- Attachment generation flow
- Failure logging
- Unsubscribe and consent handling
