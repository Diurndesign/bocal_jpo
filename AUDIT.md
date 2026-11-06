# Audit Lighthouse

Lighthouse 12, mobile, sur les pages servies en local. Notes sur 100.

## 6 novembre 2026

| Page | Performance | Accessibilité | Bonnes pratiques | Référencement |
| --- | --- | --- | --- | --- |
| Accueil | 97 | 100 | 100 | 100 |
| Mon frigo | 98 | 100 | 100 | 100 |
| Recette | 97 | 100 | 100 | 100 |
| Profil | 98 | 100 | 100 | 100 |
| Mentions légales | 98 | 100 | 100 | 100 |

### Avant corrections

Accessibilité à 96 sur les 4 pages de l'app : 8 combinaisons de couleurs n'atteignaient pas le contraste minimum de 4,5:1 (niveau AA).

### Corrections

- Texte et boutons orange : nouvelle variable `--color-accent-strong` (#C4471C), contraste de 4,9:1 avec le blanc. Le orange tomate `--color-accent` reste pour le logo, les bordures et les décors.
- Texte vert sur les badges vert clair : nouvelle variable `--color-primary-strong` (#276A4D), contraste de 5,6:1.
- Pastille profil : l'étiquette accessible commence par le texte visible (« LÉ, mon profil »), pour le contrôle à la voix.

### À surveiller

- Premier affichage simulé à 1,8 s en 4G lente : correct, à revérifier si on ajoute des images.
- Refaire l'audit après chaque changement important, et ajouter une ligne à ce fichier.
