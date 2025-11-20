# Research Workflow - Perplexity Prompting

**Agent**: Perplexity Specialist
**Purpose**: Create comprehensive, well-structured research prompts for Perplexity AI

## Overview

This workflow guides you through creating effective research prompts using the Perfect Prompt Framework, ensuring you get accurate, well-cited, and comprehensive information from Perplexity AI.

## When to Use

- Academic research and literature reviews
- Market research and competitive intelligence
- Current events and trend analysis
- Business intelligence and industry analysis
- Product research and user needs
- Technical research and documentation
- Any information gathering that requires real-time, cited sources

## Workflow Steps

### Step 1: Define Research Need

**Goal**: Clarify what you need to know and why

**Actions**:
1. State your research question or information need
2. Define the context and intended use
3. Identify what would constitute a successful answer
4. Determine appropriate depth level

**Questions to Answer**:
- What specific question needs answering?
- What will you do with this information?
- What depth do you need (quick facts, standard, comprehensive, academic)?
- Are there time constraints (current events vs. timeless knowledge)?

**Command**: `analyze-research-need`

### Step 2: Choose Prompt Category

**Goal**: Select the right approach for your research

**Categories**:
- **Informational** - Gathering facts, data, and current information
- **Instructional** - How-to guides and step-by-step processes
- **Interactive** - Expert consultation and comparative analysis

**Considerations**:
- Informational: "What is...?", "Show me current data on..."
- Instructional: "How do I...?", "What are the steps to...?"
- Interactive: "As an expert in X, analyze...?", "Compare A and B..."

### Step 3: Build Core Prompt

**Goal**: Create the foundation using the 5-component framework

**Components to Define**:

1. **Clear Instruction** - What you want Perplexity to do
   - Be specific and actionable
   - Use clear verbs (analyze, summarize, compare, find, explain)

2. **Relevant Context** - Background information
   - Industry, field, or domain context
   - Why you're asking (use case)
   - Any constraints or assumptions

3. **Specific Input** - The subject matter
   - Precise topic or data to analyze
   - Relevant time frames
   - Geographic or domain boundaries

4. **Key Keywords** - Focus terms
   - 3-5 critical search terms
   - Specific terminology for your domain
   - Alternative terms to consider

5. **Output Format** - How results should be structured
   - List, table, narrative, comparison matrix
   - Sections or categories needed
   - Level of detail for each section

**Command**: `create-research-prompt` or template-specific commands

### Step 4: Add Specialization

**Goal**: Tailor the prompt for your specific use case

**Professional Templates Available**:
- **Educational** - Curriculum, learning resources, topic exploration
- **Product Management** - Market research, user needs, competitive analysis
- **Financial Analysis** - Market trends, company research, economic indicators
- **Marketing Intelligence** - Audience insights, competitive tracking, trends

**Enhancement Options**:
- Request specific citation formats (APA, MLA, Chicago)
- Ask for source diversity (academic, industry, news)
- Require recency (within last 6 months, current year)
- Specify expertise level (general audience, expert level)

**Commands**: `template-educational`, `template-product-management`, etc.

### Step 5: Optimize for Perplexity

**Goal**: Leverage Perplexity's unique strengths

**Optimizations**:
- **Real-time Data**: Request current information, latest trends
- **Source Verification**: Ask for credible, diverse sources
- **Live Web Search**: Emphasize need for most recent data
- **Citation Requirements**: Specify how sources should be referenced

**Add to Prompt**:
- "Include citations for all claims"
- "Focus on sources from the last [timeframe]"
- "Provide a mix of academic and industry sources"
- "Highlight any conflicting information from different sources"

### Step 6: Review Against Checklist

**Goal**: Ensure prompt quality and completeness

**Quality Checklist**:
- ✅ Instructions are clear and unambiguous
- ✅ Context is sufficient for understanding
- ✅ Inputs are specific and well-defined
- ✅ Keywords are relevant and focused
- ✅ Output format is specified
- ✅ Scope is appropriate and manageable
- ✅ Real-time/current data is requested
- ✅ Citation requirements are included
- ✅ Language is straightforward, not vague

**Common Issues to Fix**:
- Vague terms: "good", "best", "nice" → Replace with specific criteria
- Too broad: Narrow scope or break into multiple prompts
- Missing format: Add structure for how results should appear
- No citations: Always request sources and verification

**Command**: `refine-research-prompt`

### Step 7: Test and Iterate

**Goal**: Refine based on actual results

**Process**:
1. Use the prompt in Perplexity
2. Evaluate the results:
   - Did it answer your question?
   - Is the depth appropriate?
   - Are sources credible and well-cited?
   - Is the format usable?
3. Identify gaps or issues
4. Refine specific components
5. Test again if needed

**Iteration Focus Areas**:
- Adjust depth if too superficial or too detailed
- Add constraints if results are too broad
- Refine keywords if missing key information
- Modify output format if structure isn't helpful

## Output Deliverables

### Research Prompt Document

Saved to: `{{research_prompts_folder}}/[topic]-research-prompt.md`

**Contents**:
```markdown
# Research Prompt: [Topic]

## Purpose
[What you're researching and why]

## Perplexity Prompt

[Complete, ready-to-use prompt]

## Metadata
- Category: [Informational/Instructional/Interactive]
- Depth: [Quick/Standard/Comprehensive/Academic]
- Template: [Professional template used, if any]
- Created: [Date]
- Status: [Draft/Tested/Refined]

## Expected Outputs
- [What you expect to receive]
- [Key questions that should be answered]

## Notes
[Any refinements needed, lessons learned, etc.]
```

## Success Criteria

A successful research workflow produces:
- ✅ Clear, unambiguous prompt ready to use
- ✅ All 5 framework components present and optimized
- ✅ Appropriate depth for your needs
- ✅ Citation and source requirements specified
- ✅ Output format defined and usable
- ✅ Leverages Perplexity's real-time capabilities
- ✅ Documented for future reference and iteration

## Tips for Success

1. **Start Specific**: Better to be too narrow and expand than too broad
2. **Request Citations**: Always ask for sources and verification
3. **Define Format Early**: Knowing output structure helps focus the search
4. **Use Templates**: Leverage professional templates as starting points
5. **Iterate**: First prompts rarely perfect; refine based on results
6. **Document**: Save successful prompts for similar future needs
7. **Think Real-Time**: Perplexity's strength is current info; use it
8. **Be Clear About Depth**: Specify how comprehensive you need results

## Common Use Cases

### Quick Fact Checking
- Minimal context needed
- Specific, targeted questions
- Request verification from multiple sources

### Market Research
- Use Product Management or Marketing templates
- Request competitive landscape
- Ask for recent trends and data

### Academic Research
- Use Academic template
- Specify citation format
- Request scholarly and peer-reviewed sources
- Ask for recent studies and literature

### Competitive Intelligence
- Request real-time competitor information
- Ask for market positioning analysis
- Require multiple source verification
- Include industry context

### Learning & Education
- Use Educational template
- Request multiple perspectives
- Ask for examples and applications
- Specify expertise level

---

*Master the art of research prompting to unlock Perplexity's full potential for accurate, comprehensive, and well-cited information.*
