# User Authentication API

## Overview

This API provides endpoints for user authentication and session management.

## Endpoints

### POST /api/auth/login

Authenticates a user and returns a token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### POST /api/auth/logout

Logs out the current user.

### GET /api/auth/me

Returns the current user's profile.

## Error Handling

Errors return appropriate HTTP status codes.

## Rate Limiting

Rate limiting is applied to prevent abuse.
