# Structure de Phandaline

```
3d-rpg-phlandys-village-game-development/
├── index.html              # Template HTML avec SEO
├── package.json            # phandaline@1.0.0
├── vite.config.ts          # Vite + React + Tailwind + singlefile
├── tsconfig.json           # Configuration TypeScript
├── favicon.png             # Favicon 32×32
├── og-image.png            # Image OG 1024×576
├── .gitignore
├── about.md
├── README.md
├── structure.md
├── features.md
├── todo.md
├── changelog.md
└── src/
    ├── App.tsx             # Composant principal
    ├── main.tsx            # Point d'entrée
    ├── index.css           # Styles Tailwind
    ├── store.ts            # État global Zustand
    ├── npcData.ts          # PNJ + dialogues
    ├── Village.tsx         # Village 3D complet
    ├── Mansion.tsx         # Manoir Tresendar
    ├── Characters.tsx      # Personnages articulés
    ├── InteractiveNPC.tsx  # PNJ interactifs
    ├── Encounters.tsx      # Ennemis
    ├── PlayerController.tsx# Contrôle joueur
    ├── QuestItem.tsx       # Objets de quête
    ├── audio.ts            # Audio synthétisé
    ├── Room.tsx            # Salle intérieure
    ├── Furniture.tsx       # Meubles 3D
    ├── Grass.tsx           # Herbe instanciée
    ├── textures.ts         # Textures procédurales
    ├── Onboarding.tsx      # Introduction
    └── utils/
        └── cn.ts
```