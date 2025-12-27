# Implementation Checklist

Use this checklist during TDD implementation in Step 5.
Focus: Make tests GREEN with minimal code.

## TDD Methodology

### RED-GREEN-REFACTOR Cycle
1. [ ] Start with failing test (from ATDD)
2. [ ] Write minimal code to pass
3. [ ] Run test, verify GREEN
4. [ ] Move to next test
5. [ ] Refactor in code review (not here)

### Implementation Order
- [ ] Database migrations first
- [ ] Type definitions
- [ ] Server actions
- [ ] UI components
- [ ] Integration points

## Project Patterns

### Result Type (CRITICAL)
```typescript
import { ok, err, Result } from "@/lib/result";

// Return success
return ok(data);

// Return error
return err<ReturnType>("ERROR_CODE", "Human message");
```

- [ ] All server actions return Result type
- [ ] No thrown exceptions
- [ ] Error codes are uppercase with underscores
- [ ] Error messages are user-friendly

### Database Conventions
- [ ] Table names: `snake_case`, plural (`invoices`)
- [ ] Column names: `snake_case` (`tenant_id`)
- [ ] Currency: `integer` cents (not float)
- [ ] Dates: `timestamptz` (UTC)
- [ ] Foreign keys: `{table}_id`

### Multi-tenancy (CRITICAL)
- [ ] Every table has `tenant_id` column
- [ ] RLS enabled on all tables
- [ ] Policies check `tenant_id`
- [ ] No data leaks between tenants

```sql
-- Required for every new table
alter table {table} enable row level security;

create policy "Tenants see own data"
  on {table} for all
  using (tenant_id = auth.jwt() ->> 'tenant_id');
```

### Module Structure
```
src/modules/{module}/
├── actions/     # Server actions (return Result type)
├── lib/         # Business logic
├── types.ts     # Module types
└── index.ts     # Public exports only
```

- [ ] Import from index.ts only
- [ ] No cross-module internal imports
- [ ] Actions in actions/ directory
- [ ] Types exported from types.ts

### Server Actions Pattern
```typescript
// src/modules/{module}/actions/{action}.ts
"use server";

import { ok, err, Result } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export async function actionName(
  input: InputType
): Promise<Result<OutputType>> {
  const supabase = await createClient();
  // ... implementation
}
```

- [ ] "use server" directive at top
- [ ] Async function returning Promise<Result<T>>
- [ ] Use createClient from server.ts
- [ ] Validate input before processing

### UI Components Pattern
```tsx
// src/modules/{module}/components/{Component}.tsx
"use client";

export function Component({ data }: Props) {
  return (
    <div data-testid="{feature}-container">
      {/* content */}
    </div>
  );
}
```

- [ ] Add data-testid from ATDD checklist
- [ ] "use client" only when needed
- [ ] Proper TypeScript props
- [ ] Handle loading/error states

## Verification Steps

### After Each AC Implementation
```bash
npm test -- --run --grep "{test_name}"
```
- [ ] Targeted test passes

### After All AC Complete
```bash
npm test -- --run   # All tests pass
npm run lint        # No lint errors
npm run build       # Build succeeds
```

## ATDD Checklist Reference

Verify against `atdd-checklist-{story_id}.md`:
- [ ] All data-testid attributes added
- [ ] All API endpoints created
- [ ] All database migrations applied
- [ ] All test scenarios pass

## Quality Gate

Ready for code review when:
- [ ] All tests pass (GREEN)
- [ ] Lint clean
- [ ] Build succeeds
- [ ] Result type used everywhere
- [ ] RLS policies in place
- [ ] ATDD checklist complete
