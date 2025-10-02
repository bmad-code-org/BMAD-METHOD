# <!-- Powered by BMAD™ Core -->

# API Implementation Patterns

Reference guide for implementing REST, GraphQL, and tRPC APIs. Use this when implementing API designs.

## REST API Implementation

### Resource Naming
- Use nouns, not verbs (`/users` not `/getUsers`)
- Plural for collections (`/users` not `/user`)
- Hierarchical for relationships (`/users/123/posts`)
- kebab-case for multi-word resources (`/blog-posts`)

### HTTP Methods
- **GET**: Retrieve (safe, idempotent)
- **POST**: Create (not idempotent)
- **PUT**: Replace entire resource (idempotent)
- **PATCH**: Partial update (idempotent)
- **DELETE**: Remove (idempotent)

### Status Codes
- **2xx Success**: 200 OK, 201 Created, 204 No Content
- **4xx Client Errors**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx Server Errors**: 500 Internal Server Error, 503 Service Unavailable

### Versioning
- **URL path**: `/api/v1/users` (recommended - simple, explicit)
- **Header**: `Accept: application/vnd.api.v1+json` (cleaner URLs)
- **Query param**: `/api/users?version=1` (not recommended - breaks caching)

### Pagination
- **Offset-based**: `/users?page=1&limit=20` (simple, familiar)
- **Cursor-based**: `/users?cursor=abc123&limit=20` (consistent, handles real-time data)
- Always include: total count, has_next, has_prev

### Filtering & Sorting
- Query params: `/users?role=admin&status=active&sort=-createdAt`
- Use `-` prefix for descending sort
- Support multiple filters with AND logic
- Document available filters in API docs

### Error Responses
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {"field": "email", "message": "Invalid email format"}
    ]
  }
}
```

## GraphQL Implementation

### Schema Design
- Define types and relationships clearly
- Use enums for fixed values
- Mark required fields as non-null
- Input types for mutations
- Cursor-based pagination (connections)

### Resolver Best Practices
- Implement DataLoader to avoid N+1 queries
- Field-level resolvers for computed properties
- Structured error handling
- Authentication at resolver level
- Use context for request-scoped data

### Performance
- Query depth limiting (prevent deep nesting abuse)
- Query complexity analysis (cost-based)
- Persisted queries for production
- Caching with Apollo or similar
- Batching with DataLoader

### Error Handling
```graphql
type Error {
  message: String!
  code: String!
  path: [String!]
}

type UserResult {
  user: User
  errors: [Error!]
}
```

## tRPC Implementation

### Procedures
```typescript
import { z } from 'zod';

const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => db.user.findUnique({ where: { id: input } })),

  create: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2)
    }))
    .mutation(({ input }) => db.user.create({ data: input })),
});
```

### Middleware
- Auth middleware for protected procedures
- Logging middleware for all procedures
- Error handling middleware
- Context builders for request-scoped data

### Router Organization
- Separate routers by domain (user, post, comment)
- Merge at app level
- Share middleware across routers
- Type-safe throughout

## WebSocket Patterns

### Event Structure
```typescript
// Server → Client
{
  event: 'message',
  data: { userId: '123', text: 'Hello' },
  timestamp: 1234567890
}

// Client → Server
{
  action: 'send_message',
  payload: { text: 'Hello' }
}
```

### Connection Management
- Authenticate on connection
- Heartbeat/ping-pong for keepalive
- Reconnection logic with exponential backoff
- Room/channel management for broadcasts

### Error Handling
- Send error events to client
- Graceful degradation (fallback to polling)
- Connection state management

## Rate Limiting

### Implementation
- Token bucket algorithm (smooth traffic)
- Fixed window (simple, good enough)
- Sliding window (accurate, complex)

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
Retry-After: 60
```

### Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

## Caching

### HTTP Caching
```
Cache-Control: public, max-age=3600
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

### Conditional Requests
- `If-None-Match: "abc123"` → 304 Not Modified
- `If-Modified-Since: ...` → 304 Not Modified

### Cache Invalidation
- Time-based (TTL)
- Event-based (on mutations)
- Tag-based (grouped invalidation)

## Documentation

### OpenAPI/Swagger
- Define all endpoints, parameters, responses
- Include examples for each
- Document authentication
- Use tags for grouping
- Validate spec before deploying

### GraphQL SDL
- Add descriptions to all types and fields
- Document deprecations with @deprecated
- Provide usage examples in comments
- Auto-generate docs from schema
