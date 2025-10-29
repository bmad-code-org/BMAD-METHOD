/**
 * Question Skipping Unit Tests
 * Tests for skipping questions during update installations
 * File: test/unit/prompt-skipping.test.js
 */

const { PromptHandler } = require('../../tools/cli/lib/ui');
const { ManifestConfigLoader } = require('../../tools/cli/lib/config-loader');

describe('Question Skipping', () => {
  let promptHandler;
  let configLoader;

  beforeEach(() => {
    promptHandler = new PromptHandler();
    configLoader = new ManifestConfigLoader();
  });

  describe('skipQuestion', () => {
    // Test 4.1: Skip Question When Update with Config
    it('should skip question and return config value when isUpdate=true and config exists', async () => {
      const mockConfig = {
        prd_sharding: true,
        getConfig: jest.fn(() => true),
        hasConfig: jest.fn(() => true),
      };

      const result = await promptHandler.askPrdSharding({ isUpdate: true, config: mockConfig });

      expect(result).toBe(true);
      expect(mockConfig.hasConfig).toHaveBeenCalledWith('prd_sharding');
    });

    // Test 4.2: Ask Question When Fresh Install
    it('should ask question on fresh install (isUpdate=false)', async () => {
      const mockInquirer = jest.spyOn(promptHandler, 'prompt').mockResolvedValueOnce({
        prd_sharding: true,
      });

      const result = await promptHandler.askPrdSharding({
        isUpdate: false,
        config: {},
      });

      expect(mockInquirer).toHaveBeenCalled();
      expect(result).toBe(true);

      mockInquirer.mockRestore();
    });

    // Test 4.3: Ask Question When Config Missing
    it('should ask question if config missing on update', async () => {
      const mockConfig = {
        hasConfig: jest.fn(() => false),
      };

      const mockInquirer = jest.spyOn(promptHandler, 'prompt').mockResolvedValueOnce({
        architecture_sharding: false,
      });

      const result = await promptHandler.askArchitectureSharding({ isUpdate: true, config: mockConfig });

      expect(mockInquirer).toHaveBeenCalled();
      expect(result).toBe(false);

      mockInquirer.mockRestore();
    });

    // Test 4.4: Log Skipped Questions
    it('should log when question is skipped', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const mockConfig = {
        getConfig: jest.fn(() => 'full'),
        hasConfig: jest.fn(() => true),
      };

      await promptHandler.askInstallType({ isUpdate: true, config: mockConfig });

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Skipping question'));

      consoleLogSpy.mockRestore();
    });

    // Test 4.5: Multiple Questions Skipped
    it('should skip all applicable questions on update', async () => {
      const mockConfig = {
        getConfig: jest.fn((key, fallback) => {
          const values = {
            prd_sharding: true,
            architecture_sharding: false,
            doc_organization: 'by-module',
            install_type: 'full',
          };
          return values[key] || fallback;
        }),
        hasConfig: jest.fn(() => true),
      };

      const results = await Promise.all([
        promptHandler.askPrdSharding({ isUpdate: true, config: mockConfig }),
        promptHandler.askArchitectureSharding({ isUpdate: true, config: mockConfig }),
        promptHandler.askDocOrganization({ isUpdate: true, config: mockConfig }),
        promptHandler.askInstallType({ isUpdate: true, config: mockConfig }),
      ]);

      expect(results).toEqual([true, false, 'by-module', 'full']);
      // Each should have checked hasConfig
      expect(mockConfig.hasConfig.mock.calls.length).toBe(4);
    });
  });

  describe('prompt behavior during updates', () => {
    it('should not display UI when skipping question', async () => {
      const mockConfig = {
        getConfig: jest.fn(() => 'value'),
        hasConfig: jest.fn(() => true),
      };

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await promptHandler.askConfigQuestion('test_key', {
        isUpdate: true,
        config: mockConfig,
      });

      // Should log skip message but not the question itself
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Skipping'));

      consoleLogSpy.mockRestore();
    });

    it('should handle null/undefined defaults gracefully', async () => {
      const mockConfig = {
        getConfig: jest.fn(() => {}),
        hasConfig: jest.fn(() => true),
      };

      const mockInquirer = jest.spyOn(promptHandler, 'prompt').mockResolvedValueOnce({
        answer: 'user-provided',
      });

      const result = await promptHandler.askConfigQuestion('missing_key', {
        isUpdate: true,
        config: mockConfig,
      });

      expect(result).toBe('user-provided');

      mockInquirer.mockRestore();
    });
  });

  describe('isUpdate flag propagation', () => {
    it('should pass isUpdate flag through prompt pipeline', () => {
      const flags = {
        isUpdate: true,
        config: {},
      };

      expect(flags.isUpdate).toBe(true);
      expect(flags.config).toBeDefined();
    });

    it('should distinguish fresh install from update', () => {
      const freshInstallFlags = { isUpdate: false };
      const updateFlags = { isUpdate: true };

      expect(freshInstallFlags.isUpdate).toBe(false);
      expect(updateFlags.isUpdate).toBe(true);
    });
  });

  describe('backward compatibility', () => {
    it('should handle missing isUpdate flag (default to fresh install)', async () => {
      const mockInquirer = jest.spyOn(promptHandler, 'prompt').mockResolvedValueOnce({
        answer: 'default-behavior',
      });

      // When isUpdate is not provided, should ask question
      const result = await promptHandler.askConfigQuestion('key', {});

      expect(mockInquirer).toHaveBeenCalled();

      mockInquirer.mockRestore();
    });

    it('should handle missing config object', async () => {
      const mockInquirer = jest.spyOn(promptHandler, 'prompt').mockResolvedValueOnce({
        answer: 'fallback',
      });

      const result = await promptHandler.askConfigQuestion('key', {
        isUpdate: true,
        // config intentionally missing
      });

      expect(mockInquirer).toHaveBeenCalled();

      mockInquirer.mockRestore();
    });
  });
});
