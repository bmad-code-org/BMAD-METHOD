# Native Skills Migration Checklist

Branch: `refactor/all-is-skills`

Scope: migrate the BMAD-supported platforms that fully support the Agent Skills standard from legacy installer outputs to native skills output.

Current branch status:

- `Claude Code` has already been moved to `.claude/skills`
- `Codex CLI` has already been moved to `.agents/skills`

This checklist now includes those completed platforms plus the remaining full-support platforms.

## Claude Code

Support assumption: full Agent Skills support. BMAD has already migrated from `.claude/commands` to `.claude/skills`.

- [ ] Confirm current implementation still matches Claude Code skills expectations
- [ ] Confirm legacy cleanup for `.claude/commands`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy command output
- [ ] Confirm ancestor conflict protection
- [ ] Implement/extend automated tests as needed
- [ ] Commit any follow-up fixes if required

## Codex CLI

Support assumption: full Agent Skills support. BMAD has already migrated from `.codex/prompts` to `.agents/skills`.

- [ ] Confirm current implementation still matches Codex CLI skills expectations
- [ ] Confirm legacy cleanup for project and global `.codex/prompts`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy prompt output
- [x] Confirm ancestor conflict protection because Codex inherits parent-directory `.agents/skills`
- [ ] Implement/extend automated tests as needed
- [ ] Commit any follow-up fixes if required

## Cursor

Support assumption: full Agent Skills support. BMAD currently installs legacy command files to `.cursor/commands`; target should move to a native skills directory.

- [x] Confirm current Cursor skills path and that BMAD should target `.cursor/skills`
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.cursor/commands`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm no ancestor conflict protection is needed because a child workspace surfaced child `.cursor/skills` entries but not a parent-only skill during manual verification
- [ ] Implement/extend automated tests
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
- [x] Commit

## Cline

Support assumption: full Agent Skills support. BMAD currently installs workflow files to `.clinerules/workflows`; target should move to the platform's native skills directory.

- [ ] Confirm current Cline skills path and whether `.cline/skills` is the correct BMAD target
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.clinerules/workflows`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy workflow output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## Google Antigravity

Support assumption: full Agent Skills support. Antigravity docs confirm workspace skills at `.agent/skills/<skill-folder>/` and global skills at `~/.gemini/antigravity/skills/<skill-folder>/`. BMAD has now migrated from `.agent/workflows` to `.agent/skills`.

- [x] Confirm Antigravity native skills path and project/global precedence
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.agent/workflows`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy workflow output
- [x] Confirm no ancestor conflict protection is needed because manual Antigravity verification in `/tmp/antigravity-ancestor-repro/parent/child` showed only the child-local `child-only` skill, with no inherited parent `.agent/skills` entry
- [x] Implement/extend automated tests
- [x] Commit

## Auggie

Support assumption: full Agent Skills support. BMAD currently installs commands to `.augment/commands`; target should move to `.augment/skills`.

- [x] Confirm Auggie native skills path and compatibility loading from `.claude/skills` and `.agents/skills` via Augment docs plus local `auggie --print` repros
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.augment/commands`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy command output
- [x] Confirm no ancestor conflict protection is needed because local `auggie --workspace-root` repro showed child-local `.augment/skills` loading `child-only` but not parent `parent-only`
- [x] Implement/extend automated tests
- [ ] Commit

## CodeBuddy

Support assumption: full Agent Skills support. BMAD currently installs commands to `.codebuddy/commands`; target should move to `.codebuddy/skills`.

- [ ] Confirm CodeBuddy native skills path and any naming/frontmatter requirements
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.codebuddy/commands`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy command output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## Crush

Support assumption: full Agent Skills support. BMAD currently installs commands to `.crush/commands`; target should move to the platform's native skills location.

- [ ] Confirm Crush project-local versus global skills path and BMAD's preferred install target
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.crush/commands`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy command output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## Kiro

Support assumption: full Agent Skills support. Kiro docs confirm project skills at `.kiro/skills/<skill-name>/SKILL.md` and describe steering as a separate rules mechanism, not a required compatibility layer. BMAD has now migrated from `.kiro/steering` to `.kiro/skills`. Manual app verification also confirmed that Kiro can surface skills in Slash when the relevant UI setting is enabled, and that it does not inherit ancestor `.kiro/skills` directories.

- [x] Confirm Kiro skills path and verify BMAD should stop writing steering artifacts for this migration
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.kiro/steering`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy steering output
- [x] Confirm no ancestor conflict protection is needed because manual Kiro verification showed Slash-visible skills from the current workspace only, with no ancestor `.kiro/skills` inheritance
- [x] Implement/extend automated tests
- [x] Commit

## OpenCode

Support assumption: full Agent Skills support. BMAD currently splits output between `.opencode/agents` and `.opencode/commands`; target should consolidate to `.opencode/skills`.

- [x] Confirm OpenCode native skills path and compatibility loading from `.claude/skills` and `.agents/skills` in OpenCode docs and with local `opencode run` repros
- [x] Implement installer migration from multi-target legacy output to single native skills target
- [x] Add legacy cleanup for `.opencode/agents`, `.opencode/commands`, `.opencode/agent`, and `.opencode/command`
- [x] Test fresh install
- [x] Test reinstall/upgrade from split legacy output
- [x] Confirm ancestor conflict protection is required because local `opencode run` repros loaded both child-local `child-only` and ancestor `parent-only`, matching the docs that project-local skill discovery walks upward to the git worktree
- [x] Implement/extend automated tests
- [ ] Commit

## Roo Code

Support assumption: full Agent Skills support. BMAD currently installs commands to `.roo/commands`; target should move to `.roo/skills` or the correct mode-aware skill directories.

- [ ] Confirm Roo native skills path and whether BMAD should use generic or mode-specific skill directories
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.roo/commands`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy command output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## Trae

Support assumption: full Agent Skills support. BMAD currently installs rule files to `.trae/rules`; target should move to the platform's native skills directory.

- [ ] Confirm Trae native skills path and whether the current `.trae/rules` path is still required for compatibility
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.trae/rules`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy rules output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## GitHub Copilot

Support assumption: full Agent Skills support. BMAD currently uses a custom installer that generates `.github/agents`, `.github/prompts`, and `.github/copilot-instructions.md`; target should move to `.github/skills`.

- [ ] Confirm GitHub Copilot native skills path and whether `.github/agents` remains necessary as a compatibility layer
- [ ] Design the migration away from the custom prompt/agent installer model
- [ ] Implement native skills output, ideally with shared config-driven code where practical
- [ ] Add legacy cleanup for `.github/agents`, `.github/prompts`, and any BMAD-owned Copilot instruction file behavior that should be retired
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy custom installer output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## KiloCoder

Support assumption: full Agent Skills support. BMAD currently uses a custom installer that writes `.kilocodemodes` and `.kilocode/workflows`; target should move to native skills output.

- [ ] Confirm KiloCoder native skills path and whether `.kilocodemodes` should be removed entirely or retained temporarily for compatibility
- [ ] Design the migration away from modes plus workflow markdown
- [ ] Implement native skills output
- [ ] Add legacy cleanup for `.kilocode/workflows` and BMAD-owned entries in `.kilocodemodes`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy custom installer output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## Summary Gates

- [ ] All full-support BMAD platforms install `SKILL.md` directory-based output
- [ ] No full-support platform still emits BMAD command/workflow/rule files as its primary install format
- [ ] Legacy cleanup paths are defined for every migrated platform
- [ ] Automated coverage exists for config-driven and custom-installer migrations
- [ ] Installer docs and migration notes updated after code changes land
