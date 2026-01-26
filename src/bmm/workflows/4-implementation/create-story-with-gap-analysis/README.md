# Create Story With Gap Analysis

**Custom Workflow by Jonah Schulte**
**Created:** December 24, 2025
**Purpose:** Generate stories with SYSTEMATIC codebase gap analysis (not inference-based)

---

## Problem This Solves

**Standard `/create-story` workflow:**
- ❌ Reads previous stories and git commits (passive)
- ❌ Infers what probably exists (guessing)
- ❌ Gap analysis quality varies by agent thoroughness
- ❌ Checkboxes may not reflect reality

**This custom workflow:**
- ✅ Actively scans codebase with Glob/Read tools
- ✅ Verifies file existence (not inference)
- ✅ Reads key files to check implementation depth (mocked vs real)
- ✅ Generates TRUTHFUL gap analysis
- ✅ Checkboxes are FACTS verified by file system

---

## Usage

```bash
/create-story-with-gap-analysis

# Or via Skill tool:
Skill: "create-story-with-gap-analysis"
Args: "1.9" (epic.story number)
```

**Workflow will:**
1. Load existing story + epic context
2. **SCAN codebase systematically** (Glob for files, Read to verify implementation)
3. Generate gap analysis with verified ✅/❌/⚠️ status
4. Update story file with truthful checkboxes
5. Save to _bmad-output/implementation-artifacts/

---

## What It Scans

**For each story, the workflow:**

1. **Identifies target directories** (from story title/requirements)
   - Example: "admin-user-service" → apps/backend/admin-user-service/

2. **Globs for all files**
   - `{target}/src/**/*.ts` - Find all TypeScript files
   - `{target}/src/**/*.spec.ts` - Find all tests

3. **Checks specific required files**
   - Based on ACs, check if files exist
   - Example: `src/auth/controllers/bridgeid-auth.controller.ts` → ❌ MISSING

4. **Reads key files to verify depth**
   - Check if mocked: Search for "MOCK" string
   - Check if incomplete: Search for "TODO"
   - Verify real implementation exists

5. **Checks package.json**
   - Verify required dependencies are installed
   - Identify missing packages

6. **Counts tests**
   - How many test files exist
   - Coverage for each component

---

## Output Format

**Generates story with:**

1. ✅ Standard BMAD 5 sections (Story, AC, Tasks, Dev Notes, Dev Agent Record)
2. ✅ Enhanced Dev Notes with verified gap analysis subsections:
   - Gap Analysis: Current State vs Requirements
   - Library/Framework Requirements (from package.json)
   - File Structure Requirements (from Glob results)
   - Testing Requirements (from test file count)
   - Architecture Compliance
   - Previous Story Intelligence

3. ✅ Truthful checkboxes based on verified file existence

---

## Difference from Standard /create-story

| Feature | /create-story | /create-story-with-gap-analysis |
|---------|---------------|--------------------------------|
| Reads previous story | ✅ | ✅ |
| Reads git commits | ✅ | ✅ |
| Loads epic context | ✅ | ✅ |
| **Scans codebase with Glob** | ❌ | ✅ SYSTEMATIC |
| **Verifies files exist** | ❌ | ✅ VERIFIED |
| **Reads files to check depth** | ❌ | ✅ MOCKED vs REAL |
| **Checks package.json** | ❌ | ✅ DEPENDENCIES |
| **Counts test coverage** | ❌ | ✅ COVERAGE |
| Gap analysis quality | Variable (agent-dependent) | Systematic (tool-verified) |
| Checkbox accuracy | Inference-based | File-existence-based |

---

## When to Use

**This workflow (planning-time gap analysis):**
- Use when regenerating/auditing stories
- Use when you want verified checkboxes upfront
- Best for stories that will be implemented immediately
- Manual verification at planning time

**Standard /create-story + /dev-story (dev-time gap analysis):**
- Recommended for most workflows
- Stories start as DRAFT, validated when dev begins
- Prevents staleness in batch planning
- Automatic verification at development time

**Use standard /create-story when:**
- Greenfield project (nothing exists yet)
- Backlog stories (won't be implemented for months)
- Epic planning phase (just sketching ideas)

**Tip:** Both approaches are complementary. You can use this workflow to regenerate stories, then use `/dev-story` which will re-validate at dev-time.

---

## Examples

**Regenerating Story 1.9:**
```bash
/create-story-with-gap-analysis

Choice: 1.9

# Workflow will:
# 1. Load existing 1-9-admin-user-service-bridgeid-rbac.md
# 2. Identify target: apps/backend/admin-user-service/
# 3. Glob: apps/backend/admin-user-service/src/**/*.ts (finds 47 files)
# 4. Check: src/auth/controllers/bridgeid-auth.controller.ts → ❌ MISSING
# 5. Read: src/bridgeid/services/bridgeid-client.service.ts → ⚠️ MOCKED
# 6. Read: package.json → axios ❌ NOT INSTALLED
# 7. Generate gap analysis with verified status
# 8. Write story with truthful checkboxes
```

**Result:** Story with verified gap analysis showing:
- ✅ 7 components IMPLEMENTED (verified file existence)
- ❌ 6 components MISSING (verified file not found)
- ⚠️ 1 component PARTIAL (file exists but contains "MOCK")

---

## Installation

This workflow is auto-discovered when BMAD is installed.

**To use:**
```bash
/bmad:bmm:workflows:create-story-with-gap-analysis
```

---

**Last Updated:** December 27, 2025
**Status:** Integrated into BMAD-METHOD
