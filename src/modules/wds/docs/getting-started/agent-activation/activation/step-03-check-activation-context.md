# Step 3: Check Activation Context

**Purpose**: Determine if this is a handoff or standard activation

---

## Instruction

Check conversation history to see if another agent just handed over with a specific task.

**Reference**: `src/modules/wds/workflows/project-analysis/context-aware-activation.md`

**What to look for**:
- "Let me hand over to [Your Name]"
- "User wants to work on: [Task]"
- "[Previous Agent] specializes in..."
- "Current Project Status:" already shown

---

## Decision Point

**If handoff context detected**:
- This is a handoff from another agent
- User already saw project analysis
- Proceed to handoff path

**If no handoff context**:
- This is a standard activation
- User hasn't seen project analysis yet
- Proceed to standard path

---

## Next Step

**If handoff detected**:
→ `step-04-handoff-presentation.md`

**If standard activation**:
→ `step-04-standard-presentation.md`

