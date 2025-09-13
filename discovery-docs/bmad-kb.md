id: bmad-growth-marketing
name: BMAD Growth Marketing Expansion Pack
description: An AI orchestration framework that transforms how solo entrepreneurs, digital agencies, and consultancies approach growth marketing by providing specialized AI agent teams, adaptive workflows, and intelligent automation for the entire marketing lifecycle.

# BMAD Growth Marketing Knowledge Base

## Overview

The BMAD Growth Marketing Expansion Pack adapts the BMAD-Method framework for solo entrepreneurs, digital agencies, and marketing consultants. This extension provides specialized AI agent teams, adaptive workflows, and intelligent automation for the entire marketing lifecycle.

### Key Features

- **5 Specialized Agent Teams**: Growth Intelligence, Product Experience, Content & Community, Performance Marketing, and Technology Integration teams that work together seamlessly.
- **Adaptive Organizational Design**: The framework scales from a solo entrepreneur to agency-level operations without requiring complete rebuilds.
- **Tool-Agnostic Integration**: Connect any marketing tools and platforms best suited for your business model rather than forcing platform lock-in.
- **Systematic Growth Workflows**: Utilize proven marketing frameworks for everything from market analysis to campaign execution.
- **Discovery-Driven Onboarding**: A comprehensive workflow captures your business model and configures the optimal agent team structure to meet your objectives.

### When to Use BMAD Growth Marketing

- **Systematize Marketing Operations**: Build repeatable growth systems to move beyond manual, inconsistent marketing efforts.
- **Scale Agency Service Delivery**: Standardize service offerings, increase client retention, and scale team operations efficiently.
- **Develop Repeatable Growth Systems**: For solo entrepreneurs looking to increase MRR by 3-5x and prepare for team expansion.
- **Automate Content & Campaign Creation**: Generate ad copy, blog posts, social media content, and email sequences at scale.
- **Perform In-Depth Market Analysis**: Conduct comprehensive SEO audits, competitor analysis, and customer journey mapping.
- **Productize Marketing Expertise**: For consultants looking to scale beyond the "time-for-money" trap by creating systematized methodologies.

## How BMAD Growth Marketing Works

### The Core Method

BMAD Growth Marketing transforms you into a "Growth Strategist"—orchestrating specialized AI agent teams through the entire marketing lifecycle:

1.  **You Strategize, AI Executes**: You provide the creative vision and business goals; agents handle the data analysis, content creation, and tactical execution.
2.  **Specialized Agent Teams**: Each team masters one core aspect of growth: Intelligence, Product Experience, Content, Performance, or Technology.
3.  **Structured Workflows**: Proven marketing frameworks guide your strategic process, ensuring a systematic and coherent approach to growth.
4.  **Data-Driven Iteration**: Agents continuously analyze performance data to provide insights and recommendations for iterative refinement and optimization.

### The Three-Phase Approach

#### Phase 1: Strategy & Foundation

-   Perform in-depth market and competitor analysis.
-   Develop detailed customer personas and journey maps.
-   Conduct keyword research and SEO opportunity analysis.
-   Create a comprehensive growth strategy and campaign roadmap.

#### Phase 2: Execution & Implementation

-   Generate SEO-optimized blog posts, website copy, and social media content calendars.
-   Produce ad copy and creative variations for paid campaigns.
-   Build automated email nurturing sequences and no-code automation workflows.
-   Develop landing page wireframes and UI components for key conversions.

#### Phase 3: Analysis & Optimization

-   Monitor campaign performance with custom analytics dashboards.
-   Analyze user data to identify high-value customer segments for targeting.
-   Simulate A/B tests for ad copy and landing pages to improve conversion rates.
-   Refine strategy and re-allocate resources based on data-driven insights.

agent_teams:
  - name: Growth Intelligence Agent
    description: Specializes in data analysis, strategic planning, and generating market insights to inform growth strategy.
    core_skills:
      - Strategic analysis of large documents and reports.
      - Data analysis and pattern recognition in structured data (CSVs).
      - Competitor analysis and executive summarization.
      - SEO auditing and keyword opportunity analysis.
      - Customer persona development and journey mapping.

  - name: Product Experience Agent
    description: Focuses on the user journey, product-led growth, brand identity, and conversion-focused design and code.
    core_skills:
      - UI/UX wireframing and conversion-optimized design.
      - Front-end code generation for A/B testing and UI components.
      - Multi-file code debugging and refactoring for user-facing features.
      - Brand identity and design system development.
      - User flow diagramming and analysis.

  - name: Content & Community Agent
    description: Masters content creation, brand storytelling, and audience engagement across various platforms.
    core_skills:
      - High-volume, creative content generation (social media posts).
      - Structured, brand-aligned content creation (blog post outlines).
      - Multimodal analysis for design and content feedback (image analysis).
      - SEO-optimized long-form content writing.
      - Email copywriting and template creation.

  - name: Performance Marketing Agent
    description: Manages paid acquisition, conversion rate optimization (CRO), and data-driven campaign execution.
    core_skills:
      - Ad copy and headline generation for paid campaigns.
      - Customer segmentation from large user datasets.
      - Landing page code generation (HTML/CSS).
      - Marketing automation and email sequence development.
      - Lead magnet and asset creation.

  - name: Technology Integration Agent
    description: Handles the technical backbone of the marketing stack, including API integrations, automation, and system implementation.
    core_skills:
      - Production-quality scriptwriting for API integrations (Python).
      - System architecture and data pipeline planning from diagrams.
      - No-code automation workflow creation (Zapier, Make).
      - Technical SEO implementation.
      - AI-powered chatbot script development.

Key Architectural Components:

1.  **Agents** (`/expansion-packs/bmad-growth-marketing/agents/`)
    * **Purpose**: Each markdown file defines a specialized AI agent for a specific growth marketing role (e.g., Market Analyst, Content Strategist, Performance Marketer).
    * **Structure**: Contains YAML headers specifying the agent's persona, capabilities, and dependencies.
    * **Dependencies**: Lists tasks, templates, checklists, and data files the agent can use.
    * **Startup Instructions**: Can load project-specific documentation (e.g., brand guidelines, campaign briefs) for immediate context.

2.  **Agent Teams** (`/expansion-packs/bmad-growth-marketing/agent-teams/`)
    * **Purpose**: Define collections of agents bundled together for specific marketing objectives.
    * **Examples**: `team-all.yaml` (comprehensive growth team), `team-content-engine.yaml` (content creation focus).
    * **Usage**: Creates pre-packaged contexts for executing complex marketing strategies.

3.  **Workflows** (`/expansion-packs/bmad-growth-marketing/workflows/`)
    * **Purpose**: YAML files defining prescribed sequences of steps for specific marketing initiatives.
    * **Types**: Workflows for market analysis, campaign launches, content strategy development, and performance reporting.
    * **Structure**: Defines agent interactions, artifacts created (e.g., reports, ad copy), and transition conditions.

4.  **Reusable Resources**
    * **Templates** (`/expansion-packs/bmad-growth-marketing/templates/`): Markdown templates for market analysis briefs, SEO audits, and content calendars.
    * **Tasks** (`/expansion-packs/bmad-growth-marketing/tasks/`): Instructions for specific repeatable actions like "generate-ad-variations" or "analyze-competitor-traffic".
    * **Checklists** (`/expansion-packs/bmad-growth-marketing/checklists/`): Quality assurance checklists for campaign pre-launch, SEO implementation, and content publishing.
    * **Data** (`/expansion-packs/bmad-growth-marketing/data/`): Core knowledge base (this file), marketing frameworks, and persona documents.

frameworks:
  - A complete, curated list of digital marketing frameworks is available in the knowledge base.
  - See file: `/expansion-packs/bmad-growth-marketing/data/frameworks.md`

templates:
  - This expansion pack includes a library of pre-built templates for generating key marketing deliverables.
  - See file: `/expansion-packs/bmad-growth-marketing/templates/templates.md`

tasks:
  - This expansion pack includes a library of repeatable tasks that can be executed by the agent teams.
  - See directory: `/expansion-packs/bmad-growth-marketing/tasks/`