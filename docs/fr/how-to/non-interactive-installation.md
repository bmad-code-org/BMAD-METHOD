---
title: Installation non-interactive
description: Installer BMad en utilisant des options de ligne de commande pour les pipelines CI/CD et les déploiements automatisés
sidebar:
  order: 2
---

Utilisez les options de ligne de commande pour installer BMad de manière non-interactive. Cela est utile pour :

## Quand utiliser cette méthode

- Déploiements automatisés et pipelines CI/CD
- Installations scriptées
- Installations par lots sur plusieurs projets
- Installations rapides avec des configurations connues

:::note[Prérequis]
Nécessite [Node.js](https://nodejs.org) v20+ et `npx` (inclus avec npm).
:::

## Options disponibles

### Options d'installation

| Option | Description | Exemple |
|------|-------------|---------|
| `--directory <chemin>` | Répertoire d'installation | `--directory ~/projects/myapp` |
| `--modules <modules>` | IDs de modules séparés par des virgules | `--modules bmm,bmb` |
| `--tools <outils>` | IDs d'outils/IDE séparés par des virgules (utilisez `none` pour ignorer) | `--tools claude-code,cursor` ou `--tools none` |
| `--action <type>` | Action pour les installations existantes : `install` (par défaut), `update`, ou `quick-update` | `--action quick-update` |

### Configuration principale

| Option | Description | Par défaut |
|------|-------------|---------|
| `--user-name <nom>` | Nom à utiliser par les agents | Nom d'utilisateur système |
| `--communication-language <langue>` | Langue de communication des agents | Anglais |
| `--document-output-language <langue>` | Langue de sortie des documents | Anglais |
| `--output-folder <chemin>` | Chemin du dossier de sortie (voir les règles de résolution ci-dessous) | `_bmad-output` |

#### Résolution du chemin du dossier de sortie

La valeur passée à `--output-folder` (ou saisie de manière interactive) est résolue selon ces règles :

| Type d'entrée                 | Exemple                    | Résolu comme                                                 |
|-------------------------------|----------------------------|--------------------------------------------------------------|
| Chemin relatif (par défaut)   | `_bmad-output`             | `<racine-du-projet>/_bmad-output`                            |
| Chemin relatif avec traversée | `../../shared-outputs`     | Chemin absolu normalisé — ex. `/Users/me/shared-outputs`     |
| Chemin absolu                 | `/Users/me/shared-outputs` | Utilisé tel quel — la racine du projet n'est **pas** ajoutée |

Le chemin résolu est ce que les agents et les workflows vont utiliser lors de l'écriture des fichiers de sortie. L'utilisation d'un chemin absolu ou d'un chemin relatif avec traversée vous permet de diriger tous les artefacts générés vers un répertoire en dehors de l'arborescence de votre projet — utile pour les configurations partagées ou les monorepos.

### Autres options

| Option | Description |
|------|-------------|
| `-y, --yes` | Accepter tous les paramètres par défaut et ignorer les invites |
| `-d, --debug` | Activer la sortie de débogage pour la génération du manifeste |

## IDs de modules

IDs de modules disponibles pour l’option `--modules` :

- `bmm` — méthode BMad Master
- `bmb` — BMad Builder

Consultez le [registre BMad](https://github.com/bmad-code-org) pour les modules externes disponibles.

## IDs d'outils/IDE

IDs d'outils disponibles pour l’option `--tools` :

**Recommandés :** `claude-code`, `cursor`

Exécutez `npx bmad-method install` de manière interactive une fois pour voir la liste complète actuelle des outils pris en charge, ou consultez la [configuration des codes de la plateforme](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/tools/installer/ide/platform-codes.yaml).

## Modes d'installation

| Mode | Description | Exemple |
|------|-------------|---------|
| Entièrement non-interactif | Fournir toutes les options pour ignorer toutes les invites | `npx bmad-method install --directory . --modules bmm --tools claude-code --yes` |
| Semi-interactif | Fournir certains options ; BMad demande les autres | `npx bmad-method install --directory . --modules bmm` |
| Paramètres par défaut uniquement | Accepter tous les paramètres par défaut avec `-y` | `npx bmad-method install --yes` |
| Sans outils | Ignorer la configuration des outils/IDE | `npx bmad-method install --modules bmm --tools none` |

## Exemples

### Installation dans un pipeline CI/CD

```bash
#!/bin/bash
# install-bmad.sh

npx bmad-method install \
  --directory "${GITHUB_WORKSPACE}" \
  --modules bmm \
  --tools claude-code \
  --user-name "CI Bot" \
  --communication-language Français \
  --document-output-language Français \
  --output-folder _bmad-output \
  --yes
```

### Mettre à jour une installation existante

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action update \
  --modules bmm,bmb,custom-module
```

### Mise à jour rapide (conserver les paramètres)

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action quick-update
```

## Ce que vous obtenez

- Un répertoire `_bmad/` entièrement configuré dans votre projet
- Des agents et des flux de travail configurés pour vos modules et outils sélectionnés
- Un dossier `_bmad-output/` pour les artefacts générés

## Validation et gestion des erreurs

BMad valide toutes les options fournis :

- **Directory** — Doit être un chemin valide avec des permissions d'écriture
- **Modules** — Avertit des IDs de modules invalides (mais n'échoue pas)
- **Tools** — Avertit des IDs d'outils invalides (mais n'échoue pas)
- **Action** — Doit être l'une des suivantes : `install`, `update`, `quick-update`

Les valeurs invalides entraîneront soit :
1. L’affichage d’un message d'erreur suivi d’un exit (pour les options critiques comme le répertoire)
2. Un avertissement puis la continuation de l’installation (pour les éléments optionnels)
3. Un retour aux invites interactives (pour les valeurs requises manquantes)

:::tip[Bonnes pratiques]
- Utilisez des chemins absolus pour `--directory` pour éviter toute ambiguïté
- Utilisez un chemin absolu pour `--output-folder` lorsque vous souhaitez que les artefacts soient écrits en dehors de l'arborescence du projet (ex. un répertoire de sorties partagé dans un monorepo)
- Testez les options localement avant de les utiliser dans des pipelines CI/CD
- Combinez avec `-y` pour des installations vraiment sans surveillance
- Utilisez `--debug` si vous rencontrez des problèmes lors de l'installation
:::

## Résolution des problèmes

### L'installation échoue avec "Invalid directory"

- Le chemin du répertoire doit exister (ou son parent doit exister)
- Vous avez besoin des permissions d'écriture
- Le chemin doit être absolu ou correctement relatif au répertoire actuel

### Module non trouvé

- Vérifiez que l'ID du module est correct
- Les modules externes doivent être disponibles dans le registre

:::note[Toujours bloqué ?]
Exécutez avec `--debug` pour une sortie détaillée, essayez le mode interactif pour isoler le problème, ou signalez-le à <https://github.com/bmad-code-org/BMAD-METHOD/issues>.
:::
