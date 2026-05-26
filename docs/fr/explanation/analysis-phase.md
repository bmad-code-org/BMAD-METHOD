---
title: "Phase d'analyse : de l'Idée aux Fondations"
description: Ce que sont le brainstorming, la recherche, les product briefs et les PRFAQs — et quand les utiliser
sidebar:
  order: 1
---

La phase d'Analyse (Phase 1) vous aide à penser clairement à votre produit avant de vous engager à le construire. Chaque outil de cette phase est optionnel, mais sauter l'analyse entièrement signifie que votre PRD sera construit sur des suppositions plutôt que sur des connaissances approfondies.

## Pourquoi Analyser avant de Planifier ?

Un PRD répond à la question « que devons-nous construire et pourquoi ? » Si vous l'alimentez avec une réflexion vague, vous obtiendrez un PRD vague — et chaque document en aval héritera de cette imprécision. Une architecture bâtie sur un PRD faible prend de mauvaises décisions techniques. Les stories dérivées d'une architecture faible manquent de edge cases. Le coût s'accumule.

Les outils d'analyse existent pour rendre votre PRD précis. Ils attaquent le problème sous différents angles — exploration créative, réalité du marché, clarté client, faisabilité — pour qu'au moment de vous asseoir avec l'agent PM, vous sachiez ce que vous construisez et pour qui.

## Les Outils

### Brainstorming

**Quoi.** Une session créative facilitée utilisant des techniques d'idéation éprouvées. L'IA agit comme coach, extrayant vos idées à travers des exercices structurés — pas en les générant pour vous.

**Pourquoi.** Les idées brutes ont besoin d'espace pour se développer avant d'être verrouillées dans des exigences. Le brainstorming crée cet espace. Il est particulièrement précieux quand vous avez un espace-problème mais pas de solution claire, ou quand vous voulez explorer plusieurs pistes avant de vous engager.

**Quand.** Vous avez une vague idée de ce que vous voulez construire mais n'avez pas encore cristallisé le concept. Ou vous avez un concept mais voulez l'éprouver face à des alternatives.

Voir [Brainstorming](./brainstorming.md) pour un aperçu plus approfondi du fonctionnement des sessions.

### Recherche (Marché, Domaine, Technique)

**Quoi.** Trois workflows de recherche ciblés qui investiguent différentes dimensions de votre idée. La recherche marché examine les concurrents, les tendances et le sentiment utilisateur. La recherche domaine construit l'expertise métier et la terminologie. La recherche technique évalue la faisabilité, les options d'architecture et les approches d'implémentation.

**Pourquoi.** Construire sur des suppositions est le moyen le plus rapide de construire quelque chose dont personne n'a besoin. La recherche ancre votre concept dans la réalité — quels concurrents existent déjà, avec quoi les utilisateurs luttent réellement, ce qui est techniquement faisable, et quelles contraintes spécifiques à l'industrie vous affronterez.

**Quand.** Vous entrez dans un domaine inconnu, vous soupçonnez que des concurrents existent mais ne les avez pas cartographiés, ou votre concept dépend de capacités techniques que vous n'avez pas validées. Lancez-en un, deux ou les trois — chaque workflow de recherche fonctionne de manière autonome.

### Product Brief[^1]

**Quoi.** Une session de découverte guidée qui produit un résumé exécutif de 1-2 pages de votre concept produit. L'IA agit comme un analyste commercial collaboratif, vous aidant à articuler la vision, le public cible, la proposition de valeur et le périmètre.

**Pourquoi.** Le product brief est le chemin le plus doux vers la planification. Il capture votre vision stratégique dans un format structuré qui alimente directement la création du PRD. Il fonctionne mieux quand vous avez déjà la conviction à propos de votre concept — vous connaissez le client, le problème et approximativement ce que vous voulez construire. Le brief organise et affine cette réflexion.

**Quand.** Votre concept est relativement clair et vous voulez le documenter efficacement avant de créer un PRD. Vous êtes confiant dans la direction et n'avez pas besoin que vos suppositions soient agressivement remises en question.

### PRFAQ (Working Backwards)

**Quoi.** La méthodologie Working Backwards d'Amazon adaptée en défi interactif. Vous rédigez le communiqué de presse annonçant votre produit fini avant qu'une seule ligne de code n'existe, puis répondez aux questions les plus difficiles que les clients et les parties prenantes poseraient. L'IA agit comme un coach produit implacable mais constructif.

**Pourquoi.** Le PRFAQ est le chemin rigoureux vers la planification. Il force la clarté orientée client en vous obligeant à défendre chaque affirmation. Si vous ne pouvez pas rédiger un communiqué de presse convaincant, le produit n'est pas prêt. Si les réponses de la FAQ client révèlent des lacunes, ce sont des lacunes que vous découvrirez bien plus tard — et plus coûteusement — pendant l'implémentation. Le défi fait remonter les failles de réflexion tôt, quand c'est le moins cher de les corriger.

**Quand.** Vous voulez que votre concept soit éprouvé avant d'engager des ressources. Vous n'êtes pas sûr que les utilisateurs s'en soucieront réellement. Vous voulez valider que vous pouvez articuler une proposition de valeur claire et défendable. Ou vous voulez simplement la discipline du Working Backwards pour affiner votre réflexion.

## Lequel utiliser ?

| Situation                                                                     | Outil recommandé                           |
|-------------------------------------------------------------------------------|--------------------------------------------|
| « J'ai une idée vague, je ne sais pas par où commencer »                      | Brainstorming                              |
| « J'ai besoin de comprendre le marché avant de décider »                      | Recherche                                  |
| « Je sais ce que je veux construire, j'ai juste besoin de le documenter »     | Product Brief                              |
| « Je veux m'assurer que cette idée vaut vraiment la peine d'être construite » | PRFAQ                                      |
| « Je veux explorer, puis valider, puis documenter »                           | Brainstorming → Recherche → PRFAQ ou Brief |

Le Product Brief et le PRFAQ produisent tous deux des entrées pour le PRD — choisissez-en un en fonction du niveau de défi que vous souhaitez. Le brief est une découverte collaborative. Le PRFAQ est un défi. Les deux vous mènent à la même destination ; le PRFAQ teste si votre concept mérite d'y arriver.

:::tip[Pas sûr ?]
Exécutez `bmad-help` et décrivez votre situation. Il vous recommandera le bon point de départ en fonction de ce que vous avez déjà accompli et de ce que vous essayez de réaliser.
:::

## Que se passe-t-il après l'analyse ?

Les résultats de l'analyse alimentent directement la Phase 2 (Planification). Le workflow PRD accepte les product briefs, les documents PRFAQ, les conclusions de recherche et les rapports de brainstorming en entrée — il synthétise tout ce que vous avez produit en exigences structurées. Plus vous faites d'analyse, plus votre PRD sera précis.

## Glossaire

[^1]: Brief : document synthétique qui formalise le contexte, les objectifs, le périmètre et les contraintes d'un projet ou d'une demande, afin d'aligner rapidement les parties prenantes avant le travail détaillé.
