#!/bin/bash

# BMAD Web - Deploy Script
# Usage: ./scripts/deploy.sh [environment] [service]
# Examples:
#   ./scripts/deploy.sh production all
#   ./scripts/deploy.sh staging frontend
#   ./scripts/deploy.sh production backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
SERVICE=${2:-all}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   BMAD Web Deploy Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"
echo -e "Service: ${GREEN}$SERVICE${NC}"
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"

    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed${NC}"
        exit 1
    fi

    # Check for Vercel CLI if deploying frontend
    if [[ "$SERVICE" == "frontend" || "$SERVICE" == "all" ]]; then
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Installing Vercel CLI...${NC}"
            npm i -g vercel
        fi
    fi

    # Check for Railway CLI if deploying backend
    if [[ "$SERVICE" == "backend" || "$SERVICE" == "all" ]]; then
        if ! command -v railway &> /dev/null; then
            echo -e "${YELLOW}Installing Railway CLI...${NC}"
            npm i -g @railway/cli
        fi
    fi

    echo -e "${GREEN}Prerequisites OK${NC}"
    echo ""
}

# Build packages
build_packages() {
    echo -e "${YELLOW}Building shared packages...${NC}"
    npm run build --workspace=@bmad/core
    npm run build --workspace=@bmad/ui
    echo -e "${GREEN}Packages built${NC}"
    echo ""
}

# Deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"

    cd apps/web

    if [[ "$ENVIRONMENT" == "production" ]]; then
        vercel --prod
    else
        vercel
    fi

    cd ../..

    echo -e "${GREEN}Frontend deployed${NC}"
    echo ""
}

# Deploy backend
deploy_backend() {
    echo -e "${YELLOW}Deploying backend to Railway...${NC}"

    cd apps/api

    if [[ "$ENVIRONMENT" == "production" ]]; then
        railway up --detach
    else
        railway up --detach --environment staging
    fi

    cd ../..

    echo -e "${GREEN}Backend deployed${NC}"
    echo ""
}

# Run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"

    cd apps/api
    npx prisma migrate deploy
    cd ../..

    echo -e "${GREEN}Migrations completed${NC}"
    echo ""
}

# Main execution
main() {
    check_prerequisites

    # Navigate to bmad-web directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR/.."

    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm ci
    echo ""

    build_packages

    case $SERVICE in
        frontend)
            deploy_frontend
            ;;
        backend)
            run_migrations
            deploy_backend
            ;;
        all)
            deploy_frontend
            run_migrations
            deploy_backend
            ;;
        *)
            echo -e "${RED}Unknown service: $SERVICE${NC}"
            echo "Usage: ./scripts/deploy.sh [environment] [service]"
            echo "Services: frontend, backend, all"
            exit 1
            ;;
    esac

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Deploy completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
}

main
