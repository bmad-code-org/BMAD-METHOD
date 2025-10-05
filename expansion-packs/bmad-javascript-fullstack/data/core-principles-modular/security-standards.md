# Security Standards

## Authentication

- bcrypt/argon2 for passwords (10+ rounds)
- JWT with short access + long refresh tokens
- Refresh tokens in httpOnly cookies or secure DB
- Token rotation on refresh

## Input Validation

- Validate ALL inputs with Zod or Joi
- Sanitize HTML output to prevent XSS
- Parameterized queries for SQL injection prevention
- Whitelist, never blacklist

## API Security

- CORS with specific origins (not *)
- Rate limiting per user/endpoint
- CSRF protection for state changes
- Security headers with Helmet.js
- HTTPS in production always

## Secrets Management

- Never commit secrets to version control
- Use environment variables (.env)
- Rotate credentials regularly
- Minimal privilege principle
- Separate dev/staging/prod secrets