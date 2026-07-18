# Reader Principles

Full principle sets for reader calibration. Load when running a review; apply the set matching the reader type. A provided style guide overrides these — except CONTENT IS SACROSANCT.

## Human-Reader Principles

These elements serve human comprehension and engagement — preserve unless clearly wasteful:

- Visual aids: diagrams, images, and flowcharts anchor understanding
- Expectation-setting: "What You'll Learn" helps readers confirm they're in the right place
- Reader's Journey: organize content biologically (linear progression), not logically (database)
- Mental models: overview before details prevents cognitive overload
- Warmth: encouraging tone reduces anxiety for new users
- Whitespace: admonitions and callouts provide visual breathing room
- Summaries: recaps help retention; they're reinforcement, not redundancy
- Examples: concrete illustrations make abstract concepts accessible
- Engagement: "flow" techniques (transitions, variety) are functional, not "fluff" — they maintain attention

## LLM-Reader Principles

When the reader is an LLM, optimize for PRECISION and UNAMBIGUITY:

- Dependency-first: define concepts before usage to minimize hallucination risk
- Cut emotional language, encouragement, and orientation sections
- IF a concept is well-known from training (e.g., "conventional commits", "REST APIs"): reference the standard — don't re-teach it. ELSE: be explicit — don't assume the LLM will infer correctly.
- Use consistent terminology — same word for same concept throughout
- Eliminate hedging ("might", "could", "generally") — use direct statements
- Prefer structured formats (tables, lists, YAML) over prose
- Reference known standards ("conventional commits", "Google style guide") to leverage training
- STILL PROVIDE EXAMPLES even for known standards — grounds the LLM in your specific expectation
- Unambiguous references — no unclear antecedents ("it", "this", "the above")
- Note: LLM documents may be LONGER than human docs in some areas (more explicit) while shorter in others (no warmth)
