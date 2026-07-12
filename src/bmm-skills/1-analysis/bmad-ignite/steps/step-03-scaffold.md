# Step 3: Scaffold

## RULES

- Run scaffold commands verbatim from the template entry, substituting only `{target}`. Do not improvise flags.
- NEVER overwrite an existing file. Collisions HALT with options; they are never resolved silently.
- Everything here must leave the user able to see exactly what happened: report each command you ran and its outcome.

## INSTRUCTIONS

1. **Preflight.** Check each tool named in the template's `requires` list (e.g. `node`, `npx`, `git`, `uv`, `docker`) is on PATH via `--version`. Report versions found. If a required tool is missing, HALT: name the tool, link the user to its install page, and wait — do not attempt to install system tooling yourself.
2. **Scaffold into a staging directory.** Set `{target}` = `{project-root}/.ignite-staging` (delete it first if it exists from an aborted run). Run the template's `scaffold` command with that target. If the command fails, show the output, fix obvious environment issues (e.g. offline registry, old Node) with the user, and retry once; otherwise HALT with the error.
3. **Detach template history.** If `{target}/.git` exists, delete it — the project starts with its own history.
4. **Move into place.**
   - Subdirectory placement: rename `{target}` to the chosen `{project-root}/<name>`. Set `{app_root}` to it.
   - Root placement: first compare the staging directory's top-level entries against `{project-root}`. If any name collides (a file that exists in both), HALT and present: `[S] Move to a subdirectory instead` | `[O] Show the collisions and decide file by file` | `[X] Abort`. If clean, move every entry from staging into `{project-root}`, remove the empty staging directory, and set `{app_root}` = `{project-root}`.
5. **Version control.** If `{project-root}` is not already a git repository, run `git init` there. Ensure `.gitignore` covers the template's build outputs and local env files (the template usually ships one — extend, do not replace). Stage everything and commit: `chore: scaffold {slug} from <template id> via bmad-ignite`.
6. **Env scaffolding.** Look in `{app_root}` for the template's env example file (`.env.example`, `.env.template`, or the file its README names). Copy it to the local filename the template expects (commonly `.env.local` or `.env`), keeping placeholder values. Confirm the local file is gitignored. Collect every variable name plus its purpose (from the example file's comments and the README) — you will document them in the handoff. Do not invent values; do not ask the user to paste secrets into the chat.
7. **Install dependencies** if the scaffold command did not already (run the install command the template's README specifies — e.g. `npm install`, `uv sync`). Show a one-line result. If installation fails, show the output and HALT.
8. Run any remaining one-time bootstrap the template's `notes` entries describe (e.g. removing sample content, compose config checks). Skip notes that require credentials the user has not created yet — record them as pending for the handoff.

## NEXT

Read fully and follow `./step-04-verify-and-handoff.md`
