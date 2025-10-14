# Solution Architecture Checklist

Use this checklist during workflow execution and review.

## Pre-Workflow

- [ ] PRD exists with FRs, NFRs, epics, and stories (for Level 1+)
- [ ] UX specification exists (for UI projects at Level 2+)
- [ ] Project level determined (0-4)

## During Workflow

### Step 0: Scale Assessment

- [ ] Analysis template loaded
- [ ] Project level extracted
- [ ] Level 0 → Skip workflow OR Level 1-4 → Proceed

### Step 1: PRD Analysis

- [ ] All FRs extracted
- [ ] All NFRs extracted
- [ ] All epics/stories identified
- [ ] Project type detected
- [ ] Constraints identified

### Step 2: User Skill Level

- [ ] Skill level clarified (beginner/intermediate/expert)
- [ ] Technical preferences captured

### Step 3: Stack Recommendation

- [ ] Reference architectures searched
- [ ] Top 3 presented to user
- [ ] Selection made (reference or custom)

### Step 4: Component Boundaries

- [ ] Epics analyzed
- [ ] Component boundaries identified
- [ ] Architecture style determined (monolith/microservices/etc.)
- [ ] Repository strategy determined (monorepo/polyrepo)

### Step 5: Project-Type Questions

- [ ] Project-type questions loaded
- [ ] Only unanswered questions asked (dynamic narrowing)
- [ ] All decisions recorded

### Step 6: Architecture Generation

- [ ] Template sections determined dynamically
- [ ] User approved section list
- [ ] solution-architecture.md generated with ALL sections
- [ ] Technology and Library Decision Table included with specific versions
- [ ] Proposed Source Tree included
- [ ] Design-level only (no extensive code)
- [ ] Output adapted to user skill level

### Step 7: Cohesion Check

- [ ] Requirements coverage validated (FRs, NFRs, epics, stories)
- [ ] Technology table validated (no vagueness)
- [ ] Code vs design balance checked
- [ ] Epic Alignment Matrix generated (separate output)
- [ ] Story readiness assessed (X of Y ready)
- [ ] Vagueness detected and flagged
- [ ] Over-specification detected and flagged
- [ ] Cohesion check report generated
- [ ] Issues addressed or acknowledged

### Step 7.5: Specialist Sections

- [ ] DevOps assessed (simple inline or complex placeholder)
- [ ] Security assessed (simple inline or complex placeholder)
- [ ] Testing assessed (simple inline or complex placeholder)
- [ ] Specialist sections added to END of solution-architecture.md

### Step 8: PRD Updates (Optional)

- [ ] Architectural discoveries identified
- [ ] PRD updated if needed (enabler epics, story clarifications)

### Step 9: Tech-Spec Generation

- [ ] Tech-spec generated for each epic
- [ ] Saved as tech-spec-epic-{{N}}.md
- [ ] bmm-workflow-status.md updated

### Step 10: Polyrepo Strategy (Optional)

- [ ] Polyrepo identified (if applicable)
- [ ] Documentation copying strategy determined
- [ ] Full docs copied to all repos

### Step 11: Validation

- [ ] All required documents exist
- [ ] All checklists passed
- [ ] Completion summary generated

## Quality Gates

### Technology and Library Decision Table

- [ ] Table exists in solution-architecture.md
- [ ] ALL technologies have specific versions (e.g., "pino 8.17.0")
- [ ] NO vague entries ("a logging library", "appropriate caching")
- [ ] NO multi-option entries without decision ("Pino or Winston")
- [ ] Grouped logically (core stack, libraries, devops)

### Proposed Source Tree

- [ ] Section exists in solution-architecture.md
- [ ] Complete directory structure shown
- [ ] For polyrepo: ALL repo structures included
- [ ] Matches technology stack conventions

### Cohesion Check Results

- [ ] 100% FR coverage OR gaps documented
- [ ] 100% NFR coverage OR gaps documented
- [ ] 100% epic coverage OR gaps documented
- [ ] 100% story readiness OR gaps documented
- [ ] Epic Alignment Matrix generated (separate file)
- [ ] Readiness score ≥ 90% OR user accepted lower score

### Design vs Code Balance

- [ ] No code blocks > 10 lines
- [ ] Focus on schemas, patterns, diagrams
- [ ] No complete implementations

## Post-Workflow Outputs

### Required Files

- [ ] /docs/solution-architecture.md (or architecture.md)
- [ ] /docs/cohesion-check-report.md
- [ ] /docs/epic-alignment-matrix.md
- [ ] /docs/tech-spec-epic-1.md
- [ ] /docs/tech-spec-epic-2.md
- [ ] /docs/tech-spec-epic-N.md (for all epics)

### Optional Files (if specialist placeholders created)

- [ ] Handoff instructions for devops-architecture workflow
- [ ] Handoff instructions for security-architecture workflow
- [ ] Handoff instructions for test-architect workflow

### Updated Files

- [ ] PRD.md (if architectural discoveries required updates)

## Next Steps After Workflow

If specialist placeholders created:

- [ ] Run devops-architecture workflow (if placeholder)
- [ ] Run security-architecture workflow (if placeholder)
- [ ] Run test-architect workflow (if placeholder)

For implementation:

- [ ] Review all tech specs
- [ ] Set up development environment per architecture
- [ ] Begin epic implementation using tech specs
