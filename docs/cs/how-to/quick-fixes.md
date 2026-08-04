---
title: "Rychlé opravy"
description: Jak provádět rychlé opravy a ad-hoc změny
sidebar:
  order: 4
---

Opravy chyb, refaktoringy a malé cílené změny mohou vstoupit do **Build** přímo s minimem upstream plánování. Jde o stejný implementační workflow jako pro plně naplánované stories.

## Kdy to použít

- Opravy chyb s jasnou, známou příčinou
- Malé refaktoringy (přejmenování, extrakce, restrukturalizace) omezené na několik souborů
- Drobné úpravy funkcí nebo změny konfigurace
- Aktualizace závislostí

:::note[Předpoklady]
- BMad Method nainstalován (`npx bmad-method install`)
- AI-powered IDE (Claude Code, Cursor nebo podobné)
:::

## Kroky

### 1. Začněte nový chat

Otevřete **novou chatovací relaci** ve vašem AI IDE. Opětovné použití relace z předchozího workflow může způsobit konflikty kontextu.

### 2. Zadejte svůj záměr

Build přijímá volně formulovaný záměr — před, s nebo po vyvolání. Příklady:

```text
run build — Fix the login validation bug that allows empty passwords.
```

```text
run build — fix https://github.com/org/repo/issues/42
```

```text
run build — implement the intent in _bmad-output/implementation-artifacts/my-intent.md
```

```text
I think the problem is in the auth middleware, it's not checking token expiry.
Let me look at it... yeah, src/auth/middleware.ts line 47 skips
the exp check entirely. run build
```

```text
run build
> What would you like to do?
Refactor UserService to use async/await instead of callbacks.
```

Prostý text, cesty k souborům, GitHub issue URL, odkazy na bug tracker — cokoli, co LLM dokáže převést na konkrétní záměr.

### 3. Odpovězte na otázky a schvalte

Build se může zeptat na upřesňující otázky nebo prezentovat krátkou specifikaci ke schválení před implementací. Odpovězte na otázky a schvalte, až budete s plánem spokojeni.

### 4. Zkontrolujte a pushněte

Build implementuje změnu, zreviduje svou práci, opraví problémy a commitne lokálně. Když je hotov, otevře dotčené soubory ve vašem editoru.

- Projděte diff a potvrďte, že změna odpovídá vašemu záměru
- Pokud něco nevypadá dobře, řekněte agentovi, co opravit — může iterovat ve stejné relaci

Až budete spokojeni, pushněte commit. Build nabídne push a vytvoření PR za vás.

:::caution[Pokud se něco rozbije]
Pokud pushnutá změna způsobí neočekávané problémy, použijte `git revert HEAD` pro čisté vrácení posledního commitu. Poté začněte nový chat a spusťte Build znovu s jiným přístupem.
:::

## Co získáte

- Upravené zdrojové soubory s aplikovanou opravou nebo refaktoringem
- Procházející testy (pokud má váš projekt testovací sadu)
- Commit připravený k pushnutí s konvenční commit zprávou

## Odložená práce

Build udržuje každý běh zaměřený na jeden cíl. Pokud váš požadavek obsahuje více nezávislých cílů, nebo pokud revize odhalí předchozí problémy nesouvisející s vaší změnou, Build je odloží do souboru (`deferred-work.md` ve vašem adresáři implementačních artefaktů) místo toho, aby se pokusil vše řešit najednou.

Zkontrolujte tento soubor po běhu — je to váš backlog věcí, ke kterým se vrátit. Každou odloženou položku lze zadat do nového běhu Build později.

## Kdy přidat formální plánování

Před spuštěním stejného Build loopu zvažte přidání PRD, UX, architektury nebo plánování stories, když:

- Změna ovlivňuje více systémů nebo vyžaduje koordinované aktualizace napříč mnoha soubory
- Nejste si jisti rozsahem a potřebujete nejprve zjišťování požadavků
- Potřebujete dokumentaci nebo architektonická rozhodnutí zaznamenaná pro tým

Podívejte se na [Build](../explanation/build.md), kde je vysvětleno, jak se přímý záměr a naplánovaná práce sbíhají do stejného implementačního loopu.
