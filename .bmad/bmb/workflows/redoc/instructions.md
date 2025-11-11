# ReDoc Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/src/modules/bmb/workflows/redoc/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the documentation process</critical>
<critical>This is an AUTONOMOUS workflow - minimize user interaction unless clarification is absolutely required</critical>
<critical>IMPORTANT: Process ONE document at a time to avoid token limits. Each README should be created individually, not batched.</critical>
<critical>When using Task tool with sub-agents: Only request ONE workflow or agent documentation per invocation to prevent token overflow.</critical>

<workflow>

<step n="1" goal="Load BMAD conventions and initialize">
<action>Load ALL BMAD convention documents from {bmad_conventions}:
- agent_architecture.md - Understand agent XML structure and patterns
- agent_command_patterns.md - Command syntax and activation patterns
- agent_types.md - Standard agent categories and purposes
- module_structure.md - Module organization and folder conventions
- workflow_guide.md - Workflow structure and best practices
</action>

<action>Internalize these conventions so you can:

- Recognize standard patterns vs unique implementations
- Describe only what's distinctive about each component
- Use proper terminology consistently
- Write with technical precision
  </action>

<action>Get target path from user:

- Ask: "What do you want to document? (module path, workflow path, agent path, or folder path)"
- Store as {{target_path}}
  </action>

<action>Validate target path exists and determine target type:

- Module root (contains config.yaml, /workflows, /agents folders)
- Workflows folder (contains multiple workflow folders)
- Agents folder (contains multiple agent .md files)
- Single workflow folder (contains workflow.yaml)
- Single agent file (.md)
  </action>

<action>Store target type as {{target_type}} for conditional processing</action>
</step>

<step n="2" goal="Analyze directory structure and existing documentation">
<action>Build complete tree structure of {{target_path}} using Glob and file system tools</action>

<action>Identify all documentation points:

- List all folders requiring README.md files
- Detect existing README.md files
- Parse frontmatter from existing READMEs to extract last-redoc-date
- Calculate documentation depth (how many levels deep)
  </action>

<action>Create documentation map with execution order (deepest → shallowest):

- Level 0 (deepest): Individual workflow folders, individual agent files
- Level 1: /workflows folder, /agents folder
- Level 2 (root): Module root README.md
  </action>

<action>Detect "massive folders" requiring child catalog documents:

- Threshold: >10 items or complex categorization needed
- Mark folders for catalog document creation (e.g., WORKFLOWS-CATALOG.md, AGENTS-CATALOG.md)
  </action>

<critical>Store execution order as {{doc_execution_plan}} - this ensures reverse-tree processing</critical>
</step>

<step n="3" goal="Process leaf-level documentation" repeat="for-each-leaf-item">
<critical>TOKEN LIMIT WARNING: Process ONE item at a time to prevent token overflow issues.</critical>
<critical>If using Task tool with sub-agents: NEVER batch multiple workflows/agents in a single invocation.</critical>
<critical>Each README creation should be a separate operation with its own file save.</critical>
<critical>Sequential processing is MANDATORY - do not attempt parallel documentation generation.</critical>
<action>For each individual workflow folder in execution plan (PROCESS ONE AT A TIME):
1. Read ALL files completely:
   - workflow.yaml (metadata, purpose, configuration)
   - instructions.md (step structure, goals)
   - template.md (output structure) if exists
   - checklist.md (validation criteria) if exists
   - Any supporting data files

2. Synthesize understanding:
   - Core purpose and use case
   - Input requirements
   - Output produced
   - Unique characteristics (vs standard BMAD workflow patterns)
   - Key steps or special features

3. Generate/update README.md:
   - Add frontmatter: `---\nlast-redoc-date: {{date}}\n---\n`
   - Write 2-4 paragraph technical description
   - Include "Usage" section with invocation command
   - Include "Inputs" section if applicable
   - Include "Outputs" section
   - Be succinct and precise - technical writer quality
   - Focus on DISTINCTIVE features, not boilerplate

4. Save README.md to workflow folder

<critical>If multiple workflows need documentation, process them SEQUENTIALLY not in parallel. Each workflow gets its own complete processing cycle.</critical>
</action>

<action>For each individual agent file in execution plan (PROCESS ONE AT A TIME):

1. Read agent definition file completely:
   - XML structure and metadata
   - Commands and their purposes
   - Activation patterns
   - Persona and communication style
   - Critical actions and workflows invoked

2. Synthesize understanding:
   - Agent purpose and role
   - Available commands
   - When to use this agent
   - Unique capabilities

3. Generate/update README.md (or agent-name-README.md if in shared folder):
   - Add frontmatter: `---\nlast-redoc-date: {{date}}\n---\n`
   - Write 1-3 paragraph technical description
   - Include "Commands" section listing available commands
   - Include "Usage" section
   - Focus on distinctive features

4. Save README.md
   </action>

<action if="clarification needed about purpose or unique features">Ask user briefly, then continue</action>
</step>

<step n="4" goal="Process mid-level folder documentation" if="target_type requires folder docs">
<action>For /workflows folder:
1. Read ALL workflow README.md files created in Step 3
2. Categorize workflows by purpose/type if folder is massive (>10 workflows):
   - Document generation workflows
   - Action workflows
   - Meta-workflows
   - Interactive workflows

3. If massive folder detected:
   - Create WORKFLOWS-CATALOG.md with categorized listings
   - Each entry: workflow name, 1-sentence description, link to folder
   - Add frontmatter with last-redoc-date

4. Generate/update /workflows/README.md:
   - Add frontmatter: `---\nlast-redoc-date: {{date}}\n---\n`
   - High-level summary of workflow collection
   - If catalog exists: reference it
   - If not massive: list all workflows with brief descriptions and links
   - Highlight notable or commonly-used workflows
   - Keep succinct (1-2 paragraphs + list)

5. Save README.md
   </action>

<action>For /agents folder:

1. Read ALL agent README.md files
2. Categorize agents by type if massive folder (>10 agents):
   - Task agents
   - Meta agents
   - Specialized agents
   - Utility agents

3. If massive folder detected:
   - Create AGENTS-CATALOG.md with categorized listings
   - Each entry: agent name, 1-sentence description, link
   - Add frontmatter with last-redoc-date

4. Generate/update /agents/README.md:
   - Add frontmatter: `---\nlast-redoc-date: {{date}}\n---\n`
   - High-level summary of agent collection
   - If catalog exists: reference it
   - If not massive: list all agents with brief descriptions
   - Highlight key agents and their purposes
   - Keep succinct

5. Save README.md
   </action>
   </step>

<step n="5" goal="Process root module documentation" if="target_type is module root">
<action>For module root README.md:
1. Read module config.yaml for metadata and configuration
2. Read /workflows/README.md and /agents/README.md created in Step 4
3. Identify module's unique purpose within BMAD ecosystem

4. Generate/update module README.md:
   - Add frontmatter: `---\nlast-redoc-date: {{date}}\n---\n`

   Structure:
   - # Module Name
   - **Purpose**: 2-3 sentence high-level module purpose
   - **Overview**: 1-2 paragraphs describing what this module provides

   - ## Workflows
     - Link to /workflows/README.md with 1-sentence summary
     - Mention count and highlight 2-3 key workflows

   - ## Agents
     - Link to /agents/README.md with 1-sentence summary
     - Mention count and highlight 2-3 key agents

   - ## Configuration
     - Notable config.yaml settings if unique/important
     - Reference paths and conventions

   - ## Usage
     - How to invoke workflows or agents from this module
     - Prerequisites if any

   Focus on UNIQUE aspects using BMAD convention knowledge:
   - Don't explain standard BMAD patterns
   - Highlight what makes THIS module distinctive
   - Use proper BMAD terminology

5. Save README.md to module root
   </action>
   </step>

<step n="6" goal="Validation and summary report">
<action>Verify all planned documentation was created/updated:
- Check each item in {{doc_execution_plan}}
- Confirm frontmatter dates are current
- Validate file paths and links
</action>

<action>Generate summary report showing:

- Target documented: {{target_path}}
- Target type: {{target_type}}
- Documentation files created/updated (count and list)
- Any catalog files created
- Files skipped or requiring manual review (if any)
- Coverage: X% of items documented
- Processing notes: Confirm sequential processing was used to avoid token limits
  </action>

<action>Display summary to user</action>
</step>

<step n="7" goal="Optional git diff analysis" optional="true">
<ask>Would you like to see what changed since the last redoc run? [y/n]</ask>

<action if="user_response == 'y'">
For each README with last-redoc-date frontmatter:
1. Extract last-redoc-date timestamp
2. Use git log to find files modified since that date in the documented folder
3. Highlight files that changed but may need documentation updates
4. Report findings to user
</action>
</step>

<step n="8" goal="Completion">
<action>Confirm to {user_name} in {communication_language} that autonomous workflow execution is complete</action>
<action>Provide path to all updated documentation</action>
<action>Suggest next steps if needed</action>
</step>

</workflow>
