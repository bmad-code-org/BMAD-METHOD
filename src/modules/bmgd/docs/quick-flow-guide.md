# BMGD Quick-Flow Guide

Fast-track workflows for rapid game prototyping and flexible development.

---

## Game Solo Dev Agent

For dedicated quick-flow development, use the **Game Solo Dev** agent (Indie). This agent is optimized for solo developers and small teams who want to skip the full planning phases and ship fast.

**Switch to Game Solo Dev:** Type `@game-solo-dev` or select the agent from your IDE.

The Game Solo Dev agent includes:

- `quick-prototype` - Rapid mechanic testing
- `quick-dev` - Flexible feature implementation
- `create-tech-spec` - Create implementation-ready specs
- `code-review` - Quality checks
- `test-framework` - Automated testing setup

---

## Overview

Quick-flow workflows skip the full BMGD planning phases when you need to move fast. Use them for:

- Testing a game mechanic idea
- Implementing a small feature
- Rapid prototyping before committing to design
- Bug fixes and tweaks

```
Full BMGD Flow:
Brief → GDD → Architecture → Sprint Planning → Stories → Implementation

Quick-Flow:
Idea → Quick-Prototype → Quick-Dev → Done
```

---

## Quick-Prototype

**Command:** `quick-prototype`
**Agent:** Game Designer, Game Developer
**Purpose:** Rapidly test gameplay ideas with minimal setup

### When to Use

- You have a mechanic idea and want to test the "feel"
- You're not sure if something will be fun
- You want to experiment before committing to design
- You need a proof of concept

### Workflow Steps

1. **Define Scope** - What are you prototyping? (mechanic, feature, system)
2. **Set Success Criteria** - How will you know if it works?
3. **Rapid Implementation** - Build the minimum to test the idea
4. **Playtest and Evaluate** - Does it feel right?

### Prototype Principles

- **Minimum Viable Prototype** - Only what's needed to test the idea
- **Hardcode First** - Magic numbers are fine, extract later
- **Skip Edge Cases** - Happy path only for now
- **Placeholder Everything** - Cubes, debug text, temp sounds
- **Comment Intent** - Mark what's temporary vs keeper code

### Example Session

```
You: quick-prototype

Agent: What are you prototyping?

You: I want to test a grappling hook mechanic. Player should be
     able to aim at surfaces and pull themselves toward the hook point.

Agent: What makes this prototype successful?

You: 1. Aiming feels responsive and intuitive
     2. The pull movement feels satisfying, not floaty
     3. Player can chain hooks without awkward pauses

Agent: [Implements minimal grappling hook]

Agent: Prototype complete! Playtest results:
     - Aiming: Works, consider adding aim assist
     - Movement: Pull is smooth, might need speed curve
     - Chaining: Currently has 0.2s delay, feels sluggish

     Next: [d] Develop further | [i] Iterate | [a] Archive
```

### After Prototyping

- **Develop** (`d`) - Use `quick-dev` to build production code
- **Iterate** (`i`) - Adjust and re-test the prototype
- **Archive** (`a`) - Keep as reference, move on to other ideas

---

## Quick-Dev

**Command:** `quick-dev`
**Agent:** Game Developer
**Purpose:** Flexible development with game-specific considerations

### When to Use

- Implementing a feature from a tech-spec
- Building on a successful prototype
- Making changes that don't need full story workflow
- Quick fixes and improvements

### Workflow Modes

**Mode A: Tech-Spec Driven**

```
You: quick-dev tech-spec-combat.md
Agent: [Loads spec, extracts tasks, implements]
```

**Mode B: Direct Instructions**

```
You: quick-dev implement double-jump for the player
Agent: [Evaluates complexity, offers planning options]
```

**Mode C: From Prototype**

```
You: quick-dev from the grappling hook prototype
Agent: [Loads prototype, productionizes code]
```

### Game-Specific Checks

Quick-dev includes automatic consideration of:

- **Performance** - No allocations in hot paths, object pooling
- **Feel** - Input responsiveness, visual/audio feedback
- **Integration** - Save/load, multiplayer sync, platform testing

### Example Session

```
You: quick-dev implement enemy patrol behavior

Agent: This looks like a focused feature. Options:
       [t] Plan first - Create tech-spec (recommended)
       [r] Prototype first - Test the idea
       [e] Execute directly

You: e

Agent: Any additional guidance? (patterns, files, constraints)

You: Use the existing AIController base class. Enemies should
     patrol between waypoints and return if player leaves range.

Agent: [Implements patrol behavior]

Agent: Implementation Complete!
       Files Modified: EnemyAI.cs, PatrolBehavior.cs
       Tests: Unit tests added for patrol state machine
       Performance: No per-frame allocations

       Recommended: Playtest the changes
```

### Complexity Routing

Quick-dev automatically detects complex requests and offers alternatives:

| Signals                                | Recommendation         |
| -------------------------------------- | ---------------------- |
| Single mechanic, bug fix, tweak        | Execute directly       |
| Multiple systems, performance-critical | Plan first (tech-spec) |
| Platform/system level work             | Use full BMGD workflow |

---

## Choosing Between Quick-Flows

| Scenario                | Use                             |
| ----------------------- | ------------------------------- |
| "Will this be fun?"     | `quick-prototype`               |
| "How should this feel?" | `quick-prototype`               |
| "Build this feature"    | `quick-dev`                     |
| "Fix this bug"          | `quick-dev`                     |
| "Test then build"       | `quick-prototype` → `quick-dev` |

---

## Quick-Flow vs Full BMGD

### Use Quick-Flow When

- The scope is small and well-understood
- You're experimenting or prototyping
- You have a clear tech-spec already
- The work doesn't affect core game systems significantly

### Use Full BMGD When

- Building a major feature or system
- The scope is unclear or large
- Multiple team members need alignment
- The work affects game pillars or core loop
- You need documentation for future reference

---

## Checklists

### Quick-Prototype Checklist

**Before:**

- [ ] Prototype scope defined
- [ ] Success criteria established (2-3 items)

**During:**

- [ ] Minimum viable code written
- [ ] Placeholder assets used
- [ ] Core functionality testable

**After:**

- [ ] Each criterion evaluated
- [ ] Decision made (develop/iterate/archive)

### Quick-Dev Checklist

**Before:**

- [ ] Context loaded (spec, prototype, or guidance)
- [ ] Files to modify identified
- [ ] Patterns understood

**During:**

- [ ] All tasks completed
- [ ] No allocations in hot paths
- [ ] Frame rate maintained

**After:**

- [ ] Game runs without errors
- [ ] Feature works as specified
- [ ] Manual playtest completed

---

## Tips for Success

### 1. Timebox Prototypes

Set a limit (e.g., 2 hours) for prototyping. If it's not working by then, step back and reconsider.

### 2. Embrace Programmer Art

Prototypes don't need to look good. Focus on feel, not visuals.

### 3. Test on Target Hardware

What feels right on your dev machine might not feel right on target platform.

### 4. Document Learnings

Even failed prototypes teach something. Note what you learned.

### 5. Know When to Graduate

If quick-dev keeps expanding scope, stop and create proper stories.

---

## Next Steps

- **[Workflows Guide](./workflows-guide.md)** - Full workflow reference
- **[Agents Guide](./agents-guide.md)** - Agent capabilities
- **[Quick Start Guide](./quick-start.md)** - Getting started with BMGD
