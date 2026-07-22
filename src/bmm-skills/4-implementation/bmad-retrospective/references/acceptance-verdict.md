# Decide: Routing and the Acceptance Verdict

Phase 4. Turn the consolidated findings into two outputs: routed action items the human can act on, and an honest verdict on whether the epic met its bar. This skill proposes; it does not auto-apply fixes or edit the project spec. The human decides what executes.

## Route each finding

Give every finding two independent dispositions:

- **What to do about this instance** — *fix now*, *defer*, or *accept as-is*. Fix-now findings become action items. Deferred findings carry enough context to be picked up cold. Accepted deviations are recorded so later retros stop re-flagging them.
- **What would prevent the next one** — the upstream lesson: spec wording, story sizing, a missing convention or gate, or nothing. This is where a recurring finding becomes a process change rather than a one-off fix.

Findings from sub-agents or the team discussion are testimony, not truth. Before an action item leans on one, reground it against the primary source — reopen the file, the commit, the spec. A finding whose source does not hold up is dropped, not routed.

## Action items

Compile fix-now findings and process lessons into specific, owned action items. Each names what to change and who owns it. Two kinds are *proposed, not applied* in this version:

- **Remediation** — code fixes are written up as action items (or story-shaped work) for the normal dev loop to execute later. The retrospective does not run the dev loop itself.
- **Spec reconciliation** — where the as-built diverges from the spec, propose the reconciliation as an action item with the evidence attached. The human applies it to the project contract; an uncertain interpretation is never written into the spec automatically.

## The verdict

Judge the final state against the epic's declared acceptance criteria. If the epic declared none, profile the criteria from the diff and stories and mark the verdict as **profiled** rather than declared. Weigh verification results (the Phase 2 behavior check) and unresolved findings. Render one of:

- **Accepted** — criteria demonstrably met in the evidence, no blocking findings open.
- **Accepted with open items** — criteria met, but named findings remain deferred and tracked.
- **Rejected** — criteria not met, or a blocking finding stands unresolved.

Two hard rules:

1. A human decision always overrides the machine verdict.
2. An epic that fails its criteria with **no** human decision closes as **not accepted** — never as silently accepted.

The verdict and its evidence carry into the Phase 5 document.
