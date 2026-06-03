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

# Stores the gaps reported by the most recent design critic pass
DESIGN_CRITIC_GAPS=""

# =============================================================================
# Codebase Exploration (deterministic, language-aware)
# =============================================================================

# Detect the project's primary language/toolchain from marker files.
# Mirrors the detection used by the static-analysis gate.
# Returns one of: node | rust | go | python | unknown
detect_project_type() {
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        echo "node"
    elif [ -f "$PROJECT_ROOT/Cargo.toml" ]; then
        echo "rust"
    elif [ -f "$PROJECT_ROOT/go.mod" ]; then
        echo "go"
    elif [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
        echo "python"
    else
        echo "unknown"
    fi
}

# Build a deterministic, bounded repository map for the planner to start from,
# tailored to the detected language. This replaces the old hardcoded JS/TS
# find commands and the "hope the model explores" approach with concrete,
# pre-computed context.
build_repo_map() {
    local ptype
    ptype=$(detect_project_type)

    local lang_label=""
    local find_expr=()
    case "$ptype" in
        node)   lang_label="Node.js / TypeScript"; find_expr=(-name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx') ;;
        rust)   lang_label="Rust";                 find_expr=(-name '*.rs') ;;
        go)     lang_label="Go";                   find_expr=(-name '*.go') ;;
        python) lang_label="Python";               find_expr=(-name '*.py') ;;
        *)      lang_label="Unknown" ;;
    esac

    # Top-level directory structure (excluding noise dirs)
    local top
    top=$(cd "$PROJECT_ROOT" 2>/dev/null && ls -d */ 2>/dev/null \
        | grep -vE '^(node_modules|\.git|dist|build|target|vendor|__pycache__|\.venv|coverage)/' \
        | head -30)

    # Representative source files for the detected language (bounded)
    local sources=""
    if [ "${#find_expr[@]}" -gt 0 ]; then
        sources=$(cd "$PROJECT_ROOT" 2>/dev/null && find . \( "${find_expr[@]}" \) \
            -not -path '*/node_modules/*' -not -path '*/.git/*' \
            -not -path '*/dist/*' -not -path '*/build/*' \
            -not -path '*/target/*' -not -path '*/vendor/*' \
            -not -path '*/__pycache__/*' -not -path '*/.venv/*' \
            2>/dev/null | sed 's|^\./||' | head -40)
    fi

    printf 'Detected project type: %s\n\nTop-level structure:\n%s\n\nRepresentative source files:\n%s\n' \
        "$lang_label" "${top:-(none)}" "${sources:-(none detected)}"
}

# =============================================================================
# Feature Domain Classification (frontend / backend / fullstack)
# =============================================================================

# Auto-detect the feature domain for a story so the design phase can apply the
# right planning lens. Resolution order (all automatic):
#   1. An explicit Type:/Domain:/Feature-Type: field in the story file
#   2. Heuristic keyword scoring of the story content
#   3. Default to "fullstack" (the superset) when ambiguous - fail safe so we
#      never under-plan a story.
# Returns one of: frontend | backend | fullstack
classify_feature_domain() {
    local story_file="$1"

    # 1. Explicit metadata field in the story (highest confidence, still auto)
    local meta
    meta=$(grep -iE '^(Type|Domain|Feature[ _-]?Type)[[:space:]]*:' "$story_file" 2>/dev/null | head -1 | tr '[:upper:]' '[:lower:]')
    case "$meta" in
        *fullstack*|*full-stack*|*full\ stack*) echo "fullstack"; return ;;
        *frontend*|*front-end*|*ui*|*ux*)       echo "frontend"; return ;;
        *backend*|*back-end*|*api*|*server*)    echo "backend"; return ;;
    esac

    # 2. Heuristic keyword scoring on story content
    local content
    content=$(cat "$story_file" 2>/dev/null)

    local fe be
    fe=$(printf '%s' "$content" | grep -ioE '\b(component|components|page|pages|screen|view|button|form|modal|dialog|css|tailwind|stylesheet|layout|responsive|render|UI|UX|accessibility|a11y|frontend|front-end|click|hover|route|router|navigation|nav)\b' 2>/dev/null | wc -l | tr -d ' ')
    be=$(printf '%s' "$content" | grep -ioE '\b(endpoint|endpoints|API|REST|GraphQL|controller|service|repository|schema|migration|migrations|database|query|queries|SQL|model|models|auth|authentication|authorization|token|queue|job|cron|webhook|backend|back-end|server)\b' 2>/dev/null | wc -l | tr -d ' ')

    fe=${fe:-0}; be=${be:-0}
    local threshold=2

    # One side clearly dominant -> that domain; otherwise fail safe to fullstack
    if [ "$fe" -ge "$threshold" ] && [ "$be" -lt "$threshold" ]; then
        echo "frontend"
    elif [ "$be" -ge "$threshold" ] && [ "$fe" -lt "$threshold" ]; then
        echo "backend"
    else
        echo "fullstack"
    fi
}

# Build the planning-lens prompt block for a domain. The lens tells the planner
# which domain-specific questions it MUST answer (states, a11y, API contract,
# error handling, etc). Fullstack injects both lenses.
# Arguments:
#   $1 - domain (frontend | backend | fullstack)
build_lens_block() {
    local domain="$1"

    local fe_lens="## Frontend Planning Lens

This story involves UI. Your plan MUST address these in the \"frontend\" object:
- Component breakdown: which components are new vs reused from the design system
- Every interactive component's states: loading, empty, error, success, disabled
- Accessibility: keyboard navigation, ARIA, focus management, color contrast
- Responsive behavior across breakpoints
- Which existing design-system components/tokens to reuse (do not reinvent)"

    local be_lens="## Backend Planning Lens

This story involves backend logic. Your plan MUST address these in the \"backend\" object:
- API contract: method, path, request/response shape, and status codes
- Data model and any migrations (and whether they are reversible)
- Error handling and failure modes for each state-changing operation
- Concurrency / idempotency / transactions where state changes
- Observability: what to log and which metrics to emit
- Backward compatibility / versioning"

    case "$domain" in
        frontend) printf '%s\n' "$fe_lens" ;;
        backend)  printf '%s\n' "$be_lens" ;;
        *)        printf '%s\n\n%s\n\n%s\n' \
                    "This story spans BOTH the UI and backend tiers - address both lenses." \
                    "$fe_lens" "$be_lens" ;;
    esac
}

# Build the domain-specific JSON schema fragment to inject into the plan schema.
# Arguments:
#   $1 - domain (frontend | backend | fullstack)
build_domain_schema() {
    local domain="$1"

    local fe_schema="  \"frontend\": {
    \"components\": [{\"name\": \"...\", \"new_or_existing\": \"new|existing\", \"states\": [\"loading\",\"empty\",\"error\",\"success\",\"disabled\"]}],
    \"user_flows\": [\"...\"],
    \"accessibility\": [\"...\"],
    \"responsive\": [\"...\"],
    \"design_system_usage\": [\"...\"]
  },"

    local be_schema="  \"backend\": {
    \"api_contract\": [{\"method\": \"...\", \"path\": \"...\", \"request\": \"...\", \"response\": \"...\", \"status_codes\": [\"...\"]}],
    \"data_model\": [\"...\"],
    \"migrations\": [\"...\"],
    \"error_handling\": [\"...\"],
    \"concurrency\": [\"...\"],
    \"observability\": [\"...\"],
    \"backward_compatibility\": [\"...\"]
  },"

    case "$domain" in
        frontend) printf '%s\n' "$fe_schema" ;;
        backend)  printf '%s\n' "$be_schema" ;;
        *)        printf '%s\n%s\n' "$fe_schema" "$be_schema" ;;
    esac
}

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

    # Pre-compute a deterministic, language-aware repository map (#5)
    local repo_map=""
    if type build_repo_map >/dev/null 2>&1; then
        repo_map=$(build_repo_map)
    fi

    # Auto-detect the feature domain and build the matching planning lens +
    # schema fragment (frontend / backend / fullstack). Fails safe to fullstack.
    local domain
    domain=$(classify_feature_domain "$story_file")
    log "Design domain for $story_id: $domain"
    local lens_block
    lens_block=$(build_lens_block "$domain")
    local domain_schema
    domain_schema=$(build_domain_schema "$domain")

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute design phase for $story_id (domain: $domain)"
        return 0
    fi

    # Critic loop (#4): generate a plan, have a fresh-context critic check it
    # against the ACs and architecture, and regenerate with feedback if gaps
    # remain. Design is advisory, so we always proceed with the best plan.
    local max_attempts="${MAX_DESIGN_CRITIC_ATTEMPTS:-2}"
    local attempt=1
    local feedback=""
    local json=""

    while true; do
        # Revision block is empty on the first pass, populated by the critic
        local revision_block=""
        if [ -n "$feedback" ]; then
            revision_block="## Revision Required

A previous version of this plan was reviewed and found incomplete. Produce an
improved plan that resolves ALL of the following gaps:

<gaps>
$feedback
</gaps>
"
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

## Repository Map

Use this pre-computed map of the codebase as your starting point, then explore
further (read the listed files, find similar implementations) before planning.
Follow existing patterns rather than introducing new ones.

<repo-map>
$repo_map
</repo-map>

## Feature Domain: $domain

$lens_block

${revision_block}## Required Output

Output your implementation plan as a single JSON result block. Map EVERY
acceptance criterion in the story to the files/functions that will implement
it - the \"ac\" field must use the exact AC identifier from the story (e.g.
\"AC1\", \"AC2\"). Set \"feature_type\" to \"$domain\" (correct it only if the
story clearly belongs to a different domain) and fill the matching domain
object(s).

\`\`\`json
{
  \"status\": \"COMPLETE\",
  \"story_id\": \"$story_id\",
  \"feature_type\": \"$domain\",
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
$domain_schema
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

        # Pipe to file to avoid memory bloat
        run_claude_to_file "$design_prompt"
        local result
        result=$(read_phase_tail)

        # Extract the JSON plan using the shared parser (falls back to legacy
        # text scraping if no JSON block is present, e.g. older models).
        json=""
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

        # Prefer the model's emitted feature_type (it has seen the code) over
        # the heuristic; fall back to the heuristic domain.
        local effective_domain="$domain"
        if [ -n "$json" ] && type get_result_feature_type >/dev/null 2>&1; then
            local model_ft
            model_ft=$(get_result_feature_type "$json" | tr '[:upper:]' '[:lower:]')
            case "$model_ft" in
                frontend|backend|fullstack) effective_domain="$model_ft" ;;
            esac
        fi

        # Critic disabled or no attempts budgeted - accept the first plan
        if [ "${SKIP_DESIGN_CRITIC:-false}" = true ] || [ "$max_attempts" -le 0 ]; then
            break
        fi

        # Run the critic against the plan (domain-aware)
        run_design_critic "$story_file" "$story_id" "$arch_file" "$LAST_DESIGN" "$effective_domain"
        local verdict=$?

        if [ "$verdict" -ne 1 ]; then
            # Approved (0) or unclear (2) - accept the current plan
            if [ "$verdict" -eq 2 ]; then
                log_warn "Design critic result unclear for $story_id - accepting current plan"
            elif [ "$VERBOSE" = true ]; then
                log "Design critic approved the plan: $story_id"
            fi
            break
        fi

        # verdict == 1: revision requested
        if [ -z "$DESIGN_CRITIC_GAPS" ]; then
            log_warn "Design critic requested revision but listed no actionable gaps - proceeding"
            break
        fi

        if [ "$attempt" -ge "$max_attempts" ]; then
            log_warn "Design still has gaps after $attempt critic attempt(s) for $story_id - proceeding with documented gaps"
            if type add_metrics_issue >/dev/null 2>&1; then
                add_metrics_issue "$story_id" "design_critic_gaps" "Unresolved design gaps after $attempt critic attempt(s)"
            fi
            break
        fi

        log_warn "Design critic requested revisions (attempt $attempt of $max_attempts) for $story_id - regenerating plan"
        feedback="$DESIGN_CRITIC_GAPS"
        attempt=$((attempt + 1))
    done

    # Persist the plan to a per-story file so the dev phase can read it
    # even after a resume (when the in-memory LAST_DESIGN is empty).
    persist_design "$story_id" "$LAST_DESIGN"

    # Validate that every acceptance criterion is mapped (advisory warning).
    validate_design_coverage "$story_file" "$story_id" "$json"

    # Validate domain-specific completeness (advisory; the critic enforces).
    validate_domain_completeness "$story_id" "$effective_domain" "$json"

    # Save to decision log
    if type append_to_decision_log >/dev/null 2>&1; then
        append_to_decision_log "DESIGN" "$story_id" "$LAST_DESIGN"
    fi

    log_success "Design phase complete: $story_id"
    return 0
}

# Run a fresh-context critic pass over a proposed design plan (#4).
# The critic checks: (a) does the plan map every acceptance criterion, (b) does
# it conform to the architecture, and (c) is it complete for its feature domain.
# Gaps are stored in DESIGN_CRITIC_GAPS for feedback into a regeneration pass.
# Arguments:
#   $1 - story_file path
#   $2 - story_id
#   $3 - architecture file path (may be empty)
#   $4 - the proposed plan (JSON or text)
#   $5 - feature domain (frontend | backend | fullstack)
# Returns: 0 approved, 1 needs revision, 2 unclear
run_design_critic() {
    local story_file="$1"
    local story_id="$2"
    local arch_file="$3"
    local plan="$4"
    local domain="${5:-fullstack}"

    DESIGN_CRITIC_GAPS=""

    local story_contents
    story_contents=$(cat "$story_file")

    # Domain-specific completeness checks the critic must enforce
    local domain_checks=""
    case "$domain" in
        frontend) domain_checks="- Every interactive component enumerates ALL of its states (loading, empty, error, success, disabled)
- Accessibility is addressed (keyboard navigation, ARIA, focus management, contrast)
- Responsive behavior is specified" ;;
        backend)  domain_checks="- Every state-changing operation has an explicit error path AND defined status codes
- Data-model / migration impact is covered (and migration reversibility noted)
- Concurrency / idempotency is addressed where state changes" ;;
        *)        domain_checks="- (Frontend) every interactive component enumerates ALL states (loading/empty/error/success/disabled); accessibility and responsive behavior are addressed
- (Backend) every state-changing operation has an explicit error path and defined status codes; data-model/migration impact is covered" ;;
    esac

    local critic_prompt="You are a skeptical senior engineer reviewing an implementation PLAN before any code is written.

## Your Task

Critique the proposed plan for story: $story_id (feature domain: $domain)

You are reviewing a PLAN, not code. Be rigorous. Decide whether the plan:
1. Maps EVERY acceptance criterion in the story to concrete files/functions
2. Conforms to the project's architecture
3. Is concrete and actionable (no vague hand-waving)
4. Is COMPLETE for its feature domain (see Domain Completeness below)

## Story

<story>
$story_contents
</story>

## Architecture Reference

**Read the architecture document at:** ${arch_file:-"(none found)"}

## Proposed Plan

<plan>
$plan
</plan>

## Domain Completeness (feature domain: $domain)

Treat any of the following that is missing as a NEEDS_REVISION gap:
$domain_checks

## Required Output

Output a single JSON result block:

\`\`\`json
{
  \"status\": \"APPROVED\" | \"NEEDS_REVISION\",
  \"story_id\": \"$story_id\",
  \"gaps\": [
    {\"issue\": \"<what is missing or wrong>\", \"recommendation\": \"<how to fix it>\"}
  ]
}
\`\`\`

Use APPROVED only if the plan covers every acceptance criterion, conforms to the
architecture, AND is complete for its feature domain. Otherwise use
NEEDS_REVISION and list specific, actionable gaps.

## Completion Signal

After the JSON block, output exactly one of:
DESIGN CRITIC APPROVED: $story_id
DESIGN CRITIC NEEDS_REVISION: $story_id"

    log_prompt_size "$critic_prompt" "design-critic"

    run_claude_to_file "$critic_prompt"
    local result
    result=$(read_phase_tail)

    # Parse verdict + gaps (JSON first, text fallback)
    local status=""
    local cjson=""
    if type extract_json_result >/dev/null 2>&1; then
        cjson=$(extract_json_result "$result")
    fi

    if [ -n "$cjson" ] && command -v jq >/dev/null 2>&1; then
        status=$(echo "$cjson" | jq -r '.status // empty' | tr '[:lower:]' '[:upper:]')
        DESIGN_CRITIC_GAPS=$(echo "$cjson" | jq -r '.gaps[]? | "- \(.issue) -> \(.recommendation)"' 2>/dev/null || echo "")
    fi

    # Text fallback if JSON missing/unparseable
    if [ -z "$status" ]; then
        if echo "$result" | grep -q "DESIGN CRITIC APPROVED"; then
            status="APPROVED"
        elif echo "$result" | grep -q "DESIGN CRITIC NEEDS_REVISION"; then
            status="NEEDS_REVISION"
        fi
    fi

    case "$status" in
        APPROVED)       return 0 ;;
        NEEDS_REVISION) return 1 ;;
        *)              return 2 ;;
    esac
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

# Validate domain-specific completeness of the plan (advisory; the critic is the
# enforcing gate). Warns + records a metric for the most common omissions:
# frontend components missing their states, and backend APIs without an error
# path. Skips cleanly without a JSON plan or jq.
# Arguments:
#   $1 - story_id
#   $2 - feature domain (frontend | backend | fullstack)
#   $3 - JSON plan (may be empty)
validate_domain_completeness() {
    local story_id="$1"
    local domain="$2"
    local json="$3"

    if [ -z "$json" ] || ! command -v jq >/dev/null 2>&1; then
        return 0
    fi

    # Frontend: every interactive component should enumerate its states
    if [ "$domain" = "frontend" ] || [ "$domain" = "fullstack" ]; then
        local comp_count states_missing
        comp_count=$(echo "$json" | jq '[.frontend.components[]?] | length' 2>/dev/null || echo 0)
        comp_count=$(echo "$comp_count" | tr -d '[:space:]'); [ -z "$comp_count" ] && comp_count=0
        if [ "$comp_count" -gt 0 ]; then
            states_missing=$(echo "$json" | jq '[.frontend.components[]? | select((.states | length) == 0)] | length' 2>/dev/null || echo 0)
            states_missing=$(echo "$states_missing" | tr -d '[:space:]'); [ -z "$states_missing" ] && states_missing=0
            if [ "$states_missing" -gt 0 ]; then
                log_warn "Design: $states_missing frontend component(s) missing states for $story_id"
                type add_metrics_issue >/dev/null 2>&1 && add_metrics_issue "$story_id" "design_domain_incomplete" "$states_missing FE component(s) missing states"
            fi
        fi
    fi

    # Backend: an API contract without any error handling is a red flag
    if [ "$domain" = "backend" ] || [ "$domain" = "fullstack" ]; then
        local api_count err_count
        api_count=$(echo "$json" | jq '[.backend.api_contract[]?] | length' 2>/dev/null || echo 0)
        api_count=$(echo "$api_count" | tr -d '[:space:]'); [ -z "$api_count" ] && api_count=0
        err_count=$(echo "$json" | jq '[.backend.error_handling[]?] | length' 2>/dev/null || echo 0)
        err_count=$(echo "$err_count" | tr -d '[:space:]'); [ -z "$err_count" ] && err_count=0
        if [ "$api_count" -gt 0 ] && [ "$err_count" -eq 0 ]; then
            log_warn "Design: backend API planned without error handling for $story_id"
            type add_metrics_issue >/dev/null 2>&1 && add_metrics_issue "$story_id" "design_domain_incomplete" "Backend API without error_handling"
        fi
    fi

    return 0
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

# Build a focused "planned test files" context block from the design plan (#7).
# Lets the TDD test-spec phase reuse the test files the design already proposed,
# rather than independently deciding the test surface. Reads the in-memory plan
# first, then the persisted file (resume-safe). Requires a JSON plan + jq.
# Arguments:
#   $1 - story_id
build_planned_test_files_context() {
    local story_id="$1"

    local design="$LAST_DESIGN"
    if [ -z "$design" ] && [ -n "${DESIGN_DIR:-}" ]; then
        local design_file="$DESIGN_DIR/${story_id}-design.md"
        [ -f "$design_file" ] && design=$(cat "$design_file")
    fi

    if [ -z "$design" ] || ! command -v jq >/dev/null 2>&1; then
        echo ""
        return
    fi

    local files
    files=$(echo "$design" | jq -r '.test_files[]? | "- \(.path): \(.covers)"' 2>/dev/null || echo "")

    if [ -z "$files" ]; then
        echo ""
        return
    fi

    # Domain-aware hint on which kinds of tests to emphasize (#7 + domain)
    local feature_type test_hint=""
    feature_type=$(echo "$design" | jq -r '.feature_type // empty' 2>/dev/null || echo "")
    case "$feature_type" in
        frontend)  test_hint="This is a frontend feature: emphasize component, interaction, and accessibility tests (plus visual regression where applicable)." ;;
        backend)   test_hint="This is a backend feature: emphasize unit, integration, contract, and migration tests." ;;
        fullstack) test_hint="This is a fullstack feature: cover both UI (component/interaction/a11y) and backend (unit/integration/contract) tests." ;;
    esac

    cat << EOF

## Planned Test Files (from design phase)

The design phase already identified the intended test files below. Align your
specifications with these paths and reuse them; only introduce a new test file
when a scenario genuinely isn't covered here, and call out any deviation.
${test_hint:+
$test_hint}

<planned-test-files>
$files
</planned-test-files>
EOF
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
