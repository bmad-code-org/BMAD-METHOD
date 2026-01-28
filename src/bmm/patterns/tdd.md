# Test-Driven Development (TDD) Pattern

**Red → Green → Refactor**

Write tests first, make them pass, then refactor.

## Why TDD?

1. **Design quality:** Writing tests first forces good API design
2. **Coverage:** 90%+ coverage by default
3. **Confidence:** Refactor without fear
4. **Documentation:** Tests document expected behavior

## TDD Cycle

```
┌─────────────────────────────────────────────┐
│ 1. RED: Write a failing test                │
│    - Test what the code SHOULD do           │
│    - Test fails (code doesn't exist yet)    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. GREEN: Write minimal code to pass        │
│    - Simplest implementation that works     │
│    - Test passes                            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. REFACTOR: Clean up code                  │
│    - Improve design                         │
│    - Remove duplication                     │
│    - Tests still pass                       │
└─────────────────────────────────────────────┘
                    ↓
              (repeat for next feature)
```

## Implementation Order

### Greenfield (New Code)
1. Write test for happy path
2. Write test for error cases
3. Write test for edge cases
4. Implement to make all tests pass
5. Refactor

### Brownfield (Existing Code)
1. Understand existing behavior
2. Add tests for current behavior (characterization tests)
3. Write test for new behavior
4. Implement new behavior
5. Refactor

## Test Quality Standards

### Good Test Characteristics
- ✅ **Isolated:** Each test independent
- ✅ **Fast:** Runs in milliseconds
- ✅ **Clear:** Obvious what it tests
- ✅ **Focused:** One behavior per test
- ✅ **Stable:** No flakiness

### Test Structure (AAA Pattern)
```typescript
test('should calculate total price with tax', () => {
  // Arrange: Set up test data
  const cart = new ShoppingCart();
  cart.addItem({ price: 100, quantity: 2 });
  
  // Act: Execute the behavior
  const total = cart.getTotalWithTax(0.08);
  
  // Assert: Verify the result
  expect(total).toBe(216); // (100 * 2) * 1.08
});
```

## What to Test

### Must Test (Critical)
- Business logic
- API endpoints
- Data transformations
- Error handling
- Authorization checks
- Edge cases

### Nice to Test (Important)
- UI components
- Integration flows
- Performance benchmarks

### Don't Waste Time Testing
- Third-party libraries (already tested)
- Framework internals (already tested)
- Trivial getters/setters
- Generated code

## Coverage Target

**Minimum:** 90% line coverage
**Ideal:** 95%+ with meaningful tests

**Coverage ≠ Quality**
- 100% coverage with bad tests is worthless
- 90% coverage with good tests is excellent

## TDD Anti-Patterns

**Avoid these:**
- ❌ Writing tests after code (test-after)
- ❌ Testing implementation details
- ❌ Tests that test nothing
- ❌ Brittle tests (break with refactoring)
- ❌ Slow tests (> 1 second)

## Example: TDD for API Endpoint

```typescript
// Step 1: RED - Write failing test
describe('POST /api/orders', () => {
  test('should create order and return 201', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ items: [{ id: 1, qty: 2 }] })
      .expect(201);
    
    expect(response.body).toHaveProperty('orderId');
  });
});

// Test fails (endpoint doesn't exist yet)

// Step 2: GREEN - Minimal implementation
app.post('/api/orders', async (req, res) => {
  const orderId = await createOrder(req.body);
  res.status(201).json({ orderId });
});

// Test passes

// Step 3: REFACTOR - Add validation, error handling
app.post('/api/orders', async (req, res) => {
  try {
    // Input validation
    const schema = z.object({
      items: z.array(z.object({
        id: z.number(),
        qty: z.number().min(1)
      }))
    });
    
    const data = schema.parse(req.body);
    
    // Business logic
    const orderId = await createOrder(data);
    
    res.status(201).json({ orderId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Internal error' });
    }
  }
});

// All tests still pass
```

## TDD in Practice

**Start here:**
1. Write one test for the simplest case
2. Make it pass with simplest code
3. Write next test for slightly more complex case
4. Refactor when you see duplication
5. Repeat

**Don't:**
- Write all tests first (too much work)
- Write production code without failing test
- Skip refactoring step
