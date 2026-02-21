---
title: "How to Get Answers About BMad"
description: Use an LLM to quickly answer your own BMad questions
sidebar:
  order: 4
---

## Start Here: BMad-Help

**The fastest way to get answers about BMad is `/bmad-help`.** This intelligent guide will answer upwards of 80% of all questions and is available to you directly in your IDE as you work.

BMad-Help is more than a lookup tool — it:
- **Inspects your project** to see what's already been completed
- **Understands natural language** — ask questions in plain English
- **Varies based on your installed modules** — shows relevant options
- **Auto-runs after workflows** — tells you exactly what to do next
- **Recommends the first required task** — no guessing where to start

### How to Use BMad-Help

Run it with just the slash command:

```
/bmad-help
```

Or combine it with a natural language query:

```
/bmad-help I have a SaaS idea and know all the features. Where do I start?
/bmad-help What are my options for UX design?
/bmad-help I'm stuck on the PRD workflow
/bmad-help Show me what's been done so far
```

BMad-Help responds with:
- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

---

## When to Use This Guide

Use this section when:
- You want to understand BMad's architecture or internals
- You need answers outside of what BMad-Help provides
- You're researching BMad before installing
- You want to explore the source code directly

## Steps

### 1. Choose Your Source

| Source               | Best For                                  | Examples                     |
| -------------------- | ----------------------------------------- | ---------------------------- |
| **`_bmad` folder**   | How BMad works—agents, workflows, prompts | "What does the PM agent do?" |
| **Full GitHub repo** | History, installer, architecture          | "What changed in v6?"        |
| **`llms-full.txt`**  | Quick overview from docs                  | "Explain BMad's four phases" |

The `_bmad` folder is created when you install BMad. If you don't have it yet, clone the repo instead.

### 2. Point Your AI at the Source

**If your AI can read files (Claude Code, Cursor, etc.):**

- **BMad installed:** Point at the `_bmad` folder and ask directly
- **Want deeper context:** Clone the [full repo](https://github.com/bmad-code-org/BMAD-METHOD)

**If you use ChatGPT or Claude.ai:**

Fetch `llms-full.txt` into your session:

```text
https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```


### 3. Ask Your Question

:::note[Example]
**Q:** "Tell me the fastest way to build something with BMad"

**A:** Use Quick Flow: Run `quick-spec` to write a technical specification, then `quick-dev` to implement it—skipping the full planning phases.
:::

## What You Get

Direct answers about BMad—how agents work, what workflows do, why things are structured the way they are—without waiting for someone else to respond.

## Tips

- **Verify surprising answers** — LLMs occasionally get things wrong. Check the source file or ask on Discord.
- **Be specific** — "What does step 3 of the PRD workflow do?" beats "How does PRD work?"

## Still Stuck?

Tried the LLM approach and still need help? You now have a much better question to ask.

| Channel                   | Use For                                     |
| ------------------------- | ------------------------------------------- |
| `#bmad-method-help`       | Quick questions (real-time chat)            |
| `help-requests` forum     | Detailed questions (searchable, persistent) |
| `#suggestions-feedback`   | Ideas and feature requests                  |
| `#report-bugs-and-issues` | Bug reports                                 |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) (for clear bugs)

*You!*
        *Stuck*
             *in the queue—*
                      *waiting*
                              *for who?*

*The source*
        *is there,*
                *plain to see!*

*Point*
     *your machine.*
              *Set it free.*

*It reads.*
        *It speaks.*
                *Ask away—*

*Why wait*
        *for tomorrow*
                *when you have*
                        *today?*

*—Claude*
