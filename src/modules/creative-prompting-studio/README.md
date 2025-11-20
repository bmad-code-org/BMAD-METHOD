# Creative AI Prompting Studio

**Master prompt engineering for Perplexity research, Sora video generation, Suno music composition, and AI image creation**

## Overview

The Creative AI Prompting Studio is a comprehensive BMAD module that transforms the art of AI prompting into a systematic, professional practice. Based on the proven frameworks from the claude-skills repository, this module provides specialized agents, structured workflows, and best practices for creating exceptional content across multiple AI creative platforms.

## What's Inside

### 🤖 Four Specialized Agents

**Perplexity Specialist** - Research and information gathering expert
- Perfect Prompt Framework (5 components)
- Informational, instructional, and interactive prompting
- Professional templates for education, product management, finance, and marketing
- Real-time data and citation optimization

**Sora Director** - AI video generation cinematographer
- Cinematic prompting with technical precision
- Camera, lighting, and composition expertise
- Action beats and visual storytelling
- Style anchors and remix strategies

**Suno Composer** - AI music composition producer
- Four Pillars Framework (genre, mood, instrumentation, structure)
- Instrumental-only configuration mastery
- Meta tags and advanced settings optimization
- Genre-specific templates and quality enhancement

**Image Prompter** - Multi-platform AI image generation expert
- Five essential templates (photorealistic, stylized, logos, mockups, minimalist)
- Scene description over keyword listing
- Platform-specific optimization (Gemini, DALL-E, Midjourney, SD)
- Iterative refinement strategies

### 📋 Five Comprehensive Workflows

**Research Workflow** - Perplexity prompting for information gathering
- Perfect Prompt Framework application
- Professional templates and use cases
- Citation and source verification
- Quality checklist and iteration

**Video Creation Workflow** - Sora 2 cinematic prompting
- Cinematographic element breakdown
- Technical parameter configuration
- Detail level selection
- Remix and iteration strategies

**Music Composition Workflow** - Suno instrumental creation
- Four Pillars Framework implementation
- Instrumental-only activation methods
- Meta tags and structure
- Advanced settings optimization

**Image Generation Workflow** - AI image prompting across platforms
- Template selection and scene description
- Visual specificity and detail
- Platform optimization
- Progressive iteration

**Multi-Modal Content Creation** - Integrated project workflow
- Research foundation → Creative direction → Assets
- Cross-platform consistency
- Synchronized video and music
- Complete content packages

### 📚 Professional Resources

**Data & Guides**
- Perplexity Perfect Prompt Guide
- Sora 2 Cinematography Techniques
- Suno Instrumental Composition Guide
- Image Prompting Best Practices
- Cross-platform optimization tips

**Templates**
- Research brief templates
- Video scene templates
- Music composition briefs
- Image generation templates
- Multi-modal project structures

## Quick Start

### Installation

The Creative AI Prompting Studio module is installed via the BMAD installer:

```bash
npx bmad-method@alpha install
```

Select "Creative AI Prompting Studio" during module selection.

### Configuration

During installation, you'll configure:
- **Output folder**: Where prompts and projects are saved
- **Primary tools**: Which AI platforms you use
- **Content focus**: Your main content creation type
- **Prompt detail preference**: How detailed prompts should be
- **Default settings**: Video duration, music length, research depth

### First Steps

1. **Load an agent** based on your immediate need:
   - Perplexity Specialist for research
   - Sora Director for video
   - Suno Composer for music
   - Image Prompter for visuals

2. **Run a workflow** to create your first prompt:
   ```
   *research-workflow    # For Perplexity research prompts
   *video-workflow       # For Sora video prompts
   *music-workflow       # For Suno music prompts
   *image-workflow       # For AI image prompts
   *multimodal-workflow  # For integrated projects
   ```

3. **Use agent commands** for quick tasks:
   - `create-research-prompt` - Generate research prompts
   - `create-video-prompt` - Generate video prompts
   - `create-music-prompt` - Generate music prompts
   - `create-image-prompt` - Generate image prompts

## Core Concepts

### The Framework Approach

Each creative domain has a proven framework:

**Research (Perfect Prompt)**: Instruction + Context + Input + Keywords + Output Format

**Video (Cinematic Elements)**: Visual Clarity + Camera + Action + Lighting + Color + Style

**Music (Four Pillars)**: Genre + Mood + Instrumentation + Structure

**Images (Scene Description)**: Flowing narrative with specific details, not keyword lists

### Quality Over Keywords

The module emphasizes:
- **Descriptive narratives** over keyword lists
- **Specific details** over vague adjectives
- **Concrete visuals** over abstract concepts
- **Structured frameworks** over random prompting

### Iterative Refinement

All workflows support progressive improvement:
- Start with framework-based foundation
- Generate initial results
- Refine ONE element at a time
- Document successful patterns
- Build reusable prompt libraries

## Use Cases

### Content Creators
- Research trending topics with Perplexity
- Generate video content with Sora
- Create custom soundtracks with Suno
- Design graphics and visuals across platforms

### Marketing Teams
- Competitive intelligence and market research
- Video ads and promotional content
- Brand-aligned music and audio
- Multi-platform visual campaigns

### Educators
- Research and fact-checking
- Educational video content
- Instructional visuals and diagrams
- Comprehensive learning materials

### Product Teams
- User research and competitive analysis
- Product demo videos
- Marketing assets and mockups
- Launch campaign materials

### Creative Professionals
- Multi-modal art projects
- Experimental video and music
- Concept visualization
- Portfolio content creation

## Module Structure

```
creative-prompting-studio/
├── agents/
│   ├── perplexity-specialist.md
│   ├── sora-director.md
│   ├── suno-composer.md
│   └── image-prompter.md
├── workflows/
│   ├── research-workflow/
│   ├── video-workflow/
│   ├── music-workflow/
│   ├── image-workflow/
│   └── multimodal-workflow/
├── tasks/
│   └── [Reusable task components]
├── templates/
│   └── [Prompt templates for each domain]
├── data/
│   └── [Comprehensive guides and best practices]
└── _module-installer/
    └── install-config.yaml
```

## Configuration Reference

### User Configuration Variables

These are set during installation and available in all agents:

- `{{prompts_output_folder}}` - Base output directory
- `{{primary_creative_tools}}` - Your main AI platforms
- `{{content_creation_focus}}` - Primary content type
- `{{prompt_detail_preference}}` - Detail level (minimal/balanced/detailed/ultra-detailed)
- `{{research_depth}}` - Research comprehensiveness
- `{{video_default_duration}}` - Default video length (4/8/12 seconds)
- `{{music_default_length}}` - Default music duration
- `{{default_music_tempo}}` - Starting BPM
- `{{default_style_influence}}` - Suno style adherence
- `{{default_weirdness_level}}` - Suno creativity level
- `{{default_image_aspect_ratio}}` - Image dimensions

### Output Folders

Organized by content type:
- `{{research_prompts_folder}}` - Perplexity research
- `{{video_prompts_folder}}` - Sora video
- `{{music_prompts_folder}}` - Suno music
- `{{image_prompts_folder}}` - Image generation
- `{{multimodal_projects_folder}}` - Integrated projects

## Best Practices

### General Principles

1. **Framework First**: Always apply the relevant framework
2. **Specificity Wins**: Replace vague terms with concrete details
3. **Iterate Deliberately**: One element at a time
4. **Document Success**: Save effective prompts for reuse
5. **Think Holistically**: Consider how pieces work together

### Platform-Specific

**Perplexity**:
- Request citations and verified sources
- Leverage real-time capabilities
- Define output format clearly
- Specify appropriate depth

**Sora**:
- Be cinematically precise
- Match action to duration
- Use style anchors
- Remix for refinement

**Suno**:
- Exclude vocals explicitly
- Use meta tags for structure
- Keep Weirdness 40-60%
- Remaster strategically (1-2 passes)

**Image Generation**:
- Describe scenes, not keyword lists
- Name 3-5 specific colors
- Keep text under 25 characters
- Optimize for target platform

## Integration with BMAD

The Creative AI Prompting Studio integrates seamlessly with other BMAD modules:

- **BMad Method (BMM)**: Use research for product planning, video for demos
- **Content Creator**: Leverage image and video assets
- **Marketing Ops**: Research and creative assets for campaigns
- **Creative Intelligence Suite (CIS)**: Brainstorm before prompting

## Learning Path

### Beginner
1. Start with single-domain workflows (research OR video OR music OR images)
2. Use agent commands with default settings
3. Follow framework checklists carefully
4. Experiment with templates

### Intermediate
3. Combine multiple domains in multi-modal workflow
4. Customize prompt detail levels
5. Develop personal prompt libraries
6. Master platform-specific optimizations

### Advanced
7. Create custom workflows for specific use cases
8. Build systematic prompt refinement processes
9. Develop cross-platform consistency strategies
10. Contribute improvements back to frameworks

## Credits & Inspiration

This BMAD module is based on the excellent work from the [claude-skills repository](https://github.com/saren-ai/claude-skills) by saren-ai, which provides comprehensive prompt engineering frameworks for creative AI tools. We've transformed their guides into a structured, workflow-driven BMAD module with specialized agents and systematic processes.

**Original Guides**:
- Perplexity Perfect Prompt Guide
- Sora 2 Prompting Guide
- Suno Instrumental Music Guide
- Gemini Image Prompt Guide

**BMAD Enhancements**:
- Specialized AI agents for each domain
- Structured multi-step workflows
- Cross-platform integration
- Multi-modal project orchestration
- Configuration-driven customization
- Comprehensive documentation

## Support & Resources

### Within This Module
- Agent documentation (see agents/ folder)
- Workflow guides (see workflows/ folder)
- Complete guides (see data/ folder)
- Templates (see templates/ folder)

### External Resources
- [claude-skills Repository](https://github.com/saren-ai/claude-skills) - Original frameworks
- [BMAD Method Documentation](../../bmm/docs/README.md) - BMAD framework
- [BMad Builder](../../bmb/README.md) - Create custom modules

### Getting Help
- Review workflow documentation for step-by-step guidance
- Check agent commands for quick tasks
- Reference data guides for comprehensive frameworks
- Consult templates for starting points

## Version History

**v1.0.0** - Initial Release
- Four specialized agents (Perplexity, Sora, Suno, Image)
- Five comprehensive workflows
- Complete frameworks from claude-skills
- Multi-modal project orchestration
- Professional templates and guides

---

**Transform your AI creative workflow with systematic, professional prompt engineering across all major platforms.**

*Part of the BMAD Method v6 ecosystem - Build More, Architect Dreams*
