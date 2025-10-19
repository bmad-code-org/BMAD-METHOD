# Game Development Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for game project architecture decisions.
The LLM should:
- FIRST understand the game type from the GDD (RPG, puzzle, shooter, etc.)
- Check if engine preference is already mentioned in GDD or by user
- Adapt architecture heavily based on game type and complexity
- Consider that each game type has VASTLY different needs
- Keep beginner-friendly suggestions for those without preferences
</critical>

## Engine Selection Strategy

**Intelligent Engine Guidance**

First, check if the user has already indicated an engine preference in the GDD or conversation.

If no engine specified, ask directly:
"Do you have a game engine preference? If you're unsure, I can suggest options based on your [game type] and team experience."

**For Beginners Without Preference:**
Based on game type, suggest the most approachable option:

- **2D Games**: Godot (free, beginner-friendly) or GameMaker (visual scripting)
- **3D Games**: Unity (huge community, learning resources)
- **Web Games**: Phaser (JavaScript) or Godot (exports to web)
- **Visual Novels**: Ren'Py (purpose-built) or Twine (for text-based)
- **Mobile Focus**: Unity or Godot (both export well to mobile)

Always explain: "I'm suggesting [Engine] because it's beginner-friendly for [game type] and has [specific advantages]. Other viable options include [alternatives]."

**For Experienced Teams:**
Let them state their preference, then ensure architecture aligns with engine capabilities.

## Game Type Adaptive Architecture

<critical>
The architecture MUST adapt to the game type identified in the GDD.
Load the specific game type considerations and merge with general guidance.
</critical>

### Architecture by Game Type Examples

**Visual Novel / Text-Based:**

- Focus on narrative data structures, save systems, branching logic
- Minimal physics/rendering considerations
- Emphasis on dialogue systems and choice tracking
- Simple scene management

**RPG:**

- Complex data architecture for stats, items, quests
- Save system with extensive state
- Character progression systems
- Inventory and equipment management
- World state persistence

**Multiplayer Shooter:**

- Network architecture is PRIMARY concern
- Client prediction and server reconciliation
- Anti-cheat considerations
- Matchmaking and lobby systems
- Weapon ballistics and hit registration

**Puzzle Game:**

- Level data structures and progression
- Hint/solution validation systems
- Minimal networking (unless multiplayer)
- Focus on content pipeline for level creation

**Roguelike:**

- Procedural generation architecture
- Run persistence vs. meta progression
- Seed-based reproducibility
- Death and restart systems

**MMO/MOBA:**

- Massive multiplayer architecture
- Database design for persistence
- Server cluster architecture
- Real-time synchronization
- Economy and balance systems

## Core Architecture Decisions

**Determine Based on Game Requirements:**

### Data Architecture

Adapt to game type:

- **Simple Puzzle**: Level data in JSON/XML files
- **RPG**: Complex relational data, possibly SQLite
- **Multiplayer**: Server authoritative state
- **Procedural**: Seed and generation systems

### Multiplayer Architecture (if applicable)

Only discuss if game has multiplayer:

- **Casual Party Game**: P2P might suffice
- **Competitive**: Dedicated servers required
- **Turn-Based**: Simple request/response
- **Real-Time Action**: Complex netcode, interpolation

Skip entirely for single-player games.

### Content Pipeline

Based on team structure and game scope:

- **Solo Dev**: Simple, file-based
- **Small Team**: Version controlled assets, clear naming
- **Large Team**: Asset database, automated builds

### Performance Strategy

Varies WILDLY by game type:

- **Mobile Puzzle**: Battery life > raw performance
- **VR Game**: Consistent 90+ FPS critical
- **Strategy Game**: CPU optimization for AI/simulation
- **MMO**: Server scalability primary concern

## Platform-Specific Considerations

**Adapt to Target Platform from GDD:**

- **Mobile**: Touch input, performance constraints, monetization
- **Console**: Certification requirements, controller input, achievements
- **PC**: Wide hardware range, modding support potential
- **Web**: Download size, browser limitations, instant play

## System-Specific Architecture

### For Games with Heavy Systems

**Only include systems relevant to the game type:**

**Physics System** (for physics-based games)

- 2D vs 3D physics engine
- Deterministic requirements
- Custom vs. built-in

**AI System** (for games with NPCs/enemies)

- Behavior trees vs. state machines
- Pathfinding requirements
- Group behaviors

**Procedural Generation** (for roguelikes, infinite runners)

- Generation algorithms
- Seed management
- Content validation

**Inventory System** (for RPGs, survival)

- Item database design
- Stack management
- Equipment slots

**Dialogue System** (for narrative games)

- Dialogue tree structure
- Localization support
- Voice acting integration

**Combat System** (for action games)

- Damage calculation
- Hitbox/hurtbox system
- Combo system

## Development Workflow Optimization

**Based on Team and Scope:**

- **Rapid Prototyping**: Focus on quick iteration
- **Long Development**: Emphasize maintainability
- **Live Service**: Built-in analytics and update systems
- **Jam Game**: Absolute minimum viable architecture

## Adaptive Guidance Framework

When processing game requirements:

1. **Identify Game Type** from GDD
2. **Determine Complexity Level**:
   - Simple (jam game, prototype)
   - Medium (indie release)
   - Complex (commercial, multiplayer)
3. **Check Engine Preference** or guide selection
4. **Load Game-Type Specific Needs**
5. **Merge with Platform Requirements**
6. **Output Focused Architecture**

## Key Principles

1. **Game type drives architecture** - RPG != Puzzle != Shooter
2. **Don't over-engineer** - Match complexity to scope
3. **Prototype the core loop first** - Architecture serves gameplay
4. **Engine choice affects everything** - Align architecture with engine
5. **Performance requirements vary** - Mobile puzzle != PC MMO

## Output Format

Structure decisions as:

- **Engine**: [Specific engine and version, with rationale for beginners]
- **Core Systems**: [Only systems needed for this game type]
- **Architecture Pattern**: [Appropriate for game complexity]
- **Platform Optimizations**: [Specific to target platforms]
- **Development Pipeline**: [Scaled to team size]

IMPORTANT: Focus on architecture that enables the specific game type's core mechanics and requirements. Don't include systems the game doesn't need.
