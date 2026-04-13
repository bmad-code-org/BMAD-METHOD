---
title: "Party Mode"
description: Spolupráce více agentů — všichni vaši AI agenti v jedné konverzaci
sidebar:
  order: 7
---

Všichni vaši AI agenti v jedné konverzaci.

## Co je Party Mode?

Spusťte `bmad-party-mode` a máte celý svůj AI tým v jedné místnosti — PM, Architect, Dev, UX Designer, kohokoli potřebujete. BMad Master orchestruje, vybírá relevantní agenty pro každou zprávu. Agenti odpovídají v charakteru, souhlasí, nesouhlasí a staví na nápadech ostatních.

Konverzace pokračuje tak dlouho, jak chcete. Ptejte se na doplňující otázky, oponujte odpovědím, přesměrujte diskuzi — je to skutečná výměna s vašimi agenty, dokud neskončíte.

**Ideální pro:**

- Velká rozhodnutí s kompromisy
- Brainstormingová sezení
- Post-mortemy, když se něco pokazí
- Retrospektivy a plánování sprintů

## Příklady

### Kritika špatné architektury

**Vy:** „Dobře, týme, náš poslední sprint byl katastrofa. Autentizační služba spadla třikrát. Kdo to pokazil?“

**Architect:** „Design byl v pořádku — distribuovaná autentizace se správnými záložními řešeními. Pokud se implementace odchýlila od specifikace...“

**Dev:** „Následoval jsem architektonický dokument přesně. Specifikace nepočítala s race conditions při souběžné invalidaci relací.“

**PM:** „Oba jste přehlédli větší problém — nevalidovali jsme požadavky na správu relací v PRD. Tohle je na mně, že jsem to nezachytil.“

**TEA:** „A já to měl zachytit v integračních testech. Testovací scénáře nepokrývaly souběžnou invalidaci.“

### Kreativní brainstorming

**Vy:** „Jak udělat onboarding magický místo nudného?“

**UX Designer:** „Začněte s progresivním odhalováním — odhalujte funkce, jak je uživatelé potřebují, ne všechny najednou v tutoriálu.“

**Storyteller:** „Co kdyby onboarding byl příběh? Každý krok odhaluje cestu postavy — uživatel JE hrdina.“

**Game Designer:** „Navazuji na to — co kdyby první ‚quest' vlastně řešil skutečný problém uživatele? Učí se tím, že dělají něco hodnotného.“

### Technické rozhodnutí

**Vy:** „Monolit nebo mikroslužby pro MVP?“

**Architect:** „Začněte monolitem. Mikroslužby přidávají složitost, kterou při 1000 uživatelích nepotřebujete.“

**PM:** „Souhlasím. Čas na trh je důležitější než teoretická škálovatelnost.“

**Dev:** „Monolit s jasnými hranicemi modulů. Služby můžeme extrahovat později, pokud bude potřeba.“

:::tip[Lepší rozhodnutí]
Lepší rozhodnutí prostřednictvím různorodých perspektiv. Vítejte v party mode.
:::
