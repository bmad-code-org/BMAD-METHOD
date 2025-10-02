# <!-- Powered by BMAD™ Core -->

# Architecture Review Checklist

## Executive Summary
- [ ] System overview (2-3 paragraphs)
- [ ] Technology stack with versions
- [ ] Architecture pattern (monolith/microservices/serverless/JAMstack)
- [ ] 3-5 key design decisions with rationale
- [ ] Scalability approach

## Frontend
- [ ] Framework choice (React/Vue/etc) with version
- [ ] Build tool (Vite/Next.js/Webpack)
- [ ] State management strategy
- [ ] Routing (CSR vs SSR)
- [ ] Styling approach
- [ ] Component structure/organization
- [ ] Code splitting strategy
- [ ] SEO approach (SSR/SSG/CSR)

## Backend
- [ ] Node.js version + framework (Express/Fastify/NestJS)
- [ ] API design (REST/GraphQL/tRPC)
- [ ] Authentication strategy
- [ ] Authorization approach (RBAC/ABAC)
- [ ] Middleware stack
- [ ] Background jobs (if needed)
- [ ] File upload handling
- [ ] Email system

## Database
- [ ] Database choice (SQL/NoSQL) with justification
- [ ] Schema/entity design
- [ ] Key indexes
- [ ] Migration strategy
- [ ] Backup & retention
- [ ] Connection pooling

## API
- [ ] Versioning strategy
- [ ] Request/response format
- [ ] Error handling format
- [ ] Pagination approach
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Documentation (OpenAPI/Swagger)

## TypeScript
- [ ] Strict mode configuration
- [ ] Path aliases
- [ ] Shared types location

## Performance
- [ ] Targets (Lighthouse, API latency)
- [ ] Caching strategy (Redis/CDN)
- [ ] DB query optimization
- [ ] Asset optimization
- [ ] Bundle size targets

## Security
- [ ] Auth security (token expiry, refresh)
- [ ] Authorization checks
- [ ] Input validation (frontend + backend)
- [ ] SQL injection prevention
- [ ] XSS/CSRF protection
- [ ] Secrets management
- [ ] HTTPS enforcement
- [ ] Security headers (Helmet.js)
- [ ] Dependency scanning

## Scalability
- [ ] Horizontal scaling (stateless design)
- [ ] Database scaling strategy
- [ ] Cache invalidation
- [ ] CDN usage
- [ ] Auto-scaling triggers

## Reliability
- [ ] Error handling
- [ ] Structured logging
- [ ] Monitoring (APM/error tracking)
- [ ] Health check endpoints
- [ ] Graceful shutdown
- [ ] Zero-downtime migrations
- [ ] Rollback plan

## DevOps
- [ ] CI/CD pipeline
- [ ] Environment strategy (dev/staging/prod)
- [ ] Infrastructure as code
- [ ] Container strategy
- [ ] Deployment strategy (blue-green/canary/rolling)
- [ ] Backup & disaster recovery (RTO/RPO)

## Development & Quality
- [ ] README with setup instructions
- [ ] .env.example with all variables
- [ ] ESLint + Prettier configured
- [ ] Pre-commit hooks (Husky)
- [ ] Code style guide documented

## Testing
- [ ] Unit test framework (Jest/Vitest)
- [ ] Integration tests (Supertest)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Coverage goals (>80%)
- [ ] Tests in CI pipeline

## Documentation
- [ ] Architecture diagrams
- [ ] Database schema (ER diagram)
- [ ] API documentation (OpenAPI/GraphQL)
- [ ] Deployment guide
- [ ] ADRs for key decisions

## Risk Assessment
- [ ] Complexity risks identified
- [ ] Performance bottlenecks documented
- [ ] Scalability limits understood
- [ ] Technology risks flagged
- [ ] Mitigation plans for each risk

## Validation
- [ ] Requirements coverage complete
- [ ] Team has necessary skills
- [ ] Infrastructure costs estimated
- [ ] Architecture matches scope (not over/under-engineered)

**Ready for Implementation:** [ ] Yes [ ] No