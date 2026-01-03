# Step 1: Navigation Structure

**Purpose:** Establish clear page context and navigation paths at the top of the specification.

---

## What Navigation Provides

**For Designers:**
- Immediately understand where this page fits in the scenario
- See the path forward (next page) without reading entire spec
- Context for user journey and flow

**For Developers:**
- Clear routing requirements
- Navigation implementation specs
- Page hierarchy understanding

**For Project Management:**
- Scenario structure visibility
- Completion tracking
- Flow dependencies

---

## Standard Format

### Required Elements

```markdown
### [Scenario Number].[Page Number] [Page Name]

**Next Step**: → [Next Page Name](relative/path/to/next-page.md)

![Page Section Name](relative/path/to/sketch.jpg)

**Next Step**: → [Next Page Name](relative/path/to/next-page.md)

# [Scenario Number].[Page Number] [Page Name]
```

---

## Format Example (Fictional Project)

```markdown
### 1.1 Home Page

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

![Home Page Hero Section](sketches/1-1-home-page-desktop.jpg)

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

# 1.1 Home Page
```

**Why Repeated Next Step?**
- First instance: Immediate context before visual
- Second instance: Natural progression after viewing sketch

---

## Creation Instructions

<if condition="Creating new specification">

### Extract Context

1. **Determine page numbering:**
   - Single page project: Use `1.1-page-name`
   - Single scenario: `1.1`, `1.2`, `1.3` (sequential pages)
   - Multiple scenarios: `1.1`, `1.2` (scenario 1), `2.1`, `2.2` (scenario 2)

2. **Identify next page:**
   - Review scenario structure
   - Find the logical next step in user flow
   - **Cross-scenario navigation:** If last page of scenario connects naturally to next scenario, link to first page of next scenario
   - **Journey end:** Only the final page of the final scenario has no "Next Step"

3. **Locate sketch file:**
   - Check `/sketches/` subfolder
   - Use format: `sketches/[scenario]-[page]-[variant].jpg`

### Generate Navigation Block

<output>
Generate the complete navigation block following the standard format.

**Template Variables:**
- `{scenario}`: Scenario number
- `{page}`: Page number
- `{page_name}`: Human-readable page name
- `{next_page_name}`: Name of next page in flow
- `{next_page_path}`: Relative path to next page .md file
- `{sketch_filename}`: Sketch file name with extension
- `{sketch_description}`: Brief description of what sketch shows

**Output Format:**
```markdown
### {scenario}.{page} {page_name}

**Next Step**: → [{next_page_name}]({next_page_path})

![{sketch_description}](sketches/{sketch_filename})

**Next Step**: → [{next_page_name}]({next_page_path})

# {scenario}.{page} {page_name}
```
</output>

</if>

---

## Quality Check Instructions

<if condition="Analyzing existing specification">

### Navigation Checklist

Run through each item. Report any failures.

**Required Elements:**

- [ ] **H3 header** with page number and name (`### X.X Page Name`)
- [ ] **First "Next Step"** link (before sketch)
- [ ] **Embedded sketch image** with descriptive alt text
- [ ] **Second "Next Step"** link (after sketch)
- [ ] **H1 header** with page number and name (same as H3)

**Path Validation:**

- [ ] Next Step path uses **relative path** format
- [ ] Next Step path points to existing `.md` file
- [ ] Sketch path uses **relative path** from current file
- [ ] Sketch file exists in specified location

**Naming Consistency:**

- [ ] H3 and H1 have **identical** page number
- [ ] H3 and H1 have **identical** page name
- [ ] Page number follows project structure (scenario.page)

**Edge Cases:**

- [ ] **Last page in scenario:** Include "Next Step" link to first page of next scenario if flow continues naturally
- [ ] **Last page in final scenario:** "Next Step" should be absent (journey ends here)
- [ ] **Single page project:** No "Next Step" link
- [ ] **Sketch alt text** is descriptive, not just filename

### Report Format

<output>
**Navigation Quality Report**

**Status:** ✅ PASS / ❌ FAIL

**Missing Elements:**
- [List any missing required elements]

**Path Issues:**
- [List any broken or incorrect paths]

**Inconsistencies:**
- [List any naming or numbering mismatches]

**Recommendations:**
- [Suggest fixes for any issues found]
</output>

</if>

---

## Common Errors to Avoid

**❌ Don't:**
- Skip the H3 header (only using H1)
- Use absolute URLs for internal links
- Forget to embed the sketch image
- Duplicate "Next Step" without the sketch between them
- Mix numbering schemes (1.1 vs 1-1 vs 01.01)

**✅ Do:**
- Use consistent numbering format across entire project
- Keep sketch image between the two "Next Step" links
- Use descriptive alt text for sketch images
- Verify all paths before saving

---

## Example Fixes

### ❌ Incorrect: Missing H3 and sketch

```markdown
# 1.1 Home Page

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)
```

### ✅ Correct: Complete navigation structure (within scenario)

```markdown
### 1.1 Home Page

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

![Home Page Hero Section](sketches/1-1-home-page-desktop.jpg)

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

# 1.1 Home Page
```

### ✅ Correct: Cross-scenario navigation

```markdown
### 1.3 Thank You Page

**Next Step**: → [2.1 Dashboard](../../02-user-dashboard/2.1-dashboard/2.1-dashboard.md)

![Thank You Page](sketches/1-3-thank-you-desktop.jpg)

**Next Step**: → [2.1 Dashboard](../../02-user-dashboard/2.1-dashboard/2.1-dashboard.md)

# 1.3 Thank You Page
```

**Rationale:** Scenario 1 (signup flow) naturally continues into Scenario 2 (main application), so the last page of Scenario 1 links to the first page of Scenario 2.

---

## Next Step

<action>Load and execute: step-02-page-overview.md</action>

