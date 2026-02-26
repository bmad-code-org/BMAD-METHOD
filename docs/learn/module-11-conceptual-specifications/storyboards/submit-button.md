# Storyboard: Submit Button

**Example storyboard specification for the WDS course**

---

## Coming Soon

This is an example storyboard referenced from [Module 11 Tutorial](../tutorial-11.md). It will demonstrate a complete behavior storyboard for a submit button component.

---

## State Transitions

| From | To | Trigger | Duration | Visual |
|------|----|---------|----------|--------|
| Default | Hover | Mouse enter | Instant | Darker background |
| Hover | Default | Mouse leave | Instant | Original background |
| Default | Loading | Click | 100ms delay | Spinner replaces text |
| Loading | Success | API response OK | Instant | Checkmark, green background |
| Loading | Error | API response fail | Instant | Return to default, show error |
| Success | Redirect | Timer | 1.5s | Fade out, navigate |

---

*This is a teaching example for the WDS course.*
