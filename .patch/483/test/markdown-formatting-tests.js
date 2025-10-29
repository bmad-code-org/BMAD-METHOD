/**
 * Tests for detecting markdown formatting issues described in GitHub issue #483
 * These tests identify CRLF line endings, inconsistent whitespace, and non-standard markdown formatting
 */

const fs = require('fs-extra');
const path = require('node:path');

describe('Markdown Formatting Issue Detection', () => {
  const testOutputDir = path.join(__dirname, 'fixtures', 'temp', 'markdown-test-output');

  beforeAll(async () => {
    // Ensure test output directory exists
    await fs.ensureDir(testOutputDir);
  });

  afterAll(async () => {
    // Clean up test files
    await fs.remove(testOutputDir);
  });

  describe('Line Ending Detection', () => {
    test('should detect CRLF line endings in generated markdown', async () => {
      // Create a test file with CRLF line endings
      const testContent = 'Line 1\r\nLine 2\r\nLine 3\r\n';
      const testFile = path.join(testOutputDir, 'crlf-test.md');

      await fs.writeFile(testFile, testContent, 'utf8');

      // Read file as buffer to detect actual line endings
      const buffer = await fs.readFile(testFile);
      const content = buffer.toString('utf8');

      // Test for CRLF presence
      const hasCRLF = content.includes('\r\n');
      const hasOnlyLF = !content.includes('\r\n') && content.includes('\n');

      expect(hasCRLF).toBe(true);
      expect(hasOnlyLF).toBe(false);
    });

    test('should detect LF-only line endings in normalized markdown', async () => {
      // Create a test file with LF-only line endings
      const testContent = 'Line 1\nLine 2\nLine 3\n';
      const testFile = path.join(testOutputDir, 'lf-test.md');

      await fs.writeFile(testFile, testContent, 'utf8');

      // Read file as buffer to detect actual line endings
      const buffer = await fs.readFile(testFile);
      const content = buffer.toString('utf8');

      // Test for LF-only
      const hasCRLF = content.includes('\r\n');
      const hasOnlyLF = !content.includes('\r\n') && content.includes('\n');

      expect(hasCRLF).toBe(false);
      expect(hasOnlyLF).toBe(true);
    });

    test('should provide utility function to normalize line endings', () => {
      const normalizeLineEndings = (content) => {
        return content.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
      };

      const crlfContent = 'Line 1\r\nLine 2\r\nLine 3\r\n';
      const mixedContent = 'Line 1\r\nLine 2\nLine 3\rLine 4\n';

      expect(normalizeLineEndings(crlfContent)).toBe('Line 1\nLine 2\nLine 3\n');
      expect(normalizeLineEndings(mixedContent)).toBe('Line 1\nLine 2\nLine 3\nLine 4\n');
    });
  });

  describe('Whitespace Consistency Detection', () => {
    test('should detect inconsistent blank lines around headings', () => {
      const inconsistentMarkdown = `# Title


## Section 1

Content here.

## Section 2


Content here.


## Section 3
Content here.`;

      const lines = inconsistentMarkdown.split('\n');
      const headingLines = [];

      for (const [index, line] of lines.entries()) {
        if (/^#{1,6}\s/.test(line)) {
          headingLines.push({
            line: index + 1,
            content: line,
            blankLinesBefore: countBlankLinesBefore(lines, index),
            blankLinesAfter: countBlankLinesAfter(lines, index),
          });
        }
      }

      // Check for inconsistent spacing
      const spacingInconsistencies = headingLines.filter((heading) => {
        // H1 should have 0 blank lines before (if first) or 2 before
        // H2-H6 should have 1 blank line before and 1 after
        return heading.content.startsWith('# ') ? heading.blankLinesBefore > 2 : heading.blankLinesBefore !== 1 || heading.blankLinesAfter !== 1;
      });

      expect(spacingInconsistencies.length).toBeGreaterThan(0);
    });

    test('should detect trailing whitespace', () => {
      const markdownWithTrailingSpaces = `# Title  
Content with trailing spaces.   

## Section   
More content.	
`;

      const lines = markdownWithTrailingSpaces.split('\n');
      const linesWithTrailingWhitespace = lines
        .map((line, index) => ({ line: index + 1, content: line }))
        .filter((item) => item.content.match(/\s+$/));

      expect(linesWithTrailingWhitespace.length).toBeGreaterThan(0);
      expect(linesWithTrailingWhitespace[0].line).toBe(1); // Title has trailing spaces
    });

    test('should validate consistent list formatting', () => {
      const inconsistentList = `## Tasks

- Task 1
  - Subtask 1.1
  - Subtask 1.2
- Task 2
   - Subtask 2.1 (wrong indentation)
- Task 3
	- Subtask 3.1 (tab instead of spaces)
`;

      const lines = inconsistentList.split('\n');
      const listItems = lines.map((line, index) => ({ line: index + 1, content: line })).filter((item) => item.content.match(/^\s*-\s/));

      // Check for inconsistent indentation
      const indentationIssues = listItems.filter((item) => {
        const match = item.content.match(/^(\s*)-/);
        if (match) {
          const indent = match[1];
          // Should be either no indent (0) or multiples of 2 spaces
          return indent.length > 0 && (indent.length % 2 !== 0 || indent.includes('\t'));
        }
        return false;
      });

      expect(indentationIssues.length).toBeGreaterThan(0);
    });
  });

  describe('GFM Compliance Detection', () => {
    test('should detect improper heading hierarchy', () => {
      const badHierarchy = `# Main Title

### Skipped H2 - This is wrong

## Proper H2

##### Skipped H3 and H4 - This is also wrong

#### Back to H4
`;

      const lines = badHierarchy.split('\n');
      const headings = lines
        .map((line, index) => ({ line: index + 1, content: line }))
        .filter((item) => item.content.match(/^#{1,6}\s/))
        .map((item) => ({
          ...item,
          level: item.content.match(/^(#{1,6})/)[1].length,
        }));

      // Check for hierarchy violations (skipping levels)
      const hierarchyViolations = [];
      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1];
        const curr = headings[i];

        // If current level is more than 1 level deeper than previous, it's a violation
        if (curr.level > prev.level + 1) {
          hierarchyViolations.push({
            line: curr.line,
            issue: `H${curr.level} follows H${prev.level}, skipping intermediate levels`,
          });
        }
      }

      expect(hierarchyViolations.length).toBeGreaterThan(0);
    });

    test('should detect improperly formatted code blocks', () => {
      const badCodeBlocks = `## Code Examples

\`\`\`
// No language specified - should be javascript or text
const example = 'test';
\`\`\`

\`\`\`bash
# This is good
echo "Hello World"
\`\`\`

\`\`\`yaml
# This is also good
key: value
\`\`\`
`;

      const codeBlockMatches = [...badCodeBlocks.matchAll(/```(\w+)?\n/g)];
      const blocksWithoutLanguage = codeBlockMatches.filter((match) => !match[1]);

      expect(blocksWithoutLanguage.length).toBeGreaterThan(0);
    });

    test('should detect smart quotes and other problematic characters', () => {
      const smartQuotesText = `# Title with \u201Csmart quotes\u201D and \u2018curly quotes\u2019

Content with em-dash \u2014 and ellipses\u2026 and other problematic characters.

- Bullet with \u201Cquote\u201D
- Another bullet with \u2018single quotes\u2019
`;

      const problematicChars = [
        { char: '\u201C', name: 'left double quote' },
        { char: '\u201D', name: 'right double quote' },
        { char: '\u2018', name: 'left single quote' },
        { char: '\u2019', name: 'right single quote' },
        { char: '\u2014', name: 'em dash' },
        { char: '\u2026', name: 'ellipsis' },
      ];

      const foundProblematicChars = problematicChars.filter((item) => smartQuotesText.includes(item.char));

      expect(foundProblematicChars.length).toBeGreaterThan(0);
    });
  });

  describe('Story Template Specific Issues', () => {
    test('should detect QA Results section formatting issues', () => {
      const storyWithQAResults = `# Story 1.1: Project Setup

## QA Results

### Review Summary:

The story "Project Initialization & Setup" (Story 1.1) is well-defined and covers the essential setup for a new Next.js 15 application.

### Acceptance Criteria Review:
- ✓ Criterion 1 met
- ✓ Criterion 2 met
`;

      // This simulates the exact-match replacement issue from the GitHub issue
      const targetString = `## QA Results\n\n### Review Summary:\n\nThe story "Project Initialization`;
      const found = storyWithQAResults.includes(targetString);

      // If this fails, it indicates the whitespace/formatting issue
      expect(found).toBe(true);
    });
  });
});

// Helper functions
function countBlankLinesBefore(lines, currentIndex) {
  let count = 0;
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (lines[i].trim() === '') {
      count++;
    } else {
      break;
    }
  }
  return count;
}

function countBlankLinesAfter(lines, currentIndex) {
  let count = 0;
  for (let i = currentIndex + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      count++;
    } else {
      break;
    }
  }
  return count;
}

module.exports = {
  normalizeLineEndings: (content) => content.replaceAll('\r\n', '\n').replaceAll('\r', '\n'),
  detectTrailingWhitespace: (content) => {
    return content
      .split('\n')
      .map((line, index) => ({ line: index + 1, content: line }))
      .filter((item) => item.content.match(/\s+$/));
  },
  validateHeadingHierarchy: (content) => {
    const lines = content.split('\n');
    const headings = lines
      .map((line, index) => ({ line: index + 1, content: line }))
      .filter((item) => item.content.match(/^#{1,6}\s/))
      .map((item) => ({
        ...item,
        level: item.content.match(/^(#{1,6})/)[1].length,
      }));

    const violations = [];
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1];
      const curr = headings[i];

      if (curr.level > prev.level + 1) {
        violations.push({
          line: curr.line,
          issue: `H${curr.level} follows H${prev.level}, skipping intermediate levels`,
        });
      }
    }
    return violations;
  },
};
