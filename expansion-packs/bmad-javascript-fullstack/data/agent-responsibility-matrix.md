# <!-- Powered by BMAD™ Core -->

# Agent Responsibility Matrix

Clear boundaries defining what each agent owns, preventing duplication and token waste through overlapping work.

## Core Principle

**Each decision has ONE owner.** When multiple agents could handle a task, this matrix defines who does what and when to hand off.

## Responsibility Ownership

### Solution Architect

**OWNS**:
- Overall system architecture and patterns
- Technology stack selection (which frameworks/databases/platforms)
- High-level API strategy (REST vs GraphQL vs tRPC - the choice itself)
- System-wide architectural patterns (monolith vs microservices vs JAMstack)
- Infrastructure and deployment architecture
- Security architecture (overall approach, not implementation details)
- Database technology selection (SQL vs NoSQL, which database)
- Integration architecture (how systems connect)
- Scalability and performance strategy
- Cross-cutting concerns (logging, monitoring, error handling strategy)

**DOES NOT OWN**:
- Detailed API endpoint specifications (delegates to API Developer)
- Component implementation details (delegates to React/Node Developers)
- Specific TypeScript type definitions (delegates to TypeScript Expert)
- Detailed database schema (reviews, but delegates to specialists)
- Implementation-level security patterns (delegates to specialists)

**HANDOFF TO**:
- API Developer: "We're using REST API. Here's the authentication approach and high-level resources. Create detailed endpoint specifications."
- React Developer: "We're using Next.js App Router with Zustand. Here's the component architecture. Implement components."
- Node Backend Developer: "We're using Fastify with Prisma and PostgreSQL. Here's the layered architecture. Implement services."

**TOKEN BUDGET**: 2,000-4,000 per architecture phase
**OUTPUT**: Architecture documents, stack decisions, pattern selections (comprehensive, high-quality)
**CONTEXT**: Load technology/architecture guides, create checkpoints for delegation

---

### API Developer

**OWNS**:
- Detailed API endpoint specifications (all routes, methods, parameters)
- Request/response schemas and data models
- API versioning strategy implementation
- OpenAPI/GraphQL schema definitions
- API documentation and examples
- Endpoint-level security specifications (which endpoints need auth)
- Pagination, filtering, sorting patterns
- API error response formats

**DOES NOT OWN**:
- API style selection (REST vs GraphQL - Architect decides)
- Backend implementation (delegates to Node Backend Developer)
- Frontend API integration (delegates to React Developer)
- Overall authentication architecture (Architect decides, API Developer specifies endpoints)

**RECEIVES FROM**:
- Solution Architect: API style choice, authentication approach, high-level resources
- Analyst: Data requirements, user needs

**HANDOFF TO**:
- Node Backend Developer: "Here's the complete API spec. Implement these endpoints following the specification."
- React Developer: "Here's the API contract. Integrate these endpoints on the frontend."

**TOKEN BUDGET**: 1,000-2,000 per API design phase
**OUTPUT**: API specifications, endpoint documentation, schemas (detailed, complete, production-ready)
**CONTEXT**: Load api-implementation-patterns (relevant section only), checkpoint from architect

---

### React Developer

**OWNS**:
- React component implementation
- Component-level state management
- Hooks and custom hooks
- Frontend routing implementation
- UI/UX implementation
- Client-side form validation
- Frontend performance optimization
- Accessibility implementation
- CSS/styling implementation

**DOES NOT OWN**:
- Framework selection (Architect decides)
- Overall state management architecture (Architect decides, React Developer implements)
- API endpoint design (API Developer owns)
- Backend integration logic (uses API contract, doesn't design it)

**RECEIVES FROM**:
- Solution Architect: Framework choice, state management strategy, architecture patterns
- API Developer: API contracts and documentation
- Designer: UI/UX designs, component specifications

**HANDOFF TO**:
- None typically (React Developer is implementation leaf node)

**TOKEN BUDGET**: 800-1,500 per feature
**OUTPUT**: React components, hooks, frontend features (complete, performant, accessible)
**CONTEXT**: Load state/component guides only when making decisions, use API specs as reference

---

### Node Backend Developer

**OWNS**:
- Backend service implementation (controllers, services, repositories)
- Business logic implementation
- Database query implementation
- Server-side validation
- Background job implementation
- Backend performance optimization
- Error handling implementation
- Logging and monitoring implementation

**DOES NOT OWN**:
- Framework selection (Architect decides)
- API contract design (API Developer designs, Backend implements)
- Database technology selection (Architect decides)
- Overall architecture patterns (Architect decides, Backend implements)

**RECEIVES FROM**:
- Solution Architect: Framework choice, architecture patterns, database technology
- API Developer: API specifications to implement

**HANDOFF TO**:
- None typically (Backend Developer is implementation leaf node)

**TOKEN BUDGET**: 1,000-2,000 per feature
**OUTPUT**: Backend services, endpoints, business logic (secure, performant, tested)
**CONTEXT**: Load security/database guides only when implementing auth/complex queries, use API specs as contract

---

### TypeScript Expert

**OWNS**:
- TypeScript configuration and setup
- Complex type definitions (generics, conditional types, mapped types)
- Type system architecture
- JavaScript to TypeScript migration strategy
- Type safety improvements and refactoring
- Shared type definitions across frontend/backend

**DOES NOT OWN**:
- TypeScript adoption decision (Architect decides)
- Component implementation (React Developer owns)
- Backend implementation (Node Developer owns)
- Simple interface definitions (any agent can create basic types)

**CALLED IN FOR**:
- Setting up TypeScript project
- Migrating JavaScript to TypeScript
- Complex generic types that other agents struggle with
- Type system refactoring and optimization

**RECEIVES FROM**:
- Solution Architect: TypeScript adoption decision, strictness requirements
- Any Agent: Request for complex type definitions

**HANDOFF TO**:
- Requesting Agent: "Here are the type definitions. Use them in your implementation."

**TOKEN BUDGET**: 500-1,200 per task
**OUTPUT**: Type definitions, tsconfig, migration plans (type-safe, maintainable)
**CONTEXT**: Load TypeScript guides only for complex patterns, use role knowledge for basics

---

### Scrum Master (SM)

**OWNS**:
- Breaking architecture/features into implementable stories
- Story acceptance criteria and DoD
- Story effort estimation and prioritization
- Sprint planning and backlog management
- Story dependency management

**DOES NOT OWN**:
- Technical architecture (Architect owns)
- Technical implementation details (Developers own)
- API design (API Developer owns)

**RECEIVES FROM**:
- Solution Architect: Architecture documents, technical specifications
- Analyst: Requirements, user needs

**HANDOFF TO**:
- Developers: "Here are the stories with clear acceptance criteria. Implement in priority order."

**TOKEN BUDGET**: 800-1,500 per epic breakdown
**OUTPUT**: Development stories with clear DoD (actionable, testable, estimable)
**CONTEXT**: Use checkpoints and architecture docs as reference, don't load implementation guides

---

### Analyst

**OWNS**:
- Requirements gathering and documentation
- User story creation (from user perspective)
- Business goal definition
- Stakeholder communication
- User research and competitive analysis

**DOES NOT OWN**:
- Technical architecture (Architect owns)
- Technical feasibility (collaborates with Architect)
- Implementation approach (Developers own)

**HANDOFF TO**:
- Solution Architect: "Here are the requirements. Design the architecture."
- Scrum Master: "Here are user needs. Break into implementable stories."

**TOKEN BUDGET**: 500-1,000 per requirements doc
**OUTPUT**: Requirements documents, user stories (clear, comprehensive, testable)
**CONTEXT**: No technical guides needed, focus on business/user domain

---

## Decision Flowcharts

### Who Designs the API?

```
API Design Needed
│
├─ High-Level Decision (REST vs GraphQL vs tRPC)?
│  └─ Solution Architect
│     Output: "Use REST API with JWT auth"
│     Handoff to: API Developer
│
└─ Detailed Specification (all endpoints, schemas)?
   └─ API Developer
      Output: OpenAPI spec with all routes
      Handoff to: Node Backend Developer (implement)
                  React Developer (consume)
```

**Key**: Architect decides WHAT (API style), API Developer designs HOW (endpoints), Backend implements.

### Who Handles State Management?

```
State Management Needed
│
├─ High-Level Decision (which state solution for project)?
│  └─ Solution Architect
│     Output: "Use React Query for server state, Zustand for global client state"
│     Handoff to: React Developer
│
└─ Implementation (actual state management code)?
   └─ React Developer
      Output: Store setup, hooks, state logic
```

**Key**: Architect decides WHICH solution, React Developer implements HOW.

### Who Designs Database Schema?

```
Database Schema Needed
│
├─ Database Technology Selection (SQL vs NoSQL, which DB)?
│  └─ Solution Architect
│     Output: "Use PostgreSQL with Prisma ORM"
│     Handoff to: Node Backend Developer or team
│
├─ High-Level Schema Design (main entities, relationships)?
│  └─ Solution Architect (in architecture doc)
│     Output: Entity relationship diagram, key tables
│     Handoff to: Node Backend Developer
│
└─ Detailed Schema (all columns, indexes, migrations)?
   └─ Node Backend Developer
      Output: Prisma schema, migrations, indexes
```

**Key**: Architect chooses tech + high-level design, Backend Developer creates detailed schema.

### Who Handles Security?

```
Security Implementation Needed
│
├─ Security Architecture (overall approach, auth strategy)?
│  └─ Solution Architect
│     Output: "Use JWT with refresh tokens, RBAC, OWASP compliance"
│     Handoff to: Specialists
│
├─ API Security Specs (which endpoints need auth, roles)?
│  └─ API Developer
│     Output: Endpoint-level auth requirements in spec
│     Handoff to: Backend Developer
│
└─ Security Implementation (auth code, validation, middleware)?
   └─ Node Backend Developer
      Output: Auth middleware, validation, security headers
```

**Key**: Architect defines WHAT, API Developer specifies WHERE, Backend implements HOW.

## Avoiding Overlap: Handoff Protocol

### Bad: Overlapping Work (Token Waste)

❌ **Scenario**: Feature needs API endpoints
- Solution Architect creates detailed API spec (3,000 tokens)
- API Developer also creates detailed API spec (3,000 tokens)
- **Result**: 6,000 tokens wasted, duplicate work, potential conflicts

### Good: Clear Handoff (Efficient)

✅ **Scenario**: Feature needs API endpoints
- Solution Architect: "Use REST API. Auth with JWT. Resources: users, posts. Delegate to API Developer for details."
- API Developer receives: "Design REST API for users and posts with JWT auth. Here's checkpoint with architecture decisions."
- API Developer creates detailed spec
- **Result**: No duplication, 3,000 tokens saved

### Handoff Pattern

```
Agent A (Strategic)
│
├─ Makes high-level decision
├─ Documents in checkpoint (max 100 lines)
├─ Specifies constraints and requirements
│
└─ Handoff to Agent B with:
   - Decision summary
   - Constraints
   - Artifact paths for context
   - Specific task: "You own X, design/implement Y"

Agent B (Tactical)
│
├─ Receives checkpoint (not full history)
├─ Loads ONLY relevant guides for their decision
├─ Creates detailed specification/implementation
└─ Does NOT re-decide what Agent A decided
```

## Responsibility Anti-Patterns

### ❌ Anti-Pattern 1: "I'll Do Everything"

**Example**: Solution Architect creates detailed API spec, database schema, and component designs
- **Problem**: Token waste, architect doing tactical work
- **Fix**: Architect creates high-level design, delegates details to specialists

### ❌ Anti-Pattern 2: "Who Owns This?"

**Example**: Both Solution Architect and API Developer design the same API
- **Problem**: Duplication, conflicting specs, token waste
- **Fix**: Use responsibility matrix - Architect decides API style, API Developer designs endpoints

### ❌ Anti-Pattern 3: "I Need to Understand Everything"

**Example**: React Developer loads backend architecture, database schema, deployment strategy
- **Problem**: Loading context outside their domain
- **Fix**: React Developer loads only: API contract, frontend architecture, component specs

### ❌ Anti-Pattern 4: "Let Me Re-Decide"

**Example**: Backend Developer re-evaluates framework choice already made by Architect
- **Problem**: Re-work, token waste on context already compressed
- **Fix**: Backend Developer receives checkpoint: "Framework: Fastify. Implement services."

## Token Optimization Through Clear Boundaries

### Before: Unclear Boundaries
- Solution Architect loads: everything (6,000 tokens)
- API Developer loads: everything (6,000 tokens)
- Both design API: duplicate work
- **Total**: 12,000 tokens, duplicate work

### After: Clear Boundaries
- Solution Architect: Loads stack/architecture guides (2,500 tokens), creates checkpoint (500 tokens)
- API Developer: Loads checkpoint + API patterns (1,200 tokens), designs detailed spec
- **Total**: 4,200 tokens, no duplication
- **Savings**: 65% token reduction

## Quick Reference: "Who Do I Call?"

| Need | Call Agent | They Will |
|------|-----------|-----------|
| Technology stack selection | Solution Architect | Choose frameworks, databases, tools |
| System architecture | Solution Architect | Design overall system, patterns, structure |
| API style decision | Solution Architect | Choose REST/GraphQL/tRPC |
| Detailed API specification | API Developer | Design all endpoints, schemas, docs |
| React component implementation | React Developer | Build components, hooks, state |
| Backend endpoint implementation | Node Backend Developer | Implement services, queries, business logic |
| Complex TypeScript types | TypeScript Expert | Create advanced type definitions |
| JS → TS migration | TypeScript Expert | Plan and execute migration |
| Requirements gathering | Analyst | Document requirements, user needs |
| Story breakdown | Scrum Master | Create implementable stories with DoD |

## Summary: Preventing Overlap

**Golden Rules**:
1. **One owner per decision** - No duplication
2. **Strategic → Tactical handoff** - Architect decides, specialists implement
3. **Checkpoints for handoff** - Don't repeat full context
4. **Load only your domain** - Don't load other agents' context
5. **Trust the handoff** - Don't re-decide upstream decisions

**Token Impact**:
- Clear boundaries → 50-70% reduction in duplicate context loading
- Checkpoints for handoff → 80% reduction in repeated context
- Domain-specific loading → Each agent loads only what they need

**Quality Impact**:
- ✅ DOES NOT reduce output quality
- ✅ DOES NOT limit agent responses
- ✅ Agents still produce comprehensive, high-quality outputs
- ✅ Prevents conflicting decisions from multiple agents
- ✅ Clearer ownership and accountability
