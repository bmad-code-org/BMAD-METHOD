## Command Dispatch

`uv` is required. If `uv` is missing or cannot run, tell the user that `uv` must be installed and stop. Do not write `_bmad` another way.

There are two commands. `bmad setup [code]` is the only one that changes anything. It is an upsert: it creates what is missing, repairs what is stale, and asks only new questions, so it is what to run after a first install and after every `npx skills update`. A user who says "update", "doctor" or "repair" gets setup. `bmad status [code]` only reads.

Both run `scripts/setup.py`, and every mode prints one JSON value. On an error the script prints one line, `error: <message>`, and exits 1: report the source it names and stop. Do not attempt another path.

A module name is optional. Without one the command covers every installed module. With one, add `--module <name>` to every `setup.py` call of that run; the name is a module code such as `method`, or its folder such as `bmod-method`. The install-wide parts, such as `_bmad/scripts`, are handled either way.

When the name matches no installed module, every mode prints this instead of its usual output, and nothing is changed:

```json
{"mode": "setup", "status": "unknown-module", "changed": false, "module": "<name>", "installed_modules": ["method"], "missing_module_records": []}
```

Tell the user the name is unknown and list `installed_modules`. A `missing_module_records` entry means skills of that module are installed without its record: relay the entry's `install` command. Then stop.

## `bmad status [code]`

Run this command. It writes nothing under the project, so create no answer or temporary file:

```text
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --status
```

Report what the JSON says, naming states exactly as emitted:

- `bmad_exists`, and `shared_scripts`: whether `_bmad/scripts` is `current`, `stale` or `missing` against this skill's packaged copy.
- Each entry of `modules`: its `module` code, `version`, and installed `skills`. `absent_skills` are skills the module lists that are not installed; they are optional, not faults. Its `update.state` is `current`, `newer-available`, `ahead`, `differing-unordered`, `could-not-check` (give the `reason`) or `plugin-managed` (relay the `instruction`).
- `missing_module_records`: a skill is installed without its module's record. Name the record and relay its `install` command.
- `pending_questions`: unanswered config questions, each with its `scope`, `team` or `user`.
- `unmet_requirements`: name the skill or module that needs it, what it `requires`, the `minimum` and what is `installed`, and offer its `install` command: an `npx skills add` command when the skill is missing, `npx skills update` when it is outdated or its `state` is `unknown-version`, which means the installed copy predates module records and its version cannot be read. `unmet_recommendations` has the same shape but is never a fault: mention those skills once as optional additions.
- `problems`: relay each `message`. A `bmod-file` problem means that folder's `bmod.toml` is unusable and was skipped; everything else still ran.
- `custom_gitignore`: on `unprotected`, tell the user that `_bmad/custom/.gitignore` does not ignore `*.user.toml`, so their personal answers may be committed, and that setup will not edit the file; only they can fix it.
- `legacy_leftovers`: when non-empty, say that files from a classic BMad installer are present under `_bmad` and are left untouched.

Never call the installation current unless the top-level `current` is true; a `could-not-check` update state alone does not make it false. End with `next`, the one command to run next, when it is not null. Status does not run it: `bmad setup` is yours to run if the user agrees, and `npx skills` commands are the user's to run.

## `bmad setup [code]`

Setup asks no questions of its own; the only questions come from installed modules' `bmod.toml` files. It works with or without an existing `_bmad`. It never changes a value already in any config file, keeps the comments and layout of a file it adds an answer to, and never modifies or removes files a classic BMad installer left under `_bmad`. It makes `_bmad/scripts` a plain copy that is byte-identical to this skill's `scripts/`, replacing a symlink or a stale copy, and does the same for each module's `_bmad/<code>/scripts`. It writes `_bmad/custom/.gitignore` when that folder has none, so user answers are not committed; it never edits an existing one.

### Installed module questions

Discover the unanswered questions. This command is read-only:

```text
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --list-config-questions
```

The command prints a JSON array of `{module, key, prompt, default, scope}`. Ask every returned question exactly once and in array order, showing its `default`. Tell the user when a question's `scope` is `user`: that answer is theirs alone and is not shared with the team. Do not ask a question that is absent from the array. If the user accepts a default, use the emitted default exactly: the script has already expanded `{directory_name}` to the project directory name while retaining `{project-root}` and unknown placeholders literally.

If the array is non-empty, write the selected answers with the Write tool (not the shell) to `{project-root}/.bmad-help-setup-modules.toml`. If that path already exists, choose another temporary path so no existing file is overwritten. Record the path actually chosen as `{module-answers-path}`. Put every answer, team or user, below its returned module; the script routes each by its question's scope, team answers to `_bmad/config.toml` and user answers to `_bmad/custom/config.user.toml`. Quote each returned key as one TOML key so dotted keys remain unambiguous:

```toml
[modules."example"]
"simple_key" = "selected answer"
"nested.key" = "selected answer"
```

All values must be TOML basic strings. Escape backslashes, double quotes, newlines, carriage returns, tabs, and other control characters correctly. Answer every returned question and nothing else; setup rejects a file with a missing or an extra answer.

### Run setup

Run the script, with the module answer file when one was written:

```text
# No module answers
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}"

# With module answers
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --module-answers "{module-answers-path}"
```

After setup succeeds, delete only the temporary answer file created during this run.

Report the top-level `status`: `created`, `repaired`, or `current` when nothing needed changing. Add what changed from `shared_scripts`, `config`, each module's `scripts`, and `answers_added`, which names the file each new answer went to. Report `missing_module_records`, `unmet_requirements`, `unmet_recommendations`, `problems`, an `unprotected` `custom_gitignore` and `legacy_leftovers` as under `bmad status`. Never call the installation current unless the top-level `current` is true, and relay `next` when it is not null. After a run limited to one module, `next` is `bmad setup` while other modules still have unanswered questions.

Then show the current answers from `answers`: for each module, every `key` with its `value`, `scope` and the `file` it lives in. Offer to change any of them. Setup never changes an existing value, so a change is an edit you make, with the user's say, to `modules.<code>.<key>` in the file the report names for that answer.
