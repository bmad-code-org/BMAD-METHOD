---
title: Možnosti testování
description: Srovnání vestavěného QA agenta (Quinn) s modulem Test Architect (TEA) pro automatizaci testů.
sidebar:
  order: 5
---

BMad poskytuje dvě testovací cesty: vestavěného QA agenta pro rychlé generování testů a instalovatelný modul Test Architect pro podnikovou testovací strategii.

## Který byste měli použít?

| Faktor | Quinn (vestavěný QA) | Modul TEA |
| --- | --- | --- |
| **Nejlepší pro** | Malé až střední projekty, rychlé pokrytí | Velké projekty, regulované nebo složité domény |
| **Nastavení** | Nic k instalaci — součástí BMM | Instalace zvlášť přes `npx bmad-method install` |
| **Přístup** | Generujte testy rychle, iterujte později | Nejprve plánujte, pak generujte s trasovatelností |
| **Typy testů** | API a E2E testy | API, E2E, ATDD, NFR a další |
| **Strategie** | Happy path + kritické hraniční případy | Prioritizace založená na riziku (P0–P3) |
| **Počet workflow** | 1 (Automate) | 9 (design, ATDD, automate, review, trace a další) |

:::tip[Začněte s Quinnem]
Většina projektů by měla začít s Quinnem. Pokud později budete potřebovat testovací strategii, quality gates nebo trasovatelnost požadavků, nainstalujte TEA vedle něj.
:::

## Vestavěný QA agent (Quinn)

Quinn je vestavěný QA agent v modulu BMM (Agile suite). Rychle generuje funkční testy pomocí existujícího testovacího frameworku vašeho projektu — bez konfigurace nebo další instalace.

**Spouštěč:** `QA` nebo `bmad-qa-generate-e2e-tests`

### Co Quinn dělá

Quinn spouští jeden workflow (Automate), který projde pěti kroky:

1. **Detekce testovacího frameworku** — skenuje `package.json` a existující testovací soubory pro váš framework (Jest, Vitest, Playwright, Cypress nebo jakýkoli standardní runner). Pokud neexistuje, analyzuje stack projektu a navrhne jeden.
2. **Identifikace funkcí** — zeptá se, co testovat, nebo automaticky objeví funkce v kódové bázi.
3. **Generování API testů** — pokrývá stavové kódy, strukturu odpovědí, happy path a 1–2 chybové případy.
4. **Generování E2E testů** — pokrývá uživatelské workflow se sémantickými lokátory a asercemi viditelných výsledků.
5. **Spuštění a ověření** — provede generované testy a okamžitě opraví selhání.

Quinn produkuje shrnutí testů uložené do složky implementačních artefaktů vašeho projektu.

### Vzory testů

Generované testy sledují filozofii „jednoduché a udržovatelné“:

- **Pouze standardní API frameworku** — žádné externí utility nebo vlastní abstrakce
- **Sémantické lokátory** pro UI testy (role, popisky, text místo CSS selektorů)
- **Nezávislé testy** bez závislostí na pořadí
- **Žádné hardcoded waity nebo sleep**
- **Jasné popisy**, které se čtou jako dokumentace funkcí

:::note[Rozsah]
Quinn generuje pouze testy. Pro revizi kódu a validaci stories použijte workflow Code Review (`CR`).
:::

### Kdy použít Quinna

- Rychlé pokrytí testy pro novou nebo existující funkci
- Automatizace testů přátelská k začátečníkům bez pokročilého nastavení
- Standardní vzory testů, které může číst a udržovat jakýkoli vývojář
- Malé až střední projekty, kde komplexní testovací strategie není potřeba

## Modul Test Architect (TEA)

TEA je samostatný modul, který poskytuje expertního agenta (Murat) a devět strukturovaných workflow pro podnikové testování. Jde za rámec generování testů do testovací strategie, plánování založeného na riziku, quality gates a trasovatelnosti požadavků.

- **Dokumentace:** [Dokumentace modulu TEA](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- **Instalace:** `npx bmad-method install` a výběr modulu TEA
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)

### Co TEA poskytuje

| Workflow | Účel |
| --- | --- |
| Test Design | Vytvoření komplexní testovací strategie vázané na požadavky |
| ATDD | Acceptance-test-driven development s kritérii stakeholderů |
| Automate | Generování testů s pokročilými vzory a utilitami |
| Test Review | Validace kvality a pokrytí testů proti strategii |
| Traceability | Mapování testů zpět na požadavky pro audit a compliance |
| NFR Assessment | Hodnocení nefunkčních požadavků (výkon, bezpečnost) |
| CI Setup | Konfigurace provádění testů v CI pipelines |
| Framework Scaffolding | Nastavení testovací infrastruktury a struktury projektu |
| Release Gate | Datově založená rozhodnutí go/no-go pro release |

TEA také podporuje prioritizaci P0–P3 založenou na riziku a volitelné integrace s Playwright Utils a MCP nástroji.

### Kdy použít TEA

- Projekty vyžadující trasovatelnost požadavků nebo compliance dokumentaci
- Týmy potřebující prioritizaci testů založenou na riziku napříč mnoha funkcemi
- Podniková prostředí s formálními quality gates před releasem
- Složité domény, kde musí být testovací strategie naplánována před psaním testů
- Projekty, které přerostly jednoduchý workflow Quinna

## Jak testování zapadá do workflow

Quinn workflow Automate se objevuje ve Fázi 4 (Implementace) mapy workflow BMad Method. Je navržen ke spuštění **po dokončení celého epicu** — jakmile jsou všechny stories v epicu implementovány a zrevidovány. Typická sekvence:

1. Pro každou story v epicu: implementace s Dev (`DS`), pak validace pomocí Code Review (`CR`)
2. Po dokončení epicu: generování testů s Quinnem (`QA`) nebo TEA workflow Automate
3. Spuštění retrospektivy (`bmad-retrospective`) pro zachycení získaných zkušeností

Quinn pracuje přímo ze zdrojového kódu bez načítání plánovacích dokumentů (PRD, architektura). TEA workflow mohou integrovat s upstream plánovacími artefakty pro trasovatelnost.

Pro více o tom, kde testování zapadá do celkového procesu, viz [Mapa pracovních postupů](./workflow-map.md).
