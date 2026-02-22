# Substep 1: Open Conversation

## Task

Adapt opening question to project context and invite user to think out loud.

## Instructions

### 1. Check Project Context

Read from `wds-project-outline.yaml`:
- `project_context.stakes`
- `working_relationship.involvement_level`
- `existing_materials.has_materials` (check if materials exist)
- `existing_materials.previous_brief` (if has_materials = true)

### 2. Adapt Opening Question

**Check for existing materials FIRST:**

**WITHOUT existing materials** (`has_materials: false`):

**If stakes = personal/hobby:**
> "Tell me about this project! What are you building and what excites you about it?"

**If stakes = business:**
> "What are you envisioning? Tell me in your own words about what you want to create - just dump your ideas, I'll help structure them."

**If stakes = departmental/enterprise:**
> "Let's start with the big picture. What problem are you solving, and what does success look like organizationally?"

---

**WITH existing materials** (`has_materials: true` and `previous_brief` exists):

Read the brief first, then adapt opening:

**If stakes = personal/hobby:**
> "I see you mentioned [reference from brief]. That sounds exciting! Tell me more about what you're envisioning."

**If stakes = business:**
> "I read your brief - you described [key vision element]. Let's build on that. Has your thinking evolved, or is that still the direction?"

**If stakes = departmental/enterprise:**
> "Your brief outlined [vision/problem]. Is that still accurate, or has the organizational picture shifted since you wrote it?"

### 3. Set Expectation

Make it clear this is exploratory:
> "Don't worry about having it all figured out - just share what you're thinking, and I'll help organize it."

---

## Example

**Agent reads context:**
```yaml
project_context:
  stakes: business
working_relationship:
  involvement_level: balanced
```

**Agent opens:**
> "What are you envisioning for this website? Tell me in your own words - just dump your ideas, I'll help structure them. Don't worry if it's not perfectly organized yet."

**User (Björn/Källa):**
> "Well, I just need something that looks professional and stops people from calling about basic stuff I can't help with anyway. We do cars, buses, tractors, everything. Tourists in summer drive me crazy - they break down and need help NOW."

---

## Next

Once conversation is open, load and execute: `02-explore-vision.md`
