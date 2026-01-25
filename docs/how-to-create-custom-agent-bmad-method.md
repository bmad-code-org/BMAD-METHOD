---
title: "Create a Custom Agent Using BMAD Method Workflows"
---

Use the BMAD Method workflows to design, build, and deploy a custom AI agent from initial concept to a delightful interactive persona that users love engaging with. This guide follows the development of a Teacher's Assistant agent to illustrate the concepts, but these same workflows apply to any custom agent project.

## When to Use This

- You want to create a specialized AI persona for specific domain expertise
- You need an agent that guides users through multi-step processes in your field
- You want to design custom interactive workflows beyond standard BMAD agents
- You need an agent that embodies specific communication styles and knowledge areas
- You're building agents for educational, professional, or specialized use cases

## When to Skip This

- Simple modifications to existing agents (use agent customization instead)
- One-off custom prompts or simple AI interactions
- Complex AI systems requiring custom training (this focuses on persona and workflow design)

:::note[Prerequisites]
- BMAD Core Platform installed with BMM module
- Understanding of your target domain and user needs
- Familiarity with BMAD agent interaction patterns
- Access to Brainstorm Agent and Custom Agent Builder workflows
:::

:::tip[Quick Path]
Initialize project → Brainstorm agent concepts → Define agent persona and capabilities → Build agent structure → Create workflows and menus → Test and refine → Deploy and document. The entire process typically takes 2-4 focused work sessions to go from idea to working custom agent.
:::

## Understanding Custom Agent Creation

The BMAD Method approaches custom agent creation through systematic design and implementation workflows that ensure your agent delivers real value and delightful user experiences.

| Phase | Name | What Happens |
|-------|------|--------------|
| 1 | Ideation | Brainstorm agent purpose, capabilities, personality *(collaborative)* |
| 2 | Design | Define agent persona, communication style, knowledge domains *(structured)* |
| 3 | Architecture | Plan agent workflows, menu systems, interaction patterns *(technical)* |
| 4 | Implementation | Build agent files, configure activation sequences *(systematic)* |
| 5 | Testing | Validate agent behavior, refine personality, test workflows *(iterative)* |
| 6 | Deployment | Integrate agent into BMAD ecosystem, create documentation *(production)* |

## Single Agent Method

**All steps accomplished through one agent:**
```
/bmad:bmb:agents:agent-builder
```

The Agent Builder is a comprehensive Expert Agent that guides you through all phases of agent creation in a single workflow session. It handles brainstorming, discovery, type classification, persona development, menu structure, activation planning, and agent compilation without needing multiple specialized agents.

## Steps

### Step 1: Initialize Your Agent Creation Session

**General Process:**
Start the Agent Builder to begin comprehensive agent development using its step-file architecture.

```
/bmad:bmb:agents:agent-builder
3. [CA] Create a new BMAD agent with best practices and compliance
```

**Teacher's Assistant Example:**
When prompted for initial agent concept:
- **Agent name:** "Teacher's Assistant"
- **Primary domain:** "Education and learning facilitation"
- **Target users:** "Students seeking homework help and concept understanding"
- **Agent scope:** "Socratic questioning, scaffolding techniques, progress tracking"

**Your Application:**
Provide these key elements for any agent:
- Clear agent purpose *(e.g., "help therapists with session planning", "guide developers through code reviews", "assist writers with story development")*
- Target user definition *(e.g., "healthcare professionals", "marketing teams", "creative professionals")*
- Domain expertise scope *(e.g., "financial planning", "project management", "technical documentation")*

### Step 2: Brainstorm Agent Concepts and Capabilities

**General Process:**
The Agent Builder includes optional brainstorming in Step 1. When you choose to brainstorm, select from 4 specialized technique approaches:

1. **User-Selected Techniques** - Browse the complete technique library
2. **AI-Recommended Techniques** - Customized suggestions based on your goals *(includes web research)*
3. **Random Technique Selection** - Discover unexpected creative methods
4. **Progressive Technique Flow** - Start broad, then systematically narrow focus

Each approach helps you discover your agent's essence - the living personality AND the utility it provides.

**Teacher's Assistant Example:**
Using AI-Recommended Techniques approach, we discovered:
- **Core purpose:** "Guide students through understanding using educational best practices without providing direct answers"
- **Key capabilities:** "Socratic questioning, scaffolding techniques, progress tracking, adaptive teaching methods"
- **Personality traits:** "Patient mentor, educationally rigorous, never gives up on student learning"

**Your Application:**
Define these elements for any agent:
- **Core purpose:** What main problem does your agent solve for users?
- **Key capabilities:** What specific tasks should your agent excel at?
- **Personality traits:** How should your agent communicate and behave?

### Step 2a: Discovery Conversation Phase

**General Process:**
After brainstorming, the workflow includes a comprehensive discovery conversation that establishes your agent's scope, context, target users, and special features. This prevents re-asking questions in later development phases and generates a comprehensive agent plan document.

**Teacher's Assistant Example:**
Discovery conversation explored:
- **Target Scope:** All educational interactions across grade levels and subjects
- **Primary Context:** Home tutoring and independent study environments
- **Communication Strategy:** Age-appropriate language complexity while maintaining concept integrity
- **Persistence Philosophy:** "No giving up allowed" - always find alternative approaches
- **Progress Tracking:** Subject-specific learning profiles with technique effectiveness monitoring
- **Validation Approaches:** Student explanation + pop-quiz verification of understanding

**Your Application:**
The discovery phase will explore for any agent:
- **Target Scope:** Who specifically will use your agent and in what contexts?
- **Primary Context:** Where and how will your agent be used most frequently?
- **Communication Strategy:** How should your agent adapt its communication style?
- **Core Philosophy:** What principles guide your agent's decision-making?
- **Special Features:** What unique capabilities set your agent apart?

### Step 3: Determine Agent Type and Define Metadata

**General Process:**
The workflow systematically classifies your agent and defines all required metadata properties:
- **Simple Agent:** Single-purpose, stateless, all-in-one file (~250 lines max)
- **Expert Agent:** Persistent memory, sidecar folder, domain-specific expertise
- **Module Agent:** Extends existing BMAD modules or requires multiple interconnected agents

**Teacher's Assistant Example:**
- **Classification:** Expert Agent (requires persistent memory for learning profiles)
- **Rationale:** Student progress tracking, technique effectiveness monitoring, evolving teaching strategies
- **Metadata Properties:**
  - **ID:** `teachers-assistant`
  - **Name:** `Sophia Chen`
  - **Title:** `Educational Learning Facilitator`
  - **Icon:** `🎓`
  - **Module:** `stand-alone`
  - **Has Sidecar:** `true`

**Your Application:**
For any agent, the system will determine:
- **Agent Type:** Based on memory requirements and complexity needs
- **Technical Properties:** ID (kebab-case), persona name, professional title
- **Visual Identity:** Appropriate emoji icon for your domain
- **Ecosystem Placement:** Stand-alone vs integration with existing modules

### Step 4: Develop Four-Field Persona System

**General Process:**
The workflow uses a sophisticated four-field persona system that creates distinct, non-overlapping personality dimensions:
- **Role:** WHAT they do (capabilities, expertise, knowledge areas)
- **Identity:** WHO they are (background, experience, character)
- **Communication Style:** HOW they speak (tone, patterns, voice)
- **Principles:** WHY they act (decision framework, values, constraints)

**Teacher's Assistant Example:**
```yaml
persona:
  role: >
    Educational learning facilitator specializing in Socratic questioning, scaffolding techniques,
    and progress-based teaching that guides students to discover answers rather than providing direct instruction.

  identity: >
    Master educator with deep knowledge of educational psychology, constructivist learning theory,
    and adaptive teaching methods. Passionate advocate for authentic learning through struggle and self-discovery.

  communication_style: >
    Speaks like a patient mentor using strategic questioning, encouraging language, and age-appropriate
    complexity while maintaining conceptual integrity.

  principles:
    - Channel expert educational psychology wisdom: draw upon Zone of Proximal Development, scaffolding techniques, metacognitive strategies, and research-backed methods that facilitate genuine understanding
    - Never provide direct answers - guide students to discover solutions through strategic questioning and multiple explanation pathways
    - Authentic learning requires productive struggle - frustration signals growth, not failure
    - Track what works for each student and adapt techniques accordingly - analogies for some, examples for others
    - Academic boundaries are sacred - redirect non-educational conversations back to learning focus
```

**Your Application:**
For any agent, you'll develop:
- **Role:** Professional capabilities and expertise your agent provides
- **Identity:** Background, experience, and character that makes them credible
- **Communication Style:** How your agent speaks and interacts with users
- **Principles:** Decision framework and values that guide behavior

The first principle serves as an "expert activator" that tells the AI to access domain-specific knowledge and frameworks.

### Step 5: Commands & Menu Structure Design

**General Process:**
Transform discovered capabilities into structured menu commands following BMAD patterns:
- **Capability Review:** Analyze all capabilities from the discovery phase
- **Command Grouping:** Organize related capabilities under logical command areas
- **Menu Pattern Application:** Follow BMAD Expert Agent menu structure requirements
- **Trigger Design:** Create intuitive 2-letter codes and fuzzy match patterns
- **Handler Definition:** Map commands to specific prompts or actions

**Teacher's Assistant Example:**
Created 9 educational commands with Expert Agent architecture:

```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_bmad/_memory/teachers-assistant-sidecar/learning-profiles.md'
  - 'Load COMPLETE file {project-root}/_bmad/_memory/teachers-assistant-sidecar/technique-tracking.md'
  - 'ONLY read/write files in {project-root}/_bmad/_memory/teachers-assistant-sidecar/'

prompts:
  - id: socratic-guidance
    content: |
      <instructions>Guide student through learning using Socratic questioning without giving direct answers</instructions>
      <process>1. Ask strategic questions 2. Use student interests for analogies 3. Encourage discovery 4. Validate understanding</process>

menu:
  - trigger: LG or fuzzy match on learn-guide
    action: '#socratic-guidance'
    description: '[LG] Learning guidance through Socratic questioning'

  - trigger: QM or fuzzy match on quiz-me
    action: 'Generate pop-quiz on recent or struggling concepts from learning profile'
    description: '[QM] Quiz me on challenging concepts'

  - trigger: SA or fuzzy match on study-aids
    action: '#study-aids-generator'
    description: '[SA] Generate study aids (flashcards, practice problems, guides)'
```

**Your Application:**
For any agent, you'll create commands organized by:
- **Primary Functions:** Core capabilities users access most frequently
- **Utility Commands:** Support functions like help, settings, progress tracking
- **Advanced Features:** Specialized tools for power users
- **Memory Management:** For Expert agents with persistent data needs

Design principles include 2-letter triggers, fuzzy matching, action handlers, and proper sidecar integration for Expert agents.

### Step 6: Activation Planning

**General Process:**
Define how your agent behaves when it starts up through critical actions and startup sequences:
- **Reference Loading:** Understanding critical action patterns
- **Routing Decision:** Determining build path (Simple/Expert/Module) based on architecture
- **Activation Needs Discussion:** Deciding autonomous vs responsive behavior patterns
- **Critical Actions Definition:** Specifying startup commands for memory loading and boundaries

**Teacher's Assistant Example:**
```yaml
activation:
  hasCriticalActions: true
  rationale: "Agent needs to auto-load student learning context to provide personalized educational guidance"
  criticalActions:
    - 'Load COMPLETE file {project-root}/_bmad/_memory/teachers-assistant-sidecar/learning-profiles.md'
    - 'Load COMPLETE file {project-root}/_bmad/_memory/teachers-assistant-sidecar/technique-tracking.md'
    - 'ONLY read/write files in {project-root}/_bmad/_memory/teachers-assistant-sidecar/'

routing:
  destinationBuild: "step-07b-build-expert.md"
  rationale: "Expert agent requires sidecar memory for persistent learning profiles"
```

**Your Application:**
For any agent, consider:
- **Startup Needs:** What must your agent load or initialize when it starts?
- **Memory Requirements:** Does your agent need persistent data between sessions?
- **Security Boundaries:** What file access restrictions should be enforced?
- **Operational Philosophy:** Responsive to prompts vs autonomous background tasks?

Routing logic determines the build path based on your agent's architecture needs.

### Step 7: Expert Agent Build and Compilation

**General Process:**
The Agent Builder automatically compiles all phases into the final .agent.yaml file:
1. **Generates Agent YAML:** Combines persona, menu, activation, and metadata
2. **Creates Sidecar Structure:** Sets up memory folders for Expert agents
3. **Validates Configuration:** Ensures BMAD compliance and proper structure
4. **Provides Installation:** Generates installation guidance

**Teacher's Assistant Example:**
Generated complete Expert agent with this structure:
```
agents/
└── teachers-assistant/
    ├── teachers-assistant.agent.yaml    # Complete agent definition
    └── teachers-assistant-sidecar/      # Expert agent memory (build location)
        ├── learning-profiles.md         # Student progress and preferences
        ├── technique-tracking.md        # Teaching method effectiveness data
        └── README.md                   # Sidecar documentation
```

Critical actions use proper path variables: `{project-root}/_bmad/_memory/{sidecar-folder}/` for runtime operation.

**Your Application:**
For any agent, this step produces:
- **Agent YAML:** Complete agent definition with proper BMAD compliance
- **Sidecar Structure:** Memory folders and files for Expert agents
- **Path Configuration:** Proper variable usage for portability
- **Documentation:** README files and installation guidance

### Step 8: Celebration and Installation Guidance

**General Process:**
The Agent Builder provides comprehensive installation instructions and celebrates completion. To make any agent installable, create a standalone BMAD content module with:
- Module directory with `module.yaml` containing `unitary: true`
- Agent files in `agents/agent-name/` structure
- Sidecar folder in `_memory/` for Expert agents

**Teacher's Assistant Example:**
Created this installable module structure:
```
my-educational-agents/
├── module.yaml                              # Contains: unitary: true
├── agents/
│   └── teachers-assistant/
│       ├── teachers-assistant.agent.yaml    # Main agent definition
│       └── _memory/                         # Expert agent memory
│           └── teachers-assistant-sidecar/
│               ├── learning-profiles.md
│               ├── technique-tracking.md
│               └── README.md
```

Installation methods include new project setup or adding to existing BMAD installations.

**Your Application:**
For any agent, follow these installation principles:
- **Module Structure:** Use `unitary: true` for standalone agent modules
- **File Organization:** Place agent files in proper directory hierarchy
- **Memory Management:** Include `_memory/` structure for Expert agents
- **Distribution:** Package entire module directory for sharing

## Installing and Using Your Custom Agent

After completing agent creation, follow these steps to install and start using your new agent:

### Step 1: Create Module Directory Structure

**General Process:**
Transform your agent output into a BMAD-installable module:

```bash
# Navigate to your project root
cd /your/project/root

# Create module directory
mkdir -p my-custom-agents

# Create module configuration
echo "unitary: true" > my-custom-agents/module.yaml

# Create agents directory structure
mkdir -p my-custom-agents/agents
```

### Step 2: Organize Agent Files

**General Process:**
Move your completed agent files into the proper module structure:

```bash
# Copy agent directory from bmb-creations output
cp -r /path/to/_bmad-output/bmb-creations/your-agent my-custom-agents/agents/

# For Expert agents, organize sidecar structure
mkdir -p my-custom-agents/agents/your-agent/_memory
mv my-custom-agents/agents/your-agent/your-agent-sidecar my-custom-agents/agents/your-agent/_memory/
```

**Teacher's Assistant Example:**
```
my-educational-agents/
├── module.yaml                              # Contains: unitary: true
├── agents/
│   └── teachers-assistant/
│       ├── teachers-assistant.agent.yaml    # Main agent definition
│       └── _memory/                         # Expert agent memory
│           └── teachers-assistant-sidecar/
│               ├── learning-profiles.md
│               ├── technique-tracking.md
│               └── README.md
```

### Step 3: Install Module in BMAD

**General Process:**
Add your custom module to an existing or new BMAD project:

**For New Projects:**
1. Run BMAD installer: `npx @bmad-method/cli init`
2. When prompted for local modules, provide the path to your module
3. Installer will automatically integrate your agent

**For Existing Projects:**
1. Run: `npx @bmad-method/cli modify`
2. Select "Add local custom module"
3. Provide path to your module directory
4. Confirm installation

### Step 4: Activate Your Agent

**General Process:**
Once installed, your agent becomes available through BMAD's command system:

```bash
# List available agents (verify your agent appears)
/agents

# Activate your agent using its module path
/bmad:your-module:agents:your-agent
```

**Teacher's Assistant Example:**
```bash
/bmad:my-educational-agents:agents:teachers-assistant
```

### Step 5: Test Agent Functionality

**General Process:**
Start with basic interactions to verify your agent works correctly:

**Initial Activation Test:**
```
/bmad:your-module:agents:your-agent
```

**Basic Conversation Examples:**
- "Hi [Agent Name], what can you help me with?"
- "Show me your available commands"
- "Tell me about your capabilities"

**Teacher's Assistant Example:**
Specific conversation starters that test educational capabilities:
- "Help me understand fractions without giving me the answer"
- "LG" (Learning Guidance command)
- "QM" (Quiz Me command)
- "SA" (Study Aids command)

### Step 6: Verify Expert Agent Memory (If Applicable)

**General Process:**
For Expert agents with sidecar folders, confirm memory persistence:

1. **Start agent and interact with memory commands**
2. **Update profiles or tracking data**
3. **Restart agent and verify data persists**

**Teacher's Assistant Example:**
```
UP (Update Profile command)
LP (Learning Progress command)
```

### Troubleshooting Common Installation Issues

**Agent Not Found:**
- Verify `module.yaml` exists with `unitary: true`
- Check agent file is in `agents/agent-name/agent-name.agent.yaml`
- Confirm BMAD installation included your module

**Sidecar Memory Issues (Expert Agents):**
- Ensure `_memory/agent-sidecar/` structure exists
- Verify critical_actions reference correct file paths
- Check file permissions for read/write access

**Command Not Working:**
- Test basic interaction first before specialized commands
- Verify agent activation completed successfully
- Check for any startup errors in agent logs

### Sharing Your Agent

To share your agent with others:

1. **Package entire module directory:** `my-custom-agents/`
2. **Include installation instructions:** Reference this guide
3. **Provide example interactions:** Show how to use key features
4. **Document dependencies:** Any special requirements or modules

**Distribution Options:**
- **Git Repository:** Push module directory to version control
- **Archive File:** Zip module directory for direct sharing
- **BMAD Community:** Submit to community agent library (if available)

Your custom agent is now ready for production use and can be shared across BMAD installations!

## Summary

The BMAD Agent Builder provides a comprehensive, single-agent solution for creating production-ready BMAD agents. Through its step-file architecture, it guides you through the complete end-to-end process:

1. **Brainstorming** (optional) - Creative exploration using 4 specialized technique approaches
2. **Discovery** - Comprehensive capability and context definition with agent-plan documentation
3. **Type Classification** - Automatic Simple/Expert/Module architecture determination
4. **Four-Field Persona** - Role, identity, communication style, and principles development
5. **Commands & Menu** - Structured command interface with BMAD compliance
6. **Activation Planning** - Critical actions definition and routing determination
7. **Agent Build** - Complete YAML file generation with sidecar structure
8. **Installation Guidance** - Module packaging instructions and testing recommendations

**Complete Agent Creation in One Session:**
```
/bmad:bmb:agents:agent-builder → [CA] Create a new BMAD agent → Continue through all steps
```

**Process Results:**
- **Production-Ready Files:** Complete `.agent.yaml` with proper BMAD compliance
- **Expert Architecture:** Sidecar folder structure with memory files and security boundaries
- **Installation Package:** Module structure with `module.yaml` for BMAD integration
- **Testing Guidelines:** Conversation starters and command validation approaches
- **Documentation:** Comprehensive agent plan and sidecar README for maintenance

**Key Advantages:**
- **Single Agent Workflow:** Complete process without switching between multiple agents
- **BMAD Compliance:** Automatic adherence to all standards, patterns, and architectural requirements
- **Expert Memory Management:** Proper sidecar setup with runtime path variables and file boundaries
- **Specialized Domain Integration:** Research-backed methodology incorporation
- **Production Installation:** Ready-to-install module structure with proper configuration

**Teacher's Assistant Case Study Achievement:**
- **Expert Agent:** 9 educational commands with persistent memory architecture
- **Educational Psychology Integration:** Socratic method, scaffolding techniques, ZPD assessment
- **Complete Workflow:** From concept to installable module in single session
- **Memory Architecture:** Student learning profiles and technique effectiveness tracking
- **BMAD Compliance:** Full validation and proper sidecar configuration

**Time Investment:**
Typically 2-4 focused work sessions to go from initial idea to production-ready, installable custom agent with comprehensive capabilities and professional-quality implementation.

The BMAD Agent Creation Method transforms agent concepts into production-ready implementations efficiently and systematically, handling all technical complexity while maintaining focus on agent personality and user value delivery.