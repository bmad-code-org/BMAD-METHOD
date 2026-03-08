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
