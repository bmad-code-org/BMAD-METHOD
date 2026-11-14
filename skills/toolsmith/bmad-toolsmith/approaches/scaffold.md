# Scaffold

For a skill the user will write themselves. Its outcome: a valid folder at `{target}` with frontmatter, manifest and starting files in place, and the user knowing what to fill in. Bare paths resolve from `{skill-root}`.

Load `shapes/<shape>/shape.md`, then the module shape the registration line names, if any, to learn which templates they start from. Then `uv run {skill-root}/scripts/init_skill.py --name <name> --dest <parent folder> --shape <shape> --dirs <the folders they asked for> --description "<approved description>"`.

- Add `--bmod <record> --source <update_source>` when the execution plan registers it as a member.
- With no approved description, leave `--description` off; the scaffold carries a `[TODO:` marker.

Fill the shapes' templates with their `process_template.py` lines, keeping the frontmatter of the stub `SKILL.md` `init_skill.py` wrote; placeholders the user fills stay visible.

Say, in about five lines in chat: that the description is the whole trigger and where it lives; where the know-how goes; what each extra folder is for; that references stand alone, one level deep; and the canon's core test, so they cut what a capable model would do unasked. Point at `canon.md` for the rest.

Then load `ship.md`. `init_skill.py --check` fails on any `[TODO:` left, so the checks stay red until they finish, and the trigger eval waits for a real description.
