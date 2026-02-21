# Novel Writing Suite (NWS) - BMAD Module

AI-powered novel writing framework with advanced text analysis, structured planning, and collaborative drafting.

## What Makes NWS Unique

**Text Analysis Engine**: The Librarian agent can analyze published novels to extract techniques, patterns, and craft insights you can apply to your own writing. This isn't about copying - it's about understanding *why* great writing works and learning those principles.

**Structured Novel Development**: From premise to finished manuscript, NWS guides you through:
1. **Discovery** (Sage) - Brainstorm and define your story
2. **Architecture** (Atlas) - Plan characters, plot, world
3. **Voice Design** (Muse) - Define how your story will be told
4. **Drafting** (Scribe) - Write scene by scene
5. **Revision** (Editor) - Polish and strengthen

**Learning Through Analysis**: Build a growing knowledge base of narrative techniques extracted from books you study.

## Quick Start

### Installation

From the `bmad-novel-suite` repository root (not `npx bmad-method install` — that uses the published package):

```bash
node tools/bmad-npx-wrapper.js install
```

Select **Novel Writing Suite**, your novel project directory, and your AI tool. See [INSTALL.md](INSTALL.md) for full details.

### First Steps (Claude Code)

**1. Analyze a book you admire**
```
/bmad-agent-nws-librarian
> Analyze uploaded text
[Upload a chapter or full novel]
```

You'll get:
- Structural breakdown (plot beats, pacing)
- Character technique analysis
- Prose style metrics
- Specific techniques to learn

**2. Start your novel planning**
```
/bmad-agent-nws-sage
> Create story brief
[Brainstorm your premise, conflict, themes]
```

**3. Develop your characters**
```
/bmad-agent-nws-atlas
> Create character profiles
[Design arcs, motivations, relationships]
```

**4. Build your plot**
```
/bmad-agent-nws-atlas
> Design plot structure
[Map to 3-Act, Hero's Journey, or other framework]
```

**5. Define your voice**
```
/bmad-agent-nws-muse
> Design narrative architecture
[POV, tense, style guidelines]
```

**6. Write**
```
/bmad-agent-nws-scribe
> Write chapter
[Draft following your architecture]
```

**7. Revise**
```
/bmad-agent-nws-editor
> Developmental edit
[Get feedback on structure, character, pacing]
```

## The Agents

### 📚 The Librarian (Text Analysis)
Your literary scholar who analyzes published works to extract techniques.

**Use for:**
- Studying how bestsellers in your genre work
- Learning specific techniques (dialogue, pacing, character)
- Building your craft knowledge
- Understanding genre conventions

**Key features:**
- Structural analysis (plot beats, act structure)
- Character arc dissection
- Prose metrics (sentence variety, dialogue ratio)
- Technique extraction with examples
- Genre convention analysis
- Persistent knowledge base

### 🔮 The Sage (Story Analyst)
Your creative consultant who helps discover your story's essence.

**Use for:**
- Brainstorming premises
- Identifying central conflict
- Exploring themes
- Risk analysis (what could go wrong)
- Defining audience

**Produces:** Story Brief document

### 🗺️ Atlas (Story Architect)
Your structural engineer who designs the blueprint.

**Use for:**
- Character profiles with arcs
- Plot structure and scene breakdown
- World-building specs
- Relationship mapping
- Pacing strategy

**Produces:** Character Profiles, Plot Outline, World-Building docs

### ✨ The Muse (Narrative Designer)
Your style guide who defines how the story is told.

**Use for:**
- POV strategy (first/third, single/multiple)
- Narrative voice definition
- Prose style guidelines
- Chapter structure templates
- Tense and consistency rules

**Produces:** Narrative Architecture document

### ✍️ The Scribe (Scene Writer)
Your writing partner who drafts with you.

**Use for:**
- Chapter/scene drafting
- Dialogue writing
- Action sequences
- Setting descriptions
- Continuity checking

**Produces:** Chapter drafts

### 📝 The Editor (Editorial Specialist)
Your manuscript critic at three levels.

**Use for:**
- Developmental editing (structure, character, pacing)
- Line editing (prose, sentences, word choice)
- Copy editing (grammar, consistency)
- Opening pages critique
- Pacing analysis

**Produces:** Critique reports with specific suggestions

## Workflows

- **analyze-text**: Deep analysis of uploaded novels
- **create-story-brief**: Foundational planning document
- **create-character-profiles**: Detailed character development
- **design-plot-structure**: Act-by-act outline
- **write-chapter**: Guided chapter drafting

## Document Structure

NWS creates this structure in your novel project:

```
my-novel/
├── docs/
│   ├── story-brief.md              # Core vision
│   ├── character-profiles.md       # Character sheets
│   ├── plot-outline.md             # Act/scene breakdown
│   ├── narrative-architecture.md   # Voice/style guide
│   └── world-building.md           # Setting details (if needed)
├── chapters/
│   ├── chapter-01.md
│   ├── chapter-02.md
│   └── ...
└── _bmad/
    ├── nws/
    │   ├── agents/                     # Compiled agent files
    │   ├── workflows/                  # Workflow definitions
    │   └── knowledge/                  # Writing craft reference
    └── _memory/
        └── librarian-sidecar/
            └── knowledge/              # Your analysis archive
                ├── analyzed-texts/     # Book analyses
                ├── technique-patterns/ # Extracted techniques
                └── genre-databases/    # Genre insights
```

## Learning Philosophy

NWS is designed around a key principle: **You learn to write by understanding craft, not by having AI write for you.**

### The Learning Cycle
1. **Analyze**: Study how published authors achieve effects
2. **Extract**: Identify specific techniques
3. **Practice**: Apply techniques in your writing
4. **Iterate**: Get feedback and improve

### Knowledge Base Growth
As you analyze more texts, your knowledge base grows:
- Technique library expands
- Genre understanding deepens
- Pattern recognition improves
- Your own craft develops

## Example Session

```
# Study a book you admire
/bmad-agent-nws-librarian
> analyze-text
[Upload "The Name of the Wind" Chapter 1]

# Librarian finds:
# - First person unreliable narrator techniques
# - Frame story structure
# - Prose rhythm (varied sentence length)
# - Character voice through word choice
# - Show vs tell balance in worldbuilding

# Apply to your novel
/bmad-agent-nws-scribe
> write-chapter 1
[Reference librarian's analysis of first person techniques]
[Apply: Character voice, prose rhythm, worldbuilding balance]

# Review what you wrote
/bmad-agent-nws-editor
> line-edit
[Get feedback on how well you applied those techniques]

# Repeat and improve
```

## Tips for Best Results

### Text Analysis
- Analyze full chapters, not fragments
- Focus on books in your target genre
- Compare multiple authors' approaches
- Build analysis library over time

### Planning
- Complete story brief before architecture
- Reference analyses when making structure choices
- Don't over-plan - leave room for discovery
- Update documents as story evolves

### Writing
- Write imperfect first drafts
- Reference character profiles for consistency
- Follow narrative architecture for voice
- Track continuity as you go

### Revision
- Big-picture edits first (developmental)
- Then prose level (line editing)
- Finally technical (copy editing)
- Consider multiple draft passes

## Integration with BMAD Method

NWS works within the BMAD ecosystem:

### Party Mode
Bring multiple agents into one session:
```
/bmad-party-mode
[Select nws agents to collaborate on planning]
```

### BMAD Help
```
/bmad-help
[Get guidance on which agent/workflow to use]
```

### Custom Extensions
Use BMad Builder to create:
- Genre-specific agents
- Custom workflows
- Additional analysis tools

## Advanced Features

### Persistent Knowledge
Librarian's sidecar stores all analyses permanently. Your craft library grows with every book you study.

### Cross-Reference
Agents reference each other's work:
- Scribe follows Atlas's plot outline
- Muse uses genre conventions from Librarian
- Editor checks against narrative architecture

### Technique Application
When Librarian identifies a technique, you can immediately:
1. Generate practice exercises
2. Apply to your current chapter
3. Create a writing experiment
4. Add to your personal style guide

## Comparison: NWS vs Just Using Claude

**Just Claude:**
- One-off conversations
- No persistent knowledge
- Generic writing advice
- You prompt from scratch each time

**NWS:**
- Structured workflow across full novel
- Growing knowledge base from analyses
- Genre-specific guidance
- Agents remember your story architecture
- Specialized personas for different tasks
- Systematic craft development

## Roadmap

Planned features:
- Automated continuity tracking
- Character relationship graphs
- Timeline visualization
- Pacing heat maps
- Style consistency checker
- Comparative draft analysis
- Agent "memories" of previous sessions

## Credits

Built on the BMAD Method framework by @bmadcode.

NWS created for authors who want to learn craft while writing, not just generate text.

## License

MIT License - Free and open source

---

**Start writing better by understanding how great writing works.**
