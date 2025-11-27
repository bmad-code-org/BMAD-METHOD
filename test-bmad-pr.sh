#!/usr/bin/env bash
#
# BMAD PR Testing Script
# Interactive script to test BMAD PR #934 with AgentVibes integration
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.test-bmad-config"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎙️  BMAD AgentVibes Party Mode Testing Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}What this script does:${NC}"
echo ""
echo "  This script automates the process of testing BMAD's AgentVibes"
echo "  integration (PR #934), which adds multi-agent party mode with"
echo "  unique voices for each BMAD agent."
echo ""
echo -e "${BLUE}The script will:${NC}"
echo ""
echo "  1. Clone the BMAD repository"
echo "  2. Checkout the PR branch with party mode features"
echo "  3. Install BMAD CLI tools locally"
echo "  4. Create a test BMAD project"
echo "  5. Run BMAD installer (automatically installs AgentVibes)"
echo "  6. Verify the installation"
echo ""
echo -e "${YELLOW}Prerequisites:${NC}"
echo "  • Node.js and npm installed"
echo "  • Git installed"
echo "  • ~500MB free disk space"
echo "  • 10-15 minutes for complete setup"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Ready to continue? [Y/n]: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ -n $REPLY ]]; then
    echo "❌ Setup cancelled"
    exit 0
fi

clear

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Testing Mode Selection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Choose how you want to test:"
echo ""
echo "  1) Test official BMAD PR #934 (recommended for most users)"
echo "     • Uses: github.com/bmad-code-org/BMAD-METHOD"
echo "     • Branch: PR #934 (agentvibes-party-mode)"
echo "     • Best for: Testing the official PR before it's merged"
echo ""
echo "  2) Test your forked repository"
echo "     • Uses: Your GitHub fork"
echo "     • Branch: Your custom branch (you choose)"
echo "     • Best for: Testing your own changes or modifications"
echo ""

# Load saved config if it exists
SAVED_MODE=""
SAVED_FORK=""
SAVED_BRANCH=""
SAVED_TEST_DIR=""
if [[ -f "$CONFIG_FILE" ]]; then
    source "$CONFIG_FILE"
fi

if [[ -n "$SAVED_MODE" ]]; then
    echo -e "${BLUE}Last used: Mode $SAVED_MODE${NC}"
    [[ -n "$SAVED_FORK" ]] && echo "  Fork: $SAVED_FORK"
    [[ -n "$SAVED_BRANCH" ]] && echo "  Branch: $SAVED_BRANCH"
    echo ""
fi

read -p "Select mode [1/2]: " MODE_CHOICE
echo ""

# Validate mode choice
while [[ ! "$MODE_CHOICE" =~ ^[12]$ ]]; do
    echo -e "${RED}Invalid choice. Please enter 1 or 2.${NC}"
    read -p "Select mode [1/2]: " MODE_CHOICE
    echo ""
done

# Configure based on mode
if [[ "$MODE_CHOICE" == "1" ]]; then
    # Official PR mode
    REPO_URL="https://github.com/bmad-code-org/BMAD-METHOD.git"
    BRANCH_NAME="agentvibes-party-mode"
    FETCH_PR=true

    echo -e "${GREEN}✓ Using official BMAD repository${NC}"
    echo "  Repository: $REPO_URL"
    echo "  Will fetch: PR #934 into branch '$BRANCH_NAME'"
    echo ""
else
    # Fork mode
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🍴 Fork Configuration"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if [[ -n "$SAVED_FORK" ]]; then
        read -p "GitHub fork URL [$SAVED_FORK]: " FORK_INPUT
        REPO_URL="${FORK_INPUT:-$SAVED_FORK}"
    else
        echo "Enter your forked repository URL:"
        echo "(e.g., https://github.com/yourusername/BMAD-METHOD.git)"
        read -p "Fork URL: " REPO_URL
    fi
    echo ""

    if [[ -n "$SAVED_BRANCH" ]]; then
        read -p "Branch name [$SAVED_BRANCH]: " BRANCH_INPUT
        BRANCH_NAME="${BRANCH_INPUT:-$SAVED_BRANCH}"
    else
        echo "Enter the branch name to test:"
        echo "(e.g., agentvibes-party-mode, main, feature-xyz)"
        read -p "Branch: " BRANCH_NAME
    fi
    echo ""

    FETCH_PR=false

    echo -e "${GREEN}✓ Using your fork${NC}"
    echo "  Repository: $REPO_URL"
    echo "  Branch: $BRANCH_NAME"
    echo ""
fi

# Ask for test directory
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Test Directory"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [[ -n "$SAVED_TEST_DIR" ]]; then
    read -p "Test directory [$SAVED_TEST_DIR]: " TEST_DIR
    TEST_DIR="${TEST_DIR:-$SAVED_TEST_DIR}"
else
    DEFAULT_DIR="$HOME/bmad-pr-test-$(date +%Y%m%d-%H%M%S)"
    echo "Where should we create the test environment?"
    read -p "Test directory [$DEFAULT_DIR]: " TEST_DIR
    TEST_DIR="${TEST_DIR:-$DEFAULT_DIR}"
fi

# Expand ~ to actual home directory
TEST_DIR="${TEST_DIR/#\~/$HOME}"

echo ""

# Save configuration
echo "SAVED_MODE=\"$MODE_CHOICE\"" > "$CONFIG_FILE"
[[ "$MODE_CHOICE" == "2" ]] && echo "SAVED_FORK=\"$REPO_URL\"" >> "$CONFIG_FILE"
[[ "$MODE_CHOICE" == "2" ]] && echo "SAVED_BRANCH=\"$BRANCH_NAME\"" >> "$CONFIG_FILE"
echo "SAVED_TEST_DIR=\"$TEST_DIR\"" >> "$CONFIG_FILE"
echo -e "${GREEN}✓ Configuration saved${NC}"
echo ""

# Confirm before starting
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Repository:  $REPO_URL"
echo "  Branch:      $BRANCH_NAME"
echo "  Test dir:    $TEST_DIR"
echo ""
read -p "Proceed with setup? [Y/n]: " -n 1 -r
echo
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ -n $REPLY ]]; then
    echo "❌ Setup cancelled"
    exit 0
fi

# Clean up old test directory if it exists
if [[ -d "$TEST_DIR" ]]; then
    echo "⚠️  Test directory already exists: $TEST_DIR"
    read -p "Delete and recreate? [Y/n]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        rm -rf "$TEST_DIR"
        echo -e "${GREEN}✓ Deleted old test directory${NC}"
    else
        echo -e "${YELLOW}⚠ Using existing directory (may have stale data)${NC}"
    fi
    echo ""
fi

clear

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Clone repository
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📥 Step 1/6: Cloning repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"
git clone "$REPO_URL" BMAD-METHOD
cd BMAD-METHOD
echo ""
echo -e "${GREEN}✓ Repository cloned${NC}"
echo ""

# Step 2: Checkout branch (different logic for PR vs fork)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔀 Step 2/6: Checking out branch"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [[ "$FETCH_PR" == true ]]; then
    # Fetch PR from upstream
    echo "Fetching PR #934 from upstream..."
    git remote add upstream https://github.com/bmad-code-org/BMAD-METHOD.git
    git fetch upstream pull/934/head:$BRANCH_NAME
    git checkout $BRANCH_NAME
    echo ""
    echo -e "${GREEN}✓ Checked out PR branch: $BRANCH_NAME${NC}"
else
    # Just checkout the specified branch from fork
    git checkout $BRANCH_NAME
    echo ""
    echo -e "${GREEN}✓ Checked out branch: $BRANCH_NAME${NC}"
fi
echo ""

# Step 3: Install BMAD CLI
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 3/6: Installing BMAD CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cd tools/cli
npm install
echo ""
echo -e "${GREEN}✓ BMAD CLI dependencies installed${NC}"
echo ""

# Step 4: Create test project
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Step 4/6: Creating test project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cd "$TEST_DIR"
mkdir -p bmad-project
cd bmad-project
echo -e "${GREEN}✓ Test project directory created${NC}"
echo "  Location: $TEST_DIR/bmad-project"
echo ""

# Step 5: Run BMAD installer (includes AgentVibes setup)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  Step 5/6: Running BMAD installer with AgentVibes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Important: When prompted during installation:${NC}"
echo -e "  • Enable TTS for agents? → ${GREEN}Yes${NC}"
echo -e "  • Assign unique voices for party mode? → ${GREEN}Yes${NC}"
echo ""
echo -e "${YELLOW}AgentVibes will start automatically after BMAD installation.${NC}"
echo -e "${YELLOW}Recommended TTS settings:${NC}"
echo -e "  • Provider: ${GREEN}Piper${NC} (free, local TTS)"
echo -e "  • Download voices: ${GREEN}Yes${NC}"
echo ""
read -p "Press Enter to start BMAD installer..."
node "$TEST_DIR/BMAD-METHOD/tools/cli/bin/bmad.js" install

echo ""
echo -e "${GREEN}✓ BMAD and AgentVibes installation complete${NC}"
echo ""

# Step 6: Verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Step 6/6: Verifying installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VERIFICATION_PASSED=true

# Check for voice map file
if [[ -f ".bmad/_cfg/agent-voice-map.csv" ]]; then
    echo -e "${GREEN}✓ Voice map file created${NC}"
    echo "  Location: .bmad/_cfg/agent-voice-map.csv"
    echo ""
    echo "  Voice assignments:"
    cat .bmad/_cfg/agent-voice-map.csv | sed 's/^/    /'
    echo ""
else
    echo -e "${RED}✗ Voice map file NOT found${NC}"
    echo "  Expected: .bmad/_cfg/agent-voice-map.csv"
    echo "  ${YELLOW}Warning: Agents may not have unique voices!${NC}"
    echo ""
    VERIFICATION_PASSED=false
fi

# Check for AgentVibes hooks
if [[ -f ".claude/hooks/bmad-speak.sh" ]]; then
    echo -e "${GREEN}✓ BMAD TTS hooks installed${NC}"
    echo "  Location: .claude/hooks/bmad-speak.sh"
else
    echo -e "${RED}✗ BMAD TTS hooks NOT found${NC}"
    echo "  Expected: .claude/hooks/bmad-speak.sh"
    VERIFICATION_PASSED=false
fi
echo ""

# Check for Piper installation
if command -v piper &> /dev/null; then
    PIPER_VERSION=$(piper --version 2>&1 || echo "unknown")
    echo -e "${GREEN}✓ Piper TTS installed${NC}"
    echo "  Version: $PIPER_VERSION"
elif [[ -f ".agentvibes/providers/piper/piper" ]]; then
    echo -e "${GREEN}✓ Piper TTS installed (local)${NC}"
    echo "  Location: .agentvibes/providers/piper/piper"
else
    echo -e "${YELLOW}⚠ Piper not detected${NC}"
    echo "  (May still work if using ElevenLabs)"
fi
echo ""

# Final status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ "$VERIFICATION_PASSED" == true ]]; then
    echo -e "${GREEN}🎉 Setup Complete - All Checks Passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Setup Complete - With Warnings${NC}"
    echo ""
    echo "Some verification checks failed. The installation may still work,"
    echo "but you might experience issues with party mode voices."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "  1. Navigate to test project:"
echo -e "     ${GREEN}cd $TEST_DIR/bmad-project${NC}"
echo ""
echo "  2. Start Claude session:"
echo -e "     ${GREEN}claude${NC}"
echo ""
echo "  3. Test party mode:"
echo -e "     ${GREEN}/bmad:core:workflows:party-mode${NC}"
echo ""
echo "  4. Verify each agent speaks with a unique voice!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Troubleshooting:${NC}"
echo ""
echo "  • No audio? Check: .claude/hooks/play-tts.sh exists"
echo "  • Same voice for all agents? Check: .bmad/_cfg/agent-voice-map.csv"
echo "  • Test current voice: /agent-vibes:whoami"
echo "  • List available voices: /agent-vibes:list"
echo ""
echo -e "${BLUE}Report Issues:${NC}"
echo "  https://github.com/bmad-code-org/BMAD-METHOD/pull/934"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
