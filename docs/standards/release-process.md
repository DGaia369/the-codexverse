# Release Process

**Status:** Governing standard

## Before commit

1. Run the production build.
2. Review `git status`.
3. Confirm only intended files changed.
4. Complete the Governance Close.
5. Update documentation.
6. Record verification status accurately.

## Before push

1. Confirm the branch.
2. Confirm the commit message describes the actual change.
3. Confirm no secrets or local-only files are staged.
4. Confirm documentation and code agree.

## Before production deployment

1. Verify locally.
2. Push the intended commit.
3. Confirm deployment.
4. Test the participant flow in production.
5. Update `Verified Local` to `Verified Live` only after production testing.
6. Record unresolved defects.
