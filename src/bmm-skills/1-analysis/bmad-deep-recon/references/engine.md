# Acquisition Loop

Run once per dimension of the approved plan, in plan order. Each dimension runs in **rounds** — up to the resolved `max_depth` — and its material arrives through the plan's surfaces and acquisition modes, synthesized into the report as it lands: the user watches the document grow, not a spinner.

## Rounds and lead-following

Round 1 pursues the plan's questions **broad-first**: short, wide queries to map what exists, narrowing as the shape emerges — not long specific queries that return nothing. After each round, harvest the leads: new entities worth chasing, unexpected connections, contradictions between sources, and questions the round opened. Contradictions get priority. Promising leads become the next round's brief; note mid-course discoveries in the checkpoint so the user sees the turn happening.

A dimension stops before its round cap when either holds:

- **Coverage** — its plan questions are answered, with the two-source classes confirmed independently.
- **Novelty exhaustion** — a full round surfaced no new load-bearing claim or lead.

Say which one ended it. Hitting the round cap with open questions is reported as an open question, never silently dropped.

## Generate (default)

Fan out researcher assistants for the round — concurrency per the resolved `subagents` level, splitting the round's questions between them. Each assistant is told it is part of a research team whose conclusions never rest on training data alone, and gets:

- the questions it owns, the decision they serve, and the topic
- its surfaces from the plan's routing (specialized tools first, generic search after), plus `{workflow.preferred_sources}` first / `{workflow.banned_sources}` never
- the pack's source craft and the freshness bars for the claim classes it will meet
- its source budget (the round's share of `max_sources_per_round`) — when spent, synthesize what it has
- the return contract: a digest, not raw results — findings as claims, each with `{claim, source, publisher, pub_date, accessed, confidence, class}`, plus leads worth chasing and what it looked for and could not find

Spawn assistants on `{workflow.subagent_models}` when set (first available wins); otherwise the harness default — judgment work never drops to the smallest tier. When subagents are unavailable (or `subagents` is `none`), run the same rounds yourself, sequentially, under the same budgets — never skip the digest discipline.

When workflow orchestration was approved at the plan gate, run the fan-out as a workflow: dimensions as parallel pipelines, assistants returning structured digests, verification as its own stage. The budgets, digest contract, and stopping rules above apply unchanged.

`{workflow.external_sources}` entries whose directive matches the dimension are consulted alongside the web — org tools preferred when their scope matches.

## Delegate

**Engine-first strategy.** When the plan gate approved engine-first for a dimension, the engine run *is* round 1: it does the broad sweep, and every later round is yours — Generate rounds that chase the sweep's leads and contradictions, answer what it left open, and independently cross-check its load-bearing claims. The division is fixed: engines gather; framing, verification, synthesis, and lifecycle never delegate. An engine's report can never satisfy a two-source bar by itself (one publisher), so verification always has real work regardless of how good the sweep was. In a no-subagent environment engines matter *more*, not less — they are the only parallelism available.

For a dimension routed to an enabled engine from `{workflow.engines}`:

1. Compose the **brief** from the dimension's questions, the decision context, the freshness bars, and an explicit citation demand: every claim with source URL and publication date.
2. Run the engine — `cli`: execute `invoke` with `{brief}` substituted (shell-quote it), applying the entry's `model` via the CLI's model flag when set; `mcp`: call the named tool with the brief.
3. Treat the returned text as **imported material with provenance = the engine**: an extraction subagent pulls the claims relevant to the dimension's questions into the standard digest shape. Engine output is never trusted verbatim — its claims enter the ledger `unverified` like everything else, and the verification pass treats the engine as one publisher, not an independent source for its own claims.
4. If the engine fails or returns nothing usable, log an `event` and fall back to Generate for that dimension.

## Import

For material the user brought (a hosted deep-research report, PDFs, a folder of sources, a pasted document):

1. Record provenance in the memlog: what it is, where it came from, when it was produced (ask if not evident — production date drives staleness).
2. An extraction subagent reads each document and pulls claims relevant to the plan's dimensions into the standard digest shape, keeping the original's citations when it has them (the cited source is the publisher; the imported document is the via).
3. Coverage judgment: which dimensions the material actually covers, which questions remain open — open questions route to Generate/Delegate rather than being silently dropped.
4. Imported conclusions are inputs, not verdicts: where the material's conclusion differs from what your own acquisition finds, surface the tension in the dimension section instead of averaging it away.

## Synthesize the dimension

With the dimension's digests in hand:

1. Write the dimension's section per the pack's skeleton — findings woven into prose that answers the dimension's questions, every load-bearing claim cited inline `[n]`, confidence flagged where below high. Contradictions between sources are reported as such, with both sides cited.
2. Append the section to `research.md` and add its sources to the running source table.
3. Log one memlog line per source batch (`--type source`) and one per load-bearing claim worth tracking for refresh (`--type claim`, include class and pub date).
4. Checkpoint: one or two lines in chat — what the dimension found, anything surprising, anything unresolved. Keep moving unless the user speaks up; a mid-run scope change is logged as a `decision` and the plan adjusts. Headless: skip checkpoints entirely.

When all dimensions are done, proceed to `references/verification.md`.
