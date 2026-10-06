# Lens: architecture

Lane: structure and progressive disclosure, per `lenses/standards.md` and the canon. The bar: the entry carries only what every route needs; everything the skill promises exists and resolves.

- `skill_md_tokens` against what each route loads: branch content in `SKILL.md`, or a reference smaller than its pointer. High past about 800 tokens in a plain skill, or 1,200 in an agent, with a carvable section, else medium. A small skill in one file with no references is the right shape, not a gap. The budget is the entry's; a large workflow carved so that a run loads only its branch is right-sized at any total, and a large one loaded whole is not.
- A reference loading another reference, or leaning on "as described above": high; it breaks when the entry drops out.
- A router with one branch, or branches of a line each: medium; inline it.
- Content duplicated across files, or a fact restated across sections: medium.
- A route or step file loaded ahead of its branch: high; the model pays for text it may never need.
- `path_findings` that hold up: a path that does not resolve, a path into another skill, a bare `scripts/` call. High, critical if activation depends on it.
- A pattern over-applied (parallel reviewers on a one-file transform, a memlog on a one-shot, a menu on a one-job skill): medium; say what removing it loses. A multi-turn build with no state across turns: medium.
- Agent (`shape_hint` is `agent` or `memory-agent`): every `[[agent.menu]]` item resolves to an installed skill, a `references/<capability>.md` that exists, or an inline prompt that is the whole instruction; one pointing at a missing file is high. A capability file holding nothing the persona and one sentence would not supply: low; recommend inlining it. Overlapping capabilities, one job split across several, or a persona promising what no capability delivers: medium.
- `bmod_kind` is `none` while the skill ships `customize.toml` or calls `_bmad/scripts`: wired to BMad and registered nowhere, so help, setup and update checks never see it. Critical when the read-back registered it; not a finding when the read-back chose a plain skill. `invalid`: critical, `bmad` reports the file as a problem.
- Memory agent: the sanctum seeds the shape ships in `assets/` and the wake and init scripts in `scripts/`; a missing one is critical, the agent cannot wake. Sanctum content sitting in `SKILL.md`: high. Memory kept as one growing file loaded at waking, a token guardrail that forces pruning, or an index the agent must update by hand: high; memory is small files by subject that load when reached, and the map is generated. A bootloader or First Breath reading the owner's name or language from config: high; they are learned in the first exchange.

Not flagged: a thin memory-agent `SKILL.md` (thin is the design); the identity files loaded whole on waking; branch lines too small to carve; the other lenses' lanes.
