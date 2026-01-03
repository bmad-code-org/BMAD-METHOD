# Lesson 04: WDS Project Initialization - Quick Checklist

**⏱️ 15-20 minutes**

---

## Clone WDS Repository

In terminal (in Projects folder):

```bash
cd ~/Projects  # or cd C:\Projects
git clone https://github.com/whiteport-collective/whiteport-design-studio.git
```

- [ ] ✅ WDS cloned

---

## Add WDS to Workspace

- [ ] **File** → **Add Folder to Workspace**
- [ ] Select `whiteport-design-studio` folder
- [ ] ✅ Both folders in sidebar

---

## Create Docs Structure

In terminal (in YOUR project):

```bash
cd ~/Projects/your-project-name

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

## Activate Mimir

- [ ] Find `whiteport-design-studio/src/modules/wds/MIMIR-WDS-ORCHESTRATOR.md`
- [ ] Press **Ctrl+L** or **Cmd+L** (open AI chat)
- [ ] Drag Mimir file to chat
- [ ] Type: "Hello Mimir! I just completed setup."
- [ ] ✅ Mimir responds!

---

## 🎉 Complete!

- ✅ GitHub account & repository
- ✅ IDE installed
- ✅ Project cloned
- ✅ WDS integrated
- ✅ Docs structure created
- ✅ Mimir activated

**Next:** [Module 03: Create Project Brief](../../module-03-project-brief/module-03-overview.md)

---

**Need more detail?** See [full lesson](02-full-lesson.md)

