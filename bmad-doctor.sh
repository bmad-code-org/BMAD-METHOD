#!/bin/bash
# BMad Doctor - Quick Health Check
# Fast validation of BMad setup

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔬 BMad Doctor - Quick Health Check${NC}\n"

ISSUES=0
WARNINGS=0

# 1. Central Installation
if [ -d "/Users/hbl/Documents/BMAD-METHOD/bmad" ]; then
    echo -e "${GREEN}✓${NC} Central BMad installation"
else
    echo -e "${RED}✗${NC} Central BMad missing"
    ((ISSUES++))
fi

# 2. Modules
if [ -f "/Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml" ]; then
    modules=$(grep -A 5 "^modules:" "/Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml" | grep "^  - " | wc -l | tr -d ' ')
    echo -e "${GREEN}✓${NC} $modules modules installed"

    if ! grep -q "  - cis" "/Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml"; then
        echo -e "  ${YELLOW}⚠${NC} CIS module missing"
        ((WARNINGS++))
    fi
    if ! grep -q "  - bmb" "/Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml"; then
        echo -e "  ${YELLOW}⚠${NC} BMB module missing"
        ((WARNINGS++))
    fi
fi

# 3. Slash Commands
if [ -d "~/.claude/commands/bmad" ]; then
    cmd_count=$(find ~/.claude/commands/bmad -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    echo -e "${GREEN}✓${NC} $cmd_count slash commands"
fi

# 4. Aliases
if grep -q "bmad-init" ~/.zshrc 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Global aliases configured"
else
    echo -e "${RED}✗${NC} Aliases missing"
    ((ISSUES++))
fi

# 5. Environment
if [ -f ~/.bmadrc ]; then
    echo -e "${GREEN}✓${NC} Environment variables"
else
    echo -e "${RED}✗${NC} Environment config missing"
    ((ISSUES++))
fi

# 6. Projects
workspace_count=$(ls -d /Users/hbl/Documents/*/.bmad 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}✓${NC} $workspace_count project workspace(s)"

echo ""

# Summary
if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ BMad is healthy!${NC}"
    echo -e "\n💡 Try: ${BLUE}bmad-help${NC}"
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠️  BMad functional with $WARNINGS warning(s)${NC}"
    [ $WARNINGS -gt 0 ] && echo -e "\n💡 Install missing modules: ${BLUE}cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad${NC}"
else
    echo -e "${RED}❌ Found $ISSUES critical issue(s)${NC}"
    echo -e "\n💡 Run full validation: ${BLUE}bash /Users/hbl/Documents/BMAD-METHOD/validate-bmad-setup.sh${NC}"
fi

echo ""
exit $ISSUES
