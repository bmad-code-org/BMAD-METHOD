# Substep 4C-06: States

**Goal:** Define all possible page and component states

---

## EXECUTION

<output>**Let's define all possible states.**

States show how the page and components appear in different situations.</output>

## PAGE-LEVEL STATES

<ask>**What are the different page-level states?**

Think about:

- Default/loaded state
- Empty state (no data)
- Loading state (fetching data)
- Error state (something went wrong)
- Success state (after action completes)

For each state, describe:

- When it occurs
- What the user sees
- What actions are available</ask>

<action>Store page_states with descriptions</action>

## COMPONENT STATES

<output>**Now let's define component states.**

For components with multiple appearances, we'll specify each state.</output>

<action>For components with multiple states:
<ask>**{{object_id}}** states:

- Default:
- Hover:
- Active/Pressed:
- Focus:
- Disabled:
- Loading:
- Error:
- Success:

(Only specify states that apply to this component)</ask>

<action>Store component_states</action>
</action>

<output>✅ **All states defined!**

**Page states:** {{page_state_count}}
**Component states:** {{component_state_count}}

**Next:** We'll define validation rules.</output>

---

## MENU

<ask>[C] Continue to 4C-07 (Validation)</ask>

---

## EXAMPLE OUTPUT

```yaml
page_states:
  default:
    trigger: 'Page loads normally'
    appearance: 'Empty form ready for input'
    actions: 'User can fill form and submit'

  loading:
    trigger: 'After submit clicked'
    appearance: 'Submit button shows spinner, form disabled'
    actions: 'Wait for response'

  error:
    trigger: 'Authentication fails'
    appearance: 'Error message above form, submit button re-enabled'
    actions: 'User can retry with different credentials'

  success:
    trigger: 'Authentication succeeds'
    appearance: 'Brief success message'
    actions: 'Redirect to dashboard'

component_states:
  signin-form-email-input:
    default:
      appearance: 'Gray border, placeholder text'
    focus:
      appearance: 'Primary color border, label floats up'
    filled:
      appearance: 'Dark border, label stays up'
    error:
      appearance: 'Red border, error message below'
    disabled:
      appearance: 'Light gray background, cursor not-allowed'

  signin-form-submit-button:
    default:
      appearance: 'Primary color background, white text'
    hover:
      appearance: 'Darker primary color'
    active:
      appearance: 'Even darker, slight scale down'
    loading:
      appearance: "Spinner icon, text 'Signing in...'"
    disabled:
      appearance: 'Gray background, lower opacity'
```

---

## NEXT STEP

Load `substeps/4c-07-validation.md`
