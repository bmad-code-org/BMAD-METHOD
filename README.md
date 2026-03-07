# BMAD-Jira: Atlassian-Native Agentic Development

A standalone Jira/Confluence-native implementation of the [BMAD agentic development method](https://github.com/bmadcode/BMAD-METHOD). Instead of writing artefacts to local markdown files, BMAD agents create and manage Jira issues (Epics, Stories, Subtasks) and Confluence pages (PRDs, architecture docs, UX designs) via the Atlassian MCP server.

## How It Works

BMAD-Jira provides 7 AI agent personas that collaborate through a structured 4-phase development workflow:

1. **Analysis** — Analyst creates product briefs and research reports on Confluence
2. **Planning** — PM creates PRDs and Epics/Stories in Jira; UX Designer creates design docs on Confluence
3. **Solutioning** — Architect creates architecture decisions on Confluence; SM validates implementation readiness
4. **Implementation** — SM manages sprints and prepares stories; Dev implements code; QA reviews via Jira

All agent output goes exclusively to Jira and Confluence. An automated orchestrator polls Jira via JQL to determine which agent should work next, enabling autonomous project progression.

## Prerequisites

- **Claude Code** (or compatible LLM tool with MCP support)
- **Jira Cloud** project with Agile board
- **Confluence Cloud** space for documentation
- **Atlassian API token** ([Generate here](https://id.atlassian.com/manage-profile/security/api-tokens))

## MCP Server Dependency

BMAD-Jira requires the **mcp-atlassian** MCP server for all Jira and Confluence operations.

### Installation

**Using uvx (recommended):**

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "uvx",
      "args": ["mcp-atlassian"],
      "env": {
        "JIRA_URL": "https://your-domain.atlassian.net",
        "JIRA_USERNAME": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token",
        "CONFLUENCE_URL": "https://your-domain.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Using Docker:**

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "JIRA_URL",
        "-e", "JIRA_USERNAME",
        "-e", "JIRA_API_TOKEN",
        "-e", "CONFLUENCE_URL",
        "-e", "CONFLUENCE_USERNAME",
        "-e", "CONFLUENCE_API_TOKEN",
        "ghcr.io/sooperset/mcp-atlassian:latest"
      ],
      "env": {
        "JIRA_URL": "https://your-domain.atlassian.net",
        "JIRA_USERNAME": "your-email@example.com",
        "JIRA_API_TOKEN": "your-api-token",
        "CONFLUENCE_URL": "https://your-domain.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Using pip:**

```bash
pip install mcp-atlassian
```

The MCP server provides 72 tools (45 Jira, 27 Confluence) that BMAD agents use for all operations.

## Installation

1. **Clone this repository** into your project:

   ```bash
   git clone https://github.com/your-org/BMAD-GUI.git
   cp -r BMAD-GUI/src/atlassian/ your-project/_bmad/atlassian/
   ```

2. **Configure** `_bmad/atlassian/config.yaml` with your project settings (see Configuration below)

3. **Run transition discovery** to map your Jira workflow's transition IDs:

   ```
   Load the workflow: _bmad/atlassian/transition-discovery.md
   Follow the 7-step process to discover and record your Jira transition IDs
   ```

4. **Set up the MCP server** in your Claude Code or IDE configuration (see MCP Server Dependency above)

## Configuration

All configuration lives in `module.yaml`. Key settings:

| Variable | Description | Default |
|---|---|---|
| `project_name` | Your project name | Directory name |
| `user_name` | Your name for agent communication | "Developer" |
| `communication_language` | Language agents communicate in | "English" |
| `document_output_language` | Language for generated documents | "English" |
| `user_skill_level` | beginner / intermediate / expert | "intermediate" |
| `jira_project_key` | Your Jira project key (e.g., PROJ) | "PROJ" |
| `jira_board_id` | Your Jira Agile board ID | (discover via transition-discovery) |
| `confluence_space_key` | Your Confluence space key | Same as project key |
| `confluence_parent_page_id` | Parent page ID for BMAD pages | (root of space) |
| `status_transitions` | Jira transition ID mapping | (populate via transition-discovery) |
| `agent_label_prefix` | Prefix for agent-applied labels | "bmad-agent-" |
| `lock_label` | Label for agent locking | "agent-active" |

### Status Transition Mapping

BMAD uses abstract statuses that must be mapped to your Jira project's specific transition IDs:

```yaml
status_transitions:
  epic:
    backlog_to_in_progress: "21"    # Your transition ID
    in_progress_to_done: "31"       # Your transition ID
  story:
    backlog_to_ready_for_dev: "11"
    ready_for_dev_to_in_progress: "21"
    in_progress_to_review: "31"
    review_to_done: "41"
```

Transition IDs vary per Jira project. Run `transition-discovery.md` to auto-discover yours.

## Agent Roster

| Agent | Persona | Role | Phase |
|---|---|---|---|
| **Analyst** | Mary | Creates product briefs and conducts research | 1 - Analysis |
| **PM** | John | Creates PRDs, defines epics and stories | 2 - Planning |
| **UX Designer** | Sally | Creates UX design specifications | 2 - Planning |
| **Architect** | Winston | Defines architecture and technology decisions | 3 - Solutioning |
| **SM (Scrum Master)** | Bob | Manages sprints, prepares stories, runs retros | 3-4 - Solutioning/Implementation |
| **Dev** | Amelia | Implements stories, writes code | 4 - Implementation |
| **QA** | Quinn | Reviews code, validates acceptance criteria | 4 - Implementation |

## Workflow Reference

### Phase 1 — Analysis
| Workflow | Agent | Jira/Confluence Output |
|---|---|---|
| Create Product Brief | Analyst | Confluence page (bmad-brief label) |
| Research | Analyst | Confluence page(s) (bmad-research label) |

### Phase 2 — Planning
| Workflow | Agent | Jira/Confluence Output |
|---|---|---|
| Create PRD | PM | Confluence page + Remote Issue Links to Epics |
| Create UX Design | UX Designer | Confluence page + Remote Issue Links to Epics |
| Create Epics and Stories | PM | Jira Epics + Stories (Batch Create, Link to Epic) |

### Phase 3 — Solutioning
| Workflow | Agent | Jira/Confluence Output |
|---|---|---|
| Create Architecture | Architect | Confluence page + Remote Issue Links to Epics |
| Check Implementation Readiness | SM | Confluence readiness report + Epic comments |

### Phase 4 — Implementation
| Workflow | Agent | Jira/Confluence Output |
|---|---|---|
| Sprint Planning | SM | Create Sprint, Add Issues to Sprint, Epic transitions |
| Create Story | SM | Update Issue (enrich description), Create Subtasks, Transition to Ready for Dev |
| Dev Story | Dev | Lock Issue, Transition In Progress, Add Comment (Dev Record), Transition to Review |
| Code Review | QA | Add Comment (review findings), Transition to Done |
| Sprint Status | SM | JQL-based status dashboard (read-only) |
| Correct Course | SM | Update Issue, Create Issue (remediation), Add Comment |
| Retrospective | SM | Confluence page + Epic comment, Transition Epic to Done |

## Architecture

```
src/atlassian/
  module.yaml                    # Configuration schema
  artefact-mapping.yaml          # Maps artefacts to MCP tool calls
  transition-discovery.md        # Setup workflow for transition IDs

  agents/                        # Full standalone agent definitions
    analyst.agent.yaml
    pm.agent.yaml
    architect.agent.yaml
    sm.agent.yaml
    dev.agent.yaml
    qa.agent.yaml
    ux-designer.agent.yaml

  templates/                     # Document templates (from BMAD-METHOD)
    product-brief-template.md
    research-template.md
    prd-template.md
    ux-design-template.md
    epics-template.md
    story-template.md
    architecture-decision-template.md
    readiness-report-template.md

  checklists/                    # Quality checklists
    code-review-checklist.md
    dev-story-checklist.md
    create-story-checklist.md
    correct-course-checklist.md
    sprint-planning-checklist.md

  tasks/                         # Reusable MCP task procedures
    write-to-confluence.md       # Idempotent Confluence page create/update
    transition-jira-issue.md     # Safe status transitions with guard checks
    lock-issue.md                # Agent locking via labels
    read-jira-context.md         # Context loading from Jira/Confluence
    post-handoff.md              # Cross-agent handoff notifications

  orchestrator/                  # Automated dispatch system
    jira-state-reader.md         # Polls Jira/Confluence for project state
    agent-dispatch-rules.md      # Priority-ordered rules for agent selection

  workflow-overrides/            # Jira-specific workflow implementations
    1-analysis/                  # Product brief, research
    2-plan-workflows/            # PRD, UX design
    3-solutioning/               # Architecture, readiness, epics/stories
    4-implementation/            # Sprint planning, stories, dev, review, retro

  data/
    .jira-key-map.yaml.template  # Template for BMAD→Jira key mapping
```

### Key Concepts

- **Key Map** (`.jira-key-map.yaml`): Local file that maps BMAD identifiers (e.g., `epic-1`) to Jira issue keys (e.g., `PROJ-42`) and Confluence page IDs. Updated automatically by workflows.

- **Agent Locking**: When an agent starts work on a Jira issue, it applies the `agent-active` label to prevent concurrent work. The orchestrator detects and clears stale locks (>1 hour inactive).

- **Handoff Labels**: When an agent completes work, it applies a `bmad-handoff-{agent}` label to signal the next agent. The orchestrator prioritises these over state-based inference.

- **Reusable Tasks**: Common MCP operations (write to Confluence, transition issues, lock/unlock, read context) are encapsulated as task files that workflows invoke. This ensures consistent behaviour across all agents.

## Orchestrator

The orchestrator runs in automated polling mode:

1. **Poll** — `jira-state-reader` queries Jira and Confluence for current project state
2. **Evaluate** — `agent-dispatch-rules` checks 16 priority-ordered rules against the state
3. **Dispatch** — Invokes the matching agent with its workflow and pre-loaded context
4. **Repeat** — After agent completion, returns to step 1

The orchestrator handles: handoff signal detection, agent locking/conflict prevention, stale lock cleanup, and project completion detection.

## Differences from BMAD-METHOD

| Aspect | BMAD-METHOD | BMAD-Jira |
|---|---|---|
| Output | Local markdown files | Jira issues + Confluence pages |
| Tracking | `sprint-status.yaml` file | Jira Sprints API |
| Status transitions | Manual file edits | Jira Transition API |
| Cross-references | File paths | Jira issue keys + Confluence page IDs |
| Agent communication | Shared file system | Jira comments + handoff labels |
| Quick Flow | Included (Barry agent) | Excluded (not applicable to Jira workflows) |
| Dependencies | Standalone | Requires mcp-atlassian MCP server |

## Contributing

This project extends the [BMAD-METHOD](https://github.com/bmadcode/BMAD-METHOD) for Atlassian environments. Templates and checklists are adapted from the original project.

## License

See [LICENSE](LICENSE) for details.
