# Guide d'Intégration IDE - BMad Method

Ce guide explique comment utiliser les agents BMad Method dans différents environnements de développement intégrés (IDEs).

## 🎯 IDEs Supportés

BMad Method fonctionne avec tous les principaux IDEs supportant les agents IA :

- ✅ **Claude Code** (Recommandé - meilleure intégration)
- ✅ **Cursor**
- ✅ **Windsurf**
- ✅ **VS Code** (avec extensions IA)
- ✅ **Cline**
- ✅ **Autres** (Roo, Auggie, iFlow, etc.)

## 📋 Avant de Commencer

Assurez-vous d'avoir :

1. ✅ Installé BMad Method : `npx bmad-method@alpha install`
2. ✅ Complété la configuration interactive
3. ✅ Vérifié que le dossier `.bmad` existe dans votre projet

## 🔵 Claude Code

### Vue d'ensemble

Claude Code offre la meilleure intégration avec BMad Method via les **commandes slash**.

### Activation des Agents

Les agents BMad sont automatiquement installés en tant que commandes slash dans `.claude/commands/bmad/`.

#### Utilisation de Base

**1. Taper la Commande Slash**
```
/
```
Tapez `/` dans le chat pour voir toutes les commandes disponibles.

**2. Sélectionner un Agent**
```
/bmad:bmm:agents:dev              # Agent développeur
/bmad:bmm:agents:architect        # Agent architecte
/bmad:bmm:agents:pm               # Agent chef de produit
/bmad:bmm:agents:sm               # Agent scrum master
/bmad:bmm:agents:ux-designer      # Agent designer UX
```

**3. Exécuter**
Appuyez sur Entrée pour activer l'agent. L'agent se présentera et affichera son menu.

#### Exécution de Workflows

**Option A : Via Commande Slash**
```
/bmad:bmm:workflows:prd           # Workflow PRD
/bmad:bmm:workflows:dev-story     # Workflow dev story
/bmad:bmm:workflows:architecture  # Workflow architecture
```

**Option B : Via Menu de l'Agent**
```
# 1. Charger l'agent
/bmad:bmm:agents:pm

# 2. Attendre le menu

# 3. Sélectionner un workflow
*prd                              # Raccourci
"Créons un PRD"                   # Langage naturel
```

### Exemples Claude Code

**Exemple 1 : Initialiser un Projet**
```
# Charger l'agent analyste
/bmad:bmm:agents:analyst

# Attendre le menu, puis :
*workflow-init
```

**Exemple 2 : Créer un PRD**
```
# Démarrer un nouveau chat
/bmad:bmm:agents:pm

# Attendre le menu, puis :
*prd
```

**Exemple 3 : Implémenter une Story**
```
# Démarrer un nouveau chat
/bmad:bmm:agents:dev

# Attendre le menu, puis :
*dev-story
```

### Conseils Claude Code

- ✅ **Nouvelles conversations** - Démarrez un nouveau chat pour chaque workflow majeur
- ✅ **Autocomplétion** - Les commandes s'autocomplètent quand vous tapez `/`
- ✅ **L'agent reste actif** - Une fois chargé, l'agent reste dans la conversation
- ✅ **Navigation de menu** - Utilisez des raccourcis (`*prd`) ou du langage naturel

---

## 🟣 Cursor

### Vue d'ensemble

Cursor utilise des **règles MDC** (Manual type) pour charger les agents BMad.

### Activation des Agents

Les agents BMad sont installés dans `.cursor/rules/bmad/` en tant que règles.

#### Utilisation de Base

**1. Référencer dans le Chat**

Utilisez la syntaxe `@` pour charger les agents :

```
@.bmad/bmm/agents/dev             # Agent développeur
@.bmad/bmm/agents/architect       # Agent architecte
@.bmad/bmm/agents/pm              # Agent chef de produit
```

**2. Inclure un Module Entier**
```
@.bmad/bmm                        # Tous les agents BMM
@.bmad/cis                        # Tous les agents CIS
@.bmad/core                       # Tous les agents principaux
```

**3. Référencer l'Index**
```
@.bmad/index                      # Tous les agents disponibles
```

#### Exécution de Workflows

**Étape 1 : Charger l'Agent**
```
@.bmad/bmm/agents/pm
```

**Étape 2 : Demander un Workflow**
```
Exécute le workflow PRD
```

### Exemples Cursor

**Exemple 1 : Workflow PRD**
```
@.bmad/bmm/agents/pm

Salut ! Créons un nouveau PRD pour mon projet.
```

**Exemple 2 : Architecture Design**
```
@.bmad/bmm/agents/architect

Aide-moi à créer un document d'architecture.
```

**Exemple 3 : Agents Multiples**
```
@.bmad/bmm/agents/dev @.bmad/bmm/agents/architect

J'ai besoin de conseils sur l'architecture et l'implémentation.
```

### Conseils Cursor

- ✅ **Type Manuel** - Les règles sont de type Manuel (chargées uniquement quand référencées)
- ✅ **Pas de pollution de contexte** - Pas de contexte automatique chargé
- ✅ **Combiner les agents** - Vous pouvez référencer plusieurs agents
- ✅ **Nouvelle conversation** - Démarrez une nouvelle conversation pour chaque workflow majeur

---

## 🟢 Windsurf

### Vue d'ensemble

Windsurf utilise un système similaire à Cursor avec des règles et références `@`.

### Activation des Agents

Configuration similaire à Cursor. Les agents sont chargés via des références `@`.

#### Utilisation de Base

```
@.bmad/bmm/agents/dev             # Agent développeur
@.bmad/bmm/agents/pm              # Agent chef de produit
@.bmad/bmm/agents/architect       # Agent architecte
```

### Exemples Windsurf

Même syntaxe que Cursor :

```
@.bmad/bmm/agents/pm

Créons un PRD pour mon application SaaS.
```

### Conseils Windsurf

- Utilise le même système de règles que Cursor
- Supporte les références `@` multiples
- Fonctionne mieux avec des conversations fraîches

---

## 🔷 VS Code (avec Extensions IA)

### Vue d'ensemble

VS Code nécessite des extensions IA (GitHub Copilot, Codeium, etc.) pour utiliser les agents BMad.

### Configuration

**Option A : Via Copilot Chat**
```
# Utiliser dans Copilot Chat
Charge l'agent de {project-root}/.bmad/bmm/agents/dev.md
```

**Option B : Via Extensions Personnalisées**

Voir [docs/ide-info/](../ide-info/) pour les instructions spécifiques à l'extension.

---

## 🎨 Cline (VS Code Extension)

### Vue d'ensemble

Cline est une extension VS Code populaire pour les agents IA.

### Utilisation de Base

```
# Charger l'agent
Charge et agis en tant qu'agent de .bmad/bmm/agents/dev.md

# Exécuter le workflow
Exécute le workflow dev-story
```

---

## 📝 Flux de Travail Recommandé

### Règle d'Or : Nouvelles Conversations

**⚠️ IMPORTANT :** Utilisez toujours des conversations fraîches pour les workflows majeurs.

**Pourquoi ?**
- Évite les hallucinations de contexte
- Assure une capacité de contexte maximale
- Améliore la qualité des résultats

### Workflow Typique de Projet

#### Phase 1 : Analyse (Optionnel)

**Chat 1 : Initialisation**
```
# Claude Code
/bmad:bmm:agents:analyst
*workflow-init

# Cursor/Windsurf
@.bmad/bmm/agents/analyst
Exécute workflow-init
```

**Chat 2 : Brainstorming**
```
# Nouveau chat
/bmad:bmm:agents:analyst
*brainstorm-project
```

#### Phase 2 : Planification (Requis)

**Chat 3 : PRD**
```
# Nouveau chat
/bmad:bmm:agents:pm
*prd
```

**Chat 4 : UX Design (si UI)**
```
# Nouveau chat
/bmad:bmm:agents:ux-designer
*create-ux-design
```

#### Phase 3 : Solution (Piste Method/Enterprise)

**Chat 5 : Architecture**
```
# Nouveau chat
/bmad:bmm:agents:architect
*architecture
```

**Chat 6 : Epics et Stories**
```
# Nouveau chat
/bmad:bmm:agents:pm
*create-epics-and-stories
```

#### Phase 4 : Implémentation (Requis)

**Chat 7 : Planification Sprint**
```
# Nouveau chat
/bmad:bmm:agents:sm
*sprint-planning
```

**Chat 8 : Créer Story**
```
# Nouveau chat
/bmad:bmm:agents:sm
*create-story
```

**Chat 9 : Implémenter Story**
```
# Nouveau chat
/bmad:bmm:agents:dev
*dev-story
```

**Chat 10 : Revue de Code**
```
# Nouveau chat
/bmad:bmm:agents:dev
*code-review
```

**Répéter pour chaque story...**

---

## 🎯 Référence Rapide des Agents

### Agents de Développement

| Agent | Commande Claude Code | Référence Cursor/Windsurf | Utiliser Pour |
|-------|---------------------|---------------------------|---------------|
| **Developer** | `/bmad:bmm:agents:dev` | `@.bmad/bmm/agents/dev` | Implémentation de code |
| **Architect** | `/bmad:bmm:agents:architect` | `@.bmad/bmm/agents/architect` | Conception d'architecture |
| **Test Architect** | `/bmad:bmm:agents:tea` | `@.bmad/bmm/agents/tea` | Stratégie de test |

### Agents Produit

| Agent | Commande Claude Code | Référence Cursor/Windsurf | Utiliser Pour |
|-------|---------------------|---------------------------|---------------|
| **PM** | `/bmad:bmm:agents:pm` | `@.bmad/bmm/agents/pm` | PRD, epics, stories |
| **Analyst** | `/bmad:bmm:agents:analyst` | `@.bmad/bmm/agents/analyst` | Recherche, analyse |
| **UX Designer** | `/bmad:bmm:agents:ux-designer` | `@.bmad/bmm/agents/ux-designer` | Conception UX |

### Agents Leadership

| Agent | Commande Claude Code | Référence Cursor/Windsurf | Utiliser Pour |
|-------|---------------------|---------------------------|---------------|
| **Scrum Master** | `/bmad:bmm:agents:sm` | `@.bmad/bmm/agents/sm` | Gestion sprint |
| **BMad Master** | `/bmad:bmm:agents:bmad-master` | `@.bmad/bmm/agents/bmad-master` | Guide du processus |

### Agents Créatifs

| Agent | Commande Claude Code | Référence Cursor/Windsurf | Utiliser Pour |
|-------|---------------------|---------------------------|---------------|
| **Brainstorming Coach** | `/bmad:cis:agents:brainstorming-coach` | `@.bmad/cis/agents/brainstorming-coach` | Brainstorming |
| **Storyteller** | `/bmad:cis:agents:storyteller` | `@.bmad/cis/agents/storyteller` | Narration |

---

## 💡 Conseils et Astuces

### Maximiser les Performances

**1. Modèles de Contexte 200k+**
- Utilisez Claude Sonnet 4.5, GPT-4, ou équivalent
- Meilleur pour les workflows complexes
- Gère de grands documents (PRD, architecture)

**2. Conversations Fraîches**
- Démarrez un nouveau chat pour chaque workflow
- Évite la fatigue du contexte
- Améliore la qualité

**3. Copier/Coller de Documents**
- Partagez le contexte entre les conversations
- Copiez PRD → chat Architecture
- Copiez Architecture → chat Dev Story

### Gestion du Contexte

**Workflows à Contexte Élevé**
- PRD
- Architecture
- UX Design
- Recherche

→ **Utilisez toujours de nouvelles conversations**

**Workflows à Contexte Faible**
- Vérification du statut
- Questions simples
- Aide sur les menus

→ **Peut réutiliser les conversations**

### Correspondance de Menu Floue

Les agents BMad v6 sont excellents pour correspondre aux intentions :

```
# Toutes ces options fonctionnent :
*prd
"créons un prd"
"j'ai besoin d'un document de spécifications produit"
"aide-moi à créer des exigences"
```

---

## 🔧 Résolution des Problèmes

### L'agent ne se charge pas

**Problème :** La commande slash / référence @ ne fonctionne pas

**Solutions :**
1. Vérifier que l'installation BMad s'est terminée
2. Vérifier que le dossier `.bmad` existe
3. Redémarrer l'IDE
4. Vérifier la configuration spécifique à l'IDE

### L'agent ne parle pas la bonne langue

**Problème :** L'agent communique en anglais au lieu du français

**Solutions :**
1. Vérifier `.bmad/core/config.yaml` :
   ```yaml
   communication_language: "Français"
   ```
2. Démarrer une **nouvelle conversation**
3. Charger à nouveau l'agent

### Menu de workflow manquant

**Problème :** L'agent se charge mais ne montre pas le menu

**Solutions :**
1. Attendre quelques secondes (le menu se génère)
2. Taper `*help` pour forcer l'affichage du menu
3. Demander : "montre-moi tes workflows disponibles"

### Erreur "Fichier non trouvé"

**Problème :** `Error: Cannot find agent file`

**Solutions :**
```bash
# Vérifier que les agents existent
ls .bmad/bmm/agents/

# Réinstaller si nécessaire
npx bmad-method@alpha install
```

### Hallucinations de l'Agent

**Problème :** L'agent invente des faits ou donne de mauvaises réponses

**Solutions :**
1. ✅ **Démarrer une nouvelle conversation** (cause #1)
2. Fournir plus de contexte
3. Utiliser des modèles de contexte plus grands
4. Diviser les workflows complexes

---

## 📚 Ressources

### Documentation

- **[Guide de Démarrage Rapide](./demarrage-rapide.md)** - Tutoriel de 15 minutes
- **[Guide d'Installation](./installation.md)** - Configuration détaillée
- **[Bundles Web](./bundles-web.md)** - Gemini Gems et Custom GPTs
- **[Toute la Documentation](../index.md)** - Index complet

### Guides Spécifiques à l'IDE

- **[Claude Code](../ide-info/claude-code.md)** - Documentation détaillée
- **[Cursor](../ide-info/cursor.md)** - Configuration Cursor
- **[Windsurf](../ide-info/windsurf.md)** - Configuration Windsurf
- **[Tous les IDEs](../ide-info/)** - Répertoire complet

### Support Communautaire

- **[Discord](https://discord.gg/gk8jAdXWmj)** - #help, #ide-setup
- **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Signaler des bugs
- **[YouTube](https://www.youtube.com/@BMadCode)** - Tutoriels vidéo

---

**Prêt à commencer ?** Chargez votre premier agent et exécutez `*workflow-init` ! 🚀
