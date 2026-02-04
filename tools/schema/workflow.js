// Zod schema definition for workflow.yaml files
// STUB — implementation pending. All validations return failure.
// See: sprint/reference/mssci-12749-discovery.md for field inventory and validation rules.

/**
 * Validate a workflow YAML payload against the schema.
 * Exposed as the single public entry point, so callers do not reach into schema internals.
 *
 * @param {string} filePath Path to the workflow file.
 * @param {unknown} workflowYaml Parsed YAML content.
 * @returns {import('zod').SafeParseReturnType<unknown, unknown>} SafeParse result.
 */
function validateWorkflowFile(filePath, workflowYaml) {
  // TODO: Implement Zod schema validation
  // This stub returns failure so tests are in RED state.
  return {
    success: false,
    error: {
      issues: [
        {
          code: 'custom',
          message: 'Schema not yet implemented',
          path: [],
        },
      ],
    },
  };
}

module.exports = { validateWorkflowFile };
