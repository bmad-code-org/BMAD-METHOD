---
title: 'Build Your First Skill'
description: 'Build a skill with Smithy from an idea to a working single-skill module, then add a second skill to make a module.'
sidebar:
  order: 2
---

In this tutorial you build a skill with Smithy (`bmad-toolsmith`), set it up with BMad, and try it on a real request. You then add a second skill, which grows it into a multi-skill module. The example creates release notes from merged pull requests, but any repeatable job works the same way.

## What You'll Learn

- How to give Smithy what he needs to design a skill
- How to read and adjust his execution plan before any files are written
- What a single-skill module is, and why it is the default
- How to test that a skill loads on the right prompts
- How one skill expands into a multi-skill module

:::note[Prerequisites]
- BMad installed in your project ([How to Install BMad](../start/install-bmad.md))
- Toolsmith installed ([Install Toolsmith](toolsmith.md#install-toolsmith))
- A repeatable job you have done with an AI tool more than once
- A real input to test the skill on, such as a recent pull request
:::

:::tip[Quick Path]
Describe the job to Smithy, answer his follow-up questions, approve the execution plan, run `bmad setup <code>`, and test the skill on one real request.
:::

## Understanding What Smithy Builds

By default, Smithy registers a standalone skill as a single-skill module so `bmad` can set it up, recommend it in help, and check it for updates. One skill does not need a separate wrapper folder; three files inside the skill's folder handle everything:

| File | What it is for |
| --- | --- |
| `SKILL.md` | The short trigger description your AI tool reads and the instructions the agent follows |
| `bmod.toml` | The small module manifest file that tells `bmad` the module code, version, and source |
| `help/help.md` | The short guide the `bmad` skill reads when explaining or recommending your skill to users |

## Step 1: Say What You Want

Start `bmad-toolsmith` (or speak to Smithy by name) and describe the job in plain English, including anything you already know.

```text
Build a skill that turns the pull requests merged since the last tag into release notes for our customers.
```

If you have already thought through the details, say so and Smithy moves straight to confirming what you gave him. If the idea is still thin, he pushes back on the gaps before writing anything.

## Step 2: Fill the Gaps

Smithy asks only for what your request left out, offering his best guess alongside each question so you can often just confirm. He checks:

- What the skill produces, for whom, and who acts on the output
- What must be true of the output for that person to use it without extra back-and-forth
- The phrases people type to reach the skill, and nearby requests it should ignore
- Where the domain know-how lives (such as a runbook, an example, or your own head)
- Whether the output can be verified automatically
- Whether this skill stands alone or more skills are planned alongside it

That last question matters because when more skills are planned, Smithy settles a shared module code and prefix right away so nothing needs renaming later. If you describe several skills at once, he plans the whole module first. See [Modules and Registration](modules.md#three-ways-to-register).

## Step 3: Approve the Execution Plan

Smithy shows what he plans to build and waits for your approval. Read every line carefully, because this is the cheapest moment to adjust the design.

:::note[Example]
| Field | Value |
| --- | --- |
| Name | `acme-release-notes` |
| Purpose | Customer-facing release notes from merged pull requests, ready for the support team to publish |
| Description | `Writes customer release notes from merged pull requests. Use when the user says 'write the release notes' or 'what shipped since the last tag'.` |
| Shape | Plain skill |
| Registration | Single-skill module, code `acme` |
| Approach | Lean |
| Location | The folder your agent reads skills from |
:::

Use a prefix of your own rather than `bmad-`, which is reserved for official BMad skills. A shared prefix also keeps your team's skills grouped together in listings.

## Step 4: Let Smithy Build It

After you approve, Smithy writes the skill and shows you the draft and trigger description before going further. When you have a real input, he runs the skill on it once, inspects how the run went, and fixes anything the trial exposed.

Next, Smithy runs his built-in review pass over what he wrote. For a small plain skill like this example (whose only prompt files are `SKILL.md` and `help/help.md`, with no scripts and no customization file), he runs two focused review lenses, leanness and trigger accuracy, in one round. Larger skills with reference files, scripts, or customization go through all five review lenses. Smithy fixes clear defects, trims instructions a capable model already follows unasked, validates the files, and reports what changed. Before applying any finding that changes what the skill does or how it sounds, he lists it and asks you first.

## Step 5: Set Up and Try the Skill

Ask the `bmad` skill to run `bmad setup acme`. Setup registers the module, creates its folder under `_bmad/`, and asks any setup questions the module defines.

Start a fresh chat so your AI tool picks up the new skill, then try one of your real trigger phrases:

```text
Write the release notes for everything since v1.4.0.
```

Check that the skill loaded, and judge the output from the perspective of the person who will actually publish it. To adjust anything, ask Smithy to edit the skill.

## Step 6: Test That It Fires

At the end of a build, Smithy offers a trigger eval: an automated test that runs sample prompts through your AI tool to verify the skill loads when it should and stays quiet on near-miss requests. Take this check for any skill you expect to trigger automatically from natural language. Smithy writes both matching prompts and near misses, and `bmad-eval` runs them through your tool. See [Eval Runner](bmad-eval.md).

## Step 7: Add a Second Skill

When a second skill belongs with the first, ask Smithy to add it to the same module:

```text
Build acme-release-check for the acme module. It checks that a release branch is ready to tag.
```

The execution plan shows the new skill registered as a member of `acme`. Because a single-skill module has no separate record folder yet, Smithy moves the shared record into a new `bmod-acme` folder first. Any configuration answers people already gave keep working because the module code stays the same.

## What You've Accomplished

You built a working skill, registered it with BMad, tested that it fires, and expanded it into a multi-skill module that `bmad` can set up, recommend, and update.

```text
skills-folder/
├── bmod-acme/                  # the shared module record
│   ├── SKILL.md                # directs users to run bmad setup acme
│   ├── bmod.toml               # code, version, source, members, questions
│   └── help/
│       └── help.md             # what bmad tells users about the module
├── acme-release-notes/
│   ├── SKILL.md
│   └── bmod.toml               # points to the bmod-acme record
└── acme-release-check/
    ├── SKILL.md
    └── bmod.toml
```

## Quick Reference

| You want to | Ask |
| --- | --- |
| Build a skill | Smithy, `"build a skill that..."` |
| Change a skill | Smithy, `"change this skill to..."` |
| Check it fires | Smithy, `"run a trigger eval on this skill"` |
| Package finished skills | Smithy, `"package these as a module"` |
| Set up a module | `bmad`, `"bmad setup <code>"` |

## Common Questions

- [Do I have to make a module?](#do-i-have-to-make-a-module)
- [What if my project has no `_bmad` folder?](#what-if-my-project-has-no-_bmad-folder)
- [Can I write the skill myself?](#can-i-write-the-skill-myself)
- [Does every job need a skill?](#does-every-job-need-a-skill)

### Do I have to make a module?

No. Tell Smithy you want no module record and he builds a plain skill. It still works in your AI tool, although `bmad` will not recommend it, run setup for it, or check it for updates.

### What if my project has no `_bmad` folder?

Smithy builds a plain skill. You can add a module record later through [convert mode](modes.md#convert).

### Can I write the skill myself?

Yes. Use the [scaffold and guide](approaches.md#scaffold-and-guide) approach so Smithy lays out the files and leaves the writing to you.

### Does every job need a skill?

No. A one-off task needs no skill. A skill earns its place when it saves you retyping a format, preference, or convention, or holds domain know-how the model cannot infer on its own.

## Getting Help

- Ask the `bmad` skill; it reads Toolsmith's help files and recommends the right mode.
- Ask in the [BMad Discord](https://discord.gg/gk8jAdXWmj).
- [Open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) for a bug.

:::tip[Key Takeaways]
- Smithy writes nothing until you approve the execution plan.
- One skill defaults to a single-skill module unless you ask for a plain skill with no record.
- Tell Smithy early when more skills are planned so the module prefix is settled up front.
- The description decides whether a skill loads; test it with a trigger eval before relying on it.
:::
