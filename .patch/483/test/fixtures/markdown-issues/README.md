# Test Fixtures for Markdown Generation Issues

This directory contains test fixtures that simulate the markdown generation problems described in GitHub issue #483.

## Fixture Structure

### Current Problematic Output Examples

These files demonstrate the exact formatting issues that occur in the current system:

1. **story-with-crlf-issues.md** - Simulates Windows CRLF line ending problems
2. **story-with-spacing-issues.md** - Shows inconsistent whitespace around headings and sections
3. **story-with-qa-section-issue.md** - Reproduces the exact QA Results section problem from the GitHub issue

### Expected Correct Output Examples

These files show what the properly formatted output should look like:

1. **story-correctly-formatted.md** - Clean LF line endings, consistent spacing
2. **story-gfm-compliant.md** - Full GFM compliance with proper heading hierarchy

### Test Generation Scripts

- **generate-fixtures.js** - Script that creates problematic markdown using current template system
- **validate-fixtures.js** - Script that runs detection tests on fixtures

## Usage

Run `node test/fixtures/generate-fixtures.js` to create sample problematic output.
Run `node test/fixtures/validate-fixtures.js` to test current fixtures against detection rules.
