---
title: "Build a Complete Web App Using BMAD Method Workflows"
---

Use the BMAD Method workflows to build a complete web application from initial idea to deployed code with comprehensive planning and testing. This guide follows the development of a simple Habit Tracker app to illustrate the concepts, but these same workflows apply to any web application project.

## When to Use This

- You have an idea for an app and want proper planning before coding
- You're new to the BMAD Method and want to see all workflows in action
- You want to build something substantial (10+ user stories) with full architecture
- You prefer comprehensive planning over jumping straight to code
- You need documentation and testing as part of your deliverables

## When to Skip This

- Simple features or bug fixes (use Quick Flow instead)
- Rapid prototyping where planning overhead isn't justified
- You already have detailed requirements and architecture (you can skip some but not all of this)

:::note[Prerequisites]
- BMAD Core Platform installed with BMM module
- Basic understanding of web development concepts
- Willingness to invest time in planning before implementation
:::

## Steps

### 1. Initialize Your Project Structure

Start by setting up your BMAD workflow tracking and determining your project path.

**Load the BMad Master agent:**
```
/bmad:core:agents:bmad-master
```

**Run workflow initialization:**
```
5. [LW] → workflow-init
```

**Example inputs (using our Habit Tracker):**
- **Project name:** "Habit Tracker"
- **Project type:** "1. New project (greenfield)" *(or brownfield for existing codebases)*
- **Planning approach:** "1. BMad Method" *(full planning for substantial apps)*
- **Discovery workflows:** "1,2,3" *(brainstorm, research, product brief)*

**What you provide for any project:**
- Clear project vision *(e.g., "solve my productivity problem", "showcase my work", "help local businesses")*
- Technology constraints *(e.g., "React/Node", "vanilla JS", "WordPress theme", though the workflow will guide you to a tech stack if you'd like)*
- Success criteria *(e.g., "increase daily consistency", "get freelance clients", "reduce manual work")*

### 2. Brainstorm Creative Solutions

Explore different approaches to your problem before committing to specific features.

**Load Analyst agent and run:**
```
/bmad:bmm:workflows:brainstorming
```

**Example developer inputs (Habit Tracker):**
- **Problem:** "I start habit streaks but lose motivation after 2-3 weeks"
- **Constraints:** "Must work offline, no user accounts needed"
- **Inspiration:** "Simple, visual progress tracking like GitHub contribution graph"

**Your inputs for any project:**
- **Problem:** *What specific pain point are you solving?*
- **Constraints:** *Technical, budget, timeline, or user limitations*
- **Inspiration:** *Existing solutions, design patterns, or approaches you admire*

**Typical brainstorming results for any app:**
- Core feature variations and alternatives
- User experience approaches
- Technical implementation options
- Unique differentiators and value propositions

### 3. Research Market and Technical Approaches

Understand what works in existing solutions and validate your technical decisions.

**Continue with Analyst agent:**
```
/bmad:bmm:workflows:research
```

**Example research focus areas (Habit Tracker):**
- **Market research:** "What makes habit tracking apps successful vs abandoned?"
- **Technical research:** "Best practices for vanilla JS local storage and data persistence"
- **UX research:** "Psychology of habit formation and visual feedback"

**Research areas for any project:**
- **Market research:** *Who are your competitors? What do users actually need?*
- **Technical research:** *Best practices, libraries, patterns for your tech stack*
- **UX research:** *User psychology, accessibility, design patterns*

**Typical research insights:**
- User behavior patterns that inform feature prioritization
- Technical approaches that prevent common pitfalls
- Competitive landscape gaps your app can fill

### 4. Create Strategic Product Brief

Transform your ideas and research into a focused product strategy.

**Continue with Analyst agent:**
```
/bmad:bmm:workflows:create-product-brief
```

**Example responses (Habit Tracker):**
- **Target user:** "Developers and knowledge workers who struggle with consistency"
- **Core value proposition:** "Dead-simple habit tracking that works offline"
- **Key differentiator:** "No accounts, no sync, just local progress tracking"

**Your responses for any project:**
- **Target user:** *Who specifically will use this? What are their pain points?*
- **Core value proposition:** *What's the main benefit you're delivering?*
- **Key differentiator:** *How is your approach unique or better?*

**Product brief output for any app:**
- Clear user personas and primary use cases
- Prioritized feature list based on user value
- Success metrics and project constraints
- Technical approach rationale and trade-offs

### 5. Define Requirements with PRD

Convert your strategic vision into detailed technical requirements.

**Load PM agent:**
```
/bmad:bmm:agents:pm → /bmad:bmm:workflows:create-prd
```

**Example functional requirements (Habit Tracker):**
- **FR1:** Users can add/remove habit definitions
- **FR2:** Users can mark habits complete for today
- **FR3:** System shows current streak count per habit
- **FR4:** Calendar view displays completion history

**Your functional requirements (any app):**
- **FR1-N:** *What specific actions must users be able to perform?*
- **FR1-N:** *What data must the system track and display?*
- **FR1-N:** *What business logic must the system implement?*

**Example non-functional requirements:**
- **NFR1:** Performance targets *(load times, response times)*
- **NFR2:** Platform support *(browsers, devices, operating systems)*
- **NFR3:** Scalability requirements *(concurrent users, data volume)*
- **NFR4:** Security and privacy constraints

### 6. Design User Experience

Plan the visual and interaction design that supports your users' goals and workflows.

**Load UX Designer agent:**
```
/bmad:bmm:agents:ux-designer → /bmad:bmm:workflows:create-ux-design
```

**Example UX decisions (Habit Tracker):**
- **Layout:** Single-page app with habit list + calendar view
- **Visual feedback:** Green streaks, gentle animations for completions
- **Interaction patterns:** One-click habit completion, easy habit management
- **Mobile approach:** Touch-friendly buttons, responsive grid

**UX considerations for any app:**
- **Information architecture:** *How do you organize features and content?*
- **Visual hierarchy:** *What gets user attention first, second, third?*
- **Interaction patterns:** *How do users accomplish their primary tasks?*
- **Responsive design:** *How does the experience adapt across devices?*

### 7. Create System Architecture

Define technical decisions that guide consistent implementation.

**Load Architect agent:**
```
/bmad:bmm:agents:architect → /bmad:bmm:workflows:create-architecture
```

**Example architecture decisions (Habit Tracker):**
- **Data layer:** Browser localStorage with JSON serialization
- **State management:** Vanilla JS with simple object models
- **UI pattern:** MVC-style separation with modules
- **File structure:** Modular JS files, single HTML entry point

**Architecture decisions for any app:**
- **Data layer:** *Database choice, data modeling, persistence strategy*
- **Application structure:** *Framework selection, design patterns, code organization*
- **Integration points:** *APIs, third-party services, external dependencies*
- **Deployment model:** *Hosting, build process, environment configuration*

**Architecture output for any project:**
- Technology stack rationale with trade-off analysis
- Data flow and system interaction diagrams
- File organization and module structure
- Development and deployment guidelines

### 8. Break Down Into Stories

Transform requirements into implementation-ready development tasks.

**Return to PM agent:**
```
/bmad:bmm:workflows:create-epics-and-stories
```

**Example epic breakdown (Habit Tracker):**
- **Epic 1:** Core Habit Management (add, edit, delete habits)
- **Epic 2:** Daily Completion Tracking (mark complete, streak calculation)
- **Epic 3:** Visual Progress Display (calendar view, statistics)
- **Epic 4:** Data Persistence (localStorage integration, data recovery)

**Epic organization for any app:**
- **Epic 1-N:** *Group related features by user journey or technical domain*
- **Epic 1-N:** *Organize by value delivery - what users accomplish together*
- **Epic 1-N:** *Consider technical dependencies - foundational features first*

**Story examples (any project):**
- **Story X.Y:** As a [user type], I can [action] so that [benefit]
- **Story X.Y:** As a [user type], I can [action] so that [benefit]
- **Story X.Y:** As a [user type], I can [action] so that [benefit]

### 9. Validate Implementation Readiness

Ensure all planning artifacts align before starting development.

**Continue with Architect agent:**
```
/bmad:bmm:workflows:implementation-readiness
```

**Validation checklist:**
- PRD functional requirements map to stories ✓
- Architecture supports all technical requirements ✓
- UX design covers all user journeys ✓
- Stories have clear acceptance criteria ✓

### 10. Plan Development Sprint

Organize your stories into implementation phases with clear tracking.

**Load Scrum Master agent:**
```
/bmad:bmm:agents:sm → /bmad:bmm:workflows:sprint-planning
```

**Example sprint organization (Habit Tracker):**
- **Sprint 1:** Core habit CRUD + basic UI
- **Sprint 2:** Completion tracking + streak logic
- **Sprint 3:** Calendar visualization + data persistence
- **Sprint 4:** Polish, testing, and edge cases

**Sprint organization principles (any app):**
- **Sprint 1:** *Foundational features that other features depend on*
- **Sprint 2-N:** *User-facing features in order of value delivery*
- **Final sprints:** *Polish, edge cases, performance optimization*

### 11. Implement Stories with Testing

Execute each story with proper implementation and validation.

**For each story, use SM agent:**
```
/bmad:bmm:workflows:dev-story
```

**Development process per story:**
- Write failing tests first (TDD approach)
- Implement minimal code to pass tests
- Refactor for code quality
- Validate against acceptance criteria

### 12. Review Code Quality

Get adversarial feedback to catch issues before they compound.

**After each story, use SM agent:**
```
/bmad:bmm:workflows:code-review
```

**Review focuses:**
- Code quality and maintainability
- Test coverage and edge cases
- Architecture compliance
- Security and performance considerations

### 13. Automate Testing Coverage

Ensure comprehensive test coverage for long-term maintainability.

**Load Test Automation Engineer:**
```
/bmad:bmm:agents:tea → /bmad:bmm:workflows:testarch-automate
```

**Testing layers:**
- Unit tests for data models and utilities
- Integration tests for localStorage interactions
- End-to-end tests for user workflows
- Browser compatibility validation

## What You Get

After completing this workflow sequence, you'll have:

**Planning Artifacts:**
- `_bmad-output/product-brief.md` - Strategic product vision
- `_bmad-output/PRD.md` - Detailed requirements document
- `_bmad-output/ux-design.md` - Visual and interaction design
- `_bmad-output/architecture.md` - Technical architecture decisions

**Implementation Artifacts:**
- `_bmad-output/epics/` - Organized user stories with acceptance criteria
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Development tracking
- Working web application with full test coverage
- Comprehensive documentation

**Project Structure:**
```
your-web-app/                      # (example: habit-tracker, portfolio-site, task-manager)
├── _bmad-output/                  # All planning documents
├── src/
│   ├── index.html                 # Main application entry
│   ├── js/
│   │   ├── app.js                 # Main application logic
│   │   ├── [feature]-manager.js   # Core business logic modules
│   │   ├── [component].js         # UI components
│   │   └── [utility].js           # Helper utilities
│   ├── css/
│   │   └── styles.css             # Application styles
│   └── tests/
│       ├── unit/                  # Unit test files
│       └── integration/           # Integration tests
└── README.md                      # Project documentation
```

## Tips

:::tip[Start Small]
If this feels overwhelming, try the Quick Flow approach first with a smaller feature to get familiar with BMAD workflows.
:::

:::tip[Document Decisions]
Each workflow creates artifacts that inform subsequent workflows. Don't skip documentation - it prevents rework later.
:::

:::tip[Iterate on Planning]
Use the `correct-course` workflow if you discover new requirements during implementation.
:::

## Next Steps

- **Deploy your app:** Use the `testarch-ci` workflow to set up deployment automation
- **Add features:** Create new epics using the `create-epics-and-stories` workflow
- **Maintain quality:** Regular code reviews and test automation expansion
- **Scale complexity:** Graduate to Enterprise Method for larger applications

## Getting Help

- **BMad Community:** [Discord community](https://discord.gg/bmad-method)
- **Documentation:** [Complete workflow reference](https://docs.bmad-method.org/)
- **Issues:** [GitHub repository](https://github.com/bmad-method/core)

:::tip[Key Takeaways]
The BMAD Method's strength is comprehensive planning that prevents common development pitfalls. Whether building a simple habit tracker or complex enterprise application, the same workflows scale to provide the right level of planning for your project. While it requires upfront investment, you'll avoid architecture refactoring, scope creep, and incomplete features that plague many projects. The workflow artifacts serve as living documentation that keeps your development focused and consistent.
:::