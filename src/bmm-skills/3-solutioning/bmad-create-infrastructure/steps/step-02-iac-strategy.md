# Step 2: Infrastructure-as-Code Strategy

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between infrastructure peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on making IaC strategy decisions collaboratively
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

- Infrastructure indicators from step 1 are available
- Architecture Category 5 decisions from step 1 are available
- Project context file may contain infrastructure preferences and rules
- Focus on IaC strategy decisions only - environment strategy is in step 3
- Collaborative decision making, not recommendations

## YOUR TASK:

Facilitate collaborative IaC strategy decision making, leveraging existing infrastructure indicators and architecture decisions as starting context.

## DECISION MAKING SEQUENCE:

### 1. Load Context from Step 1

Review what was discovered in initialization:
- Existing IaC indicators found in the project
- Architecture Category 5 decisions (if any)
- Project context preferences

### 2. Decision Categories

#### Category 1: IaC Tool Selection

Present the decision with skill-level-appropriate explanations:

**Expert Mode:**
"IaC Tool Selection: Terraform, Pulumi, AWS CDK, CloudFormation, Crossplane

Options with trade-offs:
- **Terraform** - HCL declarative, cloud-agnostic, massive provider ecosystem, state management overhead
- **Pulumi** - General-purpose languages (TS/Python/Go), cloud-agnostic, familiar programming constructs
- **AWS CDK** - TypeScript/Python, AWS-native, CloudFormation under the hood, strong typing
- **CloudFormation** - AWS-native, YAML/JSON, no state management needed, AWS-only
- **Crossplane** - Kubernetes-native, GitOps-aligned, control plane approach, steeper learning curve

What's your preference?"

**Intermediate Mode:**
"We need to choose our Infrastructure-as-Code tool. This is how we'll define and manage all our cloud resources as code instead of clicking through consoles.

Common options:
- **Terraform** - The industry standard. Uses its own language (HCL). Works with any cloud provider. Huge community.
- **Pulumi** - Write infrastructure in languages you already know (TypeScript, Python). Newer but growing fast.
- **AWS CDK** - Best if you're all-in on AWS. Uses TypeScript or Python to generate CloudFormation.
- **CloudFormation** - AWS's built-in tool. No extra state management. AWS-only.
- **Crossplane** - If you're already deep into Kubernetes. Manages cloud resources like K8s resources.

For your project, I'd lean toward {{recommendation}} because {{reason}}. What are your thoughts?"

**Beginner Mode:**
"Let's talk about Infrastructure-as-Code (IaC).

Instead of manually setting up servers and databases through a web console, IaC lets you describe your infrastructure in files - like a recipe for your cloud setup. Anyone can recreate the exact same environment from these files.

Think of it like the difference between cooking from memory vs. having a detailed recipe. The recipe ensures consistency every time.

Your main options:
- **Terraform** - Most popular. Like a universal recipe book that works with any kitchen (cloud provider). Great community support.
- **Pulumi** - Uses programming languages you might already know. Like writing recipes in your native language instead of learning a new one.
- **AWS CDK** - Best if your kitchen is exclusively AWS. Generates the native AWS recipe format automatically.

My suggestion: {{recommendation}}
This is good for you because {{beginner_friendly_reason}}.

What feels right to you?"

**Verify Technology Versions:**
```
Search the web: "{{selected_tool}} latest stable version"
Search the web: "{{selected_tool}} current LTS version"
```

#### Category 2: State Management

- Remote backend selection (S3+DynamoDB, GCS, Azure Blob, Terraform Cloud, Pulumi Cloud)
- State locking mechanism
- Workspace/stack strategy (per-environment, per-component, or hybrid)
- State file organization and access control

#### Category 3: Module/Component Design

- Module structure for reusability (monorepo vs multi-repo)
- Shared module registry strategy
- Versioning approach for infrastructure modules
- Composability patterns (root modules, child modules, data sources)

#### Category 4: Policy-as-Code

- Policy engine selection (OPA/Rego, Sentinel, Checkov, tfsec, Bridgecrew)
- Policy scope (security, cost, compliance, naming conventions)
- Enforcement model (advisory, soft-mandatory, hard-mandatory)
- Integration with CI/CD pipeline

#### Category 5: Drift Detection and Remediation

- Drift detection approach (scheduled plans, continuous monitoring)
- Remediation strategy (auto-fix, alert-and-review, manual)
- Notification and alerting integration
- Reconciliation workflow

### 3. Facilitate Each Decision Category

For each category:
- Present the decision context with skill-level-appropriate explanation
- Reference any existing indicators or Architecture Category 5 decisions
- Get user input
- Record decision with rationale

**Record Each Decision:**

- Category: {{category}}
- Decision: {{user_choice}}
- Version: {{verified_version_if_applicable}}
- Rationale: {{user_reasoning_or_default}}
- Affects: {{components_or_environments}}

### 4. Generate IaC Strategy Content

After facilitating all decision categories, prepare the content to append:

#### Content Structure:

```markdown
## IaC Strategy

### Tool Selection

**IaC Tool:** {{selected_tool}} {{version}}
**Rationale:** {{rationale}}

### State Management

**Backend:** {{backend_choice}}
**Locking:** {{locking_mechanism}}
**Workspace Strategy:** {{workspace_approach}}
**Access Control:** {{access_control_approach}}

### Module/Component Design

**Structure:** {{module_structure}}
**Registry:** {{registry_strategy}}
**Versioning:** {{versioning_approach}}
**Composability:** {{composability_patterns}}

### Policy-as-Code

**Engine:** {{policy_engine}}
**Scope:** {{policy_scope}}
**Enforcement:** {{enforcement_model}}
**CI/CD Integration:** {{integration_approach}}

### Drift Detection & Remediation

**Detection:** {{detection_approach}}
**Remediation:** {{remediation_strategy}}
**Alerting:** {{alerting_integration}}
**Reconciliation:** {{reconciliation_workflow}}
```

### 5. Present Content and Menu

Show the generated IaC strategy content and present choices:

"I've documented the IaC strategy decisions we've made together.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**What would you like to do?**
[A] Advanced Elicitation - Explore innovative approaches to any specific decisions
[P] Party Mode - Review decisions from multiple perspectives
[C] Continue - Save these decisions and move to Environment Strategy"

### 6. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with specific decision categories
- Process enhanced insights about particular decisions
- Ask user: "Accept these enhancements to the IaC strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with IaC strategy context
- Process collaborative insights about decision trade-offs
- Ask user: "Accept these changes to the IaC strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/infrastructure.md`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `./step-03-environment-strategy.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 4.

## SUCCESS METRICS:

✅ All IaC strategy decisions made collaboratively
✅ Technology versions verified using web search
✅ Decision rationale clearly documented
✅ Existing infrastructure indicators factored into decisions
✅ Architecture Category 5 decisions used as starting context
✅ User provided appropriate level of explanation for skill level
✅ A/P/C menu presented and handled correctly for each category
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Making recommendations instead of facilitating decisions
❌ Not verifying technology versions with web search
❌ Ignoring existing infrastructure indicators from step 1
❌ Not adapting explanations to user skill level
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-03-environment-strategy.md` to define environment management strategy.

Remember: Do NOT proceed to step-03 until user explicitly selects 'C' from the A/P/C menu and content is saved!
