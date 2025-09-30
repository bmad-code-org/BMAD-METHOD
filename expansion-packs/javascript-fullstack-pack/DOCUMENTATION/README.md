# JavaScript Full-Stack Expansion Pack

A comprehensive BMAD-METHOD expansion pack for building modern JavaScript applications with specialized agents for frontend, backend, and full-stack development.

## Overview

This expansion pack provides a complete team of AI agents specialized in JavaScript development, covering:

- **Frontend Development**: React, Vue, Svelte, Angular with modern tooling
- **Backend Development**: Node.js, Express, Fastify, NestJS
- **API Development**: REST, GraphQL, WebSocket, tRPC
- **Database Integration**: SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis)
- **Modern Tooling**: Vite, Webpack, TypeScript, ESBuild
- **Testing**: Jest, Vitest, Cypress, Playwright
- **Deployment**: Docker, Kubernetes, Serverless

## Agents Included

### Planning & Architecture
- **JS Solution Architect**: Designs full-stack JavaScript architectures
- **Frontend Architect**: Specializes in frontend architecture and state management
- **Backend Architect**: Focuses on API design, microservices, and scalability

### Development Agents
- **React Developer**: Expert in React, Next.js, and modern React patterns
- **Vue Developer**: Specializes in Vue 3, Nuxt, and composition API
- **Node Backend Developer**: Backend development with Express, Fastify, NestJS
- **API Developer**: REST, GraphQL, and modern API patterns
- **Full-Stack Developer**: End-to-end JavaScript development

### Specialized Roles
- **TypeScript Expert**: Type safety, advanced types, and migration
- **Performance Engineer**: Optimization, profiling, and monitoring
- **DevOps Engineer**: CI/CD, containerization, and deployment
- **Security Specialist**: Security best practices and vulnerability assessment
- **Testing Engineer**: Test strategy, automation, and quality assurance

## Installation

```bash
# Install BMAD-METHOD if not already installed
npx bmad-method install

# Install this expansion pack
npm install bmad-expansion-javascript-fullstack

# Or manually copy to your bmad-core/expansion-packs directory
```

## Quick Start

### Web UI Usage

1. Load the full-stack team bundle:
   ```
   *load team-javascript-fullstack
   ```

2. Start with architecture planning:
   ```
   *js-solution-architect
   I need to build a real-time collaboration platform with React frontend and Node.js backend
   ```

3. Switch to specific development agents as needed:
   ```
   *react-developer
   *node-backend-developer
   *api-developer
   ```

### IDE Usage

1. Initialize with JavaScript templates:
   ```bash
   npx bmad-method init --expansion javascript-fullstack
   ```

2. Use specialized agents through the CLI:
   ```bash
   npx bmad-method develop --agent react-developer
   ```

## Agent Capabilities

### JS Solution Architect
- Full-stack architecture design
- Technology stack selection
- Microservices vs monolith decisions
- Database schema design
- API contract definition
- Performance and scalability planning

### React Developer
- Modern React patterns (hooks, context, custom hooks)
- State management (Redux, Zustand, Jotai, Recoil)
- Next.js for SSR/SSG
- Component libraries (shadcn/ui, MUI, Chakra)
- React Query for data fetching
- Performance optimization

### Node Backend Developer
- Express, Fastify, NestJS frameworks
- Authentication & authorization (JWT, OAuth, Passport)
- Database integration (Prisma, TypeORM, Mongoose)
- Background jobs (Bull, BullMQ)
- Caching strategies (Redis)
- Error handling and logging

### API Developer
- RESTful API design
- GraphQL schema and resolvers
- tRPC for type-safe APIs
- API documentation (OpenAPI/Swagger)
- Versioning strategies
- Rate limiting and throttling

### TypeScript Expert
- TypeScript configuration optimization
- Advanced type patterns
- Generic types and utility types
- Type inference and narrowing
- Migration from JavaScript
- Type safety for APIs

## Templates Included

### PRD Templates
- `js-fullstack-prd.md`: Full-stack project requirements
- `frontend-app-prd.md`: Frontend application requirements
- `backend-api-prd.md`: Backend API requirements
- `microservices-prd.md`: Microservices architecture requirements

### Architecture Templates
- `fullstack-architecture.md`: Complete stack architecture
- `frontend-architecture.md`: Frontend-specific architecture
- `backend-architecture.md`: Backend system design
- `api-architecture.md`: API design and documentation

### Story Templates
- `frontend-feature-story.md`: Frontend feature development
- `backend-endpoint-story.md`: Backend endpoint implementation
- `api-integration-story.md`: API integration work
- `performance-optimization-story.md`: Performance improvements
- `security-enhancement-story.md`: Security implementations

### Workflow Plans
- `fullstack-mvp-workflow.md`: MVP development workflow
- `feature-development-workflow.md`: Adding new features
- `refactoring-workflow.md`: Code refactoring process
- `deployment-workflow.md`: Deployment and release process

## Use Cases

### Building a SaaS Application
```
*js-solution-architect
I want to build a project management SaaS with:
- React frontend with real-time updates
- Node.js REST API
- PostgreSQL database
- Stripe payment integration
- Multi-tenant architecture
```

### Creating a Real-Time Chat App
```
*node-backend-developer
Build a WebSocket-based chat server with:
- Socket.io for real-time communication
- Redis for pub/sub
- MongoDB for message persistence
- JWT authentication
```

### Performance Optimization
```
*performance-engineer
My React app is loading slowly. Here's my bundle analysis:
[attach webpack-bundle-analyzer output]
Help me optimize the bundle size and loading performance.
```

## Best Practices Included

Each agent follows industry best practices:
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: JSDoc, TypeDoc, API documentation
- **Security**: OWASP guidelines, dependency scanning
- **Performance**: Code splitting, lazy loading, caching
- **Accessibility**: WCAG compliance, semantic HTML

## Integration with Core BMAD

This expansion pack integrates seamlessly with core BMAD agents:
- **Analyst**: Gathers requirements for JS projects
- **PM**: Creates PRDs using JS-specific templates
- **Architect**: Works with JS Solution Architect for technical design
- **Scrum Master**: Creates stories using JS development templates
- **Dev**: Executes development with JS-specific guidance
- **QA**: Tests with JS testing frameworks

## Configuration

Add to your `bmad-core/config/core-config.yaml`:

```yaml
expansion_packs:
  - name: javascript-fullstack
    enabled: true
    agents:
      - js-solution-architect
      - react-developer
      - vue-developer
      - node-backend-developer
      - api-developer
      - typescript-expert
      - performance-engineer
      - devops-engineer
      - security-specialist
      - testing-engineer
```

## Contributing

Contributions welcome! Add new agents for:
- Svelte/SvelteKit development
- Deno/Bun runtimes
- Astro/Remix frameworks
- Mobile development (React Native)
- Desktop apps (Electron, Tauri)

## License

MIT License - Part of the BMAD-METHOD ecosystem

## Support

- GitHub Issues: Report bugs or request features
- Discord: Join the BMAD community
- Documentation: Full docs in `/docs` directory
