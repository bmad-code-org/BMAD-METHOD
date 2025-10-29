/**
 * Advanced Tests for ManifestConfigLoader
 * Coverage: Edge cases, error scenarios, performance, complex nested structures
 * File: test/unit/config-loader-advanced.test.js
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('js-yaml');
const { ManifestConfigLoader } = require('../../tools/cli/lib/config-loader');

describe('ManifestConfigLoader - Advanced Scenarios', () => {
  let tempDir;
  let loader;

  beforeEach(async () => {
    tempDir = path.join(__dirname, '../fixtures/temp', `loader-${Date.now()}`);
    await fs.ensureDir(tempDir);
    loader = new ManifestConfigLoader();
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });

  describe('Complex Nested Structures', () => {
    test('should handle deeply nested keys with multiple levels', async () => {
      const manifestPath = path.join(tempDir, 'deep.yaml');
      const manifest = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: 'deep value',
              },
            },
          },
        },
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('level1.level2.level3.level4.level5')).toBe('deep value');
    });

    test('should handle arrays in nested structures', async () => {
      const manifestPath = path.join(tempDir, 'arrays.yaml');
      const manifest = {
        modules: ['bmb', 'bmm', 'cis'],
        ides: {
          configured: ['claude-code', 'github-copilot'],
          available: ['roo', 'cline'],
        },
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      const ides = loader.getConfig('ides');
      expect(ides.configured).toContain('claude-code');
      expect(ides.available).toContain('cline');
    });

    test('should handle mixed data types in nested structures', async () => {
      const manifestPath = path.join(tempDir, 'mixed.yaml');
      const manifest = {
        config: {
          string: 'value',
          number: 42,
          boolean: true,
          null: null,
          array: [1, 2, 3],
          nested: {
            date: '2025-10-26T12:00:00Z',
            version: '1.0.0',
          },
        },
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('config.string')).toBe('value');
      expect(loader.getConfig('config.number')).toBe(42);
      expect(loader.getConfig('config.boolean')).toBe(true);
      expect(loader.getConfig('config.null')).toBeNull();
      expect(loader.getConfig('config.nested.version')).toBe('1.0.0');
    });
  });

  describe('Edge Cases - Empty and Null Values', () => {
    test('should handle empty config objects', async () => {
      const manifestPath = path.join(tempDir, 'empty.yaml');
      await fs.writeFile(manifestPath, yaml.dump({}));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('any.key', 'default')).toBe('default');
    });

    test('should differentiate between null and undefined', async () => {
      const manifestPath = path.join(tempDir, 'nulls.yaml');
      const manifest = {
        explicit_null: null,
        explicit_value: 'value',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('explicit_null')).toBeNull();
      expect(loader.getConfig('explicit_null', 'default')).toBeNull();
      expect(loader.getConfig('missing_key', 'default')).toBe('default');
    });

    test('should handle empty arrays', async () => {
      const manifestPath = path.join(tempDir, 'empty_arrays.yaml');
      const manifest = {
        ides: [],
        modules: [],
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('ides')).toEqual([]);
      expect(loader.getConfig('modules')).toEqual([]);
    });

    test('should handle empty strings', async () => {
      const manifestPath = path.join(tempDir, 'empty_strings.yaml');
      const manifest = {
        empty: '',
        normal: 'value',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('empty')).toBe('');
      expect(loader.getConfig('empty', 'default')).toBe('');
    });
  });

  describe('Caching Behavior - Advanced', () => {
    test('should return cached config on subsequent calls with same path', async () => {
      const manifestPath = path.join(tempDir, 'cache.yaml');
      const manifest = { test: 'value', updated: '2025-10-26' };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      const first = await loader.loadManifest(manifestPath);
      const second = await loader.loadManifest(manifestPath);

      expect(first).toEqual(second);
      expect(first).toBe(second); // Same reference
    });

    test('should reload config when path changes', async () => {
      const path1 = path.join(tempDir, 'manifest1.yaml');
      const path2 = path.join(tempDir, 'manifest2.yaml');

      const manifest1 = { source: 'manifest1' };
      const manifest2 = { source: 'manifest2' };

      await fs.writeFile(path1, yaml.dump(manifest1));
      await fs.writeFile(path2, yaml.dump(manifest2));

      await loader.loadManifest(path1);
      expect(loader.getConfig('source')).toBe('manifest1');

      await loader.loadManifest(path2);
      expect(loader.getConfig('source')).toBe('manifest2');
    });

    test('should return cached config after clearCache and hasConfig check', async () => {
      const manifestPath = path.join(tempDir, 'cache2.yaml');
      const manifest = { key: 'value' };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      loader.clearCache();

      expect(loader.getConfig('key', 'default')).toBe('default');
      expect(loader.hasConfig('key')).toBe(false);
    });

    test('should handle rapid sequential loads efficiently', async () => {
      const manifestPath = path.join(tempDir, 'rapid.yaml');
      const manifest = { data: 'value'.repeat(1000) };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      const results = [];
      for (let i = 0; i < 100; i++) {
        const result = await loader.loadManifest(manifestPath);
        results.push(result);
      }

      // All should be same reference (cached)
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBe(results[0]);
      }
    });
  });

  describe('Error Handling - Invalid Files', () => {
    test('should handle non-existent manifest files', async () => {
      const manifestPath = path.join(tempDir, 'nonexistent.yaml');

      const result = await loader.loadManifest(manifestPath);
      expect(result).toEqual({});
      expect(loader.getConfig('any', 'default')).toBe('default');
    });

    test('should throw on invalid YAML syntax', async () => {
      const manifestPath = path.join(tempDir, 'invalid.yaml');
      await fs.writeFile(manifestPath, 'invalid: yaml: content: [');

      await expect(loader.loadManifest(manifestPath)).rejects.toThrow('Invalid YAML in manifest');
    });

    test('should throw on malformed YAML structures', async () => {
      const manifestPath = path.join(tempDir, 'malformed.yaml');
      await fs.writeFile(manifestPath, 'key: value\n  invalid indentation: here');

      await expect(loader.loadManifest(manifestPath)).rejects.toThrow();
    });

    test('should handle binary/non-text files gracefully', async () => {
      const manifestPath = path.join(tempDir, 'binary.yaml');
      await fs.writeFile(manifestPath, Buffer.from([0xff, 0xfe, 0x00, 0x00]));

      // YAML parser will fail on binary data
      await expect(loader.loadManifest(manifestPath)).rejects.toThrow();
    });

    test('should handle permission errors', async () => {
      if (process.platform === 'win32') {
        // Skip on Windows as permissions work differently
        expect(true).toBe(true);
        return;
      }

      const manifestPath = path.join(tempDir, 'noperms.yaml');
      await fs.writeFile(manifestPath, yaml.dump({ test: 'value' }));
      await fs.chmod(manifestPath, 0o000);

      try {
        await expect(loader.loadManifest(manifestPath)).rejects.toThrow();
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(manifestPath, 0o644);
      }
    });
  });

  describe('hasConfig Method - Advanced', () => {
    test('should correctly identify nested keys existence', async () => {
      const manifestPath = path.join(tempDir, 'hasconfig.yaml');
      const manifest = {
        installation: {
          version: '1.0.0',
          date: '2025-10-26',
        },
        modules: ['bmb', 'bmm'],
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.hasConfig('installation.version')).toBe(true);
      expect(loader.hasConfig('installation.missing')).toBe(false);
      expect(loader.hasConfig('modules')).toBe(true);
      expect(loader.hasConfig('missing')).toBe(false);
    });

    test('should handle hasConfig on null values', async () => {
      const manifestPath = path.join(tempDir, 'hasnull.yaml');
      const manifest = {
        explicit_null: null,
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.hasConfig('explicit_null')).toBe(true);
      expect(loader.getConfig('explicit_null')).toBeNull();
    });

    test('should handle hasConfig before loadManifest', () => {
      expect(loader.hasConfig('any.key')).toBe(false);
    });

    test('should return false for paths through non-objects', async () => {
      const manifestPath = path.join(tempDir, 'paththrough.yaml');
      const manifest = {
        scalar: 'value',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.hasConfig('scalar.nested')).toBe(false);
    });
  });

  describe('Special Characters and Encoding', () => {
    test('should handle unicode characters in values', async () => {
      const manifestPath = path.join(tempDir, 'unicode.yaml');
      const manifest = {
        emoji: '🎯 BMAD ✨',
        chinese: '中文测试',
        arabic: 'اختبار عربي',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest, { lineWidth: -1 }));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('emoji')).toBe('🎯 BMAD ✨');
      expect(loader.getConfig('chinese')).toBe('中文测试');
      expect(loader.getConfig('arabic')).toBe('اختبار عربي');
    });

    test('should handle paths with special characters', async () => {
      const manifestPath = path.join(tempDir, 'special_chars.yaml');
      const manifest = {
        'installation-date': '2025-10-26',
        last_updated: '2025-10-26T12:00:00Z',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('installation-date')).toBe('2025-10-26');
      expect(loader.getConfig('last_updated')).toBe('2025-10-26T12:00:00Z');
    });

    test('should handle multiline strings', async () => {
      const manifestPath = path.join(tempDir, 'multiline.yaml');
      const manifest = {
        description: 'This is a\nmultiline\ndescription',
        config: 'Line 1\nLine 2\nLine 3',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);
      expect(loader.getConfig('description')).toContain('\n');
      expect(loader.getConfig('description')).toContain('multiline');
    });
  });

  describe('Performance and Scale', () => {
    test('should handle large manifest files', async () => {
      const manifestPath = path.join(tempDir, 'large.yaml');
      const manifest = {
        modules: Array.from({ length: 1000 }, (_, i) => `module-${i}`),
        configs: {},
      };

      // Add 500 config entries
      for (let i = 0; i < 500; i++) {
        manifest.configs[`config-${i}`] = `value-${i}`;
      }

      await fs.writeFile(manifestPath, yaml.dump(manifest));

      const start = Date.now();
      await loader.loadManifest(manifestPath);
      const loadTime = Date.now() - start;

      expect(loader.getConfig('modules.0')).toBe('module-0');
      expect(loader.getConfig('modules.999')).toBe('module-999');
      expect(loader.getConfig('configs.config-250')).toBe('value-250');
      expect(loadTime).toBeLessThan(1000); // Should load in under 1 second
    });

    test('should handle many sequential getConfig calls efficiently', async () => {
      const manifestPath = path.join(tempDir, 'perf.yaml');
      const manifest = {
        a: { b: { c: { d: 'value' } } },
        x: 'test',
      };
      await fs.writeFile(manifestPath, yaml.dump(manifest));

      await loader.loadManifest(manifestPath);

      const start = Date.now();
      for (let i = 0; i < 10_000; i++) {
        loader.getConfig('a.b.c.d');
      }
      const time = Date.now() - start;

      expect(time).toBeLessThan(100); // Should be very fast (cached)
    });
  });

  describe('State Management', () => {
    test('should maintain separate state for multiple loaders', async () => {
      const loader1 = new ManifestConfigLoader();
      const loader2 = new ManifestConfigLoader();

      const path1 = path.join(tempDir, 'loader1.yaml');
      const path2 = path.join(tempDir, 'loader2.yaml');

      await fs.writeFile(path1, yaml.dump({ source: 'loader1' }));
      await fs.writeFile(path2, yaml.dump({ source: 'loader2' }));

      await loader1.loadManifest(path1);
      await loader2.loadManifest(path2);

      expect(loader1.getConfig('source')).toBe('loader1');
      expect(loader2.getConfig('source')).toBe('loader2');
    });

    test('should clear cache properly', async () => {
      const manifestPath = path.join(tempDir, 'clear.yaml');
      await fs.writeFile(manifestPath, yaml.dump({ test: 'value' }));

      await loader.loadManifest(manifestPath);
      expect(loader.hasConfig('test')).toBe(true);

      loader.clearCache();
      expect(loader.hasConfig('test')).toBe(false);
      expect(loader.getConfig('test', 'default')).toBe('default');
    });
  });
});
