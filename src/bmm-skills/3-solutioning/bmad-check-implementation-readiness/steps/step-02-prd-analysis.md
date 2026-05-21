---
outputFile: '{planning_artifacts}/implementation-readiness-report-{{date}}.md'
epicsFile: '{planning_artifacts}/*epic*.md' # Will be resolved to actual file
---

# Step 2: PRD Analysis

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
- All queries are ADVISORY — NEVER block the readiness workflow
- Process STRICTLY SEQUENTIALLY with `for...of` + `await`
- NEVER use `Promise.all` for Memtrace queries
- Check index freshness before trusting graph output
- Use `--summarize` for any call that could exceed 2000 tokens

---

## STEP GOAL:

To fully read and analyze the PRD document (whole or sharded) to extract all Functional Requirements (FRs) and Non-Functional Requirements (NFRs) for validation against epics coverage.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are an expert Product Manager
- ✅ Your expertise is in requirements analysis and traceability
- ✅ You think critically about requirement completeness
- ✅ Success is measured in thorough requirement extraction

### Step-Specific Rules:

- 🎯 Focus ONLY on reading and extracting from PRD
- 🚫 Don't validate files (done in step 1)
- 💬 Read PRD completely - whole or all sharded files
- 🚪 Extract every FR and NFR with numbering

## EXECUTION PROTOCOLS:

- 🎯 Load and completely read the PRD
- 💾 Extract all requirements systematically
- 📖 Document findings in the report
- 🚫 FORBIDDEN to skip or summarize PRD content

## PRD ANALYSIS PROCESS:

### 1. Initialize PRD Analysis

"Beginning **PRD Analysis** to extract all requirements.

I will:

1. Load the PRD document (whole or sharded)
2. Read it completely and thoroughly
3. Extract ALL Functional Requirements (FRs)
4. Extract ALL Non-Functional Requirements (NFRs)
5. Document findings for coverage validation"

### 2. Load and Read PRD

From the document inventory in step 1:

- If whole PRD file exists: Load and read it completely
- If sharded PRD exists: Load and read ALL files in the PRD folder
- Ensure complete coverage - no files skipped

### 3. Extract Functional Requirements (FRs)

Search for and extract:

- Numbered FRs (FR1, FR2, FR3, etc.)
- Requirements labeled "Functional Requirement"
- User stories or use cases that represent functional needs
- Business rules that must be implemented

Format findings as:

```
## Functional Requirements Extracted

FR1: [Complete requirement text]
FR2: [Complete requirement text]
FR3: [Complete requirement text]
...
Total FRs: [count]
```

### 4. Extract Non-Functional Requirements (NFRs)

Search for and extract:

- Performance requirements (response times, throughput)
- Security requirements (authentication, encryption, etc.)
- Usability requirements (accessibility, ease of use)
- Reliability requirements (uptime, error rates)
- Scalability requirements (concurrent users, data growth)
- Compliance requirements (standards, regulations)

Format findings as:

```
## Non-Functional Requirements Extracted

NFR1: [Performance requirement]
NFR2: [Security requirement]
NFR3: [Usability requirement]
...
Total NFRs: [count]
```

### 5. Document Additional Requirements

Look for:

- Constraints or assumptions
- Technical requirements not labeled as FR/NFR
- Business constraints
- Integration requirements

### 5.5: Structural Assumptions Verification (Memtrace)

If the repository is indexed by Memtrace, verify architectural claims in the PRD against the actual codebase graph. This step is ADVISORY.

**Check Availability:**
- Call `list_indexed_repositories` (Memtrace MCP tool, direct call) to confirm the project repo is indexed
- Check the `last_indexed_at` value — if older than 30 minutes, flag as stale and skip graph queries
- If not indexed, skip and note "Structural verification unavailable"

**Verify PRD Claims:**

Scan the PRD for architectural claims (dependency relationships, centrality assertions, module boundaries, or scope claims). If the PRD contains no explicit architectural claims, note "No structural claims to verify" and skip this section.

For each architectural claim found (e.g., "module X depends on module Y", "component Z is central to the system"), verify against the graph:

1. **Dependency Claims:** For each stated dependency between modules/components, resolve module names to symbols by searching for key exports, classes, or entry points within each module. Then use `find_dependency_path` (Memtrace MCP tool, direct call) with the resolved source and target symbols to confirm the actual path exists. Flag claims where no path exists or the direction is reversed.

2. **Centrality Claims:** For modules/components described as "core" or "central", use `find_central_symbols` (Memtrace MCP tool, direct call) to verify their actual PageRank position.

3. **Module Boundary Claims:** If the PRD describes module/component boundaries, compare against `list_communities` to verify those boundaries align with the actual graph communities.

4. **Scope Claims:** If the PRD claims specific scope (e.g., "this change affects only module X"), use `get_impact` on the target symbols to verify the actual blast radius. If the PRD doesn't name specific symbols, note "Cannot verify scope claims — no target symbols specified in PRD" as a warning rather than attempting arbitrary queries.

**Document Findings:**

Include in the PRD Analysis section under "PRD Structural Verification":

```markdown
### PRD Structural Verification {✅/⚠️/—}

{If verified — all claims confirmed:}
✅ **PRD claims verified against codebase graph:**
- {count} dependency claims confirmed out of {total} verified
- Centrality claims match actual graph structure
- Module boundaries align with graph communities

{If mismatches found — some claims contradicted:}
⚠️ **PRD claims contradicted by codebase graph ({contradicted_count} of {total}):**
- {claim 1} — Actual graph shows {reality}
- {claim 2} — Actual graph shows {reality}
- Flag these mismatches for human review — the agent cannot determine whether the PRD or the graph is correct.

{If no claims found in PRD:}
— No architectural claims found in PRD to verify against codebase graph.

{If no target symbols for scope claims:}
— Cannot verify scope claims — no target symbols specified in PRD.

{If unavailable (no indexed repo or stale index):}
— Structural verification unavailable — no indexed repository found (or index is stale).
  PRD claims could not be verified against actual codebase structure.
```

**Graceful Degradation:**
- Memtrace unavailability does NOT block the step — proceed with document-based analysis
- Structural mismatches are WARNINGS, not errors — flag for human review
- PRDs with no architectural claims skip cleanly with a note

### 6. Add to Assessment Report

Append to {outputFile}:

```markdown
## PRD Analysis

### Functional Requirements

[Complete FR list from section 3]

### Non-Functional Requirements

[Complete NFR list from section 4]

### Additional Requirements

[Any other requirements or constraints found]

### PRD Structural Verification

[Findings from section 5.5]

### PRD Completeness Assessment

[Initial assessment of PRD completeness and clarity]
```

### 7. Auto-Proceed to Next Step

After PRD analysis complete, immediately load next step for epic coverage validation.

## PROCEEDING TO EPIC COVERAGE VALIDATION

PRD analysis complete. Read fully and follow: `./step-03-epic-coverage-validation.md`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- PRD loaded and read completely
- All FRs extracted with full text
- All NFRs identified and documented
- PRD structural assumptions verified against codebase graph (if repository indexed)
- Findings added to assessment report

### ❌ SYSTEM FAILURE:

- Not reading complete PRD (especially sharded versions)
- Missing requirements in extraction
- Summarizing instead of extracting full text
- Not documenting findings in report

**Master Rule:** Complete requirement extraction is essential for traceability validation.
