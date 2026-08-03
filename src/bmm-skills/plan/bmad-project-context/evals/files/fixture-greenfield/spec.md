# Spec — TrailLedger

A small SaaS for hiking clubs to track shared trip expenses and settle balances.

## Decided
- Stack: TypeScript, Fastify, Postgres. Frontend later; API first.
- Tests: vitest, colocated `*.test.ts`, no mocking of the database — tests run against
  a throwaway Postgres via testcontainers.
- All money amounts are integer cents; currency is per-club, never mixed within a trip.
- Org constraint: every table carries `club_id`; no cross-club queries outside admin jobs.

## Open
- Persistence shape for the settlement history: the team is split between event-sourcing
  the ledger (auditability, replay) and a plain CRUD balance table (simplicity). Real
  tradeoffs both ways; not yet decided.
