# Design System Router

**Purpose:** Route component specifications to appropriate design system operations based on similarity analysis.

**Role:** Dumb router - identifies and routes, doesn't contain business logic.

---

## When This Runs

**Triggered from Phase 4:**

- After component specification is complete
- Only if design system is enabled in project
- Before returning to page specification

**Input:** Complete component specification (mixed content)

**Output:**

- Design system entry (component-level info)
- Page specification reference (page-specific info)

---

## Router Logic

```
┌─────────────────────────────────────┐
│ Component Specification Complete    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Check: Design System Enabled?       │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
       NO            YES
        │             │
        ▼             ▼
┌──────────┐   ┌─────────────────────┐
│ Skip     │   │ Design System Router│
│ Return   │   └──────────┬──────────┘
└──────────┘              │
                          ▼
               ┌─────────────────────┐
               │ Check: First        │
               │ Component?          │
               └──────┬──────────────┘
                      │
               ┌──────┴──────┐
               │             │
              YES            NO
               │             │
               ▼             ▼
    ┌──────────────────┐  ┌────────────────┐
    │ Initialize       │  │ Scan Existing  │
    │ Design System    │  │ Components     │
    └────────┬─────────┘  └────────┬───────┘
             │                     │
             │                     ▼
             │          ┌────────────────────┐
             │          │ Similar Component  │
             │          │ Found?             │
             │          └────────┬───────────┘
             │                   │
             │            ┌──────┴──────┐
             │            │             │
             │           NO            YES
             │            │             │
             │            ▼             ▼
             │   ┌────────────────┐  ┌──────────────┐
             │   │ Create New     │  │ Opportunity/ │
             │   │ Component      │  │ Risk         │
             │   │                │  │ Assessment   │
             │   └────────┬───────┘  └──────┬───────┘
             │            │                 │
             └────────────┴─────────────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Extract Component   │
               │ Info to Design      │
               │ System              │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Create Reference    │
               │ ID                  │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Return to Page Spec │
               │ Replace with        │
               │ Reference           │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Complete            │
               └─────────────────────┘
```

---

## Step 1: Check Design System Status

<action>
Check project configuration:
- Read: `A-Project-Brief/project-config.md`
- Look for: `design_system_mode: [none|custom|library]`
- If `none`: Skip this entire workflow
- If `custom` or `library`: Continue
</action>

<output>
**If none:** Return to Phase 4, keep complete spec on page

**If enabled:** Continue to Step 2
</output>

---

## Step 2: Check First Component

<action>
Check if design system folder exists:
- Look for: `D-Design-System/` folder
- If doesn't exist: This is the first component
- If exists: Check for existing components
</action>

<output>
**If first component:**
```
🎉 This is your first design system component!

I'll initialize the design system structure and add this component.

```

**Route to:** `operations/initialize-design-system.md`
</output>

<output>
**If not first:**
```

📊 Checking existing design system for similar components...

```

**Continue to Step 3**
</output>

---

## Step 3: Scan Existing Components

<action>
Scan design system folder:
- Read all files in `D-Design-System/components/`
- Extract component types and IDs
- Build list of existing components
</action>

<output>
**Existing components found:**
```

Found 3 existing components:

- Button [btn-001]
- Input Field [inp-001]
- Card [crd-001]

```

**Continue to Step 4**
</output>

<output>
**No similar components:**
```

No similar components found in design system.

```

**Route to:** `operations/create-new-component.md`
</output>

---

## Step 4: Identify Similar Components

<action>
Compare current component to existing:
- Match by component type (Button, Input, Card, etc.)
- If type matches: Potential similarity
- If no type match: Create new component
</action>

<output>
**Type match found:**
```

🔍 Found existing Button component [btn-001]

Checking similarity...

```

**Route to:** `assessment/01-scan-existing.md`
</output>

<output>
**No type match:**
```

This is a new component type: [ComponentType]

````

**Route to:** `operations/create-new-component.md`
</output>

---

## Routing Decisions

### Route A: Initialize Design System
**When:** First component in project
**Go to:** `operations/initialize-design-system.md`
**Result:** Create folder structure + first component

### Route B: Create New Component
**When:** No similar components found
**Go to:** `operations/create-new-component.md`
**Result:** Add new component to design system

### Route C: Opportunity/Risk Assessment
**When:** Similar component found
**Go to:** `assessment/01-scan-existing.md`
**Result:** Designer decides: same/variant/new

---

## After Routing

**All routes eventually:**
1. Extract component-level info to design system
2. Generate component ID (e.g., `btn-001`)
3. Create reference in page spec
4. Return control to Phase 4

**Example Return:**

**Input (Complete Spec):**
```yaml
Login Button:
  why: Submit login credentials
  label: "Log in"
  error_text: "Invalid credentials"
  states: [default, hover, disabled]
  variants: [primary, secondary]
  styling: {...}
````

**Output (Page Spec with Reference):**

```yaml
Login Button:
  component: Button.primary [btn-001]
  why: Submit login credentials
  label: 'Log in'
  error_text: 'Invalid credentials'
```

**Output (Design System Entry):**

```yaml
# D-Design-System/components/button.md
Button Component [btn-001]:
  states: [default, hover, disabled]
  variants: [primary, secondary]
  styling: { ... }
```

---

## Router Characteristics

**✅ Does:**

- Check design system status
- Identify first component
- Scan existing components
- Match component types
- Route to appropriate operation

**❌ Doesn't:**

- Make design decisions
- Contain specification logic
- Store component knowledge
- Handle business rules
- Process component details

**Keep it dumb, keep it clean!**

---

## Error Handling

**If design system folder missing but config says enabled:**

```
⚠️ Design system is enabled but folder doesn't exist.
Treating this as first component and initializing.
```

**If component type unclear:**

```
❓ I'm not sure what type of component this is.

Current specification: [show spec]

Is this a:
1. Button
2. Input Field
3. Card
4. Other: [specify]

Your choice:
```

**If similarity check fails:**

```
⚠️ I couldn't determine similarity automatically.

Would you like to:
1. Create as new component
2. Manually specify which component it's similar to
3. Skip design system for this component

Your choice:
```

---

## Next Steps

**After routing:**

- Follow the routed operation instructions
- Complete design system entry
- Return reference to Phase 4
- Phase 4 updates page spec
- Continue with next component

---

**This is a router. It identifies and routes. Business logic lives in the operations it routes to.**
