# Research Workflow - Multi-Type Research System

## Overview

The Research Workflow is a comprehensive, adaptive research system that supports multiple research types through an intelligent router pattern. This workflow consolidates various research methodologies into a single, powerful tool that adapts to your specific research needs - from market analysis to technical evaluation to AI prompt generation.

**Version 2.0.0** - Multi-type research system with router-based architecture

## Key Features

### 🔀 Intelligent Research Router

- **6 Research Types**: Market, Deep Prompt, Technical, Competitive, User, Domain
- **Dynamic Instructions**: Loads appropriate instruction set based on research type
- **Adaptive Templates**: Selects optimal output format for research goal
- **Context-Aware**: Adjusts frameworks and methods per research type

### 🔍 Market Research (Type: `market`)

- Real-time web research for current market data
- TAM/SAM/SOM calculations with multiple methodologies
- Competitive landscape analysis and positioning
- Customer persona development and Jobs-to-be-Done
- Porter's Five Forces and strategic frameworks
- Go-to-market strategy recommendations

### 🤖 Deep Research Prompt Generation (Type: `deep_prompt`)

- **Optimized for AI Research Platforms**: ChatGPT Deep Research, Gemini, Grok DeepSearch, Claude Projects
- **Prompt Engineering Best Practices**: Multi-stage research workflows, iterative refinement
- **Platform-Specific Optimization**: Tailored prompts for each AI research tool
- **Context Packaging**: Structures background information for optimal AI understanding
- **Research Question Refinement**: Transforms vague questions into precise research prompts

### 🏗️ Technical/Architecture Research (Type: `technical`)

- Technology evaluation and comparison matrices
- Architecture pattern research and trade-off analysis
- Framework/library assessment with pros/cons
- Technical feasibility studies
- Cost-benefit analysis for technology decisions
- Architecture Decision Records (ADR) generation

### 🎯 Competitive Intelligence (Type: `competitive`)

- Deep competitor analysis and profiling
- Competitive positioning and gap analysis
- Strategic group mapping
- Feature comparison matrices
- Pricing strategy analysis
- Market share and growth tracking

### 👥 User Research (Type: `user`)

- Customer insights and behavioral analysis
- Persona development with demographics and psychographics
- Jobs-to-be-Done framework application
- Customer journey mapping
- Pain point identification
- Willingness-to-pay analysis

### 🌐 Domain/Industry Research (Type: `domain`)

- Industry deep dives and trend analysis
- Regulatory landscape assessment
- Domain expertise synthesis
- Best practices identification
- Standards and compliance requirements
- Emerging patterns and disruptions

## Usage

### Basic Invocation

```bash
workflow research
```

The workflow will prompt you to select a research type.

### Direct Research Type Selection

```bash
# Market research
workflow research --type market

# Deep research prompt generation
workflow research --type deep_prompt

# Technical evaluation
workflow research --type technical

# Competitive intelligence
workflow research --type competitive

# User research
workflow research --type user

# Domain analysis
workflow research --type domain
```

### With Input Documents

```bash
workflow research --type market --input product-brief.md --input competitor-list.md
workflow research --type technical --input requirements.md --input architecture.md
workflow research --type deep_prompt --input research-question.md
```

### Configuration Options

Can be customized through `workflow.yaml`:

- **research_depth**: `quick`, `standard`, or `comprehensive`
- **enable_web_research**: `true`/`false` for real-time data gathering
- **enable_competitor_analysis**: `true`/`false` (market/competitive types)
- **enable_financial_modeling**: `true`/`false` (market type)

## Workflow Structure

### Files Included

```
research/
├── workflow.yaml                  # Multi-type configuration
├── instructions-router.md         # Router logic (loads correct instructions)
├── instructions-market.md         # Market research workflow
├── instructions-deep-prompt.md    # Deep prompt generation workflow
├── instructions-technical.md      # Technical evaluation workflow
├── template-market.md             # Market research report template
├── template-deep-prompt.md        # Research prompt template
├── template-technical.md          # Technical evaluation template
├── checklist.md                   # Universal validation criteria
├── README.md                      # This file
└── claude-code/                   # Claude Code enhancements (optional)
    ├── injections.yaml            # Integration configuration
    └── sub-agents/                # Specialized research agents
        ├── bmm-market-researcher.md
        ├── bmm-trend-spotter.md
        ├── bmm-data-analyst.md
        ├── bmm-competitor-analyzer.md
        ├── bmm-user-researcher.md
        └── bmm-technical-evaluator.md
```

## Workflow Process

### Phase 1: Research Type Selection and Setup

1. Router presents research type menu
2. User selects research type (market, deep_prompt, technical, competitive, user, domain)
3. Router loads appropriate instructions and template
4. Gather research parameters and inputs

### Phase 2: Research Type-Specific Execution

**For Market Research:**

1. Define research objectives and market boundaries
2. Conduct web research across multiple sources
3. Calculate TAM/SAM/SOM with triangulation
4. Develop customer segments and personas
5. Analyze competitive landscape
6. Apply industry frameworks (Porter's Five Forces, etc.)
7. Identify trends and opportunities
8. Develop strategic recommendations
9. Create financial projections (optional)
10. Compile comprehensive report

**For Deep Prompt Generation:**

1. Analyze research question or topic
2. Identify optimal AI research platform (ChatGPT, Gemini, Grok, Claude)
3. Structure research context and background
4. Generate platform-optimized prompt
5. Create multi-stage research workflow
6. Define iteration and refinement strategy
7. Package with context documents
8. Provide execution guidance

**For Technical Research:**

1. Define technical requirements and constraints
2. Identify technologies/frameworks to evaluate
3. Research each option (documentation, community, maturity)
4. Create comparison matrix with criteria
5. Perform trade-off analysis
6. Calculate cost-benefit for each option
7. Generate Architecture Decision Record (ADR)
8. Provide recommendation with rationale

**For Competitive/User/Domain:**

- Uses market research workflow with specific focus
- Adapts questions and frameworks to research type
- Customizes output format for target audience

### Phase 3: Validation and Delivery

1. Review outputs against checklist
2. Validate completeness and quality
3. Generate final report/document
4. Provide next steps and recommendations

## Output

### Generated Files by Research Type

**Market Research:**

- `market-research-{product_name}-{date}.md`
- Comprehensive market analysis report (10+ sections)

**Deep Research Prompt:**

- `deep-research-prompt-{date}.md`
- Optimized AI research prompt with context and instructions

**Technical Research:**

- `technical-research-{date}.md`
- Technology evaluation with comparison matrix and ADR

**Competitive Intelligence:**

- `competitive-intelligence-{date}.md`
- Detailed competitor analysis and positioning

**User Research:**

- `user-research-{date}.md`
- Customer insights and persona documentation

**Domain Research:**

- `domain-research-{date}.md`
- Industry deep dive with trends and best practices

## Requirements

### All Research Types

- BMAD Core v6 project structure
- Web search capability (for real-time research)
- Access to research data sources

### Market Research

- Product or business description
- Target customer hypotheses (optional)
- Known competitors list (optional)

### Deep Prompt Research

- Research question or topic
- Background context documents (optional)
- Target AI platform preference (optional)

### Technical Research

- Technical requirements document
- Current architecture (if brownfield)
- Technical constraints list

## Best Practices

### Before Starting

1. **Know Your Research Goal**: Select the most appropriate research type
2. **Gather Context**: Collect relevant documents before starting
3. **Set Depth Level**: Choose appropriate research_depth (quick/standard/comprehensive)
4. **Define Success Criteria**: What decisions will this research inform?

### During Execution

**Market Research:**

- Provide specific product/service details
- Validate market boundaries carefully
- Review TAM/SAM/SOM assumptions
- Challenge competitive positioning

**Deep Prompt Generation:**

- Be specific about research platform target
- Provide rich context documents
- Clarify expected research outcome
- Define iteration strategy

**Technical Research:**

- List all evaluation criteria upfront
- Weight criteria by importance
- Consider long-term implications
- Include cost analysis

### After Completion

1. Review using the validation checklist
2. Update with any missing information
3. Share with stakeholders for feedback
4. Schedule follow-up research if needed
5. Document decisions made based on research

## Research Frameworks Available

### Market Research Frameworks

- TAM/SAM/SOM Analysis
- Porter's Five Forces
- Jobs-to-be-Done (JTBD)
- Technology Adoption Lifecycle
- SWOT Analysis
- Value Chain Analysis

### Technical Research Frameworks

- Trade-off Analysis Matrix
- Architecture Decision Records (ADR)
- Technology Radar
- Comparison Matrix
- Cost-Benefit Analysis
- Technical Risk Assessment

### Deep Prompt Frameworks

- ChatGPT Deep Research Best Practices
- Gemini Deep Research Framework
- Grok DeepSearch Optimization
- Claude Projects Methodology
- Iterative Prompt Refinement

## Data Sources

The workflow leverages multiple data sources:

- Industry reports and publications
- Government statistics and databases
- Financial reports and SEC filings
- News articles and press releases
- Academic research papers
- Technical documentation and RFCs
- GitHub repositories and discussions
- Stack Overflow and developer forums
- Market research firm reports
- Social media and communities
- Patent databases
- Benchmarking studies

## Claude Code Enhancements

### Available Subagents

1. **bmm-market-researcher** - Market intelligence gathering
2. **bmm-trend-spotter** - Emerging trends and weak signals
3. **bmm-data-analyst** - Quantitative analysis and modeling
4. **bmm-competitor-analyzer** - Competitive intelligence
5. **bmm-user-researcher** - Customer insights and personas
6. **bmm-technical-evaluator** - Technology assessment

These are automatically invoked during workflow execution if Claude Code integration is configured.

## Troubleshooting

### Issue: Don't know which research type to choose

- **Solution**: Start with research question - "What do I need to know?"
  - Market viability? → `market`
  - Best technology? → `technical`
  - Need AI to research deeper? → `deep_prompt`
  - Who are competitors? → `competitive`
  - Who are users? → `user`
  - Industry understanding? → `domain`

### Issue: Market research results seem incomplete

- **Solution**: Increase research_depth to `comprehensive`
- **Check**: Enable web_research in workflow.yaml
- **Try**: Run competitive and user research separately for more depth

### Issue: Deep prompt doesn't work with target platform

- **Solution**: Review platform-specific best practices in generated prompt
- **Check**: Ensure context documents are included
- **Try**: Regenerate with different platform selection

### Issue: Technical comparison is subjective

- **Solution**: Add more objective criteria (performance metrics, cost, community size)
- **Check**: Weight criteria by business importance
- **Try**: Run pilot implementations for top 2 options

## Customization

### Adding New Research Types

1. Create new instructions file: `instructions-{type}.md`
2. Create new template file: `template-{type}.md`
3. Add research type to `workflow.yaml` `research_types` section
4. Update router logic in `instructions-router.md`

### Modifying Existing Research Types

1. Edit appropriate `instructions-{type}.md` file
2. Update corresponding `template-{type}.md` if needed
3. Adjust validation criteria in `checklist.md`

### Creating Custom Frameworks

Add to `workflow.yaml` `frameworks` section under appropriate research type.

## Version History

- **v2.0.0** - Multi-type research system with router architecture
  - Added deep_prompt research type for AI research platform optimization
  - Added technical research type for technology evaluation
  - Consolidated competitive, user, domain under market with focus variants
  - Router-based instruction loading
  - Template selection by research type
  - Enhanced Claude Code subagent support

- **v1.0.0** - Initial market research only implementation
  - Single-purpose market research workflow
  - Now deprecated in favor of v2.0.0 multi-type system

## Support

For issues or questions:

- Review workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Check validation against `checklist.md`
- Examine router logic in `instructions-router.md`
- Review research type-specific instructions
- Consult BMAD Method v6 documentation

## Migration from v1.0 market-research

If you're used to the standalone `market-research` workflow:

```bash
# Old way
workflow market-research

# New way
workflow research --type market
# Or just: workflow research (then select market)
```

All market research functionality is preserved and enhanced in v2.0.0.

---

_Part of the BMad Method v6 - BMM (BMad Method) Module - Empowering systematic research and analysis_
