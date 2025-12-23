# Contributing to BMad

Thank you for considering contributing to the BMad project! We believe in **Human Amplification, Not Replacement** - bringing out the best thinking in both humans and AI through guided collaboration.

💬 **Discord Community**: Join our [Discord server](https://discord.gg/gk8jAdXWmj) for real-time discussions:

- **#general-dev** - Technical discussions, feature ideas, and development questions
- **#bugs-issues** - Bug reports and issue discussions

## Our Philosophy

### BMad Core™: Universal Foundation

BMad Core empowers humans and AI agents working together in true partnership across any domain through our **C.O.R.E. Framework** (Collaboration Optimized Reflection Engine):

- **Collaboration**: Human-AI partnership where both contribute unique strengths
- **Optimized**: The collaborative process refined for maximum effectiveness
- **Reflection**: Guided thinking that helps discover better solutions and insights
- **Engine**: The powerful framework that orchestrates specialized agents and workflows

### BMad Method™: Agile AI-Driven Development

The BMad Method is the flagship bmad module for agile AI-driven software development. It emphasizes thorough planning and solid architectural foundations to provide detailed context for developer agents, mirroring real-world agile best practices.

### Core Principles

**Partnership Over Automation** - AI agents act as expert coaches, mentors, and collaborators who amplify human capability rather than replace it.

**Bidirectional Guidance** - Agents guide users through structured workflows while users push agents with advanced prompting. Both sides actively work to extract better information from each other.

**Systems of Workflows** - BMad Core builds comprehensive systems of guided workflows with specialized agent teams for any domain.

**Tool-Agnostic Foundation** - BMad Core remains tool-agnostic, providing stable, extensible groundwork that adapts to any domain.

## What Makes a Good Contribution?

Every contribution should strengthen human-AI collaboration. Ask yourself: **"Does this make humans and AI better together?"**

**✅ Contributions that align:**

- Enhance universal collaboration patterns
- Improve agent personas and workflows
- Strengthen planning and context continuity
- Increase cross-domain accessibility
- Add domain-specific modules leveraging BMad Core

**❌ What detracts from our mission:**

- Purely automated solutions that sideline humans
- Tools that don't improve the partnership
- Complexity that creates barriers to adoption
- Features that fragment BMad Core's foundation

## Before You Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Consider discussing in Discord** (#bugs-issues channel) for quick help
3. **Use the bug report template** when creating a new issue - it guides you through providing:
   - Clear bug description
   - Steps to reproduce
   - Expected vs actual behavior
   - Model/IDE/BMad version details
   - Screenshots or links if applicable
4. **Indicate if you're working on a fix** to avoid duplicate efforts

### Suggesting Features or New Modules

1. **Discuss first in Discord** (#general-dev channel) - the feature request template asks if you've done this
2. **Check existing issues and discussions** to avoid duplicates
3. **Use the feature request template** when creating an issue
4. **Be specific** about why this feature would benefit the BMad community and strengthen human-AI collaboration

### Before Starting Work

⚠️ **Required before submitting PRs:**

1. **For bugs**: Check if an issue exists (create one using the bug template if not)
2. **For features**: Discuss in Discord (#general-dev) AND create a feature request issue
3. **For large changes**: Always open an issue first to discuss alignment

Please propose small, granular changes! For large or significant changes, discuss in Discord and open an issue first. This prevents wasted effort on PRs that may not align with planned changes.

## Pull Request Guidelines

### Which Branch?

**Submit PR's to `main` branch** (critical only):

- 🚨 Critical bug fixes that break basic functionality
- 🔒 Security patches
- 📚 Fixing dangerously incorrect documentation
- 🐛 Bugs preventing installation or basic usage

### PR Size Guidelines

- **Ideal PR size**: 200-400 lines of code changes
- **Maximum PR size**: 800 lines (excluding generated files)
- **One feature/fix per PR**: Each PR should address a single issue or add one feature
- **If your change is larger**: Break it into multiple smaller PRs that can be reviewed independently
- **Related changes**: Even related changes should be separate PRs if they deliver independent value

### Breaking Down Large PRs

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

**Note**: PRs #1 and #4 could be submitted simultaneously since they deliver independent value.

### Pull Request Process

#### New to Pull Requests?

If you're new to GitHub or pull requests, here's a quick guide:

1. **Fork the repository** - Click the "Fork" button on GitHub to create your own copy
2. **Clone your fork** - `git clone https://github.com/YOUR-USERNAME/bmad-method.git`
3. **Create a new branch** - Never work on `main` directly!
   ```bash
   git checkout -b fix/description
   # or
   git checkout -b feature/description
   ```
4. **Make your changes** - Edit files, keeping changes small and focused
5. **Commit your changes** - Use clear, descriptive commit messages
   ```bash
   git add .
   git commit -m "fix: correct typo in README"
   ```
6. **Push to your fork** - `git push origin fix/description`
7. **Create the Pull Request** - Go to your fork on GitHub and click "Compare & pull request"

### PR Description Template

Keep your PR description concise and focused. Use this template:

```markdown
## What

[1-2 sentences describing WHAT changed]

## Why

[1-2 sentences explaining WHY this change is needed]
Fixes #[issue number] (if applicable)

## How

## [2-3 bullets listing HOW you implemented it]

-
-

## Testing

[1-2 sentences on how you tested this]
```

**Maximum PR description length: 200 words** (excluding code examples if needed)

### Good vs Bad PR Descriptions

❌ **Bad Example:**

> This revolutionary PR introduces a paradigm-shifting enhancement to the system's architecture by implementing a state-of-the-art solution that leverages cutting-edge methodologies to optimize performance metrics...

✅ **Good Example:**

> **What:** Added validation for agent dependency resolution
> **Why:** Build was failing silently when agents had circular dependencies
> **How:**
>
> - Added cycle detection in dependency-resolver.js
> - Throws clear error with dependency chain
>   **Testing:** Tested with circular deps between 3 agents

### Commit Message Convention

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

## What Makes a Good Pull Request?

✅ **Good PRs:**

- Change one thing at a time
- Have clear, descriptive titles
- Explain what and why in the description
- Include only the files that need to change
- Reference related issue numbers

❌ **Avoid:**

- Changing formatting of entire files
- Multiple unrelated changes in one PR
- Copying your entire project/repo into the PR
- Changes without explanation
- Working directly on `main` branch

## Common Mistakes to Avoid

1. **Don't reformat entire files** - only change what's necessary
2. **Don't include unrelated changes** - stick to one fix/feature per PR
3. **Don't paste code in issues** - create a proper PR instead
4. **Don't submit your whole project** - contribute specific improvements

## Prompt & Agent Guidelines

- Keep dev agents lean - they need context for coding, not documentation
- Web/planning agents can be larger with more complex tasks
- Everything is natural language (markdown) - no code in core framework
- Use bmad modules for domain-specific features
- Validate YAML schemas with `npm run validate:schemas` before committing

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We foster a collaborative, respectful environment focused on building better human-AI partnerships.

## Need Help?

- 💬 Join our [Discord Community](https://discord.gg/gk8jAdXWmj):
  - **#general-dev** - Technical questions and feature discussions
  - **#bugs-issues** - Get help with bugs before filing issues
- 🐛 Report bugs using the [bug report template](https://github.com/bmad-code-org/BMAD-METHOD/issues/new?template=bug_report.md)
- 💡 Suggest features using the [feature request template](https://github.com/bmad-code-org/BMAD-METHOD/issues/new?template=feature_request.md)
- 📖 Browse the [GitHub Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions)

---

**Remember**: We're here to help! Don't be afraid to ask questions. Every expert was once a beginner. Together, we're building a future where humans and AI work better together.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.
