# Module 14: Agentic Development

## Lesson 5: Git Discipline

**Keeping your work safe, organized, and shareable**

---

## Why Git Matters

Every piece of code you create with an agent should be version controlled. Git is the safety net that lets you experiment without fear. If something breaks, you can go back. If you want to try a different approach, you can branch off. If you're ready to share, you can publish.

Without Git, one bad agent session can wipe out hours of work. With Git, you can always undo.

---

## When to Use What

Not every situation needs the full Git ceremony. It depends on where you are in the project and whether you're working alone or with a team.

### Working alone, early in the project

When you're the only designer and you're still writing specifications, exploring concepts, and building early prototypes — **working directly on main is fine.**

Specifications are documents. They change constantly in early phases. Creating branches for every spec edit adds friction without adding value. Commit your work to main, push regularly, and move fast.

```
git add .
git commit -m "Add signup form specification and prototype"
git push
```

This is simple and effective. You have a history of everything you've done, and you can undo anything.

### Working on code that matters

As soon as you're building executable code, features, or anything that could break an existing project — **use branches.**

Branches protect the stable version of your project. Your experiments happen in isolation. When they work, you merge them in. When they don't, you throw them away. No harm done.

### Working with others

When anyone else touches the same codebase — **always use branches and pull requests.**

This isn't optional. It's how teams avoid overwriting each other's work.

---

## Let the Agent Handle Git

You don't have to type Git commands yourself. The agent can create branches, make commits, and even create pull requests as part of the Design Log flow.

**Tell the agent at the start:**

> "Create a branch for this work. Commit after each completed step. When we're done, create a pull request."

The agent will:
1. Create a branch with a descriptive name
2. Commit after each step with a clear message
3. Push the branch when you say so
4. Create a PR with a summary when you're ready

**Trade-off:** You have less manual control over exactly what gets committed and when. But for most design work, this is perfectly acceptable. The convenience outweighs the loss of control.

**When to take back control:** If you're working in a shared codebase or production project, review what the agent commits before pushing. A quick `git status` and `git diff` before each push keeps you informed.

---

## The Complete Process (Step by Step)

For when you need to understand what's happening — or when you want to handle Git yourself.

### Step 1: Check where you are

```
git status
```

This shows which branch you're on and if there are any changes.

```
On branch main
nothing to commit, working tree clean
```

### Step 2: Get the latest version

```
git pull
```

This downloads any changes others have pushed. Always do this before starting new work.

### Step 3: Create a branch

```
git checkout -b feature/signup-form-prototype
```

You've created a new branch and switched to it. All your work happens here.

**Naming tips:**
- `feature/signup-form` — building something new
- `fix/mobile-navigation` — fixing a problem
- `explore/dashboard-layout` — trying an idea

### Step 4: Work and save as you go

After each completed step in your Design Log, commit:

```
git add .
git commit -m "Add signup form layout with all fields from spec"
```

**How often:** After every completed step. Step 1 done? Commit. Step 2 done? Commit. These are your save points.

**Good commit messages:**
- "Add form layout with all fields from spec"
- "Style signup form with design tokens"
- "Add blur-based validation for email and password"

**Bad commit messages:**
- "update"
- "stuff"
- "wip"

### Step 5: Push your branch

```
git push -u origin feature/signup-form-prototype
```

Your branch now exists online. Others can see it. After the first push, just type `git push`.

**When to push:**
- End of a work session (backup)
- When you want feedback
- Before creating a pull request

### Step 6: Create a pull request

When you're done and the Design Log shows all tests passing:

**Using the command line:**
```
gh pr create --title "Add signup form prototype" --body "Built from spec P02. See Design Log for details."
```

**Using GitHub:** Go to your repository, click "Pull requests", click "New pull request", select your branch.

**What goes in the PR:**
- What you built (reference the spec)
- What to look for in review
- Link to the Design Log
- Any known limitations

### Step 7: Merge and clean up

When approved, merge the PR on GitHub. Then locally:

```
git checkout main
git pull
git branch -d feature/signup-form-prototype
```

You're back on main with your changes included.

---

## Working with Your Team

### Roles in the codebase

In a WDS team, different people touch the codebase in different ways:

| Role | What they do in the repo |
|---|---|
| **Designer (you)** | Write specifications, create prototypes, build visual designs |
| **Developer** | Build production features, set up infrastructure, review code |
| **Product owner** | Review specifications and prototypes, approve PRs |

### Communicating through Git

Git isn't just version control — it's communication.

**Your commit messages** tell the team what changed:
> "Add error states to signup form per spec P02 section 4"

**Your PR descriptions** give reviewers context:
> "This implements the signup form prototype. All states from the spec are present. Validation triggers on blur. Touch targets verified at 48px."

**Your branch names** show what's being worked on:
> `feature/signup-form-prototype` tells everyone at a glance what this branch is about.

### Avoiding conflicts

Conflicts happen when two people change the same file at the same time. To minimize them:

- **Communicate** — let the team know what you're working on
- **Keep branches short-lived** — merge frequently, don't let branches sit for weeks
- **Pull before you push** — always get the latest changes before pushing yours
- **Stay in your lane** — work on the files related to your task, not random cleanups

### When conflicts happen anyway

```
git pull origin main
```

Git marks the conflicts in your files:

```
<<<<<<< HEAD
Your version
=======
Their version
>>>>>>> main
```

**What to do:**
1. Open the file
2. Decide which version to keep (or combine both)
3. Delete the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
4. Save, stage, and commit

**When to ask for help:** If the conflict is in code you don't understand, ask a developer. Show them the Design Log so they have context.

### Code reviews

When a developer reviews your PR, they might:

- **Approve** — your work is merged
- **Request changes** — they want adjustments
- **Comment** — they have questions or suggestions

Don't take change requests personally. Reviews improve code quality and catch issues you might miss. Make the changes on your branch, commit, push — the PR updates automatically.

---

## Connecting Git to the Design Log

Your Design Log meta section should include the branch:

```markdown
## Meta
- Date: 2026-02-10
- Input: P02-signup-form.md
- Agent: Freya
- Branch: feature/signup-form-prototype
- Status: In Progress
```

And your log should note commits:

```markdown
### Step 1: Form layout (completed)
- Created semantic HTML form structure
- All elements from spec present
- Commit: "Add form layout with all fields from spec"
```

This way, if you need to go back to any step, you know exactly which commit to find.

---

## When Things Go Wrong

### "I made changes on the wrong branch"

If you haven't committed yet:

```
git stash
git checkout feature/correct-branch
git stash pop
```

This moves your uncommitted changes to the right branch.

### "The agent broke something and I want to go back"

Find the last good commit:

```
git log --oneline
```

Restore a specific file to that state:

```
git checkout e4f5g6h -- src/components/SignupForm.html
```

### "I want to undo the last commit"

```
git reset --soft HEAD~1
```

Removes the last commit but keeps all the changes in your files.

---

## Quick Reference Card

| What you want to do | Command |
|---|---|
| Check which branch you're on | `git status` |
| Switch to main | `git checkout main` |
| Get latest changes | `git pull` |
| Create a new branch | `git checkout -b feature/name` |
| See what changed | `git status` |
| Stage files | `git add .` |
| Commit | `git commit -m "message"` |
| Push to remote | `git push` |
| See commit history | `git log --oneline` |
| Undo last commit (keep changes) | `git reset --soft HEAD~1` |
| Stash changes temporarily | `git stash` / `git stash pop` |
| Delete a merged branch | `git branch -d branch-name` |

---

## The Golden Rules

1. **Alone + specs = work on main.** Don't overcomplicate early phases.
2. **Code that matters = use branches.** Protect the stable version.
3. **Working with others = branches + PRs.** Always.
4. **Commit after every step.** These are your save points.
5. **Push at the end of every session.** Don't lose work.
6. **Let the agent help.** It can handle Git for you in the dialog.
7. **When in doubt, ask a developer.** They untangle Git faster than Google.

---

## What's Next

In the tutorial, you'll run through a complete agentic development session — from creating the Design Log through evaluation, feedback, and handling a stuck moment.

---

**[Continue to Tutorial: Your First Agentic Session →](tutorial-14.md)**

---

[← Back to Lesson 4](lesson-04-working-with-code.md) | [Back to Module Overview](module-14-agentic-development-overview.md)

*Part of Module 14: Agentic Development*
