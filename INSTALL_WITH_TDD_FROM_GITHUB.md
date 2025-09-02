# Install BMAD with TDD Methodology from GitHub

This guide provides complete installation steps for BMAD-METHOD with the TDD methodology expansion pack directly from the GitHub fork.

## Prerequisites

- **Node.js:** v20+ required
- **Git:** For cloning repositories
- **NPM:** For package management
- **IDE:** Cursor, Windsurf, or compatible IDE (optional)

## Installation Methods

### Method 1: Direct Installation from GitHub Fork (Recommended)

This method installs your complete BMAD fork that includes the TDD methodology expansion pack.

```bash
# 1. Create new project directory
mkdir my-tdd-project && cd my-tdd-project

# 2. Clone the BMAD fork with TDD expansion
git clone https://github.com/vforvaick/BMAD-METHOD.git
cd BMAD-METHOD

# 3. Switch to the TDD methodology branch
git checkout expansion/tdd-methodology

# 4. Install dependencies
npm install

# 5. Build the framework (includes TDD expansion pack)
npm run build

# 6. Go back to project root and install BMAD from local clone
cd ..
node BMAD-METHOD/tools/installer/bin/bmad.js install --full

# 7. Install TDD expansion pack
cp -r BMAD-METHOD/expansion-packs/bmad-tdd-methodology .bmad-tdd-methodology

# 8. Set up development environment
npm init -y
npm install --save-dev jest

# 9. Create project structure
mkdir -p src tests stories

# 10. Update package.json test script
sed -i '' 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"test": "jest"/g' package.json
```

### Method 2: NPX Installation with GitHub TDD Expansion

This method uses official BMAD core with TDD expansion from GitHub.

```bash
# 1. Create project directory
mkdir my-tdd-project && cd my-tdd-project

# 2. Install BMAD core (official)
npx bmad-method install --full

# 3. Clone TDD expansion from GitHub
git clone https://github.com/vforvaick/BMAD-METHOD.git temp-bmad
cd temp-bmad && git checkout expansion/tdd-methodology && cd ..

# 4. Copy TDD expansion pack
cp -r temp-bmad/expansion-packs/bmad-tdd-methodology .bmad-tdd-methodology

# 5. Clean up temporary clone
rm -rf temp-bmad

# 6. Set up development environment
npm init -y
npm install --save-dev jest
mkdir -p src tests stories

# 7. Update package.json for Jest
sed -i '' 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"test": "jest"/g' package.json
```

### Method 3: Local Development Installation

For contributors working on the BMAD-METHOD itself.

```bash
# 1. Clone your fork
git clone https://github.com/vforvaick/BMAD-METHOD.git
cd BMAD-METHOD
git checkout expansion/tdd-methodology

# 2. Install development dependencies
npm install

# 3. Build the framework
npm run build

# 4. Create test project
cd ..
mkdir test-project && cd test-project

# 5. Install from local repository
node ../BMAD-METHOD/tools/installer/bin/bmad.js install --full
cp -r ../BMAD-METHOD/expansion-packs/bmad-tdd-methodology .bmad-tdd-methodology

# 6. Set up test environment
npm init -y
npm install --save-dev jest
mkdir -p src tests stories
```

## Post-Installation Setup

### 1. IDE Configuration (Optional)

If you installed with IDE support, your IDE should now have BMAD agent rules:

**Cursor:**

- Rules available in `.cursor/rules/bmad/`
- Use `@bmad Apply QA Agent (Quinn) persona` to activate TDD-enhanced QA agent

**Windsurf:**

- Workflows available in `.windsurf/workflows/`
- Access BMAD agents through workflow menu

### 2. Verify Installation

```bash
# Check BMAD core installation
ls -la .bmad-core

# Check TDD expansion installation
ls -la .bmad-tdd-methodology

# Verify TDD agents are available
cat .bmad-tdd-methodology/agents/qa.md | grep "tdd-start\|write-failing-tests"

# Test your setup
npm test
```

### 3. Create Your First TDD Story

```bash
# Copy TDD story template
cp .bmad-tdd-methodology/templates/story-tdd-template.md stories/1.1-my-first-story.md

# Edit the story file with your requirements
# Use your IDE or text editor to customize the template
```

## Available TDD Commands

Once installed, your enhanced QA agent supports these TDD-specific commands:

- `*tdd-start {story}` - Initialize TDD process for a story
- `*write-failing-tests {story}` - Create failing tests (Red phase)
- `*tdd-refactor {story}` - Participate in refactor phase
- `*help` - Show all available commands

## Project Structure After Installation

```
your-project/
├── .bmad-core/                 # Standard BMAD framework
├── .bmad-tdd-methodology/      # TDD expansion pack
│   ├── agents/                 # Enhanced QA & Dev agents
│   │   ├── qa.md              # TDD-enhanced QA agent
│   │   └── dev.md             # TDD-enhanced Dev agent
│   ├── tasks/                  # TDD-specific tasks
│   │   ├── write-failing-tests.md
│   │   └── tdd-refactor.md
│   ├── templates/              # TDD templates
│   │   └── story-tdd-template.md
│   └── config.yaml            # Expansion configuration
├── .cursor/                   # IDE rules (if configured)
├── .windsurf/                 # IDE workflows (if configured)
├── src/                       # Your source code
├── tests/                     # Your test files
├── stories/                   # User stories
└── package.json              # Project configuration
```

## Quick Start Example

Here's a complete example to get started quickly:

````bash
# 1. Create and setup project
mkdir calculator-tdd && cd calculator-tdd

# 2. Install BMAD + TDD from GitHub
git clone https://github.com/vforvaick/BMAD-METHOD.git temp-bmad
cd temp-bmad && git checkout expansion/tdd-methodology && cd ..

# 3. Install BMAD core
npx bmad-method install --full

# 4. Add TDD expansion
cp -r temp-bmad/expansion-packs/bmad-tdd-methodology .bmad-tdd-methodology
rm -rf temp-bmad

# 5. Setup development environment
npm init -y
npm install --save-dev jest
mkdir -p src tests stories
sed -i '' 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"test": "jest"/g' package.json

# 6. Create sample TDD story
cat > stories/1.1-calculator-add.md << 'EOF'
# Story 1.1: Calculator Addition

## Story Metadata
```yaml
story:
  epic: '1'
  number: '1.1'
  title: 'Calculator Addition'
  status: 'draft'
  priority: 'high'
tdd:
  status: 'red'
  cycle: 1
  coverage_target: 95.0
  tests: []
````

## Story Description

**As a** calculator user  
**I want** to add two numbers  
**So that** I can perform arithmetic calculations

## Acceptance Criteria

```gherkin
Scenario: Add two positive numbers
  Given I have numbers 5 and 3
  When I add them
  Then I should get 8
```

EOF

# 7. Verify installation

echo "✅ Installation complete! Your TDD-enabled BMAD project is ready."
echo "🚀 Next steps:"
echo " 1. Open your IDE in this directory"
echo " 2. Activate QA agent: @bmad Apply QA Agent (Quinn) persona"
echo " 3. Run: \*write-failing-tests 1.1"
echo " 4. Implement code to make tests pass"
echo " 5. Run: npm test"

````

## Troubleshooting

### Issue: TDD commands not available
**Solution:** Verify TDD expansion pack installation:
```bash
ls -la .bmad-tdd-methodology/agents/
cat .bmad-tdd-methodology/agents/qa.md | grep "tdd-start"
````

### Issue: Tests not running

**Solution:** Ensure Jest is configured:

```bash
npm install --save-dev jest
# Check package.json has "test": "jest"
```

### Issue: IDE not showing BMAD agents

**Solution:** Reinstall with IDE configuration:

```bash
npx bmad-method install --full -i cursor windsurf
```

## Contributing

If you want to contribute to the TDD methodology expansion:

1. Fork the repository: https://github.com/vforvaick/BMAD-METHOD
2. Create a feature branch from `expansion/tdd-methodology`
3. Make your changes
4. Test with the installation methods above
5. Submit a pull request

## Support

- **GitHub Issues:** https://github.com/vforvaick/BMAD-METHOD/issues
- **Original BMAD:** https://github.com/bmad-code-org/BMAD-METHOD
- **Documentation:** Check `.bmad-core/user-guide.md` after installation

---

**Installation Status:** Ready for use with complete TDD methodology support!  
**Last Updated:** 2025-09-02
