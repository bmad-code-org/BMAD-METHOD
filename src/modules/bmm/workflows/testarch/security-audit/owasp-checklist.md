# OWASP Top 10 (2021) Security Checklist

## A01:2021 - Broken Access Control

### Access Control Checks
- [ ] All endpoints require authentication unless explicitly public
- [ ] Authorization checked on every request (not just UI)
- [ ] Deny by default policy implemented
- [ ] CORS properly configured with allowlisted origins
- [ ] Directory listing disabled on web servers
- [ ] Metadata files (.git, .svn) not accessible
- [ ] Rate limiting implemented on sensitive endpoints

### IDOR Prevention
- [ ] Object references are indirect or validated
- [ ] User can only access their own resources
- [ ] Admin functions properly protected
- [ ] API endpoints validate ownership

### Session Security
- [ ] Session invalidated on logout
- [ ] Session timeout implemented
- [ ] Session fixation prevented
- [ ] Concurrent session limits (if required)

---

## A02:2021 - Cryptographic Failures

### Data Protection
- [ ] Sensitive data identified and classified
- [ ] Data encrypted at rest
- [ ] Data encrypted in transit (TLS 1.2+)
- [ ] No sensitive data in URLs
- [ ] Secure cookies (HttpOnly, Secure, SameSite)

### Password Security
- [ ] Passwords hashed with bcrypt/argon2/scrypt
- [ ] No MD5/SHA1 for passwords
- [ ] Salt unique per password
- [ ] Work factor appropriate (>=10 for bcrypt)

### Key Management
- [ ] No hardcoded secrets in code
- [ ] Secrets in environment variables or vault
- [ ] Encryption keys rotated periodically
- [ ] Secure random number generation

---

## A03:2021 - Injection

### SQL Injection
- [ ] Parameterized queries used everywhere
- [ ] ORM/query builder used correctly
- [ ] No string concatenation in queries
- [ ] Input validation on all user data

### NoSQL Injection
- [ ] MongoDB queries use proper operators
- [ ] No eval() on user input
- [ ] Input sanitized for NoSQL patterns

### Command Injection
- [ ] No shell commands with user input
- [ ] If needed, strict allowlist validation
- [ ] Escape special characters

### XSS Prevention
- [ ] Output encoding on all user data
- [ ] Content-Security-Policy header set
- [ ] Dangerous HTML stripped or sanitized
- [ ] Template engines auto-escape

---

## A04:2021 - Insecure Design

### Threat Modeling
- [ ] Security requirements documented
- [ ] Threat model exists for critical flows
- [ ] Security user stories in backlog

### Business Logic
- [ ] Rate limiting on business operations
- [ ] Transaction limits enforced server-side
- [ ] Workflow state validated

### Error Handling
- [ ] Generic error messages to users
- [ ] Detailed errors only in logs
- [ ] No stack traces in production

---

## A05:2021 - Security Misconfiguration

### Server Configuration
- [ ] Unnecessary features disabled
- [ ] Default accounts removed/changed
- [ ] Directory browsing disabled
- [ ] Error pages customized

### Security Headers
- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options or CSP frame-ancestors
- [ ] Strict-Transport-Security
- [ ] X-XSS-Protection (legacy browsers)
- [ ] Referrer-Policy

### Cloud/Container Security
- [ ] Least privilege IAM roles
- [ ] Security groups properly configured
- [ ] Container images scanned
- [ ] No root processes in containers

---

## A06:2021 - Vulnerable Components

### Dependency Management
- [ ] Dependencies up to date
- [ ] No known CVEs in dependencies
- [ ] Automated vulnerability scanning
- [ ] Lock files committed (package-lock, yarn.lock)

### Update Process
- [ ] Regular dependency updates scheduled
- [ ] Security updates prioritized
- [ ] Breaking changes tested before deploy

---

## A07:2021 - Authentication Failures

### Password Policies
- [ ] Minimum length >= 8 characters
- [ ] No common password check
- [ ] Breach database check (optional)
- [ ] Account lockout after failures

### Multi-Factor Authentication
- [ ] MFA available for sensitive accounts
- [ ] MFA recovery process secure
- [ ] TOTP/WebAuthn preferred over SMS

### Session Management
- [ ] Strong session IDs (>=128 bits)
- [ ] Session regeneration on privilege change
- [ ] Secure session storage

---

## A08:2021 - Software Integrity Failures

### CI/CD Security
- [ ] Build pipeline secured
- [ ] Dependency sources verified
- [ ] Signed commits (optional)
- [ ] Artifact integrity verified

### Deserialization
- [ ] No unsafe deserialization of user data
- [ ] Type checking before deserialization
- [ ] Integrity checks on serialized data

---

## A09:2021 - Logging & Monitoring Failures

### Logging
- [ ] Authentication events logged
- [ ] Access control failures logged
- [ ] Input validation failures logged
- [ ] Sensitive data NOT logged

### Monitoring
- [ ] Alerts for suspicious activity
- [ ] Log aggregation implemented
- [ ] Incident response plan exists

---

## A10:2021 - Server-Side Request Forgery

### URL Validation
- [ ] User-supplied URLs validated
- [ ] Allowlist of permitted domains
- [ ] No access to internal services
- [ ] DNS rebinding prevented

### Network Segmentation
- [ ] Internal services not exposed
- [ ] Firewall rules block unnecessary traffic

---

## Severity Rating Guide

| Severity | CVSS Score | Examples |
|----------|------------|----------|
| Critical | 9.0-10.0 | RCE, Auth bypass, Data breach |
| High | 7.0-8.9 | SQL injection, Privilege escalation |
| Medium | 4.0-6.9 | XSS, CSRF, Info disclosure |
| Low | 0.1-3.9 | Minor info leak, Missing headers |

---

## References

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
