---
title: 'Build Your First Skill'
description: 'Build a skill with Smithy from an idea to a working single-skill module, then add a second skill to make a module.'
sidebar:
  order: 2
---

In this tutorial you build a skill with Smithy, set it up with BMad, and try it on a real request. You then add a second skill, which turns it into a module. The example makes release notes from merged pull requests, but any job you repeat will work.

## What You'll Learn

- How to give Smithy what it needs to build a skill
- How to read and change the execution plan
- What a single-skill module is, and why it is the default
- How to try a skill and test that it fires
- How one skill grows into a module

:::note[Prerequisites]
- BMad installed in your project ([Install BMad](../start/install-bmad.md))
- Toolsmith installed ([Install Toolsmith](toolsmith.md#install-toolsmith))
- A job you have done with an agent more than once
- A real input to try the skill on, such as a recent pull request
:::

:::tip[Quick Path]
Ask Smithy for the skill, answer the gaps, approve the execution plan, then run `bmad setup <code>` and try one real request.
:::

## Understanding What Smithy Builds

Your skill registers with BMad as a module, so `bmad` can set it up, recommend it, and check it for updates. One skill does not need a separate module folder. Its own folder holds everything:

| File | What it is for |
| --- | --- |
| `SKILL.md` | The description that triggers the skill, and the instructions the agent follows |
| `bmod.toml` | The record that tells `bmad` about the skill |
| `help/help.md` | What the `bmad` skill tells users about the skill |

## Step 1: Say What You Want

Start `bmad-toolsmith` and describe the job in your own words. Include anything you already know.

```text
Build a skill that turns the pull requests merged since the last tag into release notes for our customers.
```

If you have thought it through, say so and Smithy moves straight to confirming what you gave it. If the idea is thin, Smithy pushes back on it before building anything.

## Step 2: Fill the Gaps

Smithy asks only for what your request left out, each question with the answer it would guess, so you can often just confirm. It needs to know:

- What the skill gets done, for whom, and who uses the output
- What must be true of the output for that person to act on it
- The phrases you would type to reach the skill, and nearby requests it should ignore
- Where the know-how lives, such as a runbook, an incident, or your own head
- Whether the output can be checked
- Whether this skill stands alone or more are planned

The question about other skills matters. When more skills are planned, Smithy settles a module code and prefix now, so nothing needs renaming later.

## Step 3: Approve the Execution Plan

Smithy shows what it will build and waits. Read every line, because this is the cheapest moment to change your mind.

:::note[Example]
- **Name:** `acme-release-notes`
- **Purpose:** customer-facing release notes from merged pull requests, for the support team to publish
- **Description:** `Writes customer release notes from merged pull requests. Use when the user says 'write the release notes' or 'what shipped since the last tag'.`
- **Shape:** plain skill
- **Registration:** single-skill module, code `acme`
- **Approach:** lean
- **Location:** the folder your agent reads skills from
:::

Use a prefix of your own, not `bmad-`, which marks skills that BMad ships. A prefix also keeps your skills together in listings.

## Step 4: Let Smithy Build It

After you approve, Smithy writes the skill and shows you the draft and description before going further. When you have a real input, Smithy runs the skill on it once and reads how the run went, then fixes what the run shows.

Five review lenses then read every file. Smithy fixes the defects they find, cuts what a capable model would do unasked, validates the skill, and tells you what changed.

## Step 5: Set Up and Try the Skill

Ask the `bmad` skill to run `bmad setup acme`. Setup registers the module, creates its folder under `_bmad/`, and asks any configuration questions the skill has.

Start a fresh session so your tool loads the new skill, then make a real request with one of your trigger phrases:

```text
Write the release notes for everything since v1.4.0.
```

Check that the skill loaded, and judge the output as the person who will use it. To change something, ask Smithy to edit the skill.

## Step 6: Test That It Fires

Smithy offers a trigger eval at the end of a build. Take it for any skill you expect to fire without being named. Smithy writes queries that should fire the skill and near misses that should not, and `bmad-eval` runs them through your tool. See [Eval Runner](bmad-eval.md).

## Step 7: Add a Second Skill

When a second skill belongs with the first, ask Smithy to build it into the module:

```text
Build acme-release-check for the acme module. It checks that a release branch is ready to tag.
```

The execution plan shows the registration as a member of the module. A single-skill module has no record folder yet, so Smithy moves the record into a new `bmod-acme` folder first. The configuration answers people already gave keep working, because the module code stays the same.

## What You've Accomplished

You built a skill and registered it with BMad, then grew it into a module that `bmad` can set up, recommend, and update.

```text
skills-folder/
├── bmod-acme/                  # the module record
│   ├── SKILL.md                # says only to run bmad setup acme
│   ├── bmod.toml               # code, version, source, members, questions
│   └── help/
│       └── help.md             # what bmad tells users about the module
├── acme-release-notes/
│   ├── SKILL.md
│   └── bmod.toml               # names the record
└── acme-release-check/
    ├── SKILL.md
    └── bmod.toml
```

## Quick Reference

| You want to | Ask |
| --- | --- |
| Build a skill | Smithy, "build a skill that..." |
| Change a skill | Smithy, "change this skill to..." |
| Check it fires | Smithy, "run a trigger eval on this skill" |
| Package finished skills | Smithy, "package these as a module" |
| Set up a module | `bmad`, "bmad setup <code>" |

## Common Questions

- [Do I have to make a module?](#do-i-have-to-make-a-module)
- [What if my project has no `_bmad` folder?](#what-if-my-project-has-no-_bmad-folder)
- [Can I write the skill myself?](#can-i-write-the-skill-myself)
- [Does every job need a skill?](#does-every-job-need-a-skill)

### Do I have to make a module?

No. Tell Smithy you want no record and you get a plain skill. It works the same, but `bmad` does not recommend it, set it up, or check it for updates.

### What if my project has no `_bmad` folder?

Smithy builds a plain skill. You can add a record later through [convert mode](modes.md#convert).

### Can I write the skill myself?

Yes. Use the [scaffold approach](approaches.md#scaffold-and-guide). Smithy lays out the files and leaves the writing to you.

### Does every job need a skill?

No. A job you do once needs no skill. A skill earns its place when it saves you retyping a format, a preference, or a convention, or when it holds know-how the model does not have.

## Getting Help

- Ask the `bmad` skill. It reads Toolsmith's help files and can point you to the right mode.
- Ask in the [BMad Discord](https://discord.gg/gk8jAdXWmj).
- [Open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) for a bug.

:::tip[Key Takeaways]
- Smithy writes nothing until you approve the execution plan.
- One skill is a single-skill module by default. Say if you want no record.
- Tell Smithy early when more skills are planned, so the name fits the module.
- The description decides whether the skill fires. Test it with a trigger eval.
:::
