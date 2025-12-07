# WDS Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: wds-workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>

<workflow>

<step n="1" goal="Welcome and understand project">
<output>Welcome to Whiteport Design Studio, {user_name}! 🎨

I'm here to help you set up your design project. WDS provides a structured approach to design - from strategic vision through detailed specifications.

Let's figure out which phases you need.</output>

<ask>Tell me about your project in a few sentences. What are you designing?</ask>
<action>Store user_description</action>
<action>Analyze description for project indicators:
- "landing page", "single page", "simple" → landing-page path
- "product", "platform", "app", "system", "full" → full-product path
- "strategy", "research", "discovery", "planning" → digital-strategy path
- "design system", "components", "library" → design-system path
- "feature", "enhancement", "addition" → feature-enhancement path
- "quick", "prototype", "poc", "test" → quick-prototype path
</action>
<template-output>user_description</template-output>
</step>

<step n="2" goal="Confirm project type">
<output>Based on what you shared, this sounds like a **{{detected_project_type}}** project.</output>

<ask>Does that sound right?

1. Yes, that's correct
2. No, let me explain more
3. Show me all the options

Choice [1/2/3]:</ask>

<check if="choice == 2">
  <ask>Tell me more - what's the scope and complexity?</ask>
  <action>Re-analyze and update detected_project_type</action>
  <action>Return to step 2</action>
</check>

<check if="choice == 3">
  <output>WDS supports these project types:

**1. Full Product** 🚀
All 6 phases - complete design journey from vision to handoff
Best for: New products, platforms, complex applications

**2. Landing Page** 📄
Phases 1 (Brief), 4 (Design), optional 5 (Design System)
Best for: Marketing sites, single-page apps, simple projects

**3. Feature Enhancement** ✨
Phases 2 (Trigger Map), 4 (Design), 6 (PRD Finalization)
Best for: Adding features to existing products

**4. Digital Strategy** 🧭
Phases 1 (Brief), 2 (Trigger Map) only
Best for: Discovery, research, product strategy

**5. Design System Only** 🎨
Phases 4 (Design), 5 (Design System)
Best for: Building component libraries

**6. Quick Prototype** ⚡
Phase 4 only
Best for: Rapid prototyping, proof of concepts</output>

  <ask>Which fits your project?

1. Full Product
2. Landing Page
3. Feature Enhancement
4. Digital Strategy
5. Design System Only
6. Quick Prototype

Choice [1-6]:</ask>
  <action>Map choice to project_type</action>
</check>

<template-output>project_type</template-output>
</step>

<step n="3" goal="Project Brief level">
<output>Every WDS project starts with a Project Brief - so agents understand what you're building and why.</output>

<check if="project_type in [full-product, digital-strategy]">
  <output>For **{{project_type}}** projects, a **Complete Project Brief** is included.

This covers:
- Vision & positioning
- Target users (ICP)
- Success criteria
- Competitive landscape
- Strategic constraints</output>
  <action>Set brief_level = "complete"</action>
</check>

<check if="project_type in [quick-prototype, landing-page]">
  <output>For **{{project_type}}** projects, a **Simplified Project Brief** keeps things fast.

This covers:
- Scope & challenge
- Opportunity
- Design goals</output>
  <action>Set brief_level = "simplified"</action>
</check>

<check if="project_type in [feature-enhancement, design-system-only]">
  <ask>Project Brief depth:

1. **Simplified** (5-10 min)
   - Scope & challenge
   - Opportunity
   - Design goals
   Best for: Quick features, time-pressured work
   
2. **Complete** (30-60 min)
   - Vision & positioning
   - Target users (ICP)
   - Success criteria
   - Competitive landscape
   Best for: When you want strategic clarity

Choice [1/2]:</ask>

  <check if="choice == 1">
    <action>Set brief_level = "simplified"</action>
  </check>

  <check if="choice == 2">
    <action>Set brief_level = "complete"</action>
  </check>
</check>

<template-output>brief_level</template-output>
</step>

<step n="4" goal="Configure languages">
<output>WDS needs to know what language to write specifications in and what languages your product will support.</output>

<ask>**Specification Language** - What language should WDS write the design specifications in?

Common choices:
1. **English** (EN) - Default, widely used
2. **Swedish** (SE)
3. **Norwegian** (NO)
4. **Danish** (DK)
5. **Other** - I'll specify

Choice [1-5]:</ask>
<action>Store specification_language</action>
<template-output>specification_language</template-output>

<ask>**Product Languages** - What languages will the final product support?

List them separated by commas (e.g., "EN, SE" or "EN, SE, NO, DK"):

Common language codes:
- EN = English
- SE = Swedish
- NO = Norwegian
- DK = Danish
- FI = Finnish
- DE = German
- FR = French
- ES = Spanish

Product languages:</ask>
<action>Store product_languages (parse as array)</action>
<action>Validate language codes</action>
<template-output>product_languages</template-output>

<output>✅ **Language Configuration:**
- **Specifications written in:** {{specification_language}}
- **Product supports:** {{product_languages_list}}

All text specifications will include translations for: {{product_languages_list}}</output>
</step>

<step n="5" goal="Configure folder naming">
<output>WDS creates folders in your project's `docs/` directory. Let's configure how they're named.</output>

<ask>Folder prefix style:

1. **Letters** (A-Product-Brief, B-Trigger-Map, C-...)
   - Distinctive WDS branding
   - Easy visual grouping
   
2. **Numbers** (01-Product-Brief, 02-Trigger-Map, 03-...)
   - Traditional sequential numbering
   - Familiar format

Choice [1/2]:</ask>
<action>Set folder_prefix based on choice (letters/numbers)</action>
<template-output>folder_prefix</template-output>

<ask>Folder capitalization:

1. **Title-Case** (A-Product-Brief, B-Trigger-Map)
   - Easier to read for non-technical stakeholders
   
2. **lowercase** (a-product-brief, b-trigger-map)
   - Developer-friendly convention

Choice [1/2]:</ask>
<action>Set folder_case based on choice (title/lowercase)</action>
<template-output>folder_case</template-output>
</step>

<step n="6" goal="Design System decision">
<check if="project_type in [full-product, landing-page, feature-enhancement]">
  <output>The **Design System** phase is optional but valuable for building reusable components.</output>
  
  <ask>Include Design System phase?

1. **Yes** - Build a component library alongside design work
2. **No** - Keep it simple, focus on page designs only
3. **Help me decide**

Choice [1/2/3]:</ask>

  <check if="choice == 3">
    <output>Include Design System if:
- You have multiple pages with shared patterns
- You want consistent components across the product
- You're building for a team that needs a component library
- You plan to hand off to developers who need component docs

Skip Design System if:
- It's a simple, one-off project
- You're using an existing design system (Material, Chakra, etc.)
- You need to move fast without component documentation</output>
    <ask>Based on this, include Design System? (y/n)</ask>
    <action>Set include_design_system based on answer</action>
  </check>

  <check if="choice == 1">
    <action>Set include_design_system = true</action>
  </check>

  <check if="choice == 2">
    <action>Set include_design_system = false</action>
  </check>
</check>

<check if="project_type == design-system-only">
  <action>Set include_design_system = true</action>
</check>

<template-output>include_design_system</template-output>
</step>

<step n="7" goal="Component library selection">
<check if="include_design_system == true">
  <output>For the Design System, you can build custom components or use an existing library.</output>
  
  <ask>Component library approach:

1. **Custom** - Build your own from scratch
2. **Shadcn/ui** - Copy-paste React components (recommended for flexibility)
3. **Chakra UI** - Comprehensive React library
4. **Radix UI** - Headless accessible primitives
5. **Material UI** - Material Design components
6. **Tailwind CSS** - Utility-first styling (combine with headless)
7. **Other** - I'll specify later
8. **Undecided** - I'll choose during the project

Choice [1-8]:</ask>
  <action>Set component_library based on choice</action>
  <template-output>component_library</template-output>
</check>
</step>

<step n="8" goal="Generate workflow path">
<action>Load path file: {path_files}/{{project_type}}.yaml</action>
<action>Build workflow_items from path file</action>
<action>Apply brief_level setting (simplified or complete)</action>
<action>Apply include_design_system setting</action>
<action>Generate folder names based on folder_prefix and folder_case</action>
<action>Set generated date</action>

<template-output>generated</template-output>
<template-output>workflow_path_file</template-output>
<template-output>workflow_items</template-output>
<template-output>folder_names</template-output>
<template-output>brief_level</template-output>
<template-output>specification_language</template-output>
<template-output>product_languages</template-output>
</step>

<step n="9" goal="Review and create">
<output>Your WDS project setup:

**Project:** {{project_name}}
**Type:** {{project_type}}
**Project Brief:** {{#if brief_level == 'complete'}}Complete{{else}}Simplified{{/if}}
**Specification Language:** {{specification_language}}
**Product Languages:** {{product_languages_list}}
**Design System:** {{include_design_system}}
{{#if component_library}}**Component Library:** {{component_library}}{{/if}}

**Phases enabled:**
{{#each enabled_phases}}
- Phase {{this.number}}: {{this.name}} → `{{this.folder}}/`
{{/each}}

**Folder naming:** {{folder_prefix}} + {{folder_case}}
Example: `{{example_folder_name}}`
</output>

<ask>Create WDS workflow tracking file? (y/n)</ask>

<check if="y">
  <action>Generate YAML from template with all variables</action>
  <action>Save to {output_folder}/wds-workflow-status.yaml</action>
  <action>Identify first workflow and agent</action>

<output>✅ **Created:** {output_folder}/wds-workflow-status.yaml

**Your WDS journey begins!**

**First Phase:** {{first_phase_name}}
**Agent:** {{first_agent}}
**Folder:** {{first_folder}}

To start, activate **{{first_agent}}** and begin {{first_phase_name}}.

To check progress anytime: `/bmad:wds:workflows:workflow-status`

Happy designing! 🎨</output>
</check>

<check if="n">
  <output>No problem! Run this workflow again when you're ready.

You can also manually create your project structure:
{{#each enabled_phases}}
- Create `docs/{{this.folder}}/` for {{this.name}}
{{/each}}

Happy designing! 🎨</output>
</check>
</step>

</workflow>

