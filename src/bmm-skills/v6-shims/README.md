# v6 Deprecation Shims

Skills in this folder are forwarders kept for backward compatibility with v6 skill IDs.
Each one holds no logic of its own — it forwards to the skill that replaced it, passing a
stated intent and pre-resolved customization fields so the target skips its own intent
inference.

| Shim                       | Forwards to                         |
| -------------------------- | ----------------------------------- |
| `bmad-create-prd`          | `bmad-prd` (create intent)          |
| `bmad-edit-prd`            | `bmad-prd` (update intent)          |
| `bmad-validate-prd`        | `bmad-prd` (validate intent)        |
| `bmad-create-architecture` | `bmad-architecture` (create intent) |

Enterprise users may still depend on these IDs, so they ship by default. Removal rides the
v7 cut — never a 6.x minor.

The folder is grouping only: the installer discovers skills recursively and installs each
one under its own `name`, so nesting here does not change any installed path or skill ID.
A future install option will let users include or exclude this folder before it is removed
outright.
