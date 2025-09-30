# <!-- Powered by BMAD™ Core -->

# Performance Optimization Task

## Purpose
Systematic approach to identifying and resolving performance issues in JavaScript/TypeScript full-stack applications.

## When to Use
- Performance targets not being met
- User complaints about slow loading
- High server costs due to inefficiency
- Preparing for increased scale
- Regular performance audits

## Performance Optimization Process

### 1. Measure Current Performance

**Frontend Metrics:**
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

**Backend Metrics:**
- API response times (p50, p95, p99)
- Database query times
- Memory usage
- CPU usage

**Tools:**
- Lighthouse for frontend
- Chrome DevTools Performance tab
- React DevTools Profiler
- APM tools (Datadog, New Relic)
- Database query analyzers (EXPLAIN ANALYZE)

### 2. Identify Bottlenecks

**Common Frontend Issues:**
- Large bundle size
- Slow images
- Too many re-renders
- Blocking JavaScript
- Large third-party scripts

**Common Backend Issues:**
- Slow database queries (N+1 problems)
- Missing indexes
- No caching
- Synchronous operations
- Memory leaks

### 3. Frontend Optimization

#### Bundle Optimization
```bash
# Analyze bundle
npm run build
npx webpack-bundle-analyzer
```

**Actions:**
- Code split large components
- Lazy load routes
- Tree shake unused code
- Use dynamic imports
- Remove unused dependencies

#### Image Optimization
- Use next/image for automatic optimization
- Serve WebP format with fallbacks
- Lazy load images below fold
- Use appropriate sizes (responsive images)
- Compress images (TinyPNG, ImageOptim)

#### React Performance
```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // ...
});

// Memoize callbacks
const handleClick = useCallback(() => {
  // ...
}, [deps]);

// Memoize expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// Virtual scrolling for long lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

#### Caching Strategy
```typescript
// React Query caching
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### 4. Backend Optimization

#### Database Optimization
```typescript
// Add indexes
await prisma.$executeRaw`
  CREATE INDEX idx_users_email ON users(email);
`;

// Optimize queries
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Only select needed fields
  },
  where: {
    isActive: true,
  },
  take: 20, // Limit results
});

// Prevent N+1
const postsWithAuthors = await prisma.post.findMany({
  include: {
    author: true, // Eager load
  },
});
```

#### Caching Layer
```typescript
import Redis from 'ioredis';

const redis = new Redis();

async function getCachedData(key: string, fetchFn: () => Promise<any>) {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Fetch and cache
  const data = await fetchFn();
  await redis.setex(key, 300, JSON.stringify(data)); // 5 min TTL
  return data;
}
```

#### Background Jobs
```typescript
import Queue from 'bull';

const emailQueue = new Queue('email', {
  redis: { host: 'localhost', port: 6379 },
});

// Don't block API responses
app.post('/send-email', async (req, res) => {
  await emailQueue.add({ to, subject, body });
  res.json({ message: 'Email queued' });
});
```

### 5. Network Optimization

**Enable Compression:**
```typescript
import compression from 'compression';
app.use(compression());
```

**CDN for Static Assets:**
- Host images, CSS, JS on CDN
- Use CloudFlare, AWS CloudFront, or Vercel Edge

**HTTP/2:**
- Enable HTTP/2 on server
- Reduces latency for multiple requests

### 6. Monitoring

**Set Up Continuous Monitoring:**
- Lighthouse CI in GitHub Actions
- Error rate alerts
- Response time alerts
- CPU/Memory usage alerts

**Performance Budget:**
```json
{
  "budgets": [{
    "path": "/*",
    "timings": [{
      "metric": "interactive",
      "budget": 3000
    }],
    "resourceSizes": [{
      "resourceType": "script",
      "budget": 200
    }]
  }]
}
```

## Performance Targets

### Frontend
- Lighthouse score: >90
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Time to Interactive: < 3.5s

### Backend
- API response time: < 200ms (p95)
- Database query time: < 100ms
- Error rate: < 0.1%
- Uptime: 99.9%

## Validation
Use `checklists/performance-checklist.md` to validate all optimizations

## Common Quick Wins
- Add database indexes
- Enable gzip compression
- Use CDN for static assets
- Add Redis caching
- Code split frontend
- Optimize images
- Lazy load components
- Remove unused dependencies