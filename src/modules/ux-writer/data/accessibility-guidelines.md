# Accessibility Guidelines for UX Writing

Writing accessible content ensures all users—including those using assistive technology, experiencing cognitive differences, or facing situational limitations—can understand and interact with your product.

## Core Principles

### 1. Perceivable
Users must be able to perceive the information being presented.

**For UX Writers:**
- Provide text alternatives for non-text content
- Don't rely on color alone to convey meaning
- Ensure sufficient color contrast (WCAG AA: 4.5:1 for body text, 3:1 for large text)
- Write clear, descriptive labels for all interactive elements

### 2. Operable
Users must be able to operate the interface.

**For UX Writers:**
- Write clear button labels that describe the action
- Provide skip links for navigation ("Skip to main content")
- Write descriptive link text (not "click here")
- Use consistent terminology for navigation

### 3. Understandable
Users must be able to understand the information and interface.

**For UX Writers:**
- Use plain language (7th-8th grade reading level)
- Keep sentences short (8-14 words for critical content)
- Define technical terms on first use
- Provide clear instructions and error messages

### 4. Robust
Content must work with current and future assistive technologies.

**For UX Writers:**
- Write proper labels for form fields
- Structure content with clear headings
- Use semantic HTML-friendly language
- Ensure error messages are programmatically associated with fields

---

## Screen Reader Optimization

### How Screen Readers Work
Screen readers announce content linearly, reading:
1. Element type (button, link, heading, form field)
2. Label or text content
3. State (expanded, collapsed, selected, required)

### Writing for Screen Readers

**Buttons**
- ❌ Poor: "Submit" (context missing)
- ✅ Good: "Submit application"
- ✅ Better: "Submit job application"

**Links**
- ❌ Poor: "Click here to learn more"
- ❌ Poor: "Read more" (about what?)
- ✅ Good: "Learn about our privacy policy"
- ✅ Good: "View pricing details"

**Form Fields**
- ❌ Poor: Placeholder text as only label
- ✅ Good: Visible label + optional placeholder
- ✅ Example: Label: "Email address", Placeholder: "name@example.com"

**Error Messages**
Screen readers read the field label + error message together, so write errors that make sense in that context.
- ❌ Poor: "Invalid" (announced as "Email address, invalid")
- ✅ Good: "Must include @" (announced as "Email address, must include @")
- ✅ Better: "Email must include @" (complete sentence)

**Images and Icons**
- Write meaningful alt text that conveys purpose
- ❌ Poor: "image.png"
- ❌ Poor: "icon"
- ✅ Good: "Success" (for checkmark icon)
- ✅ Good: "Error: Payment failed" (for error icon)

**ARIA Labels**
Use ARIA labels when visual context isn't available to screen readers:
- Search button with only magnifying glass icon: aria-label="Search"
- Close button with only X icon: aria-label="Close dialog"
- Social media links with only icons: aria-label="Visit us on Twitter"

---

## Cognitive Accessibility

### Comprehension Research
- **8 words or fewer**: 100% comprehension
- **14 words or fewer**: 90% comprehension
- **25+ words**: Comprehension drops significantly

### Best Practices

**Keep Sentences Short**
- Critical instructions: 8-14 words maximum
- Error messages: 12-18 words (including solution)
- General content: 15-20 words average
- Complex explanations: Break into multiple short sentences

**Use Simple Language**
- Choose common words over complex ones
  - ❌ "Utilize" → ✅ "Use"
  - ❌ "Purchase" → ✅ "Buy"
  - ❌ "Terminate" → ✅ "End"
- Avoid jargon unless your audience expects it
- Define technical terms on first use

**Create Scannable Content**
- Use clear headings (H1, H2, H3 hierarchy)
- Break content into short paragraphs (3-4 lines max)
- Use bulleted lists for related items
- Front-load important information

**Provide Consistent Patterns**
- Use the same words for the same actions
- Place elements in predictable locations
- Follow established UI patterns
- Reduce cognitive load in high-stress moments (errors, confirmations)

**Reduce Memory Load**
- Don't make users remember information from previous screens
- Repeat critical information when needed
- Provide context at the point of action
- Use progressive disclosure for complex flows

---

## Plain Language Guidelines

### Reading Level Targets

**General Public**
- Target: 7th-8th grade (Flesch-Kincaid)
- Sentence length: 15-20 words average
- Word choice: Common, everyday words

**Professional Tools**
- Target: 9th-10th grade
- Sentence length: 20-25 words maximum
- Word choice: Industry terms okay if audience expects them

**Technical Products**
- Target: 10th-11th grade
- Sentence length: 25 words maximum
- Word choice: Technical terms with clear definitions

### Plain Language Techniques

**Active Voice (85% of the time)**
- ❌ Passive: "Your account was created"
- ✅ Active: "We created your account"
- ❌ Passive: "Payment will be processed"
- ✅ Active: "We'll process your payment"

**Concrete Verbs**
- ❌ Weak: "Make a selection"
- ✅ Strong: "Choose"
- ❌ Weak: "Provide notification"
- ✅ Strong: "Notify"

**Positive Framing**
- ❌ Negative: "Don't forget to save"
- ✅ Positive: "Remember to save"
- ❌ Negative: "You can't proceed without..."
- ✅ Positive: "To proceed, please..."

**Avoid Idioms and Metaphors**
These don't translate well and confuse non-native speakers:
- ❌ "Get the ball rolling"
- ❌ "Think outside the box"
- ❌ "Hit the ground running"
- ✅ Use literal language instead

---

## Multi-Modal Communication

### Don't Rely on Color Alone

**Bad Example:**
- Red text: "Email"
- (Users with color blindness can't distinguish the error)

**Good Example:**
- "Error: Email must include @" + red icon
- (Text provides meaning independent of color)

### Redundant Cues

Provide multiple ways to perceive important information:

**Status Messages**
- Color + icon + text
- Example: Green checkmark + "Success: Changes saved"

**Required Fields**
- Asterisk + "required" label + error on submission
- Example: "Email address *" with note "* Required field"

**Error States**
- Color + icon + error message + border
- Example: Red border + error icon + "Email must include @"

**Links vs Plain Text**
- Color + underline (or other visual distinction)
- Ensure 3:1 contrast ratio between link and body text

---

## Forms and Input Accessibility

### Labels

**Always Visible**
- Don't hide labels on focus
- Don't use placeholder as only label
- Keep labels adjacent to fields

**Clear and Descriptive**
- ❌ Poor: "Name"
- ✅ Good: "Full name"
- ✅ Better: "Full name (as it appears on your ID)"

### Instructions

**Provide Before Input**
- Explain requirements before user types
- Keep instructions visible as user completes field

**Be Specific**
- ❌ Vague: "Enter valid email"
- ✅ Specific: "Email must include @"
- ✅ Example: "Email (you@example.com)"

### Error Messages

**Pattern: [What's wrong]. [How to fix].**
- ❌ "Invalid"
- ❌ "Error"
- ✅ "Email must include @"
- ✅ "Password must be at least 8 characters"

**Timing**
- Inline validation: Show after user completes field
- Form-level: Show on submit, with focus moved to first error
- Real-time: Only for format requirements (password strength)

**Location**
- Place error message near the field (above or below)
- Ensure screen readers announce error with field label
- Maintain error message while user corrects input

---

## Writing for Translation

### Keep It Simple
- Short sentences translate more accurately
- Simple grammar reduces translation errors
- Common words have clearer equivalents

### Avoid Culturally-Specific References
- ❌ "Home run" (baseball reference)
- ❌ "The ball is in your court" (idiom)
- ❌ "During the holidays" (varies by culture)
- ✅ Use universal concepts

### Plan for Text Expansion
Text expands in translation:
- German: +30-40%
- French/Spanish: +15-20%
- Italian/Portuguese: +20-25%

**Design Implications:**
- Buttons: Allow for 150-200% text expansion
- Titles: Plan for 130-150% expansion
- Character limits: Test with longest likely translation

### Gender-Neutral Language
- Use "they/them" for unknown subjects
- Avoid gendered job titles
  - ❌ "Policeman" → ✅ "Police officer"
  - ❌ "Stewardess" → ✅ "Flight attendant"
- Structure sentences to avoid gender assumptions

---

## High-Stress Context Accessibility

Users experiencing stress, frustration, or urgency have reduced cognitive capacity.

### Error Messages
- **Be immediately clear**: State the problem upfront
- **Provide quick recovery**: One-step solution when possible
- **Avoid blame**: Never use judgmental language
- **Stay calm**: Reassuring tone without being condescending

### Time-Sensitive Actions
- **Clear deadlines**: Specific times, not "soon"
- **Visible countdown**: "5 minutes remaining"
- **Obvious actions**: Bold, clear CTAs

### High-Stakes Decisions
- **Transparent consequences**: "You'll lose all data"
- **Reversibility**: State if action can be undone
- **Easy exit**: Clear "Cancel" or "Go back" options

---

## Testing for Accessibility

### Automated Tools
- **WAVE**: Web accessibility evaluation tool
- **axe DevTools**: Browser extension for accessibility testing
- **Lighthouse**: Built into Chrome DevTools

### Manual Testing

**Screen Reader Test**
- Turn on VoiceOver (Mac) or NVDA (Windows)
- Navigate using keyboard only
- Verify all content is announced meaningfully
- Check that error messages are clear when announced

**Readability Test**
- Hemingway Editor: Highlights complex sentences
- Readable.com: Multiple readability scores
- Microsoft Word: Flesch-Kincaid scoring

**Color Contrast Test**
- WebAIM Contrast Checker
- Verify 4.5:1 for body text
- Verify 3:1 for large text and UI elements

**Keyboard Navigation Test**
- Unplug your mouse
- Complete all tasks using only keyboard
- Verify all interactive elements are reachable
- Check that focus order is logical

---

## Quick Reference Checklist

### Before Publishing Any UX Text

- [ ] All interactive elements have clear, descriptive labels
- [ ] Links describe destination ("View pricing" not "Click here")
- [ ] Error messages are specific and actionable
- [ ] Color is not the only indicator of meaning
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Sentences average 15-20 words or fewer
- [ ] Reading level is appropriate for audience
- [ ] No idioms, metaphors, or cultural references
- [ ] Required fields are marked with more than just color
- [ ] Form instructions appear before input fields
- [ ] Success and error states include text, not just icons

---

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG Success Criteria](https://www.w3.org/WAI/WCAG21/Understanding/)

### Testing Tools
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [Hemingway Editor](http://hemingwayapp.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Plain Language
- [PlainLanguage.gov](https://www.plainlanguage.gov/)
- [Readable.com](https://readable.com/)

### Screen Readers
- VoiceOver (Mac/iOS): Built-in
- NVDA (Windows): Free download
- JAWS (Windows): Commercial

---

**Remember**: Accessibility isn't a feature—it's a baseline requirement. Writing accessibly makes your product better for everyone, not just users with disabilities.
