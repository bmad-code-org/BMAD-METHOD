# Root Cause Analysis Workflow

Focused root cause analysis using fishbone (Ishikawa) methodology and 5-Whys technique.

## Context

This workflow performs systematic root cause analysis to identify the underlying causes of defects, moving beyond symptoms to address fundamental issues.

## Prerequisites

- Clear symptom or problem statement
- Access to system logs and error messages
- Knowledge of recent changes or deployments
- Understanding of system architecture
- Access to code repository

## Instructions

Execute the following steps in order:

### Step 1: Problem Definition

1. Ask user for problem/symptom description if not already provided
2. Clearly state the problem/symptom
3. Define when it occurs (timing, frequency, patterns)
4. Define where it occurs (component, environment, scope)
5. Quantify the impact (users affected, severity level P0-P3)
6. Document problem statement clearly

### Step 2: Fishbone Analysis Categories

Load `root-cause-checklist.md` and analyze the problem across these six dimensions:

#### People (Developer/User factors)

- Knowledge gaps or misunderstandings
- Communication breakdowns between teams
- Incorrect assumptions made during development
- User behavior patterns contributing to issue
- Training or documentation gaps

#### Process (Development/Deployment)

- Missing validation or review steps
- Inadequate testing coverage
- Deployment procedures not followed
- Code review gaps or oversights
- Documentation process failures

#### Technology (Tools/Infrastructure)

- Framework limitations or bugs
- Library bugs or incompatibilities
- Infrastructure issues or constraints
- Tool configuration problems
- Version compatibility issues

#### Environment (System/Configuration)

- Environment-specific settings or differences
- Resource constraints (memory, CPU, disk)
- External dependencies or integrations
- Network or connectivity issues
- Configuration drift between environments

#### Data (Input/State)

- Invalid or unexpected input data
- Data corruption or inconsistency
- State management issues
- Race conditions or timing problems
- Data validation gaps

#### Methods (Algorithms/Design)

- Algorithm flaws or inefficiencies
- Design pattern misuse
- Architecture limitations
- Performance bottlenecks
- Logic errors in implementation

### Step 3: 5-Whys Deep Dive

For each potential cause identified in Step 2:

1. Ask "Why does this happen?" - Document the answer
2. For each answer, ask "Why?" again - Go deeper
3. Continue asking "Why?" until reaching the root cause (typically 5 iterations)
4. Document the complete chain of causation
5. Ensure the final "Why" points to something actionable

Example:

- Problem: Application crashes
- Why? Memory leak
- Why? Objects not released
- Why? Event listeners not removed
- Why? Component unmount not handled
- Why? Framework lifecycle not understood → ROOT CAUSE

### Step 4: Evidence Collection

For each identified root cause:

- Gather supporting evidence (logs, stack traces, metrics, code examples)
- Verify through reproduction or testing
- Rule out alternative explanations
- Cross-reference with `common-defects.md` patterns
- Establish confidence level (High/Medium/Low)
- Document evidence trail clearly

### Step 5: Root Cause Prioritization

Rank root causes using this matrix:

| Root Cause | Likelihood | Impact | Effort | Risk | Priority |
| ---------- | ---------- | ------ | ------ | ---- | -------- |

Scoring criteria:

- **Likelihood:** Probability this is the true cause (High/Medium/Low)
- **Impact:** Severity if this is the cause (Critical/High/Medium/Low)
- **Effort:** Complexity to address (High/Medium/Low)
- **Risk:** Potential for recurrence if not fixed (High/Medium/Low)
- **Priority:** Overall priority (P0-P3)

### Step 6: Recommendations

For the highest priority root causes:

1. Propose specific fixes to address root cause
2. Suggest preventive measures to avoid recurrence
3. Recommend process improvements
4. Identify monitoring or instrumentation needs
5. Create validation plan for proposed fixes

## Output Requirements

Generate a structured root cause analysis document containing:

- Analysis metadata (ID, date, analyst, method)
- Problem statement (what, when, where, impact)
- Fishbone diagram (ASCII or description)
- Analysis for all 6 categories (People, Process, Technology, Environment, Data, Methods)
- 5-Whys analysis for top causes
- Evidence supporting each root cause
- Prioritization matrix
- Recommendations for fixes and prevention
- Next steps and validation plan

## Completion Criteria

- [ ] Problem clearly defined with quantified impact
- [ ] All 6 fishbone categories analyzed
- [ ] 5-Whys performed for top causes
- [ ] Evidence collected and documented
- [ ] Root causes prioritized by likelihood and impact
- [ ] Recommendations provided with validation plan
- [ ] Root cause analysis report generated and saved

## Elicitation Points

<elicit required="true">
Problem/Symptom: Ask user to describe:
- What is the observable problem or symptom?
- When does it occur (always, intermittently, specific conditions)?
- Where does it occur (which environment, component, user segment)?
- What is the impact (how many users, severity, business impact)?
</elicit>

<elicit required="false">
Additional Context: Ask if available:
- Recent changes or deployments
- Error messages or logs
- Reproduction steps
- Related issues or patterns
- User reports or feedback
</elicit>
