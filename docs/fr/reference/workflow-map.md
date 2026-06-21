---
title: "Carte des Workflows"
description: Référence visuelle des phases et des livrables des workflows de la méthode BMad
sidebar:
  order: 1
---

La méthode BMad (BMM) est un module de l’écosystème BMad, conçu pour appliquer les meilleures pratiques d’ingénierie du
contexte et de planification. Les agents IA sont plus performants lorsqu’ils disposent d’un contexte clair et structuré. Le
système BMM construit ce contexte de manière progressive, en 4 phases distinctes — chaque phase, ainsi que les workflows
optionnels qu’elle contient, produit des documents qui nourrissent la phase suivante. Ainsi, les agents savent toujours
ce qu’ils doivent construire et pourquoi.

La logique et les concepts sous-jacents s’appuient sur les méthodologies agiles, largement éprouvées dans l’industrie
comme cadre de référence.

Si vous ne savez plus où vous en êtes, le skill `bmad-help` vous remettra sur la bonne voie ou vous indiquera la prochaine
étape. Cette page reste une référence utile, mais `bmad-help` est interactif et bien plus rapide si vous avez déjà installé
la méthode BMad. Par ailleurs, si vous utilisez des modules ayant étendu la méthode BMad ou ajouté d’autres modules
complémentaires non extensibles, `bmad-help` s’adapte automatiquement pour couvrir tout ce qui est disponible et vous
fournir les meilleurs conseils en temps réel.

Note importante : chaque workflow ci-dessous peut être exécuté directement via un skill avec l’outil de votre choix, ou
en chargeant d’abord un agent depuis le menu des agents.

<iframe src="/workflow-map-diagram-fr.html" title="Diagramme de la carte des workflows de la méthode BMad" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram-fr.html" target="_blank" rel="noopener noreferrer">Ouvrir le diagramme dans un nouvel onglet ↗</a>
</p>

## Phase 1 : Analyse (Optionnelle)

Explorez l’espace problème et validez vos idées avant de vous lancer dans la planification. [**Découvrez ce que fait
chaque outil et quand l’utiliser**](../explanation/analysis-phase.md).

| Workflow                                                                  | Objectif                                                                       | Livrable                  |
|---------------------------------------------------------------------------|--------------------------------------------------------------------------------|---------------------------|
| `bmad-brainstorming`                                                      | Brainstormez des idées de projet, animé par un coach de brainstorming dédié    | `brainstorming-report.md` |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | Validez vos hypothèses de marché, techniques ou liées au domaine               | Rapport de recherches     |
| `bmad-product-brief`                                                      | Formalisez la vision stratégique — idéal lorsque votre concept est bien défini | `product-brief.md`        |
| `bmad-prfaq`                                                              | Working Backwards — mettez à l’épreuve et affinez votre concept produit        | `prfaq-{project}.md`      |

## Phase 2 : Planification

Définissez ce qu’il faut construire et pour qui.

| Workflow   | Objectif                                                                                               | Livrable                                                                                                          |
|------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `bmad-prd` | Créez, mettez à jour ou validez un PRD[^1] — découverte accompagnée, trois intentions en un seul skill | Création/Mise à jour : `prd.md`, `addendum.md`, `.memlog.md` ; Validation : `validation-report.html` + `.md` |
| `bmad-ux`  | Concevez l’expérience utilisateur (lorsque l’UX compte)                                                | `DESIGN.md`, `EXPERIENCE.md`                                                                                      |

:::tip[Trois intentions en un seul skill]
`bmad-prd` couvre l’intégralité du cycle de vie du PRD. Précisez votre intention lors de l’appel, sinon le skill vous la demandera :

- **Créer** — nouveau PRD à partir de zéro via une découverte accompagnée ; produit `prd.md`, `addendum.md` et `.memlog.md`
- **Mettre à jour** — réconcilie un PRD existant avec un signal de changement, en mettant en évidence les conflits avant d’appliquer les modifications
- **Valider** — évalue un PRD à l’aide d’une liste de contrôle configurable et produit un rapport de constats structuré au format HTML
:::

:::tip[En amont : `bmad-product-brief`]
`bmad-product-brief` (Phase 1) produit un `product-brief.md` que `bmad-prd` peut exploiter lors de la découverte, réduisant les redondances et gardant les deux documents alignés. Aucun des deux skills ne nécessite l’autre — commencez directement par `bmad-prd` si vous savez déjà ce que vous construisez.
:::

## Phase 3 : Conception de la Solution

Décidez comment le construire et décomposez le travail en stories.

| Workflow                              | Objectif                                          | Livrable                        |
|---------------------------------------|---------------------------------------------------|---------------------------------|
| `bmad-create-architecture`            | Rendez explicites les décisions techniques        | `architecture.md` avec ADRs[^2] |
| `bmad-create-epics-and-stories`       | Décomposez les exigences en tâches implémentables | Fichiers d’epic avec stories    |
| `bmad-check-implementation-readiness` | Jalon de validation avant implémentation          | Décision OK / RÉSERVES / ÉCHEC  |

## Phase 4 : Implémentation

Construisez, une story à la fois. L’automatisation complète de la phase 4 arrive bientôt !

| Workflow               | Objectif                                                                             | Livrable                         |
|------------------------|--------------------------------------------------------------------------------------|----------------------------------|
| `bmad-sprint-planning` | Initialisez le suivi (une fois par projet, pour séquencer le cycle de développement) | `sprint-status.yaml`             |
| `bmad-create-story`    | Préparez la story suivante pour implémentation                                       | `story-[slug].md`                |
| `bmad-dev-story`       | Implémentez la story                                                                 | Code fonctionnel + tests         |
| `bmad-code-review`     | Validez la qualité de l’implémentation                                               | Approuvé ou changements demandés |
| `bmad-correct-course`  | Gérez les changements significatifs en cours de sprint                               | Plan mis à jour ou réorientation |
| `bmad-sprint-status`   | Suivez la progression du sprint et le statut des stories                             | Mise à jour du statut du sprint  |
| `bmad-retrospective`   | Bilan après l’achèvement d’un epic                                                   | Leçons apprises                  |
| `bmad-investigate`     | Analyse forensique avec conclusions pondérées par les preuves, adaptée au cas traité | `{slug}-investigation.md`        |

## Flux Rapide (Parcours Parallèle)

Ignorez les phases 1 à 3 pour les travaux de faible envergure et bien cernés.

| Workflow         | Objectif                                                                              | Livrable           |
|------------------|---------------------------------------------------------------------------------------|--------------------|
| `bmad-quick-dev` | Flux rapide unifié — clarifiez l’intention, planifiez, implémentez, révisez et livrez | `spec-*.md` + code |

## Gestion du Contexte

Chaque document nourrit le contexte de la phase suivante. Le PRD indique à l’architecte les contraintes à respecter.
L’architecture précise à l’agent de développement les modèles à suivre. Les fichiers de story fournissent un contexte
ciblé et exhaustif pour l’implémentation. Sans cette structure, les agents prennent des décisions incohérentes.

### Contexte du Projet

:::tip[Recommandé]
Créez `project-context.md` pour que les agents IA respectent les règles et préférences de votre projet. Ce fichier agit
comme une charte pour votre projet — il oriente les décisions d’implémentation à travers tous les workflows. Ce fichier
optionnel peut être généré à la fin de la création de l’architecture, ou, dans un projet existant, pour capturer les
éléments clés et les garder alignés avec les conventions en vigueur.
:::

**Comment le créer :**

- **Manuellement** — Créez `_bmad-output/project-context.md` avec votre stack technique et vos règles d’implémentation
- **Générez-le** — Exécutez `bmad-generate-project-context` pour l’auto-générer à partir de votre architecture ou de votre codebase

[**En savoir plus sur project-context.md**](../explanation/project-context.md)

## Glossaire

[^1]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins
utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d’aligner les équipes sur
ce qui doit être construit et pourquoi.
[^2]: ADR (Architecture Decision Record) : document qui consigne une décision d’architecture, son contexte, les options
envisagées, le choix retenu et ses conséquences, afin d’assurer la traçabilité et la compréhension des décisions
techniques dans le temps.
