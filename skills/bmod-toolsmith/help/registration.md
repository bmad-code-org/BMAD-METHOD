# Registering a skill with BMad

Read this when the user asks whether a skill should be its own module, join one, or stay a plain skill; what registering gives; or how to add to the BMad Method. Smithy guesses the answer from what is installed and puts it in the read-back as its own line, so the user always sees and can change it.

## The four choices

- **Plain skill, outside the registry.** No `bmod.toml`. It still works, and it can still read BMad config and customization. But `bmad` help never recommends it, setup never sees it, and update checks skip it. Right for a personal skill or a one-off the user keeps by hand.
- **Single-skill module.** Its own record in the same folder. Setup asks its questions, help recommends it, updates are checked, other skills can require it. Right for a lone skill that maintains a project file, has a path a team would set, or that the user wants `bmad` to know (`help/shape-single-skill-module.md`).
- **Member of an existing module.** A small `bmod.toml` naming the record, plus edits to the record: the skill list, a help row, a roster entry for an agent. The skill takes the module's prefix and lives beside its other members.
- **First skill of a new module.** A record folder plus the member file. Usually reached through package mode once two or more skills exist.

## How Smithy guesses

No `_bmad/` and nothing said about BMad: plain. `_bmad/` present and a skill that reads config, maintains a project file, has a settable path, or that the user wants recommended: single-skill module. A skills repository with a record, a module the user named, or a name carrying an installed module's prefix: member. Several skills described: a new module. The guess is one line in the read-back with its consequence; the user confirms or changes it.

## Adding to the BMad Method

Two different things. Contributing a skill to the official method module means a pull request to the BMAD-METHOD repository: the skill lives under its `skills/`, takes a `bmad-` name, and its `bmod.toml` names `bmod-method`. Extending the method inside a project means the user's own module with their own prefix, whose skills require or recommend the method skills they build on; it never takes a `bmad-` name and never edits the installed method record, which the next update would overwrite (`help/how-to-add-to-module.md`).

## After the fact

A skill that was built plain can be registered later: convert mode's in-place path adds the record, and package mode wraps several. A skill wired to BMad with no record shows up in a review as "registered nowhere".
