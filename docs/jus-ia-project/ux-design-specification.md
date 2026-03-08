---
stepsCompleted: [1, 2]
inputDocuments:
  - prd.md
  - product-brief.md
  - research.md
  - brainstorm.md
  - prd-validation-report.md
date: 2026-03-08
---

# UX Design Specification - Jus IA Start Kit

**Author:** Gabriel Vaz
**Date:** 2026-03-08

---

## Executive Summary

### Project Vision

O Jus IA Start Kit é um assistente web que funciona como "tradutor de intenção jurídica": o advogado responde perguntas sobre seu caso em linguagem jurídica e é redirecionado ao Jus IA com um pedido otimizado pronto para gerar resultado de alta qualidade na primeira tentativa. A experiência abstrai completamente o conceito de prompt engineering — o advogado nunca vê um prompt, nunca edita código, nunca precisa saber como falar com IA.

A mecânica central é um fluxo híbrido: perguntas estruturadas (determinísticas) coletam dados do caso, seguidas de refinamento contextual por IA (não-determinístico) que captura nuances. O resultado é montado nos bastidores e entregue ao Jus IA via URL parametrizada ou fallback copy-paste.

### Target Users

**Dra. Carla — A Resistente Pragmática** (primária): Advogada autônoma, 42 anos, trabalhista. Nunca usou IA, gasta 2-3h por petição. Precisa de resultado comprovável na primeira tentativa, sem investir tempo aprendendo. Abre o Start Kit no celular entre audiências, via link de WhatsApp.

**Dr. Rafael — O Sobrecarregado Digital** (primário): Advogado autônomo, 29 anos, usa ChatGPT diariamente mas itera 3-5 vezes por petição. Sabe que IA pode ajudar mas não sabe formular o pedido certo. Precisa de um atalho que elimine o ciclo de tentativa-e-erro.

**Dr. Marcos — O Dono de Escritório** (secundário): Sócio, 50 anos, equipe usa ChatGPT sem governança (Shadow AI). Precisa padronizar o uso de IA na equipe sem supervisionar cada pedido. Deep links por área funcionam como ferramenta de governança.

### Key Design Challenges

1. **Dois perfis opostos de confiança**: a mesma interface precisa transmitir segurança e credibilidade para quem nunca usou IA (Carla) e eficiência/velocidade para quem já usa diariamente (Rafael).
2. **Abstração total do prompt engineering**: linguagem 100% jurídica, zero vocabulário técnico de IA. O produto deve parecer "ferramenta jurídica", não "ferramenta de IA".
3. **Mobile-first entre audiências**: fluxo completável em <5 min com uma mão, em tela pequena, com conexão potencialmente instável.
4. **Continuidade em MPA**: cada etapa é um page load — o progresso precisa ser visualmente claro e a experiência fluida, sem sensação de formulário burocrático.

### Design Opportunities

1. **"Momento aha" no preview**: a tela que mostra o pedido montado com fundamentação jurídica específica é o ponto de materialização do valor — oportunidade de criar confiança, surprise-and-delight, e conversão.
2. **Educação implícita via perguntas**: o fluxo ensina o advogado o que é relevante para um bom pedido sem que ele perceba que está aprendendo — o UX pode amplificar esse efeito.
3. **WhatsApp como experiência de entrada**: OG tags, deep links por área, experiência de "abrir link e já estar no fluxo certo" — a primeira impressão é no mobile via WhatsApp.

---

## Core Experience Definition

### Core User Action

O advogado responde perguntas sobre seu caso e recebe um pedido otimizado pronto para o Jus IA. Do ponto de vista emocional, existem apenas **dois momentos**: "estou respondendo perguntas sobre meu caso" e "recebi meu pedido pronto". Tudo entre eles deve ser invisível.

### Experience Principles

1. **Transição IA invisível**: Perguntas geradas por IA devem ser indistinguíveis das perguntas estruturadas. Quando possível, perguntas da IA devem oferecer opções pré-definidas (seleção), não campos de texto abertos. Quando texto livre for necessário, usar placeholders específicos e contextuais (ex: "Ex: não pagava horas extras e exigia trabalho aos sábados") — nunca campos genéricos vazios. O advogado não deve perceber que mudou de fase determinística para não-determinística.

2. **Velocidade é respeito — quantificada**: O fluxo inteiro (primeiro toque → botão "Gerar no Jus IA") deve ter **no máximo 4-5 telas de perguntas**. Se o advogado conta mais de 5 etapas no indicador de progresso, já parece longo. Perguntas devem ser agrupadas agressivamente por "momento mental" — na mesma tela, perguntas que pertencem ao mesmo contexto decisório (ex: "Regime de Trabalho" + jornada contratual se CLT). Perguntas de momentos mentais diferentes (ex: "Há registro de ponto?" vs "Existem testemunhas?") vão em telas separadas.

3. **Um momento mental por tela**: Cada tela tem uma decisão principal, com sub-perguntas relacionadas agrupadas abaixo. Isso reduz page loads em MPA (de 8-11 para 4-5) mantendo clareza cognitiva. Progressive enhancement com JavaScript para transições sem reload quando disponível.

4. **Preview = fundamentação jurídica como contrato de confiança**: O valor do preview não é mostrar o prompt — é mostrar **artigos, súmulas e jurisprudência** que o advogado reconhece. Quando Dra. Carla vê "art. 59 da CLT, Súmula 85 do TST", pensa: "isso eu conheço, isso é real". A fundamentação jurídica visível é o momento de conversão — a linguagem dela validando a máquina.

5. **Linguagem 100% jurídica**: Zero vocabulário técnico de IA. O produto parece "ferramenta jurídica", não "ferramenta de IA".

### Critical Success Moments

1. **Primeira pergunta (<3 segundos)**: O advogado abre o link (WhatsApp, deep link) e em menos de 3 segundos está respondendo a primeira pergunta relevante sobre seu caso. Sem onboarding, sem cadastro, sem explicação.

2. **Preview com fundamentação jurídica**: A tela que mostra o pedido montado com artigos específicos da CLT e súmulas do TST. Este é o momento de materialização do valor — "a máquina sabe o que é relevante pro meu caso".

3. **Redirecionamento ao Jus IA**: O clique final que leva ao Jus IA com tudo pronto. O resultado gerado na primeira tentativa valida toda a experiência anterior.

4. **Momento de recuperação**: Quando o advogado erra uma resposta ou quer voltar. O botão de voltar deve ser visível e óbvio. O browser back deve funcionar perfeitamente em MPA. Voltar **nunca** pode perder respostas já dadas nas telas seguintes. Confiança quebra quando o advogado sente que perdeu trabalho.

### Effortless Interactions

- **Toque único por decisão**: Cada pergunta deve ser respondível com um toque (seleção, toggle, chip). Texto livre é exceção, não regra.
- **Agrupamento por momento mental**: 2-3 perguntas relacionadas por tela, máximo 4-5 telas no fluxo completo.
- **Placeholders contextuais**: Quando texto livre for necessário, exemplos específicos guiam a resposta (ex: "Ex: demissão sem justa causa em 15/01/2026").
- **Progresso visual claro**: Indicador de progresso mostra 4-5 etapas — nunca mais que isso.
