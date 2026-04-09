# Semantic Splitting Strategy

When the source content is large (exceeds ~15,000 tokens) or a token_budget requires it, split the distillate into semantically coherent sections rather than arbitrary size breaks.

## Why Semantic Over Size-Based

Arbitrary splits (every N tokens) break coherence. A downstream workflow loading "part 2 of 4" gets context fragments. Semantic splits produce self-contained topic clusters that a workflow can load selectively — "give me just the technical decisions section" — which is more useful and more token-efficient for the consumer.

## Splitting Process

### 1. Identify Natural Boundaries

After the initial extraction and deduplication (Steps 1-2 of the compression process), look for natural semantic boundaries:

- Distinct problem domains or functional areas
- Different stakeholder perspectives (users, technical, business)
- Temporal boundaries (current state vs future vision)
- Scope boundaries (in-scope vs out-of-scope vs deferred)
- Phase boundaries (analysis, design, implementation)

Choose boundaries that produce sections a downstream workflow might load independently.

### 2. Assign Items to Sections

For each extracted item, assign it to the most relevant section. Items that span multiple sections go in the root distillate.

Cross-cutting items (items relevant to multiple sections):

- Constraints that affect all areas → root distillate
- Decisions with broad impact → root distillate
- Section-specific decisions → section distillate

### 3. Produce Root Distillate

The root distillate contains:

- **Orientation** (3-5 bullets): what was distilled, from what sources, for what consumer, how many sections
- **Cross-references**: list of section distillates with 1-line descriptions
- **Cross-cutting items**: facts, decisions, and constraints that span multiple sections
- **Scope summary**: high-level in/out/deferred if applicable

### 4. Produce Section Distillates

Each section distillate must be self-sufficient — a reader loading only one section should understand it without the others.

Each section includes:

- **Context header** (1 line): "This section covers [topic]. Part N of M from [source document names]."
- **Section content**: thematically-grouped bullets following the same compression rules as a single distillate
- **Cross-references** (if needed): pointers to other sections for related content

### 5. Output Structure

Create a folder `{base-name}-distillate/` containing:

```
{base-name}-distillate/
├── _index.md           # Root distillate: orientation, cross-cutting items, section manifest
├── 01-{topic-slug}.md  # Self-contained section
├── 02-{topic-slug}.md
└── 03-{topic-slug}.md
```

Example:

```
product-brief-distillate/
├── _index.md
├── 01-problem-solution.md
├── 02-technical-decisions.md
└── 03-users-market.md
```

## Size Targets

When a token_budget is specified:

- Root distillate: ~20% of budget (orientation + cross-cutting items)
- Remaining budget split proportionally across sections based on content density
- If a section exceeds its proportional share, compress more aggressively or sub-split

When no token_budget but splitting is needed:

- Aim for sections of 3,000-5,000 tokens each
- Root distillate as small as possible while remaining useful standalone
