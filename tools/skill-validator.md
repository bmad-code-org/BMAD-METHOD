# Skill Validator — Inference-Based

An LLM-readable validation prompt for skills following the Agent Skills open standard.

## First Pass — Deterministic Checks

Before running inference-based validation, run the deterministic validator:

```bash
node tools/validate-skills.js --json path/to/skill-dir
```

This checks 14 rules deterministically: SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06, SKILL-07, WF-01, WF-02, PATH-02, STEP-01, STEP-06, STEP-07, SEQ-02.

Review its JSON output. For any rule that produced **zero findings** in the first pass, **skip it** during inference-based validation below — it has already been verified. If a rule produced any findings, the inference validator should still review that rule (some rules like SKILL-04 and SKILL-06 have sub-checks that benefit from judgment). Focus your inference effort on the remaining rules that require judgment (PATH-01, PATH-03, PATH-04, PATH-05, WF-03, STEP-02, STEP-03, STEP-04, STEP-05, SEQ-01, REF-01, REF-02, REF-03).

## How to Use

1. You are given a **skill directory path** to validate.
2. Run the deterministic first pass (see above) and note which rules passed.
3. Read every file in the skill directory recursively.
4. Apply every rule in the catalog below to every applicable file, **skipping rules that passed the deterministic first pass**.
5. Produce a findings report using the report template at the end, including any deterministic findings from the first pass.

If no findings are generated (from either pass), the skill passes validation.

---

## Definitions

- **Skill directory**: the folder containing `SKILL.md` and all supporting files.
- **Internal reference**: a file path from one file in the skill to another file in the same skill.
- **External reference**: a file path from a skill file to a file outside the skill directory.
- **Originating file**: the file that contains the reference (path resolution is relative to this file's location).
- **Config variable**: a name-value pair whose value comes from the project config file (e.g., `planning_artifacts`, `implementation_artifacts`, `communication_language`).
- **Runtime variable**: a name-value pair whose value is set during workflow execution (e.g., `spec_file`, `date`, `status`).
- **Intra-skill path variable**: a frontmatter variable whose value is a path to another file within the same skill — this is an anti-pattern.

---

## Rule Catalog

### SKILL-01 — SKILL.md Must Exist

- **Severity:** CRITICAL
- **Applies to:** skill directory
- **Rule:** The skill directory must contain a file named `SKILL.md` (exact case).
- **Detection:** Check for the file's existence.
- **Fix:** Create `SKILL.md` as the skill entrypoint.

### SKILL-02 — SKILL.md Must Have `name` in Frontmatter

- **Severity:** CRITICAL
- **Applies to:** `SKILL.md`
- **Rule:** The YAML frontmatter must contain a `name` field.
- **Detection:** Parse the `---` delimited frontmatter block and check for `name:`.
- **Fix:** Add `name: <skill-name>` to the frontmatter.

### SKILL-03 — SKILL.md Must Have `description` in Frontmatter

- **Severity:** CRITICAL
- **Applies to:** `SKILL.md`
- **Rule:** The YAML frontmatter must contain a `description` field.
- **Detection:** Parse the `---` delimited frontmatter block and check for `description:`.
- **Fix:** Add `description: '<what it does and when to use it>'` to the frontmatter.

### SKILL-04 — `name` Format

- **Severity:** HIGH
- **Applies to:** `SKILL.md`
- **Rule:** The `name` value must start with `bmad-`, use only lowercase letters, numbers, and single hyphens between segments.
- **Detection:** Regex test: `^bmad-[a-z0-9]+(-[a-z0-9]+)*$`.
- **Fix:** Rename to comply with the format (e.g., `bmad-my-skill`).

### SKILL-05 — `name` Must Match Directory Name

- **Severity:** HIGH
- **Applies to:** `SKILL.md`
- **Rule:** The `name` value in SKILL.md frontmatter must exactly match the skill directory name. The directory name is the canonical identifier used by installers, manifests, and `skill:` references throughout the project.
- **Detection:** Compare the `name:` frontmatter value against the basename of the skill directory (i.e., the immediate parent directory of `SKILL.md`).
- **Fix:** Change the `name:` value to match the directory name, or rename the directory to match — prefer changing `name:` unless other references depend on the current value.

### SKILL-06 — `description` Quality

- **Severity:** MEDIUM
- **Applies to:** `SKILL.md`
- **Rule:** The `description` must state both what the skill does AND when to use it. Max 1024 characters.
- **Detection:** Check length. Look for trigger phrases like "Use when" or "Use if" — their absence suggests the description only says _what_ but not _when_.
- **Fix:** Append a "Use when..." clause to the description.

### SKILL-07 — SKILL.md Must Have Body Content

- **Severity:** HIGH
- **Applies to:** `SKILL.md`
- **Rule:** SKILL.md must have non-empty markdown body content after the frontmatter. The body provides L2 instructions — a SKILL.md with only frontmatter is incomplete.
- **Detection:** Extract content after the closing `---` frontmatter delimiter and check it is non-empty after trimming whitespace.
- **Fix:** Add markdown body with skill instructions after the closing `---`.

---

### WF-01 — Only SKILL.md May Have `name` in Frontmatter

- **Severity:** HIGH
- **Applies to:** all `.md` files except `SKILL.md`
- **Rule:** The `name` field belongs only in `SKILL.md`. No other markdown file in the skill directory may have `name:` in its frontmatter.
- **Detection:** Parse frontmatter of every non-SKILL.md markdown file and check for `name:` key.
- **Fix:** Remove the `name:` line from the file's frontmatter.
- **Exception:** `bmad-agent-tech-writer` — has sub-skill files with intentional `name` fields (to be revisited).

### WF-02 — Only SKILL.md May Have `description` in Frontmatter

- **Severity:** HIGH
- **Applies to:** all `.md` files except `SKILL.md`
- **Rule:** The `description` field belongs only in `SKILL.md`. No other markdown file in the skill directory may have `description:` in its frontmatter.
- **Detection:** Parse frontmatter of every non-SKILL.md markdown file and check for `description:` key.
- **Fix:** Remove the `description:` line from the file's frontmatter.
- **Exception:** `bmad-agent-tech-writer` — has sub-skill files with intentional `description` fields (to be revisited).

### WF-03 — workflow.md Frontmatter Variables Must Be Config or Runtime Only

- **Severity:** HIGH
- **Applies to:** `workflow.md` frontmatter
- **Rule:** Every variable defined in workflow.md frontmatter must be either:
  - A config variable (value references `{project-root}` or a config-derived variable like `{planning_artifacts}`)
  - A runtime variable (value is empty, a placeholder, or set during execution)
  - A legitimate external path expression (must not violate PATH-05 — no paths into another skill's directory)

  It must NOT be a path to a file within the skill directory (see PATH-04), nor a path into another skill's directory (see PATH-05).

- **Detection:** For each frontmatter variable, check if its value resolves to a file inside the skill (e.g., starts with `./`, `{installed_path}`, or is a bare relative path to a sibling file). If so, it is an intra-skill path variable. Also check if the value is a path into another skill's directory — if so, it violates PATH-05 and is not a legitimate external path.
- **Fix:** Remove the variable. Use a hardcoded relative path inline where the file is referenced.

---

### PATH-01 — Internal References Must Be Relative From Originating File

- **Severity:** CRITICAL
- **Applies to:** all files in the skill
- **Rule:** Any reference from one file in the skill to another file in the same skill must be a relative path resolved from the directory of the originating file. Use `./` prefix for siblings or children, `../` for parent traversal. Bare relative filenames in markdown links (e.g., `[text](sibling.md)`) are also acceptable.
- **Detection:** Scan for file path references (in markdown links, frontmatter values, inline backtick paths, and prose instructions like "Read fully and follow"). Verify each internal reference uses relative notation (`./`, `../`, or bare filename). Always resolve the path from the originating file's directory — a reference to `./steps/step-01.md` from a file already inside `steps/` would resolve to `steps/steps/step-01.md`, which is wrong.
- **Examples:**
  - CORRECT: `./steps/step-01-init.md` (from workflow.md at skill root to a step)
  - CORRECT: `./template.md` (from workflow.md to a sibling)
  - CORRECT: `../template.md` (from steps/step-01.md to a skill-root file)
  - CORRECT: `workflow.md` (bare relative filename for sibling)
  - CORRECT: `./step-02-plan.md` (from steps/step-01.md to a sibling step)
  - WRONG: `./steps/step-02-plan.md` (from a file already inside steps/ — resolves to steps/steps/)
  - WRONG: `{installed_path}/template.md`
  - WRONG: `{project-root}/.claude/skills/my-skill/template.md`
  - WRONG: `/Users/someone/.claude/skills/my-skill/steps/step-01.md`
  - WRONG: `~/.claude/skills/my-skill/file.md`

### PATH-02 — No `installed_path` Variable

- **Severity:** HIGH
- **Applies to:** all files in the skill
- **Rule:** The `installed_path` variable is an anti-pattern from the pre-skill workflow era. It must not be defined in any frontmatter, and `{installed_path}` must not appear anywhere in any file.
- **Detection:** Search all files for:
  - Frontmatter key `installed_path:`
  - String `{installed_path}` anywhere in content
  - Markdown/prose assigning `installed_path` (e.g., `` `installed_path` = `.` ``)
- **Fix:** Remove all `installed_path` definitions. Replace every `{installed_path}/path` with `./path` (relative from the file that contains the reference). If the reference is in a step file and points to a skill-root file, use `../path` instead.

### PATH-03 — External References Must Use `{project-root}` or Config Variables

- **Severity:** HIGH
- **Applies to:** all files in the skill
- **Rule:** References to files outside the skill directory must use `{project-root}/...` or a config-derived variable path (e.g., `{planning_artifacts}/...`, `{implementation_artifacts}/...`).
- **Detection:** Identify file references that point outside the skill. Verify they start with `{project-root}` or a known config variable. Flag absolute paths, home-relative paths (`~/`), or bare paths that resolve outside the skill.
- **Fix:** Replace with `{project-root}/...` or the appropriate config variable.

### PATH-05 — No File Path References Into Another Skill

- **Severity:** HIGH
- **Applies to:** all files in the skill
- **Rule:** A skill must never reference any file inside another skill's directory by file path. Skill directories are encapsulated — their internal files (steps, templates, checklists, data files, workflow.md) are private implementation details. The only valid way to reference another skill is via `skill:skill-name` syntax, which invokes the skill as a unit. Reaching into another skill to cherry-pick an internal file (e.g., a template, a step, or even its workflow.md) breaks encapsulation and creates fragile coupling that breaks when the target skill is moved or reorganized.
- **Detection:** For each external file reference (frontmatter values, markdown links, inline paths), check whether the resolved path points into a directory that is or contains a skill (has a `SKILL.md`). Patterns to flag:
  - `{project-root}/_bmad/.../other-skill/anything.md`
  - `{project-root}/_bmad/.../other-skill/steps/...`
  - `{project-root}/_bmad/.../other-skill/templates/...`
  - References to old pre-conversion locations that were skill directories (e.g., `core/workflows/skill-name/` when the skill has since moved to `core/skills/skill-name/`)
- **Fix:**
  - If the intent is to invoke the other skill: replace with `skill:skill-name`.
  - If the intent is to use a shared resource (template, data file): the resource should be extracted to a shared location outside both skills (e.g., `core/data/`, `bmm/data/`, or a config-referenced path) — not reached into from across skill boundaries.

### PATH-04 — No Intra-Skill Path Variables

- **Severity:** MEDIUM
- **Applies to:** all files (frontmatter AND body content)
- **Rule:** Variables must not store paths to files within the same skill. These paths should be hardcoded as relative paths inline where used. This applies to YAML frontmatter variables AND markdown body variable assignments (e.g., `` `template` = `./template.md` `` under a `### Paths` section).
- **Detection:** For each variable with a path-like value — whether defined in frontmatter or in body text — determine if the target is inside the skill directory. Indicators: value starts with `./`, `../`, `{installed_path}`, or is a bare filename of a file that exists in the skill. Exclude variables whose values are prefixed with a config variable like `{planning_artifacts}`, `{implementation_artifacts}`, `{project-root}`, or other config-derived paths — these are external references and are legitimate.
- **Fix:** Remove the variable. Replace each `{variable_name}` usage with the direct relative path.
- **Exception:** If a path variable is used in 4+ locations across multiple files and the path is non-trivial, a variable MAY be acceptable. Flag it as LOW instead and note the exception.

---

### STEP-01 — Step File Naming

- **Severity:** MEDIUM
- **Applies to:** files in `steps/` directory
- **Rule:** Step files must be named `step-NN-description.md` where NN is a zero-padded two-digit number. An optional single-letter variant suffix is allowed for branching steps (e.g., `step-01b-continue.md`).
- **Detection:** Regex: `^step-\d{2}[a-z]?-[a-z0-9-]+\.md$`
- **Fix:** Rename to match the pattern.

### STEP-02 — Step Must Have a Goal Section

- **Severity:** HIGH
- **Applies to:** step files
- **Rule:** Each step must clearly state its goal. Look for a heading like `## YOUR TASK`, `## STEP GOAL`, `## INSTRUCTIONS`, `## INITIALIZATION`, `## EXECUTION`, `# Step N:`, or a frontmatter `goal:` field.
- **Detection:** Scan for goal-indicating headings (including `# Step N: Title` as a top-level heading that names the step's purpose) or frontmatter.
- **Fix:** Add a clear goal section.

### STEP-03 — Step Must Reference Next Step

- **Severity:** MEDIUM
- **Applies to:** step files (except the final step)
- **Rule:** Each non-terminal step must contain a reference to the next step file for sequential execution.
- **Detection:** Look for `## NEXT` section or inline reference to a next step file. Remember to resolve the reference from the originating file's directory (PATH-01 applies here too).
- **Fix:** Add a `## NEXT` section with the relative path to the next step.
- **Note:** A terminal step is one that has no next-step reference and either contains completion/finalization language or is the highest-numbered step. If a workflow branches, there may be multiple terminal steps.

### STEP-04 — Halt Before Menu

- **Severity:** HIGH
- **Applies to:** step files
- **Rule:** Any step that presents a user menu (e.g., `[C] Continue`, `[A] Approve`, `[S] Split`) must explicitly HALT and wait for user response before proceeding.
- **Detection:** Find menu patterns (bracketed letter options). Check that text within the same section (under the same heading) includes "HALT", "wait", "stop", "FORBIDDEN to proceed", or equivalent.
- **Fix:** Add an explicit HALT instruction before or after the menu.

### STEP-05 — No Forward Loading

- **Severity:** HIGH
- **Applies to:** step files
- **Rule:** A step must not load or read future step files until the current step is complete. Just-in-time loading only.
- **Detection:** Look for instructions to read multiple step files simultaneously, or unconditional references to step files with higher numbers than the current step. Exempt locations: `## NEXT` sections, navigation/dispatch sections that list valid resumption targets, and conditional routing branches.
- **Fix:** Remove premature step loading. Ensure only the current step is active.

### STEP-06 — Step File Frontmatter: No `name` or `description`

- **Severity:** MEDIUM
- **Applies to:** step files
- **Rule:** Step files should not have `name:` or `description:` in their YAML frontmatter. These are metadata noise — the step's purpose is conveyed by its goal section and filename.
- **Detection:** Parse step file frontmatter for `name:` or `description:` keys.
- **Fix:** Remove `name:` and `description:` from step file frontmatter.

### STEP-07 — Step Count

- **Severity:** LOW
- **Applies to:** workflow as a whole
- **Rule:** A sharded workflow should have between 2 and 10 step files. More than 10 risks LLM context degradation.
- **Detection:** Count files matching `step-*.md` in the `steps/` directory.
- **Fix:** Consider consolidating steps if over 10.

---

### SEQ-01 — No Skip Instructions

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** No file should instruct the agent to skip steps or optimize step order. Sequential execution is mandatory.
- **Detection:** Scan for phrases like "skip to step", "jump to step", "skip ahead", "optimize the order", "you may skip". Exclude negation context (e.g., "do NOT skip steps", "NEVER skip") — these are enforcement instructions, not skip instructions.
- **Exception:** Conditional routing (e.g., "if X, go to step N; otherwise step M") is valid workflow branching, not skipping.

### SEQ-02 — No Time Estimates

- **Severity:** LOW
- **Applies to:** all files
- **Rule:** Workflow files should not include time estimates. AI execution speed varies too much for estimates to be meaningful.
- **Detection:** Scan for patterns like "takes X minutes", "~N min", "estimated time", "ETA".
- **Fix:** Remove time estimates.

---

### REF-01 — Variable References Must Be Defined

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** Every `{variable_name}` reference in any file (body text, frontmatter values, inline instructions) must resolve to a defined source. Valid sources are:
  1. A frontmatter variable in the same file
  2. A frontmatter variable in the skill's `workflow.md` (workflow-level variables are available to all steps)
  3. A known config variable from the project config (e.g., `project-root`, `planning_artifacts`, `implementation_artifacts`, `communication_language`)
  4. A known runtime variable set during execution (e.g., `date`, `status`, `project_name`, user-provided input variables)
- **Detection:** Collect all `{...}` tokens in the file. For each, check whether it is defined in the file's own frontmatter, in `workflow.md` frontmatter, or is a recognized config/runtime variable. Flag any token that cannot be traced to a source. Use the config variable list from the project's `config.yaml` as the reference for recognized config variables. Runtime variables are those explicitly described as user-provided or set during execution in the workflow instructions.
- **Exceptions:**
  - Double-curly `{{variable}}` — these are template placeholders intended to survive into generated output (e.g., `{{project_name}}` in a template file). Do not flag these.
  - Variables inside fenced code blocks that are clearly illustrative examples.
- **Fix:** Either define the variable in the appropriate frontmatter, or replace the reference with a literal value. If the variable is a config variable that was misspelled, correct the spelling.

### REF-02 — File References Must Resolve

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** All file path references within the skill (markdown links, backtick paths, frontmatter values) should point to files that plausibly exist.
- **Detection:** For internal references, verify the target file exists in the skill directory. For external references using config variables, verify the path structure is plausible (you cannot resolve config variables, but you can check that the path after the variable looks reasonable — e.g., `{planning_artifacts}/*.md` is plausible, `{planning_artifacts}/../../etc/passwd` is not).
- **Fix:** Correct the path or remove the dead reference.

### REF-03 — Skill Invocation Must Use "Invoke" Language

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** When a skill references another skill by name, the surrounding instruction must use the word "invoke". The canonical form is `Invoke the \`skill-name\` skill`. Phrases like "Read fully and follow", "Execute", "Run", "Load", "Open", or "Follow" are invalid — they imply file-level operations on a document, not skill invocation. A skill is a unit that is invoked, not a file that is read.
- **Detection:** Find all references to other skills by name (typically backtick-quoted skill names like \`bmad-foo\`). Check the surrounding instruction text (same sentence or directive) for file-oriented verbs: "read", "follow", "load", "execute", "run", "open". Flag any that do not use "invoke" (or a close synonym like "activate" or "launch").
- **Fix:** Replace the instruction with `Invoke the \`skill-name\` skill`. Remove any "read fully and follow" or similar file-oriented phrasing. Do NOT add a `skill:` prefix to the name — use natural language.

---

## Report Template

When reporting findings, use this format:

```markdown
# Skill Validation Report: {skill-name}

**Directory:** {path}
**Date:** {date}
**Files scanned:** {count}

## Summary

| Severity | Count |
| -------- | ----- |
| CRITICAL | N     |
| HIGH     | N     |
| MEDIUM   | N     |
| LOW      | N     |

## Findings

### {RULE-ID} — {Rule Title}

- **Severity:** {severity}
- **File:** `{relative-path-within-skill}`
- **Line:** {line number or range, if identifiable}
- **Detail:** {what was found}
- **Fix:** {specific fix for this instance}

---

(repeat for each finding, grouped by rule ID)

## Passed Rules

(list rule IDs that produced no findings)
```

If zero findings: report "All {N} rules passed. No findings." and list all passed rule IDs.

---

## Skill Spec Cheatsheet

Quick-reference for the Agent Skills open standard.
For the full standard, see: [Agent Skills specification](https://agentskills.io/specification)

### Structure

- Every skill is a directory with `SKILL.md` as the required entrypoint
- YAML frontmatter between `---` markers provides metadata; markdown body provides instructions
- Supporting files (scripts, templates, references) live alongside SKILL.md

### Path resolution

- Relative file references resolve from the directory of the file that contains the reference, not from the skill root
- Example: from `branch-a/deep/next.md`, `./deeper/final.md` resolves to `branch-a/deep/deeper/final.md`
- Example: from `branch-a/deep/next.md`, `./branch-b/alt/leaf.md` incorrectly resolves to `branch-a/deep/branch-b/alt/leaf.md`

### Frontmatter fields (standard)

- `name`: lowercase letters, numbers, hyphens only; max 64 chars; no "anthropic" or "claude"
- `description`: required, max 1024 chars; should state what the skill does AND when to use it

### Progressive disclosure — three loading levels

- **L1 Metadata** (~100 tokens): `name` + `description` loaded at startup into system prompt
- **L2 Instructions** (<5k tokens): SKILL.md body loaded only when skill is triggered
- **L3 Resources** (unlimited): additional files + scripts loaded/executed on demand; script output enters context, script code does not

### Key design principle

- Skills are filesystem-based directories, not API payloads — Claude reads them via bash/file tools
- Keep SKILL.md focused; offload detailed reference to separate files

### Practical tips

- Keep SKILL.md under 500 lines
- `description` drives auto-discovery — use keywords users would naturally say
