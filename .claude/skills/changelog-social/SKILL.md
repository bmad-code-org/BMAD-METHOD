---
name: changelog-social
description: Generate social media announcements for Discord and Twitter from the latest changelog entry.asks to create release announcements, social posts, or share changelog updates on Discord/Twitter. Reads CHANGELOG.md in current working directory.
disable-model-invocation: true
---

# Changelog Social

Generate engaging social media announcements from changelog entries.

## Workflow

### Step 1: Extract Changelog Entry

Read `./CHANGELOG.md` and extract the latest version entry. The changelog follows this format:

```markdown
## [VERSION]

### 🎁 Features
* **Title** — Description

### 🐛 Bug Fixes
* **Title** — Description

### 📚 Documentation
* **Title** — Description

### 🔧 Maintenance
* **Title** — Description
```

Parse:
- **Version number** (e.g., `6.0.0-Beta.5`)
- **Features** - New functionality, enhancements
- **Bug Fixes** - Fixes users will care about
- **Documentation** - New or improved docs
- **Maintenance** - Dependency updates, tooling improvements

### Step 2: Get Git Contributors

Use git log to find contributors since the previous version. Get commits between the current version tag and the previous one:

```bash
# Find the previous version tag first
git tag --sort=-version:refname | head -5

# Get commits between versions with PR numbers and authors
git log <previous-tag>..<current-tag> --pretty=format:"%h|%s|%an" --grep="#"
```

Extract PR numbers from commit messages that contain `#` followed by digits. Compile unique contributors.

### Step 3: Generate Discord Announcement

Use this template style:

```markdown
🚀 **BMad vVERSION RELEASED!**

🎉 [Brief hype sentence]

🪥 **KEY HIGHLIGHT** - [One-line summary]

🎯 **CATEGORY NAME**
• Feature one - brief description
• Feature two - brief description
• Coming soon: Future teaser

🔧 **ANOTHER CATEGORY**
• Fix or feature
• Another item

📚 **DOCS OR OTHER**
• Item
• Item with link

🌟 **COMMUNITY PHILOSOPHY** (optional - include for major releases)
• Everything is FREE - No paywalls
• Knowledge shared, not sold

📊 **STATS**
X commits | Y PRs merged | Z files changed

🙏 **CONTRIBUTORS**
@username1 (X PRs!), @username2 (Y PRs!)
@username3, @username4, username5 + dependabot 🛡️
Community-driven FTW! 🌟

📦 **INSTALL:**
`npx bmad-method@VERSION install`

⭐ **SUPPORT US:**
🌟 GitHub: github.com/bmad-code-org/BMAD-METHOD/
📺 YouTube: youtube.com/@BMadCode
☕ Donate: buymeacoffee.com/bmad

🔥 **Next version tease!**
```

**Content Strategy:**
- Focus on **user impact** - what's better for them?
- Highlight **annoying bugs fixed** that frustrated users
- Show **new capabilities** that enable workflows
- Keep it **punchy** - use emojis and short bullets
- Add **personality** - excitement, humor, gratitude

### Step 4: Generate Twitter Post

Create a condensed version (280 chars or less for main tweet, optionally thread):

```
🚀 BMad vVERSION is live!

[Most exciting feature] + [Critical bug fix]

• Feature 1
• Feature 2
• Fix 3

Install: npx bmad-method@VERSION install

#AI #DevTools
```

**For major releases**, create a thread:
1. Hook tweet - biggest news
2. Feature highlights tweet
3. Community/contributors tweet
4. Install CTA

## Content Selection Guidelines

**Include:**
- New features that change workflows
- Bug fixes for annoying/blocking issues
- Documentation that helps users
- Performance improvements
- New agents or workflows
- Breaking changes (call out clearly)

**Skip/Minimize:**
- Internal refactoring
- Dependency updates (unless user-facing)
- Test improvements
- Minor style fixes

**Emphasize:**
- "Finally fixed" issues
- "Faster" operations
- "Easier" workflows
- "Now supports" capabilities

## Output Format

Present both announcements in clearly labeled sections:

```markdown
## Discord Announcement

[paste Discord content here]

## Twitter Post

[paste Twitter content here]
```

Offer to make adjustments if the user wants different emphasis, tone, or content.
