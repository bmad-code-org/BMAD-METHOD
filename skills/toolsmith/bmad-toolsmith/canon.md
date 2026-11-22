# Outcome-Driven Prompt Quality

State the destination, then make every remaining line pass the tests.

## Write the destination, not the route

Asked to build a prompt, you will script the path: phases, question banks, mandatory sections. It feels like diligence; it is the central defect. A script is your imagined transcript of one good session; real sessions diverge, and a model holding one spends its intelligence on compliance.

Write the destination instead. A goal-stated prompt holds five things: the **stance** (who the model is to the user), the **outcome** (what must exist), the **consumer** (who acts on the output without having seen the conversation), the **bar** (what they need true of it), and the **non-inferables** (persona, posture, institutional knowledge, wiring, rules with consequences). Then stop; the outcome and its consumer imply the process. The consumer is the highest-leverage line: completeness, rigor and tone derive from it.

The shape in miniature, a complete facilitation skill:

```text
Act as the user's product-thinking partner: they hold the product knowledge;
you hold the craft of drawing it out, pressure-testing it, and structuring it.
You are not an interviewer with a form and not a ghostwriter.

The outcome is a PRD at {output_folder}/prd.md that a team — human or AI —
can act on without having had the conversation that will unfold when creating the PRD. That consumer sets the bar:
every requirement traceable to a need and stated so someone could test whether it was met; scope edges explicit, including what is out; open questions named as open rather than papered over.

Open the floor before any structured work, and mine what you already hold
before asking anything; then work the gaps a question or two at a time.
Your value is the pushback: the user they forgot, the edge case that breaks
the happy path, the scope that doubled in one sentence, the metric nobody
can measure. A PRD that transcribes the first idea is a failure however
well formatted.

Draft sections as the thinking firms up and show them; when one is
confirmed, write it and move on.
```

A script would subtract adaptivity: a user with a full brief gets gap analysis, not a question bank.

When a line exists because of a failure you saw, name the kind of failure before writing the line; each kind takes a different fix:

- A rule the model skipped: the rule with its reason.
- Output in the wrong shape: a contract that says what the output is.
- A piece left out: a slot in the template where it goes.
- A wrong move under some condition: that condition, stated as something the model can observe.

## The tests

They apply to every file a model reads: the entry, each reference, each route or capability file, each template whose text a model will read. A skill judged by its entry alone has most of its text unjudged.

1. **The core test.** Would a capable model do this correctly without being told? If yes, cut. A line stays only when you can name the different action the model takes without it.
2. **Start from one sentence.** Write each passage as the one sentence that steers the model, then add a clause only when you can name the wrong action it prevents. A list the model could produce itself is explanation, not a rule.
3. **Keep the why behind a non-obvious goal.** Without its reason a rule cannot reach the case you did not foresee. A stripped why is under-writing, not leanness.
4. **Write what survives as a goal.** State intent and let the model find the path. Exact procedure only where a wrong move costs something.
5. **Number only true sequences.** Numbering says order matters, so the model marches. Number steps that feed each other; bullet independent ones; steps that were never separate are one goal sentence when that sentence stays short.
6. **Carve by relevance, not size.** The entry is paid on every invocation, a reference only when its branch fires: carve what only some branches need, keep a routing map in the entry, and leave in place what is too small to repay the indirection. The budget is what one run loads, not the skill's total. A carved file stands alone, because the entry can drop from context; references stay one level deep.
7. **Close every step on a condition the model can check.** A step that ends on "once it is clear" or "when ready" lets the model declare itself done early. Name what has to be true at the end, covering everything the step touched, and make it something the model can verify from what is in front of it.
8. **Keep an example only when it fixes a shape.** A format line beats a worked artifact. Delete the example and run the rule alone on a fresh model: if the output conforms, the example was explanation; if it diverges in a way one more clause cannot fix, keep the smallest fragment that shows the divergence, beside the rule it fixes. General knowledge, such as what a good bug report looks like, needs no example. Where the project will hold its own instances after the first run, point at those rather than ship a sample.
9. **One topic to a paragraph.** A rule's paragraph or section is its scope, so a paragraph of several topics leaves the model guessing how far each rule reaches. Give each topic its own paragraph or heading and each decision its own sentence; bullet what is enumerable and write conditional logic as cases.

## Explain the why, not the MUST

ALL-CAPS MUST, ALWAYS and NEVER mean the prompt is patching a symptom the author once saw. A model applies a bare command literally; a rule with its reason reaches the case the author did not foresee. Write the failure the rule prevents, once.

Say what to do rather than what to avoid. A sentence about the wrong behaviour puts that behaviour in front of the model; a sentence about the right one leaves it out. Keep a prohibition only where no positive form says the same thing, and put the right behaviour beside it.

## Use words the model already holds

A term the model met in training arrives with its meaning attached: idempotent, execution plan, dry run. Choose it over a coined term, which costs its definition on every use, and over a run of adjectives that circle it. Having chosen the word, reuse it as it is; each paraphrase spends tokens and loosens the meaning. A term only this skill uses is a sign the plain word was not looked for.

## The description is the trigger

The description is all the model sees when deciding whether to load the skill, so it is the whole trigger, and every character of it is paid on every session whether the skill fires or not. Two parts: a five-to-eight-word summary of what the skill does, in the third person, then `Use when the user says 'phrase' or 'phrase'.` with the quoted phrases a user types.

Most BMad skills are asked for explicitly, so default to those phrases; describe a context ("when code imports the anthropic SDK") only for a skill that must fire unasked. Anchors beat adjectives: file types, tool names, artifact names. Each phrase covers a different situation; two wordings of one situation are one phrase. Name the user's problem rather than a tool's symptom, unless the skill is about that tool. Add `Not for ...`, naming the sibling skill, only when a trigger eval or a known sibling shows the skill taking its neighbour's requests.

An agent's `Use when` opens with the user asking to talk to it by name, then carries the phrases and concepts of every capability that lives inside it, because the agent's description is the only trigger those capabilities have; a menu item that invokes an installed skill needs none, since that skill triggers itself. The summary stays short; the phrase list grows with the agent's internal capabilities and is not cut to a length.

1024 characters is the ceiling the validator enforces, never a target. All "when to use" lives here, none in the body, which is read only after the choice. A description that explains the procedure lets the model skip the body and improvise.

A skill only ever invoked by its name, as a slash command, needs no trigger at all: where the host honours `disable-model-invocation: true`, set it and let the description be one line for the human.

## Who reads this

Your reader is a model that knows only what you wrote and what it can look up. Cut meta-explanation, notes on what the text no longer does, restated facts, and mechanics belonging in the file that performs them. Say each point once, in the place it belongs. What the model can find by looking, a file's contents, a command's help, a flag, stays in the environment, where it cannot go stale.

## The two-version comparison

You cannot judge structure from inside one run. Write the smallest version, around five lines: role, outcome, consumer, and any rule whose absence has done damage. Run both on the same input.

| What you see | What it means |
| --- | --- |
| Small one wins | The structure made the output worse. Cut it. |
| They tie | The structure adds nothing. Keep only the lines you can justify. |
| Small one rougher but recoverable in a turn or two | The structure adds convenience only. Keep it, and say that is why. |
| Small one materially worse and stays worse | The structure is needed, for now. |

Cheaper signals: one input five times (identical means over-determined, scattered means under-specified); different inputs (alike outputs mean the template overrides the input); steps followed in a fixed order.

## The bare model

Below your small version sits the bare model, which improves with every release. When a capability stops beating it, retire it.
