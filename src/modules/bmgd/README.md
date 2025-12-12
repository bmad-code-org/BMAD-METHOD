# BMad Game Development (BMGD)

A comprehensive game development toolkit providing specialized agents and workflows for creating games from initial concept through production.

## Overview

The BMGD module brings together game-specific development workflows organized around industry-standard development phases:

- **Preproduction** - Concept development, brainstorming, game brief creation
- **Design** - Game Design Document (GDD) and narrative design
- **Technical** - Game architecture and technical specifications
- **Production** - Sprint-based implementation using BMM workflows

## Installation

```bash
bmad install bmgd
```

During installation, you'll be asked to configure:

- Game project name
- Document storage locations
- Development experience level
- Primary target platform

## Components

### Agents (4)

**Game Designer** 🎨
Creative vision and game design documentation specialist. Creates compelling GDDs and defines game mechanics.

**Game Developer** 🕹️
Senior implementation specialist with expertise across Unity, Unreal, and custom engines. Handles gameplay programming, physics, AI, and optimization.

**Game Architect** 🏗️
Technical systems and infrastructure expert. Designs scalable game architecture and engine-level solutions.

**Game Dev Scrum Master** 🎯
Sprint orchestrator specialized in game development workflows. Coordinates multi-disciplinary teams and translates GDDs into actionable development stories.

### Team Bundle

**Team Game Development** 🎮
Pre-configured team including Game Designer, Game Developer, and Game Architect for comprehensive game projects.

### Workflows

#### Phase 1: Preproduction

- **brainstorm-game** - Interactive game concept brainstorming
- **game-brief** - Create focused game brief document

#### Phase 2: Design

- **gdd** - Generate comprehensive Game Design Document
- **narrative** - Design narrative structure and story elements

#### Phase 3: Technical

- **game-architecture** - Define technical architecture (adapted from BMM architecture workflow)

#### Phase 4: Production

Production workflows are provided by the BMM module and accessible through the Game Dev Scrum Master agent:

- Sprint planning
- Story creation and management
- Epic technical specifications
- Code review and retrospectives

## Quick Start

### 1. Start with Concept Development

```
Load agent: game-designer
Run workflow: brainstorm-game
```

### 2. Create Game Brief

```
Run workflow: game-brief
```

### 3. Develop Game Design Document

```
Run workflow: gdd
```

### 4. Define Technical Architecture

```
Load agent: game-architect
Run workflow: game-architecture
```

### 5. Begin Production Sprints

```
Load agent: game-scrum-master
Run: *sprint-planning
```

## Module Structure

```
bmgd/
├── agents/
│   ├── game-designer.agent.yaml
│   ├── game-dev.agent.yaml
│   ├── game-architect.agent.yaml
│   └── game-scrum-master.agent.yaml
├── teams/
│   └── team-gamedev.yaml
├── workflows/
│   ├── 1-preproduction/
│   │   ├── brainstorm-game/
│   │   └── game-brief/
│   ├── 2-design/
│   │   ├── gdd/
│   │   └── narrative/
│   ├── 3-technical/
│   │   └── game-architecture/
│   └── 4-production/
│       (Uses BMM workflows via cross-module references)
├── templates/
├── data/
├── module.yaml
└── _module-installer/
    └── installer.js (optional)
```

## Configuration

After installation, configure the module in `.bmad/bmgd/config.yaml`

Key settings:

- **game_project_name** - Your game's working title
- **game_design_docs** - Location for GDD and design documents
- **game_tech_docs** - Location for technical documentation
- **game_story_location** - Location for development user stories
- **game_dev_experience** - Your experience level (affects agent communication)
- **primary_platform** - Target platform (PC, mobile, console, web, multi-platform)

## Workflow Integration

BMGD leverages the BMM module for production/implementation workflows. The Game Dev Scrum Master agent provides access to:

- Sprint planning and management
- Story creation from GDD specifications
- Epic technical context generation
- Code review workflows
- Retrospectives and course correction

This separation allows BMGD to focus on game-specific design and architecture while using battle-tested agile implementation workflows.

## Example: Creating a 2D Platformer

1. **Brainstorm** concepts with `brainstorm-game` workflow
2. **Define** the vision with `game-brief` workflow
3. **Design** mechanics and progression with `gdd` workflow
4. **Craft** character arcs and story with `narrative` workflow
5. **Architect** technical systems with `game-architecture` workflow
6. **Implement** via Game Dev Scrum Master sprint workflows

## Development Roadmap

### Phase 1: Core Enhancement

- [ ] Customize game-architecture workflow for game-specific patterns
- [ ] Add game-specific templates (level design, character sheets, etc.)
- [ ] Create asset pipeline workflows

### Phase 2: Expanded Features

- [ ] Add monetization planning workflows
- [ ] Create playtesting and feedback workflows
- [ ] Develop game balancing tools

### Phase 3: Platform Integration

- [ ] Add platform-specific deployment workflows
- [ ] Create build and release automation
- [ ] Develop live ops workflows

## Contributing

To extend this module:

1. Add new agents using `/bmad:bmb:workflows:create-agent`
2. Add new workflows using `/bmad:bmb:workflows:create-workflow`
3. Submit improvements via pull request

## Dependencies

- **BMM Module** - Required for production/implementation workflows

## Author

Extracted and refined from BMM module on 2025-11-05

## License

Part of the BMAD Method ecosystem
