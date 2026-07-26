# Session Management

**Status:** Current-state outline

## Current identifier

`session_id`

## Known use

The Return to Self flow uses a protected session across participant pages and API requests.

## Principles

- A participant’s answers and artifacts must remain associated with the correct session.
- Session protection must prevent accidental cross-participant access.
- Recognition Records™ must be retrieved through authenticated or otherwise verified participant context.
- Future Library access must be private and participant-specific.
- Session handling must not depend on client-trusted values alone.

## Pending documentation

- Session creation point
- Session expiry
- Cookie configuration
- Supabase authentication relationship
- Email-to-session resolution
- Recovery behavior
- Multiple-device behavior
- Future Library access rules
