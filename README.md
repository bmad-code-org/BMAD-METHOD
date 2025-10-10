# BMad CORE v6 Alpha

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

## 🚀 Critical: Understanding BMad Method v6a Workflow

**IMPORTANT: Before using this framework, you MUST read the [BMM v6 Workflows Guide](./src/modules/bmm/workflows/README.md).** This document is fundamental to understanding how to use v6 of the BMad Method and explains the revolutionary v6a workflow system with its four phases: Analysis, Planning, Solutioning, and Implementation.

**[Subscribe to BMadCode on YouTube](https://www.youtube.com/@BMadCode?sub_confirmation=1)** and **[Join our amazing, active Discord Community](https://discord.gg/gk8jAdXWmj)**

⭐ **If you find this project helpful or useful, please give it a star in the upper right-hand corner!** It helps others discover BMad-CORE and you will be notified of updates!

## The Universal Human-AI Collaboration Platform

📋 **[View v6 Alpha Open Items & Roadmap](./v6-open-items.md)** - Track what's being worked on and what's coming next!

### ⚠️ Important Alpha Notes

**Note 0 - Frequent Updates:** Updates to the branch will be frequent. When pulling new updates, it's best to delete your node_modules folder and run `npm install` to ensure you have the latest package dependencies.

**Note 1 - Alpha Stability:** ALPHA is potentially an unstable release that could drastically change. While we hope that isn't the case, your testing during this time is much appreciated. Please help us out by filing issues or reaching out in Discord to discuss.

**Note 2 - Work in Progress:** ALPHA is not complete - there are still many small and big features, polish, doc improvements, and more agents and workflows coming ahead of the beta release!

**Note 3 - IDE Required:** ALPHA Web Bundles and Agents are not fully working yet - you will need to use a good quality IDE to test many features, especially with the BMad Method module. However, the new agent builder and standalone agent feature can work great with weaker models - this will still evolve over the coming weeks.

**Note 4 - Contributing:** If you would like to contribute a PR, make sure you are creating your PR against the Alpha Branch and not Main.

## Alpha Installation and Testing

**Prerequisites**: [Node.js](https://nodejs.org) v20+ required

### Option A

Thank you Lum for the suggestion - here is a one-shot instruction to clone just the alpha branch and get started:

`git clone --branch v6-alpha --single-branch https://github.com/bmad-code-org/BMAD-METHOD` and then cd into this directory and run `npm install`.

### Option B

Here are the more detailed step-by-step instructions:

Clone the repo with either:

- `gh repo clone bmad-code-org/BMAD-METHOD`
- `git clone https://github.com/bmad-code-org/BMAD-METHOD.git`
- `git@github.com:bmad-code-org/BMAD-METHOD.git`
  and then cd into the BMAD-METHOD folder.

  You will then need to change to the branch as that will have cloned main, so type:
  - `git checkout v6-alpha`
  - type `git status` and you should see:
    `On branch v6-alpha. Your branch is up to date with 'origin/v6-alpha'.`

### Node Modules install

Now you must install the node_modules with `npm install` - once complete, you should see you have a `node_modules` folder at the root of your project. (BMAD-METHOD/node_modules)

### Install to your new or existing project folder

Now you can run `npm run install:bmad` and follow the installer questions.

NOTE: One of the first questions will ask for a destination - do not accept the default, you want to enter the full path to a new or existing folder of where your project is or will be. If you choose a net new folder, you will have to confirm you want the installer to create the directory for you.

The Core Module will always be installed. The default initial module selection will be BMM for all the core BMad Method functionality and flow from brainstorming through software development.

**Note on installation:** All installs now go to a single folder called `bmad` instead of multiple folders. When you install a module, you may still see folders other than the one you selected in the destination/bmad folder.

This is intentional and not a bug - it will copy over to those other folders only the minimum that is needed because it is shared across the modules. For example, during Alpha to test this feature, BMM relies on the brainstorming feature of the CIS and some items from CORE - so even if you only select BMM, you will still see bmad/core and bmad/cis along with bmad/bmm.

## What is the new BMad Core

BMad-CORE (Collaboration Optimized Reflection Engine) is a framework that brings out the best in you through AI agents designed to enhance human thinking rather than replace it.

Unlike traditional AI tools that do the work for you, BMad-CORE's specialized agents guide you through the facilitation of optimized collaborative reflective workflows to unlock your full potential across any domain. This magic powers the BMad Method, which is just one of the many modules that exist or are coming soon.

## What Makes BMad-Core Different

**Traditional AI**: Does the thinking for you, providing average, bland answers and solutions
**BMad-CORE**: Brings out the best thinking in you and the AI through guided collaboration, elicitation, and facilitation

### Core Philosophy: Human Amplification, Not Replacement

BMad-Core's AI agents act as expert coaches, mentors, and collaborators who:

- Ask the right questions to stimulate your thinking
- Provide structured frameworks for complex problems
- Guide you through reflective processes to discover insights
- Help you develop mastery in your chosen domains
- Amplify your natural abilities rather than substituting for them

## The Collaboration Optimized Reflection Engine

At the heart of BMad-Core lies the **C.O.R.E.** system:

- **Collaboration**: Human-AI partnership where both contribute unique strengths
- **Optimized**: The collaborative process has been refined for maximum effectiveness
- **Reflection**: Guided thinking that helps you discover better solutions and insights
- **Engine**: The powerful framework that orchestrates specialized agents and workflows

## Universal Domain Coverage Through Modules

BMad-CORE works in ANY domain through specialized modules (previously called expansion packs)!

### Available Modules with Alpha Release

- **BMad Core (core)**: Included and used to power every current and future module; includes a master orchestrator for the local environment and one for the web bundles used with ChatGPT or Gemini Gems, for example.

- **[BMad Method (bmm)](./src/modules/bmm/README.md)**: Agile AI-driven software development - the classic that started it all and is still the best - but with v6, massively improved thanks to a rebuild from the ground up built on the new powerful BMad-CORE engine. The BMad Method has also been expanded to use a new "Scale Adaptive Workflow Engine"™. **[See BMM Documentation](./src/modules/bmm/README.md)**

- **[BMad BoMB (bmb)](./src/modules/bmb/README.md)**: The BMad Builder is your Custom Agent, Workflow, and Module authoring tool - it's now easier than ever to customize existing modules or create whatever you can imagine as a standalone module. **[See BMB Documentation](./src/modules/bmb/README.md)**

- **Creative Intelligence Suite (cis)**: Unlock innovation, problem-solving, and creative thinking! Brainstorming that was part of the BMad Method in the past is now part of this standalone module along with other workflows. The power of BMad modules still allows modules to borrow from each other - so the CIS, while standalone, also powers the brainstorming abilities for certain agents within the BMad Method!

## What's New in V6-ALPHA

Stability, customizability, installation Q&A, massive prompt improvements.

Everything has been rewritten from the ground up with best practices and advances learned over previous versions, standardizing on prompt format techniques. There is much more core usage of XML or XML-type tags within markdown, with many conventions and standards that drastically increase agent adherence.

**Customizability** is a key theme of this new version. All agents are now customizable by modifying a file under the installation bmad/\_cfg/agents. Every agent installed will generate an agent file that you can customize.

The nice thing about this is when agents change or update in future versions, your customizations in these sidecar files will never be lost! You can change the name, their personas, how they talk, what they call you, and most exciting - what language they communicate in!

The **BMad installer** is 100% new from the ground up. Along the way you will add:

- Your name (what the agents will call you and how you'll author documents)
- What language you want the agents to communicate in
- Module-specific customization options

When you install, a consolidated agent party is created so now when you use party-mode in the IDE, it is super efficient for the agent running the party to simulate all installed agents. Post alpha release, this will manifest itself in many interesting ways in time for beta - but for now, have fun with party mode and epic sprint retrospectives!

Speaking of installation - everything will now install to a single core bmad folder. No more separate root folders for every module! Instead, all will be contained within bmad/.

All IDE selections now support the option to add special install functionality per module.

For example, with the alpha release, if you select the BMad Method and Claude Code, you will have an option to install pre-created Claude sub-agents. Not only do they get installed, but certain workflows will have injected into their instructions key indicators to the agent when to activate the sub-agents, removing some non-determinism.

The sub-agent experience is still undergoing some work, so install them if you choose, and remove them if they become a pain.

When you read about the BoMB below, it will link to more information about various features in this new evolution of BMad Code. One of the exciting features is the new agent types - there are 3 now! The most exciting are the new standalone tiny agents that you can easily generate and deploy free from any module - specialized for your exact needs.

### BMad Method (BMM)

📚 **[Full BMM Documentation](./src/modules/bmm/README.md)** | **[v6 Workflows Guide](./src/modules/bmm/workflows/README.md)**

The BMad Method is significantly transforming and yet more powerful than ever. **Scale Adaptive** is a new term that means when you start the workflow to create a PRD or a GDD (or a simple tech-spec in the case of simple tasks), you will first answer some questions about the scope of the project, new vs. existing codebase and its state, and other questions. This will trigger a leveling of the effort from 0-4, and based on this scale adaptation, it will guide the workflow in different directions.

Right now, this is still a bit alpha feeling and disjointed, but before beta it will be tied together through all four workflow phases with a potential single orchestration if you choose - or you can still jump right in, especially for simple tasks that just need a simple tech-spec and then right off to development.

To test and experience this now, here is the new main flow for BMM v6 alpha:

(Docs will be all linked in soon with new user guide and workflow diagrams coming this week)

**NOTE:** Game Development expansion packs are all being rolled into the official BMad Method module - along with any more game engine platforms being added. Additionally, game development planning for the GDD is not only scale adaptive, but also adapts to the type of game you are making - so you can plan all that is needed for your dream game!

#### **PHASE 1 - Analysis**

**Analyst:**

- `brainstorm-project`
- `research` (market research, deep research, deep research prompt generation)
- `product-brief`

**Game Designer (Optional):**

- `brainstorm-game`
- `game-brief`
- `research`

---

#### **PHASE 2 - Planning**

**PM:**

- `plan-project`

**Game Designer:**

- `plan-game` (calls the same plan-project workflow, but input docs or your answers should drive it towards GDD)

---

#### **PHASE 3 - Solutioning**

**Architect or Game Architect:**

Just like the scale-adjusted planning, architecture is the same. No more document sharding though!

Now in the IDE you create an architecture that adapts to the type of project you are working on - based on the inputs from your PRD, it will adapt the sections it includes to your project type. No longer is the architecture biased just towards full stack or back-end APIs. There are many more options now, from embedded hardware to mobile to many other options - with many more coming with beta.

- `solution-architecture`

> **Note:** Testing, DevOps, or security concerns beyond the basics are generally not included in the architecture. If it is more complicated, especially for complex massive undertakings, you will be suggested to pull in specific agents to help with those areas. _(Not released with alpha.0, coming soon)_

Once the full architecture is complete, you can still use the PO to run the checklist to validate the epics and stories are still correct - although the architect should also be keeping them updated as needed (needs some tuning during alpha). Once done, then it's time to create the tech spec for your first epic.

- `tech-spec`

The tech spec pulls all technical information from all planning thus far, along with any further research needed from the web to produce an **Epic Tech Spec** - each epic will have one. This is going to make the SM even more capable of finding the info it needs for each story when we get to phase 4!

---

#### **PHASE 4 - Implementation**

And now here we are at phase 4 - where we, just like in BMad Method of yore, use the SM and the Dev Agent. No more QA agent here though; the dev now has a dev task and also a senior dev agent review task.

**Scrum Master (SM) Tasks:**

Before the dev starts, the SM will:

1. `create-story`
2. `story-context` _(NEW!)_

**Story-context** is a game-changing new feature beyond what we had with create-story in the past. Create-story still pulls in all the info it needs from the tech-spec and elsewhere as needed (including previously completed stories), but the generation of the new story-context takes it to a whole new level.

This real-time prep means no more generic devLoadAlways list of story files. During the alpha phase, we will be tuning what goes into this context, but this is going to supercharge and specialize your dev to the story at hand!

---

> **🎉 There are many other exciting changes throughout for you to discover during the alpha BMad Method module!**

## CIS

The CIS has 5 agents to try out, each with their own workflow! This is a new module that will drastically change over time.

- [CIS Readme](./src/modules/cis/readme.md)

### BoMB: BMad Builder (BMB)

📚 **[Full BMB Documentation](./src/modules/bmb/README.md)** | **[Agent Creation Guide](./src/modules/bmb/workflows/create-agent/README.md)**

#### Agent Docs

- [Agent Architecture](src/modules/bmb/workflows/create-agent/agent-architecture)
- [Agent command patterns](src/modules/bmb/workflows/create-agent/agent-command-patterns.md)
- [Agent Types](src/modules/bmb/workflows/create-agent/agent-types.md)
- [Communication Styles](src/modules/bmb/workflows/create-agent/communication-styles.md)

#### Modules

Modules are what we used to call Expansion Packs. A new repository to contribute modules is coming very soon with the beta release where you can start contributing modules - we just want to make sure the final format and conventions are stable. A module will generally be made up of agents and workflows. Tasks are still also possible, but generally should be avoided in favor of more flexible workflows. Workflows can have sub-workflows and soon will support a standardized multi-workflow orchestration pattern that the BMad master will be able to guide users through.

- [Module Structure](src/modules/bmb/workflows/create-module/module-structure.md)

#### Workflows

What used to be tasks and create-doc templates are now all workflows! Simpler, yet more powerful and support many ways of achieving many different outcomes! A lot more documentation will be coming. This document is used by the agent builder to generate workflows or convert to workflows, but there is a lot more than what we have documented here in this alpha doc.

- [Workflow Creation Guide](src/modules/bmb/workflows/create-workflow/workflow-creation-guide)

### Installer Changes

- [IDE Injections](docs/installers-bundlers/ide-injections)
- [Installers Modules Platforms References](docs/installers-bundlers/installers-modules-platforms-reference)
- [Web Bundler Usage](docs/installers-bundlers/web-bundler-usage)
- [Claude Code Sub Module BMM Installer](src/modules/bmm/sub-modules/claude-code/readme.md)

## Support & Community

- 💬 [Discord Community](https://discord.gg/gk8jAdXWmj) - Get help, share ideas, collaborate
- 🐛 [Issue Tracker](https://github.com/bmad-code-org/BMAD-METHOD/issues) - Bug reports and feature requests
- 💬 [Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions) - Community conversations

## Contributing

We welcome contributions and new module development!

📋 **[Read CONTRIBUTING.md](CONTRIBUTING.md)** - Complete contribution guide

## License

MIT License - see [LICENSE](LICENSE) for details.

## Trademark Notice

BMAD™ and BMAD-METHOD™ are trademarks of BMad Code, LLC. All rights reserved.

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

<sub>Built with ❤️ for the human-AI collaboration community</sub>
