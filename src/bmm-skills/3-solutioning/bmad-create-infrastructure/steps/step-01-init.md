# Step 1: Infrastructure Workflow Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between infrastructure peers
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

Initialize the Infrastructure workflow by detecting continuation state, discovering input documents, scanning for existing infrastructure indicators, and setting up the document for collaborative infrastructure decision making.

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for existing {planning_artifacts}/`*infrastructure*.md`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

- Read the document to determine the last completed step
- Report what was previously completed
- Ask the user which step to resume from
- Load the appropriate step file

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Discover and load context documents using smart discovery. Documents can be in the following locations:
- {planning_artifacts}/**
- {project_knowledge}/**
- {project-root}/docs/**

Also - when searching - documents can be a single markdown file, or a folder with an index and multiple files. For example, if searching for `*foo*.md` and not found, also search for a folder called *foo*/index.md (which indicates sharded content)

Try to discover the following:
- Architecture Document (`*architecture*.md`)
- Product Requirements Document (`*prd*.md`)
- Project Context (`**/project-context.md`)

<critical>Confirm what you have found with the user, along with asking if the user wants to provide anything else. Only after this confirmation will you proceed to follow the loading rules</critical>

**Loading Rules:**

- Load ALL discovered files completely that the user confirmed or provided (no offset/limit)
- If there is a project context, whatever is relevant should try to be biased in the remainder of this whole workflow process
- For sharded folders, load ALL files to get complete picture, using the index first to potentially know the potential of each document
- index.md is a guide to what's relevant whenever available
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Scan for Existing Infrastructure Indicators

Scan the project for existing infrastructure-as-code artifacts:

**IaC Files:**
- `*.tf`, `*.tfvars` (Terraform)
- `Pulumi.*` (Pulumi)
- `cdk.json` (AWS CDK)
- `serverless.yml` (Serverless Framework)

**Container Files:**
- `Dockerfile`, `docker-compose*.yml`
- `k8s/` directory

**CI/CD Files:**
- `.github/workflows/` directory
- `.gitlab-ci.yml`
- `Jenkinsfile`

Report all indicators found. These inform later decisions in steps 2-4.

#### C. Extract Architecture Category 5 Context

If `architecture.md` was discovered:
- Look for **Category 5: Infrastructure & Deployment** decisions
- Extract any existing infrastructure-related decisions as starting context
- These become the foundation for more detailed infrastructure planning

#### D. Create Initial Document

Copy the template from `../infrastructure-template.md` to `{planning_artifacts}/infrastructure.md`

#### E. Complete Initialization and Report

Complete setup and report to user:

**Document Setup:**

- Created: `{planning_artifacts}/infrastructure.md` from template
- Initialized frontmatter with workflow state

**Report to User:**
"Welcome {{user_name}}! I've set up your Infrastructure workspace for {{project_name}}.

**Documents Found:**

- Architecture: {found or "None found"}
- PRD: {found or "None found"}
- Project Context: {found or "None found"}

**Existing Infrastructure Indicators:**

- IaC files: {list or "None found"}
- Container files: {list or "None found"}
- CI/CD files: {list or "None found"}

**Architecture Category 5 Context:**
{extracted decisions or "No prior infrastructure decisions found"}

**Files loaded:** {list of specific file names or "No additional documents found"}

Ready to begin infrastructure decision making. Do you have any other documents or context you'd like me to include?

[C] Continue to IaC Strategy decisions

## SUCCESS METRICS:

✅ Existing workflow detected and continuation handled correctly
✅ Fresh workflow initialized with template and frontmatter
✅ Input documents discovered and loaded using sharded-first logic
✅ All discovered files tracked in frontmatter `inputDocuments`
✅ Existing infrastructure indicators scanned and reported
✅ Architecture Category 5 decisions extracted as starting context
✅ User confirmed document setup and can proceed

## FAILURE MODES:

❌ Proceeding with fresh initialization when existing workflow exists
❌ Not updating frontmatter with discovered input documents
❌ Creating document without proper template
❌ Not scanning for existing infrastructure indicators
❌ Not extracting Architecture Category 5 context when available
❌ Not reporting what documents and indicators were found to user

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects [C] to continue, only after ensuring all the template output has been created, then load `./step-02-iac-strategy.md` to begin IaC strategy decisions.

Remember: Do NOT proceed to step-02 until user explicitly selects [C] from the menu and setup is confirmed!
