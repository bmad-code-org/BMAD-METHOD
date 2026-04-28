---
title: "Prévention des conflits entre agents"
description: Comment l'architecture empêche les conflits lorsque plusieurs agents implémentent un système
sidebar:
  order: 6
---

Lorsque plusieurs agents IA implémentent différentes parties d'un système, ils peuvent prendre des décisions techniques contradictoires. La documentation d'architecture prévient cela en établissant des standards partagés.

## Types de conflits courants

### Conflits de style d'API

Sans architecture :
- L'agent A utilise REST avec `/users/{id}`
- L'agent B utilise des mutations GraphQL
- Résultat : Patterns d'API incohérents, consommateurs confus

Avec architecture :
- L'ADR[^1] spécifie : « Utiliser GraphQL pour toute communication client-serveur »
- Tous les agents suivent le même pattern

### Conflits de conception de base de données

Sans architecture :
- L'agent A utilise des noms de colonnes en snake_case
- L'agent B utilise des noms de colonnes en camelCase
- Résultat : Schéma incohérent, requêtes illisibles

Avec architecture :
- Un document de standards spécifie les conventions de nommage
- Tous les agents suivent les mêmes patterns

### Conflits de gestion d'état

Sans architecture :
- L'agent A utilise Redux pour l'état global
- L'agent B utilise React Context
- Résultat : Multiples approches de gestion d'état, complexité

Avec architecture :
- L'ADR spécifie l'approche de gestion d'état
- Tous les agents implémentent de manière cohérente

## Comment l'architecture prévient les conflits

### 1. Décisions explicites via les ADR[^1]

Chaque choix technologique significatif est documenté avec :
- Contexte (pourquoi cette décision est importante)
- Options considérées (quelles alternatives existent)
- Décision (ce qui a été choisi)
- Justification (pourquoi cela a-t-il été choisi)
- Conséquences (compromis acceptés)

### 2. Guidance spécifique aux FR/NFR[^2]

L'architecture associe chaque exigence fonctionnelle à une approche technique :
- FR-001 : Gestion des utilisateurs → Mutations GraphQL
- FR-002 : Application mobile → Requêtes optimisées

### 3. Standards et conventions

Documentation explicite de :
- La structure des répertoires
- Les conventions de nommage
- L'organisation du code
- Les patterns de test

## L'architecture comme contexte partagé

Considérez l'architecture comme le contexte partagé que tous les agents lisent avant d'implémenter :

```text
PRD : "Que construire"
     ↓
Architecture : "Comment le construire"
     ↓
L'agent A lit l'architecture → implémente l'Epic 1
L'agent B lit l'architecture → implémente l'Epic 2
L'agent C lit l'architecture → implémente l'Epic 3
     ↓
Résultat : Implémentation cohérente
```

## Sujets clés des ADR

Décisions courantes qui préviennent les conflits :

| Sujet            | Exemple de décision                          |
| ---------------- | -------------------------------------------- |
| Style d'API      | GraphQL vs REST vs gRPC                      |
| Base de données  | PostgreSQL vs MongoDB                        |
| Authentification | JWT vs Sessions                              |
| Gestion d'état   | Redux vs Context vs Zustand                  |
| Styling          | CSS Modules vs Tailwind vs Styled Components |
| Tests            | Jest + Playwright vs Vitest + Cypress        |

## Anti-patterns à éviter

:::caution[Erreurs courantes]
- **Décisions implicites** — « On décidera du style d'API au fur et à mesure » mène à l'incohérence
- **Sur-documentation** — Documenter chaque choix mineur cause une paralysie analytique
- **Architecture obsolète** — Les documents écrits une fois et jamais mis à jour poussent les agents à suivre des patterns dépassés
:::

:::tip[Approche correcte]
- Documenter les décisions qui traversent les frontières des epics
- Se concentrer sur les zones sujettes aux conflits
- Mettre à jour l'architecture au fur et à mesure des apprentissages
- Utiliser `bmad-correct-course` pour les changements significatifs
:::

## Glossaire

[^1]: ADR (Architecture Decision Record) : document qui consigne une décision d’architecture, son contexte, les options envisagées, le choix retenu et ses conséquences, afin d’assurer la traçabilité et la compréhension des décisions techniques dans le temps.
[^2]: FR / NFR (Functional / Non-Functional Requirement) : exigences décrivant respectivement **ce que le système doit faire** (fonctionnalités, comportements attendus) et **comment il doit le faire** (contraintes de performance, sécurité, fiabilité, ergonomie, etc.).
