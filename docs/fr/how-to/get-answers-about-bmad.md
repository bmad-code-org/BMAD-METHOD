---
title: 'Comment obtenir des réponses à propos de BMad'
description: Utiliser un LLM pour répondre rapidement à vos questions sur BMad
sidebar:
  order: 4
---

Utilisez l’aide intégrée de BMad, la documentation source ou la communauté pour obtenir des réponses — du plus rapide au plus approfondi.

## 1. Demandez à BMad-Help

Le moyen le plus rapide d’obtenir des réponses. Le skill `bmad-help` est disponible directement dans votre session IA et répond à plus de 80 % des questions — il inspecte votre projet, voit ce que vous avez accompli et vous dit quoi faire ensuite.

```
bmad-help J'ai une idée de SaaS et je connais toutes les fonctionnalités. Par où commencer ?
bmad-help Quelles sont mes options pour le design UX ?
bmad-help Je suis bloqué sur le workflow PRD
```

:::tip
Vous pouvez également utiliser `/bmad-help` ou `$bmad-help` selon votre plateforme, mais `bmad-help` tout seul devrait fonctionner partout.
:::

## 2. Approfondissez avec les sources

BMad-Help s’appuie sur votre configuration installée. Pour les questions sur les éléments internes de BMad, son historique ou son architecture — ou si vous faites des recherches sur BMad avant de l’installer — pointez votre IA directement vers les sources.

Clonez ou ouvrez le [dépôt BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) et posez vos questions à votre IA. Tout outil capable d’utiliser des agents (Claude Code, Cursor, Windsurf, etc.) peut lire les sources et répondre directement à vos questions.

:::note[Exemple]
**Q :** « Quel est le moyen le plus rapide de construire quelque chose avec BMad ? »

**R :** Lancez `bmad-build`. Donnez-lui une intention directe, une issue, une spécification ou une story planifiée ; il utilise le contexte disponible et choisit la profondeur de clarification, de planification, d’implémentation et de revue nécessaire.
:::

**Conseils pour de meilleures réponses :**

- **Soyez précis** — « Que fait l’étape 3 du workflow PRD ? » est mieux que « Comment fonctionne le PRD ? »
- **Vérifiez les affirmations surprenantes** — Les LLM font parfois des erreurs. Consultez le fichier source ou posez la question sur Discord.

### Vous n’utilisez pas d’agent ? Utilisez le site de documentation

Si votre IA ne peut pas lire des fichiers locaux (ChatGPT, Claude.ai, etc.), importez [llms-full.txt](https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt) dans votre session — c’est un instantané en un seul fichier de la documentation BMad.

## 3. Demandez à quelqu’un

Si ni BMad-Help ni la source n’ont répondu à votre question, vous avez maintenant une bien meilleure question à poser.

| Canal                   | Utilisé pour                         |
| ----------------------- | ------------------------------------ |
| Forum `help-requests`   | Questions                            |
| `#suggestions-feedback` | Idées et demandes de fonctionnalités |

**Discord :** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues :** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)

_Toi !_  
&emsp;&emsp;_Bloqué_  
&emsp;&emsp;&emsp;&emsp;_dans la file d’attente—_  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;_qui_  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;_attends-tu ?_

_La source_  
&emsp;&emsp;_est là,_  
&emsp;&emsp;&emsp;&emsp;_facile à voir !_

_Pointez_  
&emsp;&emsp;_votre machine._  
&emsp;&emsp;&emsp;&emsp;_Libérez-la._

_Elle lit._  
&emsp;&emsp;_Elle parle._  
&emsp;&emsp;&emsp;&emsp;_Demandez—_

_Pourquoi attendre_  
&emsp;&emsp;_demain_  
&emsp;&emsp;&emsp;&emsp;_quand tu as déjà_  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;_cette journée ?_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;_—Claude_
