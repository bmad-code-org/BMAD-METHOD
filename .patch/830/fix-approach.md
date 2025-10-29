# PR-830 Fix Approach: Markdown Conformance

## Overview

Successfully implemented automated detection and fixing of markdown conformance issues for PR #830, focusing on fence language identifiers and spacing rules.

## Detection Strategy

### 1. Custom Conformance Checker

**Tool:** `tools/markdown/check-md-conformance.js`

**Rules Enforced:**
- Blank lines before/after lists, tables, and code fences
- Bullet marker normalization to `-`
- Code fence language identifiers (e.g., ` ```bash`)

**Approach:**
- Two-pass parsing: fence detection → rule validation
- Tracks excluded regions (inside fences) to avoid false positives
- Reports violations with line numbers and violation types
- Exit code 0 for pass, 1 for violations

### 2. Prior Work Review

**Investigated:** `.patch/483` markdown formatting work
- Found existing `markdown-formatter.js` with line ending normalization
- Focused on PR-483: CRLF/whitespace issues on Windows
- Decided to create focused fence-language fixer rather than adapt the full formatter

**Key Insight:** Fence language detection was missing from the 483 work; our approach fills that gap.

## Dry-Run Process

### 1. Fix Script Development

**Tool:** `tools/markdown/fix-fence-languages.js`

**Features:**
- `--dry-run` mode: reports proposed fixes without modifying files
- Content-based language detection heuristics:
  - `yaml`: key-value pairs, YAML frontmatter
  - `json`: valid JSON objects/arrays
  - `bash`: shell commands, prompts ($)
  - `javascript`: import/export, code keywords
  - `xml`: tag syntax
  - `markdown`: headings, links
  - `text`: directory trees, diagrams, unknown content

**Dry-Run Examples:**

```bash
node tools/markdown/fix-fence-languages.js --dry-run docs/bmad-brownfield-guide.md
# Output saved to: .patch/830/test-logs/brownfield-dry-run.txt

node tools/markdown/fix-fence-languages.js --dry-run docs/conversion-report-shard-doc-2025-10-26.md
# Output saved to: .patch/830/test-logs/conversion-dry-run.txt
```

### 2. Validation Workflow

1. Run dry-run on target files
2. Review proposed language assignments
3. Verify content preview matches expected language
4. Save dry-run output for audit trail
5. Apply fixes only after manual review

## Fix Application

### Baseline Results

**Initial State (docs/):**
- 219 violations in 21 files
- Primary issues: missing fence languages, missing blank lines before lists

**Files Fixed:**
1. `docs/bmad-brownfield-guide.md` - 8 fences (6 reported + 2 found)
2. `docs/conversion-report-shard-doc-2025-10-26.md` - 2 fences
3. `docs/installers-bundlers/ide-injections.md` - 5 fences
4. `docs/installers-bundlers/installers-modules-platforms-reference.md` - 7 fences + 1 spacing
5. `docs/installers-bundlers/web-bundler-usage.md` - 2 fences
6. `docs/v4-to-v6-upgrade.md` - 4 fences

**Total Fences Fixed:** 28

### Manual Corrections

**Script Bug Identified:**
The initial fix script incorrectly added language identifiers to closing fences (` ``` `) instead of only opening fences.

**Manual Fixes Applied:**
- Removed incorrect ````markdown` and ````text` from closing fences
- Added correct language identifiers to opening fences that were missed
- Fixed spacing issue: added blank line after list item before code fence

### Final Results

**After Fixes (docs/):**
- 0 violations
- All fence languages specified
- All spacing rules compliant

**Test Command:**
```bash
npm run check:md:docs
# MD Conformance: PASS (no violations)
```

## Test Results

### Test Logs Archive

All test outputs saved under `.patch/830/test-logs/`:

1. `docs-baseline.txt` - Initial scan: 219 violations / 21 files
2. `bmad-baseline.txt` - Initial scan: 1094 violations / 59 files
3. `src-baseline.txt` - Initial scan: 4729 violations / 239 files
4. `brownfield-dry-run.txt` - Dry-run proposal for brownfield guide
5. `conversion-dry-run.txt` - Dry-run proposal for conversion report
6. `docs-after-fixes.txt` - Final verification: 0 violations (PASS)

### Test Evidence

**Before:**
```
MD Conformance: FAIL (219 violation(s) in 21 file(s))
- docs\bmad-brownfield-guide.md
  L  83  fence-language-missing
  L 446  fence-language-missing
  ...
```

**After:**
```
MD Conformance: PASS (no violations)
```

## CI Integration

### NPM Scripts Added

**package.json updates:**

```json
{
  "scripts": {
    "check:md:all": "node tools/markdown/check-md-conformance.js docs bmad src",
    "check:md:docs": "node tools/markdown/check-md-conformance.js docs",
    "check:md:bmad": "node tools/markdown/check-md-conformance.js bmad",
    "check:md:src": "node tools/markdown/check-md-conformance.js src",
    "lint:md": "markdownlint --config .patch/830/.markdownlint.json --rules .patch/830/markdownlint-rules/table-blank-lines.js docs bmad src"
  }
}
```

### GitHub Actions Workflow

**Created:** `.github/workflows/markdown-conformance.yml`

**Triggers:**
- Pull requests to `main` or `v6-alpha`
- Only when `.md` files or tools/markdown/** changed

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run conformance checks (`npm run check:md:all`) - **Required**
5. Run markdownlint (`npm run lint:md`) - Optional (continue-on-error)

**Benefits:**
- Prevents regressions in markdown formatting
- Catches issues before merge
- Enforces PR-830 rules automatically

## Lessons Learned

### 1. Incremental Validation

**Approach:** Fix subset → validate → iterate
- Started with `docs/ide-info/*` (11 files)
- Expanded to all docs (21 files)
- Saved bmad/src for future remediation

**Benefit:** Caught script bugs early on small subset

### 2. Dry-Run Critical for Safety

**Why:**
- Content-based language detection is heuristic, not perfect
- Manual review prevents incorrect auto-fixes
- Audit trail shows exactly what changed

**Evidence:** Dry-run logs saved for every batch

### 3. Script Limitations Require Manual Review

**Issues Found:**
- Script added language to closing fences (bug)
- Nested or complex fence structures needed manual intervention
- Directory trees best detected as `text` but sometimes appeared as `markdown`

**Solution:** Dry-run + manual verification before applying fixes

### 4. Prior Patch Review Saves Time

**Value:**
- `.patch/483` provided markdown-formatter foundation
- Understanding prior art prevented duplicate work
- Identified gaps (fence language) not addressed previously

## Remaining Work

### Docs (Priority: High)
- ✅ All docs violations resolved (0 violations)

### Bmad (Priority: Medium)
- 1094 violations in 59 files
- Primarily: missing blank lines before lists, missing fence languages
- Recommend: same dry-run approach, fix in batches

### Src (Priority: Low)
- 4729 violations in 239 files
- Mix of generated and authored content
- Recommend: audit generators first, then remediate authored content

## Conclusion

**Success Metrics:**
- ✅ Docs conformance: 219 violations → 0 violations
- ✅ Automated detection and fixing tools created
- ✅ CI integration to prevent regressions
- ✅ Dry-run workflow validated and documented
- ✅ Test evidence archived under `.patch/830/`

**Next Steps:**
1. Apply same approach to `bmad/` directory
2. Audit generators (e.g., `tools/format-workflow-md.js`) for compliance
3. Update authoring guidelines in `CONTRIBUTING.md`
4. Optional: enhance fix script to handle nested fences correctly
