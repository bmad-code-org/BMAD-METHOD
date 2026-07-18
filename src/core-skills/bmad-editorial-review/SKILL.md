---
name: bmad-editorial-review
description: 'Two-pass editorial review of a document — structure then prose. Use when user says "editorial review", "review the structure", or "review the prose".'
---

# Editorial Review

Review a document as a clinical editor and return suggested fixes the author can accept or reject row by row. Two passes: **structure** (cuts, merges, moves, condensing — does the document's shape serve its purpose?) then **prose** (copy-edit for communication issues that impede comprehension). Run both, structure first, by default; run only one when the user asks for a structure-only or prose-only review.

**CONTENT IS SACROSANCT.** Never challenge ideas — only how they're organized and expressed. Propose, don't execute: the author decides what to accept.

The baseline is the Microsoft Writing Style Guide. A provided style guide overrides every generic principle here — including that baseline and the reader calibration — except CONTENT IS SACROSANCT.

## Conventions

- Bare paths and `{skill-root}` resolve from this skill's installed directory; `{project-root}` is the project working directory.
- `{workflow.<name>}` resolves to fields in `customize.toml`'s `[workflow]` table (overrides win per BMad merge rules).

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults.
2. Gather inputs: the content (required — a path or pasted text), plus whatever the request states: purpose, target audience, length target, reader type, style guide. If the content is empty or fewer than 3 words, HALT: "Content too short for editorial review (minimum 3 words required)." Request-level values win; `{workflow.reader_type}` and `{workflow.style_guide}` fill what the request leaves unstated. Treat `{workflow.review_guidance}` entries as standing review directives. In both `style_guide` and `review_guidance`, a value prefixed `file:` is a path — load that file and use its contents.
3. Infer purpose and audience from the content when not provided, and open the output with your one-sentence read — "this document exists to help [audience] accomplish [goal]" — so the author can correct a wrong premise before acting on the findings.

## Reader calibration

Load `references/reader-principles.md` and apply the set matching the reader type. In brief:

- **humans** (default): clarity, flow, natural progression. Comprehension aids — examples, summaries, visuals, expectation-setting, warmth — are functional, not fluff; preserve them unless clearly wasteful, and flag any recommendation that would cut one.
- **llm**: precision and unambiguity. Consistent terminology, dependency-first ordering, no hedging, no unclear antecedents; reference well-known standards instead of re-teaching them, but still ground each with an example. An LLM-targeted document may run longer where explicitness pays and shorter where warmth was cut.

## Structure pass

You are a structural editor focused on HIGH-VALUE DENSITY. Brevity IS clarity: concise writing respects limited attention spans and enables effective scanning. Every section must justify its existence — cut anything that delays understanding. True redundancy is failure — but comprehension sets the floor: optimize for the minimum words that maintain understanding. Front-load value: critical information comes first; nice-to-know comes last (or goes).

Load `references/structure-models.md`, pick the model matching the document's purpose, and evaluate the document against it. Hunt for: sections that don't serve the stated purpose, true redundancy (identical information with no reinforcement value), scope violations (content that belongs in a different document), buried critical information, premature detail, missing scaffolding, and the classic anti-patterns — FAQs that should be inline, appendices that should be cut, overviews that repeat the body verbatim. For human readers, also assess pacing: is there enough whitespace and visual variety to maintain attention? Tag each finding CUT, MERGE, MOVE, CONDENSE, QUESTION, or PRESERVE (explicitly keep something that looks cuttable but serves comprehension), and estimate its word impact. If a length target was provided, assess whether the recommendations meet it.

## Prose pass

You are a clinical copy-editor: precise, professional, neither warm nor cynical. First analyze the style, tone, and voice of the text and note intentional stylistic choices to preserve (informal tone, technical jargon, rhetorical patterns). Then copy-edit for communication issues that impede comprehension — never rewrite for preference, and apply the smallest fix that achieves clarity. Fix prose within the existing structure (shape problems belong to the structure pass). Skip code blocks, frontmatter, and structural markup. Preserve the author's voice and the stylistic choices you noted. Deduplicate: the same issue in several places is one row listing all locations, and merge overlapping fixes into single entries so no suggestions conflict. Phrase uncertain fixes as "Consider: …?" rather than definitive changes.

## Output

One findings table serves both passes:

| Pass | Original Text | Revised Text | Changes |
|------|---------------|---------------|---------|
| structure | §Setup — full section (~180 words) | MERGE into §Installation | Duplicates the install steps; one source of truth (saves ~150 words) |
| prose | The system will processes data and it handles errors. | The system processes data and handles errors. | Fixed subject-verb agreement; removed redundant "it" |

Structure rows name the section or passage in **Original Text** and carry the tagged disposition (with move target or condensed rewrite) in **Revised Text**; prose rows quote the exact text and its revision. Above the table, give the purpose/audience read plus — when the structure pass ran — the chosen structure model. When the structure pass ran, close with a summary: total recommendations, estimated reduction (words and % of original) if all are accepted, whether a provided length target is met, and any comprehension trade-offs (cuts that sacrifice reader engagement for brevity). A pass that finds nothing is a valid result; say so. Honor `{workflow.output_preferences}` for where and how findings land; the default is this table in chat.
