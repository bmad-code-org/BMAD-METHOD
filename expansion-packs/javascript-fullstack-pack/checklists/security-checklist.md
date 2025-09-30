# <!-- Powered by BMAD™ Core -->

# Security Checklist

## Authentication
- [ ] **Password Hashing** - bcrypt/argon2 with sufficient rounds (10-12)
- [ ] **Token Expiration** - Access tokens expire (15-60 min)
- [ ] **Refresh Tokens** - Secure refresh token strategy
- [ ] **Token Storage** - HttpOnly cookies or secure storage
- [ ] **Password Requirements** - Min length, complexity enforced
- [ ] **Password Reset** - Secure password reset flow with expiring tokens
- [ ] **Account Lockout** - Lock after N failed attempts
- [ ] **Session Management** - Secure session handling

## Authorization
- [ ] **Route Protection** - All protected routes check auth
- [ ] **Resource Authorization** - Users can only access their resources
- [ ] **Role-Based Access** - RBAC implemented where needed
- [ ] **Principle of Least Privilege** - Minimal permissions by default

## Input Validation
- [ ] **Frontend Validation** - Client-side validation for UX
- [ ] **Backend Validation** - Server-side validation (never trust client)
- [ ] **Schema Validation** - Zod, Joi, or class-validator
- [ ] **Type Checking** - TypeScript for compile-time checks
- [ ] **Sanitization** - DOMPurify or similar for HTML content
- [ ] **File Uploads** - File type and size validation

## SQL Injection Prevention
- [ ] **Parameterized Queries** - Never concatenate SQL strings
- [ ] **ORM Usage** - Use Prisma, TypeORM, or similar
- [ ] **Input Validation** - Validate all user inputs

## XSS Prevention
- [ ] **Content Security Policy** - CSP headers configured
- [ ] **Output Encoding** - Escape user-generated content
- [ ] **Sanitization** - Sanitize HTML inputs
- [ ] **React Safety** - Use React's built-in XSS protection (dangerouslySetInnerHTML only when necessary)

## CSRF Protection
- [ ] **CSRF Tokens** - Tokens for state-changing operations
- [ ] **SameSite Cookies** - SameSite=Strict or Lax
- [ ] **Origin Validation** - Validate request origin

## CORS Configuration
- [ ] **Allowed Origins** - Whitelist specific origins, no wildcards in production
- [ ] **Credentials** - credentials: true only when necessary
- [ ] **Allowed Methods** - Only required methods
- [ ] **Preflight Caching** - maxAge set appropriately

## Secrets Management
- [ ] **Environment Variables** - All secrets in env vars
- [ ] **No Hardcoded Secrets** - No secrets in code
- [ ] **Secret Rotation** - Plan for rotating secrets
- [ ] **.env in .gitignore** - Never commit .env files
- [ ] **Production Secrets** - Use secret management service (AWS Secrets Manager, etc.)

## HTTPS/TLS
- [ ] **HTTPS Only** - All traffic over HTTPS
- [ ] **HTTP to HTTPS** - Redirect HTTP to HTTPS
- [ ] **HSTS Header** - Strict-Transport-Security header
- [ ] **TLS Version** - TLS 1.2 or higher
- [ ] **Valid Certificate** - Properly configured SSL certificate

## Security Headers
- [ ] **Helmet.js** - Use Helmet for Express/Fastify
- [ ] **X-Content-Type-Options** - nosniff
- [ ] **X-Frame-Options** - DENY or SAMEORIGIN
- [ ] **X-XSS-Protection** - 1; mode=block
- [ ] **Referrer-Policy** - no-referrer or strict-origin-when-cross-origin
- [ ] **Permissions-Policy** - Restrict browser features

## Rate Limiting
- [ ] **Global Rate Limit** - Prevent abuse (100 req/15min)
- [ ] **Auth Rate Limit** - Strict limits on login (5 req/15min)
- [ ] **Per-User Limits** - User-specific rate limits
- [ ] **Redis-backed** - Use Redis for distributed rate limiting

## Dependency Security
- [ ] **npm audit** - Run regularly and fix issues
- [ ] **Snyk/Dependabot** - Automated dependency scanning
- [ ] **Update Dependencies** - Keep dependencies up to date
- [ ] **Lock Files** - Commit package-lock.json or yarn.lock
- [ ] **Audit Third-party Code** - Review third-party packages

## API Security
- [ ] **API Keys** - Secure API key management
- [ ] **Token Rotation** - Rotate API keys periodically
- [ ] **Request Signing** - Sign sensitive requests
- [ ] **Rate Limiting** - Per-API-key rate limits
- [ ] **IP Whitelisting** - Whitelist IPs where appropriate

## Logging & Monitoring
- [ ] **Security Events** - Log authentication failures, authorization failures
- [ ] **No Sensitive Data** - Never log passwords, tokens, credit cards
- [ ] **Anomaly Detection** - Monitor for unusual patterns
- [ ] **Audit Trail** - Log important user actions

## Infrastructure Security
- [ ] **Firewall** - Proper firewall rules
- [ ] **Database Access** - Database not publicly accessible
- [ ] **Principle of Least Privilege** - Minimal IAM permissions
- [ ] **Regular Backups** - Encrypted backups
- [ ] **Vulnerability Scanning** - Regular security scans

## OWASP Top 10 Coverage
- [ ] **A01 Broken Access Control** - Authorization checks
- [ ] **A02 Cryptographic Failures** - Proper encryption
- [ ] **A03 Injection** - Input validation
- [ ] **A04 Insecure Design** - Security by design
- [ ] **A05 Security Misconfiguration** - Secure defaults
- [ ] **A06 Vulnerable Components** - Updated dependencies
- [ ] **A07 Authentication Failures** - Secure auth
- [ ] **A08 Data Integrity Failures** - Integrity checks
- [ ] **A09 Logging Failures** - Adequate logging
- [ ] **A10 SSRF** - SSRF prevention

**Security Rating:** ⭐⭐⭐⭐⭐