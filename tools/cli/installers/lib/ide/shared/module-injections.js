const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { glob } = require('glob');
const { getSourcePath } = require('../../../../lib/project-root');

async function loadModuleInjectionConfig(handler, moduleName) {
  const sourceModulesPath = getSourcePath('modules');
  const handlerBaseDir = path.join(sourceModulesPath, moduleName, 'sub-modules', handler);
  const configPath = path.join(handlerBaseDir, 'injections.yaml');

  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  const configContent = await fs.readFile(configPath, 'utf8');
  const config = yaml.load(configContent) || {};

  return {
    config,
    handlerBaseDir,
    configPath,
  };
}

function shouldApplyInjection(injection, subagentChoices) {
  if (!subagentChoices || subagentChoices.install === 'none') {
    return false;
  }

  if (subagentChoices.install === 'all') {
    return true;
  }

  if (subagentChoices.install === 'selective') {
    const selected = subagentChoices.selected || [];

    if (injection.requires === 'any' && selected.length > 0) {
      return true;
    }

    if (injection.requires) {
      const required = `${injection.requires}.md`;
      return selected.includes(required);
    }

    if (injection.point) {
      const selectedNames = selected.map((file) => file.replace('.md', ''));
      return selectedNames.some((name) => injection.point.includes(name));
    }
  }

  return false;
}

function filterAgentInstructions(content, selectedFiles) {
  if (!selectedFiles || selectedFiles.length === 0) {
    return '';
  }

  const selectedAgents = selectedFiles.map((file) => file.replace('.md', ''));
  const lines = content.split('\n');
  const filteredLines = [];

  for (const line of lines) {
    if (line.includes('<llm') || line.includes('</llm>')) {
      filteredLines.push(line);
    } else if (line.includes('subagent')) {
      let shouldInclude = false;
      for (const agent of selectedAgents) {
        if (line.includes(agent)) {
          shouldInclude = true;
          break;
        }
      }

      if (shouldInclude) {
        filteredLines.push(line);
      }
    } else if (line.includes('When creating PRDs') || line.includes('ACTIVELY delegate')) {
      filteredLines.push(line);
    }
  }

  if (filteredLines.length > 2) {
    return filteredLines.join('\n');
  }

  return '';
}

async function resolveSubagentFiles(handlerBaseDir, subagentConfig, subagentChoices) {
  if (!subagentConfig || !subagentConfig.files) {
    return [];
  }

  if (!subagentChoices || subagentChoices.install === 'none') {
    return [];
  }

  let filesToCopy = subagentConfig.files;

  if (subagentChoices.install === 'selective') {
    filesToCopy = subagentChoices.selected || [];
  }

  const sourceDir = path.join(handlerBaseDir, subagentConfig.source || '');
  const resolved = [];

  for (const file of filesToCopy) {
    const pattern = path.join(sourceDir, '**', file);
    const matches = await glob(pattern);

    if (matches.length > 0) {
      const absolutePath = matches[0];
      resolved.push({
        file,
        absolutePath,
        relativePath: path.relative(sourceDir, absolutePath),
        sourceDir,
      });
    }
  }

  return resolved;
}

module.exports = {
  loadModuleInjectionConfig,
  shouldApplyInjection,
  filterAgentInstructions,
  resolveSubagentFiles,
};
