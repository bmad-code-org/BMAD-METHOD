# Lens: leanness

Lane: whether every line beats its own absence, and whether what survives is a goal. The bar is the canon, applied line by line; cite its tests, do not restate them.

Start from the smallest version: for every paragraph of every prompt file, however short, write the one sentence that steers the model as far (canon test 2), then name the wrong action each remaining clause prevents. When the target is too large for that, take rule lists and long paragraphs first and name what was left in the verdict.

Severity follows size unless a bullet says otherwise: a line low, a paragraph medium, a section high. Critical only for friction that misleads the model into a wrong action.

- Core-test failures: lines a capable model follows unprompted. "Make sure", "don't forget", templates that teach markdown, mechanics of a tool the model drives fluently, scoring formulas for judgment.
- Text the smallest version would replace: write that version into `proposed_smallest` (one sentence for a passage; for a section, five lines: role, outcome, consumer, and the rules whose absence has caused a failure) and the actions lost into `predicted_delta`, often none. Recommend a variant eval through the `bmad-eval` skill when the loss is in doubt.
- A paragraph of several topics or a sentence of several decisions (canon test 9); `long_paragraphs` points at the likely ones. High when a rule's reach is unclear; `proposed_smallest` holds the split.
- Meta-explanation of the system to itself, or change-history residue ("replaces X", "no longer does Y", "supersedes older Z", or override caveats papering over a stale sibling doc).
- The same point in two places; `repeated_passages` lists candidates. Name the one place it belongs. Files with different readers, such as a subagent's brief and the builder's route file, may each carry what their reader needs.
- A step that ends on a bound the model cannot check ("when it is clear", "once done"); recommend the condition that closes it.
- Numbered lists that are not sequences: independent steps the model will follow in order. Recommend the goal sentence that replaces them. A sequence guarding a named failure stays.
- ALL-CAPS MUST, ALWAYS, NEVER and stacked imperatives; recommend the failure the rule prevents, in plain words.
- A stripped why: a non-obvious rule with no reason (canon test 3). Medium.
- A prohibition where a positive form says the same; recommend the positive sentence.
- A coined term, or an adjective run where one word the model knows would do; recommend the word.
- Content the model could get by looking, a file's contents, a command's flags, copied into the skill.
- A worked artifact where a format line would do (canon test 8); recommend the line, or a pointer to the project's own instances.

Not flagged: persona voice in an agent (identity, communication style, principles, examples of voice), though repetition or contradiction inside it counts; in a memory agent, the operating rules in its bootloader and sanctum seeds are capability text, not voice. A menu item whose prompt is a sentence with no capability file. The other lenses' lanes.
