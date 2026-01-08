# Substep 4C-05: Interactions

**Goal:** Define what happens when users interact with each component

---

## EXECUTION

<output>**Let's define all interactions.**

For each interactive element, we'll specify what happens when users interact with it.</output>

<action>For each component with Object ID:
<ask>**{{object_id}}** ({{element_type}})

What happens when the user interacts with this?

- On click / on input / on focus?
- What's the immediate response?
- What state changes occur?
- Where does it navigate (if applicable)?
- What data is sent/received?
  </ask>

<action>Store interaction_behavior for component</action>
</action>

<output>✅ **Interactions defined!**

**Components with behaviors:** {{interactive_count}}

**Next:** We'll define all possible states.</output>

---

## MENU

<ask>[C] Continue to 4C-06 (States)</ask>

---

## EXAMPLE OUTPUT

```yaml
interactions:
  signin-form-email-input:
    on_focus:
      - 'Highlight border (primary color)'
      - 'Show label above field'
    on_input:
      - 'Real-time validation (email format)'
      - 'Clear error state if valid'
    on_blur:
      - 'Validate complete email'
      - 'Show error if invalid'

  signin-form-password-input:
    on_focus:
      - 'Highlight border'
    on_input:
      - 'Mask characters as bullets'
    on_blur:
      - 'Validate not empty'

  signin-form-submit-button:
    on_click:
      - 'Validate all fields'
      - 'If valid: disable button, show loading state'
      - 'POST to /api/auth/signin'
      - 'On success: redirect to /dashboard'
      - 'On error: show error message, re-enable button'

  signin-form-forgot-link:
    on_click:
      - 'Navigate to /auth/forgot-password'
```

---

## NEXT STEP

Load `substeps/4c-06-states.md`
