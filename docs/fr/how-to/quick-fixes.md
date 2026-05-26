---
title: "Corrections Rapides"
description: Comment effectuer des corrections rapides et des modifications ciblées
sidebar:
  order: 5
---

Utilisez **Quick Dev** pour les corrections de bugs, les refactorisations ou les petites modifications ciblées qui ne nécessitent pas la méthode BMad complète.

## Quand Utiliser Cette Approche

- Corrections de bugs avec une cause claire et connue
- Petites refactorisations (renommage, extraction, restructuration) contenues dans quelques fichiers
- Ajustements mineurs de fonctionnalités ou modifications de configuration
- Mises à jour de dépendances

:::note[Prérequis]
- Méthode BMad installée (`npx bmad-method install`)
- Un IDE IA (Claude Code, Cursor, ou similaire)
:::

## Étapes

### 1. Démarrer une Nouvelle Conversation

Ouvrez une **nouvelle conversation** dans votre IDE IA. Réutiliser une session d'un workflow précédent peut causer des conflits de contexte.

### 2. Spécifiez Votre Intention

Quick Dev accepte l'intention en forme libre — avant, avec, ou après l'invocation. Exemples :

```text
quick-dev — Corrige le bug de validation de connexion qui permet les mots de passe vides.
```

```text
quick-dev — corrige https://github.com/org/repo/issues/42
```

```text
quick-dev — implémente _bmad-output/implementation-artifacts/my-intent.md
```

```text
Je pense que le problème est dans le middleware d'auth, il ne vérifie pas l'expiration du token.
Regardons... oui, src/auth/middleware.ts ligne 47 saute complètement la vérification exp. lance quick-dev
```

```text
quick-dev
> Que voulez-vous faire ?
Refactoriser UserService pour utiliser async/await au lieu des callbacks.
```

Texte brut, chemins de fichiers, URLs d'issues GitHub, liens de trackers de bugs — tout ce que le LLM peut résoudre en une intention concrète.

### 3. Répondre aux Questions et Approuver

Quick Dev peut poser des questions de clarification ou présenter une courte spécification demandant votre approbation avant l'implémentation. Répondez à ses questions et approuvez lorsque vous êtes satisfait du plan.

### 4. Réviser et Pousser

Quick Dev implémente la modification, révise son propre travail, corrige les problèmes et effectue un commit local. Lorsqu'il a terminé, il ouvre les fichiers affectés dans votre éditeur.

- Parcourez le diff pour confirmer que la modification correspond à votre intention
- Si quelque chose semble incorrect, dites à l'agent ce qu'il faut corriger — il peut itérer dans la même session

Une fois satisfait, poussez le commit. Quick Dev vous proposera de pousser et de créer une PR pour vous.

:::caution[Si Quelque Chose Casse]
Si une modification poussée cause des problèmes inattendus, utilisez `git revert HEAD` pour annuler proprement le dernier commit. Ensuite, démarrez une nouvelle conversation et exécutez Quick Dev à nouveau pour essayer une approche différente.
:::

## Ce Que Vous Obtenez

- Fichiers source modifiés avec la correction ou refactorisation appliquée
- Tests passants (si votre projet a une suite de tests)
- Un commit prêt à pousser avec un message de commit conventionnel

## Travail Différé

Quick Dev garde chaque exécution concentrée sur un seul objectif. Si votre demande contient plusieurs objectifs indépendants, ou si la revue remonte des problèmes préexistants non liés à votre modification, Quick Dev les diffère vers un fichier (`deferred-work.md` dans votre répertoire d'artefacts d'implémentation) plutôt que d'essayer de tout régler en même temps.

Consultez ce fichier après une exécution — c'est votre backlog[^1] de choses sur lesquelles revenir. Chaque élément différé peut être introduit dans une nouvelle exécution Quick Dev ultérieurement.

## Quand Passer à une Planification Formelle

Envisagez d'utiliser la méthode BMad complète lorsque :

- La modification affecte plusieurs systèmes ou nécessite des mises à jour coordonnées dans de nombreux fichiers
- Vous n'êtes pas sûr de la portée et avez besoin d'une découverte des exigences d'abord
- Vous avez besoin de documentation ou de décisions architecturales enregistrées pour l'équipe

Voir [Quick Dev](../explanation/quick-dev.md) pour plus d'informations sur la façon dont Quick Dev s'intègre dans la méthode BMad.

## Glossaire

[^1]: Backlog : liste priorisée de tâches ou d'éléments de travail à traiter ultérieurement, issue des méthodologies agiles.
