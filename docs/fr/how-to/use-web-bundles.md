---
title: 'Utiliser les Web Bundles'
description: Installer un web bundle BMad comme Google Gemini Gem ou ChatGPT Custom GPT
---

Les web bundles s’installent depuis **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**.

## Pourquoi une seule porte d’entrée

Le site est le seul chemin d’installation pris en charge pour la bibliothèque. Il maintient les étapes à jour au fil de l’évolution de Gemini et ChatGPT, pointe toujours vers la dernière version taguée, et une seule inscription suffit pour être notifié des nouveaux bundles dès leur parution.

## Ce que vous ferez sur le site

1. Choisissez un bundle dans la grille de cartes.
2. Ouvrez la modale d’installation. Basculez entre les onglets **Gemini Gem** et **ChatGPT GPT** pour les étapes spécifiques à chaque plateforme.
3. Téléchargez le ZIP du bundle (un clic ; inscription gratuite en une étape pour les membres email uniquement).
4. Suivez les étapes indiquées sur la page : créez le Gem ou le Custom GPT, téléversez les fichiers de connaissance, collez le bloc d’instructions, sauvegardez.

## Prérequis

- **Pour les Gemini Gems** : abonnement Gemini Advanced.
- **Pour les ChatGPT Custom GPTs** : plan Plus, Pro, Business ou Enterprise.
- Pour les bundles qui utilisent **Deep Research** (actuellement Étude de marché et analyse sectorielle), activez-le depuis la barre de prompt (Outils → Deep Research). Deep Research a ses propres limites de plan.

## Personnaliser le persona

Le fichier `INSTRUCTIONS.md` de chaque bundle (dans le ZIP) inclut un **exemple de substitution de persona** au-dessus du séparateur de la zone à coller. Remplacez le bloc `[persona]` dans vos instructions installées par l’exemple de substitution pour changer le persona sans modifier le protocole. Vous pouvez aussi créer votre propre persona de zéro ; le protocole reste le même.

## Ce que vous obtenez

- Un Gem ou Custom GPT réutilisable dédié à une capacité de planification BMad.
- Des artefacts finalisés (briefs, PRD, rapports de recherche, spécifications UX) prêts à déposer dans votre IDE pour l’implémentation.
- Les conversations de planification se déroulent sur votre abonnement LLM web existant au lieu de consommer des tokens IDE facturés.

:::caution[Dérive du persona]
Les LLM web abandonnent parfois le persona au cours de longues sessions. Si le modèle commence à parler hors personnage, rappelez-lui son persona ou démarrez une nouvelle session.
:::

## Créer le vôtre

Pour transformer un skill BMad existant en web bundle, utilisez le skill utilitaire `bmad-os-skill-to-bundle` disponible sur [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills). Il produit les fichiers du bundle en reprenant le persona hérité de l’agent d’origine et un exemple de persona alternatif. Soumettez votre bundle à la bibliothèque en ouvrant une PR sur [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) qui ajoute le répertoire du bundle et une entrée dans `web-bundles/bundles.json`.
