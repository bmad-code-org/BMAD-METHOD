// Zod schema definition for workflow.yaml files
const { z } = require('zod');

const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Public API ---------------------------------------------------------------

/**
 * Validate a workflow YAML payload against the schema.
 * Exposed as the single public entry point, so callers do not reach into schema internals.
 *
 * @param {string} filePath Path to the workflow file (for error reporting).
 * @param {unknown} workflowYaml Parsed YAML content.
 * @returns {object} Result with success, data/error, and warnings array
 */
function validateWorkflowFile(filePath, workflowYaml) {
  const schema = workflowSchema();
  const result = schema.safeParse(workflowYaml);
  const warnings = collectUnknownFieldWarnings(workflowYaml);
  return { ...result, warnings };
}

module.exports = { validateWorkflowFile };

// Canonical lists of known variable references (extracted from 65 real workflows)
// These are used to validate variable references and catch typos

const KNOWN_PATH_PLACEHOLDERS = [
  'agent_filename',
  'bmad_folder',
  'custom_agent_location',
  'custom_module_location',
  'custom_workflow_location',
  'date',
  'epic_id',
  'epic_num',
  'game_name',
  'installed_path',
  'item_name',
  'item_type',
  'module_code',
  'output_folder',
  'path',
  'prev_epic_num',
  'project-root',
  'project_name',
  'reference_agents',
  'research_type',
  'shared_path',
  'sprint_artifacts',
  'status_file',
  'story_dir',
  'story_id',
  'story_key',
  'story_path',
  'target_module',
  'test_dir',
  'timestamp',
  'workflow_name',
  'workflow_template_path',
];

const KNOWN_CONFIG_VARIABLES = [
  'communication_language',
  'custom_agent_location',
  'custom_module_location',
  'custom_workflow_location',
  'document_output_language',
  'game_dev_experience',
  'output_folder',
  'project_name',
  'sprint_artifacts',
  'user_name',
  'user_skill_level',
];

const KNOWN_TEMPLATE_VARIABLES = [
  'agent_filename',
  'date',
  'epic_id',
  'epic_num',
  'game_name',
  'item_name',
  'item_type',
  'module_code',
  'prev_epic_num',
  'project_name',
  'research_type',
  'story_key',
  'target_module',
  'workflow_name',
];

// Internal helpers ---------------------------------------------------------

/**
 * Build a Zod schema for validating a single workflow definition.
 *
 * @returns {import('zod').ZodSchema} Configured Zod schema instance.
 */
function workflowSchema() {
  return z
    .object({
      name: createKebabCaseString('name'),
      description: createNonEmptyString('description'),
      standalone: z.boolean().optional(),
      template: z.union([z.literal(false), z.string()]).optional(),
      instructions: createNonEmptyString('instructions'),
      validation: z.string().optional(),
      config_source: z.string().optional(),
      installed_path: z.string().optional(),
      output_folder: z.string().optional(),
      user_name: z.string().optional(),
      communication_language: z.string().optional(),
      date: z.string().optional(),
      brain_techniques: z.string().optional(),
      validation_output_file: z.string().optional(),
      required_tools: z.array(z.union([z.string(), z.object({ description: z.string().optional() }).catchall(z.unknown())])).optional(),
      default_output_file: z.string().optional(),
      autonomous: z.boolean().optional(),
      web_bundle: z.union([z.literal(false), buildWebBundleSchema()]).optional(),
      input_file_patterns: z.record(z.string(), buildInputFilePatternSchema()).optional(),
      exit_triggers: z.array(createNonEmptyString('exit_triggers[]')).optional(),

      // Common optional fields (often injected variables or context)
      document_output_language: z.string().optional(),
      user_skill_level: z.string().optional(),
      sprint_artifacts: z.string().optional(),
      sprint_status: z.string().optional(),
      game_dev_experience: z.string().optional(),
      variables: z.record(z.string(), z.unknown()).optional(),
      checklist: z.string().optional(),
      story_dir: z.string().optional(),
      story_file: z.string().optional(),
      context_file: z.string().optional(),
      game_types_csv: z.string().optional(),
      game_type_guides: z.string().optional(),
      game_context: z.string().optional(),
      game_brain_methods: z.string().optional(),
      core_brainstorming: z.string().optional(),
      decision_catalog: z.string().optional(),
      architecture_patterns: z.string().optional(),
      pattern_categories: z.string().optional(),
      replaces: z.string().optional(),
      paradigm: z.string().optional(),
      execution_time: z.string().optional(),
      features: z.array(z.string()).optional(),
      project_context: z.string().optional(),

      // Additional common fields
      tags: z.array(z.string()).optional(),
      execution_hints: z.record(z.string(), z.unknown()).optional(),
      project_name: z.string().optional(),
      library: z.string().optional(),
      helpers: z.string().optional(),
      templates: z.string().optional(),
      json_validation: z.string().optional(),
      shared_path: z.string().optional(),
    })
    .catchall(z.unknown()) // Allow unknown fields for dynamic workflow variables
    .superRefine((data, ctx) => {
      // Validate variable references in all string values
      validateVariableReferences(data, [], ctx);
    });
}

/**
 * Schema for web_bundle object when it's not a boolean.
 */
function buildWebBundleSchema() {
  return z
    .object({
      name: createNonEmptyString('web_bundle.name').optional(),
      description: createNonEmptyString('web_bundle.description').optional(),
      instructions: createNonEmptyString('web_bundle.instructions').optional(),
      web_bundle_files: z.array(createNonEmptyString('web_bundle.web_bundle_files[]')).optional(),
      validation: z.string().optional(),
      template: z.union([z.literal(false), z.string()]).optional(),
      existing_workflows: z.array(z.unknown()).optional(),
    })
    .catchall(z.unknown()); // Allow custom fields like agent_manifest, author, etc.
}

/**
 * Schema for individual input_file_patterns entries.
 */
function buildInputFilePatternSchema() {
  return z
    .object({
      description: createNonEmptyString('input_file_patterns[].description').optional(),
      whole: z.string().optional(),
      sharded: z.string().optional(),
      sharded_index: z.string().optional(),
      sharded_single: z.string().optional(),
      pattern: z.string().optional(), // Legacy support
      load_strategy: z.enum(['FULL_LOAD', 'SELECTIVE_LOAD', 'INDEX_GUIDED']).optional(),
    })
    .strict(); // Warn about unknown fields - patterns have a defined schema
}

/**
 * Recursively validate variable references in all string values.
 * Checks for:
 * 1. Malformed syntax (unclosed braces, invalid patterns)
 * 2. Unknown placeholders/variables (warns about potential typos)
 *
 * @param {any} obj - Object to validate
 * @param {Array} path - Current path in object tree
 * @param {import('zod').RefinementCtx} ctx - Zod context for adding issues
 */
function collectUnknownFieldWarnings(workflowYaml) {
  const warnings = [];
  if (typeof workflowYaml === 'object' && workflowYaml !== null) {
    const knownFields = new Set([
      'name',
      'description',
      'standalone',
      'template',
      'instructions',
      'validation',
      'config_source',
      'installed_path',
      'output_folder',
      'user_name',
      'communication_language',
      'date',
      'brain_techniques',
      'validation_output_file',
      'required_tools',
      'default_output_file',
      'autonomous',
      'web_bundle',
      'input_file_patterns',
      'exit_triggers',
      // Added common fields
      'document_output_language',
      'user_skill_level',
      'sprint_artifacts',
      'sprint_status',
      'game_dev_experience',
      'variables',
      'checklist',
      'story_dir',
      'story_file',
      'context_file',
      'game_types_csv',
      'game_type_guides',
      'game_context',
      'game_brain_methods',
      'core_brainstorming',
      'decision_catalog',
      'architecture_patterns',
      'pattern_categories',
      'replaces',
      'paradigm',
      'execution_time',
      'features',
      'project_context',
      // Additional common fields
      'tags',
      'execution_hints',
      'project_name',
      'library',
      'helpers',
      'templates',
      'json_validation',
      'shared_path',
    ]);
    for (const key of Object.keys(workflowYaml)) {
      if (!knownFields.has(key)) {
        warnings.push({
          path: [key],
          message: `Unknown field '${key}' - not in workflow schema. This may be a workflow-specific variable or a typo.`,
        });
      }
    }
    // web_bundle unknown fields
    if (workflowYaml.web_bundle && typeof workflowYaml.web_bundle === 'object') {
      const knownWebBundleFields = new Set([
        'name',
        'description',
        'instructions',
        'web_bundle_files',
        'validation',
        'template',
        'existing_workflows',
      ]);
      for (const key of Object.keys(workflowYaml.web_bundle)) {
        if (!knownWebBundleFields.has(key)) {
          warnings.push({
            path: ['web_bundle', key],
            message: `Unknown field 'web_bundle.${key}' - not in web_bundle schema. This may be a custom field or a typo.`,
          });
        }
      }
    }
    // input_file_patterns unknown fields
    if (workflowYaml.input_file_patterns && typeof workflowYaml.input_file_patterns === 'object') {
      const knownPatternFields = new Set([
        'description',
        'whole',
        'sharded',
        'sharded_index',
        'sharded_single',
        'load_strategy',
        'pattern',
      ]);
      for (const [patternName, pattern] of Object.entries(workflowYaml.input_file_patterns)) {
        if (typeof pattern === 'object' && pattern !== null) {
          for (const key of Object.keys(pattern)) {
            if (!knownPatternFields.has(key)) {
              warnings.push({
                path: ['input_file_patterns', patternName, key],
                message: `Unknown field 'input_file_patterns.${patternName}.${key}' - not in pattern schema. This may be a typo.`,
              });
            }
          }
        }
      }
    }
  }
  return warnings;
}

/**
 * Recursively validate variable references in all string values.
 *
 * @param {any} data - Data to validate
 * @param {Array} path - Current path
 * @param {import('zod').RefinementCtx} ctx - Zod context
 */
function validateVariableReferences(data, path, ctx) {
  if (typeof data === 'string') {
    validateStringReferences(data, path, ctx);
    return;
  }

  if (Array.isArray(data)) {
    for (const [index, item] of data.entries()) {
      validateVariableReferences(item, [...path, index], ctx);
    }
    return;
  }

  if (typeof data === 'object' && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      validateVariableReferences(value, [...path, key], ctx);
    }
  }
}

/**
 * Validate variable references in a single string value.
 */
function validateStringReferences(str, path, ctx) {
  // Check for unclosed braces
  const openBraces = (str.match(/\{/g) || []).length;
  const closeBraces = (str.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    ctx.addIssue({
      code: 'custom',
      path,
      message: `Malformed variable reference: unclosed braces (${openBraces} open, ${closeBraces} close)`,
    });
    return;
  }

  // Extract and validate path placeholders: {placeholder}
  const pathPlaceholderMatches = str.matchAll(/\{([a-z][a-z0-9_-]*)\}/g);
  for (const match of pathPlaceholderMatches) {
    const placeholder = match[1];
    // Skip config_source as it's a special keyword
    if (placeholder === 'config_source') continue;

    if (!KNOWN_PATH_PLACEHOLDERS.includes(placeholder)) {
      ctx.addIssue({
        code: 'custom',
        path,
        message: `Unknown path placeholder: {${placeholder}} - possible typo? Known placeholders: ${KNOWN_PATH_PLACEHOLDERS.slice(0, 5).join(', ')}...`,
      });
    }
  }

  // Extract and validate config variables: {config_source}:variable
  const configMatches = str.matchAll(/\{config_source\}:([a-z][a-z0-9_]*)/g);
  for (const match of configMatches) {
    const variable = match[1];
    if (!KNOWN_CONFIG_VARIABLES.includes(variable)) {
      ctx.addIssue({
        code: 'custom',
        path,
        message: `Unknown config variable: {config_source}:${variable} - possible typo? Known variables: ${KNOWN_CONFIG_VARIABLES.slice(0, 5).join(', ')}...`,
      });
    }
  }

  // Extract and validate template variables: {{variable}}
  const templateMatches = str.matchAll(/\{\{([a-z][a-z0-9_]*)\}\}/g);
  for (const match of templateMatches) {
    const variable = match[1];
    if (!KNOWN_TEMPLATE_VARIABLES.includes(variable)) {
      ctx.addIssue({
        code: 'custom',
        path,
        message: `Unknown template variable: {{${variable}}} - possible typo? Known variables: ${KNOWN_TEMPLATE_VARIABLES.slice(0, 5).join(', ')}...`,
      });
    }
  }

  // Check for malformed config_source references (missing colon)
  if (str.includes('{config_source}') && !/\{config_source\}:[a-z]/.test(str)) {
    const malformedMatch = str.match(/\{config_source\}([^:]|$)/);
    if (malformedMatch) {
      ctx.addIssue({
        code: 'custom',
        path,
        message: 'Malformed config reference: {config_source} must be followed by :variable_name',
      });
    }
  }
}

// Primitive validators -----------------------------------------------------

/**
 * Create a validator for non-empty strings.
 * @param {string} label Field label for error messages.
 */
function createNonEmptyString(label) {
  return z.string().refine((value) => value.trim().length > 0, {
    message: `${label} must be a non-empty string`,
  });
}

/**
 * Create a validator for kebab-case strings.
 * @param {string} label Field label for error messages.
 */
function createKebabCaseString(label) {
  return z.string().refine(
    (value) => {
      const trimmed = value.trim();
      return trimmed.length > 0 && KEBAB_CASE_PATTERN.test(trimmed);
    },
    {
      message: `${label} must be kebab-case (lowercase words separated by hyphen)`,
    },
  );
}
