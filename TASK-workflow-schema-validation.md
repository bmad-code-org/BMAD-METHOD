# Task: Implement Workflow Schema Validation

## Context

This repository uses YAML files to define workflows (49 files under `src/`). Currently, there is automated validation for agent YAML files but not for workflow YAML files. This task is to implement comprehensive validation for workflow schema files similar to the existing agent validation.

## Reference Documents

- **Schema Specification**: `/Users/alex/src/BMAD/schema-classification.md` (sections 7-10 describe workflow-related schemas)
- **Existing Validation Pattern**: `/Users/alex/src/BMAD/tools/validate-bundles.js` (XML bundle validation)
- **YAML Parsing Pattern**: `/Users/alex/src/BMAD/tools/cli/lib/yaml-xml-builder.js` (demonstrates YAML loading with js-yaml)
- **Package Configuration**: `/Users/alex/src/BMAD/package.json` (shows script patterns and dependencies)
- **CI Integration**: `/Users/alex/src/BMAD/.github/workflows/format-check.yaml` (demonstrates CI job structure)

## Workflow Schema Summary

Based on analysis of 17+ workflow files, the schema has these patterns:

### Required Fields

- `name`: NonEmptyString (kebab-case identifier)
- `description`: NonEmptyString (workflow purpose)
- `author`: NonEmptyString (typically "BMad")
- `installed_path`: PathString (workflow installation location)

### Optional Core Fields

- `version`: SemanticVersion (e.g., "1.2.0")
- `parent_workflow`: PathString (for sub-workflows)
- `config_source`: PathString (path to config.yaml)
- `date`: "system-generated" (literal string marker)
- `template`: PathString | false (template file or disabled)
- `instructions`: PathString (instructions.md path)
- `validation`: PathString (checklist.md path)
- `default_output_file`: PathString (primary output location)
- `recommended_inputs`: Array<Object> (suggested input documents)
- `autonomous`: Boolean (skip user checkpoints)
- `variables`: Object (workflow-specific variables)
- `required_tools`: Array<Object> (tool dependencies)
- `web_bundle`: WebBundleConfig | false (web deployment config)
- `tags`: Array<String> (categorization)
- `execution_hints`: Object (execution behavior hints)

### Config Variable Pattern

Common pattern for referencing config values:

```yaml
config_source: '{project-root}/bmad/{module}/config.yaml'
user_name: '{config_source}:user_name'
output_folder: '{config_source}:output_folder'
```

### Web Bundle Configuration

When `web_bundle` is an object (not `false`), it requires:

- `name`: NonEmptyString
- `description`: NonEmptyString
- `author`: NonEmptyString
- `web_bundle_files`: Array<PathString> (REQUIRED, non-empty)

**Critical constraint**: Web bundle paths MUST NOT use `{config_source}` references (self-contained requirement).

### Path Placeholder Variables

Supported in PathString values:

- `{project-root}`, `{config_source}`, `{installed_path}`, `{output_folder}`
- `{module-code}`, `{workflow-code}`, `{user_name}`, etc.
- `{{variable}}` (double braces for runtime substitution)

## Known Inconsistencies (Potential Bugs)

These should trigger WARNINGS, not errors, as they may be intentional:

1. **deep-dive.yaml:16** - Uses `{project-root}/src/modules/...` instead of `{project-root}/bmad/...` in `installed_path`
2. **deep-dive.yaml:10** - References `bmad/bmb/config.yaml` but parent workflow uses `bmm` module
3. Mixed placement of `autonomous` field (root level vs. inside `execution_hints`)

## Implementation Tasks

### 1. Extract Shared Validation Helpers

Create `/Users/alex/src/BMAD/tools/lib/validation-helpers.js` with reusable functions:

```javascript
/**
 * Shared validation utilities for YAML schema validation
 */

/**
 * Check if a value is a non-empty string
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if a value is a valid semantic version
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function isSemanticVersion(value) {
  if (typeof value !== 'string') return false;
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(value);
}

/**
 * Check if a value is a boolean
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * Check if a value is a plain object (not array, not null)
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if a value is a non-empty array
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Validate kebab-case naming convention
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function isKebabCase(value) {
  if (typeof value !== 'string') return false;
  const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return kebabRegex.test(value);
}

/**
 * Check if a path contains config_source references
 * @param {string} path - Path string to check
 * @returns {boolean}
 */
function containsConfigSourceReference(path) {
  if (typeof path !== 'string') return false;
  return path.includes('{config_source}');
}

/**
 * Check if installed_path uses correct bmad/ pattern (not src/)
 * @param {string} path - installed_path value
 * @returns {boolean}
 */
function usesCorrectInstalledPath(path) {
  if (typeof path !== 'string') return false;
  // Should contain bmad/ not src/
  return path.includes('/bmad/') && !path.includes('/src/');
}

/**
 * Format validation error message
 * @param {string} file - File path
 * @param {string} field - Field name
 * @param {string} message - Error message
 * @returns {string}
 */
function formatError(file, field, message) {
  return `${file} - ${field}: ${message}`;
}

/**
 * Format validation warning message
 * @param {string} file - File path
 * @param {string} field - Field name
 * @param {string} message - Warning message
 * @returns {string}
 */
function formatWarning(file, field, message) {
  return `${file} - ${field}: ${message}`;
}

module.exports = {
  isNonEmptyString,
  isSemanticVersion,
  isBoolean,
  isPlainObject,
  isNonEmptyArray,
  isKebabCase,
  containsConfigSourceReference,
  usesCorrectInstalledPath,
  formatError,
  formatWarning,
};
```

### 2. Create Workflow Validator

Create `/Users/alex/src/BMAD/tools/validate-workflows.js`:

```javascript
const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('js-yaml');
const chalk = require('chalk');
const glob = require('glob');
const {
  isNonEmptyString,
  isSemanticVersion,
  isBoolean,
  isPlainObject,
  isNonEmptyArray,
  isKebabCase,
  containsConfigSourceReference,
  usesCorrectInstalledPath,
  formatError,
  formatWarning,
} = require('./lib/validation-helpers');

/**
 * Validate a single workflow YAML file
 * @param {string} filePath - Path to workflow YAML file
 * @returns {Object} Validation result with errors and warnings
 */
async function validateWorkflowFile(filePath) {
  const errors = [];
  const warnings = [];

  try {
    // Load and parse YAML
    const content = await fs.readFile(filePath, 'utf8');
    const workflow = yaml.load(content);

    if (!workflow || typeof workflow !== 'object') {
      errors.push(formatError(filePath, 'root', 'Invalid YAML structure'));
      return { valid: false, errors, warnings };
    }

    // === REQUIRED FIELDS ===

    if (!isNonEmptyString(workflow.name)) {
      errors.push(formatError(filePath, 'name', 'Required field missing or empty'));
    } else if (!isKebabCase(workflow.name)) {
      warnings.push(formatWarning(filePath, 'name', 'Should use kebab-case convention'));
    }

    if (!isNonEmptyString(workflow.description)) {
      errors.push(formatError(filePath, 'description', 'Required field missing or empty'));
    }

    if (!isNonEmptyString(workflow.author)) {
      errors.push(formatError(filePath, 'author', 'Required field missing or empty'));
    }

    if (!isNonEmptyString(workflow.installed_path)) {
      errors.push(formatError(filePath, 'installed_path', 'Required field missing or empty'));
    } else if (!usesCorrectInstalledPath(workflow.installed_path)) {
      warnings.push(formatWarning(filePath, 'installed_path', 'Should use /bmad/ path pattern, not /src/ (post-installation path)'));
    }

    // === OPTIONAL FIELD TYPE VALIDATION ===

    if (workflow.version !== undefined && !isSemanticVersion(workflow.version)) {
      errors.push(formatError(filePath, 'version', 'Must be valid semantic version (e.g., "1.2.0")'));
    }

    if (workflow.parent_workflow !== undefined && !isNonEmptyString(workflow.parent_workflow)) {
      errors.push(formatError(filePath, 'parent_workflow', 'Must be a non-empty string'));
    }

    if (workflow.autonomous !== undefined && !isBoolean(workflow.autonomous)) {
      errors.push(formatError(filePath, 'autonomous', 'Must be a boolean'));
    }

    if (workflow.template !== undefined) {
      if (workflow.template !== false && !isNonEmptyString(workflow.template)) {
        errors.push(formatError(filePath, 'template', 'Must be a string path or false'));
      }

      // If template is a string, recommend having default_output_file
      if (isNonEmptyString(workflow.template) && !workflow.default_output_file) {
        warnings.push(formatWarning(filePath, 'default_output_file', 'Recommended when template is defined'));
      }
    }

    if (workflow.recommended_inputs !== undefined && !Array.isArray(workflow.recommended_inputs)) {
      errors.push(formatError(filePath, 'recommended_inputs', 'Must be an array'));
    }

    if (workflow.variables !== undefined && !isPlainObject(workflow.variables)) {
      errors.push(formatError(filePath, 'variables', 'Must be an object'));
    }

    if (workflow.required_tools !== undefined) {
      if (!Array.isArray(workflow.required_tools)) {
        errors.push(formatError(filePath, 'required_tools', 'Must be an array'));
      }
    }

    if (workflow.tags !== undefined && !Array.isArray(workflow.tags)) {
      errors.push(formatError(filePath, 'tags', 'Must be an array'));
    }

    if (workflow.execution_hints !== undefined && !isPlainObject(workflow.execution_hints)) {
      errors.push(formatError(filePath, 'execution_hints', 'Must be an object'));
    }

    // === WEB BUNDLE VALIDATION ===

    if (workflow.web_bundle !== undefined && workflow.web_bundle !== false) {
      if (!isPlainObject(workflow.web_bundle)) {
        errors.push(formatError(filePath, 'web_bundle', 'Must be an object or false'));
      } else {
        const bundle = workflow.web_bundle;

        // Required web_bundle fields
        if (!isNonEmptyString(bundle.name)) {
          errors.push(formatError(filePath, 'web_bundle.name', 'Required when web_bundle is enabled'));
        }

        if (!isNonEmptyString(bundle.description)) {
          errors.push(formatError(filePath, 'web_bundle.description', 'Required when web_bundle is enabled'));
        }

        if (!isNonEmptyString(bundle.author)) {
          errors.push(formatError(filePath, 'web_bundle.author', 'Required when web_bundle is enabled'));
        }

        if (!isNonEmptyArray(bundle.web_bundle_files)) {
          errors.push(formatError(filePath, 'web_bundle.web_bundle_files', 'Required non-empty array when web_bundle is enabled'));
        } else {
          // Check that no web_bundle paths use config_source
          for (let i = 0; i < bundle.web_bundle_files.length; i++) {
            const bundlePath = bundle.web_bundle_files[i];
            if (containsConfigSourceReference(bundlePath)) {
              errors.push(
                formatError(
                  filePath,
                  `web_bundle.web_bundle_files[${i}]`,
                  'Web bundle files must not use {config_source} references (self-contained constraint)',
                ),
              );
            }
          }
        }

        // Check all bundle file references for config_source
        for (const key in bundle) {
          if (key === 'web_bundle_files' || key === 'name' || key === 'description' || key === 'author') {
            continue;
          }

          const value = bundle[key];
          if (typeof value === 'string' && containsConfigSourceReference(value)) {
            errors.push(formatError(filePath, `web_bundle.${key}`, 'Web bundle paths must not use {config_source} references'));
          }
        }
      }
    }

    // === CONSISTENCY WARNINGS ===

    // Check for parent_workflow and module consistency
    if (workflow.parent_workflow && workflow.config_source) {
      const parentDir = path.dirname(workflow.parent_workflow);
      const configDir = path.dirname(workflow.config_source);

      // Extract module name from paths
      const parentModule = parentDir.match(/\/bmad\/([^/]+)\//)?.[1];
      const configModule = configDir.match(/\/bmad\/([^/]+)\//)?.[1];

      if (parentModule && configModule && parentModule !== configModule) {
        warnings.push(
          formatWarning(
            filePath,
            'config_source',
            `Module mismatch: parent uses "${parentModule}" but config references "${configModule}"`,
          ),
        );
      }
    }

    const valid = errors.length === 0;
    return { valid, errors, warnings };
  } catch (error) {
    errors.push(formatError(filePath, 'parse', `YAML parse error: ${error.message}`));
    return { valid: false, errors, warnings };
  }
}

/**
 * Validate all workflow YAML files in src/
 */
async function validateAllWorkflows() {
  console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('      VALIDATING WORKFLOW YAML SCHEMAS'));
  console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

  const srcDir = path.join(__dirname, '..', 'src');

  // Find all workflow.yaml files (and *.yaml files in workflows/ directories)
  const patterns = [path.join(srcDir, '**/workflows/**/workflow.yaml'), path.join(srcDir, '**/workflows/**/*.yaml')];

  const allFiles = new Set();
  for (const pattern of patterns) {
    const files = glob.sync(pattern);
    files.forEach((file) => allFiles.add(file));
  }

  const files = Array.from(allFiles).sort();

  if (files.length === 0) {
    console.log(chalk.yellow('No workflow YAML files found in src/'));
    return;
  }

  console.log(`Found ${chalk.bold(files.length)} workflow YAML files to validate\n`);

  let validCount = 0;
  let invalidCount = 0;
  const allErrors = [];
  const allWarnings = [];

  for (const file of files) {
    const relativePath = path.relative(srcDir, file);
    const result = await validateWorkflowFile(file);

    if (result.valid) {
      if (result.warnings.length > 0) {
        console.log(`${chalk.yellow('⚠')} ${relativePath}`);
        result.warnings.forEach((warning) => {
          console.log(`  ${chalk.yellow('→')} ${warning.split(' - ').slice(1).join(' - ')}`);
          allWarnings.push(warning);
        });
      } else {
        console.log(`${chalk.green('✓')} ${relativePath}`);
      }
      validCount++;
    } else {
      console.log(`${chalk.red('✗')} ${relativePath}`);
      result.errors.forEach((error) => {
        console.log(`  ${chalk.red('→')} ${error.split(' - ').slice(1).join(' - ')}`);
        allErrors.push(error);
      });
      result.warnings.forEach((warning) => {
        console.log(`  ${chalk.yellow('→')} ${warning.split(' - ').slice(1).join(' - ')}`);
        allWarnings.push(warning);
      });
      invalidCount++;
    }
  }

  // Summary
  console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('                 SUMMARY'));
  console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

  console.log(`  Total files checked:  ${chalk.bold(files.length)}`);
  console.log(`  Valid workflows:      ${chalk.green(validCount)}`);
  console.log(`  Invalid workflows:    ${invalidCount > 0 ? chalk.red(invalidCount) : chalk.green(invalidCount)}`);
  console.log(`  Total errors:         ${allErrors.length > 0 ? chalk.red(allErrors.length) : chalk.green(allErrors.length)}`);
  console.log(`  Total warnings:       ${allWarnings.length > 0 ? chalk.yellow(allWarnings.length) : chalk.green(allWarnings.length)}`);

  console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════\n'));

  // Exit with error if any invalid files
  process.exit(invalidCount > 0 ? 1 : 0);
}

// Run validation if called directly
if (require.main === module) {
  validateAllWorkflows().catch((error) => {
    console.error(chalk.red('Error running workflow validation:'), error);
    process.exit(1);
  });
}

module.exports = {
  validateWorkflowFile,
  validateAllWorkflows,
};
```

### 3. Update package.json

Add the new validation script to `/Users/alex/src/BMAD/package.json`:

```json
"scripts": {
  ...existing scripts...
  "validate:schemas": "node tools/validate-workflows.js",
  "validate:bundles": "node tools/validate-bundles.js"
}
```

### 4. Update GitHub Workflow

Update `/Users/alex/src/BMAD/.github/workflows/format-check.yaml` to add a new job:

```yaml
validate-schemas:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version-file: '.nvmrc'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Validate YAML schemas
      run: npm run validate:schemas
```

### 5. Create Test Fixtures (Optional but Recommended)

Create test fixtures under `/Users/alex/src/BMAD/test/fixtures/workflow-schema/`:

1. **valid/** - Valid workflow examples
2. **invalid/** - Invalid workflow examples for testing error detection

Example valid fixture: `test/fixtures/workflow-schema/valid/minimal-workflow.yaml`

```yaml
name: 'test-workflow'
description: 'Test workflow for validation'
author: 'BMad'
installed_path: '{project-root}/bmad/test/workflows/test-workflow'
```

Example invalid fixture: `test/fixtures/workflow-schema/invalid/missing-name.yaml`

```yaml
description: 'Test workflow for validation'
author: 'BMad'
installed_path: '{project-root}/bmad/test/workflows/test-workflow'
```

## Validation Rules Priority

### MUST VALIDATE (Errors)

1. Required fields: `name`, `description`, `author`, `installed_path`
2. Type correctness for all fields
3. Web bundle requirements when enabled
4. No `{config_source}` in web bundle paths
5. Valid YAML syntax

### SHOULD VALIDATE (Warnings)

1. `name` follows kebab-case convention
2. `installed_path` uses `/bmad/` not `/src/`
3. `default_output_file` present when `template` is a string
4. Module consistency between `parent_workflow` and `config_source`
5. Semantic version format for `version` field

### COULD VALIDATE (Future Enhancement)

1. File path existence checks
2. Orphaned file references
3. Duplicate output file paths
4. Missing `recommended_inputs` for complex workflows

## Testing Strategy

1. **Manual Testing**: Run `npm run validate:schemas` locally
2. **CI Testing**: Push to a branch and verify GitHub Actions workflow runs
3. **Fixture Testing** (optional): Create unit tests with Jest for the validation functions
4. **Edge Cases**: Test with known problematic files (deep-dive.yaml, party-mode.yaml)

## Success Criteria

- [ ] `/Users/alex/src/BMAD/tools/lib/validation-helpers.js` created with reusable functions
- [ ] `/Users/alex/src/BMAD/tools/validate-workflows.js` created and working
- [ ] `npm run validate:schemas` command works locally
- [ ] All 49 workflow YAML files are validated
- [ ] Known inconsistencies trigger warnings (not errors)
- [ ] GitHub Actions workflow includes validation step
- [ ] Zero false positives on valid workflow files
- [ ] Clear, actionable error and warning messages

## Notes

- This is a NEW implementation, do NOT modify existing files except package.json and format-check.yaml
- Use the same code style as existing tools (require, fs-extra, chalk, etc.)
- Follow the validation pattern from validate-bundles.js for consistency
- Warnings should not fail CI, only errors should exit with code 1
- The validation should be fast (< 5 seconds for all 49 files)

## Dependencies

All required dependencies already exist in package.json:

- `js-yaml` (YAML parsing)
- `fs-extra` (file operations)
- `chalk` (colored console output)
- `glob` (file pattern matching)

No new dependencies need to be added.
