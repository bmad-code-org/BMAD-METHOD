# Step 2: Project Context Analysis

## 🧠 Memtrace Context (Self-Contained)

Memtrace graph queries are available for structural dependency discovery.
If activation failed to load persistent_facts, this context is sufficient:

**Available MCP tools (direct usage):**
- `list_indexed_repositories` — check index availability
- `get_codebase_briefing` (summary mode) — repository scale, modules, risk
- `list_communities` — logical module boundaries
- `find_central_symbols` (limit 10) — load-bearing code (PageRank)
- `find_bridge_symbols` (limit 10) — architectural chokepoints
- `find_dependency_path` — verify actual call direction between modules
- `find_api_endpoints` — check for endpoint overlap

**For blast radius (use adapter):**
`node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <symbol> --query get_impact --check-freshness --summarize`

> **Complete Memtrace MCP tool catalog:**
> **Navigation:** find_code, find_symbol, get_source_window, get_directory_tree
> **Architecture:** get_codebase_briefing, list_communities, list_processes, get_process_flow
> **Dependencies:** get_symbol_context, analyze_relationships, get_impact, find_dependency_path, get_api_topology
> **Quality:** find_dead_code, find_most_complex_functions, find_bridge_symbols, find_central_symbols
> **Temporal:** get_evolution, get_changes_since, get_timeline, get_episode_replay
> **Index:** index_directory, list_indexed_repositories, watch_directory, delete_repository

**Rules:**
- All queries are ADVISORY — NEVER block the architecture workflow
- Process STRICTLY SEQUENTIALLY with `for...of` + `await`
- NEVER use `Promise.all` for Memtrace queries
- Check index freshness before trusting graph output
- Use `--summarize` for any call that could exceed 2000 tokens

---

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between architectural peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on understanding project scope and requirements for architecture
- 🎯 ANALYZE loaded documents, don't assume or generate requirements
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating project context analysis
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper insights about project context and architectural implications
- **P (Party Mode)**: Bring multiple perspectives to analyze project requirements from different architectural angles
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Invoke the `bmad-advanced-elicitation` skill
- When 'P' selected: Invoke the `bmad-party-mode` skill
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from step 1 are available
- Input documents already loaded are in memory (PRD, epics, UX spec, etc.)
- Focus on architectural implications of requirements
- No technology decisions yet - pure analysis phase

## YOUR TASK:

Fully read and Analyze the loaded project documents to understand architectural scope, requirements, and constraints before beginning decision making.

## CONTEXT ANALYSIS SEQUENCE:

### 1. Review Project Requirements

**From PRD Analysis:**

- Extract and analyze Functional Requirements (FRs)
- Identify Non-Functional Requirements (NFRs) like performance, security, compliance
- Note any technical constraints or dependencies mentioned
- Count and categorize requirements to understand project scale

**From Epics/Stories (if available):**

- Map epic structure and user stories to architectural components
- Extract acceptance criteria for technical implications
- Identify cross-cutting concerns that span multiple epics
- Estimate story complexity for architectural planning

**From UX Design (if available):**

- Extract architectural implications from UX requirements:
  - Component complexity (simple forms vs rich interactions)
  - Animation/transition requirements
  - Real-time update needs (live data, collaborative features)
  - Platform-specific UI requirements
  - Accessibility standards (WCAG compliance level)
  - Responsive design breakpoints
  - Offline capability requirements
  - Performance expectations (load times, interaction responsiveness)

### 1.5: Gather Structural Context (Memtrace)

If the project repository is indexed by Memtrace, query the graph to ground the architecture in actual codebase structure. This step is ADVISORY — skip if Memtrace is unavailable.

**Check Availability:**
- Call `list_indexed_repositories` (Memtrace MCP tool — callable directly through the agent's tool interface, no adapter needed for this lightweight query)
- Check the `last_indexed_at` value in the response: if older than 30 minutes, note that the index may be stale and skip graph queries
- If no indexed repo matches the project root, skip this sub-section and note "Structural context unavailable — no indexed repository found" in the analysis

**If Available — Query Structural Facts:**

1. **Get Codebase Briefing:** Call `get_codebase_briefing` (Memtrace MCP tool, direct call) to understand scale, module count, endpoint coverage, and high-risk symbols. Map response fields to the template as follows: `briefing.total_symbols` → `{node_count}`, `briefing.community_count` → `{community_count}`.

2. **Discover Module Boundaries:** Call `list_communities` (Memtrace MCP tool, direct call) to identify actual logical modules (community clusters). These represent real bounded contexts that may differ from the directory structure.

3. **For Brownfield Projects — Map Existing Architecture:**
   - Call `find_central_symbols` (limit 10) to identify load-bearing code
   - Call `find_bridge_symbols` (limit 10) to find architectural chokepoints
   - If the PRD mentions specific modules or components, use `find_dependency_path` to verify actual relationships

**Document Findings:**

Include in the "Project Context Analysis" section under a new "Existing Codebase Structure" subsection:

```markdown
### Existing Codebase Structure (Memtrace)

{If available and all queries succeeded:}
- **Repository scale:** {node_count} symbols across {community_count} logical modules
- **Central symbols (highest PageRank):** {list of top symbols}
- **Bridge/chokepoint symbols:** {list of bridge symbols}
- **Community clusters:** {summary of major communities and their sizes}
- **Brownfield integration points:** {key modules the new work must integrate with}

{If partial: some queries succeeded, some failed:}
- **Partial structural context (some queries failed):** {what was successfully retrieved}
- **Failed queries:** {list of queries that failed}
- Structural context is incomplete — note which aspects could not be determined.

{If unavailable (no indexed repo or index is stale):}
- Structural context unavailable — no indexed repository found (or index is stale). Architectural decisions will be based on documented requirements only.
```

**Graceful Degradation:**
- If `list_indexed_repositories` returns empty or the project repo is not indexed: skip
- If the repository is indexed but no communities are found (greenfield project): skip community-level queries, note "Empty graph — project has no existing codebase structure to analyze"
- If some queries succeed and others fail: document partial results (see "Partial" template above)
- If all queries time out or fail: note the failure and skip remaining queries
- NEVER block the workflow on Memtrace availability — this is advisory context

### 2. Project Scale Assessment

Calculate and present project complexity:

**Complexity Indicators:**

- Real-time features requirements
- Multi-tenancy needs
- Regulatory compliance requirements
- Integration complexity
- User interaction complexity
- Data complexity and volume

### 3. Reflect Understanding

Present your analysis back to user for validation:

"I'm reviewing your project documentation for {{project_name}}.

{if_epics_loaded}I see {{epic_count}} epics with {{story_count}} total stories.{/if_epics_loaded}
{if_no_epics}I found {{fr_count}} functional requirements organized into {{fr_category_list}}.{/if_no_epics}
{if_ux_loaded}I also found your UX specification which defines the user experience requirements.{/if_ux_loaded}

**Key architectural aspects I notice:**

- [Summarize core functionality from FRs]
- [Note critical NFRs that will shape architecture]
- {if_ux_loaded}[Note UX complexity and technical requirements]{/if_ux_loaded}
- [Identify unique technical challenges or constraints]
- [Highlight any regulatory or compliance requirements]

**Scale indicators:**

- Project complexity appears to be: [low/medium/high/enterprise]
- Primary technical domain: [web/mobile/api/backend/full-stack/etc]
- Cross-cutting concerns identified: [list major ones]

This analysis will help me guide you through the architectural decisions needed to ensure AI agents implement this consistently.

Does this match your understanding of the project scope and requirements?"

### 4. Generate Project Context Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
{{analysis of FRs and what they mean architecturally}}

**Non-Functional Requirements:**
{{NFRs that will drive architectural decisions}}

**Scale & Complexity:**
{{project_scale_assessment}}

- Primary domain: {{technical_domain}}
- Complexity level: {{complexity_level}}
- Estimated architectural components: {{component_count}}

### Technical Constraints & Dependencies

{{known_constraints_dependencies}}

### Cross-Cutting Concerns Identified

{{concerns_that_will_affect_multiple_components}}
```

### 5. Present Content and Menu

Show the generated content and present choices:

"I've drafted the Project Context Analysis based on your requirements. This sets the foundation for our architectural decisions.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper into architectural implications
[P] Party Mode - Bring different perspectives to analyze requirements
[C] Continue - Save this analysis and begin architectural decisions"

### 6. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with the current context analysis
- Process the enhanced architectural insights that come back
- Ask user: "Accept these enhancements to the project context analysis? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with the current project context
- Process the collaborative improvements to architectural understanding
- Ask user: "Accept these changes to the project context analysis? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/architecture.md`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `./step-03-starter.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 4.

## SUCCESS METRICS:

✅ All input documents thoroughly analyzed for architectural implications
✅ Project scope and complexity clearly assessed and validated
✅ Technical constraints and dependencies identified
✅ Cross-cutting concerns mapped for architectural planning
✅ User confirmation of project understanding
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected
✅ Structural context gathered from Memtrace graph (if repository is indexed)

## FAILURE MODES:

❌ Skimming documents without deep architectural analysis
❌ Missing or misinterpreting critical NFRs
❌ Not validating project understanding with user
❌ Underestimating complexity indicators
❌ Generating content without real analysis of loaded documents
❌ Not presenting A/P/C menu after content generation
❌ Failing to gracefully skip Memtrace queries when repository is not indexed

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-03-starter.md` to evaluate starter template options.

Remember: Do NOT proceed to step-03 until user explicitly selects 'C' from the A/P/C menu and content is saved!
