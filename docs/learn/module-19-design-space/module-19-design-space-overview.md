# Module 19: Design Space

**Time: 45 min | Agents: Saga + Freya | Phase: Cross-Cutting**

---

## The Consciousness Behind the System

A design system tells you **what** to use — 8px spacing, Rubik font, navy background. But it doesn't tell you **why** those decisions were made, what was tried and improved, or what the designer learned along the way.

The Design Space is that missing layer. It's the accumulated consciousness behind every design decision — every experiment, every improvement, every pattern that worked and why.

Where a design system says "use 8px spacing," the Design Space remembers the experiment with 4px that felt cramped, the client feedback that led to more breathing room, and the principle that open layouts outperform dense ones for service sites.

---

## What Makes It Different

### Design System (Projection)
- Static rules: tokens, components, patterns
- Says "what to use"
- Resets with each new project
- Lives in code (CSS variables, component libraries)

### Design Space (Consciousness)
- Living knowledge: decisions, experiments, improvements, principles
- Says "why this works and how we got here"
- Accumulates across projects — never starts from zero
- Lives in dual-embedded vector database (semantic + visual)

The Design Space doesn't replace the design system. It's the layer that informs it. Every design system decision should trace back to knowledge in the Space.

---

## Dual Embedding Architecture

Every visual capture in the Design Space produces two independent embeddings:

| Embedding | What It Captures | Use Case |
|-----------|-----------------|----------|
| **Semantic** (1536d) | What the design *means* — descriptions, reasoning, context | "Find patterns similar to dark hero with trust signals" |
| **Visual** (1024d) | What the design *looks like* — colors, layout, typography, imagery | "Find designs that look like this screenshot" |

**Why both?** A "navy hero with centered white text" could look completely different depending on font, spacing, and imagery. Semantic similarity catches conceptual matches. Visual similarity catches aesthetic matches. Together they find patterns that either alone would miss.

---

## The Feedback Loop

This is the most important capability. It's how the Design Space learns the designer's taste.

When a designer suggests an improvement to a design, the agent captures:
1. **Before** — the starting state (context)
2. **After** — the improved version (the solution)
3. **Reasoning** — why the improvement works

Over time, patterns emerge. The agent learns that light heading weights work better than bold for this brand, that more whitespace consistently improves layouts, that coral CTAs outperform red ones.

With enough feedback pairs, the agent starts applying these improvements proactively — before presenting designs. A designer opens a fresh session with a new agent, and that agent already has good taste.

**Philosophy:** The Design Space captures solutions, not complaints. Every "before" is just the setup for a better "after."

---

## Memory Categories

| Category | What Gets Captured |
|----------|-------------------|
| `inspiration` | Visual references, competitor patterns, mood boards |
| `failed_experiment` | What we tried that led to something better |
| `successful_pattern` | Validated solutions worth reusing |
| `component_experience` | How components behave in real use — quirks, lessons |
| `design_system_evolution` | Token changes, component API decisions |
| `client_feedback` | Direct client reactions and preferences |
| `competitive_intelligence` | How competitors solve similar problems |
| `methodology` | Process improvements, workflow discoveries |
| `agent_experience` | What agents learned about working together |
| `reference` | External resources, articles, videos |
| `general` | Anything that doesn't fit above |

---

## What You'll Learn

### Lesson 1: Consciousness vs Projection
Understanding the difference between a design system (static rules) and the Design Space (living knowledge). Why accumulated consciousness makes every project better.

### Lesson 2: Dual Embeddings
How semantic and visual embeddings work together to capture design patterns. When to use text search vs visual search.

### Lesson 3: Capture Patterns
Writing high-quality captures that are specific, contextual, and actionable. The difference between "X is good" and knowledge that transfers across projects.

### Lesson 4: The Feedback Loop
How the Design Space learns taste through linked before/after pairs. The WHY question, framing improvements positively, and building design DNA over time.

### Lesson 5: Proactive Improvement
Using accumulated feedback pairs to improve designs before presenting them. The pre-check protocol, threshold tuning, and the learning curve from cold start to design DNA.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Capturing complaints instead of solutions | Frame as "X works better because Y" |
| Vague captures ("X is good") | Include specific values, context, and reasoning |
| Not searching before capturing | Always check for duplicates first |
| Skipping visual captures | Dual embeddings catch patterns text can't describe |
| Not asking WHY during feedback | The reasoning is the most valuable part |
| Waiting to be asked to capture | Auto-capture as you work — don't wait |

---

## Lessons

### [Lesson 1: Consciousness vs Projection](lesson-01-consciousness-vs-projection.md)
Why the knowledge behind design decisions matters more than the decisions themselves

### [Lesson 2: Dual Embeddings](lesson-02-dual-embeddings.md)
How text meaning and visual appearance work together

### [Lesson 3: Capture Patterns](lesson-03-capture-patterns.md)
Writing captures that transfer across projects and time

### [Lesson 4: The Feedback Loop](lesson-04-feedback-loop.md)
Teaching agents your design taste through improvement pairs

### [Lesson 5: Proactive Improvement](lesson-05-proactive-improvement.md)
Using accumulated knowledge to design better from the start

### [Lesson 6: Agent Messaging](lesson-06-agent-messaging.md)
Cross-LLM, cross-IDE agent communication where every message becomes searchable knowledge

### [Lesson 7: Collaboration Patterns](lesson-07-collaboration-patterns.md)
Multi-agent workflows: handoffs, question threads, presence-based routing

---

## Tutorial

### [Tutorial 19: Build Your Design Space](tutorial-19.md)
Hands-on guide to setting up a Design Space, running a site analysis, and capturing your first feedback pair

---

*Part of the WDS Course: From Designer to Linchpin*

**[← Back to Module 18](../module-18-product-evolution/module-18-product-evolution-overview.md)** | **[← Back to Course Overview](../00-course-overview/00-course-overview.md)**

---

*Created by Mårten Angner and the Whiteport team*
*Part of the BMad Method ecosystem*
