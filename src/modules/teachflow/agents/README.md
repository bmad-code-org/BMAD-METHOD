# TeachFlow Agents

This directory contains agent configurations for the TeachFlow module.

## Core Agents

### 1. Instructional Designer

**Purpose**: Master agent for teaching and learning activities
**Responsibilities**:

- Lesson planning and curriculum design
- Assessment creation and rubric development
- Unit and course planning
- Differentiation strategy guidance
- Student goal setting facilitation

**Can delegate to**: Resource Curator, Accommodation Specialist, Report Generator, Goal Tracker

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

### 2. Behavior Specialist

**Purpose**: Behavior management and parent communication
**Responsibilities**:

- Behavior incident documentation
- Parent communication drafting
- Classroom management plan development
- Intervention strategy guidance
- Behavioral pattern analysis

**Can delegate to**: Report Generator

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

### 3. Professional Writer

**Purpose**: Administrative paperwork and professional documentation
**Responsibilities**:

- Professional correspondence
- Administrative forms and reports
- Meeting documentation
- Policy interpretation
- General writing support

**Can delegate to**: None (specialized writing agent)

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

### 4. Data Analyst

**Purpose**: Student progress tracking and data analysis
**Responsibilities**:

- Grade analysis and trends
- Student performance tracking
- Data visualization
- Progress monitoring
- Outcome analysis

**Can delegate to**: Report Generator, Goal Tracker

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

## Supporting Agents

### 5. Resource Curator

**Purpose**: Find and organize teaching materials
**Responsibilities**:

- Locate relevant teaching resources
- Curate lesson materials
- Find multimedia content
- Organize resource libraries

**Supports**: Instructional Designer

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

### 6. Accommodation Specialist

**Purpose**: Special needs and differentiation support
**Responsibilities**:

- Accommodation recommendations
- Differentiation strategies
- IEP support
- Inclusive teaching practices
- Accessibility guidance

**Supports**: Instructional Designer

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

### 7. Report Generator

**Purpose**: Create visual reports and dashboards
**Responsibilities**:

- Data visualization
- Report formatting
- Dashboard creation
- Presentation materials
- Summary generation

**Supports**: All core agents

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

### 8. Goal Tracker

**Purpose**: Monitor objectives and progress
**Responsibilities**:

- Track learning objectives
- Monitor IEP goals
- Progress check-ins
- Milestone tracking
- Achievement documentation

**Supports**: Instructional Designer, Data Analyst

**Status**: ⏳ Pending creation (use `create-agent` workflow)

---

## Creation Instructions

To create each agent:

1. Run the create-agent workflow:

   ```
   /bmad:bmb:workflows:create-agent
   ```

2. Follow the prompts to define:
   - Agent personality and tone
   - Specific capabilities
   - Commands and workflows
   - Integration with other agents

3. Save the agent configuration to this directory

## Agent Interaction Patterns

**Delegation Flow**:

```
Instructional Designer → Resource Curator (find materials)
Instructional Designer → Accommodation Specialist (differentiation)
Instructional Designer → Report Generator (visualize data)
Instructional Designer → Goal Tracker (monitor objectives)

Behavior Specialist → Report Generator (incident reports)

Data Analyst → Report Generator (data visualization)
Data Analyst → Goal Tracker (progress monitoring)
```
