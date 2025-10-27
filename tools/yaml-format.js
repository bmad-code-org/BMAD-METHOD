const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { execSync } = require('node:child_process');

// Dynamic import for ES module
let chalk;

// Initialize ES modules
async function initializeModules() {
  if (!chalk) {
    chalk = (await import('chalk')).default;
  }
}

/**
 * YAML Formatter and Linter for BMad-Method
 * Formats and validates YAML files and YAML embedded in Markdown
 */

async function formatYamlContent(content, filename) {
  await initializeModules();
  try {
    // First try to fix common YAML issues
    let fixedContent = content
      // Fix "commands :" -> "commands:"
      .replaceAll(/^(\s*)(\w+)\s+:/gm, '$1$2:')
      // Fix inconsistent list indentation
      .replaceAll(/^(\s*)-\s{3,}/gm, '$1- ');

    // Skip auto-fixing for .roomodes files - they have special nested structure
    if (!filename.includes('.roomodes')) {
      fixedContent = fixedContent
        // Fix unquoted list items that contain special characters or multiple parts
        .replaceAll(/^(\s*)-\s+(.*)$/gm, (match, indent, content) => {
          // Skip if already quoted
          if (content.startsWith('"') && content.endsWith('"')) {
            return match;
          }
          // If the content contains special YAML characters or looks complex, quote it
          // BUT skip if it looks like a proper YAML key-value pair (like "key: value")
          if (
            (content.includes(':') ||
              content.includes('-') ||
              content.includes('{') ||
              content.includes('}')) &&
            !/^\w+:\s/.test(content)
          ) {
            // Remove any existing quotes first, escape internal quotes, then add proper quotes
            const cleanContent = content
              .replaceAll(/^["']|["']$/g, '')
              .replaceAll('"', String.raw`\"`);
            return `${indent}- "${cleanContent}"`;
          }
          return match;
        });
    }

    // Debug: show what we're trying to parse
    if (fixedContent !== content) {
      console.log(chalk.blue(`🔧 Applied YAML fixes to ${filename}`));
    }

    // Parse and re-dump YAML to format it
    const parsed = yaml.load(fixedContent);
    const formatted = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1, // Disable line wrapping
      noRefs: true,
      sortKeys: false, // Preserve key order
    });
    return formatted;
  } catch (error) {
    console.error(chalk.red(`❌ YAML syntax error in ${filename}:`), error.message);
    console.error(chalk.yellow(`💡 Try manually fixing the YAML structure first`));
    return null;
  }
}

async function processMarkdownFile(filePath) {
  await initializeModules();
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;

  // Fix untyped code blocks by adding 'text' type
  // Match ``` at start of line followed by newline, but only if it's an opening fence
  newContent = newContent.replaceAll(/^```\n([\s\S]*?)\n```$/gm, '```text\n$1\n```');
  if (newContent !== content) {
    modified = true;
    console.log(chalk.blue(`🔧 Added 'text' type to untyped code blocks in ${filePath}`));
  }

  // Find YAML code blocks
  const yamlBlockRegex = /```ya?ml\n([\s\S]*?)\n```/g;
  let match;
  const replacements = [];

  while ((match = yamlBlockRegex.exec(newContent)) !== null) {
    const [fullMatch, yamlContent] = match;
    const formatted = await formatYamlContent(yamlContent, filePath);
    if (formatted !== null) {
      // Remove trailing newline that js-yaml adds
      const trimmedFormatted = formatted.replace(/\n$/, '');

      if (trimmedFormatted !== yamlContent) {
        modified = true;
        console.log(chalk.green(`✓ Formatted YAML in ${filePath}`));
      }

      replacements.push({
        start: match.index,
        end: match.index + fullMatch.length,
        replacement: `\`\`\`yaml\n${trimmedFormatted}\n\`\`\``,
      });
    }
  }

  // Apply replacements in reverse order to maintain indices
  for (let index = replacements.length - 1; index >= 0; index--) {
    const { start, end, replacement } = replacements[index];
    newContent = newContent.slice(0, start) + replacement + newContent.slice(end);
  }

  if (modified) {
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  return false;
}

async function processYamlFile(filePath) {
  await initializeModules();
  const content = fs.readFileSync(filePath, 'utf8');
  const formatted = await formatYamlContent(content, filePath);

  if (formatted === null) {
    return false; // Syntax error
  }

  if (formatted !== content) {
    fs.writeFileSync(filePath, formatted);
    return true;
  }
  return false;
}

async function lintYamlFile(filePath) {
  await initializeModules();
  try {
    // Use yaml-lint for additional validation
    execSync(`npx yaml-lint "${filePath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ YAML lint error in ${filePath}:`));
    console.error(error.stdout?.toString() || error.message);
    return false;
  }
}

async function main() {
  await initializeModules();
  const arguments_ = process.argv.slice(2);
  const glob = require('glob');

  if (arguments_.length === 0) {
    console.error('Usage: node yaml-format.js <file1> [file2] ...');
    process.exit(1);
  }

  let hasErrors = false;
  let hasChanges = false;
  let filesProcessed = [];

  // Expand glob patterns and collect all files
  const allFiles = [];
  for (const argument of arguments_) {
    if (argument.includes('*')) {
      // It's a glob pattern
      const matches = glob.sync(argument);
      allFiles.push(...matches);
    } else {
      // It's a direct file path
      allFiles.push(argument);
    }
  }

  for (const filePath of allFiles) {
    if (!fs.existsSync(filePath)) {
      // Skip silently for glob patterns that don't match anything
      if (!arguments_.some((argument) => argument.includes('*') && filePath === argument)) {
        console.error(chalk.red(`❌ File not found: ${filePath}`));
        hasErrors = true;
      }
      continue;
    }

    const extension = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath).toLowerCase();

    try {
      let changed = false;
      if (extension === '.md') {
        changed = await processMarkdownFile(filePath);
      } else if (
        extension === '.yaml' ||
        extension === '.yml' ||
        basename.includes('roomodes') ||
        basename.includes('.yaml') ||
        basename.includes('.yml')
      ) {
        // Handle YAML files and special cases like .roomodes
        changed = await processYamlFile(filePath);

        // Also run linting
        const lintPassed = await lintYamlFile(filePath);
        if (!lintPassed) hasErrors = true;
      } else {
        // Skip silently for unsupported files
        continue;
      }

      if (changed) {
        hasChanges = true;
        filesProcessed.push(filePath);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error processing ${filePath}:`), error.message);
      hasErrors = true;
    }
  }

  if (hasChanges) {
    console.log(
      chalk.green(`\n✨ YAML formatting completed! Modified ${filesProcessed.length} files:`),
    );
    for (const file of filesProcessed) console.log(chalk.blue(`  📝 ${file}`));
  }

  if (hasErrors) {
    console.error(chalk.red('\n💥 Some files had errors. Please fix them before committing.'));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { formatYamlContent, processMarkdownFile, processYamlFile };
