---
title: Official Modules
description: Add-on modules for building custom agents, automation, creative intelligence, game development, design, and testing
sidebar:
  order: 4
---

BMad extends through official modules that you select during installation. These add-on modules provide specialized agents, workflows, and tasks for specific domains beyond the built-in core and BMM (Agile suite).

:::tip[Installing Modules]
Run `npx bmad-method install` and select the modules you want. The installer handles downloading, configuration, and IDE integration automatically.
:::

## BMad Builder

Create custom agents, workflows, and domain-specific modules with guided assistance. BMad Builder is the meta-module for extending the framework itself.

- **Code:** `bmb`
- **npm:** [`bmad-builder`](https://www.npmjs.com/package/bmad-builder)
- **GitHub:** [bmad-code-org/bmad-builder](https://github.com/bmad-code-org/bmad-builder)

**Provides:**

- Agent Builder -- create specialized AI agents with custom expertise and tool access
- Workflow Builder -- design structured processes with steps and decision points
- Module Builder -- package agents and workflows into shareable, publishable modules
- Interactive setup with YAML configuration and npm publishing support

## Creative Intelligence Suite

AI-powered tools for structured creativity, ideation, and innovation during early-stage development. The suite provides multiple agents that facilitate brainstorming, design thinking, and problem-solving using proven frameworks.

- **Code:** `cis`
- **npm:** [`bmad-creative-intelligence-suite`](https://www.npmjs.com/package/bmad-creative-intelligence-suite)
- **GitHub:** [bmad-code-org/bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

**Provides:**

- Innovation Strategist, Design Thinking Coach, and Brainstorming Coach agents
- Problem Solver and Creative Problem Solver for systematic and lateral thinking
- Storyteller and Presentation Master for narratives and pitches
- Ideation frameworks including SCAMPER, Reverse Brainstorming, and problem reframing

## BMad Automator

Experimental automation module for generating implementation-ready story epics and running supported BMAD workflows with less manual orchestration. The module currently targets Claude and Codex workflows.

- **Code:** `automator`
- **npm:** [`bmad-story-automator`](https://www.npmjs.com/package/bmad-story-automator)
- **GitHub:** [bmad-code-org/bmad-automator](https://github.com/bmad-code-org/bmad-automator)
- **Default channel:** `next`

**Provides:**

- Epic-building automation for story-driven delivery
- Experimental workflow support for Claude and Codex users
- A faster path from planning artifacts to actionable implementation work
- Early-access functionality that may change more quickly than stable modules

## Game Dev Studio

Structured game development workflows adapted for Unity, Unreal, Godot, and custom engines. Supports rapid prototyping through Quick Flow and full-scale production with epic-driven sprints.

- **Code:** `gds`
- **npm:** [`bmad-game-dev-studio`](https://www.npmjs.com/package/bmad-game-dev-studio)
- **GitHub:** [bmad-code-org/bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

**Provides:**

- Game Design Document (GDD) generation workflow
- Quick Dev mode for rapid prototyping
- Narrative design support for characters, dialogue, and world-building
- Coverage for 21+ game types with engine-specific architecture guidance

## Whiteport Design Studio

Strategic UX and design-first planning module for teams that need stronger product experience framing before implementation. WDS expands BMAD with structured UX discovery and design planning workflows.

- **Code:** `wds`
- **npm:** [`bmad-wds`](https://www.npmjs.com/package/bmad-wds)
- **GitHub:** [bmad-code-org/bmad-method-wds-expansion](https://github.com/bmad-code-org/bmad-method-wds-expansion)

**Provides:**

- Design-first planning methodology for product and UX work
- Structured UX discovery before solutioning and implementation
- Strategic design workflows that complement BMAD's product planning flow
- Whiteport Design Studio skills exposed through the installer module picker

## Test Architect (TEA)

Enterprise-grade test strategy, automation guidance, and release gate decisions through an expert agent and nine structured workflows. TEA goes well beyond the built-in QA agent with risk-based prioritization and requirements traceability.

- **Code:** `tea`
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)
- **GitHub:** [bmad-code-org/bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)

**Provides:**

- Murat agent (Master Test Architect and Quality Advisor)
- Workflows for test design, ATDD, automation, test review, and traceability
- NFR assessment, CI setup, and framework scaffolding
- P0-P3 prioritization with optional Playwright Utils and MCP integrations

## Community and Custom Modules

The interactive community module picker has been retired. Install community or third-party modules with `--custom-source <git-url-or-path>` from a Git repository or local path. See [Install custom and community modules](../how-to/install-custom-modules.md).
