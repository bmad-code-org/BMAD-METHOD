---
title: "Enquête de code"
description: Comment Tracy traite chaque problème comme une scène d'enquête, classe les preuves et produit un dossier structuré sur lequel les ingénieurs peuvent agir
sidebar:
  order: 6
---

Vous confiez à Tracy un journal de plantage, une trace de pile, ou simplement un « ça marchait avant, plus maintenant ». Elle ne se met pas à corriger. Elle ouvre un dossier d'enquête.

Chaque constatation reçoit une note. Chaque hypothèse a un statut. Les fausses pistes sont conservées, pas effacées. Le livrable est un document qu'un autre ingénieur peut reprendre à froid.

Cette page explique pourquoi l'enquête est une discipline à part entière, et ce que cela vous apporte qu'un workflow de développement classique n'apporte pas.

## Le problème du « débogue, c'est tout »

Le débogage classique mélange trois activités : examiner les preuves, raisonner sur ce qui pourrait avoir causé le symptôme, et modifier le code pour voir si le symptôme disparaît. Quand elles sont mélangées, deux modes de défaillance apparaissent.

Le premier est le **verrouillage narratif**[^1]. La première histoire plausible devient la théorie de travail, et chaque observation suivante est tordue pour la confirmer. Le bug reste non corrigé jusqu'à ce que quelqu'un abandonne l'histoire et reparte de zéro. Des heures plus tard.

Le second est l'**amnésie probatoire**. Vous avez tracé quelque chose, l'avez écarté, mais n'avez pas écrit pourquoi. Deux jours plus tard, avec un regard frais, vous le retracez. Pire encore, un collègue reprend le bug et refait la même impasse que vous aviez déjà éliminée.

La conception de Tracy est une réponse directe à ces deux modes.

## Classement des preuves

Chaque constatation dans une enquête appartient à l'une de trois catégories :

- **Confirmé.** Directement observé dans les logs, le code ou les dumps ; cité avec une référence spécifique (un `chemin:ligne`, un horodatage de log, un hash de commit). Si quelqu'un demande « comment le sais-tu ? », vous pointez la citation.
- **Déduit.** Découle logiquement de preuves confirmées ; la chaîne de raisonnement est explicite. Si une étape de la chaîne est fausse, la déduction est fausse, et on peut voir précisément quelle étape.
- **Hypothétique.** Plausible mais non confirmé ; énonce quelle preuve confirmerait ou réfuterait. Les hypothèses sont explicitement *non factuelles*, et elles déclarent d'avance ce qui les clôturerait.

Le classement n'est pas une posture d'humilité. Il rend le dossier lisible. Un lecteur peut parcourir la section Confirmé pour savoir ce qui est vrai, la section Déduit pour savoir ce qui en découle, et la section Hypothétique pour savoir ce qui reste ouvert. Confondre les trois est la première raison pour laquelle les enquêtes dérapent.

## Tête de pont d'abord

Tracy ne part jamais d'une théorie. Elle part d'une seule preuve confirmée et étend la zone à partir de là. Cette preuve peut être un message d'erreur précis, une trame de pile, ou une entrée de log horodatée.

C'est l'inverse de la manière dont les enquêtes se déroulent souvent : quelqu'un a une intuition, construit une théorie, puis cherche les preuves qui la soutiennent. L'intuition peut être correcte ; la *méthode* est fragile parce qu'elle fait du biais de confirmation[^2] le comportement par défaut.

Une tête de pont est un fait sur lequel vous pouvez revenir quand le raisonnement devient flou. Si une déduction vous emmène quelque part d'étrange, vous pouvez remonter jusqu'à la tête de pont et essayer une autre branche. Sans elle, vous ne savez pas quelle étape annuler.

Quand les preuves sont rares (pas d'archive de diagnostic, peu de logs, description vague), Tracy le dit explicitement et bascule en exploration guidée par hypothèses : formuler des hypothèses à partir de ce qui est disponible, identifier quelles preuves testeraient chacune, et présenter à l'utilisateur une liste priorisée de données à collecter. L'absence de preuve est elle-même une constatation.

## Discipline des hypothèses

Les hypothèses ne sont jamais supprimées du dossier. Quand une preuve en confirme ou en réfute une, son champ **Statut** passe d'Ouvert à Confirmé ou Réfuté, et une **Résolution** explique quelle preuve a tranché.

Cette règle a un coût réel : les dossiers grossissent. Le bénéfice est réel aussi. L'historique complet du raisonnement fait partie du livrable. Six mois plus tard, quand un bug similaire surgit, le prochain enquêteur peut lire le dossier original et voir quelles pistes ont déjà été éliminées et pourquoi. Sans cet historique, chaque nouvel enquêteur refait les mêmes impasses.

Cela discipline aussi l'enquêteur du présent. Si vous ne pouvez pas supprimer une hypothèse fausse, vous devez réellement la réfuter avec une preuve citée, au lieu de l'abandonner discrètement parce qu'elle est devenue gênante.

## Remettre en question la prémisse

La description du problème par l'utilisateur est une hypothèse, pas un fait. « Le cache est cassé » est quelque chose que l'utilisateur *croit*. Avant que Tracy ne construise une enquête autour, elle vérifie les affirmations techniques de manière indépendante. Si la preuve contredit la prémisse, elle le dit directement.

C'est l'instinct de l'enquêteur : le récit du témoin est une donnée, pas la vérité. Parfois le bug rapporté est réel mais mal étiqueté. Parfois le symptôme décrit est en aval d'une cause entièrement différente. Les enquêtes qui prennent la prémisse pour argent comptant diagnostiquent souvent le mauvais défaut, et le bug revient sous une forme de surface légèrement différente.

## Deux modes, une discipline

Tracy embarque deux skills :

- **`bmad-investigate`** (`IN`). Il y a un symptôme. Un ticket, un plantage, un message d'erreur, un « ça marchait avant ». Le livrable est un fichier d'enquête structuré dans `{implementation_artifacts}/investigations/{slug}-investigation.md` avec une cause racine (ou l'hypothèse la plus prometteuse avec ses lacunes documentées), une direction de correction, et un plan de reproduction.

- **`bmad-code-archaeology`** (`CX`). Il n'y a pas de symptôme. Vous devez comprendre un module avant de le toucher, évaluer si quelque chose est réutilisable, ou bâtir un modèle mental d'un sous-système peu familier. Le livrable est un fichier d'archéologie avec le contrat d'entrées/sorties de la zone, les transitions d'état clés, les passages de frontière[^3], et un plan de vérification.

La discipline est la même dans les deux : tête de pont d'abord, classement des preuves, suivi des hypothèses, jamais effacer. Seule la forme du livrable diffère.

Quand l'enquête d'un bug profond exige de comprendre un sous-système plus large, `bmad-investigate` ne change pas de skill. Sa phase de trace de code source intègre les techniques d'archéologie en ligne (cartographie entrées/sorties, filtrage du flux de contrôle, raisonnement à rebours depuis les sorties, traçage des frontières inter-composants) et écrit le modèle de la zone dans le même dossier. Le skill autonome `bmad-code-archaeology` existe pour le cas sans bug, où l'exploration est l'objectif.

## Deux chemins en aval

Une investigation produit une direction de correction, et cette direction a deux destinations naturelles en aval.

- **Petite correction.** Le dossier de cas alimente `bmad-quick-dev`. Le parcours Quick Flow est déjà câblé pour ça. Tracy diagnostique, Amelia implémente.
- **Réécriture systémique.** Quand l'investigation fait surgir quelque chose de plus grand qu'une correction localisée (une hypothèse architecturale qui s'est cassée, un problème de flux de données entre composants, une zone héritée qui demande un refactor ciblé), le dossier de cas devient l'entrée de `bmad-create-prd` (Phase 2). Les conclusions à preuve graduée, le plan de reproduction et la chronologie de l'investigation sont exactement les contraintes qu'un PRD doit capturer.

Tracy ne décide pas du chemin. La direction de correction dans la conclusion le fait. Les conclusions triviales vont vers le Quick Flow. Les conclusions non triviales qui touchent plusieurs composants ou déplacent une décision architecturale vont vers la phase de planification.

## Tracy et Amelia

Amelia livre du code. Tracy enquête. Elles ne se chevauchent pas.

Quand un dossier conclut, Tracy s'arrête à l'identification de la cause racine et d'une direction de correction. Elle n'implémente pas. Le passage à Amelia est explicite : un dossier qu'Amelia peut lire, une direction de correction qu'elle peut cadrer en story, et un plan de reproduction qu'elle peut vérifier. Si la correction est vraiment triviale (un décalage d'un cran[^4], une vérification null manquante), Tracy note la direction dans le rapport. Elle n'applique toujours pas le changement.

Cette séparation compte parce que l'enquête et l'implémentation récompensent des instincts différents. Le métier d'un enquêteur est d'être lent et précis ; celui d'un implémenteur est d'être rapide et confiant. Le même cerveau, dans la même session, faisant les deux, finit par mal faire les deux.

## Ce que vous obtenez

Un fichier d'enquête achevé :

- Sépare les constatations Confirmées (avec citations) des Déductions et des Hypothèses
- Préserve toutes les hypothèses jamais formulées, avec leur Statut final et leur Résolution
- Reconstruit une chronologie des événements à partir de plusieurs sources de preuves
- Identifie les lacunes de données et ce qu'elles résoudraient
- Fournit des conclusions actionnables ancrées dans les preuves
- Inclut un plan de reproduction quand une cause racine est identifiée
- Maintient un backlog d'enquête de pistes encore à explorer

Donnez-le à un ingénieur qui n'était pas là, et il comprend ce qui s'est passé, ce qui est connu, et ce qui reste incertain. C'est la barre.

## L'idée plus large

La plupart du « débogage par IA » d'aujourd'hui mélange preuves, raisonnement et changements de code en un seul flux indissociable de texte plausible. Le signal est difficile à trouver, les impasses se répètent, et le dossier, s'il en existe un, est un journal de chat que personne ne veut lire.

Tracy traite l'enquête comme une discipline avec son propre livrable. La preuve a une note. Les hypothèses ont un statut. Les fausses pistes sont documentées, pas effacées. Le dossier survit à la session.

Quand le prochain bug ressemblant à un que vous avez déjà vu apparaîtra, vous aurez un point de départ qui ne sera pas une invite vide.

## Glossaire

[^1]: **Verrouillage narratif** : phénomène cognitif par lequel un raisonnement adopte la première explication plausible et l'enrichit progressivement, devenant de plus en plus difficile à abandonner même face à des preuves contraires.
[^2]: **Biais de confirmation** : tendance cognitive à rechercher, interpréter et favoriser les informations qui confirment des croyances préexistantes, tout en ignorant ou minimisant celles qui les contredisent.
[^3]: **Passage de frontière** : transition entre deux zones d'exécution distinctes (langage, processus, machine, client/serveur, code/configuration). Les frontières concentrent les bugs car chaque côté suppose que l'autre s'est comporté comme documenté.
[^4]: **Décalage d'un cran (off-by-one)** : erreur classique d'indexation où une boucle ou un calcul s'écarte d'une unité de la valeur correcte (par exemple, `<=` au lieu de `<`).
