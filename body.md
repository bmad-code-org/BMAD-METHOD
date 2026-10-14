Picking `next` or `stable` in the channel picker is ignored when the module has a registry `pin`.
The `tea` pin (v1.27.2) wins, and the manifest records `channel: pinned` with no message.

`decideChannelForModule` checked `registryPin` before `--next=CODE`, and the picker never recorded a `stable` pick.

New order: `--pin` > `--next=CODE` or picker stable/next > registry pin > `--channel`/`--all-*` > registry default > `stable`.

- `channel-plan.js`: explicit per-module picks resolve before the registry pin. New `stableSet` holds a `stable` pick.
- `ui.js`: the picker fills `stableSet`.
- Tests: "registry pin beats --next" splits into three cases.

`--yes`, the all-stable fast path and `--channel` still get the pin.

TEA v2+ uses the v7 layout, so picking `next` for TEA on 6.12 now fails with `Expected 'src/module.yaml' to exist in version v3.0.0`.
Before, it silently installed v1.27.2.
If the pin should stay authoritative, the alternative is a warning.

`npm run quality` passes.
