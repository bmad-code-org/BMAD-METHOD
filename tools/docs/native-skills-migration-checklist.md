# Native Skills Migration Checklist

Branch: `refactor/all-is-skills`

Scope: migrate the BMAD-supported platforms that fully support the Agent Skills standard from legacy installer outputs to native skills output.

Current branch status:

- `Claude Code` has already been moved to `.claude/skills`
- `Codex CLI` has already been moved to `.agents/skills`

This checklist now includes those completed platforms plus the remaining full-support platforms.

## Claude Code

Support assumption: full Agent Skills support. BMAD has already migrated from `.claude/commands` to `.claude/skills`.

**Install:** `npm install -g @anthropic-ai/claude-code` or `brew install claude-code`

- [x] Confirm current implementation still matches Claude Code skills expectations
- [x] Confirm legacy cleanup for `.claude/commands`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm ancestor conflict protection because Claude Code inherits skills from parent directories and `ancestor_conflict_check: true` is set in platform-codes.yaml
- [x] Implement/extend automated tests as needed

## Codex CLI

Support assumption: full Agent Skills support. BMAD has already migrated from `.codex/prompts` to `.agents/skills`.

**Install:** `npm install -g @openai/codex`

- [x] Confirm current implementation still matches Codex CLI skills expectations
- [x] Confirm legacy cleanup for project and global `.codex/prompts`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy prompt output
- [x] Confirm ancestor conflict protection because Codex inherits parent-directory `.agents/skills`
- [x] Implement/extend automated tests as needed

## Cursor

Support assumption: full Agent Skills support. BMAD currently installs legacy command files to `.cursor/commands`; target should move to a native skills directory.

- [x] Confirm current Cursor skills path and that BMAD should target `.cursor/skills`
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.cursor/commands`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm no ancestor conflict protection is needed because a child workspace surfaced child `.cursor/skills` entries but not a parent-only skill during manual verification
- [x] Implement/extend automated tests
- [x] Commit

## Windsurf

Support assumption: full Agent Skills support. Windsurf docs confirm workspace skills at `.windsurf/skills` and global skills at `~/.codeium/windsurf/skills`. BMAD has now migrated from `.windsurf/workflows` to `.windsurf/skills`. Manual verification also confirmed that Windsurf custom skills are triggered via `@skill-name`, not slash commands.

- [x] Confirm Windsurf native skills directory as `.windsurf/skills`
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.windsurf/workflows`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy workflow output
- [x] Confirm no ancestor conflict protection is needed because manual Windsurf verification showed child-local `@` skills loaded while a parent-only skill was not inherited
- [x] Implement/extend automated tests

## Cline

Support assumption: full Agent Skills support. Cline docs confirm workspace skills at `.cline/skills/<skill-name>/SKILL.md` and global skills at `~/.cline/skills/`. BMAD has now migrated from `.clinerules/workflows` to `.cline/skills`.

**Install:** VS Code extension `saoudrizwan.claude-dev` — search "Cline" in Extensions or `code --install-extension saoudrizwan.claude-dev`

- [x] Confirm current Cline skills path is `.cline/skills/{skill-name}/SKILL.md` with YAML frontmatter (name + description)
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.clinerules/workflows`
- [x] Test fresh install — 43 skills installed to `.cline/skills/`
- [x] Test reinstall/upgrade from legacy workflow output
- [x] Confirm no ancestor conflict protection is needed because Cline only scans workspace-local `.cline/skills/` and global `~/.cline/skills/`, with no ancestor directory inheritance
- [x] Implement/extend automated tests — 9 assertions in test suite 18
- [x] Commit

## Google Antigravity

Support assumption: full Agent Skills support. Antigravity docs confirm workspace skills at `.agent/skills/<skill-folder>/` and global skills at `~/.gemini/antigravity/skills/<skill-folder>/`. BMAD has now migrated from `.agent/workflows` to `.agent/skills`.

- [x] Confirm Antigravity native skills path and project/global precedence
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.agent/workflows`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy workflow output
- [x] Confirm no ancestor conflict protection is needed because manual Antigravity verification in `/tmp/antigravity-ancestor-repro/parent/child` showed only the child-local `child-only` skill, with no inherited parent `.agent/skills` entry
- [x] Implement/extend automated tests

## Auggie

Support assumption: full Agent Skills support. BMAD currently installs commands to `.augment/commands`; target should move to `.augment/skills`.

- [x] Confirm Auggie native skills path and compatibility loading from `.claude/skills` and `.agents/skills` via Augment docs plus local `auggie --print` repros
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.augment/commands`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm no ancestor conflict protection is needed because local `auggie --workspace-root` repro showed child-local `.augment/skills` loading `child-only` but not parent `parent-only`
- [x] Implement/extend automated tests
- [x] Commit

## CodeBuddy

Support assumption: full Agent Skills support. CodeBuddy docs confirm workspace skills at `.codebuddy/skills/<skill-name>/SKILL.md` and global skills at `~/.codebuddy/commands/`. BMAD has now migrated from `.codebuddy/commands` to `.codebuddy/skills`.

**Install:** Download [Tencent CodeBuddy IDE](https://codebuddyide.net/) or install as VS Code extension `CodebuddyAI.codebuddy-ai`

- [x] Confirm CodeBuddy native skills path is `.codebuddy/skills/{skill-name}/SKILL.md` with YAML frontmatter (name + description) — per docs, not IDE-verified
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.codebuddy/commands`
- [x] Test fresh install — 43 skills installed to `.codebuddy/skills/` (installer output only)
- [x] Test reinstall/upgrade from legacy command output
- [ ] **NEEDS MANUAL IDE VERIFICATION** — requires Tencent Cloud account; confirm skills appear in UI and test ancestor inheritance
- [x] Implement/extend automated tests — 9 assertions in test suite 19
- [x] Commit

## Crush

Support assumption: full Agent Skills support. Crush scans project-local `.crush/skills/` exclusively ([GitHub issue #2072](https://github.com/charmbracelet/crush/issues/2072) confirms this and requests adding `~/.agents/skills/`). BMAD has now migrated from `.crush/commands` to `.crush/skills`.

**Install:** `brew install charmbracelet/tap/crush` (macOS/Linux) or `winget install charmbracelet.crush` (Windows)

- [x] Confirm Crush project-local skills path is `.crush/skills/{skill-name}/SKILL.md` — per GitHub issue #2072 confirming `.crush/skills/` is the only scan path
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.crush/commands`
- [x] Test fresh install — 43 skills installed to `.crush/skills/`
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm no ancestor conflict protection is needed because Crush only scans project-local `.crush/skills/`, no ancestor inheritance
- [x] Manual CLI verification — `crush run` lists all 10 skills and successfully triggers bmad-help
- [x] Implement/extend automated tests — 9 assertions in test suite 20
- [x] Commit

## Kiro

Support assumption: full Agent Skills support. Kiro docs confirm project skills at `.kiro/skills/<skill-name>/SKILL.md` and describe steering as a separate rules mechanism, not a required compatibility layer. BMAD has now migrated from `.kiro/steering` to `.kiro/skills`. Manual app verification also confirmed that Kiro can surface skills in Slash when the relevant UI setting is enabled, and that it does not inherit ancestor `.kiro/skills` directories.

- [x] Confirm Kiro skills path and verify BMAD should stop writing steering artifacts for this migration
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.kiro/steering`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy steering output
- [x] Confirm no ancestor conflict protection is needed because manual Kiro verification showed Slash-visible skills from the current workspace only, with no ancestor `.kiro/skills` inheritance
- [x] Implement/extend automated tests

## OpenCode

Support assumption: full Agent Skills support. BMAD currently splits output between `.opencode/agents` and `.opencode/commands`; target should consolidate to `.opencode/skills`.

- [x] Confirm OpenCode native skills path and compatibility loading from `.claude/skills` and `.agents/skills` in OpenCode docs and with local `opencode run` repros
- [x] Implement installer migration from multi-target legacy output to single native skills target
- [x] Add legacy cleanup for `.opencode/agents`, `.opencode/commands`, `.opencode/agent`, and `.opencode/command`
- [x] Test fresh install
- [x] Test reinstall/upgrade from split legacy output
- [x] Confirm ancestor conflict protection is required because local `opencode run` repros loaded both child-local `child-only` and ancestor `parent-only`, matching the docs that project-local skill discovery walks upward to the git worktree
- [x] Implement/extend automated tests
- [x] Commit

## Roo Code

Support assumption: full Agent Skills support. BMAD currently installs commands to `.roo/commands`; target should move to `.roo/skills` or the correct mode-aware skill directories.

**Install:** VS Code extension `RooVeterinaryInc.roo-cline` — search "Roo Code" in Extensions or `code --install-extension RooVeterinaryInc.roo-cline`

- [x] Confirm Roo native skills path is `.roo/skills/{skill-name}/SKILL.md` with `name` frontmatter matching directory exactly (lowercase, alphanumeric + hyphens only)
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.roo/commands`
- [x] Test fresh install — 43 skills installed, verified in Roo Code v3.51
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm no ancestor conflict protection is needed because manual Roo Code v3.51 verification showed child-local `child-only` skill loaded while parent-only skill was not inherited
- [x] Implement/extend automated tests — 7 assertions in test suite 13
- [x] Commit

## Trae

Support assumption: full Agent Skills support. [Trae docs](https://docs.trae.ai/ide/skills) confirm workspace skills at `.trae/skills/<skill-name>/SKILL.md`. BMAD has now migrated from `.trae/rules` to `.trae/skills`.

**Install:** Download [standalone IDE](https://www.trae.ai/download) (macOS/Windows/Linux) or `winget install -e --id ByteDance.Trae`

- [x] Confirm Trae native skills path is `.trae/skills/{skill-name}/SKILL.md` — per official docs
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.trae/rules`
- [x] Test fresh install — 43 skills installed to `.trae/skills/`
- [x] Test reinstall/upgrade from legacy rules output
- [x] Confirm no ancestor conflict protection is needed — Trae docs describe project-local `.trae/skills/` only
- [ ] **NEEDS MANUAL IDE VERIFICATION** — download Trae IDE and confirm skills appear in UI
- [x] Implement/extend automated tests — 9 assertions in test suite 21
- [x] Commit

## GitHub Copilot

Support assumption: full Agent Skills support. BMAD currently uses a custom installer that generates `.github/agents`, `.github/prompts`, and `.github/copilot-instructions.md`; target should move to `.github/skills`.

**Install:** VS Code extension `GitHub.copilot` — search "GitHub Copilot" in Extensions or `code --install-extension GitHub.copilot`

- [x] Confirm GitHub Copilot native skills path is `.github/skills/{skill-name}/SKILL.md` — also reads `.claude/skills/` automatically
- [x] Design the migration away from the custom prompt/agent installer model — replaced 699-line custom installer with config-driven `skill_format: true`
- [x] Implement native skills output, ideally with shared config-driven code where practical
- [x] Add legacy cleanup for `.github/agents`, `.github/prompts`, and BMAD markers in `copilot-instructions.md`
- [x] Test fresh install — 43 skills installed to `.github/skills/`
- [x] Test reinstall/upgrade from legacy custom installer output — legacy dirs removed, BMAD markers stripped, user content preserved
- [x] Confirm no ancestor conflict protection is needed because manual Copilot verification showed child-local `child-only` skill loaded while parent-only skill was not inherited
- [x] Implement/extend automated tests — 11 assertions in test suite 17 including marker cleanup
- [x] Commit

## KiloCoder

**Install:** VS Code extension `kilocode.kilo-code` — search "Kilo Code" in Extensions or `code --install-extension kilocode.kilo-code`

- [x] Confirm KiloCoder native skills path — `.kilocode/skills`
- [x] Legacy cleanup for `.kilocode/workflows` and `.kilocodemodes`
- [x] Automated tests — suite 22 (config, IDE picker, install, skill output, legacy cleanup, reinstall)
- [x] Commit

## Gemini CLI

Support assumption: full Agent Skills support. Gemini CLI docs confirm workspace skills at `.gemini/skills/` and user skills at `~/.gemini/skills/`. Also discovers `.agents/skills/` as an alias. BMAD previously installed TOML files to `.gemini/commands`.

**Install:** `npm install -g @google/gemini-cli` or see [geminicli.com](https://geminicli.com)

- [x] Confirm Gemini CLI native skills path is `.gemini/skills/{skill-name}/SKILL.md` (per [geminicli.com/docs/cli/skills](https://geminicli.com/docs/cli/skills/))
- [x] Implement native skills output — target_dir `.gemini/skills`, skill_format true, template_type default (replaces TOML templates)
- [x] Add legacy cleanup for `.gemini/commands` (via `legacy_targets`)
- [x] Test fresh install — skills written to `.gemini/skills/bmad-master/SKILL.md` with correct frontmatter
- [x] Test reinstall/upgrade from legacy TOML command output — legacy dir removed, skills installed
- [x] Confirm no ancestor conflict protection is needed — Gemini CLI uses workspace > user > extension precedence, no ancestor directory inheritance
- [x] Implement/extend automated tests — 9 assertions in test suite 23 (config, fresh install, legacy cleanup, reinstall)
- [x] Manual CLI verification — `gemini` lists all 10 skills and successfully triggers bmad-help
- [ ] Commit

## iFlow

Support assumption: full Agent Skills support. iFlow docs confirm workspace skills at `.iflow/skills/` and global skills at `~/.iflow/skills/`. BMAD previously installed flat files to `.iflow/commands`.

- [x] Confirm iFlow native skills path is `.iflow/skills/{skill-name}/SKILL.md`
- [x] Implement native skills output — target_dir `.iflow/skills`, skill_format true, template_type default
- [x] Add legacy cleanup for `.iflow/commands` (via `legacy_targets`)
- [x] Test fresh install — skills written to `.iflow/skills/bmad-master/SKILL.md`
- [x] Test legacy cleanup — legacy commands dir removed
- [x] Implement/extend automated tests — 6 assertions in test suite 24
- [ ] **NEEDS MANUAL IDE VERIFICATION** — install iFlow and confirm skills appear in UI and can be triggered
- [ ] Commit

## QwenCoder

Support assumption: full Agent Skills support. Qwen Code supports workspace skills at `.qwen/skills/` and global skills at `~/.qwen/skills/`. BMAD previously installed flat files to `.qwen/commands`.

- [x] Confirm QwenCoder native skills path is `.qwen/skills/{skill-name}/SKILL.md`
- [x] Implement native skills output — target_dir `.qwen/skills`, skill_format true, template_type default
- [x] Add legacy cleanup for `.qwen/commands` (via `legacy_targets`)
- [x] Test fresh install — skills written to `.qwen/skills/bmad-master/SKILL.md`
- [x] Test legacy cleanup — legacy commands dir removed
- [x] Implement/extend automated tests — 6 assertions in test suite 25
- [ ] **NEEDS MANUAL IDE VERIFICATION** — install QwenCoder and confirm skills appear in UI and can be triggered
- [ ] Commit

## Rovo Dev

Support assumption: full Agent Skills support. Rovo Dev now supports workspace skills at `.rovodev/skills/` and user skills at `~/.rovodev/skills/`. BMAD previously used a custom 257-line installer that wrote `.rovodev/workflows/` and `prompts.yml`.

- [x] Confirm Rovo Dev native skills path is `.rovodev/skills/{skill-name}/SKILL.md` (per Atlassian blog)
- [x] Replace 257-line custom `rovodev.js` with config-driven entry in `platform-codes.yaml`
- [x] Add legacy cleanup for `.rovodev/workflows` (via `legacy_targets`) and BMAD entries in `prompts.yml` (via `cleanupRovoDevPrompts()` in `_config-driven.js`)
- [x] Test fresh install — skills written to `.rovodev/skills/bmad-master/SKILL.md`
- [x] Test legacy cleanup — legacy workflows dir removed, `prompts.yml` BMAD entries stripped while preserving user entries
- [x] Implement/extend automated tests — 8 assertions in test suite 26
- [ ] **NEEDS MANUAL IDE VERIFICATION** — install Rovo Dev and confirm skills appear in UI and can be triggered
- [ ] Commit

## Summary Gates

- [x] All full-support BMAD platforms install `SKILL.md` directory-based output
- [x] No full-support platform still emits BMAD command/workflow/rule files as its primary install format
- [x] Legacy cleanup paths are defined for every migrated platform
- [x] Automated coverage exists for config-driven and custom-installer migrations
- [ ] Installer docs and migration notes updated after code changes land
