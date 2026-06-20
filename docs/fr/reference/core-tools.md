---
title: Outils Principaux
description: Référence pour toutes les tâches et tous les workflows intégrés disponibles dans chaque installation BMad sans modules supplémentaires.
sidebar:
  order: 3
---

Chaque installation BMad comprend un ensemble de compétences principales utilisables en complément de tout ce que vous faites — des tâches et des workflows autonomes qui fonctionnent dans tous les projets, tous les modules et toutes les phases. Elles restent toujours disponibles, quels que soient les modules optionnels que vous installez.

:::tip[Raccourci Rapide]
Exécutez n’importe quel outil principal en tapant son nom de compétence (par ex., `bmad-help`) dans votre IDE. Aucune session d’agent requise.
:::

## Vue d’ensemble

| Outil                                                                 | Type     | Objectif                                                                      |
|-----------------------------------------------------------------------|----------|-------------------------------------------------------------------------------|
| [`bmad-help`](#bmad-help)                                             | Tâche    | Obtenir des conseils contextuels sur la prochaine étape                       |
| [`bmad-brainstorming`](#bmad-brainstorming)                           | Workflow | Faciliter des sessions de brainstorming interactives                          |
| [`bmad-party-mode`](#bmad-party-mode)                                 | Workflow | Orchestrer des discussions de groupe multi-agents                             |
| [`bmad-spec`](#bmad-spec)                                             | Workflow | Distiller toute formulation d’intention en un noyau SPEC et fichiers associés |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation)             | Tâche    | Soumettre la sortie LLM à des méthodes de raffinement itératives              |
| [`bmad-review-adversarial-general`](#bmad-review-adversarial-general) | Tâche    | Revue cynique qui traque ce qui manque et ce qui ne va pas                    |
| [`bmad-review-edge-case-hunter`](#bmad-review-edge-case-hunter)       | Tâche    | Analyse exhaustive des chemins de branchement pour les cas limites non gérés  |
| [`bmad-editorial-review-prose`](#bmad-editorial-review-prose)         | Tâche    | Correction éditoriale clinique pour la clarté de communication                |
| [`bmad-editorial-review-structure`](#bmad-editorial-review-structure) | Tâche    | Édition structurelle — coupes, fusions et réorganisation                      |
| [`bmad-shard-doc`](#bmad-shard-doc)                                   | Tâche    | Diviser les fichiers markdown volumineux en sections organisées               |
| [`bmad-index-docs`](#bmad-index-docs)                                 | Tâche    | Générer ou mettre à jour un index de tous les documents dans un dossier       |
| [`bmad-customize`](#bmad-customize)                                   | Tâche    | Créer et vérifier des personnalisations BMad                                  |

## bmad-help

**Votre guide intelligent pour la suite.** — Inspecte l’état de votre projet, détecte ce qui a été fait et recommande la prochaine étape requise ou facultative.

**À utiliser quand :**

- Vous avez terminé un workflow et voulez savoir quoi faire ensuite
- Vous êtes nouveau sur BMad et avez besoin d’orientation
- Vous êtes bloqué et voulez des conseils contextuels
- Vous avez installé de nouveaux modules et voulez voir ce qui est disponible

**Fonctionnement :**

1. Analyse votre projet pour détecter les artefacts existants (PRD, architecture, stories, etc.)
2. Détecte quels modules sont installés et leurs workflows disponibles
3. Recommande les prochaines étapes par ordre de priorité — étapes requises d’abord, puis facultatives
4. Présente chaque recommandation avec la commande de compétence et une brève description

**Entrée :** Requête optionnelle en langage naturel (par ex., `bmad-help J'ai une idée de SaaS, par où commencer ?`)

**Sortie :** Liste priorisée des prochaines étapes recommandées avec les commandes de compétence

## bmad-brainstorming

**Génère des idées variées grâce à des techniques créatives interactives.** — Une session de brainstorming facilitée qui charge des méthodes d’idéation éprouvées à partir d’une bibliothèque de techniques et vous guide vers plus de 100 idées avant de les organiser.

**À utiliser quand :**

- Vous commencez un nouveau projet et devez explorer l’espace problème
- Vous êtes bloqué dans la génération d’idées et avez besoin de créativité structurée
- Vous voulez utiliser des cadres d’idéation éprouvés (SCAMPER, brainstorming inversé, etc.)

**Fonctionnement :**

1. Configure une session de brainstorming avec votre sujet
2. Charge les techniques créatives à partir d’une bibliothèque de méthodes
3. Vous guide de technique en technique, en générant des idées
4. Applique un protocole anti-biais — bascule de domaine créatif toutes les 10 idées pour éviter les biais de regroupement
5. Produit un document de session en mode ajout uniquement avec toutes les idées organisées par technique

**Entrée :** Sujet de brainstorming ou énoncé de problème, fichier de contexte optionnel

**Sortie :** `brainstorming-session-{date}.md` avec toutes les idées générées

:::note[Cible de Quantité]
La magie se produit dans les idées 50–100. Le workflow encourage la génération de plus de 100 idées avant organisation.
:::

## bmad-party-mode

**Orchestre des discussions de groupe multi-agents.** — Charge tous les agents BMad installés et facilite une conversation naturelle où chaque agent apporte son expertise et sa personnalité uniques.

**À utiliser quand :**

- Vous avez besoin de multiples perspectives d’experts sur une décision
- Vous voulez que les agents remettent en question les hypothèses des autres
- Vous explorez un sujet complexe qui couvre plusieurs domaines

**Fonctionnement :**

1. Charge le manifeste d’agents avec toutes les personnalités d’agents installées
2. Analyse votre sujet pour sélectionner les 2–3 agents les plus pertinents
3. Les agents contribuent à tour de rôle, avec des échanges spontanés et des désaccords
4. Alterne la participation des agents pour garantir des perspectives variées
5. Quittez avec `goodbye`, `end party` ou `quit`

**Entrée :** Sujet de discussion ou question, ainsi que la spécification des personas que vous souhaitez faire participer (optionnel)

**Sortie :** Conversation multi-agents en temps réel conservant la personnalité de chaque agent

## bmad-spec

**Distille toute formulation d’intention en un contrat SPEC canonique pour le travail en aval.** — Accepte un brief, un PRD, un GDD, un RFC, un brain dump, une transcription, un dossier UX ou une entrée multi-source mixte et produit un `SPEC.md` structuré autour d’un noyau de cinq champs (Pourquoi, Capacités, Contraintes, Non-objectifs, Signal de succès) ainsi que des fichiers compagnons pour le contenu essentiel qui ne trouve pas sa place dans le noyau.

**À utiliser quand :**

- Vous devez verrouiller le QUOI avant le COMMENT pour tout type de travail (logiciel, game design, recherche, éditorial, politique, entreprise)
- Vous souhaitez un contrat succinct optimisé pour les LLM, sans fioritures, que les compétences en aval peuvent consommer sans relire chaque artefact en amont
- Vous voulez valider ou mettre à jour une spécification existante

**Fonctionnement :**

1. Lit l’entrée et tout document annexe lié
2. Distille en un noyau à cinq champs via un modèle configurable ; redirige l’excédent vers des fichiers compagnons correctement nommés
3. Exécute une auto-validation en deux passes (règles de cohérence, puis préservation de chaque affirmation essentielle de la source)
4. Écrit `SPEC.md`, les compagnons associés, et un `.memlog.md` sous `{output_folder}/specs/spec-{slug}/`

La loi Spec impose huit règles : les capacités expriment à la fois l’intention et le critère de succès ; les intentions décrivent le QUOI, pas le COMMENT ; les contraintes guident réellement les décisions ; les non-objectifs sont explicites ; les signaux de succès sont concrets ; les identifiants de capacité sont stables ; chaque affirmation essentielle de la source est préservée ; la rédaction est concise.

**Entrée :**

- `input` (requis) — Chemin ou texte fourni directement. Idée vague, brain dump, PRD, GDD, RFC, brief, transcription, dossier de maquettes, multi-source mixte
- `slug` (optionnel) — Requis uniquement lorsque l’entrée est succincte et qu’aucun slug ne peut être dérivé du nom de fichier source
- `target_spec_path` (optionnel) — Définir pour mettre à jour une spécification existante au lieu d’en créer une nouvelle

**Sortie :** Dossier de spécification contenant `SPEC.md`, les éventuels fichiers compagnons, et un `.memlog.md`. Les appelants en mode headless reçoivent une réponse JSON avec le statut du résultat et la liste des fichiers écrits ou modifiés.

:::note[Contrat de mutation]
`bmad-spec` est le seul outil autorisé à écrire `SPEC.md` et les fichiers compagnons de la spécification. Les autres compétences produisent leurs propres artefacts natifs et invoquent `bmad-spec` en mode headless lorsqu’elles ont besoin d’exprimer une intention sous forme de contrat canonique ou de proposer des mises à jour.
:::


## bmad-advanced-elicitation

**Soumet la sortie du LLM à des méthodes de raffinement itératives.** — Sélectionne à partir d’une bibliothèque de techniques d’élicitation pour améliorer systématiquement le contenu en plusieurs passages.

**À utiliser quand :**

- La sortie du LLM semble superficielle ou générique
- Vous voulez explorer un sujet sous plusieurs angles analytiques
- Vous raffinez un document critique et souhaitez une réflexion plus approfondie

**Fonctionnement :**

1. Charge le registre de méthodes avec plus de 5 techniques d’élicitation
2. Sélectionne les 5 méthodes les mieux adaptées selon le type de contenu et la complexité
3. Présente un menu interactif — choisissez une méthode, remélangez, ou listez tout
4. Applique la méthode sélectionnée pour améliorer le contenu
5. Affiche à nouveau les options d’amélioration itérative jusqu’à ce que vous sélectionniez « Procéder »

**Entrée :** Section de contenu à améliorer

**Sortie :** Version améliorée du contenu avec les améliorations appliquées

## bmad-review-adversarial-general

**Revue contradictoire qui part du principe que des problèmes existent et les traque.** — Adopte un regard de réviseur sceptique et blasé, sans aucune tolérance pour le travail bâclé. Cherche ce qui manque, pas seulement ce qui ne va pas.

**À utiliser quand :**

- Vous avez besoin d’assurance qualité avant de finaliser un livrable
- Vous voulez éprouver une spécification, une story ou un document
- Vous voulez trouver des lacunes de couverture que les revues optimistes manquent

**Fonctionnement :**

1. Lit le contenu avec un regard contradictoire et critique
2. Identifie les problèmes sur les plans de l’exhaustivité, de la justesse et de la qualité
3. Recherche spécifiquement ce qui manque — pas seulement ce qui est présent et faux
4. Doit trouver un minimum de 10 problèmes ou réanalyser plus en profondeur

**Entrée :**

- `content` (requis) — Diff, spécification, story, document ou tout artefact
- `also_consider` (optionnel) — Domaines supplémentaires à garder à l’esprit

**Sortie :** Liste markdown de plus de 10 constatations avec descriptions

## bmad-review-edge-case-hunter

**Parcourt tous les chemins de branchement et les conditions limites, ne signale que les cas non gérés.** — Méthodologie pure de traçage de chemin[^1] qui dérive mécaniquement les classes de cas limites. Orthogonale à la revue contradictoire — centrée sur la méthode, pas sur l’attitude.

**À utiliser quand :**

- Vous souhaitez une couverture exhaustive des cas limites pour le code ou la logique
- Vous avez besoin d’un complément à la revue contradictoire (méthodologie différente, résultats différents)
- Vous révisez un diff ou une fonction pour des conditions limites

**Fonctionnement :**

1. Énumère tous les chemins de branchement dans le contenu
2. Dérive mécaniquement les classes de cas limites : else/default manquants, entrées non protégées, erreurs off-by-one, dépassements arithmétiques, conversions de type implicites, conditions de concurrence, dépassements de délai
3. Teste chaque chemin face aux protections existantes
4. Ne signale que les chemins non gérés — ignore silencieusement les chemins gérés

**Entrée :**

- `content` (obligatoire) — Diff, fichier complet ou fonction
- `also_consider` (facultatif) — Domaines supplémentaires à garder à l’esprit

**Sortie :** Tableau JSON des résultats, chacun avec `location`, `trigger_condition`, `guard_snippet` et `potential_consequence`

:::note[Revue Complémentaire]
Exécutez à la fois `bmad-review-adversarial-general` et `bmad-review-edge-case-hunter` pour une couverture orthogonale. La revue contradictoire détecte les problèmes de qualité et de complétude ; le chasseur de cas limites détecte les chemins non gérés.
:::

## bmad-editorial-review-prose

**Correction éditoriale clinique centrée sur la clarté de communication.** — Analyse le texte pour détecter les problèmes qui nuisent à la compréhension. Applique le Microsoft Writing Style Guide comme référence de base. Préserve la voix de l’auteur.

**À utiliser quand :**

- Vous avez rédigé un document et souhaitez en polir le style
- Vous devez assurer la clarté pour un public spécifique
- Vous voulez des corrections de communication sans modifier les choix stylistiques

**Fonctionnement :**

1. Lit le contenu en ignorant les blocs de code et le frontmatter
2. Identifie les problèmes de communication (pas les préférences de style)
3. Dédoublonne les occurrences d’un même problème à différents endroits
4. Produit un tableau de corrections en trois colonnes

**Entrée :**

- `content` (obligatoire) — Markdown, texte brut ou XML
- `style_guide` (facultatif) — Guide de style spécifique au projet
- `reader_type` (facultatif) — `humans` (par défaut) pour clarté/fluide, ou `llm` pour précision/consistance

**Sortie :** Tableau Markdown en trois colonnes : Texte original | Texte révisé | Modifications

## bmad-editorial-review-structure

**Édition structurelle — propose des coupes, fusions, réorganisations et condensations.** — Révise l’organisation du document et propose des changements substantiels pour améliorer la clarté et le flux avant la correction éditoriale.

**À utiliser quand :**

- Un document a été produit par plusieurs sous-processus et nécessite une cohérence structurelle
- Vous voulez réduire la longueur du document tout en préservant la compréhension
- Vous devez identifier les violations de portée ou les informations critiques enfouies

**Fonctionnement :**

1. Analyse le document contre 5 modèles de structure (Tutoriel, Référence, Explication, Prompt, Stratégique)
2. Identifie les redondances, violations de portée et informations enfouies
3. Produit des recommandations priorisées : COUPER, FUSIONNER, DÉPLACER, CONDENSER, QUESTIONNER, PRÉSERVER
4. Estime la réduction totale en mots et en pourcentage

**Entrée :**

- `content` (requis) — Document à réviser
- `purpose` (optionnel) — Objectif prévu (par ex., « tutoriel de démarrage rapide »)
- `target_audience` (optionnel) — Qui lit ceci
- `reader_type` (optionnel) — `humans` ou `llm`
- `length_target` (optionnel) — Réduction cible (par ex., « 30% plus court »)

**Sortie :** Résumé du document, liste de recommandations priorisées et réduction estimée

## bmad-shard-doc

**Fractionne les fichiers markdown volumineux en sections organisées.** — Utilise les en-têtes de niveau 2 comme points de découpe pour créer un dossier de fichiers de sections autonomes avec un index.

**À utiliser quand :**

- Un document markdown est devenu trop volumineux pour être géré efficacement (plus de 500 lignes)
- Vous voulez découper un document monolithique en sections navigables
- Vous avez besoin de fichiers séparés pour l’édition parallèle ou la gestion de contexte LLM

**Fonctionnement :**

1. Valide que le fichier source existe et est au format markdown
2. Découpe sur les en-têtes de niveau 2 (`##`) en fichiers de sections numérotées
3. Crée un `index.md` avec le manifeste de sections et les liens
4. Vous invite à supprimer, archiver ou conserver l’original

**Entrée :** Chemin du fichier markdown source, dossier de destination optionnel

**Sortie :** Dossier avec `index.md` et `01-{section}.md`, `02-{section}.md`, etc.

## bmad-index-docs

**Génère ou met à jour un index de tous les documents dans un dossier.** — Analyse un répertoire, lit chaque fichier pour comprendre son objectif et produit un `index.md` organisé avec liens et descriptions.

**À utiliser quand :**

- Vous avez besoin d’un index léger pour un scan LLM rapide des documents disponibles
- Un dossier de documentation a grandi et nécessite une table des matières organisée
- Vous voulez un aperçu auto-généré qui reste à jour

**Fonctionnement :**

1. Analyse le répertoire cible pour tous les fichiers non cachés
2. Lit chaque fichier pour comprendre son objectif réel
3. Groupe les fichiers par type, objectif ou sous-répertoire
4. Génère des descriptions concises (3–10 mots chacune)

**Entrée :** Chemin du dossier cible

**Sortie :** `index.md` avec listes de fichiers organisées, liens relatifs et brèves descriptions

## bmad-customize

**Créer et vérifier des personnalisations.** — Vous aide à modifier le comportement d’un agent ou d’un workflow BMad installé sans avoir à écrire de TOML manuellement.

**À utiliser quand :**

- Vous souhaitez modifier le comportement d’un agent ou d’un workflow
- Vous devez ajouter des faits persistants, des hooks d’activation ou des éléments de menu personnalisés
- Vous voulez que le bon périmètre de surcharge soit sélectionné et vérifié automatiquement

**Fonctionnement :**

1. Analyse les skills BMad installés pour identifier les surfaces personnalisables
2. Sélectionne le bon périmètre pour le changement demandé
3. Écrit les fichiers de surcharge sous `_bmad/custom/`
4. Vérifie la configuration fusionnée

**Entrée :** Description en langage naturel de la personnalisation souhaitée

**Sortie :** Fichiers de surcharge TOML sous `_bmad/custom/`

Pour un guide détaillé sur la personnalisation de BMad, consultez [Comment personnaliser BMad](../how-to/customize-bmad.md).

## Glossaire

[^1]: Path-tracing : méthode d’analyse qui suit systématiquement tous les chemins d’exécution possibles dans un programme pour identifier les cas non gérés.
