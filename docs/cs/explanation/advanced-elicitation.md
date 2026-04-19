---
title: "Pokročilá elicitace"
description: Přimějte LLM přehodnotit svou práci pomocí strukturovaných metod uvažování
sidebar:
  order: 6
---

Přimějte LLM přehodnotit, co právě vygeneroval. Vyberete metodu uvažování, LLM ji aplikuje na svůj vlastní výstup, a vy rozhodnete, zda si vylepšení ponecháte.

## Co je pokročilá elicitace?

Strukturovaný druhý průchod. Místo žádání AI, aby „to zkusila znovu“ nebo „to zlepšila“, vyberete specifickou metodu uvažování a AI přezkoumá svůj vlastní výstup přes tento objektiv.

Rozdíl je podstatný. Vágní požadavky produkují vágní revize. Pojmenovaná metoda vynucuje konkrétní úhel útoku, odhaluje postřehy, které by generický pokus přehlédl.

## Kdy ji použít

- Poté, co workflow vygeneruje obsah a chcete alternativy
- Když výstup vypadá v pořádku, ale tušíte, že je v něm víc hloubky
- K zátěžovému testování předpokladů nebo nalezení slabých míst
- Pro důležitý obsah, kde přehodnocení pomáhá

Workflow nabízejí pokročilou elicitaci v rozhodovacích bodech — poté, co LLM něco vygeneruje, budete dotázáni, zda ji chcete spustit.

## Jak to funguje

1. LLM navrhne 5 relevantních metod pro váš obsah
2. Vyberete jednu (nebo zamícháte pro jiné možnosti)
3. Metoda je aplikována, vylepšení zobrazena
4. Přijměte nebo zahoďte, opakujte nebo pokračujte

## Vestavěné metody

K dispozici jsou desítky metod uvažování. Několik příkladů:

- **Pre-mortem analýza** — Předpokládejte, že projekt už selhal, a zpětně hledejte proč
- **Myšlení z prvních principů** — Odstraňte předpoklady, znovu postavte od základní pravdy
- **Inverze** — Zeptejte se, jak zaručit selhání, a poté se tomu vyhněte
- **Red Team vs Blue Team** — Napadněte vlastní práci, pak ji braňte
- **Sokratovské dotazování** — Zpochybněte každé tvrzení otázkou „proč?“ a „jak víte?“
- **Odstranění omezení** — Odstraňte všechna omezení, podívejte se, co se změní, selektivně je přidejte zpět
- **Mapování zainteresovaných stran** — Přehodnoťte z perspektivy každé zainteresované strany
- **Analogické uvažování** — Najděte paralely v jiných oblastech a aplikujte jejich lekce

A mnoho dalších. AI vybírá nejrelevantnější možnosti pro váš obsah — vy si vyberete, kterou spustit.

:::tip[Začněte zde]
Pre-mortem analýza je dobrá první volba pro jakoukoli specifikaci nebo plán. Konzistentně nachází mezery, které standardní revize přehlédne.
:::
