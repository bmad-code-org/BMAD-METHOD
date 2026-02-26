# Storyboard: Password Field

**Example storyboard specification for the WDS course**

---

## Coming Soon

This is an example storyboard referenced from [Module 11 Tutorial](../tutorial-11.md). It will demonstrate a complete behavior storyboard for a password field component.

---

## State Transitions

| From | To | Trigger | Duration | Visual |
|------|----|---------|----------|--------|
| Default | Focused | Click/Tab | Instant | Blue border |
| Focused | Typing | Keypress | Instant | Strength indicator appears |
| Typing | Visible | Eye icon click | Instant | Text revealed, icon toggles |
| Visible | Hidden | Eye icon click | Instant | Dots replace text |

## Strength Indicator

| Strength | Color | Label |
|----------|-------|-------|
| Weak | Red | "Weak" |
| Fair | Orange | "Fair" |
| Strong | Green | "Strong" |

---

*This is a teaching example for the WDS course.*
