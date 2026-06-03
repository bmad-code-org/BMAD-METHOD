---
title: "Jak získat odpovědi o BMad"
description: Použijte LLM k rychlému zodpovězení vašich otázek o BMad
sidebar:
  order: 4
---

## Začněte zde: BMad-Help

**Nejrychlejší způsob, jak získat odpovědi o BMad, je skill `bmad-help`.** Tento inteligentní průvodce zodpoví více než 80 % všech otázek a je vám k dispozici přímo ve vašem IDE při práci.

BMad-Help je víc než vyhledávací nástroj — umí:
- **Prozkoumat váš projekt** a zjistit, co už bylo dokončeno
- **Rozumět přirozenému jazyku** — ptejte se běžnou řečí
- **Přizpůsobit se nainstalovaným modulům** — zobrazí relevantní možnosti
- **Automaticky se spouštět po workflow** — řekne vám přesně, co dělat dál
- **Doporučit první povinný úkol** — žádné hádání, kde začít

### Jak používat BMad-Help

Zavolejte ho jménem ve vaší AI relaci:

```
bmad-help
```

:::tip
V závislosti na vaší platformě můžete také použít `/bmad-help` nebo `$bmad-help`, ale samotné `bmad-help` by mělo fungovat všude.
:::

Spojte ho s dotazem v přirozeném jazyce:

```
bmad-help I have a SaaS idea and know all the features. Where do I start?
bmad-help What are my options for UX design?
bmad-help I'm stuck on the PRD workflow
bmad-help Show me what's been done so far
```

BMad-Help odpoví:
- Co je doporučeno pro vaši situaci
- Jaký je první povinný úkol
- Jak vypadá zbytek procesu

## Kdy použít tohoto průvodce

Použijte tuto sekci, když:
- Chcete pochopit architekturu nebo interní fungování BMad
- Potřebujete odpovědi mimo to, co BMad-Help nabízí
- Zkoumáte BMad před instalací
- Chcete prozkoumat zdrojový kód přímo

## Kroky

### 1. Vyberte si zdroj

| Zdroj                | Nejlepší pro                              | Příklady                     |
| -------------------- | ----------------------------------------- | ---------------------------- |
| **Složka `_bmad`**   | Jak BMad funguje — agenti, workflow, prompty | „Co dělá PM agent?“        |
| **Celý GitHub repo** | Historie, instalátor, architektura        | „Co se změnilo ve v6?“      |
| **`llms-full.txt`**  | Rychlý přehled z dokumentace              | „Vysvětli čtyři fáze BMad“  |

Složka `_bmad` se vytvoří při instalaci BMad. Pokud ji ještě nemáte, naklonujte si repo.

### 2. Nasměrujte AI na zdroj

**Pokud vaše AI umí číst soubory (Claude Code, Cursor atd.):**

- **BMad nainstalován:** Nasměrujte na složku `_bmad` a ptejte se přímo
- **Chcete hlubší kontext:** Naklonujte si [celé repo](https://github.com/bmad-code-org/BMAD-METHOD)

**Pokud používáte ChatGPT nebo Claude.ai:**

Načtěte `llms-full.txt` do vaší relace:

```text
https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```

### 3. Položte svou otázku

:::note[Příklad]
**O:** „Řekni mi nejrychlejší způsob, jak něco vytvořit s BMad“

**A:** Použijte Quick Flow: Spusťte `bmad-quick-dev` — vyjasní váš záměr, naplánuje, implementuje, zreviduje a prezentuje výsledky v jednom workflow, přeskočí celé fáze plánování.
:::

## Co získáte

Přímé odpovědi o BMad — jak agenti fungují, co dělají workflow, proč jsou věci strukturované tak, jak jsou — bez čekání na odpověď od někoho jiného.

## Tipy

- **Ověřte překvapivé odpovědi** — LLM se občas mýlí. Zkontrolujte zdrojový soubor nebo se zeptejte na Discordu.
- **Buďte konkrétní** — „Co dělá krok 3 PRD workflow?“ je lepší než „Jak funguje PRD?“

## Stále jste uvízli?

Zkusili jste přístup přes LLM a stále potřebujete pomoc? Nyní máte mnohem lepší otázku k položení.

| Kanál                     | Použijte pro                                |
| ------------------------- | ------------------------------------------- |
| `#bmad-method-help`       | Rychlé otázky (chat v reálném čase)         |
| `help-requests` fórum     | Detailní otázky (vyhledatelné, trvalé)      |
| `#suggestions-feedback`   | Nápady a požadavky na funkce                |
| `#report-bugs-and-issues` | Hlášení chyb                                |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) (pro jasné chyby)
