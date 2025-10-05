---
last-redoc-date: 2025-10-01
---

# Correct Course Workflow

The correct-course workflow is v6's adaptive response mechanism for stories that encounter issues during development or review, enabling intelligent course correction without restarting from scratch. Run by the Scrum Master (SM) or Team Lead, this workflow analyzes why a story is blocked or has issues, determines whether the story scope needs adjustment, requirements need clarification, technical approach needs revision, or the story needs to be split or reconsidered. This represents the agile principle of embracing change even late in the development cycle, but doing so in a structured way that captures learning and maintains project coherence.

Unlike simply abandoning failed work or blindly pushing forward, correct-course provides a systematic approach to diagnosing issues and determining appropriate remediation. The workflow examines the original story specification, what was actually implemented, what issues arose during development or review, and the broader epic context to recommend the best path forward. This might involve clarifying requirements, adjusting acceptance criteria, revising technical approach, splitting the story into smaller pieces, or even determining the story should be deprioritized.

The critical value of this workflow is that it prevents thrashing—endless cycles of implementation and rework without clear direction. By stepping back to analyze what went wrong and charting a clear path forward, the correct-course workflow enables teams to learn from difficulties and adapt intelligently rather than stubbornly proceeding with a flawed approach.

## Usage

```bash
# Analyze issues and recommend course correction
bmad run correct-course
```

The workflow should be run when:

- Review identifies critical issues requiring rethinking
- Developer encounters blocking issues during implementation
- Acceptance criteria prove infeasible or unclear
- Technical approach needs significant revision
- Story scope needs adjustment based on discoveries

## Inputs

**Required Context:**

- **Story Document**: Original story specification
- **Implementation Attempts**: Code changes and approaches tried
- **Review Feedback**: Issues and concerns identified
- **Epic Context**: Overall epic goals and current progress
- **Technical Constraints**: Architecture decisions and limitations discovered

**Analysis Focus:**

- Root cause of issues or blockages
- Feasibility of current story scope
- Clarity of requirements and acceptance criteria
- Appropriateness of technical approach
- Whether story should be split or revised

## Outputs

**Primary Deliverable:**

- **Course Correction Report** (`[story-id]-correction.md`): Analysis and recommendations including:
  - Issue root cause analysis
  - Impact assessment on epic and project
  - Recommended corrective actions with rationale
  - Revised story specification if applicable
  - Updated acceptance criteria if needed
  - Technical approach adjustments
  - Timeline and effort implications

**Possible Outcomes:**

1. **Clarify Requirements**: Update story with clearer acceptance criteria
2. **Revise Scope**: Adjust story scope to be more achievable
3. **Split Story**: Break into multiple smaller stories
4. **Change Approach**: Recommend different technical approach
5. **Deprioritize**: Determine story should be deferred or cancelled
6. **Unblock**: Identify and address blocking dependencies

**Artifacts:**

- Updated story document if revision needed
- New story documents if splitting story
- Updated epic backlog reflecting changes
- Lessons learned for retrospective
