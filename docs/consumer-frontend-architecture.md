# BMAD-METHOD: Arquitetura para Aplicação Frontend Consumer

## Visão Geral

Este documento descreve a arquitetura para transformar o BMAD-METHOD (atualmente uma CLI) em uma aplicação web completa para consumidores finais.

---

## 1. Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React/Next.js)                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Dashboard  │  │  Agent Chat  │  │  Workflow    │               │
│  │    Project   │  │   Interface  │  │   Viewer     │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Artifact    │  │   Team       │  │  Settings &  │               │
│  │   Editor     │  │  Management  │  │   Profile    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API + WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   API REST   │  │   WebSocket  │  │    Auth      │               │
│  │   Gateway    │  │    Server    │  │   Service    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Agent      │  │   Workflow   │  │   Project    │               │
│  │   Manager    │  │   Engine     │  │   Service    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BMAD-METHOD CORE                              │
├─────────────────────────────────────────────────────────────────────┤
│  Agents (21+) │ Workflows (50+) │ Modules │ Templates                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Projects, Users)  │  Redis (Sessions, Cache)            │
│  S3/MinIO (Artifacts, Files)   │  MongoDB (Conversations, Logs)      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Estrutura de Diretórios Proposta

```
bmad-web/
├── apps/
│   ├── web/                          # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/                  # App Router (Next.js 14+)
│   │   │   │   ├── (auth)/           # Rotas de autenticação
│   │   │   │   ├── (dashboard)/      # Dashboard principal
│   │   │   │   ├── projects/         # Gestão de projetos
│   │   │   │   ├── agents/           # Interface dos agentes
│   │   │   │   └── workflows/        # Visualização de workflows
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   │   │   ├── agents/           # Componentes de agentes
│   │   │   │   ├── chat/             # Interface de chat
│   │   │   │   ├── workflow/         # Visualizadores de workflow
│   │   │   │   └── editor/           # Editor de artefatos
│   │   │   ├── hooks/                # React hooks customizados
│   │   │   ├── lib/                  # Utilitários e helpers
│   │   │   ├── stores/               # Estado global (Zustand)
│   │   │   └── types/                # TypeScript types
│   │   └── package.json
│   │
│   └── api/                          # Backend API
│       ├── src/
│       │   ├── routes/               # Express routes
│       │   ├── services/             # Business logic
│       │   ├── middleware/           # Auth, logging, etc.
│       │   ├── websocket/            # WebSocket handlers
│       │   ├── bmad/                 # BMAD Core integration
│       │   └── database/             # Database models
│       └── package.json
│
├── packages/
│   ├── bmad-core/                    # Core BMAD refatorado como lib
│   │   ├── agents/                   # Agent definitions
│   │   ├── workflows/                # Workflow engine
│   │   ├── modules/                  # Module system
│   │   └── types/                    # Shared types
│   │
│   ├── ui/                           # Componentes compartilhados
│   └── config/                       # Configurações compartilhadas
│
├── docker/                           # Docker configs
├── turbo.json                        # Turborepo config
└── package.json                      # Root package
```

---

## 3. Stack Tecnológico Recomendado

### Frontend
| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Next.js 14** | Framework React | SSR, App Router, excelente DX |
| **TypeScript** | Linguagem | Type safety, melhor manutenção |
| **Tailwind CSS** | Estilos | Rápido, consistente, customizável |
| **shadcn/ui** | Componentes | Acessível, bonito, não-bloated |
| **Zustand** | Estado global | Simples, performático |
| **TanStack Query** | Data fetching | Cache, refetch, mutations |
| **Socket.io Client** | Real-time | Comunicação com agentes |
| **Monaco Editor** | Code editor | Para edição de artefatos |
| **Framer Motion** | Animações | UX fluida nas transições |

### Backend
| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Node.js 20+** | Runtime | Já usado pelo BMAD |
| **Express/Fastify** | HTTP Server | Maduro, flexível |
| **Socket.io** | WebSocket | Real-time bi-direcional |
| **Prisma** | ORM | Type-safe, migrations |
| **Redis** | Cache/Sessions | Performance |
| **PostgreSQL** | Database | Dados estruturados |
| **MongoDB** | Document store | Conversas, logs |
| **Bull/BullMQ** | Job Queue | Workflows assíncronos |

### Infraestrutura
| Tecnologia | Propósito |
|------------|-----------|
| **Docker** | Containerização |
| **Turborepo** | Monorepo management |
| **Vercel/Railway** | Deploy frontend |
| **Fly.io/Render** | Deploy backend |

---

## 4. Funcionalidades Principais

### 4.1 Dashboard do Projeto
- Visão geral do projeto atual
- Status dos workflows ativos
- Métricas de progresso
- Artefatos gerados
- Atividade recente

### 4.2 Interface de Chat com Agentes
- Chat em tempo real com agentes BMAD
- Seleção de agente por contexto
- Histórico de conversas
- Sugestões de ações
- Execução de comandos via chat

### 4.3 Visualizador de Workflows
- Visualização gráfica do workflow atual
- Progresso step-by-step
- Navegação entre passos
- Outputs de cada passo
- Possibilidade de retroceder/avançar

### 4.4 Editor de Artefatos
- Editor markdown/código rico
- Preview em tempo real
- Versionamento de artefatos
- Exportação (PDF, MD, DOCX)
- Templates pré-definidos

### 4.5 Gestão de Projetos
- Criar novos projetos
- Configurar parâmetros BMAD
- Selecionar módulos e agentes
- Definir nível de complexidade
- Gestão de equipe/colaboradores

---

## 5. Fluxo de Usuário Principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                      JORNADA DO USUÁRIO                              │
└─────────────────────────────────────────────────────────────────────┘

1. ONBOARDING
   ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
   │ Signup │───▶│ Setup  │───▶│ Create │───▶│ Choose │
   │        │    │ Profile│    │ Project│    │ Track  │
   └────────┘    └────────┘    └────────┘    └────────┘
                                               │
                                    ┌──────────┼──────────┐
                                    ▼          ▼          ▼
                              ┌──────────┐ ┌──────────┐ ┌──────────┐
                              │  Quick   │ │   BMAD   │ │Enterprise│
                              │   Flow   │ │  Method  │ │          │
                              └──────────┘ └──────────┘ └──────────┘

2. WORKFLOW EXECUTION
   ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
   │ Select │───▶│  Chat  │───▶│Complete│───▶│  Save  │
   │ Agent  │    │  Work  │    │  Step  │    │Artifact│
   └────────┘    └────────┘    └────────┘    └────────┘
       │              ▲                            │
       │              └────────────────────────────┘
       │                     (repeat)
       ▼
   ┌────────────────────────────────────────────────────┐
   │            WORKFLOW COMPLETION                      │
   │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
   │  │  Review  │  │  Export  │  │   Next   │          │
   │  │ Outputs  │  │ Artifacts│  │  Phase   │          │
   │  └──────────┘  └──────────┘  └──────────┘          │
   └────────────────────────────────────────────────────┘
```

---

## 6. API Design

### 6.1 Endpoints Principais

```typescript
// Autenticação
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

// Projetos
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/artifacts
GET    /api/projects/:id/workflows

// Agentes
GET    /api/agents                    # Lista todos os agentes disponíveis
GET    /api/agents/:id                # Detalhes de um agente
POST   /api/agents/:id/chat           # Iniciar conversa com agente

// Workflows
GET    /api/workflows                 # Lista workflows disponíveis
GET    /api/workflows/:id             # Detalhes de workflow
POST   /api/workflows/:id/start       # Iniciar workflow
GET    /api/workflows/:id/status      # Status atual
POST   /api/workflows/:id/step/next   # Avançar para próximo passo
POST   /api/workflows/:id/step/complete # Completar passo atual

// Artefatos
GET    /api/artifacts/:id
PUT    /api/artifacts/:id
POST   /api/artifacts/:id/export
GET    /api/artifacts/:id/versions

// WebSocket Events
ws://api/socket
  - agent:message        # Mensagem do agente
  - agent:typing         # Agente está digitando
  - workflow:progress    # Progresso do workflow
  - artifact:updated     # Artefato atualizado
```

### 6.2 Schema de Dados

```typescript
// User
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

// Project
interface Project {
  id: string;
  name: string;
  description?: string;
  complexityLevel: 0 | 1 | 2 | 3 | 4;
  selectedModules: string[];
  activeWorkflow?: string;
  artifacts: Artifact[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Conversation
interface Conversation {
  id: string;
  projectId: string;
  agentId: string;
  messages: Message[];
  context: Record<string, any>;
  createdAt: Date;
}

// Message
interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: {
    workflowStep?: string;
    action?: string;
    artifacts?: string[];
  };
  timestamp: Date;
}

// Workflow Instance
interface WorkflowInstance {
  id: string;
  projectId: string;
  workflowId: string;
  currentStep: number;
  totalSteps: number;
  status: 'active' | 'paused' | 'completed' | 'failed';
  stepOutputs: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
}

// Artifact
interface Artifact {
  id: string;
  projectId: string;
  type: 'prd' | 'architecture' | 'epic' | 'story' | 'spec' | 'diagram';
  name: string;
  content: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. Componentes de Interface Chave

### 7.1 Agent Chat Interface

```tsx
// components/chat/AgentChat.tsx
interface AgentChatProps {
  projectId: string;
  agentId: string;
  onArtifactCreated?: (artifact: Artifact) => void;
}

// Features:
// - Avatar e nome do agente
// - Input de mensagem com markdown support
// - Botões de ação rápida (baseados no menu do agente)
// - Exibição de outputs estruturados
// - Indicador de "typing"
// - Scroll automático para última mensagem
```

### 7.2 Workflow Stepper

```tsx
// components/workflow/WorkflowStepper.tsx
interface WorkflowStepperProps {
  workflowInstance: WorkflowInstance;
  onStepComplete: (stepId: string, output: any) => void;
}

// Features:
// - Visualização vertical/horizontal dos passos
// - Indicador de passo atual
// - Preview do conteúdo de cada passo
// - Botões de navegação
// - Exibição de outputs anteriores
```

### 7.3 Artifact Editor

```tsx
// components/editor/ArtifactEditor.tsx
interface ArtifactEditorProps {
  artifact: Artifact;
  onSave: (content: string) => void;
  readonly?: boolean;
}

// Features:
// - Monaco editor para código/markdown
// - Preview lado a lado
// - Autosave
// - Toolbar com formatação
// - Export button
```

---

## 8. Integração com BMAD Core

### 8.1 Adapter Pattern

```typescript
// packages/bmad-core/src/adapter.ts

import { AgentDefinition, WorkflowDefinition } from './types';

export class BMADAdapter {
  private agents: Map<string, AgentDefinition>;
  private workflows: Map<string, WorkflowDefinition>;

  constructor() {
    this.loadAgents();
    this.loadWorkflows();
  }

  // Carrega definições de agentes dos arquivos YAML
  async loadAgents(): Promise<void> {
    // Parse YAML files from src/modules/*/agents/
  }

  // Carrega definições de workflows
  async loadWorkflows(): Promise<void> {
    // Parse workflow directories from src/modules/*/workflows/
  }

  // Obtém menu de ações disponíveis para um agente
  getAgentActions(agentId: string): AgentAction[] {
    const agent = this.agents.get(agentId);
    return agent?.menu || [];
  }

  // Processa mensagem do usuário com contexto do agente
  async processMessage(
    agentId: string,
    message: string,
    context: ConversationContext
  ): Promise<AgentResponse> {
    // Usa persona, prompts e menu do agente
    // para gerar resposta contextualizada
  }

  // Inicia um workflow
  async startWorkflow(
    workflowId: string,
    projectContext: ProjectContext
  ): Promise<WorkflowInstance> {
    // Carrega steps do workflow
    // Inicializa estado
  }

  // Avança para próximo step
  async advanceWorkflow(
    instanceId: string,
    stepOutput: any
  ): Promise<WorkflowStep | null> {
    // Valida output do step atual
    // Carrega próximo step
  }
}
```

### 8.2 Real-time Communication

```typescript
// apps/api/src/websocket/handlers.ts

import { Server } from 'socket.io';
import { BMADAdapter } from '@bmad/core';

export function setupWebSocketHandlers(io: Server, bmad: BMADAdapter) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Usuário envia mensagem para agente
    socket.on('agent:message', async (data) => {
      const { agentId, message, conversationId } = data;

      // Indica que agente está "pensando"
      socket.emit('agent:typing', { agentId, isTyping: true });

      // Processa mensagem
      const response = await bmad.processMessage(
        agentId,
        message,
        await getConversationContext(conversationId)
      );

      // Envia resposta
      socket.emit('agent:message', {
        agentId,
        message: response.content,
        metadata: response.metadata,
      });

      socket.emit('agent:typing', { agentId, isTyping: false });
    });

    // Workflow events
    socket.on('workflow:advance', async (data) => {
      const { instanceId, stepOutput } = data;

      const nextStep = await bmad.advanceWorkflow(instanceId, stepOutput);

      socket.emit('workflow:progress', {
        instanceId,
        currentStep: nextStep?.stepNumber,
        completed: nextStep === null,
      });
    });
  });
}
```

---

## 9. Considerações de UX para Consumidor Final

### 9.1 Simplificação da Complexidade
- **Wizard de Onboarding**: Guia passo-a-passo para criar primeiro projeto
- **Templates Pré-configurados**: "Start a SaaS", "Build a Mobile App", etc.
- **Auto-seleção de Agentes**: Sistema sugere agentes baseado no contexto
- **Progress Gamification**: Badges, progress bars, celebrações

### 9.2 Linguagem Acessível
- Substituir jargões técnicos por termos simples
- Tooltips explicativos em toda interface
- Modo "Explain Like I'm 5" opcional
- Suporte multi-idioma (pt-BR prioritário)

### 9.3 Fluxo Guiado
- Nunca deixar usuário "perdido"
- Sempre ter próxima ação sugerida
- Chat de ajuda sempre disponível
- Tutorials interativos integrados

### 9.4 Responsividade
- Mobile-first design
- PWA para acesso offline
- Push notifications para progresso

---

## 10. Roadmap de Implementação

### Fase 1: Foundation (MVP)
- [ ] Setup monorepo com Turborepo
- [ ] Refatorar BMAD core como package importável
- [ ] Backend básico com autenticação
- [ ] Frontend com dashboard e chat básico
- [ ] 1 workflow completo funcionando (Quick-Spec)

### Fase 2: Core Features
- [ ] Todos os agentes BMM integrados
- [ ] Workflow engine completo
- [ ] Editor de artefatos
- [ ] Sistema de projetos
- [ ] Export de artefatos

### Fase 3: Polish
- [ ] UX refinada com animações
- [ ] Onboarding wizard
- [ ] Templates de projeto
- [ ] Temas e personalização
- [ ] Mobile responsivo

### Fase 4: Scale
- [ ] Colaboração em tempo real
- [ ] Integrações (GitHub, Jira, etc.)
- [ ] API pública
- [ ] Módulos custom via interface
- [ ] Analytics e métricas

---

## 11. Considerações Finais

Transformar o BMAD-METHOD em uma aplicação web consumer-facing é um projeto significativo, mas muito viável. O core do BMAD já está bem estruturado com:

- Definições de agentes em YAML (fácil de parsear)
- Workflows modulares (fácil de expor como steps)
- Sistema de módulos (extensibilidade built-in)

As principais adaptações necessárias são:
1. **Camada de persistência** para projetos e conversas
2. **API HTTP/WebSocket** para expor funcionalidades
3. **Interface visual** para interagir com agentes
4. **Simplificação de UX** para usuários não-técnicos

O investimento vale a pena porque democratiza acesso a metodologias de desenvolvimento estruturadas, permitindo que pessoas sem background técnico profundo consigam planejar e executar projetos de software de forma guiada.
