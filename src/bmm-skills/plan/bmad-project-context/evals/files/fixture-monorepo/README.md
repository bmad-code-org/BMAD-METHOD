# nimbus
pnpm workspace monorepo. Global rule: packages never import across workspace
boundaries except through @nimbus/contracts — direct deep imports break the build
cache in non-obvious ways.
