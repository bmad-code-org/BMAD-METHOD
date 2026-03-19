---
name: 'step-28-tech-stack'
description: 'Capture core technology decisions and architecture approach'

# File References
nextStepFile: './step-28a-data-model.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 28: Technology Stack & Architecture

## STEP GOAL:
Capture core technology decisions — frontend, backend, database, hosting, and the overall architectural approach. This is the foundation that all subsequent build specification steps build on.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Strategic Business Analyst and Systems Architect guiding technology choices with clear trade-off explanations
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- Maintain collaborative and strategic tone throughout

### Step-Specific Rules:
- Focus: Frontend framework, backend language, database, hosting, architecture pattern
- FORBIDDEN: Do not recommend technology without explaining trade-offs at user's technical level
- Approach: Present options with trade-offs, explain at appropriate level, document rationale
- For app-type products: always ask about API architecture (REST vs GraphQL vs RPC)
- For web-only: simpler choices, static vs dynamic, CMS vs custom

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 0. Check Material Analysis Status

**If technology stack was already confirmed during the Material Analysis Phase (Step 1):**
Run in **Confirmation Mode** — do NOT re-run the full exploratory conversation:
1. Reference the confirmed stack: "We confirmed your technology stack as [synthesis from analysis phase]."
2. Ask: "Anything to add or refine before I document it?"
3. If nothing: synthesize, document, and advance
4. If additions: capture them, update the synthesis, confirm, then advance

**If no materials exist or tech stack was not covered in materials:**
Run the full exploration below.

### 1. Architecture Pattern

Based on the Product Brief, determine what we're building:
- **Static site** — Marketing site, blog, portfolio (Astro, 11ty, Hugo)
- **Server-rendered app** — Dynamic pages, SEO-critical (Next.js, Nuxt, SvelteKit)
- **SPA + API** — Application with separate frontend and backend (React/Vue + REST/GraphQL)
- **Cross-platform app** — Mobile + web from one codebase (Flutter, React Native)
- **Backend service** — API-first, headless (Go, Node, Python, Rust)

Ask: "Based on your product concept, what kind of system are we building?"

### 2. Frontend Technology

Based on architecture pattern:
- Framework choice and rationale
- Styling approach (Tailwind, CSS modules, styled-components)
- State management approach (if SPA/app)
- Mobile considerations (responsive, PWA, native)

### 3. Backend Technology

- Language and framework (Go, Node/Express, Python/FastAPI, etc.)
- API style (REST, GraphQL, gRPC, tRPC)
- Authentication approach (JWT, sessions, OAuth providers)
- Background job processing (if needed)

### 4. Database

- Primary database (PostgreSQL, MySQL, SQLite, MongoDB)
- Caching layer (Redis, in-memory)
- Search (built-in, Elasticsearch, Meilisearch)
- File storage (S3, local, CDN)

### 5. Hosting & Deployment

- Where it runs (cloud provider, VPS, serverless, PaaS)
- CI/CD approach
- Environment strategy (dev, staging, production)
- Domain and DNS

### 6. Document Rationale

For each choice:
- Why this fits the project
- Trade-offs acknowledged
- Scaling implications
- Team skill alignment

### 7. Design Log Update

Update design log with technology decisions and rationale.

### N. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to Data Model"

#### Menu Handling Logic:
- IF C: Load, read entire file, then execute {nextStepFile}
- IF M: Return to {workflowFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options]

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN step objectives are met and user confirms will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Architecture pattern identified
- Frontend, backend, database, hosting decisions documented
- Rationale captured for each choice
- User confirmed

### FAILURE:
- Recommended technology without trade-off explanation
- Skipped database or API architecture for an app-type product
- Generated tech stack without user input

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
