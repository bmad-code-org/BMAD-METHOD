# Changelog

## [6.0.0-alpha.13]

**Release: November 30, 2025**

### 🏗️ Revolutionary Workflow Architecture

**Granular Step-File Workflow System (NEW in alpha.13):**

- **Multi-Menu Support**: Workflows now support granular step-file architecture with dynamic menu generation
- **Sharded Workflows**: Complete conversion of Phase 1 and 2 workflows to stepwise sharded architecture
- **Improved Performance**: Reduced file loading times and eliminated time-based estimates throughout
- **Workflow Builder**: New dedicated workflow builder for creating stepwise workflows
- **PRD Workflow**: First completely reworked sharded workflow resolving Sonnet compatibility issues

**Core Workflow Transformations:**

- Phase 1 and 2 workflows completely converted to sharded step-flow architecture
- UX Design workflow converted to sharded step workflow
- Brainstorming, Research, and Party Mode updated to use sharded step-flow workflows
- Architecture workflows enhanced with step sharding and performance improvements

### 🎯 Code Review & Development Enhancement

**Advanced Code Review System:**

- **Adversarial Code Review**: Quick-dev workflow now recommends adversarial review approach for higher quality
- **Multi-LLM Strategy**: Dev-story workflow recommends different LLM models for code review tasks
- **Agent Compiler Optimization**: Complete handler cleanup and performance improvements

### 🤖 Agent System Revolution

**Universal Custom Agent Support:**

- **Complete IDE Coverage**: Custom agent support extended to ALL remaining IDEs
- **Antigravity IDE Integration**: Added custom agent support with proper gitignore configuration
- **Multiple Source Locations**: Compile agents now checks multiple source locations for better discovery
- **Persona Name Display**: Fixed proper persona names display in custom agent manifests
- **New IDE Support**: Added support for Rovo Dev IDE

**Agent Creation & Management:**

- **Improved Creation Workflow**: Enhanced agent creation workflow with better documentation
- **Parameter Clarity**: Renamed agent-install parameters for better understanding
- **Menu Organization**: BMad Agents menu items logically ordered with optional/recommended/required tags
- **GitHub Migration**: GitHub integration now uses agents folder instead of chatmodes

### 🔧 Phase 4 & Sprint Evolution

**Complete Phase 4 Transformation:**

- **Simplified Architecture**: Phase 4 workflows completely transformed - simpler, faster, better results
- **Sprint Planning Integration**: Unified sprint planning with placeholders for Jira, Linear, and Trello integration
- **Status Management**: Better status loading and updating for Phase 4 artifacts
- **Workflow Reduction**: Phase 4 streamlined to single sprint planning item with clear validation
- **Dynamic Workflows**: All Level 1-3 workflows now dynamically suggest next steps based on context

### 🧪 Testing Infrastructure Expansion

**Playwright Utils Integration:**

- Test Architect now supports `@seontechnologies/playwright-utils` integration
- Installation prompt with `use_playwright_utils` configuration flag
- 11 comprehensive knowledge fragments covering ALL utilities
- Adaptive workflow recommendations across 6 testing workflows
- Production-ready utilities from SEON Technologies integrated with TEA patterns

**Testing Environment:**

- **Web Bundle Support**: Enabled web bundles for test and development environments
- **Test Architecture**: Enhanced test design for architecture level (Phase 3) testing

### 📦 Installation & Configuration

**Installer Improvements:**

- **Cleanup Options**: Installer now allows cleanup of unneeded files during upgrades
- **Username Default**: Installer now defaults to system username for better UX
- **IDE Selection**: Added empty IDE selection warning and promoted Antigravity to recommended
- **NPM Vulnerabilities**: Resolved all npm vulnerabilities for enhanced security
- **Documentation Installation**: Made documentation installation optional to reduce footprint

**Text-to-Speech from AgentVibes optional Integration:**

- **TTS_INJECTION System**: Complete text-to-speech integration via injection system
- **Agent Vibes**: Enhanced with TTS capabilities for voice feedback

### 🛠️ Tool & IDE Updates

**IDE Tool Enhancements:**

- **GitHub Copilot**: Fixed tool names consistency across workflows
- **KiloCode Integration**: Gave kilocode tool proper access to bmad modes
- **Code Quality**: Added radix parameter to parseInt() calls for better reliability
- **Agent Menu Optimization**: Improved agent performance in Claude Code slash commands

### 📚 Documentation & Standards

**Documentation Cleanup:**

- **Installation Guide**: Removed fluff and updated with npx support
- **Workflow Documentation**: Fixed documentation by removing non-existent workflows and Mermaid diagrams
- **Phase Numbering**: Fixed phase numbering consistency throughout documentation
- **Package References**: Corrected incorrect npm package references

**Workflow Compliance:**

- **Validation Checks**: Enhanced workflow validation checks for compliance
- **Product Brief**: Updated to comply with documented workflow standards
- **Status Integration**: Workflow-status can now call workflow-init for better integration

### 🔍 Legacy Workflow Cleanup

**Deprecated Workflows Removed:**

- **Audit Workflow**: Completely removed audit workflow and all associated files
- **Convert Legacy**: Removed legacy conversion utilities
- **Create/Edit Workflows**: Removed old workflow creation and editing workflows
- **Clean Architecture**: Simplified workflow structure by removing deprecated legacy workflows

### 🐛 Technical Fixes

**System Improvements:**

- **File Path Handling**: Fixed various file path issues across workflows
- **Manifest Updates**: Updated manifest to use agents folder structure
- **Web Bundle Configuration**: Fixed web bundle configurations for better compatibility
- **CSV Column Mismatch**: Fixed manifest schema upgrade issues

### ⚠️ Breaking Changes

**Workflow Architecture:**

- All legacy workflows have been removed - ensure you're using the new stepwise sharded workflows
- Phase 4 completely restructured - update any automation expecting old Phase 4 structure
- Epic creation now requires architectural context (moved to Phase 3 in previous release)

**Agent System:**

- Custom agents now require proper compilation - use the new agent creation workflow
- GitHub integration moved from chatmodes to agents folder - update any references

### 📊 Impact Summary

**New in alpha.13:**

- **Stepwise Workflow Architecture**: Complete transformation of all workflows to granular step-file system
- **Universal Custom Agent Support**: Extended to ALL IDEs with improved creation workflow
- **Phase 4 Revolution**: Completely restructured with sprint planning integration
- **Legacy Cleanup**: Removed all deprecated workflows for cleaner system
- **Advanced Code Review**: New adversarial review approach with multi-LLM strategy
- **Text-to-Speech**: Full TTS integration for voice feedback
- **Testing Expansion**: Playwright utils integration across all testing workflows

**Enhanced from alpha.12:**

- **Performance**: Improved file loading and removed time-based estimates
- **Documentation**: Complete cleanup with accurate references
- **Installer**: Better UX with cleanup options and improved defaults
- **Agent System**: More reliable compilation and better persona handling

## [6.0.0-alpha.12]

**Release: November 19, 2025**

### 🐛 Bug Fixes

- Added missing `yaml` dependency to fix `MODULE_NOT_FOUND` error when running `npx bmad-method install`

## [6.0.0-alpha.11]

**Release: November 18, 2025**

This alpha release introduces a complete agent installation system with the new `bmad agent-install` command, vastly improves the BMB agent builder capabilities with comprehensive documentation and reference agents, and refines diagram distribution to better align with BMad Method's core principle: **BMad agents mirror real agile teams**.

### 🎨 Diagram Capabilities Refined and Distributed

**Excalidraw Integration Evolution:**

Building on the excellent Excalidraw integration introduced with the Frame Expert agent, we've refined how diagram capabilities are distributed across the BMad Method ecosystem to better reflect real agile team dynamics.

**The Refinement:**

- The valuable Excalidraw diagramming capabilities have been distributed to the agents who naturally create these artifacts in real teams
- **Architect**: System architecture diagrams, data flow visualizations
- **Product Manager**: Process flowcharts and workflow diagrams
- **UX Designer**: Wireframe creation capabilities
- **Tech Writer**: All diagram types for documentation needs
- **New CIS Agent**: presentation-master for specialized visual communication

**Shared Infrastructure Enhancement:**

- Excalidraw templates, component libraries, and validation patterns elevated to core resources
- Available to both BMM agents AND CIS presentation specialists
- Preserves all the excellent Excalidraw functionality while aligning with natural team roles

### 🚀 New Agent Installation System

**Agent Installation Infrastructure (NEW in alpha.11):**

- `bmad agent-install` CLI command with interactive persona customization
- **YAML → XML compilation engine** with smart handler injection
- Supports Simple (single file), Expert (with sidecars), and Module agents
- Handlebars-style template variable processing
- Automatic manifest tracking and IDE integration
- Source preservation in `_cfg/custom/agents/` for reinstallation

**New Reference Agents Added:**

- **commit-poet**: Poetic git commit message generator (Simple agent example)
- **journal-keeper**: Daily journaling agent with templates (Expert agent example)
- **security-engineer & trend-analyst**: Module agent examples with ecosystem integration

**Critical Persona Field Guidance Added:**

New documentation explaining how LLMs interpret persona fields for better agent quality:

- **role** → "What knowledge, skills, and capabilities do I possess?"
- **identity** → "What background, experience, and context shape my responses?"
- **communication_style** → "What verbal patterns, word choice, and phrasing do I use?"
- **principles** → "What beliefs and operating philosophy drive my choices?"

Key insight: `communication_style` should ONLY describe HOW the agent talks, not WHAT they do

**BMM Agent Voice Enhancement:**

All 9 existing BMM agents enhanced with distinct, memorable communication voices:

- **Mary (analyst)**: "Treats analysis like a treasure hunt - excited by every clue"
- **John (PM)**: "Asks 'WHY?' relentlessly like a detective on a case"
- **Winston (architect)**: "Champions boring technology that actually works"
- **Amelia (dev)**: "Ultra-succinct. Speaks in file paths and AC IDs"
- **Sally (UX)**: "Paints pictures with words, telling user stories that make you FEEL"

### 🔧 Edit-Agent Workflow Comprehensive Enhancement

**Expert Agent Sidecar Support (NEW):**

- Automatically detects and handles Expert agents with multiple files
- Loads and manages templates, data files, knowledge bases
- Smart sidecar analysis: maps references, finds orphans, validates paths
- 5 complete sidecar editing patterns with warm, educational feedback

**7-Step Communication Style Refinement Pattern:**

1. Diagnose current style with red flag word detection
2. Extract non-style content to working copy
3. Discover TRUE communication style through interview questions
4. Craft pure style using presets and reference agents
5. Show before/after transformation with full context
6. Validate against standards (zero red flags)
7. Confirm with user through dramatic reading

**Unified Validation Checklist:**

- Single source of truth: `agent-validation-checklist.md` (160 lines)
- Shared between create-agent and edit-agent workflows
- Comprehensive persona field separation validation
- Expert agent sidecar validation (9 specific checks)
- Common issues and fixes with real examples

### 📚 BMB Agent Builder Enhancement

**Vastly Improved Agent Creation & Editing Capabilities:**

- Create-agent and edit-agent workflows now have accurate, comprehensive documentation
- All context references updated and validated for consistency
- Workflows can now properly guide users through complex agent design decisions

**New Agent Documentation Suite:**

- `understanding-agent-types.md` - Architecture vs capability distinction
- `simple-agent-architecture.md` - Self-contained agents guide
- `expert-agent-architecture.md` - Agents with sidecar files
- `module-agent-architecture.md` - Workflow-integrated agents
- `agent-compilation.md` - YAML → XML transformation process
- `agent-menu-patterns.md` - Menu design patterns
- `communication-presets.csv` - 60 pure communication styles for reference

**New Reference Agents for Learning:**

- Complete working examples of Simple, Expert, and Module agents
- Can be installed directly via the new `bmad agent-install` command
- Serve as both learning resources and ready-to-use agents

### 🎯 Epic Creation Moved to Phase 3 (After Architecture)

**Workflow Sequence Corrected:**

```
Phase 2: PRD → UX Design
Phase 3: Architecture → Epics & Stories ← NOW HERE (technically informed)
```

**Why This Fundamental Change:**

- Epics need architectural context: API contracts, data models, technical decisions
- Stories can reference actual architectural patterns and constraints
- Reduces rewrites when architecture reveals complexity
- Better complexity-based estimation (not time-based)

### 🖥️ New IDE Support

**Google Antigravity IDE Installer:**

- Flattened file naming for proper slash commands (bmad-module-agents-name.md)
- Namespace isolation prevents module conflicts
- Subagent installation support (project or user level)
- Module-specific injection configuration

**Codex CLI Enhancement:**

- Now supports both global and project-specific installation
- CODEX_HOME configuration for multi-project workflows
- OS-specific setup instructions (Unix/Mac/Windows)

### 🏗️ Reference Agents & Standards

**New Reference Agents Provide Clear Examples:**

- **commit-poet.agent.yaml**: Simple agent with pure communication style
- **journal-keeper.agent.yaml**: Expert agent with sidecar file structure
- **security-engineer.agent.yaml**: Module agent for ecosystem integration
- **trend-analyst.agent.yaml**: Module agent with cross-workflow capabilities

**Agent Type Clarification:**

- Clear documentation that agent types (Simple/Expert/Module) describe architecture, not capability
- Module = designed for ecosystem integration, not limited in function

### 🐛 Technical Improvements

**Linting Compliance:**

- Fixed all ESLint warnings across agent tooling
- `'utf-8'` → `'utf8'` (unicorn/text-encoding-identifier-case)
- `hasOwnProperty` → `Object.hasOwn` (unicorn/prefer-object-has-own)
- `JSON.parse(JSON.stringify(...))` → `structuredClone(...)`

**Agent Compilation Engine:**

- Auto-injects frontmatter, activation, handlers, help/exit menu items
- Smart handler inclusion (only includes handlers actually used)
- Proper XML escaping and formatting
- Persona name customization support

### 📊 Impact Summary

**New in alpha.11:**

- **Agent installation system** with `bmad agent-install` CLI command
- **4 new reference agents** (commit-poet, journal-keeper, security-engineer, trend-analyst)
- **Complete agent documentation suite** with 7 new focused guides
- **Expert agent sidecar support** in edit-agent workflow
- **2 new IDE installers** (Google Antigravity, enhanced Codex)
- **Unified validation checklist** (160 lines) for consistent quality standards
- **60 pure communication style presets** for agent persona design

**Enhanced from alpha.10:**

- **BMB agent builder workflows** with accurate context and comprehensive guidance
- **All 9 BMM agents** enhanced with distinct, memorable communication voices
- **Excalidraw capabilities** refined and distributed to role-appropriate agents
- **Epic creation** moved to Phase 3 (after Architecture) for technical context

### ⚠️ Breaking Changes

**Agent Changes:**

- Frame Expert agent retired - diagram capabilities now available through role-appropriate agents:
  - Architecture diagrams → `/architect`
  - Process flows → `/pm`
  - Wireframes → `/ux-designer`
  - Documentation visuals → `/tech-writer`

**Workflow Changes:**

- Epic creation moved from Phase 2 to Phase 3 (after Architecture)
- Excalidraw workflows redistributed to appropriate agents

**Installation Changes:**

- New `bmad agent-install` command replaces manual agent installation
- Agent YAML files must be compiled to XML for use

### 🔄 Migration Notes

**For Existing Projects:**

1. **Frame Expert Users:**
   - Transition to role-appropriate agents for diagrams
   - All Excalidraw functionality preserved and enhanced
   - Shared templates now in core resources for wider access

2. **Agent Installation:**
   - Use `bmad agent-install` for all agent installations
   - Existing manual installations still work but won't have customization

3. **Epic Creation Timing:**
   - Epics now created in Phase 3 after Architecture
   - Update any automation expecting epics in Phase 2

4. **Communication Styles:**
   - Review agent communication_style fields
   - Remove any role/identity/principle content
   - Use communication-presets.csv for pure styles

5. **Expert Agents:**
   - Edit-agent workflow now fully supports sidecar files
   - Organize templates and data files in agent folder

## [6.0.0-alpha.10]

**Release: November 16, 2025**

- **🎯 Epics Generated AFTER Architecture**: Major milestone - epics/stories now created after architecture for technically-informed user stories with better acceptance criteria
- **🎨 Frame Expert Agent**: New Excalidraw specialist with 4 diagram workflows (flowchart, diagram, dataflow, wireframe) for visual documentation
- **⏰ Time Estimate Prohibition**: Critical warnings added across 33 workflows - acknowledges AI has fundamentally changed development speed
- **🎯 Platform-Specific Commands**: New `ide-only`/`web-only` fields filter menu items based on environment (IDE vs web bundle)
- **🔧 Agent Customization**: Enhanced memory/prompts merging via `*.customize.yaml` files for persistent agent personalization

## [6.0.0-alpha.9]

**Release: November 12, 2025**

- **🚀 Intelligent File Discovery Protocol**: New `discover_inputs` with FULL_LOAD, SELECTIVE_LOAD, and INDEX_GUIDED strategies for automatic context loading
- **📚 3-Track System**: Simplified from 5 levels to 3 intuitive tracks: quick-flow, bmad-method, and enterprise-bmad-method
- **🌐 Web Bundles Guide**: Comprehensive documentation for Gemini Gems and Custom GPTs with 60-80% cost savings strategies
- **🏗️ Unified Output Structure**: Eliminated `.ephemeral/` folders - all artifacts now in single configurable output folder
- **🎮 BMGD Phase 4**: Added 10 game development workflows following BMM patterns with game-specific adaptations

## [6.0.0-alpha.8]

**Release: November 9, 2025**

- **🎯 Configurable Installation**: Custom directories with `.bmad` hidden folder default for cleaner project structure
- **🚀 Optimized Agent Loading**: CLI loads from installed files eliminating duplication and maintenance burden
- **🌐 Party Mode Everywhere**: All web bundles include multi-agent collaboration with customizable party configurations
- **🔧 Phase 4 Artifact Separation**: Stories, code reviews, sprint plans now configurable outside docs folder
- **📦 Expanded Web Bundles**: All BMM, BMGD, and CIS agents bundled with advanced elicitation integration

## [6.0.0-alpha.7]

**Release: November 7, 2025**

- **🌐 Workflow Vendoring**: Web bundler performs automatic workflow vendoring for cross-module dependencies
- **🎮 BMGD Module Extraction**: Game development split into standalone module with 4-phase industry-standard structure
- **🔧 Enhanced Dependency Resolution**: Better handling of `web_bundle: false` workflows with positive resolution messages
- **📚 Advanced Elicitation Fix**: Added missing CSV files to workflow bundles fixing runtime failures
- **🐛 Claude Code Fix**: Resolved README slash command installation regression

## [6.0.0-alpha.6]

**Release: November 4, 2025**

- **🐛 Critical Installer Fixes**: Fixed manifestPath error and option display issues blocking installation
- **📖 Conditional Docs Installation**: Optional documentation installation to reduce footprint in production
- **🎨 Improved Installer UX**: Better formatting with descriptive labels and clearer feedback
- **🧹 Issue Tracker Cleanup**: Closed 54 legacy v4 issues for focused v6 development
- **📝 Contributing Updates**: Removed references to non-existent branches in documentation

## [6.0.0-alpha.5]

**Release: November 4, 2025**

- **🎯 3-Track Scale System**: Revolutionary simplification from 5 confusing levels to 3 intuitive preference-driven tracks
- **✨ Elicitation Modernization**: Replaced legacy XML tags with explicit `invoke-task` pattern at strategic decision points
- **📚 PM/UX Evolution Section**: Added November 2025 industry research on AI Agent PMs and Full-Stack Product Leads
- **🏗️ Brownfield Reality Check**: Rewrote Phase 0 with 4 real-world scenarios for messy existing codebases
- **📖 Documentation Accuracy**: All agent capabilities now match YAML source of truth with zero hallucination risk

## [6.0.0-alpha.4]

**Release: November 2, 2025**

- **📚 Documentation Hub**: Created 18 comprehensive guides (7000+ lines) with professional technical writing standards
- **🤖 Paige Agent**: New technical documentation specialist available across all BMM phases
- **🚀 Quick Spec Flow**: Intelligent Level 0-1 planning with auto-stack detection and brownfield analysis
- **📦 Universal Shard-Doc**: Split large markdown documents into organized sections with dual-strategy loading
- **🔧 Intent-Driven Planning**: PRD and Product Brief transformed from template-filling to natural conversation

## [6.0.0-alpha.3]

**Release: October 2025**

- **Codex Installer**: Custom prompts in `.codex/prompts/` directory structure
- **Bug Fixes**: Various installer and workflow improvements
- **Documentation**: Initial documentation structure established

## [6.0.0-alpha.0]

**Release: September 28, 2025**

- **Lean Core**: Simple common tasks and agents (bmad-web-orchestrator, bmad-master)
- **BMad Method (BMM)**: Complete scale-adaptive rewrite supporting projects from small enhancements to massive undertakings
- **BoMB**: BMad Builder for creating and converting modules, workflows, and agents
- **CIS**: Creative Intelligence Suite for ideation and creative workflows
- **Game Development**: Full subclass of game-specific development patterns**Note**: Version 5.0.0 was skipped due to NPX registry issues that corrupted the version. Development continues with v6.0.0-alpha.0.

## [v4.43.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.43.0)

**Release: August-September 2025 (v4.31.0 - v4.43.1)**

Focus on stability, ecosystem growth, and professional tooling.

### Major Integrations

- **Codex CLI & Web**: Full Codex integration with web and CLI modes
- **Auggie CLI**: Augment Code integration
- **iFlow CLI**: iFlow support in installer
- **Gemini CLI Custom Commands**: Enhanced Gemini CLI capabilities

### Expansion Packs

- **Godot Game Development**: Complete game dev workflow
- **Creative Writing**: Professional writing agent system
- **Agent System Templates**: Template expansion pack (Part 2)

### Advanced Features

- **AGENTS.md Generation**: Auto-generated agent documentation
- **NPM Script Injection**: Automatic package.json updates
- **File Exclusion**: `.bmad-flattenignore` support for flattener
- **JSON-only Integration**: Compact integration mode

### Quality & Stability

- **PR Validation Workflow**: Automated contribution checks
- **Fork-Friendly CI/CD**: Opt-in mechanism for forks
- **Code Formatting**: Prettier integration with pre-commit hooks
- **Update Checker**: `npx bmad-method update-check` command

### Flattener Improvements

- Detailed statistics with emoji-enhanced `.stats.md`
- Improved project root detection
- Modular component architecture
- Binary directory exclusions (venv, node_modules, etc.)

### Documentation & Community

- Brownfield document naming consistency fixes
- Architecture template improvements
- Trademark and licensing clarity
- Contributing guidelines refinement

### Developer Experience

- Version synchronization scripts
- Manual release workflow enhancements
- Automatic release notes generation
- Changelog file path configuration

[View v4.43.1 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.43.1)

## [v4.30.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.30.0)

**Release: July 2025 (v4.21.0 - v4.30.4)**

Introduction of advanced IDE integrations and command systems.

### Claude Code Integration

- **Slash Commands**: Native Claude Code slash command support for agents
- **Task Commands**: Direct task invocation via slash commands
- **BMad Subdirectory**: Organized command structure
- **Nested Organization**: Clean command hierarchy

### Agent Enhancements

- BMad-master knowledge base loading
- Improved brainstorming facilitation
- Better agent task following with cost-saving model combinations
- Direct commands in agent definitions

### Installer Improvements

- Memory-efficient processing
- Clear multi-select IDE prompts
- GitHub Copilot support with improved UX
- ASCII logo (because why not)

### Platform Support

- Windows compatibility improvements (regex fixes, newline handling)
- Roo modes configuration
- Support for multiple CLI tools simultaneously

### Expansion Ecosystem

- 2D Unity Game Development expansion pack
- Improved expansion pack documentation
- Better isolated expansion pack installations

[View v4.30.4 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.30.4)

## [v4.20.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.20.0)

**Release: June 2025 (v4.11.0 - v4.20.0)**

Major focus on documentation quality and expanding QA agent capabilities.

### Documentation Overhaul

- **Workflow Diagrams**: Visual explanations of planning and development cycles
- **QA Role Expansion**: QA agent transformed into senior code reviewer
- **User Guide Refresh**: Complete rewrite with clearer explanations
- **Contributing Guidelines**: Clarified principles and contribution process

### QA Agent Transformation

- Elevated from simple tester to senior developer/code reviewer
- Code quality analysis and architectural feedback
- Pre-implementation review capabilities
- Integration with dev cycle for quality gates

### IDE Ecosystem Growth

- **Cline IDE Support**: Added configuration for Cline
- **Gemini CLI Integration**: Native Gemini CLI support
- **Expansion Pack Installation**: Automated expansion agent setup across IDEs

### New Capabilities

- Markdown-tree integration for document sharding
- Quality gates to prevent task completion with failures
- Enhanced brownfield workflow documentation
- Team-based agent bundling improvements

### Developer Tools

- Better expansion pack isolation
- Automatic rule generation for all supported IDEs
- Common files moved to shared locations
- Hardcoded dependencies removed from installer

[View v4.20.0 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.20.0)

## [v4.10.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.10.0)

**Release: June 2025 (v4.3.0 - v4.10.3)**

This release focused on making BMAD more configurable and adaptable to different project structures.

### Configuration System

- **Optional Core Config**: Document sharding and core configuration made optional
- **Flexible File Resolution**: Support for non-standard document structures
- **Debug Logging**: Configurable debug mode for agent troubleshooting
- **Fast Update Mode**: Quick updates without breaking customizations

### Agent Improvements

- Clearer file resolution instructions for all agents
- Fuzzy task resolution for better agent autonomy
- Web orchestrator knowledge base expansion
- Better handling of deviant PRD/Architecture structures

### Installation Enhancements

- V4 early detection for improved update flow
- Prevented double installation during updates
- Better handling of YAML manifest files
- Expansion pack dependencies properly included

### Bug Fixes

- SM agent file resolution issues
- Installer upgrade path corrections
- Bundle build improvements
- Template formatting fixes

[View v4.10.3 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.10.3)

## [v4.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.0.0)

**Release: June 20, 2025 (v4.0.0 - v4.2.0)**

Version 4 represented a complete architectural overhaul, transforming BMAD from a collection of prompts into a professional, distributable framework.

### Framework Transformation

- **NPM Package**: Professional distribution and simple installation via `npx bmad-method install`
- **Modular Architecture**: Move to `.bmad-core` hidden folder structure
- **Multi-IDE Support**: Unified support for Claude Code, Cursor, Roo, Windsurf, and many more
- **Schema Standardization**: YAML-based agent and team definitions
- **Automated Installation**: One-command setup with upgrade detection

### Agent System Overhaul

- Agent team workflows (fullstack, no-ui, all agents)
- Web bundle generation for platform-agnostic deployment
- Task-based architecture (separate task definitions from agents)
- IDE-specific agent activation (slash commands for Claude Code, rules for Cursor, etc.)

### New Capabilities

- Brownfield project support (existing codebases)
- Greenfield project workflows (new projects)
- Expansion pack architecture for domain specialization
- Document sharding for better context management
- Automatic semantic versioning and releases

### Developer Experience

- Automatic upgrade path from v3 to v4
- Backup creation for user customizations
- VSCode settings and markdown linting
- Comprehensive documentation restructure

[View v4.2.0 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.2.0)

## [v3.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v3.0.0)

**Release: May 20, 2025**

Version 3 introduced the revolutionary orchestrator concept, creating a unified agent experience.

### Major Features

- **BMad Orchestrator**: Uber-agent that orchestrates all specialized agents
- **Web-First Approach**: Streamlined web setup with pre-compiled agent bundles
- **Simplified Onboarding**: Complete setup in minutes with clear quick-start guide
- **Build System**: Scripts to compile web agents from modular components

### Architecture Changes

- Consolidated agent system with centralized orchestration
- Web build sample folder with ready-to-deploy configurations
- Improved documentation structure with visual setup guides
- Better separation between web and IDE workflows

### New Capabilities

- Single agent interface (`/help` command system)
- Brainstorming and ideation support
- Integrated method explanation within the agent itself
- Cross-platform consistency (Gemini Gems, Custom GPTs)

[View V3 Branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V3)

## [v2.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v2.0.0)

**Release: April 17, 2025**

Version 2 addressed the major shortcomings of V1 by introducing separation of concerns and quality validation mechanisms.

### Major Improvements

- **Template Separation**: Templates decoupled from agent definitions for greater flexibility
- **Quality Checklists**: Advanced elicitation checklists to validate document quality
- **Web Agent Discovery**: Recognition of Gemini Gems and Custom GPTs power for structured planning
- **Granular Web Agents**: Simplified, clearly-defined agent roles optimized for web platforms
- **Installer**: A project installer that copied the correct files to a folder at the destination

### Key Features

- Separated template files from agent personas
- Introduced forced validation rounds through checklists
- Cost-effective structured planning workflow using web platforms
- Self-contained agent personas with external template references

### Known Issues

- Duplicate templates/checklists for web vs IDE versions
- Manual export/import workflow between agents
- Creating each web agent separately was tedious

[View V2 Branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V2)

## [v1.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v1.0.0)

**Initial Release: April 6, 2025**

The original BMAD Method was a tech demo showcasing how different custom agile personas could be used to build out artifacts for planning and executing complex applications from scratch. This initial version established the foundation of the AI-driven agile development approach.

### Key Features

- Introduction of specialized AI agent personas (PM, Architect, Developer, etc.)
- Template-based document generation for planning artifacts
- Emphasis on planning MVP scope with sufficient detail to guide developer agents
- Hard-coded custom mode prompts integrated directly into agent configurations
- The OG of Context Engineering in a structured way

### Limitations

- Limited customization options
- Web usage was complicated and not well-documented
- Rigid scope and purpose with templates coupled to agents
- Not optimized for IDE integration

[View V1 Branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V1)

## Installation

```bash
npx bmad-method
```

For detailed release notes, see the [GitHub releases page](https://github.com/bmad-code-org/BMAD-METHOD/releases).
