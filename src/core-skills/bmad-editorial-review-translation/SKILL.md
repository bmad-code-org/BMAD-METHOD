---
name: bmad-editorial-review-translation
description: 'Review translated documentation for content fidelity — detect injected, off-topic, or unauthorized content by comparing against the English source. Use when reviewing translation PRs or translated docs.'
---

# Editorial Review - Translation Fidelity

**Goal:** Detect content in translated documents that has no basis in the English source — injected messaging, off-topic additions, unauthorized links, or any material that doesn't belong in a faithful translation.

**Your Role:** You are a translation fidelity auditor. You do NOT judge translation quality, fluency, or stylistic choices. You have one job: verify that the translated content faithfully represents the source material and contains nothing that was smuggled in. You are suspicious by default. A good translation may rephrase, reorder within a section, or add brief clarifying context for cultural adaptation — but it should never introduce new topics, opinions, links, or messaging absent from the source.

**Inputs:**
- **content** (required) — Translated file(s) to review, or a PR diff containing translation changes
- **source_root** (optional) — Path to the English source docs directory (e.g., `docs/`). If not provided, infer from the translated file path by stripping the language prefix directory.


## PRINCIPLES

1. **Structure is your anchor.** You don't need to read the target language fluently. Heading structure, list counts, link targets, image references, and code blocks must correspond between source and translation. Structural divergence is the primary signal.
2. **Back-translate to verify.** When you find content with no obvious structural counterpart in the source, translate it back to English. Compare the back-translation against the source section. Content that has no semantic relationship to the source is a finding.
3. **Cultural adaptation is allowed.** Brief translator notes, culturally appropriate examples replacing Western-centric ones, or minor clarifications are acceptable — flag them as INFO, not as violations. The line is: adaptation serves the reader's understanding of the original content; injection serves a different agenda.
4. **Links are high-signal.** Any URL in the translation that does not appear in the English source is automatically suspicious. It may be legitimate (e.g., linking to a localized resource), but it must be flagged for review.
5. **Absence matters too.** Sections present in the source but missing from the translation should be noted — omission can be as deliberate as insertion.


## STEPS

### Step 1: Identify Files and Pair with Sources

- If input is a PR diff, extract the list of translated files changed
- For each translated file, locate its English source counterpart:
  - Strip the language directory prefix (e.g., `docs/zh-cn/tutorials/foo.md` -> `docs/tutorials/foo.md`)
  - If source_root is provided, use it; otherwise infer
- If a source file cannot be found, flag the translated file as **ORPHAN** — a translation with no source is itself a finding
- If input is not a diff but direct file(s), still locate the English source for each

### Step 2: Structural Comparison

For each translated file paired with its source:

1. **Heading inventory**: Extract all headings (h1-h6) from both files. Flag:
   - Headings in the translation with no counterpart in the source
   - Headings in the source missing from the translation
   - Significant heading text changes beyond translation (e.g., source says "Installation" but translation heading back-translates to "Installation and Our Philosophy")

2. **Section count and ordering**: Compare the number of sections and their relative order. Note any reordering or inserted sections.

3. **Link inventory**: Extract all URLs from both files. Flag:
   - URLs present in translation but absent from source
   - URLs present in source but absent from translation
   - URLs that have been changed (not just localized — e.g., `.com` to `.cn` equivalent is fine; `.com` to a completely different domain is suspicious)

4. **Asset references**: Compare image paths, code block counts, and embedded resource references.

5. **Frontmatter/metadata**: Compare YAML frontmatter fields. Flag any fields in the translation not present in the source.

### Step 3: Content Fidelity Analysis

For each section in the translated file:

1. **Length ratio check**: Compare word/character count of each section against its source counterpart. A translation section that is dramatically longer (>2x) than the source section warrants closer inspection. Note: some languages are naturally more verbose, so this is a signal, not proof.

2. **Back-translate suspicious sections**: For any section flagged by structural comparison or length ratio, translate it back to English. Compare the back-translation against the corresponding source section. Identify content present in the back-translation that has no basis in the source.

3. **Scan for injection patterns**:
   - Political statements or opinions
   - Promotional content, product mentions, or advertisements
   - Personal messages, jokes, or commentary unrelated to the documentation topic
   - Calls to action not present in the source
   - Ideological or religious messaging
   - Disparagement of the project, its maintainers, or other groups
   - Hidden content (HTML comments with messaging, zero-width characters, invisible Unicode)
   - SEO spam or keyword stuffing

4. **Translator notes**: If the translation includes translator notes or annotations, verify they are clearly marked as such and contain only translation-related commentary.

### Step 4: Classify Findings

Classify each finding into one of these categories:

- **INJECTION** — Content with no basis in the source that appears intentional and off-topic. This is the primary concern. Examples: political messaging, promotional content, personal commentary, links to unrelated sites.
- **DRIFT** — Content that started from the source but has diverged significantly in meaning. May be accidental (mistranslation) or intentional (subtle reframing). Warrants human review.
- **ORPHAN** — Translated file with no English source counterpart, or section with no source counterpart.
- **OMISSION** — Source content missing from the translation. Could be incomplete work or deliberate removal.
- **LINK** — URL discrepancy between source and translation.
- **INFO** — Cultural adaptation, translator notes, or minor variance that appears legitimate but is noted for completeness.

### Step 5: Output Results

Output findings grouped by severity, then by file.

```markdown
## Translation Fidelity Review

**Files reviewed:** [N] translated files against [N] English sources
**Language:** [detected language]

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
```

If zero INJECTION and zero DRIFT findings: state "Translation appears faithful to source material."

If INJECTION findings exist: state clearly at the top: "**ACTION REQUIRED: Potential content injection detected. Human review of flagged sections is strongly recommended before merge.**"


## HALT CONDITIONS

- HALT if no translated files can be identified in the input
- HALT if no English source files can be located for any of the translated files
- HALT if content is empty
