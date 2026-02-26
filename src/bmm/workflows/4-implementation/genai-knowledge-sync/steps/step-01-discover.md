# Step 1: Artifact Discovery & Catalog

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- ✅ ALWAYS treat this as collaborative discovery between technical peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on discovering and cataloging all relevant project artifacts
- 🎯 IDENTIFY sources that provide high-value knowledge for RAG retrieval
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 📖 Read existing project files to catalog available artifacts
- 💾 Initialize document and update frontmatter
- 🚫 FORBIDDEN to load next step until discovery is complete

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- Focus on existing project artifacts and documentation
- Identify documents that contain reusable knowledge for AI agents
- Prioritize artifacts that prevent implementation mistakes and provide domain context

## YOUR TASK:

Discover, catalog, and classify all project artifacts that should be indexed for RAG retrieval by AI agents.

## DISCOVERY SEQUENCE:

### 1. Check for Existing Knowledge Index

First, check if a knowledge index already exists:

- Look for file at `{project_knowledge}/knowledge-index.md` or `{project-root}/**/knowledge-index.md`
- If exists: Read complete file to understand existing index
- Present to user: "Found existing knowledge index with {{chunk_count}} chunks across {{source_count}} sources. Would you like to update this or create a new one?"

### 2. Scan Planning Artifacts

Search `{planning_artifacts}` for documents containing project knowledge:

**Product Requirements:**

- Look for PRD files (`*prd*`, `*requirements*`)
- Extract key decisions, constraints, and acceptance criteria
- Note sections with high reuse value for agents

**Architecture Documents:**

- Look for architecture files (`*architecture*`, `*design*`)
- Extract technology decisions, patterns, and trade-offs
- Identify integration points and system boundaries

**Epic and Story Files:**

- Look for epic/story definitions (`*epic*`, `*stories*`)
- Extract acceptance criteria, implementation notes, and dependencies
- Identify cross-cutting concerns that appear across stories

### 3. Scan Implementation Artifacts

Search `{implementation_artifacts}` for implementation knowledge:

**Sprint and Status Files:**

- Look for sprint status, retrospectives, and course corrections
- Extract lessons learned and pattern changes
- Identify recurring issues and their resolutions

**Code Review Findings:**

- Look for code review artifacts
- Extract quality patterns and anti-patterns discovered
- Note corrections that should inform future implementation

### 4. Scan Project Knowledge

Search `{project_knowledge}` for existing knowledge assets:

**Project Context:**

- Look for `project-context.md` and similar files
- Extract implementation rules and coding conventions
- These are high-priority sources for RAG retrieval

**Research Documents:**

- Look for research outputs (market, domain, technical)
- Extract findings that inform implementation decisions
- Identify domain terminology and definitions

### 5. Scan Source Code for Patterns

Identify key code patterns worth indexing:

**Configuration Files:**

- Package manifests, build configs, linting rules
- Extract version constraints and tool configurations
- These provide critical context for code generation

**Key Source Files:**

- Identify entry points, shared utilities, and core modules
- Extract patterns that define the project's coding style
- Note any non-obvious conventions visible only in code

### 6. Classify and Prioritize Sources

For each discovered artifact, assign:

**Knowledge Category:**

- `architecture` - System design decisions and patterns
- `requirements` - Business rules and acceptance criteria
- `implementation` - Coding patterns and conventions
- `domain` - Business domain concepts and terminology
- `operations` - Deployment, monitoring, and workflow rules
- `quality` - Testing patterns, review standards, and anti-patterns

**Retrieval Priority:**

- `critical` - Must be retrieved for every implementation task
- `high` - Should be retrieved for related implementation tasks
- `standard` - Available when specifically relevant
- `reference` - Background context when explicitly needed

### 7. Present Discovery Summary

Report findings to user:

"Welcome {{user_name}}! I've scanned your project {{project_name}} to catalog artifacts for your RAG knowledge base.

**Artifacts Discovered:**

| Category | Count | Priority Breakdown |
|---|---|---|
| Architecture | {{count}} | {{critical}}/{{high}}/{{standard}} |
| Requirements | {{count}} | {{critical}}/{{high}}/{{standard}} |
| Implementation | {{count}} | {{critical}}/{{high}}/{{standard}} |
| Domain | {{count}} | {{critical}}/{{high}}/{{standard}} |
| Operations | {{count}} | {{critical}}/{{high}}/{{standard}} |
| Quality | {{count}} | {{critical}}/{{high}}/{{standard}} |

**Source Files Cataloged:** {{total_files}}

**Recommended Chunking Strategy:**
Based on your artifact types, I recommend {{strategy}} chunking:
- {{strategy_rationale}}

Ready to index and chunk your project knowledge for RAG retrieval.

[C] Continue to knowledge indexing"

## SUCCESS METRICS:

✅ All relevant project artifacts discovered and cataloged
✅ Each artifact classified by category and retrieval priority
✅ Source file paths accurately recorded
✅ Chunking strategy recommended based on artifact analysis
✅ Discovery findings clearly presented to user
✅ User ready to proceed with indexing

## FAILURE MODES:

❌ Missing critical artifacts in planning or implementation directories
❌ Not checking for existing knowledge index before creating new one
❌ Incorrect classification of artifact categories or priorities
❌ Not scanning source code for pattern-level knowledge
❌ Not presenting clear discovery summary to user

## NEXT STEP:

After user selects [C] to continue, load `{project-root}/_bmad/bmm/workflows/4-implementation/genai-knowledge-sync/steps/step-02-index.md` to index and chunk the discovered artifacts.

Remember: Do NOT proceed to step-02 until user explicitly selects [C] from the menu and discovery catalog is confirmed!
