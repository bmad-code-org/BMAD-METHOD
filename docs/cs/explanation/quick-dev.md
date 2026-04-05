---
title: "Quick Dev"
description: Snižte tření human-in-the-loop bez ztráty kontrolních bodů chránících kvalitu výstupu
sidebar:
  order: 2
---

Záměr na vstupu, změny kódu na výstupu, s co nejmenším počtem human-in-the-loop kroků — bez obětování kvality.

Umožňuje modelu běžet déle mezi kontrolními body a poté přivede člověka zpět pouze tehdy, když úkol nemůže bezpečně pokračovat bez lidského úsudku nebo když je čas zkontrolovat konečný výsledek.

![Diagram workflow Quick Dev](/diagrams/quick-dev-diagram.png)

## Proč to existuje

Human-in-the-loop kroky jsou nutné a nákladné.

Současné LLM stále selhávají předvídatelnými způsoby: chybně čtou záměr, vyplňují mezery sebevědomými odhady, odchylují se k nesouvisející práci a generují šumový výstup revize. Současně neustálá lidská intervence limituje rychlost vývoje. Lidská pozornost je úzké hrdlo.

`bmad-quick-dev` přenastavuje tento kompromis. Důvěřuje modelu, aby běžel bez dozoru delší úseky, ale pouze poté, co workflow vytvořil dostatečně silnou hranici, aby to bylo bezpečné.

## Základní design

### 1. Nejprve komprimujte záměr

Workflow začíná tím, že člověk a model zkomprimují požadavek do jednoho koherentního cíle. Vstup může začínat jako hrubé vyjádření záměru, ale předtím, než workflow poběží autonomně, musí být dostatečně malý, jasný a bez protimluvů pro provedení.

Záměr může přijít v mnoha formách: pár frází, odkaz na bug tracker, výstup z plan mode, text zkopírovaný z chatové relace, nebo dokonce číslo story z BMAD vlastního `epics.md`. V posledním případě workflow nepochopí sémantiku sledování stories BMAD, ale stále může vzít samotnou story a pracovat s ní.

Tento workflow neodstraňuje lidskou kontrolu. Přemisťuje ji na malý počet vysoce hodnotných momentů:

- **Vyjasnění záměru** — přeměna nepřehledného požadavku na jeden koherentní cíl bez skrytých protimluvů
- **Schválení specifikace** — potvrzení, že zmrazené porozumění je správná věc k budování
- **Revize konečného produktu** — primární kontrolní bod, kde člověk rozhoduje, zda je výsledek přijatelný

### 2. Nasměrujte na nejmenší bezpečnou cestu

Jakmile je cíl jasný, workflow rozhodne, zda jde o skutečnou jednorázovou změnu nebo zda potřebuje plnější cestu. Malé změny s nulovým blast-radius mohou jít přímo k implementaci. Vše ostatní prochází plánováním, aby model měl silnější hranici před tím, než poběží déle samostatně.

### 3. Běžte déle s menším dozorem

Po tomto rozhodnutí o směrování může model nést více práce samostatně. Na plnější cestě se schválená specifikace stává hranicí, proti které model provádí s menším dozorem, což je celý smysl designu.

### 4. Diagnostikujte selhání na správné vrstvě

Pokud je implementace špatná, protože byl špatný záměr, oprava kódu je špatná oprava. Pokud je kód špatný, protože specifikace byla slabá, oprava diffu je také špatná oprava. Workflow je navržen tak, aby diagnostikoval, kde selhání vstoupilo do systému, vrátil se na tu vrstvu a přegeneroval odtamtud.

Nálezy revize se používají k rozhodnutí, zda problém pochází ze záměru, generování specifikace nebo lokální implementace. Pouze skutečně lokální problémy se opravují lokálně.

### 5. Přiveďte člověka zpět pouze když je potřeba

Interview o záměru je human-in-the-loop, ale není to stejný druh přerušení jako opakující se kontrolní bod. Workflow se snaží udržet tyto opakující se kontrolní body na minimu. Po úvodním formování záměru se člověk vrací hlavně tehdy, když workflow nemůže bezpečně pokračovat bez úsudku a na konci, když je čas zkontrolovat výsledek.

- **Řešení mezer v záměru** — vstoupení zpět, když revize prokáže, že workflow nemohl bezpečně odvodit, co bylo myšleno

Vše ostatní je kandidátem na delší autonomní provádění. Tento kompromis je záměrný. Starší vzory věnují více lidské pozornosti nepřetržitému dozoru. Quick Dev věnuje více důvěry modelu, ale šetří lidskou pozornost pro momenty, kde má lidské uvažování nejvyšší páku.

## Proč systém revize záleží

Fáze revize není jen pro hledání chyb. Je tu pro směrování korekce bez ničení momentum.

Tento workflow funguje nejlépe na platformě, která může spouštět sub-agenty, nebo alespoň vyvolat jiné LLM přes příkazovou řádku a čekat na výsledek. Pokud to vaše platforma nativně nepodporuje, můžete přidat skill, který to udělá. Bezcontextové sub-agenty jsou základním kamenem designu revize.

Agentní revize často selhávají dvěma způsoby:

- Generují příliš mnoho nálezů, čímž nutí člověka prosévat šum.
- Vychýlí aktuální změnu odhalením nesouvisejících problémů a přemění každý běh na ad-hoc úklidový projekt.

Quick Dev řeší obojí tím, že s revizí zachází jako s triáží.

Některé nálezy patří k aktuální změně. Některé ne. Pokud je nález náhodný spíše než kauzálně vázaný na aktuální práci, workflow ho může odložit místo nucení člověka ho okamžitě řešit. To udržuje běh zaměřený a zabraňuje náhodným tangentám ve spotřebování rozpočtu pozornosti.

Ta triáž bude někdy nedokonalá. To je přijatelné. Obvykle je lepší špatně posoudit některé nálezy než zaplavit člověka tisíci nízkohodnotných revizních komentářů. Systém optimalizuje pro kvalitu signálu, ne vyčerpávající recall.
