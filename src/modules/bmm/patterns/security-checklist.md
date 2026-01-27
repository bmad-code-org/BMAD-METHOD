# Security Review Checklist

**Philosophy:** Security issues are CRITICAL. No exceptions.

This checklist helps identify common security vulnerabilities in code reviews.

## CRITICAL Security Issues

These MUST be fixed. No story ships with these issues.

### 1. SQL Injection

**Look for:**
```javascript
// ❌ BAD: User input in query string
const query = `SELECT * FROM users WHERE id = '${userId}'`;
const query = "SELECT * FROM users WHERE id = '" + userId + "'";
```

**Fix with:**
```javascript
// ✅ GOOD: Parameterized queries
const query = db.prepare('SELECT * FROM users WHERE id = ?');
query.get(userId);

// ✅ GOOD: ORM/Query builder
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### 2. XSS (Cross-Site Scripting)

**Look for:**
```javascript
// ❌ BAD: Unsanitized user input in HTML
element.innerHTML = userInput;
document.write(userInput);
```

**Fix with:**
```javascript
// ✅ GOOD: Use textContent or sanitize
element.textContent = userInput;

// ✅ GOOD: Use framework's built-in escaping
<div>{userInput}</div> // React automatically escapes
```

### 3. Authentication Bypass

**Look for:**
```javascript
// ❌ BAD: No auth check
app.get('/api/admin/users', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});
```

**Fix with:**
```javascript
// ✅ GOOD: Require auth
app.get('/api/admin/users', requireAuth, async (req, res) => {
  const users = await getUsers();
  res.json(users);
});
```

### 4. Authorization Gaps

**Look for:**
```javascript
// ❌ BAD: No ownership check
app.delete('/api/orders/:id', async (req, res) => {
  await deleteOrder(req.params.id);
  res.json({ success: true });
});
```

**Fix with:**
```javascript
// ✅ GOOD: Verify user owns resource
app.delete('/api/orders/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  await deleteOrder(req.params.id);
  res.json({ success: true });
});
```

### 5. Hardcoded Secrets

**Look for:**
```javascript
// ❌ BAD: Secrets in code
const API_KEY = 'sk-1234567890abcdef';
const DB_PASSWORD = 'MyP@ssw0rd123';
```

**Fix with:**
```javascript
// ✅ GOOD: Environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// ✅ GOOD: Secrets manager
const API_KEY = await secretsManager.get('API_KEY');
```

### 6. Insecure Direct Object Reference (IDOR)

**Look for:**
```javascript
// ❌ BAD: Use user-supplied ID without validation
app.get('/api/documents/:id', async (req, res) => {
  const doc = await getDocument(req.params.id);
  res.json(doc);
});
```

**Fix with:**
```javascript
// ✅ GOOD: Verify access
app.get('/api/documents/:id', async (req, res) => {
  const doc = await getDocument(req.params.id);
  
  // Check user has permission to view this document
  if (!await userCanAccessDocument(req.user.id, doc.id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(doc);
});
```

## HIGH Security Issues

These should be fixed before shipping.

### 7. Missing Input Validation

**Look for:**
```javascript
// ❌ BAD: No validation
app.post('/api/users', async (req, res) => {
  await createUser(req.body);
  res.json({ success: true });
});
```

**Fix with:**
```javascript
// ✅ GOOD: Validate input
app.post('/api/users', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    age: z.number().min(18).max(120)
  });
  
  try {
    const data = schema.parse(req.body);
    await createUser(data);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});
```

### 8. Sensitive Data Exposure

**Look for:**
```javascript
// ❌ BAD: Exposing sensitive fields
const user = await getUser(userId);
res.json(user); // Contains password hash, SSN, etc.
```

**Fix with:**
```javascript
// ✅ GOOD: Select only safe fields
const user = await getUser(userId);
res.json({
  id: user.id,
  name: user.name,
  email: user.email
  // Don't include: password, ssn, etc.
});
```

### 9. Missing Rate Limiting

**Look for:**
```javascript
// ❌ BAD: No rate limit
app.post('/api/login', async (req, res) => {
  const user = await authenticate(req.body);
  res.json({ token: user.token });
});
```

**Fix with:**
```javascript
// ✅ GOOD: Rate limit sensitive endpoints
app.post('/api/login', 
  rateLimit({ max: 5, windowMs: 60000 }), // 5 attempts per minute
  async (req, res) => {
    const user = await authenticate(req.body);
    res.json({ token: user.token });
  }
);
```

### 10. Insecure Randomness

**Look for:**
```javascript
// ❌ BAD: Using Math.random() for tokens
const token = Math.random().toString(36);
```

**Fix with:**
```javascript
// ✅ GOOD: Cryptographically secure random
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');
```

## MEDIUM Security Issues

These improve security but aren't critical.

### 11. Missing HTTPS

**Look for:**
```javascript
// ❌ BAD: HTTP only
app.listen(3000);
```

**Fix with:**
```javascript
// ✅ GOOD: Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 12. Missing Security Headers

**Look for:**
```javascript
// ❌ BAD: No security headers
app.use(express.json());
```

**Fix with:**
```javascript
// ✅ GOOD: Add security headers
app.use(helmet()); // Adds multiple security headers
```

### 13. Verbose Error Messages

**Look for:**
```javascript
// ❌ BAD: Exposing stack traces
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.stack });
});
```

**Fix with:**
```javascript
// ✅ GOOD: Generic error message
app.use((error, req, res, next) => {
  console.error(error); // Log internally
  res.status(500).json({ error: 'Internal server error' });
});
```

## Review Process

### Step 1: Automated Checks

Run security scanners:
```bash
# Check for known vulnerabilities
npm audit

# Static analysis
npx eslint-plugin-security

# Secrets detection
git secrets --scan
```

### Step 2: Manual Review

Use this checklist to review:
- [ ] SQL injection vulnerabilities
- [ ] XSS vulnerabilities
- [ ] Authentication bypasses
- [ ] Authorization gaps
- [ ] Hardcoded secrets
- [ ] IDOR vulnerabilities
- [ ] Missing input validation
- [ ] Sensitive data exposure
- [ ] Missing rate limiting
- [ ] Insecure randomness

### Step 3: Document Findings

For each issue found:
```markdown
**Issue #1: SQL Injection Vulnerability**
- **Location:** api/users/route.ts:45
- **Severity:** CRITICAL
- **Problem:** User input concatenated into query
- **Code:**
  ```typescript
  const query = `SELECT * FROM users WHERE id = '${userId}'`
  ```
- **Fix:** Use parameterized queries with Prisma
```

## Remember

**Security issues are CRITICAL. They MUST be fixed.**

Don't let security issues slide because "we'll fix it later." Fix them now.
