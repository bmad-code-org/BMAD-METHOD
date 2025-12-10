# Substep 4C-02: Layout Sections

**Goal:** Define high-level page structure and sections

---

## EXECUTION

<output>**Now let's define the layout sections.**

Think about the major areas of the page (header, main content, sidebar, footer, etc.)</output>

<ask>**What are the main sections of this page?**

Describe each major section and its purpose.

Example:

- Header: Logo, navigation, user menu
- Hero: Welcome message and primary CTA
- Main Content: Sign-up form
- Footer: Links and legal info</ask>

<action>For each section:

- Store section_name
- Store section_purpose
- Store section_priority (primary/secondary)
  </action>

<output>✅ **Layout sections defined!**

**Sections identified:** {{section_count}}

**Next:** We'll identify all interactive components.</output>

---

## MENU

<ask>[C] Continue to 4C-03 (Components & Object IDs)</ask>

---

## EXAMPLE OUTPUT

```yaml
layout_sections:
  - name: 'Header'
    purpose: 'Navigation and branding'
    priority: 'secondary'

  - name: 'Sign In Form'
    purpose: 'User authentication'
    priority: 'primary'

  - name: 'Footer'
    purpose: 'Legal links and support'
    priority: 'secondary'
```

---

## NEXT STEP

Load `substeps/4c-03-components-objects.md`
