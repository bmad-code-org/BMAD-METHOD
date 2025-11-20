# Tech-Spec Workflow Validation Checklist

**Purpose**: Validate tech-spec workflow outputs are context-rich, definitive, complete, and implementation-ready.

**Scope**: Quick-flow software projects (1-5 stories)

**Expected Outputs**: tech-spec.md + epics.md + story files (1-5 stories)

**New Standard**: Tech-spec should be comprehensive enough to replace story-context for most quick-flow projects

---

## 1. Output Files Exist

- [ ] tech-spec.md created in output folder
- [ ] epics.md created (minimal for 1 story, detailed for multiple)
- [ ] Story file(s) created in sprint_artifacts
  - Naming convention: story-{epic-slug}-N.md (where N = 1 to story_count)
  - 1 story: story-{epic-slug}-1.md
  - Multiple stories: story-{epic-slug}-1.md through story-{epic-slug}-N.md
- [ ] bmm-workflow-status.yaml updated (if not standalone mode)
- [ ] No unfilled {{template_variables}} in any files

---

## 2. Context Gathering (NEW - CRITICAL)

### Document Discovery

- [ ] **Existing documents loaded**: Product brief, research docs found and incorporated (if they exist)
- [ ] **Document-project output**: Checked for {output_folder}/index.md (brownfield codebase map)
- [ ] **Sharded documents**: If sharded versions found, ALL sections loaded and synthesized
- [ ] **Context summary**: loaded_documents_summary lists all sources used

### Project Stack Detection

- [ ] **Setup files identified**: package.json, requirements.txt, or equivalent found and parsed
- [ ] **Framework detected**: Exact framework name and version captured (e.g., "Express 4.18.2")
- [ ] **Dependencies extracted**: All production dependencies with specific versions
- [ ] **Dev tools identified**: TypeScript, Jest, ESLint, pytest, etc. with versions
- [ ] **Scripts documented**: Available npm/pip/etc scripts identified
- [ ] **Stack summary**: project_stack_summary is complete and accurate

### Brownfield Analysis (if applicable)

- [ ] **Directory structure**: Main code directories identified and documented
- [ ] **Code patterns**: Dominant patterns identified (class-based, functional, MVC, etc.)
- [ ] **Naming conventions**: Existing conventions documented (camelCase, snake_case, etc.)
- [ ] **Key modules**: Important existing modules/services identified
- [ ] **Testing patterns**: Test framework and patterns documented
- [ ] **Structure summary**: existing_structure_summary is comprehensive

---

## 3. Tech-Spec Definitiveness (CRITICAL)

### No Ambiguity Allowed

- [ ] **Zero "or" statements**: NO "use X or Y", "either A or B", "options include"
- [ ] **Specific versions**: All frameworks, libraries, tools have EXACT versions
  - ✅ GOOD: "Python 3.11", "React 18.2.0", "winston v3.8.2 (from package.json)"
  - ❌ BAD: "Python 2 or 3", "React 18+", "a logger like pino or winston"
- [ ] **Definitive decisions**: Every technical choice is final, not a proposal
- [ ] **Stack-aligned**: Decisions reference detected project stack

### Implementation Clarity

- [ ] **Source tree changes**: EXACT file paths with CREATE/MODIFY/DELETE actions
  - ✅ GOOD: "src/services/UserService.ts - MODIFY - Add validateEmail() method"
  - ❌ BAD: "Update some files in the services folder"
- [ ] **Technical approach**: Describes SPECIFIC implementation using detected stack
- [ ] **Existing patterns**: Documents brownfield patterns to follow (if applicable)
- [ ] **Integration points**: Specific modules, APIs, services identified

---

## 4. Context-Rich Content (NEW)

### Context Section

- [ ] **Available Documents**: Lists all loaded documents
- [ ] **Project Stack**: Complete framework and dependency information
- [ ] **Existing Codebase Structure**: Brownfield analysis or greenfield notation

### The Change Section

- [ ] **Problem Statement**: Clear, specific problem definition
- [ ] **Proposed Solution**: Concrete solution approach
- [ ] **Scope In/Out**: Clear boundaries defined

### Development Context Section

- [ ] **Relevant Existing Code**: References to specific files and line numbers (brownfield)
- [ ] **Framework Dependencies**: Complete list with exact versions from project
- [ ] **Internal Dependencies**: Internal modules listed
- [ ] **Configuration Changes**: Specific config file updates identified

### Developer Resources Section

- [ ] **File Paths Reference**: Complete list of all files involved
- [ ] **Key Code Locations**: Functions, classes, modules with file:line references
- [ ] **Testing Locations**: Specific test directories and patterns
- [ ] **Documentation Updates**: Docs that need updating identified

---

## 5. Story Quality

### Story Format

- [ ] All stories use "As a [role], I want [capability], so that [benefit]" format
- [ ] Each story has numbered acceptance criteria
- [ ] Tasks reference AC numbers: (AC: #1), (AC: #2)
- [ ] Dev Notes section links to tech-spec.md

### Story Context Integration (NEW)

- [ ] **Tech-Spec Reference**: Story explicitly references tech-spec.md as primary context
- [ ] **Dev Agent Record**: Includes all required sections (Context Reference, Agent Model, etc.)
- [ ] **Test Results section**: Placeholder ready for dev execution
- [ ] **Review Notes section**: Placeholder ready for code review

### Story Sequencing (If Level 1)

- [ ] **Vertical slices**: Each story delivers complete, testable functionality
- [ ] **Sequential ordering**: Stories in logical progression
- [ ] **No forward dependencies**: No story depends on later work
- [ ] Each story leaves system in working state

### Coverage

- [ ] Story acceptance criteria derived from tech-spec
- [ ] Story tasks map to tech-spec implementation guide
- [ ] Files in stories match tech-spec source tree
- [ ] Key code references align with tech-spec Developer Resources

---

## 6. Epic Quality (All Projects)

- [ ] **Epic title**: User-focused outcome (not implementation detail)
- [ ] **Epic slug**: Clean kebab-case slug (2-3 words)
- [ ] **Epic goal**: Clear purpose and value statement
- [ ] **Epic scope**: Boundaries clearly defined
- [ ] **Success criteria**: Measurable outcomes
- [ ] **Story map** (if multiple stories): Visual representation of epic → stories
- [ ] **Implementation sequence** (if multiple stories): Logical story ordering with dependencies
- [ ] **Tech-spec reference**: Links back to tech-spec.md
- [ ] **Detail level appropriate**: Minimal for 1 story, detailed for multiple

---

## 7. Workflow Status Integration

- [ ] bmm-workflow-status.yaml updated (if exists)
- [ ] Current phase reflects tech-spec completion
- [ ] Progress percentage updated appropriately
- [ ] Next workflow clearly identified

---

## 8. Implementation Readiness (NEW - ENHANCED)

### Can Developer Start Immediately?

- [ ] **All context available**: Brownfield analysis + stack details + existing patterns
- [ ] **No research needed**: Developer doesn't need to hunt for framework versions or patterns
- [ ] **Specific file paths**: Developer knows exactly which files to create/modify
- [ ] **Code references**: Can find similar code to reference (brownfield)
- [ ] **Testing clear**: Knows what to test and how
- [ ] **Deployment documented**: Knows how to deploy and rollback

### Tech-Spec Replaces Story-Context?

- [ ] **Comprehensive enough**: Contains all info typically in story-context XML
- [ ] **Brownfield analysis**: If applicable, includes codebase reconnaissance
- [ ] **Framework specifics**: Exact versions and usage patterns
- [ ] **Pattern guidance**: Shows examples of existing patterns to follow

---

## 9. Critical Failures (Auto-Fail)

- [ ] ❌ **Non-definitive technical decisions** (any "option A or B" or vague choices)
- [ ] ❌ **Missing versions** (framework/library without specific version)
- [ ] ❌ **Context not gathered** (didn't check for document-project, setup files, etc.)
- [ ] ❌ **Stack mismatch** (decisions don't align with detected project stack)
- [ ] ❌ **Stories don't match template** (missing Dev Agent Record sections)
- [ ] ❌ **Missing tech-spec sections** (required section missing from enhanced template)
- [ ] ❌ **Stories have forward dependencies** (would break sequential implementation)
- [ ] ❌ **Vague source tree** (file changes not specific with actions)
- [ ] ❌ **No brownfield analysis** (when document-project output exists but wasn't used)

---

## Validation Notes

**Document any findings:**

- **Context Gathering Score**: [Comprehensive / Partial / Insufficient]
- **Definitiveness Score**: [All definitive / Some ambiguity / Significant ambiguity]
- **Brownfield Integration**: [N/A - Greenfield / Excellent / Partial / Missing]
- **Stack Alignment**: [Perfect / Good / Partial / None]

## **Strengths:**

## **Issues to address:**

## **Recommended actions:**

**Ready for implementation?** [Yes / No - explain]

**Can skip story-context?** [Yes - tech-spec is comprehensive / No - additional context needed / N/A]

---

_The tech-spec should be a RICH CONTEXT DOCUMENT that gives developers everything they need without requiring separate context generation._
