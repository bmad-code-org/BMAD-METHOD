---
title: "Document Sharding Guide"
description: Split large markdown files into smaller organized files for better context management
sidebar:
  order: 8
---

Use the `shard-doc` tool if you need to split large markdown files into smaller, organized files for better context management.

:::caution[Deprecated]
This is no longer recommended, and soon with updated workflows and most major LLMs and tools supporting subprocesses this will be unnecessary.
:::

## When to Use This

Only use this if you notice your chosen tool / model combination is failing to load and read all the documents as input when needed.

## What is Document Sharding?

Document sharding splits large markdown files into smaller, organized files based on level 2 headings (`## Heading`).

### Architecture

```text
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
/bmad-shard-doc
```

### 2. Follow the Interactive Process

```text
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
