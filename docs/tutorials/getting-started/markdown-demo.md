---
sidebar_label: Style Demo
sidebar_position: 99
---

# Markdown Style Demo

A comprehensive preview of all markdown elements and styling for light/dark mode testing.

## Typography

### Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Body Text

This is a regular paragraph with **bold text**, *italic text*, and ***bold italic text***. Here's some `inline code` as well. You can also use ~~strikethrough~~ text.

This paragraph contains a [link to an external site](https://github.com) and a [link to internal docs](./getting-started-bmadv4.md).

### Blockquotes

> This is a blockquote. It's useful for calling out important information or quotes from other sources.

> **Nested blockquote with formatting**
>
> This blockquote contains multiple paragraphs and **bold text**.
>
> > This is a nested blockquote inside the first one.

## Lists

### Unordered Lists

- First item
- Second item
- Third item with sub-items
  - Sub-item A
  - Sub-item B
    - Deep nested item
- Fourth item

### Ordered Lists

1. First step
2. Second step
3. Third step with sub-steps
   1. Sub-step A
   2. Sub-step B
4. Fourth step

### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Code

### Inline Code

Use the `npx bmad-method install` command to install BMAD.

### Code Blocks

```bash
# Bash example
npx bmad-method install
npm run dev
```

```javascript
// JavaScript example
function greet(name) {
  console.log(`Hello, ${name}!`);
  return { greeting: `Hello, ${name}!` };
}

const result = greet('BMAD');
```

```typescript
// TypeScript example
interface Agent {
  name: string;
  role: string;
  workflows: string[];
}

const analyst: Agent = {
  name: 'Analyst',
  role: 'Project initialization',
  workflows: ['workflow-init', 'brainstorm'],
};
```

```yaml
# YAML example
agent:
  metadata:
    id: analyst
    name: Analyst
  persona:
    role: Project Analyst
    principles:
      - Be thorough
      - Ask clarifying questions
```

```json
{
  "name": "bmad-method",
  "version": "6.0.0",
  "description": "AI-driven development framework"
}
```

### Code Block with Line Highlighting

```javascript title="example.js" {2,4-5}
function example() {
  // This line is highlighted
  const normal = 'not highlighted';
  // These lines are
  // also highlighted
  return normal;
}
```

## Tables

### Simple Table

| Agent | Role | Primary Workflows |
|-------|------|-------------------|
| Analyst | Project initialization | workflow-init, brainstorm |
| PM | Requirements | prd, tech-spec |
| Architect | System design | create-architecture |
| DEV | Implementation | dev-story, code-review |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Text | Text | Text |
| More | More | More |

## Admonitions

:::note
This is a **note** admonition. Use it for supplementary information that's nice to know but not critical.
:::

:::tip[Pro Tip]
This is a **tip** admonition with a custom title. Use it for best practices, shortcuts, and helpful hints.
:::

:::info[Important Context]
This is an **info** admonition. Use it for important context, definitions, or examples that help understanding.
:::

:::warning[Watch Out]
This is a **warning** admonition. Use it for potential issues, caveats, or things users should be careful about.
:::

:::danger[Critical Warning]
This is a **danger** admonition. Use it sparingly for critical warnings about data loss, security issues, or irreversible actions.
:::

### Admonitions with Content

:::tip[Multiple Elements]
Admonitions can contain multiple elements:

- Bullet points
- **Bold text**
- `inline code`

```bash
# Even code blocks
echo "Hello from inside an admonition"
```

And multiple paragraphs of text.
:::

## Links and Images

### Links

- [External link](https://github.com/bmad-code-org/BMAD-METHOD)
- [Internal link](./getting-started-bmadv4.md)
- [Link with title](https://bmad.dev "BMAD Documentation")
- Autolink: <https://example.com>

### Images

![BMad Workflow](./images/workflow-method-greenfield.svg)

*Caption: Example workflow diagram*

## Horizontal Rules

Content above the rule.

---

Content below the rule.

## Details/Collapsible Sections

<details>
<summary>Click to expand this section</summary>

This content is hidden by default and can be expanded by clicking the summary.

- It can contain lists
- And **formatted text**
- And even code:

```bash
echo "Hidden code"
```

</details>

<details>
<summary>Another collapsible section</summary>

More hidden content here.

</details>

## Special Elements

### Keyboard Keys

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

On Mac, use <kbd>Cmd</kbd> + <kbd>V</kbd> to paste.

### Abbreviations

The HTML specification is maintained by the W3C.

### Subscript and Superscript

H<sub>2</sub>O is water.

E = mc<sup>2</sup> is Einstein's famous equation.

## Combined Examples

### Card-Style Layout

<div className="row">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>Card Title</h3>
      </div>
      <div className="card__body">
        <p>Card body content with <strong>bold</strong> and <code>code</code>.</p>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header">
        <h3>Another Card</h3>
      </div>
      <div className="card__body">
        <p>More card content here.</p>
      </div>
    </div>
  </div>
</div>

### Buttons

<a className="button button--primary margin-right--sm">Primary Button</a>
<a className="button button--secondary margin-right--sm">Secondary Button</a>
<a className="button button--outline button--primary">Outline Button</a>

### Mixed Content Block

:::info[Real-World Example]
Here's how a typical workflow command looks:

1. Load the **PM agent** in your IDE
2. Run the PRD workflow:
   ```
   *prd
   ```
3. Answer the agent's questions
4. Review the output in `_bmad-output/PRD.md`

| Step | Agent | Command |
|------|-------|---------|
| 1 | PM | `*prd` |
| 2 | Architect | `*create-architecture` |
| 3 | SM | `*sprint-planning` |

**Result:** A complete PRD document ready for architecture.
:::

## Color Palette Preview

These boxes show the primary color at various shades:

<div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px'}}>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary-darkest)', borderRadius: '4px'}} title="primary-darkest"></div>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary-darker)', borderRadius: '4px'}} title="primary-darker"></div>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary-dark)', borderRadius: '4px'}} title="primary-dark"></div>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary)', borderRadius: '4px'}} title="primary"></div>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary-light)', borderRadius: '4px'}} title="primary-light"></div>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary-lighter)', borderRadius: '4px'}} title="primary-lighter"></div>
  <div style={{width: '60px', height: '60px', backgroundColor: 'var(--ifm-color-primary-lightest)', borderRadius: '4px'}} title="primary-lightest"></div>
</div>

Labels (left to right): darkest, darker, dark, **primary**, light, lighter, lightest
