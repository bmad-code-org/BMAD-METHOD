---
title: 'Write a Good Skill'
description: 'The standard Smithy writes to and reviews against: outcomes over steps, what to cut, the description as the trigger, loading only what a run needs, and when to use a script.'
sidebar:
  order: 6
---

A skill is paid for on every run, in tokens and in the model's attention. A good skill holds what the model cannot work out for itself and little else. This page explains the standard Smithy writes to and reviews against, for when you write or judge a skill yourself.

## Write the Outcome, Not the Steps

Authors tend to script the path: phases, question banks, mandatory sections. A script is one imagined good session. Real sessions differ, and a model holding a rigid script spends its effort on following the script instead of solving the user's problem.

State where the work must end, and let the model find the way. An outcome-led skill holds five things:

| Part | What it says |
| --- | --- |
| Stance | Who the model is to the user |
| Outcome | What must exist at the end |
| Consumer | Who acts on it without having been in the conversation |
| Bar | What must be true of it for them |
| Non-inferables | Persona, conventions, wiring between systems, rules with consequences |

The consumer is the most useful line, because completeness, rigor, and tone all follow from it. A PRD that a team must act on without having heard the conversation has to state its scope and name its open questions; you do not need a step that says so.

## Cut What the Model Already Knows

Ask of every line whether a capable model would do this correctly without being told. If yes, cut it. A line stays only if you can name the different action the model takes without it.

Start each passage from one sentence that steers the model, then add a clause only when you can name the wrong action it prevents. A list of things the model could produce itself is explanation, not a rule.

Keep what the model cannot find by looking: the convention nobody wrote down, the reason behind a choice, the trap a config file does not reveal. Leave out what it can look up, such as a file's contents or a command's flags.

## Keep the Reason

Removing a reason is not leanness. A rule with its reason reaches cases you did not foresee, while a bare command gets applied literally. Replace all-caps `MUST` and `NEVER` with one sentence on the failure the rule prevents.

Say what to do instead of what to avoid, because a sentence about the wrong behavior puts it in front of the model. Keep a prohibition only when no positive form says the same thing.

## Make Instructions Easy to Follow

- Keep one topic to a paragraph, because a paragraph defines a rule's scope and packing several topics into one leaves the model guessing how far each rule reaches.
- Number only true sequences: numbering tells the model that order matters, so use numbered steps when later steps depend on earlier ones, and unordered list items for independent checks.
- End each step on something checkable rather than vague phrases like `"once it is clear"`, which let the model declare itself done early; name what must be true in terms the model can verify.
- Use one term for one thing, picking a word the model already knows over a coined term and using that same word consistently.
- Keep an example only if it fixes a shape: a format line beats a worked sample, so try the rule alone first and keep only the smallest fragment that fixes what still goes wrong.

Give exact steps only where a wrong move costs something:

| Freedom | Use it when | Write |
| --- | --- | --- |
| High | Several approaches are valid | A goal in prose |
| Medium | A preferred pattern exists | A template or format |
| Low | The operation is fragile or must be consistent | An exact command or script |

## Make the Description the Trigger

The description is all the model sees when deciding whether to load a skill, and every installed description is paid for on every session. Write two parts: a five-to-eight-word summary in the third person, then `Use when the user says` with the quoted phrases people type.

```yaml
description: 'Writes customer release notes from merged pull requests. Use when the user says ''write the release notes'' or ''what shipped since the last tag''.'
```

- Give each phrase its own situation; two wordings of one situation add length and no reach.
- Describe the user's problem rather than a tool's symptom.
- Add `Not for ...`, naming the sibling skill, only when a skill is stealing a neighbor's requests.
- Keep the procedure out, because a description that explains the steps lets the model skip loading the body.
- For a skill only ever called by name, write one line and set `disable-model-invocation: true` where your tool supports it.

An agent is the exception on length: its `Use when` starts with asking for it by name and then lists the phrases of every capability inside it. The validator enforces a ceiling of 1024 characters.

When a description fails, adjust its situations and boundaries rather than pasting the failed query into it. See [Eval Runner](bmad-eval.md#trigger-evals).

## Load Only What a Run Needs

`SKILL.md` is read on every run, while a reference file is read only when its branch is reached, so the metric that matters is how much a single run loads rather than total folder size. Move content that only some routes need into a reference file, and keep an entry whole when every run needs all of it. A complex workflow stays fast at any total size when each branch lives in its own file.

- Split by relevance rather than arbitrary line count, placing branch-only rules in references.
- Keep references one level deep so one reference never chains into another.
- Name a reference only at the branch where it is needed, not ahead of time.
- Make each file stand alone, because the entry prompt can scroll out of context in long chats.
- Hold every file a model reads to the same leanness standard, templates included.

## Use Scripts for Work with One Right Answer

A script handles work with one right answer per input: parsing, counting, resolving paths, validating structure, and rendering templates. Prose handles work that turns on meaning: judgment, tone, and deciding what to do with a result. Counting in prose wastes tokens and drifts between runs, whereas a script trying to judge phrasing breaks as soon as wording shifts.

A BMad script follows these rules:

- Python with a PEP 723 header, so `uv run` provides dependencies and the user installs nothing manually.
- Invoked as `uv run "{skill-root}/scripts/<name>.py"`, never `python`, `pip`, or a bare `scripts/x.py`.
- Supports `--help`, prints JSON on stdout when an agent reads the result, and exits non-zero with a clear reason on failure.
- Uses the Python standard library first, with no network calls unless the docstring explains why.
- Includes a `unittest` test outside the skill under `tests/` at the repository root (mirroring the skill's path under `skills/`) asserting deterministic script outputs.
- Hardcodes no model IDs, because users run skills across different models.

## Patterns Worth Using

| Pattern | What it does |
| --- | --- |
| Mine before you ask | Use what the user and conversation already gave, then ask only for the gaps |
| Intent before reading | Learn why the user is here before scanning documents so you can judge what matters |
| Capture without interrupting | Note information that arrives early and use it when it becomes relevant |
| A gentle gate | Ask `"anything else, or shall we move on?"` at natural breaks instead of forcing a rigid menu |
| Plan, then change | Write the planned changes, validate them with a script, apply them, and verify the result |
| Two outputs | Pair a readable human document with a dense summary for downstream skills |
| Parallel review | Send several reviewers with different lenses before finalizing work |
| A sequential fallback | Run subagent work inline when subagents are unavailable, and tell the user |

## Test It Against the Smallest Version

You cannot judge a skill's structure from inside one run. Write a stripped version of about five lines covering role, outcome, consumer, and any rule whose absence has caused real damage, then run both versions on the same input.

| What you see | What it means |
| --- | --- |
| The small one wins | The extra structure got in the way, so cut it |
| They tie | The extra structure adds no visible lift, so defend each line or remove it |
| The small one is rougher but recovers in a turn or two | You bought convenience rather than quality, which is a fair trade if intentional |
| The small one stays materially worse | The structure earned its place, for now |

The bare model is the floor, and it rises with every release. When a skill stops beating it, retire the skill. A variant or baseline run in [`bmad-eval`](bmad-eval.md) runs this comparison for you.
