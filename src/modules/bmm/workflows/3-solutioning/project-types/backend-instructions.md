# Backend/API Service Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for backend/API architecture decisions.
The LLM should:
- Analyze the PRD to understand data flows, performance needs, and integrations
- Guide decisions based on scale, team size, and operational complexity
- Focus only on relevant architectural areas
- Make intelligent recommendations that align with project requirements
- Keep explanations concise and decision-focused
</critical>

## Service Architecture Pattern

**Determine the Right Architecture**
Based on the requirements, guide toward the appropriate pattern:

- **Monolith**: For most projects starting out, single deployment, simple operations
- **Microservices**: Only when there's clear domain separation, large teams, or specific scaling needs
- **Serverless**: For event-driven workloads, variable traffic, or minimal operations
- **Modular Monolith**: Best of both worlds for growing projects

Don't default to microservices - most projects benefit from starting simple.

## Language and Framework Selection

**Choose Based on Context**
Consider these factors intelligently:

- Team expertise (use what the team knows unless there's a compelling reason)
- Performance requirements (Go/Rust for high performance, Python/Node for rapid development)
- Ecosystem needs (Python for ML/data, Node for full-stack JS, Java for enterprise)
- Hiring pool and long-term maintenance

For beginners: Suggest mainstream options with good documentation.
For experts: Let them specify preferences, discuss specific trade-offs only if asked.

## API Design Philosophy

**Match API Style to Client Needs**

- REST: Default for public APIs, simple CRUD, wide compatibility
- GraphQL: Multiple clients with different data needs, complex relationships
- gRPC: Service-to-service communication, high performance binary protocols
- WebSocket/SSE: Real-time requirements

Don't ask about API paradigm if it's obvious from requirements (e.g., real-time chat needs WebSocket).

## Data Architecture

**Database Decisions Based on Data Characteristics**
Analyze the data requirements to suggest:

- **Relational** (PostgreSQL/MySQL): Structured data, ACID requirements, complex queries
- **Document** (MongoDB): Flexible schemas, hierarchical data, rapid prototyping
- **Key-Value** (Redis/DynamoDB): Caching, sessions, simple lookups
- **Time-series**: IoT, metrics, event data
- **Graph**: Social networks, recommendation engines

Consider polyglot persistence only for clear, distinct use cases.

**Data Access Layer**

- ORMs for developer productivity and type safety
- Query builders for flexibility with some safety
- Raw SQL only when performance is critical

Match to team expertise and project complexity.

## Security and Authentication

**Security Appropriate to Risk**

- Internal tools: Simple API keys might suffice
- B2C applications: Managed auth services (Auth0, Firebase Auth)
- B2B/Enterprise: SAML, SSO, advanced RBAC
- Financial/Healthcare: Compliance-driven requirements

Don't over-engineer security for prototypes, don't under-engineer for production.

## Messaging and Events

**Only If Required by the Architecture**
Determine if async processing is actually needed:

- Message queues for decoupling, reliability, buffering
- Event streaming for event sourcing, real-time analytics
- Pub/sub for fan-out scenarios

Skip this entirely for simple request-response APIs.

## Operational Considerations

**Observability Based on Criticality**

- Development: Basic logging might suffice
- Production: Structured logging, metrics, tracing
- Mission-critical: Full observability stack

**Scaling Strategy**

- Start with vertical scaling (simpler)
- Plan for horizontal scaling if needed
- Consider auto-scaling for variable loads

## Performance Requirements

**Right-Size Performance Decisions**

- Don't optimize prematurely
- Identify actual bottlenecks from requirements
- Consider caching strategically, not everywhere
- Database optimization before adding complexity

## Integration Patterns

**External Service Integration**
Based on the PRD's integration requirements:

- Circuit breakers for resilience
- Rate limiting for API consumption
- Webhook patterns for event reception
- SDK vs. API direct calls

## Deployment Strategy

**Match Deployment to Team Capability**

- Small teams: Managed platforms (Heroku, Railway, Fly.io)
- DevOps teams: Kubernetes, cloud-native
- Enterprise: Consider existing infrastructure

**CI/CD Complexity**

- Start simple: Platform auto-deploy
- Add complexity as needed: testing stages, approvals, rollback

## Adaptive Guidance Examples

**For a REST API serving a mobile app:**
Focus on response times, offline support, versioning, and push notifications.

**For a data processing pipeline:**
Emphasize batch vs. stream processing, data validation, error handling, and monitoring.

**For a microservices migration:**
Discuss service boundaries, data consistency, service discovery, and distributed tracing.

**For an enterprise integration:**
Focus on security, compliance, audit logging, and existing system compatibility.

## Key Principles

1. **Start simple, evolve as needed** - Don't build for imaginary scale
2. **Use boring technology** - Proven solutions over cutting edge
3. **Optimize for your constraint** - Development speed, performance, or operations
4. **Make reversible decisions** - Avoid early lock-in
5. **Document the "why"** - But keep it brief

## Output Format

Structure decisions as:

- **Choice**: [Specific technology with version]
- **Rationale**: [One sentence why this fits the requirements]
- **Trade-off**: [What we're optimizing for vs. what we're accepting]

Keep technical decisions definitive and version-specific for LLM consumption.
