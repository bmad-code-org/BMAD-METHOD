# PRD Facilitation Guide

Per-section conversation techniques for facilitative mode. Each entry names the coaching move that makes the section's conversation productive — not a checklist, a posture. Skip sections the PM has already resolved; spend more time where thinking is thin.

---

## Users and Personas

**The move:** Ground personas in real people, not archetypes.

Ask the PM to describe a specific person they have observed or talked to — not a type, an actual human. "Who is the clerk at your store? Tell me about them." Invented detail (name, age, backstory from nowhere) is persona theater — the team builds for a fiction. If the PM says "someone like..." push gently: "Is there a real person you're thinking of?"

Once grounded: what does that person want to accomplish in the time they interact with this product? What would make them say this is easier than what they do today? What would make them abandon it?

For the remote user or secondary persona: same grounding, different question — what question do they need answered in under ten seconds, and what do they do if they can't get it?

Mark anything the PM could not ground in observation as `[ILLUSTRATIVE]` — and note it's a hypothesis to validate, not a spec to build for.

---

## Core User Journeys

**The move:** Story structure, not use-case list.

For each primary journey, walk through four beats:

- **Opening scene** — where do we meet this person, what is their situation right now, what pain or need is present?
- **Rising action** — what steps do they take, what do they discover or decide along the way?
- **Climax** — the moment the product delivers real value; the thing they could not do before
- **Resolution** — what is their new reality; how is their situation different?

After each journey: what could go wrong at the climax? What is the recovery path? This is where edge cases that matter surface — not invented error states, but real failure modes for this person.

Explicitly name what capability each journey reveals. "This journey requires the operator to log an entry with no internet — which means we need a decision on whether that's in or out of MVP." Journeys produce capability requirements; make the link visible.

---

## Key Feature Decisions

**The move:** Surface the assumptions that would otherwise be silent.

Before the draft exists, there are decisions the agent would silently make and the PM would never know were made. These are the ones worth a thirty-second conversation:

- Decisions that drive the core UX model (e.g., one record per day vs. many; who can edit vs. view; what happens when the expected input doesn't exist)
- Decisions where the "obvious" choice has real consequences the PM may not have considered
- Decisions that, if wrong, require structural changes to fix later

For each: state what you inferred, name the alternative, ask which is right. Do not present options as a quiz — present your inference and invite correction. "I'm assuming one sales tally per day replaces rather than adds. Is that right, or should the operator be able to log multiple?" Resolve and move on. Only tag as `[ASSUMPTION]` when the answer requires external input or research the PM cannot provide now.

---

## Scope Boundary

**The move:** Establish MVP philosophy before listing features.

Before asking what is in or out, ask what kind of MVP this is:

- **Problem-solving MVP** — the minimum that proves the core problem is solved; rough edges acceptable
- **Experience MVP** — the minimum that proves the interaction model works; quality matters
- **Platform MVP** — the minimum infrastructure other things can build on; completeness of the base matters
- **Revenue MVP** — the minimum someone will pay for; business viability is the test

The answer changes what "minimum" means. A problem-solving MVP for a personal-use tool has different scope logic than an experience MVP aimed at non-tech-savvy users who will bounce at the first confusion.

Once the philosophy is named, non-goals do as much work as in-scope items. Probe for the things the PM is tempted to add. "What keeps almost making it onto the list?" For each: is it truly out of MVP, or does it need to be in because the MVP fails without it?

---

## Success Metrics

**The move:** Push every adjective to a measurement.

"Users will love it" — what does that mean in behavior? "It'll be fast" — fast at what, for whom, measured how? "Good adoption" — what percentage, by when, doing what? Every quality claim needs a measurement or it is not a success criterion, it is a wish.

For each metric surfaced: connect it back to the product's differentiator. If the differentiator is simplicity for non-tech users, the primary metric should measure whether non-tech users successfully complete the core action without help — not session count or feature usage breadth.

Name counter-metrics explicitly — what this product should *not* optimize for. These prevent the wrong thing being built: more entries per day is not better if the goal is accurate daily records; longer dashboard sessions may indicate a broken IA, not high engagement. Counter-metrics are as load-bearing as primary metrics for downstream readers.

For low-stakes or personal-use products: one sentence is enough. "Success: I use this daily and it replaces the notebook within a month." Do not impose metric rigor where the stakes do not warrant it.
