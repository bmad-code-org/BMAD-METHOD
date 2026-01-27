# Verification Patterns

<overview>
Existence ≠ Implementation. A file existing does not mean the feature works.

**Verification levels:**
1. **Exists** - File is present
2. **Substantive** - Content is real, not placeholder
3. **Wired** - Connected to rest of system
4. **Functional** - Actually works when invoked
</overview>

<stub_detection>
## Detecting Stubs and Placeholders

```bash
# Comment-based stubs
grep -E "(TODO|FIXME|XXX|PLACEHOLDER)" "$file"
grep -E "implement|add later|coming soon" "$file" -i

# Empty implementations
grep -E "return null|return undefined|return \{\}|return \[\]" "$file"
grep -E "console\.(log|warn).*only" "$file"

# Placeholder text
grep -E "placeholder|lorem ipsum|sample data" "$file" -i
```

**Red flags in code:**
```typescript
// STUBS - Not real implementations:
return <div>Placeholder</div>
onClick={() => {}}
export async function POST() { return Response.json({ ok: true }) }
```
</stub_detection>

<file_verification>
## File Verification Commands

**React Components:**
```bash
# Exists and exports component
[ -f "$file" ] && grep -E "export.*function|export const.*=" "$file"

# Has real JSX (not null/empty)
grep -E "return.*<" "$file" | grep -v "return.*null"

# Uses props/state (not static)
grep -E "props\.|useState|useEffect" "$file"
```

**API Routes:**
```bash
# Exports HTTP handlers
grep -E "export.*(GET|POST|PUT|DELETE)" "$file"

# Has database interaction
grep -E "prisma\.|db\.|query|find|create" "$file"

# Has error handling
grep -E "try|catch|throw" "$file"
```

**Tests:**
```bash
# Test file exists
[ -f "$test_file" ]

# Has test cases
grep -E "it\(|test\(|describe\(" "$test_file"

# Not all skipped
grep -c "\.skip" "$test_file"
```
</file_verification>

<quality_commands>
## Quality Check Commands

```bash
# Type check - zero errors
npm run type-check
echo "Exit code: $?"

# Lint - zero errors/warnings
npm run lint 2>&1 | tail -5

# Tests - all passing
npm test 2>&1 | grep -E "pass|fail|error" -i | tail -10

# Build - succeeds
npm run build 2>&1 | tail -5
```

**All must return exit code 0.**
</quality_commands>

<wiring_checks>
## Wiring Verification

**Component → API:**
```bash
# Check component calls the API
grep -E "fetch\(['\"].*$api_path|axios.*$api_path" "$component"
```

**API → Database:**
```bash
# Check API queries database
grep -E "await.*prisma|await.*db\." "$route"
```

**Form → Handler:**
```bash
# Check form has real submit handler
grep -A 5 "onSubmit" "$component" | grep -E "fetch|axios|mutate"
```
</wiring_checks>

<verdict_format>
## Verdict Format

```markdown
## VALIDATION RESULT

**Status:** PASS | FAIL

### Evidence
- Type check: PASS (0 errors)
- Lint: PASS (0 warnings)
- Build: PASS
- Tests: 45/45 passing

### Files Verified
- path/to/file.ts ✓
- path/to/other.ts ✓

### Failures (if FAIL)
1. [CRITICAL] Missing file: src/api/route.ts
2. [HIGH] Type error in lib/auth.ts:45
```
</verdict_format>
