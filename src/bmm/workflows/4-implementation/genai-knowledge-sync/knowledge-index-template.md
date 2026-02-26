---
project_name: ''
user_name: ''
date: ''
total_chunks: 0
sources_indexed: 0
tag_vocabulary_size: 0
retrieval_tested: false
status: 'draft'
---

# Knowledge Index for {{project_name}}

_RAG-optimized knowledge base for AI agent retrieval. Each chunk is self-contained and tagged for semantic search._

---

## Index Summary

- **Total Chunks:** {{total_count}}
- **Critical:** {{critical_count}} | **High:** {{high_count}} | **Standard:** {{standard_count}} | **Reference:** {{ref_count}}
- **Sources Indexed:** {{source_count}}
- **Last Synced:** {{date}}

---

## Critical Knowledge

<!-- Critical-priority chunks go here. These are retrieved for every implementation task. -->

---

## Architecture Knowledge

<!-- Architecture decisions, system design patterns, and technology choices. -->

---

## Requirements Knowledge

<!-- Business rules, acceptance criteria, and constraints. -->

---

## Implementation Knowledge

<!-- Coding patterns, conventions, and implementation rules. -->

---

## Domain Knowledge

<!-- Business domain concepts, terminology, and definitions. -->

---

## Operations Knowledge

<!-- Deployment, monitoring, and workflow rules. -->

---

## Quality Knowledge

<!-- Testing patterns, review standards, and anti-patterns. -->

---

## Retrieval Configuration

### Query Mapping

| Query Pattern | Target Categories | Priority Filter | Expected Chunks |
|---|---|---|---|
| "how to implement \*" | implementation, architecture | critical, high | 3-5 |
| "testing requirements for \*" | quality, implementation | critical, high | 2-4 |
| "business rules for \*" | requirements, domain | all | 2-3 |
| "architecture decision for \*" | architecture | all | 1-3 |
| "deployment process for \*" | operations | all | 1-2 |

### Embedding Recommendations

- **Model:** Use an embedding model that handles technical content well
- **Chunk Overlap:** 50-100 characters overlap between adjacent chunks from the same source
- **Metadata Filters:** Always filter by category and priority for focused retrieval
- **Top-K:** Retrieve 3-5 chunks per query for optimal context balance
