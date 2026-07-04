# Backend Patterns — AI Product Factory

Reference for backend implementation agents.

## Architecture Layers

```
Routes/Controllers → Services → Repositories → Database
```

## API Design

- RESTful by default; GraphQL only when justified
- Version prefix: `/api/v1/`
- Consistent error format: `{ error: { code, message, details } }`
- Pagination: cursor-based for lists
- Validation at route boundary (Zod/Pydantic)

## Auth Patterns

- JWT for stateless API auth
- Refresh token rotation
- RBAC for admin features
- Rate limiting on auth endpoints

## Database

- Migrations for all schema changes
- Soft deletes where appropriate
- Indexes on foreign keys and query columns
- Row-level security (Supabase) for multi-tenant

## Error Handling

- Never expose internal errors to clients
- Log with correlation IDs
- Structured logging (JSON)

## Testing

- Unit tests for services
- Integration tests for API routes
- Test database seeding for consistent state
