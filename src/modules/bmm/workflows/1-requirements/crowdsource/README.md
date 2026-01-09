# Stakeholder Quick Start Guide

Welcome! This guide helps team members (developers, designers, tech leads, etc.) participate in PRD and Epic reviews using Claude Desktop.

---

## What Can You Do?

As a stakeholder, you can:

| Task | Command | What It Does |
|------|---------|--------------|
| **See your inbox** | `/my-tasks` or `MT` | What PRDs/Epics need your input |
| **Give feedback** | `/submit-feedback` or `SF` | Add feedback to a PRD or Epic |
| **Sign off** | `/signoff` or `SO` | Approve or block a PRD/Epic |
| **View feedback** | `/view-feedback` or `VF` | See what others have said |

---

## Your Typical Workflow

### 1. Check What Needs Your Input

```
You: What needs my attention?
```

Claude shows:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MY TASKS - @yourname
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 URGENT (Deadline Soon)
  • prd:payments-v2 → Sign-off needed (Tomorrow!)
  • prd:user-auth → Feedback needed (2 days)

📋 PENDING
  • epic:3-mobile → Feedback needed (5 days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Give Feedback

```
You: I want to give feedback on the auth PRD
```

Claude will:
1. Show you the current PRD
2. Ask which section you're commenting on
3. Ask your feedback type (concern, suggestion, etc.)
4. Help you write clear feedback
5. Submit it to the PO

### 3. Sign Off When Ready

After feedback is synthesized:

```
You: Sign off on auth PRD
```

Options:
- ✅ **Approve** - Looks good!
- ✅📝 **Approve with note** - Minor comment, still approving
- 🚫 **Block** - Can't approve until X is fixed

---

## Feedback Types

When giving feedback, pick the type that fits:

| Type | When to Use | Example |
|------|-------------|---------|
| 🔍 **Clarification** | Something is unclear | "What happens if the user closes mid-flow?" |
| ⚠️ **Concern** | You see a potential problem | "This conflicts with our API rate limits" |
| 💡 **Suggestion** | You have an improvement idea | "Could we add a 'remember me' checkbox?" |
| ➕ **Addition** | Something is missing | "Need to specify error messages" |
| ⚖️ **Priority** | You disagree with priority/scope | "OAuth should be phase 1, not phase 2" |

---

## Good Feedback Examples

### ❌ Vague
> "The login section needs work"

### ✅ Specific
> "FR-3 (Session Management): Unclear what happens when session expires during a payment. Should we save cart and redirect to login?"

### ❌ Just a complaint
> "This is too complicated"

### ✅ Actionable
> "US-4 (Password Reset): Consider splitting into two stories - (1) basic reset via email, (2) phone/SMS reset. Current scope may be too large for one sprint."

---

## Blocking vs Concerns

**Block** when:
- Security vulnerability would ship
- Legal/compliance requirement is missing
- Technical impossibility that must be resolved

**Concern** (but still approve) when:
- "Nice to have" improvement
- Minor clarification needed
- Stylistic preference

The PO can't proceed to implementation while blocks exist.

---

## FAQs

**Q: Do I have to respond to every PRD?**
A: Only if you're listed as a stakeholder. Check `/my-tasks` to see what needs you.

**Q: What if I miss the deadline?**
A: The PO can still proceed, but late feedback may require a new revision cycle.

**Q: Can I see what others said?**
A: Yes! Use `/view-feedback` to see all feedback and identify conflicts.

**Q: What if I agree with someone else's feedback?**
A: You can add supporting feedback, but don't duplicate. The synthesis step will group similar feedback.

---

## Quick Reference

| Say This... | To Do This... |
|-------------|---------------|
| "What needs my attention?" | Check your inbox |
| "Give feedback on auth PRD" | Add feedback |
| "What did others say about auth?" | View all feedback |
| "Sign off on payments PRD" | Submit approval |
| "Block auth PRD" | Submit with blocker |

---

*For PO-specific tasks (creating PRDs, synthesizing feedback), see the PO Quick Start Guide.*
