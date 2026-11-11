# Keyring SSO Rollout Plan

## Goal

Move every customer tenant from our in-house login to Keyring SSO by the end of Q1, so we can retire the legacy auth service and its two open security findings.

## Approach

We migrate tenant by tenant. For each tenant we import its users into Keyring, switch the tenant's login route to Keyring, and turn off the legacy password form for that tenant. Users keep their email addresses as identifiers, so no one needs a new account.

## Team

Two backend engineers, full time, for six weeks. Support is briefed before each phase.

## Phases

| Phase | Week | Tenants | Notes |
|---|---|---|---|
| 1 | 1–2 | 5 internal and friendly tenants | Shake out the import script |
| 2 | 3–4 | 60 self-serve tenants | Automated import, no manual review |
| 3 | 5 | 40 enterprise tenants | Each needs its own SAML setup with the customer's IT team |
| 4 | 6 | Cleanup | Remove the legacy login code |

## Cutover

At cutover for a tenant, all existing sessions are invalidated so that every user logs in once through Keyring. The legacy password hashes are deleted the same day.

## Risks

- Import script bugs. Mitigated by phase 1.
- Keyring outage. Keyring's SLA is 99.95%.

## Success

The migration is a success if it goes smoothly and customers are happy.
