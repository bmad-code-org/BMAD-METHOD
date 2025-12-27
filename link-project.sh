#!/bin/bash
# BMAD Project Linker
# Links external projects to this BMAD-METHOD installation
# Usage: ./link-project.sh <target-project-path>

set -e

BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD"
TARGET_PROJECT="$1"

if [ -z "$TARGET_PROJECT" ]; then
    echo "❌ Usage: ./link-project.sh <target-project-path>"
    echo ""
    echo "Example: ./link-project.sh /Users/hbl/Documents/hbl-documents"
    exit 1
fi

# Resolve absolute path
TARGET_PROJECT=$(cd "$TARGET_PROJECT" && pwd)

echo "🔗 BMAD Project Linker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BMAD Home: $BMAD_HOME"
echo "Target Project: $TARGET_PROJECT"
echo ""

# Check if target exists
if [ ! -d "$TARGET_PROJECT" ]; then
    echo "❌ Target project directory does not exist: $TARGET_PROJECT"
    exit 1
fi

# Backup existing BMAD directories if they exist
echo "🔍 Checking for existing BMAD installations..."
if [ -d "$TARGET_PROJECT/bmad" ]; then
    BACKUP_DIR="$TARGET_PROJECT/bmad.backup.$(date +%Y%m%d-%H%M%S)"
    echo "⚠️  Found existing bmad/ directory"
    echo "📦 Backing up to: $BACKUP_DIR"
    mv "$TARGET_PROJECT/bmad" "$BACKUP_DIR"
fi

# Create symlinks
echo ""
echo "🔗 Creating symlinks..."

cd "$TARGET_PROJECT"

# Link bmad directory
ln -s "$BMAD_HOME/bmad" bmad
echo "✅ Linked: bmad/ → $BMAD_HOME/bmad"

# Handle .claude directory - preserve project-specific content
if [ -d "$TARGET_PROJECT/.claude" ]; then
    echo "📁 Found existing .claude/ directory - preserving project-specific content"

    # Backup and symlink commands subdirectory
    if [ -d "$TARGET_PROJECT/.claude/commands" ] && [ ! -L "$TARGET_PROJECT/.claude/commands" ]; then
        mv "$TARGET_PROJECT/.claude/commands" "$TARGET_PROJECT/.claude/commands-local"
        echo "📦 Backed up: .claude/commands → .claude/commands-local"
    fi

    if [ ! -e "$TARGET_PROJECT/.claude/commands" ]; then
        ln -s "$BMAD_HOME/.claude/commands" "$TARGET_PROJECT/.claude/commands"
        echo "✅ Linked: .claude/commands/ → $BMAD_HOME/.claude/commands"
    else
        echo "ℹ️  .claude/commands symlink already exists"
    fi
else
    # No existing .claude - symlink the entire directory
    ln -s "$BMAD_HOME/.claude" .claude
    echo "✅ Linked: .claude/ → $BMAD_HOME/.claude"
fi

# Create a marker file to indicate this is a linked project
cat > .bmad-linked << EOF
# BMAD Linked Project
This project is linked to the main BMAD installation at:
$BMAD_HOME

Linked on: $(date)

To unlink:
  rm bmad .bmad-linked
  rm .claude/commands  # if .claude was preserved
  # OR: rm .claude     # if entire .claude was symlinked

To update BMAD (update the main installation):
  cd $BMAD_HOME
  npm run update:bmad
EOF

echo "✅ Created: .bmad-linked (marker file)"

# Add to .gitignore if it exists
if [ -f "$TARGET_PROJECT/.gitignore" ]; then
    if ! grep -q "^bmad$" "$TARGET_PROJECT/.gitignore"; then
        echo "" >> "$TARGET_PROJECT/.gitignore"
        echo "# BMAD symlinks (linked to $BMAD_HOME)" >> "$TARGET_PROJECT/.gitignore"
        echo "bmad" >> "$TARGET_PROJECT/.gitignore"
        echo ".bmad-linked" >> "$TARGET_PROJECT/.gitignore"
        # Only add .claude if it's a symlink (not if we preserved existing)
        if [ -L "$TARGET_PROJECT/.claude" ]; then
            echo ".claude" >> "$TARGET_PROJECT/.gitignore"
        fi
        echo "✅ Updated: .gitignore"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Project linked successfully!"
echo ""
echo "Your project now has access to all BMAD agents and workflows."
echo "To update BMAD for ALL linked projects, just update the main installation:"
echo "  cd $BMAD_HOME"
echo "  npm run update:bmad"
echo ""
