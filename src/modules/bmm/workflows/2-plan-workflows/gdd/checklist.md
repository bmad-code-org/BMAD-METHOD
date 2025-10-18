# GDD Workflow Validation Checklist

**Purpose**: Validate GDD workflow outputs are complete, playable, and ready for solutioning.

**Scope**: All game project levels (0-4)

**Expected Outputs**: GDD.md, epics.md

---

## 1. Output Files Exist

- [ ] GDD.md created in output folder
- [ ] epics.md created in output folder (separate file)
- [ ] bmm-workflow-status.md updated
- [ ] No unfilled {{template_variables}}

---

## 2. Core Gameplay Definition (CRITICAL)

### Game Pillars

- [ ] **2-4 game pillars defined** (fundamental gameplay elements)
- [ ] Each pillar is game-defining (not superficial)
- [ ] Pillars are distinct (don't overlap)

### Core Gameplay Loop

- [ ] **Complete cycle documented** (what player does repeatedly)
- [ ] Loop shows: player action → outcome → reward → motivation to repeat
- [ ] Loop sounds compelling and repeatable

### Win/Loss Conditions

- [ ] Victory conditions clearly defined
- [ ] Failure conditions defined (or N/A for sandbox games)
- [ ] Conditions are testable

---

## 3. Game Mechanics and Systems

### Mechanics

- [ ] Primary mechanics described in detail
- [ ] Mechanics support the game pillars
- [ ] Player interaction with mechanics is clear

### Progression

- [ ] Player progression system defined (skill/power/unlock/narrative)
- [ ] Difficulty curve explained
- [ ] Progression feels rewarding

### Platform and Controls

- [ ] Target platforms specified
- [ ] Control scheme appropriate for platforms
- [ ] Input method clear (keyboard/gamepad/touch/etc.)

---

## 4. Story Quality (If epics.md exists)

### Epic Structure

- [ ] Epics represent deliverable game features
- [ ] Epic sequence makes sense for game development
- [ ] Stories show implementation path

### Story Sequencing (If stories present)

- [ ] **Vertical slices**: Each story delivers playable functionality
- [ ] **Sequential ordering**: Stories build progressively
- [ ] **No forward dependencies**: Each story builds on previous work only
- [ ] Stories result in testable game features

---

## 5. Technical Specifications

### Performance and Platform

- [ ] Performance requirements specified (frame rate, resolution, etc.)
- [ ] Platform-specific considerations noted
- [ ] Asset requirements estimated

### Production Scope

- [ ] Art requirements realistic for project scale
- [ ] Audio requirements documented
- [ ] Scope matches project level and resources

---

## 6. Narrative Integration (If Applicable)

**If narrative-design.md was generated:**

- [ ] Narrative aligns with GDD game design
- [ ] Story supports gameplay (not fighting it)
- [ ] Tone consistent across GDD and narrative docs

---

## 7. Consistency

- [ ] Epic titles match between GDD.md and epics.md
- [ ] Game type identified and appropriate
- [ ] Terminology consistent throughout
- [ ] No contradictions between sections

---

## 8. Readiness for Solutioning

- [ ] Sufficient detail for engine/platform selection
- [ ] Game systems defined enough for technical architecture
- [ ] Clear what needs to be built
- [ ] Playable vision (reader can envision playing the game)

---

## 9. Critical Failures (Auto-Fail)

- [ ] ❌ **No core gameplay loop** (can't be a game without this)
- [ ] ❌ **No game pillars** (game-defining elements missing)
- [ ] ❌ **No mechanics** (what does player actually DO?)
- [ ] ❌ **No epics.md file** (implementation roadmap required)
- [ ] ❌ **Engine/tech in GDD** (should defer to solutioning workflow)

---

## Validation Notes

**Document any findings:**

- Game concept strength: [Compelling / Interesting / Unclear / Weak]
- Strengths:
- Issues to address:
- Recommended actions:

**Ready for solutioning?** [Yes / No - explain]

---

_Adapt based on game type and narrative complexity. Core gameplay must always be solid._
