# Step {##}: {Step Name}

## Meta

| Field | Value |
|-------|-------|
| **Agent** | {Agent name — e.g., Freya (UX Designer)} |
| **Step** | {#} of {total} |
| **Focus** | {Brief description of step focus} |

---

## Single Source of Truth

⚠️ **READ THE SPECIFICATION BEFORE IMPLEMENTING.**

📄 **Specification:** [{Spec name}]({path-to-spec})

The specification contains the complete requirements. This step file maps Object IDs to their spec locations — do not implement without reading the full spec sections.

---

## Object ID Implementation Map

| Object ID | Spec Section | Lines |
|-----------|--------------|-------|
| `{object-id-1}` | {Section name} | L{start}-L{end} |
| `{object-id-2}` | {Section name} | L{start}-L{end} |
| `{object-id-3}` | {Section name} | L{start}-L{end} |

### Design System References

| Component | Location |
|-----------|----------|
| {Component name} | `{path-to-design-system-component}` |

---

## Task

{Clear description of what to implement in this step}

---

## Files to Modify

| File | Action |
|------|--------|
| `{path/to/file}` | {Create / Modify} |

---

## Implementation Checklist

For **each Object ID**, read the spec section and implement:

| Object ID | Read Spec | Implement | Verify |
|-----------|-----------|-----------|--------|
| `{object-id-1}` | [ ] | [ ] | [ ] |
| `{object-id-2}` | [ ] | [ ] | [ ] |
| `{object-id-3}` | [ ] | [ ] | [ ] |

---

## Verification Process

After implementation, self-verify using Puppeteer before presenting to the user.

See: [Inline Testing Guide](../../4-ux-design/agentic-development/guides/INLINE-TESTING-GUIDE.md) for full methodology.

```
For each Object ID:
  1. Open page in browser (Puppeteer)
  2. Find element: document.querySelector('[data-object-id="{id}"]')
  3. Verify measurable properties against spec:
     - Text content matches translation keys
     - Computed styles match spec values (colors, sizes, spacing)
     - Dimensions meet requirements (touch targets >= 44px)
     - Visibility conditions work correctly
     - State transitions behave as specified
     - Accessibility attributes present
  4. Narrate each finding with ✓/✗ (actual vs expected)
  5. Fix any failures before presenting to user
```

**If modifying existing features:** Capture baseline state with Puppeteer before implementation. Compare after to confirm only intended changes.

---

## Acceptance Criteria

### Agent-Verifiable (Puppeteer)

- [ ] All Object IDs present as `data-object-id` attributes
- [ ] Each element's text content matches specification
- [ ] Each element's styling matches specification values
- [ ] Touch targets meet minimum 44px requirement
- [ ] State-specific visibility/behavior works correctly
- [ ] Translations work (SE/EN) using Translation Keys from spec
- [ ] No TypeScript errors
- [ ] No console errors

### User-Evaluable (Qualitative)

- [ ] Interaction flow feels natural
- [ ] Visual hierarchy is clear
- [ ] Section is consistent with overall design

---

## Notes

{Any additional notes, discoveries, or issues found during implementation}

---

## CW Status Check

At step completion, assess context window status:

| Indicator | Status |
|-----------|--------|
| Session length | {Short / Medium / Long} |
| Context clarity | {Clear / Degraded} |
| Recommendation | {Continue / Consider fresh start / Fresh start recommended} |

**If starting fresh session for next step, include handoff summary:**

```
Completed: Step {#} - {Step Name}
Key decisions: {list any important decisions made}
File states: {list modified files and their current state}
Next: Step {#+1} - {Next Step Name}
```

---

_Step {#} of {total} — {Feature Name} Implementation_
