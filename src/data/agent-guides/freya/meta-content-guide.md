# Freya's Meta Content Guide

**When to load:** When specifying public pages that will appear in search results or be shared on social media

---

## Core Principle

**Every public page needs meta content for search results and social sharing.**

Meta content is not just SEO - it's essential page content that appears when users:
- Find your page in Google search results
- Share your page on Facebook, Twitter, LinkedIn
- Bookmark your page in their browser

---

## When to Collect Meta Content

### Public Pages (Always Required)
- Landing pages
- Marketing pages
- Blog posts
- Product pages
- About/Contact pages
- Any page accessible without login

### Private/Authenticated Pages (Browser Tab Only)
- Dashboard pages
- Settings pages
- User profile pages
- Admin pages
- Any page requiring authentication

---

## Meta Content Components

### 1. Page Title (Browser Tab & Search Results)

**Purpose:** Appears in browser tab, search results, and social media shares

**Character Limit:** 55-60 characters (including brand name)

**Best Practices:**
- Front-load important keywords
- Include brand name at end (if space allows)
- Be descriptive and specific
- Make it compelling for clicks

**Agent Questions:**
```
"What should appear in the browser tab and search results for this page?"
"Keep it under 60 characters and make it descriptive."
"Example: 'Dog Walking Coordination - Dog Week' (42 chars)"
```

**Example:**
```markdown
### Page Title (Browser Tab & Search Results)
**Character Limit:** 55-60 characters

**Content:**
- EN: "Dog Walking Coordination - Dog Week"
- SE: "Hundpromenad Koordinering - Dog Week"
```

---

### 2. Meta Description (Search Results Preview)

**Purpose:** Appears below page title in search results

**Character Limit:** 150-160 characters

**Best Practices:**
- Summarize page value clearly
- Include call-to-action
- Use active voice
- Address user pain point or benefit
- Don't just repeat page title

**Agent Questions:**
```
"How would you describe this page in 150-160 characters to encourage clicks from search results?"
"What value does this page provide to users?"
"What action should they take?"
```

**Example:**
```markdown
### Meta Description (Search Results Preview)
**Character Limit:** 150-160 characters

**Content:**
- EN: "Coordinate dog walks with your family. Never miss a walk again. Simple scheduling, automatic reminders, and family accountability. Start free today."
- SE: "Koordinera hundpromenader med din familj. Missa aldrig en promenad igen. Enkel schemaläggning, automatiska påminnelser. Börja gratis idag."
```

---

### 3. Social Media Title

**Purpose:** Appears when page is shared on Facebook, Twitter, LinkedIn, etc.

**Character Limit:** 60-70 characters

**Best Practices:**
- Can differ from page title
- Optimize for social engagement
- More conversational tone OK
- Focus on benefit or curiosity

**Agent Questions:**
```
"What title would work best when this page is shared on social media?"
"Can be different from page title, optimized for social engagement."
"Think: What would make someone click when they see this in their feed?"
```

**Example:**
```markdown
#### Social Media Title
**Character Limit:** 60-70 characters

**Content:**
- EN: "Never Forget a Dog Walk Again 🐕"
- SE: "Glöm Aldrig en Hundpromenad Igen 🐕"
```

---

### 4. Social Media Description

**Purpose:** Appears below title in social media share previews

**Character Limit:** 120-150 characters

**Best Practices:**
- Shorter than meta description
- More casual/engaging tone
- Create curiosity or urgency
- Include benefit

**Agent Questions:**
```
"What description would encourage people to click when they see this shared on Facebook/Twitter/LinkedIn?"
"Keep it under 150 characters and make it engaging."
```

**Example:**
```markdown
#### Social Media Description
**Character Limit:** 120-150 characters

**Content:**
- EN: "Family dog walking made simple. Schedule walks, get reminders, and keep everyone accountable. Free to start."
- SE: "Familjens hundpromenader enkelt. Schemalägg, få påminnelser, håll alla ansvariga. Gratis att börja."
```

---

### 5. Social Media Image

**Purpose:** Appears as preview image when page is shared

**Image Requirements:**
- **Dimensions:** 1200x630px (Open Graph standard)
- **Format:** JPG or PNG
- **File size:** < 1MB
- **Content:** Should represent page visually

**Best Practices:**
- Use high-quality images
- Include text overlay if helpful
- Ensure readable on mobile
- Test on different platforms
- Avoid too much text (Facebook limits)

**Agent Questions:**
```
"What image best represents this page content?"
"Should be 1200x630px and visually engaging."
"Consider: Product screenshot, hero image, or custom graphic?"
```

**Example:**
```markdown
#### Social Media Image
**Image Requirements:**
- Dimensions: 1200x630px (Open Graph standard)
- Format: JPG or PNG
- File size: < 1MB

**Image Path:** `/images/social/start-page-social.jpg`

**Alt Text:**
- EN: "Dog Week app showing family dog walking schedule on mobile phone"
- SE: "Dog Week-appen visar familjens hundpromenadschema på mobiltelefon"
```

---

## Agent Workflow for Public Pages

### Step 1: Identify Page Visibility

Ask: "Is this page publicly accessible (no login required)?"

- **Yes** → Collect all meta content
- **No** → Only collect browser tab title

---

### Step 2: Collect Page Title

**Question:**
```
"What should appear in the browser tab and search results for this page?
Keep it under 60 characters and make it descriptive.

Example: 'Dog Walking Coordination - Dog Week' (42 chars)

Your page title:"
```

**Validate:**
- Length ≤ 60 characters
- Descriptive and specific
- Includes brand name (if space)

---

### Step 3: Collect Meta Description

**Question:**
```
"How would you describe this page in 150-160 characters to encourage clicks from search results?

What value does this page provide?
What action should users take?

Your meta description:"
```

**Validate:**
- Length 150-160 characters
- Includes value proposition
- Has call-to-action
- Not just repeating title

---

### Step 4: Collect Social Media Title

**Question:**
```
"What title would work best when this page is shared on social media?

Can be different from page title, optimized for engagement.
Think: What would make someone click in their feed?

Your social media title:"
```

**Validate:**
- Length 60-70 characters
- Engaging and conversational
- Creates curiosity or shows benefit

---

### Step 5: Collect Social Media Description

**Question:**
```
"What description would encourage clicks when shared on Facebook/Twitter/LinkedIn?

Keep it under 150 characters and make it engaging.

Your social media description:"
```

**Validate:**
- Length 120-150 characters
- Casual and engaging tone
- Shows clear benefit

---

### Step 6: Specify Social Media Image

**Question:**
```
"What image best represents this page content?

Should be 1200x630px and visually engaging.
Options: Product screenshot, hero image, custom graphic

Image description:"
```

**Document:**
- Image path
- Alt text in all languages
- Image requirements

---

## Multi-Language Considerations

**All meta content must be provided in all product languages.**

**Translation Tips:**
- Character limits apply to each language
- Some languages are more verbose (German, Swedish)
- May need to adjust wording to fit limits
- Maintain same tone and message across languages

**Example:**
```markdown
**Content:**
- EN: "Never Forget a Dog Walk Again" (32 chars)
- SE: "Glöm Aldrig en Hundpromenad Igen" (34 chars) ← Slightly longer, still fits
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Generic Titles

**Wrong:**
```
Page Title: "Home - Dog Week"
```

**Right:**
```
Page Title: "Dog Walking Coordination - Dog Week"
```

---

### ❌ Mistake 2: Too Long

**Wrong:**
```
Meta Description: "Dog Week is an amazing application that helps families coordinate their dog walking schedules so that everyone knows when the dog needs to be walked and who is responsible for each walk throughout the day and week." (215 chars)
```

**Right:**
```
Meta Description: "Coordinate dog walks with your family. Never miss a walk again. Simple scheduling, automatic reminders, and family accountability. Start free today." (149 chars)
```

---

### ❌ Mistake 3: No Call-to-Action

**Wrong:**
```
Meta Description: "Dog Week is a dog walking coordination app for families."
```

**Right:**
```
Meta Description: "Coordinate dog walks with your family. Never miss a walk again. Start free today."
```

---

### ❌ Mistake 4: Same Content Everywhere

**Wrong:**
```
Page Title: "Dog Walking Coordination - Dog Week"
Social Title: "Dog Walking Coordination - Dog Week" ← Same as page title
```

**Right:**
```
Page Title: "Dog Walking Coordination - Dog Week"
Social Title: "Never Forget a Dog Walk Again 🐕" ← Optimized for social
```

---

## Validation Checklist

Before finalizing meta content:

- [ ] **Page visibility identified** (Public/Private/Authenticated)
- [ ] **Page title** ≤ 60 characters, descriptive
- [ ] **Meta description** 150-160 characters, includes CTA
- [ ] **Social title** 60-70 characters, engaging
- [ ] **Social description** 120-150 characters, benefit-focused
- [ ] **Social image** specified with path and alt text
- [ ] **All languages** provided for each content item
- [ ] **Character limits** respected in all languages
- [ ] **Tone appropriate** for each context (search vs social)

---

## Example: Complete Meta Content Specification

```markdown
## Meta Content & Social Sharing

**Page Visibility:** Public

### Page Title (Browser Tab & Search Results)
**Character Limit:** 55-60 characters

**Content:**
- EN: "Dog Walking Coordination - Dog Week"
- SE: "Hundpromenad Koordinering - Dog Week"

**Purpose:** Appears in browser tab, search results, and social media shares.

---

### Meta Description (Search Results Preview)
**Character Limit:** 150-160 characters

**Content:**
- EN: "Coordinate dog walks with your family. Never miss a walk again. Simple scheduling, automatic reminders, and family accountability. Start free today."
- SE: "Koordinera hundpromenader med din familj. Missa aldrig en promenad igen. Enkel schemaläggning, automatiska påminnelser. Börja gratis idag."

**Purpose:** Appears below page title in search results.

---

### Social Sharing Content

#### Social Media Title
**Character Limit:** 60-70 characters

**Content:**
- EN: "Never Forget a Dog Walk Again 🐕"
- SE: "Glöm Aldrig en Hundpromenad Igen 🐕"

**Purpose:** Appears when page is shared on Facebook, Twitter, LinkedIn.

---

#### Social Media Description
**Character Limit:** 120-150 characters

**Content:**
- EN: "Family dog walking made simple. Schedule walks, get reminders, and keep everyone accountable. Free to start."
- SE: "Familjens hundpromenader enkelt. Schemalägg, få påminnelser, håll alla ansvariga. Gratis att börja."

**Purpose:** Appears below title in social media share previews.

---

#### Social Media Image
**Image Requirements:**
- Dimensions: 1200x630px (Open Graph standard)
- Format: JPG or PNG
- File size: < 1MB

**Image Path:** `/images/social/start-page-social.jpg`

**Alt Text:**
- EN: "Dog Week app showing family dog walking schedule on mobile phone"
- SE: "Dog Week-appen visar familjens hundpromenadschema på mobiltelefon"

**Purpose:** Appears as preview image when page is shared on social media.
```

---

## SEO Integration

Meta content is one part of a broader SEO strategy. For comprehensive SEO guidance:

- **SEO Strategy Guide:** `../saga/seo-strategy-guide.md` — Full SEO reference (keywords, URL structure, local SEO, structured data, image SEO)
- **SEO Content Instructions:** `../../workflows/4-ux-design/templates/instructions/seo-content.instructions.md` — Page-level SEO checklist during specification
- **Project Brief SEO:** Check the project's content-language document for the page-keyword map and SEO strategy

**Workflow:** The project brief (Phase 1) captures the SEO strategy. Page specifications (Phase 4) apply it per page. This guide handles the meta content portion — but also check heading hierarchy, alt text, internal links, and structured data.

---

## Related Resources

- **Page Specification Template:** `../../workflows/4-ux-design/templates/page-specification.template.md`
- **Language Configuration:** `../../workflows/00-system/language-configuration-guide.md`
- **SEO Strategy Guide:** `../saga/seo-strategy-guide.md`

---

**Meta content is essential page content, not an afterthought. Collect it during specification, not during development.** 🌐✨
