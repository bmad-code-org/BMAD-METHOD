# Document Sharding Guide

Comprehensive guide to BMad Method's document sharding system for managing large planning and architecture documents.

## Table of Contents

- [Document Sharding Guide](#document-sharding-guide)
  - [Table of Contents](#table-of-contents)
  - [What is Document Sharding?](#what-is-document-sharding)
    - [Architecture](#architecture)
  - [When to Use Sharding](#when-to-use-sharding)
    - [Ideal Candidates](#ideal-candidates)
  - [How Sharding Works](#how-sharding-works)
    - [Sharding Process](#sharding-process)
    - [Workflow Discovery](#workflow-discovery)
  - [Using the Shard-Doc Tool](#using-the-shard-doc-tool)
    - [CLI Command](#cli-command)
    - [Interactive Process](#interactive-process)
    - [What Gets Created](#what-gets-created)
  - [Workflow Support](#workflow-support)
    - [Universal Support](#universal-support)

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
3. **Priority rule** - Whole document takes precedence if both exist - remove the whole document if you want the sharded to be used instead.

## Using the Shard-Doc Tool

### CLI Command

```bash
/bmad:core:tools:shard-doc 
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
