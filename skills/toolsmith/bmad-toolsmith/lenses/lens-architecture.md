# Lens: architecture

Lane: structure and progressive disclosure, per the standards and the canon. The bar: the entry carries only what every route needs; everything the skill promises exists and resolves.

- Branch content in `SKILL.md`, a section only some routes use: high when it is a large share of the entry, else medium; it belongs in a reference. An entry every run needs whole stays whole at any size, and a small skill in one file is the right shape. `skill_md_tokens` and `files[].tokens` are evidence for this judgment, not a threshold.
- A reference smaller than its pointer: low; inline it.
- A reference that needs another reference's content to do its own work, or leans on "as described above": high. A route file that ends by naming the next file to load is a hand-off, not nesting.
- A router with one branch, or branches of a line each: medium; inline it.
- A route or step file loaded before its branch is reached: high when the run may never reach it, medium when it always loads later.
- `path_findings` that hold up: a path that does not resolve, a path into another skill, a bare `scripts/` call. High, critical if activation depends on it.
- A skill or capability that coaches a person through a document by hand (asks the questions, drafts the sections, reviews the draft), other than `bmad-facilitate` itself: medium; name it a candidate to become a `bmad-facilitate` template, which brings the review, the resume and the customization with it.
- An agent offering document templates, per `shapes/document-template/shape.md`: `bmad-facilitate` missing from its `required_skills`, or the agent writing a template's document itself: high. A registered agent's templates left in `assets/`, or a shared template whose `agents:` does not name it: medium.
- A pattern over-applied (parallel reviewers on a one-file transform, a memlog on a one-shot, a menu on a one-job skill): medium; say what removing it loses. A multi-turn build with no state across turns: medium.
- Agent (`shape_hint` is `agent` or `memory-agent`): every `[[agent.menu]]` item, or route listed in `SKILL.md`, resolves to an installed skill, a prompt file in the skill that exists, or an inline prompt that is the whole instruction; one pointing at a missing file is high. A capability file holding nothing the persona and one sentence would not supply: low; recommend inlining it. Overlapping capabilities, one job split across several, or a persona promising what no capability delivers: medium.
- `bmod_kind` is `none` while the skill ships `customize.toml` or calls `_bmad/scripts`, so help, setup and update checks never see it: critical when the execution plan registered it, medium with no plan, not a finding when the plan chose a plain skill. `invalid`: critical.
- Module record (`bmod_kind` is `record` or `record+skill`), per the standards' Help files section: `help/help.md` holding depth a topic file should carry, or a topic file `help.md` never names: medium. Install mechanics or `bmod.toml` keys in a help file: low.
- Memory agent, per the standards' Memory agents section:
  - a sanctum seed the shape ships in `assets/`, or `{target}/scripts/wake.py` or `{target}/scripts/init-sanctum.py`, missing: critical.
  - sanctum content in `SKILL.md`: high.
  - memory kept as one growing file loaded at waking, a token limit that forces pruning, or an index the agent updates by hand: high.
  - a bootloader or First Breath reading the owner's name or language from config: high.
  - facts of the work kept in the sanctum, or a script copying the skill's references or scripts into it: high.

Not flagged: a thin memory-agent `SKILL.md` (thin is the design); the identity files loaded whole on waking; branch lines too small to carve; the same point in two files, which the leanness lens owns; the other lenses' lanes.
