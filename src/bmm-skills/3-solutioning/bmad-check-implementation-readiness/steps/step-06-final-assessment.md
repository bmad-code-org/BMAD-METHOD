---
outputFile: '{planning_artifacts}/implementation-readiness-report-{{date}}.md'
---

# Step 6: Final Assessment

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

To provide a comprehensive summary of all findings and give the report a final polish, ensuring clear recommendations and overall readiness status.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📖 You are at the final step - complete the assessment
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are delivering the FINAL ASSESSMENT
- ✅ Your findings are objective and backed by evidence
- ✅ Provide clear, actionable recommendations
- ✅ Success is measured by value of findings

### Step-Specific Rules:

- 🎯 Compile and summarize all findings
- 🚫 Don't soften the message - be direct
- 💬 Provide specific examples for problems
- 🚪 Add final section to the report

## EXECUTION PROTOCOLS:

- 🎯 Review all findings from previous steps
- 💾 Add summary and recommendations
- 📖 Determine overall readiness status
- 🚫 Complete and present final report

## FINAL ASSESSMENT PROCESS:

### 1. Initialize Final Assessment

"Completing **Final Assessment**.

I will now:

1. Review all findings from previous steps
2. Provide a comprehensive summary
3. Add specific recommendations
4. Determine overall readiness status"

### 2. Review Previous Findings

Check the {outputFile} for sections added by previous steps:

- File and FR Validation findings
- UX Alignment issues
- Epic Quality violations
- PRD Structural Verification findings (from Step 2)

### 3. Add Final Assessment Section

Append to {outputFile}:

```markdown
## Summary and Recommendations

### Overall Readiness Status

[READY/NEEDS WORK/NOT READY]
**Structural Verification:** {Available and consistent / Available with warnings / Partial / Unavailable}

### Critical Issues Requiring Immediate Action

[List most critical issues that must be addressed]

### Recommended Next Steps

1. [Specific action item 1]
2. [Specific action item 2]
3. [Specific action item 3]
{If structural warnings exist:}
- Review PRD assumptions flagged by structural verification — {contradicted_count} of {total} PRD claims contradicted by actual codebase graph (see PRD Structural Verification section)

### Final Note

This assessment identified [X] issues across [Y] categories. Address the critical issues before proceeding to implementation. These findings can be used to improve the artifacts or you may choose to proceed as-is.
```

### 4. Complete the Report

- Ensure all findings are clearly documented
- Verify recommendations are actionable
- Add date and assessor information
- Save the final report

### 5. Present Completion

Display:
"**Implementation Readiness Assessment Complete**

Report generated: {outputFile}

The assessment found [number] issues requiring attention. Review the detailed report for specific findings and recommendations."

## WORKFLOW COMPLETE

The implementation readiness workflow is now complete. The report contains all findings and recommendations for the user to consider.

Implementation Readiness complete. Invoke the `bmad-help` skill.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All findings compiled and summarized
- Clear recommendations provided
- Readiness status determined
- Final report saved

### ❌ SYSTEM FAILURE:

- Not reviewing previous findings
- Incomplete summary
- No clear recommendations

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.
