# Document Sharding Guide

Comprehensive guide to BMad Method's document sharding system for managing large planning and architecture documents.

## Table of Contents

- [What is Document Sharding?](#what-is-document-sharding)
- [When to Use Sharding](#when-to-use-sharding)
- [How Sharding Works](#how-sharding-works)
- [Using the Shard-Doc Tool](#using-the-shard-doc-tool)
- [Workflow Support](#workflow-support)
- [Best Practices](#best-practices)
- [Examples](#examples)

## What is Document Sharding?

Document sharding splits large markdown files into smaller, organized files based on level 2 headings (`## Heading`). This enables:

- **Selective Loading** - Workflows load only the sections they need
- **Reduced Token Usage** - Massive efficiency gains for large projects
- **Better Organization** - Logical section-based file structure
- **Maintained Context** - Index file preserves document structure

### Architecture

```
Before Sharding:
docs/
└── PRD.md (large 50k token file)

After Sharding:
docs/
└── prd/
    ├── index.md                    # Table of contents with descriptions
    ├── overview.md                 # Section 1
    ├── user-requirements.md        # Section 2
    ├── technical-requirements.md   # Section 3
    └── ...                         # Additional sections
```

## When to Use Sharding

### Ideal Candidates

**Large Multi-Epic Projects:**

- Very large complex PRDs
- Architecture documents with multiple system layers
- Epic files with 4+ epics (especially for Phase 4)
- UX design specs covering multiple subsystems

**Token Thresholds:**

- **Consider sharding**: Documents > 20k tokens
- **Strongly recommended**: Documents > 40k tokens
- **Critical for efficiency**: Documents > 60k tokens

### When NOT to Shard

**Small Projects:**

- Single epic projects
- Level 0-1 projects (tech-spec only)
- Documents under 10k tokens
- Quick prototypes

**Frequently Updated Docs:**

- Active work-in-progress documents
- Documents updated daily
- Documents where whole-file context is essential

## How Sharding Works

### Sharding Process

1. **Tool Execution**: Run `npx @kayvan/markdown-tree-parser source.md destination/` - this is abstracted with the core shard-doc task which is installed as a slash command or manual task rule depending on your tools.
2. **Section Extraction**: Tool splits by level 2 headings
3. **File Creation**: Each section becomes a separate file
4. **Index Generation**: `index.md` created with structure and descriptions

### Workflow Discovery

BMad workflows use a **dual discovery system**:

1. **Try whole document first** - Look for `document-name.md`
2. **Check for sharded version** - Look for `document-name/index.md`
3. **Priority rule** - Whole document takes precedence if both exist

### Loading Strategies

**Full Load (Phase 1-3 workflows):**

```
If sharded:
  - Read index.md
  - Read ALL section files
  - Treat as single combined document
```

**Selective Load (Phase 4 workflows):**

```
If sharded epics and working on Epic 3:
  - Read epics/index.md
  - Load ONLY epics/epic-3.md
  - Skip all other epic files
  - 90%+ token savings!
```

## Using the Shard-Doc Tool

### CLI Command

```bash
# Activate bmad-master or analyst agent, then:
/shard-doc
```

### Interactive Process

```
Agent: Which document would you like to shard?
User: docs/PRD.md

Agent: Default destination: docs/prd/
       Accept default? [y/n]
User: y

Agent: Sharding PRD.md...
       ✓ Created 12 section files
       ✓ Generated index.md
       ✓ Complete!
```

### What Gets Created

**index.md structure:**

```markdown
# PRD - Index

## Sections

1. [Overview](./overview.md) - Project vision and objectives
2. [User Requirements](./user-requirements.md) - Feature specifications
3. [Epic 1: Authentication](./epic-1-authentication.md) - User auth system
4. [Epic 2: Dashboard](./epic-2-dashboard.md) - Main dashboard UI
   ...
```

**Individual section files:**

- Named from heading text (kebab-case)
- Contains complete section content
- Preserves all markdown formatting
- Can be read independently

## Workflow Support

### Universal Support

**All BMM workflows support both formats:**

- ✅ Whole documents
- ✅ Sharded documents
- ✅ Automatic detection
- ✅ Transparent to user

### Workflow-Specific Patterns

#### Phase 1-3 (Full Load)

Workflows load entire sharded documents:

- `product-brief` - Research, brainstorming docs
- `prd` - Product brief, research
- `gdd` - Game brief, research
- `create-ux-design` - PRD, brief, architecture (if available)
- `tech-spec` - Brief, research
- `architecture` - PRD, UX design (if available)
- `create-epics-and-stories` - PRD, architecture
- `implementation-readiness` - All planning docs

#### Phase 4 (Selective Load)

Workflows load only needed sections:

**sprint-planning** (Full Load):

- Needs ALL epics to build complete status

**create-story, code-review** (Selective):

```
Working on Epic 3, Story 2:
  ✓ Load epics/epic-3.md only
  ✗ Skip epics/epic-1.md, epic-2.md, epic-4.md, etc.

Result: 90%+ token reduction for 10-epic projects!
```

### Input File Patterns

Workflows use standardized patterns:

```yaml
input_file_patterns:
  prd:
    whole: '{output_folder}/*prd*.md'
    sharded: '{output_folder}/*prd*/index.md'

  epics:
    whole: '{output_folder}/*epic*.md'
    sharded_index: '{output_folder}/*epic*/index.md'
    sharded_single: '{output_folder}/*epic*/epic-{{epic_num}}.md'
```

## Best Practices

### Sharding Strategy

**Do:**

- ✅ Shard after planning phase complete
- ✅ Keep level 2 headings well-organized
- ✅ Use descriptive section names
- ✅ Shard before Phase 4 implementation
- ✅ Keep original file as backup initially

**Don't:**

- ❌ Shard work-in-progress documents
- ❌ Shard small documents (<20k tokens)
- ❌ Mix sharded and whole versions
- ❌ Manually edit index.md structure

### Naming Conventions

**Good Section Names:**

```markdown
## Epic 1: User Authentication

## Technical Requirements

## System Architecture

## UX Design Principles
```

**Poor Section Names:**

```markdown
## Section 1

## Part A

## Details

## More Info
```

### File Management

**When to Re-shard:**

- Significant structural changes to document
- Adding/removing major sections
- After major refactoring

**Updating Sharded Docs:**

1. Edit individual section files directly
2. OR edit original, delete sharded folder, re-shard
3. Don't manually edit index.md

## Examples

### Example 1: Large PRD

**Scenario:** 15-epic project, PRD is 45k tokens

**Before Sharding:**

```
Every workflow loads entire 45k token PRD
Architecture workflow: 45k tokens
UX design workflow: 45k tokens
```

**After Sharding:**

```bash
/shard-doc
Source: docs/PRD.md
Destination: docs/prd/

Created:
  prd/index.md
  prd/overview.md (3k tokens)
  prd/functional-requirements.md (8k tokens)
  prd/non-functional-requirements.md (6k tokens)
  prd/user-personas.md (4k tokens)
  ...additional FR/NFR sections
```

**Result:**

```
Architecture workflow: Can load specific sections needed
UX design workflow: Can load specific sections needed
Significant token reduction for large requirement docs!
```

### Example 2: Sharding Epics File

**Scenario:** 8 epics with detailed stories, 35k tokens total

```bash
/shard-doc
Source: docs/bmm-epics.md
Destination: docs/epics/

Created:
  epics/index.md
  epics/epic-1.md
  epics/epic-2.md
  ...
  epics/epic-8.md
```

**Efficiency Gain:**

```
Working on Epic 5 stories:
  Old: Load all 8 epics (35k tokens)
  New: Load epic-5.md only (4k tokens)
  Savings: 88% reduction
```

### Example 3: Architecture Document

**Scenario:** Multi-layer system architecture, 28k tokens

```bash
/shard-doc
Source: docs/architecture.md
Destination: docs/architecture/

Created:
  architecture/index.md
  architecture/system-overview.md
  architecture/frontend-architecture.md
  architecture/backend-services.md
  architecture/data-layer.md
  architecture/infrastructure.md
  architecture/security-architecture.md
```

**Benefit:** Code-review workflow can reference specific architectural layers without loading entire architecture doc.

## Custom Workflow Integration

### For Workflow Builders

When creating custom workflows that load large documents:

**1. Add input_file_patterns to workflow.yaml:**

```yaml
input_file_patterns:
  your_document:
    whole: '{output_folder}/*your-doc*.md'
    sharded: '{output_folder}/*your-doc*/index.md'
```

**2. Add discovery instructions to instructions.md:**

```markdown
## Document Discovery

1. Search for whole document: _your-doc_.md
2. Check for sharded version: _your-doc_/index.md
3. If sharded: Read index + ALL sections (or specific sections if selective load)
4. Priority: Whole document first
```

**3. Choose loading strategy:**

- **Full Load**: Read all sections when sharded
- **Selective Load**: Read only relevant sections (requires section identification logic)

### Pattern Templates

**Full Load Pattern:**

```xml
<action>Search for document: {output_folder}/*doc-name*.md</action>
<action>If not found, check for sharded: {output_folder}/*doc-name*/index.md</action>
<action if="sharded found">Read index.md to understand structure</action>
<action if="sharded found">Read ALL section files listed in index</action>
<action if="sharded found">Combine content as single document</action>
```

**Selective Load Pattern (with section ID):**

```xml
<action>Determine section needed (e.g., epic_num = 3)</action>
<action>Check for sharded version: {output_folder}/*doc-name*/index.md</action>
<action if="sharded found">Read ONLY the specific section file needed</action>
<action if="sharded found">Skip all other section files</action>
```

## Troubleshooting

### Common Issues

**Both whole and sharded exist:**

- Workflows will use whole document (priority rule)
- Delete or archive the one you don't want

**Index.md out of sync:**

- Delete sharded folder
- Re-run shard-doc on original

**Workflow can't find document:**

- Check file naming matches patterns (`*prd*.md`, `*epic*.md`, etc.)
- Verify index.md exists in sharded folder
- Check output_folder path in config

**Sections too granular:**

- Combine sections in original document
- Use fewer level 2 headings
- Re-shard

## Related Documentation

- [shard-doc Tool](../src/core/tools/shard-doc.xml) - Tool implementation
- [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Workflow overview
- [Workflow Creation Guide](../src/modules/bmb/workflows/create-workflow/workflow-creation-guide.md) - Custom workflow patterns

---

**Document sharding is optional but powerful** - use it when efficiency matters for large projects!
