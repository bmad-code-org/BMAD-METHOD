const fs = require('fs-extra');
const path = require('node:path');
const glob = require('glob');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');

/**
 * Dependency Resolver for BMAD modules
 * Handles cross-module dependencies and ensures all required files are included
 */
class DependencyResolver {
  constructor() {
    this.dependencies = new Map();
    this.resolvedFiles = new Set();
    this.missingDependencies = new Set();
  }

  /**
   * Resolve all dependencies for selected modules
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} selectedModules - Modules explicitly selected by user
   * @param {Object} options - Resolution options
   * @returns {Object} Resolution results with all required files
   */
  async resolve(bmadDir, selectedModules = [], options = {}) {
    if (options.verbose) {
      await prompts.log.info('Resolving module dependencies...');
    }

    // Always include core as base
    const modulesToProcess = new Set(['core', ...selectedModules]);

    // First pass: collect all explicitly selected files
    const primaryFiles = await this.collectPrimaryFiles(bmadDir, modulesToProcess, options);

    // Second pass: parse and resolve dependencies
    const allDependencies = await this.parseDependencies(primaryFiles);

    // Third pass: resolve dependency paths and collect files
    const resolvedDeps = await this.resolveDependencyPaths(bmadDir, allDependencies);

    // Fourth pass: check for transitive dependencies
    const transitiveDeps = await this.resolveTransitiveDependencies(bmadDir, resolvedDeps);

    // Combine all files
    const allFiles = new Set([...primaryFiles.map((f) => f.path), ...resolvedDeps, ...transitiveDeps]);

    // Organize by module
    const organizedFiles = this.organizeByModule(bmadDir, allFiles);

    // Report results (only in verbose mode)
    if (options.verbose) {
      await this.reportResults(organizedFiles, selectedModules);
    }

    return {
      primaryFiles,
      dependencies: resolvedDeps,
      transitiveDependencies: transitiveDeps,
      allFiles: [...allFiles],
      byModule: organizedFiles,
      missing: [...this.missingDependencies],
    };
  }

  /**
   * Collect primary files from selected modules
   */
  async collectPrimaryFiles(bmadDir, modules, options = {}) {
    const files = [];
    const { moduleManager } = options;

    for (const module of modules) {
      // Skip external modules - they're installed from cache, not from source
      if (moduleManager && (await moduleManager.isExternalModule(module))) {
        continue;
      }

      // Handle both source (src/) and installed (bmad/) directory structures
      let moduleDir;

      // Check if this is a source directory (has 'src' subdirectory)
      const srcDir = path.join(bmadDir, 'src');
      if (await fs.pathExists(srcDir)) {
        // Source directory structure: src/core or src/bmm
        if (module === 'core') {
          moduleDir = path.join(srcDir, 'core');
        } else if (module === 'bmm') {
          moduleDir = path.join(srcDir, 'bmm');
        }
      }

      if (!moduleDir) {
        continue;
      }

      if (!(await fs.pathExists(moduleDir))) {
        await prompts.log.warn('Module directory not found: ' + moduleDir);
        continue;
      }

      // Collect agents
      const agentsDir = path.join(moduleDir, 'agents');
      if (await fs.pathExists(agentsDir)) {
        const agentFiles = await glob.glob('*.md', { cwd: agentsDir });
        for (const file of agentFiles) {
          const agentPath = path.join(agentsDir, file);

          // Check for localskip attribute
          const content = await fs.readFile(agentPath, 'utf8');
          const hasLocalSkip = content.match(/<agent[^>]*\slocalskip="true"[^>]*>/);
          if (hasLocalSkip) {
            continue; // Skip agents marked for web-only
          }

          files.push({
            path: agentPath,
            type: 'agent',
            module,
            name: path.basename(file, '.md'),
          });
        }
      }

      // Collect tasks
      const tasksDir = path.join(moduleDir, 'tasks');
      if (await fs.pathExists(tasksDir)) {
        const taskFiles = await glob.glob('*.md', { cwd: tasksDir });
        for (const file of taskFiles) {
          files.push({
            path: path.join(tasksDir, file),
            type: 'task',
            module,
            name: path.basename(file, '.md'),
          });
        }
      }
    }

    return files;
  }

  /**
   * Parse dependencies from file content
   */
  async parseDependencies(files) {
    const allDeps = new Set();

    for (const file of files) {
      const content = await fs.readFile(file.path, 'utf8');

      // Parse YAML frontmatter for explicit dependencies
      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (frontmatterMatch) {
        try {
          // Pre-process to handle backticks in YAML values
          let yamlContent = frontmatterMatch[1];
          // Quote values with backticks to make them valid YAML
          yamlContent = yamlContent.replaceAll(/: `([^`]+)`/g, ': "$1"');

          const frontmatter = yaml.parse(yamlContent);
          if (frontmatter.dependencies) {
            const deps = Array.isArray(frontmatter.dependencies) ? frontmatter.dependencies : [frontmatter.dependencies];

            for (const dep of deps) {
              allDeps.add({
                from: file.path,
                dependency: dep,
                type: 'explicit',
              });
            }
          }

          // Check for template dependencies
          if (frontmatter.template) {
            const templates = Array.isArray(frontmatter.template) ? frontmatter.template : [frontmatter.template];
            for (const template of templates) {
              allDeps.add({
                from: file.path,
                dependency: template,
                type: 'template',
              });
            }
          }
        } catch (error) {
          await prompts.log.warn('Failed to parse frontmatter in ' + file.name + ': ' + error.message);
        }
      }

      // Parse content for command references (cross-module dependencies)
      const commandRefs = this.parseCommandReferences(content);
      for (const ref of commandRefs) {
        allDeps.add({
          from: file.path,
          dependency: ref,
          type: 'command',
        });
      }

      // Parse for file path references
      const fileRefs = this.parseFileReferences(content);
      for (const ref of fileRefs) {
        // Determine type based on path format
        // Paths starting with bmad/ are absolute references to the bmad installation
        const depType = ref.startsWith('bmad/') ? 'bmad-path' : 'file';
        allDeps.add({
          from: file.path,
          dependency: ref,
          type: depType,
        });
      }
    }

    return allDeps;
  }

  /**
   * Parse command references from content
   */
  parseCommandReferences(content) {
    const refs = new Set();

    // Match @task-{name} or @agent-{name} or @{module}-{type}-{name}
    const commandPattern = /@(task-|agent-|bmad-)([a-z0-9-]+)/g;
    let match;

    while ((match = commandPattern.exec(content)) !== null) {
      refs.add(match[0]);
    }

    // Match file paths like bmad/core/agents/analyst
    const pathPattern = /bmad\/(core|bmm|cis)\/(agents|tasks)\/([a-z0-9-]+)/g;

    while ((match = pathPattern.exec(content)) !== null) {
      refs.add(match[0]);
    }

    return [...refs];
  }

  /**
   * Parse file path references from content
   */
  parseFileReferences(content) {
    const refs = new Set();

    // Match relative paths like ../templates/file.yaml or ./data/file.md
    const relativePattern = /['"](\.\.?\/[^'"]+\.(md|yaml|yml|xml|json|txt|csv))['"]/g;
    let match;

    while ((match = relativePattern.exec(content)) !== null) {
      refs.add(match[1]);
    }

    // Parse exec attributes in command tags
    const execPattern = /exec="([^"]+)"/g;
    while ((match = execPattern.exec(content)) !== null) {
      let execPath = match[1];
      if (execPath && execPath !== '*') {
        // Remove {project-root} prefix to get the actual path
        // Usage is like {project-root}/bmad/core/tasks/foo.md
        if (execPath.includes('{project-root}')) {
          execPath = execPath.replace('{project-root}', '');
        }
        refs.add(execPath);
      }
    }

    // Parse tmpl attributes in command tags
    const tmplPattern = /tmpl="([^"]+)"/g;
    while ((match = tmplPattern.exec(content)) !== null) {
      let tmplPath = match[1];
      if (tmplPath && tmplPath !== '*') {
        // Remove {project-root} prefix to get the actual path
        // Usage is like {project-root}/bmad/core/tasks/foo.md
        if (tmplPath.includes('{project-root}')) {
          tmplPath = tmplPath.replace('{project-root}', '');
        }
        refs.add(tmplPath);
      }
    }

    return [...refs];
  }

  /**
   * Resolve dependency paths to actual files
   */
  async resolveDependencyPaths(bmadDir, dependencies) {
    const resolved = new Set();

    for (const dep of dependencies) {
      const resolvedPaths = await this.resolveSingleDependency(bmadDir, dep);
      for (const path of resolvedPaths) {
        resolved.add(path);
      }
    }

    return resolved;
  }

  /**
   * Resolve a single dependency to file paths
   */
  async resolveSingleDependency(bmadDir, dep) {
    const paths = [];

    switch (dep.type) {
      case 'explicit':
      case 'file': {
        let depPath = dep.dependency;

        // Handle {project-root} prefix if present
        if (depPath.includes('{project-root}')) {
          // Remove {project-root} and resolve as bmad path
          depPath = depPath.replace('{project-root}', '');

          if (depPath.startsWith('bmad/')) {
            const bmadPath = depPath.replace(/^bmad\//, '');

            // Handle glob patterns
            if (depPath.includes('*')) {
              // Extract the base path and pattern
              const pathParts = bmadPath.split('/');
              const module = pathParts[0];
              const filePattern = pathParts.at(-1);
              const middlePath = pathParts.slice(1, -1).join('/');

              let basePath;
              if (module === 'core') {
                basePath = path.join(bmadDir, 'core', middlePath);
              } else {
                basePath = path.join(bmadDir, 'modules', module, middlePath);
              }

              if (await fs.pathExists(basePath)) {
                const files = await glob.glob(filePattern, { cwd: basePath });
                for (const file of files) {
                  paths.push(path.join(basePath, file));
                }
              }
            } else {
              // Direct path
              if (bmadPath.startsWith('core/')) {
                const corePath = path.join(bmadDir, bmadPath);
                if (await fs.pathExists(corePath)) {
                  paths.push(corePath);
                }
              } else {
                const parts = bmadPath.split('/');
                const module = parts[0];
                const rest = parts.slice(1).join('/');
                const modulePath = path.join(bmadDir, 'modules', module, rest);

                if (await fs.pathExists(modulePath)) {
                  paths.push(modulePath);
                }
              }
            }
          }
        } else {
          // Regular relative path handling
          const sourceDir = path.dirname(dep.from);

          // Handle glob patterns
          if (depPath.includes('*')) {
            const basePath = path.resolve(sourceDir, path.dirname(depPath));
            const pattern = path.basename(depPath);

            if (await fs.pathExists(basePath)) {
              const files = await glob.glob(pattern, { cwd: basePath });
              for (const file of files) {
                paths.push(path.join(basePath, file));
              }
            }
          } else {
            // Direct file reference
            const fullPath = path.resolve(sourceDir, depPath);
            if (await fs.pathExists(fullPath)) {
              paths.push(fullPath);
            } else {
              this.missingDependencies.add(`${depPath} (referenced by ${path.basename(dep.from)})`);
            }
          }
        }

        break;
      }
      case 'command': {
        // Resolve command references to actual files
        const commandPath = await this.resolveCommandToPath(bmadDir, dep.dependency);
        if (commandPath) {
          paths.push(commandPath);
        }

        break;
      }
      case 'bmad-path': {
        // Resolve bmad/ paths (from {project-root}/bmad/... references)
        // These are paths relative to the src directory structure
        const bmadPath = dep.dependency.replace(/^bmad\//, '');

        // Try to resolve as if it's in src structure
        // bmad/core/tasks/foo.md -> src/core/tasks/foo.md
        // bmad/bmm/tasks/bar.md -> src/bmm/tasks/bar.md (bmm is directly under src/)
        // bmad/cis/agents/bar.md -> src/modules/cis/agents/bar.md

        if (bmadPath.startsWith('core/')) {
          const corePath = path.join(bmadDir, bmadPath);
          if (await fs.pathExists(corePath)) {
            paths.push(corePath);
          } else {
            // Not found, but don't report as missing since it might be installed later
          }
        } else {
          // It's a module path like bmm/tasks/foo.md or cis/agents/bar.md
          const parts = bmadPath.split('/');
          const module = parts[0];
          const rest = parts.slice(1).join('/');
          let modulePath;
          if (module === 'bmm') {
            // bmm is directly under src/
            modulePath = path.join(bmadDir, module, rest);
          } else {
            // Other modules are under modules/
            modulePath = path.join(bmadDir, 'modules', module, rest);
          }

          if (await fs.pathExists(modulePath)) {
            paths.push(modulePath);
          } else {
            // Not found, but don't report as missing since it might be installed later
          }
        }

        break;
      }
      case 'template': {
        // Resolve template references
        let templateDep = dep.dependency;

        // Handle {project-root} prefix if present
        if (templateDep.includes('{project-root}')) {
          // Remove {project-root} and treat as bmad-path
          templateDep = templateDep.replace('{project-root}', '');

          // Now resolve as a bmad path
          if (templateDep.startsWith('bmad/')) {
            const bmadPath = templateDep.replace(/^bmad\//, '');

            if (bmadPath.startsWith('core/')) {
              const corePath = path.join(bmadDir, bmadPath);
              if (await fs.pathExists(corePath)) {
                paths.push(corePath);
              }
            } else {
              // Module path like cis/templates/brainstorm.md
              const parts = bmadPath.split('/');
              const module = parts[0];
              const rest = parts.slice(1).join('/');
              const modulePath = path.join(bmadDir, 'modules', module, rest);

              if (await fs.pathExists(modulePath)) {
                paths.push(modulePath);
              }
            }
          }
        } else {
          // Regular relative template path
          const sourceDir = path.dirname(dep.from);
          const templatePath = path.resolve(sourceDir, templateDep);

          if (await fs.pathExists(templatePath)) {
            paths.push(templatePath);
          } else {
            this.missingDependencies.add(`Template: ${dep.dependency}`);
          }
        }

        break;
      }
      // No default
    }

    return paths;
  }

  /**
   * Resolve command reference to file path
   */
  async resolveCommandToPath(bmadDir, command) {
    // Parse command format: @task-name or @agent-name or bmad/module/type/name

    if (command.startsWith('@task-')) {
      const taskName = command.slice(6);
      // Search all modules for this task
      for (const module of ['core', 'bmm', 'cis']) {
        const taskPath =
          module === 'core'
            ? path.join(bmadDir, 'core', 'tasks', `${taskName}.md`)
            : path.join(bmadDir, 'modules', module, 'tasks', `${taskName}.md`);
        if (await fs.pathExists(taskPath)) {
          return taskPath;
        }
      }
    } else if (command.startsWith('@agent-')) {
      const agentName = command.slice(7);
      // Search all modules for this agent
      for (const module of ['core', 'bmm', 'cis']) {
        const agentPath =
          module === 'core'
            ? path.join(bmadDir, 'core', 'agents', `${agentName}.md`)
            : path.join(bmadDir, 'modules', module, 'agents', `${agentName}.md`);
        if (await fs.pathExists(agentPath)) {
          return agentPath;
        }
      }
    } else if (command.startsWith('bmad/')) {
      // Direct path reference
      const parts = command.split('/');
      if (parts.length >= 4) {
        const [, module, type, ...nameParts] = parts;
        const name = nameParts.join('/'); // Handle nested paths

        // Check if name already has extension
        const fileName = name.endsWith('.md') ? name : `${name}.md`;

        const filePath =
          module === 'core' ? path.join(bmadDir, 'core', type, fileName) : path.join(bmadDir, 'modules', module, type, fileName);
        if (await fs.pathExists(filePath)) {
          return filePath;
        }
      }
    }

    // Don't report as missing if it's a self-reference within the module being installed
    if (!command.includes('cis') || command.includes('brain')) {
      // Only report missing if it's a true external dependency
      // this.missingDependencies.add(`Command: ${command}`);
    }
    return null;
  }

  /**
   * Resolve transitive dependencies (dependencies of dependencies)
   */
  async resolveTransitiveDependencies(bmadDir, directDeps) {
    const transitive = new Set();
    const processed = new Set();

    // Process each direct dependency
    for (const depPath of directDeps) {
      if (processed.has(depPath)) continue;
      processed.add(depPath);

      // Only process markdown and YAML files for transitive deps
      if ((depPath.endsWith('.md') || depPath.endsWith('.yaml') || depPath.endsWith('.yml')) && (await fs.pathExists(depPath))) {
        const content = await fs.readFile(depPath, 'utf8');
        const subDeps = await this.parseDependencies([
          {
            path: depPath,
            type: 'dependency',
            module: this.getModuleFromPath(bmadDir, depPath),
            name: path.basename(depPath),
          },
        ]);

        const resolvedSubDeps = await this.resolveDependencyPaths(bmadDir, subDeps);
        for (const subDep of resolvedSubDeps) {
          if (!directDeps.has(subDep)) {
            transitive.add(subDep);
          }
        }
      }
    }

    return transitive;
  }

  /**
   * Get module name from file path
   */
  getModuleFromPath(bmadDir, filePath) {
    const relative = path.relative(bmadDir, filePath);
    const parts = relative.split(path.sep);

    // Handle source directory structure (src/core, src/bmm, or src/modules/xxx)
    if (parts[0] === 'src') {
      if (parts[1] === 'core') {
        return 'core';
      } else if (parts[1] === 'bmm') {
        return 'bmm';
      } else if (parts[1] === 'modules' && parts.length > 2) {
        return parts[2];
      }
    }

    // Check if it's in modules directory (installed structure)
    if (parts[0] === 'modules' && parts.length > 1) {
      return parts[1];
    }

    // Otherwise return the first part (core, etc.)
    // But don't return 'src' as a module name
    if (parts[0] === 'src') {
      return 'unknown';
    }
    return parts[0] || 'unknown';
  }

  /**
   * Organize files by module
   */
  organizeByModule(bmadDir, files) {
    const organized = {};

    for (const file of files) {
      const module = this.getModuleFromPath(bmadDir, file);
      if (!organized[module]) {
        organized[module] = {
          agents: [],
          tasks: [],
          tools: [],
          templates: [],
          data: [],
          other: [],
        };
      }

      // Get relative path correctly based on module structure
      let moduleBase;

      // Check if file is in source directory structure
      if (file.includes('/src/core/') || file.includes('/src/bmm/')) {
        if (module === 'core') {
          moduleBase = path.join(bmadDir, 'src', 'core');
        } else if (module === 'bmm') {
          moduleBase = path.join(bmadDir, 'src', 'bmm');
        }
      } else {
        moduleBase = module === 'core' ? path.join(bmadDir, 'core') : path.join(bmadDir, 'modules', module);
      }

      const relative = path.relative(moduleBase, file);

      if (relative.startsWith('agents/') || file.includes('/agents/')) {
        organized[module].agents.push(file);
      } else if (relative.startsWith('tasks/') || file.includes('/tasks/')) {
        organized[module].tasks.push(file);
      } else if (relative.startsWith('tools/') || file.includes('/tools/')) {
        organized[module].tools.push(file);
      } else if (relative.includes('data/')) {
        organized[module].data.push(file);
      } else {
        organized[module].other.push(file);
      }
    }

    return organized;
  }

  /**
   * Report resolution results
   */
  async reportResults(organized, selectedModules) {
    await prompts.log.success('Dependency resolution complete');

    for (const [module, files] of Object.entries(organized)) {
      const isSelected = selectedModules.includes(module) || module === 'core';
      const totalFiles =
        files.agents.length + files.tasks.length + files.tools.length + files.templates.length + files.data.length + files.other.length;

      if (totalFiles > 0) {
        await prompts.log.info(`  ${module.toUpperCase()} module:`);
        await prompts.log.message(`    Status: ${isSelected ? 'Selected' : 'Dependencies only'}`);

        if (files.agents.length > 0) {
          await prompts.log.message(`    Agents: ${files.agents.length}`);
        }
        if (files.tasks.length > 0) {
          await prompts.log.message(`    Tasks: ${files.tasks.length}`);
        }
        if (files.templates.length > 0) {
          await prompts.log.message(`    Templates: ${files.templates.length}`);
        }
        if (files.data.length > 0) {
          await prompts.log.message(`    Data files: ${files.data.length}`);
        }
        if (files.other.length > 0) {
          await prompts.log.message(`    Other files: ${files.other.length}`);
        }
      }
    }

    if (this.missingDependencies.size > 0) {
      await prompts.log.warn('Missing dependencies:');
      for (const missing of this.missingDependencies) {
        await prompts.log.warn(`    - ${missing}`);
      }
    }
  }

  /**
   * Create a bundle for web deployment
   * @param {Object} resolution - Resolution results from resolve()
   * @returns {Object} Bundle data ready for web
   */
  async createWebBundle(resolution) {
    const bundle = {
      metadata: {
        created: new Date().toISOString(),
        modules: Object.keys(resolution.byModule),
        totalFiles: resolution.allFiles.length,
      },
      agents: {},
      tasks: {},
      templates: {},
      data: {},
    };

    // Bundle all files by type
    for (const filePath of resolution.allFiles) {
      if (!(await fs.pathExists(filePath))) continue;

      const content = await fs.readFile(filePath, 'utf8');
      const relative = path.relative(path.dirname(resolution.primaryFiles[0]?.path || '.'), filePath);

      if (filePath.includes('/agents/')) {
        bundle.agents[relative] = content;
      } else if (filePath.includes('/tasks/')) {
        bundle.tasks[relative] = content;
      } else if (filePath.includes('template')) {
        bundle.templates[relative] = content;
      } else {
        bundle.data[relative] = content;
      }
    }

    return bundle;
  }
}

module.exports = { DependencyResolver };
