# <!-- Powered by BMAD™ Core -->

# Create Architecture Document Task

## Purpose
Document the technical architecture of a JavaScript/TypeScript full-stack application to guide implementation and ensure team alignment.

## Context Budget

**Estimated Tokens**: ~2,000-4,000 tokens (complete architecture doc)
**Complexity**: High (requires comprehensive system design across frontend, backend, database, infrastructure)
**Context Window Usage**: ~10-20% of typical limit
**Input Context Required**: ~500-1,000 tokens (requirements, constraints, scale estimates)

**Token Efficiency**:
- Use architecture checklist to guide structure (avoid over-documentation)
- Reference external docs for standard patterns (e.g., link to Next.js docs instead of explaining)
- Focus on decisions and rationale, not technology tutorials
- Create separate ADR files for complex decisions, reference in main doc

## When to Use
- Starting a new greenfield project
- Major system refactoring
- Adding significant new capabilities
- Onboarding new team members
- Technical planning phase

## Prerequisites
- Requirements analysis complete
- Technology stack decision made (or to be documented)
- Understanding of scale and performance needs
- Budget and timeline constraints known

## Architecture Document Structure

### 1. Executive Summary
- **System Overview** (2-3 paragraphs)
- **Technology Stack** (Frontend, Backend, Database, Infrastructure)
- **Architecture Pattern** (Monolith, Microservices, JAMstack, Serverless)
- **Key Decisions** (3-5 major decisions with rationale)
- **Scalability Overview**

### 2. Frontend Architecture
- **Framework:** React/Next.js version with justification
- **Build Tool:** Vite, Webpack, Next.js built-in
- **State Management:** React Query + Zustand/Redux/Context
- **Routing:** File-based (Next.js) or React Router
- **Styling:** Tailwind, CSS Modules, Styled Components
- **Component Structure:** Folder organization
- **Code Splitting:** Strategy for optimization
- **SEO Strategy:** SSR, SSG, or CSR approach

### 3. Backend Architecture
- **Runtime:** Node.js version
- **Framework:** Express, Fastify, NestJS
- **API Design:** REST, GraphQL, tRPC
- **Authentication:** JWT, OAuth, Sessions
- **Authorization:** RBAC, ABAC
- **Middleware:** Security, logging, error handling
- **Background Jobs:** Bull, BullMQ (if needed)

### 4. Database Design
- **Database Choice:** PostgreSQL, MongoDB, etc with reasoning
- **ORM:** Prisma, TypeORM, Mongoose
- **Schema Design:** Entity relationships
- **Indexes:** Performance-critical indexes
- **Migrations:** Strategy and tooling
- **Backup:** Frequency and retention

### 5. API Design
- **Versioning:** URL-based (/api/v1/)
- **Request/Response:** JSON schemas
- **Error Handling:** Standardized format
- **Pagination:** Cursor or offset
- **Rate Limiting:** Strategy and limits
- **Documentation:** OpenAPI/Swagger

### 6. Non-Functional Requirements
- **Performance Targets:** Response time, page load
- **Security:** Authentication, encryption, OWASP
- **Scalability:** Horizontal scaling approach
- **Reliability:** Uptime, error rates
- **Monitoring:** Logging, APM, error tracking

### 7. Infrastructure
- **Hosting:** Vercel, AWS, Railway, etc
- **CI/CD:** GitHub Actions, GitLab CI
- **Environments:** Dev, Staging, Production
- **Secrets Management:** Environment variables, vaults

### 8. Development Standards
- **TypeScript:** tsconfig.json settings
- **Linting:** ESLint configuration
- **Testing:** Frameworks and coverage goals
- **Git:** Branch strategy, commit conventions

## Best Practices

### Keep It Practical
- Document decisions, not obvious choices
- Focus on "why" not just "what"
- Include diagrams for complex systems
- Keep it maintainable and up-to-date

### Make It Actionable
- Clear enough for developers to implement
- Specific technology versions
- Configuration examples
- Code snippets for patterns

### Use Architecture Decision Records (ADRs)
For each major decision:
- **Context:** What problem does this solve?
- **Decision:** What did we choose?
- **Consequences:** What are the trade-offs?

## Validation
Use `checklists/architecture-review-checklist.md` to validate completeness

## Handoff
Once complete:
1. Review with team
2. Get stakeholder approval
3. Save to `docs/architecture/`
4. Use as basis for story creation