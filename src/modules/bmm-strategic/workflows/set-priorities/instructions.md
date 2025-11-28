# Set Strategic Priorities Workflow

## Overview

This workflow guides the selection and definition of strategic priorities. Focus is the scarcest resource - this workflow helps ensure we're working on what matters most.

## The Priority Paradox

> "If everything is a priority, nothing is."

Most teams fail not from lack of ideas, but from lack of focus. This workflow enforces disciplined priority selection: **maximum 3 priorities per quarter**.

## Prerequisites

- Founder agent activated
- Vision defined (run `*vision` first if not)
- Module config loaded

---

## Workflow Stages

### Stage 1: Review Current State

**Objective:** Understand where we are before deciding where to go.

**Review existing priorities (if any):**

| Priority | Status | Progress | Notes |
|----------|--------|----------|-------|
| [Previous P1] | ✅/🔄/❌ | X% | [What happened] |
| [Previous P2] | ✅/🔄/❌ | X% | [What happened] |
| [Previous P3] | ✅/🔄/❌ | X% | [What happened] |

Status: ✅ Complete | 🔄 In Progress | ❌ Blocked/Dropped

**Questions to address:**

1. What did we accomplish last period?
2. What didn't get done and why?
3. What should carry over vs. be dropped?
4. What new information do we have?
5. Has the market/competitive situation changed?

**Gather inputs:**
- Customer feedback themes
- Team capacity and constraints
- Market/competitive changes
- Technical debt or blockers
- Investor/stakeholder expectations

**Output:** Summary of current state and key inputs

---

### Stage 2: Identify Candidates

**Objective:** Create a comprehensive list of potential priorities.

**Sources of candidates:**

1. **Vision alignment** - What moves us toward our vision?
2. **Customer requests** - What are customers asking for?
3. **Market opportunity** - What gaps can we exploit?
4. **Competitive response** - What threats need addressing?
5. **Technical foundation** - What infrastructure is needed?
6. **Growth levers** - What drives key metrics?

**Brainstorm candidates:**

List all potential priorities without filtering:

```
1. [Candidate priority]
2. [Candidate priority]
3. ...
```

**Categorize:**
- 🚀 Growth - Drives acquisition/revenue
- 🔧 Foundation - Enables future capabilities
- 🛡️ Defense - Addresses risks/threats
- 🎯 Focus - Doubles down on core value

**Output:** List of 5-10 candidate priorities

---

### Stage 3: Evaluate & Score

**Objective:** Objectively assess each candidate against strategic criteria.

**Scoring Framework (1-5 each):**

| Criterion | Description | Weight |
|-----------|-------------|--------|
| **Impact** | How much does this move the needle? | 3x |
| **Urgency** | What's the cost of delay? | 2x |
| **Confidence** | How sure are we this will work? | 1x |
| **Effort** | How much does this cost? (inverse) | 1x |
| **Alignment** | How well does this fit our vision? | 2x |

**Scoring Matrix:**

| Candidate | Impact | Urgency | Confidence | Effort | Alignment | **Score** |
|-----------|--------|---------|------------|--------|-----------|-----------|
| [Candidate 1] | /5 | /5 | /5 | /5 | /5 | |
| [Candidate 2] | /5 | /5 | /5 | /5 | /5 | |
| ... | | | | | | |

**Calculate weighted score:**
```
Score = (Impact × 3) + (Urgency × 2) + Confidence + (6 - Effort) + (Alignment × 2)
```

**Red flag check for each:**
- Does this require capabilities we don't have?
- Does this depend on external factors we can't control?
- Is this actually multiple priorities disguised as one?
- Would a competitor win if we don't do this?

**Output:** Scored and ranked candidate list

---

### Stage 4: Select Top Priorities

**Objective:** Choose the final 3 (max) priorities.

**Selection Guidelines:**

1. **Start with the obvious** - Is there a clear #1?
2. **Check for dependencies** - Does #1 require #2?
3. **Balance the portfolio** - All growth? Need some foundation?
4. **Capacity check** - Can we actually do all of these?
5. **Say no explicitly** - Name what we're NOT doing

**Final Selection:**

| Rank | Priority | Rationale |
|------|----------|-----------|
| **P1** | [Top priority] | [Why this is #1] |
| **P2** | [Second priority] | [Why this is #2] |
| **P3** | [Third priority] | [Why this is #3] |

**Explicitly NOT doing:**
- [Candidate X] - Because [reason]
- [Candidate Y] - Because [reason]

This "not doing" list is as important as the doing list.

**Output:** Final 3 priorities with rationale

---

### Stage 5: Define Success Criteria

**Objective:** Make each priority specific, measurable, and owned.

**For each priority, define:**

### Priority 1: [Name]

**Description:** [2-3 sentence description of what this means]

**Success Criteria:**
- [ ] [Specific, measurable outcome 1]
- [ ] [Specific, measurable outcome 2]
- [ ] [Specific, measurable outcome 3]

**Key Metric:** [The one number that indicates success]
- Current: [Baseline value]
- Target: [Target value]

**Owner:** [Single person accountable]

**Dependencies:**
- [Any prerequisites or blockers]

**Deadline:** [End date or milestone]

---

### Priority 2: [Name]

[Same structure as above]

---

### Priority 3: [Name]

[Same structure as above]

---

**Output:** Fully defined priorities with success criteria

---

### Stage 6: Commit & Communicate

**Objective:** Finalize and publish priorities.

**Final Review Checklist:**

- [ ] Each priority has a single owner
- [ ] Success criteria are measurable
- [ ] Deadlines are realistic
- [ ] Dependencies are identified
- [ ] Team has capacity
- [ ] Priorities align with vision

**Communication Plan:**

1. **Team announcement** - Share priorities and rationale
2. **Stakeholder update** - Inform investors/board
3. **Documentation** - Update config and state files

**Update config.yaml:**
```yaml
vision:
  quarterly_priorities:
    - "P1: [Priority name]"
    - "P2: [Priority name]"
    - "P3: [Priority name]"
```

**Update state file:**
```yaml
vision:
  priorities:
    - rank: 1
      title: "[Priority name]"
      owner: "[Owner name]"
      status: "active"
      progress: 0
      deadline: "[Date]"
      success_criteria:
        - "[Criterion 1]"
        - "[Criterion 2]"
    # ... repeat for P2, P3
```

---

## Events Published

On completion:
- `priority.set` - Priorities have been defined

Event payload:
```yaml
priorities:
  - rank: 1
    title: "[Priority]"
    owner: "[Owner]"
    success_metric: "[Metric]"
    deadline: "[Date]"
  # ... repeat for each
period: "Q1 2025"
rationale: "[Why these priorities]"
```

---

## Downstream Effects

When priorities are set, other agents respond:

| Agent | Action |
|-------|--------|
| Market Strategist | Aligns competitive focus |
| Growth Engineer | Updates experiment priorities |
| UX Strategist | Prioritizes research backlog |
| SaaS Specialist | Aligns feature roadmap |
| PM (bmm) | Updates PRD/backlog priorities |

---

## Tips for Success

1. **Less is more** - 3 priorities is a maximum, not a minimum
2. **Be specific** - "Improve retention" is not specific enough
3. **One owner** - Shared ownership = no ownership
4. **Measurable** - If you can't measure it, you can't manage it
5. **Review weekly** - Track progress, adjust if needed
6. **Say no loudly** - Make the "not doing" list visible
