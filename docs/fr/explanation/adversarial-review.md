---
title: "Revue Contradictoire"
description: Technique de raisonnement forcée qui empêche les revues paresseuses du style "ça à l'air bon"
sidebar:
  order: 7
---

Forcez une analyse plus approfondie en exigeant que des problèmes soient trouvés.

## Qu'est-ce que la Revue Contradictoire ?

Une technique de revue où le réviseur *doit* trouver des problèmes. Pas de "ça a l'air bon" autorisé. Le réviseur adopte une posture cynique - suppose que des problèmes existent et les trouve.

Il ne s'agit pas d'être négatif. Il s'agit de forcer une analyse authentique au lieu d'un coup d'œil superficiel qui valide automatiquement ce qui a été soumis.

**La règle fondamentale :** Il doit trouver des problèmes. Zéro constatation déclenche un arrêt - réanalyse ou explique pourquoi.

## Pourquoi Cela Fonctionne

Les revues normales souffrent du biais de confirmation[^1]. Il parcourt le travail rapidement, rien ne lui saute aux yeux, il l'approuve. L'obligation de "trouver des problèmes" brise ce schéma :

- **Force la rigueur** - Impossible d'approuver tant qu’il n'a pas examiné suffisamment en profondeur pour trouver des problèmes
- **Détecte les oublis** - "Qu'est-ce qui manque ici ?" devient une question naturelle
- **Améliore la qualité du signal** - Les constatations sont spécifiques et actionnables, pas des préoccupations vagues
- **Asymétrie d'information**[^2] - Effectue les revues avec un contexte frais (sans accès au raisonnement original) pour évaluer l'artefact, pas l'intention

## Où Elle Est Utilisée

La revue contradictoire apparaît dans tous les workflows BMad - revue de code, vérifications de préparation à l'implémentation, validation de spécifications, et d'autres. Parfois c'est une étape obligatoire, parfois optionnelle (comme l'élicitation avancée ou le mode party). Le pattern s'adapte à n'importe quel artefact nécessitant un examen.

## Filtrage Humain Requis

Parce que l'IA est *instruite* de trouver des problèmes, elle trouvera des problèmes - même lorsqu'ils n'existent pas. Attendez-vous à des faux positifs : des détails présentés comme des problèmes, des malentendus sur l'intention, ou des préoccupations purement hallucinées[^3].

**C'est vous qui décidez ce qui est réel.** Examinez chaque constatation, ignorez le bruit, corrigez ce qui compte.

## Exemple

Au lieu de :

> "L'implémentation de l'authentification semble raisonnable. Approuvé."

Une revue contradictoire produit :

> 1. **ÉLEVÉ** - `login.ts:47` - Pas de limitation de débit sur les tentatives échouées
> 2. **ÉLEVÉ** - Jeton de session stocké dans localStorage (vulnérable au XSS)
> 3. **MOYEN** - La validation du mot de passe se fait côté client uniquement
> 4. **MOYEN** - Pas de journalisation d'audit pour les tentatives de connexion échouées
> 5. **FAIBLE** - Le nombre magique `3600` devrait être `SESSION_TIMEOUT_SECONDS`

La première revue pourrait manquer une vulnérabilité de sécurité. La seconde en a attrapé quatre.

## Itération et Rendements Décroissants

Après avoir traité les constatations, envisagez de relancer la revue. Une deuxième passe détecte généralement plus de problèmes. Une troisième n'est pas toujours inutile non plus. Mais chaque passe prend du temps, et vous finissez par atteindre des rendements décroissants[^4] - juste des détails et des faux problèmes.

:::tip[Meilleures Revues]
Supposez que des problèmes existent. Cherchez ce qui manque, pas seulement ce qui ne va pas.
:::

## Glossaire

[^1]: **Biais de confirmation** : tendance cognitive à rechercher, interpréter et favoriser les informations qui confirment nos croyances préexistantes, tout en ignorant ou minimisant celles qui les contredisent.
[^2]: **Asymétrie d'information** : situation où une partie dispose de plus ou de meilleures informations qu'une autre, conduisant potentiellement à des décisions ou jugements biaisés.
[^3]: **Hallucination (IA)** : phénomène où un modèle d'IA génère des informations plausibles mais factuellement incorrectes ou inventées, présentées avec confiance comme si elles étaient vraies.
[^4]: **Rendements décroissants** : principe selon lequel l'augmentation continue d'un investissement (temps, effort, ressources) finit par produire des bénéfices de plus en plus faibles proportionnellement.
