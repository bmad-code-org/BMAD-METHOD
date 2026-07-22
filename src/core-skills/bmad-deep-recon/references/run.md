# Acquisition Loop (Run)

Run once per dimension of the approved plan, in plan order. Each dimension runs in **rounds** — up to the resolved `max_depth` — and the report grows as material lands: the user watches the document build, not a spinner.

**Files first.** Every digest is written to `{doc_workspace}/digests/` the moment it exists — one file per assistant per round (`<dimension>-r<round>-<n>.md`), the digest shape below, raw enough to re-derive from. The conversation is a control channel; the folder is the store. Synthesis reads digest files, never conversation memory, and a run that dies mid-flight resumes from what's on disk.

## Rounds and lead-following

Round 1 pursues the plan's questions **broad-first**: short, wide queries to map what exists, narrowing as the shape emerges — not long specific queries that return nothing. After each round, harvest the leads: new entities worth chasing, unexpected connections, contradictions between sources, and questions the round opened. Contradictions get priority. Promising leads become the next round's brief; note mid-course discoveries in the checkpoint so the user sees the turn happening.

A dimension stops before its round cap when either holds:

- **Coverage** — its plan questions are answered, with the critical claims confirmed per the resolved `validation` level.
- **Novelty exhaustion** — a full round surfaced no new load-bearing claim or lead.

Say which one ended it. Hitting the round cap with open questions is reported as an open question, never silently dropped.

**Stop-and-write valve.** If the run is dragging well past the plan gate's estimate — rounds queuing, budgets mostly spent — stop spawning, synthesize from the digests already on disk, and report the remainder as open questions with a route (a Deepen later, or a drafted prompt for the user's own tool). A shorter honest report beats a longer stale one.

## The fan-out

Fan out researcher assistants for the round — concurrency per the resolved `subagents` level, split by the plan's **topology**: breadth-first gives each assistant independent sub-questions; depth-first gives each a distinct perspective or methodology on the *same* question; straightforward is one assistant with a small budget — never fan out what one focused assistant answers. Each assistant runs behind the **research firewall**: it gets its brief and nothing else — no project files, no ambient context. The brief contains:

- the questions it owns, the decision they serve, and the topic
- its search surfaces (specialized tools first — installed search-shaped MCP tools, `{workflow.external_sources}` entries whose directive matches — then generic search), plus `{workflow.preferred_sources}` first / `{workflow.banned_sources}` never
- the pack's source craft and freshness bars, and the source-quality card below
- its budgets — sources (the round's share of `max_sources_per_round`) and tool calls, scaled to its task: under 5 for a simple lookup, ~5 medium, ~10 hard, 15 for genuinely multi-part, 20 never exceeded. Either budget spent → synthesize what it has
- the query craft: short queries (roughly five words or fewer) beat hyper-specific ones that return nothing; broaden when results are sparse, narrow when abundant; never repeat an identical query on the same tool; after every tool result, pause and evaluate — what did this add, what gap remains, what's the best next query — before firing again
- the epistemics rules verbatim, and the return contract: a digest, not raw results — findings as claims, each with `{claim, source, publisher, pub_date, accessed, confidence, class}`, plus leads worth chasing and what it looked for and could not find

**On each return, write the digest to `{doc_workspace}/digests/` before doing anything else with it.**

Spawn assistants on `{workflow.subagent_models}` when set (first available wins); otherwise the harness default — judgment work never drops to the smallest tier. When subagents are unavailable (or `subagents` is `none`), run the same rounds yourself, sequentially, under the same budgets and the same files-first discipline.

When workflow orchestration was approved at the plan gate, run the fan-out as a workflow: dimensions as parallel pipelines, assistants returning structured digests. The budgets, digest contract, firewall, and stopping rules apply unchanged — and however the acquisition parallelizes, digests land as files and the lead alone writes `research.md`, committing sections in plan order.

## Source quality

One card, applied by every assistant and the lead alike. Prefer **primary sources** — filings, regulator text, official documentation, original papers, a company's own reported numbers — over aggregators and secondary reporting. Red flags that downgrade confidence on sight: speculative language ("could", "may", projections in future tense presented as findings), marketing register, passive voice with unnamed sources, cherry-picked or unsourced numbers, and aggregators recycling a single upstream report (that's one publisher, however many domains echo it). Conflicts resolve by recency, consistency with adjacent established facts, and publisher quality — never by averaging.

## Synthesize the dimension

When a dimension's rounds are done:

1. Verify at landing per `references/verification.md` — at `normal` validation this is a spot-check of the dimension's load-bearing claims, not a sweep.
2. Write the dimension's section per the pack's skeleton from its digest files — findings woven into prose answering the dimension's questions, every load-bearing claim cited inline `[n]`, confidence flagged where below high, contradictions reported with both sides cited. Append to `research.md` and add its sources to the running source table.
3. Log one memlog line per source batch (`--type source`) and one per load-bearing claim worth tracking for refresh (`--type claim`, include class and pub date).
4. Checkpoint: one or two lines in chat — what the dimension found, anything surprising, anything unresolved. Keep moving unless the user speaks up; a mid-run scope change is logged as a `decision` and the plan adjusts. Headless: skip checkpoints entirely.

When all dimensions are done, proceed to `references/synthesis.md` for final assembly.
