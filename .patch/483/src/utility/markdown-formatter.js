/**
 * Markdown Formatting Utility
 *
 * Provides functions to normalize markdown output for consistent formatting
 * across platforms. Addresses issues described in GitHub issue #483.
 *
 * Key features:
 * - Normalize line endings to LF
 * - Consistent whitespace around headings
 * - Remove trailing whitespace (except where needed)
 * - Replace smart quotes with standard quotes
 * - Validate and fix heading hierarchy
 * - Ensure GFM compliance
 */

const fs = require('fs-extra');
const { EOL } = require('node:os');

class MarkdownFormatter {
  constructor(options = {}) {
    this.options = {
      // Line ending preferences
      forceLineEnding: 'crlf', // Use CRLF for Windows compatibility

      // Spacing preferences
      blankLinesAroundHeadings: 1,
      blankLinesAroundCodeBlocks: 1,
      maxConsecutiveBlankLines: 2,

      // Character normalization
      normalizeQuotes: true,
      normalizeEllipsis: true,
      normalizeEmDash: true,

      // GFM compliance
      enforceHeadingHierarchy: false, // Set to true to auto-fix hierarchy
      requireLanguageInCodeBlocks: false, // Set to true to add 'text' to unlabeled blocks

      ...options,
    };
  }

  /**
   * Format markdown content with all normalization rules
   * @param {string} content - Raw markdown content
   * @returns {string} - Formatted markdown content
   */
  format(content) {
    let formatted = content;

    // Step 1: Normalize line endings
    formatted = this.normalizeLineEndings(formatted);

    // Step 2: Normalize whitespace
    formatted = this.normalizeWhitespace(formatted);

    // Step 3: Normalize characters
    formatted = this.normalizeCharacters(formatted);

    // Step 4: Fix GFM compliance issues
    formatted = this.enforceGFMCompliance(formatted);

    // Step 5: Final cleanup
    formatted = this.finalCleanup(formatted);

    return formatted;
  }

  /**
   * Normalize line endings to consistent format
   * @param {string} content - Content with mixed line endings
   * @returns {string} - Content with normalized line endings
   */
  normalizeLineEndings(content) {
    // Handle malformed line endings first (like \r\r\n)
    let normalized = content
      .replaceAll('\r\r\n', '\n') // Fix malformed \r\r\n -> \n
      .replaceAll('\r\n', '\n') // Standard CRLF -> LF (normalize to LF first)
      .replaceAll('\r', '\n'); // Lone CR -> LF

    // Then apply desired line ending based on options
    let targetLineEnding = '\n'; // Default to LF

    switch (this.options.forceLineEnding) {
      case 'crlf': {
        targetLineEnding = '\r\n';

        break;
      }
      case 'auto': {
        // Use system line ending (Windows = CRLF, Unix = LF)
        targetLineEnding = EOL;

        break;
      }
      case 'lf': {
        targetLineEnding = '\n';

        break;
      }
      // No default
    }

    // Apply target line ending
    if (targetLineEnding === '\r\n') {
      normalized = normalized.replaceAll('\n', '\r\n');
    }

    return normalized;
  }

  /**
   * Normalize whitespace around headings, code blocks, and lists
   * @param {string} content - Content with inconsistent whitespace
   * @returns {string} - Content with consistent whitespace
   */
  normalizeWhitespace(content) {
    const lines = content.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = i > 0 ? lines[i - 1] : '';
      const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

      // Handle headings
      if (/^#{1,6}\s/.test(line)) {
        // Ensure blank line before heading (unless it's the first line)
        if (i > 0 && prevLine.trim() !== '' && result.at(-1) !== '') {
          result.push('');
        }

        result.push(line);

        // Ensure blank line after heading (unless it's the last line)
        if (i < lines.length - 1 && nextLine.trim() !== '' && !/^#{1,6}\s/.test(nextLine)) {
          result.push('');
        }
      }
      // Handle code blocks
      else if (line.trim().startsWith('```')) {
        // Add blank line before opening fence
        if ((line.trim() === '```' || /^```\w/.test(line)) && i > 0 && prevLine.trim() !== '' && result.at(-1) !== '') {
          result.push('');
        }

        result.push(line);

        // Add blank line after closing fence
        if (line.trim() === '```' && i > 0 && lines[i - 1].startsWith('```') && i < lines.length - 1 && nextLine.trim() !== '') {
          result.push('');
        }
      }
      // Handle regular content
      else {
        result.push(line);
      }
    }

    // Remove excessive blank lines
    const withLimitedBlanks = [];
    let consecutiveBlanks = 0;

    for (const line of result) {
      if (line.trim() === '') {
        consecutiveBlanks++;
        if (consecutiveBlanks <= this.options.maxConsecutiveBlankLines) {
          withLimitedBlanks.push(line);
        }
      } else {
        consecutiveBlanks = 0;
        withLimitedBlanks.push(line);
      }
    }

    return withLimitedBlanks.join('\n');
  }

  /**
   * Replace smart quotes and other problematic Unicode characters
   * @param {string} content - Content with Unicode characters
   * @returns {string} - Content with normalized characters
   */
  normalizeCharacters(content) {
    let normalized = content;

    if (this.options.normalizeQuotes) {
      // Replace smart quotes with standard quotes
      normalized = normalized
        .replaceAll(/[\u201C\u201D]/g, '"') // Left/right double quotes → "
        .replaceAll(/[\u2018\u2019]/g, "'"); // Left/right single quotes → '
    }

    if (this.options.normalizeEllipsis) {
      // Replace ellipsis character with three dots
      normalized = normalized.replaceAll('\u2026', '...');
    }

    if (this.options.normalizeEmDash) {
      // Replace em-dash with double hyphen
      normalized = normalized.replaceAll('\u2014', '--');
    }

    return normalized;
  }

  /**
   * Enforce GitHub Flavored Markdown compliance
   * @param {string} content - Content to make GFM compliant
   * @returns {string} - GFM compliant content
   */
  enforceGFMCompliance(content) {
    let compliant = content;

    // Add language hints to unlabeled code blocks
    if (this.options.requireLanguageInCodeBlocks) {
      compliant = compliant.replaceAll(/^```\n/gm, '```text\n');
    }

    // Fix heading hierarchy if enabled
    if (this.options.enforceHeadingHierarchy) {
      compliant = this.fixHeadingHierarchy(compliant);
    }

    return compliant;
  }

  /**
   * Fix heading hierarchy violations
   * @param {string} content - Content with potential heading hierarchy issues
   * @returns {string} - Content with fixed heading hierarchy
   */
  fixHeadingHierarchy(content) {
    const lines = content.split('\n');
    const result = [];
    let lastHeadingLevel = 0;

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s/);

      if (headingMatch) {
        const currentLevel = headingMatch[1].length;

        // If skipping levels, adjust to proper level
        if (currentLevel > lastHeadingLevel + 1) {
          const properLevel = Math.min(lastHeadingLevel + 1, 6);
          const newHeading = '#'.repeat(properLevel) + line.slice(Math.max(0, currentLevel));
          result.push(newHeading);
          lastHeadingLevel = properLevel;
        } else {
          result.push(line);
          lastHeadingLevel = currentLevel;
        }
      } else {
        result.push(line);
      }
    }

    return result.join('\n');
  }

  /**
   * Final cleanup operations
   * @param {string} content - Content after main formatting
   * @returns {string} - Final formatted content
   */
  finalCleanup(content) {
    let cleaned = content;

    // Detect the line ending style used in the content
    const hasWindowsLineEndings = cleaned.includes('\r\n');
    const lineEnding = hasWindowsLineEndings ? '\r\n' : '\n';

    // Remove trailing whitespace from lines (except in code blocks)
    const lines = cleaned.split(/\r?\n/);
    const result = [];
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        result.push(line);
      } else if (inCodeBlock) {
        // Preserve whitespace in code blocks
        result.push(line);
      } else {
        // Remove trailing whitespace from other lines
        result.push(line.trimEnd());
      }
    }

    cleaned = result.join(lineEnding);

    // Ensure file ends with exactly one line ending
    cleaned = cleaned.replace(/(\r?\n)*$/, lineEnding);

    return cleaned;
  }

  /**
   * Format a markdown file and write it back
   * @param {string} filePath - Path to markdown file
   * @returns {Promise<boolean>} - True if file was modified
   */
  async formatFile(filePath) {
    const originalContent = await fs.readFile(filePath, 'utf8');
    const formattedContent = this.format(originalContent);

    if (originalContent !== formattedContent) {
      await fs.writeFile(filePath, formattedContent, 'utf8');
      return true;
    }

    return false;
  }

  /**
   * Validate markdown content and return list of issues
   * @param {string} content - Markdown content to validate
   * @returns {Array} - Array of validation issues
   */
  validate(content) {
    const issues = [];

    // Check line endings
    if (content.includes('\r\n')) {
      issues.push({
        type: 'line-endings',
        message: 'Contains CRLF line endings',
        severity: 'error',
      });
    }

    // Check for excessive blank lines
    if (/\n\n\n\n/.test(content)) {
      issues.push({
        type: 'whitespace',
        message: 'Contains more than 3 consecutive blank lines',
        severity: 'warning',
      });
    }

    // Check for trailing whitespace
    const linesWithTrailing = content
      .split('\n')
      .map((line, index) => ({ line: index + 1, content: line }))
      .filter((item) => item.content.match(/\s+$/));

    if (linesWithTrailing.length > 0) {
      issues.push({
        type: 'whitespace',
        message: `${linesWithTrailing.length} lines have trailing whitespace`,
        severity: 'warning',
        lines: linesWithTrailing.map((item) => item.line),
      });
    }

    // Check for smart quotes
    const smartQuoteChars = ['\u201C', '\u201D', '\u2018', '\u2019'];
    const hasSmartQuotes = smartQuoteChars.some((char) => content.includes(char));

    if (hasSmartQuotes) {
      issues.push({
        type: 'characters',
        message: 'Contains smart quotes or curly quotes',
        severity: 'warning',
      });
    }

    // Check heading hierarchy
    const headingIssues = this.validateHeadingHierarchy(content);
    issues.push(...headingIssues);

    return issues;
  }

  /**
   * Validate heading hierarchy
   * @param {string} content - Markdown content
   * @returns {Array} - Array of heading hierarchy issues
   */
  validateHeadingHierarchy(content) {
    const issues = [];
    const lines = content.split('\n');
    const headings = lines
      .map((line, index) => ({ line: index + 1, content: line }))
      .filter((item) => item.content.match(/^#{1,6}\s/))
      .map((item) => ({
        ...item,
        level: item.content.match(/^(#{1,6})/)[1].length,
      }));

    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1];
      const curr = headings[i];

      if (curr.level > prev.level + 1) {
        issues.push({
          type: 'heading-hierarchy',
          message: `H${curr.level} follows H${prev.level}, skipping intermediate levels`,
          severity: 'error',
          line: curr.line,
        });
      }
    }

    return issues;
  }
}

// Export both the class and a default instance
const defaultFormatter = new MarkdownFormatter();

module.exports = {
  MarkdownFormatter,
  formatMarkdown: defaultFormatter.format.bind(defaultFormatter),
  formatMarkdownFile: defaultFormatter.formatFile.bind(defaultFormatter),
  validateMarkdown: defaultFormatter.validate.bind(defaultFormatter),
  normalizeLineEndings: defaultFormatter.normalizeLineEndings.bind(defaultFormatter),
};
