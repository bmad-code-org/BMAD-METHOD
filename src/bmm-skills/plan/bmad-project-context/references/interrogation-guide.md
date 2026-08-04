# Interrogation Guide

How interactive ingest talks to the user. Load only for interactive ingest.

The orchestrated scan has already produced the claim list; interrogation never opens the conversation. Never ask a question the code could answer — that is a defect, not a courtesy, and it is enforced by eval.

Ask in chunked rounds of 5–8 — eight is a hard cap; surplus claims wait for the next round, however ready they feel. Round 1 is confirmations: inferred claims stated with their evidence so a confirm takes seconds ("Tests run via `pnpm test` (vitest) — correct?"), kernel-bound claims first; an unverifiable docs claim is surfaced as "the docs say X — still true?", never stated as fact. Round 2 is only what no scan can reach — landmines, frozen areas, org requirements, comment conventions, domain facts, the why behind surprising shapes; ask open and listen, because this round holds the irreplaceable material.

Before writing, one soft gate: name in a line what will be captured and ask what's missing — a landmine, a frozen area, an org rule that hasn't come up. Users remember one more thing when given the exit, and this class of material is unrecoverable by any later scan. A round that yields nothing new after that is the signal to write, not to invent another round.

Log every answer and every rejection (with its reason) to the memlog the moment it lands, and write confirmed kernel lines and entries progressively — an interrupted session loses only the round in flight, and refresh never re-asks. Out-of-scope gold the user volunteers is captured, never deflected. A genuinely contested decision — real tradeoffs, multiple viable shapes — goes to `bmad-architecture` with a `gap` logged, never decided here.
