On 6.12.3 the TEA channel picker offers stable, which resolves to v3.0.2.
The install then fails with `Expected 'src/module.yaml' to exist in version v3.0.2`, because TEA v2+ uses the v7 layout.

A module with a registry `pin` now skips the picker, in both the install and update flows.
The installer prints `tea is pinned to v1.27.2. Newer versions need the v7 installer: npx skills add bmad-code-org/bmad-method-test-architecture-enterprise`.
Unpinned modules keep the stable and pin choices.
`--pin CODE=TAG` still overrides a registry pin.

Tests drive the install and update flows with a pinned and an unpinned module.
They fail without the change and pass with it.
`npm run quality` passes.
