# Step 3: Pipeline Stage Design

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between pipeline architecture peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on designing pipeline stages collaboratively - this is the core of the workflow
- 🌐 ALWAYS search the web to verify current technology versions
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 🌐 Search the web to verify technology versions and options
- ⚠️ Present A/P/C menu after each major decision category
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices for each pipeline stage:

- **A (Advanced Elicitation)**: Use discovery protocols to explore innovative approaches to specific stages
- **P (Party Mode)**: Bring multiple perspectives to evaluate stage design trade-offs
- **C (Continue)**: Save the current stage decisions and proceed to next stage

## PROTOCOL INTEGRATION:

- When 'A' selected: Invoke the `bmad-advanced-elicitation` skill
- When 'P' selected: Invoke the `bmad-party-mode` skill
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Pipeline architecture decisions from step 2 are available (platform, branch strategy, runner type)
- Infrastructure context from step 1 is available
- Architecture document decisions are available
- Focus on designing the actual pipeline stages end-to-end

## YOUR TASK:

Facilitate collaborative design of the pipeline stages from source to production. This is the core of the pipeline workflow - design each stage of the pipeline with the user, making decisions about tools, strategies, and configurations for each stage.

## STAGE DESIGN SEQUENCE:

Present stages as an ordered pipeline. For each stage, facilitate collaborative decision making using the appropriate skill level.

### Stage 1: Source Stage

**Trigger Strategy:**
- Push triggers (on push to specific branches)
- Pull request triggers (on PR open/update)
- Tag triggers (on version tags)
- Schedule triggers (cron-based nightly/weekly)
- Manual triggers (workflow dispatch)

**Branch Filters:**
- Which branches trigger which pipeline behaviors
- How the branch strategy from step 2 maps to triggers

**Present the Decision:**
Based on user skill level:

**Expert Mode:**
"Source Stage - Trigger Configuration:
Given your {{branch_strategy}} strategy, how do you want triggers mapped?
Options: {{trigger_options_with_branch_implications}}"

**Beginner Mode:**
"Let's decide what starts your pipeline running.
Think of triggers like alarm clocks for your code - they wake up the pipeline when something happens.
{{friendly_explanation_of_trigger_options}}"

### Stage 2: Build Stage

- **Build tool**: Language/framework-appropriate build tool
- **Artifact format**: What the build produces (container image, binary, package, bundle)
- **Caching strategy**: Dependency caching, layer caching, build caching
- **Build matrix**: Multi-platform, multi-version builds if needed

**Verify Technology Versions:**
```
Search the web: "{{build_tool}} latest stable version"
Search the web: "{{build_tool}} caching best practices"
```

### Stage 3: Test Stage

- **Unit tests**: Framework, coverage threshold, parallelization
- **Integration tests**: Scope, test environment, service dependencies
- **E2E tests**: Framework, browser/environment matrix, parallelization
- **Test splitting strategy**: How to split tests across stages for fast feedback
- **Test environment**: Ephemeral environments, shared environments, local services

### Stage 4: Security Stage

- **SAST tool**: Static Application Security Testing (Semgrep, SonarQube, CodeQL, Snyk Code)
- **SCA/Dependency scanning**: Software Composition Analysis (Snyk, Dependabot, Renovate, OWASP Dependency-Check)
- **Secrets scanning**: Detect leaked secrets (GitLeaks, TruffleHog, GitHub Secret Scanning)
- **Container image scanning** (if applicable): Vulnerability scanning (Trivy, Grype, Snyk Container)
- **IaC scanning** (if applicable): Infrastructure code security (Checkov, tfsec, KICS)

### Stage 5: Package Stage

- **Artifact packaging**: How the final artifact is packaged
  - Container image (Docker/OCI)
  - Binary artifact
  - Language package (npm, PyPI, Maven, NuGet)
  - Cloud-native package (Helm chart, Lambda zip)
- **Versioning strategy**:
  - Semantic versioning (semver): MAJOR.MINOR.PATCH
  - Calendar versioning (calver): YYYY.MM.DD
  - Git SHA-based: Short commit hash
  - Hybrid: semver + git SHA
- **Artifact signing and provenance**:
  - Image signing (Cosign, Notation)
  - SBOM generation (Syft, Trivy)
  - Provenance attestation (SLSA)

### Stage 6: Deploy Stage

- **Deployment method**:
  - Push-based: Pipeline pushes to target (traditional)
  - Pull-based/GitOps: Target pulls desired state (ArgoCD, Flux)
- **Deployment tool**: ArgoCD, Flux, Helm, kubectl, Terraform, AWS CDK, Pulumi, Serverless Framework
- **Target environment sequence**: Which environments in what order (dev -> staging -> prod)

Note: Reference infrastructure context from step 1 for environment topology.

### Stage 7: Verify Stage

- **Smoke tests**: Quick health checks post-deployment
- **Health checks**: Application and dependency health verification
- **Synthetic monitoring**: Automated user journey testing in production
- **Rollback triggers**: What conditions automatically trigger rollback

### Stage 8: Promote Stage

- **Promotion gates**:
  - Manual approval (who approves, what environments)
  - Automated quality gates (test pass rate, coverage threshold, security scan clean)
  - Soak time (minimum time in environment before promotion)
- **Environment progression**: dev -> staging -> prod (or custom sequence)
- **Promotion mechanism**: Automated after gates pass vs manual trigger

### For Each Stage:

**Get User Input:**
"What's your preference? (or 'explain more' for details)"

**Handle User Response:**
- If user wants more info: Provide deeper explanation with real-world context
- If user has preference: Discuss implications and record decision
- If user wants alternatives: Explore other options
- If stage is not applicable: Mark as "N/A" with rationale

**Record the Decision:**
- Stage: {{stage_name}}
- Tool/Approach: {{user_choice}}
- Version: {{verified_version_if_applicable}}
- Configuration: {{key_config_decisions}}
- Rationale: {{user_reasoning_or_default}}

### Generate Pipeline Stages Content

After facilitating all stage decisions, prepare the content to append:

#### Content Structure:

```markdown
## Pipeline Stages

### Pipeline Overview

{{visual_representation_of_pipeline_stages_as_ordered_flow}}

### Source Stage

**Triggers:** {{trigger_configuration}}
**Branch Filters:** {{branch_filter_rules}}

### Build Stage

**Build Tool:** {{tool}} ({{version}})
**Artifact Format:** {{format}}
**Caching Strategy:** {{caching_approach}}
**Build Matrix:** {{matrix_config_or_na}}

### Test Stage

**Unit Tests:** {{framework}} - Coverage threshold: {{threshold}}
**Integration Tests:** {{scope_and_approach}}
**E2E Tests:** {{framework_and_approach_or_na}}
**Parallelization:** {{parallel_strategy}}

### Security Stage

**SAST:** {{tool}} ({{version}})
**SCA/Dependency Scanning:** {{tool}} ({{version}})
**Secrets Scanning:** {{tool}} ({{version}})
**Container Scanning:** {{tool_or_na}}
**IaC Scanning:** {{tool_or_na}}

### Package Stage

**Artifact Type:** {{artifact_format}}
**Versioning Strategy:** {{versioning_approach}}
**Signing/Provenance:** {{signing_and_sbom_approach}}

### Deploy Stage

**Method:** {{push_or_gitops}}
**Tool:** {{deployment_tool}} ({{version}})
**Environment Sequence:** {{env_progression}}

### Verify Stage

**Smoke Tests:** {{approach}}
**Health Checks:** {{approach}}
**Synthetic Monitoring:** {{approach_or_na}}
**Rollback Triggers:** {{criteria}}

### Promote Stage

**Promotion Gates:** {{gate_configuration}}
**Environment Progression:** {{full_progression_with_gates}}
**Promotion Mechanism:** {{auto_or_manual}}
```

### Present Content and Menu

Show the generated pipeline stages content and present choices:

"I've documented all pipeline stages we designed together.

**Here's what I'll add to the document:**

[Show the complete markdown content]

**What would you like to do?**
[A] Advanced Elicitation - Explore innovative approaches to any specific stages
[P] Party Mode - Review stage design from multiple perspectives
[C] Continue - Save these stage decisions and move to deployment strategy"

### Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with specific stage decisions
- Process enhanced insights about particular stages
- Ask user: "Accept these enhancements to the pipeline stages? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with pipeline stages context
- Process collaborative insights about stage design trade-offs
- Ask user: "Accept these changes to the pipeline stages? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/pipeline.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `./step-04-deployment-strategy.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure above.

## SUCCESS METRICS:

✅ All pipeline stages designed collaboratively
✅ Technology versions verified using web search for each tool
✅ Stage rationale clearly documented
✅ Pipeline architecture decisions from step 2 leveraged correctly
✅ Infrastructure context considered for deploy and verify stages
✅ User provided appropriate level of explanation for skill level
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Making tool recommendations instead of facilitating decisions
❌ Not verifying technology versions with web search
❌ Skipping stages without confirming N/A with user
❌ Not adapting explanations to user skill level
❌ Ignoring pipeline architecture decisions from step 2
❌ Not presenting A/P/C menu after content generation
❌ Not considering infrastructure context for deployment-related stages

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-04-deployment-strategy.md` to define deployment strategies.

Remember: Do NOT proceed to step-04 until user explicitly selects 'C' from the A/P/C menu and content is saved!
