---
name: bmad-module
description: Install, update, remove, or list community BMAD modules. Use when the user says "install module <X>", "install bmad module", "update module", "remove module", "uninstall module", or "list modules".
---

# bmad-module

Manage community BMAD modules — installable packages of skills, agents, and supporting assets that ship as standalone GitHub repos. Modules are staged under `_bmad/<bmad.code>/` and tracked in the existing manifests. On `install`, `update`, and `remove`, the script then distributes (or prunes) the module's skills to **every coding assistant the user selected when they ran `bmad install`** — read from the `ides:` list in `_bmad/_config/manifest.yaml` — so a community module lands in Claude Code, Cursor, Copilot, etc. exactly like an official module. As with official modules, the canonical end state is skills living in the IDE directories (e.g. `.claude/skills/<id>/`), not in `_bmad/`. The same artifact is also loadable as a Claude Code plugin via its `.claude-plugin/plugin.json` manifest.

## CRITICAL RULES

- NEVER write directly to files under `_bmad/` or into IDE directories (`.claude/skills/`, `.agents/skills/`, etc.). All filesystem changes go through the Node script at `scripts/bmad-module.mjs` — it handles staging, atomic swaps, manifest updates, IDE distribution, and rollback on failure.
- HALT and report cleanly if `_bmad/` is not present in the current working directory (exit code 10 from the script).
- DO NOT execute hooks, MCP server commands, or any code shipped inside the module during install. The install copies files; activation is a separate step the user opts into via Claude Code's plugin manager.
- If the script exits non-zero, report the exit code and stderr verbatim and stop. Do NOT retry, do NOT try a different verb. The one exception is exit code 5 (the skill's own bundled runtime files are missing/corrupt): that's a fixable setup/packaging problem, not a module rejection — relay the script's "reinstall the skill" guidance instead of reporting a failed install.

## EXECUTION

### Step 1 — Identify the verb

The user's request maps to exactly one of:

| Verb      | Phrasing                                                               |
| --------- | ---------------------------------------------------------------------- |
| `install` | "install module X", "add the X module", "set up X"                     |
| `update`  | "update module X", "upgrade X", "pull the latest X"                    |
| `remove`  | "remove module X", "uninstall X", "delete X module"                    |
| `list`    | "list modules", "what modules are installed", "show installed modules" |

If the verb is ambiguous (e.g. the user says "manage modules"), ASK which verb they want before continuing.

### Step 2 — Parse the args

- **install:** the user supplies `<source>` — `owner/repo` (GitHub short), a full git URL (`https://…` or `git@…`), or a local path. Optional flags: `--ref <branch-tag-or-sha>`, `--channel <stable|next|pinned>`, `--dry-run`.
- **update:** the user supplies `<code>` (the `_bmad/<code>/` folder name) or asks for "all"; in that case use `--all`. Optional `--ref`.
- **remove:** the user supplies `<code>`. Use `--purge` only if they explicitly say "also remove customizations" or "purge".
- **list:** no args. Use `--json` if the user asks for machine-readable.

If anything is missing or ambiguous, ASK before invoking.

### Step 3 — Confirm before destructive verbs

For `install`, `update`, and `remove`, summarize what will happen and confirm once with the user:

> About to **install** `acme/acme-devlog` (will create `_bmad/devlog/`).
> Proceed? [y/N]

For `install` you may run a dry-run first (`--dry-run`) and show the file plan; that counts as the summary — still confirm before the real run.

Skip the confirmation step only if the user has already pre-authorized in this turn (e.g. "go ahead and install acme-md-lint without asking").

### Step 4 — Invoke the Node script

Run from the project root (the dir containing `_bmad/`):

```
node <skill-dir>/scripts/bmad-module.mjs <verb> [args...]
```

`<skill-dir>` is wherever the skill files live in the current install. After this skill ships into BMAD-METHOD that's `_bmad/core/skills/bmad-module/`; during development it's this repo's `src/core-skills/bmad-module/`.

Stream stdout and stderr verbatim. Do NOT silence or rewrite them — the script's own messages are designed for end-user consumption.

### Step 5 — Report

On exit 0: paraphrase the script's final line(s) and note any next-step hint (e.g. "next: run the `bmad-devlog-setup` skill to finish setup"). The script also prints `[ide-sync]` lines naming each coding assistant the skills were synced to — relay them so the user knows where the module landed.

Note two non-fatal cases the script reports on exit 0:

- If the script prints `[bmad-module] note: no coding assistants are configured…`, the module is staged under `_bmad/` but no IDEs were selected at `bmad install` time — tell the user to run `bmad install` to choose their assistants.
- If it prints `[bmad-module] warning:` about IDE distribution, the module installed fine but skills may not have reached every assistant — relay the script's suggestion to run `bmad ide-sync`. Do NOT treat this as a failed install.

On non-zero exit: print the exit code, the stderr message, and stop. Do not suggest workarounds beyond what the script's message itself suggests (e.g. "use `update` instead", "move changes into `_bmad/custom/<code>/`").

## EXIT CODES

| Code | Meaning                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------- |
| 0    | success                                                                                                       |
| 2    | usage error (bad/missing args or flags)                                                                       |
| 5    | skill runtime files missing/corrupt — reinstall the skill (a setup/packaging problem, NOT a module rejection) |
| 10   | no `_bmad/` directory in project — run `bmad install` first                                                   |
| 20   | missing or invalid `.claude-plugin/plugin.json` in source                                                     |
| 21   | module uses a reserved `bmad.code`                                                                            |
| 30   | prefix collision with an already-installed module                                                             |
| 40   | module would write outside its `_bmad/<code>/` root                                                           |
| 50   | filesystem commit (atomic swap) failed                                                                        |
| 60   | network or `git clone` failed                                                                                 |
| 70   | path traversal detected in manifest                                                                           |
| 80   | update aborted: locally modified files would be overwritten                                                   |
| 90   | no such installed module (for `update`/`remove`)                                                              |

## EXAMPLES

User: "Install the devlog module from acme/acme-devlog" → Confirm, then run: `node …/scripts/bmad-module.mjs install acme/acme-devlog`

User: "Try installing examples/minimal/acme-md-lint first as a dry-run" → Run with `--dry-run`, show the plan, then ask whether to proceed for real.

User: "What modules do I have installed?" → Run `… list`. No confirmation needed (read-only).

User: "Update the devlog module to v0.5.0" → Confirm, then run `… update devlog --ref v0.5.0`.

User: "Remove the mdlint module and wipe its customizations too" → Confirm, then run `… remove mdlint --purge`.
