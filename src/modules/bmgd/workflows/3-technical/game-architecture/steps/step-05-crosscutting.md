---
name: 'step-05-crosscutting'
description: 'Address cross-cutting concerns that affect all game systems'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-05-crosscutting.md'
nextStepFile: './step-06-structure.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Cross-cutting Concerns

**Progress: Step 5 of 9** - Next: Project Structure

## STEP GOAL:

Define patterns for concerns that affect EVERY system in the game: error handling, logging, configuration, events, and debugging. These decisions ensure consistency across all AI agent implementations.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game architect facilitator
- Cross-cutting concerns affect EVERY system
- Consistency here prevents major integration issues

### Step-Specific Rules:

- Focus on patterns that prevent AI agent conflicts
- Every decision must have a concrete example
- These become mandatory rules for all implementations

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after all concerns documented
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into specific concerns
- **P (Party Mode)**: Get perspectives on patterns
- **C (Continue)**: Confirm patterns and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Explain Cross-cutting Importance

"Now let's define cross-cutting concerns - patterns that apply to EVERY system.

**Why this matters:**
If one AI agent handles errors differently than another, your game breaks.
If logging formats vary, debugging becomes impossible.
These patterns are the 'constitution' that all code must follow.

Let's define each one."

### 2. Error Handling Strategy

"**Error Handling**

How should ALL systems handle errors?

**Options:**

| Approach                 | Description                     | Best For            |
| ------------------------ | ------------------------------- | ------------------- |
| **Try-Catch Everywhere** | Explicit handling at each point | Critical systems    |
| **Global Handler**       | Centralized error management    | Consistent recovery |
| **Signal/Event Based**   | Emit errors as events           | Decoupled systems   |
| **Result Objects**       | Return success/failure objects  | Functional style    |

**Game-specific considerations:**

- Should errors pause the game?
- How should critical vs recoverable errors differ?
- Should errors be visible to players?

What's your error handling strategy?"

### 3. Logging Approach

"**Logging Strategy**

How should ALL systems log information?

**Log Levels:**

- **ERROR**: Something broke
- **WARN**: Something unexpected but handled
- **INFO**: Normal operation milestones
- **DEBUG**: Detailed diagnostic info
- **TRACE**: Extremely verbose (development only)

**Questions:**

- What format? (structured JSON, plain text, engine-native)
- Where do logs go? (console, file, external service)
- What should always be logged vs conditional?
- How should performance-critical paths handle logging?

What's your logging approach?"

### 4. Configuration Management

"**Configuration Management**

How will game settings be organized and accessed?

**Configuration Types:**

- **Game constants** - Values that never change
- **Balancing values** - Tweakable gameplay numbers
- **Player settings** - User preferences
- **Platform settings** - Per-platform adjustments

**Storage options:**

- Hardcoded constants
- Configuration files (JSON, YAML)
- Engine-native systems
- Remote configuration

How should configuration be managed?"

### 5. Event/Signal System

"**Event System**

How should systems communicate without tight coupling?

**Options:**

| Pattern           | Description           | Complexity |
| ----------------- | --------------------- | ---------- |
| **Observer**      | Direct subscription   | Simple     |
| **Event Bus**     | Central dispatcher    | Medium     |
| **Signal/Slot**   | Type-safe connections | Medium     |
| **Message Queue** | Async processing      | Complex    |

**Questions:**

- Typed events or stringly-typed?
- Sync or async event processing?
- Event history/replay for debugging?

What's your event system approach?"

### 6. Debug/Development Tools

"**Debug & Development Tools**

What development tools should be built in?

**Common debug features:**

- Debug console/command system
- Visual debugging overlays
- State inspection tools
- Performance profiling hooks
- Cheat/testing commands

**Questions:**

- How are debug features enabled/disabled?
- Should they be in release builds?
- What's the debug key/activation method?

What debug tools do you want?"

### 7. Generate Cross-cutting Section

Based on the conversation, prepare the content:

````markdown
## Cross-cutting Concerns

These patterns apply to ALL systems and must be followed by every implementation.

### Error Handling

**Strategy:** {{error_strategy}}

**Error Levels:**
{{error_level_definitions}}

**Example:**

```{{language}}
{{error_handling_example}}
```
````

### Logging

**Format:** {{logging_format}}
**Destination:** {{log_destination}}

**Log Levels:**
{{log_level_usage}}

**Example:**

```{{language}}
{{logging_example}}
```

### Configuration

**Approach:** {{config_approach}}

**Configuration Structure:**
{{config_structure}}

### Event System

**Pattern:** {{event_pattern}}

**Event Naming:** {{naming_convention}}

**Example:**

```{{language}}
{{event_example}}
```

### Debug Tools

**Available Tools:**
{{debug_tool_list}}

**Activation:** {{how_to_enable}}

```

### 8. Present Content and Menu

Show the generated content to the user and present:

"I've documented all cross-cutting concerns.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 7]

**Validation Check:**
- Do these patterns cover all systems?
- Are the examples clear enough for AI agents?
- Any edge cases we missed?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into specific concerns
[P] Party Mode - Get perspectives on patterns
[C] Continue - Save this and move to Project Structure (Step 6 of 9)"

### 9. Handle Menu Selection

#### IF A (Advanced Elicitation):
- Execute {advancedElicitationTask} with the current content
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF P (Party Mode):
- Execute {partyModeWorkflow} with the current content
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF C (Continue):
- Append the final content to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [cross-cutting content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Error handling strategy defined with example
- Logging approach documented
- Configuration management established
- Event system pattern selected
- Debug tools identified
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5]

### SYSTEM FAILURE:

- Missing any cross-cutting concern
- No concrete examples provided
- Patterns too vague for AI agents to follow
- Not presenting A/P/C menu after documentation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
```
