# Inspiration Analysis Workshop (Product Brief)

**When to load:** After Visual Direction, as final Product Brief companion document
**Agent:** Saga or Freya

---

## Why This Matters

Without documented visual/UX preferences from real examples, Dream Up agents must guess what the client likes. This causes:

- **Wasted iterations** where client says "not that style" after seeing output
- **Abstract feedback** ("make it more modern") that's impossible to action precisely
- **Misalignment** between what the agent generates and what the client envisioned
- **Lost time** in later phases correcting direction that could have been captured early

**The power of this document:** When a client says "I like that layout" pointing at a real site, you now have a concrete, documented reference. Not abstract words — a real example with specific elements they approved or rejected.

**For Dream Up quality:** Every future generation can self-review against documented preferences. "Did I follow the layout principle from Site 1 that the client liked? Did I avoid the pattern from Site 2 they rejected?"

---

## What We Need to Know

**Satisfaction criteria — by the end you should have:**

1. **Documented reactions to real sites** — specific elements liked/disliked with WHY
2. **Visual style preferences** — from concrete examples, not abstract descriptions
3. **Layout and structure patterns** — what arrangements appeal to the client
4. **UX patterns** — what interaction patterns they prefer
5. **Anti-patterns** — what they've explicitly rejected (with examples)
6. **Synthesized design principles** — strategic takeaways that guide all future design

**Quality bar:**
- At least 2 sites analyzed (more if client provides them)
- For each site: specific elements with client's reaction (not vague overall impression)
- Synthesized principles clear enough for a Dream Up agent to self-review against
- Client confirms: "Yes, this captures what I'm looking for"

---

## The Process

### Getting URLs

Ask the client for 2-4 sites they find inspiring. These could be:
- Sites with layout/structure they like
- Competitor sites (to learn what works and doesn't)
- Sites with visual style they admire
- Sites with UX patterns they want to adopt

**If client is hesitant:** Even one site with one thing they like is valuable. Don't require perfection — any concrete reference beats abstract descriptions.

**If client has no references:** Offer to find 2-3 examples in their industry. Show them and ask for reactions.

### Analyzing Each Site

**Step 1: Load the site** — use browser/WebFetch tools to see what the client sees.

**Step 2: Ask open first** — "What drew you to this site?" / "What do you like about it?" Let the client lead.

**Step 3: Get specific** — naturally ask about elements you can see on the site. Don't use a checklist. Ask about what's actually there:
- Their layout approach
- How they handle navigation
- How content is displayed
- Visual style and imagery
- Specific elements (maps, forms, testimonials, etc.)
- Performance and load feel

**Step 4: Capture nuance** — listen for:
- Approval ("like that") — document what specifically and why
- Rejection ("don't like that") — document what and why not
- Conditional ("like but...") — document the adaptation needed
- The WHY behind each reaction is more valuable than the reaction itself

**Step 5: Extract principles** — as patterns emerge across sites, identify strategic takeaways. Test your understanding: "I'm noticing you prefer X — is that fair?"

### Synthesizing

After all sites are analyzed, organize findings into design principles by category:
- Layout patterns (to use / to avoid)
- Content hierarchy (priorities / anti-patterns)
- Visual style (direction / what to avoid)
- UX patterns (interactions / anti-patterns)

**Confirm with client:** "Based on what you liked and didn't like, here's what I'm taking away. Does this capture your vision?"

---

## Types of Information to Surface

**Layout and structure:**
- Single-page vs multi-page preference
- Section organization and flow
- Content density (busy vs minimal)
- White space usage

**Navigation and UX:**
- Menu style (simple vs complex)
- How key actions are accessed (contact, booking, etc.)
- Mobile behavior
- Scroll behavior

**Visual style:**
- Color palette impression
- Typography feel (modern, classic, etc.)
- Photo style (real vs stock, dark vs light)
- Overall aesthetic (minimal, rich, corporate, casual)

**Content display:**
- How services/features are shown (grid, list, cards)
- Testimonial/review presentation
- How contact info is displayed
- Map and location presentation

**Performance and feel:**
- Loading speed impression
- Animation and movement
- Overall "feel" (fast, heavy, smooth, clunky)

---

## What to Document

Create `inspiration-analysis.md` in the Product Brief output folder.

**For each site:**
```markdown
## Site: [Name or URL]

### What Client Liked
- [Specific element] — [Why it works for them]
- [Specific element] — [Why it works]

### What Client Didn't Like
- [Specific element] — [Why it doesn't work]

### Adaptations Needed
- [Element] — [Like the concept but needs modification because...]

### Principles Extracted
- [Strategic takeaway from this site]
```

**Synthesis:**
```markdown
## Design Principles (from all sites)

### Layout
- DO: [Patterns to follow]
- DON'T: [Patterns to avoid]

### Content Hierarchy
- DO: [How to prioritize]
- DON'T: [What not to do]

### Visual Style
- DO: [Visual direction]
- DON'T: [What to avoid]

### User Experience
- DO: [UX patterns to adopt]
- DON'T: [Anti-patterns]
```

**Usage note at the end:**
```markdown
## How to Use This Document

**For Scenario Outlining (Phase 4):**
Reference layout patterns when designing user flows

**For Page Design (Phase 5):**
Use extracted principles as design checklist.
Reference "What Client Liked" for visual direction.
Avoid "What Client Didn't Like" patterns.

**For Dream Up self-review:**
Check generated output against documented preferences.
```

---

## Red Flags

**"I like everything about it"** → Nothing is perfect. Probe: "Even if we could copy it exactly, what would you adjust for your business?"

**"I hate everything"** → Something drew them to share it. Ask: "What made you think of this site initially?"

**Contradictory preferences** → Different contexts may drive different preferences. Explore: "These sites have very different approaches — what draws you to each?"

**Overly technical feedback** ("Great CSS grid implementation") → Redirect to user value: "What does that achieve for visitors that you like?"

**Brand name dropping** ("Make it like Apple") → Probe specifics: "What specifically about Apple's approach appeals to you? The minimalism? The product focus? The typography?"

---

## Success Criteria

**You've succeeded when:**
- Client has reacted to specific visual/UX elements from real examples
- Preferences are documented with concrete references (not abstract words)
- Design principles are clear and actionable
- Anti-patterns are explicitly documented
- Client confirms the synthesis captures their vision

**Dream Up agents can now:**
- Reference documented preferences during generation
- Self-review against specific approved examples
- Avoid patterns the client explicitly rejected
- Design with confidence they're aligned

---

*Concrete examples beat abstract descriptions every time. This document turns "make it modern" into "like Site A's single-page layout with fixed contact header, but simpler than Site B's cluttered services grid."*
