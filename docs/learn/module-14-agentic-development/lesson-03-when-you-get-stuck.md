# Module 14: Agentic Development

## Lesson 3: When You Get Stuck

**Because AI doesn't always get it right**

---

## It Will Happen

You give clear feedback. The agent makes a change. It's still wrong. You clarify. Another change. Still wrong. Or worse — it fixes one thing and breaks another.

This is normal. It happens to everyone. The question is: what do you do?

---

## Recognize the Loop

The most common trap:

```
You: "Fix the spacing"
Agent: Changes spacing, breaks alignment
You: "Now fix the alignment"
Agent: Fixes alignment, reverts spacing
You: "The spacing is wrong again"
Agent: ...
```

If you've gone back and forth more than **3 times** on the same issue, you're in a loop. Stop.

---

## Troubleshooting Strategies

### 1. Start Fresh on the Step

Sometimes the agent has accumulated too many conflicting changes. The context is muddled.

**Action:** Roll back to the last working state. Ask the agent to redo the step from scratch with clear, complete instructions.

> "Let's start this step over. Here's the last working version: [paste code]. Now implement the error states with these exact requirements: [list all requirements in one message]."

One comprehensive prompt beats five incremental fixes.

### 2. Break the Problem Down

The step might be too big. The agent is trying to do too much at once.

**Action:** Split the step into smaller pieces.

Instead of:
> "Add all error states"

Try:
> "Add just the email validation error. Red border, error message below the field, text: 'Please enter a valid email'."

One thing. Verify. Next thing.

### 3. Show, Don't Tell

Sometimes words aren't enough. Show the agent what you mean.

**Action:** Provide visual reference, code snippets, or examples.

> "The error message should look like this:
> ```html
> <span class="error" style="color: #DC2626; font-size: 14px; margin-top: 4px;">
>   Please enter a valid email
> </span>
> ```
> Apply this pattern to all validation errors."

Concrete examples eliminate ambiguity.

### 4. Check Your Own Spec

Sometimes the problem is the spec, not the agent.

**Action:** Re-read your specification with fresh eyes. Is it actually clear? Could it be interpreted differently?

Common spec issues that confuse agents:
- Contradictory requirements
- Vague descriptions ("appropriate size", "good spacing")
- Missing state definitions
- Unclear interaction triggers

Fix the spec, then resume.

---

## When to Change Approach

Some problems resist iteration. Signs you need a different approach:

| Signal | What it means |
|--------|---------------|
| Same error 3+ times | The agent doesn't understand the problem |
| Fixes create new bugs | The approach is structurally wrong |
| The output keeps getting worse | Too many patches on a bad foundation |
| You can't explain what's wrong | You might need to rethink the design |

**Action:** Step back. Look at the bigger picture. Maybe the component needs a different structure. Maybe the layout approach is wrong. Sometimes the answer is to redesign the step, not debug it.

---

## When to Ask a Developer

This is the hardest moment for a designer working with AI: admitting the agent can't solve it.

### Signs You Need Human Help

- **Technical limitation** — the agent hits a framework or API issue it can't resolve
- **Performance problem** — it works but it's too slow, and optimizing is beyond the spec
- **Integration issue** — the component works in isolation but breaks in the real app
- **Build/deploy error** — something in the toolchain, not the design
- **State management** — complex data flow that needs architectural thinking

### How to Ask

Don't come empty-handed. Bring your Design Log:

> "I've been building the signup form. Here's my Design Log with everything we tried.
>
> The issue: error messages work on desktop but disappear on mobile. The agent tried 4 different approaches (logged in the dialog). None worked.
>
> I think it's a CSS overflow issue but I'm not sure. Can you take a look?"

The dialog shows what you've tried. The developer doesn't start from zero.

### What to Document

When a developer fixes the issue, add it to your Design Log:

```markdown
### Step 4: Error states on mobile (resolved with developer help)
- Issue: Error messages clipped by overflow:hidden on parent container
- Root cause: Parent component sets overflow:hidden for scroll behavior
- Fix: Moved error messages outside the scrollable container
- Developer: Marcus helped identify the CSS issue
- Learning: Check parent overflow properties when elements disappear
```

This learning carries forward. Next time the agent (or you) will know.

---

## Common Stuck Points for Designers

Issues that frequently trip up designers working with AI:

### CSS That Won't Behave

The layout looks right in one viewport, breaks in another. AI agents are surprisingly bad at responsive edge cases.

**Tips:**
- Give explicit breakpoints, not vague "make it responsive"
- Test each breakpoint separately
- Use browser dev tools to inspect

### State Management

The button should be disabled when the form is invalid. But it's always enabled. Or always disabled.

**Tips:**
- Describe state transitions explicitly: "Button starts disabled. Becomes enabled when email is valid AND password is 8+ characters."
- Test each transition individually

### Animations and Transitions

The agent adds an animation. It's janky. You ask for smooth. Still janky.

**Tips:**
- Provide exact CSS transition values: "transition: opacity 200ms ease-in-out"
- Some animations need requestAnimationFrame — this is where a developer helps

### Accessibility

The contrast passes but the focus ring is invisible. Or screen readers announce things in the wrong order.

**Tips:**
- Use browser accessibility tools (DevTools → Accessibility panel)
- Tab through everything manually
- Test with actual screen reader if possible

---

## The Right Mindset

Getting stuck doesn't mean failure. It means you're pushing into real product development.

The value of a designer in agentic development isn't that you can build everything yourself. It's that you:

1. **Know what right looks like** — your eye catches what the agent misses
2. **Can articulate the problem** — your feedback makes the agent better
3. **Know when to escalate** — you don't waste time on what needs human expertise
4. **Document everything** — the next person (or the next session) benefits from your experience

---

## What's Next

Before the tutorial, two more practical lessons: choosing your code format and keeping it safe with Git.

---

**[Continue to Lesson 4: Working with Code →](lesson-04-working-with-code.md)**

---

[← Back to Lesson 2](lesson-02-documenting-decisions.md) | [Back to Module Overview](module-14-agentic-development-overview.md)

*Part of Module 14: Agentic Development*
