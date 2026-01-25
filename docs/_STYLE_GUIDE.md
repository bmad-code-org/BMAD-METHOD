---
title: "Documentation Style Guide"
---

This project adheres to the [Google Developer Documentation Style Guide](https://developers.google.com/style) and uses [Diataxis](https://diataxis.fr/) to structure content. Only project-specific conventions follow.

## Project-Specific Rules

| Rule | Specification |
|------|---------------|
| No horizontal rules (`---`) | Fragments reading flow |
| No `####` headers | Use bold text or admonitions instead |
| No "Related" or "Next:" sections | Sidebar handles navigation |
| No deeply nested lists | Break into sections instead |
| No code blocks for non-code | Use admonitions for dialogue examples |
| No bold paragraphs for callouts | Use admonitions instead |
| 1-2 admonitions per section max | Tutorials allow 3-4 per major section |
| Table cells / list items | 1-2 sentences max |
| Header budget | 8-12 `##` per doc; 2-3 `###` per section |

## Admonitions (Starlight Syntax)

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

## Standard Table Formats

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

## Tutorial Structure

```text
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

## How-To Structure

```text
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

### How-To Checklist

- [ ] Hook starts with "Use the `X` workflow to..."
- [ ] "When to Use This" has 3-5 bullet points
- [ ] Prerequisites listed
- [ ] Steps are numbered `###` subsections with action verbs
- [ ] "What You Get" describes output artifacts

## Explanation Structure

### Types

| Type | Example |
|------|---------|
| **Index/Landing** | `core-concepts/index.md` |
| **Concept** | `what-are-agents.md` |
| **Feature** | `quick-flow.md` |
| **Philosophy** | `why-solutioning-matters.md` |
| **FAQ** | `brownfield-faq.md` |

### General Template

```text
1. Title + Hook (1-2 sentences)
2. Overview/Definition (what it is, why it matters)
3. Key Concepts (### subsections)
4. Comparison Table (optional)
5. When to Use / When Not to Use (optional)
6. Diagram (optional - mermaid, 1 per doc max)
7. Next Steps (optional)
```

### Index/Landing Pages

```text
1. Title + Hook (one sentence)
2. Content Table (links with descriptions)
3. Getting Started (numbered list)
4. Choose Your Path (optional - decision tree)
```

### Concept Explainers

```text
1. Title + Hook (what it is)
2. Types/Categories (### subsections) (optional)
3. Key Differences Table
4. Components/Parts
5. Which Should You Use?
6. Creating/Customizing (pointer to how-to guides)
```

### Feature Explainers

```text
1. Title + Hook (what it does)
2. Quick Facts (optional - "Perfect for:", "Time to:")
3. When to Use / When Not to Use
4. How It Works (mermaid diagram optional)
5. Key Benefits
6. Comparison Table (optional)
7. When to Graduate/Upgrade (optional)
```

### Philosophy/Rationale Documents

```text
1. Title + Hook (the principle)
2. The Problem
3. The Solution
4. Key Principles (### subsections)
5. Benefits
6. When This Applies
```

### Explanation Checklist

- [ ] Hook states what document explains
- [ ] Content in scannable `##` sections
- [ ] Comparison tables for 3+ options
- [ ] Diagrams have clear labels
- [ ] Links to how-to guides for procedural questions
- [ ] 2-3 admonitions max per document

## Reference Structure

### Types

| Type | Example |
|------|---------|
| **Index/Landing** | `workflows/index.md` |
| **Catalog** | `agents/index.md` |
| **Deep-Dive** | `document-project.md` |
| **Configuration** | `core-tasks.md` |
| **Glossary** | `glossary/index.md` |
| **Comprehensive** | `bmgd-workflows.md` |

### Reference Index Pages

```text
1. Title + Hook (one sentence)
2. Content Sections (## for each category)
   - Bullet list with links and descriptions
```

### Catalog Reference

```text
1. Title + Hook
2. Items (## for each item)
   - Brief description (one sentence)
   - **Commands:** or **Key Info:** as flat list
3. Universal/Shared (## section) (optional)
```

### Item Deep-Dive Reference

```text
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

```text
1. Title + Hook
2. Table of Contents (jump links if 4+ items)
3. Items (## for each config/task)
   - **Bold summary** — one sentence
   - **Use it when:** bullet list
   - **How it works:** numbered steps (3-5 max)
   - **Output:** expected result (optional)
```

### Comprehensive Reference Guide

```text
1. Title + Hook
2. Overview (## section)
   - Diagram or table showing organization
3. Major Sections (## for each phase/category)
   - Items (### for each item)
   - Standardized fields: Command, Agent, Input, Output, Description
4. Next Steps (optional)
```

### Reference Checklist

- [ ] Hook states what document references
- [ ] Structure matches reference type
- [ ] Items use consistent structure throughout
- [ ] Tables for structured/comparative data
- [ ] Links to explanation docs for conceptual depth
- [ ] 1-2 admonitions max

## Glossary Structure

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

### Context Markers

Add italic context at definition start for limited-scope terms:

- `*Quick Flow only.*`
- `*BMad Method/Enterprise.*`
- `*Phase N.*`
- `*BMGD.*`
- `*Brownfield.*`

### Glossary Checklist

- [ ] Terms in tables, not individual headers
- [ ] Terms alphabetized within categories
- [ ] Definitions 1-2 sentences
- [ ] Context markers italicized
- [ ] Term names bolded in cells
- [ ] No "A [term] is..." definitions

## FAQ Sections

```md
## Questions

- [Do I always need architecture?](#do-i-always-need-architecture)
- [Can I change my plan later?](#can-i-change-my-plan-later)

### Do I always need architecture?

Only for BMad Method and Enterprise tracks. Quick Flow skips to implementation.

### Can I change my plan later?

Yes. The SM agent has a `correct-course` workflow for handling scope changes.

**Have a question not answered here?** [Open an issue](...) or ask in [Discord](...).
```

## Validation Commands

Before submitting documentation changes:

```bash
npm run docs:fix-links            # Preview link format fixes
npm run docs:fix-links -- --write # Apply fixes
npm run docs:validate-links       # Check links exist
npm run docs:build                # Verify no build errors
```
