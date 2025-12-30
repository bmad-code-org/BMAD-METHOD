---
description: "Create comprehensive test plans for any functionality (epics, stories, features, custom)"
argument-hint: "[epic-3] [story-2.1] [feature-login] [custom-functionality] [--overwrite]"
allowed-tools: ["Read", "Write", "Grep", "Glob", "TodoWrite", "LS"]
---

# ⚠️ GENERAL-PURPOSE COMMAND - Works with any project

## Documentation directories are detected dynamically

Documentation directories are detected dynamically (docs/, documentation/, wiki/)

Output directory is detected dynamically (workspace/testing/plans, test-plans, .)

Override with CREATE_TEST_PLAN_OUTPUT_DIR environment variable if needed

## 📋 Test Plan Creator - High Context Analysis

## Argument Processing

**Target functionality**: "$ARGUMENTS"

Parse functionality identifier:

```javascript
const arguments = "$ARGUMENTS";
const functionalityPattern = /(?:epic-[\d]+(?:\.[\d]+)?|story-[\d]+(?:\.[\d]+)?|feature-[\w-]+|[\w-]+)/g;
const functionalityMatch = arguments.match(functionalityPattern)?.[0] || "custom-functionality";
const overwrite = arguments.includes("--overwrite");

```text

Target: `${functionalityMatch}`
Overwrite existing: `${overwrite ? "Yes" : "No"}`

## Test Plan Creation Process

### Step 0: Detect Project Structure

```bash

# ============================================

# DYNAMIC DIRECTORY DETECTION (Project-Agnostic)

# ============================================

# Detect documentation directories

DOCS_DIRS=""
for dir in "docs" "documentation" "wiki" "spec" "specifications"; do
  if [[ -d "$dir" ]]; then
    DOCS_DIRS="$DOCS_DIRS $dir"
  fi
done
if [[ -z "$DOCS_DIRS" ]]; then
  echo "⚠️ No documentation directory found (docs/, documentation/, etc.)"
  echo "   Will search current directory for documentation files"
  DOCS_DIRS="."
fi
echo "📁 Documentation directories: $DOCS_DIRS"

# Detect output directory (allow env override)

if [[ -n "$CREATE_TEST_PLAN_OUTPUT_DIR" ]]; then
  PLANS_DIR="$CREATE_TEST_PLAN_OUTPUT_DIR"
  echo "📁 Using override output dir: $PLANS_DIR"
else
  PLANS_DIR=""
  for dir in "workspace/testing/plans" "test-plans" "testing/plans" "tests/plans"; do
    if [[ -d "$dir" ]]; then
      PLANS_DIR="$dir"
      break
    fi
  done

  # Create in first available parent
  if [[ -z "$PLANS_DIR" ]]; then
    for dir in "workspace/testing/plans" "test-plans" "testing/plans"; do
      PARENT_DIR=$(dirname "$dir")
      if [[ -d "$PARENT_DIR" ]] || mkdir -p "$PARENT_DIR" 2>/dev/null; then
        mkdir -p "$dir" 2>/dev/null && PLANS_DIR="$dir" && break
      fi
    done

    # Ultimate fallback
    if [[ -z "$PLANS_DIR" ]]; then
      PLANS_DIR="./test-plans"
      mkdir -p "$PLANS_DIR"
    fi
  fi
  echo "📁 Test plans directory: $PLANS_DIR"
fi

```text

### Step 1: Check for Existing Plan

Check if test plan already exists:

```bash
planFile="$PLANS_DIR/${functionalityMatch}-test-plan.md"
if [[ -f "$planFile" && "$overwrite" != true ]]; then
  echo "⚠️  Test plan already exists: $planFile"
  echo "Use --overwrite to replace existing plan"
  exit 1
fi

```text

### Step 2: Comprehensive Requirements Analysis

**FULL CONTEXT ANALYSIS** - This is where the high-context work happens:

**Document Discovery:**
Use Grep and Read tools to find ALL relevant documentation:

- Search `docs/prd/_${functionalityMatch}_.md`
- Search `docs/stories/_${functionalityMatch}_.md`
- Search `docs/features/_${functionalityMatch}_.md`
- Search project files for functionality references
- Analyze any custom specifications provided

**Requirements Extraction:**
For EACH discovered document, extract:

- **Acceptance Criteria**: All AC patterns (AC X.X.X, Given-When-Then, etc.)
- **User Stories**: "As a...I want...So that..." patterns
- **Integration Points**: System interfaces, APIs, dependencies
- **Success Metrics**: Performance thresholds, quality requirements
- **Risk Areas**: Edge cases, potential failure modes
- **Business Logic**: Domain-specific requirements (like Mike Israetel methodology)

**Context Integration:**
- Cross-reference requirements across multiple documents
- Identify dependencies between different acceptance criteria
- Map user workflows that span multiple components
- Understand system architecture context

### Step 3: Test Scenario Design

**Mode-Specific Scenario Planning:**
For each testing mode (automated/interactive/hybrid), design:

**Automated Scenarios:**
- Browser automation sequences using MCP tools
- API endpoint validation workflows
- Performance measurement checkpoints
- Error condition testing scenarios

**Interactive Scenarios:**
- Human-guided test procedures
- User experience validation flows
- Qualitative assessment activities
- Accessibility and usability evaluation

**Hybrid Scenarios:**
- Automated setup + manual validation
- Quantitative collection + qualitative interpretation
- Parallel automated/manual execution paths

### Step 4: Validation Criteria Definition

**Measurable Success Criteria:**
For each scenario, define:

- **Functional Validation**: Feature behavior correctness
- **Performance Validation**: Response times, resource usage
- **Quality Validation**: User experience, accessibility, reliability
- **Integration Validation**: Cross-system communication, data flow

**Evidence Requirements:**
- **Automated Evidence**: Screenshots, logs, metrics, API responses
- **Manual Evidence**: User feedback, qualitative observations
- **Hybrid Evidence**: Combined data + human interpretation

### Step 5: Agent Prompt Generation

**Specialized Agent Instructions:**
Create detailed prompts for each subagent that include:

- Specific context from the requirements analysis
- Detailed instructions for their specialized role
- Expected input/output formats
- Integration points with other agents

### Step 6: Test Plan File Generation

Create comprehensive test plan file:

```markdown

# Test Plan: ${functionalityMatch}

**Created**: $(date)
**Target**: ${functionalityMatch}
**Context**: [Summary of analyzed documentation]

## Requirements Analysis

### Source Documents

- [List of all documents analyzed]
- [Cross-references and dependencies identified]

### Acceptance Criteria

[All extracted ACs with full context]

### User Stories

[All user stories requiring validation]

### Integration Points

[System interfaces and dependencies]

### Success Metrics

[Performance thresholds and quality requirements]

### Risk Areas

[Edge cases and potential failure modes]

## Test Scenarios

### Automated Test Scenarios

[Detailed browser automation and API test scenarios]

### Interactive Test Scenarios

[Human-guided testing procedures and UX validation]

### Hybrid Test Scenarios

[Combined automated + manual approaches]

## Validation Criteria

### Success Thresholds

[Measurable pass/fail criteria for each scenario]

### Evidence Requirements

[What evidence proves success or failure]

### Quality Gates

[Performance, usability, and reliability standards]

## Agent Execution Prompts

### Requirements Analyzer Prompt

```text

Context: ${functionalityMatch} testing based on comprehensive requirements analysis
Task: [Specific instructions based on discovered documentation]
Expected Output: [Structured requirements summary]

```text

### Scenario Designer Prompt

```text

Context: Transform ${functionalityMatch} requirements into executable test scenarios
Task: [Mode-specific scenario generation instructions]
Expected Output: [Test scenario definitions]

```text

### Validation Planner Prompt

```text

Context: Define success criteria for ${functionalityMatch} validation
Task: [Validation criteria and evidence requirements]
Expected Output: [Comprehensive validation plan]

```text

### Browser Executor Prompt

```text

Context: Execute automated tests for ${functionalityMatch}
Task: [Browser automation and performance testing]
Expected Output: [Execution results and evidence]

```text

### Interactive Guide Prompt

```text

Context: Guide human testing of ${functionalityMatch}
Task: [User experience and qualitative validation]
Expected Output: [Interactive session results]

```text

### Evidence Collector Prompt

```text

Context: Aggregate all ${functionalityMatch} testing evidence
Task: [Evidence compilation and organization]
Expected Output: [Comprehensive evidence package]

```text

### BMAD Reporter Prompt

```text

Context: Generate final report for ${functionalityMatch} testing
Task: [Analysis and actionable recommendations]
Expected Output: [BMAD-format final report]

```text

## Execution Notes

### Testing Modes

- **Automated**: Focus on browser automation, API validation, performance
- **Interactive**: Emphasize user experience, usability, qualitative insights
- **Hybrid**: Combine automated metrics with human interpretation

### Context Preservation

- All agents receive full context from this comprehensive analysis
- Cross-references maintained between requirements and scenarios
- Integration dependencies clearly mapped

### Reusability

- Plan can be executed multiple times with different modes
- Scenarios can be updated independently
- Agent prompts can be refined based on results

---

_Test Plan Created: $(date)_
_High-Context Analysis: Complete requirements discovery and scenario design_
_Ready for execution via /user_testing ${functionalityMatch}_

```text

## Completion

Display results:

```text

✅ Test Plan Created Successfully!
================================================================
📋 Plan: ${functionalityMatch}-test-plan.md
📁 Location: $PLANS_DIR/
🎯 Target: ${functionalityMatch}
📊 Analysis: Complete requirements and scenario design
================================================================

🚀 Next Steps:

1. Review the comprehensive test plan in $PLANS_DIR/
2. Execute tests using: /user_testing ${functionalityMatch} --mode=[automated|interactive|hybrid]
3. Test plan can be reused and refined for multiple execution sessions
4. Plan includes specialized prompts for all 7 subagents

📝 Plan Contents:

- Complete requirements analysis with full context
- Mode-specific test scenarios (automated/interactive/hybrid)
- Measurable validation criteria and evidence requirements
- Specialized agent prompts with comprehensive context
- Execution guidance and quality gates

```text

---

_Test Plan Creator v1.0 - High Context Analysis for Comprehensive Testing_
