# Career Situation Analysis

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Career situation analysis cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you complete career situation analysis without user interaction, you have violated this workflow.

## Critical: Career Context

If career context has not been provided, ask the user to provide their current job, industry, experience level, and career goals.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present analysis prompts and questions
2. Provide detailed rationale (explain why these questions matter for career analysis)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Continue with next analysis area"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Completing career situation analysis for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Assess current position** - Understand current role, responsibilities, and performance
2. **Analyze market position** - Evaluate competitiveness and market value
3. **Identify opportunities** - Find growth potential and advancement paths
4. **Assess risks** - Identify potential threats to career stability
5. **Evaluate satisfaction** - Understand current job satisfaction and engagement
6. **Generate insights** - Provide actionable recommendations

## Analysis Focus Areas

### Current Position Assessment
- **Role Analysis** - What are your current responsibilities and scope?
- **Performance Evaluation** - How are you performing in your current role?
- **Skill Utilization** - Are you using your full range of skills?
- **Growth Opportunities** - What learning and development opportunities exist?

### Market Position Analysis
- **Compensation Benchmarking** - How does your compensation compare to market?
- **Skill Marketability** - How valuable are your skills in the current market?
- **Industry Trends** - How is your industry evolving?
- **Geographic Considerations** - How does location affect your market position?

### Opportunity Identification
- **Internal Opportunities** - What advancement opportunities exist within your organization?
- **External Opportunities** - What roles are available in the broader market?
- **Skill Development** - What skills would increase your market value?
- **Network Opportunities** - Who could help advance your career?

### Risk Assessment
- **Job Security** - How stable is your current position?
- **Industry Risks** - What threats exist to your industry or role?
- **Skill Obsolescence** - Are your skills becoming outdated?
- **Market Competition** - How competitive is your field?

### Satisfaction Evaluation
- **Work-Life Balance** - How satisfied are you with your work-life balance?
- **Career Alignment** - How well does your current role align with your goals?
- **Company Culture** - How well do you fit with your organization's culture?
- **Compensation Satisfaction** - Are you satisfied with your compensation?

### Competitive Analysis
- **Peer Comparison** - How do you compare to colleagues and peers?
- **Industry Standards** - How do you measure against industry benchmarks?
- **Unique Value Proposition** - What makes you stand out?
- **Differentiation Opportunities** - How can you differentiate yourself?

## Detailed Rationale Requirements

When presenting analysis prompts, ALWAYS include rationale that explains:

- Why this analysis area is important for career decision-making
- How this information will inform career strategy
- Specific examples of how this analysis has helped others
- How to interpret and act on the findings

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with analytical insights
3. Offer options:
   - **1. Apply insights and continue analysis**
   - **2. Return to analysis menu**
   - **3. Ask any questions or engage further with this elicitation**

## Analysis Documentation

For each analysis component:

1. **Current State** - What is the current situation?
2. **Benchmark Comparison** - How does this compare to standards or peers?
3. **Trend Analysis** - How is this changing over time?
4. **Opportunity Assessment** - What opportunities does this present?
5. **Risk Evaluation** - What risks should be considered?
6. **Action Recommendations** - What actions should be taken?

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
