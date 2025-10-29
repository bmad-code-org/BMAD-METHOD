# Pull Request #821 Summary

## Title

Ready to use subagents for opencode/claude

## Author

amrhas82

## Status

- **State**: Open
- **Created**: 2025-10-26T16:42:18Z
- **Updated**: 2025-10-27T20:55:08Z
- **Draft**: No
- **Mergeable**: Yes
- **Merged**: No

## Description

Using your sophisticated BMad Method I adapted, compacted them as subagents to save context and added ai-dev-tasks 3 simple steps subagents to give users full fledged 2 approaches to spec engineering through Simple (ai-dev-tasks) or BMad Method. Tested on both and can be invoked with @agent_name and has its extensive manual for easy install. Some correction to opencode bmad configurations as well

## Statistics

- **Commits**: 1
- **Additions**: 27,699 lines
- **Deletions**: 0 lines
- **Changed Files**: 152 files

## Branch Information

- **Base**: bmad-code-org:main (SHA: 3b6a507ab8fde47459a5f981dbfdc4677107e4a6)
- **Head**: amrhas82:main (SHA: ee5ade12602b5c308017c3002c69020fd8a07f33)

## Key Changes

### New Directory Structure

- `subagentic/claude-subagents/` - Main subagents directory
  - `agents/` - Agent definitions (13 agents)
  - `agent-teams/` - Team configurations (4 teams)
  - `checklists/` - Quality checklists (5 checklists)
  - `AGENTS.md` - Main documentation file

### Agent List (13 Total)

1. **1-create-prd** - Creates PRDs through structured discovery
2. **2-generate-tasks** - Converts PRDs into actionable task lists
3. **3-process-task-list** - Manages implementation with markdown task lists
4. **business-analyst** - Strategic analysis and market research
5. **full-stack-dev** - Story implementation and development
6. **holistic-architect** - System design and architecture
7. **master** - Universal task executor
8. **orchestrator** - Workflow coordination
9. **product-manager** - PRD creation and product strategy
10. **product-owner** - Backlog management and story refinement
11. **qa-test-architect** - Quality assessment and testing
12. **scrum-master** - Story creation and agile guidance
13. **ux-expert** - UI/UX design and specifications

### Agent Teams (4 Total)

1. **team-all** - All core system agents
2. **team-fullstack** - Full stack development team
3. **team-ide-minimal** - Minimal IDE team (PO, SM, Dev, QA)
4. **team-no-ui** - Backend-only team

### Checklists (5 Total)

1. **architect-checklist.md** - Architecture validation
2. **change-checklist.md** - Change navigation
3. **pm-checklist.md** - Product requirements validation
4. **po-master-checklist.md** - Product owner master validation
5. **story-dod-checklist.md** - Story definition of done
6. **story-draft-checklist.md** - Story draft validation

## Notable Files

- `.idea/` - IntelliJ IDEA project files added
- `AGENTS.md` - Main documentation (243 lines)
- All agents use markdown frontmatter format with metadata

## Review Comments

- 7 comments on the PR
- 0 review comments

## Links

- **PR URL**: https://github.com/bmad-code-org/BMAD-METHOD/pull/821
- **Diff URL**: https://github.com/bmad-code-org/BMAD-METHOD/pull/821.diff
- **Patch URL**: https://github.com/bmad-code-org/BMAD-METHOD/pull/821.patch
- **Full Conversation**: See PR-821-conversation.md in this directory
- **External Repo**: https://github.com/amrhas82/agentic-toolkit

## Notes

This PR introduces a comprehensive subagent system for Claude/OpenCode that provides an alternative approach to the BMad Method, focusing on context-saving and easy invocation through @agent_name syntax.

---

## Extended Context Analysis

### Related External Project: Agentic-Toolkit

**Repository:** https://github.com/amrhas82/agentic-toolkit

The author maintains a separate comprehensive toolkit that provides broader context for this PR:

#### What Agentic-Toolkit Offers

**Four AI Workflow Approaches:**

1. **Simple Workflow** (`ai/simple/`)
   - 3-step process: Create PRD → Generate Tasks → Process Task List
   - Streamlined for features, small projects, quick iterations
   - Perfect for rapid development without complexity

2. **Claude Subagents** (`ai/claude-subagents/`)
   - **THIS IS WHAT'S IN PR #821**
   - BMAD + Simple hybrid
   - Context-optimized and compacted
   - Production-ready, tested agents
   - Direct deployment: Copy entire folder to `~/.claude`
   - Invokable via `@agent_name` syntax

3. **OpenCode Subagents** (`ai/opencode-subagents/`)
   - Same agents optimized for OpenCode
   - Copy to `~/.config/opencode`
   - Invoke naturally with role references

4. **BMAD Method** (`ai/bmad/`)
   - Full BMAD framework with ready agents
   - Separate implementations for Claude and OpenCode
   - Shared core framework files
   - BMB (BMAD Builder) for custom agent creation

5. **Task Master** (`ai/README-task-master.md`)
   - AI-powered task management system
   - PRD-to-tasks automation
   - MCP integration for Cursor, Windsurf, VS Code, Claude Code
   - Cross-platform CLI with multiple AI provider support

**Additional Components:**

- **Development Tools** (`tools/`): Automated installation scripts for Tmux, Neovim, etc.
- **Environment Setup** (`env/`): Complete Ubuntu/Debian dev environment configs
- **Integrations** (`integrations/`): 200+ MCP servers documented
- **System Requirements**: Ubuntu 20.04+, 4GB+ RAM, 10GB+ storage

#### Key Architectural Differences

**Agentic-Toolkit Philosophy:**

- **Static, pre-built agents** ready for immediate use
- **Copy-paste deployment** model
- **Multiple framework options** (Simple, BMAD, Task Master)
- **Global installation** approach (~/.claude, ~/.config/opencode)
- **Context optimization** through compaction
- **Dual targeting**: Both Claude and OpenCode

**BMAD v6 Philosophy (from PR comments):**

- **Dynamic generation** via `./bmad` CLI
- **Template-based** agent creation
- **Sidecar pattern** for customization
- **Project-level** installation via npx
- **Living documentation** that updates with method
- **Single source of truth** architecture

### The Core Issue

This PR represents a **fundamental architectural divergence**:

1. **PR #821 Approach**: "Here are 13 fully-formed subagents you can use right now"
2. **v6 Approach**: "Here's a system that generates agents dynamically from templates"

#### Why This Matters

**Static Pre-built Agents (PR #821):**

- ✅ Immediate usability
- ✅ Tested and optimized
- ✅ No build step required
- ❌ Become stale if BMAD evolves
- ❌ Manual updates needed
- ❌ Potential for divergence from main BMAD

**Dynamic Generated Agents (v6):**

- ✅ Always in sync with BMAD updates
- ✅ Single source of truth
- ✅ Customizable via sidecar
- ✅ Maintainable long-term
- ❌ Requires build/generation step
- ❌ More complex initial setup

### Strategic Considerations

#### Option 1: Accept as Static "Snapshot" Module

- Add as `src/modules/subagent-snapshot/`
- Document as "v6-alpha compatible static agents"
- Useful for users who want immediate deployment
- Would need version locking and update strategy

#### Option 2: Use as Inspiration for Dynamic Generation

- Extract the optimization patterns
- Use compacted formats as templates
- Build generator that creates similar output
- Maintain through v6 build system

#### Option 3: Reference as External Alternative

- Keep in agentic-toolkit repo
- Link from BMAD docs as "alternative deployment"
- Position as "quick start" vs "integrated approach"
- No maintenance burden on BMAD

#### Option 4: Hybrid Approach

- Accept simple 3-step agents (unique to this PR)
- Use BMAD agents as template inspiration
- Reference agentic-toolkit for full external toolkit
- Build v6 dynamic generation with similar optimization

### Missing from PR #821

Based on agentic-toolkit, the PR doesn't include:

- Task Master framework
- Development tools
- Environment setup scripts
- MCP integration documentation
- Simple workflow documentation (only the agents)
- Build/automation tooling

**This suggests:** PR #821 is a **subset** of agentic-toolkit, specifically the subagent definitions.

### Critical Questions

1. **Does v6 want static pre-built agents at all?**
2. **Is the Simple 3-step workflow worth integrating separately?**
3. **Should BMAD officially support global subagent installation?**
4. **How does this fit with the sidecar pattern vision?**
5. **What's the long-term maintenance model?**

### Test Strategy Implications

Given this analysis, testing should focus on:

1. **Compatibility Testing**
   - Do these static agents work with v6 structure?
   - Schema validation against v6 standards
   - Conflict detection with existing agents

2. **Architectural Alignment**
   - Can these coexist with dynamic generation?
   - Do they create confusion for users?
   - Can they share templates/patterns?

3. **Value Proposition**
   - What unique value beyond v6 capabilities?
   - User experience comparison
   - Maintenance cost analysis

4. **Integration Scenarios**
   - As module: What changes needed?
   - As inspiration: What to extract?
   - As external: What to link/reference?

### Recommendation

Based on the full context, this appears to be a **well-intentioned but architecturally divergent contribution**. The author has built a comprehensive external toolkit where this PR's content fits naturally. The best path forward likely involves:

1. **Declining the PR** (respectfully)
2. **Acknowledging the valuable work**
3. **Linking to agentic-toolkit as alternative**
4. **Potentially extracting optimization patterns** for v6's dynamic generation
5. **Considering the Simple 3-step workflow** separately if it adds unique value

This allows both approaches to coexist without creating confusion or maintenance burden.
