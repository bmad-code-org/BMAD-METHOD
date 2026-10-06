# Scaffold

For a skill the user will write themselves. Its outcome: a valid folder at `{target}` with frontmatter, manifest and starting files in place, and the user knowing what to fill in.

Load `shapes/<shape>/shape.md` to learn which `assets/` templates the shape starts from. Then `uv run {skill-root}/scripts/init_skill.py --name <name> --dest <parent folder> --shape <shape> --dirs <the folders they asked for> --description "<approved description>"`, adding `--bmod <record> --source <update_source>` when the read-back registers it as a member; a single-skill module's record comes from `shapes/single-skill-module/shape.md`. When no description was approved, leave `--description` off: the scaffold carries a `[TODO:` marker that the checks flag until they write one. Copy the shape's template files into place as starting points, placeholders left visible.

Say, in about five lines in chat: that the description is the whole trigger and where it lives; where the know-how goes; what each extra folder is for; that references stand alone, one level deep; and the canon's core test, so they cut what a capable model would do unasked. Point at `canon.md` for the rest.

Then load `ship.md`. `init_skill.py --check` fails on any `[TODO:` left, so the checks stay red until they finish, and the trigger eval waits for a real description.
