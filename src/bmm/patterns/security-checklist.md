# Security Review Checklist

<overview>
Security vulnerabilities are CRITICAL issues. A single vulnerability can expose user data, enable account takeover, or cause financial loss.

**Principle:** Assume all input is malicious. Validate everything.
</overview>

<owasp_top_10>
## OWASP Top 10 Checks

### 1. Injection
```bash
# Check for SQL injection
grep -E "SELECT.*\+|INSERT.*\+|UPDATE.*\+|DELETE.*\+" . -r
grep -E '\$\{.*\}.*query|\`.*\$\{' . -r

# Check for command injection
grep -E "exec\(|spawn\(|system\(" . -r
```

**Fix:** Use parameterized queries, never string concatenation.

### 2. Broken Authentication
```bash
# Check for hardcoded credentials
grep -E "password.*=.*['\"]|api.?key.*=.*['\"]|secret.*=.*['\"]" . -r -i

# Check for weak session handling
grep -E "localStorage.*token|sessionStorage.*password" . -r
```

**Fix:** Use secure session management, never store secrets in code.

### 3. Sensitive Data Exposure
```bash
# Check for PII logging
grep -E "console\.(log|info|debug).*password|log.*email|log.*ssn" . -r -i

# Check for unencrypted transmission
grep -E "http://(?!localhost)" . -r
```

**Fix:** Never log sensitive data, always use HTTPS.

### 4. XML External Entities (XXE)
```bash
# Check for unsafe XML parsing
grep -E "parseXML|DOMParser|xml2js" . -r
```

**Fix:** Disable external entity processing.

### 5. Broken Access Control
```bash
# Check for missing auth checks
grep -E "export.*function.*(GET|POST|PUT|DELETE)" . -r | head -20
# Then verify each has auth check
```

**Fix:** Every endpoint must verify user has permission.

### 6. Security Misconfiguration
```bash
# Check for debug mode in prod
grep -E "debug.*true|NODE_ENV.*development" . -r

# Check for default credentials
grep -E "admin.*admin|password.*password|123456" . -r
```

**Fix:** Secure configuration, no defaults.

### 7. Cross-Site Scripting (XSS)
```bash
# Check for innerHTML usage
grep -E "innerHTML|dangerouslySetInnerHTML" . -r

# Check for unescaped output
grep -E "\$\{.*\}.*<|<.*\$\{" . -r
```

**Fix:** Always escape user input, use safe rendering.

### 8. Insecure Deserialization
```bash
# Check for unsafe JSON parsing
grep -E "JSON\.parse\(.*req\." . -r
grep -E "eval\(|Function\(" . -r
```

**Fix:** Validate structure before parsing.

### 9. Using Components with Known Vulnerabilities
```bash
# Check for outdated dependencies
npm audit
```

**Fix:** Keep dependencies updated, monitor CVEs.

### 10. Insufficient Logging
```bash
# Check for security event logging
grep -E "log.*(login|auth|permission|access)" . -r
```

**Fix:** Log security events with context.
</owasp_top_10>

<severity_ratings>
## Severity Ratings

| Severity | Impact | Examples |
|----------|--------|----------|
| CRITICAL | Data breach, account takeover | SQL injection, auth bypass |
| HIGH | Service disruption, data corruption | Logic flaws, N+1 queries |
| MEDIUM | Technical debt, maintainability | Missing validation, tight coupling |
| LOW | Code style, nice-to-have | Naming, documentation |

**CRITICAL and HIGH must be fixed before merge.**
</severity_ratings>
