// Zod schema definition for module.yaml files
const { z } = require('zod');

// Pattern for module code: kebab-case, 2-20 characters, starts with letter
const MODULE_CODE_PATTERN = /^[a-z][a-z0-9-]{1,19}$/;

// Public API ---------------------------------------------------------------

/**
 * Validate a module YAML payload against the schema.
 *
 * @param {string} filePath Path to the module file (used to detect core vs non-core modules).
 * @param {unknown} moduleYaml Parsed YAML content.
 * @returns {import('zod').SafeParseReturnType<unknown, unknown>} SafeParse result.
 */
function validateModuleFile(filePath, moduleYaml) {
  const isCoreModule = typeof filePath === 'string' && filePath.replaceAll('\\', '/').includes('src/core/');
  const schema = moduleSchema({ isCoreModule });
  return schema.safeParse(moduleYaml);
}

module.exports = { validateModuleFile };

// Internal helpers ---------------------------------------------------------

/**
 * Build the Zod schema for validating a module.yaml file.
 * @param {{isCoreModule?: boolean}} options - Options for schema validation.
 * @returns {import('zod').ZodSchema} Configured Zod schema instance.
 */
function moduleSchema(options) {
  const { isCoreModule = false } = options ?? {};
  return z
    .object({
      // Required fields
      code: z.string().regex(MODULE_CODE_PATTERN, {
        message: 'module.code must be kebab-case, 2-20 characters, starting with a letter',
      }),
      name: createNonEmptyString('module.name'),
      header: createNonEmptyString('module.header'),
      subheader: createNonEmptyString('module.subheader'),
      // default_selected is optional for core module, required for non-core modules
      default_selected: z.boolean().optional(),

      // Optional fields
      type: createNonEmptyString('module.type').optional(),
      global: z.boolean().optional(),
    })
    .passthrough()
    .superRefine((value, ctx) => {
      // Enforce default_selected for non-core modules
      if (!isCoreModule && !('default_selected' in value)) {
        ctx.addIssue({
          code: 'custom',
          path: ['default_selected'],
          message: 'module.default_selected is required for non-core modules',
        });
      }

      // Validate any additional keys as variable definitions
      const reservedKeys = new Set(['code', 'name', 'header', 'subheader', 'default_selected', 'type', 'global']);

      for (const key of Object.keys(value)) {
        if (reservedKeys.has(key)) {
          continue;
        }

        const variableValue = value[key];

        // Skip if null/undefined
        if (variableValue === null || variableValue === undefined) {
          continue;
        }

        // Validate variable definition
        const variableResult = validateVariableDefinition(key, variableValue);
        if (!variableResult.valid) {
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: variableResult.error,
          });
        }
      }
    });
}

/**
 * Validate a variable definition object.
 * @param {string} variableName The name of the variable.
 * @param {unknown} variableValue The variable definition value.
 * @returns {{ valid: boolean, error?: string }}
 */
function validateVariableDefinition(variableName, variableValue) {
  // If it's not an object, it's invalid
  if (typeof variableValue !== 'object' || variableValue === null) {
    return { valid: false, error: `${variableName} must be an object with variable definition properties` };
  }

  const hasInherit = 'inherit' in variableValue;
  const hasPrompt = 'prompt' in variableValue;

  // Enforce mutual exclusivity: inherit and prompt cannot coexist
  if (hasInherit && hasPrompt) {
    return { valid: false, error: `${variableName} must not define both 'inherit' and 'prompt'` };
  }

  // Check for inherit alias - if present, it's the only required field
  if (hasInherit) {
    if (typeof variableValue.inherit !== 'string' || variableValue.inherit.trim().length === 0) {
      return { valid: false, error: `${variableName}.inherit must be a non-empty string` };
    }
    return { valid: true };
  }

  // Otherwise, prompt is required
  if (!hasPrompt) {
    return { valid: false, error: `${variableName} must have a 'prompt' or 'inherit' field` };
  }

  // Validate prompt: string or array of strings
  const prompt = variableValue.prompt;
  if (typeof prompt === 'string') {
    if (prompt.trim().length === 0) {
      return { valid: false, error: `${variableName}.prompt must be a non-empty string` };
    }
  } else if (Array.isArray(prompt)) {
    if (prompt.length === 0) {
      return { valid: false, error: `${variableName}.prompt array must not be empty` };
    }
    for (const [index, promptItem] of prompt.entries()) {
      if (typeof promptItem !== 'string' || promptItem.trim().length === 0) {
        return { valid: false, error: `${variableName}.prompt[${index}] must be a non-empty string` };
      }
    }
  } else {
    return { valid: false, error: `${variableName}.prompt must be a string or array of strings` };
  }

  // Enforce mutual exclusivity: single-select and multi-select cannot coexist
  const hasSingle = 'single-select' in variableValue;
  const hasMulti = 'multi-select' in variableValue;
  if (hasSingle && hasMulti) {
    return { valid: false, error: `${variableName} must not define both 'single-select' and 'multi-select'` };
  }

  // Validate optional single-select
  if (hasSingle) {
    const selectResult = validateSelectOptions(variableName, 'single-select', variableValue['single-select']);
    if (!selectResult.valid) {
      return selectResult;
    }
  }

  // Validate optional multi-select
  if (hasMulti) {
    const selectResult = validateSelectOptions(variableName, 'multi-select', variableValue['multi-select']);
    if (!selectResult.valid) {
      return selectResult;
    }
  }

  // Validate optional required field
  if ('required' in variableValue && typeof variableValue.required !== 'boolean') {
    return { valid: false, error: `${variableName}.required must be a boolean` };
  }

  // Validate optional result field
  if ('result' in variableValue && (typeof variableValue.result !== 'string' || variableValue.result.trim().length === 0)) {
    return { valid: false, error: `${variableName}.result must be a non-empty string` };
  }

  return { valid: true };
}

/**
 * Validate single-select or multi-select options array.
 * @param {string} variableName The variable name for error messages.
 * @param {string} selectType Either 'single-select' or 'multi-select'.
 * @param {unknown} options The options array to validate.
 * @returns {{ valid: boolean, error?: string }}
 */
function validateSelectOptions(variableName, selectType, options) {
  if (!Array.isArray(options)) {
    return { valid: false, error: `${variableName}.${selectType} must be an array` };
  }

  if (options.length === 0) {
    return { valid: false, error: `${variableName}.${selectType} must not be empty` };
  }

  for (const [index, option] of options.entries()) {
    if (typeof option !== 'object' || option === null) {
      return { valid: false, error: `${variableName}.${selectType}[${index}] must be an object` };
    }
    if (!('value' in option) || typeof option.value !== 'string') {
      return { valid: false, error: `${variableName}.${selectType}[${index}].value must be a string` };
    }
    if (!('label' in option) || typeof option.label !== 'string') {
      return { valid: false, error: `${variableName}.${selectType}[${index}].label must be a string` };
    }
  }

  return { valid: true };
}

// Primitive validators -----------------------------------------------------

function createNonEmptyString(label) {
  return z.string().refine((value) => value.trim().length > 0, {
    message: `${label} must be a non-empty string`,
  });
}
