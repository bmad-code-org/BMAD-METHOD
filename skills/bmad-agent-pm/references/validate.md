# Validate

The outcome of VALIDATE is a judgment of an existing PRD the user opens as a report, `validation-report.html` and its markdown twin in `{doc_workspace}`, without a word of the PRD changing; it ends when the user has seen the report, and Finalize does not run. The reviewer gate below is also what Finalize step 3 runs: that pass stops once findings are resolved in the conversation and writes no report.

## Orient

`{doc_workspace}` is the PRD's folder; the PRD is its main file, `<folder name>.md`, with `addendum.md` beside it when present. Source-extract against `.memlog.md`, the original inputs, the PRD and the addendum through subagents; you assemble from the extracts.

## Reviewer gate

Assemble the menu: the rubric walker against `{workflow.validation_checklist_template}`, each entry of `{workflow.finalize_reviewers}`, and any ad-hoc reviewer the artifact warrants. Calibrate to the stakes: hobby or solo work may run quietly or skip; higher stakes get the explicit all, subset or skip choice.

Dispatch the selected reviewers as parallel subagents against the PRD and `addendum.md`, each entry read by its prefix (`skill:`, `file:`, plain text). Each writes its full review to `{doc_workspace}/review-{lens}.md` and returns only a compact summary: verdict, top two to five findings, path. You never hold full review text; without subagents, run them one at a time, write the file before anything else, then drop the review from working context.

The rubric walker's prompt:

> You are validating a PRD against the quality rubric at `{workflow.validation_checklist_template}`. Read the full rubric first, then read the PRD, the main file `{doc_workspace}/<folder name>.md` (and `addendum.md` if present). Form a judgment per dimension, strong / adequate / thin / broken, and write findings only where they add information. Cite specific PRD locations and quote phrases. Severity ranks impact on the PRD's usefulness, not how easy the fix is. Write your review to `{doc_workspace}/review-rubric.md` in the format the rubric specifies. Return ONLY a compact summary (overall verdict, dimension verdicts, finding counts by severity, file path).

Surface findings tiered, never dumped: a one-sentence gate verdict, then the critical and high findings walked one by one, with medium and low rolled into one tail ("plus N more in {file}"). Open a `review-{lens}.md` only when the user drills into a finding. Per finding: autofix, discuss, defer to open items, or ignore.

## Synthesis

Under VALIDATE, once every selected reviewer has returned, fold their output into one report. This step produces the artifact the user opens, so it is never skipped.

Inputs: `{doc_workspace}/review-rubric.md`, structured by the rubric's seven dimensions; zero or more `{doc_workspace}/review-{lens}.md` from the other reviewers; `{workflow.validation_report_template}`, the HTML skeleton.

1. Read every `{doc_workspace}/review-*.md`.
2. Fill the skeleton:
   - **Header.** PRD name and path. Grade from the rubric verdicts and severity counts: *Excellent* = every dimension strong or adequate, no high or critical finding; *Good* = at most one thin dimension, no critical finding; *Fair* = several thin dimensions or any high finding; *Poor* = any broken dimension or any critical finding. Set the matching `grade-excellent | grade-good | grade-fair | grade-poor` class.
   - **Synthesis block.** The rubric's *Overall verdict* paragraph leads; when the other reviewers materially shift the picture, a second paragraph names what they surfaced.
   - **Dimension summary cards.** One per assessed dimension, colored verdict text. Skip a dimension the rubric marked n/a for this PRD.
   - **Dimension sections.** One `<section class="dimension">` per assessed dimension, in rubric order, `<details open>` for thin and broken, closed for strong and adequate, each holding the dimension judgment from `review-rubric.md` and its findings.
   - **Reviewer sections.** One `<section class="reviewer-section">` per other reviewer that ran, its source path in the `<span class="reviewer-source">`, closed by default. Adversarial findings keep their voice.
   - **Mechanical notes.** Bullets from the rubric's section of that name; omit the block when empty.
   - **Footer.** Rubric path, ISO timestamp.
3. Write it to `{doc_workspace}/validation-report.html`.
4. Write the markdown twin to `{doc_workspace}/validation-report.md`, the same content grouped by severity rather than dimension, in the format below; it is what downstream runs re-read.
5. Open the HTML with the platform opener, `open` on macOS, `xdg-open` on Linux, `start ""` on Windows, the path double-quoted. If that fails, give the path and move on rather than trying another opener. Headless runs skip this step.

Re-running validation overwrites both reports in place; the `review-*.md` files stay so the user can drill in.

### Markdown twin

```markdown
# Validation Report — {prd_name}

- **PRD:** `{prd_path}`
- **Rubric:** `{rubric_path}`
- **Run at:** {ISO timestamp}
- **Grade:** {Excellent | Good | Fair | Poor}

## Overall verdict
{synthesis paragraphs}

## Dimension verdicts
- Decision-readiness — {verdict}
- Substance over theater — {verdict}
- (each assessed dimension)

## Findings by severity

### Critical (n)
**[Dimension or Reviewer]** — Title (§ location)
{Note}
Fix: {suggested fix}

### High (n)
...

### Medium (n)
...

### Low (n)
...

## Mechanical notes
- {bullet}

## Reviewer files
- `review-rubric.md`
- `review-{lens}.md` (each that ran)
```

## Close

Give the artifact paths; the report is what persists. Offer to roll the findings into an Update.
