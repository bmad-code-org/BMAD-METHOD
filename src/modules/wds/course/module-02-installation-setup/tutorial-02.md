# Tutorial 02: Install WDS in 5 Minutes

**Quick, hands-on guide to get WDS running**

---

## What You'll Do

1. Check prerequisites
2. Clone WDS repository
3. Verify installation
4. Create your first project
5. Meet Mimir

**Total time:** 5-10 minutes

---

## Step 1: Check Prerequisites ✅

**Open your terminal and verify:**

```bash
# Check Node.js version (need 18+)
node --version

# Check Git
git --version
```

**Expected output:**
- Node: `v18.x.x` or higher
- Git: `git version 2.x.x` or similar

**Missing something?**
- Install Node.js: https://nodejs.org/
- Install Git: https://git-scm.com/

---

## Step 2: Clone WDS Repository 📦

**Choose your workspace location:**

```bash
# Navigate to where you want WDS
cd ~/projects  # Mac/Linux
cd C:\dev      # Windows

# Clone WDS
git clone https://github.com/whiteport-collective/whiteport-design-studio.git

# Enter the directory
cd whiteport-design-studio
```

**✅ Checkpoint:** You should see WDS files in your directory

---

## Step 3: Verify Installation 🔍

**Check the structure:**

```bash
# List WDS contents
ls -la  # Mac/Linux
dir     # Windows
```

**You should see:**
- `src/modules/wds/` - The WDS methodology
- `src/modules/wds/agents/` - Agent definitions
- `src/modules/wds/workflows/` - Workflow guides
- `src/modules/wds/course/` - This training

**✅ Checkpoint:** All folders present

---

## Step 4: Add WDS to Your IDE Workspace 🎨

**Option A: Cursor / VS Code**

1. Open your IDE
2. File → Add Folder to Workspace
3. Select the `whiteport-design-studio` folder
4. WDS is now in your workspace!

**Option B: Already have a project?**

Add WDS alongside your existing project:

```
YourWorkspace/
├── your-project/
└── whiteport-design-studio/  ← Add this
```

**✅ Checkpoint:** WDS appears in your IDE sidebar

---

## Step 5: Create Your First Project 📁

**In your project folder, create the docs structure:**

```bash
# Navigate to your project (not WDS)
cd ../your-project

# Create docs folder with WDS structure
mkdir -p docs/{1-project-brief,2-trigger-mapping,3-prd-platform,4-ux-design,5-design-system,6-design-deliveries,7-testing,8-ongoing-development}

# Verify structure
ls docs/
```

**✅ Checkpoint:** You should see 8 numbered folders

---

## Step 6: Meet Mimir 🧠

**Start a new conversation with your AI assistant:**

```
@wds-mimir Hello! I just installed WDS and I'm ready to start.
```

**Mimir will:**
1. Welcome you
2. Assess your skill level
3. Check your installation
4. Guide your next steps

**Alternative:** You can drag the Mimir file to your chat:
`whiteport-design-studio/src/modules/wds/MIMIR-WDS-ORCHESTRATOR.md`

---

## Troubleshooting 🔧

### Issue: "Command not found: git"
**Solution:** Install Git from https://git-scm.com/

### Issue: "Node version too old"
**Solution:** Update Node.js from https://nodejs.org/

### Issue: "Permission denied"
**Solution:** 
- Mac/Linux: Try `sudo` if needed
- Windows: Run terminal as administrator

### Issue: "Can't find WDS in workspace"
**Solution:** Make sure you added the folder to your IDE workspace (Step 4)

---

## Verification Checklist ✅

Before moving on, confirm:

- ☑️ WDS repository cloned
- ☑️ WDS added to IDE workspace
- ☑️ Your project has `docs/` folder structure
- ☑️ 8 phase folders created (1- through 8-)
- ☑️ Mimir responds when called

**All checked?** You're ready for Module 03! 🎉

---

## What You Just Accomplished 🎊

In just 5-10 minutes, you:

1. ✅ Installed WDS
2. ✅ Set up proper project structure
3. ✅ Connected with Mimir
4. ✅ Ready to start designing

**This is a big deal!** Many designers struggle with setup. You just cleared that hurdle with ease.

---

## Next Steps

**Ready to keep going?**

[→ Module 03: Create Project Brief](../module-03-project-brief/module-03-overview.md)

**Want to explore?**

- Try calling different agents: `@wds-mimir`, `@freyja-ux`, `@saga-analyst`, `@idunn-pm`
- Read about the 8-phase structure: [Understanding WDS Structure](lesson-02-understanding-structure.md)
- Learn the philosophy: [Module 01: Why WDS Matters](../module-01-why-wds-matters/module-01-overview.md)

---

## Pro Tips 💡

**Tip 1:** Keep WDS in your workspace permanently. Reference it across all your projects.

**Tip 2:** The `docs/` folder is your source of truth. Everything goes here.

**Tip 3:** Start every new project with the 8 phase folders. Even if you don't use all of them immediately.

**Tip 4:** Call Mimir whenever you're unsure. That's literally what he's there for.

---

**Congratulations! WDS is ready to use.** 🌊

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](module-02-overview.md)*

