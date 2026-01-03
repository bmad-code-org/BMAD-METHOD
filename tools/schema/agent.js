// Zod schema definition for *.agent.yaml files
const assert = require('node:assert');
const { z } = require('zod');

const COMMAND_TARGET_KEYS = ['workflow', 'validate-workflow', 'exec', 'action', 'tmpl', 'data'];
const TRIGGER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMPOUND_TRIGGER_PATTERN = /^([A-Z]{1,3}) or fuzzy match on ([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/**
 * Derive the expected shortcut from a kebab-case trigger.
 * - Single word: first letter (e.g., "help" → "H")
 * - Multi-word: first letter of first two words (e.g., "tech-spec" → "TS")
 * @param {string} kebabTrigger The kebab-case trigger name.
 * @returns {string} The expected uppercase shortcut.
 */
function deriveShortcutFromKebab(kebabTrigger) {
  const words = kebabTrigger.split('-');
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Parse and validate a compound trigger string.
 * Format: "<SHORTCUT> or fuzzy match on <kebab-case>"
 * @param {string} triggerValue The trigger string to parse.
 * @returns {{ valid: boolean, shortcut?: string, kebabTrigger?: string, error?: string }}
 */
function parseCompoundTrigger(triggerValue) {
  const match = COMPOUND_TRIGGER_PATTERN.exec(triggerValue);
  if (!match) {
    return { valid: false, error: 'invalid compound trigger format' };
  }

  const [, shortcut, kebabTrigger] = match;

  return { valid: true, shortcut, kebabTrigger };
}

// Public API ---------------------------------------------------------------

/**
 * Validate an agent YAML payload against the schema derived from its file location.
 * Exposed as the single public entry point, so callers do not reach into schema internals.
 *
 * @param {string} filePath Path to the agent file (used to infer module scope).
 * @param {unknown} agentYaml Parsed YAML content.
 * @returns {import('zod').SafeParseReturnType<unknown, unknown>} SafeParse result.
 */
function validateAgentFile(filePath, agentYaml) {
  const expectedModule = deriveModuleFromPath(filePath);
  const schema = agentSchema({ module: expectedModule });
  return schema.safeParse(agentYaml);
}

module.exports = { validateAgentFile };

// Internal helpers ---------------------------------------------------------

/**
 * Build a Zod schema for validating a single agent definition.
 * The schema is generated per call so module-scoped agents can pass their expected
 * module slug while core agents leave it undefined.
 *
 * @param {Object} [options]
 * @param {string|null|undefined} [options.module] Module slug for module agents; omit or null for core agents.
 * @returns {import('zod').ZodSchema} Configured Zod schema instance.
 */
function agentSchema(options = {}) {
  const expectedModule = normalizeModuleOption(options.module);

  return (
    z
      .object({
        agent: buildAgentSchema(expectedModule),
      })
      .strict()
      // Refinement: enforce trigger format and uniqueness rules after structural checks.
      .superRefine((value, ctx) => {
        const seenTriggers = new Set();

        let index = 0;
        for (const item of value.agent.menu) {
          // Handle legacy format with trigger field
          if (item.trigger) {
            const triggerValue = item.trigger;
            let canonicalTrigger = triggerValue;

            // Check if it's a compound trigger (contains " or ")
            if (triggerValue.includes(' or ')) {
              const result = parseCompoundTrigger(triggerValue);
              if (!result.valid) {
                ctx.addIssue({
                  code: 'custom',
                  path: ['agent', 'menu', index, 'trigger'],
                  message: `agent.menu[].trigger compound format error: ${result.error}`,
                });
                return;
              }

              // Validate that shortcut matches description brackets
              const descriptionMatch = item.description?.match(/^\[([A-Z]{1,3})\]/);
              if (!descriptionMatch) {
                ctx.addIssue({
                  code: 'custom',
                  path: ['agent', 'menu', index, 'description'],
                  message: `agent.menu[].description must start with [SHORTCUT] where SHORTCUT matches the trigger shortcut "${result.shortcut}"`,
                });
                return;
              }

              const descriptionShortcut = descriptionMatch[1];
              if (descriptionShortcut !== result.shortcut) {
                ctx.addIssue({
                  code: 'custom',
                  path: ['agent', 'menu', index, 'description'],
                  message: `agent.menu[].description shortcut "[${descriptionShortcut}]" must match trigger shortcut "${result.shortcut}"`,
                });
                return;
              }

              canonicalTrigger = result.kebabTrigger;
            } else if (!TRIGGER_PATTERN.test(triggerValue)) {
              ctx.addIssue({
                code: 'custom',
                path: ['agent', 'menu', index, 'trigger'],
                message: 'agent.menu[].trigger must be kebab-case (lowercase words separated by hyphen)',
              });
              return;
            }

            if (seenTriggers.has(canonicalTrigger)) {
              ctx.addIssue({
                code: 'custom',
                path: ['agent', 'menu', index, 'trigger'],
                message: `agent.menu[].trigger duplicates "${canonicalTrigger}" within the same agent`,
              });
              return;
            }

            seenTriggers.add(canonicalTrigger);
          }
          // Handle multi format with triggers array (new format)
          else if (item.triggers && Array.isArray(item.triggers)) {
            for (const [triggerIndex, triggerItem] of item.triggers.entries()) {
              let triggerName = null;

              // Extract trigger name from all three formats
              if (triggerItem.trigger) {
                // Format 1: Simple flat format with trigger field
                triggerName = triggerItem.trigger;
              } else {
                // Format 2a or 2b: Object-key format
                const keys = Object.keys(triggerItem);
                if (keys.length === 1 && keys[0] !== 'trigger') {
                  triggerName = keys[0];
                }
              }

              if (triggerName) {
                if (!TRIGGER_PATTERN.test(triggerName)) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['agent', 'menu', index, 'triggers', triggerIndex],
                    message: `agent.menu[].triggers[] must be kebab-case (lowercase words separated by hyphen) - got "${triggerName}"`,
                  });
                  return;
                }

                if (seenTriggers.has(triggerName)) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['agent', 'menu', index, 'triggers', triggerIndex],
                    message: `agent.menu[].triggers[] duplicates "${triggerName}" within the same agent`,
                  });
                  return;
                }

                seenTriggers.add(triggerName);
              }
            }
          }

          index += 1;
        }
      })
      // Refinement: suggest conversational_knowledge when discussion is true
      .superRefine((value, ctx) => {
        if (value.agent.discussion === true && !value.agent.conversational_knowledge) {
          ctx.addIssue({
            code: 'custom',
            path: ['agent', 'conversational_knowledge'],
            message: 'It is recommended to include conversational_knowledge when discussion is true',
          });
        }
      })
  );
}

/**
 * Assemble the full agent schema using the module expectation provided by the caller.
 * @param {string|null} expectedModule Trimmed module slug or null for core agents.
 */
function buildAgentSchema(expectedModule) {
  return z
    .object({
      metadata: buildMetadataSchema(expectedModule),
      persona: buildPersonaSchema(),
      critical_actions: z.array(createNonEmptyString('agent.critical_actions[]')).optional(),
      menu: z.array(buildMenuItemSchema()).min(1, { message: 'agent.menu must include at least one entry' }),
      prompts: z.array(buildPromptSchema()).optional(),
      webskip: z.boolean().optional(),
      discussion: z.boolean().optional(),
      conversational_knowledge: z.array(z.object({}).passthrough()).min(1).optional(),
    })
    .strict();
}

/**
 * Validate metadata shape.
 * @param {string|null} expectedModule Trimmed module slug or null when core agent metadata is expected.
 * Note: Module field is optional and can be any value - no validation against path.
 */
function buildMetadataSchema(expectedModule) {
  const schemaShape = {
    id: createNonEmptyString('agent.metadata.id'),
    name: createNonEmptyString('agent.metadata.name'),
    title: createNonEmptyString('agent.metadata.title'),
    icon: createNonEmptyString('agent.metadata.icon'),
    module: createNonEmptyString('agent.metadata.module').optional(),
    hasSidecar: z.boolean(),
  };

  return z.object(schemaShape).strict();
}

function buildPersonaSchema() {
  return z
    .object({
      role: createNonEmptyString('agent.persona.role'),
      identity: createNonEmptyString('agent.persona.identity'),
      communication_style: createNonEmptyString('agent.persona.communication_style'),
      principles: z.union([
        createNonEmptyString('agent.persona.principles'),
        z
          .array(createNonEmptyString('agent.persona.principles[]'))
          .min(1, { message: 'agent.persona.principles must include at least one entry' }),
      ]),
    })
    .strict();
}

function buildPromptSchema() {
  return z
    .object({
      id: createNonEmptyString('agent.prompts[].id'),
      content: z.string().refine((value) => value.trim().length > 0, {
        message: 'agent.prompts[].content must be a non-empty string',
      }),
      description: createNonEmptyString('agent.prompts[].description').optional(),
    })
    .strict();
}

/**
 * Schema for individual menu entries ensuring they are actionable.
 * Supports both legacy format and new multi format.
 */
function buildMenuItemSchema() {
  // Legacy menu item format
  const legacyMenuItemSchema = z
    .object({
      trigger: createNonEmptyString('agent.menu[].trigger'),
      description: createNonEmptyString('agent.menu[].description'),
      workflow: createNonEmptyString('agent.menu[].workflow').optional(),
      'workflow-install': createNonEmptyString('agent.menu[].workflow-install').optional(),
      'validate-workflow': createNonEmptyString('agent.menu[].validate-workflow').optional(),
      exec: createNonEmptyString('agent.menu[].exec').optional(),
      action: createNonEmptyString('agent.menu[].action').optional(),
      tmpl: createNonEmptyString('agent.menu[].tmpl').optional(),
      data: z.string().optional(),
      checklist: createNonEmptyString('agent.menu[].checklist').optional(),
      document: createNonEmptyString('agent.menu[].document').optional(),
      'ide-only': z.boolean().optional(),
      'web-only': z.boolean().optional(),
      discussion: z.boolean().optional(),
    })
    .strict()
    .superRefine((value, ctx) => {
      const hasCommandTarget = COMMAND_TARGET_KEYS.some((key) => {
        const commandValue = value[key];
        return typeof commandValue === 'string' && commandValue.trim().length > 0;
      });

      if (!hasCommandTarget) {
        ctx.addIssue({
          code: 'custom',
          message: 'agent.menu[] entries must include at least one command target field',
        });
      }
    });

  // Multi menu item format
  const multiMenuItemSchema = z
    .object({
      multi: createNonEmptyString('agent.menu[].multi'),
      triggers: z
        .array(
          z.union([
            // Format 1: Simple flat format (has trigger field)
            z
              .object({
                trigger: z.string(),
                input: createNonEmptyString('agent.menu[].triggers[].input'),
                route: createNonEmptyString('agent.menu[].triggers[].route').optional(),
                action: createNonEmptyString('agent.menu[].triggers[].action').optional(),
                data: z.string().optional(),
                type: z.enum(['exec', 'action', 'workflow']).optional(),
              })
              .strict()
              .refine((data) => data.trigger, { message: 'Must have trigger field' })
              .superRefine((value, ctx) => {
                // Must have either route or action (or both)
                if (!value.route && !value.action) {
                  ctx.addIssue({
                    code: 'custom',
                    message: 'agent.menu[].triggers[] must have either route or action (or both)',
                  });
                }
              }),
            // Format 2a: Object with array format (like bmad-builder.agent.yaml)
            z
              .object({})
              .passthrough()
              .refine(
                (value) => {
                  const keys = Object.keys(value);
                  if (keys.length !== 1) return false;
                  const triggerItems = value[keys[0]];
                  return Array.isArray(triggerItems);
                },
                { message: 'Must be object with single key pointing to array' },
              )
              .superRefine((value, ctx) => {
                const triggerName = Object.keys(value)[0];
                const triggerItems = value[triggerName];

                if (!Array.isArray(triggerItems)) {
                  ctx.addIssue({
                    code: 'custom',
                    message: `Trigger "${triggerName}" must be an array of items`,
                  });
                  return;
                }

                // Check required fields in the array
                const hasInput = triggerItems.some((item) => 'input' in item);
                const hasRouteOrAction = triggerItems.some((item) => 'route' in item || 'action' in item);

                if (!hasInput) {
                  ctx.addIssue({
                    code: 'custom',
                    message: `Trigger "${triggerName}" must have an input field`,
                  });
                }

                if (!hasRouteOrAction) {
                  ctx.addIssue({
                    code: 'custom',
                    message: `Trigger "${triggerName}" must have a route or action field`,
                  });
                }
              }),
            // Format 2b: Object with direct fields (like analyst.agent.yaml)
            z
              .object({})
              .passthrough()
              .refine(
                (value) => {
                  const keys = Object.keys(value);
                  if (keys.length !== 1) return false;
                  const triggerFields = value[keys[0]];
                  return !Array.isArray(triggerFields) && typeof triggerFields === 'object';
                },
                { message: 'Must be object with single key pointing to object' },
              )
              .superRefine((value, ctx) => {
                const triggerName = Object.keys(value)[0];
                const triggerFields = value[triggerName];

                // Check required fields
                if (!triggerFields.input || typeof triggerFields.input !== 'string') {
                  ctx.addIssue({
                    code: 'custom',
                    message: `Trigger "${triggerName}" must have an input field`,
                  });
                }

                if (!triggerFields.route && !triggerFields.action) {
                  ctx.addIssue({
                    code: 'custom',
                    message: `Trigger "${triggerName}" must have a route or action field`,
                  });
                }
              }),
          ]),
        )
        .min(1, { message: 'agent.menu[].triggers must have at least one trigger' }),
      discussion: z.boolean().optional(),
    })
    .strict()
    .superRefine((value, ctx) => {
      // Check for duplicate trigger names
      const seenTriggers = new Set();
      for (const [index, triggerItem] of value.triggers.entries()) {
        let triggerName = null;

        // Extract trigger name from either format
        if (triggerItem.trigger) {
          // Format 1
          triggerName = triggerItem.trigger;
        } else {
          // Format 2
          const keys = Object.keys(triggerItem);
          if (keys.length === 1) {
            triggerName = keys[0];
          }
        }

        if (triggerName) {
          if (seenTriggers.has(triggerName)) {
            ctx.addIssue({
              code: 'custom',
              path: ['agent', 'menu', 'triggers', index],
              message: `Trigger name "${triggerName}" is duplicated`,
            });
          }
          seenTriggers.add(triggerName);

          // Validate trigger name format
          if (!TRIGGER_PATTERN.test(triggerName)) {
            ctx.addIssue({
              code: 'custom',
              path: ['agent', 'menu', 'triggers', index],
              message: `Trigger name "${triggerName}" must be kebab-case (lowercase words separated by hyphen)`,
            });
          }
        }
      }
    });

  return z.union([legacyMenuItemSchema, multiMenuItemSchema]);
}

/**
 * Derive the expected module slug from a file path residing under src/modules/<module>/agents/.
 * @param {string} filePath Absolute or relative agent path.
 * @returns {string|null} Module slug if identifiable, otherwise null.
 */
function deriveModuleFromPath(filePath) {
  assert(filePath, 'validateAgentFile expects filePath to be provided');
  assert(typeof filePath === 'string', 'validateAgentFile expects filePath to be a string');
  assert(filePath.startsWith('src/'), 'validateAgentFile expects filePath to start with "src/"');

  const marker = 'src/modules/';
  if (!filePath.startsWith(marker)) {
    return null;
  }

  const remainder = filePath.slice(marker.length);
  const slashIndex = remainder.indexOf('/');
  return slashIndex === -1 ? null : remainder.slice(0, slashIndex);
}

function normalizeModuleOption(moduleOption) {
  if (typeof moduleOption !== 'string') {
    return null;
  }

  const trimmed = moduleOption.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// Primitive validators -----------------------------------------------------

function createNonEmptyString(label) {
  return z.string().refine((value) => value.trim().length > 0, {
    message: `${label} must be a non-empty string`,
  });
}
