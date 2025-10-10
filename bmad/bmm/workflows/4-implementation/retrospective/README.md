---
last-redoc-date: 2025-10-01
---

# Retrospective Workflow

The retrospective workflow is v6's learning capture mechanism, run by the Scrum Master (SM) after epic completion to systematically harvest insights, patterns, and improvements discovered during implementation. Unlike traditional retrospectives that focus primarily on process and team dynamics, this workflow performs deep technical and methodological analysis of the entire epic journey—from story creation through implementation to review—identifying what worked well, what could improve, and what patterns emerged. The retrospective produces actionable intelligence that informs future epics, improves workflow templates, and evolves the team's shared knowledge.

This workflow represents a critical feedback loop in the v6 methodology. Each epic is an experiment in adaptive software development, and the retrospective is where we analyze the results of that experiment. The SM examines completed stories, review feedback, course corrections made, story-context effectiveness, technical decisions, and team collaboration patterns to extract transferable learning. This learning manifests as updates to workflow templates, new story-context patterns, refined estimation approaches, and documented best practices.

The retrospective is not just a compliance ritual but a genuine opportunity for continuous improvement. By systematically analyzing what happened during the epic, the team builds institutional knowledge that makes each subsequent epic smoother, faster, and higher quality. The insights captured here directly improve future story creation, context generation, development efficiency, and review effectiveness.

## Usage

```bash
# Conduct retrospective after epic completion
bmad run retrospective
```

The SM should run this workflow:

- After all stories in an epic are completed
- Before starting the next major epic
- When significant learning has accumulated
- As preparation for improving future epic execution

## Inputs

**Required Context:**

- **Epic Document**: Complete epic specification and goals
- **All Story Documents**: Every story created for the epic
- **Review Reports**: All review feedback and findings
- **Course Corrections**: Any correct-course actions taken
- **Story Contexts**: Generated expert guidance for each story
- **Implementation Artifacts**: Code commits, test results, deployment records

**Analysis Targets:**

- Story creation accuracy and sizing
- Story-context effectiveness and relevance
- Implementation challenges and solutions
- Review findings and patterns
- Technical decisions and outcomes
- Estimation accuracy
- Team collaboration and communication
- Workflow effectiveness

## Outputs

**Primary Deliverable:**

- **Retrospective Report** (`[epic-id]-retrospective.xml`): Comprehensive analysis including:
  - Executive summary of epic outcomes
  - Story-by-story analysis of what was learned
  - Technical insights and architecture learnings
  - Story-context effectiveness assessment
  - Process improvements identified
  - Patterns discovered (good and bad)
  - Recommendations for future epics
  - Metrics and statistics (velocity, cycle time, etc.)

**Actionable Outputs:**

- **Template Updates**: Improvements to workflow templates based on learning
- **Pattern Library**: New story-context patterns for common scenarios
- **Best Practices**: Documented approaches that worked well
- **Gotchas**: Issues to avoid in future work
- **Estimation Refinements**: Better story sizing guidance
- **Process Changes**: Workflow adjustments for next epic

**Artifacts:**

- Epic marked as complete with retrospective attached
- Knowledge base updated with new patterns
- Workflow templates updated if needed
- Team learning captured for onboarding
