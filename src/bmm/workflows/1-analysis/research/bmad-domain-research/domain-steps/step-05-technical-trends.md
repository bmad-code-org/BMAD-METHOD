# Domain Research Step 5: Technical Trends

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without web search verification

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ Search the web to verify and supplement your knowledge with current facts
- 📋 YOU ARE A TECHNOLOGY ANALYST, not content generator
- 💬 FOCUS on emerging technologies and innovation patterns
- 🔍 WEB SEARCH REQUIRED - verify current facts against live sources
- 📝 WRITE CONTENT IMMEDIATELY TO DOCUMENT
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show web search analysis before presenting findings
- ⚠️ Present [C] continue option after technical trends content generation
- 📝 WRITE TECHNICAL TRENDS ANALYSIS TO DOCUMENT IMMEDIATELY
- 💾 ONLY proceed when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- **Research topic = "{{research_topic}}"** - established from initial discussion
- **Research goals = "{{research_goals}}"** - established from initial discussion
- Focus on emerging technologies and innovation patterns in the domain
- Web search capabilities with source verification are enabled

## YOUR TASK:

Conduct comprehensive technical trends analysis using current web data with emphasis on innovations and emerging technologies impacting {{research_topic}}.

## TECHNICAL TRENDS SEQUENCE:

### 1. Begin Technical Trends Analysis

Start with technology research approach:
"Now I'll conduct **technical trends and emerging technologies** analysis for **{{research_topic}}** using current data.

**Technical Trends Focus:**

- Emerging technologies and innovations
- Digital transformation impacts
- Automation and efficiency improvements
- New business models enabled by technology
- Future technology projections and roadmaps

**Let me search for current technology developments.**"

### 2. Web Search for Emerging Technologies

Search for current technology information:
Search the web: "{{research_topic}} emerging technologies innovations"

**Technology focus:**

- AI, machine learning, and automation impacts
- Digital transformation trends
- New technologies disrupting the industry
- Innovation patterns and breakthrough developments

### 3. Web Search for Digital Transformation

Search for current transformation trends:
Search the web: "{{research_topic}} digital transformation trends"

**Transformation focus:**

- Digital adoption trends and rates
- Business model evolution
- Customer experience innovations
- Operational efficiency improvements

### 4. Web Search for Future Outlook

Search for future projections:
Search the web: "{{research_topic}} future outlook trends"

**Future focus:**

- Technology roadmaps and projections
- Market evolution predictions
- Innovation pipelines and R&D trends
- Long-term industry transformation

### 5. Generate Technical Trends Content

**WRITE IMMEDIATELY TO DOCUMENT**

Prepare technical analysis with source citations:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## Technical Trends and Innovation

### Emerging Technologies

[Emerging technologies analysis with source citations]
_Source: [URL]_

### Digital Transformation

[Digital transformation analysis with source citations]
_Source: [URL]_

### Innovation Patterns

[Innovation patterns analysis with source citations]
_Source: [URL]_

### Future Outlook

[Future outlook and projections with source citations]
_Source: [URL]_

### Implementation Opportunities

[Implementation opportunity analysis with source citations]
_Source: [URL]_

### Challenges and Risks

[Challenges and risks assessment with source citations]
_Source: [URL]_

## Recommendations

### Technology Adoption Strategy

[Technology adoption recommendations]

### Innovation Roadmap

[Innovation roadmap suggestions]

### Risk Mitigation

[Risk mitigation strategies]
```

### 6. Present Analysis and Complete Option

Show the generated technical analysis and present complete option:
"I've completed **technical trends and innovation analysis** for {{research_topic}}.

**Technical Highlights:**

- Emerging technologies and innovations identified
- Digital transformation trends mapped
- Future outlook and projections analyzed
- Implementation opportunities and challenges documented
- Practical recommendations provided

**Technical Trends Research Completed:**

- Emerging technologies and innovations identified
- Digital transformation trends mapped
- Future outlook and projections analyzed
- Implementation opportunities and challenges documented

**Ready to proceed to research synthesis and recommendations?**
[C] Continue - Save this to document and proceed to synthesis

### 7. Handle Continue Selection

#### If 'C' (Continue):

- **CONTENT ALREADY WRITTEN TO DOCUMENT**
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load: `./domain-steps/step-06-research-synthesis.md`

## APPEND TO DOCUMENT:

Content is already written to document when generated in step 5. No additional append needed.

## SUCCESS METRICS:

✅ Emerging technologies identified with current data
✅ Digital transformation trends clearly documented
✅ Future outlook and projections analyzed
✅ Implementation opportunities and challenges mapped
✅ Strategic recommendations provided
✅ Content written immediately to document
✅ [C] continue option presented and handled correctly
✅ Proper routing to next step (research synthesis)
✅ Research goals alignment maintained

## FAILURE MODES:

❌ Relying solely on training data without web verification for current facts
❌ Missing critical emerging technologies in the domain
❌ Not providing practical implementation recommendations
❌ Not completing strategic recommendations
❌ Not presenting completion option for research workflow
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## TECHNICAL RESEARCH PROTOCOLS:

- Search for cutting-edge technologies and innovations
- Identify disruption patterns and game-changers
- Research technology adoption timelines and barriers
- Consider regional technology variations
- Analyze competitive technological advantages

## RESEARCH WORKFLOW COMPLETION:

When 'C' is selected:

- All domain research steps completed
- Comprehensive research document generated
- All sections appended with source citations
- Research workflow status updated
- Final recommendations provided to user

## NEXT STEPS:

Research workflow complete. User may:

- Use the domain research to inform other workflows (PRD, architecture, etc.)
- Conduct additional research on specific topics if needed
- Move forward with product development based on research insights

Congratulations on completing comprehensive domain research! 🎉
