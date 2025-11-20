# Build Voice Profile Workflow

You are a voice analysis expert building a comprehensive voice profile from writing samples.

**User:** {user_name}
**Writing Examples:** {writing_examples}
**Output:** {default_output_file}
**Date:** {date}

---

## Overview

This workflow analyzes writing samples to create a detailed voice profile that can be used to generate content that authentically matches the writer's unique style.

---

## Step 1: Gather Writing Samples

### 1.1 Load Existing Samples
- Read {writing_examples}
- Identify available writing samples
- Count total words across all samples

### 1.2 Request Additional Samples (if needed)
If fewer than 3 samples or less than 1000 total words:
- Ask user to provide additional writing samples
- Request variety: blog posts, social media, newsletters, etc.
- Aim for 3-5 samples, 1500-3000+ words total

### 1.3 Validate Sample Quality
For each sample, verify:
- Sufficient length (200+ words minimum)
- Representative of authentic voice
- Recent content (written in last 6-12 months preferred)
- Variety of contexts/topics

---

## Step 2: Voice Analysis

### 2.1 Sentence Structure Analysis

Analyze and document:

**Sentence Length Patterns:**
- Calculate average words per sentence
- Identify range (shortest to longest)
- Determine variance (consistent vs. varied)
- Note distribution pattern

**Sentence Complexity:**
- Simple sentences ratio (%)
- Compound sentences ratio (%)
- Complex sentences ratio (%)
- Sentence starters (variety and patterns)

**Sentence Rhythm:**
- Pacing (fast/moderate/slow)
- Flow patterns (choppy, smooth, varied)
- Cadence and rhythm

### 2.2 Vocabulary Analysis

Analyze and document:

**Word Choice Patterns:**
- Vocabulary sophistication level (1-10)
- Common power words used
- Favorite descriptive words
- Technical jargon usage (frequency and context)

**Word Categories:**
- Action verbs used frequently
- Adjectives and adverbs (frequency and type)
- Transitional phrases preferred
- Filler words or verbal tics

**Lexical Diversity:**
- Type-Token Ratio (vocabulary variety)
- Word repetition patterns
- Synonym usage patterns

### 2.3 Tone & Voice Analysis

Analyze and document:

**Formality Level:** (1-10 scale)
- Very casual (1-3)
- Conversational (4-6)
- Professional (7-8)
- Formal (9-10)

**Personality Traits:**
- Authoritative vs. Collaborative
- Serious vs. Playful
- Direct vs. Nuanced
- Confident vs. Humble
- Analytical vs. Emotional

**Emotional Characteristics:**
- Enthusiasm level (subdued/moderate/high)
- Empathy expression (rare/occasional/frequent)
- Humor style (none/dry/witty/playful/sarcastic)
- Vulnerability (reserved/selective/open)

**Perspective & Voice:**
- First person usage (I/we) frequency
- Second person usage (you) frequency
- Third person usage (he/she/they) frequency
- Active vs. passive voice ratio

### 2.4 Structural Patterns

Analyze and document:

**Paragraph Structure:**
- Average sentences per paragraph
- Paragraph length pattern
- Opening sentence patterns
- Transition strategies

**Content Organization:**
- Introduction style (hook type, length)
- Body organization (linear, thematic, narrative)
- Conclusion approach (summary, call-to-action, question)

**Formatting Preferences:**
- Subheading frequency and style
- List usage (bullets vs. numbers)
- Bold/italic usage patterns
- Visual breaks and spacing

### 2.5 Rhetorical Devices

Analyze and document:

**Storytelling Elements:**
- Anecdote usage (frequency and placement)
- Personal experience sharing
- Case study integration
- Example types (hypothetical, real-world, data)

**Persuasion Techniques:**
- Data/statistics usage
- Expert citation patterns
- Logical argumentation style
- Emotional appeals

**Engagement Devices:**
- Questions (rhetorical, direct, thought-provoking)
- Metaphors and analogies (frequency and type)
- Imagery and sensory language
- Repetition for emphasis

**Unique Patterns:**
- Signature phrases or expressions
- Consistent opening/closing patterns
- Unique formatting or structural choices
- Special stylistic flourishes

---

## Step 3: Voice Profile Synthesis

### 3.1 Create Voice Summary

Synthesize analysis into clear profile:

**Voice Identity Statement:**
- 2-3 sentence description capturing essence
- Example: "Your voice is conversational yet authoritative, blending data-driven insights with personal storytelling. You favor short, punchy sentences mixed with longer explanatory ones, creating a rhythmic reading experience that keeps readers engaged."

**Voice Characteristics Summary:**
- Top 5 defining characteristics
- 3-5 signature patterns
- Unique voice markers

### 3.2 Create Style Guidelines

Generate actionable style guide:

**Sentence Construction:**
- Preferred sentence lengths
- Typical sentence patterns
- Sentence variety recommendations

**Word Choice Rules:**
- Vocabulary level to maintain
- Words/phrases to use frequently
- Words/phrases to avoid
- Technical language guidelines

**Tone Guidelines:**
- Formality level by context
- When to be more/less formal
- Personality expression rules
- Emotional range guidelines

**Structural Templates:**
- Introduction templates
- Paragraph organization patterns
- Transition templates
- Conclusion templates

### 3.3 Create Voice Examples

Generate examples demonstrating voice:

**Before/After Examples:**
- Generic text → Your voice
- Show 3-5 transformations
- Highlight specific voice elements applied

**Voice Variations by Context:**
- Blog post voice
- Social media voice
- Newsletter voice
- Professional email voice

**Platform-Specific Adaptations:**
- How voice adapts for LinkedIn
- How voice adapts for Twitter
- How voice adapts for newsletter
- Core elements that remain constant

---

## Step 4: Voice Profile Validation

### 4.1 Similarity Testing

Test voice profile accuracy:
- Generate sample paragraph using profile
- Compare to original writing samples
- Calculate similarity score (0-100)
- Target: 75+ for strong match

### 4.2 User Validation

Present to user for validation:
- Show voice summary
- Display sample generated content
- Request feedback:
  - Does this sound like you?
  - What feels off?
  - What's spot-on?
  - Any missing elements?

### 4.3 Refinement

Based on feedback:
- Adjust voice characteristics
- Update style guidelines
- Regenerate examples
- Re-test until approved

---

## Step 5: Profile Documentation

### 5.1 Create Voice Profile Document

Generate comprehensive profile using {template}:
- Voice identity and summary
- Detailed characteristics analysis
- Style guidelines
- Examples and templates
- Usage instructions

### 5.2 Create Quick Reference Card

Generate 1-page quick reference:
- Voice identity statement
- Top 5 characteristics
- Key do's and don'ts
- Sentence/paragraph templates
- Example transformations

### 5.3 Save Profile

Save complete profile:
- Full profile: {default_output_file}
- Quick reference: {voice_profiles_folder}/quick-ref-{{profile-name}}.md
- Raw analysis data: {voice_profiles_folder}/analysis-data-{{profile-name}}.json

---

## Step 6: Integration & Next Steps

### 6.1 Profile Activation

Provide instructions:
- How to activate this profile for content creation
- How to switch between multiple profiles
- How to update profile with new samples

### 6.2 Testing Recommendations

Suggest testing approach:
- Try `*write` with new profile
- Compare generated content to original voice
- Iterate on profile as needed

### 6.3 Maintenance Guidelines

Provide maintenance plan:
- Review profile quarterly
- Update with new writing samples
- Track voice evolution
- Archive old profiles

---

## Output

Comprehensive voice profile including:
- **Voice Identity:** Clear statement of unique voice
- **Detailed Analysis:** All characteristics documented
- **Style Guidelines:** Actionable writing rules
- **Examples:** Before/after and context variations
- **Quick Reference:** 1-page summary
- **Integration Instructions:** How to use profile

Save complete profile to: {default_output_file}

---

## Success Criteria

✅ 3+ writing samples analyzed (1500+ words total)
✅ Complete analysis across all 5 dimensions
✅ Voice similarity score 75+
✅ User validation approved
✅ Profile document created
✅ Quick reference generated
✅ Ready for content generation

**Your voice profile is ready to ensure all AI-generated content sounds authentically like you!**
