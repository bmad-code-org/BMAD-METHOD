# BMAD-METHOD Best Practices Summary

## Learned from Analyzing the BMAD-METHOD Repository

This document summarizes key best practices and patterns discovered in the BMAD-METHOD codebase that you can apply to your own projects and AI collaboration workflows.

---

## 1. Agent Design Patterns

### Persona-Driven Agents

Every BMAD agent has a well-defined persona with:

```yaml
persona:
  role: "Specific role + expertise area"
  identity: "Years of experience + domain expertise"
  communication_style: "How they interact"
  principles: "Core beliefs that guide decisions"
```

**Why this works:**
- Creates consistent agent behavior
- Sets clear expectations for users
- Makes agents feel like real experts
- Guides decision-making through principles

**Apply to your agents:**
```markdown
## Agent: Security Auditor

**Role:** Application Security Expert + Penetration Tester
**Identity:** 10+ years securing enterprise applications, CISSP certified
**Style:** Paranoid but practical. Questions everything. Risk-focused.
**Principles:**
- Trust nothing, verify everything
- Defense in depth
- Fail securely
- Security is everyone's job
```

---

### Menu-Driven Interaction

BMAD agents present numbered menus of available workflows:

```
Welcome! I'm John, your Product Manager.

Available workflows:
1. *workflow-init - Start a new project
2. *create-prd - Create PRD
3. *create-epics-and-stories - Break down into stories
4. *party-mode - Multi-agent collaboration

Type a number, shortcut (*prd), or ask naturally.
```

**Why this works:**
- Discoverability - users see all capabilities
- Multiple interaction modes (number, shortcut, natural language)
- Reduces cognitive load - clear options
- Self-documenting - menu IS the documentation

**Apply to your agents:**
- Always start with a menu introduction
- Use consistent trigger patterns (`*workflow-name`)
- Support natural language AND shortcuts
- Include descriptions for each option

---

### Critical Actions Pattern

Agents execute "critical actions" on load:

```yaml
critical_actions:
  - auto_load_config
  - check_workflow_status
  - set_context_from_project_files
  - remember_user_preferences
```

**Why this works:**
- Agents are immediately context-aware
- Reduces repetitive prompting
- Ensures consistency across sessions
- Loads just-in-time information

**Apply to your agents:**
```markdown
## Critical Actions (Execute on Load)

1. Load user configuration (name, skill level, preferences)
2. Scan project directory for existing artifacts
3. Determine current project phase
4. Set appropriate context
5. Present relevant menu based on phase
```

---

## 2. Workflow Architecture

### Structured Workflow Files

Each workflow has a clear structure:

```
workflow/
├── workflow.yaml          # Workflow definition
├── instructions.md        # Step-by-step guide for agent
├── template.md            # Output document template
├── checklist.md           # Validation checklist
└── data/
    └── reference-data.csv # Data-driven behavior
```

**Why this works:**
- Separation of concerns (config, logic, output, validation)
- Reusable templates
- Data-driven customization
- Quality assurance built-in

**Apply to your workflows:**
1. **Define workflow** (inputs, outputs, steps)
2. **Create instructions** (how agent should execute)
3. **Design template** (consistent output format)
4. **Add validation** (checklist to verify quality)

---

### Scale-Adaptive Workflows

BMAD workflows adapt to project complexity:

```yaml
scale_adaptive:
  level_0_1: quick_flow      # Bug fixes, small features
  level_2: bmad_method       # Products, platforms
  level_3_4: enterprise      # Large-scale systems
```

**Decision matrix:**
| Complexity | Users | Timeline | Documentation | Test Strategy |
|-----------|-------|----------|--------------|---------------|
| 0-1 | 1-100 | Days | Tech spec | Basic |
| 2 | 100-10K | Weeks | PRD + Arch | Standard |
| 3-4 | 10K+ | Months | Full suite | Comprehensive |

**Why this works:**
- Prevents over-planning simple tasks
- Ensures thoroughness for complex projects
- Saves time and tokens
- Automatic adjustment based on assessment

**Apply to your workflows:**
```markdown
## Workflow: Security Review

**Quick (Level 0-1):**
- Basic OWASP checklist
- Automated scan only

**Standard (Level 2):**
- Threat modeling
- Manual code review
- Penetration testing

**Enterprise (Level 3-4):**
- Full threat modeling (STRIDE)
- Security architecture review
- Compliance audit (SOC2, ISO27001)
- Penetration testing + red team
```

---

### Four-Phase Methodology

BMAD organizes workflows into phases:

```
Phase 1: Analysis (Optional)
├── brainstorming
├── research
└── product-brief

Phase 2: Planning (Required)
├── PRD or tech-spec
└── epic/story breakdown

Phase 3: Solutioning (Track-dependent)
├── architecture
├── UX design
└── test strategy

Phase 4: Implementation (Iterative)
├── story development
├── code review
└── testing
```

**Why this works:**
- Clear progression (left-to-right workflow)
- Prevents jumping to implementation prematurely
- Artifacts from each phase feed the next
- Allows checkpoints and course corrections

**Apply to your domains:**

**Marketing Campaign:**
1. Research (market analysis, competitor review)
2. Planning (campaign brief, messaging)
3. Creation (copy, creative, landing pages)
4. Execution (launch, monitor, optimize)

**Data Science Project:**
1. Discovery (problem definition, data exploration)
2. Planning (hypothesis, metrics, approach)
3. Modeling (feature engineering, model building)
4. Deployment (productionize, monitor, iterate)

---

## 3. Collaboration Patterns

### Sequential Handoffs

Agents work in sequence, each producing artifacts for the next:

```
PM → PRD.md
  ↓
Architect → architecture.md (reads PRD)
  ↓
UX Designer → ux-design.md (reads PRD)
  ↓
Developer → code (reads PRD + Architecture + UX)
```

**Why this works:**
- Clear dependencies
- Artifacts are contracts between agents
- Each agent adds their expertise layer
- Prevents rework from missing context

**Apply to your agent workflows:**
- Define artifact formats (templates)
- Specify what each agent consumes vs. produces
- Version artifacts (PRD v1 → PRD v2)
- Track dependencies in workflow status

---

### Party Mode (Multi-Agent Collaboration)

All agents collaborate on complex decisions:

```yaml
party_mode:
  participants:
    - PM (facilitator)
    - Architect (technical feasibility)
    - Developer (implementation complexity)
    - UX Designer (user impact)
    - Security Expert (risk assessment)

  process:
    1. PM presents problem
    2. Each agent shares perspective
    3. Agents debate trade-offs
    4. Human makes final decision
```

**Why this works:**
- Diverse perspectives on complex problems
- Uncovers issues single agents miss
- More creative solutions
- Human retains decision authority

**Apply to your workflows:**

**Example: Choosing a tech stack**
- Architect: "I recommend microservices for scalability"
- Developer: "Team is small, monolith is faster to start"
- Security: "Microservices increase attack surface"
- PM: "MVP timeline is 3 months, complexity is a risk"
- **Decision:** Start with modular monolith, extract services later

---

### Just-In-Time Context Loading

BMAD loads context only when needed:

```python
# Anti-pattern: Load everything
context = load_entire_prd() + load_all_stories() + load_full_architecture()
# → 50K tokens, most irrelevant

# BMAD pattern: Load just-in-time
current_story = load_story("story-12")
relevant_prd_section = load_prd_section("user-management")
relevant_arch = load_architecture_component("auth-service")
# → 2K tokens, all relevant
```

**Why this works:**
- 90%+ token savings
- Faster processing
- More focused responses
- Lower costs

**Apply to your workflows:**
```markdown
## Context Loading Strategy

**Phase 2 (Planning):** Load full context
- All research
- All market data
- All user feedback

**Phase 4 (Implementation):** Load relevant context only
- Current story
- Related PRD section
- Relevant architecture component
- Affected code files only
```

---

## 4. Configuration Management

### Update-Safe Customization

BMAD separates core files from user customizations:

```
.bmad/
├── bmm/agents/pm.agent.yaml          # Core (never edit)
└── _cfg/
    └── agents/pm.customize.yaml      # Your changes
```

**Customization file:**
```yaml
agent:
  metadata:
    name: "Sarah"  # Override default "John"

  persona:
    additional_expertise: "SaaS products, B2B sales"

  memory:
    - "User prefers Agile over Waterfall"
    - "Project uses TypeScript + React"
```

**Why this works:**
- Updates don't break your customizations
- Clear separation of concerns
- Easy to version control your changes
- Can reset to defaults easily

**Apply to your agents:**
1. **Base template** (version controlled, shared)
2. **User overrides** (gitignored or per-user)
3. **Project-specific config** (per-project folder)

---

### Layered Configuration

BMAD has 4 configuration levels:

```
1. Global defaults (framework level)
   ↓
2. Module defaults (bmm, bmb, cis)
   ↓
3. Project config (per-project settings)
   ↓
4. Agent customization (per-agent overrides)
```

**Priority:** Agent > Project > Module > Global

**Why this works:**
- Sensible defaults out-of-the-box
- Customize per-project or per-agent
- Override only what you need
- Clear precedence rules

**Apply to your systems:**
```yaml
# global-config.yaml
output_language: "English"
skill_level: "Intermediate"

# project-config.yaml
output_language: "Spanish"  # Override global

# agent-config/pm.yaml
communication_style: "Casual"  # Override for this agent
```

---

### Multi-Language Support

BMAD separates communication from output:

```yaml
config:
  communication_language: "Spanish"       # Agent talks to me in Spanish
  document_output_language: "English"     # But generates docs in English
```

**Why this works:**
- International teams with English docs
- Personal comfort vs. team standards
- Separate concerns (interaction vs. artifacts)

**Apply to your agents:**
```markdown
## Language Configuration

**Communication:** The language I use to talk with you
**Output:** The language I generate documents in

Examples:
- Communicate in German, output in English (EU team, English docs)
- Communicate in English, output in Japanese (offshore team)
- Both in Spanish (Spanish-language product)
```

---

## 5. Document Management

### Document Sharding

For large documents, BMAD splits by headings:

**Whole PRD (50K tokens):**
```markdown
PRD.md
├── Executive Summary
├── User Stories
├── Epic: User Management (5K tokens)
├── Epic: Task Management (8K tokens)
├── Epic: Collaboration (7K tokens)
└── ... (10 more sections)
```

**Sharded PRD (load only what you need):**
```
docs/
├── PRD.md                          # Main file with links
└── PRD/
    ├── epic-user-management.md     # 5K tokens
    ├── epic-task-management.md     # 8K tokens
    └── epic-collaboration.md       # 7K tokens
```

**Workflow loads only relevant shard:**
```
Story: "Add password reset"
→ Load: epic-user-management.md (5K tokens)
→ Skip: epic-task-management.md (8K tokens saved)
```

**Why this works:**
- 90%+ token savings in implementation
- Faster loading
- Lower costs
- Maintains full document for reference

**Apply to your documents:**
1. Generate full document in planning phase
2. Split by logical sections (epics, components, modules)
3. Load only relevant sections during implementation
4. Keep full document for reviews/updates

---

### Input Pattern Abstraction

BMAD workflows auto-detect whole vs. sharded documents:

```yaml
inputs:
  - name: prd
    pattern:
      whole: "{output_folder}/PRD.md"
      sharded: "{output_folder}/PRD/epic-*.md"

    load_strategy:
      - try: whole
        if_exists: load_entire_file
      - try: sharded
        if_exists: load_matching_shard_for_current_story
      - else: ask_user_for_prd_location
```

**Why this works:**
- Workflows work with either format
- No manual configuration needed
- Backward compatible
- Graceful fallbacks

**Apply to your workflows:**
```markdown
## Document Loading Strategy

**Step 1:** Try to load whole document
- If exists: Use it
- If not: Continue to Step 2

**Step 2:** Try to load sharded documents
- If exists: Load relevant shard only
- If not: Continue to Step 3

**Step 3:** Ask user
- "I couldn't find the PRD. Please provide the path."
```

---

## 6. Quality Assurance

### Validation Checklists

Every major workflow has a validation checklist:

**PRD Validation Checklist:**
```markdown
## Completeness
- [ ] Executive Summary (1 paragraph)
- [ ] Problem Statement (clear, measurable)
- [ ] User Personas (3-5, detailed)
- [ ] Success Metrics (quantified)
- [ ] Functional Requirements (granular, testable)

## Quality
- [ ] Requirements are specific (not vague)
- [ ] Acceptance criteria are testable
- [ ] Risks are identified
- [ ] Timeline is realistic

## Alignment
- [ ] Aligns with business goals
- [ ] User needs are addressed
- [ ] Technical constraints considered
```

**Why this works:**
- Catches gaps before implementation
- Ensures consistency across projects
- Teachable moments (users learn what "good" looks like)
- Reduces rework

**Apply to your workflows:**
1. Create checklist for each deliverable
2. Run validation workflow before moving to next phase
3. Use checklist as a teaching tool
4. Update checklist based on lessons learned

---

### Schema Validation

BMAD validates agent definitions against schemas:

```javascript
// Agent schema validation
const agentSchema = {
  metadata: { required: ['id', 'name', 'title', 'module'] },
  persona: { required: ['role', 'identity', 'communication_style', 'principles'] },
  menu: {
    type: 'array',
    items: {
      required: ['trigger', 'description'],
      oneOf: ['workflow', 'exec', 'tmpl', 'data', 'action']
    }
  }
};

validateAgent(agentFile, agentSchema);
```

**Why this works:**
- Catches errors before runtime
- Ensures consistency across agents
- Documentation through types
- Easy to onboard new contributors

**Apply to your systems:**
- Define schemas for agents, workflows, templates
- Validate before deployment
- Use TypeScript/JSON Schema for type safety
- Run validation in CI/CD

---

## 7. Developer Experience

### Comprehensive Testing

BMAD has multiple test layers:

```bash
# Schema validation
npm run test:schemas          # Validate YAML against schemas

# Installation tests
npm run test:install          # Test compilation process

# Integration tests
npm run validate:bundles      # Verify web bundles work

# Code quality
npm run lint                  # ESLint + YAML lint
npm run format:check          # Prettier

# All checks
npm test                      # Run everything
```

**Why this works:**
- Catch issues before users hit them
- Fast feedback loop
- Multiple validation layers
- Automated quality gates

**Apply to your projects:**
1. Schema validation (structure)
2. Unit tests (logic)
3. Integration tests (workflows end-to-end)
4. Linting (code quality)
5. Pre-commit hooks (prevent bad commits)

---

### Self-Documenting Code

BMAD uses YAML for agent definitions (human-readable):

```yaml
# Anti-pattern: Opaque code
agent = Agent(
  "pm",
  "John",
  lambda x: x.role == "PM",
  [Workflow("prd", "Create PRD", prd_handler)]
)

# BMAD pattern: Self-documenting YAML
agent:
  metadata:
    name: John
    title: Product Manager

  menu:
    - trigger: create-prd
      workflow: "path/to/prd/workflow.yaml"
      description: "Create Product Requirements Document"
```

**Why this works:**
- Non-developers can read and modify
- Version control friendly (clear diffs)
- Self-documenting (structure = documentation)
- Easy to generate/validate

**Apply to your systems:**
- Use YAML/JSON for configuration
- Clear naming conventions
- Comments for complex logic only
- Structure reflects intent

---

### Modular Architecture

BMAD is organized into clear modules:

```
src/
├── core/                    # Framework (agents, workflows, tasks)
│   ├── agents/              # BMad Master orchestrator
│   ├── workflows/           # Core workflows (party-mode)
│   └── tasks/               # Reusable task units
│
├── modules/
│   ├── bmm/                 # Software development
│   ├── bmb/                 # Agent builder
│   ├── cis/                 # Creative intelligence
│   └── custom/              # User-created modules
│
├── utility/                 # Shared utilities
│   ├── models/fragments/    # XML components
│   └── templates/           # Reusable templates
│
└── tools/
    ├── cli/                 # Installation CLI
    └── bundlers/            # Web bundle generation
```

**Why this works:**
- Clear boundaries (core vs. modules vs. tools)
- Modules can be installed independently
- Easy to add new modules
- Shared utilities reduce duplication

**Apply to your projects:**
```
your-project/
├── core/               # Framework, base classes
├── modules/            # Domain-specific functionality
│   ├── module-a/
│   ├── module-b/
│   └── module-c/
├── shared/             # Shared utilities
└── tools/              # CLI tools, scripts
```

---

## 8. Deployment Strategies

### Multi-Target Compilation

BMAD compiles agents for different targets:

```javascript
// Single agent definition (YAML)
const agent = loadAgentYaml('pm.agent.yaml');

// Compile for different targets
compileForIDE(agent, 'claude-code');    // → .md with filesystem handlers
compileForIDE(agent, 'cursor');         // → .md with Cursor-specific syntax
compileForWeb(agent, 'gemini');         // → .xml for Gemini Gems
compileForWeb(agent, 'chatgpt');        // → Custom GPT format
```

**Why this works:**
- Write once, deploy anywhere
- Target-specific optimizations
- Maintain single source of truth
- Easy to add new targets

**Apply to your agents:**
1. Define agents in platform-agnostic format (YAML)
2. Create target-specific compilers
3. Generate optimized artifacts per platform
4. Automate compilation in build process

---

### Dependency Resolution

BMAD automatically resolves cross-module dependencies:

```yaml
# Workflow in BMM module references CIS module
workflow:
  dependencies:
    - module: cis
      workflow: brainstorming
```

**Bundler resolves:**
1. Scan all workflows
2. Identify cross-module references
3. Vendor (copy) dependencies into bundle
4. Embed inline to create self-contained artifact

**Why this works:**
- Self-contained bundles (no external deps)
- Automatic detection (no manual tracking)
- Works across modules
- No broken links

**Apply to your build system:**
1. Parse all workflow/agent files
2. Build dependency graph
3. Resolve and bundle dependencies
4. Validate no missing dependencies
5. Generate self-contained artifacts

---

### Web Bundle Strategy

BMAD creates dual deployment modes:

**IDE Installation (Filesystem-aware):**
- Agents load files from project folder
- Read/write workflows
- Customization via `_cfg/` folder
- Full functionality

**Web Bundles (Self-contained):**
- Everything embedded inline
- No file system access
- Dependencies bundled
- Limited but portable

**Trade-offs:**
| Feature | IDE | Web Bundle |
|---------|-----|------------|
| File access | ✅ Yes | ❌ No |
| Customization | ✅ Easy | ❌ Manual |
| Multi-agent | ✅ Yes | ⚠️ Limited |
| Cost | $$$ | $$ |
| Setup | Complex | Easy |

**Why this works:**
- Best tool for the job
- Planning in web (cheaper)
- Implementation in IDE (full power)
- Users choose based on needs

**Apply to your deployment:**
1. Identify use cases (planning vs. implementation)
2. Create appropriate deployment modes
3. Guide users to right mode
4. Allow hybrid workflows (web planning → IDE implementation)

---

## 9. Community & Contribution

### Clear Contribution Guidelines

BMAD has comprehensive contribution docs:

**CONTRIBUTING.md includes:**
- Code style guide
- PR size limits (200-400 lines ideal, 800 max)
- Commit message conventions (feat:, fix:, docs:)
- Testing requirements
- Documentation standards

**Why this works:**
- Consistent codebase
- Easy code reviews
- Faster merges
- Better collaboration

**Apply to your projects:**
1. Document coding standards
2. Set PR size expectations
3. Require tests for new features
4. Enforce via CI/CD
5. Provide templates (PR, issue)

---

### Atomic Commits

BMAD uses conventional commits:

```bash
# Good commits
feat(bmm): add course-correction workflow
fix(bundler): resolve cross-module dependencies correctly
docs(readme): update installation instructions

# Bad commits
update stuff
fixes
WIP
```

**Why this works:**
- Clear history (what changed, why)
- Easier to review
- Can generate changelogs automatically
- Easy to revert specific changes

**Apply to your workflow:**
1. One logical change per commit
2. Use conventional commit format
3. Write clear commit messages
4. Small, frequent commits
5. Use tools like commitlint

---

## 10. Key Takeaways

### Top 10 Best Practices

1. **Persona-Driven Agents** - Give agents identity, principles, and communication style
2. **Menu-Driven UX** - Let users discover capabilities through menus
3. **Scale-Adaptive** - Adjust complexity based on project needs
4. **Just-In-Time Context** - Load only relevant information
5. **Update-Safe Customization** - Separate core from user configs
6. **Validation Checklists** - Ensure quality before moving forward
7. **Multi-Target Compilation** - Write once, deploy anywhere
8. **Modular Architecture** - Clear boundaries, independent modules
9. **Comprehensive Testing** - Multiple validation layers
10. **Human Amplification** - AI augments, doesn't replace human decisions

---

### Anti-Patterns to Avoid

❌ **Monolithic agents** - One agent trying to do everything
✅ **Specialized agents** - Each agent has a clear domain

❌ **Loading full context always** - Wasting tokens
✅ **Just-in-time loading** - Load only what's needed

❌ **Hardcoded instructions** - Difficult to maintain
✅ **YAML-based config** - Easy to read and modify

❌ **No validation** - Quality issues slip through
✅ **Built-in checklists** - Validate before proceeding

❌ **Manual artifact handoffs** - Prone to errors
✅ **Structured file formats** - Automatic detection

❌ **All-or-nothing planning** - Overkill for small tasks
✅ **Scale-adaptive** - Right level of planning per project

❌ **Editing core files** - Breaks on updates
✅ **Customization layer** - Survives updates

❌ **One deployment target** - Locked in
✅ **Multi-target compilation** - Deploy anywhere

❌ **Vague commit messages** - Hard to understand history
✅ **Conventional commits** - Clear, structured history

❌ **Large, infrequent commits** - Hard to review
✅ **Small, atomic commits** - Easy to review and revert

---

## Next Steps

### Apply These Practices:

1. **Review your agents** - Do they have clear personas and principles?
2. **Check your workflows** - Are they scale-adaptive?
3. **Audit context loading** - Are you loading too much?
4. **Add validation** - Create checklists for deliverables
5. **Separate customizations** - Set up update-safe config
6. **Improve testing** - Add schema validation, linting
7. **Modularize** - Break monoliths into clear modules
8. **Document** - Make code self-documenting
9. **Optimize deployment** - Create target-specific bundles
10. **Contribute** - Share your learnings with the community

### Resources

- **BMAD-METHOD Repo**: https://github.com/bmad-code-org/BMAD-METHOD
- **Example Agents**: `src/modules/bmm/agents/`
- **Example Workflows**: `src/modules/bmm/workflows/`
- **Bundler Source**: `tools/cli/bundlers/`
- **Discord Community**: https://discord.gg/gk8jAdXWmj

---

*These best practices are derived from analyzing the BMAD-METHOD v6-alpha codebase. Apply them to build better AI collaboration systems!*
