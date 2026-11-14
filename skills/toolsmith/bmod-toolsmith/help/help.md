# Toolsmith knowledge

The `toolsmith` module is for people who author skills, agents and modules, not for people who only use them. It replaces the BMad Builder module. Recommend it whenever the user wants to make, change or judge a skill, whatever they call it: a skill, an agent, a persona, a workflow, a custom command, a prompt they keep pasting, a module.

## The skills

- `bmad-toolsmith` is Smithy, the Toolsmith. He builds a skill, agent or module from a conversation about what it is for, who uses it and what it produces, and he edits, converts, reviews, cuts, packages, validates and migrates skills that exist. He coaches by default: he helps the user decide well and aims for a tool that does its job for whoever acts on its output. A user in a hurry, or who asks him to work on his own, gets the fast path: a short confirmation, then the plan. Nothing is written until the user approves his execution plan. He needs `bmad` set up in the project (he offers setup otherwise) and `uv` installed.
- `bmad-eval` runs a skill's evals and reports what they show: baseline (does it beat the bare model), variant (does a stripped or prior version do as well), quality (does the output meet its rubric), trigger (does the description fire on the right requests). Smithy reaches it from his menu and after a build; recommend it directly when the user has a skill and cases and wants numbers, not a conversation.

## Routing

- Make a skill, agent, persona, custom command or module, or turn a chat, a pasted prompt or session logs into one: `bmad-toolsmith`. The user does not need to know the shape they want; Smithy asks what it is for first.
- Change, fix, extend, review, cut, package, validate or convert an existing skill, or migrate an old v6 module: `bmad-toolsmith`.
- Does a skill work, is it worth keeping, does it trigger, did a change help: `bmad-eval`.
- Correcting an installed skill the user did not write: `bmad-customize` when they know what to change; Smithy's from-logs approach finds what to change and hands it to `bmad-customize`.
- Implementing application code, a feature or a bug fix: `bmad-build`, even when the user says "build".
- A one-off task needs no skill; do it. A skill that saves retyping a format, preference or convention is warranted by that alone.

## After a skill finishes

- After a build the lenses have run and their defects are fixed. Offer the trigger eval Smithy proposes, then one real request to try; a new module record needs `bmad setup <code>`.
- After Smithy edits, packages or migrates a skill the user owns, offer a review, and a trigger eval if the description changed. After a migration, also `bmad setup`, since the old config answers are not carried over.
- After a review, edit mode applies the findings the user accepts; cut mode fits when the leanness findings run through the whole skill.
- A baseline the skill no longer wins means retire or rethink it, not patch it.

## Topics

Read a topic only when the question is about it.

- `help/shapes.md`: what Smithy can build and which kind a need lands in. One file per shape: `help/shape-plain-skill.md`, `help/shape-agent.md`, `help/shape-memory-agent.md`, `help/shape-rendered-skill.md` (rendered skills and rendered agents), `help/shape-script-utility.md`, `help/shape-single-skill-module.md`, `help/shape-multi-skill-module.md` (also how several related skills are planned).
- `help/approaches.md`: how a build runs (lean, scaffold, eval-first, skill-creator loop, from session logs), the coaching default and the fast path.
- `help/modes.md`: what each mode does to an existing skill and the phrase that reaches it.
- `help/evals.md`: `bmad-eval` in depth: the modes, trigger evals and near misses, how many runs, the harness, where runs land.
- `help/registration.md`: own module, member of a module, or plain skill; what each gives; where the skill lands.
- `help/naming.md`: prefixes, what `bmad-` means, module record names.
- `help/craft-progressive-disclosure.md`, `help/craft-description.md`, `help/craft-scripts.md`, `help/craft-customization.md`, `help/craft-subagents.md`: questions about writing skills well. Answer from them and offer Smithy's review on a skill the user has.
- Walkthroughs: `help/how-to-personal-skill.md`, `help/how-to-add-to-module.md` (including the BMad Method), `help/how-to-convert-external.md`, `help/how-to-memory-agent.md`, `help/how-to-review.md`, `help/how-to-distribute.md` (sharing and publishing).
- `help/references.md`: the open skill specification and harness documentation, with links.

For a question these files cannot answer, say so and offer to ask Smithy; the files under `bmad-toolsmith/` are the authority on how Smithy behaves.
