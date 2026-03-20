---
title: Agents
description: Agents BMM par défaut avec leurs identifiants de skill, déclencheurs de menu et workflows principaux
sidebar:
  order: 2
---

## Agents par défaut

Cette page liste les agents BMM (suite Agile) par défaut installés avec la méthode BMad, ainsi que leurs identifiants de skill, déclencheurs de menu et workflows principaux. Chaque agent est invoqué en tant que skill.

## Notes

- Chaque agent est disponible en tant que skill, généré par l'installateur. L'identifiant de skill (par exemple, `bmad-dev`) est utilisé pour invoquer l'agent.
- Les déclencheurs sont les codes courts de menu (par exemple, `CP`) et les correspondances approximatives affichés dans chaque menu d'agent.
- QA (Quinn) est l'agent léger d'automatisation de tests dans BMM. L'architecte de tests complet (TEA) se trouve dans son propre module.

| Agent                       | Identifiant de skill | Déclencheurs                       | Workflows principaux                                                                                                                                           |
|-----------------------------|----------------------|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Analyste (Mary)             | `bmad-analyst`       | `BP`, `RS`, `CB`, `DP`             | Brainstorming du projet, Recherche, Création du brief[^1], Documentation du projet                                                                             |
| Product Manager (John)      | `bmad-pm`            | `CP`, `VP`, `EP`, `CE`, `IR`, `CC` | Créer/Valider/Modifier le PRD[^2], Créer des epics[^3] et des user stories[^4], Préparation à l’implémentation, Ajuster le cap                                 |
| Architecte (Winston)        | `bmad-architect`     | `CA`, `IR`                         | Créer l’architecture, Préparation à l’implémentation                                                                                                           |
| Scrum Master (Bob)          | `bmad-sm`            | `SP`, `CS`, `ER`, `CC`             | Planification de sprint, Création de user story, Rétrospective d’epic, Ajuster le cap                                                                          |
| Développeur (Amelia)        | `bmad-dev`           | `DS`, `CR`                         | Développement de user story, Revue de code                                                                                                                     |
| QA Engineer (Quinn)         | `bmad-qa`            | `QA`                               | Automatisation (génération de tests pour les fonctionnalités existantes)                                                                                       |
| Quick Solo Dev (Barry)      | `bmad-master`        | `QD`, `CR`                         | Développement rapide, Revue de code                                                                                                                            |
| Designer UX (Sally)         | `bmad-ux-designer`   | `CU`                               | Création du design UX[^5]                                                                                                                                      |
| Rédacteur Technique (Paige) | `bmad-tech-writer`   | `DP`, `WD`, `US`, `MG`, `VD`, `EC` | Documentation du projet, Rédaction de documents, Mise à jour des standards, Génération de diagrammes Mermaid, Validation de documents, Explication de concepts |

## Types de déclencheurs

Les déclencheurs de menu d'agent utilisent deux types d'invocation différents. Connaître le type utilisé par un déclencheur vous aide à fournir la bonne entrée.

### Déclencheurs de workflow (aucun argument nécessaire)

La plupart des déclencheurs chargent un fichier de workflow structuré. Tapez le code du déclencheur et l'agent démarre le workflow, vous demandant de saisir les informations à chaque étape.

Exemples : `CP` (Create PRD), `DS` (Dev Story), `CA` (Create Architecture), `QD` (Quick Dev)

### Déclencheurs conversationnels (arguments requis)

Certains déclencheurs lancent une conversation libre au lieu d'un workflow structuré. Ils s'attendent à ce que vous décriviez ce dont vous avez besoin à côté du code du déclencheur.

| Agent | Déclencheur | Ce qu'il faut fournir |
| --- | --- | --- |
| Rédacteur Technique (Paige) | `WD` | Description du document à rédiger |
| Rédacteur Technique (Paige) | `US` | Préférences ou conventions à ajouter aux standards |
| Rédacteur Technique (Paige) | `MG` | Description et type de diagramme (séquence, organigramme, etc.) |
| Rédacteur Technique (Paige) | `VD` | Document à valider et domaines à examiner |
| Rédacteur Technique (Paige) | `EC` | Nom du concept à expliquer |

**Exemple :**

```text
WD Rédige un guide de déploiement pour notre configuration Docker
MG Crée un diagramme de séquence montrant le flux d’authentification
EC Explique le fonctionnement du système de modules
```

## Glossaire

[^1]: Brief : document synthétique qui formalise le contexte, les objectifs, le périmètre et les contraintes d’un projet ou d’une demande, afin d’aligner rapidement les parties prenantes avant le travail détaillé.
[^2]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d’aligner les équipes sur ce qui doit être construit et pourquoi.
[^3]: Epic : grande unité de travail qui regroupe plusieurs user stories liées à un même objectif fonctionnel. Un epic représente généralement une fonctionnalité majeure ou un thème de développement qui sera décomposé en stories plus fines pour l’implémentation.
[^4]: User story : description courte et simple d’une fonctionnalité du point de vue de l’utilisateur, généralement structurée selon le format "En tant que [rôle], je veux [action] afin de [bénéfice]". Elle sert d’unité de travail lors de la planification et du développement agile.
[^5]: UX (User Experience) : expérience utilisateur, englobant l’ensemble des interactions et perceptions d’un utilisateur face à un produit. Le design UX vise à créer des interfaces intuitives, efficaces et agréables en tenant compte des besoins, comportements et contexte d’utilisation.
