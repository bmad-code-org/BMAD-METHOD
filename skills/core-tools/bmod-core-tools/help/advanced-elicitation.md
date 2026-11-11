# Advanced elicitation

Open this when the user asks what `bmad-advanced-elicitation` is for, how it differs from the version in earlier BMad releases, how to start it or aim it, which methods it runs, how to set default methods, or whether a plain "push harder" would do.

## What it is for

It pushes a piece of work off its first answer and proposes one revision. A model's first draft is its most likely draft: centered, agreeable, biased toward adding. The skill runs critique methods against the work, such as a pre-mortem, steelmanning, first principles or subtraction, and merges what they find into changes the user accepts or rejects. Nothing changes until the user accepts.

The work can be anything in the conversation: a choice the model just made, a section of a document, a whole PRD or plan, or a draft the user wrote.

## What changed from the earlier version

The version that shipped from v2 through v6 offered a menu of five methods from a catalog of 71 in 12 categories, ran each chosen method itself in the conversation, and stopped for Apply or skip after every method, so a session took many turns and the author critiqued its own reasoning. The rebuild:

- Starts with one command and returns results in the same turn; a session is two turns, the call and the decision on the revision.
- Runs each method as an independent reader with a short brief, so the method is not anchored to the first answer and its reasoning stays out of the conversation.
- Merges every push into one revision of numbered, tagged changes instead of one Apply per method, and leaves decisions already made alone.
- Starts only when named, so it no longer fires on any critique request.
- Was tested in Claude Code and Codex, where blind judges ranked it above the old version and above a plain "push harder" on sections and documents.
- Keeps 48 methods in six directions; renamed methods still answer to their old names. The customization key `preferences` is now `persistent_facts`.

## Starting and aiming it

It starts only when named. "Push harder" or "pre-mortem this" without the name does not start it.

- "advanced elicitation" alone pushes what the last exchange was about, at its own size. If the model just suggested Postgres, it pushes that choice, not the whole architecture, while still using everything in the conversation.
- To aim it at something bigger or different, say so: "advanced elicitation on section 4", "advanced elicitation on docs/prd.md".
- To choose the methods, name them: "advanced elicitation with pre-mortem and red team". Named methods run as named.
- Other skills, such as the planning skills and agent personas, can call it by name on what they just drafted.

It starts work in the same turn. Its first message names the target and the methods it chose, so the user can stop it if the target is wrong.

## What runs when the user names no methods

Three pushes, each from a different direction: what is wrong, what is missing, the premise, simplicity, the future, the other side.

- The method that best fits where the work looks weak.
- A wildcard chosen to take the work somewhere unexpected, from any of the methods.
- For a single choice or a few lines, an open push to reconsider the work with everything the conversation holds. For a section or document, a second method against another weak spot.

Each method runs as an independent reader that sees only a short brief, never the author's reasoning, so it is not anchored to the first answer. The brief lists what is already decided, so the readers do not reopen it.

## What comes back

One message: a headline from each push, the revision as numbered changes tagged with the push behind each, decisions only the user can make, and any findings set aside. The user applies all, some by number, rejects, reruns a push with direction, or asks for another round. A typical session is two user turns: the call, then the decision.

Each session keeps a report with every round's full revision and findings under `{output_folder}/{active_initiative}/elicitation-<topic>/`, or under `{output_folder}/` for loose work.

## When a plain "push harder" is enough

Pushing a section or document takes several minutes, because each reader works through it on its own. On one quick choice with a strong model, asking it to push harder and consider alternatives is often as good and much faster, though less consistent. Recommend the skill when the work matters, when it is a section or document, or when the model tends to keep its first answer when asked to reconsider.

## Methods and defaults

- The catalog holds 48 methods in the six directions, 22 of them recommended. The user can ask the skill to list them, or to list one direction.
- Methods renamed in the rebuild still answer to their old names.
- Default methods for every call are set with `bmad-customize` as `default_methods`. A team file and a personal file both add to the list, so both sets run.
- A team can add its own methods with `additional_methods` and use them as defaults. See `help/customization.md` for how overrides merge.
