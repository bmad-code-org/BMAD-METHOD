#!/bin/bash

# Setup script for git hooks
echo "Setting up git hooks..."

# Install husky
npm install --save-dev husky

# Initialize husky
npx husky init

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run validation checks before commit
echo "Running pre-commit checks..."

npm run validate
npm run format:check
npm run lint

if [ $? -ne 0 ]; then
  echo "❌ Pre-commit checks failed. Please fix the issues before committing."
  echo "   Run 'npm run format' to fix formatting issues"
  echo "   Run 'npm run lint:fix' to fix some lint issues"
  exit 1
fi

echo "✅ Pre-commit checks passed!"
EOF

chmod +x .husky/pre-commit

echo "✅ Git hooks setup complete!"
echo "Now commits will be validated before they're created."