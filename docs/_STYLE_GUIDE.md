# Documentation Style Guide

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
