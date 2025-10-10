#!/usr/bin/env bash
# push-to-github.sh — helper to initialize git and push this workspace to GitHub
# Usage: chmod +x push-to-github.sh && ./push-to-github.sh

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

REMOTE_URL="https://github.com/babzstudios/bmad-mindscribe-demo.git"
BRANCH="v6-alpha"

echo "Repository root: $REPO_ROOT"

echo "Checking for existing git repo..."
if [ ! -d .git ]; then
  echo "Initializing new git repository..."
  git init
else
  echo "Git repo already initialized."
fi

# Ensure .gitignore exists
if [ ! -f .gitignore ]; then
  echo "Creating basic .gitignore"
  cat > .gitignore <<'GITIGNORE'
.env
node_modules/
.DS_Store
GITIGNORE
fi

# Add remote if missing or different
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_URL=$(git remote get-url origin)
  if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
    echo "Updating remote origin URL to: $REMOTE_URL"
    git remote set-url origin "$REMOTE_URL"
  else
    echo "Remote origin already set to $REMOTE_URL"
  fi
else
  echo "Adding remote origin: $REMOTE_URL"
  git remote add origin "$REMOTE_URL"
fi

# Create branch and commit
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  echo "Branch $BRANCH already exists locally"
else
  echo "Creating branch $BRANCH"
  git checkout -b $BRANCH
fi

# Add changes
echo "Adding files to commit..."
git add --all

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  echo "Committing changes..."
  git commit -m "Initial commit — journaling AI demo"
fi

# Push to remote
echo "Pushing branch $BRANCH to origin..."
# Use -u to set upstream
git push -u origin $BRANCH

echo "Push complete. Repository available at: $REMOTE_URL (on branch $BRANCH)"

# Remind about secrets
cat <<EOF

IMPORTANT:
- Ensure you did NOT commit any secrets (check .env, .env.local, credentials files).
- If you accidentally committed secrets, rotate them immediately and remove from git history.

Next steps:
- Create a Netlify site and connect this repository (branch: $BRANCH).
- Add Netlify environment variables (OPENAI_API_KEY, AWS keys, S3_BUCKET, LINKEDIN keys).
- Tell me when you've pushed and/or created the Netlify site and I will monitor the deploy and run smoke tests.
EOF
