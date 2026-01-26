# Detect Ghost Features - Reverse Gap Analysis (Who You Gonna Call?)

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="1" goal="Load all stories in scope">
  <action>Determine scan scope based on parameters:</action>

  <check if="scan_scope == 'epic' AND epic_number provided">
    <action>Read {sprint_status}</action>
    <action>Filter stories starting with "{{epic_number}}-"</action>
    <action>Store as: stories_in_scope</action>
    <output>🔍 Scanning Epic {{epic_number}} stories for documented features...</output>
  </check>

  <check if="scan_scope == 'sprint'">
    <action>Read {sprint_status}</action>
    <action>Get ALL story keys (exclude epics and retrospectives)</action>
    <action>Store as: stories_in_scope</action>
    <output>🔍 Scanning entire sprint for documented features...</output>
  </check>

  <check if="scan_scope == 'codebase'">
    <action>Set stories_in_scope = ALL stories found in {sprint_artifacts}</action>
    <output>🔍 Scanning entire codebase for documented features...</output>
  </check>

  <action>For each story in stories_in_scope:</action>
  <action>  Read story file</action>
  <action>  Extract documented artifacts:</action>
  <action>    - File List (all paths mentioned)</action>
  <action>    - Tasks (all file/component/service names mentioned)</action>
  <action>    - ACs (all features/functionality mentioned)</action>
  <action>  Store in: documented_artifacts[story_key] = {files, components, services, apis, features}</action>

  <output>
✅ Loaded {{stories_in_scope.length}} stories
📋 Documented artifacts extracted from {{total_sections}} sections
  </output>
</step>

<step n="2" goal="Scan codebase for actual implementations">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 SCANNING FOR GHOST FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Looking for: Components, APIs, Services, DB Tables, Models
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="2a" title="Scan for React/Vue/Angular components">
    <check if="scan_for.components == true">
      <action>Use Glob to find component files:</action>
      <action>  - **/*.component.{tsx,jsx,ts,js,vue} (Angular/Vue pattern)</action>
      <action>  - **/components/**/*.{tsx,jsx} (React pattern)</action>
      <action>  - **/src/**/*{Component,View,Screen,Page}.{tsx,jsx} (Named pattern)</action>

      <action>For each found component file:</action>
      <action>  Extract component name from filename or export</action>
      <action>  Check file size (ignore <50 lines as trivial)</action>
      <action>  Read file to determine if it's a significant feature</action>

      <action>Store as: codebase_components = [{name, path, size, purpose}]</action>

      <output>📦 Found {{codebase_components.length}} components</output>
    </check>
  </substep>

  <substep n="2b" title="Scan for API endpoints">
    <check if="scan_for.api_endpoints == true">
      <action>Use Glob to find API files:</action>
      <action>  - **/api/**/*.{ts,js} (Next.js/Express pattern)</action>
      <action>  - **/*.controller.{ts,js} (NestJS pattern)</action>
      <action>  - **/routes/**/*.{ts,js} (Generic routes)</action>

      <action>Use Grep to find endpoint definitions:</action>
      <action>  - @Get|@Post|@Put|@Delete decorators (NestJS)</action>
      <action>  - export async function GET|POST|PUT|DELETE (Next.js App Router)</action>
      <action>  - router.get|post|put|delete (Express)</action>
      <action>  - app.route (Flask/FastAPI if Python)</action>

      <action>For each endpoint found:</action>
      <action>  Extract: HTTP method, path, handler name</action>
      <action>  Read file to understand functionality</action>

      <action>Store as: codebase_apis = [{method, path, handler, file}]</action>

      <output>🌐 Found {{codebase_apis.length}} API endpoints</output>
    </check>
  </substep>

  <substep n="2c" title="Scan for database tables">
    <check if="scan_for.database_tables == true">
      <action>Use Glob to find schema files:</action>
      <action>  - **/prisma/schema.prisma (Prisma)</action>
      <action>  - **/*.entity.{ts,js} (TypeORM)</action>
      <action>  - **/models/**/*.{ts,js} (Mongoose/Sequelize)</action>
      <action>  - **/*-table.ts (Custom)</action>

      <action>Use Grep to find table definitions:</action>
      <action>  - model (Prisma)</action>
      <action>  - @Entity (TypeORM)</action>
      <action>  - createTable (Migrations)</action>

      <action>For each table found:</action>
      <action>  Extract: table name, columns, relationships</action>

      <action>Store as: codebase_tables = [{name, file, columns}]</action>

      <output>🗄️ Found {{codebase_tables.length}} database tables</output>
    </check>
  </substep>

  <substep n="2d" title="Scan for services/modules">
    <check if="scan_for.services == true">
      <action>Use Glob to find service files:</action>
      <action>  - **/*.service.{ts,js}</action>
      <action>  - **/services/**/*.{ts,js}</action>
      <action>  - **/*Service.{ts,js}</action>

      <action>For each service found:</action>
      <action>  Extract: service name, key methods, dependencies</action>
      <action>  Ignore trivial services (<100 lines)</action>

      <action>Store as: codebase_services = [{name, file, methods}]</action>

      <output>⚙️ Found {{codebase_services.length}} services</output>
    </check>
  </substep>
</step>

<step n="3" goal="Cross-reference codebase artifacts with stories">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CROSS-REFERENCING CODEBASE ↔ STORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Initialize: orphaned_features = []</action>

  <substep n="3a" title="Check components">
    <iterate>For each component in codebase_components:</iterate>

    <action>Search all stories for mentions of:</action>
    <action>  - Component name in File Lists</action>
    <action>  - Component name in Task descriptions</action>
    <action>  - Component file path in File Lists</action>
    <action>  - Feature described by component in ACs</action>

    <check if="NO stories mention this component">
      <action>Add to orphaned_features:</action>
      <action>
        type: "component"
        name: {{component.name}}
        path: {{component.path}}
        size: {{component.size}} lines
        purpose: {{inferred_purpose_from_code}}
        severity: "HIGH" # Significant orphan
      </action>
      <output>  👻 ORPHAN: {{component.name}} ({{component.path}})</output>
    </check>

    <check if="stories mention this component">
      <output>  ✅ Documented: {{component.name}} → {{story_keys}}</output>
    </check>
  </substep>

  <substep n="3b" title="Check API endpoints">
    <iterate>For each API in codebase_apis:</iterate>

    <action>Search all stories for mentions of:</action>
    <action>  - Endpoint path (e.g., "/api/users")</action>
    <action>  - HTTP method + resource (e.g., "POST users")</action>
    <action>  - Handler file in File Lists</action>
    <action>  - API functionality in ACs (e.g., "Users can create account")</action>

    <check if="NO stories mention this API">
      <action>Add to orphaned_features:</action>
      <action>
        type: "api"
        method: {{api.method}}
        path: {{api.path}}
        handler: {{api.handler}}
        file: {{api.file}}
        severity: "CRITICAL" # APIs are critical functionality
      </action>
      <output>  👻 ORPHAN: {{api.method}} {{api.path}} ({{api.file}})</output>
    </check>
  </substep>

  <substep n="3c" title="Check database tables">
    <iterate>For each table in codebase_tables:</iterate>

    <action>Search all stories for mentions of:</action>
    <action>  - Table name</action>
    <action>  - Migration file in File Lists</action>
    <action>  - Data model in Tasks</action>

    <check if="NO stories mention this table">
      <action>Add to orphaned_features:</action>
      <action>
        type: "database"
        name: {{table.name}}
        file: {{table.file}}
        columns: {{table.columns.length}}
        severity: "HIGH" # Database changes are significant
      </action>
      <output>  👻 ORPHAN: Table {{table.name}} ({{table.file}})</output>
    </check>
  </substep>

  <substep n="3d" title="Check services">
    <iterate>For each service in codebase_services:</iterate>

    <action>Search all stories for mentions of:</action>
    <action>  - Service name or class name</action>
    <action>  - Service file in File Lists</action>
    <action>  - Service functionality in Tasks/ACs</action>

    <check if="NO stories mention this service">
      <action>Add to orphaned_features:</action>
      <action>
        type: "service"
        name: {{service.name}}
        file: {{service.file}}
        methods: {{service.methods.length}}
        severity: "MEDIUM" # Services are business logic
      </action>
      <output>  👻 ORPHAN: {{service.name}} ({{service.file}})</output>
    </check>
  </substep>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cross-Reference Complete
👻 Orphaned Features: {{orphaned_features.length}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="4" goal="Analyze and categorize orphans">
  <action>Group orphans by type and severity:</action>
  <action>
    - critical_orphans (APIs, auth, payment)
    - high_orphans (Components, DB tables, services)
    - medium_orphans (Utilities, helpers)
    - low_orphans (Config files, constants)
  </action>

  <action>Estimate complexity for each orphan:</action>
  <action>  Based on file size, dependencies, test coverage</action>

  <action>Suggest epic assignment based on functionality:</action>
  <action>  - Auth components → Epic focusing on authentication</action>
  <action>  - UI components → Epic focusing on frontend</action>
  <action>  - API endpoints → Epic for that resource type</action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GHOST FEATURES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total Orphans:** {{orphaned_features.length}}

**By Severity:**
- 🔴 CRITICAL: {{critical_orphans.length}} (APIs, security-critical)
- 🟠 HIGH: {{high_orphans.length}} (Components, DB, services)
- 🟡 MEDIUM: {{medium_orphans.length}} (Utilities, helpers)
- 🟢 LOW: {{low_orphans.length}} (Config, constants)

**By Type:**
- Components: {{component_orphans.length}}
- API Endpoints: {{api_orphans.length}}
- Database Tables: {{db_orphans.length}}
- Services: {{service_orphans.length}}
- Other: {{other_orphans.length}}

---

**CRITICAL Orphans (Immediate Action Required):**
{{#each critical_orphans}}
{{@index + 1}}. **{{type | uppercase}}**: {{name}}
   File: {{file}}
   Purpose: {{inferred_purpose}}
   Risk: {{why_critical}}
   Suggested Epic: {{suggested_epic}}
{{/each}}

---

**HIGH Priority Orphans:**
{{#each high_orphans}}
{{@index + 1}}. **{{type | uppercase}}**: {{name}}
   File: {{file}}
   Size: {{size}} lines / {{complexity}} complexity
   Suggested Epic: {{suggested_epic}}
{{/each}}

---

**Detection Confidence:**
- Artifacts scanned: {{total_artifacts_scanned}}
- Stories cross-referenced: {{stories_in_scope.length}}
- Documentation coverage: {{documented_pct}}%
- Orphan rate: {{orphan_rate}}%

{{#if orphan_rate > 20}}
⚠️ **HIGH ORPHAN RATE** - Over 20% of codebase is undocumented!
Recommend: Comprehensive backfill story creation session
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="5" goal="Propose backfill stories">
  <check if="create_backfill_stories == false">
    <output>
Backfill story creation disabled. To create stories for orphans, run:
/detect-ghost-features create_backfill_stories=true
    </output>
    <action>Jump to Step 7 (Generate Report)</action>
  </check>

  <check if="orphaned_features.length == 0">
    <output>✅ No orphans found - all code is documented in stories!</output>
    <action>Jump to Step 7</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PROPOSING BACKFILL STORIES ({{orphaned_features.length}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <iterate>For each orphaned feature (prioritized by severity):</iterate>

  <substep n="5a" title="Generate backfill story draft">
    <action>Analyze orphan to understand functionality:</action>
    <action>  - Read implementation code</action>
    <action>  - Identify dependencies and related files</action>
    <action>  - Determine what it does (infer from code)</action>
    <action>  - Find tests (if any) to understand use cases</action>

    <action>Generate story draft:</action>
    <action>
Story Title: "Document existing {{name}} {{type}}"

Story Description:
This is a BACKFILL STORY documenting existing functionality found in the codebase
that was not tracked in any story (likely vibe-coded or manually added).

Business Context:
{{inferred_business_purpose_from_code}}

Current State:
✅ **Implementation EXISTS:** {{file}}
- {{description_of_what_it_does}}
- {{key_features_or_methods}}
{{#if has_tests}}✅ Tests exist: {{test_files}}{{else}}❌ No tests found{{/if}}

Acceptance Criteria:
{{#each inferred_acs_from_code}}
- [ ] {{this}}
{{/each}}

Tasks:
- [x] {{name}} implementation (ALREADY EXISTS - {{file}})
{{#if missing_tests}}- [ ] Add tests for {{name}}{{/if}}
{{#if missing_docs}}- [ ] Add documentation for {{name}}{{/if}}
- [ ] Verify functionality works as expected
- [ ] Add to relevant epic or create new epic for backfills

Definition of Done:
- [x] Implementation exists and works
{{#if has_tests}}- [x] Tests exist{{else}}- [ ] Tests added{{/if}}
- [ ] Documented in story (this story)
- [ ] Assigned to appropriate epic

Story Type: BACKFILL (documenting existing code)
    </action>

    <output>
📄 Generated backfill story draft for: {{name}}

{{story_draft_preview}}

---
    </output>
  </substep>

  <substep n="5b" title="Ask user if they want to create this backfill story">
    <check if="auto_create == true">
      <action>Create backfill story automatically</action>
      <output>✅ Auto-created: {{story_filename}}</output>
    </check>

    <check if="auto_create == false">
      <ask>
Create backfill story for {{name}}?

**Type:** {{type}}
**File:** {{file}}
**Suggested Epic:** {{suggested_epic}}
**Complexity:** {{complexity_estimate}}

[Y] Yes - Create this backfill story
[A] Auto - Create this and all remaining backfill stories
[E] Edit - Let me adjust the story draft first
[S] Skip - Don't create story for this orphan
[H] Halt - Stop backfill story creation

Your choice:
      </ask>

      <check if="choice == 'Y'">
        <action>Create backfill story file: {sprint_artifacts}/backfill-{{type}}-{{name}}.md</action>
        <action>Add to backfill_stories_created list</action>
        <output>✅ Created: {{story_filename}}</output>
      </check>

      <check if="choice == 'A'">
        <action>Set auto_create = true</action>
        <action>Create this story and auto-create remaining</action>
      </check>

      <check if="choice == 'E'">
        <ask>Provide your adjusted story content or instructions for modifications:</ask>
        <action>Apply user's edits to story draft</action>
        <action>Create modified backfill story</action>
      </check>

      <check if="choice == 'S'">
        <action>Add to skipped_backfills list</action>
        <output>⏭️ Skipped</output>
      </check>

      <check if="choice == 'H'">
        <action>Exit backfill story creation loop</action>
        <action>Jump to Step 6</action>
      </check>
    </check>
  </substep>

  <check if="add_to_sprint_status AND backfill_stories_created.length > 0">
    <action>Load {sprint_status} file</action>

    <iterate>For each created backfill story:</iterate>
    <action>  Add entry: {{backfill_story_key}}: backlog  # BACKFILL - documents existing {{name}}</action>

    <action>Save sprint-status.yaml</action>

    <output>✅ Added {{backfill_stories_created.length}} backfill stories to sprint-status.yaml</output>
  </check>
</step>

<step n="6" goal="Suggest epic organization for orphans">
  <check if="backfill_stories_created.length > 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BACKFILL STORY ORGANIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Group backfill stories by suggested epic:</action>

    <iterate>For each suggested_epic:</iterate>
    <output>
**{{suggested_epic}}:**
{{#each backfill_stories_for_epic}}
  - {{story_key}}: {{name}} ({{type}})
{{/each}}
    </output>

    <output>
---

**Recommendations:**

1. **Option A: Create "Epic-Backfill" for all orphans**
   - Single epic containing all backfill stories
   - Easy to track undocumented code
   - Clear separation from feature work

2. **Option B: Distribute to existing epics**
   - Add each backfill story to its logical epic
   - Better thematic grouping
   - May inflate epic story counts

3. **Option C: Leave in backlog**
   - Don't assign to epics yet
   - Review and assign during next planning

**Your choice:**
[A] Create Epic-Backfill (recommended)
[B] Distribute to existing epics
[C] Leave in backlog for manual assignment
[S] Skip epic assignment
    </output>

    <ask>How should backfill stories be organized?</ask>

    <check if="choice == 'A'">
      <action>Create epic-backfill.md in epics directory</action>
      <action>Update sprint-status.yaml with epic-backfill entry</action>
      <action>Assign all backfill stories to epic-backfill</action>
    </check>

    <check if="choice == 'B'">
      <iterate>For each backfill story:</iterate>
      <action>  Assign to suggested_epic in sprint-status.yaml</action>
      <action>  Update story_key to match epic (e.g., 2-11-backfill-userprofile)</action>
    </check>

    <check if="choice == 'C' OR choice == 'S'">
      <action>Leave stories in backlog</action>
    </check>
  </check>
</step>

<step n="7" goal="Generate comprehensive report">
  <check if="create_report == true">
    <action>Write report to: {sprint_artifacts}/ghost-features-report-{{timestamp}}.md</action>

    <action>Report structure:</action>
    <action>
# Ghost Features Report (Reverse Gap Analysis)

**Generated:** {{timestamp}}
**Scope:** {{scan_scope}} {{#if epic_number}}(Epic {{epic_number}}){{/if}}

## Executive Summary

**Codebase Artifacts Scanned:** {{total_artifacts_scanned}}
**Stories Cross-Referenced:** {{stories_in_scope.length}}
**Orphaned Features Found:** {{orphaned_features.length}}
**Documentation Coverage:** {{documented_pct}}%
**Backfill Stories Created:** {{backfill_stories_created.length}}

## Orphaned Features Detail

### CRITICAL Orphans ({{critical_orphans.length}})
[Full list with files, purposes, risks]

### HIGH Priority Orphans ({{high_orphans.length}})
[Full list]

### MEDIUM Priority Orphans ({{medium_orphans.length}})
[Full list]

## Backfill Stories Created

{{#each backfill_stories_created}}
- {{story_key}}: {{story_file}}
{{/each}}

## Recommendations

[Epic assignment suggestions, next steps]

## Appendix: Scan Methodology

[How detection worked, patterns used, confidence levels]
    </action>

    <output>📄 Full report: {{report_path}}</output>
  </check>
</step>

<step n="8" goal="Final summary and next steps">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GHOST FEATURE DETECTION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Scan Scope:** {{scan_scope}} {{#if epic_number}}(Epic {{epic_number}}){{/if}}

**Results:**
- 👻 Orphaned Features: {{orphaned_features.length}}
- 📝 Backfill Stories Created: {{backfill_stories_created.length}}
- ⏭️ Skipped: {{skipped_backfills.length}}
- 📊 Documentation Coverage: {{documented_pct}}%

{{#if orphaned_features.length == 0}}
✅ **EXCELLENT!** All code is documented in stories.
Your codebase and story backlog are in perfect sync.
{{/if}}

{{#if orphaned_features.length > 0 AND backfill_stories_created.length == 0}}
**Action Required:**
Run with create_backfill_stories=true to generate stories for orphans
{{/if}}

{{#if backfill_stories_created.length > 0}}
**Next Steps:**

1. **Review backfill stories** - Check generated stories for accuracy
2. **Assign to epics** - Organize backfills (or create Epic-Backfill)
3. **Update sprint-status.yaml** - Already updated with {{backfill_stories_created.length}} new entries
4. **Prioritize** - Decide when to implement tests/docs for orphans
5. **Run revalidation** - Verify orphans work as expected

**Quick Commands:**
```bash
# Revalidate a backfill story to verify functionality
/revalidate-story story_file={{backfill_stories_created[0].file}}

# Process backfill stories (add tests/docs)
/batch-super-dev filter_by_epic=backfill
```
{{/if}}

{{#if create_report}}
**Detailed Report:** {{report_path}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Pro Tip:** Run this periodically (e.g., end of each sprint) to catch
vibe-coded features before they become maintenance nightmares.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
