---
title: "Contexte du Projet"
description: Comment project-context.md guide les agents IA avec les règles et préférences de votre projet
sidebar:
  order: 7
---

Le fichier `project-context.md` est le guide d'implémentation de votre projet pour les agents IA. Similaire à une « constitution » dans d'autres systèmes de développement, il capture les règles, les patterns et les préférences qui garantissent une génération de code cohérente à travers tous les workflows.

## Ce Qu'il Fait

Les agents IA prennent constamment des décisions d'implémentation — quels patterns suivre, comment structurer le code, quelles conventions utiliser. Sans guidance claire, ils peuvent :
- Suivre des bonnes pratiques génériques qui ne correspondent pas à votre codebase
- Prendre des décisions incohérentes selon les différentes stories
- Passer à côté d'exigences ou de contraintes spécifiques au projet

Le fichier `project-context.md` résout ce problème en documentant ce que les agents doivent savoir dans un format concis et optimisé pour les LLM.

## Comment Ça Fonctionne

Chaque workflow d'implémentation charge automatiquement `project-context.md` s'il existe. Le workflow architecte le charge également pour respecter vos préférences techniques lors de la conception de l'architecture.

**Chargé par ces workflows :**
- `bmad-create-architecture` — respecte les préférences techniques pendant la phase de solutioning
- `bmad-create-story` — informe la création de stories avec les patterns du projet
- `bmad-dev-story` — guide les décisions d'implémentation
- `bmad-code-review` — valide par rapport aux standards du projet
- `bmad-quick-dev` — applique les patterns lors de l'implémentation des spécifications techniques
- `bmad-sprint-planning`, `bmad-retrospective`, `bmad-correct-course` — fournit le contexte global du projet

## Quand Le Créer

Le fichier `project-context.md` est utile à n'importe quel stade d'un projet :

| Scénario                                 | Quand Créer                                         | Objectif                                                                              |
|------------------------------------------|-----------------------------------------------------|---------------------------------------------------------------------------------------|
| **Nouveau projet, avant l'architecture** | Manuellement, avant `bmad-create-architecture`      | Documenter vos préférences techniques pour que l'architecte les respecte              |
| **Nouveau projet, après l'architecture** | Via `bmad-generate-project-context` ou manuellement | Capturer les décisions d'architecture pour les agents d'implémentation                |
| **Projet existant**                      | Via `bmad-generate-project-context`                 | Découvrir les patterns existants pour que les agents suivent les conventions établies |
| **Projet Quick Dev**                   | Avant ou pendant `bmad-quick-dev`                   | Garantir que l'implémentation rapide respecte vos patterns                            |

:::tip[Recommandé]
Pour les nouveaux projets, créez-le manuellement avant l'architecture si vous avez de fortes préférences techniques. Sinon, générez-le après l'architecture pour capturer ces décisions.
:::

## Ce Qu'il Contient

Le fichier a deux sections principales :

### Pile Technologique & Versions

Documente les frameworks, langages et outils utilisés par votre projet avec leurs versions spécifiques :

```markdown
## Pile Technologique & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand (pas Redux)
- Testing: Vitest, Playwright, MSW
- Styling: Tailwind CSS avec design tokens personnalisés
```

### Règles Critiques d’Implémentation

Documente les patterns et conventions que les agents pourraient autrement manquer :

```markdown

## Règles Critiques d’Implémentation

**Configuration TypeScript :**
- Mode strict activé — pas de types `any` sans approbation explicite
- Utiliser `interface` pour les APIs publiques, `type` pour les unions/intersections

**Organisation du Code :**
- Composants dans `/src/components/` avec fichiers `.test.tsx` co-localisés
- Utilitaires dans `/src/lib/` pour les fonctions pures réutilisables
- Les appels API utilisent le singleton `apiClient` — jamais de fetch direct

**Patterns de Tests :**
- Les tests unitaires se concentrent sur la logique métier, pas sur les détails d’implémentation
- Les tests d’intégration utilisent MSW pour simuler les réponses API
- Les tests E2E couvrent uniquement les parcours utilisateurs critiques

**Spécifique au Framework :**
- Toutes les opérations async utilisent le wrapper `handleError` pour une gestion cohérente des erreurs
- Les feature flags sont accessibles via `featureFlag()` de `@/lib/flags`
- Les nouvelles routes suivent le modèle de routage basé sur les fichiers dans `/src/app/`
```

Concentrez-vous sur ce qui est **non évident** — des choses que les agents pourraient ne pas déduire en lisant des extraits de code. Ne documentez pas les pratiques standard qui s'appliquent universellement.

## Création du Fichier

Vous avez trois options :

### Création Manuelle

Créez le fichier `_bmad-output/project-context.md` et ajoutez vos règles :

```bash
# Depuis la racine du projet
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Éditez-le avec votre pile technologique et vos règles d'implémentation. Les workflows architecture et implémentation le trouveront et le chargeront automatiquement.

### Générer Après L'Architecture

Exécutez le workflow `bmad-generate-project-context` après avoir terminé votre architecture :

```bash
bmad-generate-project-context
```

Cela analyse votre document d'architecture et vos fichiers projet pour générer un fichier de contexte capturant les décisions prises.

### Générer Pour Les Projets Existants

Pour les projets existants, exécutez `bmad-generate-project-context` pour découvrir les patterns existants :

```bash
bmad-generate-project-context
```

Le workflow analyse votre codebase pour identifier les conventions, puis génère un fichier de contexte que vous pouvez examiner et affiner.

## Pourquoi C'est Important

Sans `project-context.md`, les agents font des suppositions qui peuvent ne pas correspondre à votre projet :

| Sans Contexte                                      | Avec Contexte                                   |
|----------------------------------------------------|-------------------------------------------------|
| Utilise des patterns génériques                    | Suit vos conventions établies                   |
| Style incohérent selon les stories                 | Implémentation cohérente                        |
| Peut manquer les contraintes spécifiques au projet | Respecte toutes les exigences techniques        |
| Chaque agent décide indépendamment                 | Tous les agents s'alignent sur les mêmes règles |

C'est particulièrement important pour :
- **Quick Dev** — saute le PRD et l'architecture, le fichier de contexte comble le vide
- **Projets d'équipe** — garantit que tous les agents suivent les mêmes standards
- **Projets existants** — empêche de casser les patterns établis

## Édition et Mise à Jour

Le fichier `project-context.md` est un document vivant. Mettez-le à jour quand :

- Les décisions d'architecture changent
- De nouvelles conventions sont établies
- Les patterns évoluent pendant l'implémentation
- Vous identifiez des lacunes dans le comportement des agents

Vous pouvez l'éditer manuellement à tout moment, ou réexécuter `bmad-generate-project-context` pour le mettre à jour après des changements significatifs.

:::note[Emplacement du Fichier]
L'emplacement par défaut est `_bmad-output/project-context.md`. Les workflows le recherchent là, et vérifient également `**/project-context.md` n'importe où dans votre projet.
:::
