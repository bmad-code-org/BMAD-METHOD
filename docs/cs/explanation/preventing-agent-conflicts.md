---
title: "Předcházení konfliktům agentů"
description: Jak architektura zabraňuje konfliktům, když více agentů implementuje systém
sidebar:
  order: 4
---

Když více AI agentů implementuje různé části systému, mohou dělat protichůdná technická rozhodnutí. Dokumentace architektury tomu zabraňuje stanovením sdílených standardů.

## Běžné typy konfliktů

### Konflikty stylu API

Bez architektury:
- Agent A používá REST s `/users/{id}`
- Agent B používá GraphQL mutations
- Výsledek: Nekonzistentní vzory API, zmatení konzumenti

S architekturou:
- ADR specifikuje: „Použít GraphQL pro veškerou komunikaci klient-server“
- Všichni agenti dodržují stejný vzor

### Konflikty návrhu databáze

Bez architektury:
- Agent A používá snake_case pro názvy sloupců
- Agent B používá camelCase pro názvy sloupců
- Výsledek: Nekonzistentní schéma, matoucí dotazy

S architekturou:
- Dokument standardů specifikuje konvence pojmenování
- Všichni agenti dodržují stejné vzory

### Konflikty řízení stavu

Bez architektury:
- Agent A používá Redux pro globální stav
- Agent B používá React Context
- Výsledek: Více přístupů k řízení stavu, složitost

S architekturou:
- ADR specifikuje přístup k řízení stavu
- Všichni agenti implementují konzistentně

## Jak architektura zabraňuje konfliktům

### 1. Explicitní rozhodnutí skrze ADR

Každé významné technologické rozhodnutí je zdokumentováno s:
- Kontext (proč toto rozhodnutí záleží)
- Zvažované možnosti (jaké alternativy existují)
- Rozhodnutí (co jsme zvolili)
- Zdůvodnění (proč jsme to zvolili)
- Důsledky (přijaté kompromisy)

### 2. Specifické pokyny pro FR/NFR

Architektura mapuje každý funkční požadavek na technický přístup:
- FR-001: Správa uživatelů → GraphQL mutations
- FR-002: Mobilní aplikace → Optimalizované dotazy

### 3. Standardy a konvence

Explicitní dokumentace:
- Struktura adresářů
- Konvence pojmenování
- Organizace kódu
- Vzory testování

## Architektura jako sdílený kontext

Představte si architekturu jako sdílený kontext, který všichni agenti čtou před implementací:

```text
PRD: "Co budovat"
     ↓
Architektura: "Jak to budovat"
     ↓
Agent A čte architekturu → implementuje Epic 1
Agent B čte architekturu → implementuje Epic 2
Agent C čte architekturu → implementuje Epic 3
     ↓
Výsledek: Konzistentní implementace
```

## Klíčová témata ADR

Běžná rozhodnutí, která zabraňují konfliktům:

| Téma             | Příklad rozhodnutí                           |
| ---------------- | -------------------------------------------- |
| Styl API         | GraphQL vs REST vs gRPC                      |
| Databáze         | PostgreSQL vs MongoDB                        |
| Autentizace      | JWT vs Sessions                              |
| Řízení stavu     | Redux vs Context vs Zustand                  |
| Stylování        | CSS Modules vs Tailwind vs Styled Components |
| Testování        | Jest + Playwright vs Vitest + Cypress        |

## Anti-vzory, kterým se vyhnout

:::caution[Běžné chyby]
- **Implicitní rozhodnutí** — „Styl API vyřešíme průběžně“ vede k nekonzistenci
- **Nadměrná dokumentace** — Dokumentování každého drobného rozhodnutí způsobuje paralýzu analýzou
- **Zastaralá architektura** — Dokumenty napsané jednou a nikdy neaktualizované způsobují, že agenti následují zastaralé vzory
:::

:::tip[Správný přístup]
- Dokumentujte rozhodnutí, která přesahují hranice epiců
- Zaměřte se na oblasti náchylné ke konfliktům
- Aktualizujte architekturu, jak se učíte
- Použijte `bmad-correct-course` pro významné změny
:::
