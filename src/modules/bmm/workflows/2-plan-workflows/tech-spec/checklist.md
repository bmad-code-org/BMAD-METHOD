# Tech-Spec Workflow Validation Checklist

**Purpose**: Validate tech-spec workflow outputs are definitive, complete, and implementation-ready.

**Scope**: Levels 0-1 software projects

**Expected Outputs**: tech-spec.md + story files (1 for Level 0, 2-3 for Level 1)

---

## 1. Output Files Exist

- [ ] tech-spec.md created in output folder
- [ ] Story file(s) created in dev_story_location
  - Level 0: 1 story file (story-{slug}.md)
  - Level 1: epics.md + 2-3 story files (story-{epic-slug}-N.md)
- [ ] bmm-workflow-status.md updated to Phase 4
- [ ] No unfilled {{template_variables}}

---

## 2. Tech-Spec Definitiveness (CRITICAL)

### No Ambiguity Allowed

- [ ] **Zero "or" statements**: NO "use X or Y", "either A or B", "options include"
- [ ] **Specific versions**: All frameworks, libraries, tools have EXACT versions
  - ✅ GOOD: "Python 3.11", "React 18.2.0", "winston v3.8.2"
  - ❌ BAD: "Python 2 or 3", "React 18+", "a logger like pino or winston"
- [ ] **Definitive decisions**: Every technical choice is final, not a proposal

### Implementation Clarity

- [ ] Source tree shows EXACT file paths (not "somewhere in src/")
- [ ] Each file marked as create/modify/delete
- [ ] Technical approach describes SPECIFIC implementation
- [ ] Implementation stack has complete toolchain with versions

---

## 3. Story Quality

### Story Format

- [ ] All stories use "As a [role], I want [capability], so that [benefit]" format
- [ ] Each story has numbered acceptance criteria
- [ ] Tasks reference AC numbers: (AC: #1), (AC: #2)
- [ ] Dev Notes section links back to tech-spec.md

### Story Sequencing (If Level 1)

- [ ] **Vertical slices**: Each story delivers complete, testable functionality
- [ ] **Sequential ordering**: Stories in logical progression
- [ ] **No forward dependencies**: No story depends on later work
- [ ] Each story leaves system in working state

### Coverage

- [ ] Story acceptance criteria derived from tech-spec testing section
- [ ] Story tasks map to tech-spec implementation guide
- [ ] Files in stories match tech-spec source tree

---

## 4. Workflow Status Integration

- [ ] bmm-workflow-status.md shows current_phase = "4-Implementation"
- [ ] Phase 2 ("2-Plan") marked complete
- [ ] First story in TODO section, others in BACKLOG (if Level 1)
- [ ] Next action clear (review story, run story-ready)

---

## 5. Readiness for Implementation

- [ ] Developer can start coding from tech-spec alone
- [ ] All technical questions answered definitively
- [ ] Testing approach clear and verifiable
- [ ] Deployment strategy documented

---

## 6. Critical Failures (Auto-Fail)

- [ ] ❌ **Non-definitive technical decisions** (any "option A or B" or vague choices)
- [ ] ❌ **Missing versions** (framework/library without specific version)
- [ ] ❌ **Stories don't match template** (incompatible with story-context/dev-story workflows)
- [ ] ❌ **Missing tech-spec sections** (required section missing from tech-spec.md)
- [ ] ❌ **Stories have forward dependencies** (would break sequential implementation)
- [ ] ❌ **Vague source tree** (file changes not specific)

---

## Validation Notes

**Document any findings:**

- Definitiveness score: [All definitive / Some ambiguity / Significant ambiguity]
- Strengths:
- Issues to address:
- Recommended actions:

**Ready for implementation?** [Yes / No - explain]

---

_Adapt based on Level 0 vs Level 1. Focus on definitiveness above all else._
