#!/bin/bash
# =============================================================================
# BMAD Story Format Validation Script
# =============================================================================
#
# Validates all ready-for-dev stories have proper BMAD format before batch
# execution. Run this BEFORE /batch-super-dev to prevent wasted time.
#
# Usage:
#   ./scripts/validate-all-stories.sh                    # Validate all ready-for-dev
#   ./scripts/validate-all-stories.sh story-20-13a-1.md  # Validate specific file
#   ./scripts/validate-all-stories.sh --help             # Show help
#
# Exit codes:
#   0 - All stories valid
#   1 - One or more stories invalid
#
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required BMAD sections (12 total)
REQUIRED_SECTIONS=(
	"Business Context"
	"Current State"
	"Acceptance Criteria"
	"Tasks"
	"Technical Requirements"
	"Architecture Compliance"
	"Testing Requirements"
	"Dev Agent Guardrails"
	"Definition of Done"
	"References"
	"Dev Agent Record"
	"Change Log"
)

# Minimum requirements
MIN_TASKS=3
MIN_SECTIONS=12

# Help message
show_help() {
	cat <<EOF
BMAD Story Format Validation Script

Validates story files have proper BMAD format before batch execution.

USAGE:
    ./scripts/validate-all-stories.sh [OPTIONS] [FILE...]

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Show detailed validation for each story
    -q, --quiet     Only show summary (no per-file output)

ARGUMENTS:
    FILE...         Specific story files to validate
                    If not provided, validates all ready-for-dev stories

EXAMPLES:
    # Validate all ready-for-dev stories
    ./scripts/validate-all-stories.sh

    # Validate specific files
    ./scripts/validate-all-stories.sh docs/sprint-artifacts/story-20-13a-1.md

    # Verbose output
    ./scripts/validate-all-stories.sh -v

REQUIRED FORMAT:
    - 12 BMAD sections present
    - At least 3 unchecked tasks
    - Story file exists

SECTIONS CHECKED:
    1. Business Context
    2. Current State
    3. Acceptance Criteria
    4. Tasks/Subtasks
    5. Technical Requirements
    6. Architecture Compliance
    7. Testing Requirements
    8. Dev Agent Guardrails
    9. Definition of Done
    10. References
    11. Dev Agent Record
    12. Change Log

EOF
}

# Parse arguments
VERBOSE=false
QUIET=false
FILES=()

while [[ $# -gt 0 ]]; do
	case $1 in
	-h | --help)
		show_help
		exit 0
		;;
	-v | --verbose)
		VERBOSE=true
		shift
		;;
	-q | --quiet)
		QUIET=true
		shift
		;;
	*)
		FILES+=("$1")
		shift
		;;
	esac
done

# Function to validate a single story file
validate_story() {
	local file="$1"
	local story_key
	local errors=()

	# Extract story key from filename
	story_key=$(basename "$file" .md | sed 's/^story-//')

	# Check file exists
	if [ ! -f "$file" ]; then
		echo -e "${RED}FILE MISSING${NC}"
		return 1
	fi

	# Count sections (look for ## headings)
	local section_count=0
	local missing_sections=()

	for section in "${REQUIRED_SECTIONS[@]}"; do
		if grep -qi "^## .*${section}" "$file" 2>/dev/null; then
			((section_count++))
		else
			missing_sections+=("$section")
		fi
	done

	# Count unchecked tasks
	local task_count
	task_count=$(grep -c "^- \[ \]" "$file" 2>/dev/null || echo "0")

	# Build error list
	if [ "$section_count" -lt "$MIN_SECTIONS" ]; then
		errors+=("Only $section_count/$MIN_SECTIONS sections")
	fi

	if [ "$task_count" -lt "$MIN_TASKS" ]; then
		errors+=("Only $task_count tasks (need >=$MIN_TASKS)")
	fi

	# Output results
	if [ ${#errors[@]} -eq 0 ]; then
		if [ "$QUIET" != "true" ]; then
			echo -e "${GREEN}VALID${NC} - $section_count sections, $task_count tasks"
		fi
		return 0
	else
		if [ "$QUIET" != "true" ]; then
			echo -e "${RED}INVALID${NC} - ${errors[*]}"
			if [ "$VERBOSE" == "true" ] && [ ${#missing_sections[@]} -gt 0 ]; then
				echo "    Missing sections: ${missing_sections[*]}"
			fi
		fi
		return 1
	fi
}

# Main execution
main() {
	local total=0
	local valid=0
	local invalid=0
	local invalid_files=()

	echo "=========================================="
	echo "  BMAD Story Format Validation"
	echo "=========================================="
	echo ""

	# Determine which files to validate
	if [ ${#FILES[@]} -gt 0 ]; then
		# Validate specific files
		for file in "${FILES[@]}"; do
			((total++))
			if [ "$QUIET" != "true" ]; then
				printf "%-50s " "$file"
			fi
			if validate_story "$file"; then
				((valid++))
			else
				((invalid++))
				invalid_files+=("$file")
			fi
		done
	else
		# Find sprint-status.yaml and validate ready-for-dev stories
		local sprint_status=""

		# Try common locations
		for location in "docs/sprint-artifacts/sprint-status.yaml" "_bmad/docs/sprint-artifacts/sprint-status.yaml" "sprint-status.yaml"; do
			if [ -f "$location" ]; then
				sprint_status="$location"
				break
			fi
		done

		if [ -z "$sprint_status" ]; then
			echo -e "${YELLOW}Warning: sprint-status.yaml not found${NC}"
			echo "Falling back to validating all story-*.md files in docs/sprint-artifacts/"
			echo ""

			# Fallback: validate all story files
			for file in docs/sprint-artifacts/story-*.md _bmad/docs/sprint-artifacts/story-*.md 2>/dev/null; do
				if [ -f "$file" ]; then
					((total++))
					if [ "$QUIET" != "true" ]; then
						printf "%-50s " "$(basename "$file")"
					fi
					if validate_story "$file"; then
						((valid++))
					else
						((invalid++))
						invalid_files+=("$file")
					fi
				fi
			done
		else
			echo "Using: $sprint_status"
			echo ""

			# Get ready-for-dev stories from sprint-status.yaml
			local stories
			stories=$(grep -E "^\s*\S+:.*ready-for-dev" "$sprint_status" 2>/dev/null | awk -F: '{print $1}' | tr -d ' ' || true)

			if [ -z "$stories" ]; then
				echo -e "${YELLOW}No ready-for-dev stories found in sprint-status.yaml${NC}"
				echo ""
				echo "=========================================="
				echo "  Summary"
				echo "=========================================="
				echo "Total Stories: 0"
				echo ""
				echo -e "${GREEN}Nothing to validate!${NC}"
				exit 0
			fi

			# Validate each story
			for story in $stories; do
				# Try multiple file naming patterns
				local story_file=""
				local base_dir
				base_dir=$(dirname "$sprint_status")

				for pattern in "$base_dir/story-$story.md" "$base_dir/$story.md"; do
					if [ -f "$pattern" ]; then
						story_file="$pattern"
						break
					fi
				done

				((total++))
				if [ "$QUIET" != "true" ]; then
					printf "%-50s " "$story"
				fi

				if [ -z "$story_file" ]; then
					if [ "$QUIET" != "true" ]; then
						echo -e "${RED}FILE MISSING${NC}"
					fi
					((invalid++))
					invalid_files+=("$story (file not found)")
				else
					if validate_story "$story_file"; then
						((valid++))
					else
						((invalid++))
						invalid_files+=("$story_file")
					fi
				fi
			done
		fi
	fi

	# Summary
	echo ""
	echo "=========================================="
	echo "  Summary"
	echo "=========================================="
	echo "Total Stories: $total"
	echo -e "Valid:         ${GREEN}$valid${NC}"
	echo -e "Invalid:       ${RED}$invalid${NC}"
	echo ""

	if [ "$invalid" -eq 0 ]; then
		echo -e "${GREEN}All stories ready for batch execution!${NC}"
		echo ""
		echo "Next step: /batch-super-dev"
		exit 0
	else
		echo -e "${RED}$invalid stories need regeneration${NC}"
		echo ""
		echo "Invalid stories:"
		for file in "${invalid_files[@]}"; do
			echo "  - $file"
		done
		echo ""
		echo "Fix by running for each invalid story:"
		echo "  /create-story-with-gap-analysis"
		echo ""
		echo "Then re-run validation:"
		echo "  ./scripts/validate-all-stories.sh"
		exit 1
	fi
}

# Run main
main
