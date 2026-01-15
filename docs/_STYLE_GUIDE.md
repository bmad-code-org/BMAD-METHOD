---
title: "Documentation Style Guide"
---

Internal guidelines for maintaining consistent, high-quality documentation across the BMad Method project. This document is not included in the Starlight sidebar — it's for contributors and maintainers, not end users.

## Quick Principles

1. **Clarity over brevity** — Be concise, but never at the cost of understanding
2. **Consistent structure** — Follow established patterns so readers know what to expect
3. **Strategic visuals** — Use admonitions, tables, and diagrams purposefully
4. **Scannable content** — Headers, lists, and callouts help readers find what they need

## Validation Steps

Before submitting documentation changes, run these checks from the repo root:

1. **Fix link format** — Convert relative links (`./`, `../`) to site-relative paths (`/path/`)
   ```bash
   npm run docs:fix-links            # Preview changes
   npm run docs:fix-links -- --write # Apply changes
   ```

2. **Validate links** — Check all links point to existing files
   ```bash
   npm run docs:validate-links            # Preview issues
   npm run docs:validate-links -- --write # Auto-fix where possible
   ```

3. **Build the site** — Verify no build errors
   ```bash
   npm run docs:build
   ```

## Tutorial Structure

Every tutorial should follow this structure:

```
1. Title + Hook (1-2 sentences describing the outcome)
2. Version/Module Notice (info or warning admonition as appropriate)
3. What You'll Learn (bullet list of outcomes)
4. Prerequisites (info admonition)
5. Quick Path (tip admonition - TL;DR summary)
6. Understanding [Topic] (context before steps - tables for phases/agents)
7. Installation (if applicable)
8. Step 1: [First Major Task]
9. Step 2: [Second Major Task]
10. Step 3: [Third Major Task]
11. What You've Accomplished (summary + folder structure if applicable)
12. Quick Reference (commands table)
13. Common Questions (FAQ format)
14. Getting Help (community links)
15. Key Takeaways (tip admonition - memorable points)
```

Not all sections are required for every tutorial, but this is the standard flow.

## How-To Structure

How-to guides are task-focused and shorter than tutorials. They answer "How do I do X?" for users who already understand the basics.

```
1. Title + Hook (one sentence: "Use the `X` workflow to...")
2. When to Use This (bullet list of scenarios)
3. When to Skip This (optional - for workflows that aren't always needed)
4. Prerequisites (note admonition)
5. Steps (numbered ### subsections)
6. What You Get (output/artifacts produced)
7. Example (optional - concrete usage scenario)
8. Tips (optional - best practices, common pitfalls)
9. Next Steps (optional - what to do after completion)
```

Include sections only when they add value. A simple how-to might only need Hook, Prerequisites, Steps, and What You Get.

### How-To vs Tutorial

| Aspect | How-To | Tutorial |
|--------|--------|----------|
| **Length** | 50-150 lines | 200-400 lines |
| **Audience** | Users who know the basics | New users learning concepts |
| **Focus** | Complete a specific task | Understand a workflow end-to-end |
| **Sections** | 5-8 sections | 12-15 sections |
| **Examples** | Brief, inline | Detailed, step-by-step |

### How-To Visual Elements

Use admonitions strategically in how-to guides:

| Admonition | Use In How-To |
|------------|---------------|
| `:::note[Prerequisites]` | Required dependencies, agents, prior steps |
| `:::tip[Pro Tip]` | Optional shortcuts or best practices |
| `:::caution[Common Mistake]` | Pitfalls to avoid |
| `:::note[Example]` | Brief usage example inline with steps |

**Guidelines:**
- **1-2 admonitions max** per how-to (they're shorter than tutorials)
- **Prerequisites as admonition** makes scanning easier
- **Tips section** can be a flat list instead of admonition if there are multiple tips
- **Skip admonitions entirely** for very simple how-tos

### How-To Checklist

Before submitting a how-to:

- [ ] Hook is one clear sentence starting with "Use the `X` workflow to..."
- [ ] When to Use This has 3-5 bullet points
- [ ] Prerequisites listed (admonition or flat list)
- [ ] Steps are numbered `###` subsections with action verbs
- [ ] What You Get describes output artifacts
- [ ] No horizontal rules (`---`)
- [ ] No `####` headers
- [ ] No "Related" section (sidebar handles navigation)
- [ ] 1-2 admonitions maximum

## Explanation Structure

Explanation documents help users understand concepts, features, and design decisions. They answer "What is X?" and "Why does X matter?" rather than "How do I do X?"

### Types of Explanation Documents

| Type | Purpose | Example |
|------|---------|---------|
| **Index/Landing** | Overview of a topic area with navigation | `core-concepts/index.md` |
| **Concept** | Define and explain a core concept | `what-are-agents.md` |
| **Feature** | Deep dive into a specific capability | `quick-flow.md` |
| **Philosophy** | Explain design decisions and rationale | `why-solutioning-matters.md` |
| **FAQ** | Answer common questions (see FAQ Sections below) | `brownfield-faq.md` |

### General Explanation Structure

```
1. Title + Hook (1-2 sentences explaining the topic)
2. Overview/Definition (what it is, why it matters)
3. Key Concepts (### subsections for main ideas)
4. Comparison Table (optional - when comparing options)
5. When to Use / When Not to Use (optional - decision guidance)
6. Diagram (optional - mermaid for processes/flows)
7. Next Steps (optional - where to go from here)
```

### Index/Landing Pages

Index pages orient users within a topic area.

```
1. Title + Hook (one sentence overview)
2. Content Table (links with descriptions)
3. Getting Started (numbered list for new users)
4. Choose Your Path (optional - decision tree for different goals)
```

**Example hook:** "Understanding the fundamental building blocks of the BMad Method."

### Concept Explainers

Concept pages define and explain core ideas.

```
1. Title + Hook (what it is in one sentence)
2. Types/Categories (if applicable, with ### subsections)
3. Key Differences Table (comparing types/options)
4. Components/Parts (breakdown of elements)
5. Which Should You Use? (decision guidance)
6. Creating/Customizing (brief pointer to how-to guides)
```

**Example hook:** "Agents are AI assistants that help you accomplish tasks. Each agent has a unique personality, specialized capabilities, and an interactive menu."

### Feature Explainers

Feature pages provide deep dives into specific capabilities.

```
1. Title + Hook (what the feature does)
2. Quick Facts (optional - "Perfect for:", "Time to:")
3. When to Use / When Not to Use (with bullet lists)
4. How It Works (process overview, mermaid diagram if helpful)
5. Key Benefits (what makes it valuable)
6. Comparison Table (vs alternatives if applicable)
7. When to Graduate/Upgrade (optional - when to use something else)
```

**Example hook:** "Quick Spec Flow is a streamlined alternative to the full BMad Method for Quick Flow track projects."

### Philosophy/Rationale Documents

Philosophy pages explain design decisions and reasoning.

```
1. Title + Hook (the principle or decision)
2. The Problem (what issue this addresses)
3. The Solution (how this approach solves it)
4. Key Principles (### subsections for main ideas)
5. Benefits (what users gain)
6. When This Applies (scope of the principle)
```

**Example hook:** "Phase 3 (Solutioning) translates **what** to build (from Planning) into **how** to build it (technical design)."

### Explanation Visual Elements

Use these elements strategically in explanation documents:

| Element | Use For |
|---------|---------|
| **Comparison tables** | Contrasting types, options, or approaches |
| **Mermaid diagrams** | Process flows, phase sequences, decision trees |
| **"Best for:" lists** | Quick decision guidance |
| **Code examples** | Illustrating concepts (keep brief) |

**Guidelines:**
- **Use diagrams sparingly** — one mermaid diagram per document maximum
- **Tables over prose** — for any comparison of 3+ items
- **Avoid step-by-step instructions** — point to how-to guides instead

### Explanation Checklist

Before submitting an explanation document:

- [ ] Hook clearly states what the document explains
- [ ] Content organized into scannable `##` sections
- [ ] Comparison tables used for contrasting options
- [ ] No horizontal rules (`---`)
- [ ] No `####` headers
- [ ] No "Related" section (sidebar handles navigation)
- [ ] No "Next:" navigation links (sidebar handles navigation)
- [ ] Diagrams have clear labels and flow
- [ ] Links to how-to guides for "how do I do this?" questions
- [ ] 2-3 admonitions maximum

## Reference Structure

Reference documents provide quick lookup information for users who know what they're looking for. They answer "What are the options?" and "What does X do?" rather than explaining concepts or teaching skills.

### Types of Reference Documents

| Type | Purpose | Example |
|------|---------|---------|
| **Index/Landing** | Navigation to reference content | `workflows/index.md` |
| **Catalog** | Quick-reference list of items | `agents/index.md` |
| **Deep-Dive** | Detailed single-item reference | `document-project.md` |
| **Configuration** | Settings and config documentation | `core-tasks.md` |
| **Glossary** | Term definitions | `glossary/index.md` |
| **Comprehensive** | Extensive multi-item reference | `bmgd-workflows.md` |

### Reference Index Pages

For navigation landing pages:

```
1. Title + Hook (one sentence describing scope)
2. Content Sections (## for each category)
   - Bullet list with links and brief descriptions
```

Keep these minimal — their job is navigation, not explanation.

### Catalog Reference (Item Lists)

For quick-reference lists of items:

```
1. Title + Hook (one sentence)
2. Items (## for each item)
   - Brief description (one sentence)
   - **Commands:** or **Key Info:** as flat list
3. Universal/Shared (## section if applicable)
```

**Guidelines:**
- Use `##` for items, not `###`
- No horizontal rules between items — whitespace is sufficient
- No "Related" section — sidebar handles navigation
- Keep descriptions to 1 sentence per item

### Item Deep-Dive Reference

For detailed single-item documentation:

```
1. Title + Hook (one sentence purpose)
2. Quick Facts (optional note admonition)
   - Module, Command, Input, Output as list
3. Purpose/Overview (## section)
4. How to Invoke (code block)
5. Key Sections (## for each major aspect)
   - Use ### for sub-options within sections
6. Notes/Caveats (tip or caution admonition)
```

**Guidelines:**
- Start with "quick facts" so readers immediately know scope
- Use admonitions for important caveats
- No "Related Documentation" section — sidebar handles this

### Configuration Reference

For settings, tasks, and config documentation:

```
1. Title + Hook (one sentence explaining what these configure)
2. Table of Contents (jump links if 4+ items)
3. Items (## for each config/task)
   - **Bold summary** — one sentence describing what it does
   - **Use it when:** bullet list of scenarios
   - **How it works:** numbered steps
   - **Output:** expected result (if applicable)
```

**Guidelines:**
- Table of contents only needed for 4+ items
- Keep "How it works" to 3-5 steps maximum
- No horizontal rules between items

### Glossary Reference

For term definitions:

```
1. Title + Hook (one sentence)
2. Navigation (jump links to categories)
3. Categories (## for each category)
   - Terms (### for each term)
   - Definition (1-3 sentences, no prefix)
   - Related context or example (optional)
```

**Guidelines:**
- Group related terms into categories
- Keep definitions concise — link to explanation docs for depth
- Use `###` for terms (makes them linkable and scannable)
- No horizontal rules between terms

### Comprehensive Reference Guide

For extensive multi-item references:

```
1. Title + Hook (one sentence)
2. Overview (## section)
   - Diagram or table showing organization
3. Major Sections (## for each phase/category)
   - Items (### for each item)
   - Standardized fields: Command, Agent, Input, Output, Description
   - Optional: Steps, Features, Use when
4. Next Steps (optional — only if genuinely helpful)
```

**Guidelines:**
- Standardize item fields across all items in the guide
- Use tables for comparing multiple items at once
- One diagram maximum per document
- No horizontal rules — use `##` sections for separation

### General Reference Guidelines

These apply to all reference documents:

| Do | Don't |
|----|-------|
| Use `##` for major sections, `###` for items within | Use `####` headers |
| Use whitespace for separation | Use horizontal rules (`---`) |
| Link to explanation docs for "why" | Explain concepts inline |
| Use tables for structured data | Use nested lists |
| Use admonitions for important notes | Use bold paragraphs for callouts |
| Keep descriptions to 1-2 sentences | Write paragraphs of explanation |

### Reference Admonitions

Use sparingly — 1-2 maximum per reference document:

| Admonition | Use In Reference |
|------------|------------------|
| `:::note[Prerequisites]` | Dependencies needed before using |
| `:::tip[Pro Tip]` | Shortcuts or advanced usage |
| `:::caution[Important]` | Critical caveats or warnings |

### Reference Checklist

Before submitting a reference document:

- [ ] Hook clearly states what the document references
- [ ] Appropriate structure for reference type (catalog, deep-dive, etc.)
- [ ] No horizontal rules (`---`)
- [ ] No `####` headers
- [ ] No "Related" section (sidebar handles navigation)
- [ ] Items use consistent structure throughout
- [ ] Descriptions are 1-2 sentences maximum
- [ ] Tables used for structured/comparative data
- [ ] 1-2 admonitions maximum
- [ ] Links to explanation docs for conceptual depth

## Glossary Structure

Glossaries provide quick-reference definitions for project terminology. Unlike other reference documents, glossaries prioritize compact scanability over narrative explanation.

### Layout Strategy

Starlight auto-generates a right-side "On this page" navigation from headers. Use this to your advantage:

- **Categories as `##` headers** — Appear in right nav for quick jumping
- **Terms in tables** — Compact rows, not individual headers
- **No inline TOC** — Right sidebar handles navigation; inline TOC is redundant
- **Right nav shows categories only** — Cleaner than listing every term

This approach reduces content length by ~70% while improving navigation.

### Table Format

Each category uses a two-column table:

```md
## Category Name

| Term | Definition |
|------|------------|
| **Agent** | Specialized AI persona with specific expertise that guides users through workflows. |
| **Workflow** | Multi-step guided process that orchestrates AI agent activities to produce deliverables. |
```

### Definition Guidelines

| Do | Don't |
|----|-------|
| Start with what it IS or DOES | Start with "This is..." or "A [term] is..." |
| Keep to 1-2 sentences | Write multi-paragraph explanations |
| Bold the term name in the cell | Use plain text for terms |
| Link to docs for deep dives | Explain full concepts inline |

### Context Markers

For terms with limited scope, add italic context at the start of the definition:

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

Link related terms when helpful. Reference the category anchor since individual terms aren't headers:

```md
| **Tech-Spec** | *Quick Flow only.* Technical plan for small changes. See [PRD](#planning-documents). |
```

### Organization

- **Alphabetize terms** within each category table
- **Alphabetize categories** or order by logical progression (foundational → specific)
- **No catch-all sections** — Every term belongs in a specific category

### Glossary Checklist

Before submitting glossary changes:

- [ ] Terms in tables, not individual headers
- [ ] Terms alphabetized within each category
- [ ] No inline TOC (right nav handles navigation)
- [ ] No horizontal rules (`---`)
- [ ] Definitions are 1-2 sentences
- [ ] Context markers italicized at definition start
- [ ] Term names bolded in table cells
- [ ] No "A [term] is..." definitions

## Visual Hierarchy

### Avoid

| Pattern | Problem |
|---------|---------|
| `---` horizontal rules | Fragment the reading flow |
| `####` deep headers | Create visual noise |
| **Important:** bold paragraphs | Blend into body text |
| Deeply nested lists | Hard to scan |
| Code blocks for non-code | Confusing semantics |

### Use Instead

| Pattern | When to Use |
|---------|-------------|
| White space + section headers | Natural content separation |
| Bold text within paragraphs | Inline emphasis |
| Admonitions | Callouts that need attention |
| Tables | Structured comparisons |
| Flat lists | Scannable options |

## Admonitions

Use Starlight admonitions strategically:

```md
:::tip[Title]
Shortcuts, best practices, "pro tips"
:::

:::note[Title]
Context, definitions, examples, prerequisites
:::

:::caution[Title]
Caveats, potential issues, things to watch out for
:::

:::danger[Title]
Critical warnings only — data loss, security issues
:::
```

### Standard Admonition Uses

| Admonition | Standard Use in Tutorials |
|------------|---------------------------|
| `:::note[Prerequisites]` | What users need before starting |
| `:::tip[Quick Path]` | TL;DR summary at top of tutorial |
| `:::caution[Fresh Chats]` | Context limitation reminders |
| `:::note[Example]` | Command/response examples |
| `:::tip[Check Your Status]` | How to verify progress |
| `:::tip[Remember These]` | Key takeaways at end |

### Admonition Guidelines

- **Always include a title** for tip, info, and warning
- **Keep content brief** — 1-3 sentences ideal
- **Don't overuse** — More than 3-4 per major section feels noisy
- **Don't nest** — Admonitions inside admonitions are hard to read

## Headers

### Budget

- **8-12 `##` sections** for full tutorials following standard structure
- **2-3 `###` subsections** per `##` section maximum
- **Avoid `####` entirely** — use bold text or admonitions instead

### Naming

- Use action verbs for steps: "Install BMad", "Create Your Plan"
- Use nouns for reference sections: "Common Questions", "Quick Reference"
- Keep headers short and scannable

## Code Blocks

### Do

```md
```bash
npx bmad-method install
```
```

### Don't

````md
```
You: Do something
Agent: [Response here]
```
````

For command/response examples, use an admonition instead:

```md
:::note[Example]
Run `workflow-status` and the agent will tell you the next recommended workflow.
:::
```

## Tables

Use tables for:
- Phases and what happens in each
- Agent roles and when to use them
- Command references
- Comparing options
- Step sequences with multiple attributes

Keep tables simple:
- 2-4 columns maximum
- Short cell content
- Left-align text, right-align numbers

### Standard Tables

**Phases Table:**
```md
| Phase | Name | What Happens |
|-------|------|--------------|
| 1 | Analysis | Brainstorm, research *(optional)* |
| 2 | Planning | Requirements — PRD or tech-spec *(required)* |
```

**Quick Reference Table:**
```md
| Command | Agent | Purpose |
|---------|-------|---------|
| `*workflow-init` | Analyst | Initialize a new project |
| `*prd` | PM | Create Product Requirements Document |
```

**Build Cycle Table:**
```md
| Step | Agent | Workflow | Purpose |
|------|-------|----------|---------|
| 1 | SM | `create-story` | Create story file from epic |
| 2 | DEV | `dev-story` | Implement the story |
```

## Lists

### Flat Lists (Preferred)

```md
- **Option A** — Description of option A
- **Option B** — Description of option B
- **Option C** — Description of option C
```

### Numbered Steps

```md
1. Load the **PM agent** in a new chat
2. Run the PRD workflow: `*prd`
3. Output: `PRD.md`
```

### Avoid Deep Nesting

```md
<!-- Don't do this -->
1. First step
   - Sub-step A
     - Detail 1
     - Detail 2
   - Sub-step B
2. Second step
```

Instead, break into separate sections or use an admonition for context.

## Links

- Use descriptive link text: `[Tutorial Style Guide](./tutorial-style.md)`
- Avoid "click here" or bare URLs
- Prefer relative paths within docs

## Images

- Always include alt text
- Add a caption in italics below: `*Description of the image.*`
- Use SVG for diagrams when possible
- Store in `./images/` relative to the document

## FAQ Sections

Use a TOC with jump links, `###` headers for questions, and direct answers:

```md
## Questions

- [Do I always need architecture?](#do-i-always-need-architecture)
- [Can I change my plan later?](#can-i-change-my-plan-later)

### Do I always need architecture?

Only for BMad Method and Enterprise tracks. Quick Flow skips to implementation.

### Can I change my plan later?

Yes. The SM agent has a `correct-course` workflow for handling scope changes.

**Have a question not answered here?** Please [open an issue](...) or ask in [Discord](...) so we can add it!
```

### FAQ Guidelines

- **TOC at top** — Jump links under `## Questions` for quick navigation
- **`###` headers** — Questions are scannable and linkable (no `Q:` prefix)
- **Direct answers** — No `**A:**` prefix, just the answer
- **No "Related Documentation"** — Sidebar handles navigation; avoid repetitive links
- **End with CTA** — "Have a question not answered here?" with issue/Discord links

## Folder Structure Blocks

Show project structure in "What You've Accomplished":

````md
Your project now has:

```
your-project/
├── _bmad/                         # BMad configuration
├── _bmad-output/
│   ├── PRD.md                     # Your requirements document
│   └── bmm-workflow-status.yaml   # Progress tracking
└── ...
```
````

## Example: Before and After

### Before (Noisy)

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

### After (Clean)

```md
## Step 1: Initialize Your Project

Load the **Analyst agent** in your IDE, wait for the menu, then run `workflow-init`.

:::note[What Happens]
You'll describe your project goals and complexity. The workflow then recommends a planning track.
:::
```

## Checklist

Before submitting a tutorial:

- [ ] Follows the standard structure
- [ ] Has version/module notice if applicable
- [ ] Has "What You'll Learn" section
- [ ] Has Prerequisites admonition
- [ ] Has Quick Path TL;DR admonition
- [ ] No horizontal rules (`---`)
- [ ] No `####` headers
- [ ] Admonitions used for callouts (not bold paragraphs)
- [ ] Tables used for structured data (phases, commands, agents)
- [ ] Lists are flat (no deep nesting)
- [ ] Has "What You've Accomplished" section
- [ ] Has Quick Reference table
- [ ] Has Common Questions section
- [ ] Has Getting Help section
- [ ] Has Key Takeaways admonition
- [ ] All links use descriptive text
- [ ] Images have alt text and captions
