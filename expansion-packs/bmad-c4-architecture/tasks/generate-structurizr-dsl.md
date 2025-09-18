# Generate Structurizr DSL

## Purpose

Generate a complete Structurizr DSL workspace from existing C4 model information.

## Prerequisites

- C4 model elements defined
- Relationships mapped
- View requirements specified

## Process

### 1. Gather Model Information

- All persons, systems, containers, and components
- All relationships and their properties
- View requirements and styling preferences
- Workspace metadata

### 2. Structure the DSL

- Create workspace header with name and description
- Define model section with all elements
- Define views section with all diagrams
- Apply styling and theming

### 3. Generate Complete DSL

```dsl
workspace "Workspace Name" "Description" {
    model {
        // All model elements
        user = person "User" "End user"
        softwareSystem = softwareSystem "System" "Main system" {
            // Containers and components
        }
    }

    views {
        // All views
        systemContext softwareSystem {
            include *
            autolayout lr
        }
        container softwareSystem {
            include *
            autolayout lr
        }
        component container {
            include *
            autolayout lr
        }
        theme default
    }
}
```

### 4. Validation

- [ ] DSL syntax is correct
- [ ] All elements are properly defined
- [ ] All relationships are valid
- [ ] Views are properly configured
- [ ] Styling is consistent

## Output

- Complete Structurizr DSL file
- Validation report
- Usage instructions

## Elicitation Questions

1. What should be the workspace name and description?
2. Are there any specific styling requirements?
3. What views need to be included?
4. Are there any custom properties or tags needed?
5. What deployment information should be included?
