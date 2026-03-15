---
name: bmad-distillator
description: Lossless LLM-optimized compression of source documents. Use when the user requests to 'distill documents' or 'create a distillate'.
argument-hint: "[to create provide input paths] [--validate distillate-path to confirm distillate is lossless and optimized]"
---

# Distillator: A Document Distillation Engine

## Overview

This skill produces hyper-compressed, token-efficient documents (distillates) from any set of source documents. A distillate preserves every fact, decision, constraint, and relationship from the sources while stripping all overhead that humans need and LLMs don't. Act as an information extraction and compression specialist. The output is a single dense document (or semantically-split set) that a downstream LLM workflow can consume as sole context input without information loss.

This is a compression task, not a summarization task. Summaries are lossy. Distillates are lossless compression optimized for LLM consumption.

## On Activation

1. **Validate inputs.** The caller must provide:
   - **source_documents** (required) — One or more file paths, folder paths, or glob patterns to distill
   - **downstream_consumer** (optional) — What workflow/agent consumes this distillate (e.g., "PRD creation", "architecture design"). When provided, use it to judge signal vs noise. When omitted, preserve everything.
   - **token_budget** (optional) — Approximate target size. When provided and the distillate would exceed it, trigger semantic splitting.
   - **output_path** (optional) — Where to save. When omitted, save adjacent to the primary source document with `-distillate.md` suffix.
   - **--validate** (flag) — Run round-trip reconstruction test after producing the distillate.

2. **Route** — proceed to Stage 1.

## Stages

| # | Stage | Purpose |
|---|-------|---------|
| 1 | Analyze | Run analysis script, determine routing and splitting |
| 2 | Compress | Spawn compressor agent(s) to produce the distillate |
| 3 | Verify & Output | Completeness check, format check, save output |
| 4 | Round-Trip Validate | (--validate only) Reconstruct and diff against originals |

### Stage 1: Analyze

Run `scripts/analyze_sources.py --help` then run it with the source paths. Use its routing recommendation and grouping output to drive Stage 2. Do NOT read the source documents yourself.

### Stage 2: Compress

**Single mode** (routing = `"single"`, ≤3 files, ≤15K estimated tokens):

Spawn one subagent using `agents/distillate-compressor.md` with all source file paths.

**Fan-out mode** (routing = `"fan-out"`):

1. Spawn one compressor subagent per group from the analysis output. Each compressor receives only its group's file paths and produces an intermediate distillate.

2. After all compressors return, spawn one final **merge compressor** subagent using `agents/distillate-compressor.md`. Pass it the intermediate distillate contents as its input (not the original files). Its job is cross-group deduplication, thematic regrouping, and final compression.

3. Clean up intermediate distillate content (it exists only in memory, not saved to disk).

**Graceful degradation:** If subagent spawning is unavailable, read the source documents and perform the compression work directly using the same instructions from `agents/distillate-compressor.md`. For fan-out, process groups sequentially then merge.

The compressor returns a structured JSON result containing the distillate content, source headings, named entities, and token estimate.

### Stage 3: Verify & Output

After the compressor (or merge compressor) returns:

1. **Completeness check.** Using the headings and named entities list returned by the compressor, verify each appears in the distillate content. If gaps are found, send them back to the compressor for a targeted fix pass — not a full recompression. Limit to 2 fix passes maximum.

2. **Format check.** Verify the output follows distillate format rules:
   - No prose paragraphs (only bullets)
   - No decorative formatting
   - No repeated information
   - Each bullet is self-contained
   - Themes are clearly delineated with `##` headings

3. **Determine output format.** Using the split prediction from Stage 1 and actual distillate size:

   **Single distillate** (≤~5,000 tokens or token_budget not exceeded):

   Save as a single file with frontmatter:

   ```yaml
   ---
   type: bmad-distillate
   sources:
     - "{relative path to source file 1}"
     - "{relative path to source file 2}"
   downstream_consumer: "{consumer or 'general'}"
   created: "{date}"
   token_estimate: {approximate token count}
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
   - Frontmatter with sources (relative paths from the distillate folder to the originals)
   - 3-5 bullet orientation (what was distilled, from what)
   - Section manifest: each section's filename + 1-line description
   - Cross-cutting items that span multiple sections

   Each section file is self-contained — loadable independently. Include a 1-line context header: "This section covers [topic]. Part N of M."

   Source paths in frontmatter must be relative to the distillate's location.

4. **Measure distillate.** Run `scripts/analyze_sources.py` on the final distillate file(s) to get accurate token counts for the output. Use the `total_estimated_tokens` from this analysis as `distillate_total_tokens`.

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
     "completeness_check": "pass" or "pass_with_additions"
   }
   ```

   Where `source_total_tokens` is from the Stage 1 analysis and `distillate_total_tokens` is from step 4. The `compression_ratio` is `source_total_tokens / distillate_total_tokens` formatted as "X:1" (e.g., "3.2:1").

6. If `--validate` flag was set, proceed to Stage 4. Otherwise, done.

### Stage 4: Round-Trip Validation (--validate only)

This stage proves the distillate is lossless by reconstructing source documents from the distillate alone. Use for critical documents where information loss is unacceptable, or as a quality gate for high-stakes downstream workflows. Not for routine use — it adds significant token cost.

1. **Spawn the reconstructor agent** using `agents/round-trip-reconstructor.md`. Pass it ONLY the distillate file path (or `_index.md` path for split distillates) — it must NOT have access to the original source documents.

   For split distillates, spawn one reconstructor per section in parallel. Each receives its section file plus the `_index.md` for cross-cutting context.

   **Graceful degradation:** If subagent spawning is unavailable, this stage cannot be performed by the main agent (it has already seen the originals). Report that round-trip validation requires subagent support and skip.

2. **Receive reconstructions.** The reconstructor returns reconstruction file paths saved adjacent to the distillate.

3. **Perform semantic diff.** Read both the original source documents and the reconstructions. For each section of the original, assess:
   - Is the core information present in the reconstruction?
   - Are specific details preserved (numbers, names, decisions)?
   - Are relationships and rationale intact?
   - Did the reconstruction add anything not in the original? (indicates hallucination filling gaps)

4. **Produce validation report** saved adjacent to the distillate as `-validation-report.md`:

   ```markdown
   ---
   type: distillate-validation
   distillate: "{distillate path}"
   sources: ["{source paths}"]
   created: "{date}"
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