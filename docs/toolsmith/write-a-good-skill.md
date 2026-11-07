---
title: 'Write a Good Skill'
description: 'The standard Smithy writes to and reviews against: outcomes over steps, what to cut, the description as the trigger, loading only what a run needs, and when to use a script.'
sidebar:
  order: 6
---

A skill is paid for on every run, in tokens and in the model's attention. A good skill holds what the model cannot work out for itself and little else. This page explains the standard Smithy writes to and reviews against, for when you write or judge a skill yourself.

## Write the Outcome, Not the Steps

Authors tend to script the path: phases, question banks, mandatory sections. A script is one imagined good session. Real sessions differ, and a model holding a script spends its effort on following it.

State where the work must end, and let the model find the way. An outcome-led skill holds five things:

| Part | What it says |
| --- | --- |
| Stance | Who the model is to the user |
| Outcome | What must exist at the end |
| Consumer | Who acts on it without having been in the conversation |
| Bar | What must be true of it for them |
| Non-inferables | Persona, conventions, wiring between systems, rules with consequences |

The consumer is the most useful line, because completeness, rigor, and tone all follow from it. A PRD that a team must act on without having heard the conversation has to state its scope and name its open questions. You do not need a step that says so.

## Cut What the Model Already Knows

Ask of every line whether a capable model would do this correctly without being told. If yes, cut it. A line stays only if you can name the different action the model takes without it.

Start each passage from one sentence that steers the model, then add a clause only when you can name the wrong action it prevents. A list of things the model could produce itself is explanation, not a rule.

Keep what the model cannot find by looking: the convention nobody wrote down, the reason behind a choice, the trap a config file does not reveal. Leave out what it can look up, such as a file's contents or a command's flags.

## Keep the Reason

Removing a reason is not leanness. A rule with its reason reaches cases you did not foresee, and a bare command gets applied literally. Replace all-caps MUST and NEVER with one sentence on the failure the rule prevents.

Say what to do instead of what to avoid, because a sentence about the wrong behavior puts it in front of the model. Keep a prohibition only when no positive form says the same thing.

## Make Instructions Easy to Follow

- **One topic to a paragraph.** A paragraph is a rule's scope, so a paragraph of several topics leaves the model guessing how far each rule reaches.
- **Number only true sequences.** Numbering tells the model that order matters. Use numbers for steps that feed each other, and bullets for independent ones.
- **End each step on something checkable.** "Once it is clear" lets the model declare itself done early. Name what must be true, in terms the model can verify.
- **Use one term for one thing.** Use a word the model already knows over a coined term, and keep using the same word.
- **Keep an example only if it fixes a shape.** A format line beats a worked sample. Try the rule alone first, and keep the smallest fragment that fixes what still goes wrong.

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

- Give each phrase its own situation. Two wordings of one situation add length and no reach.
- Describe the user's problem, not a tool's symptom.
- Add `Not for ...`, naming the sibling skill, only when a skill is taking a neighbor's requests.
- Keep the procedure out. A description that explains the steps lets the model skip the body.
- For a skill only ever called by name, write one line and set `disable-model-invocation: true` where your tool supports it.

An agent is the exception on length. Its `Use when` starts with asking for it by name, then lists the phrases of every capability inside it. The validator enforces a ceiling of 1024 characters.

When a description fails, change its situations and boundaries. Do not paste the failed query into it. See [Eval Runner](bmad-eval.md#trigger-evals).

## Load Only What a Run Needs

`SKILL.md` is read on every run, and a reference is read only when its branch is reached. So the question is how much one run loads, not how big the skill is. A plain skill's entry aims near 800 tokens, and an agent's near 1,200. A complex workflow is the right size at any total when each branch sits in its own file.

- Split by relevance, not size. What only some branches need goes in a reference.
- Keep references one level deep. A reference never loads another.
- Name a reference when its branch is reached, not ahead of it.
- Make each file stand alone, because the entry can drop out of context.
- Hold every file a model reads to the same standard, including templates.

## Use Scripts for Work with One Right Answer

A script does work with one right answer per input: parsing, counting, resolving paths, validating structure, rendering a template. Prose does work that turns on meaning: judgment, tone, what to do with a result. Counting in prose costs tokens and comes out different each run. A script that decides what a sentence means breaks when the wording shifts.

A BMad script follows these rules:

- Python with a PEP 723 header, so `uv run` provides the dependencies and the user installs nothing.
- Run as `uv run {skill-root}/scripts/<name>.py`, never `python`, `pip`, or a bare `scripts/x.py`.
- `--help`, JSON on stdout when the agent reads the result, and a non-zero exit with a reason.
- Standard library first, with no network unless the docstring says why.
- A `unittest` test at `scripts/tests/test_<name>.py`, asserting what the script produced.
- No model ids, because users run any model.

## Patterns Worth Using

| Pattern | What it does |
| --- | --- |
| Mine before you ask | Use what the user and the conversation already gave, then ask only for the gaps |
| Intent before reading | Learn why the user is here before scanning documents, so you can judge what matters |
| Capture without interrupting | Note information that arrives early, and use it when it becomes relevant |
| A gentle gate | Ask "anything else, or shall we move on?" at natural breaks instead of a hard menu |
| Plan, then change | Write the planned changes, validate them with a script, apply them, and verify the result |
| Two outputs | Pair a human document with a dense summary for downstream skills |
| Parallel review | Send several reviewers with different lenses before you finalize work |
| A sequential fallback | Run subagent work inline when subagents are unavailable, and say so |

## Test It Against the Smallest Version

You cannot judge a skill's structure from inside one run. Write a version of about five lines: role, outcome, consumer, and any rule whose absence has done damage. Run both on the same input.

| What you see | What it means |
| --- | --- |
| The small one wins | The structure was in the way, so cut it |
| They tie | The structure adds nothing you can see, so defend each line or remove it |
| The small one is rougher but recovers in a turn or two | You bought convenience, not quality, which is allowed |
| The small one stays materially worse | The structure earned its place, for now |

The bare model is the floor, and it rises with every release. When a skill stops beating it, retire the skill. A variant or baseline run in [`bmad-eval`](bmad-eval.md) does this comparison for you.
