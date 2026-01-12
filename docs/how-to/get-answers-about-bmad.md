---
title: "How to Get Answers About BMad"
description: Use an LLM to quickly answer your own BMad questions
---

Point an LLM at BMad's source files and ask your question. That's the technique—the rest of this guide shows you how.

## See It Work

:::note[Example]
**Q:** "Tell me the fastest way to build something with BMad"

**A:** Use Quick Flow: Run `quick-spec` to write a technical specification, then `quick-dev` to implement it—skipping the full planning phases. This gets small features shipped in a single focused session instead of going through the full 4-phase BMM workflow.
:::

## Why This Works

BMad's prompts are written in plain English, not code. The `_bmad` folder contains readable instructions, workflows, and agent definitions—exactly what LLMs are good at processing. You're not asking the LLM to guess; you're giving it the actual source material.

## How to Do It

### What Each Source Gives You

| Source | Best For | Examples |
|--------|----------|----------|
| **`_bmad` folder** (installed) | How BMad works in detail—agents, workflows, prompts | "What does the PM agent do?" "How does the PRD workflow work?" |
| **Full GitHub repo** (cloned) | Why things are the way they are—history, installer, architecture | "Why is the installer structured this way?" "What changed in v6?" |
| **`llms-full.txt`** | Quick overview from documentation perspective | "Explain BMad's four phases" "What's the difference between levels?" |

:::note[What's `_bmad`?]
The `_bmad` folder is created when you install BMad. It contains all the agent definitions, workflows, and prompts. If you don't have this folder yet, you haven't installed BMad—see the "clone the repo" option below.
:::

### If Your AI Can Read Files (Claude Code, Cursor, etc.)

**BMad installed:** Point your LLM at the `_bmad` folder and ask directly.

**Want deeper context:** Clone the [full repo](https://github.com/bmad-code-org/BMAD-METHOD) for git history and installer details.

### If You Use ChatGPT or Claude.ai

Fetch `llms-full.txt` into your session:

```
https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```

You can also find this and other downloadable resources on the [Downloads page](/docs/downloads.md).

:::tip[Verify Surprising Answers]
LLMs occasionally get things wrong. If an answer seems off, check the source file it referenced or ask on Discord.
:::

## Still Stuck?

Tried the LLM approach and still need help? You now have a much better question to ask.

| Channel | Use For |
|---------|---------|
| `#bmad-method-help` | Quick questions (real-time chat) |
| `help-requests` forum | Detailed questions (searchable, persistent) |
| `#suggestions-feedback` | Ideas and feature requests |
| `#report-bugs-and-issues` | Bug reports |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

## Found a Bug?

If it's clearly a bug in BMad itself, skip Discord and go straight to GitHub Issues:

**GitHub Issues:** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)

---

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
