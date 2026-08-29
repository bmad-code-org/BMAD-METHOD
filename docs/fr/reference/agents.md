---
title: Agents
description: Agents BMM par défaut avec leurs identifiants de skill, déclencheurs de menu et workflows principaux
sidebar:
  order: 2
---

## Agents par défaut

Cette page liste les agents BMM (suite Agile) par défaut installés avec la méthode BMad, ainsi que leurs identifiants de skill, déclencheurs de menu et workflows principaux. Chaque agent est invoqué en tant que skill.

## Notes

- Chaque agent est disponible en tant que skill, généré par l’installateur. L’identifiant de skill (par exemple, `bmad-agent-dev`) est utilisé pour invoquer l’agent.
- Les déclencheurs sont les codes courts affichés dans le menu de chaque agent (par exemple, `PRD`) et les correspondances approximatives présentées dans chaque menu.
- La génération de tests QA est gérée par le skill de workflow `bmad-qa-generate-e2e-tests`, disponible via l’agent Développeur. L’architecte de tests complet (TEA) se trouve dans son propre module.

| Agent                       | Identifiant de skill     | Déclencheurs                                   | Workflows principaux                                                                                                                                                       |
|-----------------------------|--------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Analyste (Mary)             | `bmad-agent-analyst`     | `BP`, `MR`, `DR`, `TR`, `CB`, `WB`, `DP`       | Brainstorming, Recherche marché, Recherche domaine, Recherche technique, Création du brief[^1], Défi PRFAQ, Documentation du projet                                        |
| Product Manager (John)      | `bmad-agent-pm`          | `PRD`, `CE`, `IR`, `CC`                        | Créer, mettre à jour ou valider un PRD, Créer des Epics et Stories, vérifier l’état de préparation à l’Implémentation, Corriger le Cours                                   |
| Architecte (Winston)        | `bmad-agent-architect`   | `CA`, `IR`                                     | Créer l’architecture, Préparation à l’implémentation                                                                                                                       |
| Développeur (Amelia)        | `bmad-agent-dev`         | `BD`, `QA`, `CR`, `SP`, `ER` | Build, Génération de Tests QA, Code Review, Sprint Planning, Rétrospective d’Epic |
| Designer UX (Sally)         | `bmad-agent-ux-designer` | `CU`                                           | Création du design UX[^2]                                                                                                                                                  |

:::note[Où est Paige ?]
La Rédactrice Technique (Paige) est en pause — elle reviendra à l’avenir avec des capacités bien plus étendues. La documentation de projet reste couverte : le déclencheur `DP` (Documentation du projet) est disponible via l’Analyste, ou invoquez directement la compétence `bmad-document-project`.
:::

## Types de déclencheurs

Les déclencheurs de menu d’agent chargent un fichier de workflow structuré. Tapez le code du déclencheur et l’agent démarre le workflow, vous demandant de saisir les informations à chaque étape.

Exemples : `PRD` (Créer, mettre à jour ou valider un PRD), `CA` (Créer l’architecture), `BD` (Build)

## Glossaire

[^1]: Brief : document synthétique qui formalise le contexte, les objectifs, le périmètre et les contraintes d’un projet ou d’une demande, afin d’aligner rapidement les parties prenantes avant le travail détaillé.
[^2]: UX (User Experience) : expérience utilisateur, englobant l’ensemble des interactions et perceptions d’un utilisateur face à un produit. Le design UX vise à créer des interfaces intuitives, efficaces et agréables en tenant compte des besoins, comportements et contexte d’utilisation.
