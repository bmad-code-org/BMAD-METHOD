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
- [ ] Commit

## Windsurf

Support assumption: full Agent Skills support. Windsurf docs confirm workspace skills at `.windsurf/skills` and global skills at `~/.codeium/windsurf/skills`. BMAD has now migrated from `.windsurf/workflows` to `.windsurf/skills`. Manual verification also confirmed that Windsurf custom skills are triggered via `@skill-name`, not slash commands.

- [x] Confirm Windsurf native skills directory as `.windsurf/skills`
- [x] Implement installer migration to native skills output
- [x] Add legacy cleanup for `.windsurf/workflows`
- [x] Test fresh install
- [x] Test reinstall/upgrade from legacy workflow output
- [x] Confirm no ancestor conflict protection is needed because manual Windsurf verification showed child-local `@` skills loaded while a parent-only skill was not inherited
- [x] Implement/extend automated tests
- [ ] Commit

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

Support assumption: full Agent Skills support. BMAD currently installs workflows to `.agent/workflows`; target should move to `.agent/skills`.

- [ ] Confirm Antigravity native skills path and project/global precedence
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.agent/workflows`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy workflow output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## Auggie

Support assumption: full Agent Skills support. BMAD currently installs commands to `.augment/commands`; target should move to `.augment/skills`.

- [ ] Confirm Auggie native skills path and whether it also reads `.claude/skills` or `.agents/skills`
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.augment/commands`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy command output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
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

Support assumption: full Agent Skills support. BMAD currently installs steering files to `.kiro/steering`; target should move to `.kiro/skills`.

- [ ] Confirm Kiro skills path and verify BMAD should stop writing steering artifacts for this migration
- [ ] Implement installer migration to native skills output
- [ ] Add legacy cleanup for `.kiro/steering`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from legacy steering output
- [ ] Confirm ancestor conflict protection where applicable
- [ ] Implement/extend automated tests
- [ ] Commit

## OpenCode

Support assumption: full Agent Skills support. BMAD currently splits output between `.opencode/agents` and `.opencode/commands`; target should consolidate to `.opencode/skills`.

- [ ] Confirm OpenCode native skills path and whether `.claude/skills` or `.agents/skills` compatibility matters
- [ ] Implement installer migration from multi-target legacy output to single native skills target
- [ ] Add legacy cleanup for `.opencode/agents`, `.opencode/commands`, `.opencode/agent`, and `.opencode/command`
- [ ] Test fresh install
- [ ] Test reinstall/upgrade from split legacy output
- [ ] Confirm ancestor conflict protection if OpenCode inherits parent-directory skills
- [ ] Implement/extend automated tests
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
