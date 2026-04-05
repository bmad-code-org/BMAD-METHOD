---
title: "Začínáme"
description: Nainstalujte BMad a vytvořte svůj první projekt
---

Vytvářejte software rychleji pomocí pracovních postupů řízených AI se specializovanými agenty, kteří vás provedou plánováním, architekturou a implementací.

## Co se naučíte

- Nainstalovat a inicializovat BMad Method pro nový projekt
- Používat **BMad-Help** — vašeho inteligentního průvodce, který ví, co dělat dál
- Vybrat správnou plánovací cestu pro velikost vašeho projektu
- Postupovat fázemi od požadavků k fungujícímu kódu
- Efektivně používat agenty a pracovní postupy

:::note[Předpoklady]
- **Node.js 20+** — Vyžadováno pro instalátor
- **Git** — Doporučeno pro správu verzí
- **AI-powered IDE** — Claude Code, Cursor nebo podobné
- **Nápad na projekt** — I jednoduchý stačí pro učení
:::

:::tip[Nejsnadnější cesta]
**Instalace** → `npx bmad-method install`
**Zeptejte se** → `bmad-help what should I do first?`
**Tvořte** → Nechte BMad-Help vás provést workflow po workflow
:::

## Seznamte se s BMad-Help: Váš inteligentní průvodce

**BMad-Help je nejrychlejší způsob, jak začít s BMad.** Nemusíte si pamatovat workflow nebo fáze — prostě se zeptejte a BMad-Help:

- **Prozkoumá váš projekt** a zjistí, co už bylo uděláno
- **Ukáže vaše možnosti** na základě nainstalovaných modulů
- **Doporučí, co dál** — včetně prvního povinného úkolu
- **Odpoví na otázky** jako „Mám nápad na SaaS, kde začít?“

### Jak používat BMad-Help

Spusťte ho ve vašem AI IDE vyvoláním skillu:

```
bmad-help
```

Nebo ho spojte s otázkou pro kontextové poradenství:

```
bmad-help I have an idea for a SaaS product, I already know all the features I want. where do I get started?
```

BMad-Help odpoví s:
- Co je doporučeno pro vaši situaci
- Jaký je první povinný úkol
- Jak vypadá zbytek procesu

### Řídí i pracovní postupy

BMad-Help nejen odpovídá na otázky — **automaticky se spouští na konci každého workflow** a řekne vám přesně, co dělat dál. Žádné hádání, žádné prohledávání dokumentace — jen jasné pokyny k dalšímu povinnému workflow.

:::tip[Začněte zde]
Po instalaci BMad okamžitě vyvolejte skill `bmad-help`. Detekuje, jaké moduly máte nainstalované, a navede vás ke správnému výchozímu bodu pro váš projekt.
:::

## Pochopení BMad

BMad vám pomáhá vytvářet software prostřednictvím řízených pracovních postupů se specializovanými AI agenty. Proces probíhá ve čtyřech fázích:

| Fáze | Název          | Co se děje                                              |
| ---- | -------------- | ------------------------------------------------------- |
| 1    | Analýza        | Brainstorming, průzkum, product brief nebo PRFAQ *(volitelné)* |
| 2    | Plánování      | Vytvoření požadavků (PRD nebo specifikace)              |
| 3    | Solutioning    | Návrh architektury *(pouze BMad Method/Enterprise)*     |
| 4    | Implementace   | Budování epic po epicu, story po story                  |

**[Otevřete Mapu pracovních postupů](../reference/workflow-map.md)** pro prozkoumání fází, workflow a správy kontextu.

Na základě složitosti vašeho projektu nabízí BMad tři plánovací cesty:

| Cesta           | Nejlepší pro                                                   | Vytvořené dokumenty                    |
| --------------- | -------------------------------------------------------------- | -------------------------------------- |
| **Quick Flow**  | Opravy chyb, jednoduché funkce, jasný rozsah (1–15 stories)   | Pouze tech-spec                        |
| **BMad Method** | Produkty, platformy, složité funkce (10–50+ stories)           | PRD + architektura + UX                |
| **Enterprise**  | Compliance, multi-tenant systémy (30+ stories)                 | PRD + architektura + bezpečnost + DevOps |

:::note
Počty stories jsou orientační, ne definitivní. Vyberte si cestu podle potřeb plánování, ne podle počtu stories.
:::

## Instalace

Otevřete terminál v adresáři vašeho projektu a spusťte:

```bash
npx bmad-method install
```

Pokud chcete nejnovější prereleaseový build místo výchozího release kanálu, použijte `npx bmad-method@next install`.

Při výzvě k výběru modulů zvolte **BMad Method**.

Instalátor vytvoří dvě složky:
- `_bmad/` — agenti, workflow, úkoly a konfigurace
- `_bmad-output/` — prozatím prázdná, ale zde se budou ukládat vaše artefakty

:::tip[Váš další krok]
Otevřete vaše AI IDE ve složce projektu a spusťte:

```
bmad-help
```

BMad-Help detekuje, co jste dokončili, a doporučí přesně, co dělat dál. Můžete mu také klást otázky jako „Jaké mám možnosti?“ nebo „Mám nápad na SaaS, kde začít?“
:::

:::note[Jak načítat agenty a spouštět workflow]
Každý workflow má **skill**, který vyvoláte jménem ve vašem IDE (např. `bmad-create-prd`). Váš AI nástroj rozpozná název `bmad-*` a spustí ho — nemusíte načítat agenty zvlášť. Můžete také vyvolat agentní skill přímo pro obecnou konverzaci (např. `bmad-agent-pm` pro PM agenta).
:::

:::caution[Nové chaty]
Vždy začněte nový chat pro každý workflow. Tím předejdete problémům s kontextovými omezeními.
:::

## Krok 1: Vytvořte svůj plán

Projděte fázemi 1–3. **Pro každý workflow používejte nové chaty.**

:::tip[Kontext projektu (volitelné)]
Před začátkem zvažte vytvoření `project-context.md` pro dokumentaci vašich technických preferencí a pravidel implementace. Tím zajistíte, že všichni AI agenti budou dodržovat vaše konvence v průběhu celého projektu.

Vytvořte ho ručně na `_bmad-output/project-context.md` nebo ho vygenerujte po architektuře pomocí `bmad-generate-project-context`. [Zjistit více](../explanation/project-context.md).
:::

### Fáze 1: Analýza (volitelná)

Všechny workflow v této fázi jsou volitelné:
- **brainstorming** (`bmad-brainstorming`) — Řízená ideace
- **průzkum** (`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) — Tržní, doménový a technický průzkum
- **product-brief** (`bmad-product-brief`) — Doporučený základní dokument, když je váš koncept jasný
- **prfaq** (`bmad-prfaq`) — Working Backwards výzva pro zátěžový test a zformování vašeho produktového konceptu

### Fáze 2: Plánování (povinná)

**Pro BMad Method a Enterprise cesty:**
1. Vyvolejte **PM agenta** (`bmad-agent-pm`) v novém chatu
2. Spusťte workflow `bmad-create-prd` (`bmad-create-prd`)
3. Výstup: `PRD.md`

**Pro Quick Flow cestu:**
- Spusťte `bmad-quick-dev` — zvládne plánování i implementaci v jednom workflow, přeskočte k implementaci

:::note[UX Design (volitelné)]
Pokud má váš projekt uživatelské rozhraní, vyvolejte **UX-Designer agenta** (`bmad-agent-ux-designer`) a spusťte UX design workflow (`bmad-create-ux-design`) po vytvoření PRD.
:::

### Fáze 3: Solutioning (BMad Method/Enterprise)

**Vytvoření architektury**
1. Vyvolejte **Architect agenta** (`bmad-agent-architect`) v novém chatu
2. Spusťte `bmad-create-architecture` (`bmad-create-architecture`)
3. Výstup: Dokument architektury s technickými rozhodnutími

**Vytvoření epiců a stories**

:::tip[Vylepšení ve V6]
Epicy a stories se nyní vytvářejí *po* architektuře. Tím vznikají kvalitnější stories, protože architektonická rozhodnutí (databáze, API vzory, tech stack) přímo ovlivňují rozklad práce.
:::

1. Vyvolejte **PM agenta** (`bmad-agent-pm`) v novém chatu
2. Spusťte `bmad-create-epics-and-stories` (`bmad-create-epics-and-stories`)
3. Workflow využívá jak PRD, tak architekturu k vytvoření technicky informovaných stories

**Kontrola připravenosti k implementaci** *(vysoce doporučeno)*
1. Vyvolejte **Architect agenta** (`bmad-agent-architect`) v novém chatu
2. Spusťte `bmad-check-implementation-readiness` (`bmad-check-implementation-readiness`)
3. Validuje soudržnost všech plánovacích dokumentů

## Krok 2: Sestavte svůj projekt

Jakmile je plánování dokončeno, přejděte k implementaci. **Každý workflow by měl běžet v novém chatu.**

### Inicializace plánování sprintu

Vyvolejte **Developer agenta** (`bmad-agent-dev`) a spusťte `bmad-sprint-planning` (`bmad-sprint-planning`). Tím se vytvoří `sprint-status.yaml` pro sledování všech epiců a stories.

### Cyklus vývoje

Pro každou story opakujte tento cyklus s novými chaty:

| Krok | Agent | Workflow             | Příkaz                     | Účel                               |
| ---- | ----- | -------------------- | -------------------------- | ---------------------------------- |
| 1    | DEV   | `bmad-create-story`  | `bmad-create-story`        | Vytvoření story souboru z epicu    |
| 2    | DEV   | `bmad-dev-story`     | `bmad-dev-story`           | Implementace story                 |
| 3    | DEV   | `bmad-code-review`   | `bmad-code-review`         | Validace kvality *(doporučeno)*    |

Po dokončení všech stories v epicu vyvolejte **Developer agenta** (`bmad-agent-dev`) a spusťte `bmad-retrospective` (`bmad-retrospective`).

## Co jste dosáhli

Naučili jste se základy budování s BMad:

- Nainstalovali BMad a nakonfigurovali ho pro vaše IDE
- Inicializovali projekt s vybranou plánovací cestou
- Vytvořili plánovací dokumenty (PRD, architektura, epicy a stories)
- Pochopili cyklus vývoje pro implementaci

Váš projekt nyní obsahuje:

```text
váš-projekt/
├── _bmad/                                   # Konfigurace BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Váš dokument požadavků
│   │   ├── architecture.md                  # Technická rozhodnutí
│   │   └── epics/                           # Soubory epiců a stories
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Sledování sprintu
│   └── project-context.md                   # Pravidla implementace (volitelné)
└── ...
```

## Rychlý přehled

| Workflow                              | Příkaz                                     | Agent     | Účel                                            |
| ------------------------------------- | ------------------------------------------ | --------- | ----------------------------------------------- |
| **`bmad-help`** ⭐                    | `bmad-help`                               | Jakýkoli  | **Váš inteligentní průvodce — ptejte se na cokoli!** |
| `bmad-create-prd`                     | `bmad-create-prd`                         | PM        | Vytvoření dokumentu požadavků (PRD)             |
| `bmad-create-architecture`            | `bmad-create-architecture`                | Architect | Vytvoření dokumentu architektury                |
| `bmad-generate-project-context`       | `bmad-generate-project-context`           | Analyst   | Vytvoření souboru kontextu projektu             |
| `bmad-create-epics-and-stories`       | `bmad-create-epics-and-stories`           | PM        | Rozklad PRD na epicy                            |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness`     | Architect | Validace soudržnosti plánování                  |
| `bmad-sprint-planning`                | `bmad-sprint-planning`                    | DEV       | Inicializace sledování sprintu                  |
| `bmad-create-story`                   | `bmad-create-story`                       | DEV       | Vytvoření souboru story                         |
| `bmad-dev-story`                      | `bmad-dev-story`                          | DEV       | Implementace story                              |
| `bmad-code-review`                    | `bmad-code-review`                        | DEV       | Revize implementovaného kódu                    |

## Časté otázky

**Potřebuji vždy architekturu?**
Pouze pro BMad Method a Enterprise cesty. Quick Flow přeskakuje ze specifikace rovnou k implementaci.

**Mohu později změnit svůj plán?**
Ano. Workflow `bmad-correct-course` (`bmad-correct-course`) řeší změny rozsahu během implementace.

**Co když chci nejdřív brainstormovat?**
Vyvolejte Analyst agenta (`bmad-agent-analyst`) a spusťte `bmad-brainstorming` (`bmad-brainstorming`) před zahájením PRD.

**Musím dodržovat striktní pořadí?**
Ne striktně. Jakmile se naučíte postup, můžete spouštět workflow přímo pomocí Rychlého přehledu výše.

## Získání pomoci

:::tip[První zastávka: BMad-Help]
**Vyvolejte `bmad-help` kdykoli** — je to nejrychlejší způsob, jak se odpoutat. Zeptejte se na cokoli:
- „Co mám dělat po instalaci?“
- „Zasekl jsem se na workflow X“
- „Jaké mám možnosti pro Y?“
- „Ukaž mi, co bylo dosud uděláno“

BMad-Help prozkoumá váš projekt, detekuje, co jste dokončili, a řekne vám přesně, co dělat dál.
:::

- **Během workflow** — Agenti vás provázejí otázkami a vysvětleními
- **Komunita** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## Klíčové poznatky

:::tip[Zapamatujte si]
- **Začněte s `bmad-help`** — Váš inteligentní průvodce, který zná váš projekt a možnosti
- **Vždy používejte nové chaty** — Začněte nový chat pro každý workflow
- **Cesta záleží** — Quick Flow používá `bmad-quick-dev`; Method/Enterprise vyžadují PRD a architekturu
- **BMad-Help se spouští automaticky** — Každý workflow končí pokyny, co dělat dál
:::

Jste připraveni začít? Nainstalujte BMad, vyvolejte `bmad-help` a nechte svého inteligentního průvodce ukázat cestu.
