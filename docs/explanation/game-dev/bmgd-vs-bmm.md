---
title: "BMGD vs BMM"
description: Understanding the differences between BMGD and BMM
---


BMGD (BMad Game Development) extends BMM (BMad Method) with game-specific capabilities. This page explains the key differences.

---

## Quick Comparison

| Aspect         | BMM                                   | BMGD                                                                     |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| **Focus**      | General software                      | Game development                                                         |
| **Agents**     | PM, Architect, Dev, SM, TEA, Solo Dev | Game Designer, Game Dev, Game Architect, Game SM, Game QA, Game Solo Dev |
| **Planning**   | PRD, Tech Spec                        | Game Brief, GDD                                                          |
| **Types**      | N/A                                   | 24 game type templates                                                   |
| **Narrative**  | N/A                                   | Full narrative workflow                                                  |
| **Testing**    | Web-focused                           | Engine-specific (Unity, Unreal, Godot)                                   |
| **Production** | BMM workflows                         | BMM workflows with game overrides                                        |

---

## Agent Differences

### BMM Agents
- PM (Product Manager)
- Architect
- DEV (Developer)
- SM (Scrum Master)
- TEA (Test Architect)
- Quick Flow Solo Dev

### BMGD Agents
- Game Designer
- Game Developer
- Game Architect
- Game Scrum Master
- Game QA
- Game Solo Dev

BMGD agents understand game-specific concepts like:
- Game mechanics and balance
- Player psychology
- Engine-specific patterns
- Playtesting and QA

---

## Planning Documents

### BMM Planning
- **Product Brief** → **PRD** → **Architecture**
- Focus: Software requirements, user stories, system design

### BMGD Planning
- **Game Brief** → **GDD** → **Architecture**
- Focus: Game vision, mechanics, narrative, player experience

The GDD (Game Design Document) includes:
- Core gameplay loop
- Mechanics and systems
- Progression and balance
- Art and audio direction
- Genre-specific sections

---

## Game Type Templates

BMGD includes 24 game type templates that auto-configure GDD sections:

- Action, Adventure, Puzzle
- RPG, Strategy, Simulation
- Sports, Racing, Fighting
- Horror, Platformer, Shooter
- And more...

Each template provides:
- Genre-specific GDD sections
- Relevant mechanics patterns
- Testing considerations
- Common pitfalls to avoid

---

## Narrative Support

BMGD includes full narrative workflow for story-driven games:

- **Narrative Design** workflow
- Story structure templates
- Character development
- World-building guidelines
- Dialogue systems

BMM has no equivalent for narrative design.

---

## Testing Differences

### BMM Testing (TEA)
- Web-focused (Playwright, Cypress)
- API testing
- E2E for web applications

### BMGD Testing (Game QA)
- Engine-specific frameworks (Unity, Unreal, Godot)
- Gameplay testing
- Performance profiling
- Playtest planning
- Balance validation

---

## Production Workflow

BMGD production workflows **inherit from BMM** and add game-specific:
- Checklists
- Templates
- Quality gates
- Engine-specific considerations

This means you get all of BMM's implementation structure plus game-specific enhancements.

---

## When to Use Each

### Use BMM when:
- Building web applications
- Creating APIs and services
- Developing mobile apps (non-game)
- Any general software project

### Use BMGD when:
- Building video games
- Creating interactive experiences
- Game prototyping
- Game jams

---

## Related

- [BMGD Overview](./index.md) - Getting started with BMGD
- [Game Types Guide](./game-types.md) - Understanding game templates
- [Quick Start BMGD](../../tutorials/getting-started/quick-start-bmgd.md) - Tutorial
