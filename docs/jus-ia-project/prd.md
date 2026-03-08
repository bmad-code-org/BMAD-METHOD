---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success]
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
