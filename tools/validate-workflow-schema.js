/**
 * Workflow Schema Validator CLI
 *
 * Scans all *.workflow.yaml files in src/
 * and validates them against the Zod schema.
 *
 * Usage: node tools/validate-workflow-schema.js [project_root]
 * Exit codes: 0 = success, 1 = validation failures
 *
 * Optional argument:
 *   project_root - Directory to scan (defaults to BMAD repo root)
 */

const { glob } = require('glob');
const yaml = require('js-yaml');
const fs = require('node:fs');
const path = require('node:path');
const { validateWorkflowFile } = require('./schema/workflow.js');

/**
 * Main validation routine
 * @param {string} [customProjectRoot] - Optional project root to scan (for testing)
 */
async function main(customProjectRoot) {
  console.log('🔍 Scanning for workflow files...\n');

  // Determine project root: use custom path if provided, otherwise default to repo root
  const project_root = customProjectRoot || path.join(__dirname, '..');

  // Find all workflow files
  const workflowFiles = await glob('src/**/workflow.yaml', {
    cwd: project_root,
    absolute: true,
    ignore: ['**/node_modules/**', '**/workflow-template/**'], // Exclude templates and node_modules
  });

  if (workflowFiles.length === 0) {
    console.log('❌ No workflow files found. This likely indicates a configuration error.');
    console.log('   Expected to find workflow.yaml files in src/');
    process.exit(1);
  }

  console.log(`Found ${workflowFiles.length} workflow file(s)\n`);

  const errors = [];
  const warnings = [];

  // Validate each file
  for (const filePath of workflowFiles) {
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const workflowData = yaml.load(fileContent);

      const result = validateWorkflowFile(relativePath, workflowData);

      if (result.success) {
        // Filter out "Unknown field" warnings from the per-file output
        const relevantWarnings = (result.warnings || []).filter((w) => !w.message.startsWith('Unknown field'));

        if (relevantWarnings.length > 0) {
          console.log(`⚠️  ${relativePath} (passed with warnings)`);
          warnings.push({
            file: relativePath,
            issues: relevantWarnings,
          });
        } else {
          console.log(`✅ ${relativePath}`);
        }

        // Still collect ALL warnings (including unknown fields) for the summary
        if (result.warnings && result.warnings.length > 0) {
          const unknownFieldWarnings = result.warnings.filter((w) => w.message.startsWith('Unknown field'));
          if (unknownFieldWarnings.length > 0) {
            warnings.push({
              file: relativePath,
              issues: unknownFieldWarnings,
              silent: true, // Mark as silent so we don't double-print in the loop below if mixed
            });
          }
        }
      } else {
        errors.push({
          file: relativePath,
          issues: result.error.issues,
        });
      }
    } catch (error) {
      errors.push({
        file: relativePath,
        issues: [
          {
            code: 'parse_error',
            message: `Failed to parse YAML: ${error.message}`,
            path: [],
          },
        ],
      });
    }
  }

  // Report warnings
  if (warnings.length > 0) {
    const unknownFields = new Map();

    for (const { file, issues } of warnings) {
      for (const issue of issues) {
        const pathString = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        // Only aggregate "Unknown field" warnings
        if (issue.message.startsWith('Unknown field')) {
          if (!unknownFields.has(pathString)) {
            unknownFields.set(pathString, []);
          }
          unknownFields.get(pathString).push(file);
        } else {
          // Print non-unknown-field warnings immediately (e.g. malformed vars)
          console.log(`\n⚠️  Warning in ${file}:`);
          console.log(`   Path: ${pathString}`);
          console.log(`   Message: ${issue.message}`);
        }
      }
    }

    if (unknownFields.size > 0) {
      console.log('\nℹ️  Unknown Fields Summary (not in schema, possibly custom variables):');
      const sortedFields = [...unknownFields.entries()].sort((a, b) => a[0].localeCompare(b[0]));

      for (const [field, files] of sortedFields) {
        console.log(`   - ${field} (${files.length} files)`);
      }
      console.log('\n   (Run with --verbose to see specific files for each field)');
    }
  }

  // Report errors
  if (errors.length > 0) {
    console.log('\n❌ Validation failed for the following files:\n');

    for (const { file, issues } of errors) {
      console.log(`\n📄 ${file}`);
      for (const issue of issues) {
        const pathString = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        console.log(`   Path: ${pathString}`);
        console.log(`   Error: ${issue.message}`);
        if (issue.code) {
          console.log(`   Code: ${issue.code}`);
        }
      }
    }

    console.log(`\n\n💥 ${errors.length} file(s) failed validation`);
    process.exit(1);
  }

  console.log(`\n✨ All ${workflowFiles.length} workflow file(s) passed validation!\n`);
  process.exit(0);
}

// Run with optional command-line argument for project root
const customProjectRoot = process.argv[2];
main(customProjectRoot).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
