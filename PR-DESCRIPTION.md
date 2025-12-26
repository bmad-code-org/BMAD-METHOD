# Gap Analysis & Enhanced Quality Workflows

## What

Three new capabilities for ensuring story tasks match codebase reality:

1. **Gap Analysis in dev-story** - Validates tasks before implementation starts
2. **Standalone gap-analysis** - Audit completed stories or validate before development
3. **super-dev-story** - Enhanced workflow with post-dev validation + auto code review

## Why

**Batch planning creates stale stories.** By the time Story 1.3 executes, Stories 1.1-1.2 have created reusable code, but the story still says "create X" → duplicate implementations, wasted time, confusion.

Gap analysis detects existing code and proposes task refinements (extend vs create, remove completed work, add missing dependencies) ensuring stories reflect **current codebase reality**.

## How

**create-story**: Simplified to requirements analysis, generates DRAFT tasks
**dev-story**: Added Step 1.5 - scans codebase, proposes task refinements, 6 user options (Y/A/n/e/s/r)
**gap-analysis**: Standalone audit tool - validates stories without starting development
**super-dev-story**: All dev-story steps + post-dev gap analysis + auto code review

## Testing

✅ All validation checks pass (schemas, lint, format)
✅ Tested via symlink in platform project
✅ Ready for real-world batch planning scenarios

---

**Changes:** 3 workflows, 4 new docs, 16 files total
**Lines:** ~2,740 additions
**Modules:** BMM and BMGD
**Breaking:** None - fully backwards compatible
