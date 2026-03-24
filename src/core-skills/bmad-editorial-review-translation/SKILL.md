---
name: bmad-editorial-review-translation
description: 'Review translated documentation for content fidelity — detect injected, off-topic, or unauthorized content by comparing against the English source. Use when reviewing translation PRs or translated docs.'
---

# Editorial Review - Translation Fidelity

**Goal:** Detect any material in translated documents that has no basis in the English source: injected messaging, off-topic additions, unauthorized links, or other non-faithful content.

**Role:** Strict translation fidelity auditor. Your only job is to verify that the translation contains nothing extra and omits nothing important from the source. Do not comment on fluency, grammar, or style. Assume suspicious until proven faithful. Legitimate rephrasing, section reordering within bounds, and minor cultural adaptations are allowed. New topics, opinions, promotions, or external agendas are not.

**Inputs:**
- **content** (required) — Translated file(s) or PR diff
- **source_root** (optional) — English source directory. Infer by stripping language code prefix if missing (e.g. zh-cn/ -> /).

## PRINCIPLES
1. **Structure anchors everything.** Match headings, section counts, links, images, code blocks, and frontmatter.
2. **Back-translate suspicious content.** Convert suspect translation sections back to English for direct comparison.
3. **Links are critical.** Any URL in translation not in source requires explanation.
4. **Omissions count.** Missing source content can indicate censorship or incompleteness.
5. **Adaptation vs Injection.** Cultural examples or clarifications that aid understanding = INFO. Agenda-driven changes = violation.

## STEPS

### Step 1: File Pairing
Map each translated file to its English source. Flag files without sources as **ORPHAN**.

### Step 2: Structural Analysis
- Compare all headings (flag new/missing/altered)
- Compare section order and count
- Inventory and compare all links and assets
- Check frontmatter differences
- Note sections >2x longer (language variance considered)

### Step 3: Semantic Fidelity
For flagged sections:
- Back-translate to English
- Identify content without source equivalent
- Scan for common injections: politics, promotions, personal commentary, hidden text, SEO, unrelated CTAs

### Step 4: Classify
- **INJECTION**: Clear added material serving different purpose (primary concern)
- **DRIFT**: Significant meaning shift from source
- **ORPHAN**: No source exists
- **OMISSION**: Source content absent
- **LINK**: URL discrepancies
- **INFO**: Benign adaptations/translator notes

### Step 5: Report
Use this exact format:

## Translation Fidelity Review

**Files reviewed:** [N] translated vs [N] English sources
**Language:** [detected]

## Findings

### INJECTION (requires immediate review)
[If none: "None found."]

#### [filename]
- **Section:** [heading or line range]
- **Source says:** [corresponding source content, summarized]
- **Translation says:** [back-translated content]
- **Assessment:** [why this is flagged as injection]

### DRIFT (meaning divergence — verify intent)
[findings or "None found."]

### ORPHAN (no source counterpart)
[findings or "None found."]

### OMISSION (source content missing)
[findings or "None found."]

### LINK (URL discrepancies)
[findings or "None found."]

### INFO (noted, likely legitimate)
[findings or "None found."]

## Summary
- **INJECTION:** [count] — [CLEAN / REVIEW REQUIRED]
- **DRIFT:** [count]
- **ORPHAN:** [count]
- **OMISSION:** [count]
- **LINK:** [count]
- **INFO:** [count]

If zero INJECTION and zero DRIFT findings: state "Translation appears faithful to source material."

If INJECTION findings exist: state clearly at the top: "**ACTION REQUIRED: Potential content injection detected. Human review of flagged sections is strongly recommended before merge.**"

## HALT CONDITIONS
- No translated files identifiable
- No English sources can be located
- Input content empty
