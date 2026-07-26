# Email Flow

**Status:** Current implementation outline

## Platform

Resend with Supabase-backed participant data.

## Known sender

`no-reply@thecodexverse.com`

## Known functioning messages

- Day 3 follow-up
- Day 7 follow-up

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
