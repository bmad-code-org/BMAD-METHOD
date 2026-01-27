# Detect Ghost Features v3.0 - Reverse Gap Analysis

<purpose>
Find undocumented code (components, APIs, services, tables) that exist in codebase
but aren't tracked in any story. "Who you gonna call?" - Ghost Features.
</purpose>

<philosophy>
**Reverse Gap Analysis**

Normal gap analysis: story says X should exist → does it?
Reverse gap analysis: X exists in code → is it documented?

Undocumented features become maintenance nightmares.
Find them, create backfill stories, restore traceability.
</philosophy>

<config>
name: detect-ghost-features
version: 3.0.0

scan_scope:
  epic: "Filter to specific epic number"
  sprint: "All stories in sprint-status.yaml"
  codebase: "All stories in sprint-artifacts"

scan_for:
  components: true
  api_endpoints: true
  database_tables: true
  services: true

severity:
  critical: "APIs, auth, payment (undocumented = high risk)"
  high: "Components, DB tables, services"
  medium: "Utilities, helpers"
  low: "Config files, constants"

defaults:
  create_backfill_stories: false
  auto_create: false
  add_to_sprint_status: true
  create_report: true
</config>

<execution_context>
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="load_stories" priority="first">
**Load documented artifacts from stories**

Based on scan_scope (epic/sprint/codebase):

```bash
# Get all story files
STORIES=$(ls docs/sprint-artifacts/*.md | grep -v "epic-")
```

For each story:
1. Read story file
2. Extract documented artifacts:
   - File List (all paths mentioned)
   - Tasks (file/component/service names)
   - ACs (features/functionality)
3. Store in: documented_artifacts[story_key]
</step>

<step name="scan_codebase">
**Scan codebase for actual implementations**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 SCANNING FOR GHOST FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Components:**
```bash
# Find React/Vue/Angular components
find . -name "*.tsx" -o -name "*.jsx" | xargs grep -l "export.*function\|export.*const"
```

**API Endpoints:**
```bash
# Find Next.js/Express routes
find . -path "*/api/*" -name "*.ts"
grep -r "export.*GET\|export.*POST\|router\.\(get\|post\)" .
```

**Database Tables:**
```bash
# Find Prisma/TypeORM models
grep -r "^model " prisma/schema.prisma
find . -name "*.entity.ts"
```

**Services:**
```bash
find . -name "*.service.ts" -o -name "*Service.ts"
```
</step>

<step name="cross_reference">
**Compare codebase artifacts to story documentation**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CROSS-REFERENCING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For each codebase artifact:
1. Search all stories for mentions of:
   - Component/file name
   - File path
   - Feature description
2. If NO stories mention it → ORPHAN (ghost feature)
3. If stories mention it → Documented

Track orphans with:
- type (component/api/db/service)
- name and path
- severity
- inferred purpose
</step>

<step name="categorize_orphans">
**Analyze and prioritize ghost features**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GHOST FEATURES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Orphans: {{count}}

By Severity:
- 🔴 CRITICAL: {{critical}} (APIs, security)
- 🟠 HIGH: {{high}} (Components, DB, services)
- 🟡 MEDIUM: {{medium}} (Utilities)
- 🟢 LOW: {{low}} (Config)

By Type:
- Components: {{components}}
- API Endpoints: {{apis}}
- Database Tables: {{tables}}
- Services: {{services}}

Documentation Coverage: {{documented_pct}}%
Orphan Rate: {{orphan_pct}}%

{{#if orphan_pct > 20}}
⚠️ HIGH ORPHAN RATE - Over 20% undocumented!
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="create_backfill_stories" if="create_backfill_stories">
**Generate stories for orphaned features**

For each orphan (prioritized by severity):

1. **Analyze orphan** - Read implementation, find tests, understand purpose
2. **Generate story draft:**

```markdown
# Story: Document existing {{name}}

**Type:** BACKFILL (documenting existing code)

## Business Context
{{inferred_from_code}}

## Current State
✅ Implementation EXISTS: {{file}}
{{#if has_tests}}✅ Tests exist{{else}}❌ No tests{{/if}}

## Acceptance Criteria
{{inferred_acs}}

## Tasks
- [x] {{name}} implementation (ALREADY EXISTS)
{{#if !has_tests}}- [ ] Add tests{{/if}}
- [ ] Verify functionality
- [ ] Assign to epic
```

3. **Ask user** (unless auto_create):
   - [Y] Create story
   - [A] Auto-create all remaining
   - [S] Skip this orphan
   - [H] Halt

4. **Write story file:** `docs/sprint-artifacts/backfill-{{type}}-{{name}}.md`

5. **Update sprint-status.yaml** (if enabled)
</step>

<step name="suggest_organization" if="backfill_stories_created">
**Recommend epic assignment**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BACKFILL ORGANIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:
[A] Create Epic-Backfill (recommended)
    - Single epic for all backfill stories
    - Clear separation from feature work

[B] Distribute to existing epics
    - Add each to its logical epic

[C] Leave in backlog
    - Manual assignment later
```
</step>

<step name="generate_report" if="create_report">
**Write comprehensive ghost features report**

Write to: `docs/sprint-artifacts/ghost-features-report-{{timestamp}}.md`

Include:
- Executive summary
- Full orphan list by severity
- Backfill stories created
- Recommendations
- Scan methodology
</step>

<step name="final_summary">
**Display results and next steps**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GHOST FEATURE DETECTION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Orphans Found: {{orphan_count}}
Backfill Stories Created: {{backfill_count}}
Documentation Coverage: {{documented_pct}}%

{{#if orphan_count == 0}}
✅ All code is documented in stories!
{{else}}
Next Steps:
1. Review backfill stories for accuracy
2. Assign to epics
3. Add tests/docs for orphans
4. Run revalidation to verify
{{/if}}

💡 Pro Tip: Run this periodically to catch
   vibe-coded features before they become
   maintenance nightmares.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

</process>

<failure_handling>
**No stories found:** Check scan_scope, verify sprint-artifacts exists.
**Scan fails:** Report which scan type failed, continue others.
**Backfill creation fails:** Skip, continue to next orphan.
</failure_handling>

<success_criteria>
- [ ] All artifact types scanned
- [ ] Cross-reference completed
- [ ] Orphans categorized by severity
- [ ] Backfill stories created (if enabled)
- [ ] Report generated
</success_criteria>
