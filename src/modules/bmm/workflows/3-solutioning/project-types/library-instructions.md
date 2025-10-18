# Library/SDK Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for library/SDK architecture decisions.
The LLM should:
- Understand the library's purpose and target developers
- Consider API design and developer experience heavily
- Focus on versioning, compatibility, and distribution
- Balance flexibility with ease of use
- Document decisions that affect consumers
</critical>

## Language and Ecosystem

**Choose Based on Target Users**

- Consider what language your users are already using
- Factor in cross-language needs (FFI, bindings, REST wrapper)
- Think about ecosystem conventions and expectations
- Performance vs. ease of integration trade-offs

Don't create a Rust library for JavaScript developers unless performance is critical.

## API Design Philosophy

**Developer Experience First**
Based on library complexity:

- **Simple**: Minimal API surface, sensible defaults
- **Flexible**: Builder pattern, configuration objects
- **Powerful**: Layered API (simple + advanced)
- **Framework**: Inversion of control, plugin architecture

Follow language idioms - Pythonic for Python, functional for FP languages.

## Architecture Patterns

**Internal Structure**

- **Facade Pattern**: Hide complexity behind simple interface
- **Strategy Pattern**: For pluggable implementations
- **Factory Pattern**: For object creation flexibility
- **Dependency Injection**: For testability and flexibility

Don't over-engineer simple utility libraries.

## Versioning Strategy

**Semantic Versioning and Compatibility**

- Breaking change policy
- Deprecation strategy
- Migration path planning
- Backward compatibility approach

Consider the maintenance burden of supporting multiple versions.

## Distribution and Packaging

**Package Management**

- **NPM**: For JavaScript/TypeScript
- **PyPI**: For Python
- **Maven/Gradle**: For Java/Kotlin
- **NuGet**: For .NET
- **Cargo**: For Rust
- Multiple registries for cross-language

Include CDN distribution for web libraries.

## Testing Strategy

**Library Testing Approach**

- Unit tests for all public APIs
- Integration tests with common use cases
- Property-based testing for complex logic
- Example projects as tests
- Cross-version compatibility tests

## Documentation Strategy

**Developer Documentation**

- API reference (generated from code)
- Getting started guide
- Common use cases and examples
- Migration guides for major versions
- Troubleshooting section

Good documentation is critical for library adoption.

## Error Handling

**Developer-Friendly Errors**

- Clear error messages with context
- Error codes for programmatic handling
- Stack traces that point to user code
- Validation with helpful messages

## Performance Considerations

**Library Performance**

- Lazy loading where appropriate
- Tree-shaking support for web
- Minimal dependencies
- Memory efficiency
- Benchmark suite for performance regression

## Type Safety

**Type Definitions**

- TypeScript definitions for JavaScript libraries
- Generic types where appropriate
- Type inference optimization
- Runtime type checking options

## Dependency Management

**External Dependencies**

- Minimize external dependencies
- Pin vs. range versioning
- Security audit process
- License compatibility

Zero dependencies is ideal for utility libraries.

## Extension Points

**Extensibility Design** (if needed)

- Plugin architecture
- Middleware pattern
- Hook system
- Custom implementations

Balance flexibility with complexity.

## Platform Support

**Cross-Platform Considerations**

- Browser vs. Node.js for JavaScript
- OS-specific functionality
- Mobile platform support
- WebAssembly compilation

## Adaptive Guidance Examples

**For a UI Component Library:**
Focus on theming, accessibility, tree-shaking, and framework integration.

**For a Data Processing Library:**
Emphasize streaming APIs, memory efficiency, and format support.

**For an API Client SDK:**
Focus on authentication, retry logic, rate limiting, and code generation.

**For a Testing Framework:**
Emphasize assertion APIs, runner architecture, and reporting.

## Key Principles

1. **Make simple things simple** - Common cases should be easy
2. **Make complex things possible** - Don't limit advanced users
3. **Fail fast and clearly** - Help developers debug quickly
4. **Version thoughtfully** - Breaking changes hurt adoption
5. **Document by example** - Show real-world usage

## Output Format

Structure as:

- **Language**: [Primary language and version]
- **API Style**: [Design pattern and approach]
- **Distribution**: [Package registries and methods]
- **Versioning**: [Strategy and compatibility policy]

Focus on decisions that affect library consumers.
