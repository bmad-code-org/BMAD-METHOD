# <!-- Powered by BMAD™ Core -->

# API Design Quality Checklist

## REST API Design
- [ ] **Resource Naming** - Plural nouns for collections (/users, /posts)
- [ ] **Nested Resources** - Logical nesting (/users/:id/posts)
- [ ] **HTTP Methods** - GET (read), POST (create), PATCH (update), DELETE (delete)
- [ ] **Filtering** - Query params for filtering (?status=active)
- [ ] **Sorting** - ?sort=createdAt&order=desc
- [ ] **Pagination** - Cursor or offset-based with hasMore/nextCursor
- [ ] **Field Selection** - ?fields=id,name,email to reduce payload
- [ ] **API Versioning** - /api/v1/ in URL or Accept header

## GraphQL API Design (if applicable)
- [ ] **Schema First** - Schema defined before implementation
- [ ] **Naming Conventions** - camelCase for fields, PascalCase for types
- [ ] **Pagination** - Relay-style cursor pagination
- [ ] **N+1 Prevention** - DataLoader for batching
- [ ] **Error Handling** - GraphQL errors with extensions

## tRPC API Design (if applicable)
- [ ] **Router Structure** - Logical router organization
- [ ] **Input Validation** - Zod schemas for all inputs
- [ ] **Type Safety** - Full end-to-end type safety
- [ ] **Error Handling** - TRPCError with proper codes

## Request/Response Format
- [ ] **Content-Type** - application/json for JSON APIs
- [ ] **Request Body** - Well-structured, validated JSON
- [ ] **Response Format** - Consistent structure across endpoints
- [ ] **Date Format** - ISO 8601 timestamps
- [ ] **Null vs Undefined** - Consistent handling (prefer null)

## Authentication & Authorization
- [ ] **Auth Strategy** - JWT, OAuth 2.0, or API keys
- [ ] **Token Location** - Authorization header (Bearer token)
- [ ] **Permissions** - Resource-level permissions defined
- [ ] **Scope-based Access** - Fine-grained scopes if needed

## Error Handling
- [ ] **Error Format** - { error: string, details?: array, code?: string }
- [ ] **Status Codes** - Appropriate HTTP status codes
- [ ] **Error Messages** - User-friendly messages
- [ ] **Validation Errors** - Field-specific error details
- [ ] **Error Codes** - Machine-readable error codes

## Performance
- [ ] **Response Time** - Target < 200ms (p95)
- [ ] **Caching Headers** - ETag, Cache-Control, Last-Modified
- [ ] **Compression** - gzip/brotli compression
- [ ] **Rate Limiting** - Per-endpoint rate limits
- [ ] **Batch Endpoints** - Batch operations where appropriate

## Documentation
- [ ] **OpenAPI Spec** - Complete OpenAPI 3.0 specification
- [ ] **Example Requests** - cURL examples for each endpoint
- [ ] **Example Responses** - Success and error examples
- [ ] **Authentication** - Auth requirements clearly documented
- [ ] **Status Codes** - All possible status codes documented

**API Quality Rating:** ⭐⭐⭐⭐⭐