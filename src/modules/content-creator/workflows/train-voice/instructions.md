# Train Voice Workflow

You are a voice training specialist helping refine and evolve a voice profile with new writing samples.

**User:** {user_name}
**Voice Profiles:** {voice_profiles_folder}
**Writing Examples:** {writing_examples}
**Date:** {date}

---

## Overview

This workflow allows you to continuously improve your voice profile by:
- Adding new writing samples
- Analyzing voice evolution
- Updating voice characteristics
- Refining style guidelines
- Validating consistency

---

## Step 1: Profile Selection

### 1.1 Identify Existing Profiles
- List all voice profiles in {voice_profiles_folder}
- Display profile names and creation dates
- Show profile summaries

### 1.2 Select Profile to Train
Ask user:
- Which profile to update?
- OR create new profile variation?

If creating variation:
- Base on existing profile
- Name the variation (e.g., "professional-linkedin", "casual-blog")

---

## Step 2: Gather New Samples

### 2.1 Request New Writing
Ask user to provide:
- Recent writing (last 3-6 months)
- Variety of contexts/platforms
- Different content types
- Minimum 500 words total

Options for providing samples:
- Paste text directly
- Provide file paths
- Point to URLs (if accessible)

### 2.2 Analyze New Samples
For each new sample:
- Run style analysis (use style-analyzer task)
- Extract key characteristics
- Compare to existing profile
- Note differences and evolution

---

## Step 3: Voice Evolution Analysis

### 3.1 Compare Old vs New

**Sentence Structure:**
- Old average length: [X] words
- New average length: [Y] words
- Change: [±X]%
- Verdict: [Consistent/Evolved/Significant Change]

**Vocabulary:**
- Old sophistication: [X]/10
- New sophistication: [Y]/10
- New power words: [list new additions]
- Dropped patterns: [list if any]

**Tone & Style:**
- Formality: Old [X]/10 → New [Y]/10
- Personality shifts: [description]
- New characteristics: [list]

**Structural Patterns:**
- Paragraph length: Old [X] → New [Y]
- Organization: [changes noted]
- Formatting: [new patterns]

### 3.2 Identify Voice Drift

Assess changes:
- **Natural Evolution** - Voice maturing/refining (good)
- **Context Variation** - Different content types (expected)
- **Inconsistency** - Random drift (needs attention)
- **Intentional Shift** - Deliberate style change (validate with user)

### 3.3 Determine Update Strategy

Based on analysis:
- **Minor Update** - Add new samples, slight refinement
- **Moderate Update** - Update guidelines, add variations
- **Major Update** - Significant evolution, create new version
- **Split Profile** - Create separate profiles for different contexts

---

## Step 4: Profile Update

### 4.1 Update Voice Characteristics

For each characteristic dimension:

**Sentence Structure:**
- Recalculate averages including new samples
- Update range and variance
- Refine complexity distribution
- Note new patterns

**Vocabulary Profile:**
- Add new power words
- Update signature phrases
- Refine sophistication level
- Note word preferences

**Tone & Personality:**
- Recalibrate formality level
- Update personality trait scores
- Refine emotional expression ranges
- Note tone evolution

**Structural Patterns:**
- Update paragraph templates
- Refine organization patterns
- Note new formatting preferences
- Update transition strategies

**Rhetorical Devices:**
- Note new device usage
- Update frequency metrics
- Add new examples
- Refine device guidelines

### 4.2 Update Style Guidelines

Revise guidelines based on new patterns:

**DO Updates:**
- Add new best practices
- Refine existing guidelines
- Remove outdated patterns
- Add new examples

**DON'T Updates:**
- Add new anti-patterns
- Remove restrictions if style evolved
- Update alternatives
- Clarify boundaries

### 4.3 Update Examples

Create new examples:
- Generate using updated profile
- Show voice evolution
- Demonstrate new patterns
- Provide context variations

---

## Step 5: Validation & Testing

### 5.1 Generate Test Content

Using updated profile:
- Generate sample paragraph (200 words)
- Apply all new characteristics
- Match evolved tone and style

### 5.2 Compare to Recent Writing

Side-by-side comparison:
- Generated content vs. recent sample
- Similarity scoring
- Element-by-element validation
- Target: 75+ similarity score

### 5.3 User Validation

Present to user:
- Show generated sample
- Highlight new voice elements
- Request feedback:
  - Does this still sound like you?
  - Captures recent evolution?
  - Any missing elements?
  - Approve for use?

---

## Step 6: Version Management

### 6.1 Version Control

Create version history:
- Save previous version as archive
- Name: `voice-profile-[name]-v[X]-[date].md`
- Document changes in changelog
- Maintain version history

### 6.2 Update Active Profile

Replace or update:
- Update main profile with new version
- Increment version number
- Update last-trained date
- Document training session

### 6.3 Sync Writing Examples

Update {writing_examples}:
- Add new samples to examples file
- Organize by date
- Tag by context/platform
- Maintain sample variety

---

## Step 7: Profile Enhancement

### 7.1 Create Context Variations (Optional)

If significant variation by context:
- Extract platform-specific patterns
- Create sub-profiles:
  - LinkedIn voice variation
  - Newsletter voice variation
  - Blog voice variation
  - Social media variation
- Link to main profile
- Document adaptation rules

### 7.2 Create Quick Reference Updates

Update 1-page quick reference:
- New top characteristics
- Updated do's and don'ts
- Fresh examples
- Evolution notes

### 7.3 Update Integration Instructions

Revise usage instructions:
- How to use updated profile
- New context variations
- When to use which variation
- Update commands

---

## Step 8: Training Summary & Next Steps

### 8.1 Training Summary

Provide comprehensive summary:

**Training Session:**
- Date: {date}
- Samples added: [X] ([total words])
- Changes made: [summary]
- Version: v[X] → v[Y]

**Key Updates:**
- [Update 1]
- [Update 2]
- [Update 3]

**Voice Evolution:**
- [Evolution note 1]
- [Evolution note 2]

**Similarity Score:**
- Pre-training: [X]/100
- Post-training: [Y]/100
- Improvement: [±X]

### 8.2 Testing Recommendations

Suggest testing:
- Try `*write` with updated profile
- Generate different content types
- Validate across platforms
- Compare to recent writing

### 8.3 Maintenance Schedule

Recommend next training:
- **Frequency:** Every 3-6 months OR after 10+ new pieces
- **Next Review:** [Date 3 months out]
- **Triggers for sooner:**
  - Significant style shift
  - New content type
  - Platform expansion
  - User dissatisfaction

---

## Output

Updated voice profile with:
- ✅ New samples analyzed and integrated
- ✅ Voice characteristics updated
- ✅ Style guidelines refined
- ✅ New examples generated
- ✅ Version history maintained
- ✅ Quick reference updated
- ✅ Validation passed

**Your voice profile is now trained with your latest writing and ready to generate more authentic content!**

---

## Integration

This workflow integrates with:
- `*build-voice-profile` - Initial profile creation
- `*check-voice` - Validation of generated content
- `*analyze-style` - Deep style analysis
- All content generation workflows
