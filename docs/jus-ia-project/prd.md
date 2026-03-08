---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain]
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

## Project Classification

| Dimensão | Classificação |
|----------|--------------|
| **Tipo de Projeto** | Web App |
| **Domínio** | Legaltech |
| **Complexidade** | Medium — arquitetura stateless, sem persistência de dados, sem integração com tribunais |
| **Conhecimento de Domínio** | High — fluxos jurídicos por área do direito brasileiro requerem expertise específica |
| **Contexto** | Greenfield — produto novo, sem legado |

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

### Measurable Outcomes

**Go/No-Go para v2:** Se atingir >500 redirects/mês E taxa de conclusão >40%, validamos a abordagem e expandimos. Abaixo disso, corta.

**O que NÃO medimos no MVP:**
- Retenção / retorno do usuário (one-shot by design)
- Conversão redirect → assinante Jus IA (fora do escopo)
- NPS ou satisfação (métrica de vaidade nesta fase)

## Product Scope

### MVP - Minimum Viable Product

1. **Fluxo híbrido completo** — perguntas estruturadas + refinamento contextual por IA para 10 tipos de tarefa jurídica
2. **Redirect via URL parametrizada** — montagem automática do pedido, botão "Gerar no Jus IA →"
3. **Zero fricção** — sem login, sem cadastro, mobile-first, compartilhável por WhatsApp
4. **Analytics básico** — funil visitante → início → conclusão → redirect, drop-off por step, fluxos mais usados, origem do tráfego

### Growth Features (Post-MVP)

- Expansão para mais áreas do direito (penal, tributário, família, empresarial)
- A/B testing de templates de prompt (qual formulação gera melhor resultado)
- Sugestão inteligente de fluxo ("baseado no que você descreveu, recomendo...")
- Histórico de pedidos (com login opcional)

### Vision (Future)

- Comunidade de templates validados por advogados
- Integração bidirecional com Jus IA (feedback de qualidade)

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

---

### Journey Requirements Summary

| Capability | Jornadas | Prioridade |
|-----------|----------|-----------|
| Seleção de tipo de tarefa (petição, pesquisa, contrato) | 1, 2, 3, 4 | MVP |
| Fluxo de perguntas estruturadas por subtipo jurídico | 1, 2, 3, 4 | MVP |
| Refinamento contextual por IA | 1, 2, 3 | MVP |
| Montagem de prompt e redirect via URL parametrizada | 1, 2, 4 | MVP |
| Preview do pedido antes do redirect | 1, 2, 3 | MVP |
| Detecção de overflow de URL + fallback copy-paste | 3 | MVP |
| Experiência mobile-first | 1, 4 | MVP |
| Deep links por fluxo/área do direito | 1, 4 | MVP |
| Tracking de origem/referral (WhatsApp, orgânico, pago) | 1, 2, 4 | MVP |
| Fundamentação jurídica embutida no prompt | 2 | MVP |

## Domain-Specific Requirements

### Legaltech Domain — Aplicabilidade ao Start Kit

O CSV de domínio classifica legaltech como high complexity com concerns em: ética OAB, regulamentação, retenção de dados, sigilo advocatício e integração com tribunais. **Nenhuma se aplica diretamente ao Start Kit:**

- **Ética OAB / disclaimer de IA**: responsabilidade do Jus IA (destino do redirect), não do Start Kit
- **Dados do caso durante o fluxo**: sem persistência, sem login, uso por conta e risco do advogado. Dados transitam pelo backend apenas para refinamento contextual por IA e são descartados após o redirect
- **Fundamentação jurídica nos prompts**: o Start Kit referencia artigos e súmulas nos templates de prompt, mas a interpretação e validação é do Jus IA com sua base de 90M+ decisões verificadas
- **Integração com tribunais**: inexistente — redirect unidirecional apenas

### Constraint Residual

O único constraint de domínio relevante é que os **templates de prompt por área do direito requerem expertise jurídica específica** para serem construídos corretamente (classificação: domainKnowledge = high). Isso impacta o custo de criação de novos fluxos, não a arquitetura técnica.
