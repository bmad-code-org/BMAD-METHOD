---
title: "How to Get Answers About BMad"
description: Use an LLM to quickly answer your own BMad questions
sidebar:
  order: 4
---

If you have successfully installed BMad and the BMad Method (+ other modules as needed) - the first step in getting answers is `/bmad-help`. This will answer upwards of 80% of all questions and is available to you in the IDE as you are working.

## When to Use This

- You have a question about how BMad works or what to do next with BMad
- You want to understand a specific agent or workflow
- You need quick answers without waiting for Discord

:::note[Prerequisites]
An AI tool (Claude Code, Cursor, ChatGPT, Claude.ai, etc.) and either BMad installed in your project or access to the GitHub repo.
:::

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
