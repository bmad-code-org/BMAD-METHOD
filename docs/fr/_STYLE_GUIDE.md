---
title: "Guide de style de la documentation"
description: Conventions de documentation spécifiques au projet, basées sur le style Google et la structure Diataxis
---

Ce projet suit le [Guide de style de documentation pour développeurs Google](https://developers.google.com/style) et utilise [Diataxis](https://diataxis.fr/) pour structurer le contenu. Seules les conventions spécifiques au projet sont présentées ci-dessous.

## Règles spécifiques au projet

| Règle                                   | Spécification                                          |
| --------------------------------------- | ------------------------------------------------------ |
| Pas de règles horizontales (`---`)      | Perturbe le flux de lecture des fragments              |
| Pas de titres `####`                    | Utiliser du texte en gras ou des admonitions           |
| Pas de sections « Related » ou « Next: »    | La barre latérale gère la navigation                   |
| Pas de listes profondément imbriquées   | Diviser en sections à la place                         |
| Pas de blocs de code pour non-code      | Utiliser des admonitions pour les exemples de dialogue |
| Pas de paragraphes en gras pour les appels | Utiliser des admonitions à la place                 |
| 1-2 admonitions max par section         | Les tutoriels permettent 3-4 par section majeure       |
| Cellules de tableau / éléments de liste | 1-2 phrases maximum                                    |
| Budget de titres                        | 8-12 `##` par doc ; 2-3 `###` par section              |

## Admonitions (Syntaxe Starlight)

```md
:::tip[Titre]
Raccourcis, bonnes pratiques
:::

:::note[Titre]
Contexte, définitions, exemples, prérequis
:::

:::caution[Titre]
Mises en garde, problèmes potentiels
:::

:::danger[Titre]
Avertissements critiques uniquement — perte de données, problèmes de sécurité
:::
```

### Utilisations standards

| Admonition                 | Usage                                    |
| -------------------------- | ---------------------------------------- |
| `:::note[Pré-requis]`   | Dépendances avant de commencer           |
| `:::tip[Chemin rapide]`       | Résumé TL;DR en haut du document         |
| `:::caution[Important]`    | Mises en garde critiques                 |
| `:::note[Exemple]`         | Exemples de commandes/réponses           |

## Formats de tableau standards

**Phases :**

```md
| Phase | Nom        | Ce qui se passe                                     |
| ----- | ---------- | --------------------------------------------------- |
| 1     | Analyse    | Brainstorm, recherche *(optionnel)*                 |
| 2     | Planification | Exigences — PRD ou spécification technique *(requis)*          |
```

**Skills :**

```md
| Skill               | Agent   | Objectif                                        |
| ------------------- | ------- | ----------------------------------------------- |
| `bmad-brainstorming` | Analyste | Brainstorming pour un nouveau projet                    |
| `bmad-create-prd`    | PM      | Créer un document d'exigences produit           |
```

## Blocs de structure de dossiers

À afficher dans les sections "Ce que vous avez accompli" :

````md
```
votre-projet/
├── _bmad/                                   # Configuration BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   └── PRD.md                           # Votre document d'exigences
│   ├── implementation-artifacts/
│   └── project-context.md                   # Règles d'implémentation (optionnel)
└── ...
```
````

## Structure des tutoriels

```text
1. Titre + Accroche (1-2 phrases décrivant le résultat)
2. Notice de version/module (admonition info ou avertissement) (optionnel)
3. Ce que vous allez apprendre (liste à puces des résultats)
4. Prérequis (admonition info)
5. Chemin rapide (admonition tip - résumé TL;DR)
6. Comprendre [Sujet] (contexte avant les étapes - tableaux pour phases/agents)
7. Installation (optionnel)
8. Étape 1 : [Première tâche majeure]
9. Étape 2 : [Deuxième tâche majeure]
10. Étape 3 : [Troisième tâche majeure]
11. Ce que vous avez accompli (résumé + structure de dossiers)
12. Référence rapide (tableau des compétences)
13. Questions courantes (format FAQ)
14. Obtenir de l'aide (liens communautaires)
15. Points clés à retenir (admonition tip)
```

### Liste de vérification des tutoriels

- [ ] L'accroche décrit le résultat en 1-2 phrases
- [ ] Section "Ce que vous allez apprendre" présente
- [ ] Prérequis dans une admonition
- [ ] Admonition TL;DR de chemin rapide en haut
- [ ] Tableaux pour phases, skills, agents
- [ ] Section "Ce que vous avez accompli" présente
- [ ] Tableau de référence rapide présent
- [ ] Section questions courantes présente
- [ ] Section obtenir de l'aide présente
- [ ] Admonition points clés à retenir à la fin

## Structure des guides pratiques (How-To)

```text
1. Titre + Accroche (une phrase : « Utilisez le workflow `X` pour... »)
2. Quand utiliser ce guide (liste à puces de scénarios)
3. Quand éviter ce guide (optionnel)
4. Prérequis (admonition note)
5. Étapes (sous-sections ### numérotées)
6. Ce que vous obtenez (produits de sortie/artefacts)
7. Exemple (optionnel)
8. Conseils (optionnel)
9. Prochaines étapes (optionnel)
```

### Liste de vérification des guides pratiques

- [ ] L'accroche commence par « Utilisez le workflow `X` pour... »
- [ ] "Quand utiliser ce guide" contient 3-5 points
- [ ] Prérequis listés
- [ ] Les étapes sont des sous-sections `###` numérotées avec des verbes d'action
- [ ] "Ce que vous obtenez" décrit les artefacts produits

## Structure des explications

### Types

| Type                    | Exemple                              |
| ----------------------- | ------------------------------------ |
| **Index/Page d'accueil** | `core-concepts/index.md`            |
| **Concept**             | `what-are-agents.md`                 |
| **Fonctionnalité**      | `quick-dev.md`                       |
| **Philosophie**         | `why-solutioning-matters.md`         |
| **FAQ**                 | `established-projects-faq.md`        |

### Modèle général

```text
1. Titre + Accroche (1-2 phrases)
2. Vue d'ensemble/Définition (ce que c'est, pourquoi c'est important)
3. Concepts clés (sous-sections ###)
4. Tableau comparatif (optionnel)
5. Quand utiliser / Quand ne pas utiliser (optionnel)
6. Diagramme (optionnel - mermaid, 1 max par doc)
7. Prochaines étapes (optionnel)
```

### Pages d'index/d'accueil

```text
1. Titre + Accroche (une phrase)
2. Tableau de contenu (liens avec descriptions)
3. Pour commencer (liste numérotée)
4. Choisissez votre parcours (optionnel - arbre de décision)
```

### Explications de concepts

```text
1. Titre + Accroche (ce que c'est)
2. Types/Catégories (sous-sections ###) (optionnel)
3. Tableau des différences clés
4. Composants/Parties
5. Lequel devriez-vous utiliser ?
6. Création/Personnalisation (lien vers les guides pratiques)
```

### Explications de fonctionnalités

```text
1. Titre + Accroche (ce que cela fait)
2. Faits rapides (optionnel - "Idéal pour :", "Temps :")
3. Quand utiliser / Quand ne pas utiliser
4. Comment cela fonctionne (diagramme mermaid optionnel)
5. Avantages clés
6. Tableau comparatif (optionnel)
7. Quand évoluer/mettre à niveau (optionnel)
```

### Documents de philosophie/justification

```text
1. Titre + Accroche (le principe)
2. Le problème
3. La solution
4. Principes clés (sous-sections ###)
5. Avantages
6. Quand cela s'applique
```

### Liste de vérification des explications

- [ ] L'accroche énonce ce que le document explique
- [ ] Contenu dans des sections `##` parcourables
- [ ] Tableaux comparatifs pour 3+ options
- [ ] Les diagrammes ont des étiquettes claires
- [ ] Liens vers les guides pratiques pour les questions procédurales
- [ ] 2-3 admonitions max par document

## Structure des références

### Types

| Type                    | Exemple               |
| ----------------------- | --------------------- |
| **Index/Page d'accueil** | `workflows/index.md` |
| **Catalogue**           | `agents/index.md`     |
| **Approfondissement**   | `document-project.md` |
| **Configuration**       | `core-tasks.md`       |
| **Glossaire**           | `glossary/index.md`   |
| **Complet**             | `bmgd-workflows.md`   |

### Pages d'index de référence

```text
1. Titre + Accroche (une phrase)
2. Sections de contenu (## pour chaque catégorie)
   - Liste à puces avec liens et descriptions
```

### Référence de catalogue

```text
1. Titre + Accroche
2. Éléments (## pour chaque élément)
   - Brève description (une phrase)
   - **Skills :** ou **Infos clés :** sous forme de liste simple
3. Universel/Partagé (## section) (optionnel)
```

### Référence d'approfondissement d'élément

```text
1. Titre + Accroche (objectif en une phrase)
2. Faits rapides (admonition note optionnelle)
   - Module, Skill, Entrée, Sortie sous forme de liste
3. Objectif/Vue d'ensemble (## section)
4. Comment invoquer (bloc de code)
5. Sections clés (## pour chaque aspect)
   - Utiliser ### pour les sous-options
6. Notes/Mises en garde (admonition tip ou caution)
```

### Référence de configuration

```text
1. Titre + Accroche
2. Table des matières (liens de saut si 4+ éléments)
3. Éléments (## pour chaque config/tâche)
   - **Résumé en gras** — une phrase
   - **Utilisez-le quand :** liste à puces
   - **Comment cela fonctionne :** étapes numérotées (3-5 max)
   - **Sortie :** résultat attendu (optionnel)
```

### Guide de référence complet

```text
1. Titre + Accroche
2. Vue d'ensemble (## section)
   - Diagramme ou tableau montrant l'organisation
3. Sections majeures (## pour chaque phase/catégorie)
   - Éléments (### pour chaque élément)
   - Champs standardisés : Skill, Agent, Entrée, Sortie, Description
4. Prochaines étapes (optionnel)
```

### Liste de vérification des références

- [ ] L'accroche énonce ce que le document référence
- [ ] La structure correspond au type de référence
- [ ] Les éléments utilisent une structure cohérente
- [ ] Tableaux pour les données structurées/comparatives
- [ ] Liens vers les documents d'explication pour la profondeur conceptuelle
- [ ] 1-2 admonitions max

## Structure du glossaire

Starlight génère la navigation "Sur cette page" à droite à partir des titres :

- Catégories en tant que titres `##` — apparaissent dans la navigation à droite
- Termes dans des tableaux — lignes compactes, pas de titres individuels
- Pas de TOC en ligne — la barre latérale à droite gère la navigation

### Format de tableau

```md
## Nom de catégorie

| Terme        | Définition                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Agent**    | Personnalité IA spécialisée avec une expertise spécifique qui guide les utilisateurs dans les workflows. |
| **Workflow** | Processus guidé en plusieurs étapes qui orchestre les activités des agents IA pour produire des livrables. |
```

### Règles de définition

| À faire                           | À ne pas faire                                |
| --------------------------------- | --------------------------------------------- |
| Commencer par ce que c'est ou ce que cela fait | Commencer par « C'est... » ou « Un [terme] est... » |
| Se limiter à 1-2 phrases          | Écrire des explications de plusieurs paragraphes |
| Mettre le nom du terme en gras dans la cellule | Utiliser du texte simple pour les termes      |

### Marqueurs de contexte

Ajouter un contexte en italique au début de la définition pour les termes à portée limitée :

- `*Quick Dev uniquement.*`
- `*méthode BMad/Enterprise.*`
- `*Phase N.*`
- `*BMGD.*`
- `*Projets établis.*`

### Liste de vérification du glossaire

- [ ] Termes dans des tableaux, pas de titres individuels
- [ ] Termes alphabétisés au sein des catégories
- [ ] Définitions de 1-2 phrases
- [ ] Marqueurs de contexte en italique
- [ ] Noms des termes en gras dans les cellules
- [ ] Pas de définitions « Un [terme] est... »

## Sections FAQ

```md
## Questions

- [Ai-je toujours besoin d'architecture ?](#ai-je-toujours-besoin-darchitecture)
- [Puis-je modifier mon plan plus tard ?](#puis-je-modifier-mon-plan-plus-tard)

### Ai-je toujours besoin d'architecture ?

Uniquement pour les parcours méthode BMad et Enterprise. Quick Dev passe directement à l'implémentation.

### Puis-je modifier mon plan plus tard ?

Oui. Utilisez `bmad-correct-course` pour gérer les changements de portée.

**Une question sans réponse ici ?** [Ouvrez une issue](...) ou posez votre question sur [Discord](...).
```

## Commandes de validation

Avant de soumettre des modifications de documentation :

```bash
npm run docs:fix-links            # Prévisualiser les corrections de format de liens
npm run docs:fix-links -- --write # Appliquer les corrections
npm run docs:validate-links       # Vérifier que les liens existent
npm run docs:build                # Vérifier l'absence d'erreurs de build
```
