# Error Message Template

Use this template to write clear, actionable error messages that help users recover.

## Structure

```
[What failed] [Why it might have failed, if known] [What to do next]
```

## Template

### Inline Error (Form Validation)
**Format**: Brief, immediate correction guidance

```
[Field requirement or constraint]
```

**Examples:**
- Email must include @
- Password needs 8+ characters
- Card number is incomplete
- Choose a future date

---

### Detour Error (Recoverable Problem)
**Format**: Problem + Solution

```
**Title**: [Action that failed]
**Body**: [Brief explanation]. [Recovery instruction].
**Button**: [Specific recovery action]
```

**Example:**
```
**Title**: Can't save changes
**Body**: Check your internet connection and try again.
**Button**: Retry
```

---

### Blocking Error (System Issue)
**Format**: Clear explanation + Timeline + Reassurance

```
**Title**: [What's unavailable]
**Body**: [Why it's unavailable]. [When it will be available]. [Reassurance about user data].
**Button**: [Status check or alternative action]
```

**Example:**
```
**Title**: Service temporarily unavailable  
**Body**: We're updating our systems and will be back in about 15 minutes. Your data is safe.
**Button**: Check status
```

---

## Error Message Checklist

Before finalizing an error message, verify:

- [ ] **Avoids blame** — No "invalid," "illegal," "wrong," "error"
- [ ] **Empathetic tone** — Acknowledge user frustration
- [ ] **Specific problem** — Not generic "something went wrong"
- [ ] **Clear recovery** — Tell user exactly what to do
- [ ] **Front-loaded** — Most important info first
- [ ] **Active voice** — "We couldn't save" not "changes could not be saved"
- [ ] **Human language** — Not system codes or technical jargon

## Voice Variations by Context

### High-Stakes Error (Payment, Security, Data Loss)
**Tone**: Serious, clear, reassuring

```
We couldn't process your payment. Your card wasn't charged. Check your card details and try again.
```

### Low-Stakes Error (Optional Feature, Nice-to-Have)
**Tone**: Light, helpful, not dramatic

```
Couldn't load preview. Refresh to try again.
```

### First-Time User Error
**Tone**: Educational, patient

```
Profile photo must be under 5MB. Try a smaller file or compress your image.
```

## Common Mistakes to Avoid

❌ **Vague**: "An error occurred"
✅ **Specific**: "We couldn't save your changes"

❌ **Blaming**: "Invalid email address"
✅ **Guiding**: "Email must include @"

❌ **Technical**: "ERR_CONNECTION_TIMEOUT"
✅ **Human**: "Connection timed out. Check your internet and try again."

❌ **No solution**: "Upload failed"
✅ **Actionable**: "Upload failed. Check your file size and try again."

❌ **Passive**: "Your request could not be processed"
✅ **Active**: "We couldn't process your request"

## Quick Fill Template

Use this for rapid error message drafting:

**What failed:**
**Why (if known):**
**What user should do:**

**Draft:**
[What failed]. [Why, if known]. [Next action].

**Example filled:**
- What failed: Couldn't send invite
- Why: Email bounced
- What to do: Check spelling

Draft: "Couldn't send invite. Check the email address and try again."
