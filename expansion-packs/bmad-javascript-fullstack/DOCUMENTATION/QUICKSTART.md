# Quick Start Guide: JavaScript Full-Stack Expansion Pack

Get up and running with the JavaScript Full-Stack expansion pack in minutes!

## Installation

### Option 1: NPM Package (Recommended)
```bash
# Install BMAD-METHOD if you haven't already
npx bmad-method install

# Install the JavaScript expansion pack
npm install bmad-expansion-javascript-fullstack

# Run the installer
npx bmad-method install
```

### Option 2: Manual Installation
```bash
# Clone or download this expansion pack
git clone https://github.com/yourusername/bmad-expansion-javascript-fullstack

# Copy to your BMAD installation
cp -r bmad-javascript-fullstack/* /path/to/your/project/bmad-core/expansion-packs/javascript-fullstack/
```

## Your First Project

### Step 1: Start with the Solution Architect

Open your AI assistant (ChatGPT, Claude, Gemini) with BMAD loaded and start with:

```
*js-solution-architect

I want to build a task management SaaS application with the following requirements:
- Real-time collaboration
- User authentication
- Project and task management
- Team permissions
- Mobile responsive
- Expected users: 10,000 in first year

Can you help me design the architecture?
```

The Solution Architect will provide:
- Recommended technology stack
- Architecture diagram
- Database schema design
- API contract
- Deployment strategy
- Development phases

### Step 2: Create Your PRD

Once you have the architecture, work with the PM agent:

```
*pm

Based on the architecture we just created, help me create a comprehensive PRD for this task management application.

Use the JavaScript Full-Stack PRD template.
```

The PM will guide you through creating a detailed PRD covering:
- Features and priorities
- User stories
- Technical requirements
- Success metrics
- Timeline

### Step 3: Shard Your Documents

Move to your IDE and shard your PRD and Architecture documents:

```bash
# In your IDE terminal
npx bmad-method shard
```

This breaks your documents into manageable pieces for development.

### Step 4: Generate Development Stories

Back in the web UI with Scrum Master:

```
*scrum-master

Based on the PRD and Architecture, create development stories for the MVP phase.

Use the JavaScript Development Story template.
```

The Scrum Master will create detailed stories for:
- Authentication system
- Database setup
- API endpoints
- Frontend components
- Integration points

### Step 5: Start Development

Now work with the specialized development agents:

#### Frontend Development
```
*react-developer

I need to implement the user authentication UI based on story JS-001.

Requirements:
- Login form with email and password
- Registration form
- Password reset flow
- JWT token handling
- Protected routes

Can you help me implement this?
```

#### Backend Development
```
*node-backend-developer

I need to implement the authentication API based on story JS-002.

Requirements:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- JWT token generation
- Password hashing with bcrypt

Can you help me implement this?
```

#### API Design
```
*api-developer

I need to design the REST API for task management based on story JS-003.

Resources:
- Projects
- Tasks
- Comments
- Assignments

Can you help me design the endpoints with proper REST conventions?
```

## Common Workflows

### Creating a New Feature

1. **Architecture Review**
   ```
   *js-solution-architect
   I want to add real-time notifications to my app. 
   How should I implement this? WebSocket or Server-Sent Events?
   ```

2. **Create Story**
   ```
   *scrum-master
   Create a development story for real-time notifications feature.
   ```

3. **Implement Backend**
   ```
   *node-backend-developer
   Implement WebSocket server with Socket.io for real-time notifications.
   ```

4. **Implement Frontend**
   ```
   *react-developer
   Implement notification component that connects to WebSocket and displays real-time updates.
   ```

### Optimizing Performance

```
*js-solution-architect

My React app is loading slowly. Here's my Lighthouse report:
[paste report]

What optimizations should I prioritize?
```

Then implement with:
```
*react-developer
Implement code splitting and lazy loading for the dashboard routes.
```

### Adding a New API Endpoint

```
*api-developer

I need to add a search endpoint for tasks with filters:
- Text search (title and description)
- Status filter
- Priority filter
- Date range filter
- Pagination

Design the API endpoint following REST best practices.
```

Then implement:
```
*node-backend-developer
Implement the task search endpoint with Prisma.
```

### Refactoring Components

```
*react-developer

I have a 500-line TaskCard component that's hard to maintain. 
Can you help me refactor it into smaller, reusable components?

Here's the current code:
[paste code]
```

## Agent Specializations

### JS Solution Architect
- **Use for:** Architecture decisions, technology selection, system design
- **When to use:** Starting new projects, major feature additions, performance issues
- **Output:** Architecture documents, technology recommendations, trade-off analysis

### React Developer  
- **Use for:** Frontend implementation, component design, state management
- **When to use:** Building UI, optimizing frontend, React-specific questions
- **Output:** React components, hooks, tests, styling

### Node Backend Developer
- **Use for:** Backend implementation, API endpoints, database operations
- **When to use:** Building APIs, database work, authentication, background jobs
- **Output:** Express/Fastify/NestJS code, tests, documentation

### API Developer
- **Use for:** API design, documentation, versioning, best practices
- **When to use:** Designing new APIs, refactoring endpoints, API standards
- **Output:** API contracts, OpenAPI specs, endpoint implementations

## Tips for Success

### 1. Start with Architecture
Always begin with the Solution Architect before coding. A solid architecture saves time later.

### 2. Use the Right Agent for the Job
- Planning/Design → Solution Architect
- Frontend work → React Developer  
- Backend work → Node Backend Developer
- API-specific → API Developer

### 3. Leverage Templates
Use the provided PRD and Story templates. They ensure you don't miss important details.

### 4. Iterate with Context
Keep your conversation focused. If switching topics, start a new chat and reference previous decisions.

### 5. Test as You Go
Ask agents to include tests with implementation. Don't save testing for the end.

### 6. Document Decisions
Use the agents to help document architectural decisions and trade-offs.

## Example Project: Building a Blog Platform

### Phase 1: Architecture (Day 1)
```
*js-solution-architect

I want to build a blog platform with:
- User authentication
- Rich text editor
- Comments
- Tags and categories
- SEO optimization
- Fast page loads

Team: Solo developer
Timeline: 6 weeks MVP
Expected traffic: 10k monthly visitors

Design the architecture.
```

### Phase 2: PRD (Day 1-2)
Work with PM to create comprehensive PRD using template.

### Phase 3: Development (Week 2-5)

**Week 2: Authentication**
```
*node-backend-developer
Implement JWT authentication with refresh tokens and Prisma.
```
```
*react-developer  
Create login and registration components with React Hook Form.
```

**Week 3: Blog Posts**
```
*api-developer
Design REST API for blog posts (CRUD, publishing, drafts).
```
```
*react-developer
Implement rich text editor with TipTap and post management UI.
```

**Week 4: Comments & Engagement**
```
*node-backend-developer
Implement comments API with moderation and nested replies.
```
```
*react-developer
Build comment section with real-time updates using React Query.
```

**Week 5: Polish & Deploy**
```
*js-solution-architect
Review the application for performance and security. What should I optimize before launch?
```

### Phase 4: Launch (Week 6)
Final testing, deployment, and monitoring setup.

## Troubleshooting

### Agent Not Responding as Expected
- Make sure you're using the correct agent command (e.g., `*react-developer`)
- Provide more context about your project
- Reference previous conversations if building on earlier work

### Getting Generic Responses
- Be specific about your technology stack
- Provide code samples or examples
- Mention you're using the BMAD JavaScript expansion pack

### Need More Detailed Code
- Ask for complete implementation with tests
- Request inline comments and documentation
- Specify any patterns or conventions you're using

## Next Steps

1. **Explore the Agents**: Try each agent with sample questions
2. **Use the Templates**: Create your first PRD and Story
3. **Build Something**: Start a small project to learn the workflow
4. **Join the Community**: Share your experience and learn from others

## Resources

- **Main README**: Full documentation of the expansion pack
- **Agent Files**: Detailed documentation of each agent's capabilities
- **Templates**: PRD and Story templates for your projects
- **BMAD Community**: Discord, GitHub discussions

## Need Help?

- Check the main README for detailed information
- Review the agent files for specific capabilities
- Join the BMAD Discord community
- Open an issue on GitHub

---

**Happy coding! Let's build amazing JavaScript applications together! 🚀**
