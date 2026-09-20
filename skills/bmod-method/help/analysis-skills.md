# Analysis skills in detail

Read this when the question is about `bmad-product-brief` or `bmad-prfaq`: what each gives, when to pick it, when not to, and how the two relate. Both exist to give `bmad-spec` better input.

**`bmad-product-brief`** — describes a product the user already believes in. The light way to give `bmad-spec` good input: more than a hand-written intent file, much less than a full PRD.
- Gives: a 1-2 page brief (problem, solution, who it serves, what is different, success criteria, scope, vision) that is the user's own, plus an addendum holding detail meant for later documents.
- Pick when: the user knows what they want and needs it written down, would otherwise hand-write an intent file and wants it sharper, does not need the rigor of a PRD, needs a pitch or alignment document, has material to distill, is short on time (its fast path drafts everything with `[ASSUMPTION]` tags), or has a brief to update or pressure-test.
- Not when: the user doubts the idea itself → `bmad-prfaq`. The brief never asks whether the product should exist. Requirements need ids, journeys, and metrics, or compliance and many stakeholders are involved → `bmad-prd`.
- Writes: `{planning_artifacts}/briefs/brief-{project_name}-{date}/brief.md`.

**`bmad-prfaq`** — tests whether a concept survives scrutiny, using Amazon's Working Backwards.
- Gives: a press release for the finished product, hard customer and internal FAQs, and a verdict on what is solid, what needs work, and what could sink it. "Go deeper first" is a good outcome. All market claims are researched.
- Pick when: the user is unsure the idea is worth building, leads with a technology or a solution instead of a customer problem, is about to commit real money or people, or asks to be challenged.
- Not when: they cannot name a customer or problem after a few exchanges → `bmad-forge-idea` or `bmad-brainstorming`. They only need a write-up → `bmad-product-brief`.
- With the brief: most projects need one of the two. Pick by what the user lacks, a clear description or confidence in the idea. A brief after a PRFAQ is reasonable when stakeholders need a short read.
- Writes: `{planning_artifacts}/prfaq-{project_name}.md`, plus `-distillate.md` beside it when finished.
