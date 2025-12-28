# Bug Tracking Workflow - Triage and Route

```xml
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow transforms informal bug reports (bugs.md) into structured metadata (bugs.yaml) with routing recommendations</critical>

<workflow>

  <step n="0" goal="Sync bug reports from PostgreSQL">
    <action>**0a. Fetch pending bug reports from the application database:**</action>
    <action>GET {project_url}/api/bug-reports/pending</action>
    <action>This endpoint returns all bug reports with status 'new' (not yet synced)</action>
    <action>Response format: { data: { reports: [...], count: number } }</action>
    <action>Each report contains: id, title, description, reporterType, reporterName, platform, browser, pageUrl, screenshotUrl, createdAt</action>

    <check if="count == 0">
      <output>No new bug reports from app. Proceeding with manual input check...</output>
      <action>Continue to Step 1</action>
    </check>

    <check if="count > 0">
      <action>**0b. Format reports as markdown entries:**</action>
      <action>For each report, create markdown entry:
```markdown
## Bug: {title}

{description}

Reported by: {reporterName} ({reporterType})
Date: {createdAt formatted as YYYY-MM-DD}
Platform: {platform} / {browser}
Page: {pageUrl}
{if screenshotUrl: Screenshot: {screenshotUrl}}
```
      </action>

      <action>**0c. Insert into bugs.md under "# manual input" section:**</action>
      <action>- Read the "# manual input" section location from bugs.md</action>
      <action>- Insert the new markdown entries after the "# manual input" header</action>
      <action>- Preserve any existing manual input entries</action>
      <action>- Write updated bugs.md</action>

      <action>**0d. Mark reports as synced in database:**</action>
      <action>POST {project_url}/api/bug-reports/mark-synced</action>
      <action>Body: { ids: [array of synced report IDs] }</action>
      <action>This updates status to 'synced' so reports won't be fetched again</action>

      <output>**Synced {count} bug report(s) from app:**
{for each report:}
- {title} (from {reporterName})
{end for}

Proceeding with triage...
      </output>
    </check>
  </step>

  <step n="1" goal="Load input files and initialize">
    <action>Resolve variables from config_source: bugs_input, bugs_output, sprint_status, epics_file</action>

    <action>**1a. Read "# manual input" section from bugs.md (section-based reading):**</action>
    <action>- Grep for "# manual input" to find starting line number</action>
    <action>- Grep for next section header ("# Tracked Bugs", "# Tracked Feature Requests", "# Fixed Bugs") to find ending line</action>
    <action>- Read just that range using offset/limit (do NOT read entire file)</action>
    <action>- If no closing section found within initial window, expand read range and retry</action>

    <action>**1b. Search bugs.yaml for existing IDs (do NOT read entire file):**</action>
    <action>- Grep for "bug-[0-9]+" pattern to find all existing bug IDs</action>
    <action>- Grep for "feature-[0-9]+" pattern to find all existing feature IDs</action>
    <action>- This allows duplicate detection and next-ID generation without reading full file</action>
    <action>- If bugs.yaml doesn't exist, create it with header/definitions from template</action>

    <action>Load {sprint_status} to understand current sprint context (which stories are in progress)</action>
    <action>Load {epics_file} to map bugs to related stories/epics</action>
  </step>

  <step n="2" goal="Parse bugs.md and identify new/updated bugs">
    <action>Parse {bugs_input} (bugs.md) to extract bug reports</action>
    <action>CRITICAL: Only triage items from the "# manual input" section</action>
    <action>DO NOT triage:
      - Items in "# Tracked Bugs" section (already triaged)
      - Items in "# Tracked Feature Requests" section (already triaged)
      - Items in "# Fixed Bugs" section (already closed)
    </action>
    <action>Expected format in "# manual input" section (informal, user-written):
      - Markdown headers (## Bug: Title) OR bullet lists
      - Freeform descriptions
      - Optional fields: reported by, date, related story
      - May be incomplete (missing severity, complexity, etc.)
    </action>
    <action>Extract from each bug report in "# manual input":
      - Title (required)
      - Description (required - may be multi-paragraph)
      - Reported by (optional - extract if mentioned)
      - Reported date (optional - extract if mentioned)
      - Related story (optional - extract story ID if mentioned, e.g. "2-7" or "Story 2.7")
      - Platform (optional - extract if mentioned: iOS, Android, all)
      - Any reproduction steps
    </action>
    <action>Compare extracted bugs with existing bugs.yaml entries:</action>
    <action>- New bugs: Not in bugs.yaml yet (need full triage)</action>
    <action>- Updated bugs: Already in bugs.yaml but description changed (need re-triage)</action>
    <action>- Unchanged bugs: Already triaged, skip</action>
    <action>If NO new bugs found in "# manual input" section:</action>
    <output>No new bugs found in bugs.md

All bugs have already been triaged and are tracked in bugs.yaml.

**Options:**
1. Add new bugs to docs/bugs.md (informal format)
2. View bugs.yaml to see structured bug tracking
3. Route existing triaged bugs to workflows
    </output>
    <action>HALT</action>
  </step>

  <step n="3" goal="Triage each new/updated bug" for-each="new_bug">
    <action>For each new/updated bug, perform triage analysis:</action>

    <action>**3a. Generate Bug ID**</action>
    <action>- Use grep results from Step 1b to find highest existing bug-NNN</action>
    <action>- Assign next sequential ID (e.g., bug-006)</action>
    <action>- Format: "bug-" + zero-padded 3-digit number</action>

    <action>**3b. Assess Severity** (critical, high, medium, low)</action>
    <action>Analysis questions:</action>
    <action>- Does it prevent core functionality? (critical)</action>
    <action>- Does it cause crashes or data loss? (critical)</action>
    <action>- Does it block major features? (high)</action>
    <action>- Does it significantly degrade UX but have workaround? (high)</action>
    <action>- Does it affect subset of users with minor impact? (medium)</action>
    <action>- Is it cosmetic or edge case? (low)</action>
    <action>Reference severity definitions in bugs.yaml header</action>
    <check if="severity unclear from description">
      <ask>**Clarification needed for bug: {bug_title}**

I need more information to assess severity:

1. Does this bug prevent users from completing core flows?
2. Does the bug cause crashes or data loss?
3. How many users are affected? (all users, specific platform, edge case)
4. Is there a workaround available?

Please provide additional context so I can properly triage this bug.
      </ask>
    </check>

    <action>**3c. Assess Complexity** (trivial, small, medium, complex)</action>
    <action>Analysis questions:</action>
    <action>- Is it a one-line fix? (trivial)</action>
    <action>- Single file/component, solution obvious? (small)</action>
    <action>- Multiple files OR requires investigation? (medium)</action>
    <action>- Architectural change OR affects many stories? (complex)</action>
    <action>Reference complexity definitions in bugs.yaml header</action>
    <check if="complexity unclear from description">
      <ask>**Clarification needed for bug: {bug_title}**

To estimate complexity, I need:

1. Have you identified the root cause, or does it need investigation?
2. Which file(s) or component(s) are affected?
3. Is this an isolated issue or does it affect multiple parts of the app?

Please provide technical details if available (stack trace, repro steps, affected files).
      </ask>
    </check>

    <action>**3d. Calculate Effort Estimate** (in hours)</action>
    <action>Based on complexity:</action>
    <action>- trivial: 0.25 - 0.5 hours</action>
    <action>- small: 0.5 - 2 hours</action>
    <action>- medium: 2 - 8 hours</action>
    <action>- complex: 8 - 16+ hours</action>

    <action>**3e. Determine Workflow Path**</action>
    <action>Apply routing matrix from bugs.yaml header:</action>
    <action>- critical + any complexity -> "correct-course" (need impact analysis)</action>
    <action>- high + trivial -> "direct-fix" (urgent, obvious fix)</action>
    <action>- high + small -> "tech-spec" (urgent, needs spec)</action>
    <action>- high + medium/complex -> "correct-course" (need proper analysis)</action>
    <action>- medium + trivial -> "direct-fix"</action>
    <action>- medium + small -> "tech-spec"</action>
    <action>- medium + medium/complex -> "correct-course"</action>
    <action>- low + trivial -> "direct-fix" (defer)</action>
    <action>- low + small/medium/complex -> "backlog" (defer)</action>

    <action>**3f. Map to Related Story/Epic**</action>
    <action>If bug mentions story ID (e.g., "2-7"), use that</action>
    <action>Otherwise, infer from description using epic keywords</action>
    <action>Reference epics.md for story matching</action>

    <action>**3g. Determine Affected Platform**</action>
    <action>From description, extract: all | ios | android | web</action>
    <action>Default to "all" if not specified</action>

    <action>**3h. Set Initial Status**</action>
    <action>- New bug -> status: "triaged"</action>
    <action>- All other fields: null or empty (to be filled when routed/fixed)</action>

    <action>**3i. Add Triage Notes**</action>
    <action>Document reasoning:</action>
    <action>- Why this severity? (business impact, user impact)</action>
    <action>- Why this complexity? (investigation needed, files affected)</action>
    <action>- Why this workflow? (routing logic applied)</action>
    <action>- Suggested next steps or investigation areas</action>

    <action>**3j. Assess Documentation Impact**</action>
    <action>Evaluate if fix/feature requires updates beyond code:</action>

    <action>**PRD Impact** (doc_impact.prd: true/false)</action>
    <action>Set TRUE if issue:</action>
    <action>- Conflicts with stated product goals or objectives</action>
    <action>- Requires changing MVP scope or feature definitions</action>
    <action>- Adds/removes/modifies core user-facing functionality</action>
    <action>- Changes success metrics or acceptance criteria at product level</action>
    <action>- Affects multiple epics or cross-cutting concerns</action>

    <action>**Architecture Impact** (doc_impact.architecture: true/false)</action>
    <action>Set TRUE if issue:</action>
    <action>- Requires new system components or services</action>
    <action>- Changes data model (new tables, schema modifications)</action>
    <action>- Affects API contracts or integration points</action>
    <action>- Introduces new dependencies or technology choices</action>
    <action>- Changes authentication, authorization, or security model</action>
    <action>- Modifies deployment or infrastructure patterns</action>

    <action>**UX Impact** (doc_impact.ux: true/false)</action>
    <action>Set TRUE if issue:</action>
    <action>- Adds new screens, modals, or navigation paths</action>
    <action>- Changes existing user flows or interaction patterns</action>
    <action>- Requires new UI components not in design system</action>
    <action>- Affects accessibility or responsive behavior requirements</action>
    <action>- Changes visual hierarchy or information architecture</action>
    <action>- Impacts user onboarding or first-run experience</action>

    <action>**Documentation Notes** (doc_impact.notes)</action>
    <action>If any impact is TRUE, briefly describe:</action>
    <action>- Which specific sections need updates</action>
    <action>- Nature of the change (addition, modification, removal)</action>
    <action>- Dependencies between document updates</action>

    <check if="any doc_impact is TRUE AND recommended_workflow != 'correct-course'">
      <action>**Override workflow to correct-course**</action>
      <action>Documentation impact requires proper change analysis before implementation</action>
      <action>Update recommended_workflow: "correct-course"</action>
      <action>Add to notes: "Workflow elevated to correct-course due to documentation impact"</action>
    </check>
  </step>

  <step n="4" goal="Update bugs.yaml and bugs.md with triaged metadata">
    <action>**4a. Update bugs.yaml**</action>
    <action>Load existing bugs.yaml structure (if exists)</action>
    <action>For each triaged bug:</action>
    <action>- If new bug: Add to "bugs:" section with all metadata</action>
    <action>- If existing bug: Update metadata fields if changed</action>
    <action>Preserve all existing bugs and closed_bugs sections</action>
    <action>Update statistics section:</action>
    <action>- Count bugs by severity, complexity, status, workflow</action>
    <action>- Set last_updated to {date}</action>
    <action>Write complete bugs.yaml file</action>
    <action>Preserve ALL header comments and definitions</action>

    <action>**4b. Update bugs.md - Move triaged bugs to # Tracked Bugs section**</action>
    <action>Use section-based reading to locate relevant sections:</action>
    <action>- Grep for "# manual input" and "# Tracked Bugs" line numbers</action>
    <action>- Read just those sections with offset/limit (do NOT read entire file)</action>
    <action>For each newly triaged bug:</action>
    <action>- REMOVE the original entry from "# manual input" section</action>
    <action>- ADD formatted entry to "# Tracked Bugs" section (create section if missing)</action>
    <action>- Format: "{bug_id}: {title} - {brief_description}. [Severity: {severity}, Complexity: {complexity}, Platform: {affected_platform}, Workflow: {recommended_workflow}]"</action>
    <action>- If doc_impact flagged, add: "Doc Impact: {prd|architecture|ux as applicable}"</action>
    <action>- Include sub-items with notes if available</action>
    <action>For feature requests, use "# Tracked Feature Requests" section instead</action>
    <action>Write updated bugs.md</action>
  </step>

  <step n="5" goal="Present triage summary and next steps">
    <output>**Bug Triage Complete, {user_name}!**

**Triaged {triaged_count} bug(s):**

{for each triaged bug:}
---
**{bug_id}: {bug_title}**
- **Severity:** {severity} | **Complexity:** {complexity} | **Platform:** {affected_platform}
- **Effort:** ~{effort_estimate} hours
- **Recommended Workflow:** {recommended_workflow}
- **Related:** {related_story} (Epic {related_epic})
{if doc_impact.prd OR doc_impact.architecture OR doc_impact.ux:}
- **Documentation Impact:** {prd: Y | architecture: Y | ux: Y as applicable}
  - {doc_impact.notes}
{end if}

**Triage Reasoning:**
{triage_notes}

{end for}

---

**Updated Files:**
- docs/bugs.yaml - Structured metadata for all triaged bugs
- docs/bugs.md - Moved triaged bugs to "# Tracked Bugs" section

**Summary:**
- Total Active Bugs: {total_active_bugs}
- Critical: {critical_count} | High: {high_count} | Medium: {medium_count} | Low: {low_count}

{if any doc_impact flagged:}
**Documentation Updates Required:**
- PRD Impact: {prd_impact_count} item(s)
- Architecture Impact: {arch_impact_count} item(s)
- UX Impact: {ux_impact_count} item(s)

Items with documentation impact have been routed to `correct-course` workflow.
{end if}

**Workflow Recommendations:**
- Direct Fix ({direct_fix_count}): `/implement bug-NNN` - Quick fixes, no spec needed
- Tech-Spec ({tech_spec_count}): Create tech-spec first, then `/implement`
- Correct-Course ({correct_course_count}): Run correct-course workflow for impact analysis

---

**Next Steps:**

To implement a bug fix:
```
/implement bug-NNN
```

To verify and close after testing:
```
/verify bug-NNN
```

To verify all implemented bugs:
```
/verify
```
    </output>
  </step>

</workflow>
```

## Example bugs.md Format (User-Facing)

Users can write bugs in any freeform markdown format. The workflow parses common patterns:

**Option 1: Markdown Headers**
```markdown
## Bug: Join button doesn't work on Android

When I tap the "Join" button, nothing happens. Tested on Samsung Galaxy S21.

Reported by: Sarah
Date: Nov 19, 2025
Related: Story 2.7
```

**Option 2: Bullet Lists**
```markdown
- **Join button unresponsive (Android)**: Button doesn't respond to taps. Works on iOS. Probably a touch target issue.
- **App crashes offline**: If I turn off WiFi and try to create something, the app crashes. CRITICAL!
```

**Option 3: Numbered Lists**
```markdown
1. Typo in success message - says "sucessfully" instead of "successfully"
2. Times showing in UTC instead of local time - very confusing for users
```

The workflow is flexible and extracts whatever information is available, then prompts the user for missing details during triage.
