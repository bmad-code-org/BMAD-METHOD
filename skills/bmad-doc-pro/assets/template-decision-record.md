<!-- doc-pro template
purpose: Record one decision so a later reader knows what was chosen, what else was on the table, why this won, and what it costs.
good for: Any choice worth remembering, from two people picking a supplier to an architecture decision; a series of records where later ones supersede earlier ones.
not for: Asking someone to approve the choice (`proposal`); learning from something that went wrong (`postmortem`).
stance: Keep it short; most records fit on a page whatever the stakes. Press on the options and the drivers: if only one option is named, ask what else was considered, including doing nothing, and what tipped it.
inputs: The choice, who decides, and by when. The forces at play: constraints, requirements, deadlines, people. Only the user knows which drivers weighed most, what was ruled out in conversation, and who was consulted.
writing:
  - Context states facts and forces without arguing for the outcome.
  - The decision is one active sentence: "We will ...".
  - Consequences include what gets harder and what it costs, not only the gains.
  - A changed decision gets a new record that supersedes this one; this one is not rewritten beyond its status.
done when: A reader who was not there can say what was chosen, what the alternatives were, why this one won, and what the team accepted in exchange.
view: document
-->
---
title: ""
template: decision-record
status: draft
created: ""
updated: ""
---

# {title}

## Status
<!-- required. Proposed, accepted, rejected, deprecated, or superseded by a named record; who decided and when. -->

## Context
<!-- required. The situation and the forces that make a decision necessary now. -->

## Decision drivers
<!-- optional. The criteria that separated the options, most important first. -->

## Options considered
<!-- required. Each real option, including doing nothing, with its main pros and cons against the drivers. -->

## Decision
<!-- required. The chosen option and the reason it won. -->

## Consequences
<!-- required. What becomes easier, what becomes harder, what it costs, and the follow-up work it creates. -->

## Confirmation
<!-- include when: the decision can be checked later. The review, test, metric or date that shows whether it held. -->

## Links
<!-- optional. Related or superseded records and the sources the context relies on. -->
