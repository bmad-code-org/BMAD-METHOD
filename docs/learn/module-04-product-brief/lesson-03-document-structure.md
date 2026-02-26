# Module 04: Product Brief

## Lesson 3: The Document Structure

**What a Product Brief actually looks like**

---

## Not a Novel, A Strategic Document

A Product Brief is not a comprehensive specification. It's not a detailed requirements document. It's not a 50-page strategy deck.

It's a 2-3 page strategic document that answers the 5 critical questions clearly and concisely.

**Why 2-3 pages?**
- Short enough that people actually read it
- Long enough to provide real clarity
- Scannable enough to reference quickly
- Complete enough to guide decisions

**The goal:** Anyone on the team can read it in 5 minutes and understand the strategic direction.

---

## The Template Structure

Here's what a Product Brief looks like:

```markdown
# Product Brief: [Project Name]

## Vision

[1-2 paragraphs: What you're building and why it matters]

## Positioning

**Target:** [Who it's for]
**Value:** [What problem it solves]
**Differentiation:** [How it's unique]

## Target Users

**Primary Users:**
- [Direct users and their needs]

**Secondary Users:**
- [Indirect beneficiaries]

**Stakeholders:**
- Business: [Decision makers, budget holders]
- Technical: [Developers, infrastructure]

## Success Criteria

**User Success:**
- [Measurable user outcomes]

**Business Success:**
- [Revenue, growth, efficiency metrics]

**Technical Success:**
- [Performance, reliability, security]

**Design Success:**
- [Usability, satisfaction, engagement]

## Competitive Landscape

**Direct Competitors:**
- [Who else does this]

**Alternatives:**
- [Other ways to solve the problem]

**Our Differentiation:**
- [Why choose us]

## Constraints

**Technical:**
- Platform: [Web, mobile, desktop]
- Performance: [Speed, scalability requirements]
- Integrations: [Required connections]
- Security: [Compliance, data protection]

**Business:**
- Budget: [Total available]
- Timeline: [Launch date, milestones]
- Resources: [Team size, skills]

**Design:**
- Brand: [Guidelines, voice, tone]
- Accessibility: [WCAG level, requirements]
- Localization: [Languages, regions]
```

---

## Section-by-Section Breakdown

### Vision (1-2 paragraphs)

**What goes here:**
- What you're building
- The problem you're solving
- Who benefits
- Why this matters

**Keep it:**
- Clear and specific
- Inspiring but grounded
- Focused on outcomes
- Free of jargon

**Example:**
"We're building a family coordination platform that helps parents manage their dog's care schedule. Every day, families struggle with missed feedings, forgotten walks, and unclear responsibilities. Our platform creates a single source of truth where every family member knows exactly what needs to be done, when, and by whom. This matters because reducing coordination stress strengthens family bonds and ensures consistent care for pets who depend on us."

### Positioning (3 lines)

**What goes here:**
- **Target:** One sentence describing who this is for
- **Value:** One sentence describing what problem it solves
- **Differentiation:** One sentence describing how it's different

**Keep it:**
- Specific (not "everyone")
- Problem-focused (not feature-focused)
- Differentiated (not "better quality")

**Example:**
- **Target:** Busy parents managing family dog care responsibilities
- **Value:** Eliminates coordination confusion and ensures consistent pet care
- **Differentiation:** Family-focused approach vs task management apps

### Target Users (Bullet lists)

**What goes here:**
- Primary users (who uses it directly)
- Secondary users (who benefits indirectly)
- Business stakeholders (who decides/pays)
- Technical stakeholders (who builds/maintains)

**Keep it:**
- Specific about needs and context
- Clear about priorities (primary vs secondary)
- Realistic about who actually matters

**Example:**
**Primary:** Parents (25-45) managing household responsibilities, tech-comfortable, value organization
**Secondary:** Children participating in care, the dog receiving consistent care
**Business:** Founders (bootstrap), future investors
**Technical:** Small dev team (2 developers, 1 designer)

### Success Criteria (Organized by dimension)

**What goes here:**
- User success (behavior, satisfaction)
- Business success (revenue, growth)
- Technical success (performance, reliability)
- Design success (usability, engagement)

**Keep it:**
- Measurable (numbers, not feelings)
- Time-bound (by when)
- Achievable (realistic)
- Relevant (aligned with vision)

**Example:**
**User Success:**
- 80% of users report reduced coordination stress (survey, 3 months)
- Average task completion time < 2 minutes
- 90% task completion rate

**Business Success:**
- 1,000 active families by month 6
- 70% weekly active users
- $50K MRR by month 12

### Competitive Landscape (Organized by type)

**What goes here:**
- Direct competitors (same solution)
- Indirect alternatives (different approach)
- Your differentiation (why you're different)

**Keep it:**
- Honest about competition
- Focused on learning (not dismissing)
- Clear about differentiation

**Example:**
**Direct:** Cozi (family calendar), OurHome (chore management)
**Alternatives:** Shared calendars, paper lists, verbal coordination
**Differentiation:** Pet-care focused, family-centric design, offline capability

### Constraints (Organized by category)

**What goes here:**
- Technical (platform, performance, integrations)
- Business (budget, timeline, resources)
- Design (brand, accessibility, localization)

**Keep it:**
- Specific (not vague)
- Justified (explain why)
- Realistic (acknowledge trade-offs)

**Example:**
**Technical:**
- Platform: Mobile (iOS/Android) + web
- Performance: < 2s load time, offline core features
- Integrations: None for MVP
- Security: GDPR compliance required

**Business:**
- Budget: Bootstrap (no external funding yet)
- Timeline: 6 months to MVP
- Resources: 2 developers, 1 designer

**Design:**
- Brand: Family-friendly, organized, calm
- Accessibility: WCAG 2.1 AA minimum
- Localization: Swedish primary, English secondary

---

## Making It Scannable

The Product Brief should be easy to scan. Use formatting to help:

**Headers:**
- Clear section headers (## for main sections)
- Subsection headers where needed (### for categories)

**Lists:**
- Bullet points for multiple items
- Numbered lists for sequential items
- Bold labels for categories

**White Space:**
- Blank lines between sections
- Short paragraphs (2-3 sentences max)
- Avoid walls of text

**Emphasis:**
- Bold for key terms
- Italics for emphasis (sparingly)
- No ALL CAPS (except acronyms)

---

## Keeping It Concise

**How to stay under 3 pages:**

**Do:**
- ✅ Use clear, direct language
- ✅ Focus on decisions, not descriptions
- ✅ Include only what guides work
- ✅ Use bullets instead of paragraphs
- ✅ Be specific, not comprehensive

**Don't:**
- ❌ Include background research
- ❌ Explain every decision
- ❌ List every possible feature
- ❌ Write marketing copy
- ❌ Over-explain obvious points

**The test:**
If removing something wouldn't affect a design decision, remove it.

---

## Living Document Approach

The Product Brief isn't carved in stone. It's a living document that evolves as you learn.

**When to update:**
- ✅ New market research changes positioning
- ✅ User feedback reveals different needs
- ✅ Business constraints change (budget, timeline)
- ✅ Competitive landscape shifts
- ✅ Success criteria need adjustment

**When NOT to update:**
- ❌ Every small design decision
- ❌ Every feature idea
- ❌ Every stakeholder opinion
- ❌ Every team discussion

**How to update:**
1. Identify what changed and why
2. Update the relevant section
3. Notify the team of the change
4. Reference the updated brief going forward

**Version control:**
- Keep the brief in version control (Git)
- Use meaningful commit messages
- Tag major versions (v1.0, v2.0)
- Link to brief in project documentation

---

## Making It Useful

A Product Brief is only valuable if people actually use it. Here's how to make it useful:

**Make it accessible:**
- Store it where everyone can find it
- Link to it from project documentation
- Reference it in meetings
- Include the path in onboarding

**Make it referenced:**
- Start design reviews by reading relevant sections
- Link to specific sections in decisions
- Quote it when explaining "why"
- Update it when assumptions change

**Make it trusted:**
- Keep it accurate (update when things change)
- Keep it concise (remove what's not useful)
- Keep it clear (no jargon or ambiguity)
- Keep it current (don't let it go stale)

---

## Common Mistakes to Avoid

**Too Vague:**
❌ "Create a great user experience"
✅ "Achieve SUS score > 75 and NPS > 40"

**Too Detailed:**
❌ "The button should be 44px tall with 12px padding and..."
✅ "Follow WCAG 2.1 AA accessibility standards"

**Too Aspirational:**
❌ "Be the best product in the world"
✅ "Achieve 1,000 active users by month 6"

**Too Rigid:**
❌ "Must have exactly these 15 features"
✅ "Must solve core coordination problem (see success criteria)"

**Too Long:**
❌ 20-page document nobody reads
✅ 2-3 page document everyone references

---

## The Real-World Test

**A good Product Brief passes these tests:**

**The 5-Minute Test:**
Can someone read it in 5 minutes and understand the strategic direction?

**The Decision Test:**
Can someone use it to make a design decision without asking for clarification?

**The Onboarding Test:**
Can a new team member read it and understand what you're building and why?

**The Stakeholder Test:**
Can a stakeholder read it and know if the project is on track?

**The Update Test:**
Can you update it in 10 minutes when something changes?

If the answer to all 5 is yes, you have a good Product Brief.

---

## What's Next

In the next lesson, we'll explore how WDS makes creating this document fast through AI-guided conversation - turning what used to take days into 30-45 minutes.

---

**[Continue to Lesson 4: How WDS Makes This Fast →](lesson-04-wds-advantage.md)**

---

[← Back to Lesson 2](lesson-02-five-questions.md) | [Back to Module Overview](module-04-overview.md)

*Part of Module 04: Product Brief*
