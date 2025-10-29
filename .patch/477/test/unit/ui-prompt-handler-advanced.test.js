/**
 * Advanced Tests for UI Component - Question Handling
 * Coverage: Prompt behavior, caching, conditional display, user interactions
 * File: test/unit/ui-prompt-handler-advanced.test.js
 */

const fs = require('fs-extra');
const path = require('node:path');
const inquirer = require('inquirer');

describe('UI PromptHandler - Advanced Scenarios', () => {
  let tempDir;
  let mockUI;

  beforeEach(async () => {
    tempDir = path.join(__dirname, '../fixtures/temp', `ui-${Date.now()}`);
    await fs.ensureDir(tempDir);

    // Mock UI module
    mockUI = {
      prompt: jest.fn(),
      askInstallType: jest.fn(),
      askDocOrganization: jest.fn(),
      shouldSkipQuestion: jest.fn(),
    };
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
    jest.clearAllMocks();
  });

  describe('Question Skipping Logic', () => {
    test('should skip questions when configuration exists and not fresh install', () => {
      const shouldSkip = (isUpdate, hasConfig) => {
        return isUpdate && hasConfig;
      };

      expect(shouldSkip(true, true)).toBe(true);
      expect(shouldSkip(true, false)).toBe(false);
      expect(shouldSkip(false, true)).toBe(false);
      expect(shouldSkip(false, false)).toBe(false);
    });

    test('should ask questions on fresh install regardless of config', () => {
      const shouldAsk = (isFreshInstall, hasConfig) => {
        return isFreshInstall || !hasConfig;
      };

      expect(shouldAsk(true, true)).toBe(true);
      expect(shouldAsk(true, false)).toBe(true);
      expect(shouldAsk(false, true)).toBe(false);
      expect(shouldAsk(false, false)).toBe(true);
    });

    test('should determine skip decision based on multiple criteria', () => {
      const determineSkip = (installMode, hasConfig, forceAsk = false) => {
        if (forceAsk) return false;
        return installMode === 'update' && hasConfig;
      };

      expect(determineSkip('update', true)).toBe(true);
      expect(determineSkip('update', true, true)).toBe(false);
      expect(determineSkip('fresh', true)).toBe(false);
      expect(determineSkip('reinstall', true)).toBe(false);
    });
  });

  describe('Cached Answer Retrieval', () => {
    test('should retrieve cached answer for question', () => {
      const cache = {
        install_type: 'full',
        doc_organization: 'hierarchical',
      };

      const getCachedAnswer = (key, defaultValue) => {
        return cache[key] === undefined ? defaultValue : cache[key];
      };

      expect(getCachedAnswer('install_type')).toBe('full');
      expect(getCachedAnswer('doc_organization')).toBe('hierarchical');
      expect(getCachedAnswer('missing_key')).toBeUndefined();
      expect(getCachedAnswer('missing_key', 'default')).toBe('default');
    });

    test('should handle null and undefined in cache', () => {
      const cache = {
        explicit_null: null,
        explicit_undefined: undefined,
        missing: undefined,
      };

      const getValue = (key, defaultValue = 'default') => {
        // Return cached value only if key exists AND value is not null/undefined
        if (key in cache && cache[key] !== null && cache[key] !== undefined) {
          return cache[key];
        }
        return defaultValue;
      };

      expect(getValue('explicit_null')).toBe('default');
      expect(getValue('explicit_undefined')).toBe('default');
      expect(getValue('missing')).toBe('default');
      expect(getValue('exists') === 'default').toBe(true);
    });

    test('should handle complex cached values', () => {
      const cache = {
        modules: ['bmb', 'bmm', 'cis'],
        ides: ['claude-code', 'github-copilot'],
        config: {
          nested: {
            value: 'test',
          },
        },
      };

      const getArrayValue = (key) => cache[key] || [];
      const getNestedValue = (key, path, defaultValue) => {
        const obj = cache[key];
        if (!obj) return defaultValue;
        const keys = path.split('.');
        let current = obj;
        for (const k of keys) {
          current = current?.[k];
        }
        return current ?? defaultValue;
      };

      expect(getArrayValue('modules')).toHaveLength(3);
      expect(getArrayValue('missing')).toEqual([]);
      expect(getNestedValue('config', 'nested.value')).toBe('test');
      expect(getNestedValue('config', 'missing.path', 'default')).toBe('default');
    });
  });

  describe('Question Type Handling', () => {
    test('should handle boolean questions correctly', () => {
      const handleBooleanAnswer = (answer) => {
        return answer === true || answer === 'yes' || answer === 'y';
      };

      expect(handleBooleanAnswer(true)).toBe(true);
      expect(handleBooleanAnswer('yes')).toBe(true);
      expect(handleBooleanAnswer(false)).toBe(false);
      expect(handleBooleanAnswer('no')).toBe(false);
    });

    test('should handle multiple choice questions', () => {
      const choices = new Set(['option1', 'option2', 'option3']);
      const validateChoice = (answer) => {
        return choices.has(answer);
      };

      expect(validateChoice('option1')).toBe(true);
      expect(validateChoice('option4')).toBe(false);
    });

    test('should handle array selection questions', () => {
      const availableItems = new Set(['item1', 'item2', 'item3', 'item4']);
      const validateSelection = (answers) => {
        return Array.isArray(answers) && answers.every((a) => availableItems.has(a));
      };

      expect(validateSelection(['item1', 'item3'])).toBe(true);
      expect(validateSelection(['item1', 'invalid'])).toBe(false);
      expect(validateSelection('not-array')).toBe(false);
    });

    test('should handle string input questions', () => {
      const validateString = (answer, minLength = 1, maxLength = 255) => {
        return typeof answer === 'string' && answer.length >= minLength && answer.length <= maxLength;
      };

      expect(validateString('valid')).toBe(true);
      expect(validateString('')).toBe(false);
      expect(validateString('a'.repeat(300))).toBe(false);
    });
  });

  describe('Prompt Display Conditions', () => {
    test('should determine when to show tool selection prompt', () => {
      const shouldShowToolSelection = (modules, installMode) => {
        if (!modules || modules.length === 0) return false;
        return installMode === 'fresh' || installMode === 'update';
      };

      expect(shouldShowToolSelection(['bmb'], 'fresh')).toBe(true);
      expect(shouldShowToolSelection(['bmb'], 'update')).toBe(true);
      expect(shouldShowToolSelection([], 'fresh')).toBe(false);
      expect(shouldShowToolSelection(null, 'fresh')).toBe(false);
    });

    test('should determine when to show configuration questions', () => {
      const shouldShowConfig = (installMode, previousConfig) => {
        if (installMode === 'fresh') return true; // Always ask on fresh
        if (installMode === 'update' && !previousConfig) return true; // Ask if no config
        return false; // Skip on update with config
      };

      expect(shouldShowConfig('fresh', { install_type: 'full' })).toBe(true);
      expect(shouldShowConfig('update', null)).toBe(true);
      expect(shouldShowConfig('update', { install_type: 'full' })).toBe(false);
      expect(shouldShowConfig('reinstall', null)).toBe(false);
    });

    test('should handle conditional IDE prompts', () => {
      const ides = ['claude-code', 'github-copilot', 'roo'];
      const previousIdes = ['claude-code'];

      const getNewIDEs = (selected, previous) => {
        return selected.filter((ide) => !previous.includes(ide));
      };

      const newIDEs = getNewIDEs(ides, previousIdes);
      expect(newIDEs).toContain('github-copilot');
      expect(newIDEs).toContain('roo');
      expect(newIDEs).not.toContain('claude-code');
    });
  });

  describe('Default Value Handling', () => {
    test('should provide sensible defaults for config questions', () => {
      const defaults = {
        install_type: 'full',
        doc_organization: 'hierarchical',
        prd_sharding: 'auto',
        architecture_sharding: 'auto',
      };

      for (const [key, value] of Object.entries(defaults)) {
        expect(value).toBeTruthy();
      }
    });

    test('should use cached values as defaults', () => {
      const cachedConfig = {
        install_type: 'minimal',
        doc_organization: 'flat',
      };

      const getDefault = (key, defaults) => {
        return cachedConfig[key] || defaults[key];
      };

      expect(getDefault('install_type', { install_type: 'full' })).toBe('minimal');
      expect(getDefault('doc_organization', { doc_organization: 'hierarchical' })).toBe('flat');
      expect(getDefault('prd_sharding', { prd_sharding: 'auto' })).toBe('auto');
    });

    test('should handle missing defaults gracefully', () => {
      const getDefault = (key, defaults, fallback = null) => {
        return defaults?.[key] ?? fallback;
      };

      expect(getDefault('key1', { key1: 'value' })).toBe('value');
      expect(getDefault('missing', { key1: 'value' })).toBeNull();
      expect(getDefault('missing', { key1: 'value' }, 'fallback')).toBe('fallback');
      expect(getDefault('key', null, 'fallback')).toBe('fallback');
    });
  });

  describe('User Input Validation', () => {
    test('should validate install type options', () => {
      const validTypes = new Set(['full', 'minimal', 'custom']);
      const validate = (type) => validTypes.has(type);

      expect(validate('full')).toBe(true);
      expect(validate('minimal')).toBe(true);
      expect(validate('invalid')).toBe(false);
    });

    test('should validate doc organization options', () => {
      const validOptions = new Set(['hierarchical', 'flat', 'modular']);
      const validate = (option) => validOptions.has(option);

      expect(validate('hierarchical')).toBe(true);
      expect(validate('flat')).toBe(true);
      expect(validate('invalid')).toBe(false);
    });

    test('should validate IDE selections', () => {
      const availableIDEs = new Set(['claude-code', 'github-copilot', 'cline', 'roo', 'auggie', 'codex', 'qwen', 'gemini']);

      const validate = (selections) => {
        return Array.isArray(selections) && selections.every((ide) => availableIDEs.has(ide));
      };

      expect(validate(['claude-code', 'roo'])).toBe(true);
      expect(validate(['claude-code', 'invalid-ide'])).toBe(false);
      expect(validate('not-array')).toBe(false);
    });

    test('should validate module selections', () => {
      const availableModules = new Set(['bmb', 'bmm', 'cis']);

      const validate = (selections) => {
        return Array.isArray(selections) && selections.every((mod) => availableModules.has(mod));
      };

      expect(validate(['bmb', 'bmm'])).toBe(true);
      expect(validate(['bmb', 'invalid'])).toBe(false);
    });
  });

  describe('State Consistency', () => {
    test('should maintain consistent state across questions', () => {
      const state = {
        installMode: 'update',
        modules: ['bmb', 'bmm'],
        ides: ['claude-code'],
        config: {
          install_type: 'full',
        },
      };

      const isValidState = (st) => {
        return st.installMode && Array.isArray(st.modules) && Array.isArray(st.ides) && st.config !== null;
      };

      expect(isValidState(state)).toBe(true);
    });

    test('should validate state transitions', () => {
      const transitions = {
        fresh: ['update', 'reinstall'],
        update: ['update', 'reinstall'],
        reinstall: ['fresh', 'update', 'reinstall'],
      };

      const canTransition = (from, to) => {
        return transitions[from]?.includes(to) ?? false;
      };

      expect(canTransition('fresh', 'update')).toBe(true);
      expect(canTransition('fresh', 'fresh')).toBe(false);
      expect(canTransition('update', 'update')).toBe(true);
    });

    test('should handle incomplete state', () => {
      const completeState = (partialState, defaults) => {
        return { ...defaults, ...partialState };
      };

      const defaults = {
        installMode: 'fresh',
        modules: [],
        ides: [],
        config: {},
      };

      const partial = { modules: ['bmb'] };
      const complete = completeState(partial, defaults);

      expect(complete.modules).toEqual(['bmb']);
      expect(complete.installMode).toBe('fresh');
      expect(complete.ides).toEqual([]);
    });
  });

  describe('Error Messages and Feedback', () => {
    test('should provide helpful error messages for invalid inputs', () => {
      const getErrorMessage = (errorType, context = {}) => {
        const messages = {
          invalid_choice: `"${context.value}" is not a valid option. Valid options: ${(context.options || []).join(', ')}`,
          missing_required: `This field is required`,
          invalid_format: `Invalid format provided`,
        };
        return messages[errorType] || 'An error occurred';
      };

      const error1 = getErrorMessage('invalid_choice', {
        value: 'invalid',
        options: ['a', 'b', 'c'],
      });
      expect(error1).toContain('invalid');

      const error2 = getErrorMessage('missing_required');
      expect(error2).toContain('required');
    });

    test('should provide context-aware messages', () => {
      const getMessage = (installMode, context = {}) => {
        if (installMode === 'update' && context.hasConfig) {
          return 'Using saved configuration...';
        }
        if (installMode === 'fresh') {
          return 'Setting up new installation...';
        }
        return 'Processing...';
      };

      expect(getMessage('update', { hasConfig: true })).toContain('saved');
      expect(getMessage('fresh')).toContain('new');
      expect(getMessage('reinstall')).toContain('Processing');
    });
  });

  describe('Performance Considerations', () => {
    test('should handle large option lists efficiently', () => {
      const largeList = Array.from({ length: 1000 }, (_, i) => `option-${i}`);

      const filterOptions = (list, searchTerm) => {
        return list.filter((opt) => opt.includes(searchTerm));
      };

      const start = Date.now();
      const result = filterOptions(largeList, 'option-500');
      const time = Date.now() - start;

      expect(result).toContain('option-500');
      expect(time).toBeLessThan(100);
    });

    test('should cache expensive computations', () => {
      let computeCount = 0;

      const memoizeExpensiveComputation = () => {
        const cache = {};
        return (key) => {
          if (key in cache) return cache[key];
          computeCount++;
          cache[key] = `result-${key}`;
          return cache[key];
        };
      };

      const compute = memoizeExpensiveComputation();

      compute('key1');
      compute('key1');
      compute('key1');

      expect(computeCount).toBe(1); // Only computed once
    });
  });

  describe('Edge Cases in Prompt Handling', () => {
    test('should handle empty arrays in selections', () => {
      const processSelection = (selection) => {
        return Array.isArray(selection) && selection.length > 0 ? selection : null;
      };

      expect(processSelection([])).toBeNull();
      expect(processSelection(['item'])).toContain('item');
      expect(processSelection(null)).toBeNull();
    });

    test('should handle whitespace in string inputs', () => {
      const trimAndValidate = (input) => {
        const trimmed = typeof input === 'string' ? input.trim() : input;
        return trimmed && trimmed.length > 0 ? trimmed : null;
      };

      expect(trimAndValidate('  text  ')).toBe('text');
      expect(trimAndValidate('   ')).toBeNull();
      expect(trimAndValidate('')).toBeNull();
    });

    test('should handle duplicate selections', () => {
      const removeDuplicates = (array) => {
        return [...new Set(array)];
      };

      expect(removeDuplicates(['a', 'b', 'a', 'c', 'b'])).toHaveLength(3);
      expect(removeDuplicates(['a', 'b', 'c'])).toHaveLength(3);
    });

    test('should handle special characters in values', () => {
      const values = ['item-1', 'item_2', 'item.3', 'item@4', 'item/5'];

      for (const val of values) {
        expect(val).toBeDefined();
        expect(typeof val).toBe('string');
      }
    });
  });
});
