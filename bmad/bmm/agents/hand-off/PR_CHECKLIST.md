PR Checklist — what to verify before merging

- [ ] All new endpoints have unit tests and basic integration tests.
- [ ] Linting and types pass (`npm run lint`, `npm run build`).
- [ ] No secrets in PR. `.env` keys must be in provider secrets.
- [ ] Feature flagged behind a config for gradual rollout.
- [ ] Basic smoke test documented in PR description and passing.
- [ ] Architect/PM sign-off for any infra changes or new third-party services.
