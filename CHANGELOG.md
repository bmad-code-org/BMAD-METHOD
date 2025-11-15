# Changelog

## [Unreleased]

## [6.0.0-alpha.9]

**Release: November 12, 2025**

This alpha release introduces major workflow engine enhancements, comprehensive documentation, and significant simplification of project structure and configuration.

### 🚀 Workflow Engine Revolution

**Intelligent File Discovery Protocol:**

- New reusable `discover_inputs` protocol for automatic file loading across all workflows
- Three intelligent loading strategies:
  - FULL_LOAD: Loads all sharded documents for comprehensive context
  - SELECTIVE_LOAD: Targets specific shards via template variables
  - INDEX_GUIDED: Analyzes table of contents and intelligently loads relevant sections
- Auto-discovers whole vs sharded documents with automatic fallback
- Transparent reporting of loaded content with file counts
- Implemented across all BMM Phase 1-4 workflows and new BMGD Phase 4 workflows

**Track-Based Project System:**

- Replaced confusing "Level 0-4" terminology with intuitive track names:
  - **quick-flow**: Bug fixes and small features (replaces Level 0-1)
  - **bmad-method**: Full planning track (replaces Level 2-3)
  - **enterprise-bmad-method**: Extended planning (replaces Level 4)
- Updated all workflows to be track-aware rather than level-dependent

### 📚 Comprehensive Documentation

**New Guides Added:**

- **Agent Customization Guide:** Complete instructions for customizing agent names, personas, memories, and behaviors
- **Web Bundles & Platform Guide:** Comprehensive guide for using BMad agents in Gemini Gems and Custom GPTs
  - Critical setup rules with exact configuration requirements
  - Cost-saving strategies (60-80% savings via web planning → local implementation)
  - Platform comparison and recommendations

### 🏗️ Configuration & Structure Improvements

**Unified Output Folder Structure:**

- Single `output_folder` for ALL AI-generated artifacts (default: "docs")
- **REMOVED: `.ephemeral/` and `.bmad-ephemeral/` folders are completely eliminated**
- Phase 4 ephemeral content now organized within output folder as `sprint_artifacts`:
  - Default path: `docs/sprint-artifacts/` (configurable during install)
  - Contains: stories, epic context, story context, sprint plans, code reviews
  - Can be set to `docs/stories/` for backward compatibility
- Eliminated confusing separate folder proliferation
- Clearer prompts during installation

**Dynamic Path Configuration:**

- Replaced hardcoded `.bmad` paths with `{bmad_folder}` placeholder throughout
- Users can now fully customize installation folder names
- Improved flexibility and reduced coupling to specific directory structures

### 🎯 Tech-Spec Workflow Revolution

**Intent-Based Intelligence:**

- Removed 150+ lines of hardcoded stack detection examples
- Replaced prescriptive instructions with adaptive intelligent guidance
- Stack detection now automatically adapts to ANY project type
- Consolidated story generation into single unified workflow
- 50% fewer workflow files while maintaining full functionality

### 🎮 BMGD Phase 4 Implementation

**Complete Game Development Workflows:**

- Added 10 Phase 4 production workflows for game development
- Includes: code-review, sprint-planning, story creation, retrospectives
- All workflows follow BMM patterns with game-specific adaptations
- Unified with BMM workflows to eliminate duplication

### 🌐 Web Bundle Enhancements

**GitHub Pages Support:**

- Web bundles can now be hosted directly on GitHub Pages
- Automatic directory browsing and zip download functionality
- Improved distribution setup documentation

**Testing Architecture:**

- New test design workflow for Phase 3 architecture level
- Comprehensive testing strategy generation

### 🔧 Code Quality & Maintenance

**Major Cleanup:**

- Removed 200+ files that shouldn't be version controlled
- Cleaned up 21 pre-generated XML bundles (users generate fresh)
- Fixed corrupted variable patterns throughout workflows
- Standardized variable naming conventions
- Removed duplicate BMGD workflows (now shares BMM Phase 4)

**Bug Fixes:**

- Fixed story status handling (accepts both "review" and "ready-for-review")
- Corrected sprint artifact paths and undefined variables
- Fixed installer quick install mode
- Removed injected bad formatting characters
- Enhanced shard document tool to prevent confusion with whole/sharded versions

### 💡 Developer Experience

**Enhanced Workflow Management:**

- Better error handling and user guidance
- Exit/continue options when prerequisites missing
- Improved validation checklists with modern formatting
- Clearer instructions and adaptive conversation goals

**Variable Standardization:**

- Consistent hyphenated format: `{output-folder}`
- Renamed unclear variables: `{dev_ephemeral_location}` → `{sprint_artifacts}`
- Fixed 40+ workflows with standardized variable patterns

### 📈 Impact Summary

- **98 source files modified** (299 insertions, 6,567 deletions)
- **40+ workflows updated** with track system and standardization
- **12 duplicate workflows eliminated** through consolidation
- **3 installer configs simplified** with major folder improvements
- **2 comprehensive guides added** for customization and platform usage

### ⚠️ Breaking Changes

- Level-based terminology (Level 0-4) replaced with track names
- Folder structure changes may require reconfiguration for existing projects
- Variable name changes in workflows (backward compatibility maintained where possible)

### 🔄 Migration Notes

**Important Folder Structure Changes:**

- **The `.ephemeral/` folder is completely gone** - Phase 4 ephemeral content no longer uses a separate folder
- Phase 4 artifacts (epic context, stories, story context, sprint plans, code reviews) now live in `{output_folder}/{sprint_artifacts}`
- New default location: `docs/sprint-artifacts/` (was previously `.bmad-ephemeral/` or similar)

**Migration Options:**

1. **If you have existing `docs/stories/` content:**
   - Move all content from `docs/stories/` to `docs/sprint-artifacts/`
   - Update any references or scripts pointing to the old location

2. **To keep using `docs/stories/` location:**
   - During the new version install, set sprint_artifacts to "stories" when prompted
   - This maintains backward compatibility with your existing structure

3. **Clean migration checklist:**
   - Delete old `.ephemeral/` folder if it exists
   - Delete old `.bmad-ephemeral/` folder if it exists
   - Move Phase 4 artifacts to new location or configure installer to use existing path
   - Update to new track terminology in configurations (quick-flow, bmad-method, enterprise-bmad-method)
   - Regenerate web bundles using `npm run bundle` for latest changes
   - Update any custom workflows to use new `discover_inputs` protocol

## [6.0.0-alpha.8]

**Release: November 9, 2025**

This alpha release focuses on installation flexibility, artifact organization, and comprehensive web bundle enhancements for better multi-agent collaboration.

### 🎯 Installation Path Enhancements

**Configurable Installation Directory:**

- Users can now specify custom installation directories during setup
- Changed default installation to `.bmad` (hidden directory) for cleaner project organization
- Reduces visual clutter in project root by hiding BMAD infrastructure files
- VS Code settings updated to work with new `.bmad` directory structure

**Ephemeral File Handling:**

- Updated phase 4 implementation workflows to use ephemeral file locations
- Better separation between documentation and implementation artifacts
- Phase 4 items (stories, code review, sprint plan, context files) can now be stored outside docs folder
- Installer includes questions for artifact path selection

### 🚀 CLI & Agent Loading Improvements

**Optimized Agent Loading:**

- CLI commands now load from installed agent files instead of maintaining duplicates
- Eliminates duplication between source and installed agent definitions
- Reduces maintenance burden and ensures consistency

**Installer UX Enhancements:**

- Enhanced installer interface with version display
- Better visual feedback during installation process

### 🌐 Web Bundle Enhancements

**Party Mode Support:**

- All web bundles (single agent and team) now include party mode for multi-agent collaboration
- Users can invoke multi-agent discussions from any bundled agent
- Added default-party.csv files to bmm, bmgd, and cis modules with customizable party configurations

**Advanced Elicitation Integration:**

- Integrated advanced elicitation capabilities into standalone agents
- All 39 elicitation methods now available in web bundles

**Expanded Agent Bundles:**

- New web bundle outputs for all agents: analyst, architect, dev, pm, sm, tea, tech-writer, ux-designer
- Game development agents: game-designer, game-dev, game-architect, game-scrum-master
- Creative Intelligence Suite agents fully bundled

**Team Customization:**

- Customizable party configurations per module
- Users can define which agents participate in party mode discussions

### 🔧 Phase 4 Workflow Updates

**Artifact Separation (In Progress):**

- Initiated separation of phase 4 implementation artifacts from documentation
- Dedicated artifact path for stories, code review, sprint plan, context files
- Updated workflow.yaml files for:
  - code-review workflow
  - sprint-planning workflow
  - story-context workflow
  - epic-tech-context workflow
  - retrospective workflow
- Configuration support added for artifact path selection during installation

### 🛠️ IDE Integration

**Gemini TOML:**

- Improved with clear loading instructions using @ commands
- Better documentation for Gemini CLI users

**Agent Launcher Templates:**

- Agent launcher markdown files now use centralized critical indication templates
- Improved consistency across IDE configurations

**GitHub Copilot:**

- Updated tool names to match official VS Code documentation (November 2025)
- Better integration with latest Copilot features

### 🐛 Bug Fixes

- Fixed duplicate manifest entries by deduplicating module lists using Set
- Cleaned up legacy `bmad/`, `bmd/`, and `web-bundles/` directories on installation
- Various improvements to phase 4 workflow artifact handling
- Better error handling in web bundler

### 📦 Infrastructure Changes

- New agent and action command header models for standardization
- Enhanced web-bundle-activation-steps fragment
- Updated web-bundler.js to support new structure
- Improved party mode instructions and workflow orchestration

### 📊 Impact Summary

This release brings significant improvements to installation flexibility and multi-agent collaboration:

- **Flexibility:** Configurable installation paths for different project preferences
- **Organization:** Cleaner project structure with hidden `.bmad` directory
- **Collaboration:** Comprehensive party mode support in all web bundles
- **Consistency:** Optimized agent loading eliminates duplication
- **Artifact Management:** Better separation of documentation vs implementation artifacts

---

## [6.0.0-alpha.7]

**Release: November 7, 2025**

This alpha release focuses on web bundle improvements, module extraction, and enhanced workflow vendoring capabilities.

### 🌐 Web Bundler Improvements

**Workflow Vendoring:**

- Web bundler now performs workflow vendoring before bundling agents
- Workflows referenced via `workflow-install` attributes are automatically copied from source to destination
- Similar to module installer behavior, ensuring consistency
- Config_source is updated in vendored workflows to reference target module
- Fixes missing dependency warnings for cross-module workflow references

**Enhanced Dependency Resolution:**

- Improved workflow dependency detection and bundling
- Better handling of workflows with `web_bundle: false` flag
- Menu items for non-web workflows are now properly excluded from bundles
- Shows positive "✓ No missing dependencies" message when all dependencies resolved

**Advanced Elicitation Fix:**

- Added missing `adv-elicit-methods.csv` to workflow bundles
- Includes CSV in all workflows using `adv-elicit.xml`:
  - architecture workflow
  - prd workflow
  - tech-spec workflow
- Fixes runtime failures when advanced elicitation is invoked in bundled workflows

### 🎮 BMGD Module Extraction

**Game Development Module:**

- Extracted game development functionality from BMM into standalone BMGD module
- Moved agents: game-designer, game-dev, game-architect from BMM to BMGD
- Moved team config: team-gamedev
- Created new Game Dev Scrum Master agent using workflow vendoring pattern

**Reorganized Game Dev Workflows:**

Industry-standard game development phases:

- **Phase 1 (Preproduction):** brainstorm-game, game-brief
- **Phase 2 (Design):** gdd (Game Design Document), narrative
- **Phase 3 (Technical):** game-architecture
- **Phase 4 (Production):** Vendors BMM workflows (dev-story, code-review, sprint-planning, etc.)

**Workflow Vendoring Implementation:**

- Game Dev SM agent uses `workflow-install` to vendor BMM phase 4 workflows
- Enables module independence while sharing proven workflows
- Sets pattern for future module extractions and specializations

### 🔧 IDE Installation Improvements

**Claude Code Fix:**

- Fixed regression preventing README file slash commands from installing
- Cleaned up bmad folders in tools directory on installation
- Better handling of IDE-specific configuration files

### 📚 Documentation Updates

**TEA Agent Documentation:**

- Updated Test Architect documentation to align with BMad 4-phase methodology
- Better integration with overall workflow structure
- Clearer role definitions and responsibilities

**Diagram Improvements:**

- More visual documentation updates
- Enhanced Mermaid diagram drafts
- Better workflow visualization

### 🐛 Bug Fixes

- Fixed missing `adv-elicit-methods.csv` in workflow bundles
- Removed menu items for workflows with `web_bundle: false`
- Fixed IDE installation regression for Claude Code README commands
- Improved workflow vendoring dependency resolution

### 🔄 Breaking Changes

**Module Structure:**

- Game development functionality moved from BMM to BMGD module
- Existing projects using game dev agents should reinstall to get new module structure
- No functional changes - agents work the same way in new location

### 📊 Impact Summary

This release establishes better module organization and cross-module workflow sharing:

- **Modularity:** BMGD extraction demonstrates clean module separation pattern
- **Reusability:** Workflow vendoring enables sharing proven workflows across modules
- **Reliability:** Advanced elicitation now works correctly in all web bundles
- **Flexibility:** Modules can be specialized while leveraging core workflows

---

## [6.0.0-alpha.6]

**Release: November 4, 2025**

This alpha release focuses on installation flexibility, improved UX, and bug fixes for the installer system.

### 🐛 Bug Fixes

**Installer Fixes:**

- Fixed manifestPath error in ide-config-manager causing installation failures
- Fixed installer option display to show full labels instead of just values for single/multi-select
- Better error handling during installation process

**Documentation Installation:**

- Add conditional documentation installation feature
- Users can now opt out of installing docs to reduce installation footprint
- New `install_user_docs` configuration option (defaults to true)
- Useful for production environments or users who prefer online documentation

### 🎨 User Experience Improvements

**Installer UX:**

- Improved config question display with descriptive labels
- Better formatting for single and multi-select options
- Clearer feedback during installation process
- More intuitive option selection

### 📖 Documentation Updates

**Contributing Guidelines:**

- Updated CONTRIBUTING.md to remove references to non-existent 'next' branch
- Clearer contribution workflow instructions
- Better alignment with actual repository structure

### 🧹 Maintenance

**Issue Tracker Cleanup:**

- Closed 54 legacy v4 issues (older than 1 month)
- Maintains clean issue tracker focused on v6 development
- Improved issue management and prioritization

### 📊 Impact Summary

This release improves installation reliability and user experience:

- **Reliability:** Fixed critical installer bugs preventing successful installations
- **Flexibility:** Optional documentation installation for different use cases
- **Clarity:** Better UX with descriptive labels and clearer feedback
- **Maintenance:** Clean issue tracker focused on current development

---

## [6.0.0-alpha.5]

**Release: November 4, 2025**

This alpha release represents a major refinement of BMM workflows, documentation accuracy, and the introduction of the revolutionary 3-track scale system. The focus is on workflow consistency, eliminating bloat, and providing accurate, reality-based guidance for modern AI-driven development.

### 🎯 3-Track Scale System - Revolutionary Simplification

**From 5 Levels to 3 Clear Tracks:**

The BMM scale system has been dramatically simplified from a confusing 5-level hierarchy (Levels 0-4) to 3 intuitive, preference-driven tracks:

- **Quick Flow** - Fast, lightweight development for small changes and quick iterations
- **BMad Method** - Balanced approach for most development projects
- **Enterprise Method** - Comprehensive methodology for large-scale, mission-critical systems

**Key Changes:**

- Replaced `project_level` variable with `project_track` throughout all workflows
- Updated 8 workflow path YAML files to reflect new track naming (removed level-based paths)
- Simplified workflow-init to guide users based on preference, not artificial "levels"
- Updated all documentation to reference tracks instead of levels
- Eliminated confusing "target_scale" variable (no longer needed)

**Impact:**

Users now choose development approach based on **project needs and team preference**, not arbitrary complexity levels. This aligns with how real teams actually work and removes decision paralysis.

**Documentation Updated:**

- `scale-adaptive-system.md` - Complete rewrite around 3-track methodology (756 line overhaul)
- `quick-start.md` - Updated to reference tracks
- `brownfield-guide.md` - Track-based guidance instead of level-based
- `glossary.md` - New track definitions, removed level references
- `workflow-status/init/instructions.md` - Major rewrite for track-based initialization (865 lines)

### ✨ Workflow Modernization & Standardization

**1. Elicitation System Modernization:**

- Removed legacy `<elicit-required />` XML tag from core workflow.xml
- Replaced with explicit `<invoke-task halt="true">advanced-elicitation.xml</invoke-task>` pattern
- More self-documenting and eliminates confusing indirection layer
- Added strategic elicitation points across all planning workflows:
  - **PRD:** After success criteria, scope, functional requirements, and final review
  - **Create-Epics-And-Stories:** After epic proposals and each epic's stories
  - **Architecture:** After decisions, structure, patterns, implementation patterns, and final doc
- Updated audit-workflow to remove obsolete elicit-required tag scanning

**2. Input Document Discovery Streamlined:**

- Replaced verbose 19-line "Input Document Discovery" sections with single critical tag
- New concise format: `<critical>Input documents specified in workflow.yaml input_file_patterns...</critical>`
- Eliminates duplication (workflow.yaml already defines patterns - why repeat them?)
- Updated across 6 workflows: PRD, create-epics-and-stories, architecture, tech-spec, UX, gate-check
- **Saved ~114 lines of repeated bloat**

**3. Epic/Story Template Standardization:**

- Replaced hardcoded 8-epic templates with clean repeating patterns using N/M variables
- Added BDD-style acceptance criteria (Given/When/Then/And) for better clarity
- Removed instructional bloat from templates (moved to instructions.md where it belongs)
- **Principle:** Templates show OUTPUT structure, instructions show PROCESS
- Applied to both create-epics-and-stories and tech-spec workflows
- Templates now use HTML comments to clearly indicate repeating sections

**4. Workflow.yaml Pattern Consistency:**

- Standardized `input_file_patterns` across all workflows
- Separated `recommended_inputs` (semantic WHAT) from `input_file_patterns` (file discovery WHERE)
- Removed duplication between recommended_inputs file paths and input_file_patterns
- Create-epics-and-stories now uses proper whole/sharded pattern like architecture workflow
- Solutioning-gate-check cleaned up to use semantic descriptions not file paths

**Files Changed:** 18 files across core, planning, and solutioning workflows

### 📚 Documentation Accuracy Overhaul

**Agent YAML as Source of Truth:**

Fixed critical documentation inaccuracies by treating agent YAML files as the authoritative source:

**agents-guide.md Corrections:**

- Fixed Game Developer workflow names (dev-story → develop-story, added story-done)
- Added agent name "Paige" to Technical Writer (matches naming pattern)
- Corrected epic-tech-context ownership (Architect → SM agent across all docs)
- Updated agent reference tables to reflect actual capabilities from YAML configs

**workflows-implementation.md Corrections:**

- Fixed epic-tech-context agent attribution in 3 locations (Architect → SM)
- Updated multi-agent workflow ownership table
- Aligned all workflow descriptions with actual agent YAML definitions

**Impact:** Zero hallucination risk - documentation now accurately reflects what agents can actually do.

### 🏗️ Brownfield Development Reality Check

**Rewrote brownfield-guide.md Phase 0 Section:**

Replaced oversimplified 3-scenario model with **real-world guidance** for messy brownfield projects:

**New Scenarios (4 instead of 3):**

- **Scenario A:** No documentation → `document-project` workflow (existing)
- **Scenario B:** Docs exist but massive/outdated/incomplete → **document-project** (NEW - very common case)
- **Scenario C:** Good docs but massive files → **shard-doc → index-docs** (NEW - handles >500 line files)
- **Scenario D:** Confirmed AI-optimized docs → Skip Phase 0 (correctly marked as RARE)

**Key Additions:**

- Default recommendation: "Run document-project unless you have confirmed, trusted, AI-optimized docs"
- Quality assessment checklist (current, AI-optimized, comprehensive, trusted)
- Massive document handling guidance (>500 lines, 10+ sections triggers shard-doc)
- Explicit explanation of why regenerating is better than indexing bad docs
- Impact explanation: how outdated docs break AI workflows (token limits, wrong assumptions, broken integrations)

**Principle:** "When in doubt, run document-project" - Better to spend 10-30 minutes generating fresh docs than waste hours debugging AI agents with bad documentation.

### 🚀 PM/UX Evolution for Enterprise Agentic Development

**New Section: The Evolving Role of Product Managers & UX Designers**

Added comprehensive forward-looking guidance based on **November 2025 industry research**:

**Industry Trends:**

- 56% of product professionals cite AI/ML as top strategic focus
- PRD-to-Code automation: build and deploy apps in 10-15 minutes (current state)
- By 2026: Roles converging into "Full-Stack Product Lead" (PM + Design + Engineering)
- Very high salaries for AI Agent PMs who orchestrate autonomous development systems

**Role Transformation:**

- PMs evolving from spec writers → code orchestrators
- Writing AI-optimized PRDs that **feed agentic pipelines directly**
- UX designers generating production code with Figma-to-code tools
- Technical fluency becoming **table stakes**, not optional
- Reviewing PRs from AI agents alongside human developers

**How BMad Method Enables This Future (10 Ways):**

1. AI-Executable PRD Generation - PRDs become work packages for cloud agents
2. Automated Epic/Story Breakdown - No more manual story refinement sessions
3. Human-in-the-Loop Architecture - PMs learn while validating technical decisions
4. Cloud Agentic Pipeline Vision - Current (2025) + Future (2026) roadmap with diagrams
5. UX Design Integration - Designs validated through working prototypes
6. PM Technical Skills Development - Learn by doing through conversational workflows
7. Organizational Leverage - 1 PM → 20-50 AI agents (5-10× productivity multiplier)
8. Quality Consistency - What gets built matches what was specified
9. Rapid Prototyping - Hours to validate ideas vs months
10. Career Path Evolution - Positions PMs for emerging AI Agent PM, Full-Stack Product Lead roles

**Cloud Agentic Pipeline Vision:**

```
Current (2025): PM PRD → Stories → Human devs + BMad agents → PRs → Review → Deploy
Future (2026): PM PRD → Stories → Cloud AI agents → Auto PRs → Review → Auto-merge → Deploy
Time savings: 6-8 weeks → 2-5 days
```

**What Remains Human:**

- Product vision, empathy, creativity, judgment, ethics
- PMs spend MORE time on human elements (AI handles execution)
- Product leaders become "builder-thinkers" not just spec writers

### 📖 Document Tightening

**enterprise-agentic-development.md Overhaul:**

- Reduced from 1207 → 640 lines (47% reduction)
- 10× more BMad-centric - every section ties back to how BMad enables the future
- Removed redundant examples, consolidated sections, kept actionable insights
- Stronger value propositions for PMs, UX, enterprise teams throughout

**Key Message:** "The future isn't AI replacing PMs—it's AI-augmented PMs becoming 10× more powerful through BMad Method."

### 🛠️ Infrastructure & Quality

**Agent Naming Consistency:**

- Renamed `paige.agent.yaml` → `tech-writer.agent.yaml` (matches agent naming pattern)
- Updated all references across documentation and workflow files

**README Updates:**

- Updated local installation instructions
- Better hierarchy and clearer CTAs in root README

### 🔄 Breaking Changes

**Variable Renames:**

- `project_level` → `project_track` in PRD and all planning workflows
- Removed `target_scale` variable (no longer needed with 3-track system)

**Workflow Path Files:**

- Removed 9 level-based workflow paths (brownfield-level-0, greenfield-level-3, etc.)
- Added 6 new track-based workflow paths (quick-flow-greenfield, method-brownfield, enterprise-greenfield, etc.)

**Workflow Triggers:**

- Tech-spec workflow descriptions updated to reference tracks not levels

### 📊 Impact Summary

These changes bring BMM from alpha.4's solid foundation to alpha.5's **production-ready professionalism**:

- **Accuracy:** Documentation matches YAML source of truth (zero hallucination risk)
- **Simplicity:** 3-track system eliminates decision paralysis and artificial complexity
- **Reality:** Brownfield guidance handles messy real-world scenarios, not idealized ones
- **Forward-looking:** PM/UX evolution section positions BMad as essential framework for emerging roles
- **Consistency:** Standardized elicitation, input discovery, and template patterns across all workflows
- **Maintainability:** 47% documentation reduction + ~114 lines of bloat removed from workflows
- **Actionable:** Concrete workflows, commands, examples throughout all guidance

Users now have **trustworthy, reality-based, future-oriented guidance** for using BMad Method in both current workflows and emerging agentic development patterns.

### 📦 Files Changed

**Core & Infrastructure (3 files):**

- `bmad/core/tasks/workflow.xml` - Removed elicit-required tag
- `src/core/tasks/workflow.xml` - Removed elicit-required tag
- `package.json` - Version bump

**Documentation (8 files):**

- `src/modules/bmm/docs/README.md` - Track references
- `src/modules/bmm/docs/agents-guide.md` - Accuracy fixes, agent ownership corrections
- `src/modules/bmm/docs/brownfield-guide.md` - Phase 0 reality check, track migration
- `src/modules/bmm/docs/enterprise-agentic-development.md` - PM/UX evolution, 47% reduction
- `src/modules/bmm/docs/faq.md` - Track references
- `src/modules/bmm/docs/glossary.md` - Track definitions, removed levels
- `src/modules/bmm/docs/quick-spec-flow.md` - Track references
- `src/modules/bmm/docs/scale-adaptive-system.md` - Complete 3-track rewrite

**Workflow Paths (14 files):**

- Removed: 9 level-based paths (brownfield-level-0 through greenfield-level-4)
- Added: 6 track-based paths (quick-flow/method/enterprise × greenfield/brownfield)

**Planning Workflows (11 files):**

- PRD workflow: Elicitation, track migration, input discovery, checklist updates
- Create-epics-and-stories: Template rebuild, BDD format, elicitation, input patterns
- Tech-spec: Template rebuild, BDD format, input discovery
- Architecture: Elicitation points, input discovery

**Solutioning Workflows (2 files):**

- UX Design: Input discovery streamlined
- Gate-check: Input pattern cleanup, semantic descriptions

**Build & Utilities (2 files):**

- Audit workflow: Updated tag scanner (removed elicit-required)
- Workflow status init: Track-based initialization logic

**Total: 40+ files changed**

---

### Installation

```bash
npx bmad-method@6.0.0-alpha.5 install
```

For upgrading from alpha.4:

```bash
# Backup your customizations first
npx bmad-method@6.0.0-alpha.5 install
```

### Migration Notes

If upgrading from v6.0.0-alpha.4:

1. **Scale System Change:** The 5-level system (Levels 0-4) is now 3 tracks (Quick Flow, BMad Method, Enterprise Method)
   - Existing projects continue to work - workflows auto-detect track from context
   - New projects will use track-based initialization
   - Review `docs/scale-adaptive-system.md` for the new mental model

2. **Workflow Improvements:**
   - Better elicitation at strategic decision points (you'll be asked for input more frequently)
   - Cleaner templates with BDD acceptance criteria
   - More consistent input document discovery

3. **Documentation Accuracy:**
   - Agent capabilities now match YAML definitions exactly
   - Brownfield guidance handles real-world messy scenarios
   - PM/UX evolution section shows future of AI-driven development

4. **Agent Naming:** Technical Writer agent file renamed (paige.agent.yaml → tech-writer.agent.yaml)
   - No functional impact - just internal naming consistency

5. **No Breaking Changes:** Existing project structures, workflow outputs, and customizations remain compatible

---

## [6.0.0-alpha.4]

**Release: November 2, 2025**

This alpha release represents a major leap forward in documentation, workflow intelligence, and usability. The BMM module now features professional documentation, context-aware planning workflows, and universal document management capabilities.

### 📚 Complete Documentation Overhaul

**New Documentation Hub** (`src/modules/bmm/docs/`)

- Created centralized documentation system with 18 comprehensive guides (7000+ lines)
- Clear learning paths for greenfield, brownfield, and quick spec flows
- Professional technical writing standards throughout all documentation
- Reading time estimates and cross-referenced navigation

**New Documentation Files:**

- `README.md` - Complete documentation hub with topic navigation
- `quick-start.md` - 15-minute getting started guide
- `agents-guide.md` - Comprehensive 12-agent reference (45 min read)
- `party-mode.md` - Multi-agent collaboration guide (20 min read)
- `scale-adaptive-system.md` - Deep dive on Levels 0-4 (42 min read)
- `brownfield-guide.md` - Existing codebase development (53 min read)
- `quick-spec-flow.md` - Rapid Level 0-1 development (26 min read)
- `workflows-analysis.md` - Phase 1 workflows deep-dive (12 min read)
- `workflows-planning.md` - Phase 2 workflows deep-dive (19 min read)
- `workflows-solutioning.md` - Phase 3 workflows deep-dive (13 min read)
- `workflows-implementation.md` - Phase 4 workflows deep-dive (33 min read)
- `workflows-testing.md` - Testing & QA workflows (29 min read)
- `workflow-architecture-reference.md` - Architecture workflow technical reference
- `workflow-document-project-reference.md` - Document-project workflow technical reference
- `enterprise-agentic-development.md` - Team collaboration patterns
- `faq.md` - Comprehensive Q&A covering all common questions
- `glossary.md` - Complete BMM terminology reference
- `troubleshooting.md` - Common issues and solutions guide

**Documentation Improvements:**

- Removed version/date footers (git handles versioning automatically)
- Agent customization docs now include full rebuild process
- Consistent professional formatting and structure across all docs
- Better separation of user documentation vs developer reference

### 🤖 New Agent: Paige (Documentation Guide)

Introduced Paige, a specialized technical documentation agent:

- **Expertise:** Professional technical writing, information architecture, documentation structure
- **Integration:** Available across all BMM phases for continuous documentation support
- **Customizable:** Like all BMM agents, can be customized via sidecar files
- **Status:** Work in progress - will evolve as documentation needs grow

### 🚀 Quick Spec Flow - Intelligent Level 0-1 Planning

**Major Tech-Spec Workflow Transformation:**

- Transformed from template-filling into context-aware intelligent planning system
- Ideal for bug fixes, single endpoint additions, and small isolated changes
- Auto-detects project stack (package.json, requirements.txt, etc.)
- Analyzes brownfield codebases for conventions and patterns
- Integrates WebSearch for current framework versions and best practices

**Context-Aware Intelligence:**

- Interactive level detection (Level 0 vs Level 1)
- Brownfield convention detection with user confirmation
- Comprehensive context discovery (stack, patterns, dependencies, test frameworks)
- Auto-validation with quality scoring (no manual checklist needed)
- UX/UI considerations capture for user-facing changes

**Enhanced Tech-Spec Template:**

- Expanded from 8 to 23 sections for complete planning context
- New sections: Development Context, UX/UI Considerations, Integration Points
- Developer Resources section with file paths and testing guidance
- All sections populated via template-output tags during workflow

**Story Generation Improvements:**

- Level 0: Extract single story from comprehensive tech-spec
- Level 1: Story sequence validation with acceptance criteria quality checks
- User Story Template includes Dev Agent Record sections for implementation tracking
- Complete epic template rewrite with proper variable structure

**Phase 4 Integration:**

- Story Context and Create Story workflows now recognize tech-spec as authoritative source
- Seamless integration between Quick Spec Flow and traditional BMM workflows
- Tech-spec provides brownfield analysis, framework details, and existing patterns

### 📦 Universal Document Sharding

**New Capability: Shard-Doc Workflow**

- Split large markdown documents into organized, smaller files based on sections
- Dual-strategy loading: include individual shards OR single large document
- Configurable section level (default: level 2 headings)
- Automatic index.md generation with navigation links
- Ideal for large guides, API documentation, and knowledge bases

**Use Cases:**

- Breaking down massive planning documents for better context management
- Creating navigable documentation hierarchies
- Managing agent knowledge bases efficiently
- Optimizing context window usage during development

**Integration:**

- Available as BMad Core workflow: `/bmad:core:tools:shard-doc`
- Works with any markdown document in your project
- Preserves original file with automatic backups
- Generated shards maintain formatting and structure

### 🔧 Planning Workflow Enhancements

**Intent-Driven Discovery (Product Brief & PRD):**

- Transformed from rigid template-filling to natural conversational discovery
- Adaptive questioning based on project context (hobby/startup/enterprise)
- Real-time document building instead of end-of-session generation
- Skill-level aware facilitation (expert/intermediate/beginner)
- Context detection from user responses to guide exploration depth

**Product Brief Workflow (96% BMAD v6 compliance):**

- Intent-driven facilitation with context-appropriate probing
- Living document approach with continuous template updates
- Enhanced discovery areas: problem exploration, solution vision, user understanding
- Ruthless MVP scope management with feature prioritization
- Template improvements with context-aware conditional sections

**PRD Workflow (improved from 65% to 85%+ compliance):**

- Fixed critical config issues (missing date variable, status file extension mismatch)
- Scale-adaptive intelligence with project type detection (API/Web App/Mobile/SaaS)
- Domain complexity mapping (14 domain types with specialized considerations)
- Enhanced requirements coverage: project-type specific sections, domain considerations
- Separated epic planning into dedicated create-epics-and-stories child workflow

**Architecture Workflow:**

- Better integration with PRD outputs
- Domain complexity context support
- Enhanced technical decision capture framework

### 🛠️ Research Workflow Improvements

**Enhanced Research Capabilities:**

- Updated to use web search more frequently for current information
- Better understanding of current date context for finding latest documentation
- Improved deep research prompt generation options
- More accurate and up-to-date research results

### 🎨 User Experience Improvements

**Installer Updates:**

- Improved installation notes and guidance
- Better command examples (shard-doc uses npx command pattern)

**Workflow Cleanup:**

- Removed unused voice hooks functionality
- Cleaned up backup and temporary files
- Better workflow naming consistency

### 📋 Infrastructure & Quality

**Agent & Workflow Manifests:**

- Added Paige to agent manifest
- Updated workflow manifest with new and restructured workflows
- Better workflow-to-agent mappings across all documentation
- Updated files manifest with all new documentation

**Module Organization:**

- Streamlined BMM README to lean signpost format
- Polished root README with better hierarchy and clear CTAs
- Moved documentation from root `docs/` to module-specific locations
- Better separation of user docs vs developer reference

**Data Infrastructure:**

- New CSV data files for project types and domain complexity
- Enhanced workflow configuration with runtime variables
- Better template variable mapping and tracking

### 🔄 Breaking Changes

**File Removals:**

- Removed `src/modules/bmm/workflows/2-plan-workflows/prd/epics-template.md` (replaced by create-epics-and-stories child workflow)

**Workflow Trigger Changes:**

- PM agent: `prd` → `create-prd`
- New workflow triggers: `create-epics-and-stories`, `validate-prd`
- Game Designer agent triggers renamed for consistency

### 📖 What's Next (Beta Roadmap)

- Knowledge base integration for enhanced context management
- Web bundle functionality completion
- Additional specialized agents based on community feedback
- Enhanced multi-agent collaboration patterns
- Performance optimizations for large projects

---

### Installation

```bash
npx bmad-method@6.0.0-alpha.4 install
```

For upgrading from alpha.3:

```bash
# Backup your customizations first
npx bmad-method@6.0.0-alpha.4 install
```

### Migration Notes

If upgrading from v6.0.0-alpha.3:

1. New documentation is available in `bmad/bmm/docs/` - review the README.md for navigation
2. Tech-spec workflow now has enhanced capabilities - review `docs/quick-spec-flow.md`
3. Product Brief and PRD workflows have new conversational approaches
4. Paige agent is now available for documentation tasks
5. No breaking changes to existing project structures

---

## [6.0.0-alpha.3]

### Codex Installer

- Codex installer uses custom prompts in `.codex/prompts/`, instead of `AGENTS.md`

## [6.0.0-alpha.0]

**Release: September 28, 2025**

Initial alpha release of a major rewrite and overhaul improvement of past versions.

### Major New Features

- **Lean Core**: The core of BMad is very simple - common tasks that apply to any future module or agents, along with common agents that will be added to any modules - bmad-web-orchestrator and bmad-master.
- **BMad Method**: The new BMad Method (AKA bmm) is a complete overhaul of the v4 method, now a fully scale adaptive rewrite. The workflow now scales from small enhancements to massive undertakings across multiple services or architectures, supporting a new vast array of project type, including a full subclass of game development specifics.
- **BoMB**: The BMad Builder (AKA BoMB) now is able to fully automate creation and conversion of expansion packs from v6 to modules in v6 along with the net new ideation and brainstorming through implementation and testing of net new Modules, Workflows (were tasks and templates), Module Agents, and Standalone Personal Agents
- **CIS**: The Creative Intelligence Suite (AKA CIS)

## [v6.0.0] - SKIPPED

**Note**: Version 5.0.0 was skipped due to NPX registry issues that corrupted the version. Development continues with v6.0.0-alpha.0.

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
