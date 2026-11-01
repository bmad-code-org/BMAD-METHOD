# Registering a skill with BMad

Read this when the user asks whether a skill should be its own module, join one, or stay a plain skill; what registering gives; or how to add to the BMad Method. Smithy asks whether the skill stands alone or is part of a module, offers a guess from what is installed, and puts the answer in the execution plan as its own line, so the user always sees and can change it. One skill defaults to a single-skill module.

## The three choices

- **Single-skill module.** The default for one skill. Its own record in the same folder: setup asks its questions when it has any, help recommends it, updates are checked, other skills can require it, and there is no second folder (`help/shape-single-skill-module.md`).
- **Member of an existing module.** A small `bmod.toml` naming the record, plus edits to the record: the skill list, a help row, a roster entry for an agent. The skill takes the module's prefix and lives beside its other members. For a user building or expanding that module, or who named it or chose a name with its prefix.
- **Plain skill, outside the registry.** No `bmod.toml`. It still works, and it can still read BMad config and customization. But `bmad` help never recommends it, setup never sees it, and update checks skip it. For a project with no `_bmad/`, or a user who wants no record.

A new module with several skills gets a `bmod-<code>/` record folder and a member file in each skill. Its first skill, built alone, is still a single-skill module, carrying the planned module's code and prefix so nothing is renamed; package mode moves the record out when the second skill exists. Smithy never writes a record folder for one skill.

## How Smithy decides

Smithy asks whether the skill is part of a module and whether more skills are planned, naming any installed module it could join. One skill: single-skill module. The user is working on a module, named one, or picked a name carrying an installed module's prefix: member of it. More skills planned: a new module, starting as a single-skill module under its code. No `_bmad/` and nothing said about BMad, or the user declines a record: plain. Several skills described: a new module. The result is one line in the execution plan with its consequence; the user confirms or changes it.

## Adding to the BMad Method

Two different things. Contributing a skill to the official method module means a pull request to the BMAD-METHOD repository: the skill lives under its `skills/`, takes a `bmad-` name, and its `bmod.toml` names `bmod-method`. Extending the method inside a project means the user's own module with their own prefix, whose skills require or recommend the method skills they build on; it never takes a `bmad-` name and never edits the installed method record, which the next update would overwrite (`help/how-to-add-to-module.md`).

## After the fact

A skill that was built plain can be registered later: convert mode's in-place path adds the record, and package mode wraps several. A skill wired to BMad with no record shows up in a review as "registered nowhere".
