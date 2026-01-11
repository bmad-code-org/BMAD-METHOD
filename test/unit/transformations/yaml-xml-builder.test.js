import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { YamlXmlBuilder } from '../../../tools/cli/lib/yaml-xml-builder.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';
import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'yaml';

describe('YamlXmlBuilder', () => {
  let tmpDir;
  let builder;

  beforeEach(async () => {
    tmpDir = await createTempDir();
    builder = new YamlXmlBuilder();
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('deepMerge()', () => {
    it('should merge shallow objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      const result = builder.deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const target = { level1: { a: 1, b: 2 } };
      const source = { level1: { b: 3, c: 4 } };

      const result = builder.deepMerge(target, source);

      expect(result).toEqual({ level1: { a: 1, b: 3, c: 4 } });
    });

    it('should merge deeply nested objects', () => {
      const target = { l1: { l2: { l3: { value: 'old' } } } };
      const source = { l1: { l2: { l3: { value: 'new', extra: 'data' } } } };

      const result = builder.deepMerge(target, source);

      expect(result).toEqual({ l1: { l2: { l3: { value: 'new', extra: 'data' } } } });
    });

    it('should append arrays instead of replacing', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5, 6] };

      const result = builder.deepMerge(target, source);

      expect(result.items).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle arrays in nested objects', () => {
      const target = { config: { values: ['a', 'b'] } };
      const source = { config: { values: ['c', 'd'] } };

      const result = builder.deepMerge(target, source);

      expect(result.config.values).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should replace arrays if target is not an array', () => {
      const target = { items: 'string' };
      const source = { items: ['a', 'b'] };

      const result = builder.deepMerge(target, source);

      expect(result.items).toEqual(['a', 'b']);
    });

    it('should handle null values', () => {
      const target = { a: null, b: 2 };
      const source = { a: 1, c: null };

      const result = builder.deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 2, c: null });
    });

    it('should preserve target values when source has no override', () => {
      const target = { a: 1, b: 2, c: 3 };
      const source = { d: 4 };

      const result = builder.deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should not mutate original objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      builder.deepMerge(target, source);

      expect(target).toEqual({ a: 1 }); // Unchanged
      expect(source).toEqual({ b: 2 }); // Unchanged
    });
  });

  describe('isObject()', () => {
    it('should return true for plain objects', () => {
      expect(builder.isObject({})).toBe(true);
      expect(builder.isObject({ key: 'value' })).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(builder.isObject([])).toBe(false);
      expect(builder.isObject([1, 2, 3])).toBe(false);
    });

    it('should return falsy for null', () => {
      expect(builder.isObject(null)).toBeFalsy();
    });

    it('should return falsy for primitives', () => {
      expect(builder.isObject('string')).toBeFalsy();
      expect(builder.isObject(42)).toBeFalsy();
      expect(builder.isObject(true)).toBeFalsy();
      expect(builder.isObject()).toBeFalsy();
    });
  });

  describe('loadAndMergeAgent()', () => {
    it('should load agent YAML without customization', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test Agent', icon: '🔧' },
          persona: {
            role: 'Test Role',
            identity: 'Test Identity',
            communication_style: 'Professional',
            principles: ['Principle 1'],
          },
          menu: [],
        },
      };

      const agentPath = path.join(tmpDir, 'agent.yaml');
      await fs.writeFile(agentPath, yaml.stringify(agentYaml));

      const result = await builder.loadAndMergeAgent(agentPath);

      expect(result.agent.metadata.id).toBe('test');
      expect(result.agent.persona.role).toBe('Test Role');
    });

    it('should preserve base persona when customize has empty strings', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: {
            role: 'Base Role',
            identity: 'Base Identity',
            communication_style: 'Base Style',
            principles: ['Base Principle'],
          },
          menu: [],
        },
      };

      const customizeYaml = {
        persona: {
          role: 'Custom Role',
          identity: '', // Empty - should NOT override
          communication_style: 'Custom Style',
          // principles omitted
        },
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.persona.role).toBe('Custom Role'); // Overridden
      expect(result.agent.persona.identity).toBe('Base Identity'); // Preserved
      expect(result.agent.persona.communication_style).toBe('Custom Style'); // Overridden
      expect(result.agent.persona.principles).toEqual(['Base Principle']); // Preserved
    });

    it('should preserve base persona when customize has null values', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: {
            role: 'Base Role',
            identity: 'Base Identity',
            communication_style: 'Base Style',
            principles: ['Base'],
          },
          menu: [],
        },
      };

      const customizeYaml = {
        persona: {
          role: null,
          identity: 'Custom Identity',
        },
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.persona.role).toBe('Base Role'); // Preserved (null skipped)
      expect(result.agent.persona.identity).toBe('Custom Identity'); // Overridden
    });

    it('should preserve base persona when customize has empty arrays', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: {
            role: 'Base Role',
            identity: 'Base Identity',
            communication_style: 'Base Style',
            principles: ['Principle 1', 'Principle 2'],
          },
          menu: [],
        },
      };

      const customizeYaml = {
        persona: {
          principles: [], // Empty array - should NOT override
        },
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.persona.principles).toEqual(['Principle 1', 'Principle 2']);
    });

    it('should append menu items from customize', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: { role: 'Role', identity: 'ID', communication_style: 'Style', principles: ['P'] },
          menu: [{ trigger: 'help', description: 'Help', action: 'show_help' }],
        },
      };

      const customizeYaml = {
        menu: [{ trigger: 'custom', description: 'Custom', action: 'custom_action' }],
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.menu).toHaveLength(2);
      expect(result.agent.menu[0].trigger).toBe('help');
      expect(result.agent.menu[1].trigger).toBe('custom');
    });

    it('should append critical_actions from customize', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: { role: 'Role', identity: 'ID', communication_style: 'Style', principles: ['P'] },
          critical_actions: ['Action 1'],
          menu: [],
        },
      };

      const customizeYaml = {
        critical_actions: ['Action 2', 'Action 3'],
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.critical_actions).toHaveLength(3);
      expect(result.agent.critical_actions).toEqual(['Action 1', 'Action 2', 'Action 3']);
    });

    it('should append prompts from customize', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: { role: 'Role', identity: 'ID', communication_style: 'Style', principles: ['P'] },
          prompts: [{ id: 'p1', content: 'Prompt 1' }],
          menu: [],
        },
      };

      const customizeYaml = {
        prompts: [{ id: 'p2', content: 'Prompt 2' }],
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.prompts).toHaveLength(2);
    });

    it('should handle missing customization file', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: { role: 'Role', identity: 'ID', communication_style: 'Style', principles: ['P'] },
          menu: [],
        },
      };

      const agentPath = path.join(tmpDir, 'agent.yaml');
      await fs.writeFile(agentPath, yaml.stringify(agentYaml));

      const nonExistent = path.join(tmpDir, 'nonexistent.yaml');
      const result = await builder.loadAndMergeAgent(agentPath, nonExistent);

      expect(result.agent.metadata.id).toBe('test');
    });

    it('should handle legacy commands field (renamed to menu)', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base', title: 'Base', icon: '🔧' },
          persona: { role: 'Role', identity: 'ID', communication_style: 'Style', principles: ['P'] },
          commands: [{ trigger: 'old', description: 'Old', action: 'old_action' }],
        },
      };

      const customizeYaml = {
        commands: [{ trigger: 'new', description: 'New', action: 'new_action' }],
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.commands).toHaveLength(2);
    });

    it('should override metadata with non-empty values', async () => {
      const baseYaml = {
        agent: {
          metadata: { id: 'base', name: 'Base Name', title: 'Base Title', icon: '🔧' },
          persona: { role: 'Role', identity: 'ID', communication_style: 'Style', principles: ['P'] },
          menu: [],
        },
      };

      const customizeYaml = {
        agent: {
          metadata: {
            name: 'Custom Name',
            title: '', // Empty - should be skipped
            icon: '🎯',
          },
        },
      };

      const basePath = path.join(tmpDir, 'base.yaml');
      const customizePath = path.join(tmpDir, 'customize.yaml');
      await fs.writeFile(basePath, yaml.stringify(baseYaml));
      await fs.writeFile(customizePath, yaml.stringify(customizeYaml));

      const result = await builder.loadAndMergeAgent(basePath, customizePath);

      expect(result.agent.metadata.name).toBe('Custom Name');
      expect(result.agent.metadata.title).toBe('Base Title'); // Preserved
      expect(result.agent.metadata.icon).toBe('🎯');
    });
  });

  describe('buildPersonaXml()', () => {
    it('should build complete persona XML', () => {
      const persona = {
        role: 'Test Role',
        identity: 'Test Identity',
        communication_style: 'Professional',
        principles: ['Principle 1', 'Principle 2', 'Principle 3'],
      };

      const xml = builder.buildPersonaXml(persona);

      expect(xml).toContain('<persona>');
      expect(xml).toContain('</persona>');
      expect(xml).toContain('<role>Test Role</role>');
      expect(xml).toContain('<identity>Test Identity</identity>');
      expect(xml).toContain('<communication_style>Professional</communication_style>');
      expect(xml).toContain('<principles>Principle 1 Principle 2 Principle 3</principles>');
    });

    it('should escape XML special characters in persona', () => {
      const persona = {
        role: 'Role with <tags> & "quotes"',
        identity: "O'Reilly's Identity",
        communication_style: 'Use <code> tags',
        principles: ['Principle with & ampersand'],
      };

      const xml = builder.buildPersonaXml(persona);

      expect(xml).toContain('&lt;tags&gt; &amp; &quot;quotes&quot;');
      expect(xml).toContain('O&apos;Reilly&apos;s Identity');
      expect(xml).toContain('&lt;code&gt; tags');
      expect(xml).toContain('&amp; ampersand');
    });

    it('should handle principles as array', () => {
      const persona = {
        role: 'Role',
        identity: 'ID',
        communication_style: 'Style',
        principles: ['P1', 'P2', 'P3'],
      };

      const xml = builder.buildPersonaXml(persona);

      expect(xml).toContain('<principles>P1 P2 P3</principles>');
    });

    it('should handle principles as string', () => {
      const persona = {
        role: 'Role',
        identity: 'ID',
        communication_style: 'Style',
        principles: 'Single principle string',
      };

      const xml = builder.buildPersonaXml(persona);

      expect(xml).toContain('<principles>Single principle string</principles>');
    });

    it('should preserve Unicode in persona fields', () => {
      const persona = {
        role: 'Тестовая роль',
        identity: '日本語のアイデンティティ',
        communication_style: 'Estilo profesional',
        principles: ['原则一', 'Принцип два'],
      };

      const xml = builder.buildPersonaXml(persona);

      expect(xml).toContain('Тестовая роль');
      expect(xml).toContain('日本語のアイデンティティ');
      expect(xml).toContain('Estilo profesional');
      expect(xml).toContain('原则一 Принцип два');
    });

    it('should handle missing persona gracefully', () => {
      const xml = builder.buildPersonaXml(null);

      expect(xml).toBe('');
    });

    it('should handle partial persona (missing optional fields)', () => {
      const persona = {
        role: 'Role',
        identity: 'ID',
        communication_style: 'Style',
        // principles missing
      };

      const xml = builder.buildPersonaXml(persona);

      expect(xml).toContain('<role>Role</role>');
      expect(xml).toContain('<identity>ID</identity>');
      expect(xml).toContain('<communication_style>Style</communication_style>');
      expect(xml).not.toContain('<principles>');
    });
  });

  describe('buildMemoriesXml()', () => {
    it('should build memories XML from array', () => {
      const memories = ['Memory 1', 'Memory 2', 'Memory 3'];

      const xml = builder.buildMemoriesXml(memories);

      expect(xml).toContain('<memories>');
      expect(xml).toContain('</memories>');
      expect(xml).toContain('<memory>Memory 1</memory>');
      expect(xml).toContain('<memory>Memory 2</memory>');
      expect(xml).toContain('<memory>Memory 3</memory>');
    });

    it('should escape XML special characters in memories', () => {
      const memories = ['Memory with <tags>', 'Memory with & ampersand', 'Memory with "quotes"'];

      const xml = builder.buildMemoriesXml(memories);

      expect(xml).toContain('&lt;tags&gt;');
      expect(xml).toContain('&amp; ampersand');
      expect(xml).toContain('&quot;quotes&quot;');
    });

    it('should return empty string for null memories', () => {
      expect(builder.buildMemoriesXml(null)).toBe('');
    });

    it('should return empty string for empty array', () => {
      expect(builder.buildMemoriesXml([])).toBe('');
    });

    it('should handle Unicode in memories', () => {
      const memories = ['记忆 1', 'Память 2', '記憶 3'];

      const xml = builder.buildMemoriesXml(memories);

      expect(xml).toContain('记忆 1');
      expect(xml).toContain('Память 2');
      expect(xml).toContain('記憶 3');
    });
  });

  describe('buildPromptsXml()', () => {
    it('should build prompts XML from array format', () => {
      const prompts = [
        { id: 'p1', content: 'Prompt 1 content' },
        { id: 'p2', content: 'Prompt 2 content' },
      ];

      const xml = builder.buildPromptsXml(prompts);

      expect(xml).toContain('<prompts>');
      expect(xml).toContain('</prompts>');
      expect(xml).toContain('<prompt id="p1">');
      expect(xml).toContain('<content>');
      expect(xml).toContain('Prompt 1 content');
      expect(xml).toContain('<prompt id="p2">');
      expect(xml).toContain('Prompt 2 content');
    });

    it('should escape XML special characters in prompts', () => {
      const prompts = [{ id: 'test', content: 'Content with <tags> & "quotes"' }];

      const xml = builder.buildPromptsXml(prompts);

      expect(xml).toContain('<content>');
      expect(xml).toContain('&lt;tags&gt; &amp; &quot;quotes&quot;');
    });

    it('should return empty string for null prompts', () => {
      expect(builder.buildPromptsXml(null)).toBe('');
    });

    it('should handle Unicode in prompts', () => {
      const prompts = [{ id: 'unicode', content: 'Test 测试 тест テスト' }];

      const xml = builder.buildPromptsXml(prompts);

      expect(xml).toContain('<content>');
      expect(xml).toContain('测试 тест テスト');
    });

    it('should handle object/dictionary format prompts', () => {
      const prompts = {
        p1: 'Prompt 1 content',
        p2: 'Prompt 2 content',
      };

      const xml = builder.buildPromptsXml(prompts);

      expect(xml).toContain('<prompts>');
      expect(xml).toContain('<prompt id="p1">');
      expect(xml).toContain('Prompt 1 content');
      expect(xml).toContain('<prompt id="p2">');
      expect(xml).toContain('Prompt 2 content');
    });

    it('should return empty string for empty array', () => {
      expect(builder.buildPromptsXml([])).toBe('');
    });
  });

  describe('calculateFileHash()', () => {
    it('should calculate MD5 hash of file content', async () => {
      const content = 'test content for hashing';
      const filePath = await createTestFile(tmpDir, 'test.txt', content);

      const hash = await builder.calculateFileHash(filePath);

      expect(hash).toHaveLength(8); // MD5 truncated to 8 chars
      expect(hash).toMatch(/^[a-f0-9]{8}$/);
    });

    it('should return consistent hash for same content', async () => {
      const file1 = await createTestFile(tmpDir, 'file1.txt', 'content');
      const file2 = await createTestFile(tmpDir, 'file2.txt', 'content');

      const hash1 = await builder.calculateFileHash(file1);
      const hash2 = await builder.calculateFileHash(file2);

      expect(hash1).toBe(hash2);
    });

    it('should return null for non-existent file', async () => {
      const nonExistent = path.join(tmpDir, 'missing.txt');

      const hash = await builder.calculateFileHash(nonExistent);

      expect(hash).toBeNull();
    });

    it('should handle empty file', async () => {
      const file = await createTestFile(tmpDir, 'empty.txt', '');

      const hash = await builder.calculateFileHash(file);

      expect(hash).toHaveLength(8);
    });
  });
});
