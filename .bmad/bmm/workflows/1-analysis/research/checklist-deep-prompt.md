# Deep Research Prompt Validation Checklist

## 🚨 CRITICAL: Anti-Hallucination Instructions (PRIORITY)

### Citation Requirements Built Into Prompt

- [ ] Prompt EXPLICITLY instructs: "Cite sources with URLs for ALL factual claims"
- [ ] Prompt requires: "Include source name, date, and URL for every statistic"
- [ ] Prompt mandates: "If you cannot find reliable data, state 'No verified data found for [X]'"
- [ ] Prompt specifies inline citation format (e.g., "[Source: Company, Year, URL]")
- [ ] Prompt requires References section at end with all sources listed

### Multi-Source Verification Requirements

- [ ] Prompt instructs: "Cross-reference critical claims with at least 2 independent sources"
- [ ] Prompt requires: "Note when sources conflict and present all viewpoints"
- [ ] Prompt specifies: "Verify version numbers and dates from official sources"
- [ ] Prompt mandates: "Mark confidence levels: [Verified], [Single source], [Uncertain]"

### Fact vs Analysis Distinction

- [ ] Prompt requires clear labeling: "Distinguish FACTS (sourced), ANALYSIS (your interpretation), SPECULATION (projections)"
- [ ] Prompt instructs: "Do not present assumptions or analysis as verified facts"
- [ ] Prompt requires: "Label projections and forecasts clearly as such"
- [ ] Prompt warns: "Avoid vague attributions like 'experts say' - name the expert/source"

### Source Quality Guidance

- [ ] Prompt specifies preferred sources (e.g., "Official docs > analyst reports > blog posts")
- [ ] Prompt prioritizes recency: "Prioritize {{current_year}} sources for time-sensitive data"
- [ ] Prompt requires credibility assessment: "Note source credibility for each citation"
- [ ] Prompt warns against: "Do not rely on single blog posts for critical claims"

### Anti-Hallucination Safeguards

- [ ] Prompt warns: "If data seems convenient or too round, verify with additional sources"
- [ ] Prompt instructs: "Flag suspicious claims that need third-party verification"
- [ ] Prompt requires: "Provide date accessed for all web sources"
- [ ] Prompt mandates: "Do NOT invent statistics - only use verified data"

## Prompt Foundation

### Topic and Scope

- [ ] Research topic is specific and focused (not too broad)
- [ ] Target platform is specified (ChatGPT, Gemini, Grok, Claude)
- [ ] Temporal scope defined and includes "current {{current_year}}" requirement
- [ ] Source recency requirement specified (e.g., "prioritize 2024-2025 sources")

## Content Requirements

### Information Specifications

- [ ] Types of information needed are listed (quantitative, qualitative, trends, case studies, etc.)
- [ ] Preferred sources are specified (academic, industry reports, news, etc.)
- [ ] Recency requirements are stated (e.g., "prioritize {{current_year}} sources")
- [ ] Keywords and technical terms are included for search optimization
- [ ] Validation criteria are defined (how to verify findings)

### Output Structure

- [ ] Desired format is clear (executive summary, comparison table, timeline, SWOT, etc.)
- [ ] Key sections or questions are outlined
- [ ] Depth level is specified (overview, standard, comprehensive, exhaustive)
- [ ] Citation requirements are stated
- [ ] Any special formatting needs are mentioned

## Platform Optimization

### Platform-Specific Elements

- [ ] Prompt is optimized for chosen platform's capabilities
- [ ] Platform-specific tips are included
- [ ] Query limit considerations are noted (if applicable)
- [ ] Platform strengths are leveraged (e.g., ChatGPT's multi-step search, Gemini's plan modification)

### Execution Guidance

- [ ] Research persona/perspective is specified (if applicable)
- [ ] Special requirements are stated (bias considerations, recency, etc.)
- [ ] Follow-up strategy is outlined
- [ ] Validation approach is defined

## Quality and Usability

### Clarity and Completeness

- [ ] Prompt language is clear and unambiguous
- [ ] All placeholders and variables are replaced with actual values
- [ ] Prompt can be copy-pasted directly into platform
- [ ] No contradictory instructions exist
- [ ] Prompt is self-contained (doesn't assume unstated context)

### Practical Utility

- [ ] Execution checklist is provided (before, during, after research)
- [ ] Platform usage tips are included
- [ ] Follow-up questions are anticipated
- [ ] Success criteria are defined
- [ ] Output file format is specified

## Research Depth

### Scope Appropriateness

- [ ] Scope matches user's available time and resources
- [ ] Depth is appropriate for decision at hand
- [ ] Key questions that MUST be answered are identified
- [ ] Nice-to-have vs. critical information is distinguished

## Validation Criteria

### Quality Standards

- [ ] Method for cross-referencing sources is specified
- [ ] Approach to handling conflicting information is defined
- [ ] Confidence level indicators are requested
- [ ] Gap identification is included
- [ ] Fact vs. opinion distinction is required

---

## Issues Found

### Critical Issues

_List any critical gaps or errors that must be addressed:_

- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Minor Improvements

_List minor improvements that would enhance the prompt:_

- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

---

**Validation Complete:** ☐ Yes ☐ No
**Ready to Execute:** ☐ Yes ☐ No
**Reviewer:** \***\*\_\*\***
**Date:** \***\*\_\*\***
