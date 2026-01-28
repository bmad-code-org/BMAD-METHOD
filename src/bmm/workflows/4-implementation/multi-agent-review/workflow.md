# Multi-Agent Code Review v3.0

<purpose>
Perform unbiased code review using multiple specialized AI agents in fresh context.
Agent count scales with story complexity. Independent perspective prevents bias.
</purpose>

<philosophy>
**Fresh Context, Multiple Perspectives**

- Review happens in NEW session (not the agent that wrote the code)
- Prevents bias from implementation decisions
- Agent count determined by complexity, agents chosen by code analysis
- Smart selection: touching auth code → auth-security agent, etc.
</philosophy>

<config>
name: multi-agent-review
version: 3.0.0

agent_selection:
  micro: {count: 2, agents: [security, code_quality]}
  standard: {count: 4, agents: [security, code_quality, architecture, testing]}
  complex: {count: 6, agents: [security, code_quality, architecture, testing, performance, domain_expert]}

available_agents:
  security: "Identifies vulnerabilities and security risks"
  code_quality: "Reviews style, maintainability, best practices"
  architecture: "Reviews system design, patterns, structure"
  testing: "Evaluates test coverage and quality"
  performance: "Analyzes efficiency and optimization"
  domain_expert: "Validates business logic and domain constraints"
</config>

<execution_context>
@patterns/security-checklist.md
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

<process>

<step name="determine_agent_count" priority="first">
**Select agents based on complexity**

```
If complexity_level == "micro":
  agents = ["security", "code_quality"]
  Display: 🔍 MICRO Review (2 agents)

Else if complexity_level == "standard":
  agents = ["security", "code_quality", "architecture", "testing"]
  Display: 📋 STANDARD Review (4 agents)

Else if complexity_level == "complex":
  agents = ALL 6 agents
  Display: 🔬 COMPLEX Review (6 agents)
```
</step>

<step name="load_story_context">
**Load story file and understand requirements**

```bash
STORY_FILE="{{story_file}}"
[ -f "$STORY_FILE" ] || { echo "❌ Story file not found"; exit 1; }
```

Use Read tool on story file. Extract:
- What was supposed to be implemented
- Acceptance criteria
- Tasks and subtasks
- File list
</step>

<step name="invoke_review_agents">
**Spawn review agents in fresh context**

For each agent in selected agents, spawn Task agent:

```
Task({
  subagent_type: "general-purpose",
  description: "{{agent_type}} review for {{story_key}}",
  prompt: `
You are the {{AGENT_TYPE}} reviewer for story {{story_key}}.

<execution_context>
@patterns/security-checklist.md
@patterns/hospital-grade.md
</execution_context>

<context>
Story: [inline story content]
Changed files: [git diff output]
</context>

<objective>
Review from your {{agent_type}} perspective. Find issues, be thorough.
</objective>

<success_criteria>
- [ ] All relevant files reviewed
- [ ] Issues categorized by severity (CRITICAL/HIGH/MEDIUM/LOW)
- [ ] Return ## AGENT COMPLETE with findings
</success_criteria>
`
})
```

Wait for all agents to complete. Aggregate findings.
</step>

<step name="aggregate_findings">
**Collect and categorize all findings**

Merge findings from all agents:
- CRITICAL: Security vulnerabilities, data loss risks
- HIGH: Production bugs, logic errors
- MEDIUM: Technical debt, maintainability
- LOW: Nice-to-have improvements
</step>

<step name="present_report">
**Display review summary**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 MULTI-AGENT CODE REVIEW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agents Used: {{agent_count}}
- Security Agent
- Code Quality Agent
[...]

Findings:
- 🔴 CRITICAL: {{critical_count}}
- 🟠 HIGH: {{high_count}}
- 🟡 MEDIUM: {{medium_count}}
- 🔵 LOW: {{low_count}}
```

For each finding, display:
- Severity and title
- Agent that found it
- Location (file:line)
- Description and recommendation
</step>

<step name="recommend_actions">
**Suggest next steps based on findings**

```
📋 RECOMMENDED NEXT STEPS:

If CRITICAL findings exist:
  ⚠️ MUST FIX before proceeding
  - Address all critical security/correctness issues
  - Re-run review after fixes

If only HIGH/MEDIUM findings:
  ✅ Story may proceed
  - Consider addressing high-priority items
  - Create follow-up tasks for medium items

If only LOW/INFO findings:
  ✅ Code quality looks good
  - Optional: Address style/optimization suggestions
```
</step>

</process>

<integration>
**When to use:**
- Complex stories (≥16 tasks or high-risk keywords)
- Security-sensitive code
- Significant architectural changes
- When single-agent review was inconclusive

**When NOT to use:**
- Micro stories (≤3 tasks)
- Standard stories with simple changes
- Stories that passed adversarial review cleanly

**Usage Examples:**

```bash
# Default: Use complexity-based agent count
/bmad_bmm_multi-agent-review 28-1-volunteer-role-permissions

# Override: Force specific count (token-conscious)
/bmad_bmm_multi-agent-review 28-2-volunteer-profile --count 2

# Complex story but budget-conscious
/bmad_bmm_multi-agent-review 28-3-volunteer-opportunities --count 3

# Skip review entirely (micro story)
/bmad_bmm_multi-agent-review 28-4-tiny-fix --count 0
```

**Parameter:**
- `--count N` (optional): Override complexity-based count
  - Range: 0-6 (0 = skip review)
  - Default: null (uses complexity_level)
  - Capped at 6 maximum for safety
</integration>

<failure_handling>
**Review agent fails:** Fall back to adversarial code review.
**API error:** Log failure, continue pipeline with warning.
</failure_handling>

<success_criteria>
- [ ] All selected agents completed review
- [ ] Findings aggregated and categorized
- [ ] Report displayed with recommendations
</success_criteria>
