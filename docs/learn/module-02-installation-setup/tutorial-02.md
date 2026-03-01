# Module 02: Installation & Setup — Quick Checklist

**The fastest path from zero to WDS-ready**

**⏱️ 45-60 minutes total**

Just the action items. For detailed explanations, see the individual lessons.

---

## Lesson 01: Git Setup (15-20 min)

*[Full lesson →](lesson-01-git-setup.md)*

### Create GitHub Account

- [ ] Go to **<https://github.com>**
- [ ] Click **"Sign up"**
- [ ] Enter email, password, username (professional: `yourname-designer`)
- [ ] Verify email
- [ ] ✅ Log in successful

### Choose Your Scenario

- [ ] **A:** Starting new project → Continue below
- [ ] **B:** Joining existing → Skip to "Join Existing"
- [ ] **C:** Just learning → Skip to Lesson 02 below

### Create New Repository

- [ ] Click profile icon → **"Your repositories"** → **"New"**

**Decide: Single or Separate?**

- [ ] **Single repo:** `my-project` (specs + code together, small teams)
- [ ] **Separate repo:** `my-project-specs` (specs only, corporate/many devs)

**Repository Settings:**

- [ ] Name: `_____________` (lowercase-with-hyphens)
- [ ] Description: One-liner about project
- [ ] Public or Private
- [ ] ☑️ Check "Initialize with README"
- [ ] Click **"Create repository"**
- [ ] ✅ Repository created

### Join Existing Repository

- [ ] Ask owner for access (see [full lesson](lesson-01-git-setup.md) for email template)
- [ ] Accept invitation from email
- [ ] Check repo structure
- [ ] ✅ Access granted

---

## Lesson 02: IDE Installation (10 min)

*[Full lesson →](lesson-02-ide-installation.md)*

### Choose IDE

- [ ] **Cursor** (recommended) → <https://cursor.sh>
- [ ] **VS Code** (alternative) → <https://code.visualstudio.com>

### Install

- [ ] Download installer
- [ ] **Windows:** Run `.exe`, click through
- [ ] **Mac:** Drag to Applications, open
- [ ] **Linux:** Follow distro instructions

### First Launch

- [ ] Choose theme (Light/Dark)
- [ ] Sign in with GitHub → Yes!
- [ ] Install recommended extensions → Yes
- [ ] ✅ IDE open

### Verify Terminal

- [ ] Press **Ctrl+`** (Win/Linux) or **Cmd+`** (Mac)
- [ ] ✅ Terminal panel appears

---

## Lesson 03: Git Repository Cloning (10 min)

*[Full lesson →](lesson-03-git-cloning.md)*

### Create Projects Folder

In terminal (**Ctrl+`** or **Cmd+`**):

```bash
# Windows
mkdir C:\Projects
cd C:\Projects

# Mac/Linux
mkdir ~/Projects
cd ~/Projects
```

- [ ] ✅ Projects folder created

### Clone Your Repository

- [ ] Go to your repo on GitHub → Click **"Code"** → Copy URL
- [ ] In terminal: `git clone [paste-url]`
- [ ] (If prompted: Install Git → Click "Install")
- [ ] ✅ "done" message

### Open Project in IDE

- [ ] **File** → **Open Folder**
- [ ] Select your project folder
- [ ] ✅ Project in sidebar

---

## Lesson 04: WDS Initialization (10-15 min)

*[Full lesson →](lesson-04-wds-initialization.md)*

### Install WDS

In terminal (in YOUR project folder):

```bash
cd ~/Projects/your-project-name  # or cd C:\Projects\your-project-name
npx whiteport-design-studio install
```

- [ ] Follow the installer prompts (project type, experience level, IDE)
- [ ] ✅ `_bmad/wds/` folder appears in your project

### Activate an Agent

- [ ] Tell your AI IDE: `Read and activate the agent in _bmad/wds/agents/saga-analyst.md`
- [ ] ✅ Saga responds and welcomes you!

---

## Complete!

- ✅ GitHub account & repository
- ✅ IDE installed
- ✅ Project cloned
- ✅ WDS installed
- ✅ Agent activated

**Next:** [Module 03: Alignment & Signoff](../module-03-alignment-signoff/module-03-overview.md)

---

[← Back to Module Overview](module-02-overview.md)

*Part of Module 02: Installation & Setup*
