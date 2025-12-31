# Lesson 04: Repository Cloning & WDS Integration

**Get your project and WDS onto your computer**

---

## What You'll Do

- Clone your project repository
- Add WDS to your workspace
- Create docs folder structure

**Time:** 15-20 minutes

---

## Step 1: Choose Where to Store Projects

**Create a Projects folder:**

**Windows:** `C:\Users\YourName\Projects\`  
**Mac/Linux:** `/Users/YourName/Projects/` or `~/Projects/`

### Create the Folder

In Cursor terminal (**Ctrl+`** or **Cmd+`**):

```bash
# Windows
mkdir C:\Projects
cd C:\Projects

# Mac/Linux
mkdir ~/Projects
cd ~/Projects
```

**✅ Checkpoint:** Projects folder created

---

## Step 2: Clone Your Project Repository

**What is cloning?** Copying your GitHub repository to your computer so you can work on it.

### 2.1 Get Your Repository URL

1. Go to your repository on GitHub
2. Click the green **"Code"** button
3. Make sure **"HTTPS"** is selected
4. Click the **copy icon** (📋)

**Your URL looks like:** `https://github.com/your-username/your-project.git`

### 2.2 Clone the Repository

In Cursor terminal:

```bash
git clone [paste your URL here]
```

**Example:**
```bash
git clone https://github.com/john-designer/dog-walker-app.git
```

**If Cursor prompts "Install Git?"** → Click **"Install"** and wait, then try again.

**✅ Checkpoint:** You see "Cloning into..." and then "done"

---

## Step 3: Open Your Project in Cursor

1. In Cursor: **File** → **Open Folder**
2. Navigate to your Projects folder
3. Select your project folder (e.g., `dog-walker-app`)
4. Click **"Select Folder"** or **"Open"**

**✅ Checkpoint:** You see your project name in the left sidebar with README.md

---

## Step 4: Clone WDS Repository

**What is WDS?** The methodology files that contain agents, workflows, and training.

**WDS lives separately from your project.**

In Cursor terminal (make sure you're in Projects folder):

```bash
# Navigate back to Projects folder
cd ~/Projects  # Mac/Linux
cd C:\Projects # Windows

# Clone WDS
git clone https://github.com/whiteport-collective/whiteport-design-studio.git
```

**✅ Checkpoint:** WDS cloned successfully

---

## Step 5: Add WDS to Your Workspace

1. In Cursor: **File** → **Add Folder to Workspace**
2. Navigate to your Projects folder
3. Select the `whiteport-design-studio` folder
4. Click **"Add"**

**✅ Checkpoint:** You see both folders in your Cursor sidebar:
- your-project
- whiteport-design-studio

---

## Step 6: Create Docs Folder Structure

**What is the docs folder?** Where all your WDS specifications will live. This is your design source of truth.

**Navigate to YOUR project (not WDS):**

```bash
# Change to your project
cd ~/Projects/dog-walker-app  # Mac/Linux (use YOUR project name!)
cd C:\Projects\dog-walker-app # Windows (use YOUR project name!)
```

**Create the 8-phase structure:**

```bash
# Mac/Linux (works in most terminals)
mkdir -p docs/1-project-brief
mkdir -p docs/2-trigger-mapping
mkdir -p docs/3-prd-platform
mkdir -p docs/4-ux-design
mkdir -p docs/5-design-system
mkdir -p docs/6-design-deliveries
mkdir -p docs/7-testing
mkdir -p docs/8-ongoing-development
```

**Windows alternative (if above doesn't work):**
```bash
mkdir docs
cd docs
mkdir 1-project-brief
mkdir 2-trigger-mapping
mkdir 3-prd-platform
mkdir 4-ux-design
mkdir 5-design-system
mkdir 6-design-deliveries
mkdir 7-testing
mkdir 8-ongoing-development
cd ..
```

**✅ Checkpoint:** You see a `docs/` folder with 8 numbered subfolders in your project

---

## Quick Reference: What Lives Where

```
Your Computer/
└── Projects/
    ├── your-project/                          ← YOUR PROJECT
    │   ├── docs/                              ← Your specifications
    │   │   ├── 1-project-brief/
    │   │   ├── 2-trigger-mapping/
    │   │   ├── 3-prd-platform/
    │   │   ├── 4-ux-design/
    │   │   ├── 5-design-system/
    │   │   ├── 6-design-deliveries/
    │   │   ├── 7-testing/
    │   │   └── 8-ongoing-development/
    │   ├── src/                               ← Code (if single repo)
    │   └── README.md
    │
    └── whiteport-design-studio/               ← WDS METHODOLOGY
        └── src/modules/wds/
            ├── agents/
            ├── workflows/
            ├── course/
            └── MIMIR-WDS-ORCHESTRATOR.md
```

---

## Troubleshooting

**Issue:** "Git command not found"  
**Solution:** Let Cursor install Git when prompted, then try again

**Issue:** "Permission denied" when cloning  
**Solution:** Make sure you're signed into GitHub in Cursor

**Issue:** "Can't find MIMIR file"  
**Solution:** Make sure you added `whiteport-design-studio` folder to workspace (Step 5)

**Issue:** "mkdir: cannot create directory"  
**Solution:** Make sure you're in your project folder: `cd ~/Projects/your-project`

---

## What's Next?

Everything is set up! Now let's activate Mimir and begin your WDS journey.

**[Continue to Lesson 05: Mimir Activation →](../lesson-05-initiate-mimir/tutorial.md)**

---

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](../module-02-overview.md)*
