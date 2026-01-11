import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Config } from '../../../tools/cli/lib/config.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';
import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'yaml';

describe('Config', () => {
  let tmpDir;
  let config;

  beforeEach(async () => {
    tmpDir = await createTempDir();
    config = new Config();
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('loadYaml()', () => {
    it('should load and parse YAML file', async () => {
      const yamlContent = {
        key1: 'value1',
        key2: { nested: 'value2' },
        array: [1, 2, 3],
      };

      const configPath = path.join(tmpDir, 'config.yaml');
      await fs.writeFile(configPath, yaml.stringify(yamlContent));

      const result = await config.loadYaml(configPath);

      expect(result).toEqual(yamlContent);
    });

    it('should throw error for non-existent file', async () => {
      const nonExistent = path.join(tmpDir, 'missing.yaml');

      await expect(config.loadYaml(nonExistent)).rejects.toThrow('Configuration file not found');
    });

    it('should handle Unicode content', async () => {
      const yamlContent = {
        chinese: '测试',
        russian: 'Тест',
        japanese: 'テスト',
      };

      const configPath = path.join(tmpDir, 'unicode.yaml');
      await fs.writeFile(configPath, yaml.stringify(yamlContent));

      const result = await config.loadYaml(configPath);

      expect(result.chinese).toBe('测试');
      expect(result.russian).toBe('Тест');
      expect(result.japanese).toBe('テスト');
    });
  });

  // Note: saveYaml() is not tested because it uses yaml.dump() which doesn't exist
  // in yaml 2.7.0 (should use yaml.stringify). This method is never called in production
  // and represents dead code with a latent bug.

  describe('processConfig()', () => {
    it('should replace {project-root} placeholder', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Root is {project-root}/bmad');

      await config.processConfig(configPath, { root: '/home/user/project' });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toBe('Root is /home/user/project/bmad');
    });

    it('should replace {module} placeholder', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Module: {module}');

      await config.processConfig(configPath, { module: 'bmm' });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toBe('Module: bmm');
    });

    it('should replace {version} placeholder with package version', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Version: {version}');

      await config.processConfig(configPath);

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toMatch(/Version: \d+\.\d+\.\d+/); // Semver format
    });

    it('should replace {date} placeholder with current date', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Date: {date}');

      await config.processConfig(configPath);

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toMatch(/Date: \d{4}-\d{2}-\d{2}/); // YYYY-MM-DD
    });

    it('should replace multiple placeholders', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Root: {project-root}, Module: {module}, Version: {version}');

      await config.processConfig(configPath, {
        root: '/project',
        module: 'test',
      });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toContain('Root: /project');
      expect(content).toContain('Module: test');
      expect(content).toMatch(/Version: \d+\.\d+/);
    });

    it('should replace custom placeholders', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Custom: {custom-placeholder}');

      await config.processConfig(configPath, { '{custom-placeholder}': 'custom-value' });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toBe('Custom: custom-value');
    });

    it('should escape regex special characters in placeholders', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Path: {project-root}/test');

      // Test that {project-root} doesn't get interpreted as regex
      await config.processConfig(configPath, {
        root: '/path/with/special$chars^',
      });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toBe('Path: /path/with/special$chars^/test');
    });

    it('should handle placeholders with regex metacharacters in values', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, 'Value: {placeholder}');

      await config.processConfig(configPath, {
        '{placeholder}': String.raw`value with $1 and \backslash`,
      });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toBe(String.raw`Value: value with $1 and \backslash`);
    });

    it('should replace all occurrences of placeholder', async () => {
      const configPath = path.join(tmpDir, 'config.txt');
      await fs.writeFile(configPath, '{module} is here and {module} is there and {module} everywhere');

      await config.processConfig(configPath, { module: 'BMM' });

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toBe('BMM is here and BMM is there and BMM everywhere');
    });
  });

  describe('deepMerge()', () => {
    it('should merge shallow objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      const result = config.deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const target = { level1: { a: 1, b: 2 } };
      const source = { level1: { b: 3, c: 4 } };

      const result = config.deepMerge(target, source);

      expect(result.level1).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should not merge arrays (just replace)', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };

      const result = config.deepMerge(target, source);

      expect(result.items).toEqual([4, 5]); // Replaced, not merged
    });

    it('should handle null values', () => {
      const target = { a: 'value', b: null };
      const source = { a: null, c: 'new' };

      const result = config.deepMerge(target, source);

      expect(result).toEqual({ a: null, b: null, c: 'new' });
    });

    it('should not mutate original objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      config.deepMerge(target, source);

      expect(target).toEqual({ a: 1 });
      expect(source).toEqual({ b: 2 });
    });
  });

  describe('mergeConfigs()', () => {
    it('should delegate to deepMerge', () => {
      const base = { setting1: 'base' };
      const override = { setting2: 'override' };

      const result = config.mergeConfigs(base, override);

      expect(result).toEqual({ setting1: 'base', setting2: 'override' });
    });
  });

  describe('isObject()', () => {
    it('should return true for plain objects', () => {
      expect(config.isObject({})).toBe(true);
      expect(config.isObject({ key: 'value' })).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(config.isObject([])).toBe(false);
    });

    it('should return false for null', () => {
      expect(config.isObject(null)).toBeFalsy();
    });

    it('should return false for primitives', () => {
      expect(config.isObject('string')).toBe(false);
      expect(config.isObject(42)).toBe(false);
    });
  });

  describe('getValue() and setValue()', () => {
    it('should get value by dot notation path', () => {
      const obj = {
        level1: {
          level2: {
            value: 'test',
          },
        },
      };

      const result = config.getValue(obj, 'level1.level2.value');

      expect(result).toBe('test');
    });

    it('should set value by dot notation path', () => {
      const obj = {
        level1: {
          level2: {},
        },
      };

      config.setValue(obj, 'level1.level2.value', 'new value');

      expect(obj.level1.level2.value).toBe('new value');
    });

    it('should return default value for non-existent path', () => {
      const obj = { a: { b: 'value' } };

      const result = config.getValue(obj, 'a.c.d', 'default');

      expect(result).toBe('default');
    });

    it('should return null default when path not found', () => {
      const obj = { a: { b: 'value' } };

      const result = config.getValue(obj, 'a.c.d');

      expect(result).toBeNull();
    });

    it('should handle simple (non-nested) paths', () => {
      const obj = { key: 'value' };

      expect(config.getValue(obj, 'key')).toBe('value');

      config.setValue(obj, 'newKey', 'newValue');
      expect(obj.newKey).toBe('newValue');
    });

    it('should create intermediate objects when setting deep paths', () => {
      const obj = {};

      config.setValue(obj, 'a.b.c.d', 'deep value');

      expect(obj.a.b.c.d).toBe('deep value');
    });
  });

  describe('validateConfig()', () => {
    it('should validate required fields', () => {
      const cfg = { field1: 'value1' };
      const schema = {
        required: ['field1', 'field2'],
      };

      const result = config.validateConfig(cfg, schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: field2');
    });

    it('should pass when all required fields present', () => {
      const cfg = { field1: 'value1', field2: 'value2' };
      const schema = {
        required: ['field1', 'field2'],
      };

      const result = config.validateConfig(cfg, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate field types', () => {
      const cfg = {
        stringField: 'text',
        numberField: '42', // Wrong type
        arrayField: [1, 2, 3],
        objectField: 'not-object', // Wrong type
        boolField: true,
      };

      const schema = {
        properties: {
          stringField: { type: 'string' },
          numberField: { type: 'number' },
          arrayField: { type: 'array' },
          objectField: { type: 'object' },
          boolField: { type: 'boolean' },
        },
      };

      const result = config.validateConfig(cfg, schema);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('numberField'))).toBe(true);
      expect(result.errors.some((e) => e.includes('objectField'))).toBe(true);
    });

    it('should validate enum values', () => {
      const cfg = { level: 'expert' };
      const schema = {
        properties: {
          level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
        },
      };

      const result = config.validateConfig(cfg, schema);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('must be one of'))).toBe(true);
    });

    it('should pass validation for valid enum value', () => {
      const cfg = { level: 'intermediate' };
      const schema = {
        properties: {
          level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
        },
      };

      const result = config.validateConfig(cfg, schema);

      expect(result.valid).toBe(true);
    });

    it('should return warnings array', () => {
      const cfg = { field: 'value' };
      const schema = { required: ['field'] };

      const result = config.validateConfig(cfg, schema);

      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty YAML file', async () => {
      const configPath = path.join(tmpDir, 'empty.yaml');
      await fs.writeFile(configPath, '');

      const result = await config.loadYaml(configPath);

      expect(result).toBeNull(); // Empty YAML parses to null
    });

    it('should handle YAML with only comments', async () => {
      const configPath = path.join(tmpDir, 'comments.yaml');
      await fs.writeFile(configPath, '# Just a comment\n# Another comment\n');

      const result = await config.loadYaml(configPath);

      expect(result).toBeNull();
    });

    it('should handle very deep object nesting', () => {
      const deep = {
        l1: { l2: { l3: { l4: { l5: { l6: { l7: { l8: { value: 'deep' } } } } } } } },
      };
      const override = {
        l1: { l2: { l3: { l4: { l5: { l6: { l7: { l8: { value: 'updated' } } } } } } } },
      };

      const result = config.deepMerge(deep, override);

      expect(result.l1.l2.l3.l4.l5.l6.l7.l8.value).toBe('updated');
    });
  });
});
