---
title: 'Work on an Existing Skill'
description: 'Edit, convert, review, cut, package, validate, and migrate an existing skill or module with Smithy.'
sidebar:
  order: 4
---

Smithy also works on skills that already exist, including ones built elsewhere.

The sections for the other modes are being written.

## Cut

The cut mode (menu code `CUT`) rewrites a skill's prose into the fewest words that steer the model as far, without losing a rule. It drops sentences the model does not need, trims the words inside sentences that carry nothing, and recasts a passage that spends lines on a nudge as the few words that give it. There is no percentage to hit: a lean skill comes back nearly unchanged, and a bloated one comes back much shorter. Ask Smithy to "optimize this skill", "cut this skill down" or "make this skill BMad compliant". It is for a skill built elsewhere, or one you want tightened. A skill Smithy builds or converts gets the same treatment before it ships: Smithy applies every finding from its leanness review, then runs the same check for lost rules.

It takes two things:

- The skill to cut.
- Passages to keep word for word: by default each file's frontmatter, which holds the description, an agent's `customize.toml` with its persona, and the parts a rendered skill copies from its shape template, plus any passage, section or decision you name and the `Decision:` lines in the skill's ticket when it has one.

Smithy copies the skill as it stands and counts the tokens in each prompt file, skipping files under about 150 tokens and the protected ones. It removes worked examples first, keeping one only when a one-line format cannot show the same shape. Then one subagent rewrites each file in parallel. A script confirms each file still has every template expression, `{skill-root}` or `{project-root}` path, frontmatter and protected passage it had, and Smithy restores any it lost. A checker compares each file with its old version and lists a loss only when it can name the different action the model would take without the line, and points to passages that fewer words would say as well. Smithy restores those losses and applies the shorter wordings it agrees with. The skill's validation checks run, and the render test for a rendered skill.

Nothing is committed. Smithy shows a table of tokens before and after for each file with the percent saved, the losses it chose not to restore, and the points the cutters were unsure of. You read the diff and commit what you accept. Without subagents, Smithy runs each role itself, one file at a time, and says so.
