# Lesson 01: GitHub Setup

**Create your GitHub account and project repository**

---

## What You'll Do

- Create GitHub account
- Choose professional username
- Create or join a project repository
- Decide on repository structure (single vs separate)

**Time:** 15-20 minutes

---

## Part 1: Create Your GitHub Account

### What is GitHub?

Think of GitHub as:
- **Professional cloud storage** for your project files
- **Time machine** - every change saved, can go back to any version
- **Collaboration tool** - work with others seamlessly

**For designers:** GitHub is where your WDS specifications will live, backed up and version-controlled.

---

### Step 1: Sign Up

1. Go to **https://github.com**
2. Click the green **"Sign up"** button (top right)
3. Enter your email address
4. Create a password (make it strong!)
5. Choose a username

**Username Tips:**

✅ **Professional** - You might share this with clients  
✅ **Simple** - Easy to remember and spell  
✅ **Memorable** - Represents you or your work

**Good Examples:**
- `john-designer`
- `sarahux`
- `mike-creates`
- `[yourname]-design`

6. Verify you're human (solve the puzzle)
7. Check your email and click the verification link

**✅ Checkpoint:** You can log in to GitHub!

---

## Part 2: Create Your Project Repository

### What is a Repository?

A **repository** is a folder that GitHub tracks. Every change you make is saved, and you can always go back to any version.

---

### Step 2: Choose Your Scenario

**Which situation applies to you?**

**Scenario A: Starting a New Project** (Continue to Step 3 below)
- You're starting fresh
- No existing repository
- You control the setup

**Scenario B: Joining an Existing Project** (Skip to Step 7 below)
- Team project already exists
- Client has existing repository
- Contributing to ongoing work

**Scenario C: Just Learning WDS** (Skip this lesson)
- You're just learning WDS methodology
- Not starting a project yet
- **→ [Continue to Lesson 02: Install IDE](../lesson-02-install-ide/tutorial.md)**

**Most beginners: Use Scenario A**

---

## Scenario A: Create New Repository

### Step 3: Navigate to Repositories

1. After logging in, click your **profile icon** (top right)
2. Click **"Your repositories"**
3. Click the green **"New"** button

---

### Step 4: Choose Repository Structure

**IMPORTANT: Your naming choice determines your structure!**

#### Option A: Single Repository

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

---

#### Option B: Separate Specifications Repository

**Name with `-specs` suffix:**
- `dog-walker-app-specs`
- `recipe-platform-specs`
- `fitness-tracker-specs`

**Structure:**
```
dog-walker-app-specs/     ← This repo (specifications only)
dog-walker-app/           ← Separate code repo (create later)
```

**Use when:**
- ✅ Corporate or enterprise environment
- ✅ Specifications serve multiple products/platforms
- ✅ Development team has many developers
- ✅ Extensive or complex codebase
- ✅ Clear handoff boundaries needed
- ✅ Design and dev have separate workflows

---

### Step 5: Repository Settings

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

---

### Step 6: Create Repository

Click the green **"Create repository"** button

**✅ Checkpoint:** You see your new repository with a README file

**Remember your choice:**
- Single repo (`my-project`)? Specs and code together
- Separate repo (`my-project-specs`)? You'll create a second repo for code later

**[Continue to Lesson 02: Install IDE →](../lesson-02-install-ide/tutorial.md)**

---

## Scenario B: Joining Existing Repository

### Step 7: Request Repository Access

**Email template for repository owner or team lead:**

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

---

### Step 8: Accept the Invitation

1. Check your email for GitHub invitation
2. Click **"Accept invitation"**
3. Or go to the repository URL directly
4. You'll see an invitation banner → Click **"Accept"**

---

### Step 9: Understand the Existing Structure

**Before cloning, check what structure they're using:**

**Look at the repository name:**
- `project-name` → Likely single repo (specs + code together)
- `project-name-specs` → Separate specs repo (code elsewhere)

**Browse the repository:**
- Has `docs/` folder? → Probably already using WDS!
- Has `src/` or `app/` folder? → Code lives here too (single repo)
- Only documentation? → Separate specs repo

**When in doubt:** Ask the team lead!

**✅ Checkpoint:** Invitation accepted, you understand the structure

**[Continue to Lesson 02: Install IDE →](../lesson-02-install-ide/tutorial.md)**

---

## Troubleshooting

**Issue:** Didn't receive verification email  
**Solution:** Check spam folder, or click "Resend verification email"

**Issue:** Username already taken  
**Solution:** Try variations with hyphens or numbers (`john-ux-2`, `sarah-designs`)

**Issue:** Repository name already taken  
**Solution:** Add your username: `yourname-project-name`

**Issue:** Don't know which structure to use  
**Solution:** Ask your team lead, or use single repo (simpler for beginners)

**Issue:** Invitation expired  
**Solution:** Ask repository owner to resend invitation

---

## What's Next?

GitHub is set up and your repository is ready! Now let's install your IDE.

**[Continue to Lesson 02: Install IDE →](../lesson-02-install-ide/tutorial.md)**

---

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](../module-02-overview.md)*

