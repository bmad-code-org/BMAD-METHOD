# BMad Method PR #2: Agent Task Pre-Flight Protocol

**Feature Type**: Safety & quality framework
**Status**: Draft for community review
**Origin**: tellingCube project learnings (masemIT e.U.)
**Author**: Mario Semper (@sempre)
**Date**: 2025-11-23

---

## Summary

**Agent Task Pre-Flight Protocol** establishes mandatory safety checks for high-risk agent tasks (marketing, legal, deployment) to prevent factual errors, trademark violations, privacy breaches, and assumption-based mistakes.

---

## Problem Statement

### Real-World Failure Case

**Scenario**: Marketing agent (Sophie) created LinkedIn launch posts for tellingCube without:
- Reading existing project documentation
- Verifying pricing against actual implementation
- Checking trademark compliance rules
- Reviewing privacy guidelines

**Result**: Multiple critical errors:
- ❌ Mentioned user's day job title (privacy/legal risk)
- ❌ Used family member's name (privacy violation)
- ❌ Claimed "60 seconds" generation time (factually wrong)
- ❌ Advertised "€9/month" pricing (doesn't exist - actual: €29-€999 ONE-TIME)
- ❌ Used "IBCS-compliant" (trademark violation - should be "inspired by IBCS©")

**Root Cause**: Agent operated independently without pre-task verification protocol.

---

## Current BMad Behavior (Risky)

```yaml
User: "Sophie, create LinkedIn launch posts"

Sophie:
  1. Generates content based on general knowledge
  2. Makes assumptions about features/pricing
  3. Uses marketing best practices
  4. Presents to user

❌ Problem: No verification step before creation
```

---

## Proposed Solution: Pre-Flight Protocol

### Mandatory Checks Before High-Risk Tasks

```yaml
Agent Task Pre-Flight Protocol:

BEFORE executing tasks with external impact:
  1. Discover Critical Context
     - Search for CRITICAL-GUIDELINES.md or similar
     - Read recent related work in project
     - Check actual implementation (code, configs, not assumptions)

  2. Verify Assumptions
     - Pricing: Read Stripe config / pricing components
     - Features: Grep codebase for actual capabilities
     - Legal/Trademark: Check documented compliance rules
     - Privacy: Verify no personal info in public content

  3. Cross-Agent Review (for high-risk outputs)
     - Orchestrator reviews before user sees
     - Fact-checker agent validates claims
     - Minimum 2 agents verify before publishing

  4. User Approval Gate
     - Present content as DRAFT
     - Highlight assumptions made
     - Get explicit approval before finalizing
```

---

## High-Risk Task Categories

### 1. Marketing & Public Content
**Examples**: LinkedIn posts, press releases, demo videos, website copy

**Pre-Flight Required**:
- [ ] Read `CRITICAL-GUIDELINES.md` (legal, trademark, privacy rules)
- [ ] Verify pricing from actual Stripe/payment config
- [ ] Verify features from actual codebase (not roadmap ideas)
- [ ] Check trademark compliance (e.g., "IBCS©" usage rules)
- [ ] Privacy review (no personal identifiers without consent)
- [ ] Cross-agent fact-check before presenting to user

### 2. Legal & Compliance
**Examples**: Terms of service, privacy policy, license agreements

**Pre-Flight Required**:
- [ ] Read existing legal docs (don't start from scratch)
- [ ] Check jurisdiction-specific requirements
- [ ] Verify against actual product behavior (data handling, cookies, etc.)
- [ ] Legal expert review (human or specialized agent)
- [ ] User final approval required

### 3. Deployment & Infrastructure
**Examples**: Database migrations, production deployments, DNS changes

**Pre-Flight Required**:
- [ ] Read deployment runbooks/checklists
- [ ] Verify current production state
- [ ] Check for breaking changes
- [ ] Backup strategy confirmed
- [ ] Rollback plan documented
- [ ] User explicit approval with understanding of risks

### 4. Financial & Billing
**Examples**: Stripe configuration, pricing changes, refund policies

**Pre-Flight Required**:
- [ ] Read current Stripe dashboard state
- [ ] Verify tax/legal implications
- [ ] Check grandfather clause impacts
- [ ] Financial impact assessment
- [ ] User approval with revenue projections

---

## Implementation Guidelines

### For Agent Developers

**In agent YAML definition**:

```yaml
agent:
  name: Sophie
  id: marketing
  high_risk_tasks: true  # Triggers pre-flight protocol

pre_flight:
  required_reads:
    - docs/marketing/CRITICAL-GUIDELINES.md
    - components/landing/PricingSection.tsx
    - docs/_masemIT/readme.md

  verification_steps:
    - Grep for actual pricing tiers in codebase
    - Check trademark compliance rules
    - Privacy scan (no personal names/details)

  cross_check:
    agents: [river, mary]
    approval_required: true

tasks:
  create-linkedin-post:
    pre_flight_mandatory: true
    approval_gate: user
```

### For Orchestrators (River-like agents)

**Orchestrator responsibilities**:

```python
def execute_high_risk_task(agent, task, user_request):
    # Step 1: Pre-flight checks
    critical_docs = discover_critical_guidelines()
    agent.read(critical_docs)

    # Step 2: Agent executes with verification
    draft_output = agent.execute_task(task)

    # Step 3: Cross-agent review
    fact_check_agent = get_agent("mary")
    verification = fact_check_agent.verify(draft_output, codebase)

    # Step 4: Present as DRAFT to user
    if verification.has_issues:
        present_issues_to_user(verification.issues)

    present_as_draft(draft_output)

    # Step 5: User approval gate
    approval = get_user_approval()

    if approval:
        finalize(draft_output)
```

---

## Example: Correct Marketing Flow

### Before (Risky)

```
User: "Create LinkedIn launch posts"
Sophie: [Generates 3 posts with assumptions]
Sophie: "Here are your posts!"

❌ Contains errors user must catch
```

### After (Safe)

```
User: "Create LinkedIn launch posts"

River: "Sophie, this is a high-risk task. Running pre-flight..."

Sophie:
  ✅ Read CRITICAL-GUIDELINES.md
  ✅ Read PricingSection.tsx (actual pricing: €29-€999)
  ✅ Checked IBCS© compliance rules (must say "inspired by")
  ✅ Privacy check (no "Product Owner", no "brother")

Sophie: [Generates 3 posts with verified facts]

River: "Mary, fact-check Sophie's output..."

Mary:
  ✅ Pricing correct (€29-€999 lifetime)
  ✅ No trademark violations ("inspired by IBCS©")
  ✅ No privacy issues
  ✅ Generation time accurate ("minutes")

River: "Sempre, here's the DRAFT (pre-flight verified). Approve?"

User: [Reviews, approves]

✅ No errors, factually accurate
```

---

## Critical Guidelines Template

**Every project should have**: `docs/PROJECT-NAME/CRITICAL-GUIDELINES.md`

```markdown
# CRITICAL Guidelines for [Project Name]

## ❌ NEVER MENTION
- Confidential info (list specific items)
- Personal details (family, private life)
- Competitor names (if under NDA)

## ✅ ALWAYS VERIFY
- Pricing: Check [file path]
- Features: Grep [codebase location]
- Legal: Comply with [trademark/license rules]

## Trademark Compliance
- "IBCS©" → Always say "inspired by IBCS©" (not "compliant")
- [Other trademarks...]

## Privacy Rules
- No personal job titles in public content
- No family member names
- [Other privacy rules...]

## Approval Requirements
- Marketing content: River + Mary review
- Legal docs: Legal expert review
- Deployment: User explicit approval
```

---

## Benefits

✅ **Prevents costly mistakes** - Catches errors before they're public
✅ **Protects legal compliance** - Trademark, privacy, licensing
✅ **Ensures factual accuracy** - Features/pricing match reality
✅ **Builds user trust** - Agents don't hallucinate facts
✅ **Scalable safety** - Works across all BMad projects

---

## Tradeoffs & Considerations

### Slower Task Execution
- **Before**: Agent outputs in 30 seconds
- **After**: Pre-flight adds 1-2 minutes
- **Worth it?**: YES for high-risk tasks (marketing, legal, deployment)

### More Agent Coordination
- Requires orchestrator (River) to manage pre-flight
- Cross-agent reviews add complexity
- **Mitigation**: Only for high-risk tasks, not every task

### User Approval Friction
- Adds approval gate before finalization
- **Mitigation**: Present as DRAFT with verification status
- User can fast-track if comfortable

---

## Rollout Strategy

### Phase 1: Opt-In (Recommended)
- Projects mark agents as `high_risk_tasks: true`
- Orchestrators enforce pre-flight for marked agents
- Community feedback on friction/benefits

### Phase 2: Default for Risky Categories
- Marketing, legal, deployment agents default to pre-flight
- Other agents opt-in if needed

### Phase 3: Configurable Per-Task
- Users set risk level per task
- `*create-post --risk high` triggers pre-flight
- `*create-post --risk low` skips for drafts

---

## Real-World Validation

**Origin Project**: tellingCube (masemIT e.U.)

**Failure Scenario**:
- Marketing agent created launch posts without verification
- 5 critical errors caught by user (should have been caught earlier)
- 30 minutes of rework to fix

**After Implementing Protocol**:
- CRITICAL-GUIDELINES.md created
- Pre-flight checklist enforced
- Cross-agent review (River → Sophie → Mary → User)
- **Result**: Zero errors in final content

**User Feedback (Mario Semper)**:
> "I love BMad, but I don't want to repeat the ChatGPT hallucination nightmare. This protocol gives me confidence that agents verify facts before presenting them."

---

## Open Questions for Community

1. **Scope**: Which task types should default to pre-flight?
2. **Performance**: Is 1-2 minute overhead acceptable for high-risk tasks?
3. **Configurability**: Per-project, per-agent, or per-task risk settings?
4. **Tooling**: Should pre-flight be a separate tool or built into agent execution?
5. **Enforcement**: Optional best practice or mandatory for certain agents?

---

## Next Steps

1. **Community feedback** on protocol design
2. **Reference implementation** in BMad core
3. **Agent template updates** to include pre-flight hooks
4. **Documentation** with examples for common scenarios
5. **Testing** across different project types

---

## Comparison to Similar Patterns

| Pattern | Focus | When to Use |
|---------|-------|-------------|
| **Pre-Flight Protocol** | Safety & accuracy | High-risk external outputs |
| **Code Review** | Code quality | Before merging code |
| **QA Gates** | Testing | Before production deployment |
| **Approval Workflows** | Governance | Multi-stakeholder decisions |

**Pre-Flight Protocol** = "Code review + QA gate" for **agent outputs**.

---

## References

- **Source Project**: tellingCube (https://github.com/masemIT/telling-cube) [if public]
- **Failure Case**: `docs/bmad-contributions/` (this document)
- **Implementation**: `docs/marketing/CRITICAL-GUIDELINES.md` (tellingCube)

---

**Contribution ready for review.** This came from painful real-world experience - let's make BMad safer for everyone! 🛡️
