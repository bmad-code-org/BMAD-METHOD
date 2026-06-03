---
title: "Správa kontextu projektu"
description: Vytvoření a údržba project-context.md pro vedení AI agentů
sidebar:
  order: 8
---

Použijte soubor `project-context.md` k zajištění toho, aby AI agenti dodržovali technické preference a pravidla implementace vašeho projektu ve všech workflow. Aby byl vždy dostupný, můžete také přidat řádek `Important project context and conventions are located in [cesta k project context]/project-context.md` do souboru kontextu nebo pravidel vašeho nástroje (jako je `AGENTS.md`).

:::note[Předpoklady]
- BMad Method nainstalován
- Znalost technologického stacku a konvencí vašeho projektu
:::

## Kdy to použít

- Máte silné technické preference před začátkem architektury
- Dokončili jste architekturu a chcete zachytit rozhodnutí pro implementaci
- Pracujete na existující kódové bázi se zavedenými vzory
- Všimnete si, že agenti dělají nekonzistentní rozhodnutí napříč stories

## Krok 1: Vyberte přístup

**Ruční vytvoření** — Nejlepší, když přesně víte, jaká pravidla chcete dokumentovat

**Generování po architektuře** — Nejlepší pro zachycení rozhodnutí učiněných během solutioningu

**Generování pro existující projekty** — Nejlepší pro objevení vzorů v existujících kódových bázích

## Krok 2: Vytvořte soubor

### Možnost A: Ruční vytvoření

Vytvořte soubor na `_bmad-output/project-context.md`:

```bash
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Přidejte váš technologický stack a pravidla implementace:

```markdown
---
project_name: 'MyProject'
user_name: 'YourName'
date: '2026-02-15'
sections_completed: ['technology_stack', 'critical_rules']
---

# Project Context for AI Agents

## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand
- Testing: Vitest, Playwright
- Styling: Tailwind CSS

## Critical Implementation Rules

**TypeScript:**
- Strict mode enabled, no `any` types
- Use `interface` for public APIs, `type` for unions

**Code Organization:**
- Components in `/src/components/` with co-located tests
- API calls use `apiClient` singleton — never fetch directly

**Testing:**
- Unit tests focus on business logic
- Integration tests use MSW for API mocking
```

### Možnost B: Generování po architektuře

Spusťte workflow v novém chatu:

```bash
bmad-generate-project-context
```

Workflow skenuje váš dokument architektury a soubory projektu a generuje kontextový soubor zachycující učiněná rozhodnutí.

### Možnost C: Generování pro existující projekty

Pro existující projekty spusťte:

```bash
bmad-generate-project-context
```

Workflow analyzuje vaši kódovou bázi, identifikuje konvence a vygeneruje kontextový soubor, který můžete zkontrolovat a upřesnit.

## Krok 3: Ověřte obsah

Zkontrolujte vygenerovaný soubor a ujistěte se, že zachycuje:

- Správné verze technologií
- Vaše skutečné konvence (ne generické osvědčené postupy)
- Pravidla, která předcházejí běžným chybám
- Vzory specifické pro framework

Ručně upravte pro doplnění chybějícího nebo odstranění nepřesností.

## Co získáte

Soubor `project-context.md`, který:

- Zajistí, že všichni agenti dodržují stejné konvence
- Zabrání nekonzistentním rozhodnutím napříč stories
- Zachytí architektonická rozhodnutí pro implementaci
- Slouží jako reference pro vzory a pravidla vašeho projektu

## Tipy

:::tip[Osvědčené postupy]
- **Zaměřte se na neočividné** — Dokumentujte vzory, které agenti mohou přehlédnout (např. „Použijte JSDoc na každé veřejné třídě“), ne univerzální postupy jako „používejte smysluplné názvy proměnných.“
- **Udržujte to stručné** — Tento soubor načítá každý implementační workflow. Dlouhé soubory plýtvají kontextem. Vylučte obsah, který platí pouze pro úzký rozsah nebo specifické stories.
- **Aktualizujte dle potřeby** — Upravte ručně, když se vzory změní, nebo přegenerujte po významných změnách architektury.
- Funguje pro projekty Quick Flow i plné metody BMad.
:::

## Další kroky

- [**Vysvětlení kontextu projektu**](../explanation/project-context.md) — Zjistěte více o tom, jak to funguje
- [**Mapa pracovních postupů**](../reference/workflow-map.md) — Podívejte se, které workflow načítají kontext projektu
