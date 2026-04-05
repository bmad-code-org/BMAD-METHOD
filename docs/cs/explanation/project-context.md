---
title: "Kontext projektu"
description: Jak project-context.md vede AI agenty s pravidly a preferencemi vašeho projektu
sidebar:
  order: 7
---

Soubor `project-context.md` je implementační průvodce vašeho projektu pro AI agenty. Podobně jako „ústava“ v jiných vývojových systémech zachycuje pravidla, vzory a preference, které zajišťují konzistentní generování kódu napříč všemi workflow.

## Co dělá

AI agenti neustále dělají implementační rozhodnutí — jaké vzory následovat, jak strukturovat kód, jaké konvence používat. Bez jasného vedení mohou:
- Následovat generické osvědčené postupy, které neodpovídají vaší kódové bázi
- Dělat nekonzistentní rozhodnutí napříč různými stories
- Přehlédnout požadavky nebo omezení specifická pro projekt

Soubor `project-context.md` toto řeší dokumentací toho, co agenti potřebují vědět, ve stručném formátu optimalizovaném pro LLM.

## Jak to funguje

Každý implementační workflow automaticky načítá `project-context.md`, pokud existuje. Architektonický workflow ho také načítá, aby respektoval vaše technické preference při navrhování architektury.

**Načítán těmito workflow:**
- `bmad-create-architecture` — respektuje technické preference během solutioningu
- `bmad-create-story` — informuje tvorbu stories vzory projektu
- `bmad-dev-story` — vede implementační rozhodnutí
- `bmad-code-review` — validuje proti standardům projektu
- `bmad-quick-dev` — aplikuje vzory při implementaci specifikací
- `bmad-sprint-planning`, `bmad-retrospective`, `bmad-correct-course` — poskytuje celkový kontext projektu

## Kdy ho vytvořit

Soubor `project-context.md` je užitečný v jakékoli fázi projektu:

| Scénář                               | Kdy vytvořit                                    | Účel                                                                 |
| ------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------- |
| **Nový projekt, před architekturou** | Ručně, před `bmad-create-architecture`          | Dokumentujte vaše technické preference, aby je architekt respektoval |
| **Nový projekt, po architektuře**    | Přes `bmad-generate-project-context` nebo ručně | Zachyťte architektonická rozhodnutí pro implementační agenty         |
| **Existující projekt**               | Přes `bmad-generate-project-context`            | Objevte existující vzory, aby agenti dodržovali zavedené konvence    |
| **Quick Flow projekt**               | Před nebo během `bmad-quick-dev`                | Zajistěte, aby rychlá implementace respektovala vaše vzory           |

:::tip[Doporučeno]
Pro nové projekty ho vytvořte ručně před architekturou, pokud máte silné technické preference. Jinak ho vygenerujte po architektuře pro zachycení těchto rozhodnutí.
:::

## Co do něj patří

Soubor má dvě hlavní sekce:

### Technologický stack a verze

Dokumentuje frameworky, jazyky a nástroje, které váš projekt používá se specifickými verzemi:

```markdown
## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand (not Redux)
- Testing: Vitest, Playwright, MSW
- Styling: Tailwind CSS with custom design tokens
```

### Kritická pravidla implementace

Dokumentuje vzory a konvence, které by agenti jinak mohli přehlédnout:

```markdown
## Critical Implementation Rules

**TypeScript Configuration:**
- Strict mode enabled — no `any` types without explicit approval
- Use `interface` for public APIs, `type` for unions/intersections

**Code Organization:**
- Components in `/src/components/` with co-located `.test.tsx`
- Utilities in `/src/lib/` for reusable pure functions
- API calls use the `apiClient` singleton — never fetch directly

**Testing Patterns:**
- Unit tests focus on business logic, not implementation details
- Integration tests use MSW to mock API responses
- E2E tests cover critical user journeys only

**Framework-Specific:**
- All async operations use the `handleError` wrapper for consistent error handling
- Feature flags accessed via `featureFlag()` from `@/lib/flags`
- New routes follow the file-based routing pattern in `/src/app/`
```

Zaměřte se na to, co je **neočividné** — věci, které agenti nemusí odvodit z čtení úryvků kódu. Nedokumentujte standardní postupy, které platí univerzálně.

## Vytvoření souboru

Máte tři možnosti:

### Ruční vytvoření

Vytvořte soubor na `_bmad-output/project-context.md` a přidejte svá pravidla:

```bash
# V kořeni projektu
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Upravte ho s vaším technologickým stackem a pravidly implementace. Architektonický a implementační workflow ho automaticky najdou a načtou.

### Generování po architektuře

Spusťte workflow `bmad-generate-project-context` po dokončení architektury:

```bash
bmad-generate-project-context
```

Toto skenuje váš dokument architektury a soubory projektu a generuje kontextový soubor zachycující učiněná rozhodnutí.

### Generování pro existující projekty

Pro existující projekty spusťte `bmad-generate-project-context` pro objevení existujících vzorů:

```bash
bmad-generate-project-context
```

Workflow analyzuje vaši kódovou bázi, identifikuje konvence a vygeneruje kontextový soubor, který můžete zkontrolovat a upřesnit.

## Proč na tom záleží

Bez `project-context.md` agenti dělají předpoklady, které nemusí odpovídat vašemu projektu:

| Bez kontextu                                    | S kontextem                              |
| ----------------------------------------------- | ---------------------------------------- |
| Používá generické vzory                         | Dodržuje vaše zavedené konvence          |
| Nekonzistentní styl napříč stories              | Konzistentní implementace                |
| Může přehlédnout omezení specifická pro projekt | Respektuje všechny technické požadavky   |
| Každý agent rozhoduje nezávisle                 | Všichni agenti se řídí stejnými pravidly |

To je zvláště důležité pro:
- **Quick Flow** — přeskakuje PRD a architekturu, takže kontextový soubor vyplní mezeru
- **Týmové projekty** — zajistí, že všichni agenti dodržují stejné standardy
- **Existující projekty** — zabrání porušení zavedených vzorů

## Editace a aktualizace

Soubor `project-context.md` je živý dokument. Aktualizujte ho, když:

- Se změní architektonická rozhodnutí
- Jsou zavedeny nové konvence
- Vzory se vyvíjejí během implementace
- Identifikujete mezery z chování agentů

Můžete ho kdykoli ručně upravit, nebo přegenerovat `bmad-generate-project-context` po významných změnách.

:::note[Umístění souboru]
Výchozí umístění je `_bmad-output/project-context.md`. Workflow ho tam hledají a také kontrolují `**/project-context.md` kdekoli ve vašem projektu.
:::
