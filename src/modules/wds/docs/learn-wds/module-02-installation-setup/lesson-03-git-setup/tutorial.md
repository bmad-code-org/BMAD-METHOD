# Lesson 03: Git Configuration

**Let your IDE handle Git automatically**

---

## What You'll Do

- Understand what Git does
- Recap your repository structure decision
- Let Cursor install Git automatically
- OR use GitHub Desktop (visual alternative)

**Time:** 5 minutes

---

## What is Git?

**Git** is the behind-the-scenes tool that syncs your computer with GitHub.

**Good news:** You don't need to install it manually! Modern IDEs like Cursor handle this for you.

---

## Step 1: Recap Your Repository Structure

**You already decided this in Lesson 01 when naming your repo!**

### Single Repo (named `my-project`)
```
my-project/
├── docs/              ← Your WDS specifications
└── src/               ← Code lives here too
```

### Separate Repo (named `my-project-specs`)
```
my-project-specs/      ← This repo (specifications only)
                       ← Code repo created separately
```

**For this tutorial, we assume single repo** (`dog-walker-app`)

---

## Step 2: Choose Your Git Approach

### Option 1: Let Cursor Handle It (Recommended)

**The easiest way:** Do nothing!

When you try to clone a repository in Lesson 04, Cursor will:

1. Check if Git is installed
2. If not, **automatically prompt you**: "Install Git?"
3. You click **"Install"**
4. Done!

**That's it.** No command line needed.

**✅ This is the recommended path for beginners**

---

### Option 2: GitHub Desktop (Visual Alternative)

**For designers who prefer visual tools:**

#### Why GitHub Desktop?

- ✅ No terminal commands needed
- ✅ Visual interface for everything
- ✅ See changes side-by-side
- ✅ Many professional designers use it
- ✅ Works perfectly with Cursor

#### Install GitHub Desktop

1. Download from **<https://desktop.github.com>**
2. Install it (follow standard installer)
3. Open GitHub Desktop
4. Sign in with your GitHub account
5. Done!

#### How it Works

- Use GitHub Desktop to **clone** repositories
- Use GitHub Desktop to **commit** and **push** changes
- Use Cursor to **edit** specifications
- They work together perfectly!

**This is a perfectly valid professional workflow.**

**Bonus:** GitHub Desktop also helps you decide between single vs separate repos visually!

---

### Option 3: Already Comfortable with Terminal?

**Optional check for those who want to know:**

In Cursor terminal (press **Ctrl+`** or **Cmd+`**):

```bash
git --version
```

**If you see a version number:**
```
git version 2.x.x
```
✅ Git is installed!

**If you see "command not found":**
No problem! Continue to Lesson 04, Cursor will prompt you.

---

## Which Option Should You Choose?

**Choose Option 1 (Let Cursor Handle It) if:**
- You're a complete beginner
- You want the simplest path
- You're comfortable with terminal appearing in Lesson 04

**Choose Option 2 (GitHub Desktop) if:**
- You prefer visual interfaces
- You want to see changes graphically
- You're nervous about terminal commands
- You want a tool you'll keep using

**Both are great!** Many professionals use GitHub Desktop daily.

---

## Troubleshooting

**Issue:** Not sure which option to choose  
**Solution:** Use Option 1 (Let Cursor handle it) - simplest for beginners

**Issue:** GitHub Desktop won't sign in  
**Solution:** Make sure you completed Lesson 01 (GitHub account created)

**Issue:** Worried about making mistakes  
**Solution:** Git saves everything - you can always undo!

---

## What's Next?

Git will be ready when you need it! Now it's time to clone your repository and add WDS to your workspace.

**[Continue to Lesson 04: Repository Cloning & WDS Integration →](../lesson-04-clone-and-wds/tutorial.md)**

---

*Part of Module 02: Installation & Setup*  
*[← Back to Module Overview](../module-02-overview.md)*
