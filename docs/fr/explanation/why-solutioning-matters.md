---
title: "Pourquoi le Solutioning est Important"
description: Comprendre pourquoi la phase de solutioning est critique pour les projets multi-epics
sidebar:
  order: 5
---

La Phase 3 (Solutioning) traduit le **quoi** construire (issu de la Planification) en **comment** le construire (conception technique). Cette phase évite les conflits entre agents dans les projets multi-epics en documentant les décisions architecturales avant le début de l'implémentation.

## Le Problème Sans Solutioning

```text
Agent 1 implémente l'Epic 1 avec une API REST
Agent 2 implémente l'Epic 2 avec GraphQL
Résultat : Conception d'API incohérente, cauchemar d'intégration
```

Lorsque plusieurs agents implémentent différentes parties d'un système sans orientation architecturale partagée, ils prennent des décisions techniques indépendantes qui peuvent entrer en conflit.

## La Solution Avec le Solutioning

```text
le workflow architecture décide : "Utiliser GraphQL pour toutes les API"
Tous les agents suivent les décisions d'architecture
Résultat : Implémentation cohérente, pas de conflits
```

En documentant les décisions techniques de manière explicite, tous les agents implémentent de façon cohérente et l'intégration devient simple.

## Solutioning vs Planification

| Aspect   | Planification (Phase 2)  | Solutioning (Phase 3)                           |
|----------|--------------------------|-------------------------------------------------|
| Question | Quoi et Pourquoi ?       | Comment ? Puis Quelles unités de travail ?      |
| Sortie   | FRs/NFRs (Exigences)[^1] | Architecture + Epics[^2]/Stories[^3]            |
| Agent    | PM                       | Architect → PM                                  |
| Audience | Parties prenantes        | Développeurs                                    |
| Document | PRD[^4] (FRs/NFRs)       | Architecture + Fichiers Epics                   |
| Niveau   | Logique métier           | Conception technique + Décomposition du travail |

## Principe Clé

**Rendre les décisions techniques explicites et documentées** pour que tous les agents implémentent de manière cohérente.

Cela évite :
- Les conflits de style d'API (REST vs GraphQL)
- Les incohérences de conception de base de données
- Les désaccords sur la gestion du state
- Les inadéquations de conventions de nommage
- Les variations d'approche de sécurité

## Quand le Solutioning est Requis

| Parcours              | Solutioning Requis ?        |
|-----------------------|-----------------------------|
| Quick Dev             | Non - l’ignore complètement |
| Méthode BMad Simple   | Optionnel                   |
| Méthode BMad Complexe | Oui                         |
| Enterprise            | Oui                         |

:::tip[Règle Générale]
Si vous avez plusieurs epics qui pourraient être implémentés par différents agents, vous avez besoin de solutioning.
:::

## Conséquences de sauter la phase de Solutioning

Sauter le solutioning sur des projets complexes entraîne :

- **Des problèmes d'intégration** découverts en milieu de sprint[^5]
- **Du travail répété** dû à des implémentations conflictuelles
- **Un temps de développement plus long** globalement
- **De la dette technique**[^6] due à des patterns incohérents

:::caution[Coût Multiplié]
Détecter les problèmes d'alignement lors du solutioning est 10× plus rapide que de les découvrir pendant l'implémentation.
:::

## Glossaire

[^1]: FR / NFR (Functional / Non-Functional Requirement) : exigences décrivant respectivement **ce que le système doit faire** (fonctionnalités, comportements attendus) et **comment il doit le faire** (contraintes de performance, sécurité, fiabilité, ergonomie, etc.).
[^2]: Epic : dans les méthodologies agiles, une unité de travail importante qui peut être décomposée en plusieurs stories plus petites. Un epic représente généralement une fonctionnalité majeure ou un objectif métier.
[^3]: Story (User Story) : description courte et simple d'une fonctionnalité du point de vue de l'utilisateur, utilisée dans les méthodologies agiles pour planifier et prioriser le travail.
[^4]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d'aligner les équipes sur ce qui doit être construit et pourquoi.
[^5]: Sprint : période de temps fixe (généralement 1 à 4 semaines) dans les méthodologies agiles durant laquelle l'équipe complète un ensemble prédéfini de tâches.
[^6]: Dette technique : coût futur supplémentaire de travail résultant de choix de facilité ou de raccourcis pris lors du développement initial, nécessitant souvent une refonte ultérieure.
