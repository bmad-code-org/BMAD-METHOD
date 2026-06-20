---
title: "Premiers pas"
description: Installer BMad et développer votre premier projet
---

Accélérez le développement de vos applications grâce à des workflows alimentés par l’IA et des agents spécialisés qui vous guident dans la planification, l’architecture et l’implémentation.

## Ce que vous allez apprendre

- Installer et initialiser la méthode BMad pour un nouveau projet
- Utiliser **BMad-Help** — votre guide intelligent qui sait quoi faire ensuite
- Choisir la bonne voie de planification selon la taille de votre projet
- Progresser dans les phases, de la définition des exigences au code fonctionnel
- Utiliser efficacement les agents et les workflows

:::note[Prérequis]
- **Node.js 20.12+** — Nécessaire pour l’installation
- **Git** — Recommandé pour la gestion de versions
- **IDE avec IA intégrée** — Claude Code, Cursor ou équivalent
- **Une idée de projet** — Même simple, elle fera l’affaire pour commencer
:::

:::tip[Le chemin le plus rapide]
**Installer** → `npx bmad-method install`
**Demander** → `bmad-help que dois-je faire en premier ?`
**Développez** → Laissez BMad-Help vous guider, workflow par workflow
:::

## Découvrez BMad-Help : votre guide intelligent

**BMad-Help est le moyen le plus rapide de démarrer avec BMad.** Pas besoin de mémoriser les workflows ou les phases — posez simplement votre question et BMad-Help saura :

- **Inspecter votre projet** pour voir ce qui a déjà été fait
- **Vous présenter vos options** en fonction des modules installés
- **Vous recommander la prochaine étape** — y compris la première tâche obligatoire
- **Répondre à vos questions**, par exemple : « J’ai une idée de SaaS, par où commencer ? »

### Comment utiliser BMad-Help

Dans votre IDE IA, invoquez le skill :

```
bmad-help
```

Ou accompagnez-le d’une question pour obtenir des conseils contextualisés :

```
bmad-help J'ai une idée de produit SaaS, je connais déjà toutes les fonctionnalités que je veux. Par où dois-je commencer ?
```

BMad-Help vous indiquera :

- Ce qui est recommandé pour votre situation
- Quelle est la première tâche obligatoire
- À quoi ressemble le reste du processus

### Il intervient aussi dans les workflows

BMad-Help ne se contente pas de répondre aux questions — **il se lance automatiquement à la fin de chaque workflow** pour vous indiquer exactement la suite. Finies les devinettes et les recherches dans la doc : vous recevez des instructions claires sur le prochain workflow à exécuter.

:::tip[Commencez ici]
Après avoir installé BMad, invoquez immédiatement le skill `bmad-help`. Il détectera les modules que vous avez installés et vous orientera vers le bon point de départ pour votre projet.
:::

## Comprendre BMad

BMad vous aide à développer des logiciels grâce à des workflows guidés par des agents IA spécialisés. Le processus s’articule en quatre phases :

| Phase | Nom            | Ce qui se passe                                                |
|-------|----------------|----------------------------------------------------------------|
| 1     | Analyse        | Brainstorming, recherche, product brief ou PRFAQ _(optionnel)_ |
| 2     | Planification  | Définir les exigences (PRD[^1] ou spécification technique)     |
| 3     | Solutioning    | Concevoir l’architecture _(BMad Method/Enterprise uniquement)_ |
| 4     | Implémentation | Développer epic[^2] par epic, story[^3] par story              |

**[Ouvrez la carte des workflows](../reference/workflow-map.md)** pour explorer les phases, les workflows et la gestion du contexte.

Selon la complexité de votre projet, BMad propose trois voies de planification :

| Voie             | Idéal pour                                                                   | Documents créés                        |
|------------------|------------------------------------------------------------------------------|----------------------------------------|
| **Quick Dev**    | Corrections de bugs, fonctionnalités simples, périmètre clair (1-15 stories) | Spécification technique uniquement     |
| **BMad Method**  | Produits, plateformes, fonctionnalités complexes (10-50+ stories)            | PRD + Architecture + UX[^4]            |
| **Enterprise**   | Conformité, systèmes multi-tenant[^5] (30+ stories)                          | PRD + Architecture + Security + DevOps |

:::note
Le nombre de stories est indicatif, pas strictement défini. Choisissez votre voie en fonction de vos besoins de planification, pas d’un simple décompte de stories.
:::

## Installation

Ouvrez un terminal dans le répertoire de votre projet et exécutez :

```bash
npx bmad-method install
```

Si vous préférez la dernière version préliminaire au lieu du canal de publication par défaut, utilisez `npx bmad-method@next install`.

À l’invite de sélection des modules, choisissez **BMad Method**.

L’installateur crée deux dossiers :

- `_bmad/` — agents, workflows, tâches et configuration
- `_bmad-output/` — vide pour le moment, mais c’est là que seront enregistrés vos artefacts

:::tip[Votre prochaine étape]
Ouvrez votre IDE avec IA dans le dossier du projet et exécutez :

```
bmad-help
```

BMad-Help détectera ce que vous avez déjà accompli et vous recommandera exactement la suite. Vous pouvez aussi lui poser des questions comme « Quelles sont mes options ? » ou « J’ai une idée de SaaS, par où devrais-je commencer ? »
:::

:::note[Comment charger les agents et exécuter les workflows]
Chaque workflow possède une **skill** que vous invoquez par son nom dans votre IDE (par ex. `bmad-prd`). Votre outil IA reconnaîtra le nom `bmad-*` et l’exécutera — pas besoin de charger les agents séparément. Vous pouvez aussi invoquer directement une skill d’agent pour une conversation générale (par ex. `bmad-agent-pm` pour l’agent PM).
:::

:::caution[Nouveaux chats]
Démarrez toujours un nouveau chat pour chaque workflow. Cela évite les problèmes liés aux limites de contexte de l’IA.
:::

## Étape 1 : Élaborer votre plan

Parcourez les phases 1 à 3. **Utilisez un nouveau chat pour chaque workflow.**

:::tip[Contexte projet (optionnel)]
Avant de commencer, pensez à créer `project-context.md` pour documenter vos préférences techniques et vos règles d’implémentation. Ainsi, tous les agents IA respecteront vos conventions tout au long du projet.

Créez-le manuellement à l’emplacement `_bmad-output/project-context.md`, ou générez-le après l’architecture avec `bmad-generate-project-context`. [En savoir plus](../explanation/project-context.md).
:::

### Phase 1 : Analyse (optionnelle)

Tous les workflows de cette phase sont optionnels. [**Vous ne savez pas lequel choisir ?**](../explanation/analysis-phase.md)

- **brainstorming** (`bmad-brainstorming`) — Idéation guidée
- **research** (`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) — Recherche marché, domaine et technique
- **product-brief** (`bmad-product-brief`) — Document fondateur recommandé une fois votre concept bien défini
- **prfaq** (`bmad-prfaq`) — Exercice Working Backwards pour tester et affiner votre concept produit

### Phase 2 : Planification (requise)

**Pour les voies BMad Method et Enterprise :**

1. Exécutez `bmad-prd` dans un nouveau chat — précisez votre intention (Create / Update / Validate) ou laissez le skill vous la demander
2. Résultat : `prd.md`, `addendum.md`, `.memlog.md`

:::note[Intentions de `bmad-prd`]

- **Create** — exploration guidée à partir de zéro ; le skill nomme le dossier de travail et vous accompagne jusqu’à l’obtention d’un PRD dont vous serez fier
- **Update** — pointez vers un PRD existant et un changement à apporter ; le skill met en évidence les conflits avant d’appliquer les modifications
- **Validate** — critiquez un PRD finalisé à l’aide d’une liste de contrôle et générez un rapport HTML des constatations
:::


**Pour la voie Quick Dev :**

- Exécutez `bmad-quick-dev` — ce workflow couvre la planification et l’implémentation en une seule fois ; vous pouvez passer directement à l’implémentation

:::note[Design UX (optionnel)]
Si votre projet comporte une interface utilisateur, invoquez l'**agent UX Designer** (`bmad-agent-ux-designer`) et lancez le workflow de design UX (`bmad-ux`) après avoir créé votre PRD.
:::

### Phase 3 : Solutioning (BMad Method/Enterprise)

**Créer l’architecture**

1. Invoquez l'**agent Architecte** (`bmad-agent-architect`) dans un nouveau chat
2. Exécutez `bmad-create-architecture` (`bmad-create-architecture`)
3. Résultat : document d’architecture avec les décisions techniques

**Créer les epics et les stories**

:::tip[Amélioration V6]
Les epics et stories sont désormais créés *après* l’architecture. Cela produit des stories de meilleure qualité, car les décisions d’architecture (choix de la base de données, patterns d’API, pile technologique) influencent directement la façon dont le travail doit être découpé.
:::

1. Invoquez l'**agent PM** (`bmad-agent-pm`) dans un nouveau chat
2. Exécutez `bmad-create-epics-and-stories` (`bmad-create-epics-and-stories`)
3. Le workflow s’appuie sur le PRD et l’architecture pour créer des stories techniquement fondées

**Vérification de la préparation à l’implémentation** *(fortement recommandée)*

1. Invoquez l'**agent Architecte** (`bmad-agent-architect`) dans un nouveau chat
2. Exécutez `bmad-check-implementation-readiness` (`bmad-check-implementation-readiness`)
3. Valide la cohérence de l’ensemble des documents de planification

## Étape 2 : Développer votre projet

Une fois la planification terminée, passez à l’implémentation. **Chaque workflow doit être exécuté dans un nouveau chat.**

### Initialiser la planification de sprint

Invoquez l'**agent Développeur** (`bmad-agent-dev`) et exécutez `bmad-sprint-planning` (`bmad-sprint-planning`). Cette commande crée `sprint-status.yaml` pour suivre tous les epics et stories.

### Le cycle de développement

Pour chaque story, répétez ce cycle dans de nouveaux chats :

| Étape | Agent | Workflow            | Commande            | Objectif                             |
|-------|-------|---------------------|---------------------|--------------------------------------|
| 1     | DEV   | `bmad-create-story` | `bmad-create-story` | Créer le fichier story depuis l’epic |
| 2     | DEV   | `bmad-dev-story`    | `bmad-dev-story`    | Implémenter la story                 |
| 3     | DEV   | `bmad-code-review`  | `bmad-code-review`  | Validation qualité *(recommandée)*   |

Après avoir terminé toutes les stories d’un epic, invoquez l'**agent Développeur** (`bmad-agent-dev`) et exécutez `bmad-retrospective` (`bmad-retrospective`).

## Ce que vous avez accompli

Vous maîtrisez maintenant les bases du développement avec BMad :

- Installation et configuration de BMad pour votre IDE
- Initialisation d’un projet avec la voie de planification choisie
- Création des documents de planification (PRD, Architecture, Epics & Stories)
- Compréhension du cycle de développement pour l’implémentation

Votre projet contient désormais :

```text
your-project/
├── _bmad/                                   # Configuration BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Document d'exigences
│   │   ├── architecture.md                  # Décisions techniques
│   │   └── epics/                           # Fichiers epic et story
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Suivi de sprint
│   └── project-context.md                   # Règles d'implémentation (optionnel)
└── ...
```

## Référence rapide

| Workflow                              | Commande                              | Agent     | Objectif                                                        |
|---------------------------------------|---------------------------------------|-----------|-----------------------------------------------------------------|
| **`bmad-help`** ⭐                    | `bmad-help`                           | Tous      | **Votre guide intelligent — posez n’importe quelle question !**  |
| `bmad-prd`                            | `bmad-prd`                            | Tous      | Créer, mettre à jour ou valider un PRD                          |
| `bmad-create-architecture`            | `bmad-create-architecture`            | Architect | Créer le document d’architecture                                |
| `bmad-generate-project-context`       | `bmad-generate-project-context`       | Analyst   | Créer le fichier de contexte projet                             |
| `bmad-create-epics-and-stories`       | `bmad-create-epics-and-stories`       | PM        | Décomposer le PRD en epics                                      |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Architect | Valider la cohérence de la planification                        |
| `bmad-sprint-planning`                | `bmad-sprint-planning`                | DEV       | Initialiser le suivi de sprint                                  |
| `bmad-create-story`                   | `bmad-create-story`                   | DEV       | Créer un fichier story                                          |
| `bmad-dev-story`                      | `bmad-dev-story`                      | DEV       | Implémenter une story                                           |
| `bmad-code-review`                    | `bmad-code-review`                    | DEV       | Revoir le code implémenté                                       |

## Questions fréquentes

**Ai-je toujours besoin d’une architecture ?**
Seulement pour les voies BMad Method et Enterprise. Quick Dev passe directement de la spécification à l’implémentation.

**Puis-je modifier mon plan en cours de route ?**
Oui. Le workflow `bmad-correct-course` gère les changements de périmètre en cours d’implémentation.

**Et si je veux d’abord brainstormer ?**
Invoquez l’agent Analyste (`bmad-agent-analyst`) et exécutez `bmad-brainstorming` (`bmad-brainstorming`) avant de commencer votre PRD.

**Dois-je suivre un ordre strict ?**
Pas strictement. Une fois le flux maîtrisé, vous pouvez exécuter les workflows directement en vous référant au tableau ci-dessus.

## Obtenir de l’aide

:::tip[Premier réflexe : BMad-Help]
**Invoquez `bmad-help` à tout moment** — c’est le moyen le plus rapide de vous débloquer. Posez-lui n’importe quelle question :

- « Que dois-je faire après l’installation ? »
- « Je suis bloqué sur le workflow X »
- « Quelles sont mes options pour Y ? »
- « Montre-moi ce qui a été fait jusqu’ici »

BMad-Help inspecte votre projet, détecte ce que vous avez accompli et vous indique exactement la prochaine étape.
:::

- **Pendant les workflows** — Les agents vous guident à l’aide de questions et d’explications
- **Communauté** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## Points clés à retenir

:::tip[Retenez ceci]
- **Commencez par `bmad-help`** — Votre guide intelligent qui connaît votre projet et vos options
- **Utilisez toujours de nouveaux chats** — Démarrez un nouveau chat pour chaque workflow
- **Le choix de la voie est important** — Quick Dev utilise `bmad-quick-dev` ; BMad Method/Enterprise nécessitent un PRD et une architecture
- **BMad-Help se lance automatiquement** — Chaque workflow se termine par des conseils sur la prochaine étape
:::

Prêt à commencer ? Installez BMad, invoquez `bmad-help`, et laissez votre guide intelligent vous accompagner.

## Glossaire

[^1]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d’aligner les équipes sur ce qui doit être construit et pourquoi.
[^2]: Epic : grand ensemble de fonctionnalités ou de travaux qui peut être décomposé en plusieurs user stories.
[^3]: Story (User Story) : description courte et simple d’une fonctionnalité du point de vue de l’utilisateur ou du client. Elle représente une unité de travail implémentable en un court délai.
[^4]: UX (User Experience) : expérience utilisateur, englobant l’ensemble des interactions et perceptions d’un utilisateur face à un produit. Le design UX vise à créer des interfaces intuitives, efficaces et agréables en tenant compte des besoins, des comportements et du contexte d’utilisation.
[^5]: Multi-tenant : architecture logicielle où une seule instance de l’application sert plusieurs clients (tenants) tout en maintenant leurs données isolées et sécurisées les unes des autres.
