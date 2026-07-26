# Migrating from APF v1 to APF v2

APF v2 replaces the active 53-agent roster with four persistent coordinators and replaces the linear lifecycle with eleven focused workflows. The complete v1 disposition record is [inventory/entity-migration-map.yaml](inventory/entity-migration-map.yaml).

## Active v2 entry points

- Existing repository work: `bmad-apf-execute`
- Team project context: `bmad-apf-project-contract`
- New lifecycle: `bmad-apf-launch-product`
- Opportunity decision: `bmad-apf-validate-opportunity`
- Product planning: `bmad-apf-plan-product`
- Delivery planning: `bmad-apf-plan-delivery`
- Approved implementation increment: `bmad-apf-build-vertical-slice`

## Resolving a v1 identifier

During the transition release, resolve an old identifier with:

```bash
node tools/apf/resolve-legacy-skill.mjs bmad-apf-build-mvp
```

The resolver returns the target, disposition, and compatibility route. It does not execute a workflow or preserve duplicate v1 implementation.

## Compatibility policy

Legacy implementation files have been removed so that the v1 and v2 processes cannot both remain active. The migration map is retained for one transition release; release notes must announce before the map is removed in the next major version.
