# Decide: Routing and the Acceptance Verdict

Phase 4. Turn the consolidated findings into two outputs: routed action items the human can act on, and an honest verdict on whether the epic met its acceptance criteria. This skill proposes; it does not auto-apply fixes or edit the project spec. The human decides what executes.

## Route each finding

Give every finding two independent dispositions:

- **What to do about this instance** — *fix now*, *defer*, or *accept as-is*. Fix-now findings become action items. Deferred findings carry enough context to be acted on later without re-investigation. Accepted deviations are recorded so later retros stop re-flagging them.
- **What would prevent the next one** — the upstream lesson: spec wording, story sizing, a missing convention or gate, or nothing. This is where a recurring finding becomes a process change rather than a one-off fix.

Findings from sub-agents or the team discussion are unverified reports, not established facts. Before an action item relies on one, re-check it against the primary source — reopen the file, the commit, the spec. A finding whose source does not hold up is dropped, not routed.

## Action items

Compile fix-now findings and process lessons into specific, owned action items. Each names what to change and who owns it. Two kinds are *proposed, not applied* in this version:

- **Remediation** — code fixes are written up as action items (or story-shaped work) for the normal dev loop to execute later. The retrospective does not run the dev loop itself.
- **Spec reconciliation** — where the as-built diverges from the spec, propose the reconciliation as an action item with the evidence attached. The human applies it to the project contract; an uncertain interpretation is never written into the spec automatically.

## Previous-retro follow-through

When the previous epic's retrospective file exists, check whether the action items it committed to were completed. Read its Action items section, and its Previous-retro follow-through section for the items recorded there as not landed, and for every item, record one line in the retrospective document's Previous-retro follow-through section:

- **The item** — its action text as the previous file spells it, and its owner.
- **Whether it landed** — with the source that shows it: the commit, the file and line, the test. An item you cannot point at is "no evidence found", not "not done" — the reader must be able to tell a checked item from an unchecked one.

No status is written anywhere; the record is the follow-through. A run with no previous retrospective file, or one whose file has no Action items section, records that there was nothing to follow through on — and which of those it was, so a missing file is never mistaken for "no outstanding items."

## The verdict

Judge the final state against the epic file's Done when. If the epic file has none, profile the criteria from the diff and plans and mark the verdict as **profiled** rather than declared. Weigh verification results (the Phase 2 behavior check) and unresolved findings. Render one of:

- **Accepted** — criteria demonstrably met in the evidence, no blocking findings open, and **no unfinished tickets** for this epic.
- **Accepted-with-open-items** — criteria met, but named findings remain deferred and tracked — still only when every ticket of this epic is finished.
- **Rejected** — criteria not met, a blocking finding stands unresolved, **or any of this epic's tickets is still unfinished**.

### Unfinished tickets

`pending_tickets` is authoritative for this epic's incomplete work: the `ref`s of the `tickets.py status <folder>` rows that are unfinished — `status` not `built` and `state` not `done` or `dropped` — in build order. When that list is non-empty:

- The **machine** verdict is **rejected**. Name every unfinished ticket in the Acceptance verdict section as the evidence. Do not soften this to accepted-with-open-items: unfinished delivery is not an open finding about a finished epic — the epic itself is incomplete.

If the completeness check did not run (`tickets.py status` failed), do **not** render a rejected or accepted verdict from the absence of data — say the check was unavailable and weigh only the criteria and findings you have.

Three hard rules:

1. A human decision always overrides the machine verdict.
2. An epic that fails its criteria with **no** human decision is recorded as **not accepted** — never as silently accepted.
3. A non-empty `pending_tickets` list makes the machine verdict **rejected**, including in headless mode.

The verdict and its evidence carry into the Phase 5 document.
