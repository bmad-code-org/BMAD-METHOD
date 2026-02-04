const path = require('node:path');
const fs = require('fs-extra');

/**
 * Helpers for gathering BMAD agents/tasks from the installed tree.
 * Shared by installers that need Claude-style exports.
 */
async function getAgentsFromBmad(bmadDir, selectedModules = []) {
  const agents = [];

  // Get core agents
  if (await fs.pathExists(path.join(bmadDir, 'core', 'agents'))) {
    const coreAgents = await getAgentsFromDir(path.join(bmadDir, 'core', 'agents'), 'core');
    agents.push(...coreAgents);
  }

  // Get module agents
  for (const moduleName of selectedModules) {
    const agentsPath = path.join(bmadDir, moduleName, 'agents');

    if (await fs.pathExists(agentsPath)) {
      const moduleAgents = await getAgentsFromDir(agentsPath, moduleName);
      agents.push(...moduleAgents);
    }
  }

  // Get standalone agents from bmad/agents/ directory
  const standaloneAgentsDir = path.join(bmadDir, 'agents');
  if (await fs.pathExists(standaloneAgentsDir)) {
    const agentDirs = await fs.readdir(standaloneAgentsDir, { withFileTypes: true });

    for (const agentDir of agentDirs) {
      if (!agentDir.isDirectory()) continue;

      const agentDirPath = path.join(standaloneAgentsDir, agentDir.name);
      const agentFiles = await fs.readdir(agentDirPath);

      for (const file of agentFiles) {
        if (!file.endsWith('.md')) continue;
        if (file.includes('.customize.')) continue;

        const filePath = path.join(agentDirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        if (content.includes('localskip="true"')) continue;

        agents.push({
          path: filePath,
          name: file.replace('.md', ''),
          module: 'standalone', // Mark as standalone agent
        });
      }
    }
  }

  return agents;
}

async function getTasksFromBmad(bmadDir, selectedModules = []) {
  const tasks = [];

  if (await fs.pathExists(path.join(bmadDir, 'core', 'tasks'))) {
    const coreTasks = await getTasksFromDir(path.join(bmadDir, 'core', 'tasks'), 'core');
    tasks.push(...coreTasks);
  }

  for (const moduleName of selectedModules) {
    const tasksPath = path.join(bmadDir, moduleName, 'tasks');

    if (await fs.pathExists(tasksPath)) {
      const moduleTasks = await getTasksFromDir(tasksPath, moduleName);
      tasks.push(...moduleTasks);
    }
  }

  return tasks;
}

async function getAgentsFromDir(dirPath, moduleName, relativePath = '') {
  const agents = [];

  if (!(await fs.pathExists(dirPath))) {
    return agents;
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    // Skip if entry.name is undefined or not a string
    if (!entry.name || typeof entry.name !== 'string') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      const subDirAgents = await getAgentsFromDir(fullPath, moduleName, newRelativePath);
      agents.push(...subDirAgents);
    } else if (entry.name.endsWith('.md')) {
      // Skip README files and other non-agent files
      if (entry.name.toLowerCase() === 'readme.md' || entry.name.toLowerCase().startsWith('readme-')) {
        continue;
      }

      if (entry.name.includes('.customize.')) {
        continue;
      }

      const content = await fs.readFile(fullPath, 'utf8');

      if (content.includes('localskip="true"')) {
        continue;
      }

      // Only include files that have agent-specific content (compiled agents have <agent> tag)
      if (!content.includes('<agent')) {
        continue;
      }

      agents.push({
        path: fullPath,
        name: entry.name.replace('.md', ''),
        module: moduleName,
        relativePath: newRelativePath, // Keep the .md extension for the full path
      });
    }
  }

  return agents;
}

async function getTasksFromDir(dirPath, moduleName) {
  const tasks = [];

  if (!(await fs.pathExists(dirPath))) {
    return tasks;
  }

  const files = await fs.readdir(dirPath);

  for (const file of files) {
    // Include both .md and .xml task files
    if (!file.endsWith('.md') && !file.endsWith('.xml')) {
      continue;
    }

    const filePath = path.join(dirPath, file);
    const content = await fs.readFile(filePath, 'utf8');

    // Skip internal/engine files (not user-facing tasks)
    if (content.includes('internal="true"')) {
      continue;
    }

    // Remove extension to get task name
    const ext = file.endsWith('.xml') ? '.xml' : '.md';
    tasks.push({
      path: filePath,
      name: file.replace(ext, ''),
      module: moduleName,
    });
  }

  return tasks;
}

module.exports = {
  getAgentsFromBmad,
  getTasksFromBmad,
  getAgentsFromDir,
  getTasksFromDir,
};
