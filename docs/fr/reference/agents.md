---
title: Agents
description: Agents BMM par défaut avec leurs identifiants de skill, déclencheurs de menu et workflows principaux
sidebar:
  order: 2
---

## Agents par défaut

Cette page liste les agents BMM (suite Agile) par défaut installés avec la méthode BMad, ainsi que leurs identifiants de skill, déclencheurs de menu et workflows principaux. Chaque agent est invoqué en tant que skill.

## Notes

- Chaque agent est disponible en tant que skill, généré par l’installateur. L’identifiant de skill (par exemple, `bmad-dev`) est utilisé pour invoquer l’agent.
- Les déclencheurs sont les codes courts de menu (par exemple, `BP`) et les correspondances approximatives affichés dans chaque menu d’agent.
- La génération de tests QA est gérée par le skill de workflow `bmad-qa-generate-e2e-tests`, disponible par l’agent Développeur. L’architecte de tests complet (TEA) se trouve dans son propre module.

| Agent                       | Identifiant de skill | Déclencheurs                             | Workflows principaux                                                                                                                                           |
|-----------------------------|----------------------|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Analyste (Mary)             | `bmad-analyst`       | `BP`, `MR`, `DR`, `TR`, `CB`, `WB`, `DP` | Brainstorming du projet, Recherche marché/domaine/technique, Création du brief[^1], Défi PRFAQ, Documentation du projet                                        |
| Product Manager (John)      | `bmad-pm`            | `CP`, `VP`, `EP`, `CE`, `IR`, `CC`       | Créer/Valider/Éditer un PRD, Créer des Epics et Stories, vérifier l’état de préparation à l’Implémentation, Corriger le Cours                                 |
| Architecte (Winston)        | `bmad-architect`     | `CA`, `IR`                               | Créer l’architecture, Préparation à l’implémentation                                                                                                           |
| Développeur (Amelia)        | `bmad-agent-dev`     | `DS`, `QD`, `QA`, `CR`, `SP`, `CS`, `ER` | Dev Story, Quick Dev, Génération de Tests QA, Code Review, Sprint Planning, Créer Story, Rétrospective d’Epic                                                  |
| Designer UX (Sally)         | `bmad-ux-designer`   | `CU`                                     | Création du design UX[^2]                                                                                                                                      |
| Rédacteur Technique (Paige) | `bmad-tech-writer`   | `DP`, `WD`, `US`, `MG`, `VD`, `EC`       | Documentation du projet, Rédaction de documents, Mise à jour des standards, Génération de diagrammes Mermaid, Validation de documents, Explication de concepts |

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
[^2]: UX (User Experience) : expérience utilisateur, englobant l’ensemble des interactions et perceptions d’un utilisateur face à un produit. Le design UX vise à créer des interfaces intuitives, efficaces et agréables en tenant compte des besoins, comportements et contexte d’utilisation.
