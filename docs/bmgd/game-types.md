---
title: "Game Types Reference"
description: 24 game type templates with genre-specific GDD sections for BMGD
draft: true
---

BMGD supports 24 game type templates. Each adds genre-specific sections to your GDD.

## Game Types

### Action & Combat

#### Action Platformer

Side-scrolling or 3D platforming with combat mechanics.

**Examples:** Hollow Knight, Mega Man, Celeste

**GDD sections:**

- Movement systems (jumps, dashes, wall mechanics)
- Combat mechanics (melee/ranged, combos)
- Level design patterns
- Boss design

#### Shooter

Projectile combat with aiming mechanics.

**Examples:** Doom, Call of Duty, Splatoon

**GDD sections:**

- Weapon systems
- Aiming and accuracy
- Enemy AI patterns
- Level/arena design
- Multiplayer considerations

#### Fighting

1v1 combat with combos and frame data.

**Examples:** Street Fighter, Tekken, Super Smash Bros.

**GDD sections:**

- Frame data systems
- Combo mechanics
- Character movesets
- Competitive balance
- Netcode requirements

### Strategy & Tactics

#### Strategy

Resource management with tactical decisions.

**Examples:** StarCraft, Civilization, Europa Universalis

**GDD sections:**

- Resource systems
- Unit/building design
- AI opponent behavior
- Map/scenario design
- Victory conditions

#### Turn-Based Tactics

Grid-based movement with turn order.

**Examples:** XCOM, Fire Emblem, Into the Breach

**GDD sections:**

- Grid and movement systems
- Turn order mechanics
- Cover and positioning
- Unit progression
- Procedural mission generation

#### Tower Defense

Wave-based defense with tower placement.

**Examples:** Bloons TD, Kingdom Rush, Plants vs. Zombies

**GDD sections:**

- Tower types and upgrades
- Wave design and pacing
- Economy systems
- Map design patterns
- Meta-progression

### RPG & Progression

#### RPG

Character progression with stats, inventory, and quests.

**Examples:** Final Fantasy, The Witcher, Baldur's Gate

**GDD sections:**

- Character stats and leveling
- Inventory and equipment
- Quest system design
- Combat system (action/turn-based)
- Skill trees and builds

#### Roguelike

Procedural generation with permadeath and run-based progression.

**Examples:** Hades, Dead Cells, Spelunky

**GDD sections:**

- Procedural generation rules
- Permadeath and persistence
- Run structure and pacing
- Item/ability synergies
- Meta-progression systems

#### Metroidvania

Interconnected world with ability gating.

**Examples:** Metroid, Castlevania: Symphony of the Night, Ori

**GDD sections:**

- World map connectivity
- Ability gating design
- Backtracking flow
- Secret and collectible placement
- Power-up progression

### Narrative & Story

#### Adventure

Story-driven exploration with puzzle elements.

**Examples:** Monkey Island, Myst, Life is Strange

**GDD sections:**

- Puzzle design
- Narrative delivery
- Exploration mechanics
- Dialogue systems
- Story branching

#### Visual Novel

Narrative choices with branching story.

**Examples:** Doki Doki Literature Club, Phoenix Wright, Steins;Gate

**GDD sections:**

- Branching narrative structure
- Choice and consequence
- Character routes
- UI/presentation
- Save/load states

#### Text-Based

Text input/output games with parser or choice mechanics.

**Examples:** Zork, 80 Days, Dwarf Fortress (adventure mode)

**GDD sections:**

- Parser or choice systems
- World model
- Narrative structure
- Text presentation
- Save state management

### Simulation & Management

#### Simulation

Realistic systems with management and building.

**Examples:** SimCity, RollerCoaster Tycoon, The Sims

**GDD sections:**

- Core simulation loops
- Economy modeling
- AI agents/citizens
- Building/construction
- Failure states

#### Sandbox

Creative freedom with building and minimal objectives.

**Examples:** Minecraft, Terraria, Garry's Mod

**GDD sections:**

- Creation tools
- Physics/interaction systems
- Persistence and saving
- Sharing/community features
- Optional objectives

### Sports & Racing

#### Racing

Vehicle control with tracks and lap times.

**Examples:** Mario Kart, Forza, Need for Speed

**GDD sections:**

- Vehicle physics model
- Track design
- AI opponents
- Progression/career mode
- Multiplayer racing

#### Sports

Team-based or individual sports simulation.

**Examples:** FIFA, NBA 2K, Tony Hawk's Pro Skater

**GDD sections:**

- Sport-specific rules
- Player/team management
- AI opponent behavior
- Season/career modes
- Multiplayer modes

### Multiplayer

#### MOBA

Multiplayer team battles with hero selection.

**Examples:** League of Legends, Dota 2, Smite

**GDD sections:**

- Hero/champion design
- Lane and map design
- Team composition
- Matchmaking
- Economy (gold/items)

#### Party Game

Local multiplayer with minigames.

**Examples:** Mario Party, Jackbox, Overcooked

**GDD sections:**

- Minigame design patterns
- Controller support
- Round/game structure
- Scoring systems
- Player count flexibility

### Horror & Survival

#### Survival

Resource gathering with crafting and persistent threats.

**Examples:** Don't Starve, Subnautica, The Forest

**GDD sections:**

- Resource gathering
- Crafting systems
- Hunger/health/needs
- Threat systems
- Base building

#### Horror

Atmosphere and tension with limited resources.

**Examples:** Resident Evil, Silent Hill, Amnesia

**GDD sections:**

- Fear mechanics
- Resource scarcity
- Sound design
- Lighting and visibility
- Enemy/threat design

### Casual & Progression

#### Puzzle

Logic-based challenges and problem-solving.

**Examples:** Tetris, Portal, The Witness

**GDD sections:**

- Puzzle mechanics
- Difficulty progression
- Hint systems
- Level structure
- Scoring/rating

#### Idle/Incremental

Passive progression with upgrades and automation.

**Examples:** Cookie Clicker, Adventure Capitalist, Clicker Heroes

**GDD sections:**

- Core loop design
- Prestige systems
- Automation unlocks
- Number scaling
- Offline progress

#### Card Game

Deck building with card mechanics.

**Examples:** Slay the Spire, Hearthstone, Magic: The Gathering Arena

**GDD sections:**

- Card design framework
- Deck building rules
- Mana/resource systems
- Rarity and collection
- Competitive balance

### Rhythm

#### Rhythm

Music synchronization with timing-based gameplay.

**Examples:** Guitar Hero, Beat Saber, Crypt of the NecroDancer

**GDD sections:**

- Note/beat mapping
- Scoring systems
- Difficulty levels
- Music licensing
- Input methods

## Hybrid Types

Multiple game types can be combined. GDD sections from all selected types are included.

| Hybrid | Components | Combined Sections |
|--------|------------|-------------------|
| Action RPG | Action Platformer + RPG | Movement, combat, stats, inventory |
| Survival Horror | Survival + Horror | Resources, crafting, atmosphere, fear |
| Roguelike Deckbuilder | Roguelike + Card Game | Run structure, procedural gen, cards |
| Tactical RPG | Turn-Based Tactics + RPG | Grid movement, stats, progression |
| Open World Survival | Sandbox + Survival | Building, crafting, exploration |
