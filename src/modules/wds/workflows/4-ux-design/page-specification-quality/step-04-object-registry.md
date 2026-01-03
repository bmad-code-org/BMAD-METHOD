# Step 4: Object Registry

**Purpose:** Create a master reference table of all page objects for quick lookup and traceability.

---

## What Object Registry Provides

**For Designers:**
- Quick reference of all page elements
- Easy communication ("update object start-hero-cta")
- Complete page inventory

**For Developers:**
- Testing targets (selenium, playwright)
- Element reference for implementation
- Content management system mapping

**For Content Teams:**
- Translation targets
- Content update references
- CMS field mapping

**For QA/Testing:**
- Systematic test coverage
- Element identification
- Regression testing targets

---

## Standard Format

### Required Structure

```markdown
## Object Registry

This page uses a systematic Object ID system for precise element identification across specifications, HTML demos, and production code.

### Master Object List - [Section Name]

| Object ID | Object | Content Type | Description | Interactions |
|-----------|--------|--------------|-------------|--------------|
| `object-id` | Section | Type | Brief description | User actions |
```

---

## Format Example (Fictional Project)

```markdown
## Object Registry

This page uses a systematic Object ID system for precise element identification across specifications, HTML demos, and production code.

### Master Object List - Header & Hero

| Object ID | Object | Content Type | Description | Interactions |
|-----------|--------|--------------|-------------|--------------|
| `home-header-logo` | Header | Brand logo | TaskFlow logotype | onClick → home |
| `home-header-signin` | Header | Navigation button | Sign in button | onClick → sign-in |
| `home-hero-headline` | Hero | Primary headline | Value proposition | Static text |
| `home-hero-cta` | Hero | Primary CTA button | Main call-to-action | onClick → registration |
```

---

## Creation Instructions

<if condition="Creating new specification">

### Extract All Objects

1. **Review all Page Sections** created in Step 3
2. **List every Object ID** found in the specifications
3. **Group objects by section** (Header, Hero, Features, Footer, etc.)
4. **Determine content type** for each object
5. **Summarize interaction** in one phrase

### Content Type Classification

**Common Content Types:**
- Brand logo
- Navigation button
- Primary headline
- Secondary headline
- Body paragraph
- CTA button
- Text input
- Image/Illustration
- Icon
- Link
- Trust indicator
- Feature card
- Testimonial card
- FAQ item

### Interaction Classification

**Common Interactions:**
- `onClick → [destination]`
- `onChange → [action]`
- `onSubmit → [action]`
- `onHover → [effect]`
- `Static display`
- `Static text, language-aware`

### Generate Registry Tables

<output>
Generate complete Object Registry following the standard format.

**Structure:**
1. Registry introduction paragraph (copy exactly as shown)
2. One table per logical section grouping
3. All objects from Page Sections included

**Table Format:**
```markdown
### Master Object List - [Section Group Name]

| Object ID | Object | Content Type | Description | Interactions |
|-----------|--------|--------------|-------------|--------------|
| `object-id` | Section | Type | Brief description | User action |
```

**Grouping Guidelines:**
- Combine small related sections (Header & Hero)
- Keep large sections separate (Features, FAQ, Footer)
- Aim for 4-8 objects per table
- Maximum 12 objects per table

</output>

</if>

---

## Quality Check Instructions

<if condition="Analyzing existing specification">

### Registry Checklist

**Structure Validation:**

- [ ] **"## Object Registry"** heading present
- [ ] **Introduction paragraph** present (explaining Object ID system)
- [ ] At least one **Master Object List** table exists
- [ ] Tables use correct markdown format (pipes and hyphens)
- [ ] Column headers are: **Object ID | Object | Content Type | Description | Interactions**

**Completeness:**

- [ ] **All Object IDs** from Page Sections appear in registry
- [ ] **No duplicate Object IDs** in registry
- [ ] **No orphan Object IDs** (in registry but not in Page Sections)
- [ ] Objects are **grouped logically** by section

**Content Quality:**

- [ ] Object IDs use **backtick formatting** (`` `object-id` ``)
- [ ] Content Types are **descriptive and consistent**
- [ ] Descriptions are **brief** (3-8 words)
- [ ] Interactions use **standard format** (`onClick →`, `onChange →`, etc.)
- [ ] **No empty cells** in table

**Cross-Reference Validation:**

Run a comparison between Page Sections and Object Registry:

1. **List all Object IDs from Page Sections**
2. **List all Object IDs from Object Registry**
3. **Compare lists:**
   - Missing in Registry = ❌ Add to registry
   - Missing in Sections = ❌ Remove from registry or add to sections
   - Mismatched = ❌ Fix typo

### Report Format

<output>
**Object Registry Quality Report**

**Status:** ✅ PASS / ❌ FAIL

**Structure Issues:**
- [Missing registry section?]
- [Missing introduction paragraph?]
- [Table formatting errors?]

**Completeness:**
- **Total Object IDs in Sections:** X
- **Total Object IDs in Registry:** Y
- **Match:** ✅ / ❌

**Missing from Registry:**
- [List Object IDs in sections but not in registry]

**Orphan Object IDs:**
- [List Object IDs in registry but not in sections]

**Content Issues:**
- [Vague descriptions]
- [Inconsistent content types]
- [Missing interaction specifications]

**Recommendations:**
- [Specific fixes needed]
</output>

</if>

---

## Common Errors to Avoid

**❌ Don't:**
- Skip the registry ("it's just a duplicate")
- Use inconsistent content type names
- Leave cells empty (use "N/A" or "Static" if truly non-interactive)
- Forget backticks around Object IDs
- Create registry before Page Sections (order matters)
- Use vague descriptions ("button", "text")

**✅ Do:**
- Include every single Object ID from Page Sections
- Use consistent content type terminology
- Keep descriptions brief but specific
- Format Object IDs with backticks
- Group objects logically by section
- Cross-reference to ensure 100% match

---

## Example Fixes

### ❌ Incorrect: Incomplete and poorly formatted

```markdown
## Objects

| ID | Type | Description |
|----|------|-------------|
| start-logo | Logo | Logo |
| start-button | Button | Button to sign in |
```

**Issues:**
- Wrong section title ("Objects" not "Object Registry")
- Missing introduction paragraph
- Wrong table headers
- Object IDs not in backticks
- Missing "Object" and "Interactions" columns
- Vague descriptions
- Incomplete (missing objects)

### ✅ Correct: Complete and properly formatted

```markdown
## Object Registry

This page uses a systematic Object ID system for precise element identification across specifications, HTML demos, and production code.

### Master Object List - Header & Hero

| Object ID | Object | Content Type | Description | Interactions |
|-----------|--------|--------------|-------------|--------------|
| `home-header-logo` | Header | Brand logo | TaskFlow logotype | onClick → home |
| `home-header-signin` | Header | Navigation button | Sign in button | onClick → sign-in |
| `home-hero-headline` | Hero | Primary headline | Value proposition | Static text |
| `home-hero-cta` | Hero | Primary CTA button | Main call-to-action | onClick → registration |
```

**Strengths:**
- Correct section title
- Introduction paragraph present
- All five columns present
- Object IDs in backticks
- Descriptive content types
- Clear, brief descriptions
- Specific interaction specs
- Logical grouping

---

## Implementation Notes Section

### Optional Addition

After the registry tables, you may include an "Implementation Notes" section:

```markdown
### Implementation Notes

**HTML Demo Integration:**
- Each object includes `id="object-id"` and `data-object-id="object-id"` attributes
- JavaScript uses Object IDs for content updates and event handling
- Translation system maps content directly to Object IDs

**Production Code Mapping:**
- Object IDs become component props or data attributes
- Content management systems can reference Object IDs for updates
- Testing frameworks can target elements by Object ID for reliable automation

**Designer-Developer Workflow:**
- Designer uses Object IDs as component names in Figma
- Specifications provide structure, designer modifies as needed
- Developer updates specs based on design iterations
- GitHub specifications remain single source of truth

**Content Traceability:**
- Every interactive element has a unique Object ID
- Changes to specifications automatically propagate to HTML demos and production code
- Clear communication: "Update the CTA in start-hero-cta"
```

**Include this section if:**
- Project has interactive prototypes
- Project uses CMS or translation system
- Team wants implementation guidance

---

## Next Step

<action>Load and execute: step-05-final-validation.md</action>

