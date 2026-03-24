---
title: "Premiers pas"
description: Installer BMad et construire votre premier projet
---

Construisez des logiciels plus rapidement en utilisant des workflows propulsés par l'IA avec des agents spécialisés qui vous guident à travers la planification, l'architecture et l'implémentation.

## Ce que vous allez apprendre

- Installer et initialiser la méthode BMad pour un nouveau projet
- Utiliser **BMad-Help** — votre guide intelligent qui sait quoi faire ensuite
- Choisir la bonne voie de planification selon la taille de votre projet
- Progresser à travers les phases, des exigences au code fonctionnel
- Utiliser efficacement les agents et les workflows

:::note[Prérequis]
- **Node.js 20+** — Requis pour l'installateur
- **Git** — Recommandé pour le contrôle de version
- **IDE IA** — Claude Code, Cursor, ou similaire
- **Une idée de projet** — Même simple, elle fonctionne pour apprendre
:::

:::tip[Le chemin le plus simple]
**Installer** → `npx bmad-method install`
**Demander** → `bmad-help que dois-je faire en premier ?`
**Construire** → Laissez BMad-Help vous guider workflow par workflow
:::

## Découvrez BMad-Help : votre guide intelligent

**BMad-Help est le moyen le plus rapide de démarrer avec BMad.** Vous n'avez pas besoin de mémoriser les workflows ou les phases — posez simplement la question, et BMad-Help va :

- **Inspecter votre projet** pour voir ce qui a déjà été fait
- **Vous montrer vos options** en fonction des modules que vous avez installés
- **Recommander la prochaine étape** — y compris la première tâche obligatoire
- **Répondre aux questions** comme « J'ai une idée de SaaS, par où commencer ? »

### Comment utiliser BMad-Help

Exécutez-le dans votre IDE avec IA en invoquant la skill :

```
bmad-help
```

Ou combinez-le avec une question pour obtenir des conseils adaptés au contexte :

```
bmad-help J'ai une idée de produit SaaS, je connais déjà toutes les fonctionnalités que je veux. Par où dois-je commencer ?
```

BMad-Help répondra avec :
- Ce qui est recommandé pour votre situation
- Quelle est la première tâche obligatoire
- À quoi ressemble le reste du processus

### Il alimente aussi les workflows

BMad-Help ne se contente pas de répondre aux questions — **il s'exécute automatiquement à la fin de chaque workflow** pour vous dire exactement quoi faire ensuite. Pas de devinettes, pas de recherche dans la documentation — juste des conseils clairs sur le prochain workflow requis.

:::tip[Commencez ici]
Après avoir installé BMad, invoquez immédiatement la skill `bmad-help`. Elle détectera les modules que vous avez installés et vous guidera vers le bon point de départ pour votre projet.
:::

## Comprendre BMad

BMad vous aide à construire des logiciels grâce à des workflows guidés avec des agents IA spécialisés. Le processus suit quatre phases :

| Phase | Nom            | Ce qui se passe                                                |
|-------|----------------|----------------------------------------------------------------|
| 1     | Analyse        | Brainstorming, recherche, product brief *(optionnel)*          |
| 2     | Planification  | Créer les exigences (PRD[^1] ou spécification technique)       |
| 3     | Solutioning    | Concevoir l'architecture *(BMad Method/Enterprise uniquement)* |
| 4     | Implémentation | Construire epic[^2] par epic, story[^3] par story              |

**[Ouvrir la carte des workflows](../reference/workflow-map.md)** pour explorer les phases, les workflows et la gestion du contexte.

Selon la complexité de votre projet, BMad propose trois voies de planification :

| Voie             | Idéal pour                                                                   | Documents créés                        |
|------------------|------------------------------------------------------------------------------|----------------------------------------|
| **Quick Dev**    | Corrections de bugs, fonctionnalités simples, périmètre clair (1-15 stories) | Spécification technique uniquement     |
| **méthode BMad** | Produits, plateformes, fonctionnalités complexes (10-50+ stories)            | PRD + Architecture + UX[^4]            |
| **Enterprise**   | Conformité, systèmes multi-tenant[^5] (30+ stories)                          | PRD + Architecture + Security + DevOps |

:::note
Les comptes de stories sont indicatifs, pas des définitions. Choisissez votre voie en fonction des besoins de planification, pas du calcul des stories.
:::

## Installation

Ouvrez un terminal dans le répertoire de votre projet et exécutez :

```bash
npx bmad-method install
```

Si vous souhaitez la version préliminaire la plus récente au lieu du canal de release par défaut, utilisez `npx bmad-method@next install`.

Lorsque vous êtes invité à sélectionner des modules, choisissez **méthode BMad**.

L'installateur crée deux dossiers :
- `_bmad/` — agents, workflows, tâches et configuration
- `_bmad-output/` — vide pour l'instant, mais c'est là que vos artefacts seront enregistrés

:::tip[Votre prochaine étape]
Ouvrez votre IDE avec IA dans le dossier du projet et exécutez :

```
bmad-help
```

BMad-Help détectera ce que vous avez accompli et recommandera exactement quoi faire ensuite. Vous pouvez aussi lui poser des questions comme « Quelles sont mes options ? » ou « J'ai une idée de SaaS, par où devrais-je commencer ? »
:::

:::note[Comment charger les agents et exécuter les workflows]
Chaque workflow possède une **skill** que vous invoquez par nom dans votre IDE (par ex., `bmad-create-prd`). Votre outil IA reconnaîtra le nom `bmad-*` et l'exécutera.
:::

:::caution[Nouveaux chats]
Démarrez toujours un nouveau chat pour chaque workflow. Cela évite que les limitations de contexte ne causent des problèmes.
:::

## Étape 1 : Créer votre plan

Travaillez à travers les phases 1-3. **Utilisez de nouveaux chats pour chaque workflow.**

:::tip[Contexte de projet (Optionnel)]
Avant de commencer, envisagez de créer `project-context.md` pour documenter vos préférences techniques et règles d'implémentation. Cela garantit que tous les agents IA suivent vos conventions tout au long du projet.

Créez-le manuellement dans `_bmad-output/project-context.md` ou générez-le après l'architecture en utilisant `bmad-generate-project-context`. [En savoir plus](../explanation/project-context.md).
:::

### Phase 1 : Analyse (Optionnel)

Tous les workflows de cette phase sont optionnels :
- **brainstorming** (`bmad-brainstorming`) — Idéation guidée
- **research** (`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) — Recherche marché, domaine et technique
- **create-product-brief** (`bmad-create-product-brief`) — Document de base recommandé

### Phase 2 : Planification (Requis)

**Pour les voies BMad Method et Enterprise :**
1. Exécutez `bmad-create-prd` dans un nouveau chat
2. Sortie : `PRD.md`

**Pour la voie Quick Dev :**
- Utilisez le workflow `bmad-quick-dev` (`bmad-quick-dev`) à la place du PRD, puis passez à l'implémentation

:::note[Design UX (Optionnel)]
Si votre projet a une interface utilisateur, exécutez le workflow de design UX (`bmad-create-ux-design`) après avoir créé votre PRD.
:::

### Phase 3 : Solutioning (méthode BMad/Enterprise)

**Créer l'Architecture**
1. Exécutez `bmad-create-architecture` dans un nouveau chat
2. Sortie : Document d'architecture avec les décisions techniques

**Créer les Epics et Stories**

:::tip[Amélioration V6]
Les epics et stories sont maintenant créés *après* l'architecture. Cela produit des stories de meilleure qualité car les décisions d'architecture (base de données, patterns d'API, pile technologique) affectent directement la façon dont le travail doit être décomposé.
:::

1. Exécutez `bmad-create-epics-and-stories` dans un nouveau chat
2. Le workflow utilise à la fois le PRD et l'Architecture pour créer des stories techniquement éclairées

**Vérification de préparation à l'implémentation** *(Hautement recommandé)*
1. Exécutez `bmad-check-implementation-readiness` dans un nouveau chat
2. Valide la cohérence entre tous les documents de planification

## Étape 2 : Construire votre projet

Une fois la planification terminée, passez à l'implémentation. **Chaque workflow doit s'exécuter dans un nouveau chat.**

### Initialiser la planification de sprint

Exécutez `bmad-sprint-planning` dans un nouveau chat. Cela crée `sprint-status.yaml` pour suivre tous les epics et stories.

### Le cycle de construction

Pour chaque story, répétez ce cycle avec de nouveaux chats :

| Étape | Workflow              | Commande               | Objectif                            |
| ----- | --------------------- | --------------------- | ----------------------------------- |
| 1     | `bmad-create-story`   | `bmad-create-story`   | Créer le fichier story depuis l'epic |
| 2     | `bmad-dev-story`      | `bmad-dev-story`      | Implémenter la story                |
| 3     | `bmad-code-review`    | `bmad-code-review`    | Validation de qualité *(recommandé)* |

Après avoir terminé toutes les stories d'un epic, exécutez `bmad-retrospective` dans un nouveau chat.

## Ce que vous avez accompli

Vous avez appris les fondamentaux de la construction avec BMad :

- Installé BMad et configuré pour votre IDE
- Initialisé un projet avec votre voie de planification choisie
- Créé des documents de planification (PRD, Architecture, Epics & Stories)
- Compris le cycle de construction pour l'implémentation

Votre projet contient maintenant :

```text
your-project/
├── _bmad/                                   # Configuration BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Votre document d'exigences
│   │   ├── architecture.md                  # Décisions techniques
│   │   └── epics/                           # Fichiers epic et story
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Suivi de sprint
│   └── project-context.md                   # Règles d'implémentation (optionnel)
└── ...
```

## Référence rapide

| Workflow                              | Commande                                    | Objectif                                         |
| ------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **`bmad-help`** ⭐                    | `bmad-help`                               | **Votre guide intelligent — posez n'importe quelle question !**      |
| `bmad-create-prd`                     | `bmad-create-prd`                     | Créer le document d'exigences produit            |
| `bmad-create-architecture`            | `bmad-create-architecture`            | Créer le document d'architecture                     |
| `bmad-generate-project-context`       | `bmad-generate-project-context`       | Créer le fichier de contexte projet                     |
| `bmad-create-epics-and-stories`       | `bmad-create-epics-and-stories`       | Décomposer le PRD en epics                       |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Valider la cohérence de planification                      |
| `bmad-sprint-planning`               | `bmad-sprint-planning`                | Initialiser le suivi de sprint                      |
| `bmad-create-story`                   | `bmad-create-story`                   | Créer un fichier story                             |
| `bmad-dev-story`                      | `bmad-dev-story`                      | Implémenter une story                               |
| `bmad-code-review`                    | `bmad-code-review`                    | Revoir le code implémenté                         |

## Questions fréquentes

**Ai-je toujours besoin d'une architecture ?**
Uniquement pour les voies méthode BMad et Enterprise. Quick Dev passe directement de la spécification technique (spec) à l'implémentation.

**Puis-je modifier mon plan plus tard ?**
Oui. Utilisez `bmad-correct-course` pour gérer les changements de périmètre.

**Et si je veux d'abord faire du brainstorming ?**
Invoquez l'agent Analyst (`bmad-agent-analyst`) et exécutez `bmad-brainstorming` (`bmad-brainstorming`) avant de commencer votre PRD.

**Dois-je suivre un ordre strict ?**
Pas strictement. Une fois que vous maîtrisez le flux, vous pouvez exécuter les workflows directement en utilisant la référence rapide ci-dessus.

## Obtenir de l'aide

:::tip[Premier arrêt : BMad-Help]
**Invoquez `bmad-help` à tout moment** — c'est le moyen le plus rapide de se débloquer. Posez n'importe quelle question :
- « Que dois-je faire après l'installation ? »
- « Je suis bloqué sur le workflow X »
- « Quelles sont mes options pour Y ? »
- « Montre-moi ce qui a été fait jusqu'ici »

BMad-Help inspecte votre projet, détecte ce que vous avez accompli et vous dit exactement quoi faire ensuite.
:::

- **Pendant les workflows** — Les agents vous guident avec des questions et des explications
- **Communauté** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## Points clés à retenir

:::tip[Retenez ceci]
- **Commencez par `bmad-help`** — Votre guide intelligent qui connaît votre projet et vos options
- **Utilisez toujours de nouveaux chats** — Démarrez un nouveau chat pour chaque workflow
- **La voie compte** — Quick Dev utilise `bmad-quick-dev` ; La méthode BMad/Enterprise nécessitent PRD et architecture
- **BMad-Help s'exécute automatiquement** — Chaque workflow se termine par des conseils sur la prochaine étape
:::

Prêt à commencer ? Installez BMad, invoquez `bmad-help`, et laissez votre guide intelligent vous montrer le chemin.

## Glossaire

[^1]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d'aligner les équipes sur ce qui doit être construit et pourquoi.
[^2]: Epic : grand ensemble de fonctionnalités ou de travaux qui peut être décomposé en plusieurs user stories.
[^3]: Story (User Story) : description courte et simple d'une fonctionnalité du point de vue de l'utilisateur ou du client. Elle représente une unité de travail implémentable en un court délai.
[^4]: UX (User Experience) : expérience utilisateur, englobant l'ensemble des interactions et perceptions d'un utilisateur face à un produit. Le design UX vise à créer des interfaces intuitives, efficaces et agréables en tenant compte des besoins, comportements et contexte d'utilisation.
[^5]: Multi-tenant : architecture logicielle où une seule instance de l'application sert plusieurs clients (tenants) tout en maintenant leurs données isolées et sécurisées les unes des autres.
