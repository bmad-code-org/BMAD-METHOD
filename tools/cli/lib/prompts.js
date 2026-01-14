/**
 * @clack/prompts wrapper for BMAD CLI
 *
 * This module provides a unified interface for CLI prompts using @clack/prompts.
 * It replaces Inquirer.js to fix Windows arrow key navigation issues (libuv #852).
 *
 * @module prompts
 */

let _clack = null;

/**
 * Lazy-load @clack/prompts (ESM module)
 * @returns {Promise<Object>} The clack prompts module
 */
async function getClack() {
  if (!_clack) {
    _clack = await import('@clack/prompts');
  }
  return _clack;
}

/**
 * Handle user cancellation gracefully
 * @param {any} value - The value to check
 * @param {string} [message='Operation cancelled'] - Message to display
 * @returns {boolean} True if cancelled
 */
async function handleCancel(value, message = 'Operation cancelled') {
  const clack = await getClack();
  if (clack.isCancel(value)) {
    clack.cancel(message);
    process.exit(0);
  }
  return false;
}

/**
 * Display intro message
 * @param {string} message - The intro message
 */
async function intro(message) {
  const clack = await getClack();
  clack.intro(message);
}

/**
 * Display outro message
 * @param {string} message - The outro message
 */
async function outro(message) {
  const clack = await getClack();
  clack.outro(message);
}

/**
 * Display a note/info box
 * @param {string} message - The note content
 * @param {string} [title] - Optional title
 */
async function note(message, title) {
  const clack = await getClack();
  clack.note(message, title);
}

/**
 * Display a spinner for async operations
 * @returns {Object} Spinner controller with start, stop, message methods
 */
async function spinner() {
  const clack = await getClack();
  return clack.spinner();
}

/**
 * Single-select prompt (replaces Inquirer 'list' type)
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {Array} options.choices - Array of choices [{name, value, hint?}]
 * @param {any} [options.default] - Default selected value
 * @returns {Promise<any>} Selected value
 */
async function select(options) {
  const clack = await getClack();

  // Convert Inquirer-style choices to clack format
  // Handle both object choices {name, value, hint} and primitive choices (string/number)
  const clackOptions = options.choices
    .filter((c) => c.type !== 'separator') // Skip separators for now
    .map((choice) => {
      if (typeof choice === 'string' || typeof choice === 'number') {
        return { value: choice, label: String(choice) };
      }
      return {
        value: choice.value === undefined ? choice.name : choice.value,
        label: choice.name || choice.label || String(choice.value),
        hint: choice.hint || choice.description,
      };
    });

  // Find initial value
  let initialValue;
  if (options.default !== undefined) {
    initialValue = options.default;
  }

  const result = await clack.select({
    message: options.message,
    options: clackOptions,
    initialValue,
  });

  await handleCancel(result);
  return result;
}

/**
 * Multi-select prompt (replaces Inquirer 'checkbox' type)
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {Array} options.choices - Array of choices [{name, value, checked?, hint?}]
 * @param {boolean} [options.required=false] - Whether at least one must be selected
 * @returns {Promise<Array>} Array of selected values
 */
async function multiselect(options) {
  const clack = await getClack();

  // Support both clack-native (options) and Inquirer-style (choices) APIs
  let clackOptions;
  let initialValues;

  if (options.options) {
    // Native clack format: options with label/value
    clackOptions = options.options;
    initialValues = options.initialValues || [];
  } else {
    // Convert Inquirer-style choices to clack format
    // Handle both object choices {name, value, hint} and primitive choices (string/number)
    clackOptions = options.choices
      .filter((c) => c.type !== 'separator') // Skip separators
      .map((choice) => {
        if (typeof choice === 'string' || typeof choice === 'number') {
          return { value: choice, label: String(choice) };
        }
        return {
          value: choice.value === undefined ? choice.name : choice.value,
          label: choice.name || choice.label || String(choice.value),
          hint: choice.hint || choice.description,
        };
      });

    // Find initial values (pre-checked items)
    initialValues = options.choices
      .filter((c) => c.checked && c.type !== 'separator')
      .map((c) => (c.value === undefined ? c.name : c.value));
  }

  const result = await clack.multiselect({
    message: options.message,
    options: clackOptions,
    initialValues: initialValues.length > 0 ? initialValues : undefined,
    required: options.required || false,
  });

  await handleCancel(result);
  return result;
}

/**
 * Grouped multi-select prompt for categorized options
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {Object} options.options - Object mapping group names to arrays of choices
 * @param {Array} [options.initialValues] - Array of initially selected values
 * @param {boolean} [options.required=false] - Whether at least one must be selected
 * @param {boolean} [options.selectableGroups=false] - Whether groups can be selected as a whole
 * @returns {Promise<Array>} Array of selected values
 */
async function groupMultiselect(options) {
  const clack = await getClack();

  const result = await clack.groupMultiselect({
    message: options.message,
    options: options.options,
    initialValues: options.initialValues,
    required: options.required || false,
  });

  await handleCancel(result);
  return result;
}

/**
 * Confirm prompt (replaces Inquirer 'confirm' type)
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {boolean} [options.default=true] - Default value
 * @returns {Promise<boolean>} User's answer
 */
async function confirm(options) {
  const clack = await getClack();

  const result = await clack.confirm({
    message: options.message,
    initialValue: options.default === undefined ? true : options.default,
  });

  await handleCancel(result);
  return result;
}

/**
 * Text input prompt (replaces Inquirer 'input' type)
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {string} [options.default] - Default value
 * @param {string} [options.placeholder] - Placeholder text (defaults to options.default if not provided)
 * @param {Function} [options.validate] - Validation function
 * @returns {Promise<string>} User's input
 */
async function text(options) {
  const clack = await getClack();

  // Use default as placeholder if placeholder not explicitly provided
  // This shows the default value as grayed-out hint text
  const placeholder = options.placeholder === undefined ? options.default : options.placeholder;

  const result = await clack.text({
    message: options.message,
    defaultValue: options.default,
    placeholder: typeof placeholder === 'string' ? placeholder : undefined,
    validate: options.validate,
  });

  await handleCancel(result);
  return result;
}

/**
 * Password input prompt (replaces Inquirer 'password' type)
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {Function} [options.validate] - Validation function
 * @returns {Promise<string>} User's input
 */
async function password(options) {
  const clack = await getClack();

  const result = await clack.password({
    message: options.message,
    validate: options.validate,
  });

  await handleCancel(result);
  return result;
}

/**
 * Group multiple prompts together
 * @param {Object} prompts - Object of prompt functions
 * @param {Object} [options] - Group options
 * @returns {Promise<Object>} Object with all answers
 */
async function group(prompts, options = {}) {
  const clack = await getClack();

  const result = await clack.group(prompts, {
    onCancel: () => {
      clack.cancel('Operation cancelled');
      process.exit(0);
    },
    ...options,
  });

  return result;
}

/**
 * Run tasks with spinner feedback
 * @param {Array} tasks - Array of task objects [{title, task, enabled?}]
 * @returns {Promise<void>}
 */
async function tasks(taskList) {
  const clack = await getClack();
  await clack.tasks(taskList);
}

/**
 * Log messages with styling
 */
const log = {
  async info(message) {
    const clack = await getClack();
    clack.log.info(message);
  },
  async success(message) {
    const clack = await getClack();
    clack.log.success(message);
  },
  async warn(message) {
    const clack = await getClack();
    clack.log.warn(message);
  },
  async error(message) {
    const clack = await getClack();
    clack.log.error(message);
  },
  async message(message) {
    const clack = await getClack();
    clack.log.message(message);
  },
  async step(message) {
    const clack = await getClack();
    clack.log.step(message);
  },
};

/**
 * Execute an array of Inquirer-style questions using @clack/prompts
 * This provides compatibility with dynamic question arrays
 * @param {Array} questions - Array of Inquirer-style question objects
 * @returns {Promise<Object>} Object with answers keyed by question name
 */
async function prompt(questions) {
  const answers = {};

  for (const question of questions) {
    const { type, name, message, choices, default: defaultValue, validate, when } = question;

    // Handle conditional questions via 'when' property
    if (when !== undefined) {
      const shouldAsk = typeof when === 'function' ? await when(answers) : when;
      if (!shouldAsk) continue;
    }

    let answer;

    switch (type) {
      case 'input': {
        // Note: @clack/prompts doesn't support async validation, so validate must be sync
        answer = await text({
          message,
          default: typeof defaultValue === 'function' ? defaultValue(answers) : defaultValue,
          validate: validate
            ? (val) => {
                const result = validate(val, answers);
                if (result instanceof Promise) {
                  throw new TypeError('Async validation is not supported by @clack/prompts. Please use synchronous validation.');
                }
                return result === true ? undefined : result;
              }
            : undefined,
        });
        break;
      }

      case 'confirm': {
        answer = await confirm({
          message,
          default: typeof defaultValue === 'function' ? defaultValue(answers) : defaultValue,
        });
        break;
      }

      case 'list': {
        answer = await select({
          message,
          choices: choices || [],
          default: typeof defaultValue === 'function' ? defaultValue(answers) : defaultValue,
        });
        break;
      }

      case 'checkbox': {
        answer = await multiselect({
          message,
          choices: choices || [],
          required: false,
        });
        break;
      }

      case 'password': {
        // Note: @clack/prompts doesn't support async validation, so validate must be sync
        answer = await password({
          message,
          validate: validate
            ? (val) => {
                const result = validate(val, answers);
                if (result instanceof Promise) {
                  throw new TypeError('Async validation is not supported by @clack/prompts. Please use synchronous validation.');
                }
                return result === true ? undefined : result;
              }
            : undefined,
        });
        break;
      }

      default: {
        // Default to text input for unknown types
        answer = await text({
          message,
          default: typeof defaultValue === 'function' ? defaultValue(answers) : defaultValue,
        });
      }
    }

    answers[name] = answer;
  }

  return answers;
}

module.exports = {
  getClack,
  handleCancel,
  intro,
  outro,
  note,
  spinner,
  select,
  multiselect,
  groupMultiselect,
  confirm,
  text,
  password,
  group,
  tasks,
  log,
  prompt,
};
