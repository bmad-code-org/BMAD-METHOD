# APF v2 Baseline Inventory

This directory records the Phase 0 baseline before any APF runtime migration.

- `baseline.md` is the human-readable snapshot of the current expansion pack.
- `entity-migration-map.yaml` assigns every active agent and workflow exactly one proposed APF v2 disposition.

The migration map is a planning contract, not a deletion list. A `DEPRECATE` or `DELETE` disposition may be executed only after its replacement, references, compatibility alias, and validation coverage are in place.

The canonical target namespace remains subject to the naming ADR recorded in `baseline.md`. Existing `bmad-apf-*` identifiers remain active until that decision and the compatibility plan are implemented.
