# Implement Workflow (Bug Fix or Feature)

```xml
<critical>This workflow loads bug/feature context, implements the code, and updates tracking in both bugs.yaml and bugs.md</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>Auto-detects type from ID format: bug-NNN = bug fix, feature-NNN = feature implementation</critical>

<workflow>

  <step n="1" goal="Get item ID from user">
    <check if="item_id not provided in user input">
      <ask>Which bug or feature should I implement? (e.g., bug-026 or feature-021)</ask>
    </check>
    <action>Extract item ID from user input</action>
    <action>Detect type from ID format:</action>
    <action>- "bug-NNN" -> type = "bug", action_verb = "fix", past_verb = "Fixed"</action>
    <action>- "feature-NNN" -> type = "feature", action_verb = "implement", past_verb = "Implemented"</action>
    <check if="ID doesn't match either format">
      <output>Invalid ID format. Use bug-NNN (e.g., bug-026) or feature-NNN (e.g., feature-021)</output>
      <action>HALT</action>
    </check>
  </step>

  <step n="2" goal="Load context from bugs.yaml">
    <action>Search for {item_id} in {bugs_yaml} using grep with 50+ lines of context after the match (do NOT read entire file - it exceeds token limits)</action>
    <check if="type == bug">
      <action>Entry will be in bugs section, grep will capture all fields</action>
    </check>
    <check if="type == feature">
      <action>Entry will be in feature_requests section, grep will capture all fields</action>
    </check>
    <check if="item not found in bugs.yaml">
      <output>{item_id} not found in bugs.yaml. Please verify the ID or run bug-tracking workflow first.</output>
      <action>HALT</action>
    </check>
    <action>Extract and store metadata:</action>
    <action>- title: Title/summary</action>
    <action>- description: Full description</action>
    <action>- severity/priority: Importance level</action>
    <action>- complexity: trivial | small | medium | complex</action>
    <action>- effort_estimate: Estimated hours</action>
    <action>- affected_platform: all | ios | android (bugs only)</action>
    <action>- related_story/related_epic: Related items if applicable</action>
    <action>- doc_impact: Documentation impact flags (prd, architecture, ux) and notes</action>
    <action>- notes: Triage notes including planned approach, files to check, implementation strategy</action>

    <check if="recommended_workflow == 'backlog'">
      <output>**BACKLOG ITEM - NOT READY FOR IMPLEMENTATION**

**{item_id}: {title}**

This item has `recommended_workflow: backlog` which means it's deferred and not scheduled for implementation.

**To implement this item, first promote it to the sprint:**
1. Run `*sprint-planning` and select this item for promotion
2. Or manually update bugs.yaml: change `recommended_workflow` to `direct-fix`, `tech-spec`, or `correct-course`

**Current Status:** {status}
**Priority:** {priority}
**Complexity:** {complexity}
      </output>
      <action>HALT</action>
    </check>

    <check if="status == 'deferred'">
      <output>**DEFERRED ITEM - NOT READY FOR IMPLEMENTATION**

**{item_id}: {title}**

This item is deferred (marked for future release, not current MVP).

**To implement this item:**
1. Update bugs.yaml: change `status` from `deferred` to `backlog`
2. Run `*sprint-planning` to promote to current sprint

**Notes:** {notes}
      </output>
      <action>HALT</action>
    </check>

    <check if="status == 'blocked'">
      <output>**BLOCKED ITEM - CANNOT IMPLEMENT**

**{item_id}: {title}**

This item is blocked and requires clarification before implementation.

**Blocking reason:** {notes}

**To unblock:**
1. Resolve the blocking issue
2. Update bugs.yaml: change `status` from `blocked` to `backlog`
3. Run `/triage {item_id}` to re-evaluate
      </output>
      <action>HALT</action>
    </check>
  </step>

  <step n="2.5" goal="Check for documentation impact and route to appropriate agents">
    <action>Check doc_impact fields from bugs.yaml entry</action>
    <check if="doc_impact.prd OR doc_impact.architecture OR doc_impact.ux is TRUE">
      <output>**DOCUMENTATION IMPACT DETECTED**

**{item_id}: {title}**

This {type} requires documentation updates BEFORE implementation:

{if doc_impact.prd:}
- **PRD Impact:** Updates needed to product requirements
  -> Route to PM Agent for PRD updates
{end if}

{if doc_impact.architecture:}
- **Architecture Impact:** Updates needed to architecture docs
  -> Route to Architect Agent for architecture updates
{end if}

{if doc_impact.ux:}
- **UX Impact:** Updates needed to UX specifications
  -> Route to UX Designer Agent for UX spec updates
{end if}

**Details:** {doc_impact.notes}

**Options:**
1. **update-docs-first** - Route to agents for documentation updates before implementation (recommended)
2. **proceed-anyway** - Skip documentation updates and implement directly (not recommended)
3. **cancel** - Return to review</output>
      <ask>How should we proceed?</ask>

      <check if="user chooses update-docs-first">
        <output>Routing to documentation update workflow...

**Documentation Update Sequence:**</output>

        <check if="doc_impact.prd">
          <output>1. **PRD Update** - Invoking PM Agent...</output>
          <action>Prepare PRD update context:</action>
          <action>- Source item: {item_id}</action>
          <action>- Change description: {description}</action>
          <action>- Specific PRD sections: {doc_impact.notes PRD sections}</action>
          <invoke-agent agent="pm">
            <task>Review and update PRD for {item_id}: {title}

Change context: {description}

Documentation notes: {doc_impact.notes}

Please update the relevant PRD sections to reflect this change.

After updates:
1. Summarize what was changed
2. Return to the implement workflow by running: /implement {item_id}

IMPORTANT: You MUST return to /implement {item_id} after completing the PRD updates so the actual code implementation can proceed.</task>
          </invoke-agent>
        </check>

        <check if="doc_impact.architecture">
          <output>2. **Architecture Update** - Invoking Architect Agent...</output>
          <action>Prepare architecture update context:</action>
          <action>- Source item: {item_id}</action>
          <action>- Change description: {description}</action>
          <action>- Specific architecture sections: {doc_impact.notes architecture sections}</action>
          <invoke-agent agent="architect">
            <task>Review and update Architecture documentation for {item_id}: {title}

Change context: {description}

Documentation notes: {doc_impact.notes}

Please update the relevant architecture sections (data model, APIs, security, etc.) to reflect this change.

After updates:
1. Summarize what was changed
2. Return to the implement workflow by running: /implement {item_id}

IMPORTANT: You MUST return to /implement {item_id} after completing the architecture updates so the actual code implementation can proceed.</task>
          </invoke-agent>
        </check>

        <check if="doc_impact.ux">
          <output>3. **UX Spec Update** - Invoking UX Designer Agent...</output>
          <action>Prepare UX update context:</action>
          <action>- Source item: {item_id}</action>
          <action>- Change description: {description}</action>
          <action>- Specific UX sections: {doc_impact.notes UX sections}</action>
          <invoke-agent agent="ux-designer">
            <task>Review and update UX specification for {item_id}: {title}

Change context: {description}

Documentation notes: {doc_impact.notes}

Please update the relevant UX spec sections (screens, flows, components, etc.) to reflect this change.

After updates:
1. Summarize what was changed
2. Return to the implement workflow by running: /implement {item_id}

IMPORTANT: You MUST return to /implement {item_id} after completing the UX updates so the actual code implementation can proceed.</task>
          </invoke-agent>
        </check>

        <output>**Documentation updates complete.**

Proceeding with implementation...</output>
        <action>Continue to step 3</action>
      </check>

      <check if="user chooses cancel">
        <output>Cancelled. {item_id} remains in current state.</output>
        <action>HALT</action>
      </check>

      <action if="user chooses proceed-anyway">
        <output>Proceeding without documentation updates. Remember to update docs after implementation.</output>
        <action>Continue to step 3</action>
      </action>
    </check>
  </step>

  <step n="3" goal="Evaluate routing and auto-route to correct-course if needed">
    <action>Check recommended_workflow field from bugs.yaml</action>

    <check if="recommended_workflow == 'correct-course'">
      <output>**AUTO-ROUTING TO CORRECT-COURSE**

**{item_id}: {title}**
**Priority:** {severity_or_priority} | **Complexity:** {complexity}

This {type} has `recommended_workflow: correct-course` which requires impact analysis and story creation before implementation.

Invoking correct-course workflow via SM agent...</output>

      <action>Invoke the correct-course workflow skill with item context</action>
      <invoke-skill skill="bmad:bmm:workflows:correct-course">
        <args>{item_id}: {title} - {description}

Priority: {severity_or_priority}
Complexity: {complexity}
Doc Impact: {doc_impact summary}
Notes: {notes}</args>
      </invoke-skill>
      <action>HALT - Correct Course workflow will handle story/epic creation</action>
    </check>

    <check if="recommended_workflow == 'tech-spec'">
      <output>**AUTO-ROUTING TO TECH-SPEC**

**{item_id}: {title}**

This {type} has `recommended_workflow: tech-spec`. Invoking tech-spec workflow...</output>

      <invoke-skill skill="bmad:bmm:workflows:tech-spec">
        <args>{item_id}: {title} - {description}</args>
      </invoke-skill>
      <action>HALT - Tech-spec workflow will create implementation spec</action>
    </check>

    <check if="recommended_workflow == 'direct-fix'">
      <output>**DIRECT IMPLEMENTATION**

This {type} is routed for direct implementation. Proceeding...</output>
      <action>Continue to step 4</action>
    </check>

    <check if="recommended_workflow is not set OR recommended_workflow is ambiguous">
      <action>Evaluate the workflow routing matrix based on severity and complexity:</action>
      <action>**Routing Matrix:**</action>
      <action>- critical + any -> correct-course</action>
      <action>- high/medium + medium/complex -> correct-course</action>
      <action>- high + trivial -> direct-fix</action>
      <action>- high/medium + small -> tech-spec</action>
      <action>- medium + trivial -> direct-fix</action>
      <action>- low + trivial -> direct-fix</action>
      <action>- low + small+ -> backlog</action>

      <action>Apply matrix to determine routing and continue accordingly</action>
    </check>
  </step>

  <step n="4" goal="Present context and confirm approach">
    <output>**{item_id}: {title}**

**Type:** {type} | **Severity/Priority:** {severity_or_priority} | **Complexity:** {complexity} | **Effort:** ~{effort_estimate}h

**Description:**
{description}

**Planned Approach (from triage notes):**
{notes}

**Related:** {related_story} / {related_epic}
    </output>
    <ask>Ready to {action_verb} this {type}? (yes/no/clarify)</ask>
    <check if="user says clarify">
      <ask>What additional context do you need?</ask>
      <action>Gather clarification, update mental model</action>
    </check>
    <check if="user says no">
      <output>Cancelled. {item_id} remains in current state.</output>
      <action>HALT</action>
    </check>
  </step>

  <step n="5" goal="Implement the fix/feature">
    <action>Based on the notes/planned approach, identify files to modify or create</action>
    <action>Read each affected file to understand current implementation</action>
    <action>Implement following the planned approach:</action>
    <action>- Make minimal, targeted changes</action>
    <action>- Follow existing code patterns and style</action>
    <action>- Add comments only where logic is non-obvious</action>
    <action>- Do not over-engineer or add unrelated improvements</action>
    <action>- Do not add extra features or "nice to haves"</action>

    <action>For each file modified/created, track:</action>
    <action>- File path</action>
    <action>- What was changed/added</action>
    <action>- How it addresses the bug/feature</action>

    <check if="requires new files">
      <action>Create new files following project conventions</action>
      <action>Add appropriate imports/exports</action>
    </check>

    <check if="planned approach is unclear or insufficient">
      <ask>The triage notes don't provide a clear approach.

Based on my analysis, I suggest: {proposed_approach}

Should I proceed with this approach?</ask>
    </check>
  </step>

  <step n="6" goal="Verify implementation compiles">
    <action>Run TypeScript compilation check: npm run check</action>
    <check if="compilation errors in modified files">
      <action>Fix compilation errors</action>
      <action>Re-run compilation check</action>
    </check>
    <output>Compilation check passed.</output>
  </step>

  <step n="6.5" goal="Pre-update sync check">
    <action>Search for {item_id} in both bugs.yaml and bugs.md using grep to check current status</action>
    <check if="status differs between files OR item missing from one file">
      <output>SYNC WARNING: {item_id} status mismatch detected
- bugs.yaml: {yaml_status}
- bugs.md: {md_status}
Proceeding will update both files to "{new_status}".</output>
    </check>
  </step>

  <step n="7" goal="Update bugs.yaml">
    <action>Update entry in bugs.yaml:</action>
    <check if="type == bug">
      <action>- status: "fixed"</action>
      <action>- fixed_date: {date} (YYYY-MM-DD format)</action>
    </check>
    <check if="type == feature">
      <action>- status: "implemented"</action>
      <action>- implemented_date: {date} (YYYY-MM-DD format)</action>
    </check>
    <action>- assigned_to: "dev-agent"</action>
    <action>- files_modified: {list of files changed/created during implementation}</action>
    <action>- Append to notes: "{past_verb} ({date}): {summary of changes made}"</action>
    <action>Write updated bugs.yaml</action>
  </step>

  <step n="8" goal="Update bugs.md">
    <action>Search for {item_id} in {bugs_md} using grep with surrounding context to locate the entry</action>

    <action>**8a. Remove from tracked section (if present)**</action>
    <check if="type == bug">
      <action>Search for "{item_id}:" in "# Tracked Bugs" section</action>
    </check>
    <check if="type == feature">
      <action>Search for "{item_id}:" in "# Tracked Feature Requests" section</action>
    </check>
    <action>If found, remove the entire entry (including any indented sub-items)</action>

    <action>**8b. Add to completed section (INSERT AT TOP - newest first)**</action>
    <check if="type == bug">
      <action>Locate "# Fixed Bugs" section in bugs.md</action>
      <action>If section not found, create it</action>
      <action>INSERT AT TOP of section (immediately after "# Fixed Bugs" header):</action>
      <action>[IMPLEMENTED] {item_id}: {title} - {brief_description}. [Severity: {severity}, Platform: {platform}, Fixed: {date}, Verified: pending]</action>
      <action>  - Fix: {description of what was fixed}</action>
      <action>  - File(s): {list of modified files}</action>
    </check>
    <check if="type == feature">
      <action>Locate "# Implemented Features" section in bugs.md</action>
      <action>If section not found, create it before "# Fixed Bugs"</action>
      <action>INSERT AT TOP of section (immediately after "# Implemented Features" header):</action>
      <action>[IMPLEMENTED] {item_id}: {title} - {brief_description}. [Implemented: {date}, Platform: {platform}, Verified: pending]</action>
      <action>  - Files: {list of modified/created files}</action>
      <action>  - Features: {bullet list of what was implemented}</action>
    </check>
    <action>Write updated bugs.md</action>
  </step>

  <step n="9" goal="Post-update validation">
    <action>Search for {item_id} in both bugs.yaml and bugs.md using grep to validate updates</action>
    <action>Confirm {item_id} shows status "fixed"/"implemented" in bugs.yaml</action>
    <action>Confirm {item_id} has [IMPLEMENTED] tag in bugs.md</action>
    <check if="validation fails">
      <output>SYNC ERROR: Files may be out of sync. Please verify manually:
- bugs.yaml: Expected status "fixed"/"implemented"
- bugs.md: Expected [IMPLEMENTED] tag in appropriate section</output>
    </check>
  </step>

  <step n="10" goal="Present completion summary">
    <output>**{item_id} {past_verb.upper()}**

**Changes Made:**
{for each modified file:}
- {file_path}: {what was changed}
{end for}

**Updated Tracking:**
- bugs.yaml: status -> "{status}", {date_field} -> {date}, files_modified updated
- bugs.md: Moved to "{target_section}" with [IMPLEMENTED] tag

**Verification Status:** pending

**Next Steps:**
1. Test manually
2. Run `/verify {item_id}` after verification to close
    </output>
  </step>

</workflow>
```

## Usage

```
/implement bug-026
/implement feature-021
```

## Key Principles

1. **Auto-detect Type** - ID format determines bug vs feature handling
2. **Context First** - Always read and present details before implementing
3. **Confirm Approach** - Validate planned approach with user before coding
4. **Minimal Changes** - Only implement what's needed, no scope creep
5. **Dual Tracking** - ALWAYS update both bugs.yaml AND bugs.md
6. **[IMPLEMENTED] Tag** - Indicates complete but awaiting verification

---

## Reference: Bug Tracking Definitions

### Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| **critical** | Blocks core functionality, prevents app use, or causes data loss (crashes, auth broken, data corruption) | Fix immediately, may require hotfix |
| **high** | Major feature broken, significant UX degradation, workaround exists but painful (platform-specific failure, 5+ sec delays, accessibility blocker) | Fix in current/next sprint |
| **medium** | Feature partially broken, UX degraded but usable (minor feature broken, unclear errors, 1-3 sec delays) | Fix when capacity allows |
| **low** | Minor issue, cosmetic, edge case (typos, spacing, visual glitches) | Fix opportunistically or defer |

### Complexity Levels

| Level | Description | Effort |
|-------|-------------|--------|
| **trivial** | Obvious fix, single line change, no investigation needed (typo, missing semicolon, wrong color) | < 30 minutes |
| **small** | Single file/component, clear root cause, solution known (missing validation, incorrect prop, logic error) | 30 min - 2 hours |
| **medium** | Multiple files affected OR investigation required (spans 2-3 components, debugging needed, integration issue) | 2-8 hours |
| **complex** | Architectural issue, affects multiple stories, requires design changes (race conditions, refactoring, profiling) | 8+ hours (1-2 days) |

### Workflow Routing Matrix

| Severity | Complexity | Workflow | Rationale |
|----------|------------|----------|-----------|
| critical | any | correct-course -> urgent | Need impact analysis even if small fix |
| high | trivial | direct-fix (urgent) | Fast path for obvious important fix |
| high | small | tech-spec (urgent) | Fast path with minimal overhead |
| high | medium+ | correct-course -> story | Need proper analysis + testing |
| medium | trivial | direct-fix | Too small for workflow overhead |
| medium | small | tech-spec | Isolated fix needs spec |
| medium | medium+ | correct-course -> story | Multi-file change needs story |
| low | trivial | direct-fix (defer) | Fix opportunistically |
| low | small+ | backlog (defer) | Document but don't schedule yet |

### Status Flow

```
reported -> triaged -> routed -> in-progress -> fixed -> verified -> closed
```

| Status | Description |
|--------|-------------|
| **reported** | Bug logged in bugs.md, not yet analyzed |
| **triaged** | PM analyzed, assigned severity/complexity/workflow |
| **routed** | Workflow determined, story/tech-spec created |
| **in-progress** | Developer actively working on fix |
| **fixed** | Code changed, tests passing, ready for verification |
| **verified** | Bug confirmed fixed by reporter or QA |
| **closed** | Bug resolved and verified, no further action |

### Metadata Fields

| Field | Description |
|-------|-------------|
| id | Unique identifier (bug-NNN or feature-NNN) |
| title | Short description (< 80 chars) |
| description | Detailed explanation |
| severity | critical \| high \| medium \| low |
| complexity | trivial \| small \| medium \| complex |
| status | Current workflow state |
| recommended_workflow | direct-fix \| tech-spec \| correct-course \| backlog |
| effort_estimate | Hours (based on complexity) |
| reported_by / reported_date | Who found it and when |
| triaged_by / triaged_date | Who triaged and when |
| fixed_date / verified_date | Implementation and verification dates |
| related_story / related_epic | Context links |
| affected_platform | all \| ios \| android |
| doc_impact | Documentation impact: prd, architecture, ux flags + notes |
| notes | Investigation notes, decisions, implementation details |
