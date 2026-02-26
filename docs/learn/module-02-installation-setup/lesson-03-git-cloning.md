# Module 02: Installation & Setup

## Lesson 3: Git Repository Cloning

**Clone your project to your computer**

---

## What You'll Do

- Create Projects folder
- Clone your repository
- Open project in IDE
- Understand Git auto-installation

**Time:** 10 minutes

---

## Step 1: Create Projects Folder

**Choose a location:**
- Windows: `C:\Users\YourName\Projects\`
- Mac/Linux: `~/Projects/`

In terminal (**Ctrl+`** or **Cmd+`**):

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

## Step 2: Get Repository URL

1. Go to your repository on GitHub
2. Click green **"Code"** button
3. Make sure **"HTTPS"** selected
4. Click copy icon

**Your URL:** `https://github.com/your-username/your-project.git`

---

## Step 3: Clone Repository

In terminal:

```bash
git clone [paste your URL]
```

**Example:**
```bash
git clone https://github.com/john-designer/dog-walker-app.git
```

**If Cursor prompts "Install Git?"** → Click **"Install"**, wait, try again

**✅ Checkpoint:** See "Cloning into..." then "done"

---

## Step 4: Open Project in IDE

1. **File** → **Open Folder**
2. Navigate to Projects folder
3. Select your project folder
4. Click **"Select Folder"** or **"Open"**

**✅ Checkpoint:** Project name in sidebar with README.md

---

## About Git Auto-Installation

**Git** is the tool that syncs with GitHub. Modern IDEs handle this automatically:

- First time cloning → IDE prompts to install
- You click "Install"
- Done!

**Alternative:** Use GitHub Desktop (<https://desktop.github.com>) for visual interface

---

## Troubleshooting

**Issue:** "Git command not found" → Let IDE install when prompted
**Issue:** "Permission denied" → Sign into GitHub in IDE
**Issue:** Clone fails → Check URL copied correctly

---

## What's Next?

Project cloned! Now install WDS and start designing.

**[Continue to Lesson 04: WDS Project Initialization →](lesson-04-wds-initialization.md)**

---

*Part of Module 02: Installation & Setup*
*[← Back to Module Overview](module-02-overview.md)*
