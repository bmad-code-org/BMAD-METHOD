# <!-- Powered by BMAD™ Core -->

# Frontend Quality Checklist

## React/Next.js Component Quality

### Component Structure
- [ ] **Single Responsibility** - Each component has one clear purpose
- [ ] **Proper TypeScript Types** - Props interface defined with no `any`
- [ ] **Component Size** - Under 300 lines (extract smaller components if larger)
- [ ] **Named Exports** - Prefer named exports for better refactoring
- [ ] **File Organization** - Component, styles, tests, and types co-located

### React Best Practices
- [ ] **Hooks Usage** - Hooks used correctly (no conditional hooks)
- [ ] **useEffect Dependencies** - All dependencies included in dependency array
- [ ] **Memoization** - useMemo/useCallback used for expensive operations
- [ ] **Key Props** - Proper unique keys on list items
- [ ] **Ref Usage** - useRef used appropriately for DOM access
- [ ] **Error Boundaries** - Error boundaries wrap components that may fail

### State Management
- [ ] **Local State** - useState for component-local state
- [ ] **Server State** - React Query/SWR for API data
- [ ] **Global State** - Zustand/Redux only when necessary
- [ ] **Derived State** - Computed values use useMemo
- [ ] **State Location** - State lifted to appropriate level

### Performance
- [ ] **Code Splitting** - Large components lazy loaded
- [ ] **Bundle Size** - No unnecessary dependencies
- [ ] **Re-renders** - React DevTools shows minimal re-renders
- [ ] **Images Optimized** - next/image or optimized images
- [ ] **Virtualization** - Long lists use react-virtual or similar

### Styling
- [ ] **Consistent Approach** - One styling method used consistently
- [ ] **Responsive Design** - Mobile, tablet, desktop breakpoints
- [ ] **Dark Mode** - Dark mode support if required
- [ ] **Design System** - Follows established design tokens
- [ ] **No Inline Styles** - Styles in CSS/Tailwind, not inline (unless dynamic)

## Accessibility

- [ ] **Semantic HTML** - article, nav, main, section used appropriately
- [ ] **ARIA Labels** - Proper ARIA labels on interactive elements
- [ ] **Keyboard Navigation** - All interactions work with keyboard
- [ ] **Focus Management** - Visible focus indicators
- [ ] **Color Contrast** - Meets WCAG AA standards (4.5:1)
- [ ] **Screen Reader** - Tested with screen reader
- [ ] **Form Labels** - All inputs have associated labels
- [ ] **Alt Text** - All images have descriptive alt text

## User Experience

- [ ] **Loading States** - Skeletons or spinners during data fetching
- [ ] **Error States** - User-friendly error messages
- [ ] **Empty States** - Helpful messages when no data
- [ ] **Success Feedback** - Confirmation of successful actions
- [ ] **Optimistic Updates** - UI updates before server confirms (when appropriate)
- [ ] **Transitions** - Smooth transitions between states

## Testing

- [ ] **Component Tests** - React Testing Library tests written
- [ ] **User Interactions** - Click, type, submit events tested
- [ ] **Conditional Rendering** - All branches tested
- [ ] **Error Cases** - Error states tested
- [ ] **Accessibility Tests** - axe-core or similar used
- [ ] **Coverage** - >80% test coverage

## TypeScript Quality

- [ ] **Props Typed** - Complete interface for props
- [ ] **Event Handlers** - Proper event types used
- [ ] **Children Typing** - ReactNode for children prop
- [ ] **Generics** - Generic components properly typed
- [ ] **No Any** - No `any` types (use `unknown` if necessary)

## Build & Performance

- [ ] **Lighthouse Score** - >90 on all metrics
- [ ] **Core Web Vitals** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **Bundle Analysis** - No duplicate dependencies
- [ ] **Tree Shaking** - Unused code eliminated
- [ ] **Critical CSS** - Above-fold CSS inlined

## Security

- [ ] **XSS Prevention** - User input sanitized
- [ ] **CSP Headers** - Content Security Policy configured
- [ ] **Secure Cookies** - httpOnly, secure flags set
- [ ] **No Secrets** - No API keys or secrets in frontend code
- [ ] **HTTPS Only** - All requests over HTTPS

**Quality Rating:** ⭐⭐⭐⭐⭐

**Ready for Production:** [ ] Yes [ ] No