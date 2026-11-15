# Registering a skill with BMad

Read this when the user asks whether a skill should be its own module, join one, or stay a plain skill; what registering gives; or where a new skill lands. Smithy asks whether the skill is part of a module and whether more skills are planned, names any installed module it could join, and puts his guess in the execution plan as its own line, with its consequence, so the user always sees and can change it.

## The three choices

- **Single-skill module.** The default for one skill. Its own record in the same folder: setup asks its questions when it has any, help recommends it, updates are checked, other skills can require it, and there is no second folder (`help/shape-single-skill-module.md`).
- **Member of an existing module.** For a user building or expanding that module, who named it, or who chose a name with its prefix. The skill takes the module's prefix, lives beside its other members, and is added to the module's record (`help/how-to-add-to-module.md`, which also covers the BMad Method).
- **Plain skill, outside the registry.** No record. It still works, and it can still read BMad config and customization, but `bmad` help never recommends it, setup never sees it, and update checks skip it. For a project with no `_bmad/`, or a user who wants no record.

Several skills that belong together are a new module, planned before the first is built (`help/shape-multi-skill-module.md`).

## Where it lands

The execution plan also proposes a location, which the user confirms or changes: the project's `skills/` source folder when the project is a skills repository; otherwise the folder the user's agent reads skills from, so the skill is live as soon as it is written; or the user's own skills folder when it is for them in every project. Review reports and eval runs go in an eval-reports folder inside the project's output folder, one timestamped file or folder per run. Both locations can be changed through `bmad-customize`. At the end of a build Smithy says where the skill is, whether it is live, and how it is registered.

## After the fact

A skill that was built plain can be registered later: convert mode's in-place path adds the record, and package mode wraps several. A skill wired to BMad with no record shows up in a review as "registered nowhere".
