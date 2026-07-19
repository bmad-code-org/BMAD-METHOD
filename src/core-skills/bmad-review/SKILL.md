---
name: bmad-review
description: 'Multi-lens critical review — adversarial, edge-case, and verification-gap passes over any diff, doc, or artifact, run singly or together. Use when the user says "review this", "critical review", "hunt edge cases", or "check verification gaps".'
---

# BMad Review

Review content through independent lenses — each a distinct method and stance — and report findings in one canonical shape. Report what is real — never pad to look thorough. Each lens sets its own stance toward zero findings: for most an empty result is valid; the adversarial lens treats it as suspicious.

## Inputs

- **content** — what to review: a diff, branch, uncommitted changes, file, spec, story, or any document. Args: `[path]`.
- **lenses** (optional) — one or more lens codes or names. Default: every applicable lens (a full review).
- **also_consider** (optional) — areas to keep in mind alongside each lens's normal analysis.

## Conventions

- Bare paths (e.g. `references/lens-edge-case-hunter.md`) resolve from `{skill-root}` — this skill's installed directory, where `customize.toml` lives. `{project-root}` resolves to the project working directory.
- `{workflow.<name>}` values come from the resolved customization.

## Execution

1. **Resolve customization:** `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults.
2. **Load the content.** If it is empty or cannot be decoded as text: when the caller expects the raw findings JSON array (e.g. the legacy edge-case forwarder), return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` (no `lens` field) and stop; otherwise say what's wrong and ask for reviewable content. Identify the content type — diff, file, function, document — since scope rules and lens applicability depend on it.
3. **Select lenses** from `{workflow.lenses}`. A lens with an empty `instruction` is disabled. If the user or caller named lenses, run exactly those only. Otherwise run every enabled lens whose `when` applies.
4. **Run each selected lens independently** — each sees the content and `also_consider`, never another lens's findings. Follow each lens's `instruction`; the shipped lenses load their reference file just-in-time, so load only what runs. When subagents are available, spawn one per lens in parallel: give it the lens `instruction` with `{skill-root}` and paths resolved absolute, the content or where to read it, any `also_consider` areas, and the constraint "Return ONLY the findings JSON array — no other output." Otherwise run the lenses sequentially yourself, completing one before starting the next.
5. **Assemble and present** per Output below. Keep every lens's findings — overlap between lenses is signal, not duplication; note it in the markdown report rather than deduping.

## Output

One JSON array holding every finding from every lens. Each finding carries:

- `lens` — the code of the lens that produced it
- `location` — where in the content (file:line-range for code, section for documents)
- `trigger_condition` — the problem, or the condition that exposes it, in one line
- `guard_snippet` — the concrete fix, guard, or missing check
- `potential_consequence` — what goes wrong if it ships as-is

Each lens file refines these semantics for its findings and may add lens-specific fields (e.g. `kind`/`confidence` on deletion findings, `gap_shape`/`consumer`/`evidence` on verification-gap findings). `[]` is valid when nothing is found. No severity, priority, or ranking anywhere.

Present per `{workflow.output_format}` — `"json"` (the raw array in a fenced json block), `"markdown"`, or `"both"` — unless the caller requested a specific shape; a legacy forwarder's output contract always wins. The markdown report groups findings by lens: a short block per finding rendering the fields plus any extras worth surfacing, one line for a lens that found nothing, and a plain clean statement when the whole review is clean.

When `{workflow.report_path}` is set, write the report there; otherwise present it in chat.
