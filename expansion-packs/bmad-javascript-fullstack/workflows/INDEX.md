# BMAD JavaScript Fullstack - Workflow Index

## 🚀 Quick Start

Choose your workflow in 30 seconds:

```
Q: Do you have existing code?
   ├─ NO  → Use: greenfield-new-project.yaml
   └─ YES → Q: Is it modernized?
            ├─ NO  → Use: brownfield-modernize-existing.yaml
            └─ YES → Q: What do you need?
                     ├─ Add features → Use: feature-addition.yaml
                     └─ Fix/update  → Use: maintenance-fixes-updates.yaml
```

## 📋 The 4 Workflows

### 1. [greenfield-new-project.yaml](greenfield-new-project.yaml)
**When**: Starting a brand new project from scratch
**Time**: 5-7 days (MVP) | 2-4 weeks (Production)
**Output**: Deployed application with core features

**Use for**:
- New startup MVP
- New product launch
- Greenfield enterprise project
- Fresh start with best practices

---

### 2. [brownfield-modernize-existing.yaml](brownfield-modernize-existing.yaml)
**When**: You have legacy/existing code that needs modernization
**Time**: 3-5 days
**Output**: Modernized, standardized, feature-ready codebase

**Use for**:
- Legacy JavaScript codebase
- Unstructured existing project
- Code without tests/standards
- Technical debt cleanup

---

### 3. [feature-addition.yaml](feature-addition.yaml)
**When**: Adding features to ANY established project
**Time**: 2 hours - 10 days (based on size)
**Output**: New feature deployed to production

**Size Guide**:
- **Small** (1-2 days): 1-3 files, existing patterns
- **Medium** (2-5 days): 4-10 files, some new patterns
- **Large** (5-10 days): 10+ files, new architecture

**Use for**:
- Adding authentication
- Payment integration
- New pages/components
- API endpoints
- Any feature addition

---

### 4. [maintenance-fixes-updates.yaml](maintenance-fixes-updates.yaml)
**When**: Bug fixes, updates, optimization, refactoring
**Time**: 2 hours - 3 days
**Output**: Issue resolved and deployed

**Types**:
- **Bug Fix** (2-8 hours): Reproduce → Fix → Deploy
- **Dependencies** (1-4 hours): Audit → Update → Deploy
- **Performance** (1-3 days): Profile → Optimize → Validate
- **Refactoring** (1-5 days): Plan → Refactor → Verify
- **Security** (2-8 hours, URGENT): Assess → Patch → Deploy

---

## 🎯 Common Scenarios

| Scenario | Workflow | File |
|----------|----------|------|
| "I have a business idea" | Greenfield | [greenfield-new-project.yaml](greenfield-new-project.yaml) |
| "I inherited legacy code" | Brownfield | [brownfield-modernize-existing.yaml](brownfield-modernize-existing.yaml) |
| "Add login to my app" | Feature (Medium) | [feature-addition.yaml](feature-addition.yaml) |
| "Add dark mode toggle" | Feature (Small) | [feature-addition.yaml](feature-addition.yaml) |
| "Build chat feature" | Feature (Large) | [feature-addition.yaml](feature-addition.yaml) |
| "Fix production bug" | Maintenance (Bug) | [maintenance-fixes-updates.yaml](maintenance-fixes-updates.yaml) |
| "Update dependencies" | Maintenance (Deps) | [maintenance-fixes-updates.yaml](maintenance-fixes-updates.yaml) |
| "App is slow" | Maintenance (Perf) | [maintenance-fixes-updates.yaml](maintenance-fixes-updates.yaml) |
| "Clean up messy code" | Maintenance (Refactor) | [maintenance-fixes-updates.yaml](maintenance-fixes-updates.yaml) |

## 📊 Token Budgets

| Workflow | Min Tokens | Max Tokens | Avg Tokens |
|----------|------------|------------|------------|
| Greenfield (MVP) | 10,000 | 15,000 | 12,000 |
| Greenfield (Prod) | 15,000 | 25,000 | 20,000 |
| Brownfield | 7,000 | 10,000 | 8,500 |
| Feature (Small) | 3,000 | 6,000 | 4,500 |
| Feature (Medium) | 6,000 | 10,000 | 8,000 |
| Feature (Large) | 10,000 | 15,000 | 12,000 |
| Maintenance | 500 | 5,000 | 1,500 |

## 🔄 Workflow Progression

Typical project lifecycle:

```
1. Start: greenfield-new-project.yaml
           ↓
2. Build MVP (5-7 days)
           ↓
3. Add Features: feature-addition.yaml
           ↓
4. Maintain: maintenance-fixes-updates.yaml
           ↓
5. More Features: feature-addition.yaml
   (Repeat 3-5 as needed)
```

Or for existing code:

```
1. Start: brownfield-modernize-existing.yaml
           ↓
2. Modernize (3-5 days)
           ↓
3. Add Features: feature-addition.yaml
           ↓
4. Maintain: maintenance-fixes-updates.yaml
   (Repeat 3-4 as needed)
```

## 📚 Documentation

- **[README.md](README.md)** - Overview and quick reference
- **[WORKFLOW-SYSTEM.md](WORKFLOW-SYSTEM.md)** - Detailed system documentation
- **This file (INDEX.md)** - Quick navigation

## 🚦 Getting Started

1. **Read this index** to understand the 4 workflows
2. **Choose your workflow** based on your situation
3. **Open the YAML file** and follow the phases
4. **Track tokens** and create checkpoints as specified
5. **Use parallel execution** when indicated

## ✅ Workflow Selection Checklist

Before starting, answer these:

- [ ] Do I have existing code? (Yes = Brownfield, No = Greenfield)
- [ ] Is my code modernized? (No = Brownfield first)
- [ ] Am I adding a feature? (Yes = Feature workflow)
- [ ] Am I fixing/optimizing? (Yes = Maintenance workflow)
- [ ] Have I estimated feature size? (Small/Medium/Large)
- [ ] Do I know my token budget?
- [ ] Have I identified parallel opportunities?

---

**Need help? Start with [README.md](README.md) for detailed guidance.**