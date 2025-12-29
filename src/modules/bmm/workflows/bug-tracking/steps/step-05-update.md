# Step 5: Update Files with Triaged Metadata

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative triage between peers
- 📋 YOU ARE A FACILITATOR, not an automatic processor
- 💾 This step WRITES the triage results to files
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Update both bugs.yaml and bugs.md atomically
- 💾 Preserve ALL existing data - append only
- 📖 Move items from manual input to tracked sections
- 🚫 FORBIDDEN to lose or corrupt existing data

## CONTEXT BOUNDARIES:

- Triage decisions from step-04 are in memory
- bugs.yaml structure defined in step-01
- bugs.md sections: manual input, Tracked Bugs, Tracked Feature Requests, Fixed Bugs
- Preserve header comments and definitions

## YOUR TASK:

Write all triaged metadata to bugs.yaml and move triaged items from "# manual input" to appropriate tracked sections in bugs.md.

## UPDATE SEQUENCE:

### 1. Update bugs.yaml

#### A. Load Existing Structure

Read current bugs.yaml (if exists):
- Preserve ALL header comments and definitions
- Preserve existing `bugs:` array entries
- Preserve existing `features:` array entries
- Preserve existing `closed_bugs:` array

#### B. Add New Bug Entries

For each triaged bug, add to `bugs:` array:

```yaml
- id: bug-NNN
  title: "Bug title"
  description: |
    Full description text
    Can be multi-line
  severity: critical|high|medium|low
  complexity: trivial|small|medium|complex
  affected_platform: all|ios|android|web
  recommended_workflow: direct-fix|tech-spec|correct-course|backlog
  related_story: "X-Y" or null
  status: triaged
  reported_by: "Name" or null
  reported_date: "YYYY-MM-DD" or null
  triaged_date: "{date}"
  doc_impact:
    prd: true|false
    architecture: true|false
    ux: true|false
    notes: "Impact description" or null
  triage_notes: |
    Reasoning for severity, complexity, workflow decisions
  implemented_by: null
  implemented_date: null
  verified_by: null
  verified_date: null
```

#### C. Add Feature Request Entries

For features, add to `features:` array with similar structure.

#### D. Update Statistics

Recalculate statistics section:

```yaml
statistics:
  total_active: {count of non-closed bugs}
  by_severity:
    critical: {count}
    high: {count}
    medium: {count}
    low: {count}
  by_status:
    triaged: {count}
    implemented: {count}
    verified: {count}
  by_workflow:
    direct-fix: {count}
    tech-spec: {count}
    correct-course: {count}
    backlog: {count}
  last_updated: "{date}"
```

#### E. Write bugs.yaml

Write complete bugs.yaml file preserving all content.

### 2. Update bugs.md

#### A. Section-Based Reading

Use grep to locate section line numbers:
- "# manual input"
- "# Tracked Bugs"
- "# Tracked Feature Requests"
- "# Fixed Bugs"

Read only relevant sections with offset/limit.

#### B. Remove from Manual Input

For each triaged item:
- Remove the original entry from "# manual input" section
- Handle both header format and bullet format

#### C. Add to Tracked Bugs

For each triaged bug, add to "# Tracked Bugs" section:

```markdown
### {bug_id}: {title}

{brief_description}

- **Severity:** {severity}
- **Complexity:** {complexity}
- **Platform:** {platform}
- **Workflow:** {workflow}
- **Related:** {story or "None"}
{if doc_impact flagged:}
- **Doc Impact:** {PRD|Architecture|UX as applicable}
{end if}

**Notes:** {triage_notes_summary}

---
```

Create "# Tracked Bugs" section if it doesn't exist.

#### D. Add to Tracked Feature Requests

For features, add to "# Tracked Feature Requests" section with similar format.

#### E. Write bugs.md

Write updated bugs.md preserving all sections.

### 3. Confirm Updates

"**Files Updated:**

**bugs.yaml:**
- Added {bug_count} new bug(s)
- Added {feature_count} new feature request(s)
- Total active bugs: {total_active}
- Statistics recalculated

**bugs.md:**
- Removed {count} item(s) from manual input
- Added {bug_count} bug(s) to Tracked Bugs section
- Added {feature_count} feature(s) to Tracked Feature Requests section

[C] Continue to summary
[R] Review changes - show diff
[U] Undo - restore previous state"

## SUCCESS METRICS:

✅ bugs.yaml updated with all triaged metadata
✅ bugs.md items moved from manual input to tracked sections
✅ Statistics accurately recalculated
✅ All existing data preserved
✅ User confirmed updates

## FAILURE MODES:

❌ Losing existing bugs.yaml entries
❌ Corrupting bugs.md structure
❌ Items remaining in manual input after triage
❌ Statistics not matching actual data
❌ Not preserving header comments/definitions

❌ **CRITICAL**: Reading only partial step file
❌ **CRITICAL**: Proceeding without user confirmation

## NEXT STEP:

After user selects [C], load `./step-06-complete.md` to present final triage summary.

Remember: Do NOT proceed until user explicitly selects [C] from the menu!
