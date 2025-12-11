# Tutorial 02: Complete Beginner Setup

**From zero to WDS-ready - step by step, screenshot by screenshot**

---

## 🎯 What You'll Accomplish

By the end of this tutorial:

- ✅ GitHub account created
- ✅ Project repository set up
- ✅ IDE installed (Cursor or VS Code)
- ✅ Project cloned to your computer
- ✅ WDS added to workspace
- ✅ Mimir activated and ready to guide you

**Total time:** 45-60 minutes (first time)

**No prior experience needed!** We assume you're starting from zero.

---

## Step 1: Create Your GitHub Account 🌐

**What is GitHub?** Think of it as a professional cloud storage + time machine for your project files. Every change is saved, you can go back to any version, and you can work with others.

### 1.1 Sign Up

1. Go to **https://github.com**
2. Click the green **"Sign up"** button (top right)
3. Enter your email address
4. Create a password (make it strong!)
5. Choose a username

**Username Tips:**
- Professional (you might share this with clients)
- Simple and memorable
- Examples: `john-designer`, `sarahux`, `mike-creates`

6. Verify you're human (solve the puzzle)
7. Check your email and click the verification link

**✅ Checkpoint:** You can log in to GitHub

---

## Step 2: Create Your Project Repository 📦

**What is a repository?** A folder that GitHub tracks. Every change you make is saved, and you can always go back.

### 2.1 Three Scenarios

**Before creating a repository, determine which scenario applies to you:**

**Scenario A: Starting a New Project** (Continue to 2.2 below)
- You're starting fresh
- No existing repository
- You control the setup

**Scenario B: Joining an Existing Project** (Skip to 2.6 below)
- Team project already exists
- Client has existing repository
- Contributing to ongoing work

**Scenario C: Using WDS as a Reference Only** (Skip to Step 3)
- You're just learning WDS methodology
- Not starting a project yet
- Following along with tutorial

**Most beginners: Use Scenario A (start new project)**

---

### 2.2 Navigate to Repositories (Scenario A: New Project)

1. After logging in, click your **profile icon** (top right)
2. Click **"Your repositories"**
3. Click the green **"New"** button

### 2.3 Repository Settings (Scenario A continued)

**IMPORTANT: Your naming choice determines your structure!**

### Single Repo or Separate Specs Repo?

**Option A: Single Repository**

**Name it simply:**
- `dog-walker-app`
- `recipe-platform`
- `fitness-tracker`

**Structure:**
```
dog-walker-app/
├── docs/              ← Your WDS specifications
└── src/               ← Code
```

**Use when:**
- ✅ You're close to the development team
- ✅ You want simple, direct communication
- ✅ You're building the whole project yourself
- ✅ Working closely with other designers
- ✅ Small team with full ownership
- ✅ Rapid iteration and feedback

**Option B: Separate Specifications Repository**

**Name with `-specs` suffix:**
- `dog-walker-app-specs`
- `recipe-platform-specs`
- `fitness-tracker-specs`

**Structure:**
```
dog-walker-app-specs/     ← This repo (specifications only)
dog-walker-app/           ← Separate code repo
```

**Use when:**
- ✅ Corporate or enterprise environment
- ✅ Specifications serve multiple products/platforms
- ✅ Development team has many developers
- ✅ Extensive or complex codebase
- ✅ Clear handoff boundaries needed
- ✅ Design and dev have separate workflows

**For this tutorial:**
- Beginners: Use **Option A** (single repo like `dog-walker-app`)
- Corporate/Enterprise: Use **Option B** (separate like `dog-walker-app-specs`)

**Choose your name now based on your situation!**

---

**Repository Name:**
- Use lowercase with hyphens
- Descriptive and specific
- Examples: `dog-walker-app` OR `dog-walker-app-specs`

**Description:**
- Short one-liner about your project
- Example: "UX specifications for Dog Week family coordination app"

**Public vs Private:**
- **Public:** Anyone can see (good for portfolio projects)
- **Private:** Only you and invited collaborators (good for client work)

**Initialize with README:**
- ☑️ **Check this box!** It creates a starter file

**DO NOT** add .gitignore or license yet (we'll do this later)

### 2.4 Create Repository (Scenario A continued)

Click the green **"Create repository"** button

**✅ Checkpoint:** You see your new repository with a README file

**Remember your choice:**
- Single repo (`my-project`)? Specs and code together
- Separate repo (`my-project-specs`)? You'll create a second repo for code later

**Now skip to Step 3: Install Your IDE**

---

### 2.6 Joining an Existing Repository (Scenario B)

**If you're joining a team project or client repository:**

#### 2.6.1 Request Repository Access

**Ask the repository owner or team lead:**

```
Hi [Name],

I'd like to contribute to [project-name] using WDS methodology. 
Could you add me as a collaborator to the repository?

My GitHub username: [your-username]

Thank you!
```

**They will:**
1. Go to repository settings
2. Click "Collaborators"
3. Add your GitHub username
4. You'll receive an email invitation

#### 2.6.2 Accept the Invitation

1. Check your email for GitHub invitation
2. Click **"Accept invitation"**
3. Or go to the repository URL directly
4. You'll see an invitation banner → Click **"Accept"**

#### 2.6.3 Understand the Existing Structure

**Before cloning, check what structure they're using:**

Look at the repository name:
- `project-name` → Likely single repo (specs + code together)
- `project-name-specs` → Separate specs repo (code elsewhere)

Browse the repository:
- Has `docs/` folder? → Probably already using WDS!
- Has `src/` or `app/` folder? → Code lives here too (single repo)
- Only documentation? → Separate specs repo

**Ask the team lead if unsure!**

**✅ Checkpoint:** Invitation accepted, you understand the structure

**Now continue to Step 3: Install Your IDE**

---

## Step 3: Install Your IDE 💻

**What is an IDE?** Your workspace for creating specifications. Like Microsoft Word, but for design files.

### 3.1 Choose: Cursor or VS Code?

**Cursor (Recommended)**
- Built for AI assistance
- Modern interface
- Perfect for WDS
- **Download:** https://cursor.sh

**VS Code (Alternative)**
- Industry standard
- More extensions
- Works great with WDS too
- **Download:** https://code.visualstudio.com

**For beginners:** Choose Cursor. It's designed for AI-augmented work.

### 3.2 Install Cursor

1. Download from **https://cursor.sh**
2. Run the installer
   - **Windows:** Double-click the `.exe` file
   - **Mac:** Drag Cursor to Applications folder
   - **Linux:** Follow the Linux installation instructions
3. Open Cursor for the first time
4. Choose your theme (Light or Dark - you can change this later)

### 3.3 First Launch Setup

Cursor will ask you a few questions:

- **"Import settings from VS Code?"** → Skip (unless you already use VS Code)
- **"Sign in with GitHub?"** → Yes! (makes cloning easier)
- **"Install recommended extensions?"** → Yes

**✅ Checkpoint:** Cursor is open and ready

---

## Step 4: Let the IDE Handle Git 🔧

**What is Git?** The behind-the-scenes tool that syncs your computer with GitHub.

**Good news:** You don't need to install anything manually! Modern IDEs like Cursor handle this for you.

### 4.1 Recap: Your Repository Structure

**You already decided this in Step 2 when naming your repo!**

**Single repo (named `my-project`):**
```
my-project/
├── docs/              ← Your WDS specifications
└── src/               ← Code lives here too
```

**Separate repo (named `my-project-specs`):**
```
my-project-specs/      ← This repo (specifications only)
                       ← Create separate code repo later
```

**For this tutorial, we assume single repo** (`dog-walker-app`)

### 4.2 Let Cursor Install Git Automatically

When you try to clone a repository in Step 5, Cursor will:
1. Check if Git is installed
2. If not, **automatically prompt you to install it**
3. Click "Install" when prompted
4. Done!

**That's it.** No command line needed.

### 4.3 Alternative: GitHub Desktop (Even Easier!)

**For designers who prefer visual tools:**

1. Download **GitHub Desktop** from **https://desktop.github.com**
2. Install it
3. Sign in with your GitHub account
4. Use it to clone repositories (visual interface, no commands!)

**Then** open the cloned folder in Cursor.

**This is perfectly valid!** Many professional designers use GitHub Desktop.

**Bonus:** GitHub Desktop also helps you decide between single vs separate repos visually!

### 4.4 Already Comfortable with Terminal?

If you want to verify Git is installed:

In Cursor terminal (press **Ctrl+`** or **Cmd+`**):
```bash
git --version
```

If you see a version number → you're good!  
If not → Continue to Step 5, Cursor will prompt you.

**✅ Checkpoint:** Ready to clone your repository in Step 5!

---

## Step 5: Clone Your Project Repository 📥

**What is cloning?** Copying your GitHub repository to your computer so you can work on it.

### 5.1 Get Your Repository URL

1. Go to your repository on GitHub
2. Click the green **"Code"** button
3. Make sure **"HTTPS"** is selected
4. Click the **copy icon** (📋) to copy the URL

**Your URL looks like:** `https://github.com/your-username/your-project.git`

### 5.2 Choose Where to Clone

**Windows:** `C:\Users\YourName\Projects\`  
**Mac/Linux:** `/Users/YourName/Projects/` or `~/Projects/`

**Don't have a Projects folder?** Let's create one:

In Cursor terminal:
```bash
# Windows
mkdir C:\Projects
cd C:\Projects

# Mac/Linux
mkdir ~/Projects
cd ~/Projects
```

### 5.3 Clone the Repository

In Cursor terminal, type:

```bash
git clone [paste your URL here]
```

**Example:**
```bash
git clone https://github.com/john-designer/dog-walker-app.git
```

Press Enter and wait for it to download.

**✅ Checkpoint:** You see "Cloning into..." and then "done"

### 5.4 Open Your Project in Cursor

1. In Cursor: **File** → **Open Folder**
2. Navigate to your Projects folder
3. Select your project folder (e.g., `dog-walker-app`)
4. Click **"Select Folder"** or **"Open"**

**✅ Checkpoint:** You see your project name in the left sidebar with the README.md file

---

## Step 6: Add WDS to Your Workspace 🎨

**What is WDS?** The methodology files that contain agents, workflows, and training.

### 6.1 Decide: Clone WDS Inside or Beside?

**Option A: Inside Your Project (Simpler)**
```
my-project/
├── .wds/                    ← WDS here
├── docs/                    ← Your specs
└── README.md
```

**Option B: Separate in Workspace (Recommended)**
```
Workspace/
├── my-project/              ← Your project
└── whiteport-design-studio/ ← WDS here
```

**For beginners: Use Option B** (easier to update WDS later)

### 6.2 Add WDS to Workspace

**Method 1: Through Cursor (Easiest)**

1. In Cursor: **File** → **Add Folder to Workspace**
2. You'll now clone WDS

In Cursor terminal (make sure you're in your Projects folder):

```bash
# Navigate to Projects folder
cd ~/Projects  # Mac/Linux
cd C:\Projects # Windows

# Clone WDS
git clone https://github.com/whiteport-collective/whiteport-design-studio.git
```

3. Back in Cursor: **File** → **Add Folder to Workspace**
4. Select the `whiteport-design-studio` folder
5. Click **"Add"**

**✅ Checkpoint:** You see both folders in your Cursor sidebar:
- your-project
- whiteport-design-studio

---

## Step 7: Create Your Docs Structure 📁

**What is the docs folder?** Where all your WDS specifications will live. This is your design source of truth.

### 7.1 Create the 8-Phase Structure

In Cursor terminal (make sure you're in YOUR project folder):

```bash
# Navigate to your project
cd ~/Projects/dog-walker-app  # Change to YOUR project name

# Create docs structure
mkdir -p docs/1-project-brief
mkdir -p docs/2-trigger-mapping
mkdir -p docs/3-prd-platform
mkdir -p docs/4-ux-design
mkdir -p docs/5-design-system
mkdir -p docs/6-design-deliveries
mkdir -p docs/7-testing
mkdir -p docs/8-ongoing-development
```

**Windows alternative (if mkdir -p doesn't work):**
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

## Step 8: Initiate with Mimir 🧠

**What is Mimir?** Your WDS guide and orchestrator. He'll assess your needs and connect you with the right agents.

### 8.1 Find the Mimir File

In Cursor sidebar:
1. Expand `whiteport-design-studio`
2. Expand `src` → `modules` → `wds`
3. Find **`MIMIR-WDS-ORCHESTRATOR.md`**

### 8.2 Drag to AI Chat

1. **Open AI chat** in Cursor (usually the chat icon, or press Ctrl+L / Cmd+L)
2. **Drag** `MIMIR-WDS-ORCHESTRATOR.md` into the chat input area
3. **Press Enter** or click Send

**Alternative method:**
Type in chat:
```
@MIMIR-WDS-ORCHESTRATOR.md
```

### 8.3 Your First Interaction

Mimir will introduce himself and ask you questions like:

- "What's your experience level with design tools?"
- "What project are you working on?"
- "How are you feeling about starting this?"

**Be honest!** Mimir adapts to YOUR level.

After assessment, Mimir will:
- ✅ Verify your installation
- ✅ Explain the next steps
- ✅ Introduce you to specialist agents
- ✅ Guide you to your first workflow

**✅ Checkpoint:** Mimir responds and welcomes you to WDS!

---

## 🎉 Congratulations! You're Set Up!

### What You Just Accomplished

In less than an hour, you:

1. ✅ Created a professional GitHub account
2. ✅ Set up your first project repository
3. ✅ Installed a modern IDE (Cursor)
4. ✅ Cloned your project to your computer
5. ✅ Added WDS methodology to your workspace
6. ✅ Created proper folder structure
7. ✅ Activated Mimir, your guide
8. ✅ Ready to start designing!

**This is a HUGE accomplishment!** Many designers never get past this step. You just did.

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
    │   ├── src/                               ← Code (if building)
    │   └── README.md                          ← Project description
    │
    └── whiteport-design-studio/               ← WDS METHODOLOGY
        └── src/modules/wds/
            ├── agents/                        ← Agent definitions
            ├── workflows/                     ← Workflow guides
            ├── course/                        ← Training modules
            └── MIMIR-WDS-ORCHESTRATOR.md     ← Your guide
```

---

## Troubleshooting 🔧

### "Git command not found"
**Solution:** Install Git (see Step 4.2), then restart Cursor

### "Permission denied" when cloning
**Solution:** Make sure you're signed into GitHub in Cursor

### "Can't find MIMIR file"
**Solution:** Make sure you added `whiteport-design-studio` folder to workspace (Step 6)

### "Mimir doesn't respond"
**Solution:** Make sure you dragged the ENTIRE file, not just the filename

### "mkdir: cannot create directory"
**Solution:** Make sure you're in your project folder: `cd ~/Projects/your-project`

### Still stuck?
Ask Mimir: **"@wds-mimir I'm stuck on installation, can you help?"**

---

## Next Steps 🚀

**Now that you're set up:**

### Option 1: Continue Training
[→ Module 03: Create Project Brief](../module-03-project-brief/module-03-overview.md)

### Option 2: Start Your Project
Ask Mimir:
```
@wds-mimir I want to start working on my project. Where should I begin?
```

### Option 3: Explore WDS
- Browse the workflows folder
- Read about the 8-phase structure
- Check out the other agents (Freyja, Saga, Idunn)

---

## Pro Tips for Beginners 💡

**Tip 1: Commit Often**
Every time you make meaningful progress, save to GitHub:
```bash
git add .
git commit -m "Describe what you did"
git push
```

**Tip 2: Keep WDS Updated**
Once a month, update WDS to get new features:
```bash
cd ~/Projects/whiteport-design-studio
git pull
```

**Tip 3: When in Doubt, Ask Mimir**
```
@wds-mimir [your question]
```
No question is too small!

**Tip 4: Save Your Workspace**
In Cursor: **File** → **Save Workspace As** → `my-project.code-workspace`
Next time, just open this file!

---

**You did it! Welcome to WDS.** 🌊

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](module-02-overview.md)*
