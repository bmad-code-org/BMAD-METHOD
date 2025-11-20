# Career Achievement Brainstorming

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Career brainstorming cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you complete career brainstorming without user interaction, you have violated this workflow.

## Critical: Career Context

If career context has not been provided, ask the user to provide their career background, target roles, and goals.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present brainstorming prompts and questions
2. Provide detailed rationale (explain why these questions matter for career development)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Continue with next brainstorming area"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Completing career brainstorming for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Set brainstorming context** - Understand career goals, target roles, and current situation
2. **Guide through achievement areas** - Work through different types of career achievements systematically
3. **Process each area:**
   - Present relevant questions and prompts
   - Help user identify and articulate achievements
   - **IF elicit: true** → MANDATORY 1-9 options format
   - Document and refine achievements
4. **Continue until complete**

## Brainstorming Focus Areas

### Professional Achievements
- **Quantified Results** - Revenue increases, cost savings, efficiency improvements
- **Project Leadership** - Team size, project scope, stakeholder management
- **Process Improvements** - Systems implemented, workflows optimized, automation
- **Client/Customer Impact** - Satisfaction scores, retention rates, new business

### Technical Achievements
- **Technology Implementation** - Systems deployed, platforms migrated, tools adopted
- **Problem Solving** - Complex issues resolved, technical challenges overcome
- **Innovation** - New solutions developed, patents, proprietary systems
- **Performance Optimization** - Speed improvements, scalability enhancements

### Leadership Achievements
- **Team Development** - Mentoring, training, career development of others
- **Strategic Initiatives** - Business strategy, market expansion, organizational change
- **Cross-functional Collaboration** - Interdepartmental projects, stakeholder alignment
- **Crisis Management** - Emergency response, risk mitigation, business continuity

### Industry Recognition
- **Awards and Honors** - Industry awards, company recognition, certifications
- **Speaking and Publications** - Conference presentations, articles, thought leadership
- **Professional Development** - Advanced degrees, certifications, continuous learning
- **Community Involvement** - Industry associations, volunteer work, pro bono projects

## Detailed Rationale Requirements

When presenting brainstorming prompts, ALWAYS include rationale that explains:

- Why this area is important for career development
- How achievements in this area demonstrate value to employers
- Specific examples of what constitutes strong achievements
- How to quantify and articulate these achievements effectively

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with insights
3. Offer options:
   - **1. Apply insights and continue brainstorming**
   - **2. Return to brainstorming menu**
   - **3. Ask any questions or engage further with this elicitation**

## Achievement Documentation

For each achievement identified:

1. **Context** - What was the situation or challenge?
2. **Action** - What specific actions did you take?
3. **Result** - What was the measurable outcome?
4. **Impact** - How did this benefit the organization or stakeholders?
5. **Skills Demonstrated** - What competencies does this showcase?

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
