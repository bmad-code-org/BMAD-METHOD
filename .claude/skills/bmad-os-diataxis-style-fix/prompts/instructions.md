# Diataxis Style Fixer

Automatically fixes documentation to comply with the Diataxis framework and BMad Method style guide.

## CRITICAL RULES

- **NEVER commit or push changes** — let the user review first
- **NEVER make destructive edits** — preserve all content, only fix formatting
- **Use Edit tool** — make targeted fixes, not full file rewrites
- **Show summary** — after fixing, list all changes made

## Input

Documentation file path or directory to fix. Defaults to `docs/` if not specified.

## Step 1: Understand Diataxis Framework

**Diataxis** is a documentation framework that categorizes content into four types based on two axes:

|                | **Learning** (oriented toward future)                                         | **Doing** (oriented toward present)                                          |
| -------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Practical**  | **Tutorials** — lessons that guide learners through achieving a specific goal | **How-to guides** — step-by-step instructions for solving a specific problem |
| **Conceptual** | **Explanation** — content that clarifies and describes underlying concepts    | **Reference** — technical descriptions, organized for lookup                 |

**Key principles:**
- Each document type serves a distinct user need
- Don't mix types — a tutorial shouldn't explain concepts deeply
- Focus on the user's goal, not exhaustive coverage
- Structure follows purpose (tutorials are linear, reference is scannable)

## Step 2: Read the Style Guide

Read the project's style guide at `docs/_STYLE_GUIDE.md` to understand all project-specific conventions.

## Step 3: Detect Document Type

Based on file location, determine the document type:

| Location             | Diataxis Type        |
| -------------------- | -------------------- |
| `/docs/tutorials/`   | Tutorial             |
| `/docs/how-to/`      | How-to guide         |
| `/docs/explanation/` | Explanation          |
| `/docs/reference/`   | Reference            |
| `/docs/glossary/`    | Reference (glossary) |

## Step 4: Find and Fix Issues

For each markdown file, scan for issues and fix them:

### Universal Fixes (All Doc Types)

**Horizontal Rules (`---`)**
- Remove any `---` outside of YAML frontmatter
- Replace with `##` section headers or admonitions as appropriate

**`####` Headers**
- Replace with bold text: `#### Header` → `**Header**`
- Or convert to admonition if it's a warning/notice

**"Related" or "Next:" Sections**
- Remove entire section including links
- The sidebar handles navigation

**Deeply Nested Lists**
- Break into sections with `##` headers
- Flatten to max 3 levels

**Code Blocks for Dialogue/Examples**
- Convert to admonitions:
  ```
  :::note[Example]
  [content]
  :::
  ```

**Bold Paragraph Callouts**
- Convert to admonitions with appropriate type

**Too Many Admonitions**
- Limit to 1-2 per section (tutorials allow 3-4 per major section)
- Consolidate related admonitions
- Remove less critical ones if over limit

**Table Cells / List Items > 2 Sentences**
- Break into multiple rows/cells
- Or shorten to 1-2 sentences

**Header Budget Exceeded**
- Merge related sections
- Convert some `##` to `###` subsections
- Goal: 8-12 `##` per doc; 2-3 `###` per section

### Type-Specific Fixes

**Tutorials** (`/docs/tutorials/`)
- Ensure hook describes outcome in 1-2 sentences
- Add "What You'll Learn" bullet section if missing
- Add `:::note[Prerequisites]` if missing
- Add `:::tip[Quick Path]` TL;DR at top if missing
- Use tables for phases, commands, agents
- Add "What You've Accomplished" section if missing
- Add Quick Reference table if missing
- Add Common Questions section if missing
- Add Getting Help section if missing
- Add `:::tip[Key Takeaways]` at end if missing

**How-To** (`/docs/how-to/`)
- Ensure hook starts with "Use the `X` workflow to..."
- Add "When to Use This" with 3-5 bullets if missing
- Add `:::note[Prerequisites]` if missing
- Ensure steps are numbered `###` with action verbs
- Add "What You Get" describing outputs if missing

**Explanation** (`/docs/explanation/`)
- Ensure hook states what document explains
- Organize content into scannable `##` sections
- Add comparison tables for 3+ options
- Link to how-to guides for procedural questions
- Limit to 2-3 admonitions per document

**Reference** (`/docs/reference/`)
- Ensure hook states what document references
- Ensure structure matches reference type
- Use consistent item structure throughout
- Use tables for structured/comparative data
- Link to explanation docs for conceptual depth
- Limit to 1-2 admonitions per document

**Glossary** (`/docs/glossary/` or glossary files)
- Ensure categories as `##` headers
- Ensure terms in tables (not individual headers)
- Definitions 1-2 sentences max
- Bold term names in cells

## Step 5: Apply Fixes

For each file with issues:
1. Read the file
2. Use Edit tool for each fix
3. Track what was changed

## Step 6: Summary

After processing all files, output a summary:

```markdown
# Style Fixes Applied

**Files processed:** N
**Files modified:** N

## Changes Made

### `path/to/file.md`
- Removed horizontal rule at line 45
- Converted `####` headers to bold text
- Added `:::tip[Quick Path]` admonition
- Consolidated 3 admonitions into 2

### `path/to/other.md`
- Removed "Related:" section
- Fixed table cell length (broke into 2 rows)

## Review Required

Please review the changes. When satisfied, commit and push as needed.
```

## Common Patterns

**Converting `####` to bold:**
```markdown
#### Important Note
Some text here.
```
→
```markdown
**Important Note**

Some text here.
```

**Removing horizontal rule:**
```markdown
Some content above.

---

Some content below.
```
→
```markdown
Some content above.

## [Descriptive Section Header]

Some content below.
```

**Converting code block to admonition:**
```markdown
```
User: What should I do?

Agent: Run the workflow.
```
```
→
```markdown
:::note[Example]

**User:** What should I do?

**Agent:** Run the workflow.

:::
```

**Converting bold paragraph to admonition:**
```markdown
**IMPORTANT:** This is critical that you read this before proceeding.
```
→
```markdown
:::caution[Important]
This is critical that you read this before proceeding.
:::
```
