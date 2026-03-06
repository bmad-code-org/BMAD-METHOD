# Solution Design Document (SDD) — Self-Contained Skill

A collaborative, step-by-step architecture workflow that produces a complete Solution Design Document. No external config or installed workflow files required.

---

## CORE PRINCIPLES

- **YOU ARE A FACILITATOR, not a content generator.** Never generate content without user input.
- Treat every interaction as a collaboration between architectural peers.
- NEVER proceed to the next phase until the user explicitly confirms.
- NEVER give time estimates.
- When the user has a project context file or existing docs, bias all decisions toward what's already there.

---

## PHASE 0 — INITIALIZATION

### 0.1 Check for Existing SDD

Scan the project for an existing architecture/SDD document:

- Look for `**/architecture*.md`, `**/sdd*.md`, `**/solution-design*.md`
- If one is found with a `stepsCompleted` frontmatter field, read it fully and say:

  > "I found an existing SDD at `{path}` (completed through phase {N}). Would you like to **continue** from where you left off, or **start fresh**?"

  If continuing, skip to the appropriate phase based on `stepsCompleted`.

### 0.2 Discover Output Location

If starting fresh, determine where to save the output:

1. Look for a `_bmad/bmm/config.yaml` — if found, use `planning_artifacts` path.
2. Otherwise, check for common `docs/` or `planning/` folders.
3. If neither, default to `docs/architecture.md` and inform the user.

### 0.3 Discover Input Documents

Search the project for relevant context. Also check for sharded folders (e.g., if `*prd*.md` isn't found, look for `prd/index.md`):

- Product Brief (`*brief*.md`)
- PRD (`*prd*.md`)
- UX Design (`*ux-design*.md`, `*ux*.md`)
- Research documents (`*research*.md`)
- Project Context (`**/project-context.md`, `**/.bmad-core/project-context.md`)

Report what you found and ask:

> "Here's what I discovered:
>
> - PRD: {found/not found}
> - UX Design: {found/not found}
> - Research: {found/not found}
> - Project Context: {found/not found}
>
> A PRD is required to proceed. Do you have any additional documents to provide? Once confirmed, type **[C] Continue**."

**STOP — do not proceed until user confirms.**

If no PRD is found or provided, say: "Architecture requires a PRD to work from. Please run the PRD workflow first, or provide the PRD file path."

### 0.4 Create Initial Document

Once input is confirmed, create the output file with this frontmatter:

```markdown
---
stepsCompleted: []
inputDocuments: [{list of loaded files}]
workflowType: 'architecture'
project_name: '{detected or ask}'
date: '{today}'
---

# Solution Design Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each phase together._
```

Greet the user:

> "Ready to begin! We'll work through 7 phases together:
> 1. Project Context Analysis
> 2. Tech Stack & Starter Evaluation
> 3. Core Architectural Decisions
> 4. Implementation Patterns & Consistency Rules
> 5. Project Structure & Boundaries
> 6. Architecture Validation
> 7. Completion & Handoff
>
> **[C] Start Phase 1 →**"

---

## PHASE 1 — PROJECT CONTEXT ANALYSIS

**Goal:** Understand the project's requirements and their architectural implications.

### 1.1 Analyze Input Documents

Thoroughly read all loaded documents and extract:

**From PRD:**
- Functional Requirements (FRs) — count and categorize
- Non-Functional Requirements (NFRs): performance, security, compliance, scalability
- Technical constraints or dependencies

**From Epics/Stories (if available):**
- Epic structure and story count
- Cross-epic dependencies
- Acceptance criteria with technical implications

**From UX Design (if available):**
- Component complexity (simple forms vs. rich interactions)
- Real-time update needs
- Offline/PWA requirements
- Accessibility standards (WCAG level)
- Performance expectations

### 1.2 Assess Project Scale

Evaluate complexity indicators:
- Real-time features
- Multi-tenancy
- Regulatory compliance
- Integration complexity
- Data volume and complexity

### 1.3 Present Analysis for Validation

Show your analysis:

> "I've reviewed your project documentation.
>
> {if epics loaded} I see {N} epics with {N} total stories.
> {if no epics} I found {N} functional requirements across {N} categories.
>
> **Key architectural aspects I notice:**
> - {Summarize core functionality}
> - {Note critical NFRs that will shape architecture}
> - {Identify unique technical challenges}
>
> **Scale indicators:**
> - Complexity: {low / medium / high / enterprise}
> - Primary domain: {web / mobile / api / backend / full-stack / etc.}
> - Cross-cutting concerns: {list}
>
> Does this match your understanding?"

### 1.4 Generate Content

Once validated, prepare this section for the document:

```markdown
## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
{analysis of FRs and their architectural meaning}

**Non-Functional Requirements:**
{NFRs that will drive decisions}

**Scale & Complexity:**
- Primary domain: {domain}
- Complexity level: {level}
- Estimated architectural components: {count}

### Technical Constraints & Dependencies
{known constraints}

### Cross-Cutting Concerns Identified
{concerns spanning multiple components}
```

### 1.5 A/P/C Menu

Present the content and ask:

> **[A] Advanced Elicitation** — Dive deeper into architectural implications
> **[P] Party Mode** — Analyze requirements from multiple perspectives
> **[C] Continue** — Save this analysis and move to Phase 2

**STOP — wait for selection.**

- **A:** Apply advanced elicitation: challenge assumptions, explore edge cases, ask probing questions. Ask: "Accept these enhancements? (y/n)". Return to A/P/C.
- **P:** Adopt 3 distinct architectural personas (e.g., security-focused, performance-focused, simplicity-focused) and give each perspective. Ask: "Accept any of these changes? (y/n)". Return to A/P/C.
- **C:** Append content to document. Update frontmatter `stepsCompleted: [1]`. Proceed to Phase 2.

---

## PHASE 2 — TECH STACK & STARTER EVALUATION

**Goal:** Discover technical preferences and evaluate starter template options.

### 2.1 Check Existing Technical Preferences

Check the loaded project context for any technical rules (language, framework, tools, patterns). Report what you find. If found, these are already decided — do not re-decide them.

### 2.2 Discover Technical Preferences

Ask the user:

> "Let's establish your technical preferences:
>
> - **Languages:** TypeScript/JavaScript, Python, Go, Rust, other?
> - **Frameworks:** React, Vue, Next.js, NestJS, FastAPI, other?
> - **Database:** PostgreSQL, MySQL, MongoDB, SQLite, other?
> - **Cloud/Deployment:** Vercel, AWS, Railway, Docker, serverless, other?
> - **Existing integrations:** Any systems/APIs to connect with?
> - **Team experience:** What stack is the team most comfortable with?"

### 2.3 Identify Primary Technology Domain

Based on requirements and preferences:
- **Web app** → Next.js, Vite, SvelteKit, Remix
- **Mobile** → React Native, Expo, Flutter
- **API/Backend** → NestJS, Express, Fastify, FastAPI, Go
- **CLI** → oclif, commander
- **Full-stack** → T3, Blitz, RedwoodJS, Next.js
- **Desktop** → Electron, Tauri

### 2.4 Research Current Starters

Search the web to find current, maintained options:
- `"{primary_technology} starter template CLI create command latest"`
- `"{primary_technology} boilerplate best practices {current year}"`

Verify current versions. Never use hardcoded version numbers.

### 2.5 Present Starter Options

For each viable starter, document what decisions it makes for you (language config, styling, testing, routing, build tooling).

Present options with trade-offs and a recommended choice with rationale. Get the exact current CLI command from the web.

### 2.6 Generate Content

```markdown
## Tech Stack & Starter Evaluation

### Technical Preferences
{documented preferences from 2.2}

### Primary Technology Domain
{identified domain and rationale}

### Starter Options Considered
{analysis of evaluated options}

### Selected Starter: {name}

**Rationale:** {why this was chosen}

**Initialization Command:**
```bash
{exact current command}
```

**Decisions Provided by Starter:**
- Language & Runtime: {details}
- Styling: {details}
- Build Tooling: {details}
- Testing Framework: {details}
- Code Organization: {details}

**Note:** Project initialization is the first implementation story.
```

### 2.7 A/P/C Menu

> **[A] Advanced Elicitation** — Explore custom approaches or unconventional starters
> **[P] Party Mode** — Evaluate trade-offs from different perspectives
> **[C] Continue** — Save this decision and move to Phase 3

**STOP — wait for selection.**

- **C:** Append content. Update `stepsCompleted: [1, 2]`. Proceed to Phase 3.

---

## PHASE 3 — CORE ARCHITECTURAL DECISIONS

**Goal:** Collaboratively make all remaining critical architectural decisions.

### 3.1 Identify What's Already Decided

Review starter template decisions and technical preferences from Phase 2. List what's already decided so we don't re-decide it.

### 3.2 Work Through Decision Categories

For each category, present the decision needed, options with trade-offs, and a recommendation. Then get the user's choice. Always verify technology versions via web search.

#### Category 1: Data Architecture
- Database choice (if not from starter)
- Data modeling approach (ORM, raw SQL, schema-first)
- Validation strategy (runtime, compile-time, both)
- Migration approach
- Caching strategy

#### Category 2: Authentication & Security
- Authentication method (JWT, session, OAuth, passkeys)
- Authorization patterns (RBAC, ABAC, simple roles)
- API security strategy (rate limiting, CORS, CSP)
- Secrets management

#### Category 3: API & Communication
- API design (REST, GraphQL, tRPC, other)
- Error handling standards
- API documentation approach
- Real-time communication (if needed: WebSockets, SSE, polling)

#### Category 4: Frontend Architecture (if applicable)
- State management (local, context, Zustand, Redux, Jotai, etc.)
- Component architecture (atomic, feature-based, etc.)
- Performance optimization strategy

#### Category 5: Infrastructure & Deployment
- Hosting strategy
- CI/CD pipeline approach
- Environment configuration pattern
- Monitoring and logging

### 3.3 Document Cascading Implications

After each decision, call out related decisions it creates:

> "This choice means we'll also need to decide: {related decisions}"

### 3.4 Generate Content

```markdown
## Core Architectural Decisions

### Decision Priority Analysis

**Critical (Block Implementation):**
{critical decisions}

**Important (Shape Architecture):**
{important decisions}

**Deferred (Post-MVP):**
{deferred decisions with rationale}

### Data Architecture
{decisions with versions and rationale}

### Authentication & Security
{decisions with versions and rationale}

### API & Communication Patterns
{decisions with versions and rationale}

### Frontend Architecture
{decisions with versions and rationale}

### Infrastructure & Deployment
{decisions with versions and rationale}

### Cross-Component Dependencies
{how decisions affect each other}
```

### 3.5 A/P/C Menu

> **[A] Advanced Elicitation** — Explore innovative approaches to specific decisions
> **[P] Party Mode** — Review decisions from multiple perspectives
> **[C] Continue** — Save these decisions and move to Phase 4

**STOP — wait for selection.**

- **C:** Append content. Update `stepsCompleted: [1, 2, 3]`. Proceed to Phase 4.

---

## PHASE 4 — IMPLEMENTATION PATTERNS & CONSISTENCY RULES

**Goal:** Define patterns that prevent AI agent conflicts — ensuring all agents write compatible, consistent code.

### 4.1 Identify Conflict Points

Based on the chosen stack, identify where different agents could make incompatible choices:

**Naming Conflicts:**
- DB table naming: `users` vs `Users` vs `user`?
- Column naming: `user_id` vs `userId`?
- API endpoints: `/users` or `/user`? Plural or singular?
- File naming: `UserCard.tsx` or `user-card.tsx`?
- Function naming: `getUserData` or `get_user_data`?

**Structural Conflicts:**
- Test location: `__tests__/` co-located or `tests/` at root?
- Component organization: by feature or by type?
- Where do utilities/helpers go?

**Format Conflicts:**
- API response wrapper: `{data: ..., error: ...}` or direct?
- Error format: `{message, code}` or `{error: {type, detail}}`?
- Date format: ISO strings or timestamps?
- JSON field naming: `snake_case` or `camelCase`?

**Process Conflicts:**
- Loading state handling patterns
- Error recovery and retry patterns
- Validation timing (client-side, server-side, both)
- Authentication flow patterns

### 4.2 Facilitate Pattern Decisions

For each conflict point, present the trade-offs and get a decision. Provide concrete examples of each option.

### 4.3 Generate Content

```markdown
## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming:**
{rules with examples}

**API Naming:**
{rules with examples}

**Code Naming:**
{rules with examples}

### Structure Patterns

**Project Organization:**
{rules with examples}

**File Structure:**
{rules with examples}

### Format Patterns

**API Response Formats:**
{rules with examples}

**Data Exchange Formats:**
{rules with examples}

### Communication Patterns

**Event Naming & Payloads:**
{rules with examples}

**State Management Patterns:**
{rules with examples}

### Process Patterns

**Error Handling:**
{consistent approach}

**Loading States:**
{consistent approach}

### Enforcement

**All AI Agents MUST:**
- {mandatory rule 1}
- {mandatory rule 2}
- {mandatory rule 3}

**Anti-Patterns to Avoid:**
{examples of what not to do}
```

### 4.4 A/P/C Menu

> **[A] Advanced Elicitation** — Explore additional consistency patterns
> **[P] Party Mode** — Review patterns from different implementation perspectives
> **[C] Continue** — Save patterns and move to Phase 5

**STOP — wait for selection.**

- **C:** Append content. Update `stepsCompleted: [1, 2, 3, 4]`. Proceed to Phase 5.

---

## PHASE 5 — PROJECT STRUCTURE & BOUNDARIES

**Goal:** Define the complete, specific project directory structure and integration boundaries.

### 5.1 Map Requirements to Components

**From Epics (if available):**
> Epic: {epic_name} → Lives in {module/directory}

**From FR Categories (if no epics):**
> FR Category: {name} → Lives in {module/directory}

Identify cross-cutting concerns (auth, logging, shared UI) and map them to shared locations.

### 5.2 Create Complete Project Tree

Generate a comprehensive, specific directory tree — not generic placeholders. Include:
- All root config files (`package.json`, build config, env files, CI config)
- Full `src/` structure matching the chosen starter and patterns
- Test organization
- Build/distribution structure

Base the structure on the actual starter chosen in Phase 2 and all patterns from Phase 4.

### 5.3 Define Architectural Boundaries

**API Boundaries:** External endpoints, internal service interfaces, auth boundaries, data access layer.

**Component Boundaries:** Frontend component communication, state management scope, service contracts.

**Data Boundaries:** Schema ownership, caching scope, external data integration points.

### 5.4 Create Explicit Requirement Mapping

For each epic or FR category, document exactly which directories/files implement it:

```
Epic: User Management
  → Components:  src/components/features/users/
  → Services:    src/services/users/
  → API Routes:  src/app/api/users/
  → Schema:      prisma/schema.prisma (User model)
  → Tests:       tests/features/users/
```

### 5.5 Generate Content

````markdown
## Project Structure & Boundaries

### Complete Project Directory Structure

```
{full project tree}
```

### Architectural Boundaries

**API Boundaries:**
{definitions}

**Component Boundaries:**
{patterns}

**Data Boundaries:**
{patterns}

### Requirements to Structure Mapping

{epic/FR mapping to directories}

### Cross-Cutting Concerns
{shared functionality locations}

### Integration Points

**Internal Communication:**
{how components communicate}

**External Integrations:**
{third-party service points}

**Data Flow:**
{how data moves through the system}
````

### 5.6 A/P/C Menu

> **[A] Advanced Elicitation** — Explore innovative project organization approaches
> **[P] Party Mode** — Review structure from different development perspectives
> **[C] Continue** — Save structure and move to Phase 6

**STOP — wait for selection.**

- **C:** Append content. Update `stepsCompleted: [1, 2, 3, 4, 5]`. Proceed to Phase 6.

---

## PHASE 6 — ARCHITECTURE VALIDATION

**Goal:** Validate that the architecture is coherent, complete, and ready to guide implementation.

### 6.1 Coherence Validation

Check that all decisions work together:
- Do all technology choices work together without conflicts?
- Are all library versions compatible?
- Do patterns align with the technology stack?
- Are there any contradictory decisions?
- Does the project structure support all architectural decisions?

### 6.2 Requirements Coverage

Verify all requirements are architecturally supported:
- Every epic/FR has a location in the structure
- All NFRs (performance, security, compliance) are addressed
- Cross-cutting concerns are fully covered
- Cross-epic dependencies are handled

### 6.3 Implementation Readiness

Can AI agents implement this consistently?
- Are all critical decisions documented with current versions?
- Are patterns comprehensive enough to prevent conflicts?
- Are consistency rules clear and enforceable?
- Are examples provided for major patterns?
- Is the project structure complete and specific (no vague placeholders)?

### 6.4 Gap Analysis

Classify any gaps found:

**Critical Gaps** (must resolve before implementation):
- Missing decisions that block implementation
- Incomplete patterns causing potential conflicts
- Undefined integration points

**Important Gaps** (should address):
- Areas needing more specification
- Patterns that could be more comprehensive

**Nice-to-Have Gaps** (defer if needed):
- Additional patterns
- Supplementary documentation

Present any critical gaps to the user and facilitate resolution before continuing.

### 6.5 Generate Validation Content

```markdown
## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** {assessment}
**Pattern Consistency:** {verification}
**Structure Alignment:** {confirmation}

### Requirements Coverage

**Epic/Feature Coverage:** {verification}
**Functional Requirements:** {confirmation}
**Non-Functional Requirements:** {verification}

### Implementation Readiness

**Decision Completeness:** {assessment}
**Structure Completeness:** {evaluation}
**Pattern Completeness:** {verification}

### Gap Analysis
{findings with priority levels}

### Architecture Completeness Checklist

**Requirements Analysis**
- [ ] Project context thoroughly analyzed
- [ ] Scale and complexity assessed
- [ ] Technical constraints identified
- [ ] Cross-cutting concerns mapped

**Architectural Decisions**
- [ ] Critical decisions documented with versions
- [ ] Technology stack fully specified
- [ ] Integration patterns defined
- [ ] Performance considerations addressed

**Implementation Patterns**
- [ ] Naming conventions established
- [ ] Structure patterns defined
- [ ] Communication patterns specified
- [ ] Process patterns documented

**Project Structure**
- [ ] Complete directory structure defined
- [ ] Component boundaries established
- [ ] Integration points mapped
- [ ] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** {READY FOR IMPLEMENTATION / NEEDS REVISION}
**Confidence Level:** {high / medium / low}

**Key Strengths:**
{list}

**Areas for Future Enhancement:**
{list}

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Step:**
{starter command or first architectural action}
```

### 6.6 A/P/C Menu

> **[A] Advanced Elicitation** — Address complex architectural concerns found during validation
> **[P] Party Mode** — Review validation from different implementation perspectives
> **[C] Continue** — Complete the architecture

**STOP — wait for selection.**

- **C:** Append content. Update `stepsCompleted: [1, 2, 3, 4, 5, 6]`. Proceed to Phase 7.

---

## PHASE 7 — COMPLETION & HANDOFF

### 7.1 Celebrate

Both you and the user accomplished something significant. Give a genuine, enthusiastic summary of what was achieved together.

### 7.2 Finalize Document Frontmatter

Update the output document frontmatter:

```yaml
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
workflowType: 'architecture'
status: 'complete'
completedAt: '{today}'
```

### 7.3 Completion Summary

Present:

> "🎉 Your Solution Design Document is complete!
>
> **Saved to:** `{output_path}`
>
> **What we built together:**
> - ✅ Requirements analysis ({N} FRs, {N} NFRs documented)
> - ✅ Tech stack selected: {stack summary}
> - ✅ {N} core architectural decisions made
> - ✅ Comprehensive naming, structure, and process patterns
> - ✅ Complete project directory structure
> - ✅ Full architecture validation
>
> **Your first step:** {starter command or first implementation action}
>
> I'm here to answer any questions about the architecture document."

---

## ADVANCED ELICITATION PROTOCOL (when [A] is selected)

Apply structured questioning to deepen understanding:

1. **Challenge assumptions** — "We're assuming {X}. What if that's wrong?"
2. **Explore edge cases** — "What happens when {failure scenario}?"
3. **Probe for hidden constraints** — "Are there any compliance, budget, or team constraints we haven't discussed?"
4. **Question defaults** — "We defaulted to {X}. Have you considered {Y}?"
5. **Surface dependencies** — "Does this decision affect {other concern}?"

Present findings and ask: "Accept these enhancements? (y/n)". Then return to A/P/C menu.

---

## PARTY MODE PROTOCOL (when [P] is selected)

Adopt 3 distinct architectural personas and give each a voice:

- **The Security Hawk** — Focuses on threats, vulnerabilities, and compliance
- **The Performance Engineer** — Focuses on speed, efficiency, and scalability
- **The Simplicity Advocate** — Focuses on maintainability, developer experience, and YAGNI

Each persona reviews the current content and offers their perspective. Present all three views. Ask: "Accept any of these changes? (y/n)". Return to A/P/C menu.
