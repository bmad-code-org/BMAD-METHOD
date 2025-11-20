---
last-redoc-date: 2025-10-20
---

# Debug Agent (Diana) Guide

## Overview

- **Persona:** Diana, Debug Specialist & Root Cause Analyst focused on systematic bug analysis, defect detection, and resolution strategies.
- **Mission:** Deliver comprehensive debugging analysis using proven methodologies like Fagan inspection, binary search debugging, and root cause analysis to achieve high defect detection rates.
- **Use When:** Investigating complex bugs, performing root cause analysis, systematic code inspection, or establishing debugging workflows for the team.

## Prerequisites and Setup

1. Ensure you have a clear bug description or symptom to investigate
2. Confirm `{bmad_folder}/bmm/config.yaml` defines `project_name`, `output_folder`, and language settings
3. Have access to:
   - Source code repository
   - Recent commit history
   - Test suite and execution results
   - Environment and configuration details
4. Review supporting knowledge fragments:
   - `{bmad_folder}/bmm/debug/debug-index.csv` + `{bmad_folder}/bmm/debug/knowledge/*.md`

## High-Level Cheat Sheets

### Quick Triage Workflow

| Phase          | Debug Agent Action                                          | Developer Action                            | Outputs                                                 |
| -------------- | ----------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| Initial Report | Run `*quick-debug` for rapid triage                         | Provide bug description, steps to reproduce | Initial assessment, severity classification             |
| Investigation  | Execute `*inspect` for comprehensive Fagan inspection       | Gather additional context as requested      | Detailed defect analysis with root cause identification |
| Root Cause     | Run `*root-cause` for fishbone analysis                     | Validate findings, provide domain knowledge | Root cause report with evidence trail                   |
| Fix Planning   | Execute `*validate-fix` to assess proposed solution         | Propose fix approach                        | Fix validation with risk assessment                     |
| Documentation  | Run `*debug-report` to generate comprehensive documentation | Review and approve report                   | Complete debug report for knowledge base                |

<details>
<summary>Execution Notes</summary>

- Use `*quick-debug` for initial triage and priority assignment
- Execute `*inspect` for systematic defect analysis using Fagan methodology (60-90% detection rate)
- Apply `*root-cause` when symptoms are clear but underlying causes need investigation
- Always run `*validate-fix` before implementing proposed solutions to assess risks
- Generate `*debug-report` to capture lessons learned and prevent similar defects

</details>

<details>
<summary>Worked Example – "Payment Processing Failure"</summary>

1. **Triage:** Developer reports payment failures in production. Diana runs `*quick-debug` and classifies as P0 (Critical).
2. **Inspection:** `*inspect` execution reveals race condition in transaction processing during Fagan Phase 4.
3. **Root Cause:** `*root-cause` identifies improper async/await handling as root cause (Technology/Process factors).
4. **Validation:** Developer proposes fix. `*validate-fix` confirms solution addresses root cause without side effects.
5. **Documentation:** `*debug-report` generates comprehensive report including prevention strategies.

</details>

### Complex Bug Investigation

| Phase            | Debug Agent Action                                           | Developer Action                                 | Outputs                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------- |
| Pattern Analysis | Run `*pattern-analysis` to identify systemic issues          | Review recent changes and feature additions      | Defect pattern report with trend analysis                       |
| Isolation        | Execute `*wolf-fence` for binary search debugging            | Assist with test execution and environment setup | Narrowed problem area with specific components identified       |
| Minimization     | Run `*delta-minimize` to reduce test case                    | Validate minimal reproduction case               | Smallest failing test case for efficient debugging              |
| Static Analysis  | Execute `*static-scan` for automated defect detection        | Address identified issues by priority            | Prioritized list of code smells, anti-patterns, vulnerabilities |
| Assertion Review | Run `*assert-analyze` for defensive programming improvements | Implement suggested assertions                   | Strategic assertion placement recommendations                   |

<details>
<summary>Execution Notes</summary>

- Start with `*pattern-analysis` when multiple related bugs occur
- Use `*wolf-fence` for large codebases where bug location is unclear
- Apply `*delta-minimize` when bugs require complex reproduction steps
- Execute `*static-scan` proactively as part of code review process
- Run `*assert-analyze` to prevent defensive programming gaps

</details>

### Production Debugging Workflow

| Phase                  | Debug Agent Action                               | DevOps/Team Action                            | Outputs                                                |
| ---------------------- | ------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------ |
| Instrumentation Design | Run `*instrument` to plan observability points   | Review and implement logging/monitoring       | Strategic instrumentation plan with minimal overhead   |
| Walkthrough Prep       | Execute `*walkthrough-prep` for team code review | Participate in structured walkthrough session | Review materials, checklist, defect tracking docs      |
| Fix Validation         | Run `*validate-fix` post-implementation          | Deploy fix to staging environment             | Validation report with regression test recommendations |

<details>
<summary>Execution Notes</summary>

- Use `*instrument` before production issues become critical
- Execute `*walkthrough-prep` for high-risk code sections or complex features
- Always `*validate-fix` in staging before production deployment

</details>

## Command Reference

All commands require the `*` prefix (e.g., `*inspect`):

- **`*help`** - Display all available commands
- **`*inspect`** - Execute comprehensive Fagan inspection (6-phase systematic analysis)
- **`*quick-debug`** - Rapid triage and initial assessment for simple issues
- **`*pattern-analysis`** - Analyze code changes for defect patterns and systemic issues
- **`*root-cause`** - Execute focused root cause analysis using fishbone methodology
- **`*validate-fix`** - Verify proposed fix addresses root cause without side effects
- **`*debug-report`** - Generate comprehensive debug report from current session
- **`*wolf-fence`** - Binary search debugging to isolate bug location efficiently
- **`*delta-minimize`** - Reduce failing test case to minimal reproduction
- **`*assert-analyze`** - Analyze code for missing assertions and invariants
- **`*static-scan`** - Perform comprehensive static analysis for common defects
- **`*instrument`** - Design strategic logging and monitoring points
- **`*walkthrough-prep`** - Generate materials for code walkthrough session
- **`*exit`** - Exit debug agent session

## Knowledge Base

The debug agent uses a knowledge index system to load relevant information on-demand:

- **`debug-index.csv`** - Index of all knowledge fragments with tags and descriptions
- **`knowledge/debug-inspection-checklist.md`** - Systematic Fagan inspection checklist
- **`knowledge/root-cause-checklist.md`** - Fishbone methodology checklist
- **`knowledge/common-defects.md`** - Catalog of common defect patterns by type and severity
- **`knowledge/debug-patterns.md`** - Proven debugging strategies and detection methods

## Best Practices

1. **Systematic Approach:** Always follow proven methodologies (Fagan, fishbone) rather than ad-hoc debugging
2. **Evidence-Based:** Document all findings with clear evidence trails
3. **Root Cause Focus:** Don't stop at symptoms; identify and address underlying causes
4. **Prevention Oriented:** Generate recommendations to prevent similar defects
5. **Documentation:** Maintain comprehensive debug reports for knowledge sharing
6. **Validation:** Always verify fixes against root cause and test for side effects

## Integration with Development Workflow

The Debug Agent integrates with the BMAD development workflow:

1. **Pre-Implementation:** Use `*assert-analyze` and `*static-scan` during code review
2. **During Development:** Apply `*quick-debug` for rapid issue triage
3. **Bug Investigation:** Execute `*inspect` and `*root-cause` for thorough analysis
4. **Fix Validation:** Run `*validate-fix` before merging
5. **Post-Release:** Use `*instrument` and `*pattern-analysis` for production monitoring

## Defect Severity Levels

- **P0 (Critical):** System unusable, data loss, security breach - Immediate response
- **P1 (High):** Major feature broken, significant impact - Within 24 hours
- **P2 (Medium):** Feature impaired, moderate impact - Within sprint
- **P3 (Low):** Minor issue, minimal impact - Next release

## Support and Resources

- Workflows are located in `{bmad_folder}/bmm/workflows/debug/`
- Knowledge fragments in `{bmad_folder}/bmm/debug/knowledge/`
- For questions or issues, consult the BMad Master agent
