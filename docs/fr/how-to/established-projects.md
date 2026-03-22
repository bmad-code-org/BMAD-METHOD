---
title: "Projets existants"
description: Comment utiliser la méthode BMad sur des bases de code existantes
sidebar:
  order: 6
---

Utilisez la méthode BMad efficacement lorsque vous travaillez sur des projets existants et des bases de code legacy.

Ce guide couvre le flux de travail essentiel pour l'intégration à des projets existants avec la méthode BMad.

:::note[Prérequis]
- méthode BMad installée (`npx bmad-method install`)
- Une base de code existante sur laquelle vous souhaitez travailler
- Accès à un IDE IA (Claude Code ou Cursor)
:::

## Étape 1 : Nettoyer les artefacts de planification terminés

Si vous avez terminé tous les epics et stories du PRD[^1] via le processus BMad, nettoyez ces fichiers. Archivez-les, supprimez-les, ou appuyez-vous sur l'historique des versions si nécessaire. Ne conservez pas ces fichiers dans :

- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## Étape 2 : Créer le contexte du projet

:::tip[Recommandé pour les projets existants]
Générez `project-context.md` pour capturer les patterns et conventions de votre base de code existante. Cela garantit que les agents IA suivent vos pratiques établies lors de l'implémentation des modifications.
:::

Exécutez le workflow de génération de contexte du projet :

```bash
bmad-generate-project-context
```

Cela analyse votre base de code pour identifier :
- La pile technologique et les versions
- Les patterns d'organisation du code
- Les conventions de nommage
- Les approches de test
- Les patterns spécifiques aux frameworks

Vous pouvez examiner et affiner le fichier généré, ou le créer manuellement à `_bmad-output/project-context.md` si vous préférez.

[En savoir plus sur le contexte du projet](../explanation/project-context.md)

## Étape 3 : Maintenir une documentation de projet de qualité

Votre dossier `docs/` doit contenir une documentation succincte et bien organisée qui représente fidèlement votre projet :

- L'intention et la justification métier
- Les règles métier
- L'architecture
- Toute autre information pertinente sur le projet

Pour les projets complexes, envisagez d'utiliser le workflow `bmad-document-project`. Il offre des variantes d'exécution qui analyseront l'ensemble de votre projet et documenteront son état actuel réel.

## Étape 4 : Obtenir de l'aide

### BMad-Help : Votre point de départ

**Exécutez `bmad-help` chaque fois que vous n'êtes pas sûr de la prochaine étape.** Ce guide intelligent :

- Inspecte votre projet pour voir ce qui a déjà été fait
- Affiche les options basées sur vos modules installés
- Comprend les requêtes en langage naturel

```
bmad-help J'ai une app Rails existante, par où dois-je commencer ?
bmad-help Quelle est la différence entre quick-dev et la méthode complète ?
bmad-help Montre-moi quels workflows sont disponibles
```

BMad-Help s'exécute également **automatiquement à la fin de chaque workflow**, fournissant des conseils clairs sur exactement quoi faire ensuite.

### Choisir votre approche

Vous avez deux options principales selon l'ampleur des modifications :

| Portée                                    | Approche recommandée                                                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Petites mises à jour ou ajouts**        | Exécutez `bmad-quick-dev` pour clarifier l'intention, planifier, implémenter et réviser dans un seul workflow. La méthode BMad complète en quatre phases est probablement excessive. |
| **Modifications ou ajouts majeurs**       | Commencez avec la méthode BMad, en appliquant autant ou aussi peu de rigueur que nécessaire.                                            |

### Pendant la création du PRD

Lors de la création d'un brief ou en passant directement au PRD[^1], assurez-vous que l'agent :

- Trouve et analyse votre documentation de projet existante
- Lit le contexte approprié sur votre système actuel

Vous pouvez guider l'agent explicitement, mais l'objectif est de garantir que la nouvelle fonctionnalité s'intègre bien à votre système existant.

### Considérations UX

Le travail UX[^2] est optionnel. La décision dépend non pas de savoir si votre projet a une UX, mais de :

- Si vous allez travailler sur des modifications UX
- Si des conceptions ou patterns UX significatifs sont nécessaires

Si vos modifications se résument à de simples mises à jour d'écrans existants qui vous satisfont, un processus UX complet n'est pas nécessaire.

### Considérations d'architecture

Lors de la création de l'architecture, assurez-vous que l'architecte :

- Utilise les fichiers documentés appropriés
- Analyse la base de code existante

Soyez particulièrement attentif ici pour éviter de réinventer la roue ou de prendre des décisions qui ne s'alignent pas avec votre architecture existante.

## Plus d'informations

- **[Corrections rapides](./quick-fixes.md)** - Corrections de bugs et modifications ad-hoc
- **[FAQ Projets existants](../explanation/established-projects-faq.md)** - Questions courantes sur le travail sur des projets établis

## Glossaire

[^1]: PRD (Product Requirements Document) : document de référence qui décrit les objectifs du produit, les besoins utilisateurs, les fonctionnalités attendues, les contraintes et les critères de succès, afin d'aligner les équipes sur ce qui doit être construit et pourquoi.
[^2]: UX (User Experience) : expérience utilisateur, englobant l'ensemble des interactions et perceptions d'un utilisateur face à un produit. Le design UX vise à créer des interfaces intuitives, efficaces et agréables en tenant compte des besoins, comportements et contexte d'utilisation.
