---
title: "Tools and Advanced FAQ"
description: Common questions about tools, IDEs, and advanced topics in the BMad Method
---

Quick answers to common questions about tools, IDEs, and advanced topics in the BMad Method.

## Questions

**Tools and Technical**

- [Why are my Mermaid diagrams not rendering?](#why-are-my-mermaid-diagrams-not-rendering)
- [Can I use BMM with GitHub Copilot / Cursor / other AI tools?](#can-i-use-bmm-with-github-copilot--cursor--other-ai-tools)
- [What IDEs/tools support BMM?](#what-idestools-support-bmm)
- [Can I customize agents?](#can-i-customize-agents)
- [What happens to my planning docs after implementation?](#what-happens-to-my-planning-docs-after-implementation)
- [Can I use BMM for non-software projects?](#can-i-use-bmm-for-non-software-projects)

**Advanced**

- [What if my project grows from Level 1 to Level 3?](#what-if-my-project-grows-from-level-1-to-level-3)
- [Can I mix greenfield and brownfield approaches?](#can-i-mix-greenfield-and-brownfield-approaches)
- [How do I handle urgent hotfixes during a sprint?](#how-do-i-handle-urgent-hotfixes-during-a-sprint)
- [What if I disagree with the workflow's recommendations?](#what-if-i-disagree-with-the-workflows-recommendations)
- [Can multiple developers work on the same BMM project?](#can-multiple-developers-work-on-the-same-bmm-project)
- [What is party mode and when should I use it?](#what-is-party-mode-and-when-should-i-use-it)

**Getting Help**

- [Where do I get help if my question isn't answered here?](#where-do-i-get-help-if-my-question-isnt-answered-here)
- [How do I report a bug or request a feature?](#how-do-i-report-a-bug-or-request-a-feature)

## Tools and Technical

### Why are my Mermaid diagrams not rendering?

Common issues:

1. Missing language tag: Use ` ```mermaid` not just ` ``` `
2. Syntax errors in diagram (validate at mermaid.live)
3. Tool doesn't support Mermaid (check your Markdown renderer)

All BMM docs use valid Mermaid syntax that should render in GitHub, VS Code, and most IDEs.

### Can I use BMM with GitHub Copilot / Cursor / other AI tools?

Yes! BMM is complementary. BMM handles:

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

### What IDEs/tools support BMM?

BMM requires tools with **agent mode** and access to **high-quality LLM models** that can load and follow complex workflows, then properly implement code changes.

**Recommended Tools:**

- **Claude Code** — Best choice
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

1. **Agent mode** — Can load long workflow instructions and maintain context
2. **High-quality LLM** — Models ranked high on SWE-bench (coding benchmarks)
3. **Model selection** — Access to Claude Sonnet 4.5, Opus, or GPT-4o class models
4. **Context capacity** — Can handle large planning documents and codebases

**Why model quality matters:** BMM workflows require LLMs that can follow multi-step processes, maintain context across phases, and implement code that adheres to specifications. Tools with weaker models will struggle with workflow adherence and code quality.

### Can I customize agents?

Yes! Agents are installed as markdown files with XML-style content (optimized for LLMs, readable by any model). Create customization files in `_bmad/_config/agents/[agent-name].customize.yaml` to override default behaviors while keeping core functionality intact. See agent documentation for customization options.

**Note:** While source agents in this repo are YAML, they install as `.md` files with XML-style tags — a format any LLM can read and follow.

### What happens to my planning docs after implementation?

Keep them! They serve as:

- Historical record of decisions
- Onboarding material for new team members
- Reference for future enhancements
- Audit trail for compliance

For enterprise projects (Level 4), consider archiving completed planning artifacts to keep workspace clean.

### Can I use BMM for non-software projects?

BMM is optimized for software development, but the methodology principles (scale-adaptive planning, just-in-time design, context injection) can apply to other complex project types. You'd need to adapt workflows and agents for your domain.

## Advanced

### What if my project grows from Level 1 to Level 3?

Totally fine! When you realize scope has grown:

1. Run create-prd to add product-level planning
2. Run create-architecture for system design
3. Use existing tech-spec as input for PRD
4. Continue with updated level

The system is flexible — growth is expected.

### Can I mix greenfield and brownfield approaches?

Yes! Common scenario: adding new greenfield feature to brownfield codebase. Approach:

1. Run document-project for brownfield context
2. Use greenfield workflows for new feature planning
3. Explicitly document integration points between new and existing
4. Test integration thoroughly

### How do I handle urgent hotfixes during a sprint?

Use correct-course workflow or just:

1. Save your current work state
2. Load PM agent → quick tech-spec for hotfix
3. Implement hotfix (Level 0 flow)
4. Deploy hotfix
5. Return to original sprint work

Level 0 Quick Spec Flow is perfect for urgent fixes.

### What if I disagree with the workflow's recommendations?

Workflows are guidance, not enforcement. If a workflow recommends something that doesn't make sense for your context:

- Explain your reasoning to the agent
- Ask for alternative approaches
- Skip the recommendation if you're confident
- Document why you deviated (for future reference)

Trust your expertise — BMM supports your decisions.

### Can multiple developers work on the same BMM project?

Yes! But the paradigm is fundamentally different from traditional agile teams.

**Key Difference:**

- **Traditional** — Multiple devs work on stories within one epic (months)
- **Agentic** — Each dev owns complete epics (days)

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

### What is party mode and when should I use it?

Party mode is a unique multi-agent collaboration feature where ALL your installed agents (19+ from BMM, CIS, BMB, custom modules) discuss your challenges together in real-time.

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

- **Product Strategy** — PM + Innovation Strategist (CIS) + Analyst
- **Technical Design** — Architect + Creative Problem Solver (CIS) + Game Architect
- **User Experience** — UX Designer + Design Thinking Coach (CIS) + Storyteller (CIS)

**Why it's powerful:**

- Diverse perspectives (technical, creative, strategic)
- Healthy debate reveals blind spots
- Emergent insights from agent interaction
- Natural collaboration across modules

**For complete documentation:** See the [Party Mode Guide](/docs/explanation/features/party-mode.md)

## Getting Help

### Where do I get help if my question isn't answered here?

1. Search [Complete Documentation](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/README.md) for related topics
2. Ask in [Discord Community](https://discord.gg/gk8jAdXWmj) (#bmad-method-help)
3. Open a [GitHub Issue](https://github.com/bmad-code-org/BMAD-METHOD/issues)
4. Watch [YouTube Tutorials](https://www.youtube.com/@BMadCode)

### How do I report a bug or request a feature?

Open a GitHub issue at: <https://github.com/bmad-code-org/BMAD-METHOD/issues>

Please include:

- BMM version (check your installed version)
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Relevant workflow or agent involved

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
