# Peers Advisory Group Module

A structured advisory consultation module for the BMAD-METHOD framework that helps users deeply analyze complex decision-making problems through multi-round questioning and feedback from top business leaders.

## Overview

The Peers Advisory Group module provides a rigorous 8-step consultation process, channeling wisdom from four legendary business leaders (Warren Buffett, Bill Gates, Elon Musk, Steve Jobs) to help users:

- Uncover root causes hidden beneath surface symptoms
- Challenge limiting assumptions and beliefs
- Explore blind spots through diverse perspectives
- Generate actionable solutions grounded in proven experience

## Features

- ✅ **8-Step Structured Process**: From problem confirmation to action commitments
- ✅ **4 Legendary Advisors**: Default panel of Buffett, Gates, Musk, Jobs (customizable)
- ✅ **Progressive Questioning**: Three rounds that gradually deepen inquiry
- ✅ **Actionable Recommendations**: Specific, executable advice from each advisor
- ✅ **Beautiful Reports**: Optional magazine-style HTML summary

## Use Cases

- 🎯 **Career Decisions**: Job changes, career pivots, entrepreneurship
- 🎯 **Business Strategy**: Market entry, product direction, fundraising
- 🎯 **Complex Relationships**: Team conflicts, partnership issues
- 🎯 **Personal Growth**: Skill gaps, mindset challenges, life transitions

## Quick Start

### 1. Install Module

```bash
npx bmad-method install
# Select "Peers Advisory Group" from the module list
```

### 2. Start Advisory Session

In your IDE, invoke the Advisory Facilitator agent:

```
/facilitator SA
```

Or use fuzzy matching:

```
/facilitator start advisory
```

### 3. Complete the Process

Follow the 8-step process:

1. **Confirm Issue** - Clarify your problem and expected outcomes
2. **Round 1 Questions** - 8 foundational questions (2 per advisor)
3. **Round 2 Questions** - Challenging black hat questions
4. **Round 3 Questions** - Divergent exploration questions
5. **Your Questions** - Ask advisors for clarification
6. **Advisor Feedback** - Receive complete recommendations
7. **Your Summary** - Commit to specific actions with deadlines
8. **Advisor Reflections** - Deep insights on growth direction

## Module Structure

```
peers-advisory/
├── module.yaml                       # Module configuration
├── agents/
│   └── facilitator.agent.yaml        # Advisory Facilitator agent
├── workflows/
│   └── advisory-session/
│       ├── workflow.md               # Main workflow definition
│       ├── session-record.template.md # Session record template
│       ├── steps/                    # 8 step files
│       │   ├── step-01-confirm-issue.md
│       │   ├── step-02-round-1.md
│       │   ├── step-03-round-2.md
│       │   ├── step-04-round-3.md
│       │   ├── step-05-client-questions.md
│       │   ├── step-06-advisor-feedback.md
│       │   ├── step-07-client-summary.md
│       │   └── step-08-advisor-reflect.md
│       └── templates/
│           ├── feedback-format.md
│           ├── reflection-format.md
│           └── magazine-report-guide.md
├── data/
│   └── advisors/
│       └── default-advisors.md       # Default advisor profiles
└── README.md                         # This file
```

## Configuration Options

### Module Configuration

Edit `{project-root}/_bmad/pag/config.yaml` to customize:

| Option | Description | Default |
|--------|-------------|---------|
| `default_advisors` | Use default panel or custom | `yes` |
| `session_output_folder` | Where session records are saved | `{output_folder}/advisory-sessions` |
| `communication_language` | Session language | `en-US` |
| `generate_magazine_report` | Auto-generate HTML report | `ask` |

### Custom Advisors

To use custom advisors:

1. In Step 01, choose "Custom Panel"
2. Specify 1-4 notable figures
3. System generates advisor profiles automatically
4. Confirm profiles before continuing

Example custom advisors:
- Oprah Winfrey, Jeff Bezos, Angela Merkel, Richard Branson
- Ray Dalio, Satya Nadella, Mary Barra, Jensen Huang

## Output Files

### Session Record
- **Location**: `{session_output_folder}/session-YYYY-MM-DD.md`
- **Format**: Markdown with YAML frontmatter
- **Content**: Complete dialogue transcript, all Q&A, recommendations, commitments

### Magazine Report (Optional)
- **Location**: `{session_output_folder}/report-YYYY-MM-DD.html`
- **Format**: Printable HTML
- **Content**: Formatted summary with visual design, advisor-specific color coding

## Workflow Philosophy

### Core Principles

1. **Empathy First**: Accept that the client's feelings are their reality
2. **Rigorous Process**: Strictly follow the 8-step sequence
3. **One Question at a Time**: Wait for responses before continuing
4. **Actionable Advice**: All suggestions must be specific and executable
5. **Character Consistency**: Maintain each advisor's unique voice

### Question Progression

**Round 1 (Foundational)**: Understand the basics
- What are the facts and context?
- Who's involved and affected?
- What are the constraints?

**Round 2 (Black Hat)**: Challenge assumptions
- What are you not seeing?
- Could YOU be the problem?
- What are you avoiding?

**Round 3 (Divergent)**: Explore unexpected angles
- Break mental patterns
- Reveal unconscious beliefs
- Find hidden connections

## Integration with BMAD

### Standalone Operation

The Peers Advisory Group module operates independently:
- ✅ No dependencies on other BMAD modules
- ✅ Can be used for any advisory consultation
- ✅ Works with all BMAD-supported IDEs

### Complementary Use Cases

Pairs well with:
- **BMM (BMad Method)**: Use advisory session before planning epics
- **Creative Suite**: Combine with brainstorming for ideation + validation
- **Core Workflows**: Run advisory on complex project decisions

## Best Practices

### Before the Session

1. **Prepare Your Issue**: Write a brief summary beforehand
2. **Gather Context**: Collect relevant data, timelines, stakeholder info
3. **Block Time**: Reserve 60-90 uninterrupted minutes
4. **Set Intention**: Be open to uncomfortable truths

### During the Session

1. **Answer Honestly**: Quality advice requires accurate information
2. **Don't Rush**: Take time with challenging questions
3. **Stay Present**: Resist the urge to defend or justify
4. **Take Notes**: Beyond the transcript, capture your reactions

### After the Session

1. **Act Within 48 Hours**: Start your first commitment immediately
2. **Share Commitments**: Tell someone who will hold you accountable
3. **Set Reminders**: Calendar your deadline dates
4. **Revisit in 30 Days**: Review the session record and assess progress

## Advanced Features

### Resume Interrupted Sessions

If a session is interrupted:

```
/facilitator RS
```

The facilitator will:
- Load your most recent session file
- Check the `currentStep` from frontmatter
- Resume from that exact step

### Review Advisor Profiles

To review default advisor profiles:

```
/facilitator LA
```

### Multiple Sessions

You can run multiple advisory sessions:
- Each creates a new dated session file
- Previous sessions remain available for reference
- Compare insights across different problems

## Troubleshooting

### Common Issues

**Problem**: Advisor responses feel generic
- **Solution**: Provide more context in your answers
- **Solution**: Review `data/advisors/default-advisors.md` for character traits

**Problem**: Questions don't relate to my situation
- **Solution**: Use custom advisors more relevant to your domain
- **Solution**: Provide clearer problem context in Step 01

**Problem**: Can't resume session
- **Solution**: Check that session file exists in `session_output_folder`
- **Solution**: Verify YAML frontmatter shows `currentStep` value

### Getting Help

- **Issues**: [BMAD-METHOD GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- **Discussions**: [BMAD-METHOD Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions)
- **Documentation**: `/docs/` in BMAD-METHOD repository

## Contributing

Contributions are welcome! Areas where you can help:

- Additional advisor profiles (historical figures, industry leaders)
- Translations to other languages
- Enhanced magazine report templates
- Improved questioning strategies
- Integration examples

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Credits

### Inspiration

This module adapts the "Peers Advisory Group" (私董会) methodology, a structured consultation format used in executive coaching and leadership development.

### BMAD Framework

Built for the [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) framework, an open-source AI-driven agile development system.

## License

MIT License - Same as BMAD-METHOD

---

## Example Session Flow

```
You: /facilitator SA

Facilitator: Hello, I'm your Peers Advisory Group facilitator...
[Asks about your problem]

You: I'm considering leaving my current company to start my own business,
but I'm not sure if it's the right time...

Facilitator: [Confirms understanding, asks clarifying questions]

Facilitator: Now we need to configure your advisor panel...

You: Let's use the default panel.

Facilitator: Excellent. Round 1 begins...

Warren Buffett asks: "Let's start with the basics - if you had to explain
this problem to your grandmother, how would you describe what's really at
stake here?"

You: [Answers...]

[Session continues through all 8 steps]

Facilitator: ✅ Advisory Session Complete
Your commitments:
1. Calculate 6-month runway by Friday
2. Interview 3 potential co-founders by end of month
3. Make go/no-go decision by March 15

Would you like me to generate a magazine-style report?

You: Yes

Facilitator: Report generated at:
/advisory-sessions/report-2025-01-23.html
```

---

**Ready to get started?**

```
/facilitator SA
```

Let's solve your most pressing challenge.
