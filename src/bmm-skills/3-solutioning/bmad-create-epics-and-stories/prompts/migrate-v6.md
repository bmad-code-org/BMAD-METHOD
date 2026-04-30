**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/init_epic.py`) resolve from the skill root.

# Migrate-v6 Helper

You arrive here when Stage 0 detected `{mode}=migrate` and the user picked option 2 in `prompts/intent.md` ("run the canonical-v6 migration helper"). The helper bootstraps a v7 tree from a canonical v6 monolithic `epics.md`. It is intentionally narrow.

## Scope

**Supported:** the canonical v6 monolithic shape — a single `epics.md` produced by the v6 `bmad-create-epics-and-stories` skill, following its `templates/epics-template.md` structure. Front matter at top, `## Requirements Inventory`, `## Epic List`, then per-epic `## Epic N: <title>` sections, each with `### Story N.M: <title>` blocks.

**Sharded v6** is also supported via a flatten step (see Sharded Input below).

**Not supported:** hand-edited / heavily restructured v6 docs that don't follow the canonical headings. The parser surfaces what it could and couldn't extract — show that to the user and offer option 3 from `prompts/intent.md` ("walk it through manually using the v6 file as input to a normal create flow").

## Process

### 1. Locate the v6 input

The v6 input is at `{initiative_store}/epics.md` or `{planning_artifacts}/epics.md`, or — for sharded v6 — a directory containing `index.md` and per-epic files at the same locations.

### 2. Run the parser

```
python3 scripts/parse_v6_epics.py --input <path-or-dir>
```

The script emits structured JSON: `title`, `requirements` (FRs/NFRs/UX-DRs), `epics[]` (each with stories[], acceptance_criteria[], coverage_codes[], inferred type), `warnings[]`, and an `is_sharded` flag.

#### Sharded input

If the parser reports `is_sharded: true`, tell the user:

> "Your v6 input looks sharded — a directory of files rather than a single monolithic doc. Two options: I can flatten it into a single `epics.md` first (concatenate `index.md` + every per-epic file in order, write to a temp path), or you can pick option 3 from the previous prompt to walk through manually with the v6 content as context."

If the user picks flatten: read `index.md` (if present) plus each per-epic file under the directory in NN order; concatenate with a blank line between sections; write to `{initiative_store}/.bmad-cache/v6-flattened.md`; then re-invoke `parse_v6_epics.py` against the flattened file. Otherwise, route back to `prompts/intent.md`.

### 3. Confirm the parse with the user

Show a concise summary using the parser's output: "Parsed N epics and M stories. Epic 1 is '<title>' with K stories; Epic 2 is '<title>' with L stories; ...". List `warnings[]` so the user can confirm the ambiguous calls (story type guesses, stories with no ACs, codes that didn't map cleanly).

Ask: "Look right? Want to adjust anything before I create the v7 tree?"

### 4. Persist the inventory

Write the parsed `requirements` block to `{initiative_store}/.bmad-cache/inventory.json` using the schema documented in `prompts/discovery.md`. This is what Stage 5's coverage gate will read.

### 5. Generate the v7 tree

For each parsed epic, in order:

1. `python3 scripts/init_epic.py --initiative-store {initiative_store} --epic-nn <NN> --title "<title>" [--depends-on <NNs>]`
2. Edit the new `epic.md` body — fill Goal from the parsed `intent`, fill Shared Context with anything the v6 epic mentioned about architecture or constraints (often sparse; that's fine), fill Story Sequence from any inter-story notes.
3. For each parsed story in this epic:
   - `python3 scripts/init_story.py --initiative-store {initiative_store} --epic <folder> --story-nn <NN> --title "<title>" --type <type> [--depends-on <refs>]`
   - Paste the parsed user-story stanza (or remove it for `task`), paste the parsed ACs into the Acceptance Criteria section verbatim, leave Technical Notes empty (the v6 file usually doesn't have them at this granularity), and fill Coverage from the parsed `coverage_codes`.

The v6 file does not encode `depends_on` explicitly. Best-effort: assume cross-epic deps follow numeric order (Epic 2 depends on Epic 1, etc.) and confirm with the user before committing. Within-epic, leave `depends_on: []` and let Stage 5 surface anything to add.

### 6. Validate strict

Route to `prompts/validate.md` strict (with `--inventory` since you just persisted one). Surface failures and loop into `prompts/epic-authoring.md` for narrow fixes.

### 7. Confirm next steps

Once validation passes, tell the user the v7 tree is ready and the v6 `epics.md` is still on disk untouched. They can delete it whenever they're confident. Then route to `prompts/finalize.md`.

## Stage Complete

This helper is single-shot. After the validation loop closes, the migrate flow is done — Stage 6 finalizes as if it had been a fresh create.
