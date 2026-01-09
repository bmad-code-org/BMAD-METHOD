# API Design Checklist

## Resource Design
- [ ] Resources use plural nouns (users, orders, products)
- [ ] Resource names are lowercase with hyphens (user-profiles)
- [ ] Relationships expressed via nesting or links
- [ ] No verbs in resource paths (use HTTP methods instead)

## HTTP Methods
- [ ] GET for reading (no side effects)
- [ ] POST for creating new resources
- [ ] PUT for full resource replacement
- [ ] PATCH for partial updates
- [ ] DELETE for removing resources
- [ ] HEAD for metadata requests (if needed)
- [ ] OPTIONS for CORS preflight (automatic)

## Status Codes
- [ ] 200 OK for successful GET/PUT/PATCH
- [ ] 201 Created for successful POST
- [ ] 204 No Content for successful DELETE
- [ ] 400 Bad Request for malformed requests
- [ ] 401 Unauthorized for missing/invalid auth
- [ ] 403 Forbidden for insufficient permissions
- [ ] 404 Not Found for missing resources
- [ ] 409 Conflict for state conflicts
- [ ] 422 Unprocessable Entity for validation errors
- [ ] 429 Too Many Requests for rate limiting
- [ ] 500 Internal Server Error (avoid exposing details)

## Request Design
- [ ] Content-Type headers required for POST/PUT/PATCH
- [ ] Accept headers for content negotiation
- [ ] Query parameters for filtering/sorting/pagination
- [ ] Path parameters for resource identifiers
- [ ] Request body validation documented

## Response Design
- [ ] Consistent envelope structure (data, meta, links, error)
- [ ] Timestamps in ISO 8601 format
- [ ] IDs as strings (UUIDs recommended)
- [ ] Pagination for list endpoints
- [ ] HATEOAS links where appropriate

## Pagination
- [ ] Page-based or cursor-based pagination
- [ ] Default and maximum limits defined
- [ ] Total count available
- [ ] Navigation links included

## Filtering & Sorting
- [ ] Filter syntax documented
- [ ] Sortable fields specified
- [ ] Default sort order defined
- [ ] Multiple sort fields supported

## Authentication
- [ ] Auth method documented (Bearer, API Key, OAuth2)
- [ ] Token format specified (JWT structure)
- [ ] Token expiration documented
- [ ] Refresh token flow if applicable

## Authorization
- [ ] Per-endpoint permissions documented
- [ ] Role-based access defined
- [ ] Resource ownership rules clear

## Versioning
- [ ] Versioning strategy chosen (URL, header, parameter)
- [ ] Major version in URL (/v1/, /v2/)
- [ ] Deprecation policy documented
- [ ] Breaking changes defined

## Error Handling
- [ ] Error response format consistent
- [ ] Error codes meaningful and documented
- [ ] Validation errors include field details
- [ ] No sensitive info in error messages

## Security
- [ ] HTTPS required
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation on all fields
- [ ] SQL injection prevention
- [ ] No sensitive data in URLs

## Documentation
- [ ] OpenAPI 3.0+ specification complete
- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Authentication documented
- [ ] Error codes listed

## Testing
- [ ] Mock server available
- [ ] Example requests for each endpoint
- [ ] Postman/Insomnia collection exported
- [ ] SDK generation tested

---

## Quick Validation

```bash
# Validate OpenAPI spec
npx @stoplight/spectral-cli lint api-spec.yaml

# Alternative validation
npx swagger-cli validate api-spec.yaml

# Generate types (TypeScript)
npx openapi-typescript api-spec.yaml -o types.d.ts

# Start mock server
npx @stoplight/prism-cli mock api-spec.yaml
```
