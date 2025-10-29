# Pull Request #821 - Full Conversation

**PR Title:** Ready to use subagents for opencode/claude  
**Author:** amrhas82  
**Created:** October 26, 2025  
**Status:** Open

---

## Original PR Description

Using your sophisticated BMad Method I adapted, compacted them as subagents to save context and added ai-dev-tasks 3 simple steps subagents to give users full fledged 2 approaches to spec engineering through Simple (ai-dev-tasks) or BMad Method. Tested on both and can be invoked with @agent_name and has its extensive manual for easy install. Some correction to opencode bmad configurations as well

---

## Comment Thread

### Comment 1 - amrhas82 (October 26, 2025 at 16:43:40Z)

Isolated everything in a folder to avoid any confusion with original BMad Method repo

---

### Comment 2 - pomazanbohdan (October 26, 2025 at 23:55:12Z)

Am I correct in understanding that by default, BMAD-METHOD in integration with Claude Code cannot orchestrate and launch tasks for execution on subagents, and you added this feature?

---

### Comment 3 - amrhas82 (October 27, 2025 at 05:58:41Z)

1. Setup for Opencode and Claude using npx was only for project level and there was no option to install them as subagents on global level
2. Md files were not optimized to be read in Claude format as subagents, they were verbose as well causing them to consume a lot of context. I adapted, compacted, and tested with Claude and Opencode subagents
3. Opencode should be copied to /agent not /agents
4. I added 3 extra personas for simpler requests (create prd, generate tasks, process task list)
5. The result is one folder per agent and easy copy to their respective dir, start your Claude/opencode and invoke them using @agent_name

---

### Comment 4 - pomazanbohdan (October 27, 2025 at 18:09:02Z)

You have done a very large-scale work that can be used separately.

But now, with the development of bmad-method v6 and my own experience, I see a non-fixed implementation as a tool that will be available after updates. ./bmad will create and update agents and commands in .claude according to your templates. This will support the development and updates of bmad-method and its adaptation to the final tool. Yes, I really miss the ability to launch each agent as a subagent in which it will be possible to delegate tasks from the Master, which I want to prohibit from taking on tasks through sidecar, and transfer them to the agent (more precisely, a subagent with its own context).

Therefore, I have now started to create an agent that will find agents in the project and create subagents for them, which will work autonomously on delegated tasks, using context economically, and even expand them so that they also delegate tasks to other agents that are more suited to this (I chose the SuperClaude stack).

---

### Comment 5 - amrhas82 (October 27, 2025 at 18:36:11Z)

That sounds ambitious as well. I understand where you're heading with v6. If it fits as an expansion pack then this can be one since it also gives users another framework, the 3 simple steps (create prd, generate tasks, process tasks) or if it's too complicated you can also add a reference to my repo https://github.com/amrhas82/agentic-toolkit. And if neither, no worries. It's always great to contribute to open source.

Question: what is sidecar you're referring to?

---

### Comment 6 - pomazanbohdan (October 27, 2025 at 20:28:52Z)

> Question: what is sidecar you're referring to?

https://github.com/bmad-code-org/BMAD-METHOD/tree/v6-alpha?tab=readme-ov-file#-unprecedented-customizability

https://github.com/bmad-code-org/BMAD-METHOD/issues/823

---

### Comment 7 - amrhas82 (October 27, 2025 at 20:55:07Z)

never mind, i understood. what do you think about this PR? Is it in or out?

---

## Analysis of Conversation

### Key Points Raised

1. **Author's Intent (amrhas82)**
   - Created global-level subagent installation (vs project-level only)
   - Optimized and compacted BMAD files for Claude/OpenCode subagent format
   - Reduced context consumption through optimization
   - Fixed directory structure (corrected /agent vs /agents)
   - Added 3 simplified workflow agents
   - Isolated in separate folder to avoid confusion

2. **Community Member Observations (pomazanbohdan)**
   - Recognizes significant work done
   - Notes this could work separately from main BMAD
   - Mentions v6 development direction includes dynamic agent/command generation
   - Working on SuperClaude stack for autonomous subagent delegation
   - Suggests this represents a different architectural approach than v6's sidecar pattern

3. **Collaboration Discussion**
   - Author open to multiple integration approaches:
     - As expansion pack
     - As reference to external agentic-toolkit repo
     - As separate contribution
   - Author references external repo as alternative home
   - Final status unclear - awaiting decision on integration

### Technical Context

**What Author Built:**

- Subagent system optimized for global installation
- Context-efficient agent definitions
- Two workflow approaches:
  1. Simple 3-step (create-prd, generate-tasks, process-task-list)
  2. Full BMAD method adapted for subagents

**What v6 is Building (per comments):**

- Dynamic agent/command generation via `./bmad` CLI
- Sidecar pattern for agent customization
- Autonomous subagent delegation with context management
- SuperClaude stack integration

### Key Decision Point

**The fundamental question:** Does this static, pre-built subagent approach align with v6's dynamic generation architecture, or should it live as a separate toolkit?

The conversation reveals a potential architectural divergence:

- **PR #821**: Pre-built, optimized, copy-paste subagents
- **v6 Vision**: Dynamically generated, template-based agents with sidecar customization

### Open Questions from Thread

1. Will this be accepted as part of v6?
2. Should it be an expansion pack/module?
3. Should it remain in external agentic-toolkit repo?
4. How does this relate to the sidecar pattern?
5. What's the decision timeline?

### External Resource Reference

Author maintains separate repo: https://github.com/amrhas82/agentic-toolkit

- Contains same subagents plus additional tooling
- Positions as comprehensive "agentic toolkit"
- Includes multiple AI workflow approaches
- Development tools and environment setup
- MCP integrations (200+ servers)
