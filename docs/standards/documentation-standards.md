# Documentation Standards

**Status:** Governing standard

Every document should include title, status, date when locked or last verified, scope, known boundaries, unresolved items, and provenance when material.

Do not state that something is implemented, live, verified, or canonical without evidence.

Use exact status language:

- Verified Live
- Verified Local
- Implemented, Unverified
- Proposed
- Blocked
- Pending Review
- Superseded
- Retired

A session is not complete until relevant documentation is updated.

When a decision changes:

1. update the current governing document
2. mark the old decision Superseded or Retired
3. add the date
4. link to the replacement
5. preserve the reason in `docs/history/`

Review at session close, before commit, before production deployment, monthly, and before major releases.
