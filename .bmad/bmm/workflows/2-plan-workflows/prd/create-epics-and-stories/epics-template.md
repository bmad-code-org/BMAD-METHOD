# {{project_name}} - Epic Breakdown

**Author:** {{user_name}}
**Date:** {{date}}
**Project Level:** {{project_level}}
**Target Scale:** {{target_scale}}

---

## Overview

This document provides the complete epic and story breakdown for {{project_name}}, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

{{epics_summary}}

---

<!-- Repeat for each epic (N = 1, 2, 3...) -->

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

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

<!-- End story repeat -->

---

<!-- End epic repeat -->

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._
