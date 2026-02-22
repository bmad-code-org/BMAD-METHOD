# Interactive Prototypes - Getting Started Guide

**Version**: 1.0  
**Last Updated**: December 10, 2025  
**For**: WDS Agents (Freya, Saga, Idunn)

---

## 🎯 Overview

This system creates **production-ready, self-contained interactive prototypes** using:

✅ **Tailwind CSS** - No separate CSS files  
✅ **Vanilla JavaScript** - Components in shared folders  
✅ **Section-by-section** - Approval gates prevent errors  
✅ **Just-in-time stories** - Created as needed, not all upfront  
✅ **Demo data auto-loading** - Works immediately  
✅ **Self-contained** - Zip & share, works anywhere

---

## 📁 Folder Structure (Per Scenario)

```
[Scenario]/Prototype/
│
├── [Page-1].html                    ← HTML in ROOT (double-click to open)
├── [Page-2].html                    ← HTML in ROOT
├── [Page-3].html                    ← HTML in ROOT
│
├── shared/                          ← Shared code (ONE COPY)
│   ├── prototype-api.js
│   ├── init.js
│   └── utils.js
│
├── components/                      ← Reusable components (ONE COPY)
│   ├── image-crop.js
│   ├── toast.js
│   ├── modal.js
│   └── form-validation.js
│
├── pages/                           ← Page-specific scripts (only if >150 lines)
│   ├── [complex-page].js
│   └── [another-complex-page].js
│
├── data/                            ← Demo data (auto-loads)
│   ├── demo-data.json
│   └── [additional-data].json
│
├── assets/                          ← Images, icons (optional)
│   ├── images/
│   └── icons/
│
├── stories/                         ← Section dev files (created just-in-time)
│   ├── [Page].1-[section].md
│   ├── [Page].2-[section].md
│   └── ...
│
├── work/                            ← Planning files (created at start)
│   ├── [Page]-Work.yaml
│   └── ...
│
└── PROTOTYPE-ROADMAP.md             ← ONE document with everything
```

---

## 🔄 Complete Workflow

### Phase 1: INITIATION & PLANNING

1. **User requests** prototype for [Page]
2. **Agent asks** about device compatibility
3. **Agent creates** `work/[Page]-Work.yaml` (complete plan)
4. **User reviews** and approves plan
5. **Ready to implement** section-by-section

### Phase 2: SECTION-BY-SECTION IMPLEMENTATION

**For each section (1-N)**:

1. **Agent announces** section
2. **Agent creates** story file (just-in-time)
3. **Agent implements** in HTML (root location from start)
4. **Agent presents** for testing
5. **User tests** and gives feedback
6. **Agent fixes** any issues (loop until approved)
7. **User approves** → Move to next section

### Phase 3: FINALIZATION

1. **All sections complete**
2. **Final integration test**
3. **User approves**
4. **Prototype complete** (already in final location)

---

## 📄 Templates Available

### In `templates/` folder:

1. **`work-file-template.yaml`**
   - Complete planning document
   - Created ONCE at start
   - High-level section breakdown

2. **`story-file-template.md`**
   - Detailed section implementation guide
   - Created JUST-IN-TIME before each section
   - Documents what was actually built

3. **`page-template.html`**
   - Complete HTML page with Tailwind
   - Inline JavaScript examples
   - All common patterns included

4. **`PROTOTYPE-ROADMAP-template.md`**
   - Scenario overview document
   - One per scenario Prototype folder

5. **`demo-data-template.json`**
   - Demo data structure
   - Auto-loads on first page open

---

## 🎨 Key Principles

### 1. Tailwind First
- Use Tailwind CDN
- Inline config for project colors
- Custom CSS only for what Tailwind can't do
- No separate CSS files

### 2. Pages in Root
- All HTML files in Prototype root
- Easy to find and open
- Simple relative paths
- No nested page folders

### 3. ONE COPY of Shared Code
- `shared/` contains ONE copy of each utility
- `components/` contains ONE copy of each component
- Update once → affects all pages
- Zero duplication

### 4. Self-Contained
- Zip entire Prototype folder
- Works on any computer
- No server needed
- No setup needed

### 5. Section-by-Section
- Break page into 4-8 sections
- Build one section at a time
- Test after each section
- Approval gate before next section
- Prevents errors from compounding

### 6. Just-in-Time Stories
- Create story file RIGHT BEFORE implementing each section
- Not all at once upfront
- Allows flexibility to adjust based on feedback
- Documents exactly what was built (including changes)

### 7. Build in Final Location
- No temp folder
- Create file in root from start
- Add sections incrementally
- Use "🚧" placeholders for upcoming sections
- File grows organically

---

## 🛠️ Tools & Technologies

**Required**:
- Tailwind CSS (via CDN)
- Vanilla JavaScript (no frameworks)
- SessionStorage (for demo data)

**Optional**:
- Google Fonts (Inter recommended)
- Custom fonts in `assets/fonts/`

**Not Needed**:
- Node.js / npm
- Build process
- CSS preprocessors
- Bundlers

---

## 📚 For Agents

### Freya (UX/UI Designer)
**Primary role**: Create interactive prototypes

**Read**:
1. `FREYA-WORKFLOW-INSTRUCTIONS.md` (complete step-by-step)
2. `templates/` (use these for all work)
3. Dog Week examples (reference implementations)

**Create**:
1. Work files (planning)
2. Story files (just-in-time)
3. HTML pages (section-by-section)
4. Demo data (if new data entities)

---

### Saga (Analyst)
**Role in prototypes**: Provide specifications, validate requirements

**Read**:
1. Work files (understand planned sections)
2. Story files (review implementation details)
3. Completed prototypes (validate against requirements)

**Create**:
1. Page specifications (source for work files)
2. User flow documentation
3. Success criteria definitions

---

### Idunn (PM)
**Role in prototypes**: Project tracking, stakeholder communication

**Read**:
1. `PROTOTYPE-ROADMAP.md` (status tracking)
2. Work files (understand scope)
3. Completed prototypes (demo to stakeholders)

**Create**:
1. Project timelines
2. Stakeholder reports
3. Testing plans

---

## 🎓 Learning Path

### Week 1: Understand the System
- Read this guide
- Read `FREYA-WORKFLOW-INSTRUCTIONS.md`
- Open Dog Week prototypes
- Test in browser
- Check console logs

### Week 2: Study Examples
- Read 1.2-Sign-In.html (simple)
- Read 1.6-Add-Dog.html (medium)
- Read 3.1-Calendar.html (complex)
- Compare to their work files
- Review story files

### Week 3: Modify Example
- Copy existing prototype
- Change fields, text, colors
- Test modifications
- Understand file relationships

### Week 4: Create New Prototype
- Start with simple page
- Follow workflow exactly
- Build section-by-section
- Get feedback, iterate

---

## ✅ Quality Standards

Every prototype must have:

**Functionality**:
- [ ] All interactions work
- [ ] Form validation correct
- [ ] Loading states display
- [ ] Success/error feedback shows
- [ ] Navigation works
- [ ] Data persists

**Code Quality**:
- [ ] All Object IDs present
- [ ] Tailwind classes used properly
- [ ] Console logs helpful
- [ ] No console errors
- [ ] Inline JS < 150 lines (or external file)
- [ ] Functions documented

**Mobile**:
- [ ] Tested at target width
- [ ] Touch targets min 44px
- [ ] No horizontal scroll
- [ ] Text readable

**Documentation**:
- [ ] Work file complete
- [ ] Story files for all sections
- [ ] Changes documented
- [ ] Status updated

---

## 🚀 Benefits

| Aspect | Benefit |
|--------|---------|
| **For Designers** | No coding complexity, visual results fast |
| **For Users** | Real interactions, usable for testing |
| **For Developers** | Clear implementation reference |
| **For Stakeholders** | Works immediately, no setup |
| **For Project** | Self-contained, easy to share |

---

## 📊 Success Metrics

**Speed**: 30-45 min per page (section-by-section)  
**Quality**: Production-ready code  
**Error Rate**: Low (approval gates prevent issues)  
**Flexibility**: High (adjust as you go)  
**Reusability**: High (shared components)  
**Maintainability**: High (ONE copy of shared code)

---

## 🆘 Need Help?

**Question**: "How do I start?"  
**Answer**: Read `FREYA-WORKFLOW-INSTRUCTIONS.md` and follow step-by-step

**Question**: "Which template do I use?"  
**Answer**: 
- Planning → `work-file-template.yaml`
- Implementing → `story-file-template.md` (just-in-time)
- Coding → `page-template.html`

**Question**: "How do I create demo data?"  
**Answer**: Copy `demo-data-template.json`, fill in values, save to `data/` folder

**Question**: "What if section needs changes?"  
**Answer**: Make changes directly in HTML, document in story file, re-test, get approval

**Question**: "How do I share prototype?"  
**Answer**: Zip entire Prototype folder, send to stakeholder

---

## 📝 Quick Reference

**Start new prototype**: Create work file → Get approval → Build section 1  
**Add section**: Create story → Implement → Test → Get approval → Next section  
**Fix issue**: Update HTML → Re-test → Get approval  
**Complete prototype**: Final integration test → Update status → Done  
**Share prototype**: Zip Prototype folder → Send  

---

## 🎯 Remember

1. **Tailwind first** - Use classes, not custom CSS
2. **Pages in root** - Easy to find and open
3. **ONE COPY** - No duplication of shared code
4. **Section-by-section** - Approval gates prevent errors
5. **Just-in-time stories** - Create when needed, not all upfront
6. **Build in final location** - No temp folder needed
7. **Test after each section** - Don't wait until the end
8. **Object IDs always** - Every interactive element
9. **Demo data ready** - Auto-loads on first use
10. **Self-contained** - Zip & works anywhere

---

**You are ready to create production-ready interactive prototypes!** 🚀

For detailed step-by-step instructions, see: `FREYA-WORKFLOW-INSTRUCTIONS.md`

