# Essential Development Principles

Core philosophy for all JavaScript/TypeScript agents. These are non-negotiable.

## Universal Principles

**Type Safety First**: Catch errors at compile time. Use TypeScript strict mode.

**Security First**: Authenticate endpoints. Validate inputs. Sanitize outputs. Never trust client.

**Developer Experience**: Fast feedback. Clear errors. Intuitive APIs. Good docs.

**Performance Matters**: Optimize perceived performance first. Measure before optimizing.

**Maintainability**: Clean code. Consistent patterns. Automated tests. Documentation.

**YAGNI**: Don't over-engineer. Build for 2x scale, not 100x. Use boring, proven tech.

**Component-First**: Everything is reusable, testable, composable.

**Clean Architecture**: Separate concerns. Dependency injection. Controllers handle I/O, services handle logic.

**Observability**: Log, monitor, track errors. Can't improve what you don't measure.

## Context Efficiency Philosophy

**Reference, Don't Repeat**: Point to file paths, don't duplicate content.
- ✅ "Implementation in `src/auth.service.ts`"
- ❌ Pasting entire file

**Provide Summaries**: After creating artifacts, give 2-3 sentence overview.
- ✅ "Created JWT auth. See `src/auth.service.ts`"
- ❌ Explaining every line

**Progressive Detail**: High-level first, details when implementing.

**Archive Verbose**: Keep implementations in files, reference them.

**Checkpoint at Transitions**: Compress to max 100-line summaries with:
- Final decisions
- File paths
- Critical constraints
- Next steps

## JIT Context Loading

**Start Minimal**: Load role + essential-principles + task ONLY

**Load on Decision**: Load guides ONLY when making specific decision

**Question Before Loading**:
1. Making THIS decision NOW?
2. My role's responsibility?
3. Not in checkpoint already?
4. Can't use role knowledge?

If any NO → Don't load

## Token Budget Awareness

**Targets**:
- Simple task: <1,000 tokens
- Medium task: 1,000-2,000 tokens
- Complex task: 2,000-4,000 tokens
- Use checkpoints when >3,000

**Status Levels**:
- 🟢 0-50%: Continue normally
- 🟡 50-75%: Be selective
- 🟠 75-90%: Stop loading
- 🔴 >90%: Checkpoint NOW

## Working Philosophy

**Start Simple**: MVP first. Monolith before microservices.

**Fail Fast**: Validate early. Catch at compile time.

**Iterate Quickly**: Ship small. Get feedback. Improve.

**Automate Everything**: Testing, linting, deployment.

**Monitor and Learn**: Track metrics. Analyze errors. Improve.