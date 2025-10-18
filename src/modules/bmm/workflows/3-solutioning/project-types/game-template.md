# Game Architecture Document

**Project:** {{project_name}}
**Game Type:** {{game_type}}
**Platform(s):** {{target_platforms}}
**Date:** {{date}}
**Author:** {{user_name}}

## Executive Summary

{{executive_summary}}

<critical>
This architecture adapts to {{game_type}} requirements.
Sections are included/excluded based on game needs.
</critical>

## 1. Core Technology Decisions

### 1.1 Essential Technology Stack

| Category    | Technology      | Version              | Justification              |
| ----------- | --------------- | -------------------- | -------------------------- |
| Game Engine | {{game_engine}} | {{engine_version}}   | {{engine_justification}}   |
| Language    | {{language}}    | {{language_version}} | {{language_justification}} |
| Platform(s) | {{platforms}}   | -                    | {{platform_justification}} |

### 1.2 Game-Specific Technologies

<intent>
Only include rows relevant to this game type:
- Physics: Only for physics-based games
- Networking: Only for multiplayer games
- AI: Only for games with NPCs/enemies
- Procedural: Only for roguelikes/procedural games
</intent>

{{game_specific_tech_table}}

## 2. Architecture Pattern

### 2.1 High-Level Architecture

{{architecture_pattern}}

**Pattern Justification for {{game_type}}:**
{{pattern_justification}}

### 2.2 Code Organization Strategy

{{code_organization}}

## 3. Core Game Systems

<intent>
This section should be COMPLETELY different based on game type:
- Visual Novel: Dialogue system, save states, branching
- RPG: Stats, inventory, quests, progression
- Puzzle: Level data, hint system, solution validation
- Shooter: Weapons, damage, physics
- Racing: Vehicle physics, track system, lap timing
- Strategy: Unit management, resource system, AI
</intent>

### 3.1 Core Game Loop

{{core_game_loop}}

### 3.2 Primary Game Systems

{{#for_game_type}}
Include ONLY systems this game needs
{{/for_game_type}}

{{primary_game_systems}}

## 4. Data Architecture

### 4.1 Data Management Strategy

<intent>
Adapt to game data needs:
- Simple puzzle: JSON level files
- RPG: Complex relational data
- Multiplayer: Server-authoritative state
- Roguelike: Seed-based generation
</intent>

{{data_management}}

### 4.2 Save System

{{save_system}}

### 4.3 Content Pipeline

{{content_pipeline}}

## 5. Scene/Level Architecture

<intent>
Structure varies by game type:
- Linear: Sequential level loading
- Open World: Streaming and chunks
- Stage-based: Level selection and unlocking
- Procedural: Generation pipeline
</intent>

{{scene_architecture}}

## 6. Gameplay Implementation

<intent>
ONLY include subsections relevant to the game.
A racing game doesn't need an inventory system.
A puzzle game doesn't need combat mechanics.
</intent>

{{gameplay_systems}}

## 7. Presentation Layer

<intent>
Adapt to visual style:
- 3D: Rendering pipeline, lighting, LOD
- 2D: Sprite management, layers
- Text: Minimal visual architecture
- Hybrid: Both 2D and 3D considerations
</intent>

### 7.1 Visual Architecture

{{visual_architecture}}

### 7.2 Audio Architecture

{{audio_architecture}}

### 7.3 UI/UX Architecture

{{ui_architecture}}

## 8. Input and Controls

{{input_controls}}

{{#if_multiplayer}}

## 9. Multiplayer Architecture

<critical>
Only for games with multiplayer features
</critical>

### 9.1 Network Architecture

{{network_architecture}}

### 9.2 State Synchronization

{{state_synchronization}}

### 9.3 Matchmaking and Lobbies

{{matchmaking}}

### 9.4 Anti-Cheat Strategy

{{anticheat}}
{{/if_multiplayer}}

## 10. Platform Optimizations

<intent>
Platform-specific considerations:
- Mobile: Touch controls, battery, performance
- Console: Achievements, controllers, certification
- PC: Wide hardware range, settings
- Web: Download size, browser compatibility
</intent>

{{platform_optimizations}}

## 11. Performance Strategy

### 11.1 Performance Targets

{{performance_targets}}

### 11.2 Optimization Approach

{{optimization_approach}}

## 12. Asset Pipeline

### 12.1 Asset Workflow

{{asset_workflow}}

### 12.2 Asset Budget

<intent>
Adapt to platform and game type:
- Mobile: Strict size limits
- Web: Download optimization
- Console: Memory constraints
- PC: Balance quality vs. performance
</intent>

{{asset_budget}}

## 13. Source Tree

```
{{source_tree}}
```

**Key Directories:**
{{key_directories}}

## 14. Development Guidelines

### 14.1 Coding Standards

{{coding_standards}}

### 14.2 Engine-Specific Best Practices

{{engine_best_practices}}

## 15. Build and Deployment

### 15.1 Build Configuration

{{build_configuration}}

### 15.2 Distribution Strategy

{{distribution_strategy}}

## 16. Testing Strategy

<intent>
Testing needs vary by game:
- Multiplayer: Network testing, load testing
- Procedural: Seed testing, generation validation
- Physics: Determinism testing
- Narrative: Story branch testing
</intent>

{{testing_strategy}}

## 17. Key Architecture Decisions

### Decision Records

{{architecture_decisions}}

### Risk Mitigation

{{risk_mitigation}}

{{#if_complex_project}}

## 18. Specialist Considerations

<intent>
Only for complex projects needing specialist input
</intent>

{{specialist_notes}}
{{/if_complex_project}}

---

## Implementation Roadmap

{{implementation_roadmap}}

---

_Architecture optimized for {{game_type}} game on {{platforms}}_
_Generated using BMad Method Solution Architecture workflow_
