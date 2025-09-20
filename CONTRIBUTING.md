# Contributing to this project

Thank you for contributing to this project! This document outlines the process for contributing and some guidelines to follow.

🆕 **New to GitHub or pull requests?** Check out our [beginner-friendly Pull Request Guide](docs/how-to-contribute-with-pull-requests.md) first!

📋 **Before contributing**, please read our [Guiding Principles](docs/GUIDING-PRINCIPLES.md) to understand the BMad Method's core philosophy and architectural decisions.

Also note, we use the discussions feature in GitHub to have a community to discuss potential ideas, uses, additions and enhancements.

💬 **Discord Community**: Join our [Discord server](https://discord.gg/gk8jAdXWmj) for real-time discussions or search past discussions or ideas.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before participating.

## Before Submitting a PR

**IMPORTANT**: All PRs must pass validation checks before they can be merged.

### Required Checks

Before submitting your PR, run these commands locally:

```bash
# Run all validation checks
npm run pre-release

# Or run them individually:
npm run validate     # Validate agent/team configs
npm run format:check # Check code formatting
npm run lint        # Check for linting issues
```

### Fixing Issues

If any checks fail, use these commands to fix them:

```bash
# Fix all issues automatically
npm run fix

# Or fix individually:
npm run format      # Fix formatting issues
npm run lint:fix    # Fix linting issues
```

### Setup Git Hooks (Optional but Recommended)

To catch issues before committing:

```bash
# Run this once after cloning
chmod +x tools/setup-hooks.sh
./tools/setup-hooks.sh
```

## How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating a new issue - it will guide you through providing:
   - Clear bug description
   - Steps to reproduce
   - Expected vs actual behavior
   - Model/IDE/BMad version details
   - Screenshots or links if applicable
3. **Consider discussing in Discord** (#bugs-issues channel) for quick help
4. **Indicate if you're working on a fix** to avoid duplicate efforts

### Suggesting Features

1. **Discuss first in Discord** (#general-dev channel) - the feature request template asks if you've done this
2. **Check existing issues and discussions** to avoid duplicates
3. **Use the feature request template** when creating an issue - it will guide you through:
   - Confirming Discord discussion
   - Describing the problem it solves
   - Explaining your solution
   - Listing alternatives considered
4. **Be specific** about why this feature would benefit the BMad community

### Pull Request Process

⚠️ **Before starting work:**

1. **For bugs**: Check if an issue exists (create one using the bug template if not)
2. **For features**: Ensure you've discussed in Discord (#general-dev) AND created a feature request issue
3. **For large changes**: Always open an issue first to discuss alignment

Please only propose small granular commits! If its large or significant, please discuss in the discussions tab and open up an issue first. I do not want you to waste your time on a potentially very large PR to have it rejected because it is not aligned or deviates from other planned changes. Communicate and lets work together to build and improve this great community project!

**Important**: All contributions must align with our [Guiding Principles](docs/GUIDING-PRINCIPLES.md). Key points:

- Keep dev agents lean - they need context for coding, not documentation
- Web/planning agents can be larger with more complex tasks
- Everything is natural language (markdown) - no code in core framework
- Use expansion packs for domain-specific features

#### Which Branch for Your PR?

**Submit to `next` branch** (most contributions):

- ✨ New features or agents
- 🎨 Enhancements to existing features
- 📚 Documentation updates
- ♻️ Code refactoring
- ⚡ Performance improvements
- 🧪 New tests
- 🎁 New expansion packs

**Submit to `main` branch** (critical only):

- 🚨 Critical bug fixes that break basic functionality
- 🔒 Security patches
- 📚 Fixing dangerously incorrect documentation
- 🐛 Bugs preventing installation or basic usage

**When in doubt, submit to `next`**. We'd rather test changes thoroughly before they hit stable.

#### PR Size Guidelines

- **Ideal PR size**: 200-400 lines of code changes
- **Maximum PR size**: 800 lines (excluding generated files)
- **One feature/fix per PR**: Each PR should address a single issue or add one feature
- **If your change is larger**: Break it into multiple smaller PRs that can be reviewed independently
- **Related changes**: Even related changes should be separate PRs if they deliver independent value

#### Breaking Down Large PRs

If your change exceeds 800 lines, use this checklist to split it:

- [ ] Can I separate the refactoring from the feature implementation?
- [ ] Can I introduce the new API/interface in one PR and implementation in another?
- [ ] Can I split by file or module?
- [ ] Can I create a base PR with shared utilities first?
- [ ] Can I separate test additions from implementation?
- [ ] Even if changes are related, can they deliver value independently?
- [ ] Can these changes be merged in any order without breaking things?

Example breakdown:

1. PR #1: Add utility functions and types (100 lines)
2. PR #2: Refactor existing code to use utilities (200 lines)
3. PR #3: Implement new feature using refactored code (300 lines)
4. PR #4: Add comprehensive tests (200 lines)

**Note**: PRs #1 and #4 could be submitted simultaneously since they deliver independent value and don't depend on each other's merge order.

#### Pull Request Steps

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run any tests or linting to ensure quality
5. Commit your changes with clear, descriptive messages following our commit message convention
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request against the main branch

## Issue Templates

We use GitHub issue templates to ensure all necessary information is provided:

- **Bug Reports**: Automatically guides you through providing reproduction steps, environment details, and expected behavior
- **Feature Requests**: Requires Discord discussion confirmation and asks for problem/solution descriptions

Using these templates helps maintainers understand and address your contribution faster.

## Pull Request Description Guidelines

Keep PR descriptions short and to the point following this template:

### PR Description Template

Keep your PR description concise and focused. Use this template:

```markdown
## What

[1-2 sentences describing WHAT changed]

## Why

[1-2 sentences explaining WHY this change is needed]
Fixes #[issue number] (if applicable)

## How

[2-3 bullets listing HOW you implemented it]

## Testing

[1-2 sentences on how you tested this]
```

**Maximum PR description length: 200 words** (excluding code examples if needed)

### Good vs Bad PR Descriptions

❌ **Bad Example:**

> This revolutionary PR introduces a paradigm-shifting enhancement to the system's architecture by implementing a state-of-the-art solution that leverages cutting-edge methodologies to optimize performance metrics and deliver unprecedented value to stakeholders through innovative approaches...

✅ **Good Example:**

> **What:** Added validation for agent dependency resolution
> **Why:** Build was failing silently when agents had circular dependencies
> **How:**
>
> - Added cycle detection in dependency-resolver.js
> - Throws clear error with dependency chain
>   **Testing:** Tested with circular deps between 3 agents

## Commit Message Convention

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests
- `chore:` Changes to build process or auxiliary tools

Keep commit messages under 72 characters.

### Atomic Commits

Each commit should represent one logical change:

- **Do:** One bug fix per commit
- **Do:** One feature addition per commit
- **Don't:** Mix refactoring with bug fixes
- **Don't:** Combine unrelated changes

## Code Style

- Follow the existing code style and conventions
- Write clear comments for complex logic

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
