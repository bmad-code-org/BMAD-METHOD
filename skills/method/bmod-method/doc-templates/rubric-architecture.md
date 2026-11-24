Rate each strong, adequate, thin, or broken, judged against the document's altitude, purpose, and stakes:

1. Coupling discipline: fixes real divergence points for the altitude below and omits lower-altitude detail; nothing under Explicitly deferred decisions lets two child units diverge; no speculative over-design for stubbed work.
2. OKR and invariant alignment: every `AD-n` is verified against the parent PRD or ticket's numeric `Passable` / `Good` OKR bounds (latency, throughput, recovery, cost) and binary `INV-N` invariants; flag any decision whose mechanics contradict a stated threshold or invariant.
3. Enforceable `AD-n` contracts: every `AD-n` carries concrete `Binds`, `Prevents`, and `Rule` that stop its stated divergence; construct two child units obeying every `AD-n` literally and flag any pair that still builds incompatibly.
4. Reality and inheritance: named technologies, versions, and starters are web-verified current; brownfield conventions are ratified rather than contradicted; inherited parent `AD-n`s keep original IDs and are never silently weakened or overridden.
5. Operational and scope completeness: every driving ticket requirement maps cleanly, and every structural dimension owned at this altitude (deployment, environments, infra, telemetry hooks for OKR measurement) is decided, deferred with owner and trigger, or logged as an open question.

Then check the template's `Done when` lines.

Write `review-rubric.md`: a two-sentence verdict, the three fixes that matter most, then findings by dimension with severity, location, and fix.
