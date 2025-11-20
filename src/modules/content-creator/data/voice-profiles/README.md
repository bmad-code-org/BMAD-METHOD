# Voice Profiles Directory

This directory contains your custom voice profiles created through the voice profiling system.

## What is a Voice Profile?

A voice profile is a comprehensive analysis of your unique writing style, including:
- Sentence structure patterns
- Vocabulary preferences
- Tone and personality characteristics
- Rhetorical devices usage
- Platform-specific adaptations
- Style guidelines and templates

## Creating Your First Voice Profile

1. **Gather Writing Samples**
   - Collect 3-5 pieces of your recent writing
   - Include variety: blog posts, social media, newsletters
   - Aim for 1500-3000+ total words

2. **Build Voice Profile**
   ```
   Load Content Writer agent
   Run: *build-voice-profile
   ```

3. **Follow the Workflow**
   - Provide writing samples
   - Answer questions about your style
   - Review generated profile
   - Validate and approve

## File Structure

Each voice profile consists of:
- `voice-profile-{name}-{date}.md` - Complete profile document
- `quick-ref-{name}.md` - One-page quick reference
- `analysis-data-{name}.json` - Raw analysis data (optional)

## Using Your Voice Profile

When creating content:
```
Load Content Writer agent
Run: *write

When prompted, reference your voice profile:
"Use my professional voice profile"
Profile location: {path to profile}
```

## Training Your Voice

As your writing evolves, train your voice profile:

```
Load Content Writer or Voice Matcher agent
Run: *train-voice
Select profile to update
Provide new writing samples
```

Recommended training frequency: Every 3-6 months or after 10+ new pieces

## Multiple Profiles

You can create different voice profiles for different contexts:
- **Professional** - Business content, LinkedIn, formal communications
- **Casual** - Blog posts, personal newsletters
- **Technical** - Technical documentation, tutorials
- **Creative** - Storytelling, creative writing

Each profile can have platform-specific variations.

## Voice Profile Versions

Profiles are versioned as they evolve:
- `v1.0` - Initial profile
- `v1.1` - Minor updates (added samples)
- `v2.0` - Major evolution (significant style changes)

Previous versions are archived in `archive/` subdirectory.

## Best Practices

### Creating Profiles
- **Use Recent Samples** - Last 6-12 months for current voice
- **Show Variety** - Different topics and contexts
- **Sufficient Length** - 200-500+ words per sample
- **Authentic Voice** - Published or near-final content

### Training Profiles
- **Regular Updates** - Every 3-6 months
- **Trigger Updates** - When style significantly evolves
- **Platform Expansion** - When adding new platforms
- **Quality Feedback** - When generated content doesn't match

### Using Profiles
- **Explicit Reference** - Always reference specific profile
- **Validate Output** - Check generated content matches voice
- **Iterate** - Refine profile based on results
- **Document Evolution** - Note when and why updates made

## Troubleshooting

### Voice Profile Not Matching
**Problem:** Generated content doesn't sound like you
**Solutions:**
- Add more recent writing samples
- Ensure samples are authentic (not AI-generated)
- Update profile with current writing style
- Validate writing examples are representative

### Inconsistent Results
**Problem:** Sometimes matches, sometimes doesn't
**Solutions:**
- Check if you have sufficient samples (3-5 minimum)
- Ensure samples represent consistent voice
- Consider creating separate profiles for different contexts
- Re-run style analyzer on problematic outputs

### Profile Too Rigid
**Problem:** Generated content feels constrained
**Solutions:**
- Review and relax overly strict guidelines
- Add examples showing acceptable variation
- Update profile to allow more flexibility
- Consider voice should enhance, not constrain

## Advanced Features

### Context Variations
Create sub-profiles for specific contexts:
- LinkedIn-specific voice
- Newsletter-specific voice
- Twitter-specific voice

These inherit from main profile but add platform optimizations.

### Style Guide Integration
Combine voice profile with style guide:
```
*create-style-guide
Base on voice profile: {profile path}
```

This creates comprehensive writing guidelines.

### Voice Evolution Tracking
Track how your voice evolves:
- Compare v1.0 vs v2.0 profiles
- Document intentional shifts
- Archive historical profiles
- Analyze voice maturation

## Support

For issues or questions about voice profiles:
- Review main module README
- Check voice profile template
- Run `*analyze-style` on your samples
- Use `*party-mode` to consult with Voice Matcher agent

---

**Your voice is unique. These profiles ensure AI-generated content maintains your authentic style.**
