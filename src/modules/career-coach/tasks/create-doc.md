# Create Document

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Document creation cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you complete document creation without user interaction, you have violated this workflow.

## Critical: Document Context

If document context has not been provided, ask the user to specify the type of document, purpose, target audience, and key requirements.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present document creation prompts and questions
2. Provide detailed rationale (explain why these questions matter for document quality)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Continue with next document section"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Completing document creation for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Define document purpose** - Understand what the document needs to achieve
2. **Identify target audience** - Determine who will read and use the document
3. **Gather content requirements** - Collect all necessary information and materials
4. **Structure the document** - Organize content in a logical, effective format
5. **Create initial draft** - Write the document content
6. **Review and refine** - Improve clarity, accuracy, and effectiveness
7. **Finalize and format** - Complete the document with proper formatting

## Document Types

### Career Documents
- **Resume/CV** - Professional summary of experience and qualifications
- **Cover Letter** - Targeted introduction for job applications
- **LinkedIn Profile** - Professional online presence
- **Portfolio** - Showcase of work and achievements
- **Career Plan** - Strategic career development roadmap

### Professional Documents
- **Business Plan** - Strategic business development document
- **Project Proposal** - Detailed project planning and execution
- **Performance Review** - Self-assessment and goal setting
- **Professional Bio** - Personal and professional background
- **Reference List** - Professional contacts and recommendations

### Development Documents
- **Skills Assessment** - Comprehensive skills evaluation
- **Learning Plan** - Structured skill development approach
- **Networking Strategy** - Professional relationship building plan
- **Personal Brand Plan** - Online presence and reputation strategy
- **Career Transition Plan** - Strategy for career changes

## Document Creation Focus Areas

### Purpose and Audience
- **Document Objective** - What should the document accomplish?
- **Target Audience** - Who will read and use this document?
- **Key Messages** - What are the main points to communicate?
- **Call to Action** - What should the reader do after reading?
- **Success Criteria** - How will you measure the document's effectiveness?

### Content Development
- **Information Gathering** - What information needs to be included?
- **Content Organization** - How should the information be structured?
- **Key Sections** - What are the main sections of the document?
- **Supporting Materials** - What evidence or examples should be included?
- **Visual Elements** - What graphics or formatting would enhance the document?

### Quality and Effectiveness
- **Clarity and Readability** - Is the content clear and easy to understand?
- **Accuracy and Completeness** - Is all information accurate and complete?
- **Professional Standards** - Does the document meet professional standards?
- **Brand Consistency** - Does it align with personal or organizational brand?
- **Impact and Persuasiveness** - Will it achieve the intended impact?

## Detailed Rationale Requirements

When presenting document creation prompts, ALWAYS include rationale that explains:

- Why specific content is important for the document's purpose
- How the information will benefit the target audience
- Examples of effective document structures and content
- How to create compelling and professional documents

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with document insights
3. Offer options:
   - **1. Apply insights and continue document creation**
   - **2. Return to document creation menu**
   - **3. Ask any questions or engage further with this elicitation**

## Document Structure Guidelines

### Standard Document Sections
1. **Header/Title** - Clear, descriptive document title
2. **Introduction** - Purpose, scope, and key messages
3. **Main Content** - Organized sections with clear headings
4. **Supporting Information** - Evidence, examples, and details
5. **Conclusion** - Summary and next steps
6. **Appendices** - Additional materials and references

### Formatting Standards
- **Consistent Formatting** - Use consistent fonts, spacing, and styling
- **Clear Headings** - Use descriptive, hierarchical headings
- **Professional Language** - Use clear, professional, and appropriate language
- **Visual Hierarchy** - Organize information with clear visual structure
- **Accessibility** - Ensure document is accessible to all readers

## Document Quality Checklist

### Content Quality
- [ ] **Clear Purpose** - Document purpose is clearly stated
- [ ] **Targeted Audience** - Content is appropriate for target audience
- [ ] **Complete Information** - All necessary information is included
- [ ] **Accurate Content** - All information is accurate and current
- [ ] **Logical Structure** - Information is organized logically

### Professional Standards
- [ ] **Professional Language** - Language is appropriate and professional
- [ ] **Consistent Formatting** - Formatting is consistent throughout
- [ ] **Error-Free** - No spelling, grammar, or formatting errors
- [ ] **Brand Alignment** - Aligns with personal or organizational brand
- [ ] **Industry Standards** - Meets industry-specific standards

### Effectiveness
- [ ] **Clear Messages** - Key messages are clearly communicated
- [ ] **Persuasive Content** - Content is compelling and persuasive
- [ ] **Actionable** - Reader knows what to do next
- [ ] **Memorable** - Key points are memorable and impactful
- [ ] **Achieves Purpose** - Document accomplishes its intended purpose

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
