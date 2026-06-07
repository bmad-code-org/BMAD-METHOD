---
title: 'Comment étendre BMad pour votre organisation'
description: Six patterns de personnalisation qui remodèlent BMad sans créer de fork — règles applicables aux agents, conventions de workflow, publication externe, remplacements de templates, modifications du registre des agents et patterns d’intégration avancés
sidebar:
  order: 11
---

Le système de personnalisation de BMad permet à une organisation d’adapter les comportements sans modifier les fichiers installés ni forker les skills. Ce guide présente six recettes qui couvrent la plupart des besoins en entreprise.

:::note[Prérequis]

- BMad installé dans votre projet (voir [Comment installer BMad](./install-bmad.md))
- Connaissance du modèle de personnalisation (voir [Comment personnaliser BMad](./customize-bmad.md))
- Python 3.11+ sur le PATH (pour le résolveur — bibliothèque standard uniquement, pas de `pip install`)
:::

:::tip[Appliquer ces recettes]
Les **recettes par skill** ci-dessous (Recettes 1–4) peuvent être appliquées en exécutant le skill `bmad-customize` et en décrivant l’intention — il sélectionnera le bon point de personnalisation, générera le fichier d’override et vérifiera la fusion. La Recette 5 (overrides de la configuration centrale du registre des agents) n’est pas couverte par la v1 du skill et reste rédigée manuellement. Les recettes ici constituent la source de vérité sur *quoi* personnaliser ; `bmad-customize` gère le *comment* pour la surface agent/workflow.
:::

## Le modèle mental à trois couches

Avant de choisir une recette, comprenez où votre override se situe :

| Couche                                       | Où vivent les overrides                                               | Périmètre                                                                                                                                       |
|----------------------------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| **Agent** (ex. Amelia, Mary, John)           | Section `[agent]` de `_bmad/custom/bmad-agent-{role}.toml`            | Se propage avec le persona dans **chaque workflow que l’agent dispatche**                                                                       |
| **Workflow** (ex. product-brief, create-prd) | Section `[workflow]` de `_bmad/custom/{workflow-name}.toml`           | S’applique uniquement à l’exécution de ce workflow                                                                                              |
| **Configuration centrale**                   | `[agents.*]`, `[core]`, `[modules.*]` dans `_bmad/custom/config.toml` | Registre des agents (qui est disponible pour party-mode, retrospective, elicitation), paramètres d’installation figés pour toute l’organisation |

En règle générale : si la règle doit s’appliquer partout où un ingénieur travaille sur le développement, personnalisez l'**agent dev**. Si elle s’applique uniquement quand quelqu’un rédige un product brief, personnalisez le **workflow product-brief**. Si elle change *qui participe* (renommer un agent, ajouter une voix personnalisée, imposer un chemin d’artefact partagé), modifiez la **configuration centrale**.

## Recette 1 : Façonner un agent à travers tous les workflows qu’il dispatche

**Cas d’usage :** Standardiser l’utilisation des outils et les intégrations avec les systèmes externes pour que chaque workflow dispatché par un agent hérite du comportement. C’est le pattern le plus impactant.

**Exemple : Amelia (agent dev) utilise toujours Context7 pour la documentation des bibliothèques, et se rabat sur Linear quand une story n’est pas trouvée dans la liste des epics.**

```toml
# _bmad/custom/bmad-agent-dev.toml

[agent]

# Appliqué à chaque activation. Se propage dans dev-story, quick-dev,
# create-story, code-review, qa-generate — chaque skill qu'Amelia dispatche.
persistent_facts = [
  "Pour toute recherche de documentation sur une bibliothèque (React, TypeScript, Zod, Prisma, etc.), appeler l'outil MCP context7 (`mcp__context7__resolve_library_id` puis `mcp__context7__get_library_docs`) avant de s'appuyer sur les connaissances des données d'entraînement. Les docs à jour priment sur les API mémorisées.",
  "Quand une référence de story n'est pas trouvée dans {planning_artifacts}/epics-and-stories.md, chercher dans Linear via `mcp__linear__search_issues` en utilisant l'ID ou le titre de la story avant de demander à l'utilisateur de clarifier. Si Linear renvoie un résultat, le considérer comme la source de référence pour la story.",
]
```

**Pourquoi ça marche :** Deux phrases suffisent à reconfigurer tous les workflows de dev de l’organisation, sans duplication par workflow ni modification du code source. Chaque nouvel ingénieur qui clone le dépôt hérite automatiquement des conventions.

**Fichier d’équipe vs fichier personnel :**
- `bmad-agent-dev.toml` : versionné dans git ; s’applique à toute l’équipe
- `bmad-agent-dev.user.toml` : ignoré par git ; préférences personnelles ajoutées par-dessus

## Recette 2 : Imposer les conventions de l’organisation dans un workflow spécifique

**Cas d’usage :** Façonner le *contenu* de la sortie d’un workflow pour qu’il réponde aux exigences de conformité, d’audit ou des consommateurs en aval.

**Exemple : chaque product brief doit inclure des champs de conformité, et l’agent connaît les conventions de publication de l’organisation.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

persistent_facts = [
  "Chaque brief doit inclure un champ 'Propriétaire', un champ 'Release cible' et un champ 'Statut de la revue de sécurité'.",
  "Les briefs non commerciaux (outils internes, projets de recherche) doivent toujours inclure une section 'valeur utilisateur', mais peuvent omettre la différenciation concurrentielle.",
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",
]
```

**Ce qui se passe :** Les faits sont chargés durant l’étape 3 de l’activation du workflow. Quand l’agent rédige le brief, il connaît les champs requis et le document de conventions enterprise. La valeur par défaut livrée (`file:{project-root}/**/project-context.md`) se charge toujours, car il s’agit d’un ajout.

## Recette 3 : Publier les livrables finis vers des systèmes externes

**Cas d’usage :** Une fois le livrable produit, le publier automatiquement vers les systèmes de référence de l’entreprise (Confluence, Notion, SharePoint) et créer des tickets de suivi (Jira, Linear, Asana).

**Exemple : les briefs sont automatiquement publiés vers Confluence et proposent la création facultative d’un epic Jira.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

# Hook terminal. L'override scalaire remplace intégralement la valeur par défaut vide.
on_complete = """
Publier et proposer le suivi :

1. Lire le chemin du fichier brief finalisé depuis l'étape précédente.
2. Appeler `mcp__atlassian__confluence_create_page` avec :
   - space : "PRODUCT"
   - parent : "Product Briefs"
   - title : le titre du brief
   - body : le contenu markdown du brief
   Capturer l'URL de la page renvoyée.
3. Informer l'utilisateur : "Brief publié sur Confluence : <url>".
4. Demander : "Voulez-vous que j'ouvre un epic Jira pour ce brief maintenant ?"
5. Si oui, appeler `mcp__atlassian__jira_create_issue` avec :
   - type : "Epic"
   - project : "PROD"
   - summary : le titre du brief
   - description : un résumé court accompagné d'un lien vers la page Confluence.
   Signaler la clé et l'URL de l'epic.
6. Si non, se terminer proprement.

Si l'un des outils MCP échoue, signaler l'échec, afficher le chemin du brief,
et demander à l'utilisateur de publier manuellement.
"""
```

**Pourquoi `on_complete` et pas `activation_steps_append` :** `on_complete` s’exécute exactement une fois, au stade terminal, après que le workflow a écrit sa sortie principale. C’est le bon moment pour publier des artefacts. `activation_steps_append` s’exécute à chaque activation, avant que le workflow ne fasse son travail.

**Arbitrages :**
- **La publication Confluence est non-destructive** et s’exécute toujours à la fin
- **La création d’epic Jira est visible par toute l’équipe** et déclenche un processus de planification de sprint, conditionnez-la donc à la confirmation de l’utilisateur
- **Dégradation gracieuse :** si les outils MCP échouent, passer la main à l’utilisateur plutôt que de silencieusement abandonner le livrable

## Recette 4 : Remplacer le template de sortie par le vôtre

**Cas d’usage :** La structure de sortie par défaut ne correspond pas au format attendu par votre organisation, ou différentes organisations dans le même dépôt ont besoin de templates différents.

**Exemple : pointer le workflow product-brief vers un template appartenant à l’entreprise.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

**Comment ça marche :** Le `customize.toml` du workflow est fourni avec `brief_template = "resources/brief-template.md"` (chemin relatif, résolu depuis la racine du skill). Votre override pointe vers un fichier sous `{project-root}`, donc l’agent lit votre template à l’étape 4 au lieu de celui livré par défaut.

**Conseils pour la rédaction de templates :**
- Gardez les templates dans `{project-root}/docs/` ou `{project-root}/_bmad/custom/templates/` pour qu’ils soient versionnés avec le fichier d’override
- Utilisez les mêmes conventions structurelles que le template livré (titres de sections, frontmatter) ; l’agent s’adapte à ce qu’il trouve
- Pour les dépôts multi-organisations, utilisez `.user.toml` pour permettre à chaque équipe de pointer vers ses propres templates sans toucher au fichier d’équipe versionné dans git

## Recette 5 : Personnaliser le registre des agents

**Cas d’usage :** Changer *qui sera présent dans la pièce* pour les skills basés sur le registre comme `bmad-party-mode`, `bmad-retrospective` et `bmad-advanced-elicitation`, sans modifier le code source ni forker. Voici trois variantes courantes.

### 5a. Renommer un agent BMad pour toute l’organisation

Chaque agent réel possède un descripteur que l’installateur synthétise à partir de `module.yaml`. Surchargez-le pour changer la voix et le cadrage pour tous les consommateurs du registre :

```toml
# _bmad/custom/config.toml (versionné dans git — s'applique à tous les développeurs)

[agents.bmad-agent-analyst]
description = "Mary l'Analyste d'Affaires sensible à la réglementation — s'inspire de Porter et Minto, mais vit et respire les pistes d'audit FDA. Parle comme un expert en criminalistique présentant un dossier."
```

Party-mode génère Mary avec la nouvelle description. L’activation de l’analyste elle-même fonctionne toujours normalement car le comportement de Mary se trouve dans son `customize.toml` par skill. Cet override change la façon dont **les skills externes la perçoivent et la présentent**, pas la façon dont elle travaille en interne.

### 5b. Ajouter un agent fictif ou personnalisé

Un descripteur complet suffit pour les fonctionnalités basées sur le registre, sans dossier de skill nécessaire. Utile pour varier les personnalités en mode party ou en session de brainstorming :

```toml
# _bmad/custom/config.user.toml (personnel — ignoré par git)

[agents.spock]
team = "startrek"
name = "Commander Spock"
title = "Science Officer"
icon = "🖖"
description = "Logique d'abord, émotion réprimée. Commence ses observations par 'Fascinant.' Ne force jamais le trait. Fait contrepoids à tout argument reposant sur l'intuition."

[agents.mccoy]
team = "startrek"
name = "Dr. Leonard McCoy"
title = "Chief Medical Officer"
icon = "⚕️"
description = "Chaleur du médecin de campagne, caractère explosif. 'Bon sang Jim, je suis un docteur pas un ___.' Contrepoids éthique à Spock."
```

Demandez à party-mode d'« inviter l’équipage de l’Enterprise ». Il filtre par `team = "startrek"` et génère Spock et McCoy avec ces descripteurs. Les agents BMad réels (Mary, Amelia) peuvent se retrouver à la même table si vous les invitez.

### 5c. Figer les paramètres d’installation de l’équipe

L’installateur demande à chaque développeur des valeurs comme le chemin `planning_artifacts`. Quand l’organisation a besoin d’une réponse partagée, figez-la dans la configuration centrale — la réponse locale de chaque développeur est surchargée au moment de la résolution :

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "{project-root}/shared/planning"
implementation_artifacts = "{project-root}/shared/implementation"

[core]
document_output_language = "English"
```

Les paramètres personnels comme `user_name`, `communication_language` ou `user_skill_level` restent dans leur propre fichier `_bmad/config.user.toml` de chaque développeur. Le fichier d’équipe ne doit pas les modifier.

**Pourquoi la configuration centrale vs le customize.toml par agent :** Les fichiers par agent façonnent la façon dont *un seul* agent se comporte quand il s’active. La configuration centrale façonne ce que les consommateurs du registre *voient* : quels agents existent, comment ils s’appellent, à quelle équipe ils appartiennent, et les paramètres d’installation partagés sur lesquels tout le dépôt s’accorde. Deux surfaces, des rôles différents.

## Renforcer les règles globales dans le fichier de session de votre IDE

Les personnalisations BMad se chargent quand un skill est activé. Beaucoup d’outils IDE chargent aussi un fichier d’instructions global au **début de chaque session**, avant tout skill (`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, etc.). Pour les règles qui doivent s’appliquer même en dehors des skills BMad, reproduisez-y les plus critiques.

**Quand les utiliser ensemble :**
- Une règle est suffisamment importante pour qu’une conversation simple (sans skill actif) doive la respecter
- Vous voulez une double sécurisation parce que les défauts des données d’entraînement pourraient autrement détourner le modèle
- La règle est assez concise pour être répétée sans alourdir le fichier de session

**Exemple : une ligne dans le `CLAUDE.md` du dépôt renforçant la règle de l’agent dev de la Recette 1.**

```markdown
<!-- Toute lecture de documentation de bibliothèque passe par l'outil MCP context7
(`mcp__context7__resolve_library_id` puis `mcp__context7__get_library_docs`)
avant de s'appuyer sur les connaissances des données d'entraînement. -->
```

Une phrase, chargée à chaque session. Elle s’associe à la personnalisation `bmad-agent-dev.toml` pour que la règle s’applique à la fois dans les workflows d’Amelia et lors des chats ad hoc avec l’assistant. Chaque couche possède son propre périmètre :

| Couche                                             | Périmètre                                                | Utilisée pour                                                           |
|----------------------------------------------------|----------------------------------------------------------|-------------------------------------------------------------------------|
| Fichier de session IDE (`CLAUDE.md` / `AGENTS.md`) | Chaque session, avant toute activation de skill          | Règles courtes et universelles qui doivent survivre hors de BMad        |
| Personnalisation d’agent BMad                      | Chaque workflow que l’agent dispatche                    | Comportement spécifique au persona de l’agent                           |
| Personnalisation de workflow BMad                  | Une exécution de workflow                                | Forme de sortie spécifique au workflow, hooks de publication, templates |
| Configuration centrale BMad                        | Registre des agents + paramètres d’installation partagés | Qui est dans la pièce et quels chemins partagés l’équipe utilise        |

Gardez le fichier IDE **concis**. Une douzaine de lignes bien choisies sont plus efficaces qu’une liste étendue. Les modèles le lisent à chaque tour, et le superflu noie l’information utile.

## Recette 6 : Patterns d’intégration avancés

Plusieurs workflows BMad exposent une surface de configuration plus riche au-delà des bases couvertes dans les Recettes 1–5. Ces patterns — sources de connaissance à la demande, publication automatique des livrables, standards de documentation à la finalisation et templates interchangeables — apparaissent dans plusieurs workflows. Consultez le `customize.toml` d’un workflow pour voir quels champs il expose ; les exemples ci-dessous utilisent `bmad-prd` car il les expose tous, mais les mêmes patterns s’appliquent partout où le champ apparaît.

### Sources de connaissance à la demande (`external_sources`)

Connectez le workflow à des bases de connaissances internes, des bases de données concurrentielles ou des référentiels de conformité. L’agent les consulte à la demande quand la conversation révèle un besoin correspondant — jamais par anticipation.

```toml
# _bmad/custom/bmad-prd.toml  (même pattern pour tout workflow exposant external_sources)

[workflow]
external_sources = [
  "Quand l'utilisateur mentionne un concurrent ou un segment de marché, interroger corp:competitive_db (category={project_name}) avant de rédiger la section différenciation.",
  "Pour les domaines réglementés (santé, fintech, éducation), consulter corp:compliance_reference avant de rédiger les sections spécifiques au domaine.",
]
```

Chaque entrée est une directive en langage naturel nommant l’outil MCP, la condition de déclenchement et les champs nécessaires. Si l’outil n’est pas disponible à l’exécution, le workflow se rabat sur le comportement standard et signale l’écart.

### Publication automatique des livrables (`external_handoffs`)

Acheminez les artefacts terminés vers les systèmes de référence externes après la finalisation du workflow. Contrairement à `on_complete` (Recette 3), `external_handoffs` est un tableau d’ajout dédié — les entrées d’équipe s’accumulent et chaque handoff se déclenche indépendamment avec dégradation progressive si un outil est indisponible.

```toml
# _bmad/custom/bmad-prd.toml  (même pattern pour tout workflow exposant external_handoffs)

[workflow]
external_handoffs = [
  "Après la finalisation, uploader prd.md et addendum.md vers Confluence via corp:confluence_upload (space_key='PROD', parent_page='PRDs', label='prd', author={user_name}). Capturer et afficher l'URL de la page renvoyée.",
  "Répliquer vers Notion via notion:create_page (database_id='abc123', title='PRD: ' + {project_name}).",
]
```

Si un outil nommé est indisponible, le handoff est ignoré et signalé — les fichiers locaux existent toujours indépendamment.

### Standards de documentation à la finalisation (`doc_standards`)

Appliquez les standards rédactionnels de l’organisation aux documents à destination des utilisateurs à la finalisation, après que le contenu est complet mais avant que l’utilisateur ne voie le livrable. Chaque entrée est une directive `skill:`, `file:` ou en texte brut ; les passes s’exécutent comme des sous-agents parallèles.

```toml
# _bmad/custom/bmad-prd.toml  (même pattern pour tout workflow exposant doc_standards)

[workflow]
doc_standards = [
  "file:{project-root}/docs/enterprise/voice-and-tone.md",
  "Toutes les dates doivent utiliser le format ISO 8601 (AAAA-MM-JJ).",
  "Remplacer toute utilisation de 'tirer parti de' par 'utiliser'.",
]
```

`doc_standards` est un tableau d’ajout — les entrées d’équipe s’ajoutent aux valeurs par défaut livrées par le workflow. Les passes structurelles larges doivent venir avant les passes rédactionnelles plus ciblées.

### Templates et checklists interchangeables

Les workflows qui produisent des documents structurés exposent généralement des chemins de templates et de checklists comme scalaires surchargeables. Pointez-les vers des fichiers appartenant à l’organisation sous `{project-root}` pour imposer une structure différente sans modifier le code source.

```toml
# _bmad/custom/bmad-prd.toml

[workflow]
# Structure de PRD pour secteur réglementé
prd_template = "{project-root}/docs/enterprise/prd-template-hipaa.md"

# Critères de validation spécifiques à l'organisation
validation_checklist = "{project-root}/docs/enterprise/prd-checklist-regulated.md"
```

L’agent s’adapte à la structure définie par le template. Gardez les templates sous `{project-root}/docs/` ou `{project-root}/_bmad/custom/templates/` pour qu’ils soient versionnés avec le fichier d’override. Pour les dépôts multi-organisations, utilisez `.user.toml` pour permettre aux équipes de pointer vers leurs propres templates sans toucher au fichier d’équipe versionné dans git.

## Combiner les recettes

Les six recettes se combinent librement. Un override entreprise réaliste pour `bmad-product-brief` pourrait définir `persistent_facts` (Recette 2), `on_complete` (Recette 3) et `brief_template` (Recette 4) dans un seul fichier. La règle au niveau agent (Recette 1) se trouve dans un fichier séparé sous le nom de l’agent, la configuration centrale (Recette 5) fige le registre partagé et les paramètres d’équipe, les patterns d’intégration avancés (Recette 6) configurent les sources externes et les handoffs, et toutes les couches s’appliquent en parallèle.

```toml
# _bmad/custom/bmad-product-brief.toml (niveau workflow)

[workflow]
persistent_facts = ["..."]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
on_complete = """ ... """
```

```toml
# _bmad/custom/bmad-agent-analyst.toml (niveau agent — Mary dispatche product-brief)

[agent]
persistent_facts = ["Toujours inclure une section 'Revue réglementaire' quand le domaine implique la santé, la finance ou les données d'enfants."]
```

Résultat : Mary charge la règle de revue réglementaire à l’activation de son persona. Quand l’utilisateur choisit le product brief dans le menu, le workflow charge ses propres conventions par-dessus, écrit avec le template enterprise et publie vers Confluence à la fin. Chaque couche contribue, et aucune n’a nécessité de modifier le code source de BMad.

## Dépannage

**L’override ne prend pas effet ?** Vérifiez que le fichier se trouve sous `_bmad/custom/` avec le nom exact du répertoire du skill (ex. `bmad-agent-dev.toml`, pas `bmad-dev.toml`). Voir [Comment personnaliser BMad](./customize-bmad.md#dépannage).

**Nom d’outil MCP inconnu ?** Utilisez le nom exact que le serveur MCP expose dans la session en cours. Demandez à Claude Code de lister les outils MCP disponibles en cas de doute. Les noms codés en dur dans `persistent_facts` ou `on_complete` ne fonctionneront pas si le serveur MCP n’est pas connecté.

**Le pattern ne s’applique pas à ma configuration ?** Les recettes ci-dessus sont illustratives. L’infrastructure sous-jacente (fusion à trois couches, règles structurelles, agent traversant les workflows) supporte de nombreux patterns supplémentaires ; composez-les selon vos besoins.
