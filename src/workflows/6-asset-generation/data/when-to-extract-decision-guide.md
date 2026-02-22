# When to Extract Prototypes to Figma - Decision Guide

**Purpose:** Help designers decide when to extract HTML prototypes to Figma for visual refinement.

**Quick Answer:** Extract when the design system is incomplete and the prototype needs visual polish.

---

## Decision Tree

```
Prototype Created
      ↓
Does it look polished?
      ↓
    ┌─────┴─────┐
   YES          NO
    ↓            ↓
Complete    Is design system incomplete?
              ↓
            ┌─────┴─────┐
           YES          NO
            ↓            ↓
      Extract to    Quick CSS fixes
         Figma      sufficient
            ↓
      Refine design
            ↓
      Update design system
            ↓
      Re-render prototype
            ↓
      Iterate or Complete
```

---

## Quick Assessment Checklist

### ✅ Extract to Figma if:

- [ ] Prototype not visually appealing or unpolished
- [ ] Design system missing components for this view
- [ ] Need to define new design tokens (colors, spacing, typography)
- [ ] Stakeholder presentation requires high-fidelity
- [ ] Multiple similar components need standardization
- [ ] Visual hierarchy unclear
- [ ] Spacing/alignment inconsistent

### ❌ Don't Extract if:

- [ ] Prototype already looks good
- [ ] Design system covers all needs
- [ ] Still validating functionality
- [ ] Rapid iteration more important than polish
- [ ] Early exploration phase
- [ ] Internal testing only

---

## Scenarios

### Scenario 1: First Page in Project

**Situation:** Creating first prototype, design system is empty

**Decision:** ✅ **Extract to Figma**

**Reason:** Need to establish design foundation
- Define color palette
- Set typography scale
- Create spacing system
- Build first components

**Workflow:**
1. Create basic prototype (functional)
2. Extract to Figma
3. Define complete design system
4. Re-render with design system
5. Use for all subsequent pages

---

### Scenario 2: Similar to Existing Pages

**Situation:** Design system already has most components needed

**Decision:** ❌ **Don't Extract**

**Reason:** Design system sufficient
- Reuse existing components
- Apply existing tokens
- Minor variations can be CSS tweaks

**Workflow:**
1. Create prototype with design system
2. Test functionality
3. Make minor CSS adjustments if needed
4. Complete

---

### Scenario 3: New Component Type Needed

**Situation:** Page needs component type not in design system (e.g., data table)

**Decision:** ✅ **Extract to Figma**

**Reason:** Need to design new component properly
- Define component structure
- Create variants and states
- Document design tokens
- Add to design system

**Workflow:**
1. Create basic prototype
2. Extract to Figma
3. Design new component thoroughly
4. Add to design system
5. Re-render prototype
6. Component now available for future use

---

### Scenario 4: Stakeholder Presentation

**Situation:** Working prototype exists but looks basic, client review tomorrow

**Decision:** ✅ **Extract to Figma**

**Reason:** Need polished visuals for presentation
- Apply professional styling
- Refine visual hierarchy
- Add polish (shadows, effects)
- Create presentation-ready mockups

**Workflow:**
1. Extract current prototype
2. Polish in Figma quickly
3. Present Figma mockups
4. After approval, update design system
5. Re-render for development

---

### Scenario 5: Rapid Prototyping Phase

**Situation:** Testing multiple concepts quickly, designs will change

**Decision:** ❌ **Don't Extract**

**Reason:** Too early for polish
- Focus on functionality
- Validate concepts first
- Avoid polishing throwaway work

**Workflow:**
1. Create basic prototypes
2. Test with users
3. Iterate on functionality
4. Once concept validated, then extract for polish

---

## Design System Maturity Levels

### Level 1: Empty (0-5 components)

**Typical Decision:** Extract to Figma
**Reason:** Need to build foundation
**Focus:** Establish design tokens and core components

### Level 2: Growing (6-15 components)

**Typical Decision:** Extract when gaps found
**Reason:** Fill missing pieces
**Focus:** Expand component library strategically

### Level 3: Mature (16+ components)

**Typical Decision:** Rarely extract
**Reason:** Most needs covered
**Focus:** Reuse existing, minor variations only

---

## Cost-Benefit Analysis

### Benefits of Extracting

**Design Quality:**
- Professional visual polish
- Consistent design system
- Reusable components
- Better stakeholder buy-in

**Long-term Efficiency:**
- Design system grows
- Future prototypes faster
- Reduced design debt
- Team alignment

### Costs of Extracting

**Time Investment:**
- Extraction process: 15-30 min
- Figma refinement: 1-3 hours
- Design system update: 30-60 min
- Re-rendering: 15-30 min
- **Total: 2-5 hours per page**

**Workflow Overhead:**
- Context switching
- Tool learning curve
- Sync maintenance
- Version tracking

---

## When Time is Limited

### High Priority: Extract

**These pages justify the time investment:**
- Landing pages (first impression)
- Onboarding flows (user retention)
- Checkout/payment (conversion critical)
- Dashboard (frequent use)
- Marketing pages (brand representation)

### Lower Priority: Skip

**These pages can stay basic:**
- Admin panels (internal use)
- Error pages (rare views)
- Settings pages (utility focus)
- Debug/test pages (temporary)

---

## Team Collaboration Factors

### Extract When:

**Designer-Developer Collaboration:**
- Designer needs to define visual direction
- Developer needs clear component specs
- Team needs shared design language

**Stakeholder Communication:**
- Client needs to approve visuals
- Marketing needs branded materials
- Sales needs demo materials

### Skip When:

**Solo Development:**
- One person doing design + dev
- Direct implementation faster
- No handoff needed

**Internal Tools:**
- Team understands context
- Functionality over aesthetics
- Rapid iteration valued

---

## Quality Thresholds

### Extract if Prototype Has:

**Visual Issues:**
- Inconsistent spacing
- Poor typography hierarchy
- Clashing colors
- Misaligned elements
- Unclear visual hierarchy

**Missing Design Elements:**
- No hover states
- Missing loading states
- Incomplete error states
- No disabled states
- Basic placeholder styling

**Component Gaps:**
- Custom components needed
- Existing components insufficient
- New patterns required
- Variant expansion needed

### Don't Extract if Prototype Has:

**Sufficient Quality:**
- Consistent spacing
- Clear hierarchy
- Appropriate colors
- Aligned elements
- Professional appearance

**Complete Design System Coverage:**
- All components available
- States defined
- Variants sufficient
- Tokens applied

---

## Iteration Strategy

### First Iteration

**Always extract if:**
- Establishing design foundation
- First page in project
- Setting visual direction

### Subsequent Iterations

**Extract only if:**
- Significant design system gaps
- New component types needed
- Visual quality insufficient

### Final Iteration

**Extract if:**
- Stakeholder presentation
- Production launch
- Marketing materials needed

---

## Practical Examples

### Example 1: E-commerce Product Page

**Phase 1: Sketch (Concept)**
- Designer creates hand-drawn sketch of product page
- Shows product gallery, reviews section, rating display
- Rough layout and component placement

**Phase 2: Specification (Phase 4C)**
- Freya analyzes sketch
- Creates detailed specification:
  - Product gallery: Image carousel with thumbnails
  - Reviews component: User avatar, rating, text, date
  - Rating stars: 5-star display with half-star support
- All Object IDs defined
- Content and interactions specified

**Phase 3: Prototype (Phase 4D)**
- Freya builds functional HTML prototype
- Uses existing design system (buttons, inputs, cards)
- Product gallery, reviews, ratings are basic/functional but unpolished

**Initial Assessment:**
- Prototype works functionally ✅
- Design system has: buttons, inputs, cards
- Missing: product gallery, reviews component, rating stars (visual refinement needed)

**Decision:** ✅ Extract to Figma

**Phase 4: Figma Refinement**

Freya automatically:
1. Analyzes prototype components
2. Identifies missing components (gallery, reviews, ratings)
3. Injects to Figma via MCP server
4. Page: `02-Product-Catalog / 2.3-Product-Detail`

Designer in Figma:
5. Designs product gallery component (image zoom, transitions)
6. Designs reviews component (typography, spacing, layout)
7. Designs rating component (star icons, colors, states)
8. Applies design tokens (colors, spacing, typography)

**Phase 5: Design System Update**

Freya automatically:
9. Reads refined components from Figma
10. Extracts design tokens
11. Updates design system:
    - `D-Design-System/components/product-gallery.md`
    - `D-Design-System/components/review-card.md`
    - `D-Design-System/components/rating-stars.md`

**Phase 6: Re-render**
12. Freya re-renders prototype with enhanced design system
13. Prototype now polished and professional

**Result:** 
- ✅ Polished product page
- ✅ 3 new reusable components in design system
- ✅ Specification updated (if design evolved)
- ✅ All future product pages can use these components

---

### Example 2: Settings Page

**Phase 1: Sketch (Concept)**
- Designer creates simple sketch of settings page
- Shows form fields, toggles, save button
- Standard layout, no custom components

**Phase 2: Specification (Phase 4C)**
- Freya analyzes sketch
- Creates specification:
  - Form fields: Email, password, notifications
  - Toggle switches: Email notifications, push notifications
  - Save button: Standard primary button
- All components exist in design system

**Phase 3: Prototype (Phase 4D)**
- Freya builds HTML prototype
- Uses existing design system components:
  - Form inputs (already designed)
  - Toggle switches (already designed)
  - Buttons (already designed)
- Prototype looks polished immediately

**Initial Assessment:**
- Prototype works functionally ✅
- Prototype looks polished ✅
- Design system has: forms, toggles, buttons
- All components available
- Internal use only

**Decision:** ❌ Don't Extract

**Actions:**
1. Apply existing design system ✅ (already done)
2. Minor CSS tweaks for spacing (if needed)
3. Test functionality ✅
4. Complete ✅

**Result:** 
- ✅ Functional, polished page in 30 minutes
- ✅ No Figma extraction needed
- ✅ Design system reuse successful

---

### Example 3: Landing Page

**Phase 1: Sketch (Concept)**
- Designer creates detailed sketch of landing page
- Hero section with headline, subtext, CTA
- Feature cards with icons and descriptions
- Testimonials with photos and quotes
- Multiple CTA sections throughout

**Phase 2: Specification (Phase 4C)**
- Freya analyzes sketch
- Creates comprehensive specification:
  - Hero section: Large headline, supporting text, primary CTA
  - Feature cards: Icon, title, description, learn more link
  - Testimonials: User photo, quote, name, company
  - CTA sections: Headline, button, background treatment
- All Object IDs defined
- Multi-language content specified

**Phase 3: Prototype (Phase 4D)**
- Freya builds functional HTML prototype
- Uses basic design system components
- Hero, features, testimonials are functional but basic
- Client presentation in one week (high priority!)

**Initial Assessment:**
- Prototype works functionally ✅
- Design system has basic components
- Needs visual refinement: hero section, feature cards, testimonials, CTA sections
- Client presentation next week (high stakes!)

**Decision:** ✅ Extract to Figma

**Phase 4: Figma Refinement**

Freya automatically:
1. Analyzes prototype components
2. Identifies components needing refinement (hero, features, testimonials, CTAs)
3. Injects to Figma via MCP server
4. Page: `01-Marketing / 1.1-Landing-Page`

Designer in Figma:
5. Designs hero component (brand-critical, high impact)
6. Designs feature cards (icons, layout, spacing)
7. Designs testimonial component (photos, typography)
8. Polishes CTA sections (visual hierarchy, contrast)
9. Applies brand colors, typography, spacing tokens

**Phase 5: Design System Update**

Freya automatically:
10. Reads refined components from Figma
11. Extracts design tokens and components
12. Updates design system:
    - `D-Design-System/components/hero-section.md`
    - `D-Design-System/components/feature-card.md`
    - `D-Design-System/components/testimonial.md`
    - `D-Design-System/components/cta-section.md`

**Phase 6: Re-render for Presentation**
13. Freya re-renders prototype with enhanced design system
14. Prototype now presentation-ready

**Result:** 
- ✅ Polished, professional landing page
- ✅ 4 new reusable components for future marketing pages
- ✅ Client presentation ready
- ✅ Design system significantly expanded

---

## Red Flags: When NOT to Extract

### 🚩 Premature Optimization

**Sign:** Polishing before validating concept
**Problem:** Wasting time on designs that may change
**Solution:** Validate functionality first, polish later

### 🚩 Over-Engineering

**Sign:** Creating design system for one-off pages
**Problem:** Overhead exceeds benefit
**Solution:** Keep it simple for unique pages

### 🚩 Analysis Paralysis

**Sign:** Endless refinement cycles
**Problem:** Never shipping
**Solution:** Set "good enough" threshold

### 🚩 Tool Obsession

**Sign:** Using Figma because you can, not because you should
**Problem:** Process over progress
**Solution:** Focus on outcomes, not tools

---

## Decision Matrix

| Factor | Extract | Don't Extract |
|--------|---------|---------------|
| **Design System Maturity** | Empty/Growing | Mature |
| **Visual Quality** | Needs polish | Sufficient |
| **Component Coverage** | Gaps exist | Complete |
| **Stakeholder Needs** | Presentation | Internal |
| **Time Available** | 2-5 hours | < 1 hour |
| **Page Importance** | High priority | Low priority |
| **Iteration Phase** | First/Final | Middle |
| **Team Size** | Collaborative | Solo |

**Score:** 5+ "Extract" factors → Extract to Figma
**Score:** 5+ "Don't Extract" factors → Skip extraction

---

## Questions to Ask

Before deciding, ask yourself:

1. **Does the design system have what I need?**
   - Yes → Don't extract
   - No → Consider extracting

2. **Is this page important enough to polish?**
   - Yes → Extract
   - No → Skip

3. **Do I have 2-5 hours for refinement?**
   - Yes → Can extract
   - No → Skip

4. **Will this create reusable components?**
   - Yes → Extract (investment pays off)
   - No → Skip (one-off work)

5. **Is the concept validated?**
   - Yes → Safe to polish
   - No → Too early

6. **Do stakeholders need polished visuals?**
   - Yes → Extract
   - No → Skip

---

## Best Practices

### DO ✅

1. **Extract strategically**
   - First page in project
   - High-priority pages
   - When design system gaps identified

2. **Batch extractions**
   - Extract multiple pages together
   - Efficient use of time
   - Consistent design decisions

3. **Document decisions**
   - Why extracted
   - What was refined
   - Design system updates

4. **Set time limits**
   - Don't over-polish
   - Good enough is sufficient
   - Ship working products

### DON'T ❌

1. **Don't extract everything**
   - Selective extraction
   - Focus on high-value pages
   - Skip low-priority pages

2. **Don't extract too early**
   - Validate concepts first
   - Ensure functionality works
   - Don't polish throwaway work

3. **Don't extract too late**
   - Don't accumulate design debt
   - Address gaps early
   - Build design system progressively

4. **Don't extract without plan**
   - Know what needs refinement
   - Have clear goals
   - Update design system after

---

## Summary

**Extract to Figma when:**
- Design system is incomplete
- Prototype needs visual polish
- New components required
- Stakeholder presentation needed
- High-priority page
- Time available for refinement

**Skip extraction when:**
- Design system covers all needs
- Prototype looks sufficient
- Rapid iteration more important
- Low-priority page
- Time constrained
- Early exploration phase

**Remember:** The goal is shipping polished, functional products. Extract strategically, not automatically.

---

**Use this guide to make informed decisions about when to invest time in Figma refinement versus moving forward with code-based prototypes.**
