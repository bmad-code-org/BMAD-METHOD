---
title: "Comment passer à la v6"
description: Migrer de BMad v4 vers v6
sidebar:
  order: 3
---

Utilisez l'installateur BMad pour passer de la v4 à la v6, qui inclut une détection automatique des installations existantes et une assistance à la migration.

## Quand utiliser ce guide

- Vous avez BMad v4 installé (dossier `.bmad-method`)
- Vous souhaitez migrer vers la nouvelle architecture v6
- Vous avez des artefacts de planification existants à préserver

:::note[Prérequis]
- Node.js 20+
- Installation BMad v4 existante
:::

## Étapes

### 1. Lancer l'installateur

Suivez les [Instructions d'installation](./install-bmad.md).

### 2. Gérer l'installation existante

Quand v4 est détecté, vous pouvez :

- Autoriser l'installateur à sauvegarder et supprimer `.bmad-method`
- Quitter et gérer le nettoyage manuellement

Si vous avez nommé votre dossier de méthode bmad autrement, vous devrez supprimer le dossier vous-même manuellement.

### 3. Nettoyer les skills IDE

Supprimez manuellement les commandes/skills IDE v4 existants - par exemple si vous avez Claude Code, recherchez tous les dossiers imbriqués qui commencent par bmad et supprimez-les :

- `.claude/commands/`

Les nouveaux skills v6 sont installés dans :

- `.claude/skills/`

### 4. Migrer les artefacts de planification

**Si vous avez des documents de planification (Brief/PRD/UX/Architecture) :**

Déplacez-les dans `_bmad-output/planning-artifacts/` avec des noms descriptifs :

- Incluez `PRD` dans le nom de fichier pour les documents PRD[^1]
- Incluez `brief`, `architecture`, ou `ux-design` selon le cas
- Les documents divisés peuvent être dans des sous-dossiers nommés

**Si vous êtes en cours de planification :** Envisagez de redémarrer avec les workflows v6. Utilisez vos documents existants comme entrées - les nouveaux workflows de découverte progressive avec recherche web et mode plan IDE produisent de meilleurs résultats.

### 5. Migrer le développement en cours

Si vous avez des stories[^3] créées ou implémentées :

1. Terminez l'installation v6
2. Placez `epics.md` ou `epics/epic*.md`[^2] dans `_bmad-output/planning-artifacts/`
3. Lancez le workflow `bmad-sprint-planning`[^4]
4. Indiquez quels epics/stories sont déjà terminés

## Ce que vous obtenez

**Structure unifiée v6 :**

```text
votre-projet/
├── _bmad/               # Dossier d'installation unique
│   ├── _config/         # Vos personnalisations
│   │   └── agents/      # Fichiers de personnalisation des agents
│   ├── core/            # Framework core universel
│   ├── bmm/             # Module BMad Method
│   ├── bmb/             # BMad Builder
│   └── cis/             # Creative Intelligence Suite
└── _bmad-output/        # Dossier de sortie (était le dossier doc en v4)
```

## Migration des modules

| Module v4                     | Statut v6                                 |
| ----------------------------- | ----------------------------------------- |
| `.bmad-2d-phaser-game-dev`    | Intégré dans le Module BMGD               |
| `.bmad-2d-unity-game-dev`     | Intégré dans le Module BMGD               |
| `.bmad-godot-game-dev`        | Intégré dans le Module BMGD               |
| `.bmad-infrastructure-devops` | Déprécié - nouvel agent DevOps bientôt disponible |
| `.bmad-creative-writing`      | Non adapté - nouveau module v6 bientôt disponible   |

## Changements clés

| Concept       | v4                                    | v6                                   |
| ------------- | ------------------------------------- | ------------------------------------ |
| **Core**      | `_bmad-core` était en fait la méthode BMad | `_bmad/core/` est le framework universel |
| **Method**    | `_bmad-method`                        | `_bmad/bmm/`                         |
| **Config**    | Fichiers modifiés directement         | `config.yaml` par module             |
| **Documents** | Division ou non division requise | Entièrement flexible, scan automatique         |

## Glossaire
[^1]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d'aligner les équipes sur ce qui doit être construit et pourquoi.
[^2]: Epic : dans les méthodologies agiles, une grande unité de travail qui peut être décomposée en plusieurs stories. Un epic représente généralement une fonctionnalité majeure ou un ensemble de capacités livrable sur plusieurs sprints.
[^3]: Story (User Story) : une description courte et simple d'une fonctionnalité du point de vue de l'utilisateur. Les stories sont des unités de travail suffisamment petites pour être complétées en un sprint.
[^4]: Sprint : dans Scrum, une période de temps fixe (généralement 1 à 4 semaines) pendant laquelle l'équipe travaille à livrer un incrément de produit potentiellement libérable.
