# Playwright Utils Integration - Implementation Plan

**Status:** ✅ APPROVED - READY TO IMPLEMENT
**Version:** 5.0 FINAL (Aligned)
**Last Review:** 2025-01-20

---

## Quick Reference

**Files:** 20 total (2 installer + 9 knowledge + 6 workflows + 3 docs)
**Timeline:** 25-32 hours over 3 weeks
**Validation:** `npm run validate:schemas && npm run test:schemas`

---

## Overview

Add `@seontechnologies/playwright-utils` integration to TEA with:

- Installation prompt (mirrors tea_use_mcp_enhancements)
- 8 lean fragments (keep bundles light)
- 5 priority workflows + 1 light mention
- Minimal docs (small section in test-architecture.md)

## Final Scope (Approved - Lean First Set)

**11 Complete Fragments** (ALL utilities included):

1. `overview.md` - Installation and design principles
2. `api-request.md` - HTTP client with schema validation
3. `network-recorder.md` - HAR record/playback
4. `auth-session.md` - Token persistence (very involved)
5. `intercept-network-call.md` - Network spy/stub
6. `recurse.md` - Polling patterns
7. `log.md` - Structured logging
8. `file-utils.md` - CSV/XLSX/PDF/ZIP
9. `burn-in.md` - Smart test selection (very important for CI)
10. `network-error-monitor.md` - HTTP error detection
11. `fixtures-composition.md` - mergeTests patterns

**Naming convention:** No `-util` suffix (standardized)
**Total:** 32 fragments in tea-index.csv (21 + 11)

**5 Priority Workflows** + 1 light mention:

1. testarch/automate (CRITICAL)
2. testarch/framework
3. testarch/test-review
4. testarch/ci
5. testarch/atdd
6. testarch/test-design (light mention only)

**Keep minimal:** trace, nfr-assess (no changes for now)

**Key Principles:**

- ✅ Mirror `config.tea_use_mcp_enhancements` pattern
- ✅ Preserve current behavior when flag is false
- ✅ NO package.json auto-detection
- ✅ Lean fragments (150-250 lines each)
- ✅ Minimal doc updates
- ✅ Keep bundles light

---

## Phase 1: Installation Enhancement

### 1.1 Add Installation Prompt

**Files to modify:**

1. `src/modules/bmm/_module-installer/install-config.yaml` - Add prompt (next to `tea_use_mcp_enhancements`)
2. `src/modules/bmm/_module-installer/installer.js` - Wire prompt to config write

**Add prompt to install-config.yaml:**

```yaml
# Add next to existing tea_use_mcp_enhancements prompt
prompts:
  tea_use_mcp_enhancements:
    # ... existing MCP prompt ...

  tea_use_playwright_utils: # New prompt
    type: confirm
    name: usePlaywrightUtils
    message: 'Are you using @seontechnologies/playwright-utils in your project?'
    default: false
```

### 1.2 Wire to Config Write

**In `installer.js`**, ensure CLI writes `use_playwright_utils` into `bmad/bmm/config.yaml`.

**Flag naming (matches tea_use_mcp_enhancements pattern):**

- Prompt key: `usePlaywrightUtils` (camelCase)
- Stored key: `use_playwright_utils` (underscore)
- Workflow reference: `config.use_playwright_utils` (mirrors `config.tea_use_mcp_enhancements`)

**Generated config structure in `bmad/bmm/config.yaml`:**

```yaml
# Test Architect Configuration
test_architect:
  use_playwright_utils: false # Set based on user response
  tea_use_mcp_enhancements: false # Existing MCP flag for reference
```

### 1.3 Verification

**Test the installation flow:**

- Run: `npx bmad-method@alpha install`
- Select BMM module
- Verify prompt appears after MCP prompt
- Answer "Yes" → verify `bmad/bmm/config.yaml` has `use_playwright_utils: true`
- Answer "No" → verify `bmad/bmm/config.yaml` has `use_playwright_utils: false`

---

## Phase 2: Knowledge Base Expansion (10-12 hours)

### 2.1 Create 8 Lean Fragments (Keep Bundles Light)

**Location:** `src/modules/bmm/testarch/knowledge/`

**Target:** 150-250 lines each, action-focused, real examples from playwright-utils docs

| Fragment                    | Lines | Description                                      |
| --------------------------- | ----- | ------------------------------------------------ |
| `overview.md`               | 200   | Installation, design principles, fixture pattern |
| `api-request.md`            | 250   | Typed HTTP client, schema validation, retry      |
| `network-recorder.md`       | 250   | HAR record/playback, stateful CRUD detection     |
| `auth-session.md`           | 250   | Token persistence, multi-user, ephemeral         |
| `intercept-network-call.md` | 200   | Network spy/stub, automatic JSON parsing         |
| `recurse.md`                | 200   | Cypress-style polling, async conditions          |
| `log.md`                    | 150   | Test report integration, structured logging      |
| `fixtures-composition.md`   | 200   | mergeTests composition, integration patterns     |

**Total: ~1,500 lines (lean, focused, light bundle)**

**Add later:** file-utils, burn-in, network-error-monitor

### 2.2 Update TEA Index

**File:** `src/modules/bmm/testarch/tea-index.csv`

**Schema:** `id,name,description,tags,fragment_file` (keep tags short)

**Add 8 rows:**

```csv
overview,Playwright Utils Overview,"Installation, design principles, fixture patterns","playwright-utils,fixtures",knowledge/overview.md
api-request,API Request,"Typed HTTP client, schema validation","api,playwright-utils",knowledge/api-request.md
network-recorder,Network Recorder,"HAR record/playback, CRUD detection","network,playwright-utils",knowledge/network-recorder.md
auth-session,Auth Session,"Token persistence, multi-user","auth,playwright-utils",knowledge/auth-session.md
intercept-network-call,Intercept Network Call,"Network spy/stub, JSON parsing","network,playwright-utils",knowledge/intercept-network-call.md
recurse,Recurse Polling,"Async polling, condition waiting","polling,playwright-utils",knowledge/recurse.md
log,Log Utility,"Report logging, structured output","logging,playwright-utils",knowledge/log.md
fixtures-composition,Fixtures Composition,"mergeTests composition patterns","fixtures,playwright-utils",knowledge/fixtures-composition.md
```

**Result:** 29 total fragments (21 existing + 8 new)

**Validation (run after changes):**

```bash
npm run validate:schemas
npm run test:schemas
```

### 2.3 Fragment Structure Template

Each fragment should follow this structure:

````markdown
# [Utility Name]

## Principle

[Core concept of the utility]

## Rationale

[Why this utility exists, what problems it solves]

## Pattern Examples

### Example 1: [Basic Usage Pattern]

**Context**: [When to use this pattern]

**Implementation**:

```typescript
// Code example from playwright-utils docs
```
````

**Key Points**:

- Point 1
- Point 2

### Example 2: [Advanced Pattern]

**Context**: [When to use this pattern]

**Implementation**:

```typescript
// Code example
```

**Key Points**:

- Point 1
- Point 2

## Integration with Other Utilities

[How this utility works with other playwright-utils]

## Anti-Patterns

[What NOT to do]

## Related Fragments

- `fragment-id-1` - Description
- `fragment-id-2` - Description

````

---

## Phase 3: Workflow Integration (8-10 hours)

### 3.1 Update 5 Priority Workflows + 1 Light Mention

**Preserve current behavior when flag is false**

| Workflow | Integration |
|----------|-------------|
| `testarch/automate` | Generate tests with playwright-utils (CRITICAL) |
| `testarch/framework` | Recommend installation, scaffold fixtures |
| `testarch/test-review` | Review against utility best practices |
| `testarch/ci` | CI workflow updates |
| `testarch/atdd` | ATDD with utility patterns |
| `testarch/test-design` | Light mention only |

**Keep minimal (no changes):** trace, nfr-assess

### 3.2 Workflow Modification Pattern

**Each workflow will follow this pattern:**

```markdown
## Step X: Load Knowledge Base

**Actions:**

1. Check playwright-utils flag from config:
   - Read `{config_source}` and check `config.use_playwright_utils`
   - (Pattern matches existing: `config.tea_use_mcp_enhancements`)

2. Load knowledge fragments based on flag:

   **If `config.use_playwright_utils: true`:**

   Load playwright-utils fragments:
   - overview.md
   - api-request.md
   - network-recorder.md
   - auth-session.md
   - intercept-network-call.md
   - recurse.md
   - log.md
   - fixtures-composition.md

   **If `config.use_playwright_utils: false`:**

   Load traditional pattern fragments (existing behavior preserved)

3. [Continue with existing step content]
````

**Example workflow reference in instructions:**

```markdown
**Critical:** Check configuration flag.

Read `{config_source}` and check `config.use_playwright_utils`.

If true, load playwright-utils fragments. If false, load traditional pattern fragments.

This ensures backward compatibility and preserves existing behavior.
```

### 3.3 Example: `*automate` Workflow Enhancement

**File:** `src/modules/bmm/workflows/testarch/automate/instructions.md`

**Current Step 2 (Load Knowledge Base):**

```markdown
## Step 2: Load Knowledge Base

**Critical:** Consult `{project-root}/{bmad_folder}/bmm/testarch/tea-index.csv` to load:

- `fixture-architecture.md` - Pure function → fixture pattern
- `network-first.md` - Intercept-before-navigate workflow
- `data-factories.md` - Factory functions with overrides
```

**Enhanced Step 2 (With Playwright Utils Check):**

```markdown
## Step 2: Load Knowledge Base

**Critical:** Check configuration and load appropriate fragments.

1. **Read Configuration**
   - Load `{config_source}`
   - Check `test_architect.use_playwright_utils` flag

2. **Load Fragments Based on Configuration**

   **If `use_playwright_utils: true`:**

   Consult `{project-root}/{bmad_folder}/bmm/testarch/tea-index.csv` and load:
   - `playwright-utils-overview.md` - Installation and design principles
   - `api-request-util.md` - Typed HTTP client with schema validation
   - `network-recorder-util.md` - HAR record/playback for offline testing
   - `auth-session-util.md` - Token management and session persistence
   - `recurse-util.md` - Polling patterns for async operations
   - `intercept-network-util.md` - Enhanced network interception
   - `log-util.md` - Playwright report-integrated logging
   - `file-utils-util.md` - File reading and validation
   - `playwright-utils-fixtures.md` - Fixture composition patterns

   **If `use_playwright_utils: false`:**

   Consult `{project-root}/{bmad_folder}/bmm/testarch/tea-index.csv` and load:
   - `fixture-architecture.md` - Pure function → fixture pattern
   - `network-first.md` - Intercept-before-navigate workflow
   - `data-factories.md` - Factory functions with overrides
   - `component-tdd.md` - Component TDD loop
```

### 3.4 Code Generation Enhancement

**In `*automate` workflow, modify test generation instructions:**

````markdown
## Step 4: Generate Test Code

**If `use_playwright_utils: true`:**

Generate tests using playwright-utils utilities:

```typescript
// Import from playwright-utils
import { test } from '@seontechnologies/playwright-utils/fixtures';
// Or merge with your fixtures:
import { test } from '../support/merged-fixtures';

test('should fetch user data', async ({ apiRequest, recurse }) => {
  // Use apiRequest utility
  const { status, body } = await apiRequest<User>({
    method: 'GET',
    path: '/api/users/123',
  });

  expect(status).toBe(200);

  // Use recurse for polling
  await recurse({
    command: () => apiRequest({ method: 'GET', path: `/api/users/${body.id}/status` }),
    predicate: (response) => response.body.ready === true,
    options: { timeout: 30000 },
  });
});
```
````

**If `use_playwright_utils: false`:**

Generate tests using traditional patterns:

```typescript
test('should fetch user data', async ({ request }) => {
  const response = await request.get('/api/users/123');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  // Manual polling
  await expect
    .poll(
      async () => {
        const statusResponse = await request.get(`/api/users/${body.id}/status`);
        const statusBody = await statusResponse.json();
        return statusBody.ready;
      },
      { timeout: 30000 },
    )
    .toBe(true);
});
```

````

---

## Phase 4: Testing & Validation (REVISED - Focused Scope)

### 4.1 Schema & Index Validation (PRIORITY)

**Run after tea-index.csv changes:**

```bash
npm run validate:schemas  # Validate YAML structure, tea-index.csv format
npm run test:schemas      # Ensure agent YAML compiles correctly
````

**Verify:**

- tea-index.csv has correct column headers: `id,name,description,tags,fragment_file`
- All 8 new fragment_file paths exist
- Tags are short (3-4 max per fragment)
- No duplicate IDs

### 4.2 Installation Testing

**Test Cases:**

1. **New Installation - Playwright Utils Selected**
   - Run: `npx bmad-method@alpha install`
   - Select BMM module
   - Answer "Yes" to playwright-utils prompt
   - Verify: `bmad/bmm/config.yaml` has `use_playwright_utils: true`

2. **New Installation - Playwright Utils Not Selected**
   - Run installation
   - Answer "No" to playwright-utils prompt
   - Verify: `bmad/bmm/config.yaml` has `use_playwright_utils: false`

### 4.3 Workflow Testing (5 Priority Workflows)

**Test Cases:**

1. **Automate Workflow - Flag True**
   - Set `use_playwright_utils: true` in config
   - Run `*automate`
   - Verify: Loads playwright-utils fragments (api-request-util, etc.)
   - Verify: Generated code imports from `@seontechnologies/playwright-utils`

2. **Automate Workflow - Flag False**
   - Set `use_playwright_utils: false` in config
   - Run `*automate`
   - Verify: Loads traditional fragments (fixture-architecture, etc.)
   - Verify: Generated code uses vanilla Playwright patterns

3. **Framework/Test-Review/CI/ATDD Workflows**
   - Test with both flag states
   - Verify conditional behavior preserves existing functionality when flag is false

### 4.4 Knowledge Fragment Validation

**Validation per fragment (8 total):**

- [ ] Fragment is 150-300 lines (action-focused, concise)
- [ ] All code examples use working playwright-utils patterns
- [ ] Related fragments cross-referenced
- [ ] Tags accurate in tea-index.csv
- [ ] No bloating of bundle size

---

## Phase 5: Documentation Updates (REVISED - Concise Updates)

### 5.1 Update TEA Documentation

**File:** `src/modules/bmm/docs/test-architecture.md`

**Add small "Playwright Utils Integration" section:**

````markdown
### Playwright Utils Integration

TEA optionally integrates with `@seontechnologies/playwright-utils`.

**Installation:**

```bash
npm install -D @seontechnologies/playwright-utils
```
````

**Enable during BMAD installation** by answering "Yes" when prompted.

**Supported utilities:** api-request, network-recorder, auth-session, intercept-network-call, recurse, log, fixtures-composition.

**Workflows adapt:** automate, framework, test-review, ci, atdd (+ light mention in test-design).

````

**Update knowledge base count:**

```markdown
TEA maintains 29 knowledge fragments (21 core + 8 playwright-utils).
````

### 5.2 Update README (Minimal)

**File:** `README.md`

**Add one line to Test Architect section:**

```markdown
**Test Architect** - Optionally integrates with `@seontechnologies/playwright-utils` for fixture-based utility recommendations.
```

### 5.3 Update CHANGELOG

**File:** `CHANGELOG.md`

```markdown
## [6.1.0] - 2025-XX-XX

### Added

- **Playwright Utils Integration**: TEA supports optional integration with `@seontechnologies/playwright-utils`
  - Installation-time prompt with `use_playwright_utils` configuration flag
  - 8 new concise knowledge fragments (~1,700-2,100 lines total)
  - Adaptive workflow recommendations in 5 priority workflows
  - 29 total knowledge fragments (21 core + 8 playwright-utils)
```

---

## Implementation Checklist (REVISED - Focused Scope)

### Phase 1: Installation Enhancement ✅

- [ ] Locate and update `src/modules/bmm/_module-installer/install-config.yaml`
  - [ ] Add prompt: `usePlaywrightUtils` (camelCase)
- [ ] Wire prompt in `tools/cli/installers/lib/install-steps.js` (or equivalent)
- [ ] Ensure flag writes to `bmad/bmm/config.yaml` as `use_playwright_utils` (underscore)
- [ ] Test installation:
  - [ ] Answer "Yes" → verify `use_playwright_utils: true`
  - [ ] Answer "No" → verify `use_playwright_utils: false`

### Phase 2: Knowledge Base Expansion 📚

- [ ] Create 8 focused knowledge fragments (150-300 lines each):
  - [ ] playwright-utils-overview.md
  - [ ] api-request-util.md
  - [ ] network-recorder-util.md
  - [ ] auth-session-util.md
  - [ ] intercept-network-util.md
  - [ ] recurse-util.md
  - [ ] log-util.md
  - [ ] playwright-utils-fixtures.md
- [ ] Update tea-index.csv with 8 new entries
  - [ ] Verify column headers: `id,name,description,tags,fragment_file`
  - [ ] Keep tags short (3-4 max)
- [ ] Run schema validation:
  - [ ] `npm run validate:schemas`
  - [ ] `npm run test:schemas`

### Phase 3: Workflow Integration 🔄

- [ ] Update 5 priority workflows with flag checks:
  - [ ] `*automate` (CRITICAL - test generation with utilities)
  - [ ] `*framework` (recommend installation, scaffold fixtures)
  - [ ] `*test-review` (check for utility best practices)
  - [ ] `*ci` (mention burn-in/network-error-monitor)
  - [ ] `*atdd` (recommend utility patterns)
- [ ] Implement conditional fragment loading in each workflow
- [ ] Preserve existing behavior when `use_playwright_utils: false`

### Phase 4: Testing & Validation 🧪

- [ ] Schema validation (PRIORITY):
  - [ ] `npm run validate:schemas`
  - [ ] `npm run test:schemas`
  - [ ] Verify tea-index.csv format
- [ ] Installation testing (2 scenarios)
- [ ] Workflow testing (5 workflows × 2 flag states)
- [ ] Fragment validation (8 fragments)
  - [ ] 150-300 lines each
  - [ ] Working code examples
  - [ ] No bundle bloat

### Phase 5: Documentation Updates 📝

- [ ] Update test-architecture.md
  - [ ] Add brief "Playwright Utils Integration" section
  - [ ] Update knowledge base count (29 fragments)
- [ ] Update README.md (one line addition)
- [ ] Update CHANGELOG.md (concise entry)

### Phase 6: Quality Assurance 🎯

- [ ] Run `npm run validate:schemas` (final check)
- [ ] Run `npm run test:schemas` (final check)
- [ ] Test installation end-to-end
- [ ] Test one workflow with both flag states
- [ ] Optional: `npm run bundle` if bundling for web

---

## Success Criteria

### Installation

- ✅ User is prompted about playwright-utils during BMM installation
- ✅ Flag is correctly stored in `bmad/bmm/config.yaml`
- ✅ Installation completes successfully with both "Yes" and "No" responses

### Knowledge Base

- ✅ All 11 new fragments created and indexed
- ✅ tea-index.csv has 32 total entries
- ✅ All code examples are tested and functional
- ✅ Fragments follow consistent template structure

### Workflow Integration

- ✅ All 8 TEA workflows check for playwright-utils flag
- ✅ Workflows load appropriate fragments based on flag
- ✅ Generated code uses playwright-utils when flag is true
- ✅ Generated code uses vanilla Playwright when flag is false

### Documentation

- ✅ test-architecture.md includes playwright-utils integration section
- ✅ README.md references playwright-utils
- ✅ CHANGELOG.md documents changes
- ✅ All documentation is accurate and complete

### Testing

- ✅ All schema validation passes
- ✅ All agent tests pass
- ✅ Installation tests pass
- ✅ Workflow tests pass
- ✅ Bundle generation succeeds

---

## Timeline Estimate (REVISED - Complete Scope)

| Phase                                       | Estimated Time  | Dependencies |
| ------------------------------------------- | --------------- | ------------ |
| Phase 1: Installation                       | 3-4 hours       | None         |
| Phase 2: Knowledge Base (11 fragments)      | 16-20 hours     | Phase 1      |
| Phase 3: Workflow Integration (8 workflows) | 12-16 hours     | Phase 2      |
| Phase 4: Testing & Validation               | 6-8 hours       | Phase 3      |
| Phase 5: Documentation                      | 3-4 hours       | Phase 4      |
| Phase 6: QA                                 | 3-4 hours       | Phase 5      |
| **Total**                                   | **43-56 hours** | Sequential   |

**Recommended approach:**

- Week 1-2: Phases 1-2 (Installation + All 11 fragments)
- Week 3: Phase 3 (All 8 workflows)
- Week 4: Phases 4-6 (Testing, Docs, QA)

---

## Risk Assessment

| Risk                                   | Impact | Likelihood | Mitigation                                    |
| -------------------------------------- | ------ | ---------- | --------------------------------------------- |
| Knowledge fragments too verbose        | Medium | Medium     | Follow existing fragment size patterns        |
| Workflow conditionals add complexity   | Medium | High       | Clear documentation, extensive testing        |
| Breaking changes to existing workflows | High   | Low        | Preserve existing behavior when flag is false |
| Installation prompt not intuitive      | Low    | Medium     | User testing, clear prompt wording            |
| Schema validation failures             | High   | Low        | Validate early and often                      |
| Bundle size increases significantly    | Low    | High       | Monitor bundle sizes, optimize if needed      |

---

## Future Enhancements

### Post-v6.1 Considerations:

1. **Auto-detection**: Automatically detect if `@seontechnologies/playwright-utils` is in package.json
2. **Version compatibility**: Check playwright-utils version and recommend upgrade if needed
3. **Utility-specific knowledge**: Add more granular fragments for specific utility patterns
4. **Interactive examples**: Link to live examples in playwright-utils repo
5. **Migration guide**: Create workflow to help migrate from vanilla Playwright to playwright-utils
6. **Performance metrics**: Track how playwright-utils affects test execution time
7. **Community contributions**: Allow users to contribute playwright-utils patterns

---

## Notes

- This integration maintains backward compatibility - existing installations work unchanged
- The flag is opt-in, preserving TEA's original pattern-based approach
- All code examples in fragments should be tested in the playwright-utils repository
- This enhancement positions BMAD as the premier framework for modern Playwright testing
- Opens door for future integrations with other utility libraries

---

## Questions for Discussion

1. Should we auto-detect playwright-utils in package.json instead of prompting?
2. Should we create a migration workflow for projects moving to playwright-utils?
3. Should we bundle sample fixtures that integrate playwright-utils?
4. Should we create a separate "quick start" guide for playwright-utils + BMAD?
5. Should we add telemetry to track playwright-utils adoption?

---

## Summary of Changes from Initial Plan

**Scope Adjustments (Final):**

1. **Fragment count**: ALL 11 utilities included (non-negotiable)
2. **Fragment size**: 150-300 lines (concise, action-focused)
3. **Total lines**: ~2,250-2,850 lines
4. **Workflow count**: ALL 8 TEA workflows updated (non-negotiable)
5. **Timeline**: 43-56 hours (complete coverage)
6. **tea-index.csv**: 32 total fragments (21 existing + 11 new)
7. **NO package.json auto-detection** (repos may not be TypeScript/Node.js)

**Key Improvements:**

- File locations aligned with actual repo structure
- Consistent kebab-case naming (`use_playwright_utils`)
- Short tags in tea-index.csv (max 3 tags)
- Context-aware fragment loading (UI/API/CI-CD)
- Schema validation prioritized throughout
- Preserve existing behavior when flag is false
- Utility context mapping for smart recommendations

---

**Document Version:** 3.0 (FINAL - Ready for Implementation)
**Created:** 2025-01-20
**Last Updated:** 2025-01-20
**Owner:** Test Architect Enhancement Team

---

## Implementation-Ready Checklist

Before starting implementation, verify these concrete file locations exist:

- [ ] `src/modules/bmm/_module-installer/install-config.yaml` - For adding prompt
- [ ] `src/modules/bmm/_module-installer/installer.js` - For wiring to config write
- [ ] `src/modules/bmm/testarch/tea-index.csv` - Verify columns: `id,name,description,tags,fragment_file`
- [ ] `src/modules/bmm/testarch/knowledge/` - Directory for new fragments
- [ ] `src/modules/bmm/workflows/testarch/automate/instructions.md` - Priority workflow
- [ ] `src/modules/bmm/workflows/testarch/framework/instructions.md` - Priority workflow
- [ ] `src/modules/bmm/workflows/testarch/test-review/instructions.md` - Priority workflow
- [ ] `src/modules/bmm/workflows/testarch/ci/instructions.md` - Priority workflow
- [ ] `src/modules/bmm/workflows/testarch/atdd/instructions.md` - Priority workflow

**Validation commands to run:**

```bash
npm run validate:schemas  # After tea-index.csv changes
npm run test:schemas      # After agent YAML changes
```
