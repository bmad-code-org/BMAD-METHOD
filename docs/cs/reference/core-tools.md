---
title: Základní nástroje
description: Reference vestavěných skills základního modulu.
sidebar:
  order: 3
---

Každá instalace BMad zahrnuje **základní modul** — malou sadu skills, které fungují napříč všemi projekty, všemi moduly a všemi fázemi. Tato stránka pokrývá těchto osm základních skills: pět jádrových nástrojů plus tři **myšlenkové skills** (brainstorming, forge idea, party mode).

:::tip[Rychlá cesta]
Spusťte jakýkoli nástroj zadáním jeho názvu skillu (např. `bmad-help`) ve vašem IDE. Nevyžaduje relaci agenta.
:::

## Přehled

**Základní modul (vždy nainstalován):**

| Nástroj | Účel |
| --- | --- |
| [`bmad-help`](#bmad-help) | Kontextové poradenství, co dělat dál |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Iterativní zdokonalování LLM výstupu |
| [`bmad-editorial-review`](#bmad-editorial-review) | Dvoufázová redakční revize — nejprve struktura, pak text |
| [`bmad-review`](#bmad-review) | Kritická revize z více perspektiv — adversariální, hraniční případy a mezery ve verifikaci |
| [`bmad-customize`](#bmad-customize) | Vytváření a ověřování přizpůsobení BMad |

**Myšlenkové skills:**

| Nástroj | Účel |
| --- | --- |
| [`bmad-brainstorming`](#bmad-brainstorming) | Facilitace interaktivních brainstormingových sezení |
| [`bmad-forge-idea`](#bmad-forge-idea) | Zátěžový test nápadu, dokud se nezpevní, nepotvrdí, nebo levně nezemře |
| [`bmad-party-mode`](#bmad-party-mode) | Orchestrace skupinových diskuzí více agentů |

:::note[Přesunuto a odstraněno]
`bmad-spec` se nyní dodává s modulem BMM jako plánovací workflow Fáze 2 — viz [Mapa workflow](./workflow-map.md). Utility `bmad-shard-doc` a `bmad-index-docs` byly odstraněny. Dřívější skills `bmad-editorial-review-prose`, `bmad-editorial-review-structure`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter` a `bmad-review-verification-gap` jsou sloučeny do `bmad-editorial-review` a `bmad-review`; staré identifikátory se stále rozliší přes skryté přesměrování kvůli kompatibilitě.
:::

## bmad-help

**Váš inteligentní průvodce tím, co přijde dál.** — Zkoumá stav vašeho projektu, detekuje, co bylo uděláno, a doporučuje další povinný nebo volitelný krok.

**Použijte když:**

- Dokončili jste workflow a chcete vědět, co dál
- Jste noví v BMad a potřebujete orientaci
- Jste uvízlí a chcete kontextovou radu
- Nainstalovali jste nové moduly a chcete vidět, co je dostupné

**Jak to funguje:**

1. Skenuje projekt pro existující artefakty (PRD, architektura, stories atd.)
2. Detekuje nainstalované moduly a dostupné workflow
3. Doporučuje další kroky v pořadí priority — nejprve povinné, pak volitelné
4. Prezentuje každé doporučení s příkazem skillu a stručným popisem

**Vstup:** Volitelný dotaz v přirozeném jazyce (např. `bmad-help I have a SaaS idea, where do I start?`)

**Výstup:** Prioritizovaný seznam doporučených dalších kroků s příkazy skills

## bmad-advanced-elicitation

**Přiměje LLM přehodnotit, zdokonalit a vylepšit svůj nedávný výstup.** — Sdílený zdokonalovací checkpoint BMad: ostatní skills jej vyvolávají při přirozených pauzách a vy jej můžete zavolat přímo na cokoli nedávného v konverzaci.

**Použijte když:**

- LLM výstup působí povrchně nebo genericky
- Chcete prozkoumat téma z více analytických úhlů
- Zdokonalujete kritický dokument a chcete hlubší myšlení
- Chcete známou metodu jménem — sokratovská, první principy, pre-mortem, red team

**Jak to funguje:**

1. Cílí na nejnovější výstup v konverzaci, pokud jej nenasměrujete jinam
2. Nabídne krátké menu elicitačních metod nejlépe odpovídajících obsahu
3. Aplikuje zvolené metody na cíl
4. Vrátí vylepšenou verzi, aby vyvolávající tok pokračoval tam, kde se zastavil

**Vstup:** Nedávný výstup ke zdokonalení (výchozí), nebo jakýkoli obsah, na který ukážete; volitelně pojmenovaná metoda

**Výstup:** Vylepšená verze obsahu s aplikovanými zlepšeními

## bmad-editorial-review

**Dvoufázová redakční revize — nejprve struktura, pak text.** — Klinický editor, který reviduje tvar dokumentu i jeho věty a vrací navrhované opravy, jež řádek po řádku přijímáte nebo odmítáte. Obsah je nedotknutelný: nikdy nezpochybňuje vaše myšlenky, jen jejich organizaci a vyjádření.

**Použijte když:**

- Napsali jste dokument a chcete jej zpřísnit a vyladit
- Dokument vznikl z více podprocesů a potřebuje strukturální soudržnost
- Chcete zkrátit délku při zachování srozumitelnosti
- Potřebujete opravy srozumitelnosti bez stylistických zásahů

**Jak to funguje:**

1. **Strukturální fáze** — navrhuje škrty, sloučení, přesuny a zhuštění; ptá se, zda tvar dokumentu slouží jeho účelu
2. **Textová fáze** — koriguje komunikační problémy bránící porozumění, s Microsoft Writing Style Guide jako výchozí baseline (dodaný průvodce stylem má přednost)
3. Ve výchozím stavu běží obě fáze, nejprve struktura; požádejte o revizi jen struktury nebo jen textu, chcete-li spustit jednu
4. Navrhuje, nikdy neprovádí — o přijetí rozhoduje autor

**Vstup:**

- `content` (povinné) — Dokument k revizi
- `style_guide` (volitelné) — Projektově specifický průvodce stylem
- `reader_type` (volitelné) — `humans` (výchozí) pro srozumitelnost/plynulost, nebo `llm` pro přesnost/konzistenci
- `purpose` / `target_audience` / `length_target` (volitelné) — kalibrují strukturální fázi

**Výstup:** Tabulka nálezů s navrhovanými opravami, plus odhad zkrácení při navržených strukturálních změnách

## bmad-review

**Kritická revize z více perspektiv nad jakýmkoli diffem, dokumentem nebo artefaktem.** — Spouští nezávislé revizní perspektivy — každou s vlastní metodou a postojem — a hlásí každý nález v jednom kanonickém tvaru. Nula nálezů je platný výsledek; nikdy nedoplňuje, aby vypadal důkladně.

**Dodávané perspektivy:**

| Perspektiva | Metoda |
| --- | --- |
| **Adversariální** | Skeptická revize předpokládající existenci problémů — hledá, co chybí, ne jen co je špatně |
| **Hraniční případy** | Projde každou větvící se cestu a hraniční podmínku, hlásí pouze neošetřené cesty |
| **Mezery ve verifikaci** | Hledá změněné chování, které by mohlo regredovat, aniž by to spolehlivá verifikace zachytila |

**Použijte když:**

- Potřebujete zajištění kvality před finalizací výstupu
- Chcete vyčerpávající pokrytí hraničních případů kódu nebo logiky
- Chcete vědět, zda je změna dostatečně ověřena
- Chcete všechny tři perspektivy najednou (výchozí chování)

**Jak to funguje:**

1. Načte obsah a identifikuje jeho typ — diff, soubor, funkce nebo dokument
2. Vybere perspektivy: ty, které pojmenujete, nebo každou povolenou perspektivu odpovídající obsahu
3. Spustí každou perspektivu nezávisle — paralelně přes subagenty, pokud to platforma podporuje
4. Sestaví jeden seznam nálezů; překryv mezi perspektivami je signál, ne duplikace

**Vstup:**

- `content` (povinné) — Diff, větev, nezakomitované změny, soubor, specifikace, story nebo jakýkoli dokument
- `lenses` (volitelné) — jeden nebo více kódů či názvů perspektiv; výchozí je plná revize
- `also_consider` (volitelné) — Další oblasti k zvážení

**Výstup:** JSON pole nálezů a/nebo markdown report seskupený podle perspektiv. Vlastní perspektivy lze přidat — a dodávané doladit či vypnout — přes `customize.toml` skillu

## bmad-customize

**Vytváření a ověřování přizpůsobení.** — Pomůže vám změnit chování nainstalovaného BMad agenta nebo workflow bez ručního psaní TOML.

**Použijte když:**

- Chcete změnit chování agenta nebo workflow
- Potřebujete přidat trvalé fakty, aktivační hooky nebo vlastní položky menu
- Chcete, aby byl správný rozsah přepisu vybrán a ověřen automaticky

**Jak to funguje:**

1. Skenuje nainstalované BMad skills pro přizpůsobitelné plochy
2. Vybere správný rozsah pro požadovanou změnu
3. Zapíše přepisové soubory pod `_bmad/custom/`
4. Ověří sloučenou konfiguraci

**Vstup:** Popis požadovaného přizpůsobení v přirozeném jazyce

**Výstup:** TOML přepisové soubory pod `_bmad/custom/`. Podrobný návod viz [Jak přizpůsobit BMad](../how-to/customize-bmad.md)

## Myšlenkové skills

Tři skills níže doplňují základní modul — obecné myšlenkové nástroje, o které se může opřít kterákoli fáze či modul.

### bmad-brainstorming

**Generování různorodých nápadů prostřednictvím interaktivních kreativních technik.** — Facilitované brainstormingové sezení, které načítá osvědčené ideační metody z knihovny technik a vede vás k 100+ nápadům před organizací.

**Použijte když:**

- Začínáte nový projekt a potřebujete prozkoumat problémový prostor
- Jste uvízlí s generováním nápadů a potřebujete strukturovanou kreativitu
- Chcete použít osvědčené ideační frameworky (SCAMPER, reverzní brainstorming atd.)

**Jak to funguje:**

1. Nastaví brainstormingové sezení s vaším tématem
2. Načte kreativní techniky z knihovny metod
3. Provede vás technikou za technikou, generuje nápady
4. Aplikuje anti-bias protokol — mění kreativní doménu každých 10 nápadů

**Vstup:** Téma brainstormingu nebo formulace problému, volitelný kontextový soubor

**Výstup:** samostatný `brainstorm.html` jako památka na sezení, volitelný `brainstorm-intent.md` pro navazující skills a záznam sezení `.memlog.md`

:::note[Cíl množství]
Kouzlo se děje v nápadech 50–100. Workflow povzbuzuje generování 100+ nápadů před organizací.
:::

### bmad-forge-idea

**Zátěžový test nápadu, dokud se nezpevní, nepotvrdí, nebo levně nezemře.** — Adversariální tazatel žene napůl zformovaný nápad otázku po otázce, do každého větvení přivádí dvě postavy, dokud to, co přežije, není něco, na čem můžete s přesvědčením stavět.

**Použijte když:**

- Máte nápad a chcete jej otestovat, než do něj investujete
- Chcete upřímný pohled na to, zda jej zabít
- Potřebujete myšlenkového partnera, který se vzepře, místo aby souhlasil

**Jak to funguje:**

1. Předem stanoví cíl a podle něj směruje dotazování
2. Pracuje otázku po otázce v pořadí závislostí a předkládá doporučenou odpověď, proti které se lze vymezit
3. Do každého větvení přivádí dva hlasy — jeden z vaší nainstalované sestavy, jeden vyvolaný tématem
4. Zpochybňuje mlhavé pojmy a testuje tvrzení proti materiálu existujícího projektu
5. Končí jako Zpevněný, Zabitý nebo Jasnější, se samostatným reportem, který si můžete ponechat

**Vstup:** Nápad z jakékoli domény — funkce, byznys model, výzkumná hypotéza, životní rozhodnutí

**Výstup:** Destilát `forged-idea.md`, když se nápad zpevní (volitelné), plus `forge-report.html` z každého běhu

### bmad-party-mode

**Orchestrace skupinových diskuzí více agentů.** — Načte všechny nainstalované BMad agenty a facilituje přirozenou konverzaci, kde každý agent přispívá svou unikátní odborností a osobností.

**Použijte když:**

- Potřebujete více expertních perspektiv na rozhodnutí
- Chcete, aby agenti zpochybňovali předpoklady ostatních
- Zkoumáte složité téma překračující více domén

**Jak to funguje:**

1. Načte manifest agentů se všemi nainstalovanými osobnostmi
2. Analyzuje vaše téma a vybere 2–3 nejrelevantnější agenty
3. Agenti se střídají v přispívání, s přirozenou kříženou diskuzí a nesouhlasy
4. Rotuje účast agentů pro zajištění různorodých perspektiv
5. Ukončete pomocí `goodbye`, `end party` nebo `quit`

**Vstup:** Diskuzní téma nebo otázka, s volitelnou specifikací person

**Výstup:** Real-time multi-agentní konverzace s udržovanými osobnostmi agentů
