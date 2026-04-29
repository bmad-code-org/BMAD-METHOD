**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/init_epic.py`) resolve from the skill root.

# Migrate-v6 Helper

You arrive here when Stage 0 detected `{mode}=migrate` and the user picked option 2 in `prompts/intent.md` ("run the canonical-v6 migration helper"). The helper bootstraps a v7 tree from a canonical v6 monolithic `epics.md`. It is intentionally narrow.

## Scope

**Supported:** the canonical v6 monolithic shape — a single `epics.md` produced by the v6 `bmad-create-epics-and-stories` skill, following its `templates/epics-template.md` structure. Front matter at top, `## Requirements Inventory`, `## Epic List`, then per-epic `## Epic N: <title>` sections, each with `### Story N.M: <title>` blocks containing user-story stanzas and Acceptance Criteria.

**Not supported:** sharded v6 (`epics/index.md` + multiple files), or hand-edited / heavily restructured v6 docs. If the input doesn't match the canonical shape, the parsing pass below will report what it could and couldn't extract — show that to the user and offer option 3 from `prompts/intent.md` ("walk it through manually using the v6 file as input to a normal create flow").

## Process

### 1. Locate and read the v6 file

The v6 file is at `{initiative_store}/epics.md` or `{planning_artifacts}/epics.md`. Read it fully.

**Sharded check.** If the path is a directory containing `index.md`, stop here and tell the user:

> "Your v6 file looks sharded — it's a directory with `index.md` and per-epic files. The migration helper handles only the canonical monolithic shape. To proceed: either flatten it into a single `epics.md` first, or pick option 3 from the previous prompt to walk through manually with the v6 content as context."

Then route back to `prompts/intent.md` so the user can pick again.

### 2. Parse the canonical shape

Walk the document and extract:

- **Initiative title.** From the top heading or front-matter `title:`. If neither, ask the user once.
- **Epics.** Each `## Epic N: <title>` (or `### Epic N: <title>`) becomes an epic. The N order in the file becomes the v7 NN order.
- **Per-epic intent / goal.** The first paragraph(s) under each epic heading, before the first story.
- **Stories.** Each `### Story N.M: <title>` (or `#### Story N.M: <title>`) inside an epic becomes a story. The M order becomes the v7 story NN.
- **User-story stanza.** The "As a / I want / So that" block under each story heading. If absent, treat as `type: task`. If present and the title looks user-facing, treat as `type: feature`. If the title contains "bug" / "fix", treat as `type: bug`. If "spike" / "investigate" / "research", treat as `type: spike`. When in doubt, ask the user.
- **Acceptance Criteria.** The Given/When/Then block under `**Acceptance Criteria:**`. Preserve verbatim — re-formatting can introduce errors.
- **Coverage.** Look for `FR1`, `NFR2`, `UX-DR3` references in the AC text. If absent (the v6 template often left coverage in a separate FR Coverage Map), parse the FR Coverage Map and reverse-map FRs back to stories.

If a section is malformed or missing, log the issue and continue. Do not block the whole migration on one bad story.

### 3. Confirm the parse with the user

Show a concise summary: "I parsed N epics and M stories from the v6 file. Epic 1 is '<title>' with K stories; Epic 2 is '<title>' with L stories; ...". Flag anything ambiguous (story type guesses, stories with no ACs, FRs that didn't map cleanly).

Ask: "Look right? Want to adjust anything before I create the v7 tree?"

### 4. Generate the v7 tree

For each parsed epic, in order:

1. `python3 scripts/init_epic.py --initiative-store {initiative_store} --epic-nn <NN> --title "<title>" [--depends-on <NNs>]`
2. Edit the new `epic.md` body — fill Goal from the parsed intent, fill Shared Context with anything the v6 epic mentioned about architecture or constraints (often sparse; that's fine), fill Story Sequence from any inter-story notes.
3. For each parsed story in this epic:
   - `python3 scripts/init_story.py --initiative-store {initiative_store} --epic <folder> --story-nn <NN> --title "<title>" --type <feature|bug|task|spike> [--depends-on <refs>]`
   - Edit the new story file — paste the parsed user-story stanza (or remove it for `task`), paste the parsed ACs into the Acceptance Criteria section verbatim, leave Technical Notes empty (the v6 file usually doesn't have them at this granularity), and fill Coverage from the parsed AC-to-FR map.

The v6 file does not encode `depends_on` explicitly. Best-effort: assume cross-epic deps follow numeric order (Epic 2 depends on Epic 1, etc.) and confirm with the user before committing. Within-epic, leave `depends_on: []` and let Stage 3 / 5 surface anything the user wants to add.

### 5. Validate strict

After all epics are generated, route to `prompts/validate.md` strict. Surface any failures (typically: a story whose v6 ACs reference an FR code the script's regex didn't pick up, or an inferred dep that doesn't resolve). Loop back into `prompts/epic-authoring.md` for narrow fixes.

### 6. Confirm next steps

Once validation passes, tell the user the v7 tree is ready and the v6 `epics.md` is still on disk untouched. They can delete it whenever they're confident. Then route to `prompts/finalize.md`.

## Stage Complete

This helper is single-shot. After the validation loop closes and the user accepts the migrated tree, the migrate flow is done — Stage 6 finalizes as if it had been a fresh create.
