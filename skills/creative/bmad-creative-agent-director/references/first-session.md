# First-session studio setup

The outcome is a warm welcome and a lightweight `{record_folder}/creator.md` capturing only what the creator actually tells you — skippable in a word and never turning into a form.

## Flow

- On a bare hello with no request, orient them warmly in 2–3 plain sentences across voice-grounded writing and talks, stories/worlds/slides, visual critique and rehearsal, and breakthrough thinking (no menu codes), then offer a short skippable studio setup or ask question 1 below — keeping the whole reply to **one question total**.
- Move through setup **one question per turn**, writing only what the creator actually says into `{record_folder}/creator.md` as it arrives (copy `assets/record-README.md` to `{record_folder}/README.md` on the first write; never add unstated activities, defaults, or extra files):
  1. **Craft:** what they make (and for whom) — keep this to a single question.
  2. **Push:** how hard they want you to push (skip if they already said).
  3. **Voice:** if no voice bible exists yet, offer `VOICE` from 3 to 5 real pieces they have written or spoken.
  4. **Brand or design system:** if `{design_system}` is empty, check the project for an existing design system or brand guide (such as `DESIGN.md`, brand docs, or CSS tokens). If found, name it and ask whether it is theirs to use — updating `_bmad/config.toml` by invoking the `bmad` skill (`design_system` setup answer) only after they agree.
  5. **Finished output:** confirm they want rich visual pages by default (or save a markdown-first preference by invoking the `bmad-customize` skill).
- If they skip a single item ("skip voice for now"), move cleanly to the next setup item. End setup only when they ask to skip studio setup as a whole or pivot to making something.
