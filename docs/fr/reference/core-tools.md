---
title: Outils Principaux
description: Référence pour toutes les tâches et tous les workflows intégrés disponibles dans chaque installation BMad sans modules supplémentaires.
sidebar:
  order: 2
---

Chaque installation BMad comprend un ensemble de compétences principales qui peuvent être utilisées conjointement avec tout ce que vous faites — des tâches et des workflows autonomes qui fonctionnent dans tous les projets, tous les modules et toutes les phases. Ceux-ci sont toujours disponibles, quels que soient les modules optionnels que vous installez.

:::tip[Raccourci Rapide]
Exécutez n'importe quel outil principal en tapant son nom de compétence (par ex., `bmad-help`) dans votre IDE. Aucune session d'agent requise.
:::

## Vue d'ensemble

| Outil                                                                 | Type     | Objectif                                                                     |
|-----------------------------------------------------------------------|----------|------------------------------------------------------------------------------|
| [`bmad-help`](#bmad-help)                                             | Tâche    | Obtenir des conseils contextuels sur la prochaine étape                      |
| [`bmad-brainstorming`](#bmad-brainstorming)                           | Workflow | Faciliter des sessions de brainstorming interactives                         |
| [`bmad-party-mode`](#bmad-party-mode)                                 | Workflow | Orchestrer des discussions de groupe multi-agents                            |
| [`bmad-distillator`](#bmad-distillator)                               | Tâche    | Compression sans perte optimisée pour LLM de documents                       |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation)             | Tâche    | Pousser la sortie LLM à travers des méthodes de raffinement itératives       |
| [`bmad-review-adversarial-general`](#bmad-review-adversarial-general) | Tâche    | Revue cynique qui trouve ce qui manque et ce qui ne va pas                   |
| [`bmad-review-edge-case-hunter`](#bmad-review-edge-case-hunter)       | Tâche    | Analyse exhaustive des chemins de branchement pour les cas limites non gérés |
| [`bmad-editorial-review-prose`](#bmad-editorial-review-prose)         | Tâche    | Révision de copie clinique pour la clarté de communication                   |
| [`bmad-editorial-review-structure`](#bmad-editorial-review-structure) | Tâche    | Édition structurelle — coupes, fusions et réorganisation                     |
| [`bmad-shard-doc`](#bmad-shard-doc)                                   | Tâche    | Diviser les fichiers markdown volumineux en sections organisées              |
| [`bmad-index-docs`](#bmad-index-docs)                                 | Tâche    | Générer ou mettre à jour un index de tous les documents dans un dossier      |

## bmad-help

**Votre guide intelligent pour la suite.** — Inspecte l'état de votre projet, détecte ce qui a été fait et recommande la prochaine étape requise ou facultative.

**Utilisez-le quand :**

- Vous avez terminé un workflow et voulez savoir ce qui suit
- Vous êtes nouveau sur BMad et avez besoin d'orientation
- Vous êtes bloqué et voulez des conseils contextuels
- Vous avez installé de nouveaux modules et voulez voir ce qui est disponible

**Fonctionnement :**

1. Analyse votre projet pour les artefacts existants (PRD, architecture, stories, etc.)
2. Détecte quels modules sont installés et leurs workflows disponibles
3. Recommande les prochaines étapes par ordre de priorité — étapes requises d'abord, puis facultatives
4. Présente chaque recommandation avec la commande de compétence et une brève description

**Entrée :** Requête optionnelle en langage naturel (par ex., `bmad-help J'ai une idée de SaaS, par où commencer ?`)

**Sortie :** Liste priorisée des prochaines étapes recommandées avec les commandes de compétence

## bmad-brainstorming

**Génère des idées diverses à travers des techniques créatives interactives.** — Une session de brainstorming facilitée qui charge des méthodes d'idéation éprouvées depuis une bibliothèque de techniques et vous guide vers plus de 100 idées avant organisation.

**Utilisez-le quand :**

- Vous commencez un nouveau projet et devez explorer l’espace problème
- Vous êtes bloqué dans la génération d'idées et avez besoin de créativité structurée
- Vous voulez utiliser des cadres d'idéation éprouvés (SCAMPER, brainstorming inversé, etc.)

**Fonctionnement :**

1. Configure une session de brainstorming avec votre sujet
2. Charge les techniques créatives depuis une bibliothèque de méthodes
3. Vous guide à travers technique après technique, générant des idées
4. Applique un protocole anti-biais — change de domaine créatif toutes les 10 idées pour éviter le regroupement
5. Produit un document de session en mode ajout uniquement avec toutes les idées organisées par technique

**Entrée :** Sujet de brainstorming ou énoncé de problème, fichier de contexte optionnel

**Sortie :** `brainstorming-session-{date}.md` avec toutes les idées générées

:::note[Cible de Quantité]
La magie se produit dans les idées 50–100. Le workflow encourage la génération de plus de 100 idées avant organisation.
:::

## bmad-party-mode

**Orchestre des discussions de groupe multi-agents.** — Charge tous les agents BMad installés et facilite une conversation naturelle où chaque agent contribue depuis son expertise et personnalité uniques.

**Utilisez-le quand :**

- Vous avez besoin de multiples perspectives d'experts sur une décision
- Vous voulez que les agents remettent en question les hypothèses des autres
- Vous explorez un sujet complexe qui couvre plusieurs domaines

**Fonctionnement :**

1. Charge le manifeste d'agents avec toutes les personnalités d'agents installées
2. Analyse votre sujet pour sélectionner les 2–3 agents les plus pertinents
3. Les agents prennent des tours pour contribuer, avec des échanges naturels et des désaccords
4. Fait rouler la participation des agents pour assurer des perspectives diverses au fil du temps
5. Quittez avec `goodbye`, `end party` ou `quit`

**Entrée :** Sujet de discussion ou question, ainsi que la spécification des personas que vous souhaitez faire participer (optionnel)

**Sortie :** Conversation multi-agents en temps réel avec des personnalités d'agents maintenues

## bmad-distillator

**Compression sans perte optimisée pour LLM de documents sources.** — Produit des distillats denses et efficaces en tokens qui préservent toute l'information pour la consommation par des LLM en aval. Vérifiable par reconstruction aller-retour.

**Utilisez-le quand :**

- Un document est trop volumineux pour la fenêtre de contexte d'un LLM
- Vous avez besoin de versions économes en tokens de recherches, spécifications ou artefacts de planification
- Vous voulez vérifier qu'aucune information n'est perdue pendant la compression
- Les agents auront besoin de référencer et de trouver fréquemment des informations dedans

**Fonctionnement :**

1. **Analyser** — Lit les documents sources, identifie la densité d'information et la structure
2. **Compresser** — Convertit la prose en format dense de liste de points, supprime le formatage décoratif
3. **Vérifier** — Vérifie l'exhaustivité pour s'assurer que toute l'information originale est préservée
4. **Valider** (optionnel) — Le test de reconstruction aller-retour prouve la compression sans perte

**Entrée :**

- `source_documents` (requis) — Chemins de fichiers, chemins de dossiers ou motifs glob
- `downstream_consumer` (optionnel) — Ce qui va le consommer (par ex., "création de PRD")
- `token_budget` (optionnel) — Taille cible approximative
- `--validate` (drapeau) — Exécuter le test de reconstruction aller-retour

**Sortie :** Fichier(s) markdown distillé(s) avec rapport de ratio de compression (par ex., "3.2:1")

## bmad-advanced-elicitation

**Passer la sortie du LLM à travers des méthodes de raffinement itératives.** — Sélectionne depuis une bibliothèque de techniques d'élicitation pour améliorer systématiquement le contenu à travers multiples passages.

**Utilisez-le quand :**

- La sortie du LLM semble superficielle ou générique
- Vous voulez explorer un sujet depuis de multiples angles analytiques
- Vous raffinez un document critique et voulez une réflexion plus approfondie

**Fonctionnement :**

1. Charge le registre de méthodes avec plus de 5 techniques d'élicitation
2. Sélectionne les 5 méthodes les mieux adaptées selon le type de contenu et la complexité
3. Présente un menu interactif — choisissez une méthode, remélangez, ou listez tout
4. Applique la méthode sélectionnée pour améliorer le contenu
5. Re-présente les options pour l'amélioration itérative jusqu'à ce que vous sélectionniez "Procéder"

**Entrée :** Section de contenu à améliorer

**Sortie :** Version améliorée du contenu avec les améliorations appliquées

## bmad-review-adversarial-general

**Revue contradictoire qui suppose que des problèmes existent et les recherche.** — Adopte une perspective de réviseur sceptique et blasé avec zéro tolérance pour le travail bâclé. Cherche ce qui manque, pas seulement ce qui ne va pas.

**Utilisez-le quand :**

- Vous avez besoin d'assurance qualité avant de finaliser un livrable
- Vous voulez tester en conditions réelles une spécification, story ou document
- Vous voulez trouver des lacunes de couverture que les revues optimistes manquent

**Fonctionnement :**

1. Lit le contenu avec une perspective contradictoire et critique
2. Identifie les problèmes à travers l'exhaustivité, la justesse et la qualité
3. Recherche spécifiquement ce qui manque — pas seulement ce qui est présent et faux
4. Doit trouver un minimum de 10 problèmes ou réanalyse plus profondément

**Entrée :**

- `content` (requis) — Diff, spécification, story, document ou tout artefact
- `also_consider` (optionnel) — Domaines supplémentaires à garder à l'esprit

**Sortie :** Liste markdown de plus de 10 constatations avec descriptions

## bmad-review-edge-case-hunter

**Parcours tous les chemins de branchement et les conditions limites, ne rapporte que les cas non gérés.** — Méthodologie pure de traçage de chemin[^1] qui dérive mécaniquement les classes de cas limites. Orthogonale à la revue contradictoire — centrée sur la méthode, pas sur l'attitude.

**À utiliser quand :**

- Vous souhaitez une couverture exhaustive des cas limites pour le code ou la logique
- Vous avez besoin d'un complément à la revue contradictoire (méthodologie différente, résultats différents)
- Vous révisez un diff ou une fonction pour des conditions limites

**Fonctionnement :**

1. Énumère tous les chemins de branchement dans le contenu
2. Dérive mécaniquement les classes de cas limites : else/default manquants, entrées non vérifiées, décalage d’unité, overflow arithmétique, coercition implicite des types, conditions de concurrence, écarts de timeout
3. Teste chaque chemin contre les protections existantes
4. Ne rapporte que les chemins non gérés — ignore silencieusement les chemins gérés

**Entrée :**

- `content` (obligatoire) — Diff, fichier complet ou fonction
- `also_consider` (facultatif) — Zones supplémentaires à garder à l’esprit

**Sortie :** Tableau JSON des résultats, chacun avec `location`, `trigger_condition`, `guard_snippet` et `potential_consequence`

:::note[Revue Complémentaire]
Exécutez à la fois `bmad-review-adversarial-general` et `bmad-review-edge-case-hunter` pour une couverture orthogonale. La revue contradictoire détecte les problèmes de qualité et de complétude ; le chasseur de cas limites détecte les chemins non gérés.
:::

## bmad-editorial-review-prose

**Relecture éditoriale clinique centrée sur la clarté de communication.** — Analyse le texte pour détecter les problèmes qui nuisent à la compréhension. Applique le Microsoft Writing Style Guide baseline. Préserve la voix de l’auteur.

**À utiliser quand :**

- Vous avez rédigé un document et souhaitez polir le style
- Vous devez assurer la clarté pour un public spécifique
- Vous voulez des corrections de communication sans modifier les choix stylistiques

**Fonctionnement :**

1. Lit le contenu en ignorant les blocs de code et le frontmatter
2. Identifie les problèmes de communication (pas les préférences de style)
3. Déduit les doublons du même problème à différents emplacements
4. Produit un tableau de corrections en trois colonnes

**Entrée :**

- `content` (obligatoire) — Markdown, texte brut ou XML
- `style_guide` (facultatif) — Guide de style spécifique au projet
- `reader_type` (facultatif) — `humans` (par défaut) pour clarté/fluide, ou `llm` pour précision/consistance

**Sortie :** Tableau Markdown en trois colonnes : Texte original | Texte révisé | Modifications

## bmad-editorial-review-structure

**Édition structurelle — propose des coupes, fusions, déplacements et condensations.** — Révise l'organisation du document et propose des changements substantiels pour améliorer la clarté et le flux avant la révision de copie.

**Utilisez-le quand :**

- Un document a été produit depuis de multiples sous-processus et a besoin de cohérence structurelle
- Vous voulez réduire la longueur du document tout en préservant la compréhension
- Vous devez identifier les violations de portée ou les informations critiques enfouies

**Fonctionnement :**

1. Analyse le document contre 5 modèles de structure (Tutoriel, Référence, Explication, Prompt, Stratégique)
2. Identifie les redondances, violations de portée et informations enfouies
3. Produit des recommandations priorisées : COUPER, FUSIONNER, DÉPLACER, CONDENSER, QUESTIONNER, PRÉSERVER
4. Estime la réduction totale en mots et pourcentage

**Entrée :**

- `content` (requis) — Document à réviser
- `purpose` (optionnel) — Objectif prévu (par ex., "tutoriel de démarrage rapide")
- `target_audience` (optionnel) — Qui lit ceci
- `reader_type` (optionnel) — `humans` ou `llm`
- `length_target` (optionnel) — Réduction cible (par ex., "30% plus court")

**Sortie :** Résumé du document, liste de recommandations priorisées et réduction estimée

## bmad-shard-doc

**Diviser les fichiers markdown volumineux en fichiers de sections organisés.** — Utilise les en-têtes de niveau 2 comme points de division pour créer un dossier de fichiers de sections autonomes avec un index.

**Utilisez-le quand :**

- Un document markdown est devenu trop volumineux pour être géré efficacement (plus de 500 lignes)
- Vous voulez diviser un document monolithique en sections navigables
- Vous avez besoin de fichiers séparés pour l'édition parallèle ou la gestion de contexte LLM

**Fonctionnement :**

1. Valide que le fichier source existe et est markdown
2. Divise sur les en-têtes de niveau 2 (`##`) en fichiers de sections numérotées
3. Crée un `index.md` avec manifeste de sections et liens
4. Vous invite à supprimer, archiver ou conserver l'original

**Entrée :** Chemin du fichier markdown source, dossier de destination optionnel

**Sortie :** Dossier avec `index.md` et `01-{section}.md`, `02-{section}.md`, etc.

## bmad-index-docs

**Générer ou mettre à jour un index de tous les documents dans un dossier.** — Analyse un répertoire, lit chaque fichier pour comprendre son objectif et produit un `index.md` organisé avec liens et descriptions.

**Utilisez-le quand :**

- Vous avez besoin d'un index léger pour un scan LLM rapide des documents disponibles
- Un dossier de documentation a grandi et a besoin d'une table des matières organisée
- Vous voulez un aperçu auto-généré qui reste à jour

**Fonctionnement :**

1. Analyse le répertoire cible pour tous les fichiers non cachés
2. Lit chaque fichier pour comprendre son objectif réel
3. Groupe les fichiers par type, objectif ou sous-répertoire
4. Génère des descriptions concises (3–10 mots chacune)

**Entrée :** Chemin du dossier cible

**Sortie :** `index.md` avec listes de fichiers organisées, liens relatifs et brèves descriptions

## Glossaire

[^1]: Path-tracing : méthode d'analyse qui suit systématiquement tous les chemins d'exécution possibles dans un programme pour identifier les cas non gérés.

