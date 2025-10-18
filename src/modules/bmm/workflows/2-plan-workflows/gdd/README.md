# Game Design Document (GDD) Workflow

This folder contains the GDD workflow for game projects, replacing the traditional PRD approach with game-specific documentation.

## Overview

The GDD workflow creates a comprehensive Game Design Document that captures:

- Core gameplay mechanics and pillars
- Game type-specific elements (RPG systems, platformer movement, puzzle mechanics, etc.)
- Level design framework
- Art and audio direction
- Technical specifications (platform-agnostic)
- Development epics

## Architecture

### Universal Template

`gdd-template.md` contains sections common to ALL game types:

- Executive Summary
- Goals and Context
- Core Gameplay
- Win/Loss Conditions
- Progression and Balance
- Level Design Framework
- Art and Audio Direction
- Technical Specs
- Development Epics
- Success Metrics

### Game-Type-Specific Injection

The template includes a `{{GAME_TYPE_SPECIFIC_SECTIONS}}` placeholder that gets replaced with game-type-specific content.

### Game Types Registry

`game-types.csv` defines 24+ game types with:

- **id**: Unique identifier (e.g., `action-platformer`, `rpg`, `roguelike`)
- **name**: Human-readable name
- **description**: Brief description of the game type
- **genre_tags**: Searchable tags
- **fragment_file**: Path to type-specific template fragment

### Game-Type Fragments

Located in `game-types/` folder, these markdown files contain sections specific to each game type:

**action-platformer.md**:

- Movement System (jump mechanics, air control, special moves)
- Combat System (attack types, combos, enemy AI)
- Level Design Patterns (platforming challenges, combat arenas)
- Player Abilities and Unlocks

**rpg.md**:

- Character System (stats, classes, leveling)
- Inventory and Equipment
- Quest System
- World and Exploration
- NPC and Dialogue
- Combat System

**puzzle.md**:

- Core Puzzle Mechanics
- Puzzle Progression
- Level Structure
- Player Assistance
- Replayability

**roguelike.md**:

- Run Structure
- Procedural Generation
- Permadeath and Progression
- Item and Upgrade System
- Character Selection
- Difficulty Modifiers

...and 20+ more game types!

## Workflow Flow

1. **Router Detection** (instructions-router.md):
   - Step 3 asks for project type
   - If "Game" selected → sets `workflow_type = "gdd"`
   - Skips standard level classification
   - Jumps to GDD-specific assessment

2. **Game Type Selection** (instructions-gdd.md Step 1):
   - Presents 9 common game types + "Other"
   - Maps selection to `game-types.csv`
   - Loads corresponding fragment file
   - Stores `game_type` for injection

3. **Universal GDD Sections** (Steps 2-5, 7-13):
   - Platform and target audience
   - Goals and context
   - Core gameplay (pillars, loop, win/loss)
   - Mechanics and controls
   - Progression and balance
   - Level design
   - Art and audio
   - Technical specs
   - Epics and metrics

4. **Game-Type Injection** (Step 6):
   - Loads fragment from `game-types/{game_type}.md`
   - For each `{{placeholder}}` in fragment, elicits details
   - Injects completed sections into `{{GAME_TYPE_SPECIFIC_SECTIONS}}`

5. **Solutioning Handoff** (Step 14):
   - Routes to `3-solutioning` workflow
   - Platform/engine specifics handled by solutioning registry
   - Game-\* entries in solutioning `registry.csv` provide engine-specific guidance

## Platform vs. Game Type Separation

**GDD (this workflow)**: Game-type specifics

- What makes an RPG an RPG (stats, quests, inventory)
- What makes a platformer a platformer (jump mechanics, level design)
- Genre-defining mechanics and systems

**Solutioning (3-solutioning workflow)**: Platform/engine specifics

- Unity vs. Godot vs. Phaser vs. Unreal
- 2D vs. 3D rendering
- Physics engines
- Input systems
- Platform constraints (mobile, web, console)

This separation allows:

- Single universal GDD regardless of platform
- Platform decisions made during architecture phase
- Easy platform pivots without rewriting GDD

## Output

**GDD.md**: Complete game design document with:

- All universal sections filled
- Game-type-specific sections injected
- Ready for solutioning handoff

## Example Game Types

| ID                | Name              | Key Sections                                      |
| ----------------- | ----------------- | ------------------------------------------------- |
| action-platformer | Action Platformer | Movement, Combat, Level Patterns, Abilities       |
| rpg               | RPG               | Character System, Inventory, Quests, World, NPCs  |
| puzzle            | Puzzle            | Puzzle Mechanics, Progression, Level Structure    |
| roguelike         | Roguelike         | Run Structure, Procgen, Permadeath, Items         |
| shooter           | Shooter           | Weapon Systems, Enemy AI, Arena Design            |
| strategy          | Strategy          | Resources, Units, AI, Victory Conditions          |
| metroidvania      | Metroidvania      | Interconnected World, Ability Gating, Exploration |
| visual-novel      | Visual Novel      | Branching Story, Dialogue Trees, Choices          |
| tower-defense     | Tower Defense     | Waves, Tower Types, Placement, Economy            |
| card-game         | Card Game         | Deck Building, Card Mechanics, Turn System        |

...and 14+ more!

## Adding New Game Types

1. Add row to `game-types.csv`:

   ```csv
   new-type,New Type Name,"Description",tags,new-type.md
   ```

2. Create `game-types/new-type.md`:

   ```markdown
   ## New Type Specific Elements

   ### System Name

   {{system_placeholder}}

   **Details:**

   - Element 1
   - Element 2
   ```

3. The workflow automatically uses it!

## Integration with Solutioning

When a game project completes the GDD and moves to solutioning:

1. Solutioning workflow reads `project_type == "game"`
2. Loads GDD.md instead of PRD.md
3. Matches game platforms to solutioning `registry.csv` game-\* entries
4. Provides engine-specific guidance (Unity, Godot, Phaser, etc.)
5. Generates solution-architecture.md with platform decisions
6. Creates per-epic tech specs

Example solutioning registry entries:

- `game-unity-2d`: Unity 2D games
- `game-godot-3d`: Godot 3D games
- `game-phaser`: Phaser web games
- `game-unreal-3d`: Unreal Engine games
- `game-custom-3d-rust`: Custom Rust game engines

## Philosophy

**Game projects are fundamentally different from software products**:

- Gameplay feel > feature lists
- Playtesting > user testing
- Game pillars > product goals
- Mechanics > requirements
- Fun > utility

The GDD workflow respects these differences while maintaining BMAD Method rigor.
