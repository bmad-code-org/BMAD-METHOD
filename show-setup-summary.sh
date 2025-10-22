#!/bin/bash
# Display complete setup summary

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║     BMad Method v6 Alpha - Setup Complete! 🎉         ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}📊 Quick Status:${NC}"
bash /Users/hbl/Documents/BMAD-METHOD/bmad-doctor.sh

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}📚 Documentation Files Created:${NC}"
echo ""
ls -1 /Users/hbl/Documents/BMAD-METHOD/*.md 2>/dev/null | while read file; do
    filename=$(basename "$file")
    size=$(wc -l < "$file" | tr -d ' ')
    echo -e "  ${BLUE}•${NC} $filename ${YELLOW}($size lines)${NC}"
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}🛠️  Maintenance Scripts:${NC}"
echo ""
echo -e "  ${BLUE}•${NC} bmad-doctor.sh          - Quick health check"
echo -e "  ${BLUE}•${NC} validate-bmad-setup.sh  - Full validation"
echo -e "  ${BLUE}•${NC} bmad-update.sh          - Update/backup/restore"
echo -e "  ${BLUE}•${NC} setup-project-bmad.sh   - Project workspace setup"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}🚀 Quick Start Commands:${NC}"
echo ""
echo -e "  ${YELLOW}# View master index${NC}"
echo -e "  cat /Users/hbl/Documents/BMAD-METHOD/README-SETUP.md"
echo ""
echo -e "  ${YELLOW}# Show all commands${NC}"
echo -e "  bmad-help"
echo ""
echo -e "  ${YELLOW}# Install CIS + BMB modules${NC}"
echo -e "  bmad-install-modules"
echo ""
echo -e "  ${YELLOW}# Set up a project${NC}"
echo -e "  bmad-init /path/to/project"
echo ""
echo -e "  ${YELLOW}# Start using BMad${NC}"
echo -e "  cd /Users/hbl/Documents/pages-health && claude-code ."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}📖 Read the Complete Summary:${NC}"
echo -e "  ${YELLOW}cat /Users/hbl/Documents/BMAD-METHOD/COMPLETE-SETUP-SUMMARY.md${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
