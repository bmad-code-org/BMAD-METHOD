---
name: bmad-os-changelog-social
description: Generate social media announcements for Discord, Twitter, and LinkedIn from the latest changelog entry. Use when user asks to 'create release announcement' or 'create social posts' or share changelog updates.
license: MIT
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

**Limit: 2,000 characters per message.** Split into multiple messages if needed.

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

**Limit: 25,000 characters per tweet (Premium).** With Premium, use a single comprehensive post matching the Discord style (minus Discord-specific formatting). Aim for 1,500-3,000 characters for better engagement.

**Threads are optional** — only use for truly massive releases where you want multiple engagement points.

See `examples/twitter-example.md` for the single-post Premium format.

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

## Examples

Reference example posts in `examples/` for tone and formatting guidance:

- **discord-example.md** — Full Discord announcement with emojis, sections, contributor shout-outs
- **twitter-example.md** — Twitter thread format (5 tweets max for major releases)
- **linkedin-example.md** — Professional post for major/minor releases with significant features

**When to use LinkedIn:**
- Major version releases (e.g., v6.0.0 Beta, v7.0.0)
- Minor releases with exceptional new features
- Community milestone announcements

Read the appropriate example file before generating to match the established style and voice.

## Output Format

**CRITICAL: ALWAYS write to files** - Create files in `_bmad-output/social/` directory:

1. `{repo-name}-discord-{version}.md` - Discord announcement
2. `{repo-name}-twitter-{version}.md` - Twitter post
3. `{repo-name}-linkedin-{version}.md` - LinkedIn post (if applicable)

Also present a preview in the chat:

```markdown
## Discord Announcement

[paste Discord content here]

## Twitter Post

[paste Twitter content here]
```

Files created:
- `_bmad-output/social/{filename}`

Offer to make adjustments if the user wants different emphasis, tone, or content.
