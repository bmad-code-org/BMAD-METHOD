# Step 0.1: Welcome & Orientation

## PRESENT WDS INTRODUCTION

<output>
**Welcome to Whiteport Design Studio (WDS)**

WDS is a **design methodology** that helps you create great digital products through structured workflows.

---

### What WDS Does

**For NEW products** (Greenfield):
- Phase 1: Define your vision (Project Brief)
- Phase 2: Understand your users (Trigger Mapping)
- Phase 3: Specify features (PRD Platform)
- Phase 4: Design the experience (UX Design)
- Phase 5: Build consistency (Design System)
- Phase 6: Hand off to developers (Design Deliveries)
- Phase 7: Validate quality (Testing)

**For EXISTING products** (Brownfield):
- Phase 8: Strategic improvements (Kaizen approach)
- Limited Brief (document what exists)
- Focused improvements (not complete redesigns)
- Continuous iteration cycles

---

### What WDS is NOT

- Not a code framework
- Not a UI library
- Not a one-size-fits-all template

WDS is a **thinking framework** with templates to guide your design decisions.

---

### The Agents

Three specialized agents help you:

| Agent | Domain | Specialty |
|-------|--------|-----------|
| **Saga** | Strategy | Project Briefs, user research, requirements |
| **Freya** | Design | UX/UI, wireframes, specifications, prototypes |
| **Idunn** | Technical | Architecture, APIs, implementation specs |

You're currently working with one of these agents.
</output>

---

## ASK PROJECT TYPE

<ask>
**What type of project is this?**

Understanding your starting point ensures you follow the right workflow.

---

**[A] NEW Product (Greenfield)**

You're building something from scratch:
- No existing codebase (or starting fresh)
- Defining the product vision
- Designing before coding

→ *Leads to Phase 1: Project Brief*

---

**[B] EXISTING Product (Brownfield)**

You're improving something that exists:
- Working codebase already built
- Want to add features or fix issues
- Improving, not rebuilding

→ *Leads to Phase 8: Existing Product Entry*

---

**[C] NOT SURE**

You have some code but unsure of the approach:
- Partial implementation exists
- Unclear if you should continue or restart
- Need help deciding

→ *We'll analyze your project together*

---

**Your choice (A, B, or C):**
</ask>

---

## ROUTING

<action>
Based on user response:

**If [A] NEW Product:**
1. Confirm: "Great! You'll follow Phases 1-7 to build your product."
2. Continue to: `step-0.2-structure.md` (setup greenfield structure)
3. Then route to: Phase 1 Project Brief

**If [B] EXISTING Product:**
1. Confirm: "Perfect! You'll use Phase 8 with the Kaizen approach."
2. Continue to: `step-0.2-structure.md` (setup brownfield structure)
3. Then route to: Phase 8.1 Identify Opportunity

**If [C] NOT SURE:**
1. Ask: "Let me scan your project to understand what exists."
2. Scan for:
   - `src/` or `app/` folders with code
   - `package.json` with dependencies
   - Existing documentation
3. Based on scan:
   - Significant code exists → Recommend [B] Brownfield
   - Minimal/no code → Recommend [A] Greenfield
   - Ask user to confirm recommendation
</action>

---

## EXAMPLES

### Example: User chooses [A] NEW

```
User: A

Agent: Great! You're building a new product from scratch.

You'll follow the Greenfield workflow:
├─ Phase 1: Project Brief (define vision)
├─ Phase 2: Trigger Mapping (understand users)
├─ Phase 3: PRD Platform (specify features)
├─ Phase 4: UX Design (design experience)
├─ Phase 5: Design System (build consistency)
├─ Phase 6: Design Deliveries (hand off)
└─ Phase 7: Testing (validate quality)

Let's set up your project structure first...
```

### Example: User chooses [B] EXISTING

```
User: B

Agent: Perfect! You're improving an existing product.

You'll use the Brownfield workflow (Phase 8):
├─ Create Limited Brief (document what exists)
├─ Identify improvement opportunities
├─ Design focused updates (not complete redesigns)
├─ Implement incrementally (Kaizen approach)
└─ Monitor and iterate

This approach respects your existing codebase while
making strategic improvements.

Let's set up your project structure...
```

### Example: User chooses [C] NOT SURE

```
User: C

Agent: No problem! Let me scan your project...

Scanning...
├─ Found: src/ with 45 component files
├─ Found: package.json (React, TypeScript)
├─ Found: Functional authentication flow
├─ Found: Database integration (Supabase)
└─ No WDS documentation found

Analysis: You have a substantial existing codebase.

Recommendation: Use the BROWNFIELD workflow (Phase 8)
- Document what exists with a Limited Brief
- Identify specific improvements to make
- Use Kaizen approach for incremental changes

This preserves your work while adding WDS methodology.

Does this recommendation sound right? (Y/N)
```

---

## COMPLETION

<output>
Project type confirmed: [Greenfield/Brownfield]

Next: Set up your project structure.

[Continue to Step 0.2: Project Structure]
</output>

---

_Phase 0: Project Setup — Step 0.1: Welcome & Orientation_
