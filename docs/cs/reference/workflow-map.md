---
title: "Mapa pracovních postupů"
description: Vizuální reference fází workflow BMad Method a jejich výstupů
sidebar:
  order: 1
---

BMad Method (BMM) je modul v ekosystému BMad, zaměřený na dodržování osvědčených postupů context engineeringu a plánování. AI agenti fungují nejlépe s jasným, strukturovaným kontextem. Systém BMM buduje tento kontext progresivně napříč 4 odlišnými fázemi — každá fáze a volitelně více workflow v každé fázi produkují dokumenty, které informují další, takže agenti vždy vědí, co budovat a proč.

Zdůvodnění a koncepty vycházejí z agilních metodik, které byly v průmyslu úspěšně používány jako mentální framework.

Pokud si kdykoli nejste jisti, co dělat, skill `bmad-help` vám pomůže zůstat na cestě nebo vědět, co dělat dál. Vždy se můžete odkázat sem — ale `bmad-help` je plně interaktivní a mnohem rychlejší, pokud již máte nainstalovaný BMad Method. Navíc, pokud používáte různé moduly, které rozšířily BMad Method nebo přidaly další komplementární moduly — `bmad-help` se vyvíjí a zná vše, co je dostupné, aby vám dal nejlepší radu v daném okamžiku.

Důležitá poznámka: Každý workflow níže lze spustit přímo vaším nástrojem přes skill nebo načtením agenta a použitím záznamu z nabídky agenta.

<iframe src="/workflow-map-diagram.html" title="Diagram mapy workflow BMad Method" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">Otevřít diagram v novém panelu ↗</a>
</p>

## Fáze 1: Analýza (volitelná)

Prozkoumejte problémový prostor a validujte nápady před závazkem k plánování.

| Workflow                        | Účel                                                                       | Produkuje                 |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------- |
| `bmad-brainstorming`            | Brainstorming nápadů na projekt s řízenou facilitací brainstormingového kouče | `brainstorming-report.md` |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | Validace tržních, technických nebo doménových předpokladů | Výzkumné nálezy |
| `bmad-product-brief`            | Zachycení strategické vize — nejlepší, když je váš koncept jasný           | `product-brief.md`        |
| `bmad-prfaq`                    | Working Backwards — zátěžový test a zformování vašeho produktového konceptu | `prfaq-{project}.md`      |

## Fáze 2: Plánování

Definujte, co budovat a pro koho.

| Workflow                    | Účel                                     | Produkuje    |
| --------------------------- | ---------------------------------------- | ------------ |
| `bmad-create-prd`           | Definice požadavků (FR/NFR)              | `PRD.md`     |
| `bmad-create-ux-design`     | Návrh uživatelského zážitku (když záleží na UX) | `ux-spec.md` |

## Fáze 3: Solutioning

Rozhodněte, jak to budovat, a rozložte práci na stories.

| Workflow                                  | Účel                                       | Produkuje                   |
| ----------------------------------------- | ------------------------------------------ | --------------------------- |
| `bmad-create-architecture`                | Explicitní technická rozhodnutí            | `architecture.md` s ADR     |
| `bmad-create-epics-and-stories`           | Rozložení požadavků na implementovatelnou práci | Soubory epiců se stories |
| `bmad-check-implementation-readiness`     | Kontrola brány před implementací           | Rozhodnutí PASS/CONCERNS/FAIL |

## Fáze 4: Implementace

Budujte to, jednu story po druhé. Brzy plná automatizace fáze 4!

| Workflow                   | Účel                                                                     | Produkuje                        |
| -------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| `bmad-sprint-planning`     | Inicializace sledování (jednou na projekt pro sekvencování dev cyklu)    | `sprint-status.yaml`             |
| `bmad-create-story`        | Příprava další story pro implementaci                                    | `story-[slug].md`                |
| `bmad-dev-story`           | Implementace story                                                       | Fungující kód + testy            |
| `bmad-code-review`         | Validace kvality implementace                                            | Schváleno nebo požadovány změny  |
| `bmad-correct-course`      | Řešení významných změn uprostřed sprintu                                 | Aktualizovaný plán nebo přesměrování |
| `bmad-sprint-status`       | Sledování průběhu sprintu a stavu stories                                | Aktualizace stavu sprintu        |
| `bmad-retrospective`       | Revize po dokončení epicu                                                | Poučení                          |

## Quick Flow (paralelní cesta)

Přeskočte fáze 1–3 pro malou, dobře pochopenou práci.

| Workflow           | Účel                                                                        | Produkuje            |
| ------------------ | --------------------------------------------------------------------------- | -------------------- |
| `bmad-quick-dev`   | Sjednocený quick flow — vyjasněte záměr, plánujte, implementujte, revidujte a prezentujte | `spec-*.md` + kód |

## Správa kontextu

Každý dokument se stává kontextem pro další fázi. PRD říká architektovi, jaká omezení záleží. Architektura říká dev agentovi, jaké vzory následovat. Soubory stories poskytují zaměřený, kompletní kontext pro implementaci. Bez této struktury agenti dělají nekonzistentní rozhodnutí.

### Kontext projektu

:::tip[Doporučeno]
Vytvořte `project-context.md` pro zajištění toho, aby AI agenti dodržovali pravidla a preference vašeho projektu. Tento soubor funguje jako ústava vašeho projektu — vede implementační rozhodnutí napříč všemi workflow. Tento volitelný soubor lze vygenerovat na konci tvorby architektury, nebo u existujícího projektu ho lze také vygenerovat pro zachycení toho, co je důležité pro zachování souladu se současnými konvencemi.
:::

**Jak ho vytvořit:**

- **Ručně** — Vytvořte `_bmad-output/project-context.md` s vaším technologickým stackem a pravidly implementace
- **Vygenerujte ho** — Spusťte `bmad-generate-project-context` pro automatické generování z vaší architektury nebo kódové báze

[**Zjistit více o project-context.md**](../explanation/project-context.md)
