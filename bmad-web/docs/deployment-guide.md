# BMAD Web - Guia de Deploy

Este guia cobre todas as opcoes de deploy para a aplicacao BMAD Web.

---

## Sumario

1. [Arquitetura de Deploy](#arquitetura-de-deploy)
2. [Opcao 1: Vercel + Railway (Recomendado)](#opcao-1-vercel--railway-recomendado)
3. [Opcao 2: Docker Compose (Self-hosted)](#opcao-2-docker-compose-self-hosted)
4. [Opcao 3: Kubernetes](#opcao-3-kubernetes)
5. [Configuracao de Banco de Dados](#configuracao-de-banco-de-dados)
6. [Variaveis de Ambiente](#variaveis-de-ambiente)
7. [CI/CD com GitHub Actions](#cicd-com-github-actions)
8. [Monitoramento](#monitoramento)
9. [Checklist de Producao](#checklist-de-producao)

---

## Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCAO                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐         ┌──────────────┐         ┌────────────┐  │
│   │   Vercel     │         │   Railway    │         │  Supabase  │  │
│   │   (Next.js)  │◄───────►│   (API)      │◄───────►│  (Postgres)│  │
│   │              │         │              │         │            │  │
│   │   Frontend   │  REST   │   Backend    │   SQL   │  Database  │  │
│   │   + CDN      │  + WS   │   + Socket   │         │  + Auth    │  │
│   └──────────────┘         └──────────────┘         └────────────┘  │
│          │                        │                        │        │
│          │                        │                        │        │
│          ▼                        ▼                        ▼        │
│   ┌──────────────┐         ┌──────────────┐         ┌────────────┐  │
│   │  Cloudflare  │         │    Upstash   │         │    S3      │  │
│   │    (DNS)     │         │   (Redis)    │         │  (Assets)  │  │
│   └──────────────┘         └──────────────┘         └────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Opcao 1: Vercel + Railway (Recomendado)

A opcao mais simples para comecar. Zero configuracao de infraestrutura.

### 1.1 Deploy do Frontend (Vercel)

#### Passo 1: Conectar repositorio

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Na pasta bmad-web/apps/web
cd bmad-web/apps/web
vercel
```

#### Passo 2: Configurar no Dashboard Vercel

1. Acesse https://vercel.com/dashboard
2. Import o repositorio do GitHub
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `bmad-web/apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Passo 3: Variaveis de Ambiente

No dashboard Vercel, adicione:

```
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
NEXT_PUBLIC_WS_URL=wss://sua-api.railway.app
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

#### Passo 4: Deploy

```bash
# Deploy de producao
vercel --prod
```

---

### 1.2 Deploy da API (Railway)

#### Passo 1: Criar projeto Railway

1. Acesse https://railway.app
2. New Project > Deploy from GitHub repo
3. Selecione o repositorio

#### Passo 2: Configurar servico

No dashboard Railway:

1. **Root Directory**: `bmad-web/apps/api`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`

#### Passo 3: Variaveis de Ambiente

```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://seu-app.vercel.app
JWT_SECRET=sua-chave-super-secreta-aqui
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
BMAD_ROOT=/app/../../..
```

#### Passo 4: Adicionar Postgres (Railway)

1. No projeto Railway, clique em "New"
2. Selecione "Database" > "PostgreSQL"
3. Copie a DATABASE_URL gerada

#### Passo 5: Adicionar Redis (Upstash)

1. Acesse https://upstash.com
2. Crie um banco Redis
3. Copie a REDIS_URL

---

### 1.3 Comandos Rapidos (Vercel + Railway)

```bash
# Frontend
cd bmad-web/apps/web
vercel --prod

# Backend (Railway CLI)
npm i -g @railway/cli
railway login
cd bmad-web/apps/api
railway up
```

---

## Opcao 2: Docker Compose (Self-hosted)

Para quem quer controle total ou rodar on-premise.

### 2.1 Arquivos Docker

Os arquivos ja estao criados:
- `bmad-web/Dockerfile.web` - Frontend
- `bmad-web/Dockerfile.api` - Backend
- `bmad-web/docker-compose.yml` - Orquestracao
- `bmad-web/docker-compose.prod.yml` - Producao

### 2.2 Build e Run Local

```bash
cd bmad-web

# Desenvolvimento
docker-compose up -d

# Producao
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 2.3 Deploy em VPS (DigitalOcean, Hetzner, etc.)

```bash
# 1. SSH na VPS
ssh root@seu-servidor

# 2. Instalar Docker
curl -fsSL https://get.docker.com | sh

# 3. Clonar repositorio
git clone https://github.com/seu-usuario/BMAD-METHOD.git
cd BMAD-METHOD/bmad-web

# 4. Configurar ambiente
cp .env.example .env
nano .env  # Editar variaveis

# 5. Subir servicos
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 6. Configurar Nginx (proxy reverso)
apt install nginx
# Copiar config do nginx.conf
```

### 2.4 Com Traefik (HTTPS automatico)

```bash
# Usar docker-compose.traefik.yml para HTTPS automatico
docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d
```

---

## Opcao 3: Kubernetes

Para escala enterprise.

### 3.1 Estrutura

```
bmad-web/k8s/
├── namespace.yaml
├── configmap.yaml
├── secrets.yaml
├── web-deployment.yaml
├── api-deployment.yaml
├── postgres-deployment.yaml
├── redis-deployment.yaml
├── ingress.yaml
└── hpa.yaml
```

### 3.2 Deploy

```bash
# Criar namespace
kubectl apply -f k8s/namespace.yaml

# Aplicar configs
kubectl apply -f k8s/

# Verificar status
kubectl get pods -n bmad
```

---

## Configuracao de Banco de Dados

### Opcao A: Supabase (Recomendado)

1. Crie conta em https://supabase.com
2. Crie novo projeto
3. Copie a connection string:
   ```
   DATABASE_URL=postgresql://postgres:[senha]@db.[ref].supabase.co:5432/postgres
   ```

### Opcao B: PlanetScale (MySQL)

1. Crie conta em https://planetscale.com
2. Crie database
3. Copie connection string

### Opcao C: Neon (Postgres Serverless)

1. Crie conta em https://neon.tech
2. Crie projeto
3. Copie connection string

### Migrations

```bash
cd bmad-web/apps/api

# Gerar cliente Prisma
npx prisma generate

# Push schema para banco
npx prisma db push

# Ou usar migrations
npx prisma migrate deploy
```

---

## Variaveis de Ambiente

### Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=https://api.bmad.app
NEXT_PUBLIC_WS_URL=wss://api.bmad.app

# App
NEXT_PUBLIC_APP_URL=https://bmad.app
NEXT_PUBLIC_APP_NAME=BMAD

# Analytics (opcional)
NEXT_PUBLIC_MIXPANEL_TOKEN=xxx
NEXT_PUBLIC_GA_ID=G-xxx

# Feature Flags (opcional)
NEXT_PUBLIC_ENABLE_BILLING=true
```

### Backend (.env)

```bash
# Server
NODE_ENV=production
PORT=4000

# URLs
FRONTEND_URL=https://bmad.app

# Auth
JWT_SECRET=sua-chave-jwt-muito-secreta-minimo-32-chars

# Database
DATABASE_URL=postgresql://user:pass@host:5432/bmad

# Redis
REDIS_URL=redis://default:pass@host:6379

# BMAD Core
BMAD_ROOT=/app/bmad-core

# AI Providers
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# Stripe (billing)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (opcional)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.xxx

# Monitoring (opcional)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Gerar JWT_SECRET Seguro

```bash
openssl rand -base64 32
```

---

## CI/CD com GitHub Actions

### Arquivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: cd bmad-web && npm ci

      - name: Lint
        run: cd bmad-web && npm run lint

      - name: Test
        run: cd bmad-web && npm test

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: bmad-web/apps/web
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-action@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
```

---

## Monitoramento

### Sentry (Error Tracking)

```bash
# Instalar
npm install @sentry/nextjs @sentry/node

# Configurar em next.config.js e api/src/index.ts
```

### Uptime Monitoring

- **Better Uptime**: https://betteruptime.com
- **UptimeRobot**: https://uptimerobot.com

Endpoints para monitorar:
- `https://bmad.app` (frontend)
- `https://api.bmad.app/health` (backend)

### Analytics

- **Mixpanel**: Eventos de produto
- **Google Analytics**: Trafego
- **PostHog**: Open-source alternativa

---

## Checklist de Producao

### Seguranca
- [ ] JWT_SECRET forte (32+ chars)
- [ ] HTTPS em todos os endpoints
- [ ] Rate limiting configurado
- [ ] CORS configurado corretamente
- [ ] Headers de seguranca (helmet)
- [ ] Variaveis sensiveis em secrets manager

### Performance
- [ ] CDN para assets estaticos
- [ ] Cache Redis funcionando
- [ ] Compressao gzip habilitada
- [ ] Images otimizadas (next/image)
- [ ] Bundle size otimizado

### Banco de Dados
- [ ] Backups automaticos configurados
- [ ] Connection pooling (PgBouncer)
- [ ] Indices criados para queries frequentes
- [ ] SSL habilitado na conexao

### Monitoramento
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alertas configurados

### Legal/Compliance
- [ ] Termos de Servico
- [ ] Politica de Privacidade
- [ ] Cookie consent
- [ ] LGPD/GDPR compliance

---

## Troubleshooting

### Erro: "WebSocket connection failed"

```bash
# Verificar se WebSocket esta habilitado no Railway/Vercel
# Railway: ja suporta nativamente
# Vercel: usar Vercel Serverless Functions com upgrade
```

### Erro: "Database connection timeout"

```bash
# Verificar DATABASE_URL
# Adicionar ?connect_timeout=10&pool_timeout=10
DATABASE_URL=postgresql://...?connect_timeout=10
```

### Erro: "JWT invalid"

```bash
# Verificar se JWT_SECRET e o mesmo em todos os servicos
# Verificar timezone dos servidores
```

### Build falha no Vercel

```bash
# Verificar se todas as deps estao no package.json
# Verificar se NEXT_PUBLIC_* estao configuradas
# Verificar Root Directory
```

---

## Comandos Uteis

```bash
# Logs da API (Railway)
railway logs

# Logs do Frontend (Vercel)
vercel logs

# SSH no container Docker
docker exec -it bmad-api sh

# Prisma Studio (visualizar banco)
npx prisma studio

# Reset do banco (CUIDADO!)
npx prisma migrate reset
```

---

## Custos Estimados

### Startup (0-1000 usuarios)

| Servico | Custo/mes |
|---------|-----------|
| Vercel (Hobby) | $0 |
| Railway (Starter) | $5 |
| Supabase (Free) | $0 |
| Upstash (Free) | $0 |
| **Total** | **$5/mes** |

### Growth (1000-10000 usuarios)

| Servico | Custo/mes |
|---------|-----------|
| Vercel (Pro) | $20 |
| Railway (Pro) | $20 |
| Supabase (Pro) | $25 |
| Upstash (Pay-as-go) | $10 |
| **Total** | **$75/mes** |

### Scale (10000+ usuarios)

| Servico | Custo/mes |
|---------|-----------|
| Vercel (Enterprise) | $150+ |
| Railway (Team) | $50+ |
| Supabase (Team) | $599+ |
| Redis (Managed) | $50+ |
| **Total** | **$850+/mes** |
