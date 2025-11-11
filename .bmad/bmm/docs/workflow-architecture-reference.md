# Decision Architecture Workflow - Technical Reference

**Module:** BMM (BMAD Method Module)
**Type:** Solutioning Workflow

---

## Overview

The Decision Architecture workflow is a complete reimagining of how architectural decisions are made in the BMAD Method. Instead of template-driven documentation, this workflow facilitates an intelligent conversation that produces a **decision-focused architecture document** optimized for preventing AI agent conflicts during implementation.

---

## Core Philosophy

**The Problem**: When multiple AI agents implement different parts of a system, they make conflicting technical decisions leading to incompatible implementations.

**The Solution**: A "consistency contract" that documents all critical technical decisions upfront, ensuring every agent follows the same patterns and uses the same technologies.

---

## Key Features

### 1. Starter Template Intelligence ⭐ NEW

- Discovers relevant starter templates (create-next-app, create-t3-app, etc.)
- Considers UX requirements when selecting templates (animations, accessibility, etc.)
- Searches for current CLI options and defaults
- Documents decisions made BY the starter template
- Makes remaining architectural decisions around the starter foundation
- First implementation story becomes "initialize with starter command"

### 2. Adaptive Facilitation

- Adjusts conversation style based on user skill level (beginner/intermediate/expert)
- Experts get rapid, technical discussions
- Beginners receive education and protection from complexity
- Everyone produces the same high-quality output

### 3. Dynamic Version Verification

- NEVER trusts hardcoded version numbers
- Uses WebSearch to find current stable versions
- Verifies versions during the conversation
- Documents only verified, current versions

### 4. Intelligent Discovery

- No rigid project type templates
- Analyzes PRD to identify which decisions matter for THIS project
- Uses knowledge base of decisions and patterns
- Scales to infinite project types

### 5. Collaborative Decision Making

- Facilitates discussion for each critical decision
- Presents options with trade-offs
- Integrates advanced elicitation for innovative approaches
- Ensures decisions are coherent and compatible

### 6. Consistent Output

- Structured decision collection during conversation
- Strict document generation from collected decisions
- Validated against hard requirements
- Optimized for AI agent consumption

---

## Workflow Structure

```
Step 0: Validate workflow and extract project configuration
Step 0.5: Validate workflow sequencing
Step 1: Load PRD and understand project context
Step 2: Discover and evaluate starter templates ⭐ NEW
Step 3: Adapt facilitation style and identify remaining decisions
Step 4: Facilitate collaborative decision making (with version verification)
Step 5: Address cross-cutting concerns
Step 6: Define project structure and boundaries
Step 7: Design novel architectural patterns (when needed) ⭐ NEW
Step 8: Define implementation patterns to prevent agent conflicts
Step 9: Validate architectural coherence
Step 10: Generate decision architecture document (with initialization commands)
Step 11: Validate document completeness
Step 12: Final review and update workflow status
```

---

## Files in This Workflow

- **workflow.yaml** - Configuration and metadata
- **instructions.md** - The adaptive facilitation flow
- **decision-catalog.yaml** - Knowledge base of all architectural decisions
- **architecture-patterns.yaml** - Common patterns identified from requirements
- **pattern-categories.csv** - Pattern principles that teach LLM what needs defining
- **checklist.md** - Validation requirements for the output document
- **architecture-template.md** - Strict format for the final document

---

## How It's Different from Old architecture

| Aspect               | Old Workflow                                 | New Workflow                                    |
| -------------------- | -------------------------------------------- | ----------------------------------------------- |
| **Approach**         | Template-driven                              | Conversation-driven                             |
| **Project Types**    | 11 rigid types with 22+ files                | Infinite flexibility with intelligent discovery |
| **User Interaction** | Output sections with "Continue?"             | Collaborative decision facilitation             |
| **Skill Adaptation** | One-size-fits-all                            | Adapts to beginner/intermediate/expert          |
| **Decision Making**  | Late in process (Step 5)                     | Upfront and central focus                       |
| **Output**           | Multiple documents including faux tech-specs | Single decision-focused architecture            |
| **Time**             | Confusing and slow                           | 30-90 minutes depending on skill level          |
| **Elicitation**      | Never used                                   | Integrated at decision points                   |

---

## Expected Inputs

- **PRD** (Product Requirements Document) with:
  - Functional Requirements
  - Non-Functional Requirements
  - Performance and compliance needs

- **Epics** file with:
  - User stories
  - Acceptance criteria
  - Dependencies

- **UX Spec** (Optional but valuable) with:
  - Interface designs and interaction patterns
  - Accessibility requirements (WCAG levels)
  - Animation and transition needs
  - Platform-specific UI requirements
  - Performance expectations for interactions

---

## Output Document

A single `architecture.md` file containing:

- Executive summary (2-3 sentences)
- Project initialization command (if using starter template)
- Decision summary table with verified versions and epic mapping
- Complete project structure
- Integration specifications
- Consistency rules for AI agents

---

## How Novel Pattern Design Works

Step 7 handles unique or complex patterns that need to be INVENTED:

### 1. Detection

The workflow analyzes the PRD for concepts that don't have standard solutions:

- Novel interaction patterns (e.g., "swipe to match" when Tinder doesn't exist)
- Complex multi-epic workflows (e.g., "viral invitation system")
- Unique data relationships (e.g., "social graph" before Facebook)
- New paradigms (e.g., "ephemeral messages" before Snapchat)

### 2. Design Collaboration

Instead of just picking technologies, the workflow helps DESIGN the solution:

- Identifies the core problem to solve
- Explores different approaches with the user
- Documents how components interact
- Creates sequence diagrams for complex flows
- Uses elicitation to find innovative solutions

### 3. Documentation

Novel patterns become part of the architecture with:

- Pattern name and purpose
- Component interactions
- Data flow diagrams
- Which epics/stories are affected
- Implementation guidance for agents

### 4. Example

```
PRD: "Users can create 'circles' of friends with overlapping membership"
↓
Workflow detects: This is a novel social structure pattern
↓
Designs with user: Circle membership model, permission cascading, UI patterns
↓
Documents: "Circle Pattern" with component design and data flow
↓
All agents understand how to implement circle-related features consistently
```

---

## How Implementation Patterns Work

Step 8 prevents agent conflicts by defining patterns for consistency:

### 1. The Core Principle

> "Any time multiple agents might make the SAME decision DIFFERENTLY, that's a pattern to capture"

The LLM asks: "What could an agent encounter where they'd have to guess?"

### 2. Pattern Categories (principles, not prescriptions)

- **Naming**: How things are named (APIs, database fields, files)
- **Structure**: How things are organized (folders, modules, layers)
- **Format**: How data is formatted (JSON structures, responses)
- **Communication**: How components talk (events, messages, protocols)
- **Lifecycle**: How states change (workflows, transitions)
- **Location**: Where things go (URLs, paths, storage)
- **Consistency**: Cross-cutting concerns (dates, errors, logs)

### 3. LLM Intelligence

- Uses the principle to identify patterns beyond the 7 categories
- Figures out what specific patterns matter for chosen tech
- Only asks about patterns that could cause conflicts
- Skips obvious patterns that the tech choice determines

### 4. Example

```
Tech chosen: REST API + PostgreSQL + React
↓
LLM identifies needs:
- REST: URL structure, response format, status codes
- PostgreSQL: table naming, column naming, FK patterns
- React: component structure, state management, test location
↓
Facilitates each with user
↓
Documents as Implementation Patterns in architecture
```

---

## How Starter Templates Work

When the workflow detects a project type that has a starter template:

1. **Discovery**: Searches for relevant starter templates based on PRD
2. **Investigation**: Looks up current CLI options and defaults
3. **Presentation**: Shows user what the starter provides
4. **Integration**: Documents starter decisions as "PROVIDED BY STARTER"
5. **Continuation**: Only asks about decisions NOT made by starter
6. **Documentation**: Includes exact initialization command in architecture

### Example Flow

```
PRD says: "Next.js web application with authentication"
↓
Workflow finds: create-next-app and create-t3-app
↓
User chooses: create-t3-app (includes auth setup)
↓
Starter provides: Next.js, TypeScript, tRPC, Prisma, NextAuth, Tailwind
↓
Workflow only asks about: Database choice, deployment target, additional services
↓
First story becomes: "npx create t3-app@latest my-app --trpc --nextauth --prisma"
```

---

## Usage

```bash
# In your BMAD-enabled project
workflow architecture
```

The AI agent will:

1. Load your PRD and epics
2. Identify critical decisions needed
3. Facilitate discussion on each decision
4. Generate a comprehensive architecture document
5. Validate completeness

---

## Design Principles

1. **Facilitation over Prescription** - Guide users to good decisions rather than imposing templates
2. **Intelligence over Templates** - Use AI understanding rather than rigid structures
3. **Decisions over Details** - Focus on what prevents agent conflicts, not implementation minutiae
4. **Adaptation over Uniformity** - Meet users where they are while ensuring quality output
5. **Collaboration over Output** - The conversation matters as much as the document

---

## For Developers

This workflow assumes:

- Single developer + AI agents (not teams)
- Speed matters (decisions in minutes, not days)
- AI agents need clear constraints to prevent conflicts
- The architecture document is for agents, not humans

---

## Migration from architecture

Projects using the old `architecture` workflow should:

1. Complete any in-progress architecture work
2. Use `architecture` for new projects
3. The old workflow remains available but is deprecated

---

## Version History

**1.3.2** - UX specification integration and fuzzy file matching

- Added UX spec as optional input with fuzzy file matching
- Updated workflow.yaml with input file references
- Starter template selection now considers UX requirements
- Added UX alignment validation to checklist
- Instructions use variable references for flexible file names

**1.3.1** - Workflow refinement and standardization

- Added workflow status checking at start (Steps 0 and 0.5)
- Added workflow status updating at end (Step 12)
- Reorganized step numbering for clarity (removed fractional steps)
- Enhanced with intent-based approach throughout
- Improved cohesiveness across all workflow components

**1.3.0** - Novel pattern design for unique architectures

- Added novel pattern design (now Step 7, formerly Step 5.3)
- Detects novel concepts in PRD that need architectural invention
- Facilitates design collaboration with sequence diagrams
- Uses elicitation for innovative approaches
- Documents custom patterns for multi-epic consistency

**1.2.0** - Implementation patterns for agent consistency

- Added implementation patterns (now Step 8, formerly Step 5.5)
- Created principle-based pattern-categories.csv (7 principles, not 118 prescriptions)
- Core principle: "What could agents decide differently?"
- LLM uses principle to identify patterns beyond the categories
- Prevents agent conflicts through intelligent pattern discovery

**1.1.0** - Enhanced with starter template discovery and version verification

- Added intelligent starter template detection and integration (now Step 2)
- Added dynamic version verification via web search
- Starter decisions are documented as "PROVIDED BY STARTER"
- First implementation story uses starter initialization command

**1.0.0** - Initial release replacing architecture workflow

---

**Related Documentation:**

- [Solutioning Workflows](./workflows-solutioning.md)
- [Planning Workflows](./workflows-planning.md)
- [Scale Adaptive System](./scale-adaptive-system.md)
