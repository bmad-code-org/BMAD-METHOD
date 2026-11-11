# Lens: leanness

Lane: whether every line beats its own absence, and whether what survives is a goal. The bar is `canon.md`, applied line by line; cite its tests, do not restate them.

Start from the smallest version: for every paragraph of every prompt file, however short, write the one sentence that steers the model as far (canon test 2), then name the wrong action each remaining clause prevents.

- Core-test failures: lines a capable model follows unprompted. "Make sure", "don't forget", templates that teach markdown, mechanics of a tool the model drives fluently, scoring formulas for judgment. Low for a single line, high for a passage.
- A passage one sentence could replace: high. `proposed_smallest` holds the sentence and `predicted_delta` the actions lost, often none.
- A paragraph of several topics or a sentence of several decisions (canon test 9); `long_paragraphs` in the pre-pass points at the likely ones. Medium, high when a rule's reach is unclear; `proposed_smallest` holds the split.
- Meta-explanation of the system to itself, negative space ("this no longer does"), facts restated across sections: medium.
- Numbered lists that are not sequences: independent steps the model will march through. Medium; the recommendation holds the goal sentence that replaces them. A sequence guarding a named failure stays.
- ALL-CAPS MUST, ALWAYS, NEVER and stacked imperatives: medium; recommend the failure the rule prevents, in plain words.
- A stripped why: a non-obvious rule with no reason, so it cannot reach the unforeseen case. Medium; under-writing, not leanness.
- The same point in two places: medium; name the one place it belongs. A step that ends on a bound the model cannot check ("when it is clear", "once done"): medium; recommend the condition that closes it.
- A prohibition where a positive form says the same, or a coined term and adjective runs where one word the model knows would do: low; recommend the positive sentence or the word.
- Content the model could get by looking, a file's contents, a command's flags, copied into the skill: low, since it goes stale.
- A worked artifact where a format line would do: medium; recommend the line, or a pointer to the project's own instances, per test 8 in `canon.md`.
- A section that cannot name where its elaborate form beats a five-line version (role, outcome, consumer, the scarred rules): write the five lines into `proposed_smallest` and the predicted loss, often nothing, into `predicted_delta`; `ship.md` and `modes/cut.md` apply it, and a variant eval through the `bmad-eval` skill measures it when the user doubts the cut. High for a section, medium for a paragraph.

Not flagged: persona voice in an agent (identity, communication style, principles, examples of voice): the bar applies to capability prompts, and a flatter persona is a worse outcome, not a leaner one; repetition or contradiction inside persona text still counts. A menu item whose prompt is a sentence with no capability file: it is listed for the user to see what is on offer, and the model does the rest. The other lenses' lanes. Critical only for friction that misleads the model into a wrong action.
