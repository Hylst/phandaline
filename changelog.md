# Changelog — Phandaline

## 1.2.0 (2026-08-03)

### Ajoute
- Bouton Infos dans l'en-tete du jeu, ouvrant une modale avec la stack (React Three Fiber /
  Three.js / Drei, store Zustand), les graphismes (vraie scene 3D WebGL), la musique
  (morceau principal en fichier audio, effets synthetises), les interactions, l'architecture
  et les algorithmes notables. Etape 15 du chantier de retrofit decrit dans `todo.md` racine
  du monorepo.

### Corrige
- Une dizaine de tirets longs repartis dans App.tsx, Onboarding.tsx, Characters.tsx,
  Encounters.tsx et npcData.ts (titres d'ecran, credits, libelles de mode camera,
  commentaires de code, et plusieurs repliques de dialogue PNJ) remplaces par des deux-points,
  virgules ou parentheses selon le contexte, en conformite avec la regle du depot. Trouves en
  verifiant le nouveau bouton Infos sur l'ecran de jeu, qui a conduit a relire les ecrans
  d'onboarding attenants.

### Verifie
- Build propre, modale testee a l'ouverture/fermeture, aucune erreur console, aucun
  debordement horizontal en 390x844.

## 1.1.0 (2026-07-28)
### Ajouté
- Nouvelles illustrations (4 écrans onboarding)
- Espace / clic avance le slide d'onboarding
- Fix délai 3D au chargement
- Crédit musique Pipin
- Images non-inlinées (performance)
- Boutique et forgeron interactifs
- Lore supplémentaire

## 1.0.0 (2026-07-24)
- Version initiale
- Village 3D complet de Phandaline
- 12 PNJ interactifs avec dialogues et synthèse vocale
- 3 quêtes principales
- 4 ennemis patrouilleurs
- Cycle jour/nuit
- 3 modes de caméra
- Audio synthétisé (Web Audio API)
- Intégration à Hylst.Games