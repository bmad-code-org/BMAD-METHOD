---
title: "Comment installer BMad"
description: Installer, mettre à jour et épingler BMad pour le développement local, les équipes et CI
sidebar:
  order: 1
---

Utilisez `npx bmad-method install` pour configurer BMad dans votre projet. Une seule commande gère les premières installations, les mises à niveau, le changement de canal et les exécutions CI scriptées. Cette page couvre tout cela.

## Quand l’utiliser

- Démarrer un nouveau projet avec BMad
- Ajouter ou retirer des modules sur une installation existante
- Basculer un module sur main-HEAD ou l’épingler à une version spécifique
- Scripter des installations pour des pipelines CI, des Dockerfiles ou des déploiements en entreprise

:::note[Prérequis]

- **Node.js** 20.12+ (requis pour l’installateur)
- **Git** (pour cloner les modules externes)
- **Un outil d’IA** tel que Claude Code ou Cursor (exécutez `npx bmad-method install --list-tools` pour voir tous les outils supportés)

:::

## Première installation (méthode rapide)

```bash
npx bmad-method install
```

L’assistant interactif vous pose cinq questions :

1. Le répertoire d’installation (par défaut le répertoire de travail courant)
2. Quels modules installer (cases à cocher pour core, bmm, bmb, cis, gds, tea)
3. **« Ready to install (all stable)? »** — Oui accepte le dernier tag publié pour chaque module externe
4. Quels outils/IDE d’IA intégrer (claude-code, cursor et d’autres)
5. La configuration par module (nom, langue, dossier de sortie)

En acceptant les valeurs par défaut, vous obtenez la dernière version stable de chaque module, configurée pour votre outil choisi.

:::tip[Vous voulez juste la dernière préversion ?]

```bash
npx bmad-method@next install
```

Exécute l’installateur de préversion, qui fournit un snapshot plus récent de core et bmm. Davantage de changements, avec un délai réduit entre le développement et la publication.
:::

## Choisir une version spécifique

Deux axes indépendants contrôlent ce qui se retrouve sur le disque.

### Axe 1 : canaux des modules externes

Chaque module externe — bmb, cis, gds, tea, et tout module communautaire — s’installe via l’un des trois canaux suivants :

| Canal             | Ce qui est installé                                                                  | Pour qui                                      |
|-------------------|--------------------------------------------------------------------------------------|-----------------------------------------------|
| `stable` (défaut) | Le plus haut tag semver publié. Les préversions comme `v2.0.0-alpha.1` sont exclues. | La plupart des utilisateurs                   |
| `next`            | Le HEAD de la branche main au moment de l’installation                               | Contributeurs, early adopters                 |
| `pinned`          | Un tag spécifique de votre choix                                                     | Installations entreprise, reproductibilité CI |

Les canaux sont définis module par module. Vous pouvez exécuter bmb sur `next` tout en laissant cis sur `stable` — les options ci-dessous permettent de les combiner librement.

### Axe 2 : version du binaire de l’installateur

Le paquet npm `bmad-method` lui-même a deux dist-tags :

| Commande                              | Ce que vous obtenez                                                                   |
|---------------------------------------|---------------------------------------------------------------------------------------|
| `npx bmad-method install` (`@latest`) | Dernière version stable de l’installateur                                             |
| `npx bmad-method@next install`        | Dernière préversion de l’installateur, publiée automatiquement à chaque push sur main |

**Le binaire de l’installateur détermine vos versions de core et bmm.** Ces deux modules sont embarqués dans le paquet de l’installateur plutôt que clonés depuis des dépôts séparés.

### Pourquoi core et bmm n’ont pas leur propre canal

Ils sont liés au binaire de l’installateur que vous avez exécuté :

- `npx bmad-method install` → core et bmm stables les plus récents
- `npx bmad-method@next install` → core et bmm en préversion
- `node /chemin/vers/checkout-local/tools/installer/bmad-cli.js install` → ce que votre checkout local contient

`--pin bmm=v6.3.0` et `--next=bmm` n’ont aucun effet sur les modules intégrés (l’installateur vous avertit si vous tentez de les utiliser). Une prochaine version détachera bmm du paquet de l’installateur ; une fois publiée, bmm disposera d’un sélecteur de canal dédié, comme c’est le cas pour bmb aujourd’hui.

## Mettre à jour une installation existante

Exécuter `npx bmad-method install` dans un répertoire contenant déjà `_bmad/` affiche un menu :

| Choix              | Ce qu’il fait                                                                                                                                                                                                        |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Quick Update**   | Réexécute l’installation avec vos paramètres existants. Rafraîchit les fichiers, applique les correctifs et les mises à niveau mineures du canal stable, refuse les mises à niveau majeures. Rapide, non interactif. |
| **Modify Install** | Flux interactif complet. Ajoutez ou retirez des modules, reconfigurez les paramètres, examinez et, si besoin, modifiez les canaux des modules existants.                                                             |

### Invites de mise à niveau

Quand Modify détecte un tag stable plus récent pour un module que vous avez installé sur `stable`, il classe le diff et vous invite en conséquence :

| Type de mise à niveau | Exemple         | Défaut |
| --------------------- | --------------- | ------ |
| Patch                 | v1.7.0 → v1.7.1 | O      |
| Mineure               | v1.7.0 → v1.8.0 | O      |
| Majeure               | v1.7.0 → v2.0.0 | **N**  |

Les mises à niveau majeures sont refusées par défaut (N) car les changements cassants se manifestent souvent comme une « instabilité » quand ils ne sont pas attendus. L’invite inclut une URL vers les notes de version GitHub pour que vous puissiez lire ce qui a changé avant d’accepter.

Avec `--yes`, les mises à niveau patch et mineure s’appliquent automatiquement. Les majeures restent bloquées — utilisez `--pin <code>=<nouveau-tag>` pour les accepter de manière non interactive.

### Changer le canal d’un module

**En mode interactif :** choisissez Modify → répondez **Oui** à « Review channel assignments? » → chaque module externe offre Conserver, Basculer vers stable, Basculer vers next, ou Épingler à un tag.

**En ligne de commande :** les recettes dans la section suivante couvrent les cas courants.

## Installations CI non interactives

### Référence des options

| Option                                                                                     | Objectif                                                                                                                                                                    |
|--------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--yes`, `-y`                                                                              | Ignorer toutes les invites ; accepter les valeurs des options + les défauts                                                                                                 |
| `--directory <chemin>`                                                                     | Installer dans ce répertoire (défaut : répertoire de travail courant)                                                                                                       |
| `--modules <a,b,c>`                                                                        | Ensemble exact de modules. Core est ajouté automatiquement. Ce n’est pas un delta — listez tout ce que vous voulez conserver.                                               |
| `--tools <a,b>`                                                                            | Sélection d’IDE/outil. Requis pour les nouvelles installations `--yes`. Exécutez `--list-tools` pour les IDs valides.                                                       |
| `--list-tools`                                                                             | Afficher tous les IDs d’outils/IDE supportés (avec les répertoires cibles) et quitter.                                                                                      |
| `--action <type>`                                                                          | `install`, `update` ou `quick-update`. La valeur par défaut dépend de l’état de l’installation.                                                                             |
| `--custom-source <urls>`                                                                   | Installer des modules personnalisés depuis des URLs Git ou des chemins locaux                                                                                               |
| `--channel <stable\|next>`                                                                 | Appliquer à tous les externes (alias `--all-stable` / `--all-next`)                                                                                                         |
| `--all-stable`                                                                             | Alias pour `--channel=stable`                                                                                                                                               |
| `--all-next`                                                                               | Alias pour `--channel=next`                                                                                                                                                 |
| `--next=<code>`                                                                            | Mettre un module sur next. Répétable.                                                                                                                                       |
| `--pin <code>=<tag>`                                                                       | Épingler un module à un tag spécifique. Répétable.                                                                                                                          |
| `--set <module>.<clé>=<valeur>`                                                            | Définir toute option de config de module de manière non interactive (recommandé — voir [Substitutions de config de module](#substitutions-de-config-de-module)). Répétable. |
| `--list-options [module]`                                                                  | Afficher chaque clé `--set` pour les modules intégrés et officiels en cache local, puis quitter. Passez un code de module pour limiter à un seul module.                    |
| `--user-name`, `--communication-language`, `--document-output-language`, `--output-folder` | Raccourcis historiques équivalents à `--set core.<clé>=<valeur>` (toujours supportés)                                                                                       |

Priorité en cas de chevauchement des options : `--pin` bat `--next=` bat `--channel` / `--all-*` bat le défaut du registre (`stable`).

:::note[Exemple de résolution]
`--all-next --pin cis=v0.2.0` met bmb, gds et tea sur next tout en épinglant cis à v0.2.0.
:::

### Recettes

**Installation par défaut — dernière version stable pour tout :**

```bash
npx bmad-method install --yes --modules bmm,bmb,cis --tools claude-code
```

**Installation entreprise verrouillée — reproductible à l’octet près :**

```bash
npx bmad-method install --yes \
  --modules bmm,bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.2.0 \
  --tools claude-code
```

**Bleeding edge — externes sur le HEAD de main :**

```bash
npx bmad-method install --yes --modules bmm,bmb --all-next --tools claude-code
```

**Ajouter un module à une installation existante** (conserver tout le reste) :

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,gds
```

`--tools` est omis intentionnellement — `--action update` réutilise les outils configurés lors de la première installation.

**Mixer les canaux — bmb sur next, gds sur stable :**

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,cis,gds \
  --next=bmb
```

### Substitutions de config de module

`--set <module>.<clé>=<valeur>` vous permet de définir toute option de config de module de manière non interactive. Cette option est répétable et s’adapte à chaque module — présent et futur. L’option est appliquée comme un correctif post-installation : l’installateur exécute d’abord son flux normal, puis `--set` insère ou met à jour chaque valeur dans `_bmad/config.toml` (portée équipe) ou `_bmad/config.user.toml` (portée utilisateur), et dans `_bmad/<module>/config.yaml` pour que les valeurs déclarées soient conservées à la prochaine installation.

**Exemple — installer bmm avec des connaissances projet et un niveau de compétence explicites :**

```bash
npx bmad-method install --yes \
  --modules bmm \
  --tools claude-code \
  --set bmm.project_knowledge=research \
  --set bmm.user_skill_level=expert
```

**Découvrir les clés disponibles pour un module :**

```bash
npx bmad-method install --list-options bmm
```

`--list-options` (sans argument) liste chaque clé que l’installateur peut trouver localement — modules intégrés (`core`, `bmm`) plus tous les modules officiels actuellement en cache. Le cache est par machine et peut être vidé, donc les modules officiels précédemment installés n’apparaîtront pas sur un nouveau checkout ou un worker CI éphémère tant qu’ils ne sont pas réinstallés. Les modules communautaires et personnalisés ne sont pas énumérés ici ; lisez directement le `module.yaml` du module pour voir les clés qu’il déclare.

**Comment ça fonctionne :**

- **Routage.** L’étape de correctif cherche `[modules.<module>] <clé>` (ou `[core] <clé>`) dans `config.user.toml` en premier ; si elle y est trouvée, elle met à jour ce fichier. Sinon elle écrit dans le `config.toml` de portée équipe. Ainsi, les clés de portée utilisateur (ex. `core.user_name`, `bmm.user_skill_level`) finissent dans `config.user.toml` et les clés de portée équipe dans `config.toml`, correspondant à la partition utilisée par l’installateur.
- **Valeurs littérales.** La valeur est écrite exactement comme vous l’avez fournie — aucun rendu de template `result:`. Pour obtenir la valeur résolue (ex. `{project-root}/research`), passez-la explicitement : `--set bmm.project_knowledge='{project-root}/research'`.
- **Persistance, clés déclarées.** Les valeurs pour les clés déclarées dans `module.yaml` sont conservées entre les installations car elles sont aussi écrites dans `_bmad/<module>/config.yaml`, que l’installateur lit comme valeur par défaut de l’invite lors de la prochaine exécution.
- **Persistance, clés non déclarées.** Une valeur pour une clé que le schéma du module ne déclare pas est enregistrée dans `config.toml` pour l’installation courante mais ne sera pas réécrite à la prochaine installation (le partitionneur strict au schéma du manifeste ignore les clés inconnues). Repassez `--set` pour qu’elle soit persistante, ou éditez `_bmad/config.toml` directement.
- **Pas de validation.** Les valeurs `single-select` ne sont pas vérifiées contre les choix autorisés, et les clés inconnues ne sont pas rejetées — la valeur fournie est écrite telle quelle.
- **Modules non présents dans `--modules`.** Définir une valeur pour un module que vous n’avez pas inclus affiche un avertissement et la valeur est ignorée (aucun fichier n’est créé pour un module non installé).

Les raccourcis historiques de core (`--user-name`, `--output-folder`, etc.) fonctionnent toujours et restent documentés pour la rétrocompatibilité, mais `--set core.user_name=...` est équivalent.

:::note[Fonctionne avec quick-update]
`--set` est un correctif post-installation, il s’applique donc de la même manière quel que soit le type d’action. Avec `bmad install --action quick-update` (ou `--yes` sur une installation existante, où quick-update est le défaut), `--set` met à jour les fichiers de configuration centraux à la fin comme une installation normale.
:::

:::caution[Limitation de débit sur les IPs partagées]
Les appels anonymes à l’API GitHub sont limités à 60/heure par IP. Une seule installation fait un appel API par module externe pour résoudre le tag stable. Les bureaux derrière NAT, les pools de runners CI et les VPN peuvent collectivement épuiser cette limite.

Définissez `GITHUB_TOKEN=<personal access token>` dans l’environnement pour augmenter la limite à 5 000/heure par compte. Tout PAT avec accès en lecture aux dépôts publics fonctionne ; aucune portée spécifique n’est requise.
:::

## Ce qui a été installé

Après toute installation, `_bmad/_config/manifest.yaml` enregistre exactement ce qui est sur le disque :

```yaml
modules:
  - name: bmb
    version: v1.7.0 # le tag, ou "main" pour next
    channel: stable # stable | next | pinned
    sha: 86033fc9aeae2ca6d52c7cdb675c1f4bf17fc1c1
    source: external
    repoUrl: https://github.com/bmad-code-org/bmad-builder
```

Le champ `sha` est écrit pour les modules basés sur git (externes, communautaires et personnalisés par URL). Les modules intégrés (core, bmm) et les modules personnalisés par chemin local n’en ont pas — leur code voyage avec le binaire de l’installateur ou votre système de fichiers, pas un ref clonable.

Pour la reproductibilité inter-machines, ne comptez pas sur la réexécution de la même commande `--modules`. Les installations sur canal stable résolvent vers le plus haut tag publié **au moment de l’installation**, donc une réexécution ultérieure obtiendra les versions publiées entre-temps. Convertissez les tags enregistrés de `manifest.yaml` en options `--pin` explicites sur la machine cible, par ex. :

```bash
npx bmad-method install --yes --modules bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.4.2 --tools claude-code
```

## Résolution de problèmes

### « Could not resolve stable tag » ou « API rate limit exceeded »

Vous avez atteint la limite anonyme de 60/heure de GitHub. Définissez `GITHUB_TOKEN` et réessayez. Si vous avez déjà un token défini, il peut être expiré ou limité sur son propre budget — essayez un token différent ou attendez la réinitialisation horaire.

### « Tag ’vX.Y.Z' not found »

Le tag que vous avez passé à `--pin` n’existe pas dans le dépôt du module. Consultez la page des releases du dépôt sur GitHub pour les tags valides.

### Une installation épinglée continue de se mettre à niveau

Les installations épinglées ne se mettent pas à niveau. Quick-update applique les correctifs et les mises à niveau mineures uniquement sur le canal stable ; il ne touche pas `pinned` ou `next`. Si une installation épinglée a changé, ouvrez `_bmad/_config/manifest.yaml` — `channel: pinned` plus un `version` et `sha` fixes doivent rester stables d’une exécution à l’autre, sauf écrasement explicite via les options.

### `--pin bmm=X` n’a rien fait

bmm est un module intégré — `--pin` et `--next=` ne s’appliquent pas. Utilisez `npx bmad-method@next install` pour un core/bmm en préversion, ou clonez le dépôt bmad-bmm et exécutez l’installateur localement pour obtenir les modifications non publiées.
