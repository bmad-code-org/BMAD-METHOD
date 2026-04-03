#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const VALID_TYPES = ['standard', 'landing', 'form', 'list', 'detail'];

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--page' && args[i + 1]) result.page = args[++i];
    if (args[i] === '--scenario' && args[i + 1]) result.scenario = args[++i];
    if (args[i] === '--type' && args[i + 1]) result.type = args[++i];
  }
  return result;
}

function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function getInputs(args) {
  let { page, scenario, type } = args;

  if (page && scenario && type) return { page, scenario, type };

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  if (!page) {
    page = await prompt(rl, 'Page name (e.g. Homepage): ');
    page = page.trim();
  }

  if (!scenario) {
    scenario = await prompt(rl, 'Scenario (e.g. "Harriet finds a service"): ');
    scenario = scenario.trim();
  }

  if (!type) {
    console.log(`Types: ${VALID_TYPES.join(' | ')}`);
    type = await prompt(rl, 'Page type: ');
    type = type.trim();
  }

  rl.close();
  return { page, scenario, type };
}

function toKebab(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function generatePageSpec(page, scenario, type) {
  const kebab = toKebab(page);
  const date = todayISO();

  const typeNotes = {
    standard: 'Standard content page',
    landing: 'Landing / marketing page — conversion-focused',
    form: 'Form page — data entry and submission',
    list: 'List / index page — browse and filter content',
    detail: 'Detail page — deep view of a single item',
  };

  return `<!--
  NAVIGATION BEST PRACTICE: Navigation links appear in THREE places:
  1. Above the sketch (top)
  2. Below the sketch (still in header area)
  3. At document bottom
  This is intentional for long specifications - users should not need to
  scroll the entire document to navigate between pages.
-->

### [page-number]-${kebab}

**Previous Step:** ← [Previous page](./previous-page.md)
**Next Step:** → [Next page](./next-page.md)

![${page}](Sketches/[page-number]-${kebab}.jpg)

**Previous Step:** ← [Previous page](./previous-page.md)
**Next Step:** → [Next page](./next-page.md)

---

# [page-number]-${kebab}

> **Type:** ${typeNotes[type] || type}
> **Created:** ${date}

## Page Metadata

| Property | Value |
|----------|-------|
| **Scenario** | ${scenario} |
| **Page Number** | [Assign a number] |
| **Platform** | [Mobile web / Desktop / PWA / Native] |
| **Page Type** | [Full Page / Modal / Drawer / Popup] |
| **Viewport** | [Mobile-first / Desktop-first] |
| **Interaction** | [Touch-first / Mouse+keyboard] |
| **Visibility** | [Public / Authenticated / Admin] |

---

## Overview

**Page Purpose:** [Describe the purpose of this page and the job it must accomplish for the user]

**User Situation:** [What brings the user here? What context are they in?]

**Success Criteria:** [How will we know this page succeeded? What does the user achieve?]

**Entry Points:**
- [How users arrive at this page]

**Exit Points:**
- [Where users go next after this page]

---

## Reference Materials

**Strategic Foundation:**
- [Product Brief](../../A-Product-Brief/01-product-brief.md) - [Brief description of relevance]
- [Trigger Map](../../B-Trigger-Map/) - [Brief description of relevance]

**Related Pages:**
- [Related page](./related-page.md)

**Design System:**
- [Component](../../E-Design-System/00-design-system.md)

---

## Layout Structure

[High-level description of page layout and how sections relate to each other]

\`\`\`
+------------------+
| Header           |
+------------------+
| Main Content     |
|                  |
+------------------+
| Footer           |
+------------------+
\`\`\`

---

## Spacing

<!--
  All spacing values MUST use token names from the project's spacing scale.
  The scale is defined in E-Design-System/00-design-system.md → Spacing Scale.
  Do NOT use arbitrary pixel values. If unsure, check the scale.
-->

**Scale:** [Spacing Scale](../../E-Design-System/00-design-system.md#spacing-scale)

| Property | Token |
|----------|-------|
| Page padding (horizontal) | [e.g., space-md mobile / space-lg desktop] |
| Section gap | [e.g., space-xl] |
| Element gap (default within sections) | [e.g., space-md] |
| Component gap (within groups) | [e.g., space-sm] |

---

## Typography

<!--
  Text sizes use token names from the project's type scale.
  Semantic level (H1, H2, p) signals document structure.
  Visual styling (size, weight, typeface) signals visual hierarchy.
  They are related but NOT locked together.
-->

**Scale:** [Type Scale](../../E-Design-System/00-design-system.md#type-scale)

| Element | Semantic | Size | Weight | Typeface |
|---------|----------|------|--------|----------|
| [Page title] | H1 | [e.g., text-2xl] | [e.g., bold] | [e.g., display / default] |
| [Section heading] | H2 | [e.g., text-xl] | [e.g., semibold] | [default] |
| [Body text] | p | text-md | normal | [default] |
| [Caption/helper] | p | [e.g., text-xs] | normal | [default] |

---

## Page Sections

### Section: [Section Name]

**OBJECT ID:** \`${kebab}-[section-name]\`

| Property | Value |
|----------|-------|
| Purpose | [What this section does and why it exists on this page] |
| Component | [[Design System Component]](../../E-Design-System/00-design-system.md) |
| Padding | [e.g., space-lg space-md] |
| Element gap | [e.g., space-md — or "default" if same as page-level] |

---

#### [Object Name]

**OBJECT ID:** \`${kebab}-[object-name]\`

| Property | Value |
|----------|-------|
| Component | [[Component]](../../E-Design-System/00-design-system.md) |
| Translation Key | \`[translation.key]\` |
| SE | "[Swedish text]" |
| EN | "[English text]" |
| Behavior | [onClick / onChange / etc.] |

---

#### [Object Name 2]

**OBJECT ID:** \`${kebab}-[object-name-2]\`

| Property | Value |
|----------|-------|
| Component | [[Component]](../../E-Design-System/00-design-system.md) |
| Translation Key | \`[translation.key]\` |
| SE | "[Swedish text]" |
| EN | "[English text]" |

---

## Page States

| State | When | Appearance | Actions |
|-------|------|------------|---------|
| Default | [Normal condition] | [Description of default appearance] | [Available actions] |
| Loading | [When data is fetching] | [Skeleton / spinner description] | [Available actions] |
| Empty | [No content to display] | [Empty state description] | [Available actions] |
| Error | [When something fails] | [Error message description] | [Recovery actions] |
| Success | [After successful action] | [Confirmation description] | [Next steps] |

---

## Conditional Sections

Include these micro-instructions when applicable:

| Condition | Include |
|-----------|---------|
| Public page (SEO needed) | → [meta-content.instructions.md](../instructions/meta-content.instructions.md) |
| Public page (SEO needed) | → [seo-content.instructions.md](../instructions/seo-content.instructions.md) |
| Has forms/inputs | → [form-validation.instructions.md](../instructions/form-validation.instructions.md) |
| Needs API data | → [data-api.instructions.md](../instructions/data-api.instructions.md) |
| Multiple breakpoints | → [responsive.instructions.md](../instructions/responsive.instructions.md) |
| Final review | → [accessibility.instructions.md](../instructions/accessibility.instructions.md) |
| **Always (spec creation/audit)** | → [open-questions.instructions.md](../instructions/open-questions.instructions.md) |

---

## Technical Notes

[Any constraints, performance requirements, or implementation notes relevant to this page]

---

## Open Questions

_No open questions at this time._

<!-- When questions exist, use this format:
| # | Question | Context | Status |
|---|----------|---------|--------|
| 1 | [What needs to be decided?] | [Why it matters] | 🔴 Open |
| 2 | [Question] | [Context] | 🟢 Resolved: [answer] |

**Status Legend:** 🔴 Open | 🟡 In Discussion | 🟢 Resolved
-->

---

## Checklist

- [ ] Page purpose clear
- [ ] All Object IDs assigned
- [ ] Components reference design system
- [ ] Translations complete (SE/EN)
- [ ] States documented
- [ ] Conditional sections included where needed

---

**Previous Step:** ← [Previous page](./previous-page.md)
**Next Step:** → [Next page](./next-page.md)

---

_Created using Whiteport Design Studio (WDS) methodology_
`;
}

async function main() {
  const args = parseArgs();
  const { page, scenario, type } = await getInputs(args);

  if (!page) {
    console.error('Error: Page name is required.');
    process.exit(1);
  }

  if (!scenario) {
    console.error('Error: Scenario is required.');
    process.exit(1);
  }

  if (!VALID_TYPES.includes(type)) {
    console.error(`Error: Invalid type "${type}". Must be one of: ${VALID_TYPES.join(', ')}`);
    process.exit(1);
  }

  const kebab = toKebab(page);
  const outputDir = path.join(process.cwd(), 'design-process', 'D-UX-Design');
  const outputFile = path.join(outputDir, `${kebab}.md`);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, generatePageSpec(page, scenario, type), 'utf8');

  console.log(`\nPage spec created: design-process/D-UX-Design/${kebab}.md`);
  console.log(`  Page:     ${page}`);
  console.log(`  Scenario: ${scenario}`);
  console.log(`  Type:     ${type}`);
  console.log('\nNext: Fill in sections, add sketches, assign Object IDs.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
