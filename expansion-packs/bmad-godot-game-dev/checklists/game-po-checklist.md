# Game Product Owner (PO) Master Validation Checklist (Godot)

This checklist serves as a comprehensive framework for the Game Product Owner to validate game project plans before Godot development execution. It adapts based on project type (new game vs existing game enhancement) and includes platform considerations.

[[LLM: INITIALIZATION INSTRUCTIONS - GAME PO MASTER CHECKLIST

PROJECT TYPE DETECTION:
First, determine the game project type by checking:

1. Is this a NEW GAME project (greenfield)?
   - Look for: New Godot project initialization, no existing game code
   - Check for: game-design-doc.md, architecture.md, new game setup
   - Godot version selection (4.x vs 3.x)

2. Is this an EXISTING GAME enhancement (brownfield)?
   - Look for: References to existing Godot project, enhancement language
   - Check for: existing .godot folder, project.godot file
   - Existing scenes, scripts, and resources

3. What platforms are targeted?
   - Desktop (Windows/Mac/Linux)
   - Mobile (iOS/Android)
   - Web (HTML5)
   - Console (requires special export templates)

DOCUMENT REQUIREMENTS:
Based on project type, ensure you have access to:

For NEW GAME projects:

- game-design-doc.md - The Game Design Document
- architecture.md - The technical architecture
- platform-requirements.md - Platform specifications
- All epic and story definitions

For EXISTING GAME enhancements:

- enhancement-doc.md - The enhancement requirements
- existing Godot project access (CRITICAL)
- Current performance metrics
- Player feedback and analytics data
- Existing save game compatibility requirements

SKIP INSTRUCTIONS:

- Skip sections marked [[EXISTING GAME ONLY]] for new games
- Skip sections marked [[NEW GAME ONLY]] for existing games
- Skip sections marked [[MOBILE ONLY]] for desktop-only games
- Note all skipped sections in your final report

VALIDATION APPROACH:

1. Performance Focus - Every decision must support 60+ FPS target
2. Player Experience - Fun and engagement drive all choices
3. Platform Reality - Constraints guide implementation
4. Technical Feasibility - Godot capabilities define boundaries

EXECUTION MODE:
Ask if they want to work through:

- Section by section (interactive) - Review each, get confirmation
- All at once (comprehensive) - Complete analysis, present report]]

## 1. GODOT PROJECT SETUP & INITIALIZATION

[[LLM: Foundation is critical. For new games, ensure proper Godot setup. For existing games, ensure safe integration without breaking current gameplay.]]

### 1.1 New Game Project Setup [[NEW GAME ONLY]]

- [ ] Godot version (4.x or 3.x) explicitly chosen with justification
- [ ] Project.godot initial configuration defined
- [ ] Folder structure follows Godot best practices
- [ ] Initial scene hierarchy planned
- [ ] Version control .gitignore for Godot configured
- [ ] Language strategy decided (GDScript vs C# vs both)

### 1.2 Existing Game Integration [[EXISTING GAME ONLY]]

- [ ] Current Godot version compatibility verified
- [ ] Existing scene structure analyzed and documented
- [ ] Save game compatibility maintained
- [ ] Player progression preservation ensured
- [ ] Performance baseline measured (current FPS)
- [ ] Rollback strategy for each change defined

### 1.3 Development Environment

- [ ] Godot Editor version specified and installed
- [ ] .NET/Mono setup for C# development (if needed)
- [ ] Export templates downloaded for target platforms
- [ ] Asset import presets configured
- [ ] Editor settings standardized across team
- [ ] Performance profiling tools configured

### 1.4 Core Game Systems

- [ ] Autoload/singleton architecture defined early
- [ ] Input mapping configured for all platforms
- [ ] Audio bus layout established
- [ ] Scene transition system implemented
- [ ] Save/load system architecture defined
- [ ] [[EXISTING GAME ONLY]] Compatibility with existing systems verified

## 2. GAME ARCHITECTURE & PERFORMANCE

[[LLM: Architecture determines performance. Every system must support 60+ FPS target. Language choices (GDScript vs C#) impact performance.]]

### 2.1 Scene & Node Architecture

- [ ] Main scene structure defined before implementation
- [ ] Node naming conventions established
- [ ] Scene inheritance patterns planned
- [ ] Packed scenes for reusability identified
- [ ] Signal connections architecture documented
- [ ] [[EXISTING GAME ONLY]] Integration with existing scenes planned

### 2.2 Performance Systems

- [ ] Object pooling for bullets/enemies/particles planned
- [ ] LOD system for complex scenes defined
- [ ] Occlusion culling strategy established
- [ ] Draw call batching approach documented
- [ ] Memory budget per scene defined
- [ ] [[MOBILE ONLY]] Mobile-specific optimizations planned

### 2.3 Language Strategy

- [ ] GDScript systems identified (rapid iteration needs)
- [ ] C# systems identified (performance-critical code)
- [ ] Interop boundaries minimized and defined
- [ ] Static typing enforced in GDScript for performance
- [ ] [[EXISTING GAME ONLY]] Migration path from existing code

### 2.4 Resource Management

- [ ] Custom Resource classes for game data defined
- [ ] Texture import settings standardized
- [ ] Audio compression settings optimized
- [ ] Mesh and material optimization planned
- [ ] Asset loading strategy (preload vs lazy load)

## 3. PLATFORM & DEPLOYMENT

[[LLM: Platform constraints drive many decisions. Mobile has strict performance limits. Web has size constraints. Consoles need certification.]]

### 3.1 Platform Requirements

- [ ] Target platforms explicitly listed with priorities
- [ ] Minimum hardware specifications defined
- [ ] Platform-specific features identified
- [ ] Control schemes per platform defined
- [ ] Performance targets per platform (60 FPS minimum)
- [ ] [[MOBILE ONLY]] Touch controls and gestures designed

### 3.2 Export Configuration

- [ ] Export presets created for each platform
- [ ] Platform-specific settings configured
- [ ] Icon and splash screens prepared
- [ ] Code signing requirements identified
- [ ] [[MOBILE ONLY]] App store requirements checked
- [ ] [[WEB ONLY]] Browser compatibility verified

### 3.3 Build Pipeline

- [ ] Automated build process using Godot headless
- [ ] Version numbering strategy defined
- [ ] Build size optimization planned
- [ ] Platform-specific optimizations configured
- [ ] [[EXISTING GAME ONLY]] Patch/update system maintained

### 3.4 Testing Infrastructure

- [ ] GUT framework setup for GDScript tests
- [ ] GoDotTest configured for C# tests
- [ ] Performance testing benchmarks defined
- [ ] Platform testing matrix created
- [ ] [[EXISTING GAME ONLY]] Regression testing for existing features

## 4. GAME FEATURES & CONTENT

[[LLM: Features must be fun AND performant. Every feature impacts frame rate. Content must be optimized for target platforms.]]

### 4.1 Core Gameplay Features

- [ ] Core loop implemented with performance validation
- [ ] Player controls responsive (<50ms input latency)
- [ ] Game state management efficient
- [ ] Progression systems data-driven
- [ ] [[EXISTING GAME ONLY]] New features integrated smoothly

### 4.2 Content Pipeline

- [ ] Level/scene creation workflow defined
- [ ] Asset production pipeline established
- [ ] Localization system implemented
- [ ] Content validation process created
- [ ] [[EXISTING GAME ONLY]] Content compatibility ensured

### 4.3 Multiplayer Systems [[IF APPLICABLE]]

- [ ] Network architecture (P2P vs dedicated) chosen
- [ ] RPC usage planned and optimized
- [ ] State synchronization strategy defined
- [ ] Lag compensation implemented
- [ ] Bandwidth requirements validated

## 5. PLAYER EXPERIENCE & MONETIZATION

[[LLM: Player experience drives retention. Monetization must be ethical and balanced. Performance must never suffer for monetization.]]

### 5.1 Player Journey

- [ ] Onboarding experience optimized
- [ ] Tutorial system non-intrusive
- [ ] Difficulty curve properly balanced
- [ ] Progression feels rewarding
- [ ] [[EXISTING GAME ONLY]] Existing player experience preserved

### 5.2 Monetization Strategy [[IF APPLICABLE]]

- [ ] Monetization model clearly defined
- [ ] IAP implementation planned
- [ ] Ad integration performance impact assessed
- [ ] Economy balanced for free and paying players
- [ ] [[EXISTING GAME ONLY]] Existing economy not disrupted

### 5.3 Analytics & Metrics

- [ ] Key metrics identified (retention, engagement)
- [ ] Analytics integration planned
- [ ] Performance tracking implemented
- [ ] A/B testing framework considered
- [ ] [[EXISTING GAME ONLY]] Historical data preserved

## 6. QUALITY & PERFORMANCE VALIDATION

[[LLM: Quality determines success. Performance determines playability. Testing prevents player frustration.]]

### 6.1 Performance Standards

- [ ] 60+ FPS target on all platforms confirmed
- [ ] Frame time budget per system defined
- [ ] Memory usage limits established
- [ ] Load time targets set (<3 seconds)
- [ ] Battery usage optimized for mobile

### 6.2 Testing Strategy

- [ ] Unit tests for game logic (GUT/GoDotTest)
- [ ] Integration tests for scenes
- [ ] Performance tests automated
- [ ] Playtesting schedule defined
- [ ] [[EXISTING GAME ONLY]] Regression testing comprehensive

### 6.3 Polish & Game Feel

- [ ] Juice and polish planned
- [ ] Particle effects budgeted
- [ ] Screen shake and effects optimized
- [ ] Audio feedback immediate
- [ ] Visual feedback responsive

## 7. RISK MANAGEMENT

[[LLM: Games fail from poor performance, bugs, or lack of fun. Identify and mitigate risks early.]]

### 7.1 Technical Risks

- [ ] Performance bottlenecks identified
- [ ] Platform limitations acknowledged
- [ ] Third-party dependencies minimized
- [ ] Godot version stability assessed
- [ ] [[EXISTING GAME ONLY]] Breaking change risks evaluated

### 7.2 Game Design Risks

- [ ] Fun factor validation planned
- [ ] Difficulty spike risks identified
- [ ] Player frustration points addressed
- [ ] Monetization balance risks assessed
- [ ] [[EXISTING GAME ONLY]] Player backlash risks considered

### 7.3 Mitigation Strategies

- [ ] Performance fallbacks defined
- [ ] Feature flags for risky features
- [ ] Rollback procedures documented
- [ ] Player communication plan ready
- [ ] [[EXISTING GAME ONLY]] Save game migration tested

## 8. MVP SCOPE & PRIORITIES

[[LLM: MVP means Minimum VIABLE Product. Must be fun, performant, and complete. No half-features.]]

### 8.1 Core Features

- [ ] Essential gameplay features identified
- [ ] Nice-to-have features deferred
- [ ] Complete player journey possible
- [ ] All platforms equally playable
- [ ] [[EXISTING GAME ONLY]] Enhancement value justified

### 8.2 Content Scope

- [ ] Minimum viable content defined
- [ ] Vertical slice fully polished
- [ ] Replayability considered
- [ ] Content production realistic
- [ ] [[EXISTING GAME ONLY]] Existing content maintained

### 8.3 Technical Scope

- [ ] Performance targets achievable
- [ ] Platform requirements met
- [ ] Testing coverage adequate
- [ ] Technical debt acceptable
- [ ] [[EXISTING GAME ONLY]] Integration complexity managed

## 9. TEAM & TIMELINE

[[LLM: Game development is iterative. Teams need clear milestones. Realistic timelines prevent crunch.]]

### 9.1 Development Phases

- [ ] Prototype phase defined (core loop)
- [ ] Production phase planned (content creation)
- [ ] Polish phase allocated (juice and optimization)
- [ ] Certification time included (if console)
- [ ] [[EXISTING GAME ONLY]] Integration phases defined

### 9.2 Team Capabilities

- [ ] Godot expertise adequate
- [ ] GDScript/C# skills matched to needs
- [ ] Art pipeline capabilities confirmed
- [ ] Testing resources allocated
- [ ] [[EXISTING GAME ONLY]] Domain knowledge preserved

## 10. POST-LAUNCH CONSIDERATIONS

[[LLM: Games are living products. Plan for success. Updates and content keep players engaged.]]

### 10.1 Live Operations

- [ ] Update delivery mechanism planned
- [ ] Content pipeline sustainable
- [ ] Bug fix process defined
- [ ] Player support prepared
- [ ] [[EXISTING GAME ONLY]] Compatibility maintained

### 10.2 Future Content

- [ ] DLC/expansion architecture supports
- [ ] Season pass structure considered
- [ ] Event system architecture ready
- [ ] Community features planned
- [ ] [[EXISTING GAME ONLY]] Expansion doesn't break base game

## VALIDATION SUMMARY

[[LLM: FINAL GAME PO VALIDATION REPORT

Generate comprehensive validation report:

1. Executive Summary
   - Project type: [New Game/Game Enhancement]
   - Target platforms: [List]
   - Performance risk: [High/Medium/Low]
   - Go/No-Go recommendation
   - Language strategy assessment (GDScript/C#)

2. Performance Analysis
   - 60 FPS achievability per platform
   - Memory budget compliance
   - Load time projections
   - Battery impact (mobile)
   - Optimization opportunities

3. Player Experience Assessment
   - Fun factor validation
   - Progression balance
   - Monetization ethics
   - Retention projections
   - [EXISTING GAME] Player disruption

4. Technical Readiness
   - Godot architecture completeness
   - Language strategy appropriateness
   - Testing coverage adequacy
   - Platform requirements met
   - [EXISTING GAME] Integration complexity

5. Risk Assessment
   - Top 5 risks by severity
   - Performance bottlenecks
   - Platform constraints
   - Timeline concerns
   - Mitigation recommendations

6. MVP Validation
   - Core loop completeness
   - Platform parity
   - Content sufficiency
   - Polish level adequacy
   - True MVP vs over-scope

7. Recommendations
   - Must-fix before development
   - Should-fix for quality
   - Consider for improvement
   - Post-launch additions

Ask if user wants:

- Detailed performance analysis
- Platform-specific deep dive
- Risk mitigation strategies
- Timeline optimization suggestions]]

### Category Statuses

| Category                      | Status | Critical Issues |
| ----------------------------- | ------ | --------------- |
| 1. Godot Project Setup        | _TBD_  |                 |
| 2. Architecture & Performance | _TBD_  |                 |
| 3. Platform & Deployment      | _TBD_  |                 |
| 4. Game Features & Content    | _TBD_  |                 |
| 5. Player Experience          | _TBD_  |                 |
| 6. Quality & Performance      | _TBD_  |                 |
| 7. Risk Management            | _TBD_  |                 |
| 8. MVP Scope                  | _TBD_  |                 |
| 9. Team & Timeline            | _TBD_  |                 |
| 10. Post-Launch               | _TBD_  |                 |

### Critical Performance Risks

(To be populated during validation)

### Platform-Specific Concerns

(To be populated during validation)

### Final Decision

- **APPROVED**: Game plan is comprehensive, performant, and ready for Godot development
- **CONDITIONAL**: Plan requires specific adjustments for performance/platform requirements
- **REJECTED**: Plan requires significant revision to meet quality and performance standards
