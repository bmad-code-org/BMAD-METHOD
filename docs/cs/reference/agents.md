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
| Analyst (Mary)              | `bmad-analyst`       | `BP`, `MR`, `DR`, `TR`, `CB`, `WB`, `DP`     | Brainstorm, průzkum trhu, doménový výzkum, technický výzkum, tvorba briefu, PRFAQ výzva, dokumentace projektu |
| Product Manager (John)      | `bmad-pm`            | `CP`, `VP`, `EP`, `CE`, `IR`, `CC`           | Tvorba/validace/editace PRD, tvorba epiců a stories, připravenost implementace, korekce kurzu       |
| Architect (Winston)         | `bmad-architect`     | `CA`, `IR`                                    | Tvorba architektury, připravenost implementace                                                      |
| Developer (Amelia)          | `bmad-agent-dev`     | `BD`, `QA`, `CR`, `SP`, `ER`                  | Build, generování QA testů, revize kódu, plánování sprintu, retrospektiva epicu |
| UX Designer (Sally)         | `bmad-ux-designer`   | `CU`                                          | Tvorba UX designu                                                                                   |

:::note[Kde je Paige?]
Technical Writer (Paige) má přestávku — v budoucnu se vrátí s mnohem širšími schopnostmi. Dokumentace projektu zůstává pokryta: spouštěč `DP` (dokumentace projektu) je dostupný přes Analyst agenta, nebo vyvolejte skill `bmad-document-project` přímo.
:::

## Typy spouštěčů

Spouštěče nabídky agentů načítají strukturovaný soubor workflow. Zadejte kód spouštěče a agent zahájí workflow a vyzve vás k zadání vstupu v každém kroku.

Příklady: `CP` (tvorba PRD), `CA` (tvorba architektury), `BD` (Build)
