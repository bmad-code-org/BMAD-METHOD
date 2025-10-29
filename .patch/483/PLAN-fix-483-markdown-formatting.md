# Fix Plan for Issue #483: Generated Markdown Formatting Issues

## Overview

This plan addresses the GitHub issue #483 regarding inconsistent markdown generation that causes CRLF/whitespace issues on Windows, breaking automated editing tools that rely on exact string matches.

## Problem Analysis

### Root Causes Identified

1. **Line Ending Inconsistency**: Generated markdown files use CRLF on Windows instead of normalized LF
2. **Non-deterministic Whitespace**: Inconsistent blank lines and spacing around headings/sections
3. **Non-standard Formatting**: Deviations from CommonMark/GFM conventions
4. **Template Issues**: Story templates may not enforce consistent formatting

### Current State Assessment

- ✅ Prettier is already configured (`prettier.config.mjs`)
- ✅ ESLint is configured for code quality
- ✅ Basic formatting scripts exist (`format:check`, `format:fix`)
- ❌ No `.editorconfig` file exists
- ❌ No remark/remark-lint configuration
- ❌ Markdown generation doesn't normalize line endings
- ❌ Templates don't enforce consistent spacing

## Implementation Strategy

### Phase 1: Detection and Analysis (Todo Items 1-3)

**Goal**: Understand the current problem scope and create tests to detect issues

#### 1.1 Analyze Current Markdown Generation

- **Files to examine**:
  - `src/modules/bmm/workflows/4-implementation/create-story/template.md`
  - Template processing logic in workflow instructions
  - File writing utilities and output formatting code
- **What to look for**:
  - How templates are processed and variables substituted
  - Where line endings are set during file writing
  - How spacing and formatting is controlled

#### 1.2 Create Detection Tests

- **Test categories needed**:
  - Line ending detection (CRLF vs LF)
  - Whitespace consistency checks
  - Heading hierarchy validation
  - GFM compliance testing
- **Test location**: `test/markdown-formatting-tests.js`

#### 1.3 Create Test Fixtures

- Generate sample story files using current system
- Capture problematic output for comparison
- Create "golden" examples of correct formatting

### Phase 2: Foundation Setup (Todo Items 4, 6-7, 12)

**Goal**: Establish tooling and configuration for consistent markdown formatting

#### 2.1 Add .editorconfig File

```ini
# Example content
root = true

[*]
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
charset = utf-8

[*.md]
trim_trailing_whitespace = false
max_line_length = off

[*.{yaml,yml}]
indent_style = space
indent_size = 2
```

#### 2.2 Add Remark Linting

- **Dependencies to add**:
  - `remark`
  - `remark-lint`
  - `remark-preset-lint-consistent`
  - `remark-preset-lint-recommended`
- **Configuration file**: `.remarkrc.js` or `.remarkrc.json`

#### 2.3 Update Prettier Config

- Ensure markdown-specific settings are optimized
- Consider `proseWrap: "always"` vs current `"preserve"`
- Verify `endOfLine: 'lf'` is enforced for markdown

#### 2.4 Update NPM Scripts

```json
{
  "scripts": {
    "lint:md": "remark . --quiet --frail",
    "lint:md:fix": "remark . --output",
    "lint": "eslint . --ext .js,.cjs,.mjs,.yaml --max-warnings=0 && npm run lint:md"
  }
}
```

### Phase 3: Core Fix Implementation (Todo Items 5, 8-9)

**Goal**: Implement the actual formatting fixes

#### 3.1 Create Markdown Formatting Utility

**Location**: `src/utility/markdown-formatter.js`
**Functions needed**:

- `normalizeLineEndings(content)` - Force LF endings
- `normalizeSpacing(content)` - Consistent blank lines around sections
- `validateGFMCompliance(content)` - Check for GFM standards
- `formatMarkdownOutput(content)` - Main formatter function

#### 3.2 Update Template Processing

- Identify where templates are processed into final markdown
- Integrate the markdown formatter into the output pipeline
- Ensure all generated markdown goes through normalization

#### 3.3 Update Story Template

**File**: `src/modules/bmm/workflows/4-implementation/create-story/template.md`
**Changes needed**:

- Consistent spacing around sections (one blank line)
- Proper heading hierarchy
- Standardized bullet point formatting
- Remove any potential smart quotes or special characters

### Phase 4: Testing and Validation (Todo Items 10-11, 13)

**Goal**: Ensure the fixes work correctly across platforms

#### 4.1 Snapshot Testing

- Create tests that generate markdown and compare to snapshots
- Test on both Windows and Unix-like systems
- Validate that output is identical across platforms

#### 4.2 Windows-Specific Testing

- Test on Windows environment specifically
- Verify CRLF issues are resolved
- Confirm automated editing tools work correctly

#### 4.3 Integration Testing

- Test the exact scenario from the issue (automated edits)
- Verify string replacement tools can find exact matches
- Test with tools like `remark` and static site generators

### Phase 5: Final Validation (Todo Item 14)

**Goal**: Complete the solution and document changes

#### 5.1 Comprehensive Testing

- Run full test suite
- Validate no regressions in existing functionality
- Ensure all markdown files are properly formatted

#### 5.2 Documentation

- Update README if needed
- Document the formatting standards adopted
- Create guidelines for future template creation

## Files to Modify

### New Files

- `.editorconfig` - Editor configuration for consistent formatting
- `.remarkrc.js` - Remark configuration for markdown linting
- `src/utility/markdown-formatter.js` - Markdown formatting utility
- `test/markdown-formatting-tests.js` - Tests for markdown formatting

### Modified Files

- `package.json` - Add remark dependencies and scripts
- `prettier.config.mjs` - Potentially adjust markdown settings
- `src/modules/bmm/workflows/4-implementation/create-story/template.md` - Update template formatting
- Workflow instruction files that process templates - Add formatting normalization
- Template processing utilities - Integrate markdown formatter

## Success Criteria

### Technical Requirements

1. ✅ All generated markdown uses LF line endings consistently
2. ✅ Consistent blank line spacing around headings and sections
3. ✅ GFM-compliant formatting (proper heading hierarchy, code blocks, etc.)
4. ✅ No trailing whitespace except where needed
5. ✅ Deterministic output (same input always produces identical output)

### Functional Requirements

1. ✅ Automated editing tools can successfully find and replace exact strings
2. ✅ Generated markdown renders correctly on GitHub and static site generators
3. ✅ No breaking changes to existing story files or workflows
4. ✅ Cross-platform consistency (Windows, macOS, Linux)

### Quality Requirements

1. ✅ All tests pass
2. ✅ No linting errors
3. ✅ Snapshot tests validate consistent output
4. ✅ No performance regression in markdown generation

## Risk Mitigation

### Potential Issues

1. **Breaking Changes**: Template changes might affect existing workflows
   - _Mitigation_: Thorough testing and backward compatibility checks
2. **Performance Impact**: Additional formatting may slow generation
   - _Mitigation_: Optimize formatter and measure performance impact
3. **Platform Differences**: Different behavior on Windows vs Unix
   - _Mitigation_: Cross-platform testing and explicit line ending handling

### Rollback Plan

- Keep original templates as `.backup` files
- Implement feature flags for new formatting
- Maintain backward compatibility until full validation

## Timeline Estimate

- **Phase 1**: 1-2 days (Analysis and detection)
- **Phase 2**: 1 day (Configuration setup)
- **Phase 3**: 2-3 days (Core implementation)
- **Phase 4**: 2 days (Testing and validation)
- **Phase 5**: 1 day (Final validation and documentation)

**Total**: 7-9 days estimated effort

## Next Steps

1. Start with Todo Item 1: Analyze current markdown generation
2. Create detection tests to understand the scope of the problem
3. Set up foundation tooling and configuration
4. Implement the core fixes with proper testing
5. Validate across platforms and use cases
