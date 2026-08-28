---
title: 'Getting Deeper'
description: Use Build and BMad Spec to extend a command in a specific Django version
sidebar:
  order: 1
---

You already know Build from small projects. Here, you will use it in a specific
version of Django: first for one bounded command change, then for three related
stories defined by one BMad Spec. The two exercises demonstrate the
[one-session and epic-sized development paths](../how-to/choose-a-development-path.md).

:::note[Prerequisites]
Use a macOS or Linux shell with Git, Node.js 20.12+ and `npx`,
[uv](https://docs.astral.sh/uv/getting-started/installation/), and a coding tool
supported by BMad. Complete [Build Your First Change](../start/build-your-first-change.md) before
continuing. The exact install and launch commands below are for Claude Code. If
you use another supported tool, you can run Build there instead. VS Code is
optional but useful. Build can open the finished work for you when VS Code's
`code` command is available.
:::

## 1. Check Out the Exact Django Version

Clone Django 5.2.4 into a new directory, confirm that you have the expected
source code, and create a branch for the exercise:

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

Set up Python 3.12, install your Django checkout so the example app uses it,
and create a small Django project next to the repository:

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

Install BMad Method from the stable release channel. This exact command sets it
up for Claude Code:

```bash
npx bmad-method install --directory . --modules bmm --tools claude-code --yes
```

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

```text
/bmad-build Add JSON output support to django-admin diffsettings. Preserve
the existing output formats, add focused tests, and update the command
documentation. Leave the implementation in the working tree for local
inspection.
```

Build asks any questions it needs before it writes a plan. Answer according
to your own preferences for the new JSON output. There is no single required
JSON design for this exercise.

Build presents a plan and waits for you to approve it or ask for changes.
Once approved, it builds and reviews the change, handles its findings, and
shows you the result. Keep this exercise about JSON output for `diffsettings`;
filtering, redaction, and CI behavior belong in the next exercise.

If `code` is available, Build opens the project and finished spec in VS
Code. The Suggested Review Order links lead you through the change.

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

Look through the JSON and compare it with the choices you made with Build.

## 7. You Built It

Congratulations, you've now added something useful to a complex open-source
codebase. If you use VS Code, you're probably looking at the finished change
there now.

## 8. Write a Spec for the Larger Change

The next change needs three Build runs. `/bmad-forge-idea` can help you decide
what to build. `/bmad-advanced-elicitation` can help you improve a draft. You do
not need either here because the requirements are already clear. Send them
straight to BMad Spec:

```text
/bmad-spec Create a spec named diffsettings-audit and break it into
exactly three stories in this order: filters, redaction, then CI status.

Read the current diffsettings implementation, focused tests, and command
documentation before writing the spec. Keep every existing output format
and the JSON design already approved. Add repeatable --include and --exclude
shell-glob filters. Include patterns are OR, and exclusions always win. Add
repeatable --redact shell-glob masks that replace current and default values
with [REDACTED] without changing whether a difference exists. Add
--fail-on-difference, which exits 1 when differences remain after filtering and
0 otherwise. Each story adds focused tests and updates the existing command
documentation. Do not add another Django documentation file or an external
service. Use diffsettings-audit as the spec folder slug.
```

BMad Spec writes one spec in
`_bmad-output/specs/spec-diffsettings-audit/` and the three ordered stories in
its `stories.yaml`. Read the spec and stories, and answer any questions BMad
Spec asks. Continue when they match the requirements above.

## 9. Build the Three Stories

Run Build once for each story, in order. Complete each Build run before moving
to the next one. Every run uses the same spec. You will run these stories
attentively because they establish how filtering, redaction, and exit behavior
fit together. Later epics with stable, repeated patterns may be better
candidates for automation.

### Story 1: Filters

```text
/bmad-build Implement story 1, filters, from
_bmad-output/specs/spec-diffsettings-audit/stories.yaml.
```

After Build finishes, observe the result:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --include=DATABASES --include=DEBUG --include=SECRET_KEY \
  --exclude=DATABASES
printf 'exit: %s\n' "$?"
```

The output has `DEBUG` and `SECRET_KEY`, but no `DATABASES`, followed by
`exit: 0`. The include patterns are combined, while the exclusion wins.

### Story 2: Redaction

```text
/bmad-build Implement story 2, redaction, from
_bmad-output/specs/spec-diffsettings-audit/stories.yaml.
```

Observe the unified output:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --output=unified --include=SECRET_KEY --redact='SECRET*'
printf 'exit: %s\n' "$?"
```

The secret does not appear. Both sides of the difference are masked:

```text
- SECRET_KEY = [REDACTED]
+ SECRET_KEY = [REDACTED]
exit: 0
```

### Story 3: CI Status

```text
/bmad-build Implement story 3, CI status, from
_bmad-output/specs/spec-diffsettings-audit/stories.yaml.
```

Observe a difference that remains after filtering:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --include=DEBUG --fail-on-difference
printf 'exit: %s\n' "$?"
```

The `DEBUG` difference remains visible, and the command finishes with
`exit: 1`.

## 10. See the Whole Change Work

Now combine the three stories in one observation:

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --output=json --include=DEBUG --include=SECRET_KEY --exclude=DEBUG \
  --redact='SECRET*' --fail-on-difference
printf 'exit: %s\n' "$?"
```

The JSON contains only `SECRET_KEY`. Every current or default value exposed by
the JSON shape you chose earlier is `[REDACTED]`; neither original value
appears. The underlying values still differ, so the final line is `exit: 1`.

The first exercise gave Build one bounded change directly. This exercise gave
three separate Build runs one spec. Filtering, redaction, and CI status still
work together at the end. You have extended a mature Django command, and the
final result still does what you asked for at the start.

If you want several perspectives on the result, `/bmad-party-mode` is an
optional final step. You do not need it to finish this tutorial.

## 11. Review the Epic

Run Retrospective against the spec folder:

```text
/bmad-retrospective _bmad-output/specs/spec-diffsettings-audit/
```

Retrospective treats `stories.yaml` as the epic inventory, reads each story's
implementation record, and checks the integrated result against `SPEC.md`. It
writes `RETROSPECTIVE.md` in the same spec folder. Review its evidence,
acceptance verdict, and any proposed follow-up work.

## 12. Keep Building

Now [install BMad in your own repository](../start/install-bmad.md), then use
the `bmad-build` skill to make a change you want. See
[Build a Change](../build/build-a-change.md) for the attended path. Use
[Choose a Development Path](../how-to/choose-a-development-path.md) to decide
when a change needs a spec, automation, or the full project flow.
