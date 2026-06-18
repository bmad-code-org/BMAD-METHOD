# Architecture Refinement

Use this reference for brownfield architecture work where the problematic seam is visible but the durable decision is not yet known.

## Build the working map

Read the applicable spine and memlog first, then inspect the code, tests, project context, and ADRs needed to establish:

- binding inherited and existing `AD` decisions
- current ownership and dependency direction
- repeated orchestration or knowledge spread across callers
- tests coupled to internals instead of observable behavior
- high-friction seams, interfaces, and module boundaries

Ratify existing reality where it is coherent. Do not create an architecture decision merely to document code that already communicates the rule.

## Find candidates

Look for:

- callers duplicating orchestration or policy
- modules whose removal deletes indirection but no capability
- helpers that moved code without concentrating change or knowledge
- interfaces exposing nearly as much complexity as they hide
- tests that must mock or inspect internals
- seams justified by only one hypothetical implementation

Before proposing interfaces, present a short ranked candidate list. For each candidate include files, divergence risk, likely direction, expected test-surface improvement, governing or conflicting `AD` IDs, migration size, and risk. In an interactive run, stop for the user's choice unless the request already names the target.

## Resolve the chosen candidate

Ask only what removes decision risk:

- What behavior and callers must remain stable?
- Which failures or changes repeatedly cross this area?
- Which inherited decisions and ADRs are binding?
- Is the work behavior-preserving or behavior-changing?
- What observable tests must survive?

Compare realistic options before committing. Use `./interface-design.md` when interface shape is material.

## Dependency and seam rules

- Merge in-process dependencies freely when a smaller interface can hide them.
- A locally substitutable dependency can stay behind the interface when its stand-in supports behavior-level tests.
- Put an owned remote dependency behind a seam only when production and test/local implementations are real.
- Inject a true external dependency at the seam and isolate its adapter.
- One implementation is not evidence of required variation; do not manufacture a port.
- Keep internal seams private when callers do not need to know they exist.

The interface is the preferred test surface. Assert observable behavior, invariants, errors, and performance obligations rather than internal state.

## Translate the result

Accepted durable outcomes must become memlog entries and then stable spine decisions or explicit Deferred items. Optional companions may include:

- `refinement-candidates.md`
- `interface-options-{slug}.md`
- `refinement-recommendation-{slug}.md`

Companions explain evidence and alternatives; they do not override the spine. Cite applicable `AD` IDs and flag conflicts rather than weakening inherited decisions.

At initiative or feature altitude, stop at architecture decisions and Deferred items. Offer story slices or test strategy only at epic altitude or on explicit request; each must cite the governing `AD` IDs.
