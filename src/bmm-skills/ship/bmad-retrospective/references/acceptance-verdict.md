# Decide: Actions and Acceptance Verdict

Phase 4 assigns dispositions to findings and decides whether the epic met its acceptance criteria. Do not apply fixes or edit the epic's source artifacts.

## Finding dispositions

Give every verified finding two decisions:

- Mark the current instance `fix now`, `defer`, or `accept as-is`.
- State what would prevent recurrence: clearer specification text, different story boundaries, a convention, a verification gate, or no change.

Recheck delegated findings against their cited source before using them. Drop findings whose sources do not support them.

Turn fix-now findings and process changes into specific action items with owners. Retrospectives propose remediation and spec reconciliation; the normal development process applies them.

## Authoritative pending list

Use the selected mode's `pending_stories` without reordering it:

- Sprint mode receives sprint-status story keys in file order.
- Stories mode receives `stories.yaml` ids in list order from `stories_status.py inspect`.

Any non-empty pending list forces the machine verdict to `rejected`. Name every pending key or id in the Acceptance verdict section. Record it in Epic summary for an interactive continuation and in Assumptions for a headless run. An interactive human may override after seeing the list.

## Verdict

Judge the final state against declared acceptance criteria. If none exist, profile criteria from the epic intent, stories, and diff, and label them `profiled`. Use one value everywhere:

- `accepted`: the evidence shows all criteria met, no blocking finding remains, and the pending list is empty.
- `accepted-with-open-items`: the evidence shows all criteria met, named non-blocking findings remain tracked, and the pending list is empty.
- `rejected`: a criterion failed, a blocking finding remains, or the pending list is non-empty.

A human decision overrides the machine verdict in an interactive run. Without a human decision, failed criteria must not be recorded as accepted.

## Previous retrospective follow-through

This section applies only in sprint mode. Read `action_items` in `{implementation_artifacts}/sprint-status.yaml`. For each earlier epic item not marked `done`, record its exact `id`, or its exact `epic` integer and `action` text for legacy entries. Record evidence of its current state and propose `done` or `in-progress` only when the evidence supports that status.

Phase 5 may update only transitions the user confirms. Headless runs record proposed transitions and do not write them.

If no prior retrospective exists, sprint status is unreadable, or `action_items` is absent or empty, record which condition prevented follow-through. Do not report an unreadable or absent source as an empty list.

Stories mode records relevant earlier lessons when evidence is available, but it does not create or update a separate action-item store.
