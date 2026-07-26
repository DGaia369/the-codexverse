# Routing Architecture

**Status:** Current-state map

## Participant routes

- `/`
- `/begin`
- `/pathway`
- `/pathway/return-to-self`
- `/return`
- `/return-complete`
- `/between-threshold`
- `/declaration`
- `/door`
- `/door/lost`
- `/door/rebuilding`
- `/door/stuck`
- `/enter`
- `/foundation`
- `/guided`
- `/next-step`
- `/tier-2`

## API routes

- `/api/agreement`
- `/api/declaration`
- `/api/declaration-writing`
- `/api/declaration/pdf`
- `/api/return`
- `/api/return/cron/send-scheduled-emails`
- `/auth/callback`

## Routing principles

- Routes should reflect participant experience, not internal jargon.
- Session-protected pathway pages must not be directly accessible without valid context.
- Future Library routes must preserve the distinction between the collection and the individual Recognition Record™.
- Retired tier language should not be expanded without deliberate review.

## Pending review

- Confirm which legacy routes remain necessary.
- Confirm whether `/tier-2` should be renamed or retired.
- Document all redirects and guard logic.
