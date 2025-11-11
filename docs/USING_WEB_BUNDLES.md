# Using BMAD Web Bundles (For Users)

**Audience:** Users wanting to use BMAD agents in Claude Projects, ChatGPT, or Gemini

---

## Quick Start

**1. Pick your channel:**

- **Stable:** `https://github.com/bmad-code-org/BMAD-METHOD/releases/latest`
- **Latest:** `https://bmad-code-org.github.io/bmad-bundles/`

**2. Copy raw XML URL:**

```
https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/bmm/agents/pm.xml
```

**3. Add to AI platform:**

- **Claude Projects:** Project Knowledge → Add URL
- **ChatGPT:** Custom Instructions → Paste content
- **Gemini Gems:** Knowledge → Add URL

---

## Available Modules

**Bulk Downloads:**

- [📦 BMM Agents (8)](https://bmad-code-org.github.io/bmad-bundles/downloads/bmm-agents.zip)
- [📦 BMB Agents (1)](https://bmad-code-org.github.io/bmad-bundles/downloads/bmb-agents.zip)
- [📦 CIS Agents (5)](https://bmad-code-org.github.io/bmad-bundles/downloads/cis-agents.zip)
- [📦 BMGD Agents (4)](https://bmad-code-org.github.io/bmad-bundles/downloads/bmgd-agents.zip)

**Individual Agents:**

### BMM (BMad Method)

- [PM](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/bmm/agents/pm.xml) | [Architect](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/bmm/agents/architect.xml) | [TEA](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/bmm/agents/tea.xml) | [Developer](https://raw.githubusercontent.com/bmad-code-org/bmad-bundles/main/bmm/agents/dev.xml)
- [Browse All](https://bmad-code-org.github.io/bmad-bundles/bmm/agents/)

### BMB / CIS / BMGD

- [Browse BMB](https://bmad-code-org.github.io/bmad-bundles/bmb/agents/) | [Browse CIS](https://bmad-code-org.github.io/bmad-bundles/cis/agents/) | [Browse BMGD](https://bmad-code-org.github.io/bmad-bundles/bmgd/agents/)

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
→ Some agents (PM: 166KB, Analyst: 211KB) exceed ChatGPT limits. Use smaller agents or report issue.

**Bundle not loading**
→ Use raw URL (not GitHub UI link). URL should end in `.xml`.

**Out of date**
→ Wait 2-3 min after main merge, then refresh.

---

**Issues?** Report at https://github.com/bmad-code-org/BMAD-METHOD/issues
