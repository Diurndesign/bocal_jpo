# Bocal

**Ton frigo te dit quoi manger avant que ça se perde.**

Bocal est une application fictive anti-gaspillage alimentaire, conçue et intégrée par la section UI/UX Webdesign d'ITECOM Art Design Nice. Elle sert de fil rouge au module Intégration & Développement Web.

**Démo en ligne : https://diurndesign.github.io/bocal_jpo/**
Elle est faite pour un téléphone. Sur ordinateur, elle s'élargit en version tablette, puis en version bureau.

## Ce que montre ce dépôt

Ce dépôt montre où va l'application, c'est-à-dire la version la plus aboutie du projet. Le parcours se fait en deux temps :

| Version | Qui la fait | Contenu |
|---|---|---|
| **v1** | Les étudiants, seuls | Les 4 écrans en HTML et CSS : accueil, mon frigo, recettes, profil. Flexbox, responsive, composants, tokens de couleur. Pas de JavaScript. |
| **v2** | La démo de ce dépôt | Les filtres du frigo, et l'ajout d'un produit par la **photo de son code-barres**. Le produit est reconnu, rangé dans le bon groupe (aujourd'hui, cette semaine, plus tard), et les compteurs se mettent à jour. |

Aux portes ouvertes, les visiteurs découvrent la v1 sur les panneaux. Le QR code mène ici, à la v2.

## Les écrans

| Fichier | Écran |
|---|---|
| `index.html` | Accueil : la promesse et les 3 étapes |
| `fridge.html` | Mon frigo : les produits classés par urgence, les filtres et le bouton « + » |
| `add.html` | **v2** : ajouter un produit (scan ou saisie à la main) |
| `recipes.html` | La recette du jour, faite avec ce qui expire, et le bouton « J'ai cuisiné ! » |
| `profile.html` | Profil : préférences et bilan |
| `legal.html` | Mentions légales |

## Comment marche le scan (v2)

1. Sur `add.html`, on scanne avec la caméra en direct, ou on prend une photo du code-barres. La photo est la solution de secours qui marche partout.
2. La bibliothèque [html5-qrcode](https://github.com/mebjas/html5-qrcode) lit le code EAN-13, EAN-8 ou UPC directement sur le téléphone. Elle n'est chargée qu'au premier scan.
3. Le numéro est envoyé à [Open Food Facts](https://world.openfoodfacts.org), une base alimentaire ouverte, qui renvoie le nom et la catégorie du produit.
4. Bocal propose une date limite selon la catégorie (restes 2 jours, légumes 5, laitages et fruits 7, épicerie 30). L'utilisateur la vérifie, puis valide.
5. Le produit est gardé dans le `localStorage` du navigateur, et le frigo l'affiche au bon endroit.

Si le produit est inconnu, si la connexion manque ou si la caméra est refusée, un message l'explique et la saisie à la main prend le relais. Les messages sont annoncés aux lecteurs d'écran (`role="status"`).

> Pour la caméra, le navigateur exige une page en HTTPS. GitHub Pages l'est déjà. En local, ouvrez `http://localhost` plutôt que le fichier directement.

## Structure

```
index.html, fridge.html, add.html, recipes.html, profile.html, legal.html
style.css     Tous les styles : tokens (couleurs, espaces), composants, responsive (700px et 1100px), animations
script.js     Commun : produits enregistrés, affichage dans le frigo, filtres, bouton « J'ai cuisiné ! »
add.js        L'écran d'ajout : scan, recherche Open Food Facts, date proposée, enregistrement
fonts/        Polices hébergées sur le site (aucun appel à Google Fonts)
images/       Photo de la recette, favicon, icône
vendor/       html5-qrcode 2.3.8 et sa licence
AUDIT.md      Compte rendu de l'audit Lighthouse
```

Il n'y a ni outil de build, ni dépendance à installer. Pour travailler en local :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000

## Qualité

- Lighthouse : performance 97 à 98, accessibilité 100, bonnes pratiques 100, SEO 100 (voir `AUDIT.md`).
- Les contrastes respectent le niveau AA, les zones tactiles font au moins 44 px, la navigation au clavier fonctionne et le focus est visible.
- Les animations sont coupées quand le système demande moins de mouvement (`prefers-reduced-motion`).
- Les noms saisis sont insérés avec `textContent` : ils ne sont jamais interprétés comme du HTML.

## Identité

- Couleurs : vert `#2F7D5B`, vert clair `#7BB661`, orange `#F26B3A`, crème `#FBF7EF`, texte `#1F2A24`.
- Polices : Bricolage Grotesque pour les titres, Atkinson Hyperlegible pour le texte, Fraunces pour le logo. Le « o » du logo est un bocal dessiné en SVG.

## Crédits

- Design et intégration : section UI/UX Webdesign, ITECOM Art Design Nice.
- Lecture des codes-barres : html5-qrcode, licence Apache 2.0.
- Données produits : Open Food Facts, licence ODbL.
- Polices : licence SIL Open Font License.

Projet pédagogique : les produits, les chiffres et le profil affichés sont des exemples.
