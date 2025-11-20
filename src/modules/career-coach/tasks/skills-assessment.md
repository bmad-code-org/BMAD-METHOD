# Skills Assessment and Development

## ⚠️ CRITICAL EXECUTION NOTICE ⚠️

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

When this task is invoked:

1. **DISABLE ALL EFFICIENCY OPTIMIZATIONS** - This workflow requires full user interaction
2. **MANDATORY STEP-BY-STEP EXECUTION** - Each section must be processed sequentially with user feedback
3. **ELICITATION IS REQUIRED** - When `elicit: true`, you MUST use the 1-9 format and wait for user response
4. **NO SHORTCUTS ALLOWED** - Skills assessment cannot be completed without following this workflow

**VIOLATION INDICATOR:** If you complete skills assessment without user interaction, you have violated this workflow.

## Critical: Career Context

If career context has not been provided, ask the user to provide their current role, industry, experience level, and career goals.

## CRITICAL: Mandatory Elicitation Format

**When `elicit: true`, this is a HARD STOP requiring user interaction:**

**YOU MUST:**

1. Present skills assessment prompts and questions
2. Provide detailed rationale (explain why these questions matter for skills development)
3. **STOP and present numbered options 1-9:**
   - **Option 1:** Always "Continue with next skills area"
   - **Options 2-9:** Select 8 methods from data/elicitation-methods
   - End with: "Select 1-9 or just type your question/feedback:"
4. **WAIT FOR USER RESPONSE** - Do not proceed until user selects option or provides feedback

**WORKFLOW VIOLATION:** Completing skills assessment for elicit=true sections without user interaction violates this task.

**NEVER ask yes/no questions or use any other format.**

## Processing Flow

1. **Inventory current skills** - Identify all skills currently possessed
2. **Assess skill levels** - Evaluate proficiency in each skill area
3. **Identify target skills** - Determine skills needed for career goals
4. **Analyze skill gaps** - Compare current vs. required capabilities
5. **Prioritize development** - Rank skills by importance and urgency
6. **Create development plan** - Design learning and practice strategies

## Skills Assessment Focus Areas

### Technical Skills Assessment
- **Programming Languages** - What programming languages do you know?
- **Tools and Technologies** - What tools and platforms are you proficient with?
- **Methodologies** - What development or project management methodologies do you use?
- **Domain Knowledge** - What industry-specific technical knowledge do you have?

### Soft Skills Evaluation
- **Communication Skills** - How effectively do you communicate verbally and in writing?
- **Leadership Abilities** - How well do you lead teams and influence others?
- **Problem Solving** - How effectively do you analyze and solve complex problems?
- **Adaptability** - How well do you handle change and uncertainty?

### Industry-Specific Skills
- **Market Knowledge** - How well do you understand your industry and market?
- **Regulatory Knowledge** - What compliance and regulatory knowledge do you have?
- **Best Practices** - How familiar are you with industry best practices?
- **Emerging Trends** - How current are you with industry trends and innovations?

### Transferable Skills
- **Project Management** - How well do you plan, execute, and manage projects?
- **Data Analysis** - How effectively do you analyze and interpret data?
- **Customer Service** - How well do you understand and serve customer needs?
- **Financial Acumen** - How well do you understand business and financial concepts?

### Leadership and Management
- **Team Building** - How effectively do you build and develop teams?
- **Strategic Thinking** - How well do you think strategically and long-term?
- **Decision Making** - How effectively do you make complex decisions?
- **Change Management** - How well do you manage organizational change?

### Digital and Modern Skills
- **Digital Literacy** - How comfortable are you with digital tools and platforms?
- **Remote Work** - How effectively do you work in remote or hybrid environments?
- **Collaboration Tools** - How proficient are you with modern collaboration platforms?
- **Data Security** - How aware are you of cybersecurity and data protection?

## Detailed Rationale Requirements

When presenting skills assessment prompts, ALWAYS include rationale that explains:

- Why specific skills are important for career success
- How skill development creates career opportunities
- Examples of how skills have helped others advance
- How to effectively develop and demonstrate skills

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from data/elicitation-methods
2. Present results with skills insights
3. Offer options:
   - **1. Apply insights and continue assessment**
   - **2. Return to skills assessment menu**
   - **3. Ask any questions or engage further with this elicitation**

## Skills Documentation

For each skill area:

1. **Current Proficiency** - What is your current skill level?
2. **Target Proficiency** - What level do you need to achieve?
3. **Gap Analysis** - What is the difference between current and target?
4. **Development Priority** - How important is this skill for your goals?
5. **Learning Resources** - What resources can help you develop this skill?
6. **Practice Opportunities** - How can you practice and apply this skill?

## Development Planning

For each prioritized skill:

1. **Learning Objectives** - What specific competencies do you want to develop?
2. **Learning Methods** - What methods will you use to learn?
3. **Timeline** - When will you achieve each learning milestone?
4. **Success Metrics** - How will you measure skill development?
5. **Application Plan** - How will you apply and demonstrate the skill?

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
