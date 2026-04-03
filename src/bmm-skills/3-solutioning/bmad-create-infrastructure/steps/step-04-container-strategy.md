# Step 4: Containerization Strategy

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between infrastructure peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on making containerization decisions collaboratively
- 🌐 ALWAYS search the web to verify current technology versions
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 🌐 Search the web to verify technology versions and options
- ⚠️ Present A/P/C menu after each major decision category
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
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

- IaC strategy from step 2 is available
- Environment strategy from step 3 is available
- Infrastructure indicators from step 1 are available (container-related files)
- Focus on containerization decisions only - validation is in step 5
- Collaborative decision making, not recommendations

## YOUR TASK:

Facilitate collaborative containerization decision making. First determine if the project should use containers at all, then if applicable, define the complete containerization strategy.

## DECISION MAKING SEQUENCE:

### 1. Assess Containerization Context

Review what was discovered in step 1:
- Were any container files found? (`Dockerfile`, `docker-compose*.yml`, `k8s/`)
- What does the Architecture document say about deployment?
- What IaC tool was chosen in step 2?

### 2. Initial Decision: Should This Project Use Containers?

**If container indicators were found in step 1:**
"I found existing container artifacts in your project: {{found_artifacts}}. Let's build on these and define a comprehensive containerization strategy."

Proceed directly to decision categories.

**If NO container indicators were found:**

Present the decision with skill-level-appropriate trade-off analysis:

**Expert Mode:**
"No containerization indicators found. Should this project use containers?

Trade-offs:
- **Containerized**: Consistent environments, portable, orchestration ecosystem, image management overhead
- **Serverless/PaaS**: Managed infrastructure, auto-scaling, vendor lock-in, cold starts
- **VM-based**: Full OS control, simpler networking, larger resource footprint, slower provisioning
- **Hybrid**: Mix approaches per service based on requirements

Your project characteristics suggest {{analysis}}. What's your preference?"

**Intermediate Mode:**
"Your project doesn't currently use containers. Let's decide if it should.

**Containers** (Docker, Kubernetes):
- Pros: Same environment everywhere, easy to scale, great tooling ecosystem
- Cons: Added complexity, need to manage images and orchestration

**Serverless/PaaS** (Lambda, Cloud Run, Heroku):
- Pros: Zero server management, auto-scaling, pay-per-use
- Cons: Vendor lock-in, cold starts, limited runtime options

**Traditional VMs** (EC2, GCE):
- Pros: Full control, simple model, no container overhead
- Cons: More manual management, slower to provision

Based on your project, I'd lean toward {{recommendation}} because {{reason}}. What do you think?"

**Beginner Mode:**
"Let's talk about whether your project should use containers.

Think of a container like a lunchbox that has everything your application needs to run - the code, settings, and all dependencies. No matter where you open the lunchbox, you get the exact same meal.

Your options:
- **Containers** (Docker) - Pack your app in a lunchbox. Same app everywhere. Very popular in modern development.
- **Serverless** (like AWS Lambda) - Don't worry about servers at all. Just upload your code and it runs. Great for simpler apps.
- **Traditional servers** - Set up a computer in the cloud and run your app on it. Simple to understand, more to manage.

My suggestion: {{recommendation}}
This is good for you because {{beginner_friendly_reason}}.

What feels right?"

**If user chooses "not containerized":**
- Record the decision with rationale
- Skip to generating a minimal content section noting the decision
- Proceed to step 5

### 3. Decision Categories (If Containerized)

#### Category 1: Container Runtime Selection

- Docker (industry standard, widest tooling support)
- containerd (lightweight, Kubernetes-native runtime)
- Podman (daemonless, rootless by default, Docker-compatible CLI)

**Verify Technology Versions:**
```
Search the web: "{{selected_runtime}} latest stable version"
```

#### Category 2: Dockerfile Best Practices

- Multi-stage builds strategy (builder vs runtime stages)
- Base image selection (distroless, alpine, slim, full)
- Layer optimization approach (dependency caching, minimal layers)
- Security: non-root user, read-only filesystem, minimal packages
- `.dockerignore` strategy
- Build argument and secret handling during build

#### Category 3: Container Orchestration

- Kubernetes (EKS, GKE, AKS, self-managed)
- Amazon ECS / Fargate
- Google Cloud Run
- AWS App Runner
- Docker Compose (development/small deployments only)
- Nomad

Present trade-offs based on:
- Team expertise and operational readiness
- Scale requirements from architecture decisions
- Cost implications
- Managed vs self-managed preference

**Verify Technology Versions:**
```
Search the web: "{{selected_orchestrator}} latest stable version"
Search the web: "{{selected_orchestrator}} production best practices"
```

#### Category 4: Registry and Image Management

- Registry selection (ECR, GCR/Artifact Registry, Docker Hub, GitHub Container Registry, Harbor)
- Image tagging strategy (semver, git SHA, branch-based, immutable tags)
- Image scanning (Trivy, Snyk Container, ECR scanning, Grype)
- Image signing (cosign, Notary, Docker Content Trust)
- Retention policy for old images

#### Category 5: Manifest Management

- Helm (templated charts, release management, repository ecosystem)
- Kustomize (overlay-based, built into kubectl, no templating)
- Raw manifests (simple, no abstraction, harder to manage at scale)
- CDK8s / Pulumi K8s (programmatic, type-safe, general-purpose languages)

### 4. Facilitate Each Decision Category

For each category:
- Present the decision context with skill-level-appropriate explanation
- Reference container indicators found in step 1
- Reference IaC and environment decisions from steps 2-3
- Get user input
- Record decision with rationale

**Record Each Decision:**

- Category: {{category}}
- Decision: {{user_choice}}
- Version: {{verified_version_if_applicable}}
- Rationale: {{user_reasoning_or_default}}
- Affects: {{deployment_and_operations}}

### 5. Generate Container Strategy Content

After facilitating all decision categories, prepare the content to append:

#### Content Structure (If Containerized):

```markdown
## Containerization Strategy

### Container Runtime

**Runtime:** {{selected_runtime}} {{version}}
**Rationale:** {{rationale}}

### Dockerfile Standards

**Build Strategy:** {{multi_stage_approach}}
**Base Images:** {{base_image_selection}}
**Layer Optimization:** {{layer_strategy}}
**Security Practices:** {{security_practices}}
**Build Secrets:** {{build_secret_handling}}

### Container Orchestration

**Platform:** {{selected_orchestrator}} {{version}}
**Management:** {{managed_vs_self_managed}}
**Rationale:** {{rationale}}

### Registry & Image Management

**Registry:** {{selected_registry}}
**Tagging Strategy:** {{tagging_approach}}
**Scanning:** {{scanning_tool}}
**Signing:** {{signing_approach}}
**Retention:** {{retention_policy}}

### Manifest Management

**Tool:** {{selected_tool}} {{version}}
**Rationale:** {{rationale}}
**Structure:** {{manifest_organization}}
```

#### Content Structure (If Not Containerized):

```markdown
## Containerization Strategy

### Decision: Not Containerized

**Deployment Model:** {{chosen_model}} (serverless/VM/PaaS)
**Rationale:** {{rationale}}
**Future Consideration:** {{when_to_reconsider_containers}}
```

### 6. Present Content and Menu

Show the generated container strategy content and present choices:

"I've documented the containerization strategy we've made together.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**What would you like to do?**
[A] Advanced Elicitation - Explore innovative approaches to any specific decisions
[P] Party Mode - Review decisions from multiple perspectives
[C] Continue - Save these decisions and move to Final Validation"

### 7. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with specific decision categories
- Process enhanced insights about particular decisions
- Ask user: "Accept these enhancements to the container strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with container strategy context
- Process collaborative insights about decision trade-offs
- Ask user: "Accept these changes to the container strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/infrastructure.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `./step-05-validation.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Containerization decision made (use containers or not) with clear rationale
✅ If containerized: all container strategy decisions made collaboratively
✅ Technology versions verified using web search
✅ Decision rationale clearly documented
✅ Existing container indicators factored into decisions
✅ User provided appropriate level of explanation for skill level
✅ A/P/C menu presented and handled correctly for each category
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Assuming containers without asking when no indicators found
❌ Making recommendations instead of facilitating decisions
❌ Not verifying technology versions with web search
❌ Ignoring container indicators from step 1
❌ Not adapting explanations to user skill level
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-05-validation.md` to validate and finalize the infrastructure decision document.

Remember: Do NOT proceed to step-05 until user explicitly selects 'C' from the A/P/C menu and content is saved!
