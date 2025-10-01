# <!-- Powered by BMAD™ Core -->

# JavaScript/TypeScript Development Guidelines

## Overview
This document establishes coding standards, best practices, and conventions for JavaScript/TypeScript full-stack development. These guidelines ensure consistency, quality, and maintainability.

## TypeScript Standards

### Configuration
**Required tsconfig.json settings:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Definitions
- **No `any` types** - Use `unknown` if type is truly unknown
- **Interface vs Type** - Prefer interfaces for object shapes, types for unions/intersections
- **Explicit return types** - Always specify return types for functions
- **Proper generics** - Use generics for reusable type-safe code

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(id: any): any {
  return db.user.findUnique({ where: { id } });
}
```

## Naming Conventions

### Files and Folders
- **kebab-case** for utility files: `api-client.ts`, `string-utils.ts`
- **PascalCase** for components: `UserProfile.tsx`, `TodoList.tsx`
- **camelCase** for hooks: `useAuth.ts`, `useLocalStorage.ts`

### Variables and Functions
- **camelCase** for variables and functions: `userName`, `fetchData()`
- **PascalCase** for classes and components: `UserService`, `Button`
- **UPPER_SNAKE_CASE** for constants: `API_BASE_URL`, `MAX_RETRIES`
- **Descriptive names** - `isLoading` not `loading`, `handleSubmit` not `submit`

```typescript
// ✅ Good
const MAX_RETRY_COUNT = 3;
const isAuthenticated = checkAuth();
function calculateTotalPrice(items: Item[]): number { }

// ❌ Bad
const max = 3;
const auth = checkAuth();
function calc(items: any): any { }
```

## React Best Practices

### Component Structure
```typescript
// ✅ Good component structure
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### Hooks Rules
- Call hooks at the top level
- Call hooks in the same order
- Only call hooks from React functions

```typescript
// ✅ Good
function Component() {
  const [state, setState] = useState(0);
  const data = useFetch('/api/data');

  useEffect(() => {
    // effect
  }, []);

  return <div>{data}</div>;
}

// ❌ Bad - conditional hook
function Component() {
  if (condition) {
    useState(0); // ❌ Don't do this
  }
}
```

### State Management
- **Local state** - `useState` for component-only state
- **Server state** - React Query/SWR for API data
- **Global state** - Zustand/Redux only when necessary
- **Derived state** - `useMemo` for computed values

## Backend Best Practices

### API Endpoints
```typescript
// ✅ Good - RESTful design
GET    /api/v1/users
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

// ❌ Bad - non-RESTful
GET    /api/v1/getUsers
POST   /api/v1/createUser
POST   /api/v1/updateUser/:id
```

### Error Handling
```typescript
// ✅ Good - centralized error handling
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

### Input Validation
```typescript
// ✅ Good - Zod validation
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

app.post('/users', async (req, res) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors
    });
  }

  const user = await createUser(result.data);
  res.status(201).json(user);
});
```

## Code Organization

### Frontend Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── pages/            # Next.js pages or routes
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Utility functions
```

### Backend Structure
```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── repositories/     # Data access layer
├── middleware/       # Express/Fastify middleware
├── routes/           # Route definitions
├── types/            # TypeScript types
├── utils/            # Utility functions
└── config/           # Configuration files
```

## Testing Standards

### Frontend Tests
```typescript
// ✅ Good - React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Backend Tests
```typescript
// ✅ Good - Supertest API tests
import request from 'supertest';
import { app } from '../app';

describe('POST /users', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
  });
});
```

## Security Guidelines

### Authentication
- Hash passwords with bcrypt (10-12 rounds)
- Use JWT with short expiration (15-60 min)
- Implement refresh tokens
- Store tokens in httpOnly cookies

### Authorization
- Check permissions on every protected route
- Implement RBAC or ABAC
- Never trust client-side checks

### Input Validation
- Validate ALL user inputs
- Sanitize HTML content
- Use parameterized queries for SQL
- Validate file uploads (type, size)

### API Security
- Enable CORS with specific origins
- Use rate limiting
- Implement CSRF protection
- Set security headers (Helmet.js)

## Performance Guidelines

### Frontend
- Code split routes and heavy components
- Lazy load images below the fold
- Use next/image for automatic optimization
- Memoize expensive computations
- Virtual scroll long lists

### Backend
- Add database indexes on frequently queried fields
- Use connection pooling
- Implement caching (Redis)
- Paginate large datasets
- Use background jobs for long tasks

## Git Commit Conventions

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Code style (formatting, no logic change)
refactor: # Code refactoring
test:     # Adding tests
chore:    # Maintenance (deps, build, etc)

# Examples:
feat(auth): add password reset functionality
fix(api): handle null values in user endpoint
docs(readme): update setup instructions
refactor(components): extract Button component
```

## Code Review Checklist

Before submitting PR:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All tests pass
- [ ] Test coverage meets requirements (>80%)
- [ ] No console.logs or debugger statements
- [ ] Meaningful commit messages
- [ ] PR description explains changes
- [ ] Documentation updated if needed

This living document should be updated as the team establishes new patterns and best practices.