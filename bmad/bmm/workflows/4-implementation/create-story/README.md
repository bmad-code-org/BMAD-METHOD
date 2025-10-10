---
last-redoc-date: 2025-10-01
---

# Create Story Workflow

The create-story workflow is the entry point for v6's just-in-time story generation approach, run exclusively by the Scrum Master (SM) agent. Unlike batch processing methodologies, this workflow generates exactly ONE story at a time based on the current epic backlog state, ensuring stories are created only when needed and with the most current context. The SM analyzes the epic's progress, identifies what needs to be built next based on epics.md enumeration, and generates a complete story specification including acceptance criteria, technical approach, and implementation guidance pulled directly from tech specs, PRD, and architecture documentation.

This workflow represents a fundamental shift from traditional upfront planning to adaptive story generation. By creating stories one at a time and enforcing strict verification against epics.md, the SM ensures that only planned and approved stories are created. The workflow operates in non-interactive "#yolo" mode by default, minimizing prompts while maintaining quality through rigorous source document grounding. It will HALT if epics.md doesn't explicitly enumerate the next story, forcing proper planning through the correct-course workflow rather than allowing ad-hoc story creation.

The workflow's intelligent document discovery system automatically finds the relevant tech spec for the current epic (using pattern `tech-spec-epic-{epic_num}-*.md`), loads all architecture documents from both docs/ and output folders, and synthesizes requirements from multiple sources in priority order. After story creation, it can optionally trigger the story-context workflow to generate just-in-time technical expertise for the developer.

## Usage

```bash
# SM initiates story creation for the next piece of work
bmad sm *create-story
```

The SM runs this workflow when:

- The current sprint has capacity for new work
- The previous story status is "Done" or "Approved"
- The team is ready for the next planned story in the epic
- Story preparation is needed before development

## Inputs

**Required Context Files:**

- **epics.md**: MANDATORY - Must explicitly enumerate the next story or workflow halts
- **tech-spec-epic-{N}-\*.md**: Epic-specific technical specification (auto-discovered)
- **PRD.md**: Product requirements document (fallback for requirements)
- **Architecture Documents**: Automatically discovered from docs/ and output folders:
  - tech-stack.md, unified-project-structure.md, coding-standards.md
  - testing-strategy.md, backend-architecture.md, frontend-architecture.md
  - data-models.md, database-schema.md, rest-api-spec.md, external-apis.md

**Workflow Variables:**

- `story_dir`: From config `dev_story_location` - where stories are saved
- `epic_num`: Current epic number (auto-detected from existing stories)
- `story_num`: Next story number (incremented from last completed story)
- `auto_run_context`: Default true - runs story-context workflow after creation
- `non_interactive`: Default true - operates in "#yolo" mode with minimal prompts

## Outputs

**Primary Deliverable:**

- **Story Document** (`{story_dir}/story-{epic_num}.{story_num}.md`): Complete story specification including:
  - User story statement (role, action, benefit)
  - Acceptance criteria extracted from tech spec or epics.md
  - Tasks and subtasks mapped to ACs
  - Testing requirements per testing strategy
  - Dev notes with source citations
  - Status: "Draft" (requires approval before development)

**Validation Safeguards:**

- **Epic Enumeration Check**: If epics.md doesn't list the next story, workflow HALTS with:
  ```
  "No planned next story found in epics.md for epic {epic_num}.
  Please load either PM or SM agent and run *correct-course to add/modify epic stories."
  ```
- **Status Check**: Won't create new story if current story isn't Done/Approved
- **Document Grounding**: All requirements traced to source documents (no invention)

## Key Features

**Strict Planning Enforcement**: The workflow will NOT create stories that aren't explicitly planned in epics.md. This prevents scope creep and ensures all work is properly approved through the planning process.

**Intelligent Document Discovery**: Automatically finds the latest tech spec for the epic using glob patterns, discovers all architecture documents across multiple directories, and builds a prioritized document set for requirement extraction.

**Source Document Grounding**: Every requirement, acceptance criterion, and technical constraint is traced to a specific source document. The workflow explicitly forbids inventing domain facts not present in source materials.

**Non-Interactive by Default**: Operates in "#yolo" mode to minimize interruptions, only prompting when absolutely necessary (like missing critical configuration). This enables smooth automated story preparation.

**Automatic Context Generation**: When `auto_run_context` is true (default), automatically triggers the story-context workflow to generate developer expertise injection for the newly created story.

## Integration with v6 Flow

The create-story workflow is step 1 in the v6 implementation cycle:

1. **SM: create-story** ← You are here
2. SM: story-context (adds JIT technical expertise)
3. DEV: dev-story (implements with generated context)
4. DEV/SR: review-story (validates completion)
5. If needed: correct-course (adjusts direction)
6. After epic: retrospective (captures learnings)

This workflow establishes the "what" that needs to be built, strictly based on planned epics. The story-context workflow will later add the "how" through just-in-time technical expertise injection.

## Document Priority Order

The workflow uses this priority for extracting requirements:

1. **tech_spec_file**: Epic-scoped technical specification (highest priority)
2. **epics_file**: Acceptance criteria and story breakdown
3. **prd_file**: Business requirements and constraints
4. **Architecture docs**: Constraints, patterns, and technical guidance

## Workflow Behavior

**Story Number Management:**

- Automatically detects next story number from existing files
- Won't skip numbers or create duplicates
- Maintains epic.story numbering convention

**Update vs Create:**

- If latest story status != Done/Approved: Updates existing story
- If latest story status == Done/Approved: Creates next story (if enumerated in epics.md)

**Epic Advancement:**

- In non-interactive mode: Stays within current epic
- Interactive mode: Can prompt for new epic number

## Troubleshooting

**"No planned next story found in epics.md"**: The next story isn't enumerated in epics.md. Run SM or PM agent's `*correct-course` to properly plan and add the story to the epic.

**Missing story_dir Configuration**: Ensure `dev_story_location` is set in bmad/bmm/config.yaml

**Tech Spec Not Found**: The workflow looks for `tech-spec-epic-{N}-*.md` pattern. Ensure tech specs follow this naming convention.

**Architecture Documents Missing**: While not fatal, missing architecture docs reduce story context quality. Ensure key docs exist in docs/ or output folder.
