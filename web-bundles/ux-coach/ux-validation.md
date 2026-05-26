# UX Validation Rubric

Walk the spine pair (DESIGN.md + EXPERIENCE.md) as the contract for downstream consumers: architects, story-writers, developers (human or AI). The question: can a consumer extract cleanly, with every reference resolving and every load-bearing decision committed?

Two passes. Pass 1 is mechanical coverage; Pass 2 is judgment. Severity tracks downstream impact, not fix difficulty.

## Pass 1: Mechanical coverage

Per category: extract, then list misses with location citations. No misses earns **strong**.

### 1. Flow coverage (EXPERIENCE.md)

Extract every user journey, requirement, or use case named in the user's sources (or surfaced in Discovery). Verify each has a **Key Flow** with a named protagonist, numbered steps, a climax beat, and a failure path where applicable. Missing flows are critical when they correspond to a stated requirement.

### 2. Token completeness (DESIGN.md)

Extract every token in the YAML frontmatter and every `{path.to.token}` reference in the body prose and EXPERIENCE.md. Verify each is defined per the spec types (Appendix A in SKILL.md).

- **Color tokens missing hex (or light/dark pairs where applicable) are critical.** Downstream code mirrors the spine.
- Platform conventions (native dynamic type, 8pt grid) may stay semantic (`note:` field).
- Contrast targets stated for load-bearing color combinations.

### 3. Component coverage (both spines)

Extract every component name referenced anywhere (EXPERIENCE.md flows, EXPERIENCE.md Component Patterns, DESIGN.md frontmatter `components`, DESIGN.md.Components body). Verify each has:

- A row in **DESIGN.md.Components** with real visual spec (anatomy, color usage, sizing, state appearance). Not a one-word description.
- A row in **EXPERIENCE.md.Component Patterns** with real behavioral spec.

Name drift across files is a high finding.

### 4. State coverage (EXPERIENCE.md)

Walk every surface in the information architecture. For each, list the states it should have (empty, cold-load, focus, error, offline, permission-denied; whichever apply to the form factor and stakes). Verify each is covered in **State Patterns** or in the surface's Key Flow.

### 5. Visual reference coverage

List every visual artifact captured in Canvas or referenced (Stitch outputs, Mermaid diagrams, HTML tables, imports). The spines link to each inline at the relevant section and name what it illustrates. State spines-win-on-conflict once. List orphans (artifacts no spine references) and unspecific references ("see mockup" with no anchor).

## Pass 2: Judgment

Verdict per category (*strong / adequate / thin / broken*); findings only where they add information.

### 6. Bloat and overspecification

- Pixel specs where tokens cover it.
- Source restatement (personas, requirements, scope copy-pasted from upstream).
- Prose where a table or Mermaid would land harder.
- Sections no downstream consumer would read.
- Decorative narrative untied to a decision.
- DESIGN.md prose may carry editorial voice; EXPERIENCE.md prose should not.

### 7. Inheritance discipline

- UI system references resolve (shadcn version named, MUI version named, etc).
- User journey / requirement names appear verbatim from sources.
- Glossary identical across spines and sources.
- Component names identical across all sections in both files.
- EXPERIENCE.md `{path.to.token}` references resolve to actual DESIGN.md tokens by name.

### 8. Shape fit

- DESIGN.md sections in canonical order (Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts). Omittable but order-locked when present.
- EXPERIENCE.md required defaults present (Foundation, Information Architecture, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Key Flows). Dropped defaults defensible.
- Required-when-applicable present where triggered (Inspiration when sources or Decisions show reference products or rejects; Responsive when multi-surface or breakpoints).
- Invented sections earn their place.

## Report shape

Render findings inline in Canvas under a **Validation Report** heading. Group by severity, not by category.

```markdown
## Validation Report

**Overall verdict:** [2-3 sentences. What's strong, what's load-bearing-broken.]

**Category verdicts:**
- Flow coverage: [verdict]
- Token completeness: [verdict]
- Component coverage: [verdict]
- State coverage: [verdict]
- Visual reference coverage: [verdict]
- Bloat & overspecification: [verdict]
- Inheritance discipline: [verdict]
- Shape fit: [verdict]

### Critical (n)
- **[Category]**: [finding] (location). *Fix:* [suggestion].

### High (n)
...

### Medium (n)
...

### Low (n)
...
```

After presenting, offer to roll critical and high findings into an Update pass that revises the spines in Canvas.
