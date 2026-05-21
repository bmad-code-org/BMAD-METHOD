---
title: "Enquête de code"
description: Comment bmad-investigate traite chaque problème comme une scène de crime, classe les preuves et produit un dossier structuré sur lequel les ingénieurs peuvent agir
sidebar:
  order: 10
---

Vous confiez à `bmad-investigate` un journal de plantage, une stack trace, ou simplement un « ça marchait avant, plus
maintenant ». Le skill prend le relais et applique la rigueur d’un enquêteur pendant toute son exécution. Il ne se lance pas dans
la correction. Il ouvre un dossier d’enquête.

Chaque constatation est classée. Chaque hypothèse a un statut. Les fausses pistes sont conservées, pas effacées. Le
livrable est un document qu’un autre ingénieur peut reprendre à froid.

Cette page explique pourquoi l’enquête est une discipline à part entière, et ce que le skill apporte de plus qu’un flux de
développement classique.

## Le problème avec « il suffit de déboguer »

Le débogage classique mélange trois activités : examiner les preuves, raisonner sur la cause, et modifier le code pour
tester la théorie. Quand elles sont mélangées, deux modes de défaillance apparaissent.

Le premier est le **verrouillage narratif**[^1]. Le premier scénario plausible devient la théorie de travail, et chaque
observation est déformée pour s’y ajuster. Le bug persiste jusqu’à ce que quelqu’un abandonne et reparte de zéro. Des
heures plus tard.

Le second est l’**amnésie des preuves**. Vous avez suivi une piste, l’avez écartée, mais n’avez pas écrit pourquoi. Deux
jours plus tard, avec un regard frais, vous la suivez à nouveau. Pire encore, un collègue reprend le bug et suit
à nouveau la même fausse piste que vous aviez déjà écartée.

La conception du skill est une réponse directe à ces deux modes.

## Classement des preuves

Chaque constatation dans une enquête appartient à l’une de trois catégories.

- **Confirmé.** Directement observée dans les logs, le code ou les dumps ; citée avec une référence spécifique (un
  `chemin:ligne`, un horodatage de log, un hash de commit). Si quelqu’un demande « comment le savez-vous ? », vous indiquez
  la référence.
- **Déduit.** Découle logiquement de preuves confirmées ; la chaîne de raisonnement est explicite. Si une étape de la
  chaîne est fausse, la déduction est fausse, et on peut voir précisément laquelle.
- **Hypothétique.** Plausible mais non confirmé. Précise quelle preuve la confirmerait ou la réfuterait, et indique à
  l’avance ce qui permettrait de la clore. Les hypothèses sont explicitement *des suppositions, pas des faits*.

Le classement n’est pas là par modestie. Il rend le dossier lisible. Un lecteur peut parcourir la section
**Confirmé** pour savoir ce qui est vrai, la section **Déduit** pour savoir ce qui en découle, et la section **Hypothétique** pour
savoir ce qui reste ouvert. Confondre les trois est la raison la plus fréquente pour laquelle les enquêtes dérapent.

## Point d’ancrage d’abord

L’enquête ne part jamais d’une théorie. Elle part d’une seule preuve confirmée et s’étend à partir de là. Cette
preuve peut être un message d’erreur précis, une stack trace, ou une entrée de log horodatée.

C’est l’inverse du déroulement habituel des enquêtes : quelqu’un a une intuition, construit une théorie,
puis cherche les preuves qui la soutiennent. L’intuition peut être correcte ; la *méthode* est fragile parce qu’elle
transforme le biais de confirmation[^2] en comportement par défaut.

Un point d’ancrage est un fait sur lequel vous pouvez revenir quand le raisonnement devient flou. Si une déduction vous
mène à une conclusion inattendue, vous pouvez remonter au point d’ancrage et essayer une autre branche. Sans point
d’ancrage, vous ne savez pas quelle étape annuler.

Quand les preuves sont rares, le skill le signale et bascule en exploration guidée par hypothèses : formuler des hypothèses
à partir de ce qui est disponible, identifier ce qui testerait chacune, présenter une liste priorisée de données à
collecter. L’absence de preuve est elle-même un constat.

## Discipline des hypothèses

Les hypothèses ne sont jamais supprimées du dossier. Quand une preuve en confirme ou en réfute une, son champ **Statut**
passe d’Ouvert à Confirmé ou Réfuté, et une **Résolution** explique quelle preuve a tranché.

Cette règle a un coût réel : les dossiers grossissent. Le bénéfice est tout aussi réel. L’historique complet du raisonnement
fait partie du livrable. Six mois plus tard, quand un bug similaire surgit, le prochain enquêteur peut lire le dossier
original et voir quelles pistes ont déjà été éliminées et pourquoi. Sans cet historique, chaque nouvel enquêteur reprend
les mêmes fausses pistes.

Cela discipline aussi l’enquêteur sur le moment. Si vous ne pouvez pas supprimer une hypothèse fausse, vous devez la
réfuter avec une preuve citée. L’abandonner discrètement quand elle devient gênante n’est plus une option.

## Remettre en question la prémisse

La description du problème par l’utilisateur est une hypothèse, pas un fait. « Le cache est cassé » est ce
que l’utilisateur *croit*. Avant que le skill ne construise une enquête autour de cette prémisse, les affirmations
techniques sont vérifiées de manière indépendante. Si la preuve contredit la prémisse, le rapport le signale sans détour.

C’est l’instinct de l’enquêteur : le récit du témoin est une donnée, pas la vérité. Parfois le bug rapporté est réel
mais mal étiqueté. Parfois le symptôme décrit est en aval d’une cause différente. Les enquêtes qui prennent la prémisse
pour argent comptant diagnostiquent le mauvais problème, et le bug revient sous une forme légèrement différente.

## Une approche calibrée

Le skill est une seule procédure, pas deux modes. Il ajuste en continu l’équilibre entre la recherche du défaut et l’exploration du code
environnant, selon ce que le cas requiert.

Un cas orienté symptôme (un ticket, un plantage, un message d’erreur, un « ça marchait avant ») penche vers le suivi
d’hypothèses, la reconstruction de la chronologie et une piste de correction. Un cas sans symptôme (comprendre un
module avant de le toucher, évaluer la réutilisabilité, bâtir un modèle mental) penche vers la cartographie
entrées/sorties, le filtrage du flux de contrôle et un plan de vérification. La plupart des cas réels se situent quelque
part entre les deux, et le dossier reflète l’équilibre que les preuves ont exigé.

La discipline est la même quel que soit le positionnement du cas sur l’échelle : point d’ancrage d’abord, classement
des preuves, suivi des hypothèses, rien n’est jamais effacé. La sortie est toujours
`{implementation_artifacts}/investigations/{slug}-investigation.md`, les sections non
pertinentes étant laissées vides ou omises.

Quand un bug profond exige de comprendre un sous-système plus large, la procédure intègre directement les techniques de
cartographie entrées/sorties, de filtrage du flux de contrôle, de raisonnement à rebours depuis les sorties et de
traçage des frontières inter-composants[^3]. La modélisation de la zone explorée figure dans le même dossier. Pas de changement de
mode.

## La méthodologie réside dans le skill

La discipline d’enquête est une propriété du skill lui-même. Quiconque invoque `bmad-investigate` adopte la méthodologie
et le style de communication pendant l’exécution : précision clinique, langage centré sur la preuve, pas de prudence
inutile, structuration en dossier d’enquête. Quand le skill se termine, l’appelant retrouve sa voix habituelle. Pas de
changement de persona, juste un ajustement de ton dicté par les principes du skill.

C’est important car l’enquête et l’implémentation sollicitent des réflexes différents. Les enquêteurs sont lents et
précis. Les développeurs sont rapides et confiants. Essayer de faire les deux dans une même session finit
généralement par mal faire l’un et l’autre. Le skill délimite la posture d’enquête directement dans le flux de travail, sans basculer dans une
identité distincte.

## Ce que vous obtenez

Un dossier d’enquête complet :

- Sépare les constatations **Confirmées** (avec citations) des **Déductions** et des **Hypothèses**
- Préserve l’intégralité des hypothèses formulées, avec leur Statut final et leur Résolution
- Reconstruit une chronologie des événements à partir de plusieurs sources de preuves
- Identifie les lacunes de données et ce qu’elles permettraient de résoudre
- Fournit des conclusions exploitables ancrées dans les preuves
- Inclut un plan de reproduction quand une cause racine est identifiée
- Maintient un backlog des pistes restant à explorer

Transmettez-le à un ingénieur qui n’était pas là, et il comprendra ce qui s’est passé, ce qui est connu, et ce qui reste
incertain. C’est le standard visé.

## La vision d’ensemble

La plupart des approches de « débogage par IA » actuelles mêlent preuves, raisonnement et changements de code en un seul
flux de texte plausible. Le signal est difficile à trouver, les impasses se répètent, et le dossier, s’il en existe un, est
un historique de conversation que personne ne veut lire.

`bmad-investigate` traite l’enquête comme une discipline avec son propre livrable. Chaque preuve est classée. Les
hypothèses ont un statut. Les fausses pistes sont documentées, pas effacées. Le dossier survit à la session.

Quand un bug similaire réapparaîtra, vous aurez un point de départ concret, pas un prompt vide.

## Glossaire

[^1]: **Verrouillage narratif** : phénomène cognitif par lequel un raisonnement adopte la première explication plausible
et l’enrichit progressivement, devenant de plus en plus difficile à abandonner même face à des preuves contraires.
[^2]: **Biais de confirmation** : tendance cognitive à rechercher, interpréter et favoriser les informations qui
confirment des croyances préexistantes, tout en ignorant ou minimisant celles qui les contredisent.
[^3]: **Passage de frontière** : transition entre deux zones d’exécution distinctes (langage, processus, machine,
client/serveur, code/configuration). Les frontières concentrent les bugs car chaque côté suppose que l’autre s’est
comporté comme documenté.
