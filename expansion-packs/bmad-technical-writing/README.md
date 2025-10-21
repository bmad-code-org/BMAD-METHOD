# BMad Technical Writing Expansion Pack

Transform your AI into a complete technical book writing studio with specialized agents for technical authors, trainers, and documentation specialists.

## 📚 Overview

The Technical Writing Expansion Pack extends BMad-Method with a comprehensive suite of tools for creating high-quality technical books, tutorials, and instructional content. Whether you're writing for PacktPub, O'Reilly, Manning, or self-publishing, this pack provides structured AI assistance throughout your technical writing process.

### Key Features

- 🤖 **6 Specialized Agents** - Complete writing team from planning to publication
- 📝 **10 Core Tasks** - Full chapter development workflow
- 📋 **15 Quality Checklists** - Technical accuracy, security, performance, publisher compliance, accessibility
- 🎯 **10 Professional Templates** - Book planning, chapter development, section planning, review, and publishing
- 📚 **6 Knowledge Bases** - Comprehensive publisher guidelines and technical writing standards
- 🔄 **8 Core Workflows** - Section-driven development with complete orchestration from book planning to technical review

## ✍️ Included Agents

### Planning & Design Team (Sprint 1)

1. **Instructional Designer** 🎓 - Learning objectives, pedagogical structure, and instructional scaffolding
2. **Tutorial Architect** 🏗️ - Hands-on tutorial design, exercise creation, and progressive learning paths
3. **Code Curator** 🔧 - Code example development, testing, version management, and quality assurance

### Review & Publishing Team (Sprint 2)

4. **Technical Reviewer** 🔍 - Technical accuracy verification, security audits, best practices validation
5. **Technical Editor** ✍️ - Clarity improvement, style consistency, publisher formatting, accessibility
6. **Book Publisher** 📦 - Publication preparation, manuscript packaging, publisher-specific formatting

## 🚀 Installation

### Via BMad Installer

```bash
npx bmad-method install
# Select "Technical Book Writing Studio" from the expansion packs list
```

### Manual Installation

1. Clone or download this expansion pack
2. Copy to your BMad Method installation:
   ```bash
   cp -r bmad-technical-writing/* ~/bmad-method/expansion-packs/bmad-technical-writing/
   ```
3. Run the BMad installer to register the pack

## 💡 Usage

### Quick Start

```bash
# Activate individual agents in your IDE
/bmad-tw:instructional-designer
/bmad-tw:tutorial-architect
/bmad-tw:code-curator
/bmad-tw:technical-reviewer
/bmad-tw:technical-editor
/bmad-tw:book-publisher
```

### Core Workflows (Sprint 2, 2.5, 2.6)

**Book Planning Workflow** _(Sprint 2.5)_ - Complete book planning from concept to approved outline:

1. Book Publisher drafts comprehensive book proposal
2. Instructional Designer creates detailed book outline
3. Instructional Designer validates learning progression
4. Technical Editor reviews outline for clarity
5. Book Publisher verifies publisher requirements

**Chapter Development Workflow v2.0** _(Sprint 2, refactored Sprint 2.6)_ - Complete chapter creation from outline to publisher-ready:

_Section-Driven Approach (NEW in v2.0):_

1. Tutorial Architect creates chapter outline
2. Tutorial Architect + Instructional Designer plan sections (section-planning-workflow)
3. For each section: Code Curator + Tutorial Architect + Technical Reviewer develop section (section-development-workflow)
4. Tutorial Architect + Technical Editor + Technical Reviewer assemble chapter (chapter-assembly-workflow)
5. Final validation and publication readiness

_Traditional Approach (Original, still supported):_

1. Tutorial Architect creates chapter outline
2. Code Curator develops and tests all code examples
3. Tutorial Architect writes complete chapter draft
4. Technical Reviewer performs comprehensive technical review
5. Tutorial Architect revises based on review feedback
6. Technical Editor performs professional copy editing
7. Tutorial Architect finalizes chapter for publication

**Section Planning Workflow** _(Sprint 2.6)_ - Break chapter into deliverable sections (BMad story analog):

1. Tutorial Architect analyzes chapter outline
2. Tutorial Architect identifies section boundaries (5-8 sections)
3. Tutorial Architect creates section plans with acceptance criteria
4. Instructional Designer validates learning flow
5. Tutorial Architect finalizes section list

**Section Development Workflow** _(Sprint 2.6)_ - Write one section (2-5 pages):

1. Code Curator develops section code examples
2. Code Curator tests all code
3. Tutorial Architect writes section content
4. Technical Reviewer performs focused section review
5. Tutorial Architect revises section
6. Tutorial Architect finalizes section (DONE)

**Chapter Assembly Workflow** _(Sprint 2.6)_ - Integrate completed sections (BMad Sprint Review analog):

1. Tutorial Architect merges all completed sections
2. Tutorial Architect improves transitions
3. Instructional Designer validates learning flow
4. Technical Reviewer performs full chapter review
5. Tutorial Architect revises based on feedback
6. Technical Editor performs copy editing
7. Tutorial Architect finalizes chapter for publication

**Tutorial Creation Workflow** _(Sprint 2)_ - Build effective hands-on tutorials:

1. Instructional Designer designs learning path
2. Tutorial Architect creates step-by-step structure
3. Code Curator develops and tests tutorial code
4. Tutorial Architect writes complete tutorial
5. Code Curator tests end-to-end
6. Tutorial Architect revises based on testing
7. Instructional Designer validates learning effectiveness

**Code Example Workflow** _(Sprint 2.5)_ - Develop, test, and document code examples:

1. Code Curator develops code example
2. Code Curator tests on all target platforms
3. Code Curator verifies code quality
4. Code Curator performs security review
5. Code Curator adds comprehensive documentation

**Technical Review Workflow** _(Sprint 2.5)_ - Comprehensive expert review of chapter:

1. Technical Reviewer verifies technical accuracy
2. Code Curator reviews all code examples
3. Technical Reviewer validates best practices
4. Technical Reviewer compiles comprehensive report

### Common Use Cases

- **Book Planning** - Create comprehensive book outlines with learning objectives
- **Chapter Development** - Full workflow from outline to publication-ready manuscript
- **Code Example Creation** - Develop, test, and document working code examples
- **Technical Review** - Verify accuracy, security, and best practices
- **Editorial Polish** - Ensure clarity, consistency, and publisher compliance
- **Quality Assurance** - 15 checklists covering all aspects of technical writing quality

## 📋 Key Components

### Templates (10 Total)

**Sprint 1 (Planning):**

- `book-outline-tmpl.yaml` - Complete book structure with learning path
- `chapter-outline-tmpl.yaml` - Individual chapter planning with exercises
- `code-example-tmpl.yaml` - Code examples with explanations and testing

**Sprint 2 (Writing & Publishing):**

- `chapter-draft-tmpl.yaml` - Complete chapter manuscript structure
- `technical-review-report-tmpl.yaml` - Review findings and recommendations
- `tutorial-section-tmpl.yaml` - Step-by-step tutorial structure
- `exercise-set-tmpl.yaml` - Practice exercises with solutions
- `book-proposal-tmpl.yaml` - Publisher proposal document
- `introduction-tmpl.yaml` - Chapter introduction structure

**Sprint 2.6 (Section-Driven Development):**

- `section-plan-tmpl.yaml` - Section plan with acceptance criteria (BMad story analog)

### Tasks (10 Total)

**Sprint 1 (Planning):**

- `design-book-outline.md` - Create publisher-aligned book structures
- `create-code-example.md` - Develop tested, documented code examples
- `test-code-examples.md` - Automated testing workflow for all examples
- `create-learning-objectives.md` - Define measurable learning outcomes
- `create-chapter-outline.md` - Plan chapter structure and content

**Sprint 2 (Writing & Review):**

- `write-chapter-draft.md` - Complete chapter manuscript writing workflow
- `technical-review-chapter.md` - Comprehensive chapter review workflow
- `copy-edit-chapter.md` - Editorial polish workflow
- `develop-tutorial.md` - Hands-on tutorial creation workflow
- `design-exercises.md` - Exercise creation workflow

### Checklists (15 Total)

**Sprint 1 (Quality Foundations):**

- Learning objectives validation
- Code quality verification
- Code testing requirements
- Tutorial effectiveness
- Chapter completeness
- Exercise difficulty assessment
- Prerequisite clarity
- Version compatibility

**Sprint 2 (Review & Publishing):**

- Technical accuracy checklist
- Security best practices checklist
- Performance considerations checklist
- PacktPub submission checklist
- O'Reilly format checklist
- Manning MEAP checklist
- Accessibility checklist

### Workflows (8 Core Workflows)

**Sprint 2:**

- `chapter-development-workflow.yaml` - Complete chapter creation workflow (v2.0 - refactored Sprint 2.6)
- `tutorial-creation-workflow.yaml` - Tutorial development workflow

**Sprint 2.5:**

- `book-planning-workflow.yaml` - Book planning from concept to approved outline
- `code-example-workflow.yaml` - Code example development and testing
- `technical-review-workflow.yaml` - Comprehensive technical review

**Sprint 2.6 (Section-Driven Development):**

- `section-planning-workflow.yaml` - Break chapter into sections (BMad epic → stories analog)
- `section-development-workflow.yaml` - Write one section (BMad story development analog)
- `chapter-assembly-workflow.yaml` - Merge sections into chapter (BMad sprint review analog)

### Knowledge Bases (6 Total)

- `bmad-kb.md` - Core technical writing methodology
- `book-structures.md` - PacktPub, O'Reilly, Manning formats
- `learning-frameworks.md` - Bloom's Taxonomy, scaffolding principles
- `code-style-guides.md` - Python, JavaScript, Java standards (COMPLETE)
- `publisher-guidelines.md` - Publisher-specific requirements (EXPANDED in Sprint 2)
- `technical-writing-standards.md` - Writing standards (COMPLETE in Sprint 2)

## 🎯 Use Cases

### Technical Book Writing

- Plan complete book structure with learning objectives
- Design hands-on tutorials and exercises
- Create and test code examples across versions
- Validate pedagogical effectiveness

### Course Material Development

- Structure learning paths for technical courses
- Create progressive tutorial sequences
- Develop practice exercises with solutions
- Ensure prerequisite clarity

### Documentation Writing

- Design tutorial-based documentation
- Create working code examples
- Structure content for different learning styles
- Validate instructional effectiveness

### Book Updates (Brownfield)

- Update existing books for new framework versions
- Add new chapters to existing content
- Refresh code examples for current standards
- Incorporate technical reviewer feedback

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Follow BMad Method conventions
4. Submit a PR with clear description

## 📄 License

This expansion pack follows the same license as BMad Method core.

## 🙏 Credits

Created by Wes for the BMad Method community.

Special thanks to Brian (BMad) for creating the BMad Method framework.

---

**Version:** 0.2.6 (Sprint 2.6 - Section-Driven Development)
**Compatible with:** BMad Method v4.0+
**Last Updated:** 2024

## ✅ Sprint Status

**Sprint 1 (Complete):** Planning and design foundation

- ✅ 3 planning agents (Instructional Designer, Tutorial Architect, Code Curator)
- ✅ 5 core tasks for book and chapter planning
- ✅ 8 quality checklists
- ✅ 3 templates for planning
- ✅ 6 knowledge bases (initial versions)

**Sprint 2 (Complete):** Review, workflows, and quality assurance

- ✅ 3 review agents (Technical Reviewer, Technical Editor, Book Publisher)
- ✅ 5 additional tasks for writing and review
- ✅ 7 additional checklists (technical, security, performance, publisher, accessibility)
- ✅ 6 additional templates for writing and publishing
- ✅ 2 core workflows (chapter development, tutorial creation)
- ✅ Expanded knowledge bases (publisher guidelines, writing standards)

**Sprint 2.5 (Complete):** Workflow orchestration completion

- ✅ 3 additional workflows: Book Planning Workflow, Code Example Workflow, Technical Review Workflow
- ✅ Total: 5 core workflows for complete book development
- ✅ Version bumped to 0.2.5

**Sprint 2.6 (Complete):** Section-driven development (BMad story analog)

- ✅ 3 section-level workflows: Section Planning, Section Development, Chapter Assembly
- ✅ 1 new template: Section Plan Template (section acceptance criteria)
- ✅ Refactored Chapter Development Workflow v2.0 (orchestrates section workflows)
- ✅ Total: 8 core workflows, 10 templates
- ✅ Section-driven approach enables incremental chapter writing (2-5 pages per section)
- ✅ Perfect analog to BMad's story-driven development workflow
- ✅ Parallel section development supported
- ✅ Backward compatible: Traditional full-chapter approach still supported
- ✅ Version bumped to 0.2.6

## 📚 Section-Driven Development Approach (NEW in Sprint 2.6)

The section-driven approach mirrors BMad's story-driven development workflow, enabling incremental chapter writing:

**Key Concepts:**

- **Section = Story analog**: Each section is a 2-5 page deliverable unit with clear acceptance criteria
- **Incremental progress**: Track "Chapter 3: 5 of 8 sections complete" like story completion
- **Parallel development**: Multiple sections can be developed simultaneously if dependencies allow
- **Work-in-progress reviews**: Review sections as they're completed, not waiting for full chapter
- **Story-driven iteration**: Write → Review → Polish cycle at section level

**Typical Chapter Breakdown:**

- 20-page chapter = 5-8 sections
- Small section: 2-3 pages, 1 concept, 1 code example (3 story points)
- Medium section: 3-4 pages, 1-2 concepts, 2 code examples (5 story points)
- Large section: 4-5 pages, 2-3 concepts, 2-3 code examples (8 story points)

**Workflow Mapping:**

| BMad Software Dev | Book Writing (Section-Driven)                    |
| ----------------- | ------------------------------------------------ |
| PRD Creation      | book-planning-workflow → book outline            |
| Architecture      | chapter-planning → chapter outline               |
| Epic Breakdown    | section-planning-workflow → section list         |
| Story Development | section-development-workflow → completed section |
| Sprint Review     | chapter-assembly-workflow → integrated chapter   |
| Release           | publisher-submission → published chapter         |

**When to Use Section-Driven:**

- Chapters 15+ pages (too large for single sitting)
- Want incremental progress tracking
- Need parallel development capability
- Prefer iterative story-driven approach
- Want to review work before full chapter complete

**When to Use Traditional:**

- Short chapters (<10-12 pages)
- Simple reference sections
- Author prefers writing full chapter at once
- Chapter already partially written

## 🚧 Roadmap

**Sprint 3** (Planned):

- API Documenter agent
- Screenshot Specialist agent
- Additional publisher-specific agents
- Video tutorial support
- Internationalization support
