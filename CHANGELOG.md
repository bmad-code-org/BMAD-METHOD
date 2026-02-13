# Changelog

## [6.0.0-Beta.8]

**Release: February 8, 2026**

### 🌟 Key Highlights

1. **Non-Interactive Installation** — Full CI/CD support with 10 new CLI flags for automated deployments
2. **Complete @clack/prompts Migration** — Unified CLI experience with consolidated installer output
3. **CSV File Reference Validation** — Extended Layer 1 validator to catch broken workflow references in CSV files
4. **Kiro IDE Support** — Standardized config-driven installation, replacing custom installer

### 🎁 Features

* **Non-Interactive Installation** — Added `--directory`, `--modules`, `--tools`, `--custom-content`, `--user-name`, `--communication-language`, `--document-output-language`, `--output-folder`, and `-y/--yes` flags for CI/CD automation (#1520)
* **CSV File Reference Validation** — Extended validator to scan `.csv` files for broken workflow references, checking 501 references across 212 files (#1573)
* **Kiro IDE Support** — Replaced broken custom installer with config-driven templates using `#[[file:...]]` syntax and `inclusion: manual` frontmatter (#1589)
* **OpenCode Template Consolidation** — Combined split templates with `mode: primary` frontmatter for Tab-switching support, fixing agent discovery (#1556)
* **Modules Reference Page** — Added official external modules reference documentation (#1540)

### 🐛 Bug Fixes

* **Installer Streamlining** — Removed "None - Skip module installation" option, eliminated ~100 lines of dead code, and added ESM/.cjs support for module installers (#1590)
* **CodeRabbit Workflow** — Changed `pull_request` to `pull_request_target` to fix 403 errors and enable reviews on fork PRs (#1583)
* **Party Mode Return Protocol** — Added RETURN PROTOCOL to prevent lost-in-the-middle failures after Party Mode completes (#1569)
* **Spacebar Toggle** — Fixed SPACE key not working in autocomplete multiselect prompts for tool/IDE selection (#1557)
* **OpenCode Agent Routing** — Fixed agents installing to wrong directory by adding `targets` array for routing `.opencode/agent/` vs `.opencode/command/` (#1549)
* **Technical Research Workflow** — Fixed step-05 routing to step-06 and corrected `stepsCompleted` values (#1547)
* **Forbidden Variable Removal** — Removed `workflow_path` variable from 16 workflow step files (#1546)
* **Kilo Installer** — Fixed YAML formatting issues by trimming activation header and converting to yaml.parse/stringify (#1537)
* **bmad-help** — Now reads project-specific docs and respects `communication_language` setting (#1535)
* **Cache Errors** — Removed `--prefer-offline` npm flag to prevent stale cache errors during installation (#1531)

### ♻️ Refactoring

* **Complete @clack/prompts Migration** — Migrated 24 files from legacy libraries (ora, chalk, boxen, figlet, etc.), replaced ~100 console.log+chalk calls, consolidated installer output to single spinner, and removed 5 dependencies (#1586)
* **Downloads Page Removal** — Removed downloads page, bundle generation, and archiver dependency in favor of GitHub's native archives (#1577)
* **Workflow Verb Standardization** — Replaced "invoke/run" with "load and follow/load" in review workflow prompts (#1570)
* **Documentation Language** — Renamed "brownfield" to "established projects" and flattened directory structure for accessibility (#1539)

### 📚 Documentation

* **Comprehensive Site Review** — Fixed broken directory tree diagram, corrected grammar/capitalization, added SEO descriptions, and reordered how-to guides (#1578)
* **SEO Metadata** — Added description front matter to 9 documentation pages for search engine optimization (#1566)
* **PR Template** — Added pull request template for consistent PR descriptions (#1554)
* **Manual Release Cleanup** — Removed broken manual-release workflow and related scripts (#1576)

### 🔧 Maintenance

* **Dual-Mode AI Code Review** — Configured Augment Code (audit mode) and CodeRabbit (adversarial mode) for improved code quality (#1511)
* **Package-Lock Sync** — Cleaned up 471 lines of orphaned dependencies after archiver removal (#1580)

---

## [6.0.0-Beta.7]

**Release: February 4, 2026**

### 🌟 Key Highlights

1. **Direct Workflow Invocation** — Agent workflows can now be run directly via slash commands instead of only through agent orchestration
2. **Installer Workflow Support** — Installer now picks up `workflow-*.md` files, enabling multiple workflow files per directory

### 🎁 Features

* **Slash Command Workflow Access** — Research and PRD workflows now accessible via direct slash commands: `/domain-research`, `/market-research`, `/technical-research`, `/create-prd`, `/edit-prd`, `/validate-prd` (bd620e38, 731bee26)
* **Version Checking** — CLI now checks npm for newer versions and displays a warning banner when updates are available (d37ee7f2)

### ♻️ Refactoring

* **Workflow File Splitting** — Split monolithic `workflow.md` files into specific `workflow-*.md` files for individual workflow invocation (bd620e38)
* **Installer Multi-Workflow Support** — Installer manifest generator now supports `workflow-*.md` pattern, allowing multiple workflow files per directory (731bee26)
* **Internal Skill Renaming** — Renamed internal project skills to use `bmad-os-` prefix for consistent naming (5276d58b)

---

## [6.0.0-Beta.6]

**Release: February 4, 2026**

### 🌟 Key Highlights

1. **Cross-File Reference Validator**: Comprehensive tool to detect broken file references, preventing 59 known bugs (~25% of historical issues)
2. **New AutocompleteMultiselect Prompt**: Searchable multi-select with improved tool/IDE selection UX
3. **Critical Installer Fixes**: Windows CRLF parsing, Gemini CLI TOML support, file extension preservation
4. **Codebase Cleanup**: Removed dead Excalidraw/flattener artifacts (-3,798 lines)

### 🎁 Features

* **Cross-File Reference Validator** — Validates ~483 references across ~217 source files, detecting absolute path leaks and broken references (PR #1494)
* **AutocompleteMultiselect Prompt** — Upgraded `@clack/prompts` to v1.0.0 with custom searchable multiselect, Tab-to-fill-placeholder behavior, and improved tool/IDE selection UX (PR #1514)
* **OT Domains** — Added `process_control` and `building_automation` domains with high complexity ratings (PR #1510)
* **Documentation Reference Pages** — Added `docs/reference/agents.md`, `commands.md`, and `testing.md` (PR #1525)

### 🐛 Bug Fixes

* **Critical Installer Fixes** — Fixed CRLF line ending parsing on Windows, Gemini CLI TOML support, file extension preservation, Codex task generation, Windows path handling, and CSV parsing (PR #1492)
* **Double Tool Questioning** — Removed redundant tool questioning during installation (df176d42)
* **QA Agent Rename** — Renamed Quinn agent to `qa` for naming consistency (PR #1508)
* **Documentation Organization** — Fixed documentation ordering and links, hide BMGD pages from main LLM docs (PR #1525)

### ♻️ Refactoring

* **Excalidraw/Flattener Removal** — Removed dead artifacts no longer supported beyond beta: Excalidraw workflows, flattener tool, and 12+ diagram creation workflows (-3,798 lines) (f699a368)
* **Centralized Constants** — Centralized `BMAD_FOLDER_NAME` to reduce hardcoded strings (PR #1492)
* **Cross-Platform Paths** — Fixed path separator inconsistencies in agent IDs (PR #1492)

### 📚 Documentation

* **BMGD Diataxis Refactor** — Refactored BMGD documentation using Diataxis principles for better organization (PR #1502)
* **Generate Project Context** — Restored `generate-project-context` workflow for brownfield project analysis (PR #1491)

### 🔧 Maintenance

* **Dependency Updates** — Upgraded `@clack/prompts` from v0.11.0 to v1.0.0 and added `@clack/core` (PR #1514)
* **CI Integration** — Added `validate:refs` to CI quality workflow with warning annotations (PR #1494)

---

## [6.0.0-Beta.5]

### 🎁 Features

* **Add generate-project-context workflow** — New 3-step workflow for project context generation, integrated with quick-flow-solo-dev agent
* **Shard market research customer analysis** — Refactor monolithic customer insights into 4-step detailed customer behavior analysis workflow

### 🐛 Bug Fixes

* **Fix npm install peer dependency issues** — Add `.npmrc` with `legacy-peer-deps=true`, update Starlight to 0.37.5, and add `--legacy-peer-deps` flag to module installer (PR #1476)
* **Fix leaked source paths in PRD validation report** — Replace absolute `/src/core/` paths with `{project-root}/_bmad/core/` (#1481)
* **Fix orphaned market research customer analysis** — Connect step-01-init to step-02-customer-behavior to complete workflow sharding (#1486)
* **Fix duplicate 2-letter brainstorming code** — Change BS to BSP to resolve conflict with cis Brainstorming module
* **Fix tech writer sidecar functionality** — Enable proper sidecar operation (#1487)
* **Fix relative paths in workflow steps** — Correct paths in step-11-polish (#1497) and step-e-04-complete (#1498)
* **Fix party-mode workflow file extension** — Correct extension in workflow.xml (#1499)
* **Fix generated slash commands** — Add `disable-model-invocation` to all generated commands (#1501)
* **Fix agent scan and help CSV files** — Correct module-help.csv entries
* **Fix HELP_STEP placeholder replacement** — Fix placeholder not replaced in compiled agents, fix hardcoded path, fix single quote (#1437)

### 📚 Documentation

* **Add exact slash commands to Getting Started guide** — Provide precise command examples for users (#1505)
* **Remove .claude/commands from version control** — Commands are generated, not tracked (#1506)

### 🔧 Maintenance

* **Update Starlight to 0.37.5** — Latest version with peer dependency compatibility
* **Add GitHub issue templates** — New bug-report.yaml and documentation.yaml templates

---

## [6.0.0-Beta.4]

### 🐛 Bug Fixes

- **Activation steps formatting fix**: Fixed missing opening quote that caused infrequent menu rendering issues
- **Custom module installation fix**: Added missing yaml require in manifest.js to fix custom module installation

---

## [6.0.0-Beta.3]

### 🌟 Key Highlights

1. **SDET Module Replaces TEA**: TEA module removed from core, SDET module added with "automate" workflow for test automation
2. **Gemini CLI TOML Support**: IDE integration now supports the TOML config format used by Gemini CLI
3. **File System Sprint Status**: Default project_key support for file-system based sprint status tracking

### 🔧 Features & Improvements

**Module Changes:**
- **TEA Module Moved to External** (#1430, #1443): The TEA module is now external. SDET module added with a single "automate" workflow focused on test automation
- **SDET Module**: New module with streamlined test automation capabilities

**IDE Integration:**
- **Gemini CLI TOML Format** (#1431): Previous update accidentally switched Gemini to md instead of toml.

**Sprint Status:**
- **Default project_key** (#1446): File-system based sprint status now uses a default project_key so certain LLMs do not complain

### 🐛 Bug Fixes

- **Quick-flow workflow path fix** (#1368): Fixed incorrect workflow_path in bmad-quick-flow/quick-spec steps (step-01, step-02, step-03) - changed from non-existent 'create-tech-spec' to correct 'quick-spec'
- **PRD edit flow paths**: Fixed path references in PRD editing workflow
- **Agent file handling**: Changes to prevent double agent files and use .agent.md file extensions
- **README link fix**: Corrected broken documentation links

## [6.0.0-Beta.2]

- Fix installer so commands match what is installed, centralize most ide into a central file instead of separate files for each ide.
- Specific IDEs may still need udpates, but all is config driven now and should be easier to maintain
- Kiro still needs updates, but its been in this state since contributed, will investigate soon
- Any version older than Beta.0 will recommend removal and reinstall to project. From later alphas though its sufficient to quick update if still desired, but best is just start fresh with Beta.

## [6.0.0-Beta.1]

**Release: January 2026 - Alpha to Beta Transition**

### 🎉 Beta Release

- **Transition from Alpha to Beta**: BMad Method is now in Beta! This marks a significant milestone in the framework's development
- **NPM Default Tag**: Beta versions are now published with the `latest` tag, making `npx bmad-method` serve the beta version by default

### 🌟 Key Highlights

1. **bmad-help**: Revolutionary AI-powered guidance system replaces the alpha workflow-init and workflow tracking — introduces full AI intelligence to guide users through workflows, commands, and project context
2. **Module Ecosystem Expansion**: bmad-builder, CIS (Creative Intelligence Suite), and Game Dev Studio moved to separate repositories for focused development
3. **Installer Consolidation**: Unified installer architecture with standardized command naming (`bmad-dash-case.md` or `bmad-*-agent-*.md`)
4. **Windows Compatibility**: Complete migration from Inquirer.js to @clack/prompts for reliable cross-platform support

### 🚀 Major Features

**bmad-help - Intelligent Guidance System:**

- **Replaces**: workflow-init and legacy workflow tracking
- **AI-Powered**: Full context awareness of installed modules, workflows, agents, and commands
- **Dynamic Discovery**: Automatically catalogs all available workflows from installed modules
- **Intelligent Routing**: Guides users to the right workflow or agent based on their goal
- **IDE Integration**: Generates proper IDE command files for all discovered workflows

**Module Restructuring:**

| Module                                | Status                                            | New Location                                            |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| **bmad-builder**                      | Near beta, with docs and walkthroughs coming soon | `bmad-code-org/bmad-builder`                            |
| **CIS** (Creative Intelligence Suite) | Published as npm package                          | `bmad-code-org/bmad-module-creative-intelligence-suite` |
| **Game Dev Studio**                   | Published as npm package                          | `bmad-code-org/bmad-module-game-dev-studio`             |

### 🔧 Installer & CLI Improvements

**UnifiedInstaller Architecture:**

- All IDE installers now use a common `UnifiedInstaller` class
- Standardized command naming conventions:
  - Workflows: `bmad-module-workflow-name.md`
  - Agents: `bmad-module-agent-name.md`
  - Tasks: `bmad-task-name.md`
  - Tools: `bmad-tool-name.md`
- External module installation from npm with progress indicators
- Module removal on unselect with confirmation

**Windows Compatibility Fix:**

- Replaced Inquirer.js with @clack/prompts to fix arrow key navigation issues on Windows
- All 91 installer workflows migrated to new prompt system

### 📚 Documentation Updates

**Significant docsite improvements:**

- Interactive workflow guide page (`/workflow-guide`) with track selector
- TEA documentation restructured using Diátaxis framework (25 docs)
- Style guide optimized for LLM readers (367 lines, down from 767)
- Glossary rewritten using table format (123 lines, down from 373)
- README overhaul with numbered command flows and prominent `/bmad-help` callout
- New workflow map diagram with interactive HTML
- New editorial review tasks for document quality
- E2E testing methodology for Game Dev Studio

More documentation updates coming soon.

### 🐛 Bug Fixes

- Fixed TodoMVC URL references to include `/dist/` path
- Fixed glob pattern normalization for Windows compatibility
- Fixed YAML indentation in kilo.js customInstructions field
- Fixed stale path references in check-implementation-readiness workflow
- Fixed sprint-status.yaml sync in correct-course workflow
- Fixed web bundler entry point reference
- Fixed mergeModuleHelpCatalogs ordering after generateManifests

### 📊 Statistics

- **91 commits** since alpha.23
- **969 files changed** (+23,716 / -91,509 lines)
- **Net reduction of ~67,793 lines** through cleanup and consolidation
- **3 major modules** moved to separate repositories
- **Complete installer refactor** for standardization

---

## [6.0.0-alpha.23]

**Release: January 11, 2026**

### 🌟 Key Highlights

1. **Astro/Starlight Documentation Platform**: Complete migration from Docusaurus to modern Astro+Starlight for superior performance and customization
2. **Diataxis Framework Implementation**: Professional documentation restructuring with tutorials, how-to guides, explanations, and references
3. **Workflow Creator & Validator**: Powerful new tools for workflow creation with subprocess support and PRD validation
4. **TEA Documentation Expansion**: Comprehensive testing documentation with cheat sheets, MCP enhancements, and API testing patterns
5. **Brainstorming Revolution**: Research-backed procedural rigor with 100+ idea goal and anti-bias protocols
6. **Cursor IDE Modernization**: Refactored from rules-based to command-based architecture for better IDE integration

### 📚 Documentation Platform Revolution

**Astro/Starlight Migration:**

- **From Docusaurus to Astro**: Complete platform migration for improved performance, better customization, and modern tooling
- **Starlight Theme**: Professional documentation theme with dark mode default and responsive design
- **Build Pipeline Overhaul**: New build-docs.js orchestrates link checking, artifact generation, and Astro build
- **LLM-Friendly Documentation**: Generated llms.txt and llms-full.txt for AI agent discoverability
- **Downloadable Source Bundles**: bmad-sources.zip and bmad-prompts.zip for offline use

**Diataxis Framework Implementation:**

- **Four Content Types**: Professional separation into tutorials, how-to guides, explanations, and references
- **21 Files Migrated**: Phase 1 migration of core documentation to Diataxis structure
- **42+ Focused Documents**: Phase 2 split of large legacy files into manageable pieces
- **FAQ Restructuring**: 7 topic-specific FAQ files with standardized format
- **Tutorial Style Guide**: Comprehensive documentation standards for consistent content creation

**Link Management & Quality:**

- **Site-Relative Links**: Converted 217 links to repo-relative format (/docs/path/file.md)
- **Link Validation Tools**: New validate-doc-links.js and fix-doc-links.js for maintaining link integrity
- **Broken Link Fixes**: Resolved ~50 broken internal links across documentation
- **BMad Acronym Standardization**: Consistent use of "BMad" (Breakthrough Method of Agile AI Driven Development)
- **SEO Optimization**: Absolute URLs in AI meta tags for better web crawler discoverability

### 🔧 Workflow Creator & Validator (Major Feature)

**Workflow Creation Tool:**

- **Subprocess Support**: Advanced workflows can now spawn subprocesses for complex operations
- **PRD Validation Step**: New validation step ensures PRD quality before workflow execution
- **Trimodal Workflow Creation**: Three-mode workflow generation system
- **Quadrivariate Module Workflow**: Four-variable workflow architecture for enhanced flexibility
- **Path Violation Checks**: Validator ensures workflows don't violate path constraints
- **Max Parallel Mode POC**: Proof-of-concept for parallel workflow validation

**Workflow Quality Improvements:**

- **PRD Trimodal Compliance**: PRD workflow now follows trimodal standards
- **Standardized Step Formatting**: Consistent markdown formatting across workflow and PRD steps
- **Better Suggested Next Steps**: Improved workflow completion guidance
- **Variable Naming Standardization**: {project_root} → {project-root} across all workflows

### 🧪 TEA Documentation Expansion

**Comprehensive Testing Guides:**

- **Cheat Sheets**: Quick reference guides for common testing scenarios
- **MCP Enhancements**: Model Context Protocol improvements for testing workflows
- **API Testing Patterns**: Best practices for API testing documentation
- **Design Philosophy Callout**: Clear explanation of TEA's design principles
- **Context Engineering Glossary**: New glossary entry defining context engineering concepts
- **Fragment Count Updates**: Accurate documentation of TEA workflow components
- **Playwright Utils Examples**: Updated code examples for playwright-utils integration

### 💡 Brainstorming Workflow Overhaul

**Research-Backed Procedural Rigor:**

- **100+ Idea Goal**: Emphasis on quantity-first approach to unlock better quality ideas
- **Anti-Bias Protocol**: Domain pivot every 10 ideas to reduce cognitive biases
- **Chain-of-Thought Requirements**: Reasoning before idea generation
- **Simulated Temperature**: Prompts for higher divergence in ideation
- **Standardized Idea Format**: Quality control template for consistent output
- **Energy Checkpoints**: Multiple continuation options to maintain creative flow

**Exploration Menu Improvements:**

- **Letter-Based Navigation**: [K/T/A/B/C] options instead of numbers for clarity
- **Keep/Try/Advanced/Break/Continue**: Clear action options for idea refinement
- **Universal Facilitation Rules**: Consistent guidelines across all brainstorming steps
- **Quality Growth Enforcement**: Balance between quantity and quality metrics

### 🖥️ Cursor IDE Modernization

**Command-Based Architecture:**

- **From Rules to Commands**: Complete refactor from rules-based to command-based system
- **Command Generation**: Automatic generation of task and tool commands
- **Commands Directory**: New `.cursor/commands/bmad/` structure for generated commands
- **Cleanup Integration**: Automatic cleanup of old BMAD commands alongside rules
- **Enhanced Logging**: Better feedback on agents, tasks, tools, and workflow commands generated

### 🤖 Agent System Improvements

**Agent Builder & Validation:**

- **hasSidecar Field**: All agents now indicate sidecar support (true/false)
- **Validation Enforcement**: hasSidecar now required in agent validation
- **Better Brownfield Documentation**: Improved brownfield project documentation
- **Agent Builder Updates**: Agent builder now uses hasSidecar field
- **Agent Editor Integration**: Editor workflow respects hasSidecar configuration

### 🐛 Bug Fixes & Quality Improvements

**Critical Fixes:**

- **Windows Line Endings**: Resolved CRLF issues causing cross-platform problems
- **Code-Review File Filtering**: Fixed code-review picking up non-application files
- **ERR_REQUIRE_ESM Resolution**: Dynamic import for inquirer v9+ compatibility
- **Project-Context Conflicts**: Allow full project-context usage with conflict precedence
- **Workflow Paths**: Fixed paths for workflow and sprint status files
- **Missing Scripts**: Fixed missing scripts from installation

**Workflow & Variable Fixes:**

- **Variable Naming**: Standardized from {project_root} to {project-root} across CIS, BMGD, and BMM modules
- **Workflow References**: Fixed broken .yaml → .md workflow references
- **Advanced Elicitation Variables**: Fixed undefined variables in brainstorming
- **Dependency Format**: Corrected dependency format and added missing frontmatter

**Code Quality:**

- **Dependency Updates**: Bumped qs from 6.14.0 to 6.14.1
- **CodeRabbit Integration**: Enabled auto-review on new PRs
- **TEA Fragment Counts**: Updated fragment counts for accuracy
- **Documentation Links**: Fixed Discord channel references (#general-dev → #bmad-development)

### 🚀 Installation & CLI Improvements

**Installation Enhancements:**

- **Workflow Exclusion**: Ability to exclude workflows from being added as commands
- **Example Workflow Protection**: Example workflow in workflow builder now excluded from tools
- **CNAME Configuration**: Added CNAME file for custom domain support
- **Script Fixes**: All scripts now properly included in installation

### 📊 Statistics

- **27 commits** since alpha.22
- **217 documentation links** converted to site-relative format
- **42+ focused documents** created from large legacy files
- **7 topic-specific FAQ files** with standardized formatting
- **Complete documentation platform** migrated from Docusaurus to Astro/Starlight
- **Major workflow tools** added: Creator, Validator with subprocess support
- **Brainstorming workflow** overhauled with research-backed rigor

---

## [6.0.0-alpha.22]

**Release: December 31, 2025**

### 🌟 Key Highlights

1. **Unified Agent Workflow**: Create, Edit, and Validate workflows consolidated into single powerful agent workflow with separate step paths
2. **Agent Knowledge System**: Comprehensive data file architecture with persona properties, validation patterns, and crafting principles
3. **Deep Language Integration**: All sharded progressive workflows now support language choice at every step
4. **Core Module Documentation**: Extensive docs for core workflows (brainstorming, party mode, advanced elicitation)
5. **BMAD Core Concepts**: New documentation structure explaining agents, workflows, modules, and installation
6. **Tech Spec Sharded**: create-tech-spec workflow converted to sharded format with orient-first pattern

### 🤖 Unified Agent Workflow (Major Feature)

**Consolidated Architecture:**

- **Single Workflow, Three Paths**: Create, Edit, and Validate operations unified under `src/modules/bmb/workflows/agent/`
- **steps-c/**: Create path with 9 comprehensive steps for building new agents
- **steps-e/**: Edit path with 10 steps for modifying existing agents
- **steps-v/**: Validate path for standalone agent validation review
- **data/**: Centralized knowledge base for all agent-building intel

### 📚 Agent Knowledge System

**Data File Architecture:**

Located in `src/modules/bmb/workflows/agent/data/`:

- **agent-metadata.md** (208 lines) - Complete metadata field reference
- **agent-menu-patterns.md** (233 lines) - Menu design patterns and best practices
- **agent-compilation.md** (273 lines) - Compilation process documentation
- **persona-properties.md** (266 lines) - Persona crafting properties and examples
- **principles-crafting.md** (292 lines) - Core principles for agent design
- **critical-actions.md** (120 lines) - Critical action patterns
- **expert-agent-architecture.md** (236 lines) - Expert agent structure
- **expert-agent-validation.md** (173 lines) - Expert-specific validation
- **module-agent-validation.md** (124 lines) - Module-specific validation
- **simple-agent-architecture.md** (204 lines) - Simple agent structure
- **simple-agent-validation.md** (132 lines) - Simple agent validation
- **understanding-agent-types.md** (222 lines) - Agent type comparison
- **brainstorm-context.md** - Brainstorming guidance
- **communication-presets.csv** - Communication style presets

**Reference Examples:**

- **reference/module-examples/architect.agent.yaml** - Module agent example
- **reference/simple-examples/commit-poet.agent.yaml** - Simple agent example
- **journal-keeper/** - Complete sidecar pattern example

**Templates:**

- **templates/simple-agent.template.md** - Simple agent template
- **templates/expert-agent-template/expert-agent.template.md** - Expert agent template
- **templates/expert-agent-sidecar/** - Sidecar templates (instructions, memories)

### 🌍 Deep Language Integration

**Progressive Workflow Language Support:**

- **Every Step Biased**: All sharded progressive workflow steps now include language preference context
- **260+ Files Updated**: Comprehensive language integration across:
  - Core workflows (brainstorming, party mode, advanced elicitation)
  - BMB workflows (create-agent, create-module, create-workflow, edit-workflow, etc.)
  - BMGD workflows (game-brief, gdd, narrative, game-architecture, etc.)
  - BMM workflows (research, create-ux-design, prd, create-architecture, etc.)
- **Tested Languages**: Verified working with Spanish and Pirate Speak
- **Natural Conversations**: AI agents respond in configured language throughout workflow

### 📖 Core Module Documentation

**New Core Documentation Structure:**

`docs/modules/core/`:

- **index.md** - Core module overview
- **core-workflows.md** - Core workflow documentation
- **core-tasks.md** - Core task reference
- **brainstorming.md** (100 lines) - Brainstorming workflow guide
- **party-mode.md** (50 lines) - Party mode guide
- **advanced-elicitation.md** (105 lines) - Advanced elicitation techniques
- **document-sharding-guide.md** (133 lines) - Sharded workflow format guide
- **global-core-config.md** - Global core configuration reference

**Advanced Elicitation Moved:**

- **From**: `docs/` root
- **To**: `src/core/workflows/advanced-elicitation/`
- **Status**: Now a proper core workflow with methods.csv

### 📚 BMAD Core Concepts Documentation

**New Documentation Structure:**

`docs/bmad-core-concepts/`:

- **index.md** - Core concepts introduction
- **agents.md** (93 lines) - Understanding agents in BMAD
- **workflows.md** (89 lines) - Understanding workflows in BMAD
- **modules.md** (76 lines) - Understanding modules (BMM, BMGD, CIS, BMB, Core)
- **installing/index.md** (77 lines) - Installation guide
- **installing/upgrading.md** (144 lines) - Upgrading guide
- **bmad-customization/index.md** - Customization overview
- **bmad-customization/agents.md** - Agent customization guide
- **bmad-customization/workflows.md** (30 lines) - Workflow customization guide
- **web-bundles/index.md** (34 lines) - Web bundle distribution guide

**Documentation Cleanup:**

- **Removed v4-to-v6-upgrade.md** - Outdated upgrade guide
- **Removed document-sharding-guide.md** from docs root (moved to core)
- **Removed web-bundles-gemini-gpt-guide.md** - Consolidated into web-bundles/index.md
- **Removed getting-started/installation.md** - Migrated to bmad-core-concepts
- **Removed all ide-info/*.md files** - Consolidated into web-bundles documentation

### 🔧 Create-Tech-Spec Sharded Conversion

**Monolithic to Sharded:**

- **From**: Single `workflow.yaml` with `instructions.md`
- **To**: Sharded `workflow.md` with individual step files
- **Pattern**: Orient-first approach (understand before investigating)

### 🔨 Additional Improvements

**Workflow Status Path Fixes:**

- **Corrected Discovery Paths**: workflow-status workflows now properly use planning_artifacts and implementation_artifacts
- **Updated All Path Files**: enterprise-brownfield, enterprise-greenfield, method-brownfield, method-greenfield

**Documentation Updates:**

- **BMB Agent Creation Guide**: Comprehensive 166-line guide for agent creation
- **Workflow Vendoring Doc**: New 42-line guide on workflow customization and inheritance
- **Document Project Reference**: Moved from BMM docs to shared location
- **Workflows Planning Guide**: New 89-line guide for planning workflows

**BMB Documentation Streamlining:**

- **Removed Redundant Docs**: Eliminated duplicate documentation in `src/modules/bmb/docs/`
- **Step File Rules**: New 469-line comprehensive guide for step file creation
- **Agent Docs Moved**: Agent architecture and validation docs moved to workflow data/

**Windows Inquirer Fix:**

- **Another Default Addition**: Additional inquirer default value setting for better Windows multiselection support

**Code Quality:**

- **Removed Old BMM README**: Consolidated module documentation
- **Removed BMM Troubleshooting**: 661-line doc moved to shared location
- **Removed Enterprise Agentic Development**: 686-line doc consolidated
- **Removed Scale Adaptive System**: 618-line doc consolidated

---

## [6.0.0-alpha.21]

**Release: December 27, 2025**

### 🌟 Key Highlights

1. **Consistent Menu System**: All agents now use standardized 2-letter menu codes (e.g., "rd" for research, "ca" for create-architecture)
2. **Planning Artifacts Architecture**: Phase 1-3 workflows now properly segregate planning artifacts from documentation
3. **Windows Installer Fixed Again**: Updated inquirer to resolve multiselection tool issues
4. **Auto-Injected Features**: Chat and party mode automatically injected into all agents
5. **Validation System**: All agents now pass comprehensive new validation checks

### 🎯 Consistent Menu System (Major Feature)

**Standardized 2-Letter Codes:**

- **Compound Menu Triggers**: All agents now use consistent 2-letter compound trigger format (e.g., `bmm-rd`, `bmm-ca`)
- **Improved UX**: Shorter, more memorable command shortcuts across all modules
- **Module Prefixing**: Menu items properly scoped by module prefix (bmm-, bmgd-, cis-, bmb-)
- **Universal Pattern**: All 22 agents updated to follow the same menu structure

**Agent Updates:**

- **BMM Module**: 9 agents with standardized menus (pm, analyst, architect, dev, ux-designer, tech-writer, sm, tea, quick-flow-solo-dev)
- **BMGD Module**: 6 agents with standardized menus (game-architect, game-designer, game-dev, game-qa, game-scrum-master, game-solo-dev)
- **CIS Module**: 6 agents with standardized menus (innovation-strategist, design-thinking-coach, creative-problem-solver, brainstorming-coach, presentation-master, storyteller)
- **BMB Module**: 3 agents with standardized menus (bmad-builder, agent-builder, module-builder, workflow-builder)
- **Core Module**: BMAD Master agent updated with consistent menu patterns

### 📁 Planning Artifacts Architecture

**Content Segregation Implementation:**

- **Phase 1-3 Workflows**: All planning workflows now use `planning_artifacts` folder (default changed from `docs`)
- **Proper Input Discovery**: Workflows follow consistent input discovery patterns from planning artifacts
- **Output Management**: Planning artifacts properly separated from long-term documentation
- **Affected Workflows**:
  - Product Brief: Updated discovery and output to planning artifacts
  - PRD: Fixed discovery and output to planning artifacts
  - UX Design: Updated all steps for proper artifact handling
  - Architecture: Updated discovery and output flow
  - Game Architecture: Updated for planning artifacts
  - Story Creation: Updated workflow output paths

**File Organization:**

- **Planning Artifacts**: Ephemeral planning documents (prd.md, product-brief.md, ux-design.md, architecture.md)
- **Documentation**: Long-term project documentation (separate from planning)
- **Module Configuration**: BMM and BMGD modules updated with proper default paths

### 🪟 Windows Installer Fixes

**Inquirer Multiselection Fix:**

- **Updated Inquirer Version**: Resolved tool multiselection issues that were causing Windows installer failures
- **Better Compatibility**: Improved handling of checkbox and multi-select prompts on Windows(?)

### 🤖 Agent System Improvements

**Auto-Injected Features:**

- **Chat Mode**: Automatically injected into all agents during compilation
- **Party Mode**: Automatically injected into all agents during compilation
- **Reduced Manual Configuration**: No need to manually add these features to agent definitions
- **Consistent Behavior**: All agents now have uniform access to chat and party mode capabilities

**Agent Normalization:**

- **All Agents Validated**: All 22 agents pass comprehensive validation checks
- **Schema Enforcement**: Proper compound trigger validation implemented
- **Metadata Cleanup**: Removed obsolete and inconsistent metadata patterns
- **Test Fixtures Updated**: Validation test fixtures aligned with new requirements

### 🔧 Bug Fixes & Cleanup

**Docusaurus Merge Recovery:**

- **Restored Agent Files**: Fixed agent files accidentally modified in Docusaurus merge (PR #1191)
- **Reference Cleanup**: Removed obsolete agent reference examples (journal-keeper, security-engineer, trend-analyst)
- **Test Fixture Updates**: Aligned test fixtures with current validation requirements

**Code Quality:**

- **Schema Improvements**: Enhanced agent schema validation with better error messages
- **Removed Redundancy**: Cleaned up duplicate and obsolete agent definitions
- **Installer Cleanup**: Removed unused configuration code from BMM installer

**Planning Artifacts Path:**
- Default: `planning_artifacts/` (configurable in module.yaml)
- Previous: `docs/`
- Benefit: Clear separation between planning work and permanent documentation

---

## [6.0.0-alpha.20]

**Release: December 23, 2025**

### 🌟 Key Highlights

1. **Windows Installer Fixed**: Better compatibility with inquirer v9.x upgrade
2. **Path Segregation**: Revolutionary content organization separating ephemeral artifacts from permanent documentation
3. **Custom Installation Messages**: Configurable intro/outro messages for professional installation experience
4. **Enhanced Upgrade Logic**: Two-version auto upgrades with proper config preservation
5. **Quick-Dev Refactor**: Sharded format with comprehensive adversarial review
6. **Improved Quality**: Streamlined personas, fixed workflows, and cleaned up documentation
7. **Doc Site Auto Generation**; Auto Generate a docusaurus site update on merge

### 🪟 Windows Installer (hopefully) Fixed

**Inquirer Upgrade:**

- **Updated to v9.x**: Upgraded inquirer package for better Windows support
- **Improved Compatibility**: Better handling of Windows terminal environments
- **Enhanced UX**: More reliable interactive prompts across platforms

### 🎯 Path Segregation Implementation (Major Feature)

**Revolutionary Content Organization:**

- **Phase 1-4 Path Segregation**: Implemented new BM paths across all BMM and BMGD workflows
- **Planning vs Implementation Artifacts**: Separated ephemeral Phase 4 artifacts from permanent documentation
- **Optimized File Organization**: Better structure differentiating planning artifacts from long-term project documentation
- **Backward Compatible**: Existing installations continue working while preparing for optimized content organization
- **Module Configuration Updates**: Enhanced module.yaml with new path configurations for all phases
- **Workflow Path Updates**: All 90+ workflow files updated with proper path configurations

**Documentation Cleanup:**

- **Removed Obsolete Documentation**: Cleaned up 3,100+ lines of outdated documentation
- **Streamlined README Files**: Consolidated and improved module documentation
- **Enhanced Clarity**: Removed redundant content and improved information architecture

### 💬 Installation Experience Enhancements

**Custom Installation Messages:**

- **Configurable Intro/Outro Messages**: New install-messages.yaml file for customizable installation messages
- **Professional Installation Flow**: Custom welcome messages and completion notifications
- **Module-Specific Messaging**: Tailored messages for different installation contexts
- **Enhanced User Experience**: More informative and personalized installation process

**Core Module Improvements:**

- **Always Ask Questions**: Core module now always prompts for configuration (no accept defaults)
- **Better User Engagement**: Ensures users actively configure their installation
- **Improved Configuration Accuracy**: Reduces accidental acceptance of defaults

### 🔧 Upgrade & Configuration Management

**Two-Version Auto Upgrade:**

- **Smarter Upgrade Logic**: Automatic upgrades now span 2 versions (e.g., .16 → .18)
- **Config Variable Preservation**: Ensures all configuration variables are retained during quick updates
- **Seamless Updates**: Quick updates now preserve custom settings properly
- **Enhanced Upgrade Safety**: Better handling of configuration across version boundaries

### 🤖 Workflow Improvements

**Quick-Dev Workflow Refactor (PR #1182):**

- **Sharded Format Conversion**: Converted quick-dev workflow to modern step-file format
- **Adversarial Review Integration**: Added comprehensive self-check and adversarial review steps
- **Enhanced Quality Assurance**: 6-step process with mode detection, context gathering, execution, self-check, review, and resolution
- **578 New Lines Added**: Significant expansion of quick-dev capabilities

**BMGD Workflow Fixes:**

- **workflow-status Filename Correction**: Fixed incorrect filename references (PR #1172)
- **sprint-planning Update**: Added workflow-status update to game-architecture completion
- **Path Corrections**: Resolved dead references and syntax errors (PR #1164)

### 🎨 Code Quality & Refactoring

**Persona Streamlining (PR #1167):**

- **Quick-Flow-Solo-Dev Persona**: Streamlined for clarity and accuracy
- **Improved Agent Behavior**: More focused and efficient solo development support

**Package Management:**

- **package-lock.json Sync**: Ensured version consistency (PR #1168)
- **Dependency Cleanup**: Reduced package-lock bloat significantly

**Prettier Configuration:**

- **Markdown Underscore Protection**: Prettier will no longer mess up underscores in markdown files
- **Disabled Auto-Fix**: Markdown formatting issues now handled more intelligently
- **Better Code Formatting**: Improved handling of special characters in documentation

### 📚 Documentation Updates

**Sponsor Attribution:**

- **DigitalOcean Sponsorship**: Added attribution for DigitalOcean support (PR #1162)

**Content Reorganization:**

- **Removed Unused Docs**: Eliminated obsolete documentation files
- **Consolidated References**: Merged and reorganized technical references
- **Enhanced README Files**: Improved module and workflow documentation

### 🧹 Cleanup & Optimization

**File Organization:**

- **Removed Asterisk Insertion**: Eliminated unwanted asterisk insertions into agent files
- **Removed Unused Commands**: Cleaned up deprecated command references
- **Consolidated Duplication**: Reduced code duplication across multiple files
- **Removed Unneeded Folders**: Cleaned up temporary and obsolete directory structures

### 📊 Statistics

- **23 commits** since alpha.19
- **90+ workflow files** updated with new path configurations
- **3,100+ lines of documentation** removed and reorganized
- **578 lines added** to quick-dev workflow with adversarial review
- **Major architectural improvement** to content organization

## [6.0.0-alpha.19]

**Release: December 18, 2025**

### 🐛 Bug Fixes

**Installer Stability:**

- **Fixed \_bmad Folder Stutter**: Resolved issue with duplicate \_bmad folder creation when applying agent custom files
- **Cleaner Installation**: Removed unnecessary backup file that was causing bloat in the installer
- **Streamlined Agent Customization**: Fixed path handling for agent custom files to prevent folder duplication

### 📊 Statistics

- **3 files changed** with critical fix
- **3,688 lines removed** by eliminating backup files
- **Improved installer performance** and stability

---

## [6.0.0-alpha.18]

**Release: December 18, 2025**

### 🎮 BMGD Module - Complete Game Development Module Updated

**Massive BMGD Overhaul:**

- **New Game QA Agent (GLaDOS)**: Elite Game QA Architect with test automation specialization
  - Engine-specific expertise: Unity, Unreal, Godot testing frameworks
  - Comprehensive knowledge base with 15+ testing topics
  - Complete testing workflows: test-framework, test-design, automate, playtest-plan, performance-test, test-review

- **New Game Solo Dev Agent (Indie)**: Rapid prototyping and iteration specialist
  - Quick-flow workflows optimized for solo/small team development
  - Streamlined development process for indie game creators

- **Production Workflow Alignment**: BMGD 4-production now fully aligned with BMM 4-implementation
  - Removed obsolete workflows: story-done, story-ready, story-context, epic-tech-context
  - Added sprint-status workflow for project tracking
  - All workflows updated as standalone with proper XML instructions

**Game Testing Architecture:**

- **Complete Testing Knowledge Base**: 15 comprehensive testing guides covering:
  - Engine-specific: Unity (TF 1.6.0), Unreal, Godot testing
  - Game-specific: Playtesting, balance, save systems, multiplayer
  - Platform: Certification (TRC/XR), localization, input systems
  - QA Fundamentals: Automation, performance, regression, smoke testing

**New Workflows & Features:**

- **workflow-status**: Multi-mode status checker for game projects
  - Game-specific project levels (Game Jam → AAA)
  - Support for gamedev and quickflow paths
  - Project initialization workflow

- **create-tech-spec**: Game-focused technical specification workflow
  - Engine-aware (Unity/Unreal/Godot) specifications
  - Performance and gameplay feel considerations

- **Enhanced Documentation**: Complete documentation suite with 9 guides
  - agents-guide.md: Reference for all 6 agents
  - workflows-guide.md: Complete workflow documentation
  - game-types-guide.md: 24 game type templates
  - quick-flow-guide.md: Rapid development guide
  - Comprehensive troubleshooting and glossary

### 🤖 Agent Management Improved

**Agent Recompile Feature:**

- **New Menu Item**: Added "Recompile Agents" option to the installer menu
- **Selective Compilation**: Recompile only agents without full module upgrade
- **Faster Updates**: Quick agent updates without complete reinstallation
- **Customization Integration**: Automatically applies customizations during recompile

**Agent Customization Enhancement:**

- **Complete Field Support**: ALL fields from agent customization YAML are now properly injected
- **Deep Merge Implementation**: Customizations now properly override all agent properties
- **Persistent Customizations**: Custom settings survive updates and recompiles
- **Enhanced Flexibility**: Support for customizing metadata, persona, menu items, and workflows

### 🔧 Installation & Module Management

**Custom Module Installation:**

- **Enhanced Module Addition**: Modify install now supports adding custom modules even if none were originally installed
- **Flexible Module Management**: Easy addition and removal of custom modules post-installation
- **Improved Manifest Tracking**: Better tracking of custom vs core modules

**Quality Improvements:**

- **Comprehensive Code Review**: Fixed 20+ issues identified in PR review
- **Type Validation**: Added proper type checking for configuration values
- **Path Security**: Enhanced path traversal validation for better security
- **Documentation Updates**: All documentation updated to reflect new features

### 📊 Statistics

- **178 files changed** with massive BMGD expansion
- **28,350+ lines added** across testing documentation and workflows
- **2 new agents** added to BMGD module
- **15 comprehensive testing guides** created
- **Complete alignment** between BMGD and BMM production workflows

### 🌟 Key Highlights

1. **BMGD Module Revolution**: Complete overhaul with professional game development workflows
2. **Game Testing Excellence**: Comprehensive testing architecture for all major game engines
3. **Agent Management**: New recompile feature allows quick agent updates without full reinstall
4. **Full Customization Support**: All agent fields now customizable via YAML
5. **Industry-Ready Documentation**: Professional-grade guides for game development teams

---

## [6.0.0-alpha.17]

**Release: December 16, 2025**

### 🚀 Revolutionary Installer Overhaul

**Unified Installation Experience:**

- **Streamlined Module Installation**: Completely redesigned installer with unified flow for both core and custom content
- **Single Install Panel**: Eliminated disjointed clearing between modules for smoother, more intuitive installation
- **Quick Default Selection**: New quick install feature with default selections for faster setup of selected modules
- **Enhanced UI/UX**: Improved question order, reduced verbose output, and cleaner installation interface
- **Logical Question Flow**: Reorganized installer questions to follow natural progression and user expectations

**Custom Content Installation Revolution:**

- **Full Custom Content Support**: Re-enabled complete custom content generation and sharing through the installer
- **Custom Module Tracking**: Manifest now tracks custom modules separately to ensure they're always installed from the custom cache
- **Custom Installation Order**: Custom modules now install after core modules for better dependency management
- **Quick Update with Custom Content**: Quick update now properly retains and updates custom content
- **Agent Customization Integration**: Customizations are now applied during quick updates and agent compilation

### 🧠 Revolutionary Agent Memory & Visibility System

**Breaking Through Dot-Folder Limitations:**

- **Dot-Folder to Underscore Migration**: Critical change from `.bmad` to `_bmad` ensures LLMs (Codex, Claude, and others) can no longer ignore or skip BMAD content - dot folders are commonly filtered out by AI systems
- **Universal Content Visibility**: Underscore folders are treated as regular content, ensuring full AI agent access to all BMAD resources and configurations
- **Agent Memory Architecture**: Rolled out comprehensive agent memory support for installed agents with `-sidecar` folders
- **Persistent Agent Learning**: Sidecar content installs to `_bmad/_memory`, giving each agent the ability to learn and remember important information specific to its role

**Content Location Strategy:**

- **Standardized Memory Location**: All sidecar content now uses `_bmad/_memory` as the unified location for agent memories
- **Segregated Output System**: New architecture supports differentiating between ephemeral Phase 4 artifacts and long-term documentation
- **Forward Compatibility**: Existing installations continue working with content in docs folder, with optimization coming in next release
- **Configuration Cleanup**: Renamed `_cfg` to `_config` for clearer naming conventions
- **YAML Library Consolidation**: Reduced dependency to use only one YAML library for better stability

### 🎯 Future-Ready Architecture

**Content Organization Preview:**

- **Phase 4 Artifact Segregation**: Infrastructure ready for separating ephemeral workflow artifacts from permanent documentation
- **Planning vs Implementation Docs**: New system will differentiate between planning artifacts and long-term project documentation
- **Backward Compatibility**: Current installs maintain full functionality while preparing for optimized content organization
- **Quick Update Path**: Tomorrow's quick update will fully optimize all BMM workflows to use new segregated output locations

### 🎯 Sample Modules & Documentation

**Comprehensive Examples:**

- **Sample Unitary Module**: Complete example with commit-poet agent and quiz-master workflow
- **Sample Wellness Module**: Meditation guide and wellness companion agents demonstrating advanced patterns
- **Enhanced Documentation**: Updated README files and comprehensive installation guides
- **Custom Content Creation Guides**: Step-by-step documentation for creating and sharing custom modules

### 🔧 Bug Fixes & Optimizations

**Installer Improvements:**

- **Fixed Duplicate Entry Issue**: Resolved duplicate entries in files manifest
- **Reduced Log Noise**: Less verbose logging during installation for cleaner user experience
- **Menu Wording Updates**: Improved menu text for better clarity and understanding
- **Fixed Quick Install**: Resolved issues with quick installation functionality

**Code Quality:**

- **Minor Code Cleanup**: General cleanup and refactoring throughout the codebase
- **Removed Unused Code**: Cleaned up deprecated and unused functionality
- **Release Workflow Restoration**: Fixed automated release workflow for v6

**BMM Phase 4 Workflow Improvements:**

- **Sprint Status Enhancement**: Improved sprint-status validation with interactive correction for unknown values and better epic status handling
- **Story Status Standardization**: Normalized all story status references to lowercase kebab-case (ready-for-dev, in-progress, review, done)
- **Removed Stale Story State**: Eliminated deprecated 'drafted' story state - stories now go directly from creation to ready-for-dev
- **Code Review Clarity**: Improved code review completion message from "Story is ready for next work!" to "Code review complete!" for better clarity
- **Risk Detection Rules**: Rewrote risk detection rules for better LLM clarity and fixed warnings vs risks naming inconsistency

### 📊 Statistics

- **40+ commits** since alpha.16
- **Major installer refactoring** with complete UX overhaul
- **2 new sample modules** with comprehensive examples
- **Full custom content support** re-enabled and improved

### 🌟 Key Highlights

1. **Installer Revolution**: The installation system has been completely overhauled for better user experience, reliability, and speed
2. **Custom Content Freedom**: Users can now easily create, share, and install custom content through the streamlined installer
3. **AI Visibility Breakthrough**: Migration from `.bmad` to `_bmad` ensures LLMs can access all BMAD content (dot folders are commonly ignored by AI systems)
4. **Agent Memory System**: Rolled out persistent agent memory support - agents with `-sidecar` folders can now learn and remember important information in `_bmad/_memory`
5. **Quick Default Selection**: Installation is now faster with smart default selections for popular configurations
6. **Future-Ready Architecture**: Infrastructure in place for segregating ephemeral artifacts from permanent documentation (full optimization coming in next release)

## [6.0.0-alpha.16]

**Release: December 10, 2025**

### 🔧 Temporary Changes & Fixes

**Installation Improvements:**

- **Temporary Custom Content Installation Disable**: Custom content installation temporarily disabled to improve stability
- **BMB Workflow Path Fixes**: Fixed numerous path references in BMB workflows to ensure proper step file resolution
- **Package Updates**: Updated dependencies for improved security and performance

**Path Resolution Improvements:**

- **BMB Agent Builder Fixes**: Corrected path references in step files and documentation
- **Workflow Path Standardization**: Ensured consistent path handling across all BMB workflows
- **Documentation References**: Updated internal documentation links and references

**Cleanup Changes:**

- **Example Modules Removal**: Temporarily removed example modules to prevent accidental installation
- **Memory Management**: Improved sidecar file handling for custom modules

### 📊 Statistics

- **336 files changed** with path fixes and improvements
- **4 commits** since alpha.15

---

## [6.0.0-alpha.15]

**Release: December 7, 2025**

### 🔧 Module Installation Standardization

**Unified Module Configuration:**

- **module.yaml Standard**: All modules now use `module.yaml` instead of `_module-installer/install-config.yaml` for consistent configuration (BREAKING CHANGE)
- **Universal Installer**: Both core and custom modules now use the same installer with consistent behavior
- **Streamlined Module Creation**: Module builder templates updated to use new module.yaml standard
- **Enhanced Module Discovery**: Improved module caching and discovery mechanisms

**Custom Content Installation Revolution:**

- **Interactive Custom Content Search**: Installer now proactively asks if you have custom content to install
- **Flexible Location Specification**: Users can indicate custom content location during installation
- **Improved Custom Module Handler**: Enhanced error handling and debug output for custom installations
- **Comprehensive Documentation**: New custom-content-installation.md guide (245 lines) replacing custom-agent-installation.md

### 🤖 Code Review Integration Expansion

**AI Review Tools:**

- **CodeRabbit AI Integration**: Added .coderabbit.yaml configuration for automated code review
- **Raven's Verdict PR Review Tool**: New PR review automation tool (297 lines of documentation)
- **Review Path Configuration**: Proper exclusion patterns for node_modules and generated files
- **Review Documentation**: Comprehensive usage guidance and skip conditions for PRs

### 📚 Documentation Improvements

**Documentation Restructuring:**

- **Code of Conduct**: Moved to .github/ folder following GitHub standards
- **Gem Creation Link**: Updated to point to Gemini Gem manager instead of deprecated interface
- **Example Custom Content**: Improved README files and disabled example modules to prevent accidental installation
- **Custom Module Documentation**: Enhanced module installation guides with new YAML structure

### 🧹 Cleanup & Optimization

**Memory Management:**

- **Removed Hardcoded .bmad Folders**: Cleaned up demo content to use configurable paths
- **Sidecar File Cleanup**: Removed old .bmad-user-memory folders from wellness modules
- **Example Content Organization**: Better organization of example-custom-content directory

**Installer Improvements:**

- **Debug Output Enhancement**: Added informative debug output when installer encounters errors
- **Custom Module Caching**: Improved caching mechanism for custom module installations
- **Consistent Behavior**: All modules now behave consistently regardless of custom or core status

### 📊 Statistics

- **77 files changed** with 2,852 additions and 607 deletions
- **15 commits** since alpha.14

### ⚠️ Breaking Changes

1. **module.yaml Configuration**: All modules must now use `module.yaml` instead of `_module-installer/install-config.yaml`
   - Core modules updated automatically
   - Custom modules will need to rename their configuration file
   - Module builder templates generate new format

### 📦 New Dependencies

- No new dependencies added in this release

---

## [6.0.0-alpha.14]

**Release: December 7, 2025**

### 🔧 Installation & Configuration Revolution

**Custom Module Installation Overhaul:**

- **Simple custom.yaml Installation**: Custom agents and workflows can now be installed with a single YAML file
- **IDE Configuration Preservation**: Upgrades will no longer delete custom modules, agents, and workflows from IDE configuration
- **Removed Legacy agent-install Command**: Streamlined installation process (BREAKING CHANGE)
- **Sidecar File Retention**: Custom sidecar files are preserved during updates
- **Flexible Agent Sidecar Locations**: Fully configurable via config options instead of hardcoded paths

**Module Discovery System Transformation:**

- **Recursive Agent Discovery**: Deep scanning for agents across entire project structure
- **Enhanced Manifest Generation**: Comprehensive scanning of all installed modules
- **Nested Agent Support**: Fixed nested agents appearing in CLI commands
- **Module Reinstall Fix**: Prevented modules from showing as obsolete during reinstall

### 🏗️ Advanced Builder Features

**Workflow Builder Evolution:**

- **Continuable Workflows**: Create workflows with sophisticated branching and continuation logic
- **Template LOD Options**: Level of Detail output options for flexible workflow generation
- **Step-Based Architecture**: Complete conversion to granular step-file system
- **Enhanced Creation Process**: Improved workflow creation with better template handling

**Module Builder Revolution:**

- **11-Step Module Creation**: Comprehensive step-by-step module generation process
- **Production-Ready Templates**: Complete templates for agents, installers, and workflow plans
- **Built-in Validation System**: Ensures module quality and BMad Core compliance
- **Professional Documentation**: Auto-generated module documentation and structure

### 🚀 BMad Method (BMM) Enhancements

**Workflow Improvements:**

- **Brownfield PRD Support**: Enhanced PRD workflow for existing project integration
- **Sprint Status Command**: New workflow for tracking development progress
- **Step-Based Format**: Improved continue functionality across all workflows
- **Quick-Spec-Flow Documentation**: Rapid development specification flows

**Documentation Revolution:**

- **Comprehensive Troubleshooting Guide**: 680-line detailed troubleshooting documentation
- **Quality Check Integration**: Added markdownlint-cli2 for markdown quality assurance
- **Enhanced Test Architecture**: Improved CI/CD templates and testing workflows

### 🌟 New Features & Integrations

**Kiro-Cli Installer:**

- **Intelligent Routing**: Smart routing to quick-dev workflow
- **BMad Core Compliance**: Full compliance with BMad standards

**Discord Notifications:**

- **Compact Format**: Streamlined plain-text notifications
- **Bug Fixes**: Resolved notification delivery issues

**Example Mental Wellness Module (MWM):**

- **Complete Module Example**: Demonstrates advanced module patterns
- **Multiple Agents**: CBT Coach, Crisis Navigator, Meditation Guide, Wellness Companion
- **Workflow Showcase**: Crisis support, daily check-in, meditation, journaling workflows

### 🐛 Bug Fixes & Optimizations

- Fixed version reading from package.json instead of hardcoded fallback
- Removed hardcoded years from WebSearch queries
- Removed broken build caching mechanism
- Enhanced TTS injection summary with tracking and documentation
- Fixed CI nvmrc configuration issues

### 📊 Statistics

- **335 files changed** with 17,161 additions and 8,204 deletions
- **46 commits** since alpha.13

### ⚠️ Breaking Changes

1. **Removed agent-install Command**: Migrate to new custom.yaml installation system
2. **Agent Sidecar Configuration**: Now requires explicit config instead of hardcoded paths

### 📦 New Dependencies

- `markdownlint-cli2: ^0.19.1` - Professional markdown linting

---

## [6.0.0-alpha.13]

**Release: November 30, 2025**

### 🏗️ Revolutionary Workflow Architecture

- **Step-File System**: Complete conversion to granular step-file architecture with dynamic menu generation
- **Phase 4 Transformation**: Simplified architecture with sprint planning integration (Jira, Linear, Trello)
- **Performance Improvements**: Eliminated time-based estimates, reduced file loading times
- **Legacy Cleanup**: Removed all deprecated workflows for cleaner system

### 🤖 Agent System Revolution

- **Universal Custom Agent Support**: Extended to ALL IDEs including Antigravity and Rovo Dev
- **Agent Creation Workflow**: Enhanced with better documentation and parameter clarity
- **Multi-Source Discovery**: Agents now check multiple source locations for better discovery
- **GitHub Migration**: Integration moved from chatmodes to agents folder

### 🧪 Testing Infrastructure

- **Playwright Utils Integration**: @seontechnologies/playwright-utils across all testing workflows
- **TTS Injection System**: Complete text-to-speech integration for voice feedback
- **Web Bundle Test Support**: Enabled web bundles for test environments

### ⚠️ Breaking Changes

1. **Legacy Workflows Removed**: Migrate to new stepwise sharded workflows
2. **Phase 4 Restructured**: Update automation expecting old Phase 4 structure
3. **Agent Compilation Required**: Custom agents must use new creation workflow

## [6.0.0-alpha.12]

**Release: November 19, 2025**

### 🐛 Bug Fixes

- Added missing `yaml` dependency to fix `MODULE_NOT_FOUND` error when running `npx bmad-method install`

## [6.0.0-alpha.11]

**Release: November 18, 2025**

### 🚀 Agent Installation Revolution

- **bmad agent-install CLI**: Interactive agent installation with persona customization
- **4 Reference Agents**: commit-poet, journal-keeper, security-engineer, trend-analyst
- **Agent Compilation Engine**: YAML → XML with smart handler injection
- **60 Communication Presets**: Pure communication styles for agent personas

### 📚 BMB Agent Builder Enhancement

- **Complete Documentation Suite**: 7 new guides for agent architecture and creation
- **Expert Agent Sidecar Support**: Multi-file agents with templates and knowledge bases
- **Unified Validation**: 160-line checklist shared across workflows
- **BMM Agent Voices**: All 9 agents enhanced with distinct communication styles

### 🎯 Workflow Architecture Change

- **Epic Creation Moved**: Now in Phase 3 after Architecture for technical context
- **Excalidraw Distribution**: Diagram capabilities moved to role-appropriate agents
- **Google Antigravity IDE**: New installer with flattened file naming

### ⚠️ Breaking Changes

1. **Frame Expert Retired**: Use role-appropriate agents for diagrams
2. **Agent Installation**: New bmad agent-install command replaces manual installation
3. **Epic Creation Phase**: Moved from Phase 2 to Phase 3

## [6.0.0-alpha.10]

**Release: November 16, 2025**

- **Epics After Architecture**: Major milestone - technically-informed user stories created post-architecture
- **Frame Expert Agent**: New Excalidraw specialist with 4 diagram workflows
- **Time Estimate Prohibition**: Warnings across 33 workflows acknowledging AI's impact on development speed
- **Platform-Specific Commands**: ide-only/web-only fields filter menu items by environment
- **Agent Customization**: Enhanced memory/prompts merging via \*.customize.yaml files

## [6.0.0-alpha.9]

**Release: November 12, 2025**

- **Intelligent File Discovery**: discover_inputs with FULL_LOAD, SELECTIVE_LOAD, INDEX_GUIDED strategies
- **3-Track System**: Simplified from 5 levels to 3 intuitive tracks
- **Web Bundles Guide**: Comprehensive documentation with 60-80% cost savings strategies
- **Unified Output Structure**: Eliminated .ephemeral/ folders - single configurable output folder
- **BMGD Phase 4**: Added 10 game development workflows with BMM patterns

## [6.0.0-alpha.8]

**Release: November 9, 2025**

- **Configurable Installation**: Custom directories with .bmad hidden folder default
- **Optimized Agent Loading**: CLI loads from installed files, eliminating duplication
- **Party Mode Everywhere**: All web bundles include multi-agent collaboration
- **Phase 4 Artifact Separation**: Stories, code reviews, sprint plans configurable outside docs
- **Expanded Web Bundles**: All BMM, BMGD, CIS agents bundled with elicitation integration

## [6.0.0-alpha.7]

**Release: November 7, 2025**

- **Workflow Vendoring**: Web bundler performs automatic cross-module dependency vendoring
- **BMGD Module Extraction**: Game development split into standalone 4-phase structure
- **Advanced Elicitation Fix**: Added missing CSV files to workflow bundles
- **Claude Code Fix**: Resolved README slash command installation regression

## [6.0.0-alpha.6]

**Release: November 4, 2025**

- **Critical Installer Fixes**: Fixed manifestPath error and option display issues
- **Conditional Docs Installation**: Optional documentation to reduce production footprint
- **Improved Installer UX**: Better formatting with descriptive labels and clearer feedback
- **Issue Tracker Cleanup**: Closed 54 legacy v4 issues for focused v6 development
- **Contributing Updates**: Removed references to non-existent branches

## [6.0.0-alpha.5]

**Release: November 4, 2025**

- **3-Track Scale System**: Simplified from 5 levels to 3 intuitive preference-driven tracks
- **Elicitation Modernization**: Replaced legacy XML tags with explicit invoke-task pattern
- **PM/UX Evolution**: Added November 2025 industry research on AI Agent PMs
- **Brownfield Reality Check**: Rewrote Phase 0 with 4 real-world scenarios
- **Documentation Accuracy**: All agent capabilities now match YAML source of truth

## [6.0.0-alpha.4]

**Release: November 2, 2025**

- **Documentation Hub**: Created 18 comprehensive guides (7000+ lines) with professional standards
- **Paige Agent**: New technical documentation specialist across all BMM phases
- **Quick Spec Flow**: Intelligent Level 0-1 planning with auto-stack detection
- **Universal Shard-Doc**: Split large markdown documents with dual-strategy loading
- **Intent-Driven Planning**: PRD and Product Brief transformed from template-filling to conversation

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
