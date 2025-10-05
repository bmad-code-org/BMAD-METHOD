# Agent Role Boundaries - Clear Separation of Concerns

## Solution Architect vs API Developer

### JavaScript Solution Architect
**OWNS**:
- **Technology Stack Selection**: Choosing frameworks, databases, cloud platforms
- **System Architecture**: Overall system design, component relationships, data flow
- **Architecture Patterns**: Monolith vs microservices, event-driven, serverless
- **High-Level API Strategy**: REST vs GraphQL vs tRPC decision (NOT implementation)
- **Infrastructure Design**: Cloud architecture, scaling strategy, deployment approach
- **Cross-Cutting Concerns**: Security architecture, caching strategy, monitoring
- **Trade-off Analysis**: Cost vs performance, complexity vs maintainability

**DOES NOT OWN**:
- Specific endpoint implementation
- OpenAPI/GraphQL schema details
- Request/response format details
- API versioning implementation
- Endpoint-level rate limiting

**DELEGATES TO**:
- API Developer: Detailed API design and contracts
- Backend Developer: Business logic implementation
- Frontend Developer: UI architecture details

### API Developer
**OWNS**:
- **API Contract Design**: Detailed endpoint specifications, request/response formats
- **API Documentation**: OpenAPI specs, GraphQL schemas, API guides
- **Endpoint Design**: URL structure, HTTP methods, status codes
- **Data Models**: Request/response DTOs, validation schemas
- **API Standards**: Naming conventions, versioning strategy, pagination
- **API-Level Security**: Authentication endpoints, rate limiting rules

**DOES NOT OWN**:
- Which API technology to use (REST vs GraphQL) - Architect decides
- Overall system architecture
- Database schema design
- Business logic implementation
- Infrastructure and deployment

**RECEIVES FROM ARCHITECT**:
- API technology choice (REST, GraphQL, tRPC)
- Authentication strategy (JWT, OAuth)
- Overall security requirements
- Performance requirements

## Collaboration Workflow

### Phase 1: Architecture (Solution Architect)
```
Architect analyzes requirements
→ Selects technology stack (including API type)
→ Designs high-level architecture
→ Creates architecture checkpoint
```

### Phase 2: API Design (API Developer)
```
API Developer receives architecture checkpoint
→ Designs detailed API contracts based on chosen technology
→ Creates OpenAPI/GraphQL schemas
→ Documents endpoints and data models
```

### Phase 3: Implementation (Backend/Frontend Developers)
```
Backend Developer implements API logic
Frontend Developer consumes API
Both follow contracts defined by API Developer
```

## Decision Matrix

| Decision | Solution Architect | API Developer | Backend Dev |
|----------|------------------|---------------|-------------|
| REST vs GraphQL vs tRPC | ✅ Decides | ❌ | ❌ |
| API endpoint structure | ❌ | ✅ Designs | ❌ |
| Database technology | ✅ Decides | ❌ | ❌ |
| Database schema | ❌ | ❌ | ✅ Designs |
| Authentication method | ✅ Decides strategy | ✅ Implements endpoints | ❌ |
| Business logic | ❌ | ❌ | ✅ Implements |
| API documentation | ❌ | ✅ Creates | ❌ |
| Microservices vs Monolith | ✅ Decides | ❌ | ❌ |
| API versioning strategy | ❌ | ✅ Decides | ❌ |
| Rate limiting rules | ❌ | ✅ Defines | ✅ Implements |
| Caching strategy | ✅ Overall strategy | ✅ API caching | ✅ Implementation |

## Example Scenarios

### Scenario 1: Building User Authentication
1. **Architect**: "Use JWT with refresh tokens, store in httpOnly cookies"
2. **API Developer**: Designs `/auth/login`, `/auth/refresh`, `/auth/logout` endpoints with request/response formats
3. **Backend Developer**: Implements bcrypt hashing, JWT generation, token validation

### Scenario 2: Choosing API Technology
1. **Architect**: "Use GraphQL for mobile app due to flexible queries and bandwidth optimization"
2. **API Developer**: Creates GraphQL schema, resolvers structure, subscription design
3. **Backend Developer**: Implements resolver logic, database queries

### Scenario 3: API Rate Limiting
1. **Architect**: "Need rate limiting for API protection"
2. **API Developer**: "100 req/min for free tier, 1000 req/min for paid, per-endpoint limits"
3. **Backend Developer**: Implements with Redis and rate-limit middleware

## Red Flags (Role Confusion)

❌ **API Developer deciding to use GraphQL** (Architect's decision)
❌ **Solution Architect writing OpenAPI specs** (API Developer's job)
❌ **API Developer designing database schema** (Backend Developer's job)
❌ **Backend Developer changing API contracts** (API Developer owns contracts)
❌ **Solution Architect implementing endpoints** (Backend Developer's job)

## Communication Protocol

### Architect → API Developer
Provides:
- Technology choice (REST/GraphQL/tRPC)
- Security requirements
- Performance constraints
- Integration requirements

### API Developer → Backend Developer
Provides:
- API contracts (OpenAPI/GraphQL schema)
- Validation rules
- Error response formats
- Authentication flow

### Feedback Loop
Backend Developer → API Developer: "This endpoint design causes N+1 queries"
API Developer → Architect: "GraphQL complexity requires caching layer"
Architect adjusts overall strategy based on implementation feedback