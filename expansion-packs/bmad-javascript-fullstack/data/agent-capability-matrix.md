# Agent Capability Matrix - Zero Overlap Design

## Exclusive Capabilities (No Overlap)

### React Developer
**EXCLUSIVELY OWNS**:
- React component implementation
- React hooks and patterns
- Client-side state management (useState, useReducer, Zustand)
- CSS/styling solutions
- Client-side routing
- React performance optimization
- Component testing (RTL)

**DELEGATES TO OTHERS**:
- API endpoint design → API Developer
- Database queries → Backend Developer
- Authentication logic → Backend Developer
- Deployment → DevOps (if available)

### Node Backend Developer
**EXCLUSIVELY OWNS**:
- Server implementation (Express/Fastify/NestJS)
- Business logic implementation
- Database query implementation
- Background job processing
- Server-side validation logic
- Integration testing

**DELEGATES TO OTHERS**:
- API contract design → API Developer
- Database schema design → Database Architect (or self if no DBA)
- Frontend components → React Developer
- System architecture → Solution Architect

### API Developer
**EXCLUSIVELY OWNS**:
- API contract specification (OpenAPI/GraphQL schema)
- Endpoint URL structure
- Request/response formats
- API versioning strategy
- API documentation
- Rate limiting rules (design, not implementation)

**DELEGATES TO OTHERS**:
- Implementation → Backend Developer
- Architecture decisions → Solution Architect
- Security implementation → Backend Developer
- Database operations → Backend Developer

### Solution Architect
**EXCLUSIVELY OWNS**:
- Technology stack selection
- System architecture patterns
- Microservice vs monolith decisions
- Cloud platform selection
- Scaling strategy
- Cross-cutting concerns strategy

**DELEGATES TO OTHERS**:
- API design details → API Developer
- Component implementation → React/Backend Developers
- Database schema → Backend Developer
- DevOps implementation → DevOps Engineer

### TypeScript Expert
**EXCLUSIVELY OWNS**:
- TypeScript configuration
- Complex type definitions
- Generic type patterns
- Type system architecture
- Migration strategies (JS to TS)

**DELEGATES TO OTHERS**:
- Component types → React Developer
- API types → API Developer
- Business logic types → Backend Developer

## Handoff Protocol

### Clear Handoff Points

1. **Architecture → API Design**
   - Architect: "Use REST API with JWT auth"
   - API Developer: Takes over endpoint design

2. **API Design → Implementation**
   - API Developer: "Here's the OpenAPI spec"
   - Backend Developer: Implements the spec

3. **Backend → Frontend**
   - Backend: "API endpoints are ready at /api/v1"
   - React Developer: Integrates with API

4. **TypeScript → All Developers**
   - TS Expert: "Here's the type architecture"
   - Others: Use types in their domains

## Decision Authority Matrix

| Decision | Architect | API Dev | Backend | React | TypeScript |
|----------|-----------|---------|---------|-------|------------|
| REST vs GraphQL | ✅ | ❌ | ❌ | ❌ | ❌ |
| Endpoint URLs | ❌ | ✅ | ❌ | ❌ | ❌ |
| Business Logic | ❌ | ❌ | ✅ | ❌ | ❌ |
| Component State | ❌ | ❌ | ❌ | ✅ | ❌ |
| Type Architecture | ❌ | ❌ | ❌ | ❌ | ✅ |
| Database Schema | ❌ | ❌ | ✅ | ❌ | ❌ |
| API Response Format | ❌ | ✅ | ❌ | ❌ | ❌ |
| Caching Strategy | ✅ | Consult | Implement | ❌ | ❌ |
| Auth Method | ✅ | Design | Implement | Use | ❌ |

## Collaboration Rules

### Rule 1: Single Owner
Every technical decision has exactly ONE owner. Others may consult but not decide.

### Rule 2: Clear Interfaces
Agents communicate through well-defined interfaces (specs, schemas, types).

### Rule 3: No Implementation Overlap
If two agents could implement the same thing, assign to one explicitly.

### Rule 4: Consultation vs Decision
- **Consult**: Provide input, requirements, constraints
- **Decide**: Make the final technical choice
- **Implement**: Execute the decision

## Anti-Pattern Detection

### 🚫 OVERLAPS TO AVOID

1. **API Developer implementing endpoints**
   - Wrong: API Developer writes Express routes
   - Right: API Developer designs, Backend implements

2. **Backend Developer designing API contracts**
   - Wrong: Backend creates OpenAPI on the fly
   - Right: Backend implements pre-defined spec

3. **React Developer handling auth logic**
   - Wrong: React implements JWT validation
   - Right: React uses auth hooks, Backend validates

4. **Multiple agents defining types**
   - Wrong: Each agent creates own types
   - Right: TypeScript Expert defines shared types

5. **Solution Architect implementing code**
   - Wrong: Architect writes implementation
   - Right: Architect designs, others implement

## Workflow Example

### Feature: User Authentication

1. **Solution Architect**
   - Decides: JWT with refresh tokens
   - Output: Architecture decision

2. **API Developer**
   - Designs: `/auth/login`, `/auth/refresh` endpoints
   - Output: OpenAPI specification

3. **TypeScript Expert**
   - Defines: User, Token, AuthResponse types
   - Output: Type definitions

4. **Backend Developer**
   - Implements: JWT generation, validation
   - Output: Working endpoints

5. **React Developer**
   - Implements: Login form, auth context
   - Output: UI components

### Clear Separation
- No agent steps on another's domain
- Each output feeds the next agent
- Clear handoff points

## Capability Gaps

If no agent owns a capability, assign to nearest match:

| Gap | Default Owner | Reason |
|-----|--------------|---------|
| Database Schema | Backend Developer | Closest to data layer |
| DevOps | Solution Architect | Overall system view |
| Testing Strategy | Each for their domain | Domain expertise |
| Performance Tuning | Domain owner | Best knows their code |
| Documentation | Creator of artifact | Best understands it |

## Communication Templates

### Architect to API Developer
"Technology decision: [REST/GraphQL/tRPC]. Requirements: [auth needs, performance targets]. Constraints: [budget, timeline]."

### API Developer to Backend
"API specification complete: [link to OpenAPI/schema]. Key endpoints: [list]. Special requirements: [rate limits, caching]."

### Backend to Frontend
"API implemented at [base URL]. Authentication: [method]. Test credentials: [if applicable]."

### TypeScript Expert to All
"Type definitions at [path]. Key interfaces: [list]. Usage examples: [snippets]."