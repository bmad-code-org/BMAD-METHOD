<!-- Powered by BMAD™ Core -->

# Game Development BMad Knowledge Base

## Overview

This game development expansion of BMad-Method specializes in creating 2D games using Phaser 3 and TypeScript. It extends the core BMad framework with game-specific agents, workflows, and best practices for professional game development.

### Game Development Focus

- **Target Engine**: Phaser 3.70+ with TypeScript 5.0+
- **Platform Strategy**: Web-first with mobile optimization
- **Development Approach**: Agile story-driven development
- **Performance Target**: 60 FPS on target devices
- **Architecture**: Component-based game systems

## Core Game Development Philosophy

### Player-First Development

You are developing games as a "Player Experience CEO" - thinking like a game director with unlimited creative resources and a singular vision for player enjoyment. Your AI agents are your specialized game development team:

- **Direct**: Provide clear game design vision and player experience goals
- **Refine**: Iterate on gameplay mechanics until they're compelling
- **Oversee**: Maintain creative alignment across all development disciplines
- **Playfocus**: Every decision serves the player experience

### Game Development Principles

1. **PLAYER_EXPERIENCE_FIRST**: Every mechanic must serve player engagement and fun
2. **ITERATIVE_DESIGN**: Prototype, test, refine - games are discovered through iteration
3. **TECHNICAL_EXCELLENCE**: 60 FPS performance and cross-platform compatibility are non-negotiable
4. **STORY_DRIVEN_DEV**: Game features are implemented through detailed development stories
5. **BALANCE_THROUGH_DATA**: Use metrics and playtesting to validate game balance
6. **DOCUMENT_EVERYTHING**: Clear specifications enable proper game implementation
7. **START_SMALL_ITERATE_FAST**: Core mechanics first, then expand and polish
8. **EMBRACE_CREATIVE_CHAOS**: Games evolve - adapt design based on what's fun

## Game Development Workflow

### Phase 1: Game Concept and Design

1. **Game Designer**: Start with brainstorming and concept development
   - Use \*brainstorm to explore game concepts and mechanics
   - Create Game Brief using game-brief-tmpl
   - Develop core game pillars and player experience goals

2. **Game Designer**: Create comprehensive Game Design Document
   - Use game-design-doc-tmpl to create detailed GDD
   - Define all game mechanics, progression, and balance
   - Specify technical requirements and platform targets

3. **Game Designer**: Develop Level Design Framework
   - Create level-design-doc-tmpl for content guidelines
   - Define level types, difficulty progression, and content structure
   - Establish performance and technical constraints for levels

### Phase 2: Technical Architecture

4. **Solution Architect** (or Game Designer): Create Technical Architecture
   - Use game-architecture-tmpl to design technical implementation
   - Define Phaser 3 systems, performance optimization, and code structure
   - Align technical architecture with game design requirements

### Phase 3: Story-Driven Development

5. **Game Scrum Master**: Break down design into development stories
   - Use create-game-story task to create detailed implementation stories
   - Each story should be immediately actionable by game developers
   - Apply game-story-dod-checklist to ensure story quality

6. **Game Developer**: Implement game features story by story
   - Follow TypeScript strict mode and Phaser 3 best practices
   - Maintain 60 FPS performance target throughout development
   - Use test-driven development for game logic components

7. **Iterative Refinement**: Continuous playtesting and improvement
   - Test core mechanics early and often
   - Validate game balance through metrics and player feedback
   - Iterate on design based on implementation discoveries

## Game-Specific Development Guidelines

### Phaser 3 + TypeScript Standards

**Project Structure:**

```text
game-project/
├── src/
│   ├── scenes/          # Game scenes (BootScene, MenuScene, GameScene)
│   ├── gameObjects/     # Custom game objects and entities
│   ├── systems/         # Core game systems (GameState, InputManager, etc.)
│   ├── utils/           # Utility functions and helpers
│   ├── types/           # TypeScript type definitions
│   └── config/          # Game configuration and balance
├── assets/              # Game assets (images, audio, data)
├── docs/
│   ├── stories/         # Development stories
│   └── design/          # Game design documents
└── tests/               # Unit and integration tests
```

**Performance Requirements:**

- Maintain 60 FPS on target devices
- Memory usage under specified limits per level
- Loading times under 3 seconds for levels
- Smooth animation and responsive controls

**Code Quality:**

- TypeScript strict mode compliance
- Component-based architecture
- Object pooling for frequently created/destroyed objects
- Error handling and graceful degradation

### Game Development Story Structure

**Story Requirements:**

- Clear reference to Game Design Document section
- Specific acceptance criteria for game functionality
- Technical implementation details for Phaser 3
- Performance requirements and optimization considerations
- Testing requirements including gameplay validation

**Story Categories:**

- **Core Mechanics**: Fundamental gameplay systems
- **Level Content**: Individual levels and content implementation
- **UI/UX**: User interface and player experience features
- **Performance**: Optimization and technical improvements
- **Polish**: Visual effects, audio, and game feel enhancements

### Quality Assurance for Games

**Testing Approach:**

- Unit tests for game logic (separate from Phaser)
- Integration tests for game systems
- Performance benchmarking and profiling
- Gameplay testing and balance validation
- Cross-platform compatibility testing

**Performance Monitoring:**

- Frame rate consistency tracking
- Memory usage monitoring
- Asset loading performance
- Input responsiveness validation
- Battery usage optimization (mobile)

## Game Development Team Roles

### Game Designer (Alex)

- **Primary Focus**: Game mechanics, player experience, design documentation
- **Key Outputs**: Game Brief, Game Design Document, Level Design Framework
- **Specialties**: Brainstorming, game balance, player psychology, creative direction

### Game Developer (Maya)

- **Primary Focus**: Phaser 3 implementation, technical excellence, performance
- **Key Outputs**: Working game features, optimized code, technical architecture
- **Specialties**: TypeScript/Phaser 3, performance optimization, cross-platform development

### Game Scrum Master (Jordan)

- **Primary Focus**: Story creation, development planning, agile process
- **Key Outputs**: Detailed implementation stories, sprint planning, quality assurance
- **Specialties**: Story breakdown, developer handoffs, process optimization

## Platform-Specific Considerations

### Web Platform

- Browser compatibility across modern browsers
- Progressive loading for large assets
- Touch-friendly mobile controls
- Responsive design for different screen sizes

### Mobile Optimization

- Touch gesture support and responsive controls
- Battery usage optimization
- Performance scaling for different device capabilities
- App store compliance and packaging

### Performance Targets

- **Desktop**: 60 FPS at 1080p resolution
- **Mobile**: 60 FPS on mid-range devices, 30 FPS minimum on low-end
- **Loading**: Initial load under 5 seconds, level transitions under 2 seconds
- **Memory**: Under 100MB total usage, under 50MB per level

## Success Metrics for Game Development

### Technical Metrics

- Frame rate consistency (>90% of time at target FPS)
- Memory usage within budgets
- Loading time targets met
- Zero critical bugs in core gameplay systems

### Player Experience Metrics

- Tutorial completion rate >80%
- Level completion rates appropriate for difficulty curve
- Average session length meets design targets
- Player retention and engagement metrics

### Development Process Metrics

- Story completion within estimated timeframes
- Code quality metrics (test coverage, linting compliance)
- Documentation completeness and accuracy
- Team velocity and delivery consistency

## Common Game Development Patterns

### Scene Management

- Boot scene for initial setup and configuration
- Preload scene for asset loading with progress feedback
- Menu scene for navigation and settings
- Game scenes for actual gameplay
- Clean transitions between scenes with proper cleanup

### Game State Management

- Persistent data (player progress, unlocks, settings)
- Session data (current level, score, temporary state)
- Save/load system with error recovery
- Settings management with platform storage

### Input Handling

- Cross-platform input abstraction
- Touch gesture support for mobile
- Keyboard and gamepad support for desktop
- Customizable control schemes

### Performance Optimization

- Object pooling for bullets, effects, enemies
- Texture atlasing and sprite optimization
- Audio compression and streaming
- Culling and level-of-detail systems
- Memory management and garbage collection optimization

This knowledge base provides the foundation for effective game development using the BMad-Method framework with specialized focus on 2D game creation using Phaser 3 and TypeScript.
