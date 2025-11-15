# Implementing BMAD-METHOD in Claude Code Web

## Overview

This guide explains how to implement the BMAD-METHOD in Claude Code web version. The BMAD-METHOD repository was originally designed for IDE installation and web bundles (Gemini/GPT), but can be adapted for Claude Code web.

## Current Status

**What BMAD has:**
- ✅ IDE installation (Claude Code desktop, Cursor, Windsurf, etc.)
- ✅ Web bundles for Gemini Gems and Custom GPTs
- ❌ **NOT YET**: Claude Code web-specific implementation

**What you need to know:**
- Claude Code web works differently from Gemini Gems/Custom GPTs
- You have $250 in Claude credits (API usage)
- Claude Code web supports Projects, Custom Instructions, and potentially Skills (experimental)

---

## Implementation Options

### Option 1: Manual Copy-Paste (Simplest, Not Scalable)

**How it works:**
1. Open a BMAD agent file (e.g., `src/modules/bmm/agents/pm.agent.yaml`)
2. Copy the persona, principles, and instructions
3. Paste into a Claude Code web Project custom instructions
4. Repeat for each agent you want to use

**Pros:**
- ✅ Works immediately
- ✅ No technical setup required
- ✅ Uses your $250 credits directly

**Cons:**
- ❌ Very manual and time-consuming
- ❌ No workflow orchestration
- ❌ No agent collaboration
- ❌ Hard to maintain/update
- ❌ One agent at a time

**Cost:**
- Uses Claude API credits from your $250
- Planning workflows can be expensive (thousands of tokens)

**When to use:**
- Quick experiments
- Testing single agents
- One-off projects

---

### Option 2: Claude Code Web Projects (Recommended for Now)

**How it works:**
1. Create separate Projects for each BMAD agent
2. Add agent instructions as Project knowledge
3. Upload workflow templates as Project files
4. Invoke workflows by prompting the agent

**Example Setup:**

**Project 1: "BMad Product Manager"**
- Custom Instructions: PM agent persona from `pm.agent.yaml`
- Files: PRD workflow, PRD template, project-types.csv
- Usage: "Run the PRD workflow for my SaaS app"

**Project 2: "BMad Architect"**
- Custom Instructions: Architect agent persona
- Files: Architecture workflow, architecture template
- Usage: "Design the architecture for [project]"

**Pros:**
- ✅ Organized per-agent structure
- ✅ Can upload workflow templates and data files
- ✅ Persistent context across conversations
- ✅ Uses your $250 credits

**Cons:**
- ❌ Manual setup for each agent
- ❌ No multi-agent collaboration (party mode)
- ❌ Limited workflow automation
- ❌ Can't easily reference cross-agent workflows

**Cost:**
- More efficient than copy-paste (persistent context)
- Still uses Claude API credits

---

### Option 3: Adapt BMAD Web Bundler (Advanced, Future-Proof)

**Goal:** Modify the BMAD web bundler to generate Claude Code web-compatible formats.

**Current bundler creates:**
- Self-contained XML files with embedded workflows
- Designed for Gemini/GPT instruction limits
- Includes party mode, manifests, dependency resolution

**What you'd need to create:**
- Claude Code web Project export format
- Skill definitions (if Claude supports them)
- API-based agent orchestration for multi-agent workflows

**Technical approach:**

1. **Create a new bundler:** `tools/cli/bundlers/claude-web-bundler.js`
2. **Generate Project configurations** instead of XML bundles
3. **Output format:**
   ```
   claude-web-bundles/
   ├── bmm/
   │   ├── pm-project/
   │   │   ├── instructions.md
   │   │   ├── workflows/
   │   │   │   ├── prd-workflow.md
   │   │   │   └── create-epics-workflow.md
   │   │   └── data/
   │   │       └── project-types.csv
   │   └── architect-project/
   │       └── ...
   ```

**Pros:**
- ✅ Automated agent generation
- ✅ Stays in sync with BMAD updates
- ✅ Can reuse BMAD's compilation system
- ✅ Could enable multi-agent workflows via API

**Cons:**
- ❌ Requires development work
- ❌ Claude Code web API may have limitations
- ❌ Need to test feasibility first

---

### Option 4: Skills (Experimental - If Available)

**What are Skills?**
- New Claude feature for reusable agent behaviors
- Similar to GPT Actions or Gemini Tools
- May not be available in Claude Code web yet

**If available, you could:**
1. Define BMAD agents as Skills
2. Invoke them across projects
3. Potentially chain them for workflows

**Status:**
- 🔍 Need to verify if Claude Code web supports Skills
- 📚 Check Claude documentation: https://docs.claude.com

---

## Recommended Implementation Path

### Phase 1: Immediate (Use Your $250 Credits)

**Goal:** Get BMAD agents working in Claude Code web TODAY

1. **Choose 3-5 key agents:**
   - Product Manager (pm)
   - Architect (architect)
   - Developer (dev)
   - UX Designer (ux-designer)
   - BMad Master (orchestrator)

2. **Create Claude Code web Projects:**
   - One Project per agent
   - Extract persona/principles from `.agent.yaml` files
   - Add to Project custom instructions

3. **Add workflow templates:**
   - Upload markdown templates to each Project
   - Example: Upload `prd/template.md` to PM Project

4. **Test workflows:**
   - "Run the PRD workflow"
   - "Create epics and stories"
   - Verify outputs

**Cost estimate:**
- Setup: Minimal (one-time)
- Usage: Depends on workflow complexity
  - PRD workflow: ~$2-5 per run
  - Architecture: ~$3-8 per run
  - Implementation: Variable

**Time estimate:** 2-4 hours for 5 agents

---

### Phase 2: Optimization (2-4 weeks)

**Goal:** Automate agent setup and improve workflows

1. **Create a Claude web bundler:**
   - Fork the web-bundler.js
   - Modify to output Project-compatible formats
   - Generate instructions + files for each agent

2. **Build a project template generator:**
   - Script to create Claude Projects via API (if available)
   - Auto-upload workflow files
   - Sync with BMAD updates

3. **Test multi-agent coordination:**
   - Manual: Switch between Projects
   - Advanced: Use Claude API to orchestrate agents
   - Ultimate: Build a simple web app that coordinates agents

---

### Phase 3: Advanced (1-3 months)

**Goal:** Full BMAD-METHOD experience in Claude Code web

1. **Investigate Skills support:**
   - Check Claude Code web roadmap
   - Test experimental features
   - Adapt BMAD agents as Skills if available

2. **Build agent orchestration:**
   - API-based workflow engine
   - Multi-agent collaboration (party mode)
   - State management across agents

3. **Create Claude Code web extension:**
   - Browser extension or web app
   - Loads BMAD agents dynamically
   - Manages workflow state
   - Coordinates multi-agent conversations

---

## Cost Analysis: $250 Budget

**Your $250 in Claude credits can cover:**

### Scenario 1: Planning-Heavy (Recommended)
- 30-50 PRD workflows (~$3-5 each)
- 20-30 Architecture designs (~$4-8 each)
- 50-100 story implementations (~$1-3 each)
- **Best for:** Multiple projects, thorough planning

### Scenario 2: Implementation-Heavy
- 5-10 PRDs
- 10-20 Architecture designs
- 100-200 story implementations
- **Best for:** One large project with lots of coding

### Cost-Saving Tips:
1. **Do Phase 1-2 in Claude Code web** (planning is cheaper)
2. **Switch to local IDE for Phase 4** (implementation with codebase access)
3. **Use web bundles for brainstorming** (Gemini Gems are cheaper)
4. **Cache context efficiently** (reuse PRDs, don't regenerate)

**Recommended split:**
- 40% on planning (PRD, Architecture) - High value
- 30% on implementation - Code generation
- 20% on refinement - Bug fixes, updates
- 10% on experimentation - Testing workflows

---

## Best Practices from BMAD-METHOD

### 1. **Modular Architecture**
```
your-project/
├── .bmad/                    # BMAD installation
│   ├── bmm/agents/           # Agent definitions
│   ├── bmm/workflows/        # Workflow templates
│   └── _cfg/                 # Your customizations
└── docs/                     # Generated artifacts
    ├── PRD.md
    ├── architecture.md
    └── epics/
```

**Apply to Claude Code web:**
- Create separate Projects for agents
- Organize workflow templates in Project files
- Store outputs in a consistent docs/ structure

### 2. **Agent Specialization**
Each BMAD agent has:
- **Persona**: Who they are, expertise, years of experience
- **Principles**: Core beliefs that guide decisions
- **Communication style**: How they interact
- **Menu**: Available workflows and commands

**Apply to Claude Code web:**
```markdown
# PM Project Instructions

## Persona
Product management veteran with 8+ years launching B2B and consumer products.
Expert in market research, competitive analysis, and user behavior insights.

## Principles
- Uncover the deeper WHY behind every requirement
- Ruthless prioritization to achieve MVP goals
- Proactively identify risks
- Align efforts with measurable business impact

## Communication Style
Direct and analytical. Ask WHY relentlessly. Back claims with data and user insights.

## Available Workflows
1. *prd - Create Product Requirements Document
2. *create-epics-and-stories - Break PRD into implementable stories
3. *validate-prd - Check PRD completeness
```

### 3. **Scale-Adaptive Planning**

BMAD automatically adjusts based on project complexity:

| Level | Project Type | Planning Track | Workflows |
|-------|-------------|----------------|-----------|
| 0-1 | Bug fixes, small features | Quick Flow | Tech spec only |
| 2 | Products, platforms | BMad Method | PRD + Architecture |
| 3-4 | Enterprise systems | Enterprise | Full suite + Security/DevOps |

**Apply to Claude Code web:**
- Ask the agent to assess project complexity
- Use appropriate workflows based on level
- Don't over-plan simple projects

### 4. **Workflow-Based Collaboration**

BMAD agents work together through workflows:
- **Sequential**: PM → Architect → Developer
- **Parallel**: UX Designer + Architect (both need PRD)
- **Party Mode**: All agents collaborate on complex decisions

**Apply to Claude Code web:**
```
Phase 1: Analysis → Use "Analyst" Project
↓ (export research.md)
Phase 2: Planning → Use "PM" Project (import research.md)
↓ (export PRD.md)
Phase 3: Architecture → Use "Architect" Project (import PRD.md)
↓ (export architecture.md)
Phase 4: Implementation → Use "Developer" Project (import all docs)
```

### 5. **Document Sharding**

For large projects, BMAD splits documents:
- **PRD sharding**: Split by epic
- **Architecture sharding**: Split by component
- **90%+ token savings** in implementation phase

**Apply to Claude Code web:**
- Generate full documents in planning
- Split them for implementation
- Load only relevant sections per story

### 6. **Just-In-Time Context**

BMAD loads context when needed:
- Epic context when starting an epic
- Story context when implementing a story
- Prevents token waste

**Apply to Claude Code web:**
- Don't load entire PRD for every story
- Create story-specific context files
- Reference full docs only when needed

### 7. **Customization Without Modification**

BMAD keeps customizations separate:
```
.bmad/
├── bmm/agents/pm.agent.yaml    # Core (don't edit)
└── _cfg/agents/pm.customize.yaml  # Your changes
```

**Apply to Claude Code web:**
- Keep base agent instructions in a template
- Create project-specific overrides
- Version control your customizations

### 8. **Comprehensive Testing**

BMAD has extensive validation:
- Schema validation for agents
- Workflow checklist validation
- Bundle integrity checks
- CI/CD on every commit

**Apply to Claude Code web:**
- Create validation prompts for workflows
- Use checklists (e.g., PRD validation checklist)
- Test agent responses for consistency

### 9. **Multi-Language Support**

BMAD separates:
- **Communication language**: How agent talks to you
- **Output language**: What it generates

**Apply to Claude Code web:**
```
"Communicate with me in Spanish, but generate all documents in English"
```

### 10. **Party Mode Philosophy**

BMAD's party mode enables multi-agent collaboration:
- All agents contribute their expertise
- Diverse perspectives on complex problems
- Human guides the discussion

**Apply to Claude Code web (manual version):**
1. Describe problem in PM Project → Get PM perspective
2. Copy PM output → Paste in Architect Project → Get tech view
3. Copy both → Paste in Developer Project → Get implementation plan
4. Synthesize all perspectives → Make decision

---

## Example: Running a Full BMAD Workflow in Claude Code Web

### Scenario: Build a SaaS Task Management App

**Budget:** $250 Claude credits
**Goal:** Complete PRD → Architecture → MVP implementation

### Step 1: Setup (One-time, ~2 hours)

**Create Projects:**

1. **"BMad PM"**
   - Custom instructions: Copy from `src/modules/bmm/agents/pm.agent.yaml`
   - Files: Upload `workflows/prd/template.md`, `workflows/prd/instructions.md`
   - Upload: `data/project-types.csv`

2. **"BMad Architect"**
   - Custom instructions: Copy from `src/modules/bmm/agents/architect.agent.yaml`
   - Files: Upload architecture workflow templates
   - Upload: architecture decision records template

3. **"BMad Developer"**
   - Custom instructions: Copy from `src/modules/bmm/agents/dev.agent.yaml`
   - Files: Upload story implementation workflow
   - Upload: coding standards, style guides

### Step 2: Planning Phase (~$15-25)

**In "BMad PM" Project:**

```
Prompt: I want to build a SaaS task management app for remote teams.
Run the PRD workflow.

Key features:
- Task creation and assignment
- Team collaboration
- Real-time updates
- Mobile-friendly

Target: Small teams (5-50 people)
```

**Agent will:**
1. Ask clarifying questions (WHY, market, users)
2. Generate PRD sections iteratively
3. Create epics and user stories
4. Output: `PRD.md` (~$10-15)

**Save output:**
- Download PRD.md to `docs/PRD.md`

### Step 3: Architecture Phase (~$20-35)

**In "BMad Architect" Project:**

```
Prompt: I have a PRD for a task management SaaS app.
Run the architecture workflow.

[Paste entire PRD.md]
```

**Agent will:**
1. Analyze requirements
2. Propose tech stack
3. Design system architecture
4. Define data models
5. Identify risks
6. Output: `architecture.md` (~$15-25)

**Save output:**
- Download architecture.md to `docs/architecture.md`

### Step 4: Implementation Planning (~$10-15)

**In "BMad PM" Project:**

```
Prompt: Break down the PRD into implementable stories.

[Paste PRD.md]
```

**Agent will:**
1. Create epics (e.g., "User Management", "Task Management")
2. Break epics into stories
3. Prioritize stories
4. Output: Story files (~$5-10)

**Save output:**
- docs/epics/user-management.md
- docs/epics/task-management.md

### Step 5: Story Implementation (~$150-200)

**In "BMad Developer" Project:**

For each story:

```
Prompt: Implement story #12: "User can create a task"

Context:
- PRD: [paste relevant section]
- Architecture: [paste relevant section]
- Current codebase: [describe or paste files]

Run the dev-story workflow.
```

**Agent will:**
1. Analyze story requirements
2. Generate code
3. Create tests
4. Provide implementation plan
5. Cost: ~$2-5 per story

**Repeat** for 40-60 stories

### Step 6: Refinement (~$20-30)

Use remaining budget for:
- Bug fixes
- Code reviews
- Architecture adjustments
- Documentation updates

**Total cost:** ~$215-305 (slightly over budget, adjust story count)

---

## Automation Script (Future Enhancement)

Create a Node.js script to automate Project setup:

```javascript
// claude-web-setup.js
const fs = require('fs-extra');
const yaml = require('js-yaml');

async function createProjectInstructions(agentFile) {
  // Read BMAD agent definition
  const agent = yaml.load(await fs.readFile(agentFile));

  // Generate Project instructions
  const instructions = `
# ${agent.metadata.title}

## Persona
Role: ${agent.persona.role}
Identity: ${agent.persona.identity}

## Communication Style
${agent.persona.communication_style}

## Principles
${agent.persona.principles}

## Available Workflows
${agent.menu.map((m, i) => `${i + 1}. *${m.trigger} - ${m.description}`).join('\n')}
  `;

  return instructions;
}

// Generate for all agents
['pm', 'architect', 'dev', 'ux-designer'].forEach(async (agent) => {
  const instructions = await createProjectInstructions(
    `src/modules/bmm/agents/${agent}.agent.yaml`
  );
  await fs.writeFile(
    `claude-web-bundles/bmm/${agent}/instructions.md`,
    instructions
  );
});
```

---

## FAQ

### Q: Can I use BMAD web bundles directly in Claude Code web?
**A:** No. BMAD web bundles are XML files designed for Gemini Gems and Custom GPTs. Claude Code web uses a different format (Projects with custom instructions).

### Q: Do I need to install BMAD locally?
**A:** No, but it helps! Local installation gives you:
- All agent definitions and workflows
- Easy access to templates
- Version control
- Update mechanism

You can also just read the files on GitHub and copy what you need.

### Q: Can multiple agents collaborate in Claude Code web?
**A:** Not natively. You'd need to:
- Manually copy outputs between Projects (tedious)
- Build an API orchestration layer (advanced)
- Wait for Claude to support Skills/multi-agent features

### Q: Is my $250 enough?
**A:** Yes, if you're strategic:
- Use for planning and architecture (high-value, low-volume)
- Switch to local IDE for heavy implementation
- Cache and reuse context
- Avoid regenerating documents

### Q: Should I wait for official Claude Code web support?
**A:** No! Start with Option 2 (Projects) today:
- Learn the BMAD methodology
- Test workflows on real projects
- Build muscle memory
- Provide feedback for future BMAD features

### Q: Can I contribute a Claude Code web bundler to BMAD?
**A:** Absolutely! Check `CONTRIBUTING.md`:
1. Discuss in Discord or GitHub Issues
2. Create a proof of concept
3. Submit a PR with the new bundler
4. Help others use BMAD in Claude Code web

---

## Next Steps

### Immediate Actions:
1. ✅ Choose Option 2 (Claude Code web Projects)
2. ✅ Create 3 Projects (PM, Architect, Developer)
3. ✅ Extract agent instructions from `.agent.yaml` files
4. ✅ Upload workflow templates
5. ✅ Test with a small project

### This Week:
1. Run a complete workflow (PRD → Architecture → Stories)
2. Track costs and effectiveness
3. Refine agent instructions based on results
4. Document your process

### This Month:
1. Explore automating Project setup
2. Investigate Claude API for multi-agent orchestration
3. Consider contributing a bundler back to BMAD
4. Share your learnings with the community

### Long-term:
1. Monitor Claude Code web for Skills support
2. Build custom orchestration if needed
3. Contribute improvements to BMAD-METHOD
4. Help others implement BMAD in Claude Code web

---

## Resources

- **BMAD-METHOD Repo**: https://github.com/bmad-code-org/BMAD-METHOD
- **BMAD Discord**: https://discord.gg/gk8jAdXWmj
- **Claude Docs**: https://docs.claude.com
- **Claude API**: https://docs.anthropic.com/claude/reference

## Community

Share your implementation:
- Post in BMAD Discord #general-dev
- Create a GitHub discussion
- Write a blog post
- Help others get started

---

*This guide is a living document. Contribute improvements via PR!*
