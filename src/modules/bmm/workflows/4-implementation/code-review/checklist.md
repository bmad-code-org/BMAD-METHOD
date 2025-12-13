# Senior Developer Review - Validation Checklist

## Story Setup

- [ ] Story file loaded from `{{story_path}}`
- [ ] Story Status verified as reviewable (review)
- [ ] Epic and Story IDs resolved ({{epic_num}}.{{story_num}})
- [ ] Story Context located or warning recorded
- [ ] Epic Tech Spec located or warning recorded
- [ ] Architecture/standards docs loaded (as available)
- [ ] Tech stack detected and documented

## External Agent Detection (Runtime)

- [ ] `invoke-bash cmd="command -v codex"` executed → {{codex_available}}
- [ ] `invoke-bash cmd="command -v gemini"` executed → {{gemini_available}}
- [ ] `invoke-bash cmd="command -v claude"` executed → {{claude_available}}
- [ ] Review method determined: {{use_external_agent}} = true/false
- [ ] If external: {{external_agent_cmd}} = codex OR gemini OR claude
- [ ] Config updated with detection results and timestamp

## Code Review Execution

- [ ] Git vs Story discrepancies identified ({{git_findings}})
- [ ] If external agent available: Prompt written to /tmp/code-review-prompt.txt
- [ ] If external agent available: CLI invoked via `invoke-bash` (MANDATORY - NO EXCEPTIONS)
- [ ] External agent output captured in {{bash_stdout}}
- [ ] If external agent CLI failed (non-zero exit): Fallback to built-in review
- [ ] ⚠️ VIOLATION CHECK: Did you skip external agent with a rationalization? If yes, RE-RUN with external agent.
- [ ] Acceptance Criteria cross-checked against implementation
- [ ] File List reviewed and validated for completeness
- [ ] Tests identified and mapped to ACs; gaps noted
- [ ] Code quality review performed (security, performance, maintainability)
- [ ] Minimum 3 issues found (adversarial review requirement)

## Finalization

- [ ] Findings categorized: HIGH/MEDIUM/LOW severity
- [ ] Outcome decided (Approve/Changes Requested/Blocked)
- [ ] Review notes appended under "Senior Developer Review (AI)"
- [ ] Change Log updated with review entry
- [ ] Status updated according to settings (if enabled)
- [ ] Sprint status synced (if sprint tracking enabled)
- [ ] Story saved successfully

_Reviewer: {{user_name}} on {{date}}_
_External Agent: {{external_agent_cmd}} (codex:{{codex_available}} / gemini:{{gemini_available}} / claude:{{claude_available}})_
