# <!-- Powered by BMAD™ Core -->

# Technology Stack Selection Guide

## Decision Framework

### Consider These Factors
1. **Team expertise** - What does your team know?
2. **Project requirements** - What are you building?
3. **Scale requirements** - Expected traffic and data volume?
4. **Timeline** - How fast do you need to ship?
5. **Budget** - Infrastructure and development costs?
6. **Maintenance** - Long-term support needs?

## Recommended Stacks by Use Case

### 1. MVP / Startup (Speed Priority)
**Stack:** T3 Stack or Next.js + Supabase
- Frontend: Next.js 14
- Backend: Next.js API routes or tRPC
- Database: Supabase (PostgreSQL + Auth + Realtime)
- Deployment: Vercel
- Why: Fastest time to market, minimal config, great DX

### 2. SaaS Application (Scale Priority)
**Stack:** Next.js + NestJS + PostgreSQL
- Frontend: Next.js 14 with App Router
- Backend: NestJS (modular, testable)
- Database: PostgreSQL with Prisma
- Cache: Redis
- Queue: Bull/BullMQ
- Deployment: Frontend (Vercel), Backend (Railway/Render)
- Why: Enterprise-ready, scales well, great TypeScript support

### 3. E-commerce (Performance Priority)
**Stack:** Next.js + Shopify/Stripe + PostgreSQL
- Frontend: Next.js with ISR
- Payment: Stripe or Shopify
- Database: PostgreSQL with Prisma
- Cache: Redis
- CDN: CloudFlare or Vercel Edge
- Why: Fast page loads, built-in payments, SEO-friendly

### 4. Real-time App (Chat, Collaboration)
**Stack:** Next.js + Express + Socket.io + Redis
- Frontend: Next.js
- Backend: Express with Socket.io
- Database: PostgreSQL + MongoDB (messages)
- Cache/Pub-Sub: Redis
- Why: Excellent WebSocket support, real-time updates

### 5. API-First / Mobile Backend
**Stack:** Fastify + PostgreSQL + Redis
- Backend: Fastify (high performance)
- Database: PostgreSQL with Prisma
- Cache: Redis
- API: REST or GraphQL
- Deployment: Railway, Fly.io, or AWS
- Why: Fast, lightweight, API-focused

### 6. Enterprise Application
**Stack:** NestJS + PostgreSQL + Microservices
- Backend: NestJS (modular architecture)
- Database: PostgreSQL
- Message Queue: RabbitMQ or Kafka
- Monitoring: Datadog or New Relic
- Container: Docker + Kubernetes
- Why: Enterprise patterns, testable, maintainable

## Technology Comparison

### Frontend Frameworks
| Framework | Best For | Learning Curve | Performance | Ecosystem |
|-----------|----------|----------------|-------------|-----------|
| Next.js | Full-stack apps | Medium | Excellent | Huge |
| Vite + React | SPAs | Low | Excellent | Huge |
| Remix | Full-stack, data-heavy | Medium | Excellent | Growing |
| Astro | Content sites | Low | Excellent | Growing |

### Backend Frameworks
| Framework | Best For | Learning Curve | Performance | DX |
|-----------|----------|----------------|-------------|-----|
| Express | Flexibility | Low | Good | Good |
| Fastify | Performance | Low | Excellent | Good |
| NestJS | Enterprise | Medium-High | Good | Excellent |
| tRPC | Type safety | Low | Good | Excellent |

### Databases
| Database | Best For | Scaling | Query Language | ACID |
|----------|----------|---------|----------------|------|
| PostgreSQL | Relational data | Excellent | SQL | Yes |
| MongoDB | Flexible schema | Excellent | MQL | No |
| MySQL | Traditional apps | Good | SQL | Yes |
| Redis | Caching, sessions | Excellent | Commands | No |

### ORMs
| ORM | Best For | DX | Type Safety | Performance |
|-----|----------|-----|-------------|-------------|
| Prisma | Modern apps | Excellent | Excellent | Good |
| TypeORM | TypeScript | Good | Good | Good |
| Drizzle | Performance | Good | Excellent | Excellent |
| Mongoose | MongoDB | Good | Fair | Good |

## Decision Trees

### Choosing Frontend Framework
```
Need SEO?
  Yes → Need dynamic data?
    Yes → Next.js (SSR/ISR)
    No → Next.js (SSG) or Astro
  No → Need maximum performance?
    Yes → Vite + React
    No → Next.js (great all-rounder)
```

### Choosing Backend Framework
```
Team experience?
  Beginners → Express (simple)
  TypeScript experts → NestJS (structured)
  Performance critical → Fastify
  Need end-to-end types → tRPC
```

### Choosing Database
```
Data structure?
  Fixed schema → PostgreSQL
  Flexible/nested → MongoDB
  Need ACID → PostgreSQL
  Document storage → MongoDB
  Caching only → Redis
```

## Stack Templates

### Starter Template
```json
{
  "frontend": "Next.js 14",
  "backend": "Next.js API routes",
  "database": "Supabase",
  "hosting": "Vercel"
}
```

### Production Template
```json
{
  "frontend": "Next.js 14",
  "backend": "NestJS",
  "database": "PostgreSQL + Prisma",
  "cache": "Redis",
  "queue": "Bull",
  "hosting": {
    "frontend": "Vercel",
    "backend": "Railway"
  }
}
```

### Enterprise Template
```json
{
  "frontend": "Next.js 14 + TypeScript",
  "backend": "NestJS microservices",
  "database": "PostgreSQL + MongoDB",
  "cache": "Redis Cluster",
  "queue": "RabbitMQ",
  "container": "Docker + Kubernetes",
  "monitoring": "Datadog",
  "ci_cd": "GitHub Actions"
}
```