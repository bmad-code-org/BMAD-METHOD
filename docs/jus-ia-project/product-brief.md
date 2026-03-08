---
stepsCompleted: [1, 2]
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

# Product Brief: JusPrompt (nome de trabalho)

> **Nota:** O nome "JusPrompt" é provisório. O Party Mode identificou que "prompt" contradiz a proposta de abstrair o conceito. Nomes candidatos que refletem o resultado (não o mecanismo): JusGuia, JusPeça, Assistente Jus IA. Decisão final pendente.

## Executive Summary

O JusPrompt é um assistente conversacional gratuito que guia advogados na construção de pedidos otimizados para o Jus IA, sem exigir qualquer conhecimento de prompt engineering. Através de fluxos híbridos — parte determinísticos (perguntas estruturadas, seleções), parte assistidos por IA (refinamento contextual) — o produto abstrai completamente a complexidade técnica e entrega o advogado diretamente no Jus IA com uma URL parametrizada pronta para gerar resultados de alta qualidade na primeira tentativa.

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

JusPrompt: um assistente web conversacional que funciona como "tradutor de intenção jurídica". O advogado interage com fluxos guiados — responde perguntas sobre seu caso, seleciona opções, fornece contexto — e o sistema constrói por trás um pedido otimizado para o Jus IA.

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

- **Nome**: "JusPrompt" é contraditório com a proposta — revisar antes do PRD
- **Limite de URL**: URLs têm limite prático de ~2000 caracteres; validar limite real do Jus IA e alternativas (POST endpoint, deep link)
- **Custo de IA**: o fluxo híbrido requer LLM no backend para refinamento contextual — quem absorve o custo de inferência se o produto é gratuito?
- **MVP simplificado**: v1 pode ser apenas fluxo determinístico + templates de prompt, sem IA no backend (IA entra na v2)
- **Mobile-first**: 38% dos advogados são autônomos, provavelmente usando celular entre audiências
- **Framing estratégico**: para não-adotantes resistentes (34,1%), o produto não deve parecer "IA" — deve parecer "ferramenta jurídica"
