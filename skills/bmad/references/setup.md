# Setup

`uv` is required. If it is missing or cannot run, say so and stop; never write `_bmad` another way.

Setup, status, update, repair and doctor are one flow: check, report, then fix what the user wants fixed. When the request already says what to do, such as "update" or a first setup, do it without asking again. Always ask before deleting anything or running a migration. Run `npx skills` commands yourself, with `-y`.

## Calling setup.py

Every call is `uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}"`, plus:

- `--root <folder>` for each skills folder the host has active, project folders first, as for `knowledge.py` in help;
- `--module <name>` when the user named a module, by code (`method`) or folder (`bmod-method`);
- the mode flag of the step.

Each call prints one JSON value. On failure it prints `error: <message>` and exits 1: report it and stop. An unknown module name gives `"status": "unknown-module"` and `installed_modules`: list them and stop.

## 1. Check

Run with `--status`; it writes nothing. On a first install (`bmad_exists` false) go straight to Fix. Otherwise report what the JSON shows: each module with its version, scope and update state, then whatever is missing, stale, duplicated, retired, unmet or a problem. What the JSON does not say itself:

- Call the installation current only when the top-level `current` is true.
- `absent_skills` are skills the user opted out of or that are new to the module, and `unmet_recommendations` are suggested additions. Both are optional, not faults.
- `plugin-managed`: relay its `instruction`; the plugin updates the module.
- `unknown-version`: the installed copy predates module records; `npx skills update` fixes it.
- `custom_gitignore` `unprotected`: personal answers may be committed. Only the user edits that `.gitignore`.
- `legacy_leftovers`: files from the classic installer, left untouched.
- `newer_copy_unused`: the duplicate in use is older than another copy.

Then list what can be done and ask which to do, unless the request already said. End with `next` when it is not null.

## 2. Fix

Do the parts the user wants, in this order.

**Update.** For `newer-available` modules, run `npx skills update -p -y` for the `project` scope and `npx skills update -g -y` for `global`. Then read this file again and run the check again, since the update can retire skills and add questions, and continue without asking again.

**Config and `_bmad`.** Run with `--list-config-questions`. It prints `[{module, key, prompt, default, scope}]`. Ask each question in order, and no others, showing its default, and say when its `scope` is `user`: that answer is personal and not shared. Use an accepted default exactly as emitted. If there are answers, write them with the Write tool to `{project-root}/.bmad-help-setup-modules.toml` (another name if that exists), each under its module with the key quoted, values as escaped TOML basic strings:

```toml
[modules."example"]
"simple_key" = "selected answer"
"nested.key" = "selected answer"
```

Then run with no mode flag, adding `--module-answers <file>` when you wrote one, and delete that file after. It refreshes `_bmad/scripts` and each module's scripts, adds the answers, and moves `_bmad/custom/` files of renamed skills (`custom_renames`); it never changes an existing value. Report what changed, `custom_not_renamed` (both files exist: the user merges them) and `custom_unused` (customizations of removed skills).

**Remove and install.** When a path is `global`, say that deleting it affects every project on this machine.

- Retired skills: `--remove-retired <skill>...`.
- Duplicates: `--remove-copies <path>...`, paths exactly as listed. Keep the copy in use, or the newer one when `newer_copy_unused`.
- Run the `install` commands the user accepts from `install_offers`, `absent_install`, `unmet_requirements` and `missing_module_records`.

**Migrations.** Do steps 1 and 2 of `references/migrate.md`, Find and Match. Name each that applies with its `title`, `from` and `to`, and ask; on yes, continue with its steps 3 and 4.

**Answers.** On a first install, or when the user asks to change an answer, show the `answers` from the setup run, each key with its value and file, and offer to change any. A change is your edit to `modules.<code>.<key>` in that file.
