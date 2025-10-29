# Test Fixtures for Issue #477

This directory contains test fixtures and mock data for testing the installer configuration loading and update detection.

## Manifest Fixtures

### valid-manifest.yaml

```yaml
version: 4.36.2
installed_at: '2025-08-12T23:51:04.439Z'
install_type: full
ides_setup:
  - claude-code
expansion_packs:
  - bmad-infrastructure-devops
```

### minimal-manifest.yaml

```yaml
version: 4.36.2
installed_at: '2025-08-12T23:51:04.439Z'
install_type: full
```

### old-version-manifest.yaml

```yaml
version: 4.30.0
installed_at: '2024-01-01T00:00:00.000Z'
install_type: full
ides_setup:
  - claude-code
```

### corrupted-manifest.yaml

```yaml
version: 4.36.2
installed_at: [invalid yaml format
install_type: full
```

## Test Data

### Manifest Versions

- v3.x: Old format with different field names
- v4.20.0: Initial v4 format
- v4.30.0: Added modern structure
- v4.36.2: Current format with ides_setup
- v4.39.2: Latest version for testing updates

### IDE Configurations

- claude-code
- cline
- roo
- github-copilot
- auggie
- codex
- qwen
- gemini

### Installation Types

- full: Complete installation
- minimal: Minimal setup
- custom: Custom configuration

### Expansion Packs

- bmad-infrastructure-devops
- bmad-c4-architecture
- custom-pack-1 (for testing)

## Using Test Fixtures

```javascript
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Load fixture
const fixturePath = path.join(__dirname, 'manifests', 'valid-manifest.yaml');
const fixture = yaml.load(fs.readFileSync(fixturePath, 'utf8'));
```

## Creating Temporary Test Fixtures

Tests create temporary manifests in:

```
test/fixtures/temp/loader-{timestamp}/
test/fixtures/temp/detector-{timestamp}/
test/fixtures/temp/update-{timestamp}/
test/fixtures/temp/invalid-{timestamp}/
test/fixtures/temp/compat-{timestamp}/
```

These are automatically cleaned up after each test.
