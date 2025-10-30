# YAML Schema Classification (src/)

- Total YAML files: 94
- Distinct schema families: 12
- Scope: all `*.yaml` files under `src/`

## Schema Families

1. **Agent Definition** – full agent metadata/persona/menu definitions.  
   Files (17):  
   `src/modules/cis/agents/storyteller.agent.yaml`  
   `src/modules/cis/agents/brainstorming-coach.agent.yaml`  
   `src/modules/cis/agents/design-thinking-coach.agent.yaml`  
   `src/modules/cis/agents/creative-problem-solver.agent.yaml`  
   `src/modules/cis/agents/innovation-strategist.agent.yaml`  
   `src/modules/bmb/agents/bmad-builder.agent.yaml`  
   `src/core/agents/bmad-master.agent.yaml`  
   `src/modules/bmm/agents/analyst.agent.yaml`  
   `src/modules/bmm/agents/pm.agent.yaml`  
   `src/modules/bmm/agents/architect.agent.yaml`  
   `src/modules/bmm/agents/dev.agent.yaml`  
   `src/modules/bmm/agents/tea.agent.yaml`  
   `src/modules/bmm/agents/game-dev.agent.yaml`  
   `src/modules/bmm/agents/sm.agent.yaml`  
   `src/modules/bmm/agents/game-architect.agent.yaml`  
   `src/modules/bmm/agents/ux-expert.agent.yaml`  
   `src/modules/bmm/agents/game-designer.agent.yaml`

   Schema (deduced):

   ```yaml
   AgentDefinition :=  # entire YAML document
     agent: Agent

   Agent :=              # core object
    metadata: Metadata
    persona: Persona
    critical_actions?: Sequence<NonEmptyString>  # optional imperative safeguards
    menu: Sequence<MenuItem>                     # at least one activation entry required
    prompts?: Sequence<Prompt> | []              # optional; empty list allowed

   Metadata :=           # descriptive identity
     id: String                  # canonical doc path, typically module/.../.md
     name: String
     title: String
     icon: String                # emoji or text glyph
     module?: String             # required for module-scoped agents; optional for core agents

   Persona :=            # behavioural definition
     role: String
     identity: String
     communication_style: String
     principles: Sequence<NonEmptyString>  # each item is a full-sentence doctrine

   MenuItem :=           # activation command
     trigger: String                       # kebab-case; optional leading '*' for built-ins, uniqueness enforced per agent ignoring '*'
     description: String
     # one or more of the following command targets must be present:
     workflow?: String                     # path to workflow.yaml
     validate-workflow?: String            # path to workflow.yaml that owns the checklist
     exec?: String                         # path to XML task
     action?: String                       # plain-text imperative
     tmpl?: String                         # template identifier (supported but unused here)
     data?: String                         # supplemental payload path
     run-workflow?: String                 # runtime workflow alias (supported but unused here)
   ```

Prompt := # (rare in current agents)
id: String
content: MultiLineString # rendered verbatim inside CDATA
description?: String # optional (ignored by tooling, serves as a file comment for maintainers)

````

## Validation

Agent definition YAMLs are validated against the schema using the automated validator:

```bash
# Validate all YAML schemas
npm run validate:schemas
```

The validator enforces:

- **Metadata completeness**: `id`, `name`, `title`, `icon` are required; `module` field is required for module-scoped agents (under `src/modules/**/agents`) but optional for core agents (under `src/core/agents`).
- **Persona structure**: All four fields (`role`, `identity`, `communication_style`, `principles`) are required; `principles` must be an array of strings.
- **Menu integrity**: Every menu item must have a unique kebab-case `trigger` (no leading `*` allowed) and at least one command attribute (`workflow`, `validate-workflow`, `exec`, `action`, `tmpl`, `data`, `run-workflow`).
- **Prompts**: If present, each prompt requires `id` and `content`; optional `description` fields are allowed for maintainer comments.

The validator runs automatically in CI as part of the lint workflow (`.github/workflows/lint.yaml`).

2. **Agent Customization Overlay** – optional overlays for tailoring base agents.
   Files (1):
   `src/utility/templates/agent.customize.template.yaml`

3. **Team Bundle** – curated bundles of agents for quick activation.
   Files (3):
   `src/modules/cis/teams/creative-squad.yaml`
   `src/modules/bmm/teams/team-gamedev.yaml`
   `src/modules/bmm/teams/team-fullstack.yaml`

4. **Module Configuration** – module-level metadata and toggles.
   Files (2):
   `src/modules/bmm/config.yaml`
   `src/modules/bmm/sub-modules/claude-code/config.yaml`

5. **Installer Menu Config** – installer-driven prompts and options.
   Files (4):
   `src/modules/cis/_module-installer/install-menu-config.yaml`
   `src/modules/bmb/_module-installer/install-menu-config.yaml`
   `src/modules/bmm/_module-installer/install-menu-config.yaml`
   `src/core/_module-installer/install-menu-config.yaml`

6. **Module Installer Template** – scaffolding template for new module installers.
   Files (1):
   `src/modules/bmb/workflows/create-module/installer-templates/install-module-config.yaml`

7. **Workflow Definition** – primary workflow descriptors (standard, sub, and template forms).
   Files (49):
   `src/core/workflows/brainstorming/workflow.yaml`
   `src/core/workflows/party-mode/workflow.yaml`
   `src/modules/bmb/workflows/audit-workflow/workflow.yaml`
   `src/modules/bmb/workflows/convert-legacy/workflow.yaml`
   `src/modules/bmb/workflows/create-agent/workflow.yaml`
   `src/modules/bmb/workflows/create-module/workflow.yaml`
   `src/modules/bmb/workflows/create-workflow/workflow-template/workflow.yaml`
   `src/modules/bmb/workflows/create-workflow/workflow.yaml`
   `src/modules/bmb/workflows/edit-workflow/workflow.yaml`
   `src/modules/bmb/workflows/module-brief/workflow.yaml`
   `src/modules/bmb/workflows/redoc/workflow.yaml`
   `src/modules/cis/workflows/design-thinking/workflow.yaml`
   `src/modules/cis/workflows/innovation-strategy/workflow.yaml`
   `src/modules/cis/workflows/problem-solving/workflow.yaml`
   `src/modules/cis/workflows/storytelling/workflow.yaml`
   `src/modules/bmm/workflows/1-analysis/brainstorm-game/workflow.yaml`
   `src/modules/bmm/workflows/1-analysis/brainstorm-project/workflow.yaml`
   `src/modules/bmm/workflows/1-analysis/document-project/workflow.yaml`
   `src/modules/bmm/workflows/1-analysis/document-project/workflows/deep-dive.yaml`
   `src/modules/bmm/workflows/1-analysis/document-project/workflows/full-scan.yaml`
   `src/modules/bmm/workflows/1-analysis/game-brief/workflow.yaml`
   `src/modules/bmm/workflows/1-analysis/product-brief/workflow.yaml`
   `src/modules/bmm/workflows/1-analysis/research/workflow.yaml`
   `src/modules/bmm/workflows/2-plan-workflows/gdd/workflow.yaml`
   `src/modules/bmm/workflows/2-plan-workflows/narrative/workflow.yaml`
   `src/modules/bmm/workflows/2-plan-workflows/prd/workflow.yaml`
   `src/modules/bmm/workflows/2-plan-workflows/tech-spec/workflow.yaml`
   `src/modules/bmm/workflows/2-plan-workflows/ux/workflow.yaml`
   `src/modules/bmm/workflows/3-solutioning/implementation-ready-check/workflow.yaml`
   `src/modules/bmm/workflows/3-solutioning/tech-spec/workflow.yaml`
   `src/modules/bmm/workflows/3-solutioning/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/correct-course/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/create-story/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/dev-story/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/review-story/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/retrospective/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/story-approved/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/story-context/workflow.yaml`
   `src/modules/bmm/workflows/4-implementation/story-ready/workflow.yaml`
   `src/modules/bmm/workflows/testarch/atdd/workflow.yaml`
   `src/modules/bmm/workflows/testarch/automate/workflow.yaml`
   `src/modules/bmm/workflows/testarch/ci/workflow.yaml`
   `src/modules/bmm/workflows/testarch/framework/workflow.yaml`
   `src/modules/bmm/workflows/testarch/nfr-assess/workflow.yaml`
   `src/modules/bmm/workflows/testarch/test-design/workflow.yaml`
   `src/modules/bmm/workflows/testarch/test-review/workflow.yaml`
   `src/modules/bmm/workflows/testarch/trace/workflow.yaml`
   `src/modules/bmm/workflows/workflow-status/init/workflow.yaml`
   `src/modules/bmm/workflows/workflow-status/workflow.yaml`

8. **Workflow Status Path** – path/phase breakdowns for workflow-status routing.
   Files (11):
   `src/modules/bmm/workflows/workflow-status/paths/brownfield-level-0.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/brownfield-level-1.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/brownfield-level-2.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/brownfield-level-3.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/brownfield-level-4.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/game-design.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/greenfield-level-0.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/greenfield-level-1.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/greenfield-level-2.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/greenfield-level-3.yaml`
   `src/modules/bmm/workflows/workflow-status/paths/greenfield-level-4.yaml`

9. **Workflow Status Reference** – shared metadata for project level detection.
   Files (1):
   `src/modules/bmm/workflows/workflow-status/project-levels.yaml`

10. **Workflow Validation Criteria** – structured rule sets for readiness checks.
    Files (1):
    `src/modules/bmm/workflows/3-solutioning/implementation-ready-check/validation-criteria.yaml`

11. **Claude Code Integration** – content/subagent injection configurations.
    Files (2):
    `src/modules/bmm/sub-modules/claude-code/injections.yaml`
    `src/modules/bmm/workflows/1-analysis/research/claude-code/injections.yaml`

12. **CI Pipeline Template** – exported CI/CD pipeline blueprints.
    Files (2):
    `src/modules/bmm/workflows/testarch/ci/github-actions-template.yaml`
    `src/modules/bmm/workflows/testarch/ci/gitlab-ci-template.yaml`

## Conversion Notes

- Agent definition YAMLs are converted into XML markdown artifacts via `YamlXmlBuilder` (`tools/cli/lib/yaml-xml-builder.js:1`) and its wrapper `XmlHandler` (`tools/cli/lib/xml-handler.js:39`), invoked by CLI commands like `build` and the web bundler (`tools/cli/bundlers/web-bundler.js:150`).
- All other schema families stay YAML end-to-end; when bundled they are only wrapped as CDATA in `<file type="yaml">` elements without structural transformation (`tools/cli/bundlers/web-bundler.js:962`).

## Next Steps (for future work)

- Prioritize schema formalization (likely start with Agent Definition and Workflow Definition).
- Define validation rules per schema family once ready to proceed.

```

```
````
