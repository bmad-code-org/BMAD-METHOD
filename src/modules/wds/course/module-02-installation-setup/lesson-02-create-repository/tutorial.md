# Lesson 02: Create Your Project Repository

**Set up your project repository or join an existing one**

---

## What You'll Do

- Understand three common scenarios
- Create a new repository (Scenario A)
- OR join an existing project (Scenario B)
- Decide: Single repo or separate specs repo
- Name your repository correctly

**Time:** 10-15 minutes

---

## Three Scenarios

**Before creating a repository, determine which applies to you:**

### Scenario A: Starting a New Project
- You're starting fresh
- No existing repository
- You control the setup
- **→ Continue reading below**

### Scenario B: Joining an Existing Project
- Team project already exists
- Client has existing repository
- Contributing to ongoing work
- **→ Skip to "Joining Existing Repository" section below**

### Scenario C: Just Learning WDS
- You're just learning WDS methodology
- Not starting a project yet
- Following along with tutorial
- **→ Skip to [Lesson 03: Install IDE](../lesson-03-install-ide/tutorial.md)**

**Most beginners: Use Scenario A**

---

## Scenario A: Create New Repository

### Step 1: Navigate to Repositories

1. Log in to GitHub
2. Click your **profile icon** (top right)
3. Click **"Your repositories"**
4. Click the green **"New"** button

---

### Step 2: Choose Your Repository Structure

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

### Step 3: Repository Settings

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

### Step 4: Create Repository

Click the green **"Create repository"** button

**✅ Checkpoint:** You see your new repository with a README file

**Remember your choice:**
- Single repo (`my-project`)? Specs and code together
- Separate repo (`my-project-specs`)? You'll create a second repo for code later

**[Continue to Lesson 03: Install IDE →](../lesson-03-install-ide/tutorial.md)**

---

## Scenario B: Joining Existing Repository

**If you're joining a team project or client repository:**

### Step 1: Request Repository Access

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

### Step 2: Accept the Invitation

1. Check your email for GitHub invitation
2. Click **"Accept invitation"**
3. Or go to the repository URL directly
4. You'll see an invitation banner → Click **"Accept"**

---

### Step 3: Understand the Existing Structure

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

**[Continue to Lesson 03: Install IDE →](../lesson-03-install-ide/tutorial.md)**

---

## Troubleshooting

**Issue:** Repository name already taken  
**Solution:** Add your username or team name: `yourname-project-name`

**Issue:** Don't know which structure to use  
**Solution:** Ask your team lead, or use single repo (simpler)

**Issue:** Invitation expired  
**Solution:** Ask repository owner to resend invitation

---

## What's Next?

Now that your repository is set up, it's time to install your IDE!

**[Continue to Lesson 03: Install IDE →](../lesson-03-install-ide/tutorial.md)**

---

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](../module-02-overview.md)*

