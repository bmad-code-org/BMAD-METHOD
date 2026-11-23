# Method planning guidance

For Method plans, requirements, and cases for a decision. These rules add to the engine's; the template's own comments win over them.

## Opening

When the document plans work the ticket tree will hold, a container is active or a ticket is in play, and neither the caller, the template, nor the ticket already fixes the altitude, the opening asks first which level of the tree the document is for: the program, the initiative, or an epic. Templates whose altitude is fixed (`prd-program`, `prd`, `prd-epic`, `charter`) already disambiguate the level, so skip that question when one of them is selected.

## Parent-aware spine

When a parent container or spec exists (`program-*.md`, `initiative-*.md`, or a parent PRD along with its `companions:` or `sources:`), read it first, inherit its `OKR-N`, `INV-N`, shared nouns, and `BR-N` or `RULE-N` constraints by id citation without restating them, and ask only for what this level adds or narrows. When no parent spine exists (such as a standalone `epic-*` or greenfield `prd-epic`), establish a compact strategic floor inline before diving deep: problem, non-goals, tiered `OKR-N` (`Passable` / `Good` / `Excellent`) with production measurement, binary `INV-N` invariants, and boundaries or seams.

## Stakes

Read the stakes as one of: hobby or personal use, internal, pitch or investor, publication, public launch, regulated or contracted.

- At hobby stakes, one line fills a section. Skip reconciliation unless the user wants it, and run no reviewers and no `skill:` doc standard.
- Below regulated or contracted stakes, default and tag. At them, ask instead, and invent no regulation, citation, or threshold. An obligation the user did not name, from you or a reviewer, is an open question; headless, so is anything you would have asked.
- Only at launch, regulated, or contracted stakes may a review fix make the document longer.

## Ids and requirements

Give stable ids to anything others will cite, each a short uppercase prefix, a hyphen, and a number, such as `REQ-3` or `FR-3`, the form `check_ids.py` reads. Where the document carries requirements or scope, make each requirement testable and each edge explicit; coaching a requirements document stops when the remaining questions reach edge cases and trade-offs. Names, owners, and dates in the body come from the user, never the environment.

## The level below

Push detail that belongs at a lower altitude down to the level below or split it out rather than padding this document. A review finding that would grow the agreed scope, or add detail the level below should decide, goes to that level or the open questions unless the user asks for it by name. Defer each open item with an owner and a revisit condition.
