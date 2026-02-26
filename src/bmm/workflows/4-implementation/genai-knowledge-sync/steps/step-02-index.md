# Step 2: Knowledge Indexing & Chunking

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- ✅ ALWAYS treat this as collaborative indexing between technical peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on creating self-contained, retrievable knowledge chunks
- 🎯 EACH CHUNK must be independently useful without requiring full document context
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 📝 Focus on creating atomic, self-contained knowledge chunks
- ⚠️ Present A/P/C menu after each major category
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter with completed categories
- 🚫 FORBIDDEN to load next step until all categories are indexed

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices for each knowledge category:

- **A (Advanced Elicitation)**: Use discovery protocols to explore nuanced knowledge relationships
- **P (Party Mode)**: Bring multiple perspectives to identify missing knowledge connections
- **C (Continue)**: Save the current chunks and proceed to next category

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml
- When 'P' selected: Execute {project-root}/_bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Discovery catalog from step-1 is available
- All artifact paths and classifications are identified
- Focus on creating chunks optimized for embedding and retrieval
- Each chunk must carry enough context to be useful in isolation

## YOUR TASK:

Index each discovered artifact into self-contained knowledge chunks with metadata tags, source tracing, and retrieval-optimized formatting.

## CHUNKING PRINCIPLES:

### Chunk Design Rules

1. **Self-Contained**: Each chunk must be understandable without reading the source document
2. **Tagged**: Every chunk has category, priority, source path, and semantic tags
3. **Atomic**: One concept or decision per chunk - no compound knowledge
4. **Traceable**: Every chunk links back to its source artifact and section
5. **Contextual**: Include enough surrounding context for accurate retrieval
6. **Deduplicated**: Avoid redundant chunks across different source artifacts

### Chunk Format

Each chunk follows this standard format:

```markdown
### [CHUNK-ID] Chunk Title

- **Source:** `{relative_path_to_source_file}`
- **Category:** architecture | requirements | implementation | domain | operations | quality
- **Priority:** critical | high | standard | reference
- **Tags:** comma-separated semantic tags for retrieval matching

**Context:** One-line description of when this knowledge is relevant.

**Content:**
The actual knowledge content - specific, actionable, self-contained.
```

## INDEXING SEQUENCE:

### 1. Index Critical-Priority Artifacts

Process all artifacts marked as `critical` priority first:

**For each critical artifact:**

- Read the complete source file
- Identify distinct knowledge units (decisions, rules, constraints)
- Create one chunk per knowledge unit
- Apply semantic tags for retrieval matching
- Present chunks to user for validation

**Present results:**
"I've created {{chunk_count}} critical-priority chunks from {{source_count}} sources:

{{list_of_chunk_titles_with_tags}}

These chunks will be prioritized in every retrieval query.

[A] Advanced Elicitation - Explore deeper knowledge connections
[P] Party Mode - Review from multiple implementation perspectives
[C] Continue - Save these chunks and proceed"

### 2. Index High-Priority Artifacts

Process all `high` priority artifacts:

**For each high-priority artifact:**

- Read source file and identify knowledge units
- Create chunks with appropriate tags
- Cross-reference with critical chunks for consistency
- Identify any overlaps and deduplicate

### 3. Index Standard-Priority Artifacts

Process `standard` priority artifacts:

**For each standard artifact:**

- Read source file for domain-specific knowledge
- Create chunks focused on contextual information
- Tag for specific retrieval scenarios

### 4. Index Reference-Priority Artifacts

Process `reference` priority artifacts:

**For each reference artifact:**

- Extract background context and terminology
- Create lighter-weight chunks for supplementary retrieval
- Tag for broad topic matching

### 5. Cross-Reference and Deduplicate

After all categories are indexed:

**Deduplication Analysis:**

- Identify chunks with overlapping content across sources
- Merge or consolidate redundant chunks
- Ensure cross-references between related chunks are tagged
- Present deduplication summary to user

**Relationship Mapping:**

- Identify chunks that frequently co-occur in implementation contexts
- Tag related chunks for retrieval grouping
- Create chunk clusters for common query patterns

### 6. Generate Knowledge Index Document

Compile all validated chunks into the knowledge index file:

**Document Structure:**

```markdown
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

{{critical_chunks}}

## Architecture Knowledge

{{architecture_chunks}}

## Requirements Knowledge

{{requirements_chunks}}

## Implementation Knowledge

{{implementation_chunks}}

## Domain Knowledge

{{domain_chunks}}

## Operations Knowledge

{{operations_chunks}}

## Quality Knowledge

{{quality_chunks}}
```

### 7. Present Indexing Summary

"Knowledge indexing complete for {{project_name}}!

**Chunks Created:**

| Category | Critical | High | Standard | Reference | Total |
|---|---|---|---|---|---|
| Architecture | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |
| Requirements | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |
| Implementation | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |
| Domain | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |
| Operations | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |
| Quality | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |

**Deduplication:** Removed {{removed_count}} redundant chunks
**Cross-References:** {{xref_count}} chunk relationships mapped

[C] Continue to optimization"

## SUCCESS METRICS:

✅ All discovered artifacts indexed into self-contained chunks
✅ Each chunk has proper metadata tags and source tracing
✅ No redundant or overlapping chunks remain
✅ Cross-references between related chunks are mapped
✅ A/P/C menu presented and handled correctly for each category
✅ Knowledge index document properly structured

## FAILURE MODES:

❌ Creating chunks that require reading the full source document
❌ Missing semantic tags that prevent accurate retrieval
❌ Not deduplicating overlapping chunks from different sources
❌ Not cross-referencing related knowledge units
❌ Not getting user validation for each category
❌ Creating overly large chunks that reduce retrieval precision

## NEXT STEP:

After completing all categories and user selects [C], load `{project-root}/_bmad/bmm/workflows/4-implementation/genai-knowledge-sync/steps/step-03-optimize.md` to optimize the knowledge base for retrieval quality.

Remember: Do NOT proceed to step-03 until all categories are indexed and user explicitly selects [C]!
