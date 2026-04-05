---
title: Skills
description: Reference BMad skills — co to je, jak fungují a kde je najít.
sidebar:
  order: 3
---

Skills jsou předpřipravené prompty, které načítají agenty, spouštějí workflow nebo provádějí úkoly ve vašem IDE. Instalátor BMad je generuje z vašich nainstalovaných modulů při instalaci. Pokud později přidáte, odeberete nebo změníte moduly, přeinstalujte pro synchronizaci skills (viz [Řešení problémů](#řešení-problémů)).

## Skills vs. spouštěče nabídky agentů

BMad nabízí dva způsoby zahájení práce a slouží k různým účelům.

| Mechanismus | Jak se vyvolává | Co se stane |
| --- | --- | --- |
| **Skill** | Zadejte název skillu (např. `bmad-help`) ve vašem IDE | Přímo načte agenta, spustí workflow nebo provede úkol |
| **Spouštěč nabídky agenta** | Nejprve načtěte agenta, pak zadejte krátký kód (např. `DS`) | Agent interpretuje kód a spustí odpovídající workflow, přičemž zůstává v charakteru |

Spouštěče nabídky agentů vyžadují aktivní relaci agenta. Používejte skills, když víte, který workflow chcete. Používejte spouštěče, když již pracujete s agentem a chcete přepnout úkol bez opuštění konverzace.

## Jak se skills generují

Když spustíte `npx bmad-method install`, instalátor čte manifesty každého vybraného modulu a zapíše jeden skill na agenta, workflow, úkol a nástroj. Každý skill je adresář obsahující soubor `SKILL.md`, který instruuje AI k načtení odpovídajícího zdrojového souboru a následování jeho instrukcí.

Instalátor používá šablony pro každý typ skillu:

| Typ skillu | Co generovaný soubor dělá |
| --- | --- |
| **Spouštěč agenta** | Načte soubor persony agenta, aktivuje jeho nabídku a zůstává v charakteru |
| **Workflow skill** | Načte konfiguraci workflow a následuje jeho kroky |
| **Task skill** | Načte samostatný soubor úkolu a následuje jeho instrukce |
| **Tool skill** | Načte samostatný soubor nástroje a následuje jeho instrukce |

:::note[Opětovné spuštění instalátoru]
Pokud přidáte nebo odeberete moduly, spusťte instalátor znovu. Přegeneruje všechny soubory skills tak, aby odpovídaly vašemu aktuálnímu výběru modulů.
:::

## Kde žijí soubory skills

Instalátor zapisuje soubory skills do adresáře specifického pro IDE uvnitř vašeho projektu. Přesná cesta závisí na IDE, které jste vybrali během instalace.

| IDE / CLI | Adresář skills |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Windsurf | `.windsurf/skills/` |
| Další IDE | Viz výstup instalátoru pro cílovou cestu |

Každý skill je adresář obsahující soubor `SKILL.md`. Například instalace Claude Code vypadá takto:

```text
.claude/skills/
├── bmad-help/
│   └── SKILL.md
├── bmad-create-prd/
│   └── SKILL.md
├── bmad-agent-dev/
│   └── SKILL.md
└── ...
```

Název adresáře určuje název skillu ve vašem IDE. Například adresář `bmad-agent-dev/` registruje skill `bmad-agent-dev`.

## Jak objevit vaše skills

Zadejte název skillu ve vašem IDE pro jeho vyvolání. Některé platformy vyžadují povolení skills v nastavení, než se zobrazí.

Spusťte `bmad-help` pro kontextové poradenství k dalšímu kroku.

:::tip[Rychlé objevování]
Generované adresáře skills ve vašem projektu jsou kanonický seznam. Otevřete je v prohlížeči souborů, abyste viděli každý skill s jeho popisem.
:::

## Kategorie skills

### Agentní skills

Agentní skills načítají specializovanou AI personu s definovanou rolí, komunikačním stylem a nabídkou workflow. Po načtení agent zůstává v charakteru a reaguje na spouštěče nabídky.

| Příklad skillu | Agent | Role |
| --- | --- | --- |
| `bmad-agent-dev` | Amelia (Developer) | Implementuje stories s přísným dodržováním specifikací |
| `bmad-pm` | John (Product Manager) | Vytváří a validuje PRD |
| `bmad-architect` | Winston (Architect) | Navrhuje systémovou architekturu |

Viz [Agenti](./agents.md) pro úplný seznam výchozích agentů a jejich spouštěčů.

### Workflow skills

Workflow skills spouštějí strukturovaný, vícekrokový proces bez předchozího načtení persony agenta. Načtou konfiguraci workflow a následují jeho kroky.

| Příklad skillu | Účel |
| --- | --- |
| `bmad-product-brief` | Vytvoření product briefu — řízené discovery, když je váš koncept jasný |
| `bmad-prfaq` | Working Backwards PRFAQ výzva pro zátěžový test vašeho produktového konceptu |
| `bmad-create-prd` | Vytvoření dokumentu požadavků (PRD) |
| `bmad-create-architecture` | Návrh systémové architektury |
| `bmad-create-epics-and-stories` | Vytvoření epiců a stories |
| `bmad-dev-story` | Implementace story |
| `bmad-code-review` | Spuštění revize kódu |
| `bmad-quick-dev` | Sjednocený quick flow — vyjasnění záměru, plán, implementace, revize, prezentace |

Viz [Mapa pracovních postupů](./workflow-map.md) pro kompletní referenci workflow organizovanou podle fází.

### Task a tool skills

Tasks a tools jsou samostatné operace, které nevyžadují kontext agenta nebo workflow.

**BMad-Help: Váš inteligentní průvodce**

`bmad-help` je vaše primární rozhraní pro objevení, co dělat dál. Zkoumá váš projekt, rozumí dotazům v přirozeném jazyce a doporučuje další povinný nebo volitelný krok na základě nainstalovaných modulů.

:::note[Příklad]
```
bmad-help
bmad-help I have a SaaS idea and know all the features. Where do I start?
bmad-help What are my options for UX design?
```
:::

**Další základní tasks a tools**

Základní modul zahrnuje 11 vestavěných nástrojů — revize, komprese, brainstorming, správa dokumentů a další. Viz [Základní nástroje](./core-tools.md) pro kompletní referenci.

## Konvence pojmenování

Všechny skills používají prefix `bmad-` následovaný popisným názvem (např. `bmad-dev`, `bmad-create-prd`, `bmad-help`). Viz [Moduly](./modules.md) pro dostupné moduly.

## Řešení problémů

**Skills se nezobrazují po instalaci.** Některé platformy vyžadují explicitní povolení skills v nastavení. Zkontrolujte dokumentaci vašeho IDE nebo se zeptejte AI asistenta, jak skills povolit. Může být také nutné restartovat IDE nebo znovu načíst okno.

**Očekávané skills chybí.** Instalátor generuje skills pouze pro moduly, které jste vybrali. Spusťte `npx bmad-method install` znovu a ověřte výběr modulů. Zkontrolujte, že soubory skills existují v očekávaném adresáři.

**Skills z odebraného modulu se stále zobrazují.** Instalátor automaticky nemaže staré soubory skills. Odstraňte zastaralé adresáře z adresáře skills vašeho IDE, nebo smažte celý adresář skills a přeinstalujte pro čistou sadu.
