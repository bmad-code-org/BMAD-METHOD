---
title: "Fáze analýzy: od nápadu k základům"
description: Co je brainstorming, výzkum, product brief a PRFAQ — a kdy který nástroj použít
sidebar:
  order: 1
---

Fáze analýzy (fáze 1) vám pomůže jasně si promyslet váš produkt, než se pustíte do jeho tvorby. Každý nástroj v této fázi je volitelný, ale úplné vynechání analýzy znamená, že váš PRD je postaven na předpokladech namísto vhledu.

## Proč analýza před plánováním?

PRD odpovídá na otázku „Co bychom měli postavit a proč?“. Pokud jej nakrmíte vágním myšlením, získáte vágní PRD — a každý navazující dokument tuto vágnost zdědí. Architektura postavená na slabém PRD sází na špatnou techniku. Příběhy odvozené ze slabé architektury opomíjejí okrajové případy. Náklady se zvyšují.

Existují analytické nástroje, které vám PRD zostří. Napadají problém z různých úhlů — kreativní průzkum, realita trhu, jasnost zákazníka, proveditelnost — takže v době, kdy sedíte s agentem PM, víte, co a pro koho stavíte.

## Nástroje

### Brainstorming

**Co to je.** Zprostředkované tvůrčí sezení s využitím osvědčených technik generování nápadů. AI funguje jako kouč, který z vás tahá nápady prostřednictvím strukturovaných cvičení — negeneruje nápady za vás.

**Proč je to tady.** Neotřelé nápady potřebují prostor pro rozvoj, než se zakotví v požadavcích. Brainstorming tento prostor vytváří. Je cenný zejména tehdy, když máte problémovou oblast, ale nemáte jasné řešení, nebo když chcete prozkoumat více směrů, než se k něčemu zavážete.

**Kdy jej použít.** Máte nejasnou představu o tom, co chcete vytvořit, ale nemáte vykrystalizovaný koncept. Nebo máte koncept, ale chcete ho otestovat pod tlakem oproti alternativám.

Viz [Brainstorming](./brainstorming.md), kde se dozvíte, jak relace fungují.

### Výzkum (trhu, domény, technický)

**Co to je.** Tři cílené pracovní postupy výzkumu, které zkoumají různé rozměry vašeho nápadu. Výzkum trhu zkoumá konkurenci, trendy a nálady uživatelů. Doménový výzkum vytváří odborné znalosti v daném oboru a terminologii. Technický výzkum hodnotí proveditelnost, možnosti architektury a přístupy k implementaci.

**Proč je to tady.** Stavět na předpokladech je nejrychlejší způsob, jak vytvořit něco, co nikdo nepotřebuje. Výzkum zakládá váš koncept na realitě — co již existuje u konkurence, s čím uživatelé skutečně bojují, co je technicky proveditelné a jakým omezením specifickým pro dané odvětví budete čelit.

**Kdy ho použít.** Vstupujete do neznámé oblasti, tušíte, že konkurence existuje, ale nemáte ji zmapovanou, nebo váš koncept závisí na technických možnostech, které nemáte ověřené. Proveďte jeden, dva nebo všechny tři — každý z nich je samostatný.

### Product Brief

**Co to je.** Řízené zjišťovací sezení, jehož výsledkem je 1–2stránkové shrnutí vašeho konceptu produktu. AI funguje jako spolupracující obchodní analytik, který vám pomůže formulovat vizi, cílovou skupinu, nabídku hodnoty a rozsah.

**Proč tu je.** Produktový brief je jemnější cestou k plánování. Zachycuje vaši strategickou vizi ve strukturovaném formátu, který se přímo promítá do tvorby PRD. Nejlépe funguje, když jste již o svém konceptu přesvědčeni — znáte zákazníka, problém a zhruba víte, co chcete vytvořit. Brief tyto úvahy uspořádá a vyostří.

**Kdy jej použít.** Váš koncept je relativně jasný a chcete jej efektivně zdokumentovat ještě před vytvořením PRD. Jste si jisti svým směřováním a nepotřebujete své předpoklady agresivně zpochybňovat.

### PRFAQ (Working Backwards)

**Co to je.** Metodika Working Backwards společnosti Amazon upravená jako interaktivní výzva. Napíšete tiskovou zprávu oznamující váš hotový produkt dříve, než existuje jediný řádek kódu, a pak odpovíte na nejtěžší otázky, které by vám zákazníci a zainteresované strany položili. Umělá inteligence funguje jako neúprosný, ale konstruktivní produktový kouč.

**Proč je to tady.** PRFAQ je přísná cesta k plánování. Vynucuje si jasnost v zájmu zákazníka tím, že vás nutí obhájit každé tvrzení. Pokud nedokážete napsat přesvědčivou tiskovou zprávu, produkt není připraven. Pokud odpovědi na časté dotazy zákazníků odhalí nedostatky, jsou to nedostatky, které byste objevili mnohem později — a nákladněji — při implementaci. Hozená rukavice odhalí slabé myšlení v rané fázi, kdy je nejlevnější ho opravit.

**Kdy ji použít.** Před vyčleněním zdrojů chcete, aby váš koncept prošel zátěžovým testem. Nejste si jisti, zda to uživatele bude skutečně zajímat. Chcete si ověřit, že dokážete formulovat jasnou a obhajitelnou nabídku hodnoty. Nebo si prostě chcete disciplínou Working Backwards zpřesnit své myšlení.

## Který nástroj bych měl použít?

| Situace | Doporučený nástroj |
| --------- | ---------------- |
| „Mám nejasný nápad, ale nevím, kde začít“ | Brainstorming |
| „Než se rozhodnu, potřebuji pochopit trh“ | Výzkum |
| „Vím, co chci vytvořit, jen to potřebuji zdokumentovat“ | Product Brief |
| „Chci se ujistit, že tento nápad skutečně stojí za vybudování“ | PRFAQ |
| „Chci prozkoumat, pak ověřit a pak zdokumentovat“ | Brainstorming → Výzkum → PRFAQ nebo Brief |

Product Brief i PRFAQ jsou vstupem pro PRD — vyberte si jeden z nich podle toho, jak moc chcete být nároční. Brief je společným objevováním. PRFAQ je hozená rukavice. Obojí vás dovede ke stejnému cíli; PRFAQ testuje, zda si váš koncept zaslouží se tam dostat.

:::tip[Nejste si jisti?]
Spusťte `bmad-help` a popište svou situaci. Doporučí vám správný výchozí bod na základě toho, co jste již udělali a čeho se snažíte dosáhnout.
:::

## Co se stane po analýze?

Výstupy analýzy se přímo promítají do fáze 2 (plánování). Pracovní postup PRD přijímá jako vstupy produktové briefy, dokumenty PRFAQ, výsledky výzkumu a zprávy z brainstormingu — syntetizuje vše, co jste vytvořili, do strukturovaných požadavků. Čím více analýz provedete, tím ostřejší bude vaše PRD.
