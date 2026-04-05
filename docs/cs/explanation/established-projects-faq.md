---
title: "FAQ pro existující projekty"
description: Časté otázky o používání BMad Method na existujících projektech
sidebar:
  order: 8
---
Rychlé odpovědi na časté otázky o práci na existujících projektech s BMad Method (BMM).

## Otázky

- [Musím nejdřív spustit document-project?](#musím-nejdřív-spustit-document-project)
- [Co když zapomenu spustit document-project?](#co-když-zapomenu-spustit-document-project)
- [Mohu použít Quick Flow pro existující projekty?](#mohu-použít-quick-flow-pro-existující-projekty)
- [Co když můj existující kód nedodržuje osvědčené postupy?](#co-když-můj-existující-kód-nedodržuje-osvědčené-postupy)

### Musím nejdřív spustit document-project?

Vysoce doporučeno, zejména pokud:

- Neexistuje žádná dokumentace
- Dokumentace je zastaralá
- AI agenti potřebují kontext o existujícím kódu

Můžete to přeskočit, pokud máte komplexní, aktuální dokumentaci včetně `docs/index.md` nebo budete používat jiné nástroje nebo techniky k usnadnění discovery pro agenta stavějícího na existujícím systému.

### Co když zapomenu spustit document-project?

Nedělejte si starosti — můžete to udělat kdykoli. Můžete to udělat i během nebo po projektu, aby pomohl udržet dokumentaci aktuální.

### Mohu použít Quick Flow pro existující projekty?

Ano! Quick Flow funguje skvěle pro existující projekty. Umí:

- Automaticky detekovat váš existující stack
- Analyzovat existující vzory kódu
- Detekovat konvence a požádat o potvrzení
- Generovat kontextově bohatou specifikaci, která respektuje existující kód

Ideální pro opravy chyb a malé funkce v existujících kódových bázích.

### Co když můj existující kód nedodržuje osvědčené postupy?

Quick Flow detekuje vaše konvence a zeptá se: „Mám dodržovat tyto existující konvence?“ Rozhodujete vy:

- **Ano** → Zachovat konzistenci se současnou kódovou bází
- **Ne** → Zavést nové standardy (zdokumentujte proč ve specifikaci)

BMM respektuje vaši volbu — nevynucuje modernizaci, ale nabídne ji.

**Máte otázku, na kterou jste zde nenašli odpověď?** Prosím [vytvořte issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) nebo se zeptejte na [Discordu](https://discord.gg/gk8jAdXWmj), abychom ji mohli přidat!
