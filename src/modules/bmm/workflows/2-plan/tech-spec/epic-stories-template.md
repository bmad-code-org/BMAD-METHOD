# Epic and User Stories - Level 1

**Project:** {{project_name}}
**Level:** Level 1 (Coherent Feature)
**Date:** {{date}}
**Author:** {{user_name}}

---

## Epic Overview

### Epic: {{epic_title}}

**Goal:** {{epic_goal}}

**Scope:** {{epic_scope}}

**Success Criteria:**
{{epic_success_criteria}}

**Dependencies:** {{epic_dependencies}}

**Story Count:** {{story_count}} ({{total_points}} points)

---

## Story Files Generated

This workflow generates {{story_count}} story files in the following format:

- `story-{{story_slug}}-1.md`
- `story-{{story_slug}}-2.md`
- `story-{{story_slug}}-3.md` (if applicable)

**Location:** `{{dev_story_location}}/`

**Next Steps:**

1. Run story-context workflow on story 1
2. Run dev-story workflow to implement story 1
3. Repeat for stories 2, 3, etc.

---

## Story Summaries

### Story 1: {{story_1_title}}

**File:** `story-{{story_slug}}-1.md`

**User Story:**
As a {{story_1_role}}, I want {{story_1_capability}}, so that {{story_1_benefit}}.

**Acceptance Criteria Summary:**
{{story_1_acceptance_summary}}

**Story Points:** {{story_1_points}}

**Dependencies:** {{story_1_dependencies}}

---

### Story 2: {{story_2_title}}

**File:** `story-{{story_slug}}-2.md`

**User Story:**
As a {{story_2_role}}, I want {{story_2_capability}}, so that {{story_2_benefit}}.

**Acceptance Criteria Summary:**
{{story_2_acceptance_summary}}

**Story Points:** {{story_2_points}}

**Dependencies:** {{story_2_dependencies}}

---

### Story 3: {{story_3_title}} (if applicable)

**File:** `story-{{story_slug}}-3.md`

**User Story:**
As a {{story_3_role}}, I want {{story_3_capability}}, so that {{story_3_benefit}}.

**Acceptance Criteria Summary:**
{{story_3_acceptance_summary}}

**Story Points:** {{story_3_points}}

**Dependencies:** {{story_3_dependencies}}

---

## Story Map

```
Epic: {{epic_title}}
├── Story 1: {{story_1_title}} ({{story_1_points}} points)
├── Story 2: {{story_2_title}} ({{story_2_points}} points)
└── Story 3: {{story_3_title}} ({{story_3_points}} points) [if applicable]
```

**Total Story Points:** {{total_points}}
**Estimated Timeline:** {{estimated_timeline}}

---

## Implementation Sequence

{{implementation_sequence}}

---

## Technical References

- **Tech Spec:** `{{output_folder}}/tech-spec.md` - Technical source of truth
- **Architecture:** {{architecture_files}}

---

_Generated as part of Level 1 Tech Spec workflow (BMad Method v6)_
_This is a summary document. Actual story files are generated in `{{dev_story_location}}/`_
