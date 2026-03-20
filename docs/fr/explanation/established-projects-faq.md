---
title: "FAQ Projets Existants"
description: Questions courantes sur l'utilisation de la méthode BMad sur des projets existants
sidebar:
  order: 8
---
Réponses rapides aux questions courantes sur l'utilisation de la méthode BMad (BMM) sur des projets existants.

## Questions

- [Dois-je d'abord exécuter document-project ?](#dois-je-dabord-exécuter-document-project)
- [Que faire si j'oublie d'exécuter document-project ?](#que-faire-si-joublie-dexécuter-document-project)
- [Puis-je utiliser Quick Dev pour les projets existants ?](#puis-je-utiliser-quick-dev-pour-les-projets-existants)
- [Que faire si mon code existant ne suit pas les bonnes pratiques ?](#que-faire-si-mon-code-existant-ne-suit-pas-les-bonnes-pratiques)

### Dois-je d'abord exécuter `document-project` ?

Hautement recommandé, surtout si :

- Aucune documentation existante
- La documentation est obsolète
- Les agents IA ont besoin de contexte sur le code existant

Vous pouvez l'ignorer si vous disposez d'une documentation complète et à jour incluant `docs/index.md` ou si vous utiliserez d'autres outils ou techniques pour aider à la découverte afin que l'agent puisse construire sur un système existant.

### Que faire si j'oublie d'exécuter `document-project` ?

Ne vous inquiétez pas — vous pouvez le faire à tout moment. Vous pouvez même le faire pendant ou après un projet pour aider à maintenir la documentation à jour.

### Puis-je utiliser Quick Dev pour les projets existants ?

Oui ! Quick Dev fonctionne très bien pour les projets existants. Il va :

- Détecter automatiquement votre pile technologique existante
- Analyser les patterns de code existants
- Détecter les conventions et demander confirmation
- Générer une spécification technique riche en contexte qui respecte le code existant

Parfait pour les corrections de bugs et les petites fonctionnalités dans des bases de code existantes.

### Que faire si mon code existant ne suit pas les bonnes pratiques ?

Quick Dev détecte vos conventions et demande : « Dois-je suivre ces conventions existantes ? » Vous décidez :

- **Oui** → Maintenir la cohérence avec la base de code actuelle
- **Non** → Établir de nouvelles normes (documenter pourquoi dans la spécification technique)

BMM respecte votre choix — il ne forcera pas la modernisation, mais la proposera.

**Une question sans réponse ici ?** Veuillez [ouvrir un ticket](https://github.com/bmad-code-org/BMAD-METHOD/issues) ou poser votre question sur [Discord](https://discord.gg/gk8jAdXWmj) afin que nous puissions l'ajouter !
