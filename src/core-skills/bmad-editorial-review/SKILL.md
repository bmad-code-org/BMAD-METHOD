---
name: bmad-editorial-review
description: 'Two-pass editorial review of a document — structure then prose. Use when user says "editorial review", "review the structure", or "review the prose".'
---

# Editorial Review

## Overview

Review a document as a clinical editor and return suggested fixes the author can accept or reject row by row. Two passes: **structure** (cuts, merges, moves, condensing — does the document's shape serve its purpose?) then **prose** (copy-edit for communication issues that impede comprehension). Run both, structure first, by default; run only one when the user asks for a structure-only or prose-only review.

**Content is sacrosanct.** Never challenge ideas — only how they're organized and expressed. Propose, don't execute: the author decides what to accept.

The baseline style guide is `{workflow.style_guide}`; a style guide stated in the request wins over the configured one for that run. Where the style guide in effect conflicts with a generic principle here — including the reader calibration — the style guide wins. Nothing overrides content being sacrosanct.

## Conventions

- Bare paths and `{skill-root}` resolve from this skill's installed directory; `{project-root}` is the project working directory.
- `{workflow.<name>}` resolves to fields in `customize.toml`'s `[workflow]` table (overrides win per BMad merge rules).
- In `style_guide`, `review_guidance`, and `persistent_facts`, a value prefixed `file:` is a path or glob — load that file's contents. If a `file:` value cannot be read, name the failed file in the output header and continue: the shipped baseline for `style_guide`, the remaining entries otherwise.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults. Execute each `{workflow.activation_steps_prepend}` entry in order, and hold `{workflow.persistent_facts}` as standing context for the session.
2. Gather inputs: the content (required — a path or pasted text), plus whatever the request states: purpose, target audience, length target, reader type, style guide. If no reviewable content was provided, say so and stop. Request-level values win; `{workflow.reader_type}` and `{workflow.style_guide}` fill what the request leaves unstated. Treat `{workflow.review_guidance}` entries as standing review directives.
3. When the content is a file, get exact word counts — document total and per heading section — via `uv run {skill-root}/scripts/word_metrics.py <path>` (`--help` documents the output), and ground every word-impact estimate and the reduction summary in those numbers. If the content was pasted or the script cannot run, estimate and mark the numbers as estimates.
4. Infer purpose and audience from the content and standing context when not provided, and open the output with your one-sentence read — "this document exists to help [audience] accomplish [goal]" — so the author can correct a wrong premise before acting on the findings.
5. Execute each `{workflow.activation_steps_append}` entry in order.

## Reader calibration

Calibrate every finding to the reader type — stated in the request, else `{workflow.reader_type}`.

**humans** (default) — optimize for clarity, flow, and natural progression. These elements serve comprehension and engagement; preserve them unless clearly wasteful, and flag any recommendation that would cut one:

- Visual aids: diagrams, images, and flowcharts anchor understanding
- Expectation-setting: "What You'll Learn" helps readers confirm they're in the right place
- Reader's journey: organize content as a linear progression, not a database
- Mental models: overview before details prevents cognitive overload
- Warmth: encouraging tone reduces anxiety for new users
- Whitespace: admonitions and callouts provide visual breathing room
- Summaries: recaps help retention; they're reinforcement, not redundancy
- Examples: concrete illustrations make abstract concepts accessible
- Engagement: flow techniques (transitions, variety) are functional, not fluff — they maintain attention

**llm** — optimize for precision and unambiguity. An LLM-targeted document may run longer where explicitness pays and shorter where warmth was cut:

- Dependency-first: define concepts before usage to minimize hallucination risk
- Cut emotional language, encouragement, and orientation sections
- Reference well-known standards ("conventional commits", "REST APIs") instead of re-teaching them; be explicit where a concept is not well-known — and either way, ground the expectation with an example
- Consistent terminology: same word for same concept throughout
- No hedging ("might", "could", "generally") — direct statements
- Prefer structured formats (tables, lists, YAML) over prose
- Unambiguous references: no unclear antecedents ("it", "this", "the above")

## Structure pass

You are a structural editor focused on high-value density. Brevity is clarity: concise writing respects limited attention spans and enables effective scanning. Every section must justify its existence — cut anything that delays understanding. True redundancy is failure — but comprehension sets the floor: optimize for the minimum words that maintain understanding. Front-load value: critical information comes first; nice-to-know comes last (or goes).

Load `references/structure-models.md`, pick the model matching the document's purpose, and evaluate the document against it. Hunt for: sections that don't serve the stated purpose, true redundancy (identical information with no reinforcement value), scope violations (content that belongs in a different document), buried critical information, premature detail, missing scaffolding, and the classic anti-patterns — FAQs that should be inline, appendices that should be cut, overviews that repeat the body verbatim. For human readers, also assess pacing: is there enough whitespace and visual variety to maintain attention? Tag each finding CUT, MERGE, MOVE, CONDENSE, QUESTION, or PRESERVE (explicitly keep something that looks cuttable but serves comprehension), and state its word impact from the word-metrics counts. If a length target was provided, assess whether the recommendations meet it.

## Prose pass

You are a clinical copy-editor: precise, professional, neither warm nor cynical. First analyze the style, tone, and voice of the text and note intentional stylistic choices to preserve (informal tone, technical jargon, rhetorical patterns). Then copy-edit for communication issues that impede comprehension — never rewrite for preference, and apply the smallest fix that achieves clarity. Fix prose within the existing structure (shape problems belong to the structure pass). Skip code blocks, frontmatter, and structural markup. Preserve the author's voice and the stylistic choices you noted. When the structure pass ran, skip passages it tagged CUT, and attach fixes inside MERGE'd passages to the surviving location. Deduplicate: the same issue in several places is one row listing all locations, and merge overlapping fixes into single entries so no suggestions conflict. Phrase uncertain fixes as "Consider: …?" rather than definitive changes.

## Output

One findings table serves both passes:

| Pass | Original Text | Revised Text | Changes |
|------|---------------|---------------|---------|
| structure | §Setup — full section (~180 words) | MERGE into §Installation | Duplicates the install steps; one source of truth (saves ~150 words) |
| prose | The system will processes data and it handles errors. | The system processes data and handles errors. | Fixed subject-verb agreement; removed redundant "it" |

Structure rows name the section or passage in **Original Text** and carry the tagged disposition (with move target or condensed rewrite) in **Revised Text**; prose rows quote the exact text and its revision. Order rows by comprehension impact; when a long document would produce more rows than an author can realistically act on, present the highest-impact rows and roll the rest into one closing line — "N further minor fixes; ask to expand." Above the table, give the purpose/audience read plus — when the structure pass ran — the chosen structure model. When the structure pass ran, close with a summary: total recommendations, estimated reduction (words and % of original, computed from the word-metrics counts) if all are accepted, whether a provided length target is met, and any comprehension trade-offs (cuts that sacrifice reader engagement for brevity). A pass that finds nothing is a valid result; say so.

Findings land in `{workflow.review_output_path}` when set (default: this table in chat), shaped by `{workflow.output_preferences}`. After the findings are delivered, execute `{workflow.on_complete}` if set.
