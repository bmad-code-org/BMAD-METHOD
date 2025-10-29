# Quick Command Reference

## Run All New Tests

```bash
npx jest test/unit/config-loader-advanced.test.js test/unit/manifest-advanced.test.js test/unit/ui-prompt-handler-advanced.test.js test/integration/installer-config-changes.test.js --verbose
```

## Run By Component

```bash
# ConfigLoader advanced tests
npx jest test/unit/config-loader-advanced.test.js --verbose

# Manifest advanced tests
npx jest test/unit/manifest-advanced.test.js --verbose

# PromptHandler advanced tests
npx jest test/unit/ui-prompt-handler-advanced.test.js --verbose

# Installer integration tests
npx jest test/integration/installer-config-changes.test.js --verbose
```

## Run All Tests (Including Original)

```bash
npx jest test/unit/ test/integration/ --verbose
```

## Watch Mode (Development)

```bash
npx jest test/unit/config-loader-advanced.test.js --watch
```

## Coverage Report

```bash
npx jest test/unit/ --coverage
```

## Quick Status Check

```bash
npx jest test/unit/config-loader-advanced.test.js test/unit/manifest-advanced.test.js test/unit/ui-prompt-handler-advanced.test.js test/integration/installer-config-changes.test.js --no-coverage
```
