# Epic Execute - Dependencies & Setup

This document describes the required and optional dependencies for running the `epic-execute.sh` script and its library modules.

## Required Dependencies

### Core Requirements

| Package | Purpose | Installation |
|---------|---------|--------------|
| `bash` | Shell interpreter (v4.0+) | Pre-installed on macOS/Linux |
| `git` | Version control operations | Pre-installed or `brew install git` |
| `claude` | Claude Code CLI for AI-powered execution | `npm install -g @anthropic-ai/claude-code` |

### Required CLI Tools

| Tool | Purpose | macOS | Linux (Debian/Ubuntu) |
|------|---------|-------|----------------------|
| `timeout` | Command timeout handling | `brew install coreutils` (use `gtimeout`) | Pre-installed |
| `sed` | Text processing | Pre-installed (BSD) | Pre-installed (GNU) |
| `grep` | Pattern matching | Pre-installed | Pre-installed |
| `awk` | Text processing | Pre-installed | Pre-installed |
| `date` | Timestamp generation | Pre-installed | Pre-installed |
| `wc` | Character/line counting | Pre-installed | Pre-installed |

## Recommended Dependencies

These tools enhance functionality but have fallback behavior if missing:

### yq (YAML Processing)

**Strongly Recommended** - Used for YAML file manipulation (metrics, story status updates).

```bash
# macOS (Homebrew)
brew install yq

# Linux (Go version - recommended)
go install github.com/mikefarah/yq/v4@latest

# Linux (snap)
snap install yq

# Linux (wget binary)
wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/local/bin/yq
chmod +x /usr/local/bin/yq
```

**Important:** The script expects the [mikefarah/yq](https://github.com/mikefarah/yq) Go version (v4+), NOT the Python `yq` (kislyuk/yq). The Python version has different syntax and will trigger fallback mode.

Without `yq`:
- YAML updates use `sed` fallback (less reliable)
- Metrics updates may be deferred
- Story status updates may fail silently

### jq (JSON Processing)

**Recommended** - Used for JSON output parsing from Claude responses.

```bash
# macOS
brew install jq

# Linux (Debian/Ubuntu)
apt-get install jq

# Linux (RHEL/CentOS)
yum install jq
```

Without `jq`:
- JSON parsing falls back to regex patterns (less accurate)
- Some structured output extraction may fail

### xmllint (XML Validation)

**Optional** - Used for validating XML workflow files.

```bash
# macOS
# Pre-installed as part of libxml2

# Linux (Debian/Ubuntu)
apt-get install libxml2-utils

# Linux (RHEL/CentOS)
yum install libxml2
```

Without `xmllint`:
- XML validation uses basic pattern matching
- Invalid XML may not be detected until runtime

## Project-Specific Test Runners

The regression gate module auto-detects project type and requires the appropriate test runner:

| Project Type | Detection File | Required Tool |
|--------------|----------------|---------------|
| Node.js/TypeScript | `package.json` | `npm` (with `test` script) |
| Rust | `Cargo.toml` | `cargo` |
| Go | `go.mod` | `go` |
| Python | `requirements.txt` or `pyproject.toml` | `pytest` |

## Quick Setup Script

Run this to check and install all dependencies on macOS:

```bash
#!/bin/bash
# epic-execute-setup.sh

echo "Checking epic-execute dependencies..."

# Check required tools
for tool in git bash; do
    if command -v $tool >/dev/null 2>&1; then
        echo "✓ $tool installed"
    else
        echo "✗ $tool NOT FOUND - please install"
    fi
done

# Check Claude CLI
if command -v claude >/dev/null 2>&1; then
    echo "✓ claude CLI installed"
else
    echo "✗ claude CLI NOT FOUND"
    echo "  Install with: npm install -g @anthropic-ai/claude-code"
fi

# Check yq (Go version)
if command -v yq >/dev/null 2>&1; then
    if yq --version 2>&1 | grep -qE "(mikefarah|version.*v4)"; then
        echo "✓ yq (Go version) installed"
    else
        echo "⚠ yq installed but may be Python version - recommend Go version"
        echo "  Install with: brew install yq"
    fi
else
    echo "⚠ yq NOT FOUND - YAML updates will use sed fallback"
    echo "  Install with: brew install yq"
fi

# Check jq
if command -v jq >/dev/null 2>&1; then
    echo "✓ jq installed"
else
    echo "⚠ jq NOT FOUND - JSON parsing will use regex fallback"
    echo "  Install with: brew install jq"
fi

# Check xmllint
if command -v xmllint >/dev/null 2>&1; then
    echo "✓ xmllint installed"
else
    echo "⚠ xmllint NOT FOUND - XML validation will be limited"
fi

# Check timeout (coreutils on macOS)
if command -v timeout >/dev/null 2>&1 || command -v gtimeout >/dev/null 2>&1; then
    echo "✓ timeout command available"
else
    echo "⚠ timeout NOT FOUND"
    echo "  Install with: brew install coreutils"
fi

echo ""
echo "Dependency check complete."
```

## Environment Variables

The script respects these environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `CLAUDE_TIMEOUT` | `600` | Timeout in seconds for Claude invocations |
| `MAX_PROMPT_SIZE` | `150000` | Maximum prompt size in bytes |
| `RETRY_MAX_ATTEMPTS` | `3` | Max retry attempts for transient failures |
| `RETRY_INITIAL_DELAY` | `5` | Initial retry delay in seconds |
| `RETRY_MAX_DELAY` | `60` | Maximum retry delay in seconds |
| `PROTECTED_BRANCHES` | `main master` | Branches that block direct commits |
| `VERBOSE` | `false` | Enable verbose logging |

## Directory Structure & Path Configuration

The `epic-execute.sh` script expects specific directory structures in your project. Before running, inspect your repository and ensure paths are configured correctly.

### BMAD-METHOD Repository Structure

The script sources BMAD workflows from these locations relative to the script:

```
BMAD-METHOD/
├── scripts/
│   ├── epic-execute.sh              # Main script
│   └── epic-execute-lib/            # Library modules
│       ├── utils.sh
│       ├── json-output.sh
│       ├── decision-log.sh
│       ├── design-phase.sh
│       ├── tdd-flow.sh
│       └── regression-gate.sh
└── src/
    ├── bmm-skills/                          # Upstream skill-based workflows (v6.1+)
    │   └── 4-implementation/
    │       ├── bmad-dev-story/             # Dev phase skill
    │       │   ├── SKILL.md
    │       │   └── checklist.md
    │       └── bmad-code-review/           # Review phase skill
    │           ├── SKILL.md
    │           └── steps/
    └── bmm/                                 # Our automation workflows
        └── workflows/
            └── 4-implementation/
                └── epic-execute/            # Quality gate steps
                    ├── steps/
                    │   ├── step-02b-arch-compliance.md
                    │   ├── step-03b-test-quality.md
                    │   ├── step-03c-traceability.md
                    │   └── step-04-generate-uat.md
                    └── templates/
                        └── uat-template.md
```

### Target Project Structure

The script expects your **target project** (where stories are implemented) to have:

```
your-project/
├── docs/
│   ├── stories/           # Story markdown files (e.g., 1-1-feature.md)
│   ├── epics/             # Epic definition files
│   ├── sprints/           # Sprint planning files
│   ├── sprint-artifacts/  # Generated metrics, checkpoints, decision logs
│   │   ├── metrics/
│   │   ├── traceability/
│   │   └── test-specs/
│   └── uat/               # Generated UAT documents
└── bmad/                  # Optional: local BMAD configuration
```

### Path Resolution

The script determines paths as follows:

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"    # Two levels up from script
BMAD_SRC_DIR="$SCRIPT_DIR/.."                       # One level up (scripts parent)
```

**Important:** If you install BMAD-METHOD differently (e.g., as a submodule, npm package, or symlink), you may need to adjust `PROJECT_ROOT` detection in `epic-execute.sh` lines 104-106.

### Inspecting Your Setup

Before first run, verify your paths:

```bash
# From your target project root, check BMAD-METHOD location
ls -la ./node_modules/bmad-method/scripts/ 2>/dev/null || \
ls -la ./bmad-method/scripts/ 2>/dev/null || \
echo "BMAD-METHOD not found - check installation"

# Verify workflow files exist
BMAD_PATH="<path-to-bmad-method>"
ls -la "$BMAD_PATH/src/bmm-skills/4-implementation/bmad-dev-story/SKILL.md"
ls -la "$BMAD_PATH/src/bmm-skills/4-implementation/bmad-code-review/SKILL.md"
ls -la "$BMAD_PATH/src/bmm/workflows/4-implementation/epic-execute/"

# Verify your project has required directories
ls -la ./docs/stories/
ls -la ./docs/epics/
```

### Creating Missing Directories

If your project doesn't have the expected structure:

```bash
# Create required directories
mkdir -p docs/{stories,epics,sprints,sprint-artifacts,uat}
mkdir -p docs/sprint-artifacts/{metrics,traceability,test-specs}
```

## Verification

After installing dependencies, verify the setup:

```bash
# Run the script with --dry-run to verify setup
./scripts/epic-execute.sh <epic-id> --dry-run --verbose
```

The verbose output will show:
- Platform detection
- yq availability and version
- Protected branch configuration
- Workflow file validation results
- Missing workflow files (if any)
