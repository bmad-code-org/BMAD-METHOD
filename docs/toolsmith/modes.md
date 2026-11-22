---
title: 'Work on an Existing Skill'
description: 'Edit, convert, review, cut, package, validate, and migrate an existing skill or module with Smithy.'
sidebar:
  order: 5
---

Smithy also works on skills that already exist, including ones built elsewhere. Say what you want done, or use a code from the table as a shortcut.

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

Edit makes the change you ask for and leaves the rest of the skill alone. Smithy tells you what changes, what stays, and whether the description changes, since that changes when the skill fires, then waits for your yes.

> Add a step to my release-notes skill that links each entry to its pull request.

To rethink a skill rather than adjust it, ask for a new build with the old skill as input.

## Convert

Convert turns a skill, Cursor rule, GPT, slash command, or prompt you keep pasting into a BMad skill. It keeps the know-how and drops the other tool's mechanics, such as `globs` or `$ARGUMENTS`. Point Smithy at the file, folder, or pasted text.

> Convert my Cursor rule at `.cursor/rules/review.mdc`.

By default you get a new skill beside the source, which stays as it was, and a list of what did not carry over. Say "make this skill work with bmad" to convert in place instead; Smithy lists what will change first. An outside skill usually gains a description that triggers reliably, paths that work on other machines, configuration read from the project, and registration.

## Review

Review reads a skill and reports what to fix, and changes nothing. Use it on a skill Smithy did not write, or for a second opinion on one it did.

> Review `skills/acme-release-notes`.

A script measures the skill first, then five lenses read every file, each as a separate reader:

| Lens | Looks for |
| --- | --- |
| Architecture | Files, paths, shape, and registration |
| Determinism | What should be a script and what should be prose |
| Leanness | What a capable model would do unasked, and duplication |
| Customization | Settings that reach nothing, and overrides that cannot land |
| Trigger | The description against requests that should not fire it |

You get the findings in chat and as a file in the reports folder, ordered by severity, each with its file and fix. Edit mode applies the ones you accept, and cut mode suits leanness findings that run through the whole skill.

## Cut

Cut rewrites a skill's prose into fewer words without losing a rule. Use it on a skill built elsewhere, or one that has grown. A lean skill comes back nearly unchanged, and a bloated one much shorter.

> Cut this skill down. Keep the safety section word for word.

The description, an agent's persona, and any passage you name stay as written. A checker compares each file with its old version, and Smithy restores anything whose loss would change what the model does. Nothing is committed: you get a table of tokens saved per file, read the diff, and commit what you accept.

## Package

Package wraps skills you already have into a module, so `bmad` can set them up, recommend them, and check them for updates.

> Package `skills/acme-*` as a module.

Smithy shows one plan with the module's code, prefix, configuration questions, and files, and waits for your yes. One skill becomes a single-skill module, and several become a multi-skill module. Adding your prefix to a skill renames it, which changes how it is invoked, so Smithy asks first. See [Modules and Registration](modules.md).

## Validate

Validate reports what would stop a skill or module installing, loading, or firing, and writes nothing. Point it at a skill, a module, or a repository.

> Validate `skills/acme-release-notes`.

You get pass or fail, with one line per failure and its fix. It checks frontmatter and description, paths that do not resolve, scripts and their tests, module records and versions, and configuration a module asks for that no skill reads. An old-format module fails with [migrate](migrate-an-old-module.md) as the fix, and a memory agent with out-of-date scripts fails with [edit](#edit) as the fix. When the skill has trigger cases, Smithy offers a trigger eval.
