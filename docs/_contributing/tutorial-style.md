# Tutorial Style Guide

Standards for writing tutorials and getting-started guides in BMAD documentation.

## Structure

Every tutorial should follow this flow:

1. **Title + Hook** — What you'll accomplish (1-2 sentences)
2. **Prerequisites** — Use `:::info[Prerequisites]` if needed
3. **What You'll Learn** — Brief bullet list of outcomes
4. **Main Steps** — Numbered phases, minimal nesting
5. **Summary + Next Steps** — Wrap up, link forward

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

Use Docusaurus admonitions strategically:

```md
:::tip[Title]
Shortcuts, best practices, "pro tips"
:::

:::info[Title]
Context, definitions, examples
:::

:::note
Supplementary information (can be collapsed)
:::

:::warning[Title]
Caveats, potential issues, things to watch out for
:::

:::danger[Title]
Critical warnings only — data loss, security issues
:::
```

### Admonition Guidelines

- **Always include a title** for tip, info, and warning
- **Keep content brief** — 1-3 sentences ideal
- **Don't overuse** — More than 3-4 per major section feels noisy
- **Don't nest** — Admonitions inside admonitions are hard to read

## Headers

### Budget

- **5-7 `##` sections** maximum per tutorial
- **2-3 `###` subsections** per `##` section maximum
- **Avoid `####` entirely** — use bold text or admonitions instead

### Naming

- Use action verbs for steps: "Install the CLI", "Configure Your Project"
- Use nouns for reference sections: "Common Questions", "Quick Reference"
- Keep headers short and scannable

## Code Blocks

### Do

```md
```bash
npx bmad-method@alpha install
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
:::info[Example]
Run `workflow-status` and the agent will tell you the next recommended workflow.
:::
```

## Tables

Use tables for:
- Comparing options
- Mapping relationships (agent → document)
- Step sequences with multiple attributes

Keep tables simple:
- 2-4 columns maximum
- Short cell content
- Left-align text, right-align numbers

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
2. Run the PRD workflow
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

Format as bold question followed by answer paragraph:

```md
**Do I always need architecture?**
Only for BMad Method and Enterprise tracks. Quick Flow skips to implementation.

**Can I change my plan later?**
Yes. The SM agent has a `correct-course` workflow for handling scope changes.
```

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
## Step 1: Initialize Your Workflow

Load the **Analyst agent** in your IDE, wait for the menu, then run `workflow-init`.

:::info[What Happens]
You'll describe your project goals and complexity. The workflow then recommends a planning track.
:::
```

## Checklist

Before submitting a tutorial:

- [ ] Follows the standard structure (hook → learn → steps → summary)
- [ ] No horizontal rules (`---`)
- [ ] No `####` headers
- [ ] Admonitions used for callouts (not bold paragraphs)
- [ ] Tables used for structured data
- [ ] Lists are flat (no deep nesting)
- [ ] 5-7 `##` sections maximum
- [ ] All links use descriptive text
- [ ] Images have alt text and captions
