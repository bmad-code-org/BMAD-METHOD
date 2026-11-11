---
title: 'Work on an Existing Skill'
description: 'Edit, convert, review, cut, package, validate, and migrate an existing skill or module with Smithy.'
sidebar:
  order: 5
---

Smithy also works on skills that already exist, including ones built elsewhere. Say what you want done, or pick a code from Smithy's menu.

| Mode | Code | What you get | Say |
| --- | --- | --- | --- |
| [Edit](#edit) | `EDIT` | One agreed change, with nothing else disturbed | "Change", "fix", "extend", "add a step to" |
| [Convert](#convert) | `CONVERT` | A skill from another tool as a BMad skill | "Convert my Cursor rule", "make this skill work with bmad" |
| [Review](#review) | `REVIEW` | A report of findings, with nothing changed | "Review this skill", "is this any good" |
| [Cut](#cut) | `CUT` | The skill's prose rewritten shorter, uncommitted | "Cut this skill down", "make it smaller" |
| [Package](#package) | `PACKAGE` | One skill or several wrapped as a module | "Package these", "make this a module" |
| [Validate](#validate) | `VALIDATE` | Pass or fail on what would stop it working | "Validate", "check my skill" |
| [Migrate](migrate-an-old-module.md) | `MIGRATE` | An old-format module in the current format | "I have an old module" |

Edit, convert, package, and migrate end with Smithy's ship step: validation, an offered trigger eval, and a hand-off. Convert also runs the review lenses over what Smithy wrote, and the others offer a review. Review and validate write nothing to the skill. Cut runs the validators and leaves the commit to you.

## Edit

Edit changes a skill as you asked and disturbs nothing else. Smithy reads `SKILL.md` and only the files the change touches, then tells you what changes, what stays, and whether the shape or the description changes. A description change is a trigger change, so Smithy says so and extends the trigger queries to cover it.

Smithy waits for your yes, makes the change, and removes any line the change makes dead. If you want to rethink the skill rather than adjust it, Smithy treats that as a new build, using the old skill as input.

## Convert

Convert brings in something from another tool: a skill, a Cursor rule, a GPT, a slash command, or a prompt you keep pasting. Point Smithy at the file, folder, or pasted text. It reads the source whole and takes out the outcome, the consumer, the intended triggers, the know-how a model would not have, and any scripts.

It drops the host tool's mechanics, such as `globs`, `alwaysApply`, `$ARGUMENTS`, and GPT conversation starters. It also drops instructions every model follows unasked. BMad frontmatter is `name` and `description` only.

There are two paths:

- **Rebuilt beside the source.** A new BMad skill in the right shape. Discovery fills what the source never said, usually the consumer, the near misses, and the name. Smithy lists what did not carry over and leaves your source as it was.
- **In place.** Say "make this skill work with bmad". Smithy works in the same folder. It lists what will change first: the name if you want your prefix on it, the description, paths and config reads, what is dropped, and a `bmod.toml` if you want the skill registered.

An outside skill usually gains a description that triggers reliably, paths that work on other machines, configuration read from the project, and registration.

## Review

Review is advice, not a gate. Point Smithy at a skill, whether yours, someone else's, or one you found. A script measures it first: tokens per file and per run, the description, frontmatter, script headers and tests, paths that do not resolve, how it is registered, and paragraphs over 150 words or holding a sentence over 60.

Five lenses then read every file a model would read, each as a separate reader:

| Lens | Looks for |
| --- | --- |
| Architecture | Files, paths, shape, and registration |
| Determinism | What should be a script and what should be prose |
| Leanness | What a capable model would do unasked, duplication, a passage one sentence could replace, paragraphs that mix topics |
| Customization | Declared values that reach nothing, and overrides that cannot land |
| Trigger | The description against the near misses |

Findings appear in chat and in a markdown file in the eval-reports folder, ordered by severity, each with its file and fix. Nothing changes until you choose. Edit mode applies the findings you accept. Cut mode rewrites the whole skill when leanness findings run through it. A variant eval shows whether a proposed cut matters before you make it.

A skill Smithy just built has already been through these lenses. Use review for skills Smithy did not write, or for a second opinion later.

## Cut

The cut mode (menu code `CUT`) rewrites a skill's prose into the fewest words that steer the model as far, without losing a rule. It drops sentences the model does not need, trims the words inside sentences that carry nothing, and recasts a passage that spends lines on a nudge as the few words that give it. There is no percentage to hit: a lean skill comes back nearly unchanged, and a bloated one comes back much shorter. Ask Smithy to "optimize this skill", "cut this skill down" or "make this skill BMad compliant". It is for a skill built elsewhere, or one you want tightened. A skill Smithy builds or converts gets the same treatment before it ships: Smithy applies every finding from its leanness review, then runs the same check for lost rules.

It takes two things:

- The skill to cut.
- Passages to keep word for word: by default each file's frontmatter, which holds the description, an agent's `customize.toml` with its persona, and the parts a rendered skill copies from its shape template, plus any passage, section or decision you name and the `Decision:` lines in the skill's ticket when it has one.

Smithy copies the skill as it stands and counts the tokens in each prompt file, skipping files under about 150 tokens and the protected ones. It removes worked examples first, keeping one only when a one-line format cannot show the same shape. Then one subagent rewrites each file in parallel. A script confirms each file still has every template expression, `{skill-root}` or `{project-root}` path, frontmatter and protected passage it had, and Smithy restores any it lost. A checker compares each file with its old version and lists a loss only when it can name the different action the model would take without the line, and points to passages that fewer words would say as well. Smithy restores those losses and applies the shorter wordings it agrees with. The skill's validation checks run, and the render test for a rendered skill.

Nothing is committed. Smithy shows a table of tokens before and after for each file with the percent saved, the losses it chose not to restore, and the points the cutters were unsure of. You read the diff and commit what you accept. Without subagents, Smithy runs each role itself, one file at a time, and says so.

## Package

Package wraps skills you already have into a module, so `bmad` can set them up, recommend them, and check them for updates. Point Smithy at one skill or a folder of skills. It reads each one and shows one execution plan: the shape, the code, the prefix, the `update_source`, the configuration questions, the roster entries, the help, the dependencies, and the files it will write.

One skill becomes a single-skill module. Two or more become a multi-skill module, and a single-skill module among them keeps its code while its record moves to a `bmod-<code>` folder. A skill that already belongs to another module can be a dependency, not a member.

Smithy offers to add the prefix to a member that lacks it, and says that renaming changes how the skill is invoked. After your yes, it writes the files and changes each skill to read its configuration from `bmad`, replacing each hardcoded value. See [Modules and Registration](modules.md).

## Validate

Validate reports what would stop a skill or module installing, loading, or firing, and it writes nothing. Point it at a skill, a record folder, or a repository. It reports pass or fail, one line per failure with the fix, and whether the target would install and load.

| Check | What it covers |
| --- | --- |
| `validate_manifests.py` | Manifests, membership, versions, retired names, help topics, and the roster, in a repository with `skills/*/bmod.toml` |
| `init_skill.py --check` | Frontmatter, name, description, `[TODO:` markers, and whether `bmod.toml` parses |
| `scan_paths.py` | Paths that do not resolve, bare `scripts/` calls, references into another skill, and old-format names |
| `scan_scripts.py` | Script headers and tests, then runs the skill's tests |

Smithy also judges what the tools cannot, such as a member reading a value no configuration question asks, or a custom skill named `bmad-`. It offers a trigger eval when the skill has `evals/triggers.json`.

An old-format module fails with one line that names [migrate](migrate-an-old-module.md) as the fix.
