# Test Design and Risk Assessment Workflow

Plans comprehensive test coverage strategy with risk assessment (probability × impact scoring), priority classification (P0-P3), and resource estimation. This workflow generates a test design document that identifies high-risk areas, maps requirements to appropriate test levels, and provides execution ordering for optimal feedback.

## Usage

```bash
bmad tea *test-design
```

The TEA agent runs this workflow when:

- Planning test coverage before development starts
- Assessing risks for an epic or story
- Prioritizing test scenarios by business impact
- Estimating testing effort and resources

## Inputs

**Required Context Files:**

- **Story markdown**: Acceptance criteria and requirements
- **PRD or epics.md**: High-level product context
- **Architecture docs** (optional): Technical constraints and integration points

**Workflow Variables:**

- `epic_num`: Epic number for scoped design
- `story_path`: Specific story for design (optional)
- `design_level`: full/targeted/minimal (default: full)
- `risk_threshold`: Score for high-priority flag (default: 6)
- `risk_categories`: TECH,SEC,PERF,DATA,BUS,OPS (all enabled)
- `priority_levels`: P0,P1,P2,P3 (all enabled)

## Outputs

**Primary Deliverable:**

**Test Design Document** (`test-design-epic-{N}.md`):

1. **Risk Assessment Matrix**
   - Risk ID, category, description
   - Probability (1-3) × Impact (1-3) = Score
   - Scores ≥6 flagged as high-priority
   - Mitigation plans with owners and timelines

2. **Coverage Matrix**
   - Requirement → Test Level (E2E/API/Component/Unit)
   - Priority assignment (P0-P3)
   - Risk linkage
   - Test count estimates

3. **Execution Order**
   - Smoke tests (P0 subset, <5 min)
   - P0 tests (critical paths, <10 min)
   - P1 tests (important features, <30 min)
   - P2/P3 tests (full regression, <60 min)

4. **Resource Estimates**
   - Hours per priority level
   - Total effort in days
   - Tooling and data prerequisites

5. **Quality Gate Criteria**
   - P0 pass rate: 100%
   - P1 pass rate: ≥95%
   - High-risk mitigations: 100%
   - Coverage target: ≥80%

## Key Features

### Risk Scoring Framework

**Probability × Impact = Risk Score**

**Probability** (1-3):

- 1 (Unlikely): <10% chance
- 2 (Possible): 10-50% chance
- 3 (Likely): >50% chance

**Impact** (1-3):

- 1 (Minor): Cosmetic, workaround exists
- 2 (Degraded): Feature impaired, difficult workaround
- 3 (Critical): System failure, no workaround

**Scores**:

- 1-2: Low risk (monitor)
- 3-4: Medium risk (plan mitigation)
- **6-9: High risk** (immediate mitigation required)

### Risk Categories (6 types)

**TECH** (Technical/Architecture):

- Architecture flaws, integration failures
- Scalability issues, technical debt

**SEC** (Security):

- Missing access controls, auth bypass
- Data exposure, injection vulnerabilities

**PERF** (Performance):

- SLA violations, response time degradation
- Resource exhaustion, scalability limits

**DATA** (Data Integrity):

- Data loss/corruption, inconsistent state
- Migration failures

**BUS** (Business Impact):

- UX degradation, business logic errors
- Revenue impact, compliance violations

**OPS** (Operations):

- Deployment failures, configuration errors
- Monitoring gaps, rollback issues

### Priority Classification (P0-P3)

**P0 (Critical)** - Run on every commit:

- Blocks core user journey
- High-risk (score ≥6)
- Revenue-impacting or security-critical

**P1 (High)** - Run on PR to main:

- Important user features
- Medium-risk (score 3-4)
- Common workflows

**P2 (Medium)** - Run nightly/weekly:

- Secondary features
- Low-risk (score 1-2)
- Edge cases

**P3 (Low)** - Run on-demand:

- Nice-to-have, exploratory
- Performance benchmarks

### Test Level Selection

**E2E (End-to-End)**:

- Critical user journeys
- Multi-system integration
- Highest confidence, slowest

**API (Integration)**:

- Service contracts
- Business logic validation
- Fast feedback, stable

**Component**:

- UI component behavior
- Visual regression
- Fast, isolated

**Unit**:

- Business logic, edge cases
- Error handling
- Fastest, most granular

**Key principle**: Avoid duplicate coverage - don't test same behavior at multiple levels.

### Exploratory Mode (NEW - Phase 2.5)

**test-design** supports UI exploration for brownfield applications with missing documentation.

**Activation**: Automatic when requirements missing/incomplete for brownfield apps

- If config.tea_use_mcp_enhancements is true + MCP available → MCP-assisted exploration
- Otherwise → Manual exploration with user documentation

**When to Use Exploratory Mode:**

- ✅ Brownfield projects with missing documentation
- ✅ Legacy systems lacking requirements
- ✅ Undocumented features needing test coverage
- ✅ Unknown user journeys requiring discovery
- ❌ NOT for greenfield projects with clear requirements

**Exploration Modes:**

1. **MCP-Assisted Exploration** (if Playwright MCP available):
   - Interactive browser exploration using MCP tools
   - `planner_setup_page` - Initialize browser
   - `browser_navigate` - Explore pages
   - `browser_click` - Interact with UI elements
   - `browser_hover` - Reveal hidden menus
   - `browser_snapshot` - Capture state at each step
   - `browser_screenshot` - Document visually
   - `browser_console_messages` - Find JavaScript errors
   - `browser_network_requests` - Identify API endpoints

2. **Manual Exploration** (fallback without MCP):
   - User explores application manually
   - Documents findings in markdown:
     - Pages/features discovered
     - User journeys identified
     - API endpoints observed (DevTools Network)
     - JavaScript errors noted (DevTools Console)
     - Critical workflows mapped
   - Provides exploration findings to workflow

**Exploration Workflow:**

```
1. Enable exploratory_mode and set exploration_url
2. IF MCP available:
   - Use planner_setup_page to init browser
   - Explore UI with browser_* tools
   - Capture snapshots and screenshots
   - Monitor console and network
   - Document discoveries
3. IF MCP unavailable:
   - Notify user to explore manually
   - Wait for exploration findings
4. Convert discoveries to testable requirements
5. Continue with standard risk assessment (Step 2)
```

**Example Output from Exploratory Mode:**

```markdown
## Exploration Findings - Legacy Admin Panel

**Exploration URL**: https://admin.example.com
**Mode**: MCP-Assisted

### Discovered Features:

1. User Management (/admin/users)
   - List users (table with 10 columns)
   - Edit user (modal form)
   - Delete user (confirmation dialog)
   - Export to CSV (download button)

2. Reporting Dashboard (/admin/reports)
   - Date range picker
   - Filter by department
   - Generate PDF report
   - Email report to stakeholders

3. API Endpoints Discovered:
   - GET /api/admin/users
   - PUT /api/admin/users/:id
   - DELETE /api/admin/users/:id
   - POST /api/reports/generate

### User Journeys Mapped:

1. Admin deletes inactive user
   - Navigate to /admin/users
   - Click delete icon
   - Confirm in modal
   - User removed from table

2. Admin generates monthly report
   - Navigate to /admin/reports
   - Select date range (last month)
   - Click generate
   - Download PDF

### Risks Identified (from exploration):

- R-001 (SEC): No RBAC check observed (any admin can delete any user)
- R-002 (DATA): No confirmation on bulk delete
- R-003 (PERF): User table loads slowly (5s for 1000 rows)

**Next**: Proceed to risk assessment with discovered requirements
```

**Graceful Degradation:**

- Exploratory mode is OPTIONAL (default: disabled)
- Works without Playwright MCP (manual fallback)
- If exploration fails, can disable mode and provide requirements documentation
- Seamlessly transitions to standard risk assessment workflow

### Knowledge Base Integration

Automatically consults TEA knowledge base:

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

## Integration with Other Workflows

**Before test-design:**

- **plan-project** (Phase 2): Creates PRD and epics
- **architecture** (Phase 3): Defines technical approach
- **tech-spec** (Phase 3): Implementation details

**After test-design:**

- **atdd**: Generate failing tests for P0 scenarios
- **automate**: Expand coverage for P1/P2 scenarios
- **trace (Phase 2)**: Use quality gate criteria for release decisions

**Coordinates with:**

- **framework**: Test infrastructure must exist
- **ci**: Execution order maps to CI stages

**Updates:**

- `bmm-workflow-status.md`: Adds test design to Quality & Testing Progress

## Important Notes

### Evidence-Based Assessment

**Critical principle**: Base risk assessment on **evidence**, not speculation.

**Evidence sources:**

- PRD and user research
- Architecture documentation
- Historical bug data
- User feedback
- Security audit results

**When uncertain**: Document assumptions, request user clarification.

**Avoid**:

- Guessing business impact
- Assuming user behavior
- Inventing requirements

### Resource Estimation Formula

```
P0: 2 hours per test (setup + complex scenarios)
P1: 1 hour per test (standard coverage)
P2: 0.5 hours per test (simple scenarios)
P3: 0.25 hours per test (exploratory)

Total Days = Total Hours / 8
```

Example:

- 15 P0 × 2h = 30h
- 25 P1 × 1h = 25h
- 40 P2 × 0.5h = 20h
- **Total: 75 hours (~10 days)**

### Execution Order Strategy

**Smoke tests** (subset of P0, <5 min):

- Login successful
- Dashboard loads
- Core API responds

**Purpose**: Fast feedback, catch build-breaking issues immediately.

**P0 tests** (critical paths, <10 min):

- All scenarios blocking user journeys
- Security-critical flows

**P1 tests** (important features, <30 min):

- Common workflows
- Medium-risk areas

**P2/P3 tests** (full regression, <60 min):

- Edge cases
- Performance benchmarks

### Quality Gate Criteria

**Pass/Fail thresholds:**

- P0: 100% pass (no exceptions)
- P1: ≥95% pass (2-3 failures acceptable with waivers)
- P2/P3: ≥90% pass (informational)
- High-risk items: All mitigated or have approved waivers

**Coverage targets:**

- Critical paths: ≥80%
- Security scenarios: 100%
- Business logic: ≥70%

## Validation Checklist

After workflow completion:

- [ ] Risk assessment complete (all categories)
- [ ] Risks scored (probability × impact)
- [ ] High-priority risks (≥6) flagged
- [ ] Coverage matrix maps requirements to test levels
- [ ] Priorities assigned (P0-P3)
- [ ] Execution order defined
- [ ] Resource estimates provided
- [ ] Quality gate criteria defined
- [ ] Output file created

Refer to `checklist.md` for comprehensive validation.

## Example Execution

**Scenario: E-commerce checkout epic**

```bash
bmad tea *test-design
# Epic 3: Checkout flow redesign

# Risk Assessment identifies:
- R-001 (SEC): Payment bypass, P=2 × I=3 = 6 (HIGH)
- R-002 (PERF): Cart load time, P=3 × I=2 = 6 (HIGH)
- R-003 (BUS): Order confirmation email, P=2 × I=2 = 4 (MEDIUM)

# Coverage Plan:
P0 scenarios: 12 tests (payment security, order creation)
P1 scenarios: 18 tests (cart management, promo codes)
P2 scenarios: 25 tests (edge cases, error handling)

Total effort: 65 hours (~8 days)

# Test Levels:
- E2E: 8 tests (critical checkout path)
- API: 30 tests (business logic, payment processing)
- Unit: 17 tests (calculations, validations)

# Execution Order:
1. Smoke: Payment successful, order created (2 min)
2. P0: All payment & security flows (8 min)
3. P1: Cart & promo codes (20 min)
4. P2: Edge cases (40 min)

# Quality Gates:
- P0 pass rate: 100%
- P1 pass rate: ≥95%
- R-001 mitigated: Add payment validation layer
- R-002 mitigated: Implement cart caching
```

## Troubleshooting

**Issue: "Unable to score risks - missing context"**

- **Cause**: Insufficient documentation
- **Solution**: Request PRD, architecture docs, or user clarification

**Issue: "All tests marked as P0"**

- **Cause**: Over-prioritization
- **Solution**: Apply strict P0 criteria (blocks core journey + high risk + no workaround)

**Issue: "Duplicate coverage at multiple test levels"**

- **Cause**: Not following test pyramid
- **Solution**: Use E2E for critical paths only, API for logic, unit for edge cases

**Issue: "Resource estimates too high"**

- **Cause**: Complex test setup or insufficient automation
- **Solution**: Invest in fixtures/factories upfront, reduce per-test setup time

## Related Workflows

- **atdd**: Generate failing tests → [atdd/README.md](../atdd/README.md)
- **automate**: Expand regression coverage → [automate/README.md](../automate/README.md)
- **trace**: Traceability and quality gate decisions → [trace/README.md](../trace/README.md)
- **framework**: Test infrastructure → [framework/README.md](../framework/README.md)

## Version History

- **v4.0 (BMad v6)**: Pure markdown instructions, risk scoring framework, template-based output
- **v3.x**: XML format instructions
- **v2.x**: Legacy task-based approach
