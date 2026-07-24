# Phandaline

**RPG 3D médiéval-fantastique en monde ouvert.**

Joue sur : [games.hylst.fr/phandaline/](https://games.hylst.fr/phandaline/)

## Comment jouer

Explore le village de Phandaline, parle aux PNJ, accepte des quêtes, combats des ennemis et découvre le lore.

## Contrôles

| Touche | Action |
|--------|--------|
| **WASD** | Se déplacer |
| **Souris** | Regarder (Pointer Lock) |
| **E** | Parler / Ramasser / Attaquer |
| **Échap** | Libérer la souris |
| **Clic** | Mode libre : orbite autour du village |

## Modes de caméra

- **Libre** 🗺️ — observe le village depuis le ciel
- **3e personne** 🧍 — suis ton personnage
- **1ère personne** 👁️ — immersive

## Structure

```
src/
├── App.tsx                  # Composant principal (scene 3D, HUD, quêtes)
├── main.tsx                 # Point d'entrée
├── store.ts                 # État global (or, réputation, quêtes)
├── npcData.ts               # 12 PNJ + scripts de dialogue
├── Village.tsx              # Village complet (maisons, remparts, décors)
├── Mansion.tsx              # Manoir Tresendar
├── Characters.tsx           # Personnage articulé + animations
├── InteractiveNPC.tsx       # PNJ interactifs (dialogues)
├── Encounters.tsx           # Ennemis patrouilleurs
├── PlayerController.tsx     # Déplacement WASD + collisions
├── QuestItem.tsx            # Objets de quête
├── audio.ts                 # Moteur audio synthétisé
├── Room.tsx                 # Salle intérieure
├── Furniture.tsx            # 10 types de meubles
├── Grass.tsx                # Herbe instanciée (9000 brins)
├── textures.ts              # Textures procédurales
├── Onboarding.tsx           # Introduction narrative
└── utils/cn.ts              # Utilitaire CSS
```

## Development

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
```