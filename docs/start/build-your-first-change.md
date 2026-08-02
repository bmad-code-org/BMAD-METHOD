---
title: 'Getting Started'
description: Install BMad and build a small Python program
---

BMad can help you plan and build anything from a small bug fix to a project with
a million lines of code. Let's start with something small.

Already have a repository and a small change you want to make?
[Install BMad there](./install-bmad.md), open your coding tool in the
repository, and run the installed `bmad-build` skill. Talk to it about the
change you want, and it will make it happen.

Otherwise, start here. You will make a working Python program in an empty
project. This tutorial follows the
[one-session development path](../how-to/choose-a-development-path.md): one
coherent request goes directly to the `bmad-build` skill.

:::note[Before You Start]
Use a macOS or Linux shell with Node.js 20.12+, Python 3, and a coding tool
supported by BMad. The exact install and launch commands below are for Claude
Code. If you use another supported tool, select it when installing BMad and run
the `bmad-build` skill there instead.
:::

## Create an Empty Project

```bash
mkdir bmad-first-project
cd bmad-first-project
```

Install the current stable version of BMad Method. This command sets it up for
Claude Code:

```bash
npx bmad-method install --directory . --modules bmm --tools claude-code --yes
```

Open your coding tool in this directory. For Claude Code, run:

```bash
claude
```

## Build a Mars Rover

Ask the `bmad-build` skill to make the
[Mars Rover programming kata](https://codingdojo.org/kata/mars-rover/), a small
exercise used to practice coding, without adding any design choices:

```text
/bmad-build write an implementation of mars rover kata
```

This gives the `bmad-build` skill room to ask what you want. It may start with a
question like this:

```text
`bmad-build`: Before implementation, I need one choice: which language should I use?
You: Python 3. Make it a small old-school terminal program I can run locally,
with no dependencies beyond Python standard library.
```

Your questions, answers, plan, and finished program may differ. Choose the
behavior you want rather than copying the example answer.

After you answer its questions, read its plan. Approve it or ask for changes.
The skill then writes the program, checks its work, fixes any problems, and
shows you what changed.

## Run the Mars Rover

Depending on what you told it, the result may look something like this:

```bash
python3 mars_rover.py --size 5x5 --obstacle 2,2
```

Enter `FFRFF`, then `MAP`, then `QUIT`. The terminal shows the rover stopping
before the obstacle:

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

Open the files listed in the final message to look at your finished program.

## Ask BMad Help

The `bmad-help` skill answers questions about BMad. Use it to understand what
happened, decide what to do next, or solve a problem. Try it now:

```text
/bmad-help Explain what bmad-build just did.
```

## You Built It

Mars Rover showed how the `bmad-build` skill turns a short request into working
software. It clarified the request, presented a plan for your approval, wrote
the program, and checked its work before showing you the result.

## Keep Building

1. [Install BMad in your own repository](./install-bmad.md), then run
   the `bmad-build` skill with a short description of a small change.
2. Continue to [Getting Deeper](../tutorials/getting-deeper.md) for a small change in a
   mature codebase, followed by a larger change using a written spec.
3. Use [Choose a Development Path](../how-to/choose-a-development-path.md) when
   your next change may need several implementation sessions or multiple epics.
