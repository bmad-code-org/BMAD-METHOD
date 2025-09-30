# <!-- Powered by BMAD™ Core -->

# JavaScript Architecture Patterns

## Pattern 1: Monolithic Full-Stack
**Best For:** Small to medium applications, teams < 10, MVP phase

**Stack:**
- Frontend: Next.js with App Router
- Backend: Next.js API routes or separate Express/NestJS
- Database: PostgreSQL with Prisma
- Deployment: Vercel or single container

**Pros:**
- Simple to develop and deploy
- Easy to reason about
- Fast initial development
- Shared types between frontend/backend

**Cons:**
- Harder to scale parts independently
- Can become unwieldy as it grows
- Single point of failure

**When to Use:**
- MVP or small applications
- Small team (1-10 developers)
- Tight coupling acceptable
- Simple deployment needs

## Pattern 2: JAMstack with Serverless
**Best For:** Content-heavy sites, marketing sites, blogs

**Stack:**
- Frontend: Next.js (Static Export) or Astro
- Backend: Serverless functions (Vercel, Netlify)
- Database: Supabase, Planetscale, or Firebase
- CMS: Contentful, Sanity, Strapi
- Deployment: Vercel or Netlify

**Pros:**
- Excellent performance
- Cost-effective (pay per use)
- Great developer experience
- Global CDN distribution

**Cons:**
- Cold starts for functions
- Limited execution time (30s typically)
- Harder to debug
- Vendor lock-in

## Pattern 3: Microservices
**Best For:** Large teams, complex domains, independent scaling needs

**Stack:**
- Frontend: Next.js or multiple SPAs
- API Gateway: Kong or custom Express
- Services: NestJS or Express services
- Message Queue: RabbitMQ or Kafka
- Databases: Polyglot (PostgreSQL, MongoDB, Redis)
- Container Orchestration: Kubernetes or Docker Swarm

**Pros:**
- Independent scaling
- Team autonomy
- Technology flexibility
- Fault isolation

**Cons:**
- Complex to operate
- Distributed system challenges
- Higher infrastructure costs
- Requires DevOps expertise

## Pattern 4: Backend for Frontend (BFF)
**Best For:** Multiple client types (web, mobile, desktop)

**Stack:**
- Frontends: Next.js (web), React Native (mobile)
- BFF Layer: Express or Fastify per client type
- Backend Services: Shared microservices
- Database: PostgreSQL with Prisma

**Pros:**
- Optimized for each client
- Decoupled client and server evolution
- Flexible data aggregation

**Cons:**
- Code duplication across BFFs
- More services to maintain
- Complexity in coordination

## Pattern 5: Event-Driven Architecture
**Best For:** Real-time features, complex workflows, high decoupling

**Stack:**
- Frontend: Next.js with WebSocket or Server-Sent Events
- Backend: Express/NestJS with event emitters
- Message Queue: RabbitMQ, Kafka, or AWS SQS
- Event Store: EventStoreDB or custom
- Databases: PostgreSQL + Redis

**Pros:**
- Loose coupling
- Scalable
- Async processing
- Event sourcing capabilities

**Cons:**
- Eventual consistency
- Debugging complexity
- Requires event schema management
- Learning curve

## Decision Matrix

| Pattern | Team Size | Complexity | Scale | Cost | DX |
|---------|-----------|------------|-------|------|-----|
| Monolith | 1-10 | Low | Low-Med | Low | Excellent |
| JAMstack | 1-5 | Low | Med-High | Low | Excellent |
| Microservices | 10+ | High | High | High | Good |
| BFF | 5-15 | Med | Med-High | Med | Good |
| Event-Driven | 5+ | High | High | Med-High | Fair |

## Technology Selection Guide

### Frontend Frameworks
- **Next.js**: Full-stack React, SSR/SSG, API routes
- **Vite + React**: SPA, fast dev, flexible
- **Astro**: Content-focused, islands architecture
- **Remix**: Full-stack React, nested routing

### Backend Frameworks
- **Express**: Flexible, minimalist, huge ecosystem
- **Fastify**: High performance, schema validation
- **NestJS**: Enterprise-ready, Angular-inspired, TypeScript-first
- **tRPC**: Type-safe APIs, no code generation

### Databases
- **PostgreSQL**: Relational, ACID, JSON support
- **MongoDB**: Document, flexible schema
- **Redis**: Caching, sessions, pub/sub
- **Supabase**: PostgreSQL + auth + realtime

### State Management
- **React Query**: Server state (recommended)
- **Zustand**: Lightweight global state
- **Redux Toolkit**: Complex global state
- **Context API**: Simple prop drilling solution

### Styling
- **Tailwind CSS**: Utility-first (recommended)
- **CSS Modules**: Scoped styles
- **Styled Components**: CSS-in-JS
- **Emotion**: CSS-in-JS with better perf

## Migration Paths

### From Monolith to Microservices
1. Identify bounded contexts
2. Extract one service at a time
3. Start with least-coupled features
4. Use API gateway for routing
5. Migrate data gradually

### From JavaScript to TypeScript
1. Enable TypeScript with allowJs
2. Add type definitions incrementally
3. Convert files one by one
4. Enable strict mode gradually
5. Remove allowJs when done

### From CSR to SSR/SSG
1. Adopt Next.js or similar
2. Convert pages to SSR/SSG
3. Optimize data fetching
4. Implement ISR where needed
5. Measure performance gains