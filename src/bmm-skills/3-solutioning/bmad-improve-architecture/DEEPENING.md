# Deepening Guide

Use this guide when deciding how a candidate should absorb its dependencies.

## Dependency categories

### In-process

Pure computation or in-memory state. Merge freely and test through the new Interface.

### Local-substitutable

Dependencies with local test stand-ins, such as in-memory stores or embedded databases. Deepen the Module if the stand-in is good enough to support interface-level tests.

### Remote but owned

A network dependency your system owns. Define a port at the Seam and use at least two Adapters: production and test.

### True external

A third-party dependency you do not control. Inject it at the Seam and test with a mock or fake Adapter.

## Seam discipline

- Do not introduce a Seam unless variation across it is real.
- Keep internal seams inside the Implementation when callers do not need to know about them.
- Prefer one deep Module over a stack of shallow pass-through Modules.

## Testing rule

- Replace shallow-module tests with tests at the deepened Interface.
- Assert observable behavior, not internal state.
- If a test must change for an internal refactor, it is probably testing past the Interface.
