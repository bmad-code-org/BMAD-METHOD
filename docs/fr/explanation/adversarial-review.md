---
title: "Revue contradictoire"
description: Revue à liste obligatoire qui bloque le tampon « ça a l’air bon »
sidebar:
  order: 9
---

Forcer une analyse plus profonde en exigeant une vraie liste de problèmes — pas une persona cynique.

## Qu’est-ce que la revue contradictoire ?

Une technique où le réviseur doit produire des constats. « Ça a l’air bon » avec une liste vide n’est pas permis.

Le mécanisme est un **plancher de constats** (au moins dix points à corriger ou améliorer) et une exigence de chercher **ce qui manque**, pas seulement ce qui est faux. Si le contenu est vide, s’arrêter. Si la liste est vide, revérifier — ne pas terminer sans rien.

Ce n’est pas une question d’hostilité. Les anciens prompts utilisaient une persona aigrie ; cela ne change pas ce que trouvent les modèles actuels. Ce qui compte encore, c’est l’obligation de continuer à chercher et de préférer les omissions à un passage en coup de vent.

## Pourquoi ça marche

Les revues normales souffrent du biais de confirmation. On parcourt le travail, rien ne saute aux yeux, on approuve. Le plancher casse ce schéma :

- **Force la rigueur** — on ne peut pas finir tant qu’assez de constats concrets ne sont pas listés
- **Attrape les manques** — « qu’est-ce qui n’est pas là ? » fait partie du travail
- **Alimente le triage, pas l’utilisateur directement** — dans build et code-review, la session parente filtre le bruit ; le rôle du chasseur est le rappel, pas le jugement final
- **Asymétrie d’information** — les chasseurs tournent souvent avec un contexte frais sur le changement

## Où c’est utilisé

- **bmad-build / bmad-build-auto / bmad-code-review** — couche Blind Hunter : court prompt en ligne, contenu sous `CONTENT:`, en parallèle des autres couches, puis triage
- **bmad-review** — lentille adversarial parmi les revues multi-lentilles (même méthode ; champs de finding canoniques pour la fusion)

## Filtrage humain (ou parent) requis

Parce que le modèle doit remplir une liste, il produira des items minces, préexistants ou faux. Les faux positifs sont attendus.

**Le triage décide ce qui est réel.** Dans les flux agentiques, c’est le workflow parent. En revue autonome, c’est vous.

## Exemple

Au lieu de :

> « L’implémentation d’auth a l’air raisonnable. Approuvé. »

Un passage contradictoire produit une liste, par exemple :

> 1. `login.ts:47` — pas de rate limiting sur les échecs  
> 2. Jeton de session dans localStorage (risque XSS)  
> … (au moins dix points concrets)

## Itération et rendements décroissants

Après correction, un autre passage peut encore aider. Chaque passage coûte du temps ; on finit par n’avoir que des nits et des faux constats. Le triage en aval et le budget de boucle (dans build) empêchent que ça tourne indéfiniment.

:::tip[Meilleures revues]
Cherchez ce qui manque, pas seulement ce qui est faux. Continuez jusqu’à ce que la liste soit réelle — puis laissez le triage la raccourcir.
:::
