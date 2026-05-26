---
title: 'Web Bundles'
description: Skills BMad empaquetés pour Google Gemini Gems et ChatGPT Custom GPTs
---

Exécutez la partie planification de BMad dans votre abonnement LLM web, puis ramenez les artefacts dans votre IDE.

## Qu’est-ce qu’un Web Bundle ?

Un web bundle est un skill BMad reconditionné pour être installé comme **Google Gemini Gem** ou **ChatGPT Custom GPT**. Chaque bundle inclut un protocole `SKILL.md` que vous téléversez comme fichier de connaissance, un bloc `INSTRUCTIONS.md` que vous collez dans les instructions du Gem ou du GPT, et les fichiers de données dont le skill a besoin (CSV, modèles, listes de contrôle de validation, contenu dévoilé progressivement). Le persona vit dans les instructions collées ; le protocole vit dans le fichier de connaissance. Changez de persona sans toucher au protocole.

L’installation ne se fait pas en un clic, mais les étapes sont guidées. **Installez depuis [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**. Le site liste chaque bundle dans une grille, vous montre les étapes d’installation Gemini et ChatGPT directement sur la page, et met le ZIP à disposition. C’est le type d’installation pris en charge ; le schéma est le même dans toute la bibliothèque, donc une fois que vous en avez installé un, le suivant va de soi.

La V4 de BMad a introduit les web bundles. La V6 les réintègre, réécrits pour les plateformes Gem et Custom GPT actuelles et conçus pour Canvas, Deep Research et la génération d’images.

## Pourquoi les utiliser

Le travail de planification et le travail d’implémentation nécessitent des outils différents. Les web bundles permettent à chacun d’utiliser le bon.

| Aspect               | LLM web (Gem ou GPT)                        | IDE (Claude Code, Cursor)                  |
|----------------------|---------------------------------------------|--------------------------------------------|
| Modèle de coût       | Abonnement forfaitaire                      | Tokens facturés à l’usage                  |
| Plus performant pour | Conversation, Canvas, Deep Research, images | Fichiers, terminal, contexte du codebase   |
| Idéal pour           | Brainstorming, briefs, PRD, recherche       | Implémentation, refactoring, revue de code |

Lancer une conversation complète de PRD ou d’étude de marché dans un IDE consomme des tokens qu’un Gem ou un Custom GPT gère pour le prix de votre abonnement existant. L’artefact finalisé est ensuite déposé dans votre dépôt et Claude Code ou Cursor prend le relais.

:::tip[Planifiez sur le web, construisez dans l’IDE]
Les économies se cumulent sur les engagements de longue durée. Un passage de PRFAQ et trois cycles de recherche dans un Gem représentent un coût marginal nul ; le même travail dans un IDE représente une dépense réelle.
:::

## Ce que contient la bibliothèque

Les bundles actuellement disponibles couvrent les phases d’analyse et de planification :

| Bundle                                                         | Phase         | Origine du persona                        |
|----------------------------------------------------------------|---------------|-------------------------------------------|
| Coach Brainstorming[^1]                                        | Analyse       | Osborn (par défaut), Minto (substitution) |
| Coach Product Brief[^2]                                        | Analyse       | Mary (analyste BMad)                      |
| Coach [PRFAQ](./analysis-phase.md#prfaq-working-backwards)[^3] | Analyse       | Working Backwards (Bezos)                 |
| Coach PRD[^4]                                                  | Planification | Cagan                                     |
| Coach UX[^5]                                                   | Planification | Norman                                    |
| Étude de marché et analyse sectorielle                         | Analyse       | Porter et Christensen                     |

Chaque bundle intègre un persona par défaut hérité de son agent BMad d’origine (lorsqu’il existe) et un exemple de persona alternatif pour illustrer le changement de voix.

## Comment se déroule une session

1. **Ouvrez le Gem ou le Custom GPT.** Le persona vous salue en restant dans son rôle et ouvre une phase de découverte conversationnelle.
2. **Découvrir le périmètre.** Le persona vous demande ce que vous essayez d’accomplir, ce que vous avez sous la main, quelles contraintes s’appliquent. Pas de formulaire à remplir.
3. **Travailler dans Canvas.** Le protocole ouvre Canvas au démarrage de la session et le met à jour en continu. Les diagrammes Mermaid et les tableaux HTML viennent s’ajouter au texte.
4. **Transmettre.** Quand vous avez terminé, vous avez un document Canvas que vous pouvez exporter, coller dans votre dépôt, ou transmettre à un skill BMad dans votre IDE pour la phase suivante.

Pour les bundles qui intègrent Deep Research (actuellement Market & Industry Research), le persona rédige un brief Deep Research en milieu de session que vous collez dans le mode Deep Research de Gemini ou ChatGPT, puis il intègre le rapport obtenu.

## Quand utiliser un web bundle

- Vous êtes en phase de réflexion amont sur un projet et vous voulez un outil ciblé avec persona, Canvas et Deep Research.
- Vous voulez réserver les tokens de l’IDE au développement réel.
- Vous partagez l’artefact de planification avec des collaborateurs qui n’ont pas votre configuration IDE.

## Quand rester dans l’IDE

- Le travail nécessite de lire ou modifier du code dans votre dépôt.
- Vous êtes déjà en pleine implémentation et voulez conserver le contexte.
- Vous n’avez pas d’abonnement Gemini Advanced ou ChatGPT Plus.

## Mettre à jour et personnaliser

Les bundles évoluent. Quand vous récupérez une version plus récente d’un bundle, la mise à jour typique concerne ses fichiers de connaissance (le protocole `SKILL.md` et les modèles, CSV ou listes de contrôle de validation attachés). Téléversez-les à nouveau dans votre Gem ou Custom GPT pour appliquer la mise à jour. Le bloc d’instructions ne change généralement pas.

Si vous souhaitez personnaliser un bundle pour votre équipe ou votre voix, faites-le dans le **bloc d’instructions** que vous avez collé dans le Gem ou le GPT, pas dans les fichiers de connaissance. Le bloc d’instructions est l’endroit où se trouvent le persona, les préférences et les personnalisations locales ; les fichiers de connaissance sont le protocole livré avec le bundle. Garder la personnalisation dans le bloc d’instructions signifie que les futures mises à jour se résument à remplacer les pièces jointes, pas à fusionner vos modifications.

:::tip[Personnalisez les instructions, joignez-y les connaissances]
Substitutions de persona, nom d’utilisateur par défaut, garde-fous spécifiques à l’équipe, formulations préférées : tout cela appartient au bloc d’instructions collé. Les fichiers de connaissance restent standards pour que vous puissiez les rafraîchir sans perdre vos modifications.
:::

## Créer le vôtre

Les web bundles sont générés à partir de skills BMad en utilisant le skill utilitaire `bmad-os-skill-to-bundle`. Pointez-le vers n’importe quel dossier de skill BMad et il produit les fichiers du bundle en reprenant le persona hérité de l’agent d’origine.

Installez n’importe quel bundle depuis [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/).

## Glossaire

[^1]: Brainstorming : session de créativité facilitée visant à produire et explorer un large éventail d’idées sur un sujet donné, en s’appuyant sur des techniques d’idéation éprouvées.
[^2]: Brief : document synthétique qui formalise le contexte, les objectifs, le périmètre et les contraintes d’un projet ou d’une demande, afin d’aligner rapidement les parties prenantes avant le travail détaillé.
[^3]: PRFAQ (Press Release and Frequently Asked Questions) : méthodologie Working Backwards d’Amazon consistant à rédiger le communiqué de presse d’un produit fini avant son développement, suivie des questions difficiles que clients et parties prenantes poseraient, afin d’éprouver la clarté et la viabilité du concept.
[^4]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d’aligner les équipes sur ce qui doit être construit et pourquoi.
[^5]: UX (User Experience) : discipline qui conçoit et optimise l’ensemble des interactions entre un utilisateur et un produit — organisation, parcours, accessibilité, ergonomie — pour garantir une expérience efficace, satisfaisante et cohérente.
