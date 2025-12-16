# Expert Agent Architecture

Domain-specific agents with persistent memory, sidecar files, and restricted access patterns.

## When to Use

- Personal assistants (journal keeper, diary companion)
- Specialized domain experts (legal advisor, medical reference)
- Agents that need to remember past interactions
- Agents with restricted file system access (privacy/security)
- Long-term relationship agents that learn about users

## File Structure

```
{agent-name}/
├── {agent-name}.agent.yaml    # Main agent definition
└── {agent-name}-sidecar/      # Supporting files
    ├── instructions.md        # Private directives
    ├── memories.md            # Persistent memory
    ├── knowledge/             # Domain-specific resources
    │   └── README.md
    └── [custom files]         # Agent-specific resources
```

## YAML Structure

```yaml
agent:
  metadata:
    name: 'Persona Name'
    title: 'Agent Title'
    icon: 'emoji'
    type: 'expert'

  persona:
    role: 'Domain Expert with specialized capability'

    identity: |
      Background and expertise in first-person voice.
      {{#if user_preference}}
      Customization based on install_config.
      {{/if}}

    communication_style: |
      {{#if tone_style == "gentle"}}
      Gentle and supportive communication...
      {{/if}}
      {{#if tone_style == "direct"}}
      Direct and efficient communication...
      {{/if}}
      I reference past conversations naturally.

    principles:
      - Core belief about the domain
      - How I handle user information
      - My approach to memory and learning

  critical_actions:
    - 'Load COMPLETE file ./{agent-name}-sidecar/memories.md and remember all past insights'
    - 'Load COMPLETE file ./{agent-name}-sidecar/instructions.md and follow ALL protocols'
    - 'ONLY read/write files in ./{agent-name}-sidecar/ - this is our private space'
    - 'Address user as {{greeting_name}}'
    - 'Track patterns, themes, and important moments'
    - 'Reference past interactions naturally to show continuity'

  prompts:
    - id: main-function
      content: |
        <instructions>
        Guide user through the primary function.
        {{#if tone_style == "gentle"}}
        Use gentle, supportive approach.
        {{/if}}
        </instructions>

        <process>
        1. Understand context
        2. Provide guidance
        3. Record insights
        </process>

    - id: memory-recall
      content: |
        <instructions>
        Access and share relevant memories.
        </instructions>

        Reference stored information naturally.

  menu:
    - trigger: action1
      action: '#main-function'
      description: 'Primary agent function'

    - trigger: remember
      action: 'Update ./{agent-name}-sidecar/memories.md with session insights'
      description: 'Save what we discussed today'

    - trigger: insight
      action: 'Document breakthrough in ./{agent-name}-sidecar/breakthroughs.md'
      description: 'Record a significant insight'

    - multi: "[DF] Do Foo or start [CH] Chat with expert"
      triggers:
        - do-foo
            - input: [DF] or fuzzy match on do foo
            - action: '#main-action'
            - data: what is being discussed or suggested with the command, along with custom party custom agents if specified
            - type: action
        - expert-chat:
            - input: [CH] or fuzzy match validate agent
            - action: agent responds as expert based on its persona to converse
            - type: action

  install_config:
    compile_time_only: true
    description: 'Personalize your expert agent'
    questions:
      - var: greeting_name
        prompt: 'What should the agent call you?'
        type: text
        default: 'friend'

      - var: tone_style
        prompt: 'Preferred communication tone?'
        type: choice
        options:
          - label: 'Gentle - Supportive and nurturing'
            value: 'gentle'
          - label: 'Direct - Clear and efficient'
            value: 'direct'
        default: 'gentle'

      - var: user_preference
        prompt: 'Enable personalized features?'
        type: boolean
        default: true
```

## Key Components

### Sidecar Files (CRITICAL)

Expert agents use companion files for persistence and domain knowledge:

**memories.md** - Persistent user context

```markdown
# Agent Memory Bank

## User Preferences

<!-- Learned from interactions -->

## Session History

<!-- Important moments and insights -->

## Personal Notes

<!-- Agent observations -->
```

**instructions.md** - Private directives

```markdown
# Agent Private Instructions

## Core Directives

- Maintain character consistency
- Domain boundaries: {specific domain}
- Access restrictions: Only sidecar folder

## Special Rules

<!-- Agent-specific protocols -->
```

**knowledge/** - Domain resources

```markdown
# Agent Knowledge Base

Add domain-specific documentation here.
```

### Critical Actions

**MANDATORY for expert agents** - These load sidecar files at activation:

```yaml
critical_actions:
  - 'Load COMPLETE file ./{sidecar}/memories.md and remember all past insights'
  - 'Load COMPLETE file ./{sidecar}/instructions.md and follow ALL protocols'
  - 'ONLY read/write files in ./{sidecar}/ - this is our private space'
```

**Key patterns:**

- **COMPLETE file loading** - Forces full file read, not partial
- **Domain restrictions** - Limits file access for privacy/security
- **Memory integration** - Past context becomes part of current session
- **Protocol adherence** - Ensures consistent behavior

## What Gets Injected at Compile Time

Same as simple agents, PLUS:

1. **Critical actions become numbered activation steps**

   ```xml
   <step n="4">Load COMPLETE file ./memories.md...</step>
   <step n="5">Load COMPLETE file ./instructions.md...</step>
   <step n="6">ONLY read/write files in ./...</step>
   ```

2. **Sidecar files copied during installation**
   - Entire sidecar folder structure preserved
   - Relative paths maintained
   - Files ready for agent use

## Reference Example

See: `bmb/reference/agents/expert-examples/journal-keeper/`

Features demonstrated:

- Complete sidecar structure (memories, instructions, breakthroughs)
- Critical actions for loading persistent context
- Domain restrictions for privacy
- Pattern recognition and memory recall
- Handlebars-based personalization
- Menu actions that update sidecar files

## Installation

```bash
# Copy entire folder to your project
cp -r /path/to/journal-keeper/ _bmad/custom/agents/

# Install with personalization
bmad agent-install
```

The installer:

1. Detects expert agent (folder with .agent.yaml)
2. Prompts for personalization
3. Compiles agent YAML to XML-in-markdown
4. **Copies sidecar files to installation target**
5. Creates IDE slash commands
6. Saves source for reinstallation

## Memory Patterns

### Accumulative Memory

```yaml
menu:
  - trigger: save
    action: "Update ./sidecar/memories.md with today's session insights"
    description: 'Save session to memory'
```

### Reference Memory

```yaml
prompts:
  - id: recall
    content: |
      <instructions>
      Reference memories.md naturally:
      "Last week you mentioned..." or "I notice a pattern..."
      </instructions>
```

### Structured Insights

```yaml
menu:
  - trigger: insight
    action: 'Document in ./sidecar/breakthroughs.md with date, context, significance'
    description: 'Record meaningful insight'
```

## Domain Restriction Patterns

### Single Folder Access

```yaml
critical_actions:
  - 'ONLY read/write files in ./sidecar/ - NO OTHER FOLDERS'
```

### User Space Access

```yaml
critical_actions:
  - 'ONLY access files in {user-folder}/journals/ - private space'
```

### Read-Only Access

```yaml
critical_actions:
  - 'Load knowledge from ./knowledge/ but NEVER modify'
  - 'Write ONLY to ./sessions/'
```

## Best Practices

1. **Load sidecar files in critical_actions** - Must be explicit and MANDATORY
2. **Enforce domain restrictions** - Clear boundaries prevent scope creep
3. **Use \_bmad/\_memory/[agentname]-sidcar/ paths** - For reference to any sidecar content
4. **Design for memory growth** - Structure sidecar files for accumulation
5. **Reference past naturally** - Don't dump memory, weave it into conversation
6. **Separate concerns** - Memories, instructions, knowledge in distinct files
7. **Include privacy features** - Users trust expert agents with personal data

## Common Patterns

### Session Continuity

```yaml
communication_style: |
  I reference past conversations naturally:
  "Last time we discussed..." or "I've noticed over the weeks..."
```

### Pattern Recognition

```yaml
critical_actions:
  - 'Track mood patterns, recurring themes, and breakthrough moments'
  - 'Cross-reference current session with historical patterns'
```

### Adaptive Responses

```yaml
identity: |
  I learn your preferences and adapt my approach over time.
  {{#if track_preferences}}
  I maintain notes about what works best for you.
  {{/if}}
```

## Validation Checklist

- [ ] Valid YAML syntax
- [ ] Metadata includes `type: "expert"`
- [ ] critical_actions loads sidecar files explicitly
- [ ] critical_actions enforces domain restrictions
- [ ] Sidecar folder structure created and populated
- [ ] memories.md has clear section structure
- [ ] instructions.md contains core directives
- [ ] Menu actions reference \_bmad/\_memory/[agentname]-sidcar/ correctly if needing sidecar content reference
- [ ] File paths use \_bmad/\_memory/[agentname]-sidcar/ to reference where the file will be after sidecar content is installed
- [ ] Install config personalizes sidecar references
- [ ] Agent folder named consistently: `{agent-name}/`
- [ ] YAML file named: `{agent-name}.agent.yaml`
- [ ] Sidecar folder named: `{agent-name}-sidecar/`
