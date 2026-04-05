---
title: Options de Testing
description: Comparaison du workflow QA intégré avec le module Test Architect (TEA) pour l'automatisation des tests.
sidebar:
  order: 5
---

BMad propose deux approches de test : un workflow QA[^1] intégré pour une génération rapide de tests et un module Test Architect installable pour une stratégie de test de qualité entreprise.

## Lequel Choisir ?

| Facteur                 | QA Intégré                           | Module TEA                                                          |
|-------------------------|----------------------------------------------|---------------------------------------------------------------------|
| **Idéal pour**          | Projets petits et moyens, couverture rapide  | Grands projets, domaines réglementés ou complexes                   |
| **Installation**        | Rien à installer — inclus dans BMM          | Installer séparément via `npx bmad-method install`                  |
| **Approche**            | Générer les tests rapidement, itérer ensuite | Planifier d'abord, puis générer avec traçabilité                    |
| **Types de tests**      | Tests API et E2E                             | API, E2E, ATDD[^2], NFR, et plus                                    |
| **Stratégie**           | Chemin nominal + cas limites critiques       | Priorisation basée sur les risques (P0-P3)                          |
| **Nombre de workflows** | 1 (Automate)                                 | 9 (conception, ATDD, automatisation, revue, traçabilité, et autres) |

:::tip[Commencez avec le QA Intégré]
La plupart des projets devraient commencer avec le workflow QA intégré. Si vous avez ensuite besoin d'une stratégie de test, de murs de qualité ou de traçabilité des exigences, installez TEA en complément.
:::

## Workflow QA Intégré

Le workflow QA intégré (`bmad-qa-generate-e2e-tests`) fait partie du module BMM (suite Agile), disponible via l'agent Developer. Il génère rapidement des tests fonctionnels en utilisant le framework de test existant de votre projet — aucune configuration ni installation supplémentaire requise.

**Déclencheur :** `QA` (via l'agent Developer) ou `bmad-qa-generate-e2e-tests`

### Ce que le Workflow QA Fait

Le workflow QA exécute un processus unique (Automate) qui parcourt cinq étapes :

1. **Détecte le framework de test** — analyse `package.json` et les fichiers de test existants pour identifier votre framework (Jest, Vitest, Playwright, Cypress, ou tout runner standard). Si aucun n'existe, analyse la pile technologique du projet et en suggère un.
2. **Identifie les fonctionnalités** — demande ce qu'il faut tester ou découvre automatiquement les fonctionnalités dans le codebase.
3. **Génère les tests API** — couvre les codes de statut, la structure des réponses, le chemin nominal, et 1-2 cas d'erreur.
4. **Génére les tests E2E** — couvre les parcours utilisateur avec des localisateurs sémantiques et des assertions sur les résultats visibles.
5. **Exécute et vérifie** — lance les tests générés et corrige immédiatement les échecs.

Le workflow QA produit un résumé de test sauvegardé dans le dossier des artefacts d'implémentation de votre projet.

### Patterns de Test

Les tests générés suivent une philosophie "simple et maintenable" :

- **APIs standard du framework uniquement** — pas d'utilitaires externes ni d'abstractions personnalisées
- **Localisateurs sémantiques** pour les tests UI (rôles, labels, texte plutôt que sélecteurs CSS)
- **Tests indépendants** sans dépendances d'ordre
- **Pas d'attentes ou de sleeps codés en dur**
- **Descriptions claires** qui se lisent comme de la documentation fonctionnelle

:::note[Portée]
Le workflow QA génère uniquement des tests. Pour la revue de code et la validation des stories, utilisez plutôt le workflow Code Review (`CR`).
:::

### Quand Utiliser le QA Intégré

- Couverture de test rapide pour une fonctionnalité nouvelle ou existante
- Automatisation de tests accessible aux débutants sans configuration avancée
- Patterns de test standards que tout développeur peut lire et maintenir
- Projets petits et moyens où une stratégie de test complète n'est pas nécessaire

## Module Test Architect (TEA)

TEA est un module autonome qui fournit un agent expert (Murat) et neuf workflows structurés pour des tests de qualité entreprise. Il va au-delà de la génération de tests pour inclure la stratégie de test, la planification basée sur les risques, les murs de qualité et la traçabilité des exigences.

- **Documentation :** [TEA Module Docs](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- **Installation :** `npx bmad-method install` et sélectionnez le module TEA
- **npm :** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)

### Ce que TEA Fournit

| Workflow              | Objectif                                                                             |
|-----------------------|--------------------------------------------------------------------------------------|
| Test Design           | Créer une stratégie de test complète liée aux exigences                              |
| ATDD                  | Développement piloté par les tests d'acceptation avec critères des parties prenantes |
| Automate              | Générer des tests avec des patterns et utilitaires avancés                           |
| Test Review           | Valider la qualité et la couverture des tests par rapport à la stratégie             |
| Traceability          | Remonter les tests aux exigences pour l'audit et la conformité                       |
| NFR Assessment        | Évaluer les exigences non-fonctionnelles (performance, sécurité)                     |
| CI Setup              | Configurer l'exécution des tests dans les pipelines d'intégration continue           |
| Framework Scaffolding | Configurer l'infrastructure de test et la structure du projet                        |
| Release Gate          | Prendre des décisions de livraison go/no-go basées sur les données                   |

TEA supporte également la priorisation basée sur les risques P0-P3 et des intégrations optionnelles avec Playwright Utils et les outils MCP.

### Quand Utiliser TEA

- Projets nécessitant une traçabilité des exigences ou une documentation de conformité
- Équipes ayant besoin d'une priorisation des tests basée sur les risques sur plusieurs fonctionnalités
- Environnements entreprise avec des murs de qualité formels avant livraison
- Domaines complexes où la stratégie de test doit être planifiée avant d'écrire les tests
- Projets ayant dépassé l'approche à workflow unique du QA intégré

## Comment les Tests S'Intègrent dans les Workflows

Le workflow Automate du QA intégré apparaît dans la Phase 4 (Implémentation) de la carte de workflow méthode BMad. Il est conçu pour s'exécuter **après qu'un epic complet soit terminé** — une fois que toutes les stories d'un epic ont été implémentées et revues. Une séquence typique :

1. Pour chaque story de l'epic : implémenter avec Dev Story (`DS`), puis valider avec Code Review (`CR`)
2. Après la fin de l'epic : générer les tests avec `QA` (via l'agent Developer) ou le workflow Automate de TEA
3. Lancer la rétrospective (`bmad-retrospective`) pour capturer les leçons apprises

Le workflow QA travaille directement à partir du code source sans charger les documents de planification (PRD, architecture). Les workflows TEA peuvent s'intégrer avec les artefacts de planification en amont pour la traçabilité.

Pour en savoir plus sur la place des tests dans le processus global, consultez la [Carte des Workflows](./workflow-map.md).

## Glossaire

[^1]: QA (Quality Assurance) : assurance qualité, ensemble des processus et activités visant à garantir que le produit logiciel répond aux exigences de qualité définies.
[^2]: ATDD (Acceptance Test-Driven Development) : méthode de développement où les tests d'acceptation sont écrits avant le code, en collaboration avec les parties prenantes pour définir les critères de réussite.
