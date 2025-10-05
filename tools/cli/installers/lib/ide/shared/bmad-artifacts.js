const path = require('node:path');
const fs = require('fs-extra');

/**
 * Helpers for gathering BMAD agents/tasks from the installed tree.
 * Shared by installers that need Claude-style exports.
 */
async function getAgentsFromBmad(bmadDir, selectedModules = []) {
  const agents = [];

  if (await fs.pathExists(path.join(bmadDir, 'core', 'agents'))) {
    const coreAgents = await getAgentsFromDir(path.join(bmadDir, 'core', 'agents'), 'core');
    agents.push(...coreAgents);
  }

  for (const moduleName of selectedModules) {
    const agentsPath = path.join(bmadDir, moduleName, 'agents');

    if (await fs.pathExists(agentsPath)) {
      const moduleAgents = await getAgentsFromDir(agentsPath, moduleName);
      agents.push(...moduleAgents);
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

async function getAgentsFromDir(dirPath, moduleName) {
  const agents = [];

  if (!(await fs.pathExists(dirPath))) {
    return agents;
  }

  const files = await fs.readdir(dirPath);

  for (const file of files) {
    if (!file.endsWith('.md')) {
      continue;
    }

    if (file.includes('.customize.')) {
      continue;
    }

    const filePath = path.join(dirPath, file);
    const content = await fs.readFile(filePath, 'utf8');

    if (content.includes('localskip="true"')) {
      continue;
    }

    agents.push({
      path: filePath,
      name: file.replace('.md', ''),
      module: moduleName,
    });
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
    if (!file.endsWith('.md')) {
      continue;
    }

    tasks.push({
      path: path.join(dirPath, file),
      name: file.replace('.md', ''),
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
