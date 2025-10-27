<!-- Powered by BMAD™ Core -->

# Create Game Development Story Task

## Purpose

Create detailed, actionable game development stories that enable AI developers to implement specific game features without requiring additional design decisions.

## When to Use

- Breaking down game epics into implementable stories
- Converting GDD features into development tasks
- Preparing work for game developers
- Ensuring clear handoffs from design to development

## Prerequisites

Before creating stories, ensure you have:

- Completed Game Design Document (GDD)
- Game Architecture Document
- Epic definition this story belongs to
- Clear understanding of the specific game feature

## Process

### 1. Story Identification

**Review Epic Context:**

- Understand the epic's overall goal
- Identify specific features that need implementation
- Review any existing stories in the epic
- Ensure no duplicate work

**Feature Analysis:**

- Reference specific GDD sections
- Understand player experience goals
- Identify technical complexity
- Estimate implementation scope

### 2. Story Scoping

**Single Responsibility:**

- Focus on one specific game feature
- Ensure story is completable in 1-3 days
- Break down complex features into multiple stories
- Maintain clear boundaries with other stories

**Implementation Clarity:**

- Define exactly what needs to be built
- Specify all technical requirements
- Include all necessary integration points
- Provide clear success criteria

### 3. Template Execution

**Load Template:**
Use `{root}/templates/game-story-tmpl.md` following all embedded LLM instructions

**Key Focus Areas:**

- Clear, actionable description
- Specific acceptance criteria
- Detailed technical specifications
- Complete implementation task list
- Comprehensive testing requirements

### 4. Story Validation

**Technical Review:**

- Verify all technical specifications are complete
- Ensure integration points are clearly defined
- Confirm file paths match architecture
- Validate TypeScript interfaces and classes

**Game Design Alignment:**

- Confirm story implements GDD requirements
- Verify player experience goals are met
- Check balance parameters are included
- Ensure game mechanics are correctly interpreted

**Implementation Readiness:**

- All dependencies identified
- Assets requirements specified
- Testing criteria defined
- Definition of Done complete

### 5. Quality Assurance

**Apply Checklist:**
Execute `{root}/checklists/game-story-dod-checklist.md` against completed story

**Story Criteria:**

- Story is immediately actionable
- No design decisions left to developer
- Technical requirements are complete
- Testing requirements are comprehensive
- Performance requirements are specified

### 6. Story Refinement

**Developer Perspective:**

- Can a developer start implementation immediately?
- Are all technical questions answered?
- Is the scope appropriate for the estimated points?
- Are all dependencies clearly identified?

**Iterative Improvement:**

- Address any gaps or ambiguities
- Clarify complex technical requirements
- Ensure story fits within epic scope
- Verify story points estimation

## Story Elements Checklist

### Required Sections

- [ ] Clear, specific description
- [ ] Complete acceptance criteria (functional, technical, game design)
- [ ] Detailed technical specifications
- [ ] File creation/modification list
- [ ] TypeScript interfaces and classes
- [ ] Integration point specifications
- [ ] Ordered implementation tasks
- [ ] Comprehensive testing requirements
- [ ] Performance criteria
- [ ] Dependencies clearly identified
- [ ] Definition of Done checklist

### Game-Specific Requirements

- [ ] GDD section references
- [ ] Game mechanic implementation details
- [ ] Player experience goals
- [ ] Balance parameters
- [ ] Phaser 3 specific requirements
- [ ] Performance targets (60 FPS)
- [ ] Cross-platform considerations

### Technical Quality

- [ ] TypeScript strict mode compliance
- [ ] Architecture document alignment
- [ ] Code organization follows standards
- [ ] Error handling requirements
- [ ] Memory management considerations
- [ ] Testing strategy defined

## Common Pitfalls

**Scope Issues:**

- Story too large (break into multiple stories)
- Story too vague (add specific requirements)
- Missing dependencies (identify all prerequisites)
- Unclear boundaries (define what's in/out of scope)

**Technical Issues:**

- Missing integration details
- Incomplete technical specifications
- Undefined interfaces or classes
- Missing performance requirements

**Game Design Issues:**

- Not referencing GDD properly
- Missing player experience context
- Unclear game mechanic implementation
- Missing balance parameters

## Success Criteria

**Story Readiness:**

- [ ] Developer can start implementation immediately
- [ ] No additional design decisions required
- [ ] All technical questions answered
- [ ] Testing strategy is complete
- [ ] Performance requirements are clear
- [ ] Story fits within epic scope

**Quality Validation:**

- [ ] Game story DOD checklist passes
- [ ] Architecture alignment confirmed
- [ ] GDD requirements covered
- [ ] Implementation tasks are ordered and specific
- [ ] Dependencies are complete and accurate

## Handoff Protocol

**To Game Developer:**

1. Provide story document
2. Confirm GDD and architecture access
3. Verify all dependencies are met
4. Answer any clarification questions
5. Establish check-in schedule

**Story Status Updates:**

- Draft → Ready for Development
- In Development → Code Review
- Code Review → Testing
- Testing → Done

This task ensures game development stories are immediately actionable and enable efficient AI-driven development of game features.
