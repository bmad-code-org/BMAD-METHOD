# Contributing to BMad

Thank you for considering contributing! We believe in **Human Amplification, Not Replacement** — bringing out the best thinking in both humans and AI through guided collaboration.

💬 **Discord**: [Join our community](https://discord.gg/gk8jAdXWmj) for real-time discussions, questions, and collaboration.

---

## Our Philosophy

BMad strengthens human-AI collaboration through specialized agents and guided workflows. Every contribution should answer: **"Does this make humans and AI better together?"**

**✅ What we welcome:**
- Enhanced collaboration patterns and workflows
- Improved agent personas and prompts
- Domain-specific modules leveraging BMad Core
- Better planning and context continuity

**❌ What doesn't fit:**
- Purely automated solutions that sideline humans
- Complexity that creates barriers to adoption
- Features that fragment BMad Core's foundation

---

## Reporting Issues

**ALL bug reports and feature requests MUST go through GitHub Issues.**

### Before Creating an Issue

1. **Search existing issues** — Use the GitHub issue search to check if your bug or feature has already been reported
2. **Search closed issues** — Your issue may have been fixed or addressed previously
3. **Check discussions** — Some conversations happen in [GitHub Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions)

### Bug Reports

After searching, if the bug is unreported, use the [bug report template](https://github.com/bmad-code-org/BMAD-METHOD/issues/new?template=bug_report.md) and include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (model, IDE, BMad version)
- Screenshots or error messages if applicable

### Feature Requests

After searching, use the [feature request template](https://github.com/bmad-code-org/BMAD-METHOD/issues/new?template=feature_request.md) and explain:

- What the feature is
- Why it would benefit the BMad community
- How it strengthens human-AI collaboration

**For community modules**, review [TRADEMARK.md](TRADEMARK.md) for proper naming conventions (e.g., "My Module (BMad Community Module)").

---

## Before Starting Work

⚠️ **Required before submitting PRs:**

| Work Type     | Requirement                                    |
| ------------- | ---------------------------------------------- |
| Bug fix       | An open issue (create one if it doesn't exist) |
| Feature       | An open feature request issue                  |
| Large changes | Discussion via issue first                     |

**Why?** This prevents wasted effort on work that may not align with project direction.

---

## Pull Request Guidelines

### Target Branch

Submit PRs to the `main` branch.

### PR Size

- **Ideal**: 200-400 lines of code changes
- **Maximum**: 800 lines (excluding generated files)
- **One feature/fix per PR**

If your change exceeds 800 lines, break it into smaller PRs that can be reviewed independently.

### New to Pull Requests?

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/bmad-method.git`
3. **Create a branch**: `git checkout -b fix/description` or `git checkout -b feature/description`
4. **Make changes** — keep them focused
5. **Commit**: `git commit -m "fix: correct typo in README"`
6. **Push**: `git push origin fix/description`
7. **Open PR** from your fork on GitHub

### PR Description Template

```markdown
## What
[1-2 sentences describing WHAT changed]

## Why
[1-2 sentences explaining WHY this change is needed]
Fixes #[issue number]

## How
- [2-3 bullets listing HOW you implemented it]
-

## Testing
[1-2 sentences on how you tested this]
```

**Keep it under 200 words.**

### Commit Messages

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code change (no bug/feature)
- `test:` Adding tests
- `chore:` Build/tools changes

Keep messages under 72 characters. Each commit = one logical change.

---

## Git Workflow for Contributors

### One-Time Setup

After forking and cloning the repository, set up your development environment:

```bash
# 1. Add the upstream remote (main repository)
git remote add upstream git@github.com:bmad-code-org/BMAD-METHOD.git

# 2. Enable git hooks (enforces workflow automatically)
git config core.hooksPath .githooks
```

### Single-Commit Workflow

**This repository uses a single-commit-per-branch workflow** to keep PR history clean.

#### Initial Development

```bash
# Create feature branch
git checkout -b feat/your-feature

# Make your changes
# ... edit files ...

# Commit once
git commit -m "feat: add your feature description"

# Push to your fork
git push -u origin feat/your-feature
```

#### Making Additional Changes

**Use amend instead of creating new commits:**

```bash
# Make more changes
# ... edit files ...

# Stage changes
git add .

# Amend the existing commit
git commit --amend --no-edit

# Force push (safely)
git push --force-with-lease
```

#### Addressing PR Feedback

```bash
# Make requested changes
# ... edit files ...

# Amend (don't create new commits)
git commit --amend --no-edit

# Force push
git push --force-with-lease
```

### Keeping Your Branch Updated

```bash
# Sync your local main with upstream
git checkout main
git pull upstream main

# Rebase your feature branch
git checkout feat/your-feature
git rebase main

# Force push (safely)
git push --force-with-lease
```

### What the Git Hooks Do

The hooks in `.githooks/` automate workflow enforcement:

| Hook | Purpose |
|------|---------|
| `pre-push` | Ensures upstream sync, blocks direct push to main, enforces single-commit |
| `pre-commit` | Blocks commits to main, reminds about amend workflow |
| `post-checkout` | Provides sync reminders when switching branches |

**The hooks will automatically:**
- Block commits directly to main branch
- Prevent pushing more than 1 commit per branch
- Warn if your local main is behind upstream
- Remind you to rebase before pushing

### Troubleshooting

#### "Too many commits" error

If you have multiple commits, squash them:

```bash
# Reset to main (keeps your changes)
git reset --soft main

# Create single commit
git commit -m "feat: your feature description"

# Force push
git push --force-with-lease
```

#### Local main diverged from upstream

```bash
# Reset your main to match upstream
git checkout main
git reset --hard upstream/main
git push --force-with-lease origin main
```

#### Branch not rebased on main

```bash
# Update main first
git checkout main
git pull upstream main

# Rebase your branch
git checkout feat/your-feature
git rebase main

# Force push
git push --force-with-lease
```

---

## What Makes a Good PR?

| ✅ Do                        | ❌ Don't                      |
| --------------------------- | ---------------------------- |
| Change one thing per PR     | Mix unrelated changes        |
| Clear title and description | Vague or missing explanation |
| Reference related issues    | Reformat entire files        |
| Small, focused commits      | Copy your whole project      |
| Work on a branch            | Work directly on `main`      |

---

## Prompt & Agent Guidelines

- Keep dev agents lean — focus on coding context, not documentation
- Web/planning agents can be larger with complex tasks
- Everything is natural language (markdown) — no code in core framework
- Use BMad modules for domain-specific features
- Validate YAML schemas: `npm run validate:schemas`

---

## Need Help?

- 💬 **Discord**: [Join the community](https://discord.gg/gk8jAdXWmj)
- 🐛 **Bugs**: Use the [bug report template](https://github.com/bmad-code-org/BMAD-METHOD/issues/new?template=bug_report.md)
- 💡 **Features**: Use the [feature request template](https://github.com/bmad-code-org/BMAD-METHOD/issues/new?template=feature_request.md)

---

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](.github/CODE_OF_CONDUCT.md).

## License

By contributing, your contributions are licensed under the same MIT License. See [CONTRIBUTORS.md](CONTRIBUTORS.md) for contributor attribution.
