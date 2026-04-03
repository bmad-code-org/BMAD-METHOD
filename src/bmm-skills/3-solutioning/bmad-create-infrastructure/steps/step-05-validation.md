# Step 5: Infrastructure Validation & Completion

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between infrastructure peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on validating infrastructure coherence and completeness
- ✅ VALIDATE all critical decisions were made
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ✅ Run comprehensive validation checks on the complete infrastructure document
- ⚠️ Present A/P/C menu after generating validation results
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` on final save
- 🚫 THIS IS THE FINAL STEP IN THIS WORKFLOW

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to address complex infrastructure concerns found during validation
- **P (Party Mode)**: Bring multiple perspectives to resolve validation concerns
- **C (Continue)**: Save the validation results and complete the infrastructure document

## PROTOCOL INTEGRATION:

- When 'A' selected: Invoke the `bmad-advanced-elicitation` skill
- When 'P' selected: Invoke the `bmad-party-mode` skill
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Complete infrastructure document with all sections is available
- All infrastructure decisions from steps 2-4 are documented
- Architecture document (if available) provides cross-reference context
- Focus on validation, gap analysis, and coherence checking

## YOUR TASK:

Validate the complete Infrastructure Decision Document for coherence, completeness, and alignment with architecture decisions. Present a summary for final review.

## VALIDATION SEQUENCE:

### 1. Present Complete Document Summary

Read the full `{planning_artifacts}/infrastructure.md` and present a structured summary of all decisions made:

"Here's a summary of your complete Infrastructure Decision Document:

**IaC Strategy:**
- Tool: {{tool_and_version}}
- State: {{state_management}}
- Modules: {{module_strategy}}
- Policy: {{policy_approach}}
- Drift: {{drift_strategy}}

**Environment Management:**
- Topology: {{environment_tiers}}
- Parity: {{parity_approach}}
- Configuration: {{config_approach}}
- Secrets: {{secrets_tool}}
- Provisioning: {{provisioning_approach}}
- Cost: {{cost_strategy}}

**Containerization:**
- {{containerized_or_not}}
- {{key_container_decisions_if_applicable}}"

### 2. Cross-Reference with Architecture Category 5

If architecture.md was loaded in step 1:
- Compare all infrastructure decisions against Architecture Category 5 (Infrastructure & Deployment)
- Identify any alignment issues or contradictions
- Report findings:

"**Architecture Alignment Check:**
- {{decision}}: {{aligned/misaligned}} - {{explanation}}
- ..."

If no architecture document:
"**Note:** No architecture document was available for cross-reference. Ensure infrastructure decisions are reviewed when the architecture is created."

### 3. Validate Critical Decisions

Check that all critical decisions were made based on project type:

**All Projects Must Have:**
- [ ] IaC tool selected with version
- [ ] State management strategy defined
- [ ] Environment topology defined
- [ ] Configuration management approach chosen
- [ ] Secrets management tool and strategy defined

**Containerized Projects Must Also Have:**
- [ ] Container runtime selected
- [ ] Orchestration platform chosen
- [ ] Registry and image management defined
- [ ] Dockerfile standards established

**Missing Decision Handling:**
If any critical decisions are missing:
"I noticed the following decisions weren't fully addressed:
- {{missing_decision}}

Would you like to address these now, or note them as deferred?"

### 4. Check for Missing Decisions by Project Type

Based on the project context and architecture:
- Web application: Does it address CDN, static asset hosting, SSL/TLS?
- API service: Does it address API gateway, rate limiting infrastructure?
- Data-intensive: Does it address data pipeline infrastructure, storage tiers?
- Multi-region: Does it address region strategy, failover, data replication?

Report any gaps relevant to the project type.

### 5. Generate Validation Content

Prepare the content to append:

#### Content Structure:

```markdown
## Infrastructure Validation

### Decision Summary

| Area | Key Decision | Status |
|------|-------------|--------|
| IaC Tool | {{tool}} | ✅ Decided |
| State Management | {{backend}} | ✅ Decided |
| Environment Topology | {{topology}} | ✅ Decided |
| Configuration | {{approach}} | ✅ Decided |
| Secrets Management | {{tool}} | ✅ Decided |
| Containerization | {{decision}} | ✅ Decided |
| {{other_decisions}} | {{details}} | ✅/⚠️ |

### Architecture Alignment

{{alignment_findings}}

### Completeness Assessment

**Critical Decisions:** {{all_addressed / gaps_identified}}
**Project-Type Decisions:** {{relevant_decisions_checked}}
**Overall Status:** {{READY / NEEDS_ATTENTION}}

### Deferred Decisions

{{any_decisions_explicitly_deferred_with_rationale}}

### Infrastructure Readiness Assessment

**Overall Status:** READY FOR PIPELINE DEFINITION

**Confidence Level:** {{high/medium/low}} based on validation results

**Key Strengths:**
{{list_of_infrastructure_strengths}}

**Areas for Future Enhancement:**
{{areas_that_could_be_improved_later}}
```

### 6. Present Content and Menu

Show the validation results and present choices:

"I've completed validation of your Infrastructure Decision Document.

**Validation Summary:**

- ✅ Decision coherence validated
- ✅ Architecture alignment checked
- ✅ Critical decisions verified
- ✅ Project-type gaps assessed

**Here's what I'll add to complete the document:**

[Show the complete markdown content from step 5]

**What would you like to do?**
[A] Advanced Elicitation - Address any complex infrastructure concerns
[P] Party Mode - Review validation from different operational perspectives
[C] Continue - Complete the infrastructure document"

### 7. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Invoke the `bmad-advanced-elicitation` skill with validation issues
- Process enhanced solutions for complex concerns
- Ask user: "Accept these infrastructure improvements? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Invoke the `bmad-party-mode` skill with validation context
- Process collaborative insights on infrastructure readiness
- Ask user: "Accept these changes to the validation results? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{planning_artifacts}/infrastructure.md`
- Update frontmatter:
  ```yaml
  stepsCompleted: [1, 2, 3, 4, 5]
  workflowType: 'infrastructure'
  lastStep: 5
  status: 'complete'
  completedAt: '{{current_date}}'
  ```
- Save final document to `{planning_artifacts}/infrastructure.md`

### 8. Report Completion

Both you and the user completed something important here - give a summary of what you achieved together and congratulate the user.

"Infrastructure decisions documented. Consider running the pipeline workflow (bmad-create-pipeline) to define your CI/CD strategy, or proceed to Create Epics and Stories to plan implementation."

Invoke the `bmad-help` skill for next steps guidance.

Upon completion: offer to answer any questions about the Infrastructure Decision Document.

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Complete infrastructure document summary presented
✅ Architecture Category 5 cross-reference completed
✅ All critical decisions validated as present
✅ Project-type specific gaps identified and addressed
✅ Comprehensive validation checklist completed
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected
✅ Clear next steps provided to user

## FAILURE MODES:

❌ Skipping cross-reference with architecture decisions
❌ Not checking for missing critical decisions
❌ Missing project-type specific gap analysis
❌ Not addressing gaps found during validation
❌ Providing incomplete validation summary
❌ Not presenting A/P/C menu after content generation
❌ Not providing clear next steps after completion

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## WORKFLOW COMPLETE:

This is the final step of the Infrastructure workflow. The user now has a complete, validated infrastructure decision document ready to guide deployment and operations decisions.

The infrastructure document will serve as the foundation for CI/CD pipeline definition and consistent environment management across the project lifecycle.
