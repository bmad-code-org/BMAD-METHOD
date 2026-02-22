# Agent Dialog: Dream Up - {{task_name}}

**Created:** {{date}} {{time}}
**Mode:** {{mode}} <!-- Workshop / Suggest / Dream -->
**Phase:** {{phase}} <!-- 1 / 2 / 3 / 4 / 5 / 6 -->
**Task:** {{task_description}}
**Project:** {{project_name}}
**Status:** {{status}} <!-- in_progress / complete -->

---

## User Request

{{user_initial_request}}

---

## Mode Selection

**User chose:** {{mode}}

**Rationale:** {{why_this_mode}}

---

## Layer 1: WDS Form Learned

### WDS Guides Loaded

- `{{guide_1_path}}` - {{guide_1_purpose}}
- `{{guide_2_path}}` - {{guide_2_purpose}}
- `{{guide_3_path}}` - {{guide_3_purpose}}
- `{{rubric_path}}` - Quality standards

### Key Learnings

#### Structure
{{how_to_organize_artifact}}

#### Quality Criteria
{{what_makes_quality_output}}

#### Common Mistakes
{{what_to_avoid}}

#### Best Practices
{{what_to_aspire_to}}

### Quality Threshold

**Minimum to present to user:**
{{minimum_threshold}}

**Excellence criteria:**
{{excellence_criteria}}

---

## Layer 2: Project Context (Cumulative)

### Initial Load - From Product Brief

**Business Context:**
{{business_what_who_why}}

**Users:**
{{user_archetypes_mentioned}}

**Constraints:**
- Technical: {{technical_constraints}}
- Business: {{business_constraints}}
- Timeline: {{timeline_constraints}}

**Strategic Direction:**
{{goals_positioning_priorities}}

### Cumulative Growth

_Layer 2 grows as each artifact is completed:_

```
Initial: Product Brief
  ↓ (after Business Goals generated)
+ Business Goals
  ↓ (after Target Groups generated)
+ Target Groups
  ↓ (after Driving Forces generated)
+ Driving Forces
  ↓ (after Prioritization generated)
+ Prioritization
```

**Current Layer 2 Contents:**
{{list_all_completed_artifacts_in_layer_2}}

---

## Layer 3: Domain Research

### Research Per Step

_Agent researches domain insights as needed for each step_

#### Research for {{step_name}}

**Research Questions:**
- {{research_question_1}}
- {{research_question_2}}

**Findings:**
- {{finding_1_with_source}}
- {{finding_2_with_source}}

**Implications:**
{{how_research_informs_generation}}

---

## Layer 4 & 5: Generation & Self-Review Log

### Iteration 1

**Timestamp:** {{iteration_1_timestamp}}

**Generated:**
{{iteration_1_content_summary}}

**Self-Review:**
```markdown
## Completeness Check
{{iteration_1_completeness}}

## Quality Criteria
{{iteration_1_quality_check}}

## Common Mistakes
{{iteration_1_mistakes_check}}

## Best Practices
{{iteration_1_practices_check}}

## Overall Score
- Completeness: {{score}}/10
- Quality: {{score}}/{{max}}
- Mistakes Avoided: {{score}}/{{max}}
- Best Practices: {{score}}/{{max}}

**Assessment:** {{meets_threshold_yes_no}}
```

**Gaps Identified:**
{{iteration_1_gaps}}

**Outcome:** {{refine_or_complete}}

{{user_checkpoint_if_suggest_mode}}

---

### Iteration 2 (if needed)

**Timestamp:** {{iteration_2_timestamp}}

**Refinement Plan:**
{{what_will_be_changed_and_why}}

**Refined:**
{{iteration_2_content_summary}}

**Self-Review:**
```markdown
[Same structure as Iteration 1]
```

**Outcome:** {{refine_or_complete}}

{{user_checkpoint_if_suggest_mode}}

---

### Iteration 3 (if needed)

[Same structure...]

---

### Iteration N - COMPLETE

**Timestamp:** {{iteration_n_timestamp}}

**Final Self-Review:**
```markdown
## All Criteria Met ✅

### Completeness: {{score}}/10
[All required sections present]

### Quality Standards: {{score}}/{{max}}
[All criteria met]

### Common Mistakes: 0
[All mistakes avoided]

### Best Practices: {{score}}/{{max}}
[Practices followed]

## Overall Quality: {{excellent_or_good}}

**Confidence:** {{high_or_medium}}
**Recommendation:** Present to user for approval
```

---

## Final Output

**Artifact Location:** {{path_to_generated_file}}

**Summary:**
{{brief_description_of_output}}

**Key Decisions:**
{{key_decisions_made}}

**What's Next:**
{{next_phase_or_step}}

---

## User Feedback

**Approved:** {{yes_no_pending}}

**User Notes:**
{{user_feedback_on_output}}

**Changes Requested:**
{{changes_if_any}}

---

## Completion Summary

**Total Iterations:** {{count}}
**Time Spent:** {{duration}}
**Quality Score:** {{final_score}}/10

**Success Metrics:**
- Met quality threshold: {{yes_no}}
- User approved: {{yes_no}}
- Within iteration limit (5): {{yes_no}}

**Lessons Learned:**
{{what_worked_what_didnt}}

---

## Handoff Context

**For Next Phase:**
{{context_for_next_agent_or_phase}}

**Open Questions:**
{{unresolved_questions_if_any}}

**Recommendations:**
{{suggestions_for_next_steps}}

---

*Dream Up session complete. Generated artifact follows WDS standards and methodology.*
