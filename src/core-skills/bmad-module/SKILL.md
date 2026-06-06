---
name: bmad-module
description: Install, update, remove, or list community BMAD modules. Use when the user says "install module <X>", "install bmad module", "update module", "remove module", "uninstall module", or "list modules".
---

# bmad-module

Manage community BMAD modules — installable packages of skills, agents, and supporting assets that ship as standalone GitHub repos. Both module formats install: the current spec (a `.claude-plugin/plugin.json` with a `bmad{}` block) and the **legacy** format (a `.claude-plugin/marketplace.json` + `module.yaml`, e.g. `bmad-code-org/bmad-module-game-dev-studio`) — the script resolves a legacy repo into the same on-disk layout automatically. Modules are staged under `_bmad/<bmad.code>/` and tracked in the existing manifests. On `install`, `update`, and `remove`, the script distributes (or prunes) the module's skills to **every coding assistant the user selected at `bmad install`** — read from the `ides:` list in `_bmad/_config/manifest.yaml` — so the module lands in Claude Code, Cursor, Copilot, etc. The canonical end state is skills living in the IDE directories (e.g. `.claude/skills/<id>/`), not in `_bmad/`. The same artifact also loads as a Claude Code plugin via its `.claude-plugin/plugin.json` manifest.

The script also completes the install in place, best-effort: it runs `npm install` when the module ships a `package.json` (skip with `bmad.install.skipNpm: true`), generates the module's `[modules.<code>]` / `[agents.<code>]` config blocks from its `module.yaml` (overridable with `--set`), creates the working directories it declares under `directories:`, and rebuilds `_bmad/_config/bmad-help.csv` so its skills appear in `bmad-help`. A failure in any of these is reported as a warning, not a failed install. Interactive config refinement remains the job of the module's `postInstallSkill`, if it declares one.

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

- **install:** the user supplies `<source>` — `owner/repo` (GitHub short), a full git URL (`https://…` or `git@…`), or a local path. A source may carry an `@<tag-or-branch>` suffix (`owner/repo@v1.2.3`) and a git URL may be a browser-style deep link (`https://github.com/owner/repo/tree/<ref>/<subdir>`, GitLab `/-/tree/…`, Gitea `/src/branch/…`, or `?path=`): the script extracts the ref and a repo subdirectory automatically, so a module living in a monorepo subfolder installs directly. Optional flags: `--ref <branch-or-tag>`, `--channel <stable|next|pinned>`, `--set <code>.<key>=<value>` (override a module config answer; repeatable), `--module <code>`, `--dry-run`. Channels: `pinned` clones an explicit `--ref`/`@ref`; `stable` resolves the latest non-prerelease GitHub release tag (falls back to the default branch when there are no tags / the host isn't GitHub / the tags API is unreachable); `next` (the default for a bare git source) tracks the default branch. Use `--module <code>` only when a legacy marketplace.json repo defines more than one module: the script exits 20 listing the available codes, then re-run picking one. First-party legacy modules whose codes are reserved (`gds`, `bmm`, …) install on the legacy path; the same reserved code in a current-spec `plugin.json` is still rejected (exit 21).
- **update:** the user supplies `<code>` (the `_bmad/<code>/` folder name) or asks for "all"; in that case use `--all`. Optional `--ref`, `--channel <stable|next|pinned>`, `--set <code>.<key>=<value>`. Without overrides, update re-resolves the channel the module was installed with — a `stable` module moves to the latest release tag, a `pinned` module stays put unless `--ref` moves it, and a `next` module re-pulls the default branch.
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

`<skill-dir>` is this skill's own directory: the script ships alongside this `SKILL.md`, so resolve it relative to this file rather than assuming a fixed path — `<skill-dir>/scripts/bmad-module.mjs` (e.g. `.claude/skills/bmad-module/scripts/bmad-module.mjs` once distributed, or `src/core-skills/bmad-module/scripts/bmad-module.mjs` during development in this repo). If the script isn't found next to this `SKILL.md`, the skill's bundled runtime is missing — that's the exit-code-5 case (see CRITICAL RULES and EXIT CODES): relay the "reinstall the skill" guidance rather than guessing another location.

Stream stdout and stderr verbatim. Do NOT silence or rewrite them — the script's own messages are designed for end-user consumption.

### Step 5 — Report

On exit 0: paraphrase the script's final line(s) and note any next-step hint (e.g. "next: run the `bmad-devlog-setup` skill to finish setup"). The script also prints `[ide-sync]` lines naming each coding assistant the skills were synced to — relay them so the user knows where the module landed.

Note two non-fatal cases the script reports on exit 0:

- If the script prints `[bmad-module] note: no coding assistants are configured…`, the module is staged under `_bmad/` but no IDEs were selected at `bmad install` time — tell the user to run `bmad install` to choose their assistants.
- If it prints `[bmad-module] warning:` about IDE distribution, the module installed fine but skills may not have reached every assistant — relay the script's suggestion to run `bmad ide-sync`. Do NOT treat this as a failed install.

On non-zero exit: print the exit code, the stderr message, and stop. Do not suggest workarounds beyond what the script's message itself suggests (e.g. "use `update` instead", "move changes into `_bmad/custom/<code>/`").

## EXIT CODES

The script's stderr always names the condition, so for most non-zero exits you just relay it (see CRITICAL RULES). These few change what you tell the user next:

| Code | Meaning                                                      | What to tell the user                                  |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------ |
| 5    | skill runtime files missing/corrupt — NOT a module rejection | reinstall the skill (relay the script's guidance)      |
| 10   | no `_bmad/` directory in project                             | run `bmad install` first                               |
| 80   | update aborted: locally modified files would be overwritten  | move overrides into `_bmad/custom/<code>/`, then retry |
| 90   | no such installed module (for `update`/`remove`)             | check the code, or run `list` to see what's installed  |

Any other non-zero exit: report the code and stderr verbatim and stop — stderr names the condition. For the full list of codes, run the script with `--help`.

## EXAMPLES

User: "Install the devlog module from acme/acme-devlog" → Confirm, then run: `node …/scripts/bmad-module.mjs install acme/acme-devlog`

User: "Try installing examples/minimal/acme-md-lint first as a dry-run" → Run with `--dry-run`, show the plan, then ask whether to proceed for real.

User: "What modules do I have installed?" → Run `… list`. No confirmation needed (read-only).

User: "Update the devlog module to v0.5.0" → Confirm, then run `… update devlog --ref v0.5.0`.

User: "Install the studio module on the stable channel" → Confirm, then run `… install acme/acme-studio --channel stable` (resolves the latest release tag).

User: "Install the linter that lives in the tools/ folder of this monorepo" → Confirm, then run `… install https://github.com/acme/monorepo/tree/main/tools/linter` (ref + subdir are parsed from the URL).

User: "Remove the mdlint module and wipe its customizations too" → Confirm, then run `… remove mdlint --purge`.
