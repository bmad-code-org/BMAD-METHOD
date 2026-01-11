#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# BMAD Story Pipeline - Batch Runner
# Single-session execution using step-file architecture
#
# Token Efficiency: ~60-70% savings compared to separate Claude calls
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Defaults
STORY_ID=""
EPIC_NUM=""
DRY_RUN=false
RESUME=false
VERBOSE=false

# Directories
LOG_DIR="$PROJECT_ROOT/logs/pipeline-batch"
WORKFLOW_PATH="_bmad/bmm/workflows/4-implementation/story-pipeline"

# ─────────────────────────────────────────────────────────────────────────────
# USAGE
# ─────────────────────────────────────────────────────────────────────────────
usage() {
    cat << EOF
BMAD Story Pipeline - Batch Runner
Single-session execution with step-file architecture

Usage: $(basename "$0") --story-id <id> --epic-num <num> [OPTIONS]

Required:
  --story-id <id>    Story ID (e.g., '1-4')
  --epic-num <num>   Epic number (e.g., 1)

Options:
  --resume           Resume from last checkpoint
  --dry-run          Show what would be executed
  --verbose          Show detailed output
  --help             Show this help

Examples:
  # Run pipeline for story 1-4
  $(basename "$0") --story-id 1-4 --epic-num 1

  # Resume failed pipeline
  $(basename "$0") --story-id 1-4 --epic-num 1 --resume

Token Savings:
  Traditional (6 calls): ~71K tokens
  Step-file (1 session): ~25-35K tokens
  Savings: 50-65%

EOF
    exit 1
}

# ─────────────────────────────────────────────────────────────────────────────
# ARGUMENT PARSING
# ─────────────────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case $1 in
        --story-id)
            STORY_ID="$2"
            shift 2
            ;;
        --epic-num)
            EPIC_NUM="$2"
            shift 2
            ;;
        --resume)
            RESUME=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            usage
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            ;;
    esac
done

# Validate required arguments
if [[ -z "$STORY_ID" || -z "$EPIC_NUM" ]]; then
    echo -e "${RED}Error: --story-id and --epic-num are required${NC}"
    usage
fi

# ─────────────────────────────────────────────────────────────────────────────
# SETUP
# ─────────────────────────────────────────────────────────────────────────────
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/batch-$STORY_ID-$TIMESTAMP.log"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  BMAD Story Pipeline - Batch Mode${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Story:${NC} $STORY_ID"
echo -e "${BLUE}Epic:${NC} $EPIC_NUM"
echo -e "${BLUE}Mode:${NC} $([ "$RESUME" = true ] && echo 'Resume' || echo 'Fresh')"
echo -e "${BLUE}Log:${NC} $LOG_FILE"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# BUILD PROMPT
# ─────────────────────────────────────────────────────────────────────────────

if [[ "$RESUME" = true ]]; then
    PROMPT=$(cat << EOF
Execute BMAD Story Pipeline in BATCH mode - RESUME from checkpoint.

WORKFLOW: $WORKFLOW_PATH/workflow.md
STORY ID: $STORY_ID
EPIC NUM: $EPIC_NUM
MODE: batch

CRITICAL INSTRUCTIONS:
1. Load and read fully: $WORKFLOW_PATH/workflow.md
2. This is RESUME mode - load state file first
3. Follow step-file architecture EXACTLY
4. Execute steps ONE AT A TIME
5. AUTO-PROCEED through all steps (no menus in batch mode)
6. FAIL-FAST on errors (save checkpoint, exit)

YOLO MODE: Auto-approve all quality gates
NO MENUS: Proceed automatically between steps
FRESH CONTEXT: Checkpoint before code review for unbiased review

START by loading workflow.md and then step-01b-resume.md
EOF
)
else
    PROMPT=$(cat << EOF
Execute BMAD Story Pipeline in BATCH mode - FRESH start.

WORKFLOW: $WORKFLOW_PATH/workflow.md
STORY ID: $STORY_ID
EPIC NUM: $EPIC_NUM
MODE: batch

CRITICAL INSTRUCTIONS:
1. Load and read fully: $WORKFLOW_PATH/workflow.md
2. This is a FRESH run - initialize new state
3. Follow step-file architecture EXACTLY
4. Execute steps ONE AT A TIME (never load multiple)
5. AUTO-PROCEED through all steps (no menus in batch mode)
6. FAIL-FAST on errors (save checkpoint, exit)

YOLO MODE: Auto-approve all quality gates
NO MENUS: Proceed automatically between steps
FRESH CONTEXT: Checkpoint before code review for unbiased review

Step execution order:
1. step-01-init.md - Initialize, cache documents
2. step-02-create-story.md - Create story (SM role)
3. step-03-validate-story.md - Validate story (SM role)
4. step-04-atdd.md - Generate tests (TEA role)
5. step-05-implement.md - Implement (DEV role)
6. step-06-code-review.md - Review (DEV role, adversarial)
7. step-07-complete.md - Complete (SM role)
8. step-08-summary.md - Generate audit

START by loading workflow.md and then step-01-init.md
EOF
)
fi

# ─────────────────────────────────────────────────────────────────────────────
# EXECUTE
# ─────────────────────────────────────────────────────────────────────────────

if [[ "$DRY_RUN" = true ]]; then
    echo -e "${YELLOW}[DRY-RUN] Would execute single Claude session with:${NC}"
    echo ""
    echo "$PROMPT"
    echo ""
    echo -e "${YELLOW}[DRY-RUN] Allowed tools: *, MCP extensions${NC}"
    exit 0
fi

echo -e "${GREEN}Starting single-session pipeline execution...${NC}"
echo -e "${YELLOW}This replaces 6 separate Claude calls with 1 session${NC}"
echo ""

cd "$PROJECT_ROOT/src"

# Single Claude session executing all steps
claude -p "$PROMPT" \
    --dangerously-skip-permissions \
    --allowedTools "*,mcp__exa__web_search_exa,mcp__exa__get_code_context_exa,mcp__exa__crawling_exa,mcp__supabase__list_tables,mcp__supabase__execute_sql,mcp__supabase__apply_migration,mcp__supabase__list_migrations,mcp__supabase__generate_typescript_types,mcp__supabase__get_logs,mcp__supabase__get_advisors" \
    2>&1 | tee "$LOG_FILE"

# ─────────────────────────────────────────────────────────────────────────────
# COMPLETION CHECK
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

# Check for success indicators in log
if grep -qi "Pipeline complete\|Story.*is ready\|step-08-summary.*completed" "$LOG_FILE"; then
    echo -e "${GREEN}✅ Pipeline completed successfully${NC}"

    # Extract metrics if available
    if grep -qi "Token Efficiency" "$LOG_FILE"; then
        echo ""
        echo -e "${CYAN}Token Efficiency:${NC}"
        grep -A5 "Token Efficiency" "$LOG_FILE" | head -6
    fi
else
    echo -e "${YELLOW}⚠️ Pipeline may have completed with issues${NC}"
    echo -e "${YELLOW}   Check log: $LOG_FILE${NC}"

    # Check for specific failure indicators
    if grep -qi "permission\|can't write\|access denied" "$LOG_FILE"; then
        echo -e "${RED}   Found permission errors in log${NC}"
    fi
    if grep -qi "HALT\|FAIL\|ERROR" "$LOG_FILE"; then
        echo -e "${RED}   Found error indicators in log${NC}"
    fi
fi

echo ""
echo -e "${BLUE}Log file:${NC} $LOG_FILE"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
