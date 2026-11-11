# Analysis documents in detail

Read this when the question is about the brief or the PRFAQ Mary (`bmad-agent-analyst`) coaches: what each gives, when to pick it, when not to, and how the two relate. Both exist to give Sofia (`bmad-agent-po`) better input for a ticket's requirements. Mary runs them through `bmad-facilitate`, so the fast path, coaching path, review and polish are the engine's; both are paced, walked one section at a time in order with the map shown first, and a team adds rules to either with a file in `_bmad/custom/facilitate-templates/`.

**The brief** (`brief`) — describes a product the user already believes in, or pitches it. The light way to give Sofia good input: more than a hand-written intent file, much less than a full PRD.
- Gives: a 1-2 page brief (executive summary, problem, solution, what makes it different, who it serves, success criteria, scope, an optional ask and vision) that is the user's own.
- Pick when: the user knows what they want and needs it written down, would otherwise hand-write an intent file and wants it sharper, does not need the rigor of a PRD, needs a pitch or alignment document, has material to distill, is short on time (the fast path drafts everything with `[ASSUMPTION]` tags), or has a brief to update or pressure-test.
- Not when: the user doubts the idea itself → the PRFAQ. The brief never asks whether the product should exist. Requirements need ids, journeys, and metrics, or compliance and many stakeholders are involved → John for a PRD.
- Writes: `{output_folder}/{active_initiative}/brief-<slug>/brief-<slug>.md`.

**The PRFAQ** (`prfaq`) — tests whether a concept survives scrutiny, using Amazon's Working Backwards. The user reaches it by saying "create a PRFAQ", "work backwards" or "run the PRFAQ challenge".
- Gives: a press release for the finished product, hard customer and internal FAQs, and a verdict on what is solid, what needs work, and what could sink it. "Go deeper first" is a good outcome. All market claims are researched.
- Pick when: the user is unsure the idea is worth building, leads with a technology or a solution instead of a customer problem, is about to commit real money or people, or asks to be challenged.
- Not when: they cannot name a customer or problem after a few exchanges → `bmad-forge-idea` or `bmad-brainstorming`. They only need a write-up → the brief.
- Headless: tell Mary so and give the customer, problem, stakes and solution up front.
- With the brief: most projects need one of the two. Pick by what the user lacks, a clear description or confidence in the idea. A brief after a PRFAQ is reasonable when stakeholders need a short read.
- Writes: `{output_folder}/{active_initiative}/prfaq-<slug>/prfaq-<slug>.md`.

Mary also writes the business requirements document (`brd`); `help/planning-skills.md` says when it fits.
