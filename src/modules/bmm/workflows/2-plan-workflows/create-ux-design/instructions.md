# Create UX Design Workflow Instructions

<workflow name="create-ux-design">

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication style based on {user_skill_level}</critical>
<critical>Communicate all responses in {communication_language} and tailor to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>SAVE PROGRESS after each major step - use <template-output> tags throughout</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, follow workflow.xml substep 2c: SAVE → SHOW checkpoint separator → DISPLAY content → PRESENT options → WAIT for user response</critical>

<step n="0" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

<check if="status file not found">
  <output>No workflow status file found. Create UX Design can run standalone or as part of BMM planning workflow.</output>
  <action>Set standalone_mode = true</action>
</check>

<check if="status file found">
  <action>Load and validate workflow status, check if create-ux-design is completed or out of sequence</action>
  <ask>UX Design already completed or out of sequence. Continue anyway? (y/n)</ask>
  <check if="n">
    <action>Exit workflow</action>
  </check>
  <action>Set standalone_mode = false</action>
</check>
</step>

<step n="1" goal="Discover and load input documents">
<invoke-protocol name="discover_inputs" />
</step>

<step n="2" goal="Understand project and users">
<action>Review loaded context from Step 1</action>

<check if="documents_found">
  <output>I've loaded your project documentation. Let me confirm what I'm seeing:

**Project:** {{project_summary_from_docs}}
**Target Users:** {{user_summary_from_docs}}</output>
<ask>Does this match your understanding? Any corrections or additions?</ask>
</check>

<check if="no_documents_found">
  <ask>Let's start by understanding what you're building.

**What are you building?** (1-2 sentences)
**Who is this for?** (Describe your ideal user)</ask>
</check>

<template-output>project_and_users_confirmed</template-output>
</step>

<step n="3" goal="Define core experience and platform">
<ask>Now let's dig into the experience itself.

**What's the core experience?** (What's the ONE thing users will do most?)
**What should be absolutely effortless?**
**Which user action is most critical to get right?**
**Platform:** Web, mobile app, desktop, multiple?</ask>

<template-output>core_experience_and_platform</template-output>
</step>

<step n="4" goal="Define desired emotional response">
<ask>What should users FEEL when using this?

Empowered and in control? Delighted and surprised? Efficient and productive? Creative and inspired? Calm and focused? Connected and engaged? Something else?

What feeling would make them tell a friend about this?</ask>

<template-output>desired_emotional_response</template-output>
</step>

<step n="5" goal="Gather inspiration and analyze patterns">
<ask>Name 2-3 apps your users already love and USE regularly.

For each one, what do they do well from a UX perspective? What makes the experience compelling?</ask>

<action>Research mentioned apps to analyze current UX patterns and principles</action>
<template-output>inspiration_analysis</template-output>
</step>

<step n="6" goal="Set facilitation approach and synthesize understanding">
<action>Analyze project complexity and set facilitation mode based on {user_skill_level}</action>

<output>Here's what I'm understanding about {{project_name}}:

**Vision:** {{project_vision_summary}}
**Users:** {{user_summary}}
**Core Experience:** {{core_action_summary}}
**Desired Feeling:** {{emotional_goal}}
**Platform:** {{platform_summary}}
**Inspiration:** {{inspiration_summary_with_ux_patterns}}

This helps me understand both what we're building and the experience we're aiming for. Let's start designing!</output>

<action>Load UX design template and initialize output document</action>
<template-output>project_vision</template-output>
</step>

<step n="7" goal="Choose design system">
<action>Identify appropriate design system options based on platform and requirements</action>

<ask>Which design system approach resonates with you?

I'll present options for your platform - think of design systems like foundations that provide proven UI components and patterns, speeding development and ensuring consistency.

- Want complete visual uniqueness? (→ custom)
- Want fast development with great defaults? (→ established system)
- Have brand guidelines to follow? (→ themeable system)</ask>

<template-output>design_system_decision</template-output>
</step>

<step n="8" goal="Identify defining experience">
<ask>What's your app's defining experience - the core interaction that, if we nail it, everything else follows?

When someone describes your app to a friend, what would they say?

Examples: "Swipe to match with people" (Tinder), "Share photos that disappear" (Snapchat), "Have conversations with AI" (ChatGPT)</ask>

<action>Analyze if this core experience has established UX patterns or requires novel pattern design</action>
<template-output>defining_experience</template-output>
</step>

<step n="9" goal="Design novel patterns (if needed)">
<check if="novel_pattern_detected">
  <ask>The {{pattern_name}} interaction is novel! Let's design this interaction systematically.

What's the user's goal? How should they initiate this action? What feedback should they see? How do they know it succeeded? What if something goes wrong?</ask>
<template-output>novel_pattern_mechanics</template-output>
</check>
</step>

<step n="10" goal="Define core experience principles">
<output>Based on our understanding, here are the guiding principles for the entire experience:

**Speed:** {{speed_principle}}
**Guidance:** {{guidance_principle}}
**Flexibility:** {{flexibility_principle}}
**Feedback:** {{feedback_principle}}

These principles will guide every UX decision from here forward.</output>
<template-output>core_experience_principles</template-output>
</step>

<step n="11" goal="Choose color theme and visual foundation">
<ask>Do you have existing brand guidelines or specific color palette? (y/n)

If no, I'll generate theme options based on your project's personality and goals.</ask>

<check if="existing_brand == true">
  <action>Extract and document brand colors, generate semantic color mappings</action>
</check>

<check if="existing_brand == false">
  <action>Generate comprehensive HTML color theme visualizer with multiple options</action>
  <output>🎨 I've created a color theme visualizer! Open {color_themes_html} to explore theme options with complete UI examples.</output>
  <ask>Which color theme direction resonates most? You can choose, combine, or request variations.</ask>
</check>

<action>Define typography system, spacing, and layout foundation</action>
<template-output>visual_foundation</template-output>
</step>

<step n="12" goal="Generate design direction mockups">
<action>Create 6-8 different design direction variations exploring layout, hierarchy, density, interaction patterns, and visual weight</action>

<action>Generate comprehensive HTML design direction showcase with full-screen mockups, interactive states, and comparison tools</action>
<output>🎨 Design Direction Mockups Generated! Open: {design_directions_html}

Each mockup shows a complete vision for your app's look and feel. As you explore, look for:
✓ Which layout feels most intuitive?
✓ Which information hierarchy matches your priorities?
✓ Which interaction style fits your core experience?
✓ Which visual weight feels right for your brand?</output>

<ask>Which design direction(s) resonate most? Pick a favorite, combine elements, or request modifications.</ask>
<template-output>design_direction_decision</template-output>
</step>

<step n="13" goal="Design user journeys">
<action>Extract critical user journeys from PRD</action>

<for-each journey="critical_user_journeys">
  <ask>Let's design the flow for {{journey_name}}. Walk me through how a user should accomplish this task - entry, input, feedback, success. Consider the minimum steps to value, decision points, error recovery, and progressive disclosure.</ask>

<action>Present 2-3 flow approach options based on journey complexity, then create detailed flow documentation with Mermaid diagram</action>
</for-each>

<template-output>user_journey_flows</template-output>
</step>

<step n="14" goal="Define component strategy">
<action>Identify required components from design system vs custom needs</action>

<ask>For components not covered by {{design_system}}, let's define them together.

For each custom component: What's its purpose? What content/data does it display? What actions can users take? What states does it have?</ask>

<action>Document each custom component with anatomy, states, variants, behavior, and accessibility requirements</action>
<template-output>component_library_strategy</template-output>
</step>

<step n="15" goal="Define UX pattern decisions">
<output>Let's establish consistency patterns for how your app behaves in common situations - button hierarchy, feedback patterns, form patterns, modals, navigation, empty states, confirmations, notifications, search, and date/time patterns.</output>

<ask>Do you want to go through each pattern category thoroughly, focus only on the most critical for your app, or let me recommend smart defaults and you override where needed?</ask>

<action>Facilitate pattern decisions with appropriate depth, documenting chosen approaches and rationale for consistency</action>
<template-output>ux_pattern_decisions</template-output>
</step>

<step n="16" goal="Define responsive and accessibility strategy">
<ask>Let's define how your app adapts across devices.

**Desktop:** How should we use extra space? Multi-column? Side navigation?
**Tablet:** Simplified layout? Touch-optimized?
**Mobile:** Bottom navigation or hamburger menu? How do layouts collapse?</ask>

<action>Define breakpoint strategy and adaptation patterns</action>

<ask>Accessibility strategy: WCAG Level A (basic), AA (recommended standard), or AAA (highest)?

Based on your deployment intent: {{recommendation}}</ask>

<action>Define accessibility requirements and testing strategy</action>
<template-output>responsive_accessibility_strategy</template-output>
</step>

<step n="17" goal="Generate optional visualizations">
<ask>🎨 One more thing! Want to see your design come to life?

1. **Key Screens Showcase** - 6-8 panels showing your app's main screens with all your design choices applied
2. **User Journey Visualization** - Step-by-step HTML mockup of one critical user journey
3. **Something else** - Tell me what you want to see!
4. **Skip for now** - I'll just finalize the documentation</ask>

<check if="user_wants_visualizations">
  <action>Generate requested HTML visualizations applying all design decisions</action>
</check>

<template-output>completion_summary</template-output>
</step>

<step n="18" goal="Finalize UX design specification">
<action>Ensure document is complete with all template-output sections filled</action>

<output>✅ **UX Design Specification Complete!**

**Core Deliverables:**

- ✅ UX Design Specification: {default_output_file}
- ✅ Color Theme Visualizer: {color_themes_html}
- ✅ Design Direction Mockups: {design_directions_html}

**Recommended Next Steps:**

<check if="tracking_mode == true">
- **Next required:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Run validation with \*validate-design, or generate additional UX artifacts
Check status anytime with: `workflow-status`
</check>

<check if="tracking_mode != true">
- Run validation checklist with \*validate-design (recommended)
- **Solution Architecture workflow** (with UX context) - *Recommended next step after completing PRD and UX Design*
- Or run `workflow-init` to create a workflow path and get guided next steps
</check>

**Optional Follow-Up Workflows:**

- Wireframe Generation / Figma Design / Interactive Prototype workflows
- Component Showcase / AI Frontend Prompt workflows
  </output>

<action>Save final document</action>

<check if="standalone_mode != true">
  <action>Update workflow status with file path and determine next workflow</action>
</check>

</step>

</workflow>
