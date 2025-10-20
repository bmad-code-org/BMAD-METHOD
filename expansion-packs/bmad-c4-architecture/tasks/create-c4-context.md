# Create C4 Context Diagram

## Purpose

Create a C4 Context diagram (Level 1) that shows how the system fits into the world around it.

## Prerequisites

- System name and description
- Key users/actors
- External systems and dependencies

## Process

### 1. Gather Information

- System name and purpose
- Primary users and their goals
- External systems the software system interacts with
- Business context and constraints

### 2. Define Elements

- **Person**: End users, administrators, external users
- **Software System**: The system being designed
- **External Systems**: Third-party services, legacy systems, external APIs

### 3. Define Relationships

- User interactions with the system
- System interactions with external systems
- Data flow directions

### 4. Create DSL Structure

```dsl
workspace "System Name" "System description" {
    model {
        // Define persons
        user = person "User Name" "User description"

        // Define the software system
        softwareSystem = softwareSystem "System Name" "System description" {
            // Internal containers will be defined in container diagram
        }

        // Define external systems
        externalSystem = softwareSystem "External System" "External system description" "External"

        // Define relationships
        user -> softwareSystem "Uses" "HTTPS"
        softwareSystem -> externalSystem "Sends data" "HTTPS/API"
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

### 5. Validation

- [ ] All key users are represented
- [ ] All external systems are identified
- [ ] Relationships are clearly defined
- [ ] Diagram follows C4 model principles
- [ ] Technology choices are appropriate

## Output

- Structurizr DSL file for context diagram
- Visual diagram (if Structurizr Lite is available)
- Documentation of design decisions

## Elicitation Questions

1. What is the name and purpose of the system?
2. Who are the primary users of this system?
3. What external systems does this system need to interact with?
4. What are the main user goals when using this system?
5. What business context or constraints should be considered?
