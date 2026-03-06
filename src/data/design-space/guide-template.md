# Design Space Guide — {PROJECT_NAME}

> Copy this template to `.claude/design-space-guide.md` in each project repo.
> Replace all `{PLACEHOLDERS}` with actual values.

---

## Project Identity

| Field | Value |
|-------|-------|
| Project | {PROJECT_NAME} |
| Client | {CLIENT_NAME} |
| Domain | {DOMAIN — e.g. automotive, fintech, e-commerce} |
| WDS Phase | {CURRENT_PHASE — e.g. Phase 4: UX Design} |
| Design Space project tag | `{project_tag}` |

---

## Active Categories

Check which categories are relevant for this project:

- [ ] `inspiration` — Visual references, competitor patterns
- [ ] `failed_experiment` — What didn't work and why
- [ ] `successful_pattern` — Validated solutions worth reusing
- [ ] `component_experience` — Component behavior discoveries
- [ ] `design_system_evolution` — Token/component changes
- [ ] `client_feedback` — Client reactions and preferences
- [ ] `competitive_intelligence` — How competitors solve it
- [ ] `methodology` — Process improvements discovered
- [ ] `agent_experience` — Agent collaboration insights
- [ ] `reference` — External resources worth remembering
- [ ] `general` — Anything else

---

## Capture Triggers

### Saga (Strategy)

Capture after:
- [ ] Completing or updating the Product Brief
- [ ] Finishing a Trigger Map session
- [ ] Competitive research
- [ ] Client discovery conversations
- [ ] Strategic pivot decisions

**Minimum:** 2 insights per major deliverable.

### Freya (Design)

Capture after:
- [ ] Completing a UX flow or page design
- [ ] Writing a specification
- [ ] Experimenting with a component (especially if it failed)
- [ ] Design system token/component decisions
- [ ] Client design review sessions
- [ ] Asset generation with specific prompt learnings

**Minimum:** 2 insights per major deliverable.

---

## Suggested Search Prompts

Before starting work on this project, search the Space:

### At Project Start
```
search_space("What patterns work for {DOMAIN} sites?")
search_space("{CLIENT_NAME} preferences and feedback")
search_space("navigation patterns for {NUMBER} primary actions")
```

### During Design
```
search_space("{COMPONENT_NAME} experiences and quirks")
search_space("mobile layout for {PAGE_TYPE}")
search_space("failed experiments with {APPROACH}")
```

### During Evolution
```
search_space("design system evolution {COMPONENT}")
search_space("client feedback patterns")
search_space("methodology improvements for {WORKFLOW}")
```

---

## Metadata Convention

When capturing from this project, always include:

```yaml
project: "{project_tag}"
designer: "marten"
client: "{CLIENT_NAME}"
source: "{agent-dialog | workshop | review | implementation}"
topics: ["{DOMAIN}", ...]  # Always include the domain
```

---

## File Conventions

| What | Where in This Repo |
|------|-------------------|
| Product Brief | `{PATH_TO_PB}` |
| Trigger Map | `{PATH_TO_TM}` |
| Scenarios | `{PATH_TO_SCENARIOS}` |
| Specifications | `{PATH_TO_SPECS}` |
| Design System | `{PATH_TO_DS}` |

Agents should read these files for context before capturing — avoid duplicating information that lives in project documents.

---

## Integration Reminders

1. **Search before creating** — Always check the Space before designing a new component or making a strategic decision
2. **Capture at milestones** — After completing each phase deliverable, review and capture
3. **Tag consistently** — Use the project tag and domain topics for every capture
4. **Quality over quantity** — One specific, contextual insight beats five generic observations
5. **Include rationale** — "We chose X because Y" is useful. "We chose X" is not.

---

_Template version 1.0.0 — from whiteport-design-studio/src/data/design-space/guide-template.md_
