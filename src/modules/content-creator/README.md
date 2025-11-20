# Content Creator Module

**Transform your writing workflow with AI-powered content creation across all platforms.**

The Content Creator module is a comprehensive content creation suite that learns your unique voice and automatically adapts your ideas for multiple platforms. From initial research to multi-platform publication, streamline your entire content workflow with specialized AI agents and proven workflows.

## 🎯 What It Does

- **📝 Custom Voice & Style System** - Build comprehensive voice profiles from your writing samples with deep style analysis
- **🎭 Learns Your Voice** - Advanced voice profiling that captures sentence patterns, vocabulary, tone, and unique expressions
- **📚 Style Guide Creation** - Generate complete style guides combining voice profile, brand guidelines, and platform rules
- **🔄 Voice Training** - Continuously refine your voice profile as your writing evolves
- **🌐 Multi-Platform Publishing** - Automatically repurposes content for Blog, LinkedIn, Newsletter, Twitter, and more
- **🔍 Research Integration** - Checks your curated sources first, finds trends, and surfaces unique angles
- **✅ Quality Assurance** - Built-in quality checks for readability, SEO, engagement, and voice consistency
- **⚡ Complete Pipeline** - From raw notes to published content in minutes, not hours

## ✨ Key Features

### 8 Specialized Agents

1. **Casey - Content Writer** - Your main content creation orchestrator
2. **Alex - Content Analyzer** - Quality and SEO analysis expert
3. **Riley - Research Aggregator** - Research and trend analysis specialist
4. **Vicki - Voice Matcher** - Voice consistency and brand alignment guardian
5. **Lauren - LinkedIn Repurposer** - Professional networking content expert
6. **Nina - Newsletter Repurposer** - Email content and subscriber engagement specialist
7. **Charlie - Conversational Repurposer** - Social media and conversational content expert
8. **Sam - SEO Optimizer** - Search engine optimization specialist

### 8 Core Workflows

**Content Creation:**
1. **Article Pipeline** - Complete article creation from research to multi-platform publish
2. **Research Topic** - Deep research with trend analysis and unique angles
3. **Extract Themes** - Pattern recognition from raw notes and ideas
4. **Quick Post** - Fast social media and short-form content creation
5. **Optimize Content** - Improve existing content for SEO and engagement

**Voice & Style System:**
6. **Build Voice Profile** - Create comprehensive voice profile from writing samples
7. **Train Voice** - Refine and update voice profile with new samples
8. **Create Style Guide** - Generate complete custom style guide

### Advanced Voice & Style Features

- **🎯 Voice Profiling** - Deep analysis of sentence structure, vocabulary, tone, and rhetorical devices
- **📊 Style Analysis** - Quantitative and qualitative analysis of writing patterns
- **🔄 Voice Training** - Continuous learning and refinement as your writing evolves
- **📖 Style Guides** - Comprehensive guidelines combining voice, brand, and platform rules
- **✅ Voice Validation** - Similarity scoring to ensure AI content matches your authentic voice
- **🎨 Context Variations** - Different voice profiles for different platforms and audiences

### Intelligent Content Operations

- **Platform Optimization** - Automatic adaptation for each platform's best practices
- **SEO Integration** - Built-in keyword optimization and search visibility
- **Quality Gates** - Automated quality checks before publishing
- **Research Intelligence** - Priority source checking and trend surfacing

## 🚀 Quick Start

### 1. Install the Module

```bash
npx bmad-method@alpha install
```

Select "Content Creator" during module selection.

### 2. Configure Your Settings

During installation, you'll configure:
- Content output folder
- Default writing style
- Target platforms (Blog, LinkedIn, Newsletter, Twitter, etc.)
- SEO optimization preferences
- Readability targets
- Quality control settings

### 3. Build Your Voice Profile (New!)

**Option A: Quick Setup**
After installation, add writing samples to `.bmad/content-creator/data/writing-examples.md`

**Option B: Advanced Voice Profiling (Recommended)**
```
Load Content Writer agent
Run: *build-voice-profile

Provide 3-5 writing samples (1500+ words total)
Answer questions about your style
Review and approve generated profile
```

This creates a comprehensive voice profile with:
- Detailed sentence structure analysis
- Vocabulary and tone characteristics
- Rhetorical device patterns
- Platform-specific adaptations
- Style guidelines and templates

### 4. Setup Reference Materials

Update these files in `.bmad/content-creator/data/`:

**Required:**
- `research-sources.md` - List your trusted research sources

**Optional but Recommended:**
- `brand-guidelines.md` - Define your brand voice and style guidelines
- `seo-keywords.md` - Add your target keywords and phrases

### 5. Start Creating Content

Load the Content Writer agent and try these commands:

**Content Creation:**
```
*write              # Complete article pipeline
*research           # Deep research on a topic
*extract-themes     # Analyze raw notes for patterns
*quick-post         # Fast social media content
*optimize           # Improve existing content
```

**Voice & Style:**
```
*build-voice-profile  # Create comprehensive voice profile
*train-voice          # Update profile with new samples
*analyze-style        # Deep style analysis
*create-style-guide   # Generate custom style guide
```

## 📖 Usage Examples

### Example 1: Complete Article Pipeline

```
*write

Topic: "The Future of Remote Work"
Target keyword: "remote work trends 2025"
Audience: Business leaders
Goal: Educate and inform
```

**Result:** Creates:
- Main article (1200-1500 words)
- LinkedIn professional post
- Newsletter version with subject lines
- Twitter thread (5-8 tweets)
- Research brief
- Quality and SEO reports

### Example 2: Research Topic

```
*research

Topic: "AI in Content Creation"
```

**Result:** Research brief with:
- 5-7 key insights with sources
- 3-5 current data points
- 2-3 unique angles
- Emerging trends
- Content recommendations

### Example 3: Extract Themes from Notes

```
*extract-themes
```

**Result:** Theme analysis report:
- Major themes identified from your raw notes
- Content opportunities ranked by potential
- Recommended article topics
- Series ideas

### Example 4: Quick Social Post

```
*quick-post

Platform: LinkedIn
Topic: Quick insight about AI productivity
Style: Professional but personal
```

**Result:** Optimized LinkedIn post ready to publish

## 🎨 Customization

### Voice Profile

Update `data/writing-examples.md` with your writing samples. The AI will analyze:
- Sentence structure patterns
- Vocabulary level
- Use of humor and metaphors
- Formality level
- Rhetorical devices

### Research Sources

Customize `data/research-sources.md` with your trusted sources:
- Industry publications
- Expert thought leaders
- Data sources
- Academic journals

### SEO Keywords

Define target keywords in `data/seo-keywords.md`:
- Primary keywords by topic
- Long-tail variations
- Semantic keywords
- Competitor keywords

### Brand Guidelines

Set brand standards in `data/brand-guidelines.md`:
- Brand voice and tone
- Writing style preferences
- Language guidelines
- Platform-specific guidelines

## 🔧 Agent Reference

### Casey - Content Writer

**Main orchestrator for content creation**

Commands:
- `*write` - Complete article pipeline
- `*research` - Deep topic research
- `*extract-themes` - Analyze raw notes
- `*quick-post` - Fast social content
- `*optimize` - Improve existing content
- `*analyze` - Content analysis
- `*quality-check` - Quality validation

### Alex - Content Analyzer

**Quality and SEO expert**

Commands:
- `*analyze` - Comprehensive 5-dimension analysis
- `*seo-check` - Deep SEO analysis
- `*readability` - Readability assessment
- `*quick-check` - Fast quality check

### Riley - Research Aggregator

**Research and trends**

Commands:
- `*research` - Deep research workflow
- `*extract-themes` - Pattern extraction
- `*quick-research` - Fast research brief
- `*trend-analysis` - Trend identification

### Vicki - Voice Matcher

**Voice consistency guardian**

Commands:
- `*check-voice` - Voice consistency check
- `*analyze-style` - Style pattern analysis
- `*optimize-voice` - Voice optimization
- `*update-profile` - Update voice profile

### Lauren - LinkedIn Repurposer

**Professional content expert**

Commands:
- `*repurpose-linkedin` - Transform to LinkedIn
- `*linkedin-post` - Create LinkedIn post
- `*optimize-linkedin` - Optimize for engagement

### Nina - Newsletter Repurposer

**Email content specialist**

Commands:
- `*repurpose-newsletter` - Transform to newsletter
- `*newsletter-create` - Create newsletter issue
- `*subject-lines` - Generate subject lines

### Charlie - Conversational Repurposer

**Social media expert**

Commands:
- `*repurpose-social` - Transform to social
- `*twitter-thread` - Create Twitter thread
- `*podcast-script` - Create podcast segment
- `*social-post` - Create social post

### Sam - SEO Optimizer

**Search optimization**

Commands:
- `*optimize-seo` - Full SEO optimization
- `*keyword-research` - Keyword suggestions
- `*meta-optimize` - Meta tag optimization
- `*seo-audit` - Comprehensive audit

## 📊 Workflow Details

### Article Pipeline Workflow

**Duration:** 10-15 minutes

**Steps:**
1. Research & Topic Development
2. Article Outline Creation
3. Article Drafting with Voice Matching
4. SEO Optimization (if enabled)
5. Quality Validation (must score ≥70)
6. Multi-Platform Repurposing
7. Publishing Preparation
8. Workflow Summary

**Outputs:**
- Main article
- LinkedIn version
- Newsletter version
- Social media versions
- Research brief
- Quality report
- SEO report

### Research Topic Workflow

**Duration:** 5-10 minutes

**Process:**
- Topic definition and scope
- Priority source checking
- Trend analysis
- Data gathering
- Unique angle discovery
- Research brief synthesis

**Output:** Comprehensive research brief ready for writing

### Extract Themes Workflow

**Duration:** 5-10 minutes

**Process:**
- Gather raw notes
- Pattern recognition
- Theme categorization
- Unique angle discovery
- Content opportunity identification

**Output:** Theme analysis with prioritized content opportunities

## 📁 File Organization

Content is organized in your output folder:

```
{content_output_folder}/
├── drafts/              # Work-in-progress content
│   ├── article-*.md
│   ├── linkedin-*.md
│   ├── newsletter-*.md
│   └── social-*.md
├── published/           # Published content archive
├── research/            # Research briefs and reports
│   ├── research-*.md
│   ├── themes-*.md
│   ├── quality-*.md
│   └── seo-*.md
├── rawnotes/           # Unstructured ideas and notes
└── archive/            # Archived content (30+ days)
```

## 🎯 Best Practices

### Voice Profile Setup

1. **Use Real Writing Samples** - 3-5 pieces of content you've actually written
2. **Show Range** - Include different formats (blog, social, newsletter)
3. **Recent Content** - Use recent samples that represent your current voice
4. **Sufficient Length** - Each sample should be 200-300+ words

### Research Sources

1. **Prioritize Your List** - Put most trusted sources at the top
2. **Keep Updated** - Review and update quarterly
3. **Be Specific** - Note why each source is valuable
4. **Include Variety** - Mix news, data, thought leaders, and academic sources

### Content Creation

1. **Start with Research** - Use `*research` before `*write` for best results
2. **Review Voice Examples** - AI will match your voice better with quality examples
3. **Iterate on Quality** - If quality score is low, revise and re-check
4. **Platform-Specific Edits** - Review each platform version before publishing

### Quality Control

1. **Set Realistic Targets** - 70+ quality score is good, 80+ is excellent
2. **Use Strict Mode Carefully** - Only enable if you want blocks on low quality
3. **Check Voice Regularly** - Update writing examples as your voice evolves
4. **Monitor SEO** - Track which keywords drive traffic

## 🔄 Integration with Other Modules

### Works Great With:

- **BMM (BMad Method)** - Use for product research and documentation
- **BMB (BMad Builder)** - Create custom content workflows
- **CIS (Creative Intelligence Suite)** - Brainstorming and ideation

## 📚 Additional Resources

- [BMAD Method Documentation](../../bmm/README.md)
- [Agent Customization Guide](../../../docs/agent-customization-guide.md)
- [Workflow Creation Guide](../bmb/workflows/create-workflow/README.md)

## 🆘 Troubleshooting

### AI Not Matching My Voice

**Solution:** Update `data/writing-examples.md` with more samples (aim for 5+) and ensure they're recent and representative.

### Quality Scores Too Low

**Solution:**
- Check readability target matches your audience
- Ensure content has clear structure
- Add more examples and data
- Review against checklist

### SEO Not Working

**Solution:**
- Verify `enable_seo_optimization: yes` in config
- Update `data/seo-keywords.md` with target keywords
- Check keyword density (target: 0.5-2.5%)

### Platform Versions Feel Off

**Solution:**
- Review writing examples for platform-specific content
- Check brand guidelines for platform-specific instructions
- Manually refine and provide feedback

## 📄 License

Part of the BMAD Method - MIT License

---

**Ready to transform your content workflow?**

Start with `*write` and experience the full power of AI-assisted content creation that maintains your authentic voice across every platform.
