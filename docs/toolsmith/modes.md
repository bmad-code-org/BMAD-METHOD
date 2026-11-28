---
title: 'Work on an Existing Skill'
description: 'Edit, convert, review, cut, package, validate, and migrate an existing skill or module with Smithy, plus quick links to build and eval modes.'
sidebar:
  order: 5
---

Smithy (`bmad-toolsmith`) works on skills that already exist, including prompts or rules originally written for other tools. Describe what you want in plain English, or use one of the mode codes below as a shortcut.

| Mode | Code | What you get | Say |
| --- | --- | --- | --- |
| [Edit](#edit) | `EDIT` | One agreed change, with nothing else disturbed | `"Change"`, `"fix"`, `"extend"`, `"add a step to"` |
| [Convert](#convert) | `CONVERT` | A skill from another tool rebuilt as a BMad skill | `"Convert my Cursor rule"`, `"make this skill work with bmad"` |
| [Review](#review) | `REVIEW` | A report of findings, with nothing changed | `"Review this skill"`, `"is this any good"` |
| [Cut](#cut) | `CUT` | The skill's prose rewritten shorter, left uncommitted | `"Cut this skill down"`, `"make it smaller"` |
| [Package](#package) | `PACKAGE` | One skill or several wrapped as a module | `"Package these"`, `"make this a module"` |
| [Validate](#validate) | `VALIDATE` | Pass or fail on what would stop it working | `"Validate"`, `"check my skill"` |
| [Migrate](migrate-an-old-module.md) | `MIGRATE` | An old-format module converted to the current format | `"I have an old module"` |

To start something new instead of modifying an existing skill, Smithy also supports `BUILD` (for a new skill, agent, module, or document template), `SCAFFOLD` (for boilerplate files you write yourself), and `LOGS` (to propose skills from past chat logs); see [Ways to Build a Skill](approaches.md). To measure a skill with baseline, variant, quality, trigger, or multi-skill `matrix` benchmarks, use `EVAL`; see [Eval Runner](bmad-eval.md).

Edit, convert, package, and migrate end with Smithy's ship checks: validation, an offered trigger eval, and hand-off guidance. Convert also runs the review lenses over what Smithy wrote, while edit, package, and migrate offer a review. Review and validate are read-only, and cut runs validators before leaving the final commit to you.

## Edit

Edit makes the change you ask for and leaves the rest of the skill untouched. Smithy tells you what changes, what stays, and whether the trigger description changes (since that affects when the skill loads), then waits for your approval.

```text
Add a step to my release-notes skill that links each entry to its pull request.
```

To rethink a skill from scratch rather than adjust it, ask for a new build using the old skill as input.

## Convert

Convert turns a skill, Cursor rule, custom GPT, slash command, or prompt you keep pasting into a BMad skill. It preserves your domain know-how and strips tool-specific mechanics such as `globs` or `$ARGUMENTS`. Point Smithy at the file, folder, or pasted text.

```text
Convert my Cursor rule at .cursor/rules/review.mdc.
```

By default you get a new skill beside the source (leaving the original untouched) plus a list of anything that did not carry over. Say `"make this skill work with bmad"` to convert in place instead; Smithy lists every planned change first. Converted skills typically gain a reliable trigger description, portable paths, project config reads, and module registration.

## Review

Review reads a skill and reports what to fix without changing any files. Use it on a skill you wrote by hand or for a second opinion on one Smithy built.

```text
Review skills/acme-release-notes.
```

A script measures the skill first, and then five review lenses read every file independently:

| Lens | Looks for |
| --- | --- |
| Architecture | Files, paths, shape, and registration |
| Determinism | What should be a script versus what belongs in prose |
| Leanness | Instructions a capable model already follows unasked, plus duplication |
| Customization | Settings that reach nothing, and overrides that cannot land |
| Trigger | Description phrases that miss real prompts or fire on near misses |

Findings appear both in chat and in a saved report inside Smithy's reports folder, ordered by severity with each file and proposed fix. Use edit mode to apply individual fixes, or cut mode when leanness findings span the whole skill.

## Cut

Cut tightens a skill's prose into fewer tokens without losing a single rule. Use it on a skill imported from elsewhere or one that has grown over time. A lean skill comes back nearly unchanged, while a wordy one shrinks substantially.

```text
Cut this skill down. Keep the safety section word for word.
```

The trigger description, an agent's persona, and any passage you mark as protected stay verbatim. A checker compares each shortened file against the original, and Smithy restores anything whose removal would change what the model does. Nothing is committed automatically: you receive a table of tokens saved per file, inspect the diff, and commit what you accept.

## Package

Package wraps skills you already have into a BMad module so `bmad` can set them up, recommend them in help, and check them for updates.

```text
Package skills/acme-* as a module.
```

Smithy presents one plan covering the module code, prefix, setup questions, and files, and waits for your approval. One skill becomes a single-skill module, while several become a multi-skill module. Because adding a prefix renames a skill and changes how it is invoked, Smithy asks before renaming anything. See [Modules and Registration](modules.md).

## Validate

Validate reports anything that would stop a skill or module from installing, loading, or firing, without editing any files. Point Smithy at a skill, a module, or a whole repository.

```text
Validate skills/acme-release-notes.
```

You get a clear pass or fail with one line per issue and how to fix it. Validation checks frontmatter and descriptions, unresolved file paths, scripts and their tests, module manifests and versions, and module setup questions that no skill reads. An old-format module points to [migrate](migrate-an-old-module.md), and a memory agent with out-of-date scripts points to [edit](#edit). When trigger test cases exist, Smithy also offers to run a trigger eval.
