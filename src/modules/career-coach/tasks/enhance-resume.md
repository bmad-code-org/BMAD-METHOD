# Enhance Resume

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Resume enhancement cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you enhance a resume without user interaction, you have violated this workflow.

## Critical: Resume Input

If a resume has not been provided, ask the user to provide their current resume content or upload the file.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present enhancement suggestions
2. Provide detailed rationale (explain improvements, ATS optimization, industry alignment)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Apply enhancement and continue"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Enhancing resume content for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Analyze current resume** - Review existing content for strengths and improvement areas
2. **Identify enhancement opportunities** - ATS optimization, achievement quantification, keyword alignment
3. **Process each section:**
   - Review current content
   - Suggest specific improvements
   - Present enhanced version with rationale
   - **IF elicit: true** → MANDATORY 1-9 options format
   - Apply approved enhancements
4. **Continue until complete**

## Enhancement Focus Areas

### Content Improvements
- **Achievement Quantification** - Add metrics, percentages, and measurable results
- **Action Verbs** - Replace weak verbs with strong, industry-specific action words
- **Keyword Optimization** - Align with job requirements and industry terminology
- **Professional Summary** - Create compelling value proposition

### Formatting Improvements
- **ATS Compatibility** - Ensure proper formatting for Applicant Tracking Systems
- **Consistency** - Standardize formatting, dates, and presentation
- **Readability** - Improve scannability and visual hierarchy
- **Length Optimization** - Ensure appropriate length for experience level

### Industry Alignment
- **Role-Specific Keywords** - Include relevant technical skills and certifications
- **Industry Standards** - Follow current best practices for target industry
- **Company Research** - Tailor content to specific company culture and values

## Detailed Rationale Requirements

When presenting enhancement suggestions, ALWAYS include rationale that explains:

- Specific improvements made and why they matter
- ATS optimization benefits and keyword alignment
- Industry best practices applied
- Quantifiable impact of suggested changes

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with insights
3. Offer options:
   - **1. Apply changes and update resume**
   - **2. Return to enhancement menu**
   - **3. Ask any questions or engage further with this elicitation**

## CRITICAL REMINDERS

**❌ NEVER:**

- Ask yes/no questions for elicitation
- Use any format other than 1-9 numbered options
- Create new elicitation methods

**✅ ALWAYS:**

- Use exact 1-9 format when elicit: true
- Select options 2-9 from data/elicitation-methods only
- Provide detailed rationale explaining improvements
- End with "Select 1-9 or just type your question/feedback:"
