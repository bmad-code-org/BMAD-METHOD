# Skill Authoring Bar

Every PR that adds or edits a skill, agent, template, or module `help/` file must meet this bar. This page is the contributor entry point and pre-PR checklist; authoritative rules live in their single sources of truth below and are not restated here.

## Read before editing

- **Always load first:** `skills/toolsmith/bmad-toolsmith/canon.md` (prompt-quality canon and its nine tests) and `skills/toolsmith/bmad-toolsmith/lenses/standards.md` (skill contract: frontmatter, layout, paths, `customize.toml`, `bmod.toml`, help files, scripts).
- **Load on demand:**
  - Deep review rubrics: `skills/toolsmith/bmad-toolsmith/lenses/` (`lens-leanness.md`, `lens-architecture.md`, `lens-determinism.md`, `lens-customization.md`, `lens-trigger.md`).
  - New skill shapes, rendered agents, or `bmad-facilitate` templates: `skills/toolsmith/bmad-toolsmith/shapes/`.
  - Ticket-tree skills: `tools/ticket-tree-rules.md`.
  - Rendered-skill Jinja token syntax (`Token Forms` / `Templates in Rendered Skills`) or looking up a failing `validate_skills.py` rule ID: `tools/skill-validator.md`. Where its older step-file layout or `module.yaml` notes conflict with `canon.md` or `standards.md`, `canon.md` and `standards.md` win.

## Core-vs-module boundary hygiene

`skills/core-tools/` is 100% module-agnostic. Core skills (`bmad`, `bmad-facilitate`, `bmad-review`, `bmad-ingest`, and siblings), their references, scripts, and rubrics carry no `method` concepts — no ticket-tree rules, PRD/epic/initiative workflows, or module-specific agent names.

Domain guidance, document templates, and review rubrics belong in the module that owns them (`skills/method/bmod-method/`, `skills/founder/`, and so on), discovered through `bmod.toml` and module libraries rather than hardcoded in core-tools.

## Trust the model — do not over-explain

State the goal and consumer in 1–2 lines and let a capable LLM choose how to converse, phrase, and adapt. Keep extra prose only for non-inferable contracts: exact script commands, file/frontmatter schemas, hard ordering gates, or a named failure the model hits without it.

Never transcribe ticket or spec rationale into prompt text, and never bolt edge-case clauses onto an existing paragraph — split or rewrite instead. Treat any `long_paragraphs` hit from `prepass.py` as a smell to cut or break up.

## Six-lens pre-PR smell check

Audit every edited prompt file — entry, references, routes, help files, and model-read templates — against these six lenses:

1. **Leanness** (`skills/toolsmith/bmad-toolsmith/lenses/lens-leanness.md`, `skills/toolsmith/bmad-toolsmith/canon.md`): one topic per paragraph, one sentence first, apply the Core Test, explain the *why* instead of ALL-CAPS `MUST`/`NEVER`, and cut worked examples whenever a format line fixes the shape.
2. **Progressive disclosure** (`skills/toolsmith/bmad-toolsmith/lenses/lens-architecture.md`): move branch-only and late-phase procedures into flat `references/` files loaded on demand, one level deep, each standalone enough to survive the entry leaving context.
3. **Contradiction and single-source sweep**: before adding a rule or menu entry, check sibling templates, agent `SKILL.md` / `workflow.md` files, and the module's `help/help.md` so each fact lives once and nothing disagrees.
4. **Determinism** (`skills/toolsmith/bmad-toolsmith/lenses/lens-determinism.md`): scripts own parsing, counting, path resolution, and structural checks; prose owns judgment and meaning.
5. **Customization** (`skills/toolsmith/bmad-toolsmith/lenses/lens-customization.md`): every `customize.toml` key is actually read in the skill body (`{workflow.<key>}` / `{agent.<key>}` or Jinja in rendered skills); no boolean toggles.
6. **Triggers** (`skills/toolsmith/bmad-toolsmith/lenses/lens-trigger.md`): two-part `description` (short third-person summary + `Use when ...`), at most 1024 characters, and no "when to use" prose repeated inside the body.

## Mandatory verification

Run these checks on every skill PR (plus `uv run --frozen tools/quality.py` on `HEAD` before pushing):

```bash
uv run skills/toolsmith/bmad-toolsmith/scripts/prepass.py <skill-dir>
uv run tools/validate_skills.py --strict
uv run tools/validate_file_refs.py --strict
uv run skills/core-tools/bmad/scripts/validate_manifests.py
uv run --frozen python -B -m pytest
```

Inspect `prepass.py` JSON output for `frontmatter_ok`, `description_chars`, `path_findings`, `script_findings`, `customize_findings`, `toml_errors`, `long_paragraphs`, and `repeated_passages` before considering the skill ready.
