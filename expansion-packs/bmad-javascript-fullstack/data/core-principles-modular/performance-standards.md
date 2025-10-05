# Performance Standards

## Frontend Performance

- Code splitting and lazy loading for routes
- React.memo only when measured benefit
- Virtual scrolling for long lists
- Image optimization (next/image or similar)
- Bundle analysis and tree shaking
- Preload critical resources
- Minimize main thread work

## Backend Performance

- Database indexes on query fields
- Connection pooling
- Redis caching for frequent data
- Pagination for large results
- Async/await throughout
- Background jobs for heavy processing
- Query optimization (avoid N+1)

## General Optimization

- Measure before optimizing
- Focus on perceived performance
- Cache strategically
- Compress responses (gzip/brotli)
- CDN for static assets
- Database query optimization
- Load balancing for scale