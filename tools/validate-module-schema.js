/**
 * Module Schema Validator CLI
 *
 * Scans all module.yaml files in src/core/ and src/modules/
 * and validates them against the Zod schema.
 *
 * Usage: node tools/validate-module-schema.js [project_root]
 * Exit codes: 0 = success, 1 = validation failures
 *
 * Optional argument:
 *   project_root - Directory to scan (defaults to BMAD repo root)
 */

const { glob } = require('glob');
const yaml = require('yaml');
const fs = require('node:fs');
const path = require('node:path');
const { validateModuleFile } = require('./schema/module.js');

/**
 * Main validation routine
 * @param {string} [customProjectRoot] - Optional project root to scan (for testing)
 */
async function main(customProjectRoot) {
  console.log('🔍 Scanning for module files...\n');

  // Determine project root: use custom path if provided, otherwise default to repo root
  const project_root = customProjectRoot || path.join(__dirname, '..');

  // Find all module files: core/module.yaml and bmm/module.yaml (and any other top-level modules)
  const moduleFiles = await glob('src/{core,bmm}/module.yaml', {
    cwd: project_root,
    absolute: true,
  });

  if (moduleFiles.length === 0) {
    console.log('❌ No module files found. This likely indicates a configuration error.');
    console.log('   Expected to find module.yaml files in src/core/ and src/modules/*/');
    process.exit(1);
  }

  console.log(`Found ${moduleFiles.length} module file(s)\n`);

  const errors = [];

  // Validate each file
  for (const filePath of moduleFiles) {
    const relativePath = path.relative(project_root, filePath).replaceAll('\\', '/');

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const moduleData = yaml.parse(fileContent);

      // Ensure path starts with src/ for core module detection
      const srcRelativePath = relativePath.startsWith('src/') ? relativePath : `src/${relativePath}`;

      const result = validateModuleFile(srcRelativePath, moduleData);

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

  console.log(`\n✨ All ${moduleFiles.length} module file(s) passed validation!\n`);
  process.exit(0);
}

// Run with optional command-line argument for project root
const customProjectRoot = process.argv[2];
main(customProjectRoot).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
