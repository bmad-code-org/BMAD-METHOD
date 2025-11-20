# Execute Checklist

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Checklist execution cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you complete checklist execution without user interaction, you have violated this workflow.

## Critical: Checklist Context

If checklist context has not been provided, ask the user to specify which checklist to execute and the context for the evaluation.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present checklist evaluation prompts and questions
2. Provide detailed rationale (explain why these questions matter for quality assessment)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Continue with next checklist item"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Completing checklist execution for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Review checklist purpose** - Understand what the checklist is evaluating
2. **Establish evaluation context** - Determine the scope and context for assessment
3. **Systematically evaluate items** - Go through each checklist item methodically
4. **Document findings** - Record results and observations for each item
5. **Identify gaps and issues** - Note areas that need attention or improvement
6. **Generate recommendations** - Provide specific action items for improvement
7. **Create summary report** - Compile findings and recommendations

## Available Checklists

### Career Planning Checklists
- **Career Planning Checklist** - Comprehensive career development plan validation
- **Skills Assessment Checklist** - Skills evaluation and development planning
- **Networking Strategy Checklist** - Professional networking plan validation
- **Personal Brand Checklist** - Online presence and reputation building
- **Job Search Checklist** - Job search strategy and preparation

### Document Quality Checklists
- **Resume Quality Checklist** - Resume effectiveness and ATS optimization
- **Cover Letter Checklist** - Cover letter quality and targeting
- **LinkedIn Profile Checklist** - Professional online presence optimization
- **Portfolio Checklist** - Work showcase and presentation quality
- **Career Document Checklist** - Professional document standards

### Interview Preparation Checklists
- **Interview Preparation Checklist** - Comprehensive interview readiness
- **Behavioral Questions Checklist** - STAR method response preparation
- **Technical Interview Checklist** - Technical assessment preparation
- **Company Research Checklist** - Employer and role research
- **Interview Follow-up Checklist** - Post-interview communication

## Checklist Execution Focus Areas

### Systematic Evaluation
- **Item-by-Item Review** - Evaluate each checklist item individually
- **Evidence Assessment** - Look for specific evidence to support each item
- **Quality Standards** - Apply appropriate quality standards for each item
- **Completeness Check** - Ensure all required elements are present
- **Accuracy Verification** - Verify that information is accurate and current

### Gap Analysis
- **Missing Elements** - Identify items that are not addressed
- **Incomplete Implementation** - Note partially completed items
- **Quality Issues** - Identify areas where quality can be improved
- **Timeline Concerns** - Assess whether timelines are realistic
- **Resource Gaps** - Identify missing resources or support

### Action Planning
- **Priority Setting** - Determine which gaps are most critical
- **Resource Allocation** - Plan how to address identified gaps
- **Timeline Development** - Create realistic timelines for improvements
- **Success Metrics** - Define how to measure improvement success
- **Follow-up Planning** - Plan when to re-evaluate progress

## Detailed Rationale Requirements

When presenting checklist evaluation prompts, ALWAYS include rationale that explains:

- Why specific checklist items are important for quality
- How each item contributes to overall success
- Examples of what constitutes good performance for each item
- How to effectively address gaps and improve quality

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with evaluation insights
3. Offer options:
   - **1. Apply insights and continue checklist evaluation**
   - **2. Return to checklist evaluation menu**
   - **3. Ask any questions or engage further with this elicitation**

## Checklist Execution Guidelines

### Evaluation Process
1. **Preparation** - Review checklist purpose and context
2. **Systematic Review** - Go through each item methodically
3. **Evidence Collection** - Gather evidence to support evaluations
4. **Documentation** - Record findings and observations
5. **Analysis** - Identify patterns, gaps, and opportunities
6. **Recommendations** - Develop specific action items
7. **Reporting** - Compile comprehensive evaluation report

### Quality Standards
- **Thoroughness** - Evaluate all checklist items completely
- **Objectivity** - Maintain impartial evaluation standards
- **Evidence-Based** - Base evaluations on specific evidence
- **Actionable** - Provide specific, actionable recommendations
- **Comprehensive** - Cover all relevant aspects of the checklist

## Checklist Scoring and Assessment

### Scoring Methodology
- **Excellent (90-100%)**: All critical items completed, high quality implementation
- **Good (80-89%)**: Most critical items completed, good quality implementation
- **Needs Improvement (70-79%)**: Some critical items missing or incomplete
- **Requires Significant Work (Below 70%)**: Many critical items missing or poor quality

### Assessment Criteria
- **Completeness**: Are all required items addressed?
- **Quality**: Is the implementation of high quality?
- **Accuracy**: Is the information accurate and current?
- **Effectiveness**: Will the implementation achieve desired outcomes?
- **Sustainability**: Can the implementation be maintained over time?

## Action Planning and Follow-up

### Immediate Actions
- **Critical Gaps**: Address high-priority gaps immediately
- **Quick Wins**: Implement easy improvements for immediate impact
- **Resource Planning**: Secure resources needed for improvements
- **Timeline Development**: Create realistic timelines for all improvements
- **Accountability**: Establish responsibility for implementing improvements

### Long-term Planning
- **Continuous Improvement**: Plan for ongoing quality enhancement
- **Regular Reviews**: Schedule periodic checklist re-evaluations
- **Progress Tracking**: Establish metrics to track improvement progress
- **Success Celebration**: Plan how to recognize and celebrate improvements
- **Knowledge Sharing**: Share lessons learned with others

## CRITICAL REMINDERS

**❌ NEVER:**

- Ask yes/no questions for elicitation
- Use any format other than 1-9 numbered options
- Create new elicitation methods

**✅ ALWAYS:**

- Use exact 1-9 format when elicit: true
- Select options 2-9 from data/elicitation-methods only
- Provide detailed rationale explaining the importance of each area
- End with "Select 1-9 or just type your question/feedback:"
