---
title: "Checkpoint Preview"
description: Revue assistée par LLM, avec intervention humaine, qui vous guide à travers une modification, de son objectif jusqu’aux détails
sidebar:
  order: 4
---

`bmad-checkpoint-preview` est un workflow de revue interactif, assisté par LLM, avec intervention humaine. Il vous guide à travers une modification de code — de l'intention et du contexte jusqu'aux détails — afin que vous puissiez prendre une décision éclairée sur la mise en production, la refonte ou l'approfondissement.

![Diagramme du workflow Checkpoint Preview](/diagrams/checkpoint-preview-diagram-fr.webp)

## Le Flux Typique

Vous lancez `bmad-quick-dev`. Il clarifie votre intention, construit une spécification, implémente la modification, et une fois terminé, il ajoute un historique de revue au fichier de spécification et l'ouvre dans votre éditeur. Vous regardez la spec et constatez que la modification a touché 20 fichiers dans plusieurs modules.

Vous pourriez survoler le diff. Mais 20 fichiers, c'est le moment où le survol commence à échouer — on perd le fil, on rate un lien entre deux modifications éloignées, ou on approuve quelque chose qu'on n'a pas pleinement compris. Alors au lieu de cela, vous dites « checkpoint » et le LLM vous guide à travers la modification.

Ce passage de relais — de l'implémentation autonome au jugement humain — est le cas d'usage principal. Quick-dev s'exécute longtemps avec une supervision minimale. Checkpoint Preview, c'est là où vous reprenez le volant.

## Pourquoi

La revue de code a deux modes d'échec. Dans le premier, le réviseur survole le diff, rien ne saute aux yeux, et il approuve. Dans le second, il lit méthodiquement chaque fichier mais perd le fil — il voit les arbres et rate la forêt. Les deux aboutissent au même résultat : la revue n'a pas repéré ce qui comptait.

Le problème sous-jacent est le séquençage. Un diff brut présente les modifications dans l'ordre des fichiers, ce qui est presque jamais l'ordre qui construit la compréhension. Vous voyez une fonction utilitaire avant de savoir pourquoi elle existe. Vous voyez une modification de schéma avant de comprendre quelle fonctionnalité elle supporte. Le réviseur doit reconstruire l'intention de l'auteur à partir d'indices dispersés, et c'est cette reconstruction qui fait défaut à l'attention.

Checkpoint Preview résout ce problème en confiant le travail de reconstruction au LLM. Il lit le diff, la spécification (si elle existe) et la base de code environnante, puis présente la modification dans un ordre conçu pour la compréhension — et non pour `git diff`.

## Comment ça fonctionne

Le workflow comporte cinq étapes. Chaque étape s'appuie sur la précédente, passant progressivement de « qu'est-ce que c'est ? » à « devons-nous publier ça ? »

### 1. Orientation

Le workflow identifie la modification (à partir d'une PR, d'un commit, d'une branche, d'un fichier de spécification ou de l'état git actuel) et produit un résumé d'intention en une ligne ainsi que des statistiques de surface : fichiers modifiés, modules touchés, lignes de logique, dépassements de boundaries et nouvelles interfaces publiques.

C'est le moment « est-ce bien ce que je crois ? ». Avant de lire le moindre code, le réviseur confirme qu'il regarde la bonne chose et calibre ses attentes quant à la portée.

### 2. Visite guidée

La modification est organisée par **préoccupation** — des intentions de conception cohérentes comme « validation des entrées » ou « contrat d'API » — et non par fichier. Chaque préoccupation fait l'objet d'une courte explication du *pourquoi* de cette approche, suivie d'arrêts cliquables `chemin:ligne` que le réviseur peut suivre dans le code.

C'est l'étape du jugement de conception. Le réviseur évalue si l'approche est adaptée au système, et non si le code est correct. Les préoccupations sont séquencées de haut en bas : l'intention de plus haut niveau en premier, puis l'implémentation de support. Le réviseur ne rencontre jamais une référence à quelque chose qu'il n'a pas encore vu.

### 3. Passage en revue des détails

Une fois que le réviseur comprend la conception, le workflow met en évidence 2 à 5 endroits où une erreur aurait l’impact le plus important. Ceux-ci sont étiquetés par catégorie de risque — `[auth]`, `[schéma]`, `[facturation]`, `[API publique]`, `[sécurité]`, et d'autres — et ordonnés selon l'impact en cas d'erreur.

Ce n'est pas une chasse aux bugs. Les tests automatisés et la CI gèrent la correction. Le passage en revue des détails active la conscience du risque : « voici les endroits où se tromper coûte le plus cher ». Si le réviseur veut approfondir un domaine spécifique, il peut dire « approfondis [domaine] » pour une re-revue ciblée axée sur la correction.

Si la spécification a passé des boucles de revues contradictoires (machine hardening), ces résultats sont également présentés ici — pas les bugs qui ont été corrigés, mais les décisions que la boucle de revue a signalées et dont le réviseur devrait être conscient.

### 4. Tests

Propose 2 à 5 façons d'observer manuellement la modification en action. Pas des commandes de test automatisé — des observations manuelles qui renforcent la confiance au-delà de ce que toute suite de tests peut fournir. Une interaction UI à essayer, une commande CLI à lancer, une requête API à envoyer, avec les résultats attendus pour chacune.

Si la modification n'a aucun comportement visible par l'utilisateur, il le dit. Pas de travail inventé.

### 5. Conclusion

Le réviseur prend la décision : approuver, retravailler ou continuer la discussion. S'il approuve une PR, le workflow peut aider avec `gh pr review --approve`. S'il demande une refonte, il aide à diagnostiquer si le problème vient de l'approche, de la spécification ou de l'implémentation, et aide à rédiger un retour actionnable lié à des emplacements de code spécifiques.

## C'est une conversation, pas un rapport

Le workflow présente chaque étape comme un point de départ, pas un mot final. Entre les étapes — ou au milieu d'une — vous pouvez parler au LLM, poser des questions, remettre en question son cadrage ou faire appel à d'autres skills pour obtenir une perspective différente :

- **« lance l'élicitation avancée sur la gestion des erreurs »** — pousse le LLM à reconsidérer et affiner son analyse d'un domaine spécifique
- **« active le party mode sur la sécurité de cette migration de schéma »** — fait intervenir plusieurs perspectives agentiques dans un débat ciblé
- **« lance la revue de code »** — génère des résultats structurés avec analyse adversariale et cas limites

Le workflow checkpoint ne vous enferme pas dans un chemin linéaire. Il vous donne de la structure quand vous la souhaitez et s'efface quand vous voulez explorer. Les cinq étapes sont là pour s'assurer que vous voyez le tableau complet, mais la profondeur à laquelle vous allez à chaque étape — et les outils que vous y apportez — est entièrement entre vos mains.

## L'historique de revue

L'étape de visite guidée fonctionne mieux lorsqu'elle dispose d'un **ordre de revue suggéré** — une liste d'arrêts que l'auteur de la spécification a rédigée pour guider les réviseurs à travers la modification. Lorsqu'une spécification inclut cet ordre, le workflow l'utilise directement.

Lorsqu'aucun historique produit par l'auteur n'existe, le workflow en génère un à partir du diff et du contexte de la base de code. Un historique généré est de qualité inférieure à un historique produit par l'auteur, mais nettement supérieur à la lecture des modifications dans l'ordre des fichiers.

## Quand l'utiliser

Le scénario principal est le passage de relais depuis `bmad-quick-dev` : l'implémentation est terminée, le fichier de spécification est ouvert dans votre éditeur avec un historique de revue ajouté, et vous devez décider si vous publiez. Dites « checkpoint » et c'est parti.

Il fonctionne aussi de manière autonome :

- **Revue d'une PR** — surtout celles avec plus de quelques fichiers ou des modifications transversales
- **Prise en main d'une modification** — quand vous devez comprendre ce qui s'est passé sur une branche que vous n'avez pas écrite
- **Revue de sprint** — le workflow peut récupérer les stories marquées `review` dans votre fichier de statut de sprint

Invoquez-le en disant « checkpoint » ou « guide-moi à travers cette modification ». Il fonctionne dans n'importe quel terminal, mais vous en tirerez plus de parti dans un IDE — VS Code, Cursor ou similaire — car le workflow produit des références `chemin:ligne` à chaque étape. Dans un terminal intégré à un IDE, celles-ci sont cliquables, ce qui vous permet de sauter de fichier en fichier en suivant l'historique de revue.

## Ce que ce n'est pas

Checkpoint Preview ne remplace pas la revue automatisée. Il ne lance pas de linters, de vérificateurs de types ou de suites de tests. Il n'attribue pas de scores de sévérité et ne produit pas de verdicts pass/échec. C'est un guide de lecture qui aide un humain à appliquer son jugement là où cela compte le plus.
