/**
 * Workflow Schema Validator CLI
 *
 * Scans all workflow.yaml files in src/{core,bmm}/workflows/
 * and validates them against the Zod schema.
 *
 * Usage: node tools/validate-workflow-schema.js [--strict] [project_root]
 * Exit codes:
 *   0 = success (or warnings-only in default mode)
 *   1 = validation failures in --strict mode, or no files found
 *
 * Options:
 *   --strict   Exit 1 when validation errors exist (for CI enforcement)
 */

const { glob } = require('glob');
const yaml = require('yaml');
const fs = require('node:fs');
const path = require('node:path');
const { validateWorkflowFile } = require('./schema/workflow.js');

const isCI = !!process.env.GITHUB_ACTIONS;

/**
 * Main validation routine
 * @param {object} options
 * @param {boolean} options.strict - Exit 1 on validation errors
 * @param {string} [options.projectRoot] - Optional project root to scan
 */
async function main({ strict, projectRoot }) {
  console.log('🔍 Scanning for workflow files...\n');

  const root = projectRoot || path.join(__dirname, '..');

  const workflowFiles = await glob('src/{core,bmm}/workflows/**/workflow.yaml', {
    cwd: root,
    absolute: true,
  });

  if (workflowFiles.length === 0) {
    console.log('❌ No workflow files found. This likely indicates a configuration error.');
    console.log('   Expected to find workflow.yaml files in src/{core,bmm}/workflows/');
    process.exit(1);
  }

  console.log(`Found ${workflowFiles.length} workflow file(s)\n`);

  const errors = [];

  for (const filePath of workflowFiles.sort()) {
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const workflowData = yaml.parse(fileContent);

      const result = validateWorkflowFile(relativePath, workflowData);

      if (result.success) {
        console.log(`✅ ${relativePath}`);
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

  if (errors.length > 0) {
    console.log(`\n⚠️  Validation issues in ${errors.length} file(s):\n`);

    for (const { file, issues } of errors) {
      console.log(`📄 ${file}`);
      for (const issue of issues) {
        const pathString = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        console.log(`   Path: ${pathString}`);
        console.log(`   Error: ${issue.message}`);

        if (isCI) {
          console.log(`::warning file=${file},title=Workflow Schema::${pathString}: ${issue.message}`);
        }
      }
      console.log('');
    }

    if (strict) {
      console.log(`💥 ${errors.length} file(s) failed validation (--strict mode)\n`);
      process.exit(1);
    }

    console.log(`⚠️  ${errors.length} file(s) have warnings (non-blocking)\n`);
    process.exit(0);
  }

  console.log(`\n✨ All ${workflowFiles.length} workflow file(s) passed validation!\n`);
  process.exit(0);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const projectRoot = args.find((arg) => !arg.startsWith('--'));

main({ strict, projectRoot }).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
