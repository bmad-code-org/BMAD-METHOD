<!-- Powered by BMAD™ Core -->

# Game Architect Solution Validation Checklist

This checklist serves as a comprehensive framework for the Game Architect to validate the technical design and architecture before game development execution. The Game Architect should systematically work through each item, ensuring the game architecture is robust, scalable, performant, and aligned with the Game Design Document requirements.

[[LLM: INITIALIZATION INSTRUCTIONS - REQUIRED ARTIFACTS

Before proceeding with this checklist, ensure you have access to:

1. game-architecture.md - The primary game architecture document (check docs/game-architecture.md)
2. game-design-doc.md - Game Design Document for game requirements alignment (check docs/game-design-doc.md)
3. Any system diagrams referenced in the architecture
4. Unity project structure documentation
5. Game balance and configuration specifications
6. Platform target specifications

IMPORTANT: If any required documents are missing or inaccessible, immediately ask the user for their location or content before proceeding.

GAME PROJECT TYPE DETECTION:
First, determine the game project type by checking:

- Is this a 2D Unity game project?
- What platforms are targeted?
- What are the core game mechanics from the GDD?
- Are there specific performance requirements?

VALIDATION APPROACH:
For each section, you must:

1. Deep Analysis - Don't just check boxes, thoroughly analyze each item against the provided documentation
2. Evidence-Based - Cite specific sections or quotes from the documents when validating
3. Critical Thinking - Question assumptions and identify gaps, not just confirm what's present
4. Performance Focus - Consider frame rate impact and mobile optimization for every architectural decision

EXECUTION MODE:
Ask the user if they want to work through the checklist:

- Section by section (interactive mode) - Review each section, present findings, get confirmation before proceeding
- All at once (comprehensive mode) - Complete full analysis and present comprehensive report at end]]

## 1. GAME DESIGN REQUIREMENTS ALIGNMENT

[[LLM: Before evaluating this section, fully understand the game's core mechanics and player experience from the GDD. What type of gameplay is this? What are the player's primary actions? What must feel responsive and smooth? Keep these in mind as you validate the technical architecture serves the game design.]]

### 1.1 Core Mechanics Coverage

- [ ] Architecture supports all core game mechanics from GDD
- [ ] Technical approaches for all game systems are addressed
- [ ] Player controls and input handling are properly architected
- [ ] Game state management covers all required states
- [ ] All gameplay features have corresponding technical systems

### 1.2 Performance & Platform Requirements

- [ ] Target frame rate requirements are addressed with specific solutions
- [ ] Mobile platform constraints are considered in architecture
- [ ] Memory usage optimization strategies are defined
- [ ] Battery life considerations are addressed
- [ ] Cross-platform compatibility is properly architected

### 1.3 Unity-Specific Requirements Adherence

- [ ] Unity version and LTS requirements are satisfied
- [ ] Unity Package Manager dependencies are specified
- [ ] Target platform build settings are addressed
- [ ] Unity asset pipeline usage is optimized
- [ ] MonoBehaviour lifecycle usage is properly planned

## 2. GAME ARCHITECTURE FUNDAMENTALS

[[LLM: Game architecture must be clear for rapid iteration. As you review this section, think about how a game developer would implement these systems. Are the component responsibilities clear? Would the architecture support quick gameplay tweaks and balancing changes? Look for Unity-specific patterns and clear separation of game logic.]]

### 2.1 Game Systems Clarity

- [ ] Game architecture is documented with clear system diagrams
- [ ] Major game systems and their responsibilities are defined
- [ ] System interactions and dependencies are mapped
- [ ] Game data flows are clearly illustrated
- [ ] Unity-specific implementation approaches are specified

### 2.2 Unity Component Architecture

- [ ] Clear separation between GameObjects, Components, and ScriptableObjects
- [ ] MonoBehaviour usage follows Unity best practices
- [ ] Prefab organization and instantiation patterns are defined
- [ ] Scene management and loading strategies are clear
- [ ] Unity's component-based architecture is properly leveraged

### 2.3 Game Design Patterns & Practices

- [ ] Appropriate game programming patterns are employed (Singleton, Observer, State Machine, etc.)
- [ ] Unity best practices are followed throughout
- [ ] Common game development anti-patterns are avoided
- [ ] Consistent architectural style across game systems
- [ ] Pattern usage is documented with Unity-specific examples

### 2.4 Scalability & Iteration Support

- [ ] Game systems support rapid iteration and balancing changes
- [ ] Components can be developed and tested independently
- [ ] Game configuration changes can be made without code changes
- [ ] Architecture supports adding new content and features
- [ ] System designed for AI agent implementation of game features

## 3. UNITY TECHNOLOGY STACK & DECISIONS

[[LLM: Unity technology choices impact long-term maintainability. For each Unity-specific decision, consider: Is this using Unity's strengths? Will this scale to full production? Are we fighting against Unity's paradigms? Verify that specific Unity versions and package versions are defined.]]

### 3.1 Unity Technology Selection

- [ ] Unity version (preferably LTS) is specifically defined
- [ ] Required Unity packages are listed with versions
- [ ] Unity features used are appropriate for 2D game development
- [ ] Third-party Unity assets are justified and documented
- [ ] Technology choices leverage Unity's 2D toolchain effectively

### 3.2 Game Systems Architecture

- [ ] Game Manager and core systems architecture is defined
- [ ] Audio system using Unity's AudioMixer is specified
- [ ] Input system using Unity's new Input System is outlined
- [ ] UI system using Unity's UI Toolkit or UGUI is determined
- [ ] Scene management and loading architecture is clear
- [ ] Gameplay systems architecture covers core game mechanics and player interactions
- [ ] Component architecture details define MonoBehaviour and ScriptableObject patterns
- [ ] Physics configuration for Unity 2D is comprehensively defined
- [ ] State machine architecture covers game states, player states, and entity behaviors
- [ ] UI component system and data binding patterns are established
- [ ] UI state management across screens and game states is defined
- [ ] Data persistence and save system architecture is fully specified
- [ ] Analytics integration approach is defined (if applicable)
- [ ] Multiplayer architecture is detailed (if applicable)
- [ ] Rendering pipeline configuration and optimization strategies are clear
- [ ] Shader guidelines and performance considerations are documented
- [ ] Sprite management and optimization strategies are defined
- [ ] Particle system architecture and performance budgets are established
- [ ] Audio architecture includes system design and category management
- [ ] Audio mixing configuration with Unity AudioMixer is detailed
- [ ] Sound bank management and asset organization is specified
- [ ] Unity development conventions and best practices are documented

### 3.3 Data Architecture & Game Balance

- [ ] ScriptableObject usage for game data is properly planned
- [ ] Game balance data structures are fully defined
- [ ] Save/load system architecture is specified
- [ ] Data serialization approach is documented
- [ ] Configuration and tuning data management is outlined

### 3.4 Asset Pipeline & Management

- [ ] Sprite and texture management approach is defined
- [ ] Audio asset organization is specified
- [ ] Prefab organization and management is planned
- [ ] Asset loading and memory management strategies are outlined
- [ ] Build pipeline and asset bundling approach is defined

## 4. GAME PERFORMANCE & OPTIMIZATION

[[LLM: Performance is critical for games. This section focuses on Unity-specific performance considerations. Think about frame rate stability, memory allocation, and mobile constraints. Look for specific Unity profiling and optimization strategies.]]

### 4.1 Rendering Performance

- [ ] 2D rendering pipeline optimization is addressed
- [ ] Sprite batching and draw call optimization is planned
- [ ] UI rendering performance is considered
- [ ] Particle system performance limits are defined
- [ ] Target platform rendering constraints are addressed

### 4.2 Memory Management

- [ ] Object pooling strategies are defined for frequently instantiated objects
- [ ] Memory allocation minimization approaches are specified
- [ ] Asset loading and unloading strategies prevent memory leaks
- [ ] Garbage collection impact is minimized through design
- [ ] Mobile memory constraints are properly addressed

### 4.3 Game Logic Performance

- [ ] Update loop optimization strategies are defined
- [ ] Physics system performance considerations are addressed
- [ ] Coroutine usage patterns are optimized
- [ ] Event system performance impact is minimized
- [ ] AI and game logic performance budgets are established

### 4.4 Mobile & Cross-Platform Performance

- [ ] Mobile-specific performance optimizations are planned
- [ ] Battery life optimization strategies are defined
- [ ] Platform-specific performance tuning is addressed
- [ ] Scalable quality settings system is designed
- [ ] Performance testing approach for target devices is outlined

## 5. GAME SYSTEMS RESILIENCE & TESTING

[[LLM: Games need robust systems that handle edge cases gracefully. Consider what happens when the player does unexpected things, when systems fail, or when running on low-end devices. Look for specific testing strategies for game logic and Unity systems.]]

### 5.1 Game State Resilience

- [ ] Save/load system error handling is comprehensive
- [ ] Game state corruption recovery is addressed
- [ ] Invalid player input handling is specified
- [ ] Game system failure recovery approaches are defined
- [ ] Edge case handling in game logic is documented

### 5.2 Unity-Specific Testing

- [ ] Unity Test Framework usage is defined
- [ ] Game logic unit testing approach is specified
- [ ] Play mode testing strategies are outlined
- [ ] Performance testing with Unity Profiler is planned
- [ ] Device testing approach across target platforms is defined

### 5.3 Game Balance & Configuration Testing

- [ ] Game balance testing methodology is defined
- [ ] Configuration data validation is specified
- [ ] A/B testing support is considered if needed
- [ ] Game metrics collection is planned
- [ ] Player feedback integration approach is outlined

## 6. GAME DEVELOPMENT WORKFLOW

[[LLM: Efficient game development requires clear workflows. Consider how designers, artists, and programmers will collaborate. Look for clear asset pipelines, version control strategies, and build processes that support the team.]]

### 6.1 Unity Project Organization

- [ ] Unity project folder structure is clearly defined
- [ ] Asset naming conventions are specified
- [ ] Scene organization and workflow is documented
- [ ] Prefab organization and usage patterns are defined
- [ ] Version control strategy for Unity projects is outlined

### 6.2 Content Creation Workflow

- [ ] Art asset integration workflow is defined
- [ ] Audio asset integration process is specified
- [ ] Level design and creation workflow is outlined
- [ ] Game data configuration process is clear
- [ ] Iteration and testing workflow supports rapid changes

### 6.3 Build & Deployment

- [ ] Unity build pipeline configuration is specified
- [ ] Multi-platform build strategy is defined
- [ ] Build automation approach is outlined
- [ ] Testing build deployment is addressed
- [ ] Release build optimization is planned

## 7. GAME-SPECIFIC IMPLEMENTATION GUIDANCE

[[LLM: Clear implementation guidance prevents game development mistakes. Consider Unity-specific coding patterns, common pitfalls in game development, and clear examples of how game systems should be implemented.]]

### 7.1 Unity C# Coding Standards

- [ ] Unity-specific C# coding standards are defined
- [ ] MonoBehaviour lifecycle usage patterns are specified
- [ ] Coroutine usage guidelines are outlined
- [ ] Event system usage patterns are defined
- [ ] ScriptableObject creation and usage patterns are documented

### 7.2 Game System Implementation Patterns

- [ ] Singleton pattern usage for game managers is specified
- [ ] State machine implementation patterns are defined
- [ ] Observer pattern usage for game events is outlined
- [ ] Object pooling implementation patterns are documented
- [ ] Component communication patterns are clearly defined

### 7.3 Unity Development Environment

- [ ] Unity project setup and configuration is documented
- [ ] Required Unity packages and versions are specified
- [ ] Unity Editor workflow and tools usage is outlined
- [ ] Debug and testing tools configuration is defined
- [ ] Unity development best practices are documented

## 8. GAME CONTENT & ASSET MANAGEMENT

[[LLM: Games require extensive asset management. Consider how sprites, audio, prefabs, and data will be organized, loaded, and managed throughout the game's lifecycle. Look for scalable approaches that work with Unity's asset pipeline.]]

### 8.1 Game Asset Organization

- [ ] Sprite and texture organization is clearly defined
- [ ] Audio asset organization and management is specified
- [ ] Prefab organization and naming conventions are outlined
- [ ] ScriptableObject organization for game data is defined
- [ ] Asset dependency management is addressed

### 8.2 Dynamic Asset Loading

- [ ] Runtime asset loading strategies are specified
- [ ] Asset bundling approach is defined if needed
- [ ] Memory management for loaded assets is outlined
- [ ] Asset caching and unloading strategies are defined
- [ ] Platform-specific asset loading is addressed

### 8.3 Game Content Scalability

- [ ] Level and content organization supports growth
- [ ] Modular content design patterns are defined
- [ ] Content versioning and updates are addressed
- [ ] User-generated content support is considered if needed
- [ ] Content validation and testing approaches are specified

## 9. AI AGENT GAME DEVELOPMENT SUITABILITY

[[LLM: This game architecture may be implemented by AI agents. Review with game development clarity in mind. Are Unity patterns consistent? Is game logic complexity minimized? Would an AI agent understand Unity-specific concepts? Look for clear component responsibilities and implementation patterns.]]

### 9.1 Unity System Modularity

- [ ] Game systems are appropriately sized for AI implementation
- [ ] Unity component dependencies are minimized and clear
- [ ] MonoBehaviour responsibilities are singular and well-defined
- [ ] ScriptableObject usage patterns are consistent
- [ ] Prefab organization supports systematic implementation

### 9.2 Game Logic Clarity

- [ ] Game mechanics are broken down into clear, implementable steps
- [ ] Unity-specific patterns are documented with examples
- [ ] Complex game logic is simplified into component interactions
- [ ] State machines and game flow are explicitly defined
- [ ] Component communication patterns are predictable

### 9.3 Implementation Support

- [ ] Unity project structure templates are provided
- [ ] Component implementation patterns are documented
- [ ] Common Unity pitfalls are identified with solutions
- [ ] Game system testing patterns are clearly defined
- [ ] Performance optimization guidelines are explicit

## 10. PLATFORM & PUBLISHING CONSIDERATIONS

[[LLM: Different platforms have different requirements and constraints. Consider mobile app stores, desktop platforms, and web deployment. Look for platform-specific optimizations and compliance requirements.]]

### 10.1 Platform-Specific Architecture

- [ ] Mobile platform constraints are properly addressed
- [ ] Desktop platform features are leveraged appropriately
- [ ] Web platform limitations are considered if applicable
- [ ] Console platform requirements are addressed if applicable
- [ ] Platform-specific input handling is planned

### 10.2 Publishing & Distribution

- [ ] App store compliance requirements are addressed
- [ ] Platform-specific build configurations are defined
- [ ] Update and patch deployment strategy is planned
- [ ] Platform analytics integration is considered
- [ ] Platform-specific monetization is addressed if applicable

[[LLM: FINAL GAME ARCHITECTURE VALIDATION REPORT

Generate a comprehensive validation report that includes:

1. Executive Summary
   - Overall game architecture readiness (High/Medium/Low)
   - Critical risks for game development
   - Key strengths of the game architecture
   - Unity-specific assessment

2. Game Systems Analysis
   - Pass rate for each major system section
   - Most concerning gaps in game architecture
   - Systems requiring immediate attention
   - Unity integration completeness

3. Performance Risk Assessment
   - Top 5 performance risks for the game
   - Mobile platform specific concerns
   - Frame rate stability risks
   - Memory usage concerns

4. Implementation Recommendations
   - Must-fix items before development
   - Unity-specific improvements needed
   - Game development workflow enhancements

5. AI Agent Implementation Readiness
   - Game-specific concerns for AI implementation
   - Unity component complexity assessment
   - Areas needing additional clarification

6. Game Development Workflow Assessment
   - Asset pipeline completeness
   - Team collaboration workflow clarity
   - Build and deployment readiness
   - Testing strategy completeness

After presenting the report, ask the user if they would like detailed analysis of any specific game system or Unity-specific concerns.]]
