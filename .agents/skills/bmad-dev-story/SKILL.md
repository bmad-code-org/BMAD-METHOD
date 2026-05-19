---
name: bmad-dev-story
description: 'Execute story implementation following a context filled story spec file. Use when the user says "dev this story [story file]" or "implement the next story in the sprint plan"'
---

# Dev Story Workflow

**Goal:** Execute story implementation following a context filled story spec file.

**Your Role:** Developer implementing the story.
- Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}
- Generate all documents in {document_output_language}
- Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status
- Execute ALL steps in exact order; do NOT skip steps
- Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives other instruction.
- Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 9 decides completion.
- User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.

## Conventions

- Bare paths (e.g. `steps/step-01-init.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `user_skill_level`
- `implementation_artifacts`
- `date` as system-generated current datetime

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. Begin the workflow below.

## Paths

- `story_file` = `` (explicit story path; auto-discovered if empty)
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`

## Execution

<workflow>
  <critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
  <critical>Generate all documents in {document_output_language}</critical>
  <critical>Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List,
    Change Log, and Status</critical>
  <critical>Execute ALL steps in exact order; do NOT skip steps</critical>
  <critical>Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution
    until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives
    other instruction.</critical>
  <critical>Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 9 decides completion.</critical>
  <critical>User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.</critical>

  <step n="1" goal="Find next ready story and load it" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto anchor="task_check" />
    </check>

    <!-- Sprint-based story discovery -->
    <check if="{{sprint_status}} file exists">
      <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
      <action>Load the FULL file: {{sprint_status}}</action>
      <action>Read ALL lines from beginning to end - do not skip any content</action>
      <action>Parse the development_status section completely to understand story order</action>

      <action>Find the FIRST story (by reading in order from top to bottom) where:
        - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
        - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
        - Status value equals "ready-for-dev"
      </action>

      <check if="no ready-for-dev or in-progress story found">
        <output>📋 No ready-for-dev stories found in sprint-status.yaml

          **Current Sprint Status:** {{sprint_status_summary}}

          **What would you like to do?**
          1. Run `create-story` to create next story from epics with comprehensive context
          2. Run `*validate-create-story` to improve existing stories before development (recommended quality check)
          3. Specify a particular story file to develop (provide full path)
          4. Check {{sprint_status}} file to see current sprint status

          💡 **Tip:** Stories in `ready-for-dev` may not have been validated. Consider running `validate-create-story` first for a quality
          check.
        </output>
        <ask>Choose option [1], [2], [3], or [4], or specify story file path:</ask>

        <check if="user chooses '1'">
          <action>HALT - Run create-story to create next story</action>
        </check>

        <check if="user chooses '2'">
          <action>HALT - Run validate-create-story to improve existing stories</action>
        </check>

        <check if="user chooses '3'">
          <ask>Provide the story file path to develop:</ask>
          <action>Store user-provided story path as {{story_path}}</action>
          <goto anchor="task_check" />
        </check>

        <check if="user chooses '4'">
          <output>Loading {{sprint_status}} for detailed status review...</output>
          <action>Display detailed sprint status analysis</action>
          <action>HALT - User can review sprint status and provide story path</action>
        </check>

        <check if="user provides story file path">
          <action>Store user-provided story path as {{story_path}}</action>
          <goto anchor="task_check" />
        </check>
      </check>
    </check>

    <!-- Non-sprint story discovery -->
    <check if="{{sprint_status}} file does NOT exist">
      <action>Search {implementation_artifacts} for stories directly</action>
      <action>Find stories with "ready-for-dev" status in files</action>
      <action>Look for story files matching pattern: *-*-*.md</action>
      <action>Read each candidate story file to check Status section</action>

      <check if="no ready-for-dev stories found in story files">
        <output>📋 No ready-for-dev stories found

          **Available Options:**
          1. Run `create-story` to create next story from epics with comprehensive context
          2. Run `*validate-create-story` to improve existing stories
          3. Specify which story to develop
        </output>
        <ask>What would you like to do? Choose option [1], [2], or [3]:</ask>

        <check if="user chooses '1'">
          <action>HALT - Run create-story to create next story</action>
        </check>

        <check if="user chooses '2'">
          <action>HALT - Run validate-create-story to improve existing stories</action>
        </check>

        <check if="user chooses '3'">
          <ask>It's unclear what story you want developed. Please provide the full path to the story file:</ask>
          <action>Store user-provided story path as {{story_path}}</action>
          <action>Continue with provided story file</action>
        </check>
      </check>

      <check if="ready-for-dev story found in files">
        <action>Use discovered story file and extract story_key</action>
      </check>
    </check>

    <action>Store the found story_key (e.g., "1-2-user-authentication") for later status updates</action>
    <action>Find matching story file in {implementation_artifacts} using story_key pattern: {{story_key}}.md</action>
    <action>Read COMPLETE story file from discovered path</action>

    <anchor id="task_check" />

    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>

    <action>Load comprehensive context from story file's Dev Notes section</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>

    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <action if="no incomplete tasks">
      <goto step="10">Completion sequence</goto>
    </action>
    <action if="story file inaccessible">HALT: "Cannot develop story without access to story file"</action>
    <action if="incomplete task or subtask requirements ambiguous">ASK user to clarify or HALT</action>
  </step>

  <step n="2" goal="Load project context and story information">
    <critical>Load all available context to inform implementation</critical>

    <action>Load {project_context} for coding standards and project-wide patterns (if exists)</action>
    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>
    <action>Load comprehensive context from story file's Dev Notes section</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>
    <output>✅ **Context Loaded**
      Story and project context available for implementation
    </output>
  </step>

  <step n="3" goal="Detect review continuation and extract review context">
    <critical>Determine if this is a fresh start or continuation after code review</critical>

    <action>Check if "Senior Developer Review (AI)" section exists in the story file</action>
    <action>Check if "Review Follow-ups (AI)" subsection exists under Tasks/Subtasks</action>

    <check if="Senior Developer Review section exists">
      <action>Set review_continuation = true</action>
      <action>Extract from "Senior Developer Review (AI)" section:
        - Review outcome (Approve/Changes Requested/Blocked)
        - Review date
        - Total action items with checkboxes (count checked vs unchecked)
        - Severity breakdown (High/Med/Low counts)
      </action>
      <action>Count unchecked [ ] review follow-up tasks in "Review Follow-ups (AI)" subsection</action>
      <action>Store list of unchecked review items as {{pending_review_items}}</action>

      <output>⏯️ **Resuming Story After Code Review** ({{review_date}})

        **Review Outcome:** {{review_outcome}}
        **Action Items:** {{unchecked_review_count}} remaining to address
        **Priorities:** {{high_count}} High, {{med_count}} Medium, {{low_count}} Low

        **Strategy:** Will prioritize review follow-up tasks (marked [AI-Review]) before continuing with regular tasks.
      </output>
    </check>

    <check if="Senior Developer Review section does NOT exist">
      <action>Set review_continuation = false</action>
      <action>Set {{pending_review_items}} = empty</action>

      <output>🚀 **Starting Fresh Implementation**

        Story: {{story_key}}
        Story Status: {{current_status}}
        First incomplete task: {{first_task_description}}
      </output>
    </check>
  </step>

  <step n="4" goal="Mark story in-progress" tag="sprint-status">
    <check if="{{sprint_status}} file exists">
      <action>Load the FULL file: {{sprint_status}}</action>
      <action>Read all development_status entries to find {{story_key}}</action>
      <action>Get current status value for development_status[{{story_key}}]</action>

      <check if="current status == 'ready-for-dev' OR review_continuation == true">
        <action>Update the story in the sprint status report to = "in-progress"</action>
        <action>Update last_updated field to current date</action>
        <output>🚀 Starting work on story {{story_key}}
          Status updated: ready-for-dev → in-progress
        </output>
      </check>

      <check if="current status == 'in-progress'">
        <output>⏯️ Resuming work on story {{story_key}}
          Story is already marked in-progress
        </output>
      </check>

      <check if="current status is neither ready-for-dev nor in-progress">
        <output>⚠️ Unexpected story status: {{current_status}}
          Expected ready-for-dev or in-progress. Continuing anyway...
        </output>
      </check>

      <action>Store {{current_sprint_status}} for later use</action>
    </check>

    <check if="{{sprint_status}} file does NOT exist">
      <output>ℹ️ No sprint status file exists - story progress will be tracked in story file only</output>
      <action>Set {{current_sprint_status}} = "no-sprint-tracking"</action>
    </check>
  </step>

  <step n="5" goal="Blast radius verification and halting">
    <critical>MANDATORY: Before ANY code modification, calculate the structural blast radius and obtain explicit human approval. NEVER skip this step.</critical>

    <!-- Identify targets from story context -->
    <action>Extract target symbols and files from the story's Dev Notes and Tasks/Subtasks sections. Identify every file that this story will modify or create.</action>
    <action if="no explicit targets found in story Dev Notes">ASK user: "Which symbols or files are you modifying? The story doesn't specify explicit targets for blast radius analysis."</action>

    <!-- Memtrace availability + freshness check via adapter (merged with blast radius query) -->
    <action>For each target symbol, call the memtrace-adapter with `--check-freshness` which verifies index freshness before the blast radius query: `node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <symbol> --query get_impact --check-freshness --summarize`. The adapter checks freshness first (separate MCP session), then runs the main query. Process targets SEQUENTIALLY using `for...of` with `await` — NEVER use `Promise.all`.</action>
    <action>On exit code 0 — freshness OK; parse STDOUT JSON for the `summarized` field and `affected_symbols`. On exit code 1 — check STDERR: if `[FRESHNESS]` line present, treat as "Index stale or missing — re-index before proceeding"; if `MEMTRACE_MCP_ERROR_TIMEOUT` in STDOUT, treat as "MCP server unreachable." Both cases → HALT.</action>
    <check if="adapter exit code is 1">
      <action>HALT: "Memtrace query failed. See STDERR for details: [FRESHNESS] = stale/missing index; MEMTRACE_MCP_ERROR_TIMEOUT = MCP server unreachable."</action>
    </check>
    <action>Parse the adapter's STDOUT JSON for each target. Extract the `summarized` field for the Confidence Report (guaranteed ≤2000 tokens by the adapter). The `summarized` field contains: `total_affected`, `critical_dependents` (depth 1-2 symbols), `module_impact` (grouped by directory prefix with `count` and optional `top_symbols`), and `token_estimate`. Also extract `affected_symbols` (raw array) for qa-memtrace.mjs consumption.</action>

    <!-- Present Confidence Report using summarized data -->
    <action>Present the Blast Radius Confidence Report in this format:

      ## Blast Radius Confidence Report

      **Target:** [symbol/file]
      **Risk Level:** [Low/Medium/High/Critical]
      **Affected Symbols:** {{summarized.total_affected}} downstream dependents across {{count of module_impact entries}} modules

      ### Critical Dependents (Depth 1-2)
      From `summarized.critical_dependents`:
      {{for each symbol in summarized.critical_dependents}}
      - `{{symbol.name}}` in `{{symbol.file}}`
      {{end}}

      ### Module Impact Summary
      From `summarized.module_impact`:
      {{for each [prefix, mod] in summarized.module_impact}}
      - `{{prefix}}`: {{mod.count}} symbols{{if mod.top_symbols}} (top: {{mod.top_symbols.map(s => s.name).join(', ')}}){{end}}
      {{end}}

      ### Recommended Pre-Flight Checks
      - Review test coverage for: top modules
      - Pay special attention to: bridge/central symbols touched

      ---

      **Decision Required:** Modify [target]? [A] Approve / [R] Reject
    </action>

    <!-- TEST COVERAGE JUSTIFICATION -->
    <action>Generate the Test Coverage Justification section. For each affected module from the blast radius report, map it to test files that exercise the impacted symbols:</action>
    <action>Discover test files using these strategies:
      - Search conventions: `test/`, `__tests__/`, `*.test.*`, `*.spec.*` patterns
      - Search/grep for the affected symbol names in test files
      - Look for test references in story Dev Notes or architecture docs
    </action>
    <action>Assign a coverage status per module:
      - `Yes` — all affected symbols are covered by existing tests
      - `Partial:N` — N of the affected symbols are covered by tests
      - `None` — no test coverage found for any affected symbol
    </action>
    <action>Append the completed Test Coverage Justification to the Blast Radius Confidence Report before presenting to the user:</action>
    <action>The justification must use this format:

      ### Test Coverage Justification

      | Module | Affected Symbols | Test Files | Coverage |
      |--------|-----------------|------------|----------|
      | `path/to/module` | N symbols | `test/module.test.ts` | Yes |
      | `path/to/other` | M symbols | — | **None** (no coverage found) |

      **Coverage Summary:**
      - **Covered:** X/Y modules (Z affected symbols)
      - **Uncovered:** A/Y modules (B affected symbols — needs tests)
      - **Partial:** C/Y modules (D/N symbols covered)

      **Justification Notes:**
      - `module-A`: Covered by existing tests in `test/module-a.test.ts`
      - `module-B`: No test coverage found — requires new test file
      - `module-C`: Partial coverage — `test/module-c.test.ts` covers 3 of 5 impacted functions
    </action>
    <action>Enforce the combined token budget: the blast radius report + test coverage justification together must not exceed 2000 tokens. If the combined output exceeds this limit, prioritize: (1) uncovered modules, (2) high-risk modules, (3) covered modules. Keep the table concise (one line per module).</action>
    <action>If the blast radius report has zero affected modules (empty result from `memtrace-adapter.mjs --query get_impact`), skip the Test Coverage Justification and append a note: "No affected modules to map — blast radius is empty."</action>
    <action>Ask the user for their coverage threshold: "Review threshold: block if N% of modules are uncovered? (0 = never block, 100 = block if any uncovered)":</action>
    <check if="user provides a percentage threshold">
      <action>Store the threshold. During the code-review phase, the Acceptance Auditor will block changes exceeding this threshold.</action>
    </check>
    <check if="user declines to set a threshold">
      <action>Default to flag-only mode — uncovered nodes are flagged but never block based on coverage % alone.</action>
    </check>
    <action>Write the full Test Coverage Justification into the story file's Dev Agent Record → Completion Notes section before proceeding to the Approve/Reject prompt. This persists the justification for the code-review Acceptance Auditor to reference later.</action>

    <!-- MATHEMATICAL QUALITY GATE (Phase 2) -->
    <critical>The qa-memtrace.mjs mathematical gate is the FINAL authority. Its exit code is non-negotiable — exit 1 means HARD BLOCK on implementation.</critical>

    <check if="blast radius has zero affected modules (empty result from get_impact)">
      <action>Skip the mathematical gate — no blast radius to intersect. Append note to report: "Mathematical Quality Gate: SKIPPED (empty blast radius)."</action>
      <goto anchor="quality_gate_done" />
    </check>

    <action>Serialize the blast radius data (from the get_impact output already collected above) to a temporary JSON file. Use the system temp directory.</action>
    <action>Serialize the test coverage data (from the justification just generated) to a temporary JSON file. Use the same format expected by qa-memtrace.mjs: modules with module path, symbols_covered, coverage status.</action>
    <action>Determine the coverage threshold: use the user-provided percentage if one was given, otherwise default to 100.</action>
    <action>Execute: `node _bmad/scripts/memtrace/qa-memtrace.mjs --blast-radius <temp-blast-file> --test-coverage <temp-coverage-file> --threshold <N>`</action>
    <action>Read the script's STDOUT (JSON output) and capture the exit code.</action>

    <check if="script exits with code 0 (passed == true)">
      <action>Log the script output to the story file's Dev Agent Record → Completion Notes as "Mathematical Quality Gate Output".</action>
      <action>Append to the report: "Mathematical Quality Gate: PASSED (X/Y nodes covered, N% ≥ threshold M%)."</action>
      <output>✅ Mathematical Quality Gate passed. Coverage meets threshold. Proceeding to approval.</output>
    </check>

    <check if="script exits with code 1 (passed == false)">
      <action>Persist the script's output JSON to the story file's Dev Agent Record under "Mathematical Quality Gate Output".</action>
      <action>Extract uncovered_details from the script output.</action>
      <output>❌ **Mathematical Quality Gate FAILED**

        Coverage: N% (threshold: M%) — required nodes are not covered by tests.

        **Uncovered nodes (must write tests before proceeding):**
        {{for each uncovered node in script output}}
        - `symbol` in `file` (depth D)
      </output>
      <action>HALT: "Mathematical quality gate failed. The qa-memtrace.mjs script determined that N of M required nodes are not covered by tests. The agent MUST write or update test files for the listed uncovered nodes before proceeding to implementation. Do NOT proceed until the quality gate passes."</action>
    </check>

    <anchor id="quality_gate_done" />

    <!-- DEAD CODE PITFALL VALIDATION -->
    <critical>If the story involves dead-code removal, validate candidates against pitfalls-catalog.json before proceeding.</critical>

    <check if="story involves dead-code removal (look for find_dead_code usage in story context or tasks)">
      <action>For each target module, call the memtrace-adapter: `node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <module_path> --query find_dead_code [--repo <repo_id>]`. Process sequentially using `for...of` with `await`. Parse the adapter's STDOUT JSON for the `symbols` array.</action>
      <check if="symbols array is empty (total_count === 0)">
        <output>✅ No dead-code candidates found in target module. Pitfall validation skipped.</output>
        <goto anchor="dead_code_done" />
      </check>
      <action>Serialize the dead-code candidates to a temporary JSON file in the system temp directory.</action>
      <action>Execute: `node _bmad/scripts/memtrace/validate-dead-code.mjs --candidates <temp-file>`</action>
      <action>Read the script's STDOUT (JSON output) and capture the exit code.</action>

      <check if="script exits with code 0 (classification completed)">
        <action>Log the script output to the story file's Dev Agent Record → Completion Notes as "Dead Code Pitfall Validation Report".</action>
        <action>Append to the report:
          "Dead Code Pitfall Validation: PASSED
          - SUSPECT (truly dead): N entries — review required
          - FALSE_POS (matched catalog): N entries — ignored
          - GHOST (file deleted): N entries — ignored"
        </action>
        <check if="script output has suspects.length > 0">
          <action>Present the SUSPECT list for manual review before the Approve/Reject prompt:
            "**SUSPECT Entries (truly dead code — review before removal):**
            {{for each suspect in script output.suspects}}
            - `{{suspect.name}}` in `{{suspect.file}}` (line {{suspect.line}})"
          </action>
        </check>

        <action>Also render the "Ignored" section with FALSE_POS and GHOST entries with their reasons (AC #4):
          "**Ignored (safe to skip):**
          {{if script output has false_positives}}
          **FALSE_POS (matched pitfalls catalog):**
          {{for each fp in script output.false_positives}}
          - `{{fp.name}}` — {{fp.reason}} (pitfall: {{fp.pitfall_id}})
          {{end}}
          {{end}}
          {{if script output has ghosts}}
          **GHOST (source file deleted):**
          {{for each ghost in script output.ghosts}}
          - `{{ghost.name}}` — {{ghost.reason}}
          {{end}}
          {{end}}"
        </action>

        <check if="script output has suspects.length == 0">
          <output>✅ No SUSPECT dead-code entries found. All candidates are FALSE_POS (safe) or GHOST (already deleted).</output>
        </check>
      </check>

      <check if="script exits with code 1 (error or timeout)">
        <action>Log the error to the story file's Dev Agent Record → Completion Notes as "Dead Code Pitfall Validation Error".</action>
        <action>Append to the report: "Dead Code Pitfall Validation: ERROR — classification failed ({{error}}). Proceeding without pitfall validation."</action>
        <output>⚠️ Dead Code Pitfall Validation encountered an error. Proceeding without pitfall validation. See story file for details.</output>
      </check>

      <action>Clean up temporary JSON files.</action>
    </check>

    <anchor id="dead_code_done" />

    <check if="story does NOT involve dead-code removal">
      <action>Skip this substep entirely.</action>
    </check>

    <!-- HALT for user decision -->
    <ask>Decision: Proceed with modification? [A] Approve — proceed to implementation | [R] Reject — halt execution</ask>

    <check if="user approves">
      <output>Blast radius verified. Proceeding with implementation...</output>
      <goto step="6">Proceed to implementation</goto>
    </check>

    <check if="user rejects">
      <action>HALT: "Blast radius verification rejected. Execution halted. Please provide guidance on how to proceed."</action>
    </check>

    <check if="user provides other input">
      <output>Invalid choice. Please enter [A] to approve or [R] to reject.</output>
      <goto step="5">Re-prompt for decision</goto>
    </check>
  </step>

  <step n="6" goal="Implement task following red-green-refactor cycle">
    <critical>FOLLOW THE STORY FILE TASKS/SUBTASKS SEQUENCE EXACTLY AS WRITTEN - NO DEVIATION</critical>

    <action>Review the current task/subtask from the story file - this is your authoritative implementation guide</action>
    <action>Plan implementation following red-green-refactor cycle</action>

    <!-- RED PHASE -->
    <action>Write FAILING tests first for the task/subtask functionality</action>
    <action>Confirm tests fail before implementation - this validates test correctness</action>

    <!-- GREEN PHASE -->
    <action>Implement MINIMAL code to make tests pass</action>
    <action>Run tests to confirm they now pass</action>
    <action>Handle error conditions and edge cases as specified in task/subtask</action>

    <!-- REFACTOR PHASE -->
    <action>Improve code structure while keeping tests green</action>
    <action>Ensure code follows architecture patterns and coding standards from Dev Notes</action>

    <action>Document technical approach and decisions in Dev Agent Record → Implementation Plan</action>

    <action if="new dependencies required beyond story specifications">HALT: "Additional dependencies need user approval"</action>
    <action if="3 consecutive implementation failures occur">HALT and request guidance</action>
    <action if="required configuration is missing">HALT: "Cannot proceed without necessary configuration files"</action>

    <critical>NEVER implement anything not mapped to a specific task/subtask in the story file</critical>
    <critical>NEVER proceed to next task until current task/subtask is complete AND tests pass</critical>
    <critical>Execute continuously without pausing until all tasks/subtasks are complete or explicit HALT condition</critical>
    <critical>Do NOT propose to pause for review until Step 9 completion gates are satisfied</critical>
  </step>

  <step n="7" goal="Author comprehensive tests">
    <action>Create unit tests for business logic and core functionality introduced/changed by the task</action>
    <action>Add integration tests for component interactions specified in story requirements</action>
    <action>Include end-to-end tests for critical user flows when story requirements demand them</action>
    <action>Cover edge cases and error handling scenarios identified in story Dev Notes</action>
  </step>

  <step n="8" goal="Run validations and tests">
    <action>Determine how to run tests for this repo (infer test framework from project structure)</action>
    <action>Run all existing tests to ensure no regressions</action>
    <action>Run the new tests to verify implementation correctness</action>
    <action>Run linting and code quality checks if configured in project</action>
    <action>Validate implementation meets ALL story acceptance criteria; enforce quantitative thresholds explicitly</action>
    <action if="regression tests fail">STOP and fix before continuing - identify breaking changes immediately</action>
    <action if="new tests fail">STOP and fix before continuing - ensure implementation correctness</action>
  </step>

  <step n="9" goal="Validate and mark task complete ONLY when fully done">
    <critical>NEVER mark a task complete unless ALL conditions are met - NO LYING OR CHEATING</critical>

    <!-- VALIDATION GATES -->
    <action>Verify ALL tests for this task/subtask ACTUALLY EXIST and PASS 100%</action>
    <action>Confirm implementation matches EXACTLY what the task/subtask specifies - no extra features</action>
    <action>Validate that ALL acceptance criteria related to this task are satisfied</action>
    <action>Run full test suite to ensure NO regressions introduced</action>

    <!-- REVIEW FOLLOW-UP HANDLING -->
    <check if="task is review follow-up (has [AI-Review] prefix)">
      <action>Extract review item details (severity, description, related AC/file)</action>
      <action>Add to resolution tracking list: {{resolved_review_items}}</action>

      <!-- Mark task in Review Follow-ups section -->
      <action>Mark task checkbox [x] in "Tasks/Subtasks → Review Follow-ups (AI)" section</action>

      <!-- CRITICAL: Also mark corresponding action item in review section -->
      <action>Find matching action item in "Senior Developer Review (AI) → Action Items" section by matching description</action>
      <action>Mark that action item checkbox [x] as resolved</action>

      <action>Add to Dev Agent Record → Completion Notes: "✅ Resolved review finding [{{severity}}]: {{description}}"</action>
    </check>

    <!-- ONLY MARK COMPLETE IF ALL VALIDATION PASS -->
    <check if="ALL validation gates pass AND tests ACTUALLY exist and pass">
      <action>ONLY THEN mark the task (and subtasks) checkbox with [x]</action>
      <action>Update File List section with ALL new, modified, or deleted files (paths relative to repo root)</action>
      <action>Add completion notes to Dev Agent Record summarizing what was ACTUALLY implemented and tested</action>
    </check>

    <check if="ANY validation fails">
      <action>DO NOT mark task complete - fix issues first</action>
      <action>HALT if unable to fix validation failures</action>
    </check>

    <check if="review_continuation == true and {{resolved_review_items}} is not empty">
      <action>Count total resolved review items in this session</action>
      <action>Add Change Log entry: "Addressed code review findings - {{resolved_count}} items resolved (Date: {{date}})"</action>
    </check>

    <action>Save the story file</action>
    <action>Determine if more incomplete tasks remain</action>
    <action if="more tasks remain">
      <goto step="6">Next task</goto>
    </action>
    <action if="no tasks remain">
      <goto step="10">Completion</goto>
    </action>
  </step>

  <step n="10" goal="Story completion and mark for review" tag="sprint-status">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute enhanced definition-of-done validation</action>
    <action>Update the story Status to: "review"</action>

    <!-- Enhanced Definition of Done Validation -->
    <action>Validate definition-of-done checklist with essential requirements:
      - All tasks/subtasks marked complete with [x]
      - Implementation satisfies every Acceptance Criterion
      - Unit tests for core functionality added/updated
      - Integration tests for component interactions added when required
      - End-to-end tests for critical flows added when story demands them
      - All tests pass (no regressions, new tests successful)
      - Code quality checks pass (linting, static analysis if configured)
      - File List includes every new/modified/deleted file (relative paths)
      - Dev Agent Record contains implementation notes
      - Change Log includes summary of changes
      - Only permitted story sections were modified
    </action>

    <!-- Mark story ready for review - sprint status conditional -->
    <check if="{sprint_status} file exists AND {{current_sprint_status}} != 'no-sprint-tracking'">
      <action>Load the FULL file: {sprint_status}</action>
      <action>Find development_status key matching {{story_key}}</action>
      <action>Verify current status is "in-progress" (expected previous state)</action>
      <action>Update development_status[{{story_key}}] = "review"</action>
      <action>Update last_updated field to current date</action>
      <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>
      <output>✅ Story status updated to "review" in sprint-status.yaml</output>
    </check>

    <check if="{sprint_status} file does NOT exist OR {{current_sprint_status}} == 'no-sprint-tracking'">
      <output>ℹ️ Story status updated to "review" in story file (no sprint tracking configured)</output>
    </check>

    <check if="story key not found in sprint status">
      <output>⚠️ Story file updated, but sprint-status update failed: {{story_key}} not found

        Story status is set to "review" in file, but sprint-status.yaml may be out of sync.
      </output>
    </check>

    <!-- Final validation gates -->
    <action if="any task is incomplete">HALT - Complete remaining tasks before marking ready for review</action>
    <action if="regression failures exist">HALT - Fix regression issues before completing</action>
    <action if="File List is incomplete">HALT - Update File List with all changed files</action>
    <action if="definition-of-done validation fails">HALT - Address DoD failures before completing</action>
  </step>

  <step n="11" goal="Completion communication and user support">
    <action>Execute the enhanced definition-of-done checklist using the validation framework</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes</action>

    <action>Communicate to {user_name} that story implementation is complete and ready for review</action>
    <action>Summarize key accomplishments: story ID, story key, title, key changes made, tests added, files modified</action>
    <action>Provide the story file path and current status (now "review")</action>

    <action>Based on {user_skill_level}, ask if user needs any explanations about:
      - What was implemented and how it works
      - Why certain technical decisions were made
      - How to test or verify the changes
      - Any patterns, libraries, or approaches used
      - Anything else they'd like clarified
    </action>

    <check if="user asks for explanations">
      <action>Provide clear, contextual explanations tailored to {user_skill_level}</action>
      <action>Use examples and references to specific code when helpful</action>
    </check>

    <action>Once explanations are complete (or user indicates no questions), suggest logical next steps</action>
    <action>Recommended next steps (flexible based on project setup):
      - Review the implemented story and test the changes
      - Verify all acceptance criteria are met
      - Ensure deployment readiness if applicable
      - Run `code-review` workflow for peer review
      - Optional: If Test Architect module installed, run `/bmad:tea:automate` to expand guardrail tests
    </action>

    <output>💡 **Tip:** For best results, run `code-review` using a **different** LLM than the one that implemented this story.</output>
    <check if="{sprint_status} file exists">
      <action>Suggest checking {sprint_status} to see project progress</action>
    </check>
    <action>Remain flexible - allow user to choose their own path or ask for other assistance</action>
  <action>Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete` — if the resolved value is non-empty, follow it as the final terminal instruction before exiting.</action>
  </step>

</workflow>
