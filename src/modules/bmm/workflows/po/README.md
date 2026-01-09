# Product Owner Quick Start Guide

Welcome! This guide helps you get started with BMAD's Product Owner tools in Claude Desktop.

---

## What Can You Do?

As a PO, you can:

| Task | Command | What It Does |
|------|---------|--------------|
| **See your inbox** | `/my-tasks` or `MT` | What PRDs/Epics need your attention |
| **Create a PRD** | `/create-prd` or `CP` | Start a new Product Requirements Document |
| **View all PRDs** | `/prd-dashboard` or `PD` | See status of all PRDs |
| **Get feedback** | `/open-feedback` or `OF` | Request stakeholder feedback on a PRD |
| **Process feedback** | `/synthesize` or `SZ` | Use AI to merge feedback into new version |
| **Get approval** | `/request-signoff` or `RS` | Move PRD to approval phase |
| **Create stories** | `/new-story` or `NS` | Create a new user story |
| **View sprint** | `/dashboard` or `DS` | See sprint progress |

Just type any command (like `MT` or `/my-tasks`) and Claude will guide you through it.

---

## Your First PRD: A 5-Step Walkthrough

### Step 1: Create a PRD Draft

```
You: Create a new PRD for user authentication
Claude: [Walks you through creating the PRD with sections for vision, goals, requirements, etc.]
```

Or use the command: `/create-prd`

### Step 2: Request Feedback

Once your draft is ready:

```
You: Open feedback on the auth PRD
Claude: [Sets deadline, notifies stakeholders, opens feedback round]
```

Stakeholders will get notified (via GitHub @mention, Slack, or email depending on your setup).

### Step 3: Check Feedback Status

After a day or two:

```
You: Show me feedback on the auth PRD
Claude: [Shows all feedback organized by section and type, highlights conflicts]
```

### Step 4: Synthesize Feedback

When you have enough feedback:

```
You: Synthesize feedback for auth PRD
Claude: [AI processes all feedback, proposes changes with rationale, you accept/reject each]
```

This creates version 2 of your PRD with all accepted changes.

### Step 5: Get Sign-off

When the PRD is ready for approval:

```
You: Request sign-off on auth PRD
Claude: [Notifies stakeholders, tracks who approved/blocked]
```

---

## Everyday Commands

### Morning Check-in

```
You: What needs my attention?
```

This shows you:
- PRDs waiting for your review
- Epics needing feedback synthesis
- Stories ready for approval
- Any blocked items

### Quick Status Check

```
You: Show PRD dashboard
```

See all PRDs at a glance:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PRD PORTFOLIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Draft:     2 PRDs
💬 Feedback:  3 PRDs (collecting input)
✍️ Sign-off:  2 PRDs (awaiting approval)
✅ Approved:  8 PRDs (this quarter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Sprint Management

```
You: Show sprint dashboard
You: Create a new story for epic 2
You: Approve story 2-5-auth
```

---

## Understanding Feedback Types

When stakeholders give feedback, they categorize it:

| Type | Meaning | Example |
|------|---------|---------|
| 🔍 **Clarification** | Something is unclear | "What happens if session expires?" |
| ⚠️ **Concern** | Potential problem | "This might conflict with GDPR" |
| 💡 **Suggestion** | Improvement idea | "Consider adding biometric auth" |
| ➕ **Addition** | Missing requirement | "Need audit logging" |
| ⚖️ **Priority** | Order disagreement | "MFA should be MVP, not phase 2" |

---

## Sign-off Options

Stakeholders can:
- ✅ **Approve** - No concerns
- ✅📝 **Approve with Note** - Minor comment, still approves
- 🚫 **Block** - Cannot approve, has blocker (returns to feedback)

---

## Tips for Success

1. **Start small** - Try `/my-tasks` first to see what's in flight
2. **Natural language works** - Just describe what you want; you don't need exact commands
3. **Check feedback before synthesizing** - Use `/view-feedback` to see what came in
4. **Iterate** - You can do multiple feedback rounds before sign-off

---

## Getting Help

| Command | What It Does |
|---------|--------------|
| `help` | Show available commands |
| `show me the auth PRD` | Read a specific PRD |
| `what's the status of payments PRD?` | Quick status check |

---

## Optional: GitHub Integration

If your team uses GitHub Issues for coordination:

1. Ask your admin to enable `github_integration_enabled: true` in module.yaml
2. PRD feedback will be tracked in GitHub Issues
3. You'll get @mentions when stakeholders submit feedback
4. Story locks prevent two developers working on the same thing

Without GitHub, everything still works - it just stays local.

---

*For technical details, see: `src/modules/bmm/data/github-integration-config.md`*
