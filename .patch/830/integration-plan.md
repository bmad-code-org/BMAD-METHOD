# Integration Plan for Markdown Conformance (PR-830)

## Goals
- Ensure BMAD-generated and authored Markdown renders correctly across CommonMark-compatible parsers.
- Enforce six PR-830 rules (lists/tables/fences spacing, bullet dash style, fence language) with low friction.

## Components
1) Custom conformance checker (already added): `tools/markdown/check-md-conformance.js`
   - Zero-dep, fast, CI-friendly, includes table blank-line rule.
2) markdownlint (config in `.patch/830/.markdownlint.json` + custom table rule):
   - Authoring ergonomics via editor integration and CLI.

## CI wiring (proposed)
- Add npm scripts in `package.json`:
  - "check:md:docs": "node tools/markdown/check-md-conformance.js docs"
  - "check:md:all": "node tools/markdown/check-md-conformance.js docs bmad src"
  - "lint:md": "markdownlint \"docs/**/*.md\" \"bmad/**/*.md\" \"src/**/*.md\" --config .patch/830/.markdownlint.json --rules .patch/830/markdownlint-rules/table-blank-lines.js"
- In CI (GitHub Actions):
  - Run `npm run check:md:all` as the source of truth for PR-830 guarantees.
  - Optionally run `npm run lint:md` to provide authoring feedback.

## Editor setup
- Recommend VS Code extension: `DavidAnson.vscode-markdownlint`.
- `.markdownlint.json` will apply automatically for built-in rules.
- Use CLI for the custom table rule until we package it or port to a custom ruleset extension.

## Roadmap
- Short term:
  - Keep both tools; rely on custom checker for CI gating.
  - Fix high-traffic docs incrementally (e.g., docs/ide-info/*) or via targeted scripts.
- Medium term:
  - Consider a safe auto-fix utility for inserting blank lines and fence languages.
  - Evaluate porting the table rule into a markdownlint custom rules package.
- Long term:
  - Integrate checks into generation pipelines so outputs are clean by default.

## Acceptance
- `npm run check:md:all` passes on a representative set of generated outputs and curated docs.
- markdownlint reports minimal violations aligned with team conventions.
- No regressions in rendered structure across parsers.
