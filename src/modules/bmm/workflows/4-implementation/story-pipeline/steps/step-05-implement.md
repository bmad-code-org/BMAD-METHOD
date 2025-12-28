---
name: 'step-05-implement'
description: 'Implement story to make tests pass (GREEN phase)'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-05-implement.md'
nextStepFile: '{workflow_path}/steps/step-05b-post-validation.md'
checklist: '{workflow_path}/checklists/implementation.md'

# Role Switch
role: dev
agentFile: '{project-root}/_bmad/bmm/agents/dev.md'
---

# Step 5: Implement Story

## ROLE SWITCH

**Switching to DEV (Developer) perspective.**

You are now the Developer implementing the story. Your expertise:
- Next.js 16 with App Router
- TypeScript strict mode
- Supabase with RLS
- TDD methodology (make tests GREEN)

## STEP GOAL

Implement the story using TDD methodology:
1. Research implementation patterns
2. Review ATDD checklist and failing tests
3. For each failing test: implement minimal code to pass
4. Run tests, verify GREEN
5. Ensure lint and build pass
6. No refactoring yet (that's code review)

## MANDATORY EXECUTION RULES

### TDD Rules (RED-GREEN-REFACTOR)

- **GREEN PHASE** - Make tests pass with minimal code
- **ONE TEST AT A TIME** - Don't implement all at once
- **MINIMAL CODE** - Just enough to pass, no over-engineering
- **RUN TESTS FREQUENTLY** - After each change

### Implementation Rules

- **Follow project-context.md** patterns exactly
- **Result type** for all server actions (never throw)
- **snake_case** for database columns
- **Multi-tenancy** with tenant_id on all tables
- **RLS policies** for all new tables

## EXECUTION SEQUENCE

### 1. Research Implementation Patterns

Use MCP tools:

```
mcp__exa__get_code_context_exa:
  query: "Next.js 16 server actions Supabase RLS multi-tenant"

mcp__supabase__list_tables:
  # Understand current schema
```

### 2. Review ATDD Checklist

Load: `{sprint_artifacts}/atdd-checklist-{story_id}.md`

Extract:
- Required data-testid attributes
- API endpoints needed
- Database changes required
- Current failing tests

### 3. Run Failing Tests

```bash
npm test -- --run
```

Confirm all tests are FAILING (from ATDD phase).

### 4. Implementation Loop

For EACH acceptance criterion:

**A. Focus on one failing test:**
```bash
npm test -- --run --grep "{test_name}"
```

**B. Implement minimal code:**
- Database migration if needed
- Server action / API route
- UI component with data-testid
- Type definitions

**C. Run targeted test:**
```bash
npm test -- --run --grep "{test_name}"
```

**D. Verify GREEN:**
- Test passes ✓
- Move to next test

### 5. Database Migrations

For any schema changes:

```bash
# Create migration file
npx supabase migration new {name}

# Migration content
-- Enable RLS
alter table {table} enable row level security;

-- RLS policies
create policy "Tenants can view own data"
  on {table} for select
  using (tenant_id = auth.jwt() ->> 'tenant_id');
```

Apply to remote:
```bash
npx supabase db push
```

### 6. Server Actions Pattern

Follow project-context.md pattern:

```typescript
// src/modules/{module}/actions/{action}.ts
"use server";

import { ok, err, Result } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export async function actionName(
  input: InputType
): Promise<Result<OutputType>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("table")
    .select("*")
    .eq("tenant_id", tenantId);

  if (error) {
    return err("DB_ERROR", error.message);
  }

  return ok(data);
}
```

### 7. UI Components Pattern

```tsx
// src/modules/{module}/components/{Component}.tsx
"use client";

export function Component({ data }: Props) {
  return (
    <div data-testid="{feature}-container">
      <button data-testid="{feature}-submit">
        Submit
      </button>
    </div>
  );
}
```

### 8. Run Full Test Suite

After all AC implemented:

```bash
npm test -- --run
```

**All tests should pass (GREEN).**

### 9. Lint and Build

```bash
npm run lint
npm run build
```

Fix any issues that arise.

### 10. Verify Implementation Completeness

Check against ATDD checklist:
- [ ] All data-testid attributes added
- [ ] All API endpoints created
- [ ] All database migrations applied
- [ ] All tests passing

### 11. Update Pipeline State

Update state file:
- Add `5` to `stepsCompleted`
- Set `lastStep: 5`
- Set `steps.step-05-implement.status: completed`
- Record files modified

### 12. Present Summary and Menu

Display:
```
Implementation Complete - GREEN Phase

Tests: {passed}/{total} PASSING
Lint: ✓ Clean
Build: ✓ Success

Files Modified:
- {file_1}
- {file_2}

Migrations Applied:
- {migration_1}

Ready for Code Review
```

**Interactive Mode Menu:**
```
[C] Continue to Post-Implementation Validation
[T] Run tests again
[B] Run build again
[H] Halt pipeline
```

**Batch Mode:** Auto-continue if all tests pass

## QUALITY GATE

Before proceeding:
- [ ] All tests pass (GREEN)
- [ ] Lint clean
- [ ] Build succeeds
- [ ] All ATDD checklist items complete
- [ ] RLS policies for new tables

## MCP TOOLS AVAILABLE

- `mcp__exa__get_code_context_exa` - Implementation patterns
- `mcp__supabase__list_tables` - Schema inspection
- `mcp__supabase__execute_sql` - Query testing
- `mcp__supabase__apply_migration` - Schema changes
- `mcp__supabase__generate_typescript_types` - Type sync

## CRITICAL STEP COMPLETION

**ONLY WHEN** [all tests pass AND lint clean AND build succeeds],
load and execute `{nextStepFile}` for post-implementation validation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All tests pass (GREEN phase)
- TDD methodology followed
- Result type used (no throws)
- RLS policies in place
- Lint and build clean

### ❌ FAILURE
- Tests still failing
- Skipping tests to implement faster
- Throwing errors instead of Result type
- Missing RLS policies
- Build or lint failures
