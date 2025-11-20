# Deep Research Module

**Universal AI Research System** - Works with ANY AI model (ChatGPT, Claude, Gemini, etc.)

Enterprise-grade research automation with multi-source verification, citation validation, and credibility assessment. **Adapts intelligently** to your AI model's capabilities - whether it has web search or not.

## Table of Contents

- [Model Compatibility](#model-compatibility)
- [Core Capabilities](#core-capabilities)
- [Specialized Agents](#specialized-agents)
- [Research Workflows](#research-workflows)
- [Quick Start](#quick-start)
- [Research Modes](#research-modes)
- [Key Features](#key-features)
- [Quality Standards](#quality-standards)
- [Configuration](#configuration)

## Model Compatibility

✅ **Works with ALL AI models:**

| AI Model | Mode | Capability |
|----------|------|------------|
| **Claude Code** | Automated | Full web search + real-time research |
| **ChatGPT Plus** (with browsing) | Automated | Full web search + real-time research |
| **Gemini** (with search) | Automated | Full web search + real-time research |
| **ChatGPT** (standard) | Guided | User-assisted research with AI synthesis |
| **Claude** (standard) | Guided | User-assisted research with AI synthesis |
| **Gemini** (standard) | Guided | User-assisted research with AI synthesis |
| **Any AI** | Hybrid | Training knowledge + user sources |

### Three Operational Modes

1. **Automated Mode** ⚡
   - AI has web search capabilities
   - Automatic source gathering and analysis
   - Fast, autonomous research

2. **Guided Mode** 🤝
   - AI lacks web search
   - AI guides user through finding sources
   - User provides sources, AI synthesizes
   - Still produces professional research reports

3. **Hybrid Mode** 🔄
   - Combines AI training knowledge
   - User-provided current sources
   - Best of both worlds

## Core Capabilities

The Deep Research module provides a comprehensive 8-phase research pipeline that produces citation-backed reports with rigorous validation:

1. **Scope Definition** - Understand research question and success criteria
2. **Research Planning** - Design search strategy and source priorities
3. **Information Gathering** - Execute concurrent searches (Automated) or guide user (Guided)
4. **Triangulation & Validation** - Cross-verify facts with CiteGuard
5. **Outline Evolution** - Dynamic structure adapting to evidence
6. **Synthesis** - Narrative-driven composition with embedded citations
7. **Critical Review** - Challenge assumptions and identify gaps
8. **Final Packaging** - Professional deliverables with full methodology

## Specialized Agents

[View detailed agent descriptions →](./agents/README.md)

### Dr. Morgan - Elite Research Specialist (Model-Agnostic)

**Master Research Orchestrator** with 15+ years of experience conducting comprehensive multi-source investigations. Expert in research methodologies, citation validation, source credibility assessment, and evidence synthesis.

**Adapts to any AI model** - Whether with web search (Automated Mode), without (Guided Mode), or hybrid approaches. Seamlessly works in ChatGPT, Claude, Gemini, and all other AI models.

**Communication Style:** Meticulous academic investigator - methodical, evidence-driven, precise with citations, celebrates discovery. Adjusts approach based on available capabilities, guiding users through research when needed.

## Research Workflows

[View workflow documentation →](./workflows/research/README.md)

### Deep Research Workflow

The flagship workflow implementing enterprise-grade research:

- **8-Phase Pipeline**: Systematic research execution
- **4 Research Modes**: Quick, Standard, Deep, UltraDeep
- **Citation Management**: Automatic tracking and validation
- **Source Assessment**: Credibility scoring and bias evaluation
- **Progressive Assembly**: Unlimited report length support

## Quick Start

### For Models WITH Web Search (Claude Code, ChatGPT Plus, etc.)

#### 1. Load Research Specialist

```bash
agent deep-research/research-specialist
```

#### 2. Choose Research Mode

```bash
*research              # Standard mode (automatic web research)
*quick-research        # Quick mode (fast automatic research)
*deep-research         # Deep mode (extensive verification)
*ultra-research        # Ultra-deep mode (maximum rigor)
```

#### 3. Provide Research Question

```
User: Research the latest developments in quantum computing commercialization
Dr. Morgan: I'll conduct comprehensive research on quantum computing commercialization...
[AI automatically searches web, gathers sources, and synthesizes report]
```

### For Models WITHOUT Web Search (ChatGPT, Gemini, Standard Claude)

#### 1. Load the Module in Your AI

Copy the agent prompt from `agents/research-specialist.md` and the workflow from `workflows/research/` into your AI chat.

#### 2. Request Research in Guided Mode

```
User: Research the latest developments in quantum computing commercialization
Dr. Morgan: I'll conduct research in Guided Mode since I don't have web search.

I'll guide you through gathering sources, then synthesize them into a comprehensive report.

**Research Plan:**
Target: 10-15 sources
Time: 30-45 minutes

**Please search for and provide:**
1. Search Google Scholar for "quantum computing commercialization 2024"
2. Search news sites for "quantum computing companies funding 2024"
3. Check industry reports from Gartner or IDC

For each source, please provide: title, URL, date, and key findings
```

#### 3. Provide Sources

```
User: [Pastes source information]

Dr. Morgan: Great! I notice we need more data on market size.
Could you also search for "quantum computing market forecast"?

[After sufficient sources gathered]
Dr. Morgan: Perfect! I have enough information. Let me synthesize this into a comprehensive report...
[Produces professional research report with all citations]
```

## Research Modes

### Automated Mode (With Web Search)

| Mode | Duration | Sources | Verification | Best For |
|------|----------|---------|--------------|----------|
| **Quick** | 2-5 min | 2-5 | Basic fact-checking | Initial exploration, quick answers |
| **Standard** | 5-10 min | 15-30 | Multi-source comparison | Most general research needs |
| **Deep** | 10-20 min | 30+ | 3+ sources per claim | Important decisions, comprehensive understanding |
| **UltraDeep** | 20-45+ min | 50+ | Maximum rigor | Enterprise decisions, critical analysis |

### Guided Mode (Without Web Search)

| Mode | Duration | Target Sources | Verification | Best For |
|------|----------|----------------|--------------|----------|
| **Quick** | 15-20 min | 2-5 | Basic fact-checking | Initial exploration |
| **Standard** | 30-45 min | 10-15 | Multi-source synthesis | Most research needs |
| **Deep** | 1-2 hours | 20+ | Comprehensive verification | Important decisions |
| **UltraDeep** | 2-4 hours | 30+ | Multi-session deep dive | Enterprise critical analysis |

## Key Features

### Citation Validation (CiteGuard)
- Every factual claim must cite specific source immediately
- Format: "According to [1], finding..."
- No hallucinated or approximate citations
- Complete bibliography with no truncation

### Source Credibility Assessment
- Authority evaluation
- Recency checking
- Methodology assessment
- Bias detection and documentation
- Credibility ratings (A-D scale)

### Multi-Source Verification
- Major claims: 3+ source requirement
- Statistics: Cross-checked across sources
- Contradictions: Documented and analyzed
- Confidence levels: Explicitly stated

### Dynamic Outlining (WebWeaver)
- Structure adapts to discovered evidence
- Logical organization emerges from findings
- Flexible theme development
- Complete coverage assurance

### Progressive Assembly
- Handle reports of unlimited length
- Incremental file writing
- Section-by-section completion
- Prevents token limit issues

### Parallel Retrieval
- Concurrent search execution
- 3-5x faster information gathering
- First Finish Search patterns
- Adaptive completion

## Quality Standards

### Output Requirements
- **Executive Summary**: Under 250 words
- **Narrative Prose**: 80%+ flowing paragraphs (not bullets)
- **Citations**: Every claim sourced immediately
- **Bibliography**: Complete with URLs and dates
- **Limitations**: Explicit acknowledgment of gaps
- **Methodology**: Transparent process documentation

### Anti-Hallucination Safeguards
1. No citation without actual source
2. Explicit attribution with source names
3. Complete bibliography entries (no "..." or ranges)
4. Confidence level markers
5. Explicit gap acknowledgment

### Source Diversity
- Minimum 10+ distinct sources (Standard mode)
- Multiple types: academic, industry, news, official data
- Credibility assessment for each source
- Bias evaluation and documentation

## Configuration

Edit `/deep-research/config.yaml`:

```yaml
# Default research mode
default_research_mode: "standard"  # quick, standard, deep, ultra

# Output configuration
output_folder: "{{output_folder}}/research"

# Quality standards
executive_summary_max_words: 250
narrative_prose_ratio: 0.8
strict_citation_validation: true

# Output formats
generate_markdown: true
generate_html: false
generate_pdf: false
```

## Module Structure

```
deep-research/
├── agents/                  # Research specialist agents
│   ├── research-specialist.agent.yaml
│   └── README.md
├── workflows/               # Research workflows
│   └── research/
│       ├── workflow.yaml
│       ├── instructions.md
│       ├── template.md
│       ├── research-modes.csv
│       └── README.md
├── teams/                   # Agent team configurations
│   ├── default-party.csv
│   └── research-team.yaml
├── _module-installer/       # Installation configuration
│   └── install-config.yaml
├── config.yaml             # Module configuration
└── README.md               # This file
```

## Integration Points

Deep Research integrates seamlessly with:

- **BMM** - Research for product planning, technical specifications
- **CIS** - Enhanced creative and innovation research
- **Content Creator** - Research-backed content creation
- **Career Coach** - Industry and role research
- **Marketing Ops** - Market research and competitive analysis
- **Custom Modules** - Specialized domain research

## Use Cases

### Business Intelligence
- Market research and sizing
- Competitive landscape analysis
- Industry trend investigation
- Due diligence research

### Product Development
- User research and needs analysis
- Technology evaluation
- Feature validation
- Market positioning

### Content Creation
- Fact-checking and verification
- Background research
- Expert source identification
- Topic exploration

### Academic & Scientific
- Literature reviews
- State-of-the-art surveys
- Citation tracking
- Methodology research

### Strategic Planning
- Technology trend analysis
- Best practice research
- Risk assessment
- Opportunity identification

## Best Practices

### Research Preparation
1. **Define clear questions** - Specific scope yields better results
2. **Choose appropriate mode** - Match depth to decision importance
3. **Provide context** - Background information improves relevance
4. **Set expectations** - Understand time/depth tradeoffs

### During Research
1. **Trust the process** - Let the 8-phase pipeline work
2. **Review progress** - Check phase transition updates
3. **Note discoveries** - Pay attention to interesting findings
4. **Ask questions** - Clarify scope or direction as needed

### After Research
1. **Review sources** - Check credibility assessments in appendix
2. **Verify citations** - Spot-check key claims and sources
3. **Acknowledge limitations** - Understand gaps and constraints
4. **Follow up strategically** - Dive deeper on specific areas

## Example Research Questions

- "What are the latest trends in quantum computing commercialization?"
- "Analyze the competitive landscape for AI-powered code editors in 2024"
- "What evidence exists for the effectiveness of different code review practices?"
- "How has remote work impacted software development team productivity?"
- "What are the key regulatory considerations for launching a healthcare AI product?"
- "Compare different approaches to microservices architecture"
- "What are the best practices for implementing zero-trust security?"

## Quality Assurance

Every research report includes:

✓ Executive summary under 250 words
✓ Minimum source requirements met for chosen mode
✓ Every major claim cited immediately
✓ Statistics cross-verified across sources
✓ Source credibility assessed and documented
✓ Limitations explicitly acknowledged
✓ Complete bibliography with no gaps
✓ Methodology transparently documented
✓ Professional narrative style (80%+ prose)
✓ Actionable recommendations provided

## Related Documentation

- **[Research Workflow Guide](./workflows/research/README.md)** - Detailed workflow instructions
- **[Agent Personas](./agents/README.md)** - Full agent descriptions
- **[BMM Integration](../bmm/README.md)** - Development workflow connection
- **[CIS Integration](../cis/README.md)** - Creative research workflows

## Version History

- **v1.0.0** - Initial release
  - 8-phase research pipeline
  - 4 research modes (Quick, Standard, Deep, UltraDeep)
  - CiteGuard citation validation
  - Source credibility assessment
  - Progressive assembly support
  - Integration with BMad Core

## Contributing

To enhance the Deep Research module:

1. Study existing patterns in `workflows/research/`
2. Follow BMad module conventions
3. Test thoroughly with various research questions
4. Document changes in workflow README
5. Update module README with new capabilities

## License

Part of BMad Method - See main repository LICENSE

---

**Deep Research Module** - Enterprise-grade intelligence gathering for AI collaboration.

*"Quality research takes time. Every verified fact builds trust. Every acknowledged limitation demonstrates integrity."*

---

<p align="center">
  <sub>Built with ❤️ for the human-AI research community</sub>
</p>
