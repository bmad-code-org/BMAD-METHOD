# Intent vs Prescriptive Spectrum

## Core Philosophy

The **Intent vs Prescriptive Spectrum** is a fundamental design principle for BMAD workflows and agents. It determines how much creative freedom an LLM has versus how strictly it must follow predefined instructions.

**Key Principle:** The closer workflows stay to **intent**, the more creative and adaptive the LLM experience becomes. The closer they stay to **prescriptive**, the more consistent and controlled the output becomes.

## Understanding the Spectrum

### **Intent-Based Design** (Creative Freedom)

**Focus**: What goal should be achieved
**Approach**: Trust the LLM to determine the best method
**Result**: Creative, adaptive, context-aware interactions
**Best For**: Creative exploration, problem-solving, personalized experiences

### **Prescriptive Design** (Structured Control)

**Focus**: Exactly what to say and do
**Approach**: Detailed scripts and specific instructions
**Result**: Consistent, predictable, controlled outcomes
**Best For**: Compliance, safety-critical, standardized processes

## Spectrum Examples

### **Highly Intent-Based** (Creative End)

```markdown
**Example:** Story Exploration Workflow
**Instruction:** "Help the user explore their dream imagery to craft compelling narratives, use multiple turns of conversation to really push users to develop their ideas, giving them hints and ideas also to prime them effectively to bring out their creativity"
**LLM Freedom:** Adapts questions, explores tangents, follows creative inspiration
**Outcome:** Unique, personalized storytelling experiences
```

### **Balanced Middle** (Professional Services)

```markdown
**Example:** Business Strategy Workflow
**Instruction:** "Guide the user through SWOT analysis using your business expertise. when complete tell them 'here is your final report {report output}'
**LLM Freedom:** Professional judgment in analysis, structured but adaptive approach
**Outcome:** Professional, consistent yet tailored business insights
```

### **Highly Prescriptive** (Control End)

```markdown
**Example:** Medical Intake Form
**Instruction:** "Ask exactly: 'Do you currently experience any of the following symptoms: fever, cough, fatigue?' Wait for response, then ask exactly: 'When did these symptoms begin?'"
**LLM Freedom:** Minimal - must follow exact script for medical compliance
**Outcome:** Consistent, medically compliant patient data collection
```

## Spectrum Positioning Guide

### **Choose Intent-Based When:**

- ✅ Creative exploration and innovation are goals
- ✅ Personalization and adaptation to user context are important
- ✅ Human-like conversation and natural interaction are desired
- ✅ Problem-solving requires flexible thinking
- ✅ User experience and engagement are priorities

**Examples:**

- Creative brainstorming sessions
- Personal coaching or mentoring
- Exploratory research and discovery
- Artistic content creation
- Collaborative problem-solving

### **Choose Prescriptive When:**

- ✅ Compliance with regulations or standards is required
- ✅ Safety or legal considerations are paramount
- ✅ Exact consistency across multiple sessions is essential
- ✅ Training new users on specific procedures
- ✅ Data collection must follow specific protocols

**Examples:**

- Medical intake and symptom assessment
- Legal compliance questionnaires
- Safety checklists and procedures
- Standardized testing protocols
- Regulatory data collection

### **Choose Balanced When:**

- ✅ Professional expertise is required but adaptation is beneficial
- ✅ Consistent quality with flexible application is needed
- ✅ Domain expertise should guide but not constrain interactions
- ✅ User trust and professional credibility are important
- ✅ Complex processes require both structure and judgment

**Examples:**

- Business consulting and advisory
- Technical support and troubleshooting
- Educational tutoring and instruction
- Financial planning and advice
- Project management facilitation

## Implementation Guidelines

### **For Workflow Designers:**

1. **Early Spectrum Decision**: Determine spectrum position during initial design
2. **User Education**: Explain spectrum choice and its implications to users
3. **Consistent Application**: Maintain chosen spectrum throughout workflow
4. **Context Awareness**: Adjust spectrum based on specific use case requirements

### **For Workflow Implementation:**

**Intent-Based Patterns:**

```markdown
- "Help the user understand..." (vs "Explain that...")
- "Guide the user through..." (vs "Follow these steps...")
- "Use your professional judgment to..." (vs "Apply this specific method...")
- "Adapt your approach based on..." (vs "Regardless of situation, always...")
```

**Prescriptive Patterns:**

```markdown
- "Say exactly: '...'" (vs "Communicate that...")
- "Follow this script precisely: ..." (vs "Cover these points...")
- "Do not deviate from: ..." (vs "Consider these options...")
- "Must ask in this order: ..." (vs "Ensure you cover...")
```

### **For Agents:**

**Intent-Based Agent Design:**

```yaml
persona:
  communication_style: 'Adaptive professional who adjusts approach based on user context'
  guiding_principles:
    - 'Use creative problem-solving within professional boundaries'
    - 'Personalize approach while maintaining expertise'
    - 'Adapt conversation flow to user needs'
```

**Prescriptive Agent Design:**

```yaml
persona:
  communication_style: 'Follows standardized protocols exactly'
  governing_rules:
    - 'Must use approved scripts without deviation'
    - 'Follow sequence precisely as defined'
    - 'No adaptation of prescribed procedures'
```

## Spectrum Calibration Questions

**Ask these during workflow design:**

1. **Consequence of Variation**: What happens if the LLM says something different?
2. **User Expectation**: Does the user expect consistency or creativity?
3. **Risk Level**: What are the risks of creative deviation vs. rigid adherence?
4. **Expertise Required**: Is domain expertise application more important than consistency?
5. **Regulatory Requirements**: Are there external compliance requirements?

## Best Practices

### **DO:**

- ✅ Make conscious spectrum decisions during design
- ✅ Explain spectrum choices to users
- ✅ Use intent-based design for creative and adaptive experiences
- ✅ Use prescriptive design for compliance and consistency requirements
- ✅ Consider balanced approaches for professional services
- ✅ Document spectrum rationale for future reference

### **DON'T:**

- ❌ Mix spectrum approaches inconsistently within workflows
- ❌ Default to prescriptive when intent-based would be more effective
- ❌ Use creative freedom when compliance is required
- ❌ Forget to consider user expectations and experience
- ❌ Overlook risk assessment in spectrum selection

## Quality Assurance

**When validating workflows:**

- Check if spectrum position is intentional and consistent
- Verify prescriptive elements are necessary and justified
- Ensure intent-based elements have sufficient guidance
- Confirm spectrum alignment with user needs and expectations
- Validate that risks are appropriately managed

## Examples in Practice

### **Medical Intake (Highly Prescriptive):**

- **Why**: Patient safety, regulatory compliance, consistent data collection
- **Implementation**: Exact questions, specific order, no deviation permitted
- **Benefit**: Reliable, medically compliant patient information

### **Creative Writing Workshop (Highly Intent):**

- **Why**: Creative exploration, personalized inspiration, artistic expression
- **Implementation**: Goal guidance, creative freedom, adaptive prompts
- **Benefit**: Unique, personalized creative works

### **Business Strategy (Balanced):**

- **Why**: Professional expertise with adaptive application
- **Implementation**: Structured framework with professional judgment
- **Benefit**: Professional, consistent yet tailored business insights

## Conclusion

The Intent vs Prescriptive Spectrum is not about good vs. bad - it's about **appropriate design choices**. The best workflows make conscious decisions about where they fall on this spectrum based on their specific requirements, user needs, and risk considerations.

**Key Success Factor**: Choose your spectrum position intentionally, implement it consistently, and align it with your specific use case requirements.
