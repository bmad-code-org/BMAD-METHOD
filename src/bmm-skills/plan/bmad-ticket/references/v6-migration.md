# V6 Compatibility and Migration

Standalone. Three situations land here: the user (or the `bmad-create-epics-and-stories` shim) wants the v6 single epics-and-stories file, wants all stories for all epics up front, or is migrating a project mid-flight from the `sprint-status.yaml` pipeline. Converse in `{communication_language}`; write ticket content in `{document_output_language}`.

## Recommend first, comply second

Before doing anything the v6 way, make the case for the replacement — once, plainly, then respect the answer:

- **Just-in-time inception beats all-stories-up-front.** Stories written long before implementation get rewritten when reality moves; incepting an epic when its work begins folds in everything learned since slicing, including detail a PM added to the envelope in between. Less waste, less drift, no stale backlog to groom.
- **Estimation doesn't need stories.** The epic envelope carries description, goals, `covers:`, and links to the inputs that drive the work — enough to T-shirt size the epic set on request, at epic altitude, with zero stories written.

If the user still wants the v6 shape after hearing that, comply without relitigating.

## The v6 shape, the new way (default compliance path)

The old artifact is a **view**, not a second source of truth:

1. Run the slice route to the epic set (its gate included).
2. On explicit confirmation, chain the incept route per epic — each epic through its own gate; quick and autonomous collapse the pauses per their mode rules.
3. Render the single file: `uv run {skill-root}/scripts/ticket_tree.py render --root {workflow.project_root} --out <path>/epics-and-stories.md`. The render is deterministic — statuses come straight from frontmatter — and carries a generated-file banner. Re-render after any change; hand-edits to the rendered file are overwritten, the tree wins. Say that when handing the file over.

Anyone asking "give me one file to read or share" gets this render too — it is not only a v6 path.

## True v6 mode (only on explicit refusal of the tree)

If the user explicitly refuses the ticket tree, fall back to a single authored epics-and-stories file with an inline `Status:` line per story. State the trade plainly before writing: no update gate, no frontier, no board, no coverage or cycle checks, no graph — status is best-effort prose the model keeps current, and drift is likely. This mode exists for compatibility, never as a recommendation, and is offered only when the tree itself is refused.

## Mid-project migration (from the sprint-status.yaml pipeline)

`sprint-status.yaml` stays in service for in-flight v6 work — and is **never used for net-new epics or stories**. Migration happens per epic, at the natural seam:

1. **In-flight epics finish where they are.** Stories already tracked in `sprint-status.yaml` run to done under the legacy flow. Never migrate half-built work.
2. **The next epic migrates by inception.** Its section in the v6 epics file is the input: write the envelope into the tree with fidelity — the v6 detail is co-authored input, never drift to regenerate away; `covers:` ids carried verbatim in the source scheme — then run the normal incept route against it.
3. **One story, one system.** Every story is tracked in exactly one place; the two systems never cross-reference by id. A tree story that genuinely waits on legacy in-flight work records that as prose in Dev Notes ("blocked until legacy story X merges"), never as a `depends_on` id the frontier can't verify.
4. **Name the seam once.** When a `sprint-status.yaml` is known to exist, say so at the start: in-flight v6 work is tracked there, everything new lives in the tree — `board` and `frontier` are the tracking from here on.
