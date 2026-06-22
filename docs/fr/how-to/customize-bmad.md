---
title: "Comment personnaliser BMad"
description: Personnalisez les agents et les workflows tout en préservant la compatibilité avec les mises à jour
sidebar:
  order: 8
---

Adaptez les personas d’agents, injectez du contexte métier, ajoutez des capacités et configurez le comportement des workflows — le tout sans modifier les fichiers installés. Vos personnalisations sont préservées à chaque mise à jour.

:::tip[Vous ne voulez pas rédiger du TOML à la main ? Utilisez `bmad-customize`]
Le skill `bmad-customize` est un assistant de rédaction guidée pour les **options de personnalisation par skill (agent/workflow)** décrite dans ce document. Il scanne ce qui est personnalisable dans votre installation, vous aide à choisir la bonne surface (agent ou workflow) pour votre intention, écrit le fichier d’override pour vous et vérifie que la fusion a fonctionné. Les overrides de la configuration centrale (`_bmad/custom/config.toml`) ne sont pas couverts par la v1 du skill — rédigez-les manuellement en vous référant à la section Configuration centrale ci-dessous. Exécutez le skill chaque fois que vous souhaitez modifier un skill spécifique ; ce document est la référence sur *ce que* chaque surface expose et comment fonctionne la fusion.
:::

## Quand utiliser cette fonctionnalité

- Vous souhaitez changer la personnalité ou le style de communication d’un agent
- Vous devez fournir à un agent des faits persistants qu’il devra retenir (ex. « notre org est 100 % AWS »)
- Vous souhaitez ajouter des étapes procédurales de démarrage que l’agent doit exécuter à chaque session
- Vous souhaitez ajouter des éléments de menu personnalisés qui déclenchent vos propres skills ou prompts
- Votre équipe a besoin de personnalisations partagées versionnées dans git, avec des préférences personnelles ajoutées par-dessus

:::note[Prérequis]

- BMad installé dans votre projet (voir [Comment installer BMad](./install-bmad.md))
- Un moyen d’exécuter le script de résolution — BMad adopte `uv` comme standard (`uv run`, qui provisionne Python pour vous) ; un simple `python3` 3.11+ sur votre PATH fonctionne toujours pendant la transition. Le script n’utilise que `tomllib` de la bibliothèque standard, il n’y a donc rien à `pip install`.
- Un éditeur de texte pour les fichiers TOML
:::

## Comment ça marche

Chaque skill personnalisable embarque un fichier `customize.toml` avec ses valeurs par défaut. Ce fichier définit la surface de personnalisation complète du skill — lisez-le pour voir ce qui est personnalisable. Ne modifiez jamais ce fichier. À la place, créez des fichiers d’override allégés contenant uniquement les champs que vous souhaitez changer.

### Modèle d’override à trois couches

```text
Priorité 1 (gagne) : _bmad/custom/{skill-name}.user.toml  (personnel, ignoré par git)
Priorité 2         : _bmad/custom/{skill-name}.toml       (équipe/org, versionné dans git)
Priorité 3 (base)  : customize.toml du skill              (valeurs par défaut)
```

Le dossier `_bmad/custom/` est initialement vide. Les fichiers n’apparaissent que lorsqu’un utilisateur commence à personnaliser.

### Règles de fusion (par forme, pas par nom de champ)

Le résolveur applique quatre règles structurelles. Les noms de champ n’ont pas de traitement particulier — le comportement est déterminé uniquement par la forme de la valeur :

| Forme                                                                                                                         | Règle                                                                                                          |
|-------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Scalaire (chaîne, entier, booléen, flottant)                                                                                  | L’override prévaut                                                                                             |
| Table                                                                                                                         | Fusion profonde (application récursive des mêmes règles)                                                       |
| Tableau de tables où chaque élément partage le **même** champ identifiant (chaque élément a `code`, ou chaque élément a `id`) | Fusionner par cette clé — les clés correspondantes **remplacent sur place**, les nouvelles clés **s’ajoutent** |
| Tout autre tableau (scalaires ; tables sans identifiant ; tableaux qui mélangent `code` et `id` entre les éléments)           | **Ajouter** — éléments de base en premier, puis éléments d’équipe, puis éléments utilisateur                   |

**Pas de mécanisme de suppression.** Les overrides ne peuvent pas effacer les éléments de base. Si vous devez supprimer un élément de menu par défaut, surchargez-le via son `code` avec une description ou un prompt sans effet. Si vous devez restructurer un tableau plus en profondeur, forkez le skill.

**La convention `code` / `id`.** BMad utilise `code` (code court comme `"BP"` ou `"R1"`) et `id` (identifiant stable plus long) comme clés de fusion dans les tableaux de tables. Si vous rédigez un tableau de tables personnalisé destiné à être fusionné par clé plutôt que par simple ajout, choisissez **une** convention (soit `code` sur chaque élément, soit `id` sur chaque élément) et respectez-la dans tout le tableau. Mélanger `code` sur certains éléments et `id` sur d’autres revient à un simple ajout — le résolveur ne devinera pas quelle clé utiliser pour la fusion.

### Certains champs d’agent sont en lecture seule

`agent.name` et `agent.title` sont présents dans `customize.toml` comme source de vérité, mais le SKILL.md de l’agent ne les lit pas à l’exécution — leur identité est codée en dur. Mettre `name = "Bob"` dans un fichier d’override n’a aucun effet. Si vous avez vraiment besoin d’un agent avec un nom différent, copiez le dossier du skill, renommez-le et distribuez-le comme skill personnalisé.

## Étapes

### 1. Trouver la surface de personnalisation du skill

Consultez le `customize.toml` du skill dans son répertoire d’installation. Par exemple, l’agent PM :

```text
.claude/skills/bmad-agent-pm/customize.toml
```

(Le chemin varie selon l’IDE — Cursor utilise `.cursor/skills/`, Cline utilise `.cline/skills/`, etc.)

Ce fichier est le schéma canonique. Chaque champ que vous voyez est personnalisable (à l’exception des champs d’identité en lecture seule mentionnés ci-dessus).

### 2. Créer votre fichier d’override

Créez le répertoire `_bmad/custom/` à la racine de votre projet s’il n’existe pas. Puis créez un fichier portant le même nom que le skill :

```text
_bmad/custom/
  bmad-agent-pm.toml        # overrides d'équipe (versionnés dans git)
  bmad-agent-pm.user.toml   # préférences personnelles (ignoré par git)
```

:::caution[Ne copiez PAS le `customize.toml` complet]
Les fichiers d’override sont **allégés**. Incluez uniquement les champs que vous modifiez — rien d’autre. Chaque champ omis est hérité automatiquement de la couche inférieure (l’équipe hérite des valeurs par défaut, l’utilisateur de l’équipe ou des valeurs par défaut).

Copier le `customize.toml` complet dans un override est contre-productif : la prochaine mise à jour livrera de nouvelles valeurs par défaut, mais votre fichier d’override figera les anciennes valeurs. Votre configuration s’éloignera silencieusement des valeurs par défaut à chaque mise à jour.
:::

**Exemple — changer l’icône et ajouter un principe :**

```toml
# _bmad/custom/bmad-agent-pm.toml
# Uniquement les champs que je modifie. Tout le reste est hérité.

[agent]
icon = "🏥"
principles = [
  "Ne rien livrer qui ne puisse passer un audit FDA.",
]
```

Ceci ajoute le nouveau principe aux valeurs par défaut (en laissant les principes existants intacts) et remplace l’icône. Tous les autres champs restent inchangés.

### 3. Personnaliser selon vos besoins

Tous les exemples ci-dessous supposent le schéma d’agent plat de BMad. Les champs se trouvent directement sous `[agent]` — pas de sous-tables `metadata` ou `persona` imbriquées.

**Scalaires (icon, role, identity, communication_style).** Les overrides scalaires prévalent. Vous n’avez besoin de définir que les champs que vous modifiez :

```toml
# _bmad/custom/bmad-agent-pm.toml

[agent]
icon = "🏥"
role = "Pilote la découverte produit pour un domaine de santé réglementé."
communication_style = "Précis, sensible à la réglementation, pose des questions orientées conformité tôt."
```

**Faits persistants, principes, hooks d’activation (tableaux en mode ajout).** Les quatre tableaux ci-dessous sont en ajout uniquement. Les éléments d’équipe s’exécutent après les valeurs par défaut, les éléments utilisateur s’exécutent en dernier.

```toml
[agent]
# Faits statiques que l'agent garde en tête pendant toute la session — règles d'org,
# constantes de domaine, préférences utilisateur. Distinct du sidecar de mémoire runtime.
#
# Chaque entrée est soit une phrase littérale, soit une référence `file:` dont le
# contenu est chargé comme des faits (patterns glob supportés).
persistent_facts = [
  "Notre org est 100 % AWS — ne pas proposer GCP ni Azure.",
  "Tous les PRD nécessitent une validation légale avant le démarrage de l'ingénierie.",
  "Les utilisateurs cibles sont des cliniciens, pas des patients — formuler les exemples en conséquence.",
  "file:{project-root}/docs/compliance/hipaa-overview.md",
  "file:{project-root}/_bmad/custom/company-glossary.md",
]

# S'ajoute au système de valeurs de l'agent
principles = [
  "Ne rien livrer qui ne puisse passer un audit FDA.",
  "Valeur utilisateur d'abord, conformité toujours.",
]

# S'exécute AVANT l'activation standard (persona, persistent_facts, config, salutation).
# À utiliser pour les préchargements, vérifications de conformité, tout ce qui doit être
# en contexte avant que l'agent ne se présente.
activation_steps_prepend = [
  "Scanner {project-root}/docs/compliance/ et charger tout document lié à HIPAA comme contexte.",
]

# S'exécute APRÈS la salutation, AVANT le menu. Utiliser pour le chargement de contexte
# qui doit intervenir après le message d'accueil.
activation_steps_append = [
  "Lire {project-root}/_bmad/custom/company-glossary.md s'il existe.",
]
```

**Pourquoi deux hooks ?** Le préfixe s’exécute avant la salutation pour que l’agent puisse charger le contexte dont il a besoin pour personnaliser la salutation elle-même. Le suffixe s’exécute après la salutation pour que l’utilisateur ne reste pas devant un terminal vide pendant les scans lourds.

**Personnalisation du menu (fusion par `code`).** Le menu est un tableau de tables. Chaque élément possède un champ `code` (convention BMad). Le résolveur fusionne donc par code : les codes correspondants remplacent sur place, les nouveaux codes s’ajoutent.

La syntaxe TOML pour les tableaux de tables utilise `[[agent.menu]]` pour chaque élément :

```toml
# Remplacer l'élément CE existant par un skill personnalisé
[[agent.menu]]
code = "CE"
description = "Créer des Epics avec notre framework de livraison"
skill = "custom-create-epics"

# Ajouter un nouvel élément (le code RC n'existe pas dans les valeurs par défaut)
[[agent.menu]]
code = "RC"
description = "Exécuter une pré-vérification de conformité"
prompt = """
Lire {project-root}/_bmad/custom/compliance-checklist.md
et scanner tous les documents dans {planning_artifacts} en les comparant à celui-ci.
Signaler tout écart et citer la section réglementaire pertinente.
"""
```

Chaque élément de menu possède exactement un `skill` (invoque un skill enregistré) ou `prompt` (exécute le texte directement). Les éléments non listés dans votre override conservent leurs valeurs par défaut.

**Référencer des fichiers.** Quand le texte d’un champ doit pointer vers un fichier (dans `persistent_facts`, `activation_steps_prepend`/`activation_steps_append`, ou le `prompt` d’un élément de menu), utilisez un chemin complet partant de `{project-root}`. Même si le fichier se trouve à côté de votre override dans `_bmad/custom/`, écrivez le chemin complet : `{project-root}/_bmad/custom/info.md`. L’agent résout `{project-root}` à l’exécution.

### 4. Personnel vs Équipe

**Fichier d’équipe** (`bmad-agent-pm.toml`) : Versionné dans git. Partagé au sein de l’organisation. À utiliser pour les règles de conformité, le persona de l’entreprise, les capacités personnalisées.

**Fichier personnel** (`bmad-agent-pm.user.toml`) : Automatiquement ignoré par git. À utiliser pour les ajustements de ton, les préférences de workflow personnelles et les faits privés que l’agent doit garder en tête.

```toml
# _bmad/custom/bmad-agent-pm.user.toml

[agent]
persistent_facts = [
  "Toujours inclure une estimation approximative de complexité (faible/moyenne/élevée) en présentant les options.",
]
```

## Comment fonctionne la résolution

À l’activation, le SKILL.md de l’agent exécute un script Python partagé qui effectue la fusion à trois couches et renvoie le bloc résolu en JSON. Le script utilise uniquement le module `tomllib` de la bibliothèque standard Python (aucune dépendance externe). BMad adopte `uv run` comme standard pour exécuter ces scripts (uv provisionne un Python adapté pour vous) ; un simple `python3` fonctionne toujours pendant la transition :

```bash
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill {skill-root} \
  --key agent
```

**Prérequis** : Python 3.11+ (les versions antérieures n’incluent pas `tomllib`). Rien à `pip install`. L’exécution via `uv run` est le standard à venir — uv résout un interpréteur adapté pour vous. Si vous l’exécutez directement avec `python3` pendant la transition, vérifiez votre version avec `python3 --version` ; certaines plateformes (macOS sans Homebrew, Ubuntu 22.04) ont `python3` par défaut en 3.10 ou antérieur, vous devrez peut-être installer 3.11+ séparément.

`--skill` pointe vers le répertoire installé du skill (où se trouve `customize.toml`). Le nom du skill est déduit du basename du répertoire, et le script cherche automatiquement `_bmad/custom/{skill-name}.toml` et `{skill-name}.user.toml`.

Exemples d’utilisation :

```bash
# Résoudre le bloc agent complet
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /chemin/absolu/vers/bmad-agent-pm \
  --key agent

# Résoudre un seul champ
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /chemin/absolu/vers/bmad-agent-pm \
  --key agent.icon

# Dump complet
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /chemin/absolu/vers/bmad-agent-pm
```

La sortie est toujours en JSON. Si le script n’est pas disponible sur une plateforme donnée, le SKILL.md demande à l’agent de lire les trois fichiers TOML directement et d’appliquer les mêmes règles de fusion.

## Personnalisation des workflows

Les workflows (skills qui pilotent des processus multi-étapes comme `bmad-product-brief`) partagent le même mécanisme d’override que les agents. Leur surface personnalisable se trouve sous `[workflow]` au lieu de `[agent]` :

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
# Même sémantique préfixe/suffixe que les agents — s'exécute avant et après les étapes
# d'activation propres au workflow. Les overrides s'ajoutent aux valeurs par défaut.
activation_steps_prepend = [
  "Charger {project-root}/docs/product/north-star-principles.md comme contexte.",
]

activation_steps_append = []

# Même sémantique littéral ou fichier que pour la variante agent. Chargé comme contexte
# fondamental pour la durée de l'exécution du workflow.
persistent_facts = [
  "Tous les briefs doivent inclure une section explicite de risque réglementaire.",
  "file:{project-root}/docs/compliance/product-brief-checklist.md",
]

# Scalaire : s'exécute une fois que le workflow a terminé son livrable principal. L'override prévaut.
on_complete = "Résumer le brief en trois points et proposer de l'envoyer par email via le skill gws-gmail-send."
```

Les mêmes conventions de champs s’appliquent indifféremment aux agents et aux workflows : `activation_steps_prepend`/`activation_steps_append`, `persistent_facts` (avec refs `file:`) et les tables `[[…]]` de style menu avec `code`/`id` pour la fusion par clé. Le résolveur applique les mêmes quatre règles structurelles quelle que soit la clé de premier niveau. Les références dans SKILL.md suivent l’espace de noms : `{workflow.activation_steps_prepend}`, `{workflow.persistent_facts}`, `{workflow.on_complete}`. Tout champ supplémentaire qu’un workflow expose (chemins de sortie, bascules, paramètres de revue, drapeaux d’étape) suit les mêmes règles de fusion basées sur la forme. Lisez le `customize.toml` du workflow pour voir ce qui est personnalisable.

### Ordre d’activation

Les workflows personnalisables exécutent leur activation dans une séquence fixe pour que vous sachiez exactement quand vos hooks se déclenchent :

1. Résoudre le bloc `[workflow]` (fusion base → équipe → utilisateur)
2. Exécuter `activation_steps_prepend` dans l’ordre
3. Charger `persistent_facts` comme contexte fondamental pour l’exécution
4. Charger la configuration (`_bmad/bmm/config.yaml`) et résoudre les variables standard (nom du projet, langues, chemins, date)
5. Saluer l’utilisateur
6. Exécuter `activation_steps_append` dans l’ordre

Après l’étape 6, le corps du workflow commence. Utilisez `activation_steps_prepend` quand vous avez besoin de contexte chargé avant que la salutation puisse être personnalisée ; utilisez `activation_steps_append` quand le chargement est lourd et que vous préférez que l’utilisateur voie la salutation d’abord.

### Périmètre de cette première passe

La personnalisation est déployée de manière incrémentale. Les champs documentés ci-dessus — `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete` — sont la **surface de base** que chaque workflow personnalisable expose, et ils resteront stables d’une version à l’autre. Ils vous donnent un contrôle à grands traits dès aujourd’hui : injecter des étapes pré/post, épingler du contexte fondamental, déclencher des actions de suivi.

Au fil du temps, les workflows individuels exposeront des **points de personnalisation plus ciblés** adaptés à ce que le workflow fait réellement — par exemple des bascules par étape, des drapeaux d’étape, des chemins de templates de sortie ou des jalons de revue. Quand ils arriveront, ils viendront s’ajouter aux champs de base plutôt que de les remplacer, pour que les personnalisations que vous rédigez aujourd’hui continuent de fonctionner.

Si vous avez besoin d’un réglage précis qui n’est pas encore exposé, utilisez `activation_steps_*` et `persistent_facts` pour orienter le comportement, ou ouvrez une issue décrivant le point de personnalisation spécifique que vous souhaitez — ces demandes déterminent quels champs ciblés seront ajoutés ensuite.

## Configuration centrale

Le `customize.toml` par skill couvre le **comportement profond** (hooks, menus, persistent_facts, overrides de persona pour un seul agent ou workflow). Une surface séparée couvre l'**état transversal** — les réponses d’installation et le registre des agents que les skills externes comme `bmad-party-mode`, `bmad-retrospective` et `bmad-advanced-elicitation` consomment. Cette surface se trouve dans quatre fichiers TOML à la racine du projet :

```text
_bmad/config.toml               (géré par l'installateur)  périmètre équipe : réponses d'installation + registre des agents
_bmad/config.user.toml          (géré par l'installateur)  périmètre utilisateur : user_name, langue, niveau de skill
_bmad/custom/config.toml        (rédigé manuellement)      overrides d'équipe (versionnés dans git)
_bmad/custom/config.user.toml   (rédigé manuellement)      overrides personnels (ignoré par git)
```

### Fusion à quatre couches

```text
Priorité 1 (gagne) : _bmad/custom/config.user.toml
Priorité 2         : _bmad/custom/config.toml
Priorité 3         : _bmad/config.user.toml
Priorité 4 (base)  : _bmad/config.toml
```

Mêmes règles structurelles que la personnalisation par skill (scalaires prévalent, tables fusionnent en profondeur, tableaux à clé `code`/`id` fusionnent par clé, autres tableaux s’ajoutent).

### Répartition du contenu

L’installateur répartit les réponses selon le `scope:` déclaré sur chaque prompt dans `module.yaml` :

- Les sections `[core]` et `[modules.<code>]` — réponses d’installation. Le scope `team` figure dans `_bmad/config.toml` ; le scope `user` figure dans `_bmad/config.user.toml`.
- `[agents.<code>]` — descripteur de l’agent (code, name, title, icon, description, team) extrait du bloc `agents:` de chaque `module.yaml`. Toujours de scope équipe.

### Règles de modification

- `_bmad/config.toml` et `_bmad/config.user.toml` sont **régénérés à chaque installation** à partir des réponses collectées pendant le processus d’installation. Traitez-les comme des sorties en lecture seule — les modifications directes seront écrasées à la prochaine installation. Pour changer une réponse d’installation de manière durable, relancez l’installateur (il se souvient de vos réponses précédentes comme valeurs par défaut) ou surchargez la valeur dans `_bmad/custom/config.toml`.
- `_bmad/custom/config.toml` et `_bmad/custom/config.user.toml` ne sont **jamais modifiés** par l’installateur. C’est l’espace approprié pour les agents personnalisés, les overrides de descripteur d’agent, les paramètres imposés par l’équipe et toute valeur que vous souhaitez figer indépendamment des réponses d’installation.

### Exemple — Renommer un agent

```toml
# _bmad/custom/config.toml (versionné dans git, s'applique à tous les développeurs)

[agents.bmad-agent-pm]
description = "PM Santé — sensible à la réglementation, orienté parties prenantes, questions orientées FDA en premier."
icon = "🏥"
```

Le résolveur fusionne par-dessus le `[agents.bmad-agent-pm]` écrit par l’installateur. `bmad-party-mode` et tout autre utilisateur du registre récupèrent automatiquement la nouvelle description.

### Exemple — Ajouter un agent fictif

```toml
# _bmad/custom/config.user.toml (personnel, ignoré par git)

[agents.kirk]
team = "startrek"
name = "Captain James T. Kirk"
title = "Starship Captain"
icon = "🖖"
description = "Commandant audacieux, enfreignant les règles. Parle en pauses dramatiques. Pense à voix haute sur le poids du commandement."
```

Pas de dossier de skill requis — le descripteur seul suffit pour que party-mode instancie Kirk comme voix. Filtrez par le champ `team` pour inviter uniquement l’équipage de l’Enterprise à une table ronde.

### Exemple — Override des paramètres d’installation du module

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "/shared/org-planning-artifacts"
```

L’override prévaut sur ce que chaque développeur a répondu lors de son installation locale. Utile pour figer les conventions d’équipe.

### Quelle surface utiliser pour quel besoin

| Besoin                                                   | Utiliser                                                                      |
|----------------------------------------------------------|-------------------------------------------------------------------------------|
| Ajouter des appels d’outils MCP à chaque workflow de dev | Par skill : `_bmad/custom/bmad-agent-dev.toml` `persistent_facts`             |
| Ajouter un élément de menu à un agent                    | Par skill : `_bmad/custom/bmad-agent-{role}.toml` `[[agent.menu]]`            |
| Remplacer le template de sortie d’un workflow            | Par skill : `_bmad/custom/{workflow}.toml` override scalaire                  |
| Renommer le descripteur public d’un agent                | **Centrale** : `_bmad/custom/config.toml` `[agents.<code>]`                   |
| Ajouter un agent personnalisé ou fictif au registre      | **Centrale** : `_bmad/custom/config.*.toml` nouvelle entrée `[agents.<code>]` |
| Figer les paramètres d’installation pour l’équipe        | **Centrale** : `_bmad/custom/config.toml` `[modules.<code>]` ou `[core]`      |

Utilisez les deux espaces dans le même projet selon vos besoins.

## Exemples concrets

Pour des recettes orientées entreprise (façonner un agent à travers tous les workflows qu’il gère, imposer les conventions d’organisation, publier les livrables vers Confluence et Jira, personnaliser le registre des agents et remplacer vos propres templates de sortie), consultez [Comment étendre BMad pour votre organisation](./expand-bmad-for-your-org.md).

## Dépannage

**La personnalisation n’apparaît pas ?**

- Vérifiez que votre fichier se trouve dans `_bmad/custom/` avec le nom de skill correct
- Vérifiez la syntaxe TOML : les chaînes doivent être entre guillemets, les en-têtes de table utilisent `[section]`, les tableaux de tables utilisent `[[section]]`, et toute clé scalaire ou de tableau pour une table doit apparaître *avant* toute `[[sous-table]]` de cette table dans le fichier
- Pour les agents, la personnalisation se trouve sous `[agent]` — les champs écrits sous cet en-tête appartiennent à `agent` jusqu’à ce qu’un autre en-tête de table commence
- Rappelez-vous que `agent.name` et `agent.title` sont en lecture seule ; les overrides n’ont aucun effet

**Les mises à jour ont cassé votre personnalisation ?**

- Avez-vous copié le `customize.toml` complet dans votre fichier d’override ? **Ne le faites pas.** Les fichiers d’override ne doivent contenir que les champs que vous modifiez. Une copie complète fige les anciennes valeurs par défaut et dérive silencieusement à chaque version. Réduisez votre override aux seuls deltas.

**Besoin de voir ce qui est personnalisable ?**

- Exécutez le skill `bmad-customize` — il énumère chaque skill personnalisable installé dans votre projet, montre lesquels ont déjà des overrides et vous guide pour en ajouter ou en modifier.
- Ou lisez directement le `customize.toml` du skill — chaque champ listé est personnalisable (sauf `name` et `title`)

**Besoin de réinitialiser ?**

- Supprimez votre fichier d’override de `_bmad/custom/` — le skill revient à ses valeurs par défaut intégrées.
