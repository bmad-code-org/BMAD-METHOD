# BMGD Game Types Guide

Reference for selecting and using BMGD's 24 supported game type templates.

---

## Overview

When creating a GDD, BMGD offers game type templates that provide genre-specific sections. This ensures your design document covers mechanics and systems relevant to your game's genre.

---

## Supported Game Types

### Action & Combat

#### Action Platformer

**Tags:** action, platformer, combat, movement

Side-scrolling or 3D platforming with combat mechanics. Think Hollow Knight, Celeste with combat, or Mega Man.

**GDD sections added:**

- Movement systems (jumps, dashes, wall mechanics)
- Combat mechanics (melee/ranged, combos)
- Level design patterns
- Boss design

---

#### Shooter

**Tags:** shooter, combat, aiming, fps, tps

Projectile combat with aiming mechanics. Covers FPS, TPS, and arena shooters.

**GDD sections added:**

- Weapon systems
- Aiming and accuracy
- Enemy AI patterns
- Level/arena design
- Multiplayer considerations

---

#### Fighting

**Tags:** fighting, combat, competitive, combos, pvp

1v1 combat with combos and frame data. Traditional fighters and platform fighters.

**GDD sections added:**

- Frame data systems
- Combo mechanics
- Character movesets
- Competitive balance
- Netcode requirements

---

### Strategy & Tactics

#### Strategy

**Tags:** strategy, tactics, resources, planning

Resource management with tactical decisions. RTS, 4X, and grand strategy.

**GDD sections added:**

- Resource systems
- Unit/building design
- AI opponent behavior
- Map/scenario design
- Victory conditions

---

#### Turn-Based Tactics

**Tags:** tactics, turn-based, grid, positioning

Grid-based movement with turn order. XCOM-likes and tactical RPGs.

**GDD sections added:**

- Grid and movement systems
- Turn order mechanics
- Cover and positioning
- Unit progression
- Procedural mission generation

---

#### Tower Defense

**Tags:** tower-defense, waves, placement, strategy

Wave-based defense with tower placement.

**GDD sections added:**

- Tower types and upgrades
- Wave design and pacing
- Economy systems
- Map design patterns
- Meta-progression

---

### RPG & Progression

#### RPG

**Tags:** rpg, stats, inventory, quests, narrative

Character progression with stats, inventory, and quests.

**GDD sections added:**

- Character stats and leveling
- Inventory and equipment
- Quest system design
- Combat system (action/turn-based)
- Skill trees and builds

---

#### Roguelike

**Tags:** roguelike, procedural, permadeath, runs

Procedural generation with permadeath and run-based progression.

**GDD sections added:**

- Procedural generation rules
- Permadeath and persistence
- Run structure and pacing
- Item/ability synergies
- Meta-progression systems

---

#### Metroidvania

**Tags:** metroidvania, exploration, abilities, interconnected

Interconnected world with ability gating.

**GDD sections added:**

- World map connectivity
- Ability gating design
- Backtracking flow
- Secret and collectible placement
- Power-up progression

---

### Narrative & Story

#### Adventure

**Tags:** adventure, narrative, exploration, story

Story-driven exploration and narrative. Point-and-click and narrative adventures.

**GDD sections added:**

- Puzzle design
- Narrative delivery
- Exploration mechanics
- Dialogue systems
- Story branching

---

#### Visual Novel

**Tags:** visual-novel, narrative, choices, story

Narrative choices with branching story.

**GDD sections added:**

- Branching narrative structure
- Choice and consequence
- Character routes
- UI/presentation
- Save/load states

---

#### Text-Based

**Tags:** text, parser, interactive-fiction, mud

Text input/output games. Parser games, choice-based IF, MUDs.

**GDD sections added:**

- Parser or choice systems
- World model
- Narrative structure
- Text presentation
- Save state management

---

### Simulation & Management

#### Simulation

**Tags:** simulation, management, sandbox, systems

Realistic systems with management and building. Includes tycoons and sim games.

**GDD sections added:**

- Core simulation loops
- Economy modeling
- AI agents/citizens
- Building/construction
- Failure states

---

#### Sandbox

**Tags:** sandbox, creative, building, freedom

Creative freedom with building and minimal objectives.

**GDD sections added:**

- Creation tools
- Physics/interaction systems
- Persistence and saving
- Sharing/community features
- Optional objectives

---

### Sports & Racing

#### Racing

**Tags:** racing, vehicles, tracks, speed

Vehicle control with tracks and lap times.

**GDD sections added:**

- Vehicle physics model
- Track design
- AI opponents
- Progression/career mode
- Multiplayer racing

---

#### Sports

**Tags:** sports, teams, realistic, physics

Team-based or individual sports simulation.

**GDD sections added:**

- Sport-specific rules
- Player/team management
- AI opponent behavior
- Season/career modes
- Multiplayer modes

---

### Multiplayer

#### MOBA

**Tags:** moba, multiplayer, pvp, heroes, lanes

Multiplayer team battles with hero selection.

**GDD sections added:**

- Hero/champion design
- Lane and map design
- Team composition
- Matchmaking
- Economy (gold/items)

---

#### Party Game

**Tags:** party, multiplayer, minigames, casual

Local multiplayer with minigames.

**GDD sections added:**

- Minigame design patterns
- Controller support
- Round/game structure
- Scoring systems
- Player count flexibility

---

### Horror & Survival

#### Survival

**Tags:** survival, crafting, resources, danger

Resource gathering with crafting and persistent threats.

**GDD sections added:**

- Resource gathering
- Crafting systems
- Hunger/health/needs
- Threat systems
- Base building

---

#### Horror

**Tags:** horror, atmosphere, tension, fear

Atmosphere and tension with limited resources.

**GDD sections added:**

- Fear mechanics
- Resource scarcity
- Sound design
- Lighting and visibility
- Enemy/threat design

---

### Casual & Progression

#### Puzzle

**Tags:** puzzle, logic, cerebral

Logic-based challenges and problem-solving.

**GDD sections added:**

- Puzzle mechanics
- Difficulty progression
- Hint systems
- Level structure
- Scoring/rating

---

#### Idle/Incremental

**Tags:** idle, incremental, automation, progression

Passive progression with upgrades and automation.

**GDD sections added:**

- Core loop design
- Prestige systems
- Automation unlocks
- Number scaling
- Offline progress

---

#### Card Game

**Tags:** card, deck-building, strategy, turns

Deck building with card mechanics.

**GDD sections added:**

- Card design framework
- Deck building rules
- Mana/resource systems
- Rarity and collection
- Competitive balance

---

### Rhythm

#### Rhythm

**Tags:** rhythm, music, timing, beats

Music synchronization with timing-based gameplay.

**GDD sections added:**

- Note/beat mapping
- Scoring systems
- Difficulty levels
- Music licensing
- Input methods

---

## Hybrid Game Types

Many games combine multiple genres. BMGD supports hybrid selection:

### Examples

**Action RPG** = Action Platformer + RPG

- Movement and combat systems from Action Platformer
- Progression and stats from RPG

**Survival Horror** = Survival + Horror

- Resource and crafting from Survival
- Atmosphere and fear from Horror

**Roguelike Deckbuilder** = Roguelike + Card Game

- Run structure from Roguelike
- Card mechanics from Card Game

### How to Use Hybrids

During GDD creation, select multiple game types when prompted:

```
Agent: What game type best describes your game?
You: It's a roguelike with card game combat
Agent: I'll include sections for both Roguelike and Card Game...
```

---

## Game Type Selection Tips

### 1. Start with Core Fantasy

What does the player primarily DO in your game?

- Run and jump? → Platformer types
- Build and manage? → Simulation types
- Fight enemies? → Combat types
- Make choices? → Narrative types

### 2. Consider Your Loop

What's the core gameplay loop?

- Session-based runs? → Roguelike
- Long-term progression? → RPG
- Quick matches? → Multiplayer types
- Creative expression? → Sandbox

### 3. Don't Over-Combine

2-3 game types maximum. More than that usually means your design isn't focused enough.

### 4. Primary vs Secondary

One type should be primary (most gameplay time). Others add flavor:

- **Primary:** Platformer (core movement and exploration)
- **Secondary:** Metroidvania (ability gating structure)

---

## GDD Section Mapping

When you select a game type, BMGD adds these GDD sections:

| Game Type         | Key Sections Added                     |
| ----------------- | -------------------------------------- |
| Action Platformer | Movement, Combat, Level Design         |
| RPG               | Stats, Inventory, Quests               |
| Roguelike         | Procedural Gen, Runs, Meta-Progression |
| Narrative         | Story Structure, Dialogue, Branching   |
| Multiplayer       | Matchmaking, Netcode, Balance          |
| Simulation        | Systems, Economy, AI                   |

---

## Next Steps

- **[Quick Start Guide](./quick-start.md)** - Get started with BMGD
- **[Workflows Guide](./workflows-guide.md)** - GDD workflow details
- **[Glossary](./glossary.md)** - Game development terminology
