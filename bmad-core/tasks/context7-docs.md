<!-- Powered by BMAD™ Core -->

# Context7 Documentation Task

## Purpose

This task provides access to Context7's up-to-date documentation service for libraries, frameworks, and technologies. Context7 ensures that agents have access to current, version-specific documentation and code examples, eliminating outdated or hallucinated API information during development and architecture work.

## Key Capabilities

- **Current Documentation**: Access to up-to-date, version-specific documentation
- **Code Examples**: Real working code snippets from official sources
- **Library Support**: Coverage of popular programming libraries and frameworks
- **Version Awareness**: Automatically filters documentation by version
- **Integration Ready**: Seamless integration with AI coding workflows

## When to Use Context7 Documentation

### Ideal Use Cases

- **Implementation Guidance**: Getting current API documentation during development
- **Architecture Planning**: Understanding current capabilities of technology choices
- **Code Pattern Discovery**: Finding official examples and best practices
- **API Verification**: Confirming current API signatures and usage patterns
- **Technology Research**: Understanding latest features and capabilities
- **Best Practice Guidance**: Accessing official recommendations and patterns

### Context7 Triggers

- Need for current library/framework documentation
- Uncertainty about API changes or deprecations
- Looking for official code examples
- Verifying implementation patterns
- Researching technology capabilities
- Architecture document accuracy verification

## Documentation Request Modes

### 1. Library Documentation

**Use Case**: Getting comprehensive documentation for a specific library or framework
**Pattern**: Request specific library documentation with version if needed
**Examples**:

- "Get current React documentation for hooks patterns"
- "Fetch Express.js middleware documentation"
- "Show Next.js App Router documentation"

### 2. API Reference

**Use Case**: Getting specific API method documentation and examples
**Pattern**: Request specific API or method documentation
**Examples**:

- "Get documentation for Prisma client methods"
- "Show current FastAPI route decorators"
- "Fetch MongoDB connection patterns"

### 3. Implementation Patterns

**Use Case**: Finding official examples and implementation patterns
**Pattern**: Request implementation guidance for specific use cases
**Examples**:

- "Show authentication patterns for Django REST framework"
- "Get file upload examples for Node.js Express"
- "Find pagination patterns for GraphQL"

### 4. Technology Comparison

**Use Case**: Understanding differences between libraries or approaches
**Pattern**: Request comparative documentation
**Examples**:

- "Compare Vue 3 Composition API vs Options API"
- "Show differences between Jest and Vitest testing"
- "Compare AWS SDK v2 vs v3 patterns"

### 5. Architecture Verification

**Use Case**: Verifying architectural decisions with current documentation
**Pattern**: Request documentation to validate architectural choices
**Examples**:

- "Verify current microservices patterns for Node.js"
- "Check latest database connection pooling recommendations"
- "Get current security best practices for React applications"

### 6. Troubleshooting Support

**Use Case**: Getting documentation to resolve implementation issues
**Pattern**: Request specific troubleshooting or debugging documentation
**Examples**:

- "Get error handling patterns for async/await in Node.js"
- "Show CORS configuration examples for Express.js"
- "Find memory optimization patterns for React applications"

## Task Process

### 1. Documentation Request Processing

#### Gather Requirements

- **Technology/Library**: What specific technology needs documentation?
- **Version Specificity**: Is a particular version required?
- **Use Case Context**: What is the documentation needed for?
- **Scope of Information**: Broad overview vs specific implementation details?
- **Integration Context**: How will this documentation be applied?

#### Request Validation

- **Technology Support**: Verify Context7 supports the requested technology
- **Specificity Check**: Ensure request is specific enough for useful results
- **Context Relevance**: Confirm documentation aligns with current task needs
- **Version Compatibility**: Check if version requirements are reasonable

### 2. Context7 Integration

#### Documentation Retrieval Process

The Context7 integration works by:

1. **Agent Issues Request**: Agent determines need for current documentation
2. **Context7 Activation**: Include "use context7" in the documentation request
3. **Documentation Injection**: Context7 fetches and injects current documentation
4. **AI Processing**: AI assistant processes request with up-to-date context
5. **Response Generation**: Receive current, accurate implementation guidance

#### Integration Pattern

```markdown
For [specific technology/library] [specific use case], use context7 to get current documentation and examples.
```

#### Example Integration Requests

```markdown
# Architecture Documentation

For Next.js App Router middleware patterns, use context7 to get current documentation and examples.

# Development Implementation

For Prisma database migrations with TypeScript, use context7 to get current documentation and examples.

# Research Analysis

For React Server Components performance patterns, use context7 to get current documentation and examples.
```

### 3. Documentation Application

#### Implementation Guidance

- **Code Examples**: Apply current code patterns from official documentation
- **API Usage**: Use verified current API signatures and methods
- **Best Practices**: Follow official recommendations and patterns
- **Version Compatibility**: Ensure compatibility with current library versions
- **Security Considerations**: Apply current security recommendations

#### Architecture Integration

- **Technology Decisions**: Validate architectural choices with current capabilities
- **Integration Patterns**: Use current recommended integration approaches
- **Performance Considerations**: Apply current performance recommendations
- **Scalability Patterns**: Use current scalability best practices
- **Maintenance Considerations**: Follow current maintenance recommendations

### 4. Quality Assurance

#### Documentation Verification

- **Source Authority**: Verify information comes from official sources
- **Version Accuracy**: Confirm documentation matches intended version
- **Implementation Validity**: Test that provided examples work as expected
- **Completeness Check**: Ensure documentation covers required use cases
- **Currency Validation**: Verify documentation represents current state

#### Integration Testing

- **Pattern Validation**: Test that documented patterns work in context
- **API Verification**: Confirm API calls work as documented
- **Example Testing**: Validate that provided examples execute correctly
- **Compatibility Check**: Ensure compatibility with existing codebase
- **Performance Impact**: Assess performance implications of documented approaches

## Integration with BMAD Workflow

### Documentation Storage

- **Architecture Updates**: Update architecture documents with current patterns
- **Code Standards**: Update coding standards with current best practices
- **Technology Stack**: Validate and update technology stack documentation
- **Implementation Guides**: Create current implementation guidance
- **Best Practice Documentation**: Maintain current best practice references

### Knowledge Management

- **Team Knowledge**: Share current documentation insights with team
- **Decision Documentation**: Document technology decisions with current context
- **Pattern Libraries**: Maintain libraries of current implementation patterns
- **Reference Materials**: Create reference materials from current documentation
- **Learning Resources**: Generate learning resources from official documentation

### Development Integration

- **Story Implementation**: Use current documentation during story development
- **Code Reviews**: Reference current best practices during reviews
- **Architecture Reviews**: Validate architectural decisions with current documentation
- **Technology Evaluation**: Use current documentation for technology assessment
- **Implementation Planning**: Plan implementations using current patterns

## Agent-Specific Usage

### Development Agent (dev)

**Focus**: Implementation-specific documentation for coding tasks
**Usage Patterns**:

- Getting current API documentation during implementation
- Finding current code examples and patterns
- Verifying current library usage patterns
- Checking current security and performance recommendations

**Example Requests**:

- "For implementing JWT authentication in Express.js, use context7"
- "For setting up React Query with TypeScript, use context7"
- "For configuring Webpack 5 optimization, use context7"

### Architecture Agent (architect)

**Focus**: Architecture and technology documentation for system design
**Usage Patterns**:

- Validating technology choices with current capabilities
- Understanding current integration patterns
- Researching current scalability and performance patterns
- Verifying current security and compliance approaches

**Example Requests**:

- "For microservices communication patterns with Node.js, use context7"
- "For database design patterns with PostgreSQL and Prisma, use context7"
- "For cloud deployment patterns with AWS and Docker, use context7"

### Research Agent (researcher)

**Focus**: Code-specific domain research and technology analysis
**Usage Patterns**:

- Deep technical research on specific technologies
- Comparative analysis of technical approaches
- Understanding current industry standards and practices
- Researching emerging patterns and methodologies

**Example Requests**:

- "For comparing GraphQL vs REST API design patterns, use context7"
- "For researching current React state management solutions, use context7"
- "For analyzing current testing framework capabilities, use context7"

## Error Handling and Limitations

### Common Issues

- **Technology Not Supported**: Context7 may not have documentation for all technologies
- **Version Specificity**: May not have documentation for very specific or outdated versions
- **Request Ambiguity**: Vague requests may not return useful documentation
- **Context Integration**: Documentation may need adaptation to specific project context

### Error Recovery

- **Alternative Sources**: Suggest alternative documentation sources if Context7 unavailable
- **Manual Research**: Fall back to manual documentation research
- **Request Refinement**: Help refine requests for better Context7 results
- **Community Resources**: Supplement with community documentation when official docs insufficient

### Best Practices

- **Specific Requests**: Make documentation requests as specific as possible
- **Version Awareness**: Specify versions when compatibility is critical
- **Context Combination**: Combine Context7 documentation with project-specific knowledge
- **Validation Steps**: Always validate documentation against current project needs
- **Update Frequency**: Regularly refresh documentation understanding for evolving projects

## Configuration Integration

Context7 integration respects the following configuration patterns:

### Core Configuration

Context7 settings are managed in `bmad-core/core-config.yaml`:

```yaml
context7:
  enabled: true
  defaultMode: documentation
  preferredSources: official
  versionHandling: latest
  integrationPattern: 'use context7'
```

### Agent Configuration

Agents can customize Context7 behavior based on their specific needs:

- **Development Focus**: Emphasize implementation examples and API documentation
- **Architecture Focus**: Emphasize design patterns and integration approaches
- **Research Focus**: Emphasize comprehensive analysis and comparative documentation

### Safety and Quality

- **Source Validation**: Verify documentation comes from authoritative sources
- **Version Compatibility**: Ensure documentation matches project requirements
- **Implementation Testing**: Test documented patterns in project context
- **Currency Monitoring**: Stay aware of documentation freshness and updates
