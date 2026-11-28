---
title: 'Getting Deeper'
description: Use Build and Sofia, the Product Owner, to extend a command in a specific Django version
sidebar:
  order: 3
---

This advanced tutorial is for developers who want a deeper real-world brownfield walkthrough after completing the shorter [Walk Through an Existing Codebase](../start/walk-through-an-existing-codebase.md) room-booker tutorial. You will work inside a specific release of Django, first making one bounded command change and then building three related stories under one epic. Together, the two exercises show the [one-session and epic-sized planning paths](../start/how-bmad-works.md#size-and-stakes) on a large, mature codebase.

:::note[Prerequisites]
Use a macOS or Linux shell with Git, Node.js 20.12+ and `npx`, [uv](https://docs.astral.sh/uv/getting-started/installation/), and a coding tool supported by BMad. Complete [Build Your First Change](../start/build-your-first-change.md) before continuing. The launch commands below use Claude Code, and you can run the same chat prompts in any other supported coding tool.
:::

## 1. Check Out the Exact Django Version

Clone Django 5.2.4 into a new directory, confirm that you have the expected source code, and create a branch for the exercise:

```bash
git clone --depth 1 --branch 5.2.4 https://github.com/django/django.git bmad-django
cd bmad-django
git rev-parse HEAD
git switch -c bmad-getting-deeper
```

`git rev-parse HEAD` should print:

```text
c941d0deec0ea08a30670be0fac879f2372f071b
```

## 2. Set Up Django for Editing

Set up Python 3.12, install your Django checkout in editable mode so the example app uses it, and create a small Django project beside the repository:

```bash
uv python install 3.12
uv venv --python 3.12
uv pip install -e .
mkdir ../bmad-django-app
uv run django-admin startproject tutorial_project ../bmad-django-app
```

## 3. Check the Starting Behavior

Confirm that JSON output is not yet available:

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json
```

The command ends with this error:

```text
manage.py diffsettings: error: argument --output: invalid choice: 'json' (choose from hash, unified)
```

## 4. Install BMad

Install BMad Method with the skills CLI, then let the `bmad` skill set up the project:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'
```

Open Claude Code in this directory and ask the `bmad` skill to run `bmad setup`. Restart Claude Code once the skills are installed.

Tell Git to ignore the BMad files and uv lockfile created for this tutorial:

```bash
cat >> .git/info/exclude <<'EOF'
/_bmad/
/_bmad-output/
/.claude/
/uv.lock
EOF
```

## 5. Build It

Open your coding tool from the repository root. For Claude Code, run:

```bash
claude
```

Then enter this prompt in chat:

```text
/bmad-build Add JSON output support to django-admin diffsettings. Preserve
the existing output formats, add focused tests, and update the command
documentation. Leave the implementation in the working tree for local
inspection.
```

Build asks any clarifying questions it needs before writing a plan. Answer according to your own preferences for the new JSON output, because there is no single required JSON shape for this exercise.

Build presents a plan and waits for you to approve it or ask for changes. Once approved, it implements and reviews the change, resolves its findings, and reports the result. Keep this first exercise focused on JSON output for `diffsettings`, because filtering, redaction, and CI exit behavior belong in the second exercise.

Build finishes with a short summary and offers next steps. Run the manual checks below before asking it to commit or create a pull request.

## 6. See It Work

Back in your shell, run Django's `diffsettings` tests:

```bash
uv run python tests/runtests.py admin_scripts.tests.DiffSettings --verbosity 1
```

The tests should pass.

Now run the command again:

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json
```

Inspect the JSON output and compare it with the choices you approved during Build.

## 7. You Built It

You have added a tested feature to a large open-source codebase in a single attended Build run.

## 8. Write a Spec for the Larger Change

The next change spans three Build runs. Normally you might use `/bmad-forge-idea` to stress-test an unclear idea or `/bmad-advanced-elicitation` to sharpen a draft, but here the requirements are already settled. Send them straight to Sofia, the Product Owner:

```text
/bmad-agent-po Create an epic named diffsettings-audit and break it into
exactly three stories in this order: filters, redaction, then CI status.

Read the current diffsettings implementation, focused tests, and command
documentation before writing the requirements. Keep every existing output format
and the JSON design already approved. Add repeatable --include and --exclude
shell-glob filters. Include patterns are OR, and exclusions always win. Add
repeatable --redact shell-glob masks that replace current and default values
with [REDACTED] without changing whether a difference exists. Add
--fail-on-difference, which exits 1 when differences remain after filtering and
0 otherwise. Each story adds focused tests and updates the existing command
documentation. Do not add another Django documentation file or an external
service. Use diffsettings-audit as the epic's slug.
```

Because this is a single-epic effort, Sofia can create it directly as a standalone top-level container at `_bmad-output/epic-diffsettings-audit/` (without forcing a parent initiative), or place it under an existing initiative if you already have one active. She writes `epic-diffsettings-audit.md` with its Requirements, creates the ordered story entries in `tickets/tickets.toml`, and by default writes a Refined Story file (`tickets/story-<slug>.md`) for each story with full acceptance criteria and boundaries. Review the epic file and the three story files, answer any questions she raises, and approve them once they match the requirements above.

## 9. Build the Three Stories

Run Build once for each story, in order, completing each run before starting the next. Every run reads the same epic and story specification. Running these three stories attentively lets you verify how filtering, redaction, and exit status fit together; later epics with well-established patterns are better candidates for unattended automation.

### Story 1: Filters

```text
/bmad-build Implement story 1, filters, from
the epic-diffsettings-audit ticket tree.
```

After Build finishes, verify the filtering behavior:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --include=DATABASES --include=DEBUG --include=SECRET_KEY \
  --exclude=DATABASES
printf 'exit: %s\n' "$?"
```

The output should list `DEBUG` and `SECRET_KEY`, omit `DATABASES`, and end with `exit: 0`. Include patterns combine with OR logic, while exclusions always win.

### Story 2: Redaction

```text
/bmad-build Implement story 2, redaction, from
the epic-diffsettings-audit ticket tree.
```

Verify the unified output:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --output=unified --include=SECRET_KEY --redact='SECRET*'
printf 'exit: %s\n' "$?"
```

The secret value does not appear, and both sides of the difference are masked:

```text
- SECRET_KEY = [REDACTED]
+ SECRET_KEY = [REDACTED]
exit: 0
```

### Story 3: CI Status

```text
/bmad-build Implement story 3, CI status, from
the epic-diffsettings-audit ticket tree.
```

Verify a difference that remains after filtering:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --include=DEBUG --fail-on-difference
printf 'exit: %s\n' "$?"
```

The `DEBUG` difference stays visible, and the command finishes with `exit: 1`.

## 10. See the Whole Change Work

Combine all three stories in a single run:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --output=json --include=DEBUG --include=SECRET_KEY --exclude=DEBUG \
  --redact='SECRET*' --fail-on-difference
printf 'exit: %s\n' "$?"
```

The JSON contains only `SECRET_KEY`. Every current or default value in the JSON shape you chose earlier is `[REDACTED]`, so neither original value appears, and because the underlying values still differ, the command finishes with `exit: 1`.

The first exercise sent one bounded request straight to Build, while the second coordinated three Build runs under one shared specification so filtering, redaction, and CI exit status work cleanly together.

If you want multiple agent perspectives on the finished feature, `/bmad-party-mode` is an optional follow-up, though you do not need it to finish the tutorial.

## 11. Review the Epic

Run Retrospective against the completed epic:

```text
/bmad-retrospective epic-diffsettings-audit
```

Retrospective reads the epic's `tickets.toml` along with the local build plans and run logs for each story, then checks the integrated result against the epic's requirements. It writes `epic-diffsettings-audit-retrospective.md` inside the epic folder. Review its evidence, acceptance verdict, and any proposed follow-up items, and keep the local build plans because they store live status and historical review evidence.

## 12. Keep Building

When you are ready to apply this to your own codebase, [install BMad in your repository](../start/install-bmad.md) and start with `bmad-build` on a real task. See [Build a Change](../build/build-a-change.md) for the attended Build flow, and [How BMad Works](../start/how-bmad-works.md) to judge when a change needs a spec, automation, or full project planning.
