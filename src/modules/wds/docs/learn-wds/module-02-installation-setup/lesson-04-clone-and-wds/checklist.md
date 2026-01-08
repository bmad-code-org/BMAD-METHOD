# Lesson 04: Repository Cloning & WDS Integration - Quick Checklist

**⏱️ 15-20 minutes**

---

## Create Projects Folder

In Cursor terminal (**Ctrl+`** or **Cmd+`**):

```bash
# Windows
mkdir C:\Projects
cd C:\Projects

# Mac/Linux
mkdir ~/Projects
cd ~/Projects
```

- [ ] ✅ Projects folder created

---

## Clone Your Project

- [ ] Go to your repo on GitHub → Click **"Code"** → Copy URL
- [ ] In terminal: `git clone [paste-url-here]`
- [ ] (If prompted: Install Git → Click "Install")
- [ ] ✅ "done" message

---

## Open Project in Cursor

- [ ] **File** → **Open Folder**
- [ ] Select your project folder
- [ ] ✅ Project in sidebar

---

## Clone WDS

In terminal:
```bash
cd ~/Projects  # or cd C:\Projects
git clone https://github.com/whiteport-collective/whiteport-design-studio.git
```

- [ ] ✅ WDS cloned

---

## Add WDS to Workspace

- [ ] **File** → **Add Folder to Workspace**
- [ ] Select `whiteport-design-studio` folder
- [ ] Click **"Add"**
- [ ] ✅ Both folders in sidebar

---

## Create Docs Structure

In terminal (in YOUR project folder):

```bash
cd ~/Projects/your-project-name  # YOUR project!

# Mac/Linux
mkdir -p docs/{1-project-brief,2-trigger-mapping,3-prd-platform,4-ux-design,5-design-system,6-design-deliveries,7-testing,8-ongoing-development}

# Windows (if above doesn't work)
mkdir docs
cd docs
mkdir 1-project-brief 2-trigger-mapping 3-prd-platform 4-ux-design 5-design-system 6-design-deliveries 7-testing 8-ongoing-development
cd ..
```

- [ ] ✅ 8 folders in `docs/`

---

## Next Step

✅ Everything cloned and ready!

**[→ Lesson 05: Mimir Activation](../lesson-05-initiate-mimir/checklist.md)**

---

**Need more detail?** See [full lesson explanation](lesson.md)

