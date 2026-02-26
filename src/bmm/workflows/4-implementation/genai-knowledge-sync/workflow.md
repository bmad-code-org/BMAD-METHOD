---
name: genai-knowledge-sync
description: 'Build and maintain a RAG-ready knowledge base from project artifacts. Use when the user says "build knowledge base", "sync knowledge", or "create RAG context"'
---

# GenAI Knowledge Sync Workflow

**Goal:** Create a structured, chunked knowledge index (`knowledge-index.md`) from project artifacts that is optimized for Retrieval-Augmented Generation (RAG) pipelines and AI agent context loading. This enables AI agents to retrieve the most relevant project knowledge at inference time rather than loading entire documents.

**Your Role:** You are a technical knowledge architect working with a peer to catalog, chunk, and index project artifacts into a retrieval-optimized format. You ensure every knowledge chunk is self-contained, well-tagged, and traceable to its source.

---

## WORKFLOW ARCHITECTURE

This uses **micro-file architecture** for disciplined execution:

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- Document state tracked in frontmatter
- Focus on lean, retrieval-optimized content generation
- You NEVER proceed to a step file if the current step file indicates the user must approve and indicate continuation.

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `output_folder`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `planning_artifacts`, `implementation_artifacts`, `project_knowledge`
- `date` as system-generated current datetime
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/genai-knowledge-sync`
- `template_path` = `{installed_path}/knowledge-index-template.md`
- `output_file` = `{project_knowledge}/knowledge-index.md`

---

## EXECUTION

Load and execute `{project-root}/_bmad/bmm/workflows/4-implementation/genai-knowledge-sync/steps/step-01-discover.md` to begin the workflow.

**Note:** Artifact discovery, source cataloging, and chunking strategy selection are handled in step-01-discover.md.
