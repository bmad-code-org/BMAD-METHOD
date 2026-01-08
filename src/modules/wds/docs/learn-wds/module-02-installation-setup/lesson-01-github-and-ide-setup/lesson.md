# Lesson 01: GitHub & IDE Setup

**Get your development environment ready**

---

## What You'll Do

- Create GitHub account
- Create or join repository
- Install IDE (Cursor or VS Code)
- Verify everything works

**Time:** 25-30 minutes

---

## Part 1: GitHub Setup

### What is GitHub?

Professional cloud storage + time machine for your project files. Every change is saved, you can go back to any version, and you can work with others.

### Step 1: Create GitHub Account

1. Go to **<https://github.com>**
2. Click **"Sign up"** (top right)
3. Enter email, password, username

**Username Tips:**
- Professional: `john-designer`, `sarahux`, `mike-creates`
- You might share this with clients

4. Verify email
5. Log in

**✅ Checkpoint:** You can log in to GitHub

---

### Step 2: Choose Your Scenario

**Scenario A: Starting a New Project** → Continue to Step 3  
**Scenario B: Joining Existing Project** → Skip to Step 6  
**Scenario C: Just Learning WDS** → Skip to Part 2

---

### Step 3: Create Repository (Scenario A)

1. Click profile icon → **"Your repositories"** → **"New"**

### Step 4: Decide Repository Structure

**IMPORTANT: Your naming choice determines your structure!**

#### Single Repository

**Name:** `my-project` (e.g., `dog-walker-app`)

```
my-project/
├── docs/    ← WDS specifications
└── src/     ← Code
```

**Use when:**
- Small team, building yourself
- Simple communication
- Rapid iteration

#### Separate Specifications Repository

**Name:** `my-project-specs` (e.g., `dog-walker-app-specs`)

```
my-project-specs/    ← Specifications only
my-project/          ← Separate code repo
```

**Use when:**
- Corporate environment
- Many developers
- Clear handoff needed

### Step 5: Create Repository

- **Name:** `____________` (lowercase-with-hyphens)
- **Description:** One-liner about project
- **Public** (portfolio) or **Private** (client work)
- ☑️ **Check "Initialize with README"**
- Click **"Create repository"**

**✅ Checkpoint:** Repository created

---

### Step 6: Join Existing Repository (Scenario B)

**Email template:**

```
Hi [Name],

I'd like to contribute to [project-name] using WDS methodology. 
Could you add me as a collaborator?

My GitHub username: [your-username]

Thank you!
```

**Then:**
1. Accept invitation from email
2. Check repo name (ends in `-specs`? Separate repo)
3. Browse structure (has `docs/`? WDS already!)

**✅ Checkpoint:** Access granted

---

## Part 2: IDE Installation

### What is an IDE?

Your workspace for creating specifications. Like Microsoft Word, but for design files.

### Step 1: Choose Your IDE

**Cursor (Recommended)**
- Built for AI assistance
- Perfect for WDS
- Download: <https://cursor.sh>

**VS Code (Alternative)**
- Industry standard
- Works great too
- Download: <https://code.visualstudio.com>

**For beginners:** Choose Cursor

---

### Step 2: Install

**Windows:**
1. Run `.exe` file
2. Click through installer
3. Use defaults

**Mac:**
1. Open download
2. Drag to Applications
3. Open from Applications

**Linux:**
Follow distro instructions

---

### Step 3: First Launch

1. Choose theme (Light/Dark)
2. **Sign in with GitHub** → Yes!
3. Install recommended extensions → Yes

**✅ Checkpoint:** IDE open and ready

---

### Step 4: Verify Terminal

Press **Ctrl+`** (Win/Linux) or **Cmd+`** (Mac)

**✅ Checkpoint:** Terminal panel appears

---

## Troubleshooting

**GitHub Issues:**
- **Verification email missing** → Check spam
- **Username taken** → Try `yourname-designer-2`
- **Repository name taken** → Add your username

**IDE Issues:**
- **Can't find download** → Check Downloads folder
- **Mac "unidentified developer"** → Right-click → Open
- **Terminal won't open** → View menu → Terminal → New Terminal

---

## What's Next?

GitHub account, repository, and IDE are ready! Now let's configure Git.

**[Continue to Lesson 02: Git Configuration →](../lesson-02-git-setup/lesson.md)**

---

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](../module-02-overview.md)*

