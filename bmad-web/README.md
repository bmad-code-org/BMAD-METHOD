# BMAD Web - Consumer Frontend Application

Uma aplicacao web completa para consumidores finais do BMAD-METHOD (Build More, Architect Dreams).

## Visao Geral

Este projeto transforma o BMAD-METHOD (atualmente uma CLI) em uma aplicacao web acessivel para usuarios finais, permitindo que qualquer pessoa utilize o framework de desenvolvimento agil impulsionado por IA.

## Estrutura do Projeto

```
bmad-web/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend Express + WebSocket
├── packages/
│   ├── bmad-core/    # Core BMAD como biblioteca
│   ├── ui/           # Componentes UI compartilhados
│   └── config/       # Configuracoes compartilhadas
└── docs/             # Documentacao
```

## Stack Tecnologico

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes
- **Zustand** - Estado global
- **TanStack Query** - Data fetching
- **Socket.io Client** - Real-time

### Backend
- **Node.js 20+** - Runtime
- **Express** - HTTP Server
- **Socket.io** - WebSocket
- **Prisma** - ORM (para producao)
- **JWT** - Autenticacao

## Requisitos

- Node.js 20.0.0 ou superior
- npm 10.0.0 ou superior

## Instalacao

1. Clone o repositorio:
```bash
git clone https://github.com/seu-usuario/BMAD-METHOD.git
cd BMAD-METHOD/bmad-web
```

2. Instale as dependencias:
```bash
npm install
```

3. Configure as variaveis de ambiente:
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

4. Inicie o desenvolvimento:
```bash
npm run dev
```

Isso iniciara:
- Frontend: http://localhost:3000
- API: http://localhost:4000

## Funcionalidades

### Para Usuarios

- **Dashboard de Projeto** - Visao geral do seu projeto
- **Chat com Agentes IA** - Interacao em tempo real com 21+ agentes especializados
- **Workflows Guiados** - 50+ workflows para todas as fases de desenvolvimento
- **Editor de Artefatos** - Edicao e versionamento de documentos
- **Tracks Adaptativos** - Quick Flow (~5min), BMAD Method (~15min), Enterprise (~30min)

### Agentes Disponiveis

| Agente | Funcao |
|--------|--------|
| John (PM) | Product Manager - PRDs e requisitos |
| Alex (Architect) | Arquiteto - Design de sistemas |
| Dev | Desenvolvedor Senior - Implementacao |
| Barry | Quick-Flow Solo Dev - Desenvolvimento rapido |
| UX Designer | Design de experiencia do usuario |
| Tech Writer | Documentacao tecnica |
| TEA | Test Architecture Agent - Estrategia de testes |
| Scrum Master | Coordenacao de equipe |
| Analyst | Analise de dados e requisitos |

### Workflows Principais

**Analise**
- Project Discovery
- Requirement Elicitation
- Team Composition

**Planejamento**
- PRD Creation
- Workflow Initialization

**Solutioning**
- Architecture Design
- Epic/Story Creation
- Excalidraw Diagrams

**Implementacao**
- Sprint Planning
- Sprint Status
- Retrospectives

**Quick Flow**
- Quick-Spec (~5 min)
- Quick-Dev (~5 min)

## Scripts Disponiveis

```bash
# Desenvolvimento
npm run dev          # Inicia frontend e backend

# Build
npm run build        # Build de producao

# Lint
npm run lint         # Verifica codigo

# Banco de dados (producao)
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Sincroniza schema
npm run db:studio    # Interface do banco

# Limpeza
npm run clean        # Remove node_modules e builds
```

## Arquitetura

### Frontend (Next.js)

```
apps/web/src/
├── app/              # Rotas (App Router)
│   ├── (auth)/       # Login, Register
│   ├── (dashboard)/  # Area logada
│   ├── projects/     # Gestao de projetos
│   ├── agents/       # Interface de agentes
│   └── workflows/    # Visualizacao de workflows
├── components/       # Componentes React
├── hooks/            # Hooks customizados
├── stores/           # Estado (Zustand)
└── types/            # TypeScript types
```

### Backend (Express)

```
apps/api/src/
├── routes/           # Endpoints REST
├── services/         # Logica de negocio
├── middleware/       # Auth, errors
├── websocket/        # Handlers real-time
├── bmad/             # Integracao BMAD Core
└── database/         # Models (Prisma)
```

### Packages

- **@bmad/core** - Tipos, loaders de agentes e workflows
- **@bmad/ui** - Componentes compartilhados (Button, Card, Input, etc.)
- **@bmad/config** - Configuracoes de TypeScript, ESLint

## API Endpoints

### Autenticacao
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario atual

### Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Detalhes do projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Agentes
- `GET /api/agents` - Listar agentes
- `GET /api/agents/:id` - Detalhes do agente
- `POST /api/agents/:id/chat` - Chat com agente

### Workflows
- `GET /api/workflows` - Listar workflows
- `POST /api/workflows/:id/start` - Iniciar workflow
- `GET /api/workflows/instance/:id/status` - Status
- `POST /api/workflows/instance/:id/step/complete` - Completar passo

### WebSocket Events
- `agent:message` - Mensagem do agente
- `agent:typing` - Indicador de digitacao
- `workflow:progress` - Progresso do workflow
- `artifact:updated` - Artefato atualizado

## Proximos Passos

### Fase 1 - MVP
- [x] Estrutura do monorepo
- [x] Frontend basico com Next.js
- [x] API com autenticacao
- [x] Chat com agentes
- [ ] Integracao com LLM (OpenAI/Anthropic)
- [ ] Persistencia em banco de dados

### Fase 2 - Features
- [ ] Todos os agentes integrados
- [ ] Workflow engine completo
- [ ] Editor de artefatos rico
- [ ] Versionamento de artefatos

### Fase 3 - Polish
- [ ] Onboarding wizard
- [ ] Templates de projeto
- [ ] Temas e personalizacao
- [ ] Mobile responsivo

### Fase 4 - Scale
- [ ] Colaboracao em tempo real
- [ ] Integracoes (GitHub, Jira)
- [ ] API publica
- [ ] Analytics

## Contribuindo

1. Fork o repositorio
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudancas (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licenca

MIT - Veja [LICENSE](../LICENSE) para detalhes.

---

**BMAD - Build More, Architect Dreams**

Framework de desenvolvimento agil impulsionado por IA com 21 agentes especializados e 50+ workflows guiados.
