# Issue #483: Generated story Markdown deviates from GFM/CommonMark (CRLF & whitespace) — breaks automated edits on Windows

**Issue URL:** https://github.com/bmad-code-org/BMAD-METHOD/issues/483
**Status:** Open
**Created:** 2025-08-20T00:22:02Z
**Updated:** 2025-08-20T00:24:39Z
**Author:** amjarmed

## Description

**Describe the bug**
The markdown generated for story files (e.g., `docs/stories/1.1.story.md`) deviates from CommonMark / GitHub Flavored Markdown (GFM) conventions and uses non‑deterministic whitespace/line endings. On Windows, the output includes CRLF and inconsistent blank lines, which causes automated edit tools to fail exact‑match replacements. It also includes heading spacing that isn't standard and occasionally embeds punctuation that doesn't render consistently.

This makes the content brittle and hard to process with tooling (linting, remark/unified transforms, static site generators, and CLI edit steps).

## Steps to Reproduce

1. Generate an example story using BMAD Methods for a Next.js app (Windows environment).
2. Attempt to programmatically update the `QA Results` section with an exact‑match `old_string` via the BMAD edit tool (or similar scripted replacement).
3. Observe that no occurrences are found even though the visual text appears identical.

Example terminal output:

```bash
x  Edit {"old_string":"## QA Results\\n\\n### Review Summary:\\n\\nThe story \"Project Initialization & Setup\" (Story 1.1) is well-defined and covers the essential setup for a new Next.js 15 application. The acceptance criter… |
|
|    Failed to edit, 0 occurrences found for old_string in C:\\Users\\amjarmed\\Desktop\\coding\\autoinvoice.com\\docs\\stories\\1.1.story.md. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify.
```

## Proposed Solution (PR)

Happy to open a PR to:

- Normalize EOL to `\n` (LF) in generated markdown and templates across platforms; add an `.editorconfig` entry to enforce.
- Apply Prettier to all generated `.md` with `proseWrap: "always"` (or `preserve`, your preference) to standardize spacing and remove trailing whitespace.
- Add `remark` + `remark-lint` with `remark-preset-lint-consistent` and `remark-preset-lint-recommended` to enforce CommonMark/GFM conventions.
- Update story templates to ensure:
  - Single H1 per file, consistent H2/H3 hierarchy (e.g., `## QA Results`, `### Review Summary`).
  - Consistent blank lines around headings/lists/blocks (one blank line before/after).
  - No smart quotes/ellipses; use straight quotes `"` and three dots `...` only when needed.
  - Fenced code blocks with language hints (`bash, `json, etc.).
  - No trailing spaces; no box‑drawing characters.

- Add a test that snapshots a generated story and asserts normalized EOL + lint‑clean output.

## References

- CommonMark: [https://commonmark.org/](https://commonmark.org/)
- GitHub Flavored Markdown: [https://github.github.com/gfm/](https://github.github.com/gfm/)
- Prettier: [https://prettier.io/](https://prettier.io/)
- remark/remark-lint: [https://github.com/remarkjs/remark-lint](https://github.com/remarkjs/remark-lint)

## Expected Behavior

- Generated story markdown is deterministic and GFM‑compliant.
- Automated edits that rely on exact matches (and CI markdown tooling) succeed across OSes.
- Rendering is consistent on GitHub and static site pipelines.

## Environment Details

**Please be Specific if relevant**

- Model(s) Used: _Gemini cli, cline with gemini api_
- Agentic IDE Used: _vscode CLI & web_
- WebSite Used: _Local project_
- Project Language: _TypeScript / Next.js 15_
- BMad Method version: _latest as of 2025‑08‑20 (please confirm exact version)_

## Screenshots or Links

- Screenshot: _attached below_

<img width="1629" height="178" alt="Image" src="https://github.com/user-attachments/assets/bbcbe74c-9b50-4b2b-83b3-8d8d81966f4e" />

- Terminal log: see snippet above

## Additional Context

- OS: Windows 11 (CRLF by default)

- Likely contributors to mismatch: CRLF vs LF, extra blank lines, or punctuation differences. Normalizing templates + adding lint/format steps should resolve and improve downstream tooling compatibility.

## Issue Metadata

- **Issue ID:** 3336116275
- **Issue Number:** 483
- **State:** open
- **Comments:** 0
- **Reactions:** 2 (+1s)
- **Labels:** None specified
