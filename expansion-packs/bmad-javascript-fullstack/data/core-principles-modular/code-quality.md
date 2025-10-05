# Code Quality Standards

## Naming Conventions

**Files**: kebab-case utilities, PascalCase components, camelCase hooks

**Variables**: camelCase functions/vars, PascalCase classes, UPPER_SNAKE constants

**Descriptive**: `isLoading` not `loading`, `handleSubmit` not `submit`

## TypeScript Rules

- No `any` - use `unknown` for truly unknown
- `interface` for objects, `type` for unions/intersections
- Explicit function return types
- Generics for reusable type-safe code
- Strict mode always enabled

## Testing Philosophy

- Test user interactions, not implementation
- Mock external dependencies
- Integration tests for critical paths
- Unit tests for complex logic
- Target >80% coverage on critical code

## Error Handling

- Custom error classes for different types
- Centralized error handling
- Structured logging with context
- Never expose stack traces in production
- Proper HTTP status codes (400, 401, 404, 500)

## Git Standards

**Commit Format**: `<type>(<scope>): <subject>`

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**: `feat(auth): add password reset`

**PR Requirements**:
- TypeScript compiles
- ESLint passes
- Tests pass, coverage >80%
- No console.logs
- Meaningful commits
- Clear description