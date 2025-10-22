#!/bin/bash
# BMad Update & Maintenance Script
# Safely updates BMad installation and syncs slash commands

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 BMad Update & Maintenance${NC}\n"

# Configuration
BMAD_REPO="/Users/hbl/Documents/BMAD-METHOD"
BMAD_INSTALL="/Users/hbl/Documents/BMAD-METHOD/bmad"
COMMANDS_SOURCE="$BMAD_REPO/.claude/commands/bmad"
COMMANDS_TARGET="/Users/hbl/.claude/commands/bmad"

# Function to create backup
backup_installation() {
    local backup_dir="$BMAD_INSTALL-backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${BLUE}Creating backup...${NC}"
    cp -r "$BMAD_INSTALL" "$backup_dir"
    echo -e "${GREEN}✓${NC} Backup created: $backup_dir"
    echo "$backup_dir" > "/tmp/bmad-last-backup"
}

# Function to restore from backup
restore_backup() {
    if [ -f "/tmp/bmad-last-backup" ]; then
        local backup_dir=$(cat /tmp/bmad-last-backup)
        if [ -d "$backup_dir" ]; then
            echo -e "${YELLOW}Restoring from backup...${NC}"
            rm -rf "$BMAD_INSTALL"
            cp -r "$backup_dir" "$BMAD_INSTALL"
            echo -e "${GREEN}✓${NC} Restored from: $backup_dir"
            return 0
        fi
    fi
    echo -e "${RED}No backup found${NC}"
    return 1
}

# Function to update slash commands
update_slash_commands() {
    echo -e "\n${BLUE}Updating slash commands...${NC}"

    if [ ! -d "$COMMANDS_SOURCE" ]; then
        echo -e "${RED}✗${NC} Source commands not found: $COMMANDS_SOURCE"
        return 1
    fi

    # Backup existing commands
    if [ -d "$COMMANDS_TARGET" ]; then
        local cmd_backup="$COMMANDS_TARGET-backup-$(date +%Y%m%d-%H%M%S)"
        mv "$COMMANDS_TARGET" "$cmd_backup"
        echo -e "${GREEN}✓${NC} Backed up existing commands to: $cmd_backup"
    fi

    # Copy new commands
    cp -r "$COMMANDS_SOURCE" "$COMMANDS_TARGET"
    local cmd_count=$(find "$COMMANDS_TARGET" -name "*.md" | wc -l | tr -d ' ')
    echo -e "${GREEN}✓${NC} Installed $cmd_count slash commands"
}

# Function to pull latest changes
pull_updates() {
    echo -e "\n${BLUE}Checking for updates...${NC}"

    cd "$BMAD_REPO"

    # Check git status
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠${NC}  Not a git repository, skipping git pull"
        return 0
    fi

    # Get current branch
    local branch=$(git branch --show-current)
    echo -e "Current branch: ${BLUE}$branch${NC}"

    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}⚠${NC}  Uncommitted changes detected"
        echo -e "Stashing changes..."
        git stash push -m "BMad auto-update stash $(date +%Y%m%d-%H%M%S)"
    fi

    # Pull latest
    echo -e "Pulling latest changes..."
    if git pull origin "$branch"; then
        echo -e "${GREEN}✓${NC} Updated to latest version"
    else
        echo -e "${RED}✗${NC} Git pull failed"
        return 1
    fi
}

# Function to reinstall node modules
reinstall_node_modules() {
    echo -e "\n${BLUE}Reinstalling node modules...${NC}"

    cd "$BMAD_REPO"

    if [ -d "node_modules" ]; then
        rm -rf node_modules
        echo -e "${GREEN}✓${NC} Removed old node_modules"
    fi

    npm install
    echo -e "${GREEN}✓${NC} Installed fresh node_modules"
}

# Function to verify installation
verify_installation() {
    echo -e "\n${BLUE}Verifying installation...${NC}"

    if [ -f "$BMAD_INSTALL/_cfg/manifest.yaml" ]; then
        local version=$(grep "version:" "$BMAD_INSTALL/_cfg/manifest.yaml" | head -1 | awk '{print $2}')
        echo -e "${GREEN}✓${NC} BMad version: $version"
    else
        echo -e "${RED}✗${NC} Manifest not found"
        return 1
    fi

    # Run health check
    if [ -f "$BMAD_REPO/bmad-doctor.sh" ]; then
        bash "$BMAD_REPO/bmad-doctor.sh"
    fi
}

# Main update process
main() {
    echo -e "This will:"
    echo -e "  1. Backup current installation"
    echo -e "  2. Pull latest BMad updates (if git repo)"
    echo -e "  3. Reinstall node modules"
    echo -e "  4. Update slash commands"
    echo -e "  5. Verify installation"
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Update cancelled${NC}"
        exit 0
    fi

    # Create backup
    backup_installation

    # Try update process
    if pull_updates && reinstall_node_modules && update_slash_commands; then
        echo -e "\n${GREEN}✅ Update completed successfully!${NC}"
        verify_installation

        echo -e "\n${BLUE}Cleanup old backup?${NC}"
        local backup_dir=$(cat /tmp/bmad-last-backup)
        echo -e "Backup location: $backup_dir"
        read -p "Delete backup? (y/N): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$backup_dir"
            echo -e "${GREEN}✓${NC} Backup deleted"
        else
            echo -e "${BLUE}ℹ${NC}  Backup kept at: $backup_dir"
        fi

    else
        echo -e "\n${RED}❌ Update failed!${NC}"
        echo -e "Attempting to restore from backup..."

        if restore_backup; then
            echo -e "${GREEN}✓${NC} Successfully restored from backup"
        else
            echo -e "${RED}✗${NC} Restore failed - manual recovery required"
            exit 1
        fi
    fi

    echo -e "\n${GREEN}Done!${NC}"
    echo -e "\n💡 Remember to reload your shell: ${BLUE}source ~/.zshrc${NC}"
}

# Handle script arguments
case "${1:-update}" in
    update)
        main
        ;;
    commands-only)
        echo -e "${BLUE}Updating slash commands only...${NC}"
        update_slash_commands
        echo -e "${GREEN}Done!${NC}"
        ;;
    verify)
        verify_installation
        ;;
    backup)
        backup_installation
        echo -e "${GREEN}Done!${NC}"
        ;;
    restore)
        restore_backup
        echo -e "${GREEN}Done!${NC}"
        ;;
    *)
        echo "Usage: $0 {update|commands-only|verify|backup|restore}"
        echo ""
        echo "Commands:"
        echo "  update         - Full update (default)"
        echo "  commands-only  - Only update slash commands"
        echo "  verify         - Verify current installation"
        echo "  backup         - Create backup only"
        echo "  restore        - Restore from last backup"
        exit 1
        ;;
esac
