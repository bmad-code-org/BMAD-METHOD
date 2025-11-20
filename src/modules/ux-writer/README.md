# UX Writer - Interface Copy & Microcopy Specialist

A comprehensive UX writing module for BMad Method providing AI-powered tools for creating, analyzing, and improving interface copy (microcopy) using the research-backed Four Quality Standards framework.

## Table of Contents

- [Overview](#overview)
- [The Four Quality Standards](#the-four-quality-standards)
- [Features](#features)
- [Agent Overview](#agent-overview)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [Module Structure](#module-structure)
- [Best Practices](#best-practices)

## Overview

The UX Writer module transforms interface copy creation with a systematic, evidence-based approach. Based on the [ux-writing-skill](https://github.com/content-designer/ux-writing-skill) by Christopher Greer (Stripe Staff Content Designer), this module brings UX writing best practices into the BMad Method framework.

### What is UX Writing?

UX writing (also called microcopy or interface copy) is the text users see and interact with in digital products:
- Buttons and links
- Error messages and warnings
- Success confirmations
- Empty states
- Form labels and instructions
- Notifications and alerts
- Onboarding flows
- Help text and tooltips

Good UX writing helps users accomplish their goals quickly and confidently.

## The Four Quality Standards

Every piece of interface copy is evaluated against four measurable standards:

### 1. **Purposeful** (Helps users/business achieve goals)
- Clear user benefit
- Addresses user concerns
- Advances objectives
- **Example:** "Download pricing guide" (clear action + benefit) vs. "Click here" (vague)

### 2. **Concise** (Fewest words without losing meaning)
- No wasted words
- Front-loaded information
- Meets research benchmarks
- **Example:** "We're processing your request" (4 words) vs. "Your request has been received and is currently being processed" (10 words)

### 3. **Conversational** (Natural and human, not robotic)
- Active voice (85% target)
- Natural language
- Human tone
- **Example:** "We couldn't save your changes" (natural) vs. "An error has occurred" (robotic)

### 4. **Clear** (Unambiguous and easy to understand)
- Specific verbs
- Appropriate reading level
- Consistent terminology
- **Example:** "Email must include @" (specific) vs. "Invalid email" (vague)

### Scoring System

Each standard is scored 0-10:
- **9-10**: Excellent - Ship it
- **8-8.9**: Very Good - Minor tweaks only
- **7-7.9**: Good - Consider improvements
- **6-6.9**: Adequate - Needs work
- **Below 6**: Poor - Requires significant revision

**Overall Score** = Average of all four standards

## Features

### Core Capabilities

**Analyze Existing Text**
- Score against Four Quality Standards
- Identify specific issues
- Provide improvement recommendations
- Check accessibility compliance

**Create New Interface Copy**
- Pattern-based creation (buttons, errors, empty states, etc.)
- Context-aware tone adaptation
- Multiple variations
- Built-in quality validation

**Improve Existing Copy**
- Before/after comparisons
- Detailed scoring improvements
- Explain what changed and why
- Alternative variations

**Content Audits**
- Evaluate multiple pieces of text
- Consistency checking
- Pattern compliance
- Accessibility validation

**Voice & Tone**
- Create product voice charts
- Tone adaptation guidance
- Voice consistency checking
- Brand voice documentation

### Quality Assurance

- **Research-Backed Benchmarks**: Sentence length, word count, reading level
- **Accessibility Compliance**: WCAG AA standards, screen reader optimization
- **Pattern Library**: Best practices for common UI elements
- **Objective Scoring**: Measurable quality metrics

### Research-Backed Benchmarks

**Comprehension Rates:**
- 8 words or fewer: 100% comprehension
- 14 words or fewer: 90% comprehension

**Reading Levels:**
- General audience: 7th-8th grade
- Professional tools: 9th-10th grade
- Technical products: 10th-11th grade

**UI Element Benchmarks:**
- Buttons: 2-4 words ideal, 6 maximum
- Error messages: 12-18 words
- Titles: 3-6 words, 40 characters max
- Active voice target: 85% of content

## Agent Overview

### Alex - UX Writing Specialist

Your AI UX writing expert who helps create clear, user-centered interface copy.

**Expertise:**
- Interface copy for all UI patterns
- Four Quality Standards framework
- Accessibility compliance
- Research-backed best practices
- Tone adaptation
- Voice consistency

**Key Commands:**

- `*help` - Show all available commands
- `*analyze` - Analyze existing text with quality scoring
- `*create` - Create new interface copy for specific patterns
- `*improve` - Improve existing copy with before/after comparison
- `*audit` - Audit multiple pieces for consistency
- `*patterns` - Browse UX text patterns library
- `*voice` - Create or refine product voice chart
- `*accessibility` - Check accessibility compliance
- `*score` - Score against research benchmarks
- `*brainstorm` - Generate multiple variations
- `*elicit` - Interactive context gathering session

## Quick Start

### Installation

The UX Writer module is installed as part of the BMad Method installation process:

```bash
npx bmad-method@alpha install
```

During installation, you'll configure:
- UX content output folder
- Target audience (general, professional, technical, specialized)
- Reading level target (7th-12th grade)
- Quality score threshold (7-9/10)
- Tone adaptation approach
- Accessibility focus level
- Primary content types

### First Steps

**1. Load the Agent**
```
Load UX Writer (Alex) in your IDE
```

**2. Start with Analysis**
```
*analyze

[Agent will guide you through analyzing existing interface copy]
```

**3. Or Create New Copy**
```
*create

[Agent will help you create new interface copy with pattern selection]
```

**4. Or Just Ask**
```
"Help me write an error message for when file upload fails"
"Review this button text: 'Click here to submit'"
"Create empty state copy for an inbox with no messages"
```

## Use Cases

### 🔍 Review Existing Interface Copy

**Scenario:** You have interface text that feels off but aren't sure why

**Recommended Path:**
1. Load UX Writer agent
2. Use `*analyze` command
3. Get objective scoring against four standards
4. Receive specific improvement recommendations

**Example:**
```
User: *analyze
Agent: "Please share the interface text you'd like me to analyze."
User: "An error has occurred while processing your request"
Agent: [Provides detailed analysis with scores]
- Purposeful: 2/10
- Concise: 3/10
- Conversational: 2/10
- Clear: 2/10
- Overall: 2.25/10

Recommended: "We couldn't process your request. Try again or contact support."
- New overall: 8.5/10
```

### ✍️ Create New Interface Copy

**Scenario:** Writing error messages, buttons, or empty states from scratch

**Recommended Path:**
1. Use `*create` command
2. Select pattern type (button, error, empty state, etc.)
3. Provide context about user scenario
4. Receive multiple variations with scoring

**Example:**
```
User: "Help me write an error for when file is too large"
Agent: [Creates multiple options]

Option 1: "Upload failed. File is too large. Choose a file under 10MB."
- Overall: 9.25/10

Option 2: "File too large. Please upload under 10MB."
- Overall: 8.75/10 (more concise)

Option 3: "We couldn't upload your file because it's too large..."
- Overall: 8.5/10 (more empathetic)
```

### 🔄 Improve Existing Copy

**Scenario:** Interface text works but could be better

**Recommended Path:**
1. Use `*improve` command
2. Share current text and context
3. Get before/after comparison with detailed analysis
4. See multiple alternative improvements

### 🎨 Establish Product Voice

**Scenario:** Need to document and maintain consistent brand voice

**Recommended Path:**
1. Use `*voice` command
2. Interactive session to define voice characteristics
3. Create voice chart with examples
4. Use for training and consistency checking

### 📊 Content Audit

**Scenario:** Reviewing multiple screens or an entire flow

**Recommended Path:**
1. Use `*audit` command
2. Submit multiple pieces of interface copy
3. Get consistency analysis
4. Receive prioritized improvement list

## Module Structure

```
ux-writer/
├── agents/
│   └── ux-writer.md                    # Alex - UX Writing Specialist
├── tasks/
│   ├── analyze-ux-text.md              # Analyze with Four Standards scoring
│   ├── create-ux-text.md               # Create new interface copy
│   ├── improve-ux-text.md              # Improve with before/after
│   ├── audit-content.md                # Multi-piece consistency audit
│   ├── check-accessibility.md          # Accessibility validation
│   ├── create-voice-chart.md           # Voice chart creation
│   ├── score-benchmarks.md             # Research benchmark scoring
│   ├── pattern-library.md              # Pattern browsing and application
│   ├── brainstorm-variations.md        # Multiple option generation
│   └── context-elicitation.md          # Context gathering
├── templates/
│   ├── error-message-template.md       # Error message creation guide
│   ├── empty-state-template.md         # Empty state design guide
│   ├── onboarding-flow-template.md     # Onboarding flow framework
│   ├── voice-chart-template.md         # Voice documentation template
│   └── quality-scorecard.md            # Quality evaluation scorecard
├── data/
│   ├── four-quality-standards.md       # Complete framework documentation
│   ├── ux-writing-benchmarks.md        # Research-backed metrics
│   ├── patterns-detailed.md            # Pattern library with examples
│   ├── accessibility-guidelines.md     # Accessibility best practices
│   ├── content-usability-checklist.md  # Usability evaluation
│   └── real-world-improvements.md      # Before/after examples
├── _module-installer/
│   └── install-config.yaml             # Module configuration
└── README.md                           # This file
```

## Best Practices

### For All Interface Copy

1. **Start with Purpose** - What should the user understand or do?
2. **Front-Load Key Info** - Most important words first
3. **Read Aloud** - If it sounds awkward, it likely is
4. **Check Benchmarks** - Word count, character limits, reading level
5. **Test Comprehension** - Can user understand in 2 seconds?

### Pattern-Specific Guidelines

**Buttons:**
- Use imperative verb + object: "Save changes" not "Save"
- Be specific: "Delete account" not "Delete"
- Avoid generic labels: Never "OK", "Submit", "Click here"

**Error Messages:**
- Never blame user: "Email must include @" not "Invalid email"
- Include solution: "Check your connection and try again"
- Be empathetic: "We couldn't process..." not "An error occurred"

**Success Messages:**
- Past tense: "Changes saved" not "Saving changes"
- Specific action: "Email sent" not "Success!"
- Proportional: Brief for small actions, detailed for big ones

**Empty States:**
- Explain why empty: "No messages yet"
- Provide clear CTA: "Start a conversation"
- Use encouraging tone: "yet" implies future value

**Form Fields:**
- Label describes input: "Email address" not "Enter email"
- Instructions explain why: "We'll send updates to this email"
- Placeholder sparingly: Only for format examples

### Accessibility Best Practices

1. **Screen Readers** - Label all interactive elements descriptively
2. **Plain Language** - Target 7th-8th grade reading level
3. **Visual Independence** - Don't rely on color alone
4. **Cognitive Load** - Keep critical content to 8-14 words
5. **Consistent Patterns** - Reduce memory load with consistency

### Tone Adaptation

Adjust tone based on user emotional state:

**Frustrated** (errors, failures)
- Empathetic and solution-focused
- Acknowledge problem without blame
- Example: "Payment failed. Check your card and try again."

**Confused** (first use, complex features)
- Patient and explanatory
- Break down steps clearly
- Example: "Connect your bank to see insights. We'll guide you."

**Confident** (routine tasks)
- Efficient and direct
- Minimal explanation
- Example: "Saved"

**Cautious** (high-stakes actions)
- Serious and transparent
- Clear consequences
- Example: "Delete account? You'll lose all data. This can't be undone."

**Successful** (completions)
- Positive and encouraging
- Proportional celebration
- Example: "Profile updated. Your changes are live."

## Configuration

The module is configured through `config.yaml` (generated during installation):

```yaml
# User Configuration
ux_content_folder: output/ux-writing
target_audience: general
reading_level_target: 8th-grade
quality_threshold: 8
voice_adaptation: automatic
accessibility_focus: yes
content_types: [buttons, errors, forms, empty-states]

# Static Configuration
module_version: 1.0.0
ux_data_path: {bmad_folder}/ux-writer/data
analyses_folder: {ux_content_folder}/analyses
improvements_folder: {ux_content_folder}/improvements
voice_charts_folder: {ux_content_folder}/voice-charts
audits_folder: {ux_content_folder}/audits
```

## Integration

### With BMad Method

The UX Writer module integrates seamlessly with BMad Method:

- **BMad Master** - Can orchestrate UX writing alongside development
- **Content Creator** - Complement long-form content with interface copy
- **Marketing Ops** - Apply UX writing to marketing touchpoints

### With Other Modules

- **Career Coach** - Improve resume and cover letter copy
- **BMad Builder** - Write clear agent descriptions and commands
- **Development Workflow** - Create user-facing error messages and confirmations

## Support & Resources

### Getting Help

- **In-agent help**: Use `*help` command
- **Pattern library**: Browse with `*patterns` command
- **Data resources**: Reference materials in `/data` folder
- **Quality checklist**: Use quality scorecard template

### Research & Credits

This module is based on the [ux-writing-skill](https://github.com/content-designer/ux-writing-skill) by Christopher Greer, drawing from:

- Sarah Richards: "Content Design"
- Torrey Podmajersky: "Strategic Writing for UX"
- Google Material Design guidelines
- Nielsen Norman Group research
- WCAG accessibility standards
- Flesch-Kincaid readability research

## License

MIT License - See main BMAD-METHOD LICENSE for details.

Module based on [ux-writing-skill](https://github.com/content-designer/ux-writing-skill) (MIT License) by Christopher Greer.

---

<p align="center">
  <sub>Write interface copy that helps users succeed</sub>
</p>
