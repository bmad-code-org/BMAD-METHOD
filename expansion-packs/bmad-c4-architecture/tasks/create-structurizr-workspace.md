# Create Structurizr Workspace

## Purpose

Create a new Structurizr workspace from scratch with proper structure and configuration.

## Prerequisites

- Workspace requirements
- Initial system information
- Target audience definition

## Process

### 1. Define Workspace Structure

- Set workspace name and description
- Define initial model structure
- Configure basic views
- Set up styling and theming

### 2. Create Initial Elements

- Define primary users
- Create main software system
- Add key external systems
- Establish basic relationships

### 3. Configure Views

- System context view
- Container views
- Component views
- Deployment views (if needed)

### 4. Apply Styling

- Set consistent colors
- Configure element shapes
- Define relationship styles
- Apply appropriate theme

### 5. Generate Initial DSL

```dsl
workspace "New Workspace" "Description" {
    model {
        user = person "User" "End user"
        softwareSystem = softwareSystem "System" "Main system" {
            // Initial containers will be added
        }
    }

    views {
        systemContext softwareSystem {
            include *
            autolayout lr
        }
        theme default
    }
}
```

## Output

- Complete Structurizr DSL workspace file
- Workspace configuration documentation
- Next steps guidance

## Elicitation Questions

1. What is the name and purpose of the workspace?
2. Who is the target audience for the diagrams?
3. What is the initial scope of the system?
4. Are there any specific styling requirements?
5. What views should be included initially?
