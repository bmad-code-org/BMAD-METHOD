# <!-- Powered by BMAD™ Core -->

# Full-Stack JavaScript Best Practices

## General Principles
- **Type Safety First** - Use TypeScript strict mode
- **Test Critical Paths** - Focus testing on business logic
- **Security by Default** - Validate all inputs, sanitize outputs
- **Performance Matters** - Optimize from the start
- **Document Decisions** - Use ADRs for major choices

## Frontend Best Practices

### React
- Use functional components with hooks
- Memoize expensive computations with useMemo/useCallback
- Extract custom hooks for reusable logic
- Keep components small (< 300 lines)
- Use React.memo for expensive components
- Implement error boundaries
- Handle loading and error states

### State Management
- Use React Query for server state
- Keep state as local as possible
- Lift state only when needed
- Avoid prop drilling (use Context sparingly)
- Use Zustand for simple global state
- Redux Toolkit for complex state

### Performance
- Code split routes and heavy components
- Lazy load images below the fold
- Use next/image or optimized images
- Virtual scroll long lists
- Prefetch critical resources
- Minimize bundle size

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast (4.5:1)
- Provide focus indicators

## Backend Best Practices

### API Design
- Follow RESTful conventions
- Version APIs from day one (/api/v1/)
- Use proper HTTP methods and status codes
- Implement pagination for lists
- Add rate limiting
- Document with OpenAPI/Swagger

### Security
- Hash passwords with bcrypt
- Use JWT with short expiration
- Validate all inputs (Zod, Joi)
- Sanitize user-generated content
- Use parameterized queries
- Enable CORS for specific origins
- Set security headers (Helmet.js)

### Database
- Use an ORM (Prisma recommended)
- Add indexes on frequently queried fields
- Avoid N+1 queries
- Use transactions for multi-step operations
- Implement connection pooling
- Regular backups

### Error Handling
- Use custom error classes
- Centralized error handling middleware
- Log errors with context
- Return user-friendly messages
- Hide stack traces in production
- Monitor error rates

## Testing Best Practices

### Frontend
- Test user interactions, not implementation
- Use React Testing Library
- Mock external dependencies
- Test accessibility with axe-core
- E2E tests for critical flows (Playwright)
- Aim for > 80% coverage

### Backend
- Test business logic thoroughly
- Integration tests for APIs (Supertest)
- Mock external services
- Test error scenarios
- Database tests with test database
- Aim for > 85% coverage

## DevOps Best Practices

### CI/CD
- Run tests on every commit
- Lint and type check in CI
- Automated deployments to staging
- Manual approval for production
- Rollback capability

### Monitoring
- Set up error tracking (Sentry)
- Application performance monitoring
- Log aggregation
- Uptime monitoring
- Alert on critical issues

### Deployment
- Use environment variables
- Blue-green or canary deployments
- Health check endpoints
- Database migrations before deployment
- Zero-downtime deployments

## Code Quality

### General
- Follow single responsibility principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Write self-documenting code

### Code Review
- Review all changes before merging
- Provide constructive feedback
- Approve only when standards met
- Share knowledge through reviews

### Documentation
- README with setup instructions
- Architecture decision records (ADRs)
- API documentation (OpenAPI)
- Inline comments for complex logic
- Keep documentation up to date

## Performance Budgets

### Frontend
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle size < 200KB (gzipped)

### Backend
- API response < 200ms (p95)
- Database query < 100ms
- Uptime > 99.9%
- Error rate < 0.1%

## Common Anti-Patterns to Avoid

### Frontend
- ❌ Prop drilling (use Context or state library)
- ❌ Inline functions in render
- ❌ Mutating state directly
- ❌ Missing key props in lists
- ❌ Using index as key
- ❌ Too many useEffect dependencies

### Backend
- ❌ Callback hell (use async/await)
- ❌ Not validating inputs
- ❌ Ignoring errors
- ❌ Synchronous operations
- ❌ Missing error handling
- ❌ Not using transactions

### Database
- ❌ N+1 queries
- ❌ Missing indexes
- ❌ SELECT * (select specific fields)
- ❌ Not using pagination
- ❌ Storing unencrypted sensitive data

## Quick Wins
- Add TypeScript for type safety
- Enable ESLint and Prettier
- Set up pre-commit hooks (Husky)
- Add database indexes
- Enable gzip compression
- Use CDN for static assets
- Implement caching (Redis)
- Add monitoring (Sentry)
- Write integration tests
- Document setup in README