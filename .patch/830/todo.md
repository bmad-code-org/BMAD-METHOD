# PR-830 TODO — CommonMark-compliant Markdown formatting rules

Branch: patch-830


## Legend
- [ ] not started
- [~] in progress
- [x] done

 
## Completed
- [x] Create working branch `patch-830`
- [x] Archive PR artifacts in `.patch/830/`
- [x] Create conformance checker (`tools/markdown/check-md-conformance.js`) and README
- [x] Baseline docs, bmad, src → logs saved under `.patch/830/test-logs/`
- [x] Fix sample violations in `docs/ide-info/*` and validate PASS
- [x] Compare with markdownlint; document in `.patch/830/markdownlint-comparison.md`
- [x] Add markdownlint config + custom table rule + README under `.patch/830/`
- [x] Integration plan in `.patch/830/integration-plan.md`

 
## In Progress / Next
- [ ] Fix fences in docs
  - Add language identifiers to fenced code blocks in:
  - `docs/bmad-brownfield-guide.md` (multiple)
  - `docs/conversion-report-shard-doc-2025-10-26.md` (e.g., L68)
- [ ] Re-run docs checks
  - Run checker and markdownlint across `docs/`; update logs in `.patch/830/test-logs/`
- [ ] Add npm MD scripts
  - `check:md:docs`, `check:md:all`, `lint:md` in `package.json`
- [ ] CI workflow for MD
  - GitHub Actions: run `check:md:all` (required) and `lint:md` (optional) on PRs
- [ ] Checker unit tests
  - Fixtures for lists/tables/fences, heading adjacency, trailing blank handling
- [ ] Improve table detection
  - Refine heuristic or leverage markdown-it to avoid pipe false positives
- [ ] Optional auto-fix mode
  - `--fix` to insert blank lines and default fence language safely (pilot subset)
- [ ] Apply PR-830 mandate
  - Insert mandate under `<if tag="template-output">` in `bmad/core/tasks/workflow.xml`; validate behavior
- [ ] Generator hygiene audit
  - Normalize bullets to `-`, ensure fence language, insert boundary blanks where needed (`tools/format-workflow-md.js` et al.)
- [ ] Authoring guidelines
  - Update `CONTRIBUTING.md` with concise rules (lists/tables/fences, bullet style, fence language)
- [ ] Package custom rule
  - Publish the table blank-line markdownlint rule for reuse
- [ ] Remediate bmad/src
  - Prioritize and fix top offenders from baselines; re-check and log
- [ ] Root markdownlint config (optional)
  - Move `.patch/830/.markdownlint.json` to repo root for editor integration

 
## Backlog / Research
- [ ] Review `.patch/483` for markdown formatting prior art
- [ ] Scan `.patch/*` for related efforts (821, 827, etc.)

 
## Acceptance Criteria
- [ ] Conformance checker reports 0 violations on targeted docs and representative outputs
- [ ] markdownlint (configured) reports no violations for PR-830 rules on edited areas
- [ ] No semantic content changes; only spacing/formatting improvements
- [ ] CI checks in place to prevent regressions
