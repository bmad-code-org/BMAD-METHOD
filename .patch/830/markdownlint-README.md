# markdownlint configuration for PR-830

This directory contains a minimal markdownlint configuration plus a custom rule to mirror the CommonMark-oriented checks in `tools/markdown/check-md-conformance.js`.

## What it enforces

- MD031: Fenced code blocks surrounded by blank lines
- MD032: Lists surrounded by blank lines
- MD040: Fenced code blocks have a language (e.g., ```bash)
- MD004: Unordered list style uses dash (`-`)
- Custom rule: Tables must be surrounded by blank lines (before and after)

Notes:
- Some noisy rules are disabled (e.g., MD013 line length) to focus on PR-830 goals.

## How to run (CLI)

Using markdownlint-cli without adding a dev dependency:

```powershell
npx markdownlint-cli "docs/**/*.md" --config .patch/830/.markdownlint.json --rules .patch/830/markdownlint-rules/table-blank-lines.js
```

Run on multiple folders:

```powershell
npx markdownlint-cli "docs/**/*.md" "bmad/**/*.md" "src/**/*.md" --config .patch/830/.markdownlint.json --rules .patch/830/markdownlint-rules/table-blank-lines.js
```

Tip:
- You can add `--fix` for autofixes supported by core rules (does not affect the custom table rule).
- VS Code users can install the "markdownlint" extension; it will honor `.markdownlint.json` in the workspace root. For the custom rule, run via CLI as above.
