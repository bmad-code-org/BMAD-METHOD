# Validate Game Story Task

## Purpose

To comprehensively validate a Godot game development story draft before implementation begins, ensuring it contains all necessary Godot-specific technical context (node architecture, GDScript/C# language strategy, 60+ FPS performance targets), TDD requirements (GUT/GoDotTest), and implementation details. This specialized validation prevents hallucinations, ensures Godot development readiness, and validates game-specific acceptance criteria and testing approaches.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Load Core Configuration and Inputs

- Load `.bmad-godot-game-dev/config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. This file is required for story validation."
- Extract key configurations: `devStoryLocation`, `gdd.*`, `gamearchitecture.*`, `workflow.*`
- Identify and load the following inputs:
  - **Story file**: The drafted game story to validate (provided by user or discovered in `devStoryLocation`)
  - **Parent epic**: The epic containing this story's requirements from GDD
  - **Architecture documents**: Based on configuration (sharded or monolithic)
  - **Game story template**: `expansion-packs/bmad-godot-game-dev/templates/game-story-tmpl.yaml` for completeness validation

### 1. Game Story Template Completeness Validation

- Load `expansion-packs/bmad-godot-game-dev/templates/game-story-tmpl.yaml` and extract all required sections
- **Missing sections check**: Compare story sections against game story template sections to verify all Godot-specific sections are present:
  - Godot Technical Context
  - Node Architecture & Signal Flow
  - Scene (.tscn) & Resource (.tres) Requirements
  - Language Strategy (GDScript vs C#)
  - Performance Requirements (60+ FPS target)
  - Platform Export Settings
  - Integration Points
  - TDD Testing Strategy (GUT for GDScript, GoDotTest for C#)
- **Placeholder validation**: Ensure no template placeholders remain unfilled (e.g., `{{EpicNum}}`, `{{StoryNum}}`, `{{GameMechanic}}`, `_TBD_`)
- **Game-specific sections**: Verify presence of Godot development specific sections
- **Structure compliance**: Verify story follows game story template structure and formatting

### 2. Godot Project Structure and Resource Validation

- **Godot file paths clarity**: Are Godot-specific paths clearly specified (res://, scenes/, scripts/, resources/, etc.)?
- **Plugin dependencies**: Are required GDExtensions or addons identified and documented?
- **Scene structure relevance**: Is relevant node hierarchy and scene tree structure included?
- **Scene organization**: Are scene instancing and inheritance patterns clearly specified?
- **Resource pipeline**: Are texture imports, AnimationPlayer resources, and AudioStream assets properly planned?
- **Directory structure**: Do new Godot resources follow project structure according to architecture docs?
- **Custom Resource requirements**: Are Resource classes and export presets identified?
- **Language compliance**: Are GDScript static typing and C# optimization patterns enforced?

### 3. Godot Node Architecture Validation

- **Node class specifications**: Are custom node classes (extending Node2D, Control, etc.) sufficiently detailed?
- **Node dependencies**: Are node relationships and signal connections clearly mapped?
- **Godot lifecycle usage**: Are \_ready(), \_process(), \_physics_process() methods appropriately planned?
- **Signal system integration**: Are signal emissions, connections, and custom signals specified?
- **Export variable requirements**: Are @export variables and inspector settings clear?
- **Node interfaces**: Are required node groups and inheritance patterns defined?
- **Performance considerations**: Are process modes optimized (\_process vs \_physics_process, static typing enforced)?

### 4. Game Mechanics and Systems Validation

- **Core loop integration**: Does the story properly integrate with established game core loop?
- **Player input handling**: Are InputMap actions and device handling requirements specified?
- **Game state management**: Are state transitions and save/load system requirements clear?
- **UI/UX integration**: Are Control nodes, anchoring, and theme system requirements defined?
- **Audio integration**: Are AudioStreamPlayer nodes, bus routing, and sound pooling specified?
- **Animation systems**: Are AnimationPlayer, AnimationTree, and transition requirements clear?
- **Physics integration**: Are RigidBody2D/3D, collision layers, and physics settings specified?
- **Object pooling**: Are pooling strategies defined for frequently spawned entities?

### 5. Godot-Specific Acceptance Criteria Assessment

- **TDD testing**: Are GUT (GDScript) and GoDotTest (C#) tests defined for all criteria?
- **Visual validation**: Are visual/aesthetic acceptance criteria measurable and testable?
- **Performance criteria**: Is 60+ FPS target specified with frame time <16.67ms?
- **Platform compatibility**: Are export template requirements for different platforms addressed?
- **Input validation**: Are InputMap actions for keyboard, gamepad, and touch covered?
- **Audio criteria**: Are audio bus levels, stream players, and audio pooling specified?
- **Animation validation**: Are AnimationPlayer smoothness, timing, and blend requirements defined?

### 6. Godot Testing and Validation Instructions Review

- **TDD Framework**: Are GUT and GoDotTest approaches with Red-Green-Refactor cycle specified?
- **Performance profiling**: Are Godot Profiler usage and 60+ FPS validation steps defined?
- **Export testing**: Are export template validation steps for target platforms specified?
- **Scene testing**: Are scene instancing, transitions, and signal flow testing approaches clear?
- **Resource validation**: Are texture compression, import settings, and pooling tests defined?
- **Platform testing**: Are platform-specific export settings and input methods specified?
- **Memory leak testing**: Are signal cleanup and node lifecycle validation steps included?

### 7. Godot Performance and Optimization Validation

- **Frame rate targets**: Is 60+ FPS minimum clearly specified for all platforms?
- **Memory budgets**: Are scene memory, resource memory, and pooling limits defined?
- **Draw call optimization**: Are rendering batches and viewport optimization approaches specified?
- **Mobile performance**: Are mobile export settings and touch optimization addressed?
- **Resource optimization**: Are import settings, compression, and preloading strategies clear?
- **Language optimization**: Are static typing (GDScript) and C# patterns (no LINQ) specified?
- **Loading time targets**: Are scene transitions <3 seconds and resource streaming defined?

### 8. Godot Platform and Export Considerations

- **Export templates**: Are platform-specific export templates and settings documented?
- **Platform features**: Are platform-specific Godot features properly configured?
- **Data persistence**: Are user:// path usage and save system requirements specified?
- **Input handling**: Are InputMap configurations for each platform defined?
- **Performance targets**: Are platform-specific 60+ FPS optimizations addressed?
- **Export security**: Are release vs debug export settings properly configured?

### 9. Godot Development Task Sequence Validation

- **TDD workflow order**: Do tasks follow TDD cycle (write tests first, then implement, then refactor)?
- **Node hierarchy dependencies**: Are parent nodes created before child nodes?
- **Resource dependencies**: Are resources created before scenes that use them?
- **Signal connections**: Are signal emitters created before receivers?
- **Testing integration**: Are GUT/GoDotTest creation tasks before implementation?
- **Export integration**: Are export preset configurations properly sequenced?
- **Performance validation**: Are profiling checkpoints placed throughout development?

### 10. Godot Anti-Hallucination Verification

- **Godot API accuracy**: Every Godot API reference must be verified against current Godot documentation
- **Plugin verification**: All GDExtension and addon references must be valid
- **Node architecture alignment**: Node relationships must match architecture specifications
- **Performance claims verification**: 60+ FPS targets must be realistic for target platforms
- **Resource pipeline accuracy**: All import settings and resource configurations must be valid
- **Language strategy verification**: GDScript vs C# choices must align with performance needs

### 11. Godot Development Agent Implementation Readiness

- **Godot context completeness**: Can the story be implemented without consulting external Godot documentation?
- **Language specification clarity**: Are GDScript/C# choices and patterns unambiguous?
- **Resource requirements clarity**: Are all resources, scenes, and import settings defined?
- **Node relationship clarity**: Are all node interactions and signal flows explicitly defined?
- **TDD approach completeness**: Are GUT/GoDotTest approaches fully specified?
- **Performance validation readiness**: Are 60+ FPS validation approaches clearly defined?

### 12. Generate Godot Game Story Validation Report

Provide a structured validation report including:

#### Game Story Template Compliance Issues

- Missing Godot-specific sections from game story template
- Unfilled placeholders or template variables specific to game development
- Missing node specifications or resource requirements
- Missing TDD test specifications (GUT/GoDotTest)
- Language strategy gaps (GDScript vs C# decisions)

#### Critical Godot Issues (Must Fix - Story Blocked)

- Missing essential Godot technical information for implementation
- No TDD test specifications (GUT/GoDotTest)
- Performance targets not meeting 60+ FPS requirement
- Missing language strategy (GDScript vs C# choices)
- Incomplete node architecture or signal flow
- Missing object pooling for spawned entities

#### Godot-Specific Should-Fix Issues (Important Quality Improvements)

- Unclear node hierarchy or signal connection patterns
- Missing static typing in GDScript specifications
- Incomplete resource pipeline or import settings
- Task sequencing not following TDD cycle
- Missing platform export template specifications
- Inadequate performance profiling checkpoints

#### Game Development Nice-to-Have Improvements (Optional Enhancements)

- Additional Godot performance optimization context
- Enhanced resource creation guidance and best practices
- Clarifications for Godot-specific patterns (signals, groups)
- Additional platform export considerations
- Enhanced profiler usage guidance

#### Godot Anti-Hallucination Findings

- Unverifiable Godot API claims or outdated references
- Wrong language choice justifications (GDScript vs C#)
- Inconsistencies with Godot project architecture documents
- Invented nodes, signals, or development patterns
- Performance claims not achieving 60+ FPS
- Missing static typing or optimization patterns

#### Godot Platform and Performance Validation

- **Performance Assessment**: 60+ FPS validation, frame time <16.67ms
- **Platform Compatibility Check**: Export templates, InputMap, platform features
- **Resource Pipeline Validation**: Import settings, compression, pooling strategies
- **Godot Version Compliance**: Compatibility with Godot 4.x or 3.x LTS
- **Language Performance**: Static typing enforcement, C# optimization patterns

#### Final Godot Game Development Assessment

- **GO**: Story ready for Godot implementation with TDD and 60+ FPS targets
- **NO-GO**: Story requires Godot-specific fixes before implementation
- **TDD Readiness Score**: 1-10 scale based on test coverage planning
- **Performance Readiness**: Can maintain 60+ FPS? Yes/No/Unknown
- **Language Strategy Score**: 1-10 scale for GDScript/C# appropriateness
- **Platform Export Readiness**: Assessment of export template preparedness

#### Recommended Next Steps

Based on validation results, provide specific recommendations for:

- Godot technical documentation improvements needed
- TDD test specifications (GUT/GoDotTest) to add
- Language strategy clarifications (GDScript vs C#)
- Performance profiling setup for 60+ FPS validation
- Platform export template configuration needs
- Object pooling implementation requirements
