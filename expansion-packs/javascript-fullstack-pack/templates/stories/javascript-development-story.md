# Story: [Feature Name]

**Story ID:** JS-[NUMBER]  
**Epic:** [Epic Name]  
**Sprint:** [Sprint Number]  
**Assignee:** [Developer Name]  
**Status:** [To Do | In Progress | In Review | Done]  
**Priority:** [P0 | P1 | P2]  
**Estimated Effort:** [Small | Medium | Large] ([1-2 days | 3-5 days | 1+ weeks])

---

## Story Description

### User Story
**As a** [type of user]  
**I want** [to do something]  
**So that** [I can achieve some goal or benefit]

### Background
[Provide context about why this story is important and how it fits into the larger feature or product]

### Goals
1. **Goal 1:** [Specific outcome this story should achieve]
2. **Goal 2:** [Another outcome]
3. **Goal 3:** [Third outcome]

---

## Acceptance Criteria

### Functional Requirements
- [ ] **Criterion 1:** [Specific, testable requirement]
- [ ] **Criterion 2:** [Another requirement]
- [ ] **Criterion 3:** [Third requirement]
- [ ] **Criterion 4:** [Fourth requirement]

### Technical Requirements
- [ ] TypeScript types defined with no `any` types
- [ ] Unit tests written with >80% coverage
- [ ] Integration tests for critical paths
- [ ] Error handling implemented
- [ ] Loading and error states handled in UI
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Responsive design for mobile, tablet, desktop
- [ ] API documentation updated (if applicable)

### Performance Requirements
- [ ] Component renders in < 16ms (60fps)
- [ ] API response time < 200ms (p95)
- [ ] Bundle size increase < 50KB
- [ ] Lighthouse score > 90 (if applicable)

### Security Requirements
- [ ] Input validation implemented
- [ ] XSS prevention measures in place
- [ ] CSRF protection (if applicable)
- [ ] Authentication/authorization checked
- [ ] No sensitive data in logs or error messages

---

## Technical Specification

### Frontend Implementation

#### Components to Create/Modify
1. **Component: `[ComponentName]`**
   - **Location:** `src/components/[path]/[ComponentName].tsx`
   - **Purpose:** [What this component does]
   - **Props Interface:**
     ```typescript
     interface [ComponentName]Props {
       prop1: string;
       prop2: number;
       onAction?: () => void;
     }
     ```
   - **Key Features:**
     - Feature 1
     - Feature 2
   - **State Management:** [None | Local useState | Context | Zustand | Redux]

2. **Component: `[AnotherComponent]`**
   - [Similar structure as above]

#### Hooks to Create/Modify
1. **Hook: `use[HookName]`**
   - **Location:** `src/hooks/use[HookName].ts`
   - **Purpose:** [What this hook does]
   - **Interface:**
     ```typescript
     interface Use[HookName]Return {
       data: DataType;
       loading: boolean;
       error: Error | null;
       refetch: () => Promise<void>;
     }
     ```

#### State Management
- **Approach:** [React Query | Zustand | Redux | Context API]
- **State Shape:**
  ```typescript
  interface [StateName] {
    field1: Type;
    field2: Type;
  }
  ```
- **Actions/Mutations:**
  - `action1`: [Description]
  - `action2`: [Description]

#### Styling
- **Approach:** [Tailwind CSS | CSS Modules | Styled Components]
- **New Classes/Components:** [List any new UI components or styles]
- **Responsive Breakpoints:** [mobile, tablet, desktop]

#### Route Changes (if applicable)
- **New Routes:**
  - `/path/to/route` - [Description]
- **Modified Routes:**
  - `/existing/route` - [Changes]

### Backend Implementation

#### API Endpoints

##### Endpoint 1: `[METHOD] /api/v1/[resource]`
- **Description:** [What this endpoint does]
- **Authentication:** [Required | Optional | None]
- **Authorization:** [Roles/permissions required]
- **Request:**
  ```typescript
  interface Request {
    params: {
      id: string;
    };
    query?: {
      page?: number;
      limit?: number;
    };
    body: {
      field1: string;
      field2: number;
    };
  }
  ```
- **Response:**
  ```typescript
  interface SuccessResponse {
    data: {
      id: string;
      field1: string;
      field2: number;
      createdAt: string;
    };
  }
  
  interface ErrorResponse {
    error: string;
    details?: string[];
  }
  ```
- **Status Codes:**
  - `200 OK` - Success
  - `400 Bad Request` - Validation error
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Not authorized
  - `404 Not Found` - Resource not found
  - `500 Internal Server Error` - Server error

##### Endpoint 2: `[METHOD] /api/v1/[resource]`
- [Similar structure as above]

#### Database Changes

##### Schema Changes
```typescript
// Prisma schema changes
model [ModelName] {
  id        String   @id @default(cuid())
  field1    String
  field2    Int
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([field1])
}
```

##### Migrations
- **Migration Name:** `add_[feature]_table`
- **Changes:**
  - Create table `[table_name]`
  - Add column `[column_name]` to `[table_name]`
  - Add index on `[table_name].[column_name]`

##### Seeds/Data (if applicable)
- [Any initial data that needs to be seeded]

#### Service Layer
- **Service:** `[ServiceName]Service`
- **Location:** `src/services/[serviceName].service.ts`
- **Methods:**
  - `create(data: CreateDto): Promise<Entity>`
  - `findById(id: string): Promise<Entity | null>`
  - `update(id: string, data: UpdateDto): Promise<Entity>`
  - `delete(id: string): Promise<void>`

#### Validation
- **Schemas:**
  ```typescript
  const createSchema = z.object({
    field1: z.string().min(1),
    field2: z.number().positive(),
  });
  ```

#### Background Jobs (if applicable)
- **Job:** `[JobName]`
- **Trigger:** [When this job runs]
- **Purpose:** [What it does]
- **Implementation:**
  ```typescript
  queue.add('[job-name]', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
  ```

### Integration Points

#### External APIs
- **API:** [API Name]
- **Purpose:** [Why we're calling this API]
- **Endpoints Used:**
  - `[METHOD] /endpoint` - [Description]
- **Error Handling:** [How to handle API failures]

#### Third-Party Services
- **Service:** [Service Name]
- **Purpose:** [What it's used for]
- **Configuration:** [Any config needed]

---

## Data Flow

### Frontend → Backend
1. User [performs action]
2. Frontend calls `[API endpoint]`
3. Backend validates request
4. Backend processes request
5. Backend returns response
6. Frontend updates UI

### Backend → Database
1. Receive validated request data
2. Transform data for database
3. Execute database query
4. Transform database result
5. Return to controller

### Real-time Updates (if applicable)
1. Event occurs in backend
2. Publish event to WebSocket/Redis
3. Subscribers receive event
4. Frontend updates UI in real-time

---

## Testing Strategy

### Frontend Tests

#### Unit Tests
- **Component Tests:**
  - Test component renders correctly
  - Test props handling
  - Test event handlers
  - Test conditional rendering
  - Test error states
  
- **Hook Tests:**
  - Test hook return values
  - Test hook state updates
  - Test hook error handling

- **Utility Tests:**
  - Test utility functions with various inputs
  - Test edge cases

#### Integration Tests
- **User Flow:**
  1. [Step 1 of user flow]
  2. [Step 2 of user flow]
  3. [Verify expected outcome]

- **API Integration:**
  - Mock API calls
  - Test success scenarios
  - Test error scenarios
  - Test loading states

### Backend Tests

#### Unit Tests
- **Service Tests:**
  - Test business logic
  - Test error handling
  - Test edge cases
  - Mock database calls

#### Integration Tests
- **API Tests:**
  ```typescript
  describe('POST /api/v1/[resource]', () => {
    it('creates a new resource', async () => {
      const response = await request(app)
        .post('/api/v1/[resource]')
        .send(validData)
        .expect(201);
      
      expect(response.body).toMatchObject(expectedShape);
    });
    
    it('returns 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/[resource]')
        .send(invalidData)
        .expect(400);
    });
  });
  ```

- **Database Tests:**
  - Test CRUD operations
  - Test transactions
  - Test constraints and validations

### E2E Tests
- **Critical Path:**
  1. [User action 1]
  2. [User action 2]
  3. [Verify result]

---

## Error Handling

### Frontend Error Scenarios
1. **API Error:**
   - Show error toast notification
   - Log error to monitoring service
   - Provide retry option if applicable

2. **Validation Error:**
   - Show inline error messages
   - Highlight invalid fields
   - Prevent form submission

3. **Network Error:**
   - Show offline indicator
   - Queue requests for retry
   - Provide manual refresh option

### Backend Error Scenarios
1. **Validation Error:**
   - Return 400 with detailed error messages
   - Include field-specific errors

2. **Authentication Error:**
   - Return 401 with clear message
   - Include info about token expiration

3. **Authorization Error:**
   - Return 403 with permission info
   - Log unauthorized access attempt

4. **Database Error:**
   - Return 500 with generic message to user
   - Log full error details
   - Alert monitoring system

---

## Performance Considerations

### Frontend Performance
- [ ] Implement code splitting for heavy components
- [ ] Use React.memo for expensive components
- [ ] Implement virtualization for long lists
- [ ] Optimize images (WebP, lazy loading)
- [ ] Debounce expensive operations
- [ ] Use React Query caching effectively

### Backend Performance
- [ ] Add database indexes for queried fields
- [ ] Implement caching for frequently accessed data
- [ ] Use pagination for large datasets
- [ ] Optimize database queries (avoid N+1)
- [ ] Implement request batching if needed

### Bundle Size
- [ ] Check bundle size impact
- [ ] Use dynamic imports for large dependencies
- [ ] Tree-shake unused code

---

## Security Considerations

### Frontend Security
- [ ] Sanitize user inputs
- [ ] Implement CSP headers
- [ ] Validate data before rendering
- [ ] Don't expose sensitive data in client
- [ ] Use HTTPS only

### Backend Security
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Check authorization on all endpoints
- [ ] Hash sensitive data
- [ ] Use security headers (Helmet.js)
- [ ] Log security events

---

## Accessibility

### Requirements
- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels on custom components
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] Form labels and error messages
- [ ] Skip navigation links (if applicable)

### Testing
- [ ] Run axe DevTools
- [ ] Test with keyboard only
- [ ] Test with screen reader (NVDA/VoiceOver)

---

## Documentation

### Code Documentation
- [ ] JSDoc comments on public functions
- [ ] README updated with new features
- [ ] Component prop documentation
- [ ] API endpoint documentation

### User Documentation
- [ ] User guide updated (if applicable)
- [ ] Help text added to UI
- [ ] Tooltips for complex features

### Developer Documentation
- [ ] Architecture decision recorded
- [ ] Setup instructions updated
- [ ] API documentation generated/updated

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] All tests passing (unit, integration, E2E)
- [ ] Test coverage meets requirements (>80%)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Documentation updated
- [ ] Accessibility requirements met
- [ ] Performance requirements met
- [ ] Security review completed
- [ ] Deployed to staging
- [ ] QA tested on staging
- [ ] Product owner approval
- [ ] Ready for production deployment

---

## Dependencies

### Blocked By
- [ ] [Story ID]: [Description of blocking story]
- [ ] [Story ID]: [Another blocking story]

### Blocks
- [ ] [Story ID]: [Story that depends on this one]
- [ ] [Story ID]: [Another dependent story]

### Related Stories
- [Story ID]: [Related story]
- [Story ID]: [Another related story]

---

## Notes

### Technical Notes
- [Any technical considerations or decisions]
- [Trade-offs made]
- [Future improvements to consider]

### Design Notes
- [Design decisions]
- [UX considerations]

### Questions/Clarifications Needed
- [ ] **Question 1:** [Question needing clarification]
- [ ] **Question 2:** [Another question]

---

## Timeline

- **Started:** [Date]
- **In Review:** [Date]
- **Merged:** [Date]
- **Deployed to Staging:** [Date]
- **Deployed to Production:** [Date]

---

## Links

- **Figma Design:** [URL]
- **PRD:** [URL]
- **Architecture Doc:** [URL]
- **API Docs:** [URL]
- **Pull Request:** [URL]
- **Staging URL:** [URL]
- **Production URL:** [URL]
