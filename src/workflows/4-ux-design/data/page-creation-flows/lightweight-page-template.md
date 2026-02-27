# Lightweight Page Template

Template for generating page placeholder documents in page-init-lightweight workflow.

---

## File Location

`C-UX-Scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/{{page_number}}-{{page_slug}}.md`

---

## Template

```markdown
{{#if previous_page != "none"}}
← [{{previous_page}}](../{{previous_page_slug}}/{{previous_page_slug}}.md)
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
 | [{{next_page}}](../{{next_page_slug}}/{{next_page_slug}}.md) →
{{/if}}
{{#if next_page == "TBD"}}
 | Next: TBD
{{/if}}

![{{page_name}}](sketches/{{page_slug}}-concept.jpg)

{{#if previous_page != "none"}}
← [{{previous_page}}](../{{previous_page_slug}}/{{previous_page_slug}}.md)
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
 | [{{next_page}}](../{{next_page_slug}}/{{next_page_slug}}.md) →
{{/if}}

# {{page_number}} {{page_name}}

**User Situation:** {{user_situation}}

**Page Purpose:** {{page_purpose}}

---

## Status

⚠️ **PLACEHOLDER** - This page needs:
- [ ] Sketch or screenshot
- [ ] Section breakdown
- [ ] Object specifications
- [ ] Component links
- [ ] Interaction definitions
- [ ] States and variants

---

## Navigation Context

{{#if previous_page != "none"}}
**Previous:** {{previous_page}}
{{else}}
**This is the first page in the scenario**
{{/if}}

{{#if next_page == "TBD"}}
**Next:** TBD (to be defined)
{{else if next_page != "none"}}
**Next:** {{next_page}}
{{else}}
**This is the last page in the scenario**
{{/if}}

---

## Open Questions

<!--
  Auto-populate questions based on page characteristics.
  Reference: instructions/open-questions.instructions.md

  Check for:
  - Responsive breakpoints
  - Loading/Error/Empty states
  - SEO (if public)
  - Accessibility
  - User permissions
  - Time-sensitive behaviors
  - Form validation
  - Navigation/back behavior
-->

_No open questions at this time._

---

## Next Steps

To complete this page specification:

1. **Add a sketch**: Place your sketch in `sketches/` folder
2. **Run Page Process Workshop**: Analyze your sketch
3. **Specify sections**: Define all page sections
4. **Specify objects**: Define all interactive elements with Object IDs
5. **Link components**: Connect to design system components
6. **Document states**: Define loading, error, success, empty states
7. **Review open-questions.instructions.md**: Add relevant questions to Open Questions section
8. **Generate prototype**: Create interactive HTML preview

---

{{#if previous_page != "none"}}
**Previous Step**: ← [{{previous_page}}](../{{previous_page_slug}}/{{previous_page_slug}}.md)
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
**Next Step**: → [{{next_page}}](../{{next_page_slug}}/{{next_page_slug}}.md)
{{/if}}

---

_Placeholder created using Whiteport Design Studio (WDS) methodology_
```

---

## Key Principles

### ✅ **Navigation is Critical**
- Appears three times (above sketch, below sketch, document bottom)
- Links to previous/next pages
- Creates navigable flow
- Essential for comprehension

### ✅ **Open Questions Ready**
- Section included from start
- Reference `open-questions.instructions.md` during spec creation
- Auto-populate based on page characteristics
- Ensures no edge cases are missed
