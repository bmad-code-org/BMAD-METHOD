# Getting Started with RMTN Developer Suite

Welcome to rmtn-solo-dev! This guide will help you get up and running.

---

## What This Module Does

**RMTN Developer Suite** is a "Senior Developer in a Box" that automates context-keeping and planning overhead, allowing a solo developer to move with the speed and quality of a full team.

It enforces a "Plan → Execute" discipline with automated context management via two specialized agents:
- **Mimir (The Sage):** Handles context and documentation (Saga).
- **Thor (The Builder):** Handles planning and execution (Quests).

---

## Installation

If you haven't installed the module yet:

```bash
bmad install rmtn-solo-dev
```

Follow the prompts to configure the module for your needs. You will be asked where to store your Saga (context) and Quests.

---

## First Steps

1.  **Genesis (Onboarding):**
    - Trigger Mimir with `[SC] Scan Project`.
    - Provide a description of your project.
    - Mimir will scan your codebase and generate the **Saga** (`context.md` and `architecture.md`).
    - Review and approve these documents. They are now the "Source of Truth".

2.  **The Quest (Feature Work):**
    - Trigger Thor with `[NQ] New Quest`.
    - Describe the feature you want to build.
    - Thor will read the Saga, propose 3 approaches, and score them.
    - Once you select an approach, Thor drafts a **Tech Spec** (Quest file).

3.  **Execution:**
    - Trigger Thor with `[EX] Execute Quest`.
    - Point him to the created Quest file.
    - Thor implements the changes step-by-step.

---

## Common Use Cases

- **Daily Feature Work:** Using the Quest system to build complex features with high quality.
- **Bug Fixing:** Using `[QF] Quick Fix` for rapid patches without overhead.
- **Project Onboarding:** Using `[SC] Scan Project` to quickly generate documentation for a new or existing codebase.

---

## What's Next?

- Check out the [Agents Reference](agents.md) to meet your team
- Browse the [Workflows Reference](workflows.md) to see what you can do
- See [Examples](examples.md) for real-world usage

---

## Need Help?

If you run into issues:
1. Check the troubleshooting section in examples.md
2. Review your module configuration
3. Consult the broader BMAD documentation
