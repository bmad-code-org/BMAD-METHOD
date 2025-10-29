# PR #826 Syntax & Convention Analysis

Date: 2025-10-28  
File: `high-level-product-plan.md`

---

## Summary

**Verdict**: ⚠️ The document has **placement issues** but **syntax is valid**.

The file follows standard Markdown syntax and would pass basic validation, but it doesn't follow BMAD-METHOD conventions for documentation organization or integrate with the BMAD framework.

---

## Syntax Validation

### ✅ Markdown Format

- **Valid Markdown**: Standard ATX headings, bullet lists, bold formatting
- **Prettier Compatible**: Will pass `npm run format:check` (standard Markdown)
- **No Special BMAD Syntax Required**: Unlike agents (`.agent.yaml`) or workflows (`workflow.yaml`), regular docs just need valid Markdown

### ✅ Content Structure

- Logical 8-section hierarchy
- Consistent formatting (headings, lists, bold)
- No broken links or invalid syntax
- Readable and well-organized

---

## BMAD Convention Issues

### ❌ Placement Violation

**Problem**: File is placed at repository root (`/high-level-product-plan.md`)

**BMAD Repository Root Convention**:
Based on current structure, root-level `.md` files are limited to:

- `README.md` - Project overview and quick start
- `CHANGELOG.md` - Version history
- `CONTRIBUTING.md` - Contribution guidelines
- `v6-open-items.md` - Development tracking (temporary/internal)

**Root directory observations**:

```
bmad-v6/
├── README.md           ← Entry point
├── CHANGELOG.md        ← Version history
├── CONTRIBUTING.md     ← How to contribute
├── v6-open-items.md    ← Internal dev notes
├── PRD.md              ← DOES NOT EXIST (workflows generate this in project dirs)
├── LICENSE
├── package.json
├── docs/               ← Documentation home
├── bmad/               ← Method assets
├── src/                ← Source code
└── tools/              ← CLI and utilities
```

### ❌ Documentation Organization

**Expected location**: `docs/planning/` or `docs/guides/`

**Evidence from codebase**:

- `docs/` directory exists for documentation
- `docs/ide-info/` - IDE-specific guides
- `docs/installers-bundlers/` - Technical guides
- Pattern suggests: `docs/{category}/{topic}.md`

### ❌ No BMAD Integration

**Issue**: Content is 100% generic, no BMAD-specific elements

**Missing BMAD integration opportunities**:

1. **No references to BMAD workflows**
   - Should reference `prd` workflow for PRD creation
   - Should reference `tech-spec` workflow for technical planning
   - Should reference `architect` agent for architecture decisions

2. **No CLI commands**
   - Could show `bmad architect` for architecture planning
   - Could show `bmad pm` for product planning
   - Could show workflow triggers

3. **No BMAD terminology**
   - Doesn't mention agents, modules, or workflows
   - Doesn't align with BMM (BMAD Method for Managing) concepts
   - Generic "Agile/Scrum/Kanban" instead of BMAD's leveled approach

**From commit message**:

> "Structure content to align with BMad Method PRD and Architecture templates"

**Reality**: Content does NOT actually align with BMAD templates or reference them.

---

## Comparison with BMAD Documentation Patterns

### BMAD Workflow Documentation Pattern

**Example**: `src/modules/bmm/workflows/2-plan-workflows/README.md`

- Describes workflow purpose and BMAD context
- Shows CLI invocation (`*prd`, `bmad pm`)
- References agents and other workflows
- Includes BMAD-specific levels and phases

### This PR's Document

- Generic planning checklist
- No CLI integration
- No agent references
- No workflow context
- Could apply to any software project

---

## Issues Detected

| Issue                       | Severity | Description                                 |
| --------------------------- | -------- | ------------------------------------------- |
| **Root placement**          | High     | Violates repository organization convention |
| **No BMAD integration**     | Medium   | Generic content doesn't leverage BMAD       |
| **Filename genericity**     | Low      | `high-level-product-plan.md` is vague       |
| **Missing categorization**  | Medium   | Unclear if reference, guide, or template    |
| **Commit message mismatch** | Medium   | Claims BMAD alignment but doesn't deliver   |

---

## Recommendations

### Option 1: Relocate with BMAD Enhancement (Recommended)

**Action**: Move to `docs/planning/product-planning-checklist.md`

**Enhancements to add**:

```markdown
## Using BMAD for Product Planning

This checklist can be completed using BMAD workflows:

- **Product Requirements**: Use `bmad pm` → `*prd` workflow
- **Architecture Planning**: Use `bmad architect` → `*architecture` workflow
- **Technical Specifications**: Use `bmad architect` → `*tech-spec` workflow

For detailed planning, see:

- [BMM Planning Workflows](../src/modules/bmm/workflows/2-plan-workflows/README.md)
- [Architecture Workflows](../src/modules/bmm/workflows/3-architecture/README.md)
```

### Option 2: Keep Generic, Relocate

**Action**: Move to `docs/references/product-planning-considerations.md`

**Add disclaimer**:

```markdown
> **Note**: This is a general reference guide. For BMAD-specific planning,
> see the [BMM Module documentation](../src/modules/bmm/README.md).
```

### Option 3: Request Rewrite as BMAD Guide

**Action**: Ask contributor to transform into BMAD-specific guide

**Example structure**:

```markdown
# Product Planning with BMAD

## 1. Initial Planning (Level 0-1)

Use `bmad pm` agent with `*brief` workflow...

## 2. Requirements (Level 2-4)

Use `bmad pm` agent with `*prd` workflow...

## 3. Architecture Planning

Use `bmad architect` agent...
```

---

## Testing Plan

If we accept with relocation:

1. **Lint check**:

   ```bash
   npm run format:check -- "docs/planning/product-planning-checklist.md"
   ```

2. **Link validation**: Ensure any added BMAD references are valid paths

3. **Documentation index**: Update `docs/README.md` if it exists

4. **Consistency check**: Verify filename follows kebab-case pattern

---

## Conclusion

**Syntax**: ✅ Valid Markdown, no formatting issues  
**BMAD Convention**: ❌ Violates placement, lacks integration  
**Fix Complexity**: Low (simple file move + optional enhancements)  
**Recommended Action**: Request relocation to `docs/planning/` with optional BMAD integration suggestions
