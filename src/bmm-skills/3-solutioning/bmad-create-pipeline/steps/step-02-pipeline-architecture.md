# Step 2: Pipeline Architecture Decisions

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between pipeline architecture peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on making critical pipeline architecture decisions collaboratively
- 🌐 ALWAYS search the web to verify current technology versions
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 🌐 Search the web to verify technology versions and options
- ⚠️ Present A/P/C menu after each major decision category
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices for each decision category:

- **A (Advanced Elicitation)**: Use discovery protocols to explore innovative approaches to specific decisions
- **P (Party Mode)**: Bring multiple perspectives to evaluate decision trade-offs
- **C (Continue)**: Save the current decisions and proceed to next decision category

## PROTOCOL INTEGRATION:

- When 'A' selected: Invoke the `bmad-advanced-elicitation` skill
- When 'P' selected: Invoke the `bmad-party-mode` skill
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Infrastructure context from step 1 is available (IaC tool, container strategy, env topology)
- Architecture document decisions are available
- Existing CI/CD configuration scan results are available
- Focus on pipeline platform and branching strategy decisions

## YOUR TASK:

Facilitate collaborative pipeline architecture decision making, leveraging existing infrastructure context and architecture decisions, focusing on the foundational choices that shape all subsequent pipeline stages.

## DECISION MAKING SEQUENCE:

### 1. Load Context & Check Existing Preferences

**Review Infrastructure Context from Step 1:**
"Based on our initialization in step 1, let's build on these foundations:

**Infrastructure Context:**
- IaC Tool: {{iac_tool_from_step_1}}
- Container Strategy: {{container_strategy_from_step_1}}
- Environment Topology: {{env_topology_from_step_1}}

**Existing CI/CD Configuration:**
{{existing_cicd_config_from_step_1}}

**Architecture Decisions (relevant):**
{{relevant_architecture_decisions}}"

**Identify What's Already Decided:**
Based on infrastructure context, architecture document, and existing CI/CD config, identify what decisions are already made versus what needs collaborative decision making.

### 2. Decision Categories

#### Category 1: CI/CD Platform Selection

Options to present with trade-offs:
- **GitHub Actions** - Native GitHub integration, YAML-based, marketplace ecosystem
- **GitLab CI** - Built into GitLab, YAML-based, comprehensive DevSecOps
- **Jenkins** - Self-hosted, Groovy-based, maximum flexibility and plugin ecosystem
- **Azure DevOps** - Microsoft ecosystem, YAML pipelines, Azure-native
- **CircleCI** - Cloud-native, YAML-based, strong Docker support
- **Buildkite** - Hybrid model (cloud orchestration, self-hosted agents), scalable

**Present the Decision:**
Based on user skill level and project context:

**Expert Mode:**
"CI/CD Platform Selection:

Options: {{concise_option_list_with_tradeoffs}}

Given your {{existing_vcs_platform}} and {{infrastructure_choices}}, what's your preference?"

**Intermediate Mode:**
"Next decision: CI/CD Platform

We need to choose where your pipelines will run.

Common options:
{{option_list_with_brief_explanations}}

For your project, I'd lean toward {{recommendation}} because {{reason}}. What are your thoughts?"

**Beginner Mode:**
"Let's talk about where your pipelines will run.

{{Educational_Context_About_CI_CD_Platforms}}

Think of it like {{real_world_analogy}} - an automated assembly line for your code.

Your main options:
{{friendly_options_with_pros_cons}}

My suggestion: {{recommendation}}
This is good for you because {{beginner_friendly_reason}}.

What feels right to you?"

**Verify Technology Versions:**
```
Search the web: "{{platform}} latest version features"
Search the web: "{{platform}} pricing current"
```

#### Category 2: Pipeline-as-Code Approach

- **YAML declarative** - Structured, readable, widely supported (GitHub Actions, GitLab CI, Azure DevOps)
- **Groovy scripted** - Programmable, flexible (Jenkins scripted pipeline)
- **Groovy declarative** - Structured Groovy (Jenkins declarative pipeline)
- **HCL** - Terraform-style (Waypoint)
- **Starlark** - Python-like (Buildkite, some tools)

Note: This decision may be determined by the CI/CD platform choice.

#### Category 3: Branch Strategy and Pipeline Implications

- **Trunk-Based Development** - Short-lived branches, continuous integration to main, feature flags for incomplete work. Pipeline: single main pipeline with feature-flag-gated deployments
- **GitHub Flow** - Feature branches off main, PR-based merging. Pipeline: PR validation pipeline + main deployment pipeline
- **GitFlow** - Feature/develop/release/hotfix branches. Pipeline: Multiple pipelines per branch type, release branch promotion

Present how each strategy impacts pipeline complexity and deployment frequency.

#### Category 4: Monorepo vs Polyrepo Pipeline Considerations

- **Monorepo** - Path-based triggers, selective builds, shared pipeline definitions, dependency-aware ordering
- **Polyrepo** - Independent pipelines per repo, cross-repo orchestration challenges, simpler per-repo config
- **Hybrid** - Core services in monorepo, peripheral services in separate repos

Note: This may already be determined by the project structure.

#### Category 5: Runner/Agent Infrastructure

- **Managed/Cloud runners** - Zero maintenance, pay-per-minute, limited customization
- **Self-hosted runners** - Full control, security isolation, cost optimization at scale
- **Hybrid** - Managed for standard builds, self-hosted for specialized/security-sensitive workloads

Security considerations:
- Network access to deployment targets
- Secrets management in runner environment
- Runner isolation between projects/environments

### 3. Facilitate Each Decision

For each category, follow the collaborative decision pattern:

**Get User Input:**
"What's your preference? (or 'explain more' for details)"

**Handle User Response:**

- If user wants more info: Provide deeper explanation
- If user has preference: Discuss implications and record decision
- If user wants alternatives: Explore other options

**Record the Decision:**

- Category: {{category}}
- Decision: {{user_choice}}
- Version: {{verified_version_if_applicable}}
- Rationale: {{user_reasoning_or_default}}
- Affects: {{downstream_pipeline_decisions}}

### 4. Generate Pipeline Architecture Content

After facilitating all decision categories, prepare the content to append:

#### Content Structure:

```markdown
## Pipeline Architecture

### CI/CD Platform

**Platform:** {{platform_choice}}
**Version:** {{verified_version}}
**Rationale:** {{rationale}}

### Pipeline-as-Code Approach

**Approach:** {{approach_choice}}
**Configuration Format:** {{format}}
**Rationale:** {{rationale}}

### Branch Strategy

**Strategy:** {{branch_strategy}}
**Pipeline Implications:**
{{how_strategy_maps_to_pipeline_triggers_and_flows}}

### Repository Strategy

**Approach:** {{monorepo_polyrepo_hybrid}}
**Pipeline Implications:**
{{trigger_strategy_selective_builds_etc}}

### Runner Infrastructure

**Runner Type:** {{managed_selfhosted_hybrid}}
**Security Model:** {{isolation_and_access_model}}
**Rationale:** {{rationale}}
```

### 5. Present Content and Menu

Show the generated pipeline architecture content and present choices:

"I've documented our pipeline architecture decisions.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**What would you like to do?**
[A] Advanced Elicitation - Explore innovative approaches to any specific decisions
[P] Party Mode - Review decisions from multiple perspectives
[C] Continue - Save these decisions and move to pipeline stage design"

### 6. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with specific decision categories
- Process enhanced insights about particular decisions
- Ask user: "Accept these enhancements to the pipeline architecture? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with pipeline architecture context
- Process collaborative insights about decision trade-offs
- Ask user: "Accept these changes to the pipeline architecture? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/pipeline.md`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `./step-03-pipeline-stages.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 4.

## SUCCESS METRICS:

✅ All pipeline architecture decisions made collaboratively
✅ Technology versions verified using web search
✅ Decision rationale clearly documented
✅ Infrastructure context leveraged for informed decisions
✅ Existing CI/CD configuration considered in recommendations
✅ User provided appropriate level of explanation for skill level
✅ A/P/C menu presented and handled correctly for each category
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Making recommendations instead of facilitating decisions
❌ Not verifying technology versions with web search
❌ Ignoring existing infrastructure context from step 1
❌ Not adapting explanations to user skill level
❌ Forgetting to consider existing CI/CD configuration
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-03-pipeline-stages.md` to design the pipeline stages.

Remember: Do NOT proceed to step-03 until user explicitly selects 'C' from the A/P/C menu and content is saved!
