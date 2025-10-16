# TeachFlow Workflows

This directory contains workflow configurations for the TeachFlow module.

## Instructional Designer Workflows

### 1. Lesson Plan Builder (`lesson-plan-builder/`)

**Purpose**: Guide creation of comprehensive lesson plans
**Type**: Document workflow with template
**Owner**: Instructional Designer
**Status**: ⏳ Pending creation (use `create-workflow`)

---

### 2. Unit Planning (`unit-planning/`)

**Purpose**: Plan multi-week units with aligned objectives
**Type**: Document workflow with template
**Owner**: Instructional Designer
**Status**: ⏳ Pending creation (use `create-workflow`)

---

### 3. Assessment Creation (`assessment-creation/`)

**Purpose**: Design assessments with rubrics and standards alignment
**Type**: Document workflow with template
**Owner**: Instructional Designer
**Status**: ⏳ Pending creation (use `create-workflow`)

---

### 4. Differentiation Strategies (`differentiation-strategies/`)

**Purpose**: Generate differentiation plans for diverse learners
**Type**: Interactive workflow with recommendations
**Owner**: Instructional Designer
**Status**: ⏳ Pending creation (use `create-workflow`)

---

### 5. Student Goal Setting (`student-goal-setting/`)

**Purpose**: Facilitate student goal-setting sessions
**Type**: Interactive workflow with templates
**Owner**: Instructional Designer
**Status**: ⏳ Pending creation (use `create-workflow`)

---

## Behavior Specialist Workflows

### 6. Behavior Incident Report (`behavior-incident-report/`)

**Purpose**: Interview user and generate incident documentation
**Type**: Interactive workflow with email/note generation
**Owner**: Behavior Specialist
**Status**: ⏳ Pending creation (use `create-workflow`)

**Key Features**:

- Interview-based data collection
- Generates both email and detailed notes
- Parent communication templates
- Administrative documentation

---

### 7. Classroom Management Plans (`classroom-management-plans/`)

**Purpose**: Develop classroom management strategies
**Type**: Document workflow with template
**Owner**: Behavior Specialist
**Status**: ⏳ Pending creation (use `create-workflow`)

---

### 8. Parent Communication Templates (`parent-communication-templates/`)

**Purpose**: Generate parent communication for various scenarios
**Type**: Action workflow with templates
**Owner**: Behavior Specialist
**Status**: ⏳ Pending creation (use `create-workflow`)

---

## Data Analyst Workflows

### 9. Progress Report Generator (`progress-report-generator/`)

**Purpose**: Create student progress reports with data visualization
**Type**: Document workflow with data analysis
**Owner**: Data Analyst
**Status**: ⏳ Pending creation (use `create-workflow`)

**Key Features**:

- Data aggregation and analysis
- Visual charts and graphs
- Standards-based reporting
- Growth tracking

---

## Workflow Types

**Document Workflows**: Generate polished documents using templates

- Have `template.md` file
- Produce final output documents
- Examples: Lesson plans, unit plans, assessments

**Interactive Workflows**: Guide user through process with questions

- Interview-based approach
- Dynamic content generation
- Examples: Incident reports, differentiation guides

**Action Workflows**: Quick generation without extensive templates

- Fast output
- Focused on specific task
- Examples: Communication templates

## Creation Instructions

To create each workflow:

1. Run the create-workflow workflow:

   ```
   /bmad:bmb:workflows:create-workflow
   ```

2. Specify workflow details:
   - Workflow name and purpose
   - Type (document/interactive/action)
   - Owner agent
   - Required inputs
   - Expected outputs

3. The workflow generator will create:
   - `workflow.yaml` - Configuration
   - `instructions.md` - Step-by-step process
   - `template.md` - Output template (if document workflow)
   - `checklist.md` - Validation checklist (optional)

## Workflow Integration

Workflows can be called by agents or used standalone:

**By Agent**:

```
Instructional Designer → lesson-plan-builder
Behavior Specialist → behavior-incident-report
Data Analyst → progress-report-generator
```

**Standalone**:

```
/teachflow:lesson-plan-builder
/teachflow:behavior-incident-report
```

## Priority Development Order

Recommended creation sequence:

1. **High Priority** (Most frequently used):
   - Lesson Plan Builder
   - Behavior Incident Report
   - Progress Report Generator

2. **Medium Priority** (Regular use):
   - Unit Planning
   - Parent Communication Templates
   - Assessment Creation

3. **Lower Priority** (Situational use):
   - Differentiation Strategies
   - Student Goal Setting
   - Classroom Management Plans
