# Step 1: Pipeline Workflow Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between pipeline architecture peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on initialization and setup only - don't look ahead to future steps
- 🚪 DETECT existing workflow state and handle continuation properly
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 💾 Initialize document and update frontmatter
- 📖 Set up frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until setup is complete

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from other steps
- Input document discovery happens in this step

## YOUR TASK:

Initialize the Pipeline workflow by detecting continuation state, discovering input documents, scanning existing CI/CD configurations, extracting infrastructure context, and setting up the document for collaborative pipeline decision making.

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for existing `{planning_artifacts}/*pipeline*.md`
- If exists, read the complete file(s) including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

- Read the document to determine last completed step
- Report what has been completed so far
- Resume from the next uncompleted step
- Do not repeat already-completed steps

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Discover and load context documents using smart discovery. Documents can be in the following locations:
- {planning_artifacts}/**
- {output_folder}/**
- {project_knowledge}/**
- {project-root}/docs/**

Also - when searching - documents can be a single markdown file, or a folder with an index and multiple files. For Example, if searching for `*foo*.md` and not found, also search for a folder called *foo*/index.md (which indicates sharded content)

Try to discover the following:
- Architecture Document (`*architecture*.md`) - **REQUIRED** - infrastructure section especially
- Product Requirements Document (`*prd*.md`)
- Infrastructure Document (`*infrastructure*.md`) - if exists
- Project Context (`**/project-context.md`)

<critical>Confirm what you have found with the user, along with asking if the user wants to provide anything else. Only after this confirmation will you proceed to follow the loading rules</critical>

**Loading Rules:**

- Load ALL discovered files completely that the user confirmed or provided (no offset/limit)
- If there is a project context, whatever is relevant should try to be biased in the remainder of this whole workflow process
- For sharded folders, load ALL files to get complete picture, using the index first to potentially know the potential of each document
- index.md is a guide to what's relevant whenever available
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Validate Required Inputs

Before proceeding, verify we have the essential inputs:

**Architecture Document Validation:**

- If no architecture document found: "Pipeline design requires an architecture document to work from (especially infrastructure decisions). Please run the architecture workflow first or provide the architecture file path."
- Do NOT proceed without architecture document

#### C. Scan for Existing CI/CD Configuration

Scan the project root for existing CI/CD configuration files:

- `.github/workflows/` - GitHub Actions workflow files
- `.gitlab-ci.yml` - GitLab CI configuration
- `Jenkinsfile` - Jenkins pipeline definition
- `.circleci/` - CircleCI configuration
- `azure-pipelines.yml` - Azure DevOps Pipelines
- `bitbucket-pipelines.yml` - Bitbucket Pipelines
- `buildkite/` - Buildkite pipeline configuration
- `.drone.yml` - Drone CI configuration

Report any existing CI/CD configurations found.

#### D. Extract Infrastructure Context

From the architecture document and infrastructure document (if exists), extract:

- **IaC Tool**: What infrastructure-as-code tool is being used (Terraform, Pulumi, CDK, CloudFormation, etc.)
- **Container Strategy**: Whether containers are used (Docker, Podman, etc.) and orchestration (Kubernetes, ECS, etc.)
- **Environment Topology**: What environments exist (dev, staging, prod, etc.) and their relationships

These become context for pipeline decisions in subsequent steps.

#### E. Create Initial Document

Copy the template from `../pipeline-template.md` to `{planning_artifacts}/pipeline.md`

#### F. Complete Initialization and Report

Complete setup and report to user:

**Document Setup:**

- Created: `{planning_artifacts}/pipeline.md` from template
- Initialized frontmatter with workflow state

**Report to User:**
"Welcome {{user_name}}! I've set up your Pipeline Architecture workspace for {{project_name}}.

**Documents Found:**

- Architecture: {architecture document status}
- PRD: {PRD status or "None found"}
- Infrastructure: {infrastructure document status or "None found"}
- Project context: {project_context_rules count of rules for AI agents found}

**Existing CI/CD Configuration:**
{list of existing CI/CD files found or "No existing CI/CD configuration detected"}

**Infrastructure Context Extracted:**
- IaC Tool: {tool or "Not specified"}
- Container Strategy: {strategy or "Not specified"}
- Environment Topology: {environments or "Not specified"}

**Files loaded:** {list of specific file names}

Ready to begin pipeline architecture design. Do you have any other documents or context you'd like me to include?

[C] Continue to pipeline architecture decisions"

## SUCCESS METRICS:

✅ Existing workflow detected and continuation handled correctly
✅ Fresh workflow initialized with template and frontmatter
✅ Input documents discovered and loaded using sharded-first logic
✅ All discovered files tracked in frontmatter `inputDocuments`
✅ Architecture document requirement validated and communicated
✅ Existing CI/CD configuration scanned and reported
✅ Infrastructure context extracted (IaC tool, container strategy, env topology)
✅ User confirmed document setup and can proceed

## FAILURE MODES:

❌ Proceeding with fresh initialization when existing workflow exists
❌ Not updating frontmatter with discovered input documents
❌ Creating document without proper template
❌ Not checking sharded folders first before whole files
❌ Not reporting what documents were found to user
❌ Proceeding without validating architecture document requirement
❌ Not scanning for existing CI/CD configuration
❌ Not extracting infrastructure context from architecture document

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects [C] to continue, only after ensuring all the template output has been created, then load `./step-02-pipeline-architecture.md` to begin pipeline architecture decisions.

Remember: Do NOT proceed to step-02 until user explicitly selects [C] from the menu and setup is confirmed!
