---
name: 'step-04-file-validation'
description: 'Validate file sizes, markdown formatting, and CSV data files'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-04-file-validation.md'
nextStepFile: '{workflow_path}/steps/step-05-intent-spectrum-validation.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'
targetWorkflowPath: '{target_workflow_path}'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
csvStandards: '{project-root}/_bmad/bmb/docs/workflows/csv-data-file-standards.md'
---

# Step 4: File Size, Formatting, and Data Validation

## STEP GOAL:

Validate file sizes, markdown formatting standards, and CSV data file compliance to ensure optimal workflow performance and maintainability.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a compliance validator and quality assurance specialist
- ✅ If you already have been given a name, communication_style, and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring file optimization and formatting validation expertise
- ✅ User brings their workflow files and needs performance optimization

### Step-Specific Rules:

- 🎯 Focus on file sizes, markdown formatting, and CSV validation
- 🚫 FORBIDDEN to skip file size analysis or CSV validation when present
- 💬 Approach: Systematic file analysis with optimization recommendations
- 📋 Ensure all findings include specific recommendations for improvement

## EXECUTION PROTOCOLS:

- 🎯 Validate file sizes against optimal ranges (≤5K best, 5-7K good, 7-10K acceptable, 10-12K concern, >15K action required)
- 💾 Check markdown formatting standards and conventions
- 📖 Validate CSV files against csv-data-file-standards.md when present
- 🚫 FORBIDDEN to overlook file optimization opportunities

## CONTEXT BOUNDARIES:

- Available context: Target workflow files and their sizes/formats
- Focus: File optimization, formatting standards, and CSV data validation
- Limits: File analysis only, holistic workflow analysis comes next
- Dependencies: Completed step-by-step validation from previous phase

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize File Validation Phase

"Beginning **File Size, Formatting, and Data Validation**
Target: `{target_workflow_name}`

Analyzing workflow files for:

- File size optimization (smaller is better for performance)
- Markdown formatting standards compliance
- CSV data file standards validation (if present)
- Overall file maintainability and performance..."

### 2. File Size Analysis

**A. Step File Size Validation:**
For each step file:

"**File Size Analysis:** `{step_filename}`"

- **Size:** [file size in KB]
- **Optimization Rating:** [Optimal/Good/Acceptable/Concern/Action Required]
- **Performance Impact:** [Minimal/Moderate/Significant/Severe]

**Size Ratings:**

- **≤ 5K:** ✅ Optimal - Excellent performance and maintainability
- **5K-7K:** ✅ Good - Good balance of content and performance
- **7K-10K:** ⚠️ Acceptable - Consider content optimization
- **10K-12K:** ⚠️ Concern - Content should be consolidated or split
- **> 15K:** ❌ Action Required - File must be optimized (split content, remove redundancy)

**Document optimization opportunities:**

- Content that could be moved to templates
- Redundant explanations or examples
- Overly detailed instructions that could be condensed
- Opportunities to use references instead of inline content

### 3. Markdown Formatting Validation

**A. Heading Structure Analysis:**
"**Markdown Formatting Analysis:**"

For each file:

- **Heading Hierarchy:** Proper H1 → H2 → H3 structure
- **Consistent Formatting:** Consistent use of bold, italics, lists
- **Code Blocks:** Proper markdown code block formatting
- **Link References:** Valid internal and external links
- **Table Formatting:** Proper table structure when used

**Common formatting issues to document:**

- Missing blank lines around headings
- Inconsistent list formatting (numbered vs bullet)
- Improper code block language specifications
- Broken or invalid markdown links
- Inconsistent heading levels or skipping levels

### 4. CSV Data File Validation (if present)

**A. Identify CSV Files:**
"**CSV Data File Analysis:**"
Check for CSV files in workflow directory:

- Look for `.csv` files in main directory
- Check for `data/` subdirectory containing CSV files
- Identify any CSV references in workflow configuration

**B. Validate Against Standards:**
For each CSV file found, validate against `{csvStandards}`:

**Purpose Validation:**

- Does CSV contain essential data that LLMs cannot generate or web-search?
- Is all CSV data referenced and used in the workflow?
- Is data domain-specific and valuable?
- Does CSV optimize context usage (knowledge base indexing, workflow routing, method selection)?
- Does CSV reduce workflow complexity or step count significantly?
- Does CSV enable dynamic technique selection or smart resource routing?

**Structural Validation:**

- Valid CSV format with proper quoting
- Consistent column counts across all rows
- No missing data or properly marked empty values
- Clear, descriptive header row
- Proper UTF-8 encoding

**Content Validation:**

- No LLM-generated content (generic phrases, common knowledge)
- Specific, concrete data entries
- Consistent data formatting
- Verifiable and factual data

**Column Standards:**

- Clear, descriptive column headers
- Consistent data types per column
- All columns referenced in workflow
- Appropriate column width and focus

**File Size and Performance:**

- Efficient structure under 1MB when possible
- No redundant or duplicate rows
- Optimized data representation
- Fast loading characteristics

**Documentation Standards:**

- Purpose and usage documentation present
- Column descriptions and format specifications
- Data source documentation
- Update procedures documented

### 5. File Validation Reporting

For each file with issues:

```markdown
### File Validation: {filename}

**File Size Analysis:**

- Size: {size}KB - Rating: {Optimal/Good/Concern/etc.}
- Performance Impact: {assessment}
- Optimization Recommendations: {specific suggestions}

**Markdown Formatting:**

- Heading Structure: {compliant/issues found}
- Common Issues: {list of formatting problems}
- Fix Recommendations: {specific corrections}

**CSV Data Validation:**

- Purpose Validation: {compliant/needs review}
- Structural Issues: {list of problems}
- Content Standards: {compliant/violations}
- Recommendations: {improvement suggestions}
```

### 6. Aggregate File Analysis Summary

"**File Validation Summary:**

**File Size Distribution:**

- Optimal (≤5K): [number] files
- Good (5K-7K): [number] files
- Acceptable (7K-10K): [number] files
- Concern (10K-12K): [number] files
- Action Required (>15K): [number] files

**Markdown Formatting Issues:**

- Heading Structure: [number] files with issues
- List Formatting: [number] files with inconsistencies
- Code Blocks: [number] files with formatting problems
- Link References: [number] broken or invalid links

**CSV Data Files:**

- Total CSV files: [number]
- Compliant with standards: [number]
- Require attention: [number]
- Critical issues: [number]

**Performance Impact Assessment:**

- Overall workflow performance: [Excellent/Good/Acceptable/Concern/Poor]
- Most critical file size issue: {file and size}
- Primary formatting concerns: {main issues}"

### 7. Continuation Confirmation

"**File Validation Complete:** Size, formatting, and CSV analysis finished

**Key Findings:**

- **File Optimization:** [summary of size optimization opportunities]
- **Formatting Standards:** [summary of markdown compliance issues]
- **Data Validation:** [summary of CSV standards compliance]

**Ready for Phase 5:** Intent Spectrum Validation analysis

- Flow validation and goal alignment
- Meta-workflow failure analysis
- Strategic recommendations and improvement planning

**Select an Option:** [C] Continue to Intent Spectrum Validation [X] Exit"

## Menu Handling Logic:

- IF C: Save file validation findings to report, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF X: Save current findings and end with guidance for resuming
- IF Any other comments or queries: respond and redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [all file sizes analyzed, markdown formatting validated, and CSV files checked against standards], will you then load and read fully `{nextStepFile}` to execute and begin Intent Spectrum Validation phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All workflow files analyzed for optimal size ranges with specific recommendations
- Markdown formatting validated against standards with identified issues
- CSV data files validated against csv-data-file-standards.md when present
- Performance impact assessed with optimization opportunities identified
- File validation findings documented with specific fix recommendations
- User ready for holistic workflow analysis

### ❌ SYSTEM FAILURE:

- Skipping file size analysis or markdown formatting validation
- Not checking CSV files against standards when present
- Failing to provide specific optimization recommendations
- Missing performance impact assessment
- Overlooking critical file size violations (>15K)

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
