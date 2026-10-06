# How to: a skill that joins a module

Read this when the user wants to add a skill or agent to a module: their own, their organisation's, or the BMad Method. Settle which case it is first.

## Your own or your organisation's module

1. Tell Smithy which module, or let him guess from the prefix: a name carrying an installed module's prefix, or a skills repository with a `bmod-<code>/` record, points him there.
2. The read-back shows registration as "member of `bmod-<code>`", the name with the module's prefix, the location beside the module's other skills, and the files: the skill, its small `bmod.toml` naming the record, and the edits to the record itself: the skill list, a help row, and a roster entry when it is an agent.
3. Smithy builds it, runs the lenses, and validates the module's manifests. For an agent, party mode and `bmad` see it through the roster.
4. If the module is installed from a repository, the new skill ships when that repository is pushed and the users run `bmad setup`; a skill written into the installed copy is overwritten by the next update, so build it in the source repository.

## Contributing to the BMad Method

The method module is `bmod-method` in the BMAD-METHOD repository. A contribution is a skill under that repository's `skills/` folder with a `bmad-` name and a `bmod.toml` naming `bmod-method`, built in a clone or worktree of that repository and offered as a pull request. Smithy treats a clone of it as a skills repository and registers the skill as a member.

## Extending the method in your project

Do not add to the installed method record; the next update overwrites it. Make your own module with your own prefix (`help/naming.md`) whose skills require or recommend the method skills they build on. `bmad` help recommends your skills beside the method's, and updates leave both alone.
