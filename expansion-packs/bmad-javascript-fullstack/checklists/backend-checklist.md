# <!-- Powered by BMAD™ Core -->

# Backend Quality Checklist

## API Endpoint Quality

### RESTful Design
- [ ] **Resource-Based URLs** - Nouns not verbs (/users not /getUsers)
- [ ] **HTTP Methods** - GET, POST, PATCH, DELETE used correctly
- [ ] **Status Codes** - Appropriate status codes (200, 201, 400, 401, 404, 500)
- [ ] **Idempotency** - PUT and DELETE are idempotent
- [ ] **Versioning** - API versioned (e.g., /api/v1/)

### Request Handling
- [ ] **Input Validation** - All inputs validated (Zod, Joi, class-validator)
- [ ] **Type Safety** - TypeScript types for request/response
- [ ] **Query Parameters** - Pagination, filtering, sorting supported
- [ ] **Request Size Limits** - Body size limited (express.json limit)
- [ ] **Rate Limiting** - Rate limits applied per route

### Response Formatting
- [ ] **Consistent Format** - Standardized response structure
- [ ] **Error Responses** - Consistent error format with details
- [ ] **Pagination** - Cursor or offset pagination with metadata
- [ ] **Field Filtering** - Ability to select fields if needed
- [ ] **Timestamps** - ISO 8601 format timestamps

## Authentication & Authorization

- [ ] **Authentication** - JWT, OAuth, or session-based implemented
- [ ] **Token Expiration** - Access tokens expire (15-60 minutes)
- [ ] **Refresh Tokens** - Refresh token strategy implemented
- [ ] **Password Hashing** - bcrypt or argon2 with proper rounds
- [ ] **Authorization Middleware** - Role-based checks on protected routes
- [ ] **CORS** - Properly configured CORS headers
- [ ] **Rate Limiting** - Stricter limits on auth endpoints

## Database Operations

- [ ] **ORM Usage** - Prisma, TypeORM, or similar ORM used
- [ ] **Parameterized Queries** - No raw SQL with string concatenation
- [ ] **Transactions** - Multi-step operations use transactions
- [ ] **Connection Pooling** - Connection pool configured
- [ ] **Indexes** - Indexes on frequently queried fields
- [ ] **N+1 Prevention** - No N+1 query problems
- [ ] **Pagination** - Large datasets paginated

## Error Handling

- [ ] **Global Error Handler** - Centralized error handling middleware
- [ ] **Custom Error Classes** - Typed error classes for different errors
- [ ] **Error Logging** - Errors logged with context
- [ ] **Error Responses** - User-friendly error messages
- [ ] **Stack Traces** - Stack traces in development, hidden in production
- [ ] **Unhandled Rejections** - Process handlers for unhandled promises

## Security

- [ ] **Helmet.js** - Security headers configured
- [ ] **SQL Injection** - Protected via parameterized queries
- [ ] **XSS Prevention** - Input sanitization
- [ ] **CSRF Protection** - CSRF tokens or SameSite cookies
- [ ] **Secrets Management** - Environment variables, no hardcoded secrets
- [ ] **Dependency Scanning** - npm audit or Snyk in CI
- [ ] **HTTPS Only** - Redirect HTTP to HTTPS in production
- [ ] **Input Sanitization** - All user inputs sanitized

## Performance

- [ ] **Response Time** - < 200ms for p95
- [ ] **Caching** - Redis caching for frequently accessed data
- [ ] **Database Optimization** - Queries optimized with EXPLAIN
- [ ] **Compression** - Response compression enabled
- [ ] **Connection Reuse** - HTTP keep-alive enabled
- [ ] **Background Jobs** - Long-running tasks in queue (Bull, BullMQ)

## Testing

- [ ] **Unit Tests** - Business logic covered (>85%)
- [ ] **Integration Tests** - API endpoints tested (Supertest)
- [ ] **Database Tests** - Database operations tested
- [ ] **Authentication Tests** - Auth flows tested
- [ ] **Error Cases** - Error scenarios tested
- [ ] **CI Integration** - Tests run on every commit

## TypeScript Quality

- [ ] **Strict Mode** - TypeScript strict mode enabled
- [ ] **DTO Types** - DTOs typed with Zod or class-validator
- [ ] **Service Interfaces** - Services have TypeScript interfaces
- [ ] **No Any** - No `any` types (use `unknown`)
- [ ] **Type Guards** - Type guards for runtime type checking

## Logging & Monitoring

- [ ] **Structured Logging** - JSON logs with correlation IDs
- [ ] **Log Levels** - Appropriate log levels (error, warn, info, debug)
- [ ] **Error Tracking** - Sentry or similar integrated
- [ ] **Performance Monitoring** - APM tool integrated
- [ ] **Health Checks** - /health endpoint implemented
- [ ] **Metrics** - Prometheus or similar metrics

## API Documentation

- [ ] **OpenAPI/Swagger** - API documented with OpenAPI spec
- [ ] **Example Requests** - Example requests in documentation
- [ ] **Authentication** - Auth requirements documented
- [ ] **Error Codes** - All error codes documented
- [ ] **Rate Limits** - Rate limits documented

## Code Quality

- [ ] **Separation of Concerns** - Controller, Service, Repository layers
- [ ] **DRY Principle** - No code duplication
- [ ] **Function Size** - Functions under 50 lines
- [ ] **Dependency Injection** - Dependencies injected, not hardcoded
- [ ] **Configuration** - Environment-based configuration

**Quality Rating:** ⭐⭐⭐⭐⭐

**Ready for Production:** [ ] Yes [ ] No