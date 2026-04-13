---
title: "Průvodce dělením dokumentů"
description: Rozdělení velkých markdown souborů na menší organizované soubory pro lepší správu kontextu
sidebar:
  order: 9
---

Použijte nástroj `bmad-shard-doc`, pokud potřebujete rozdělit velké markdown soubory na menší, organizované soubory pro lepší správu kontextu.

:::caution[Zastaralé]
Toto se již nedoporučuje a brzy s aktualizovanými workflow a většinou hlavních LLM a nástrojů podporujících subprocesy to bude zbytečné.
:::

## Kdy to použít

Použijte pouze pokud si všimnete, že váš zvolený nástroj / model nedokáže načíst a přečíst všechny dokumenty jako vstup, když je to potřeba.

## Co je dělení dokumentů?

Dělení dokumentů rozděluje velké markdown soubory na menší, organizované soubory na základě nadpisů úrovně 2 (`## Nadpis`).

### Architektura

```text
Před dělením:
_bmad-output/planning-artifacts/
└── PRD.md (velký soubor o 50k tokenech)

Po dělení:
_bmad-output/planning-artifacts/
└── prd/
    ├── index.md                    # Obsah s popisy
    ├── overview.md                 # Sekce 1
    ├── user-requirements.md        # Sekce 2
    ├── technical-requirements.md   # Sekce 3
    └── ...                         # Další sekce
```

## Kroky

### 1. Spusťte nástroj Shard-Doc

```bash
/bmad-shard-doc
```

### 2. Následujte interaktivní proces

```text
Agent: Which document would you like to shard?
User: docs/PRD.md

Agent: Default destination: docs/prd/
       Accept default? [y/n]
User: y

Agent: Sharding PRD.md...
       ✓ Created 12 section files
       ✓ Generated index.md
       ✓ Complete!
```

## Jak funguje vyhledávání workflow

BMad workflow používají **duální systém vyhledávání**:

1. **Nejprve zkusí celý dokument** — Hledá `document-name.md`
2. **Zkontroluje rozdělenou verzi** — Hledá `document-name/index.md`
3. **Pravidlo priority** — Celý dokument má přednost, pokud existují oba — odstraňte celý dokument, pokud chcete použít rozdělenou verzi

## Podpora workflow

Všechny BMM workflow podporují oba formáty:

- Celé dokumenty
- Rozdělené dokumenty
- Automatická detekce
- Transparentní pro uživatele
