# Tutorial 09: Design System

**Extract patterns from your pages - turn one-off designs into reusable superpowers**

---

## Overview

You've designed several pages. You notice you keep recreating the same buttons, cards, and form fields. There's a better way.

**Create a Design System** - extract reusable components once, use them everywhere.

**Your superpower:** Freya helps you identify patterns, document components, and create a library that scales your design decisions across the entire product.

**Time:** 45-60 minutes  
**Prerequisites:** Module 08 completed (At least 2-3 pages designed)  
**What you'll create:** Component Library & Design Tokens

---

## What You'll Learn

- What a Design System is (and why it saves you time)
- How to identify reusable patterns in your designs
- How Freya extracts components automatically
- How to document components for consistency

---

## What is a Design System?

**Design System** = Your design decisions, extracted and reusable.

Instead of:
- ❌ Designing every button from scratch
- ❌ Remembering which blue you used last time
- ❌ Recreating forms on every page

You have:
- ✅ Button component (all states documented)
- ✅ Color tokens (brand blue, semantic colors)
- ✅ Form patterns (ready to reuse)

**Think of it as:**  
Design System = Your design vocabulary, organized and ready to use

---

## What to Expect: The Extraction Process

**Here's how a real session with Freya looks:**

### Freya's Opening
```
Hi! Ready to create your Design System?

I've analyzed your page specifications. I found some great patterns!

Let me show you what I discovered, and you tell me if I got it right.
We'll name things together and document them properly.

This will be collaborative - you're the design expert, I'm the organizer.
```

### Example Pattern Recognition

**Freya Identifies Components:**
```
Freya: "I scanned your 3 pages and found these button patterns:

         Pattern 1 (used 12 times):
         - Blue background (#1e3a5f)
         - White text, 18px, semibold
         - Rounded corners (8px)
         - Used for: Submit, Save, Confirm actions

         Pattern 2 (used 8 times):
         - Transparent background
         - Blue border (#1e3a5f)
         - Blue text
         - Used for: Cancel, Back, Secondary actions

         Pattern 3 (used 24 times):
         - No background, no border
         - Blue text with underline on hover
         - Used for: Navigation links, "Learn more"

         Should we call these:
         - Button Primary
         - Button Secondary
         - Text Link
         
         Sound good?"

You: "Yes! But let's call Pattern 3 'Link Button' instead."

Freya: "Perfect. Updated! 🎯"
```

**Freya Finds Inconsistencies:**
```
Freya: "Heads up! I found a slight inconsistency:

         On Page 1, your primary button uses #1e3a5f (deep blue)
         On Page 3, it uses #1e4a7f (slightly different blue)

         Which one should be the standard?"

You: "Oh! Page 1 is correct - #1e3a5f."

Freya: "Got it. I'll document #1e3a5f as the brand primary color.
         Should I flag Page 3 for update in the spec?"

You: "Yes please!"

Freya: "Done. Added to quality check list. ✅"
```

### Example Questions Freya Asks

**About Naming:**
```
Freya: "I found 3 different card layouts. Help me name them:

         Card Type A: Image on top, title, description, CTA button
         Card Type B: Small image left, title and text right
         Card Type C: Icon in circle, title, 3-line description

         What should we call these?"

You: "Type A is a 'Feature Card'
      Type B is a 'Task Card'
      Type C is a 'Capability Card'"

Freya: "Love it. Those names make sense! Documented. 📝"
```

**About Design Tokens:**
```
Freya: "I extracted these colors from your pages:

         Blues: #1e3a5f, #2c4f7c, #3d6399
         Are these:
         - Different brand colors? OR
         - The same color in different states (default, hover, active)?

You: "#1e3a5f is the main brand blue
      #2c4f7c is hover state
      #3d6399 is... hmm, I'm not sure where that came from"

Freya: "Found it - Page 2, Benefits section background.
         Should that be a separate color called 'Background Blue'?
         Or should it use the main brand blue?"

You: "Ah! It should be a lighter tint for backgrounds. Let's call it
      'Brand Blue Light' and make it consistent."

Freya: "Perfect! I'll document:
         - Brand Blue (#1e3a5f) - primary
         - Brand Blue Hover (#2c4f7c) - interaction
         - Brand Blue Light (#3d6399) - backgrounds
         
         Should I update Page 2 spec?"

You: "Yes!"
```

### Built-in Guidance from Freya

**When you're building your first Design System:**
```
Freya: "This is your first Design System, right?

         Pro tip: Don't try to document everything perfectly.
         Start with the basics:
         ✅ Buttons (you use them everywhere)
         ✅ Colors (brand consistency matters)
         ✅ Typography (H1, H2, body text)
         ✅ Spacing (consistent gaps)

         We can add more as you design more pages.
         Sound good?"

You: "Yes! That feels manageable."

Freya: "Great! Let's start there. We'll keep it simple and practical."
```

**When components are almost the same:**
```
Freya: "I found two button patterns that are 95% identical:

         Both have:
         - Blue background
         - White text
         - 8px border radius
         
         Only difference:
         - One is 44px tall (regular)
         - One is 56px tall (large)

         Should we make these:
         - Two separate components? OR
         - One component with size variants?"

You: "One component with variants - 'Button Primary (Regular)' 
      and 'Button Primary (Large)'"

Freya: "Smart! That keeps your system clean. One component,
         two sizes. Documented! 🎯"
```

**About Usage Guidelines:**
```
Freya: "For Button Primary, I'm adding usage guidelines:

         ✅ Use for primary actions (submit, save, next)
         ✅ Only one per page section
         ❌ Don't use for destructive actions (delete, remove)

         Does that match your intent?"

You: "Yes! And add: Button text should be action verbs."

Freya: "Added! These guidelines will help keep your design consistent."
```

### What Freya Creates While You Talk

As you review patterns, Freya is:
- 📋 Cataloging components (buttons, forms, cards)
- 🎨 Extracting design tokens (colors, spacing, typography)
- 📏 Documenting variants (sizes, states, types)
- ✍️ Writing usage guidelines (when to use, when not to)
- 🔗 Linking to page specs (where each component is used)

**You'll see progress updates:**
```
Freya: "✅ 5 button components documented
         ✅ 8 color tokens extracted
         ✅ 3 card patterns identified
         🔄 Working on form components..."
```

### The Collaborative Flow

**It's a conversation, not a form:**
```
You: "Actually, I think the 'Task Card' should have a checkbox option."

Freya: "Great catch! Should the checkbox be:
         - Always visible? OR
         - Only on hover? OR
         - A separate variant?"

You: "Separate variant - 'Task Card (Selectable)'"

Freya: "Perfect. I'll document both variants:
         - Task Card (Standard)
         - Task Card (Selectable)
         
         Updated the component library! ✅"
```

---

## Step 1: Understand the Power (5 min)

**Without Design System:**
```
Page 1: Create "Submit" button
Page 2: Create "Submit" button (slightly different)
Page 3: Create "Submit" button (now it's inconsistent)
Update brand color → Update 47 buttons manually 😱
```

**With Design System:**
```
Design System: Define Button Primary
Page 1: Use Button Primary
Page 2: Use Button Primary
Page 3: Use Button Primary
Update brand color → Update 1 component, changes everywhere 🎉
```

**You save time. Users get consistency.**

---

## Step 2: Activate Freya for Extraction (2 min)

```
@freya

I'm ready to create a Design System from my page specifications.

I have these pages designed:
- [Page 1 name]
- [Page 2 name]
- [Page 3 name]

Please help me extract reusable components.
```

**Freya will analyze** your pages and identify patterns.

---

## Step 3: Review What Freya Found (15 min)

Freya scans your pages and identifies:

### Components She'll Extract
- **Buttons:** Primary, Secondary, Text links
- **Forms:** Input fields, Dropdowns, Checkboxes
- **Cards:** Content cards, Profile cards
- **Navigation:** Headers, Footers, Menus
- **Feedback:** Success messages, Error states, Loading indicators

**She'll say something like:**
```
I found these patterns:

Buttons (3 variants):
- Primary Button (used 12 times across 3 pages)
- Secondary Button (used 8 times)
- Text Link (used 24 times)

Cards (2 types):
- Task Card (used 15 times)
- Profile Card (used 3 times)

Do these look right? Any I missed?
```

**Your job:**
- ✅ Confirm patterns she found
- ✅ Point out any she missed
- ✅ Name variants clearly ("Primary Button" not "Blue Button")

---

## Step 4: Define Design Tokens (10 min)

**Design Tokens** = The atomic values your components use.

Freya will extract:

### Colors
```
Brand Colors:
- Primary: #1e3a5f (deep blue)
- Accent: #ff6b35 (coral)

Semantic Colors:
- Success: #22c55e
- Error: #ef4444
- Warning: #f59e0b
```

### Typography
```
Heading 1: 48px, Bold, 1.2 line height
Heading 2: 32px, Semibold, 1.3 line height
Body: 16px, Regular, 1.6 line height
```

### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

**Your job:**
- ✅ Confirm these match your intent
- ✅ Name them meaningfully ("Primary" not "Blue")
- ✅ Add any she missed

---

## Step 5: Document Components (15 min)

For each component, Freya creates documentation:

### Example: Primary Button

**Component Name:** Button Primary  
**Object ID Pattern:** `{page}-{section}-{element}`

**States:**
- **Default:** Blue background, white text
- **Hover:** Darker blue, scale 1.05
- **Active:** Even darker, scale 0.98
- **Disabled:** Gray background, gray text
- **Loading:** Blue background, spinner icon

**Content Structure:**
```
- Label (EN): [Button text]
- Icon (optional): [Icon name]
```

**Usage Guidelines:**
- Use for primary actions (submit, save, confirm)
- Only ONE primary button per page/section
- Button text = action verb ("Save", "Submit", "Confirm")

**Accessibility:**
- Min touch target: 44x44px
- Keyboard accessible (Enter/Space)
- Focus indicator visible

**Freya documents** all this. You just review and confirm.

---

## Step 6: Create the Component Library (5 min)

Freya saves your Design System:

```
/docs/5-design-system/
├── 00-design-tokens.md
├── components/
│   ├── buttons.md
│   ├── forms.md
│   ├── cards.md
│   └── navigation.md
├── patterns/
│   ├── form-patterns.md
│   └── layout-patterns.md
└── guidelines/
    ├── accessibility.md
    └── usage-rules.md
```

**Now you can:**
- Reference components in new page specs
- Ensure consistency across your product
- Update once, apply everywhere

---

## Step 7: Use Your Design System (Ongoing)

**When designing new pages:**

Instead of:
```markdown
#### Submit Button
- Style: Blue button, 18px, semibold...
```

You write:
```markdown
#### Submit Button
**Component:** Button Primary
**Content:** "Save Changes"
```

**Freya knows** what "Button Primary" means. Developers know too. Consistency guaranteed.

---

## Common Questions

**Q: When should I create a Design System?**  
**A:** After 2-3 pages are designed. Patterns become clear.

**Q: Can I update components later?**  
**A:** Yes! Update the Design System doc, then update specs that use it.

**Q: What if a page needs a unique button?**  
**A:** Document why it's unique. If you use it again, add it to the system.

**Q: Do I need Figma components?**  
**A:** Not required. WDS Design System is specification-focused. You can sync to Figma later if you want.

---

## What You've Accomplished

🎉 **You just created a Design System!**

**You didn't need to:**
- ❌ Manually catalog every component
- ❌ Create a Figma component library first
- ❌ Understand design tokens theory
- ❌ Build a Storybook

**You just:**
- ✅ Designed a few pages naturally
- ✅ Let Freya identify patterns
- ✅ Reviewed and confirmed
- ✅ Named things clearly

**That's the WDS superpower:** Design naturally. Extract patterns automatically. Scale effortlessly.

---

## Next Steps

**Ready to hand off to developers?**  
→ [Module 10: Design Delivery](../module-10-design-delivery/tutorial-10.md)

**Want to design more pages first?**  
Go back to [Module 08: Initialize Scenario](../module-08-initialize-scenario/tutorial-08.md) and your Design System will grow with you.

---

**Pro Tip:** Your Design System doesn't need to be "complete" before you hand off. Start small (buttons, forms, colors). Add more as you design more pages. It's a living system that grows with your product.

