# Substep 4C-07: Validation & Errors

**Goal:** Define all validation rules and error messages

---

## EXECUTION

<output>**Let's define validation rules and error messages.**

This ensures users get helpful feedback.</output>

## VALIDATION RULES

<ask>**What fields or inputs need validation?**

For each field, specify:

- What makes it valid?
- What makes it invalid?
- When is it validated? (on blur, on submit, real-time?)</ask>

<action>For each validated field:
<ask>**{{field_name}}** validation:

- Required: yes/no
- Format rules:
- Length limits:
- Custom rules:
- Validation timing:
  </ask>

<action>Store validation_rules for field</action>
</action>

## ERROR MESSAGES

<output>**Now let's define error messages for each validation failure.**

We'll provide messages in all supported languages.</output>

<action>For each validation rule:
<ask>**Error message when {{rule_name}} fails:**

{{#each language}}

- {{language}}:
  {{/each}}

Error code (e.g., ERR_EMAIL_INVALID):
</ask>

<action>Store error_message with code and translations</action>
</action>

<output>✅ **Validation and errors defined!**

**Validated fields:** {{validated_field_count}}
**Error messages:** {{error_message_count}}

**Next:** We'll generate the complete specification document.</output>

---

## MENU

<ask>[C] Continue to 4C-08 (Generate Specification)</ask>

---

## EXAMPLE OUTPUT

```yaml
validation_rules:
  email_input:
    required: true
    format: 'valid email format'
    timing: 'on_blur and on_submit'
    rules:
      - 'Must contain @'
      - 'Must have domain'
      - 'No spaces allowed'

  password_input:
    required: true
    min_length: 8
    timing: 'on_submit'
    rules:
      - 'At least 8 characters'
      - 'Not empty'

error_messages:
  ERR_EMAIL_REQUIRED:
    en: 'Email address is required'
    sv: 'E-postadress krävs'
    field: 'email_input'

  ERR_EMAIL_INVALID:
    en: 'Please enter a valid email address'
    sv: 'Ange en giltig e-postadress'
    field: 'email_input'

  ERR_PASSWORD_REQUIRED:
    en: 'Password is required'
    sv: 'Lösenord krävs'
    field: 'password_input'

  ERR_PASSWORD_TOO_SHORT:
    en: 'Password must be at least 8 characters'
    sv: 'Lösenordet måste vara minst 8 tecken'
    field: 'password_input'

  ERR_AUTH_INVALID:
    en: 'Invalid email or password'
    sv: 'Ogiltig e-post eller lösenord'
    severity: 'critical'
    display_location: 'above_form'
```

---

## NEXT STEP

Load `substeps/4c-08-generate-spec.md`
