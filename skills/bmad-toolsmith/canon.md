# Outcome-Driven Prompt Quality

Every line you write competes with the version of itself that was never written. State the destination, then make every remaining line survive the tests.

## Write the destination, not the route

Asked to build a prompt, you will script the path: phases, question banks, mandatory sections. It feels like diligence; it is the central defect. A script is your imagined transcript of one good session; real sessions diverge, and a model holding one spends its intelligence on compliance.

Write the destination instead. A goal-stated prompt holds five things: the **stance** (who the model is to the user), the **outcome** (what must exist), the **consumer** (who acts on it without the conversation in the room), the **bar** (what they need true of it), and the **non-inferables** (persona, posture, institutional knowledge, wiring, rules with consequences). Then stop; the outcome and its consumer imply the process. The consumer is the highest-leverage line: completeness, rigor and tone derive from it.

The shape in miniature, a complete facilitation skill:

```text
Act as the user's product-thinking partner: they hold the product knowledge;
you hold the craft of drawing it out, pressure-testing it, and structuring it.
You are not an interviewer with a form and not a ghostwriter.

The outcome is a PRD at {output_folder}/prd.md that a team — human or AI —
can act on without this conversation in the room. That consumer sets the bar:
every requirement traceable to a need and stated so someone could test whether
it was met; scope edges explicit, including what is out; open questions named
as open rather than papered over.

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

When a line exists because of a failure you saw, decide what kind of failure it was before writing the line, since each kind takes a different form. A rule the model skipped takes the rule with its reason. Output in the wrong shape takes a contract that says what the output is. A piece left out takes a slot in the template where it goes. A wrong move under some condition takes that condition, stated as something the model can observe. A fix in the wrong form patches nothing.

## The tests

They apply to every file a model reads: the entry, each reference, each route or capability file, each template whose text a model will read. A skill judged by its entry alone has most of its text unjudged.

1. **The core test.** Would a capable model do this correctly without being told? If yes, cut. A line earns its place only by preventing a failure.
2. **Truncate before you delete.** Most long lines hide a needed nudge wrapped in explanation. Keep the instruction and the one clause of why.
3. **Keep the why behind a non-obvious goal.** Without its reason a rule cannot reach the case you did not foresee. A stripped why is under-writing, not leanness.
4. **Write what survives as a goal.** State intent and let the model find the path. Exact procedure only where a wrong move costs something.
5. **Number only true sequences.** Numbering says order matters, so the model marches. Number steps that feed each other; bullet independent ones; steps that were never separate are one goal sentence.
6. **Carve by relevance, not size.** The entry is paid on every invocation; a reference only when its branch fires. Carve what only some branches need and keep a routing map in the entry; leave what is too small to repay the indirection. A small skill is one file; a reference exists only when a branch has earned it. The budget is for what one run loads, not for the skill as a whole: a complex workflow is the right size when each branch sits in its own file and loads only when reached, whatever the total comes to. A carved file stands alone, because the entry can drop from context, and references stay one level deep.
7. **Close every step on a condition the model can check.** A step that ends on "once it is clear" or "when ready" lets the model declare itself done early. Name what has to be true at the end, covering everything the step touched, and make it something the model can verify from what is in front of it.

## Explain the why, not the MUST

ALL-CAPS MUST, ALWAYS and NEVER mean the prompt is patching a symptom the author once saw. A model braces against a command and applies it literally; a rule with its reason survives the case the author did not foresee. Write the failure the rule prevents, once.

Say what to do rather than what to avoid. A sentence about the wrong behaviour puts that behaviour in front of the model; a sentence about the right one leaves it out. Keep a prohibition only where no positive form says the same thing, and put the right behaviour beside it.

## Use words the model already holds

A term the model met in training arrives with its meaning attached: idempotent, read-back, dry run. Choose it over a coined term, which costs its definition on every use, and over a run of adjectives that circle it. Having chosen the word, reuse it as it is; each paraphrase spends tokens and loosens the meaning. A term only this skill uses is a sign the plain word was not looked for.

## The description is the trigger

The description is all the model sees when deciding whether to load the skill, so it is the whole trigger. Third person: what the skill does, then `Use when` with the phrases and contexts a user types, then what it is not for. Anchors beat adjectives: file types, tool names, artifact names, the sibling skill that takes the near miss. Aim under 500 characters; 1024 is the ceiling the validator enforces, not the target, and every character here is paid on every session. Each `Use when` clause covers a different situation; two wordings of one situation are one clause. Name the user's problem rather than a tool's symptom, unless the skill is about that tool. All "when to use" lives here, none in the body, which is read only after the choice. A description that explains the procedure lets the model skip the body and improvise. A skill only ever called by name needs no trigger at all: where the host honours `disable-model-invocation: true`, set it and let the description be one line for the human.

## Who reads this

Your reader is a model whose whole world is what you wrote. Every test asks: does the line change how it acts or judges? Cut meta-explanation, negative space, restated facts, and mechanics belonging in the file that performs them. A point made in two places is the surest sign the text was never run against real input; keep it in the one place it belongs. What the model can find by looking, a file's contents, a command's help, a flag, stays in the environment, where it cannot go stale. The skill carries what looking does not reveal: the convention nobody wrote down, the reason behind a choice, the trap a config file does not confess.

## The two-version comparison

You cannot judge structure from inside one run. Write the smallest version, around five lines: role, outcome, consumer, and any rule whose absence has done damage. Run both on the same input.

| What you see | What it means |
| --- | --- |
| Small one wins | The structure was a straitjacket. Cut it. |
| They tie | The structure is decoration. Defend each line or kill it. |
| Small one rougher but recoverable in a turn or two | You bought convenience, not quality. Allowed, if you are honest about it. |
| Small one materially worse and stays worse | The structure earned its keep, for now. |

Cheaper signals: one input five times (identical means over-determined, scattered means under-specified); different inputs (alike outputs mean the template out-shouts the input); steps marched in order.

## The deeper floor

Below your small version sits the bare model, and it rises with every release. What survives is what the model cannot do for itself: paths, downstream contracts, wiring between systems, knowledge that lives nowhere else. When a capability stops beating the bare model, retire it.

## The habit

For each section: what single outcome do you want? What does the model already know there, usually most of it? What does it need that it cannot infer: persona, posture, wiring, schemas, rules with consequences? Whatever remains is structure you impose; if you cannot say what it buys, it is over-structure.
