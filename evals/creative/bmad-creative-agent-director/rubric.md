# Clio quality rubric

Clean-room evaluation of `bmad-creative-agent-director`. Each case in `cases.json` runs in a fresh workspace with Clio staged, `bmad-facilitate` beside her where the case lists it, and the fixtures the case names. Coaching cases stage the conversation up to a moment in `state_prefix` and judge only Clio's next reply. Judges are fresh subagents with no prior context.

## Two layers

1. **Case expectations (pass or fail).** Each case's `rubric` list, graded to the `bmad-eval` grader contract: evidence quoted from the transcript or files, no partial credit, the burden of proof on a pass. One expectation applies to every case: every Clio message starts with 🎭.
2. **Coaching dimensions (1 to 5).** Every case marked `"judge": "coaching"` is also scored on the six dimensions below, from the final reply in the context of the staged conversation.

## Coaching dimensions

One question means one thing the creator is asked to answer. A pick among offered options counts as one; each sub-question or follow-up counts on its own; rhetorical questions inside an option do not count.

| # | Dimension | 5 | 3 | 1 |
|---|---|---|---|---|
| 1 | Elicitation | The next question goes straight at the most important thing still unknown, in terms the user wants to answer | A reasonable question, but generic or aimed at something minor | No question where one was needed, or a form-style list of fields |
| 2 | Ownership | Builds on the user's own words and choices; nothing enters the work that the user did not say or take up | Mostly the user's material, with some of Clio's ideas slipped in as settled | Clio writes the piece herself; the user's ideas are replaced or ignored |
| 3 | Nudging | When the user is stuck, terse, or bored, it gives them something to react to: concrete options built from their material, at least one a surprise, with an exercise at most as one way in | Offers options or an exercise, but stock or not tied to the user's material | Repeats the open question, lectures, or gives up and drafts |
| 4 | Listening and pacing | Answers what the user just said; one or two questions; length fits the moment | Over-long or stacks three or more questions | Ignores the message, or dumps a menu or a wall of text |
| 5 | Energy | Warm and playful; reacts to specifics; says what lands and why; no critic-first tone | Polite and competent but flat | Cold, preachy, or flattering without substance |
| 6 | Craft substance | What a seasoned story editor, speaking coach, or creative director would actually say here | Sound but generic advice | Wrong, vague, or harmful advice |

Each judge also answers two creator-side questions per case: **would this creator come back for a second session?** and **does the work still feel like theirs?** Yes or no, with one sentence why.

## View cases

The cases that build an HTML view (`character-view-own-look`, `presentation-follows-brand`) are also scored 1 to 5 on **Output**: 5 is a page designed for its reader, with a clear centerpiece, that could not have been rendered from the markdown by a stylesheet; 3 is a styled document with a picture or two; 1 is rendered markdown.

## Before and after

The coaching cases also run against Clio as she was at commit `0dec4d3b`, with `bmad-facilitate` from the same commit. A judge sees each pair as A and B in a shuffled order, scores both on the six dimensions, and says which reply a creator would rather get and why. Cases that test features added after that commit (first-session setup, brand, markdown-first) run on the current version only.

## Verdict

- **Good coach:** a mean of 4.0 or more on dimensions 1 to 5 across coaching cases, a case pass rate of 85% or more, no case scoring 1 on ownership, and the current version preferred in most before-and-after pairs.
- **Needs work:** anything below that, with the failing dimensions and cases named.
- One run per case is a quick look, not a settled result. A finding counts when it shows in two or more runs or cases, or is a verified defect in the skill text.
