#!/bin/bash
#
# BMAD Epic Execute - Design Phase Module
#
# Provides pre-implementation design phase functionality to catch
# architectural issues early before coding begins.
#
# Usage: Sourced by epic-execute.sh
#

# =============================================================================
# Design Phase Variables
# =============================================================================

# Stores the last design output for passing to dev phase
LAST_DESIGN=""

# =============================================================================
# Design Phase Functions
# =============================================================================

# Execute pre-implementation design phase
# Generates an implementation plan before coding begins
# Arguments:
#   $1 - story_file path
execute_design_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    # Reset last design
    LAST_DESIGN=""

    log ">>> DESIGN PHASE: $story_id"

    # Story is inlined (small, bounded, and the planner needs it in full)
    local story_contents=$(cat "$story_file")

    # Locate the architecture file but pass it by PATH, not embedded contents.
    # architecture.md is the main unbounded size risk in this prompt.
    local arch_file=""
    for search_path in "$PROJECT_ROOT/docs/architecture.md" "$PROJECT_ROOT/docs/architecture/architecture.md" "$PROJECT_ROOT/architecture.md"; do
        if [ -f "$search_path" ]; then
            arch_file="$search_path"
            break
        fi
    done

    # Load previous decisions for context, bounded to the last 20KB
    # (matches the dev phase; the decision log grows across the epic).
    local decision_context=""
    if type get_decision_log_context >/dev/null 2>&1; then
        decision_context=$(get_decision_log_context)
        local dec_size
        dec_size=$(get_byte_size "$decision_context")
        if [ "$dec_size" -gt 20000 ]; then
            decision_context=$(printf '%s' "$decision_context" | tail -c 20000)
            [ "$VERBOSE" = true ] && log_warn "Design: decision log truncated to last 20KB"
        fi
    fi

    local design_prompt="You are a senior developer planning the implementation of a story.

## Your Task

Create an implementation plan for: $story_id

Do NOT write any code yet. Output only your design plan.

### CRITICAL RULES
- Plan thoroughly BEFORE any implementation
- Consider existing patterns in the codebase
- Map each acceptance criterion to specific files/functions
- Identify potential risks and dependencies

## Story to Plan

**Story Path:** $story_file
**Story ID:** $story_id

<story>
$story_contents
</story>

## Architecture Reference

**Read the architecture document at:** ${arch_file:-"(none found)"}

## Previous Decisions in This Epic

<decision-context>
$decision_context
</decision-context>

## Exploration

First, explore the codebase to understand existing patterns and conventions
before planning. Use the repository's own structure and language to guide you
(e.g. inspect the relevant source directories, find files similar to what this
story touches, and follow existing patterns rather than introducing new ones).

## Required Output

Output your implementation plan as a single JSON result block. Map EVERY
acceptance criterion in the story to the files/functions that will implement
it - the \"ac\" field must use the exact AC identifier from the story (e.g.
\"AC1\", \"AC2\").

\`\`\`json
{
  \"status\": \"COMPLETE\",
  \"story_id\": \"$story_id\",
  \"summary\": \"<one-line description of the planned approach>\",
  \"files_to_modify\": [
    {\"path\": \"<file path>\", \"action\": \"create|modify\", \"purpose\": \"<why>\"}
  ],
  \"patterns_to_use\": [
    {\"pattern\": \"<pattern name>\", \"how\": \"<how it will be applied>\"}
  ],
  \"dependencies\": [
    {\"package\": \"<name>\", \"state\": \"installed|needs-install\"}
  ],
  \"acceptance_criteria_mapping\": [
    {\"ac\": \"AC1\", \"covered_by\": \"<files/functions implementing this AC>\"}
  ],
  \"risks\": [
    {\"risk\": \"<potential issue>\", \"mitigation\": \"<how to mitigate>\"}
  ],
  \"test_files\": [
    {\"path\": \"<test file path>\", \"covers\": \"<what it will test>\"}
  ],
  \"implementation_order\": [\"<first step>\", \"<second step>\"]
}
\`\`\`

Be specific and concrete. This plan will guide the implementation phase.

If you cannot produce a plan (e.g. the story is too ambiguous to design),
output the same JSON block with \"status\": \"BLOCKED\" and a \"summary\"
explaining why.

## Completion Signal

After outputting the JSON block, output exactly:
DESIGN COMPLETE: $story_id"

    # Log prompt size in verbose mode (consistent with other phases)
    log_prompt_size "$design_prompt" "design-phase"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute design phase for $story_id"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$design_prompt"
    local result
    result=$(read_phase_tail)

    # Extract the JSON plan using the shared parser (falls back to legacy
    # text scraping if no JSON block is present, e.g. older models).
    local json=""
    if type extract_json_result >/dev/null 2>&1; then
        json=$(extract_json_result "$result")
    fi

    # Determine completion using the shared JSON-first checker
    local completion_status=0
    if type check_phase_completion >/dev/null 2>&1; then
        check_phase_completion "$result" "design" "$story_id"
        completion_status=$?
    fi

    if [ -n "$json" ] && [ "$completion_status" -ne 1 ]; then
        # Valid JSON plan
        LAST_DESIGN="$json"
    else
        # Fall back to legacy DESIGN START/END text block (backward compat)
        LAST_DESIGN=$(echo "$result" | sed -n '/DESIGN START/,/DESIGN END/p')
    fi

    if [ -z "$LAST_DESIGN" ] || [ "$completion_status" -eq 1 ]; then
        log_error "Design phase did not produce a valid plan"
        return 1
    fi

    # Persist the plan to a per-story file so the dev phase can read it
    # even after a resume (when the in-memory LAST_DESIGN is empty).
    persist_design "$story_id" "$LAST_DESIGN"

    # Validate that every acceptance criterion is mapped (advisory warning).
    validate_design_coverage "$story_file" "$story_id" "$json"

    # Save to decision log
    if type append_to_decision_log >/dev/null 2>&1; then
        append_to_decision_log "DESIGN" "$story_id" "$LAST_DESIGN"
    fi

    log_success "Design phase complete: $story_id"
    return 0
}

# Validate that the design plan maps every acceptance criterion in the story.
# This is advisory: it warns and records a metric but never fails the story
# (design is a non-blocking phase). AC extraction is heuristic since story
# formats vary; if no ACs are detected the check is skipped.
# Arguments:
#   $1 - story_file path
#   $2 - story_id
#   $3 - JSON plan (may be empty if the model fell back to text output)
validate_design_coverage() {
    local story_file="$1"
    local story_id="$2"
    local json="$3"

    # Coverage check requires jq and a JSON plan; skip otherwise.
    if [ -z "$json" ] || ! command -v jq >/dev/null 2>&1; then
        return 0
    fi

    # Count distinct AC identifiers declared in the story (e.g. AC1, AC2, ...).
    local ac_count
    ac_count=$(grep -oiE '\bAC[0-9]+\b' "$story_file" 2>/dev/null | tr '[:lower:]' '[:upper:]' | sort -u | wc -l | tr -d ' ')

    if [ "${ac_count:-0}" -eq 0 ]; then
        # No recognizable AC identifiers in this story - nothing to validate.
        return 0
    fi

    # Count distinct ACs the plan claims to cover.
    local mapped
    mapped=$(echo "$json" | jq -r '[.acceptance_criteria_mapping[]?.ac] | map(ascii_upcase) | unique | length' 2>/dev/null || echo 0)
    mapped=$(echo "$mapped" | tr -d '[:space:]')
    [ -z "$mapped" ] && mapped=0

    if [ "$mapped" -lt "$ac_count" ]; then
        log_warn "Design maps $mapped of $ac_count acceptance criteria for $story_id"
        if type add_metrics_issue >/dev/null 2>&1; then
            add_metrics_issue "$story_id" "design_incomplete" "Plan maps $mapped/$ac_count acceptance criteria"
        fi
    else
        [ "$VERBOSE" = true ] && log "Design covers all $ac_count acceptance criteria for $story_id"
    fi
}

# Persist a design plan to a per-story file under DESIGN_DIR.
# Arguments:
#   $1 - story_id
#   $2 - design content
persist_design() {
    local story_id="$1"
    local content="$2"

    if [ -z "${DESIGN_DIR:-}" ]; then
        return 0
    fi

    mkdir -p "$DESIGN_DIR" 2>/dev/null || true
    local design_file="$DESIGN_DIR/${story_id}-design.md"
    if printf '%s\n' "$content" > "$design_file" 2>/dev/null; then
        [ "$VERBOSE" = true ] && log "Design plan saved: $design_file"
    else
        log_warn "Failed to persist design plan: $design_file"
    fi
}

# Get the last design for inclusion in dev phase prompt
# Returns the design output or empty string if not available
get_last_design() {
    echo "$LAST_DESIGN"
}

# Build the design context block for dev phase prompt
# Returns formatted design context for inclusion in prompts
build_design_context_for_dev() {
    local story_id="$1"

    # Prefer the in-memory plan; fall back to the persisted file so a resumed
    # run (where LAST_DESIGN is empty) still gets the design context.
    local design="$LAST_DESIGN"
    if [ -z "$design" ] && [ -n "${DESIGN_DIR:-}" ]; then
        local design_file="$DESIGN_DIR/${story_id}-design.md"
        if [ -f "$design_file" ]; then
            design=$(cat "$design_file")
        fi
    fi

    if [ -z "$design" ]; then
        echo ""
        return
    fi

    cat << EOF
## Pre-Implementation Design

The following design was created in the planning phase. Follow this plan:

<design-plan>
$design
</design-plan>

### Implementation Guidelines Based on Design

1. Follow the implementation_order specified
2. Create/modify files as listed in files_to_modify
3. Use the patterns specified in patterns_to_use
4. Ensure each acceptance_criteria_mapping is implemented
5. Be aware of the identified risks

EOF
}
