# Using BMad Web Bundles in Gemini Gems & Custom GPTs

Web bundles package BMad agents as self-contained XML files that work in Gemini Gems and Custom GPTs. Everything the agent needs - instructions, workflows, dependencies - is bundled into a single file.

## What Are Web Bundles?

Web bundles are standalone XML files containing:

- Complete agent persona and instructions
- All workflows and dependencies
- Interactive menu system
- Party mode for multi-agent collaboration
- No external files required

**Perfect for:** Uploading a single file to a Gemini GEM or Custom GPT to use BMad Method from the Web, generally at a huge cost savings, at the expense of some quality and convenience of using locally.

## Critical Setup Rules

**READ THIS FIRST - Following these rules ensures BMad works correctly in Gemini/GPT:**

1. **ONE file per Gem/GPT** - Upload exactly ONE XML file per Gemini Gem or Custom GPT instance. Do NOT combine multiple agent files.

2. **Use the setup instructions** - When creating your Gem/GPT, you MUST add the configuration prompt (shown in Quick Start below) so it knows how to read the XML file.

3. **Enable Canvas/Code Execution** - This is ESSENTIAL for document generation workflows (PRD, Architecture, etc.). Enable this in your Gem/GPT settings.

4. **Gemini Gems are strongly preferred** - They work significantly better than Custom GPTs for BMad workflows.

5. **Team bundles = Gemini 2.5 Pro+ only** - Team bundles (multiple agents) have terrible performance in Custom GPTs due to context limits. Only use them with Gemini 2.5 Pro or higher.

6. **Create separate Gems for each agent** - Make a PM Gem, an Architect Gem, a Developer Gem, etc. Don't try to combine them (except via official team bundles).

## Quick Start

### 1. Get Web Bundle Files

**Option A: Download Pre-Bundled Files (Quickest)**

Download ready-to-use bundles directly from GitHub:

**[→ Browse Web Bundles on GitHub](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/web-bundles)**

Navigate to the module folder (bmm, bmb, cis, bmgd) → agents folder → download the `.xml` file you need.

**Option B: Generate from Local Installation**

From your BMad project directory:

```bash
# Generate all agent bundles
npm run bundle

# Or generate specific bundles
node tools/cli/bundlers/bundle-web.js module bmm
node tools/cli/bundlers/bundle-web.js agent bmm dev
```

**Output location:** `web-bundles/` directory

```
web-bundles/
├── bmm/
│   ├── agents/     # Individual agents
│   └── teams/      # Multi-agent teams
├── bmb/
├── cis/
└── bmgd/
```

### 2. Upload to Gemini Gems (Recommended)

**IMPORTANT: Create ONE Gem per agent file. Do NOT upload multiple agent files to a single Gem.**

**Create a Gem:**

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "New Gem" or "Create Gem"
3. Give your Gem a name (e.g., "BMad PM Agent")
4. **Enable "Code execution" for best results with document generation**
5. In the **System Instructions** field, add this EXACT text (customize the config values):

```
All of your operating instructions and resources are contained in the XML file attached. Read in the initial agent block and instructions to understand it. You will not deviate from the character and rules outlined in the attached!

CONFIG.YAML Values:
- user_name: [Your Name]
- communication_language: English
- user_skill_level: [Beginner|Intermediate|Expert]
- document_output_language: English
- bmm-workflow-status: standalone (no workflow)
```

6. **Upload ONE XML file** (e.g., `pm.xml`) - either attach as a file or paste contents
7. Save and test your Gem by typing `*help` to see the menu

**Tips for Gemini:**

- **Enable Code Execution/Canvas** - Critical for document output (PRDs, architecture docs, etc.)
- **Use Gemini 2.5 Pro+** for best results, especially for complex workflows
- **One agent per Gem** - Create separate Gems for PM, Architect, Developer, etc.
- Test the agent by triggering menu items with `*workflow-name`

### 3. Upload to Custom GPTs

**IMPORTANT: Create ONE Custom GPT per agent file. Do NOT upload multiple agent files to a single GPT.**

**Create a Custom GPT:**

1. Go to [ChatGPT](https://chat.openai.com/)
2. Click your profile → "My GPTs" → "Create a GPT"
3. Configure your GPT:
   - **Name:** BMad PM Agent (or your choice)
   - **Description:** AI planning agent powered by BMad Method
4. In the **Instructions** field, add this EXACT text at the top (customize the config values):

```
All of your operating instructions and resources are contained in the XML file attached. Read in the initial agent block and instructions to understand it. You will not deviate from the character and rules outlined in the attached!

CONFIG.YAML Values:
- user_name: [Your Name]
- communication_language: English
- user_skill_level: [Beginner|Intermediate|Expert]
- document_output_language: English
- bmm-workflow-status: standalone (no workflow)
```

5. **Below that text**, paste the entire contents of ONE XML file (e.g., `pm.xml`)
6. **Enable "Canvas" in ChatGPT settings** for better document output
7. Save and test by typing `*help`

**Tips for Custom GPTs:**

- **Enable Canvas** - Essential for workflow document generation
- **One agent per GPT** - Create separate GPTs for each agent
- Custom GPTs have smaller context windows than Gemini - avoid team bundles
- Works best with focused agents (PM, Analyst, Architect)

## Available Web Bundles

After running `npm run bundle`, you'll have access to:

### BMad Method (BMM) Agents

- **analyst.xml** - Business analysis and requirements gathering
- **architect.xml** - System architecture and technical design
- **dev.xml** - Full-stack development and implementation
- **pm.xml** - Product management and planning
- **sm.xml** - Scrum master and agile facilitation
- **tea.xml** - Test architecture and quality assurance
- **tech-writer.xml** - Technical documentation
- **ux-designer.xml** - User experience design
- **game-designer.xml** - Game design and mechanics
- **game-dev.xml** - Game development
- **game-architect.xml** - Game architecture

### BMad Builder (BMB) Agent

- **bmad-builder.xml** - Create custom agents, workflows, and modules

### Creative Intelligence Suite (CIS) Agents

- **brainstorming-coach.xml** - Creative brainstorming facilitation
- **design-thinking-coach.xml** - Human-centered problem solving
- **innovation-strategist.xml** - Innovation and strategy
- **creative-problem-solver.xml** - Breakthrough problem solving
- **storyteller.xml** - Narrative and storytelling

### Team Bundles (Multi-Agent Collaboration)

**CRITICAL: Team bundles are ONLY recommended for Gemini 2.5 Pro+ in the web. The experience is poor with Custom GPTs due to limited context windows.**

- **bmm/teams/team-fullstack.xml** - Full BMad Method development team
- **bmgd/teams/team-gamedev.xml** - Game development team
- **cis/teams/creative-squad.xml** - Creative Intelligence team

**When to use team bundles:**

- You want multiple agents collaborating in one Gem
- You're using Gemini 2.5 Pro+ (required)
- You need diverse perspectives on complex problems

**When to use individual agents instead:**

- Using Custom GPTs (always use individual agents)
- Want focused expertise from a single agent
- Need faster, more streamlined interactions

## Recommended Workflow: Web Planning → Local Implementation

**Save significant costs** by doing planning phases in web bundles, then switching to local IDE for implementation.

### Cost-Saving Strategy

**Phase 1-3: Do in Web (Major Cost Savings)**

Use Gemini Gems or Custom GPTs for these workflows:

1. **Analysis Phase** (Analyst, PM)
   - `*brainstorm-project` - Brainstorm ideas and features
   - `*research` - Market and technical research
   - `*product-brief` - Create product vision

2. **Planning Phase** (PM)
   - `*prd` - Generate comprehensive Product Requirements Document
   - `*create-epics-and-stories` - Break down into development stories

3. **Solutioning Phase** (Architect, UX Designer)
   - `*architecture` - Define technical architecture
   - `*create-ux-design` - Design user experience

**Export Artifacts:**
After each workflow, copy/download the generated documents (PRD, Architecture, UX Design, etc.)

**Phase 4: Switch to Local IDE (Required for Implementation)**

1. Save exported artifacts to your project's `docs/` folder
2. Run local BMad installation with `*workflow-init`
3. BMad will detect the existing artifacts and update workflow status
4. Proceed with implementation using Developer agent locally

**Why this works:**

- **Planning workflows** are token-heavy but don't need code context
- **Web models (Gemini/GPT)** handle planning excellently at lower cost
- **Local IDE implementation** needs full codebase access and tools
- **Best of both worlds**: Cost savings + full implementation capabilities

**Typical savings:** 60-80% cost reduction by doing analysis, planning, and architecture in web before moving to local implementation.

## Using Web Bundles

### Basic Usage

**1. Load the Agent**

Upload or paste the XML file into Gemini/GPT. The agent will introduce itself and show its menu.

**2. Choose a Workflow**

Use natural language or shortcuts:

```
"Run the PRD workflow"
*prd

"Start brainstorming"
*brainstorm-project

"Show me the menu"
*help
```

**3. Follow the Workflow**

The agent guides you through the workflow step-by-step, asking questions and creating deliverables.

### Advanced Features

**Party Mode**

All web bundles include party mode for multi-agent collaboration:

```
*party
```

This activates multiple agents who collaborate on your task, providing diverse perspectives.

**Context Loading**

Some workflows load additional context:

```
*workflow-init  # Initialize project workflow
*document-project  # Analyze existing codebase
```

**Dynamic Menus**

Agents adapt their menus based on project phase and available workflows.

## Platform Differences

### Gemini Gems (Strongly Recommended)

**Pros:**

- Better XML parsing and handling
- Handles large bundles well
- Supports complex workflows
- Larger context window (better for team bundles)
- Code execution for document generation
- Works excellently with BMad workflows

**Cons:**

- Requires Google account
- May have rate limits on free tier

**Best for:**

- All individual agents (PM, Architect, Developer, UX Designer, etc.)
- Team bundles (requires Gemini 2.5 Pro+)
- Complex multi-step workflows
- Document-heavy workflows (PRD, Architecture)

**Recommended Model:** Gemini 2.5 Pro or higher

### Custom GPTs

**Pros:**

- Familiar ChatGPT interface
- Good for conversational workflows
- Easy sharing with team via link

**Cons:**

- Smaller context window than Gemini
- Character limit on instructions (large bundles may not fit)
- **NOT recommended for team bundles**
- Canvas feature less mature than Gemini's code execution

**Best for:**

- Individual focused agents (PM, Analyst, Architect)
- Creative agents (CIS)
- Simpler workflows (product-brief, brainstorm-project)
- Quick prototyping

**NOT recommended for:** Team bundles, Developer agent, complex technical workflows

## Customization

**Before Bundling:**

Customize agents using the [Agent Customization Guide](./agent-customization-guide.md):

1. Edit `{bmad_folder}/_cfg/agents/<agent>.customize.yaml`
2. Rebuild: `npx bmad-method build <agent-name>`
3. Generate bundles: `npm run bundle`

Your customizations will be included in the web bundles.

**After Bundling:**

You can manually edit the XML to:

- Change agent name (search for `<name>`)
- Modify persona (search for `<persona>`)
- Add custom instructions (in `<critical>` blocks)

## Troubleshooting

**Agent not responding correctly?**

- Check that the entire XML file was uploaded
- Verify no truncation occurred (Gemini/GPT have character limits)
- Try a simpler agent first (analyst, pm)

**Menu items not working?**

- Use the `*` prefix for shortcuts: `*prd` not `prd`
- Or use natural language: "Run the PRD workflow"
- Check the agent's menu with `*help`

**Workflows failing?**

- Some workflows expect project files (not available in web context)
- Use workflows designed for planning/analysis in web bundles
- For implementation workflows, use local IDE installation

**File too large for GPT?**

- Split into sections and use multiple GPTs
- Use Gemini Gems instead (better for large files)
- Generate single-agent bundles instead of team bundles

## Best Practices

1. **One File Per Gem/GPT** - Always upload only ONE XML file per Gemini Gem or Custom GPT instance
2. **Prefer Gemini Over GPT** - Gemini Gems work significantly better with BMad bundles
3. **Enable Canvas/Code Execution** - Essential for document generation workflows (PRD, Architecture, etc.)
4. **Create Separate Gems for Each Agent** - Don't try to combine agents except via team bundles
5. **Team Bundles = Gemini 2.5 Pro+ Only** - Never use team bundles with Custom GPTs
6. **Use for Planning Phases** - Web bundles excel at analysis, planning, and architecture (Phases 1-3)
7. **Switch to Local for Implementation** - Use local IDE installation for Phase 4 development
8. **Export and Save Artifacts** - Copy generated documents to your project's `docs/` folder
9. **Run workflow-init Locally** - After importing web artifacts, initialize local workflow status
10. **Keep Updated** - Rebuild bundles after BMad updates to get latest improvements

## Examples

### Example 1: Complete Web → Local Workflow (Recommended)

**Goal:** Build a new SaaS product with maximum cost savings

**Phase 1-3: Web Planning (Gemini Gems)**

1. **Download bundles:**
   - `bmm/agents/analyst.xml`
   - `bmm/agents/pm.xml`
   - `bmm/agents/architect.xml`
   - `bmm/agents/ux-designer.xml`

2. **Create 4 separate Gemini Gems** (one per agent, enable Code Execution)

3. **Analysis (Analyst Gem):**
   - Run: `*brainstorm-project` → Generate ideas
   - Run: `*research` → Market analysis
   - Export: Save research findings

4. **Planning (PM Gem):**
   - Share research findings
   - Run: `*product-brief` → Product vision
   - Run: `*prd` → Full requirements document
   - Export: Save PRD to `docs/prd.md`

5. **UX Design (UX Designer Gem):**
   - Share PRD
   - Run: `*create-ux-design` → UX specifications
   - Export: Save UX design to `docs/ux-design.md`

6. **Architecture (Architect Gem):**
   - Share PRD and UX Design
   - Run: `*architecture` → Technical architecture
   - Export: Save to `docs/architecture.md`

**Phase 4: Local Implementation**

7. **Setup local BMad:**
   - Install BMad locally: `npx bmad-method@alpha install`
   - Place exported docs in project `docs/` folder
   - Load Developer agent
   - Run: `*workflow-init` → BMad detects artifacts, suggests next steps

8. **Implement:**
   - Run: `*sprint-planning` → Set up sprint
   - Run: `*dev-story` → Implement features
   - Use full IDE capabilities with codebase access

**Cost Savings:** 60-80% by doing planning in Gemini before local implementation

### Example 2: Quick Brainstorming Session

1. Download `cis/agents/brainstorming-coach.xml`
2. Create Gemini Gem with Code Execution enabled
3. Run: `*brainstorming`
4. Choose technique (e.g., SCAMPER, Mind Mapping)
5. Generate and refine ideas
6. Export results for team review

### Example 3: Architecture Review

1. Download `bmm/agents/architect.xml`
2. Create Gemini Gem (enable Code Execution)
3. Paste existing PRD into conversation
4. Run: `*architecture`
5. Collaborate on technical decisions
6. Export architecture document to `docs/architecture.md`

## Next Steps

- **[Agent Customization Guide](./agent-customization-guide.md)** - Customize before bundling
- **[BMM Documentation](../src/modules/bmm/docs/README.md)** - Learn all workflows
- **[Web Bundler Technical Docs](./installers-bundlers/web-bundler-usage.md)** - Advanced bundling options
- **[Contributing Guide](../CONTRIBUTING.md)** - Help improve web bundles

## Resources

- **[Google AI Studio](https://aistudio.google.com/)** - Create Gemini Gems
- **[Custom GPTs](https://chat.openai.com/gpts)** - Build Custom GPTs
- **[BMad Discord](https://discord.gg/gk8jAdXWmj)** - Get help and share your Gems/GPTs
