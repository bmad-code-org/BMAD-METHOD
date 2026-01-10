import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to BMAD core - adjust based on deployment
const BMAD_ROOT = process.env.BMAD_ROOT || join(__dirname, '../../../../..');

interface AgentDefinition {
  id: string;
  name: string;
  title: string;
  icon?: string;
  module: string;
  persona: {
    role: string;
    identity?: string;
    communicationStyle: string;
    principles?: string[];
  };
  menu: AgentMenuItem[];
  prompts: Record<string, string>;
}

interface AgentMenuItem {
  trigger: string;
  exec?: string;
  description: string;
  requiresContext?: string[];
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  module: string;
  phase: string;
  steps: WorkflowStep[];
  estimatedTime?: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  instruction: string;
  expectedOutput?: string;
}

interface MessageContext {
  conversationId?: string;
  projectId?: string;
  userId?: string;
}

interface MessageResponse {
  content: string;
  metadata?: {
    suggestedActions?: { label: string; action: string; primary?: boolean }[];
    artifacts?: string[];
    workflowStep?: string;
  };
}

export class BMADAdapter {
  private agents: Map<string, AgentDefinition> = new Map();
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private loaded: boolean = false;

  constructor() {
    // Load on first use
    this.loadAgents().catch(console.error);
    this.loadWorkflows().catch(console.error);
  }

  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await Promise.all([this.loadAgents(), this.loadWorkflows()]);
      this.loaded = true;
    }
  }

  async loadAgents(): Promise<void> {
    const modulesPath = join(BMAD_ROOT, 'src/modules');

    try {
      const modules = await readdir(modulesPath);

      for (const moduleName of modules) {
        const agentsPath = join(modulesPath, moduleName, 'agents');

        try {
          const agentFiles = await readdir(agentsPath);

          for (const file of agentFiles) {
            if (file.endsWith('.agent.yaml') || file.endsWith('.agent.md')) {
              try {
                const content = await readFile(join(agentsPath, file), 'utf-8');
                const agent = this.parseAgentFile(content, moduleName, file);
                if (agent) {
                  this.agents.set(agent.id, agent);
                }
              } catch (e) {
                console.warn(`Failed to parse agent file: ${file}`, e);
              }
            }
          }
        } catch {
          // agents directory doesn't exist for this module
        }
      }
    } catch (e) {
      console.warn('Failed to load agents from BMAD root:', e);
      // Load sample agents for development
      this.loadSampleAgents();
    }
  }

  private parseAgentFile(content: string, moduleName: string, fileName: string): AgentDefinition | null {
    try {
      // Try YAML first
      const data = parseYaml(content);
      const agent = data.agent || data;

      return {
        id: agent.metadata?.id || `${moduleName}/${fileName.replace('.agent.yaml', '').replace('.agent.md', '')}`,
        name: agent.metadata?.name || 'Agent',
        title: agent.metadata?.title || 'AI Agent',
        icon: agent.metadata?.icon,
        module: moduleName,
        persona: {
          role: agent.persona?.role || 'AI Assistant',
          identity: agent.persona?.identity,
          communicationStyle: agent.persona?.communication_style || 'professional',
          principles: agent.persona?.principles,
        },
        menu: (agent.menu || []).map((item: any) => ({
          trigger: item.trigger,
          exec: item.exec,
          description: item.description || item.trigger,
          requiresContext: item.requires_context,
        })),
        prompts: agent.prompts || {},
      };
    } catch {
      return null;
    }
  }

  private loadSampleAgents(): void {
    // Sample agents for development/demo
    const sampleAgents: AgentDefinition[] = [
      {
        id: 'bmm/pm',
        name: 'John',
        title: 'Product Manager',
        icon: 'J',
        module: 'bmm',
        persona: {
          role: 'Product Manager especializado em criacao colaborativa de PRDs e gestao de requisitos',
          communicationStyle: 'Pergunta "POR QUE?" incessantemente para extrair os requisitos reais',
        },
        menu: [
          { trigger: 'PR', description: '[PR] Criar Product Requirements Document' },
          { trigger: 'analyze', description: '[AN] Analisar requisitos do projeto' },
          { trigger: 'stakeholders', description: '[ST] Mapear stakeholders' },
        ],
        prompts: {},
      },
      {
        id: 'bmm/architect',
        name: 'Alex',
        title: 'Software Architect',
        icon: 'A',
        module: 'bmm',
        persona: {
          role: 'Arquiteto de Software com foco em design de sistemas escalaveis',
          communicationStyle: 'Tecnico mas acessivel, usa diagramas e exemplos',
        },
        menu: [
          { trigger: 'arch', description: '[AR] Criar documento de arquitetura' },
          { trigger: 'review', description: '[RV] Revisar decisoes arquiteturais' },
          { trigger: 'diagram', description: '[DG] Gerar diagramas de sistema' },
        ],
        prompts: {},
      },
      {
        id: 'bmm/developer',
        name: 'Dev',
        title: 'Senior Developer',
        icon: 'D',
        module: 'bmm',
        persona: {
          role: 'Desenvolvedor Senior especializado em implementacao de alta qualidade',
          communicationStyle: 'Pratico e direto, foca em codigo limpo e testavel',
        },
        menu: [
          { trigger: 'impl', description: '[IM] Implementar feature' },
          { trigger: 'test', description: '[TE] Criar testes' },
          { trigger: 'refactor', description: '[RF] Refatorar codigo' },
        ],
        prompts: {},
      },
      {
        id: 'bmm/barry',
        name: 'Barry',
        title: 'Quick-Flow Solo Dev',
        icon: 'B',
        module: 'bmm',
        persona: {
          role: 'Desenvolvedor agil para fluxos rapidos de implementacao',
          communicationStyle: 'Eficiente e focado, ideal para tarefas menores',
        },
        menu: [
          { trigger: 'quick-spec', description: '[QS] Quick Spec - Especificacao rapida' },
          { trigger: 'quick-dev', description: '[QD] Quick Dev - Desenvolvimento rapido' },
          { trigger: 'fix', description: '[FX] Corrigir bug rapidamente' },
        ],
        prompts: {},
      },
    ];

    for (const agent of sampleAgents) {
      this.agents.set(agent.id, agent);
    }
  }

  async loadWorkflows(): Promise<void> {
    // Load sample workflows for now
    const sampleWorkflows: WorkflowDefinition[] = [
      {
        id: 'bmm/quick-spec',
        name: 'Quick Spec',
        description: 'Especificacao tecnica rapida para pequenas mudancas',
        module: 'bmm',
        phase: 'planning',
        estimatedTime: '~5 min',
        steps: [
          {
            id: 'step1',
            name: 'Analisar Delta',
            description: 'Investigacao superficial da mudanca',
            instruction: 'Analise o que precisa mudar entre o estado atual e o desejado.',
          },
          {
            id: 'step2',
            name: 'Investigacao Profunda',
            description: 'Analise detalhada do codigo e consequencias',
            instruction: 'Examine o codigo existente e identifique impactos da mudanca.',
          },
          {
            id: 'step3',
            name: 'Gerar Especificacao',
            description: 'Produzir tech-spec',
            instruction: 'Crie a especificacao tecnica detalhada.',
          },
          {
            id: 'step4',
            name: 'Revisar e Refinar',
            description: 'Validacao e refinamento',
            instruction: 'Revise a especificacao e faca ajustes finais.',
          },
        ],
      },
      {
        id: 'bmm/prd',
        name: 'Product Requirements Document',
        description: 'Criacao completa de PRD para novos produtos/features',
        module: 'bmm',
        phase: 'planning',
        estimatedTime: '~15 min',
        steps: [
          {
            id: 'step1',
            name: 'Descoberta',
            description: 'Entender o problema e contexto',
            instruction: 'Pergunte sobre o problema que estamos resolvendo, quem sao os usuarios e qual o impacto esperado.',
          },
          {
            id: 'step2',
            name: 'Requisitos',
            description: 'Definir requisitos funcionais e nao-funcionais',
            instruction: 'Liste todos os requisitos do produto, separando funcionais de nao-funcionais.',
          },
          {
            id: 'step3',
            name: 'User Stories',
            description: 'Criar historias de usuario',
            instruction: 'Transforme requisitos em user stories no formato "Como [persona], quero [acao], para [beneficio]".',
          },
          {
            id: 'step4',
            name: 'Criterios de Aceite',
            description: 'Definir criterios de aceitacao',
            instruction: 'Para cada user story, defina criterios claros de aceitacao.',
          },
          {
            id: 'step5',
            name: 'Revisao Final',
            description: 'Revisar e aprovar PRD',
            instruction: 'Revise o documento completo, verifique consistencia e obtenha aprovacao.',
          },
        ],
      },
    ];

    for (const workflow of sampleWorkflows) {
      this.workflows.set(workflow.id, workflow);
    }
  }

  async getAllAgents(): Promise<AgentDefinition[]> {
    await this.ensureLoaded();
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<AgentDefinition | undefined> {
    await this.ensureLoaded();
    return this.agents.get(id);
  }

  async getAgentsByModule(moduleId: string): Promise<AgentDefinition[]> {
    await this.ensureLoaded();
    return Array.from(this.agents.values()).filter(a => a.module === moduleId);
  }

  async getAgentActions(agentId: string): Promise<AgentMenuItem[]> {
    await this.ensureLoaded();
    const agent = this.agents.get(agentId);
    return agent?.menu || [];
  }

  async getAllWorkflows(): Promise<WorkflowDefinition[]> {
    await this.ensureLoaded();
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: string): Promise<WorkflowDefinition | undefined> {
    await this.ensureLoaded();
    return this.workflows.get(id);
  }

  async processMessage(
    agentId: string,
    message: string,
    context: MessageContext
  ): Promise<MessageResponse> {
    await this.ensureLoaded();

    const agent = this.agents.get(agentId);
    if (!agent) {
      return {
        content: 'Desculpe, nao consegui encontrar o agente solicitado.',
      };
    }

    // Check if message matches any menu trigger
    const matchedAction = agent.menu.find(item =>
      message.toLowerCase().includes(item.trigger.toLowerCase())
    );

    // Simulate AI response based on agent persona
    const response = this.generateAgentResponse(agent, message, matchedAction);

    return response;
  }

  private generateAgentResponse(
    agent: AgentDefinition,
    userMessage: string,
    matchedAction?: AgentMenuItem
  ): MessageResponse {
    // This is a placeholder - in production, this would call an LLM
    // with the agent's persona and prompts

    if (matchedAction) {
      return {
        content: `Otimo! Vou iniciar o workflow **${matchedAction.description}** para voce.\n\nComo ${agent.title}, vou guia-lo atraves deste processo. Vamos comecar?\n\n**Proximo passo:** Me conte mais sobre o que voce quer construir.`,
        metadata: {
          suggestedActions: [
            { label: 'Sim, vamos comecar!', action: 'start_workflow', primary: true },
            { label: 'Tenho duvidas', action: 'ask_questions' },
          ],
        },
      };
    }

    return {
      content: `Ola! Sou ${agent.name}, ${agent.persona.role}.\n\nVoce disse: "${userMessage}"\n\nComo posso ajudar? Aqui estao algumas coisas que posso fazer:\n\n${agent.menu.map(item => `- **${item.trigger}**: ${item.description}`).join('\n')}\n\nBasta digitar um dos comandos acima ou me contar mais sobre seu projeto!`,
      metadata: {
        suggestedActions: agent.menu.slice(0, 3).map((item, index) => ({
          label: item.description.replace(/^\[[\w-]+\]\s*/, ''),
          action: item.trigger,
          primary: index === 0,
        })),
      },
    };
  }
}
