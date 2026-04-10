---
title: "Fáze analýzy: od nápadu k základům"
description: Co je brainstorming, výzkum, product brief a PRFAQ — a kdy který nástroj použít
sidebar:
  order: 1
---

Fáze analýzy (fáze 1) vám pomůže jasně promyslet váš produkt, než se zavážete k jeho budování. Každý nástroj v této fázi je volitelný, ale pokud analýzu úplně vynecháte, váš PRD bude postavený na domněnkách místo na poznatcích.

## Proč analýza před plánováním?

PRD odpovídá na otázku „co bychom měli vybudovat a proč?". Když do něj vložíte vágní úvahy, dostanete vágní PRD — a každý následující dokument tu vágnost zdědí. Architektura postavená na slabém PRD udělá špatné technické sázky. Stories odvozené ze slabé architektury minou hraniční případy. Náklady se vrší.

Analytické nástroje existují proto, aby váš PRD byl ostrý. Útočí na problém z různých úhlů — kreativní průzkum, realita trhu, jasnost ohledně zákazníka, proveditelnost — takže když si sednete s PM agentem, víte, co stavíte a pro koho.

## Nástroje

### Brainstorming

**Co to je.** Facilitované kreativní sezení využívající osvědčené techniky ideace. AI působí jako kouč, který z vás tahá nápady prostřednictvím strukturovaných cvičení — negeneruje nápady za vás.

**Proč je tu.** Surové nápady potřebují prostor k rozvoji, než se uzamknou do požadavků. Brainstorming ten prostor vytváří. Je obzvlášť cenný, když máte problémovou doménu, ale žádné jasné řešení, nebo když chcete prozkoumat více směrů, než se zavážete.

**Kdy ho použít.** Máte mlhavou představu o tom, co chcete vybudovat, ale ještě jste ji nevykrystalizovali do konkrétního konceptu. Nebo máte koncept, ale chcete ho otestovat proti alternativám.

Viz [Brainstorming](./brainstorming.md) pro podrobnější pohled na průběh sezení.

### Výzkum (tržní, doménový, technický)

**Co to je.** Tři cílené výzkumné workflow zkoumající různé dimenze vašeho nápadu. Tržní výzkum prozkoumá konkurenci, trendy a nálady uživatelů. Doménový výzkum buduje odborné znalosti a terminologii. Technický výzkum hodnotí proveditelnost, architektonické možnosti a přístupy k implementaci.

**Proč je tu.** Budovat na domněnkách je nejrychlejší cesta k vytvoření něčeho, co nikdo nepotřebuje. Výzkum uzemní váš koncept v realitě — jací konkurenti už existují, s čím uživatelé skutečně bojují, co je technicky proveditelné a jaká specifická odvětvová omezení vás čekají.

**Kdy ho použít.** Vstupujete do neznámé domény, tušíte, že existují konkurenti, ale ještě jste je nezmapovali, nebo váš koncept závisí na technických schopnostech, které jste dosud neověřili. Spusťte jeden, dva nebo všechny tři — každý stojí samostatně.

### Product Brief

**Co to je.** Řízená discovery session, která vytvoří 1–2stránkový executive summary vašeho produktového konceptu. AI působí jako kolaborativní Business Analyst a pomáhá vám formulovat vizi, cílovou skupinu, hodnotovou nabídku a rozsah.

**Proč je tu.** Product brief je mírnější cesta do plánování. Zachytí vaši strategickou vizi ve strukturovaném formátu, který přímo vstupuje do tvorby PRD. Funguje nejlépe, když už jste si svým konceptem poměrně jistí — víte, kdo je zákazník, jaký je problém a přibližně co chcete vybudovat. Brief toto myšlení organizuje a zaostří.

**Kdy ho použít.** Váš koncept je poměrně jasný a chcete ho efektivně zdokumentovat před vytvořením PRD. Jste si jistí směrem a nepotřebujete, aby vaše předpoklady byly agresivně zpochybňovány.

### PRFAQ (Working Backwards)

**Co to je.** Metodologie Working Backwards od Amazonu adaptovaná jako interaktivní výzva. Napíšete tiskovou zprávu oznamující váš hotový produkt dříve, než existuje jediný řádek kódu, a pak odpovíte na nejtěžší otázky, které by zákazníci a stakeholdeři položili. AI působí jako neúnavný, ale konstruktivní produktový kouč.

**Proč je tu.** PRFAQ je náročnější cesta do plánování. Vynucuje si jasnost zaměřenou na zákazníka tím, že vás nutí obhájit každé tvrzení. Pokud nedokážete napsat přesvědčivou tiskovou zprávu, produkt není připravený. Pokud odpovědi na FAQ odhalí mezery, jsou to mezery, které byste jinak objevili mnohem později — a mnohem dráž — během implementace. Tato výzva odhalí slabé myšlení brzy, když je oprava nejlevnější.

**Kdy ho použít.** Chcete svůj koncept podrobit zátěžovému testu, než vynaložíte zdroje. Nejste si jistí, zda to uživatele skutečně bude zajímat. Chcete ověřit, že dokážete formulovat jasnou, obhajitelnou hodnotovou nabídku. Nebo prostě chcete disciplínu Working Backwards k zaostření svého myšlení.

## Který nástroj bych měl použít?

| Situace | Doporučený nástroj |
| --------- | ------------------ |
| „Mám vágní nápad, nevím kde začít" | Brainstorming |
| „Potřebuji pochopit trh, než se rozhodnu" | Výzkum |
| „Vím, co chci vybudovat, jen to potřebuji zdokumentovat" | Product Brief |
| „Chci se ujistit, že tento nápad skutečně stojí za budování" | PRFAQ |
| „Chci prozkoumat, pak ověřit, pak zdokumentovat" | Brainstorming → Výzkum → PRFAQ nebo Brief |

Product Brief a PRFAQ oba vytvářejí vstup pro PRD — vyberte si podle toho, jak velkou výzvu chcete. Brief je kolaborativní discovery. PRFAQ je náročný zátěžový test. Oba vás dovedou ke stejnému cíli; PRFAQ testuje, zda si váš koncept zaslouží tam dojít.

:::tip[Nejste si jistí?]
Spusťte `bmad-help` a popište svou situaci. Doporučí vám správný výchozí bod na základě toho, co jste už udělali a čeho chcete dosáhnout.
:::

## Co následuje po analýze?

Výstupy analýzy přímo vstupují do fáze 2 (plánování). Workflow tvorby PRD přijímá product briefy, PRFAQ dokumenty, výzkumná zjištění a záznamy z brainstormingu jako vstupy — syntetizuje vše, co jste vytvořili, do strukturovaných požadavků. Čím důkladnější analýzu provedete, tím ostřejší bude váš PRD.
