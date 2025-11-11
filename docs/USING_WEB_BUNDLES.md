# Using BMAD Web Bundles (For Users)

**Audience:** Users wanting to use BMAD agents in Claude Projects, ChatGPT, or Gemini

---

## Quick Start

**1. Pick your channel:**

- **Stable:** `https://github.com/bmad-code-org/BMAD-METHOD/releases/latest`
- **Latest:** `https://bmad-code-org.github.io/bmad-bundles/`

**2. Copy raw markdown URL:**

```
https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/claude-code/sub-agents/bmm-agent-pm.md
```

**3. Add to AI platform:**

- **Claude Projects:** Project Knowledge → Add URL
- **ChatGPT:** Custom Instructions → Paste content
- **Gemini Gems:** Knowledge → Add URL

---

## Available Agents

### Claude Code

- [PM](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/claude-code/sub-agents/bmm-agent-pm.md) | [Architect](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/claude-code/sub-agents/bmm-agent-architect.md) | [TEA](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/claude-code/sub-agents/bmm-agent-tea.md) | [Developer](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/claude-code/sub-agents/bmm-agent-dev.md)
- [All Agents](https://github.com/bmad-code-org/bmad-bundles/tree/main/claude-code/sub-agents)

### ChatGPT / Gemini

- [Browse ChatGPT](https://github.com/bmad-code-org/bmad-bundles/tree/main/chatgpt/sub-agents)
- [Browse Gemini](https://github.com/bmad-code-org/bmad-bundles/tree/main/gemini/sub-agents)

---

## Stable vs Latest

**Stable (GitHub Releases):**

- Production-ready, tested releases
- Version-pinned (v6.0.0, etc.)
- Download: `https://github.com/bmad-code-org/BMAD-METHOD/releases/latest`

**Latest (GitHub Pages):**

- Bleeding edge (main branch)
- Auto-updated on every merge
- Browse: `https://bmad-code-org.github.io/bmad-bundles/`

---

## Full Installation (Recommended)

For IDE integration with slash commands:

```bash
npx bmad-method@alpha install
```

Gives you:

- Slash commands (`/bmad:bmm:workflows:prd`)
- 34+ workflows (not just agents)
- Status tracking (workflow-status.yaml)
- Local customization

---

## Troubleshooting

**ChatGPT: "File too large"**
→ Use stable release (compressed) or report issue

**Bundle not loading**
→ Use raw URL (not GitHub UI link)

**Out of date**
→ Wait 2-3 min after main merge, then refresh

---

**Issues?** Report at https://github.com/bmad-code-org/BMAD-METHOD/issues
