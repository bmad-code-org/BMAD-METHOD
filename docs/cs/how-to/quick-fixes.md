---
title: "Rychlé opravy"
description: Jak provádět rychlé opravy a ad-hoc změny
sidebar:
  order: 5
---

Použijte **Quick Dev** pro opravy chyb, refaktoringy nebo malé cílené změny, které nevyžadují plnou metodu BMad.

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

Quick Dev přijímá volně formulovaný záměr — před, s nebo po vyvolání. Příklady:

```text
run quick-dev — Fix the login validation bug that allows empty passwords.
```

```text
run quick-dev — fix https://github.com/org/repo/issues/42
```

```text
run quick-dev — implement the intent in _bmad-output/implementation-artifacts/my-intent.md
```

```text
I think the problem is in the auth middleware, it's not checking token expiry.
Let me look at it... yeah, src/auth/middleware.ts line 47 skips
the exp check entirely. run quick-dev
```

```text
run quick-dev
> What would you like to do?
Refactor UserService to use async/await instead of callbacks.
```

Prostý text, cesty k souborům, GitHub issue URL, odkazy na bug tracker — cokoli, co LLM dokáže převést na konkrétní záměr.

### 3. Odpovězte na otázky a schvalte

Quick Dev se může zeptat na upřesňující otázky nebo prezentovat krátkou specifikaci ke schválení před implementací. Odpovězte na otázky a schvalte, až budete s plánem spokojeni.

### 4. Zkontrolujte a pushněte

Quick Dev implementuje změnu, zreviduje svou práci, opraví problémy a commitne lokálně. Když je hotov, otevře dotčené soubory ve vašem editoru.

- Projděte diff a potvrďte, že změna odpovídá vašemu záměru
- Pokud něco nevypadá dobře, řekněte agentovi, co opravit — může iterovat ve stejné relaci

Až budete spokojeni, pushněte commit. Quick Dev nabídne push a vytvoření PR za vás.

:::caution[Pokud se něco rozbije]
Pokud pushnutá změna způsobí neočekávané problémy, použijte `git revert HEAD` pro čisté vrácení posledního commitu. Poté začněte nový chat a spusťte Quick Dev znovu s jiným přístupem.
:::

## Co získáte

- Upravené zdrojové soubory s aplikovanou opravou nebo refaktoringem
- Procházející testy (pokud má váš projekt testovací sadu)
- Commit připravený k pushnutí s konvenční commit zprávou

## Odložená práce

Quick Dev udržuje každý běh zaměřený na jeden cíl. Pokud váš požadavek obsahuje více nezávislých cílů, nebo pokud revize odhalí předchozí problémy nesouvisející s vaší změnou, Quick Dev je odloží do souboru (`deferred-work.md` ve vašem adresáři implementačních artefaktů) místo toho, aby se pokusil vše řešit najednou.

Zkontrolujte tento soubor po běhu — je to váš backlog věcí, ke kterým se vrátit. Každou odloženou položku lze zadat do nového běhu Quick Dev později.

## Kdy přejít na formální plánování

Zvažte použití plné metody BMad, když:

- Změna ovlivňuje více systémů nebo vyžaduje koordinované aktualizace napříč mnoha soubory
- Nejste si jisti rozsahem a potřebujete nejprve zjišťování požadavků
- Potřebujete dokumentaci nebo architektonická rozhodnutí zaznamenaná pro tým

Podívejte se na [Quick Dev](../explanation/quick-dev.md) pro více informací o tom, jak Quick Dev zapadá do metody BMad.
