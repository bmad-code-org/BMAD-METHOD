Picking a channel in the picker is ignored when the module has a registry `pin`.
The `tea` pin (v1.27.2) wins, and the manifest records `channel: pinned` with no message.

`decideChannelForModule` checked `registryPin` before `--next=CODE`, and the picker never recorded a `stable` pick.

New order: `--pin` > `--next=CODE` or picker stable > registry pin > `--channel`/`--all-*` > registry default > `stable`.

- `channel-plan.js`: explicit per-module picks resolve before the registry pin. New `stableSet` holds a `stable` pick.
- `ui.js`: `next` is gone from the install picker and from the update flow's channel review. A stable pick fills `stableSet`. A legacy install that tracks `main` moves to stable without a prompt.
- Tests: "registry pin beats --next" splits into three cases. Picker-level tests drive the install and update flows, including the all-stable fast path that keeps the pin.

`--yes`, the all-stable fast path and `--channel` still get the pin.

`--next=CODE` stays for headless use.
On 6.12 it now installs `main` for a pinned module, which fails for TEA v2+ because that layout needs the v7 installer.

`npm run quality` passes.
