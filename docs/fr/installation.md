# Guide d'Installation BMad Method

Ce guide vous accompagne dans l'installation et la configuration de BMad Method pour votre projet.

## 📋 Prérequis

Avant d'installer BMad Method, assurez-vous d'avoir :

- **Node.js** version 20.0.0 ou supérieure ([Télécharger Node.js](https://nodejs.org))
- Un **éditeur de code** ou IDE compatible :
  - Claude Code (recommandé)
  - Cursor
  - Windsurf
  - VS Code avec extensions IA
  - Autres IDEs compatibles
- **Git** (optionnel, mais recommandé pour le contrôle de version)

## 🚀 Installation Rapide

### Étape 1 : Installer BMad Method

Ouvrez votre terminal dans le répertoire de votre projet et exécutez :

```bash
# Pour v6 Alpha (recommandé - fonctionnalités les plus récentes)
npx bmad-method@alpha install

# OU pour v4 Stable (production)
npx bmad-method install
```

### Étape 2 : Configuration Interactive

L'installateur vous guidera à travers plusieurs questions de configuration :

#### Configuration de Base

**1. Nom d'utilisateur**
```
? Quel est votre nom ?
> Votre Nom
```
Utilisé par les agents pour personnaliser la communication.

**2. Langue de Communication**
```
? Langue/Style de Chat Préféré ? (English, Mandarin, English Pirate, etc...)
> Français
```
La langue dans laquelle les agents IA communiqueront avec vous pendant les workflows.

**3. Langue de Sortie des Documents**
```
? Langue de Sortie des Documents Préférée ?
> Français
```
La langue utilisée pour tous les documents générés (PRD, architecture, code, etc.).
Par défaut, elle correspond à votre langue de communication.

**4. Dossier BMAD**
```
? Nom du dossier BMAD ? (recommandé : .bmad)
> .bmad
```
Où les agents, workflows et configurations seront stockés.

**5. Dossier de Sortie**
```
? Dossier de sortie pour les documents ?
> {project-root}/docs
```
Où les documents de workflow (PRD, architecture, etc.) seront sauvegardés.

#### Configuration du Module

L'installateur vous demandera quels modules installer :

- **✅ BMad Method (BMM)** - Module de développement agile principal (recommandé)
- **BMad Builder (BMB)** - Créez des agents et workflows personnalisés
- **BMad Game Development (BMGD)** - Développement de jeux avec Unity/Unreal
- **Creative Intelligence Suite (CIS)** - Workflows de brainstorming et innovation
- **Content Creator** - Création de contenu avec correspondance vocale
- **Marketing Ops** - Suite complète d'opérations marketing
- **Career Coach** - Développement de carrière et rédaction de CV
- **UX Writer** - Rédaction de copie d'interface et microcopy

### Étape 3 : Vérifier l'Installation

Après l'installation, vous devriez voir :

```
docs/fr/
└── {bmad_folder}/            # Par défaut : .bmad
    ├── core/
    │   ├── config.yaml       # Votre configuration
    │   └── agents/           # Agents principaux
    ├── bmm/                  # BMad Method (si installé)
    │   ├── config.yaml
    │   ├── agents/
    │   └── workflows/
    ├── bmb/                  # BMad Builder (si installé)
    ├── bmgd/                 # BMad Game Development (si installé)
    ├── cis/                  # Creative Intelligence (si installé)
    ├── content-creator/      # Content Creator (si installé)
    ├── marketing-ops/        # Marketing Ops (si installé)
    ├── career-coach/         # Career Coach (si installé)
    └── ux-writer/            # UX Writer (si installé)
```

## 🎨 Configuration Multi-Langue

BMad Method offre un support unique de **double langue** :

### Séparation Communication vs Sortie

**Langue de Communication** (`communication_language`)
- Comment les agents IA vous parlent pendant les workflows
- Exemples : "Français", "English", "Español", "Mandarin", "English Pirate"
- Utilisé pour les menus, questions et guidage interactif

**Langue de Sortie des Documents** (`document_output_language`)
- Langue pour tous les documents générés (PRD, architecture, code, etc.)
- Par défaut identique à la langue de communication
- Peut être différente pour les équipes internationales

### Exemples de Configuration

**Exemple 1 : Tout en Français**
```yaml
communication_language: "Français"
document_output_language: "Français"
```
- Les agents communiquent en français
- Tous les documents en français

**Exemple 2 : Chat Français, Docs Anglais**
```yaml
communication_language: "Français"
document_output_language: "English"
```
- Les agents vous parlent en français
- PRD, architecture et code en anglais
- **Parfait pour les équipes internationales !**

**Exemple 3 : Style Décontracté + Sortie Professionnelle**
```yaml
communication_language: "Français décontracté"
document_output_language: "Français professionnel"
```
- Conversation décontractée avec les agents
- Documentation formelle et professionnelle

### Modifier la Configuration Langue

**Option A : Édition Directe**
```bash
# Éditer le fichier de configuration principal
nano .bmad/core/config.yaml
```

Modifiez ces lignes :
```yaml
communication_language: "Français"
document_output_language: "Français"
```

**Option B : Réinstallation**
```bash
npx bmad-method@alpha install --quick
```
L'installateur détecte l'installation existante et vous demande uniquement les champs modifiés.

## 🔧 Configuration Avancée

### Personnaliser les Agents

Chaque agent peut être personnalisé via ses fichiers de configuration :

```bash
# Fichier de personnalisation de l'agent
.bmad/_cfg/agents/<agent-name>.customize.yaml
```

Voir le [Guide de Personnalisation des Agents](../agent-customization-guide.md) pour plus de détails.

### Configuration Spécifique au Module

Chaque module a son propre `config.yaml` qui hérite des paramètres principaux :

```bash
.bmad/bmm/config.yaml        # Config BMad Method
.bmad/cis/config.yaml        # Config Creative Intelligence
.bmad/content-creator/config.yaml  # Config Content Creator
```

Les valeurs principales (`communication_language`, `document_output_language`, `user_name`) sont **automatiquement héritées** de `.bmad/core/config.yaml`.

## 🔄 Mise à Jour de BMad Method

### Mise à Jour vers la Dernière Version

```bash
# Mise à jour Alpha
npx bmad-method@alpha install

# OU mise à jour Stable
npx bmad-method install
```

L'installateur :
- ✅ Détecte votre installation existante
- ✅ Préserve vos personnalisations
- ✅ Met à jour les agents et workflows
- ✅ Migre les configurations si nécessaire

### Vos Personnalisations Sont Sûres

BMad Method utilise un **système de personnalisation sûr pour les mises à jour** :

- Configurations dans `.bmad/core/config.yaml` - **Préservées**
- Fichiers `.customize.yaml` - **Préservés**
- Documents personnalisés dans `docs/` - **Préservés**
- Agents et workflows principaux - **Mis à jour**

## 📦 Options d'Installation

### Installation Rapide (Skip Prompts)

```bash
npx bmad-method@alpha install --quick
```
Utilise les valeurs par défaut et ne demande que les nouveaux paramètres.

### Installation Spécifique au Module

```bash
# Installer uniquement BMad Method
npx bmad-method@alpha install --module bmm

# Installer uniquement Creative Intelligence Suite
npx bmad-method@alpha install --module cis
```

### Installation Propre (Recommencer)

```bash
# Sauvegarder d'abord vos personnalisations !
npx bmad-method@alpha install --clean
```
Supprime l'installation existante et recommence.

## 🌐 Configuration IDE

Après l'installation, configurez votre IDE pour utiliser les agents BMad :

### Claude Code

Les agents sont automatiquement installés en tant que commandes slash :

```
/bmad:bmm:agents:dev         # Activer l'agent développeur
/bmad:bmm:agents:architect   # Activer l'agent architecte
/bmad:bmm:workflows:prd      # Exécuter le workflow PRD
```

Voir le [Guide Claude Code](./integration-ide.md#claude-code) pour les détails.

### Cursor

Les agents sont installés en tant que règles MDC :

```
@{bmad_folder}/bmm/agents/dev       # Activer l'agent dev
@{bmad_folder}/bmm/agents/architect # Activer l'agent architecte
```

Voir le [Guide Cursor](./integration-ide.md#cursor) pour les détails.

### Windsurf

Configuration similaire à Cursor avec règles MDC.

Voir le [Guide Windsurf](./integration-ide.md#windsurf) pour les détails.

### Autres IDEs

Voir [docs/ide-info/](../ide-info/) pour les instructions spécifiques à votre IDE.

## 🎯 Premiers Pas

Après l'installation :

1. **Chargez un agent** dans votre IDE (voir [Guide d'Intégration IDE](./integration-ide.md))
2. **Exécutez workflow-init** pour initialiser votre projet
3. **Suivez les workflows guidés** pour construire votre logiciel

Voir le [Guide de Démarrage Rapide](./demarrage-rapide.md) pour un tutoriel complet.

## ❓ Résolution des Problèmes

### L'installation échoue avec une erreur Node.js

**Problème :** `Error: Node.js version X.X.X is not supported`

**Solution :**
```bash
# Vérifier la version de Node.js
node --version

# Mettre à jour vers Node.js 20+
# Visiter https://nodejs.org et télécharger la dernière version
```

### Le dossier .bmad n'est pas créé

**Problème :** L'installation se termine mais pas de dossier `.bmad`

**Solution :**
```bash
# Vérifier si vous êtes dans le bon répertoire
pwd

# Réexécuter avec des permissions appropriées
npx bmad-method@alpha install
```

### Les agents ne se chargent pas dans l'IDE

**Problème :** Les commandes slash ou règles ne fonctionnent pas

**Solution :**
1. Vérifier que l'installation s'est terminée avec succès
2. Redémarrer votre IDE
3. Vérifier la configuration spécifique à l'IDE dans [docs/ide-info/](../ide-info/)

### Erreur "Module not found"

**Problème :** `Error: Cannot find module 'bmad-method'`

**Solution :**
```bash
# Vider le cache npm
npm cache clean --force

# Réinstaller
npx bmad-method@alpha install
```

### Configuration Langue Pas Appliquée

**Problème :** Les agents ne parlent pas dans la langue configurée

**Solution :**
1. Vérifier `.bmad/core/config.yaml` :
   ```yaml
   communication_language: "Français"
   ```
2. Redémarrer une nouvelle conversation avec l'agent
3. Les paramètres de langue prennent effet pour les nouvelles conversations

## 🆘 Obtenir de l'Aide

Si vous rencontrez des problèmes :

1. **Documentation** - [docs/index.md](../index.md) - Documentation complète
2. **Discord** - [Rejoindre la Communauté](https://discord.gg/gk8jAdXWmj) - #help, #bugs-issues
3. **GitHub Issues** - [Signaler un Bug](https://github.com/bmad-code-org/BMAD-METHOD/issues)
4. **YouTube** - [Tutoriels BMadCode](https://www.youtube.com/@BMadCode)

## 📚 Prochaines Étapes

Après une installation réussie :

- 📖 Lire le [Guide de Démarrage Rapide](./demarrage-rapide.md)
- 🎨 Apprendre la [Personnalisation des Agents](../agent-customization-guide.md)
- 🌐 Explorer les [Bundles Web](./bundles-web.md) pour Gemini/GPT
- 🔧 Configurer l'[Intégration IDE](./integration-ide.md)
- 💬 Rejoindre la [Communauté Discord](https://discord.gg/gk8jAdXWmj)

---

**Besoin d'aide ?** Rejoignez notre communauté Discord ou consultez la documentation complète !
