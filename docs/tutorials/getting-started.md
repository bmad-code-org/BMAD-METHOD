---
title: 'Getting Started'
description: Use BMad to change a large Python codebase, then scale the same workflow across planned stories
---

Take a real 489,000-line Python project, make a useful change with BMad, and verify the result yourself. Then turn a larger follow-up into a spec and three independently shippable stories.

This tutorial uses a local checkout of Django. You won't need to know Django, run a database, or propose your changes to the Django project.

:::note[Prerequisites]
You need Git, Node.js 20.12+ with `npx`, [uv](https://docs.astral.sh/uv/getting-started/installation/), and Claude Code. `uv` will provision Python 3.12 for the exercise. BMad supports other AI coding tools through the [installer](../how-to/install-bmad.md), but this tutorial keeps one path concrete.
:::

## 1. Clone a Real Codebase

[Django](https://github.com/django/django) is a widely used Python web framework. Its 5.2.4 release contains approximately 489,000 lines of Python across framework code and tests: large enough that manually loading the codebase into an AI chat is not a serious strategy.

Choose an empty working directory, then clone the release used by this tutorial:

```bash
git clone --depth 1 --branch 5.2.4 https://github.com/django/django.git bmad-django
cd bmad-django
git rev-parse HEAD
```

Confirm that Git prints this exact commit:

```text
c941d0deec0ea08a30670be0fac879f2372f071b
```

The release tag and full commit keep the exercise stable as Django continues to evolve. Git may note that the annotated tag itself is not a commit before switching to the release commit; that message is expected. If the final SHA differs, stop and correct the checkout before continuing.

Create a local branch for your work:

```bash
git switch -c bmad-tutorial
```

Everything you do from here stays on that local branch.

## 2. Prepare Django and a Small Application

Create an environment and install the Django checkout in editable mode:

```bash
uv python install 3.12
uv venv --python 3.12
uv pip install -e .
```

Now generate a minimal Django application in a sibling directory. The application stays outside the framework repository, but because Django is installed in editable mode it immediately uses changes made inside `bmad-django`.

```bash
mkdir ../bmad-django-app
uv run django-admin startproject tutorial_project ../bmad-django-app
```

Django applications keep deployment configuration in a Python settings module. The `diffsettings` command compares an application's settings with Django's defaults. Run it against the generated application:

```bash
uv run python ../bmad-django-app/manage.py diffsettings
```

You should see settings such as `DATABASES`, `DEBUG`, and `SECRET_KEY`. Establish the focused test baseline too:

```bash
uv run python tests/runtests.py admin_scripts.tests.DiffSettings --verbosity 1
```

The checkout should report seven passing tests.

## 3. Install BMad

Install the BMad Method module and its Claude Code skills into the Django checkout:

```bash
npx bmad-method install --directory . --modules bmm --tools claude-code --yes
```

The installer adds `_bmad/`, `_bmad-output/`, and `.claude/skills/`. Commit the installed configuration and the small `uv` lockfile so Quick Dev starts from a clean boundary:

```bash
git add _bmad .claude uv.lock
git commit -m "chore: install BMAD for tutorial"
git status --short
```

The final command should print nothing.

## 4. Ship a Change With Quick Dev

First, demonstrate the missing behavior:

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json
```

Django rejects `json` because this revision supports only `hash` and `unified` output. That gives you an unambiguous before state.

Start Claude Code from `bmad-django`:

```bash
claude
```

Invoke Quick Dev with this intent:

```text
bmad-quick-dev Add a JSON output mode to django-admin diffsettings.

`--output=json` must emit a deterministic JSON object keyed by setting name.
For each included setting, return its current value, default value when one
exists, and status (`added`, `changed`, or `default`). Preserve native JSON
values where possible and use repr() for values JSON cannot encode. Honor
--all and --default, keep the existing hash and unified formats unchanged,
and add focused tests and documentation.
```

Quick Dev will inspect the repository and may ask questions if it finds a genuine ambiguity. On its full path, it presents a compact implementation spec for your approval, makes the change, runs relevant verification, reviews the result from fresh perspectives, fixes supported findings, and commits the finished work locally.

When the run finishes, verify the result outside the AI conversation:

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json | uv run python -m json.tool
uv run python tests/runtests.py admin_scripts.tests.DiffSettings --verbosity 1
git show --stat --oneline HEAD
```

The first command must produce valid, readable JSON. The focused test suite must pass with the new coverage included, and `git show` lets you inspect exactly what changed.

## What Quick Dev Just Demonstrated

The valuable part is not that an LLM wrote Python. Quick Dev took a bounded outcome into an unfamiliar, mature codebase and kept the work inside an engineering control loop:

1. It resolved intent before implementation.
2. It found the existing command, tests, and documentation instead of inventing a parallel design.
3. It preserved existing behavior while adding the new output contract.
4. It verified and reviewed the change before presenting it.
5. It left you with a local commit that you can inspect, amend, or discard.

The codebase was large. The human request stayed small.

## Use BMad-Help When You Need a Map

You do not need BMad-Help to run known workflows. Use `bmad-help` when you want to explore what is installed, compare possible planning approaches, inspect what has already been completed, or ask what should happen next.

```text
bmad-help I completed a direct Quick Dev change. What planning options make
sense for a related feature that needs several independently shippable steps?
```

It is a router and an informed reference, not a prerequisite for understanding the framework.

## 5. Scale the Change With a Spec

The JSON output is useful, but deployment tooling also needs control over what it emits and how CI reacts. That is no longer one bounded change. Start a fresh Claude Code session and invoke Spec with this intent:

```text
bmad-spec Define a configuration-audit extension for django-admin diffsettings,
building on its new JSON output.

The finished command must:
1. Filter setting names with repeatable --include and --exclude glob patterns.
2. Replace current and default values matching repeatable --redact glob patterns
   with the literal string "********" in every output format.
3. Support --fail-on-difference, returning status 1 when the selected settings
   contain an added or changed value and 0 when they do not.

Preserve all existing defaults. Each capability needs focused tests and docs.
Break the result into three independently shippable stories in that order.
```

Spec distills the outcome into a compact `SPEC.md` contract. Because the work has independently useful slices, it will offer to create `stories.yaml`; approve the three-story breakdown and choose the human checkpoints you want when asked.

Spec reports the exact output folder when it finishes. Keep that path: it contains the contract and story list that subsequent work will use.

## 6. Implement and Observe the Stories

Start a fresh Claude Code session for each story. Replace `<spec-folder>` with the path Spec reported:

```text
bmad-quick-dev Implement story 1 from <spec-folder>/stories.yaml.
Use <spec-folder>/SPEC.md and its companions as the intent contract.
```

Repeat for stories 2 and 3 after reviewing each completed change. Direct intent and planned stories both enter Quick Dev; the difference is how much settled context Quick Dev receives.

Each story has a visible result against the generated application.

### Story 1: Filtering

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json --include 'DATABASES*' | uv run python -m json.tool
```

The JSON should contain only matching settings.

### Story 2: Redaction

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json --include 'SECRET_KEY' --redact 'SECRET*' | uv run python -m json.tool
```

The secret value should be replaced by `"********"`.

### Story 3: CI Status

```bash
uv run python ../bmad-django-app/manage.py diffsettings --include 'DEBUG' --fail-on-difference
echo $?
```

On macOS or Linux, the second command should print `1` because `DEBUG` differs from Django's default. In PowerShell, inspect the same result with `echo $LASTEXITCODE`.

After all three stories, run the focused suite and inspect the local history:

```bash
uv run python tests/runtests.py admin_scripts.tests.DiffSettings --verbosity 1
git log --oneline --decorate -6
```

You now have evidence of both operating modes: a direct request became verified code, and a larger outcome retained one contract while moving through independently reviewable stories.

## Clean Up the Tutorial

The work is local and disposable. On macOS or Linux, exit Claude Code, move to the parent directory, and remove both tutorial directories when you no longer need them. On Windows, delete the same directories with your usual shell or file manager.

```bash
cd ..
rm -rf bmad-django bmad-django-app
```

## Take BMad to Your Codebase

This tutorial deliberately used one command in one framework. Larger product work can add discovery, PRDs, UX decisions, an [architecture spine](../reference/workflow-map.md#phase-3-solutioning), readiness checks, sprint context, and [autonomous story dispatch](../reference/dev-auto.md). Those artifacts increase the quality of context; they do not replace the implementation loop you just used.

**Open the real repository where you have a change worth making. Install BMad, start a fresh session, and give that change to `bmad-quick-dev`.** If the outcome contains several independently shippable parts, establish the contract with `bmad-spec` first. If you are unsure which route fits, ask `bmad-help`.
