# Peers Advisory Session Workflow

## Overview

Guide clients through a complete Peers Advisory Group process, leveraging the wisdom of top business leaders to solve real-world problems.

**Duration**: 60-90 minutes
**Participants**: Client + 4 Advisors (AI-embodied)
**Output**: Session record + Optional magazine-style report

## Workflow Philosophy

The Peers Advisory Group methodology is based on structured inquiry and collective wisdom. Through systematic questioning from multiple perspectives, we help clients:

- **Uncover root causes** hidden beneath surface symptoms
- **Challenge assumptions** that may be limiting their thinking
- **Explore blind spots** through diverse viewpoints
- **Generate actionable solutions** grounded in proven experience

## Workflow Steps

1. **Confirm Client Issue** - Clarify the problem and expected outcomes
2. **Round 1 Questions** - 8 foundational questions to understand the essence
3. **Round 2 Questions** - 4-8 challenging questions (black hat thinking)
4. **Round 3 Questions** - 4 divergent questions to explore blind spots
5. **Client Questions** - Client asks advisors for clarification
6. **Advisor Feedback** - Each advisor provides complete recommendations
7. **Client Summary** - Summarize key takeaways and action plan
8. **Advisor Reflection** - Deep reflection on growth direction

## Initialization

```yaml
# Configuration loading
config_file: {project-root}/_bmad/pag/config.yaml
output_file: {session_output_folder}/session-{date}.md
advisors_data: {project-root}/_bmad/pag/data/advisors/default-advisors.md
template: {installed_path}/session-record.template.md

# Session variables
communication_language: {communication_language}
default_advisors: {default_advisors}
generate_magazine_report: {generate_magazine_report}
```

## Critical Execution Rules

### 🛑 NEVER

- Skip any steps in the sequence
- Merge multiple steps together
- Ask multiple questions simultaneously
- Proceed to the next question without user response
- Break character when embodying advisors
- Provide vague or theoretical advice

### ✅ ALWAYS

- Execute steps strictly in order
- Wait for user response after each question
- Maintain each advisor's consistent language style
- Record all dialogue to the output file
- Update frontmatter progress after each step
- Provide specific, actionable recommendations
- Create a safe, non-judgmental space for dialogue

## Execution Sequence

**Current Step**: Initialize
**Next Step**: Load and execute `step-01-confirm-issue.md`

---

## Process Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Step 01: Confirm Issue                                 │
│  - Understand the core problem                          │
│  - Clarify expectations                                 │
│  - Select advisor panel                                 │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 02: Round 1 Questions (8Q)                        │
│  - Each advisor asks 2 essential questions              │
│  - One question at a time, wait for answers             │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 03: Round 2 Questions (Black Hat)                 │
│  - Challenge assumptions                                │
│  - Explore uncomfortable truths                         │
│  - 1-2 questions per advisor                            │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 04: Round 3 Questions (Divergent)                 │
│  - Explore blind spots                                  │
│  - 1 question per advisor                               │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 05: Client Questions                              │
│  - Client asks advisors for clarification              │
│  - Supplement information, not seek advice              │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 06: Advisor Feedback                              │
│  - Each advisor provides complete recommendations       │
│  - Quote, feeling, problem reframing, story, advice     │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 07: Client Summary                                │
│  - Key takeaways                                        │
│  - Action commitments                                   │
│  - Timeline commitments                                 │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Step 08: Advisor Reflection                            │
│  - Your strengths                                       │
│  - Potential traps                                      │
│  - Others' strengths                                    │
│  - Evolution direction                                  │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  [Optional] Generate Magazine Report                    │
│  - Beautiful HTML report                                │
│  - Printable format                                     │
└─────────────────────────────────────────────────────────┘
```

## State Management

The workflow maintains state through the session record frontmatter:

```yaml
---
stepsCompleted: [1, 2, ...]  # Completed steps array
currentStep: 3               # Current step number
issue: "..."                 # Client's core issue
client: "{user_name}"        # Client name
advisors: [...]              # Advisor names
date: {system-date}          # Session date
status: in-progress          # Session status
---
```

## Recovery and Resume

If a session is interrupted:

1. User can type: `/facilitator RS` (Resume Session)
2. Facilitator loads the most recent session file
3. Checks `currentStep` from frontmatter
4. Resumes from that step

## Output Files

### Primary Output
- **Location**: `{session_output_folder}/session-{date}.md`
- **Format**: Markdown with YAML frontmatter
- **Content**: Complete dialogue record

### Optional Output
- **Location**: `{session_output_folder}/report-{date}.html`
- **Format**: Magazine-style HTML
- **Content**: Formatted summary with visual design

## Begin Execution

Load and execute: `step-01-confirm-issue.md`
