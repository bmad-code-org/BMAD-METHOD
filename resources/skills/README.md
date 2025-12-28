# BMAD Guide Skill

This directory contains the **BMAD Guide Skill** for Claude Code - a comprehensive reference that helps Claude stay on track with BMAD methodology.

## What's Included

- **bmad-guide.md** - The skill file that provides process navigation and workflow selection guidance

## Automatic Installation

When you run `npx bmad-method install` and select Claude Code as your IDE, this skill is **automatically installed** to `~/.claude/skills/bmad-guide.md`.

This means Claude will have access to the `/bmad-guide` skill in any project, helping it:
- Navigate BMAD phases correctly
- Choose the right workflow for each task
- Avoid common mistakes (jumping to coding, skipping phases, etc.)
- Follow proper story lifecycle
- Self-correct when going off track

## What the Skill Does

The bmad-guide skill acts as Claude's "GPS" for BMAD methodology:

### 📍 Phase Navigation
Quick reference for identifying current phase and what workflows are available

### 🎯 Project Level Detection
Helps determine project complexity (Level 0-4) to route to correct planning track

### 🔍 Workflow Decision Tree
Visual guide for choosing which workflow to use for any given task

### ⚠️ Common Mistakes Prevention
Clear DO/DON'T lists to avoid derailment from BMAD process

### 📚 Quick Reference
"I need to..." → workflow mapping table for fast lookup

### 💡 Troubleshooting
Solutions for common issues like "I'm not sure which phase I'm in"

### 🚨 Emergency Recovery
Course correction steps when Claude has gone off track

## How It Works

### Automatic Invocation
When combined with the proper CLAUDE.md configuration (see below), Claude will **automatically invoke** this skill:
- Before starting any task in BMAD projects
- When uncertain about which workflow to use
- Before implementing features manually
- When switching phases
- When detecting red flags (coding without workflows, etc.)

### Manual Invocation
You can also invoke it manually anytime:
```bash
/bmad-guide
```

## CLAUDE.md Configuration (Optional but Recommended)

For maximum effectiveness, add this to your `~/.claude/CLAUDE.md`:

```markdown
# BMAD Method (MANDATORY)

## Automatic Skill Invocation - THIS IS CRITICAL
**IMMEDIATELY invoke `/bmad-guide` skill in these situations:**

1. **Starting ANY task in a BMAD project** - Check phase and workflow first
2. **Before implementing ANY feature** - Verify which workflow to use
3. **When uncertain about approach** - Consult guide before proceeding
4. **Before creating/modifying code manually** - Should you be using a workflow?
5. **When switching phases** - Verify phase progression rules
6. **When user mentions workflows, epics, stories, or phases** - Get guidance

## BMAD Process Rules (NEVER VIOLATE)

1. **ALWAYS use workflows** - Never implement features without BMAD workflows
2. **NEVER skip phases** - Each phase builds on previous (Phase 1 optional)
3. **ALWAYS check project level (0-4)** - Determines which workflows to use
4. **NEVER jump straight to coding** - Use proper workflow (dev-story, super-dev-story)
5. **ALWAYS follow story lifecycle** - create → dev → review → done
6. **ALWAYS complete current phase** - Before moving to next phase

## Before ANY Work in BMAD Project

\```
1. Invoke /bmad-guide skill
2. Identify current phase (Analysis/Planning/Solutioning/Implementation)
3. Determine project level (0-4)
4. Verify correct workflow for task
5. Check prerequisites are complete
6. Proceed with workflow (not manual implementation)
\```

## Red Flags That Mean You're Off Track

If you catch yourself:
- Writing code without using dev-story/super-dev-story
- Creating PRD/architecture manually instead of using workflows
- Skipping phases or prerequisites
- Not sure which workflow to use
- About to implement without a story

**→ STOP. Invoke `/bmad-guide` immediately and course correct.**
```

## Installation Location

The skill is installed to:
- **User level**: `~/.claude/skills/bmad-guide.md` (available across all projects)

This is intentional so the skill is available in all BMAD projects without needing per-project installation.

## Updating the Skill

When you run `npx bmad-method install` again (to update BMAD), the skill will be updated automatically if a newer version exists.

## Manual Installation

If you want to install the skill without running the full BMAD installer:

```bash
# Create skills directory
mkdir -p ~/.claude/skills

# Copy skill file
cp resources/skills/bmad-guide.md ~/.claude/skills/
```

## Success Metrics

You'll know the skill is working when Claude:
- ✅ Checks phase before starting work
- ✅ Uses workflows instead of manual implementation
- ✅ Follows proper story lifecycle
- ✅ Self-corrects when going off track
- ✅ References the skill when uncertain
- ✅ Asks for clarification about phase/workflow
- ✅ Completes prerequisites before advancing phases

---

**This skill is a core part of the BMAD Method and helps ensure Claude follows the methodology correctly.**
