---
title: 'The BMad Agent'
description: 'Meet the BMad Agent (bmad), your guide to learning BMad, choosing what to use next, managing modules and updates, and combining BMad with any other skills in your coding tool.'
---

The best way to learn BMad, discover what it can do, and decide what to use next is to talk directly to the BMad Agent (`bmad`) inside your AI coding tool. You do not need to read every documentation page or memorize skill names before getting started, because the BMad Agent inspects what is actually installed in your workspace and guides you from there.

Installed with Core Tools in every BMad project, the BMad Agent acts as your coach and coordinator across every module you have added. It answers questions from your installed modules rather than generic documentation, keeps your installation current, adds or removes modules, manages your active work, and helps you combine BMad skills with any other non-BMad skills available in your AI coding tool so everything works together cohesively.

:::tip[Start by Asking]
Once BMad is installed, open your AI coding tool chat and ask `bmad` what to do with the goal in front of you. Talking to the BMad Agent beats searching documentation every time because its answers match your exact setup and current project files.
:::

## Ways to Talk to the BMad Agent

Invoke the BMad Agent using whichever syntax your AI coding tool uses (`/bmad`, `$bmad`, `bmad`, or plain English like `"Hey BMad, ..."`), and describe what you want in everyday language:

```text
Hey BMad, I have an existing web app and want to add Stripe billing safely. What should I use first, and how does it fit with the skills I already have installed?
```

```text
/bmad what should I work on next?
```

```text
Hey BMad, check if my BMad installation is up to date, and add the Founder module to this folder.
```

```text
Hey BMad, customize the build skill to always check our API compatibility rules when modifying endpoints, and ensure we are always in thorough review mode.
```

## What the BMad Agent Can Do

### Answer Questions and Coach Your Next Step

Ask the BMad Agent anything about how BMad works, which agent or skill fits your situation, or what order to run things in. It reads the help of every BMad module installed in your project and checks your current project folder and active initiative so it can tell you the clearest next step and explain why.

Because it sees your whole working setup, it can also coach you on how to combine BMad skills with any non-BMad skills or tools you already use in your coding tool (such as framework skills, MCP integrations, or custom team prompts) so you get one cohesive workflow rather than competing instructions.

### Run, Route, and Customize Skills for You

When you already know your goal and do not want to remember individual skill names, ask the BMad Agent to handle it. If one skill is the clear next move, it tells you whether to start a fresh chat or runs it for you on request. If your task takes a short sequence of skills, it walks through them one at a time and checks each result with you before moving on.

That includes customization: instead of hunting for configuration files or remembering `bmad-customize`, you can tell the BMad Agent in plain English how you want a skill, agent, or document template to behave, and it routes straight to `bmad-customize` to apply and verify the change. See [Customize BMad](../customize/customize-bmad.md).

### Keep BMad Up to Date and Healthy

Setup, status checks, updates, repairs, and upgrades all run through the BMad Agent:

- Run first-time setup in a project and answer module configuration questions once.
- Check installation health (`bmad status`) to see installed module versions, available updates, missing requirements, duplicate copies, or retired skills.
- Update installed modules when newer versions ship and clean up retired or duplicate skill copies after asking for your confirmation.
- Detect and run module migrations when a project upgrades across versions, showing you the migration plan and checklist before changing any files.

### Add and Remove Modules

As your needs grow beyond software delivery, ask the BMad Agent to add optional modules such as [Founder](../founder/founder.md), [Creative](../creative/creative.md), [Toolsmith](../toolsmith/toolsmith.md), [Test Architect (TEA)](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/), or custom team modules. You can also ask it to remove retired or unwanted skills, clean up legacy v6 leftovers after taking an automatic backup, or review and update your saved setup answers. See [Add Modules](../customize/add-modules.md).

### Track and Switch Your Active Work

In projects with more than one initiative, standalone epic, or multi-initiative program, the BMad Agent keeps track of which container is currently active so John, Sofia, Sally, Winston, and Amelia save documents and tickets in the right folder. Ask it what is active, create a new initiative, switch between initiatives, or clear the active setting whenever you move to standalone work.

## How It Stays Grounded in Your Workspace

Instead of answering from stale memory, the BMad Agent checks your installed modules, templates, and current project folder before replying. It never deletes files, changes your setup, or runs a migration without telling you what it found and getting your approval first, and if something is not installed or cannot be answered from your workspace, it tells you plainly rather than guessing.

## When You Are Unsure, Ask the BMad Agent First

Whenever you want to learn how a feature works, figure out which agent or skill to run, combine BMad with other skills in your coding tool, customize a workflow, or keep your installation healthy and up to date, start by talking to the BMad Agent in chat. These docs are here whenever you want a written overview or reference, while the BMad Agent is always the fastest, most accurate way to learn and use BMad day by day in your own workspace.
