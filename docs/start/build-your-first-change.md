---
title: 'Getting Started'
description: Install BMad and build a small Python program
---

BMad helps you plan and build anything from a small bug fix to a multi-team software product. Start with one small, self-contained build to see how the loop works.

If you already have a repository and a small change in mind, [install BMad there](./install-bmad.md), open your coding tool in the repository, and invoke `bmad-build` with a short description of what you want.

Otherwise, follow this tutorial to build a working Python program from scratch in an empty project. It uses the direct build path described in [Size and Stakes](./how-bmad-works.md#size-and-stakes), where one clear request goes straight to `bmad-build`.

:::note[Before You Start]
Use a macOS or Linux shell with [uv](https://docs.astral.sh/uv/), Node.js 20.12+, Python 3, Git, and an AI coding tool supported by BMad. The launch command below uses Claude Code as an example; if you use Codex, Cursor, or another supported tool, select it during install and run the chat commands inside that tool instead.
:::

## Create an Empty Project

Create a folder, initialize Git with an initial commit so `bmad-build` has a clean repository to work from, and install the core and method skill bundles:

```bash
mkdir bmad-first-project
cd bmad-first-project
git init
git commit --allow-empty -m "chore: initial commit"
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'
```

Open your AI coding tool in this directory. For Claude Code, run:

```bash
claude
```

Inside your coding tool's chat (not in your shell), ask the `bmad` skill to set up the project:

```text
/bmad setup
```

Commit the generated setup files if `bmad-build` later prompts you for a clean working tree, or let it commit them when it asks.

## Build a Mars Rover

In chat, ask `bmad-build` to implement the [Mars Rover programming kata](https://codingdojo.org/kata/mars-rover/), a small coding exercise, without specifying design choices up front:

```text
/bmad-build write an implementation of mars rover kata
```

Leaving the request open gives `bmad-build` room to ask what you want. It may start with a question like this:

```text
bmad-build: Before implementation, I need one choice: which language should I use?
You: Python 3. Make it a small old-school terminal program I can run locally, with no dependencies beyond the Python standard library.
```

Your questions, answers, plan, and finished program will vary. Choose the behavior you want rather than copying the example answer verbatim.

After you answer its questions, read the plan it proposes and approve it or ask for adjustments. The skill then writes the code and tests, reviews its own work, fixes any problems it catches, and shows you what changed.

## Run the Mars Rover

Depending on what you requested, running the finished program in your terminal will look something like this:

```bash
python3 mars_rover.py --size 5x5 --obstacle 2,2
```

Enter `FFRFF`, then `MAP`, then `QUIT`. The terminal shows the rover stopping before the obstacle:

```text
MARS ROVER CONTROL
Commands: F/M forward, B backward, L/R turn, MAP, STATUS, HELP, QUIT
Position: (0, 0)  Heading: N
rover> Position: (1, 2)  Heading: E
OBSTACLE: movement blocked at (2, 2)
rover>  4  . . . . .
 3  . . . . .
 2  . > # . .
 1  . . . . .
 0  . . . . .
    0 1 2 3 4
rover> Mission control signing off.
```

Open the files listed in the final message to inspect your finished program and tests.

## Ask BMad

The `bmad` skill answers questions about BMad, explains what happened, and recommends what to do next. Try it in chat now:

```text
/bmad Explain what bmad-build just did.
```

## You Built It

This Mars Rover run showed how `bmad-build` turns a short request into working software: it clarified the open choices, presented a plan for your approval, wrote the program and tests, and verified its work before presenting the result.

## Keep Building

1. [Install BMad in your own repository](./install-bmad.md), then run `bmad-build` with a short description of a single clear change. See [Build a Change](../build/build-a-change.md) for the interactive path.
2. [Walk through three routes](./walk-through-three-routes.md) on new projects (a quick build, Sofia's route, and the full planning route), then [walk through an existing codebase](./walk-through-an-existing-codebase.md) to see how BMad handles inherited code.
3. Continue to [Getting Deeper](../existing-codebases/getting-deeper.md) for a small change in a mature codebase followed by a larger change backed by a written specification.
4. Read [How BMad Works](./how-bmad-works.md) when your next project spans multiple connected features or epics.
