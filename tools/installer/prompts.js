/**
 * @clack/prompts wrapper for BMAD CLI
 *
 * This module provides a unified interface for CLI prompts using @clack/prompts.
 * It replaces Inquirer.js to fix Windows arrow key navigation issues (libuv #852).
 *
 * @module prompts
 */

let _clack = null;
let _clackCore = null;
let _picocolors = null;
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

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
 * Lazy-load @clack/core (ESM module)
 * @returns {Promise<Object>} The clack core module
 */
async function getClackCore() {
  if (!_clackCore) {
    _clackCore = await import('@clack/core');
  }
  return _clackCore;
}

/**
 * Lazy-load picocolors
 * @returns {Promise<Object>} The picocolors module
 */
async function getPicocolors() {
  if (!_picocolors) {
    _picocolors = (await import('picocolors')).default;
  }
  return _picocolors;
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
 * Wraps @clack/prompts spinner with isSpinning state tracking
 * @returns {Object} Spinner controller with start, stop, message, error, cancel, clear, isSpinning
 */
async function spinner() {
  const clack = await getClack();
  const s = clack.spinner();
  let spinning = false;

  return {
    start: (msg) => {
      if (spinning) {
        s.message(msg);
      } else {
        spinning = true;
        s.start(msg);
      }
    },
    stop: (msg) => {
      if (spinning) {
        spinning = false;
        s.stop(msg);
      }
    },
    message: (msg) => {
      if (spinning) s.message(msg);
    },
    error: (msg) => {
      spinning = false;
      s.error(msg);
    },
    cancel: (msg) => {
      spinning = false;
      s.cancel(msg);
    },
    clear: () => {
      spinning = false;
      s.clear();
    },
    get isSpinning() {
      return spinning;
    },
    get isCancelled() {
      return s.isCancelled;
    },
  };
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
 * Default filter function for autocomplete - case-insensitive label matching
 * @param {string} search - Search string
 * @param {Object} option - Option object with label
 * @returns {boolean} Whether the option matches
 */
function defaultAutocompleteFilter(search, option) {
  const label = option.label ?? String(option.value ?? '');
  return label.toLowerCase().includes(search.toLowerCase());
}

/**
 * Autocomplete multi-select prompt with type-ahead filtering
 * Custom implementation that always shows "Space/Tab:" in the hint
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {Array} options.options - Array of choices [{label, value, hint?}]
 * @param {string} [options.placeholder] - Placeholder text for search input
 * @param {Array} [options.initialValues] - Array of initially selected values
 * @param {boolean} [options.required=false] - Whether at least one must be selected
 * @param {number} [options.maxItems=5] - Maximum visible items in scrollable list
 * @param {Function} [options.filter] - Custom filter function (search, option) => boolean
 * @param {Array} [options.lockedValues] - Values that are always selected and cannot be toggled off
 * @returns {Promise<Array>} Array of selected values
 */
async function autocompleteMultiselect(options) {
  const core = await getClackCore();
  const clack = await getClack();
  const color = await getPicocolors();

  const filterFn = options.filter ?? defaultAutocompleteFilter;
  const lockedSet = new Set(options.lockedValues || []);

  const prompt = new core.AutocompletePrompt({
    options: options.options,
    multiple: true,
    filter: filterFn,
    validate: () => {
      if (options.required && prompt.selectedValues.length === 0) {
        return 'Please select at least one item';
      }
    },
    initialValue: [...new Set([...(options.initialValues || []), ...(options.lockedValues || [])])],
    render() {
      const barColor = this.state === 'error' ? color.yellow : color.cyan;
      const bar = barColor(clack.S_BAR);
      const barEnd = barColor(clack.S_BAR_END);

      const title = `${color.gray(clack.S_BAR)}\n${clack.symbol(this.state)}  ${options.message}\n`;

      const userInput = this.userInput;
      const placeholder = options.placeholder || 'Type to search...';
      const hasPlaceholder = userInput === '' && placeholder !== undefined;

      // Show placeholder or user input with cursor
      const searchDisplay =
        this.isNavigating || hasPlaceholder ? color.dim(hasPlaceholder ? placeholder : userInput) : this.userInputWithCursor;

      const allOptions = this.options;
      const matchCount =
        this.filteredOptions.length === allOptions.length
          ? ''
          : color.dim(` (${this.filteredOptions.length} match${this.filteredOptions.length === 1 ? '' : 'es'})`);

      // Render option with checkbox
      const renderOption = (opt, isHighlighted) => {
        const isSelected = this.selectedValues.includes(opt.value);
        const isLocked = lockedSet.has(opt.value);
        const label = opt.label ?? String(opt.value ?? '');
        const hintText = opt.hint && isHighlighted ? color.dim(` (${opt.hint})`) : '';

        let checkbox;
        if (isLocked) {
          checkbox = color.green(clack.S_CHECKBOX_SELECTED);
          const lockHint = color.dim(' (always installed)');
          return isHighlighted ? `${checkbox} ${label}${lockHint}` : `${checkbox} ${color.dim(label)}${lockHint}`;
        }
        checkbox = isSelected ? color.green(clack.S_CHECKBOX_SELECTED) : color.dim(clack.S_CHECKBOX_INACTIVE);
        return isHighlighted ? `${checkbox} ${label}${hintText}` : `${checkbox} ${color.dim(label)}`;
      };

      switch (this.state) {
        case 'submit': {
          return `${title}${color.gray(clack.S_BAR)}  ${color.dim(`${this.selectedValues.length} items selected`)}`;
        }

        case 'cancel': {
          return `${title}${color.gray(clack.S_BAR)}  ${color.strikethrough(color.dim(userInput))}`;
        }

        default: {
          // Always show "SPACE:" regardless of isNavigating state
          const hints = [`${color.dim('↑/↓')} to navigate`, `${color.dim('TAB/SPACE:')} select`, `${color.dim('ENTER:')} confirm`];

          const noMatchesLine = this.filteredOptions.length === 0 && userInput ? [`${bar}  ${color.yellow('No matches found')}`] : [];

          const errorLine = this.state === 'error' ? [`${bar}  ${color.yellow(this.error)}`] : [];

          const headerLines = [...`${title}${bar}`.split('\n'), `${bar}  ${searchDisplay}${matchCount}`, ...noMatchesLine, ...errorLine];

          const footerLines = [`${bar}  ${color.dim(hints.join(' • '))}`, `${barEnd}`];

          const optionLines = clack.limitOptions({
            cursor: this.cursor,
            options: this.filteredOptions,
            style: renderOption,
            maxItems: options.maxItems || 5,
            output: options.output,
            rowPadding: headerLines.length + footerLines.length,
          });

          return [...headerLines, ...optionLines.map((line) => `${bar}  ${line}`), ...footerLines].join('\n');
        }
      }
    },
  });

  // Prevent locked values from being toggled off
  if (lockedSet.size > 0) {
    const originalToggle = prompt.toggleSelected.bind(prompt);
    prompt.toggleSelected = function (value) {
      // If locked and already selected, skip the toggle (would deselect)
      if (lockedSet.has(value) && this.selectedValues.includes(value)) {
        return;
      }
      originalToggle(value);
    };
  }

  // === FIX: Make SPACE always act as selection key (not search input) ===
  // Override _isActionKey to treat SPACE like TAB - always an action key
  // This prevents SPACE from being added to the search input
  const originalIsActionKey = prompt._isActionKey.bind(prompt);
  prompt._isActionKey = function (char, key) {
    if (key && key.name === 'space') {
      return true;
    }
    return originalIsActionKey(char, key);
  };

  // Handle SPACE toggle when NOT navigating (internal code only handles it when isNavigating=true)
  prompt.on('key', (char, key) => {
    if (key && key.name === 'space' && !prompt.isNavigating) {
      const focused = prompt.filteredOptions[prompt.cursor];
      if (focused) prompt.toggleSelected(focused.value);
    }
  });
  // === END FIX ===

  const result = await prompt.prompt();
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
 * Text input prompt with Tab-to-fill-placeholder support (replaces Inquirer 'input' type)
 *
 * This custom implementation restores the Tab-to-fill-placeholder behavior that was
 * intentionally removed in @clack/prompts v1.0.0 (placeholder became purely visual).
 * Uses @clack/core's TextPrompt primitive with custom key handling.
 *
 * @param {Object} options - Prompt options
 * @param {string} options.message - The question to ask
 * @param {string} [options.default] - Default value
 * @param {string} [options.placeholder] - Placeholder text (defaults to options.default if not provided)
 * @param {Function} [options.validate] - Validation function
 * @returns {Promise<string>} User's input
 */
async function text(options) {
  const core = await getClackCore();
  const color = await getPicocolors();

  // Use default as placeholder if placeholder not explicitly provided
  // This shows the default value as grayed-out hint text
  const placeholder = options.placeholder === undefined ? options.default : options.placeholder;
  const defaultValue = options.default;

  const prompt = new core.TextPrompt({
    defaultValue,
    validate: options.validate,
    render() {
      const title = `${color.gray('◆')}  ${options.message}`;

      // Show placeholder as dim text when input is empty
      let valueDisplay;
      if (this.state === 'error') {
        valueDisplay = color.yellow(this.userInputWithCursor);
      } else if (this.userInput) {
        valueDisplay = this.userInputWithCursor;
      } else if (placeholder) {
        // Show placeholder with cursor indicator when empty
        valueDisplay = `${color.inverse(color.hidden('_'))}${color.dim(placeholder)}`;
      } else {
        valueDisplay = color.inverse(color.hidden('_'));
      }

      const bar = color.gray('│');

      // Handle different states
      if (this.state === 'submit') {
        return `${color.gray('◇')}  ${options.message}\n${bar}  ${color.dim(this.value || defaultValue || '')}`;
      }

      if (this.state === 'cancel') {
        return `${color.gray('◇')}  ${options.message}\n${bar}  ${color.strikethrough(color.dim(this.userInput || ''))}`;
      }

      if (this.state === 'error') {
        return `${color.yellow('▲')}  ${options.message}\n${bar}  ${valueDisplay}\n${color.yellow('│')}  ${color.yellow(this.error)}`;
      }

      return `${title}\n${bar}  ${valueDisplay}\n${bar}`;
    },
  });

  // Add Tab key handler to fill placeholder into input
  prompt.on('key', (char) => {
    if (char === '\t' && placeholder && !prompt.userInput) {
      // Use _setUserInput with write=true to populate the readline and update internal state
      prompt._setUserInput(placeholder, true);
    }
  });

  const result = await prompt.prompt();
  await handleCancel(result);

  // TextPrompt's finalize handler already applies defaultValue for empty input
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
 * Display cancellation message
 * @param {string} [message='Operation cancelled'] - The cancellation message
 */
async function cancel(message = 'Operation cancelled') {
  const clack = await getClack();
  clack.cancel(message);
}

/**
 * Display content in a styled box
 * @param {string} content - The box content
 * @param {string} [title] - Optional title
 * @param {Object} [options] - Box options (contentAlign, titleAlign, width, rounded, formatBorder, etc.)
 */
async function box(content, title, options) {
  const clack = await getClack();
  clack.box(content, title, options);
}

/**
 * Autocomplete single-select prompt with type-ahead filtering
 * @param {Object} options - Autocomplete options
 * @param {string} options.message - The prompt message
 * @param {Array} options.options - Array of choices [{value, label, hint?}]
 * @param {string} [options.placeholder] - Placeholder text
 * @param {number} [options.maxItems] - Maximum visible items
 * @param {Function} [options.filter] - Custom filter function
 * @returns {Promise<any>} Selected value
 */
async function autocomplete(options) {
  const clack = await getClack();
  const result = await clack.autocomplete(options);
  await handleCancel(result);
  return result;
}

function hasPathSeparator(value) {
  return value.endsWith('/') || value.endsWith('\\');
}

function expandHome(input) {
  if (!input) return input;
  if (input === '~') return os.homedir();
  if (input.startsWith('~/') || input.startsWith('~\\')) {
    return path.join(os.homedir(), input.slice(2));
  }
  return input;
}

function toDirectoryOption(value, label = value, synthetic = false) {
  return { value, label, synthetic };
}

function isExistingDirectory(value) {
  try {
    return fs.existsSync(value) && fs.statSync(value).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Resolve raw prompt input to an absolute directory path.
 * Mirrors UI.expandUserPath so what the prompt returns matches what the
 * installer later resolves.
 */
function resolveDirectoryInput(input, options = {}) {
  const cwd = options.cwd || process.cwd();
  const rawInput = typeof input === 'string' ? input.trim() : '';
  if (!rawInput) return options.default || cwd;
  return path.resolve(cwd, expandHome(rawInput));
}

function listDirectoryOptions(input, options) {
  const cwd = options.cwd || process.cwd();
  const rawInput = input.trim();
  const expandedInput = expandHome(rawInput);
  const trailingSep = hasPathSeparator(rawInput) || hasPathSeparator(expandedInput);
  const resolvedInput = expandedInput ? path.resolve(cwd, expandedInput) : cwd;
  const browseDir = expandedInput && !trailingSep && !isExistingDirectory(resolvedInput) ? path.dirname(resolvedInput) : resolvedInput;
  const prefix = expandedInput && browseDir !== resolvedInput ? path.basename(resolvedInput).toLowerCase() : '';
  const results = [];

  if (!trailingSep && isExistingDirectory(resolvedInput)) {
    results.push(toDirectoryOption(resolvedInput, `. (use this directory)`));
  }

  if (isExistingDirectory(browseDir)) {
    try {
      for (const entry of fs.readdirSync(browseDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (prefix && !entry.name.toLowerCase().startsWith(prefix)) continue;
        const fullPath = path.join(browseDir, entry.name);
        if (!results.some((option) => option.value === fullPath)) {
          // Label with the folder name only; the input line already shows the parent.
          results.push(toDirectoryOption(fullPath, `${entry.name}/`));
        }
      }
    } catch {
      // Skip unreadable directories; validation still reports path issues.
    }
  }

  const validation = options.validate?.(rawInput);
  const hasMatchingOption = results.some((option) => option.value === resolvedInput);
  if (expandedInput && !validation && !hasMatchingOption) {
    results.unshift(toDirectoryOption(resolvedInput, `Create/use: ${resolvedInput}`, true));
  }

  return results;
}

/**
 * Pick the slice of candidates to display, keeping the highlighted row visible.
 */
function directoryWindow(candidates, index, max) {
  if (candidates.length <= max) return { start: 0, items: candidates };
  const anchor = index === -1 ? 0 : index;
  const start = Math.max(0, Math.min(anchor - Math.floor(max / 2), candidates.length - max));
  return { start, items: candidates.slice(start, start + max) };
}

/**
 * Directory prompt with a visible candidate list and create-directory support.
 *
 * The text on the input line is always what gets submitted. Browsing with
 * arrow keys or Tab writes the highlighted candidate onto that line, so the
 * displayed path and the returned path can never diverge. Typing recomputes
 * the candidate list and clears the highlight.
 *
 * @param {Object} options - Prompt options
 * @param {string} options.message - Prompt message
 * @param {string} [options.default] - Default directory
 * @param {string} [options.placeholder] - Placeholder text
 * @param {Function} [options.validate] - Sync validation function
 * @param {Object} [options.input] - Input stream (defaults to process.stdin; tests inject)
 * @param {Object} [options.output] - Output stream (defaults to process.stdout; tests inject)
 * @returns {Promise<string>} Resolved absolute directory path
 */
async function directory(options) {
  const core = await getClackCore();
  const color = await getPicocolors();
  const MAX_VISIBLE = 6;

  // typed: the text the candidate list was built from, restored when browsing
  //   backs out of the list (index -1).
  // line:  the value currently on the input line, whether typed or completed.
  //   The list stays frozen while browsing, so arrow keys and Tab walk
  //   siblings instead of descending into whatever was just highlighted.
  const browse = { typed: '', line: '', candidates: [], index: -1, applying: false };

  const refresh = (input) => {
    browse.typed = input;
    browse.line = input;
    browse.candidates = listDirectoryOptions(input, options);
    browse.index = -1;
  };

  let prompt;
  prompt = new core.TextPrompt({
    ...(options.input ? { input: options.input } : {}),
    ...(options.output ? { output: options.output } : {}),
    defaultValue: options.default,
    validate: options.validate,
    render() {
      const bar = color.gray('│');
      const barEnd = color.gray('└');
      const userInput = this.userInput;

      switch (this.state) {
        case 'submit': {
          return `${color.gray('◇')}  ${options.message}\n${bar}  ${color.dim(this.value || '')}`;
        }
        case 'cancel': {
          return `${color.gray('◇')}  ${options.message}\n${bar}  ${color.strikethrough(color.dim(userInput || ''))}`;
        }
        default: {
          const placeholder = options.placeholder || options.default;
          const inputDisplay = userInput ? this.userInputWithCursor : `${color.inverse(color.hidden('_'))}${color.dim(placeholder || '')}`;
          const lines = [`${color.gray('◆')}  ${options.message}`, `${bar}  ${inputDisplay}`];

          if (this.state === 'error') lines.push(`${color.yellow('│')}  ${color.yellow(this.error)}`);

          const { start, items } = directoryWindow(browse.candidates, browse.index, MAX_VISIBLE);
          if (items.length > 0) {
            lines.push(bar);
            for (const [offset, candidate] of items.entries()) {
              const isActive = start + offset === browse.index;
              const marker = isActive ? color.cyan('❯') : ' ';
              const label = isActive ? color.cyan(candidate.label) : color.dim(candidate.label);
              lines.push(`${bar}  ${marker} ${label}`);
            }
            const hidden = browse.candidates.length - items.length;
            if (hidden > 0) lines.push(`${bar}    ${color.dim(`… ${hidden} more`)}`);
          }

          lines.push(`${barEnd}  ${color.dim('↑↓ browse · tab next · enter accept the path above')}`);
          return lines.join('\n');
        }
      }
    },
  });

  const hasSetUserInput = typeof prompt._setUserInput === 'function';
  const hasClearUserInput = typeof prompt._clearUserInput === 'function';

  refresh('');

  // Typing invalidates any highlight — the typed text is authoritative again.
  // A value equal to what browsing just wrote is an echo, not a keystroke.
  prompt.on('userInput', (value) => {
    if (browse.applying) return;
    if (value !== browse.line) refresh(value);
  });

  prompt.on('key', (_, key) => {
    const name = key?.name;
    if (name !== 'up' && name !== 'down' && name !== 'tab') return;
    if (!hasSetUserInput) return; // @clack/core API surface changed — skip browsing silently.
    const total = browse.candidates.length;
    if (total === 0) return;

    if (name === 'tab') {
      // Tab completes: advance to the next real directory, never the
      // typed-text slot and never a not-yet-created path.
      const realIndexes = browse.candidates.map((c, i) => (c.synthetic ? -1 : i)).filter((i) => i !== -1);
      if (realIndexes.length === 0) return;
      browse.index = realIndexes.find((i) => i > browse.index) ?? realIndexes[0];
    } else {
      // Index -1 is the typed text itself, so backing out of the list restores it.
      const step = name === 'up' ? -1 : 1;
      const slots = total + 1;
      browse.index = ((browse.index + 1 + step + slots) % slots) - 1;
    }

    const nextValue = browse.index === -1 ? browse.typed : browse.candidates[browse.index]?.value;
    if (nextValue === undefined) return;
    browse.line = nextValue;
    browse.applying = true;
    if (hasClearUserInput) prompt._clearUserInput();
    if (nextValue) prompt._setUserInput(nextValue, true);
    browse.applying = false;
  });

  const result = await prompt.prompt();
  await handleCancel(result);
  return resolveDirectoryInput(result, options);
}

/**
 * Get the color utility (picocolors instance from @clack/prompts)
 * @returns {Promise<Object>} The color utility (picocolors)
 */
async function getColor() {
  return await getPicocolors();
}

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
  getColor,
  handleCancel,
  intro,
  outro,
  cancel,
  note,
  box,
  spinner,
  select,
  multiselect,
  autocompleteMultiselect,
  autocomplete,
  directory,
  // Exported for tests
  listDirectoryOptions,
  resolveDirectoryInput,
  directoryWindow,
  confirm,
  text,
  password,
  tasks,
  log,
  prompt,
};
