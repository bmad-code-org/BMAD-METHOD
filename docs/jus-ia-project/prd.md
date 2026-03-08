---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation-skipped, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
classification:
  projectType: web_app
  domain: legaltech
  complexity: medium
  domainKnowledge: high
  projectContext: greenfield
inputDocuments:
  - product-brief.md
  - brainstorm.md
  - research.md
  - 01-prompt-library.md
  - 02-calculadora-juridica.md
  - 03-dashboard-produtividade.md
  - 04-comunidade-prompts.md
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 1
  projectDocs: 4
workflowType: 'prd'
date: 2026-03-08
---

# Product Requirements Document - Jus IA Start Kit

**Author:** Gabriel Vaz
**Date:** 2026-03-08

## Executive Summary

65,9% dos advogados brasileiros já adotaram IA, mas 79% nunca se capacitaram — e facilidade de uso é o fator de conversão que mais cresce entre não-adotantes (+4,2pp). O gap entre ter acesso à ferramenta e extrair valor real é a principal causa de frustração, abandono e subutilização. O Jus IA Start Kit elimina essa barreira: um assistente web gratuito onde o advogado responde perguntas sobre seu caso em linguagem jurídica e é redirecionado ao Jus IA com um pedido pronto para gerar resultado de alta qualidade na primeira tentativa.

O produto combina perguntas diretas sobre o caso com inteligência que adapta o fluxo ao contexto — perguntando o que é relevante, pulando o que não é. O advogado nunca vê um prompt. Sem login, sem dados retidos, sem integração bidirecional. O Start Kit é o elo que faltava entre o advogado e o valor do Jus IA, dentro da estratégia de expansão de GTM do Jusbrasil.

### What Makes This Special

Bibliotecas estáticas de prompts (ADVBOX, Aurum, ITS Rio) exigem copy-paste e adaptação manual para IAs genéricas. O Jus IA Start Kit é fundamentalmente diferente: **interatividade condicional**. O sistema ajusta dinamicamente suas perguntas ao contexto do caso, construindo nos bastidores um pedido otimizado que chega ao Jus IA já formulado para aproveitar sua base verificada de 90M+ decisões. O Start Kit garante a qualidade do pedido; o Jus IA garante a qualidade da resposta — com a base jurídica que elimina as taxas de alucinação de 17-34% encontradas em ferramentas genéricas (Stanford). Nenhum concorrente conecta fluxos guiados a uma base verificada dessa escala.

## Success Criteria

### User Success

O usuário completa o fluxo e chega ao Jus IA com um pedido que gera resultado útil na primeira tentativa. Sucesso = eliminar o ciclo de tentativa-e-erro.

| Critério | Métrica | Meta |
|----------|---------|------|
| Fluxo completo | Taxa de conclusão (início → redirect) | >60% |
| Experiência rápida | Tempo médio do fluxo | <5 min |
| Resultado útil | Usuários que não reformulam no Jus IA | >70% |

### Business Success

O produto valida se fluxos guiados são um canal eficaz de ativação para o Jus IA. Foco exclusivo em volume de redirects.

| Critério | Métrica | Meta (mês 1) |
|----------|---------|:---:|
| North Star | Redirects concluídos | 1.000 |
| Alcance | Visitantes únicos | 3.000-5.000 |
| Eficácia do funil | Conversão visitante → redirect | >20% |
| Viralidade | Tráfego por referral/WhatsApp | >30% |

### Technical Success

Produto lean — complexidade mínima que funcione.

| Critério | Métrica | Meta |
|----------|---------|------|
| Disponibilidade | Uptime | Best-effort (sem SLA formal no MVP) |
| Performance | Carregamento | Razoável em mobile (sem meta rígida) |

### Go/No-Go & Measurable Outcomes

**Go/No-Go para v2:** >500 redirects/mês E taxa de conclusão >40% → validamos e expandimos. Abaixo disso, corta.

**O que NÃO medimos no MVP:**
- Retenção / retorno do usuário (one-shot by design)
- Conversão redirect → assinante Jus IA (fora do escopo)
- NPS ou satisfação (métrica de vaidade nesta fase)

## Project Classification

| Dimensão | Classificação |
|----------|--------------|
| **Tipo de Projeto** | Web App (MPA) |
| **Domínio** | Legaltech |
| **Complexidade** | Medium — stateless, sem persistência, sem integração com tribunais |
| **Conhecimento de Domínio** | High — fluxos jurídicos por área do direito brasileiro requerem expertise específica |
| **Contexto** | Greenfield — produto novo, sem legado |

## Target Users

| Persona | Perfil | Relação com IA | Motivação |
|---------|--------|---------------|-----------|
| **Dra. Carla** (primária) | Advogada autônoma, 42 anos, trabalhista | Nunca usou — quer resultado sem curva de aprendizado | "Se funcionar de primeira, eu uso" |
| **Dr. Rafael** (primário) | Advogado autônomo, 29 anos, trabalhista | Usa ChatGPT mas itera 3-5x por petição | Eliminar tentativa-e-erro |
| **Dr. Marcos** (secundário) | Sócio de escritório, 50 anos, cível/trabalhista | Não usa, mas equipe usa ChatGPT sem governança | Padronizar e eliminar Shadow AI |

## User Journeys

### Jornada 1: Dra. Carla — "A Primeira Vez" (Happy Path)

**Cena inicial:** Sexta-feira, 14h. Carla está entre audiências no fórum trabalhista, celular na mão. Uma colega manda no WhatsApp: "usa isso aqui pra montar petição, é muito fácil" com o link do Start Kit.

**Ação crescente:** Carla abre no celular. Sem login, sem cadastro. Primeira tela: "O que você precisa?" — toca [Petição Inicial]. Seleciona [Trabalhista] → [Horas Extras]. Responde 6 perguntas diretas sobre o caso: empregador PJ, CLT, 44h semanais, 10h extras/semana, período Jan 2023–Dez 2025. O sistema pergunta mais duas coisas contextuais: "Há registro de ponto?" e "Existem testemunhas?".

**Clímax:** Tela de preview: "Pronto! Montei seu pedido otimizado para o Jus IA. Ele vai gerar uma petição inicial de horas extras com fundamentação no art. 59 da CLT e Súmula 85 do TST." Botão "Gerar no Jus IA →".

**Resolução:** Carla toca o botão. Jus IA abre com o pedido pronto. Petição sai completa, com fundamentação, na primeira tentativa. 4 minutos do WhatsApp ao resultado. Carla pensa: "Por que eu não fiz isso antes?" — e encaminha o link para mais 3 colegas.

**Capabilities reveladas:** seleção de tipo de tarefa, fluxo de perguntas estruturadas, refinamento contextual por IA, montagem de prompt nos bastidores, redirect via URL parametrizada, experiência mobile-first, compartilhamento por link direto.

---

### Jornada 2: Dr. Rafael — "O Atalho que Faltava" (Usuário de IA Frustrado)

**Cena inicial:** Rafael está no coworking, com 3 abas abertas: ChatGPT, Google ("prompt petição trabalhista"), e um caso de rescisão indireta que precisa entregar amanhã. Já tentou 4 prompts diferentes, nenhum gerou algo aproveitável.

**Ação crescente:** Vê um post do Jusbrasil sobre o Start Kit. Abre, escolhe [Petição Inicial] → [Trabalhista] → [Rescisão Indireta]. O fluxo faz perguntas que ele não teria pensado em colocar no prompt: "Qual a conduta do empregador que motiva a rescisão?", "Há provas documentais?", "O empregado ainda está trabalhando ou já saiu?".

**Clímax — A Revelação:** O preview mostra um pedido estruturado que cobre fundamentos jurídicos que Rafael não dominava (art. 483 da CLT, alíneas específicas). Nesse momento, Rafael entende: **o problema nunca foi a ferramenta — era o pedido**. Ele estava lutando contra o ChatGPT quando deveria ter formulado melhor a pergunta. O Start Kit fez em 3 minutos o que ele tentava há horas — não porque é mais inteligente, mas porque faz as perguntas certas. Essa revelação muda sua relação com IA: de "ferramenta que não funciona" para "ferramenta que precisa do input certo".

**Resolução:** Redirect para o Jus IA. Resultado sai melhor do que qualquer tentativa anterior. Rafael para de iterar. Quando um colega reclama que "IA não funciona pra direito", Rafael responde: "O problema não é a IA, é como você pede. Usa esse link." — tornando-se evangelista orgânico do produto.

**Capabilities reveladas:** fluxos especializados por subtipo jurídico, perguntas que educam implicitamente (o advogado aprende sem perceber), fundamentação jurídica embutida no prompt gerado.

---

### Jornada 3: Dra. Carla — "O Prompt Grande Demais" (Edge Case Técnico)

**Cena inicial:** Carla volta ao Start Kit para um caso trabalhista complexo: rescisão indireta com acúmulo de função, horas extras, dano moral e assédio. Múltiplos pedidos, muitos fatos.

**Ação crescente:** Seleciona [Petição Inicial] → [Trabalhista] → [Rescisão Indireta]. O fluxo coleta informações normalmente, mas o caso tem muitas nuances: 4 condutas do empregador, 3 testemunhas, histórico detalhado de assédio. Carla responde tudo diligentemente.

**Momento de falha:** O sistema monta o prompt nos bastidores, mas o resultado excede o limite de ~2000 caracteres da URL parametrizada. O botão "Gerar no Jus IA →" não pode simplesmente abrir uma URL truncada — o pedido ficaria incompleto.

**Recuperação:** O sistema detecta o overflow antes do redirect e oferece alternativa: exibe o pedido montado em uma tela de cópia com botão "Copiar pedido" + link direto para o Jus IA. Carla cola manualmente. Experiência levemente pior (2 cliques em vez de 1), mas o pedido chega completo.

**Resolução:** O resultado no Jus IA sai bom porque o pedido estava bem formulado, mesmo com o passo extra. Carla nem percebe que houve um fallback técnico — para ela, foi só "copiar e colar".

**Capabilities reveladas:** detecção de overflow de URL, fallback de copy-paste com link direto, preservação da qualidade do pedido independente do método de entrega, graceful degradation.

---

### Jornada 4: Dr. Marcos — "Padronizando a Equipe" (Secundário)

**Cena inicial:** Marcos descobre que dois advogados juniores da equipe estão usando ChatGPT para rascunhar petições sem supervisão. Um deles citou jurisprudência que não existe. Marcos precisa resolver Shadow AI.

**Ação crescente:** Encontra o Start Kit via colega. Testa com um caso cível de cobrança. Gosta que o fluxo guiado não permite "inventar" — as perguntas estruturadas forçam os dados corretos e o redirect vai para o Jus IA (base verificada, não ChatGPT).

**Clímax — Governança por deep link:** Marcos percebe que pode mandar links específicos por área: link do fluxo trabalhista para a júnior de trabalhista, link do fluxo cível para o júnior de cível. Cada advogado recebe exatamente o fluxo da sua especialidade. Sem admin panel, sem configuração — o deep link É a ferramenta de governança.

**Resolução:** Marcos manda os links no grupo de WhatsApp do escritório: "A partir de agora, usem esses links para montar petições. Sem mais ChatGPT direto." A equipe adota. Marcos não precisa supervisionar cada prompt. Quando os 10 fluxos não bastarem, Marcos considera assinar o Jus IA completo para o escritório.

**Capabilities reveladas:** deep links por fluxo/área como ferramenta de governança, compartilhamento por WhatsApp como canal de distribuição B2B informal, produto funciona como padronização leve de IA sem admin panel.

## Domain-Specific Requirements

Legaltech é classificado como high complexity (ética OAB, retenção de dados, sigilo advocatício, integração com tribunais). **Nenhum se aplica ao Start Kit** — ética e disclaimers são responsabilidade do Jus IA; dados do caso transitam pelo backend apenas para refinamento por IA e são descartados após redirect; não há integração com tribunais.

**Constraint residual:** templates de prompt por área do direito requerem expertise jurídica para construção (domainKnowledge = high). Impacta custo de criação de novos fluxos, não a arquitetura.

## Web App Specific Requirements

### Project-Type Overview

MPA (Multi Page Application) mobile-first. Cada etapa do fluxo é uma página própria — simples, sem JavaScript pesado, compatível com qualquer dispositivo. Distribuição por links diretos (WhatsApp, posts Jusbrasil), sem dependência de SEO.

### Technical Architecture Considerations

| Aspecto | Decisão |
|---------|---------|
| **Tipo** | MPA (Multi Page Application) |
| **Abordagem** | Mobile-first, responsivo para desktop |
| **Browsers** | Evergreen (Chrome, Safari, Firefox, Edge). Sem suporte IE/legacy |
| **SEO** | Não é prioridade — OG tags para preview no WhatsApp |
| **Real-time** | Request-response com loading state. Refinamento por IA tem latência — indicador visual de progresso |
| **Acessibilidade** | Não é prioridade no MVP |
| **Offline** | Não necessário — produto requer conexão para refinamento por IA e redirect |

### Responsive Design

- **Mobile-first**: layout projetado para telas pequenas primeiro, adaptado para desktop
- **Touch-friendly**: botões e seleções dimensionados para toque (min 44px)
- **WhatsApp preview**: OG tags configuradas para preview legível quando link é compartilhado

### Implementation Considerations

- **Stateless**: sem sessão server-side, sem cookies de autenticação, sem banco de dados de usuário. Dados transitam apenas durante o fluxo e são descartados após redirect
- **Deep links**: cada fluxo tem URL própria (ex: `/trabalhista/horas-extras`) para compartilhamento direto
- **Analytics**: client-side tracking (funil, drop-off, origem) — único estado persistente do produto
- **LLM backend**: endpoint para refinamento contextual — única dependência de infraestrutura além do hosting

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — validar se fluxos guiados convertem advogados em usuários ativos do Jus IA. Menor investimento possível para testar a hipótese central.

**Resource Requirements:** Equipe enxuta operando separado do Jusbrasil. Frontend (MPA), backend (LLM endpoint), expertise jurídica (templates de prompt).

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Jornada 1 (Carla — happy path): fluxo completo trabalhista
- Jornada 2 (Rafael — frustrado): fluxos especializados por subtipo
- Jornada 3 (Carla — edge case): overflow de URL com fallback
- Jornada 4 (Marcos — escritório): deep links por área

**Must-Have Capabilities:**

| # | Capability | Justificativa |
|---|-----------|--------------|
| 1 | Seleção de tipo de tarefa | Entrada do fluxo — sem isso não há produto |
| 2 | 10 fluxos de perguntas estruturadas por subtipo | Core do produto — parte determinística |
| 3 | Refinamento contextual por IA | Core do produto — parte não-determinística |
| 4 | Montagem de prompt nos bastidores | Sem isso não há valor — o advogado veria um prompt |
| 5 | Redirect via URL parametrizada | Mecanismo de entrega ao Jus IA |
| 6 | Detecção de overflow + fallback copy-paste | Sem isso, casos complexos quebram |
| 7 | Preview do pedido antes do redirect | Confiança e transparência |
| 8 | Deep links por fluxo/área | Distribuição (WhatsApp) + governança (Marcos) |
| 9 | OG tags para WhatsApp preview | Viralidade — >30% tráfego referral |
| 10 | Analytics de funil + tracking de origem | Medir Go/No-Go (>500 redirects + >40% conclusão) |
| 11 | Mobile-first responsivo | 38% autônomos, celular entre audiências |

**Explicitamente fora do MVP:**
- Login / contas de usuário
- Histórico de pedidos
- Edição do prompt gerado
- Integração bidirecional com Jus IA
- Áreas além das 10 definidas
- A/B testing de prompts
- Dashboard para escritórios

### Post-MVP Features

**Phase 2 (Growth):**
- Expansão para mais áreas do direito (penal, tributário, família, empresarial)
- A/B testing de templates de prompt
- Sugestão inteligente de fluxo
- Histórico de pedidos (com login opcional)

**Phase 3 (Expansion):**
- Comunidade de templates validados por advogados
- Integração bidirecional com Jus IA (feedback de qualidade)

### Risk Mitigation Strategy

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| **URL excede 2000 chars** | Prompt truncado, experiência quebra | Fallback copy-paste detectado antes do redirect |
| **Qualidade do prompt gerado** | Resultado ruim no Jus IA, <70% sem reformulação | Templates construídos com expertise jurídica + iteração |
| **Custo de inferência LLM** | Produto gratuito mas backend custa | Monitorar custo/redirect, definir budget máximo |
| **Baixa adoção** | Não atinge critérios Go/No-Go → corta | Sem investimento pesado antes de validar |
| **Limite de 10 fluxos** | Usuários pedem áreas não cobertas | Fallback "tipo não disponível" + priorização por demanda real |

## Functional Requirements

### Task Selection & Navigation

- **FR1:** Advogado pode selecionar o tipo de tarefa jurídica (petição inicial, contestação, pesquisa de jurisprudência, parecer, contrato)
- **FR2:** Advogado pode selecionar a área do direito (trabalhista, cível)
- **FR3:** Advogado pode selecionar o subtipo específico dentro da área (ex: horas extras, rescisão indireta, dano moral dentro de trabalhista)
- **FR4:** Advogado pode acessar um fluxo específico diretamente via deep link (ex: `/trabalhista/horas-extras`)
- **FR5:** Advogado pode voltar à seleção anterior durante a navegação do fluxo

### Guided Flow (Deterministic)

- **FR6:** Sistema apresenta perguntas estruturadas específicas para cada subtipo jurídico
- **FR7:** Sistema adapta as perguntas seguintes com base nas respostas anteriores (interatividade condicional)
- **FR8:** Advogado pode responder perguntas via seleção (múltipla escolha, sim/não) e campos de texto
- **FR9:** Sistema valida respostas obrigatórias antes de avançar no fluxo
- **FR10:** Sistema suporta 10 fluxos de tarefas jurídicas no MVP

### AI Contextual Refinement (Non-Deterministic)

- **FR11:** Sistema envia respostas coletadas ao LLM para refinamento contextual
- **FR12:** Sistema apresenta perguntas adicionais geradas pela IA para capturar nuances do caso
- **FR13:** Sistema exibe indicador visual de loading durante chamadas ao LLM
- **FR14:** Advogado pode responder às perguntas de refinamento da IA

### Prompt Assembly & Delivery

- **FR15:** Sistema monta o prompt otimizado nos bastidores a partir das respostas coletadas
- **FR16:** Sistema embute fundamentação jurídica relevante no prompt gerado (artigos de lei, súmulas)
- **FR17:** Advogado pode visualizar preview do pedido montado antes do redirect
- **FR18:** Sistema gera URL parametrizada para o Jus IA (`ia.jusbrasil.com.br/conversa?q=...&send`)
- **FR19:** Advogado pode ser redirecionado ao Jus IA com o pedido pronto via botão "Gerar no Jus IA →"

### URL Overflow Handling

- **FR20:** Sistema detecta quando o prompt montado excede o limite de caracteres da URL
- **FR21:** Sistema apresenta fallback de copy-paste quando URL excede o limite (botão "Copiar pedido" + link direto para Jus IA)
- **FR22:** Sistema preserva a qualidade completa do pedido independente do método de entrega

### Sharing & Distribution

- **FR23:** Sistema configura OG tags para preview legível quando links são compartilhados no WhatsApp
- **FR24:** Cada fluxo possui URL própria compartilhável (deep links por área/subtipo)

### Analytics & Tracking

- **FR25:** Sistema rastreia o funil completo: visitante → início de fluxo → conclusão → redirect
- **FR26:** Sistema identifica em qual pergunta do fluxo o usuário abandona (drop-off por step)
- **FR27:** Sistema rastreia quais fluxos são mais utilizados
- **FR28:** Sistema rastreia a origem do tráfego (orgânico, pago, referral/WhatsApp)
- **FR29:** Sistema contabiliza o total de redirects concluídos (North Star metric)

### Edge Cases & Fallbacks

- **FR30:** Sistema exibe mensagem informando que o tipo de tarefa não está disponível, com sugestão dos fluxos disponíveis
- **FR31:** Sistema oferece alternativa quando o subtipo desejado não existe nos 10 fluxos do MVP

## Non-Functional Requirements

### Performance

- **NFR1:** Páginas do fluxo (MPA) carregam em <5s em 3G e <2s em 4G como guideline (não blocker para launch)
- **NFR2:** Refinamento contextual por IA exibe loading state durante toda a latência da chamada LLM
- **NFR3:** Transições entre perguntas determinísticas são page loads normais sem delay perceptível além do carregamento da página

### Security

- **NFR4:** Dados inseridos pelo advogado durante o fluxo não são persistidos em nenhum storage após o redirect
- **NFR5:** Chamadas ao LLM backend não logam o conteúdo das respostas do advogado
- **NFR6:** Não há autenticação, cookies de sessão ou tracking de identidade do usuário

### Integration

- **NFR7:** URL parametrizada para o Jus IA respeita o formato `ia.jusbrasil.com.br/conversa?q=...&send`
- **NFR8:** Sistema valida limite de caracteres da URL antes de tentar o redirect
- **NFR9:** Fallback copy-paste mantém formatação do prompt idêntica ao que seria enviado via URL

### Compatibility

- **NFR10:** Produto funciona em Chrome, Safari, Firefox e Edge (versões evergreen)
- **NFR11:** Layout é mobile-first com breakpoints responsivos para desktop
- **NFR12:** OG tags renderizam preview correto no WhatsApp (título, descrição, imagem)
