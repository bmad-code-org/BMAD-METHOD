# Step 2: Systematic Codebase Gap Analysis

## Goal
VERIFY what code actually exists vs what's missing using Glob and Read tools.

## CRITICAL
This step uses ACTUAL file system tools to generate TRUTHFUL gap analysis.
No guessing. No inference. VERIFY with tools.

## Execution

### 1. Scan Target Directories

**For each target directory identified in Step 1:**

```bash
# List all TypeScript files
Glob: {target_dir}/src/**/*.ts
Glob: {target_dir}/src/**/*.tsx

# Store file list
```

**Output:**
```
📁 Codebase Scan Results for {target_dir}

Found {count} TypeScript files:
  - {file1}
  - {file2}
  ...
```

### 2. Check for Specific Required Components

**Based on story Acceptance Criteria, check if required files exist:**

**Example for Auth Story:**
```bash
# Check for OAuth endpoints
Glob: {target_dir}/src/auth/controllers/*bridgeid*.ts
Result: ❌ MISSING (0 files found)

# Check for BridgeID client
Glob: {target_dir}/src/bridgeid/**/*.ts
Result: ✅ EXISTS (found: bridgeid-client.service.ts, bridgeid-sync.service.ts)

# Check for permission guards
Glob: {target_dir}/src/auth/guards/permissions*.ts
Result: ❌ MISSING (0 files found)

# Check for decorators
Glob: {target_dir}/src/auth/decorators/*permission*.ts
Result: ❌ MISSING (0 files found)
```

### 3. Verify Implementation Depth

**For files that exist, read them to check if MOCKED or REAL:**

```bash
# Read key implementation file
Read: {target_dir}/src/bridgeid/services/bridgeid-client.service.ts

# Search for indicators:
- Contains "MOCK" or "mock" → ⚠️ MOCKED (needs real implementation)
- Contains "TODO" → ⚠️ INCOMPLETE
- Contains real HTTP client (axios) → ✅ IMPLEMENTED
```

### 4. Check Dependencies

```bash
# Read package.json
Read: {target_dir}/package.json

# Verify required dependencies exist:
Required: axios
Found in package.json? → ❌ NO (needs to be added)

Required: @aws-sdk/client-secrets-manager
Found in package.json? → ❌ NO (needs to be added)
```

### 5. Check Test Coverage

```bash
# Find test files
Glob: {target_dir}/src/**/*.spec.ts
Glob: {target_dir}/test/**/*.test.ts

# Count tests
Found {test_count} test files

# Check for specific test coverage
Glob: {target_dir}/src/**/*bridgeid*.spec.ts
Result: ✅ EXISTS (found 3 test files)
```

### 6. Generate Truthful Gap Analysis

**Create structured gap analysis:**

```markdown
## Gap Analysis: Current State vs Requirements

**✅ IMPLEMENTED (Verified by Codebase Scan):**

1. **BridgeID Client Infrastructure** - MOCKED (needs real HTTP)
   - File: src/bridgeid/services/bridgeid-client.service.ts ✅ EXISTS
   - Implementation: Mock user data with circuit breaker
   - Status: ⚠️ PARTIAL - Ready for real HTTP client
   - Tests: 15 tests passing ✅

2. **User Synchronization Service**
   - File: src/bridgeid/services/bridgeid-sync.service.ts ✅ EXISTS
   - Implementation: Bulk sync BridgeID → admin_users
   - Status: ✅ COMPLETE
   - Tests: 6 tests passing ✅

3. **Role Mapping Logic**
   - File: src/bridgeid/constants/role-mapping.constants.ts ✅ EXISTS
   - Implementation: 7-tier role mapping with priority selection
   - Status: ✅ COMPLETE
   - Tests: 10 tests passing ✅

**❌ MISSING (Required for AC Completion):**

1. **BridgeID OAuth Endpoints**
   - File: src/auth/controllers/bridgeid-auth.controller.ts ❌ NOT FOUND
   - Need: POST /api/auth/bridgeid/login endpoint
   - Need: GET /api/auth/bridgeid/callback endpoint
   - Status: ❌ NOT IMPLEMENTED

2. **Permission Guards**
   - File: src/auth/guards/permissions.guard.ts ❌ NOT FOUND
   - File: src/auth/decorators/require-permissions.decorator.ts ❌ NOT FOUND
   - Status: ❌ NOT IMPLEMENTED

3. **Real OAuth HTTP Client**
   - Package: axios ❌ NOT in package.json
   - Package: @aws-sdk/client-secrets-manager ❌ NOT in package.json
   - Status: ❌ DEPENDENCIES NOT ADDED
```

### 7. Update Acceptance Criteria Checkboxes

**Based on verified gap analysis, mark checkboxes:**

```markdown
### AC1: BridgeID OAuth Integration
- [ ] OAuth login endpoint (VERIFIED MISSING - file not found)
- [ ] OAuth callback endpoint (VERIFIED MISSING - file not found)
- [ ] Client configuration (VERIFIED PARTIAL - exists but mocked)

### AC3: RBAC Permission System
- [x] Role mapping defined (VERIFIED COMPLETE - file exists, tests pass)
- [ ] Permission guard (VERIFIED MISSING - file not found)
- [ ] Permission decorator (VERIFIED MISSING - file not found)
```

**Checkboxes are now FACTS, not guesses.**

### 8. Present Gap Analysis

**Output:**
```
✅ Codebase Scan Complete

Scanned: apps/backend/admin-user-service/
Files found: 47 TypeScript files
Tests found: 31 test files

Gap Analysis Generated:
  ✅ 7 components IMPLEMENTED (verified)
  ❌ 6 components MISSING (verified)
  ⚠️ 1 component PARTIAL (needs completion)

Story checkboxes updated based on verified file existence.

[C] Continue to Story Generation
```

**WAIT for user to continue.**
