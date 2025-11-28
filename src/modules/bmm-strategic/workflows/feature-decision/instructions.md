# Feature Decision Workflow (Go/No-Go)

## Overview

This workflow provides a structured framework for making major product decisions. It ensures decisions are made deliberately with clear rationale, not reactively or politically.

## When to Use This Workflow

Use this for decisions that are:
- **Significant:** More than a few days of work
- **Strategic:** Affects product direction or positioning
- **Irreversible:** Hard to undo once started
- **Resource-intensive:** Requires significant investment

## Decision Options

| Decision | Meaning | When to Use |
|----------|---------|-------------|
| **GO** | Commit resources, proceed | High confidence, strategic fit, acceptable risk |
| **NO-GO** | Reject, do not proceed | Poor fit, high risk, better alternatives exist |
| **DEFER** | Not now, revisit later | Need more information, timing not right |

---

## Workflow Stages

### Stage 1: Understand the Initiative

**Objective:** Ensure complete clarity on what is being proposed.

**Questions to answer:**

1. **What exactly is being proposed?**
   - Feature/product description in 2-3 sentences
   - What problem does it solve?
   - Who requested this? (Customer, team, competitive pressure)

2. **What does success look like?**
   - How would we know if this succeeded?
   - What metrics would change?

3. **What's the scope?**
   - MVP scope vs. full vision
   - Timeline estimate
   - Resource requirements

**Clarity Check:**
- Can you explain this to someone unfamiliar in 30 seconds?
- Is there ambiguity about what we'd actually build?
- Do we have clear acceptance criteria?

**Output:** Clear initiative description

---

### Stage 2: Strategic Fit Assessment

**Objective:** Evaluate alignment with vision and current priorities.

**Strategic Alignment Scorecard:**

| Question | Score (1-5) | Notes |
|----------|-------------|-------|
| Does this align with our vision? | | |
| Does this serve our target customer? | | |
| Does this strengthen our differentiation? | | |
| Does this align with current priorities? | | |
| Would this help or hurt focus? | | |

**Scoring:**
- 5: Strongly supports
- 3: Neutral
- 1: Works against

**Priority Conflict Check:**
- Does this compete with current priorities for resources?
- Would this delay existing commitments?
- Is this more important than what we're already doing?

**Strategic Fit Score:** [Sum / 25] = X%

| Score | Interpretation |
|-------|----------------|
| 80%+ | Strong strategic fit |
| 60-79% | Moderate fit, consider tradeoffs |
| <60% | Weak fit, needs strong justification |

**Output:** Strategic fit assessment

---

### Stage 3: Impact Analysis

**Objective:** Assess the potential positive and negative outcomes.

**Positive Impact Assessment:**

| Impact Area | Expected Impact | Confidence | Evidence |
|-------------|-----------------|------------|----------|
| Revenue | [High/Med/Low] | [High/Med/Low] | [What evidence?] |
| User acquisition | | | |
| User retention | | | |
| User satisfaction | | | |
| Competitive position | | | |
| Technical capability | | | |

**Negative Impact Assessment:**

| Risk | Potential Impact | Likelihood | Mitigation |
|------|------------------|------------|------------|
| Technical debt | | | |
| Scope creep | | | |
| Customer confusion | | | |
| Team burnout | | | |
| Opportunity cost | | | |

**Opportunity Cost:**
> "What are we NOT doing by doing this?"

- [Alternative 1 we won't pursue]
- [Alternative 2 we won't pursue]
- [Feature/fix that gets delayed]

**Output:** Impact analysis summary

---

### Stage 4: Risk Assessment

**Objective:** Identify and evaluate risks.

**Risk Categories:**

**1. Execution Risk**
- Do we have the skills to build this?
- Is the timeline realistic?
- Are there technical unknowns?

**2. Market Risk**
- Will customers actually want this?
- Is the timing right?
- Will competitors respond?

**3. Business Risk**
- Can we afford this investment?
- What if it fails?
- Are there regulatory concerns?

**Risk Matrix:**

| Risk | Likelihood (1-5) | Impact (1-5) | Score | Mitigation |
|------|------------------|--------------|-------|------------|
| [Risk 1] | | | | |
| [Risk 2] | | | | |
| [Risk 3] | | | | |

**Risk Tolerance Check:**
- What's the worst case scenario?
- Can we survive the worst case?
- Is this a reversible or irreversible decision?

**Reversibility Assessment:**
- **Easily reversible:** Low-risk, can experiment
- **Partially reversible:** Some sunk cost but can pivot
- **Irreversible:** High commitment, proceed carefully

**Output:** Risk assessment with mitigations

---

### Stage 5: Make Decision

**Objective:** Decide: GO, NO-GO, or DEFER.

**Decision Framework:**

```
                    Strategic Fit
                    High        Low
                 ┌─────────┬─────────┐
         High    │   GO    │ DEFER/  │
Impact          │         │ NO-GO   │
         Low    │ DEFER   │ NO-GO   │
                 └─────────┴─────────┘
```

**GO Criteria (all must be true):**
- [ ] Strategic fit score ≥ 60%
- [ ] Expected impact justifies investment
- [ ] Risks are acceptable and mitigated
- [ ] Resources are available
- [ ] Team has capacity and capability
- [ ] Not conflicting with higher priorities

**NO-GO Criteria (any is sufficient):**
- [ ] Poor strategic fit (<50%)
- [ ] Unacceptable or unmitigatable risks
- [ ] Better alternatives exist
- [ ] Insufficient resources or capability
- [ ] Would derail critical priorities

**DEFER Criteria:**
- [ ] Good idea but timing is wrong
- [ ] Need more information to decide
- [ ] Waiting on external dependencies
- [ ] Current priorities must complete first

---

### Stage 6: Document & Communicate

**Objective:** Record the decision and next steps.

**Decision Record:**

```yaml
decision:
  id: "[DECISION-XXX]"
  date: "[Date]"
  initiative: "[Name]"
  decision: "[GO | NO-GO | DEFER]"

  rationale: |
    [2-3 sentences explaining why]

  # If GO:
  next_steps:
    - "[Action 1]"
    - "[Action 2]"
  owner: "[Name]"
  deadline: "[Date]"
  success_criteria:
    - "[Criterion 1]"
    - "[Criterion 2]"

  # If NO-GO:
  alternatives_considered:
    - "[Alternative 1]"
  revisit_conditions: "[What would change our mind]"

  # If DEFER:
  revisit_date: "[Date]"
  information_needed:
    - "[What we need to know]"
```

**Communication:**

| Audience | What to Share |
|----------|---------------|
| Team | Decision + rationale + impact on them |
| Stakeholders | Decision + high-level rationale |
| Requestor | Decision + detailed rationale |

---

## Events Published

Based on decision:

**If GO:**
```yaml
type: decision.go
payload:
  initiative: "[Name]"
  rationale: "[Why]"
  owner: "[Name]"
  deadline: "[Date]"
  success_criteria: [list]
```

**If NO-GO:**
```yaml
type: decision.no-go
payload:
  initiative: "[Name]"
  rationale: "[Why]"
  alternatives_considered: [list]
  revisit_conditions: "[Conditions]"
```

**If DEFER:**
```yaml
type: decision.defer
payload:
  initiative: "[Name]"
  reason: "[Why]"
  revisit_date: "[Date]"
  information_needed: [list]
```

---

## Downstream Effects

| Decision | Other Agents |
|----------|--------------|
| GO | Compliance reviews, Growth plans measurement, UX plans design |
| NO-GO | No downstream actions |
| DEFER | Calendar reminder set for revisit |

---

## Anti-Patterns to Avoid

1. **HIPPO Decisions** - Don't decide just because the Highest Paid Person's Opinion says so
2. **Analysis Paralysis** - Don't defer indefinitely; set a deadline
3. **Sunk Cost Fallacy** - Past investment doesn't justify future investment
4. **Scope Creep in Disguise** - One feature hiding many
5. **Decision by Committee** - One person must own the decision
