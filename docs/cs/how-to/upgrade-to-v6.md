---
title: "Jak upgradovat na v6"
description: Migrace z BMad v4 na v6
sidebar:
  order: 3
---

Použijte instalátor BMad pro upgrade z v4 na v6, který zahrnuje automatickou detekci starších instalací a asistenci při migraci.

## Kdy to použít

- Máte nainstalovaný BMad v4 (složka `.bmad-method`)
- Chcete migrovat na novou architekturu v6
- Máte existující plánovací artefakty k zachování

:::note[Předpoklady]
- Node.js 20+
- Existující instalace BMad v4
:::

## Kroky

### 1. Spusťte instalátor

Postupujte podle [instrukcí instalátoru](./install-bmad.md).

### 2. Zpracování starší instalace

Když je detekována v4, můžete:

- Nechat instalátor zálohovat a odstranit `.bmad-method`
- Ukončit a zpracovat vyčištění ručně

Pokud jste pojmenovali složku bmad method jinak, musíte ji odstranit ručně.

### 3. Vyčištění IDE skills

Ručně odstraňte starší v4 IDE příkazy/skills — například pokud máte Claude Code, hledejte vnořené složky začínající na bmad a odstraňte je:

- `.claude/commands/`

Nové v6 skills se instalují do:

- `.claude/skills/`

### 4. Migrace plánovacích artefaktů

**Pokud máte plánovací dokumenty (Brief/PRD/UX/Architektura):**

Přesuňte je do `_bmad-output/planning-artifacts/` s popisnými názvy:

- Zahrňte `PRD` v názvu souboru pro PRD dokumenty
- Zahrňte `brief`, `architecture` nebo `ux-design` odpovídajícím způsobem
- Rozdělené dokumenty mohou být v pojmenovaných podsložkách

**Pokud jste uprostřed plánování:** Zvažte restart s v6 workflow. Použijte existující dokumenty jako vstupy — nové workflow s progresivním objevováním, webovým vyhledáváním a plan mode IDE produkují lepší výsledky.

### 5. Migrace probíhajícího vývoje

Pokud máte vytvořené nebo implementované stories:

1. Dokončete instalaci v6
2. Umístěte `epics.md` nebo `epics/epic*.md` do `_bmad-output/planning-artifacts/`
3. Spusťte workflow `bmad-sprint-planning` Scrum Mastera
4. Řekněte SM, které epicy/stories jsou již dokončené

## Co získáte

**Sjednocená struktura v6:**

```text
váš-projekt/
├── _bmad/               # Jedna instalační složka
│   ├── _config/         # Vaše přizpůsobení
│   │   └── agents/      # Soubory přizpůsobení agentů
│   ├── core/            # Univerzální základní framework
│   ├── bmm/             # Modul BMad Method
│   ├── bmb/             # BMad Builder
│   └── cis/             # Creative Intelligence Suite
└── _bmad-output/        # Výstupní složka (v4 to byla složka dokumentů)
```

## Migrace modulů

| Modul v4                      | Stav v6                            |
| ----------------------------- | ---------------------------------- |
| `.bmad-2d-phaser-game-dev`    | Integrován do modulu BMGD          |
| `.bmad-2d-unity-game-dev`     | Integrován do modulu BMGD          |
| `.bmad-godot-game-dev`        | Integrován do modulu BMGD          |
| `.bmad-infrastructure-devops` | Zastaralý — nový DevOps agent brzy |
| `.bmad-creative-writing`      | Neadaptován — nový v6 modul brzy   |

## Klíčové změny

| Koncept         | v4                                   | v6                                     |
| --------------- | ------------------------------------ | -------------------------------------- |
| **Core**        | `_bmad-core` byl vlastně BMad Method | `_bmad/core/` je univerzální framework |
| **Method**      | `_bmad-method`                       | `_bmad/bmm/`                           |
| **Konfigurace** | Přímá editace souborů                | `config.yaml` pro každý modul          |
| **Dokumenty**   | Vyžadované nastavení shardů          | Plně flexibilní, auto-skenování        |
