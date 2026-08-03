---
title: "Adversariální revize"
description: Vynucený seznam nálezů místo líného „vypadá dobře“
sidebar:
  order: 7
---

Vynuťte hlubší analýzu povinností najít skutečné problémy — ne cynickou personou.

## Co je adversariální revize?

Technika, kde recenzent musí produkovat nálezy. „Vypadá dobře“ s prázdným seznamem není dovoleno.

Mechanismus je **spodní hranice nálezů** (alespoň deset věcí k opravě nebo zlepšení) a explicitní tlak hledat **co chybí**, nejen co je špatně. Pokud je obsah prázdný, zastavte se. Pokud je seznam prázdný, zkontrolujte znovu — nekončete s ničím.

Nejde o hostilitu. Starší prompty používaly unavenou personu; na dnešních modelech to nemění, co se najde. Stále platí povinnost hledat dál a preferovat opomenutí před zběžným průchodem.

## Proč to funguje

Běžné revize trpí konfirmačním biasem. Přelétnete práci, nic nevyskočí, schválíte. Hranice to láme:

- **Nutí důkladnost** — nelze skončit, dokud není dost konkrétních nálezů
- **Chytá chybějící věci** — „co tu není?“ je součást práce
- **Krmí triage, ne uživatele přímo** — v build a code-review rodičovská session filtruje šum; lovec má recall, ne finální verdikt
- **Informační asymetrie** — lovci často běží s čerstvým kontextem změny

## Kde se používá

- **bmad-build / bmad-build-auto / bmad-code-review** — vrstva Blind Hunter: krátký inline prompt, obsah pod `CONTENT:`, paralelně s dalšími vrstvami, pak triage
- **bmad-review** — adversariální čočka v multi-lens revizi (stejná metoda; kanonická pole nálezů pro sloučení)

## Filtrování člověkem (nebo rodičem)

Protože model má naplnit seznam, vyprodukuje i tenké, starší nebo chybné body. Falešné pozitivy se očekávají.

**Triage rozhoduje, co je skutečné.** V agentních tocích to je rodičovský workflow. V samostatné revizi jste to vy.

## Příklad

Místo:

> „Implementace autentizace vypadá rozumně. Schváleno.“

Adversariální průchod vyprodukuje seznam, např.:

> 1. `login.ts:47` — žádný rate limiting při neúspěšných pokusech  
> … (alespoň deset konkrétních bodů)

## Iterace a klesající výnosy

Po opravách další průchod ještě pomůže. Každý průchod stojí čas; nakonec zbývají jen nitky a falešné nálezy. Downstream triage a rozpočet smyček (v build) brání nekonečnému běhu.

:::tip[Lepší revize]
Hledejte, co chybí, nejen co je špatně. Hledejte, dokud je seznam skutečný — pak ho ať triage zkrátí.
:::
