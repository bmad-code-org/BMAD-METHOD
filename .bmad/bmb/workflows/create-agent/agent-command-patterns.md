# BMAD Agent Command Patterns Reference

_LLM-Optimized Guide for Command Design_

## Important: How to Process Action References

When executing agent commands, understand these reference patterns:

```xml
<!-- Pattern 1: Inline action -->
<item cmd="*example" action="do this specific thing">Description</item>
→ Execute the text "do this specific thing" directly

<!-- Pattern 2: Internal reference with # prefix -->
<item cmd="*example" action="#prompt-id">Description</item>
→ Find <prompt id="prompt-id"> in the current agent and execute its content

<!-- Pattern 3: External file reference -->
<item cmd="*example" exec="{project-root}/path/to/file.md">Description</item>
→ Load and execute the external file
```

**The `#` prefix is your signal that this is an internal XML node reference, not a file path.**

## Command Anatomy

### Basic Structure

```xml
<menu>
  <item cmd="*trigger" [attributes]>Description</item>
</menu>
```

**Components:**

- `cmd` - The trigger word (always starts with \*)
- `attributes` - Action directives (optional):
  - `run-workflow` - Path to workflow YAML
  - `exec` - Path to task/operation
  - `tmpl` - Path to template (used with exec)
  - `action` - Embedded prompt/instruction
  - `data` - Path to supplementary data (universal)
- `Description` - What shows in menu

## Command Types

**Quick Reference:**

1. **Workflow Commands** - Execute multi-step workflows (`run-workflow`)
2. **Task Commands** - Execute single operations (`exec`)
3. **Template Commands** - Generate from templates (`exec` + `tmpl`)
4. **Meta Commands** - Agent control (no attributes)
5. **Action Commands** - Embedded prompts (`action`)
6. **Embedded Commands** - Logic in persona (no attributes)

**Universal Attributes:**

- `data` - Can be added to ANY command type for supplementary info
- `if` - Conditional execution (advanced pattern)
- `params` - Runtime parameters (advanced pattern)

### 1. Workflow Commands

Execute complete multi-step processes

```xml
<!-- Standard workflow -->
<item cmd="*create-prd"
     run-workflow="{project-root}/.bmad/bmm/workflows/prd/workflow.yaml">
  Create Product Requirements Document
</item>

<!-- Workflow with validation -->
<item cmd="*validate-prd"
     validate-workflow="{output_folder}/prd-draft.md"
     workflow="{project-root}/.bmad/bmm/workflows/prd/workflow.yaml">
  Validate PRD Against Checklist
</item>

<!-- Auto-discover validation workflow from document -->
<item cmd="*validate-doc"
     validate-workflow="{output_folder}/document.md">
  Validate Document (auto-discover checklist)
</item>

<!-- Placeholder for future development -->
<item cmd="*analyze-data"
     run-workflow="todo">
  Analyze dataset (workflow coming soon)
</item>
```

**Workflow Attributes:**

- `run-workflow` - Execute a workflow to create documents
- `validate-workflow` - Validate an existing document against its checklist
- `workflow` - (optional with validate-workflow) Specify the workflow.yaml directly

**Best Practices:**

- Use descriptive trigger names
- Always use variable paths
- Mark incomplete as "todo"
- Description should be clear action
- Include validation commands for workflows that produce documents

### 2. Task Commands

Execute single operations

```xml
<!-- Simple task -->
<item cmd="*validate"
   exec="{project-root}/.bmad/core/tasks/validate-workflow.xml">
  Validate document against checklist
</item>

<!-- Task with data -->
<item cmd="*standup"
   exec="{project-root}/.bmad/mmm/tasks/daily-standup.xml"
   data="{project-root}/.bmad/_cfg/agent-manifest.csv">
  Run agile team standup
</item>
```

**Data Property:**

- Can be used with any command type
- Provides additional reference or context
- Path to supplementary files or resources
- Loaded at runtime for command execution

### 3. Template Commands

Generate documents from templates

```xml
<item cmd="*brief"
   exec="{project-root}/.bmad/core/tasks/create-doc.md"
   tmpl="{project-root}/.bmad/bmm/templates/brief.md">
  Produce Project Brief
</item>

<item cmd="*competitor-analysis"
   exec="{project-root}/.bmad/core/tasks/create-doc.md"
   tmpl="{project-root}/.bmad/bmm/templates/competitor.md"
   data="{project-root}/.bmad/_data/market-research.csv">
  Produce Competitor Analysis
</item>
```

### 4. Meta Commands

Agent control and information

```xml
<!-- Required meta commands -->
<item cmd="*help">Show numbered cmd list</item>
<item cmd="*exit">Exit with confirmation</item>

<!-- Optional meta commands -->
<item cmd="*yolo">Toggle Yolo Mode</item>
<item cmd="*status">Show current status</item>
<item cmd="*config">Show configuration</item>
```

### 5. Action Commands

Direct prompts embedded in commands (Simple agents)

#### Simple Action (Inline)

```xml
<!-- Short action attribute with embedded prompt -->
<item cmd="*list-tasks"
   action="list all tasks from {project-root}/.bmad/_cfg/task-manifest.csv">
  List Available Tasks
</item>

<item cmd="*summarize"
   action="summarize the key points from the current document">
  Summarize Document
</item>
```

#### Complex Action (Referenced)

For multiline/complex prompts, define them separately and reference by id:

```xml
<agent name="Research Assistant">
  <!-- Define complex prompts as separate nodes -->
  <prompts>
    <prompt id="deep-analysis">
      Perform a comprehensive analysis following these steps:
      1. Identify the main topic and key themes
      2. Extract all supporting evidence and data points
      3. Analyze relationships between concepts
      4. Identify gaps or contradictions
      5. Generate insights and recommendations
      6. Create an executive summary
      Format the output with clear sections and bullet points.
    </prompt>

    <prompt id="literature-review">
      Conduct a systematic literature review:
      1. Summarize each source's main arguments
      2. Compare and contrast different perspectives
      3. Identify consensus points and controversies
      4. Evaluate the quality and relevance of sources
      5. Synthesize findings into coherent themes
      6. Highlight research gaps and future directions
      Include proper citations and references.
    </prompt>
  </prompts>

  <!-- Commands reference the prompts by id -->
  <menu>
    <item cmd="*help">Show numbered cmd list</item>

    <item cmd="*deep-analyze"
       action="#deep-analysis">
      <!-- The # means: use the <prompt id="deep-analysis"> defined above -->
      Perform Deep Analysis
    </item>

    <item cmd="*review-literature"
       action="#literature-review"
       data="{project-root}/.bmad/_data/sources.csv">
      Conduct Literature Review
    </item>

    <item cmd="*exit">Exit with confirmation</item>
  </menu>
</agent>
```

**Reference Convention:**

- `action="#prompt-id"` means: "Find and execute the <prompt> node with id='prompt-id' within this agent"
- `action="inline text"` means: "Execute this text directly as the prompt"
- `exec="{path}"` means: "Load and execute external file at this path"
- The `#` prefix signals to the LLM: "This is an internal reference - look for a prompt node with this ID within the current agent XML"

**LLM Processing Instructions:**
When you see `action="#some-id"` in a command:

1. Look for `<prompt id="some-id">` within the same agent
2. Use the content of that prompt node as the instruction
3. If not found, report error: "Prompt 'some-id' not found in agent"

**Use Cases:**

- Quick operations (inline action)
- Complex multi-step processes (referenced prompt)
- Self-contained agents with task-like capabilities
- Reusable prompt templates within agent

### 6. Embedded Commands

Logic embedded in agent persona (Simple agents)

```xml
<!-- No exec/run-workflow/action attribute -->
<item cmd="*calculate">Perform calculation</item>
<item cmd="*convert">Convert format</item>
<item cmd="*generate">Generate output</item>
```

## Command Naming Conventions

### Action-Based Naming

```xml
*create-    <!-- Generate new content -->
*build-     <!-- Construct components -->
*analyze-   <!-- Examine and report -->
*validate-  <!-- Check correctness -->
*generate-  <!-- Produce output -->
*update-    <!-- Modify existing -->
*review-    <!-- Examine quality -->
*test-      <!-- Verify functionality -->
```

### Domain-Based Naming

```xml
*brainstorm      <!-- Creative ideation -->
*architect       <!-- Design systems -->
*refactor        <!-- Improve code -->
*deploy          <!-- Release to production -->
*monitor         <!-- Watch systems -->
```

### Naming Anti-Patterns

```xml
<!-- ❌ Too vague -->
<item cmd="*do">Do something</item>

<!-- ❌ Too long -->
<item cmd="*create-comprehensive-product-requirements-document-with-analysis">

<!-- ❌ No verb -->
<item cmd="*prd">Product Requirements</item>

<!-- ✅ Clear and concise -->
<item cmd="*create-prd">Create Product Requirements Document</item>
```

## Command Organization

### Standard Order

```xml
<menu>
  <!-- 1. Always first -->
  <item cmd="*help">Show numbered cmd list</item>

  <!-- 2. Primary workflows -->
  <item cmd="*create-prd" run-workflow="...">Create PRD</item>
  <item cmd="*create-module" run-workflow="...">Build module</item>

  <!-- 3. Secondary actions -->
  <item cmd="*validate" exec="...">Validate document</item>
  <item cmd="*analyze" exec="...">Analyze code</item>

  <!-- 4. Utility commands -->
  <item cmd="*config">Show configuration</item>
  <item cmd="*yolo">Toggle Yolo Mode</item>

  <!-- 5. Always last -->
  <item cmd="*exit">Exit with confirmation</item>
</menu>
```

### Grouping Strategies

**By Lifecycle:**

```xml
<menu>
  <item cmd="*help">Help</item>
  <!-- Planning -->
  <item cmd="*brainstorm">Brainstorm ideas</item>
  <item cmd="*plan">Create plan</item>
  <!-- Building -->
  <item cmd="*build">Build component</item>
  <item cmd="*test">Test component</item>
  <!-- Deployment -->
  <item cmd="*deploy">Deploy to production</item>
  <item cmd="*monitor">Monitor system</item>
  <item cmd="*exit">Exit</item>
</menu>
```

**By Complexity:**

```xml
<menu>
  <item cmd="*help">Help</item>
  <!-- Simple -->
  <item cmd="*quick-review">Quick review</item>
  <!-- Standard -->
  <item cmd="*create-doc">Create document</item>
  <!-- Complex -->
  <item cmd="*full-analysis">Comprehensive analysis</item>
  <item cmd="*exit">Exit</item>
</menu>
```

## Command Descriptions

### Good Descriptions

```xml
<!-- Clear action and object -->
<item cmd="*create-prd">Create Product Requirements Document</item>

<!-- Specific outcome -->
<item cmd="*analyze-security">Perform security vulnerability analysis</item>

<!-- User benefit -->
<item cmd="*optimize">Optimize code for performance</item>
```

### Poor Descriptions

```xml
<!-- Too vague -->
<item cmd="*process">Process</item>

<!-- Technical jargon -->
<item cmd="*exec-wf-123">Execute WF123</item>

<!-- Missing context -->
<item cmd="*run">Run</item>
```

## The Data Property

### Universal Data Attribute

The `data` attribute can be added to ANY command type to provide supplementary information:

```xml
<!-- Workflow with data -->
<item cmd="*brainstorm"
   run-workflow="{project-root}/.bmad/core/workflows/brainstorming/workflow.yaml"
   data="{project-root}/.bmad/core/workflows/brainstorming/brain-methods.csv">
  Creative Brainstorming Session
</item>

<!-- Action with data -->
<item cmd="*analyze-metrics"
   action="analyze these metrics and identify trends"
   data="{project-root}/.bmad/_data/performance-metrics.json">
  Analyze Performance Metrics
</item>

<!-- Template with data -->
<item cmd="*report"
   exec="{project-root}/.bmad/core/tasks/create-doc.md"
   tmpl="{project-root}/.bmad/bmm/templates/report.md"
   data="{project-root}/.bmad/_data/quarterly-results.csv">
  Generate Quarterly Report
</item>
```

**Common Data Uses:**

- Reference tables (CSV files)
- Configuration data (YAML/JSON)
- Agent manifests (XML)
- Historical context
- Domain knowledge
- Examples and patterns

## Advanced Patterns

### Conditional Commands

```xml
<!-- Only show if certain conditions met -->
<item cmd="*advanced-mode"
   if="user_level == 'expert'"
   run-workflow="...">
  Advanced configuration mode
</item>

<!-- Environment specific -->
<item cmd="*deploy-prod"
   if="environment == 'production'"
   exec="...">
  Deploy to production
</item>
```

### Parameterized Commands

```xml
<!-- Accept runtime parameters -->
<item cmd="*create-agent"
   run-workflow="..."
   params="agent_type,agent_name">
  Create new agent with parameters
</item>
```

### Command Aliases

```xml
<!-- Multiple triggers for same action -->
<item cmd="*prd|*create-prd|*product-requirements"
   run-workflow="...">
  Create Product Requirements Document
</item>
```

## Module-Specific Patterns

### BMM (Business Management)

```xml
<item cmd="*create-prd">Product Requirements</item>
<item cmd="*market-research">Market Research</item>
<item cmd="*competitor-analysis">Competitor Analysis</item>
<item cmd="*brief">Project Brief</item>
```

### BMB (Builder)

```xml
<item cmd="*create-agent">Build Agent</item>
<item cmd="*create-module">Build Module</item>
<item cmd="*create-workflow">Create Workflow</item>
<item cmd="*module-brief">Module Brief</item>
```

### CIS (Creative Intelligence)

```xml
<item cmd="*brainstorm">Brainstorming Session</item>
<item cmd="*ideate">Ideation Workshop</item>
<item cmd="*storytell">Story Creation</item>
```

## Command Menu Presentation

### How Commands Display

```
1. *help - Show numbered cmd list
2. *create-prd - Create Product Requirements Document
3. *create-agent - Build new BMAD agent
4. *validate - Validate document
5. *exit - Exit with confirmation
```

### Menu Customization

```xml
<!-- Group separator (visual only) -->
<item cmd="---">━━━━━━━━━━━━━━━━━━━━</item>

<!-- Section header (non-executable) -->
<item cmd="SECTION">═══ Workflows ═══</item>
```

## Error Handling

### Missing Resources

```xml
<!-- Workflow not yet created -->
<item cmd="*future-feature"
   run-workflow="todo">
  Coming soon: Advanced feature
</item>

<!-- Graceful degradation -->
<item cmd="*analyze"
   run-workflow="{optional-path|fallback-path}">
  Analyze with available tools
</item>
```

## Testing Commands

### Command Test Checklist

- [ ] Unique trigger (no duplicates)
- [ ] Clear description
- [ ] Valid path or "todo"
- [ ] Uses variables not hardcoded paths
- [ ] Executes without error
- [ ] Returns to menu after execution

### Common Issues

1. **Duplicate triggers** - Each cmd must be unique
2. **Missing paths** - File must exist or be "todo"
3. **Hardcoded paths** - Always use variables
4. **No description** - Every command needs text
5. **Wrong order** - help first, exit last

## Quick Templates

### Workflow Command

```xml
<!-- Create document -->
<item cmd="*{action}-{object}"
   run-workflow="{project-root}/.bmad/{module}/workflows/{workflow}/workflow.yaml">
  {Action} {Object Description}
</item>

<!-- Validate document -->
<item cmd="*validate-{object}"
   validate-workflow="{output_folder}/{document}.md"
   workflow="{project-root}/.bmad/{module}/workflows/{workflow}/workflow.yaml">
  Validate {Object Description}
</item>
```

### Task Command

```xml
<item cmd="*{action}"
   exec="{project-root}/.bmad/{module}/tasks/{task}.md">
  {Action Description}
</item>
```

### Template Command

```xml
<item cmd="*{document}"
   exec="{project-root}/.bmad/core/tasks/create-doc.md"
   tmpl="{project-root}/.bmad/{module}/templates/{template}.md">
  Create {Document Name}
</item>
```

## Self-Contained Agent Patterns

### When to Use Each Approach

**Inline Action (`action="prompt"`)**

- Prompt is < 2 lines
- Simple, direct instruction
- Not reused elsewhere
- Quick transformations

**Referenced Prompt (`action="#prompt-id"`)**

- Prompt is multiline/complex
- Contains structured steps
- May be reused by multiple commands
- Maintains readability

**External Task (`exec="path/to/task.md"`)**

- Logic needs to be shared across agents
- Task is independently valuable
- Requires version control separately
- Part of larger workflow system

### Complete Self-Contained Agent

```xml
<agent id=".bmad/research/agents/analyst.md" name="Research Analyst" icon="🔬">
  <!-- Embedded prompt library -->
  <prompts>
    <prompt id="swot-analysis">
      Perform a SWOT analysis:

      STRENGTHS (Internal, Positive)
      - What advantages exist?
      - What do we do well?
      - What unique resources?

      WEAKNESSES (Internal, Negative)
      - What could improve?
      - Where are resource gaps?
      - What needs development?

      OPPORTUNITIES (External, Positive)
      - What trends can we leverage?
      - What market gaps exist?
      - What partnerships are possible?

      THREATS (External, Negative)
      - What competition exists?
      - What risks are emerging?
      - What could disrupt us?

      Provide specific examples and actionable insights for each quadrant.
    </prompt>

    <prompt id="competitive-intel">
      Analyze competitive landscape:
      1. Identify top 5 competitors
      2. Compare features and capabilities
      3. Analyze pricing strategies
      4. Evaluate market positioning
      5. Assess strengths and vulnerabilities
      6. Recommend competitive strategies
    </prompt>
  </prompts>

  <menu>
    <item cmd="*help">Show numbered cmd list</item>

    <!-- Simple inline actions -->
    <item cmd="*summarize"
       action="create executive summary of findings">
      Create Executive Summary
    </item>

    <!-- Complex referenced prompts -->
    <item cmd="*swot"
       action="#swot-analysis">
      Perform SWOT Analysis
    </item>

    <item cmd="*compete"
       action="#competitive-intel"
       data="{project-root}/.bmad/_data/market-data.csv">
      Analyze Competition
    </item>

    <!-- Hybrid: external task with internal data -->
    <item cmd="*report"
       exec="{project-root}/.bmad/core/tasks/create-doc.md"
       tmpl="{project-root}/.bmad/research/templates/report.md">
      Generate Research Report
    </item>

    <item cmd="*exit">Exit with confirmation</item>
  </menu>
</agent>
```

## Simple Agent Example

For agents that primarily use embedded logic:

```xml
<agent name="Data Analyst">
  <menu>
    <item cmd="*help">Show numbered cmd list</item>

    <!-- Action commands for direct operations -->
    <item cmd="*list-metrics"
       action="list all available metrics from the dataset">
      List Available Metrics
    </item>

    <item cmd="*analyze"
       action="perform statistical analysis on the provided data"
       data="{project-root}/.bmad/_data/dataset.csv">
      Analyze Dataset
    </item>

    <item cmd="*visualize"
       action="create visualization recommendations for this data">
      Suggest Visualizations
    </item>

    <!-- Embedded logic commands -->
    <item cmd="*calculate">Perform calculations</item>
    <item cmd="*interpret">Interpret results</item>

    <item cmd="*exit">Exit with confirmation</item>
  </menu>
</agent>
```

## LLM Building Guide

When creating commands:

1. Start with *help and *exit
2. Choose appropriate command type:
   - Complex multi-step? Use `run-workflow`
   - Single operation? Use `exec`
   - Need template? Use `exec` + `tmpl`
   - Simple prompt? Use `action`
   - Agent handles it? Use no attributes
3. Add `data` attribute if supplementary info needed
4. Add primary workflows (main value)
5. Add secondary tasks
6. Include utility commands
7. Test each command works
8. Verify no duplicates
9. Ensure clear descriptions
