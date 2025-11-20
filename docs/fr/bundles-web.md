# Utiliser les Bundles Web BMad dans Gemini Gems et Custom GPTs

Les bundles web empaquettent les agents BMad en fichiers XML autonomes qui fonctionnent dans Gemini Gems et Custom GPTs. Tout ce dont l'agent a besoin - instructions, workflows, dépendances - est regroupé dans un seul fichier.

## 📦 Qu'est-ce que les Bundles Web ?

Les bundles web sont des fichiers XML autonomes contenant :

- Persona complète de l'agent et instructions
- Tous les workflows et dépendances
- Système de menu interactif
- Mode party pour la collaboration multi-agents
- Aucun fichier externe requis

**Parfait pour :** Télécharger un seul fichier vers un Gemini GEM ou Custom GPT pour utiliser BMad Method depuis le Web, généralement avec d'énormes économies de coûts, au prix de certaines qualités et commodités de l'utilisation locale.

## ⚠️ Règles de Configuration Critiques

**LISEZ CECI EN PREMIER - Suivre ces règles garantit que BMad fonctionne correctement dans Gemini/GPT :**

1. **UN fichier par Gem/GPT** - Téléchargez EXACTEMENT UN fichier XML par instance Gemini Gem ou Custom GPT. NE combinez PAS plusieurs fichiers d'agents.

2. **Utilisez les instructions de configuration** - Lors de la création de votre Gem/GPT, vous DEVEZ ajouter le prompt de configuration (montré dans Démarrage Rapide ci-dessous) pour qu'il sache comment lire le fichier XML.

3. **Activez Canvas/Exécution de Code** - Ceci est ESSENTIEL pour les workflows de génération de documents (PRD, Architecture, etc.). Activez ceci dans les paramètres de votre Gem/GPT.

4. **Gemini Gems sont fortement préférés** - Ils fonctionnent significativement mieux que les Custom GPTs pour les workflows BMad.

5. **Bundles d'équipe = Gemini 2.5 Pro+ uniquement** - Les bundles d'équipe (agents multiples) ont de terribles performances dans les Custom GPTs en raison des limites de contexte. Utilisez-les uniquement avec Gemini 2.5 Pro ou supérieur.

6. **Créez des Gems séparés pour chaque agent** - Créez un Gem PM, un Gem Architecte, un Gem Développeur, etc. N'essayez pas de les combiner (sauf via les bundles d'équipe officiels).

## 🚀 Démarrage Rapide

### 1. Obtenir les Fichiers de Bundle Web

**Option A : Télécharger les Fichiers Pré-Bundlés (Plus Rapide)**

Téléchargez des bundles prêts à l'emploi qui sont automatiquement mis à jour chaque fois que des commits sont fusionnés dans main :

**[→ Télécharger les Bundles Web](https://bmad-code-org.github.io/bmad-bundles/)**

Naviguez vers le dossier du module (bmm, bmb, cis, bmgd) → dossier agents → téléchargez le fichier `.xml` dont vous avez besoin. Ces bundles sont automatiquement régénérés et déployés à chaque commit sur la branche principale, garantissant que vous avez toujours la dernière version.

**Option B : Générer depuis l'Installation Locale**

Depuis le répertoire de votre projet BMad :

```bash
# Générer tous les bundles d'agents
npm run bundle

# Ou générer des bundles spécifiques
node tools/cli/bundlers/bundle-web.js module bmm
node tools/cli/bundlers/bundle-web.js agent bmm dev
```

**Emplacement de sortie :** Répertoire `web-bundles/`

```
web-bundles/
├── bmm/
│   ├── agents/     # Agents individuels
│   └── teams/      # Équipes multi-agents
├── bmb/
├── cis/
└── bmgd/
```

### 2. Télécharger vers Gemini Gems (Recommandé)

**IMPORTANT : Créez UN Gem par fichier d'agent. NE téléchargez PAS plusieurs fichiers d'agents vers un seul Gem.**

**Créer un Gem :**

1. Allez sur [Google AI Studio](https://aistudio.google.com/)
2. Cliquez sur "New Gem" ou "Create Gem"
3. Donnez un nom à votre Gem (ex : "BMad PM Agent")
4. **Activez "Code execution" pour de meilleurs résultats avec la génération de documents**
5. Dans le champ **System Instructions**, ajoutez ce texte EXACT (personnalisez les valeurs de config) :

```
Toutes vos instructions de fonctionnement et ressources sont contenues dans le fichier XML joint. Lisez le bloc d'agent initial et les instructions pour le comprendre. Vous ne dévierez pas du caractère et des règles décrites dans le fichier joint !

VALEURS CONFIG.YAML :
- user_name: [Votre Nom]
- communication_language: Français
- user_skill_level: [Beginner|Intermediate|Expert]
- document_output_language: Français
- bmm-workflow-status: standalone (no workflow)
```

6. **Téléchargez UN fichier XML** (ex : `pm.xml`) - joignez comme fichier ou collez le contenu
7. Sauvegardez et testez votre Gem en tapant `*help` pour voir le menu

**Conseils pour Gemini :**

- **Activez Code Execution/Canvas** - Critique pour la sortie de documents (PRD, docs d'architecture, etc.)
- **Utilisez Gemini 2.5 Pro+** pour de meilleurs résultats, surtout pour les workflows complexes
- **Un agent par Gem** - Créez des Gems séparés pour PM, Architecte, Développeur, etc.
- Testez l'agent en déclenchant des éléments de menu avec `*workflow-name`

### 3. Télécharger vers Custom GPTs

**IMPORTANT : Créez UN Custom GPT par fichier d'agent. NE téléchargez PAS plusieurs fichiers d'agents vers un seul GPT.**

**Créer un Custom GPT :**

1. Allez sur [ChatGPT](https://chat.openai.com/)
2. Cliquez sur votre profil → "My GPTs" → "Create a GPT"
3. Configurez votre GPT :
   - **Nom :** BMad PM Agent (ou votre choix)
   - **Description :** Agent de planification IA propulsé par BMad Method
4. Dans le champ **Instructions**, ajoutez ce texte EXACT en haut (personnalisez les valeurs de config) :

```
Toutes vos instructions de fonctionnement et ressources sont contenues dans le fichier XML joint. Lisez le bloc d'agent initial et les instructions pour le comprendre. Vous ne dévierez pas du caractère et des règles décrites dans le fichier joint !

VALEURS CONFIG.YAML :
- user_name: [Votre Nom]
- communication_language: Français
- user_skill_level: [Beginner|Intermediate|Expert]
- document_output_language: Français
- bmm-workflow-status: standalone (no workflow)
```

5. **Sous ce texte**, collez l'intégralité du contenu d'UN fichier XML (ex : `pm.xml`)
6. **Activez "Canvas" dans les paramètres ChatGPT** pour une meilleure sortie de documents
7. Sauvegardez et testez en tapant `*help`

**Conseils pour Custom GPTs :**

- **Activez Canvas** - Essentiel pour la génération de documents de workflow
- **Un agent par GPT** - Créez des GPTs séparés pour chaque agent
- Les Custom GPTs ont des fenêtres de contexte plus petites que Gemini - évitez les bundles d'équipe
- Fonctionne mieux avec des agents ciblés (PM, Analyste, Architecte)

## 📋 Bundles Web Disponibles

Après avoir exécuté `npm run bundle`, vous aurez accès à :

### Agents BMad Method (BMM)

- **analyst.xml** - Analyse commerciale et collecte d'exigences
- **architect.xml** - Architecture système et conception technique
- **dev.xml** - Développement full-stack et implémentation
- **pm.xml** - Gestion de produit et planification
- **sm.xml** - Scrum master et facilitation agile
- **tea.xml** - Architecture de test et assurance qualité
- **tech-writer.xml** - Documentation technique
- **ux-designer.xml** - Conception d'expérience utilisateur
- **game-designer.xml** - Conception de jeu et mécaniques
- **game-dev.xml** - Développement de jeu
- **game-architect.xml** - Architecture de jeu

### Agent BMad Builder (BMB)

- **bmad-builder.xml** - Créez des agents, workflows et modules personnalisés

### Agents Creative Intelligence Suite (CIS)

- **brainstorming-coach.xml** - Facilitation de brainstorming créatif
- **design-thinking-coach.xml** - Résolution de problèmes centrée sur l'humain
- **innovation-strategist.xml** - Innovation et stratégie
- **creative-problem-solver.xml** - Résolution de problèmes révolutionnaire
- **storyteller.xml** - Narration et storytelling

### Bundles d'Équipe (Collaboration Multi-Agents)

**CRITIQUE : Les bundles d'équipe sont UNIQUEMENT recommandés pour Gemini 2.5 Pro+ sur le web. L'expérience est médiocre avec les Custom GPTs en raison des fenêtres de contexte limitées.**

- **bmm/teams/team-fullstack.xml** - Équipe complète de développement BMad Method
- **bmgd/teams/team-gamedev.xml** - Équipe de développement de jeu
- **cis/teams/creative-squad.xml** - Équipe Creative Intelligence

**Quand utiliser les bundles d'équipe :**

- Vous voulez plusieurs agents collaborant dans un Gem
- Vous utilisez Gemini 2.5 Pro+ (requis)
- Vous avez besoin de perspectives diverses sur des problèmes complexes

**Quand utiliser des agents individuels à la place :**

- Utilisation de Custom GPTs (utilisez toujours des agents individuels)
- Vous voulez une expertise ciblée d'un seul agent
- Besoin d'interactions plus rapides et rationalisées

## 💰 Workflow Recommandé : Planification Web → Implémentation Locale

**Économisez des coûts significatifs** en faisant les phases de planification dans les bundles web, puis en passant à l'IDE local pour l'implémentation.

### Stratégie d'Économie de Coûts

**Phase 1-3 : Faire sur le Web (Économies Majeures)**

Utilisez Gemini Gems ou Custom GPTs pour ces workflows :

1. **Phase d'Analyse** (Analyste, PM)
   - `*brainstorm-project` - Brainstormer des idées et fonctionnalités
   - `*research` - Recherche de marché et technique
   - `*product-brief` - Créer une vision produit

2. **Phase de Planification** (PM)
   - `*prd` - Générer un Document de Spécifications Produit complet
   - `*create-epics-and-stories` - Décomposer en stories de développement

3. **Phase de Solution** (Architecte, Designer UX)
   - `*architecture` - Définir l'architecture technique
   - `*create-ux-design` - Concevoir l'expérience utilisateur

**Exporter les Artefacts :**
Après chaque workflow, copiez/téléchargez les documents générés (PRD, Architecture, Design UX, etc.)

**Phase 4 : Passer à l'IDE Local (Requis pour l'Implémentation)**

1. Sauvegardez les artefacts exportés dans le dossier `docs/` de votre projet
2. Exécutez l'installation BMad locale avec `*workflow-init`
3. BMad détectera les artefacts existants et mettra à jour le statut du workflow
4. Procédez à l'implémentation en utilisant l'agent Développeur localement

**Pourquoi cela fonctionne :**

- **Les workflows de planification** sont lourds en tokens mais n'ont pas besoin de contexte de code
- **Les modèles Web (Gemini/GPT)** gèrent excellemment la planification à moindre coût
- **L'implémentation IDE locale** nécessite un accès complet à la base de code et aux outils
- **Le meilleur des deux mondes** : Économies de coûts + capacités d'implémentation complètes

**Économies typiques :** Réduction de coûts de 60-80% en faisant l'analyse, la planification et l'architecture sur le web avant de passer à l'implémentation locale.

## 🎮 Utiliser les Bundles Web

### Utilisation de Base

**1. Charger l'Agent**

Téléchargez ou collez le fichier XML dans Gemini/GPT. L'agent se présentera et montrera son menu.

**2. Choisir un Workflow**

Utilisez le langage naturel ou des raccourcis :

```
"Exécute le workflow PRD"
*prd

"Commence le brainstorming"
*brainstorm-project

"Montre-moi le menu"
*help
```

**3. Suivre le Workflow**

L'agent vous guide étape par étape à travers le workflow, posant des questions et créant des livrables.

### Fonctionnalités Avancées

**Mode Party**

Tous les bundles web incluent le mode party pour la collaboration multi-agents :

```
*party
```

Cela active plusieurs agents qui collaborent sur votre tâche, fournissant des perspectives diverses.

**Chargement de Contexte**

Certains workflows chargent du contexte supplémentaire :

```
*workflow-init  # Initialiser le workflow du projet
*document-project  # Analyser la base de code existante
```

**Menus Dynamiques**

Les agents adaptent leurs menus en fonction de la phase du projet et des workflows disponibles.

## 🔄 Différences de Plateforme

### Gemini Gems (Fortement Recommandé)

**Avantages :**

- Meilleure analyse et gestion XML
- Gère bien les grands bundles
- Supporte les workflows complexes
- Fenêtre de contexte plus grande (meilleur pour les bundles d'équipe)
- Exécution de code pour la génération de documents
- Fonctionne excellemment avec les workflows BMad

**Inconvénients :**

- Nécessite un compte Google
- Peut avoir des limites de taux sur le niveau gratuit

**Meilleur pour :**

- Tous les agents individuels (PM, Architecte, Développeur, Designer UX, etc.)
- Bundles d'équipe (nécessite Gemini 2.5 Pro+)
- Workflows complexes en plusieurs étapes
- Workflows lourds en documents (PRD, Architecture)

**Modèle Recommandé :** Gemini 2.5 Pro ou supérieur

### Custom GPTs

**Avantages :**

- Interface ChatGPT familière
- Bon pour les workflows conversationnels
- Partage facile avec l'équipe via lien

**Inconvénients :**

- Fenêtre de contexte plus petite que Gemini
- Limite de caractères sur les instructions (les grands bundles peuvent ne pas rentrer)
- **NON recommandé pour les bundles d'équipe**
- Fonctionnalité Canvas moins mature que l'exécution de code de Gemini

**Meilleur pour :**

- Agents individuels ciblés (PM, Analyste, Architecte)
- Agents créatifs (CIS)
- Workflows plus simples (product-brief, brainstorm-project)
- Prototypage rapide

**NON recommandé pour :** Bundles d'équipe, agent Développeur, workflows techniques complexes

## 🎨 Personnalisation

**Avant le Bundling :**

Personnalisez les agents en utilisant le [Guide de Personnalisation des Agents](../agent-customization-guide.md) :

1. Éditez `{bmad_folder}/_cfg/agents/<agent>.customize.yaml`
2. Reconstruisez : `npx bmad-method build <agent-name>`
3. Générez les bundles : `npm run bundle`

Vos personnalisations seront incluses dans les bundles web.

**Après le Bundling :**

Vous pouvez éditer manuellement le XML pour :

- Changer le nom de l'agent (recherchez `<name>`)
- Modifier la persona (recherchez `<persona>`)
- Ajouter des instructions personnalisées (dans les blocs `<critical>`)

## 🔧 Résolution des Problèmes

**L'agent ne répond pas correctement ?**

- Vérifiez que le fichier XML entier a été téléchargé
- Vérifiez qu'aucune troncature ne s'est produite (Gemini/GPT ont des limites de caractères)
- Essayez d'abord un agent plus simple (analyst, pm)

**Les éléments du menu ne fonctionnent pas ?**

- Utilisez le préfixe `*` pour les raccourcis : `*prd` pas `prd`
- Ou utilisez le langage naturel : "Exécute le workflow PRD"
- Vérifiez le menu de l'agent avec `*help`

**Les workflows échouent ?**

- Certains workflows attendent des fichiers de projet (non disponibles dans le contexte web)
- Utilisez des workflows conçus pour la planification/analyse dans les bundles web
- Pour les workflows d'implémentation, utilisez l'installation IDE locale

**Fichier trop grand pour GPT ?**

- Divisez en sections et utilisez plusieurs GPTs
- Utilisez plutôt Gemini Gems (meilleur pour les gros fichiers)
- Générez des bundles d'agent unique au lieu de bundles d'équipe

## ✅ Meilleures Pratiques

1. **Un Fichier Par Gem/GPT** - Téléchargez toujours uniquement UN fichier XML par instance Gemini Gem ou Custom GPT
2. **Préférez Gemini à GPT** - Gemini Gems fonctionne significativement mieux avec les bundles BMad
3. **Activez Canvas/Exécution de Code** - Essentiel pour les workflows de génération de documents (PRD, Architecture, etc.)
4. **Créez des Gems Séparés pour Chaque Agent** - N'essayez pas de combiner les agents sauf via les bundles d'équipe
5. **Bundles d'Équipe = Gemini 2.5 Pro+ Uniquement** - N'utilisez jamais les bundles d'équipe avec les Custom GPTs
6. **Utilisez pour les Phases de Planification** - Les bundles web excellent dans l'analyse, la planification et l'architecture (Phases 1-3)
7. **Passez au Local pour l'Implémentation** - Utilisez l'installation IDE locale pour le développement Phase 4
8. **Exportez et Sauvegardez les Artefacts** - Copiez les documents générés dans le dossier `docs/` de votre projet
9. **Exécutez workflow-init Localement** - Après avoir importé les artefacts web, initialisez le statut du workflow local
10. **Restez à Jour** - Reconstruisez les bundles après les mises à jour BMad pour obtenir les dernières améliorations

## 📚 Exemples

### Exemple 1 : Workflow Web → Local Complet (Recommandé)

**Objectif :** Construire un nouveau produit SaaS avec des économies de coûts maximales

**Phase 1-3 : Planification Web (Gemini Gems)**

1. **Téléchargez les bundles :**
   - `bmm/agents/analyst.xml`
   - `bmm/agents/pm.xml`
   - `bmm/agents/architect.xml`
   - `bmm/agents/ux-designer.xml`

2. **Créez 4 Gemini Gems séparés** (un par agent, activez Code Execution)

3. **Analyse (Gem Analyste) :**
   - Exécutez : `*brainstorm-project` → Générez des idées
   - Exécutez : `*research` → Analyse de marché
   - Exportez : Sauvegardez les résultats de recherche

4. **Planification (Gem PM) :**
   - Partagez les résultats de recherche
   - Exécutez : `*product-brief` → Vision produit
   - Exécutez : `*prd` → Document complet de spécifications
   - Exportez : Sauvegardez le PRD vers `docs/prd.md`

5. **Design UX (Gem Designer UX) :**
   - Partagez le PRD
   - Exécutez : `*create-ux-design` → Spécifications UX
   - Exportez : Sauvegardez le design UX vers `docs/ux-design.md`

6. **Architecture (Gem Architecte) :**
   - Partagez PRD et Design UX
   - Exécutez : `*architecture` → Architecture technique
   - Exportez : Sauvegardez vers `docs/architecture.md`

**Phase 4 : Implémentation Locale**

7. **Configurez BMad local :**
   - Installez BMad localement : `npx bmad-method@alpha install`
   - Placez les docs exportés dans le dossier `docs/` du projet
   - Chargez l'agent Développeur
   - Exécutez : `*workflow-init` → BMad détecte les artefacts, suggère les prochaines étapes

8. **Implémentez :**
   - Exécutez : `*sprint-planning` → Configurez le sprint
   - Exécutez : `*dev-story` → Implémentez les fonctionnalités
   - Utilisez les capacités complètes de l'IDE avec accès à la base de code

**Économies de Coûts :** 60-80% en faisant la planification dans Gemini avant l'implémentation locale

### Exemple 2 : Session de Brainstorming Rapide

1. Téléchargez `cis/agents/brainstorming-coach.xml`
2. Créez un Gemini Gem avec Code Execution activé
3. Exécutez : `*brainstorming`
4. Choisissez une technique (ex : SCAMPER, Mind Mapping)
5. Générez et affinez les idées
6. Exportez les résultats pour revue d'équipe

### Exemple 3 : Revue d'Architecture

1. Téléchargez `bmm/agents/architect.xml`
2. Créez un Gemini Gem (activez Code Execution)
3. Collez le PRD existant dans la conversation
4. Exécutez : `*architecture`
5. Collaborez sur les décisions techniques
6. Exportez le document d'architecture vers `docs/architecture.md`

## 📖 Ressources

### Documentation

- **[Guide de Personnalisation des Agents](../agent-customization-guide.md)** - Personnalisez avant le bundling
- **[Documentation BMM](../../src/modules/bmm/docs/README.md)** - Apprenez tous les workflows
- **[Guide d'Installation](./installation.md)** - Configuration locale
- **[Intégration IDE](./integration-ide.md)** - Configuration IDE

### Plateformes

- **[Google AI Studio](https://aistudio.google.com/)** - Créez des Gemini Gems
- **[Custom GPTs](https://chat.openai.com/gpts)** - Créez des Custom GPTs
- **[BMad Discord](https://discord.gg/gk8jAdXWmj)** - Obtenez de l'aide et partagez vos Gems/GPTs

---

**Prêt à économiser sur les coûts tout en construisant mieux ?** Téléchargez vos bundles et commencez avec Gemini Gems ! 🚀
