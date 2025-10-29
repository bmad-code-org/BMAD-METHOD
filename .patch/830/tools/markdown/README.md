# Markdown Conformance Checks

A small CommonMark-oriented conformance checker to validate BMAD markdown output for:

- Blank line before/after bullet and numbered lists
- Blank line before/after tables
- Blank line before/after fenced code blocks
- Bullet marker normalization to `-`
- Code fence language presence (e.g., ```bash)

## Run

From the repo root:

```powershell
node tools/markdown/check-md-conformance.js docs/ bmad/ src/ .patch/830
```

- Provide one or more files or directories. Directories are scanned recursively for `.md` files.
- Exit code is 0 when no violations are found; 1 otherwise.

## Notes

- The checker ignores content inside fenced code blocks.
- Table detection is heuristic (lines with `|`); it’s sufficient for CI-style checks.
- This tool does not fix files; it only reports violations.
