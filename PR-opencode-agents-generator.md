# feat(opencode): compact AGENTS.md generator and JSON-only integration

## What

Add JSON-only OpenCode integration and a compact AGENTS.md generator (no large embeds; clickable file links) with idempotent merges for BMAD instructions, agents, and commands.

## Why

Keep OpenCode config schema‑compliant and small, avoid key collisions, and provide a readable agents/tasks index without inflating AGENTS.md.

## How

- Ensure `.bmad-core/core-config.yaml` in `instructions`
- Merge only selected packages’ agents/commands into opencode.json file
- Orchestrators `mode: primary`; all agents enable `write`, `edit`, `bash`
- Descriptions from `whenToUse`/task `Purpose` with sanitization + fallbacks
- Explicit warnings for non‑BMAD collisions; AGENTS.md uses a strict 3‑column table with links

## Testing

- Run: `npx bmad-method install -f -i opencode`
- Verify: `opencode.json[c]` updated/created as expected, `AGENTS.md` OpenCode section is compact with links
- Pre‑push checks:

```bash
npm run pre-release
# or individually
npm run validate
npm run format:check
npm run lint
# if anything fails
npm run fix
# or
npm run format
npm run lint:fix
```

Fixes #<issue-number>

Targets: `next` branch
