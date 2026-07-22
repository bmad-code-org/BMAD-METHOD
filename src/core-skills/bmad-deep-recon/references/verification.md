# Verification Pass

Runs after the acquisition loop, before synthesis. This is the trust layer — the same pass whatever mode produced the material.

## The claims ledger

Assemble from the memlog `claim` entries plus a scan of `research.md`: every claim a decision could rest on. Each entry: the claim, its class (each pack names its classes — quantitative sizes, pricing, versions/compatibility, regulatory assertions, …), source, publisher, publication date, and current status. New claims enter `unverified` until this pass says otherwise; on a Refresh or Deepen run, claims outside the run's scope keep their prior status from the memlog — only new and in-scope claims are (re)checked.

## Cross-checking

Per the resolved `validation` level (request > knob > preset):

- **normal** — cross-check each claim in the pack's *two-source classes*: find one additional **independent** source, via verifier assistants in parallel where available.
- **high** — cross-check every claim in the ledger, and run the red-team pass on major conclusions regardless of `{workflow.red_team}`.
- **max** — high, plus an independent adversarial verifier per major conclusion (a fresh assistant prompted to refute it, blind to the supporting evidence) and primary-source-priority ranking: where a primary source (filing, regulator text, official docs, original paper) exists, secondary reporting alone does not verify.

Verifier assistants follow `{workflow.subagent_models}` when set; judgment work never drops to the smallest tier.

**Independent** means a different publisher with different underlying data or reporting — not a syndication, quote, or republication of the first source, and not the same vendor's marketing in two places. An engine that produced a claim counts as one publisher regardless of how many sources its own report claims.

Outcomes per claim: **verified** (independent source agrees within tolerance — for quantitative claims, same order of magnitude and direction), **disputed** (independent sources materially disagree — report both figures, both cited; never average), **unverified** (no independent source found within budget — the claim stays, flagged, and joins the staleness map), or **overturned** (the weight of evidence contradicts it — corrected in the text, with the original noted). Every status change lands in the memlog; a claim that fails outside its freshness window is re-searched for a current figure before being cross-checked at all.

Confidence rendered in the report: **high** (verified, fresh, credible publishers), **medium** (single credible source, fresh), **low** (stale, weak publisher, or disputed) — plus the explicit `unverified` flag. Confidence is per-claim, never per-section.

## Red-team pass

When on (per `{workflow.red_team}` and the plan gate): for each major conclusion the report is heading toward, a skeptic subagent searches specifically for disconfirming evidence — the bear case, failed attempts, contrary data, the strongest good-faith argument the conclusion is wrong. Skeptics get the conclusion and the search budget, not the supporting evidence — they hunt fresh.

What comes back is weighed, not appended: a conclusion that survives gets its strongest counter-argument acknowledged in the synthesis; one that doesn't is revised before the report ever states it. Material findings land in a **Contrary Evidence** section with the same citation discipline. Zero findings after a real search is itself reportable — say what was searched for and not found.

When the pass completes, proceed to `references/synthesis.md`.
