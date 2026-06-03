---
title: "Gérer le contexte du projet"
description: Créer et maintenir project-context.md pour guider les agents IA
sidebar:
  order: 8
---

Utilisez le fichier `project-context.md` pour garantir que les agents IA respectent les préférences techniques et les règles d'implémentation de votre projet tout au long des workflows. Pour vous assurer qu'il est toujours disponible, vous pouvez également ajouter la ligne `Le contexte et les conventions importantes du projet se trouvent dans [chemin vers le contexte du projet]/project-context.md` à votre fichier de contexte ou de règles permanentes (comme `AGENTS.md`).

:::note[Prérequis]
- Méthode BMad installée
- Connaissance de la pile technologique et des conventions de votre projet
:::

## Quand utiliser cette fonctionnalité

- Vous avez des préférences techniques fortes avant de commencer l'architecture
- Vous avez terminé l'architecture et souhaitez consigner les décisions pour l'implémentation
- Vous travaillez sur une base de code existante avec des patterns établis
- Vous remarquez que les agents prennent des décisions incohérentes entre les stories

## Étape 1 : Choisissez votre approche

**Création manuelle** — Idéal lorsque vous savez exactement quelles règles vous souhaitez documenter

**Génération après l'architecture** — Idéal pour capturer les décisions prises lors du solutioning

**Génération pour les projets existants** — Idéal pour découvrir les patterns dans les bases de code existantes

## Étape 2 : Créez le fichier

### Option A : Création manuelle

Créez le fichier à l'emplacement `_bmad-output/project-context.md` :

```bash
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Ajoutez votre pile technologique et vos règles d'implémentation :

```markdown
---
project_name: 'MonProjet'
user_name: 'VotreNom'
date: '2026-02-15'
sections_completed: ['technology_stack', 'critical_rules']
---

# Contexte de Projet pour Agents IA

## Pile Technologique & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State : Zustand
- Tests : Vitest, Playwright
- Styles : Tailwind CSS

## Règles d'Implémentation Critiques

**TypeScript :**
- Mode strict activé, pas de types `any`
- Utiliser `interface` pour les API publiques, `type` pour les unions

**Organisation du Code :**
- Composants dans `/src/components/` avec tests co-localisés
- Les appels API utilisent le singleton `apiClient` — jamais de fetch direct

**Tests :**
- Tests unitaires axés sur la logique métier
- Tests d'intégration utilisent MSW pour le mock API
```

### Option B : Génération après l'architecture

Exécutez le workflow dans une nouvelle conversation :

```bash
bmad-generate-project-context
```

Le workflow analyse votre document d'architecture et vos fichiers projet pour générer un fichier de contexte qui capture les décisions prises.

### Option C : Génération pour les projets existants

Pour les projets existants, exécutez :

```bash
bmad-generate-project-context
```

Le workflow analyse votre base de code pour identifier les conventions, puis génère un fichier de contexte que vous pouvez réviser et affiner.

## Étape 3 : Vérifiez le contenu

Révisez le fichier généré et assurez-vous qu'il capture :

- Les versions correctes des technologies
- Vos conventions réelles (pas les bonnes pratiques génériques)
- Les règles qui évitent les erreurs courantes
- Les patterns spécifiques aux frameworks

Modifiez manuellement pour ajouter les éléments manquants ou supprimer les inexactitudes.

## Ce que vous obtenez

Un fichier `project-context.md` qui :

- Garantit que tous les agents suivent les mêmes conventions
- Évite les décisions incohérentes entre les stories
- Capture les décisions d'architecture pour l'implémentation
- Sert de référence pour les patterns et règles de votre projet

## Conseils

:::tip[Bonnes pratiques]
- **Concentrez-vous sur ce qui n'est pas évident** — Documentez les patterns que les agents pourraient manquer (par ex. « Utiliser JSDoc sur chaque classe publique »), et non les pratiques universelles comme « utiliser des noms de variables significatifs ».
- **Gardez-le concis** — Ce fichier est chargé par chaque workflow d'implémentation. Les fichiers longs gaspillent le contexte. Excluez le contenu qui ne s'applique qu'à un périmètre restreint ou à des stories spécifiques.
- **Mettez à jour si nécessaire** — Modifiez manuellement lorsque les patterns changent, ou régénérez après des changements d'architecture significatifs.
- Fonctionne aussi bien pour Quick Dev que pour les projets complets méthode BMad.
:::

## Prochaines étapes

- [**Explication du contexte projet**](../explanation/project-context.md) — En savoir plus sur son fonctionnement
- [**Carte des workflows**](../reference/workflow-map.md) — Voir quels workflows chargent le contexte projet
