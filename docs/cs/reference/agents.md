---
title: Agenti
description: Výchozí BMM agenti s jejich skill ID, spouštěči nabídky a primárními workflow
sidebar:
  order: 2
---

## Výchozí agenti

Tato stránka uvádí výchozí BMM (Agile suite) agenty, kteří se instalují s BMad Method, společně s jejich skill ID, spouštěči nabídky a primárními workflow. Každý agent se vyvolává jako skill.

## Poznámky

- Každý agent je dostupný jako skill, generovaný instalátorem. Skill ID (např. `bmad-dev`) se používá k vyvolání agenta.
- Spouštěče jsou krátké kódy nabídky (např. `CP`) a fuzzy shody zobrazené v nabídce každého agenta.
- Generování QA testů zajišťuje workflow skill `bmad-qa-generate-e2e-tests`, dostupný přes Developer agenta. Plný Test Architect (TEA) žije ve vlastním modulu.

| Agent                       | Skill ID             | Spouštěče                                    | Primární workflow                                                                                   |
| --------------------------- | -------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Analyst (Mary)              | `bmad-analyst`       | `BP`, `RS`, `CB`, `WB`, `DP`                 | Brainstorm projektu, výzkum, tvorba briefu, PRFAQ výzva, dokumentace projektu                       |
| Product Manager (John)      | `bmad-pm`            | `CP`, `VP`, `EP`, `CE`, `IR`, `CC`           | Tvorba/validace/editace PRD, tvorba epiců a stories, připravenost implementace, korekce kurzu       |
| Architect (Winston)         | `bmad-architect`     | `CA`, `IR`                                    | Tvorba architektury, připravenost implementace                                                      |
| Developer (Amelia)          | `bmad-agent-dev`     | `DS`, `QD`, `QA`, `CR`, `SP`, `CS`, `ER`     | Dev story, Quick Dev, generování QA testů, revize kódu, plánování sprintu, tvorba story, retrospektiva epicu |
| UX Designer (Sally)         | `bmad-ux-designer`   | `CU`                                          | Tvorba UX designu                                                                                   |
| Technical Writer (Paige)    | `bmad-tech-writer`   | `DP`, `WD`, `US`, `MG`, `VD`, `EC`           | Dokumentace projektu, psaní dokumentu, aktualizace standardů, generování Mermaid, validace dok., vysvětlení konceptu |

## Typy spouštěčů

Spouštěče nabídky agentů používají dva různé typy vyvolání. Znalost typu spouštěče vám pomůže poskytnout správný vstup.

### Workflow spouštěče (bez argumentů)

Většina spouštěčů načítá strukturovaný soubor workflow. Zadejte kód spouštěče a agent zahájí workflow a vyzve vás k zadání vstupu v každém kroku.

Příklady: `CP` (tvorba PRD), `DS` (Dev story), `CA` (tvorba architektury), `QD` (Quick Dev)

### Konverzační spouštěče (vyžadují argumenty)

Některé spouštěče zahajují volnou konverzaci místo strukturovaného workflow. Tyto očekávají, že popíšete, co potřebujete, společně s kódem spouštěče.

| Agent | Spouštěč | Co poskytnout |
| --- | --- | --- |
| Technical Writer (Paige) | `WD` | Popis dokumentu k napsání |
| Technical Writer (Paige) | `US` | Preference nebo konvence k přidání do standardů |
| Technical Writer (Paige) | `MG` | Popis diagramu a typ (sekvence, vývojový diagram atd.) |
| Technical Writer (Paige) | `VD` | Dokument k validaci a oblasti zaměření |
| Technical Writer (Paige) | `EC` | Název konceptu k vysvětlení |

**Příklad:**

```text
WD Write a deployment guide for our Docker setup
MG Create a sequence diagram showing the auth flow
EC Explain how the module system works
```
