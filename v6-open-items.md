# v6 Pending Items

## Needed before Alpha → Beta

Aside from stability and bug fixes found during the alpha period - the main focus will be on the following:

- NPX installer
- github pipelines, branch protection, vulnerability scanners
- subagent injections reenabled
- Solutioning Architecture
  - is not asking for advanced elicitation
  - the order of the document needs to rework the start to first align on what type of project architecture it is
  - the architect put out some other not asked for documents as part of the final step
  - the architect started dumping out the epic 1 tech spec with way too much prescriptive code in it
- both the PRD and the solutioning process need to work in more of the questioning before dumping out a section (this might be happening since so much is already known from the brief though)
- the UX Agent ux-spec process needs updates to be MUCH more interactive
- the UX agent needs to be given commands to generate comps or mock ups in HTML - it works really well, just need to make it an actual thing the agent offers to do

--- done ---

- Done - Brownfield v6 integrated into the workflow.
- Done - Full workflow single file tracking.
- Done - BoMB Tooling included with module install
- Done - All project levels (0 through 4) manual flows validated through workflow phase 1-4 for greenfield and brownfield
- Done - bmm existing project scanning and integration with workflow phase 0-4 improvements
- DONE: Single Agent web bundler finalized - run `npm run bundle'
- DONE: 4->v6 upgrade installer fixed.
- DONE: v6->v6 updates will no longer remove custom content. so if you have a new agent you created for example anywhere under the bmad folder, updates will no longer remove them.
- DONE: if you modify an installed file and upgrade, the file will be saved as a .bak file and the installer will inform you.
- DONE: Game Agents comms style WAY to over the top - reduced a bit.
- DONE: need to nest subagents for better organization.
- DONE: Quick note on BMM v6 Flow
- DONE: CC SubAgents installed to sub-folders now.
- DONE: Qwen TOML update.
- DONE: Diagram alpha BMM flow. - added to src/modules/bmm/workflows/
- DONE: Fix Redoc task to BMB.
- DONE: Team Web Bundler functional
- DONE: Agent improvement to loading instruction insertion and customization system overhaul
- DONE: Stand along agents now will install to bmad/agents and are able to be compiled by the installer also

## Needed before Beta → v0 release

Once the alpha is stabilized and we switch to beta, work on v4.x will freeze and the beta will merge to main. The NPX installer will still install v4 by default, but people will be able to npm install the beta version also.

- Orchestration tracking works consistently across all workflow phases on BMM module
- Single Reference Architecture
- Module repository and submission process defined
- Final polished documentation and user guide for each module
- Final polished documentation for overall project architecture
- MCP Injections based on installation selection
- sub agent optimization
- TDD Workflow Integration
- BMad-Master BMad-Init workflow will be a single entrypoint agent command that will set the user on the correct path and workflow. BMad-Init will become very powerful in the future, empowering the BMad Master to be a full orchestrator across any current or future module.

## Late Beta or Post v0 official release items

- Installer offers installation of vetted community modules
- DevOps Module
- Security Module
- Further BoMB improvements
- 2-3 functional Reference Architecture Project Scaffolds and community contribution process defined
-
