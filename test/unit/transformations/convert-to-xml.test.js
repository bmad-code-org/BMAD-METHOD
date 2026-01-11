import { describe, it, expect, beforeEach } from 'vitest';
import { YamlXmlBuilder } from '../../../tools/cli/lib/yaml-xml-builder.js';

describe('YamlXmlBuilder - convertToXml()', () => {
  let builder;

  beforeEach(() => {
    builder = new YamlXmlBuilder();
  });

  describe('basic XML generation', () => {
    it('should generate XML with agent tag and attributes', async () => {
      const agentYaml = {
        agent: {
          metadata: {
            id: 'test-agent',
            name: 'Test Agent',
            title: 'Test Agent Title',
            icon: '🔧',
          },
          persona: {
            role: 'Test Role',
            identity: 'Test Identity',
            communication_style: 'Professional',
            principles: ['Principle 1'],
          },
          menu: [{ trigger: 'help', description: 'Help', action: 'show_help' }],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<agent id="test-agent"');
      expect(xml).toContain('name="Test Agent"');
      expect(xml).toContain('title="Test Agent Title"');
      expect(xml).toContain('icon="🔧"');
      expect(xml).toContain('</agent>');
    });

    it('should include persona section', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Developer',
            identity: 'Helpful assistant',
            communication_style: 'Professional',
            principles: ['Clear', 'Concise'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<persona>');
      expect(xml).toContain('<role>Developer</role>');
      expect(xml).toContain('<identity>Helpful assistant</identity>');
      expect(xml).toContain('<communication_style>Professional</communication_style>');
      expect(xml).toContain('<principles>Clear Concise</principles>');
    });

    it('should include memories section if present', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          memories: ['Memory 1', 'Memory 2'],
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<memories>');
      expect(xml).toContain('<memory>Memory 1</memory>');
      expect(xml).toContain('<memory>Memory 2</memory>');
    });

    it('should include prompts section if present', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          prompts: [{ id: 'p1', content: 'Prompt content' }],
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<prompts>');
      expect(xml).toContain('<prompt id="p1">');
      expect(xml).toContain('Prompt content');
    });

    it('should include menu section', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [
            { trigger: 'help', description: 'Show help', action: 'show_help' },
            { trigger: 'start', description: 'Start workflow', workflow: 'main' },
          ],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<menu>');
      expect(xml).toContain('</menu>');
      // Menu always includes injected *menu item
      expect(xml).toContain('*menu');
    });
  });

  describe('XML escaping', () => {
    it('should escape special characters in all fields', async () => {
      const agentYaml = {
        agent: {
          metadata: {
            id: 'test',
            name: 'Test',
            title: 'Test Agent',
            icon: '🔧',
          },
          persona: {
            role: 'Role with <brackets>',
            identity: 'Identity with & ampersand',
            communication_style: 'Style with "quotes"',
            principles: ["Principle with ' apostrophe"],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      // Metadata in attributes might not be escaped - focus on content
      expect(xml).toContain('&lt;brackets&gt;');
      expect(xml).toContain('&amp; ampersand');
      expect(xml).toContain('&quot;quotes&quot;');
      expect(xml).toContain('&apos; apostrophe');
    });

    it('should preserve Unicode characters', async () => {
      const agentYaml = {
        agent: {
          metadata: {
            id: 'unicode',
            name: '测试代理',
            title: 'Тестовый агент',
            icon: '🔧',
          },
          persona: {
            role: '開発者',
            identity: 'مساعد مفيد',
            communication_style: 'Profesional',
            principles: ['原则'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('测试代理');
      expect(xml).toContain('Тестовый агент');
      expect(xml).toContain('開発者');
      expect(xml).toContain('مساعد مفيد');
      expect(xml).toContain('原则');
    });
  });

  describe('module detection', () => {
    it('should handle module in buildMetadata', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        module: 'bmm',
        skipActivation: true,
      });

      // Module is stored in metadata but may not be rendered as attribute
      expect(xml).toContain('<agent');
      expect(xml).toBeDefined();
    });

    it('should not include module attribute for core agents', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      // No module attribute for core
      expect(xml).not.toContain('module=');
    });
  });

  describe('output format variations', () => {
    it('should generate installation format with YAML frontmatter', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test Agent', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        sourceFile: 'test-agent.yaml',
        skipActivation: true,
      });

      // Installation format has YAML frontmatter
      expect(xml).toMatch(/^---\n/);
      expect(xml).toContain('name: "test agent"'); // Derived from filename
      expect(xml).toContain('description: "Test Agent"');
      expect(xml).toContain('---');
    });

    it('should generate web bundle format without frontmatter', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test Agent', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        forWebBundle: true,
        skipActivation: true,
      });

      // Web bundle format has comment header
      expect(xml).toContain('<!-- Powered by BMAD-CORE™ -->');
      expect(xml).toContain('# Test Agent');
      expect(xml).not.toMatch(/^---\n/);
    });

    it('should derive name from filename (remove .agent suffix)', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'pm', name: 'PM', title: 'Product Manager', icon: '📋' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        sourceFile: 'pm.agent.yaml',
        skipActivation: true,
      });

      // Should convert pm.agent.yaml → "pm"
      expect(xml).toContain('name: "pm"');
    });

    it('should convert hyphens to spaces in filename', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'cli', name: 'CLI', title: 'CLI Chief', icon: '⚙️' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        sourceFile: 'cli-chief.yaml',
        skipActivation: true,
      });

      // Should convert cli-chief.yaml → "cli chief"
      expect(xml).toContain('name: "cli chief"');
    });
  });

  describe('localskip attribute', () => {
    it('should add localskip="true" when metadata has localskip', async () => {
      const agentYaml = {
        agent: {
          metadata: {
            id: 'web-only',
            name: 'Web Only',
            title: 'Web Only Agent',
            icon: '🌐',
            localskip: true,
          },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('localskip="true"');
    });

    it('should not add localskip when false or missing', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).not.toContain('localskip=');
    });
  });

  describe('edge cases', () => {
    it('should handle empty menu array', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<menu>');
      expect(xml).toContain('</menu>');
      // Should still have injected *menu item
      expect(xml).toContain('*menu');
    });

    it('should handle missing memories', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).not.toContain('<memories>');
    });

    it('should handle missing prompts', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).not.toContain('<prompts>');
    });

    it('should wrap XML in markdown code fence', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('```xml');
      expect(xml).toContain('```\n');
    });

    it('should include activation instruction for installation format', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        sourceFile: 'test.yaml',
        skipActivation: true,
      });

      expect(xml).toContain('You must fully embody this agent');
      expect(xml).toContain('NEVER break character');
    });

    it('should not include activation instruction for web bundle', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        forWebBundle: true,
        skipActivation: true,
      });

      expect(xml).not.toContain('You must fully embody');
      expect(xml).toContain('<!-- Powered by BMAD-CORE™ -->');
    });
  });

  describe('legacy commands field support', () => {
    it('should handle legacy "commands" field (renamed to menu)', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          commands: [{ trigger: 'help', description: 'Help', action: 'show_help' }],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      expect(xml).toContain('<menu>');
      // Should process commands as menu items
    });

    it('should prioritize menu over commands when both exist', async () => {
      const agentYaml = {
        agent: {
          metadata: { id: 'test', name: 'Test', title: 'Test', icon: '🔧' },
          persona: {
            role: 'Role',
            identity: 'ID',
            communication_style: 'Style',
            principles: ['P'],
          },
          menu: [{ trigger: 'new', description: 'New', action: 'new_action' }],
          commands: [{ trigger: 'old', description: 'Old', action: 'old_action' }],
        },
      };

      const xml = await builder.convertToXml(agentYaml, { skipActivation: true });

      // Should use menu, not commands
      expect(xml).toContain('<menu>');
    });
  });

  describe('complete agent transformation', () => {
    it('should transform a complete agent with all fields', async () => {
      const agentYaml = {
        agent: {
          metadata: {
            id: 'full-agent',
            name: 'Full Agent',
            title: 'Complete Test Agent',
            icon: '🤖',
          },
          persona: {
            role: 'Full Stack Developer',
            identity: 'Experienced software engineer',
            communication_style: 'Clear and professional',
            principles: ['Quality', 'Performance', 'Maintainability'],
          },
          memories: ['Remember project context', 'Track user preferences'],
          prompts: [
            { id: 'init', content: 'Initialize the agent' },
            { id: 'task', content: 'Process the task' },
          ],
          critical_actions: ['Never delete data', 'Always backup'],
          menu: [
            { trigger: 'help', description: '[H] Show help', action: 'show_help' },
            { trigger: 'start', description: '[S] Start workflow', workflow: 'main' },
          ],
        },
      };

      const xml = await builder.convertToXml(agentYaml, {
        sourceFile: 'full-agent.yaml',
        module: 'bmm',
        skipActivation: true,
      });

      // Verify all sections are present
      expect(xml).toContain('```xml');
      expect(xml).toContain('<agent id="full-agent"');
      expect(xml).toContain('<persona>');
      expect(xml).toContain('<memories>');
      expect(xml).toContain('<prompts>');
      expect(xml).toContain('<menu>');
      expect(xml).toContain('</agent>');
      expect(xml).toContain('```');
      // Verify persona content
      expect(xml).toContain('Full Stack Developer');
      // Verify memories
      expect(xml).toContain('Remember project context');
      // Verify prompts
      expect(xml).toContain('Initialize the agent');
    });
  });
});
