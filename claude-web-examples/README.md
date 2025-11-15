# Claude Code Web Examples

This directory contains ready-to-use Project instructions for running BMAD agents in Claude Code web.

## Available Agent Instructions

### [PM-Project-Instructions.md](./PM-Project-Instructions.md)
Product Manager agent for creating PRDs, epics, stories, and tech specs.

**Use when:** Planning new projects, defining requirements, breaking down work

**Workflows included:**
- Create PRD
- Create epics and stories
- Tech spec
- Validate PRD
- Course correction

---

## How to Use

### Quick Setup (5 minutes per agent)

1. **Create a new Project in Claude Code web**
2. **Copy the instructions** from one of the files above
3. **Paste into Project custom instructions**
4. **Upload relevant templates** (from `src/modules/bmm/workflows/`)
5. **Start using!**

### Example: Setting Up the PM Agent

1. Go to Claude Code web
2. Create new Project: "BMad Product Manager"
3. Copy contents of `PM-Project-Instructions.md`
4. Paste into Project custom instructions
5. Upload: `src/modules/bmm/workflows/2-plan-workflows/prd/template.md`
6. Upload: `src/modules/bmm/workflows/2-plan-workflows/prd/data/project-types.csv`
7. Start conversation: "*create-prd"

---

## Coming Soon

More agent examples:
- [ ] Architect-Project-Instructions.md
- [ ] Developer-Project-Instructions.md
- [ ] UX-Designer-Project-Instructions.md
- [ ] Test-Architect-Project-Instructions.md

---

## Resources

- **Quick Start Guide:** `../QUICK_START_CLAUDE_WEB.md` - Get started in 30 minutes
- **Full Implementation Guide:** `../CLAUDE_CODE_WEB_IMPLEMENTATION.md` - Complete reference
- **Best Practices:** `../BEST_PRACTICES_SUMMARY.md` - Learn from BMAD architecture

---

## Contributing

Want to add more agent examples?

1. Extract agent persona from `src/modules/bmm/agents/*.agent.yaml`
2. Format as Project instructions (see PM example)
3. Include workflows, personality, principles
4. Test in Claude Code web
5. Submit PR!

---

## Feedback

- 💬 **Discord:** https://discord.gg/gk8jAdXWmj
- 🐛 **Issues:** https://github.com/bmad-code-org/BMAD-METHOD/issues
- ⭐ **Star the repo** if you find this useful!
