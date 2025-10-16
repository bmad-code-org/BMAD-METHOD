# TeachFlow Templates

This directory contains shared templates used across TeachFlow workflows and agents.

## Purpose

Templates provide consistent, professional formatting for all generated documents:

- Lesson plans
- Assessment rubrics
- Behavior incident reports
- Progress reports
- Parent communications
- Student support materials

## Structure

Templates will be organized by category:

- `lessons/` - Lesson plan and unit planning templates
- `assessments/` - Test, quiz, and rubric templates
- `behavior/` - Incident reports and management plans
- `communications/` - Parent and professional correspondence
- `reports/` - Progress reports and data visualizations
- `student-support/` - Alpha agent study materials and guides

## Template Format

Most templates use Markdown with variable placeholders:

```markdown
# {{lesson_title}}

**Grade Level:** {{grade_level}}
**Duration:** {{duration}} minutes
**Standard:** {{standard_code}} - {{standard_text}}

## Learning Objectives

{{objectives}}
```

## Usage

Templates are referenced in workflow.yaml files:

```yaml
template: '{project-root}/bmad/teachflow/templates/lessons/lesson-plan.md'
```

## Development Status

**Phase 5** - Templates will be created during Enhancement & Polish phase.
Currently empty - templates will be added as workflows are created.
