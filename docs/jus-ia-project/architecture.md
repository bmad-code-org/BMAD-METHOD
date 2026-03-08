---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prd.md
  - product-brief.md
  - ux-design-specification.md
  - research.md
  - brainstorm.md
workflowType: 'architecture'
project_name: 'Jus IA Start Kit'
user_name: 'Gabriel Vaz'
date: '2026-03-08'
lastStep: 8
status: 'complete'
completedAt: '2026-03-08'
---

# Architecture Decision Document — Jus IA Start Kit

_Documento construído colaborativamente para garantir que agentes de IA implementem de forma consistente._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

O PRD define 31 requisitos funcionais (FR1-FR31) organizados em 6 categorias:

| Categoria | FRs | Implicação Arquitetural |
|-----------|-----|------------------------|
| **Task Selection & Navigation** | FR1-FR5 | Roteamento com deep links, seleção hierárquica (tipo → área → subtipo) |
| **Guided Flow (Deterministic)** | FR6-FR10 | Engine de fluxo condicional, 10 templates de perguntas, validação server-side |
| **AI Contextual Refinement** | FR11-FR14 | Endpoint LLM backend, loading states, resposta assíncrona |
| **Prompt Assembly & Delivery** | FR15-FR19 | Template engine para montagem de prompt, URL builder com encoding |
| **URL Overflow Handling** | FR20-FR22 | Detecção de limite de caracteres, fallback copy-paste |
| **Sharing & Distribution** | FR23-FR24 | OG tags dinâmicas por rota, deep links compartilháveis |
| **Analytics & Tracking** | FR25-FR29 | Client-side analytics, tracking de funil, contagem de redirects |
| **Edge Cases & Fallbacks** | FR30-FR31 | Handling de fluxos não disponíveis, sugestão de alternativas |

**Non-Functional Requirements:**

| Categoria | NFRs | Impacto Arquitetural |
|-----------|------|---------------------|
| **Performance** | NFR1-NFR3 | MPA leve, <5s em 3G, loading state para LLM |
| **Security** | NFR4-NFR6 | Zero persistência, sem auth, sem cookies de sessão, logs sanitizados |
| **Integration** | NFR7-NFR9 | URL parametrizada para Jus IA, validação de limite, fallback idêntico |
| **Compatibility** | NFR10-NFR12 | Evergreen browsers, mobile-first, OG tags para WhatsApp |

**Scale & Complexity:**

- **Primary domain:** Web application (MPA)
- **Complexity level:** Medium — stateless, sem persistência de dados, sem auth
- **Estimated architectural components:** ~8 (router, flow engine, template renderer, LLM client, prompt builder, URL builder, analytics, OG tags)
- **Unique constraint:** Zero data retention — dados transitam pelo backend apenas durante refinamento IA e são descartados

### Technical Constraints & Dependencies

| Constraint | Impacto |
|-----------|---------|
| **Stateless by design** | Sem banco de dados, sem sessão server-side, sem cache de estado do usuário |
| **URL limit ~2000 chars** | Prompt montado deve caber na URL ou acionar fallback copy-paste |
| **LLM latency** | Refinamento contextual tem latência de 2-5s — requer loading state |
| **Mobile-first MPA** | Cada tela é um page load — performance de HTML/CSS é crítica |
| **Zero auth** | Sem login, sem cookies de sessão, sem tracking de identidade |
| **Jus IA URL format** | Formato fixo: `ia.jusbrasil.com.br/conversa?q=...&send` |
| **10 flow types MVP** | Templates de prompt por área do direito requerem expertise jurídica |

### Cross-Cutting Concerns Identified

1. **Data Transit Security**: Dados do caso passam pelo backend para refinamento IA — devem ser descartados após resposta, sem logs de conteúdo
2. **Progressive Enhancement**: Base funcional sem JS (MPA form submit), JS para melhorias (validação inline, copy-to-clipboard, transições)
3. **Analytics**: Único estado persistente — client-side tracking em todas as páginas do fluxo
4. **OG Tags**: Dinâmicas por rota para preview correto no WhatsApp
5. **Error Handling**: Retry automático para LLM, fallback graceful para URL overflow
6. **Performance**: Bundle CSS mínimo (Tailwind purged), HTML semântico leve, sem JS framework pesado

---

## Starter Template Evaluation

### Primary Technology Domain

**MPA (Multi Page Application)** — server-rendered HTML com Tailwind CSS. Não é SPA, não é SSR com hydration. Cada page load é um HTML completo gerado no servidor.

### Starter Options Considered

| Opção | Tipo | Avaliação |
|-------|------|-----------|
| **Next.js** | Full-stack React SSR | Overkill — traz React, hydration, e complexidade desnecessária para um MPA de 5 telas |
| **Express + EJS/Pug** | MPA clássico Node.js | Simples, leve, MPA nativo. Sem overhead de framework frontend |
| **Fastify + Nunjucks** | MPA rápido Node.js | Melhor performance que Express, templates flexíveis, plugin ecosystem |
| **Hono** | Edge-first web framework | Ultralight, funciona em Cloudflare Workers/Vercel Edge, mas menos maduro para MPA templates |
| **Python Flask + Jinja2** | MPA Python | Maduro mas equipe prefere ecossistema Node/TypeScript |

### Selected Starter: Fastify + Nunjucks + Tailwind CSS

**Rationale for Selection:**

1. **Performance**: Fastify é ~2x mais rápido que Express em benchmarks. Para MPA com loading de LLM, cada ms conta
2. **MPA nativo**: Nunjucks templates renderizam HTML server-side sem JS client-side — exatamente o modelo MPA
3. **TypeScript first**: Fastify tem suporte nativo a TypeScript com type providers
4. **Plugin ecosystem**: Fastify plugins para static files, form body, cors, rate limiting
5. **Tailwind integration**: CSS build separado do runtime — Tailwind compila para CSS estático servido como asset
6. **Boring technology**: Fastify é estável (v5+), bem documentado, usado em produção em escala
7. **Lightweight**: Sem React, sem Vue, sem hydration, sem virtual DOM. HTML puro + CSS + JS progressivo

**Initialization Command:**

```bash
mkdir jus-ia-start-kit && cd jus-ia-start-kit
npm init -y
npm install fastify @fastify/static @fastify/formbody @fastify/view nunjucks
npm install -D typescript @types/node tailwindcss @tailwindcss/cli
npx tsc --init
npx tailwindcss init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5.x com Node.js 22 LTS
- ESM modules (type: "module" no package.json)
- Strict mode TypeScript

**Styling Solution:**
- Tailwind CSS v4+ com configuração customizada de design tokens
- CSS compilado como asset estático (não inline)
- Purge em produção para bundle mínimo

**Build Tooling:**
- TypeScript compiler (tsc) para build do server
- Tailwind CLI para build do CSS
- npm scripts para development e production

**Testing Framework:**
- Vitest para unit tests (compatível com TypeScript ESM nativo)
- Playwright para E2E tests (mobile viewport testing)

**Code Organization:**
- Feature-based modules (cada fluxo jurídico como módulo)
- Templates Nunjucks separados por tela
- Shared partials para componentes reutilizáveis

**Development Experience:**
- Fastify com `--watch` para hot reload do server
- Tailwind com `--watch` para hot reload do CSS
- TypeScript em modo watch

**Note:** Project initialization usando este comando deve ser a primeira story de implementação.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Server framework e template engine (Fastify + Nunjucks) ✅
2. Flow engine pattern (state machine por fluxo)
3. LLM integration pattern (server-side proxy)
4. Prompt assembly strategy (template composition)
5. URL builder e overflow detection

**Important Decisions (Shape Architecture):**
6. Form state management across MPA pages
7. Analytics integration approach
8. OG tags generation strategy
9. Error handling e retry patterns

**Deferred Decisions (Post-MVP):**
- CDN e caching strategy (premature optimization)
- Rate limiting detalhado (monitorar antes de otimizar)
- A/B testing infrastructure (v2)

### Data Architecture

**Decisão: Zero Persistence — In-Memory Only**

| Aspecto | Decisão |
|---------|---------|
| **Database** | Nenhum. Sem banco de dados no MVP |
| **Session state** | Hidden form fields + URL query params entre pages |
| **Flow state** | Dados acumulados via hidden inputs em cada form submit (MPA pattern) |
| **LLM context** | Montado server-side a cada request a partir dos form data recebidos |
| **Analytics** | Client-side (GA4 ou Plausible) — não passa pelo backend |

**Rationale:** O produto é stateless by design (NFR4-NFR6). Dados do caso existem apenas durante a sessão do browser. Cada page load do MPA recebe os dados acumulados via hidden form fields e os passa adiante. Sem cookies, sem localStorage para dados do caso.

**Form State Pattern:**
```
Tela 1 → form submit → Tela 2 (hidden inputs com dados da Tela 1)
                        → form submit → Tela 3 (hidden inputs com dados das Telas 1+2)
                                         → ...até Preview
```

### Authentication & Security

**Decisão: Zero Auth**

| Aspecto | Decisão |
|---------|---------|
| **Authentication** | Nenhuma. Sem login, sem cadastro |
| **Authorization** | Nenhuma. Todas as rotas são públicas |
| **Data protection** | Dados transitam via form POST, não ficam na URL (exceto deep links de entrada) |
| **LLM security** | Backend sanitiza input antes de enviar ao LLM. Sem log de conteúdo jurídico |
| **CSRF** | Token CSRF em forms para prevenir submissions maliciosas |
| **Rate limiting** | Básico por IP no endpoint LLM para prevenir abuso |

**Rationale:** NFR6 explicitamente define "não há autenticação, cookies de sessão ou tracking de identidade". O único ponto de segurança é o endpoint LLM (prevenir abuso) e sanitização de inputs (prevenir injection).

### API & Communication Patterns

**Decisão: Server-Side LLM Proxy — Sem API Pública**

| Aspecto | Decisão |
|---------|---------|
| **External API** | Nenhuma API pública exposta. O produto é um MPA, não uma API |
| **LLM communication** | Server-side: Fastify route handler → LLM provider SDK → response |
| **LLM provider** | OpenAI API (GPT-4o-mini para custo-benefício) ou Anthropic Claude Haiku |
| **Request format** | Form POST do browser → Fastify handler monta context → chama LLM → renderiza template |
| **Error handling** | Retry 1x automático. Se falhar: renderiza template de erro com botão retry |
| **Response format** | HTML renderizado (Nunjucks template) — não JSON |

**Data Flow:**
```
Browser → POST form data → Fastify handler
  → Monta contexto do caso a partir dos form fields
  → Chama LLM API com prompt de sistema + contexto
  → Recebe perguntas de refinamento da IA
  → Renderiza template Nunjucks com perguntas
  → Retorna HTML ao browser
```

**Prompt Assembly Flow:**
```
Browser → POST com todas as respostas → Fastify handler
  → Combina template de prompt (por área/subtipo) + respostas do advogado
  → Gera prompt final otimizado para Jus IA
  → Verifica tamanho do prompt (< ~1800 chars para URL encoding safety)
  → Se cabe: gera URL parametrizada
  → Se não cabe: renderiza template com copy-paste fallback
  → Retorna HTML de preview ao browser
```

### Frontend Architecture

**Decisão: MPA com Progressive Enhancement**

| Aspecto | Decisão |
|---------|---------|
| **Rendering** | 100% server-side (Nunjucks templates). Zero client-side rendering |
| **JavaScript** | Progressive enhancement only. Produto funciona sem JS |
| **State management** | Hidden form fields (zero client-side state) |
| **Routing** | Fastify routes — cada tela é uma rota do servidor |
| **Components** | Nunjucks partials/macros — reutilizáveis no server |
| **CSS** | Tailwind CSS compilado como asset estático |
| **Icons** | Heroicons como SVG inline nos templates |

**Progressive Enhancement (JS opcional):**

| Feature | Sem JS | Com JS |
|---------|--------|--------|
| **Form submit** | Normal page reload | Fetch + DOM swap (opcional) |
| **Validation** | Server-side após submit | Inline validation ao sair do campo |
| **Copy to clipboard** | Selecionar texto manualmente | Botão "Copiar" com `navigator.clipboard` |
| **Chip selection** | Radio buttons styled | Click handler + visual feedback |
| **Loading state** | Page load normal | Skeleton shimmer animation |

**JS Bundle Strategy:**
- Um arquivo `app.js` mínimo (~5KB gzipped) com progressive enhancements
- Sem framework JS (sem React, Vue, Alpine, HTMX)
- Vanilla JS com módulos ES nativos do browser
- Carregado com `defer` para não bloquear render

### Infrastructure & Deployment

**Decisão: Single Container Deploy — Railway ou Render**

| Aspecto | Decisão |
|---------|---------|
| **Hosting** | Railway.app ou Render.com — PaaS simples com deploy por git push |
| **Container** | Single Node.js container (Fastify serve tudo: HTML, CSS, JS, assets) |
| **CDN** | Cloudflare free tier como proxy — caching de assets estáticos |
| **Domain** | Custom domain (ex: `startkit.jusia.com.br` ou similar) |
| **SSL** | Automático via PaaS + Cloudflare |
| **CI/CD** | GitHub Actions → build TypeScript + Tailwind → deploy via git push |
| **Monitoring** | PaaS built-in metrics + Sentry free tier para error tracking |
| **Logging** | Structured JSON logs via Fastify logger (pino). Sem log de conteúdo jurídico |
| **Environment** | `.env` para LLM API key, analytics IDs, feature flags mínimos |

**Rationale:** Produto lean, zero banco de dados, single container. PaaS é a abordagem mais simples que funciona. Sem Kubernetes, sem microservices, sem Docker Compose. Um container Node.js que serve tudo.

**Scaling Strategy (se necessário):**
- PaaS auto-scaling horizontal (Railway/Render suportam)
- Cloudflare cacheia assets estáticos (CSS, JS, imagens, fonts)
- LLM é o bottleneck — scaling depende do budget de inferência

### Decision Impact Analysis

**Implementation Sequence:**
1. Project setup (Fastify + TypeScript + Tailwind + Nunjucks)
2. Template system (layouts, partials, design tokens)
3. Routing e deep links
4. Flow engine (1 fluxo trabalhista completo)
5. LLM integration (refinamento contextual)
6. Prompt assembly + URL builder
7. Preview + redirect + copy fallback
8. Analytics integration
9. OG tags
10. Expand para 10 fluxos

**Cross-Component Dependencies:**
- Flow engine depende de templates Nunjucks + routing
- LLM integration depende de flow engine (monta contexto a partir das respostas)
- Prompt assembly depende de LLM integration + flow engine
- URL builder depende de prompt assembly
- Preview depende de URL builder (decide se redirect ou copy fallback)

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**12 áreas onde agentes IA poderiam fazer escolhas diferentes identificadas e resolvidas.**

### Naming Patterns

**File & Directory Naming:**
- Arquivos: `kebab-case.ts` (ex: `flow-engine.ts`, `prompt-builder.ts`)
- Diretórios: `kebab-case/` (ex: `legal-flows/`, `template-helpers/`)
- Templates: `kebab-case.njk` (ex: `chip-selector.njk`, `preview-card.njk`)
- Tests: `*.test.ts` co-located (ex: `prompt-builder.test.ts` ao lado de `prompt-builder.ts`)

**Route Naming:**
- Rotas de fluxo: `/:area/:subtipo` (ex: `/trabalhista/horas-extras`)
- Kebab-case, sem acentos, lowercase
- Rotas internas: `/flow/:area/:subtipo/step/:stepNumber`
- POST endpoints: mesma rota que GET (form submission)

**Code Naming:**
- Variáveis e funções: `camelCase` (ex: `buildPrompt`, `flowConfig`)
- Types e interfaces: `PascalCase` (ex: `FlowStep`, `LegalArea`)
- Constants: `UPPER_SNAKE_CASE` (ex: `MAX_URL_LENGTH`, `LLM_TIMEOUT_MS`)
- Template variables: `snake_case` nos Nunjucks (ex: `{{ area_direito }}`, `{{ tipo_tarefa }}`)

**Nunjucks Specifics:**
- Macros: `camelCase` (ex: `{% macro chipSelector(options) %}`)
- Blocks: `camelCase` (ex: `{% block pageContent %}`)
- Partials: prefixo `_` (ex: `_stepper-progress.njk`)

### Structure Patterns

**Project Organization:** Feature-based com shared core.

```
src/
├── server.ts              # Entry point — Fastify setup
├── config/                # Configuration loading
├── routes/                # Fastify route handlers
│   ├── home.ts            # Landing page route
│   └── flow.ts            # Flow routes (/:area/:subtipo/...)
├── flows/                 # Flow definitions (per legal area)
│   ├── types.ts           # Shared flow types
│   ├── trabalhista/       # Trabalhista flows
│   │   ├── horas-extras.ts
│   │   ├── rescisao-indireta.ts
│   │   └── ...
│   └── civel/             # Cível flows
│       ├── cobranca.ts
│       └── ...
├── services/              # Business logic services
│   ├── flow-engine.ts     # Core flow execution logic
│   ├── llm-client.ts      # LLM API client
│   ├── prompt-builder.ts  # Prompt assembly from responses
│   └── url-builder.ts     # URL generation + overflow detection
├── templates/             # Nunjucks templates
│   ├── layouts/
│   │   └── base.njk       # Base layout (head, body, scripts)
│   ├── pages/
│   │   ├── home.njk       # Landing page
│   │   ├── flow-step.njk  # Generic flow step page
│   │   ├── preview.njk    # Preview + redirect page
│   │   └── error.njk      # Error page
│   └── partials/
│       ├── _stepper-progress.njk
│       ├── _chip-selector.njk
│       ├── _preview-card.njk
│       ├── _legal-badge.njk
│       ├── _loading-state.njk
│       ├── _copy-fallback.njk
│       └── _og-tags.njk
├── public/                # Static assets
│   ├── css/
│   │   └── app.css        # Compiled Tailwind output
│   ├── js/
│   │   └── app.js         # Progressive enhancement JS
│   └── images/
│       └── og-default.png # Default OG image
└── utils/                 # Shared utilities
    ├── sanitize.ts        # Input sanitization
    ├── analytics.ts       # Analytics event helpers
    └── og-tags.ts         # OG tag generation
```

**Test Organization:** Co-located com source.

```
src/services/flow-engine.ts
src/services/flow-engine.test.ts    # Unit test ao lado
src/services/prompt-builder.ts
src/services/prompt-builder.test.ts
tests/                              # E2E tests separados
├── e2e/
│   ├── flow-trabalhista.spec.ts
│   ├── flow-civel.spec.ts
│   └── url-overflow.spec.ts
└── fixtures/
    ├── flow-responses.ts           # Mock responses para testes
    └── llm-responses.ts            # Mock LLM responses
```

### Format Patterns

**Form Data Format:**
```typescript
// Dados acumulados entre telas via hidden inputs
interface FlowState {
  area: string;          // "trabalhista"
  subtipo: string;       // "horas-extras"
  step: number;          // Current step number
  responses: Record<string, string | string[]>;  // All responses so far
}
```

**LLM Request Format:**
```typescript
interface LlmRefinementRequest {
  systemPrompt: string;           // Template por área/subtipo
  caseContext: Record<string, string>;  // Respostas coletadas
  maxQuestions: number;           // Limitar perguntas de refinamento (2-3)
}
```

**LLM Response Format:**
```typescript
interface LlmRefinementResponse {
  questions: Array<{
    id: string;
    text: string;
    type: "select" | "multiselect" | "text";
    options?: string[];           // Para select/multiselect
    placeholder?: string;         // Para text
  }>;
}
```

**Prompt Output Format:**
```typescript
interface AssembledPrompt {
  text: string;                   // Prompt completo para Jus IA
  legalReferences: string[];      // ["art. 59 CLT", "Súmula 85 TST"]
  charCount: number;              // Contagem de caracteres
  fitsInUrl: boolean;             // charCount <= MAX_URL_LENGTH
  encodedUrl?: string;            // URL completa se fitsInUrl
}
```

**Error Format:**
```typescript
interface AppError {
  code: string;                   // "LLM_TIMEOUT" | "LLM_ERROR" | "INVALID_FLOW"
  message: string;                // Mensagem para o usuário (pt-BR)
  retryable: boolean;             // Se o botão retry deve aparecer
}
```

### Communication Patterns

**Request-Response Pattern (MPA):**
- Browser envia form POST → Fastify handler processa → Retorna HTML
- Sem WebSocket, sem SSE, sem polling
- Loading state para LLM: client-side JS mostra skeleton enquanto form submits (progressive enhancement)

**Template Rendering Pattern:**
```typescript
// Todos os handlers seguem este padrão
async function handleFlowStep(request: FastifyRequest, reply: FastifyReply) {
  const flowState = parseFlowState(request.body);
  const stepConfig = getStepConfig(flowState.area, flowState.subtipo, flowState.step);

  // Se step precisa de LLM refinement
  if (stepConfig.requiresLlm) {
    const refinement = await llmClient.refine(flowState);
    return reply.view("pages/flow-step.njk", { flowState, questions: refinement.questions });
  }

  return reply.view("pages/flow-step.njk", { flowState, questions: stepConfig.questions });
}
```

**Analytics Pattern:**
```html
<!-- Em cada template, antes do </body> -->
<script>
  // Analytics events disparados no client
  trackEvent('flow_step_view', { area: '{{ area }}', subtipo: '{{ subtipo }}', step: {{ step }} });
</script>
```

### Process Patterns

**Error Handling:**
- LLM timeout (>10s): retry automático 1x. Se falhar: renderiza `error.njk` com "Não conseguimos analisar seu caso agora" + botão retry
- Invalid flow (área/subtipo não existe): renderiza `error.njk` com "Este fluxo ainda não está disponível" + links para fluxos disponíveis
- Form validation error: re-renderiza a mesma tela com mensagens de erro inline
- Uncaught errors: Sentry captura + renderiza página genérica de erro

**Loading State Pattern:**
- Sem JS: form submit → page load normal (browser mostra spinner nativo)
- Com JS: intercepta form submit → mostra skeleton/shimmer → fetch → substitui conteúdo
- Microcopy de loading: "Analisando seu caso..." (nunca "Carregando...")

**Input Sanitization:**
- Todos os inputs de texto: strip HTML tags, trim whitespace, limit length (500 chars)
- Valores de select/chip: validar contra opções permitidas (whitelist)
- Não salvar raw input em logs — apenas metadata (área, subtipo, step number)

### Enforcement Guidelines

**All AI Agents MUST:**

1. Seguir o naming pattern: arquivos kebab-case, variáveis camelCase, constants UPPER_SNAKE_CASE
2. Nunca persistir dados do caso em disco, banco, ou logs
3. Usar Nunjucks partials para componentes — nunca duplicar HTML
4. Manter progressive enhancement: tudo funciona sem JS
5. Sanitizar inputs antes de qualquer processamento
6. Usar o pattern de FlowState para acumular respostas entre telas
7. Tratar erros de LLM com retry 1x + fallback para página de erro
8. Incluir analytics tracking em toda tela do fluxo

### Pattern Examples

**Good Examples:**
```typescript
// ✅ Correto — flow step handler seguindo o pattern
export async function handleStep(req: FastifyRequest, reply: FastifyReply) {
  const flowState = parseFlowState(req.body as Record<string, string>);
  const config = getStepConfig(flowState.area, flowState.subtipo, flowState.step);
  return reply.view("pages/flow-step.njk", { flowState, ...config });
}

// ✅ Correto — template usando partials
// pages/flow-step.njk
{% extends "layouts/base.njk" %}
{% block pageContent %}
  {% include "partials/_stepper-progress.njk" %}
  {% for question in questions %}
    {% if question.type == "select" %}
      {{ chipSelector(question) }}
    {% endif %}
  {% endfor %}
{% endblock %}
```

**Anti-Patterns:**
```typescript
// ❌ Errado — persistindo dados do caso
await db.insert('user_cases', { data: flowState.responses });

// ❌ Errado — logando conteúdo jurídico
logger.info('User response:', flowState.responses);

// ❌ Errado — client-side rendering
const App = () => <FlowStep questions={questions} />;  // Sem React!

// ❌ Errado — naming inconsistente
const UserFlowState = {};  // Deveria ser flowState (camelCase)
const flow_engine = {};    // Deveria ser flowEngine (camelCase)
```

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
jus-ia-start-kit/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── .env.example
├── .env
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + test + build
│       └── deploy.yml                # Deploy to Railway/Render
│
├── src/
│   ├── server.ts                     # Fastify entry point
│   ├── config/
│   │   ├── index.ts                  # Config loader from env
│   │   ├── flows.ts                  # Flow registry (all 10 flows)
│   │   └── constants.ts              # MAX_URL_LENGTH, LLM_TIMEOUT_MS, etc.
│   │
│   ├── routes/
│   │   ├── home.ts                   # GET / — landing page
│   │   ├── flow.ts                   # GET/POST /:area/:subtipo/... — flow routes
│   │   └── health.ts                 # GET /health — health check
│   │
│   ├── flows/
│   │   ├── types.ts                  # FlowConfig, FlowStep, Question types
│   │   ├── trabalhista/
│   │   │   ├── index.ts              # Trabalhista area config
│   │   │   ├── horas-extras.ts       # Flow: horas extras
│   │   │   ├── horas-extras.test.ts
│   │   │   ├── rescisao-indireta.ts  # Flow: rescisão indireta
│   │   │   ├── rescisao-indireta.test.ts
│   │   │   ├── dano-moral.ts         # Flow: dano moral
│   │   │   ├── acumulo-funcao.ts     # Flow: acúmulo de função
│   │   │   └── contestacao.ts        # Flow: contestação trabalhista
│   │   └── civel/
│   │       ├── index.ts              # Cível area config
│   │       ├── cobranca.ts           # Flow: cobrança
│   │       ├── indenizacao.ts        # Flow: indenização
│   │       ├── obrigacao-fazer.ts    # Flow: obrigação de fazer
│   │       ├── contestacao.ts        # Flow: contestação cível
│   │       └── contrato.ts           # Flow: contrato revisão
│   │
│   ├── services/
│   │   ├── flow-engine.ts            # Core flow logic
│   │   ├── flow-engine.test.ts
│   │   ├── llm-client.ts             # LLM API client (OpenAI/Anthropic)
│   │   ├── llm-client.test.ts
│   │   ├── prompt-builder.ts         # Prompt assembly from responses
│   │   ├── prompt-builder.test.ts
│   │   ├── url-builder.ts            # URL generation + overflow detection
│   │   └── url-builder.test.ts
│   │
│   ├── templates/
│   │   ├── layouts/
│   │   │   └── base.njk              # Base HTML layout
│   │   ├── pages/
│   │   │   ├── home.njk              # Landing: "O que você precisa?"
│   │   │   ├── select-area.njk       # Seleção de área do direito
│   │   │   ├── select-subtipo.njk    # Seleção de subtipo
│   │   │   ├── flow-step.njk         # Tela genérica de perguntas
│   │   │   ├── loading.njk           # Loading state (noscript fallback)
│   │   │   ├── preview.njk           # Preview + redirect/copy
│   │   │   ├── not-available.njk     # Fluxo não disponível
│   │   │   └── error.njk             # Erro genérico
│   │   └── partials/
│   │       ├── _stepper-progress.njk # Componente: barra de progresso
│   │       ├── _chip-selector.njk    # Componente: seleção por chips
│   │       ├── _preview-card.njk     # Componente: card do preview
│   │       ├── _legal-badge.njk      # Componente: badge jurídico
│   │       ├── _loading-state.njk    # Componente: loading skeleton
│   │       ├── _copy-fallback.njk    # Componente: copy + link
│   │       ├── _og-tags.njk          # OG meta tags
│   │       ├── _hidden-state.njk     # Hidden inputs com flow state
│   │       ├── _analytics.njk        # Analytics script snippet
│   │       └── _back-button.njk      # Botão voltar
│   │
│   ├── public/
│   │   ├── css/
│   │   │   └── app.css               # Tailwind compiled output
│   │   ├── js/
│   │   │   └── app.js                # Progressive enhancement
│   │   ├── images/
│   │   │   ├── og-default.png        # OG image padrão
│   │   │   ├── og-trabalhista.png    # OG image trabalhista
│   │   │   └── og-civel.png          # OG image cível
│   │   └── favicon.ico
│   │
│   └── utils/
│       ├── sanitize.ts               # Input sanitization
│       ├── sanitize.test.ts
│       ├── parse-flow-state.ts       # Parse hidden form fields
│       ├── parse-flow-state.test.ts
│       └── og-tags.ts                # OG tag data by route
│
├── tests/
│   ├── e2e/
│   │   ├── happy-path.spec.ts        # Fluxo completo trabalhista
│   │   ├── deep-links.spec.ts        # Deep link entry points
│   │   ├── url-overflow.spec.ts      # Overflow fallback
│   │   ├── back-navigation.spec.ts   # Browser back preserva estado
│   │   └── no-js.spec.ts             # Funciona sem JavaScript
│   └── fixtures/
│       ├── flow-responses.ts         # Mock form data
│       └── llm-responses.ts          # Mock LLM API responses
│
├── prompts/                           # Prompt templates (não é código)
│   ├── system/
│   │   ├── trabalhista-refinement.md  # System prompt para refinamento trabalhista
│   │   └── civel-refinement.md        # System prompt para refinamento cível
│   └── templates/
│       ├── trabalhista-horas-extras.md    # Template de prompt final
│       ├── trabalhista-rescisao-indireta.md
│       └── ...                        # Um por fluxo
│
└── Dockerfile                         # Container para deploy
```

### Architectural Boundaries

**API Boundaries:**
- Nenhuma API pública. O produto é um MPA — browser fala com Fastify via form POST
- Único ponto de integração externo: LLM API (OpenAI/Anthropic) chamado server-side
- Único ponto de saída: redirect para `ia.jusbrasil.com.br/conversa?q=...&send`

**Component Boundaries:**

| Componente | Responsabilidade | Não pode |
|------------|-----------------|----------|
| **Routes** | Receber request, parsear form data, chamar services, renderizar template | Conter lógica de negócio |
| **Flow Engine** | Determinar próximo step, validar respostas, decidir se precisa LLM | Acessar LLM diretamente |
| **LLM Client** | Comunicar com API do LLM, retry, timeout handling | Conhecer fluxos jurídicos |
| **Prompt Builder** | Montar prompt final a partir de template + respostas | Comunicar com LLM |
| **URL Builder** | Gerar URL parametrizada, detectar overflow | Conhecer conteúdo jurídico |
| **Templates** | Renderizar HTML a partir de dados | Conter lógica de negócio |
| **Flows** | Definir perguntas, validações, e metadata por fluxo jurídico | Acessar serviços externos |

**Data Flow:**

```
[Browser] → POST form data
    ↓
[Route Handler] → Parse form data → FlowState
    ↓
[Flow Engine] → Determina próximo step
    ↓ (se precisa IA)
[LLM Client] → Chama API → Perguntas de refinamento
    ↓
[Route Handler] → Renderiza template com perguntas
    ↓
[Browser] ← HTML response

--- No step final: ---

[Flow Engine] → Todas respostas coletadas
    ↓
[Prompt Builder] → Monta prompt final + legal references
    ↓
[URL Builder] → Gera URL ou detecta overflow
    ↓
[Route Handler] → Renderiza preview template
    ↓
[Browser] → Click "Gerar no Jus IA →" → Redirect
```

### Requirements to Structure Mapping

**FR1-FR5 (Task Selection & Navigation):**
- `src/routes/home.ts` + `src/routes/flow.ts` — routing e deep links
- `src/templates/pages/home.njk` + `select-area.njk` + `select-subtipo.njk`

**FR6-FR10 (Guided Flow):**
- `src/flows/` — definição dos 10 fluxos por área/subtipo
- `src/services/flow-engine.ts` — engine de execução
- `src/templates/pages/flow-step.njk` + partials

**FR11-FR14 (AI Refinement):**
- `src/services/llm-client.ts` — comunicação com LLM
- `prompts/system/` — system prompts por área
- `src/templates/partials/_loading-state.njk`

**FR15-FR22 (Prompt Assembly & Delivery):**
- `src/services/prompt-builder.ts` — montagem do prompt
- `src/services/url-builder.ts` — URL + overflow
- `prompts/templates/` — templates de prompt por fluxo
- `src/templates/pages/preview.njk` + `_preview-card.njk` + `_copy-fallback.njk`

**FR23-FR24 (Sharing & Distribution):**
- `src/utils/og-tags.ts` + `src/templates/partials/_og-tags.njk`
- Deep links via routing em `src/routes/flow.ts`

**FR25-FR29 (Analytics):**
- `src/templates/partials/_analytics.njk` — script tag em todas as páginas
- Client-side tracking (GA4 ou Plausible)

**FR30-FR31 (Edge Cases):**
- `src/templates/pages/not-available.njk`
- Flow engine retorna fluxos disponíveis quando subtipo não existe

### Integration Points

**Internal Communication:**
- Route handlers chamam services via import direto (sem message bus, sem events)
- Services são stateless functions — recebem dados, retornam resultado
- Templates recebem dados via `reply.view()` — sem state management

**External Integrations:**

| Integração | Método | Configuração |
|-----------|--------|-------------|
| **LLM API** | HTTP REST (OpenAI SDK / Anthropic SDK) | `LLM_API_KEY` env var |
| **Jus IA redirect** | URL parametrizada no browser | Hardcoded format no url-builder |
| **Analytics** | Client-side script tag | `ANALYTICS_ID` env var |
| **Error tracking** | Sentry SDK server-side | `SENTRY_DSN` env var |

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Todas as decisões tecnológicas são compatíveis e formam um stack coeso:
- Fastify (server) + Nunjucks (templates) + Tailwind (CSS) = MPA clássico com tooling moderno
- TypeScript unifica linguagem server + build tools
- Sem conflitos de dependência — stack mínimo sem overlapping

**Pattern Consistency:**
- Naming patterns consistentes (kebab-case arquivos, camelCase código, snake_case templates)
- Todos os handlers seguem o mesmo padrão: parse → process → render
- Progressive enhancement aplicado uniformemente: tudo funciona sem JS

**Structure Alignment:**
- Feature-based organization (`flows/trabalhista/`, `flows/civel/`) alinha com os 10 fluxos do PRD
- Separação clara: routes (HTTP) → services (lógica) → templates (apresentação)
- Tests co-located facilitam manutenção por feature

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| Categoria | FRs | Suporte Arquitetural |
|-----------|-----|---------------------|
| Task Selection | FR1-FR5 | ✅ Routes + deep links + templates |
| Guided Flow | FR6-FR10 | ✅ Flow engine + flow configs (10 flows) |
| AI Refinement | FR11-FR14 | ✅ LLM client + loading state |
| Prompt Assembly | FR15-FR19 | ✅ Prompt builder + URL builder |
| URL Overflow | FR20-FR22 | ✅ URL builder overflow detection + copy fallback |
| Sharing | FR23-FR24 | ✅ OG tags + deep links |
| Analytics | FR25-FR29 | ✅ Client-side analytics em todas as páginas |
| Edge Cases | FR30-FR31 | ✅ Not-available page + flow suggestions |

**Non-Functional Requirements Coverage:**

| NFR | Requisito | Suporte |
|-----|-----------|---------|
| NFR1 | <5s em 3G | ✅ MPA leve, Tailwind purged, sem JS framework |
| NFR2 | Loading state LLM | ✅ Loading template + progressive enhancement |
| NFR3 | Transições sem delay | ✅ MPA page loads nativos |
| NFR4 | Zero persistência | ✅ Sem DB, hidden form fields only |
| NFR5 | Sem log de conteúdo | ✅ Sanitize + log metadata only |
| NFR6 | Sem auth/cookies/tracking | ✅ Zero auth architecture |
| NFR7-NFR9 | URL format Jus IA | ✅ URL builder com formato específico |
| NFR10-NFR12 | Browsers + mobile + OG | ✅ Tailwind responsive + OG tags |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- Todas as decisões críticas documentadas com versões (Fastify 5.x, Node 22 LTS, Tailwind v4+)
- Patterns de implementação com exemplos concretos de código
- Consistência rules enforceable (naming, structure, process)

**Structure Completeness:**
- Diretório completo com todos os arquivos mapeados
- Cada FR mapeado para arquivos específicos
- Boundaries claros entre componentes

**Pattern Completeness:**
- Naming patterns cobrem arquivos, rotas, código, e templates
- Error handling definido para todos os cenários (LLM, validation, not found)
- Data flow documentado end-to-end

### Gap Analysis Results

**Nenhum gap crítico identificado.**

**Gaps importantes (não bloqueiam MVP):**
1. **Prompt templates** (em `prompts/`) requerem expertise jurídica para construção — não é decisão arquitetural, mas é dependência de conteúdo
2. **LLM provider final** (OpenAI vs Anthropic) pode ser decidido durante implementação baseado em custo/qualidade
3. **Analytics provider** (GA4 vs Plausible) decisão pode ser deferida

**Nice-to-have (pós-MVP):**
- Health check endpoint mais robusto (readiness probe)
- Structured logging com correlation IDs
- Feature flags para rollout gradual de novos fluxos

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed (31 FRs, 12 NFRs)
- [x] Scale and complexity assessed (medium, stateless MPA)
- [x] Technical constraints identified (URL limit, zero persistence, LLM latency)
- [x] Cross-cutting concerns mapped (security, analytics, progressive enhancement)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions (Fastify 5.x, Node 22 LTS, Tailwind v4+)
- [x] Technology stack fully specified (Fastify + Nunjucks + Tailwind + TypeScript)
- [x] Integration patterns defined (LLM proxy, URL redirect, client-side analytics)
- [x] Performance considerations addressed (MPA light, Tailwind purged, minimal JS)

**✅ Implementation Patterns**

- [x] Naming conventions established (kebab-case files, camelCase code, snake_case templates)
- [x] Structure patterns defined (feature-based, co-located tests)
- [x] Communication patterns specified (form POST → handler → template render)
- [x] Process patterns documented (error handling, loading, sanitization)

**✅ Project Structure**

- [x] Complete directory structure defined with all files
- [x] Component boundaries established (routes, services, flows, templates)
- [x] Integration points mapped (LLM API, Jus IA redirect, analytics)
- [x] Requirements to structure mapping complete (all 31 FRs mapped)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — stack simples, decisões claras, zero ambiguidade arquitetural

**Key Strengths:**
1. **Simplicidade radical**: MPA + hidden form fields + server-side rendering. Sem complexidade acidental
2. **Zero persistence**: Sem banco, sem sessão, sem cache = zero infraestrutura de dados para manter
3. **Progressive enhancement**: Funciona sem JS — robustez máxima para mobile entre audiências
4. **Feature-based organization**: Cada fluxo jurídico é um módulo isolado — fácil expandir para novos fluxos
5. **Patterns claros**: Agentes IA têm examples concretos de código correto vs. anti-patterns

**Areas for Future Enhancement:**
1. Service Worker para PWA offline (pós-MVP)
2. Edge deployment (Cloudflare Workers) para latência menor
3. A/B testing de templates de prompt
4. Integração bidirecional com Jus IA

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Never persist case data — this is a non-negotiable security requirement
- Always maintain progressive enhancement — everything must work without JS

**First Implementation Priority:**
1. `npm init` + install dependencies + TypeScript + Tailwind setup
2. Base layout template (`base.njk`) with design tokens from UX spec
3. Home route + landing page template
4. One complete flow (trabalhista/horas-extras) end-to-end
5. LLM integration for contextual refinement
6. Prompt builder + URL builder + preview
7. Expand to remaining 9 flows
