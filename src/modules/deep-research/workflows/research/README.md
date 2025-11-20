# Deep Research Workflow

## Overview

The Deep Research workflow implements an enterprise-grade research system that replicates and extends Claude Desktop's Advanced Research capabilities. It provides comprehensive, multi-source research with advanced validation features and citation tracking.

## Features

- **8-Phase Research Pipeline**: Scope → Plan → Retrieve → Triangulate → Synthesize → Critique → Refine → Package
- **4 Research Modes**: Quick, Standard, Deep, and UltraDeep for different needs
- **Citation Validation**: CiteGuard system prevents hallucinated sources
- **Source Credibility Assessment**: Evaluate authority, recency, methodology, and bias
- **Parallel Retrieval**: 3-5x faster information gathering
- **Dynamic Outlining**: Structure adapts based on discovered evidence
- **Progressive Assembly**: Handle unlimited report length

## Usage

### Via Agent

Load the Research Specialist agent and trigger the workflow:

```
agent deep-research/research-specialist

*research             # Standard mode (default)
*quick-research       # Quick mode (2-5 min)
*deep-research        # Deep mode (10-20 min)
*ultra-research       # Ultra-deep mode (20-45+ min)
```

### Direct Workflow

```bash
workflow deep-research/research --data=/path/to/context.md
```

### With Research Context

Create a context file specifying:
- Research question
- Specific angles of interest
- Target audience
- Time/depth preferences

## Research Modes

| Mode | Duration | Sources | Verification | Best For |
|------|----------|---------|--------------|----------|
| **Quick** | 2-5 min | 2-5 | Basic fact-checking | Initial exploration |
| **Standard** | 5-10 min | 15-30 | Multi-source comparison | Most research needs |
| **Deep** | 10-20 min | 30+ | 3+ sources per claim | Important decisions |
| **UltraDeep** | 20-45+ min | 50+ | Maximum rigor | Enterprise analysis |

## Quality Standards

### Citations
- Every factual claim must cite a specific source immediately
- Format: "According to [1], finding..."
- No vague attributions like "studies show"
- Complete bibliography (no truncation)

### Source Diversity
- Minimum 10+ distinct sources (Standard mode)
- Multiple source types: academic, industry, news, official data
- Credibility assessment for each source
- Bias evaluation and documentation

### Verification
- Major claims: 3+ source verification
- Statistics: Cross-checked across sources
- Contradictions: Documented and analyzed
- Confidence levels: Explicitly stated

## Output Structure

Reports include:
- **Executive Summary** (under 250 words)
- **Introduction** (scope, methodology, context)
- **Main Findings** (themed sections with citations)
- **Synthesis & Analysis** (patterns and implications)
- **Limitations & Gaps** (explicit acknowledgment)
- **Recommendations** (actionable insights)
- **Complete Bibliography** (all sources cited)
- **Methodology Appendix** (process transparency)

## Best Practices

1. **Start Broad**: Begin with general searches, narrow based on findings
2. **Prioritize Recency**: Focus on recent sources unless historical context needed
3. **Cross-Reference**: Verify statistics across multiple sources
4. **Assess Credibility**: Evaluate author/publisher authority and bias
5. **Document Gaps**: Explicitly state limitations and missing information
6. **Cite Immediately**: Add citations right after claims
7. **Save Progress**: Use incremental file writing for long reports

## Anti-Hallucination Safeguards

1. No citation without actual source
2. Explicit attribution with source names
3. Complete bibliography entries
4. Confidence level markers
5. Explicit gap acknowledgment

## Example Research Questions

- "What are the latest trends in quantum computing commercialization?"
- "Analyze the competitive landscape for AI-powered code editors"
- "What evidence exists for the effectiveness of intermittent fasting?"
- "How has remote work impacted software development productivity?"
- "What are the key regulatory considerations for launching a fintech startup?"

## Files

- `workflow.yaml` - Workflow configuration
- `instructions.md` - Detailed research protocol
- `template.md` - Output format template
- `research-modes.csv` - Mode specifications
- `README.md` - This documentation

## Integration

Works seamlessly with:
- **BMM** - Research for project planning
- **CIS** - Enhanced creative research
- **BMB** - Building research-enhanced agents
- **Custom Modules** - Specialized domain research

---

*Part of the BMad Deep Research module - Enterprise-grade intelligence gathering for AI collaboration.*
