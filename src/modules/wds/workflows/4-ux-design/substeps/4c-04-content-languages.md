# Substep 4C-04: Content & Languages

**Goal:** Specify all text content in all supported languages

---

## EXECUTION

<ask>**What languages does this page support?**

List all languages (e.g., English, Swedish, Spanish):</ask>

<action>Store supported_languages array</action>

<output>**Now let's specify all text content.**

We'll go through each text element and provide content in all {{language_count}} languages.</output>

<action>For each text element (labels, buttons, headings, messages):
<ask>**{{element_name}}:**

{{#each language}}

- {{language}}:
  {{/each}}
  </ask>

<action>Store multilingual content for element</action>
</action>

<output>✅ **Content specified in all languages!**

**Languages:** {{languages_list}}
**Text elements:** {{text_element_count}}

**Next:** We'll define interactions and behaviors.</output>

---

## MENU

<ask>[C] Continue to 4C-05 (Interactions)</ask>

---

## EXAMPLE OUTPUT

```yaml
supported_languages:
  - English
  - Swedish

content:
  page_title:
    en: 'Sign In'
    sv: 'Logga In'

  email_label:
    en: 'Email Address'
    sv: 'E-postadress'

  email_placeholder:
    en: 'your@email.com'
    sv: 'din@epost.com'

  password_label:
    en: 'Password'
    sv: 'Lösenord'

  submit_button:
    en: 'Sign In'
    sv: 'Logga In'

  forgot_password_link:
    en: 'Forgot password?'
    sv: 'Glömt lösenord?'
```

---

## NEXT STEP

Load `substeps/4c-05-interactions.md`
