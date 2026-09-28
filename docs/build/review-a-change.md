---
title: 'Review a Change'
description: Use bmad-code-review for a standalone agentic review of a PR, someone else's change, an extra pass, or a review bot.
sidebar:
  order: 2
---
Ten seconds of your attention costs more than ten minutes of inference.
A bug that escapes to production costs at least a hundred times more
than one caught in development.

Code an agent just wrote can — and should — be reviewed and cleaned up
by an agent before any human looks at it.

If you came from [Build a Change](build-a-change.md), you have already
seen this happen. `bmad-build` has a review and triage stage baked in.
By the time it finishes, a round of review and fixing has already
happened.

If you still suspect there is more to find, run `bmad-build` again and
hand it the plan from that run — the one it left at `status: built`.
That skips straight to review and triage, and you can repeat it as many
times as you want. Once you mark the ticket done, the build treats its
plan as context for new work instead. Stop when the findings are mostly
low-value notes about exotic corner cases. That is accidental
complexity, not quality.
Non-trivial findings on a third pass of agentic review usually mean
something is wrong upstream of this change: weak internal design, a
contradiction, or ambiguity in the rules. Fix that instead of running
another pass.

To review a change that is not a single `bmad-build` run, use
`bmad-code-review`. It is the same kind of review and triage, but you
can point it at any code artifact: a diff, a pull request, a file, a
namespace, someone else's branch. See
[how a run works](#run-bmad-code-review).

## Run `bmad-code-review`

Start a fresh chat and name the skill. Pass the change to review: a PR,
commit, branch, file, or the current git state. You can describe the
target before, with, or after the command.

If you have a spec, requirements, or even a stream of consciousness
for what this change is supposed to implement, feed that in too. Review
quality depends on it — without intent, the reviewers can only judge
the diff against itself.

```text
run code review
```

```text
/bmad-code-review Review https://github.com/org/repo/pull/42
```

With no target named, it looks in the ticket tree for tickets in review
and offers them. Pick one and it reviews everything since the
`baseline_revision` recorded in that ticket's plan, with the plan as the
intent. You can also hand it a plan file directly.

Without a plan, the review runs in **no-plan mode**. The reviewers judge
the diff against itself and the commit messages, and triage cannot tell
a deliberate choice from a mistake, so a finding that needs your
decision is patched or deferred instead. A generic "review this PR" bot
is the usual way to end up here. It still finds real bugs, but it is
much more useful when it knows the intent: a whole review pass exists to
check whether the change does what it claims, and it can only run if it
is told what the claims are. So make sure the bot always knows where the
claims are. Have it pass the PR description to the review every time,
and the ticket's plan when possible.

The skill writes a unified diff to a file, confirms the target and plan
context with you, then launches the reviewers. This works best on a
platform that can spawn subagents, or at least call another model from
the command line and wait for a result.

## What a Run Does

Active layers review the same diff independently and in parallel. Once
every layer has reported, triage judges each finding on its own:

- **Verify** the claimed consequence at the named location, reading past
  the diff hunk far enough to tell whether that consequence actually
  occurs
- **Assign severity** from the verified consequence (`low`, `medium`,
  `high`)
- **Dismiss** noise, refuted claims, and unsubstantiated claims, with a
  recorded reason — never silently
- **Route** survivors to **patch**, **defer**, or **decision needed**

Patch is an unambiguous code fix. Defer is a real pre-existing issue that
is not this change. Decision needed is an ambiguous choice that requires
you. Without a plan, decision needed is not used — those findings go to
patch or defer.

You get a findings summary. With a plan, each run appends a dated block
of findings to the plan's `## Code Review` section; without one, the
listing stays in the chat. You choose whether to apply patches. The
review never changes the ticket's status: marking it done is yours.

## Choose the Depth

Out of the box, you get two review depths to choose from: `quick` and
`thorough`.

`bmad-build` and `bmad-build-auto` default to **quick**: one reviewer,
several times cheaper and somewhat faster than thorough.
`bmad-code-review` defaults to **thorough**: several reviewers, each
with a different lens. Slow, expensive, tuned to find as many problems
as possible.

Quick is good enough for small simple changes or throwaway prototypes.
Thorough is highly recommended for any serious work with production
consequences. In the latter situation, a good compromise is to default
to quick reviews inside the personal development cycle (selectively
bumping up to `thorough` on high risk changes), but to make sure that
every commit or pull request is passing through `bmad-code-review` on
`thorough` setting eventually. E.g., by a PR review bot.

Say `thorough` or `quick` when you invoke a skill to override its
default for one run. To permanently change a skill's default, start
`bmad-customize` and ask.

## Customize the Lenses

Next level of customizing reviews is to change the lenses themselves.
You can add your own reviewers, replace or turn off the ones you get out
of the box, run some on another model. Start `bmad-customize` and ask
what is possible.

## Why Does Review Take Forever?

Three explanations:

- [Exhaustive on purpose](#exhaustive-on-purpose)
- [Too many rules, or huge files](#too-many-rules-or-huge-files)
- [Your platform](#your-platform)

### Exhaustive on purpose

Thorough review assumes an average bug escaping into production is worth
more than an hour of inference. You can turn that down — see [Choose the
Depth](#choose-the-depth) - or even skip review altogether. A long
review can also run offline.

It is a bad idea to let teammates look at unreviewed LLM-generated code.
It is a worse idea to put that code into production. If you care about
the quality of the product, think about more lenses, not fewer.

Do not take anyone's word for it. Pick a handful of interesting
changes, run the full battery, look at one or two of the most
interesting findings, and ask which is better: extra token burn, or
living with those issues in production.

### Too many rules, or huge files

There are too many rules in `AGENTS.md` and the other instruction files
the agent reads every run. Or the codebase is shaped so a reviewing
agent has to read huge files. Those files blow the context window, or
the agent wastes the run figuring out how to avoid them without losing
review quality.

### Your platform

Some runtimes have no subagents. Vendors, including Anthropic and
OpenAI, sometimes ship changes that alter how subagents run. Until
BMad catches up, the lenses execute one after another instead of in
parallel — or they fall back to the main session, which is far worse
for review quality than it sounds.

If a review that usually runs for ten minutes suddenly takes an hour,
or becomes inexplicably stupid, resume that session and ask why.

## Why Do I Need This When My Platform Has `/code-review`?

Typical `/code-review` is much simpler, and finds fewer problems. Or it
is a black box you have no control over, running on cheap models,
putting a ton of noise in front of your eyes — and ten seconds of your
attention are worth more than ten minutes of inference. Or it is great,
but really expensive, and still a generic black box.

Almost none of them, at the time of this writing, do automatic
triage/fixing that holds up.

Or maybe it is in fact just great, and BMad review is inferior. Same
test as above: take several interesting diffs, run an A/B, and either
pick one, or make the built-in command an extra lens. If you find
something that genuinely adds quality findings without creating too
much noise, it is almost always worth adding as a lens — see
[Customize the Lenses](#customize-the-lenses).
