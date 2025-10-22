#!/bin/bash
# BMad Setup Validation Script
# Checks for common issues and validates complete installation

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   BMad Method v6 Alpha - Setup Validation${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Track issues
ISSUES=0
WARNINGS=0

# 1. Check Central BMad Installation
echo -e "${BLUE}[1/10] Checking Central BMad Installation...${NC}"
BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD/bmad"
if [ -d "$BMAD_HOME" ]; then
    echo -e "  ${GREEN}✓${NC} BMad installed at: $BMAD_HOME"
else
    echo -e "  ${RED}✗${NC} BMad not found at: $BMAD_HOME"
    ((ISSUES++))
fi
echo ""

# 2. Check Installed Modules
echo -e "${BLUE}[2/10] Checking Installed Modules...${NC}"
if [ -f "$BMAD_HOME/_cfg/manifest.yaml" ]; then
    modules=$(grep -A 10 "^modules:" "$BMAD_HOME/_cfg/manifest.yaml" | grep "^  - " | sed 's/^  - //')
    echo -e "  ${GREEN}✓${NC} Installed modules:"
    echo "$modules" | while read module; do
        echo "    • $module"
    done

    # Check for missing recommended modules
    if ! echo "$modules" | grep -q "cis"; then
        echo -e "  ${YELLOW}⚠${NC}  CIS module not installed (Creative Intelligence Suite)"
        ((WARNINGS++))
    fi
    if ! echo "$modules" | grep -q "bmb"; then
        echo -e "  ${YELLOW}⚠${NC}  BMB module not installed (BMad Builder)"
        ((WARNINGS++))
    fi
else
    echo -e "  ${RED}✗${NC} Manifest file not found"
    ((ISSUES++))
fi
echo ""

# 3. Check Slash Commands
echo -e "${BLUE}[3/10] Checking Slash Commands...${NC}"
COMMANDS_DIR="/Users/hbl/.claude/commands/bmad"
if [ -d "$COMMANDS_DIR" ]; then
    cmd_count=$(find "$COMMANDS_DIR" -type f -name "*.md" | wc -l | tr -d ' ')
    echo -e "  ${GREEN}✓${NC} Slash commands directory exists"
    echo -e "    Found $cmd_count command files"

    if [ "$cmd_count" -lt 40 ]; then
        echo -e "  ${YELLOW}⚠${NC}  Expected ~44 commands, found $cmd_count"
        ((WARNINGS++))
    fi
else
    echo -e "  ${RED}✗${NC} Slash commands not found at: $COMMANDS_DIR"
    echo -e "    Run: cp -r /Users/hbl/Documents/BMAD-METHOD/.claude/commands/bmad ~/.claude/commands/"
    ((ISSUES++))
fi
echo ""

# 4. Check Subagents
echo -e "${BLUE}[4/10] Checking BMad Subagents...${NC}"
AGENTS_DIR="/Users/hbl/.claude/agents"
bmad_agents=$(find "$AGENTS_DIR" -type d -name "bmad-*" 2>/dev/null | wc -l | tr -d ' ')
if [ "$bmad_agents" -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} Found $bmad_agents BMad agent directories"
    find "$AGENTS_DIR" -type d -name "bmad-*" -maxdepth 1 | while read dir; do
        agent_count=$(find "$dir" -type f -name "*.md" | wc -l | tr -d ' ')
        echo -e "    • $(basename $dir): $agent_count agents"
    done
else
    echo -e "  ${YELLOW}⚠${NC}  No BMad subagent directories found"
    ((WARNINGS++))
fi
echo ""

# 5. Check Global Aliases
echo -e "${BLUE}[5/10] Checking Global Aliases...${NC}"
if grep -q "alias bmad-init=" ~/.zshrc 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} bmad-init alias configured"
else
    echo -e "  ${RED}✗${NC} bmad-init alias not found in ~/.zshrc"
    ((ISSUES++))
fi

if grep -q "alias bmad=" ~/.zshrc 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} bmad alias configured"
else
    echo -e "  ${RED}✗${NC} bmad alias not found in ~/.zshrc"
    ((ISSUES++))
fi
echo ""

# 6. Check Environment Variables
echo -e "${BLUE}[6/10] Checking Environment Variables...${NC}"
if [ -f ~/.bmadrc ]; then
    echo -e "  ${GREEN}✓${NC} ~/.bmadrc exists"

    if grep -q "BMAD_HOME" ~/.bmadrc; then
        echo -e "  ${GREEN}✓${NC} BMAD_HOME variable defined"
    else
        echo -e "  ${RED}✗${NC} BMAD_HOME not defined in ~/.bmadrc"
        ((ISSUES++))
    fi
else
    echo -e "  ${RED}✗${NC} ~/.bmadrc not found"
    ((ISSUES++))
fi

if grep -q "source ~/.bmadrc" ~/.zshrc 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} .bmadrc sourced in .zshrc"
else
    echo -e "  ${YELLOW}⚠${NC}  .bmadrc not sourced in .zshrc"
    ((WARNINGS++))
fi
echo ""

# 7. Check Project Workspaces
echo -e "${BLUE}[7/10] Checking Project Workspaces...${NC}"
workspaces=$(find /Users/hbl/Documents -type f -name ".bmadrc" 2>/dev/null)
workspace_count=$(echo "$workspaces" | grep -c ".bmadrc" 2>/dev/null || echo 0)

if [ "$workspace_count" -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} Found $workspace_count project workspace(s):"
    echo "$workspaces" | while read rc; do
        project_dir=$(dirname "$rc")
        project_name=$(basename "$project_dir" | sed 's/\.bmad$//')
        echo -e "    • $project_name"
    done
else
    echo -e "  ${YELLOW}⚠${NC}  No project workspaces found"
    echo -e "    Run: bmad-init /path/to/project"
    ((WARNINGS++))
fi
echo ""

# 8. Check Documentation Files
echo -e "${BLUE}[8/10] Checking Documentation...${NC}"
docs=(
    "/Users/hbl/Documents/BMAD-METHOD/SETUP-INSTRUCTIONS.md"
    "/Users/hbl/Documents/BMAD-METHOD/OPTIMIZATION-CHECKLIST.md"
    "/Users/hbl/Documents/BMAD-METHOD/QUICK-REFERENCE.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "  ${GREEN}✓${NC} $(basename $doc)"
    else
        echo -e "  ${RED}✗${NC} $(basename $doc) missing"
        ((ISSUES++))
    fi
done
echo ""

# 9. Check Setup Script
echo -e "${BLUE}[9/10] Checking Setup Script...${NC}"
SETUP_SCRIPT="/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh"
if [ -f "$SETUP_SCRIPT" ]; then
    if [ -x "$SETUP_SCRIPT" ]; then
        echo -e "  ${GREEN}✓${NC} Setup script exists and is executable"
    else
        echo -e "  ${YELLOW}⚠${NC}  Setup script exists but is not executable"
        echo -e "    Run: chmod +x $SETUP_SCRIPT"
        ((WARNINGS++))
    fi
else
    echo -e "  ${RED}✗${NC} Setup script not found"
    ((ISSUES++))
fi
echo ""

# 10. Check BMad CLI
echo -e "${BLUE}[10/10] Checking BMad CLI...${NC}"
CLI_PATH="/Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js"
if [ -f "$CLI_PATH" ]; then
    echo -e "  ${GREEN}✓${NC} BMad CLI found"

    # Test if it runs
    if node "$CLI_PATH" status >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} BMad CLI executable"
    else
        echo -e "  ${RED}✗${NC} BMad CLI has errors"
        ((ISSUES++))
    fi
else
    echo -e "  ${RED}✗${NC} BMad CLI not found at: $CLI_PATH"
    ((ISSUES++))
fi
echo ""

# Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}                  SUMMARY${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Perfect! BMad setup is complete and valid.${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  1. ${BLUE}source ~/.zshrc${NC} - Load new configuration"
    echo -e "  2. ${BLUE}bmad-help${NC} - View available commands"
    echo -e "  3. ${BLUE}bmad-init /path/to/project${NC} - Set up a project"
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠️  BMad setup is functional with $WARNINGS warning(s).${NC}"
    echo ""
    echo -e "Recommended actions:"
    if echo "$modules" | grep -q "cis"; then :; else
        echo -e "  • Install CIS module: ${BLUE}cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad${NC}"
    fi
    if echo "$modules" | grep -q "bmb"; then :; else
        echo -e "  • Install BMB module: ${BLUE}cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad${NC}"
    fi
else
    echo -e "${RED}❌ Found $ISSUES critical issue(s) and $WARNINGS warning(s).${NC}"
    echo ""
    echo -e "Required fixes:"
    echo -e "  1. Review errors above"
    echo -e "  2. Fix critical issues"
    echo -e "  3. Run this script again: ${BLUE}bash $0${NC}"
fi

echo ""
echo -e "${BLUE}================================================${NC}"
echo ""

exit $ISSUES
