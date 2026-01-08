import { describe, it, expect, beforeEach } from 'vitest';
import { YamlXmlBuilder } from '../../../tools/cli/lib/yaml-xml-builder.js';

describe('YamlXmlBuilder - buildCommandsXml()', () => {
  let builder;

  beforeEach(() => {
    builder = new YamlXmlBuilder();
  });

  describe('menu injection', () => {
    it('should always inject *menu item first', () => {
      const xml = builder.buildCommandsXml([]);

      expect(xml).toContain('<item cmd="*menu">[M] Redisplay Menu Options</item>');
    });

    it('should always inject *dismiss item last', () => {
      const xml = builder.buildCommandsXml([]);

      expect(xml).toContain('<item cmd="*dismiss">[D] Dismiss Agent</item>');
      // Should be at the end before </menu>
      expect(xml).toMatch(/\*dismiss.*<\/menu>/s);
    });

    it('should place user items between *menu and *dismiss', () => {
      const menuItems = [{ trigger: 'help', description: 'Show help', action: 'show_help' }];

      const xml = builder.buildCommandsXml(menuItems);

      const menuIndex = xml.indexOf('*menu');
      const helpIndex = xml.indexOf('*help');
      const dismissIndex = xml.indexOf('*dismiss');

      expect(menuIndex).toBeLessThan(helpIndex);
      expect(helpIndex).toBeLessThan(dismissIndex);
    });
  });

  describe('legacy format items', () => {
    it('should add * prefix to triggers', () => {
      const menuItems = [{ trigger: 'help', description: 'Help', action: 'show_help' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('cmd="*help"');
      expect(xml).not.toContain('cmd="help"'); // Should not have unprefixed version
    });

    it('should preserve * prefix if already present', () => {
      const menuItems = [{ trigger: '*custom', description: 'Custom', action: 'custom_action' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('cmd="*custom"');
      expect(xml).not.toContain('cmd="**custom"'); // Should not double-prefix
    });

    it('should include description as item content', () => {
      const menuItems = [{ trigger: 'analyze', description: '[A] Analyze code', action: 'analyze' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('>[A] Analyze code</item>');
    });

    it('should escape XML special characters in description', () => {
      const menuItems = [
        {
          trigger: 'test',
          description: 'Test <brackets> & "quotes"',
          action: 'test',
        },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('&lt;brackets&gt; &amp; &quot;quotes&quot;');
    });
  });

  describe('handler attributes', () => {
    it('should include workflow attribute', () => {
      const menuItems = [{ trigger: 'start', description: 'Start workflow', workflow: 'main-workflow' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('workflow="main-workflow"');
    });

    it('should include exec attribute', () => {
      const menuItems = [{ trigger: 'run', description: 'Run task', exec: 'path/to/task.md' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('exec="path/to/task.md"');
    });

    it('should include action attribute', () => {
      const menuItems = [{ trigger: 'help', description: 'Help', action: 'show_help' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('action="show_help"');
    });

    it('should include tmpl attribute', () => {
      const menuItems = [{ trigger: 'form', description: 'Form', tmpl: 'templates/form.yaml' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('tmpl="templates/form.yaml"');
    });

    it('should include data attribute', () => {
      const menuItems = [{ trigger: 'load', description: 'Load', data: 'data/config.json' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('data="data/config.json"');
    });

    it('should include validate-workflow attribute', () => {
      const menuItems = [
        {
          trigger: 'validate',
          description: 'Validate',
          'validate-workflow': 'validation-flow',
        },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('validate-workflow="validation-flow"');
    });

    it('should prioritize workflow-install over workflow', () => {
      const menuItems = [
        {
          trigger: 'start',
          description: 'Start',
          workflow: 'original',
          'workflow-install': 'installed-location',
        },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('workflow="installed-location"');
      expect(xml).not.toContain('workflow="original"');
    });

    it('should handle multiple attributes on same item', () => {
      const menuItems = [
        {
          trigger: 'complex',
          description: 'Complex command',
          workflow: 'flow',
          data: 'data.json',
          action: 'custom',
        },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('workflow="flow"');
      expect(xml).toContain('data="data.json"');
      expect(xml).toContain('action="custom"');
    });
  });

  describe('IDE and web filtering', () => {
    it('should include ide-only items for IDE installation', () => {
      const menuItems = [
        { trigger: 'local', description: 'Local only', action: 'local', 'ide-only': true },
        { trigger: 'normal', description: 'Normal', action: 'normal' },
      ];

      const xml = builder.buildCommandsXml(menuItems, false);

      expect(xml).toContain('*local');
      expect(xml).toContain('*normal');
    });

    it('should skip ide-only items for web bundle', () => {
      const menuItems = [
        { trigger: 'local', description: 'Local only', action: 'local', 'ide-only': true },
        { trigger: 'normal', description: 'Normal', action: 'normal' },
      ];

      const xml = builder.buildCommandsXml(menuItems, true);

      expect(xml).not.toContain('*local');
      expect(xml).toContain('*normal');
    });

    it('should include web-only items for web bundle', () => {
      const menuItems = [
        { trigger: 'web', description: 'Web only', action: 'web', 'web-only': true },
        { trigger: 'normal', description: 'Normal', action: 'normal' },
      ];

      const xml = builder.buildCommandsXml(menuItems, true);

      expect(xml).toContain('*web');
      expect(xml).toContain('*normal');
    });

    it('should skip web-only items for IDE installation', () => {
      const menuItems = [
        { trigger: 'web', description: 'Web only', action: 'web', 'web-only': true },
        { trigger: 'normal', description: 'Normal', action: 'normal' },
      ];

      const xml = builder.buildCommandsXml(menuItems, false);

      expect(xml).not.toContain('*web');
      expect(xml).toContain('*normal');
    });
  });

  describe('multi format with nested handlers', () => {
    it('should build multi format items with nested handlers', () => {
      const menuItems = [
        {
          multi: '[TS] Technical Specification',
          triggers: [
            {
              'tech-spec': [{ input: 'Create technical specification' }, { route: 'workflows/tech-spec.yaml' }],
            },
            {
              TS: [{ input: 'Create technical specification' }, { route: 'workflows/tech-spec.yaml' }],
            },
          ],
        },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('<item type="multi">');
      expect(xml).toContain('[TS] Technical Specification');
      expect(xml).toContain('<handler');
      expect(xml).toContain('match="Create technical specification"');
      expect(xml).toContain('</item>');
    });

    it('should escape XML in multi description', () => {
      const menuItems = [
        {
          multi: '[A] Analyze <code>',
          triggers: [
            {
              analyze: [{ input: 'Analyze', route: 'task.md' }],
            },
          ],
        },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('&lt;code&gt;');
    });
  });

  describe('edge cases', () => {
    it('should handle empty menu items array', () => {
      const xml = builder.buildCommandsXml([]);

      expect(xml).toContain('<menu>');
      expect(xml).toContain('</menu>');
      expect(xml).toContain('*menu');
      expect(xml).toContain('*dismiss');
    });

    it('should handle null menu items', () => {
      const xml = builder.buildCommandsXml(null);

      expect(xml).toContain('<menu>');
      expect(xml).toContain('*menu');
      expect(xml).toContain('*dismiss');
    });

    it('should handle undefined menu items', () => {
      const xml = builder.buildCommandsXml();

      expect(xml).toContain('<menu>');
    });

    it('should handle empty description', () => {
      const menuItems = [{ trigger: 'test', description: '', action: 'test' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('cmd="*test"');
      expect(xml).toContain('></item>'); // Empty content between tags
    });

    it('should handle missing trigger (edge case)', () => {
      const menuItems = [{ description: 'No trigger', action: 'test' }];

      const xml = builder.buildCommandsXml(menuItems);

      // Should handle gracefully - might skip or add * prefix to empty
      expect(xml).toContain('<menu>');
    });

    it('should handle Unicode in descriptions', () => {
      const menuItems = [{ trigger: 'test', description: '[测试] Test 日本語', action: 'test' }];

      const xml = builder.buildCommandsXml(menuItems);

      expect(xml).toContain('测试');
      expect(xml).toContain('日本語');
    });
  });

  describe('multiple menu items', () => {
    it('should process all menu items in order', () => {
      const menuItems = [
        { trigger: 'first', description: 'First', action: 'first' },
        { trigger: 'second', description: 'Second', action: 'second' },
        { trigger: 'third', description: 'Third', action: 'third' },
      ];

      const xml = builder.buildCommandsXml(menuItems);

      const firstIndex = xml.indexOf('*first');
      const secondIndex = xml.indexOf('*second');
      const thirdIndex = xml.indexOf('*third');

      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
    });
  });
});
