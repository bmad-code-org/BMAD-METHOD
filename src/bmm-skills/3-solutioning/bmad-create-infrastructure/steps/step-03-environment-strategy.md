# Step 3: Environment Management Strategy

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between infrastructure peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on making environment strategy decisions collaboratively
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

- IaC strategy decisions from step 2 are available
- Infrastructure indicators from step 1 are available
- Architecture decisions from step 1 are available
- Focus on environment management decisions only - containerization is in step 4
- Collaborative decision making, not recommendations

## YOUR TASK:

Facilitate collaborative environment management decision making, building on the IaC strategy established in step 2 to define how environments are structured, configured, and managed.

## DECISION MAKING SEQUENCE:

### 1. Load Context from Previous Steps

Review relevant decisions:
- IaC tool and state management choices from step 2
- Architecture Category 5 environment-related decisions
- Existing CI/CD indicators from step 1

### 2. Decision Categories

#### Category 1: Environment Topology

- Define environment tiers (development, staging, QA, production)
- Ephemeral/preview environments for pull requests
- Environment promotion flow (which environments gate production?)
- Shared vs isolated environments (per-developer, per-team, per-feature)

Present with skill-level-appropriate explanations:

**Expert Mode:**
"Environment Topology: Define your environment tiers and promotion flow.

Considerations:
- Minimal: dev -> prod (fast, risky)
- Standard: dev -> staging -> prod (balanced)
- Enterprise: dev -> QA -> staging -> prod (thorough)
- Plus ephemeral: PR-based preview environments for testing

What topology fits your team and risk tolerance?"

**Intermediate Mode:**
"We need to decide which environments your project will have. Environments are separate copies of your application - each serving a different purpose.

Common setups:
- **Minimal** (dev + prod) - Fast iteration, but less safety
- **Standard** (dev + staging + prod) - Good balance of speed and safety
- **Extended** (dev + QA + staging + prod) - More validation gates before production
- **With ephemeral** - Temporary environments for each pull request

For most projects, I'd suggest starting with {{recommendation}}. What makes sense for your team?"

**Beginner Mode:**
"Let's talk about environments.

Think of environments like dress rehearsals before opening night. You wouldn't perform a play without practicing first - similarly, you want to test your application in conditions similar to production before releasing it to users.

Your options:
- **Development** - Where you build and test daily (like a practice room)
- **Staging** - A near-perfect copy of production (like a dress rehearsal)
- **Production** - The real thing, what your users see (opening night)
- **Ephemeral** - Temporary test environments created automatically for each change

My suggestion: {{recommendation}}
This gives you {{beginner_friendly_reason}}.

What feels right for your project?"

#### Category 2: Environment Parity (12-Factor Factor X)

- Dev/prod parity principles and practical trade-offs
- Which services should be identical across environments vs. scaled down
- Data parity strategy (anonymized production data, synthetic data, seed data)
- Infrastructure parity (same IaC modules with different parameters vs. separate definitions)

#### Category 3: Configuration Management (12-Factor Factor III)

- Per-environment configuration approach (env vars, config files, parameter store)
- Configuration hierarchy and override strategy
- Feature flags vs. environment-specific configuration
- Configuration validation and drift detection

#### Category 4: Secrets Management

- Secrets management tool (HashiCorp Vault, AWS KMS, Azure Key Vault, GCP Secret Manager, sealed-secrets, SOPS)
- Secret rotation policy and automation
- Secret injection method (env vars, mounted volumes, sidecar, init container)
- Access control and audit logging for secrets

**Verify Technology Versions:**
```
Search the web: "{{selected_tool}} latest stable version"
Search the web: "{{selected_tool}} secret rotation best practices"
```

#### Category 5: Environment Provisioning and Teardown

- Environment creation automation (IaC apply, scripts, GitOps)
- Teardown automation and scheduling (auto-destroy ephemeral after merge)
- Environment bootstrapping (initial data, service accounts, network peering)
- Self-service environment creation capabilities

#### Category 6: Cost Management and Resource Tagging

- Resource tagging strategy (environment, team, cost-center, project)
- Cost allocation and chargeback approach
- Non-production environment scheduling (scale down after hours)
- Resource cleanup automation for orphaned resources
- Budget alerts and spending limits per environment

### 3. Facilitate Each Decision Category

For each category:
- Present the decision context with skill-level-appropriate explanation
- Reference IaC tool choice from step 2 where relevant
- Get user input
- Record decision with rationale

**Record Each Decision:**

- Category: {{category}}
- Decision: {{user_choice}}
- Rationale: {{user_reasoning_or_default}}
- Affects: {{environments_or_workflows}}

### 4. Generate Environment Strategy Content

After facilitating all decision categories, prepare the content to append:

#### Content Structure:

```markdown
## Environment Management Strategy

### Environment Topology

**Tiers:** {{environment_tiers}}
**Promotion Flow:** {{promotion_flow}}
**Ephemeral Environments:** {{ephemeral_strategy}}
**Isolation Model:** {{isolation_approach}}

### Environment Parity (12-Factor X)

**Parity Principles:** {{parity_approach}}
**Service Scaling:** {{service_scaling_per_environment}}
**Data Strategy:** {{data_parity_approach}}
**Infrastructure Parity:** {{infra_parity_approach}}

### Configuration Management (12-Factor III)

**Configuration Approach:** {{config_approach}}
**Hierarchy:** {{config_hierarchy}}
**Feature Flags:** {{feature_flag_strategy}}
**Validation:** {{config_validation_approach}}

### Secrets Management

**Tool:** {{secrets_tool}} {{version}}
**Rotation:** {{rotation_policy}}
**Injection:** {{injection_method}}
**Access Control:** {{access_control_approach}}

### Environment Provisioning & Teardown

**Creation:** {{creation_automation}}
**Teardown:** {{teardown_automation}}
**Bootstrapping:** {{bootstrapping_approach}}
**Self-Service:** {{self_service_capabilities}}

### Cost Management & Tagging

**Tagging Strategy:** {{tagging_strategy}}
**Cost Allocation:** {{cost_allocation}}
**Scheduling:** {{non_prod_scheduling}}
**Cleanup:** {{cleanup_automation}}
**Budget Alerts:** {{budget_alert_approach}}
```

### 5. Present Content and Menu

Show the generated environment strategy content and present choices:

"I've documented the environment management strategy we've made together.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**What would you like to do?**
[A] Advanced Elicitation - Explore innovative approaches to any specific decisions
[P] Party Mode - Review decisions from multiple perspectives
[C] Continue - Save these decisions and move to Container Strategy"

### 6. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with specific decision categories
- Process enhanced insights about particular decisions
- Ask user: "Accept these enhancements to the environment strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with environment strategy context
- Process collaborative insights about decision trade-offs
- Ask user: "Accept these changes to the environment strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/infrastructure.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `./step-04-container-strategy.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 4.

## SUCCESS METRICS:

✅ All environment management decisions made collaboratively
✅ Technology versions verified using web search
✅ Decision rationale clearly documented
✅ 12-Factor principles (Factor III and X) properly addressed
✅ Cost management and tagging strategy defined
✅ User provided appropriate level of explanation for skill level
✅ A/P/C menu presented and handled correctly for each category
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Making recommendations instead of facilitating decisions
❌ Not verifying technology versions with web search
❌ Ignoring IaC tool choice from step 2 when discussing state/config
❌ Not adapting explanations to user skill level
❌ Skipping cost management and tagging decisions
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-04-container-strategy.md` to define containerization strategy.

Remember: Do NOT proceed to step-04 until user explicitly selects 'C' from the A/P/C menu and content is saved!
