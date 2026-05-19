#!/bin/bash
# install-bmad-memtrace.sh
# Installation script for BMad Memtrace Integration
# Aggressively cleans up the repository clone, preserving only necessary files.

# --- Interactive mode selection ---
# First step: confirm the user wants Memtrace (not Vanilla BMad).
while true; do
    echo ""
    echo "============================================"
    echo "  BMad-Memtrace Installation"
    echo "============================================"
    echo ""
    echo "This installer sets up the Memtrace-integrated fork of BMad Method."
    echo ""
    read -r -p "Choose mode [Memtrace / Vanilla]: " mode_choice || { echo "Error: Unexpected end of input. Aborting."; exit 1; }
    mode_choice=$(printf '%s' "$mode_choice" | tr '[:upper:]' '[:lower:]')
    case "$mode_choice" in
        memtrace)
            echo ""
            echo "Proceeding with Memtrace-integrated installation..."
            echo ""
            break
            ;;
        vanilla)
            echo ""
            echo "You selected Vanilla BMad Method."
            echo "This fork includes Memtrace structural analysis integration."
            echo "For the official BMad Method without Memtrace, clone:"
            echo "  https://github.com/bmad-code-org/BMAD-METHOD.git"
            echo ""
            echo "Installation aborted. No files were modified."
            exit 0
            ;;
        *)
            echo ""
            echo "Invalid choice: '${mode_choice}'. Please type 'Memtrace' or 'Vanilla'."
            echo ""
            ;;
    esac
done

set -e

echo "Starting BMad Memtrace standalone environment setup..."

INSTALL_DIR="bmad-install"

# Create a safe staging directory
echo "Creating staging directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Move essential files to the staging directory
echo "Copying core files to staging directory..."
[ -d "_bmad" ] && cp -a _bmad "$INSTALL_DIR/"
[ -d ".agents" ] && cp -a .agents "$INSTALL_DIR/"
[ -f "package.json" ] && cp -a package.json "$INSTALL_DIR/"
# Also copy docs if present
[ -d "docs" ] && cp -a docs "$INSTALL_DIR/"

# Remove explicit non-essential bmad cloned files and .git
echo "Cleaning up legacy clone files via git index..."
if [ -d .git ] && command -v git &> /dev/null; then
    # Use git to get the exact list of cloned files to guarantee precision
    git ls-files | while IFS= read -r file; do
        if [ "$file" != "install-bmad-memtrace.sh" ]; then
            rm -f "$file"
        fi
    done
else
    # Fallback if git is not available
    rm -f README.md LICENSE .gitignore .eslintrc.json tsconfig.json webpack.config.js || true
    rm -rf _bmad .agents package.json docs || true
fi

echo "Removing .git directory..."
rm -rf .git

# Cleanup any empty directories left behind
find . -type d -empty -delete 2>/dev/null || true

# Copy files back to the root of the project
echo "Restoring core files to root..."
# We use * to avoid copying the script over itself if it were in the staging dir,
# though we intentionally didn't stage it this time to prevent 'Text file busy' issues.
cp -a "$INSTALL_DIR"/* . 2>/dev/null || true

# Remove staging directory
echo "Removing staging directory..."
rm -rf "$INSTALL_DIR"

# Generate local workspace anchor file (.memtrace-workspace) to prevent 0-nodes errors
echo "Generating workspace anchor file..."
if [ ! -f .memtrace-workspace ]; then
    touch .memtrace-workspace
    echo "Created .memtrace-workspace anchor."
else
    echo ".memtrace-workspace anchor already exists."
fi

# Configure local MCP servers in Claude Desktop and OpenCode
if command -v node &> /dev/null; then
    echo "Configuring local MCP servers..."
    node _bmad/scripts/memtrace/inject-mcp-config.mjs --mode claude || echo "Warning: Failed to configure Claude Desktop config."
    node _bmad/scripts/memtrace/inject-mcp-config.mjs --mode opencode || echo "Warning: Failed to configure OpenCode config."
else
    echo "Warning: node command not found. Skipping MCP config injection."
    echo "To configure MCP manually, please run:"
    echo "  node _bmad/scripts/memtrace/inject-mcp-config.mjs --mode claude"
    echo "  node _bmad/scripts/memtrace/inject-mcp-config.mjs --mode opencode"
fi

echo "Cleanup and configuration complete! You now have a clean, standalone BMad-Memtrace runtime environment."
