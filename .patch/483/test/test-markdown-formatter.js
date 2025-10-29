/**
 * Test the markdown formatter utility with our generated fixtures
 */

const { MarkdownFormatter, formatMarkdown, validateMarkdown } = require('../src/utility/markdown-formatter');
const fs = require('fs-extra');
const path = require('node:path');

async function testMarkdownFormatter() {
  console.log('🧪 Testing Markdown Formatter Utility\n');

  const fixturesDir = path.join(__dirname, 'fixtures', 'markdown-issues');
  const formatter = new MarkdownFormatter({
    forceLineEnding: 'lf',
    normalizeQuotes: true,
    normalizeEllipsis: true,
    normalizeEmDash: true,
    requireLanguageInCodeBlocks: true,
    enforceHeadingHierarchy: true,
  });

  // Test with CRLF fixture
  console.log('📄 Testing CRLF line ending fix...');
  const crlfPath = path.join(fixturesDir, 'proper-crlf-test.md');

  if (await fs.pathExists(crlfPath)) {
    const crlfContent = await fs.readFile(crlfPath, 'utf8');

    console.log('Before formatting:');
    console.log(`  - Contains CRLF: ${crlfContent.includes('\r\n')}`);
    console.log(`  - Length: ${crlfContent.length} chars`);

    const formattedCRLF = formatter.format(crlfContent);

    console.log('After formatting:');
    console.log(`  - Contains CRLF: ${formattedCRLF.includes('\r\n')}`);
    console.log(`  - Contains LF: ${formattedCRLF.includes('\n')}`);
    console.log(`  - Length: ${formattedCRLF.length} chars`);

    // Save formatted version
    await fs.writeFile(path.join(fixturesDir, 'formatted-crlf-fixed.md'), formattedCRLF, 'utf8');
    console.log('  ✅ Formatted version saved as formatted-crlf-fixed.md\n');
  }

  // Test with spacing issues fixture
  console.log('📄 Testing spacing issues fix...');
  const spacingPath = path.join(fixturesDir, 'story-with-spacing-issues.md');

  if (await fs.pathExists(spacingPath)) {
    const spacingContent = await fs.readFile(spacingPath, 'utf8');

    const beforeIssues = validateMarkdown(spacingContent);
    console.log(`Before formatting: ${beforeIssues.length} issues found`);
    for (const issue of beforeIssues) console.log(`  - ${issue.message}`);

    const formattedSpacing = formatter.format(spacingContent);
    const afterIssues = validateMarkdown(formattedSpacing);

    console.log(`After formatting: ${afterIssues.length} issues found`);
    for (const issue of afterIssues) console.log(`  - ${issue.message}`);

    // Save formatted version
    await fs.writeFile(path.join(fixturesDir, 'formatted-spacing-fixed.md'), formattedSpacing, 'utf8');
    console.log('  ✅ Formatted version saved as formatted-spacing-fixed.md\n');
  }

  // Test with smart quotes fixture
  console.log('📄 Testing smart quotes fix...');
  // Create a test file with smart quotes
  const quotesContent = `# Story with \u201CSmart Quotes\u201D

Content with em-dash \u2014 and ellipses\u2026 characters.

- List item with \u2018single quotes\u2019
- Another with \u201Cdouble quotes\u201D
`;
  const quotesPath = path.join(fixturesDir, 'test-smart-quotes.md');
  await fs.writeFile(quotesPath, quotesContent, 'utf8');

  if (await fs.pathExists(quotesPath)) {
    const quotesContent = await fs.readFile(quotesPath, 'utf8');

    console.log('Before formatting:');
    console.log(`  - Contains smart quotes: ${quotesContent.includes('\u201C') || quotesContent.includes('\u2018')}`);

    const formattedQuotes = formatter.format(quotesContent);

    console.log('After formatting:');
    console.log(`  - Contains smart quotes: ${formattedQuotes.includes('\u201C') || formattedQuotes.includes('\u2018')}`);
    console.log(`  - Standard quotes count: ${(formattedQuotes.match(/"/g) || []).length}`);

    // Save formatted version
    await fs.writeFile(path.join(fixturesDir, 'formatted-quotes-fixed.md'), formattedQuotes, 'utf8');
    console.log('  ✅ Formatted version saved as formatted-quotes-fixed.md\n');
  }

  // Test with heading hierarchy fixture
  console.log('📄 Testing heading hierarchy fix...');
  // Create a test file with hierarchy issues
  const hierarchyContent = `# Main Title

### Skipped H2 - This is wrong

Content here.

## Proper H2

More content.

##### Skipped H3 and H4

This should be fixed.
`;
  const hierarchyPath = path.join(fixturesDir, 'test-hierarchy.md');
  await fs.writeFile(hierarchyPath, hierarchyContent, 'utf8');

  if (await fs.pathExists(hierarchyPath)) {
    const hierarchyContent = await fs.readFile(hierarchyPath, 'utf8');

    const beforeIssues = formatter.validateHeadingHierarchy(hierarchyContent);
    console.log(`Before formatting: ${beforeIssues.length} hierarchy issues`);
    for (const issue of beforeIssues) console.log(`  - Line ${issue.line}: ${issue.message}`);

    const formattedHierarchy = formatter.format(hierarchyContent);
    const afterIssues = formatter.validateHeadingHierarchy(formattedHierarchy);

    console.log(`After formatting: ${afterIssues.length} hierarchy issues`);
    for (const issue of afterIssues) console.log(`  - Line ${issue.line}: ${issue.message}`);

    // Save formatted version
    await fs.writeFile(path.join(fixturesDir, 'formatted-hierarchy-fixed.md'), formattedHierarchy, 'utf8');
    console.log('  ✅ Formatted version saved as formatted-hierarchy-fixed.md\n');
  }

  // Test the QA Results exact-match issue
  console.log('📄 Testing QA Results exact-match issue...');
  const qaPath = path.join(fixturesDir, 'story-with-qa-section-issue.md');

  if (await fs.pathExists(qaPath)) {
    const qaContent = await fs.readFile(qaPath, 'utf8');
    const formattedQA = formatter.format(qaContent);

    // Test the exact string that was failing in the GitHub issue
    const targetString = '## QA Results\n\n### Review Summary:\n\nThe story "Project Initialization';
    const beforeMatch = qaContent.includes(targetString);
    const afterMatch = formattedQA.includes(targetString);

    console.log(`Target string match before formatting: ${beforeMatch}`);
    console.log(`Target string match after formatting: ${afterMatch}`);

    // Save formatted version
    await fs.writeFile(path.join(fixturesDir, 'formatted-qa-fixed.md'), formattedQA, 'utf8');
    console.log('  ✅ Formatted version saved as formatted-qa-fixed.md\n');
  }

  console.log('✨ Markdown formatter testing completed!');
}

// Run tests if called directly
if (require.main === module) {
  testMarkdownFormatter().catch(console.error);
}

module.exports = testMarkdownFormatter;
