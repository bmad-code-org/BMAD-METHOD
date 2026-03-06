# Capture Quality Guide

Reference for writing high-quality Design Space entries.

## The Quality Formula

**Good capture = Specific + Contextual + Actionable + Tagged**

Each element:
- **Specific:** Includes concrete values, names, measurements — not vague adjectives
- **Contextual:** Says where it was tested, which project, what constraints existed
- **Actionable:** Another agent reading this can apply it without more research
- **Tagged:** Topics and components make it findable via semantic search

## Examples by Category

### successful_pattern
```
"Coral (#e8734a) CTA buttons on navy (#0a1628) backgrounds achieve strong
contrast while maintaining brand warmth. Tested across Whiteport's full page —
the coral is used sparingly (3 times) which prevents fatigue and makes each
CTA a clear focal point. Works because the warm accent against cool background
creates visual tension that draws the eye without feeling aggressive."
```

### component_experience
```
"Component: Radix Dialog
Context: Kalla booking flow, 3 nested states (select → confirm → payment)
Behavior: Focus trap works perfectly. Z-index conflicts with sticky header
at z-50 when dialog opens from below-fold. Scroll lock works on iOS Safari.
Solution: Portal to body, set z-index to 100.
Transferable: Always portal modals when sticky positioned elements exist."
```

### methodology
```
"Running site analysis with 25-second delays between visual captures (Voyage AI
free tier = 3 RPM) is actually beneficial — the forced pause creates time for
more thoughtful descriptions. Rushing leads to vague captures. The constraint
improves quality. Implication: even on paid tier, don't batch-capture without
writing good descriptions first."
```

### agent_experience
```
"When the designer says 'try something different,' resist the urge to change
everything. Usually one dimension is the issue — find it by asking 'What part
works already?' This preserves the good decisions and only changes what needs
changing. Learned during Whiteport hero section iteration."
```

## Anti-patterns

| What | Why It's Bad | Better |
|------|-------------|--------|
| "X is good" | No context, no actionability | "X works for Y because Z" |
| "Designer hated this" | Complaint, not learning | "Improved from X to Y because Z" |
| "Changed the spacing" | Too vague to reuse | "Increased section padding from 48px to 80px for better breathing room on desktop" |
| One giant entry | Unfindable, mixing concerns | One entry per insight |
| No tags | Can't search for it | Always add topics + components |

## Minimum Content Length

- `capture_knowledge`: 50-200 words (enough for context + actionability)
- `capture_visual`: 200-400 words (detailed description of what you see + why it works)
- `capture_feedback_pair`: 50-100 words per side + reasoning

## Tag Vocabulary

Use consistent tags across projects:

### Design Dimensions
`typography`, `color`, `spacing`, `layout`, `hierarchy`, `animation`, `responsive`, `accessibility`

### Brand Qualities
`elegance`, `warmth`, `minimalism`, `boldness`, `playfulness`, `professionalism`

### Page Areas
`hero`, `navigation`, `footer`, `sidebar`, `content-area`, `above-fold`

### Component Types
`button`, `card`, `modal`, `form`, `table`, `list`, `accordion`, `carousel`
