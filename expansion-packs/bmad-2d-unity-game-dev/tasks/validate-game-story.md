<!-- Powered by BMAD™ Core -->

# Validate Game Story Task

## Purpose

To comprehensively validate a Unity 2D game development story draft before implementation begins, ensuring it contains all necessary Unity-specific technical context, game development requirements, and implementation details. This specialized validation prevents hallucinations, ensures Unity development readiness, and validates game-specific acceptance criteria and testing approaches.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Load Core Configuration and Inputs

- Load `{root}/core-config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. This file is required for story validation."
- Extract key configurations: `devStoryLocation`, `gdd.*`, `gamearchitecture.*`, `workflow.*`
- Identify and load the following inputs:
  - **Story file**: The drafted game story to validate (provided by user or discovered in `devStoryLocation`)
  - **Parent epic**: The epic containing this story's requirements from GDD
  - **Architecture documents**: Based on configuration (sharded or monolithic)
  - **Game story template**: `expansion-packs/bmad-2d-unity-game-dev/templates/game-story-tmpl.yaml` for completeness validation

### 1. Game Story Template Completeness Validation

- Load `expansion-packs/bmad-2d-unity-game-dev/templates/game-story-tmpl.yaml` and extract all required sections
- **Missing sections check**: Compare story sections against game story template sections to verify all Unity-specific sections are present:
  - Unity Technical Context
  - Component Architecture
  - Scene & Prefab Requirements
  - Asset Dependencies
  - Performance Requirements
  - Platform Considerations
  - Integration Points
  - Testing Strategy (Unity Test Framework)
- **Placeholder validation**: Ensure no template placeholders remain unfilled (e.g., `{{EpicNum}}`, `{{StoryNum}}`, `{{GameMechanic}}`, `_TBD_`)
- **Game-specific sections**: Verify presence of Unity development specific sections
- **Structure compliance**: Verify story follows game story template structure and formatting

### 2. Unity Project Structure and Asset Validation

- **Unity file paths clarity**: Are Unity-specific paths clearly specified (Assets/, Scripts/, Prefabs/, Scenes/, etc.)?
- **Package dependencies**: Are required Unity packages identified and version-locked?
- **Scene structure relevance**: Is relevant scene hierarchy and GameObject structure included?
- **Prefab organization**: Are prefab creation/modification requirements clearly specified?
- **Asset pipeline**: Are sprite imports, animation controllers, and audio assets properly planned?
- **Directory structure**: Do new Unity assets follow project structure according to architecture docs?
- **ScriptableObject requirements**: Are data containers and configuration objects identified?
- **Namespace compliance**: Are C# namespaces following project conventions?

### 3. Unity Component Architecture Validation

- **MonoBehaviour specifications**: Are Unity component classes sufficiently detailed for implementation?
- **Component dependencies**: Are Unity component interdependencies clearly mapped?
- **Unity lifecycle usage**: Are Start(), Update(), Awake() methods appropriately planned?
- **Event system integration**: Are UnityEvents, C# events, or custom messaging systems specified?
- **Serialization requirements**: Are [SerializeField] and public field requirements clear?
- **Component interfaces**: Are required interfaces and abstract base classes defined?
- **Performance considerations**: Are component update patterns optimized (Update vs FixedUpdate vs coroutines)?

### 4. Game Mechanics and Systems Validation

- **Core loop integration**: Does the story properly integrate with established game core loop?
- **Player input handling**: Are input mappings and input system requirements specified?
- **Game state management**: Are state transitions and persistence requirements clear?
- **UI/UX integration**: Are Canvas setup, UI components, and player feedback systems defined?
- **Audio integration**: Are AudioSource, AudioMixer, and sound effect requirements specified?
- **Animation systems**: Are Animator Controllers, Animation Clips, and transition requirements clear?
- **Physics integration**: Are Rigidbody2D, Collider2D, and physics material requirements specified?

### 5. Unity-Specific Acceptance Criteria Assessment

- **Functional testing**: Can all acceptance criteria be tested within Unity's Play Mode?
- **Visual validation**: Are visual/aesthetic acceptance criteria measurable and testable?
- **Performance criteria**: Are frame rate, memory usage, and build size criteria specified?
- **Platform compatibility**: Are mobile vs desktop specific acceptance criteria addressed?
- **Input validation**: Are different input methods (touch, keyboard, gamepad) covered?
- **Audio criteria**: Are audio mixing levels, sound trigger timing, and audio quality specified?
- **Animation validation**: Are animation smoothness, timing, and visual polish criteria defined?

### 6. Unity Testing and Validation Instructions Review

- **Unity Test Framework**: Are EditMode and PlayMode test approaches clearly specified?
- **Performance profiling**: Are Unity Profiler usage and performance benchmarking steps defined?
- **Build testing**: Are build process validation steps for target platforms specified?
- **Scene testing**: Are scene loading, unloading, and transition testing approaches clear?
- **Asset validation**: Are texture compression, audio compression, and asset optimization tests defined?
- **Platform testing**: Are device-specific testing requirements (mobile performance, input methods) specified?
- **Memory leak testing**: Are Unity memory profiling and leak detection steps included?

### 7. Unity Performance and Optimization Validation

- **Frame rate targets**: Are target FPS requirements clearly specified for different platforms?
- **Memory budgets**: Are texture memory, audio memory, and runtime memory limits defined?
- **Draw call optimization**: Are batching strategies and draw call reduction approaches specified?
- **Mobile performance**: Are mobile-specific performance considerations (battery, thermal) addressed?
- **Asset optimization**: Are texture compression, audio compression, and mesh optimization requirements clear?
- **Garbage collection**: Are GC-friendly coding patterns and object pooling requirements specified?
- **Loading time targets**: Are scene loading and asset streaming performance requirements defined?

### 8. Unity Security and Platform Considerations (if applicable)

- **Platform store requirements**: Are app store guidelines and submission requirements addressed?
- **Data privacy**: Are player data storage and analytics integration requirements specified?
- **Platform integration**: Are platform-specific features (achievements, leaderboards) requirements clear?
- **Content filtering**: Are age rating and content appropriateness considerations addressed?
- **Anti-cheat considerations**: Are client-side validation and server communication security measures specified?
- **Build security**: Are code obfuscation and asset protection requirements defined?

### 9. Unity Development Task Sequence Validation

- **Unity workflow order**: Do tasks follow proper Unity development sequence (prefabs before scenes, scripts before UI)?
- **Asset creation dependencies**: Are asset creation tasks properly ordered (sprites before animations, audio before mixers)?
- **Component dependencies**: Are script dependencies clear and implementation order logical?
- **Testing integration**: Are Unity test creation and execution properly sequenced with development tasks?
- **Build integration**: Are build process tasks appropriately placed in development sequence?
- **Platform deployment**: Are platform-specific build and deployment tasks properly sequenced?

### 10. Unity Anti-Hallucination Verification

- **Unity API accuracy**: Every Unity API reference must be verified against current Unity documentation
- **Package version verification**: All Unity package references must specify valid versions
- **Component architecture alignment**: Unity component relationships must match architecture specifications
- **Performance claims verification**: All performance targets must be realistic and based on platform capabilities
- **Asset pipeline accuracy**: All asset import settings and pipeline configurations must be valid
- **Platform capability verification**: All platform-specific features must be verified as available on target platforms

### 11. Unity Development Agent Implementation Readiness

- **Unity context completeness**: Can the story be implemented without consulting external Unity documentation?
- **Technical specification clarity**: Are all Unity-specific implementation details unambiguous?
- **Asset requirements clarity**: Are all required assets, their specifications, and import settings clearly defined?
- **Component relationship clarity**: Are all Unity component interactions and dependencies explicitly defined?
- **Testing approach completeness**: Are Unity-specific testing approaches fully specified and actionable?
- **Performance validation readiness**: Are all performance testing and optimization approaches clearly defined?

### 12. Generate Unity Game Story Validation Report

Provide a structured validation report including:

#### Game Story Template Compliance Issues

- Missing Unity-specific sections from game story template
- Unfilled placeholders or template variables specific to game development
- Missing Unity component specifications or asset requirements
- Structural formatting issues in game-specific sections

#### Critical Unity Issues (Must Fix - Story Blocked)

- Missing essential Unity technical information for implementation
- Inaccurate or unverifiable Unity API references or package dependencies
- Incomplete game mechanics or systems integration
- Missing required Unity testing framework specifications
- Performance requirements that are unrealistic or unmeasurable

#### Unity-Specific Should-Fix Issues (Important Quality Improvements)

- Unclear Unity component architecture or dependency relationships
- Missing platform-specific performance considerations
- Incomplete asset pipeline specifications or optimization requirements
- Task sequencing problems specific to Unity development workflow
- Missing Unity Test Framework integration or testing approaches

#### Game Development Nice-to-Have Improvements (Optional Enhancements)

- Additional Unity performance optimization context
- Enhanced asset creation guidance and best practices
- Clarifications for Unity-specific development patterns
- Additional platform compatibility considerations
- Enhanced debugging and profiling guidance

#### Unity Anti-Hallucination Findings

- Unverifiable Unity API claims or outdated Unity references
- Missing Unity package version specifications
- Inconsistencies with Unity project architecture documents
- Invented Unity components, packages, or development patterns
- Unrealistic performance claims or platform capability assumptions

#### Unity Platform and Performance Validation

- **Mobile Performance Assessment**: Frame rate targets, memory usage, and thermal considerations
- **Platform Compatibility Check**: Input methods, screen resolutions, and platform-specific features
- **Asset Pipeline Validation**: Texture compression, audio formats, and build size considerations
- **Unity Version Compliance**: Compatibility with specified Unity version and package versions

#### Final Unity Game Development Assessment

- **GO**: Story is ready for Unity implementation with all technical context
- **NO-GO**: Story requires Unity-specific fixes before implementation
- **Unity Implementation Readiness Score**: 1-10 scale based on Unity technical completeness
- **Game Development Confidence Level**: High/Medium/Low for successful Unity implementation
- **Platform Deployment Readiness**: Assessment of multi-platform deployment preparedness
- **Performance Optimization Readiness**: Assessment of performance testing and optimization preparedness

#### Recommended Next Steps

Based on validation results, provide specific recommendations for:

- Unity technical documentation improvements needed
- Asset creation or acquisition requirements
- Performance testing and profiling setup requirements
- Platform-specific development environment setup needs
- Unity Test Framework implementation recommendations
