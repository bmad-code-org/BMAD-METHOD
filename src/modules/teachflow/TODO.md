# TeachFlow Development Roadmap

Generated: 2025-10-14
Updated: 2025-10-15 (Synced with module brief)
Status: Module brief complete, ready for Phase 0 (NGSS MCP Server)

---

## Overview

**Total Agents**: 11 (5 core + 6 supporting)
**Total Workflows**: 9 (3 core + 5 feature + 1 utility)
**Estimated Total Time**: 54-70 hours over 13-16 weeks
**Module Viability**: 9/10 | Confidence: 85%

**Key Innovation**: 3-Dimensional Learning (NGSS SEP, DCI, CCC) integrated at architecture level via Standards Aligner and NGSS MCP server.

---

## Phase 0: NGSS MCP Server (Foundation - Separate Project)

**Location**: `/dev/personal/ngss-mcp-server/` (greenfield project)
**Timeline**: Week 0 (before TeachFlow Phase 1)
**Effort**: 12-18 hours
**Priority**: 🔴 CRITICAL - All subsequent phases depend on this

### 0.1 NGSS MCP Server Development

**Status**: In progress (separate project)

**Deliverables**:

1. MCP server scaffold (Python or TypeScript)
2. NGSS Middle School standards data structured and loaded
3. 5 tools implemented:
   - `get_standard(code)` - Returns single standard with SEP, DCI, CCC
   - `search_by_domain(domain, grade_level)` - Filtered search
   - `find_by_driving_question(question)` - Fuzzy match to lesson
   - `get_3d_components(code)` - Just SEP/DCI/CCC breakdown
   - `search_standards(query, filters)` - Flexible keyword search
4. Fuzzy matching for driving questions
5. Testing and validation
6. Claude Code MCP configuration

**Data Structure**: Dual-index JSON

- By standard code (MS-LS1-6) → lesson + 3D components
- By driving question ("How do plants get energy?") → lesson + 3D components

**Rationale**: Token efficiency (95% reduction vs JSON file approach), professional architecture, reusable across projects.

---

## Phase 1: Critical Infrastructure (Week 1-2, 4-6 hours) 🔴

**MUST complete before anything else**

### 1.1 Standards Aligner Agent

**Priority**: 🔴 CRITICAL
**Estimated Time**: 4-6 hours
**Command**: `/bmad:bmb:workflows:create-agent`

**Role**: 3D Learning Intelligence Hub & Critical Infrastructure Agent

**Scope**:

- Delegates to NGSS MCP server for all standards lookups
- Driving question lookup (for Alpha)
- Standard code lookup (for Instructional Designer)
- 3D component provision (SEP, DCI, CCC)
- Alignment validation

**Supports**: Instructional Designer, Alpha (both depend on this agent)

**Key Considerations**:

- Simple agent design (delegates to MCP server)
- Handles NGSS MCP server responses
- Formats 3D components for user display
- Error handling for missing/ambiguous standards

**Rationale**: Both Instructional Designer and Alpha depend on Standards Aligner for 3D components. Must be built first and proven reliable.

---

## Phase 2: Core Teaching Tools (Week 3-5, 15-20 hours) 🔴

Build the four main teaching agents, three core workflows, and QA agent.

### 2.1 Instructional Designer Agent

**Priority**: 🔴 Critical
**Estimated Time**: 45-60 minutes
**Command**: `/bmad:bmb:workflows:create-agent`

**Scope**:

- 3D-informed lesson planning
- Assessment creation
- Differentiation strategies
- Student goal setting
- **Delegates to**: Standards Aligner (CRITICAL FIRST), Resource Curator, Accommodation Specialist, Artifact Generator, Goal Tracker, QA/Validation

**Key Considerations**:

- First delegation always to Standards Aligner for 3D scope
- Professional, pedagogically sound, supportive personality
- Command structure for common tasks

---

### 2.2 Lesson Plan Builder Workflow

**Priority**: 🔴 Critical
**Estimated Time**: 60-90 minutes
**Command**: `/bmad:bmb:workflows:create-workflow`
**Owner**: Instructional Designer

**Type**: Document workflow with 3D integration

**Scope**:

- Interactive planning (gather lesson context)
- **Delegate to Standards Aligner** → retrieve standard + 3D components (SEP, DCI, CCC)
- **3D-informed activity sequencing** (activities must engage SEP, develop DCI, highlight CCC)
- **3D-aligned assessment creation** (assess SEP performance, DCI understanding, CCC application)
- Differentiation strategies

**Output**: Complete lesson plan with 3D-aligned activities and assessments

**3D Integration**: Ensures every lesson engages all three dimensions, not just content coverage.

---

### 2.3 Behavior Specialist Agent

**Priority**: 🔴 Critical
**Estimated Time**: 45-60 minutes
**Command**: `/bmad:bmb:workflows:create-agent`

**Scope**:

- Behavior incident documentation
- Parent communication drafting
- Classroom management planning
- Intervention strategies
- **Delegates to**: Artifact Generator, QA/Validation

**Key Considerations**:

- Professional yet empathetic tone
- Factual, objective language
- Templates for communication scenarios

---

### 2.4 Behavior Incident Report Workflow

**Priority**: 🔴 Critical
**Estimated Time**: 60-90 minutes
**Command**: `/bmad:bmb:workflows:create-workflow`
**Owner**: Behavior Specialist

**Type**: Interactive workflow with dual output

**Scope**:

- Interview-based data collection
- Incident details capture
- Generate parent email
- Generate detailed incident notes
- Suggest follow-up actions

**Output**: Email draft + detailed incident report

---

### 2.5 Data Analyst Agent

**Priority**: 🟡 Important
**Estimated Time**: 45-60 minutes
**Command**: `/bmad:bmb:workflows:create-agent`

**Scope**:

- Grade analysis and trends
- Student performance tracking
- Data visualization guidance
- Progress monitoring
- **Delegates to**: Artifact Generator, Goal Tracker, QA/Validation

---

### 2.6 Progress Report Generator Workflow

**Priority**: 🟡 Important
**Estimated Time**: 60-90 minutes
**Command**: `/bmad:bmb:workflows:create-workflow`
**Owner**: Data Analyst

**Type**: Document workflow with data analysis

**Scope**:

- Data aggregation
- Trend analysis
- Visualization recommendations
- Standards-based reporting
- Growth tracking

**Output**: Student progress report with charts

---

### 2.7 Professional Writer Agent

**Priority**: 🟡 Important
**Estimated Time**: 30-45 minutes
**Command**: `/bmad:bmb:workflows:create-agent`

**Scope**:

- Administrative paperwork
- Professional correspondence
- Meeting documentation
- Policy interpretation
- **Delegates to**: QA/Validation

**Key Considerations**:

- Formal, professional tone
- Versatile across document types
- Clear, concise communication

---

### 2.8 QA/Validation Agent

**Priority**: 🔴 Critical
**Estimated Time**: 45-60 minutes
**Command**: `/bmad:bmb:workflows:create-agent`

**Role**: Quality gatekeeper for all agents

**Scope**:

- **3D Lesson Validation**: Verify lessons include all three dimensions (SEP, DCI, CCC)
- **Academic Integrity Check**: Validate Alpha doesn't provide direct homework answers
- **Standards Alignment Verification**: Confirm outputs match claimed standards
- **Safety Validation**: Age-appropriate content, no PII, inclusive language

**Validation Modes**:

- Automated (rule-based checks)
- Checklist (guided human review)
- Spot check (random sampling)

**Supports**: ALL core agents (validates all outputs before delivery)

**Rationale**: Establishes quality gates early, critical for Alpha safety later.

---

## Phase 3: Supporting Cast (Week 6-8, 10-14 hours) 🟡

Create specialized supporting agents.

### 3.1 Resource Curator Agent

**Priority**: 🟢 Enhancement
**Estimated Time**: 30-45 minutes
**Supports**: Instructional Designer, Alpha

**Scope**:

- Find teaching resources
- Curate lesson materials
- Locate multimedia content
- Organize resource libraries

---

### 3.2 Accommodation Specialist Agent

**Priority**: 🟢 Enhancement
**Estimated Time**: 45-60 minutes
**Supports**: Instructional Designer

**Scope**:

- Accommodation recommendations
- Differentiation strategies
- IEP support
- Inclusive practices
- Accessibility guidance

---

### 3.3 Artifact Generator Agent

**Priority**: 🟡 Important
**Estimated Time**: 45-60 minutes
**Supports**: All core agents

**Scope**:

- Data visualization
- Report formatting (renamed from Report Generator)
- Dashboard creation
- Presentation materials
- Graphic organizers
- Study guides

---

### 3.4 Goal Tracker Agent

**Priority**: 🟢 Enhancement
**Estimated Time**: 30-45 minutes
**Supports**: Instructional Designer, Data Analyst, Alpha

**Scope**:

- Track learning objectives
- Monitor IEP goals
- Progress check-ins
- Milestone tracking
- Achievement documentation

---

## Phase 4: Student Support System (Week 9-12, 16-20 hours) 🟡

Build Alpha agent and Student Support Session workflow - most complex component.

### 4.1 Alpha - Student Support Agent

**Priority**: 🔴 Critical (but deferred to Phase 4)
**Estimated Time**: 8-12 hours (complex)
**Command**: `/bmad:bmb:workflows:create-agent`

**Role**: Direct student learning support with adaptive personality and 3D-scoped instruction

**Complexity**: Most complex agent - triple personality system, 3D scoping, safety requirements

**Scope**:

- **Triple Personality System** (student selects preference):
  - Socratic Guide (question-based discovery)
  - Study Buddy (collaborative peer-helper)
  - Expert Tutor (structured professional instruction)
- **Driving question-based lesson identification**
- **3D-scoped teaching** (exactly lesson scope, no over/under-teaching)
- Homework help through guided learning (never direct answers)
- Concept explanations with worked examples
- **Delegates to**: Standards Aligner (CRITICAL), Resource Curator, Artifact Generator, Goal Tracker, QA/Validation

**Target Audience**: Middle school students (ages 11-14)

**Key Considerations**:

- Academic integrity protection (no homework answers)
- Age-appropriate content (PG-13)
- Growth mindset language
- Emotional intelligence in responses
- Safety features (no PII, inclusive language)

**Rationale**: Deferred to Phase 4 to ensure Standards Aligner and QA patterns are proven before building most complex agent.

---

### 4.2 Student Support Session Workflow

**Priority**: 🔴 Critical
**Estimated Time**: 4-8 hours
**Command**: `/bmad:bmb:workflows:create-workflow`
**Owner**: Alpha

**Type**: Interactive workflow with 3D-scoped teaching

**Scope** (7-step workflow):

1. Driving question identification
2. **Delegate to Standards Aligner** → retrieve 3D scope (SEP, DCI, CCC)
3. Personality selection (Socratic/Study Buddy/Expert Tutor)
4. **3D-scoped teaching interaction**:
   - Focus on lesson's DCI (concept scope)
   - Practice lesson's SEP (skill development)
   - Apply lesson's CCC (thinking pattern)
   - Use worked examples of SIMILAR problems (not homework answers)
5. Understanding check
6. Resource provision (practice materials)
7. Progress tracking

**Output**: Student understanding + practice materials + progress tracking

**3D Integration**: Ensures student help precisely matches teacher's lesson - prevents scope mismatch confusion.

---

### 4.3 Safety & Testing Validation

**Priority**: 🔴 Critical
**Estimated Time**: 2-4 hours

**Testing Focus**:

- Academic integrity (Alpha never gives homework answers)
- 3D scope accuracy (Alpha stays within lesson scope)
- Age-appropriateness (PG-13 content validation)
- Emotional safety (growth mindset, positive reinforcement)
- QA/Validation integration testing

---

## Phase 5: Enhancement & Polish (Week 13-16, 8-12 hours) 🟢

Complete remaining workflows and polish.

### 5.1 Assessment Creation Workflow

**Priority**: 🟡 Important
**Owner**: Instructional Designer
**Type**: Document workflow

**Scope**: Tests, quizzes, rubrics, 3D standards alignment

---

### 5.2 Differentiation Strategies Workflow

**Priority**: 🟢 Enhancement
**Owner**: Instructional Designer
**Type**: Interactive workflow

**Scope**: Generate differentiation plans for diverse learners

---

### 5.3 Student Goal Setting Workflow

**Priority**: 🟢 Enhancement
**Owner**: Instructional Designer
**Type**: Interactive workflow

**Scope**: Facilitate student goal-setting sessions

---

### 5.4 Classroom Management Plans Workflow

**Priority**: 🟢 Enhancement
**Owner**: Behavior Specialist
**Type**: Document workflow

**Scope**: Develop classroom management strategies

---

### 5.5 Parent Communication Templates Workflow

**Priority**: 🟡 Important
**Owner**: Behavior Specialist
**Type**: Action workflow

**Scope**: Generate parent communications for various scenarios

---

### 5.6 Template Library

- Create shared templates for common documents
- Build template inheritance structure
- Standardize formatting

---

### 5.7 Delegation Testing

- Test agent delegation patterns
- Verify cross-agent communication
- Optimize workflow handoffs

---

### 5.8 Documentation Refinement

- Complete agent documentation
- Add workflow examples
- Create usage guides

---

## Quick Commands Reference

### Create New Agent

```bash
/bmad:bmb:workflows:create-agent
```

### Create New Workflow

```bash
/bmad:bmb:workflows:create-workflow
```

### Run Workflow

```bash
/teachflow:workflow-name
```

---

## Recommended Creation Order

**Phase 0 (Pre-work): NGSS MCP Server** (Separate project)

- Build and test NGSS MCP server with 5 tools
- Load middle school standards data
- Implement fuzzy matching for driving questions

**Week 1-2: Critical Infrastructure**

1. Standards Aligner agent

**Week 3-5: Core Teaching Tools** 2. Instructional Designer agent 3. Lesson Plan Builder workflow (3D-informed) 4. Behavior Specialist agent 5. Behavior Incident Report workflow 6. Data Analyst agent 7. Progress Report Generator workflow 8. Professional Writer agent 9. QA/Validation Agent

**Week 6-8: Supporting Cast** 10. Resource Curator agent 11. Accommodation Specialist agent 12. Artifact Generator agent 13. Goal Tracker agent

**Week 9-12: Student Support System** 14. Alpha agent (complex: triple personality + 3D scoping + safety) 15. Student Support Session workflow 16. Safety & testing validation

**Week 13-16: Enhancement & Polish** 17. Assessment Creation workflow 18. Differentiation Strategies workflow 19. Student Goal Setting workflow 20. Classroom Management Plans workflow 21. Parent Communication Templates workflow 22. Template library expansion 23. Documentation & examples

---

## Testing Checklist

After creating each component:

- [ ] Agent loads without errors
- [ ] Agent commands work as expected
- [ ] Workflow executes successfully
- [ ] Output matches expectations
- [ ] Delegation works correctly (if applicable)
- [ ] 3D components present (if applicable)
- [ ] QA/Validation passes (for core agents)
- [ ] Documentation is complete
- [ ] Examples are clear and helpful

---

## Progress Tracking

**Phase 0**: ⏳ In progress (separate project - NGSS MCP Server)
**Phase 1**: ⏳ 0/1 agents created (Standards Aligner)
**Phase 2**: ⏳ 0/4 agents + 0/3 workflows + 0/1 QA agent
**Phase 3**: ⏳ 0/4 supporting agents
**Phase 4**: ⏳ 0/1 agent (Alpha) + 0/1 workflow
**Phase 5**: ⏳ 0/5 workflows + polish tasks

**Overall Completion**: 0% (0/11 agents, 0/9 workflows)

---

## Key Design Decisions

### 3D Learning as Core Architecture

- Not an add-on - integrated at foundation level
- Standards Aligner = architectural keystone
- All lesson planning flows through 3D framework
- Differentiates from generic lesson planners

### NGSS MCP Server

- 95% token reduction vs JSON file approach
- Professional microservice architecture
- Reusable across education projects
- Separate project for clean separation

### Driving Question Entry Point

- Students remember driving questions better than generic topics
- Maps precisely to standards and 3D scope
- Enables accurate lesson identification for Alpha
- User insight from teaching experience

### Alpha as Full Core Agent

- Complexity warrants agent-level design (not just workflow)
- Triple personality + 3D scoping + safety = dedicated architecture
- Deferred to Phase 4 after patterns proven

### QA/Validation Agent Early

- Establishes quality gates in Phase 2
- Critical for Alpha safety later
- Automated validation catches issues early

### Local-Only Data Storage

- Privacy-first, teacher control
- No PII concerns, works offline
- Simpler architecture, faster development

---

## Notes

### User Context

- **User**: Frank (middle school science teacher, grades 6-8)
- **Class Format**: 50-minute periods
- **Standards**: NGSS (Next Generation Science Standards)
- **Students**: IEP students requiring differentiation
- **District**: Preselects curriculum units (no unit planning needed)

### 3D Learning Framework

- **SEP** (Science & Engineering Practices): What students DO (8 practices)
- **DCI** (Disciplinary Core Ideas): What students LEARN (core concepts)
- **CCC** (Crosscutting Concepts): HOW students THINK (7 thinking patterns)

### Future Enhancements

- Integration with external data sources (grade books, LMS)
- Automated report scheduling
- Data visualization dashboard
- Mobile-friendly interfaces
- Multi-language support
- District policy customization
- Expand to other grade levels (elementary, high school)
- Other subjects beyond science

### Known Limitations

- Agents must be created manually using workflows
- No automated testing framework yet
- Templates need manual updates
- Limited data persistence between sessions
- MVP focus: Middle school NGSS science only

---

## Getting Help

**Stuck on agent creation?**

- Review existing agents in `bmad/bmm/agents/` or `bmad/bmb/agents/`
- Check agent creation workflow documentation
- Reference module brief: `/docs/module-brief-teachflow-2025-10-14.md`
- Start simple, add complexity later

**Workflow not working?**

- Verify workflow.yaml configuration
- Check instructions.md for errors
- Test with minimal inputs first
- Review workflow execution logs

**Need inspiration?**

- Study BMM module structure
- Review CIS module patterns
- Look at existing BMAD workflows
- Reference module brief agent specifications

**NGSS MCP Server questions?**

- Check separate project documentation
- Verify MCP server is running and configured
- Test tools individually before integration

---

Last Updated: 2025-10-15
Synced with: `/docs/module-brief-teachflow-2025-10-14.md`
