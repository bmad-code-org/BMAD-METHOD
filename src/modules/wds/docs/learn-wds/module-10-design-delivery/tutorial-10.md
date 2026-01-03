# Tutorial 10: Design Delivery

**Package your design for developers - hand off with confidence, not confusion**

---

## Overview

Your design is done. Specifications are complete. Design System is ready. Now what?

You need to **hand off to developers** - but how do you ensure they build what you designed?

**Your superpower:** Idunn transforms your design specs into a Developer PRD with epics, stories, and clear implementation guidance.

**Time:** 30-45 minutes  
**Prerequisites:** Module 08 & 09 completed (Pages designed, Design System ready)  
**What you'll create:** Design Delivery PRD with Epics & Stories

---

## What You'll Learn

- What a Design Delivery PRD is (and why developers love it)
- How Idunn organizes your specs into buildable chunks
- How to prioritize what gets built first
- What to include in the handoff package

---

## What is Design Delivery PRD?

**Design Delivery PRD** = Your design specs, organized for development.

It transforms:
- **Your page specs** (what the design IS)
- **Into developer tasks** (what to BUILD)

**Think of it as:**  
Your recipe (specs) → Shopping list + cooking steps (PRD)

---

## What to Expect: The Organization Process

**Here's how a real session with Idunn looks:**

### Idunn's Opening
```
Hi! Time to organize your design for developer handoff.

I've reviewed your:
- Page specifications (3 pages)
- Design System (ready)

I'll break this into epics and stories developers can actually build.

We'll work together to:
1. Group related work into epics
2. Create specific stories with acceptance criteria
3. Prioritize what gets built first
4. Package everything for handoff

Ready? Let's start by looking at the big picture.
```

### Example Epic Breakdown

**Idunn Proposes Structure:**
```
Idunn: "I analyzed your 3 pages. Here's how I'd organize them:

        EPIC 1: Landing Page Experience
        - Pages: 1.1 Start Page
        - Goal: Users understand WDS and can access it
        - Stories: 7 (Hero, Capabilities, Navigation, Footer...)
        - Priority: HIGH (this is your front door)

        EPIC 2: Course Content Pages
        - Pages: 2.1 Modules List, 2.2 Tutorial Page
        - Goal: Users can learn WDS through tutorials
        - Stories: 12 (Module cards, Tutorial content, Progress tracking...)
        - Priority: MEDIUM (users need this after they sign up)

        EPIC 3: Design System Components
        - Goal: Build reusable components library
        - Stories: 5 (Button system, Form components, Card library...)
        - Priority: HIGH (needed for all other epics)

        Does this grouping make sense?
        Any epics missing?"

You: "Actually, Epic 3 should be built FIRST - other epics need it."

Idunn: "Smart! Let me reorder:
        
        Phase 1: Epic 3 (Component Library)
        Phase 2: Epic 1 (Landing Page)
        Phase 3: Epic 2 (Course Content)
        
        Better?"

You: "Perfect!"
```

### Example Questions Idunn Asks

**About Priorities:**
```
Idunn: "Looking at Epic 1 (Landing Page), which story is most critical?

         Story 1.1: Hero Section (first impression)
         Story 1.2: Capabilities Section (shows value)
         Story 1.3: Benefits Grid (builds trust)
         Story 1.4: Footer (contact info, links)

         If we had to ship with ONLY ONE done, which one?"

You: "Story 1.1 - Hero Section. Users need to understand what WDS is."

Idunn: "Got it. I'll mark Story 1.1 as P0 (must-have).
         Others can be P1 (important but can wait).
         
         Should developers build them in this order?"

You: "Yes, exactly."

Idunn: "Story sequence documented! 📋"
```

**About Dependencies:**
```
Idunn: "I notice Story 2.3 (Tutorial Progress Tracking) needs:
         - User authentication (from Epic 0?)
         - Database to store progress
         
         Should I create Epic 0: Foundation that includes auth?"

You: "Yes! Good catch."

Idunn: "Creating Epic 0: Platform Foundation
         - Story 0.1: User authentication system
         - Story 0.2: Database setup
         - Story 0.3: API infrastructure
         
         This becomes Phase 1, and everything else depends on it.
         Sound right?"

You: "Absolutely."
```

**About Story Details:**
```
Idunn: "For Story 1.2 (Capabilities Section with 7 cards),
         should this be:
         
         Option A: ONE story (build all 7 cards at once)
         Option B: SEVEN stories (one per card)
         Option C: TWO stories (build card component, then populate all 7)

         What makes sense?"

You: "Option C - developers create the card component first,
      then it's easy to replicate for all 7."

Idunn: "Perfect! Breaking it down:
         - Story 1.2a: Build Capability Card component
         - Story 1.2b: Populate 7 capability instances
         
         Estimated: 2 days (component) + 1 day (content)
         Good?"

You: "Yes!"
```

### Built-in Guidance from Idunn

**When stories are too big:**
```
Idunn: "Story 2.1 is getting large. It includes:
         - Module card grid
         - Filtering by category
         - Search functionality
         - Sort by difficulty
         
         This could take 2-3 weeks. Should we split it?
         
         Suggested split:
         - Story 2.1a: Module grid (basic display)
         - Story 2.1b: Add filtering
         - Story 2.1c: Add search
         - Story 2.1d: Add sorting
         
         Then developers can ship 2.1a quickly, and add features
         in 2.1b-d later. Sound good?"

You: "Yes! I like that incremental approach."

Idunn: "Great! Smaller stories = faster feedback = better quality."
```

**About Acceptance Criteria:**
```
Idunn: "For Story 1.1 (Hero Section), I'm writing acceptance criteria:

         ✅ H1 headline displays correctly
         ✅ Tagline text matches spec
         ✅ CTA button links to GitHub
         ✅ Section is responsive (mobile/desktop)
         ✅ All Object IDs match page spec
         
         Am I missing anything?"

You: "Yes - the CTA should have a hover animation (scale 1.05)"

Idunn: "Added! ✅ CTA has hover state (scale 1.05, smooth transition)
         
         These criteria help developers know when they're 'done'."
```

**About Testing Expectations:**
```
Idunn: "Should I include testing requirements in each story?

         For example:
         ✅ Works in Chrome, Firefox, Safari
         ✅ Responsive on mobile (375px+)
         ✅ Keyboard accessible (tab navigation)
         ✅ Screen reader compatible"

You: "Yes! Accessibility is important."

Idunn: "Adding accessibility criteria to all stories.
         I'll also create a separate 'Definition of Done' document
         so developers know the quality bar. ✅"
```

### What Idunn Creates While You Talk

As you discuss priorities and structure, Idunn is:
- 📊 Creating epic breakdown (major features)
- ✍️ Writing user stories (As a [persona], I want...)
- ✅ Defining acceptance criteria (testable conditions)
- 🔗 Linking to page specs (where to find details)
- 📅 Suggesting implementation phases (what builds when)
- 📋 Assembling handoff package (everything developers need)

**You'll see progress updates:**
```
Idunn: "✅ 3 epics structured
         ✅ 24 stories written
         ✅ Dependencies mapped
         🔄 Creating handoff documentation..."
```

### The Collaborative Flow

**It's iterative, not final:**
```
You: "Actually, looking at this, Story 2.2 could be combined with 2.3.
      They're both about tutorial pages."

Idunn: "Good point! Let me merge them:
         
         OLD:
         - Story 2.2: Tutorial content display
         - Story 2.3: Tutorial navigation

         NEW:
         - Story 2.2: Complete tutorial page experience
         
         This makes more sense as one unit of work. Updated! 🎯"
```

**Idunn catches gaps:**
```
Idunn: "Wait - I don't see any stories for error states.
         
         What should happen if:
         - GitHub API is down (CTA link fails)?
         - Images don't load?
         - Page content is missing?
         
         Should I add error handling stories?"

You: "Yes! Good catch. Add graceful error states."

Idunn: "Adding Epic 4: Error Handling & Edge Cases
         - Story 4.1: Network error states
         - Story 4.2: Missing content fallbacks
         - Story 4.3: Loading states
         
         This ensures a polished experience. ✅"
```

### The Handoff Package

**Idunn Shows You the Final Structure:**
```
Idunn: "Here's what developers will receive:

         📁 Design Delivery PRD/
         ├── 00-handoff-overview.md (start here!)
         ├── 01-epic-breakdown.md (big picture)
         ├── 02-implementation-roadmap.md (build order)
         ├── 03-definition-of-done.md (quality criteria)
         └── stories/
             ├── epic-0-foundation/
             │   ├── story-0.1-authentication.md
             │   └── story-0.2-database.md
             ├── epic-1-landing-page/
             │   ├── story-1.1-hero-section.md
             │   └── story-1.2-capabilities.md
             └── ...

         Each story links to:
         - Your page specifications
         - Design System components
         - Acceptance criteria
         - Technical notes

         Developers have everything they need. Ready to hand off?"

You: "Yes! This is so organized."

Idunn: "Great! I'll export everything.
         
         Want me to draft an email to your dev team too? 📧"
```

---

## Step 1: Understand the Translation (5 min)

**What you have:**
```
Page Specifications:
- 1.1 Start Page (Hero, Features, CTA)
- 1.2 Benefits Page (3 sections)
- 1.3 Pricing Page (Pricing table, FAQ)
```

**What developers need:**
```
Epic 1: Landing Page
├── Story 1: Build Hero Section
├── Story 2: Build Features Section
└── Story 3: Build CTA Section

Epic 2: Benefits Page
├── Story 4: Build Benefits Grid
└── Story 5: Add Testimonials

Epic 3: Pricing Page
...
```

**Idunn creates this structure** from your specs.

---

## Step 2: Activate Idunn for Handoff (2 min)

```
@idunn

I'm ready to create the Design Delivery PRD.

I have:
- Page specifications (complete)
- Design System (ready)

Please help me organize this for developer handoff.
```

**Idunn will analyze** your specs and propose an implementation structure.

---

## Step 3: Review Idunn's Epic Breakdown (10 min)

Idunn creates **Epics** (major features) and **Stories** (specific tasks).

**Example:**

### Epic 1: Core Landing Experience
```
Goal: Users can understand WDS value and sign up
Pages: Start Page + Benefits Page
Priority: HIGH
Estimated: 2-3 weeks
```

**Stories in this Epic:**
1. ✅ **Story 1.1:** Build Hero Section
   - Page: 1.1 Start Page
   - Components: Hero Headline, Hero Body, CTA Button, Hero Image
   - Acceptance: Matches spec exactly, responsive, CTA links to GitHub

2. ✅ **Story 1.2:** Build Capabilities Section (Right Column)
   - Page: 1.1 Start Page
   - Components: 7 Capability Cards with icons, links
   - Acceptance: Cards link to deliverable pages, hover states work

3. ✅ **Story 1.3:** Build Benefits Grid
   - Page: 1.2 Benefits Page
   - Components: 3 Benefit Cards
   - Acceptance: Responsive grid, icons display correctly

**Your job:**
- ✅ Confirm epics make sense
- ✅ Adjust priorities if needed
- ✅ Suggest different groupings if you see dependencies

---

## Step 4: Prioritize Implementation Order (10 min)

**Idunn will ask:**

"Which epics should developers build first?"

**Think about:**
- What's the **MVP** (Minimum Viable Product)?
- What do users need **most urgently**?
- Are there **dependencies** (Epic 2 needs Epic 1 first)?

**Example prioritization:**
```
Phase 1 (MVP - Week 1-2):
- Epic 1: Core Landing Experience
  (Users can learn about WDS and access it)

Phase 2 (Enhancement - Week 3-4):
- Epic 2: Course Content
  (Users can follow tutorials)

Phase 3 (Nice-to-have - Week 5+):
- Epic 3: Community Features
  (Users can connect with each other)
```

**Idunn documents this** so developers know what to build when.

---

## Step 5: Review Story Details (10 min)

For each story, Idunn includes:

### Story Format
```
Story 1.1: Build Hero Section

As a designer visiting the WDS page,
I want to see a clear hero section,
So that I understand what WDS is in 5 seconds.

Acceptance Criteria:
✅ H1 headline displays: "Whiteport Design Studio, WDS"
✅ Tagline displays with correct formatting
✅ CTA button links to GitHub repo
✅ Hero image displays on right side (desktop)
✅ Section is responsive (stacks on mobile)
✅ Matches page specification: docs/4-scenarios/1.1-wds-presentation.md

Components Used:
- wds-hero-headline (H1 Heading)
- wds-hero-tagline (H2 Heading)
- wds-hero-body (Body Paragraph)
- wds-hero-cta (Button Primary)
- wds-hero-illustration (Hero Image)

Design System References:
- Button Primary (see: docs/5-design-system/components/buttons.md)
- Heading styles (see: docs/5-design-system/00-design-tokens.md)

Technical Notes:
- Ensure Object IDs match spec (for future updates)
- Image should be lazy-loaded for performance
- CTA should have proper focus state for accessibility
```

**Your job:**
- ✅ Confirm acceptance criteria are clear
- ✅ Ensure all components are referenced
- ✅ Add any missing requirements

---

## Step 6: Create the Handoff Package (5 min)

Idunn assembles everything into a handoff package:

```
/docs/6-design-delivery/
├── 00-handoff-overview.md
├── 01-epic-breakdown.md
├── 02-implementation-roadmap.md
├── stories/
│   ├── story-1.1-hero-section.md
│   ├── story-1.2-capabilities-section.md
│   └── ...
└── developer-guide.md
```

**Handoff Overview includes:**
- Links to all page specifications
- Links to Design System
- How to read Object IDs
- How to interpret content with language tags
- Testing expectations

---

## Step 7: Hand Off to Developers (5 min)

**Share with your dev team:**

1. **The handoff package** (folder above)
2. **Access to full specs** (all `/docs/` folders)
3. **A kickoff meeting** (30 min to walk through)

**In the meeting, explain:**
- "Here's the Design Delivery PRD - epics and stories"
- "Each story links to page specifications"
- "All components are in the Design System docs"
- "Object IDs help you track what's what"
- "Questions? Ask now or ping me anytime"

**Developers now have:**
- ✅ Clear implementation roadmap
- ✅ Detailed specifications for every element
- ✅ Component library for consistency
- ✅ Acceptance criteria for every story
- ✅ Your design intent preserved

---

## Common Questions

**Q: Do developers have to follow the stories exactly?**  
**A:** Stories are a starting point. Developers may adjust based on technical constraints. Stay in the loop!

**Q: What if developers have questions?**  
**A:** Encourage them to reference page specs and Design System first. Then ping you for clarification.

**Q: Should I attend standup meetings?**  
**A:** YES! Stay involved to catch misinterpretations early.

**Q: What if they want to change the design?**  
**A:** Discuss WHY (technical constraints? Better UX idea?). Update specs if agreed.

---

## What You've Accomplished

🎉 **You just handed off your design like a pro!**

**You didn't need to:**
- ❌ Write user stories yourself
- ❌ Estimate development time
- ❌ Create Jira tickets manually
- ❌ Translate design language to dev language

**You just:**
- ✅ Confirmed Idunn's epic breakdown made sense
- ✅ Prioritized implementation order
- ✅ Reviewed stories for accuracy
- ✅ Handed off with confidence

**That's the WDS superpower:** Design with intent. Hand off with clarity. Trust it gets built right.

---

## What Happens Next?

**Developers build.** Your specs guide them.

**Your role during development:**
- Answer questions (specs might need clarification)
- Review implementations (does it match the spec?)
- Update specs if requirements change

**After launch:**
BMM workflows take over for testing, iteration, and ongoing development.

---

## Next Steps

**Want to learn more?**
- Review the [Design Delivery Workflow](../../workflows/6-design-deliveries/) for advanced topics
- Explore BMM (BMAD Management Method) for ongoing development

**Start a new project?**
- Go back to [Module 03: Alignment & Signoff](../module-03-alignment-signoff/tutorial-03.md)
- Or jump to [Module 04: Project Brief](../module-04-project-brief/tutorial-04.md)

---

**Pro Tip:** Great handoffs aren't "throw it over the wall." Stay engaged during development. Answer questions. Review builds. Your design intent is worth protecting. WDS gives you the tools - you provide the oversight.

🎯 **Congratulations! You've completed the core WDS workflow!**

