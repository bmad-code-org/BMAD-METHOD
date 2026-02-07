# Step 0.2: Project Configuration & Structure

## CONTEXT

Project type is confirmed (Greenfield or Brownfield). Now we configure the project and create the folder structure.

---

## 1. PROJECT NAME

<ask>
**What's your project name?**

Project name:
</ask>

---

## 2. WHAT ARE YOU BUILDING?

<ask>
**What type of product is this?**

[A] **Landing Page** - Single page, marketing focused
    → Simplified workflow, minimal phases

[B] **Website** - Multiple pages, content focused
    → Standard workflow, most phases

[C] **Web Application** - Complex features, user interactions
    → Full workflow, all phases

[D] **Mobile App** - iOS/Android application
    → Full workflow + platform considerations

Choice:
</ask>

<action>
Store as `product_complexity`:
- A → simple (skip Phase 2, 3, 5)
- B → standard (optional Phase 5)
- C → complex (all phases)
- D → complex (all phases + mobile config)
</action>

---

## 3. TECH STACK (Optional)

<ask>
**Do you know your tech stack?** (Skip if undecided)

[A] **React / Next.js** - Modern React ecosystem
[B] **Vue / Nuxt** - Vue.js ecosystem
[C] **WordPress** - CMS-based
[D] **Static HTML** - Simple HTML/CSS/JS
[E] **Other** - Different framework
[F] **Skip** - Decide later

Choice:
</ask>

<action>Store as `tech_stack` (or null if skipped)</action>

---

## 4. COMPONENT LIBRARY (Optional)

<ask>
**Using a component library?** (Skip if not applicable)

[A] **shadcn/ui** - Tailwind-based components
    → Skip Phase 5 (Design System)

[B] **Tailwind only** - Utility CSS, custom components
    → Phase 5 optional

[C] **Material UI** - Google's design system
    → Skip Phase 5

[D] **Custom** - Building your own
    → Phase 5 recommended

[E] **None / Skip** - Decide later

Choice:
</ask>

<action>
Store as `component_library`
If A, C → set `skip_design_system: true`
</action>

---

## 5. BRIEF LEVEL (Greenfield only)

<ask if="greenfield">
**How thorough should the Project Brief be?**

[A] **Complete** (Recommended)
    - 14 steps, ~2-3 hours
    - Vision, positioning, business model, users, success criteria
    - Best for: Complex products, teams, investor pitches

[B] **Simplified**
    - 5 steps, ~30 minutes
    - Core vision, basic constraints, quick start
    - Best for: Personal projects, prototypes, clear vision

Choice:
</ask>

<action>Store as `brief_level`: complete | simplified</action>

---

## 6. CREATE STRUCTURE

<action>
**Check for existing structure first:**
- Look for `docs/` folder
- Look for `.wds-project-outline.yaml`

**If exists:** Ask to keep or reset
</action>

### Greenfield Structure

```
docs/
├── .wds-project-outline.yaml
├── 1-project-brief/
├── 2-trigger-map/          # Skip if simple
├── 3-prd/                  # Skip if simple
├── 4-ux-design/
├── 5-design-system/        # Skip if using library
├── 6-deliveries/
└── 7-testing/
```

### Brownfield Structure

```
docs/
├── .wds-project-outline.yaml
├── A-project-brief/
│   └── limited-brief.md
├── improvements/
└── deliveries/
```

---

## 7. GENERATE PROJECT OUTLINE

<action>
**Create `.wds-project-outline.yaml` with all config:**

```yaml
# WDS Project Outline
# Generated: {{date}}

project:
  name: "{{project_name}}"
  type: {{greenfield|brownfield}}
  created: {{date}}

config:
  product_complexity: {{simple|standard|complex}}
  tech_stack: {{tech_stack|null}}
  component_library: {{component_library|null}}
  brief_level: {{complete|simplified}}       # Greenfield only
  skip_design_system: {{true|false}}

phases:
  # Phases configured based on complexity and config
  {{generated_phases}}

notes: |
  Configuration captured during Phase 0 setup.
  Phases marked 'skip' will not appear in workflow.
```
</action>

---

## 8. SUMMARY & NEXT STEPS

<output>
**Project configured!**

| Setting | Value |
|---------|-------|
| Name | {{project_name}} |
| Type | {{greenfield/brownfield}} |
| Complexity | {{product_complexity}} |
| Tech Stack | {{tech_stack or "Not set"}} |
| Brief Level | {{brief_level}} |

**Phases:** {{enabled_phases}} enabled, {{skipped_phases}} skipped

---

**[GREENFIELD]** Ready for Phase 1: Project Brief
- {{brief_level}} mode ({{brief_level == "complete" ? "14 steps" : "5 steps"}})

[A] Start Phase 1 now
[B] Hand off to Saga (specialist)

**[BROWNFIELD]** Ready for Phase 8: Existing Product

[A] Create Limited Brief now
[B] Scan my codebase first
[C] I know what to improve - go
</output>

---

## ROUTING

<action>
**Greenfield:**
- [A] → Phase 1 workflow (brief_level determines which)
- [B] → Hand off to Saga

**Brownfield:**
- [A] → Load Limited Brief template
- [B] → Scan codebase, then brief
- [C] → Phase 8.1 Identify Opportunity
</action>

---

_Phase 0: Project Setup — Step 0.2: Configuration & Structure_
