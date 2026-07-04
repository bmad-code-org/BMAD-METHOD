# AI Product Factory

**The Operating System for Builders**

> One prompt. One founder. One production-ready startup.

AI Product Factory is a BMAD Expansion Pack that transforms a single idea into a production-ready digital product — from validation through design, engineering, deployment, marketing, and growth.

## What This Is

- An **operating system** for building startups, not a prompt collection
- A **vertical expansion** of BMAD Method — extends, does not replace
- **53 specialized agents** across 8 product-oriented layers
- **14 orchestrated workflows** producing deterministic artifacts
- **5 launch kits** for common product types
- **Cursor-native** — BMAD orchestrates, Cursor executes

## What This Is NOT

- Not another AI coding framework
- Not a fork of BMAD core
- Not a Flutter/template generator

## Quick Start

### Install

```bash
npx bmad-method install
# Select "AI Product Factory" module
```

Or install from this local path during development:

```bash
npx bmad-method install --module ./expansion-packs/ai-product-factory
```

### Launch a Startup

```
> use the bmad-apf-launch-startup skill
> I want to build [your idea here]
```

### Validate an Idea First

```
> use the bmad-apf-validate-idea skill
> [describe your idea]
```

### Talk to the Startup Coach

```
> use the bmad-apf-startup-coach skill
```

## Architecture

```
User
 ↓
BMAD Orchestrator (APF Workflows)
 ↓
Specialized Agents (53 across 8 layers)
 ↓
Cursor (implementation execution)
 ↓
GitHub → Cloud → Production
```

## Agent Layers

| Layer | Agents | Focus |
|---|---|---|
| **Founder** | 8 | Idea validation, market, business model |
| **Product** | 6 | PRD, roadmap, stories, prioritization |
| **UX** | 5 | Flows, wireframes, navigation, a11y |
| **Design** | 4 | Brand, design system, UI specs |
| **Engineering** | 12 | Architecture, platform agents, backend |
| **Deployment** | 6 | CI/CD, app stores, infrastructure |
| **Marketing** | 7 | Landing, SEO, ASO, social, Product Hunt |
| **Growth** | 5 | Analytics, funnels, retention, experiments |

## Workflows

| Workflow | Purpose |
|---|---|
| `bmad-apf-launch-startup` | Master orchestrator — idea to launch |
| `bmad-apf-validate-idea` | Validate before building |
| `bmad-apf-generate-prd` | PRD from founder artifacts |
| `bmad-apf-generate-ux` | UX flows and wireframes |
| `bmad-apf-generate-design-system` | Design tokens and components |
| `bmad-apf-choose-stack` | Tech stack selection |
| `bmad-apf-build-mvp` | MVP implementation via Cursor |
| `bmad-apf-generate-backend` | Backend services and API |
| `bmad-apf-deploy-app` | Production deployment |
| `bmad-apf-generate-landing` | Landing page with SEO |
| `bmad-apf-iterate-product` | Post-launch iteration |

## Launch Kits

| Kit | Product Type | Default Stack |
|---|---|---|
| [Mobile App Kit](kits/mobile-app-kit.md) | iOS/Android apps | Flutter + Supabase + RevenueCat |
| [SaaS Kit](kits/saas-kit.md) | Web SaaS | Next.js + Supabase + Stripe |
| [Landing Kit](kits/landing-kit.md) | Marketing sites | Next.js + Tailwind + Vercel |
| [Telegram Kit](kits/telegram-kit.md) | Telegram bots | Telegraf + PostgreSQL |
| [AI Agent Kit](kits/ai-agent-kit.md) | AI assistants | FastAPI + Vector DB + MCP |

## Directory Structure

```
expansion-packs/ai-product-factory/
├── module.yaml              # BMAD module definition
├── agents/                  # 53 agent skills (8 layers)
│   ├── founder/
│   ├── product/
│   ├── ux/
│   ├── design/
│   ├── engineering/
│   ├── deployment/
│   ├── marketing/
│   └── growth/
├── workflows/               # 14 orchestrated workflows
├── templates/               # Artifact templates
├── knowledge/               # Domain knowledge base
├── checklists/              # Phase verification checklists
├── playbooks/               # Launch playbooks
├── examples/                # End-to-end examples
└── kits/                    # Production launch kits
```

## BMAD Integration

APF delegates to BMAD core where possible:

- `bmad-prd` — PRD generation
- `bmad-create-architecture` — System architecture
- `bmad-dev-story` — Story implementation
- `bmad-code-review` — Code review
- `bmad-market-research` — Market research
- `bmad-ux` — UX design (alternative path)

## Design Principles

1. **Do NOT modify BMAD core** — implement as Expansion Pack
2. **Artifacts over chat** — every phase produces files
3. **Cursor executes, BMAD orchestrates**
4. **Reuse BMAD workflows** — extend, don't fork
5. **Deterministic handoffs** — each agent knows what the next needs

## License

Same as BMAD Method — see repository LICENSE.
