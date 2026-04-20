---
title: "Named Agents"
description: Why BMad agents have names, personas, and customization surfaces — and what that unlocks compared to menu-driven or prompt-driven alternatives
sidebar:
  order: 1
---

You say "Hey Mary, let's brainstorm," and Mary activates. She greets you by name, in the language you configured, with her distinctive persona. She reminds you that `bmad-help` is always available. Then she skips the menu entirely and drops straight into brainstorming — because your intent was clear.

This page explains what's actually happening and why BMad is designed this way.

## The Three-Legged Stool

BMad's agent model rests on three primitives that compose:

| Primitive | What it provides | Where it lives |
|---|---|---|
| **Skill** | Capability — a discrete thing the assistant can do (brainstorm, draft a PRD, implement a story) | `.claude/skills/{skill-name}/SKILL.md` (or your IDE's equivalent) |
| **Named agent** | Persona continuity — a recognizable identity that wraps a menu of related skills with consistent voice, principles, and visual cues | Skills whose directory starts with `bmad-agent-*` |
| **Customization** | Makes it yours — overrides that reshape an agent's behavior, add MCP integrations, swap templates, layer in org conventions | `_bmad/custom/{skill-name}.toml` (committed team overrides) and `.user.toml` (personal, gitignored) |

Pull any leg away and the experience collapses:

- Skills without agents → capability lists the user has to navigate by name or code
- Agents without skills → personas with nothing to do
- No customization → every user gets the same out-of-box behavior, forcing forks for any org-specific need

## What Named Agents Buy You

BMad ships six named agents, each anchored to a phase of the BMad Method:

| Agent | Phase | Module |
|---|---|---|
| 📊 **Mary**, Business Analyst | Analysis | market research, brainstorming, product briefs, PRFAQs |
| 📚 **Paige**, Technical Writer | Analysis | project documentation, diagrams, doc validation |
| 📋 **John**, Product Manager | Planning | PRD creation, epic/story breakdown, implementation readiness |
| 🎨 **Sally**, UX Designer | Planning | UX design specifications |
| 🏗️ **Winston**, System Architect | Solutioning | technical architecture, alignment checks |
| 💻 **Amelia**, Senior Engineer | Implementation | story execution, quick-dev, code review, sprint planning |

They each have a hardcoded identity (name, title, domain) and a customizable layer (role, principles, communication style, icon, menu). You can rewrite Mary's principles or add menu items; you can't rename her — that's deliberate. Brand recognition survives customization so "hey Mary" always activates the analyst, regardless of how a team has shaped her behavior.

## The Activation Flow

When you invoke a named agent, eight steps run in order:

1. **Resolve the agent block** — merge the shipped `customize.toml` with team and personal overrides, via a Python resolver using stdlib `tomllib`
2. **Execute prepend steps** — any pre-flight behavior the team configured
3. **Adopt persona** — hardcoded identity plus customized role, communication style, principles
4. **Load persistent facts** — org rules, compliance notes, optionally files loaded via a `file:` prefix (e.g., `file:{project-root}/docs/project-context.md`)
5. **Load config** — user name, communication language, output language, artifact paths
6. **Greet** — personalized, in the configured language, with the agent's emoji prefix so you can see at a glance who's speaking
7. **Execute append steps** — any post-greet setup the team configured
8. **Dispatch or present the menu** — if your opening message maps to a menu item, go directly; otherwise render the menu and wait for input

Step 8 is where the magic lands. "Hey Mary, let's brainstorm" skips rendering because `bmad-brainstorming` is an obvious match for `BP` on Mary's menu. If you say something ambiguous, she asks — once, briefly, not as a confirmation ritual. If nothing fits, she continues the conversation normally.

## Why Not Just a Menu?

Menus force the user to meet the tool halfway. You have to remember that brainstorming lives under code `BP` on the analyst agent, not the PM agent. You have to know which persona owns which capabilities. That's cognitive overhead the tool is making you carry.

Named agents invert it. You say what you want, to whom, in whatever words feel natural. The agent knows who they are and what they do. When your intent is clear enough, they just go.

The menu is still there as a fallback — show it when you're exploring, skip it when you're not.

## Why Not Just a Blank Prompt?

Blank prompts assume you know the magic words. "Help me brainstorm" might work; "let's ideate on my SaaS idea" might not. Results vary based on how you phrase the ask. You become responsible for prompt engineering.

Named agents bring structure without taking freedom. The persona is consistent, the capabilities are discoverable, the menu is always one `bmad-help` away. You don't have to guess what the agent can do — but you also don't have to consult a manual to do it.

## Customization as a First-Class Citizen

The customization model is why this scales beyond a single developer.

Every agent ships a `customize.toml` with sensible defaults. Teams commit overrides to `_bmad/custom/bmad-agent-{role}.toml`. Individuals can layer personal preferences in `.user.toml` (gitignored). The resolver merges all three at activation time with predictable structural rules.

Concrete example: a team commits a single file telling Amelia to always use the Context7 MCP tool for library docs and to fall back to Linear when a story isn't in the local epics list. Every dev workflow Amelia dispatches — dev-story, quick-dev, create-story, code-review — inherits that behavior. No source edits, no forks, no per-workflow duplication.

For the full customization surface and worked examples, see:

- [How to Customize BMad](../how-to/customize-bmad.md) — the reference for what's customizable and how merge works
- [How to Expand BMad for Your Organization](../how-to/expand-bmad-for-your-org.md) — four worked recipes spanning agent-wide rules, workflow conventions, external publishing, and template swaps

## The Bigger Idea

Most AI assistants today are either menus or prompts. Both shift cognitive load onto the user. Named agents plus customizable skills do something different: they let you talk to a teammate who already knows the work, and let your organization shape that teammate without forking.

The next time you type "Hey Mary, let's brainstorm" and she just gets on with it — notice what didn't happen. No slash command. No menu navigation. No awkward reminder of what she can do. That absence is the design.
