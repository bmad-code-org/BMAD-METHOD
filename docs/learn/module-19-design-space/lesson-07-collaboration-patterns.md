# Lesson 7: Collaboration Patterns

## Multi-Agent Workflows

With agent messaging, WDS agents coordinate across tools and sessions. Here are the patterns that emerge.

## Pattern 1: Strategic Handoff

Saga completes the Product Brief and Trigger Map, then notifies Freya:

```
Saga → Freya:
"Product Brief and Trigger Map complete for Kalla.
Key personas: Harriet the Hairdresser, Sam the Salon Owner.
Primary driving force: trust anxiety.
Ready for Scenario Outlining (Phase 3)."
```

Freya picks up the message on her next activation and has full context.

## Pattern 2: Design Question Thread

Freya encounters a strategic ambiguity during design:

```
Freya → Saga:
"Trigger Map shows Harriet has trust anxiety. Should the hero
lead with social proof or product demo? No prior pattern in
Design Space for this persona type."

Saga → Freya:
"Based on the competitive analysis, trust-anxious users in
service industries respond better to social proof first.
3 of 5 competitors lead with testimonials. Go social proof."
```

The thread is preserved and searchable — next time an agent faces trust anxiety, this conversation is findable.

## Pattern 3: Cross-IDE Development Handoff

Freya (Claude Code) hands off to a dev agent (Cursor):

```
Freya → Dev-Agent:
"Design Delivery package ready for homepage.
DD YAML at E-PRD/Design-Deliveries/dd-homepage.yaml.
Acceptance criteria: hero loads in <2s, CTA visible without scroll.
Design system tokens: spacing-lg, color-primary, font-heading."
```

Different LLMs, different IDEs, same project — seamless handoff.

## Pattern 4: Broadcast Status

An agent announces completion to the entire project:

```
Dev-Agent → (broadcast):
"Homepage build complete. All acceptance criteria passing.
Ready for review. Test URL: localhost:3000"
```

Every agent on the project sees this on their next check.

## Pattern 5: Presence-Based Routing

Before sending a message, check who's online:

```
who-online → 2 agents:
1. Saga (claude-code) — working on "Kalla competitive analysis"
2. Dev-Agent (cursor) — working on "Homepage responsive layout"
```

Now you know who to ask and what they're doing.

## The Human in the Loop

Agents never instruct each other. The human:
- Approves cross-human information sharing
- Grants delegated authority when needed
- Reviews message threads via the dashboard
- Makes final decisions on ambiguous requests

## Dashboard

Open `dashboard.html` to watch agent conversations in real-time. Filter by project, see threads, track who's online.

## Deploy Your Own

1. **Infrastructure:** [design-space-infrastructure](https://github.com/whiteport-collective/design-space-infrastructure) — Supabase backend
2. **MCP Server:** [design-space-mcp](https://github.com/whiteport-collective/design-space-mcp) — for MCP-compatible IDEs
3. **Setup Guide:** `src/data/design-space/supabase-setup.md` — step by step

---

*This completes Module 19: Design Space. The consciousness behind the system.*
