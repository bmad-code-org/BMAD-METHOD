---
name: 'step-07-patterns'
description: 'Design implementation patterns and novel architectural patterns for consistency'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-07-patterns.md'
nextStepFile: './step-08-validation.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'

# Knowledge Bases
patternCategories: '{workflow_path}/pattern-categories.csv'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Implementation Patterns

**Progress: Step 7 of 9** - Next: Validation

## STEP GOAL:

Define implementation patterns that ensure multiple AI agents write compatible, consistent code. Also identify and design any novel patterns needed for unique game features.

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
- Implementation patterns prevent agent conflicts
- Novel patterns require creative collaboration

### Step-Specific Rules:

- Every pattern needs a concrete example
- Focus on what agents could decide DIFFERENTLY
- Novel patterns need full design documentation

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after patterns defined
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore alternative patterns
- **P (Party Mode)**: Get perspectives on patterns
- **C (Continue)**: Confirm patterns and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Identify Novel Patterns Needed

"First, let's identify if your game needs any custom architectural patterns.

**Novel patterns are needed when:**

- Standard patterns don't fit your gameplay
- You have unique mechanics not found in other games
- Multiple systems interact in non-standard ways

**From your GDD, I identified these potentially novel concepts:**
{{list_of_unique_features}}

Do any of these need custom architectural patterns?"

### 2. Design Novel Patterns (if needed)

**For each novel pattern:**

"**Novel Pattern: {{pattern_name}}**

Let's design this pattern together.

**The challenge:** {{what_makes_this_unique}}

**Questions to answer:**

1. What components are involved?
2. How do they communicate?
3. What's the data flow?
4. How is state managed?
5. What are the edge cases?

Walk me through how you envision {{pattern_name}} working."

**After user explains:**

"Based on your description, here's the pattern design:

**{{pattern_name}} Pattern**

**Components:**
{{component_list_with_responsibilities}}

**Data Flow:**
{{sequence_or_diagram}}

**State Management:**
{{state_approach}}

**Example Usage:**

```{{language}}
{{code_example}}
```

Does this capture your vision?"

### 3. Define Standard Implementation Patterns

"Now let's define standard implementation patterns for consistency.

**These patterns ensure all AI agents:**

- Name things the same way
- Structure code identically
- Handle common situations consistently

Let's go through each category."

### 4. Component Communication Pattern

"**Component Communication**

How should game objects communicate?

**Options:**

- **Direct references** - Simple but coupled
- **Event-based** - Decoupled but indirect
- **Service locator** - Central registry
- **Dependency injection** - Explicit dependencies

For game systems, what's your preferred approach?"

### 5. Entity Creation Pattern

"**Entity Creation**

How should game entities (enemies, items, etc.) be created?

**Options:**

- **Factory pattern** - Centralized creation
- **Prefab instantiation** - Engine-native
- **Object pooling** - Performance-focused
- **Builder pattern** - Complex configuration

What's your entity creation approach?"

### 6. State Transition Pattern

"**State Transitions**

How should entities handle state changes?

**Options:**

- **State machine** - Explicit states and transitions
- **Behavior tree** - AI-focused hierarchy
- **Blackboard** - Shared data approach
- **Flag-based** - Simple boolean states

What state management pattern for entities?"

### 7. Data Access Pattern

"**Data Access**

How should systems access game data?

**Options:**

- **Direct file access** - Simple but scattered
- **Data manager** - Centralized access
- **Scriptable objects** - Engine-native (Unity)
- **Resources/Autoload** - Engine-native (Godot)

How should data be accessed?"

### 8. Generate Patterns Section

Based on the conversation, prepare the content:

````markdown
## Implementation Patterns

These patterns ensure consistent implementation across all AI agents.

{{if_novel_patterns}}

### Novel Patterns

#### {{novel_pattern_name}}

**Purpose:** {{what_it_solves}}

**Components:**
{{component_list}}

**Data Flow:**
{{flow_description}}

**Implementation Guide:**

```{{language}}
{{implementation_example}}
```
````

**Usage:**
{{when_to_use}}
{{/if_novel_patterns}}

### Communication Patterns

**Pattern:** {{communication_pattern}}

**Example:**

```{{language}}
{{communication_example}}
```

### Entity Patterns

**Creation:** {{creation_pattern}}

**Example:**

```{{language}}
{{creation_example}}
```

### State Patterns

**Pattern:** {{state_pattern}}

**Example:**

```{{language}}
{{state_example}}
```

### Data Patterns

**Access:** {{data_pattern}}

**Example:**

```{{language}}
{{data_example}}
```

### Consistency Rules

| Pattern | Convention | Enforcement |
| ------- | ---------- | ----------- |

{{consistency_rules_table}}

```

### 9. Present Content and Menu

Show the generated content to the user and present:

"I've documented all implementation patterns.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 8]

**Patterns Defined:**
- {{count}} standard patterns
- {{novel_count}} novel patterns

**Validation Check:**
- Are examples clear enough for AI agents?
- Do patterns cover all major coding scenarios?
- Are novel patterns fully documented?

**Select an Option:**
[A] Advanced Elicitation - Explore alternative patterns
[P] Party Mode - Get perspectives on patterns
[C] Continue - Save this and move to Validation (Step 8 of 9)"

### 10. Handle Menu Selection

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [patterns content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Novel patterns identified and designed
- Standard patterns selected with examples
- Every pattern has concrete code examples
- Consistency rules documented
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7]

### SYSTEM FAILURE:

- Patterns without concrete examples
- Novel patterns missing design documentation
- Vague patterns that allow inconsistency
- Not presenting A/P/C menu after patterns
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
```
