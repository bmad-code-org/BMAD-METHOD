---
title: "Guide de Division de Documents"
description: Diviser les fichiers markdown volumineux en fichiers plus petits et organisés pour une meilleure gestion du contexte
sidebar:
  order: 9
---

Utilisez l'outil `bmad-shard-doc` si vous avez besoin de diviser des fichiers markdown volumineux en fichiers plus petits et organisés pour une meilleure gestion du contexte.

:::caution[Déprécié]
Ceci n'est plus recommandé, et bientôt avec les workflows mis à jour et la plupart des LLM et outils majeurs supportant les sous-processus, cela deviendra inutile.
:::

## Quand l’Utiliser

Utilisez ceci uniquement si vous remarquez que votre combinaison outil / modèle ne parvient pas à charger et lire tous les documents en entrée lorsque c'est nécessaire.

## Qu'est-ce que la Division de Documents ?

La division de documents divise les fichiers markdown volumineux en fichiers plus petits et organisés basés sur les titres de niveau 2 (`## Titre`).

### Architecture

```text
Avant Division :
_bmad-output/planning-artifacts/
└── PRD.md (fichier volumineux de 50k tokens)

Après Division :
_bmad-output/planning-artifacts/
└── prd/
    ├── index.md                    # Table des matières avec descriptions
    ├── overview.md                 # Section 1
    ├── user-requirements.md        # Section 2
    ├── technical-requirements.md   # Section 3
    └── ...                         # Sections supplémentaires
```

## Étapes

### 1. Exécuter l'Outil Shard-Doc

```bash
/bmad-shard-doc
```

### 2. Suivre le Processus Interactif

```text
Agent : Quel document souhaitez-vous diviser ?
Utilisateur : docs/PRD.md

Agent : Destination par défaut : docs/prd/
        Accepter la valeur par défaut ? [y/n]
Utilisateur : y

Agent : Division de PRD.md...
        ✓ 12 fichiers de section créés
        ✓ index.md généré
        ✓ Terminé !
```

## Comment Fonctionne la Découverte de Workflow

Les workflows BMad utilisent un **système de découverte double** :

1. **Essaye d'abord le document entier** - Rechercher `document-name.md`
2. **Vérifie la version divisée** - Rechercher `document-name/index.md`
3. **Règle de priorité** - Le document entier a la priorité si les deux existent - supprimez le document entier si vous souhaitez que la version divisée soit utilisée à la place

## Support des Workflows

Tous les workflows BMM prennent en charge les deux formats :

- Documents entiers
- Documents divisés
- Détection automatique
- Transparent pour l'utilisateur
