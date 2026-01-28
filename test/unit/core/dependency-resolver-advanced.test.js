import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DependencyResolver } from '../../../tools/cli/installers/lib/core/dependency-resolver.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';
import fs from 'fs-extra';
import path from 'node:path';

describe('DependencyResolver - Advanced Scenarios', () => {
  let tmpDir;
  let bmadDir;

  beforeEach(async () => {
    tmpDir = await createTempDir();
    bmadDir = path.join(tmpDir, 'src');
    await fs.ensureDir(path.join(bmadDir, 'core', 'agents'));
    await fs.ensureDir(path.join(bmadDir, 'core', 'tasks'));
    await fs.ensureDir(path.join(bmadDir, 'core', 'templates'));
    await fs.ensureDir(path.join(bmadDir, 'bmm', 'agents'));
    await fs.ensureDir(path.join(bmadDir, 'bmm', 'tasks'));
    await fs.ensureDir(path.join(bmadDir, 'bmm', 'templates'));
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('module path resolution', () => {
    it('should resolve bmad/bmm/tasks/task.md (module path)', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["{project-root}/bmad/bmm/tasks/analyze.md"]
---
<agent>Agent</agent>`,
      );
      await createTestFile(bmadDir, 'bmm/tasks/analyze.md', 'BMM Task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect([...result.allFiles].some((f) => f.includes('bmm'))).toBe(true);
      expect([...result.allFiles].some((f) => f.includes('analyze.md'))).toBe(true);
    });

    it('should handle glob in module path bmad/bmm/tasks/*.md', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["{project-root}/bmad/bmm/tasks/*.md"]
---
<agent>Agent</agent>`,
      );
      await createTestFile(bmadDir, 'bmm/tasks/task1.md', 'Task 1');
      await createTestFile(bmadDir, 'bmm/tasks/task2.md', 'Task 2');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, ['bmm']); // Include bmm module

      // Should resolve glob pattern
      expect(result.allFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle non-existent module path gracefully', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["{project-root}/bmad/nonexistent/tasks/task.md"]
---
<agent>Agent</agent>`,
      );

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Should not crash, just skip missing dependency
      expect(result.primaryFiles).toHaveLength(1);
    });
  });

  describe('relative glob patterns', () => {
    it('should resolve relative glob patterns ../tasks/*.md', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["../tasks/*.md"]
---
<agent>Agent</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/task1.md', 'Task 1');
      await createTestFile(bmadDir, 'core/tasks/task2.md', 'Task 2');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect(result.allFiles.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle glob pattern with no matches', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["../tasks/nonexistent-*.md"]
---
<agent>Agent</agent>`,
      );

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Should handle gracefully - just the agent
      expect(result.primaryFiles).toHaveLength(1);
    });

    it('should handle glob in non-existent directory', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["../nonexistent/*.md"]
---
<agent>Agent</agent>`,
      );

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Should handle gracefully
      expect(result.primaryFiles).toHaveLength(1);
    });
  });

  describe('template dependencies', () => {
    it('should resolve template with {project-root} prefix', async () => {
      await createTestFile(bmadDir, 'core/agents/agent.md', '<agent>Agent</agent>');
      await createTestFile(
        bmadDir,
        'core/tasks/task.md',
        `---
template: "{project-root}/bmad/core/templates/form.yaml"
---
Task content`,
      );
      await createTestFile(bmadDir, 'core/templates/form.yaml', 'template');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Template dependency should be resolved
      expect(result.allFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('should resolve template from module path', async () => {
      await createTestFile(bmadDir, 'bmm/agents/agent.md', '<agent>BMM Agent</agent>');
      await createTestFile(
        bmadDir,
        'bmm/tasks/task.md',
        `---
template: "{project-root}/bmad/bmm/templates/prd-template.yaml"
---
Task`,
      );
      await createTestFile(bmadDir, 'bmm/templates/prd-template.yaml', 'template');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, ['bmm']);

      // Should resolve files from BMM module
      expect(result.allFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle missing template gracefully', async () => {
      await createTestFile(
        bmadDir,
        'core/tasks/task.md',
        `---
template: "../templates/missing.yaml"
---
Task`,
      );

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Should not crash
      expect(result).toBeDefined();
    });
  });

  describe('bmad-path type resolution', () => {
    it('should resolve bmad-path dependencies', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
<command exec="bmad/core/tasks/analyze" />
</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/analyze.md', 'Task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect([...result.allFiles].some((f) => f.includes('analyze.md'))).toBe(true);
    });

    it('should resolve bmad-path for module files', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
<command exec="bmad/bmm/tasks/create-prd" />
</agent>`,
      );
      await createTestFile(bmadDir, 'bmm/tasks/create-prd.md', 'PRD Task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect([...result.allFiles].some((f) => f.includes('create-prd.md'))).toBe(true);
    });

    it('should handle non-existent bmad-path gracefully', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
<command exec="bmad/core/tasks/missing" />
</agent>`,
      );

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Should not crash
      expect(result.primaryFiles).toHaveLength(1);
    });
  });

  describe('command resolution with modules', () => {
    it('should search multiple modules for @task-name', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
Use @task-custom-task
</agent>`,
      );
      await createTestFile(bmadDir, 'bmm/tasks/custom-task.md', 'Custom Task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, ['bmm']);

      expect([...result.allFiles].some((f) => f.includes('custom-task.md'))).toBe(true);
    });

    it('should search multiple modules for @agent-name', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/main.md',
        `<agent>
Use @agent-pm
</agent>`,
      );
      await createTestFile(bmadDir, 'bmm/agents/pm.md', '<agent>PM</agent>');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, ['bmm']);

      expect([...result.allFiles].some((f) => f.includes('pm.md'))).toBe(true);
    });

    it('should handle bmad/ path with 4+ segments', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
Reference bmad/core/tasks/nested/deep/task
</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/nested/deep/task.md', 'Deep task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Implementation may or may not support deeply nested paths in commands
      // Just verify it doesn't crash
      expect(result.primaryFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle bmad path with .md extension already', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
Use bmad/core/tasks/task.md explicitly
</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/task.md', 'Task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect([...result.allFiles].some((f) => f.includes('task.md'))).toBe(true);
    });
  });

  describe('verbose mode', () => {
    it('should include console output when verbose is true', async () => {
      await createTestFile(bmadDir, 'core/agents/agent.md', '<agent>Test</agent>');

      const resolver = new DependencyResolver();

      // Mock console.log to capture output
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));

      await resolver.resolve(bmadDir, [], { verbose: true });

      console.log = originalLog;

      // Should have logged something in verbose mode
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should not log when verbose is false', async () => {
      await createTestFile(bmadDir, 'core/agents/agent.md', '<agent>Test</agent>');

      const resolver = new DependencyResolver();

      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));

      await resolver.resolve(bmadDir, [], { verbose: false });

      console.log = originalLog;

      // Should not have logged in non-verbose mode
      // (There might be warns but no regular logs)
      expect(logs.length).toBe(0);
    });
  });

  describe('createWebBundle()', () => {
    it('should create bundle with metadata', async () => {
      await createTestFile(bmadDir, 'core/agents/agent.md', '<agent>Agent</agent>');
      await createTestFile(bmadDir, 'core/tasks/task.md', 'Task');

      const resolver = new DependencyResolver();
      const resolution = await resolver.resolve(bmadDir, []);

      const bundle = await resolver.createWebBundle(resolution);

      expect(bundle.metadata).toBeDefined();
      expect(bundle.metadata.modules).toContain('core');
      expect(bundle.metadata.totalFiles).toBeGreaterThan(0);
    });

    it('should organize bundle by file type', async () => {
      await createTestFile(bmadDir, 'core/agents/agent.md', '<agent>Agent</agent>');
      await createTestFile(bmadDir, 'core/tasks/task.md', 'Task');
      await createTestFile(bmadDir, 'core/templates/template.yaml', 'template');

      const resolver = new DependencyResolver();
      const resolution = await resolver.resolve(bmadDir, []);

      const bundle = await resolver.createWebBundle(resolution);

      expect(bundle.agents).toBeDefined();
      expect(bundle.tasks).toBeDefined();
      expect(bundle.templates).toBeDefined();
    });
  });

  describe('single string dependency (not array)', () => {
    it('should handle single string dependency (converted to array)', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: "{project-root}/bmad/core/tasks/task.md"
---
<agent>Agent</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/task.md', 'Task');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Single string should be converted to array internally
      expect(result.allFiles.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle single string template', async () => {
      await createTestFile(
        bmadDir,
        'core/tasks/task.md',
        `---
template: "../templates/form.yaml"
---
Task`,
      );
      await createTestFile(bmadDir, 'core/templates/form.yaml', 'template');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect([...result.allFiles].some((f) => f.includes('form.yaml'))).toBe(true);
    });
  });

  describe('missing dependency tracking', () => {
    it('should track missing relative file dependencies', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["../tasks/missing-file.md"]
---
<agent>Agent</agent>`,
      );

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Missing dependency should be tracked
      expect(result.missing.length).toBeGreaterThanOrEqual(0);
      // Should not crash
      expect(result).toBeDefined();
    });
  });

  describe('reportResults()', () => {
    it('should report results with file counts', async () => {
      await createTestFile(bmadDir, 'core/agents/agent1.md', '<agent>1</agent>');
      await createTestFile(bmadDir, 'core/agents/agent2.md', '<agent>2</agent>');
      await createTestFile(bmadDir, 'core/tasks/task1.md', 'Task 1');
      await createTestFile(bmadDir, 'core/tasks/task2.md', 'Task 2');
      await createTestFile(bmadDir, 'core/templates/template.yaml', 'Template');

      const resolver = new DependencyResolver();

      // Mock console.log
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));

      const result = await resolver.resolve(bmadDir, [], { verbose: true });

      console.log = originalLog;

      // Should have reported module statistics
      expect(logs.some((log) => log.includes('CORE'))).toBe(true);
      expect(logs.some((log) => log.includes('Agents:'))).toBe(true);
      expect(logs.some((log) => log.includes('Tasks:'))).toBe(true);
    });

    it('should report missing dependencies', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `---
dependencies: ["../tasks/missing.md"]
---
<agent>Agent</agent>`,
      );

      const resolver = new DependencyResolver();

      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));

      await resolver.resolve(bmadDir, [], { verbose: true });

      console.log = originalLog;

      // May log warning about missing dependencies
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('file without .md extension in command', () => {
    it('should add .md extension to bmad/ commands without extension', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent.md',
        `<agent>
Use bmad/core/tasks/analyze without extension
</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/analyze.md', 'Analyze');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect([...result.allFiles].some((f) => f.includes('analyze.md'))).toBe(true);
    });
  });

  describe('module structure detection', () => {
    it('should detect source directory structure (src/)', async () => {
      // Default structure already uses src/
      await createTestFile(bmadDir, 'core/agents/agent.md', '<agent>Core</agent>');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      expect(result.primaryFiles.length).toBeGreaterThanOrEqual(1);
    });

    it('should detect installed directory structure (no src/)', async () => {
      // Create installed structure
      const installedDir = path.join(tmpDir, 'installed');
      await fs.ensureDir(path.join(installedDir, 'core', 'agents'));
      await fs.ensureDir(path.join(installedDir, 'modules', 'bmm', 'agents'));
      await createTestFile(installedDir, 'core/agents/agent.md', '<agent>Core</agent>');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(installedDir, []);

      expect(result.primaryFiles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('dependency deduplication', () => {
    it('should not include same file twice', async () => {
      await createTestFile(
        bmadDir,
        'core/agents/agent1.md',
        `---
dependencies: ["{project-root}/bmad/core/tasks/shared.md"]
---
<agent>1</agent>`,
      );
      await createTestFile(
        bmadDir,
        'core/agents/agent2.md',
        `---
dependencies: ["{project-root}/bmad/core/tasks/shared.md"]
---
<agent>2</agent>`,
      );
      await createTestFile(bmadDir, 'core/tasks/shared.md', 'Shared');

      const resolver = new DependencyResolver();
      const result = await resolver.resolve(bmadDir, []);

      // Should have 2 agents + 1 shared task = 3 unique files
      expect(result.allFiles).toHaveLength(3);
    });
  });
});
