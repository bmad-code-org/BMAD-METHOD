# Assessment Step 1: Scan Existing Components

**Purpose:** Find all components in design system that match the current component type.

**Input:** Component type (e.g., "Button")

**Output:** List of matching components with basic info

---

## Step 1: Read Design System Folder

<action>
Scan design system components:
- Read all files in `D-Design-System/components/`
- Parse component type from each file
- Filter by matching type
</action>

**Example:**

```
Current component: Button

Scanning D-Design-System/components/...
- button.md → Type: Button ✓ Match
- input-field.md → Type: Input Field ✗ No match
- card.md → Type: Card ✗ No match
```

---

## Step 2: Extract Component Metadata

<action>
For each matching component, extract:
- Component ID (e.g., `btn-001`)
- Variants (e.g., primary, secondary, ghost)
- States (e.g., default, hover, active, disabled)
- Key styling attributes
- Usage count (how many pages use it)
</action>

**Example:**

```yaml
Button [btn-001]:
  variants: [primary, secondary, ghost]
  states: [default, hover, active, disabled]
  styling:
    size: medium
    color: blue
    shape: rounded
  used_in: 3 pages
```

---

## Step 3: Build Candidate List

<output>
Present matching components:

```
🔍 Found 1 existing Button component:

**Button [btn-001]**
- Variants: primary, secondary, ghost
- States: default, hover, active, disabled
- Size: medium
- Color: blue
- Shape: rounded
- Used in: 3 pages (login, signup, dashboard)
```

</output>

**If multiple matches:**

```
🔍 Found 2 existing Button components:

**Button [btn-001]** - Primary action button
- Variants: primary, secondary
- Used in: 5 pages

**Icon Button [btn-002]** - Icon-only button
- Variants: small, medium, large
- Used in: 8 pages
```

---

## Step 4: Pass to Next Step

<action>
Pass candidate list to comparison step:
- Component IDs
- Full metadata
- Current component specification
</action>

**Next:** `02-compare-attributes.md`

---

## Edge Cases

**No matching components found:**

```
✓ No existing Button components in design system.

This will be the first Button component.
```

**Route to:** `operations/create-new-component.md`

**Design system empty:**

```
✓ Design system is empty.

This will be the first component.
```

**Route to:** `operations/initialize-design-system.md`

**Multiple type matches:**

```
🔍 Found 2 Button-type components:

I'll compare your new button to both to find the best match.
```

**Continue to comparison for each candidate**

---

## Output Format

**For next step:**

```json
{
  "current_component": {
    "type": "Button",
    "specification": {...}
  },
  "candidates": [
    {
      "id": "btn-001",
      "variants": ["primary", "secondary", "ghost"],
      "states": ["default", "hover", "active", "disabled"],
      "styling": {...},
      "usage_count": 3,
      "used_in": ["login", "signup", "dashboard"]
    }
  ]
}
```

---

**This step just scans and lists. Comparison happens in the next step.**
