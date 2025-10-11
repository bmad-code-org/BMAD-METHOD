# BMM Tasks

Reusable task definitions that agents can execute. Tasks are atomic units of work defined in XML format that follow a structured execution flow.

## Available Tasks

### Development & Sprint Management

#### `development-status.xml`

**Purpose:** View comprehensive real-time development progress across planning and implementation phases.

**Usage:**
```bash
/sm
*development-status

# Or from other agents
/dev
*development-status

/pm
*development-status
```

**What it shows:**
- Planning phase status (PRD, Architecture, Epics existence)
- Story breakdown by status (Draft/In Progress/Done/etc)
- Task completion metrics
- Current focus areas (stories in progress)
- Blockers and items ready for review
- Context-aware recommendations for next steps

**When to use:**
- Daily standup preparation
- Sprint planning
- Progress reporting to stakeholders
- After completing work to verify status
- Returning to project after time away

**Available in agents:** SM (Scrum Master), DEV (Developer), PM (Product Manager)

---

#### `daily-standup.xml`

**Purpose:** Run structured daily standup meetings with context from current stories.

**What it does:**
- Discovers current story status
- Gathers team context
- Facilitates structured standup discussion
- Creates actionable summary

**When to use:**
- Start of each working day
- Sprint checkpoint meetings

---

#### `retrospective.xml`

**Purpose:** Facilitate team retrospective after completing an epic.

**What it does:**
- Reviews completed epic metrics
- Gathers team feedback (What went well, What to improve)
- Identifies lessons learned
- Prepares for next epic
- Creates action items

**When to use:**
- After completing all stories in an epic
- Before starting next epic
- Sprint/milestone completion

---

## Task Execution Model

Tasks follow a structured XML format with these key sections:

```xml
<task id="bmad/bmm/tasks/example.xml" name="Example Task">
  <llm critical="true">
    <!-- Critical execution instructions -->
  </llm>

  <flow>
    <step n="1" title="Step Name">
      <action>Specific action to perform</action>
      <output>Expected output format</output>
    </step>
    <!-- More steps -->
  </flow>

  <validation>
    <!-- Validation requirements -->
  </validation>

  <critical-context>
    <!-- Important context for execution -->
  </critical-context>
</task>
```

## How Tasks Differ from Workflows

| Aspect | Tasks | Workflows |
|--------|-------|-----------|
| **Format** | XML | YAML + Markdown |
| **Scope** | Single focused operation | Multi-step process |
| **Structure** | Linear flow of steps | Complex branching logic |
| **Duration** | Quick (seconds to minutes) | Extended (minutes to hours) |
| **State** | Stateless, read-only | May modify project files |
| **Use Case** | Status checks, reports | Creating artifacts, implementation |

**Examples:**
- **Task:** View development status (read-only, quick)
- **Workflow:** Create story (generates files, multi-step)

## Integration with Agents

Tasks are integrated into agent menus using the `exec` attribute:

```yaml
menu:
  - trigger: development-status
    exec: "{project-root}/bmad/bmm/tasks/development-status.xml"
    description: View current development progress
```

## Creating New Tasks

When creating a new task:

1. **Use XML format** following the structure above
2. **Define clear steps** in the `<flow>` section
3. **Include validation** requirements
4. **Add critical context** for LLM execution
5. **Make it read-only** when possible (safer to run)
6. **Test thoroughly** with different project states
7. **Update agent menus** to expose the task
8. **Document in this README**

## Configuration Variables

Tasks can reference project configuration:

- `{project-root}` - Project root directory
- `{output_folder}` - Planning documents and stories location (includes stories/ subdirectory)

These are resolved at runtime from `bmad/bmm/config.yaml`.

## Best Practices

1. **Keep tasks atomic** - Each task should do one thing well
2. **Design for reusability** - Tasks should work across different projects
3. **Handle missing files gracefully** - Don't error, report status
4. **Provide clear output** - Use formatting for readability
5. **Include recommendations** - Help users know what to do next
6. **Make them safe** - Prefer read-only operations
7. **Test edge cases** - New projects, missing docs, malformed files

## Related Documentation

- [BMM Workflows](../workflows/README.md) - Multi-step process definitions
- [BMM Agents](../agents/README.md) - Agent configurations
- [Agent Command Patterns](../../bmb/workflows/create-agent/agent-command-patterns.md) - How to integrate tasks into agents
