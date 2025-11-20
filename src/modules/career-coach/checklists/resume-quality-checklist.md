# Resume Quality Checklist

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Resume quality assessment cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you complete the checklist without user interaction, you have violated this workflow.

## Critical: Resume Input

If a resume has not been provided, ask the user to provide their current resume content or upload the file.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present checklist findings and recommendations
2. Provide detailed rationale (explain why each item matters for resume quality)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Continue with next checklist section"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Completing checklist assessment for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Review resume content** - Analyze each section systematically
2. **Apply checklist criteria** - Evaluate against quality standards
3. **Process each section:**
   - Review current content
   - Identify issues and opportunities
   - Present findings with rationale
   - **IF elicit: true** → MANDATORY 1-9 options format
   - Document recommendations
4. **Continue until complete**

## Resume Quality Assessment

### Contact Information
- [ ] **Complete Contact Details**: Name, email, phone, location included
- [ ] **Professional Email**: Uses professional email address (not personal/nickname)
- [ ] **LinkedIn Profile**: Includes LinkedIn URL if available
- [ ] **Portfolio/Website**: Includes portfolio or personal website if relevant
- [ ] **Consistent Formatting**: Contact information is properly formatted

### Professional Summary
- [ ] **Clear Value Proposition**: Summarizes key value and career highlights
- [ ] **Appropriate Length**: 2-3 sentences maximum
- [ ] **Industry Keywords**: Includes relevant industry terminology
- [ ] **Achievement-Focused**: Highlights key accomplishments
- [ ] **Target Role Alignment**: Tailored to specific job requirements

### Work Experience
- [ ] **Chronological Order**: Most recent experience listed first
- [ ] **Complete Information**: Company, title, dates, location included
- [ ] **Achievement-Focused**: Bullet points focus on accomplishments, not just duties
- [ ] **Quantified Results**: Includes specific numbers, percentages, and metrics
- [ ] **Strong Action Verbs**: Starts bullet points with powerful action words
- [ ] **Relevance**: Content aligns with target role requirements
- [ ] **Consistent Formatting**: Uniform formatting throughout experience section

### Skills Section
- [ ] **Technical Skills**: Includes relevant technical skills and tools
- [ ] **Soft Skills**: Includes leadership, communication, and problem-solving skills
- [ ] **Industry Alignment**: Skills match target role and industry requirements
- [ ] **Keyword Optimization**: Includes relevant keywords from job descriptions
- [ ] **Organized Presentation**: Skills are logically grouped and presented

### Education
- [ ] **Complete Information**: Degree, institution, graduation date included
- [ ] **GPA Inclusion**: Includes GPA if 3.5 or higher
- [ ] **Relevant Coursework**: Includes coursework directly related to target role
- [ ] **Certifications**: Lists professional certifications separately
- [ ] **Current Information**: Education details are accurate and current

### Formatting and Presentation
- [ ] **Clean Layout**: Professional, easy-to-read formatting
- [ ] **Consistent Spacing**: Uniform spacing throughout document
- [ ] **Standard Font**: Uses professional font (Arial, Calibri, Times New Roman)
- [ ] **Appropriate Length**: 1-2 pages for most professionals
- [ ] **No Graphics**: Avoids tables, images, or complex formatting
- [ ] **ATS Compatible**: Format is compatible with Applicant Tracking Systems

### Content Quality
- [ ] **No Spelling Errors**: Document is free of spelling mistakes
- [ ] **No Grammar Errors**: Document is free of grammatical errors
- [ ] **Consistent Tense**: Uses consistent verb tense throughout
- [ ] **Professional Language**: Uses professional, industry-appropriate language
- [ ] **Accurate Information**: All information is truthful and verifiable

### ATS Optimization
- [ ] **Keyword Alignment**: Includes relevant keywords from job descriptions
- [ ] **Standard Headers**: Uses standard section headers (Experience, Education, Skills)
- [ ] **Parseable Format**: Text can be easily read by ATS systems
- [ ] **No Special Characters**: Avoids special characters that may confuse ATS
- [ ] **Compatible File Format**: Saved in .docx or .pdf format

### Industry-Specific Requirements
- [ ] **Industry Keywords**: Includes industry-specific terminology
- [ ] **Relevant Experience**: Experience aligns with industry standards
- [ ] **Professional Standards**: Follows industry-specific resume conventions
- [ ] **Certification Requirements**: Includes required certifications for target role
- [ ] **Technical Proficiency**: Demonstrates appropriate technical skill level

## Detailed Rationale Requirements

When presenting checklist findings, ALWAYS include rationale that explains:

- Why each item is important for resume quality
- How improvements will enhance ATS compatibility
- Specific impact on interview chances
- Industry best practices being applied

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with insights
3. Offer options:
   - **1. Apply recommendations and continue assessment**
   - **2. Return to checklist menu**
   - **3. Ask any questions or engage further with this assessment**

## Quality Scoring

### Excellent (90-100%)
- All critical items checked
- Strong achievement focus
- Excellent ATS optimization
- Professional presentation

### Good (80-89%)
- Most critical items checked
- Good achievement focus
- Good ATS optimization
- Professional presentation

### Needs Improvement (70-79%)
- Some critical items missing
- Limited achievement focus
- Basic ATS optimization
- Some formatting issues

### Requires Significant Work (Below 70%)
- Many critical items missing
- Weak achievement focus
- Poor ATS optimization
- Multiple formatting issues

## CRITICAL REMINDERS

**❌ NEVER:**

- Ask yes/no questions for elicitation
- Use any format other than 1-9 numbered options
- Create new elicitation methods

**✅ ALWAYS:**

- Use exact 1-9 format when elicit: true
- Select options 2-9 from data/elicitation-methods only
- Provide detailed rationale explaining the importance of each item
- End with "Select 1-9 or just type your question/feedback:"
