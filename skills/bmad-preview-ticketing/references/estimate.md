# Estimating

Only when `{workflow.estimation}` has `enabled = true`; otherwise never raise it. Points and t-shirts share one unit: a t-shirt is a range of summed story points, so an epic sized before inception and its stories pointed later reconcile.

## Where an estimate lives

`estimate` in every ticket's frontmatter; `estimate_basis` in a container's. The basis says what the number rests on: `envelope` (intent only), `spec`, `drafts` (thin tickets pointed), `stories` (refined stories pointed). Every re-estimate appends an `Estimate:` line in Notes — old value, new value, basis, reason — so drift is visible. The store's `fields` global says how a tracker carries it.

## When to offer one

- Epic definition complete, before the story breakdown: an imagined split. Name the probable stories, point each per the rubric, sum, map to the t-shirt. The reasoning goes in the epic's Notes, marked as imagined; inception replaces it. Basis `spec`, or `envelope` when there is none.
- Whole epic breakdown approved: point every Breakdown entry, file or not, and re-estimate the epic from the sum. Basis `drafts`; refinement can change the estimate.
- Story refined: point it from its criteria and re-sum the whole ticket set if it moved. Basis `stories` once every ticket is refined; publication status does not change the basis.
- Story closed: ask whether the actual matched. A miss is a Notes line on the story; a 1-2 that needed a person is the miss that matters most.

## What the size says

XL, or a sum above the map's top range, is the signal to offer splitting the epic before it is sliced: say which imagined stories cluster into what, per `{workflow.slice_to_epics}`. S or below at the envelope is the signal for the Small epic path (SKILL.md, Intake). The user overrides either way; an override is a `Decision:` line.

## Calibration

On request, or offered once a store holds ten or more closed tickets with both an estimate and an actual: `query` them, hand a subagent the pairs and the current rubric and map, and take back a proposed rubric and map that fit the team's distribution, with the reason for each change. Show it; write it to the team override of `customize.toml` only with approval.
