# Step 4: Deployment Strategy

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between pipeline architecture peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on deployment strategy decisions that directly impact DORA metrics
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

- **A (Advanced Elicitation)**: Use discovery protocols to explore innovative approaches to deployment strategies
- **P (Party Mode)**: Bring multiple perspectives to evaluate deployment trade-offs
- **C (Continue)**: Save the current decisions and proceed to validation

## PROTOCOL INTEGRATION:

- When 'A' selected: Invoke the `bmad-advanced-elicitation` skill
- When 'P' selected: Invoke the `bmad-party-mode` skill
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Pipeline architecture decisions from step 2 are available
- Pipeline stage decisions from step 3 are available (especially deploy and promote stages)
- Infrastructure context from step 1 is available
- Focus on advanced deployment patterns, rollback, and operational resilience

## DORA METRICS CONTEXT:

These decisions directly impact your deployment frequency and change failure rate. The four DORA metrics to keep in mind:

1. **Deployment Frequency** - How often you deploy to production
2. **Lead Time for Changes** - Time from commit to production
3. **Change Failure Rate** - Percentage of deployments causing failures
4. **Mean Time to Recovery (MTTR)** - How quickly you recover from failures

Reference these metrics when discussing trade-offs for each decision.

## YOUR TASK:

Facilitate collaborative deployment strategy decision making, focusing on patterns that ensure safe, fast, and reliable deployments with clear rollback and recovery mechanisms.

## DECISION MAKING SEQUENCE:

### 1. Load Context from Previous Steps

**Review Deploy and Promote Stage Decisions:**
"Based on our pipeline stage design in step 3, let's deepen the deployment strategy:

**Deploy Stage Decisions:**
- Method: {{push_or_gitops_from_step_3}}
- Tool: {{deployment_tool_from_step_3}}
- Environment Sequence: {{env_progression_from_step_3}}

**Promote Stage Decisions:**
- Gates: {{promotion_gates_from_step_3}}
- Mechanism: {{promotion_mechanism_from_step_3}}"

### 2. Decision Categories

#### Category 1: Deployment Pattern

Options to present with trade-offs:

- **Blue-Green Deployment** - Two identical environments, instant switchover. Pro: zero-downtime, instant rollback. Con: 2x infrastructure cost, database state complexity
- **Canary Deployment** - Gradual traffic shift to new version. Pro: risk mitigation, real-world validation. Con: complexity, observability requirements, longer rollout
- **Rolling Update** - Gradual replacement of instances. Pro: resource efficient, built into orchestrators. Con: mixed versions during rollout, slower rollback
- **Recreate** - Tear down old, deploy new. Pro: simple, clean state. Con: downtime window required
- **A/B Testing** - Route specific users to new version. Pro: feature validation, user-segment testing. Con: routing complexity, session management

**Verify Technology Versions:**
```
Search the web: "{{deployment_tool}} {{pattern}} implementation"
Search the web: "{{pattern}} best practices {{year}}"
```

#### Category 2: Feature Flag Strategy

- **LaunchDarkly** - Enterprise feature management platform, rich targeting, analytics
- **Unleash** - Open-source feature toggle system, self-hosted or managed
- **Flagsmith** - Open-source, remote config and feature flags
- **Custom implementation** - Application-level feature flags (config-driven or database-driven)
- **None** - No feature flags, rely on branch/deploy strategy alone

Discuss how feature flags interact with the deployment pattern and branch strategy.

#### Category 3: Database Migration Coordination

- **Pre-deploy migrations** - Run migrations before deploying new code. Requires backward-compatible migrations
- **In-deploy migrations** - Migrations run as part of deployment process. Simpler but riskier
- **Post-deploy migrations** - Deploy code first, then migrate. Requires code that handles both schemas
- **Expand-Contract pattern** - Multi-phase: expand schema (additive), deploy code, contract schema (remove old). Safest for zero-downtime

Present how each approach affects rollback capability and downtime.

#### Category 4: Rollback Strategy

- **Automated rollback** - Automatically revert on failure criteria (health check failures, error rate spike, latency threshold)
- **Manual rollback** - Human decision to revert, with automated execution
- **Hybrid** - Automated for critical failures, manual for degraded performance

Sub-decisions:
- Rollback criteria (what triggers it)
- Rollback mechanism (redeploy previous version, traffic shift, infrastructure swap)
- Data rollback considerations (can database changes be reverted?)
- Rollback testing (do you regularly test rollback procedures?)

#### Category 5: Zero-Downtime Requirements

- **Required** - Application must be available during all deployments
- **Maintenance window acceptable** - Scheduled downtime windows for deployments
- **Best effort** - Minimize downtime but brief interruptions acceptable

If zero-downtime is required:
- Graceful shutdown handling (drain connections, finish in-flight requests)
- Health check integration (readiness vs liveness probes)
- Connection draining configuration
- Load balancer integration

#### Category 6: Multi-Region Deployment (If Applicable)

- **Single region** - All deployments to one region
- **Active-passive** - Primary region with failover region
- **Active-active** - Multiple regions serving traffic simultaneously

If multi-region:
- Region deployment order (canary region first?)
- Cross-region data consistency
- Regional rollback independence
- Global traffic management (Route53, CloudFront, Global Accelerator)

### 3. Facilitate Each Decision

For each category, follow the collaborative decision pattern from previous steps.

**Record the Decision:**

- Category: {{category}}
- Decision: {{user_choice}}
- DORA Impact: {{how_this_affects_dora_metrics}}
- Rationale: {{user_reasoning_or_default}}
- Rollback Implication: {{how_this_affects_rollback_capability}}

### 4. Generate Deployment Strategy Content

After facilitating all decision categories, prepare the content to append:

#### Content Structure:

```markdown
## Deployment Strategy

### DORA Metrics Alignment

**Target Profile:**
- Deployment Frequency: {{target_frequency}}
- Lead Time for Changes: {{target_lead_time}}
- Change Failure Rate: {{target_failure_rate}}
- Mean Time to Recovery: {{target_mttr}}

### Deployment Pattern

**Pattern:** {{deployment_pattern}}
**Implementation:** {{how_pattern_is_implemented_with_chosen_tools}}
**Rationale:** {{rationale}}

### Feature Flag Strategy

**Approach:** {{feature_flag_approach}}
**Tool:** {{tool_or_na}} ({{version}})
**Integration:** {{how_flags_integrate_with_deployment_pattern}}

### Database Migration Strategy

**Approach:** {{migration_approach}}
**Coordination:** {{how_migrations_coordinate_with_deployments}}
**Rollback Impact:** {{how_this_affects_rollback}}

### Rollback Strategy

**Type:** {{automated_manual_hybrid}}
**Triggers:** {{rollback_criteria}}
**Mechanism:** {{rollback_mechanism}}
**Data Handling:** {{data_rollback_approach}}
**Testing:** {{rollback_testing_approach}}

### Zero-Downtime Approach

**Requirement Level:** {{required_maintenance_window_best_effort}}
**Implementation:**
{{graceful_shutdown_health_checks_connection_draining}}

### Multi-Region Strategy

**Approach:** {{single_active_passive_active_active}}
{{multi_region_details_if_applicable}}

### Deployment Strategy Summary

{{visual_summary_of_complete_deployment_flow_from_commit_to_production}}
```

### 5. Present Content and Menu

Show the generated deployment strategy content and present choices:

"I've documented our deployment strategy decisions. These decisions directly impact your DORA metrics - particularly deployment frequency ({{assessment}}) and mean time to recovery ({{assessment}}).

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**What would you like to do?**
[A] Advanced Elicitation - Explore innovative approaches to deployment strategies
[P] Party Mode - Review deployment strategy from multiple perspectives
[C] Continue - Save these decisions and move to final validation"

### 6. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with deployment strategy context
- Process enhanced insights about deployment patterns
- Ask user: "Accept these enhancements to the deployment strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with deployment strategy context
- Process collaborative insights about deployment trade-offs
- Ask user: "Accept these changes to the deployment strategy? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/pipeline.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `./step-05-validation.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 4.

## SUCCESS METRICS:

✅ All deployment strategy decisions made collaboratively
✅ Technology versions verified using web search
✅ DORA metrics referenced for each decision trade-off
✅ Decision rationale clearly documented with DORA impact
✅ Rollback implications considered for every decision
✅ Pipeline stage decisions from step 3 leveraged correctly
✅ User provided appropriate level of explanation for skill level
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Making recommendations instead of facilitating decisions
❌ Not verifying technology versions with web search
❌ Not referencing DORA metrics when discussing trade-offs
❌ Ignoring rollback implications of deployment decisions
❌ Not adapting explanations to user skill level
❌ Not considering pipeline stage decisions from step 3
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-05-validation.md` to validate the complete pipeline architecture.

Remember: Do NOT proceed to step-05 until user explicitly selects 'C' from the A/P/C menu and content is saved!
