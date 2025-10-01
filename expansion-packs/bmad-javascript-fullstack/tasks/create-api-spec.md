# <!-- Powered by BMAD™ Core -->

# Create API Specification Task

## Purpose
Define complete API contracts for a JavaScript/TypeScript backend to ensure frontend-backend alignment and enable parallel development.

## When to Use
- Before starting backend implementation
- When adding new API endpoints
- Documenting existing APIs
- Enabling frontend-backend parallel development

## API Specification Structure

### 1. Overview
- API Purpose and Scope
- Base URL (`https://api.example.com/v1`)
- Authentication Method (JWT, OAuth, API Key)
- Rate Limiting Policy
- Versioning Strategy

### 2. Authentication
```typescript
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
```

### 3. Resource Endpoints
For each resource, document:

```
GET    /api/v1/users          # List users
GET    /api/v1/users/:id      # Get user by ID
POST   /api/v1/users          # Create user
PATCH  /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

### 4. Endpoint Documentation Template

**Endpoint:** `POST /api/v1/users`

**Description:** Create a new user account

**Authentication:** Required (Bearer token)

**Request Body:**
```typescript
interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}
```

**Response (201 Created):**
```typescript
interface CreateUserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

### 5. Type Definitions
Create comprehensive TypeScript interfaces for all DTOs

### 6. OpenAPI/Swagger
Generate OpenAPI 3.0 specification for documentation and testing

## Best Practices

- Use consistent naming (camelCase for JSON fields)
- Document all possible error codes
- Include example requests and responses
- Define pagination format for list endpoints
- Specify rate limits per endpoint
- Version the API from day one

## Validation
Use `checklists/api-design-checklist.md` to validate API design quality

## Tools
- Swagger Editor for OpenAPI specs
- Postman/Insomnia for testing
- TypeScript for type safety