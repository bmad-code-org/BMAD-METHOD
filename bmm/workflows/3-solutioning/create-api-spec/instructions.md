# API Design Workflow Instructions

## Overview

Design APIs using a contract-first approach. This workflow produces OpenAPI 3.0+ specifications, mock server configurations, and client SDK generation guidance.

## Workflow Steps

### Step 1: Context Loading

**Load existing documentation:**
1. Load PRD for feature requirements
2. Load Architecture document for system design
3. Load project-context.md for coding standards
4. Identify existing API patterns (if any)

### Step 2: API Style Selection

**Ask user for API style:**
```
API Style Selection

Available styles:
1. [rest] RESTful API (OpenAPI 3.0+)
2. [graphql] GraphQL Schema
3. [grpc] gRPC/Protocol Buffers
4. [websocket] WebSocket Event Schema

Select style [1-4]:
```

### Step 3: Resource Identification

**For REST APIs, identify resources:**
1. Extract nouns from PRD (users, orders, products, etc.)
2. Map to REST resources
3. Identify relationships (1:1, 1:N, N:N)
4. Determine resource hierarchy

**Questions to ask:**
- What are the main entities in this system?
- How do entities relate to each other?
- What operations are needed for each entity?
- Are there any batch operations required?

### Step 4: Endpoint Design

**For each resource, design endpoints:**

| Operation | Method | Path Pattern | Example |
|-----------|--------|--------------|---------|
| List | GET | /resources | GET /users |
| Create | POST | /resources | POST /users |
| Read | GET | /resources/{id} | GET /users/123 |
| Update | PUT/PATCH | /resources/{id} | PATCH /users/123 |
| Delete | DELETE | /resources/{id} | DELETE /users/123 |
| Nested | GET | /resources/{id}/subs | GET /users/123/orders |

**Naming conventions:**
- Use plural nouns for resources
- Use kebab-case for multi-word resources
- Use path parameters for identifiers
- Use query parameters for filtering/pagination

### Step 5: Request/Response Design

**For each endpoint, define:**

1. **Request body schema** (POST/PUT/PATCH)
   - Required vs optional fields
   - Data types and formats
   - Validation rules (min/max, pattern, enum)

2. **Response schema**
   - Success response structure
   - Error response structure
   - Pagination format

3. **Headers**
   - Authentication headers
   - Content-Type
   - Custom headers

**Standard response format:**
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2"
  }
}
```

**Standard error format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Step 6: Authentication & Authorization

**Define security scheme:**
```yaml
securitySchemes:
  bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
  apiKey:
    type: apiKey
    in: header
    name: X-API-Key
  oauth2:
    type: oauth2
    flows:
      authorizationCode:
        authorizationUrl: /oauth/authorize
        tokenUrl: /oauth/token
        scopes:
          read: Read access
          write: Write access
```

**Apply security to endpoints:**
- Public endpoints (no auth)
- Authenticated endpoints (user token)
- Admin-only endpoints (role-based)

### Step 7: Generate OpenAPI Specification

**Create OpenAPI 3.0+ document:**

```yaml
openapi: 3.0.3
info:
  title: {project_name} API
  version: 1.0.0
  description: |
    {api_description}

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging
  - url: http://localhost:3000/v1
    description: Development

paths:
  /resources:
    get:
      summary: List resources
      operationId: listResources
      tags:
        - Resources
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceList'

components:
  schemas:
    Resource:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
      required:
        - id
        - name

  parameters:
    page:
      name: page
      in: query
      schema:
        type: integer
        default: 1
    limit:
      name: limit
      in: query
      schema:
        type: integer
        default: 20
        maximum: 100
```

### Step 8: API Documentation

**Generate API design document with:**

1. **Overview**
   - API purpose and scope
   - Base URL and versioning strategy
   - Authentication methods

2. **Quick Start**
   - Getting API credentials
   - Making first request
   - Common patterns

3. **Resource Reference**
   - Detailed endpoint documentation
   - Request/response examples
   - Error codes

4. **Best Practices**
   - Rate limiting guidance
   - Pagination recommendations
   - Error handling

### Step 9: Mock Server Guidance

**Provide mock server setup:**

```bash
# Using Prism (OpenAPI)
npm install -g @stoplight/prism-cli
prism mock api-spec.yaml

# Using json-server (simple)
npm install -g json-server
json-server --watch db.json

# Using MSW (frontend mocking)
npm install msw --save-dev
```

**Include sample mock data:**
```json
{
  "users": [
    { "id": "1", "name": "Alice", "email": "alice@example.com" },
    { "id": "2", "name": "Bob", "email": "bob@example.com" }
  ]
}
```

### Step 10: SDK Generation Guidance

**Client SDK generation options:**

```bash
# OpenAPI Generator
npx @openapitools/openapi-generator-cli generate \
  -i api-spec.yaml \
  -g typescript-axios \
  -o ./sdk

# Available generators:
# - typescript-axios
# - typescript-fetch
# - python
# - go
# - java
# - csharp
```

**Type generation (TypeScript):**
```bash
# Using openapi-typescript
npx openapi-typescript api-spec.yaml -o types.d.ts
```

### Step 11: Validation Checklist

Before completing:
- [ ] All PRD features have corresponding endpoints
- [ ] Resource naming follows conventions
- [ ] Request/response schemas complete
- [ ] Authentication defined for protected endpoints
- [ ] Error responses documented
- [ ] Pagination implemented for list endpoints
- [ ] OpenAPI spec validates (use swagger-cli validate)
- [ ] Examples provided for complex endpoints

### Step 12: Output Files

**Save to:**
- OpenAPI spec: `{output_file}` (api-spec.yaml)
- API design doc: `{output_doc}` (api-design.md)

**Notify user with:**
- Summary of endpoints created
- Link to specification file
- Mock server quick start
- Next steps (implementation, SDK generation)
