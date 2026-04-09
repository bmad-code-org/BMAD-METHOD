---
name: bmad-distillator
description: Lossless LLM-optimized compression of source documents. Use when the user requests to 'distill documents' or 'create a distillate'.
argument-hint: '[provide input paths] [--validate to run round-trip validation after generation]'
---

# Distillator: A Document Distillation Engine

## Overview

This skill produces hyper-compressed, token-efficient documents (distillates) from any set of source documents. A distillate preserves every fact, decision, constraint, and relationship from the sources while stripping all overhead that humans need and LLMs don't. Act as an information extraction and compression specialist. The output is a single dense document (or semantically-split set) that a downstream LLM workflow can consume as sole context input without information loss.

This is a compression task, not a summarization task. Summaries are lossy. Distillates are optimized for lossless or near-lossless downstream LLM consumption: Stage 3 provides a structured coverage check, and `--validate` adds the stronger round-trip proof pass.

## On Activation

1. **Validate inputs.** The caller must provide:
   - **source_documents** (required) — One or more file paths, folder paths, or glob patterns to distill
   - **downstream_consumer** (optional) — What workflow/agent consumes this distillate (e.g., "PRD creation", "architecture design"). When provided, use it to judge signal vs noise. When omitted, preserve everything.
   - **token_budget** (optional) — Approximate target size. When provided and the distillate would exceed it, trigger semantic splitting.
   - **output_path** (optional) — Where to save. When omitted, save adjacent to the primary source document using `-distillate.md` for single-file output or `-distillate/` for split output.
   - **--validate** (flag) — Run round-trip reconstruction test after producing the distillate. If requested, confirm subagent support before Stage 1; if support is unavailable, ask whether to continue without validation or abort rather than silently downgrading.
   - **calibration_path** and **calibration_status** (optional) — Only used when `downstream_consumer` indicates calibration. If provided, include them in output frontmatter.

2. **Preflight runtime.** The bundled `scripts/analyze_sources.py` next to this skill requires Python 3.10+. It scans `.md`, `.txt`, `.yaml`, `.yml`, and `.json`, and skips `node_modules`, `.git`, `__pycache__`, `.venv`, `venv`, `.claude`, `_bmad-output`, `.cursor`, and `.vscode` directories when walking folders.

3. **Route** — proceed to Stage 1.

   **Session trace distillation:** When `downstream_consumer` indicates session traces, protocol outputs, or calibration, load `resources/session-trace-template.md` for section-preservation rules and compression guidance specific to structured session output.

   **Ambiguous output naming:** If the input expands to multiple unrelated primary documents and `output_path` is omitted, ask for `output_path` rather than guessing the base name.

## Stages

| #   | Stage               | Purpose                                                  |
| --- | ------------------- | -------------------------------------------------------- |
| 1   | Analyze             | Run analysis script, determine routing and splitting     |
| 2   | Compress            | Spawn compressor agent(s) to produce the distillate      |
| 3   | Verify & Output     | Completeness check, format check, save output            |
| 4   | Round-Trip Validate | (--validate only) Reconstruct and diff against originals |

### Stage 1: Analyze

Run the bundled analyzer from this skill's `scripts/` directory (`./scripts/analyze_sources.py`; in the source repo, `src/core-skills/bmad-distillator/scripts/analyze_sources.py`) with `--help`, then run it with the source paths. Use its routing recommendation and grouping output to drive Stage 2. Do NOT read the source documents yourself unless script execution is unavailable.

If the script cannot run, apply the same extension and skip-directory rules manually, require an explicit `output_path` when the base name is ambiguous, and proceed with a direct read of the resolved source files.

### Stage 2: Compress

**Single mode** (routing = `"single"`, ≤3 files, ≤15K estimated tokens):

Spawn one subagent using `agents/distillate-compressor.md` with all source file paths, `downstream_consumer`, and the Stage 1 splitting decision.

**Fan-out mode** (routing = `"fan-out"`):

1. Spawn one compressor subagent per group from the analysis output. Each compressor receives only its group's source file paths, `downstream_consumer`, and the Stage 1 splitting decision. Capture each compressor's returned `coverage_manifest`.

2. Materialize each intermediate distillate as a temporary distillate file.

3. Build `expected_coverage_manifest` as the union of the group `coverage_manifest` values. After all compressors return, spawn one final **merge compressor** subagent using `agents/distillate-compressor.md`. Pass it the temporary intermediate distillate file paths as its input, not the original source documents, along with `downstream_consumer`, the final splitting decision, and the union `expected_coverage_manifest`. Its job is cross-group deduplication, thematic regrouping, and final compression while preserving the original-source coverage surface.

4. Clean up the temporary intermediate distillate files after the merge pass completes.

**Graceful degradation:** If subagent spawning is unavailable, read the source documents and perform the compression work directly using the same instructions from `agents/distillate-compressor.md`. For fan-out, process groups sequentially, write temporary intermediate distillate files, preserve each group's `coverage_manifest`, then merge from those files using the union `expected_coverage_manifest`.

The compressor returns a structured JSON result containing the distillate content, a coverage manifest, and token estimate.

### Stage 3: Verify & Output

After the compressor (or merge compressor) returns:

1. **Completeness check.** Determine the expected coverage surface before validating output. In single mode, use the compressor's returned `coverage_manifest`. In fan-out mode, use the union `expected_coverage_manifest` carried forward from the group compressors and require the merge compressor's returned `coverage_manifest` to preserve that same surface. Verify that headings, named entities, numeric facts, decisions, constraints, scope boundaries, open questions, and any intentionally dropped items are preserved or deliberately omitted with reason. For session-trace or calibration mode, also verify that the required sections appear in order and the final State Ledger is preserved verbatim. If gaps are found, send them back to the compressor for a targeted fix pass while preserving the same expected coverage surface. Limit to 2 fix passes maximum.

2. **Format check.** Verify the output follows distillate format rules:
   - Default mode: no prose paragraphs (only bullets)
   - No decorative formatting
   - No repeated information
   - Each bullet is self-contained
   - Themes are clearly delineated with `##` headings
   - Session-trace and calibration mode may use the structured tables and ordered sections required by `resources/session-trace-template.md`

3. **Determine output format.** Using the split prediction from Stage 1 and actual distillate size:

   **Single distillate** (≤~5,000 tokens or token_budget not exceeded):

   Save as a single file with frontmatter:

   ```yaml
   ---
   type: bmad-distillate
   sources:
     - '{relative path to source file 1}'
     - '{relative path to source file 2}'
   downstream_consumer: "{consumer or 'general'}"
   created: '{date}'
   token_estimate: { approximate token count }
   parts: 1
   ---
   ```

   **Split distillate** (>~5,000 tokens, or token_budget requires it):

   Create a folder `{base-name}-distillate/` containing:

   ```
   {base-name}-distillate/
   ├── _index.md           # Orientation, cross-cutting items, section manifest
   ├── 01-{topic-slug}.md  # Self-contained section
   ├── 02-{topic-slug}.md
   └── 03-{topic-slug}.md
   ```

   The `_index.md` contains:
    - Frontmatter with the same core schema as a single-file distillate:

    ```yaml
    ---
    type: bmad-distillate
    sources:
       - '{relative path to source file 1}'
       - '{relative path to source file 2}'
    downstream_consumer: "{consumer or 'general'}"
    created: '{date}'
    token_estimate: { approximate token count across all parts }
    parts: { part count }
    ---
    ```

    - Include `calibration_path` and `calibration_status` here when calibration metadata applies
   - 3-5 bullet orientation (what was distilled, from what)
   - Section manifest: each section's filename + 1-line description
   - Cross-cutting items that span multiple sections

   Each section file is self-contained — loadable independently. Start each with a first bullet context line: `- Context: This section covers [topic]. Part N of M.`

   Source paths in frontmatter must be relative to the distillate's location.

   When `downstream_consumer` indicates calibration and `calibration_path` plus `calibration_status` are provided, include them in the frontmatter for the single distillate or `_index.md`.

4. **Measure distillate.** Run the same bundled analyzer on the final distillate file(s) to get accurate token counts for the output. Use the `total_estimated_tokens` from this analysis as `distillate_total_tokens`.

5. **Report results.** Always return structured JSON output:

   ```json
   {
     "status": "complete",
     "distillate": "{path or folder path}",
     "section_distillates": ["{path1}", "{path2}"] or null,
     "source_total_tokens": N,
     "distillate_total_tokens": N,
     "compression_ratio": "X:1",
     "source_documents": ["{path1}", "{path2}"],
       "completeness_check": "pass" or "pass_with_additions",
       "validation_status": "not_requested" | "pass" | "pass_with_warnings" | "fail" | "skipped_no_subagent_support",
       "validation_report": "{path}" or null,
       "validation_note": null or "{reason validation was skipped or warned}"
   }
   ```

    Where `source_total_tokens` is from the Stage 1 analysis and `distillate_total_tokens` is from step 4. The `compression_ratio` is `source_total_tokens / distillate_total_tokens` formatted as "X:1" (e.g., "3.2:1"). Set `validation_status = "not_requested"` when `--validate` was not used. If Stage 4 runs, update the same payload with the final validation fields before returning it.

6. If `--validate` flag was set, proceed to Stage 4. Otherwise, done.

### Stage 4: Round-Trip Validation (--validate only)

This stage proves the distillate is lossless by reconstructing source documents from the distillate alone. Use for critical documents where information loss is unacceptable, or as a quality gate for high-stakes downstream workflows. Not for routine use — it adds significant token cost.

1. **Spawn the reconstructor agent** using `agents/round-trip-reconstructor.md`. Pass it ONLY the distillate entrypoint path — the single distillate file for unsplit output, or `_index.md` for split output. It must NOT have access to the original source documents.

   **Graceful degradation:** If subagent support disappears after the preflight check, return the standard JSON result with `validation_status: "skipped_no_subagent_support"`, `validation_report: null`, and `validation_note` explaining that round-trip validation could not run in this environment.

2. **Receive reconstructions.** The reconstructor returns reconstruction file paths saved adjacent to the distillate.

3. **Perform semantic diff.** Read both the original source documents and the reconstructions. For each section of the original, assess:
   - Is the core information present in the reconstruction?
   - Are specific details preserved (numbers, names, decisions)?
   - Are relationships and rationale intact?
   - Did the reconstruction add anything not in the original? (indicates hallucination filling gaps)

4. **Produce validation report** using an exact path contract:

   - Single distillate file: save `{distillate-basename}-validation-report.md` adjacent to the distillate file
   - Split distillate folder: save `_validation-report.md` inside the distillate folder adjacent to `_index.md`

   ```markdown
   ---
   type: distillate-validation
   distillate: '{distillate path}'
   sources: ['{source paths}']
   created: '{date}'
   ---

   ## Validation Summary

   - Status: PASS | PASS_WITH_WARNINGS | FAIL
   - Information preserved: {percentage estimate}
   - Gaps found: {count}
   - Hallucinations detected: {count}

   ## Gaps (information in originals but missing from reconstruction)

   - {gap description} — Source: {which original}, Section: {where}

   ## Hallucinations (information in reconstruction not traceable to originals)

   - {hallucination description} — appears to fill gap in: {section}

   ## Possible Gap Markers (flagged by reconstructor)

   - {marker description}
   ```

5. **If gaps are found**, offer to run a targeted fix pass on the distillate — adding the missing information without full recompression. Limit to 2 fix passes maximum.

6. **Clean up** — delete the temporary reconstruction files after the report is generated.

7. **Return final result** — update the Stage 3 structured JSON payload with `validation_status`, `validation_report`, and `validation_note` before returning it.
