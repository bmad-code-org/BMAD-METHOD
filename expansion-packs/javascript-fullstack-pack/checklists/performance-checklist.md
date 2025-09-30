# <!-- Powered by BMAD™ Core -->

# Performance Optimization Checklist

## Frontend Performance

### Core Web Vitals
- [ ] **LCP** - Largest Contentful Paint < 2.5s
- [ ] **FID** - First Input Delay < 100ms
- [ ] **CLS** - Cumulative Layout Shift < 0.1
- [ ] **TTFB** - Time to First Byte < 600ms
- [ ] **TTI** - Time to Interactive < 3.5s

### Bundle Optimization
- [ ] **Code Splitting** - Route-based code splitting
- [ ] **Lazy Loading** - Components lazy loaded with React.lazy
- [ ] **Tree Shaking** - Unused code eliminated
- [ ] **Bundle Analysis** - webpack-bundle-analyzer or similar
- [ ] **Chunk Optimization** - Vendor chunks separated
- [ ] **Total Bundle** - < 200KB initial load (gzipped)

### Image Optimization
- [ ] **Next/Image** - Use next/image or optimized images
- [ ] **WebP Format** - Serve WebP with fallbacks
- [ ] **Lazy Loading** - Images lazy loaded below fold
- [ ] **Responsive Images** - srcset for different sizes
- [ ] **CDN Delivery** - Images served from CDN
- [ ] **Compression** - Images compressed (TinyPNG, etc.)

### Caching Strategy
- [ ] **Service Worker** - Service worker for caching (PWA)
- [ ] **Cache-Control** - Appropriate cache headers
- [ ] **Static Assets** - Versioned static assets
- [ ] **API Caching** - React Query cache configuration

### Rendering Strategy
- [ ] **SSR/SSG** - Server rendering or static generation where appropriate
- [ ] **Streaming** - Streaming SSR for large pages
- [ ] **Incremental Static Regeneration** - ISR for dynamic content
- [ ] **Client-side Hydration** - Minimal hydration overhead

### React Performance
- [ ] **Memo** - React.memo for expensive components
- [ ] **useCallback** - Callbacks memoized
- [ ] **useMemo** - Expensive computations memoized
- [ ] **Virtual Scrolling** - react-window or react-virtual for long lists
- [ ] **Avoid Re-renders** - Unnecessary re-renders eliminated

## Backend Performance

### API Response Time
- [ ] **Response Time** - < 200ms for p95
- [ ] **Slow Query Detection** - Queries > 100ms logged
- [ ] **Timeout Configuration** - Reasonable timeouts set
- [ ] **Connection Pooling** - Database connection pool configured

### Database Optimization
- [ ] **Indexes** - Indexes on frequently queried fields
- [ ] **Query Optimization** - EXPLAIN ANALYZE used
- [ ] **N+1 Prevention** - No N+1 query problems
- [ ] **Pagination** - Large datasets paginated
- [ ] **Connection Pool** - Pool size optimized
- [ ] **Query Caching** - Database query caching

### Caching Layer
- [ ] **Redis Caching** - Frequently accessed data cached
- [ ] **Cache Invalidation** - Clear cache invalidation strategy
- [ ] **Cache TTL** - Appropriate TTL for each cache
- [ ] **Cache-Aside Pattern** - Fetch from cache, then DB
- [ ] **Session Caching** - User sessions in Redis

### API Optimization
- [ ] **Compression** - gzip/brotli compression enabled
- [ ] **Response Size** - Minimal response payloads
- [ ] **GraphQL** - DataLoader for batching (if GraphQL)
- [ ] **Batch Endpoints** - Batch operations available
- [ ] **HTTP/2** - HTTP/2 enabled

### Background Jobs
- [ ] **Queue System** - Long tasks in queue (Bull, BullMQ)
- [ ] **Async Operations** - Non-blocking async operations
- [ ] **Job Retry** - Failed jobs retry with backoff
- [ ] **Job Monitoring** - Job queue monitored

## Network Performance

### CDN Usage
- [ ] **Static Assets** - Static files served via CDN
- [ ] **Geographic Distribution** - CDN has global coverage
- [ ] **Cache Headers** - Long cache times for static assets
- [ ] **Compression** - CDN compresses responses

### Request Optimization
- [ ] **HTTP/2** - HTTP/2 or HTTP/3 enabled
- [ ] **Keep-Alive** - Connection reuse enabled
- [ ] **DNS Prefetch** - <link rel="dns-prefetch">
- [ ] **Preconnect** - <link rel="preconnect"> for critical origins
- [ ] **Resource Hints** - Prefetch, preload for critical resources

## Monitoring & Profiling

### Performance Monitoring
- [ ] **Lighthouse CI** - Lighthouse scores in CI
- [ ] **RUM** - Real User Monitoring (Datadog, New Relic)
- [ ] **APM** - Application Performance Monitoring
- [ ] **Error Rate** - Error rate < 0.1%
- [ ] **Uptime** - 99.9% uptime

### Profiling Tools
- [ ] **React DevTools** - Profiler for React performance
- [ ] **Chrome DevTools** - Performance audits
- [ ] **Node.js Profiler** - Backend profiling
- [ ] **Database Profiler** - Query performance profiling

### Alerts
- [ ] **Performance Alerts** - Alert on performance degradation
- [ ] **Error Rate Alerts** - Alert on increased errors
- [ ] **Response Time Alerts** - Alert on slow responses

**Performance Rating:** ⭐⭐⭐⭐⭐