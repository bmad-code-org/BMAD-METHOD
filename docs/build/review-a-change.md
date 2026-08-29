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
hand it the spec from that run — the one already marked `status: done`.
That skips straight to review and triage, and you can repeat it as many
times as you want. Stop when the findings are mostly low-value notes
about exotic corner cases. That is accidental complexity, not quality.
Non-trivial findings on a third pass of agentic review usually mean
something is wrong upstream of this change: a weak spec, a
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

The skill writes a unified diff to a file, confirms the target and spec
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
you. Without a spec, decision needed is not used — those findings go to
patch or defer.

You get a findings summary. Without a spec, that listing stays in the
chat. You choose whether to apply patches.

## Customize the Layers

The shipped lenses are a starting point. Start `bmad-customize` and
ask what you can change.

Override `[[workflow.review_layers]]` in
`_bmad/custom/bmad-code-review.toml`. The skill ships four layers:
`blind-hunter`, `edge-case-hunter`, `verification-gap`, and
`acceptance-auditor`. Empty `instruction` on an existing `id` disables
that layer. A `when` field gates a layer. A new `id` appends.
`instruction` may be bash.

```toml
# _bmad/custom/bmad-code-review.toml
[[workflow.review_layers]]
id = "blind-hunter"
instruction = ""
[[workflow.review_layers]]
id = "acceptance-auditor"
when = 'Only when {review_mode} = "full".'
[[workflow.review_layers]]
id = "security-bot"
name = "Security bot"
instruction = """
Run the team reviewer via bash on {diff_file} and return its findings as a Markdown list.
"""
```

For how overrides merge, see [Customize BMad](../how-to/customize-bmad.md).

## Why Does Review Take Forever?

Three explanations:

- [Exhaustive on purpose](#exhaustive-on-purpose)
- [Too many rules, or huge files](#too-many-rules-or-huge-files)
- [Your platform](#your-platform)

### Exhaustive on purpose

The default assumes an average bug escaping into production is worth
more than an hour of inference. You can turn that down, or off — see
[Customize the Layers](#customize-the-layers). Turning review off is
reasonable for a throwaway prototype. A long review can also run
offline.

It is a bad idea to let teammates look at unreviewed LLM-generated
code. It is a worse idea to put that code into production without the
full battery of review lenses. If you care about the quality of the
product, think about more lenses, not fewer.

Do not take anyone's word for it. Pick a handful of interesting
changes, run the full battery, look at one or two of the most
interesting findings, and ask which is better: extra token burn, or
living with those issues in production.

Your custom lenses can run on other models. That is worth doing. Run
several `blind-hunter` lenses with the same prompt, one on every LLM
you have access to.

### Too many rules, or huge files

There are too many rules in `AGENTS.md` and the other instruction files
the agent reads every run. Or the codebase is shaped so a reviewing
agent has to read huge files. Those files blow the context window, or
the agent wastes the run figuring out how to avoid them without losing
review quality.

### Your platform

Some runtimes have no subagents. Vendors, including Anthropic and
OpenAI, have also shipped changes that alter how subagents run. Until
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
[Customize the Layers](#customize-the-layers).
