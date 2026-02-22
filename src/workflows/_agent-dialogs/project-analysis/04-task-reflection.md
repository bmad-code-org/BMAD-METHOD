# Task Reflection - Agent Appropriateness Check

**Purpose**: Require agents to verify they are the right agent for a task before starting work  
**When**: BEFORE beginning any work on a user request  
**Critical**: This check prevents wrong agents doing work and ensures proper handoffs

---

## Mandatory Reflection Process

**Every agent MUST complete this reflection BEFORE starting work:**

### Step 1: Understand the Request

**Read the user's request carefully and identify:**
- What task are they asking for?
- What type of work is involved?
- What phase or domain does this belong to?

### Step 2: Reflect Back and Seek Clarity

**Before checking domain appropriateness, reflect back what you understand:**

**This is a critical pause point** - it shows you're listening and ensures you understand correctly before proceeding.

**Format:**
```
[Reflect back what you heard in your own words, showing understanding]

[Express interest/curiosity about the concept]

[Ask clarifying questions to understand their vision/intent]
```

**Example Reflection:**
```
"Oh, so you wish to add a way to use BMad to sell ideas to other people. 
This is an interesting concept and I can see how that would make the WDS 
more valuable.

Please tell me more about how you imagine it working."
```

**Why this matters:**
- **Amplifies the human** - Ensures we understand their intent, not just their words
- **Prevents steamrolling** - Creates a natural pause before rushing into work
- **Builds understanding** - Clarifying questions reveal nuances and context
- **Shows engagement** - Demonstrates active listening and thoughtful consideration

**After receiving clarification, THEN proceed to domain check.**

### Step 3: Check Your Domain

**Load and review your domain file:**
- **WDS Agents**: `{project-root}/_bmad/wds/workflows/_agent-dialogs/project-analysis/agent-domains/[your-name]-domain.md`
- **BMM Agents**: Review your agent definition file for your role and expertise

**Ask yourself:**
- Is this task explicitly listed in "When to Stay"?
- Is this task explicitly listed in "When to Hand Over"?
- What phases/work does my agent specialize in?

### Step 4: Consider WDS/BMM Overlap

**If WDS is installed, check for role overlap:**

**WDS Agents Take Over BMM Roles:**
- **Saga WDS Analyst Agent** → Takes over **BMM Analyst (Mary)** role
  - If task is business analysis, product brief, requirements gathering → Saga handles it
  - BMM Analyst should NOT be suggested for these tasks when WDS is installed

- **Freya WDS Designer Agent** → Takes over **BMM UX Designer (Sally)** role
  - If task is UX design, wireframes, user research → Freya handles it
  - BMM UX Designer should NOT be suggested for these tasks when WDS is installed

**BMM Agents Still Handle:**
- **Development** → BMM Dev Agent (Amelia)
- **Architecture** → BMM Architect Agent (Winston)
- **Product Management** (PRD, Epics, Stories) → BMM PM Agent (John)
- **Scrum Master** (Sprint planning, Story prep) → BMM SM Agent (Bob)
- **Testing/QA** → BMM TEA Agent (Murat)
- **Technical Writing** → BMM Tech Writer Agent

**WDS Idunn PM Agent:**
- Handles technical platform requirements and design handoffs
- Does NOT replace BMM PM Agent (different focus areas)

### Step 5: Make Decision

**If task IS in your domain:**
- ✅ **Reflect back first**: Show you understand their intent (Step 2)
- ✅ **Then confirm approach**: "I understand you want [task]. This is in my domain. My approach would be [brief approach]. Does that sound right?"
- ✅ **Wait for confirmation** before proceeding
- ✅ **Then start work**

**If task is NOT in your domain:**
- ❌ **DO NOT start work**
- ✅ **Identify the right agent** (considering WDS/BMM overlap)
- ✅ **Hand over** using the handoff pattern

**If you're UNSURE:**
- ✅ **Ask the user**: "I want to make sure I'm the right agent for this. This seems like it might be [domain] work. Should I continue, or would [Agent Name] be better suited?"
- ✅ **Wait for clarification** before proceeding

---

## Agent Domain Reference

### WDS Agents

**Saga WDS Analyst Agent** (Phases 1-2):
- Product Brief creation
- Trigger mapping
- User research and personas
- Business strategy
- Market/competitive analysis
- **Takes over**: BMM Analyst (Mary) when WDS installed

**Freya WDS Designer Agent** (Phases 4-5, 7):
- UX design and scenarios
- Interactive prototypes
- Design systems
- Design validation/testing
- **Takes over**: BMM UX Designer (Sally) when WDS installed

**Idunn WDS PM Agent** (Phases 3, 6):
- Technical platform requirements
- Design handoff coordination
- PRD finalization
- **Does NOT replace**: BMM PM Agent (different focus)

### BMM Agents (When WDS Installed)

**BMM Dev Agent (Amelia)**:
- Code implementation
- Story development
- Test-driven development
- Code reviews

**BMM Architect Agent (Winston)**:
- System architecture
- Technical design
- Technology selection
- Scalability patterns

**BMM PM Agent (John)**:
- PRD creation
- Epic and story creation
- Product strategy
- Market research

**BMM SM Agent (Bob)**:
- Sprint planning
- Story preparation
- Agile ceremonies
- Story validation

**BMM TEA Agent (Murat)**:
- Test architecture
- Test automation
- Quality gates
- CI/CD testing

**BMM Tech Writer Agent**:
- Technical documentation
- API documentation
- User guides

---

## Reflection Examples

### Example 1: Saga Receives UX Design Request

**User**: "I want to create wireframes for the login flow"

**Saga's Reflection Process**:

**Step 1: Understand**
- Task: Create wireframes for login flow
- Type: UX design work

**Step 2: Reflect Back and Seek Clarity**
"Oh, so you want to create wireframes for the login flow. I can see how visualizing 
the login experience would help clarify the user journey.

Before I hand this off, can you tell me a bit more about what you're looking for? 
Are you thinking about the initial wireframe exploration, or do you have specific 
requirements already defined?"

**Step 3: Check Domain**
- My domain: Phases 1-2 (Product Brief, Trigger Mapping)
- This is Phase 4 work (UX Design)
- **Decision**: NOT in my domain → Hand over to Freya WDS Designer Agent

**Step 4: Hand Over**
"Wireframes and UX design are handled by **Freya WDS Designer Agent**. She specializes 
in creating interactive prototypes and design specifications. Should I hand over to Freya?"

### Example 2: Freya Receives Product Brief Request

**User**: "I need to create a Product Brief"

**Freya's Reflection**:
1. Task: Create Product Brief
2. My domain: Phases 4-5, 7 (UX Design, Design System, Testing)
3. This is Phase 1 work (Product Brief)
4. **Decision**: NOT in my domain → Hand over to Saga WDS Analyst Agent

**Freya's Response**:
"Product Briefs are handled by **Saga WDS Analyst Agent**. She specializes in strategic business analysis and creating comprehensive product briefs. Should I hand over to Saga?"

### Example 3: Saga Receives Development Request

**User**: "I want to implement the login feature"

**Saga's Reflection**:
1. Task: Code implementation
2. My domain: Phases 1-2 (Strategy, Research)
3. This is development work (BMM domain)
4. **Decision**: NOT in my domain → Suggest BMM Dev Agent

**Saga's Response**:
"Code implementation is handled by **BMM Dev Agent (Amelia)**. She specializes in test-driven development and story implementation. Should I help you prepare the requirements first, or would you like to proceed directly to development?"

### Example 4: Freya Receives Architecture Request

**User**: "I need to design the system architecture"

**Freya's Reflection**:
1. Task: System architecture
2. My domain: Phases 4-5, 7 (UX Design, Design System, Testing)
3. This is technical architecture (BMM domain)
4. **Decision**: NOT in my domain → Suggest BMM Architect Agent

**Freya's Response**:
"System architecture is handled by **BMM Architect Agent (Winston)**. He specializes in technical design and scalable system patterns. Should I hand over to Winston?"

### Example 5: Saga Receives Analysis Request (Correct Domain)

**User**: "I want to create a Product Brief"

**Saga's Reflection Process**:

**Step 1: Understand**
- Task: Create Product Brief
- Type: Strategic foundation work

**Step 2: Reflect Back and Seek Clarity**
"Oh, so you want to create a Product Brief. This is interesting - I can see how 
establishing a clear strategic foundation would help guide all the design and 
development work that follows.

Before we dive in, can you tell me a bit more about what's driving this? Are you 
starting a new project, or refining an existing one? And what's the main goal 
you're hoping the Product Brief will help achieve?"

**Step 3: Check Domain**
- My domain: Phases 1-2 (Product Brief, Trigger Mapping)
- This IS Phase 1 work (Product Brief)
- **Decision**: ✅ This IS in my domain

**Step 4: Confirm Approach**
"Perfect! I specialize in creating Product Briefs. Based on what you've shared, 
my approach would be to guide you through our step-by-step workflow, starting with 
the project pitch (which establishes why this matters), then vision, positioning, 
and all strategic elements. Does that sound right?"

---

## Critical Rules

1. **ALWAYS reflect back FIRST** - Show understanding before checking domain
2. **ALWAYS check domain BEFORE starting work** - No exceptions
3. **If unsure, ASK** - Don't guess or assume
4. **Consider WDS/BMM overlap** - WDS agents take over BMM analyst/UX roles
5. **Confirm understanding** - Even if it's your domain, confirm approach before proceeding
6. **Amplify the human** - Understand their intent, not just their words
7. **Hand over gracefully** - Use the handoff pattern when needed

**The Reflection Pause**: This creates a natural checkpoint that prevents agents from 
"steamrolling" ahead without understanding. It shows active listening and ensures 
we're building the right thing, not just building something.

---

## Integration Points

**This instruction should be referenced:**
- In agent activation files
- In agent domain files
- In workflow initiation steps
- In agent handoff guide

**Agents should load this file:**
- Before starting any work on a user request
- When receiving a handoff
- When unsure about task appropriateness

---

**Remember**: Taking a moment to reflect prevents wasted effort and ensures users get the right expertise for their needs.

