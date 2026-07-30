---
title: 'Getting Deeper'
description: Use Quick Dev to make and inspect a small change in a specific Django version
sidebar:
  order: 2
---

You already know Quick Dev from small projects. Here, you will use it in a
specific version of Django, approve one small command change, and inspect the
code, tests, and documentation it produces.

:::note[Prerequisites]
Use a macOS or Linux shell with Git, Node.js 20.12+ and `npx`,
[uv](https://docs.astral.sh/uv/getting-started/installation/), and a coding tool
supported by BMad. Complete [Getting Started](./getting-started.md) before
continuing. The exact install and launch commands below are for Claude Code. If
you use another supported tool, you can run Quick Dev there instead. VS Code is
optional but useful. Quick Dev can open the finished work for you when VS Code's
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

Install the BMad Method version used to verify this tutorial. This exact command
sets it up for Claude Code:

```bash
npx bmad-method@6.10.0 install --directory . --modules bmm --tools claude-code --yes
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
/bmad-quick-dev Add JSON output support to django-admin diffsettings. Preserve
the existing output formats, add focused tests, and update the command
documentation. Leave the implementation in the working tree for local
inspection.
```

Quick Dev asks any questions it needs before it writes a plan. Answer according
to your own preferences for the new JSON output. There is no single required
JSON design for this exercise.

Quick Dev presents a plan and waits for you to approve it or ask for changes.
Once approved, it builds and reviews the change, handles its findings, and
shows you the result. Keep this exercise about JSON output for `diffsettings`;
filtering, redaction, and CI behavior belong in the next exercise.

If `code` is available, Quick Dev opens the project and finished spec in VS
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

Look through the JSON and compare it with the choices you made with Quick Dev.

## 7. You Built It

Congratulations, you've now added something useful to a complex open-source
codebase. If you use VS Code, you're probably looking at the finished change
there now.
