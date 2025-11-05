/**
 * BMAD Workflow Markdown Formatter
 *
 * Formats mixed markdown + XML workflow instruction files with:
 * - 2-space XML indentation
 * - Preserved markdown content
 * - Proper tag nesting
 * - Consistent formatting
 */

const fs = require('node:fs');
const path = require('node:path');

class WorkflowFormatter {
  constructor(options = {}) {
    this.indentSize = options.indentSize || 2;
    this.preserveMarkdown = options.preserveMarkdown !== false;
    this.verbose = options.verbose || false;
  }

  /**
   * Format a workflow markdown file
   */
  format(filePath) {
    if (this.verbose) {
      console.log(`Formatting: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const formatted = this.formatContent(content);

    // Only write if content changed
    if (content === formatted) {
      if (this.verbose) {
        console.log(`- No changes: ${filePath}`);
      }
      return false;
    } else {
      fs.writeFileSync(filePath, formatted, 'utf8');
      if (this.verbose) {
        console.log(`✓ Formatted: ${filePath}`);
      }
      return true;
    }
  }

  /**
   * Format content string with stateful indentation tracking
   */
  formatContent(content) {
    const lines = content.split('\n');
    const formatted = [];
    let indentLevel = 0;
    let inCodeBlock = false;
    let checkBlockDepth = 0; // Track nested check blocks

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Track code blocks (don't format inside them)
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        formatted.push(line);
        continue;
      }

      // Don't format inside code blocks
      if (inCodeBlock) {
        formatted.push(line);
        continue;
      }

      // Handle XML tags
      if (this.isXMLLine(trimmed)) {
        const result = this.formatXMLLine(trimmed, indentLevel, checkBlockDepth, i, lines);
        formatted.push(result.line);
        indentLevel = result.nextIndent;
        checkBlockDepth = result.nextCheckDepth;
      } else if (trimmed === '') {
        // Preserve blank lines
        formatted.push('');
      } else {
        // Markdown content - preserve as-is but maintain current indent if inside XML
        formatted.push(line);
      }
    }

    return formatted.join('\n');
  }

  /**
   * Check if line contains XML tag
   */
  isXMLLine(line) {
    return /^<[a-zA-Z-]+(\s|>|\/)/.test(line) || /^<\/[a-zA-Z-]+>/.test(line);
  }

  /**
   * Format a single XML line with context awareness
   */
  formatXMLLine(line, currentIndent, checkDepth, lineIndex, allLines) {
    const trimmed = line.trim();
    let indent = currentIndent;
    let nextIndent = currentIndent;
    let nextCheckDepth = checkDepth;

    // Get the tag name
    const tagMatch = trimmed.match(/^<\/?([a-zA-Z-]+)/);
    const tagName = tagMatch ? tagMatch[1] : '';

    // Closing tag - decrease indent before this line
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, currentIndent - 1);
      nextIndent = indent;

      // If closing a step, reset check depth
      if (tagName === 'step' || tagName === 'workflow') {
        nextCheckDepth = 0;
      }
    }
    // Self-closing tags (opens and closes on same line)
    // EXCEPT <check> tags which create logical blocks
    else if (this.isSelfClosingTag(trimmed) && tagName !== 'check') {
      // These don't change indent level
      indent = currentIndent;
      nextIndent = currentIndent;
    }
    // Opening tags
    else if (trimmed.startsWith('<')) {
      // Check if this is a <check> tag - these create logical blocks
      if (tagName === 'check') {
        indent = currentIndent;
        // Check tags increase indent for following content
        nextIndent = currentIndent + 1;
        nextCheckDepth = checkDepth + 1;
      }
      // <action> tags inside check blocks stay at current indent
      else if (tagName === 'action' && checkDepth > 0) {
        indent = currentIndent;
        nextIndent = currentIndent; // Don't increase further
      }
      // Other tags close check blocks and return to structural level
      else if (checkDepth > 0) {
        // Close all check blocks - return to base structural level
        indent = Math.max(0, currentIndent - checkDepth);
        nextIndent = indent + 1;
        nextCheckDepth = 0;
      }
      // Regular opening tags (no check blocks active)
      else {
        indent = currentIndent;
        nextIndent = currentIndent + 1;
      }
    }

    const indentStr = ' '.repeat(indent * this.indentSize);
    return {
      line: indentStr + trimmed,
      nextIndent: nextIndent,
      nextCheckDepth: nextCheckDepth,
    };
  }

  /**
   * Check if tag opens and closes on same line
   */
  isSelfClosingTag(line) {
    // Self-closing with />
    if (line.endsWith('/>')) {
      return true;
    }
    // Opens and closes on same line: <tag>content</tag>
    const match = line.match(/^<([a-zA-Z-]+)(\s[^>]*)?>.*<\/\1>$/);
    return match !== null;
  }

  /**
   * Check if tag is a block-level structural tag
   */
  isBlockLevelTag(tagName) {
    return ['step', 'workflow', 'check'].includes(tagName);
  }
}

/**
 * CLI Entry Point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
BMAD Workflow Markdown Formatter

Usage:
  node format-workflow-md.js <file-pattern> [options]

Options:
  --verbose, -v     Verbose output
  --check, -c       Check formatting without writing (exit 1 if changes needed)
  --help, -h        Show this help

Examples:
  node format-workflow-md.js src/**/instructions.md
  node format-workflow-md.js "src/modules/bmb/**/*.md" --verbose
  node format-workflow-md.js file.md --check
`);
    process.exit(0);
  }

  const verbose = args.includes('--verbose') || args.includes('-v');
  const check = args.includes('--check') || args.includes('-c');

  // Remove flags from args
  const files = args.filter((arg) => !arg.startsWith('-'));

  const formatter = new WorkflowFormatter({ verbose });
  let hasChanges = false;
  let formattedCount = 0;

  // Process files
  for (const pattern of files) {
    // For now, treat as direct file path
    // TODO: Add glob support for patterns
    if (fs.existsSync(pattern)) {
      const stat = fs.statSync(pattern);
      if (stat.isFile()) {
        const changed = formatter.format(pattern);
        if (changed) {
          hasChanges = true;
          formattedCount++;
        }
      } else if (stat.isDirectory()) {
        console.error(`Error: ${pattern} is a directory. Please specify file paths.`);
      }
    } else {
      console.error(`Error: File not found: ${pattern}`);
    }
  }

  if (verbose || formattedCount > 0) {
    console.log(`\nFormatted ${formattedCount} file(s)`);
  }

  if (check && hasChanges) {
    console.error('\n❌ Some files need formatting. Run without --check to format.');
    process.exit(1);
  }

  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { WorkflowFormatter };
