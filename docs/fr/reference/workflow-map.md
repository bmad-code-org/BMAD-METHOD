---
title: "Carte des Workflows"
description: Référence visuelle des phases et des résultats des workflows de la méthode BMad
sidebar:
  order: 1
---

La méthode BMad (BMM) est un module de l'écosystème BMad, conçu pour suivre les meilleures pratiques de l'ingénierie du
contexte et de la planification. Les agents IA fonctionnent de manière optimale avec un contexte clair et structuré. Le
système BMM construit ce contexte progressivement à travers 4 phases distinctes — chaque phase, et plusieurs workflows
optionnels au sein de chaque phase, produisent des documents qui alimentent la phase suivante, afin que les agents
sachent toujours quoi construire et pourquoi.

La logique et les concepts proviennent des méthodologies agiles qui ont été utilisées avec succès dans l'industrie comme
cadre mental de référence.

Si à tout moment vous ne savez pas quoi faire, le skill `bmad-help` vous aidera à rester sur la bonne voie ou à savoir
quoi faire ensuite. Vous pouvez toujours vous référer à cette page également — mais `bmad-help` est entièrement
interactif et beaucoup plus rapide si vous avez déjà installé la méthode BMad. De plus, si vous utilisez différents
modules qui ont étendu la méthode BMad ou ajouté d'autres modules complémentaires non extensifs — `bmad-help` évolue
pour connaître tout ce qui est disponible et vous donner les meilleurs conseils du moment.

Note finale importante : Chaque workflow ci-dessous peut être exécuté directement avec l'outil de votre choix via un
skill ou en chargeant d'abord un agent et en utilisant l'entrée du menu des agents.

<iframe src="/workflow-map-diagram-fr.html" title="Diagramme de la carte des workflows de la méthode BMad" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram-fr.html" target="_blank" rel="noopener noreferrer">Ouvrir le diagramme dans un nouvel onglet ↗</a>
</p>

## Phase 1 : Analyse (Optionnelle)

Explorez l’espace problème et validez les idées avant de vous engager dans la planification. [**Découvrez ce que fait
chaque outil et quand l’utiliser**](../explanation/analysis-phase.md).

| Workflow                                                                  | Objectif                                                                                 | Produit                   |
|---------------------------------------------------------------------------|------------------------------------------------------------------------------------------|---------------------------|
| `bmad-brainstorming`                                                      | Brainstormez des idées de projet avec l’accompagnement guidé d’un coach de brainstorming | `brainstorming-report.md` |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | Validez les hypothèses de marché, techniques ou de domaine                               | Rapport de recherches     |
| `bmad-product-brief`                                                      | Capturez la vision stratégique — idéal lorsque votre concept est clair                   | `product-brief.md`        |
| `bmad-prfaq`                                                              | Working Backwards — éprouvez et forgez votre concept produit                             | `prfaq-{project}.md`      |

## Phase 2 : Planification

Définissez ce qu'il faut construire et pour qui.

| Workflow                | Objectif                                                | Produit      |
|-------------------------|---------------------------------------------------------|--------------|
| `bmad-create-prd`       | Définissez les exigences (FRs/NFRs)[^1]                 | `PRD.md`[^2] |
| `bmad-create-ux-design` | Concevez l'expérience utilisateur (lorsque l'UX compte) | `ux-spec.md` |

## Phase 3 : Solutioning

Décidez comment le construire et décomposez le travail en stories.

| Workflow                              | Objectif                                          | Produit                         |
|---------------------------------------|---------------------------------------------------|---------------------------------|
| `bmad-create-architecture`            | Rendez les décisions techniques explicites        | `architecture.md` avec ADRs[^3] |
| `bmad-create-epics-and-stories`       | Décomposez les exigences en travail implémentable | Fichiers d'epic avec stories    |
| `bmad-check-implementation-readiness` | Vérification avant implémentation                 | Décision Passe/Réserves/Échec   |

## Phase 4 : Implémentation

Construisez, une story à la fois. Bientôt disponible : automatisation complète de la phase 4 !

| Workflow               | Objectif                                                                            | Produit                                              |
|------------------------|-------------------------------------------------------------------------------------|------------------------------------------------------|
| `bmad-sprint-planning` | Initialisez le suivi (une fois par projet pour séquencer le cycle de développement) | `sprint-status.yaml`                                 |
| `bmad-create-story`    | Préparez la story suivante pour implémentation                                      | `story-[slug].md`                                    |
| `bmad-dev-story`       | Implémentez la story                                                                | Code fonctionnel + tests                             |
| `bmad-code-review`     | Validez la qualité de l'implémentation                                              | Approuvé ou changements demandés                     |
| `bmad-correct-course`  | Gérez les changements significatifs en cours de sprint                              | Plan mis à jour ou réorientation                     |
| `bmad-sprint-status`   | Suivez la progression du sprint et le statut des stories                            | Mise à jour du statut du sprint                      |
| `bmad-retrospective`   | Revue après complétion d'un epic                                                    | Leçons apprises                                      |
| `bmad-investigate`     | Enquête de cas avec conclusions à preuves graduées, calibrée selon l'entrée         | `{slug}-investigation.md`        |

## Quick Dev (Parcours Parallèle)

Sautez les phases 1-3 pour les travaux de faible envergure et bien compris.

| Workflow         | Objectif                                                                            | Produit            |
|------------------|-------------------------------------------------------------------------------------|--------------------|
| `bmad-quick-dev` | Flux rapide unifié — clarifie l'intention, planifie, implémente, révise et présente | `spec-*.md` + code |

## Gestion du Contexte

Chaque document devient le contexte de la phase suivante. Le PRD[^2] indique à l'architecte quelles contraintes sont
importantes. L'architecture indique à l'agent de développement quels modèles suivre. Les fichiers de story fournissent
un contexte focalisé et complet pour l'implémentation. Sans cette structure, les agents prennent des décisions
incohérentes.

### Contexte du Projet

:::tip[Recommandé]
Créez `project-context.md` pour vous assurer que les agents IA suivent les règles et préférences de votre projet. Ce
fichier fonctionne comme une constitution pour votre projet — il guide les décisions d'implémentation à travers tous les
workflows. Ce fichier optionnel peut être généré à la fin de la création de l'architecture, ou dans un projet existant
il peut également être généré pour capturer ce qui est important de conserver aligné avec les conventions actuelles.
:::

**Comment le créer :**

- **Manuellement** — Créez `_bmad-output/project-context.md` avec votre pile technologique et vos règles
  d'implémentation
- **Générez-le** — Exécutez `bmad-generate-project-context` pour l'auto-générer à partir de votre architecture ou de
  votre codebase

[**En savoir plus sur project-context.md**](../explanation/project-context.md)

## Glossaire

[^1]: FR / NFR (Functional / Non-Functional Requirement) : exigences décrivant respectivement **ce que le système doit
faire** (fonctionnalités, comportements attendus) et **comment il doit le faire** (contraintes de performance, sécurité,
fiabilité, ergonomie, etc.).
[^2]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins
utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d’aligner les équipes sur
ce qui doit être construit et pourquoi.
[^3]: ADR (Architecture Decision Record) : document qui consigne une décision d’architecture, son contexte, les options
envisagées, le choix retenu et ses conséquences, afin d’assurer la traçabilité et la compréhension des décisions
techniques dans le temps.
