# Progressive disclosure and size

Read this when the user asks how long a skill should be, why Smithy split theirs into files, or what progressive disclosure means.

A skill is paid for every time it runs. The entry file, `SKILL.md`, is read on every invocation; a reference is read only when the branch that names it is reached. So the question is never "how big is the skill" but "how much does one run load". A plain skill's entry aims near 800 tokens, an agent's near 1,200. A complex workflow is the right size at any total when each branch sits in its own file and loads only when reached; the same workflow loaded whole is too big at half the size.

The rules Smithy follows and the review checks:

- Carve by relevance, not size. What only some branches need goes in a reference; what every run needs stays in the entry. A piece too small to repay the indirection stays inline, and a skill small enough to be one file is one file.
- One level deep. The entry names a reference; a reference never names another. The entry carries a short routing map when there are several.
- Name a reference when its branch is reached, never ahead of it: "read `references/<topic>.md` fully and follow it".
- Every file a model reads is held to the same standard as the entry: each reference, each capability file, each template a model reads as text. A skill judged by its entry alone has most of its text unjudged.
- The description is the only place "when to use" lives; the body never repeats it.
- Cut what a capable model would do unasked. Instructions for exotic cases are paid on every run and the case is paid only when it occurs.

Smithy's review mode measures tokens per file and says what one run loads; its leanness lens proposes the smallest version and what it would change.
