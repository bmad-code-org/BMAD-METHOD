# Project Kernel — wavecart
## Commands
- Test: `pnpm test` (vitest — do NOT use jest syntax)
## Conventions that differ from defaults
- Money is always integer cents (`amountCents`), never floats — src/lib/money.ts
- All DB access through repositories in src/repos/ — never call the client directly
## Landmines
- Stripe webhooks replay in staging every 6h — handlers must be idempotent
