# Step 2: Context Rules Generation

## MANDATORY EXECUTION RULES (READ FIRST):

- NEVER generate content without user input
- ALWAYS treat this as collaborative discovery between technical peers
- YOU ARE A FACILITATOR, not a content generator
- FOCUS on unobvious rules that AI agents need to be reminded of
- KEEP CONTENT LEAN - optimize for LLM context efficiency
- ABSOLUTELY NO TIME ESTIMATES
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Focus on specific, actionable rules rather than general advice
- Present A/P/C menu after each major rule category
- ONLY save when user chooses C (Continue)
- Update frontmatter with completed sections
- FORBIDDEN to load next step until all sections are complete

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices for each rule category:

- **A (Advanced Elicitation)**: Use discovery protocols to explore nuanced implementation rules
- **P (Party Mode)**: Bring multiple perspectives to identify critical edge cases
- **C (Continue)**: Save the current rules and proceed to next category

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml
- When 'P' selected: Execute {project-root}/_bmad/core/workflows/party-mode
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Discovery results from step-1 are available
- Game engine and existing patterns are identified
- Focus on rules that prevent implementation mistakes
- Prioritize unobvious details that AI agents might miss

## YOUR TASK:

Collaboratively generate specific, critical rules that AI agents must follow when implementing game code in this project.

## CONTEXT GENERATION SEQUENCE:

### 1. Technology Stack & Versions

Document the exact technology stack from discovery:

**Core Technologies:**
Based on user skill level, present findings:

**Expert Mode:**
"Technology stack from your architecture and project files:
{{exact_technologies_with_versions}}

Any critical version constraints I should document for agents?"

**Intermediate Mode:**
"I found your technology stack:

**Game Engine:**
{{engine_with_version}}

**Key Dependencies:**
{{important_dependencies_with_versions}}

Are there any version constraints or compatibility notes agents should know about?"

**Beginner Mode:**
"Here are the technologies you're using:

**Game Engine:**
{{friendly_description_of_engine}}

**Important Notes:**
{{key_things_agents_need_to_know_about_versions}}

Should I document any special version rules or compatibility requirements?"

### 2. Engine-Specific Rules

Focus on unobvious engine patterns agents might miss:

**Unity Rules (if applicable):**
"Based on your Unity project, I notice some specific patterns:

**Lifecycle Rules:**
{{unity_lifecycle_patterns}}

**Serialization Rules:**
{{serialization_requirements}}

**Assembly Definitions:**
{{assembly_definition_rules}}

**Coroutine/Async Patterns:**
{{async_patterns}}

Are these patterns correct? Any other Unity-specific rules agents should follow?"

**Unreal Rules (if applicable):**
"Based on your Unreal project, I notice some specific patterns:

**UPROPERTY/UFUNCTION Rules:**
{{macro_usage_patterns}}

**Blueprint Integration:**
{{blueprint_rules}}

**Garbage Collection:**
{{gc_patterns}}

**Tick Patterns:**
{{tick_optimization_rules}}

Are these patterns correct? Any other Unreal-specific rules agents should follow?"

**Godot Rules (if applicable):**
"Based on your Godot project, I notice some specific patterns:

**Node Lifecycle:**
{{node_lifecycle_patterns}}

**Signal Usage:**
{{signal_conventions}}

**Scene Instancing:**
{{scene_patterns}}

**Autoload Patterns:**
{{autoload_rules}}

Are these patterns correct? Any other Godot-specific rules agents should follow?"

### 3. Performance Rules

Document performance-critical patterns:

**Frame Budget Rules:**
"Your game has these performance requirements:

**Target Frame Rate:**
{{target_fps}}

**Frame Budget:**
{{milliseconds_per_frame}}

**Critical Systems:**
{{systems_that_must_meet_budget}}

**Hot Path Rules:**
{{hot_path_patterns}}

Any other performance rules agents must follow?"

**Memory Management:**
"Memory patterns for your project:

**Allocation Rules:**
{{allocation_patterns}}

**Pooling Requirements:**
{{object_pooling_rules}}

**Asset Loading:**
{{asset_loading_patterns}}

Are there memory constraints agents should know about?"

### 4. Code Organization Rules

Document project structure and organization:

**Folder Structure:**
"Your project organization:

**Script Organization:**
{{script_folder_structure}}

**Asset Organization:**
{{asset_folder_patterns}}

**Scene/Level Organization:**
{{scene_organization}}

Any organization rules agents must follow?"

**Naming Conventions:**
"Your naming patterns:

**Script/Class Names:**
{{class_naming_patterns}}

**Asset Names:**
{{asset_naming_patterns}}

**Variable/Method Names:**
{{variable_naming_patterns}}

Any other naming rules?"

### 5. Testing Rules

Focus on testing patterns that ensure consistency:

**Test Structure Rules:**
"Your testing setup shows these patterns:

**Test Organization:**
{{test_file_organization}}

**Test Categories:**
{{unit_vs_integration_boundaries}}

**Mocking Patterns:**
{{mock_usage_conventions}}

**Play Mode Testing:**
{{play_mode_test_patterns}}

Are there testing rules agents should always follow?"

### 6. Platform & Build Rules

Document platform-specific requirements:

**Target Platforms:**
"Your platform configuration:

**Primary Platform:**
{{primary_platform}}

**Platform-Specific Code:**
{{platform_conditional_patterns}}

**Build Configurations:**
{{build_config_rules}}

**Input Handling:**
{{input_abstraction_patterns}}

Any platform rules agents must know?"

### 7. Critical Don't-Miss Rules

Identify rules that prevent common mistakes:

**Anti-Patterns to Avoid:**
"Based on your codebase, here are critical things agents must NOT do:

{{critical_anti_patterns_with_examples}}

**Edge Cases:**
{{specific_edge_cases_agents_should_handle}}

**Common Gotchas:**
{{engine_specific_gotchas}}

**Performance Traps:**
{{performance_patterns_to_avoid}}

Are there other 'gotchas' agents should know about?"

### 8. Generate Context Content

For each category, prepare lean content for the project context file:

#### Content Structure:

```markdown
## Technology Stack & Versions

{{concise_technology_list_with_exact_versions}}

## Critical Implementation Rules

### Engine-Specific Rules

{{bullet_points_of_engine_rules}}

### Performance Rules

{{bullet_points_of_performance_requirements}}

### Code Organization Rules

{{bullet_points_of_organization_patterns}}

### Testing Rules

{{bullet_points_of_testing_requirements}}

### Platform & Build Rules

{{bullet_points_of_platform_requirements}}

### Critical Don't-Miss Rules

{{bullet_points_of_anti_patterns_and_gotchas}}
```

### 9. Present Content and Menu

After each category, show the generated rules and present choices:

"I've drafted the {{category_name}} rules for your project context.

**Here's what I'll add:**

[Show the complete markdown content for this category]

**What would you like to do?**
[A] Advanced Elicitation - Explore nuanced rules for this category
[P] Party Mode - Review from different implementation perspectives
[C] Continue - Save these rules and move to next category"

### 10. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute advanced-elicitation.xml with current category rules
- Process enhanced rules that come back
- Ask user: "Accept these enhanced rules for {{category}}? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute party-mode workflow with category rules context
- Process collaborative insights on implementation patterns
- Ask user: "Accept these changes to {{category}} rules? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Save the current category content to project context file
- Update frontmatter: `sections_completed: [...]`
- Proceed to next category or step-03 if complete

## APPEND TO PROJECT CONTEXT:

When user selects 'C' for a category, append the content directly to `{output_folder}/project-context.md` using the structure from step 8.

## SUCCESS METRICS:

- All critical technology versions accurately documented
- Engine-specific rules cover unobvious patterns
- Performance rules capture project-specific requirements
- Code organization rules maintain project standards
- Testing rules ensure consistent test quality
- Platform rules prevent cross-platform issues
- Content is lean and optimized for LLM context
- A/P/C menu presented and handled correctly for each category

## FAILURE MODES:

- Including obvious rules that agents already know
- Making content too verbose for LLM context efficiency
- Missing critical anti-patterns or edge cases
- Not getting user validation for each rule category
- Not documenting exact versions and configurations
- Not presenting A/P/C menu after content generation

## NEXT STEP:

After completing all rule categories and user selects 'C' for the final category, load `./step-03-complete.md` to finalize the project context file.

Remember: Do NOT proceed to step-03 until all categories are complete and user explicitly selects 'C' for each!
