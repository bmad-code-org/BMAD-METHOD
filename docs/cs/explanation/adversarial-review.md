---
title: "Adversariální revize"
description: Technika vynuceného uvažování, která zabraňuje líným „vypadá dobře“ revizím
sidebar:
  order: 5
---

Vynuťte hlubší analýzu tím, že budete vyžadovat nalezení problémů.

## Co je adversariální revize?

Technika revize, kde recenzent *musí* najít problémy. Žádné „vypadá dobře“ není povoleno. Recenzent zaujme cynický postoj — předpokládá, že problémy existují, a hledá je.

Nejde o negativismus. Jde o vynucení skutečné analýzy místo povrchního pohledu, který automaticky schválí cokoli, co bylo předloženo.

**Základní pravidlo:** Musíte najít problémy. Nulové nálezy spouštějí zastavení — analyzujte znovu nebo vysvětlete proč.

## Proč to funguje

Běžné revize trpí konfirmačním zkreslením. Proletíte práci, nic nevyskočí, schválíte to. Mandát „najít problémy“ tento vzor rozbíjí:

- **Vynucuje důkladnost** — Nemůžete schválit, dokud jste nehledali dostatečně pečlivě
- **Zachytí chybějící věci** — „Co zde není?“ se stává přirozenou otázkou
- **Zlepšuje kvalitu signálu** — Nálezy jsou konkrétní a akční, ne vágní obavy
- **Informační asymetrie** — Provádějte revize s čerstvým kontextem (bez přístupu k původnímu uvažování), abyste hodnotili artefakt, ne záměr

## Kde se používá

Adversariální revize se objevuje v celém BMad workflow — revize kódu, kontroly připravenosti implementace, validace specifikací a další. Někdy je to povinný krok, někdy volitelný (jako pokročilá elicitace nebo party mode). Vzor se přizpůsobí jakémukoli artefaktu, který potřebuje kontrolu.

## Vyžadováno lidské filtrování

Protože AI je *instruována* najít problémy, najde problémy — i když neexistují. Očekávejte falešné pozitivy: malichernosti převlečené za problémy, nepochopení záměru nebo přímo vymyšlené obavy.

**Vy rozhodujete, co je skutečné.** Zkontrolujte každý nález, odmítněte šum, opravte to, na čem záleží.

## Příklad

Místo:

> „Implementace autentizace vypadá rozumně. Schváleno.“

Adversariální revize produkuje:

> 1. **VYSOKÁ** — `login.ts:47` — Žádné omezení rychlosti neúspěšných pokusů
> 2. **VYSOKÁ** — Session token uložen v localStorage (zranitelný vůči XSS)
> 3. **STŘEDNÍ** — Validace hesla probíhá pouze na straně klienta
> 4. **STŘEDNÍ** — Žádné auditní logování neúspěšných pokusů o přihlášení
> 5. **NÍZKÁ** — Magické číslo `3600` by mělo být `SESSION_TIMEOUT_SECONDS`

První revize mohla přehlédnout bezpečnostní zranitelnost. Druhá zachytila čtyři.

## Iterace a klesající výnosy

Po řešení nálezů zvažte opětovné spuštění. Druhý průchod obvykle zachytí více. Třetí také není vždy zbytečný. Ale každý průchod zabere čas a nakonec dosáhnete klesajících výnosů — jen malichernosti a falešné nálezy.

:::tip[Lepší revize]
Předpokládejte, že problémy existují. Hledejte, co chybí, ne jen co je špatně.
:::
