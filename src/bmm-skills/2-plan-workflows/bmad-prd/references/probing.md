# Probing

Loaded on entry to Discovery or Update.

One probe per turn. When multiple gaps surface, pick the most load-bearing; record the others as Open Questions.

## Seven probing categories

| Trigger | Probe | Where it lands |
|---|---|---|
| Vague outcome ("better", "faster", "love it") | "What does it look like when it's working? How would you know?" | §7 Success Metrics, or Open Question |
| Evidence conflict (implied behavior change contradicts existing PRD/code/decision) | "Current behavior is X per [source]. Is the change to Y deliberate?" | `decision-log.md`; `[NOTE FOR PM]` in affected feature |
| Scope ambiguity ("all users", "the checkout flow") | "Does this apply to X? Is Y in or out?" | §5 Non-Goals or inline `[NON-GOAL]` |
| Missing failure UX (happy path only) | "What does the user see when X fails? Acceptable, or needs handling?" | Feature/FR; Open Question if undecided |
| Competing commitments (two requirements in tension) | "When A and B conflict, which wins?" | `decision-log.md` + counter-metric in §7 |
| Data availability (SM depends on data not verified to exist) | "Does the data exist today in measurable form? Baseline?" | SM definition or `[ASSUMPTION]` |
| Design readiness (UI implied without design) | "Reviewed design exists, or Open Question?" | Open Question; ref `bmad-create-ux-design` |

## Six critical assumptions to scan before drafting

Mechanism ambiguity, scope boundary, data availability, design readiness, dependency, timeline/commitment. When unresolved, tag `[ASSUMPTION: ...]` inline and surface in §9 Assumptions Index.

## PRD / solution-design boundary

A PRD probe asks WHAT, who, success, change. Not PRD probes (route to `addendum.md` or surface as an Open Question to `bmad-create-architecture`):

- Mechanism / transport ("queue or API?")
- Build vs. consume ("build or vendor?")
- Internal architecture ("monolith vs. service?")
- Commercial-outcome decisions

If a probe crosses into architecture, record in addendum or surface as an Open Question; don't pose it as a multi-choice question in the PRD session.
