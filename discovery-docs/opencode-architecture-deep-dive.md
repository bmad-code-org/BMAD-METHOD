# opencode Core Architecture Deep Dive

This document provides a comprehensive overview of the foundational elements of the `opencode` architecture, based on a detailed examination of its codebase.

## Core Philosophies and Goals:

The core philosophies behind `opencode` revolve around empowering developers with an **AI coding agent built for the terminal**, emphasizing **extensibility, configurability, and a structured approach to AI interaction**.

### What `opencode` Set Out to Do:

1.  **AI-Powered Developer Augmentation:** Provide an intelligent assistant that helps developers with coding tasks directly within their terminal environment.
2.  **Extensibility and Customization:** Be highly adaptable, allowing users to extend its capabilities and tailor its behavior to specific project needs and preferences.
3.  **Structured and Reliable AI Interaction:** Make AI interactions predictable and manageable through clear definitions of agents, tools, and sessions, along with robust error handling and validation.
4.  **Transparency and Observability:** Provide insights into the AI's decision-making process and tool execution.

### How `opencode` Accomplished Its Goals:

1.  **Agent-Centric Architecture:**
    - **Configurable Agents:** Defines agents with distinct roles, permissions, and toolsets (`Agent.Info` schema), allowing for specialized AI behaviors.
    - **Agent Generation:** The `Agent.generate` function, guided by a meta-prompt (`generate.txt`), enables the AI to create new agent configurations based on user descriptions.

2.  **Tool-Driven Capabilities:**
    - **Comprehensive Toolset:** Provides a rich set of built-in tools for common developer tasks (e.g., `bash`, `edit`, `read`, `write`, `glob`, `grep`, `webfetch`).
    - **Extensible Tool Registry:** The `ToolRegistry` allows for dynamic registration of new tools through plugins (`EXTRA` tools) and HTTP callbacks (`HTTP` tools).
    - **Structured Tool Definition:** Tools adhere to the `Tool.Info` interface, ensuring clear descriptions, `zod`-validated parameters, and a standardized `execute` method.

3.  **Session-Based Context Management:**
    - **Persistent Sessions:** Manages persistent sessions (`Session.Info`) that maintain conversation history, tool outputs, and project context.
    - **Message Structure:** Messages are highly structured (`MessageV2.Info` and `MessageV2.Part`s), supporting various content types (text, reasoning, tool calls, file changes, snapshots).
    - **Context Pruning:** The `prune` function helps manage token limits by compacting old tool outputs.

4.  **API-First Design:**
    - **Hono-based Server:** A robust HTTP API exposes all core functionalities, making `opencode` programmable and allowing for diverse frontend integrations.

5.  **Dynamic Prompt Orchestration:**
    - **Context Assembly:** Dynamically constructs system prompts by combining provider-specific headers, model-specific instructions, environmental context, and custom rule files.
    - **Workflow Automation:** The `command` function enables command-driven workflows, processing templates, handling file/agent references, and invoking subagents.

6.  **Developer-Friendly Interfaces:**
    - **Terminal User Interface (TUI):** A Go-based TUI provides a terminal-native experience.
    - **Web Application:** A React/TypeScript web app (`packages/app/`) offers a modern, interactive interface.

---

## 1. Agents (`packages/opencode/src/agent/agent.ts`)

- **Definition:** Agents are configured via a `zod` schema (`Agent.Info`), specifying `name`, `description`, `mode` (`subagent`, `primary`, `all`), `permissions` (for `edit`, `bash`, `webfetch`), `model` (provider and ID), `prompt`, and `tools` (enabled/disabled).
- **Configuration:** Agent configurations are loaded from `Config.get()` and managed via `Instance.state`. Built-in agents (`general`, `build`, `plan`) are provided, and users can define/override configurations.
- **Generation:** The `Agent.generate` function uses a meta-prompt (`generate.txt`) to create new agent configurations based on descriptions.
- **Invocation:** Agent invocation is primarily driven by the AI model's decision-making based on the system prompt and available tools. The `mode` property influences orchestration.
- **Purpose:** Agents are specialized AI assistants configured for specific tasks and workflows, allowing for focused tools with custom prompts, models, and tool access.
- **Configuration Details:** Configured in `opencode.json` or through Markdown files. Options include `description`, `temperature`, `disable` status, `prompt` (custom system prompt), `model` (to override the default), and `tools` (to control tool availability).
- **Permissions:** Granular permissions for actions like `edit`, `bash`, and `webfetch` can be set to `allow`, `ask`, or `deny`, either globally or per agent, with granular control for bash commands.
- **Mode:** Agents have a `mode` (primary, subagent, or all) and can accept `additional` provider-specific model options.

## 2. Tools (`packages/opencode/src/tool/registry.ts` and `packages/opencode/src/tool/tool.ts`)

- **Registry:** `ToolRegistry` is the central point for managing tools.
- **Types:** Includes `BUILTIN` tools (e.g., `BashTool`, `EditTool`, `WebFetchTool`), `EXTRA` tools (runtime-registered via plugins), and `HTTP` tools (registered via HTTP callbacks for external services).
- **Definition:** Tools are defined using `Tool.define`, adhering to the `Tool.Info` interface, which specifies `id`, `description`, `parameters` (with `zod` schemas for validation), and an `execute` method.
- **Context:** The `Tool.Context` interface provides session, message, agent, and abort signal information to tools.
- **Permissions:** The `ToolRegistry.enabled()` function determines tool availability based on agent permissions.

## 3. Server API (`packages/opencode/src/server/server.ts`)

- **Framework:** Hono-based HTTP API.
- **Key Endpoints:**
  - `/experimental/tool/register`: Dynamic registration of HTTP callback tools.
  - `/experimental/tool/ids`, `/experimental/tool`: List available tools.
  - `/session/*`: Comprehensive session management (create, retrieve, update, delete, share, summarize, messages, prompts, commands, shell execution, revert, permissions).
  - `/config`, `/config/providers`: Configuration and AI provider/model lists.
  - `/file/*`: File system operations.
  - `/find/*`: Search functionalities.
  - `/agent`: List all agents.
  - `/tui/*`: TUI control endpoints.
  - `/auth/:id`: Authentication.

## 4. Session Management (`packages/opencode/src/session/index.ts`)

- **Structure:** Sessions are defined by `Session.Info` schema, including `id`, `projectID`, `directory`, `parentID`, `share` info, `title`, `version`, `time` (created, updated, compacting), and `revert` state.
- **Lifecycle:** Functions for `create`, `get`, `list`, `children`, `update`, `remove`, `share`, `unshare`, and `initialize`.
- **Message Handling:** Manages `MessageV2.Info` and `MessageV2.Part`s within sessions, including `updateMessage`, `removeMessage`, `updatePart`.
- **Pruning:** `prune` function compacts old tool outputs to manage token limits.
- **Usage:** `getUsage` tracks cost and token usage.

## 5. Message Structure (`packages/opencode/src/session/message-v2.ts`)

- **Errors:** Defines custom error types.
- **`ToolState`:** Tracks the `pending`, `running`, `completed`, or `error` state of tool executions.
- **`Part` Types:** A rich set of content types for messages: `SnapshotPart`, `PatchPart`, `TextPart`, `ReasoningPart`, `ToolPart`, `FilePart` (with `FileSource` or `SymbolSource`), `AgentPart`, `StepStartPart`, `StepFinishPart`.
- **`User` and `Assistant` Messages:** Distinct schemas for user and assistant messages, with assistant messages including detailed contextual information, cost, and token usage.
- **Events:** `MessageV2.Event` for real-time updates.
- **`MessageV2.WithParts`:** Combines message info with its parts.

## 6. Prompt Orchestration (`packages/opencode/src/session/prompt.ts`)

- **Core Function:** `prompt(input: PromptInput)` orchestrates AI interaction.
- **User Input:** Creates user messages, handling file references and converting them to AI-readable parts.
- **Concurrency:** Uses session locking and queuing.
- **Context Assembly:** Resolves agent, model, and constructs system prompts (`SystemPrompt.header`, `SystemPrompt.provider`, `SystemPrompt.environment`, `SystemPrompt.custom`).
- **Tool Integration:** Resolves and wraps tools, handling execution, state updates, and plugin triggers.
- **AI Interaction:** Uses `streamText` to interact with AI models.
- **Response Processing:** `createProcessor` handles streaming AI output, updating messages, tool states, and tracking steps/patches.
- **Direct Execution:** `shell` function for direct shell command execution.
- **Command Workflows:** `command` function executes predefined commands, processes templates, handles file/agent references, and can invoke subagents via `TaskTool`.
- **Dynamic Prompt Injection:** `insertReminders` injects synthetic prompts based on agent mode.
- **Session Title Generation:** `ensureTitle` generates session titles using a smaller AI model.

## 7. System Prompts (`packages/opencode/src/session/system.ts`)

- **Dynamic Construction:** Combines provider-specific headers, model-specific instructions, environmental context, and custom rule files (`AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `config.instructions`).
- **Purpose:** Provides general instructions and context to AI models.
- **Rules Details:**
  - **Purpose:** `AGENTS.md` (similar to `CLAUDE.md` or Cursor's rules) provides custom instructions to the `opencode` AI agent, guiding its behavior by including these instructions in the LLM's context.
  - **Location and Precedence:** Rules can be project-specific (project root) or global (`~/.config/opencode/AGENTS.md`). `opencode` combines both sets, with project-specific rules taking precedence.
  - **Custom Instruction Files:** Additional instruction files can be specified in `opencode.json`, allowing for reuse and referencing external files for modular guidelines. The agent can also be instructed to reference external files for modular rule sets, either through `opencode.json` or by explicit instructions in `AGENTS.md` that prompt lazy loading of relevant files.

## 8. Project Instance (`packages/opencode/src/project/instance.ts`)

- **Context Management:** `Instance.state` and `Instance.provide` manage project-specific context, ensuring operations are performed within the correct project directory and worktree.

## 9. Configuration (`packages/opencode/src/config/config.ts`)

- **Loading and Validation:** Handles loading, validating, and applying configurations for agents, tools, and other `opencode` settings.
- **Configuration Management Details:**
  - **File Format:** `opencode` configuration is managed via JSON or JSONC files (supporting comments).
  - **File Locations and Precedence:**
    - **Global:** `~/.config/opencode/opencode.json`
    - **Per Project:** `opencode.json` in the project root.
    - **Environment Variable:** Can be specified via the `OPENCODE_CONFIG` environment variable (takes highest precedence).
  - **Key Configurable Aspects:**
    - Defining AI models and providers.
    - Setting UI themes.
    - Configuring specialized agents with custom prompts and tool permissions.
    - Creating custom commands.
    - Customizing keybinds.
    - Enabling/disabling autoupdate.
    - Configuring code formatters.
    - Managing granular permissions for AI agent actions (e.g., file editing, bash commands).
    - Specifying additional instructions for models.
  - **Advanced Configuration Features:**
    - Supports variable substitution for environment variables and file contents, which is particularly useful for managing sensitive data like API keys or incorporating large instruction sets.

## 10. Event Bus (`packages/opencode/src/bus/index.ts`)

- **Communication:** Provides a central mechanism for publishing and subscribing to events across different `opencode` components, enabling real-time updates and inter-component communication.

## 11. User Interfaces

- **Web Application (`packages/app/`):** React/TypeScript/Vite-based web UI.
- **Terminal User Interface (`packages/tui/`):** Go-based TUI.
- **Web Landing Page (`packages/web/`):** Astro-based web application.

## 12. Commands (from `https://opencode.ai/docs/commands/`)

- **Purpose:** Automate repetitive tasks, executed in the TUI by typing `/` followed by the command name.
- **Definition:** Can be defined in `opencode.jsonc` or as Markdown files in the `.opencode/command/` directory.
- **Structure:** Involves a template (the prompt sent to the LLM), an optional description, and optional specifications for the agent and model to be used.
- **Placeholders:** Supports `$ARGUMENTS` (for passing arguments), `!command` (to inject shell command output), and `@filename` (to include file content).
- **Execution:** Commands run in the project's root directory, and their output becomes part of the prompt.

## 13. Keybinds (from `https://opencode.ai/docs/keybinds/`)

- **Customization:** Fully customizable through the `opencode.json` configuration file.
- **Leader Key:** Utilizes a "leader key" (defaulting to `ctrl+x`) that must be pressed before most other keybind shortcuts to prevent conflicts in the terminal.
- **Disabling:** Specific keybinds can be disabled by setting their value to "none".

## 14. Formatters (from `https://opencode.ai/docs/formatters/`)

- **Purpose:** Automatically format files after they are written or edited, ensuring code adheres to project styles.
- **Configuration:** Defined within the `formatter` section of the `opencode.json` configuration file.
- **Properties:** Includes `disabled`, `command` (the command to execute for formatting), `environment` (environment variables), and `extensions` (file extensions it handles).
- **Custom Formatters:** Can be defined by specifying their `command` and `extensions`, using `$FILE` as a placeholder for the file path.

## 15. Themes (from `https://opencode.ai/docs/themes/`)

- **Customization:** Offers extensive customization options, allowing users to select from built-in themes, adapt to their terminal's theme, or define custom themes using a flexible JSON-based system.
- **Types:** Built-in themes, "system" theme (adapts to terminal background).
- **Custom Theme Format:** Flexible JSON format, allowing for hex colors, ANSI colors, color references, dark/light variants, and the "none" value to inherit terminal defaults.
- **Location and Precedence:** Custom themes can be defined at the user-wide or project-specific level, with a hierarchy determining precedence.
