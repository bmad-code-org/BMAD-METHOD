# <!-- Powered by BMAD™ Core -->

# JavaScript/TypeScript Development Guidelines

Quick reference for coding standards and conventions. See `best-practices.md` for implementation patterns.

## TypeScript Standards

**Required tsconfig.json**: strict: true, noImplicitAny, strictNullChecks, noImplicitReturns, noUnusedLocals

**Type Rules:**
- No `any` - use `unknown` for truly unknown types
- `interface` for objects, `type` for unions/intersections
- Explicit function return types
- Generics for reusable type-safe code

## Naming Conventions

**Files:** kebab-case (utils), PascalCase (components), camelCase (hooks)
**Variables:** camelCase (functions/vars), PascalCase (classes), UPPER_SNAKE_CASE (constants)
**Descriptive:** `isLoading` not `loading`, `handleSubmit` not `submit`

## React Guidelines

**Hooks:** Top-level only, consistent order, no conditional calls
**State:** useState (local), React Query (server), Zustand (global), useMemo (derived)
**Components:** < 300 lines, TypeScript props, functional with hooks

## Backend Guidelines

**API Design:** RESTful (`GET /api/v1/users` not `/getUsers`), versioning, proper HTTP methods/codes
**Validation:** Zod or Joi for all inputs, sanitize outputs
**Error Handling:** Custom error classes, centralized middleware, structured logging

## Project Structure

**Frontend:** components/ (ui, features, layout), hooks/, lib/, pages/, styles/, types/
**Backend:** controllers/, services/, repositories/, middleware/, routes/, types/, config/

## Testing Standards

**Frontend:** React Testing Library, test interactions not implementation, >80% coverage
**Backend:** Jest + Supertest, integration tests for APIs, mock external services, >85% coverage

## Security (see security-guidelines.md for details)

**Auth:** bcrypt for passwords, JWT (short expiry), refresh tokens, httpOnly cookies
**Input:** Validate ALL inputs (Zod/Joi), sanitize HTML, parameterized queries
**API:** CORS (specific origins), rate limiting, CSRF protection, Helmet.js headers

## Performance (see best-practices.md for implementation)

**Frontend:** Code splitting, lazy loading, next/image, memoization, virtual scrolling
**Backend:** Database indexes, connection pooling, Redis caching, pagination, background jobs

## Git Commits

**Format:** `<type>(<scope>): <subject>`
**Types:** feat, fix, docs, style, refactor, test, chore
**Example:** `feat(auth): add password reset functionality`

## PR Checklist

- [ ] TypeScript compiles, ESLint passes
- [ ] All tests pass, coverage >80%
- [ ] No console.logs or debugger
- [ ] Meaningful commits, clear PR description
- [ ] Documentation updated