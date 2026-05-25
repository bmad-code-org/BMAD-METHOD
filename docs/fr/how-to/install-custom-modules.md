---
title: "Installer des modules personnalisés et communautaires"
description: Installer des modules tiers depuis le registre communautaire, des dépôts Git ou des chemins locaux
sidebar:
  order: 3
---

Utilisez l’installateur BMad pour ajouter des modules depuis le registre communautaire, des dépôts Git tiers ou des chemins locaux.

## Quand l’utiliser

- Installer un module contribué par la communauté depuis le registre BMad
- Installer un module depuis un dépôt Git tiers (GitHub, GitLab, Bitbucket, auto-hébergé)
- Tester un module que vous développez localement avec BMad Builder
- Installer des modules depuis un serveur Git privé ou auto-hébergé

:::note[Prérequis]
Nécessite [Node.js](https://nodejs.org) v20.12+ et `npx` (inclus avec npm). Les modules personnalisés et communautaires peuvent être sélectionnés lors d’une nouvelle installation ou ajoutés à une installation existante.
:::

## Modules communautaires

Les modules communautaires sont regroupés dans le [marketplace de plugins BMad](https://github.com/bmad-code-org/bmad-plugins-marketplace). Ils sont organisés par catégorie et épinglés à un commit approuvé pour des raisons de sécurité.

### 1. Lancer l’installateur

```bash
npx bmad-method install
```

### 2. Parcourir le catalogue communautaire

Après avoir sélectionné les modules officiels, l’installateur demande :

```
Would you like to browse community modules?
```

Sélectionnez **Yes** pour accéder au navigateur de catalogue. Vous pouvez :

- Parcourir par catégorie
- Voir les modules phares
- Voir tous les modules disponibles
- Rechercher par mot-clé

### 3. Sélectionner des modules

Choisissez des modules dans n’importe quelle catégorie. L’installateur affiche les descriptions, versions et niveaux de confiance. Les modules déjà installés sont pré-sélectionnés pour la mise à jour.

### 4. Poursuivre l’installation

Après avoir sélectionné les modules communautaires, l’installateur passe aux sources personnalisées, puis à la configuration des outils/IDE et au reste du flux d’installation.

## Sources personnalisées (URL Git et chemins locaux)

Les modules personnalisés peuvent provenir de n’importe quel dépôt Git ou d’un répertoire local sur votre machine. L’installateur résout la source, analyse la structure du module et l’installe aux côtés de vos autres modules.

### Installation interactive

Durant l’installation, après l’étape des modules communautaires, l’installateur demande :

```
Would you like to install from a custom source (Git URL or local path)?
```

Sélectionnez **Yes**, puis indiquez une source :

| Type d’entrée             | Exemple                                           |
| ------------------------- | ------------------------------------------------- |
| URL HTTPS (tout hôte)     | `https://github.com/org/repo`                     |
| URL HTTP (tout hôte)      | `http://host/org/repo`                            |
| URL HTTPS avec sous-rép.  | `https://github.com/org/repo/tree/main/my-module` |
| URL SSH                   | `git@github.com:org/repo.git`                     |
| Chemin local              | `/Users/me/projects/my-module`                    |
| Chemin local avec tilde   | `~/projects/my-module`                            |

L’installateur clone le dépôt (pour les URL) ou lit directement depuis le disque (pour les chemins locaux), puis présente les modules découverts pour la sélection.

### Installation non interactive

Utilisez l’option `--custom-source` pour installer des modules personnalisés depuis la ligne de commande :

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

Quand `--custom-source` est fourni sans `--modules`, seuls le cœur et les modules personnalisés sont installés. Pour inclure également les modules officiels, ajoutez `--modules` :

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

Plusieurs sources peuvent être séparées par des virgules :

```bash
--custom-source /path/one,https://github.com/org/repo,/path/two
```

## Fonctionnement de la découverte de modules

L’installateur utilise deux modes pour trouver les modules installables dans une source :

| Mode       | Déclencheur                                          | Comportement                                                                                                     |
|------------|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| Découverte | La source contient `.claude-plugin/marketplace.json` | Liste tous les plugins du manifeste ; vous choisissez lesquels installer                                         |
| Direct     | Aucun `marketplace.json` trouvé                      | Analyse le répertoire pour trouver des skills (sous-répertoires avec `SKILL.md`), les résout en un module unique |

Le mode découverte est typique des modules publiés. Le mode direct est pratique pour pointer vers un répertoire de skills pendant le développement local.

:::note[À propos de `.claude-plugin/`]
Le chemin `.claude-plugin/marketplace.json` est une convention standard adoptée par plusieurs installateurs d’outils IA pour la découvabilité des plugins. Il ne nécessite pas Claude, n’utilise pas les API Claude et n’a aucun impact sur l’outil d’IA que vous utilisez. Tout module contenant ce fichier peut être découvert par tout installateur suivant cette convention.
:::

## Flux de travail en développement local

Si vous construisez un module avec [BMad Builder](https://github.com/bmad-code-org/bmad-builder), vous pouvez l’installer directement depuis votre répertoire de travail :

```bash
npx bmad-method install \
  --directory ~/my-project \
  --custom-source ~/my-module-repo/skills \
  --tools claude-code \
  --yes
```

Les sources locales sont référencées par leur chemin, non copiées dans un cache. Lorsque vous mettez à jour la source de votre module et réinstallez, l’installateur récupère les dernières modifications.

:::caution[Suppression de la source]
Si vous supprimez le répertoire source local après l’installation, les fichiers du module installé dans `_bmad/` sont préservés. Le module sera ignoré lors des mises à jour tant que le chemin source n’est pas restauré.
:::

## Ce que vous obtenez

Après l’installation, les modules personnalisés apparaissent dans `_bmad/` aux côtés des modules officiels :

```
your-project/
├── _bmad/
│   ├── core/              # Module cœur intégré
│   ├── bmm/               # Module officiel (si sélectionné)
│   ├── my-module/         # Votre module personnalisé
│   │   ├── my-skill/
│   │   │   └── SKILL.md
│   │   └── module-help.csv
│   └── _config/
│       └── manifest.yaml  # Suit tous les modules, versions et sources
└── ...
```

Le manifeste enregistre la source de chaque module personnalisé (`repoUrl` pour les sources Git, `localPath` pour les sources locales) afin que les mises à jour rapides puissent localiser la source à nouveau.

## Mettre à jour les modules personnalisés

Les modules personnalisés participent au flux de mise à jour normal :

- **Mise à jour rapide** (`--action quick-update`) : Rafraîchit tous les modules depuis leurs sources d’origine. Les modules Git sont re-téléchargés ; les modules locaux sont relus depuis leur chemin source.
- **Mise à jour complète** : Relance la sélection de modules pour que vous puissiez ajouter ou retirer des modules personnalisés.

## Créer vos propres modules

Utilisez [BMad Builder](https://github.com/bmad-code-org/bmad-builder) pour créer des modules que d’autres pourront installer :

1. Exécutez `bmad-module-builder` pour générer la structure de votre module
2. Ajoutez des skills, agents et workflows avec les divers outils BMad Builder
3. Publiez dans un dépôt Git ou partagez le dossier
4. D’autres installent avec `--custom-source <url-de-votre-dépôt>`

Pour que les modules supportent le mode découverte, incluez un fichier `.claude-plugin/marketplace.json` à la racine de votre dépôt (c’est une convention multi-outils, pas spécifique à Claude). Consultez la [documentation BMad Builder](https://github.com/bmad-code-org/bmad-builder) pour le format du fichier `marketplace.json`.

:::tip[Tester localement d’abord]
Pendant le développement, installez votre module avec un chemin local pour itérer rapidement avant de publier dans un dépôt Git.
:::
