---
title: "Quick Dev"
description: Réduire la friction de l’interaction humaine sans renoncer aux points de contrôle qui protègent la qualité des résultats
sidebar:
  order: 3
---

Intention en entrée, modifications de code en sortie, avec aussi peu d'interactions humaines dans la boucle que possible — sans sacrifier la qualité.

Il permet au modèle de s'exécuter plus longtemps entre les points de contrôle, puis ne vous fait intervenir que lorsque la tâche ne peut pas se poursuivre en toute sécurité sans jugement humain, ou lorsqu'il est temps de revoir le résultat final.

![Diagramme du workflow Quick Dev](/diagrams/quick-dev-diagram-fr.webp)

## Pourquoi cette fonctionnalité existe

Les interactions humaines dans la boucle sont nécessaires et coûteuses.

Les LLM actuels échouent encore de manière prévisible : ils interprètent mal l'intention, comblent les lacunes avec des suppositions assurées, dérivent vers du travail non lié, et génèrent des résultats à réviser bruyants. En même temps, l'intervention humaine constante limite la fluidité du développement. L'attention humaine est le goulot d'étranglement.

`bmad-quick-dev` rééquilibre ce compromis. Il fait confiance au modèle pour s'exécuter sans surveillance sur de plus longues périodes, mais seulement après que le workflow ait créé une frontière suffisamment solide pour rendre cela sûr.

## La conception fondamentale

### 1. Compresser l'intention d'abord

Le workflow commence par compresser l’interaction de la personne et du modèle à partir de la requête en un objectif cohérent. L'entrée peut commencer sous forme d'une expression grossière de l'intention, mais avant que le workflow ne s'exécute de manière autonome, elle doit devenir suffisamment petite, claire et sans contradiction pour être exécutable.

L'intention peut prendre plusieurs formes : quelques phrases, un lien vers un outil de suivi de bugs, une sortie du mode planification, du texte copié depuis une session de chat, ou même un numéro de story depuis un fichier `epics.md` de BMAD. Dans ce dernier cas, le workflow ne comprendra pas la sémantique de suivi des stories de BMAD, mais il peut quand même prendre la story elle-même et l'exécuter.

Ce workflow n'élimine pas le contrôle humain. Il le déplace vers un nombre réduit d’étapes à forte valeur :

- **Clarification de l'intention** - transformer une demande confuse en un objectif cohérent sans contradictions cachées
- **Approbation de la spécification** - confirmer que la compréhension figée correspond bien à ce qu'il faut construire
- **Revue du produit final** - le point de contrôle principal, où la personne décide si le résultat est acceptable à la fin

### 2. Router vers le chemin le plus court et sûr

Une fois l'objectif clair, le workflow décide s'il s'agit d'un véritable changement en une seule étape ou s'il nécessite le chemin complet. Les petits changements à zéro impact peuvent aller directement à l'implémentation. Tout le reste passe par la planification pour que le modèle dispose d'un cadre plus solide avant de s'exécuter plus longtemps de manière autonome.

### 3. S'exécuter plus longtemps avec moins de supervision

Après cette décision de routage, le modèle peut prendre en charge une plus grande partie du travail par lui-même. Sur le chemin complet, la spécification approuvée devient le cadre dans lequel le modèle s'exécute avec moins de supervision, ce qui est tout l'intérêt de la conception.

### 4. Diagnostiquer les échecs au bon niveau

Si l'implémentation est incorrecte parce que l'intention était mauvaise, corriger le code n'est pas la bonne solution. Si le code est incorrect parce que la spécification était faible, corriger le diff n'est pas non plus la bonne solution. Le workflow est conçu pour diagnostiquer où l'échec est entré dans le système, revenir à ce niveau, et régénérer à partir de ce point.

Les résultats de la revue sont utilisés pour décider si le problème provenait de l'intention, de la génération de la spécification, ou de l'implémentation locale. Seuls les véritables problèmes locaux sont corrigés localement.

### 5. Ne faire intervenir l’humain que si nécessaire

L'entretien sur l'intention implique la personne dans la boucle, mais ce n'est pas le même type d'interruption qu'un point de contrôle récurrent. Le workflow essaie de garder ces points de contrôle récurrents au minimum. Après la mise en forme initiale de l'intention, la personne revient principalement lorsque le workflow ne peut pas continuer en toute sécurité sans jugement, et à la fin, lorsqu'il est temps de revoir le résultat.

- **Résolution des lacunes d'intention** - intervenir à nouveau lors de la revue prouve que le workflow n'a pas pu déduire correctement ce qui était voulu

Tout le reste est candidat à une exécution autonome plus longue. Ce compromis est délibéré. Les anciens patterns dépensent plus d'attention humaine en supervision continue. Quick Dev fait davantage confiance au modèle, mais préserve l'attention humaine pour les moments où le raisonnement humain a le plus d'impact.

## Pourquoi le système de revue est important

La phase de revue n'est pas seulement là pour trouver des bugs. Elle est là pour router la correction sans détruire l'élan.

Ce workflow fonctionne mieux sur une plateforme capable de générer des sous-agents[^1], ou au moins d'invoquer un autre LLM via la ligne de commande et d'attendre un résultat. Si votre plateforme ne supporte pas cela nativement, vous pouvez ajouter un skill pour le faire. Les sous-agents sans contexte sont une pierre angulaire de la conception de la revue.

Les revues agentiques[^2] échouent souvent de deux manières :

- Elles génèrent trop d’observations, forçant la personne à trier le bruit.
- Elles déraillent des modifications actuelles en remontant des problèmes non liés et en transformant chaque exécution en un projet de nettoyage improvisé.

Quick Dev aborde ces deux problèmes en traitant la revue comme un triage[^3].

Lorsqu’une observation est fortuite plutôt que directement liée au travail en cours, le processus peut la mettre de côté au lieu d’obliger la personne à s’en occuper immédiatement. Cela permet de rester concentré sur l’exécution et d’éviter que des digressions aléatoires ne viennent épuiser le capital d’attention.

Ce triage sera parfois imparfait. C’est acceptable. Il est généralement préférable de mal juger certaines observations plutôt que d’inonder la personne de milliers de commentaires de revue à faible valeur. Le système optimise la qualité du rapport, pas d’être exhaustif.

## Glossaire

[^1]: Sous-agent : agent IA secondaire créé temporairement pour effectuer une tâche spécifique (comme une revue de code) de manière isolée, sans hériter du contexte complet de l’agent principal, ce qui permet une analyse plus objective et impartiale.
[^2]: Revues agentiques (agentic review) : revue de code effectuée par un agent IA de manière autonome, capable d’analyser, d’identifier des problèmes et de formuler des recommandations sans intervention humaine directe.
[^3]: Triage : processus de filtrage et de priorisation des observations issues d’une revue, afin de distinguer les problèmes pertinents à traiter immédiatement de ceux qui peuvent être mis de côté pour plus tard.
