---
title: Build Software with BMad
description: See how BMad turns short requests and shared specifications into reviewed software changes while you keep control of important decisions.
hero:
  title: Turn intent into working software
  tagline: BMad clarifies what matters, gives you a plan to approve, implements the change, reviews its work, and shows you the result.
  actions:
    - text: Start with a small build
      link: ./tutorials/getting-started/
      variant: primary
    - text: Try it in Django
      link: ./tutorials/getting-deeper/
      variant: secondary
---

BMad works with supported AI coding tools to carry a software request through
clarification, an approved plan, implementation, and review. You keep control
of the decisions that shape the result, and Build returns working code you can
run and inspect.

## Start with Working Software

[Getting Started](./tutorials/getting-started.md) begins in an empty directory
with one short request:

```text
/bmad-build write an implementation of mars rover kata
```

Build asks for the choices it needs, then gives you a plan to approve or change.
It writes and reviews the program before you run the finished Mars Rover in your
terminal. The request stays small; you decide what the program should become.

**[Build Mars Rover with BMad](./tutorials/getting-started.md)**

## Continue in a Mature Codebase

[Getting Deeper](./tutorials/getting-deeper.md) moves the same direct workflow
into Django 5.2.4. You ask Build to add JSON output to `django-admin
diffsettings`, make the decisions that define that output, run the focused
tests, and inspect the JSON produced by the command.

The second Django exercise shows what changes when the work spans several
stories. BMad Spec records one shared contract for filtering, redaction, and CI
status. Three Build runs implement it in order, and one final command shows the
features working together: filtering selects the setting, redaction hides its
value, and the exit status still reports the remaining difference.

**[Try the Django playground](./tutorials/getting-deeper.md)**

## Find a Specific Answer

Use the search box or sidebar when you already know what you need. These common
tasks lead directly to the relevant documentation:

- [Install or update BMad](./how-to/install-bmad.md)
- [Use BMad in an established project](./how-to/established-projects.md)
- [Understand how Build works](./explanation/build.md)
- [Look up installed skills](./reference/commands.md)

## Build in Your Repository

Choose a real change in a repository you already use. Install BMad in that
repository, run the installed `bmad-build` skill, and describe the result you
want. You can settle the important choices, approve or revise the plan, and
inspect the finished change in its real context.

**[Use BMad in your repository](./how-to/install-bmad.md)**
