# Create UX Design Workflow Validation Checklist

**Purpose**: Validate UX Design Specification is complete, collaborative, and implementation-ready.

**Paradigm**: Visual collaboration-driven, not template generation

**Expected Outputs**:

- ux-design-specification.md
- ux-color-themes.html (color theme visualizer)
- ux-design-directions.html (design mockups)
- Optional: ux-prototype.html, ux-component-showcase.html, ai-frontend-prompt.md

---

## 1. Output Files Exist

- [ ] **ux-design-specification.md** created in output folder
- [ ] **ux-color-themes.html** generated (interactive color exploration)
- [ ] **ux-design-directions.html** generated (6-8 design mockups)
- [ ] No unfilled {{template_variables}} in specification
- [ ] All sections have content (not placeholder text)

---

## 2. Collaborative Process Validation

**The workflow should facilitate decisions WITH the user, not FOR them**

- [ ] **Design system chosen by user** (not auto-selected)
- [ ] **Color theme selected from options** (user saw visualizations and chose)
- [ ] **Design direction chosen from mockups** (user explored 6-8 options)
- [ ] **User journey flows designed collaboratively** (options presented, user decided)
- [ ] **UX patterns decided with user input** (not just generated)
- [ ] **Decisions documented WITH rationale** (why each choice was made)

---

## 3. Visual Collaboration Artifacts

### Color Theme Visualizer

- [ ] **HTML file exists and is valid** (ux-color-themes.html)
- [ ] **Shows 3-4 theme options** (or documented existing brand)
- [ ] **Each theme has complete palette** (primary, secondary, semantic colors)
- [ ] **Live UI component examples** in each theme (buttons, forms, cards)
- [ ] **Side-by-side comparison** enabled
- [ ] **User's selection documented** in specification

### Design Direction Mockups

- [ ] **HTML file exists and is valid** (ux-design-directions.html)
- [ ] **6-8 different design approaches** shown
- [ ] **Full-screen mockups** of key screens
- [ ] **Design philosophy labeled** for each direction (e.g., "Dense Dashboard", "Spacious Explorer")
- [ ] **Interactive navigation** between directions
- [ ] **Responsive preview** toggle available
- [ ] **User's choice documented WITH reasoning** (what they liked, why it fits)

---

## 4. Design System Foundation

- [ ] **Design system chosen** (or custom design decision documented)
- [ ] **Current version identified** (if using established system)
- [ ] **Components provided by system documented**
- [ ] **Custom components needed identified**
- [ ] **Decision rationale clear** (why this system for this project)

---

## 5. Core Experience Definition

- [ ] **Defining experience articulated** (the ONE thing that makes this app unique)
- [ ] **Novel UX patterns identified** (if applicable)
- [ ] **Novel patterns fully designed** (interaction model, states, feedback)
- [ ] **Core experience principles defined** (speed, guidance, flexibility, feedback)

---

## 6. Visual Foundation

### Color System

- [ ] **Complete color palette** (primary, secondary, accent, semantic, neutrals)
- [ ] **Semantic color usage defined** (success, warning, error, info)
- [ ] **Color accessibility considered** (contrast ratios for text)
- [ ] **Brand alignment** (follows existing brand or establishes new identity)

### Typography

- [ ] **Font families selected** (heading, body, monospace if needed)
- [ ] **Type scale defined** (h1-h6, body, small, etc.)
- [ ] **Font weights documented** (when to use each)
- [ ] **Line heights specified** for readability

### Spacing & Layout

- [ ] **Spacing system defined** (base unit, scale)
- [ ] **Layout grid approach** (columns, gutters)
- [ ] **Container widths** for different breakpoints

---

## 7. Design Direction

- [ ] **Specific direction chosen** from mockups (not generic)
- [ ] **Layout pattern documented** (navigation, content structure)
- [ ] **Visual hierarchy defined** (density, emphasis, focus)
- [ ] **Interaction patterns specified** (modal vs inline, disclosure approach)
- [ ] **Visual style documented** (minimal, balanced, rich, maximalist)
- [ ] **User's reasoning captured** (why this direction fits their vision)

---

## 8. User Journey Flows

- [ ] **All critical journeys from PRD designed** (no missing flows)
- [ ] **Each flow has clear goal** (what user accomplishes)
- [ ] **Flow approach chosen collaboratively** (user picked from options)
- [ ] **Step-by-step documentation** (screens, actions, feedback)
- [ ] **Decision points and branching** defined
- [ ] **Error states and recovery** addressed
- [ ] **Success states specified** (completion feedback)
- [ ] **Mermaid diagrams or clear flow descriptions** included

---

## 9. Component Library Strategy

- [ ] **All required components identified** (from design system + custom)
- [ ] **Custom components fully specified**:
  - Purpose and user-facing value
  - Content/data displayed
  - User actions available
  - All states (default, hover, active, loading, error, disabled)
  - Variants (sizes, styles, layouts)
  - Behavior on interaction
  - Accessibility considerations
- [ ] **Design system components customization needs** documented

---

## 10. UX Pattern Consistency Rules

**These patterns ensure consistent UX across the entire app**

- [ ] **Button hierarchy defined** (primary, secondary, tertiary, destructive)
- [ ] **Feedback patterns established** (success, error, warning, info, loading)
- [ ] **Form patterns specified** (labels, validation, errors, help text)
- [ ] **Modal patterns defined** (sizes, dismiss behavior, focus, stacking)
- [ ] **Navigation patterns documented** (active state, breadcrumbs, back button)
- [ ] **Empty state patterns** (first use, no results, cleared content)
- [ ] **Confirmation patterns** (when to confirm destructive actions)
- [ ] **Notification patterns** (placement, duration, stacking, priority)
- [ ] **Search patterns** (trigger, results, filters, no results)
- [ ] **Date/time patterns** (format, timezone, pickers)

**Each pattern should have:**

- [ ] Clear specification (how it works)
- [ ] Usage guidance (when to use)
- [ ] Examples (concrete implementations)

---

## 11. Responsive Design

- [ ] **Breakpoints defined** for target devices (mobile, tablet, desktop)
- [ ] **Adaptation patterns documented** (how layouts change)
- [ ] **Navigation adaptation** (how nav changes on small screens)
- [ ] **Content organization changes** (multi-column to single, grid to list)
- [ ] **Touch targets adequate** on mobile (minimum size specified)
- [ ] **Responsive strategy aligned** with chosen design direction

---

## 12. Accessibility

- [ ] **WCAG compliance level specified** (A, AA, or AAA)
- [ ] **Color contrast requirements** documented (ratios for text)
- [ ] **Keyboard navigation** addressed (all interactive elements accessible)
- [ ] **Focus indicators** specified (visible focus states)
- [ ] **ARIA requirements** noted (roles, labels, announcements)
- [ ] **Screen reader considerations** (meaningful labels, structure)
- [ ] **Alt text strategy** for images
- [ ] **Form accessibility** (label associations, error identification)
- [ ] **Testing strategy** defined (automated tools, manual testing)

---

## 13. Coherence and Integration

- [ ] **Design system and custom components visually consistent**
- [ ] **All screens follow chosen design direction**
- [ ] **Color usage consistent with semantic meanings**
- [ ] **Typography hierarchy clear and consistent**
- [ ] **Similar actions handled the same way** (pattern consistency)
- [ ] **All PRD user journeys have UX design**
- [ ] **All entry points designed**
- [ ] **Error and edge cases handled**
- [ ] **Every interactive element meets accessibility requirements**
- [ ] **All flows keyboard-navigable**
- [ ] **Colors meet contrast requirements**

---

## 14. Cross-Workflow Alignment (Epics File Update)

**As UX design progresses, you discover implementation details that affect the story breakdown**

### Stories Discovered During UX Design

- [ ] **Review epics.md file** for alignment with UX design
- [ ] **New stories identified** during UX design that weren't in epics.md:
  - [ ] Custom component build stories (if significant)
  - [ ] UX pattern implementation stories
  - [ ] Animation/transition stories
  - [ ] Responsive adaptation stories
  - [ ] Accessibility implementation stories
  - [ ] Edge case handling stories discovered during journey design
  - [ ] Onboarding/empty state stories
  - [ ] Error state handling stories

### Story Complexity Adjustments

- [ ] **Existing stories complexity reassessed** based on UX design:
  - [ ] Stories that are now more complex (UX revealed additional requirements)
  - [ ] Stories that are simpler (design system handles more than expected)
  - [ ] Stories that should be split (UX design shows multiple components/flows)
  - [ ] Stories that can be combined (UX design shows they're tightly coupled)

### Epic Alignment

- [ ] **Epic scope still accurate** after UX design
- [ ] **New epic needed** for discovered work (if significant)
- [ ] **Epic ordering might change** based on UX dependencies

### Action Items for Epics File Update

- [ ] **List of new stories to add** to epics.md documented
- [ ] **Complexity adjustments noted** for existing stories
- [ ] **Update epics.md** OR flag for architecture review first
- [ ] **Rationale documented** for why new stories/changes are needed

**Note:** If significant story changes are identified, consider running architecture workflow BEFORE updating epics.md, since architecture decisions might reveal additional adjustments needed.

---

## 15. Decision Rationale

**Unlike template-driven workflows, this workflow should document WHY**

- [ ] **Design system choice has rationale** (why this fits the project)
- [ ] **Color theme selection has reasoning** (why this emotional impact)
- [ ] **Design direction choice explained** (what user liked, how it fits vision)
- [ ] **User journey approaches justified** (why this flow pattern)
- [ ] **UX pattern decisions have context** (why these patterns for this app)
- [ ] **Responsive strategy aligned with user priorities**
- [ ] **Accessibility level appropriate for deployment intent**

---

## 16. Implementation Readiness

- [ ] **Designers can create high-fidelity mockups** from this spec
- [ ] **Developers can implement** with clear UX guidance
- [ ] **Sufficient detail** for frontend development
- [ ] **Component specifications actionable** (states, variants, behaviors)
- [ ] **Flows implementable** (clear steps, decision logic, error handling)
- [ ] **Visual foundation complete** (colors, typography, spacing all defined)
- [ ] **Pattern consistency enforceable** (clear rules for implementation)

---

## 17. Critical Failures (Auto-Fail)

- [ ] ❌ **No visual collaboration** (color themes or design mockups not generated)
- [ ] ❌ **User not involved in decisions** (auto-generated without collaboration)
- [ ] ❌ **No design direction chosen** (missing key visual decisions)
- [ ] ❌ **No user journey designs** (critical flows not documented)
- [ ] ❌ **No UX pattern consistency rules** (implementation will be inconsistent)
- [ ] ❌ **Missing core experience definition** (no clarity on what makes app unique)
- [ ] ❌ **No component specifications** (components not actionable)
- [ ] ❌ **Responsive strategy missing** (for multi-platform projects)
- [ ] ❌ **Accessibility ignored** (no compliance target or requirements)
- [ ] ❌ **Generic/templated content** (not specific to this project)

---

## Validation Notes

**Document findings:**

- UX Design Quality: [Exceptional / Strong / Adequate / Needs Work / Incomplete]
- Collaboration Level: [Highly Collaborative / Collaborative / Somewhat Collaborative / Generated]
- Visual Artifacts: [Complete & Interactive / Partial / Missing]
- Implementation Readiness: [Ready / Needs Design Phase / Not Ready]

## **Strengths:**

## **Areas for Improvement:**

## **Recommended Actions:**

**Ready for next phase?** [Yes - Proceed to Design / Yes - Proceed to Development / Needs Refinement]

---

_This checklist validates collaborative UX design facilitation, not template generation. A successful UX workflow creates design decisions WITH the user through visual exploration and informed choices._
