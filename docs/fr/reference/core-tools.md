---
title: Outils Principaux
description: Référence des compétences intégrées du module principal.
sidebar:
  order: 3
---

Chaque installation BMad comprend le **module principal** — un petit ensemble de compétences qui fonctionnent dans tous les projets, tous les modules et toutes les phases. Cette page couvre ces huit compétences principales : les cinq outils du noyau plus les trois **compétences de réflexion** (brainstorming, forge idea, party mode).

:::tip[Raccourci Rapide]
Exécutez n’importe quel outil en tapant son nom de compétence (par ex., `bmad-help`) dans votre IDE. Aucune session d’agent requise.
:::

## Vue d’ensemble

**Module principal (toujours installé) :**

| Outil | Objectif |
| --- | --- |
| [`bmad-help`](#bmad-help) | Obtenir des conseils contextuels sur la prochaine étape |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Soumettre la sortie LLM à des méthodes de raffinement itératives |
| [`bmad-editorial-review`](#bmad-editorial-review) | Revue éditoriale en deux passes — structure, puis prose |
| [`bmad-review`](#bmad-review) | Revue critique multi-perspectives — contradictoire, cas limites et lacunes de vérification |
| [`bmad-customize`](#bmad-customize) | Créer et vérifier des personnalisations BMad |

**Compétences de réflexion :**

| Outil | Objectif |
| --- | --- |
| [`bmad-brainstorming`](#bmad-brainstorming) | Faciliter des sessions de brainstorming interactives |
| [`bmad-forge-idea`](#bmad-forge-idea) | Éprouver une idée jusqu’à ce qu’elle se consolide, se confirme ou meure à moindre coût |
| [`bmad-party-mode`](#bmad-party-mode) | Orchestrer des discussions de groupe multi-agents |

:::note[Déplacés et supprimés]
`bmad-spec` fait désormais partie du module BMM comme workflow de planification de Phase 2 — voir la [Carte des Workflows](./workflow-map.md). Les utilitaires `bmad-shard-doc` et `bmad-index-docs` ont été supprimés. Les anciennes compétences `bmad-editorial-review-prose`, `bmad-editorial-review-structure`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter` et `bmad-review-verification-gap` sont fusionnées dans `bmad-editorial-review` et `bmad-review` ; les anciens identifiants restent résolus via des redirections masquées pour la compatibilité.
:::

## bmad-help

**Votre guide intelligent pour la suite.** — Inspecte l’état de votre projet, détecte ce qui a été fait et recommande la prochaine étape requise ou facultative.

**À utiliser quand :**

- Vous avez terminé un workflow et voulez savoir quoi faire ensuite
- Vous êtes nouveau sur BMad et avez besoin d’orientation
- Vous êtes bloqué et voulez des conseils contextuels
- Vous avez installé de nouveaux modules et voulez voir ce qui est disponible

**Fonctionnement :**

1. Analyse votre projet pour détecter les artefacts existants (PRD, architecture, stories, etc.)
2. Détecte quels modules sont installés et leurs workflows disponibles
3. Recommande les prochaines étapes par ordre de priorité — étapes requises d’abord, puis facultatives
4. Présente chaque recommandation avec la commande de compétence et une brève description

**Entrée :** Requête optionnelle en langage naturel (par ex., `bmad-help J'ai une idée de SaaS, par où commencer ?`)

**Sortie :** Liste priorisée des prochaines étapes recommandées avec les commandes de compétence

## bmad-advanced-elicitation

**Pousse le LLM à reconsidérer, raffiner et améliorer sa sortie récente.** — Le point de contrôle de raffinement partagé de BMad : d’autres compétences l’invoquent aux pauses naturelles, et vous pouvez l’appeler directement sur tout contenu récent de la conversation.

**À utiliser quand :**

- La sortie du LLM semble superficielle ou générique
- Vous voulez explorer un sujet sous plusieurs angles analytiques
- Vous raffinez un document critique et souhaitez une réflexion plus approfondie
- Vous voulez une méthode connue par son nom — socratique, premiers principes, pré-mortem, red team

**Fonctionnement :**

1. Cible la sortie la plus récente de la conversation, sauf si vous la pointez ailleurs
2. Propose un court menu de méthodes d’élicitation adaptées au contenu
3. Applique les méthodes choisies sur la cible
4. Restitue la version améliorée pour que le flux appelant reprenne où il s’était arrêté

**Entrée :** La sortie récente à raffiner (par défaut), ou tout contenu que vous désignez ; éventuellement une méthode nommée

**Sortie :** Version améliorée du contenu avec les améliorations appliquées

## bmad-editorial-review

**Revue éditoriale en deux passes — structure, puis prose.** — Un éditeur clinique qui examine la forme d’un document et ses phrases, et propose des corrections que vous acceptez ou refusez ligne par ligne. Le contenu est sacré : il ne remet jamais en question vos idées, seulement leur organisation et leur expression.

**À utiliser quand :**

- Vous avez rédigé un document et voulez le resserrer et le polir
- Un document issu de plusieurs sous-processus a besoin de cohérence structurelle
- Vous voulez réduire la longueur tout en préservant la compréhension
- Vous voulez des corrections de clarté sans modifier les choix stylistiques

**Fonctionnement :**

1. **Passe structure** — propose des coupes, fusions, déplacements et condensations ; interroge si la forme du document sert son objectif
2. **Passe prose** — corrige les problèmes de communication qui nuisent à la compréhension, avec le Microsoft Writing Style Guide comme référence (un guide de style fourni prévaut)
3. Exécute les deux passes, structure d’abord, par défaut ; demandez une revue structure seule ou prose seule pour n’en exécuter qu’une
4. Propose, n’exécute jamais — l’auteur décide de ce qu’il accepte

**Entrée :**

- `content` (requis) — Document à réviser
- `style_guide` (optionnel) — Guide de style spécifique au projet
- `reader_type` (optionnel) — `humans` (par défaut) pour clarté/fluidité, ou `llm` pour précision/consistance
- `purpose` / `target_audience` / `length_target` (optionnel) — calibrent la passe structure

**Sortie :** Tableau de constatations avec corrections suggérées, plus une estimation de réduction lorsque des changements structurels sont proposés

## bmad-review

**Revue critique multi-perspectives sur tout diff, document ou artefact.** — Exécute des perspectives de revue indépendantes — chacune avec sa méthode et sa posture propres — et rapporte chaque constatation dans un format canonique unique. Zéro constatation est un résultat valide ; il ne remplit jamais pour paraître exhaustif.

**Les perspectives livrées :**

| Perspective | Méthode |
| --- | --- |
| **Contradictoire** | Revue sceptique qui part du principe que des problèmes existent — traque ce qui manque, pas seulement ce qui ne va pas |
| **Cas limites** | Parcourt chaque chemin de branchement et condition aux limites, ne rapporte que les chemins non gérés |
| **Lacunes de vérification** | Trouve les comportements modifiés qui pourraient régresser sans qu’une vérification fiable ne le détecte |

**À utiliser quand :**

- Vous avez besoin d’assurance qualité avant de finaliser un livrable
- Vous voulez une couverture exhaustive des cas limites d’un code ou d’une logique
- Vous voulez savoir si un changement est correctement vérifié
- Vous voulez les trois perspectives à la fois (le comportement par défaut)

**Fonctionnement :**

1. Charge le contenu et identifie son type — diff, fichier, fonction ou document
2. Sélectionne les perspectives : celles que vous nommez, ou toutes les perspectives activées adaptées au contenu
3. Exécute chaque perspective indépendamment — en parallèle via des sous-agents lorsque la plateforme le permet
4. Assemble une liste unique de constatations ; le chevauchement entre perspectives est un signal, pas une duplication

**Entrée :**

- `content` (requis) — Diff, branche, changements non commités, fichier, spécification, story ou tout document
- `lenses` (optionnel) — un ou plusieurs codes ou noms de perspectives ; par défaut, revue complète
- `also_consider` (optionnel) — Domaines supplémentaires à garder à l’esprit

**Sortie :** Liste de constatations JSON (chaque constatation porte `lens`, `location`, `trigger_condition`, `guard_snippet`, `potential_consequence`) et/ou rapport markdown groupé par perspective

:::note[Utilisé par d’autres workflows]
Les workflows de Code Review d’autres modules exécutent ces perspectives automatiquement. Des perspectives personnalisées peuvent être ajoutées — et celles livrées ajustées ou désactivées — via le `customize.toml` de la compétence.
:::

## bmad-customize

**Créer et vérifier des personnalisations.** — Vous aide à modifier le comportement d’un agent ou d’un workflow BMad installé sans avoir à écrire de TOML manuellement.

**À utiliser quand :**

- Vous souhaitez modifier le comportement d’un agent ou d’un workflow
- Vous devez ajouter des faits persistants, des hooks d’activation ou des éléments de menu personnalisés
- Vous voulez que le bon périmètre de surcharge soit sélectionné et vérifié automatiquement

**Fonctionnement :**

1. Analyse les skills BMad installés pour identifier les surfaces personnalisables
2. Sélectionne le bon périmètre pour le changement demandé
3. Écrit les fichiers de surcharge sous `_bmad/custom/`
4. Vérifie la configuration fusionnée

**Entrée :** Description en langage naturel de la personnalisation souhaitée

**Sortie :** Fichiers de surcharge TOML sous `_bmad/custom/`

Pour un guide détaillé sur la personnalisation de BMad, consultez [Comment personnaliser BMad](../how-to/customize-bmad.md).

## Compétences de Réflexion

Les trois compétences ci-dessous complètent le module principal — des outils de réflexion généralistes sur lesquels toute phase ou tout module peut s’appuyer.

### bmad-brainstorming

**Génère des idées variées grâce à des techniques créatives interactives.** — Une session de brainstorming facilitée qui charge des méthodes d’idéation éprouvées à partir d’une bibliothèque de techniques et vous guide vers plus de 100 idées avant de les organiser.

**À utiliser quand :**

- Vous commencez un nouveau projet et devez explorer l’espace problème
- Vous êtes bloqué dans la génération d’idées et avez besoin de créativité structurée
- Vous voulez utiliser des cadres d’idéation éprouvés (SCAMPER, brainstorming inversé, etc.)

**Fonctionnement :**

1. Configure une session de brainstorming avec votre sujet
2. Charge les techniques créatives à partir d’une bibliothèque de méthodes
3. Vous guide de technique en technique, en générant des idées
4. Applique un protocole anti-biais — bascule de domaine créatif toutes les 10 idées pour éviter les biais de regroupement

**Entrée :** Sujet de brainstorming ou énoncé de problème, fichier de contexte optionnel

**Sortie :** un `brainstorm.html` autonome comme souvenir de la session, un `brainstorm-intent.md` optionnel pour les compétences en aval, et un enregistrement de session `.memlog.md`

:::note[Cible de Quantité]
La magie se produit dans les idées 50–100. Le workflow encourage la génération de plus de 100 idées avant organisation.
:::

### bmad-forge-idea

**Éprouve une idée jusqu’à ce qu’elle se consolide, se confirme ou meure à moindre coût.** — Un interrogateur contradictoire fait avancer une idée à moitié formée une question à la fois, en amenant deux personnages à chaque embranchement, jusqu’à ce que ce qui survit soit quelque chose sur quoi vous pouvez agir avec conviction.

**À utiliser quand :**

- Vous tenez une idée et voulez la mettre à l’épreuve avant d’y investir
- Vous voulez un avis honnête sur l’opportunité de l’abandonner
- Vous avez besoin d’un partenaire de réflexion qui résiste au lieu d’acquiescer

**Fonctionnement :**

1. Établit l’objectif dès le départ et oriente le questionnement en conséquence
2. Travaille une question à la fois, dans l’ordre des dépendances, en posant une réponse recommandée à contester
3. Amène deux voix à chaque embranchement — une de votre effectif installé, une évoquée par le sujet
4. Conteste les termes flous et confronte les affirmations au matériau d’un projet existant
5. Aboutit à Consolidée, Abandonnée ou Clarifiée, avec un rapport autonome que vous pouvez conserver

**Entrée :** L’idée, dans n’importe quel domaine — une fonctionnalité, un modèle économique, une hypothèse de recherche, une décision de vie

**Sortie :** Un distillat `forged-idea.md` quand une idée se consolide (optionnel), plus un souvenir `forge-report.html` à chaque exécution

### bmad-party-mode

**Orchestre des discussions de groupe multi-agents.** — Charge tous les agents BMad installés et facilite une conversation naturelle où chaque agent apporte son expertise et sa personnalité uniques.

**À utiliser quand :**

- Vous avez besoin de multiples perspectives d’experts sur une décision
- Vous voulez que les agents remettent en question les hypothèses des autres
- Vous explorez un sujet complexe qui couvre plusieurs domaines

**Fonctionnement :**

1. Charge le manifeste d’agents avec toutes les personnalités d’agents installées
2. Analyse votre sujet pour sélectionner les 2–3 agents les plus pertinents
3. Les agents contribuent à tour de rôle, avec des échanges spontanés et des désaccords
4. Alterne la participation des agents pour garantir des perspectives variées
5. Quittez avec `goodbye`, `end party` ou `quit`

**Entrée :** Sujet de discussion ou question, ainsi que la spécification des personas que vous souhaitez faire participer (optionnel)

**Sortie :** Conversation multi-agents en temps réel conservant la personnalité de chaque agent
