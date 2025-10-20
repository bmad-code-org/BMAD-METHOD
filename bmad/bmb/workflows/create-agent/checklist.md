# Build Agent Validation Checklist (YAML Agents)

## Agent Structure Validation

### YAML Structure

- [ ] YAML parses without errors
- [ ] `agent.metadata` includes: `id`, `name`, `title`, `icon`, `module`
- [ ] `agent.persona` exists with role, identity, communication_style, and principles
- [ ] `agent.menu` exists with at least one item

### Core Components

- [ ] `metadata.id` points to final compiled path: `bmad/{{module}}/agents/{{agent}}.md`
- [ ] `metadata.module` matches the module folder (e.g., `bmm`, `bmb`, `cis`)
- [ ] Principles are an array (preferred) or string with clear values

## Persona Completeness

- [ ] Role clearly defines primary expertise area (1–2 lines)
- [ ] Identity includes relevant background and strengths (3–5 lines)
- [ ] Communication style gives concrete guidance (3–5 lines)
- [ ] Principles present and meaningful (no placeholders)

## Menu Validation

- [ ] Triggers do not start with `*` (auto-prefixed during build)
- [ ] Each item has a `description`
- [ ] Handlers use valid attributes (`workflow`, `exec`, `tmpl`, `data`, `action`)
- [ ] Paths use `{project-root}` or valid variables
- [ ] No duplicate triggers

## Optional Sections

- [ ] `prompts` defined when using `action: "#id"`
- [ ] `critical_actions` present if custom activation steps are needed
- [ ] Customize file (if created) located at `{project-root}/bmad/_cfg/agents/{{module}}-{{agent}}.customize.yaml`

## Build Verification

- [ ] Run compile to build `.md`: `npm run install:bmad` → "Compile Agents" (or `bmad install` → Compile)
- [ ] Confirm compiled file exists at `{project-root}/bmad/{{module}}/agents/{{agent}}.md`

## Final Quality

- [ ] Filename is kebab-case and ends with `.agent.yaml`
- [ ] Output location correctly placed in module or standalone directory
- [ ] Agent purpose and commands are clear and consistent

## Issues Found

### Critical Issues

<!-- List any issues that MUST be fixed before agent can function -->

### Warnings

<!-- List any issues that should be addressed but won't break functionality -->

### Improvements

<!-- List any optional enhancements that could improve the agent -->
