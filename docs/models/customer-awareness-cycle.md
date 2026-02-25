# Customer Awareness Cycle

**A framework for understanding where users are in their buying journey and how to meet them there**

**Originated by:** Eugene Schwartz  
**Source:** *Breakthrough Advertising* (1966)  
**Applied in WDS:** Scenario definition, content strategy, user positioning

---

## What It Is

The **Customer Awareness Cycle** is a five-stage framework that describes a user's journey from complete unawareness to enthusiastic advocacy. It answers the critical question: *"What does my user already know, and what do they need to know next?"*

### The Five Stages

1. **Unaware** - Doesn't know problem exists
2. **Problem Aware** - Knows problem, doesn't know solutions exist
3. **Solution Aware** - Knows solutions exist, doesn't know about yours specifically
4. **Product Aware** - Knows your solution exists, hasn't committed
5. **Most Aware** - Has used, loved, and advocates for your solution

**The Core Insight:** You can't sell a solution to someone who doesn't know they have a problem. You must meet users where they are and guide them forward one stage at a time.

---

## Why It Matters

### The Problem Without Customer Awareness

Content and design often assume too much or too little:
- Landing page assumes visitors know the problem (they don't)
- Onboarding explains WHY when users already bought (they know)
- Messaging speaks to wrong awareness level
- Conversion funnels skip critical awareness stages
- Content feels irrelevant or condescending

### The Solution With Customer Awareness

Every interaction meets users where they are:
- Content depth matches awareness level
- Messaging addresses current questions
- Next steps feel natural and logical
- Progression through stages is intentional
- Success rates improve dramatically

**Example:**
- Problem Aware user needs: "Here's how solutions work"
- Product Aware user needs: "Here's why OURS is right for you"

Same user type, different content, different design.

---

## How It's Valuable in Strategic Design

### 1. **Content Strategy**

Each awareness level requires different content depth and focus:

**Unaware → Problem Aware:**
- Educational content
- "Did you know..." framing
- Problem agitation
- Relatable scenarios

**Problem Aware → Solution Aware:**
- Solution categories
- "Here's how people solve this"
- Approach explanation
- No product pitch yet

**Solution Aware → Product Aware:**
- Your specific approach
- Differentiation
- "Why us" messaging
- Product introduction

**Product Aware → Most Aware:**
- Proof and trust signals
- Onboarding and activation
- Success stories
- Community building

### 2. **Scenario Design**

Every scenario should move users forward in awareness:

```yaml
scenario:
  name: "Landing Page Visit"
  awareness_start: "Solution Aware"
  awareness_goal: "Product Aware"
  design_implication: "Show how OUR solution works, not ALL solutions"
```

This creates measurable goals and clear design direction.

### 3. **Messaging Hierarchy**

Homepage serves multiple awareness levels:

- **Hero:** Problem Aware → Solution Aware
- **Features:** Solution Aware → Product Aware  
- **Testimonials:** Product Aware → Most Aware

Each section progresses the journey.

### 4. **Microcopy and Tone**

Awareness level affects everything:
- Button labels
- Error messages
- Empty states
- Help text

**Example - Empty State:**
- Problem Aware: "Projects help you organize work. Create your first one!"
- Product Aware: "No projects yet. Ready to start?"

### 5. **Measurement and Optimization**

Track awareness progression:
- What % move from Problem → Solution Aware?
- Where do users get stuck?
- Which content advances awareness most effectively?

---

## Attribution and History

### Eugene Schwartz - The Pioneer

**Eugene Schwartz** (1927-1995) was a legendary direct response copywriter who wrote *Breakthrough Advertising* in 1966. This book, considered one of the greatest marketing books ever written, introduced the awareness stages framework.

Schwartz observed that the most successful ads matched message to awareness level. He codified this into a framework that has influenced marketing and UX for over 50 years.

### Modern Applications

While Schwartz focused on advertising copy, his framework applies powerfully to:
- User experience design
- Content strategy
- Product onboarding
- Marketing funnels
- Educational platforms

**Timeless Principle:** *"You can't tell people what they're not ready to hear."*

---

## Source Materials

### Books

📚 **Breakthrough Advertising** by Eugene Schwartz (1966)
- *The original source*
- Out of print but available as reprints
- Dense, challenging, rewarding read
- [Available on Amazon](https://www.amazon.com/Breakthrough-Advertising-Eugene-M-Schwartz/dp/0887232981) (reprints ~$125-200)

📚 **The Adweek Copywriting Handbook** by Joseph Sugarman (2006)
- Accessible introduction to Schwartz's concepts
- Practical applications
- [Available on Amazon](https://www.amazon.com/Adweek-Copywriting-Handbook-Ultimate-Writing/dp/0470051248)

### Articles and Resources

🔗 **[Copyhackers: The 5 Stages of Awareness](https://copyhackers.com/2017/05/customer-awareness/)** - Modern application to web copy

🔗 **[Digital Marketer: Customer Awareness](https://www.digitalmarketer.com/blog/customer-awareness/)** - Practical framework for online marketing

### Videos

🎥 **[Customer Awareness - The Copywriter's Secret Weapon](https://www.youtube.com/results?search_query=eugene+schwartz+customer+awareness)** - Various explainer videos on YouTube

---

## Whiteport Methods That Harness This Model

### [Trigger Mapping Guide](../method/phase-2-trigger-mapping-guide.md)

Trigger Maps can include awareness positioning for each persona:
- Different users at different awareness levels
- Scenarios designed to progress awareness
- Content strategy matches awareness

### [Scenario Definition (Phase 4)](../method/phase-4-ux-design-guide.md)

Each scenario defines awareness progression:
- Entry point awareness level
- Exit point awareness level
- Interactions designed to bridge the gap

### Content Creation Workflow

Before creating any content:
1. Identify user's current awareness level
2. Determine target awareness level
3. Create content that bridges the gap
4. Validate: Does this advance awareness?

---

## Imaginary Examples

### Example 1: SaaS Landing Page

**User:** Startup founder, Problem Aware (knows they need better project management)

**Awareness Progression:** Problem Aware → Solution Aware → Product Aware

**Page Structure:**

**Section 1 - Problem Aware → Solution Aware:**
- Headline: "Your Team Scattered Across Slack, Email, and Spreadsheets?"
- Body: Brief description of how modern teams centralize work
- CTA: "See How It Works" (not "Sign Up")

**Section 2 - Solution Aware → Product Aware:**
- Headline: "Meet [Product]: Where Work Happens"
- Body: Your specific approach and differentiators
- CTA: "Try It Free" (awareness sufficient for commitment)

### Example 2: Onboarding Flow

**User:** New signup, Product Aware → Most Aware progression needed

**Wrong Approach (assuming Unaware):**
```
"Welcome! Did you know teams waste 2.5 hours daily switching between tools?"
```
*User thinks: "I know, that's why I signed up. Get to the point."*

**Right Approach (Product Aware):**
```
"Welcome! Let's get your first project set up."
```
*User thinks: "Perfect, let's go."*

### Example 3: Feature Documentation

**User:** Existing customer, Most Aware of product but Unaware of new feature

**Structure:**
1. **Problem Agitation:** "Tired of manually updating status?" (Unaware → Problem Aware)
2. **Solution Introduction:** "Status Automations do it for you" (Problem → Solution Aware)
3. **How to Use:** "Click Settings → Automations" (Solution → Product Aware on this feature)
4. **Advanced Tips:** "Pro tip: Chain automations for..." (Product → Most Aware)

---

## Real Applications

### WDS Presentation Project

The WDS Presentation landing page considers multiple awareness levels:

**Stina (Designer):**
- Current: Solution Aware (knows design tools exist)
- Target: Product Aware (knows WDS specifically)
- Content: Shows WDS's unique approach vs generic "design tools are great"

**Lars (Executive):**
- Current: Problem Aware (knows design-dev handoff is broken)
- Target: Solution Aware (learns modern AI-assisted approaches exist)
- Content: Educates on solution category before pitching WDS

**See:** [WDS Presentation Trigger Map](../examples/WDS-Presentation/docs/2-trigger-map/00-trigger-map.md)

Each persona's current awareness level shapes how the landing page speaks to them.

---

## Detailed Stage Characteristics

### Stage 1: Unaware

**What They Know:** Nothing about problem or solutions

**What They Need:**
- Problem revelation
- Relatable scenarios
- "You're not alone" messaging
- Educational framing

**Content Types:**
- Blog posts about industry challenges
- Research reports
- "State of [Industry]" content
- Social media education

**Example Messaging:**
- "Most designers waste 15 hours/week recreating components that already exist..."
- "Did you know 73% of projects fail due to unclear requirements?"

**Don't:**
- Pitch your product
- Assume they know the problem
- Use jargon

### Stage 2: Problem Aware

**What They Know:** Problem exists and affects them

**What They Need:**
- Validation that problem is solvable
- Overview of solution approaches
- Hope and direction
- Not product-specific yet

**Content Types:**
- "How to solve [problem]" guides
- Solution category overviews
- Comparison of approaches
- Educational webinars

**Example Messaging:**
- "There are three main approaches to [problem]: [A], [B], and [C]..."
- "Teams solve this by establishing shared design systems..."

**Don't:**
- Pitch product before educating on solutions
- Assume they know solution categories

### Stage 3: Solution Aware

**What They Know:** Solution categories exist, exploring options

**What They Need:**
- Your specific approach explained
- Differentiation from other solutions
- Why YOUR way is different/better
- Still some education, less selling

**Content Types:**
- "Our approach to [problem]"
- Product overview (not features list)
- Philosophy and methodology
- Comparison content (you vs others)

**Example Messaging:**
- "Unlike traditional design tools that focus on pixels, WDS starts with user psychology..."
- "Most solutions require developers to interpret designs. WDS creates specs developers can actually use..."

**Don't:**
- List features without context
- Assume they know your differentiation

### Stage 4: Product Aware

**What They Know:** Your solution exists, evaluating it

**What They Need:**
- Proof it works (case studies, demos)
- Trust signals (testimonials, security)
- Clear path to start (pricing, trial)
- Answers to objections

**Content Types:**
- Product demos and walkthroughs
- Case studies and testimonials
- Pricing and packaging info
- FAQs and objection handling
- Free trial or demo signup

**Example Messaging:**
- "Join 1,000+ designers who've reduced handoff time by 60%..."
- "See how [Company] shipped their redesign in half the time..."
- "Start free, upgrade when you're ready"

**Don't:**
- Over-educate (they're ready to evaluate)
- Hide pricing or next steps

### Stage 5: Most Aware

**What They Know:** Your product intimately, are users/advocates

**What They Need:**
- Advanced tips and best practices
- Community and belonging
- New feature announcements
- Ways to go deeper
- Recognition and advocacy opportunities

**Content Types:**
- Advanced guides and tutorials
- Community forums and events
- Beta features and early access
- Referral and advocacy programs
- Power user showcases

**Example Messaging:**
- "Pro tip: Did you know you can chain automations?"
- "Meet Sarah, who uses WDS to design 3x faster..."
- "Invite your team, get [benefit]"

**Don't:**
- Explain basics they already know
- Treat them like newbies

---

## Common Questions

### Q: Can users skip stages?

**A:** Sometimes, but rarely. Most users progress sequentially. Trying to force jumps (Problem Aware → Most Aware) usually fails. Design for stage-by-stage progression.

### Q: Can the same content serve multiple awareness levels?

**A:** Advanced content can serve different parts to different users (Most Aware read deep, Solution Aware skim headlines). But forcing one page to serve Unaware AND Most Aware usually serves neither well.

### Q: How do I know what awareness level my users are?

**A:** Research, analytics, and testing:
- User interviews: "How did you hear about us?"
- Analytics: What content do they consume before converting?
- Surveys: "How familiar are you with [solution category]?"
- A/B testing: Which messaging resonates?

### Q: What if I have users at all levels?

**A:** Design entry points for each level:
- Blog (Unaware → Problem Aware)
- Resource Center (Problem → Solution Aware)
- Product Pages (Solution → Product Aware)
- App Login (Most Aware)

Or design sections of pages for progression (homepage hero → features → testimonials).

---

## Using Customer Awareness in Your Process

### Step 1: Identify Current Awareness

For each key user type:
- Where are they NOW?
- What research have they done?
- How did they find you?
- What do they already know?

### Step 2: Define Target Awareness

For this interaction:
- Where do we want to move them?
- What's the next stage they're ready for?
- What prevents them from progressing?

### Step 3: Design the Bridge

Create content and interactions that:
- Acknowledge current awareness
- Provide what they need to progress
- Don't assume too much knowledge
- Don't over-explain what they know

### Step 4: Measure Progression

Track:
- What % progress to next stage?
- Where do users get stuck?
- Which content advances awareness?
- What stage converts best?

### Step 5: Optimize

Adjust content and design based on data:
- Strengthen weak transitions
- Add missing bridges
- Remove awareness mismatches

---

## Customer Awareness Template

Use this template when defining scenarios or content:

```yaml
scenario: "[scenario name]"

user:
  name: "[User name/type]"
  current_awareness: "[Unaware/Problem/Solution/Product/Most]"
  target_awareness: "[Problem/Solution/Product/Most Aware]"
  
content_strategy:
  focus: "[What this awareness transition requires]"
  tone: "[How to speak to this awareness level]"
  depth: "[How much detail to include]"
  call_to_action: "[What action is appropriate for target awareness]"

measurement:
  success: "[User reached target awareness]"
  metric: "[How we measure awareness progression]"
```

---

## Next Steps

1. **Audit current content:** What awareness level does each piece assume? Does it match your users?
2. **Map user journey:** Where do users enter (awareness level) and where should they exit?
3. **Identify gaps:** Which awareness transitions are weak or missing?
4. **Design bridges:** Create content that moves users forward stage by stage
5. **Test and measure:** Track progression through awareness stages

**Related Resources:**
- [Trigger Mapping Guide](../method/phase-2-trigger-mapping-guide.md) - Uses awareness to position personas
- [Phase 4: UX Design Guide](../method/phase-4-ux-design-guide.md) - Applies awareness to scenarios

---

*Customer Awareness Cycle - Meet users where they are, guide them where they need to go.*

