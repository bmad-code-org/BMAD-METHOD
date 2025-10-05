# Library/SDK Architecture Questions

## Language and Platform

1. **Primary language:**
   - TypeScript/JavaScript
   - Python
   - Rust
   - Go
   - Java/Kotlin
   - C#
   - Other: **\_\_\_**

2. **Target runtime:**
   - Node.js
   - Browser (frontend)
   - Both Node.js + Browser (isomorphic)
   - Deno
   - Bun
   - Python runtime
   - Other: **\_\_\_**

3. **Package registry:**
   - npm (JavaScript)
   - PyPI (Python)
   - crates.io (Rust)
   - Maven Central (Java)
   - NuGet (.NET)
   - Go modules
   - Other: **\_\_\_**

## API Design

4. **Public API style:**
   - Functional (pure functions)
   - OOP (classes/instances)
   - Fluent/Builder pattern
   - Mix

5. **API surface size:**
   - Minimal (focused, single purpose)
   - Comprehensive (many features)

6. **Async handling:**
   - Promises (async/await)
   - Callbacks
   - Observables (RxJS)
   - Synchronous only
   - Mix

## Type Safety

7. **Type system:**
   - TypeScript (JavaScript)
   - Type hints (Python)
   - Strongly typed (Rust, Go, Java)
   - Runtime validation (Zod, Yup)
   - None (JavaScript)

8. **Type definitions:**
   - Bundled with package
   - @types package (DefinitelyTyped)
   - Not applicable

## Build and Distribution

9. **Build tool:**
   - tsup (TypeScript, simple)
   - esbuild (fast)
   - Rollup
   - Webpack
   - Vite
   - tsc (TypeScript compiler only)
   - Not needed (pure JS)

10. **Output format:**
    - ESM (modern)
    - CommonJS (Node.js)
    - UMD (universal)
    - Multiple formats

11. **Minification:**
    - Yes (production bundle)
    - No (source code)
    - Source + minified both

## Dependencies

12. **Dependency strategy:**
    - Zero dependencies (standalone)
    - Minimal dependencies
    - Standard dependencies OK

13. **Peer dependencies:**
    - Yes (e.g., React library requires React)
    - No

## Documentation

14. **Documentation approach:**
    - README only
    - API docs (JSDoc, TypeDoc)
    - Full docs site (VitePress, Docusaurus)
    - Examples repo
    - All of the above

## Testing

15. **Test framework:**
    - Jest (JavaScript)
    - Vitest (Vite-compatible)
    - Pytest (Python)
    - Cargo test (Rust)
    - Go test
    - Other: **\_\_\_**

16. **Test coverage goal:**
    - High (80%+)
    - Moderate (50-80%)
    - Critical paths only

## Versioning and Releases

17. **Versioning:**
    - Semantic versioning (semver)
    - Calendar versioning (calver)
    - Other

18. **Release automation:**
    - Changesets
    - Semantic Release
    - Manual
    - GitHub Releases
    - Other: **\_\_\_**

## Additional

19. **CLI included:** (if applicable)
    - Yes (command-line tool)
    - No (library only)

20. **Configuration:**
    - Config file (JSON, YAML)
    - Programmatic only
    - Both
    - None needed
