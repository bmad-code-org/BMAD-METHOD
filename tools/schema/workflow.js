// Zod schema definition for workflow.yaml files
const { z } = require('zod');

// Load strategy enum — the three recognized values across all existing workflow files
const loadStrategyEnum = z.enum(['FULL_LOAD', 'SELECTIVE_LOAD', 'INDEX_GUIDED']);

// Schema for individual input_file_patterns entries
const inputFilePatternEntrySchema = z
  .object({
    load_strategy: loadStrategyEnum,
    description: z.string().optional(),
    whole: z.string().optional(),
    sharded: z.string().optional(),
    sharded_index: z.string().optional(),
    sharded_single: z.string().optional(),
    pattern: z.string().optional(),
  })
  .passthrough();

// Schema for execution_hints
const executionHintsSchema = z
  .object({
    interactive: z.boolean().optional(),
    autonomous: z.boolean().optional(),
    iterative: z.boolean().optional(),
  })
  .passthrough();

// Main workflow schema
const workflowSchema = z
  .object({
    // Required fields (all 13 workflow.yaml files have these)
    name: z.string().min(1),
    description: z.string().min(1),
    author: z.string().min(1),
    standalone: z.boolean(),
    web_bundle: z.boolean(),

    // Structured optional fields
    template: z.union([z.string(), z.literal(false)]).optional(),
    input_file_patterns: z.record(z.string(), inputFilePatternEntrySchema).optional(),
    execution_hints: executionHintsSchema.optional(),
    tags: z.array(z.string()).optional(),
    required_tools: z.array(z.string()).optional(),
    variables: z.record(z.string(), z.string()).optional(),
    instructions: z.string().optional(),
  })
  .passthrough()
  .refine(
    (data) => {
      if (typeof data.instructions === 'string') {
        return data.instructions.endsWith('.md') || data.instructions.endsWith('.xml');
      }
      return true;
    },
    {
      message: 'Instructions file must end with .md or .xml',
      path: ['instructions'],
    },
  );

/**
 * Validate a workflow YAML payload against the schema.
 * Exposed as the single public entry point, so callers do not reach into schema internals.
 *
 * @param {string} filePath Path to the workflow file.
 * @param {unknown} workflowYaml Parsed YAML content.
 * @returns {import('zod').SafeParseReturnType<unknown, unknown>} SafeParse result.
 */
function validateWorkflowFile(filePath, workflowYaml) {
  return workflowSchema.safeParse(workflowYaml);
}

module.exports = { validateWorkflowFile };
