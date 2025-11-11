# Create UX Design Workflow Instructions

<workflow name="create-ux-design">

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication style based on {user_skill_level}</critical>
<critical>The goal is COLLABORATIVE UX DESIGN through visual exploration, not content generation</critical>
<critical>Communicate all responses in {communication_language} and tailor to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>SAVE PROGRESS after each major step - use <template-output> tags throughout</critical>
<critical>DOCUMENT OUTPUT: Professional, specific, actionable UX design decisions WITH RATIONALE. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>

<step n="0" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

<check if="status file not found">
  <output>No workflow status file found. Create UX Design can run standalone or as part of BMM planning workflow.</output>
  <output>For standalone use, we'll gather requirements as we go. For integrated use, run `workflow-init` first for better context.</output>
  <action>Set standalone_mode = true</action>
</check>

<check if="status file found">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "create-design" workflow</action>
  <action>Get project_level from YAML metadata</action>
  <action>Find first non-completed workflow (next expected workflow)</action>

  <check if="create-design status is file path (already completed)">
    <output>⚠️ UX Design already completed: {{create-design status}}</output>
    <ask>Re-running will overwrite the existing UX design. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="create-design is not the next expected workflow">
    <output>⚠️ Next expected workflow: {{next_workflow}}. UX Design is out of sequence.</output>
    <ask>Continue with UX Design anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. Run {{next_workflow}} instead.</output>
      <action>Exit workflow</action>
    </check>
  </check>

<action>Set standalone_mode = false</action>
<action>Store {{project_level}} for scoping decisions</action>
</check>
</step>

<step n="1a" goal="Confirm project understanding or gather basic context">
  <critical>A UX designer must understand the WHY before designing the HOW</critical>

<action>Attempt to load context documents using fuzzy matching: - PRD: {prd_file} - Product Brief: {brief_file} - Brainstorming: {brainstorm_file}
</action>

  <check if="documents_found">
    <action>Extract and understand:
      - Project vision and goals
      - Target users and personas
      - Core features and user journeys
      - Platform requirements (web, mobile, desktop)
      - Any technical constraints mentioned
      - Brand personality hints
      - Competitive landscape references
    </action>

    <output>I've loaded your project documentation. Let me confirm what I'm seeing:

**Project:** {{project_summary_from_docs}}
**Target Users:** {{user_summary_from_docs}}</output>

    <ask>Does this match your understanding? Any corrections or additions?</ask>

  </check>

  <check if="no_documents_found">
    <ask>Let's start by understanding what you're building.

**What are you building?** (1-2 sentences about the project)

**Who is this for?** Describe your ideal user.</ask>
</check>

<template-output>project_and_users_confirmed</template-output>
</step>

<step n="1b" goal="Understand core experience and platform">
  <critical>Now we discover the ONE thing that defines this experience</critical>

<ask>Now let's dig into the experience itself.

**What's the core experience?**

- What's the ONE thing users will do most?
- What should be absolutely effortless?
- Which user action is most critical to get right?

**Platform:**
Where will users experience this? (Web, mobile app, desktop, multiple platforms)</ask>

<template-output>core_experience_and_platform</template-output>
</step>

<step n="1c" goal="Discover the desired emotional response">
  <critical>Emotion drives behavior - this shapes everything</critical>

<ask>This is crucial - **what should users FEEL when using this?**

Not what they'll do, but what emotion or state they should experience:

- Empowered and in control?
- Delighted and surprised?
- Efficient and productive?
- Creative and inspired?
- Calm and focused?
- Connected and engaged?
- Something else?

Really think about the emotional response you want. What feeling would make them tell a friend about this?</ask>

<template-output>desired_emotional_response</template-output>
</step>

<step n="1d" goal="Gather inspiration and analyze UX patterns">
  <critical>Learn from what users already love</critical>

<ask>**Inspiration time!**

Name 2-3 apps your users already love and USE regularly.

Feel free to share:

- App names (I'll look them up to see current UX)
- Screenshots (if you have examples of what you like)
- Links to products or demos

For each one, what do they do well from a UX perspective? What makes the experience compelling?</ask>

<action>For each app mentioned:
<WebSearch>{{app_name}} current interface UX design 2025</WebSearch>
<action>Analyze what makes that app's UX effective</action>
<action>Note patterns and principles that could apply to this project</action>
</action>

<action>If screenshots provided:
<action>Analyze screenshots for UX patterns, visual style, interaction patterns</action>
<action>Note what user finds compelling about these examples</action>
</action>

<template-output>inspiration_analysis</template-output>
</step>

<step n="1e" goal="Synthesize understanding and set facilitation mode">
  <critical>Now analyze complexity and set the right facilitation approach</critical>

<action>Analyze project for UX complexity indicators: - Number of distinct user roles or personas - Number of primary user journeys - Interaction complexity (simple CRUD vs rich interactions) - Platform requirements (single vs multi-platform) - Real-time collaboration needs - Content creation vs consumption - Novel interaction patterns
</action>

<action>Based on {user_skill_level}, set facilitation approach:

    <check if="{user_skill_level} == 'expert'">
      Set mode: UX_EXPERT
      - Use design terminology freely (affordances, information scent, cognitive load)
      - Move quickly through familiar patterns
      - Focus on nuanced tradeoffs and edge cases
      - Reference design systems and frameworks by name
    </check>

    <check if="{user_skill_level} == 'intermediate'">
      Set mode: UX_INTERMEDIATE
      - Balance design concepts with clear explanations
      - Provide brief context for UX decisions
      - Use familiar analogies when helpful
      - Confirm understanding at key points
    </check>

    <check if="{user_skill_level} == 'beginner'">
      Set mode: UX_BEGINNER
      - Explain design concepts in simple terms
      - Use real-world analogies extensively
      - Focus on "why this matters for users"
      - Protect from overwhelming choices
    </check>

  </action>

<output>Here's what I'm understanding about {{project_name}}:

**Vision:** {{project_vision_summary}}
**Users:** {{user_summary}}
**Core Experience:** {{core_action_summary}}
**Desired Feeling:** {{emotional_goal}}
**Platform:** {{platform_summary}}
**Inspiration:** {{inspiration_summary_with_ux_patterns}}

**UX Complexity:** {{complexity_assessment}}

This helps me understand both what we're building and the experience we're aiming for. Let's start designing!</output>

<action>Load UX design template: {template}</action>
<action>Initialize output document at {default_output_file}</action>

<template-output>project_vision</template-output>
</step>

<step n="2" goal="Discover and evaluate design systems">
  <critical>Modern design systems make many good UX decisions by default</critical>
  <critical>Like starter templates for code, design systems provide proven patterns</critical>

<action>Based on platform and tech stack (if known from PRD), identify design system options:

    For Web Applications:
    - Material UI (Google's design language)
    - shadcn/ui (Modern, customizable, Tailwind-based)
    - Chakra UI (Accessible, themeable)
    - Ant Design (Enterprise, comprehensive)
    - Radix UI (Unstyled primitives, full control)
    - Custom design system

    For Mobile:
    - iOS Human Interface Guidelines
    - Material Design (Android)
    - Custom mobile design

    For Desktop:
    - Platform native (macOS, Windows guidelines)
    - Electron with web design system

  </action>

<action>Search for current design system information:
<WebSearch>{{platform}} design system 2025 popular options accessibility</WebSearch>
<WebSearch>{{identified_design_system}} latest version components features</WebSearch>
</action>

  <check if="design_systems_found">
    <action>For each relevant design system, understand what it provides:
      - Component library (buttons, forms, modals, etc.)
      - Accessibility built-in (WCAG compliance)
      - Theming capabilities
      - Responsive patterns
      - Icon library
      - Documentation quality
    </action>

    <action>Present design system options:
      "I found {{design_system_count}} design systems that could work well for your project.

      Think of design systems like a foundation - they provide proven UI components and patterns,
      so we're not reinventing buttons and forms. This speeds development and ensures consistency.

      **Your Options:**

      1. **{{system_name}}**
         - {{key_strengths}}
         - {{component_count}} components | {{accessibility_level}}
         - Best for: {{use_case}}

      2. **{{system_name}}**
         - {{key_strengths}}
         - {{component_count}} components | {{accessibility_level}}
         - Best for: {{use_case}}

      3. **Custom Design System**
         - Full control over every detail
         - More effort, completely unique to your brand
         - Best for: Strong brand identity needs, unique UX requirements

      **My Recommendation:** {{recommendation}} for {{reason}}

      This establishes our component foundation and interaction patterns."
    </action>

    <ask>Which design system approach resonates with you?

Or tell me:

- Do you need complete visual uniqueness? (→ custom)
- Want fast development with great defaults? (→ established system)
- Have brand guidelines to follow? (→ themeable system)
  </ask>

      <action>Record design system decision:
        System: {{user_choice}}
        Version: {{verified_version_if_applicable}}
        Rationale: {{user_reasoning_or_recommendation_accepted}}
        Provides: {{components_and_patterns_provided}}
        Customization needs: {{custom_components_needed}}
      </action>

    </check>

  <template-output>design_system_decision</template-output>
  </step>

<step n="3a" goal="Identify the defining experience">
  <critical>Every great app has a defining experience - identify it first</critical>

<action>Based on PRD/brief analysis, identify the core user experience: - What is the primary action users will repeat? - What makes this app unique vs. competitors? - What should be delightfully easy?
</action>

<ask>Let's identify your app's defining experience - the core interaction that, if we nail it, everything else follows.

When someone describes your app to a friend, what would they say?

**Examples:**

- "It's the app where you swipe to match with people" (Tinder)
- "You can share photos that disappear" (Snapchat)
- "It's like having a conversation with AI" (ChatGPT)
- "Capture and share moments" (Instagram)
- "Freeform content blocks" (Notion)
- "Real-time collaborative canvas" (Figma)

**What's yours?** What's the ONE experience that defines your app?</ask>

<action>Analyze if this core experience has established UX patterns:

    Standard patterns exist for:
    - CRUD operations (Create, Read, Update, Delete)
    - E-commerce flows (Browse → Product → Cart → Checkout)
    - Social feeds (Infinite scroll, like/comment)
    - Authentication (Login, signup, password reset)
    - Search and filter
    - Content creation (Forms, editors)
    - Dashboards and analytics

    Novel patterns may be needed for:
    - Unique interaction mechanics (before Tinder, swiping wasn't standard)
    - New collaboration models (before Figma, real-time design wasn't solved)
    - Unprecedented content types (before TikTok, vertical short video feeds)
    - Complex multi-step workflows spanning features
    - Innovative gamification or engagement loops

  </action>

<template-output>defining_experience</template-output>
</step>

<step n="3b" goal="Design novel UX pattern (if needed)">
  <critical>Skip this step if standard patterns apply. Run only if novel pattern detected.</critical>

  <check if="novel_pattern_detected">
    <output>The **{{pattern_name}}** interaction is novel - no established pattern exists yet!

Core UX challenge: {{challenge_description}}

This is exciting - we get to invent the user experience together. Let's design this interaction systematically.</output>

    <ask>Let's think through the core mechanics of this {{pattern_name}} interaction:

1. **User Goal:** What does the user want to accomplish?
2. **Trigger:** How should they initiate this action? (button, gesture, voice, drag, etc.)
3. **Feedback:** What should they see/feel happening?
4. **Success:** How do they know it succeeded?
5. **Errors:** What if something goes wrong? How do they recover?

Walk me through your mental model for this interaction - the ideal experience from the user's perspective.</ask>

    <template-output>novel_pattern_mechanics</template-output>

  </check>

  <check if="!novel_pattern_detected">
    <action>Skip to Step 3d - standard patterns apply</action>
  </check>
</step>

<step n="3c" goal="Explore novel pattern deeply (if novel)">
  <critical>Skip if not designing novel pattern</critical>

  <check if="novel_pattern_detected">
    <ask>Let's explore the {{pattern_name}} interaction more deeply to make it exceptional:

- **Similar Patterns:** What apps have SIMILAR (not identical) patterns we could learn from?
- **Speed:** What's the absolute fastest this action could complete?
- **Delight:** What's the most delightful way to give feedback?
- **Platform:** Should this work on mobile differently than desktop?
- **Shareability:** What would make someone show this to a friend?</ask>

      <action>Document the novel UX pattern:
        Pattern Name: {{pattern_name}}
        User Goal: {{what_user_accomplishes}}
        Trigger: {{how_initiated}}
        Interaction Flow:
          1. {{step_1}}
          2. {{step_2}}
          3. {{step_3}}
        Visual Feedback: {{what_user_sees}}
        States: {{default_loading_success_error}}
        Platform Considerations: {{desktop_vs_mobile_vs_tablet}}
        Accessibility: {{keyboard_screen_reader_support}}
        Inspiration: {{similar_patterns_from_other_apps}}
      </action>

      <template-output>novel_pattern_details</template-output>

    </check>

    <check if="!novel_pattern_detected">
      <action>Skip to Step 3d - standard patterns apply</action>
    </check>
  </step>

<step n="3d" goal="Define core experience principles">
  <critical>Establish the guiding principles for the entire experience</critical>

<action>Based on the defining experience and any novel patterns, define the core experience principles: - Speed: How fast should key actions feel? - Guidance: How much hand-holding do users need? - Flexibility: How much control vs. simplicity? - Feedback: Subtle or celebratory?
</action>

<output>Core experience principles established:

**Speed:** {{speed_principle}}
**Guidance:** {{guidance_principle}}
**Flexibility:** {{flexibility_principle}}
**Feedback:** {{feedback_principle}}

These principles will guide every UX decision from here forward.</output>

<template-output>core_experience_principles</template-output>
</step>

<step n="4" goal="Discover visual foundation through color theme exploration">
  <critical>Visual design isn't decoration - it communicates brand and guides attention</critical>
  <critical>SHOW options, don't just describe them - generate HTML visualizations</critical>
  <critical>Use color psychology principles: blue=trust, red=energy, green=growth/calm, purple=creativity, etc.</critical>

<ask>Do you have existing brand guidelines or a specific color palette in mind? (y/n)

If yes: Share your brand colors, or provide a link to brand guidelines.
If no: I'll generate theme options based on your project's personality.
</ask>

  <check if="existing_brand == true">
    <ask>Please provide:
- Primary brand color(s) (hex codes if available)
- Secondary colors
- Any brand personality guidelines (professional, playful, minimal, etc.)
- Link to style guide (if available)
</ask>

    <action>Extract and document brand colors</action>
    <action>Generate semantic color mappings:
      - Primary: {{brand_primary}} (main actions, key elements)
      - Secondary: {{brand_secondary}} (supporting actions)
      - Success: {{success_color}}
      - Warning: {{warning_color}}
      - Error: {{error_color}}
      - Neutral: {{gray_scale}}
    </action>

  </check>

  <check if="existing_brand == false">
    <action>Based on project personality from PRD/brief, identify 3-4 theme directions:

      Analyze project for:
      - Industry (fintech → trust/security, creative → bold/expressive, health → calm/reliable)
      - Target users (enterprise → professional, consumers → approachable, creators → inspiring)
      - Brand personality keywords mentioned
      - Competitor analysis (blend in or stand out?)

      Generate theme directions:
      1. {{theme_1_name}} ({{personality}}) - {{color_strategy}}
      2. {{theme_2_name}} ({{personality}}) - {{color_strategy}}
      3. {{theme_3_name}} ({{personality}}) - {{color_strategy}}
      4. {{theme_4_name}} ({{personality}}) - {{color_strategy}}
    </action>

    <action>Generate comprehensive HTML color theme visualizer:

      Create: {color_themes_html}

      For each theme, show:

      **Color Palette Section:**
      - Primary, secondary, accent colors as large swatches
      - Semantic colors (success, warning, error, info)
      - Neutral grayscale (background, text, borders)
      - Each swatch labeled with hex code and usage

      **Live Component Examples:**
      - Buttons (primary, secondary, disabled states)
      - Form inputs (normal, focus, error states)
      - Cards with content
      - Navigation elements
      - Success/error alerts
      - Typography in theme colors

      **Side-by-Side Comparison:**
      - All themes visible in grid layout
      - Responsive preview toggle
      - Toggle between light/dark mode if applicable

      **Theme Personality Description:**
      - Emotional impact (trustworthy, energetic, calm, sophisticated)
      - Best for (enterprise, consumer, creative, technical)
      - Visual style (minimal, bold, playful, professional)

      Include CSS with full theme variables for each option.
    </action>

    <action>Save HTML visualizer to {color_themes_html}</action>

    <output>🎨 I've created a color theme visualizer!

Open this file in your browser: {color_themes_html}

You'll see {{theme_count}} complete theme options with:

- Full color palettes
- Actual UI components in each theme
- Side-by-side comparison
- Theme personality descriptions

Take your time exploring. Which theme FEELS right for your vision?
</output>

    <ask>Which color theme direction resonates most?

You can:

- Choose a number (1-{{theme_count}})
- Combine elements: "I like the colors from #2 but the vibe of #3"
- Request variations: "Can you make #1 more vibrant?"
- Describe a custom direction

What speaks to you?
</ask>

    <action>Based on user selection, finalize color palette:
      - Extract chosen theme colors
      - Apply any requested modifications
      - Document semantic color usage
      - Note rationale for selection
    </action>

  </check>

<action>Define typography system:

    Based on brand personality and chosen colors:
    - Font families (heading, body, monospace)
    - Type scale (h1-h6, body, small, tiny)
    - Font weights and when to use them
    - Line heights for readability

    <check if="design_system_chosen">
      Use {{design_system}} default typography as starting point.
      Customize if brand requires it.
    </check>

  </action>

<action>Define spacing and layout foundation: - Base unit (4px, 8px system) - Spacing scale (xs, sm, md, lg, xl, 2xl, etc.) - Layout grid (12-column, custom, or design system default) - Container widths for different breakpoints
</action>

<template-output>visual_foundation</template-output>
</step>

<step n="5" goal="Generate design direction mockups for visual decision-making">
  <critical>This is the game-changer - SHOW actual design directions, don't just discuss them</critical>
  <critical>Users make better decisions when they SEE options, not imagine them</critical>
  <critical>Consider platform norms: desktop apps often use sidebar nav, mobile apps use bottom nav or tabs</critical>

<action>Based on PRD and core experience, identify 2-3 key screens to mock up:

    Priority screens:
    1. Entry point (landing page, dashboard, home screen)
    2. Core action screen (where primary user task happens)
    3. Critical conversion (signup, create, submit, purchase)

    For each screen, extract:
    - Primary goal of this screen
    - Key information to display
    - Primary action(s)
    - Secondary actions
    - Navigation context

  </action>

<action>Generate 6-8 different design direction variations exploring different UX approaches:

    Vary these dimensions:

    **Layout Approach:**
    - Sidebar navigation vs top nav vs floating action button
    - Single column vs multi-column
    - Card-based vs list-based vs grid
    - Centered vs left-aligned content

    **Visual Hierarchy:**
    - Dense (information-rich) vs Spacious (breathing room)
    - Bold headers vs subtle headers
    - Imagery-heavy vs text-focused

    **Interaction Patterns:**
    - Modal workflows vs inline expansion
    - Progressive disclosure vs all-at-once
    - Drag-and-drop vs click-to-select

    **Visual Weight:**
    - Minimal (lots of white space, subtle borders)
    - Balanced (clear structure, moderate visual weight)
    - Rich (gradients, shadows, visual depth)
    - Maximalist (bold, high contrast, dense)

    **Content Approach:**
    - Scannable (lists, cards, quick consumption)
    - Immersive (large imagery, storytelling)
    - Data-driven (charts, tables, metrics)

  </action>

<action>Create comprehensive HTML design direction showcase:

    Create: {design_directions_html}

    For EACH design direction (6-8 total):

    **Full-Screen Mockup:**
    - Complete HTML/CSS implementation
    - Using chosen color theme
    - Real (or realistic placeholder) content
    - Interactive states (hover effects, focus states)
    - Responsive behavior

    **Design Philosophy Label:**
    - Direction name (e.g., "Dense Dashboard", "Spacious Explorer", "Card Gallery")
    - Personality (e.g., "Professional & Efficient", "Friendly & Approachable")
    - Best for (e.g., "Power users who need lots of info", "First-time visitors who need guidance")

    **Key Characteristics:**
    - Layout: {{approach}}
    - Density: {{level}}
    - Navigation: {{style}}
    - Primary action prominence: {{high_medium_low}}

    **Navigation Controls:**
    - Previous/Next buttons to cycle through directions
    - Thumbnail grid to jump to any direction
    - Side-by-side comparison mode (show 2-3 at once)
    - Responsive preview toggle (desktop/tablet/mobile)
    - Favorite/flag directions for later comparison

    **Notes Section:**
    - User can click to add notes about each direction
    - "What I like" and "What I'd change" fields

  </action>

<action>Save comprehensive HTML showcase to {design_directions_html}</action>

<output>🎨 Design Direction Mockups Generated!

I've created {{mockup_count}} different design approaches for your key screens.

Open: {design_directions_html}

Each mockup shows a complete vision for your app's look and feel.

As you explore, look for:
✓ Which layout feels most intuitive for your users?
✓ Which information hierarchy matches your priorities?
✓ Which interaction style fits your core experience?
✓ Which visual weight feels right for your brand?

You can:

- Navigate through all directions
- Compare them side-by-side
- Toggle between desktop/mobile views
- Add notes about what you like

Take your time - this is a crucial decision!
</output>

<ask>Which design direction(s) resonate most with your vision?

You can:

- Pick a favorite by number: "Direction #3 is perfect!"
- Combine elements: "The layout from #2 with the density of #5"
- Request modifications: "I like #6 but can we make it less dense?"
- Ask me to explore variations: "Can you show me more options like #4 but with side navigation?"

What speaks to you?
</ask>

<action>Based on user selection, extract and document design decisions:

    Chosen Direction: {{direction_number_or_hybrid}}

    Layout Decisions:
    - Navigation pattern: {{sidebar_top_floating}}
    - Content structure: {{single_multi_column}}
    - Content organization: {{cards_lists_grid}}

    Hierarchy Decisions:
    - Visual density: {{spacious_balanced_dense}}
    - Header emphasis: {{bold_subtle}}
    - Content focus: {{imagery_text_data}}

    Interaction Decisions:
    - Primary action pattern: {{modal_inline_dedicated}}
    - Information disclosure: {{progressive_all_at_once}}
    - User control: {{guided_flexible}}

    Visual Style Decisions:
    - Weight: {{minimal_balanced_rich_maximalist}}
    - Depth cues: {{flat_subtle_elevation_dramatic_depth}}
    - Border style: {{none_subtle_strong}}

    Rationale: {{why_user_chose_this_direction}}
    User notes: {{what_they_liked_and_want_to_change}}

  </action>

  <check if="user_wants_modifications">
    <action>Generate 2-3 refined variations incorporating requested changes</action>
    <action>Update HTML showcase with refined options</action>
    <ask>Better? Pick your favorite refined version.</ask>
  </check>

<template-output>design_direction_decision</template-output>
</step>

<step n="6" goal="Collaborative user journey design">
  <critical>User journeys are conversations, not just flowcharts</critical>
  <critical>Design WITH the user, exploring options for each key flow</critical>

<action>Extract critical user journeys from PRD: - Primary user tasks - Conversion flows - Onboarding sequence - Content creation workflows - Any complex multi-step processes
</action>

<action>For each critical journey, identify the goal and current assumptions</action>

  <for-each journey="critical_user_journeys">

    <output>**User Journey: {{journey_name}}**

User goal: {{what_user_wants_to_accomplish}}
Current entry point: {{where_journey_starts}}
</output>

    <ask>Let's design the flow for {{journey_name}}.

Walk me through how a user should accomplish this task:

1. **Entry:** What's the first thing they see/do?
2. **Input:** What information do they need to provide?
3. **Feedback:** What should they see/feel along the way?
4. **Success:** How do they know they succeeded?

As you think through this, consider:

- What's the minimum number of steps to value?
- Where are the decision points and branching?
- How do they recover from errors?
- Should we show everything upfront, or progressively?

Share your mental model for this flow.</ask>

    <action>Based on journey complexity, present 2-3 flow approach options:

      <check if="simple_linear_journey">
        Option A: Single-screen approach (all inputs/actions on one page)
        Option B: Wizard/stepper approach (split into clear steps)
        Option C: Hybrid (main flow on one screen, advanced options collapsed)
      </check>

      <check if="complex_branching_journey">
        Option A: Guided flow (system determines next step based on inputs)
        Option B: User-driven navigation (user chooses path)
        Option C: Adaptive (simple mode vs advanced mode toggle)
      </check>

      <check if="creation_journey">
        Option A: Template-first (start from templates, customize)
        Option B: Blank canvas (full flexibility, more guidance needed)
        Option C: Progressive creation (start simple, add complexity)
      </check>

      For each option, explain:
      - User experience: {{what_it_feels_like}}
      - Pros: {{benefits}}
      - Cons: {{tradeoffs}}
      - Best for: {{user_type_or_scenario}}
    </action>

    <ask>Which approach fits best? Or should we blend elements?</ask>

    <action>Create detailed flow documentation:

      Journey: {{journey_name}}
      User Goal: {{goal}}
      Approach: {{chosen_approach}}

      Flow Steps:
      1. {{step_1_screen_and_action}}
         - User sees: {{information_displayed}}
         - User does: {{primary_action}}
         - System responds: {{feedback}}

      2. {{step_2_screen_and_action}}
         ...

      Decision Points:
      - {{decision_point}}: {{branching_logic}}

      Error States:
      - {{error_scenario}}: {{how_user_recovers}}

      Success State:
      - Completion feedback: {{what_user_sees}}
      - Next action: {{what_happens_next}}

      [Generate Mermaid diagram showing complete flow]
    </action>

  </for-each>

<template-output>user_journey_flows</template-output>
</step>

<step n="7" goal="Component library strategy and custom component design">
  <critical>Balance design system components with custom needs</critical>

<action>Based on design system chosen + design direction mockups + user journeys:</action>

<action>Identify required components:

    From Design System (if applicable):
    - {{list_of_components_provided}}

    Custom Components Needed:
    - {{unique_component_1}} ({{why_custom}})
    - {{unique_component_2}} ({{why_custom}})

    Components Requiring Heavy Customization:
    - {{component}} ({{what_customization}})

  </action>

<ask>For components not covered by {{design_system}}, let's define them together.

Component: {{custom_component_name}}

1. What's its purpose? (what does it do for users?)
2. What content/data does it display?
3. What actions can users take with it?
4. What states does it have? (default, hover, active, loading, error, disabled, etc.)
5. Are there variants? (sizes, styles, layouts)
   </ask>

<action>For each custom component, document:

    Component Name: {{name}}
    Purpose: {{user_facing_purpose}}

    Anatomy:
    - {{element_1}}: {{description}}
    - {{element_2}}: {{description}}

    States:
    - Default: {{appearance}}
    - Hover: {{changes}}
    - Active/Selected: {{changes}}
    - Loading: {{loading_indicator}}
    - Error: {{error_display}}
    - Disabled: {{appearance}}

    Variants:
    - {{variant_1}}: {{when_to_use}}
    - {{variant_2}}: {{when_to_use}}

    Behavior:
    - {{interaction}}: {{what_happens}}

    Accessibility:
    - ARIA role: {{role}}
    - Keyboard navigation: {{keys}}
    - Screen reader: {{announcement}}

  </action>

<template-output>component_library_strategy</template-output>
</step>

<step n="8" goal="Define UX pattern decisions for consistency">
  <critical>These are implementation patterns for UX - ensure consistency across the app</critical>
  <critical>Like the architecture workflow's implementation patterns, but for user experience</critical>
  <critical>These decisions prevent "it works differently on every page" confusion</critical>

<action>Based on chosen components and journeys, identify UX consistency decisions needed:

    BUTTON HIERARCHY (How users know what's most important):
    - Primary action: {{style_and_usage}}
    - Secondary action: {{style_and_usage}}
    - Tertiary action: {{style_and_usage}}
    - Destructive action: {{style_and_usage}}

    FEEDBACK PATTERNS (How system communicates with users):
    - Success: {{pattern}} (toast, inline, modal, page-level)
    - Error: {{pattern}}
    - Warning: {{pattern}}
    - Info: {{pattern}}
    - Loading: {{pattern}} (spinner, skeleton, progress bar)

    FORM PATTERNS (How users input data):
    - Label position: {{above_inline_floating}}
    - Required field indicator: {{asterisk_text_visual}}
    - Validation timing: {{onBlur_onChange_onSubmit}}
    - Error display: {{inline_summary_both}}
    - Help text: {{tooltip_caption_modal}}

    MODAL PATTERNS (How dialogs behave):
    - Size variants: {{when_to_use_each}}
    - Dismiss behavior: {{click_outside_escape_explicit_close}}
    - Focus management: {{auto_focus_strategy}}
    - Stacking: {{how_multiple_modals_work}}

    NAVIGATION PATTERNS (How users move through app):
    - Active state indication: {{visual_cue}}
    - Breadcrumb usage: {{when_shown}}
    - Back button behavior: {{browser_back_vs_app_back}}
    - Deep linking: {{supported_patterns}}

    EMPTY STATE PATTERNS (What users see when no content):
    - First use: {{guidance_and_cta}}
    - No results: {{helpful_message}}
    - Cleared content: {{undo_option}}

    CONFIRMATION PATTERNS (When to confirm destructive actions):
    - Delete: {{always_sometimes_never_with_undo}}
    - Leave unsaved: {{warn_or_autosave}}
    - Irreversible actions: {{confirmation_level}}

    NOTIFICATION PATTERNS (How users stay informed):
    - Placement: {{top_bottom_corner}}
    - Duration: {{auto_dismiss_vs_manual}}
    - Stacking: {{how_multiple_notifications_appear}}
    - Priority levels: {{critical_important_info}}

    SEARCH PATTERNS (How search behaves):
    - Trigger: {{auto_or_manual}}
    - Results display: {{instant_on_enter}}
    - Filters: {{placement_and_behavior}}
    - No results: {{suggestions_or_message}}

    DATE/TIME PATTERNS (How temporal data appears):
    - Format: {{relative_vs_absolute}}
    - Timezone handling: {{user_local_utc}}
    - Pickers: {{calendar_dropdown_input}}

  </action>

<output>I've identified {{pattern_count}} UX pattern categories that need consistent decisions across your app. Let's make these decisions together to ensure users get a consistent experience.

These patterns determine how {{project_name}} behaves in common situations - like how buttons work, how forms validate, how modals behave, etc.</output>

<ask>For each pattern category below, I'll present options and a recommendation. Tell me your preferences or ask questions.

**Pattern Categories to Decide:**

- Button hierarchy (primary, secondary, destructive)
- Feedback patterns (success, error, loading)
- Form patterns (labels, validation, help text)
- Modal patterns (size, dismiss, focus)
- Navigation patterns (active state, back button)
- Empty state patterns
- Confirmation patterns (delete, unsaved changes)
- Notification patterns
- Search patterns
- Date/time patterns

For each one, do you want to:

1. Go through each pattern category one by one (thorough)
2. Focus only on the most critical patterns for your app (focused)
3. Let me recommend defaults and you override where needed (efficient)</ask>

<action>Based on user choice, facilitate pattern decisions with appropriate depth: - If thorough: Present all categories with options and reasoning - If focused: Identify 3-5 critical patterns based on app type - If efficient: Recommend smart defaults, ask for overrides

    For each pattern decision, document:
    - Pattern category
    - Chosen approach
    - Rationale (why this choice for this app)
    - Example scenarios where it applies

  </action>

<template-output>ux_pattern_decisions</template-output>
</step>

<step n="9" goal="Responsive and accessibility strategy">
  <critical>Responsive design isn't just "make it smaller" - it's adapting the experience</critical>

<action>Based on platform requirements from PRD and chosen design direction:</action>

<ask>Let's define how your app adapts across devices.

Target devices from PRD: {{devices}}

For responsive design:

1. **Desktop** (large screens):
   - How should we use the extra space?
   - Multi-column layouts?
   - Side navigation?

2. **Tablet** (medium screens):
   - Simplified layout from desktop?
   - Touch-optimized interactions?
   - Portrait vs landscape considerations?

3. **Mobile** (small screens):
   - Bottom navigation or hamburger menu?
   - How do multi-column layouts collapse?
   - Touch target sizes adequate?

What's most important for each screen size?
</ask>

<action>Define breakpoint strategy:

    Based on chosen layout pattern from design direction:

    Breakpoints:
    - Mobile: {{max_width}} ({{cols}}-column layout, {{nav_pattern}})
    - Tablet: {{range}} ({{cols}}-column layout, {{nav_pattern}})
    - Desktop: {{min_width}} ({{cols}}-column layout, {{nav_pattern}})

    Adaptation Patterns:
    - Navigation: {{how_it_changes}}
    - Sidebar: {{collapse_hide_convert}}
    - Cards/Lists: {{grid_to_single_column}}
    - Tables: {{horizontal_scroll_card_view_hide_columns}}
    - Modals: {{full_screen_on_mobile}}
    - Forms: {{layout_changes}}

  </action>

<action>Define accessibility strategy:

    <ask>Let's define your accessibility strategy.

Accessibility means your app works for everyone, including people with disabilities:

- Can someone using only a keyboard navigate?
- Can someone using a screen reader understand what's on screen?
- Can someone with color blindness distinguish important elements?
- Can someone with motor difficulties use your buttons?

**WCAG Compliance Levels:**

- **Level A** - Basic accessibility (minimum)
- **Level AA** - Recommended standard, legally required for government/education/public sites
- **Level AAA** - Highest standard (not always practical for all content)

**Legal Context:**

- Government/Education: Must meet WCAG 2.1 Level AA
- Public websites (US): ADA requires accessibility
- EU: Accessibility required

Based on your deployment intent: {{recommendation}}

**What level should we target?**</ask>

    Accessibility Requirements:

    Compliance Target: {{WCAG_level}}

    Key Requirements:
    - Color contrast: {{ratio_required}} (text vs background)
    - Keyboard navigation: All interactive elements accessible
    - Focus indicators: Visible focus states on all interactive elements
    - ARIA labels: Meaningful labels for screen readers
    - Alt text: Descriptive text for all meaningful images
    - Form labels: Proper label associations
    - Error identification: Clear, descriptive error messages
    - Touch target size: Minimum {{size}} for mobile

    Testing Strategy:
    - Automated: {{tools}} (Lighthouse, axe DevTools)
    - Manual: Keyboard-only navigation testing
    - Screen reader: {{tool}} testing

  </action>

<template-output>responsive_accessibility_strategy</template-output>
</step>

<step n="10" goal="Finalize UX design specification">
  <critical>The document is built progressively throughout - now finalize and offer extensions</critical>

<action>Ensure document is complete with all template-output sections filled</action>

<action>Generate completion summary:

    "Excellent work! Your UX Design Specification is complete.

    **What we created together:**

    - **Design System:** {{choice}} with {{custom_component_count}} custom components
    - **Visual Foundation:** {{color_theme}} color theme with {{typography_choice}} typography and spacing system
    - **Design Direction:** {{chosen_direction}} - {{why_it_fits}}
    - **User Journeys:** {{journey_count}} flows designed with clear navigation paths
    - **UX Patterns:** {{pattern_count}} consistency rules established for cohesive experience
    - **Responsive Strategy:** {{breakpoint_count}} breakpoints with adaptation patterns for all device sizes
    - **Accessibility:** {{WCAG_level}} compliance requirements defined

    **Your Deliverables:**
    - UX Design Document: {default_output_file}
    - Interactive Color Themes: {color_themes_html}
    - Design Direction Mockups: {design_directions_html}

    **What happens next:**
    - Designers can create high-fidelity mockups from this foundation
    - Developers can implement with clear UX guidance and rationale
    - All your design decisions are documented with reasoning for future reference

    You've made thoughtful choices through visual collaboration that will create a great user experience. Ready for design refinement and implementation!"

  </action>

<action>Save final document to {default_output_file}</action>

  <check if="standalone_mode != true">
    <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
    <action>Find workflow_status key "create-design"</action>
    <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
    <action>Update workflow_status["create-design"] = "{default_output_file}"</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
    <action>Determine next agent from path file based on next workflow</action>

  </check>

<ask>🎨 **One more thing!** Want to see your design come to life?

I can generate interactive HTML mockups using all your design choices:

**1. Key Screens Showcase** - 6-8 panels showing your app's main screens (home, core action, settings, etc.) with your chosen:

- Color theme and typography
- Design direction and layout
- Component styles
- Navigation patterns

**2. User Journey Visualization** - Step-by-step HTML mockup of one of your critical user journeys with:

- Each screen in the flow
- Interactive transitions
- Success states and feedback
- All your design decisions applied

**3. Something else** - Tell me what you want to see!

**4. Skip for now** - I'll just finalize the documentation

What would you like?</ask>

  <check if="user_choice == 'key_screens' or similar">
    <action>Generate comprehensive multi-panel HTML showcase:

      Create: {final_app_showcase_html}

      Include 6-8 screens representing:
      - Landing/Home screen
      - Main dashboard or feed
      - Core action screen (primary user task)
      - Profile or settings
      - Create/Edit screen
      - Results or success state
      - Modal/dialog examples
      - Empty states

      Apply ALL design decisions:
      - {{chosen_color_theme}} with exact colors
      - {{chosen_design_direction}} layout and hierarchy
      - {{design_system}} components styled per decisions
      - {{typography_system}} applied consistently
      - {{spacing_system}} and responsive breakpoints
      - {{ux_patterns}} for consistency
      - {{accessibility_requirements}}

      Make it interactive:
      - Hover states on buttons
      - Tab switching where applicable
      - Modal overlays
      - Form validation states
      - Navigation highlighting

      Output as single HTML file with inline CSS and minimal JavaScript
    </action>

    <output>✨ **Created: {final_app_showcase_html}**

Open this file in your browser to see {{project_name}} come to life with all your design choices applied! You can:

- Navigate between screens
- See hover and interactive states
- Experience your chosen design direction
- Share with stakeholders for feedback

This showcases exactly what developers will build.</output>
</check>

  <check if="user_choice == 'user_journey' or similar">
    <ask>Which user journey would you like to visualize?

{{list_of_designed_journeys}}

Pick one, or tell me which flow you want to see!</ask>

    <action>Generate step-by-step journey HTML:

      Create: {journey_visualization_html}

      For {{selected_journey}}:
      - Show each step as a full screen
      - Include navigation between steps (prev/next buttons)
      - Apply all design decisions consistently
      - Show state changes and feedback
      - Include success/error scenarios
      - Annotate design decisions on hover

      Make it feel like a real user flow through the app
    </action>

    <output>✨ **Created: {journey_visualization_html}**

Walk through the {{selected_journey}} flow step-by-step in your browser! This shows the exact experience users will have, with all your UX decisions applied.</output>
</check>

  <check if="user_choice == 'something_else'">
    <ask>Tell me what you'd like to visualize! I can generate HTML mockups for:
- Specific screens or features
- Interactive components
- Responsive breakpoint comparisons
- Accessibility features in action
- Animation and transition concepts
- Whatever you envision!

What should I create?</ask>

    <action>Generate custom HTML visualization based on user request:
      - Parse what they want to see
      - Apply all relevant design decisions
      - Create interactive HTML mockup
      - Make it visually compelling and functional
    </action>

    <output>✨ **Created: {{custom_visualization_file}}**

{{description_of_what_was_created}}

Open in browser to explore!</output>
</check>

<output>**✅ UX Design Specification Complete!**

**Core Deliverables:**

- ✅ UX Design Specification: {default_output_file}
- ✅ Color Theme Visualizer: {color_themes_html}
- ✅ Design Direction Mockups: {design_directions_html}

**Recommended Next Steps:**

{{#if tracking_mode == true}}

- **Next required:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Run validation with \*validate-design, or generate additional UX artifacts (wireframes, prototypes, etc.)

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Run validation checklist with \*validate-design (recommended)
- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps

**Optional Follow-Up Workflows:**

- Wireframe Generation / Figma Design / Interactive Prototype workflows
- Component Showcase / AI Frontend Prompt workflows
- Solution Architecture workflow (with UX context)
  {{/if}}
  </output>

<template-output>completion_summary</template-output>
</step>

</workflow>
