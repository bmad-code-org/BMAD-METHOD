# BMM Agents Reference

Quick reference of what each agent can do based on their available commands.

---

## Analyst (Mary) | `/bmad:bmm:agents:analyst`

Business analysis and research.

**Capabilities:**

- `*workflow-status` - Get workflow status or initialize tracking
- `*brainstorm-project` - Guided brainstorming session
- `*research` - Market, domain, competitive, or technical research
- `*product-brief` - Create a product brief (input for PRD)
- `*document-project` - Document existing brownfield projects
- Party mode and advanced elicitation

---

## PM (John) | `/bmad:bmm:agents:pm`

Product requirements and planning.

**Capabilities:**

- `*workflow-status` - Get workflow status or initialize tracking
- `*create-prd` - Create Product Requirements Document
- `*create-epics-and-stories` - Break PRD into epics and user stories (after Architecture)
- `*implementation-readiness` - Validate PRD, UX, Architecture, Epics alignment
- `*correct-course` - Course correction during implementation
- Party mode and advanced elicitation

---

## Architect (Winston) | `/bmad:bmm:agents:architect`

System architecture and technical design.

**Capabilities:**

- `*workflow-status` - Get workflow status or initialize tracking
- `*create-architecture` - Create architecture document to guide development
- `*implementation-readiness` - Validate PRD, UX, Architecture, Epics alignment
- `*create-excalidraw-diagram` - System architecture or technical diagrams
- `*create-excalidraw-dataflow` - Data flow diagrams
- Party mode and advanced elicitation

---

## SM (Bob) | `/bmad:bmm:agents:sm`

Sprint planning and story preparation.

**Capabilities:**

- `*sprint-planning` - Generate sprint-status.yaml from epic files
- `*create-story` - Create story from epic (prep for development)
- `*validate-create-story` - Validate story quality
- `*epic-retrospective` - Team retrospective after epic completion
- `*correct-course` - Course correction during implementation
- Party mode and advanced elicitation

---

## DEV (Amelia) | `/bmad:bmm:agents:dev`

Story implementation and code review.

**Capabilities:**

- `*dev-story` - Execute story workflow (implementation with tests)
- `*code-review` - Thorough code review

---

## Quick Flow Solo Dev (Barry) | `/bmad:bmm:agents:quick-flow-solo-dev`

Fast solo development without handoffs.

**Capabilities:**

- `*create-tech-spec` - Architect technical spec with implementation-ready stories
- `*quick-dev` - Implement tech spec end-to-end solo
- `*code-review` - Review and improve code

---

## TEA (Murat) | `/bmad:bmm:agents:tea`

Test architecture and quality strategy.

**Capabilities:**

- `*framework` - Initialize production-ready test framework
- `*atdd` - Generate E2E tests first (before implementation)
- `*automate` - Comprehensive test automation
- `*test-design` - Create comprehensive test scenarios
- `*trace` - Map requirements to tests, quality gate decision
- `*nfr-assess` - Validate non-functional requirements
- `*ci` - Scaffold CI/CD quality pipeline
- `*test-review` - Review test quality

---

## UX Designer (Sally) | `/bmad:bmm:agents:ux-designer`

User experience and UI design.

**Capabilities:**

- `*create-ux-design` - Generate UX design and UI plan from PRD
- `*validate-design` - Validate UX specification and design artifacts
- `*create-excalidraw-wireframe` - Create website or app wireframe

---

## Technical Writer (Paige) | `/bmad:bmm:agents:tech-writer`

Technical documentation and diagrams.

**Capabilities:**

- `*document-project` - Comprehensive project documentation (brownfield analysis)
- `*generate-mermaid` - Generate Mermaid diagrams (architecture, sequence, flow, ER, class, state)
- `*create-excalidraw-flowchart` - Process and logic flow visualizations
- `*create-excalidraw-diagram` - System architecture or technical diagrams
- `*create-excalidraw-dataflow` - Data flow visualizations
- `*validate-doc` - Review documentation against standards
- `*improve-readme` - Review and improve README files
- `*explain-concept` - Create clear technical explanations with examples
- `*standards-guide` - Show BMAD documentation standards reference

---

## Universal Commands

Available to all agents:

- `*menu` - Redisplay menu options
- `*dismiss` - Dismiss agent

Party mode is available to most agents for multi-agent collaboration.
