---
last-redoc-date: 2025-09-28
---

# Brainstorming Session Workflow

## Overview

The brainstorming workflow facilitates interactive brainstorming sessions using diverse creative techniques. This workflow acts as an AI facilitator guiding users through various ideation methods to generate and refine creative solutions in a structured, energetic, and highly interactive manner.

## Key Features

- **36 Creative Techniques**: Comprehensive library spanning collaborative, structured, creative, deep, theatrical, wild, and introspective approaches
- **Interactive Facilitation**: AI acts as a skilled facilitator using "Yes, and..." methodology
- **Flexible Approach Selection**: User-guided, AI-recommended, random, or progressive technique flows
- **Context-Aware Sessions**: Supports domain-specific brainstorming through context document input
- **Systematic Organization**: Converges ideas into immediate opportunities, future innovations, and moonshots
- **Action Planning**: Prioritizes top ideas with concrete next steps and timelines
- **Session Documentation**: Comprehensive structured reports capturing all insights and outcomes

## Usage

### Basic Invocation

```bash
workflow brainstorming
```

### With Context Document

```bash
# Provide domain-specific context to guide the session
workflow brainstorming --data /path/to/context.md
```

### Configuration

The workflow leverages configuration from `/bmad/cis/config.yaml`:

- **output_folder**: Where session results are saved
- **user_name**: Session participant identification
- **brain_techniques**: CSV database of 36 creative techniques

## Workflow Structure

### Files Included

```
brainstorming/
├── workflow.yaml           # Configuration and metadata
├── instructions.md         # Step-by-step execution guide
├── template.md            # Session report structure
├── brain-methods.csv      # Database of 36 creative techniques
└── README.md              # This file
```

## Creative Techniques Library

The workflow includes 36 techniques organized into 7 categories:

### Collaborative Techniques

- **Yes And Building**: Build momentum through positive additions
- **Brain Writing Round Robin**: Silent idea generation with sequential building
- **Random Stimulation**: Use random catalysts for unexpected connections
- **Role Playing**: Generate solutions from multiple stakeholder perspectives

### Structured Approaches

- **SCAMPER Method**: Systematic creativity through seven lenses (Substitute/Combine/Adapt/Modify/Put/Eliminate/Reverse)
- **Six Thinking Hats**: Explore through six perspectives (facts/emotions/benefits/risks/creativity/process)
- **Mind Mapping**: Visual branching from central concepts
- **Resource Constraints**: Innovation through extreme limitations

### Creative Methods

- **What If Scenarios**: Explore radical possibilities by questioning constraints
- **Analogical Thinking**: Find solutions through domain parallels
- **Reversal Inversion**: Flip problems upside down for fresh angles
- **First Principles Thinking**: Strip away assumptions to rebuild from fundamentals
- **Forced Relationships**: Connect unrelated concepts for innovation
- **Time Shifting**: Explore solutions across different time periods
- **Metaphor Mapping**: Use extended metaphors as thinking tools

### Deep Analysis

- **Five Whys**: Drill down through causation layers to root causes
- **Morphological Analysis**: Systematically explore parameter combinations
- **Provocation Technique**: Extract useful ideas from absurd starting points
- **Assumption Reversal**: Challenge and flip core assumptions
- **Question Storming**: Generate questions before seeking answers

### Theatrical Approaches

- **Time Travel Talk Show**: Interview past/present/future selves
- **Alien Anthropologist**: Examine through completely foreign eyes
- **Dream Fusion Laboratory**: Start with impossible solutions, work backwards
- **Emotion Orchestra**: Let different emotions lead separate sessions
- **Parallel Universe Cafe**: Explore under alternative reality rules

### Wild Methods

- **Chaos Engineering**: Deliberately break things to discover robust solutions
- **Guerrilla Gardening Ideas**: Plant unexpected solutions in unlikely places
- **Pirate Code Brainstorm**: Take what works from anywhere and remix
- **Zombie Apocalypse Planning**: Design for extreme survival scenarios
- **Drunk History Retelling**: Explain with uninhibited simplicity

### Introspective Delight

- **Inner Child Conference**: Channel pure childhood curiosity
- **Shadow Work Mining**: Explore what you're avoiding or resisting
- **Values Archaeology**: Excavate deep personal values driving decisions
- **Future Self Interview**: Seek wisdom from your wiser future self
- **Body Wisdom Dialogue**: Let physical sensations guide ideation

## Workflow Process

### Phase 1: Session Setup (Step 1)

- Context gathering (topic, goals, constraints)
- Domain-specific guidance if context document provided
- Session scope definition (broad exploration vs. focused ideation)

### Phase 2: Approach Selection (Step 2)

- **User-Selected**: Browse and choose specific techniques
- **AI-Recommended**: Tailored technique suggestions based on context
- **Random Selection**: Surprise technique for creative breakthrough
- **Progressive Flow**: Multi-technique journey from broad to focused

### Phase 3: Interactive Facilitation (Step 3)

- Master facilitator approach using questions, not answers
- "Yes, and..." building methodology
- Energy monitoring and technique switching
- Real-time idea capture and momentum building
- Quantity over quality focus (aim: 100 ideas in 60 minutes)

### Phase 4: Convergent Organization (Step 4)

- Review and categorize all generated ideas
- Identify patterns and themes across techniques
- Sort into three priority buckets for action planning

### Phase 5: Insight Extraction (Step 5)

- Surface recurring themes across multiple techniques
- Identify key realizations and surprising connections
- Extract deeper patterns and meta-insights

### Phase 6: Action Planning (Step 6)

- Prioritize top 3 ideas for implementation
- Define concrete next steps for each priority
- Determine resource needs and realistic timelines

### Phase 7: Session Reflection (Step 7)

- Analyze what worked well and areas for further exploration
- Recommend follow-up techniques and next session planning
- Capture emergent questions for future investigation

### Phase 8: Report Generation (Step 8)

- Compile comprehensive structured report
- Calculate total ideas generated and techniques used
- Format all content for sharing and future reference

## Output

### Generated Files

- **Primary output**: Structured session report saved to `{output_folder}/brainstorming-session-results-{date}.md`
- **Context integration**: Links to previous brainstorming sessions if available

### Output Structure

1. **Executive Summary** - Topic, goals, techniques used, total ideas generated, key themes
2. **Technique Sessions** - Detailed capture of each technique's ideation process
3. **Idea Categorization** - Immediate opportunities, future innovations, moonshots, insights
4. **Action Planning** - Top 3 priorities with rationale, steps, resources, timelines
5. **Reflection and Follow-up** - Session analysis, recommendations, next steps planning

## Requirements

- No special software requirements
- Access to the CIS module configuration (`/bmad/cis/config.yaml`)
- Active participation and engagement throughout the interactive session
- Optional: Domain context document for focused brainstorming

## Best Practices

### Before Starting

1. **Define Clear Intent**: Know whether you want broad exploration or focused problem-solving
2. **Gather Context**: Prepare any relevant background documents or domain knowledge
3. **Set Time Expectations**: Plan for 45-90 minutes for a comprehensive session
4. **Create Open Environment**: Ensure distraction-free space for creative thinking

### During Execution

1. **Embrace Quantity**: Generate many ideas without self-censoring
2. **Build with "Yes, And"**: Accept and expand on ideas rather than judging
3. **Stay Curious**: Follow unexpected connections and tangents
4. **Trust the Process**: Let the facilitator guide you through technique transitions
5. **Capture Everything**: Document all ideas, even seemingly silly ones
6. **Monitor Energy**: Communicate when you need technique changes or breaks

### After Completion

1. **Review Within 24 Hours**: Re-read the report while insights are fresh
2. **Act on Quick Wins**: Implement immediate opportunities within one week
3. **Schedule Follow-ups**: Plan development sessions for promising concepts
4. **Share Selectively**: Distribute relevant insights to appropriate stakeholders

## Facilitation Principles

The AI facilitator operates using these core principles:

- **Ask, Don't Tell**: Use questions to draw out participant's own ideas
- **Build, Don't Judge**: Use "Yes, and..." methodology, never "No, but..."
- **Quantity Over Quality**: Aim for volume in generation phase
- **Defer Judgment**: Evaluation comes after generation is complete
- **Stay Curious**: Show genuine interest in participant's unique perspectives
- **Monitor Energy**: Adapt technique and pace to participant's engagement level

## Example Session Flow

### Progressive Technique Flow

1. **Mind Mapping** (10 min) - Build the landscape of possibilities
2. **SCAMPER** (15 min) - Systematic exploration of improvement angles
3. **Six Thinking Hats** (15 min) - Multiple perspectives on solutions
4. **Forced Relationships** (10 min) - Creative synthesis of unexpected connections

### Energy Checkpoints

- After 15-20 minutes: "Should we continue with this technique or try something new?"
- Before convergent phase: "Are you ready to start organizing ideas, or explore more?"
- During action planning: "How's your energy for the final planning phase?"

## Customization

To customize this workflow:

1. **Add New Techniques**: Extend `brain-methods.csv` with additional creative methods
2. **Modify Facilitation Style**: Adjust prompts in `instructions.md` for different energy levels
3. **Update Report Structure**: Modify `template.md` to include additional analysis sections
4. **Create Domain Variants**: Develop specialized technique sets for specific industries

## Version History

- **v1.0.0** - Initial release
  - 36 creative techniques across 7 categories
  - Interactive facilitation with energy monitoring
  - Comprehensive structured reporting
  - Context-aware session guidance

## Support

For issues or questions:

- Review technique descriptions in `brain-methods.csv` for facilitation guidance
- Consult the workflow instructions in `instructions.md` for step-by-step details
- Reference the template structure in `template.md` for output expectations
- Follow BMAD documentation standards for workflow customization

---

_Part of the BMad Method v5 - Creative Ideation and Synthesis (CIS) Module_
