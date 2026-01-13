---
title: "Documentation Style Guide"
---

Guidelines for consistent documentation across the BMad Method project.

## Universal Formatting Rules

These rules apply to ALL document types. Violations fail review.

| Rule | Rationale |
|------|-----------|
| No horizontal rules (`---`) | Fragment reading flow |
| No `####` headers | Visual noise; use bold text or admonitions |
| No "Related" or "Next:" sections | Sidebar handles navigation |
| No deeply nested lists | Hard to parse; break into sections |
| No code blocks for non-code | Confusing semantics |
| No bold paragraphs for callouts | Use admonitions instead |
| 1-2 admonitions per section max | Overuse creates noise |
| Descriptions 1-2 sentences max | Longer belongs in dedicated docs |

## Visual Hierarchy

### Patterns to Use

| Pattern | When to Use |
|---------|-------------|
| Whitespace + section headers | Content separation |
| Bold text within paragraphs | Inline emphasis |
| Admonitions | Callouts requiring attention |
| Tables | Structured comparisons (3+ items) |
| Flat lists | Scannable options |

### Header Budget

- `##` sections: 8-12 per document
- `###` subsections: 2-3 per `##` section max
- `####`: Never use

### Header Naming

| Context | Style | Example |
|---------|-------|---------|
| Steps | Action verbs | "Install BMad", "Create Your Plan" |
| Reference | Nouns | "Common Questions", "Quick Reference" |

## Example: Before and After

**Before (violations):**
```md
---

## Getting Started

### Step 1: Initialize

#### What happens during init?

**Important:** You need to describe your project.

1. Your project goals
   - What you want to build
   - Why you're building it
2. The complexity
   - Small, medium, or large

---
```

**After (correct):**
```md
## Step 1: Initialize Your Project

Load the **Analyst agent** in your IDE, wait for the menu, then run `workflow-init`.

:::note[What Happens]
You'll describe your project goals and complexity. The workflow then recommends a planning track.
:::
```

## Admonitions

Starlight admonition syntax:

```md
:::tip[Title]
Shortcuts, best practices
:::

:::note[Title]
Context, definitions, examples, prerequisites
:::

:::caution[Title]
Caveats, potential issues
:::

:::danger[Title]
Critical warnings only — data loss, security issues
:::
```

### Standard Uses

| Admonition | Use For |
|------------|---------|
| `:::note[Prerequisites]` | Dependencies before starting |
| `:::tip[Quick Path]` | TL;DR summary at document top |
| `:::caution[Important]` | Critical caveats |
| `:::note[Example]` | Command/response examples |

### Rules

- Always include a title
- Keep content to 1-3 sentences
- Never nest admonitions

## Tables

Use tables for:
- Phase descriptions
- Agent roles
- Command references
- Option comparisons
- Multi-attribute sequences

### Constraints

| Constraint | Value |
|------------|-------|
| Columns | 2-4 max |
| Cell content | Short |
| Text alignment | Left |
| Number alignment | Right |

### Standard Formats

**Phases:**
```md
| Phase | Name | What Happens |
|-------|------|--------------|
| 1 | Analysis | Brainstorm, research *(optional)* |
| 2 | Planning | Requirements — PRD or tech-spec *(required)* |
```

**Commands:**
```md
| Command | Agent | Purpose |
|---------|-------|---------|
| `*workflow-init` | Analyst | Initialize a new project |
| `*prd` | PM | Create Product Requirements Document |
```

## Code Blocks

**Correct** — language-tagged command:
```md
```bash
npx bmad-method install
```
```

**Incorrect** — untagged dialogue:
````md
```
You: Do something
Agent: [Response here]
```
````

For dialogue examples, use admonitions:
```md
:::note[Example]
Run `workflow-status` and the agent will tell you the next recommended workflow.
:::
```

## Lists

**Flat lists (preferred):**
```md
- **Option A** — Description
- **Option B** — Description
- **Option C** — Description
```

**Numbered steps:**
```md
1. Load the **PM agent** in a new chat
2. Run the PRD workflow: `*prd`
3. Output: `PRD.md`
```

## Assets

| Element | Requirements |
|---------|--------------|
| **Links** | Descriptive text (not "click here"), site-relative paths |
| **Images** | Alt text required, italic caption below, SVG preferred, store in `./images/` |

## Folder Structure Blocks

Show in "What You've Accomplished" sections:

````md
```
your-project/
├── _bmad/                         # BMad configuration
├── _bmad-output/
│   ├── PRD.md                     # Your requirements document
│   └── bmm-workflow-status.yaml   # Progress tracking
└── ...
```
````

---

## Document Types

Select document type based on reader goal:

| Reader Goal | Document Type |
|-------------|---------------|
| Learn a complete workflow | Tutorial |
| Complete a specific task | How-To |
| Understand a concept | Explanation |
| Look up information | Reference |
| Find term definitions | Glossary |

---

## Tutorial Structure

Tutorials teach complete workflows to new users. Length: 200-400 lines.

```
1. Title + Hook (1-2 sentences describing outcome)
2. Version/Module Notice (info or warning admonition) (optional)
3. What You'll Learn (bullet list of outcomes)
4. Prerequisites (info admonition)
5. Quick Path (tip admonition - TL;DR summary)
6. Understanding [Topic] (context before steps - tables for phases/agents)
7. Installation (optional)
8. Step 1: [First Major Task]
9. Step 2: [Second Major Task]
10. Step 3: [Third Major Task]
11. What You've Accomplished (summary + folder structure)
12. Quick Reference (commands table)
13. Common Questions (FAQ format)
14. Getting Help (community links)
15. Key Takeaways (tip admonition)
```

### Tutorial Checklist

- [ ] Hook describes outcome in 1-2 sentences
- [ ] "What You'll Learn" section present
- [ ] Prerequisites in admonition
- [ ] Quick Path TL;DR admonition at top
- [ ] Tables for phases, commands, agents
- [ ] "What You've Accomplished" section present
- [ ] Quick Reference table present
- [ ] Common Questions section present
- [ ] Getting Help section present
- [ ] Key Takeaways admonition at end

---

## How-To Structure

How-to guides complete specific tasks for users who know basics. Length: 50-150 lines (shorter than tutorials, assumes prior knowledge).

```
1. Title + Hook (one sentence: "Use the `X` workflow to...")
2. When to Use This (bullet list of scenarios)
3. When to Skip This (optional)
4. Prerequisites (note admonition)
5. Steps (numbered ### subsections)
6. What You Get (output/artifacts produced)
7. Example (optional)
8. Tips (optional)
9. Next Steps (optional)
```

### How-To Visual Elements

| Admonition | Use |
|------------|-----|
| `:::note[Prerequisites]` | Required dependencies, agents, prior steps |
| `:::tip[Pro Tip]` | Optional shortcuts |
| `:::caution[Common Mistake]` | Pitfalls to avoid |
| `:::note[Example]` | Brief inline usage |

Guidelines:
- 1-2 admonitions max
- Prerequisites as admonition
- Multiple tips: use flat list instead of admonition
- Very simple how-tos: skip admonitions entirely

### How-To Checklist

- [ ] Hook starts with "Use the `X` workflow to..."
- [ ] "When to Use This" has 3-5 bullet points
- [ ] Prerequisites listed
- [ ] Steps are numbered `###` subsections with action verbs
- [ ] "What You Get" describes output artifacts

---

## Explanation Structure

Explanation documents answer "What is X?" and "Why does X matter?"

### Types

| Type | Purpose | Example |
|------|---------|---------|
| **Index/Landing** | Topic area overview with navigation | `core-concepts/index.md` |
| **Concept** | Define core concept | `what-are-agents.md` |
| **Feature** | Deep dive into capability | `quick-flow.md` |
| **Philosophy** | Design decisions and rationale | `why-solutioning-matters.md` |
| **FAQ** | Answer common questions | `brownfield-faq.md` |

### General Structure

```
1. Title + Hook (1-2 sentences)
2. Overview/Definition (what it is, why it matters)
3. Key Concepts (### subsections)
4. Comparison Table (optional)
5. When to Use / When Not to Use (optional)
6. Diagram (optional - mermaid)
7. Next Steps (optional)
```

### Index/Landing Pages

```
1. Title + Hook (one sentence)
2. Content Table (links with descriptions)
3. Getting Started (numbered list)
4. Choose Your Path (optional - decision tree)
```

### Concept Explainers

```
1. Title + Hook (what it is)
2. Types/Categories (### subsections) (optional)
3. Key Differences Table
4. Components/Parts
5. Which Should You Use?
6. Creating/Customizing (pointer to how-to guides)
```

### Feature Explainers

```
1. Title + Hook (what it does)
2. Quick Facts (optional - "Perfect for:", "Time to:")
3. When to Use / When Not to Use
4. How It Works (mermaid diagram optional)
5. Key Benefits
6. Comparison Table (optional)
7. When to Graduate/Upgrade (optional)
```

### Philosophy/Rationale Documents

```
1. Title + Hook (the principle)
2. The Problem
3. The Solution
4. Key Principles (### subsections)
5. Benefits
6. When This Applies
```

### Visual Elements

| Element | Use For |
|---------|---------|
| Comparison tables | Contrasting types, options, approaches |
| Mermaid diagrams | Process flows, decision trees (1 per doc max) |
| "Best for:" lists | Quick decision guidance |
| Code examples | Brief concept illustration |

### Explanation Checklist

- [ ] Hook states what document explains
- [ ] Content in scannable `##` sections
- [ ] Comparison tables for 3+ options
- [ ] Diagrams have clear labels
- [ ] Links to how-to guides for procedural questions
- [ ] 2-3 admonitions max

---

## Reference Structure

Reference documents answer "What are the options?" and "What does X do?" for users who know what they need.

### Types

| Type | Purpose | Example |
|------|---------|---------|
| **Index/Landing** | Navigation to reference content | `workflows/index.md` |
| **Catalog** | Quick-reference item list | `agents/index.md` |
| **Deep-Dive** | Detailed single-item reference | `document-project.md` |
| **Configuration** | Settings and config docs | `core-tasks.md` |
| **Glossary** | Term definitions | `glossary/index.md` |
| **Comprehensive** | Extensive multi-item reference | `bmgd-workflows.md` |

### Reference Index Pages

```
1. Title + Hook (one sentence)
2. Content Sections (## for each category)
   - Bullet list with links and descriptions
```

### Catalog Reference

```
1. Title + Hook
2. Items (## for each item)
   - Brief description (one sentence)
   - **Commands:** or **Key Info:** as flat list
3. Universal/Shared (## section) (optional)
```

Guidelines:
- Use `##` for items, not `###`
- Keep descriptions to 1 sentence

### Item Deep-Dive Reference

```
1. Title + Hook (one sentence purpose)
2. Quick Facts (optional note admonition)
   - Module, Command, Input, Output as list
3. Purpose/Overview (## section)
4. How to Invoke (code block)
5. Key Sections (## for each aspect)
   - Use ### for sub-options
6. Notes/Caveats (tip or caution admonition)
```

### Configuration Reference

```
1. Title + Hook
2. Table of Contents (jump links if 4+ items)
3. Items (## for each config/task)
   - **Bold summary** — one sentence
   - **Use it when:** bullet list
   - **How it works:** numbered steps (3-5 max)
   - **Output:** expected result (optional)
```

### Comprehensive Reference Guide

```
1. Title + Hook
2. Overview (## section)
   - Diagram or table showing organization
3. Major Sections (## for each phase/category)
   - Items (### for each item)
   - Standardized fields: Command, Agent, Input, Output, Description
4. Next Steps (optional)
```

Guidelines:
- Standardize fields across all items
- Tables for comparing multiple items
- 1 diagram max per document

### Reference Checklist

- [ ] Hook states what document references
- [ ] Structure matches reference type
- [ ] Items use consistent structure throughout
- [ ] Tables for structured/comparative data
- [ ] Links to explanation docs for conceptual depth
- [ ] 1-2 admonitions max

---

## Glossary Structure

Glossaries provide compact, scannable term definitions.

### Layout Strategy

Starlight generates right-side "On this page" navigation from headers:
- Categories as `##` headers — appear in right nav
- Terms in tables — compact rows, not individual headers
- No inline TOC — right sidebar handles navigation

### Table Format

```md
## Category Name

| Term | Definition |
|------|------------|
| **Agent** | Specialized AI persona with specific expertise that guides users through workflows. |
| **Workflow** | Multi-step guided process that orchestrates AI agent activities to produce deliverables. |
```

### Definition Rules

| Do | Don't |
|----|-------|
| Start with what it IS or DOES | Start with "This is..." or "A [term] is..." |
| Keep to 1-2 sentences | Write multi-paragraph explanations |
| Bold term name in cell | Use plain text for terms |
| Link to docs for deep dives | Explain full concepts inline |

### Context Markers

Add italic context at definition start for limited-scope terms:

```md
| **Tech-Spec** | *Quick Flow only.* Comprehensive technical plan for small changes. |
| **PRD** | *BMad Method/Enterprise.* Product-level planning document with vision and goals. |
```

Standard markers:
- `*Quick Flow only.*`
- `*BMad Method/Enterprise.*`
- `*Phase N.*`
- `*BMGD.*`
- `*Brownfield.*`

### Cross-References

Reference category anchor (terms are not headers):

```md
| **Tech-Spec** | *Quick Flow only.* Technical plan for small changes. See [PRD](#planning-documents). |
```

### Organization

- Alphabetize terms within each category table
- Alphabetize categories or order by logical progression
- No catch-all sections

### Glossary Checklist

- [ ] Terms in tables, not individual headers
- [ ] Terms alphabetized within categories
- [ ] No inline TOC
- [ ] Definitions 1-2 sentences
- [ ] Context markers italicized
- [ ] Term names bolded in cells
- [ ] No "A [term] is..." definitions

---

## FAQ Sections

Structure:

```md
## Questions

- [Question one?](#question-one)
- [Question two?](#question-two)

### Question one?

Direct answer without "A:" prefix.

### Question two?

Direct answer.

**Have a question not answered here?** [Open an issue](...) or ask in [Discord](...).
```

Rules:
- TOC with jump links under `## Questions`
- `###` headers for questions (no `Q:` prefix)
- Direct answers (no `**A:**` prefix)
- End with CTA for unanswered questions

---

## Validation Steps

Before submitting documentation changes, run from repo root:

1. **Fix link format** — Convert relative links to site-relative paths:
   ```bash
   npm run docs:fix-links            # Preview
   npm run docs:fix-links -- --write # Apply
   ```

2. **Validate links** — Check links point to existing files:
   ```bash
   npm run docs:validate-links            # Preview
   npm run docs:validate-links -- --write # Auto-fix
   ```

3. **Build the site** — Verify no build errors:
   ```bash
   npm run docs:build
   ```
