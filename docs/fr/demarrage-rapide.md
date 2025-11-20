# Guide de Démarrage Rapide BMad Method v6

Commencez avec BMad Method v6 pour votre nouveau projet greenfield. Ce guide vous accompagne dans la construction de logiciels à partir de zéro en utilisant des workflows alimentés par l'IA.

## 🚀 TL;DR - Le Chemin Rapide

1. **Installer** : `npx bmad-method@alpha install`
2. **Initialiser** : Chargez l'agent Analyste → Exécutez "workflow-init"
3. **Planifier** : Chargez l'agent PM → Exécutez "prd" (ou "tech-spec" pour petits projets)
4. **Architecturer** : Chargez l'agent Architecte → Exécutez "create-architecture" (10+ stories uniquement)
5. **Construire** : Chargez l'agent SM → Exécutez les workflows pour chaque story → Chargez l'agent DEV → Implémentez
6. **Toujours utiliser des chats frais** pour chaque workflow pour éviter les hallucinations

---

## 📖 Qu'est-ce que BMad Method ?

BMad Method (BMM) vous aide à construire des logiciels à travers des workflows guidés avec des agents IA spécialisés. Le processus suit quatre phases :

1. **Phase 1 : Analyse** (Optionnel) - Brainstorming, Recherche, Brief Produit
2. **Phase 2 : Planification** (Requis) - Créez vos exigences (tech-spec ou PRD)
3. **Phase 3 : Solution** (Dépend de la piste) - Concevez l'architecture pour les pistes BMad Method et Enterprise
4. **Phase 4 : Implémentation** (Requis) - Construisez votre logiciel Epic par Epic, Story par Story

### Visualisation Complète du Workflow

![Workflow BMad Method - Standard Greenfield](../../src/modules/bmm/docs/images/workflow-method-greenfield.svg)

_Organigramme visuel complet montrant toutes les phases, workflows, agents (codés par couleur) et points de décision pour la piste standard greenfield BMad Method. Chaque boîte est codée par couleur selon l'agent responsable de ce workflow._

## 💻 Installation

```bash
# Installer v6 Alpha dans votre projet
npx bmad-method@alpha install
```

L'installateur interactif vous guidera à travers la configuration et créera un dossier `{bmad_folder}/` avec tous les agents et workflows.

**Configuration Langue :**

Lors de l'installation, vous serez invité à configurer :

```
? Langue/Style de Chat Préféré ?
> Français

? Langue de Sortie des Documents Préférée ?
> Français  (ou Anglais pour docs internationaux)
```

---

## 🎯 Commencer

### Étape 1 : Initialiser Votre Workflow

1. **Chargez l'agent Analyste** dans votre IDE - Voir les instructions spécifiques à votre IDE dans [docs/fr/integration-ide.md](./integration-ide.md) :
   - [Claude Code](./integration-ide.md#-claude-code)
   - [Cursor](./integration-ide.md#-cursor)
   - [Windsurf](./integration-ide.md#-windsurf)
   - Autres IDEs également supportés

2. **Attendez le menu de l'agent** d'apparaître

3. **Dites à l'agent** : "Exécute workflow-init" ou tapez "\*workflow-init" ou sélectionnez le numéro de l'élément de menu

#### Que se passe-t-il pendant workflow-init ?

Les workflows sont des processus interactifs dans V6 qui ont remplacé les tâches et modèles des versions précédentes. Il existe de nombreux types de workflows, et vous pouvez même créer les vôtres avec le module BMad Builder.

Pendant workflow-init, vous décrirez :

- Votre projet et ses objectifs
- S'il existe une base de code existante ou s'il s'agit d'un nouveau projet
- La taille et la complexité générales (vous pouvez ajuster cela plus tard)

#### Pistes de Planification

En fonction de votre description, le workflow suggérera une piste et vous laissera choisir parmi :

**Trois Pistes de Planification :**

- **Quick Flow** - Implémentation rapide (tech-spec uniquement) - correctifs de bugs, fonctionnalités simples, portée claire (typiquement 1-15 stories)
- **BMad Method** - Planification complète (PRD + Architecture + UX) - produits, plateformes, fonctionnalités complexes (typiquement 10-50+ stories)
- **Enterprise Method** - Planification étendue (BMad Method + Sécurité/DevOps/Test) - exigences d'entreprise, conformité, multi-tenant (typiquement 30+ stories)

**Note** : Les nombres de stories sont des guides, pas des définitions. Les pistes sont choisies en fonction des besoins de planification, pas des mathématiques des stories.

#### Qu'est-ce qui est créé ?

Une fois que vous confirmez votre piste, le fichier `bmm-workflow-status.yaml` sera créé dans le dossier docs de votre projet (en supposant l'emplacement d'installation par défaut). Ce fichier suit votre progression à travers toutes les phases.

**Notes importantes :**

- Chaque piste a des chemins différents à travers les phases
- Les nombres de stories peuvent encore changer en fonction de la complexité globale au fur et à mesure que vous travaillez
- Pour ce guide, nous supposerons un projet de piste BMad Method
- Ce workflow vous guidera à travers la Phase 1 (optionnel), Phase 2 (requis) et Phase 3 (requis pour les pistes BMad Method et Enterprise)

### Étape 2 : Travailler à Travers les Phases 1-3

Après la fin de workflow-init, vous travaillerez à travers les phases de planification. **Important : Utilisez des chats frais pour chaque workflow pour éviter les limitations de contexte.**

#### Vérifier Votre Statut

Si vous n'êtes pas sûr de ce qu'il faut faire ensuite :

1. Chargez n'importe quel agent dans un nouveau chat
2. Demandez "workflow-status"
3. L'agent vous indiquera le prochain workflow recommandé ou requis

**Exemple de réponse :**

```
Phase 1 (Analyse) est entièrement optionnelle. Tous les workflows sont optionnels ou recommandés :
  - brainstorm-project - optionnel
  - research - optionnel
  - product-brief - RECOMMANDÉ (mais pas requis)

La prochaine étape VRAIMENT REQUISE est :
  - PRD (Product Requirements Document) en Phase 2 - Planification
  - Agent : pm
  - Commande : prd
```

#### Comment Exécuter les Workflows dans les Phases 1-3

Quand un agent vous dit d'exécuter un workflow (comme `prd`) :

1. **Démarrez un nouveau chat** avec l'agent spécifié (ex : PM) - Voir [integration-ide.md](./integration-ide.md) pour les instructions spécifiques à votre IDE
2. **Attendez le menu** d'apparaître
3. **Dites à l'agent** de l'exécuter en utilisant l'un de ces formats :
   - Tapez le raccourci : `*prd`
   - Dites-le naturellement : "Créons un nouveau PRD"
   - Sélectionnez le numéro du menu pour "create-prd"

Les agents dans V6 sont très bons avec la correspondance floue de menu !

#### Référence Rapide : Correspondance Agent → Document

Pour les utilisateurs v4 ou ceux qui préfèrent sauter les conseils workflow-status :

- **Analyste** → Brainstorming, Brief Produit
- **PM** → PRD (pistes BMad Method/Enterprise) OU tech-spec (piste Quick Flow)
- **UX-Designer** → Document de Design UX (si l'UI fait partie du projet)
- **Architecte** → Architecture (pistes BMad Method/Enterprise)

#### Phase 2 : Planification - Créer le PRD

**Pour les pistes BMad Method et Enterprise :**

1. Chargez l'**agent PM** dans un nouveau chat
2. Dites-lui d'exécuter le workflow PRD
3. Une fois terminé, vous aurez :
   - **PRD.md** - Votre Document de Spécifications Produit

**Pour la piste Quick Flow :**

- Utilisez **tech-spec** au lieu du PRD (pas d'architecture nécessaire)

#### Phase 2 (Optionnel) : Design UX

Si votre projet a une interface utilisateur :

1. Chargez l'**agent UX-Designer** dans un nouveau chat
2. Dites-lui d'exécuter le workflow de design UX
3. Après l'achèvement, vous aurez votre document de spécification UX

#### Phase 3 : Architecture

**Pour les pistes BMad Method et Enterprise :**

1. Chargez l'**agent Architecte** dans un nouveau chat
2. Dites-lui d'exécuter le workflow create-architecture
3. Après l'achèvement, vous aurez votre document d'architecture avec les décisions techniques

#### Phase 3 : Créer Epics et Stories (REQUIS après Architecture)

**Amélioration V6 :** Les epics et stories sont maintenant créées APRÈS l'architecture pour une meilleure qualité !

1. Chargez l'**agent PM** dans un nouveau chat
2. Dites-lui d'exécuter "create-epics-and-stories"
3. Cela décompose les FR/NFR de votre PRD en epics et stories implémentables
4. Le workflow utilise à la fois le PRD et l'Architecture pour créer des stories techniquement informées

**Pourquoi après l'architecture ?** Les décisions d'architecture (base de données, modèles d'API, stack technique) affectent directement la façon dont les stories doivent être décomposées et séquencées.

#### Phase 3 : Vérification de Préparation à l'Implémentation (Hautement Recommandé)

Une fois les epics et stories créées :

1. Chargez l'**agent Architecte** dans un nouveau chat
2. Dites-lui d'exécuter "implementation-readiness"
3. Cela valide la cohésion à travers tous vos documents de planification (PRD, UX, Architecture, Epics)
4. Ceci s'appelait la "PO Master Checklist" dans v4

**Pourquoi exécuter cela ?** Cela garantit que tous vos actifs de planification s'alignent correctement avant de commencer à construire.

#### Conseils de Gestion du Contexte

- **Utilisez des modèles de contexte 200k+** pour de meilleurs résultats (Claude Sonnet 4.5, GPT-4, etc.)
- **Chat frais pour chaque workflow** - Brainstorming, Briefs, Recherche et génération de PRD sont tous intensifs en contexte
- **Pas besoin de fragmentation de document** - Contrairement à v4, vous n'avez pas besoin de diviser les documents
- **Bundles Web disponibles** - Aide à économiser les tokens LLM pour les utilisateurs avec des plans limités ([voir le guide](./bundles-web.md))

### Étape 3 : Commencer à Construire (Phase 4 - Implémentation)

Une fois la planification et l'architecture terminées, vous passerez à la Phase 4. **Important : Chaque workflow ci-dessous doit être exécuté dans un chat frais pour éviter les limitations de contexte et les hallucinations.**

#### 3.1 Initialiser la Planification Sprint

1. **Démarrez un nouveau chat** avec l'**agent SM (Scrum Master)**
2. Attendez que le menu apparaisse
3. Dites à l'agent : "Exécute sprint-planning"
4. Cela crée votre fichier `sprint-status.yaml` qui suit tous les epics et stories

#### 3.2 Créer le Contexte Epic (Optionnel mais Recommandé)

1. **Démarrez un nouveau chat** avec l'**agent SM**
2. Attendez le menu
3. Dites à l'agent : "Exécute epic-tech-context"
4. Cela crée un contexte technique pour l'epic actuel avant de rédiger les stories

#### 3.3 Rédiger Votre Première Story

1. **Démarrez un nouveau chat** avec l'**agent SM**
2. Attendez le menu
3. Dites à l'agent : "Exécute create-story"
4. Cela rédige le fichier de story à partir de l'epic

#### 3.4 Ajouter le Contexte de Story (Optionnel mais Recommandé)

1. **Démarrez un nouveau chat** avec l'**agent SM**
2. Attendez le menu
3. Dites à l'agent : "Exécute story-context"
4. Cela crée un contexte technique spécifique à l'implémentation pour la story

#### 3.5 Implémenter la Story

1. **Démarrez un nouveau chat** avec l'**agent DEV**
2. Attendez le menu
3. Dites à l'agent : "Exécute dev-story"
4. L'agent DEV implémentera la story et mettra à jour le statut du sprint

#### 3.6 Réviser le Code (Optionnel mais Recommandé)

1. **Démarrez un nouveau chat** avec l'**agent DEV**
2. Attendez le menu
3. Dites à l'agent : "Exécute code-review"
4. L'agent DEV effectue une validation de qualité (ceci s'appelait QA dans v4)

### Étape 4 : Continuer

Pour chaque story suivante, répétez le cycle en utilisant **des chats frais** pour chaque workflow :

1. **Nouveau chat** → agent SM → "Exécute create-story"
2. **Nouveau chat** → agent SM → "Exécute story-context"
3. **Nouveau chat** → agent DEV → "Exécute dev-story"
4. **Nouveau chat** → agent DEV → "Exécute code-review" (optionnel mais recommandé)

Après avoir terminé toutes les stories dans un epic :

1. **Démarrez un nouveau chat** avec l'**agent SM**
2. Dites à l'agent : "Exécute retrospective"

**Pourquoi des chats frais ?** Les workflows intensifs en contexte peuvent causer des hallucinations si vous continuez à émettre des commandes dans le même chat. Commencer frais garantit que l'agent a une capacité de contexte maximale pour chaque workflow.

---

## 🤖 Comprendre les Agents

Chaque agent est une persona IA spécialisée :

- **Analyste** - Initialise les workflows et suit la progression
- **PM** - Crée des exigences et spécifications
- **UX-Designer** - Si votre projet a un front-end - ce designer aidera à produire des artefacts, proposer des mises à jour de maquettes et concevoir un excellent look and feel avec vous pour le guider
- **Architecte** - Conçoit l'architecture système
- **SM (Scrum Master)** - Gère les sprints et crée les stories
- **DEV** - Implémente le code et révise le travail

## 🔄 Comment Fonctionnent les Workflows

1. **Chargez un agent** - Ouvrez le fichier d'agent dans votre IDE pour l'activer
2. **Attendez le menu** - L'agent présentera ses workflows disponibles
3. **Dites à l'agent quoi exécuter** - Dites "Exécute [workflow-name]"
4. **Suivez les invites** - L'agent vous guide à travers chaque étape

L'agent crée des documents, pose des questions et vous aide à prendre des décisions tout au long du processus.

## 📊 Fichiers de Suivi de Projet

BMad crée deux fichiers pour suivre votre progression :

**1. bmm-workflow-status.yaml**

- Montre dans quelle phase vous êtes et ce qui vient ensuite
- Créé par workflow-init
- Mis à jour automatiquement au fur et à mesure que vous progressez à travers les phases

**2. sprint-status.yaml** (Phase 4 uniquement)

- Suit tous vos epics et stories pendant l'implémentation
- Critique pour que les agents SM et DEV sachent sur quoi travailler ensuite
- Créé par le workflow sprint-planning
- Mis à jour automatiquement au fur et à mesure que les stories progressent

**Vous n'avez pas besoin de les éditer manuellement** - les agents les mettent à jour au fur et à mesure que vous travaillez.

---

## 🌐 Support Multi-Langue

### Configuration Langue

BMad Method offre une **configuration double langue** unique :

**Langue de Communication** - Comment les agents vous parlent :
```yaml
communication_language: "Français"
```

**Langue de Sortie des Documents** - Langue pour PRD, architecture, code :
```yaml
document_output_language: "Français"  # ou "English"
```

### Exemples

**Tout en Français :**
```yaml
communication_language: "Français"
document_output_language: "Français"
```

**Chat Français, Docs Anglais (Équipes Internationales) :**
```yaml
communication_language: "Français"
document_output_language: "English"
```

Voir le [Guide d'Installation](./installation.md#-configuration-multi-langue) pour plus de détails.

---

## ❓ Questions Courantes

**Q : Ai-je toujours besoin d'architecture ?**
R : Uniquement pour les pistes BMad Method et Enterprise. Les projets Quick Flow passent directement de tech-spec à l'implémentation.

**Q : Puis-je changer mon plan plus tard ?**
R : Oui ! L'agent SM a un workflow "correct-course" pour gérer les changements de portée.

**Q : Et si je veux brainstormer d'abord ?**
R : Chargez l'agent Analyste et dites-lui "Exécute brainstorm-project" avant d'exécuter workflow-init.

**Q : Pourquoi ai-je besoin de chats frais pour chaque workflow ?**
R : Les workflows intensifs en contexte peuvent causer des hallucinations s'ils sont exécutés en séquence. Les chats frais garantissent une capacité de contexte maximale.

**Q : Puis-je sauter workflow-init et workflow-status ?**
R : Oui, une fois que vous apprenez le flux. Utilisez la Référence Rapide à l'Étape 2 pour aller directement aux workflows dont vous avez besoin.

## 💡 Obtenir de l'Aide

- **Pendant les workflows** : Les agents vous guident avec des questions et explications
- **Communauté** : [Discord](https://discord.gg/gk8jAdXWmj) - #general-dev, #bugs-issues
- **Guide complet** : [Documentation BMM](../../src/modules/bmm/docs/README.md)
- **Tutoriels YouTube** : [Chaîne BMad Code](https://www.youtube.com/@BMadCode)

---

## ✅ Points Clés à Retenir

✅ **Utilisez toujours des chats frais** - Chargez les agents dans de nouveaux chats pour chaque workflow pour éviter les problèmes de contexte
✅ **Laissez workflow-status vous guider** - Chargez n'importe quel agent et demandez le statut quand vous n'êtes pas sûr de ce qui vient ensuite
✅ **La piste compte** - Quick Flow utilise tech-spec, BMad Method/Enterprise nécessite PRD et architecture
✅ **Le suivi est automatique** - Les fichiers de statut se mettent à jour eux-mêmes, pas d'édition manuelle nécessaire
✅ **Les agents sont flexibles** - Utilisez les numéros de menu, raccourcis (\*prd) ou langage naturel

**Prêt à commencer à construire ?** Installez BMad, chargez l'Analyste, exécutez workflow-init et laissez les agents vous guider !

---

## 📚 Prochaines Étapes

- 📖 Lire la [Documentation Complète BMM](../../src/modules/bmm/docs/README.md)
- 🎨 Apprendre la [Personnalisation des Agents](../agent-customization-guide.md)
- 🌐 Explorer les [Bundles Web](./bundles-web.md) pour Gemini/GPT
- 🔧 Configurer l'[Intégration IDE](./integration-ide.md)
- 💬 Rejoindre la [Communauté Discord](https://discord.gg/gk8jAdXWmj)
