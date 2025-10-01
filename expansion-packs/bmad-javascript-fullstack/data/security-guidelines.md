# <!-- Powered by BMAD™ Core -->

# Security Guidelines for JavaScript Applications

## Authentication

### Password Security
- Use bcrypt or argon2 with 10-12 rounds
- Minimum length: 8 characters
- Require mix of letters, numbers, symbols
- Store only hashed passwords, never plain text
- Implement password reset with expiring tokens

### JWT Tokens
- Short expiration (15-60 minutes)
- Refresh token strategy
- Store in httpOnly cookies or secure storage
- Sign with strong secret (256-bit)
- Include user ID and minimal claims only

### Example:
```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Generate JWT
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);
```

## Input Validation

### Frontend Validation
- For UX, not security
- Validate with React Hook Form + Zod
- Show user-friendly error messages

### Backend Validation (Critical)
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().min(0).max(150),
});

// Validate
const result = userSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error });
}
```

## SQL Injection Prevention
- Always use parameterized queries
- Use ORMs (Prisma, TypeORM)
- Never concatenate user input into SQL

```typescript
// ✅ Good - Prisma
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// ❌ Bad - Raw SQL with concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

## XSS Prevention
- React escapes by default
- Avoid dangerouslySetInnerHTML
- Use DOMPurify if HTML needed
- Set Content Security Policy headers

```typescript
// CSP Header
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));
```

## CSRF Protection
- Use CSRF tokens for state-changing operations
- SameSite cookies (Strict or Lax)
- Validate request origin

```typescript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
```

## CORS Configuration
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  maxAge: 86400,
}));
```

## Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: 'Too many requests',
});

app.use('/api', limiter);

// Stricter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

app.use('/api/auth', authLimiter);
```

## Security Headers
```typescript
import helmet from 'helmet';

app.use(helmet());
// Sets: X-Content-Type-Options, X-Frame-Options,
// Strict-Transport-Security, etc.
```

## Secrets Management
- Never commit .env files
- Use environment variables
- Rotate secrets regularly
- Use secret management services (AWS Secrets Manager)

```.env.example
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
STRIPE_SECRET_KEY=sk_test_...
```

## HTTPS/TLS
- Use HTTPS in production (always)
- Redirect HTTP to HTTPS
- Use HSTS header
- Valid SSL certificate

## File Uploads
```typescript
import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});
```

## OWASP Top 10 Checklist
- [ ] A01: Broken Access Control - Implement proper authorization
- [ ] A02: Cryptographic Failures - Use HTTPS, encrypt sensitive data
- [ ] A03: Injection - Use parameterized queries
- [ ] A04: Insecure Design - Security by design
- [ ] A05: Security Misconfiguration - Secure defaults
- [ ] A06: Vulnerable Components - Keep dependencies updated
- [ ] A07: Authentication Failures - Strong auth implementation
- [ ] A08: Data Integrity Failures - Validate and verify data
- [ ] A09: Logging Failures - Log security events
- [ ] A10: Server-Side Request Forgery - Validate URLs

## Security Audit Checklist
- [ ] npm audit passes (no high/critical vulnerabilities)
- [ ] All inputs validated on backend
- [ ] Passwords properly hashed
- [ ] JWT tokens expire appropriately
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Secrets not in code
- [ ] Database uses parameterized queries
- [ ] Error messages don't leak info
- [ ] Logging doesn't include sensitive data