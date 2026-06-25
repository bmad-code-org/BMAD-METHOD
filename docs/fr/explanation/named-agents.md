---
title: "Agents nommés"
description: Pourquoi les agents BMad ont des noms, des personas et des options de personnalisation — et ce que cela permet par rapport aux alternatives basées sur des menus ou des prompts
sidebar:
  order: 1
---

Vous dites « Hey Mary, brainstormons » et Mary s’active. Elle vous salue par votre nom, dans la langue que vous avez configurée, avec son persona distinctif. Elle vous rappelle que `bmad-help` est toujours disponible. Puis elle saute le menu et se lance directement dans le brainstorming — parce que votre intention était claire.

Cette page explique ce qui se passe réellement et pourquoi BMad est conçu ainsi.

## Le tabouret à trois pieds

Le modèle d’agent de BMad repose sur trois primitives qui s’articulent :

| Primitive            | Ce qu’elle apporte                                                                                                                                                                      | Où elle se trouve                                                                                                      |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| **Skill**            | Capacité — une chose distincte que l’assistant peut faire (brainstormer, rédiger un PRD, implémenter une story)                                                                         | `.claude/skills/{skill-name}/SKILL.md` (ou l’équivalent de votre IDE)                                                  |
| **Agent nommé**      | Continuité du persona — une identité reconnaissable qui englobe un menu de skills associés avec une voix, des principes et des repères visuels cohérents                                | Skills dont le répertoire commence par `bmad-agent-*`                                                                  |
| **Personnalisation** | Rendre le système vôtre — des overrides qui remodèlent le comportement d’un agent, ajoutent des intégrations MCP, remplacent des templates, intègrent les conventions de l’organisation | `_bmad/custom/{skill-name}.toml` (overrides d’équipe, versionnés dans git) et `.user.toml` (personnel, ignoré par git) |

Retirez l’un des pieds et l’expérience s’effondre :

- Skills sans agents → des listes de capacités que l’utilisateur doit parcourir par nom ou par code
- Agents sans skills → des personas sans rien à faire
- Pas de personnalisation → chaque utilisateur reçoit le même comportement par défaut, obligeant à forker pour tout besoin spécifique à l’organisation

## Ce que les agents nommés vous apportent

BMad embarque six agents nommés, chacun ancré à une phase de la méthode BMad :

| Agent                              | Phase          | Module                                                                                                                  |
|------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------|
| 📊 **Mary**, Analyste d’affaires   | Analyse        | étude de marché, brainstorming, product briefs, PRFAQs                                                                   |
| 📚 **Paige**, Rédactrice technique | Analyse        | documentation de projet, diagrammes, validation de docs                                                                  |
| 📋 **John**, Chef de produit       | Planification  | création de PRD, décomposition epic/story, vérification de la préparation à l’implémentation                             |
| 🎨 **Sally**, Designer UX          | Planification  | spécifications de design UX                                                                                              |
| 🏗️ **Winston**, Architecte système  | Solutioning    | architecture technique, vérifications d’alignement                                                                     |
| 💻 **Amelia**, Ingénieure senior   | Implémentation | exécution de stories, quick-dev, revue de code, planification de sprint  |

Chacun possède une identité codée en dur (nom, titre, domaine) et une couche personnalisable (rôle, principes, style de communication, icône, menu). Vous pouvez réécrire les principes de Mary ou ajouter des éléments de menu ; vous ne pouvez pas la renommer — c’est délibéré. La reconnaissance de marque persiste après personnalisation pour que « hey Mary » active toujours l’analyste, indépendamment de la façon dont une équipe a façonné son comportement.

## Le flux d’activation

Quand vous invoquez un agent nommé, huit étapes s’exécutent dans l’ordre :

1. **Résoudre le bloc agent** — fusionner le `customize.toml` livré avec les overrides d’équipe et personnels, via un résolveur Python utilisant `tomllib` de la bibliothèque standard
2. **Exécuter les étapes préliminaires** — tout comportement préalablement configuré par l’équipe
3. **Adopter le persona** — identité codée en dur ainsi que rôle personnalisé, style de communication, principes
4. **Charger les faits persistants** — règles d’organisation, notes de conformité, éventuellement des fichiers chargés via un préfixe `file:` (ex. `file:{project-root}/docs/project-context.md`)
5. **Charger la configuration** — nom d’utilisateur, langue de communication, langue de sortie, chemins des artefacts
6. **Saluer** — personnalisé, dans la langue configurée, avec le préfixe emoji de l’agent pour identifier d’un coup d’œil qui parle
7. **Exécuter les étapes de finalisation** — toute configuration post-salutation que l’équipe a définie
8. **Aiguiller ou présenter le menu** — si votre message d’ouverture correspond à un élément de menu, aller directement ; sinon afficher le menu et attendre une saisie

L’étape 8, c’est là que la magie opère. « Hey Mary, brainstormons » évite l’affichage du menu parce que `bmad-brainstorming` correspond évidemment à `BP` dans le menu de Mary. Si vous dites quelque chose d’ambigu, elle demande une fois, brièvement, sans en faire un rituel de confirmation. Si rien ne correspond, elle poursuit la conversation normalement.

## Pourquoi pas simplement un menu ?

Les menus obligent l’utilisateur à aller chercher l’outil. Vous devez retenir que le brainstorming se trouve sous le code `BP` chez l’agent analyste, pas chez l’agent PM, et savoir quel persona possède quelles capacités. C’est une charge cognitive que l’outil vous fait porter.

Les agents nommés inversent la logique. Vous dites ce que vous voulez, à qui, avec les mots qui vous semblent naturels. L’agent sait qui il est et ce qu’il fait. Quand votre intention est suffisamment claire, il agit simplement.

Le menu reste disponible comme solution de secours — affiché quand vous explorez, ignoré quand ce n’est pas le cas.

## Pourquoi pas simplement un prompt libre ?

Les prompts libres supposent que vous connaissez les mots magiques. « Aide-moi à brainstormer » pourrait fonctionner, mais « explorons mon idée de SaaS » pourrait ne pas fonctionner, et les résultats dépendent de la façon dont vous avez formulé la demande. Vous devenez responsable de l’ingénierie du prompt.

Les agents nommés ajoutent de la structure sans restreindre la liberté. Le persona reste cohérent, les capacités sont découvrables, et `bmad-help` est toujours à portée de commande. Vous n’avez pas à deviner ce que l’agent peut faire, et vous n’avez pas besoin d’un manuel pour l’utiliser non plus.

## La personnalisation comme principe fondamental

Le modèle de personnalisation est ce qui permet à tout cela de passer à l’échelle au-delà d’un seul développeur.

Chaque agent embarque un fichier `customize.toml` avec des valeurs par défaut judicieuses. Les équipes versionnent des overrides dans `_bmad/custom/bmad-agent-{role}.toml`. Les individus peuvent superposer des préférences personnelles dans `.user.toml` (ignoré par git). Le résolveur fusionne les trois couches à l’activation avec des règles structurelles prévisibles.

La plupart des utilisateurs ne rédigent jamais ces fichiers à la main. Le skill `bmad-customize` guide le choix de la cible, la sélection du périmètre agent vs workflow, la rédaction de l’override et la vérification de la fusion — pour que la surface de personnalisation reste accessible à quiconque comprend son intention, pas seulement à ceux qui maîtrisent le TOML.

Exemple concret : une équipe versionne dans git un seul fichier demandant à Amelia d’utiliser systématiquement l’outil MCP Context7 pour la documentation des bibliothèques et de se rabattre sur Linear quand une story n’est pas dans la liste locale des epics. Chaque workflow de développement qu’Amelia lance (dev-story, quick-dev, create-story, code-review) hérite de ce comportement, sans modification du code ni duplication par workflow.

Il existe aussi une seconde surface de personnalisation pour les préoccupations *transversales* : la configuration centrale `_bmad/config.toml` et `_bmad/config.user.toml` (tous deux gérés par l’installateur, reconstruits à partir du `module.yaml` de chaque module) plus `_bmad/custom/config.toml` (équipe, versionné dans git) et `_bmad/custom/config.user.toml` (personnel, ignoré par git) pour les overrides. C’est là que se trouve le **registre des agents** — les descripteurs légers que les consommateurs du registre comme `bmad-party-mode`, `bmad-retrospective` et `bmad-advanced-elicitation` lisent pour savoir qui est disponible et comment l’incarner. Redéfinissez l’image d’un agent pour toute l’organisation avec un override d’équipe ; ajoutez des personnages fictifs (Kirk, Spock, un persona expert du domaine) comme expériences personnelles via l’override `.user.toml` — sans toucher aucun dossier de skill. Le fichier par skill façonne la façon dont Mary *se comporte* quand elle s’active ; la configuration centrale façonne la façon dont les autres skills *la perçoivent* quand ils consultent le registre.

Pour la surface de personnalisation complète et des exemples concrets, consultez :

- [Comment personnaliser BMad](../how-to/customize-bmad.md) — la référence sur ce qui est personnalisable et comment fonctionne la fusion
- [Comment étendre BMad pour votre organisation](../how-to/expand-bmad-for-your-org.md) — six recettes pratiques couvrant les règles globales des agents, les conventions de workflow, la publication externe, les remplacements de templates et la personnalisation du registre des agents
- Skill `bmad-customize` — l’assistant de rédaction guidée qui transforme une intention en fichier d’override correctement placé et vérifié

## L’idée plus grande

La plupart des assistants IA aujourd’hui sont soit des menus, soit des prompts, et les deux déplacent la charge cognitive vers l’utilisateur. Les agents nommés associés à des skills personnalisables vous permettent de parler à un coéquipier qui connaît déjà le travail, et laissent votre organisation façonner ce coéquipier sans forker.

La prochaine fois que vous tapez « Hey Mary, brainstormons » et qu’elle se met directement au travail, remarquez ce qui ne s’est pas produit. Il n’y a eu ni commande slash, ni menu à parcourir, ni rappel maladroit de ce qu’elle peut faire. Cette absence, c’est le design.
