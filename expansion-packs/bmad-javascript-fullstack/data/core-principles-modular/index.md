# Core Development Principles - Index

Modular core principles for efficient context loading. Load only what you need.

## Module Structure

### Essential (Load Always) - ~300 tokens
- `essential-principles.md` - Universal principles every agent must follow

### Context Management - ~400 tokens each
- `context-efficiency.md` - Token optimization and JIT loading
- `runtime-monitoring.md` - Token accounting and self-regulation
- `prompt-caching.md` - Cache optimization strategies

### Development Standards - ~200 tokens each
- `code-quality.md` - Naming, TypeScript, testing standards
- `security-standards.md` - Authentication, validation, API security
- `performance-standards.md` - Frontend and backend optimization
- `documentation-standards.md` - Code, API, architecture docs

## Loading Strategy

### For All Agents
```
ALWAYS LOAD:
- essential-principles.md (~300 tokens)

LOAD IF NEEDED:
- context-efficiency.md (when managing complex workflows)
- runtime-monitoring.md (when approaching token limits)
- prompt-caching.md (for repetitive tasks)
```

### By Agent Role

**React Developer**:
- essential-principles.md
- code-quality.md (TypeScript section)
- performance-standards.md (Frontend section)

**Node Backend Developer**:
- essential-principles.md
- code-quality.md (Testing section)
- security-standards.md (API section)
- performance-standards.md (Backend section)

**Solution Architect**:
- essential-principles.md
- context-efficiency.md
- All standards (for review)

**API Developer**:
- essential-principles.md
- documentation-standards.md (API section)
- security-standards.md (API security)