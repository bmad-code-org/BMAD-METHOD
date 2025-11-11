# {{project_name}} - Epic Breakdown

**Date:** {{date}}
**Project Level:** {{project_level}}

---

<!-- Repeat for each epic (N = 1, 2, 3...) -->

## Epic {{N}}: {{epic_title_N}}

**Slug:** {{epic_slug_N}}

### Goal

{{epic_goal_N}}

### Scope

{{epic_scope_N}}

### Success Criteria

{{epic_success_criteria_N}}

### Dependencies

{{epic_dependencies_N}}

---

## Story Map - Epic {{N}}

{{story_map_N}}

---

## Stories - Epic {{N}}

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}

**And** {{additional_criteria}}

**Prerequisites:** {{dependencies_on_previous_stories}}

**Technical Notes:** {{implementation_guidance}}

**Estimated Effort:** {{story_points}} points ({{time_estimate}})

<!-- End story repeat -->

---

## Implementation Timeline - Epic {{N}}

**Total Story Points:** {{total_points_N}}

**Estimated Timeline:** {{estimated_timeline_N}}

---

<!-- End epic repeat -->

---

## Tech-Spec Reference

See [tech-spec.md](../tech-spec.md) for complete technical implementation details.
