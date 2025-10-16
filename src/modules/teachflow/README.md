# TeachFlow

Comprehensive teaching workflow system for managing classroom instruction, behavior management, professional responsibilities, and data analysis.

## Overview

TeachFlow provides a complete suite of specialized AI agents and workflows designed specifically for teachers. It streamlines all aspects of teaching work - from lesson planning to behavior documentation to data analysis - allowing educators to focus more on students and less on paperwork.

This module provides:

- **8 Specialized Agents** (4 core + 4 supporting) covering all teaching responsibilities
- **9 Workflow Automations** for common teaching tasks
- **Intelligent Delegation** allowing agents to collaborate on complex tasks
- **Template Library** for consistent, professional outputs

## Installation

```bash
bmad install teachflow
```

## Components

### Core Agents (4)

#### 1. **Instructional Designer**

Expert in teaching and learning activities

- Lesson planning and curriculum design
- Assessment creation and rubrics
- Unit and course planning
- Differentiation strategies
- Student goal setting

**Can delegate to**: Resource Curator, Accommodation Specialist, Report Generator, Goal Tracker

#### 2. **Behavior Specialist**

Manages behavior and parent communication

- Behavior incident documentation
- Parent communication drafting
- Classroom management plans
- Intervention strategies
- Behavioral pattern analysis

**Can delegate to**: Report Generator

#### 3. **Professional Writer**

Handles administrative paperwork

- Professional correspondence
- Administrative forms and reports
- Meeting documentation
- Policy interpretation
- General writing support

#### 4. **Data Analyst**

Tracks student progress and analyzes data

- Grade analysis and trends
- Student performance tracking
- Data visualization
- Progress monitoring
- Outcome analysis

**Can delegate to**: Report Generator, Goal Tracker

### Supporting Agents (4)

#### 5. **Resource Curator**

Finds and organizes teaching materials
**Supports**: Instructional Designer

#### 6. **Accommodation Specialist**

Special needs and differentiation support
**Supports**: Instructional Designer

#### 7. **Report Generator**

Creates visual reports and dashboards
**Supports**: All core agents

#### 8. **Goal Tracker**

Monitors objectives and progress
**Supports**: Instructional Designer, Data Analyst

---

### Workflows (9)

#### Instructional Designer Workflows

1. **Lesson Plan Builder** - Comprehensive lesson planning
2. **Unit Planning** - Multi-week unit design
3. **Assessment Creation** - Tests, quizzes, and rubrics
4. **Differentiation Strategies** - Adapt for diverse learners
5. **Student Goal Setting** - Facilitate goal-setting sessions

#### Behavior Specialist Workflows

6. **Behavior Incident Report** - Document incidents and generate communications
7. **Classroom Management Plans** - Develop management strategies
8. **Parent Communication Templates** - Generate parent communications

#### Data Analyst Workflows

9. **Progress Report Generator** - Create data-driven progress reports

---

## Quick Start

### 1. Create Your First Agent

Start with one of the core agents:

```bash
/bmad:bmb:workflows:create-agent
```

**Recommended starting agents**:

- **Instructional Designer** - Most versatile, handles lesson planning
- **Behavior Specialist** - High-impact for behavior documentation

### 2. Create Your First Workflow

Build the workflows you'll use most:

```bash
/bmad:bmb:workflows:create-workflow
```

**Recommended starting workflows**:

- **Lesson Plan Builder** - Daily lesson planning
- **Behavior Incident Report** - Incident documentation
- **Progress Report Generator** - Student progress tracking

### 3. Use the Workflows

Once created, invoke workflows directly:

```bash
/teachflow:lesson-plan-builder
/teachflow:behavior-incident-report
```

---

## Module Structure

```
teachflow/
├── agents/                  # Agent configurations
│   ├── instructional-designer/
│   ├── behavior-specialist/
│   ├── professional-writer/
│   ├── data-analyst/
│   ├── resource-curator/
│   ├── accommodation-specialist/
│   ├── report-generator/
│   └── goal-tracker/
├── workflows/              # Workflow automations
│   ├── lesson-plan-builder/
│   ├── behavior-incident-report/
│   ├── progress-report-generator/
│   ├── unit-planning/
│   ├── assessment-creation/
│   ├── differentiation-strategies/
│   ├── student-goal-setting/
│   ├── classroom-management-plans/
│   └── parent-communication-templates/
├── templates/             # Shared templates
├── data/                 # Module data files
├── config.yaml          # Module configuration
├── TODO.md             # Development roadmap
└── README.md          # This file
```

---

## Configuration

The module can be configured in `bmad/teachflow/config.yaml`

Key settings:

- **output_folder**: Where generated documents are saved
- **data_folder**: Where module data is stored
- **delegation_enabled**: Allow agents to delegate to supporting agents
- **delegation_rules**: Define which agents can delegate to whom

---

## Examples

### Example 1: Creating a Lesson Plan

1. Load the Instructional Designer agent
2. Run the Lesson Plan Builder workflow
3. Answer questions about your lesson objectives, activities, and assessments
4. Receive a comprehensive, standards-aligned lesson plan

The agent can automatically delegate to:

- **Resource Curator** to find relevant teaching materials
- **Accommodation Specialist** for differentiation suggestions
- **Report Generator** to create visual planning aids

### Example 2: Documenting a Behavior Incident

1. Load the Behavior Specialist agent
2. Run the Behavior Incident Report workflow
3. Answer interview questions about the incident
4. Receive:
   - Professional email to parents
   - Detailed incident notes for records
   - Follow-up action items

### Example 3: Analyzing Student Progress

1. Load the Data Analyst agent
2. Run the Progress Report Generator workflow
3. Provide student data (grades, assessments, observations)
4. Receive:
   - Visual charts and graphs
   - Trend analysis
   - Standards-based progress report
   - Recommendations for intervention

---

## Development Roadmap

See `TODO.md` for the complete development roadmap.

### Phase 1: Core Agents (Priority)

- [ ] Create Instructional Designer agent
- [ ] Create Behavior Specialist agent
- [ ] Create Professional Writer agent
- [ ] Create Data Analyst agent

### Phase 2: Priority Workflows

- [ ] Build Lesson Plan Builder workflow
- [ ] Build Behavior Incident Report workflow
- [ ] Build Progress Report Generator workflow

### Phase 3: Supporting Agents

- [ ] Create Resource Curator agent
- [ ] Create Accommodation Specialist agent
- [ ] Create Report Generator agent
- [ ] Create Goal Tracker agent

### Phase 4: Additional Workflows

- [ ] Build remaining 6 workflows
- [ ] Create template library
- [ ] Test delegation patterns

---

## Agent Delegation Patterns

TeachFlow agents can intelligently delegate to supporting agents:

```
Instructional Designer
  ├→ Resource Curator (find materials)
  ├→ Accommodation Specialist (differentiation)
  ├→ Report Generator (visualizations)
  └→ Goal Tracker (monitor objectives)

Behavior Specialist
  └→ Report Generator (incident reports)

Data Analyst
  ├→ Report Generator (data visualization)
  └→ Goal Tracker (progress monitoring)

Professional Writer
  └─ (No delegation - specialized writing)
```

---

## Contributing

To extend this module:

1. **Add new agents**: Use `create-agent` workflow
2. **Add new workflows**: Use `create-workflow` workflow
3. **Add templates**: Place in `templates/` directory
4. **Test integrations**: Verify agent delegation works correctly
5. **Update documentation**: Keep README.md current

---

## Support

For issues or questions:

- Check `TODO.md` for known development status
- Review agent/workflow README files for details
- Consult BMAD Method documentation

---

## Author

Created by Frank on 2025-10-14

---

## License

Part of the BMAD Method framework
