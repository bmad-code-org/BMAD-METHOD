<!-- Powered by BMAD™ Core -->

# Gemini CLI Command Templates

## Standard Analysis Templates

### Single File Analysis

```bash
gemini "@{file_path} Analyze this file's structure, purpose, and key patterns"
gemini "@{file_path} Explain the implementation and identify potential issues"
gemini "@{file_path} Document this file's API and usage patterns"
```

### Directory Analysis

```bash
gemini "@{directory}/ Summarize the architecture and patterns in this directory"
gemini "@{directory}/ List all components and their responsibilities"
gemini "@{directory}/ Identify coding patterns and conventions used"
```

### Project Overview

```bash
gemini --all-files "Provide comprehensive overview of this project's architecture"
gemini --all-files "Analyze the technology stack and architectural decisions"
gemini --all-files "Document the project structure and key components"
```

## Feature Verification Templates

### Authentication & Security

```bash
gemini "@src/ @api/ @middleware/ Is JWT authentication fully implemented? Show all auth-related files"
gemini "@src/ @lib/ What security measures are implemented? Look for input validation, sanitization"
gemini "@api/ @middleware/ Is rate limiting implemented? Show implementation details"
gemini "@src/ @config/ Are security headers and CORS properly configured?"
```

### Testing & Quality

```bash
gemini "@src/ @tests/ Analyze test coverage. Which areas are well-tested and need improvement?"
gemini "@src/ @__tests__/ What testing patterns are used? Are tests comprehensive?"
gemini "@src/ @cypress/ @jest/ What testing frameworks are implemented?"
```

### Performance & Optimization

```bash
gemini "@src/ @lib/ What performance optimizations are in place? Identify bottlenecks"
gemini "@webpack.config.js @package.json @src/ How is the build system optimized?"
gemini "@src/ @public/ How are assets and static files handled for performance?"
```

### State Management & Data Flow

```bash
gemini "@src/store/ @src/context/ How is state management implemented?"
gemini "@src/hooks/ @src/components/ What state management patterns are used?"
gemini "@src/api/ @src/services/ How is data fetching and caching handled?"
```

## Architecture Analysis Templates

### Frontend Architecture

```bash
gemini "@src/components/ @src/pages/ Analyze the frontend component architecture"
gemini "@src/hooks/ @src/utils/ What custom hooks and utilities are implemented?"
gemini "@src/styles/ @src/assets/ How is styling and theming implemented?"
```

### Backend Architecture

```bash
gemini "@api/ @routes/ @controllers/ Analyze the backend API architecture"
gemini "@models/ @schemas/ @database/ How is data modeling implemented?"
gemini "@middleware/ @services/ @utils/ What backend services and utilities exist?"
```

### Database & Data Layer

```bash
gemini "@models/ @migrations/ @seeders/ Analyze database structure and migrations"
gemini "@queries/ @repositories/ @services/ How is data access layer implemented?"
gemini "@config/database.js @models/ What ORM patterns and relationships are used?"
```

## Code Quality Analysis Templates

### Error Handling

```bash
gemini "@src/ @api/ How is error handling implemented throughout the codebase?"
gemini "@middleware/ @utils/ What error handling patterns and utilities exist?"
gemini "@src/ @api/ Are try-catch blocks and error boundaries properly implemented?"
```

### Code Organization

```bash
gemini "@src/ How is the code organized? What are the main modules and responsibilities?"
gemini "@src/ @lib/ @utils/ What shared utilities and helper functions exist?"
gemini "@src/ What naming conventions and coding standards are followed?"
```

### Dependencies & Configuration

```bash
gemini "@package.json @yarn.lock @src/ Analyze dependencies and their usage in code"
gemini "@config/ @env/ @src/ How is configuration management implemented?"
gemini "@Dockerfile @docker-compose.yml How is containerization configured?"
```

## Debugging & Investigation Templates

### Bug Investigation

```bash
gemini "@src/components/{component}/ @src/hooks/ Debug {specific_issue} in this component"
gemini "@api/routes/{route}/ @middleware/ Investigate {issue} in this API endpoint"
gemini "@src/store/ @src/hooks/ Debug state management issues with {feature}"
```

### Performance Investigation

```bash
gemini "@src/ @webpack.config.js Identify performance bottlenecks in build process"
gemini "@src/components/ @src/hooks/ Find performance issues in React components"
gemini "@api/ @database/ Identify database query performance issues"
```

### Integration Analysis

```bash
gemini "@frontend/ @backend/ How do frontend and backend communicate?"
gemini "@src/api/ @services/ How are external services integrated?"
gemini "@src/auth/ @api/auth/ How does authentication work across the application?"
```

## Multi-Project Templates

### Monorepo Analysis

```bash
gemini "@packages/ @apps/ Analyze this monorepo structure and dependencies"
gemini "@lerna.json @package.json @packages/ How is the monorepo managed?"
gemini "@packages/ What shared components and utilities exist across packages?"
```

### Microservices Analysis

```bash
gemini "@services/ @docker-compose.yml Analyze microservices architecture"
gemini "@api-gateway/ @services/ How is service communication implemented?"
gemini "@services/ @shared/ What shared code exists between services?"
```

## Safety Command Templates

### Read-Only Analysis (Safest)

```bash
gemini --approval-mode default "@{paths} {prompt}"
```

### Auto-Edit Mode (Edit files automatically)

```bash
gemini --approval-mode auto_edit "@{paths} {prompt}"
```

### Sandbox Mode (Safe environment)

```bash
gemini --sandbox "@{paths} {prompt}"
```

## Command Construction Patterns

### Path Validation

- Always validate paths exist before construction
- Use relative paths from current working directory
- Include trailing slash for directories: `@src/`
- Specific files without slash: `@package.json`

### Prompt Construction

- Be specific about what you want analyzed
- Include context about the codebase/project type
- Specify output format if needed (list, summary, detailed)
- Ask for file paths in responses for follow-up

### Common Path Combinations

- **Full Stack**: `@src/ @api/ @database/ @config/`
- **Frontend Only**: `@src/ @public/ @package.json`
- **Backend Only**: `@api/ @services/ @models/ @config/`
- **Testing Focus**: `@src/ @tests/ @__tests__/ @cypress/`
- **Documentation**: `@docs/ @README.md @CHANGELOG.md`
