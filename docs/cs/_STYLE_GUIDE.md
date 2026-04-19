---
title: "Průvodce stylem dokumentace"
description: Projektově specifické konvence dokumentace založené na stylu Google a struktuře Diataxis
---

Tento projekt se řídí [Google Developer Documentation Style Guide](https://developers.google.com/style) a používá [Diataxis](https://diataxis.fr/) pro strukturování obsahu. Následují pouze projektově specifické konvence.

## Projektově specifická pravidla

| Pravidlo                               | Specifikace                              |
| -------------------------------------- | ---------------------------------------- |
| Žádné horizontální čáry (`---`)        | Narušují plynulost čtení                 |
| Žádné nadpisy `####`                   | Místo toho použijte tučný text nebo admonitions |
| Žádné sekce „Souvisejí“ nebo „Další:“ | Navigaci zajišťuje postranní panel       |
| Žádné hluboce vnořené seznamy          | Místo toho rozdělejte do sekcí           |
| Žádné bloky kódu pro nekód             | Pro příklady dialogů použijte admonitions |
| Žádné tučné odstavce pro upozornění    | Místo toho použijte admonitions          |
| Max 1–2 admonitions na sekci           | Tutoriály povolují 3–4 na hlavní sekci   |
| Buňky tabulek / položky seznamů        | Max 1–2 věty                             |
| Rozpočet nadpisů                       | 8–12 `##` na dokument; 2–3 `###` na sekci |

## Admonitions (syntaxe Starlight)

```md
:::tip[Název]
Zkratky, osvědčené postupy
:::

:::note[Název]
Kontext, definice, příklady, předpoklady
:::

:::caution[Název]
Upozornění, potenciální problémy
:::

:::danger[Název]
Pouze kritická varování — ztráta dat, bezpečnostní problémy
:::
```

### Standardní použití

| Admonition               | Použití pro                   |
| ------------------------ | ----------------------------- |
| `:::note[Předpoklady]`  | Závislosti před začátkem      |
| `:::tip[Rychlá cesta]`  | TL;DR shrnutí na začátku dokumentu |
| `:::caution[Důležité]`  | Kritická upozornění           |
| `:::note[Příklad]`      | Příklady příkazů/odpovědí     |

## Standardní formáty tabulek

**Fáze:**

```md
| Fáze | Název    | Co se děje                                   |
| ---- | -------- | -------------------------------------------- |
| 1    | Analýza  | Brainstorming, průzkum *(volitelné)*         |
| 2    | Plánování | Požadavky — PRD nebo specifikace *(povinné)* |
```

**Skills:**

```md
| Skill                | Agent   | Účel                                 |
| -------------------- | ------- | ------------------------------------ |
| `bmad-brainstorming` | Analytik | Brainstorming nového projektu       |
| `bmad-create-prd`    | PM      | Vytvoření dokumentu požadavků (PRD) |
```

## Bloky struktury složek

Zobrazujte v sekcích „Co jste dosáhli“:

````md
```
váš-projekt/
├── _bmad/                                   # Konfigurace BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   └── PRD.md                           # Váš dokument požadavků
│   ├── implementation-artifacts/
│   └── project-context.md                   # Pravidla implementace (volitelné)
└── ...
```
````

## Struktura tutoriálu

```text
1. Název + Háček (1–2 věty popisující výsledek)
2. Upozornění na verzi/modul (info nebo warning admonition) (volitelné)
3. Co se naučíte (odrážkový seznam výsledků)
4. Předpoklady (info admonition)
5. Rychlá cesta (tip admonition – TL;DR shrnutí)
6. Pochopení [Tématu] (kontext před kroky – tabulky pro fáze/agenty)
7. Instalace (volitelné)
8. Krok 1: [První hlavní úkol]
9. Krok 2: [Druhý hlavní úkol]
10. Krok 3: [Třetí hlavní úkol]
11. Co jste dosáhli (shrnutí + struktura složek)
12. Rychlý přehled (tabulka skills)
13. Časté otázky (formát FAQ)
14. Získání pomoci (komunitní odkazy)
15. Klíčové poznatky (tip admonition)
```

### Kontrolní seznam tutoriálu

- [ ] Háček popisuje výsledek v 1–2 větách
- [ ] Sekce „Co se naučíte“ je přítomna
- [ ] Předpoklady v admonition
- [ ] Rychlá cesta TL;DR admonition nahoře
- [ ] Tabulky pro fáze, skills, agenty
- [ ] Sekce „Co jste dosáhli“ je přítomna
- [ ] Tabulka rychlého přehledu je přítomna
- [ ] Sekce častých otázek je přítomna
- [ ] Sekce získání pomoci je přítomna
- [ ] Klíčové poznatky admonition na konci

## Struktura praktického návodu

```text
1. Název + Háček (jedna věta: „Použijte workflow `X` k...“)
2. Kdy to použít (odrážkový seznam scénářů)
3. Kdy to přeskočit (volitelné)
4. Předpoklady (note admonition)
5. Kroky (číslované ### podsekce)
6. Co získáte (výstup/vytvořené artefakty)
7. Příklad (volitelné)
8. Tipy (volitelné)
9. Další kroky (volitelné)
```

### Kontrolní seznam praktického návodu

- [ ] Háček začíná „Použijte workflow `X` k...“
- [ ] „Kdy to použít“ má 3–5 odrážek
- [ ] Předpoklady jsou uvedeny
- [ ] Kroky jsou číslované `###` podsekce s akčními slovesy
- [ ] „Co získáte“ popisuje výstupní artefakty

## Struktura vysvětlení

### Typy

| Typ               | Příklad                       |
| ----------------- | ----------------------------- |
| **Úvodní stránka** | `core-concepts/index.md`     |
| **Koncept**       | `what-are-agents.md`          |
| **Funkce**        | `quick-dev.md`                |
| **Filosofie**     | `why-solutioning-matters.md`  |
| **FAQ**           | `established-projects-faq.md` |

### Obecná šablona

```text
1. Název + Háček (1–2 věty)
2. Přehled/Definice (co to je, proč je to důležité)
3. Klíčové koncepty (### podsekce)
4. Srovnávací tabulka (volitelné)
5. Kdy použít / Kdy nepoužít (volitelné)
6. Diagram (volitelné – mermaid, max 1 na dokument)
7. Další kroky (volitelné)
```

### Úvodní/Vstupní stránky

```text
1. Název + Háček (jedna věta)
2. Tabulka obsahu (odkazy s popisy)
3. Jak začít (číslovaný seznam)
4. Vyberte si svou cestu (volitelné – rozhodovací strom)
```

### Vysvětlení konceptů

```text
1. Název + Háček (co to je)
2. Typy/Kategorie (### podsekce) (volitelné)
3. Tabulka klíčových rozdílů
4. Komponenty/Části
5. Co byste měli použít?
6. Vytváření/Přizpůsobení (odkaz na praktické návody)
```

### Vysvětlení funkcí

```text
1. Název + Háček (co to dělá)
2. Rychlá fakta (volitelné – „Ideální pro:“, „Čas:“)
3. Kdy použít / Kdy nepoužít
4. Jak to funguje (mermaid diagram volitelné)
5. Klíčové výhody
6. Srovnávací tabulka (volitelné)
7. Kdy přejít na vyšší úroveň (volitelné)
```

### Dokumenty filosofie/zdůvodnění

```text
1. Název + Háček (princip)
2. Problém
3. Řešení
4. Klíčové principy (### podsekce)
5. Výhody
6. Kdy to platí
```

### Kontrolní seznam vysvětlení

- [ ] Háček uvádí, co dokument vysvětluje
- [ ] Obsah v přehledných `##` sekcích
- [ ] Srovnávací tabulky pro 3+ možností
- [ ] Diagramy mají jasné popisky
- [ ] Odkazy na praktické návody pro procedurální otázky
- [ ] Max 2–3 admonitions na dokument

## Struktura reference

### Typy

| Typ               | Příklad               |
| ----------------- | --------------------- |
| **Úvodní stránka** | `workflows/index.md` |
| **Katalog**       | `agents/index.md`     |
| **Hloubkový pohled** | `document-project.md` |
| **Konfigurace**   | `core-tasks.md`       |
| **Slovníček**     | `glossary/index.md`   |
| **Komplexní**     | `bmgd-workflows.md`   |

### Úvodní stránky reference

```text
1. Název + Háček (jedna věta)
2. Sekce obsahu (## pro každou kategorii)
   - Odrážkový seznam s odkazy a popisy
```

### Katalogová reference

```text
1. Název + Háček
2. Položky (## pro každou položku)
   - Stručný popis (jedna věta)
   - **Skills:** nebo **Klíčové info:** jako plochý seznam
3. Univerzální/Sdílené (## sekce) (volitelné)
```

### Hloubková reference položky

```text
1. Název + Háček (jedna věta účel)
2. Rychlá fakta (volitelné note admonition)
   - Modul, Skill, Vstup, Výstup jako seznam
3. Účel/Přehled (## sekce)
4. Jak vyvolat (blok kódu)
5. Klíčové sekce (## pro každý aspekt)
   - Použijte ### pro pod-možnosti
6. Poznámky/Upozornění (tip nebo caution admonition)
```

### Konfigurační reference

```text
1. Název + Háček
2. Obsah (odkazy pro skok, pokud 4+ položek)
3. Položky (## pro každou konfiguraci/úkol)
   - **Tučné shrnutí** — jedna věta
   - **Použijte když:** odrážkový seznam
   - **Jak to funguje:** číslované kroky (max 3–5)
   - **Výstup:** očekávaný výsledek (volitelné)
```

### Komplexní referenční průvodce

```text
1. Název + Háček
2. Přehled (## sekce)
   - Diagram nebo tabulka zobrazující organizaci
3. Hlavní sekce (## pro každou fázi/kategorii)
   - Položky (### pro každou položku)
   - Standardizovaná pole: Skill, Agent, Vstup, Výstup, Popis
4. Další kroky (volitelné)
```

### Kontrolní seznam reference

- [ ] Háček uvádí, co dokument referuje
- [ ] Struktura odpovídá typu reference
- [ ] Položky používají konzistentní strukturu
- [ ] Tabulky pro strukturovaná/srovnávací data
- [ ] Odkazy na dokumenty vysvětlení pro koncepční hloubku
- [ ] Max 1–2 admonitions

## Struktura slovníčku

Starlight generuje navigaci „Na této stránce“ z nadpisů na pravé straně:

- Kategorie jako `##` nadpisy — zobrazují se v pravé navigaci
- Termíny v tabulkách — kompaktní řádky, ne jednotlivé nadpisy
- Žádný inline TOC — pravý panel zajišťuje navigaci

### Formát tabulky

```md
## Název kategorie

| Termín       | Definice                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Agent**    | Specializovaná AI persona s konkrétní odborností, která provází uživatele pracovními postupy. |
| **Workflow** | Vícekrokový řízený proces, který orchestruje aktivity AI agentů k vytvoření výstupů.        |
```

### Pravidla definic

| Správně                        | Špatně                                       |
| ------------------------------ | -------------------------------------------- |
| Začněte tím, co to JE nebo DĚLÁ | Nezačínejte „Toto je...“ nebo „[Termín] je...“ |
| Držte se 1–2 vět              | Nepište víceodstavcová vysvětlení            |
| Tučný název termínu v buňce   | Nepoužívejte prostý text pro termíny         |

### Kontextové značky

Přidejte kurzívní kontext na začátek definice pro termíny s omezeným rozsahem:

- `*Pouze Quick Flow.*`
- `*BMad Method/Enterprise.*`
- `*Fáze N.*`
- `*BMGD.*`
- `*Existující projekty.*`

### Kontrolní seznam slovníčku

- [ ] Termíny v tabulkách, ne jako jednotlivé nadpisy
- [ ] Termíny abecedně seřazeny v kategoriích
- [ ] Definice 1–2 věty
- [ ] Kontextové značky kurzívou
- [ ] Názvy termínů tučně v buňkách
- [ ] Žádné definice „[Termín] je...“

## Sekce FAQ

```md
## Otázky

- [Potřebuji vždy architekturu?](#potřebuji-vždy-architekturu)
- [Mohu později změnit svůj plán?](#mohu-později-změnit-svůj-plán)

### Potřebuji vždy architekturu?

Pouze pro BMad Method a Enterprise. Quick Flow přeskakuje rovnou k implementaci.

### Mohu později změnit svůj plán?

Ano. SM agent má workflow `bmad-correct-course` pro řešení změn rozsahu.

**Máte otázku, na kterou jste zde nenašli odpověď?** [Vytvořte issue](...) nebo se zeptejte na [Discordu](...).
```

## Validační příkazy

Před odesláním změn dokumentace:

```bash
npm run docs:fix-links            # Náhled oprav formátu odkazů
npm run docs:fix-links -- --write # Aplikovat opravy
npm run docs:validate-links       # Kontrola existence odkazů
npm run docs:build                # Ověření bez chyb při sestavení
```
