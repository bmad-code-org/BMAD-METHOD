---
title: BMAD Patterns
description: Reusable quality and process patterns for BMAD workflows
---

# BMAD Patterns

This directory contains reusable patterns that can be referenced in workflows and agent prompts using `@patterns/{filename}` syntax.

## Purpose

**Problem:** Common quality standards and practices were duplicated across multiple workflows (1,253 lines of repeated instructions).

**Solution:** Extract common patterns into reusable files that can be referenced with `@patterns/` imports.

## Benefits

- ✅ **DRY:** Single source of truth for common patterns
- ✅ **Consistency:** All workflows use same quality standards
- ✅ **Maintainability:** Update pattern once, affects all workflows
- ✅ **Clarity:** Shorter workflows (focused on workflow-specific logic)

## Available Patterns

### Quality Standards

**[hospital-grade.md](hospital-grade.md)**
- Production-ready quality standards
- Quality checklist (code, testing, security, performance)
- Hospital-grade mindset: "Would I trust this code with my family's life?"

**Use when:** Any code implementation (ensures production-grade quality)

### Development Practices

**[tdd.md](tdd.md)**
- Test-Driven Development (Red → Green → Refactor)
- TDD cycle and best practices
- Test quality standards
- Coverage targets (90%+ minimum)

**Use when:** Building new features (write tests first)

### Agent Contracts

**[agent-completion.md](agent-completion.md)**
- Completion artifact contract
- JSON artifact formats by agent type
- Verification and reconciliation patterns

**Use when:** Multi-agent workflows (ensures reliable agent coordination)

**[verification.md](verification.md)**
- Independent verification pattern
- Fresh context principle
- Evidence-based verification checklist

**Use when:** Validation phase (Inspector agent)

### Security

**[security-checklist.md](security-checklist.md)**
- Common security vulnerabilities
- CRITICAL/HIGH/MEDIUM security issues
- Security review process
- Code examples (bad vs good)

**Use when:** Code review phase (Reviewer agent)

## How to Use

### In Workflow Files

Reference patterns in the `<execution_context>` section:

```markdown
<execution_context>
@patterns/hospital-grade.md
@patterns/tdd.md
@patterns/agent-completion.md
</execution_context>
```

### In Agent Prompts

Reference patterns at the top of agent prompt files:

```markdown
<execution_context>
@patterns/hospital-grade.md
@patterns/tdd.md
@patterns/agent-completion.md
</execution_context>
```

### What Happens

When a workflow runs:
1. BMAD installation process resolves `@patterns/` references
2. Pattern content is inlined into the workflow
3. Agent receives full pattern content in prompt

## Pattern Design Guidelines

### Good Pattern Characteristics

- ✅ **Reusable:** Applies to multiple workflows
- ✅ **Focused:** One clear topic
- ✅ **Actionable:** Includes specific steps/checklists
- ✅ **Complete:** No external dependencies
- ✅ **Examples:** Shows good and bad examples

### What Belongs in Patterns

- ✅ Quality standards (hospital-grade)
- ✅ Development practices (TDD, verification)
- ✅ Security checklists
- ✅ Agent contracts (completion artifacts)
- ✅ Common checklists

### What Doesn't Belong in Patterns

- ❌ Workflow-specific logic
- ❌ Project-specific code
- ❌ Environment setup steps
- ❌ Tool configuration

## Adding New Patterns

### When to Create a Pattern

Create a new pattern when:
1. Same content duplicated across 3+ workflows
2. Represents a reusable best practice
3. Can be used independently
4. Improves workflow clarity by extraction

### Steps to Add Pattern

1. **Create pattern file:**
   ```bash
   touch src/modules/bmm/patterns/{pattern-name}.md
   ```

2. **Write pattern content:**
   - Clear title and purpose
   - Actionable steps/checklist
   - Examples (good vs bad)
   - Anti-patterns to avoid

3. **Reference in workflows:**
   ```markdown
   <execution_context>
   @patterns/{pattern-name}.md
   </execution_context>
   ```

4. **Test pattern:**
   - Run workflow using pattern
   - Verify pattern is properly resolved
   - Verify agent understands pattern

5. **Document pattern:**
   - Add to this README
   - Update workflow documentation

## Pattern Maintenance

### Updating Patterns

When updating a pattern:
1. Update pattern file
2. Test with all workflows that use it
3. Update version numbers if breaking change
4. Document changes in commit message

### Deprecating Patterns

To deprecate a pattern:
1. Mark as deprecated in README
2. Add deprecation notice to pattern file
3. Provide migration path
4. Remove after all workflows migrated

## Examples

### Example 1: Hospital-Grade in Builder Agent

```markdown
# Builder Agent - Implementation Phase

<execution_context>
@patterns/hospital-grade.md
@patterns/tdd.md
@patterns/agent-completion.md
</execution_context>

Your job is to implement the story requirements...
```

Agent receives:
- Hospital-grade quality standards
- TDD best practices
- Completion artifact contract

### Example 2: Security Review in Reviewer Agent

```markdown
# Reviewer Agent - Adversarial Code Review

<execution_context>
@patterns/security-checklist.md
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

Your job is to find problems...
```

Agent receives:
- Security vulnerability checklist
- Quality standards
- Completion artifact contract

## Benefits in Practice

**Before patterns (duplicated content):**
- Builder agent: 1,253 lines (includes quality standards)
- Inspector agent: 1,189 lines (includes quality standards)
- Reviewer agent: 1,305 lines (includes quality standards + security)
- Fixer agent: 1,201 lines (includes quality standards)

**After patterns (extracted):**
- Builder agent: 142 lines + patterns
- Inspector agent: 191 lines + patterns
- Reviewer agent: 230 lines + patterns
- Fixer agent: 216 lines + patterns
- Patterns: 5 files (~2,000 lines total, reused across all)

**Net result:** ~2,900 lines removed through pattern extraction.

## See Also

- [Agent Completion Artifacts](../../docs/sprint-artifacts/completions/README.md)
- [GSD-Style Guardrails](../../docs/implementation-notes/gsd-style-guardrails-phase1.md)
- [Workflow Map](../../docs/workflow-map.md)
