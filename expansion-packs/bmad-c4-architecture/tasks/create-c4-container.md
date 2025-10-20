# Create C4 Container Diagram

## Purpose

Create a C4 Container diagram (Level 2) that zooms into the system boundary, showing high-level technical building blocks.

## Prerequisites

- Completed context diagram
- Technology stack decisions
- High-level architecture patterns

## Process

### 1. Identify Containers

- Web applications
- Mobile applications
- Desktop applications
- APIs and microservices
- Databases
- File systems
- External service interfaces

### 2. Define Container Properties

- Technology stack
- Responsibilities
- Data storage requirements
- Communication protocols

### 3. Define Relationships

- Container-to-container communication
- Data flow patterns
- Security boundaries
- Deployment considerations

### 4. Create DSL Structure

```dsl
softwareSystem = softwareSystem "System Name" "System description" {
    webApp = container "Web Application" "Handles user interactions" "React, Node.js" {
        user -> this "Uses" "HTTPS"
    }

    api = container "API" "Provides business logic" "Java, Spring Boot" {
        webApp -> this "Makes API calls" "HTTPS/REST"
    }

    database = container "Database" "Stores data" "PostgreSQL" {
        api -> this "Reads from and writes to" "JDBC"
    }

    externalApi = softwareSystem "External API" "External service" "External"
    api -> externalApi "Sends requests" "HTTPS/REST"
}
```

### 5. Validation

- [ ] All major components are represented
- [ ] Technology choices are justified
- [ ] Data flow is clear
- [ ] Security boundaries are defined
- [ ] Scalability considerations are addressed

## Output

- Updated Structurizr DSL with container definitions
- Container diagram visualization
- Technology decision documentation

## Elicitation Questions

1. What are the main functional areas of the system?
2. What technology stack will be used for each container?
3. How do the containers communicate with each other?
4. What are the data storage requirements?
5. What security boundaries need to be considered?
