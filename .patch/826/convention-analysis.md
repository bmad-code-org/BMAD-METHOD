# Documentation Convention Analysis for PR #826

Date: 2025-10-28

---

## Current BMAD Documentation Structure

### Root-Level Documentation (Highly Restricted)

```
bmad-v6/
├── README.md              ← Project entry point, installation, quick start
├── CHANGELOG.md           ← Version history
├── CONTRIBUTING.md        ← Contribution guidelines
├── v6-open-items.md       ← Internal development tracking (temp)
└── LICENSE                ← License file
```

**Pattern**: Root `.md` files are limited to essential project metadata only.

### Documentation Organization (`docs/`)

```
docs/
├── bmad-brownfield-guide.md          ← Guides (root of docs/)
├── v4-to-v6-upgrade.md               ← Guides (root of docs/)
├── conversion-report-*.md            ← Internal reports (root of docs/)
├── ide-info/                         ← Category: IDE-specific guides
│   ├── auggie.md
│   ├── claude-code.md
│   ├── cursor.md
│   ├── windsurf.md
│   └── ... (13 IDE guides)
└── installers-bundlers/              ← Category: Technical internals
    ├── ide-injections.md
    ├── installers-modules-platforms-reference.md
    └── web-bundler-usage.md
```

**Pattern**:

- Guides go directly in `docs/` root if broadly applicable
- Categorized subdirectories for specific topics (`ide-info/`, `installers-bundlers/`)
- Kebab-case filenames

### Missing Categories (Gaps)

Based on analysis, these logical categories don't yet exist:

- `docs/planning/` - Would fit planning guides
- `docs/guides/` - Could house methodology guides
- `docs/references/` - Could house reference materials

---

## Filename Convention Analysis

### Pattern Observed

**Root documentation** (3 files):

- `README.md` (standard)
- `CHANGELOG.md` (standard)
- `CONTRIBUTING.md` (standard)
- `v6-open-items.md` (internal, kebab-case)

**Docs directory** (all kebab-case):

- `bmad-brownfield-guide.md`
- `v4-to-v6-upgrade.md`
- `conversion-report-shard-doc-2025-10-26.md`
- `ide-injections.md`
- `installers-modules-platforms-reference.md`
- `web-bundler-usage.md`

**IDE info** (all kebab-case):

- `claude-code.md`
- `github-copilot.md`
- `auggie.md`, etc.

**Verdict**: 100% consistent **kebab-case** for all documentation files.

### PR #826 Filename

- **Proposed**: `high-level-product-plan.md`
- **Evaluation**: ✅ Follows kebab-case convention
- **Issue**: Name is vague; doesn't indicate it's a checklist/guide

**Better alternatives**:

- `product-planning-checklist.md`
- `product-planning-considerations.md`
- `planning-reference.md`

---

## Content Pattern Analysis

### Existing Documentation Characteristics

**BMAD Guides** (e.g., `bmad-brownfield-guide.md`):

- Explain BMAD methodology application
- Reference BMAD levels, phases, workflows
- Show CLI commands (`bmad pm`, agent triggers)
- Link to specific workflows and agents
- Practical, BMAD-integrated advice

**Technical References** (e.g., `installers-modules-platforms-reference.md`):

- Deep technical implementation details
- Architecture diagrams
- Code examples from BMAD codebase
- Installation and configuration specifics

**Upgrade Guides** (e.g., `v4-to-v6-upgrade.md`):

- Migration instructions
- Before/after comparisons
- BMAD workflow mapping
- Specific commands and file locations

### PR #826 Content Characteristics

- Generic software planning checklist
- No BMAD methodology references
- No agent/workflow integration
- No CLI commands
- Could apply to any software project
- Reads like external reference material

**Mismatch**: Content doesn't follow BMAD documentation pattern of methodology integration.

---

## Overlap Analysis

### Existing BMAD Planning Documentation

**In `src/modules/bmm/workflows/`**:

- `2-plan-workflows/` - Contains PRD, tech-spec, architecture workflows
- `2-plan-workflows/README.md` - Explains BMAD planning phases
- Individual workflow docs explain specific planning activities

**In `docs/`**:

- `bmad-brownfield-guide.md` - Covers planning considerations for existing projects
- `v4-to-v6-upgrade.md` - Mentions planning phase (PRD/Architecture)

**PR #826 Coverage**:
Sections 1-8 overlap significantly with existing BMAD concepts:

1. Product Architecture → BMAD `architect` agent, architecture workflow
2. Technology Stack → Part of tech-spec workflow
3. Infrastructure & Deployment → Part of architecture planning
4. Data & Security → Part of tech-spec and architecture
5. User Experience → Covered in UX workflows
6. Scalability & Performance → Architecture considerations
7. Business & Operations → Part of project brief/PRD
8. Development Process → BMM workflow methodology

**Verdict**: ⚠️ High overlap with existing BMAD workflow coverage, but presented generically without BMAD integration.

---

## Recommendations

### Option 1: Relocate to `docs/planning/` (Recommended)

**Path**: `docs/planning/product-planning-checklist.md`

**Rationale**:

- Creates logical category for planning guides
- Consistent with docs categorization pattern
- Clear, specific filename
- Allows for future planning guides

**Required changes**:

1. Create `docs/planning/` directory
2. Move file with better name
3. Add BMAD integration section
4. Link to relevant workflows

### Option 2: Integrate into Existing Guide

**Path**: Merge into `docs/bmad-brownfield-guide.md` as appendix

**Rationale**:

- Brownfield guide already covers planning considerations
- Avoids duplication
- Contextualizes within BMAD methodology

**Required changes**:

1. Add as "Appendix: Comprehensive Planning Checklist"
2. Reference BMAD agents/workflows for each section
3. Maintain single planning guide

### Option 3: Enhance and Place at `docs/product-planning-with-bmad.md`

**Path**: `docs/product-planning-with-bmad.md`

**Rationale**:

- Top-level guide visibility
- Rewrite to be BMAD-first
- Transform generic checklist into BMAD methodology guide

**Required changes**:

1. Extensive rewrite with BMAD integration
2. Add agent/workflow references throughout
3. Include CLI examples
4. Link to specific workflow docs

---

## Conclusion

**Convention Compliance**:

- ✅ Filename: Kebab-case (matches pattern)
- ❌ Placement: Root violation (should be in `docs/`)
- ❌ Content: Generic (should integrate BMAD)
- ⚠️ Organization: Missing logical category (suggest creating `docs/planning/`)

**Recommended Action**: Request relocation to `docs/planning/product-planning-checklist.md` with optional BMAD enhancement suggestions.
