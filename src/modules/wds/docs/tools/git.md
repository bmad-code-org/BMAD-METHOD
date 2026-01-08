# Git

**Category:** Version Control  
**Purpose:** Track changes, collaborate, maintain project history  
**Website:** <https://git-scm.com>

---

## What It Is

Git is a distributed version control system that tracks changes to your WDS project files. It enables collaboration, maintains history, and allows you to experiment safely with branches.

---

## Why WDS Recommends It

**Version Control:**
- Track all specification changes
- Maintain prototype history
- Document design system evolution
- Rollback if needed

**Collaboration:**
- Multiple team members can work simultaneously
- Review changes before merging
- Track who changed what and when

**WDS Workflow Integration:**
- Commit after each phase completion
- Branch for experimental designs
- Tag releases and milestones

---

## Setup Instructions

### 1. Installation

**Windows:**
```bash
# Download from https://git-scm.com
# Or use winget
winget install Git.Git
```

**macOS:**
```bash
# Using Homebrew
brew install git
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git
```

### 2. Initial Configuration

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"

# Enable color output
git config --global color.ui auto
```

### 3. WDS-Specific Configuration

Create `.gitignore` for WDS projects:

```gitignore
# Node modules
node_modules/
npm-debug.log*

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# Temporary files
*.tmp
.cache/
```

---

## WDS Best Practices

### DO ✅

**1. Commit Frequently**
```bash
# After completing each phase
git add docs/C-Scenarios/01-Customer-Onboarding/
git commit -m "feat: Complete customer onboarding scenario specification"

# After design system updates
git add D-Design-System/
git commit -m "feat: Add button component to design system"
```

**2. Use Descriptive Commit Messages**
```bash
# Good
git commit -m "feat: Add login page specification with multi-language support"
git commit -m "fix: Correct button hover state in design system"
git commit -m "docs: Update prototype-to-figma workflow guide"

# Bad
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "wip"
```

**3. Branch for Experiments**
```bash
# Create branch for design exploration
git checkout -b design/hero-section-variants

# Experiment with different approaches
# ...

# Merge if successful
git checkout main
git merge design/hero-section-variants

# Or discard if not
git branch -D design/hero-section-variants
```

**4. Tag Milestones**
```bash
# Tag completed phases
git tag -a v1.0-phase4-complete -m "Phase 4: UX Design complete"

# Tag releases
git tag -a v1.0-launch -m "Production launch"
```

### DON'T ❌

**1. Don't Commit Generated Files**
- Add build outputs to `.gitignore`
- Don't commit `node_modules/`
- Don't commit temporary files

**2. Don't Force Push to Main**
```bash
# Never do this on shared branches
git push --force origin main  # ❌
```

**3. Don't Commit Secrets**
- Never commit API keys
- Never commit passwords
- Use environment variables
- Add `.env` to `.gitignore`

---

## Common WDS Workflows

### Starting a New WDS Project

```bash
# Initialize repository
git init

# Add WDS files
git add .

# Initial commit
git commit -m "chore: Initialize WDS project structure"

# Connect to remote
git remote add origin https://github.com/username/project.git
git push -u origin main
```

### Daily Workflow

```bash
# Start of day - get latest changes
git pull

# Work on specifications
# ...

# Stage and commit changes
git add docs/C-Scenarios/
git commit -m "feat: Add product detail page specification"

# Push to remote
git push
```

### Collaboration Workflow

```bash
# Create feature branch
git checkout -b feature/checkout-flow

# Work on feature
# ...

# Commit changes
git add .
git commit -m "feat: Add checkout flow specifications"

# Push branch
git push -u origin feature/checkout-flow

# Create pull request on GitHub/GitLab
# Team reviews
# Merge when approved
```

---

## Troubleshooting

### Issue: Merge conflicts

**Solution:**
```bash
# Pull latest changes
git pull

# Resolve conflicts in files
# Edit files to resolve conflicts

# Mark as resolved
git add <conflicted-files>
git commit -m "chore: Resolve merge conflicts"
```

### Issue: Accidentally committed wrong files

**Solution:**
```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Or remove specific file from commit
git reset HEAD <file>
git checkout -- <file>
```

---

## Resources

- Documentation: <https://git-scm.com/doc>
- Pro Git Book: <https://git-scm.com/book>
- GitHub Guides: <https://guides.github.com>

---

[← Back to Tools](wds-tools-guide.md)
