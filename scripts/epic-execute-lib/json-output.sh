#!/bin/bash
#
# BMAD Epic Execute - JSON Output Module
#
# Provides functions for structured JSON output parsing to replace
# fragile regex-based completion signal detection.
#
# Usage: Sourced by epic-execute.sh
#

# =============================================================================
# JSON Output Variables
# =============================================================================

# Whether to use legacy text-based parsing instead of JSON
USE_LEGACY_OUTPUT=false

# Last extracted JSON result (for reuse within a phase)
LAST_JSON_RESULT=""

# =============================================================================
# JSON Output Functions
# =============================================================================

# Extract JSON result block from Claude output
# Looks for ```json ... ``` or ```result ... ``` blocks
# Uses awk for more robust extraction (handles multiple blocks, nested backticks)
# Arguments:
#   $1 - Full Claude output
# Returns: JSON string or empty if not found
extract_json_result() {
    local output="$1"

    # Reset last result
    LAST_JSON_RESULT=""

    local json_block=""

    # Method 1: Extract last ```json block using awk (handles multiple blocks)
    # This is more robust than sed for complex outputs
    json_block=$(echo "$output" | awk '
        /```json/ { capture=1; content=""; next }
        /```/ && capture { last=content; capture=0; next }
        capture { content = content (content ? "\n" : "") $0 }
        END { print last }
    ')

    # Method 2: Fallback to ```result block
    if [ -z "$json_block" ]; then
        json_block=$(echo "$output" | awk '
            /```result/ { capture=1; content=""; next }
            /```/ && capture { last=content; capture=0; next }
            capture { content = content (content ? "\n" : "") $0 }
            END { print last }
        ')
    fi

    # Method 3: Legacy sed approach (simpler cases)
    if [ -z "$json_block" ]; then
        json_block=$(echo "$output" | sed -n '/```json/,/```/p' | sed '1d;$d')
    fi

    # Method 4: Find standalone JSON object with status field
    if [ -z "$json_block" ]; then
        # Look for JSON object pattern {"status": ...} - capture full object
        json_block=$(echo "$output" | grep -oE '\{[^{}]*"status"[^{}]*\}' | tail -1)
    fi

    # Validate JSON if jq is available
    if [ -n "$json_block" ]; then
        if command -v jq >/dev/null 2>&1; then
            if echo "$json_block" | jq . >/dev/null 2>&1; then
                LAST_JSON_RESULT="$json_block"
                echo "$json_block"
                return 0
            else
                # JSON invalid - try to extract just the status object
                local simple_json
                simple_json=$(echo "$json_block" | jq -c '{status: .status, story_id: .story_id, summary: .summary}' 2>/dev/null || echo "")
                if [ -n "$simple_json" ]; then
                    LAST_JSON_RESULT="$simple_json"
                    echo "$simple_json"
                    return 0
                fi
            fi
        else
            # jq not available, return raw block
            LAST_JSON_RESULT="$json_block"
            echo "$json_block"
            return 0
        fi
    fi

    echo ""
    return 1
}

# Get the status field from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: Status string (COMPLETE, BLOCKED, FAILED, PASSED, etc.)
get_result_status() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.status // empty'
    else
        # Fallback: basic pattern matching
        echo "$json" | grep -oE '"status":\s*"[^"]+"' | sed 's/.*"\([^"]*\)"$/\1/'
    fi
}

# Get the story_id field from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
get_result_story_id() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.story_id // empty'
    else
        echo "$json" | grep -oE '"story_id":\s*"[^"]+"' | sed 's/.*"\([^"]*\)"$/\1/'
    fi
}

# Get the feature_type field from a JSON result (design phase)
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: frontend | backend | fullstack (or empty if not present)
get_result_feature_type() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.feature_type // empty'
    else
        echo "$json" | grep -oE '"feature_type":\s*"[^"]+"' | sed 's/.*"\([^"]*\)"$/\1/'
    fi
}

# Get the summary field from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
get_result_summary() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.summary // empty'
    else
        echo "$json" | grep -oE '"summary":\s*"[^"]+"' | sed 's/.*"\([^"]*\)"$/\1/'
    fi
}

# Get the files_changed array from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: Newline-separated list of file paths
get_result_files() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.files_changed[]? // empty'
    else
        # Fallback: basic pattern matching (limited)
        echo "$json" | grep -oE '"files_changed":\s*\[[^\]]*\]' | grep -oE '"[^"]+\.[a-z]+"' | tr -d '"'
    fi
}

# Get the concerns array from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: Newline-separated list of concerns
get_result_concerns() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.concerns[]? // empty'
    else
        echo ""
    fi
}

# Get the issues array from a JSON result (for review/fix phases)
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: JSON array of issues or empty
get_result_issues() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo ""
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -c '.issues // []'
    else
        echo "[]"
    fi
}

# Get the tests_added count from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: Number of tests added
get_result_tests_added() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo "0"
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r '.tests_added // 0'
    else
        echo "$json" | grep -oE '"tests_added":\s*[0-9]+' | grep -oE '[0-9]+' || echo "0"
    fi
}

# Get the decisions array from a JSON result
# Arguments:
#   $1 - JSON string (optional, uses LAST_JSON_RESULT if not provided)
# Returns: JSON array of decisions
get_result_decisions() {
    local json="${1:-$LAST_JSON_RESULT}"

    if [ -z "$json" ]; then
        echo "[]"
        return 1
    fi

    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -c '.decisions // []'
    else
        echo "[]"
    fi
}

# Check phase completion with JSON parsing and text fallback
# Arguments:
#   $1 - Full Claude output
#   $2 - Phase type (dev, review, fix, arch, test_quality, trace, uat)
#   $3 - Story ID (for legacy text matching)
# Returns: 0 if complete/passed, 1 if failed/blocked, 2 if unclear
check_phase_completion() {
    local output="$1"
    local phase_type="$2"
    local story_id="$3"

    # Try JSON parsing first (unless legacy mode)
    if [ "$USE_LEGACY_OUTPUT" != true ]; then
        local json_result
        json_result=$(extract_json_result "$output")

        if [ -n "$json_result" ]; then
            local status
            status=$(get_result_status "$json_result")

            # Normalize status to uppercase for comparison
            status=$(echo "$status" | tr '[:lower:]' '[:upper:]')

            case "$status" in
                COMPLETE|PASSED|COMPLIANT|APPROVED|SUCCESS|DONE|OK)
                    return 0
                    ;;
                BLOCKED|FAILED|VIOLATIONS|ERROR|INCOMPLETE|REJECTED)
                    return 1
                    ;;
                CONCERNS)
                    # Concerns typically don't block for test_quality and trace
                    if [ "$phase_type" = "test_quality" ] || [ "$phase_type" = "trace" ]; then
                        return 0
                    fi
                    return 1
                    ;;
            esac
        fi
    fi

    # Try fuzzy matching from utils module if available (M3 improvement)
    if type check_phase_completion_fuzzy >/dev/null 2>&1; then
        check_phase_completion_fuzzy "$output" "$phase_type" "$story_id"
        local fuzzy_result=$?
        if [ $fuzzy_result -ne 2 ]; then
            return $fuzzy_result
        fi
    fi

    # Fallback to legacy text-based parsing
    case "$phase_type" in
        design)
            if echo "$output" | grep -q "DESIGN COMPLETE"; then
                return 0
            elif echo "$output" | grep -q "DESIGN BLOCKED"; then
                return 1
            fi
            ;;
        dev)
            if echo "$output" | grep -q "IMPLEMENTATION COMPLETE"; then
                return 0
            elif echo "$output" | grep -q "IMPLEMENTATION BLOCKED"; then
                return 1
            fi
            ;;
        review)
            if echo "$output" | grep -q "REVIEW PASSED"; then
                return 0
            elif echo "$output" | grep -q "REVIEW FAILED"; then
                return 1
            fi
            ;;
        fix)
            if echo "$output" | grep -q "FIX COMPLETE"; then
                return 0
            elif echo "$output" | grep -q "FIX INCOMPLETE"; then
                return 1
            fi
            ;;
        arch)
            if echo "$output" | grep -q "ARCH COMPLIANT"; then
                return 0
            elif echo "$output" | grep -q "ARCH VIOLATIONS"; then
                return 1
            fi
            ;;
        test_quality)
            if echo "$output" | grep -q "TEST QUALITY APPROVED"; then
                return 0
            elif echo "$output" | grep -q "TEST QUALITY FAILED"; then
                return 1
            elif echo "$output" | grep -q "TEST QUALITY CONCERNS"; then
                # Concerns don't block
                return 0
            fi
            ;;
        trace)
            if echo "$output" | grep -q "TRACEABILITY PASS"; then
                return 0
            elif echo "$output" | grep -q "TRACEABILITY FAIL"; then
                return 1
            elif echo "$output" | grep -q "TRACEABILITY CONCERNS"; then
                return 0
            fi
            ;;
        uat)
            if echo "$output" | grep -q "UAT GENERATED"; then
                return 0
            fi
            ;;
        test_gen)
            if echo "$output" | grep -q "TEST GENERATION COMPLETE"; then
                return 0
            elif echo "$output" | grep -q "TEST GENERATION PARTIAL"; then
                return 1
            fi
            ;;
    esac

    # Unclear result
    return 2
}

# Build JSON output instruction block for prompts
# Arguments:
#   $1 - Phase type (dev, review, fix, arch, test_quality, trace, uat)
#   $2 - Story ID
# Returns: Instruction text for prompts
build_json_output_instructions() {
    local phase_type="$1"
    local story_id="$2"

    cat << 'EOF'

## Output Format

After completing your task, output a JSON result block:

```json
{
  "status": "COMPLETE" | "BLOCKED" | "FAILED" | "PASSED" | "VIOLATIONS" | "CONCERNS",
  "story_id": "<story id>",
  "summary": "<brief description of what was done>",
  "files_changed": ["<path1>", "<path2>"],
  "tests_added": <number>,
  "decisions": [
    {"what": "<decision made>", "why": "<reasoning>"}
  ],
  "issues": [
    {"severity": "HIGH|MEDIUM|LOW", "description": "<issue>", "location": "<file:line>"}
  ],
  "concerns": ["<any concerns or warnings>"]
}
```

### Status Values by Phase
EOF

    case "$phase_type" in
        dev)
            cat << EOF

- **COMPLETE**: Implementation finished successfully
- **BLOCKED**: Cannot proceed due to missing dependencies or unclear requirements

Then ALSO output the legacy signal for backward compatibility:
- Success: \`IMPLEMENTATION COMPLETE: $story_id\`
- Blocked: \`IMPLEMENTATION BLOCKED: $story_id - [reason]\`
EOF
            ;;
        review)
            cat << EOF

- **PASSED**: Code review passed (all issues fixed or acceptable)
- **FAILED**: Critical issues remain that need developer attention

Then ALSO output the legacy signal for backward compatibility:
- Pass: \`REVIEW PASSED: $story_id\`
- Fail: \`REVIEW FAILED: $story_id - [reason]\`
EOF
            ;;
        fix)
            cat << EOF

- **COMPLETE**: All issues from review have been fixed
- **FAILED**: Unable to fix one or more issues

Then ALSO output the legacy signal for backward compatibility:
- Complete: \`FIX COMPLETE: $story_id - Fixed N issues\`
- Incomplete: \`FIX INCOMPLETE: $story_id - [reason]\`
EOF
            ;;
        arch)
            cat << EOF

- **COMPLIANT**: No architecture violations (or all fixed)
- **VIOLATIONS**: Architecture violations that need attention

Then ALSO output the legacy signal for backward compatibility:
- Compliant: \`ARCH COMPLIANT: $story_id\`
- Violations: \`ARCH VIOLATIONS: $story_id - [summary]\`
EOF
            ;;
        test_quality)
            cat << EOF

- **APPROVED**: Test quality meets standards (score >= 70)
- **CONCERNS**: Minor quality issues (score 60-69)
- **FAILED**: Test quality below acceptable threshold (score < 60)

Then ALSO output the legacy signal for backward compatibility:
- Approved: \`TEST QUALITY APPROVED: $story_id - Score: N/100\`
- Concerns: \`TEST QUALITY CONCERNS: $story_id - Score: N/100\`
- Failed: \`TEST QUALITY FAILED: $story_id - Score: N/100\`
EOF
            ;;
        trace)
            cat << EOF

- **PASSED**: Traceability requirements met (P0=100%, P1>=90%)
- **CONCERNS**: Minor gaps (P1 80-89%)
- **FAILED**: Critical traceability gaps

Then ALSO output the legacy signal for backward compatibility:
- Pass: \`TRACEABILITY PASS: Epic-$story_id - P0: N%, P1: M%\`
- Fail: \`TRACEABILITY FAIL: Epic-$story_id - X critical gaps\`
EOF
            ;;
        uat)
            cat << EOF

- **COMPLETE**: UAT document generated successfully

Then ALSO output the legacy signal: \`UAT GENERATED: <path>\`
EOF
            ;;
    esac
}
