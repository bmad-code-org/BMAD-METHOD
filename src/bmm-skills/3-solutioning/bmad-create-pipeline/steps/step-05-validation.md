# Step 5: Pipeline Validation & Completion

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between pipeline architecture peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on validating pipeline coherence, completeness, and alignment with architecture
- ✅ VALIDATE all pipeline stages have been decided and are consistent
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ✅ Run comprehensive validation checks on the complete pipeline architecture
- ⚠️ Present A/P/C menu after generating validation results
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` on completion
- 🚫 FORBIDDEN to complete workflow until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to address complex pipeline issues found during validation
- **P (Party Mode)**: Bring multiple perspectives to resolve validation concerns
- **C (Continue)**: Save the validation results and complete the pipeline architecture

## PROTOCOL INTEGRATION:

- When 'A' selected: Invoke the `bmad-advanced-elicitation` skill
- When 'P' selected: Invoke the `bmad-party-mode` skill
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Complete pipeline document with all sections is available
- All pipeline architecture, stage, and deployment strategy decisions are defined
- Architecture document and infrastructure document (if exists) are available for cross-reference
- Focus on validation, gap analysis, and coherence checking

## YOUR TASK:

Validate the complete pipeline architecture for coherence, completeness, alignment with architecture and infrastructure decisions, and DORA metric readiness.

## VALIDATION SEQUENCE:

### 1. Present Complete Pipeline Decision Document Summary

Present a concise summary of all decisions made across steps 2-4:

"Here's a complete summary of your CI/CD pipeline architecture:

**Pipeline Architecture (Step 2):**
- Platform: {{platform}}
- Branch Strategy: {{branch_strategy}}
- Runner Infrastructure: {{runner_type}}

**Pipeline Stages (Step 3):**
- Source: {{trigger_summary}}
- Build: {{build_summary}}
- Test: {{test_summary}}
- Security: {{security_summary}}
- Package: {{package_summary}}
- Deploy: {{deploy_summary}}
- Verify: {{verify_summary}}
- Promote: {{promote_summary}}

**Deployment Strategy (Step 4):**
- Pattern: {{deployment_pattern}}
- Feature Flags: {{feature_flag_approach}}
- Database Migrations: {{migration_approach}}
- Rollback: {{rollback_strategy}}
- Zero-Downtime: {{zero_downtime_approach}}"

### 2. Cross-Reference with Architecture and Infrastructure

Validate alignment with architecture.md:

**Architecture Alignment:**
- Do pipeline technology choices align with architecture stack decisions?
- Does the deployment strategy support the architecture's scalability requirements?
- Are security scanning tools aligned with architecture security decisions?
- Does the environment progression match architecture's environment strategy?

**Infrastructure Alignment (if infrastructure.md exists):**
- Does the pipeline deploy to the infrastructure defined?
- Are IaC tools integrated into the pipeline appropriately?
- Does the container strategy align between pipeline and infrastructure?
- Are environment configurations consistent?

Report any misalignments found:
"I found the following alignment considerations:
{{alignment_findings}}"

### 3. DORA Metric Readiness Validation

Assess the pipeline against DORA metrics:

**Deployment Frequency:**
"Can you deploy on-demand? Based on your pipeline design:
- {{assessment_of_deployment_frequency_capability}}
- Bottlenecks: {{any_bottlenecks_limiting_frequency}}"

**Lead Time for Changes:**
"How quickly can a commit reach production?
- Pipeline stages: {{estimated_stage_count}}
- Promotion gates: {{gate_count_and_types}}
- Potential delays: {{identified_delays}}"

**Change Failure Rate:**
"How well does your pipeline catch issues before production?
- Security scanning: {{security_stage_coverage}}
- Test coverage: {{test_stage_coverage}}
- Verification: {{verify_stage_coverage}}"

**Mean Time to Recovery:**
"Can you recover in under an hour?
- Rollback strategy: {{rollback_readiness}}
- Monitoring: {{verify_stage_monitoring}}
- Automation level: {{recovery_automation_level}}"

### 4. Pipeline Completeness Check

Verify all critical pipeline stages have been decided:

**Critical Stage Checklist:**
- [ ] Source triggers defined
- [ ] Build process configured
- [ ] Test strategy established
- [ ] Security scanning integrated
- [ ] Artifact packaging defined
- [ ] Deployment method chosen
- [ ] Verification approach set
- [ ] Promotion gates configured
- [ ] Rollback strategy defined

Report any gaps:
"The following areas need attention:
{{gaps_found_or_all_clear}}"

### 5. Generate Validation Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## Pipeline Validation Results

### Architecture Alignment ✅

**Stack Compatibility:**
{{assessment_of_pipeline_tools_vs_architecture_stack}}

**Security Alignment:**
{{assessment_of_security_scanning_vs_architecture_security}}

**Environment Consistency:**
{{assessment_of_env_progression_vs_architecture_environments}}

### Infrastructure Alignment ✅

{{assessment_of_pipeline_vs_infrastructure_decisions_or_na}}

### DORA Metric Readiness

**Deployment Frequency:** {{ready_or_concern}}
{{assessment}}

**Lead Time for Changes:** {{ready_or_concern}}
{{assessment}}

**Change Failure Rate:** {{ready_or_concern}}
{{assessment}}

**Mean Time to Recovery:** {{ready_or_concern}}
{{assessment}}

### Pipeline Completeness Checklist

- [x] Source triggers defined
- [x] Build process configured
- [x] Test strategy established
- [x] Security scanning integrated
- [x] Artifact packaging defined
- [x] Deployment method chosen
- [x] Verification approach set
- [x] Promotion gates configured
- [x] Rollback strategy defined

### Alignment Issues Addressed

{{description_of_any_issues_found_and_resolutions}}

### Pipeline Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** {{high/medium/low}} based on validation results

**Key Strengths:**
{{list_of_pipeline_strengths}}

**Areas for Future Enhancement:**
{{areas_that_could_be_improved_later}}
```

### 6. Present Content and Menu

Show the validation results and present choices:

"I've completed a comprehensive validation of your pipeline architecture.

**Validation Summary:**

- ✅ Architecture Alignment: {{status}}
- ✅ Infrastructure Alignment: {{status}}
- ✅ DORA Readiness: {{status}}
- ✅ Completeness: {{status}}

**Here's what I'll add to complete the pipeline document:**

[Show the complete markdown content from step 5]

**What would you like to do?**
[A] Advanced Elicitation - Address any complex pipeline concerns
[P] Party Mode - Review validation from different operational perspectives
[C] Continue - Complete the pipeline architecture and finish workflow"

### 7. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with validation issues
- Process enhanced solutions for complex concerns
- Ask user: "Accept these pipeline improvements? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with validation context
- Process collaborative insights on pipeline readiness
- Ask user: "Accept these changes to the validation results? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/pipeline.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Report completion message

### 8. Completion Report

On final 'C', save to `{planning_artifacts}/pipeline.md` and report:

"Pipeline architecture documented. Your pipeline covers {{stage_count}} stages with {{deployment_strategy}} deployment. {{total_decisions}} decisions recorded across pipeline architecture, stage design, and deployment strategy.

**DORA Readiness:** {{dora_summary}}

**Recommended Next Steps:**
- Consider running the infrastructure workflow (`bmad-create-infrastructure`) if not already done
- Proceed to Create Epics and Stories (`bmad-create-epics-and-stories`) to break down implementation
- Review the architecture document to ensure pipeline decisions are reflected in the infrastructure section"

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Complete pipeline decision document presented as summary
✅ Cross-reference with architecture.md validated
✅ Cross-reference with infrastructure.md validated (if exists)
✅ DORA metric readiness assessed with specific findings
✅ All critical pipeline stages confirmed as decided
✅ Alignment issues identified and addressed
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected
✅ Completion report delivered with next step recommendations

## FAILURE MODES:

❌ Not presenting complete summary before validation
❌ Skipping cross-reference with architecture document
❌ Not assessing DORA metric readiness
❌ Missing completeness check for critical stages
❌ Not addressing alignment issues found
❌ Not presenting A/P/C menu after content generation
❌ Not providing clear next step recommendations on completion

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols
