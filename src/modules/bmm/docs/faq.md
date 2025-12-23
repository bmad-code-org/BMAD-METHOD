# BMM Frequently Asked Questions

Quick answers to common questions about the BMad Method Module.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Choosing the Right Level](#choosing-the-right-level)
- [Workflows and Phases](#workflows-and-phases)
- [Planning Documents](#planning-documents)
- [Implementation](#implementation)
- [Brownfield Development](#brownfield-development)
- [Tools and Technical](#tools-and-technical)

---

## Getting Started

### Q: Do I always need to run workflow-init?

**A:** No, once you learn the flow you can go directly to workflows. However, workflow-init is helpful because it:

- Determines your project's appropriate level automatically
- Creates the tracking status file
- Routes you to the correct starting workflow

For experienced users: use the [Quick Reference](./quick-start.md#quick-reference-agent-document-mapping) to go directly to the right agent/workflow.

### Q: Why do I need fresh chats for each workflow?

**A:** Context-intensive workflows (like brainstorming, PRD creation, architecture design) can cause AI hallucinations if run in sequence within the same chat. Starting fresh ensures the agent has maximum context capacity for each workflow. This is particularly important for:

- Planning workflows (PRD, architecture)
- Analysis workflows (brainstorming, research)
- Complex story implementation

Quick workflows like status checks can reuse chats safely.

### Q: Can I skip workflow-status and just start working?

**A:** Yes, if you already know your project level and which workflow comes next. workflow-status is mainly useful for:

- New projects (guides initial setup)
- When you're unsure what to do next
- After breaks in work (reminds you where you left off)
- Checking overall progress

### Q: What's the minimum I need to get started?

**A:** For the fastest path:

1. Install BMad Method: `npx bmad-method@alpha install`
2. For small changes: Load PM agent → run tech-spec → implement
3. For larger projects: Load PM agent → run prd → architect → implement

### Q: How do I know if I'm in Phase 1, 2, 3, or 4?

**A:** Check your `bmm-workflow-status.md` file (created by workflow-init). It shows your current phase and progress. If you don't have this file, you can also tell by what you're working on:

- **Phase 1** - Brainstorming, research, product brief (optional)
- **Phase 2** - Creating either a PRD or tech-spec (always required)
- **Phase 3** - Architecture design (Level 2-4 only)
- **Phase 4** - Actually writing code, implementing stories

---

## Choosing the Right Level

### Q: How do I know which level my project is?

**A:** Use workflow-init for automatic detection, or self-assess using these keywords:

- **Level 0:** "fix", "bug", "typo", "small change", "patch" → 1 story
- **Level 1:** "simple", "basic", "small feature", "add" → 2-10 stories
- **Level 2:** "dashboard", "several features", "admin panel" → 5-15 stories
- **Level 3:** "platform", "integration", "complex", "system" → 12-40 stories
- **Level 4:** "enterprise", "multi-tenant", "multiple products" → 40+ stories

When in doubt, start smaller. You can always run create-prd later if needed.

### Q: Can I change levels mid-project?

**A:** Yes! If you started at Level 1 but realize it's Level 2, you can run create-prd to add proper planning docs. The system is flexible - your initial level choice isn't permanent.

### Q: What if workflow-init suggests the wrong level?

**A:** You can override it! workflow-init suggests a level but always asks for confirmation. If you disagree, just say so and choose the level you think is appropriate. Trust your judgment.

### Q: Do I always need architecture for Level 2?

**A:** No, architecture is **optional** for Level 2. Only create architecture if you need system-level design. Many Level 2 projects work fine with just PRD created during planning.

### Q: What's the difference between Level 1 and Level 2?

**A:**

- **Level 1:** 1-10 stories, uses tech-spec (simpler, faster), no architecture
- **Level 2:** 5-15 stories, uses PRD (product-focused), optional architecture

The overlap (5-10 stories) is intentional. Choose based on:

- Need product-level planning? → Level 2
- Just need technical plan? → Level 1
- Multiple epics? → Level 2
- Single epic? → Level 1

---

## Workflows and Phases

### Q: What's the difference between workflow-status and workflow-init?

**A:**

- **workflow-status:** Checks existing status and tells you what's next (use when continuing work)
- **workflow-init:** Creates new status file and sets up project (use when starting new project)

If status file exists, use workflow-status. If not, use workflow-init.

### Q: Can I skip Phase 1 (Analysis)?

**A:** Yes! Phase 1 is optional for all levels, though recommended for complex projects. Skip if:

- Requirements are clear
- No research needed
- Time-sensitive work
- Small changes (Level 0-1)

### Q: When is Phase 3 (Architecture) required?

**A:**

- **Level 0-1:** Never (skip entirely)
- **Level 2:** Optional (only if system design needed)
- **Level 3-4:** Required (comprehensive architecture mandatory)

### Q: What happens if I skip a recommended workflow?

**A:** Nothing breaks! Workflows are guidance, not enforcement. However, skipping recommended workflows (like architecture for Level 3) may cause:

- Integration issues during implementation
- Rework due to poor planning
- Conflicting design decisions
- Longer development time overall

### Q: How do I know when Phase 3 is complete and I can start Phase 4?

**A:** For Level 3-4, run the implementation-readiness workflow. It validates PRD + Architecture + Epics + UX (optional) are aligned before implementation. Pass the gate check = ready for Phase 4.

### Q: Can I run workflows in parallel or do they have to be sequential?

**A:** Most workflows must be sequential within a phase:

- Phase 1: brainstorm → research → product-brief (optional order)
- Phase 2: PRD must complete before moving forward
- Phase 3: architecture → epics+stories → implementation-readiness (sequential)
- Phase 4: Stories within an epic should generally be sequential, but stories in different epics can be parallel if you have capacity

---

## Planning Documents

### Q: Why no tech-spec at Level 2+?

**A:** Level 2+ projects need product-level planning (PRD) and system-level design (Architecture), which tech-spec doesn't provide. Tech-spec is too narrow for coordinating multiple features. Instead, Level 2-4 uses:

- PRD (product vision, functional requirements, non-functional requirements)
- Architecture (system design)
- Epics+Stories (created AFTER architecture is complete)

### Q: Do I need a PRD for a bug fix?

**A:** No! Bug fixes are typically Level 0 (single atomic change). Use Quick Spec Flow:

- Load PM agent
- Run tech-spec workflow
- Implement immediately

PRDs are for Level 2-4 projects with multiple features requiring product-level coordination.

### Q: Can I skip the product brief?

**A:** Yes, product brief is always optional. It's most valuable for:

- Level 3-4 projects needing strategic direction
- Projects with stakeholders requiring alignment
- Novel products needing market research
- When you want to explore solution space before committing

---

## Implementation

### Q: Does create-story include implementation context?

**A:** Yes! The create-story workflow generates story files that include implementation-specific guidance, references existing patterns from your documentation, and provides technical context. The workflow loads your architecture, PRD, and existing project documentation to create comprehensive stories. For Quick Flow projects using tech-spec, the tech-spec itself is already comprehensive, so stories can be simpler.

### Q: How do I mark a story as done?

**A:** After dev-story completes and code-review passes:

1. Open `sprint-status.yaml` (created by sprint-planning)
2. Change the story status from `review` to `done`
3. Save the file

### Q: Can I work on multiple stories at once?

**A:** Yes, if you have capacity! Stories within different epics can be worked in parallel. However, stories within the same epic are usually sequential because they build on each other.

### Q: What if my story takes longer than estimated?

**A:** That's normal! Stories are estimates. If implementation reveals more complexity:

1. Continue working until DoD is met
2. Consider if story should be split
3. Document learnings in retrospective
4. Adjust future estimates based on this learning

### Q: When should I run retrospective?

**A:** After completing all stories in an epic (when epic is done). Retrospectives capture:

- What went well
- What could improve
- Technical insights
- Learnings for future epics

Don't wait until project end - run after each epic for continuous improvement.

---

## Brownfield Development

### Q: What is brownfield vs greenfield?

**A:**

- **Greenfield:** New project, starting from scratch, clean slate
- **Brownfield:** Existing project, working with established codebase and patterns

### Q: Do I have to run document-project for brownfield?

**A:** Highly recommended, especially if:

- No existing documentation
- Documentation is outdated
- AI agents need context about existing code
- Level 2-4 complexity

You can skip it if you have comprehensive, up-to-date documentation including `docs/index.md`.

### Q: What if I forget to run document-project on brownfield?

**A:** Workflows will lack context about existing code. You may get:

- Suggestions that don't match existing patterns
- Integration approaches that miss existing APIs
- Architecture that conflicts with current structure

Run document-project and restart planning with proper context.

### Q: Can I use Quick Spec Flow for brownfield projects?

**A:** Yes! Quick Spec Flow works great for brownfield. It will:

- Auto-detect your existing stack
- Analyze brownfield code patterns
- Detect conventions and ask for confirmation
- Generate context-rich tech-spec that respects existing code

Perfect for bug fixes and small features in existing codebases.

### Q: How does workflow-init handle brownfield with old planning docs?

**A:** workflow-init asks about YOUR current work first, then uses old artifacts as context:

1. Shows what it found (old PRD, epics, etc.)
2. Asks: "Is this work in progress, previous effort, or proposed work?"
3. If previous effort: Asks you to describe your NEW work
4. Determines level based on YOUR work, not old artifacts

This prevents old Level 3 PRDs from forcing Level 3 workflow for new Level 0 bug fix.

### Q: What if my existing code doesn't follow best practices?

**A:** Quick Spec Flow detects your conventions and asks: "Should I follow these existing conventions?" You decide:

- **Yes** → Maintain consistency with current codebase
- **No** → Establish new standards (document why in tech-spec)

BMM respects your choice - it won't force modernization, but it will offer it.

---

## Tools and Technical

### Q: Why are my Mermaid diagrams not rendering?

**A:** Common issues:

1. Missing language tag: Use ` ```mermaid` not just ` ``` `
2. Syntax errors in diagram (validate at mermaid.live)
3. Tool doesn't support Mermaid (check your Markdown renderer)

All BMM docs use valid Mermaid syntax that should render in GitHub, VS Code, and most IDEs.

### Q: Can I use BMM with GitHub Copilot / Cursor / other AI tools?

**A:** Yes! BMM is complementary. BMM handles:

- Project planning and structure
- Workflow orchestration
- Agent Personas and expertise
- Documentation generation
- Quality gates

Your AI coding assistant handles:

- Line-by-line code completion
- Quick refactoring
- Test generation

Use them together for best results.

### Q: What IDEs/tools support BMM?

**A:** BMM requires tools with **agent mode** and access to **high-quality LLM models** that can load and follow complex workflows, then properly implement code changes.

**Recommended Tools:**

- **Claude Code** ⭐ **Best choice**
  - Sonnet 4.5 (excellent workflow following, coding, reasoning)
  - Opus (maximum context, complex planning)
  - Native agent mode designed for BMM workflows

- **Cursor**
  - Supports Anthropic (Claude) and OpenAI models
  - Agent mode with composer
  - Good for developers who prefer Cursor's UX

- **Windsurf**
  - Multi-model support
  - Agent capabilities
  - Suitable for BMM workflows

**What Matters:**

1. **Agent mode** - Can load long workflow instructions and maintain context
2. **High-quality LLM** - Models ranked high on SWE-bench (coding benchmarks)
3. **Model selection** - Access to Claude Sonnet 4.5, Opus, or GPT-4o class models
4. **Context capacity** - Can handle large planning documents and codebases

**Why model quality matters:** BMM workflows require LLMs that can follow multi-step processes, maintain context across phases, and implement code that adheres to specifications. Tools with weaker models will struggle with workflow adherence and code quality.

See [IDE Setup Guides](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/docs/ide-info) for configuration specifics.

### Q: Can I customize agents?

**A:** Yes! Agents are installed as markdown files with XML-style content (optimized for LLMs, readable by any model). Create customization files in `_bmad/_config/agents/[agent-name].customize.yaml` to override default behaviors while keeping core functionality intact. See agent documentation for customization options.

**Note:** While source agents in this repo are YAML, they install as `.md` files with XML-style tags - a format any LLM can read and follow.

### Q: What happens to my planning docs after implementation?

**A:** Keep them! They serve as:

- Historical record of decisions
- Onboarding material for new team members
- Reference for future enhancements
- Audit trail for compliance

For enterprise projects (Level 4), consider archiving completed planning artifacts to keep workspace clean.

### Q: Can I use BMM for non-software projects?

**A:** BMM is optimized for software development, but the methodology principles (scale-adaptive planning, just-in-time design, context injection) can apply to other complex project types. You'd need to adapt workflows and agents for your domain.

---

## Advanced Questions

### Q: What if my project grows from Level 1 to Level 3?

**A:** Totally fine! When you realize scope has grown:

1. Run create-prd to add product-level planning
2. Run create-architecture for system design
3. Use existing tech-spec as input for PRD
4. Continue with updated level

The system is flexible - growth is expected.

### Q: Can I mix greenfield and brownfield approaches?

**A:** Yes! Common scenario: adding new greenfield feature to brownfield codebase. Approach:

1. Run document-project for brownfield context
2. Use greenfield workflows for new feature planning
3. Explicitly document integration points between new and existing
4. Test integration thoroughly

### Q: How do I handle urgent hotfixes during a sprint?

**A:** Use correct-course workflow or just:

1. Save your current work state
2. Load PM agent → quick tech-spec for hotfix
3. Implement hotfix (Level 0 flow)
4. Deploy hotfix
5. Return to original sprint work

Level 0 Quick Spec Flow is perfect for urgent fixes.

### Q: What if I disagree with the workflow's recommendations?

**A:** Workflows are guidance, not enforcement. If a workflow recommends something that doesn't make sense for your context:

- Explain your reasoning to the agent
- Ask for alternative approaches
- Skip the recommendation if you're confident
- Document why you deviated (for future reference)

Trust your expertise - BMM supports your decisions.

### Q: Can multiple developers work on the same BMM project?

**A:** Yes! But the paradigm is fundamentally different from traditional agile teams.

**Key Difference:**

- **Traditional:** Multiple devs work on stories within one epic (months)
- **Agentic:** Each dev owns complete epics (days)

**In traditional agile:** A team of 5 devs might spend 2-3 months on a single epic, with each dev owning different stories.

**With BMM + AI agents:** A single dev can complete an entire epic in 1-3 days. What used to take months now takes days.

**Team Work Distribution:**

- **Recommended:** Split work by **epic** (not story)
- Each developer owns complete epics end-to-end
- Parallel work happens at epic level
- Minimal coordination needed

**For full-stack apps:**

- Frontend and backend can be separate epics (unusual in traditional agile)
- Frontend dev owns all frontend epics
- Backend dev owns all backend epics
- Works because delivery is so fast

**Enterprise Considerations:**

- Use **git submodules** for BMM installation (not .gitignore)
- Allows personal configurations without polluting main repo
- Teams may use different AI tools (Claude Code, Cursor, etc.)
- Developers may follow different methods or create custom agents/workflows

**Quick Tips:**

- Share `sprint-status.yaml` (single source of truth)
- Assign entire epics to developers (not individual stories)
- Coordinate at epic boundaries, not story level
- Use git submodules for BMM in enterprise settings

**For comprehensive coverage of enterprise team collaboration, work distribution strategies, git submodule setup, and velocity expectations, see:**

👉 **[Enterprise Agentic Development Guide](./enterprise-agentic-development.md)**

### Q: What is party mode and when should I use it?

**A:** Party mode is a unique multi-agent collaboration feature where ALL your installed agents (19+ from BMM, CIS, BMB, custom modules) discuss your challenges together in real-time.

**How it works:**

1. Run `/bmad:core:workflows:party-mode` (or `*party-mode` from any agent)
2. Introduce your topic
3. BMad Master selects 2-3 most relevant agents per message
4. Agents cross-talk, debate, and build on each other's ideas

**Best for:**

- Strategic decisions with trade-offs (architecture choices, tech stack, scope)
- Creative brainstorming (game design, product innovation, UX ideation)
- Cross-functional alignment (epic kickoffs, retrospectives, phase transitions)
- Complex problem-solving (multi-faceted challenges, risk assessment)

**Example parties:**

- **Product Strategy:** PM + Innovation Strategist (CIS) + Analyst
- **Technical Design:** Architect + Creative Problem Solver (CIS) + Game Architect
- **User Experience:** UX Designer + Design Thinking Coach (CIS) + Storyteller (CIS)

**Why it's powerful:**

- Diverse perspectives (technical, creative, strategic)
- Healthy debate reveals blind spots
- Emergent insights from agent interaction
- Natural collaboration across modules

**For complete documentation:**

👉 **[Party Mode Guide](./party-mode.md)** - How it works, when to use it, example compositions, best practices

---

## Getting Help

### Q: Where do I get help if my question isn't answered here?

**A:**

1. Search [Complete Documentation](./README.md) for related topics
2. Ask in [Discord Community](https://discord.gg/gk8jAdXWmj) (#general-dev)
3. Open a [GitHub Issue](https://github.com/bmad-code-org/BMAD-METHOD/issues)
4. Watch [YouTube Tutorials](https://www.youtube.com/@BMadCode)

### Q: How do I report a bug or request a feature?

**A:** Open a GitHub issue at: <https://github.com/bmad-code-org/BMAD-METHOD/issues>

Please include:

- BMM version (check your installed version)
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Relevant workflow or agent involved

---

## Related Documentation

- [Quick Start Guide](./quick-start.md) - Get started with BMM
- [Glossary](./glossary.md) - Terminology reference
- [Scale Adaptive System](./scale-adaptive-system.md) - Understanding levels
- [Brownfield Guide](./brownfield-guide.md) - Existing codebase workflows

---

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
