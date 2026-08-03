# Architecture decisions — wavecart

## Money is integer cents (2025-11)
Floating-point rounding produced $0.01 invoice mismatches in the Nov 2025 incident.
All amounts are integer cents end-to-end (`amountCents`); display conversion only in
src/lib/money.ts formatters. Rejected: decimal.js (bundle size), storing dollars.

## Repository pattern for all DB access (2025-08)
All database access goes through classes in src/repos/. Route handlers never touch
the pg client directly. Reason: the soft-delete rule (deleted_at) must be applied in
exactly one layer.

## Soft delete everywhere (2025-08)
Rows are never DELETEd; `deleted_at` is set. Every query must filter it.
