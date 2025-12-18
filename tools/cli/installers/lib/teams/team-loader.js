const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const { glob } = require('glob');

/**
 * Team Loader
 *
 * Discovers and loads team bundles from module definitions.
 * Teams are predefined collections of agents and workflows for common use cases.
 */

/**
 * Discover all available teams across modules
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<Object[]>} Array of team metadata { name, module, path, description }
 */
async function discoverTeams(projectRoot) {
  const teams = [];
  const pattern = path.join(projectRoot, 'src/modules/*/teams/team-*.yaml');

  try {
    const files = await glob(pattern, { absolute: true });

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const teamData = yaml.parse(content);

        // Extract team name from filename (team-fullstack.yaml -> fullstack)
        const filename = path.basename(filePath);
        const teamName = filename.replace(/^team-/, '').replace(/\.yaml$/, '');

        // Extract module name from path
        const moduleName = path.basename(path.dirname(path.dirname(filePath)));

        teams.push({
          name: teamName,
          module: moduleName,
          path: filePath,
          description: teamData.bundle?.description || 'No description',
          bundleName: teamData.bundle?.name || teamName,
          icon: teamData.bundle?.icon || '👥',
        });
      } catch (error) {
        // Skip files that can't be parsed
        console.warn(`Warning: Could not parse team file ${filePath}: ${error.message}`);
      }
    }

    return teams;
  } catch {
    // If glob fails, return empty array
    return [];
  }
}

/**
 * Load a specific team by name
 * @param {string} teamName - Team name (e.g., 'fullstack', 'gamedev')
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<Object>} Team data with metadata
 */
async function loadTeam(teamName, projectRoot) {
  if (!teamName) {
    throw new Error('Team name is required');
  }

  // Discover all teams
  const teams = await discoverTeams(projectRoot);

  // Find matching team
  const team = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase());

  if (!team) {
    // Provide helpful error with suggestions
    const availableTeams = teams.map((t) => t.name).join(', ');
    throw new Error(`Team '${teamName}' not found. Available teams: ${availableTeams || 'none'}`);
  }

  // Load full team definition
  const content = fs.readFileSync(team.path, 'utf8');
  const teamData = yaml.parse(content);

  return {
    name: team.name,
    module: team.module,
    description: team.description,
    bundleName: team.bundleName,
    icon: team.icon,
    agents: teamData.agents || [],
    workflows: teamData.workflows || [],
    party: teamData.party,
  };
}

/**
 * Expand team definition to full agents and workflows list
 * @param {string} teamName - Team name
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<Object>} { agents: [], workflows: [], module: string }
 */
async function expandTeam(teamName, projectRoot) {
  const team = await loadTeam(teamName, projectRoot);

  return {
    agents: team.agents || [],
    workflows: team.workflows || [],
    module: team.module,
    description: team.description,
  };
}

/**
 * Apply modifiers to team selections (additive/subtractive)
 * @param {Object} team - Team expansion result
 * @param {string[]} agentModifiers - Agent modifiers (+agent, -agent)
 * @param {string[]} workflowModifiers - Workflow modifiers (+workflow, -workflow)
 * @returns {Object} Modified team with updated agents/workflows
 */
function applyTeamModifiers(team, agentModifiers = [], workflowModifiers = []) {
  const result = {
    ...team,
    agents: [...team.agents],
    workflows: [...team.workflows],
  };

  // Parse and apply agent modifiers
  for (const modifier of agentModifiers) {
    if (modifier.startsWith('+')) {
      const agent = modifier.slice(1);
      if (!result.agents.includes(agent)) {
        result.agents.push(agent);
      }
    } else if (modifier.startsWith('-')) {
      const agent = modifier.slice(1);
      result.agents = result.agents.filter((a) => a !== agent);
    }
  }

  // Parse and apply workflow modifiers
  for (const modifier of workflowModifiers) {
    if (modifier.startsWith('+')) {
      const workflow = modifier.slice(1);
      if (!result.workflows.includes(workflow)) {
        result.workflows.push(workflow);
      }
    } else if (modifier.startsWith('-')) {
      const workflow = modifier.slice(1);
      result.workflows = result.workflows.filter((w) => w !== workflow);
    }
  }

  return result;
}

/**
 * Get team descriptions for help text
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<Object>} Map of team name to description
 */
async function getTeamDescriptions(projectRoot) {
  const teams = await discoverTeams(projectRoot);
  const descriptions = {};

  for (const team of teams) {
    descriptions[team.name] = team.description;
  }

  return descriptions;
}

module.exports = {
  discoverTeams,
  loadTeam,
  expandTeam,
  applyTeamModifiers,
  getTeamDescriptions,
};
