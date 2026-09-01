# Skill Validator — Inference-Based

An LLM-readable validation prompt for skills following the [Agent Skills specification](https://agentskills.io/specification).

## First Pass — Deterministic Checks

Before running inference-based validation, run the deterministic validator:

```bash
uv run --python 3.11 tools/validate_skills.py --json path/to/skill-dir
```

This checks 10 rules deterministically: SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06, SKILL-07, PATH-02, SEQ-02, TPL-01.

Review its JSON output. Skip any rule that produced zero findings — it is already verified. A rule that produced findings still gets reviewed (SKILL-06's what-and-when check benefits from judgment). The 10 rules that need judgment are PATH-01, PATH-03, PATH-04, PATH-05, STEP-04, STEP-05, SEQ-01, REF-01, REF-02, REF-03.

## How to Use

1. You are given a **skill directory path** to validate.
2. Run the deterministic first pass (see above) and note which rules passed.
3. Read every file in the skill directory recursively.
4. Apply every remaining rule in the catalog below to every applicable file.
5. Produce a findings report using the report template at the end, including any deterministic findings from the first pass.

If no findings are generated (from either pass), the skill passes validation.

---

## Definitions

- **Skill directory**: the folder containing `SKILL.md` and all supporting files.
- **Internal reference**: a file path from one file in the skill to another file in the same skill.
- **External reference**: a file path from a skill file to a file outside the skill directory.
- **Originating file**: the file that contains the reference (path resolution is relative to this file's location).
- **Config value**: a key declared with a `prompt:` in `src/core-skills/module.yaml` or `src/bmm-skills/module.yaml`. The installer writes these to `{project-root}/_bmad/config.toml` (team scope) and `config.user.toml` (user scope); `_bmad/custom/` may override either. Examples: `project_name`, `output_folder`, `communication_language`, `planning_artifacts`, `project_knowledge`.
- **Customization value**: a key from the skill's own `customize.toml`, in its `[workflow]` table (most skills) or `[agent]` table (agent skills), layered with `_bmad/custom/<skill-name>.toml` and `.user.toml`.
- **Runtime variable**: a name-value pair whose value is set during workflow execution (e.g., `spec_file`, `date`, `status`).
- **Intra-skill path variable**: a variable whose value is a path to another file within the same skill — this is an anti-pattern.
- **Rendered skill**: a skill whose `SKILL.md` invokes `render_skill.py`, which renders the skill's Markdown files (entry point `workflow.md`; `SKILL.md` excluded) into an immutable snapshot before execution. Only rendered skills may use compile-time tokens. Every other skill interpolates customization values itself at runtime.

---

## Skill Layouts

Three layouts coexist. None is preferred, and the validator does not enforce a choice between them:

- **Single-file** — all instructions inline in `SKILL.md`, with optional supporting files (`references/`, `templates/`, `checklist.md`). The common case.
- **Flat step files** — `step-NN-name.md` beside `SKILL.md` at the skill root.
- **`steps/` subdirectory** — `steps/step-NN-name.md`.

Path resolution differs between the last two; see PATH-01.

---

## Token Forms

| Form                             | Resolved by                                                                                | Valid where                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `{name}`                         | the agent, at runtime                                                                      | anywhere                                                |
| `{project-root}`, `{skill-root}` | the agent, at runtime — the project working directory and the skill's own directory        | anywhere                                                |
| `{workflow.key}`                 | `render_skill.py` at render time, or the agent from `resolve_customization.py` JSON output | any skill with a `[workflow]` table in `customize.toml` |
| `{agent.key}`                    | the agent, from `resolve_customization.py` JSON output                                     | agent skills                                            |
| `{{.key}}`                       | `render_skill.py`, at render time                                                          | rendered skills only                                    |
| `{{config.key}}`                 | `render_skill.py`, at render time                                                          | rendered skills only                                    |
| `{{name}}` (no leading dot)      | nothing — survives verbatim into the generated artifact                                    | templates and the artifacts they seed                   |
| `[[bmad-snapshot:file.md]]`      | `render_skill.py`, at render time                                                          | rendered skills only                                    |

The distinction between `{{name}}` and `{{.name}}` matters: the first is an artifact placeholder the consumer of the generated document fills in later; the second is a substitution baked in at render time. See REF-01 and TPL-01.

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
- **Rule:** The `name` value must be `bmad` or start with `bmad-`, using only lowercase letters, numbers, and single hyphens between segments.
- **Detection:** Regex test: `^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$`.
- **Fix:** Rename to comply with the format (e.g., `bmad-my-skill`).

### SKILL-05 — `name` Must Match Directory Name

- **Severity:** HIGH
- **Applies to:** `SKILL.md`
- **Rule:** The `name` value in SKILL.md frontmatter must exactly match the skill directory name. The directory name is the canonical identifier used by installers, manifests, and skill references throughout the project.
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
- **Rule:** SKILL.md must have non-empty markdown body content after the frontmatter. A SKILL.md with only frontmatter is incomplete.
- **Detection:** Extract content after the closing `---` frontmatter delimiter and check it is non-empty after trimming whitespace.
- **Fix:** Add markdown body with skill instructions after the closing `---`.

---

### PATH-01 — Internal References Must Be Relative From Originating File

- **Severity:** CRITICAL
- **Applies to:** all files in the skill
- **Rule:** Any reference from one file in the skill to another file in the same skill must be a relative path resolved from the directory of the originating file. Use `./` prefix for siblings or children, `../` for parent traversal. Bare relative filenames in markdown links (e.g., `[text](sibling.md)`) are also acceptable.
- **Detection:** Scan for file path references (in markdown links, frontmatter values, inline backtick paths, and prose instructions like "Read fully and follow"). Verify each internal reference uses relative notation (`./`, `../`, or bare filename). Always resolve the path from the originating file's directory — a reference to `./steps/step-02-review.md` from a file already inside `steps/` would resolve to `steps/steps/step-02-review.md`, which is wrong.
- **Examples:**
  - CORRECT: `./steps/step-01-gather-context.md` (from a skill-root file into a `steps/` subdirectory)
  - CORRECT: `./step-02-plan.md` (sibling, in the flat step layout or from inside `steps/`)
  - CORRECT: `./template.md` (from SKILL.md to a sibling)
  - CORRECT: `../spec-template.md` (from `steps/step-01.md` to a skill-root file)
  - CORRECT: `workflow.md` (bare relative filename for sibling)
  - WRONG: `./steps/step-02-review.md` (from a file already inside `steps/` — resolves to `steps/steps/`)
  - WRONG: `{project-root}/.claude/skills/my-skill/template.md`
  - WRONG: `/Users/someone/.claude/skills/my-skill/steps/step-01.md`
  - WRONG: `~/.claude/skills/my-skill/file.md`

### PATH-02 — No `installed_path` Variable

- **Severity:** HIGH
- **Applies to:** all files in the skill
- **Rule:** The `installed_path` variable is a leftover from pre-skill workflows. It must not be defined in any frontmatter, and `{installed_path}` must not appear anywhere in any file.
- **Detection:** Search all files for:
  - Frontmatter key `installed_path:`
  - String `{installed_path}` anywhere in content
  - Markdown/prose assigning `installed_path` (e.g., `` `installed_path` = `.` ``)
- **Fix:** Remove all `installed_path` definitions. Replace every `{installed_path}/path` with `./path` (relative from the file that contains the reference). If the reference is in a step file and points to a skill-root file, use `../path` instead.

### PATH-03 — External References Must Use `{project-root}` or Config Values

- **Severity:** HIGH
- **Applies to:** all files in the skill
- **Rule:** References to files outside the skill directory must use `{project-root}/...` or a config-derived path (e.g., `{planning_artifacts}/...`, `{implementation_artifacts}/...`, `{project_knowledge}/...`).
- **Detection:** Identify file references that point outside the skill. Verify they start with `{project-root}` or a known config key. Flag absolute paths, home-relative paths (`~/`), or bare paths that resolve outside the skill.
- **Fix:** Replace with `{project-root}/...` or the appropriate config value.

### PATH-04 — No Intra-Skill Path Variables

- **Severity:** MEDIUM
- **Applies to:** all files (frontmatter AND body content)
- **Rule:** Variables must not store paths to files within the same skill. These paths should be hardcoded as relative paths inline where used. This applies to YAML frontmatter variables AND markdown body variable assignments (e.g., `` `template` = `./template.md` `` under a `### Paths` section).
- **Detection:** For each variable with a path-like value — whether defined in frontmatter or in body text — determine if the target is inside the skill directory. Indicators: value starts with `./`, `../`, or is a bare filename of a file that exists in the skill. Exclude variables whose values are prefixed with a config key like `{planning_artifacts}`, `{implementation_artifacts}`, or `{project-root}` — these are external references and are legitimate.
- **Fix:** Remove the variable. Replace each `{variable_name}` usage with the direct relative path.
- **Exception:** If a path variable is used in 4+ locations across multiple files and the path is non-trivial, a variable MAY be acceptable. Flag it as LOW instead and note the exception.

### PATH-05 — No File Path References Into Another Skill

- **Severity:** HIGH
- **Applies to:** all files in the skill
- **Rule:** A skill must never reference a file inside another skill's directory by path. A skill's files are private to it, and a path into another skill breaks when that skill is moved or reorganized.
- **Detection:** For each external file reference (frontmatter values, markdown links, inline paths), check whether the resolved path points into a directory that is or contains a skill (has a `SKILL.md`). Patterns to flag:
  - `{project-root}/_bmad/.../other-skill/anything.md`
  - `{project-root}/_bmad/.../other-skill/steps/...`
  - `{project-root}/_bmad/.../other-skill/templates/...`
  - References to pre-conversion locations that were skill directories, where the skill has since moved
- **Fix:**
  - If the intent is to invoke the other skill: use invoke language in prose — ``Invoke the `skill-name` skill`` (see REF-03).
  - If the intent is to use a shared resource (template, data file): extract it to a location outside both skills — a config-referenced path such as `{project_knowledge}/...`, or a `file:`-prefixed entry in `customize.toml` — rather than reaching across a skill boundary.

---

### STEP-04 — Halt Before Menu

- **Severity:** HIGH
- **Applies to:** step files and any file presenting a menu
- **Rule:** Any step that presents a user menu (e.g., `[C] Continue`, `[A] Approve`, `[S] Split`) must explicitly HALT and wait for user response before proceeding.
- **Detection:** Find menu patterns (bracketed letter options). Check that text within the same section (under the same heading) includes "HALT", "wait", "stop", "FORBIDDEN to proceed", or equivalent.
- **Fix:** Add an explicit HALT instruction before or after the menu.

### STEP-05 — No Forward Loading

- **Severity:** HIGH
- **Applies to:** step files
- **Rule:** A step must not load or read future step files until the current step is complete. Load each step when it is reached.
- **Detection:** Look for instructions to read multiple step files simultaneously, or unconditional references to step files with higher numbers than the current step. Exempt locations: `## NEXT` sections, navigation/dispatch sections that list valid resumption targets, and conditional routing branches.
- **Fix:** Remove premature step loading. Ensure only the current step is active.

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

### TPL-01 — Template Files Must Not Contain Compile-Time Substitutions

- **Severity:** HIGH
- **Applies to:** `.md` files whose name contains `template` (case-insensitive)
- **Rule:** Template files become artifacts (for example spec files) that are committed and used on other machines. `render_skill.py` would replace a `{{.var}}` with a value from the rendering machine's config, and every artifact produced from the template would carry it.
- **Detection:** Regex `\{\{\.\w+\}\}` match anywhere in a file whose basename matches `/template/i`.
- **Fix:** Remove the `{{.var}}` reference. Use single-curly `{var}` if the value should be resolved at runtime by the consumer of the generated artifact, or plain double-curly `{{var}}` if it is a placeholder the consumer fills in.

---

### REF-01 — Variable References Must Resolve

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** Every token must resolve to a defined source, per the Token Forms table above:
  - `{name}` — a frontmatter variable in the same file, a config key, a runtime variable set during execution, or the path anchors `{project-root}` and `{skill-root}`.
  - `{workflow.key}` — must name a key in the `[workflow]` table of the skill's own `customize.toml`.
  - `{agent.key}` — must name a key in the `[agent]` table of the skill's own `customize.toml`.
  - `{{.key}}`, `{{config.key}}`, `[[bmad-snapshot:file.md]]` — only in a rendered skill (one whose SKILL.md invokes `render_skill.py`). In any other skill nothing will substitute them and they reach the agent verbatim. A `[[bmad-snapshot:file.md]]` target must name a Markdown file in the skill other than `SKILL.md`, which the renderer excludes from its source set.
- **Detection:** Collect all tokens in the file and classify them by form. Resolve config keys against the `prompt:` keys in `module.yaml`; resolve `{workflow.*}` and `{agent.*}` against the skill's `customize.toml`. Before flagging a compile-time token, grep the skill's `SKILL.md` for `render_skill.py` — if it is a rendered skill, the token is legitimate. Flag any token that cannot be traced to a source.
- **Exceptions:**
  - Plain double-curly `{{name}}` with **no** leading dot — an artifact placeholder that survives rendering into the generated document, to be filled in by whoever consumes it (e.g. `{{story_key}}` in a story template). Do not flag these. Dotted `{{.key}}` and `{{config.key}}` are **not** covered by this exception; they are compile-time substitutions governed by the rule above and by TPL-01.
  - Variables inside fenced code blocks that are clearly illustrative examples.
- **Fix:** Either define the variable in the appropriate `customize.toml` table or frontmatter, or replace the reference with a literal value. If a config key was misspelled, correct the spelling.

### REF-02 — File References Must Resolve

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** All file path references within the skill (markdown links, backtick paths, frontmatter values) should point to files that plausibly exist.
- **Detection:** For internal references, verify the target file exists in the skill directory. For external references using config keys, verify the path structure is plausible (you cannot resolve config keys, but you can check that the path after the key looks reasonable — e.g., `{planning_artifacts}/*.md` is plausible, `{planning_artifacts}/../../etc/passwd` is not).
- **Fix:** Correct the path or remove the dead reference.

### REF-03 — Skill Invocation Must Use "Invoke" Language

- **Severity:** HIGH
- **Applies to:** all files
- **Rule:** When a skill references another skill by name in prose, the surrounding instruction must use the word "invoke". The canonical form is ``Invoke the `skill-name` skill``. Phrases like "Read fully and follow", "Execute", "Run", "Load", "Open", or "Follow" are invalid — they imply file-level operations on a document, not skill invocation.
- **Detection:** Find all references to other skills by name (typically backtick-quoted skill names like `bmad-foo`). Check the surrounding instruction text (same sentence or directive) for file-oriented verbs: "read", "follow", "load", "execute", "run", "open". Flag any that do not use "invoke" (or a close synonym like "activate" or "launch").
- **Fix:** Replace the instruction with ``Invoke the `skill-name` skill``. Remove any "read fully and follow" or similar file-oriented phrasing. Do NOT add a `skill:` prefix in prose — use natural language.
- **Exception:** `skill:skill-name` is the correct form inside `customize.toml` values (for example a `persistent_facts` entry, or a directive such as `skill:bmad-review lenses=<code>`), where the string is data consumed by a resolver rather than an instruction to the agent. Do not flag it there.

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

If zero findings: report "All 20 rules passed. No findings." and list all passed rule IDs.
