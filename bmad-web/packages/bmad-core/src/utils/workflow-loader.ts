import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { parseYaml, extractFrontmatter } from './yaml-parser.js';
import type { WorkflowDefinition, WorkflowMetadata, WorkflowStep, WorkflowPhase } from '../types/index.js';

interface RawWorkflowData {
  name?: string;
  description?: string;
  phase?: string;
  estimatedTime?: string;
  complexity?: number[];
}

/**
 * Load workflow definition from directory
 */
export async function loadWorkflow(
  workflowPath: string,
  moduleName: string
): Promise<WorkflowDefinition | null> {
  try {
    // Try to load workflow.yaml or workflow.md
    let workflowConfig: RawWorkflowData | null = null;
    const workflowYamlPath = join(workflowPath, 'workflow.yaml');
    const workflowMdPath = join(workflowPath, 'workflow.md');

    try {
      const yamlContent = await readFile(workflowYamlPath, 'utf-8');
      workflowConfig = parseYaml<RawWorkflowData>(yamlContent);
    } catch {
      try {
        const mdContent = await readFile(workflowMdPath, 'utf-8');
        const { frontmatter } = extractFrontmatter<RawWorkflowData>(mdContent);
        workflowConfig = frontmatter;
      } catch {
        // No workflow config found
      }
    }

    // Load steps
    const steps = await loadWorkflowSteps(workflowPath);

    if (steps.length === 0 && !workflowConfig) {
      return null;
    }

    // Build workflow ID from path
    const workflowName = workflowPath.split('/').pop() || 'workflow';
    const workflowId = `${moduleName}/${workflowName}`;

    const definition: WorkflowDefinition = {
      metadata: {
        id: workflowId,
        name: workflowConfig?.name || workflowName,
        description: workflowConfig?.description || '',
        module: moduleName,
        phase: (workflowConfig?.phase || 'planning') as WorkflowPhase,
        estimatedTime: workflowConfig?.estimatedTime,
        complexity: workflowConfig?.complexity,
      },
      steps,
    };

    return definition;
  } catch (error) {
    console.warn(`Failed to load workflow from ${workflowPath}:`, error);
    return null;
  }
}

/**
 * Load workflow steps from directory
 */
async function loadWorkflowSteps(workflowPath: string): Promise<WorkflowStep[]> {
  const steps: WorkflowStep[] = [];

  try {
    const files = await readdir(workflowPath);

    // Find step files (step-1.md, step-2.md, etc.)
    const stepFiles = files
      .filter(f => /^step-\d+\.md$/.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    for (let i = 0; i < stepFiles.length; i++) {
      const stepFile = stepFiles[i];
      const stepPath = join(workflowPath, stepFile);
      const content = await readFile(stepPath, 'utf-8');

      const step = parseStepContent(content, i + 1, stepFile);
      if (step) {
        steps.push(step);
      }
    }
  } catch {
    // No step files found
  }

  return steps;
}

/**
 * Parse step content from markdown
 */
function parseStepContent(
  content: string,
  stepNumber: number,
  fileName: string
): WorkflowStep | null {
  try {
    const { frontmatter, content: markdownContent } = extractFrontmatter<{
      name?: string;
      description?: string;
      expectedOutput?: string;
      validation?: {
        required?: string[];
        format?: string;
        minLength?: number;
      };
    }>(content);

    // Extract title from first heading if no frontmatter name
    let name = frontmatter?.name;
    if (!name) {
      const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
      name = titleMatch?.[1] || `Step ${stepNumber}`;
    }

    return {
      id: fileName.replace('.md', ''),
      number: stepNumber,
      name,
      description: frontmatter?.description || '',
      instruction: markdownContent.trim(),
      expectedOutput: frontmatter?.expectedOutput,
      validation: frontmatter?.validation,
    };
  } catch {
    return null;
  }
}

/**
 * Load all workflows from a module directory
 */
export async function loadWorkflowsFromModule(
  modulePath: string,
  moduleName: string
): Promise<WorkflowDefinition[]> {
  const workflows: WorkflowDefinition[] = [];
  const workflowsPath = join(modulePath, 'workflows');

  try {
    const items = await readdir(workflowsPath);

    for (const item of items) {
      const itemPath = join(workflowsPath, item);
      const itemStat = await stat(itemPath);

      if (itemStat.isDirectory()) {
        // Check subdirectories for workflows
        const subItems = await readdir(itemPath);

        for (const subItem of subItems) {
          const subItemPath = join(itemPath, subItem);
          const subItemStat = await stat(subItemPath);

          if (subItemStat.isDirectory()) {
            const workflow = await loadWorkflow(subItemPath, moduleName);
            if (workflow) {
              workflows.push(workflow);
            }
          }
        }

        // Also check if current directory is a workflow
        const workflow = await loadWorkflow(itemPath, moduleName);
        if (workflow) {
          workflows.push(workflow);
        }
      }
    }
  } catch {
    // workflows directory doesn't exist
  }

  return workflows;
}

/**
 * Load all workflows from BMAD root
 */
export async function loadAllWorkflows(bmadRoot: string): Promise<WorkflowDefinition[]> {
  const workflows: WorkflowDefinition[] = [];
  const modulesPath = join(bmadRoot, 'src/modules');

  try {
    const modules = await readdir(modulesPath);

    for (const moduleName of modules) {
      const moduleWorkflows = await loadWorkflowsFromModule(
        join(modulesPath, moduleName),
        moduleName
      );
      workflows.push(...moduleWorkflows);
    }
  } catch (error) {
    console.warn('Failed to load workflows:', error);
  }

  return workflows;
}
