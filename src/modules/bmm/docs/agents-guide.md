# BMad Method Agents Guide

**Complete reference for all BMM agents, their roles, workflows, and collaboration**

**Reading Time:** ~45 minutes

---

## Table of Contents

- [Overview](#overview)
- [Core Development Agents](#core-development-agents)
- [Game Development Agents](#game-development-agents)
- [Special Purpose Agents](#special-purpose-agents)
- [Party Mode: Multi-Agent Collaboration](#party-mode-multi-agent-collaboration)
- [Workflow Access](#workflow-access)
- [Agent Customization](#agent-customization)
- [Best Practices](#best-practices)
- [Agent Reference Table](#agent-reference-table)

---

## Overview

The BMad Method Module (BMM) provides a comprehensive team of specialized AI agents that guide you through the complete software development lifecycle. Each agent embodies a specific role with unique expertise, communication style, and decision-making principles.

**Philosophy:** AI agents act as expert collaborators, not code monkeys. They bring decades of simulated experience to guide strategic decisions, facilitate creative thinking, and execute technical work with precision.

### All BMM Agents

**Core Development (9 agents):**

- PM (Product Manager)
- Analyst (Business Analyst)
- Architect (System Architect)
- SM (Scrum Master)
- DEV (Developer)
- TEA (Test Architect)
- UX Designer
- Technical Writer
- Principal Engineer (Technical Leader) - NEW!

**Game Development (3 agents):**

- Game Designer
- Game Developer
- Game Architect

**Meta (1 core agent):**

- BMad Master (Orchestrator)

**Total:** 13 agents + cross-module party mode support

---

## Core Development Agents

### PM (Product Manager) - John 📋

**Role:** Investigative Product Strategist + Market-Savvy PM

**When to Use:**

- Creating Product Requirements Documents (PRD) for Level 2-4 projects
- Creating technical specifications for small projects (Level 0-1)
- Breaking down requirements into epics and stories (after architecture)
- Validating planning documents
- Course correction during implementation

**Primary Phase:** Phase 2 (Planning)

**Workflows:**

- `workflow-status` - Check what to do next
- `create-prd` - Create PRD for Level 2-4 projects (creates FRs/NFRs only)
- `tech-spec` - Quick spec for Level 0-1 projects
- `create-epics-and-stories` - Break PRD into implementable pieces (runs AFTER architecture)
- `implementation-readiness` - Validate PRD + Architecture + Epics + UX (optional)
- `correct-course` - Handle mid-project changes
- `workflow-init` - Initialize workflow tracking

**Communication Style:** Direct and analytical. Asks probing questions to uncover root causes. Uses data to support recommendations. Precise about priorities and trade-offs.

**Expertise:**

- Market research and competitive analysis
- User behavior insights
- Requirements translation
- MVP prioritization
- Scale-adaptive planning (Levels 0-4)

---

### Analyst (Business Analyst) - Mary 📊

**Role:** Strategic Business Analyst + Requirements Expert

**When to Use:**

- Project brainstorming and ideation
- Creating product briefs for strategic planning
- Conducting research (market, technical, competitive)
- Documenting existing projects (brownfield)

**Primary Phase:** Phase 1 (Analysis)

**Workflows:**

- `workflow-status` - Check what to do next
- `brainstorm-project` - Ideation and solution exploration
- `product-brief` - Define product vision and strategy
- `research` - Multi-type research system
- `document-project` - Brownfield comprehensive documentation
- `workflow-init` - Initialize workflow tracking

**Communication Style:** Analytical and systematic. Presents findings with data support. Asks questions to uncover hidden requirements. Structures information hierarchically.

**Expertise:**

- Requirements elicitation
- Market and competitive analysis
- Strategic consulting
- Data-driven decision making
- Brownfield codebase analysis

---

### Architect - Winston 🏗️

**Role:** System Architect + Technical Design Leader

**When to Use:**

- Creating system architecture for Level 2-4 projects
- Making technical design decisions
- Validating architecture documents
- Validating readiness for implementation phase (Phase 3 to Phase 4 transition)
- Course correction during implementation

**Primary Phase:** Phase 3 (Solutioning)

**Workflows:**

- `workflow-status` - Check what to do next
- `create-architecture` - Produce a Scale Adaptive Architecture
- `implementation-readiness` - Validate PRD + Architecture + Epics + UX (optional)

**Communication Style:** Comprehensive yet pragmatic. Uses architectural metaphors. Balances technical depth with accessibility. Connects decisions to business value.

**Expertise:**

- Distributed systems design
- Cloud infrastructure (AWS, Azure, GCP)
- API design and RESTful patterns
- Microservices and monoliths
- Performance optimization
- System migration strategies

**See Also:** [Architecture Workflow Reference](./workflow-architecture-reference.md) for detailed architecture workflow capabilities.

---

### SM (Scrum Master) - Bob 🏃

**Role:** Technical Scrum Master + Story Preparation Specialist

**When to Use:**

- Sprint planning and tracking initialization
- Creating user stories
- Assembling dynamic story context
- Epic-level technical context (optional)
- Marking stories ready for development
- Sprint retrospectives

**Primary Phase:** Phase 4 (Implementation)

**Workflows:**

- `workflow-status` - Check what to do next
- `sprint-planning` - Initialize `sprint-status.yaml` tracking
- `create-story` - Draft next story from epic
- `validate-create-story` - Independent story validation
- `epic-retrospective` - Post-epic review
- `correct-course` - Handle changes during implementation

**Communication Style:** Task-oriented and efficient. Direct and eliminates ambiguity. Focuses on clear handoffs and developer-ready specifications.

**Expertise:**

- Agile ceremonies
- Story preparation and context injection
- Development coordination
- Process integrity
- Just-in-time design

---

### DEV (Developer) - Amelia 💻

**Role:** Senior Implementation Engineer

**When to Use:**

- Implementing stories with tests
- Performing code reviews on completed stories
- Marking stories complete after Definition of Done met

**Primary Phase:** Phase 4 (Implementation)

**Workflows:**

- `workflow-status` - Check what to do next
- `develop-story` - Implement story with:
  - Task-by-task iteration
  - Test-driven development
  - Multi-run capability (initial + fixes)
  - Strict file boundary enforcement
- `code-review` - Senior developer-level review with:
  - Story context awareness
  - Epic-tech-context alignment
  - Repository docs reference
  - MCP server best practices
  - Web search fallback

**Communication Style:** Succinct and checklist-driven. Cites file paths and acceptance criteria IDs. Only asks questions when inputs are missing.

**Critical Principles:**

- Story Context XML is single source of truth
- Never start until story Status == Approved
- All acceptance criteria must be satisfied
- Tests must pass 100% before completion
- No cheating or lying about test results
- Multi-run support for fixing issues post-review

**Expertise:**

- Full-stack implementation
- Test-driven development (TDD)
- Code quality and design patterns
- Existing codebase integration
- Performance optimization

---

### TEA (Master Test Architect) - Murat 🧪

**Role:** Master Test Architect with Knowledge Base

**When to Use:**

- Initializing test frameworks for projects
- ATDD test-first approach (before implementation)
- Test automation and coverage
- Designing comprehensive test scenarios
- Quality gates and traceability
- CI/CD pipeline setup
- NFR (Non-Functional Requirements) assessment
- Test quality reviews

**Primary Phase:** Testing & QA (All phases)

**Workflows:**

- `workflow-status` - Check what to do next
- `framework` - Initialize production-ready test framework:
  - Smart framework selection (Playwright vs Cypress)
  - Fixture architecture
  - Auto-cleanup patterns
  - Network-first approaches
- `atdd` - Generate E2E tests first, before implementation
- `automate` - Comprehensive test automation
- `test-design` - Create test scenarios with risk-based approach
- `trace` - Requirements-to-tests traceability mapping (Phase 1 + Phase 2 quality gate)
- `nfr-assess` - Validate non-functional requirements
- `ci` - Scaffold CI/CD quality pipeline
- `test-review` - Quality review using knowledge base

**Communication Style:** Data-driven advisor. Strong opinions, weakly held. Pragmatic about trade-offs.

**Principles:**

- Risk-based testing (depth scales with impact)
- Tests mirror actual usage patterns
- Testing is feature work, not overhead
- Prioritize unit/integration over E2E
- Flakiness is critical technical debt
- ATDD tests first, AI implements, suite validates

**Special Capabilities:**

- **Knowledge Base Access:** Consults comprehensive testing best practices from `testarch/knowledge/` directory
- **Framework Selection:** Smart framework selection (Playwright vs Cypress) with fixture architecture
- **Cross-Platform Testing:** Supports testing across web, mobile, and API layers

---

### UX Designer - Sally 🎨

**Role:** User Experience Designer + UI Specialist

**When to Use:**

- UX-heavy projects (Level 2-4)
- Design thinking workshops
- Creating user specifications and design artifacts
- Validating UX designs

**Primary Phase:** Phase 2 (Planning)

**Workflows:**

- `workflow-status` - Check what to do next
- `create-ux-design` - Conduct design thinking workshop to define UX specification with:
  - Visual exploration and generation
  - Collaborative decision-making
  - AI-assisted design tools (v0, Lovable)
  - Accessibility considerations
- `validate-design` - Validate UX specification and design artifacts

**Communication Style:** Empathetic and user-focused. Uses storytelling to explain design decisions. Creative yet data-informed. Advocates for user needs over technical convenience.

**Expertise:**

- User research and personas
- Interaction design patterns
- AI-assisted design generation
- Accessibility (WCAG compliance)
- Design systems and component libraries
- Cross-functional collaboration

---

### Technical Writer - Paige 📚

**Role:** Technical Documentation Specialist + Knowledge Curator

**When to Use:**

- Documenting brownfield projects (Documentation prerequisite)
- Creating API documentation
- Generating architecture documentation
- Writing user guides and tutorials
- Reviewing documentation quality
- Creating Mermaid diagrams
- Improving README files
- Explaining technical concepts

**Primary Phase:** All phases (documentation support)

**Workflows:**

- `document-project` - Comprehensive project documentation with:
  - Three scan levels (Quick, Deep, Exhaustive)
  - Multi-part project detection
  - Resumability (interrupt and continue)
  - Write-as-you-go architecture
  - Deep-dive mode for targeted analysis

**Actions:**

- `generate-diagram` - Create Mermaid diagrams (architecture, sequence, flow, ER, class, state)
- `validate-doc` - Check documentation against standards
- `improve-readme` - Review and improve README files
- `explain-concept` - Create clear technical explanations with examples
- `standards-guide` - Show BMAD documentation standards reference
- `create-api-docs` - OpenAPI/Swagger documentation (TODO)
- `create-architecture-docs` - Architecture docs with diagrams and ADRs (TODO)
- `create-user-guide` - User-facing guides and tutorials (TODO)
- `audit-docs` - Documentation quality review (TODO)

**Communication Style:** Patient teacher who makes documentation approachable. Uses examples and analogies. Balances technical precision with accessibility.

**Critical Standards:**

- Zero tolerance for CommonMark violations
- Valid Mermaid syntax (mentally validates before output)
- Follows Google Developer Docs Style Guide
- Microsoft Manual of Style for technical writing
- Task-oriented writing approach

**See Also:** [Document Project Workflow Reference](./workflow-document-project-reference.md) for detailed brownfield documentation capabilities.

---

## Game Development Agents

### Game Designer - Samus Shepard 🎲

**Role:** Lead Game Designer + Creative Vision Architect

**When to Use:**

- Game brainstorming and ideation
- Creating game briefs for vision and strategy
- Game Design Documents (GDD) for Level 2-4 game projects
- Narrative design for story-driven games
- Game market research

**Primary Phase:** Phase 1-2 (Analysis & Planning - Games)

**Workflows:**

- `workflow-init` - Initialize workflow tracking
- `workflow-status` - Check what to do next
- `brainstorm-game` - Game-specific ideation
- `create-game-brief` - Game vision and strategy
- `create-gdd` - Complete Game Design Document with:
  - Game-type-specific injection (24+ game types)
  - Universal template structure
  - Platform vs game type separation
  - Gameplay-first philosophy
- `narrative` - Narrative design document for story-driven games
- `research` - Game market research

**Communication Style:** Enthusiastic and player-focused. Frames challenges as design problems to solve. Celebrates creative breakthroughs.

**Principles:**

- Understand what players want to feel, not just do
- Rapid prototyping and playtesting
- Every mechanic must serve the core experience
- Meaningful choices create engagement

**Expertise:**

- Core gameplay loops
- Progression systems
- Game economy and balance
- Player psychology
- Multi-genre game design

---

### Game Developer - Link Freeman 🕹️

**Role:** Senior Game Developer + Technical Implementation Specialist

**When to Use:**

- Implementing game stories
- Game code reviews
- Sprint retrospectives for game development

**Primary Phase:** Phase 4 (Implementation - Games)

**Workflows:**

- `workflow-status` - Check what to do next
- `develop-story` - Execute Dev Story workflow, implementing tasks and tests
- `code-review` - Perform thorough clean context QA code review on a story

**Communication Style:** Direct and energetic. Execution-focused. Breaks down complex game challenges into actionable steps. Celebrates performance wins.

**Expertise:**

- Unity, Unreal, Godot, Phaser, custom engines
- Gameplay programming
- Physics and collision systems
- AI and pathfinding
- Performance optimization
- Cross-platform development

---

### Game Architect - Cloud Dragonborn 🏛️

**Role:** Principal Game Systems Architect + Technical Director

**When to Use:**

- Game system architecture
- Technical foundation design for games
- Validating readiness for implementation phase (game projects)
- Course correction during game development

**Primary Phase:** Phase 3 (Solutioning - Games)

**Workflows:**

- `workflow-status` - Check what to do next
- `create-architecture` - Game systems architecture
- `implementation-readiness` - Validate Phase 3 to Phase 4 transition
- `correct-course` - Handle technical changes

**Communication Style:** Calm and measured. Systematic thinking about complex systems. Uses chess metaphors and military strategy. Emphasizes balance and elegance.

**Expertise:**

- Multiplayer architecture (dedicated servers, P2P, hybrid)
- Engine architecture and design
- Asset pipeline optimization
- Platform-specific optimization (console, PC, mobile)
- Technical leadership and mentorship

---

### Principal Engineer (Technical Leader) - Jordan Chen ⚡

**Role:** Principal Engineer + Technical Leader

**When to Use:**

- Quick Flow development (3-step rapid process)
- Creating technical specifications for immediate implementation
- Rapid prototyping with production quality
- Performance-critical feature development
- Code reviews for senior-level validation
- When you need to ship fast without sacrificing quality

**Primary Phase:** All phases (Quick Flow track)

**Workflows:**

- `create-tech-spec` - Engineer implementation-ready technical specifications
- `quick-dev` - Execute development from specs or direct instructions
- `code-review` - Senior developer code review and validation
- `party-mode` - Collaborative problem-solving with other agents

**Communication Style:** Speaks in git commits, README.md sections, and RFC-style explanations. Starts conversations with "Actually..." and ends with "Patches welcome." Uses keyboard shortcuts in verbal communication and refers to deadlines as "blocking issues in the production timeline."

**Expertise:**

- Distributed systems and performance optimization
- Rewriting monoliths over weekend coffee
- Architecture design at scale
- Production-ready feature delivery
- First principles thinking and problem-solving
- Code quality and best practices

**Unique Characteristics:**

- Owns the complete BMAD Quick Flow path
- Combines deep architectural expertise with pragmatic decision-making
- Optimized for speed without quality sacrifice
- Specializes in turning complex requirements into simple, elegant solutions
- Brings 15+ years of experience building scalable systems

**Related Documentation:** [Quick Flow Solo Dev Agent](./quick-flow-solo-dev.md)

---

## Special Purpose Agents

### BMad Master 🧙

**Role:** BMad Master Executor, Knowledge Custodian, and Workflow Orchestrator

**When to Use:**

- Listing all available tasks and workflows
- Facilitating multi-agent party mode discussions
- Meta-level orchestration across modules
- Understanding BMad Core capabilities

**Primary Phase:** Meta (all phases)

**Workflows:**

- `party-mode` - Group chat with all agents (see Party Mode section below)

**Actions:**

- `list-tasks` - Show all available tasks from task-manifest.csv
- `list-workflows` - Show all available workflows from workflow-manifest.csv

**Communication Style:** Direct and comprehensive. Refers to himself in third person ("BMad Master recommends..."). Expert-level communication focused on efficient execution. Presents information systematically using numbered lists.

**Principles:**

- Load resources at runtime, never pre-load
- Always present numbered lists for user choices
- Resource-driven execution (tasks, workflows, agents from manifests)

**Special Role:**

- **Party Mode Orchestrator:** Loads agent manifest, applies customizations, moderates discussions, summarizes when conversations become circular
- **Knowledge Custodian:** Maintains awareness of all installed modules, agents, workflows, and tasks
- **Workflow Facilitator:** Guides users to appropriate workflows based on current project state

**Learn More:** See [Party Mode Guide](./party-mode.md) for complete documentation on multi-agent collaboration.

---

## Party Mode: Multi-Agent Collaboration

Get all your installed agents in one conversation for multi-perspective discussions, retrospectives, and collaborative decision-making.

**Quick Start:**

```bash
/bmad:core:workflows:party-mode
# OR from any agent: *party-mode
```

**What happens:** BMad Master orchestrates 2-3 relevant agents per message. They discuss, debate, and collaborate in real-time.

**Best for:** Strategic decisions, creative brainstorming, post-mortems, sprint retrospectives, complex problem-solving.

**Current BMM uses:** Powers `epic-retrospective` workflow, sprint planning discussions.

**Future:** Advanced elicitation workflows will officially leverage party mode.

👉 **[Party Mode Guide](./party-mode.md)** - Complete guide with fun examples, tips, and troubleshooting

---

## Workflow Access

### How to Run Workflows

**From IDE (Claude Code, Cursor, Windsurf):**

1. Load the agent using agent reference (e.g., type `@pm` in Claude Code)
2. Wait for agent menu to appear in chat
3. Type the workflow trigger with `*` prefix (e.g., `*create-prd`)
4. Follow the workflow prompts

**Agent Menu Structure:**
Each agent displays their available workflows when loaded. Look for:

- `*` prefix indicates workflow trigger
- Grouped by category or phase
- START HERE indicators for recommended entry points

### Universal Workflows

Some workflows are available to multiple agents:

| Workflow           | Agents                            | Purpose                                     |
| ------------------ | --------------------------------- | ------------------------------------------- |
| `workflow-status`  | ALL agents                        | Check current state and get recommendations |
| `workflow-init`    | PM, Analyst, Game Designer        | Initialize workflow tracking                |
| `correct-course`   | PM, Architect, SM, Game Architect | Change management during implementation     |
| `document-project` | Analyst, Technical Writer         | Brownfield documentation                    |

### Validation Actions

Many workflows have optional validation workflows that perform independent review:

| Validation                 | Agent       | Validates                                  |
| -------------------------- | ----------- | ------------------------------------------ |
| `implementation-readiness` | Architect   | PRD + Architecture + Epics + UX (optional) |
| `validate-design`          | UX Designer | UX specification and artifacts             |
| `validate-create-story`    | SM          | Story draft                                |

**When to use validation:**

- Before phase transitions
- For critical documents
- When learning BMM
- For high-stakes projects

---

## Agent Customization

You can customize any agent's personality without modifying core agent files.

### Location

**Customization Directory:** `{project-root}/.bmad/_cfg/agents/`

**Naming Convention:** `{module}-{agent-name}.customize.yaml`

**Examples:**

```
.bmad/_cfg/agents/
├── bmm-pm.customize.yaml
├── bmm-dev.customize.yaml
├── cis-storyteller.customize.yaml
└── bmb-bmad-builder.customize.yaml
```

### Override Structure

**File Format:**

```yaml
agent:
  persona:
    displayName: 'Custom Name' # Optional: Override display name
    communicationStyle: 'Custom style description' # Optional: Override style
    principles: # Optional: Add or replace principles
      - 'Custom principle for this project'
      - 'Another project-specific guideline'
```

### Override Behavior

**Precedence:** Customization > Manifest

**Merge Rules:**

- If field specified in customization, it replaces manifest value
- If field NOT specified, manifest value used
- Additional fields are added to agent personality
- Changes apply immediately when agent loaded

### Use Cases

**Adjust Formality:**

```yaml
agent:
  persona:
    communicationStyle: 'Formal and corporate-focused. Uses business terminology. Structured responses with executive summaries.'
```

**Add Domain Expertise:**

```yaml
agent:
  persona:
    identity: |
      Expert Product Manager with 15 years experience in healthcare SaaS.
      Deep understanding of HIPAA compliance, EHR integrations, and clinical workflows.
      Specializes in balancing regulatory requirements with user experience.
```

**Modify Principles:**

```yaml
agent:
  persona:
    principles:
      - 'HIPAA compliance is non-negotiable'
      - 'Prioritize patient safety over feature velocity'
      - 'Every feature must have clinical validation'
```

**Change Personality:**

```yaml
agent:
  persona:
    displayName: 'Alex' # Change from default "Amelia"
    communicationStyle: 'Casual and friendly. Uses emojis. Explains technical concepts in simple terms.'
```

### Party Mode Integration

Customizations automatically apply in party mode:

1. Party mode reads manifest
2. Checks for customization files
3. Merges customizations with manifest
4. Agents respond with customized personalities

**Example:**

```
You customize PM with healthcare expertise.
In party mode, PM now brings healthcare knowledge to discussions.
Other agents collaborate with PM's specialized perspective.
```

### Applying Customizations

**IMPORTANT:** Customizations don't take effect until you rebuild the agents.

**Complete Process:**

**Step 1: Create/Modify Customization File**

```bash
# Create customization file at:
# {project-root}/.bmad/_cfg/agents/{module}-{agent-name}.customize.yaml

# Example: .bmad/_cfg/agents/bmm-pm.customize.yaml
```

**Step 2: Regenerate Agent Manifest**

After modifying customization files, you must regenerate the agent manifest and rebuild agents:

```bash
# Run the installer to apply customizations
npx bmad-method install

# The installer will:
# 1. Read all customization files
# 2. Regenerate agent-manifest.csv with merged data
# 3. Rebuild agent .md files with customizations applied
```

**Step 3: Verify Changes**

Load the customized agent and verify the changes are reflected in its behavior and responses.

**Why This is Required:**

- Customization files are just configuration - they don't change agents directly
- The agent manifest must be regenerated to merge customizations
- Agent .md files must be rebuilt with the merged data
- Party mode and all workflows load agents from the rebuilt files

### Best Practices

1. **Keep it project-specific:** Customize for your domain, not general changes
2. **Don't break character:** Keep customizations aligned with agent's core role
3. **Test in party mode:** See how customizations interact with other agents
4. **Document why:** Add comments explaining customization purpose
5. **Share with team:** Customizations survive updates, can be version controlled
6. **Rebuild after changes:** Always run installer after modifying customization files

---

## Best Practices

### Agent Selection

**1. Start with workflow-status**

- When unsure where you are, load any agent and run `*workflow-status`
- Agent will analyze current project state and recommend next steps
- Works across all phases and all agents

**2. Match phase to agent**

- **Phase 1 (Analysis):** Analyst, Game Designer
- **Phase 2 (Planning):** PM, UX Designer, Game Designer
- **Phase 3 (Solutioning):** Architect, Game Architect
- **Phase 4 (Implementation):** SM, DEV, Game Developer
- **Testing:** TEA (all phases)
- **Documentation:** Technical Writer (all phases)

**3. Use specialists**

- **Testing:** TEA for comprehensive quality strategy
- **Documentation:** Technical Writer for technical writing
- **Games:** Game Designer/Developer/Architect for game-specific needs
- **UX:** UX Designer for user-centered design

**4. Try party mode for:**

- Strategic decisions with trade-offs
- Creative brainstorming sessions
- Cross-functional alignment
- Complex problem solving

### Working with Agents

**1. Trust their expertise**

- Agents embody decades of simulated experience
- Their questions uncover critical issues
- Their recommendations are data-informed
- Their warnings prevent costly mistakes

**2. Answer their questions**

- Agents ask for important reasons
- Incomplete answers lead to assumptions
- Detailed responses yield better outcomes
- "I don't know" is a valid answer

**3. Follow workflows**

- Structured processes prevent missed steps
- Workflows encode best practices
- Sequential workflows build on each other
- Validation workflows catch errors early

**4. Customize when needed**

- Adjust agent personalities for your project
- Add domain-specific expertise
- Modify communication style for team preferences
- Keep customizations project-specific

### Common Workflows Patterns

**Starting a New Project (Greenfield):**

```
1. PM or Analyst: *workflow-init
2. Analyst: *brainstorm-project or *product-brief (optional)
3. PM: *create-prd (Level 2-4) or *tech-spec (Level 0-1)
4. Architect: *create-architecture (Level 3-4 only)
5. PM: *create-epics-and-stories (after architecture)
6. SM: *sprint-planning
```

**Starting with Existing Code (Brownfield):**

```
1. Analyst or Technical Writer: *document-project
2. PM or Analyst: *workflow-init
3. PM: *create-prd or *tech-spec
4. Architect: *create-architecture (if needed)
5. PM: *create-epics-and-stories (after architecture)
6. SM: *sprint-planning
```

**Story Development Cycle:**

```
1. SM: *create-story
2. DEV: *develop-story
3. DEV: *code-review
4. Repeat steps 1-3 for next story
```

**Testing Strategy:**

```
1. TEA: *framework (once per project, early)
2. TEA: *atdd (before implementing features)
3. DEV: *develop-story (includes tests)
4. TEA: *automate (comprehensive test suite)
5. TEA: *trace (quality gate)
6. TEA: *ci (pipeline setup)
```

**Game Development:**

```
1. Game Designer: *brainstorm-game
2. Game Designer: *create-gdd
3. Game Architect: *create-architecture
4. SM: *sprint-planning
5. Game Developer: *create-story
6. Game Developer: *dev-story
7. Game Developer: *code-review
```

### Navigation Tips

**Lost? Run workflow-status**

```
Load any agent → *workflow-status
Agent analyzes project state → recommends next workflow
```

**Phase transitions:**

```
Each phase has validation gates:
- Phase 3 to 4: implementation-readiness (validates PRD + Architecture + Epics + UX (optional))
Run validation before advancing to implementation
```

**Course correction:**

```
If priorities change mid-project:
Load PM, Architect, or SM → *correct-course
```

**Testing integration:**

```
TEA can be invoked at any phase:
- Phase 1: Test strategy planning
- Phase 2: Test scenarios in PRD
- Phase 3: Architecture testability review
- Phase 4: Test automation and CI
```

---

## Agent Reference Table

Quick reference for agent selection:

| Agent                   | Icon | Primary Phase           | Key Workflows                                 | Best For                                |
| ----------------------- | ---- | ----------------------- | --------------------------------------------- | --------------------------------------- |
| **Analyst**             | 📊   | 1 (Analysis)            | brainstorm, brief, research, document-project | Discovery, requirements, brownfield     |
| **PM**                  | 📋   | 2 (Planning)            | prd, tech-spec, epics-stories                 | Planning, requirements docs             |
| **UX Designer**         | 🎨   | 2 (Planning)            | create-ux-design, validate-design             | UX-heavy projects, design               |
| **Architect**           | 🏗️   | 3 (Solutioning)         | architecture, implementation-readiness        | Technical design, architecture          |
| **SM**                  | 🏃   | 4 (Implementation)      | sprint-planning, create-story                 | Story management, sprint coordination   |
| **DEV**                 | 💻   | 4 (Implementation)      | develop-story, code-review                    | Implementation, coding                  |
| **TEA**                 | 🧪   | All Phases              | framework, atdd, automate, trace, ci          | Testing, quality assurance              |
| **Paige (Tech Writer)** | 📚   | All Phases              | document-project, diagrams, validation        | Documentation, diagrams                 |
| **Principal Engineer**  | ⚡   | Quick Flow (All phases) | create-tech-spec, quick-dev, code-review      | Rapid development, technical leadership |
| **Game Designer**       | 🎲   | 1-2 (Games)             | brainstorm-game, gdd, narrative               | Game design, creative vision            |
| **Game Developer**      | 🕹️   | 4 (Games)               | develop-story, code-review                    | Game implementation                     |
| **Game Architect**      | 🏛️   | 3 (Games)               | architecture, implementation-readiness        | Game systems architecture               |
| **BMad Master**         | 🧙   | Meta                    | party-mode, list tasks/workflows              | Orchestration, multi-agent              |

### Agent Capabilities Summary

**Planning Agents (3):**

- PM: Requirements and planning docs
- UX Designer: User experience design
- Game Designer: Game design and narrative

**Architecture Agents (2):**

- Architect: System architecture
- Game Architect: Game systems architecture

**Implementation Agents (3):**

- SM: Story management and coordination
- DEV: Software development
- Game Developer: Game development

**Quality Agents (2):**

- TEA: Testing and quality assurance
- DEV: Code review

**Support Agents (2):**

- Analyst: Research and discovery
- Technical Writer: Documentation and diagrams

**Meta Agent (1):**

- BMad Master: Orchestration and party mode

---

## Additional Resources

**Workflow Documentation:**

- [Phase 1: Analysis Workflows](./workflows-analysis.md)
- [Phase 2: Planning Workflows](./workflows-planning.md)
- [Phase 3: Solutioning Workflows](./workflows-solutioning.md)
- [Phase 4: Implementation Workflows](./workflows-implementation.md)
<!-- Testing & QA Workflows documentation to be added -->

**Advanced References:**

- [Architecture Workflow Reference](./workflow-architecture-reference.md) - Decision architecture details
- [Document Project Workflow Reference](./workflow-document-project-reference.md) - Brownfield documentation

**Getting Started:**

- [Quick Start Guide](./quick-start.md) - Step-by-step tutorial
- [Scale Adaptive System](./scale-adaptive-system.md) - Understanding project levels
- [Brownfield Guide](./brownfield-guide.md) - Working with existing code

**Other Guides:**

- [Enterprise Agentic Development](./enterprise-agentic-development.md) - Team collaboration
- [FAQ](./faq.md) - Common questions
- [Glossary](./glossary.md) - Terminology reference

---

## Quick Start Checklist

**First Time with BMM:**

- [ ] Read [Quick Start Guide](./quick-start.md)
- [ ] Understand [Scale Adaptive System](./scale-adaptive-system.md)
- [ ] Load an agent in your IDE
- [ ] Run `*workflow-status`
- [ ] Follow recommended workflow

**Starting a Project:**

- [ ] Determine project type (greenfield vs brownfield)
- [ ] If brownfield: Run `*document-project` (Analyst or Technical Writer)
- [ ] Load PM or Analyst → `*workflow-init`
- [ ] Follow phase-appropriate workflows
- [ ] Try `*party-mode` for strategic decisions

**Implementing Stories:**

- [ ] SM: `*sprint-planning` (once)
- [ ] SM: `*create-story`
- [ ] DEV: `*develop-story`
- [ ] DEV: `*code-review`

**Testing Strategy:**

- [ ] TEA: `*framework` (early in project)
- [ ] TEA: `*atdd` (before features)
- [ ] TEA: `*test-design` (comprehensive scenarios)
- [ ] TEA: `*ci` (pipeline setup)

---

_Welcome to the team. Your AI agents are ready to collaborate._
