---
title: "Enquête de code"
description: Comment bmad-investigate traite chaque problème comme une scène d'enquête, classe les preuves et produit un dossier structuré sur lequel les ingénieurs peuvent agir
sidebar:
  order: 6
---

Vous confiez à `bmad-investigate` un journal de plantage, une trace de pile, ou simplement un « ça marchait avant, plus
maintenant ». Le skill prend le relais avec la discipline d'enquête le temps de l'exécution. Il ne se met pas à
corriger. Il ouvre un dossier d'enquête.

Chaque constatation reçoit une note. Chaque hypothèse a un statut. Les fausses pistes sont conservées, pas effacées. Le
livrable est un document qu'un autre ingénieur peut reprendre à froid.

Cette page explique pourquoi l'enquête est une discipline à part entière, et ce que le skill apporte qu'un workflow de
développement classique n'apporte pas.

## Le problème du « débogue, c'est tout »

Le débogage classique mélange trois activités : examiner les preuves, raisonner sur la cause, et modifier le code pour
tester la théorie. Quand elles sont mélangées, deux modes de défaillance apparaissent.

Le premier est le **verrouillage narratif**[^1]. La première histoire plausible devient la théorie de travail, et chaque
observation est tordue pour la confirmer. Le bug reste non corrigé jusqu'à ce que quelqu'un abandonne et reparte de
zéro. Des heures plus tard.

Le second est l'**amnésie probatoire**. Vous avez tracé quelque chose, l'avez écarté, mais n'avez pas écrit pourquoi.
Deux jours plus tard, avec un regard frais, vous le retracez. Pire encore, un collègue reprend le bug et refait la même
impasse que vous aviez déjà éliminée.

La conception du skill est une réponse directe à ces deux modes.

## Classement des preuves

Chaque constatation dans une enquête appartient à l'une de trois catégories.

- **Confirmé.** Directement observé dans les logs, le code ou les dumps ; cité avec une référence spécifique (un
  `chemin:ligne`, un horodatage de log, un hash de commit). Si quelqu'un demande « comment le sais-tu ? », vous pointez
  la citation.
- **Déduit.** Découle logiquement de preuves confirmées ; la chaîne de raisonnement est explicite. Si une étape de la
  chaîne est fausse, la déduction est fausse, et on peut voir précisément quelle étape.
- **Hypothétique.** Plausible mais non confirmé. Énonce quelle preuve confirmerait ou réfuterait, et déclare d'avance ce
  qui le clôturerait. Les hypothèses sont explicitement *non factuelles*.

Le classement n'est pas une posture d'humilité. Il rend le dossier lisible. Un lecteur peut parcourir la section
Confirmé pour savoir ce qui est vrai, la section Déduit pour savoir ce qui en découle, et la section Hypothétique pour
savoir ce qui reste ouvert. Confondre les trois est la première raison pour laquelle les enquêtes dérapent.

## Tête de pont d'abord

L'enquête ne part jamais d'une théorie. Elle part d'une seule preuve confirmée et étend la zone à partir de là. Cette
preuve peut être un message d'erreur précis, une trame de pile, ou une entrée de log horodatée.

C'est l'inverse de la manière dont les enquêtes se déroulent souvent : quelqu'un a une intuition, construit une théorie,
puis cherche les preuves qui la soutiennent. L'intuition peut être correcte ; la *méthode* est fragile parce qu'elle
fait du biais de confirmation[^2] le comportement par défaut.

Une tête de pont est un fait sur lequel vous pouvez revenir quand le raisonnement devient flou. Si une déduction vous
emmène quelque part d'étrange, vous pouvez remonter jusqu'à la tête de pont et essayer une autre branche. Sans elle,
vous ne savez pas quelle étape annuler.

Quand les preuves sont rares, le skill le dit et bascule en exploration guidée par hypothèses : formuler des hypothèses
à partir de ce qui est disponible, identifier ce qui testerait chacune, présenter une liste priorisée de données à
collecter. L'absence de preuve est elle-même une constatation.

## Discipline des hypothèses

Les hypothèses ne sont jamais supprimées du dossier. Quand une preuve en confirme ou en réfute une, son champ **Statut**
passe d'Ouvert à Confirmé ou Réfuté, et une **Résolution** explique quelle preuve a tranché.

Cette règle a un coût réel : les dossiers grossissent. Le bénéfice est réel aussi. L'historique complet du raisonnement
fait partie du livrable. Six mois plus tard, quand un bug similaire surgit, le prochain enquêteur peut lire le dossier
original et voir quelles pistes ont déjà été éliminées et pourquoi. Sans cet historique, chaque nouvel enquêteur refait
les mêmes impasses.

Cela discipline aussi l'enquêteur du présent. Si vous ne pouvez pas supprimer une hypothèse fausse, vous devez la
réfuter avec une preuve citée. L'abandonner discrètement quand elle devient gênante n'est plus une option.

## Remettre en question la prémisse

La description du problème par l'utilisateur est une hypothèse, pas un fait. « Le cache est cassé » est quelque chose
que l'utilisateur *croit*. Avant que le skill ne construise une enquête autour, les affirmations techniques sont
vérifiées de manière indépendante. Si la preuve contredit la prémisse, le rapport le dit directement.

C'est l'instinct de l'enquêteur : le récit du témoin est une donnée, pas la vérité. Parfois le bug rapporté est réel
mais mal étiqueté. Parfois le symptôme décrit est en aval d'une cause différente. Les enquêtes qui prennent la prémisse
pour argent comptant diagnostiquent le mauvais défaut, et le bug revient sous une forme légèrement différente.

## Une marche calibrée

Le skill est une seule procédure, pas deux modes. Il calibre la part d'investigation de défaut versus la part
d'exploration de zone que l'entrée demande, sur une échelle continue.

Un cas piloté par symptôme (un ticket, un plantage, un message d'erreur, un « ça marchait avant ») penche vers le suivi
d'hypothèses, la reconstruction de la chronologie et une direction de correction. Un cas sans symptôme (comprendre un
module avant de le toucher, évaluer la réutilisabilité, bâtir un modèle mental) penche vers la cartographie
entrées/sorties, le filtrage du flux de contrôle et un plan de vérification. La plupart des cas réels se situent quelque
part entre les deux, et le dossier reflète l'équilibre que les preuves ont exigé.

La discipline est la même quel que soit l'endroit de l'échelle où se situe un cas : tête de pont d'abord, classement
des preuves, suivi des hypothèses, jamais effacer. La sortie est toujours
`{implementation_artifacts}/investigations/{slug}-investigation.md`, avec les sections qui ne s'appliquent pas à un cas
laissées vides ou omises.

Quand un bug profond exige de comprendre un sous-système plus large, la procédure intègre en ligne les techniques de
cartographie entrées/sorties, de filtrage du flux de contrôle, de raisonnement à rebours depuis les sorties et de
traçage des frontières inter-composants[^3]. Le modèle de la zone atterrit dans le même dossier. Pas de changement de
mode.

## La méthodologie vit dans le skill

La discipline d'enquête est une propriété du skill lui-même. Quiconque invoque `bmad-investigate` adopte la méthodologie
et le style de communication pour l'exécution : précision clinique, langage centré sur la preuve, pas de prudence
inutile, présentation en dossier de cas. Quand le skill se termine, l'appelant retrouve sa voix d'avant. Pas de
changement de persona, juste un déplacement de ton issu des principes du skill.

Cela compte parce que l'enquête et l'implémentation récompensent des instincts différents. Les enquêteurs sont lents et
précis. Les implémenteurs sont rapides et confiants. Le même cerveau faisant les deux dans une seule session finit par
mal faire les deux. Le skill délimite la posture d'enquête en ligne, sans changement de contexte vers une identité
séparée.

## Ce que vous obtenez

Un fichier d'enquête achevé :

- Sépare les constatations Confirmées (avec citations) des Déductions et des Hypothèses
- Préserve toutes les hypothèses jamais formulées, avec leur Statut final et leur Résolution
- Reconstruit une chronologie des événements à partir de plusieurs sources de preuves
- Identifie les lacunes de données et ce qu'elles résoudraient
- Fournit des conclusions actionnables ancrées dans les preuves
- Inclut un plan de reproduction quand une cause racine est identifiée
- Maintient un backlog d'enquête de pistes encore à explorer

Donnez-le à un ingénieur qui n'était pas là, et il comprend ce qui s'est passé, ce qui est connu, et ce qui reste
incertain. C'est la barre.

## L'idée plus large

La plupart du « débogage par IA » d'aujourd'hui mélange preuves, raisonnement et changements de code en un seul flux de
texte plausible. Le signal est difficile à trouver, les impasses se répètent, et le dossier, s'il en existe un, est un
journal de chat que personne ne veut lire.

`bmad-investigate` traite l'enquête comme une discipline avec son propre livrable. La preuve a une note. Les hypothèses
ont un statut. Les fausses pistes sont documentées, pas effacées. Le dossier survit à la session.

Quand le prochain bug ressemblant à un que vous avez déjà vu apparaîtra, vous aurez un point de départ qui ne sera pas
une invite vide.

## Glossaire

[^1]: **Verrouillage narratif** : phénomène cognitif par lequel un raisonnement adopte la première explication plausible
et l'enrichit progressivement, devenant de plus en plus difficile à abandonner même face à des preuves contraires.
[^2]: **Biais de confirmation** : tendance cognitive à rechercher, interpréter et favoriser les informations qui
confirment des croyances préexistantes, tout en ignorant ou minimisant celles qui les contredisent.
[^3]: **Passage de frontière** : transition entre deux zones d'exécution distinctes (langage, processus, machine,
client/serveur, code/configuration). Les frontières concentrent les bugs car chaque côté suppose que l'autre s'est
comporté comme documenté.
