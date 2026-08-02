# Placement — first run only

How the kernel and compasses reach agents is the user's choice, asked once and changeable any time. Confirm the bundle location (`{project_knowledge}`) in the same breath.

The three placements:

- **bmad** — loaded via BMad customization arrays; agent files untouched. Recommend adding `file:{project_knowledge}/kernel.md` to `persistent_facts` in the workflows they use — offer to invoke `bmad-customize` to do it. The legacy `**/project-context.md` glob already in those arrays keeps outputs from the retired bmad-generate-project-context loading.
- **agent-files** — the script writes managed `<!-- bmad:context -->` blocks into root and nested `AGENTS.md` files (`sync` command); surrounding content is never disturbed, and `sync --dry-run` previews every file a sync will touch. The only loading path without BMad — the standalone default.
- **both** — arrays plus agent files, kept in sync.

Suggest by detection (BMad install present → bmad; none → agent-files), and record the answer as `context_placement` — the one key this skill ever writes into project config (standalone: `{project-root}/_bmad/context.yaml`), because `context.py sync` refuses to run without it. Whatever the placement, recommend a one-line pointer to the kernel in their root agent file if nothing else loads it.
