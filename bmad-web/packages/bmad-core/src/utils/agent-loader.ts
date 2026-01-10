import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { parseYaml, extractFrontmatter } from './yaml-parser.js';
import type { AgentDefinition, AgentMetadata, AgentPersona, AgentMenuItem } from '../types/index.js';

interface RawAgentData {
  agent?: {
    metadata?: Partial<AgentMetadata>;
    persona?: Partial<AgentPersona> & { communication_style?: string };
    menu?: Array<{
      trigger: string;
      exec?: string;
      description?: string;
      requires_context?: string[];
    }>;
    prompts?: Record<string, string>;
  };
  metadata?: Partial<AgentMetadata>;
  persona?: Partial<AgentPersona> & { communication_style?: string };
  menu?: Array<{
    trigger: string;
    exec?: string;
    description?: string;
    requires_context?: string[];
  }>;
  prompts?: Record<string, string>;
}

/**
 * Load agent definition from file
 */
export async function loadAgent(
  filePath: string,
  moduleName: string
): Promise<AgentDefinition | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return parseAgentContent(content, moduleName, filePath);
  } catch (error) {
    console.warn(`Failed to load agent from ${filePath}:`, error);
    return null;
  }
}

/**
 * Parse agent content (YAML or Markdown with frontmatter)
 */
export function parseAgentContent(
  content: string,
  moduleName: string,
  filePath: string
): AgentDefinition | null {
  try {
    let data: RawAgentData;

    // Check if it's markdown with frontmatter
    if (content.startsWith('---')) {
      const { frontmatter } = extractFrontmatter<RawAgentData>(content);
      if (!frontmatter) return null;
      data = frontmatter;
    } else {
      data = parseYaml<RawAgentData>(content);
    }

    // Extract agent data (could be nested under 'agent' key)
    const agentData = data.agent || data;

    // Build agent ID from file path
    const fileName = filePath.split('/').pop() || '';
    const agentId = agentData.metadata?.id ||
      `${moduleName}/${fileName.replace('.agent.yaml', '').replace('.agent.md', '')}`;

    const definition: AgentDefinition = {
      metadata: {
        id: agentId,
        name: agentData.metadata?.name || 'Agent',
        title: agentData.metadata?.title || 'AI Agent',
        icon: agentData.metadata?.icon,
        module: moduleName,
        version: agentData.metadata?.version,
      },
      persona: {
        role: agentData.persona?.role || 'AI Assistant',
        identity: agentData.persona?.identity,
        communicationStyle:
          agentData.persona?.communicationStyle ||
          agentData.persona?.communication_style ||
          'professional',
        principles: agentData.persona?.principles,
        expertise: agentData.persona?.expertise,
      },
      menu: (agentData.menu || []).map((item): AgentMenuItem => ({
        trigger: item.trigger,
        exec: item.exec,
        description: item.description || item.trigger,
        requiresContext: item.requires_context,
      })),
      prompts: agentData.prompts || {},
    };

    return definition;
  } catch (error) {
    console.warn('Failed to parse agent content:', error);
    return null;
  }
}

/**
 * Load all agents from a module directory
 */
export async function loadAgentsFromModule(
  modulePath: string,
  moduleName: string
): Promise<AgentDefinition[]> {
  const agents: AgentDefinition[] = [];
  const agentsPath = join(modulePath, 'agents');

  try {
    const files = await readdir(agentsPath);

    for (const file of files) {
      if (file.endsWith('.agent.yaml') || file.endsWith('.agent.md')) {
        const agent = await loadAgent(join(agentsPath, file), moduleName);
        if (agent) {
          agents.push(agent);
        }
      }
    }
  } catch {
    // agents directory doesn't exist
  }

  return agents;
}

/**
 * Load all agents from BMAD root
 */
export async function loadAllAgents(bmadRoot: string): Promise<AgentDefinition[]> {
  const agents: AgentDefinition[] = [];
  const modulesPath = join(bmadRoot, 'src/modules');

  try {
    const modules = await readdir(modulesPath);

    for (const moduleName of modules) {
      const moduleAgents = await loadAgentsFromModule(
        join(modulesPath, moduleName),
        moduleName
      );
      agents.push(...moduleAgents);
    }
  } catch (error) {
    console.warn('Failed to load agents:', error);
  }

  return agents;
}
