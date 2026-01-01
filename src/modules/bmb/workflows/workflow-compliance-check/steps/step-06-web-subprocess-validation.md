---
name: 'step-06-web-subprocess-validation'
description: 'Analyze web search utilization and subprocess optimization opportunities across workflow steps'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-06-web-subprocess-validation.md'
nextStepFile: '{workflow_path}/steps/step-07-holistic-analysis.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'
targetWorkflowStepsPath: '{target_workflow_steps_path}'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
intentSpectrum: '{project-root}/_bmad/bmb/docs/workflows/intent-vs-prescriptive-spectrum.md'
---

# Step 6: Web Search & Subprocess Optimization Analysis

## STEP GOAL:

Analyze each workflow step for optimal web search utilization and subprocess usage patterns, ensuring LLM resources are used efficiently while avoiding unnecessary searches or processing delays.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a performance optimization specialist and resource efficiency analyst
- ✅ If you already have been given a name, communication_style, and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in LLM optimization, web search strategy, and subprocess utilization
- ✅ User brings their workflow and needs efficiency recommendations

### Step-Specific Rules:

- 🎯 Focus only on web search necessity and subprocess optimization opportunities
- 🚫 FORBIDDEN to recommend web searches when LLM knowledge is sufficient
- 💬 Approach: Analytical and optimization-focused with clear efficiency rationale
- 📋 Use subprocesses when analyzing multiple steps to improve efficiency

## EXECUTION PROTOCOLS:

- 🎯 Analyze each step for web search appropriateness vs. LLM knowledge sufficiency
- 💾 Identify subprocess optimization opportunities for parallel processing
- 📖 Use subprocesses/subagents when analyzing multiple steps for efficiency
- 🚫 FORBIDDEN to overlook inefficiencies or recommend unnecessary searches

## CONTEXT BOUNDARIES:

- Available context: All workflow step files and subprocess availability
- Focus: Web search optimization and subprocess utilization analysis
- Limits: Resource optimization analysis only, holistic workflow analysis comes next
- Dependencies: Completed Intent Spectrum validation from previous phase

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Web Search & Subprocess Analysis

"Beginning **Phase 5: Web Search & Subprocess Optimization Analysis**
Target: `{target_workflow_name}`

Analyzing each workflow step for:

- Appropriate web search utilization vs. unnecessary searches
- Subprocess optimization opportunities for efficiency
- LLM resource optimization patterns
- Performance bottlenecks and speed improvements

**Note:** Using subprocess analysis for efficient multi-step evaluation..."

### 2. Web Search Necessity Analysis

**A. Intelligent Search Assessment Criteria:**

For each step, analyze web search appropriateness using these criteria:

"**Web Search Appropriateness Analysis:**

- **Knowledge Currency:** Is recent/real-time information required?
- **Specific Data Needs:** Are there specific facts/data not in LLM training?
- **Verification Requirements:** Does the task require current verification?
- **LLM Knowledge Sufficiency:** Can LLM adequately handle with existing knowledge?
- **Search Cost vs. Benefit:** Is search time worth the information gain?"

**B. Step-by-Step Web Search Analysis:**

Using subprocess for parallel analysis of multiple steps:

"**Analyzing [number] steps for web search optimization...**"

For each step file:

```markdown
**Step:** {step_filename}

**Current Web Search Usage:**

- [Explicit web search instructions found]
- [Search frequency and scope]
- [Search-specific topics/queries]

**Intelligent Assessment:**

- **Appropriate Searches:** [Searches that are truly necessary]
- **Unnecessary Searches:** [Searches LLM could handle internally]
- **Optimization Opportunities:** [How to improve search efficiency]

**Recommendations:**

- **Keep:** [Essential web searches]
- **Remove:** [Unnecessary searches that waste time]
- **Optimize:** [Searches that could be more focused/efficient]
```

### 3. Subprocess & Parallel Processing Analysis

**A. Subprocess Opportunity Identification:**

"**Subprocess Optimization Analysis:**
Looking for opportunities where multiple steps or analyses can run simultaneously..."

**Analysis Categories:**

- **Parallel Step Execution:** Can any steps run simultaneously?
- **Multi-faceted Analysis:** Can single step analyses be broken into parallel sub-tasks?
- **Batch Processing:** Can similar operations be grouped for efficiency?
- **Background Processing:** Can any analyses run while user interacts?

**B. Implementation Patterns:**

```markdown
**Subprocess Implementation Opportunities:**

**Multi-Step Validation:**
"Use subprocesses when checking 6+ validation items - just need results back"

- Current: Sequential processing of all validation checks
- Optimized: Parallel subprocess analysis for faster completion

**Parallel User Assistance:**

- Can user interaction continue while background processing occurs?
- Can multiple analyses run simultaneously during user wait times?

**Batch Operations:**

- Can similar file operations be grouped?
- Can multiple data sources be processed in parallel?
```

### 4. LLM Resource Optimization Analysis

**A. Context Window Optimization:**

"**LLM Resource Efficiency Analysis:**
Analyzing how each step uses LLM resources efficiently..."

**Optimization Areas:**

- **JIT Loading:** Are references loaded only when needed?
- **Context Management:** Is context used efficiently vs. wasted?
- **Memory Efficiency:** Can large analyses be broken into smaller, focused tasks?
- **Parallel Processing:** Can LLM instances work simultaneously on different aspects?

**B. Speed vs. Quality Trade-offs:**

"**Performance Optimization Assessment:**

- **Speed-Critical Steps:** Which steps benefit most from subprocess acceleration?
- **Quality-Critical Steps:** Which steps need focused LLM attention?
- **Parallel Candidates:** Which analyses can run without affecting user experience?
- **Background Processing:** What can happen while user is reading/responding?"

### 5. Step-by-Step Optimization Recommendations

**A. Using Subprocess for Efficient Analysis:**

"**Processing all steps for optimization opportunities using subprocess analysis...**"

**For each workflow step, analyze:**

**1. Web Search Optimization:**

```markdown
**Step:** {step_name}
**Current Search Usage:** {current_search_instructions}
**Intelligent Assessment:** {is_search_necessary}
**Recommendation:**

- **Keep essential searches:** {specific_searches_to_keep}
- **Remove unnecessary searches:** {searches_to_remove}
- **Optimize search queries:** {improved_search_approach}
```

**2. Subprocess Opportunities:**

```markdown
**Parallel Processing Potential:**

- **Can run with user interaction:** {yes/no_specifics}
- **Can batch with other steps:** {opportunities}
- **Can break into sub-tasks:** {subtask_breakdown}
- **Background processing:** {what_can_run_in_background}
```

**3. LLM Efficiency:**

```markdown
**Resource Optimization:**

- **Context efficiency:** {current_vs_optimal}
- **Processing time:** {estimated_improvements}
- **User experience impact:** {better/same/worse}
```

### 6. Aggregate Optimization Analysis

**A. Web Search Optimization Summary:**

"**Web Search Optimization Results:**

- **Total Steps Analyzed:** [number]
- **Steps with Web Searches:** [number]
- **Unnecessary Searches Found:** [number]
- **Optimization Opportunities:** [number]
- **Estimated Time Savings:** [time_estimate]"

**B. Subprocess Implementation Summary:**

"**Subprocess Optimization Results:**

- **Parallel Processing Opportunities:** [number]
- **Batch Processing Groups:** [number]
- **Background Processing Tasks:** [number]
- **Estimated Performance Improvement:** [percentage_improvement]"

### 7. User-Facing Optimization Report

**A. Key Efficiency Findings:**

"**Optimization Analysis Summary:**

**Web Search Efficiency:**

- **Current Issues:** [unnecessary searches wasting time]
- **Recommendations:** [specific improvements]
- **Expected Benefits:** [faster response, better user experience]

**Processing Speed Improvements:**

- **Parallel Processing Gains:** [specific opportunities]
- **Background Processing Benefits:** [user experience improvements]
- **Resource Optimization:** [LLM efficiency gains]

**Implementation Priority:**

1. **High Impact, Low Effort:** [Quick wins]
2. **High Impact, High Effort:** [Major improvements]
3. **Low Impact, Low Effort:** [Fine-tuning]
4. **Future Considerations:** [Advanced optimizations]"

### 8. Document Optimization Findings

Append to {complianceReportFile}:

```markdown
## Web Search & Subprocess Optimization Analysis

### Web Search Optimization

**Unnecessary Searches Identified:** [number]
**Essential Searches to Keep:** [specific_list]
**Optimization Recommendations:** [detailed_suggestions]
**Estimated Time Savings:** [time_improvement]

### Subprocess Optimization Opportunities

**Parallel Processing:** [number] opportunities identified
**Batch Processing:** [number] grouping opportunities
**Background Processing:** [number] background task opportunities
**Performance Improvement:** [estimated_improvement_percentage]%

### Resource Efficiency Analysis

**Context Optimization:** [specific_improvements]
**LLM Resource Usage:** [efficiency_gains]
**User Experience Impact:** [positive_changes]

### Implementation Recommendations

**Immediate Actions:** [quick_improvements]
**Strategic Improvements:** [major_optimizations]
**Future Enhancements:** [advanced_optimizations]
```

### 9. Continuation Confirmation

"**Web Search & Subprocess Analysis Complete:**

- **Web Search Optimization:** [summary of improvements]
- **Subprocess Opportunities:** [number of optimization areas]
- **Performance Impact:** [expected efficiency gains]
- **User Experience Benefits:** [specific improvements]

**Ready for Phase 7:** Holistic workflow analysis

- Flow validation and completion paths
- Goal alignment with optimized resources
- Meta-workflow failure analysis
- Strategic recommendations with efficiency considerations

**Select an Option:** [C] Continue to Holistic Analysis [X] Exit"

## Menu Handling Logic:

- IF C: Save optimization findings to report, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF X: Save current findings and end with guidance for resuming
- IF Any other comments or queries: respond and redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [web search and subprocess analysis complete with optimization recommendations documented], will you then load and read fully `{nextStepFile}` to execute and begin holistic analysis phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Intelligent assessment of web search necessity vs. LLM knowledge sufficiency
- Identification of unnecessary web searches that waste user time
- Discovery of subprocess optimization opportunities for parallel processing
- Analysis of LLM resource efficiency patterns
- Specific, actionable optimization recommendations provided
- Performance impact assessment with estimated improvements
- User experience benefits clearly articulated

### ❌ SYSTEM FAILURE:

- Recommending web searches when LLM knowledge is sufficient
- Missing subprocess optimization opportunities
- Not using subprocess analysis when evaluating multiple steps
- Overlooking LLM resource inefficiencies
- Providing vague or non-actionable optimization recommendations
- Failing to assess impact on user experience

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
