# Module 02: Installation & Setup

## Lesson 4: WDS Project Initialization

**Install WDS and activate your first agent**

---

## What You'll Do

- Install WDS via the CLI installer
- Understand the folder structure
- Activate an agent and start working

**Time:** 10-15 minutes

---

## Step 1: Install WDS

Navigate to your project folder in the terminal:

```bash
cd ~/Projects/your-project-name  # Mac/Linux
cd C:\Projects\your-project-name # Windows
```

Run the installer:

```bash
npx whiteport-design-studio install
```

The installer will guide you through:
- **Project type** — What kind of product you're designing
- **Experience level** — Beginner, Intermediate, or Expert
- **IDE configuration** — Sets up your AI IDE automatically

**✅ Checkpoint:** Installer completes, `_bmad/wds/` folder appears in your project

---

## Step 2: Understand the Structure

After installation, your project has:

```
your-project/
├── _bmad/wds/               ← WDS system files
│   ├── agents/              ← Agent files (.md)
│   │   ├── saga-analyst.md
│   │   ├── freya-ux.md
│   ├── workflows/           ← Phase workflows
│   ├── data/                ← Standards, frameworks
│   ├── gems/                ← Reusable prompt components
│   ├── templates/           ← Document templates
│   └── config.yaml          ← Your project configuration
├── _wds-learn/              ← Learning material (optional)
├── docs/                    ← Design output (created by agents)
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-UX-Scenarios/
│   ├── D-Design-System/
│   ├── E-PRD/
│   └── _progress/
└── .claude/instructions.md  ← IDE configuration
```

**Key insight:** `_bmad/wds/` contains the methodology. `docs/` is where your design work lives.

---

## Step 3: Activate an Agent

WDS has three specialized agents:

| Agent | What they do | When to use |
|-------|-------------|-------------|
| **Saga** | Business & Product Analyst | Product Brief, Trigger Mapping |
| **Freya** | UX/UI Designer | Scenarios, UX Design, Visual Design |

### Start with Saga

For a new project, start with Saga to create your Product Brief:

Tell your AI IDE:

```
Read and activate the agent in _bmad/wds/agents/saga-analyst.md
```

Saga will:
- Introduce herself
- Scan your project for existing WDS work
- Guide you to the right starting point

**✅ Checkpoint:** Saga responds and welcomes you!

---

## Troubleshooting

**Issue:** `npx` command not found → Install Node.js from <https://nodejs.org>
**Issue:** Installer fails → Make sure you're in your project folder
**Issue:** Agent file not found → Check `_bmad/wds/agents/` folder exists

---

## Congratulations!

You've completed Module 02: Installation & Setup!

**What you accomplished:**
- ✅ GitHub account & repository
- ✅ IDE installed
- ✅ Project cloned
- ✅ WDS installed
- ✅ Agent activated

**You're ready to design with WDS!**

---

## What's Next?

- **[Module 03: Alignment & Signoff](../module-03-alignment-signoff/module-03-overview.md)**
- **[WDS Training Course](../00-course-overview/00-course-overview.md)**
- **Ask Saga:** "What should I do next?"

---

*Part of Module 02: Installation & Setup*
*[← Back to Module Overview](module-02-overview.md)*
