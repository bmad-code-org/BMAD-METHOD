# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the canonical source for agents and workflows (`core/` shared assets, `modules/` for BMM/BMB/CIS, `utility/` helpers).
- `bmad/` mirrors the install-ready payloads; regenerate via bundlers instead of editing files there directly.
- `tools/` hosts the Node CLI, bundlers, validators, and test fixtures; CLI entry points live under `tools/cli`.
- `docs/` holds contributor-facing guides—update alongside feature changes so installers and slash commands stay accurate.

## Build, Test, and Development Commands
- `npm run lint` runs ESLint across JS and YAML; required before opening a PR.
- `npm run format:check` / `npm run format:fix` enforces Prettier (140 width, 2-space indent).
- `npm run bundle` rebuilds the distributable agent bundles under `bmad/**`; use after touching `src/**`.
- `npm run validate:bundles` confirms bundle integrity and manifests stay in sync.
- `node tools/cli/bmad-cli.js status` (`npm run bmad:status`) checks local installer health.

## Coding Style & Naming Conventions
- JavaScript is formatted by Prettier with semicolons and single quotes; keep folders named for agent personas (`architect/`, `dev/`, etc.).
- CLI scripts in `tools/**` may stay CommonJS, but prefer clear filenames and avoid new abbreviations.
- YAML files must use the `.yaml` extension and double-quoted strings per lint rules.
- Markdown docs typically wrap near 140 characters and use imperative language for steps.

## Testing Guidelines
- Jest 30 ships with the repo—run `npx jest` or target suites such as `npx jest tools/cli/test-bundler.js`.
- Tests sit alongside utilities (`tools/**/test-*.js`); follow that pattern when adding coverage.
- Add regression tests before changing bundlers or installers, covering at least one happy-path scenario.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat(installer): ...`, `fix: ...`) as seen in recent history.
- Keep PRs scoped; call out bundle or manifest impacts in the description and link relevant issues.
- Before opening a PR, ensure `npm run lint` passes, regenerate bundles when needed, and update docs for user-facing changes.
- Request review from the owning module (BMM, BMB, CIS) when editing their agents or workflows.

## Agent Asset Tips
- Never hand-edit generated content under `bmad/**`; modify `src/**` sources and rerun the bundler instead.
- New agents belong in `src/core/agents` with installer logic in `_module-installer/` to stay compatible with the CLI.
