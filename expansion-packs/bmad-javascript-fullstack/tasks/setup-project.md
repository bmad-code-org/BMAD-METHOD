# <!-- Powered by BMAD™ Core -->

# Project Setup Task

## Purpose
Initialize a new JavaScript/TypeScript full-stack project with proper tooling, configuration, and folder structure.

## Prerequisites
- Architecture document complete
- Technology stack decided
- Development environment ready (Node.js 18+, Git)

## Setup Steps

### 1. Create Project Structure

#### Monorepo (Recommended for Full-Stack)
```bash
npx create-turbo@latest my-app
# or
pnpm create turbo@latest my-app
```

**Structure:**
```
my-app/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express/Fastify backend
├── packages/
│   ├── ui/           # Shared React components
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configs
├── package.json
└── turbo.json
```

#### Separate Repos
```bash
# Frontend
npx create-next-app@latest frontend --typescript --tailwind --app

# Backend
mkdir backend && cd backend
npm init -y
npm install express prisma typescript @types/node
```

### 2. TypeScript Configuration

**tsconfig.json** (Backend):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Install Dependencies

**Frontend:**
```bash
pnpm add react-query zustand
pnpm add -D @types/react vitest
```

**Backend:**
```bash
pnpm add express prisma zod
pnpm add -D @types/express typescript tsx
```

### 4. Configure Linting & Formatting

**ESLint (.eslintrc.json):**
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

**Prettier (.prettierrc):**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 5. Set Up Database

**Install Prisma:**
```bash
pnpm add -D prisma
npx prisma init
```

**Update .env:**
```
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
```

### 6. Configure Git

**.gitignore:**
```
node_modules/
.env
.env.local
dist/
.next/
.turbo/
coverage/
```

### 7. Set Up Testing

**Vitest (Frontend):**
```bash
pnpm add -D vitest @testing-library/react
```

**Jest (Backend):**
```bash
pnpm add -D jest @types/jest ts-jest supertest
```

### 8. Configure CI/CD

**GitHub Actions (.github/workflows/ci.yml):**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```

### 9. Environment Variables

**Create .env.example:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 10. README Documentation

Document:
- Setup instructions
- Available scripts
- Environment variables
- Deployment process

## Verification Checklist

- [ ] Project initializes without errors
- [ ] TypeScript compiles (no errors)
- [ ] ESLint passes
- [ ] Tests run successfully
- [ ] Git initialized with .gitignore
- [ ] Environment variables documented
- [ ] README complete with setup instructions
- [ ] CI/CD pipeline configured

## Next Steps
- Begin story-driven development
- Set up development database
- Create first feature branch