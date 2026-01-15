---
title: "BMGD Quick-Flow Guide"
description: Fast-track workflows for rapid game prototyping and flexible development
---

Use BMGD Quick-Flow workflows for rapid game prototyping and flexible development when you need to move fast.

## When to Use This

- Testing a game mechanic idea
- Implementing a small feature
- Rapid prototyping before committing to design
- Bug fixes and tweaks

## When to Use Full BMGD Instead

- Building a major feature or system
- The scope is unclear or large
- Multiple team members need alignment
- The work affects game pillars or core loop
- You need documentation for future reference

:::note[Prerequisites]
- BMad Method installed with BMGD module
- Game Solo Dev agent (Indie) or other BMGD agent available
:::

## Game Solo Dev Agent

For dedicated quick-flow development, use the **Game Solo Dev** agent. This agent is optimized for solo developers and small teams who want to skip the full planning phases.

**Switch to Game Solo Dev:** Type `@game-solo-dev` or select from your IDE.

Includes: `quick-prototype`, `quick-dev`, `quick-spec`, `code-review`, `test-framework`

## Quick-Prototype

Use `quick-prototype` to rapidly test gameplay ideas with minimal setup.

### When to Use

- You have a mechanic idea and want to test the "feel"
- You're not sure if something will be fun
- You want to experiment before committing to design
- You need a proof of concept

### Steps

1. Run `quick-prototype`
2. Define what you're prototyping (mechanic, feature, system)
3. Set success criteria (2-3 items)
4. Build the minimum to test the idea
5. Playtest and evaluate

### Prototype Principles

- **Minimum Viable Prototype** — Only what's needed to test the idea
- **Hardcode First** — Magic numbers are fine, extract later
- **Skip Edge Cases** — Happy path only for now
- **Placeholder Everything** — Cubes, debug text, temp sounds
- **Comment Intent** — Mark what's temporary vs keeper code

### After Prototyping

- **Develop** (`d`) — Use `quick-dev` to build production code
- **Iterate** (`i`) — Adjust and re-test the prototype
- **Archive** (`a`) — Keep as reference, move on to other ideas

## Quick-Dev

Use `quick-dev` for flexible development with game-specific considerations.

### When to Use

- Implementing a feature from a tech-spec
- Building on a successful prototype
- Making changes that don't need full story workflow
- Quick fixes and improvements

### Workflow Modes

**Mode A: Tech-Spec Driven**
```
quick-dev tech-spec-combat.md
```

**Mode B: Direct Instructions**
```
quick-dev implement double-jump for the player
```

**Mode C: From Prototype**
```
quick-dev from the grappling hook prototype
```

### Game-Specific Checks

Quick-dev includes automatic consideration of:
- **Performance** — No allocations in hot paths, object pooling
- **Feel** — Input responsiveness, visual/audio feedback
- **Integration** — Save/load, multiplayer sync, platform testing

### Complexity Routing

| Signals | Recommendation |
|---------|----------------|
| Single mechanic, bug fix, tweak | Execute directly |
| Multiple systems, performance-critical | Plan first (tech-spec) |
| Platform/system level work | Use full BMGD workflow |

## Choosing Between Quick-Flows

| Scenario | Use |
|----------|-----|
| "Will this be fun?" | `quick-prototype` |
| "How should this feel?" | `quick-prototype` |
| "Build this feature" | `quick-dev` |
| "Fix this bug" | `quick-dev` |
| "Test then build" | `quick-prototype` → `quick-dev` |

## Flow Comparison

```
Full BMGD Flow:
Brief → GDD → Architecture → Sprint Planning → Stories → Implementation

Quick-Flow:
Idea → Quick-Prototype → Quick-Dev → Done
```

## Checklists

**Quick-Prototype:**
- [ ] Prototype scope defined
- [ ] Success criteria established (2-3 items)
- [ ] Minimum viable code written
- [ ] Placeholder assets used
- [ ] Each criterion evaluated
- [ ] Decision made (develop/iterate/archive)

**Quick-Dev:**
- [ ] Context loaded (spec, prototype, or guidance)
- [ ] Files to modify identified
- [ ] All tasks completed
- [ ] No allocations in hot paths
- [ ] Game runs without errors
- [ ] Manual playtest completed

## Tips

- **Timebox prototypes** — Set a limit (e.g., 2 hours). If it's not working, step back
- **Embrace programmer art** — Focus on feel, not visuals
- **Test on target hardware** — What feels right on dev machine might not on target
- **Document learnings** — Even failed prototypes teach something
- **Know when to graduate** — If quick-dev keeps expanding scope, create proper stories
