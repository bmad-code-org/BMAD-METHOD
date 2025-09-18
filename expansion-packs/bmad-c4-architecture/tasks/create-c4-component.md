# Create C4 Component Diagram

## Purpose

Create a C4 Component diagram (Level 3) that zooms into a container to show the components within it.

## Prerequisites

- Completed container diagram
- Detailed component requirements
- Interface specifications

## Process

### 1. Identify Components

- Controllers and handlers
- Services and business logic
- Data access layers
- External interfaces
- Utilities and shared libraries

### 2. Define Component Properties

- Technology stack
- Responsibilities
- Interfaces and APIs
- Dependencies

### 3. Define Relationships

- Component-to-component communication
- Data flow patterns
- Interface contracts
- Error handling

### 4. Create DSL Structure

```dsl
container = container "Container Name" "Container description" "Technology" {
    controller = component "Controller" "Handles HTTP requests" "Spring MVC" {
        user -> this "Uses" "HTTPS"
    }

    service = component "Service" "Business logic" "Java" {
        controller -> this "Calls" "Java"
    }

    repository = component "Repository" "Data access" "JPA" {
        service -> this "Uses" "Java"
    }

    database = softwareSystem "Database" "Data storage" "External"
    repository -> database "Reads from and writes to" "JDBC"
}
```

### 5. Validation

- [ ] All major components are represented
- [ ] Interfaces are clearly defined
- [ ] Data flow is logical
- [ ] Dependencies are minimal
- [ ] Error handling is considered

## Output

- Updated Structurizr DSL with component definitions
- Component diagram visualization
- Interface documentation

## Elicitation Questions

1. What are the main components within this container?
2. How do the components interact with each other?
3. What are the key interfaces and APIs?
4. What are the data flow patterns?
5. What error handling mechanisms are needed?
