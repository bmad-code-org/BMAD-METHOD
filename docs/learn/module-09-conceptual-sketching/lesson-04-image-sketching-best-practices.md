# WDS Sketching Best Practices: Images

**How to represent images in UI sketches**

---

## ✅ Recommended: Sketch the Actual Image Content

### Why Sketch Real Content?

When you sketch what the image should actually show (rather than just "X" or "image here"), you:

- **Provide visual direction** - Designer/developer understands image purpose
- **Enable AI interpretation** - Agent can suggest appropriate image content
- **Guide art direction** - Photographer/illustrator knows what's needed
- **Communicate intent** - Stakeholders visualize the final design
- **Inspire creativity** - More engaging than abstract placeholders

---

## Image Sketching Techniques

### 1. Portrait/Profile Photos

**Sketch a simple face:**

```
┌──────────────┐
│   ◠  ◠       │  ← Simple eyes
│              │
│      ᵕ       │  ← Simple smile
└──────────────┘
```

or

```
┌──────────────┐
│   ●  ●       │  ← Dots for eyes
│              │
│    \_/       │  ← Smile
└──────────────┘
```

**Purpose:** Profile pictures, team photos, author avatars, user images

### 2. Hero Images / Backgrounds

**Sketch landscape/scenery:**

```
┌──────────────────────────┐
│                          │
│    /\   /\    /\         │  ← Mountains
│   /  \ /  \  /  \        │
│  /    X    \/    \       │
└──────────────────────────┘
```

**Sketch clouds/sky:**

```
┌──────────────────────────┐
│  ~   ~      ~            │
│    ~    ~      ~   ~     │  ← Soft clouds
│       ~           ~      │
│                          │
└──────────────────────────┘
```

**Sketch abstract shapes:**

```
┌──────────────────────────┐
│   ∿∿∿     ≈≈≈           │
│      ∿∿  ≈≈   ∿∿        │  ← Waves, organic shapes
│         ≈≈≈    ∿∿∿      │
└──────────────────────────┘
```

**Purpose:** Hero sections, full-width backgrounds, feature images

### 3. Product Images

**Sketch the product outline:**

```
┌──────────────┐
│   |‾‾‾‾|     │  ← Phone outline
│   |    |     │
│   | ●  |     │  ← Home button
│   |____|     │
└──────────────┘
```

```
┌──────────────┐
│   _____      │  ← Laptop screen
│  |     |     │
│  |_____|     │
│  '-----'     │  ← Keyboard
└──────────────┘
```

**Purpose:** Product photos, e-commerce images, feature showcases

### 4. Icons / Illustrations

**Sketch simple icon shapes:**

```
┌──────┐
│  ⚙   │  ← Settings gear
└──────┘
```

```
┌──────┐
│  ♥   │  ← Heart icon (favorites/likes)
└──────┘
```

```
┌──────┐
│  ✓   │  ← Checkmark (success)
└──────┘
```

**Purpose:** UI icons, feature illustrations, decorative graphics

### 5. Abstract/Decorative Images

**Use soft, flowing shapes:**

```
┌──────────────────────────┐
│    ∞                     │
│       ≋≋≋                │  ← Abstract flowing shapes
│           ⌇⌇             │
│              ∿∿∿         │
└──────────────────────────┘
```

**Use geometric patterns:**

```
┌──────────────────────────┐
│  ◆    ○    ▢             │
│    ▢    ◆    ○           │  ← Geometric pattern
│  ○    ▢    ◆             │
└──────────────────────────┘
```

**Purpose:** Background patterns, decorative elements, brand graphics

---

## ❌ Discouraged: Generic "X" Marker

**Why avoid X markers?**

```
┌──────────────┐
│      X       │  ← Generic, uninformative
└──────────────┘
```

**Problems with X markers:**

- ❌ **No context** - Doesn't communicate what image shows
- ❌ **No direction** - No guidance for content selection
- ❌ **Intrusive** - Visually distracting in sketch
- ❌ **Uninspiring** - Doesn't engage stakeholders
- ❌ **Ambiguous** - Could be mistaken for "delete" or error

**Only use X if:** Sketch is extremely rough/quick and image content is described elsewhere

---

## WDS Detection Rules

### AI Image Detection

When analyzing sketches, the AI should:

1. **Look for rectangular containers** (image boundaries)
2. **Check for sketched content inside** (faces, landscapes, products, shapes)
3. **Interpret the sketch** to understand image purpose
4. **Route to `image.md`** for specification

### Example Detection

**Sketch shows:**

```
┌──────────────────────────┐
│    /\   /\    /\         │
│   /  \ /  \  /  \        │  ← Mountains sketched
│  /    X    \/    \       │
└──────────────────────────┘
```

**AI interprets:**

- Rectangle container detected
- Mountain/landscape sketch inside
- **Purpose:** Hero background image showing outdoor/nature scene
- **Route to:** `image.md`
- **Suggested content:** Mountain landscape, outdoor scenery, nature photography

---

## Benefits of Sketching Real Content

### For Designers

- ✅ Communicate visual intent clearly
- ✅ Test composition and layout
- ✅ Provide art direction
- ✅ Inspire creative solutions

### For AI Agents

- ✅ Understand image purpose from context
- ✅ Suggest appropriate image sources
- ✅ Recommend image dimensions and aspect ratios
- ✅ Generate meaningful alt text

### For Developers

- ✅ Understand what image represents
- ✅ Know how to style and position image
- ✅ Select appropriate placeholder images
- ✅ Write meaningful alt text for accessibility

### For Stakeholders

- ✅ Visualize final design better
- ✅ Provide meaningful feedback
- ✅ Understand design intent
- ✅ Approve with confidence

---

## Quick Reference

| Image Type        | Sketch Technique                | Example             |
| ----------------- | ------------------------------- | ------------------- |
| **Portrait/Face** | Simple face with eyes and smile | ◠ ◠ ᵕ               |
| **Landscape**     | Mountains, trees, horizon       | /\\ /\\ /\\         |
| **Sky/Clouds**    | Wavy cloud shapes               | ~ ~ ~               |
| **Product**       | Product outline/silhouette      | Phone, laptop shape |
| **Icon**          | Simple icon shape               | ⚙ ♥ ✓             |
| **Abstract**      | Flowing, organic shapes         | ∿ ≋ ∞               |
| **Geometric**     | Shapes and patterns             | ◆ ○ ▢               |

---

## Summary

**WDS Image Sketching Philosophy:**

> "Sketch what you see, not just where it goes."

**Guidelines:**

- ✅ **Draw the actual content** - Faces, landscapes, products
- ✅ **Use soft, organic shapes** - Clouds, waves for abstract images
- ✅ **Keep it simple** - Quick sketches are fine, detail level matches sketch fidelity
- ❌ **Avoid generic X markers** - Provides no useful context

**Result:** Better communication, clearer intent, more useful AI analysis! 🎨✨
