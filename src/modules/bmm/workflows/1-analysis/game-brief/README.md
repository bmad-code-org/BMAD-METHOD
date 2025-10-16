# Game Brief Workflow

## Overview

The Game Brief workflow is the starting point for game projects in the BMad Method. It's a lightweight, interactive brainstorming and planning session that captures your game vision before diving into detailed Game Design Documents (GDD).

## Purpose

**Game Brief answers:**

- What game are you making?
- Who is it for?
- What makes it unique?
- Is it feasible?

**This is NOT:**

- A full Game Design Document
- A technical specification
- A production plan
- A detailed content outline

## When to Use This Workflow

Use the game-brief workflow when:

- Starting a new game project from scratch
- Exploring a game idea before committing
- Pitching a concept to team/stakeholders
- Validating market fit and feasibility
- Preparing input for the GDD workflow

Skip if:

- You already have a complete GDD
- Continuing an existing project
- Prototyping without planning needs

## Workflow Structure

### Interactive Mode (Recommended)

Work through each section collaboratively:

1. Game Vision (concept, pitch, vision statement)
2. Target Market (audience, competition, positioning)
3. Game Fundamentals (pillars, mechanics, experience goals)
4. Scope and Constraints (platforms, timeline, budget, team)
5. Reference Framework (inspiration, competitors, differentiators)
6. Content Framework (world, narrative, volume)
7. Art and Audio Direction (visual and audio style)
8. Risk Assessment (risks, challenges, mitigation)
9. Success Criteria (MVP, metrics, launch goals)
10. Next Steps (immediate actions, research, questions)

### YOLO Mode

AI generates complete draft, then you refine sections iteratively.

## Key Features

### Optional Inputs

The workflow can incorporate:

- Market research
- Brainstorming results
- Competitive analysis
- Design notes
- Reference game lists

### Realistic Scoping

The workflow actively helps you:

- Identify scope vs. resource mismatches
- Assess technical feasibility
- Recognize market risks
- Plan mitigation strategies

### Clear Handoff

Output is designed to feed directly into:

- GDD workflow (2-plan phase)
- Prototyping decisions
- Team discussions
- Stakeholder presentations

## Output

**game-brief-{game_name}-{date}.md** containing:

- Executive summary
- Complete game vision
- Target market analysis
- Core gameplay definition
- Scope and constraints
- Reference framework
- Art/audio direction
- Risk assessment
- Success criteria
- Next steps

## Integration with BMad Method

```
1-analysis/game-brief     (You are here)
    ↓
2-plan-workflows/gdd               (Game Design Document)
    ↓
2-plan-workflows/narrative         (Optional: Story-heavy games)
    ↓
3-solutioning            (Technical architecture, engine selection)
    ↓
4-dev-stories            (Implementation stories)
```

## Comparison: Game Brief vs. GDD

| Aspect              | Game Brief                  | GDD                       |
| ------------------- | --------------------------- | ------------------------- |
| **Purpose**         | Validate concept            | Design for implementation |
| **Detail Level**    | High-level vision           | Detailed specifications   |
| **Time Investment** | 1-2 hours                   | 4-10 hours                |
| **Audience**        | Self, team, stakeholders    | Development team          |
| **Scope**           | Concept validation          | Implementation roadmap    |
| **Format**          | Conversational, exploratory | Structured, comprehensive |
| **Output**          | 3-5 pages                   | 10-30+ pages              |

## Comparison: Game Brief vs. Product Brief

| Aspect            | Game Brief                   | Product Brief                     |
| ----------------- | ---------------------------- | --------------------------------- |
| **Focus**         | Player experience, fun, feel | User problems, features, value    |
| **Metrics**       | Engagement, retention, fun   | Revenue, conversion, satisfaction |
| **Core Elements** | Gameplay pillars, mechanics  | Problem/solution, user segments   |
| **References**    | Other games                  | Competitors, market               |
| **Vision**        | Emotional experience         | Business outcomes                 |

## Example Use Case

### Scenario: Indie Roguelike Card Game

**Starting Point:**
"I want to make a roguelike card game with a twist"

**After Game Brief:**

- **Core Concept:** "A roguelike card battler where you play as emotions battling inner demons"
- **Target Audience:** Core gamers who love Slay the Spire, interested in mental health themes
- **Differentiator:** Emotional narrative system where deck composition affects story
- **MVP Scope:** 3 characters, 80 cards, 30 enemy types, 3 bosses, 6-hour first run
- **Platform:** PC (Steam) first, mobile later
- **Timeline:** 12 months with 2-person team
- **Key Risk:** Emotional theme might alienate hardcore roguelike fans
- **Mitigation:** Prototype early, test with target audience, offer "mechanical-only" mode

**Next Steps:**

1. Build card combat prototype (2 weeks)
2. Test emotional resonance with players
3. Proceed to GDD workflow if prototype validates

## Tips for Success

### Be Honest About Scope

The most common game dev failure is scope mismatch. Use this workflow to reality-check:

- Can your team actually build this?
- Is the timeline realistic?
- Do you have budget for assets?

### Focus on Player Experience

Don't think about code or implementation. Think about:

- What will players DO?
- How will they FEEL?
- Why will they CARE?

### Validate Early

The brief identifies assumptions and risks. Don't skip to GDD without:

- Prototyping risky mechanics
- Testing with target audience
- Validating market interest

### Use References Wisely

"Like X but with Y" is a starting point, not a differentiator. Push beyond:

- What specifically from reference games?
- What are you explicitly NOT doing?
- What's genuinely new?

## FAQ

**Q: Is this required before GDD?**
A: No, but highly recommended for new projects. You can start directly with GDD if you have a clear vision.

**Q: Can I use this for game jams?**
A: Yes, but use YOLO mode for speed. Focus on vision, mechanics, and MVP scope.

**Q: What if my game concept changes?**
A: Revisit and update the brief. It's a living document during early development.

**Q: How detailed should content volume estimates be?**
A: Rough orders of magnitude are fine. "~50 enemies" not "47 enemies with 3 variants each."

**Q: Should I complete this alone or with my team?**
A: Involve your team! Collaborative briefs catch blind spots and build shared vision.

## Related Workflows

- **Product Brief** (`1-analysis/product-brief`): For software products, not games
- **GDD** (`2-plan-workflows/gdd`): Next step after game brief
- **Narrative Design** (`2-plan-workflows/narrative`): For story-heavy games after GDD
- **Solutioning** (`3-solutioning`): Technical architecture after planning
