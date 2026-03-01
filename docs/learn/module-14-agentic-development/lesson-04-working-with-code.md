# Module 14: Agentic Development

## Lesson 4: Choosing Your Code Format

**Understanding what the agent produces and which technology fits your needs**

---

## The Agent Writes Code. Which Kind?

When you ask an agent to build something, one of the first decisions is: what technology should it use? This choice affects how fast you can iterate, how easy it is to share, and how close the output is to production.

You don't need to become an expert. But you need to understand the options well enough to make good decisions — or at least ask the right questions.

---

## The Most Common Stack: React + Tailwind

Most modern web projects use some version of this combination. If you're building production code, this is likely what you'll work with.

**React** handles structure and behavior — you build reusable components that manage their own state.

**Tailwind CSS** handles styling — instead of writing CSS in separate files, you apply utility classes directly to elements.

**Next.js** ties it all together — routing between pages, server features, and deployment.

```jsx
function SignupForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!email.includes('@')) {
      setError('Please enter a valid email')
    }
  }

  return (
    <div className="max-w-md p-8">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-3 mb-4"
        placeholder="Email"
      />
      {error && <span className="text-red-600 text-sm">{error}</span>}
      <button
        onClick={handleSubmit}
        disabled={!email}
        className="bg-blue-600 text-white px-6 py-3 rounded w-full disabled:opacity-50"
      >
        Sign Up
      </button>
    </div>
  )
}
```

Notice how everything — structure, styling, and behavior — lives in one component file. This is what modern web development looks like.

| | |
|---|---|
| **Pros** | Industry standard. Components are reusable. Real interactivity. Deploys easily to Vercel. The agent is very good at generating this stack. |
| **Cons** | Requires a development environment (Node.js, package manager). Can't just open a file in the browser. Errors can be cryptic. Steeper learning curve. |
| **Best for** | Production projects. Interactive prototypes. Building within an existing codebase. |

---

## Component Libraries and Your Design System

In Module 13, you built a design system — tokens for colors, typography, spacing, and component definitions. In code, these come to life through **component libraries**.

A component library is a collection of pre-built, styled components (buttons, inputs, cards, modals) that you use as building blocks. Instead of writing a button from scratch every time, you import one:

```jsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SignupForm() {
  return (
    <div className="max-w-md p-8">
      <Input type="email" placeholder="Email" />
      <Button variant="primary">Sign Up</Button>
    </div>
  )
}
```

### Popular component libraries

| Library | What it is |
|---|---|
| **shadcn/ui** | Copy-paste components built on Tailwind. You own the code. Highly customizable. Currently the most popular choice. |
| **Radix UI** | Accessible, unstyled primitives. You add your own styling. The foundation under shadcn/ui. |
| **Material UI (MUI)** | Google's design system as React components. Opinionated look and feel. |
| **Chakra UI** | Utility-based components with built-in accessibility. |

### How this connects to your design system

Your design tokens (Module 13) define the rules. The component library implements them:

| Design token | Code implementation |
|---|---|
| Primary color: `#0066FF` | `--primary: #0066FF` in your Tailwind config |
| Font: Inter, 16px base | `fontFamily: { sans: ['Inter'] }` in config |
| Spacing: 8px scale | `spacing: { 1: '8px', 2: '16px', ... }` |
| Button: primary variant | `<Button variant="primary">` uses all the above |

When the agent builds, it should use your component library and respect your design tokens. Include your design system in the Design Log requirements:

> "Use our design system tokens. Primary #0066FF, Inter font, 8px spacing scale. Use shadcn/ui components where applicable."

---

## For Prototyping: HTML + Tailwind

When you don't need a full framework — just a quick visual prototype — use static HTML with Tailwind via CDN.

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="max-w-md mx-auto p-8 mt-16">
    <h1 class="text-2xl font-bold mb-4">Create Account</h1>
    <input type="email" placeholder="Email"
      class="w-full border rounded p-3 mb-4">
    <button class="bg-blue-600 text-white px-6 py-3 rounded w-full">
      Sign Up
    </button>
  </div>
</body>
</html>
```

One file. Double-click to open. Instant prototype.

| | |
|---|---|
| **Pros** | Zero setup. One file. Consistent styling with utility classes. Easy to share. Fast iteration. |
| **Cons** | No real interactivity without adding JavaScript. Not production code. Tailwind CDN is for prototyping only. |
| **Best for** | Rapid exploration. Client reviews. Testing layouts and visual direction before committing to a framework. |

---

## The Simplest Option: HTML + CSS + JavaScript

The foundation of the web. Every browser understands these three languages natively. No framework, no library, no build step.

- **HTML** — the structure (what elements exist and how they're organized)
- **CSS** — the visual styling (colors, fonts, spacing, layout)
- **JavaScript** — the behavior (what happens when you click, type, or scroll)

These can be combined in a single `.html` file for quick explorations, or split into separate files for organized work:

```html
<!-- structure -->
<div class="signup-form">
  <h1>Create Account</h1>
  <input type="email" id="email" placeholder="Email">
  <button id="submit-btn">Sign Up</button>
  <span class="error" id="email-error"></span>
</div>
```

```css
/* appearance */
.signup-form { max-width: 400px; padding: 32px; font-family: Inter, sans-serif; }
.signup-form button { background: #0066FF; color: white; padding: 12px 24px; }
.error { color: #DC2626; font-size: 14px; display: none; }
```

```javascript
// behavior
document.getElementById('submit-btn').addEventListener('click', function() {
  const email = document.getElementById('email').value
  const error = document.getElementById('email-error')
  if (!email.includes('@')) {
    error.textContent = 'Please enter a valid email'
    error.style.display = 'block'
  }
})
```

| | |
|---|---|
| **Pros** | No setup. No dependencies. Universal. You can read the structure, styles, and behavior separately. Opens in any browser. |
| **Cons** | Everything is manual. No components or reusability. Gets messy in larger projects. More code to wire things together. |
| **Best for** | Learning the basics. Quick one-off prototypes. When you want full control with no abstractions. |

---

## Other Frameworks

| Technology | When you'll see it |
|---|---|
| **Svelte / SvelteKit** | Simpler alternative to React. Less boilerplate. Growing in popularity. |
| **Vue / Nuxt** | Another React alternative. Popular in some teams and regions. |
| **TypeScript** | JavaScript with type safety. Production projects often require it. The agent handles it well. |

You don't choose these — your project does. If you're joining an existing codebase, you use what's already there. If you're starting fresh, the agent can help you pick.

---

## Static vs. Executable: Where They Live

### Static prototypes

Placed in the scenario folder alongside their specifications. This keeps the visual output next to the spec it was built from:

```
docs/C-Scenarios/S01-User-Registration/
├── scenario-overview.md
├── P01-landing-page/
│   ├── specification.md
│   └── prototype.html          ← Static prototype
├── P02-signup-form/
│   ├── specification.md
│   └── prototype.html          ← Static prototype
└── shared/
    ├── styles.css              ← Shared styles across pages
    └── interactions.js         ← Shared behavior
```

### Executable code

Organized in the root of the repository, following the project's framework structure:

```
my-project/
├── src/
│   ├── components/
│   │   ├── SignupForm.tsx
│   │   └── ui/                 ← Component library
│   ├── pages/
│   │   ├── index.tsx
│   │   └── signup.tsx
│   └── styles/
│       └── globals.css
├── docs/                       ← Specs still live here
├── package.json
└── ...
```

---

## Choosing the Right Format

| Situation | Format | Why |
|-----------|--------|-----|
| Exploring a layout idea | HTML + Tailwind | Fast, disposable, zero setup |
| Reviewing with a client | Static HTML | Easy to share, no setup for viewer |
| Rapid component iteration | HTML + Tailwind | Consistent styling, quick changes |
| Building a production feature | React + Tailwind | Ships directly into the codebase |
| Testing real form validation | React | Needs real state management |
| Designing a new page | Static first | Iterate fast, then migrate |
| Adding to an existing app | Match the existing stack | Must fit the codebase |

Many projects use both categories: static HTML for exploration, framework code for implementation. Start light, go heavy when you need to.

---

## Practical Tips

### For static prototypes

- Ask the agent: "Build this as a single HTML file I can open in my browser"
- Use Tailwind CDN for fast styling without setup
- Share by sending the file — email, Slack, cloud drive
- Place prototypes in the scenario folder next to the specification

### For executable code

- Ask the agent: "Build this as a component in our [framework] project using our design system"
- Make sure your development environment is running before you start
- Deploy to a preview URL (Vercel, Netlify) when you need to share
- Keep the Design Log updated with the branch and commit information

### When to ask a developer

- You're not sure which technology the project uses
- The development server won't start
- You get build errors you don't understand
- You need to set up a new project from scratch

---

## What's Next

Whether you're producing static HTML or executable code, you need a way to keep your work safe, organized, and shareable. That's where Git comes in.

---

**[Continue to Lesson 5: Git Discipline →](lesson-05-git-discipline.md)**

---

[← Back to Lesson 3](lesson-03-when-you-get-stuck.md) | [Back to Module Overview](module-14-agentic-development-overview.md)

*Part of Module 14: Agentic Development*
