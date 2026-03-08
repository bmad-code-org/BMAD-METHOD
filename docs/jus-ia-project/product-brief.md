---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - brainstorm.md
  - research.md
  - 01-prompt-library.md
  - 02-calculadora-juridica.md
  - 03-dashboard-produtividade.md
  - 04-comunidade-prompts.md
date: 2026-03-08
author: Gabriel Vaz
---

# Product Brief: Jus IA Start Kit

## Executive Summary

O Jus IA Start Kit é um assistente conversacional gratuito que guia advogados na construção de pedidos otimizados para o Jus IA, sem exigir qualquer conhecimento de prompt engineering. Através de fluxos híbridos — parte determinísticos (perguntas estruturadas, seleções), parte assistidos por IA (refinamento contextual) — o produto abstrai completamente a complexidade técnica e entrega o advogado diretamente no Jus IA com uma URL parametrizada pronta para gerar resultados de alta qualidade na primeira tentativa.

O produto funciona como canal de aquisição gratuito para o Jus IA, convertendo advogados que hoje subutilizam IA (ou nem usam) em usuários satisfeitos do ecossistema Jusbrasil.

---

## Core Vision

### Problem Statement

Advogados brasileiros não sabem formular bons pedidos para ferramentas de IA. 79% nunca se capacitaram, e mesmo os 65,9% que já adotaram IA gastam múltiplos ciclos de iteração para chegar a um resultado aceitável. O gap entre "ter acesso à ferramenta" e "extrair valor real" é enorme — e é a principal causa de frustração, abandono e subutilização de assinaturas pagas como o Jus IA (R$138,90/mês).

### Problem Impact

- **Produtividade desperdiçada**: advogados gastam tempo iterando com a IA em vez de economizar tempo. O ganho prometido (~53% citam "ganho de tempo" como motivo de adoção) não se materializa plenamente.
- **Barreira de adoção**: "Facilidade de uso" é o 2º fator que converteria não-adotantes e cresceu +4,2pp. "Comprovação de confiabilidade" é o 1º (24,6%). Ambos são diretamente endereçados por pedidos bem construídos.
- **Churn silencioso**: 60,1% pagam por alguma ferramenta de IA, mas sem resultados consistentes, a renovação fica em risco. A concentração no nível 3 de confiança (~45%) indica uso "com reservas".
- **Shadow AI**: 44% dos escritórios não têm política formal de IA. Advogados usam ChatGPT genérico sem governança, com riscos de sigilo e alucinação (17-34% de taxa de erro segundo Stanford).

### Why Existing Solutions Fall Short

- **Bibliotecas estáticas de prompts** (ADVBOX, Aurum, ITS Rio) são copy-paste para IAs genéricas — o advogado ainda precisa saber adaptar.
- **Jus IA Academy** tem curadoria interna mas não guia o advogado na construção — assume que ele já sabe o que pedir.
- **Nenhum concorrente** conecta prompts a uma base jurídica verificada de 90M+ decisões.
- **Nenhum produto** oferece um fluxo guiado que abstrai completamente o conceito de prompt engineering para advogados.
- **IAs generalistas** (ChatGPT, Gemini) exigem habilidade técnica que advogados não têm e produzem resultados inconsistentes no direito brasileiro.

### Proposed Solution

Jus IA Start Kit: um assistente web conversacional que funciona como "tradutor de intenção jurídica". O advogado interage com fluxos guiados — responde perguntas sobre seu caso, seleciona opções, fornece contexto — e o sistema constrói por trás um pedido otimizado para o Jus IA.

**Mecânica central:**

1. Advogado escolhe o tipo de tarefa (petição, pesquisa, contrato, etc.)
2. Fluxo híbrido se inicia: perguntas estruturadas (determinísticas) + refinamento por IA (não-determinístico) coletam os dados do caso
3. Sistema monta o prompt ideal nos bastidores
4. Advogado é redirecionado ao Jus IA via URL parametrizada (`ia.jusbrasil.com.br/conversa?q=...&send`) com o pedido pronto
5. Jus IA gera resultado de alta qualidade na primeira tentativa

**O advogado nunca vê um "prompt"** — ele vê um formulário inteligente que fala sua língua jurídica.

### Key Differentiators

1. **Zero prompt engineering**: abstrai completamente a complexidade técnica. O advogado responde perguntas sobre seu caso, não sobre como falar com IA.
2. **Fluxo híbrido (determinístico + IA)**: não é um chatbot genérico nem um formulário rígido — é uma experiência guiada que se adapta ao contexto.
3. **Integração nativa com Jus IA**: URL parametrizada já existe, conectando diretamente à base de 90M+ decisões verificadas do Jusbrasil.
4. **Canal de aquisição gratuito**: remove a barreira de custo e demonstra valor do Jus IA antes do usuário pagar, funcionando como funil de conversão.
5. **Linguagem jurídica nativa**: fluxos construídos por área do direito brasileiro (civil, trabalhista, penal, família, empresarial), não traduzidos de contextos anglo-saxões.
6. **Resultado na primeira tentativa**: elimina o ciclo frustrante de iteração que é a principal reclamação dos advogados com IA.

### Party Mode Insights (Riscos e Oportunidades)

- **Nome**: Definido como "Jus IA Start Kit" — resolve o problema de "prompt" no nome e posiciona como kit de entrada para o ecossistema Jus IA
- **Limite de URL**: URLs têm limite prático de ~2000 caracteres; validar limite real do Jus IA e alternativas (POST endpoint, deep link)
- **Custo de IA**: o fluxo híbrido requer LLM no backend para refinamento contextual — quem absorve o custo de inferência se o produto é gratuito?
- **MVP com IA**: decisão tomada de incluir refinamento contextual por IA já no MVP (não adiar para v2)
- **Mobile-first**: 38% dos advogados são autônomos, provavelmente usando celular entre audiências
- **Framing estratégico**: para não-adotantes resistentes (34,1%), o produto não deve parecer "IA" — deve parecer "ferramenta jurídica"

## Target Users

### Primary Users

#### Persona 1: Dra. Carla — "A Resistente Pragmática"

- **Perfil**: Advogada autônoma, 42 anos, trabalhista, 12 anos de experiência
- **Escritório**: Solo, com uma secretária. Atende ~30 clientes ativos
- **Relação com IA**: Nunca usou. Ouviu falar do ChatGPT, viu colegas usando, mas "prefere métodos tradicionais". Tem medo de alucinação e não confia em resultado que não pode verificar
- **Dor real**: Gasta 2-3h por petição inicial trabalhista. Sabe que colegas fazem em 40 minutos com IA, mas não sabe por onde começar e não tem tempo para aprender
- **O que a converteria**: "Comprovação de confiabilidade" (24,6%) + "Facilidade de uso" (+4,2pp). Precisa ver resultado concreto sem investir tempo aprendendo
- **Frase típica**: "Não tenho tempo para ficar testando ferramenta. Se funcionar de primeira, eu uso."
- **Momento de entrada no Jus IA Start Kit**: Colega manda link pelo WhatsApp: "usa isso aqui pra montar petição, é muito fácil". Carla abre no celular
- **Sucesso**: Faz em 40 minutos o que levava 2-3 horas. Assina o Jus IA no mês seguinte

#### Persona 2: Dr. Rafael — "O Sobrecarregado Digital"

- **Perfil**: Advogado autônomo, 29 anos, trabalhista, 3 anos de experiência
- **Escritório**: Solo, trabalha de coworking jurídico. Atende ~20 clientes
- **Relação com IA**: Usa ChatGPT diariamente, já tentou Jus IA (plano introdutório R$9,90). Gasta mais tempo reescrevendo prompts do que redigindo. Copia prompts do Google que nunca funcionam direito
- **Dor real**: Sabe que IA pode ajudar, mas os resultados são inconsistentes. Itera 3-5 vezes por petição. Não sabe se o problema é a ferramenta ou o pedido dele
- **O que o converteria**: Resultado consistente na primeira tentativa. Precisa de um atalho que elimine a tentativa-e-erro
- **Frase típica**: "Eu já uso IA, mas parece que eu não sei pedir direito. Sempre tenho que refazer."
- **Momento de entrada no Jus IA Start Kit**: Descobre via anúncio ou post do Jusbrasil. Testa com um caso real de horas extras
- **Sucesso**: Para de iterar. Usa Jus IA Start Kit como ponto de partida para todo caso trabalhista. Converte para plano completo do Jus IA

### Secondary Users

#### Persona 3: Dr. Marcos — "O Dono de Escritório"

- **Perfil**: Sócio de escritório com 4 advogados, 50 anos, cível e trabalhista
- **Relação com IA**: Ele não usa, mas sabe que a equipe usa ChatGPT "por fora" (Shadow AI). Preocupado com sigilo e consistência
- **Interesse no Jus IA Start Kit**: Quer padronizar o uso de IA na equipe. Se o Jus IA Start Kit canaliza todos para o Jus IA (com base verificada), resolve o problema de Shadow AI e garante qualidade consistente
- **Frase típica**: "Preciso de algo que minha equipe possa usar sem eu ter que ficar supervisionando cada prompt."

### User Journey (Dra. Carla — fluxo trabalhista)

1. **Descoberta**: Colega manda link pelo WhatsApp: "usa isso aqui pra montar petição, é muito fácil". Carla abre no celular
2. **Primeira tela**: "O que você precisa?" → toca [Petição Inicial]
3. **Área**: → [Trabalhista] (pré-selecionado se veio por link específico)
4. **Tipo**: → [Horas Extras]
5. **Perguntas guiadas** (determinísticas):
   - Empregador PJ ou PF? → [PJ]
   - Regime de trabalho? → [CLT]
   - Jornada contratual? → [44h semanais]
   - Horas extras estimadas/semana? → [10h]
   - Período do contrato? → [Jan 2023 – Dez 2025]
6. **Refinamento IA** (não-determinístico):
   - "Há registro de ponto ou o empregador não controlava?"
   - "Existem testemunhas?"
   - "Houve pagamento parcial de horas extras?"
7. **Preview**: "Pronto! Montei seu pedido otimizado para o Jus IA. Ele vai gerar uma petição inicial de horas extras com fundamentação no art. 59 da CLT e Súmula 85 do TST."
8. **Redirect**: Botão "Gerar no Jus IA →" → abre URL parametrizada
9. **Momento aha**: Petição sai completa, com fundamentação, na primeira tentativa. Carla pensa: "Por que eu não fiz isso antes?"
10. **Fim**: Carla está no Jus IA com resultado de qualidade

## Success Metrics

### North Star Metric

**Redirects concluídos**: número de usuários que completam o fluxo e são enviados ao Jus IA via URL parametrizada com o pedido montado.

- **Meta**: 1.000 redirects no primeiro mês

### User Success Metrics

| Métrica | O que mede | Meta |
|---------|-----------|------|
| Taxa de conclusão de fluxo | % de usuários que iniciam e completam até o redirect | >60% |
| Tempo médio do fluxo | Minutos do início ao redirect | <5 min |
| Qualidade do resultado no Jus IA | % de usuários que não precisam reformular após o redirect | >70% |

### Business Objectives

| Métrica | O que mede | Meta (mês 1) |
|---------|-----------|:---:|
| Redirects concluídos | Fluxos completos → Jus IA | 1.000 |
| Visitantes únicos | Alcance do produto | 3.000-5.000 |
| Taxa de conversão visitante → redirect | Eficácia do funil | >20% |
| Conversão redirect → assinante Jus IA | Impacto no negócio | A definir com Jusbrasil |

### Key Performance Indicators

**Funil principal (fluxo linear, sem loop):**

```
Visitante → Inicia fluxo → Completa perguntas → Redirect → Jus IA
   100%    →     70%      →       50%          →   35%    → 35%
```

**Indicadores de saúde do produto:**

- **Drop-off por step**: em qual pergunta do fluxo o usuário abandona
- **Fluxos mais usados**: quais tipos de petição/tarefa têm mais demanda (validação de prioridade para expansão além do trabalhista)
- **Origem do tráfego**: orgânico vs. pago vs. referral (entender canal de aquisição mais eficiente)

**O que NÃO medimos (fora do escopo):**

- Retenção / retorno do usuário (não é objetivo do produto)
- Engajamento recorrente (fluxo é one-shot por design)
- NPS ou satisfação (métrica de vaidade nesta fase)

## MVP Scope

### Core Features

**1. Fluxo Híbrido Completo (Determinístico + IA)**
- Perguntas estruturadas (seleções, múltipla escolha) para coletar dados do caso
- Refinamento contextual por IA para capturar nuances que formulários rígidos perdem
- O advogado nunca vê um "prompt" — interage com perguntas na linguagem jurídica

**2. 10 Fluxos de Tarefas Jurídicas**
- Petição Inicial Trabalhista (horas extras, rescisão indireta, dano moral)
- Petição Inicial Cível (cobrança, indenização, obrigação de fazer)
- Contestação (trabalhista e cível)
- Pesquisa de Jurisprudência
- Parecer Jurídico
- Contrato (revisão/análise)

> Priorização exata dos 10 fluxos será definida no PRD com base em volume de demanda e complexidade de implementação.

**3. Redirect via URL Parametrizada**
- Montagem automática do pedido otimizado nos bastidores
- Botão "Gerar no Jus IA →" que abre `ia.jusbrasil.com.br/conversa?q=...&send`
- Validação do limite de ~2000 caracteres de URL (fallback se necessário)

**4. Experiência Zero Fricção**
- Sem login, sem cadastro, sem barreira de entrada
- Mobile-first (38% dos advogados são autônomos, usam celular entre audiências)
- Domínio independente (ex: jusprompt.com.br ou similar)
- Compartilhável por WhatsApp (link direto para fluxo específico)

**5. Analytics Básico**
- Tracking do funil: visitante → início de fluxo → conclusão → redirect
- Drop-off por step (em qual pergunta o usuário abandona)
- Fluxos mais usados (validação de prioridade para expansão)
- Origem do tráfego (orgânico vs. referral)

### Out of Scope for MVP

- **Contas de usuário / login**: fluxo é anônimo e one-shot
- **Histórico de pedidos**: não salva sessões anteriores
- **Edição do prompt gerado**: advogado não vê nem edita o prompt — confia no fluxo
- **Integração bidirecional com Jus IA**: só redirect unidirecional (não recebe dados de volta)
- **Áreas além das 10 definidas**: penal, tributário, administrativo etc. ficam para v2
- **Multilíngua**: apenas português brasileiro
- **App nativo**: web responsiva, sem apps iOS/Android
- **A/B testing de prompts**: otimização de templates fica para v2
- **Dashboard para escritórios** (Dr. Marcos): gestão de equipe fica para v2

### MVP Success Criteria

| Gate | Critério | Meta |
|------|----------|------|
| **Adoção** | Redirects concluídos no mês 1 | 1.000 |
| **Eficácia do fluxo** | Taxa de conclusão (início → redirect) | >60% |
| **Qualidade** | Usuários que não reformulam no Jus IA | >70% |
| **Velocidade** | Tempo médio do fluxo | <5 min |
| **Viralidade** | % de tráfego por referral/WhatsApp | >30% |

**Go/No-Go para v2**: Se atingir >500 redirects/mês E taxa de conclusão >40%, validamos a abordagem e expandimos.

### Future Vision

**v2 — Expansão e Inteligência**
- Mais áreas do direito (penal, tributário, família, empresarial, administrativo)
- Otimização de templates por A/B testing (qual formulação gera melhor resultado no Jus IA)
- Histórico de pedidos (com login opcional)
- Sugestão inteligente de fluxo ("baseado no que você descreveu, recomendo...")

**v3 — Plataforma e Ecossistema**
- Dashboard para escritórios (Dr. Marcos): gestão de uso da equipe, padronização
- API para integração em sistemas jurídicos (PJe, Themis, etc.)
- Comunidade de templates validados por advogados
- Integração bidirecional com Jus IA (receber feedback de qualidade do resultado)

**Visão de longo prazo**: Jus IA Start Kit se torna o "ponto de entrada padrão" para qualquer advogado brasileiro usar IA jurídica — o Google do Jus IA.
