<!-- Powered by BMAD™ Core -->

# Advanced Elicitation Task

## Purpose

- Provide reflective and brainstorming actions to enhance proposal quality
- Enable deeper exploration of RFQ response strategies through structured techniques
- Support iterative refinement of proposal content through multiple analytical perspectives
- Facilitate collaborative improvement of proposal elements
- Identify gaps and opportunities in proposal approach

## Usage Scenarios

### Scenario 1: Proposal Content Enhancement

1. **Content Review**: Examine drafted proposal section or element
2. **Elicitation Selection**: Choose appropriate elicitation method
3. **Method Application**: Apply selected technique to improve content
4. **Iterative Refinement**: Repeat with different methods as needed

### Scenario 2: Strategic Proposal Planning

1. **Strategy Assessment**: Evaluate current proposal approach
2. **Perspective Exploration**: Use elicitation methods to consider alternative viewpoints
3. **Gap Identification**: Discover overlooked opportunities or weaknesses
4. **Strategy Enhancement**: Refine approach based on elicitation insights

## Task Instructions

### 1. Intelligent Method Selection

**Context Analysis**: Before presenting options, analyze:

- **Content Type**: Technical approach, management plan, past performance, etc.
- **Development Stage**: Early drafting, refinement, or final review
- **Strategic Importance**: Critical evaluation factors vs. supporting elements
- **Complexity Level**: Simple, moderate, or complex content
- **Risk Level**: High-impact decisions vs. routine items

**Method Selection Strategy**:

1. **Always Include Core Methods** (choose 3-4):
   - Expand or Contract for Audience
   - Critique and Refine
   - Identify Potential Risks
   - Assess Alignment with Evaluation Criteria

2. **Context-Specific Methods** (choose 4-5):
   - **Technical Content**: Tree of Thoughts, Solution Alternatives, Technical Risk Analysis
   - **Management Content**: Stakeholder Perspective, Resource Optimization, Process Evaluation
   - **Past Performance**: Relevance Assessment, Outcome Emphasis, Competitive Comparison
   - **Strategic Content**: Red Team vs. Blue Team, Evaluator Simulation, Competitor Analysis

3. **Always Include**: "Proceed / No Further Actions" as option 9

### 2. Section Context and Review

When invoked after outputting a section:

1. **Provide Context Summary**: Give a brief 1-2 sentence summary of what the user should look for in the section just presented

2. **Explain Visual Elements**: If the section contains diagrams or tables, explain them briefly before offering elicitation options

3. **Clarify Scope Options**: If the section contains multiple distinct items, inform the user they can apply elicitation actions to:
   - The entire section as a whole
   - Individual items within the section (specify which item when selecting an action)

### 3. Present Elicitation Options

**Review Request Process:**

- Ask the user to review the drafted section
- In the SAME message, inform them they can suggest direct changes OR select an elicitation method
- Present 9 intelligently selected methods (0-8) plus "Proceed" (9)
- Keep descriptions short - just the method name
- Await simple numeric selection

**Action List Presentation Format:**

```text
**Advanced Elicitation Options**
Choose a number (0-8) or 9 to proceed:

0. [Method Name]
1. [Method Name]
2. [Method Name]
3. [Method Name]
4. [Method Name]
5. [Method Name]
6. [Method Name]
7. [Method Name]
8. [Method Name]
9. Proceed / No Further Actions
```

**Response Handling:**

- **Numbers 0-8**: Execute the selected method, then re-offer the choice
- **Number 9**: Proceed to next section or continue conversation
- **Direct Feedback**: Apply user's suggested changes and continue

### 4. Method Execution Framework

**Execution Process:**

1. **Retrieve Method**: Access the specific elicitation method from the elicitation-methods data file
2. **Apply Context**: Execute the method from your current role's perspective
3. **Provide Results**: Deliver insights, critiques, or alternatives relevant to the content
4. **Re-offer Choice**: Present the same 9 options again until user selects 9 or gives direct feedback

**Execution Guidelines:**

- **Be Concise**: Focus on actionable insights, not lengthy explanations
- **Stay Relevant**: Tie all elicitation back to the specific proposal content being analyzed
- **Identify Personas**: For multi-persona methods, clearly identify which viewpoint is speaking
- **Maintain Flow**: Keep the process moving efficiently

## RFQ-Specific Elicitation Methods

### Evaluator Perspective

Analyze the content from the perspective of a government evaluator scoring against Section M criteria. Identify strengths, weaknesses, and areas that may receive lower scores. Suggest improvements to maximize evaluation points.

### Compliance Verification

Systematically check the content against all applicable requirements from the compliance matrix. Identify any gaps, partial responses, or areas where compliance could be more explicitly demonstrated. Suggest improvements for requirement traceability.

### Win Theme Integration

Assess how effectively the content incorporates and reinforces the proposal's win themes. Identify opportunities to strengthen theme messaging, add supporting evidence, or create stronger connections to customer benefits.

### Competitive Differentiation

Analyze the content from a competitive perspective. Identify areas where the approach may be similar to competitors and suggest ways to strengthen differentiation. Highlight unique capabilities or approaches that could be emphasized.

### Risk Mitigation Enhancement

Examine the content for potential risks that may concern evaluators. Identify areas where risk mitigation could be strengthened or made more explicit. Suggest additional risk management approaches or evidence of risk reduction.

### Technical Depth Adjustment

Assess whether the technical content has the appropriate depth for the audience. Suggest areas to simplify or add detail based on the technical sophistication of the evaluators and the complexity of the requirements.

### Evidence Strengthening

Review the content for claims that lack sufficient supporting evidence. Identify opportunities to add metrics, past performance examples, or other proof points that strengthen the credibility of the approach.

### Graphics Opportunity

Identify concepts in the text that could be more effectively communicated through graphics, tables, or other visual elements. Suggest specific visualization approaches for complex information.

## Best Practices

- **Tailor Methods**: Select elicitation methods most relevant to the specific proposal section
- **Balance Perspectives**: Include both critical and constructive methods
- **Focus on Impact**: Prioritize elicitation for high-value or high-risk proposal elements
- **Maintain Efficiency**: Keep elicitation focused and actionable
- **Document Insights**: Capture valuable insights for future proposal sections
- **Involve SMEs**: Include subject matter experts in elicitation sessions when possible
- **Connect to Evaluation**: Always tie elicitation back to evaluation criteria and win probability
- **Iterative Approach**: Use multiple methods on critical sections for comprehensive improvement

## Related Agents

- **All Agents**: This is a utility task that can be used by any agent in the RFQ Government expansion pack
