---
title: "Proč je solutioning důležitý"
description: Pochopení toho, proč je fáze solutioningu klíčová pro projekty s více epicy
sidebar:
  order: 3
---

Fáze 3 (Solutioning) překládá **co** budovat (z plánování) na **jak** to budovat (technický návrh). Tato fáze zabraňuje konfliktům agentů v projektech s více epicy tím, že dokumentuje architektonická rozhodnutí před zahájením implementace.

## Problém bez solutioningu

```text
Agent 1 implementuje Epic 1 pomocí REST API
Agent 2 implementuje Epic 2 pomocí GraphQL
Výsledek: Nekonzistentní design API, integrační noční můra
```

Když více agentů implementuje různé části systému bez sdíleného architektonického vedení, dělají nezávislá technická rozhodnutí, která si mohou odporovat.

## Řešení se solutioningem

```text
Architektonický workflow rozhodne: "Použít GraphQL pro všechna API"
Všichni agenti dodržují architektonická rozhodnutí
Výsledek: Konzistentní implementace, žádné konflikty
```

Explicitní dokumentací technických rozhodnutí všichni agenti implementují konzistentně a integrace se stává přímočarou.

## Solutioning vs. plánování

| Aspekt   | Plánování (Fáze 2)      | Solutioning (Fáze 3)             |
| -------- | ----------------------- | --------------------------------- |
| Otázka   | Co a proč?              | Jak? Pak jaké jednotky práce?     |
| Výstup   | FR/NFR (požadavky)      | Architektura + epicy/stories      |
| Agent    | PM                      | Architect → PM                    |
| Publikum | Zainteresované strany   | Vývojáři                          |
| Dokument | PRD (FR/NFR)            | Architektura + soubory epiců      |
| Úroveň   | Obchodní logika        | Technický design + rozklad práce  |

## Klíčový princip

**Učiňte technická rozhodnutí explicitní a zdokumentovaná**, aby všichni agenti implementovali konzistentně.

Toto zabraňuje:
- Konfliktům stylu API (REST vs GraphQL)
- Nekonzistencím v návrhu databáze
- Neshodám v řízení stavu
- Nesouladu konvencí pojmenování
- Variacím v bezpečnostním přístupu

## Kdy je solutioning vyžadován

| Cesta | Solutioning vyžadován? |
|-------|----------------------|
| Quick Flow | Ne — přeskočte úplně |
| BMad Method Simple | Volitelný |
| BMad Method Complex | Ano |
| Enterprise | Ano |

:::tip[Pravidlo palce]
Pokud máte více epiců, které by mohly být implementovány různými agenty, potřebujete solutioning.
:::

## Cena přeskočení

Přeskočení solutioningu u složitých projektů vede k:

- **Integračním problémům** objeveným uprostřed sprintu
- **Přepracování** kvůli konfliktním implementacím
- **Delšímu celkovému času vývoje**
- **Technickému dluhu** z nekonzistentních vzorů

:::caution[Multiplikátor nákladů]
Zachycení problémů se zarovnáním v solutioningu je 10× rychlejší než jejich objevení během implementace.
:::
