---
title: "Party Mode"
description: Collaboration multi-agents - regroupez tous vos agents IA dans une seule conversation
sidebar:
  order: 9
---

Regroupez tous vos agents IA dans une seule conversation.

## Qu'est-ce que le Party Mode ?

Lancez `bmad-party-mode` et vous avez toute votre équipe IA dans une même pièce - PM, Architecte, Développeur, Designer UX, selon vos besoins. BMad Master orchestre, en sélectionnant les agents pertinents à chaque message. Les agents répondent en personnage, sont en accord ou désaccord, et construisent sur les idées des autres.

La conversation continue aussi longtemps que vous le souhaitez. Posez des questions de suivi, remettez en question les réponses, redirigez la discussion - c'est un véritable échange avec vos agents jusqu'à ce que vous ayez terminé.

**Idéal pour :**

- Les grandes décisions avec des compromis
- Les sessions de brainstorming
- Les rétrospectives post-incident quand les choses tournent mal
- Les rétrospectives de sprint et la planification

## Exemples

### Remettre en question une mauvaise architecture

**Vous :** « Ok l'équipe, notre dernier sprint a été un désastre. Le service d'authentification est tombé trois fois. Qui a cafouillé ? »

**Architecte :** « Le design était solide - authentification distribuée avec des fallbacks appropriés. Si l'implémentation a dévié des specs... »

**Développeur :** « J'ai suivi le document d'architecture à la lettre. Les specs ne prenaient pas en compte les race conditions lors de l'invalidation de sessions concurrentes. »

**PM :** « Vous avez tous les deux raté le vrai problème - nous n'avons pas validé les exigences de gestion des sessions dans le PRD. C'est de ma faute de ne pas l'avoir repéré. »

**TEA :** « Et j'aurais dû le repérer dans les tests d'intégration. Les scénarios de test ne couvraient pas l'invalidation concurrente. »

### Brainstorming créatif

**Vous :** « Comment rendre l'onboarding magique au lieu d'ennuyeux ? »

**Designer UX :** « Commençons par la divulgation progressive - révélons les fonctionnalités au fur et à mesure que les utilisateurs en ont besoin, pas d'un coup dans un tutoriel. »

**Storyteller :** « Et si l'onboarding était une histoire ? Chaque étape révèle le parcours d'un personnage - l'utilisateur EST le héros. »

**Game Designer :** « En partant de là - et si la première "quête" consistait à résoudre un vrai problème utilisateur ? Ils apprennent en faisant quelque chose d'utile. »

### Décision technique

**Vous :** « Monolithe ou microservices pour le MVP[^1] ? »

**Architecte :** « Commencez en monolithe. Les microservices ajoutent une complexité dont vous n'avez pas besoin à 1000 utilisateurs. »

**PM :** « D'accord. Le time-to-market[^2] compte plus que la scalabilité théorique. »

**Développeur :** « Monolithe avec des frontières de modules claires. On pourra extraire des services plus tard si nécessaire. »

:::tip[Meilleures décisions]
De meilleures décisions grâce à des perspectives diverses. Bienvenue dans le party mode.
:::

## Glossaire

[^1]: MVP (Minimum Viable Product) : version minimale d'un produit contenant juste assez de fonctionnalités pour être utilisée par des utilisateurs précoces et valider les hypothèses de marché avant d'investir dans un développement plus complet.
[^2]: Time-to-market : délai nécessaire pour concevoir, développer et lancer un produit sur le marché. Plus ce délai est court, plus l'entreprise peut prendre de l'avance sur ses concurrents.
