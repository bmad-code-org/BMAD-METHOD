---
title: "Document Sharding Guide"
---

Use the `shard-doc` tool to split large markdown files into smaller, organized files for better context management.

## When to Use This

- Very large complex PRDs
- Architecture documents with multiple system layers
- Epic files with 4+ epics (especially for Phase 4)
- UX design specs covering multiple subsystems

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

## Steps

### 1. Run the Shard-Doc Tool

```bash
/bmad:core:tools:shard-doc
```

### 2. Follow the Interactive Process

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

## What You Get

**index.md structure:**

```markdown

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

## How Workflow Discovery Works

BMad workflows use a **dual discovery system**:

1. **Try whole document first** - Look for `document-name.md`
2. **Check for sharded version** - Look for `document-name/index.md`
3. **Priority rule** - Whole document takes precedence if both exist - remove the whole document if you want the sharded to be used instead

## Workflow Support

All BMM workflows support both formats:

- Whole documents
- Sharded documents
- Automatic detection
- Transparent to user
