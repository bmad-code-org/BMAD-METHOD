# Module 17: Usability Testing

**Time: 45 min | Agent: Freya | Phase: Validation**

---

## The New Economics of Testing

Usability testing hasn't changed. But everything around it has.

When every phase of design took weeks, a couple of days of testing and a couple of days processing results didn't feel like much. Now, when a complete product can be built in an afternoon, spending two days testing on humans suddenly feels relatively very expensive.

This doesn't make usability testing less valuable. It makes planning more important.

The answer isn't to skip testing. It's to **test early** and **plan ahead**. Line up your test group before you start building. When the prototype is ready, they're ready. No waiting. No scheduling back and forth.

---

## The Whiteport Rule

**If a feature or change isn't worth showing to 5 users and 1 domain expert for feedback, then it's not worth building in the first place.**

This is the simplest filter for what deserves your time. If you can't justify 20 minutes of testing for a feature, ask yourself why you're spending hours building it.

Every feature you ship will be used by real people. If you're not willing to watch 5 of them try it, you're shipping blind.

---

## Spec Conformity Is Not Usability

In Module 14, the agent verifies that the implementation matches the specification — using Puppeteer to check every element, state, and interaction. That's functional testing. It answers: **did we build what we designed?**

Usability testing answers a different question: **did we design the right thing?**

A form can match the spec perfectly and still confuse users. A flow can implement every acceptance criterion and still feel wrong. Numbers pass. Humans struggle.

| What you assumed | What testing reveals |
|------------------|---------------------|
| Users will see the CTA first | Users look at the image, miss the CTA |
| The error message is clear | Users don't understand "invalid format" |
| The flow is intuitive | Users expect "Back" to go to the previous page, not the dashboard |
| Three steps is simple enough | Users abandon at step 2 |

These are things no specification can predict. You have to watch real people use the product.

---

## Test on Their Turf

The gold standard for usability testing is **contextual testing** — testing the product on the user's own devices, in their own environment. At their home. In their office. On their phone, their laptop, their browser.

This gives the most reliable results because the user isn't distracted by being in a test session. They're using a product in context, the way they actually would.

Compared to a lab setting or a video call with screen sharing, contextual testing reveals:

- How the product fits into their real workflow
- What distracts them in their actual environment
- Whether the design works on their specific device and screen size
- Their natural behavior — not their "I'm being tested" behavior

---

## Think-Aloud: The Core Method

### Contextual Think-Aloud

The user talks through what they're doing as they do it:

> "I'm looking for where to sign up... I see this button but I'm not sure if that's it... OK I'll click it... Now it wants my email..."

You observe and take notes. You don't help. You don't guide. You listen.

### Retrospective Think-Aloud

The session is recorded. Afterward, you watch the recording together with the user:

> "Here I was confused because I didn't know if my password was saved. I waited for a confirmation but nothing happened."

Retrospective think-aloud is powerful because the user isn't splitting attention between doing and explaining. They perform naturally first, then reflect.

### Which to Use

| Method | When | Trade-off |
|--------|------|-----------|
| Contextual think-aloud | Quick tests, guerrilla testing | User splits attention between doing and explaining |
| Retrospective think-aloud | Formal sessions, critical flows | Takes longer but gives richer insight |
| Both combined | When you have time | Best results |

---

## Record Everything

Always record the session. Always.

When you're running the test, you're focused on the user — their body language, their hesitation, what they say. You miss things. Recording lets you review the tape and spot what you didn't catch the first time.

A recorded session gives you:

- Exact moments of confusion (timestamp them)
- Quotes you can use to justify design changes
- Evidence for stakeholders who weren't there
- Details you missed because you were watching the user's face, not the screen

---

## Plan Ahead

The biggest usability testing failure is not having testers ready when the prototype is.

**Before you start building:**

1. Identify 3-5 people who match your personas
2. Ask them if they're available for a 20-minute session this week (or next)
3. Get their confirmation

**When the prototype is ready:**

4. Send them the link or visit them
5. Run the test
6. Process results the same day while it's fresh

Total overhead: one message before, one session after. Testing doesn't slow you down — because you planned for it.

---

## When to Test

```
  WDS Stage                     What to Test
  ─────────                     ────────────

  Storyboards ─────────────── Does the flow make sense?
       │                       Are we solving the right problem?
       ▼
  Prototypes ──────────────── Can users complete the task?
       │                       Where do they hesitate?
       ▼
  Production ──────────────── Does it work in the real context?
                               How does it perform with real data?
```

**Prototypes are the sweet spot.** The design is real enough to test, cheap enough to change.

---

## The Freya Method

Freya connects usability findings to your design strategy:

> "Three of five users struggled to find the registration link. This connects to Felix's driving force — he needs simple paths with no hunting."

> "Users understood the error messages but didn't know how to fix the problem. The spec tells them what's wrong but not what to do."

> "The flow works technically, but users feel uncertain at step 2. They need a progress indicator or reassurance."

She maps observations to personas, driving forces, and business goals — turning individual findings into design decisions.

---

## What You'll Learn

### Lesson 1: The Test Scenario

How to prepare for a usability test — picking the flow, writing tasks that reveal real behavior, selecting participants, preparing materials, and creating the test scenario document.

### Lesson 2: Conducting the Test

How to run the session — presenting the same information to every participant, observing in silence, deflecting questions, recording everything, and using the retrospective replay to unlock deeper insights.

### Lesson 3: Acting on Findings

How to review recordings, document usability issues, connect them back to specifications and trigger maps, prioritize what to fix, and feed learning into the next iteration.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No testers lined up when prototype is ready | Plan ahead — recruit before you start building |
| Testing in a lab or conference room | Go to their environment, their devices |
| Helping users when they struggle | Observe silently — the struggle is the data |
| Not recording | Always record, you'll miss things live |
| Asking "do you like it?" | Watch behavior, don't ask for opinions |
| Fixing symptoms | Trace issues to root causes in specifications |
| Testing too much at once | One flow per session, 3-5 tasks maximum |

---

## Practice

Pick one flow from your project:

1. Define 3 tasks a user should be able to complete
2. Find one person who matches your persona
3. Give them the prototype on their own device
4. Watch them attempt the tasks — don't help
5. Record the session
6. Review the recording — what did you miss the first time?

---

## Lessons

### [Lesson 1: The Test Scenario](lesson-01-spec-verification.md)
Preparing everything before the user arrives

### [Lesson 2: Conducting the Test](lesson-02-test-results.md)
The session, the silence, and the replay

### [Lesson 3: Acting on Findings](lesson-03-acting-on-findings.md)
Turning observations into design improvements

---

## Tutorial

### [Tutorial 17: Plan Your Usability Test](tutorial-17.md)
Hands-on guide to preparing and running a usability test session

---

## Next Module

**[Module 18: Product Evolution →](../module-18-product-evolution/module-18-product-evolution-overview.md)**

Products don't end at launch.

---

*Part of the WDS Course: From Designer to Linchpin*
