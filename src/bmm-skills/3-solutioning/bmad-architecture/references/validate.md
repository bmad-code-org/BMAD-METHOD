# Validate

The Validate intent playbook. Standalone — it critiques an existing architecture spine without changing it and ends after the user has seen the report; it does not run Finalize. The synthesis pipeline is also reused for mid-session report requests during Create/Update.

## Orient

Note the paths — `.memlog.md`, the driving spec (if any), and `ARCHITECTURE-SPINE.md` — but don't read them in the parent. The rubric walker and any heavy-read subagents own the reads and return extracts (specify exact return format); the parent assembles from those.

## Run the Reviewer Gate

This file owns the canonical reviewer menu (SKILL.md routes here). Run the gate against `ARCHITECTURE-SPINE.md`; selected reviewers run as parallel subagents, each writing `{doc_workspace}/review-{slug}.md` and returning a compact summary.

- **rubric walker** — the default entry; pipeline below.
- **consistency auditor** — mechanically walks the Capability → Architecture Map for orphans, uncovered capabilities, and terminology drift. On by default under Validate intent (where mechanical orphan-walking matters most).
- **adversarial divergence-hunter** — refutational reviewer (prompt below); on by default whenever stakes are high (regulated, enterprise, cross-team), since a missed divergence point is the spine's costliest failure. Lower-stakes runs may skip it.
- **`{workflow.finalize_reviewers}`** plus any **ad-hoc lens** the content warrants (a security/compliance lens for regulated stakes, and similar).

Validate additionally runs the synthesis pipeline below.

## Rubric-walker pipeline

First run `python3 {skill-root}/scripts/lint_spine.py --workspace {doc_workspace}` and hand its JSON to the walker, so the mechanical half of decision-integrity (literal placeholders, duplicate or non-monotonic `AD-n` IDs, `AD-n` blocks missing Binds/Prevents/Rule, unpinned `name@version` stack entries) is already settled and the walker spends judgment on the semantic half. Spawn the rubric walker as a subagent with this prompt:

> You are validating an architecture **spine** — a consistency contract that fixes only the **invariants** (paradigm, boundaries, who-may-depend-on-whom, state mutation) keeping the independently-built level below (features, epics, or stories, per its altitude) coherent, treating stack/tree/data-shape as disposable **seed**. Read its `.memlog.md`, the driving spec if one exists, and `ARCHITECTURE-SPINE.md`. Judge each dimension below — *strong / adequate / thin / broken* — and write findings only where they add information. Cite specific spine locations and quote phrases. Severity ranks impact on the spine's job (cross-unit consistency), not how easy the fix is.
>
> Dimensions:
> 1. **Consistency coverage** — does it fix the real divergence points for the units one level below? Actively hunt for conflict points it *missed* (where two independent builders could still diverge). This is the primary lens.
> 2. **Leanness, form & altitude** — does every entry survive the three-part test (units *could* diverge ∧ non-obvious ∧ real trade-off)? Flag premature design detail a single unit below should own, structural seed maintained as if durable, prose/bullet walls a C4 diagram/ERD/tree would carry better, and any rationale narrative (rationale belongs in the memlog). The spine should **lead with a named paradigm** and put invariants before seed.
> 3. **Decision integrity** — each `AD-n` has a stable unique ID, a `Binds` scope pointing at real capabilities/areas, a `Prevents` divergence, and an actual enforceable `Rule` — and *no* rationale line. The durable rules a clean codebase can't reveal (dependency boundaries, state mutation) are actually captured. IDs never reused or renumbered.
> 4. **Diagram leverage** — shape carried by C4 (L1–3 as warranted), shared data by an ERD, structure by a minimal source tree; diagrams accurate and matching the prose/decisions, not decorative.
> 5. **Version & fit currency** — named technologies carry verified current versions (not recalled guesses), and prior-input tech choices that were adopted still fit — anything stale, mis-scaled, or unverified is flagged rather than silently inherited.
> 6. **Deferred discipline** — decisions pushed down are *named* under Deferred with a reason, not silently omitted.
> 7. **Brownfield fidelity** (only if brownfield) — the spine ratifies the conventions actually present in the codebase rather than contradicting them.
> 8. **Spec fit** (only if a spec drove it) — the Capability → Architecture Map covers the spec's capabilities and the spine honors its constraints.
>
> Write your review to `{doc_workspace}/review-rubric.md`: a one-paragraph overall verdict, then per-dimension judgment + findings. Return ONLY a compact summary (overall verdict, dimension verdicts, finding counts by severity, file path).

## Adversarial divergence-hunter

Refutational, not evaluative, and orthogonal to the rubric walker's judgment (stakes-gating is in the menu above). Spawn it as a subagent with this prompt:

> You are an adversarial reviewer of an architecture **spine** — a consistency contract whose one job is to stop the units one level below (features, epics, or stories, per its altitude) from being built incompatibly. Your stance is refutation, not evaluation: assume there is a hole and find it. Read its `.memlog.md`, the driving spec if one exists, and `ARCHITECTURE-SPINE.md`. Then attack:
> 1. **Hunt the missed divergence.** Walk the units one level down and try to construct two that, each obeying the spine to the letter, still build incompatibly — different shapes for shared data, two owners of the same entity, incompatible contracts across a boundary, conflicting state-mutation paths. Every pair you can construct is a hole the spine must close.
> 2. **Break the rules.** For each `AD-n`, try to satisfy its `Rule` while still causing the divergence its `Prevents` claims to stop. If you can, the Rule is not enforceable and the AD is theater.
> 3. **Probe the deferrals.** For each item under `Deferred`, check it is genuinely safe to defer — that two units could not diverge on it. If they could, it was deferred wrongly and belongs in the spine.
> 4. **Stress the seam** (cross-team / brownfield) — where the spine binds to existing services or team boundaries, find the integration or ownership assumption that does not actually hold.
>
> Report only real holes, each as: the two divergent builds you constructed, the spine location that should have prevented it, and the minimal fix (a new `AD-n`, a tightened `Rule`, or a deferral pulled back in). Do not restate what the spine got right; a confirmed hole is High or Critical severity. Write your review to `{doc_workspace}/review-divergence-hunter.md`; return ONLY a compact summary (hole count by severity, the sharpest one, file path).

## Synthesis pipeline

Once every selected reviewer has returned, the parent consolidates one markdown report. **Do not skip under Validate intent** — it is the persistent artifact the user opens.

1. Read every `{doc_workspace}/review-*.md`.
2. Get the grade from the script — don't derive it by hand. Pipe the rubric walker's per-dimension verdicts and each reviewer's severity counts to `python3 {skill-root}/scripts/grade_spine.py`; it returns `grade`, `severity_totals`, and the deciding `reason`. Payload shape: `{"dimensions": {"consistency": "strong", ...}, "reviewers": [{"slug": "rubric", "severity": {"critical": 0, "high": 1, ...}}, ...]}`.
3. Write `{doc_workspace}/validation-report.md`:

```markdown
# Architecture Spine Validation — {name}

- **Spine:** `{path}`
- **Altitude:** {system | epic}
- **Run at:** {ISO timestamp}
- **Grade:** {Excellent | Good | Fair | Poor}

## Overall verdict
{synthesis paragraph; add a second paragraph if extra reviewers materially shift the picture}

## Dimension verdicts
- Consistency coverage — {verdict}
- Leanness & altitude — {verdict}
- (etc. for each assessed dimension)

## Findings by severity
### Critical (n)
**[Dimension or Reviewer]** — Title (§ location)
{Note}
Fix: {suggested fix}
### High (n)
...
### Medium (n)
...
### Low (n)
...

## Reviewer files
- `review-rubric.md`
- (any extra `review-{slug}.md`)
```

Re-running validation overwrites the report in place; individual `review-*.md` files are preserved for drill-in.

## Close

Surface the report path. Always offer to roll findings into an Update.
